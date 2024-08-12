// https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB
const DELAY = 300;

const OLD_CACHE_KEY = 'cache-summaries';
const CACHE_KEY = 'cache-summaries-1';
localStorage.removeItem(OLD_CACHE_KEY);
const shortTermCache = JSON.parse( localStorage.getItem( 'cache-short' ) || '{}' );
const summaryCache = JSON.parse( localStorage.getItem(CACHE_KEY) || '{}' );

// A week cache is fine.
const CACHE_TIME = 7 * 24 * 60 * 60;

const pruneCache = () => {
    const keys = Object.keys( shortTermCache );
    if ( keys.length > 50 ) {
        keys.slice( 0, 50 ).forEach(( key ) => {
            delete shortTermCache[key];
        } );
    }
};

let status = '31st December';
const cacheFetch = ( url ) => {
    return new Promise( ( resolve, reject ) => {
        const cached = shortTermCache[url];
        if ( cached ) {
            setTimeout( () => {
                resolve(JSON.parse(cached));
            }, DELAY);
        }
        fetch(url).then((r) => r.json())
            .then((json)=> {
                if ( !json.error ) {
                    shortTermCache[url] = json;
                    try {
                        localStorage.setItem('cache-short', JSON.stringify(shortTermCache));
                    } catch (e) {
                        pruneCache();
                        try {
                            localStorage.setItem('cache-short', JSON.stringify(shortTermCache));
                        } catch ( e ) {
                        }
                    }
                } else {
                    reject();
                }
                resolve(json);
        } );
    } );

};

const getDateSuffix = ( day ) => {
    if ( day === 1 ) {
        return 'st';
    } else if ( day === 2 ) {
        return 'nd';
    } else if ( day === 3 ) {
        return 'rd';
    } else {
        return 'th';
    }
}

const toDate = ( timestamp ) => {
    return new Date( timestamp );
};

const toReadableMonth = ( timestamp ) => {
    const date = toDate( timestamp );
    const m = date.getMonth();
    const months = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    return `${months[m]}`;
}

const continueFetch = ( url, params, list ) => {
    const q = new URLSearchParams( params ).toString()
    let result = [];
    return cacheFetch( `${url}?${q}` ).then( (r) => {
        result = result.concat(
            ( r.query[ list ] || [] ).filter(r=>r)
        );
        const c = result[result.length-1];
        if ( c ) {
            const d = toDate( c.timestamp );
            const day = d.getDate();
            const suffix = getDateSuffix( day );
            status = `${day}${suffix} ${toReadableMonth(c.timestamp)}`;
        }
        if ( r.continue ) {
            Object.keys( r.continue ).forEach( ( key ) => {
                params[key] = r.continue[key];
            } );
            return continueFetch(url, params, list).then( (r) => {
                return result.concat( r ).filter(r=>r);
            } );
        } else {
            return Promise.resolve( result )
        }
    })
};

const topArticles = (articles, field = 'title') => {
    const titles = {};
    articles.forEach((t) => {
        if ( titles[t[field]] === undefined ) {
            titles[t[field]] = 0;
        }
        titles[t[field]]++;
    });
    return Object.keys( titles )
        .map( ( title ) => ({ [field]: title, count: titles[title] }) )
        .sort((a,b) => a.count > b.count ? -1 : 1)
};

const thanksSummary = ( username, year, project ) => {
    return continueFetch(`https://${project}/w/api.php`, {
        leend: `${year - 1}-12-31T23:59:59.000Z`,
        maxage: CACHE_TIME,
        smaxage: CACHE_TIME,
        lestart: `${year + 1}-01-01T00:00:00.000Z`,
        lelimit: 500,
        origin: '*',
        action: 'query',
        format: 'json',
        formatversion: 2,
        list: 'logevents',
        letype: 'thanks',
        leuser: username
    }, 'logevents' ).then((thanks) => {
        return {
            topThanksTo: topArticles( thanks ).map((u) => Object.assign(u, {
                title: u.title.indexOf(':') > -1 ? u.title.split(':')[1] : u.title
            })),
            thanksCount: thanks.length
        };
    })
};

const thankedSummary = ( username, year, project ) => {
    return continueFetch(`https://${project}/w/api.php`, {
        leend: `${year - 1}-12-31T23:59:59.000Z`,
        lestart: `${year + 1}-01-01T00:00:00.000Z`,
        maxage: CACHE_TIME,
        smaxage: CACHE_TIME,
        lelimit: 500,
        origin: '*',
        action: 'query',
        format: 'json',
        formatversion: 2,
        list: 'logevents',
        letype: 'thanks',
        letitle: `User:${username}`
    }, 'logevents' ).then((thanks) => {
        return {
            topThanksFrom: topArticles( thanks, 'user' ),
            thankedCount: thanks.length
        };
    })
};

const addThumbs = ( titles ) => {
    return Promise.all(
        titles.map(
            ( t ) => fetch( `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(t)}`)
                .then((r) => r.json())
                .then((p)=>p.thumbnail)
        )
    );
}

const summarize = ( contribs ) => {
    const articles = contribs.filter((c) => c && c.ns === 0);
    const fileUploads = contribs.filter((c) => c && c.ns === 6).length;
    const top = topArticles(articles);
    const dayofweek = contribs.filter((c)=>c).map((c) => {
        const t = new Date( c.timestamp );
        return {
            day: t.getDay()
        };
    });
    const totalBytes = contribs.reduce((a, c) => {
        let s = (c.sizediff || 0 );
        if ( s < 0 ) {
            s = -s;
        }
        return a + s;
    }, 0 );
    const top5 = top.slice(0, 5);
    return addThumbs(top5.map((t) => t.title)).then((thumbs) => {
        return {
            thumbs,
            totalBytes,
            paragraphs: parseInt( totalBytes / 1000, 10 ),
            dayofweek: topArticles( dayofweek, 'day' ),
            top5,
            articlesNumber: top.length,
            totalEdits: contribs.length,
            fileUploads,
            articleEdits: articles.length,
            talkEdits: contribs.filter((c) => c && c.ns % 2 !== 0 ).length
        };
    });
};

const yir = ( username, year, project ) => {
    if ( !project.match( /[^\.]*\.(wikivoyage|wikinews|wikiversity|wikibooks|wikiquote|wiktionary|wikifunctions|wikisource|wikipedia|mediawiki|wikidata|wikimedia)\.org/ ) || !username.match(  /^[^:]*$/ ) ) {
        return Promise.reject();
    }
    const cacheKey = `${username}:${year}:${project}`;
    if ( summaryCache[cacheKey] ) {
        return Promise.resolve( summaryCache[cacheKey] );
    }
    return Promise.all( [
        thanksSummary( username, year, project ),
        thankedSummary( username, year, project ),
        continueFetch(`https://${project}/w/api.php`, {
            ucend: `${year - 1}-12-31T23:59:59.000Z`,
            ucstart: `${year + 1}-01-01T00:00:00.000Z`,
            uclimit: 500,
            origin: '*',
            action: 'query',
            format: 'json',
            formatversion: 2,
            list: 'usercontribs',
            formatversion: 2,
            ucuser: username,
            ucprop: 'title|timestamp|sizediff'
        }, 'usercontribs' ).then((r) => summarize(r) )
    ] ).then( ( results ) => {
        const summary = Object.assign.apply({},results);
        summary.year = year + 1;
        summary.project = project;
        summaryCache[cacheKey] = summary;
        localStorage.setItem(CACHE_KEY, JSON.stringify(summaryCache) );
        return summary;
    } );
}

yir.getStatus = () => {
    return status;
}
export default yir;


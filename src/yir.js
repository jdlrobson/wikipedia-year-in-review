// https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB
const DELAY = 300;

const shortTermCache = JSON.parse( localStorage.getItem( 'cache-short' ) || '{}' );
const summaryCache = JSON.parse( localStorage.getItem( 'cache-summaries' ) || '{}' );

const pruneCache = () => {
    keys = Object.keys( shortTermCache );
    if ( keys.length > 50 ) {
        keys.slice( 0, 10 ).forEach(( key ) => {
            delete shortTermCache[key];
        } );
    }
};

let status = 'December';
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
                        localStorage.setItem('cache-short', JSON.stringify(shortTermCache));
                    }
                } else {
                    reject();
                }
                resolve(json);
        } );
    } );

};


const toReadableMonth = ( timestamp ) => {
    const date = new Date( timestamp );
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
        status = toReadableMonth(c.timestamp);
        if ( r.continue ) {
            Object.keys( r.continue ).forEach( ( key ) => {
                params[key] = r.continue[key];
            } );
            return continueFetch(url, params, list).then( (r) => {
                return result.concat( r );
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
        .filter((t) => t.count > 1)
        .sort((a,b) => a.count > b.count ? -1 : 1)
};

const thanksSummary = ( username, year, project ) => {
    return continueFetch(`https://${project}/w/api.php`, {
        leend: `${year - 1}-12-31T23:59:59.000Z`,
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

const summarize = ( contribs ) => {
    const articles = contribs.filter((c) => c && c.ns === 0);
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
    return {
        // @todo: new pages?
        totalBytes,
        paragraphs: parseInt( totalBytes / 1000, 10 ),
        dayofweek: topArticles( dayofweek, 'day' ),
        top5: top.slice(0, 5),
        articlesNumber: top.length,
        totalEdits: contribs.length,
        articleEdits: articles.length,
        talkEdits: contribs.filter((c) => c && c.ns % 2 !== 0 ).length
    };
};

const yir = ( username, year, project ) => {
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
        summaryCache[cacheKey] = summary;
        localStorage.setItem( 'cache-summaries', JSON.stringify(summaryCache) );
        return summary;
    } );
}

yir.getStatus = () => {
    return status;
}
export default yir;

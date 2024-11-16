// https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB
const DELAY = 300;

const OLD_CACHE_KEY = 'cache-summaries';
const CACHE_KEY = 'cache-summaries-1';
let shortTermCache, summaryCache;
// localStorage may not be available if running in Node.js
try {
    localStorage.removeItem(OLD_CACHE_KEY);
    shortTermCache = JSON.parse( localStorage.getItem( 'cache-short' ) || '{}' );
    summaryCache = JSON.parse( localStorage.getItem(CACHE_KEY) || '{}' );
} catch ( e ) {
    shortTermCache = {};
    summaryCache = {};
}

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
/**
 * @param {string} url
 * @return {Promise<ApiRawResponse>}
 */
const cacheFetch = ( url ) => {
    return new Promise( ( resolve, reject ) => {
        const cached = shortTermCache[url];
        if ( cached ) {
            setTimeout( () => {
                resolve(typeof cached === 'string' ? JSON.parse(cached) : cached);
            }, DELAY);
            return;
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

/**
 * @param {number} day
 * @return {string}
 */
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

/**
 * @param {string} timestamp
 * @return {Date}
 */
const toDate = ( timestamp ) => {
    return new Date( timestamp );
};

/**
 * @param {string} timestamp
 * @return {string}
 */
const toReadableMonth = ( timestamp ) => {
    const date = toDate( timestamp );
    const m = date.getMonth();
    const months = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    return `${months[m]}`;
}

/**
 * @param {string} url
 * @param {Record<string, string>} params
 * @param {'logevents'|'usercontribs'} list
 * @param {ApiListObj[]} [result] defaults to empty array
 * @param {number|null} [maxQueries] limit the continue to a certain number of queries
 * @param {number} [numQueries] tracks the number of queries so far
 * @return {Promise<ApiListObj[]>}
 */
const continueFetch = ( url, params, list, result = [], maxQueries = null, numQueries = 0 ) => {
    const q = new URLSearchParams( params ).toString();
    return cacheFetch( `${url}?${q}` ).then( (r) => {
        result = result.concat(
            ( r.query[ list ] || [] )
                // @ts-ignore
                .filter((/** @type ApiListObj[] */r)=>r)
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
            if ( maxQueries && numQueries > maxQueries ) {
                return result;
            }
            // Check after 10 queries whether we have progressed beyond a day.
            // If we haven't its an indication we probably shouldn't continue.
            if ( numQueries > 10 && result.length ) {
                const lastResultDate = new Date( result[ result.length - 1 ].timestamp );
                const lastMonth = lastResultDate.getMonth();
                const lastDate = lastResultDate.getDate();
                if ( lastDate === 31 && lastMonth === 11 ) {
                    throw new Error( 'TOOMANYEDITS' );
                } else if ( lastDate === 1 && lastMonth === 0 ) {
                    throw new Error( 'TOOMANYEDITS' );
                }
            }
            return continueFetch(url, params, list, result, maxQueries, numQueries + 1 ).then( (/** @type ApiListObj[] */result2) => {
                return result.concat( result2 ).filter( p => p );
            } );
        } else {
            return Promise.resolve( result )
        }
    })
};

/**
 * @param {*} articles
 * @param {'title'|'user'|'day'} field
 * @return {YIRPage[]}
 */
const topArticles = (articles, field = 'title') => {
    const /** @type Record<string,number> */titles = {};
    // @ts-ignore
    articles.forEach((t) => {
        if ( titles[t[field]] === undefined ) {
            titles[t[field]] = 0;
        }
        titles[t[field]]++;
    });
    // @ts-ignore
    return Object.keys( titles )
        .map( ( title ) => ({ [field]: title, count: titles[title] }) )
        .sort((a,b) => a.count > b.count ? -1 : 1)
};

/**
 * @param {YIRDay[]} days
 * @return {YIRDay[]}
 */
const topDays = (days) => {
    // @ts-ignore
    /** @type YIRDay[] */const top = topArticles(days, 'day');
    return top;
};

/**
 * @param {YIRDay[]} days
 * @return {YIRTimeSlot[]}
 */
const topHours = (days) => {
    const /** @type Record<string,number> */timeslot = {};
    const slots = [ 0, 6, 10, 12, 14, 17, 22 ];
    slots.forEach( ( hour ) => timeslot[`${hour}`] = 0 );
    days.forEach((t) => {
        const hour = t.hour;
        let i = 0;
        while ( slots[ i ] < hour ) {
            i++;
        }
        if ( i >= slots.length ) {
            i = slots.length - 1;
        }
        timeslot[`${slots[i]}`]++;
    } );
    return Object.keys( timeslot )
        .map( ( hour ) => {
            let nextHourIndex = slots.indexOf( parseInt( hour, 10 ) ) + 1;
            if ( nextHourIndex >= slots.length ) {
                nextHourIndex = 0;
            }
            return {
                timespan: `${hour}:00 - ${slots[nextHourIndex]}:00`,
                count: timeslot[ hour ]
            };
        } )
        .sort((a,b) => a.count > b.count ? -1 : 1)
};

/**
 * @param {string} username
 * @param {number} year
 * @param {string} project
 * @return {Promise<YIRStatsThanks>}
 */
const thanksSummary = ( username, year, project ) => {
    return continueFetch(`https://${project}/w/api.php`, {
        leend: `${year - 1}-12-31T23:59:59.000Z`,
        maxage: `${CACHE_TIME}`,
        smaxage: `${CACHE_TIME}`,
        lestart: `${year + 1}-01-01T00:00:00.000Z`,
        lelimit: '500',
        origin: '*',
        action: 'query',
        format: 'json',
        formatversion: '2',
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

/**
 * @param {string} username
 * @param {number} year
 * @param {string} project
 * @return {Promise<YIRStatsThanked>}
 */
const thankedSummary = ( username, year, project ) => {
    return continueFetch(`https://${project}/w/api.php`, {
        leend: `${year - 1}-12-31T23:59:59.000Z`,
        lestart: `${year + 1}-01-01T00:00:00.000Z`,
        maxage: `${CACHE_TIME}`,
        smaxage: `${CACHE_TIME}`,
        lelimit: '500',
        origin: '*',
        action: 'query',
        format: 'json',
        formatversion: '2',
        list: 'logevents',
        letype: 'thanks',
        letitle: `User:${username}`
    }, 'logevents' ).then((/** @type {ApiListObj[]} */thanks) => {
        return {
            topThanksFrom: topArticles( thanks, 'user' ),
            thankedCount: thanks.length
        };
    })
};

/**
 * @param {string[]} titles
 * @return {Promise<YIRImage[]>}
 */
const addThumbs = ( titles ) => {
    return Promise.all(
        titles.map(
            ( t ) => fetch( `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(t)}`)
                .then((r) => r.json())
                .then((p)=>p.thumbnail)
        )
    );
}

/**
 * @param {ApiListObj[]} contribs
 * @return {Promise<YIRStatsContribs>}
 */
const summarize = ( contribs ) => {
    const articles = contribs.filter((c) => c && c.ns === 0);
    const fileUploads = contribs.filter((c) => c && c.ns === 6).length;
    const top = topArticles(articles);
    const contribDayofweek = contribs.filter((c)=>c).map((c) => {
        const t = new Date( c.timestamp );
        return {
            count: 0,
            hour: t.getHours(),
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
        const dayofweek = topDays( contribDayofweek );
        const hourofweek = topHours( contribDayofweek );
        return {
            thumbs,
            totalBytes,
            paragraphs: totalBytes / 1000,
            dayofweek,
            hourofweek,
            top5,
            articlesNumber: top.length,
            totalEdits: contribs.length,
            fileUploads,
            articleEdits: articles.length,
            pageEdits: contribs.filter(
                (/** @type {ApiListObj} */ c) => c && c.ns === 104
            ).length,
            interfaceEdits: contribs.filter(
                (/** @type {ApiListObj} */ c) => c && c.ns === 8
            ).length,
            templateEdits: contribs.filter(
                (/** @type {ApiListObj} */ c) => c && ( c.ns === 828 || c.ns === 10 )
            ).length,
            talkEdits: contribs.filter(
                (/** @type {ApiListObj} */ c) => c && c.ns % 2 !== 0
            ).length
        };
    });
};

/**
 * @param {string} username
 * @param {string|number} year
 * @param {string} project
 * @return {Promise<ApiListObj[]>}
 */
const loadUserCache = ( username, year, project ) => {
    return new Promise( ( resolve ) => {
        const userCacheUrl = `data/shortcut/${year}/${project}/${encodeURIComponent( username.replace( / /g, '_' ) )}.json`;
        fetch( userCacheUrl )
            .then( ( r ) => r.json() )
            .then( ( result ) => {
                resolve( result )
            }, () => {
                resolve( [] )
            } );
    } );
};

/**
 * @param {string} username
 * @param {number} year
 * @param {string} project
 * @param {ApiListObj[]} result
 * @param {number|null} [maxQueries]
 * @return {Promise<ApiListObj[]>}
 */
const resumeContributionsFetch = ( username, year, project, result, maxQueries = null ) => {
    let ucstart = null;
    if ( result.length ) {
        const date = new Date( result[result.length - 1].timestamp )
        date.setTime( date.getTime() + 1000 );
        ucstart = date.toISOString();
    }
    return continueFetch(`https://${project}/w/api.php`, {
        ucstart: ucstart || `${year - 1}-12-31T23:59:59.000Z`,
        ucend: `${year + 1}-01-01T00:00:00.000Z`,
        uclimit: '500',
        origin: '*',
        action: 'query',
        format: 'json',
        ucdir: 'newer',
        formatversion: '2',
        list: 'usercontribs',
        ucuser: username,
        ucprop: 'title|timestamp|sizediff'
    }, 'usercontribs', result, maxQueries );
}

/**
 * @param {string} username
 * @param {number} year
 * @param {string} project
 * @return {Promise<YIRStatsContribs>}
 */
const contributionsFetch = ( username, year, project ) => {
    // first check the local cache
    return loadUserCache( username, year, project ).then( ( result ) =>
            resumeContributionsFetch( username, year, project, result )
        .then((/** @type {ApiListObj[]} */r) => summarize(r) ) );
};

/**
 * @param {string} username
 * @param {number} year
 * @param {string} project
 * @return {Promise<YIRStats>}
 */
const yirRemoteFetch = ( username, year, project ) => {
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
        contributionsFetch( username, year, project )
    ] ).then( ( results ) => {
        const summary = Object.assign.apply( {}, results );
        summary.year = year + 1;
        summary.project = project;
        summaryCache[cacheKey] = summary;
        localStorage.setItem(CACHE_KEY, JSON.stringify(summaryCache) );
        return summary;
    } );
}

/**
 * @param {string} username
 * @param {number} year
 * @param {string} project
 * @return {Promise<YIRStats>}
 */
const yir = ( username, year, project ) => {
    return new Promise( ( resolve ) => {

        fetch( `data/shortcut/${year}/${project}/${encodeURIComponent( username.replace( / /g, '_' ) )}.summary.json` )
        .then( ( r ) => r.json() )
        .then(
            ( summary ) => resolve( summary ),
            () => {
                yirRemoteFetch( username, year, project ).then( ( summary ) => resolve( summary ) )
            } );
    } );
}

yir.getStatus = () => {
    return status;
}

yir.resumeContributionsFetch = resumeContributionsFetch;

export default yir;


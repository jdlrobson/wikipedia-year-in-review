import main from './main';
import habits from './habits';
import paragraphs from './paragraphs';
import topArticles from './topArticles';
import thanks from './thanks';
import talk from './talk';

/**
 * @param {YIRStats} stats
 * @return {YIRFact[]}
 */
function facts( stats ) {
    const year = stats.year;
    const project = stats.project;
    let pages = [];
    pages.push( main( stats, year, project ) )
    pages = pages.concat( paragraphs( stats ) );
    pages = pages.concat( habits( stats ) );
    pages = pages.concat( topArticles( stats, project ) );
    pages = pages.concat( talk( stats ) );
    pages = pages.concat( thanks( stats ) );
    return pages;
}

export default facts;

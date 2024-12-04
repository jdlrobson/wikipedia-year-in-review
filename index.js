import {createApp} from 'vue';
import i18n from './i18n';
import App from './src/App.vue';
import message from './src/message';

const language = navigator.language;

new Promise( ( resolve ) => {
    if ( language === 'en' || language === 'en-us' ) {
        resolve();
    } else {
        return message.setLanguage( language ).then( resolve );
    }
} ).then( (r) => {
    createApp(App)
       .use( i18n )
       .mount( '#app' );
}, (e) => {
    console.log(e);
} );


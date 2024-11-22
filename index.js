import {createApp} from 'vue';
import i18n from './i18n';
import App from './src/App.vue';
import message from './src/message';

createApp(App)
    .use( i18n )
    .mount( '#app' );

<template>
<div class="app-wrapper" :style="appStyle" :lang="language" :dir="languageDirection">
	<page v-if="currentPage <= 0 && !activePage">
		<img class="mainImg" src="https://upload.wikimedia.org/wikipedia/commons/e/ed/WP20Symbols_MediaWiki.svg" width="512" height="401">
		<h1>Wikipedia</h1>
		<h2>{{ $i18n( 'year-in-review', language ) }}</h2>
		<p class="intro">{{ $i18n( 'intro', language ) }}</p>
		<label>{{ $i18n( 'project-label', language ) }}</label>
		<cdx-text-input required
			pattern="[^\.]*\.(wikivoyage|wikinews|wikiversity|wikibooks|wikiquote|wiktionary|wikifunctions|wikisource|wikipedia|mediawiki|wikidata|wikimedia)\.org" type="text" v-model="project"></cdx-text-input>
		<cdx-text-input required
			:placeholder="$i18n( 'username-placeholder', language )"
			pattern="^[^:]+$"
			@keyup.enter="start"
			type="text" v-model="username"></cdx-text-input>
		<cdx-button :disabled="disableBtn" @click="start" action="progressive" weight="primary">
			<cdx-icon class="nextIcon" :icon="nextIcon"></cdx-icon>
			<span>{{ $i18n( 'get-started', language ) }}</span>
		</cdx-button>
		<div v-if="loading > 0">
			<div class="progressBar">
				<div :style="`width: ${status * 200}px`"></div>
			</div>
		</div>
		<cdx-message v-if="error" type="error">
			<span v-if="errorMsg === 'share-error'">{{ $i18n( 'error-share', language ) }}</span>
			<span v-if="errorMsg === 'clipboard-error'">{{ $i18n( 'error-clipboard', language ) }}</span>
			<span v-else-if="errorMsg === 'username-disabled-error'">{{ $i18n( 'error-toomanyedits', language ) }}</span>
			<span v-else>{{ $i18n( 'error-generic', language ) }}</span>
		</cdx-message>
		<div class="yearSwitcher">
			<cdx-select
				:placeholder="$i18n( 'year-placeholder', language )"
				:menu-items="lastFiveYears"
				:selected="String(previousYear)"
				@update:selected="updateYear"></cdx-select>
		</div>
	</page>
	<page
			v-if="activePage"
		:message="activePage.message"
		:image="activePage.image"
		:class="activePage.class">
		<cdx-button @click="decrementPage" v-if="currentPage > 0" weight="primary" class="previous" aria-label="previous">
			<cdx-icon class="previousIcon" :icon="nextIcon"></cdx-icon>
		</cdx-button>
		<cdx-button @click="incrementPage" action="progressive" weight="primary">
			<cdx-icon class="nextIcon" :icon="nextIcon"></cdx-icon>
			<span>{{ currentPage + 1 }} / {{ pages.length + 1 }} </span>
		</cdx-button>
	</page>
	<page v-if="pages.length && currentPage >= pages.length">
		<cdx-button @click="decrementPage" v-if="currentPage > 0" weight="primary" class="previous" aria-label="previous">
			<cdx-icon class="previousIcon" :icon="nextIcon"></cdx-icon>
		</cdx-button>
		<share-box :stats="stats" :username="username" :project="project"></share-box>
		<p>{{ $i18n( 'thanks-for-playing', language ) }}</p>
		<p class="happy">{{ $i18n( 'hny', nextYear, language ) }}!</p>
		<cdx-message v-if="feedback" type="success">{{ feedback }}</cdx-message>
		<cdx-message v-if="error" type="error">{{ $i18n( 'error-share', language ) }}</cdx-message>
		<cdx-button v-if="shareable" @click="shareIt" action="progressive" weight="primary">
			<cdx-icon :icon="shareIcon"></cdx-icon>
			<span>{{ $i18n( 'share', language ) }}</span>
		</cdx-button>
	</page>

	<div v-if="currentPage === -1">
		{{ $i18n( 'language-label', language ) }}
		<select id="languageSwitcher" name="language" @change="setLanguage">
			<option v-for="lang in supportedLanguages" :value="lang.code" :selected="lang.code === language">
				{{ lang.label }}
			</option>
		</select>
	</div>
</div>
</template>
<script>
import facts from './facts';
import toText from './facts/toText.js';
import * as htmlToImage from 'html-to-image';
import { cdxIconArrowNext, cdxIconShare
} from '@wikimedia/codex-icons';
import yir from './yir.js';
import Page from './Page.vue';
import { CdxButton, CdxIcon, CdxTextInput, CdxMessage, CdxSelect } from '@wikimedia/codex';
import '@wikimedia/codex';
import { defineComponent } from 'vue';
import ShareBox from './ShareBox.vue';
import message from './message';
import SUPPORTED_LANGUAGES from './LANGUAGES.json';
const currentDate = ( new Date() );
const MONTH = currentDate.getMonth();
const CURRENT_YEAR = currentDate.getFullYear();
const isLocalhost = location.host.indexOf('localhost') > -1;
const START_MONTH = isLocalhost ? 10 : 11;
const YEAR = MONTH >= START_MONTH ? CURRENT_YEAR + 1 : CURRENT_YEAR;
const PREVIOUS_YEAR = YEAR - 1;
const LAST_FIVE = [ YEAR - 1, YEAR - 2, YEAR - 3, YEAR - 4, YEAR - 5 ].map( ( year ) => ( {
	label: String( year ),
	value: String( year )
} ) );

export default defineComponent( {
	name: 'App',
	components: {
		ShareBox,
		Page,
		CdxButton,
		CdxSelect,
		CdxIcon,
		CdxMessage,
		CdxTextInput
	},
	computed: {
		supportedLanguages() {
			return SUPPORTED_LANGUAGES.map( ( code ) => ( {
				code,
				label: message.message( `language-${code}`, this.language )
			} ) );
		},
		appStyle() {
			const cp = this.currentPage;
			const p = this.pages.length;
			const colors = [
				'transparent',
				'rgb(247, 176, 206)',
				'rgb(125, 211, 164)',
				'rgb(248, 216, 102)',
				'rgb(134, 132, 127)',
				'rgb(173, 128, 86)',
				'rgb(134, 132, 127)',
				'rgb(0, 0, 0)'
			];
			const index = Math.floor( ( cp / p ) * colors.length ) - 1;
			let bgColor = colors[ index ];
			return `background: ${bgColor}`;
		},
		disableBtn() {
			if ( !this.project.match( /[^\.]*\.(wikivoyage|wikinews|wikiversity|wikibooks|wikiquote|wiktionary|wikifunctions|wikisource|wikipedia|mediawiki|wikidata|wikimedia)\.org/ ) || !this.username.match(  /^[^:]+$/ ) ) {
				return true;
			}
			if ( this.project.match ( /(foundation|office)\.wikimedia\.org$/ ) ) {
				return true;
			}
			return this.currentPage === 0;
		}
	},
	props: {
		lastFiveYears: {
			type: Array,
			default: LAST_FIVE
		},
		shareable: {
			type: Boolean,
			default: navigator.clipboard !== undefined || navigator.share !== undefined
		},
		host: {
			type: String,
			default: window.location.host
		},
		nextIcon: {
			type: Object,
			default: cdxIconArrowNext
		},
		shareIcon:  {
			type: String,
			default: cdxIconShare
		}
	},
	methods: {
		setLanguage( ev ) {
			const language = ev.target.value;
			window.location.search = `?uselang=${language}`;
			message.setLanguage( language ).then(() => {
				this.language = language;
				this.languageDirection = message.isRTL() ? 'rtl' : 'ltr';
			});
		},
		updateYear(y) {
			this.previousYear = y;
			this.nextYear = y + 1;
		},
		shareIt() {
			const share = (blob) => {
				let msg = '';
				try {
					navigator.clipboard.write([
						new ClipboardItem({
							'image/png': blob
						})
					]);
					msg = message.message( 'image-shared' );
				} catch (error) {
					// pass.
					try {
						navigator.clipboard.writeText( toText( this.stats ) );
						msg = message.message( 'text-shared' );
					} catch (error) {
						this.errorMsg = 'clipboard-error';
					}
				}
				if ( navigator.share ) {
					const file = new File([blob], 'share.png', blob)
					if ( navigator.canShare( { files: [ file ] } ) ) {
						const shareData = {
							title: `Wikipedia Year In Review (${PREVIOUS_YEAR})`,
							text: toText( this.stats ),
							files: [ file ],
							url: `https://${location.host}`
						};
						return navigator.share(shareData).then(() => msg, (err) => {
							this.errorMsg = 'share-error';
							this.error = true;
						});
					}
				}
				return msg ? Promise.resolve( msg ) : Promise.reject();
			}
			this.error = false;
			this.feedback = '';
			const node = document.getElementById( 'statBox' );
			htmlToImage.toBlob(node)
				.then((blob) => {
					share(blob).then(( msg ) => {					
						this.feedback = msg;
						this.error = false;
					}, (err) => {
						this.errorMsg = 'share-error';
						this.error = true;
					} );
				})
			.catch(function (error) {
				this.errorMsg = 'share-error';
				this.error = true;
			});
		},
		decrementPage() {
			this.currentPage--;
			this.activePage = this.pages[this.currentPage];
		},
		incrementPage() {
			this.currentPage++;
			this.activePage = this.pages[this.currentPage];
		},
		start() {

			this.currentPage = 0;
			const loader = setInterval( () => {
				this.loading++;
			}, 1000 );
			const err = ( err ) => {
				if ( err.toString().indexOf( 'TOOMANYEDITS' ) > -1 ) {
					this.errorMsg = 'username-disabled-error';
				}
				this.error = true;
				this.currentPage = -1;
				clearInterval( loader );
				this.loading = 0;
			};
			const statuschecker = setInterval(() => {
				const s = yir.getStatus();
				const now = s.date;
				if ( !now ) {
					return;
				}
				const end = new Date( this.previousYear, 11, 31 );
				const ONE_DAY = 1000 * 60 * 60 * 24;
				const diff = ( end - now ) / ONE_DAY;
				this.status = ( 365 - diff ) / 365;
			}, 300);
			yir( this.username, this.previousYear, this.project ).then((stats) => {
				clearInterval( loader );
				clearInterval( statuschecker );
				this.loading = 0;
				this.stats = stats;
				this.pages = facts( stats );
				this.activePage = this.pages[this.currentPage];
			}, err );
		}
	},
	data() {
		return {
			language: message.getLanguage(),
			languageDirection: message.isRTL() ? 'rtl' : 'ltr',
			errorMsg: '',
			previousYear: PREVIOUS_YEAR,
			nextYear: YEAR,
			feedback: '',
			loading: 0,
			status: '',
			error: false,
			activePage: null,
			currentPage: -1,
			/* @type YIRFact[] */
			pages: [],
			/* @type YIRStats */
			stats: {
				year: YEAR,
				thankedCount: 0,
				talkEdits: 0,
				thanksCount: 0,
				totalEdits: 0
			},
			project: 'en.wikipedia.org',
			username: ''
		}
	}
} );
</script>
<style scoped>
.app-wrapper {
	align-items: center;
    min-height: 95vh;
    margin: auto;
    display: flex;
	flex-flow: column;
;
}
.nextIcon {
	transform: rotate(90deg);
}
h1, h2, h3 {
	margin: 0;
}
h1 {
	margin: 10px auto 0;
}
p {
	font-weight: normal;
	margin: 20px auto;
	width: 90%;
}

p,
.cdx-text-input,
label {
	font-size: 1rem;
}

.cdx-text-input {
	margin: 0 0 1rem;
}

.cdx-button {
	position: fixed;
	bottom: 0;
	font-size: 1rem;
	z-index: 1;
}
.cdx-button.previous {
	top: 0;
	bottom: auto;
}
.previousIcon {
	transform: rotate(270deg);
}
.happy {
	font-size: 2rem;
}
footer {
	font-size: 0.875rem;
    margin-top: 20px;
}
footer a {
	color: inherit;
	display: block;
}
.mainImg {
	max-height: 20vh;
	width: auto;
}
.license {
	text-align: center;
	font-size: 0.75rem;
	color: #333;
	margin-top: 30px;
	font-weight: normal;
}
.yearSwitcher {
	color: #333;
	font-size: 0.75rem;
	display: flex;
	align-items: center;
	flex-flow: column;
	font-weight: normal;
	padding-bottom: 50px;
}
.yearSwitcher select {
	display: block;
	margin-top: 10px;
}
.cdx-message {
	width: 80%;
	font-size: 14px;
	text-align: left;
}
.progressBar {
    width: 200px;
    background: gray;
    height: 20px;
	margin: 0 0 8px;
    border: solid 1px black;
}
.progressBar > div {
	background: green;
    height: 100%;
}
</style>

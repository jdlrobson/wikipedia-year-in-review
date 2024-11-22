<template>
<div class="app-wrapper" :style="appStyle">
	<page v-if="currentPage <= 0 && !activePage">
		<img class="mainImg" src="https://upload.wikimedia.org/wikipedia/commons/e/ed/WP20Symbols_MediaWiki.svg" width="512" height="401">
		<h1>Wikipedia</h1>
		<h2>Year in Review</h2>
		<p class="intro">Let's look back at all the good work you have been doing this year in helping build the best place on the Internet!</p>
		<label>Your Wikimedia project:</label>
		<cdx-text-input required
			pattern="[^\.]*\.(wikivoyage|wikinews|wikiversity|wikibooks|wikiquote|wiktionary|wikifunctions|wikisource|wikipedia|mediawiki|wikidata|wikimedia)\.org" type="text" v-model="project"></cdx-text-input>
		<cdx-text-input required
			placeholder="What's your username?"
			pattern="^[^:]+$"
			@keyup.enter="start"
			type="text" v-model="username"></cdx-text-input>
		<cdx-button :disabled="disableBtn" @click="start" action="progressive" weight="primary">
			<cdx-icon class="nextIcon" :icon="nextIcon"></cdx-icon>
			<span>Get started</span>
		</cdx-button>
		<div v-if="loading > 0">
			<span v-for="i in Array(loading)" :key="`l-${i}`">✏️</span>
			<div>Retrieving data for <span>{{  status }}</span> {{ previousYear }}.</div>
		</div>
		<cdx-message v-if="error" type="error">
			<span v-if="errorMsg === 'share-error'">An unexpected error occurred during the share process.</span>
			<span v-if="errorMsg === 'clipboard-error'">An unexpected error occurred while attempting to copy to the clipboard.</span>
			<span v-else-if="errorMsg === 'username-disabled-error'">This username has too many edits.
				Unfortunately it is not supported at the current time.</span>
			<span v-else>An error occurred while trying to check that. Did you use the correct username?</span>
		</cdx-message>
		<div class="yearSwitcher">
			<cdx-select
				placeholder="Select year"
				:menu-items="lastFiveYears" :selected="previousYear" @update:selected="updateYear"></cdx-select>
		</div>
	</page>
	<page
			v-if="activePage"
		:messagePrefix="activePage.messagePrefix"
		:value="activePage.value"
		:image="activePage.image"
		:class="activePage.class"
		:qualifier="activePage.qualifier"
		:messageSuffix="activePage.messageSuffix">
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
		<p>Thank you for viewing your year in review and for contributing to the sum of all human knowledge.</p>
		<p class="happy">Happy {{ nextYear }}!</p>
		<cdx-message v-if="feedback" type="success">{{ feedback }}</cdx-message>
		<cdx-message v-if="error" type="error">An error occurred while trying to share.</cdx-message>
		<cdx-button v-if="shareable" @click="shareIt" action="progressive" weight="primary">
			<cdx-icon :icon="shareIcon"></cdx-icon>
			<span>Share stats</span>
		</cdx-button>
	</page>
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

const currentDate = ( new Date() );
const MONTH = currentDate.getMonth();
const CURRENT_YEAR = currentDate.getFullYear();
const isLocalhost = location.host.indexOf('localhost') > -1;
const START_MONTH = isLocalhost ? 10 : 11;
const YEAR = MONTH === START_MONTH ? CURRENT_YEAR + 1 : CURRENT_YEAR;
const PREVIOUS_YEAR = YEAR - 1;
const LAST_FIVE = [ YEAR - 1, YEAR - 2, YEAR - 3, YEAR - 4, YEAR - 5 ].map( ( year ) => ( {
	label: `${year}`, value: year
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
					msg = 'An image has been shared to your clipboard.';
				} catch (error) {
					// pass.
					try {
						navigator.clipboard.writeText( toText( this.stats ) );
						msg = 'Text has been shared to your clipboard.';
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
				this.status = yir.getStatus()
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
    display: flex
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
    min-width: 340px;
	font-size: 14px;
	text-align: left;
}
</style>

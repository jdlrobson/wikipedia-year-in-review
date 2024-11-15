<template>
<div>
	<page v-if="currentPage <= 0 && !activePage">
		<h1>Wikipedia</h1>
		<h2>{{ previousYear }} Year in Review</h2>
		<img class="mainImg" src="https://upload.wikimedia.org/wikipedia/commons/e/ed/WP20Symbols_MediaWiki.svg" width="512" height="401">
		<p>Let's look back at all the good work you have been doing this year in helping build the best place on the Internet!</p>
		<label>Your Wikipedia:</label>
		<cdx-text-input required
			pattern="[^\.]*\.(wikivoyage|wikinews|wikiversity|wikibooks|wikiquote|wiktionary|wikifunctions|wikisource|wikipedia|mediawiki|wikidata|wikimedia)\.org" type="text" v-model="project"></cdx-text-input>
		<label>Your Username</label>
		<cdx-text-input required
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
		<cdx-message v-if="error" type="error">An error occurred while trying to check that. Did you use the correct username?</cdx-message>
		<footer>Made lovingly by <a href="https://jdlrobson.com">Jon Robson</a>. This tool is a personal project and not affiliated or sponsored by the Wikimedia Foundation.</footer>
		<div class="license">All illustrations CC0 1.0 adapted from <a href="https://commons.wikimedia.org/wiki/Category:Adapted_Wikipedia_20">Jasmina El Bouamraoui and Karabo Poppy Moletsane for Wikipedia 20</a> unless stated.</div>
		<div class="yearSwitcher">
			<label>Show me another year!</label>
			<cdx-select :menu-items="lastFiveYears" :selected="previousYear" @update:selected="updateYear"></cdx-select>
		</div>
	</page>
	<div v-if="activePage">
		<page
			:messagePrefix="activePage.messagePrefix"
			:value="activePage.value"
			:image="activePage.image"
			:class="activePage.class"
			:qualifier="activePage.qualifier"
			:messageSuffix="activePage.messageSuffix">
			<hr/>
			<cdx-button @click="decrementPage" v-if="currentPage > 0" weight="primary" class="previous" aria-label="previous">
				<cdx-icon class="previousIcon" :icon="nextIcon"></cdx-icon>
			</cdx-button>
			<cdx-button @click="incrementPage" action="progressive" weight="primary">
				<cdx-icon class="nextIcon" :icon="nextIcon"></cdx-icon>
				<span>{{ currentPage + 1 }} / {{ pages.length + 1 }} </span>
			</cdx-button>
		</page>
	</div>
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
const YEAR = MONTH === 11 ? CURRENT_YEAR + 1 : CURRENT_YEAR;
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
						console.log('clipboard text error', error);
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
							console.log('share error',err)
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
						console.log(err);
						this.error = true;
					} );
				})
			.catch(function (error) {
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
			const err = () => {
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
.nextIcon {
	transform: rotate(90deg);
}
h1, h2, h3 {
	margin: 0;
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
footer a,
.license a { display: inline; }
.yearSwitcher {
	color: #333;
	font-size: 0.75rem;
	margin-top: 10px;
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
</style>

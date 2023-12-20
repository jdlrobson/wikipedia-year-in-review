<template>
<div>
	<page v-if="currentPage <= 0 && !activePage">
		<h1>Wikipedia</h1>
		<h2>Year in Review</h2>
		<p>Let's look back at all the good work you have been doing this year in helping build the best place on the Internet!</p>
		<label>Your Wikipedia:</label>
		<cdx-text-input required
			pattern="[^\.]*\.(wikipedia|mediawiki)\.org" type="text" v-model="project"></cdx-text-input>
		<label>Your Username</label>
		<cdx-text-input required
			pattern="[^:]*"
			type="text" v-model="username"></cdx-text-input>
		<cdx-button :disabled="disableBtn" @click="start" action="progressive" weight="primary">
			<cdx-icon class="nextIcon" :icon="nextIcon"></cdx-icon>
			<span>Get started</span>
		</cdx-button>
		<div v-if="loading > 0">
			<span v-for="i in Array(loading)" :key="`l-${i}`">✏️</span>
			<div>Retrieving data for <span>{{  status }}</span> 2023.</div>
		</div>
		<cdx-message v-if="error" type="error">An error occurred while trying to check that. Did you use the correct username?</cdx-message>
		<footer>Made lovingly by <a href="https://jdlrobson.com">Jon Robson</a></footer>
	</page>
	<div v-if="activePage">
		<page
			:messagePrefix="activePage.messagePrefix"
			:value="activePage.value"
			:class="activePage.class"
			:qualifier="activePage.qualifier"
			:messageSuffix="activePage.messageSuffix">
			<hr/>
			<cdx-button @click="incrementPage" action="progressive" weight="primary">
				<cdx-icon class="nextIcon" :icon="nextIcon"></cdx-icon>
				<span>{{ currentPage + 1 }} / {{ pages.length + 1 }} </span>
			</cdx-button>
		</page>
	</div>
	<page v-if="pages.length && currentPage >= pages.length">
		<div class="sharebox" id="statBox">
			<h2>
				<strong>@{{ username }}</strong>
			</h2>
			<h3>
				<span>{{ project }}</span>
			</h3>
			<div class="stats">
				<stat-box :value="editCount" label="edits"
					:icon="editIcon"></stat-box>
				<stat-box :value="talkCount" label="talk page edits"
					:icon="talkIcon"></stat-box>
				<stat-box :value="thanksCount" label="thanks"
					:icon="thankIcon"></stat-box>
				<stat-box :value="thankedCount" label="thanked"
					:icon="thankIcon"></stat-box>
			</div>
			<h3 class="year"><span>2023</span></h3>
			<footer>Generate your own Year in Review at <a :href="`https://${host}`">{{host}}</a></footer>
		</div>
		<p>Thank you for viewing your year in review and for contributing to the sum of all human knowledge.</p>
		<p class="happy">Happy 2024!</p>
		<cdx-message v-if="feedback" type="success">{{ feedback }}</cdx-message>
		<cdx-message v-if="error" type="error">An error occurred while trying to share.</cdx-message>
		<cdx-button @click="shareIt" action="progressive" weight="primary">
			<cdx-icon :icon="shareIcon"></cdx-icon>
			<span>Share stats</span>
		</cdx-button>
	</page>
</div>
</template>
<script>
import * as htmlToImage from 'html-to-image';
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';
import { cdxIconArrowNext, cdxIconShare,
	cdxIconOngoingConversation,
	cdxIconUserTalk,
	cdxIconEdit } from '@wikimedia/codex-icons';
import yir from './yir.js';
import Page from './Page.vue';
import StatBox from './StatBox.vue';
import { CdxButton, CdxIcon, CdxTextInput, CdxMessage } from '@wikimedia/codex';
import '@wikimedia/codex';

const humanDay = ( day ) => {
	return [ 'Sundays','Mondays', 'Tuesdays', 'Wednesdays', 'Thursdays', 'Fridays' ][ day ];
}
export default {
	name: 'App',
	components: {
		Page,
		CdxButton,
		CdxIcon,
		StatBox,
		CdxMessage,
		CdxTextInput
	},
	computed: {
		disableBtn() {
			const $refs = this.$refs;
			return this.currentPage === 0 || ( $refs && $refs.projectInput && $refs.projectInput.matches(':invalid'));
		}
	},
	props: {
		thankIcon: {
			type: String,
			default: cdxIconUserTalk
		},
		host: {
			type: String,
			default: window.location.host
		},
		editIcon: {
			type: String,
			default: cdxIconEdit
		},
		talkIcon: {
			type: String,
			default: cdxIconOngoingConversation
		},
		nextIcon: {
			type: String,
			default: cdxIconArrowNext
		},
		shareIcon:  {
			type: String,
			default: cdxIconShare
		}
	},
	methods: {
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
				}
				if ( navigator.share ) {
					const file = new File([blob], 'share.png', blob)
					if ( navigator.canShare( { files: [ file ] } ) ) {
						const shareData = {
							title: 'Wikipedia Year In Review (2023)',
							text: 'Here is how I have been contributing to Wikipedia in 2023!',
							files: [ file ],
							url: `https://${location.host}`
						};
						return navigator.share(shareData).then(() => msg);
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
		incrementPage() {
			this.currentPage++;
			this.activePage = this.pages[this.currentPage];
		},
		start() {

			this.currentPage = 0;
			const loader = setInterval( () => {
				this.loading++;
			}, 1000 );
			const err = ( er ) => {
				console.log('error', er);
				this.error = true;
				this.currentPage = -1;
				clearInterval( loader );
				this.loading = 0;
			};
			const statuschecker = setInterval(() => {
				this.status = yir.getStatus()
			}, 300);
			yir( this.username, 2023, this.project ).then((stats) => {
				clearInterval( loader );
				clearInterval( statuschecker );
				this.loading = 0;
				this.editCount = stats.totalEdits;
				this.talkCount = stats.talkEdits;
				this.thanksCount = stats.thanksCount;
				this.thankedCount = stats.thankedCount;
				if ( !this.editCount || this.editCount === 0 ) {
					//return err();
				}
				
				const toReadable = ( num ) => {
					let msg = num;
					if ( num > 1000 ) {
						const thousands = parseInt( num / 1000, 10 )
						if ( thousands > 0 ) {
							msg = `${thousands}K+`;
						}
					}
					return msg;

				}
				const topDay = stats.dayofweek[ 0 ];
				this.pages = [];
				if ( stats.totalEdits ) {
					this.pages.push( {
						messagePrefix: 'You made',
						value: toReadable( stats.totalEdits ),
						qualifier: 'edits',
						messageSuffix: 'across the project'
					} );
				} else {
					this.pages.push( {
						messagePrefix: 'You didn\'t edit this project this year, but...',
						qualifier: '2024',
						messageSuffix: 'is another year to contribute to the sum of all human knowledge!'
					} );
				}
				if ( stats.paragraphs ) {
					this.pages.push({
						messagePrefix: 'Editing approximately',
						value: toReadable( stats.paragraphs ),
						qualifier: 'paragraphs',
						messageSuffix: 'of text!'
					} );
				}
				if ( stats.articleEdits > 0 ) {
					this.pages = this.pages.concat( [ {
						messagePrefix: 'You made',
						value: toReadable( stats.articleEdits ),
						qualifier: 'edits',
						messageSuffix: `in ${toReadable(stats.articlesNumber)} different articles`
					},
					{
						messagePrefix: 'You edited the most on',
						class: 'smaller',
						value: humanDay( parseInt( topDay.day, 10 ) ),
						messageSuffix: `${topDay.count} edits`
					} ] );
				}
				if ( stats.top5[0] ) {
					this.pages = this.pages.concat( [
						{
							messagePrefix: 'You made contributions to',
							messageSuffix: `[[${stats.top5[0].title}]]`
						},
						...stats.top5.slice(1).map((t) => {
							return {
								messagePrefix: 'and',
								messageSuffix: `[[${t.title}]]`
							};
						} )
					] );
				}

				if ( stats.talkEdits > 0 ) {
					this.pages.push({
						messagePrefix: 'You contributed',
						value: toReadable( stats.talkEdits ),
						qualifier: 'times',
						messageSuffix: 'to discussions.'
					});
				}

				let wasThanked = false;
				if ( stats.thanksCount > 0 ) {
					wasThanked = true;
					this.pages = this.pages.concat( [
						{
							messagePrefix: 'You were appreciated by',
							value: toReadable( stats.thanksCount ),
							qualifier: 'editors'
						}
					] );
				}
				if ( stats.thanksCount > 0 ) {
					this.pages = this.pages.concat( [
						{
							messagePrefix: wasThanked ? 'And you showed appreciation to' :
								'You showed appreciation to',
							value: toReadable( stats.thankedCount ),
							qualifier: 'other humans'
						},
						{
							messagePrefix: 'Thank you caring!',
							messageSuffix: 'We appreciate you!'
						}
					] );
				}
				if ( stats.topThanksTo.length  ) {
					this.pages = this.pages.concat( [
						{
							messagePrefix: `@${stats.topThanksTo[0].title}`,
							//value: stats.topThanksTo[0].count,
							//qualifier: 'User'
							messageSuffix: 'was the user you thanked the most'
						}
					] );
				}
				if ( stats.topThanksFrom.length ) {
					this.pages = this.pages.concat( [
						{
							messagePrefix: `@${stats.topThanksFrom[0].user}`,
							messageSuffix: 'was your biggest fan'
						}
					] );
				}
				this.activePage = this.pages[this.currentPage];
			}, err );
		}
	},
	data() {
		return {
			feedback: '',
			loading: 0,
			status: '',
			error: false,
			editCount: 0,
			activePage: null,
			currentPage: -1,
			pages: [],
			project: 'en.wikipedia.org',
			username: ''
		}
	}
};
</script>
<style scoped>
.nextIcon {
	transform: rotate(90deg);
}
.stats {
	margin-top: 20px;
	display: flex;
	flex-wrap: wrap;
	column-gap: 8px;
	row-gap: 8px;
	max-width: 400px;
	align-content: center;
	justify-content: center;
}
.cdx-input:invalid {
	background: pink!important;
}
.sharebox {
	border-radius: 15px;
	margin-top: 20px;
	background: #14866d;
	padding: 20px 8px;
	color: white;
}
.sharebox h3 span {
	display: block;
}
.sharebox .year {
	margin: 28px 0 0px;
	font-size: 2rem;
}
h1, h2, h3 {
	margin: 0;
}
.cdx-button {
	position: fixed;
	bottom: 0;
	font-size: 1rem;
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
</style>

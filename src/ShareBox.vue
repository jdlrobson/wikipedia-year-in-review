<template>
<div class="sharebox" id="statBox">
	<h2>
		<strong>@{{ username }}</strong>
	</h2>
	<h3>
		<span>{{ project }}</span>
	</h3>
	<img
		:src="imageLogo"
		width="512" height="401">
	<div class="stats">
		<stat-box
			v-if="project === 'commons.wikimedia.org'"
			:value="stats.fileUploads"
			message="file-uploads"
			:icon="uploadIcon"></stat-box>
		<stat-box
			v-else-if="project === 'www.wikidata.org'"
			:value="stats.totalEdits"
			message="claims"
			:icon="wikidataIcon"></stat-box>
		<stat-box
			v-else
			:value="stats.totalEdits"
			message="edits"
			:icon="editIcon"></stat-box>
		<stat-box :value="stats.talkEdits"
			message="talk-page-edits"
			:icon="talkIcon"></stat-box>
		<stat-box :value="stats.thanksCount"
			message="thanks"
			:icon="thankIcon"></stat-box>
		<stat-box :value="stats.thankedCount"
			message="thanked"
			:icon="thankIcon"></stat-box>
		<stat-box v-if="stats.streak.longestStreak > 0"
			:value="stats.streak.longestStreak"
			message="longest-streak"
			:icon="streakIcon"></stat-box>
		<stat-box v-if="stats.templateEdits" :value="stats.templateEdits"
			message="template-edits"
			:icon="templateIcon"></stat-box>
		<stat-box v-if="stats.interfaceEdits" :value="stats.interfaceEdits"
			message="interface-edits"
			:icon="gadgetIcon"></stat-box>
		<div class="sharebox-info-chips">
			<cdx-info-chip v-for="note in notes" :title="note.tooltip">{{ note.label }}</cdx-info-chip>
		</div>
	</div>
	<h3 class="year"><span>{{ stats.year - 1 }}</span></h3>
	<footer>
		<span v-html="$i18n( 'generate-your-own', `<a href='https://${host}'>${host}</a>` )"></span>
		<div class="license-logo">
			<a href="https://creativecommons.org/publicdomain/zero/1.0/deed.en">
				<img src="./Cc.logo.circle.svg.webp">
				<img src="./Cc-zero.svg.png">
			</a>
		</div>
	</footer>
</div>
</template>
<script>
import StatBox from './StatBox.vue';
import { defineComponent } from 'vue';
import {
	cdxIconLabFlask,
	cdxIconTemplateAdd,
	cdxIconLogoWikidata,
	cdxIconUpload,
	cdxIconOngoingConversation,
	cdxIconUserTalk,
	cdxIconEdit,
	cdxIconPlay
} from '@wikimedia/codex-icons';
import { CdxInfoChip } from '@wikimedia/codex';
import { getTimeslotNote, humanDay } from './facts/habitUtils';
import message from './message';

// @vue/component
export default defineComponent( {
	components: {
		StatBox,
		CdxInfoChip
	},
	name: 'ShareBox',
	computed: {
		notes() {
			const topDay = this.stats.dayofweek[ 0 ];
			const topSlot = this.stats.hourofweek[ 0 ];
			const notes = [
				{
					label: humanDay( topDay.day ),
					tooltip: message.message( 'badge-day-desc', topSlot.timespan )
				},
				{
					label: getTimeslotNote( topSlot.timespan ),
					tooltip: message.message( 'badge-timeslot-desc', topSlot.timespan )
				}
			];

			if ( this.stats.fileUploads > 364 ) {
				notes.push( {
					label: message.message( 'badge-archivist' ),
					tooltip: message.message( 'badge-archivist-desc' )
				} );
			}
			if ( this.stats.pageEdits > 50 ) {
				notes.push( {
					label: message.message( 'badge-proofreader' ),
					tooltip: message.message( 'badge-proofreader-desc' )
				} );
			}
			if ( this.stats.templateEdits > 50 ) {
				notes.push( {
					label: message.message( 'badge-template-wizard' ),
					tooltip: message.message( 'badge-template-wizard-desc' )
				} );
			}
			if ( this.stats.interfaceEdits > 20 ) {
				notes.push( {
					label: message.message( 'badge-interface-hero' ),
					tooltip: message.message( 'badge-interface-hero-desc' )
				} );
			}
			if ( this.stats.totalEdits > 1000000 ) {
				notes.push( {
					label: message.message( 'badge-1M' ),
					tooltip: message.message( 'badge-1M-desc' )
				} );
			} else if ( this.stats.totalEdits > 100000 ) {
				notes.push( {
					label: message.message( 'badge-100k' ),
					tooltip: message.message( 'badge-100k-desc' )
				} );
			} else if ( this.stats.totalEdits > 10000 ) {
				notes.push( {
					label: message.message( 'badge-10k' ),
					tooltip: message.message( 'badge-10k-desc' )
				} );
			} else if ( this.stats.totalEdits > 1000 ) {
				notes.push( {
					label: message.message( 'badge-1k' ),
					tooltip: message.message( 'badge-1k-desc' )
				} );
			} else if ( this.stats.totalEdits > 100 ) {
				notes.push( {
					label: message.message( 'badge-100' ),
					tooltip: message.message( 'badge-100-desc' )
				} );
			}
			if ( this.stats.talkEdits > 1000 ) {
				notes.push( {
					label: message.message( 'badge-chatterbox' ),
					tooltip: message.message( 'badge-chatterbox-desc' )
				} );
			}
			if ( this.stats.thankedCount > 100 ) {
				notes.push( {
					label: message.message( 'badge-appreciated' ),
					tooltip: message.message( 'badge-appreciated-desc' )
				} );
			}
			if ( this.stats.streak.longestStreak > 30 ) {
				notes.push( {
					label: message.message( 'badge-streak' ),
					tooltip: message.message( 'badge-streak-desc' )
				} );
			}
			return notes;
		},
		imageLogo() {
			switch ( this.project ) {
				case 'www.mediawiki.org':
					return 'https://www.wikidata.org/static/images/icons/mediawikiwiki.svg';
				case 'www.wikidata.org':
					return 'https://www.wikidata.org/static/images/icons/wikidatawiki.svg';
				case 'commons.wikimedia.org':
					return 'https://commons.wikimedia.org/static/images/icons/commonswiki.svg';
				default:
					return 'https://upload.wikimedia.org/wikipedia/commons/a/a7/Adapted_Wikipedia20symbol_puzzleglobe.svg';
			}
		}
	},
	props: {
		host: {
			type: String,
			default: window.location.host
		},
		username: {
			type: String
		},
		project: {
			type: String
		},
		streakIcon: {
			type: String,
			default: cdxIconPlay
		},
		wikidataIcon: {
			type: String,
			default: cdxIconLogoWikidata
		},
		templateIcon: {
			type: String,
			default: cdxIconTemplateAdd
		},
		gadgetIcon: {
			type: String,
			default: cdxIconLabFlask
		},
		uploadIcon: {
			type: String,
			default: cdxIconUpload
		},
		editIcon: {
			type: String,
			default: cdxIconEdit
		},
		talkIcon: {
			type: Object,
			default: cdxIconOngoingConversation
		},
		thankIcon: {
			type: Object,
			default: cdxIconUserTalk
		},
		/**
		 * @type YIRStats
		 */
		stats: {
			type: Object
		}
	}
} );
</script>
<style scoped>
.cdx-info-chip {
	background: white;
	margin: 2px;
}
h2, h3 {
	margin: 0;
}
footer a {
	color: inherit;
	display: block;
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
.stat-note {
	font-size: 0.7em;
    color: #ccc;
}
.sharebox {
	border-radius: 15px;
	margin-top: 20px;
	background: #14866d;
	padding: 20px 8px;
	color: white;
}
.sharebox img {
	margin: 12px 0 0;
	height: 100px;
	width: auto;
}
.sharebox h3 span {
	display: block;
}
.sharebox .year {
	margin: 28px 0 0px;
	font-size: 2rem;
}
.license-logo {
	margin-top: 10px;
}
.license-logo img {
	width: 20px;
	height: 20px;
	display: inline;
	filter: invert(1);
}
footer {
	font-size: 0.75rem;
}

footer a {
	display: inline;
}
.sharebox-info-chips {
	width: 100%;
}
</style>
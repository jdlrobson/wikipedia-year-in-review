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
			:value="stats.fileUploads" label="file uploads"
			:icon="uploadIcon"></stat-box>
		<stat-box
			v-else-if="project === 'www.wikidata.org'"
			:value="stats.totalEdits" label="claims"
			:icon="wikidataIcon"></stat-box>
		<stat-box
			v-else
			:value="stats.totalEdits" label="edits"
			:icon="editIcon"></stat-box>
		<stat-box :value="stats.talkEdits" label="talk page edits"
			:icon="talkIcon"></stat-box>
		<stat-box :value="stats.thanksCount" label="thanks"
			:icon="thankIcon"></stat-box>
		<stat-box :value="stats.thankedCount" label="thanked"
			:icon="thankIcon"></stat-box>
		<stat-box v-if="stats.templateEdits" :value="stats.templateEdits" label="template edits"
			:icon="templateIcon"></stat-box>
		<stat-box v-if="stats.interfaceEdits" :value="stats.interfaceEdits" label="interface edits"
			:icon="gadgetIcon"></stat-box>
		<div class="sharebox-info-chips">
			<cdx-info-chip v-for="note in notes">{{ note }}</cdx-info-chip>
		</div>
	</div>
	<h3 class="year"><span>{{ previousYear }}</span></h3>
	<footer>Generate your own Year in Review at <a :href="`https://${host}`">{{host}}</a>
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
	cdxIconEdit
} from '@wikimedia/codex-icons';
import { CdxInfoChip } from '@wikimedia/codex';
import { getTimeslotNote, humanDay } from './facts/habitUtils';

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
				humanDay( topDay.day ),
				getTimeslotNote( topSlot.timespan )
			];
			if ( this.stats.templateEdits > 50 ) {
				notes.push( 'template wizard' );
			}
			if ( this.stats.interfaceEdits > 20 ) {
				notes.push( 'interface hero' );
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
	margin: 0 2px;
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
</style>
<template>
<div class="statbox">
    <cdx-icon :icon="icon"></cdx-icon>
    <span class="statbox-label" v-html="impactMessage"></span>
</div>
</template>
<script>
import { CdxIcon } from '@wikimedia/codex';
import message from './message';
export default {
    name: 'StatBox',
    components: {
        CdxIcon
    },
    computed: {
        impactMessage() {
            let valString = `${this.value}`;
            if ( valString.length === 7 ) {
                valString = `${ valString.slice( 0, 1 ) },${ valString.slice( 1, 4 ) },${ valString.slice( 4 ) }`;
            } else if ( valString.length === 6 ) {
                valString = `${ valString.slice( 0, 3 ) },${ valString.slice( 3 ) }`;
            } else if ( valString.length === 5 ) {
                valString = `${ valString.slice( 0, 2 ) },${ valString.slice( 2 ) }`;
            }
            return message.impactMessage( this.message, valString );
        }
    },
    props: {
        icon: String|Object,
        value: {
            type: Number,
        },
        message: {
            type: String
        }
    }
};
</script>
<style>
.statbox {
    width: 90px;
    background: white;
    padding: 8px;
    color: #333;
    border-radius: 5px;
    padding-left: 40px;
    position: relative;
}
.statbox span {
    display: block;
    text-align: left;
}
span.statbox-label {
    display: flex;
    flex-direction: column;
    font-size: 0.75rem;
}
.statbox-label strong {
    font-size: 1.25rem;
    font-weight: 700;
}
.statbox .cdx-icon {
    position: absolute;
    left: 8px;
    top: 8px;
    botton: 8px;
}
</style>
<template>
<div class="statbox">
    <cdx-icon :icon="icon"></cdx-icon>
    <span>{{ valueFormatted }}</span>
    <span class="statbox-label">{{ label }}</span>
</div>
</template>
<script>
import { CdxIcon } from '@wikimedia/codex';
export default {
    name: 'StatBox',
    components: {
        CdxIcon
    },
    computed: {
        valueFormatted() {
            let valString = `${this.value}`;
            if ( valString.length === 7 ) {
                return `${ valString.slice( 0, 1 ) },${ valString.slice( 1, 4 ) },${ valString.slice( 4 ) }`;
            } else if ( valString.length === 6 ) {
                return `${ valString.slice( 0, 3 ) },${ valString.slice( 3 ) }`;
            } else if ( valString.length === 5 ) {
                return `${ valString.slice( 0, 2 ) },${ valString.slice( 2 ) }`;
            } else {
                return valString;
            }
        }
    },
    props: {
        icon: String|Object,
        value: {
            type: Number
        },
        label: {
            type: String
        }
    }
};
</script>
<style>
.statbox {
    width: 100px;
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
.statbox-label {
    font-size: 0.75rem;
}
.statbox .cdx-icon {
    position: absolute;
    left: 8px;
    top: 8px;
    botton: 8px;
}
</style>
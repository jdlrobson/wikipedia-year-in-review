<template>
<div class="statbox">
    <cdx-icon :icon="icon"></cdx-icon>
    <span>{{ valueFormatted }}</span>
    <span class="statbox-label">{{ label }}</span>
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
        valueFormatted() {
            return message.convertNumber( this.value );
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
    width: 90px;
    background: white;
    padding: 8px;
    color: #333;
    border-radius: 5px;
    padding-left: 40px;
    position: relative;
    margin-bottom: 20px;
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
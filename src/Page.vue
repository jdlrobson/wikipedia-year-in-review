<template>
<div class="page">
    <div class="main">
        <img v-if="image" :src="image.source" :width="image.width" :height="image.height">
        <p v-if="messagePrefix">{{messagePrefix}}</p>
        <p class="message">
            <strong v-if="value" :class="class">{{ value }}</strong>
            <span>{{ qualifier}}</span>
        </p>
        <p class="subtitle" v-if="messageSuffix"  v-html="messageSuffix"></p>
    </div>
    <div class="text">
        <slot></slot>
    </div>
</div>
</template>
<script>
export default {
    name: 'Page',
    props: {
        image: Object,
        class: String,
        messageSuffix: String,
        messagePrefix: String,
        qualifier: String,
        value: String
    },
    data() {
        return {
            pages: [],
            // Jevansen - extreme example
            username: 'TheDJ'
        }
    }
};
</script>
<style scoped>
.page {
        max-width: 800px;
    margin: auto;
    word-break: break-word;
    box-sizing: border-box;
    color: #14866d;
    width: 100vw;
    height: 100vh;
    font-size: 3rem;
    display: flex;
    flex-flow: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 20px 10px;
    font-family: sans-serif;
    font-weight: bold;
}
.main .message {
    font-family: serif;
    display: block;
}
.main span {
    display: block;
    margin-top: -18px;
    font-family: sans-serif;
}
.main strong {
    font-weight: bold;
    font-size: 7rem;
}
img {
    width: auto;
	max-height: 20vh;
    background-size: cover;
    margin-bottom: 10px;
}

.main strong.smaller {
    font-size: 3.8rem;
}
@media ( min-width: 1000px ) {
    .page {
        padding: 20px;
    }
    .main strong {
        font-weight: bold;
        font-size: 10rem;
    }

    .main strong.smaller {
        font-size: 8rem;
    }
}
.text {
    font-size: 1.25rem;
    align-items: center;
    display: flex;
    flex-flow: column;
}
.cdx-button {
    margin-top: 10px;
    display: block;
}

p {
    margin-top: -18px;
    font-family: sans-serif;
}

.subtitle {
    font-size: 2rem;
}


@media ( max-width: 400px ) {
    .page {
        font-size: 2rem;
    }
    .main strong.smaller {
        font-size: 3rem;
    }
}
</style>
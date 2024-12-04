<template>
<div class="page">
    <div v-if="message" class="main">
        <img v-if="image" :src="image.source" :width="image.width" :height="image.height">
        <p v-html="message" class="message-text"></p>
    </div>
    <div v-else class="main">
        <img v-if="image" :src="image.source" :width="image.width" :height="image.height">
        <p v-if="messagePrefix">{{messagePrefix}}</p>
        <p class="message">
            <strong v-if="value" :class="class">{{ value }}</strong>
            <span>{{ qualifier }}</span>
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
        message: String,
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
<style>
.page {
    max-width: 800px;
    width: 80%;
    background: #fff;
    margin: auto;
    word-break: break-word;
    box-sizing: border-box;
    font-size: 3rem;
    display: flex;
    flex-flow: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 2rem 10px;
    font-family: sans-serif;
    font-weight: bold;
    border-radius: 1rem;
    min-height: 80vh;
}
p {
    font-size: 1rem;
    margin: 1rem;
}
.main .message {
    font-family: serif;
    display: block;
}
.main span {
    display: block;
    font-family: sans-serif;
}
.main strong ~ span {
    margin-top: -18px;
}
.main strong {
    font-weight: bold;
    font-size: 5rem;
}

.main .message-text strong {
    display: block;
    margin: 1rem 0 0;
}
.main .message-text strong:last-child,
.main .message-text span:last-child {
    margin-bottom: 1rem;
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
    font-family: sans-serif;
}

.subtitle {
    font-size: 1rem;
}


@media ( max-width: 300px ) {
    .page {
        width: 100%;
    }
}

@media ( max-width: 500px ) {
    .page {
        width: 90%;
    }
}

@media ( max-width: 400px ) {
    .page {
        font-size: 1rem;
    }
    .main strong.smaller {
        font-size: 2rem;
    }
}
</style>
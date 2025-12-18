<template>
    <div class="panel">
        <h1>{{ title }}</h1>
        <div id="slot">{{ slot }}</div>
    </div>
</template>

<script setup>
import { VueElement } from 'vue';


const props = defineProps({
    title:{
        type:String,
        default: "Title"
    },
    slot:{
        type: String,
        default: null,
    }
});

</script>

<style scoped>
    .panel{
        position: fixed;
        width: 50%;
        height: auto;
        z-index: 10;
        right: 50px;
        top:50px;
        bottom: 50px;
    }
</style>
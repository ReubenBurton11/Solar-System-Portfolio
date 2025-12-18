<template>
    <div class="panel">
        <h1>{{ title }}</h1>
        <div id="slot">{{ slot }}</div>
        <p class="foot">Press space to continue...</p>
    </div>
</template>

<script setup>


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
        padding-left: 20px;
        padding-right: 20px;
    }
    #slot{
        margin:0;
        padding: 0;
        width: 100%;
        height: 80%;
        overflow-x: auto;
    }
    .foot{
        position: absolute;
        bottom: 1%;
    }
</style>
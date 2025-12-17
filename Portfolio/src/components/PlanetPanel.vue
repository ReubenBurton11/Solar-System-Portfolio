<template>
    <div>
        <h1>{{ title }}</h1>
        <slot></slot>
        <p>{{ desc }}</p>
        <a :href="link" target="_blank">View Here</a>
    </div>
</template>

<script setup>

const props = defineProps({
    title:{
        type:String,
        default: "Title"
    },
    desc:{
        type: String,
        default: "description",
    },
    link:{
        type: String,
        default: "https://www.heinz.com/en-GB",
    },

});

</script>

<style scoped>
    div{
        position: fixed;
        background-color: rgb(100, 100, 100, 0.5);
        width: 50%;
        height: auto;
        z-index: 10;
        right: 50px;
        top:50px;
        bottom: 50px;

        border-style: solid;
        border-radius: 10px;
    }
</style>
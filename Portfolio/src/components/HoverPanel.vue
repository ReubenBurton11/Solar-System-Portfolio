<template>
    <div class="panel">
        <h1>{{ title }}</h1>
        <p>{{ desc }}</p>
        <p>Left click to see more...</p>
    </div>
</template>

<script setup>
    const props = defineProps({
        title:{
            type: String,
            default: "Title",
        },
        desc:{
            type: String,
            default: "Description",
        }
    });
</script>

<style scoped>
    .panel{
        position: fixed;
        width: 300px;
        height: auto;
        bottom: 55%;
        left: 52%;
        border-bottom-left-radius: 0;
    }
</style>
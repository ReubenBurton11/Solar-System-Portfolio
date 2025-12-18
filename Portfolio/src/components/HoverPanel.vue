<template>
    <div class="panel">
        <h1>{{ title }}</h1>
    </div>
</template>

<script setup>
    const props = defineProps({
        title:{
            type: String,
            default: "Title",
        },
    });
</script>

<style scoped>
    div{
        position: fixed;
        border-style: solid;
        border-radius: 10px;
        width: 100px;
        height: auto;
        bottom: 55%;
        left: 52%;
    }
</style>
<template>
    <div ref="sceneCont"></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { World } from "../world/world.js";

const sceneCont = ref(null);

function startScene(container){
    const world = new World(container);

    world.start();
}

onMounted(() => {
    startScene(sceneCont.value);
})
</script>

<style>

</style>
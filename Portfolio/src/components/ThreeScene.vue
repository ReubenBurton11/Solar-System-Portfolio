<template>
    <div v-if="bHasWebGL" id="sceneDiv">
        <canvas id="sceneCanvas"></canvas>
    </div>
    <div v-else>Your browser sucks: it can't use webGL2</div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { World } from "../world/world.js";
import WebGL from "three/examples/jsm/capabilities/WebGL.js";

const bHasWebGL = ref(true);

let sceneCanvas = null;

function startScene(container){
    const world = new World(container);

    world.start();
}

onMounted(() => {
    if (!WebGL.isWebGL2Available())
    {
        bHasWebGL.value = false;
        return;
    }
    sceneCanvas = document.getElementById("sceneCanvas");
    startScene(sceneCanvas);
})
</script>

<style>
#sceneCanvas{
    display: block;
    position: relative;
    width: 100%;
    height: 100%;
}
#sceneDiv{
    width:100%;
    height: 100%;
}
</style>
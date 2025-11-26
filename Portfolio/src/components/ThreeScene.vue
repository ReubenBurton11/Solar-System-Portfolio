<template>
    <div v-if="bHasWebGL" id="sceneDiv">
        <canvas id="sceneCanvas"></canvas>
        <input id="input" value="0" type="range" min="-3.14" max="3.14" step="0.01">rot</input>
    </div>
    <div v-else>Your browser sucks: it can't use webGL2</div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { World } from "../world/world.js";
import WebGL from "three/examples/jsm/capabilities/WebGL.js";
import setRot from "../world/components/spaceship.js";

const bHasWebGL = ref(true);

let sceneCanvas = null;
let world = null;

function startScene(container){
    world = new World(container);

    world.start();
}

function updateSpaceshipRot(value){
    world.setSpaceshipRot(value);
}

onMounted(() => {
    if (!WebGL.isWebGL2Available())
    {
        bHasWebGL.value = false;
        return;
    }
    sceneCanvas = document.getElementById("sceneCanvas");
    startScene(sceneCanvas);

    document.getElementById("input").addEventListener('input', (e) => {
        updateSpaceshipRot(e.target.value);
    })
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
#input{
    display: block;
    position: fixed;
    left:0;
    top:0;
}
</style>
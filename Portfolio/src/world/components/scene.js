import { Scene, Color } from "three";

function createScene(bg){
    const scene = new Scene();

    scene.background = bg;

    return scene;
}

export {createScene};
import { createRenderer } from "./systems/renderer.js";
import { Resizer } from "./systems/resizer.js";
import { Loop } from "./systems/loop.js";
import { createScene } from "./components/scene.js";
import { createLights } from "./components/lights.js";
import { createCamera } from "./components/camera.js";
import createCube from "./components/cube.js";

let camera;
let renderer;
let scene;
let loop;

class World{
    constructor(container){
        renderer = createRenderer(container);
        camera = createCamera();
        scene = createScene("lightBlue");

        loop = new Loop(camera, scene, renderer);

        const {light, lightHelper} = createLights({
            
        });

        let cube = createCube({

        });

        loop.updateables.push(light);
        loop.updateables.push(cube);
        scene.add(light, cube);

        const resizer = new Resizer(camera, renderer);
        resizer.onResize = () => {
            this.render();
        };
    }

    render(){
        renderer.render(scene, camera);
    }

    start(){
        loop.start();
    }

    stop(){
        loop.stop();
    }
}

export {World};
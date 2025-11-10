import { createRenderer } from "./systems/renderer.js";
import { Resizer } from "./systems/resizer.js";
import { Loop } from "./systems/loop.js";
import { createScene } from "./components/scene.js";
import { createLights } from "./components/lights.js";
import { createCamera } from "./components/camera.js";

let camera;
let renderer;
let scene;
let loop;

class World{
    constructor(container){
        camera = createCamera();
        scene = createScene("lightBlue");
        renderer = createRenderer();

        loop = new Loop(camera, scene, renderer);

        container.append(renderer.domElement);

        const {light, lightHelper} = createLights("white");

        loop.updateables.push(light);
        scene.add(light);

        const resizer = new Resizer(container, camera, renderer);
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
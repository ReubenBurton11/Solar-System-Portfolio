import { createRenderer } from "./systems/renderer.js";
import { Resizer } from "./systems/resizer.js";
import { Loop } from "./systems/loop.js";
import { createScene } from "./components/scene.js";
import { createLights } from "./components/lights.js";
import { createCamera } from "./components/camera.js";
import createCube from "./components/cube.js";
import { Spaceship } from "./components/spaceship.js";
import { Vector3 } from "three";
import { Controls } from "./components/controls.js";

let camera;
let renderer;
let scene;
let loop;
let spaceship;

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

        spaceship = new Spaceship({
            
        });

        let controls = new Controls(spaceship);

        loop.updateables.push(
            light,
            cube, 
            spaceship,
            controls
        );
        
        scene.add(
            light, 
            cube, 
            spaceship
        );

        const resizer = new Resizer(camera, renderer);
        resizer.onResize = () => {
            this.render();
        };
    }

    setSpaceshipRot(value){
        spaceship.SetRotation(new Vector3(spaceship.rotation.x, value, spaceship.rotation.z));
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
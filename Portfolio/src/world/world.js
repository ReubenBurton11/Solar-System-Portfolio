import { createRenderer } from "./systems/renderer.js";
import { Resizer } from "./systems/resizer.js";
import { Loop } from "./systems/loop.js";
import { createScene } from "./components/scene.js";
import { createLights } from "./components/lights.js";
import { createCamera } from "./components/camera.js";
import createCube from "./components/cube.js";
import { Spaceship } from "./components/spaceship.js";
import { Vector3, CubeTextureLoader, Euler} from "three";
import { Controls } from "./components/controls.js";
import SBRight from "../assets/cubemap/right.png";
import SBLeft from "../assets/cubemap/left.png";
import SBTop from "../assets/cubemap/top.png";
import SBBottom from "../assets/cubemap/bottom.png";
import SBBack from "../assets/cubemap/back.png";
import SBFront from "../assets/cubemap/front.png";


let camera;
let renderer;
let scene;
let loop;
let spaceship;

class World{
    constructor(container){
        renderer = createRenderer(container);
        camera = createCamera({
            near: 3,
            far: 300
        });

        //Skybox setup
        const cubemapLoader = new CubeTextureLoader();
        const skyboxTex = cubemapLoader.load([
            SBRight, SBLeft, SBTop, SBBottom, SBFront, SBBack,
        ]);
        scene = createScene(skyboxTex);



        loop = new Loop(camera, scene, renderer);

        const {light, lightHelper, ambientLight} = createLights({
            ambientIntensity: 0.05,
            renderer: renderer,
            environmentMap: scene.background,
        });

        let cube = createCube({

        });

        spaceship = new Spaceship({
            cam: camera,
            camOffset: new Vector3(0, 2, 10),
            camRotation: new Vector3(-(Math.PI / 20), 0, 0)
        });

        let controls = new Controls(spaceship);

        loop.updateables.push(
            light,
            cube, 
            spaceship,
            controls
        );
        
        scene.add(
            ambientLight,
            light, 
            cube, 
            spaceship
        );

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
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
import { Planet } from "./components/planet.js";
import { FloatingLetter } from "./components/floatingLetter.js";
import { RaycastUtil } from "./components/raycastUtil.js";
import SBRight from "../assets/cubemap/right.png";
import SBLeft from "../assets/cubemap/left.png";
import SBTop from "../assets/cubemap/top.png";
import SBBottom from "../assets/cubemap/bottom.png";
import SBBack from "../assets/cubemap/back.png";
import SBFront from "../assets/cubemap/front.png";
import ControlsPanel from "@/components/Controls.vue";
import { AddPermanentUI } from "./systems/ui.js";
import musicVis from "../assets/music-visualiser.html?raw";
import portfolio from "../assets/solar-system-portfolio.html?raw";
import me from "../assets/me.html?raw";


let camera;
let renderer;
let scene;
let loop;
let spaceship;

class World{
    constructor(container){
        this.bPointerLocked = false;
        this.container = container;

        renderer = createRenderer(container);
        camera = createCamera({
            FOV: 45,
            near: 3,
            far: 3000
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

        let planets = [
            new Planet({
                radius: 200,
                position: new Vector3(-100, 50, -1000),
                color: "rgba(255, 159, 5, 1)",

                name: "Solar System Portfolio",
                description: "A portfolio presented as a space exploration experience",
                slot: portfolio,
            }),
            new Planet({
                radius: 150,
                position: new Vector3 (250, 300, -1400),
                color: "rgba(72, 59, 255, 1)",

                name: "Music Visualiser",
                description: "A music visualiser with a custom music player",
                slot: musicVis,
            }),
        ];

        let myName = new FloatingLetter({
            text: "Reuben Burton",
            size: 20,
            spacing: 1.15,
            alignment: "centre",
            color: ["#FFFFFF", "#D4D4D4", "#AAAAAA", "#7C7C7C", "#525252", "#7C7C7C", "#AAAAAA", "#D4D4D4"],
            position: new Vector3(0, -10, -150),

            name: "Me, Reuben Burton",
            description: "A student programmer at Falmouth University",
            slot: me,
        });

        spaceship = new Spaceship(this, {
            cam: camera,
            camOffset: new Vector3(0, 2, 10),
            camRotation: new Vector3(-(Math.PI / 20), 0, 0),
        });

        let raycastUtil = new RaycastUtil();

        let controls = new Controls(this, spaceship);

        loop.updateables.push(
            light,
            spaceship,
            controls,
        );
        
        scene.add(
            ambientLight,
            light, 
            ...planets,
            myName,
            spaceship,
        );

        raycastUtil.detectableObjects.push(
            ...planets,
            myName,
        );

        spaceship.raycaster = raycastUtil;

        const resizer = new Resizer(camera, renderer);
        resizer.onResize = () => {
            this.render();
        };

        AddPermanentUI(ControlsPanel);

        document.addEventListener('pointerlockchange', (e) => {
            if (document.pointerLockElement === this.container){
                this.bPointerLocked = true;
                loop.resume();
            }
            else{
                this.bPointerLocked = false;
                loop.pause();
            }
        });
    }

    focusWorld = async() => {
        await this.container.requestPointerLock({ unadjustedMovement:true });
    }

    unfocusWorld = async() => {
        await document.exitPointerLock();
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
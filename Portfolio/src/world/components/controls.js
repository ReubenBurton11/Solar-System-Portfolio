import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js"
import { Spaceship } from "./spaceship";
import { Vector3, Vector2, Euler } from "three";

let controls;
let mouse;

class Key extends EventTarget{
    constructor(value){
        super();

        this.value = value;
        this.bIsPressed = false;

        this.keyDown = new CustomEvent("keyDown", {
            detail:{
                type: "down",
                key: value
            }
        });

        this.keyUp = new CustomEvent("keyUp", {
            detail:{
                type: "up",
                key: value
            }
        });
    }

    KeyDown(){
        this.bIsPressed = true;
        this.dispatchEvent(this.keyDown);
    }

    KeyUp(){
        this.bIsPressed = false;
        this.dispatchEvent(this.keyUp);
    }
}

class Mouse{
    constructor(){
        this.x = 0;
        this.y = 0;
        this.deltaMovement = new Vector2(0, 0);
        this.movementX = 0;
        this.movementY = 0;

        this.previousScreenPos = new Vector2(0, 0);
        this.currentScreenPos = new Vector2(0, 0);

        this.bIsMoving = false;
    }

    SetMousePos(x, y){
        this.x = x;
        this.y = y;
    }

    SetIsMovingFalse(){
        this.bIsMoving = false;
        this.SetMouseMovement(0, 0);
    }

    SetMouseMovement(x, y){
        const vector = new Vector2(x, y);
        if (this.deltaMovement != vector){
        this.deltaMovement.set(vector.x, vector.y);
        }
    }
}

class Controls{
    constructor(spaceship){
        controls = this;
        if (!spaceship)
        {
            console.error("controls: setupControls: no spaceship given");
        }

        const keys = new Map();
        keys.set('w', new Key('w'));
        keys.set('a', new Key('a'));
        keys.set('s', new Key('s'));
        keys.set('d', new Key('d'));
        this.keys = keys;

        mouse = new Mouse();
        this.mouse = mouse;

        this.spaceship = spaceship;

        const KeyHandler = (e) => {
            console.log(e.detail.key, e.detail.type);
        }

        //Keys
        //Generic key listeners
        document.addEventListener('keydown', function(e){
            const key = keys.get(e.key);
            if (!key){
                return;
            }
            if (!key.bIsPressed){
                key.KeyDown();
            }
        });

        document.addEventListener('keyup', function(e){
            const key = keys.get(e.key);
            if (!key){
                return;
            }
            if (key.bIsPressed){
                key.KeyUp();
            }
        });

        //Specific key listeners
        keys.get('w').addEventListener('keyDown', () => {spaceship.ForwardThrust(true)});
        keys.get('w').addEventListener('keyUp', () => {spaceship.ForwardThrust(false)});

        keys.get('a').addEventListener('keyDown', () => {spaceship.LeftRoll(true)});
        keys.get('a').addEventListener('keyUp', () => {spaceship.LeftRoll(false)});

        keys.get('s').addEventListener('keyDown', () => {spaceship.BackwardThrust(true)});
        keys.get('s').addEventListener('keyUp', () => {spaceship.BackwardThrust(false)});

        keys.get('d').addEventListener('keyDown', () => {spaceship.RightRoll(true)});
        keys.get('d').addEventListener('keyUp', () => {spaceship.RightRoll(false)});


        //Mouse
        let mouseIsMovingTimeout; 

        document.addEventListener('mousemove', function(e){
            clearTimeout(mouseIsMovingTimeout);
            mouse.bIsMoving = true;
            mouse.SetMouseMovement(e.movementX, e.movementY);
            mouseIsMovingTimeout = setTimeout(controls.SetMouseMovingFalse, 50);
        })
    }

    SetMouseMovingFalse(){
        mouse.SetIsMovingFalse();
    }

    tick = (delta) => {
        //this.spaceship.CamBoomAddRotation(new Vector3(-this.mouse.deltaMovement.y, this.mouse.deltaMovement.x, 0).multiplyScalar(this.spaceship.mouseSens * delta))
        this.spaceship.AddRotation(new Euler().setFromVector3(new Vector3(this.mouse.deltaMovement.y, -this.mouse.deltaMovement.x, 0).multiplyScalar(this.spaceship.mouseSens * delta)));
        //Track mouse movement
        if (!this.mouse.bIsMoving){
            this.mouse.SetMouseMovement(0, 0);
        }
        
    }
}

export {Controls};

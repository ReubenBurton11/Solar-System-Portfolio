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
            if (!key.bIsPressed){
                key.KeyDown();
            }
        });

        document.addEventListener('keyup', function(e){
            const key = keys.get(e.key);
            if (key.bIsPressed){
                key.KeyUp();
            }
        });

        //Specific key listeners
        keys.get('w').addEventListener('keyDown', KeyHandler);
        keys.get('w').addEventListener('keyUp', KeyHandler);

        keys.get('a').addEventListener('keyDown', KeyHandler);
        keys.get('a').addEventListener('keyUp', KeyHandler);

        keys.get('s').addEventListener('keyDown', KeyHandler);
        keys.get('s').addEventListener('keyUp', KeyHandler);

        keys.get('d').addEventListener('keyDown', KeyHandler);
        keys.get('d').addEventListener('keyUp', KeyHandler);


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
        if (this.keys.get('w').bIsPressed){
            this.spaceship.AddThrust(new Vector3(0, 0, 1).multiplyScalar(this.spaceship.forwardThrustForce * delta));
        }
        if (this.keys.get('a').bIsPressed){
            this.spaceship.AddRotation(new Euler().setFromVector3(new Vector3(0, 0, -1).multiplyScalar(this.spaceship.rollAccel * delta)));
        }
        if (this.keys.get('s').bIsPressed){
            this.spaceship.AddThrust(new Vector3(0, 0, -1).multiplyScalar(this.spaceship.backwardThrustForce * delta));
        }
        if (this.keys.get('d').bIsPressed){
            this.spaceship.AddRotation(new Euler().setFromVector3(new Vector3(0, 0, 1).multiplyScalar(this.spaceship.rollAccel * delta)));
        }

        //this.spaceship.CamBoomAddRotation(new Vector3(-this.mouse.deltaMovement.y, this.mouse.deltaMovement.x, 0).multiplyScalar(this.spaceship.mouseSens * delta))
        this.spaceship.AddRotation(new Euler().setFromVector3(new Vector3(this.mouse.deltaMovement.y, -this.mouse.deltaMovement.x, 0).multiplyScalar(this.spaceship.mouseSens * delta)));
        //Track mouse movement
        if (!this.mouse.bIsMoving){
            this.mouse.SetMouseMovement(0, 0);
        }
        
    }
}

export {Controls};

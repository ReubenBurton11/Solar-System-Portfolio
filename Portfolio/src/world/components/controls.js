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

class Mouse extends EventTarget{
    constructor(){
        super();

        this.x = 0;
        this.y = 0;
        this.deltaMovement = new Vector2(0, 0);
        this.movementX = 0;
        this.movementY = 0;

        this.previousScreenPos = new Vector2(0, 0);
        this.currentScreenPos = new Vector2(0, 0);

        this.bIsMoving = false;

        this.bLeftIsPressed = false;
        this.bRightIsPressed = false;

        this.leftDown = new CustomEvent("mouseLeftDown", {
            detail:{

            }
        });

        this.leftUp = new CustomEvent("mouseLeftUp", {
            detail:{

            }
        });

        this.rightDown = new CustomEvent("mouseRightDown", {
            detail:{

            }
        });

        this.rightUp = new CustomEvent("mouseRightUp", {
            detail:{

            }
        });
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

    LeftDown(){
        this.bLeftIsPressed = true;
        this.dispatchEvent(this.leftDown);
    }

    LeftUp(){
        this.bLeftIsPressed = false;
        this.dispatchEvent(this.leftUp);
    }

    RightDown(){
        this.bRightIsPressed = true;
        this.dispatchEvent(this.rightDown);
    }

    RightUp(){
        this.bRightIsPressed = false;
        this.dispatchEvent(this.rightUp);
    }
}

class Controls{
    constructor(world, spaceship){
        controls = this;
        if (!spaceship)
        {
            console.error("controls: setupControls: no spaceship given");
        }
        if (!world){
            console.error("controls: setupControls: no world given");
        }

        const keys = new Map();
        keys.set('w', new Key('w'));
        keys.set('a', new Key('a'));
        keys.set('s', new Key('s'));
        keys.set('d', new Key('d'));
        keys.set('shift', new Key('shift'));
        keys.set(' ', new Key(' '));
        this.keys = keys;

        mouse = new Mouse();
        this.mouse = mouse;

        this.spaceship = spaceship;

        const KeyHandler = (e) => {
            console.log(e.detail.key, e.detail.type);
        }

        const MouseHandler = () => {
            console.log("pressed");
        }

        //Keys
        //Generic key listeners
        document.addEventListener('keydown', function(e){
            const key = keys.get(e.key.toLowerCase());
            if (!key){
                return;
            }
            if (!world.bPointerLocked){
                if (spaceship.focusedPlanet){
                    if (!spaceship.focusedPlanet.panel){
                        world.focusWorld();
                    }
                }
                else{
                world.focusWorld();
                }
            }
            if (!key.bIsPressed){
                key.KeyDown();
            }
        });

        document.addEventListener('keyup', function(e){
            const key = keys.get(e.key.toLowerCase());
            if (!key){
                return;
            }
            if (key.bIsPressed){
                key.KeyUp();
            }
        });

        document.addEventListener('mousedown', (e) => {
            switch (e.button){
                case 0:
                    if (!mouse.bLeftIsPressed){
                        mouse.LeftDown();
                    }
                case 2:
                    if (!mouse.bRightIsPressed){
                        mouse.RightDown();
                    }
            }
        });

        document.addEventListener('mouseup', (e) => {
            switch (e.button){
                case 0:
                    if (mouse.bLeftIsPressed){
                        mouse.LeftUp();
                    }
                case 2:
                    if (mouse.bRightIsPressed){
                        mouse.RightUp();
                    }
            }
        });

        //Specific key listeners
        keys.get('w').addEventListener('keyDown', () => {spaceship.ForwardThrust(true)});
        keys.get('w').addEventListener('keyUp', () => {
            spaceship.ForwardThrust(false);
            if(keys.get('s').bIsPressed)keys.get('s').KeyDown();
        });

        keys.get('a').addEventListener('keyDown', () => {spaceship.LeftRoll(true)});
        keys.get('a').addEventListener('keyUp', () => {
            spaceship.LeftRoll(false);
            if(keys.get('d').bIsPressed)keys.get('d').KeyDown();
        });

        keys.get('s').addEventListener('keyDown', () => {spaceship.BackwardThrust(true)});
        keys.get('s').addEventListener('keyUp', () => {
            spaceship.BackwardThrust(false);
            if(keys.get('w').bIsPressed)keys.get('w').KeyDown();
        });

        keys.get('d').addEventListener('keyDown', () => {spaceship.RightRoll(true)});
        keys.get('d').addEventListener('keyUp', () => {
            spaceship.RightRoll(false);
            if(keys.get('a').bIsPressed)keys.get('a').KeyDown();
        });

        keys.get('shift').addEventListener('keyDown', () => {spaceship.TurboBoost(true)});
        keys.get('shift').addEventListener('keyUp', () => {
            spaceship.TurboBoost(false);
            if(keys.get('w').bIsPressed)keys.get('w').KeyDown();
        });

        keys.get(' ').addEventListener('keyDown', () => {
            if (!spaceship.focusedPlanet){
                return;
            }
            if (!spaceship.focusedPlanet.panel)
            {
                return;
            }
            spaceship.UnselectPlanet();
        });

        mouse.addEventListener('mouseLeftDown', () => {spaceship.SelectPlanet()});


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

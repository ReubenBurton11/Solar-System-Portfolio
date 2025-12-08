import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js"
import { Spaceship } from "./spaceship";
import { Vector3, Vector2, Euler } from "three";

class Key{
    constructor(value){
        this.value = value;
        this.bIsPressed = false;
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
        this.deltaMovement = new Vector2(0, 0);
    }
}

class Controls{
    constructor(spaceship){
        if (!spaceship)
        {
            console.error("controls: setupControls: no spaceship given");
        }

        let keys = [new Key('w'), new Key('a'), new Key('s'), new Key('d')];
        this.keys = keys;

        let mouse = new Mouse();
        this.mouse = mouse;

        this.spaceship = spaceship;

        //Keys
        document.addEventListener('keydown', function(e){
            const key = e.key;
            for(let i = 0; i < keys.length; i++){
                if (key == keys[i].value && !keys[i].bIsPressed){
                    keys[i].bIsPressed = true;
                }
            }
        })

        document.addEventListener('keyup', function(e){
            const key = e.key;
            for(let i = 0; i < keys.length; i++){
                if (key == keys[i].value && keys[i].bIsPressed){
                    keys[i].bIsPressed = false;
                }
            }
        })


        //Mouse
        let mouseIsMovingTimeout; 

        document.addEventListener('mousemove', function(e){
            clearTimeout(mouseIsMovingTimeout);
            mouse.bIsMoving = true;
            mouse.deltaMovement.set(e.movementX, e.movementY);
            mouseIsMovingTimeout = setTimeout(mouse.SetIsMovingFalse, 50);
        })
    }

    tick = (delta) => {
        if (this.keys[0].bIsPressed){
            this.spaceship.AddVelocity(new Vector3(0, 0, 1).multiplyScalar(this.spaceship.acceleration * delta));
        }
        if (this.keys[1].bIsPressed){
            this.spaceship.AddRotation(new Euler().setFromVector3(new Vector3(0, 0, -1).multiplyScalar(this.spaceship.rollAccel * delta)));
        }
        if (this.keys[2].bIsPressed){
            if (this.spaceship.velocity.z > 0){
            this.spaceship.AddVelocity(new Vector3(0, 0, -1).multiplyScalar(this.spaceship.deceleration * delta));
            }
            else{
                this.spaceship.AddVelocity(new Vector3(0, 0, -1).multiplyScalar(this.spaceship.acceleration * delta));
            }
        }
        if (this.keys[3].bIsPressed){
            this.spaceship.AddRotation(new Euler().setFromVector3(new Vector3(0, 0, 1).multiplyScalar(this.spaceship.rollAccel * delta)));
        }

        //this.spaceship.CamBoomAddRotation(new Vector3(-this.mouse.deltaMovement.y, this.mouse.deltaMovement.x, 0).multiplyScalar(this.spaceship.mouseSens * delta))
        this.spaceship.AddRotation(new Euler().setFromVector3(new Vector3(this.mouse.deltaMovement.y, -this.mouse.deltaMovement.x, 0).multiplyScalar(this.spaceship.mouseSens * delta)));
        //Track mouse movement
        //console.log(this.mouse.deltaMovement);
    }
}

export {Controls};

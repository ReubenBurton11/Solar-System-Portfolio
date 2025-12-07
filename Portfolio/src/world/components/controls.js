import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js"
import { Spaceship } from "./spaceship";
import { Vector3 } from "three";

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
    }

    SetMousePos(x, y){
        this.x = x;
        this.y = y;
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
        document.addEventListener('mousemove', function(e){
            const x = e.clientX - window.innerWidth / 2;
            const y = e.clientY - window.innerHeight / 2;
            mouse.SetMousePos(x, y);
        })
    }

    tick = (delta) => {
        if (this.keys[0].bIsPressed){
            this.spaceship.AddVelocity(new Vector3(0, 0, 1).multiplyScalar(this.spaceship.acceleration * delta));
        }
        if (this.keys[1].bIsPressed){
            this.spaceship.AddRotation(new Vector3(0, 0, -1).multiplyScalar(this.spaceship.rollAccel * delta));
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
            this.spaceship.AddRotation(new Vector3(0, 0, 1).multiplyScalar(this.spaceship.rollAccel * delta));
        }

        this.spaceship.CamBoomAddRotation(new Vector3(-this.mouse.y, this.mouse.x, 0).multiplyScalar(this.spaceship.mouseSens * delta))
    }
}

export {Controls};

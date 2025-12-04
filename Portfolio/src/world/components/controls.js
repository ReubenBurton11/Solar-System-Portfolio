import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js"
import { Spaceship } from "./spaceship";
import { Vector3 } from "three";

class Key{
    constructor(value){
        this.value = value;
        this.bIsPressed = false;
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

        this.spaceship = spaceship;

        document.addEventListener('keydown', function(e){
            console.log(keys);
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
    }

    tick = (delta) => {
        if (this.keys[0].bIsPressed){
            this.spaceship.AddVelocity(new Vector3(0, 0, 1).multiplyScalar(this.spaceship.acceleration * delta));
        }
        if (this.keys[1].bIsPressed){
            this.spaceship.AddRotation(new Vector3(0, 0, 1).multiplyScalar(this.spaceship.rollAccel * delta));
        }
        if (this.keys[2].bIsPressed){
            this.spaceship.AddVelocity(new Vector3(0, 0, -1).multiplyScalar(this.spaceship.acceleration * delta));
        }
        if (this.keys[3].bIsPressed){
            this.spaceship.AddRotation(new Vector3(0, 0, -1).multiplyScalar(this.spaceship.rollAccel * delta));
        }
    }
}

export {Controls};

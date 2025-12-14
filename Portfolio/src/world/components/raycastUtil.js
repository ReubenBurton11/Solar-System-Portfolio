import { Raycaster } from "three";

class RaycastUtil{
    constructor(){
        this.detectableObjects = [];
        this.raycaster = new Raycaster();
    }

    setFromCamera = (coords, camera, props = {}) => {
        this.raycaster.setFromCamera(coords, camera);
        this.raycaster.near = props.near ? props.near : 0;
        this.raycaster.far = props.far ? props.far : Infinity;
    }

    checkAll = (array, props = {}) => {
        let objects = [];
        if (props.tag){
            for (let i = 0; i < this.detectableObjects.length; i++){
                if (!this.detectableObjects[i].tag){
                    continue;
                }

                if (this.detectableObjects[i].tag == props.tag){
                        objects.push(this.detectableObjects[i]);
                }
            }
        }
        else{
            objects = this.detectableObjects;
        }
        this.raycaster.intersectObjects(objects, true, array);
    }
}

export {RaycastUtil};
import { Raycaster } from "three";

class RaycastUtil{
    constructor(){
        this.detectableObjects = [];
        this.raycaster = new Raycaster();
    }

    setFromCamera = (coords, camera, props) => {
        this.raycaster.setFromCamera(coords, camera);
        this.raycaster.near = props.near ? props.near : 0;
        this.raycaster.far = props.far ? props.far : Infinity;
    }

    checkAll = (array) => {
        this.raycaster.intersectObjects(this.detectableObjects, true, array);
    }
}

export {RaycastUtil};
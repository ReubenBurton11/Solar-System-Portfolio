import { PerspectiveCamera } from "three";

function createCamera(FOV, aspect, near, far){
    const camera = new PerspectiveCamera(
        FOV, //FOV
        aspect, //aspect ratio
        near, //clipping plane: near
        far //far
    )

    camera.position.set(0, 0, 10);
    camera.tick = (delta) => {

    };

    return camera;
}

export {createCamera};
import { PerspectiveCamera } from "three";

function createCamera(props){
    const camera = new PerspectiveCamera(
        props.FOV, //FOV
        props.aspect, //aspect ratio
        props.near, //clipping plane: near
        props.far //far
    )

    camera.position.set(0, 0, 10);
    camera.tick = (delta) => {

    };

    return camera;
}

export {createCamera};
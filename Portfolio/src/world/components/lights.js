import { DirectionalLight, DirectionalLightHelper } from "three";

function createLights(props){
    const color = props.color ? props.color : "white";
    const intensity = props.intensity ? props.intensity : 1;
    const light = new DirectionalLight(color, intensity);
    const lightHelper = new DirectionalLightHelper(light, 1, "yellow");

    const position = props.position ? [props.position.x ? props.position.x : 0, props.position.y ? props.position.y : 0, props.position.z ? props.position.z : 10] : [0, 0, 10];
    light.position.set(...position);
    
    light.tick = (delta) => {
        
    }

    return {light, lightHelper};
}

export {createLights};
import { DirectionalLight, DirectionalLightHelper } from "three";

function createLights(props){
    const color = props.color ? props.color : "white";
    const intensity = props.intensity ? props.intensity : 1;
    const light = new DirectionalLight(color, intensity);
    const lightHelper = new DirectionalLightHelper(light, 1, "yellow");

    const position = props.position ? [props.position.x ? props.position.x : 0, props.position.y ? props.position.y : 0, props.position.z ? props.position.z : 10] : [0, 0, 10];
    light.position.set(...position);
    let col = {r:0, g:1, b:0};
    light.tick = (delta) => {
        if (col.r < 1){col.r += delta;}
        else {col.r -= delta};
        if (col.g > 0){col.g -= delta;}
        else {col.g += delta};
        if (col.b < 1){col.b += delta}
        else (col.b -= delta);
        light.color.setRGB(col.r, col.g, col.b);
        console.log(col);
    }

    return {light, lightHelper};
}

export {createLights};
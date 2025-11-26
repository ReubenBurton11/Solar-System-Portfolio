import { WebGLRenderer } from "three";

function createRenderer(container)
{
    const renderer = new WebGLRenderer({antialias : true, canvas: container});
    //renderer.physicallyCorrectLights = true;

    return renderer;
}

export { createRenderer };
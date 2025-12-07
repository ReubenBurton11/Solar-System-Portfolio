import { BoxGeometry, Mesh, MeshPhongMaterial } from "three";

export default function createCube(props){
    const dims = props.dimensions ? [props.dimensions.x ? props.dimensions.x : 1, props.dimensions.y ? props.dimensions.y : 1, props.dimensions.z ? props.dimensions.z : 1] : [1, 1, 1]; 
    const geo = new BoxGeometry(...dims);

    const mat = new MeshPhongMaterial( {color: props.color ? props.color : "white"} );

    const cube = new Mesh(geo, mat);

    const pos = props.initialPos ? [props.initialPos.x ? props.initialPos.x : 0, props.initialPos.y ? props.initialPos.y : 0, props.initialPos.z ? props.initialPos.z : 0] : [0, 0, 0];
    cube.position.set(...pos);
    const rot = props.initialRot ? [props.initialRot.x ? props.initialRot.x : 0, props.initialRot.y ? props.initialRot.y : 0, props.initialRot.z ? props.initialRot.z : 0] : [0, 0, 0];
    cube.rotation.set(...rot);

    cube.tick = (delta) => {
        // cube.rotation.x += delta;
        // cube.rotation.y += delta;
    };

    return cube;
}
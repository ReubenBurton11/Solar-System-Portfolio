import { MeshPhongMaterial, Object3D, SphereGeometry, Mesh, Vector3 } from "three";

class Planet extends Object3D{
    constructor(props){
        super();

        this.name = props.name;
        this.tag = "planet";

        const geo = new SphereGeometry(props.radius ? props.radius : 10);
        const mat = new MeshPhongMaterial({color: props.color ? props.color : "teal"});
        const mesh = new Mesh(geo, mat);
        this.add(mesh);

        mesh.position.set(0,0,0).add(props.position ? props.position : new Vector3(0, 0, 0));
    }
}

export {Planet};
import { BoxGeometry, MeshPhongMaterial, Object3D, Mesh, ConeGeometry, Vector3} from "three"

let rot = 0;

export default function createSpaceship(props)
{
    const spaceship = new Object3D();
    const dims = props.dimensions ? [props.dimensions.x ? props.dimensions.x : 1, props.dimensions.y ? props.dimensions.y : 1, props.dimensions.z ? props.dimensions.z : 1] : [1, 1, 2]; 
    const bodyGeo = new BoxGeometry(...dims);
    const bodyMat = new MeshPhongMaterial({color: "white"});
    const bodyMesh = new Mesh(bodyGeo, bodyMat);

    const wingGeo = new ConeGeometry(0.4, 2, 4, 1);
    const wingMat = new MeshPhongMaterial({color:"white"});
    const lWingMesh = new Mesh(wingGeo, wingMat);
    const rWingMesh = new Mesh(wingGeo, wingMat);

    const forwardVector = new Vector3(0, 0, 1);
    const rightVector = new Vector3(1, 0, 0);
    const upVector = new Vector3(0, 1, 0);

    lWingMesh.position.set(-1, 0, 0);
    lWingMesh.rotation.set(0, 0, 1.57);
    rWingMesh.position.set(1, 0, 0);
    rWingMesh.rotation.set(0, 0, -1.57);
    bodyMesh.add(lWingMesh);
    bodyMesh.add(rWingMesh);

    spaceship.add(bodyMesh);
    //spaceship.add(props.camera);
    
    spaceship.position.set(0, 0, 0);
    spaceship.rotation.set(0, 0, 0);
     
    spaceship.tick = (delta) => {
       // console.log(spaceship.localToWorld(forwardVector));
       console.log(rot);
    };

    return spaceship;
}
import { BoxGeometry, MeshPhongMaterial, Object3D, Mesh, Shape, ConeGeometry, Vector3, Vector2, LatheGeometry, DoubleSide, ExtrudeGeometry} from "three"

class Spaceship extends Object3D{
    constructor(props){
        super();

        let rotation = this.rotation; 
        let position = this.position;
        this.velocity = new Vector3(0, 0, 0);
        this.maxSpeed = 100;
        this.maxBackSpeed = 10;
        this.acceleration = 10;
        this.deceleration = 100;
        this.rollAccel = 1;

        const dims = props.dimensions ? [props.dimensions.x ? props.dimensions.x : 1, props.dimensions.y ? props.dimensions.y : 1, props.dimensions.z ? props.dimensions.z : 1] : [1, 1, 2]; 
        const bodyGeo = new BoxGeometry(...dims);
        const bodyMat = new MeshPhongMaterial({color: "white", side: DoubleSide});
        const bodyMesh = new Mesh(bodyGeo, bodyMat);

        const wingShape = new Shape();
        wingShape.moveTo(0.2, 0);
        wingShape.lineTo(0.2, -0.8);
        wingShape.lineTo(-0.2, -0.8);
        wingShape.lineTo(-0.2, 0);
        wingShape.lineTo(0.2, 0);
        const wingGeo = new ExtrudeGeometry(wingShape); //new ConeGeometry(0.4, 2, 4, 2);
        const wingMat = new MeshPhongMaterial({color:"white"});
        const lWingMesh = new Mesh(wingGeo, wingMat);
        const rWingMesh = new Mesh(wingGeo, wingMat);

        let points = [];
        for (let i = 0; i < 10; i++){
            points.push(new Vector2((Math.sin(i * 0.15) + 1) * 0.3, i * 0.05));
        }
        const boostGeo = new LatheGeometry(points);
        const boostMesh = new Mesh(boostGeo, bodyMat);
        boostMesh.position.set(0, 0, -(dims[2]/2));
        boostMesh.rotation.set(-1.57, 0, 0);

        this.forwardVector = this.localToWorld(new Vector3(0, 0, 1));
        this.rightVector = this.localToWorld(new Vector3(1, 0, 0));
        this.upVector = this.localToWorld(new Vector3(0, 1, 0));

        lWingMesh.position.set(-1, 0, 0);
        lWingMesh.rotation.set(0, 0, 1.57);
        rWingMesh.position.set(1, 0, 0);
        rWingMesh.rotation.set(0, 0, -1.57);
        bodyMesh.add(lWingMesh);
        bodyMesh.add(rWingMesh);
        bodyMesh.add(boostMesh);

        this.add(bodyMesh);
        //spaceship.add(props.camera);
    
        position.set(0, 0, 0);
        rotation.set(0, Math.PI, 0);
    }

    SetRotation(value){
        this.rotation.setFromVector3(value);
    }

    AddRotation(value){
        const vec = new Vector3(this.rotation.x, this.rotation.y, this.rotation.z);
        vec.add(value);
        this.rotation.setFromVector3(vec);
    }

    SetPosition(value){
        this.position.setFromVector3(value);
    }

    SetVelocity(value){
        this.velocity.set(value.x, value.y, value.z);
        this.velocity.clampLength(0, this.velocity.z > 0 ? this.maxSpeed : this.maxBackSpeed);
    }

    AddVelocity(value){
        this.velocity.add(value);
        this.velocity.clampLength(0, this.velocity.z > 0 ? this.maxSpeed : this.maxBackSpeed);
    }

    tick = (delta) => {
        const localVel = new Vector3(this.velocity.x, this.velocity.y, this.velocity.z);
        const vel = this.localToWorld(localVel).sub(this.position).multiplyScalar(delta);
        this.position.add(vel);
    }
}

export {Spaceship};
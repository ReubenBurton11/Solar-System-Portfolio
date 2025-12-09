import { BoxGeometry, MeshPhongMaterial, Object3D, Mesh, Shape, ConeGeometry, Vector3, Vector2, Euler, LatheGeometry, DoubleSide, ExtrudeGeometry, Material, Quaternion} from "three"
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry.js'

class Spaceship extends Object3D{
    constructor(props){
        super();

        let rotation = this.rotation; 
        let position = this.position;
        this.velocity = new Vector3(0, 0, 0);
        this.maxSpeed = 60;
        this.maxBackSpeed = 10;
        this.acceleration = 10;
        this.deceleration = 8;
        this.rollAccel = 1;
        this.orbitSpeed = 1;
        this.drag = 0.01;
        this.mouseSens = 0.1;
        this.camera = props.cam;
        this.camBoom = new Object3D();
        this.camBoom.rotation.y = Math.PI;
        this.camera.position.set(props.camOffset.x, props.camOffset.y, props.camOffset.z);
        this.camera.rotation.setFromVector3(props.camRotation);
        this.camBoom.add(this.camera);
        this.add(this.camBoom);

        const dims = props.dimensions ? [props.dimensions.x ? props.dimensions.x : 1, props.dimensions.y ? props.dimensions.y : 1, props.dimensions.z ? props.dimensions.z : 1] : [1, 1, 2]; 
        const bodyGeo = new BoxGeometry(...dims);
        const bodyMat = new MeshPhongMaterial({color: "black", side: DoubleSide});
        const bodyMesh = new Mesh(bodyGeo, bodyMat);

        const wFrontOuterHeight = 0.05;
        const wBackOuterHeight = 0.1;
        const wFrontInnerHeight = 0.1;
        const wBackInnerHeight = 0.3;
        const wFrontOuterDepth = 0.5;
        const wBackOuterDepth = 1.2;
        const wFrontInnerDepth = 0.8;
        const wBackInnerDepth = 0.6;
        const wFrontOuterWidth = -0.1;
        const wBackOuterWidth = 0.5;
        const wFrontInnerWidth = 0.5;
        const wBackInnerWidth = 0.5;
        let wPoints = [new Vector3(wFrontOuterHeight, wFrontOuterWidth, wFrontOuterDepth), new Vector3(-wFrontOuterHeight, wFrontOuterWidth, wFrontOuterDepth), new Vector3(-wFrontInnerHeight, -wFrontInnerWidth, wFrontInnerDepth), new Vector3(wFrontInnerHeight, -wFrontInnerWidth, wFrontInnerDepth),
            new Vector3(wBackOuterHeight, wBackOuterWidth, -wBackOuterDepth), new Vector3(-wBackOuterHeight, wBackOuterWidth, -wBackOuterDepth), new Vector3(-wBackInnerHeight, -wBackInnerWidth, -wBackInnerDepth), new Vector3(wBackInnerHeight, -wBackInnerWidth, -wBackInnerDepth)
        ];
        const wingShape = new Shape();
        wingShape.moveTo(0.2, 0);
        wingShape.lineTo(0.2, -0.8);
        wingShape.lineTo(-0.2, -0.8);
        wingShape.lineTo(-0.2, 0);
        wingShape.lineTo(0.2, 0);
        const wingGeo = new ConvexGeometry(wPoints); //new ConeGeometry(0.4, 2, 4, 2);
        const wingMat = new MeshPhongMaterial({color:"yellow"});
        const lWingMesh = new Mesh(wingGeo, wingMat);
        const rWingMesh = new Mesh(wingGeo, wingMat);

        let points = [];
        for (let i = 0; i < 10; i++){
            points.push(new Vector2((Math.sin(i * 0.15) + 1) * 0.3, i * 0.05));
        }
        const boostGeo = new LatheGeometry(points);
        const boostMat = new MeshPhongMaterial({color:"yellow", side:DoubleSide})
        const boostMesh = new Mesh(boostGeo, boostMat);
        boostMesh.position.set(0, 0, -(dims[2]/2));
        boostMesh.rotation.set(-1.57, 0, 0);

        this.rightVector = new Vector3();
        this.upVector = new Vector3();
        this.forwardVector = new Vector3();

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
        const quat = new Quaternion().setFromEuler(this.rotation);
        const valQuat = new Quaternion().setFromEuler(value);
        const newQuat = quat.multiply(valQuat);
        this.rotation.setFromQuaternion(newQuat);
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

    CamBoomSetPosition(value){
        this.camBoom.position.set(value.x, value.y, value.z);
    }

    CamBoomSetRotation(value){
        this.camBoom.rotation.setFromVector3(value);
    }

    CamBoomAddRotation(value){
        const rot = new Vector3(this.camBoom.rotation.x, this.camBoom.rotation.y, this.camBoom.rotation.z);
        rot.add(value);
        this.camBoom.rotation.setFromVector3(rot);
    }

    tick = (delta) => {
        //Update Properties
        this.rightVector = this.localToWorld(new Vector3(1, 0, 0)).normalize();
        this.upVector = this.localToWorld(new Vector3(0, 1, 0)).normalize();
        this.forwardVector = this.localToWorld(new Vector3(0, 0, 1)).normalize();


        //Velocity Calculations
        const localVel = new Vector3(this.velocity.x, this.velocity.y, this.velocity.z);
        const tempVel = new Vector3(localVel.x, localVel.y, localVel.z);
        const tempVelSqr = new Vector3(tempVel.x, tempVel.y, tempVel.z).length();
        const dragVel = tempVel.normalize().negate().multiplyScalar((tempVelSqr * this.drag) / 2);
        this.velocity.add(dragVel);
        const vel = new Vector3(0, 0, 0).add(localVel).add(dragVel);
        const velo = this.localToWorld(vel).sub(this.position).multiplyScalar(delta);
        this.position.add(velo);

        //Rotation Calculations
        
    }
}

export {Spaceship};
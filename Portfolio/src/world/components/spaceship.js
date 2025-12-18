import { BoxGeometry, MeshPhongMaterial, Object3D, Mesh, Shape, ConeGeometry, Vector3, Vector2, Euler, LatheGeometry, DoubleSide, ExtrudeGeometry, Material, Quaternion, Raycaster} from "three"
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry.js'

class Spaceship extends Object3D{
    constructor(world, props){
        super();

        let rotation = this.rotation; 
        let position = this.position;

        if (!world){
            console.log("spaceship: no world assigned");
            return;
        }
        this.world = world;

        this.useDrag = true;

        this.thrust = new Vector3(0, 0, 0);
        this.globalVelocity = new Vector3(0, 0, 0);
        this.maxSpeed = 0.6;
        this.turboMaxSpeed = 1;
        this.bIsTurboBoosting = false;
        this.forwardThrustForce = 0.3;
        this.backwardThrustForce = 0.3;
        this.turboBoostForce = 5;
        this.rollAccel = 0.02;
        this.maxRollSpeed = 0.02;
        this.roll = new Vector3(0, 0, 0);
        this.rotateVelocity = new Vector3(0, 0, 0);
        this.rollDrag = 0.01;
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

        this.raycaster;
        this.visionDistance = 10000;
        this.focusedPlanet = null;

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

    ForwardThrust(isActivating){
        if (isActivating){
            this.thrust.set(0, 0, this.forwardThrustForce);
        }
        else{
            this.thrust.set(0, 0, 0);
        }
    }

    BackwardThrust(isActivating){
        if (isActivating){
            this.thrust.set(0, 0, -this.backwardThrustForce);
        }
        else{
            this.thrust.set(0, 0, 0);
        }
    }

    TurboBoost = (isActivating) => {
        if (isActivating){
            this.bIsTurboBoosting = true;
            this.thrust.set(0, 0, this.turboBoostForce);
        }
        else{
            this.bIsTurboBoosting = false;
            this.thrust.set(0, 0, 0);
        }
    }

    RightRoll(isActivating){
        if (isActivating){
            this.roll.set(0, 0, 1).multiplyScalar(this.rollAccel);
        }
        else{
            this.roll.set(0, 0, 0);
        }
    }

    LeftRoll(isActivating){
        if (isActivating){
            this.roll.set(0, 0, -1).multiplyScalar(this.rollAccel);
        }
        else{
            this.roll.set(0, 0, 0);
        }
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

    SelectPlanet = () => {
        if (!this.world.bPointerLocked){
            return;
        }
        if (!this.focusedPlanet){
            console.log("no planet");
            return;
        }

        this.focusedPlanet.AddPlanetPanel();
        this.world.unfocusWorld();
    }

    UnselectPlanet = () => {
        this.focusedPlanet.RemovePlanetPanel();
        this.focusedPlanet = null;
        this.world.focusWorld();
    }

    tick = (delta) => {
        //Update Properties
        this.rightVector = this.localToWorld(new Vector3(1, 0, 0)).normalize();
        this.upVector = this.localToWorld(new Vector3(0, 1, 0)).normalize();
        this.forwardVector = this.localToWorld(new Vector3(0, 0, 1)).normalize();


        //Velocity Calculations
        // const localVel = new Vector3(this.thrust.x, this.thrust.y, this.thrust.z);
        // const tempVel = new Vector3(localVel.x, localVel.y, localVel.z);
        // const tempVelSqr = new Vector3(tempVel.x, tempVel.y, tempVel.z).length();
        // const dragVel = tempVel.normalize().negate().multiplyScalar((tempVelSqr * this.drag) / 2);
        // this.thrust.add(dragVel);
        // const vel = new Vector3(0, 0, 0).add(localVel).add(dragVel);
        // this.globalVelocity.add(this.localToWorld(vel).sub(this.position).multiplyScalar(delta));
        // this.position.add(this.globalVelocity);

        const thrustVel = new Vector3(0, 0, 0).add(this.thrust);
        this.globalVelocity.add((this.localToWorld(thrustVel).sub(this.position)).multiplyScalar(delta));

        if (this.useDrag){
        const dragVel = (new Vector3().add(this.globalVelocity)).negate().multiplyScalar(this.drag);
        this.globalVelocity.add(dragVel);
        }
        
        this.globalVelocity.clampLength(0, this.bIsTurboBoosting ? this.turboMaxSpeed : this.maxSpeed);
        this.position.add(this.globalVelocity);

        //Rotation Calculations
        const roll = new Vector3(0, 0, 0).add(this.roll);
        this.rotateVelocity.add(roll.multiplyScalar(delta));

        if (this.useDrag){
            const dragRot = (new Vector3().add(this.rotateVelocity)).negate().multiplyScalar(this.rollDrag);
            this.rotateVelocity.add(dragRot);
        }

        this.rotateVelocity.clampLength(0, this.maxRollSpeed);
        this.AddRotation(new Euler().setFromVector3(this.rotateVelocity));      

        //Raycast checks
        if (this.raycaster){
            let hitPlanets = [];
            this.raycaster.setFromCamera(new Vector2(0, 0), this.camera, {far: this.visionDistance});
            this.raycaster.checkAll(hitPlanets, {tag: "interactable"});
            if (hitPlanets.length > 0){
                if (hitPlanets[0].object.parent.name.slice(0, -3) == "Letter"){
                    if (this.focusedPlanet !== hitPlanets[0].object.parent.parent){
                        this.focusedPlanet = hitPlanets[0].object.parent.parent;
                        this.focusedPlanet.AddHoverPanel();
                    }
                }
                else if (this.focusedPlanet !== hitPlanets[0].object.parent){
                    this.focusedPlanet = hitPlanets[0].object.parent; 
                    this.focusedPlanet.AddHoverPanel();
                }
            }
            else{
                if (this.focusedPlanet != null){
                    this.focusedPlanet.RemoveHoverPanel();

                    this.focusedPlanet = null;
                }
            }
        }
    }
}

export {Spaceship};
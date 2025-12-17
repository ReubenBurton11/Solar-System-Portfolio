import { Clock } from "three";

const clock = new Clock();
let bPaused = true;

class Loop{
    constructor(camera, scene, renderer){
        this.camera = camera;
        this.scene  = scene;
        this.renderer = renderer;
        this.updateables = [];
    }

    start() {
        this.renderer.setAnimationLoop(() => {
            this.tick();
            this.renderer.render(this.scene, this.camera);
        });
    } 

    pause() {
        console.log("pause");
        bPaused = true;
    }

    resume() {
        console.log("resume");
        bPaused = false;
    }

    stop() {
        this.renderer.setAnimationLoop(null);
    }

    tick() {
        const delta = clock.getDelta();
        if (!bPaused){
            for (const object of this.updateables)
            {
                object.tick(delta);
            }
        }
    }
}

export {Loop};
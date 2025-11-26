const setSize = (camera, renderer) => {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;


    if (width !== canvas.width || height !== canvas.height){
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    
    renderer.setSize(width, height, false);
    }
}

class Resizer {
    constructor(camera, renderer)
    {
        setSize(camera, renderer);
        window.addEventListener('resize', () => {
            setSize(camera, renderer);
            this.onResize;
        });
    }

    onResize() {}
}

 export {Resizer};
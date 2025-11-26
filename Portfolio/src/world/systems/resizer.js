const setSize = (camera, renderer, maxPixelCount = 3840*2160) => {
    const canvas = renderer.domElement;
    const pixelRatio = window.devicePixelRatio;
    let width = Math.floor(canvas.clientWidth * pixelRatio);
    let height = Math.floor(canvas.clientHeight * pixelRatio);
    const pixelCount = width * height;
    const renderScale = pixelCount > maxPixelCount ? Math.sqrt(maxPixelCount / pixelCount): 1;
    width = Math.floor(width * renderScale);
    height = Math.floor(height * renderScale);


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
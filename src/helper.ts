export const CheckWebGPU = () => {
    let result = 'Your current browser supports WebGPU!';
    if (!navigator.gpu) {
        result = `Your current browser does not support WebGPU!.`;
    } 

    const canvas = <HTMLCanvasElement>document.getElementById('canvas-webgpu');
    if(canvas){
        const div = <HTMLDivElement>document.getElementsByClassName('item2')[0];
        canvas.width  = div.offsetWidth;
        canvas.height = div.offsetHeight;

        function windowResize() {
            canvas.width  = div.offsetWidth;
            canvas.height = div.offsetHeight;
        };
        window.addEventListener('resize', windowResize);
    }
    return result;
}

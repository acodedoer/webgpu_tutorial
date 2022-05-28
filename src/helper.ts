export const CheckWebGPU = () => {
    let result = '';
    if (!navigator.gpu) {
        result = `Your current browser does not support WebGPU!.`;
    } 
    return result;
}

export const InitGPU = async () => {
    const status = CheckWebGPU();
    if(status.includes('Your current browser does not support WebGPU!')){
        throw('No WebGPU Support!');
    }

    const canvas = document.getElementById("canvas-webgpu") as HTMLCanvasElement;
    const adapter = await navigator.gpu?.requestAdapter();
    const device = await adapter?.requestDevice() as GPUDevice;
    const context = canvas.getContext("webgpu") as unknown as GPUCanvasContext;

    const devicePixelRatio = window.devicePixelRatio || 1;
    const size = [
        canvas.clientWidth *devicePixelRatio,
        canvas.clientHeight *devicePixelRatio
    ];
    const format = await navigator.gpu.getPreferredCanvasFormat();

    context.configure({
        device,format
    })

    return {device, canvas, format, context};
}

export const CreateGPUBuffer = (device:GPUDevice, data: Float32Array, usageFlag:GPUBufferUsageFlags = GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST) => {
     const buffer = device.createBuffer({
         size: data.byteLength,
         usage:usageFlag,
         mappedAtCreation: true
     });

     new Float32Array(buffer.getMappedRange()).set(data);
     buffer.unmap();
     return buffer;
}
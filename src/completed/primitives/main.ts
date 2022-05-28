import { CheckWebGPU, InitGPU, CreateGPUBuffer } from "./helper";
import shader from './shader.wgsl'
const head = document.getElementById("id-gpu-check");
head!.innerHTML=CheckWebGPU();

const CreatePrimitive = async (primitiveType = 'point-list') => {
    const gpu = await InitGPU();
    const device = gpu.device;
    const format = gpu.format;

    let indexFormat = undefined;
    if(primitiveType === 'line-strip'){
        indexFormat = 'uint32'
    }
    
    let pipeline: GPURenderPipeline;
    pipeline = device.createRenderPipeline({
        vertex: {
            module: device.createShaderModule({
                code: shader
            }),
            entryPoint: "vs_main"
        },
        fragment: {
            module: device.createShaderModule({
                code: shader
            }),
            entryPoint: "fs_main",
            targets: [{ format }]
        },
        primitive: {
            topology: primitiveType as GPUPrimitiveTopology,
            stripIndexFormat: indexFormat as GPUIndexFormat
        },
        layout: device.createPipelineLayout({bindGroupLayouts:[]}),
    });
    const commandEncoder = device.createCommandEncoder();
    const textureView = gpu.context?.getCurrentTexture().createView() as GPUTextureView;
    const renderPass = commandEncoder.beginRenderPass({
        colorAttachments: [{
            view:textureView,
            clearValue:{r:0.2, g:0.4, b:0.2, a:1.0},
            loadOp: 'clear',
            storeOp:'store'
        }]
    });

    renderPass.setPipeline(pipeline);
    renderPass.draw(6);
    renderPass.end();
    device.queue.submit([commandEncoder.finish()]);
}

CreatePrimitive();
let primitiveSelector = document.getElementById("id-primitive") as HTMLSelectElement;
primitiveSelector.addEventListener("change", (e: any)=>{
    CreatePrimitive(e.srcElement.value)
})


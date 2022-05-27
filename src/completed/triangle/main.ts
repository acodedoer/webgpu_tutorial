import { CheckWebGPU } from "../../helper";
import shader from './shader.wgsl'
const head = document.getElementById("id-gpu-check");
head!.innerHTML=CheckWebGPU();

const CreateTriangle = async() => {
    console.log("called")
    
    const canvas: HTMLCanvasElement | null = document.getElementById("canvas-webgpu") as HTMLCanvasElement;
    const adapter: GPUAdapter | null = await navigator.gpu?.requestAdapter();
    const device: GPUDevice = await adapter?.requestDevice() as GPUDevice;
    const context: GPUCanvasContext | null = canvas.getContext("webgpu");
    const format = 'bgra8unorm';

    context?.configure({
        device,
        format
    });

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
        topology: "triangle-list"
    },
    layout: device.createPipelineLayout({bindGroupLayouts:[]}),
});

const commandEncoder = device.createCommandEncoder();
const textureView = context?.getCurrentTexture().createView() as GPUTextureView;
const renderPass = commandEncoder.beginRenderPass({
    colorAttachments: [{
        view:textureView,
        clearValue:{r:0.2, g:0.4, b:0.2, a:1.0},
        loadOp: 'clear',
        storeOp:'store'
    }]
});

renderPass.setPipeline(pipeline);
renderPass.draw(3,1,0,0);
renderPass.end();

device.queue.submit([commandEncoder.finish()]);
}

CreateTriangle();

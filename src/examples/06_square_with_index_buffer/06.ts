import { CheckWebGPU, InitGPU, CreateGPUBuffer, CreateGPUIndexBuffer } from "../../helper";
import shader from './06.wgsl'
const head = document.getElementById("id-gpu-check");
head!.innerHTML=CheckWebGPU();

export const CreateSquareWithIndexBuffer = async() => {
    const gpu = await InitGPU("canvas-webgpu-06");
    const device = gpu.device;

    const vertexData = new Float32Array([
        -0.5, -0.5,1,0,0, //vertex a
        0.5, -0.5,0,1,0,  //vertex b
        -0.5, 0.5,1,1,0,  //vertex c
        0.5, 0.5, 0,0,1   //vertex d
    ])

    const indexData = new Uint32Array([0,1,2,3,1,2]);

    const vertexBuffer = CreateGPUBuffer(device, vertexData);
    const indexBuffer = CreateGPUIndexBuffer(device, indexData);
    const pipeline = device.createRenderPipeline({
        vertex: {
            module: device.createShaderModule({
                code:shader
            }),
            entryPoint: "vs_main",
            buffers:[ 
                {
                    arrayStride:20,
                    attributes:[{
                        shaderLocation:0,
                        format: "float32x2",
                        offset:0
                    },
                    {
                        shaderLocation:1,
                        format: "float32x2",
                        offset:8
                    }]
                }]
        },
        fragment: {
            module: device.createShaderModule({
                code: shader,
            }),
            entryPoint: "fs_main",
            targets: [
                {
                    format: gpu.format as GPUTextureFormat
                }
            ]
        },
        primitive:{
            topology: "triangle-list"
        },
        layout: device.createPipelineLayout({bindGroupLayouts:[]})
    })
    
    const commandEncoder = device.createCommandEncoder();
    const textureView = gpu.context.getCurrentTexture().createView();
    const renderPass = commandEncoder.beginRenderPass({
        colorAttachments: [{
            view:textureView,
            clearValue:{r:0.2, g:0.4, b:0.2, a:1.0},
            loadOp: 'clear',
            storeOp:'store'
        }]
    })

    renderPass.setPipeline(pipeline);
    renderPass.setVertexBuffer(0, vertexBuffer);
    renderPass.setIndexBuffer(indexBuffer, "uint32");
    renderPass.drawIndexed(6);
    renderPass.end();
    device.queue.submit([commandEncoder.finish()]);
}


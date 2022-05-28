import { CheckWebGPU, InitGPU, CreateGPUBuffer } from "../../helper";
import shader from './shader.wgsl'
const head = document.getElementById("id-gpu-check");
head!.innerHTML=CheckWebGPU();

const CreateSquare = async() => {
    const gpu = await InitGPU();
    const device: GPUDevice = gpu.device;

    const vertexData = new Float32Array([
        -0.5, -0.5,
        0.5, -0.5,
        -0.5, 0.5,
        -0.5, 0.5,
        0.5, -0.5,
        0.5, 0.5
    ])

    const colorData = new Float32Array([
        1,0,0,
        0,1,0,
        1,1,0,
        1,1,0,
        0,1,0,
        0,0,1
    ])

    const vertexBuffer = CreateGPUBuffer(device,vertexData);
    const colorBuffer = CreateGPUBuffer(device, colorData);

    const pipeline = device.createRenderPipeline({
        vertex: {
            module: device.createShaderModule({
                code:shader
            }),
            entryPoint: "vs_main",
            buffers:[ 
                {
                    arrayStride:8,
                    attributes:[{
                        shaderLocation:0,
                        format: "float32x2",
                        offset:0
                    }]
                },
                {
                    arrayStride:12,
                    attributes:[{
                        shaderLocation:1,
                        format: "float32x2",
                        offset:0
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
    renderPass.setVertexBuffer(1, colorBuffer),
    renderPass.draw(6);
    renderPass.end();

    device.queue.submit([commandEncoder.finish()]);
}

CreateSquare();

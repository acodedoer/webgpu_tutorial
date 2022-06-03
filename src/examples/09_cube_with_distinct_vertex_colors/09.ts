import { CheckWebGPU, ReDraw,InitGPU, CubeWithIndex, CreateGPUBuffer, CreateGPUIndexBuffer, CreateTransforms, CreateViewProjection, CubeData } from "../../helper";
import shader from './09.wgsl'
import { mat4, vec3 } from "gl-matrix";
const head = document.getElementById("id-gpu-check");
head!.innerHTML=CheckWebGPU();


export const CreateCubeWithDistinctVertexColors = async(transform: string) => {
    const gpu = await InitGPU("canvas-webgpu-09");
    const device = gpu.device;

    const cubeData = CubeWithIndex();
    const numberOfVertices = cubeData.indexData.length;
    const vertexBuffer = CreateGPUBuffer(device, cubeData.vertexData);
    const indexBuffer = CreateGPUIndexBuffer(device, cubeData.indexData);

    const uniformBindGroupLayout = device.createBindGroupLayout({
        entries: [
            {
                binding: 0,
                visibility: GPUShaderStage.VERTEX,
                buffer:{
                    type:"uniform"
                }
            }
        ]
    });

    const pipeline = device.createRenderPipeline({
        vertex: {
            module: device.createShaderModule({
                code:shader
            }),
            entryPoint: "vs_main",
            buffers:[
                {
                    arrayStride: 24,
                    attributes: [{
                        shaderLocation: 0,
                        format: "float32x3",
                        offset: 0
                    },
                    {
                        shaderLocation: 1,
                        format: "float32x3",
                        offset: 12
                    }]
                }
            ]
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
        depthStencil:{
            format:"depth24plus",
            depthWriteEnabled: true,
            depthCompare: "less"
        },
        layout: device.createPipelineLayout({bindGroupLayouts:[uniformBindGroupLayout]})
    })
    
    const modelMatrix = mat4.create();
    const mvpMatrix = mat4.create();
    let vpMatrix = mat4.create();
    const vp = CreateViewProjection(gpu.canvas.width/gpu.canvas.height);
    vpMatrix = vp.viewProjectionMatrix;
    let rotation = vec3.fromValues(0, 0, 0);   
    let scale = vec3.fromValues(1,1,1);   
    let translation = vec3.fromValues(0, 0, 0);   

    const uniformBuffer = device.createBuffer({
        size: 64,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });


    const uniformBindGroup = device.createBindGroup({
        layout: pipeline.getBindGroupLayout(0),
        entries: [
            {
                binding: 0,
                resource: {
                    buffer: uniformBuffer,
                    offset: 0,
                    size: 64
                }
            }
        ]
    });


    
    let textureView = gpu.context.getCurrentTexture().createView();
    let depthTexture = device.createTexture({
        size: [gpu.canvas.width, gpu.canvas.height, 1],
        format: "depth24plus",
        usage: GPUTextureUsage.RENDER_ATTACHMENT,
    });

    const renderPassDescription = {
        colorAttachments: [{
            view:textureView,
            clearValue:{r:0.2, g:0.4, b:0.2, a:1.0},
            loadOp: 'clear',
            storeOp:'store'
        }],
        depthStencilAttachment:{
            view: depthTexture.createView({
                aspect:"all"
            }),
            depthClearValue: 1.0,
            depthLoadOp: "clear",
            depthStoreOp: "store",
            depthReadOnly: false,
        }
    };

    const draw =()=>{
              
        CreateTransforms(modelMatrix,translation,rotation,scale);
        mat4.multiply(mvpMatrix, vpMatrix, modelMatrix);
        device.queue.writeBuffer(uniformBuffer, 0, mvpMatrix as ArrayBuffer);
        textureView = gpu.context.getCurrentTexture().createView();
        renderPassDescription.colorAttachments[0].view = textureView;

        const commandEncoder = device.createCommandEncoder();
        const renderPass = commandEncoder.beginRenderPass(renderPassDescription as GPURenderPassDescriptor);
        renderPass.setPipeline(pipeline);
        renderPass.setVertexBuffer(0, vertexBuffer);
        renderPass.setIndexBuffer(indexBuffer, 'uint32');
        renderPass.setBindGroup(0, uniformBindGroup);
        renderPass.drawIndexed(numberOfVertices);
        renderPass.end();
        device.queue.submit([commandEncoder.finish()]);
    }

    ReDraw(draw,translation,rotation,scale,transform);
}
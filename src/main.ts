import {CreateSquareWithSingleBuffer} from "./examples/05_square_with_single_buffer/05"
import {CreateSquareWithIndexBuffer} from "./examples/06_square_with_index_buffer/06"
import {CreateCubeWithDistinctFaceColors} from "./examples/07_cube_with_distinct_face_colors/07"
import {CreateCubeWithAnimation} from "./examples/08_cube_with_animation_and_camera_control/08"
import {CreateCubeWithDistinctVertexColors} from "./examples/09_cube_with_distinct_vertex_colors/09"

/////////////////////////   Example 07 Begins   ///////////////////////////////
// const CreateTrianglePrimitive = async (primitiveType = 'triangle-list') => {
//     const gpu = await InitGPU();
//     const device = gpu.device;
//     const format = gpu.format;

//     let indexFormat = undefined;
//     if(primitiveType === 'triangle-strip'){
//         indexFormat = 'uint32'
//     }
    
//     let pipeline: GPURenderPipeline;
//     pipeline = device.createRenderPipeline({
//         vertex: {
//             module: device.createShaderModule({
//                 code: shader
//             }),
//             entryPoint: "vs_main"
//         },
//         fragment: {
//             module: device.createShaderModule({
//                 code: shader
//             }),
//             entryPoint: "fs_main",
//             targets: [{ format }]
//         },
//         primitive: {
//             topology: primitiveType as GPUPrimitiveTopology,
//             stripIndexFormat: indexFormat as GPUIndexFormat
//         },
//         layout: device.createPipelineLayout({bindGroupLayouts:[]}),
//     });
//     const commandEncoder = device.createCommandEncoder();
//     const textureView = gpu.context?.getCurrentTexture().createView() as GPUTextureView;
//     const renderPass = commandEncoder.beginRenderPass({
//         colorAttachments: [{
//             view:textureView,
//             clearValue:{r:0.2, g:0.4, b:0.2, a:1.0},
//             loadOp: 'clear',
//             storeOp:'store'
//         }]
//     });

//     renderPass.setPipeline(pipeline);
//     renderPass.draw(9);
//     renderPass.end();
//     device.queue.submit([commandEncoder.finish()]);
// }
// /////////////////////////   Example 07 Ends   ///////////////////////////////

// /////////////////////////   Example 08 Begins   ///////////////////////////////
// const CreateSquare = async() => {
//     const gpu = await InitGPU();
//     const device: GPUDevice = gpu.device;

//     const vertexData = new Float32Array([
//         -0.5, -0.5,
//         0.5, -0.5,
//         -0.5, 0.5,
//         -0.5, 0.5,
//         0.5, -0.5,
//         0.5, 0.5
//     ])

//     const colorData = new Float32Array([
//         1,0,0,
//         0,1,0,
//         1,1,0,
//         1,1,0,
//         0,1,0,
//         0,0,1
//     ])

//     const vertexBuffer = CreateGPUBuffer(device,vertexData);
//     const colorBuffer = CreateGPUBuffer(device, colorData);

//     const pipeline = device.createRenderPipeline({
//         vertex: {
//             module: device.createShaderModule({
//                 code:shader
//             }),
//             entryPoint: "vs_main",
//             buffers:[ 
//                 {
//                     arrayStride:8,
//                     attributes:[{
//                         shaderLocation:0,
//                         format: "float32x2",
//                         offset:0
//                     }]
//                 },
//                 {
//                     arrayStride:12,
//                     attributes:[{
//                         shaderLocation:1,
//                         format: "float32x2",
//                         offset:0
//                     }]
//                 }]
//         },
//         fragment: {
//             module: device.createShaderModule({
//                 code: shader,
//             }),
//             entryPoint: "fs_main",
//             targets: [
//                 {
//                     format: gpu.format as GPUTextureFormat
//                 }
//             ]
//         },
//         primitive:{
//             topology: "triangle-list"
//         },
//         layout: device.createPipelineLayout({bindGroupLayouts:[]})
//     })

//     const commandEncoder = device.createCommandEncoder();
//     const textureView = gpu.context.getCurrentTexture().createView();
//     const renderPass = commandEncoder.beginRenderPass({
//         colorAttachments: [{
//             view:textureView,
//             clearValue:{r:0.2, g:0.4, b:0.2, a:1.0},
//             loadOp: 'clear',
//             storeOp:'store'
//         }]
//     })

//     renderPass.setPipeline(pipeline);
//     renderPass.setVertexBuffer(0, vertexBuffer);
//     renderPass.setVertexBuffer(1, colorBuffer),
//     renderPass.draw(6);
//     renderPass.end();

//     device.queue.submit([commandEncoder.finish()]);
// }
/////////////////////////   Example 08 Ends   ///////////////////////////////

/////////////////////////   Example 09 Begins   ///////////////////////////////


const project = (document.getElementsByTagName("canvas"))[0].id.slice(-2);
switch(project){
    // case "07":
    //     CreateTrianglePrimitive();
    //     let primitiveSelector = document.getElementById("id-primitive") as HTMLSelectElement;
    //     primitiveSelector.addEventListener("change", (e: any)=>{
    //         CreateTrianglePrimitive(e.srcElement.value)
    //     })
    //     break;
    // case "08":
    //     CreateSquare();
    //     break;
    case "05":
        CreateSquareWithSingleBuffer();
        break;
    case "06":
        CreateSquareWithIndexBuffer();
        break;
    case "07":
        CreateCubeWithDistinctFaceColors();
        window.addEventListener('resize', function(){
            CreateCubeWithDistinctFaceColors();
        });
        break;
    case "08":
        let selector8 = document.getElementById("select-transform") as HTMLSelectElement || document.createElement("select") as HTMLSelectElement;
        let transform8 = selector8.value;

        CreateCubeWithAnimation(transform8);
        window.addEventListener('resize', function(){
            CreateCubeWithAnimation(transform8);
        });

        selector8.addEventListener(("change"),()=>CreateCubeWithAnimation(selector8.value))
        break;
    case "09":
        let selector9= document.getElementById("select-transform") as HTMLSelectElement || document.createElement("select") as HTMLSelectElement;
        let transform9= selector9.value;

        CreateCubeWithDistinctVertexColors(transform9);
        window.addEventListener('resize', function(){
            CreateCubeWithDistinctVertexColors(transform9);
        });

        selector9.addEventListener(("change"),()=>CreateCubeWithDistinctVertexColors(selector9.value))
        break;
}

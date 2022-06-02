import {vec3, mat4} from "gl-matrix";

export const CheckWebGPU = () => {
    let result = '';
    if (!navigator.gpu) {
        result = `Your current browser does not support WebGPU!.`;
    } 
    return result;
}

export const InitGPU = async (id="canvas-webgpu") => {
    const status = CheckWebGPU();
    if(status.includes('Your current browser does not support WebGPU!')){
        throw('No WebGPU Support!');
    }

    const canvas = document.getElementById(id) as HTMLCanvasElement;
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

export const CreateGPUIndexBuffer = (device:GPUDevice, data: Uint32Array, usageFlag:GPUBufferUsageFlags = GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST) => {
     const buffer = device.createBuffer({
         size: data.byteLength,
         usage:usageFlag,
         mappedAtCreation: true
     });

     new Uint32Array(buffer.getMappedRange()).set(data);
     buffer.unmap();
     return buffer;
}

export const CubeData = () =>{
    const positions = new Float32Array([
        // front
        -1, -1,  1,  
         1, -1,  1,  
         1,  1,  1,
         1,  1,  1,
        -1,  1,  1,
        -1, -1,  1,

        // right
         1, -1,  1,
         1, -1, -1,
         1,  1, -1,
         1,  1, -1,
         1,  1,  1,
         1, -1,  1,

        // back
        -1, -1, -1,
        -1,  1, -1,
         1,  1, -1,
         1,  1, -1,
         1, -1, -1,
        -1, -1, -1,

        // left
        -1, -1,  1,
        -1,  1,  1,
        -1,  1, -1,
        -1,  1, -1,
        -1, -1, -1,
        -1, -1,  1,

        // top
        -1,  1,  1,
         1,  1,  1,
         1,  1, -1,
         1,  1, -1,
        -1,  1, -1,
        -1,  1,  1,

        // bottom
        -1, -1,  1,
        -1, -1, -1,
         1, -1, -1,
         1, -1, -1,
         1, -1,  1,
        -1, -1,  1
    ]);

    const colors = new Float32Array([
        // front - blue
        1, 0, 1,
        1, 0, 1,
        1, 0, 1,
        1, 0, 1,
        1, 0, 1,
        1, 0, 1,

        // right - red
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,

        //back - yellow
        1, 1, 0,
        1, 1, 0,
        1, 1, 0,
        1, 1, 0,
        1, 1, 0,
        1, 1, 0,

        //left - aqua
        0, 1, 1,
        0, 1, 1,
        0, 1, 1,
        0, 1, 1,
        0, 1, 1,
        0, 1, 1,

        // top - green
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,

        // bottom - fuchsia
        1, 0, 1,
        1, 0, 1,
        1, 0, 1,
        1, 0, 1,
        1, 0, 1,
        1, 0, 1
    ]);

    return {
        positions,
        colors
    };
}



export const GenerateCubeVertices = (origin:Array<number>, dimension:number) => {
    const halfDimension =dimension*0.5
    const top = origin[1]+halfDimension;
    const bottom = origin[1] -halfDimension;
    const right = origin[0]+halfDimension;
    const left = origin[0] -halfDimension;
    const front = origin[2]+halfDimension;
    const back = origin[2] -halfDimension;

    const TRF=[ right,top, front];
    const TLF = [ left, top,front];
    const TRB = [ right,top, back];
    const TLB = [ left, top,back]
    const BRF=[ right,bottom, front];
    const BLF = [ left, bottom,front];
    const BRB = [ right,bottom, back];
    const BLB = [ left, bottom,back]

    return new Float32Array([
        ...TLB,...TLF,...TRF,
        ...TLB,...TRF, ...TRB,
        ...BLF,...BLB, ...BRF,
        ...BRF,...BLB, ...BRB,

        ...TLB,...BLB,...BLF,
        ...TLB,...BLF,...TLF,
        ...BRB,...TRB,...BRF,
        ...BRF,...TRB,...TRF,

        ...BLB,...TLB,...TRB,
        ...BLB,...TRB,...BRB,
        ...TLF,...BLF,...TRF,
        ...TRF,...BLF,...BRF,
    ])
}

export const CreateTransforms = (modelMat:mat4, translation:vec3 = [0,0,0], rotation:vec3 = [0,0,0], scaling:vec3 = [1,1,1]) => {
    const rotateXMat = mat4.create();
    const rotateYMat = mat4.create();
    const rotateZMat = mat4.create();   
    const translateMat = mat4.create();
    const scaleMat = mat4.create();

    //perform individual transformations
    mat4.fromTranslation(translateMat, translation);
    mat4.fromXRotation(rotateXMat, rotation[0]);
    mat4.fromYRotation(rotateYMat, rotation[1]);
    mat4.fromZRotation(rotateZMat, rotation[2]);
    mat4.fromScaling(scaleMat, scaling);

    //combine all transformation matrices together to form a final transform matrix: modelMat
    mat4.multiply(modelMat, rotateXMat, scaleMat);
    mat4.multiply(modelMat, rotateYMat, modelMat);        
    mat4.multiply(modelMat, rotateZMat, modelMat);
    mat4.multiply(modelMat, translateMat, modelMat);
};

export const CreateViewProjection = (respectRatio = 1.0, cameraPosition:vec3 = [2, 2, 4], lookDirection:vec3 = [0, 0, 0], 
    upDirection:vec3 = [0, 1, 0]) => {

    const viewMatrix = mat4.create();
    const projectionMatrix = mat4.create();       
    const viewProjectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, 2*Math.PI/5, respectRatio, 0.1, 100.0);

    mat4.lookAt(viewMatrix, cameraPosition, lookDirection, upDirection);
    mat4.multiply(viewProjectionMatrix, projectionMatrix, viewMatrix);

    const cameraOption = {
        eye: cameraPosition,
        center: lookDirection,
        zoomMax: 100,
        zoomSpeed: 2
    };

    return {
        viewMatrix,
        projectionMatrix,
        viewProjectionMatrix,
        cameraOption
    }
};
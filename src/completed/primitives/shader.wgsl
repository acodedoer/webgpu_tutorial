// vertex shader
struct Output {
    @builtin(position) Position : vec4<f32>,
    @location(0) vColor : vec4<f32>
};

@stage(vertex)
fn vs_main(@builtin(vertex_index) VertexIndex: u32) -> Output{
    var pos : array<vec2<f32>, 6> = array<vec2<f32>, 6>(
        vec2<f32>(-0.5, 0.7),
        vec2<f32>(0.3, 0.6),
        vec2<f32>(0.5, 0.3),
        vec2<f32>(0.4, -0.5),
        vec2<f32>(-0.4, -0.4),
        vec2<f32>(-0.3, 0.2),
    );

    var output: Output;
    output.Position = vec4<f32>(pos[VertexIndex], 0.0, 1.0);
    output.vColor = vec4<f32>(1.0,0.0,0.0,1.0);
    return output;
}

// fragment shader

@stage(fragment)
fn fs_main(@location(0) vColor: vec4<f32>) -> @location(0) vec4<f32> {
    return vColor;
}
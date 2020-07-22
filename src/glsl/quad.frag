precision mediump float;

uniform sampler2D mapTexture;
varying vec2 v_tex_pos;


void main() {
    vec4 tex = texture2D(mapTexture, vec2(v_tex_pos.x, v_tex_pos.y));
    gl_FragColor = vec4(tex.rgb, 1.0);
}

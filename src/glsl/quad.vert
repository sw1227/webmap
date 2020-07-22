precision mediump float;
attribute vec2 position;
attribute vec2 tex;
varying vec2 v_tex_pos;
uniform float offsetX;
uniform float offsetY;

void main() {
    v_tex_pos = tex;
    gl_Position = vec4(2.0 * (position + vec2(offsetX, -offsetY)) - 1.0, 0, 1);
}

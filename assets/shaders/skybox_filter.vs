precision highp float;

attribute vec2 inPosition;

varying vec4 outPosition;

void main()
{
    outPosition = vec4(inPosition, 1.0, 1.0);
    gl_Position = outPosition;
}
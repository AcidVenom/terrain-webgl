attribute vec2 inPosition;
varying vec2 outPosition;

void main()
{
    outPosition = inPosition;
    gl_Position = vec4(inPosition, 1.0, 1.0);
}
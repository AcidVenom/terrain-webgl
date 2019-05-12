attribute vec2 inPosition;

varying vec3 outNormal;
varying vec2 outTexCoord;

uniform vec2 MapSize;

uniform sampler2D tex0;

#define HEIGHT_SCALE 100.0

vec2 get_uv(vec2 p)
{
    return max(vec2(0.0), min(vec2(1.0), (p + MapSize * 0.5) / MapSize));
}

float get_height(vec2 p)
{
    vec2 uv = get_uv(p);
    return texture2D(tex0, uv).r * HEIGHT_SCALE;
}

vec3 calculate_normal(vec2 p)
{
    vec3 v1 = vec3(p.x, 0.0, p.y);
    vec3 v2 = vec3(p.x + 1.0, 0.0, p.y);
    vec3 v3 = vec3(p.x, 0.0, p.y - 1.0);

    v1.y = get_height(v1.xz);
    v2.y = get_height(v2.xz);
    v3.y = get_height(v3.xz);

    vec3 e1 = v2 - v1;
    vec3 e2 = v3 - v1;

    return cross(e1, e2);
}

void main()
{
    
    gl_Position = Projection * View * Model * vec4(vec3(inPosition.x, get_height(inPosition), inPosition.y), 1.0);
    outNormal = calculate_normal(inPosition);
    outTexCoord = get_uv(inPosition);
}
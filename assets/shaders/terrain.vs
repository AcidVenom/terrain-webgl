attribute vec2 inPosition;

varying mat3 outTBN;
varying vec3 outWorld;

uniform vec2 MapSize;

uniform sampler2D tex0;

#define HEIGHT_SCALE 150.0

vec2 get_uv(vec2 p)
{
    vec2 size = MapSize + 1.0;
    return max(vec2(0.0), min(vec2(1.0), (p + size * 0.5) / size));
}

float get_height(vec2 p)
{
    vec2 uv = get_uv(p);
    return texture2D(tex0, uv).r * HEIGHT_SCALE;
}

vec3 calculate_normal(vec2 p, out vec3 tangent, out vec3 bitangent)
{
    vec2 size = MapSize - vec2(1.0);
    p = get_uv(p) * size - size * 0.5;
    vec3 v1 = vec3(p.x, 0.0, p.y);
    vec3 v2 = vec3(p.x + 1.0, 0.0, p.y);
    vec3 v3 = vec3(p.x, 0.0, p.y - 1.0);

    v1.y = get_height(v1.xz);
    v2.y = get_height(v2.xz);
    v3.y = get_height(v3.xz);

    vec3 e1 = v2 - v1;
    vec3 e2 = v3 - v1;

    tangent = normalize(e1);
    bitangent = normalize(e2);

    return normalize(cross(e1, e2));
}

void main()
{
    vec4 worldPos = vec4(vec3(inPosition.x, get_height(inPosition), inPosition.y), 1.0);
    worldPos = Model * worldPos;

    gl_Position = Projection * View * worldPos;

    vec3 tangent, bitangent;
    vec3 normal = calculate_normal(inPosition, tangent, bitangent);

    vec3 T = InvTransposedModel * tangent;
    vec3 B = InvTransposedModel * bitangent;
    vec3 N = InvTransposedModel * normal;

    outTBN = mat3(T, B, N);
    outWorld = worldPos.xyz;
}
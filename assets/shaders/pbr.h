#define PI 3.14159

float cook_torrance(vec3 P, vec3 N, vec3 L, float RF, float MF, float SF)
{
    float NL = max(0.0, dot(N, L));
    vec3 eyeDir = normalize(EyePosition - P);
    vec3 H = normalize(L + eyeDir);

    float NH = max(0.0, dot(N, H));
    float NV = max(0.0, dot(N, eyeDir));
    float VH = max(0.0, dot(eyeDir, H));

    float NH2 = 2.0 * NH;
    float G1 = (NH2 * NV) / VH;
    float G2 = (NH2 * NL) / VH;

    float G = min(min(G1, G2), 1.0);

    float rSq = RF * RF;
    float NHSq = NH * NH;

    float R1 = 1.0 / (4.0 * rSq * pow(NH, 4.0));
    float R2 = (NHSq - 1.0) / (rSq * NHSq);

    float R = R1 * exp(R2);

    float F = pow(1.0 - VH, 5.0);
    F *= (1.0 - MF);
    F += MF;

    float S = max(0.0, (F * G * R) / (NV * NL * PI));

    return NL * (SF + S * (1.0 - SF));
}
//CRT Scan Line by Zuawara (Moritz)
//#include "common.hlsli"

varying vec2 v_TexCoord;
uniform sampler2D g_Texture0;
uniform float g_Time;

uniform float u_noiseScale;           // {"default":"1.","material":"Noise Scale","range":[0.10000000000000001,5.0]}
uniform float u_noiseIntensity;       // {"default":"0.8","material":"Noise Intensity","range":[0.0,1.0]}
uniform float u_scanLineWidth;        // {"default":"5.","material":"Scan Line Size","range":[0.10000000000000001,20.0]}
uniform float u_scanLineSpeed;        // {"default":"20.","material":"Scan Line Speed","range":[0.0,100.0]}
uniform float u_scanLineIntensity;    // {"default":"0.05","material":"Scan Line Intensity","range":[0.0,1.0]}

uniform float u_vignetteIntensity;    // {"default":"1.0","material":"Vignette Intensity","range":[0.0,5.0]}

float u_mod(float x, float y) {
    return x - y * floor(x/y);
}

float hash12(vec2 p)
{
	vec3 p3  = frac(CAST3(p.xyx) * .1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return frac((p3.x + p3.y) * p3.z);
}

void main() {
    float nS = u_noiseScale / 1000.;
    float sLW = u_scanLineWidth / 1000.;
    float sLS = u_scanLineSpeed / 1000.;

	gl_FragColor = texSample2D(g_Texture0, v_TexCoord);

    // add noise
    gl_FragColor += vec4((CAST3(hash12(floor(v_TexCoord / nS) + g_Time)) - 0.5) * u_noiseIntensity / 2., 1.0);

    // scanlines
    gl_FragColor *= floor(u_mod(v_TexCoord.y + g_Time * sLS, sLW * 2.0) / sLW) * u_scanLineIntensity + (1.0 - u_scanLineIntensity);
    
    // vignette
    float cd = pow(length(abs(v_TexCoord - CAST2(0.5)) * 1.25), 3.0) * u_vignetteIntensity;
    gl_FragColor -= vec4(CAST3(cd), 0.0);
}


//// Hash without Sine
//// MIT License...
///* Copyright (c)2014 David Hoskins.

//Permission is hereby granted, free of charge, to any person obtaining a copy
//of this software and associated documentation files (the "Software"), to deal
//in the Software without restriction, including without limitation the rights
//to use, copy, modify, merge, publish, distribute, sublicense, and/or sell

//copies of the Software, and to permit persons to whom the Software is
//furnished to do so, subject to the following conditions:

//The above copyright notice and this permission notice shall be included in all
//copies or substantial portions of the Software.

//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
//SOFTWARE.*/

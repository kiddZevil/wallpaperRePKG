
// [COMBO] {"material":"ui_editor_properties_invert","combo":"INVERT","type":"options","default":0}
// [COMBO] {"material":"ui_editor_properties_flatten","combo":"FLATTEN","type":"options","default":0}

varying vec2 v_TexCoord;

uniform sampler2D g_Texture0; // {"hidden":true}

uniform float g_KeyAlpha; // {"material":"alpha","label":"ui_editor_properties_write_alpha","default":0,"range":[0,1]}
uniform float g_KeyFuzz; // {"material":"fuzziness","label":"ui_editor_properties_fuzziness","default":0,"range":[0,3]}
uniform float g_KeyTolerance; // {"material":"tolerance","label":"ui_editor_properties_tolerance","default":0.1,"range":[0,3]}
uniform vec3 g_KeyColor; // {"material":"color","label":"ui_editor_properties_color", "type": "color", "default":"1 1 1"}

void main() {
	vec4 albedo = texSample2D(g_Texture0, v_TexCoord.xy);
	
	float delta = dot(abs(g_KeyColor - albedo.rgb), vec3(1, 1, 1));
	float blend = smoothstep(0.001, 0.002 + g_KeyFuzz, delta - g_KeyTolerance);
	
#if INVERT == 1
	blend = 1.0 - blend;
#endif
	
	albedo.a *= mix(g_KeyAlpha, 1.0, blend);
	
#if FLATTEN == 1
	albedo.rgb *= albedo.a;
#endif
	
	gl_FragColor = albedo;
}

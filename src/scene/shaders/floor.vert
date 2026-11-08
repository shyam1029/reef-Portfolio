varying float vElevation;
varying vec3 vWorldPosition;

void main() {
  vElevation = position.z;
  vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * viewMatrix * vec4(vWorldPosition, 1.0);
}

var triangle = require('a-big-triangle')
var createShader = require('gl-shader')
var glslify = require('glslify')
var loop = require('raf-loop')

var gl = require('webgl-context')({
  width: 512,
  height: 512
})

document.body.appendChild(gl.canvas)

var time = 0
var image = require('baboon-image').transpose(1, 0, 2)
var texture = require('gl-texture2d')(gl, image)
texture.wrapS = texture.wrapT = gl.REPEAT

var shader = createShader(gl, glslify('./demo.vert'), glslify('./demo.frag'))
shader.bind()
shader.uniforms.iResolution = [gl.drawingBufferWidth, gl.drawingBufferHeight, 0]
shader.uniforms.iGlobalTime = time
shader.uniforms.iChannel0 = 0
start()

function start() {
  loop(render).start()

  function render(dt) {
    var width = gl.drawingBufferWidth
    var height = gl.drawingBufferHeight
    gl.viewport(0, 0, width, height)

    texture.bind()
    shader.bind()
    shader.uniforms.iGlobalTime = (time += dt) / 1000
    triangle(gl)
  }
}


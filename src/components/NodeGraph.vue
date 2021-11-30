<template>
  <div class="node-graph" @wheel.prevent="backgroundMousewheel">
    <div
      class="node-graph__background"
      @mousedown.left.prevent="backgroundMousedown"
    />
    <div
      :class="['node-graph__canvas', canvasMoving ? 'node-graph__canvas--moving' : '']"
      :style="{
        transform: `translate(${canvas.x}px, ${canvas.y}px)scale(${1 / canvas.zoom})`
      }"
    >
      <ConnectionRenderer
        v-for="(connection, i) in connections"
        :key="i"
        :a="connection.a"
        :b="connection.b"
        :nodes="nodes"
        :nodeRendererEls="nodeRendererEls"
        :canvas="canvas"
      />
      <transition-group name="node">
        <NodeRenderer
          v-for="node in nodes"
          :ref="(el) => { if (el && !nodeRendererEls.find(x => x.id === el.id)) { nodeRendererEls.push(el) } }"
          :key="node.id"
          :id="node.id"
          :type="node.type"
          :name="node.node.name"
          :inputs="node.node.inputs"
          :outputs="node.node.outputs"
          :inputValues="nodeEls.find(x => x.id === node.id).inputValues"
          :outputValues="nodeEls.find(x => x.id === node.id).outputValuesDelay"
          :selectedPoints="selectedPoints"
          @inputPointClick="inputPointClick"
          @outputPointClick="outputPointClick"
          @addInput="node.node.outputs.push(''); clearPointSelection()"
          @addOutput="node.node.inputs.push(''); clearPointSelection()"
          @toggleInput="toggleInput"
          @outputTextChanged="outputTextChanged"
          @inputTextChanged="inputTextChanged"

          :style="{
            top: ((node.position || {}).y || 0) + 'px',
            left: ((node.position || {}).x || 0) + 'px'
          }"
          @mousedown.left="(e) => nodeTouchstartMousedown(e, node)"
          @touchstart="(e) => nodeTouchstartMousedown(e, node)"

          :class="selectedNode === node.id ? 'node--selected' : ''"
        />
      </transition-group>
      <Node
        v-for="node in nodes"
        :ref="(el) => { if (el) { nodeEls.push(el) } }"
        :key="node.id"
        :nodes="nodeEls"
        :id="node.id"
        :type="node.type"
        :name="node.node.name"
        :inputs="node.node.inputs"
        :outputs="node.node.outputs"
        :function="node.node.function"
        :outgoingPoints="node.outgoingPoints"
      />
    </div>
  </div>
</template>

<script>
import Node from './Node.vue'
import NodeRenderer from './NodeRenderer.vue'
import ConnectionRenderer from './ConnectionRenderer.vue'

export default {
  components: {
    Node,
    NodeRenderer,
    ConnectionRenderer
  },
  computed: {
    connections () {
      var connections = []

      this.nodes.forEach(x => {
        if (x.outgoingPoints) {
          x.outgoingPoints.forEach(p => {
            connections.push({
              a: { id: x.id, i: p.i },
              b: { id: p.p.id, i: p.p.i }
            })
          })
        }
      })

      return connections
    }
  },
  data: () => ({
    nodes: [],
    nodeEls: [],
    nodeRendererEls: [],
    selectedPoints: {
      input: null,
      output: null
    },
    selectedNode: null,
    moving: false,
    canvasMoving: false,
    canvas: {
      zoom: 1,
      x: 0,
      y: 0
    },
    clipboard: null,
    history: [],
    historyIndex: 0
  }),
  watch: {
    nodes: {
      deep: true,
      handler (val) {
        this.generateInOutputNodes()
        this.generateIds()
        this.checkConnections()
      }
    },
    selectedNode (val) {
      if (val) {
        var i = this.nodes.findIndex(x => x.id === val)
        if (i !== this.nodes.length - 1) this.nodes.push(this.nodes.splice(i, 1)[0])
      }
    },
    historyIndex (val) {
      this.nodes = this.history[val]
    }
  },
  methods: {
    generateInOutputNodes () {
      if (!this.nodes.find(x => x.type === 'inputs')) {
        this.nodes.push({
          type: 'inputs',
          node: {
            name: '',
            inputs: [],
            outputs: []
          }
        })
      }
      if (!this.nodes.find(x => x.type === 'outputs')) {
        this.nodes.push({
          type: 'outputs',
          node: {
            name: '',
            inputs: [],
            outputs: []
          }
        })
      }
    },
    generateIds () {
      this.nodes.forEach(x => {
        if (!x.id) x.id = this.generateId()
      })
    },
    generateId () {
      return Math.random().toString(32).replace('0.', '')
    },
    inputPointClick (id, i) {
      this.selectedPoints.input = { id, i }
      this.tryConnectPoints()
    },
    outputPointClick (id, i) {
      this.selectedPoints.output = { id, i }
      this.tryConnectPoints()
    },
    tryConnectPoints () {
      var inp = this.selectedPoints.input
      var outp = this.selectedPoints.output

      // Check if both point are selected
      if (inp && outp) {
        // Check if input node is not output node
        if (inp.id !== outp.id) {
          var node = this.nodes.find(x => x.id === outp.id)

          if (node) {
            if (!node.outgoingPoints) node.outgoingPoints = []

            var connection = {
              i: outp.i,
              p: {
                id: inp.id,
                i: inp.i
              }
            }

            var index = node.outgoingPoints.findIndex(x =>
              x.i === connection.i &&
              x.p.id === connection.p.id &&
              x.p.i === connection.p.i)

            if (index >= 0) {
              // Remove connection
              this.nodeEls.find(y => y.id === connection.p.id).inputChanged(false, connection.p.i)

              node.outgoingPoints.splice(index, 1)
            } else {
              // Remove all existing connections to input node
              this.nodes.forEach(x => {
                if (x.outgoingPoints) {
                  var p = x.outgoingPoints.findIndex(y => y.p.id === inp.id && y.p.i === inp.i)

                  if (p >= 0) {
                    x.outgoingPoints.splice(p, 1)
                  }
                }
              })

              node.outgoingPoints.push(connection)
            }
          }
        }

        this.selectedPoints.input = null
        this.selectedPoints.output = null

        this.recordHistory()
      }
    },
    checkConnections () {
      this.nodes.forEach(x => {
        if (x.outgoingPoints) {
          x.outgoingPoints.forEach((p, i) => {
            if (!this.nodes.find(y => y.id === p.p.id)) {
              x.outgoingPoints.splice(i, 1)
            }
          })
        }
      })
    },
    addNode (node, position) {
      if (!position) {
        var rect = this.$el.getBoundingClientRect()

        position = {
          x: ((rect.width / 2) - 100 - this.canvas.x) * this.canvas.zoom,
          y: ((rect.height / 2) - 100 - this.canvas.y) * this.canvas.zoom
        }
      }

      const _this = this
      var offsetNode = 0

      checkPosition()

      function checkPosition () {
        var posx = position.x + offsetNode * 20
        var posy = position.y + offsetNode * 20

        if (_this.nodes.some(x => (x.position || {}).x === posx && (x.position || {}).y === posy)) {
          offsetNode++
          checkPosition()
        }
      }

      var nodeObj = {
        id: this.generateId(),
        node,
        position: {
          x: position.x + offsetNode * 20,
          y: position.y + offsetNode * 20
        }
      }
      this.nodes.push(nodeObj)
      this.selectedNode = nodeObj.id

      this.recordHistory()
    },
    removeNode (id) {
      var i = this.nodes.findIndex(x => x.id === id)

      if (this.nodes[i].type === 'inputs' || this.nodes[i].type === 'outputs') return

      if (this.nodes[i].outgoingPoints) {
        this.nodes[i].outgoingPoints.forEach(p => {
          var n = this.nodeEls.find(x => x.id === p.p.id)

          if (n) {
            n.inputChanged(false, p.p.i)
          }
        })
      }

      this.nodes.splice(i, 1)

      this.recordHistory()
    },
    copyToClipboard (id) {
      var node = this.nodes.find(x => id === x.id)

      this.clipboard = {
        node: node.node,
        position: {
          x: ((node.position || {}).x || 0),
          y: ((node.position || {}).y || 0)
        }
      }
    },
    pasteFromClipboard () {
      this.addNode(this.clipboard.node, this.clipboard.position)
    },
    recordHistory () {
      this.history.splice(0, this.historyIndex)

      var nodes = []
      this.nodes.forEach(x => nodes.push({ ...x, position: { ...x.position } }))

      this.history.unshift(nodes)
      this.historyIndex = 0
    },
    undo () {
      if (this.historyIndex < this.history.length - 1) this.historyIndex++
    },
    redo () {
      if (this.historyIndex > 0) this.historyIndex--
    },
    nodeTouchstartMousedown (e, node) {
      if (this.moving) return

      const _this = this

      this.selectedNode = node.id

      if (e.srcElement.nodeName === 'BUTTON' ||
        e.srcElement.nodeName === 'INPUT') return

      e.preventDefault()

      var startPos = node.position || { x: 0, y: 0 }

      var touchId
      var clientStart = {
        x: e.clientX,
        y: e.clientY
      }

      if (e.type === 'touchstart') {
        touchId = e.changedTouches[0].identifier

        clientStart = {
          x: e.changedTouches[0].clientX,
          y: e.changedTouches[0].clientY
        }

        console.log(touchId)

        document.addEventListener('touchmove', docMove)
        document.addEventListener('touchend', docTouchend)
      } else {
        document.addEventListener('mousemove', docMove)
        document.addEventListener('mouseup', docMouseup)
      }

      var offset = {
        x: startPos.x - clientStart.x * _this.canvas.zoom,
        y: startPos.y - clientStart.y * _this.canvas.zoom
      }

      this.moving = false

      function docMove (e2) {
        var client = {
          x: e2.clientX,
          y: e2.clientY
        }
        if (e2.type === 'touchmove') {
          var touch = Array.from(e2.touches).find(x => x.identifier === touchId)
          client = {
            x: touch.clientX,
            y: touch.clientY
          }
        }

        var delta = {
          x: (client.x - clientStart.x) * _this.canvas.zoom,
          y: (client.y - clientStart.y) * _this.canvas.zoom
        }
        var distance = Math.sqrt(delta.x ** 2 + delta.y ** 2)

        if (distance < 10 && !_this.moving) return
        _this.moving = true

        node.position = {
          x: offset.x + client.x * _this.canvas.zoom,
          y: offset.y + client.y * _this.canvas.zoom
        }
      }
      function docMouseup (e3) {
        _this.moving = false
        document.removeEventListener('mousemove', docMove)
        document.removeEventListener('mouseup', docMouseup)

        _this.recordHistory()
      }
      function docTouchend (e3) {
        if (Array.from(e3.touches).find(x => x.identifier === touchId)) return

        _this.moving = false
        document.removeEventListener('touchmove', docMove)
        document.removeEventListener('touchend', docTouchend)

        _this.recordHistory()
      }
    },
    __nodeTouchstart (e, node) {
      if (this.moving) return
      this.moving = true

      const _this = this

      var touchId = e.changedTouches[0].identifier

      this.selectedNode = node.id

      var startPos = node.position || { x: 0, y: 0 }
      var clientStart = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY
      }
      var offset = {
        x: startPos.x - clientStart.x,
        y: startPos.y - clientStart.y
      }

      e.preventDefault()
      document.addEventListener('touchmove', docTouchmove)
      document.addEventListener('touchend', docTouchend)

      var move = false

      function docTouchmove (e2) {
        var touch = Array.from(e2.touches).find(x => x.identifier === touchId)

        var distance = Math.sqrt((touch.clientX - clientStart.x) ** 2 + (touch.clientY - clientStart.y) ** 2)

        if (distance < 20 && !move) return
        move = true

        node.position = {
          x: offset.x + touch.clientX,
          y: offset.y + touch.clientY
        }
      }
      function docTouchend (e3) {
        if (Array.from(e3.touches).find(x => x.identifier === touchId)) return

        _this.moving = false
        document.removeEventListener('touchmove', docTouchmove)
        document.removeEventListener('touchend', docTouchend)
      }
    },
    backgroundMousedown (e) {
      if (!this.nodes.length) return

      const _this = this

      var clientStart = {
        x: e.clientX,
        y: e.clientY
      }

      var canvasStart = {
        x: _this.canvas.x,
        y: _this.canvas.y
      }

      document.addEventListener('mousemove', docMousemove)
      document.addEventListener('mouseup', docMouseup)

      function docMousemove (e2) {
        var delta = {
          x: e2.clientX - clientStart.x,
          y: e2.clientY - clientStart.y
        }
        var distance = Math.sqrt(delta.x ** 2 + delta.y ** 2)

        if (distance < 10 && !_this.canvasMoving) return
        _this.canvasMoving = true

        _this.canvas.x = canvasStart.x + delta.x
        _this.canvas.y = canvasStart.y + delta.y
      }
      function docMouseup (e3) {
        if (!_this.canvasMoving) {
          _this.selectedNode = null
          _this.clearPointSelection()
        }

        document.removeEventListener('mousemove', docMousemove)
        document.removeEventListener('mouseup', docMouseup)
        _this.canvasMoving = false
      }
    },
    backgroundMousewheel (e) {
      if (!this.nodes.length) return
      if (this.moving) return

      // var dir = e.deltaY === 0 ? 0 : (e.deltaY > 0 ? 1 : -1)

      var target = this.canvas.zoom + e.deltaY / 1000

      if (target > 0.5 && target < 10) {
        var zoomDelta = target / this.canvas.zoom
        console.log(zoomDelta)

        this.canvas.x = (this.canvas.x - e.clientX) / zoomDelta + e.clientX
        this.canvas.y = (this.canvas.y - e.clientY) / zoomDelta + e.clientY

        this.canvas.zoom = target
      }
    },
    docKeydown (e) {
      const _this = this

      var keybinds = [
        // COPY: CTRL C
        {
          bind: () => e.key === 'c' && e.ctrlKey,
          function () {
            if (_this.selectedNode) {
              _this.copyToClipboard(_this.selectedNode)
            }
          }
        },
        // PASTE: CTRL V
        {
          bind: () => e.key === 'v' && e.ctrlKey,
          function: () => _this.pasteFromClipboard()
        },
        // CUT: CTRL X
        {
          bind: () => e.key === 'x' && e.ctrlKey,
          function () {
            if (_this.selectedNode) {
              _this.copyToClipboard(_this.selectedNode)

              _this.removeNode(_this.selectedNode)
            }
          }
        },
        // DELETE: DEL
        {
          bind: () => e.key === 'Delete',
          function () {
            if (_this.selectedNode) {
              _this.removeNode(_this.selectedNode)
            }
          }
        }
        // UNDO: CTRL Z
        // {
        //   bind: () => e.key === 'z' && e.ctrlKey,
        //   function: () => _this.undo()
        // },
        // // REDO: CTRL SHIFT Z
        // {
        //   bind: () => e.key === 'Z' && e.ctrlKey && e.shiftKey,
        //   function: () => _this.redo()
        // }
      ]

      if (e.srcElement.nodeName === 'INPUT') return
      console.log('[KEYPRESS]', e)

      var keybind = keybinds.find(x => x.bind())
      if (keybind) keybind.function()
    },
    clearPointSelection () {
      this.selectedPoints.input = null
      this.selectedPoints.output = null
    },
    toggleInput (id, i) {
      var inputValues = this.nodeEls.find(x => x.id === id).inputValues
      inputValues[i] = !inputValues[i]
    },
    outputTextChanged (id, text, i) {
      this.nodes.find(x => x.id === id).node.outputs[i] = text
    },
    inputTextChanged (id, text, i) {
      this.nodes.find(x => x.id === id).node.inputs[i] = text
    }
  },
  beforeUpdate (e) {
    this.nodeEls = []
    this.nodeRendererEls = []
  },
  mounted () {
    this.recordHistory()
    this.generateInOutputNodes()
    document.addEventListener('keydown', this.docKeydown)
  },
  unmounted () {
    document.removeEventListener('keydown', this.docKeydown)
  }
}
</script>

<style lang="scss" scoped>
.node-graph {
  user-select: none;

  &__background {
    height: 100%;
  }

  &__canvas {
    position: absolute;
    top: 0;
    pointer-events: none;
    transition: transform .2s;

    &--moving {
      transition: none;
    }
  }

  :deep(.node) {
    z-index: 1;
    position: absolute;
    cursor: move;
    pointer-events: all;
  }
}
</style>

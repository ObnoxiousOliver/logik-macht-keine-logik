<template>
  <div :class="['node-graph', readonly ? 'node-graph--readonly' : '']" @wheel.prevent="backgroundMousewheel">
    <div
      class="node-graph__background"
      @mousedown.left.prevent="backgroundMousedown"
    >
      <div v-if="inspectingNode" class="node-graph__inspecting-node">
        <small v-if="readonly">(Schreibgeschützt)</small>
        <small v-else>(Bearbeitbar)</small>
        <br>
        {{ inspectingNode }}
      </div>
    </div>
    <div
      :class="['node-graph__canvas', canvasMoving ? 'node-graph__canvas--moving' : '']"
      :style="{
        transform: `translate(${canvas.x}px, ${canvas.y}px)scale(${1 / canvas.zoom})`
      }"
    >
      <ConnectionRenderer
        v-for="connection in connections"
        :key="(connection.b.id + connection.b.i)
          || ('_' + connection.a.id + connection.a.i)
          || ('_' + connection.a.x + connection.a.y)
          || ('_' + connection.b.x + connection.b.y)"
        :a="connection.a"
        :b="connection.b"
        :active="(outputValues[connection.a.id] || [])[connection.a.i]"
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
          :node="node.node"
          :inputValues="nodeEls.find(x => x.id === node.id).inputValues"
          :outputValues="nodeEls.find(x => x.id === node.id).outputValuesDelay"
          :selectedPoints="selectedPoints"
          :inputs_="node.type === 'outputs' ? outputs : null"
          :outputs_="node.type === 'inputs' ? inputs : null"
          :readonly="readonly"
          @inputPointClick="(id, i, e) => { if (!readonly) inputPointClick(id, i, e) }"
          @outputPointClick="(id, i, e) => { if (!readonly) outputPointClick(id, i, e) }"
          @inputPointMouseup="(id, i, e) => { if (!readonly) inputPointMouseup(id, i, e) }"
          @outputPointMouseup="(id, i, e) => { if (!readonly) outputPointMouseup(id, i, e) }"
          @addInput="() => { if (!readonly) inputs.push(''); clearPointSelection() }"
          @addOutput="() => { if (!readonly) outputs.push(''); clearPointSelection() }"
          @toggleInput="(id, i) => { toggleInput(id, i) }"
          @outputTextChanged="(id, text, e) => { if (!readonly) outputTextChanged(id, text, e) }"
          @inputTextChanged="(id, text, e) => { if (!readonly) inputTextChanged(id, text, e) }"
          @dblclick="$emit('inspectNode', node.id)"

          :style="{
            top: ((node.position || {}).y || 0) + 'px',
            left: ((node.position || {}).x || 0) + 'px'
          }"
          @mousedown.left="(e) => { if (!readonly) nodeTouchstartMousedown(e, node) }"
          @touchstart="(e) => { if (!readonly) nodeTouchstartMousedown(e, node) }"

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
        :node="node.node"
        :delay="0"
        :outgoingPoints="node.outgoingPoints"
        @outputChanged="(x) => outputValues[node.id] = x"
      />
      <!-- :name="node.node.name"
      :inputs="node.node.inputs"
      :outputs="node.node.outputs"
      :function="node.node.function" -->
    </div>
  </div>
</template>

<script>
import Node from './Node.vue'
import NodeRenderer from './NodeRenderer.vue'
import ConnectionRenderer from './ConnectionRenderer.vue'
import { mapState } from 'vuex'

export default {
  emits: [
    'inspectNode',
    'update:zoom'
  ],
  props: {
    inspectingNode: String
  },
  components: {
    Node,
    NodeRenderer,
    ConnectionRenderer
  },
  computed: {
    ...mapState([
      'nodeLibary'
    ]),
    connections () {
      var connections = []

      this.nodes.forEach((x, i) => {
        if (x.outgoingPoints) {
          x.outgoingPoints.forEach(p => {
            connections.push({
              a: { id: x.id, i: p.i },
              b: { id: p.p.id, i: p.p.i },
              sections: p.sections
            })
          })
        }
      })

      var pointIO = this.selectedPoints.input || this.selectedPoints.output
      if (this.pointCursorEnd && pointIO) {
        if (this.selectedPoints.output) {
          connections.push({
            a: { id: pointIO.id, i: pointIO.i },
            b: {
              x: this.pointCursorEnd.x,
              y: this.pointCursorEnd.y
            },
            sections: this.pointCursorSections
          })
        }
        if (this.selectedPoints.input) {
          connections.push({
            a: {
              x: this.pointCursorEnd.x,
              y: this.pointCursorEnd.y
            },
            b: { id: pointIO.id, i: pointIO.i },
            sections: this.pointCursorSections
          })
        }
      }

      return connections
    },
    zoom_ () {
      return 1 / this.canvas.zoom
    }
  },
  data: () => ({
    readonly: false,
    nodes: [],
    outputValues: {},
    inputs: [],
    outputs: [],
    nodeEls: [],
    nodeRendererEls: [],
    selectedPoints: {
      input: null,
      output: null
    },
    pointCursorEnd: null,
    pointCursorSections: null,
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
    },
    zoom_ (val) {
      this.$emit('update:zoom', val)
    }
  },
  methods: {
    generateInOutputNodes () {
      if (!this.nodes.find(x => x.type === 'inputs')) {
        var rect = this.$el.getBoundingClientRect()

        this.nodes.push({
          type: 'inputs',
          position: {
            x: ((rect.width * 0.1) - this.canvas.x) * this.canvas.zoom,
            y: ((rect.height / 2) - 10 - this.canvas.y) * this.canvas.zoom
          }
        })
      }
      if (!this.nodes.find(x => x.type === 'outputs')) {
        this.nodes.push({
          type: 'outputs',
          position: {
            x: ((rect.width * 0.9) - 70 - this.canvas.x) * this.canvas.zoom,
            y: ((rect.height / 2) - 10 - this.canvas.y) * this.canvas.zoom
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
      return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
      )
    },
    inputPointClick (id, i, e) {
      this.selectedPoints.input = { id, i }
      this.pointDrag(e, false)
      this.tryConnectPoints()
    },
    outputPointClick (id, i, e) {
      this.selectedPoints.output = { id, i }
      this.pointDrag(e, true)
      this.tryConnectPoints()
    },
    inputPointMouseup (id, i, e) {
      if (this.pointCursorEnd) {
        this.selectedPoints.input = { id, i }
        this.tryConnectPoints()
      }
    },
    outputPointMouseup (id, i, e) {
      if (this.pointCursorEnd) {
        this.selectedPoints.output = { id, i }
        this.tryConnectPoints()
      }
    },
    pointDrag (e, isOutput) {
      const _this = this

      document.addEventListener('mousemove', docMousemove)
      document.addEventListener('mouseup', docMouseup)
      if (isOutput) document.addEventListener('mousedown', docMousedown)
      document.addEventListener('contextmenu', docContextmenu)

      var startPos = {
        x: e.clientX,
        y: e.clientY
      }

      var rect
      var dragging = false

      function docMousemove (e2) {
        var delta = {
          x: e2.clientX - startPos.x,
          y: e2.clientY - startPos.y
        }

        if (!dragging && Math.sqrt(delta.x ** 2 + delta.y ** 2) < 10) return

        dragging = true

        rect = _this.$el.getBoundingClientRect()

        _this.pointCursorEnd = {
          x: (e2.clientX - rect.x - _this.canvas.x) * _this.canvas.zoom,
          y: (e2.clientY - rect.y - _this.canvas.y) * _this.canvas.zoom
        }
      }

      function docMouseup (e3) {
        if (e3.button === 2) return

        document.removeEventListener('mousemove', docMousemove)
        document.removeEventListener('mouseup', docMouseup)
        if (isOutput) document.removeEventListener('mousedown', docMousedown)
        document.removeEventListener('contextmenu', docContextmenu)
        _this.pointCursorEnd = null
        _this.pointCursorSections = null
        if (dragging) _this.clearPointSelection()
      }

      function docMousedown (e4) {
        if (e4.button === 2) {
          e4.preventDefault()

          var relX = (e4.clientX - rect.x - _this.canvas.x) * _this.canvas.zoom
          var relY = (e4.clientY - rect.y - _this.canvas.y) * _this.canvas.zoom

          if (!_this.pointCursorSections) {
            _this.pointCursorSections = []
          }

          console.log(relX, relY)

          console.log(e4)
        }
      }

      function docContextmenu (e5) {
        e5.preventDefault()
      }
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
              },
              sections: this.pointCursorSections || null
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
      if (this.readonly) return

      if (!position) {
        var rect = this.$el.getBoundingClientRect()

        position = {
          x: ((rect.width / 2) - 50 / this.canvas.zoom - this.canvas.x) * this.canvas.zoom,
          y: ((rect.height / 2) - 30 / this.canvas.zoom - this.canvas.y) * this.canvas.zoom
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

      if (i < 0) return

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
    removeSelectedNode () {
      if (!this.selectedNode) return

      this.removeNode(this.selectedNode)
    },
    copyToClipboard () {
      if (!this.selectedNode) return

      var node = this.nodes.find(x => this.selectedNode === x.id)

      this.clipboard = {
        node: node.node,
        position: {
          x: ((node.position || {}).x || 0),
          y: ((node.position || {}).y || 0)
        }
      }
    },
    pasteFromClipboard () {
      if (this.clipboard) {
        this.addNode(this.clipboard.node, this.clipboard.position)
      }
    },
    cutNode () {
      if (!this.selectedNode) return

      this.copyToClipboard()
      this.removeSelectedNode()
    },
    recordHistory () {
      this.history.splice(0, this.historyIndex)

      var nodes = []
      this.nodes.forEach(x => nodes.push({ ...x, position: { ...x.position } }))

      this.history.unshift(nodes)
      this.historyIndex = 0
    },
    undo () {
      if (this.readonly) return
      if (this.historyIndex < this.history.length - 1) this.historyIndex++
    },
    redo () {
      if (this.readonly) return
      if (this.historyIndex > 0) this.historyIndex--
    },
    nodeTouchstartMousedown (e, node) {
      if (this.readonly) return
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

        // console.log(touchId)

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
          x: client.x - clientStart.x,
          y: client.y - clientStart.y
        }
        var distance = Math.sqrt(delta.x ** 2 + delta.y ** 2)

        if (distance < Math.min(10, 10 / _this.canvas.zoom) && !_this.moving) return
        _this.moving = true

        node.position = {
          x: Math.round(offset.x + client.x * _this.canvas.zoom),
          y: Math.round(offset.y + client.y * _this.canvas.zoom)
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
          x: Math.round(offset.x + touch.clientX),
          y: Math.round(offset.y + touch.clientY)
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

      document.activeElement.blur()

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
      if (this.pointCursorEnd) return
      if (this.moving) return

      // var dir = e.deltaY === 0 ? 0 : (e.deltaY > 0 ? 1 : -1)

      var target = this.canvas.zoom + e.deltaY / 1000

      target = Math.max(0.2, Math.min(5, target))

      // if (target > 0.5 && target < 10) {
      var zoomDelta = target / this.canvas.zoom
      // console.log(zoomDelta)

      this.canvas.x = (this.canvas.x - e.clientX) / zoomDelta + e.clientX
      this.canvas.y = (this.canvas.y - e.clientY) / zoomDelta + e.clientY

      this.canvas.zoom = target
      // }
    },
    changeZoom (val) {
      if (val === this.zoom) return

      var zoomDelta = 1 / val / this.canvas.zoom
      var rect = this.$el.getBoundingClientRect()

      // console.log(rect, zoomDelta)

      this.canvas.zoom = 1 / val
      this.canvas.x = (this.canvas.x - rect.width / 2) / zoomDelta + rect.width / 2
      this.canvas.y = (this.canvas.y - rect.height / 2) / zoomDelta + rect.height / 2
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
      if (this.readonly) return
      this.inputs[i] = text
    },
    inputTextChanged (id, text, i) {
      if (this.readonly) return
      this.outputs[i] = text
    },
    clear () {
      this.nodes = []
      this.outputValues = {}
      this.inputs = []
      this.outputs = []
      this.readonly = false
    },
    computedNodeObject () {
      // return {
      //   nodes: this.nodes.map(x => ({
      //     id: x.id,
      //     type: x.type,
      //     position: Object.assign({}, x.position),
      //     outgoingPoints: Array.from(x.outgoingPoints || [])
      //       .map(y => ({
      //         i: y.i,
      //         p: Object.assign({}, y.p)
      //       }))
      //   })),
      //   outputs: Array.from(this.outputs),
      //   inputs: Array.from(this.inputs)
      // }
      return JSON.parse(JSON.stringify({
        readonly: this.readonly,
        nodes: this.nodes,
        outputs: this.outputs,
        inputs: this.inputs
      }))
    },
    setFromComputedNodeObject (obj) {
      this.readonly = obj.readonly !== undefined ? obj.readonly : false
      this.nodes = obj.nodes || []
      this.outputs = obj.outputs || []
      this.inputs = obj.inputs || []
    }
  },
  beforeUpdate (e) {
    this.nodeEls = []
    this.nodeRendererEls = []
  },
  mounted () {
    this.recordHistory()
    setTimeout(() => this.generateInOutputNodes())
  }
}
</script>

<style lang="scss" scoped>
@use '../assets/scss' as r;

.node-graph {
  user-select: none;

  &__background {
    height: 100%;
  }

  &__inspecting-node {
    pointer-events: none;
    position: absolute;
    inset: auto 20rem 6vh 4vh;
    text-transform: uppercase;

    color: #242429;
    font-family: r.$header-font;
    font-weight: 700;
    font-size: 20vh;
    line-height: .8;

    small {
      font-size: .2em;
    }
  }

  &__canvas {
    position: absolute;
    top: 0;
    pointer-events: none;
    // transition: transform .2s;

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

  &--readonly {
    .node-graph__background {
      background: repeating-linear-gradient(-45deg, transparent, transparent 6px, #ffffff08 6px, #ffffff08 10px);
    }

    :deep(.node) {
      cursor: not-allowed;

      *:not(.node__point-btn--toggle) {
        pointer-events: none !important;
      }
      .node__point-btn--toggle {
        pointer-events: all;
      }

      &.node--deep {
        cursor: pointer;
      }
    }
  }
}
</style>

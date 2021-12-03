<template>
  <div class="main">
    <NodeGraph
      ref="nodeGraph"
      :inspectingNode="inspectingNode"
      @inspectNode="inspectNode"
    />
    <!-- <div class="header">
      <MenuBtn />
    </div> -->
    <!-- <NodeCollection /> -->
    <div style="position: relative">
    <button @click="addNode('not')">NOT Gate</button> <button @click="addNode('and')">AND Gate</button> <button @click="addNode('nand')">NAND Gate</button> <button @click="addNode('or')">OR Gate</button><br>
    <input v-model="text" > <button @click="save()">Save</button> <button @click="clear()">Clear</button><br>
    <span v-for="(node, i) in nodeLibary.custom" :key="i">
      <button @click="addCustomNode_(i)">{{ i }}. {{ node.name }}</button><br>
    </span>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
// import MenuBtn from './MenuBtn'
// import NodeCollection from './NodeCollection'
import NodeGraph from './NodeGraph'

export default {
  components: {
    // MenuBtn,
    // NodeCollection,
    NodeGraph
  },
  computed: {
    ...mapState(['nodeLibary'])
  },
  data: () => ({
    text: '',
    nodeTreeDepth: [],
    inspectingNode: null
  }),
  methods: {
    ...mapMutations(['addCustomNode']),
    addNode (i) {
      this.$refs.nodeGraph.addNode(i)
    },
    addCustomNode_ (i) {
      this.$refs.nodeGraph.addNode(this.nodeLibary.custom[i])
    },
    clear () {
      this.$refs.nodeGraph.clear()
      this.inspectingNode = null
    },
    save () {
      this.addCustomNode({ ...this.$refs.nodeGraph.computedNodeObject(), name: this.text })
    },
    inspectNode (id) {
      var node = this.$refs.nodeGraph.nodes.find(x => x.id === id)

      var isObj = typeof (node.node) === 'object'

      var nodeObj = isObj ? node.node : this.nodeLibary.complex[node.node]

      this.inspectingNode = nodeObj.name

      if (nodeObj) {
        this.nodeTreeDepth.push(this.$refs.nodeGraph.computedNodeObject())

        this.$refs.nodeGraph.setFromComputedNodeObject(
          JSON.parse(JSON.stringify({
            readonly: !isObj,
            nodes: nodeObj.nodes,
            inputs: nodeObj.inputs,
            outputs: nodeObj.outputs
          })))
      }
    },
    docKeydown (e) {
      const _this = this

      var keybinds = [
        // COPY: CTRL C
        {
          bind: () => e.key === 'c' && e.ctrlKey,
          function: () => _this.$refs.nodeGraph.copyToClipboard()
        },
        // PASTE: CTRL V
        {
          bind: () => e.key === 'v' && e.ctrlKey,
          function: () => _this.$refs.nodeGraph.pasteFromClipboard()
        },
        // CUT: CTRL X
        {
          bind: () => e.key === 'x' && e.ctrlKey,
          function () {
            _this.$refs.nodeGraph.cutNode()
          }
        },
        // DELETE: DEL
        {
          bind: () => e.key === 'Delete',
          function () {
            _this.$refs.nodeGraph.removeSelectedNode()
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
    }
  },
  mounted () {
    document.addEventListener('keydown', this.docKeydown)
  },
  unmounted () {
    document.removeEventListener('keydown', this.docKeydown)
  }
}
</script>

<style lang="scss" scoped>
.main {
  height: 100%;
  position: relative;
}

.header {
  z-index: 1;
  :deep(.menu-btn) {
    float: right;
  }
}

:deep(.node-collection) {
  position: absolute;
  inset: auto 1rem 0;
}
:deep(.node-graph) {
  position: absolute;
  inset: 0;
}
</style>

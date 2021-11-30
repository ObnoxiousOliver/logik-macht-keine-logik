<template>
  <div class="main">
    <NodeGraph ref="nodeGraph"/>
    <div class="header">
      <MenuBtn/>
    </div>
    <NodeCollection/>
    <button style="position: relative" @click="addNode('not')">Not Gate</button><br>
    <button style="position: relative" @click="addNode('and')">And Gate</button><br>
    <button style="position: relative" @click="addNode('dot')">Dot</button><br>
    <button style="position: relative" @click="addNode('1bitAdder')">1bitAdder Gate</button>
  </div>
</template>

<script>
import MenuBtn from './MenuBtn'
import NodeCollection from './NodeCollection'
import NodeGraph from './NodeGraph'

export default {
  components: {
    MenuBtn,
    NodeCollection,
    NodeGraph
  },
  data: () => ({
    standardNodeLibary: {
      dot: {},
      and: {
        name: 'And',
        function: (a, b) => [a && b],
        inputs: ['', ''],
        outputs: ['']
      },
      not: {
        name: 'Not',
        function: (a) => [!a],
        inputs: [''],
        outputs: ['']
      },
      '1bitAdder': {
        name: '1-Bit Adder',
        function: (a) => [!a],
        inputs: ['', '', ''],
        outputs: ['', '']
      }
    }
  }),
  methods: {
    addNode (i) {
      this.$refs.nodeGraph.addNode(this.standardNodeLibary[i])
    }
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

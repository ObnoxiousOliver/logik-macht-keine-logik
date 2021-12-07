<template>
  <NodeRenderer
    :inputs_="node.inputs"
    :outputs_="node.outputs"
    :name_="node.name"
    :outputValues="mounted ? ($refs.nodeEl || {}).outputValues : []"
    :readonly="true"
  />
  <Node
    ref="nodeEl"
    :node="nodeName"
    :delay="0"
  />
</template>

<script>
import Node from './Node.vue'
import NodeRenderer from './NodeRenderer.vue'

export default {
  components: {
    Node,
    NodeRenderer
  },
  props: {
    node: { type: Object, default: () => ({}) },
    nodeName: [String, Object]
  },
  data: () => ({
    mounted: false
  }),
  mounted () {
    this.mounted = true
  }
}
</script>

<template>
  <Node
    v-for="node in nodes_"
    :ref="(el) => { if (el) { nodeEls.push(el) } }"
    :key="node.id"
    :nodes="nodeEls"
    :id="node.id"
    :type="node.type"
    :node="node.node"
    :delay="0"
    :outgoingPoints="node.outgoingPoints"
    @outputChanged="(x) => outputValues[node.id] = x"
    @inputChanged="nodeInputChanged"
  />
</template>

<script>
import { mapState } from 'vuex'

export default {
  emits: [
    // 'inputPointClick', 'outputPointClick',
    'inputChanged',
    'outputChanged'
  ],
  components: {
    Node: this
  },
  props: {
    id: String,
    type: String,
    name_: String,
    node: [Object, String],
    inputs_: Array,
    outputs_: Array,
    function_: Function,
    delay: { type: Number, default: 0 },
    outgoingPoints: { type: Array, default: () => [] },
    nodes: { type: Array, default: () => [] }
  },
  computed: {
    ...mapState([
      'nodeLibary'
    ]),
    combinedLibary () {
      return { ...this.nodeLibary.primitive, ...this.nodeLibary.complex }
    },
    nodeObject () {
      return typeof (this.node) === 'object' ? this.node : null
    },
    isComplex () {
      return Object.keys(this.nodeLibary.complex).includes(this.node) || this.nodeObject !== null
    },
    outputValues () {
      if (this.isComplex) return this.nodeOutputValues

      if (this.type === 'inputs') return this.inputValues
      var outputs = this.function(...this.inputValues)

      return outputs
    },
    name () {
      try {
        if (this.nodeObject) {
          return this.node.name
        } else return this.name_ || this.combinedLibary[this.node].name || ''
      } catch { return [] }
    },
    inputs () {
      try {
        if (this.nodeObject) {
          return this.node.inputs
        } else return this.inputs_ || this.combinedLibary[this.node].inputs || ['']
      } catch { return [] }
    },
    outputs () {
      try {
        if (this.nodeObject) {
          return this.node.outputs
        } return this.outputs_ || this.combinedLibary[this.node].outputs || ['']
      } catch { return [] }
    },
    function () {
      try {
        if (this.nodeObject) {
          return () => []
        } return this.function_ || this.combinedLibary[this.node].function || ((a) => [a])
      } catch { return () => [] }
    },
    nodes_ () {
      return this.nodeObject ? this.node.nodes || [] : (this.combinedLibary[this.node] || {}).nodes || []
    },
    nodesLength () {
      return this.nodes.length
    }
  },
  watch: {
    outgoingPoints: {
      deep: true,
      handler () {
        this.updateOutputs()
      }
    },
    outputValues: {
      deep: true,
      handler () {
        this.updateOutputs()
      }
    },
    nodesLength () {
      this.updateOutputs()
    },
    inputValues: {
      deep: true,
      handler (val) {
        this.$emit('inputChanged', val, this.id)

        if (this.isComplex) {
          val.forEach((x, i) => {
            this.nodeEls.find(y => y.type === 'inputs').inputChanged(x, i, [])
          })
        }
      }
    }
  },
  data: () => ({
    inputValues: [],
    outputValuesDelay: [],
    path: [],
    nodeOutputValues: [],

    nodeEls: []
  }),
  methods: {
    inputChanged (x, i, path) {
      this.path = path || []
      this.inputValues[i] = x
    },
    updateOutputs () {
      const _this = this

      var i = this.path.indexOf(this.id)
      var path = [this.id, ...this.path.slice(0, i >= 0 ? i : this.path.length)]
      // console.log(path)

      this.$emit('outputChanged', this.outputValues)

      function func () {
        _this.outputValuesDelay = _this.outputValues

        _this.outgoingPoints.forEach(x => {
          var node = _this.nodes.find(y => y.id === x.p.id)

          if (node) {
            node.inputChanged(_this.outputValues[x.i], x.p.i, path)
          }
        })
      }

      if (this.delay || this.path.includes(this.id)) setTimeout(func, Math.max(this.delay, 30))
      else func()
    },
    nodeInputChanged (x, id) {
      console.log(x, this.nodes_.find(y => y.id === id))
      if (this.nodes_.find(y => y.id === id).type === 'outputs') {
        this.nodeOutputValues = x
      }
    }
  },
  mounted () {
    this.outputValuesDelay = this.outputValues
    this.inputValues = this.inputs.map(() => false)

    if (this.isComplex) {
      this.inputs.forEach((x, i) => {
        this.nodeEls.find(y => y.type === 'inputs').inputChanged(x, i, [])
      })
    }
  },
  beforeUpdate () {
    this.nodeEls = []
  }
}
</script>

<style lang="scss" scoped>
// .node {
//   background: #25272b;
//   width: fit-content;
//   border-radius: .5rem;
//   display: flex;
//   align-items: center;
//   user-select: none;
//   box-shadow: #0005 0 0 .5rem;
//   transition: box-shadow .1s;
//   text-align: center;

//   &__name {
//     margin: 0;
//     padding: .75rem;
//     font-size: 1.1rem;
//   }

//   &__points {
//     display: flex;
//     flex-flow: column nowrap;
//     gap: .6rem;
//     padding: .5rem 0;
//     width: 1.2rem;

//     &--inputs {
//       transform: translateX(-.6rem);
//     }
//     &--outputs {
//       transform: translateX(.6rem);
//     }
//   }

//   &__point {
//     position: relative;
//     background: #555961;
//     height: 1.2rem;
//     width: 1.2rem;
//     border-radius: 50%;
//     box-shadow: #0005 0 0 .5rem;

//     &--active {
//       background: var(--accent);
//     }

//     &::before {
//       content: '';
//       position: absolute;
//       inset: -.2rem;
//       cursor: inherit;
//     }
//   }

//   &--selected {
//     box-shadow: #0005 0 0 .5rem, var(--accent) 0 0 0 .2rem inset;
//   }

//   &-leave-active {
//     transition: .15s cubic-bezier(0.6, -0.28, 0.735, 0.045);
//   }
//   &-leave-to {
//     transform: scale(0);
//     opacity: 0;
//   }
// }
</style>

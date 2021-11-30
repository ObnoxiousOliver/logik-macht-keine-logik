<!--  eslint-disable-next-line vue/valid-template-root -->
<template></template>

<script>
export default {
  emits: [
    'inputPointClick', 'outputPointClick'
  ],
  props: {
    id: String,
    type: String,
    name: String,
    inputs: { type: Array, default: () => [''] },
    outputs: { type: Array, default: () => [''] },
    function: { type: Function, default: (a) => [a] },
    outgoingPoints: { type: Array, default: () => [] },
    nodes: { type: Array, default: () => [] }
  },
  computed: {
    outputValues () {
      if (this.type === 'inputs') return this.inputValues
      var outputs = this.function(...this.inputValues)

      return outputs
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
    }
  },
  data: () => ({
    inputValues: [],
    outputValuesDelay: []
  }),
  methods: {
    inputChanged (x, i) {
      this.inputValues[i] = x
    },
    updateOutputs () {
      setTimeout(() => {
        this.outputValuesDelay = this.outputValues

        this.outgoingPoints.forEach(x => {
          var node = this.nodes.find(y => y.id === x.p.id)
          if (node) {
            node.inputChanged(this.outputValues[x.i], x.p.i)
          }
        })
      }, 30)
    }
  },
  mounted () {
    this.outputValuesDelay = this.outputValues
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

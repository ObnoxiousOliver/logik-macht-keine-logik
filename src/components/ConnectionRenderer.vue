<template>
  <div class="connection">
    <div :style="{
      top: points.a.y + 'px',
      left: points.a.x + 'px'
    }" class="connection__points"/>
    <svg
      class="connection__path"
      :width="Math.abs(points.b.x - points.a.x) + padding * 2"
      :height="Math.abs(points.b.y - points.a.y) + padding * 2"
      :style="{
        top: Math.min(points.a.y, points.b.y) - padding + 'px',
        left: Math.min(points.a.x, points.b.x) - padding + 'px'
      }"
    >
      <path :d="`
        M${Math.max(padding, -(points.b.x - points.a.x) + padding)},${Math.max(padding, -(points.b.y - points.a.y) + padding)}
        L${Math.max(padding, points.b.x - points.a.x + padding)},${Math.max(padding, points.b.y - points.a.y + padding)}`"
        stroke="currentColor"
        stroke-width="3"
      />
    </svg>
    <div :style="{
      top: points.b.y + 'px',
      left: points.b.x + 'px'
    }" class="connection__points"/>
  </div>
</template>

<script>
export default {
  props: {
    a: Object,
    b: Object,
    nodeRendererEls: Array,
    nodes: Array,
    canvas: Object
  },
  computed: {
    all () {
      return [
        this.nodes,
        this.a,
        this.b
      ]
    }
  },
  watch: {
    all: {
      deep: true,
      handler (val) {
        this.updatePoints()
      }
    }
  },
  data: () => ({
    points: { a: { x: 0, y: 0 }, b: { x: 0, y: 0 } },
    padding: 10
  }),
  methods: {
    updatePoints () {
      var nodeRenderElA = this.nodeRendererEls.find(x => x.id === this.a.id)
      var nodeRenderElB = this.nodeRendererEls.find(x => x.id === this.b.id)

      var nodeA = this.nodes.find(x => x.id === this.a.id)
      var nodeB = this.nodes.find(x => x.id === this.b.id)

      if (nodeRenderElA && nodeRenderElB && nodeA && nodeB) {
        var rectNodeA = nodeRenderElA.$el.getBoundingClientRect()
        var rectPointA = nodeRenderElA.outputEls[this.a.i].getBoundingClientRect()

        var rectNodeB = nodeRenderElB.$el.getBoundingClientRect()
        var rectPointB = nodeRenderElB.inputEls[this.b.i].getBoundingClientRect()

        var z = this.canvas.zoom

        this.points = {
          a: {
            x: ((nodeA.position || {}).x || 0) + rectPointA.x * z - rectNodeA.x * z + rectPointA.width * z / 2,
            y: ((nodeA.position || {}).y || 0) + rectPointA.y * z - rectNodeA.y * z + rectPointA.height * z / 2
          },
          b: {
            x: ((nodeB.position || {}).x || 0) + rectPointB.x * z - rectNodeB.x * z + rectPointB.width * z / 2,
            y: ((nodeB.position || {}).y || 0) + rectPointB.y * z - rectNodeB.y * z + rectPointB.height * z / 2
          }
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.connection {
  position: absolute;

  &__points {
    position: absolute;
    transform: translate(-50%, -50%);
    // background: white;
  }

  &__path {
    position: absolute;
    color: #555961;
  }
}
</style>

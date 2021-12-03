<template>
  <div :class="['connection', active ? 'connection--active' : '']">
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
    active: Boolean,
    nodeRendererEls: Array,
    nodes: Array,
    canvas: Object
  },
  computed: {
    all () {
      return [
        this.nodes,
        this.nodeRendererEls,
        this.a,
        this.b
      ]
    }
  },
  watch: {
    all: {
      deep: true,
      handler (val) {
        const _this = this

        this.updatePoints()

        if (this.timeout) {
          clearTimeout(this.timeout)
          this.timeout = null
        }

        var i = 0

        // Updates 10 times every 20ms to allow 200ms little transitions
        function loop () {
          _this.timeout = setTimeout(() => {
            // console.log(new Date().getMilliseconds())
            _this.updatePoints()
            if (i < 10) loop()
            i++
          }, 20)
        }

        loop()
      }
    }
  },
  data: () => ({
    points: { a: { x: 0, y: 0 }, b: { x: 0, y: 0 } },
    padding: 10,
    timeout: null
  }),
  methods: {
    updatePoints () {
      var nodeRenderElA = this.nodeRendererEls.find(x => x.id === this.a.id)
      var nodeRenderElB = this.nodeRendererEls.find(x => x.id === this.b.id)

      var nodeA = this.nodes.find(x => x.id === this.a.id)
      var nodeB = this.nodes.find(x => x.id === this.b.id)

      var ax = this.a.x || false
      var ay = this.a.y || false
      var bx = this.b.x || false
      var by = this.b.y || false

      var z = this.canvas.zoom

      if (ax && ay) {
        this.points.a = {
          x: ax,
          y: ay
        }
      } else if (nodeRenderElA && nodeA) {
        var rectNodeA = nodeRenderElA.$el.getBoundingClientRect()
        var rectPointA = nodeRenderElA.outputEls[this.a.i].getBoundingClientRect()

        this.points.a = {
          x: ((nodeA.position || {}).x || 0) + rectPointA.x * z - rectNodeA.x * z + rectPointA.width * z / 2,
          y: ((nodeA.position || {}).y || 0) + rectPointA.y * z - rectNodeA.y * z + rectPointA.height * z / 2
        }
      }

      if (bx && by) {
        this.points.b = {
          x: bx,
          y: by
        }
      } else if (nodeRenderElB && nodeB) {
        var rectNodeB = nodeRenderElB.$el.getBoundingClientRect()
        var rectPointB = nodeRenderElB.inputEls[this.b.i].getBoundingClientRect()

        this.points.b = {
          x: ((nodeB.position || {}).x || 0) + rectPointB.x * z - rectNodeB.x * z + rectPointB.width * z / 2,
          y: ((nodeB.position || {}).y || 0) + rectPointB.y * z - rectNodeB.y * z + rectPointB.height * z / 2
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@use '../assets/scss' as r;

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
    filter: drop-shadow(#0005 0 0 0.5rem);

    path {
      stroke-width: .3rem;
    }
  }

  &--active &__path {
    color: r.$accent;

  }
}
</style>

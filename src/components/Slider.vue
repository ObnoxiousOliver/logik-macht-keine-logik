<template>
  <div :class="['slider', vertical ? 'slider--vertical' : '']" @mousedown="mousedown">
    <div ref="track" class="slider__track">
      <div class="slider__thumb" :style="{ top: vertical ? percentage + '%' : '', left: vertical ? '' : percentage + '%' }" />
    </div>
  </div>
</template>

<script>
export default {
  emits: [
    'input',
    'update:value'
  ],
  props: {
    vertical: Boolean,
    value: Number,
    min: Number,
    max: Number
  },
  computed: {
    percentage () {
      return ((this.value_ - this.min) / (this.max - this.min)) * 100
    }
  },
  data: () => ({
    value_: 1
  }),
  watch: {
    value (val) {
      this.value_ = val
    },
    value_ (val) {
      this.$emit('update:value', val)
      this.$emit('input', val)
    }
  },
  methods: {
    mousedown (e) {
      const _this = this

      document.addEventListener('mousemove', mousemove)
      document.addEventListener('mouseup', mouseup)

      mousemove(e)

      function mousemove (e2) {
        var rect = _this.$refs.track.getBoundingClientRect()

        if (_this.vertical) {
          _this.value_ = Math.max(0, Math.min(1, (e2.clientY - rect.y) / rect.height)) * (_this.max - _this.min) + _this.min
        } else {
          _this.value_ = Math.max(0, Math.min(1, (e2.clientX - rect.x) / rect.width)) * (_this.max - _this.min) + _this.min
        }
      }
      function mouseup (e2) {
        document.removeEventListener('mousemove', mousemove)
        document.removeEventListener('mouseup', mouseup)
      }
    }
  },
  mounted () {
    this.value_ = this.value
  }
}
</script>

<style lang="scss" scoped>
$slider-thickness: .2rem;

.slider {
  display: flex;
  padding: .5rem;

  &__track {
    position: relative;
    margin: auto;
    width: 10rem;
    height: $slider-thickness;
    border-radius: .15rem;
    background: #fff8;

    .slider--vertical & {
      width: $slider-thickness;
      height: 10rem;
    }
  }

  &__thumb {
    position: absolute;
    width: 1.25rem;
    height: 1.25rem;
    border-radius: 50%;
    background: #fff;
    margin: -.625rem + ($slider-thickness / 2);
  }
}
</style>

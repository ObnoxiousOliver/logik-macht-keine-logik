<template>
  <div :class="['node', type ? 'node--' + type : '', (typeof (node) === 'object' ? true : nodeLibary.complex[node]) ? 'node--deep' : '']">
    <div class="node__points node__points--inputs">
      <!-- INPUT POINTS -->
      <div v-if="type === 'outputs'" class="node__point">
        <button
          tabindex="-1"
          class="node__point-btn node__point-btn--add-point"
          @click="() => { if (!readonly) $emit('addOutput') }"
        >
          <i class="bi-plus"/>
        </button>
        <!-- <button
          v-if="type === 'outputs'"
          class="node__point-btn node__point-btn--transparent"
          @click="() => { if (!readonly) $emit('menuOpen') }"
        >
          <i class="bi-three-dots-vertical"/>
        </button> -->
      </div>
      <div class="node__point" v-for="(p, i) in inputs" :key="i">
        <button
          tabindex="-1"
          @mousedown.left.prevent="(e) => { if (!readonly) $emit('inputPointClick', id, i, e) }"
          @touchstart.prevent="(e) => { if (!readonly) $emit('inputPointClick', id, i, e) }"
          @mouseup="(e) => { if (!readonly) $emit('inputPointMouseup', id, i, e) }"
          :class="['node__point-btn',
            inputValues[i] ? 'node__point-btn--active' : '',
            (selectedPoints.input || {}).id === id && (selectedPoints.input || {}).i === i ? 'node__point-btn--selected' : '']"
          :title="inputs[i]"
          :ref="(el) => { if (el) inputEls.push(el) }"
        />

        <div class="node__point-options" v-if="type === 'outputs'">
          <div class="node__point-name node__point-name--inputs">
            <input
              v-show="iEditing === i"
              :ref="(el) => { if (el) inputTextEls.push(el) }"
              v-model="iText"
              @blur="() => { if (!readonly) iEndEdit (i) }"
              @keydown.enter="() => { if (!readonly) iEndEdit (i) }"
              @keydown.esc="() => { if (!readonly) iEndEdit (i) }"
              type="text"
              class="node__point-name-input"
              placeholder="Benenne Output"
            >
            <button
              tabindex="-1"
              class="node__point-edit-btn"
              @mousedown="() => { if (!readonly) iEdit(i) }"
              v-if="iEditing !== i"
            >
              {{ inputs[i] }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <h2 v-if="name" class="node__name">{{ name }}</h2>
    <div class="node__points node__points--outputs">
      <!-- OUTPUT POINTS -->
      <div v-if="type === 'inputs'" class="node__point">
        <button
          tabindex="-1"
          class="node__point-btn node__point-btn--add-point"
          @click="() => { if (!readonly) $emit('addInput') }"
        >
          <i class="bi-plus"/>
        </button>
        <!-- <button
          v-if="type === 'inputs'"
          class="node__point-btn node__point-btn--transparent"
          @click="() => { if (!readonly) $emit('menuOpen') }"
        >
          <i class="bi-three-dots-vertical"/>
        </button> -->
      </div>
      <div class="node__point" v-for="(p, i) in outputs" :key="i">
        <button
          tabindex="-1"
          @mousedown.left.prevent="(e) => { if (!readonly) $emit('outputPointClick', id, i, e) }"
          @touchstart.prevent="(e) => { if (!readonly) $emit('outputPointClick', id, i, e) }"
          @mouseup="(e) => { if (!readonly) $emit('outputPointMouseup', id, i, e) }"
          :class="['node__point-btn',
            outputValues[i] ? 'node__point-btn--active' : '',
            (selectedPoints.output || {}).id === id && (selectedPoints.output || {}).i === i ? 'node__point-btn--selected' : '']"
          :title="outputs[i]"
          :ref="(el) => { if (el) outputEls.push(el) }"
        />
        <div class="node__point-options" v-if="type === 'inputs'">

          <div class="node__point-name node__point-name--outputs">
            <input
              v-show="oEditing === i"
              :ref="(el) => { if (el) inputTextEls.push(el) }"
              v-model="oText"
              @blur="() => { if (!readonly) oEndEdit (i) }"
              @keydown.enter="() => { if (!readonly) oEndEdit (i) }"
              @keydown.esc="() => { if (!readonly) oEndEdit (i) }"
              type="text"
              class="node__point-name-input"
              placeholder="Benenne Input"
            >
            <button
              tabindex="-1"
              class="node__point-edit-btn"
              @mousedown="() => { if (!readonly) oEdit(i) }"
              v-if="oEditing !== i"
            >
              {{ outputs[i] }}
            </button>
          </div>

          <button
            tabindex="-1"
            class="node__point-btn node__point-btn--small node__point-btn--toggle"
            @click="$emit('toggleInput', id, i)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  emits: [
    'inputPointClick',
    'outputPointClick',
    'inputPointMouseup',
    'outputPointMouseup',
    'addInput',
    'addOutput',
    'toggleInput',
    'menuOpen',
    'outputTextChanged',
    'inputTextChanged'
  ],
  props: {
    id: String,
    type: String,
    name_: String,
    node: [Object, String],
    inputs_: Array,
    outputs_: Array,
    inputValues: { type: Array, default: () => [] },
    outputValues: { type: Array, default: () => [] },
    readonly: Boolean,
    selectedPoints: { type: Object, default: () => ({ input: null, output: null }) }
  },
  computed: {
    ...mapState([
      'nodeLibary'
    ]),
    combinedLibary () {
      return { ...this.nodeLibary.primitive, ...this.nodeLibary.complex, ...this.nodeLibary.custom }
    },
    name () {
      try {
        if (typeof (this.node) === 'object') {
          return this.node.name
        } return this.name_ || this.combinedLibary[this.node].name || ''
      } catch { return null }
    },
    inputs () {
      try {
        if (typeof (this.node) === 'object') {
          return this.node.inputs
        } return this.inputs_ || this.combinedLibary[this.node].inputs || ['']
      } catch { return [] }
    },
    outputs () {
      try {
        if (typeof (this.node) === 'object') {
          return this.node.outputs
        } return this.outputs_ || this.combinedLibary[this.node].outputs || ['']
      } catch { return [] }
    }
  },
  data: () => ({
    inputEls: [],
    outputEls: [],
    inputTextEls: [],
    oText: '',
    oEditing: null,
    iText: '',
    iEditing: null
  }),
  methods: {
    oEdit (i) {
      if (this.oEditing >= 0) {
        this.$emit('outputTextChanged', this.id, this.oText, this.oEditing)
      }

      this.oText = this.outputs[i]
      this.oEditing = i

      setTimeout(() => {
        this.inputTextEls[i].focus()
      })
    },
    oEndEdit (i) {
      this.$emit('outputTextChanged', this.id, this.oText, this.oEditing)

      if (this.oEditing === i) {
        this.oEditing = null
      }
    },
    iEdit (i) {
      if (this.iEditing >= 0) {
        this.$emit('inputTextChanged', this.id, this.iText, this.iEditing)
      }

      this.iText = this.inputs[i]
      this.iEditing = i

      setTimeout(() => {
        this.inputTextEls[i].focus()
      })
    },
    iEndEdit (i) {
      this.$emit('inputTextChanged', this.id, this.iText, this.iEditing)

      if (this.iEditing === i) {
        this.iEditing = null
      }
    }
  },
  beforeUpdate () {
    this.inputEls = []
    this.outputEls = []
    this.inputTextEls = []
  }
}
</script>

<style lang="scss" scoped>
@use '../assets/scss' as r;

.node {
  background: #26282c;
  width: fit-content;
  border-radius: .5rem;
  display: flex;
  align-items: center;
  user-select: none;
  transition: box-shadow .1s;
  box-shadow: #0005 0 0 .5rem;
  text-align: center;

  &__name {
    margin: 0;
    padding: .75rem;
    font-size: 1.1rem;

    .node--inputs & {
      padding-right: 0;
    }
  }

  &__points {
    display: flex;
    flex-flow: column nowrap;
    gap: .6rem;
    padding: .5rem 0;
    min-width: 1.2rem;

    &--inputs {
      transform: translateX(-.6rem);

      .node--outputs & {
        min-width: 3.5rem;
      }
    }
    &--outputs {
      transform: translateX(.6rem);

      .node--inputs & {
        min-width: 3.5rem;
      }
    }
  }

  &__point {
    display: flex;
    flex-flow: row-reverse;
    gap: .3rem;

    .node__points--inputs & {
      flex-flow: row;
    }
  }

  &__point-btn {
    display: block;
    position: relative;
    background: #555961;
    color: #ccc;
    font-size: 1rem;
    height: 1.2rem;
    width: 1.2rem;
    border-radius: 50%;
    box-shadow: #0005 0 0 .5rem;

    &--active {
      background: r.$accent;
    }

    &--selected {
      border: #fff solid .2rem;
    }

    &::before {
      content: '';
      position: absolute;
      inset: -.2rem;
      cursor: inherit;
    }

    &--add-point {
      background: #25272b;
      border: currentColor solid .1rem;
      line-height: 1;
    }

    &--small {
      width: .8rem;
      height: .8rem;
      margin: .2rem .2rem .2rem 0;
    }

    &--transparent {
      background: none;
      box-shadow: none;
      transition: .15s;

      &:hover {
        background: #fff2;
      }
    }

    &--toggle {
      background: r.$accent;
    }
  }

  &__point-options {
    flex: 1 0 auto;
    display: flex;
  }

  &__point-name {
    display: flex;
    flex: 1 0 auto;
    height: 100%;
    line-height: 1;
    min-width: 1rem;
    font-weight: 600;

    &--inputs {
      text-align: left;
      margin-right: -.7rem;
      margin-left: .7rem;
    }
    &--outputs {
      text-align: right;
      margin-right: .7rem;
      margin-left: -.7rem;
    }
  }

  &__point-name-input {
    appearance: none;
    border: none;
    background: none;
    color: inherit;
    font: inherit;
    display: block;
    text-align: inherit;
    font-size: .9rem;
  }

  &__point-edit-btn {
    flex: 1 0 auto;
    height: 100%;
    display: block;
    white-space: nowrap;
    text-align: inherit;
    width: 100%;
  }

  &--selected {
    box-shadow: #0005 0 0 .5rem, r.$accent 0 0 0 .2rem inset;
  }

  &-enter-active{
    transition: .1s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  &-leave-active {
    transition: .15s cubic-bezier(0.6, -0.28, 0.735, 0.045);
  }
  &-enter-from, &-leave-to {
    transform: scale(0);
    opacity: 0;
  }
}
</style>

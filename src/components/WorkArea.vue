<template>
  <div class="main">
    <NodeGraph
      ref="nodeGraph"
      :inspectingNode="inspectingNode"
      @update:zoom="(val) => zoom = val"
      @inspectNode="inspectNode"
    />
    <div :class="['overlay', collapsed ? 'overlay--sidebar-collapsed' : '']">
      <div class="overlay__nw">
        <div v-if="this.nodeTreeDepth.length > 1" class="breadcrumbs">
          <ul class="breadcrumbs__list">
            <li class="breadcrumbs__list-item">
              <button @click="goBack(nodeTreeDepth.length - 1)" v-tooltip.bottom="'Haupt Arbeitsplatz'" class="btn breadcrumbs__btn">
                <i class="bi-diagram-3-fill"/>
              </button>
            </li>
            <li class="breadcrumbs__list-item" v-for="(n, i) in nodeTreeDepth.slice(1, nodeTreeDepth.length)" :key="i">
              <i class="bi-chevron-right"/>
              <button @click="goBack(nodeTreeDepth.length - 2 - i)" class="btn breadcrumbs__btn">
                {{ n.name }}
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div class="overlay__ne">
        <button @click="clear" v-tooltip.bottom="'Arbeitsfläche reinigen'" class="btn overlay__btn">
          <i class="bi-trash"/>
        </button>
        <VDropdown :offset="[0,15]" placement="bottom-end">
          <button v-tooltip.bottom="'In die Bibliothek hinzufügen'" class="btn overlay__btn create-node__btn">
            <i class="bi-plus-lg"/>
          </button>

          <template #popper>
            <div class="create-node">
              <input
                v-model="text"
                type="text"
                placeholder="Node Name"
                class="create-node__input input-field"
              >
              <div class="create-node__btn-container">
                <button
                  v-close-popper
                  class="btn create-node__cancel-btn"
                >Abbrechen</button>
                <button
                  @click="save"
                  v-close-popper
                  class="btn btn--primary create-node__save-btn"
                >Speichern</button>
              </div>
            </div>
          </template>
        </VDropdown>
      </div>
      <div class="overlay__se">
        <div v-tooltip.bottom="'Zoom ' + Math.round(zoom * 100) + '%'" class="btn zoom-slider__container">
          <Slider
            v-model:value="zoom"
            @input="changeZoom"
            class="zoom-slider__input"
            :min="0.2"
            :max="5"
          />
          <i class="zoom-slider__icon bi-search" />
        </div>
      </div>
    </div>
    <Sidebar v-model:collapsed="collapsed" @addNode="addNode"/>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
// import MenuBtn from './MenuBtn'
import Sidebar from './Sidebar'
import Slider from './Slider'
import NodeGraph from './NodeGraph'

export default {
  components: {
    // MenuBtn,
    Sidebar,
    Slider,
    NodeGraph
  },
  computed: {
    ...mapState(['nodeLibary'])
  },
  data: () => ({
    text: '',
    nodeTreeDepth: [],
    nodeTreeIndex: 0,
    inspectingNode: null,
    collapsed: false,
    zoom: 1
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
      if (this.nodeTreeIndex) history.go(-this.nodeTreeIndex)
      this.inspectingNode = null

      setTimeout(() => {
        this.$refs.nodeGraph.clear()
        history.replaceState(null, '')
      })
    },
    goBack (i) {
      if (i) history.go(-i)
    },
    save () {
      var t = this.text.trim()

      if (t.length > 0) {
        this.addCustomNode({ ...this.$refs.nodeGraph.computedNodeObject(), name: t })
      }
      this.text = ''
    },
    inspectNode (id) {
      var node = this.$refs.nodeGraph.nodes.find(x => x.id === id)

      var isObj = typeof (node.node) === 'object'

      var nodeObj = isObj ? node.node : this.nodeLibary.complex[node.node]

      if (nodeObj) {
        this.nodeTreeDepth.splice(this.nodeTreeIndex, 1, { ...this.$refs.nodeGraph.computedNodeObject(), name: this.inspectingNode })

        history.replaceState({ history: JSON.parse(JSON.stringify(this.nodeTreeDepth)), index: this.nodeTreeIndex }, '')
        this.nodeTreeIndex++

        this.inspectingNode = nodeObj.componentName || nodeObj.name
        this.$refs.nodeGraph.setFromComputedNodeObject(
          JSON.parse(JSON.stringify({
            readonly: !isObj,
            nodes: nodeObj.nodes,
            inputs: nodeObj.inputs,
            outputs: nodeObj.outputs
          })))
        this.nodeTreeDepth.splice(this.nodeTreeIndex, 1, { ...this.$refs.nodeGraph.computedNodeObject(), name: this.inspectingNode })

        history.pushState({ history: JSON.parse(JSON.stringify(this.nodeTreeDepth)), index: this.nodeTreeIndex }, '')
      }
    },
    changeZoom () {
      this.$refs.nodeGraph.changeZoom(this.zoom)
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
    },
    popstate (e) {
      if (e.state) {
        var node = e.state.history[e.state.index]
        this.$refs.nodeGraph.setFromComputedNodeObject(node)
        this.inspectingNode = node.name

        this.nodeTreeIndex = e.state.index
        this.nodeTreeDepth = e.state.history
      } else {
        this.inspectingNode = null
        this.$refs.nodeGraph.clear()
      }
    }
  },
  mounted () {
    document.addEventListener('keydown', this.docKeydown)
    window.addEventListener('popstate', this.popstate)

    if (history.state) {
      var node = history.state.history[history.state.index]
      this.$refs.nodeGraph.setFromComputedNodeObject(node)
      this.inspectingNode = node.name

      this.nodeTreeIndex = history.state.index
      this.nodeTreeDepth = history.state.history
    }
  },
  unmounted () {
    document.removeEventListener('keydown', this.docKeydown)
    window.removeEventListener('popstate', this.popstate)
  }
}
</script>

<style lang="scss" scoped>
@use '../assets/scss' as r;

.main {
  display: flex;
  height: 100%;
  position: relative;
}

.overlay .overlay__btn, :deep(.sidebar__expand-btn), .zoom-slider__container {
  padding: 0;
  background: #51515c1c;

  &:hover {
    background: #79798645;
    border-color: #79798622;

    &:active {
      background: #79798666;
      border-color: #79798666;
    }
  }

  @supports (-webkit-backdrop-filter: none) or (backdrop-filter: none) {
    backdrop-filter: blur(1rem);
  }

  /* slightly transparent fallback for Firefox (not supporting backdrop-filter) */
  @supports not ((-webkit-backdrop-filter: none) or (backdrop-filter: none)) {
    background: #18181b;

    &:hover {
      background: #29292e;
      border-color: #79798622;

      &:active {
        background: #42424b;
        border-color: #79798666;
      }
    }
  }
}

.overlay {
  position: relative;
  flex: 1 1 auto;
  pointer-events: none;
  user-select: none;

  &__nw {
    display: flex;
    position: absolute;
    left: .5rem;
    top: .5rem;
  }

  &__ne {
    display: flex;
    position: absolute;
    right: 0;
    top: .5rem;
    transition: .5s cubic-bezier(0.19, 1, 0.22, 1);

    .overlay--sidebar-collapsed & {
      right: 4rem;
    }
  }

  &__se {
    display: flex;
    position: absolute;
    right: 0;
    bottom: .5rem;
    transition: .5s cubic-bezier(0.19, 1, 0.22, 1);

    .overlay--sidebar-collapsed & {
      right: .5rem;
    }
  }

  .btn {
    margin: 0 .1rem;
    pointer-events: all;
  }

  &__btn {
    width: 3rem;
    line-height: 0;
    aspect-ratio: 1;
    font-size: 1.3rem;
  }

  .zoom-slider {
    &__container {
      display: flex;
      flex-flow: row nowrap;
      height: 3rem;
      width: auto;
      align-items: center;
      gap: 1rem;
      padding: 0 1rem;
      aspect-ratio: unset;
    }

    &__input {
      // width: 3rem;
    }
  }

  .breadcrumbs {
    &__btn {
      height: 3rem;
      color: #fffa;
    }

    &__list {
      list-style-type: none;
      display: flex;
      flex-flow: row nowrap;
    }

    &__list-item {
      white-space: nowrap;

      &:last-child .breadcrumbs__btn {
        color: #fff;
      }
    }
  }
}

.header {
  z-index: 1;
  :deep(.menu-btn) {
    float: right;
  }
}

.create-node {
  display: flex;
  flex-flow: column nowrap;
  gap: .5rem;

  &__btn-container {
    display: flex;
    justify-content: end;
    gap: .5rem;
  }

  &__input {
    width: 18rem;
    padding: 0.5rem 1rem;
  }
}

:deep(.node-graph) {
  position: absolute;
  inset:  0 20rem 0 0;
  height: 100%;

  .node-graph__background {
    margin-right: -20rem;
  }
}
</style>

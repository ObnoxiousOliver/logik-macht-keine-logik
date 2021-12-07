<template>
  <div :class="['sidebar', collapsed_ ? 'sidebar--collapsed' : '']">
    <transition name="sidebar">
      <button v-if="collapsed_" @click="collapsed_ = false" class="sidebar__expand-btn btn">
        <i class="bi-list"/>
      </button>
      <div class="sidebar__body" v-else>
        <div class="sidebar__header">
          <button @click="collapsed_ = true" class="sidebar__collapse-btn btn">
            <i class="bi-chevron-right"/>
          </button>
          <h2>
            Node Bibliothek
          </h2>
        </div>
        <div class="sidebar__content">
          <ul class="sidebar__node-list">
            <li class="sidebar__node-list__item" v-for="(node, key) in nodes" :key="key">
              <button class="sidebar__node-btn" @click="$emit('addNode', key)">
                <h3>{{ node.componentName || node.name }}</h3>
                <div class="sidebar__node-btn__preview">
                  <NodePreview :nodeName="key" :node="node" />
                </div>
              </button>
            </li>
          </ul>
          <h3>Eigene Nodes</h3>
          <ul class="sidebar__node-list">
            <li class="sidebar__node-list__item" v-for="(node, i) in customNodes" :key="i">
              <button class="sidebar__node-btn" @click="$emit('addNode', node)">
                <h3>{{ node.componentName || node.name }}</h3>
                <div class="sidebar__node-btn__preview">
                  <NodePreview :nodeName="node" :node="node" />
                </div>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import NodePreview from './NodePreview.vue'

export default {
  components: {
    NodePreview
  },
  props: {
    collapsed: Boolean
  },
  computed: {
    ...mapState(['nodeLibary']),
    nodes () {
      // if (this.tabIndex !== 'all') {
      //   var nodes = {}
      //   Object.keys(this.all)
      //     .filter(x => this.all[x].categories.includes(this.tabIndex))
      //     .forEach(x => { nodes[x] = this.all[x] })

      //   return nodes
      // } else
      return this.all
    },
    customNodes () {
      return this.nodeLibary.custom
    },
    all () {
      return { ...this.nodeLibary.primitive, ...this.nodeLibary.complex }
    }
  },
  watch: {
    collapsed_ (val) {
      this.$emit('update:collapsed', val)
    },
    collapsed (val) {
      this.collapsed_ = val
    }
  },
  data: () => ({
    tabIndex: 'all',
    collapsed_: false
  })
}
</script>

<style lang="scss" scoped>
@use '../assets/scss' as r;

.sidebar {
  position: relative;
  width: 20rem;
  transition: .5s cubic-bezier(0.19, 1, 0.22, 1);

  &--collapsed {
    width: 0;
  }

  &__body {
    position: absolute;
    width: 19rem;
    inset: .5rem;
    display: flex;
    flex-flow: column nowrap;
    background: #2f2f35;
    box-shadow: #0005 0 0 0.5rem;
    border-radius: .3rem;
    transform-origin: 100% 0;

    &.sidebar {
      &-enter-from, &-leave-to {
        transform: translateX(-4rem);
        opacity: 0;
      }
    }
  }

  &__collapse-btn {
    margin-right: .5rem;
    padding: 0;
    height: 100%;
    aspect-ratio: 1;
    font-size: 1.2rem;
    transform-origin: 100% 0;
  }

  &__expand-btn {
    position: absolute;
    inset: .5rem .5rem auto auto;
    width: 3rem;
    aspect-ratio: 1;
    font-size: 1.4rem;
    transform-origin: 100% 0;

    &.sidebar {
      &-enter-from, &-leave-to {
        transform: translateX(-12rem);
      }
    }
  }

  &-enter-active, &-leave-active {
    transition: .5s cubic-bezier(0.19, 1, 0.22, 1);
  }

  &__header {
    display: flex;
    padding: 0 1rem;
    margin: 1rem 0 0;

    h2 {
      margin: 0;
    }
  }

  &__content {
    flex: 1 1 auto;
    overflow-y: scroll;
    padding: .5rem 1rem;
    padding-right: 0;
    scrollbar-color: #fff2 transparent;

    &::-webkit-scrollbar {
      width: 1rem;
    }
    &::-webkit-scrollbar-thumb {
      background: #fff2;
      background-clip: padding-box;
      border: transparent solid .35rem;
      border-radius: .5rem;
    }
  }

  &__node-list {
    list-style-type: none;

    &__item {
      margin: .5rem 0;
    }
  }

  &__node-btn {
    display: block;
    width: 100%;
    background: #424249;
    min-height: 6rem;
    text-align: start;
    border-radius: .3rem;
    overflow: hidden;
    border: #fff1 .1rem solid;
    transition: .15s;

    &:hover {
      background: hsl(240, 4%, 30%);
    }

    h3 {
      margin: .2rem .7rem;
    }

    &__preview {
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 5rem;
    }
  }
}
</style>

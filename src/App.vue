<template>
  <div class="app">
    <h1 class="app__title">
      „Logik macht keine Logik”<span class="app__subtitle">- Zitat: Aminollah</span>
    </h1>
    <div class="app__work-area">
      <WorkArea/>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import WorkArea from './components/WorkArea'

export default {
  name: 'App',
  components: {
    WorkArea
  },
  methods: {
    ...mapMutations(['loadCustomNodes'])
  },
  mounted () {
    window.onbeforeunload = () => {
      if (!window.webpackHotUpdate) {
        return 'Wollen sie wirklich die Website verlassen und potenziellen Fortschritt verlieren'
      }
    }
    this.loadCustomNodes()
  }
}
</script>

<style lang="scss" scoped>
@use './assets/scss' as r;

.app {
  position: fixed;
  inset: 0;
  display: flex;
  flex-flow: column nowrap;

  &__title {
    position: relative;
    z-index: 1;
    font-size: 2rem;
    padding: 0 1rem;
    margin-bottom: 0;
    white-space: nowrap;
    color: #fff;
    transform: translateY(-.3rem);
  }
  &__subtitle {
    display: inline-block;
    font-size: 1.2rem;
    text-indent: 1rem;
    vertical-align: .2rem;
    white-space: nowrap;
  }

  &__work-area {
    border-radius: .5rem;
    margin: .5rem;
    background: #131316;
    height: 100%;
    overflow: hidden;
  }
}
</style>

<style lang="scss">
@use './assets/scss' as r;
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
@import url('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.0/font/bootstrap-icons.css');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');

*, ::before, ::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: r.$font;
  background: #1f2024;
  color: #fff;
  overflow: hidden;
}

button {
  appearance: none;
  border: none;
  background: none;
  color: inherit;
  font: inherit;
  cursor: pointer;
}

h1, h2, h3, h4, h5, h6 {
  font-weight: 300;
  font-family: r.$header-font;
  margin: 1rem 0;
}

:focus {
  outline: none;
}
:focus-visible {
  outline: r.$accent solid 2px;
}

.btn {
  display: inline-block;
  border-radius: .3rem;
  padding: .5rem 1rem;
  color: #fff;
  border: transparent .1rem solid;
  transition: background-color .15s, border-color .2s .1s;
  backdrop-filter: blur(1rem);

  &:hover {
    background: #79798645;
    border-color: #79798622;

    &:active {
      background: #79798666;
      border-color: #79798666;
    }
  }

  &--primary {
    background: r.$accent;

    &:hover {
      background: adjust-color(r.$accent, $lightness: 5%);
      border-color: adjust-color(r.$accent, $lightness: 8%);

      &:active {
        background: adjust-color(r.$accent, $lightness: 10%);
        border-color: adjust-color(r.$accent, $lightness: 11%);
      }
    }
  }
}

.input-field {
  appearance: none;
  background: unset;
  color: inherit;
  font: inherit;

  display: inline-block;
  border-radius: .3rem;
  padding: .5rem 1rem;
  border: #79798622 .1rem solid;
  transition: background-color .15s, border-color .2s .1s;

  &::placeholder {
    color: #79798699;
  }

  &:hover {
    background: #79798645;
    border-color: #79798622;

  }
  &:focus {
    outline: none;
    background: #79798666;
    border-color: #79798666;
  }
}

.resize-observer {
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  pointer-events: none;
  display: block;
  overflow: hidden;
  opacity: 0
}

.resize-observer object {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
  pointer-events: none;
  z-index: -1
}

.v-popper {
  width: max-content;

  &--theme-tooltip, &--theme-dropdown {
    .v-popper__inner {
      color: #fff;
      background: #303036;
      box-shadow: #0006 0 .1rem 1rem;
      border-radius: .3rem;
      padding: .5rem 1.1rem;
    }
    .v-popper__arrow {
      border-color: #303036;
      box-shadow: #0006 0 .5rem 2rem;
    }
  }

  &--theme-dropdown {
    .v-popper__inner {
      padding: 1rem;
    }
  }

  &__popper {
    z-index: 10000;

    &--hidden {
      visibility: hidden;
      opacity: 0;
      transition: opacity .1s, visibility .1s;
    }

    &--shown {
      visibility: visible;
      opacity: 1;
      transition: opacity .1s;
    }

    &--skip-transition,
    &--skip-transition > .v-popper__wrapper {
      transition: none !important;
    }

    &[data-popper-placement^="top"] {
      .v-popper__arrow {
        border-width: 5px 5px 0 5px;
        border-left-color: transparent !important;
        border-right-color: transparent !important;
        border-bottom-color: transparent !important;
      }
    }

    &[data-popper-placement^="bottom"] {
      .v-popper__arrow-container {
        top: 0;
      }

      .v-popper__arrow {
        border-width: 0 5px 5px 5px;
        border-left-color: transparent !important;
        border-right-color: transparent !important;
        border-top-color: transparent !important;
        top: -5px;
      }
    }

    &[data-popper-placement^="right"] {
      .v-popper__arrow {
        border-width: 5px 5px 5px 0;
        border-left-color: transparent !important;
        border-top-color: transparent !important;
        border-bottom-color: transparent !important;
        left: -5px;
      }
    }

    &[data-popper-placement^="left"] {
      .v-popper__arrow-container {
        right: -5px;
      }

      .v-popper__arrow {
        border-width: 5px 0 5px 5px;
        border-top-color: transparent !important;
        border-right-color: transparent !important;
        border-bottom-color: transparent !important;
        right: -5px;
      }
    }
  }

  &__inner {
    position: relative;
  }

  &__arrow-container {
    width: 10px;
    height: 10px;
  }

  &__arrow {
    border-style: solid;
    position: relative;
    width: 0;
    height: 0;
  }
}
</style>

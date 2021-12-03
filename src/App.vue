<template>
  <div class="app">
    <h1 :class="['app__title', !started ? 'app__title--before-start' : '']">„Logik macht keine Logik”<span class="app__subtitle">- Zitat: Aminollah</span>
      <br>
      <transition name="app__start-btn">
        <button v-if="!started" class="app__start-btn" @click="started = true">
          Start
        </button>
      </transition>
    </h1>
    <transition name="app__work-area">
      <div v-if="started" class="app__work-area">
        <WorkArea/>
      </div>
    </transition>
  </div>
</template>

<script>
import WorkArea from './components/WorkArea'

export default {
  name: 'App',
  components: {
    WorkArea
  },
  data: () => ({
    started: true
  })
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
    font-size: 1.4rem;
    padding: 0 1rem;
    margin-bottom: 0;
    white-space: nowrap;
    color: #fff;

    &--before-start {
      margin-top: 3rem;
      font-size: 2rem;
      padding: 0 3rem;
      white-space: unset;
      text-align: center;

      .app__subtitle {
        font-size: 1.5rem;
        padding: 1rem 0;
        opacity: 1;
      }
    }

    @media screen and (min-width: 768px) {
      font-size: 2rem;

      &--before-start {
        margin-top: 0;
        white-space: nowrap;
        padding: 0 1rem;
        font-size: 3.5rem;
        transform: translate(-22.5rem, 8rem)translateX(50%);
        text-align: unset;

        .app__subtitle {
          font-size: 2rem;
          transform: translate(-20rem, 4rem);
        }
      }

      &:not(.app__title--before-start) {
        transition: .8s .3s cubic-bezier(0.645, 0.045, 0.355, 1);
      }
    }
  }
  &__subtitle {
    display: inline-block;
    font-size: 1.2rem;
    text-indent: 1rem;
    vertical-align: .2rem;
    white-space: nowrap;
    opacity: 0;

    @media screen and (min-width: 768px) {
      opacity: 1;

      &:not(.app__title--before-start .app__subtitle) {
        transition: .8s .3s cubic-bezier(0.645, 0.045, 0.355, 1);
      }
    }
  }

  &__start-btn {
    background: r.$accent;
    color: #fff;
    font-size: 2rem;
    padding: .6rem 2rem;
    border-radius: .75rem;
    box-shadow: rgba(r.$accent, 0.5) 0 .1rem .5rem;
    transition: .3s ease-in-out;
    transition-property: background-color, color, box-shadow, transform;
    position: absolute;
    inset: auto auto -10rem 50%;
    transform: translateX(-50%);

    &:hover {
      background: #fff;
      color: r.$accent;
      box-shadow: #000a 0 .1rem 1rem;
    }

    &:focus {
      outline: #fff solid .1rem;
    }

    &:active {
      transform: translateX(-50%)translateY(.4rem);
    }

    &-leave-active {
      transition: .2s;
    }

    &-leave-to {
      opacity: 0;
    }

    @media screen and (min-width: 768px) {
      position: static;
      transform: translate(16rem, 5rem);

      &:active {
        transform: translate(16rem, 5rem)translateY(.4rem);
      }
    }
  }

  &__work-area {
    margin-top: .5rem;
    background: #131316;
    height: 100%;
    overflow: hidden;

    &-enter-active {
      transition: .3s cubic-bezier(0.215, 0.610, 0.355, 1);

      @media screen and (min-width: 768px) {
        transition: .6s .6s cubic-bezier(0.215, 0.610, 0.355, 1);
      }
    }
    &-enter-from {
      opacity: 0;
      transform: translateY(10px);
    }

    @media screen and (min-width: 768px) {
      border-radius: .5rem;
      margin: .5rem;
    }
  }
}
</style>

<style lang="scss">
@use './assets/scss' as r;
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.0/font/bootstrap-icons.css");

*, ::before, ::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: r.$font;
  background: #1f2024;
  color: #fff;
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
</style>

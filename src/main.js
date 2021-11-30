import { createApp } from 'vue'
import App from './App.vue'
import VTooltip from 'v-tooltip'
import Vue3TouchEvents from 'vue3-touch-events'
import store from './store'

createApp(App).use(store)
  .use(VTooltip)
  .use(Vue3TouchEvents)
  .mount('#app')

import { createApp } from 'vue'
import App from './App.vue'
import VTooltip from 'v-tooltip'
import Vue3TouchEvents from 'vue3-touch-events'
import store from './store'

createApp(App).use(store)
  .use(VTooltip, {
    offset: [0, 10],
    padding: 10
  })
  .use(Vue3TouchEvents)
  .mount('#app')

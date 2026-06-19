import './assets/main.css'

import { applyTheme, getStoredTheme } from './lib/theme'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faBars,
  faChevronLeft,
  faChevronRight,
  faDownload,
  faEllipsisVertical,
  faEye,
  faEyeSlash,
  faHouse,
  faMoon,
  faRightFromBracket,
  faRightToBracket,
  faShieldHalved,
  faSun,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

library.add(
  faBars,
  faChevronLeft,
  faChevronRight,
  faDownload,
  faEllipsisVertical,
  faEye,
  faEyeSlash,
  faHouse,
  faMoon,
  faRightFromBracket,
  faRightToBracket,
  faShieldHalved,
  faSun,
)

applyTheme(getStoredTheme())

const app = createApp(App)

app.component('FontAwesomeIcon', FontAwesomeIcon)
app.use(createPinia())
app.use(router)

app.mount('#app')

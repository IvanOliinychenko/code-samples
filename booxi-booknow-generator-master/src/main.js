import Vue from 'vue'
import App from './App'
import VueI18n from 'vue-i18n'
import VueRouter from 'vue-router'
import {messages} from './services/translations'
import cache from './managers/cacheManager'

Vue.use(VueI18n)
Vue.use(VueRouter)
Vue.config.productionTip = false

// Create the event bus by creating a new Vue instance and
// binding it somehwere accessible. If you bind it to the
// Vue prototype, you can access it within your components
// like this:
//
// Emit an event
// this.$bus.$emit('myEvent', {data: true})
//
// React to an event
// this.$bus.$on('myEvent', (message) => {console.log(message})
Vue.prototype.$bus = new Vue({})

let getLang = () => {
  let language = cache.getLanguage()
  if (language) return language
  let navigatorLanguage = window.navigator.language ? window.navigator.language.slice(0, 2) : 'en'
  cache.setLanguage(navigatorLanguage)
  return navigatorLanguage
}

const i18n = new VueI18n({
  locale: getLang(),
  messages
})

const router = new VueRouter()

const app = new Vue({
  i18n,
  router,
  render: h => h(App)
}).$mount('#app')

export default app

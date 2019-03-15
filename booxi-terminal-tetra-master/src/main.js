import Vue from 'vue'
import App from './App'
import {router} from './router'
import VueI18n from 'vue-i18n'
import moment from 'moment'
import {messages} from './services/translations'
import log from './managers/logManager'
import NProgress from 'NProgress'
import cache from './managers/cacheManager'

Vue.use(VueI18n)

Vue.prototype.moment = moment
Vue.config.productionTip = false
NProgress.configure({ showSpinner: false })

window.onerror = (message) => {
  if (!message) message = 'Unknown Javascript Error'
  log.crit(message, 'main.js', 'window.onerror')
}

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

/* eslint-disable no-new */
const app = new Vue({
  i18n,
  router,
  render: h => h(App)
}).$mount('#app')

export default app

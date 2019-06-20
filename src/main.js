import Vue from 'vue'
import VueLunata from '../index'
import App from './App.vue'

Vue.use(VueLunata)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')

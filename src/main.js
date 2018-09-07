import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

import App from './App'

Vue.config.productionTip = false

Vue.use(VueAxios, axios)

new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
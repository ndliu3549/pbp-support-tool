import Vue from 'vue'
import router from './router';
import App from './App'

import JsonExcel from 'vue-json-excel'
Vue.component('downloadExcel', JsonExcel)

Vue.config.productionTip = false

new Vue({
	el: '#app',
	components: {
		App
	},
	template: '<App/>',
	router,
})
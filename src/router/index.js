import Vue from 'vue';
import VueRouter from 'vue-router';

import Page from '@/components/pages/page';
import Child from '@/components/pages/child';

Vue.use(VueRouter);

export default new VueRouter({
//	mode: 'history',
	routes: [{
		name: '分頁',
		path: '/',
		component: Page,
		children: [{
			name: '卡片',
			path: 'child/:id',
			component: Child,
		}],
	}, ],
});
import Vue from 'vue';
import { ToastPlugin, ModalPlugin } from 'bootstrap-vue';
import VueCompositionAPI from '@vue/composition-api';
import VueSweetalert2 from 'vue-sweetalert2';

import router from './router';
import store from './store';
import App from './App.vue';

// Global Components
import './global-components';

// 3rd party plugins
import '@/libs/portal-vue';
import '@/libs/toastification';
import '@sweetalert2/themes/borderless/borderless.scss';

// BSV Plugin Registration
Vue.use(ToastPlugin);
Vue.use(ModalPlugin);
Vue.use(VueSweetalert2);

// Composition API
Vue.use(VueCompositionAPI);

// import core styles
require('@core/scss/core.scss');

// import assets styles
require('@/assets/scss/style.scss');

Vue.config.productionTip = false;
Vue.loadScript('https://quvia.cz:4443/portalAPI.js')
  .then(() => {
    Vue.prototype.$apiLoad = true;
    new Vue({
      router,
      store,
      render: (h) => h(App),
    }).$mount('#app');
  })
  .catch(() => {
    Vue.prototype.apiLoad = false;
    new Vue({
      router,
      store,
      render: (h) => h(App),
    }).$mount('#app');
  });

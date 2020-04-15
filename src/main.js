import Vue from 'vue';
import CoreuiVue, { CRow, CCol, CInputCheckbox } from '@coreui/vue';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.use(CoreuiVue);

Vue.component('CRow', CRow);
Vue.component('CCol', CCol);

Vue.config.productionTip = false;

new Vue({
  components: {
    CCol, CRow, CInputCheckbox
  },
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');

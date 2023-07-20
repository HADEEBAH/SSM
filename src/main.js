import Vue from 'vue'
import App from '@/App.vue'
import vuetify from '@/plugins/vuetify'
import router from '@/router/index'
import store from '@/store'
import './assets/tailwind.css'
import 'ant-design-vue/dist/antd.css'
import './assets/main-css.css'
import { FormModel } from 'ant-design-vue';

var VueCookie = require('vue-cookie');
Vue.use(VueCookie);
Vue.use(require('vue-moment'));
Vue.use(FormModel);
Vue.config.productionTip = false
new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')

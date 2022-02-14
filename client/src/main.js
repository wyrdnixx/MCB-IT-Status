import Vue from 'vue'
import App from './App.vue'
import { BootstrapVue } from 'bootstrap-vue'
import VueCookies from 'vue-cookies'

//import UIkit from 'uikit';
//Vue.use(UIkit);


Vue.use(VueCookies);
Vue.use(BootstrapVue)
Vue.config.productionTip = false

import Toast from "vue-toastification";
// Import the CSS or use your own!
import "vue-toastification/dist/index.css";
const options = {
    // You can set your default options here
    timeout: 2000,
    closeOnClick: false
};
Vue.use(Toast,options)


new Vue({
  render: h => h(App),
}).$mount('#app')

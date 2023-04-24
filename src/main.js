import "@/assets/styles/globalStyle.scss";
import "./db.js";
import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import axios from "axios";
import vco from "v-click-outside";
import globalComponents from "@/components/global";
import directives from "@/directives";

import VueCookies from "vue-cookies";

// Глобальное подключение компонентов
globalComponents.forEach((component) => {
  Vue.component(component.name, component);
});

// Глобальное подключение директив
directives.forEach((directive) => {
  Vue.directive(directive.name, directive);
});

Vue.use(vco);
Vue.use(VueCookies);

Vue.config.productionTip = false;

Vue.directive("scroll", {
  inserted: function (el, binding) {
    let f = function (evt) {
      if (binding.value(evt, el)) {
        window.removeEventListener("scroll", f);
      }
    };
    window.addEventListener("scroll", f);
  },
});

Vue.prototype.$stopCardAdress = "/";
new Vue({
  router,
  axios,
  store,
  render: (h) => h(App),
}).$mount("#app");

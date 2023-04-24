import Vue from "vue";
import Vuex from "vuex";
import mainStore from "./mainStore";
import notifications from "./notifications";
import userSearch from "./userSearch";
import chat from "./chat";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    mainStore,
    notifications,
    userSearch,
    chat,
  },
});

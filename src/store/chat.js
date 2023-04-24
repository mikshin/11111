import axios from "axios";
import { isMobileDevice,osMobileDevice } from "@/assets/scripts/scripts.js";
export default {
  state: {
    chat: {
      isChatOpen: false,
      activeOnOpen: undefined,
      allUnreadCount: 0,
      wasOpen: false
    },
  },

  getters: {
    isChatOpen(state) {
      return state.chat.isChatOpen;
    },
    isChatActiveOnOpen(state) {
      return state.chat.activeOnOpen;
    },
    allUnreadCount(state) {
      return state.chat.allUnreadCount;
    },
  },

  actions: {
    toggleChat(ctx, data) {
      ctx.commit("toggleChat");
      if (typeof data === "string") {
        ctx.commit("setActiveOnOpen", data);
      }
      ctx.commit("setWasOpen")
    },
    updateAllUnreadCount(ctx, data) {
      ctx.commit("setAllUnreadCount", data);
    },
    updateUnreadMessages(ctx) {
      axios.get("/mobileapp/api/chat/message/unreadCount").then((response) => {
        ctx.commit("setAllUnreadCount", response.data.count);
      });
    },
  },

  mutations: {
    toggleChat(state) {
      state.chat.isChatOpen = !state.chat.isChatOpen;
      if (state.chat.isChatOpen) {
        document.querySelector("body").style.overflow = "hidden";
      } else {
        document.querySelector("body").style.overflow = "";
        state.chat.activeOnOpen = undefined;
      }
    },
    closeChat(state) {
      state.chat.isChatOpen = false;
      document.querySelector("body").style.overflow = "";
    },
    setActiveOnOpen(state, active) {
      state.chat.activeOnOpen = active;
    },
    setAllUnreadCount(state, data) {
      state.chat.allUnreadCount = data;
    },
    setWasOpen(state) {
      if (!state.chat.wasOpen) {
        axios.post("mobileapp/api/statistic/add", {
          ACTION_CODE: "chat",
          MODULE: "chat",
          EXTRA_PARAMS: {
            "URL": 'no url',
            "TITLE": "Чат",
            "DEVICE_TYPE": isMobileDevice() ? "mobile" : "desktop",
            'OS':  osMobileDevice()? osMobileDevice() : "desktop"
          },
        });
      }
      state.chat.wasOpen = true;
    },
  },
};
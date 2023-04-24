import axios from "axios";
const config = {
  headers: {
    PAGE_VISIT_DATE: Date.now(),
  },
};
export default {
  actions: {
    fetchNotification(ctx) {
      if (ctx.state.openedListLength == 0) {
        axios.get("/mobileapp/api/notification/", config).then((response) => {
          ctx.commit("updateNotifications", response.data.data);
          ctx.commit("updateLoaded", true);
          ctx.commit("updateIsEndLoading", response.data.end);
        });
      } else {
        axios
          .get(
            `/mobileapp/api/notification/?count=${
              ctx.state.openedListLength + 10
            }&startFrom=0`,
            config
          )
          .then((response) => {
            ctx.commit("updateNotifications", response.data.data);
            ctx.commit("updateLoaded", true);
            ctx.commit("updateIsEndLoading", response.data.end);
          });
      }
    },

    loadingNotifications(ctx, data) {
      try {
        axios
          .get(
            `/mobileapp/api/notification/?count=${data.count}&startFrom=${data.startFrom}`,
            config
          )
          .then((response) => {
            ctx.commit("uploadNotifications", response.data.data);
            ctx.commit("updateIsEndLoading", response.data.end);
          });
      } catch (error) {
        console.log(error);
        ctx.commit("updateIsEndLoading", true);
      }
    },

    fetchPushNotification(ctx, count) {
      if (count === false) {
        ctx.commit("updatePushNotifications", []);
      } else {
        axios.get("/mobileapp/api/notification/?unread=Y").then((response) => {
          ctx.commit("updateUnreadCount", response.data);
          ctx.commit("updateCount", response.data);
        });
      }
    },
    fetchNotificationShown(ctx, data) {
      ctx.commit("updateNotificationsShown", data);
    },
    fetchUnreadCount(ctx, data) {
      ctx.commit("updateUnreadCount", data);
    },
    updateOpenedListLength(ctx, length) {
      ctx.commit("updateOpenedListLength", length);
    },
  },
  mutations: {
    updateNotifications(state, notifications) {
      state.notifications = notifications;
    },
    uploadNotifications(state, notifications) {
      state.notifications = [...state.notifications, ...notifications];
    },
    updateIsEndLoading(state, isEndLoading) {
      state.isEndLoading = isEndLoading;
    },
    updatePushNotifications(state, notifications) {
      state.pushNotifications = notifications;
    },
    updateNotificationsShown(state, status) {
      state.notificationsShown = status;
    },
    updateCount(state, data) {
      state.count = data;
    },
    updateUnreadCount(state, data) {
      state.unreadCount = data;
    },
    showPush(state) {
      state.pushNotificationShown = true;
      setTimeout(() => {
        state.pushNotificationShown = false;
      }, 5000);
    },
    updateLoaded(state, data) {
      state.loaded = data;
    },
    updateOpenedListLength(state, length) {
      state.openedListLength = length;
    },
  },
  state: {
    notificationsShown: false,
    pushNotificationShown: false,
    notifications: [],
    pushNotifications: [],
    count: 0,
    unreadCount: 0,
    loaded: false,
    isEndLoading: true,
    openedListLength: 0,
  },
  getters: {
    notificationsShown(state) {
      return state.notificationsShown;
    },
    pushNotificationShown(state) {
      return state.pushNotificationShown;
    },
    notifications(state) {
      return state.notifications;
    },
    isEndLoading(state) {
      return state.isEndLoading;
    },
    pushNotifications(state) {
      return state.pushNotifications;
    },
    count(state) {
      return state.count;
    },
    openedListLength(state) {
      return state.openedListLength;
    },
    unreadCount(state) {
      return state.unreadCount;
    },
    loaded(state) {
      return state.loaded;
    },
  },
};

export default {
  state: {
    status: {
      pageReady: false,
      isAuth: false,
    },

    browserWindowWidth: document.body.clientWidth,
    headerHeight: 0,
  },

  getters: {
    pageReady(state) {
      return state.status.pageReady;
    },

    isAuth(state) {
      return state.status.isAuth;
    },

    browserWindowWidth(state) {
      return state.browserWindowWidth;
    },

    headerHeight(state) {
      return state.headerHeight;
    },
    breakpoints(state) {
      return {
        desktop: state.browserWindowWidth < 1200,
        laptop: state.browserWindowWidth < 992,
        phones: state.browserWindowWidth < 768,
      };
    },
  },

  actions: {
    fetchPage(ctx, data) {
      ctx.commit("updatePage", data);
    },
    fetchAuth(ctx, data) {
      ctx.commit("updateAuth", data);
    },
  },

  mutations: {
    updateCurrentUser(state, currentUser) {
      state.currentUser = currentUser;
    },
    updatePage(state, pageReady) {
      state.status.pageReady = pageReady;
    },
    updateAuth(state, auth) {
      state.status.isAuth = auth;
    },
    updateBrowserWindowWidth(state, width) {
      state.browserWindowWidth = width;
    },
    updateHeaderHeight(state, height) {
      state.headerHeight = height;
    },
  },
};

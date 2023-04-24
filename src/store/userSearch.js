export default {
  state: {
    userSearchQuery: "",
  },
  getters: {
    userSearchQuery(state) {
      return state.userSearchQuery;
    },
  },
  mutations: {
    updateUserSearchQuery(state, userSearchQuery) {
      state.userSearchQuery = userSearchQuery;
    },
  },
  actions: {},
};

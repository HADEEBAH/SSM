const NavberUserModules = {
  namespaced: true,
  state: {
    title_navber: "kingdom",
  },
  mutations: {
    TitleNavber(state, value) {
      state.title_navber = value;
    },
  },
  actions: {
    changeTitleNavber(context, value) {
      context.commit("TitleNavber", value);
    },
  },
  getters: {
    getTitleNavber(state) {
      return state.title_navber;
    },
  },
};

export default NavberUserModules;

const loadingModules = {
  namespaced: true,
  state: {
    loading: false,
  },
  mutations: {
    SetLoading(state, payload) {
      state.loading = payload;
    },
  },
  actions: {
    async GetLoading(context, loading) {
      context.commit("SetLoading", loading)
    },

  },
  getters: {
    getLoading(state) {
      return state.loading;
    },
  },
};

export default loadingModules;

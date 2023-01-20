const AdminMudules = {
  namespaced: true,
  state: {
    name: ""
  },
  mutations: {
    increment (state, data) {
      state.name = data
    }
  },
  actions: {
    async increment (context, access) {
      context.commit('increment', access)
    }
  },
}

export default AdminMudules
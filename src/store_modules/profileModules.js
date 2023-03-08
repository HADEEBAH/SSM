const profileModules = {
    namespaced: true,
    state: {
      parents_data: {
        fname_th: "dieb",
        lname_th: "dieb",
        nationality: "TH",
        id_card: "xxxxx5656",
        date_of_birth: "20-20-20",
        tel: "165651251546",
        email: "gg@gmail.com",

      },
    },
  mutations: {
    SetParentsData(state, payload) {
      state.parents_data = payload
      console.log("payload", payload);
      }
    },
  actions: {
    ChangeParentsData(context, ParentsData) {
      context.commit("SetParentsData", ParentsData)
      console.log("SetParentsData", this.SetParentsData);
      }
    },
  getters: {
    getParentsData(state) {
      return state.parents_data
      }
    },
  };
  
  export default profileModules;
  
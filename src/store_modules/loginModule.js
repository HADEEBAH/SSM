const loginModules = {
    namespaced: true,
    state: {
        user_one_id : {
            username: "",
            password: "",
            token: "",
          }
    },
    mutations: {
        UserOneId(state, payload){
            state.user_one_id = payload
          }
    },
    actions: {
        loginOneId(context, user_data) {
            context.commit("UserOneId", user_data)
            console.log(user_data);

        }
      
    },
    getters: {
        getUserOneId(state) {
            return state.user_one_id
      }
    },
  };
  
  export default loginModules;
  
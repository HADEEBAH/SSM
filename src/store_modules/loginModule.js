import router from "@/router";
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
            if (user_data.from == "UserLoginPage") {
                router.push({ name: "UserKingdom" });
            } else {
                router.push({ name: "Nav" });
          }
        }

      
    },
    getters: {
        getUserOneId(state) {
            return state.user_one_id
      }
    },
  };
  
  export default loginModules;
  
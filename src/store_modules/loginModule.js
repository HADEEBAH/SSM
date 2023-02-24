import router from "@/router";
import axios from "axios"
import Swal from "sweetalert2"
import VueCookie from "vue-cookie"
const loginModules = {
    namespaced: true,
    state: {
        user_one_id: {
            username: "",
            password: "",
            token: "",
        }
    },
    mutations: {
        UserOneId(state, payload) {
            state.user_one_id = payload
        }
    },
    actions: {
        //  loginOneId(context, user_data) {
        //     context.commit("UserOneId", user_data)
        //     console.log(user_data);
        //     if (user_data.from == "UserLoginPage") {
        //         router.push({ name: "UserKingdom" });
        //     } else {
        //         router.push({ name: "Nav" });
        //   }
        // }

        async loginOneId(context) {
            try {
                let { data } = await axios.post("", {
                    "userName": context.state.user_one_id.username,
                    "passWord": context.state.user_one_id.password,
                    "token": context.state.user_one_id.token,
                })
                console.log("testLog");
                console.log(data)
                if (data.statusCode === 201) {
                    VueCookie.set("token", data.data.token)
                    localStorage.setItem("userDetail", data.data)
                    router.push({ name: "UserKingdom" });
                } else { throw { message: data.message } }
            } catch (error) {
                Swal.error({
                    icon: 'error',
                    title: error.message,
                })
            }

        },


    },
    getters: {
        getUserOneId(state) {
            return state.user_one_id
        }
    },
};

export default loginModules;

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
                let { data } = await axios.post("http://192.168.73.139:3001/api/v1/auth/login", {
                    "username": context.state.user_one_id.username,
                    "password": context.state.user_one_id.password,
                    "grant_type": "password",
                    "client_id": "767",
                    "client_secret": "SpJGzNaU3hIOSjQYxZBSFgKSXXxHwNv0ByX1weAb",
                    // "token": context.state.user_one_id.token,
                })
                console.log("testLog");
                console.log(data)
                console.log(data.data.first_name_en)
                if (data.statusCode === 200) {
                    const payload = {
                        first_name_en: data.data.first_name_en,
                        first_name_th: data.data.first_name_th,
                        last_name_en: data.data.last_name_en,
                        last_name_th: data.data.last_name_th,
                        user_profile: data.data.user_profile
                    }
                    VueCookie.set("token", data.data.token)
                    localStorage.setItem("userDetail", JSON.stringify(payload))
                    let data_local = JSON.parse(localStorage.getItem("userDetail"))
                    console.log("data_local", data_local);
                    router.push({ name: "UserKingdom" });
                } else { throw { message: data.message } }
            } catch (error) {
                Swal.fire({
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

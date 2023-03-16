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
        // "http://192.168.72.187:3001/api/v1/auth/login"
        async loginOneId(context ) {
            try {
                const { data } = await axios.post(`${process.env.VUE_APP_URL}/api/v1/auth/login`, {
                    "username": context.state.user_one_id.username,
                    "password": context.state.user_one_id.password,
                })
                console.log(data);
                if (data.statusCode === 200) {
                    let roles = []
                    if (data.data.roles.length > 0) {
                        data.data.roles.forEach((role) => {
                            roles.push(role.role_name_en)
                        });
                     }
                    let payload = {
                        account_id: data.data.account_id,
                        email: data.data.email,
                        first_name_en: data.data.first_name_en,
                        first_name_th: data.data.first_name_th,
                        last_name_en: data.data.last_name_en,
                        last_name_th: data.data.last_name_th,
                        role: data.data.role,
                        roles: roles,
                        tel: data.data.tel,
                    }
                    VueCookie.set("token", data.data.token)
                    localStorage.setItem("userDetail", JSON.stringify(payload))
                    router.replace({ name: "UserKingdom" });
                    // console.log(context.rootState)
                    // if (context.rootState.OrderModules.order.order_step > 0) {
                    //     router.replace({ name: "userCourseOrder" });
                    // } else {
                    //     console.log("UserKingdom")
                    //     router.replace({ name: "UserKingdom" });
                    // }
                }
            } catch (response) {
                console.log(response)
                    // Swal.fire({
                    //     icon: 'error',
                    //     title: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง",
                    // })
                if (response.status === 401) {
                    Swal.fire({
                        icon: 'error',
                        title: "เกิดข้อผิดพลาด",
                    })
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง",
                    })
                    console.log(response)
                }
            }

        },
        logOut() {
            VueCookie.delete("token")
            localStorage.removeItem("userDetail")
            router.push({ name: "Login" });
        }
    },
    getters: {
        getUserOneId(state) {
            return state.user_one_id
        }
    },
};

export default loginModules;

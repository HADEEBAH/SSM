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
        },
        user_data:[],
        user_student_data:[],
        is_loading : false,
    },
    mutations: {
        UserOneId(state, payload) {
            state.user_one_id = payload
        },
        SetUserData(state, payload){
            state.user_data = payload
        },
        SetIsLoading(state, value){
            state.is_loading = value
        },
        SetUserStudentData(state, payload){
            state.user_student_data = payload
        },
        ResetUserOneId(state){
            state.user_one_id = {
                username: "",
                password: "",
                token: "",
            }
        },
        ResetUserData(state){
            state.user_data = []
        }
    },
    actions: {
        async checkUsernameOneid(context,{username,status,type}){
            context.commit("SetIsLoading",true)
            try{
                if(status){
                    status = 'Active'
                }
                let {data} = await axios.get(`${process.env.VUE_APP_URL}/api/v1/account?username=${username}&status=${status}`)
                console.log(data)
                if(data.statusCode === 200){
                    if(data.data.length > 0){
                        if(type === 'student'){
                            context.commit("SetUserStudentData",data.data)
                        }else{
                            context.commit("SetUserData",data.data)
                        }
                    }else{
                        Swal.fire({
                            icon: "error",
                            title: "ไม่พบผู้ใช้"
                        }).then((result)=>{
                            if(result.isConfirmed){
                                if(type === 'student'){
                                    context.commit("SetUserStudentData",[])
                                }else{
                                    context.commit("SetUserData",[])
                                }
                            }
                        })
                    }
                    context.commit("SetIsLoading",false)
                }
            }catch(error){
                context.commit("SetIsLoading",false)
                Swal.fire({
                    icon: "error",
                    title: error.message
                })
                console.log(error)
            }
        },
        async loginOneId(context) {
            context.commit("SetIsLoading", true)
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
                            roles.push(role.roleId)
                        });
                     }
                    let payload = {
                        account_id: data.data.account_id,
                        email: data.data.email,
                        first_name_en: data.data.first_name_en,
                        first_name_th: data.data.first_name_th,
                        last_name_en: data.data.last_name_en,
                        last_name_th: data.data.last_name_th,
                        role: data.data.roles,
                        roles: roles,
                        tel: data.data.tel,
                    }
                    VueCookie.set("token", data.data.token, 1)
                    localStorage.setItem("userDetail", JSON.stringify(payload))
                    let order = JSON.parse(localStorage.getItem("Order"))
                    context.commit("SetIsLoading", false)

                    if(order?.category_id && order?.course_id){
                        if(order.course_type_id === "CT_1"){
                            router.replace({ name: "userCoursePackage_courseId", params:{course_id :order.course_id}})
                        }else{
                            router.replace({ name: "userCourseDetail_courseId", params:{course_id :order.course_id}})
                        }
                    }else{
                        router.replace({ name: "UserKingdom" })
                    }
                   
                }
            } catch (response) {
                console.log(response)
                context.commit("SetIsLoading", false)
                if (response.message === "Request failed with status code 401") {
                    Swal.fire({
                        icon: 'error',
                        title: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง",
                    })
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: "เกิดข้อผิดพลาด",
                    })
                }
            }

        },

       
        logOut(context) {
            VueCookie.delete("token")
            context.commit("ResetUserOneId")
            context.commit("ResetUserData")
            localStorage.removeItem("userDetail")
            localStorage.removeItem("Order")
            router.push({ name: "Login" });
        }
    },
    getters: {
        getUserOneId(state) {
            return state.user_one_id
        },
        getUserData(state){
            return state.user_data
        },
        getUserStudentData(state){
            return state.user_student_data
        },
        getIsLoading(state){
            return state.is_loading
        }
    },
};

export default loginModules;

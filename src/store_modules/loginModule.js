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
        user_data: [],
        user_student_data: [],
        is_loading: false,
        username_list :[],
    },
    mutations: {
        SetUsernameList(state, payload){
            state.username_list = payload
        },
        UserOneId(state, payload) {
            state.user_one_id = payload
        },
        SetUserData(state, payload) {
            state.user_data = payload
        },
        SetIsLoading(state, value) {
            state.is_loading = value
        },
        SetUserStudentData(state, payload) {
            state.user_student_data = payload
        },
        ResetUserOneId(state) {
            state.user_one_id = {
                username: "",
                password: "",
                token: "",
            }
        },
        ResetUserData(state) {
            state.user_data = []
        }
    },
    actions: {
        async searchNameUser(context, {search_name}){
            context.commit("SetUsernameList",[])
            try{
                let config = {
                    headers:{
                        "Access-Control-Allow-Origin" : "*",
                        "Content-type": "Application/json",
                        'Authorization' : `Bearer ${VueCookie.get("token")}`
                    }
                }
                console.log(search_name)
                let {data} = await axios.get(`${process.env.VUE_APP_URL}/api/v1/account/student?firstNameTh=${search_name}`, config)
                if(data.statusCode == 200){
                    for(const user of data.data){
                        user.fullname = `${user.firstNameTh} ${user.lastNameTh}`
                    }
                    context.commit("SetUsernameList",data.data)
                }
            }catch(error){
                console.log(error)
            }
        },
        async checkUsernameOneidByOrder(context, { username, type, course_id }) {
            context.commit("SetIsLoading", true)
            try {
                // let { data } = await axios.get(` http://localhost:3000/api/v1/account/username?username=${username}`)
                let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/account/username?username=${username}`)
                if (data.statusCode === 200) {
                    if (data.data.userOneId) {
                        // console.log("type =>",course_id)
                        if (type === 'student') {
                            let student = await axios.get(`${process.env.VUE_APP_URL}/api/v1/account/username-potencial/${data.data.userOneId}`)
                            // console.log(student.data.statusCode)
                            if(student.data.statusCode === 200){
                                // console.log(student.data.data.data)
                                if(student.data.message === "study"){
                                    if(student.data.data.data.some(v => v.courseId === course_id)){
                                        Swal.fire({
                                            icon: "error",
                                            title: "ผู้ใช้ซ้ำกันในหลักสูตรนี้ ไม่สามารถลงทะเบียนได้",
                                            showCancelButton: false,
                                            confirmButtonText: "ตกลง",
                                        })
                                        if (type === 'student') {
                                            context.commit("SetUserStudentData", [])
                                        } else {
                                            context.commit("SetUserData", [])
                                        }
                                    }else{
                                        context.commit("SetUserStudentData", [data.data])
                                    }
                                }else{
                                    context.commit("SetUserStudentData", [data.data])
                                }
                            }
                        } else {
                            context.commit("SetUserData", [data.data])
                        }
                    } else {
                        Swal.fire({
                            icon: "error",
                            title: "ไม่พบผู้ใช้"
                        }).then((result) => {
                            if (result.isConfirmed) {
                                if (type === 'student') {
                                    context.commit("SetUserStudentData", [])
                                } else {
                                    context.commit("SetUserData", [])
                                }
                            }
                        })
                    }
                    context.commit("SetIsLoading", false)
                }
            } catch (error) {
                context.commit("SetIsLoading", false)
                Swal.fire({
                    icon: "error",
                    title: error.message
                })
                // console.log(error)
            }
        },
        async checkUsernameOneid(context, { username, status, type }) {
            context.commit("SetIsLoading", true)
            console.log("status", status);
            try {
                // let { data } = await axios.get(` http://localhost:3000/api/v1/account/username?username=${username}`)
                let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/account/username?username=${username}`)
                console.log(data)
                if (data.statusCode === 200) {
                    if (data.data.userOneId) {
                        if (type === 'student') {
                            context.commit("SetUserStudentData", [data.data])
                        } else {
                            context.commit("SetUserData", [data.data])
                        }
                    } else {
                        Swal.fire({
                            icon: "error",
                            title: "ไม่พบผู้ใช้"
                        }).then((result) => {
                            if (result.isConfirmed) {
                                if (type === 'student') {
                                    context.commit("SetUserStudentData", [])
                                } else {
                                    context.commit("SetUserData", [])
                                }
                            }
                        })
                    }
                    context.commit("SetIsLoading", false)
                }
            } catch (error) {
                context.commit("SetIsLoading", false)
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
                        username: context.state.user_one_id.username,
                        password: context.state.user_one_id.password,
                        first_name_en: data.data.first_name_en,
                        first_name_th: data.data.first_name_th,
                        last_name_en: data.data.last_name_en,
                        last_name_th: data.data.last_name_th,
                        role: data.data.roles,
                        roles: roles,
                        tel: data.data.tel,
                        image: data.data.image !== "" ? `${process.env.VUE_APP_URL}/api/v1/files/${data.data.image}` : ""
                    }
                    VueCookie.set("token", data.data.token, 1)
                    localStorage.setItem("userDetail", JSON.stringify(payload))
                    let order = JSON.parse(localStorage.getItem("Order"))
                    context.commit("SetIsLoading", false)

                    if (order?.category_id && order?.course_id) {
                        if (order.course_type_id === "CT_1") {
                            router.replace({ name: "userCoursePackage_courseId", params: { course_id: order.course_id } })
                        } else {
                            router.replace({ name: "userCourseDetail_courseId", params: { course_id: order.course_id } })
                        }
                    } else {
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

        async loginShareToken(context, { token, page }) {
            console.log("token", token);
            console.log("page", page);
            context.commit("SetIsLoading", true)
            try {
                // const { data } = await axios.post(`http://localhost:3001/api/v1/auth/login/sharedToken`, {
                const { data } = await axios.post(`${process.env.VUE_APP_URL}/api/v1/auth/login/sharedToken`, {
                    "shared_token": token,
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
                        username: context.state.user_one_id.username,
                        password: context.state.user_one_id.password,
                        first_name_en: data.data.first_name_en,
                        first_name_th: data.data.first_name_th,
                        last_name_en: data.data.last_name_en,
                        last_name_th: data.data.last_name_th,
                        role: data.data.roles,
                        roles: roles,
                        tel: data.data.tel,
                        image: data.data.image !== "" ? `${process.env.VUE_APP_URL}/api/v1/files/${data.data.image}` : ""
                    }
                    VueCookie.set("token", data.data.token, 1)
                    localStorage.setItem("userDetail", JSON.stringify(payload))
                    if (page === "menage-course") {
                        router.replace({ name: "menageCourse" })
                    }
                }
            } catch (response) {
                context.commit("SetIsLoading", false)
                Swal.fire({
                    icon: 'error',
                    title: "เกิดข้อผิดพลาด",
                })
                router.replace({ name: "UserKingdom" })
            }

        },



        logOut(context) {
            Swal.fire({
                icon: "question",
                title: "ต้องการออกจากระบบใช่หรือไม่ ?",
                showDenyButton: false,
                showCancelButton: true,
                cancelButtonText: "ยกเลิก",
                confirmButtonText: "ตกลง",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    VueCookie.delete("token")
                    context.commit("ResetUserOneId")
                    context.commit("ResetUserData")
                    localStorage.removeItem("userDetail")
                    localStorage.removeItem("Order")
                    localStorage.removeItem("relations")
                    router.push({ name: "Login" });
                }
            })



        }
    },
    getters: {
        getUsernameList(state){
            return state.username_list
        },
        getUserOneId(state) {
            return state.user_one_id
        },
        getUserData(state) {
            return state.user_data
        },
        getUserStudentData(state) {
            return state.user_student_data
        },
        getIsLoading(state) {
            return state.is_loading
        }
    },
};

export default loginModules;

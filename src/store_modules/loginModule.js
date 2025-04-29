import router from "@/router";
import axios from "axios"
import Swal from "sweetalert2"
import VueCookie from "vue-cookie"
import VueI18n from "../i18n";
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
        username_list: [],
        profile_fail: false,
        send_concent: {},
        get_concent: {},
        cancel_concent: {}

    },
    mutations: {
        SetProfileFail(state, payload) {
            state.profile_fail = payload
        },
        SetUsernameList(state, payload) {
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
        },
        SetSendConcent(state, payload) {
            state.send_concent = payload
        },
        SetGetConcent(state, payload) {
            state.get_concent = payload
        },
        SetCancelConcent(state, payload) {
            state.cancel_concent = payload
        },

    },
    actions: {
        async searchNameUser(context, { search_name }) {
            context.commit("SetUsernameList", [])
            try {
                let config = {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Content-type": "Application/json",
                        'Authorization': `Bearer ${VueCookie.get("token")}`
                    }
                }
                let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/account/student?firstNameTh=${search_name}`, config)
                if (data.statusCode == 200) {
                    for (const user of data.data) {
                        user.fullname = `${user.firstNameTh} ${user.lastNameTh}(${user.firstNameEng} ${user.lastNameEng})|${user.userName}`
                    }
                    context.commit("SetUsernameList", data.data)
                }
            } catch (error) {
                console.log(error)
            }
        },
        async checkUsernameOneidByOrder(context, { username, type, course_id }) {
            context.commit("SetIsLoading", true)
            try {
                context.commit("SetUserStudentData", [])
                context.commit("SetUserData", [])
                let config = {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Content-type": "Application/json",
                        'Authorization': `Bearer ${VueCookie.get("token")}`
                    }
                }
                let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/account/search/username/one?username=${username}`, config)
                if (data.statusCode === 200) {
                    if (data.data?.userOneId) {
                        if (type === 'student') {
                            let roles = ["R_1", "R_2", "R_3"]
                            if (!data.data.roles || !roles.includes(data.data.roles?.roleId)) {
                                let student = await axios.get(`${process.env.VUE_APP_URL}/api/v1/account/username-potencial/${data.data.userOneId}`)
                                if (student.data.statusCode === 200) {
                                    if (student.data.message === "study") {
                                        if (student.data.data.data.some(v => v.courseId === course_id && !["cancel", "fail"].includes(v.paymentStatus))) {
                                            Swal.fire({
                                                icon: "warning",
                                                title: VueI18n.t("warning"),
                                                text: VueI18n.t("duplicate user in this course Unable to register"),
                                                timer: 3000,
                                                timerProgressBar: true,
                                                showCancelButton: false,
                                                showConfirmButton: false,
                                            })
                                            if (type === 'student') {
                                                context.commit("SetUserStudentData", [])
                                            } else {
                                                context.commit("SetUserData", [])
                                            }
                                        } else {
                                            context.commit("SetUserStudentData", [data.data])
                                        }
                                    } else {
                                        context.commit("SetUserStudentData", [data.data])
                                    }
                                }
                            } else {
                                Swal.fire({
                                    icon: "error",
                                    title: VueI18n.t("can't apply"),
                                    text: VueI18n.t("this is because the applicant already has other positions"),
                                    showDenyButton: false,
                                    showCancelButton: true,
                                    confirmButtonText: VueI18n.t("agree"),
                                    cancelButtonText: VueI18n.t("cancel"),
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
                        } else {
                            context.commit("SetUserData", [data.data])
                        }
                    } else {
                        Swal.fire({
                            icon: "error",
                            title: VueI18n.t("something went wrong"),
                            text: VueI18n.t("this user could not be found"),
                            timer: 3000,
                            timerProgressBar: true,
                            showCancelButton: false,
                            showConfirmButton: false,
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
                if (error.response.data.message === "This username not found.") {
                    Swal.fire({
                        icon: "error",
                        title: VueI18n.t("something went wrong"),
                        text: VueI18n.t("this user could not be found"),
                        timer: 3000,
                        timerProgressBar: true,
                        showCancelButton: false,
                        showConfirmButton: false,
                    })
                } else {
                    Swal.fire({
                        icon: "error",
                        title: error.message,
                        timer: 3000,
                        timerProgressBar: true,
                        showCancelButton: false,
                        showConfirmButton: false,
                    })
                }
            }
        },
        // async checkUsernameOneid(context, { username, status, type }) {
        async checkUsernameOneid(context, { username, type }) {
            context.commit("SetIsLoading", true)
            // console.log("status", status);
            context.commit("SetUserStudentData", [])
            context.commit("SetUserData", [])
            let config = {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-type": "Application/json",
                    'Authorization': `Bearer ${VueCookie.get("token")}`
                }
            }
            try {
                let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/account/search/username?username=${username}`, config)
                if (data.statusCode === 200) {
                    if (data.data?.userOneId) {
                        data.data.school = data.data?.school ? data.data.school : {
                            schoolNameTh: null,
                            schoolNameEn: null,
                        }
                        data.data.class = data.data?.class ? data.data.class : {
                            classNameTh: null,
                            classNameEn: null,
                        }
                        if (type === 'student') {
                            context.commit("SetUserStudentData", [data.data])
                        } else {
                            context.commit("SetUserData", [data.data])
                        }
                    }
                    context.commit("SetIsLoading", false)
                }
            } catch (error) {
                context.commit("SetIsLoading", false)
                if (error.response.data.message === "This username not found.") {
                    Swal.fire({
                        icon: "error",
                        title: VueI18n.t("something went wrong"),
                        text: VueI18n.t("this user could not be found"),
                        timer: 3000,
                        timerProgressBar: true,
                        showCancelButton: false,
                        showConfirmButton: false,
                    }).then((result) => {
                        if (result.isConfirmed) {
                            if (type === 'student') {
                                context.commit("SetUserStudentData", [])
                            } else {
                                context.commit("SetUserData", [])
                            }
                        }
                    })
                } else {
                    Swal.fire({
                        icon: "error",
                        title: error.message,
                        timer: 3000,
                        timerProgressBar: true,
                        showCancelButton: false,
                        showConfirmButton: false,
                    })
                }
            }
        },
        changeProfileFail(context, value) {
            context.commit("SetProfileFail", value)
        },
        async loginOneId(context) {
            context.commit("SetIsLoading", true)
            try {
                const { data } = await axios.post(`${process.env.VUE_APP_URL}/api/v1/auth/login`, {
                    "username": context.state.user_one_id.username,
                    "password": context.state.user_one_id.password,
                })
                if (data.statusCode === 200) {
                    let roles = []
                    let roleNumber = ''
                    if (data.data.roles.length > 0) {
                        data.data.roles.forEach((role) => {
                            roles.push(role.roleId)
                            roleNumber = role.roleId

                        });
                    }
                    let payload = {
                        account_id: data.data.account_id,
                        email: data.data.email,
                        username: context.state.user_one_id.username,
                        first_name_en: data.data.first_name_en,
                        first_name_th: data.data.first_name_th,
                        last_name_en: data.data.last_name_en,
                        last_name_th: data.data.last_name_th,
                        role: data.data.roles,
                        roles: roles,
                        tel: data.data.tel,
                        image: data.data.image !== "" ? `${process.env.VUE_APP_URL}/api/v1/files/${data.data.image}` : "",
                        isSatisfaction: data.data.isSatisfaction,
                        isEvaluate: data.data.isEvaluate,
                        school: data.data.school,
                        nicknameTh: data.data.nicknameTh,
                        nicknameEn: data.data.nicknameEn,
                        class: data.data?.class,
                        congenitalDisease: data.data.congenitalDisease,
                        role_id: roleNumber
                    }
                    VueCookie.set("token", data.data.token, 1)
                    localStorage.setItem("userDetail", JSON.stringify(payload))
                    let order = JSON.parse(localStorage.getItem("Order"))
                    context.commit("SetIsLoading", false)
                    if (!payload.first_name_th || !payload.last_name_th) {
                        await context.dispatch("GetConcent")
                        router.replace({ name: "ProfileDetail", params: { profile_id: payload.account_id } })
                        context.commit("SetProfileFail", true)

                    } else {
                        if (order?.category_id && order?.course_id) {
                            await context.dispatch("GetConcent")
                            if (order.course_type_id === "CT_1") {
                                router.replace({ name: "userCoursePackage_courseId", params: { course_id: order.course_id } })
                            } else {
                                router.replace({ name: "userCourseDetail_courseId", params: { course_id: order.course_id } })
                            }
                        } else {
                            await context.dispatch("GetConcent")
                            await router.replace({ name: "UserKingdom" })
                        }
                    }
                    context.commit("SetIsLoading", false)

                }
            } catch (response) {
                context.commit("SetIsLoading", false)
                if (response.message === "Request failed with status code 401") {
                    Swal.fire({
                        icon: 'error',
                        title: VueI18n.t("something went wrong"),
                        text: VueI18n.t("the username or password is incorrect"),
                        timer: 3000,
                        timerProgressBar: true,
                        showCancelButton: false,
                        showConfirmButton: false,
                    })
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: VueI18n.t("something went wrong"),
                        timer: 3000,
                        timerProgressBar: true,
                        showCancelButton: false,
                        showConfirmButton: false,
                    })
                }
            }

        },
        async loginShareToken(context, route) {
            context.commit("SetIsLoading", true)
            try {
                const { data } = await axios.post(`${process.env.VUE_APP_URL}/api/v1/auth/login/sharedToken`, {
                    "shared_token": route.query.token,
                })
                if (data.statusCode === 200) {
                    let roles = []
                    if (data.data.roles.length > 0) {
                        data.data.roles.forEach((role) => {
                            roles.push(role.roleId)
                        });
                    }
                    VueCookie.set("token", data.data.token)

                    let payload = {
                        account_id: data.data.account_id,
                        email: data.data.email,
                        username: data.data.username,
                        first_name_en: data.data.first_name_en,
                        first_name_th: data.data.first_name_th,
                        last_name_en: data.data.last_name_en,
                        last_name_th: data.data.last_name_th,
                        role: data.data.roles,
                        roles: roles,
                        tel: data.data.tel,
                        image: data.data.image !== "" ? `${process.env.VUE_APP_URL}/api/v1/files/${data.data.image}` : "",
                        isSatisfaction: data.data.isSatisfaction,
                        isEvaluate: data.data.isEvaluate,
                        school: data.data.school,
                        nicknameTh: data.data.nicknameTh,
                        nicknameEn: data.data.nicknameEn,
                        class: data.data.class,
                        congenitalDisease: data.data.congenitalDisease,
                    }
                    localStorage.setItem("userDetail", JSON.stringify(payload))
                    if (route.name === "Login") {
                        router.replace({ name: "UserKingdom" })
                    } else {
                        if (roles.length > 0) {
                            if (route.name == "StudentsSchedule") {
                                if (roles.some(v => ['R_4', 'R_5'].includes(v))) {
                                    window.location.href = `${process.env.VUE_APP_URL}${route.path}`
                                } else {
                                    router.replace({ name: "UserKingdom" })
                                }
                            } else if (route.name == "menageCourse") {
                                if (roles.some(v => ['R_3'].includes(v))) {
                                    window.location.href = `${process.env.VUE_APP_URL}${route.path}`
                                } else {
                                    router.replace({ name: "UserKingdom" })
                                }
                            } else {
                                window.location.href = `${process.env.VUE_APP_URL}${route.path}`
                            }

                        }
                    }
                }
            } catch (response) {
                context.commit("SetIsLoading", false)
                Swal.fire({
                    icon: 'error',
                    title: VueI18n.t("something went wrong"),
                    timer: 3000,
                    timerProgressBar: true,
                    showCancelButton: false,
                    showConfirmButton: false,

                })
                router.replace({ name: "UserKingdom" })
            }

        },
        logOut(context) {
            Swal.fire({
                icon: "question",
                title: VueI18n.t("do you want to log out?"),
                showDenyButton: false,
                showCancelButton: true,
                confirmButtonText: VueI18n.t("agree"),
                cancelButtonText: VueI18n.t("no"),
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



        },
        async SendConcent(context, { payload }) {
            try {
                let config = {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Content-type": "Application/json",
                        Authorization: `Bearer ${VueCookie.get("token")}`,
                    },
                };
                // let localhost = "http://localhost:3000"
                // const { data } = await axios.patch(`${localhost}/api/v1/consent/createConsenByUser`, payload, config)
                const { data } = await axios.patch(`${process.env.VUE_APP_URL}/api/v1/consent/createConsenByUser`, payload, config)
                // context.commit("SetSendConcent", data.consent)
                context.commit("SetSendConcent", data.data.consent)

            } catch (error) {

                Swal.fire({
                    icon: 'error',
                    title: VueI18n.t("something went wrong"),
                    text: error.response.data.message,
                    timer: 3000,
                    timerProgressBar: true,
                    showCancelButton: false,
                    showConfirmButton: false,
                })

            }

        },
        async GetConcent(context) {
            try {
                let config = {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Content-type": "Application/json",
                        Authorization: `Bearer ${VueCookie.get("token")}`,
                    },
                };
                // let localhost = "http://localhost:3000"
                // const { data } = await axios.get(`${localhost}/api/v1/consent/getConsenUser`, config)
                const { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/consent/getConsenUser`, config)
                // context.commit("SetGetConcent", data.consent)
                context.commit("SetGetConcent", data.data.consent)
            } catch (error) {
                console.log('error :>> ', error);
                Swal.fire({
                    icon: 'error',
                    title: VueI18n.t("something went wrong"),
                    text: error.response.data.message,
                    timer: 3000,
                    timerProgressBar: true,
                    showCancelButton: false,
                    showConfirmButton: false,
                })

            }
            context.commit("SetIsLoading", false)
        },
        cancelConcent(context) {
            VueCookie.delete("token")
            context.commit("ResetUserOneId")
            context.commit("ResetUserData")
            localStorage.removeItem("userDetail")
            localStorage.removeItem("Order")
            localStorage.removeItem("relations")
            router.push({ name: "Login" });
        }

    },
    getters: {
        getProfileFail(state) {
            return state.profile_fail
        },
        getUsernameList(state) {
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
        },
        getConcent(state) {
            return state.get_concent
        }
    },
};

export default loginModules;

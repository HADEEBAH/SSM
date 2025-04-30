import axios from "axios"
import Swal from "sweetalert2"
import VueCookie from "vue-cookie"
import router from "@/router";
import VueI18n from "../i18n";


const RegisterModules = {
    namespaced: true,
    state: {
        show_dialog_register_one_id: false,
        user_one_id: {
            firstname_th: "",
            lastname_th: "",
            firstname_en: "",
            lastname_en: "",
            phone_number: "",
            username: "",
            password: "",
            confirm_password: "",
            accept_terms: false,
        },
        last_user_registered: {
            firstname_th: "",
            lastname_th: "",
            firstname_en: "",
            lastname_en: "",
            phone_number: "",
            username: "",
            type: "",
            account_id: "",
        },
        is_loading: false,
        register_by_one: false,
        get_concent_reg: {}

    },
    mutations: {
        ShowDialogRegisterOneId(state, value) {
            state.show_dialog_register_one_id = value
            state.user_one_id = {
                firstname_th: "",
                lastname_th: "",
                firstname_en: "",
                lastname_en: "",
                phone_number: "",
                username: "",
                password: "",
                confirm_password: "",
                accept_terms: false,
            }
        },
        SetIsLoading(state, value) {
            state.is_loading = value
        },
        UserOneId(state, payload) {
            state.user_one_id = payload
        },
        SetLastUserRegistered(state, payload) {
            state.last_user_registered = payload
        },
        ResetUserOneID(state) {
            state.user_one_id = {
                firstname_th: "",
                lastname_th: "",
                firstname_en: "",
                lastname_en: "",
                phone_number: "",
                username: "",
                password: "",
                confirm_password: "",
                accept_terms: false,
            }
        },
        ResetLastUserRegistered(state) {
            state.last_user_registered = {
                firstname_th: "",
                lastname_th: "",
                firstname_en: "",
                lastname_en: "",
                phone_number: "",
                username: "",
                type: "",
                account_id: "",
            }
        },

        SetRegisterByOne(state, value) {
            state.register_by_one = value
        },
        SetGetConcent(state, payload) {
            state.get_concent_reg = payload
        },
    },
    actions: {
        async RemoveRelation(context, { studentId, parentId }) {
            try {
                let config = {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Content-type": "Application/json",
                        Authorization: `Bearer ${VueCookie.get("token")}`,
                    },
                };
                let { data } = await axios.delete(`${process.env.VUE_APP_URL}/api/v1/relations/delete-user-role/?studentId=${studentId}&parentId=${parentId}`, config)
                if (data.statusCode === 200) {
                    Swal.fire({
                        icon: "success",
                        title: VueI18n.t("succeed"),
                        text: VueI18n.t("data has been successfully deleted"),
                        showDenyButton: false,
                        showCancelButton: false,
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true
                    })
                }
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: VueI18n.t("failed to delete"),
                    showDenyButton: false,
                    showCancelButton: false,
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                })
            }
        },
        async AddRelations(context, { studentId, parentId }) {
            try {
                let config = {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Content-type": "Application/json",
                        Authorization: `Bearer ${VueCookie.get("token")}`,
                    },
                };
                let { data } = await axios.post(`${process.env.VUE_APP_URL}/api/v1/relations/user`, { studentId: studentId, parentId: parentId }, config)
                if (data.statusCode === 201) {
                    await axios.post(`${process.env.VUE_APP_URL}/api/v1/account/user`, { userId: parentId, roleId: 'R_4' }, config)
                }
            } catch (error) {
                console.log(error)
            }
        },
        ResetLastUserRegistered(context) {
            context.commit("ResetLastUserRegistered")
        },
        async registerParent(context, { type }) {
            context.commit("SetIsLoading", true)
            try {
                let phone_number = context.state.user_one_id.phone_number.replaceAll("-", "")
                // let localhost = "http://localhost:3000"
                // let { data } = await axios.post(`${localhost}/api/v1/register`, {
                let { data } = await axios.post(`${process.env.VUE_APP_URL}/api/v1/register`, {
                    "accountTitleTh": "",
                    "firstNameTh": context.state.user_one_id.firstname_th,
                    "lastNameTh": context.state.user_one_id.lastname_th,
                    "accountTitleEng": null,
                    "firstNameEng": context.state.user_one_id.firstname_en,
                    "lastNameEng": context.state.user_one_id.lastname_en,
                    "idCardType": "",
                    "idCardNum": "",
                    "email": "",
                    "mobileNo": phone_number,
                    "userName": context.state.user_one_id.username,
                    "passWord": context.state.user_one_id.password,
                    "consent": false,
                })
                if (data.statusCode === 201) {
                    context.commit("SetIsLoading", false)
                    Swal.fire({
                        icon: "success",
                        title: VueI18n.t("succeed"),
                        text: VueI18n.t("already registered"),
                        timer: 3000,
                        timerProgressBar: true,
                        showCancelButton: false,
                        showConfirmButton: false,
                    }).finally(async () => {
                        let user = await axios.get(`${process.env.VUE_APP_URL}/api/v1/account?username=${context.state.user_one_id.username}&status=active`)

                        if (user.data.statusCode === 200) {
                            context.commit("SetLastUserRegistered", {
                                firstname_th: context.state.user_one_id.firstname_th,
                                lastname_th: context.state.user_one_id.lastname_th,
                                firstname_en: context.state.user_one_id.firstname_en,
                                lastname_en: context.state.user_one_id.lastname_en,
                                phone_number: phone_number,
                                email: user.data.data[0].email,
                                username: context.state.user_one_id.username,
                                account_id: user.data.data[0].userOneId,
                                type: type
                            })
                            context.commit("ResetUserOneID")
                            context.commit("ShowDialogRegisterOneId", false)
                        }

                    })
                }
            } catch ({ response }) {
                context.commit("SetIsLoading", false)
                let text = ""
                if (response?.data.statusCode === 400) {
                    //     case "The mobile no must be at least 10 characters.":
                    //         text = VueI18n.t("mobile number must have at least 10 characters")
                    //         break;
                    //     case "username duplicate in wsl":
                    //         text = VueI18n.t("username already exists in warraphat")
                    //         break;
                    //     case "username duplicate in oneID":
                    //         text = VueI18n.t("username already exists")
                    //         break;
                    //     case "The password format is invalid.":
                    //         text = VueI18n.t("the password format is incorrect")
                    //         break;
                    //     case "The first name eng format is invalid.":
                    //         text = VueI18n.t("the English name format is invalid")
                    //         break;
                    //     case "The last name th format is invalid.":
                    //         text = VueI18n.t("invalid last name thai format")
                    //         break;
                    //     case "The last name en format is invalid.":
                    //         text = VueI18n.t("invalid last name eng format")
                    //         break;
                    // }

                    if (response.data.message?.mobile_no?.includes("The mobile no field is required.")) {
                        text = VueI18n.t("please enter your phone number")

                    } else if (response.data.message?.username?.includes("The username field is required.")) {
                        text = VueI18n.t("please enter your username")

                    } else if (response.data.message?.password?.includes("The password field is required.")) {
                        text = VueI18n.t("enter password")

                    } else if (response.data.message?.ref_code?.includes("The ref code field is required.")) {
                        text = VueI18n.t("please enter a ref code")

                    } else if (response.data.message?.clientId?.includes("The client id field is required.")) {
                        text = VueI18n.t("please enter your username")

                    } else if (response.data.message?.secretKey?.includes("The secret key field is required.")) {
                        text = VueI18n.t("please enter a secret key")

                    } else if (response.data.message?.email?.includes("email duplicate")) {
                        text = VueI18n.t("email is duplicate")

                    } else if (response.data.message?.username?.includes("username duplicate")) {
                        text = VueI18n.t("username already exists")

                    } else if (response.data.message === 'The mobile no must be at least 10 characters.') {
                        text = VueI18n.t("mobile number must have at least 10 characters")

                    } else if (response.data.message === "username duplicate in wsl") {
                        text = VueI18n.t("username already exists in warraphat")

                    } else if (response.data.message === 'username duplicate in oneID') {
                        text = VueI18n.t("username already exists")

                    } else if (response.data.message === 'The password format is invalid.') {
                        text = VueI18n.t("the password format is incorrect")

                    } else if (response.data.message === 'The last name th format is invalid.') {
                        text = VueI18n.t("invalid last name thai format")

                    } else if (response.data.message === 'The first name eng format is invalid.') {
                        text = VueI18n.t("the English name format is invalid")
                    } else if (response.data.message === 'The last name en format is invalid.') {
                        text = VueI18n.t("invalid last name eng format")
                    } else {
                        text = VueI18n.t("fail")

                    }
                    setTimeout(() => {
                        Swal.fire({
                            icon: 'warning',
                            title: `${VueI18n.t("please fill out the information correctly")}`,
                            text: text ? text : response.data.message,
                            showDenyButton: false,
                            showCancelButton: false,
                            showConfirmButton: false,
                            timer: 3000,
                            timerProgressBar: true,
                        })
                    }, 200)

                } else {
                    Swal.fire({
                        icon: 'error',
                        title: VueI18n.t("something went wrong"),
                        showDenyButton: false,
                        showCancelButton: false,
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                    })
                }
            }
        },
        async registerUserOneId(context) {
            context.commit("SetIsLoading", true)
            try {
                let phone_number = context.state.user_one_id.phone_number.replaceAll("-", "")
                // let localhost = "http://localhost:3000"
                // let { data } = await axios.post(`${localhost}/api/v1/register`
                let { data } = await axios.post(`${process.env.VUE_APP_URL}/api/v1/register`
                    , {
                        "accountTitleTh": null,
                        "firstNameTh": context.state.user_one_id.firstname_th,
                        "lastNameTh": context.state.user_one_id.lastname_th,
                        "accountTitleEng": null,
                        "firstNameEng": context.state.user_one_id.firstname_en,
                        "lastNameEng": context.state.user_one_id.lastname_en,
                        "idCardType": "",
                        "idCardNum": "",
                        "email": "",
                        "mobileNo": phone_number,
                        "userName": context.state.user_one_id.username,
                        "passWord": context.state.user_one_id.password,
                        "consent": false,
                    })
                if (data.statusCode === 201) {
                    Swal.fire({
                        icon: "success",
                        title: VueI18n.t("succeed"),
                        text: VueI18n.t("already registered"),
                        timer: 3000,
                        timerProgressBar: true,
                        showCancelButton: false,
                        showConfirmButton: false,
                    }).finally(async () => {
                        try {
                            axios.post(`${process.env.VUE_APP_URL}/api/v1/auth/login`, {
                                "username": context.state.user_one_id.username,
                                "password": context.state.user_one_id.password,
                            }).then(async (res) => {
                                if (res.data.statusCode === 200) {
                                    let roleNumber = ''
                                    let roles_data = []
                                    res.data.data.roles.forEach((role) => {
                                        roles_data.push(role?.role_name_en)
                                        roleNumber = role.roleId
                                    });
                                    let payload = {
                                        account_id: res.data.data.account_id,
                                        email: res.data.data.email,
                                        username: context.state.user_one_id.username,
                                        password: context.state.user_one_id.password,
                                        first_name_en: res.data.data.first_name_en,
                                        first_name_th: res.data.data.first_name_th,
                                        last_name_en: res.data.data.last_name_en,
                                        last_name_th: res.data.data.last_name_th,
                                        role: res.data.data.role,
                                        roles: roles_data,
                                        tel: res.data.data.tel,
                                        role_id: roleNumber

                                    }
                                    VueCookie.set("token", res.data.data.token, 1)
                                    localStorage.setItem("userDetail", JSON.stringify(payload))
                                    context.commit("SetIsLoading", false)
                                    // context.commit("ResetUserOneID")
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
                                        await context.commit("SetGetConcent", data.data.consent)
                                        await router.replace({ name: "UserKingdom" });
                                        context.commit("SetIsLoading", false)
                                        context.commit("ResetUserOneID")

                                    } catch (error) {
                                        if (error.response.data.message === 'Unauthorized') {
                                            Swal.fire({
                                                icon: 'error',
                                                title: VueI18n.t("something went wrong"),
                                                text: error.response.data.message,
                                                timer: 3000,
                                                timerProgressBar: true,
                                                showCancelButton: false,
                                                showConfirmButton: false,
                                            })
                                        } else {
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


                                    }
                                }
                            })
                        } catch (error) {
                            console.log('er :>> ', error);
                        }




                    })
                }
            } catch ({ response }) {
                context.commit("SetIsLoading", false)
                let text = ""
                if (response?.data.statusCode === 400) {
                    // switch (response.data.message) {
                    //     case "The mobile no must be at least 10 characters.":
                    //         text = VueI18n.t("mobile number must have at least 10 characters")
                    //         break;
                    //     case "username duplicate in wsl":
                    //         text = VueI18n.t("username already exists in warraphat")
                    //         break;
                    //     case "username duplicate in oneID":
                    //         text = VueI18n.t("username already exists")
                    //         break;
                    //     case "The password format is invalid.":
                    //         text = VueI18n.t("the password format is incorrect")
                    //         break;
                    //     case "The first name eng format is invalid.":
                    //         text = VueI18n.t("the English name format is invalid")
                    //         break;
                    //     case "The last name th format is invalid.":
                    //         text = VueI18n.t("invalid last name thai format")
                    //         break;
                    //     case "The last name en format is invalid.":
                    //         text = VueI18n.t("invalid last name eng format")

                    //         break;
                    // }
                    if (response.data.message?.mobile_no?.includes("The mobile no field is required.")) {
                        text = VueI18n.t("please enter your phone number")

                    } else if (response.data.message?.username?.includes("The username field is required.")) {
                        text = VueI18n.t("please enter your username")

                    } else if (response.data.message?.password?.includes("The password field is required.")) {
                        text = VueI18n.t("enter password")

                    } else if (response.data.message?.ref_code?.includes("The ref code field is required.")) {
                        text = VueI18n.t("please enter a ref code")

                    } else if (response.data.message?.clientId?.includes("The client id field is required.")) {
                        text = VueI18n.t("please enter your username")

                    } else if (response.data.message?.secretKey?.includes("The secret key field is required.")) {
                        text = VueI18n.t("please enter a secret key")

                    } else if (response.data.message?.email?.includes("email duplicate")) {
                        text = VueI18n.t("email is duplicate")

                    } else if (response.data.message?.username?.includes("username duplicate")) {
                        text = VueI18n.t("username already exists")

                    } else if (response.data.message === 'The mobile no must be at least 10 characters.') {
                        text = VueI18n.t("mobile number must have at least 10 characters")

                    } else if (response.data.message === "username duplicate in wsl") {
                        text = VueI18n.t("username already exists in warraphat")

                    } else if (response.data.message === 'username duplicate in oneID') {
                        text = VueI18n.t("username already exists")

                    } else if (response.data.message === 'The password format is invalid.') {
                        text = VueI18n.t("the password format is incorrect")

                    } else if (response.data.message === 'The last name th format is invalid.') {
                        text = VueI18n.t("invalid last name thai format")

                    } else if (response.data.message === 'The first name eng format is invalid.') {
                        text = VueI18n.t("the English name format is invalid")
                    } else if (response.data.message === 'The last name en format is invalid.') {
                        text = VueI18n.t("invalid last name eng format")
                    } else {
                        text = VueI18n.t("fail")

                    }
                    setTimeout(() => {
                        Swal.fire({
                            icon: 'error',
                            title: `${VueI18n.t("please fill out the information correctly")}`,
                            text: text ? text : response.data.message,
                            showDenyButton: false,
                            showCancelButton: false,
                            showConfirmButton: false,
                            timer: 3000,
                            timerProgressBar: true,
                        })
                    }, 200)

                } else {
                    Swal.fire({
                        icon: 'error',
                        title: VueI18n.t("something went wrong"),
                        showDenyButton: false,
                        showCancelButton: false,
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,

                    })
                }
            }
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
                    VueCookie.set("token", data.data.token)
                    localStorage.setItem("userDetail", JSON.stringify(payload))
                    context.commit("SetIsLoading", false)
                    router.replace({ name: "UserKingdom" })
                }
            } catch (response) {
                context.commit("SetIsLoading", false)
                if (response.message === "Request failed with status code 401") {
                    Swal.fire({
                        icon: 'error',
                        title: VueI18n.t("the username or password is incorrect"),
                        showDenyButton: false,
                        showCancelButton: false,
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                    })
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: VueI18n.t("something went wrong"),
                        showDenyButton: false,
                        showCancelButton: false,
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                    })
                }
            }

        },
        async changeDialogRegisterOneId(context, value) {
            if (value) {
                await context.commit("ShowDialogRegisterOneId", value)
            } else {
                await context.commit("ShowDialogRegisterOneId", value)
                // localStorage.context.commit("UserOneId", {
                //     firstname_th: "",
                //     lastname_th: "",
                //     firstname_en: "",
                //     lastname_en: "",
                //     phone_number: "",
                //     username: "",
                //     password: "",
                //     confirm_password: "",
                //     accept_terms: false,
                // }
                await context.commit("UserOneId", {
                    firstname_th: "",
                    lastname_th: "",
                    firstname_en: "",
                    lastname_en: "",
                    phone_number: "",
                    username: "",
                    password: "",
                    confirm_password: "",
                    accept_terms: false,
                }
                )
            }

        },
        changeUserOneId(context, data) {
            context.state.user_one_id = data
        },
        async SetRegisterOneId(context, payload) {

            try {
                let { data } = await axios.post(`${process.env.VUE_APP_URL}/api/v1/register-by-oneid`, payload)
                if (data.statusCode === 201) {
                    context.commit("SetRegisterByOne", true)
                }
            } catch (error) {
                console.log(error);
            }
        }
    },
    getters: {
        getIsLoading(state) {
            return state.is_loading
        },
        getShowDialogRegisterOneId(state) {
            return state.show_dialog_register_one_id
        },
        getUserOneId(state) {
            return state.user_one_id
        },
        getLastUserRegistered(state) {
            return state.last_user_registered
        },
        setRegisterOneId(state) {
            return state.register_by_one
        },
        getConcentReg(state) {
            return state.get_concent_reg
        }

    }
}

export default RegisterModules
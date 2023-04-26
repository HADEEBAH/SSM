import axios from "axios";
import VueCookie from "vue-cookie"

const userModules = {
    namespaced: true,
    state: {
        user_list: [
            {
                accountId: "",
                email: "",
                firstNameTh: "",
                lastNameTh: "",
                firstNameEn: "",
                lastNameEN: "",
                userName: "",
                tel: ""
            }
        ],

        show_by_id: [
            {
                roleNameEng: "",
                roleNameTh: "",
                roleId: "",
                studentDetail: [
                    {
                        u_created_by: null,
                        u_created_date: "",
                        u_updated_by: null,
                        u_updated_date: "",
                        u_deleted_by: null,
                        u_deleted_date: null,
                        u_account_id: "",
                        u_title_name_th: "",
                        u_first_name_th: "",
                        u_last_name_th: "",
                        u_title_name_en: "",
                        u_first_name_en: "",
                        u_last_name_en: "",
                        u_email: "",
                        u_tel: "",
                        u_status: "",
                        u_username: "",
                        u_password: "",
                        studentId: "",
                        parentId: ""
                    }

                ]
            }
        ],
        data_user_by_id: []
    },
    mutations: {
        SetUserList(state, payload) {
            state.user_list = payload
        },
        SetShowById(state, payload) {
            state.show_by_id = payload
        },
        setUserById(state, payload) {
            state.data_user_by_id = payload
        }
    },
    actions: {
        async GetUserList(context) {
            try {
                let config = {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Content-type": "Application/json",
                        'Authorization': `Bearer ${VueCookie.get("token")}`
                    }
                }
                // config
                let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/usermanagement`, config)
                if (data.statusCode === 200) {
                    context.commit("SetUserList", data.data)
                } else {
                    throw { error: data }
                }
            } catch (error) {
                console.log("error", error);
            }
        },

        async GetShowById(context, account_id) {
            console.log("account", account_id);
            try {
                let config = {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Content-type": "Application/json",
                        'Authorization': `Bearer ${VueCookie.get("token")}`
                    }
                }
                let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/usermanagement/${account_id}`, config)
                if (data.statusCode === 200) {
                    context.commit("SetShowById", data.data)
                    console.log("SetShowById", data.data)
                } else {
                    throw { error: data }
                }
            } catch (error) {
                console.log("err", error);
            }
        },

        async GetUserById(context, account_id) {
            console.log("account", account_id);
            try {
                let config = {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Content-type": "Application/json",
                        'Authorization': `Bearer ${VueCookie.get("token")}`
                    }
                }
                let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/account/${account_id}`, config)
                if (data.statusCode === 200) {
                    console.log("setUserById=>>>>>>>>>", data.data);
                    context.commit("setUserById", data.data)
                } else {
                    throw { error: data }
                }
            } catch (error) {
                console.log("err", error);
            }
        }

    },
    getters: {
        getUserList(state) {
            return state.user_list
        },
        getShowById(state) {
            return state.show_by_id
        },
        getUserById(state) {
            return state.data_user_by_id
        },
    },
};

export default userModules;

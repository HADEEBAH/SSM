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

        show_by_id: [],
        data_user_by_id: [],
        student_schedule: [],
    },
    mutations: {
        SetUserList(state, payload) {
            state.user_list = payload
        },
        SetShowById(state, payload) {
            state.show_by_id = payload
        },
        SetUserById(state, payload) {
            state.data_user_by_id = payload
        },
        SetStudentSchedule(state, payload) {
            state.student_schedule = payload
        },
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
                    data.data.image = data.data.image && data.data.image != "" ? `${process.env.VUE_APP_URL}/api/v1/files/${data.data.image}` : ""
                    context.commit("SetShowById", [])
                    context.commit("SetShowById", data.data)
                } else {
                    context.commit("SetShowById", [])

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
                    console.log("SetUserById=>>>>>>>>>", data.data);
                    context.commit("SetUserById", data.data)
                } else {
                    throw { error: data }
                }
            } catch (error) {
                console.log("err", error);
            }
        },

        async GetStudentSchedule(context, student_id) {
            // console.log("GetStudentSchedule", student_id);
            context.commit("SetStudentSchedule", [])
            try {
                let config = {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Content-type": "Application/json",
                        'Authorization': `Bearer ${VueCookie.get("token")}`
                    }
                }
                // let { data } = await axios.get(`http://localhost:3000/api/v1/usermanagement/student/${student_id}`, config)
                let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/usermanagement/student/${student_id}`, config)
                console.log("Schedule=>", data.data);
                if (data.statusCode === 200) {
                    context.commit("SetStudentSchedule", data.data)
                } else {
                    // context.commit("SetStudentSchedule", [])
                    throw { error: data }
                }
            } catch (error) {
                console.log("err", error);
            }
        },

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
        getStudentSchedule(state) {
            return state.student_schedule
        },
    },
};

export default userModules;

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

        filter_role: [],
        query_roles: "",
        filter_role_is_loading: false,
        user_filter: [],



        show_by_id: [],
        data_user_by_id: [],
        student_schedule: [],
        user_one_temp: {}
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
        SetfilterGetUserList(state, payload) {
            state.user_list = payload
        },
        SetUserOneTemp(state, payload) {
            state.user_one_temp = payload
        },
        SetShowByOne(state) {
            // console.log("payload", payload);
            state.show_by_id = state.user_one_temp
            // try {
            //     if (payload) {
            //         throw { error: payload }
            //     }
            //     state.show_by_id = state.user_one_temp
            // } catch (err) {
            //     console.log("err=>", err);
            // }

        },


    },
    actions: {
        async ChangeUserOneTemp(context, user_one_data) {
            context.commit("SetUserOneTemp", user_one_data)
        },

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
                    // console.log("data1111", data.data);
                    data.data.map((val, i) => {
                        val.index = i + 1
                        val.userRoles.map((value) => {
                            val.roleNameTh = value.roleNameTh
                            val.roleNameTh = value.roleNameTh
                            val.roleNameTh = value.roleNameTh
                            return value
                        })
                        return val
                    })
                    // console.log("data.data.userRoles", data.data.userRoles);
                    // data.data[key].userRoles.map((val) => {

                    //     data.data[key]["roleNameTh"] = val.roleNameTh
                    //     return val
                    // })

                    // console.log("SetUserList", data.data);
                    context.commit("SetUserList", data.data)
                } else {
                    throw { error: data }
                }
            } catch (error) {
                // console.log("error", error);
            }
        },

        async FilterGetUserList(context, role) {
            this.user_lists_is_loading = true;
            // console.log("objectROLE", role);
            let query_roles = "";
            role.map((val) => {
                query_roles += `roleId=${val}&`;
            });
            // console.log("options_temp", query_roles);
            try {
                let config = {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Content-type": "Application/json",
                        'Authorization': `Bearer ${VueCookie.get("token")}`
                    }
                }
                // let { data } = await axios.get(`http://localhost:3000/api/v1/getrole/filter?${query_roles}`, config)
                let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/getrole/filter?${query_roles}`, config)

                if (data.statusCode === 200) {
                    // console.log("ROLES", role);
                    // console.log("SetfilterGetUserList1", data.data)
                    // if (role.length > 0) {

                    // } else {

                    // }
                    data.data.map((val, i) => {
                        val.index = i + 1;
                        // console.log("val", val);
                        return val;
                    })
                    // console.log("SetfilterGetUserList2", data.data)
                    context.commit("SetfilterGetUserList", data.data)
                    // this.user_filter = data.data;
                    // context.commit("SetUserList", data.data)
                    // // console.log("SetUserList222", data.data)



                } else {
                    throw { error: data }
                }
            } catch (error) {
                // console.log("err", error);
            }
        },

        async GetShowById(context, account_id) {
            // console.log("account", account_id);
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
                    console.log("SetShowById", data.data)
                    console.log("if");
                } else {
                    // console.log("else");
                    // context.commit("SetShowByOne", data)
                    // context.commit("SetShowById", [])
                    // throw { error: data }
                }
            } catch (error) {
                context.commit("SetShowByOne")
                // console.log("err", error);
            }
        },

        async GetUserById(context, account_id) {
            // console.log("account", account_id);
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
                    // console.log("SetUserById=>>>>>>>>>", data.data);
                    data.data.imageUrl = data.data.image ? `${process.env.VUE_APP_URL}/api/v1/files/${data.data.image}` : null
                    context.commit("SetUserById", data.data)
                } else {
                    throw { error: data }
                }
            } catch (error) {
                // console.log("err", error);
            }
        },

        async GetStudentSchedule(context, student_id) {
            // // console.log("GetStudentSchedule", student_id);
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
                // console.log("Schedule=>", data.data);
                if (data.statusCode === 200) {
                    context.commit("SetStudentSchedule", data.data)
                } else {
                    // context.commit("SetStudentSchedule", [])
                    throw { error: data }
                }
            } catch (error) {
                // console.log("err", error);
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
        getfilterGetUserList(state) {
            return state.filter_role
        },
        getUserOneTemp(state) {
            return state.user_one_temp
        }
    },
};

export default userModules;

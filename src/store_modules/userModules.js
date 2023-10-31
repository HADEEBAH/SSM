import axios from "axios";
import VueCookie from "vue-cookie"

const userModules = {
    namespaced: true,
    state: {
        user_list: [],
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
            state.show_by_id = state.user_one_temp

        },


    },
    actions: {
        async ChangeUserOneTemp(context, user_one_data) {
            context.commit("SetUserOneTemp", user_one_data)
        },

        async GetUserList(context, { limit, page }) {
            //     console.log('limit :>> ', limit);
            //     console.log('page :>> ', page);
            // async GetUserList(context) {
            try {
                let config = {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Content-type": "Application/json",
                        'Authorization': `Bearer ${VueCookie.get("token")}`
                    }
                }
                let localhost = "http://localhost:3000"
                let { data } = await axios.get(`${localhost}/api/v1/usermanagement/limit?limit=${limit}&page=${page}`, config)
                // let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/usermanagement/limit?limit=${limit}&page=${page}`, config)
                // let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/usermanagement`, config)


                if (data.statusCode === 200) {
                    // console.log('data.data.data :>> ', data.data.data);
                    data.data?.data.map((val, i) => {
                        val.index = i + 1
                        val.userRoles?.map((value) => {
                            val.roleNameTh = value.roleNameTh
                            val.roleNameTh = value.roleNameTh
                            val.roleNameTh = value.roleNameTh
                            return value
                        })
                        return val
                    })
                    context.commit("SetUserList", data.data)
                } else {
                    throw { error: data }
                }
            } catch (error) {
                console.log(error);
            }
        },

        async FilterGetUserList(context, role) {
            this.user_lists_is_loading = true;
            let query_roles = "";
            role.map((val) => {
                query_roles += `roleId=${val}&`;
            });
            try {
                let config = {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Content-type": "Application/json",
                        'Authorization': `Bearer ${VueCookie.get("token")}`
                    }
                }
                
                let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/getrole/filter?${query_roles}`, config)

                if (data.statusCode === 200) {
                    data.data.map((val, i) => {
                        val.index = i + 1;
                        return val;
                    })
                    context.commit("SetfilterGetUserList", data.data)
                } else {
                    throw { error: data }
                }
            } catch (error) {
                console.log(error);
            }
        },

        async GetShowById(context, account_id) {
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
                }
            } catch (error) {
                context.commit("SetShowByOne")
            }
        },

        async GetUserById(context, account_id) {
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
                    data.data.imageUrl = data.data.image ? `${process.env.VUE_APP_URL}/api/v1/files/${data.data.image}` : null
                    context.commit("SetUserById", data.data)
                } else {
                    throw { error: data }
                }
            } catch (error) {
                console.log(error);
            }
        },

        async GetStudentSchedule(context, student_id) {
            context.commit("SetStudentSchedule", [])
            try {
                let config = {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Content-type": "Application/json",
                        'Authorization': `Bearer ${VueCookie.get("token")}`
                    }
                }
                let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/usermanagement/student/${student_id}`, config)
                if (data.statusCode === 200) {
                    data.data.map((items) => {
                        items.coachNameTh = `${items.coach.firstNameTh} ${items.coach.lastNameTh}`
                        items.coachNameEn = `${items.coach.firstNameEng} ${items.coach.lastNameEng}`
                    })
                    context.commit("SetStudentSchedule", data.data)

                } else {
                    throw { error: data }
                }
            } catch (error) {
                console.log(error);
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

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
        user_one_temp: {},
        filtered_data: [],
        students_data: []
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
        SetFilteredData(state, payload) {
            // state.filtered_data = payload
            state.user_list = payload
        },
        SetStudentData(state, payload) {
            state.students_data = payload
        },


    },
    actions: {
        async ChangeUserOneTemp(context, user_one_data) {
            context.commit("SetUserOneTemp", user_one_data)
        },

        async GetUserList(context, { limit, page }) {
            let startIndex = 0;
            let endIndex = 0;
            try {
                let config = {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Content-type": "Application/json",
                        'Authorization': `Bearer ${VueCookie.get("token")}`
                    }
                }
                // let localhost = "http://localhost:3000"
                let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/usermanagement/limit?limit=${limit}&page=${page}`, config)
                if (data.statusCode === 200) {
                    startIndex = (page - 1) * limit;
                    endIndex = page * limit;
                    data.data.data = data.data?.data.slice(startIndex, endIndex)
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

        async FilteredData(context, { name, role, limit, page }) {
            let startIndex = 0;
            let endIndex = 0;
            try {
                let config = {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Content-type": "Application/json",
                        'Authorization': `Bearer ${VueCookie.get("token")}`
                    }
                }
                // let localhost = "http://localhost:3000"
                // let { data } = await axios.get(`${localhost}/api/v1/usermanagement/search-limit?name=${name}&role=${role}&limit=${limit}&page=${page}`, config)
                let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/usermanagement/search-limit?name=${name}&role=${role}&limit=${limit}&page=${page}`, config)

                if (data.statusCode === 200) {
                    startIndex = (page - 1) * limit;
                    endIndex = page * limit;
                    data.data.data = data.data?.data.slice(startIndex, endIndex)
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
                // let localhost = "http://localhost:3000";

                // let { data } = await axios.get(`${localhost}/api/v1/usermanagement/${account_id}`, config)
                let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/usermanagement/${account_id}`, config)
                if (data.statusCode === 200) {
                    data.data.image = data.data.image && data.data.image != "" ? `${process.env.VUE_APP_URL}/api/v1/files/${data.data.image}` : ""
                    context.commit("SetShowById", [])
                    data.data.class = data.data.class ? data.data.class : {
                        classNameTh: "",
                        classNameEn: ""
                    }
                    data.data.school = data.data.school ? data.data.school : {
                        schoolNameTh: "",
                        schoolNameEn: ""
                    }
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
                // let localhost = "http://localhost:3000"
                // let { data } = await axios.get(`${localhost}/api/v1/usermanagement/student/${student_id}`, config)
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

        async GetStudentData(context, { course_id }) {
            try {
                let config = {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Content-type": "Application/json",
                        'Authorization': `Bearer ${VueCookie.get("token")}`
                    }
                }
                // let localhost = "http://localhost:3000"
                // let { data } = await axios.get(`${localhost}/api/v1/studentlist/by/course?courseId=${course_id}`, config)
                let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/studentlist/by/course?courseId=${course_id}`, config)
                if (data.statusCode === 200) {
                    context.commit("SetStudentData", data.data)
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
        },
        getFilteredData(state) {
            return state.filtered_data
        },
        getStudentsData(state) {
            return state.students_data
        },
    },
};

export default userModules;

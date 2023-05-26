import axios from "axios";
import VueCookie from "vue-cookie"

const manageScheduleModules = {
    namespaced: true,
    state: {
        get_course: [],
    },
    mutations: {
        SetGetCourse(state, payload) {
            state.get_course = payload
        }
    },
    actions: {
        async GetCourse(context) {
            try {
                let config = {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Content-type": "Application/json",
                        'Authorization': `Bearer ${VueCookie.get("token")}`
                    }
                }

                let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/course/all`, config)
                if (data.statusCode === 200) {
                    context.commit("SetGetCourse", data.data)
                    console.log("SetGetCourse", data.data)
                }
            } catch (error) {
                console.log("error", error);
            }
        }
    },
    getters: {
        getCourse(state) {
            return state.get_course
        }
    },
};

export default manageScheduleModules;
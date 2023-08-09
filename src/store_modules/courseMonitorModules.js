import axios from "axios";
const courseMonitorModules = {
  namespaced: true,
  state: {
    course_monitors : []
  },
  mutations: {
    SetCourseMonitors(state, payload){
        state.course_monitors = payload
    }
  },
  actions: {
    async GetShortCourseMonitor(context,{course_id}){
        try{
            let {data} = await axios.get(`${process.env.VUE_APP_URL}/api/v1/monitor/short/courseId/${course_id}`)
            if(data.statusCode === 200){
                context.commit("SetCourseMonitors",data.data)
            }
        }catch(error){
           console.log(error)
        }
    },
    async GetGeneralCourseMonitor(context,{ course_id, cpo_id}){
        try{
            let {data} = await axios.get(`${process.env.VUE_APP_URL}/api/v1/monitor/general/courseId/${course_id}/cpoId/${cpo_id}`)
            if(data.statusCode === 200){
                context.commit("SetCourseMonitors",data.data)
            }
        }catch(error){
           console.log(error)
        }
    },
    async GetAllCourseMonitor(context){
        try{
            let {data} = await axios.get(`${process.env.VUE_APP_URL}/api/v1/monitor/all`)
            if(data.statusCode === 200){
                context.commit("SetCourseMonitors",data.data)
            }
        }catch(error){
           console.log(error)
        }
    },
  },
  getters: {
    getCourseMonitor(state){
        return state.course_monitors
    }
  },
};

export default courseMonitorModules;

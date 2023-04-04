import axios from "axios"
import VueCookie from "vue-cookie"
import moment from "moment"
const coachModules = {
    namespaced: true,
    state: {
        coach : {},
        coachs : {},
        my_courses : [],
        my_courses_is_loading : false
    },
    mutations: {
        SetCoach(state, payload){
            state.coach = payload
        },
        SetCoachs(state, payload){
            state.coachs = payload
        },
        SetMyCourses(state, payload){
            state.my_courses = payload
        },
        SetMyCoursesIsLoading(state, value){
            state.my_courses_is_loading = value
        }
        
    },
    actions: {
        async GetMyCourses(context, {coach_id}){
            context.commit("SetMyCoursesIsLoading", true)
            try{
                let config = {
                    headers:{
                        "Access-Control-Allow-Origin" : "*",
                        "Content-type": "Application/json",
                        'Authorization' : `Bearer ${VueCookie.get("token")}`
                    }
                  }
                let endPoint = `${process.env.VUE_APP_URL}/api/v1/mycourse/coach/${coach_id}`
                console.log(endPoint)
                let {data} = await axios.get(`${process.env.VUE_APP_URL}/api/v1/mycourse/coach/${coach_id}`,config)
                if(data.statusCode === 200){
                    console.log(data.data)
                    let courses_task = []
                    for(const course  of data.data){
                        console.log(course)
                        for(const dates of course.dates){
                            const [start_hours, start_minutes] = course.start.split(":");
                            const [end_hours, end_minutes] = course.end.split(":");
                           
                            const startDate = new Date(dates);
                            startDate.setHours(start_hours);
                            startDate.setMinutes(start_minutes);
                            
                            const endDate = new Date(dates);
                            endDate.setHours(end_hours);
                            endDate.setMinutes(end_minutes);
                            
                            console.log(startDate.toISOString(), endDate.toISOString());
                            courses_task.push({
                                name: course.courseNameTh,
                                subtitle : course.courseNameEn,
                                coach : "นายสมชาย ศรีชาตรี",
                                start: moment(startDate).format("YYYY-MM-DD HH:mm") ,
                                end: moment(endDate).format("YYYY-MM-DD HH:mm"),
                            })
                        } 
                        
                    }
                    context.commit("SetMyCourses",courses_task)
                    context.commit("SetMyCoursesIsLoading", false)
                }else{
                    throw data
                }
            }catch(error){
                context.commit("SetMyCoursesIsLoading", false)
                console.log(error)
            }
        }
    },
    getters: {
        getCoach(state){
            return state.coach 
        },
        getCoachs(state){
            return state.coachs 
        },
        getMyCourses(state){
            return state.my_courses
        },
        getMyCoursesIsLoading(state){
            return state.my_courses_is_loading
        }
    },
};

export default coachModules;

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
                const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', era: 'long', calendar: 'buddhist' };
                let config = {
                    headers:{
                        "Access-Control-Allow-Origin" : "*",
                        "Content-type": "Application/json",
                        'Authorization' : `Bearer ${VueCookie.get("token")}`
                    }
                  }
                let user_detail = localStorage.getItem("userDetail")
                let {data} = await axios.get(`${process.env.VUE_APP_URL}/api/v1/mycourse/coach/${coach_id}`,config)
                if(data.statusCode === 200){
                    console.log(data.data)
                    let courses_task = []
                    for(const course  of data.data){
                        console.log(course)
                        for(const dates of course.dates){
                            let start_time = course?.start ? course?.start : course.coursePeriodStartDate 
                            let end_time =  course?.end ? course?.end :course.coursePeriodEndDate
                            const [start_hours, start_minutes] = start_time.split(":");
                            const [end_hours, end_minutes] = end_time.split(":");
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
                                course_id : course.courseId, 
                                coach : `${user_detail.first_name_th} ${user_detail.last_name_th}`,
                                start_date: moment(startDate).format("YYYY-MM-DD"),
                                start_date_str : startDate.toLocaleDateString('th-TH',options),
                                start: moment(startDate).format("YYYY-MM-DD HH:mm") ,
                                end: moment(endDate).format("YYYY-MM-DD HH:mm"),
                                start_time: start_time,
                                end_time: end_time,
                                course_img : course.courseImg ? `${process.env.VUE_APP_URL}/api/v1/files/${course.courseImg}` : "",
                                course_per_time: course.coursePerTime
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

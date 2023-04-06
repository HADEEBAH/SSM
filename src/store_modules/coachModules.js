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
                "/api/v1/coachmanagement/coach/:coachId"
                const courses = [
                        {
                              "cpoId": "",
                              "dayOfWeekId": "24633df3-4c5d-4169-a8cc-c6de98eb1e05",
                              "timeId": "1702ed51-5571-4b34-9e38-7601adbe40c4",
                              "courseId": "54b6f29b-4640-486f-9800-4c709492da80",
                              "dates": {
                                  "totalDay": 12,
                                  "course_study_start_date": "2023-04-11T17:00:00.000Z",
                                  "course_study_end_date": "2023-05-04T17:00:00.000Z",
                                  "day": [
                                      "5",
                                      "4",
                                      "3"
                                  ],
                                  "dates": [
                                      "2023-04-12",
                                      "2023-04-13",
                                      "2023-04-14",
                                      "2023-04-19",
                                      "2023-04-20",
                                      "2023-04-21",
                                      "2023-04-26",
                                      "2023-04-27",
                                      "2023-04-28",
                                      "2023-05-03",
                                      "2023-05-04",
                                      "2023-05-05"
                                  ]
                              },
                              "period": {
                                  "start": "14:00",
                                  "end": "15:00"
                              }
                          },
                  ]
                  let courses_task = []
                  for(const course  of courses){
                    const course_data = await axios.get(`${process.env.VUE_APP_URL}/api/v1/course/detail/${course.courseId}`)
                    console.log(course_data.data.data)
                    if(course_data.data.statusCode === 200){
                        for(const dates of course.dates.dates){
                            let start_time = course.period.start 
                            let end_time = course.period.end 
                            const [start_hours, start_minutes] = start_time.split(":");
                            const [end_hours, end_minutes] = end_time.split(":");
                            const startDate = new Date(dates);
                            startDate.setHours(start_hours);
                            startDate.setMinutes(start_minutes);
                            const endDate = new Date(dates);
                            endDate.setHours(end_hours);
                            endDate.setMinutes(end_minutes);
                            courses_task.push({
                                name: course_data.data.data.courseNameTh,
                                subtitle : course_data.data.data.courseNameEn,
                                course_id : course.courseId, 
                                coach : `${user_detail.first_name_th} ${user_detail.last_name_th}`,
                                start_date: moment(startDate).format("YYYY-MM-DD"),
                                start_date_str : startDate.toLocaleDateString('th-TH',options),
                                start: moment(startDate).format("YYYY-MM-DD HH:mm") ,
                                end: moment(endDate).format("YYYY-MM-DD HH:mm"),
                                start_time: start_time,
                                end_time: end_time,
                                course_img : course_data.data.data.courseImg ? `${process.env.VUE_APP_URL}/api/v1/files/${course_data.data.data.courseImg}` : "",
                                course_per_time: course_data.data.data.coursePerTime
                            })
                        }
                       
                    }
                  }
                    context.commit("SetMyCourses",courses_task)
                    context.commit("SetMyCoursesIsLoading", false)
                let {data} = await axios.get(`${process.env.VUE_APP_URL}/api/v1/mycourse/coach/${coach_id}`,config)
                console.log(data)
                // if(data.statusCode === 200){
                //     console.log(data.data)
                    
                //     let courses_task = []
                //     for(const course  of data.data){
                //         console.log(course)
                //         for(const dates of course.dates){
                //             let start_time = course?.start ? course?.start : course.coursePeriodStartDate 
                //             let end_time =  course?.end ? course?.end :course.coursePeriodEndDate
                //             const [start_hours, start_minutes] = start_time.split(":");
                //             const [end_hours, end_minutes] = end_time.split(":");
                //             const startDate = new Date(dates);
                //             startDate.setHours(start_hours);
                //             startDate.setMinutes(start_minutes);
                //             const endDate = new Date(dates);
                //             endDate.setHours(end_hours);
                //             endDate.setMinutes(end_minutes);
                //             console.log(startDate.toISOString(), endDate.toISOString());
                //             courses_task.push({
                //                 name: course.courseNameTh,
                //                 subtitle : course.courseNameEn,
                //                 course_id : course.courseId, 
                //                 coach : `${user_detail.first_name_th} ${user_detail.last_name_th}`,
                //                 start_date: moment(startDate).format("YYYY-MM-DD"),
                //                 start_date_str : startDate.toLocaleDateString('th-TH',options),
                //                 start: moment(startDate).format("YYYY-MM-DD HH:mm") ,
                //                 end: moment(endDate).format("YYYY-MM-DD HH:mm"),
                //                 start_time: start_time,
                //                 end_time: end_time,
                //                 course_img : course.courseImg ? `${process.env.VUE_APP_URL}/api/v1/files/${course.courseImg}` : "",
                //                 course_per_time: course.coursePerTime
                //             })
                //         } 
                //     }
                //     context.commit("SetMyCourses",courses_task)
                //     context.commit("SetMyCoursesIsLoading", false)
                // }else{
                //     throw data
                // }
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

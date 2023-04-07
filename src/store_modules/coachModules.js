import axios from "axios";
import VueCookie from "vue-cookie";
import moment from "moment";
const coachModules = {
  namespaced: true,
  state: {
    coach: {},
    coachs: {},
    my_courses: [],
    my_courses_is_loading: false,
    coach_check_in : {},
    student_check_in : [],
    coach_check_in_is_loading : false,
  },
  mutations: {
    SetCoach(state, payload) {
      state.coach = payload;
    },
    SetCoachs(state, payload) {
      state.coachs = payload;
    },
    SetCoachCheckIn(state, payload){
      state.coach_check_in = payload
    },
    SetCoachCheckInIsLoading(state, value){
      state.coach_check_in_is_loading = value
    },
    SetStudentCheckIn(state, payload){
      state.student_check_in = payload
    },
    SetMyCourses(state, payload) {
      state.my_courses = payload;
    },
    SetMyCoursesIsLoading(state, value) {
      state.my_courses_is_loading = value;
    },
  },
  actions: {
    async AssessmentStudent(context, {students}){
      try{
        let config = {
          headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-type": "Application/json",
              Authorization: `Bearer ${VueCookie.get("token")}`,
          },
        };
        for (const student of students) {
          let payload = {
            status : student.check_in_status, // punctual, late,  leave, emergency leave, absent,
            compensation_date : student.compensation_date,
            compensation_start_time : student.start_time,
            compensation_end_time : student.end_time,
            "evolution" :student.evolution ,
            "interest" : student.interest ,
            "remark": student.remark,
            "remarkFiles": "-" ,
          }
          if(!student.assessmentStudentsId){
            let {data} = await axios.post(`${process.env.VUE_APP_URL}/api/v1/coachmanagement/assessment/${student.check_in_student_id}`,payload,config)
            if(data.statusCode == 200){
              console.log(data)
            }else{
              throw {error : data}
            }
          }else{
            let {data} = await axios.patch(`${process.env.VUE_APP_URL}/api/v1/coachmanagement/assessment/${student.check_in_student_id}`,payload,config)
            if(data.statusCode == 200){
              console.log(data)
            }else{
              throw {error : data}
            }
          }
        }
      }catch(error){
        console.log(error)
      }
    },
    async UpdateCheckInStudent(context, {students}){
      
      try{
        let config = {
          headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-type": "Application/json",
              Authorization: `Bearer ${VueCookie.get("token")}`,
          },
        };
        for (const student of students) {
          let payload = {
            status : student.check_in_status, // punctual, late,  leave, emergency leave, absent,
            compensationDate : student.compensation_date,
            compensationStartTime : moment(student.start_time).format("HH:mm"),
            compensationEndTime : moment(student.end_time).format("HH:mm"),
            // "evolution" :student.evolution ,
            // "interest" : student.interest ,
            // "remark": student.remark,
            // "remarkFiles": "-" ,
          }
          console.log("payload :",payload)
          let {data} = await axios.patch(`${process.env.VUE_APP_URL}/api/v1/checkin/student/${student.check_in_student_id}`,payload,config)
          console.log(data)
          if(data.statusCode === 200 ){
            console.log(data)
          }else{
            throw { error :data }
          }
        }
        
      }catch(error){
        console.log(error)
      }
    },
    async GetStudentByTimeId(context, {course_id, time_id, date}){
      try{
        console.log(course_id, time_id, date)
        let config = {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-type": "Application/json",
                Authorization: `Bearer ${VueCookie.get("token")}`,
            },
        };
        // let user_detail = JSON.parse(localStorage.getItem("userDetail"));
        let {data} = await axios.get(`${process.env.VUE_APP_URL}/api/v1/coachmanagement/course/${course_id}/date/${date}`,config)
        console.log(data)
        if(data.statusCode === 200){
          data.data.forEach((student, index) => {
            student.no = index+1
            student.fullname = `${student.firstNameTh} ${student.lastNameTh}`
            student.check_in_student_id = student.checkInStudentId,
            student.menu_compensation_date = false,
            student.compensation_date_str = ""
            student.class_time = "-"
            student.check_in_status = student.status,
            student.remark = ""
          });

          context.commit("SetStudentCheckIn",data.data)
        }
      }catch(error){
        console.log(error)
      }
    },
    async CheckInCoach(context, {course_id, time_id, date} ){
      context.commit("SetCoachCheckInIsLoading", true)
        try{
            console.log(course_id, time_id, date)
            let config = {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-type": "Application/json",
                    Authorization: `Bearer ${VueCookie.get("token")}`,
                },
            };
            let user_detail =  JSON.parse(localStorage.getItem("userDetail"));
            const {data} = await axios.post(`${process.env.VUE_APP_URL}/api/v1/coachmanagement/coach/${user_detail.account_id}/course/${course_id}`,{
                "date": date,
                "timeId": time_id
            },config)
            if(data.statusCode === 201){
              let stadentData = await axios.get(`${process.env.VUE_APP_URL}/api/v1/coachmanagement/course/${course_id}/date/${date}`,config)
              console.log(data)
              if(stadentData.data.statusCode === 200){
                stadentData.data.data.forEach((student, index) => {
                  student.no = index+1
                  student.fullname = `${student.firstNameTh} ${student.lastNameTh}`
                  student.check_in_student_id = student.checkInStudentId,
                  student.menu_compensation_date = false,
                  student.compensation_date = "",
                  student.compensation_date_str = "",
                  student.class_time = "-"
                  student.check_in_status = student.status
                });
                context.commit("SetCoachCheckInIsLoading", false)
                context.commit("SetStudentCheckIn",stadentData.data.data)
              }else{
                throw {error : data}
              }
            }else{
              throw { error : data }
            }
        }catch(error){
            console.log(error)
        }
    },
    async GetMyCourses(context, { coach_id }) {
      context.commit("SetMyCoursesIsLoading", true);
      try {
        const options = {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        };
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            Authorization: `Bearer ${VueCookie.get("token")}`,
          },
        };
        let user_detail = JSON.parse(localStorage.getItem("userDetail"));
        const {data} = await axios.get(`${process.env.VUE_APP_URL}/api/v1/coachmanagement/coach/${coach_id}`,config);
        console.log(data)
        if(data.statusCode == 200){
            let courses_task = [];
            for (const course of data.data) {
              const course_data = await axios.get( `${process.env.VUE_APP_URL}/api/v1/course/detail/${course.courseId}` );
              console.log(course_data.data.data);
              if (course_data.data.statusCode === 200) {
                for (const dates of course.dates.dates) {
                  let start_time = course.period.start;
                  let end_time = course.period.end;
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
                    subtitle: course_data.data.data.courseNameEn,
                    course_id: course.courseId,
                    time_id : course.timeId,
                    day_of_week_id: course.dayOfWeekId,
                    coach: `${user_detail.first_name_th} ${user_detail.last_name_th}`,
                    start_date: moment(startDate).format("YYYY-MM-DD"),
                    start_date_str: startDate.toLocaleDateString("th-TH", options),
                    start: moment(startDate).format("YYYY-MM-DD HH:mm"),
                    end: moment(endDate).format("YYYY-MM-DD HH:mm"),
                    start_time: start_time,
                    end_time: end_time,
                    category_name : course_data.data.data.categoryNameTh,
                    course_img: course_data.data.data.courseImg
                      ? `${process.env.VUE_APP_URL}/api/v1/files/${course_data.data.data.courseImg}`
                      : "",
                    course_per_time: course_data.data.data.coursePerTime,
                  });
                }
              }
            }
            context.commit("SetMyCourses", courses_task);
            context.commit("SetMyCoursesIsLoading", false);
        }
       
      
        // let { data } = await axios.get(
        //   `${process.env.VUE_APP_URL}/api/v1/mycourse/coach/${coach_id}`,
        //   config
        // );
        // console.log(data);
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
      } catch (error) {
        context.commit("SetMyCoursesIsLoading", false);
        console.log(error);
      }
    },
  },
  getters: {
    getCoach(state) {
      return state.coach;
    },
    getCoachs(state) {
      return state.coachs;
    },
    getMyCourses(state) {
      return state.my_courses;
    },
    getMyCoursesIsLoading(state) {
      return state.my_courses_is_loading;
    },
    getCoachCheckIn(state){
      return state.coach_check_in
    },
    getCoachCheckInIsLoading(state){
      return state.coach_check_in_is_loading
    },
    getStudentCheckIn(state){
      return state.student_check_in
    }
  },
};

export default coachModules;

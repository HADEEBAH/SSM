import axios from "axios";
import moment from "moment";
import Swal from "sweetalert2";
import router from "@/router";
import VueCookie from "vue-cookie"
import {dateDMY} from "../functions/functions"
function dayOfWeekArray(day) {
  // console.log
  // let day_arr = day
  let days = day
  // console.log(day)
  const weekdays =[
    "วันอาทิตย์",
    "วันจันทร์",
    "วันอังคาร",
    "วันพุธ",
    "วันพฤหัสบดี",
    "วันศุกร์",
    "วันเสาร์",
  ];
  days.sort();
  let ranges = [];
  if(days[0]){
    let rangeStart =  parseInt(days[0]);
    let prevDay = rangeStart;
    for (let i = 1; i < days.length; i++) {
      const day = parseInt(days[i]);
      if (day === prevDay + 1) {
        prevDay = day;
      } else {
        const rangeEnd = prevDay;
        ranges.push({ start: rangeStart, end: rangeEnd });
        rangeStart = day;
        prevDay = day;
      }
    }
    ranges.push({ start: rangeStart, end: prevDay });
    return ranges.map(({ start, end }) => start === end ? weekdays[start] : `${weekdays[start]} - ${weekdays[end]}`).join(', ')
  }
}
const CourseModules = {
  namespaced: true,
  state: {
    course_types: [],
    courses_is_loading: false,
    course_is_loading: false,
    course_data: {
      course_id: "",
      course_type_id: "CT_1",
      course_name_th: "",
      course_name_en: "",
      course_img: "",
      category_id: "",
      kingdom_name: "",
      course_open_date: "",
      course_open_date_str: "",
      menu_course_open_date: false,
      course_hours: 1,
      location: "",
      detail: "",
      music_performance: "",
      catification: "",
      price_course: 0,
      student_recived: 0,
      artwork_file : [],
      coachs: [
        {
          coach_id: "",
          coach_name: "",
          teach_days_used: [],
          teach_day_data: [
            {
              class_open: true,
              teach_day: [],
              class_date: [
                {
                  class_date_range: {
                    start_time: "",
                    start_time_object : {HH:"",mm:""},
                    menu_start_time: false,
                    end_time: "",
                    end_time_object : {HH:"",mm:""},
                    menu_end_time: false,
                  },
                  students: 0,
                },
              ],
            },
          ],
          class_date_range: {
            start_date: "",
            menu_start_date: false,
            end_date: "",
            menu_end_date: false,
          },
          register_date_range: {
            start_date: "",
            menu_start_date: false,
            end_date: "",
            menu_end_date: false,
          },
          period: {
            start_time: "",
            start_time_object : {HH:"",mm:""},
            end_time: "",
            end_time_object : {HH:"",mm:""},
          },
        },
      ],
      packages: [
        {
          package_id: "",
          package: "",
          students: 0,
          options: [
            {
              period_package: "",
              amount: 0,
              price_unit: 0,
              discount: false,
              discount_price: 0,
              privilege: "",
              net_price: 0,
              net_price_unit: 0,
            },
          ],
        },
      ],
    },
    courses: [],
    packages_data: [],
    options_data: [],
    coachs: [],
    teach_days: [],
    update_status_course: [],
    sendUpdate: [],
    course_type_is_loading : false,
    course_student:[],
    course_artwork : [],
    course_potential : {},
    coach_list: [],
    coach_list_is_loading : false,
    student_list : [],
    stident_list_is_loading : false,
    student_reserve_list : [],
    student_potential_list : [],
    student_potential_list_is_loading : false,

  },
  mutations: {
    SetStudentPotentialListIsLoading(state, value){
      state.student_potential_list_is_loading = value
    },
    SetStudentPotentialList(state, payload) {
      state.student_potential_list = payload 
    },
    SetStudentReserveList(state, payload){
      state.student_reserve_list = payload
    },
    SetStudentListIsLoadIng(state, value){
      state.stident_list_is_loading = value
    },
    SetStudentList(state, payload){
      state.student_list = payload
    },
    SetCoachList(state, payload){
      state.coach_list = payload
    },
    SetCoachListIsLoading(state, payload){
      state.coach_list_is_loading = payload
    },
    SetCoursePotential(state, paylaod){
      state.course_potential = paylaod
    },
    SetCourseArtwork(state, payload){
      state.course_artwork = payload
    },
    ResetArtwork(state){
      state.course_artwork = []
    },
    SetCourseStudent(state, payload){
      state.course_student = payload
    },
    SetTeachDays(state, payload) {
      state.teach_days = payload
    },
    SetCourseTypeIsLoading(state, value){
      state.course_type_is_loading = value
    },
    SetCoachs(state, payload) {
      state.coachs = payload
    },
    SetPackages(state, payload) {
      state.packages_data = payload
    },
    SetOptions(state, payload) {
      state.options_data = payload
    },
    SetCourses(state, payload) {
      state.courses = payload
    },
    SetCourseData(state, payload) {
      state.course_data = payload
    },
    SetCourseIsLoading(state, value) {
      state.course_is_loading = value
    },
    SetCoursesIsLoading(state, value) {
      state.courses_is_loading = value
    },
    SetCourseTypes(state, payload) {
      state.course_types = payload
    },
    ResetCourse(state) {
      state.course_data =  {
        course_id: "",
        course_type_id: "CT_1",
        course_name_th: "",
        course_name_en: "",
        course_img: "",
        category_id: "",
        kingdom_name: "",
        course_open_date: "",
        course_open_date_str: "",
        menu_course_open_date: false,
        course_hours: 1,
        location: "",
        detail: "",
        music_performance: "",
        catification: "",
        price_course: 0,
        student_recived: 0,
        artwork_file : [],
        coachs: [
          {
            coach_id: "",
            coach_name: "",
            teach_days_used: [],
            teach_day_data: [
              {
                class_open: true,
                teach_day: [],
                class_date: [
                  {
                    class_date_range: {
                      start_time: "",
                      start_time_object : {HH:"",mm:""},
                      menu_start_time: false,
                      end_time: "",
                      end_time_object : {HH:"",mm:""},
                      menu_end_time: false,
                    },
                    students: 0,
                  },
                ],
              },
            ],
            class_date_range: {
              start_date: "",
              menu_start_date: false,
              end_date: "",
              menu_end_date: false,
            },
            register_date_range: {
              start_date: "",
              menu_start_date: false,
              end_date: "",
              menu_end_date: false,
            },
            period: {
              start_time: "",
              start_time_object : {HH:"",mm:""},
              end_time: "",
              end_time_object : {HH:"",mm:""}
            },
          },
        ],
        packages: [
          {
            package_id: "",
            package: "",
            students: 0,
            options: [
              {
                period_package: "",
                amount: 0,
                price_unit: 0,
                discount: false,
                discount_price: 0,
                privilege: "",
                net_price: 0,
                net_price_unit: 0,
              },
            ],
          },
        ],
      }
    },
    SetStatusCourse(state, payload) {
      state.update_status_course = payload
    },
    ChangeDataUpdate(state, payload) {
      state.sendUpdate = payload
    }
  },
  actions: {
    // COURSE TYPES
    async GetCourseTypes(context, { category_id }) {
      try {
        // console.log("category_id :", category_id)
        let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/course/type?category_id=${category_id}`)
        if (data.statusCode === 200) {
          // console.log("SetCourseTypes", data.data)
          context.commit("SetCourseTypes", data.data)
        }
      } catch (error) {
        console.log(error)
      }
    },
    // TEACH DAYS
    async GetTeachDays(context, coach_data) {
      try {
        let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/account/coach/${coach_data.coach_id}`)
        if (data.statusCode === 200) {
          // console.log(data)
          context.commit("SetTeachDays", data.data)
        } else {
          throw { message: data.message }
        }
      } catch (error) {
        console.log(error)
      }
    },
    // COACH :: LIST
    async GetCoachs(context) {
      try {
        // let localhost = "http://localhost:3000"
        let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/account/role/R_3`)
        if (data.statusCode === 200) {
          data.data.forEach((coach) => {
            // console.log("coach =>", coach)
            coach.fullNameTh = `${coach.firstNameTh} ${coach.lastNameTh}`
            coach.fullNameEh = `${coach.firstNameEng} ${coach.lastNameEng}`
          })
          // console.log(data)
          context.commit("SetCoachs", data.data)
        } else {
          // console.log(data)
          throw {error : data}
        }
      } catch (error) {
        console.log(error)
      }
    },
    ChangeCourseData(context, course_data) {
      console.log("CourseData : ", course_data)
      context.commit("SetCourseData", course_data)
    },
    // COACH :: LIST BY COURSE
    async GetCoachsByCourse(context, {course_id}){
      context.commit("SetCoachListIsLoading", true)
      try{
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            'Authorization': `Bearer ${VueCookie.get("token")}`
          }
        }
        // let localhost = "http://localhost:3000"
        let {data} = await axios.get(`${process.env.VUE_APP_URL}/api/v1/studentlist/course/${course_id}`,config)
        // console.log("studentlist",data.data)
        if(data.statusCode === 200){
          for await (let coach  of data.data){
            let coach_data = await axios.get(`${process.env.VUE_APP_URL}/api/v1/account/${coach.coachId}`)
            if(coach_data.data.statusCode === 200){
                // console.log(coach_data.data.data)
                coach.firstNameTh =  coach_data.data.data.firstNameTh
                coach.firstNameEn =  coach_data.data.data.firstNameEng
                coach.lastNameTh =  coach_data.data.data.lastNameTh
                coach.lastNameEn =  coach_data.data.data.lastNameEng
                coach.checked = false
            }
            let datesList = []
            for await (const coachDate of coach.allDates){
              // console.log(coachDate)
              if (!coachDate.cpo.cpoId){
                console.log("ระยะสั้น")
                for await (const date of coachDate.dates.dates){
                  if(datesList.filter(v => v.date === date).length === 0){
                    datesList.push({
                      date : date,
                      timeId : coachDate.time.timeId,
                      start : coachDate.time.start,
                      end :  coachDate.time.end,
                      startDate : dateDMY(coachDate.dates.startDate),
                      endDate :   dateDMY(coachDate.dates.endDate),
                      time : `${coachDate.time.start}น.-${coachDate.time.end}น.`,
                      cpo : coachDate.cpo ? coachDate.cpo : null,
                      cpoId : coachDate.cpo.cpoId ? coachDate.cpo.cpoId  : null,
                      students : coachDate.studentArr,
                      checked : false,
                    })
                  }
                }
              }else{
                for await (const date of coachDate.dates.date){
                  if(datesList.filter(v => v.date === date && v.start === coachDate.time.start && v.end === coachDate.time.end && v.cpo.packageName === coachDate.cpo.packageName).length === 0){
                    datesList.push({
                      date : date,
                      timeId : coachDate.time.timeId,
                      start : coachDate.time.start,
                      end :  coachDate.time.end,
                      time : `${coachDate.time.start}น.-${coachDate.time.end}น.`,
                      cpo : coachDate.cpo ? coachDate.cpo : null,
                      cpoId : coachDate.cpo.cpoId ? coachDate.cpo.cpoId  : null,
                      students : coachDate.studentArr,
                      checked : false,
                    })
                  }
                }
              }
            }
            coach.datesList = datesList.sort(function(a, b) {
              var dateA = new Date(a.date);
              var dateB = new Date(b.date);
              return dateA - dateB;
            });
          }
          // console.log(data.data)
          context.commit("SetCoachListIsLoading", false)
          context.commit("SetCoachList",data.data)
        }
      }catch(error){
        context.commit("SetCoachListIsLoading", false)
        console.log(error)
      }
    },
    // STUDENT :: LIST BY COACH
    async GetStudentByDate(context, {course_id,date}){
      context.commit("SetStudentListIsLoadIng", true)
      try{
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            'Authorization': `Bearer ${VueCookie.get("token")}`
          }
        }
        // let localhost = "http://localhost:3000"
        let {data} = await axios.get(`${process.env.VUE_APP_URL}/api/v1/studentlist/checkin/course/${course_id}/date/${date}`,config)
        if(data.statusCode === 200){
          // console.log(data.data)
          context.commit("SetStudentList",data.data)
          context.commit("SetStudentListIsLoadIng", false)
        }
      }catch(error){
        context.commit("SetStudentListIsLoadIng", false)
        console.log(error)
      }
    },
    // STUDENT :: LIST POTENTIAL BY COACH
    async GetStudentPotentialByCoach(context,{course_id, coach_id}){
      context.commit("SetStudentPotentialListIsLoading",true)
      try{
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            'Authorization': `Bearer ${VueCookie.get("token")}`
          }
        }
        // let localhost = "http://localhost:3000"
        let {data} = await axios.get(`${process.env.VUE_APP_URL}/api/v1/studentlist/checkin/course/${course_id}/coach/${coach_id}`,config)
        if(data.statusCode === 200){
          console.log(data.data)
          context.commit("SetStudentPotentialList",data.data)
          context.commit("SetStudentPotentialListIsLoading",false)
        }
      }catch(error){
        context.commit("SetStudentPotentialListIsLoading",false)
        console.log(error)
      }

    },
    // RESERVE :: STUDENT LIST BY COURSE
    async GetStudentReserveByCourseId(context, {course_id}){
      try{
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            'Authorization': `Bearer ${VueCookie.get("token")}`
          }
        }
        // let localhost = "http://localhost:3000"
        let {data} = await axios.get(`${process.env.VUE_APP_URL}/api/v1/manage/reserve/course/${course_id}`,config)
        if(data.statusCode === 200){
          // console.log(data.data)
          context.commit("SetStudentReserveList",data.data)
        }
      }catch(error){
        console.log(error)
      }
    },
    // COURSE :: UPDATE COURSE DETAIL
    async UpdateCouserDetail(context,{course_id, course_data}){
      try{
        console.log(course_data)
        // let localhost = "http://localhost:3000"
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            'Authorization': `Bearer ${VueCookie.get("token")}`
          }
        }
        let payload = {
          "courseId": course_data.course_id,
          "courseTypeId": course_data.course_type_id,
          "type":course_data.type,
          "courseNameTh": course_data.course_name_th,
          "courseNameEn": course_data.course_name_en,
          "courseImg": typeof course_data.course_img == "object" ? null : course_data.course_img,
          "categoryId": course_data.category_id,
          "categoryNameTh": course_data.category_name_th,
          "courseOpenDate": course_data.course_open_date,
          "courseOpenDateStr":  course_data.course_open_date_str,
          "coursePerTime": course_data.course_hours,
          "courseLocation": course_data.location,
          "courseDescription":  course_data.detail,
          "courseMusicPerformance":  course_data.music_performance,
          "courseCertification": course_data.catification,
          "coursePrice": parseInt(course_data.price_course),
          "courseRegisterStartDate": course_data.course_register_start_date && course_data.course_register_start_date !== "Invalid date" ?  course_data.course_register_start_date : null,
          "courseRegisterEndDate": course_data.course_register_end_date ? course_data.course_register_end_date : null,
          "coursePeriodStartDate":  course_data.coachs[0].period.start_time ? course_data.coachs[0].period.start_time : null,
          "coursePeriodEndDate": course_data.coachs[0].period.end_time  ? course_data.coachs[0].period.end_time  : null,
          "courseStudentRecived": course_data.student_recived,
          "courseStudyEndDate": course_data.course_study_end_date,
          "courseStudyStartDate": course_data.course_study_start_date, 
          "coachs": [],
          "dayOfweek": [],
        }
        if(course_data.course_type_id === "CT_2"){
          for await (const coach of course_data.coachs.filter(v => v.teach_day_data.length > 0)){          
            let teach_day_data = []
            for await (const date of coach.teach_day_data){
              let class_date = []
              for await (const class_date_data of date.class_date){
                class_date.push({
                  "dayOfWeekId": date.day_of_week_id,
                  "timeId":class_date_data.class_date_range.time_id,
                  "classDateRange": {
                    "startTime": class_date_data.class_date_range.start_time ?class_date_data.class_date_range.start_time : null,
                    "endTime": class_date_data.class_date_range.end_time ? class_date_data.class_date_range.end_time : null,
                  },
                  "students": parseInt(class_date_data.students)
                })
              } 
              if(date.day_of_week_id){
                if(teach_day_data.filter((v)=> v.dayOfWeekId === date.day_of_week_id && v.courseCoachId === date.course_coach_id).length === 0){
                  teach_day_data.push({
                    // "itmes" : day.times,
                    "dayOfWeekId": date.day_of_week_id,
                    // "classOpen": date.class_open === true ? 'Active' : 'InActive',
                    "classOpen": date.class_open,
                    "teachDay": date.teach_day,
                    "courseCoachId": date.course_coach_id,
                    "classDate": class_date
                  })
                }
              }else{
                teach_day_data.push({
                  // "itmes" : day.times,
                  "dayOfWeekId": null,
                  "classOpen": date.class_open === true ? 'Active' : 'InActive',
                  "teachDay": date.teach_day,
                  "courseCoachId": date.course_coach_id ? date.course_coach_id : null,
                  "classDate": class_date
                })
              }
            }
            
            payload.coachs.push({
              "coachId": coach.coach_id,
              "courseCoachId": coach.course_coach_id ?  coach.course_coach_id  : null,
              "coachName": coach.coach_name,
              "teachDayData" : teach_day_data,
              "classDateRange": {
                "startDate": coach.class_date_range.start_date ? moment(coach.class_date_range.start_date).format("YYYY-MM-DD") : null,
                "endDate":  coach.class_date_range.end_date ? moment(coach.class_date_range.end_date).format("YYYY-MM-DD") : null ,
              },
              "registerDateRange": {
                "startDate": coach.register_date_range.start_date && coach.register_date_range.start_date !== "-" ?  moment(coach.register_date_range.start_date).format("YYYY-MM-DD") : null,
                "endDate": coach.register_date_range.end_date && coach.register_date_range.end_date !== "-" ? moment(coach.register_date_range.end_date).format("YYYY-MM-DD") : null,
              },
              "period": {
                "startTime":  coach.period.start_time ?  coach.period.start_time : null,
                "endTime":  coach.period.end_time ? coach.period.end_time :null
              }
            })
            // payload.coachs[index].teachDayData = teach_day_data
          }
        }
        
        console.log("payload",payload)
        let payloadData = new FormData()
        payloadData.append("payload",JSON.stringify(payload))
        if (typeof course_data.course_img == "object") {
          payloadData.append("img_url", course_data.course_img)
        }
        // let localhost = "http://192.168.74.25:3000"
        let {data} = await axios.patch(`${process.env.VUE_APP_URL}/api/v1/manage/update-course/${course_id}`, payloadData, config)
        // console.log(data)
        if(data.statusCode === 200){
          Swal.fire({
            icon: "success",
            title: "แก้ไขคอร์สสำเร็จ",
            showDenyButton: false,
            showCancelButton: false,
            confirmButtonText: "ตกลง",
            cancelButtonText: "ยกเลิก",
          }).then(async (result) => {
            if (result.isConfirmed) {
              await context.dispatch("GetArtworkByCourse",{course_id : course_id})
              await context.dispatch("GetCourse",course_id)
            }
          })
        }
        }catch(error){
        console.log(error)
      }
    },
    // COURSE :: UPDATE COURSE COACH
    async UpdateCouserCoach(context,{course_id, course_data}){
      try{
        console.log(course_data)
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            'Authorization': `Bearer ${VueCookie.get("token")}`
          }
        }
        let payload = {
          "courseId": course_data.course_id,
          "courseTypeId": course_data.course_type_id,
          "categoryId": course_data.category_id,
          "coachs" : []
        }
        for await (const coach of course_data.coachs.filter(v => v.teach_day_data.length > 0)){          
          let teach_day_data = []
          for await (const date of coach.teach_day_data){
            let class_date = []
            for await (const class_date_data of date.class_date){
              class_date.push({
                "dayOfWeekId": date.day_of_week_id,
                "timeId":class_date_data.class_date_range.time_id,
                "classDateRange": {
                  "startTime": class_date_data.class_date_range.start_time ?class_date_data.class_date_range.start_time : null,
                  "endTime": class_date_data.class_date_range.end_time ? class_date_data.class_date_range.end_time : null,
                },
                "students": parseInt(class_date_data.students)
              })
            } 
            console.log(`${date.day_of_week_id} => `,class_date)
            console.log("///////////////////////////")
            if(date.day_of_week_id){
              if(teach_day_data.filter((v)=> v.dayOfWeekId === date.day_of_week_id && v.courseCoachId === date.course_coach_id).length === 0){
                teach_day_data.push({
                  // "itmes" : day.times,
                  "dayOfWeekId": date.day_of_week_id,
                  // "classOpen": date.class_open === true ? 'Active' : 'InActive',
                  "classOpen": date.class_open,
                  "teachDay": date.teach_day,
                  "courseCoachId": date.course_coach_id,
                  "classDate": class_date
                })
              }
            }else{
              teach_day_data.push({
                // "itmes" : day.times,
                "dayOfWeekId": null,
                "classOpen": date.class_open === true ? 'Active' : 'InActive',
                "teachDay": date.teach_day,
                "courseCoachId": date.course_coach_id ? date.course_coach_id : null,
                "classDate": class_date
              })
            }
            // console.log(teach_day_data)
            // if(teach_day_data[date_index]){
            //   teach_day_data[date_index].classDate = class_date
            // }else{
            //   console.log(teach_day_data)
            // }
          }
          
          payload.coachs.push({
            "coachId": coach.coach_id,
            "courseCoachId": coach.course_coach_id ?  coach.course_coach_id  : null,
            "coachName": coach.coach_name,
            "teachDayData" : teach_day_data,
            "classDateRange": {
              "startDate": coach.class_date_range.start_date ? moment(coach.class_date_range.start_date).format("YYYY-MM-DD") : null,
              "endDate":  coach.class_date_range.end_date ? moment(coach.class_date_range.end_date).format("YYYY-MM-DD") : null ,
            },
            "registerDateRange": {
              "startDate": coach.register_date_range.start_date && coach.register_date_range.start_date !== "-" ?  moment(coach.register_date_range.start_date).format("YYYY-MM-DD") : null,
              "endDate": coach.register_date_range.end_date && coach.register_date_range.end_date !== "-" ? moment(coach.register_date_range.end_date).format("YYYY-MM-DD") : null,
            },
            "period": {
              "startTime":  coach.period.start_time ? coach.period.start_time: null,
              "endTime":  coach.period.end_time ? coach.period.end_time :null
            }
          })
          // payload.coachs[index].teachDayData = teach_day_data
        }
        console.log("payload",payload)
        let payloadData = new FormData()
        payloadData.append("payload",JSON.stringify(payload))
        // let localhost = "http://localhost:3000"
        let {data} = await axios.patch(`${process.env.VUE_APP_URL}/api/v1/manage/update-coach/${course_id}`, payloadData, config)
        if(data.statusCode === 200){
          Swal.fire({
            icon: "success",
            title: "แก้ไขคอร์สสำเร็จ",
            showDenyButton: false,
            showCancelButton: false,
            confirmButtonText: "ตกลง",
            cancelButtonText: "ยกเลิก",
          }).then(async (result) => {
            if (result.isConfirmed) {
              await context.dispatch("GetCourse",course_id)
            }
          })
        }
        }catch(error){
        console.log(error)
      }
    },
    // COURSE :: UPDATE COURSE PACKAGE
    async UpdateCouserPackage(context,{course_id, course_data}){
      try{
        console.log("course_data => ",course_data)
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            'Authorization': `Bearer ${VueCookie.get("token")}`
          }
        }
        let payload = {
          "courseId": course_data.course_id,
          "packages": []
        }
        course_data.packages.forEach((package_data, index)=>{
          payload.packages.push({
            "packageId": package_data.package_id,
            "package": package_data.package,
            "students": package_data.students,
            "options": []
          })
          package_data.options.forEach((option_data)=>{
            console.log(option_data)
            payload.packages[index].options.push({
              "coursePackageOptionId": option_data.course_package_option_id ? option_data.course_package_option_id : null,
              "packageId":  payload.packages[index].packageId,
              "optionId": option_data.period_package,
              "optionName": option_data.option_name ? option_data.option_name : null,
              "periodPackage": option_data.period_package,
              "hourPerTime": option_data.amount,
              "pricePerPerson": option_data.price_unit,
              "discountStatus": option_data.discount,
              "discountPrice": option_data.discount_price,
              "optionDescription": option_data.privilege,
              "totalPrice": option_data.total_price,
              "netPrice": option_data.net_price,
              "netPriceUnit": option_data.net_price_unit,
              "studentNumber" :  package_data.students
            })
          })
        })
        console.log("payload => ",payload)
        let payloadData = new FormData()
        payloadData.append("payload",JSON.stringify(payload))
        // let localhost = "http://localhost:3000"
        let {data} = await axios.patch(`${process.env.VUE_APP_URL}/api/v1/manage/update-cpo/${course_id}`, payloadData, config)
        if(data.statusCode === 200){
          Swal.fire({
            icon: "success",
            title: "แก้ไขคอร์สสำเร็จ",
            showDenyButton: false,
            showCancelButton: false,
            confirmButtonText: "ตกลง",
            cancelButtonText: "ยกเลิก",
          })
        }
        }catch(error){
        console.log(error)
      }
    },
    // COURSE :: DELETE ARKWORK ID
    async RemoveArkworkByArkworkId(context,{artwork_data}){
      try{
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            'Authorization': `Bearer ${VueCookie.get("token")}`
          }
        }
        // let localhost = "http://localhost:3000"
        console.log("artwork_data :", artwork_data)
        let {data} = await axios.delete(`${process.env.VUE_APP_URL}/api/v1/course/artworkCourse/${artwork_data.artworkCourseId}`,config)
        console.log(data)
        if(data.statusCode == 200){
          Swal.fire({
            icon: "success",
            title: "ลบไฟล์สำเร็จ",
            showDenyButton: false,
            showCancelButton: false,
            confirmButtonText: "ตกลง",
            cancelButtonText: "ยกเลิก",
          })
        }
      }catch(error){
        console.log(error)
      }
    },
     // COURSE :: DELETA privilage
     async RemovePrivilageByCourseID(context,{course_id}){
      try{
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            'Authorization': `Bearer ${VueCookie.get("token")}`
          }
        }
        // let localhost = "http://localhost:3000"
        let {data} = await axios.delete(`${process.env.VUE_APP_URL}/api/v1/course/privilage/${course_id}`,config)
        console.log(data)
        if(data.statusCode == 200){
          Swal.fire({
            icon: "success",
            title: "ลบไฟล์สำเร็จ",
            showDenyButton: false,
            showCancelButton: false,
            confirmButtonText: "ตกลง",
            cancelButtonText: "ยกเลิก",
          })
        }
      }catch(error){
        console.log(error)
      }
    },
    // COURSE :: UPDATE ARKWORK
    async UpdateCourseArkwork(context,{course_id, course_data}){
      try{
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            'Authorization': `Bearer ${VueCookie.get("token")}`
          }
        }
        let payloadData = new FormData()
        if(course_data.privilege_file){
          payloadData.append("img_privilage",course_data.privilege_file)
        }
        if(course_data.artwork_file){
          for(let i = 0;i < course_data.artwork_file.length; i++){
            payloadData.append(`img_artwork`, course_data.artwork_file[i]);
          }         
        }      
        // let localhost = "http://localhost:3000"
        let {data} = await axios.patch(`${process.env.VUE_APP_URL}/api/v1/manage/update-artwork/${course_id}`,payloadData ,config)
        if(data.statusCode === 200){
          Swal.fire({
            icon: "success",
            title: "แก้ไขคอร์สสำเร็จ",
            showDenyButton: false,
            showCancelButton: false,
            confirmButtonText: "ตกลง",
            cancelButtonText: "ยกเลิก",
          }).then(async (result) => {
            if (result.isConfirmed) {
              await context.dispatch("GetArtworkByCourse",{course_id : course_id})
              await context.dispatch("GetCourse",course_id)
            }
          })
        }
      }catch(error){
        console.log(error)
      }
    },
    // COURSE :: UPDATE * Not used
    async UpdateCourse(context, { course_data }) {
      try {
        let payload = {
          "courseId": course_data.course_id,
          "courseTypeId": course_data.course_type_id,
          "type":course_data.type,
          "courseNameTh": course_data.course_name_th,
          "courseNameEn": course_data.course_name_en,
          "courseImg": course_data.course_img,
          "categoryId": course_data.category_id,
          "categoryNameTh": course_data.category_name_th,
          "courseOpenDate": course_data.course_open_date,
          "courseOpenDateStr":  course_data.course_open_date_str,
          "courseHours": course_data.course_hours,
          "location": course_data.location,
          "detail":  course_data.detail,
          "courseMusicPerformance":  course_data.music_performance,
          "courseCertification": course_data.catification,
          "priceCourse": parseInt(course_data.price_course),
          "courseRegisterStartDate": course_data.course_register_start_date && course_data.course_register_start_date !== "Invalid date" ?  course_data.course_register_start_date : null,
          "courseRegisterEndDate": course_data.course_register_end_date ? moment(course_data.course_register_end_date) : null,
          "coursePeriodStartDate":  course_data.course_register_end_date ? moment(course_data.course_period_start_date) : null,
          "coursePeriodEndDate": course_data.course_period_end_date ? moment(course_data.course_period_end_date) : null,
          "coursePerTime": course_data.course_per_time,
          "studentRecived": course_data.student_recived,
          "courseStudyEndDate": course_data.course_study_end_date,
          "courseStudyStartDate": course_data.course_study_start_date,
          "coachs" : [],
          "packages": []
        }
        // return payload
        course_data.packages.forEach((package_data, index)=>{
          payload.packages.push({
            "packageId": package_data.package_id,
            "package": package_data.package,
            "students": package_data.students,
            "options": []
          })
          package_data.options.forEach((option_data)=>{
            payload.packages[index].options.push({
              "coursePackageOptionId": option_data.course_package_option_id,
              "packageId": option_data.package_id,
              "optionId": option_data.option_id,
              "optionName": option_data.option_name,
              "periodPackage": option_data.period_package,
              "amount": option_data.amount,
              "priceUnit": option_data.price_unit,
              "discount": option_data.discount,
              "discountPrice": option_data.discount_price,
              "privilege": option_data.privilege,
              "totalPrice": option_data.total_price,
              "netPrice": option_data.net_price,
              "netPriceUnit": option_data.net_price_unit
            })
          })
        })
        course_data.coachs.filter(v => v.teach_day_data.length > 0).forEach((coach, index)=>{          
          payload.coachs.push({
            "coachId": coach.coach_id,
            "courseCoachId": coach.course_coach_id ?  coach.course_coach_id  : null,
            "coachName": coach.coach_name,
            "teachDayData" : [],
            "classDateRange": {
              "startDate": coach.class_date_range.start_date ? moment(coach.class_date_range.start_date).format("YYYY-MM-DD") : null,
              "endDate":  coach.class_date_range.end_date ? moment(coach.class_date_range.end_date).format("YYYY-MM-DD") : null ,
            },
            "registerDateRange": {
              "startDate": coach.register_date_range.start_date && coach.register_date_range.start_date !== "-" ?  moment(coach.register_date_range.start_date).format("YYYY-MM-DD") : null,
              "endDate": coach.register_date_range.end_date && coach.register_date_range.end_date !== "-" ? moment(coach.register_date_range.end_date).format("YYYY-MM-DD") : null,
            },
            "period": {
              "startTime":  coach.period.start_time ?  moment(coach.period.start_time).format('HH:mm') : null,
              "endTime":  coach.period.end_time ?  moment(coach.period.end_time).format('HH:mm') :null
            }
          })
          let teach_day_data = []
          coach.teach_day_data.forEach((date, date_index)=>{
            let class_date = []
            let time_id = ""
            if( course_data.days_of_class.filter((v)=> v.course_coach_id[0] === date.course_coach_id).length > 0){
              course_data.days_of_class.filter((v)=> v.course_coach_id[0] === date.course_coach_id).forEach((day)=>{
                if(teach_day_data.filter((v)=> v.dayOfWeekId === day.times[0].dayOfWeekId && v.courseCoachId === date.course_coach_id).length === 0){
                  time_id = day.times[0].timeId
                  teach_day_data.push({
                    "dayOfWeekId": day.times[0].dayOfWeekId,
                    "classOpen": date.classOpen === true ? 'Active' : 'InActive',
                    "teachDay": date.teach_day,
                    "courseCoachId": date.course_coach_id,
                    "classDate": []
                  })
                }
              })
            }else{
                teach_day_data.push({
                  "dayOfWeekId": null,
                  "classOpen": date.classOpen === true ? 'Active' : 'InActive',
                  "teachDay": date.teach_day,
                  "courseCoachId": date.course_coach_id ? date.course_coach_id : null,
                  "classDate": []
                })
            }
            date.class_date.forEach((class_date_data)=>{
              class_date.push({
                "timeId": time_id,
                "classDateRange": {
                  "startTime": class_date_data.class_date_range.start_time ? moment(class_date_data.class_date_range.start_time).format('HH:mm') : null,
                  "endTime": class_date_data.class_date_range.end_time ? moment(class_date_data.class_date_range.end_time).format('HH:mm') : null,
                },
                "students": class_date_data.students
              })
            })
            teach_day_data[date_index].classDate = class_date
          })
          payload.coachs[index].teachDayData = teach_day_data
        })
        // console.log("payload : ",payload)
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            'Authorization': `Bearer ${VueCookie.get("token")}`
          }
        }
        // console.log(course_data)
        const data_payload = new FormData()
        data_payload.append("payload", JSON.stringify(payload))
        // console.log(typeof course_data.courseImg);
        if (typeof course_data.courseImg == Object) {
          data_payload.append("img_url", course_data.courseImg)
          // data_payload.append("img_url", null)
        }

        console.log("endpoint :", `${process.env.VUE_APP_URL}/api/v1/manage/update/${payload.courseId}`)
        // let { data } = await axios.patch(`${process.env.VUE_APP_URL}/api/v1/manage/update/${payload.courseId}`, data_payload, config);
        let { data } = await axios.patch(`${process.env.VUE_APP_URL}/api/v1/manage/aaaa/${payload.courseId}`, data_payload, config);
        if (data.statusCode === 200) {

          // context.commit("ChangeDataUpdate")
          context.commit("SetCourseIsLoading", false)
          Swal.fire({
            icon: "success",
            title: "แก้ไขคอร์สสำเร็จ",
            showDenyButton: false,
            showCancelButton: false,
            confirmButtonText: "ตกลง",
          }).then(async (result) => {
            if (result.isConfirmed) {
              router.push({ name: "CourseList" })
            }
          })

        }
        // console.log(data)
      } catch (error) {
        console.log(error)
      }

      // router.push({ name: "CourseList" })


      //   } else if (result.isDenied) {
      //     Swal.fire('Changes are not saved', '', 'info')
      //   }
      // })

    },
    // COURSE :: LIST 
    async GetCoursesList(context,) {
      try {
        let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/course/list?limit=1000&page=1`)
        let courses = []
        let category = {}
        if( data.statusCode === 200){
          for await(const course of data.data){
            category = await axios.get(`${process.env.VUE_APP_URL}/api/v1/category/${course.c_category_id}`)
            if (category.data.statusCode === 200) {
              courses.push({
                course_id: course.c_course_id,
                category_id: course.c_category_id,
                category: category.data.data.categoryNameTh ? category.data.data.categoryNameTh : "-",
                course_type: course.c_course_type_id === "CT_1" ? "คอร์สทั่วไป" : "คอร์สระยะสั้น",
                course_type_id: course.c_course_type_id,
                course: `${course.c_course_name_th}(${course.c_course_name_en})`,
                status: course.c_course_status,
                isTruncated : true,
                course_open: course.c_course_open_date ? new Date(course.c_course_open_date).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric', }) : `${new Date(course.c_course_register_start_date).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric', })} - ${new Date(course.c_course_register_end_date).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric', })}`
              })
            }else{
              if(category.data.statusCode === 400 && category.data.message === "Category not found."){
                continue
              }
              // throw {error : category}
            }
          }
          context.commit("SetCourses", courses)
        } 
      } catch (error) {
        console.log(error)
      }
    },
    // COURSE :: STUDENT
    async GetCourseStudent(context, {course_id, cpo_id}){
      try{
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            'Authorization': `Bearer ${VueCookie.get("token")}`
          }
        }
        // let localhost = "http://localhost:3002"
        if(cpo_id){
          let {data} = await axios.get(`${process.env.VUE_APP_URL}/api/v1/order/count/student?courseId=${course_id}&cpoId=${cpo_id}`,config)
          console.log("GetCourseStudent => ",data)
          context.commit("SetCourseStudent",data.data)
        }else{
          let {data} = await axios.get(`${process.env.VUE_APP_URL}/api/v1/order/count/student?courseId=${course_id}`,config)
          console.log("GetCourseStudent => ",data)
          context.commit("SetCourseStudent",data.data)
        }
        
      }catch(error){
        console.log(error)
      }
    },
    //COURSE :: Artwork
    async GetArtworkByCourse(context,{course_id}){
      try{
        let {data} = await axios.get(`${process.env.VUE_APP_URL}/api/v1/course/attcahment/${course_id}`)
        if(data.statusCode === 200){
          console.log(data.data)
          if(data.data.length > 0){
            for(const artwork of data.data ){
              artwork.attachmentUrl = artwork.attachmentCourse ? `${process.env.VUE_APP_URL}/api/v1/files/${artwork.attachmentCourse}` : null
            }
          }
          context.commit("SetCourseArtwork",data.data)
          console.log(data)
        }else{
          throw {error : data}
        }
      }catch(error){
        console.log(error)
      }
    },
    // COURSE :: DETAIL
    async GetCourse(context, course_id) {
      context.commit("SetCourseIsLoading", true)
      // console.log("GetCourse")
      try {
        // let localhost = "http://localhost:3000"
        let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/course/detail/${course_id}`)
        // console.log("GetCourse => ",data.data)
        
        if (data.statusCode === 200) {
          let payload = {
            course_img_privilege : data.data.courseImgPrivilege ? `${process.env.VUE_APP_URL}/api/v1/files/${data.data.courseImgPrivilege}` : null,
            course_id: data.data.courseId,
            course_type_id: data.data.courseTypeId,
            course_type: data.data.courseTypeName,
            course_name_th: data.data.courseNameTh,
            course_name_en: data.data.courseNameEn,
            course_img: data.data.courseImg ? `${process.env.VUE_APP_URL}/api/v1/files/${data.data.courseImg}` : "",
            category_id: data.data.categoryId,
            category_name_th: data.data.categoryNameTh,
            course_open_date: data.data.courseOpenDate ? moment(data.data.courseOpenDate).format("YYYY-MM-DD") : "",
            course_open_date_str: data.data.courseOpenDate ? new Date(data.data.courseOpenDate).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric', }) : "",
            menu_course_open_date: false,
            course_hours: data.data.coursePerTime,
            location: data.data.courseLocation,
            detail: data.data.courseDescription,
            music_performance: data.data.courseMusicPerformance,
            catification: data.data.courseCertification,
            price_course: data.data.coursePrice,
            course_register_start_date: data.data.courseRegisterStartDate? moment(data.data.courseRegisterStartDate).format("YYYY-MM-DD") : null,
            course_register_end_date: data.data.courseRegisterEndDate ? moment(data.data.courseRegisterEndDate).format("YYYY-MM-DD") : null,
            course_period_start_date: data.data.coursePeriodStartDate ? data.data.coursePeriodStartDate : null,
            course_period_end_date: data.data.coursePeriodEndDate ? data.data.coursePeriodEndDate : null,
            course_per_time: data.data.coursePerTime,
            student_recived: data.data.courseStudentRecived,
            course_study_end_date: data.data.courseStudyEndDate,
            course_study_start_date: data.data.courseStudyStartDate,
            coachs: [],
            packages: [],
            privilege_file: null,
            artwork_file : [],
            days_of_class: [],
            days : []
          }
          let teach_day_data = []
          for await (let coach of data.data.coachs){
            // console.log("payload 1054",payload)
            for await (let coach_date of data.data.dayOfWeek.filter(v => v.courseCoachId === coach.courseCoachId)){
              // DAY OF CLASS
              if(payload.days_of_class.filter(v => v.day_of_week_id === coach_date.times[0].dayOfWeekId).length === 0){
               
                let dayName = dayOfWeekArray(coach_date.dayOfWeekName)
                payload.days_of_class.push({
                  day_of_week_id :coach_date.times[0].dayOfWeekId,  
                  course_coach_id: [coach_date.courseCoachId],
                  day: coach_date.dayOfWeekName,
                  dayName : dayName,
                  times: coach_date.times,
                })
              }
              let class_dates = []
              for await (const time of coach_date.times) {
                
                // console.log(time.start, time.end)
                let startTimePart = time.start.split(":")
                let endTimePart = time.end.split(":")
                let startTime = {
                  "HH": startTimePart[0],
                  "mm": startTimePart[1] ? startTimePart[1] : "00"
                }
                let endTime = {
                  "HH": endTimePart[0],
                  "mm": endTimePart[1]? endTimePart[1] : "00"
                }
                class_dates.push({
                  class_date_range: {
                    time_id : time.timeId ? time.timeId : null,
                    day_of_week_id :time.dayOfWeekId ? time.dayOfWeekId : null,  
                    start_time: time.start,
                    start_time_object : time.start ? startTime : null,
                    menu_start_time: false,
                    end_time: time.end ,
                    end_time_object : time.end ? endTime : null,
                    menu_end_time: false,
                  },
                  students: time.maximumStudent,
                },)
              }
              // console.log("payload => 1232", payload)
              // TEACH DAY
              teach_day_data.push({
                day_of_week_id :coach_date.times[0].dayOfWeekId ? coach_date.times[0].dayOfWeekId : null,
                class_open: coach_date.status === 'Active' ? true : false,
                teach_day: coach_date.dayOfWeekName.map(v => parseInt(v)),
                course_coach_id: coach_date.courseCoachId,
                class_date: class_dates,
              })
            }
            let startTimePart =  data.data.coursePeriodStartDate?  data.data.coursePeriodStartDate.split(":") : null
            let endTimePart =  data.data.coursePeriodStartDate? data.data.coursePeriodEndDate.split(":") : null
            let startTime = startTimePart ? {
              "HH": startTimePart[0],
              "mm": startTimePart[1] ? startTimePart[1] : "00"
            } : null
            let endTime = endTimePart ? {
              "HH": endTimePart[0],
              "mm": endTimePart[1]? endTimePart[1] : "00"
            } : null
            // console.log("payload => 1249", payload)
            payload.coachs.push(
                {
                  coach_id: coach.accountId,
                  course_coach_id: coach.courseCoachId,
                  coach_name: `${coach.coachFirstNameTh} ${coach.coachLastNameTh}`,
                  teach_day_data: [],
                  teach_days_used: [],
                  class_date_range: {
                    start_date: data.data.courseStudyStartDate ? moment(data.data.courseStudyStartDate).format("YYYY-MM-DD") : null,
                    menu_start_date: false,
                    end_date: data.data.courseStudyStartDate ? moment(data.data.courseStudyEndDate).format("YYYY-MM-DD") : null,
                    menu_end_date: false,
                  },
                  class_date_range_str: {
                    start_date: data.data.courseStudyStartDate ? new Date(data.data.courseStudyStartDate).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric', }) : null,
                    end_date: data.data.courseStudyStartDate ? new Date(data.data.courseStudyEndDate).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric', }) : null,
                  },
                  register_date_range: {
                    start_date: data.data.courseRegisterStartDate ? moment(data.data.courseRegisterStartDate).format("YYYY-MM-DD") : null,
                    menu_start_date: false,
                    end_date: data.data.courseRegisterStartDate ? moment(data.data.courseRegisterEndDate).format("YYYY-MM-DD") : null,
                    menu_end_date: false,
                  },
                  register_date_range_str: {
                    start_date: data.data.courseRegisterEndDate ? new Date(data.data.courseRegisterStartDate).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric', }) : "",
                    end_date: data.data.courseRegisterEndDate ? new Date(data.data.courseRegisterEndDate).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric', }) : "",
                  },
                  period: {
                    start_time: data.data.coursePeriodStartDate ? data.data.coursePeriodStartDate : null,
                    start_time_object : data.data.coursePeriodStartDate ? startTime : null,
                    end_time: data.data.coursePeriodEndDate ? data.data.coursePeriodEndDate : null,
                    end_time_object :data.data.coursePeriodEndDate ? endTime : null,
                  },
                },
            )
            // console.log("payload 1120",payload)
          }
          // console.log("payload 1122",payload)
          // console.log("teach_day_data",teach_day_data)
          for(let coach_date of data.data.dayOfWeek.filter(v => v.status === 'Active')){
            // console.log(coach_date)
            // DAYS
            let dayName = dayOfWeekArray(coach_date.dayOfWeekName)
            // console.log("payload 1127",payload.days.filter(v => v.dayName === dayName).length === 0)
            if(payload.days.filter(v => v.dayName === dayName).length === 0){
              // console.log("payload 1129",coach_date.times)
              let times = []
              for await (let time of coach_date.times){
                // console.log("payload 1132",time)
                if(times.filter(v => v.start ===  time.start && v.end ===  time.end).length === 0){
                  times.push({
                    start : time.start,
                    end : time.end,
                    timeData : []
                  })
                  for await (let t of times){
                    // console.log("payload 1140", t.courseCoachId !== coach_date.courseCoachId)
                    if(t.timeData.filter(v => v.courseCoachId == coach_date.courseCoachId).length === 0){
                      t.timeData.push({
                        maximumStudent: time.maximumStudent,
                        dayOfWeekId: time.dayOfWeekId,
                        timeId:  time.timeId,
                        courseCoachId: coach_date.courseCoachId,
                        coach_name : data.data.coachs.filter(v=>v.courseCoachId === coach_date.courseCoachId)[0].coachFirstNameTh +" "+data.data.coachs.filter(v=>v.courseCoachId === coach_date.courseCoachId)[0].coachLastNameTh,
                        coach_id : data.data.coachs.filter(v=>v.courseCoachId === coach_date.courseCoachId)[0].accountId
                     })
                    }
                    // console.log("payload 1151", t)
                  }
                }
              }
              // console.log("payload 1147", times)
              payload.days.push({
                day: coach_date.dayOfWeekName,
                dayName : dayName,
                times: times,
              }) 
            
            }else{
              for await (let day of payload.days.filter(v => v.dayName === dayName)){
                for (let time of coach_date.times){
                  // console.log("payload 1160", time.start,time.end)
                  if (day.times.filter(v => v.start == time.start && v.end == time.end).length > 0){
                    for await (let day_time of day.times.filter(v => v.start == time.start && v.end == time.end)){
                      // console.log("payload 1163",day_time.timeData)
                      // console.log("payload 1164",coach_date.courseCoachId)
                      if(day_time.timeData.filter(v => v.courseCoachId === coach_date.courseCoachId ).length === 0){
                        day_time.timeData.push(
                          {
                            maximumStudent: time.maximumStudent,
                            dayOfWeekId: time.dayOfWeekId,
                            timeId:  time.timeId,
                            courseCoachId: coach_date.courseCoachId,
                            coach_name : data.data.coachs.filter(v=>v.courseCoachId === coach_date.courseCoachId)[0].coachFirstNameTh +" "+data.data.coachs.filter(v=>v.courseCoachId === coach_date.courseCoachId)[0].coachLastNameTh,
                            coach_id : data.data.coachs.filter(v=>v.courseCoachId === coach_date.courseCoachId)[0].accountId
                          }
                        )
                      }
                      // console.log("payload 1179", day.times) 
                    }
                  }else{
                    let times = []
                    for await (let time of coach_date.times){
                      times.push({
                        start : time.start,
                        end : time.end,
                        timeData : []
                      })
                      for await (let t of times){
                        t.timeData.push({
                          maximumStudent: time.maximumStudent,
                          dayOfWeekId: time.dayOfWeekId,
                          timeId:  time.timeId,
                          courseCoachId: coach_date.courseCoachId, 
                          coach_name : data.data.coachs.filter(v=>v.courseCoachId === coach_date.courseCoachId)[0].coachFirstNameTh +" "+data.data.coachs.filter(v=>v.courseCoachId === coach_date.courseCoachId)[0].coachLastNameTh,
                          coach_id : data.data.coachs.filter(v=>v.courseCoachId === coach_date.courseCoachId)[0].accountId
                        })
                      }
                    }
                    day.times.push(...times)
                  }
                }
              }
            }
          }
          for await (let coach of payload.coachs){
            coach.teach_day_data = teach_day_data.filter(v => v.course_coach_id === coach.course_coach_id)
          }
          if (data.data.courseTypeId === "CT_1") {
            let options = []
            data.data.coursePackageOption.forEach((package_data) => {
              if (payload.packages.filter(v => v.package_id === package_data.packageId).length === 0) {
                payload.packages.push({
                  course_package_option_id: package_data.coursePackageOptionId,
                  package_id: package_data.packageId,
                  package: package_data.packageName,
                  students: package_data.studentNumber,
                  options: [],
                })
              }
              options.push({
                course_package_option_id: package_data.coursePackageOptionId,
                package_id: package_data.packageId,
                option_id: package_data.optionId,
                option_name: package_data.optionName,
                period_package: package_data.optionId,
                amount: package_data.hourPerTime,
                price_unit: package_data.pricePerPerson,
                discount: package_data.discountStatus == '1' ? true : false,
                discount_price: package_data.discountPrice ? package_data.discountPrice : 0,
                privilege: package_data.optionDescription,
                total_price: package_data.pricePerPerson,
                net_price: package_data.pricePerPerson - (package_data.discountPrice ? package_data.discountPrice : 0),
                net_price_unit: (package_data.pricePerPerson - (package_data.discountPrice ? package_data.discountPrice : 0)) / package_data.hourPerTime,
              })
            })
            for(let package_data of payload.packages){
              package_data.options = options.filter(v => v.package_id === package_data.package_id)
            }
          }
          let config = {
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-type": "Application/json",
              'Authorization': `Bearer ${VueCookie.get("token")}`
            }
          }
          if(payload.course_type_id === "CT_1"){
            console.log("payload :",payload)
            await context.commit("SetCourseData", payload)
          }else{
            // console.log("payload :",payload)
            // let localhost = "http://localhost:3002"
            let {data} = await axios.get(`${process.env.VUE_APP_URL}/api/v1/order/count/student?courseId=${course_id}`,config)
              // console.log("GetCourseStudent => ",data)
              if(data.statusCode === 200){
                for(const student_data of data.data){
                  payload.course_studant_amount = parseInt(student_data.sum_student)
                  payload.student_course_data = student_data
                }
                await context.commit("SetCourseData", payload)
              }
          }
          await context.commit("SetCourseIsLoading", false)
        }
      } catch (error) {
        context.commit("SetCourseIsLoading", false)
        // console.log(error)
      }
    },
    // COURSE :: CREATE
    async CreateCourse(context) { 
      context.commit("SetCourseIsLoading", true)
      try {
        let course = context.state.course_data
        console.log("course =>", course)
        let payload = {
          "categoryId": course.category_id,
          "courseTypeId": course.course_type_id,
          "courseImg": "",
          "courseNameTh": course.course_name_th,
          "courseNameEn": course.course_name_en,
          "courseOpenDate": course.course_open_date,
          "coursePerTime": course.course_hours,
          "startDate" : course.start_date,
          "courseStudentRecived": course.student_recived,
          "courseLocation": course.location,
          "courseDescription": course.detail,
          "courseMusicPerformance": course.music_performance,
          "courseCertification": course.catification,
          "coursePrice": course.price_course,
          "coachs": [],
          "dayOfweek": [],
          "coursePackages": []
        }
        course.coachs.forEach((coach) => {
          // Short Course
          payload.coachs.push({
            "accountId": coach.coach_id,
            "registerDateRange": {
              "courseRegisterStartDate": coach.register_date_range.start_date,
              "courseRegisterEndDate": coach.register_date_range.end_date,
            },
            "classDateRange": {
              "courseStudyStartDate": coach.class_date_range.start_date,
              "courseStudyEndDate": coach.class_date_range.end_date,
            },
            "period": {
              "coursePeriodStartDate": coach.period.start_time ? coach.period.start_time : '',
              "coursePeriodEndDate": coach.period.end_time ? coach.period.end_time : '',
            }
          })
          // Day Of Week
          coach.teach_day_data.forEach((teach_day) => {
            let times = []
            teach_day.class_date.forEach((date) => {
              if (course.course_type_id === "CT_1") {
                times.push({
                  "start":date.class_date_range.start_time,
                  "end": date.class_date_range.end_time,
                  "maximumStudent": date.students
                })
              } else {
                times.push({
                  "start": coach.period.start_time,
                  "end": coach.period.end_time,
                  "maximumStudent": course.student_recived
                })
              }

            })
            payload.dayOfweek.push({
              "accountId": coach.coach_id,
              "status": teach_day.class_open ? 'Active' : 'InActive',
              "day": teach_day.teach_day,
              "times": times
            })
          })
        })
        if (course.course_type_id === "CT_1") {
          course.packages.forEach((package_course) => {
            package_course.options.forEach((option) => {
              payload.coursePackages.push({
                "packageId": package_course.package_id,
                "optionId": option.period_package,
                "hourPerTime": option.amount,
                "optionDescription": option.privilege,
                "discountStatus": option.discount,
                "discountPrice": option.discount_price,
                "pricePerPerson": option.price_unit,
                "studentNumber": package_course.students
              })
            })
          })
        }
        const data_payload = new FormData()
        data_payload.append("payload", JSON.stringify(payload))
        data_payload.append("img_url", course.course_img)
        data_payload.append("img_privilage",course.privilege_file)
        if(course.artwork_file){
          for(let i = 0;i < course.artwork_file.length; i++){
            data_payload.append(`artwork_file${i}`, course.artwork_file[i]);
          }         
        }      
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            'Authorization': `Bearer ${VueCookie.get("token")}`
          }
        }
        let { data } = await axios.post(process.env.VUE_APP_URL + "/api/v1/course/create", data_payload, config)
        if (data.statusCode === 201) {
          context.commit("SetCourseIsLoading", false)
          Swal.fire({
            icon: "success",
            title: "สร้างคอร์สสำเร็จ"
          }).then((result) => {
            if (result.isConfirmed) {
              router.replace({ name: "CourseList" })
            }
          })

        } else {
          context.commit("SetCourseIsLoading", false)
          throw { message: data }
        }
      } catch (error) {
        context.commit("SetCourseIsLoading", false)
        console.log(error)
      }
    },
    // COURSE :: FILTER
    async GetCoursesFilter(context, { category_id, status, course_type_id }) {
      context.commit("SetCoursesIsLoading", true)
      try {
        if (status) {
          status = "Active"
        }
        if (!course_type_id) {
          course_type_id = 'CT_1'
        }
        let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/course/filter?category_id=${category_id}&status=${status}&course_type_id=${course_type_id}`)
        if (data.statusCode === 200) {
          for (const course of data.data) {
            let course_studant_amount = 0
            course.student_course_data = []
            course.show = false
            course.course_url = course.course_img ? `${process.env.VUE_APP_URL}/api/v1/files/${course.course_img}` : ""
            let {data} = await axios.get(`${process.env.VUE_APP_URL}/api/v1/order/count/student?courseId=${course.course_id}`)
            if(data.statusCode === 200){
              for(const student_data of data.data){
                // console.log("GetCourseStudent => ",student_data)
                  course_studant_amount = course_studant_amount + parseInt(student_data.sum_student)
                  course.student_course_data.push({student_data})
                }
              let endpoint = process.env.VUE_APP_URL
              let potential =await axios.get(`${endpoint}/api/v1/coachmanagement/course/potential/${course.course_id}`)
              if(potential.data.statusCode === 200){
                if(potential.data.data?.course_id){
                  course.course_studant_amount = course_studant_amount - potential.data.data.sum_student
                }else{
                  course.course_studant_amount = course_studant_amount
                }
              }else{
                course.course_studant_amount = course_studant_amount
              }
            }
           
          }
          context.commit("SetCoursesIsLoading", false)
          context.commit("SetCourses", data.data)
        } else {
          context.commit("SetCoursesIsLoading", false)
          throw { message: data.message }
        }
      } catch (error) {
        context.commit("SetCoursesIsLoading", false)
        console.log(error)
      }

    },
    // COURSE :: POTENTIAL
    async GetPotential(context, {course_id}){
      try{
       let endpoint = `${process.env.VUE_APP_URL}/api/v1/coachmanagement/course/potential/${course_id}`
      //  let endpoint = `http://localhost:3000/api/v1/coachmanagement/course/potential/${course_id}`
       let {data} =await axios.get(endpoint)
       if(data.statusCode === 200){
        context.commit("SetCoursePotential",data.data)
       }
      }catch(error){
        console.log(error)
      }
    },
    // COURSE :: Delete Day Of Week
    async DeleteDayOfWeek(context, {day_of_week_id}){
      try{
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            'Authorization': `Bearer ${VueCookie.get("token")}`
          }
        }
        let {data} = await axios.delete(`${process.env.VUE_APP_URL}/api/v1/manage/dayOfWeek/${day_of_week_id}`,config)
        console.log(data)
        if(data.statusCode === 200){
          if(data.data[0] === "Delete Unsuccessfully:"){
            Swal.fire({
              icon : "error",
              text : "ไม่สามารถลบได้ เนื่องจากที่การสมัครเรียนแล้ว",
              confirmButtonText: "ตกลง",
            })
          }else{
            Swal.fire({
              icon : "success",
              text : "ลบวันสอนสำเร็จ",
              confirmButtonText: "ตกลง",
            })
          }
        }
      }catch(error){
        console.log(error)
      }
    },
     // COURSE :: Delete Time
     async DeleteTime(context, {time_id}){
      try{
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            'Authorization': `Bearer ${VueCookie.get("token")}`
          }
        }
        let {data} = await axios.delete(`${process.env.VUE_APP_URL}/api/v1/manage/time/${time_id}`, config)
        console.log(data.data)
        if(data.statusCode === 200){
          if(data.data[0] === "Delete Unsuccessfully:"){
            Swal.fire({
              icon : "error",
              text : "ไม่สามารถลบได้ เนื่องจากที่การสมัครเรียนแล้ว",
              confirmButtonText: "ตกลง",
            })
          }else{
            Swal.fire({
              icon : "success",
              text : "ลบเวลาสอนสำเร็จ",
              confirmButtonText: "ตกลง",
            })
          }
        }
      }catch(error){
        console.log(error)
      }
    },
    async GetPackages(context) {
      try {

        let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/course/package`)
        if (data.statusCode === 200) {
          context.commit("SetPackages", data.data)
        } else {
          throw { message: data.message }
        }
      } catch (error) {
        console.log(error)
      }
    },
    async GetOptions(context) {
      try {
        let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/course/option`)
        if (data.statusCode === 200) {
          context.commit("SetOptions", data.data)
        } else {
          throw { message: data.message }
        }
      } catch (error) {
        console.log(error)
      }
    },
    ResetCourseData(context) {
      context.commit("ResetCourse")
    },
    // UPDATE STATUS COURSE
    async UpdateStatusCourse(context, { courseId, courseStatus }) {
      try {
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            'Authorization': `Bearer ${VueCookie.get("token")}`
          }
        }
        let { data } = await axios.patch(`${process.env.VUE_APP_URL}/api/v1/manage/toggle-course`, { "courseId": courseId, "courseStatus": courseStatus }, config)

        if (data.statusCode === 200) {
          context.commit("SetStatusCourse", data.data)
          // console.log("SetStatusCourse", data.data);

        } else {
          throw { error: data };
        }
      } catch (error) {
        console.log(error);
      }

    }
  },
  getters: {
    getStudentPotentialListIsLoading(state){
      return state.student_potential_list_is_loading 
    },
    getStudentPotentialList(state){
      return state.student_potential_list 
    },
    getStudentReserveList(state){
      return state.student_reserve_list
    },
    getStudentListIsLoading(state){
      return state.stident_list_is_loading
    },
    getStudentList(state){
      return state.student_list
    },
    getCoachList(state){
      return state.coach_list
    },
    getCoachListIsLoading(state){
      return state.coach_list_is_loading
    },
    getCourseArtwork(state){
      return state.course_artwork
    },
    getCourseStudent(state){
      return state.course_student
    },
    getCourseTypes(state) {
      return state.course_types
    },
    getCourseData(state) {
      return state.course_data
    },
    getPackages(state) {
      return state.packages_data
    },
    getOptions(state) {
      return state.options_data
    },
    getCoachs(state) {
      return state.coachs
    },
    getTeachDays(state) {
      return state.teach_days
    },
    getCourses(state) {
      return state.courses
    },
    getCoursesIsLoading(state) {
      return state.courses_is_loading
    },
    getCourseIsLoading(state) {
      return state.course_is_loading
    },
    getStatusCourse(state) {
      return state.update_status_course
    },
    getCourseTypeIsLoading(state){
      return state.course_type_is_loading
    },
    getCoursePotential(state){
      return state.course_potential
    }
  },
};

export default CourseModules;

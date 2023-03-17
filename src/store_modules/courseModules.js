import axios from "axios";
import moment from "moment";
const CourseModules = {
  namespaced: true,
  state: {
    course_types : [],
    courses_is_loading : false,
    course_data: {
      course_id : "",
      type: "general_course",
      course_name_th: "",
      course_name_en: "",
      course_img : "",
      category_id : "",
      kingdom_name: "",
      course_open_date: "",
      course_hours: 1,
      location: "",
      detail: "",
      music_performance: "",
      catification: "",
      price_course : 0,
      student_ecived : 0,
      coachs: [
        { 
          coach_id : "",
          coach_name: "",
          teach_days_used : [],
          teach_day_data: [
            {
              class_open: true,
              teach_day: [],
              class_date: [
                {
                  class_date_range: {
                    start_time: "",
                    menu_start_time: false,
                    end_time: "",
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
            end_time: "",
          },
        },
      ],
      packages: [
        {
          package_id : "",
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
    courses :[],
    packages_data : [],
    options_data: [],
    coachs :[],
    teach_days : [],
  },
  mutations: {
    SetTeachDays(state, payload){
      state.teach_days = payload
    },
    SetCoachs(state, payload){
      state.coachs = payload
    },
    SetPackages(state, payload){
      state.packages_data = payload
    },
    SetOptions(state, payload){
      state.options_data = payload
    },
    SetCourses(state, payload){
      state.courses = payload
    },
    SetCourseData(state, payload){
      state.course_data = payload
    },
    SetCoursesIsLoading(state, payload){
      state.courses_is_loading = payload
    },
    SetCourseTypes(state, payload){
      state.course_types = payload
    }
  },
  actions: {
    // COURSE TYPES 
    async GetCourseTypes(context,{category_id}){
      try{
        console.log("category_id :",category_id)
        let {data} = await axios.get(`${process.env.VUE_APP_URL}/api/v1/course/type?category_id=${category_id}`)
        if(data.statusCode === 200){
          console.log("SetCourseTypes", data.data)
          context.commit("SetCourseTypes",data.data)
        }
      }catch(error){
        console.log(error)
      }
    },
    // TEACH DAYS
    async GetTeachDays(context,coach_data){
      try{
        let {data} = await axios.get(`${process.env.VUE_APP_URL}/api/v1/account/coach/${coach_data.coach_id}`)
        if(data.statusCode === 200){
          console.log(data)
          context.commit("SetTeachDays",data.data)
        }else{
          throw {message : data.message}
        }
      }catch(error){
        console.log(error)
      }
    },
    // COACH :: LIST
    async GetCoachs(context){
      try{
        let {data} = await axios.get(`${process.env.VUE_APP_URL}/api/v1/account/role/R_3`)
        if(data.statusCode === 200){
          data.data.forEach(( coach )=>{
            coach.fullNameTh = `${coach.firstNameTh} ${coach.lastNameTh}`
            coach.fullNameEh = `${coach.firstNameEng} ${coach.lastNameEng}`
          })
          console.log(data)
          context.commit("SetCoachs",data.data)
        }else{
          console.log(data)
          //throw {message : data.message}
        }
      }catch (error){
        console.log(error)
      }
    },
    ChangeCourseData(context, course_data){
      console.log("CourseData : ",course_data)
      context.commit("SetCourseData",course_data)
    },
    // COURSE :: LIST 
    async GetCoursesList(context,){
      try{
        let {data} = await axios.get(`${process.env.VUE_APP_URL}/api/v1/course/list?limit=10&page=1`)
        let courses = []
        await data.data.forEach((course)=>{
          courses.push({
            course_id : course.c_course_id,
            category_id : course.c_category_id,
            category : "ยังไม่ได้",
            course : `${course.c_course_name_th}(${course.c_course_name_en})`,
            status : course.c_course_status,
            course_open : course.c_course_open_date ? course.c_course_open_date : "-"
          })
        })
        context.commit("SetCourses",courses)
      }catch(error){
        console.log(error)
      }
    },
    // COURSE :: DETAIL
    async GetCourse(context, course_id){
      console.log("GetCourse")
      try{
          let {data} = await axios.get(`${process.env.VUE_APP_URL}/api/v1/course/detail/${course_id}`)
          console.log(data.data)
         
          let payload = {
            course_id : data.data.courseId,
            course_type_id : data.data.courseTypeId,
            type:  data.data.courseTypeName,
            course_name_th: data.data.courseNameTh,
            course_name_en:  data.data.courseNameEn,
            course_img : data.data.courseImg,
            category_id :  data.data.categoryId,
            category_name_th: data.data.categoryNameTh,
            course_open_date: data.data.courseOpenDate,
            course_hours: data.data.coursePerTime,
            location: data.data.courseLocation,
            detail: data.data.courseDescription,
            music_performance: data.data.courseMusicPerformance,
            catification: data.data.courseCertification,
            price_course : data.data.coursePrice,
            coachs: [],
            packages: [],
            days_of_class : []
          }
          if(data.statusCode === 200){
            if(data.data.courseTypeId === "CT_1"){
              let teach_day_data = []
              data.data.coachs.forEach((coach)=>{
                data.data.dayOfWeek.filter(v => v.courseCoachId === coach.courseCoachId).forEach((coach_date)=>{
                  // DAY OF CLASS
                  coach_date.dayOfWeekName.forEach(day => {
                    if(coach_date.status === 'Active'){
                      if(payload.days_of_class.filter(v => v.day === day).length > 0){
                        coach_date.times.forEach(time => {
                          if(payload.days_of_class.filter(v => v.day === day)[0].times.filter(v => v.timeId === time.timeId).length === 0){
                            payload.days_of_class.filter(v => v.day === day)[0].times.push(time)
                          }
                          if(payload.days_of_class.filter(v => v.day === day)[0].course_coach_id.filter(v => v === coach.courseCoachId).length === 0){
                            payload.days_of_class.filter(v => v.day === day)[0].course_coach_id.push(coach_date.courseCoachId)
                          }
                        })
                      }else{
                        payload.days_of_class.push({
                          course_coach_id : [coach_date.courseCoachId],
                          day : day,
                          times : coach_date.times,
                        })
                      }
                    }
                  })
                  // TEACH DAY
                  teach_day_data.push( {
                    class_open: coach_date.status === 'Active' ? true : false,
                    teach_day: [coach_date.dayOfWeekName],
                    course_coach_id : coach_date.courseCoachId,
                    class_date: coach_date.times,
                  })
                })
                payload.coachs.push(
                  { 
                    coach_id : coach.accountId,
                    course_coach_id : coach.courseCoachId,
                    coach_name: `${coach.coachFirstNameTh} ${coach.coachLastNameTh}`,
                    teach_day_data: [],
                    class_date_range: {
                      start_date: data.data.courseStudyStartDate,
                      menu_start_date: false,
                      end_date:  data.data.courseStudyEndDate,
                      menu_end_date: false,
                    },
                    register_date_range: {
                      start_date:  data.data.courseRegisterStartDate,
                      menu_start_date: false,
                      end_date:  data.data.courseRegisterEndDate,
                      menu_end_date: false,
                    },
                    period: {
                      start_time:  data.data.coursePeriodEndDate,
                      end_time:  data.data.coursePeriodStartDate,
                    },
                  },
                )
              })
              payload.coachs.forEach((coach)=>{
                coach.teach_day_data = teach_day_data.filter(v => v.course_coach_id === coach.course_coach_id)
              })
              let options = []
              data.data.coursePackageOption.forEach((package_data)=>{
                if( payload.packages.filter(v => v.package_id === package_data.packageId ).length === 0){
                  payload.packages.push({
                    package_id : package_data.packageId,
                    package: package_data.packageName,
                    students: package_data.studentNumber,
                    options:[],
                  })
                }
                options.push({
                  course_package_option_id: package_data.coursePackageOptionId,
                  package_id : package_data.packageId, 
                  option_id : package_data.optionId,
                  period_package: package_data.optionName,
                  amount: package_data.hourPerTime,
                  price_unit: package_data.pricePerPerson,
                  discount: package_data.discountStatus == '0' ? true : false,
                  discount_price: package_data.discountPrice ? package_data.discountPrice : 0,
                  privilege: package_data.optionDescription,
                  total_price :  package_data.pricePerPerson  * package_data.hourPerTime,
                  net_price:  package_data.pricePerPerson  * package_data.hourPerTime - (package_data.discountPrice? package_data.discountPrice : 0) ,
                  net_price_unit: (package_data.pricePerPerson  * package_data.hourPerTime - (package_data.discountPrice? package_data.discountPrice : 0 ))/ package_data.hourPerTime,
                })
              })
              payload.packages.forEach((package_data)=>{
                package_data.options = options.filter(v=>v.package_id === package_data.package_id)
              })
            }
            console.log(payload)
            context.commit("SetCourseData",payload)
          }
      }catch(error){
        console.log(error)
      }
    },
    // COURSE :: CREATE
    async CreateCourse(context){
      try{
        let course = context.state.course_data
        let payload = {
            "categoryId": course.category_id,
            "courseTypeId": course.type === 'general_course' ? 'CT_1' : 'CT_2',
            "courseImg": course.course_img,
            "courseNameTh": course.course_name_th,
            "courseNameEn": course.course_name_en,
            "courseOpenDate":course.course_open_date,
            "coursePerTime": course.course_hours,
            "courseStudentRecived": course.student_ecived,
            "courseLocation": course.location,
            "courseDescription": course.detail,
            "courseMusic_performance":course.music_performance ,
            "courseCertification":course.catification,
            "coursePrice": course.price_course,
            "coachs":  [],
            "dayOfweek": [],
            "coursePackages": []
        }
        course.coachs.forEach((coach)=>{
          // Short Course
            payload.coachs.push({
              "accountId": coach.coach_id,
              "classDateRange": {
                  "courseRegisterStartDate": coach.class_date_range.start_date,
                  "courseRegisterEndDate": coach.class_date_range.end_date
              },
              "registerDateRange": {
                  "courseStudyStartDate": coach.register_date_range.start_date,
                  "courseStudyEndDate": coach.register_date_range.end_date,
              },
              "period": {
                  "coursePeriodStartDate":coach.period.start_time ? moment(coach.period.start_time).format('HH:mm') : '',
                  "coursePeriodEndDate":coach.period.end_time ? moment(coach.period.end_time).format('HH:mm') : '',              }
            })
            if(course.type === "general_course"){
              // Day Of Week
              coach.teach_day_data.forEach((teach_day)=>{
                let times = []
                teach_day.class_date.forEach((date) => {
                  times.push({
                      "start": moment(date.class_date_range.start_time).format('HH:mm'),
                      "end":  moment(date.class_date_range.end_time).format('HH:mm'),
                      "maximumStudent": date.students
                  })
                })
                payload.dayOfweek.push( {
                  "accountId":  coach.coach_id,
                  "status": teach_day.class_open ? 'Active': 'InActive',
                  "day": teach_day.teach_day,
                  "times": times
                })
              })
            } 
        })
        // Package
        if(course.type === "general_course"){
          course.packages.forEach((package_course)=>{
            package_course.options.forEach((option)=>{
              payload.coursePackages.push({
                "packageId": package_course.package,
                "optionId": option.period_package,
                "hourPerTime": option.amount,
                "optionDescription":option.privilege,
                "discountStatus": option.discount,
                "discountPrice": option.discount_price,
                "pricePerPerson": option.price_unit,
                "studentNumber": package_course.students
              })
            })
          })
        }
        console.log(payload)
        let {data} = await axios.post(process.env.VUE_APP_URL+"/api/v1/course/create", payload)
        if(data.statusCode === 201){
          console.log(data)
         // context.commit("SetCourseData",data.data)
        }else{
          throw {message : data}
        }
      }catch(error){
        console.log(error)
      }
    },
    // COURSE :: FILTER
    async GetCoursesFilter(context,{category_id, status, course_type_id }){
      context.commit("SetCoursesIsLoading", true)
      try{
        if(status){
          status = "Active"
        }
        if(!course_type_id){
          course_type_id = 'CT_1'
        }
        console.log(`category_id :${category_id}, status:${status} course_type_id:${course_type_id}`)
        let {data} = await axios.get(`${process.env.VUE_APP_URL}/api/v1/course/filter?category_id=${category_id}&status=${status}&course_type_id=${course_type_id}`)
        if(data.statusCode === 200){
          console.log(data)
          context.commit("SetCoursesIsLoading", false)
          context.commit("SetCourses",data.data)
        }else{
          context.commit("SetCoursesIsLoading", false)
          throw {message : data.message}
        }
      }catch(error){
        context.commit("SetCoursesIsLoading", false)
        console.log(error)
      }
     
    },
    async GetPackages(context){
      try{
        let {data} = await axios.get(`${process.env.VUE_APP_URL}/api/v1/course/package`)
        console.log("Package :",data.data)
        if(data.statusCode === 200){
          context.commit("SetPackages",data.data)
        }else{
          throw {message : data.message}
        }
      }catch(error){
        console.log(error)
      }
    },
    async GetOptions(context){
      try{
        let {data} = await axios.get(`${process.env.VUE_APP_URL}/api/v1/course/option`)
        console.log("options :",data.data)
        if(data.statusCode === 200){
          context.commit("SetOptions",data.data)
        }else{
          throw {message : data.message}
        }
      }catch(error){
        console.log(error)
      }
    }
  },
  getters: {
    getCourseTypes(state){
      return state.course_types
    },
    getCourseData(state){
      return state.course_data
    },
    getPackages(state){
      return state.packages_data
    },
    getOptions(state){
      return state.options_data
    },
    getCoachs(state){
      return state.coachs
    },
    getTeachDays(state){
      return state.teach_days
    },
    getCourses(state){
      console.log(state.course_data)
      return state.courses
    },
    getCoursesIsLoading(state){
      return state.courses_is_loading
    }
  },
};

export default CourseModules;

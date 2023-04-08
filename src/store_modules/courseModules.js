import axios from "axios";
import moment from "moment";
import Swal from "sweetalert2";
import router from "@/router";
import VueCookie from "vue-cookie"
function snakeToCamel(obj) {
  const camelObj = {};
  for (let key in obj) {
    const camelKey = key.replace(/_([a-z])/g, (match, p1) => p1.toUpperCase());
    camelObj[camelKey] = obj[key];
  }
  return camelObj;
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
  },
  mutations: {
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
      state.course_data = {
        course_id: "",
        course_type_id: "CT_1",
        course_name_th: "",
        course_name_en: "",
        course_img: "",
        category_id: "",
        kingdom_name: "",
        course_open_date: "",
        menu_course_open_date: false,
        course_hours: 1,
        location: "",
        detail: "",
        music_performance: "",
        catification: "",
        price_course: 0,
        student_recived: 0,
        coachs: [
          {
            coach_id: "",
            coach_name: "",
            teach_days_used: [],
            days: [
              { label: "วันอาทิตย์", value: 0 },
              { label: "วันจันทร์", value: 1 },
              { label: "วันอังคาร", value: 2 },
              { label: "วันพุท", value: 3 },
              { label: "วันพฤหัสบดี", value: 4 },
              { label: "วันศุกร์", value: 5 },
              { label: "วันเสาร์", value: 6 },
            ],
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
        console.log("category_id :", category_id)
        let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/course/type?category_id=${category_id}`)
        if (data.statusCode === 200) {
          console.log("SetCourseTypes", data.data)
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
          console.log(data)
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
        let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/account/role/R_3`)
        if (data.statusCode === 200) {
          data.data.forEach((coach) => {
            coach.fullNameTh = `${coach.firstNameTh} ${coach.lastNameTh}`
            coach.fullNameEh = `${coach.firstNameEng} ${coach.lastNameEng}`
          })
          console.log(data)
          context.commit("SetCoachs", data.data)
        } else {
          console.log(data)
          //throw {message : data.message}
        }
      } catch (error) {
        console.log(error)
      }
    },
    ChangeCourseData(context, course_data) {
      console.log("CourseData : ", course_data)
      context.commit("SetCourseData", course_data)
    },
    // COURSE :: UPDATE
    async UpdateCourse(context, { course_data }) {
      // Swal.fire({
      //   icon: "question",
      //   title: "คุณต้องการแก้ไขคอร์สหรือไม่",
      //   showDenyButton: false,
      //   showCancelButton: true,
      //   confirmButtonText: "ตกลง",
      //   cancelButtonText: "ยกเลิก",
      // }).then(async (result) => {
      //   if (result.isConfirmed) {
      //     context.commit("SetCourseIsLoading", true)
      try {
        console.log("course_data", course_data)
        // let config = {
        //   headers: {
        //     "Access-Control-Allow-Origin": "*",
        //     "Content-type": "Application/json",
        //     'Authorization': `Bearer ${VueCookie.get("token")}`
        //   }
        // }
        course_data = snakeToCamel(course_data)
        course_data.coachs.forEach((coach, index) => {
          console.log("coach=>", coach, index);
          course_data.coachs[index] = snakeToCamel(coach)
          // coach.forEach((element) => {

          // });
          // console.log("course_data=>", course_data);
          course_data.coachs[index].classDateRange = snakeToCamel(course_data.coachs[index].classDateRange)
          course_data.coachs[index].period = snakeToCamel(course_data.coachs[index].period)
          course_data.coachs[index].registerDateRange = snakeToCamel(course_data.coachs[index].registerDateRange)
          course_data.coachs[index].teachDayData.forEach((teach_day_data, teach_day_index) => {
            course_data.coachs[index].teachDayData[teach_day_index] = snakeToCamel(course_data.coachs[index].teachDayData[teach_day_index])
            course_data.coachs[index].teachDayData[teach_day_index].classDate.forEach((class_date, class_date_index) => {
              course_data.coachs[index].teachDayData[teach_day_index].classDate[class_date_index] = snakeToCamel(course_data.coachs[index].teachDayData[teach_day_index].classDate[class_date_index])
              course_data.coachs[index].teachDayData[teach_day_index].classDate[class_date_index].classDateRange = snakeToCamel(course_data.coachs[index].teachDayData[teach_day_index].classDate[class_date_index].classDateRange)
            });
          });
        })
        //.entries()
        course_data.packages.forEach((package_data, index_package) => {
          course_data.packages[index_package] = snakeToCamel(course_data.packages[index_package])
          course_data.packages[index_package].options.forEach((option_data, option_index) => {
            course_data.packages[index_package].options[option_index] = snakeToCamel(course_data.packages[index_package].options[option_index])
          })
        })

        console.log(course_data)
        const data_payload = new FormData()
        data_payload.append("payload", JSON.stringify(course_data))
        console.log(typeof course_data.courseImg);
        if (typeof course_data.courseImg == Object) {
          data_payload.append("img_url", course_data.courseImg)
        }

        // console.log("endpoint :", `${process.env.VUE_APP_URL}/api/v1/manage/update/${course_data.courseId}`)
        // let { data } = await axios.patch(`${process.env.VUE_APP_URL}/api/v1/manage/update/${course_data.courseId}`, data_payload, config);
        // if (data.statusCode === 200) {
        //
        //   // context.commit("ChangeDataUpdate")
        //   context.commit("SetCourseIsLoading", false)
        //   Swal.fire({
        //     icon: "success",
        //     title: "แก้ไขคอร์สสำเร็จ",
        //     showDenyButton: false,
        //     showCancelButton: false,
        //     confirmButtonText: "ตกลง",
        //   }).then(async (result) => {
        //     if (result.isConfirmed) {
        //       router.push({ name: "CourseList" })
        //     }
        //   })
        //
        // }
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
        await data.data.forEach(async (course) => {
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
              course_open: course.c_course_open_date ? new Date(course.c_course_open_date).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric', }) : `${new Date(course.c_course_register_start_date).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric', })} - ${new Date(course.c_course_register_end_date).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric', })}`
            })
          }
        })
        context.commit("SetCourses", courses)
      } catch (error) {
        console.log(error)
      }
    },
    // COURSE :: DETAIL
    async GetCourse(context, course_id) {
      context.commit("SetCourseIsLoading", true)
      try {
        let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/course/detail/${course_id}`)
        let payload = {
          course_id: data.data.courseId,
          course_type_id: data.data.courseTypeId,
          type: data.data.courseTypeName,
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
          course_register_start_date: moment(data.data.courseRegisterStartDate).format("YYYY-MM-DD"),
          course_register_end_date: moment(data.data.courseRegisterEndDate).format("YYYY-MM-DD"),
          course_period_start_date: moment(data.data.coursePeriodStartDate, "HH:mm"),
          course_period_end_date: moment(data.data.coursePeriodEndDate, "HH:mm"),
          course_per_time: data.data.coursePerTime,
          student_recived: data.data.courseStudentRecived,
          course_study_end_date: data.data.courseStudyEndDate,
          course_study_start_date: data.data.courseStudyStartDate,
          coachs: [],
          packages: [],
          days_of_class: []
        }
        if (data.statusCode === 200) {
          let teach_day_data = []
          data.data.coachs.forEach((coach) => {
            data.data.dayOfWeek.filter(v => v.courseCoachId === coach.courseCoachId).forEach((coach_date) => {
              // DAY OF CLASS
              coach_date.dayOfWeekName.forEach(day => {
                if (coach_date.status === 'Active') {
                  if (payload.days_of_class.filter(v => v.day === day).length > 0) {
                    coach_date.times.forEach(time => {
                      if (payload.days_of_class.filter(v => v.day === day)[0].times.filter(v => v.timeId === time.timeId).length === 0) {
                        payload.days_of_class.filter(v => v.day === day)[0].times.push(time)
                      }
                      if (payload.days_of_class.filter(v => v.day === day)[0].course_coach_id.filter(v => v === coach.courseCoachId).length === 0) {
                        payload.days_of_class.filter(v => v.day === day)[0].course_coach_id.push(coach_date.courseCoachId)
                      }
                    })
                  } else {
                    payload.days_of_class.push({
                      course_coach_id: [coach_date.courseCoachId],
                      day: day,
                      times: coach_date.times,
                    })
                  }
                }
              })
              let class_dates = []
              for (const time of coach_date.times) {
                class_dates.push({
                  class_date_range: {
                    start_time: moment(time.start, "HH:mm"),
                    menu_start_time: false,
                    end_time: moment(time.end, "HH:mm"),
                    menu_end_time: false,
                  },
                  students: time.maximumStudent,
                },)
              }

              // TEACH DAY
              teach_day_data.push({
                class_open: coach_date.status === 'Active' ? true : false,
                teach_day: coach_date.dayOfWeekName.map(v => parseInt(v)),
                course_coach_id: coach_date.courseCoachId,
                class_date: class_dates,
              })
            })
            payload.coachs.push(
              {
                coach_id: coach.accountId,
                course_coach_id: coach.courseCoachId,
                coach_name: `${coach.coachFirstNameTh} ${coach.coachLastNameTh}`,
                teach_day_data: [],
                teach_days_used: [],
                class_date_range: {
                  start_date: data.data.courseStudyStartDate ? moment(data.data.courseStudyStartDate).format("YYYY-MM-DD") : "",
                  menu_start_date: false,
                  end_date: data.data.courseStudyStartDate ? moment(data.data.courseStudyEndDate).format("YYYY-MM-DD") : "",
                  menu_end_date: false,
                },
                class_date_range_str: {
                  start_date: data.data.courseStudyStartDate ? new Date(data.data.courseStudyStartDate).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric', }) : "",
                  end_date: data.data.courseStudyStartDate ? new Date(data.data.courseStudyEndDate).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric', }) : "",
                },
                register_date_range: {
                  start_date: data.data.courseRegisterStartDate ? moment(data.data.courseRegisterStartDate).format("YYYY-MM-DD") : "-",
                  menu_start_date: false,
                  end_date: data.data.courseRegisterStartDate ? moment(data.data.courseRegisterEndDate).format("YYYY-MM-DD") : "-",
                  menu_end_date: false,
                },
                register_date_range_str: {
                  start_date: data.data.courseRegisterEndDate ? new Date(data.data.courseRegisterStartDate).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric', }) : "",
                  end_date: data.data.courseRegisterEndDate ? new Date(data.data.courseRegisterEndDate).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric', }) : "",
                },
                period: {
                  start_time: data.data.coursePeriodEndDate ? moment(data.data.coursePeriodEndDate, "HH:mm") : "",
                  end_time: data.data.coursePeriodEndDate ? moment(data.data.coursePeriodStartDate, "HH:mm") : "",
                },
              },
            )
          })
          payload.coachs.forEach((coach) => {
            coach.teach_day_data = teach_day_data.filter(v => v.course_coach_id === coach.course_coach_id)
          })
          if (data.data.courseTypeId === "CT_1") {
            let options = []
            data.data.coursePackageOption.forEach((package_data) => {
              if (payload.packages.filter(v => v.package_id === package_data.packageId).length === 0) {
                payload.packages.push({
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
            payload.packages.forEach((package_data) => {
              package_data.options = options.filter(v => v.package_id === package_data.package_id)
            })
          }
          console.log("payload : ", payload)
          context.commit("SetCourseData", payload)
          context.commit("SetCourseIsLoading", false)
        }
      } catch (error) {
        context.commit("SetCourseIsLoading", false)
        console.log(error)
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
              "coursePeriodStartDate": coach.period.start_time ? moment(coach.period.start_time).format('HH:mm') : '',
              "coursePeriodEndDate": coach.period.end_time ? moment(coach.period.end_time).format('HH:mm') : '',
            }
          })
          // Day Of Week
          coach.teach_day_data.forEach((teach_day) => {
            let times = []
            teach_day.class_date.forEach((date) => {
              if (course.course_type_id === "CT_1") {
                times.push({
                  "start": moment(date.class_date_range.start_time).format('HH:mm'),
                  "end": moment(date.class_date_range.end_time).format('HH:mm'),
                  "maximumStudent": date.students
                })
              } else {
                times.push({
                  "start": moment(coach.period.start_time).format('HH:mm'),
                  "end": moment(coach.period.end_time).format('HH:mm'),
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
            course.course_url = course.course_img ? `${process.env.VUE_APP_URL}/api/v1/files/${course.course_img}` : ""
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
          console.log("SetStatusCourse", data.data);

        } else {
          throw { error: data };
        }
      } catch (error) {
        console.log(error);
      }

    }
  },
  getters: {
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
    }
  },
};

export default CourseModules;

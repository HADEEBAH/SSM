import axios from "axios";
import moment from "moment";
import Swal from "sweetalert2";
import router from "@/router";
import VueCookie from "vue-cookie"
import VueI18n from "../i18n";
var XLSX = require("xlsx");
import {
  dateFormatter,
} from "@/functions/functions";
function dayOfWeekArray(day, lang) {
  // console.log(day)
  let days = day
  let weekdays = []
  if (lang) {
    if (lang == "en") {
      weekdays = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
      ];
    } else {
      weekdays = [
        "อาทิตย์",
        "จันทร์",
        "อังคาร",
        "พุธ",
        "พฤหัสบดี",
        "ศุกร์",
        "เสาร์",
      ];
    }
  } else {
    weekdays = [
      VueI18n.t("sunday"),
      VueI18n.t("monday"),
      VueI18n.t("tuesday"),
      VueI18n.t("wednesday"),
      VueI18n.t("thursday"),
      VueI18n.t("friday"),
      VueI18n.t("saturday"),
    ];
  }


  days?.sort();
  let ranges = [];
  if (days[0]) {
    let rangeStart = parseInt(days[0]);
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
    export_is_loading: false,
    no_check_in_student_list: [],
    course_types: [],
    courses_is_loading: false,
    course_is_loading: false,
    course_data: {
      reservation: false,
      menu_reservation_start_date: "",
      menu_reservation_end_date: "",
      reservation_start_date_str: "",
      reservation_start_date: "",
      reservation_end_date_str: "",
      reservation_end_date: "",
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
      course_hours: 1.0,
      course_hours_obj: {
        HH: '01',
        mm: '00'
      },
      location: "",
      detail: "",
      music_performance: "",
      catification: "",
      price_course: 0,
      student_recived: 0,
      artwork_file: [],
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
                    start_time_object: { HH: "", mm: "" },
                    menu_start_time: false,
                    end_time: "",
                    end_time_object: { HH: "", mm: "" },
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
            start_time_object: { HH: "", mm: "" },
            end_time: "",
            end_time_object: { HH: "", mm: "" },
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
    course_type_is_loading: false,
    course_student: [],
    course_artwork: [],
    course_potential: {},
    coach_list: [],
    coach_list_is_loading: false,
    student_list: [],
    stident_list_is_loading: false,
    student_reserve_list: [],
    student_potential_list: [],
    student_potential_list_is_loading: false,
    filter_course_option: {
      limit: 6,
      page: 1
    },
    course_seat: [],
    checkDay: []

  },
  mutations: {
    SetExportIsLoading(state, payload) {
      state.export_is_loading = payload
    },
    SetNoChackInStudentList(state, paylaod) {
      state.no_check_in_student_list = paylaod
    },
    SetStudentPotentialListIsLoading(state, value) {
      state.student_potential_list_is_loading = value
    },
    SetStudentPotentialList(state, payload) {
      state.student_potential_list = payload
    },
    SetStudentReserveList(state, payload) {
      state.student_reserve_list = payload
    },
    SetStudentListIsLoadIng(state, value) {
      state.stident_list_is_loading = value
    },
    SetStudentList(state, payload) {
      state.student_list = payload
    },
    SetCoachList(state, payload) {
      state.coach_list = payload
    },
    SetCoachListIsLoading(state, payload) {
      state.coach_list_is_loading = payload
    },
    SetCoursePotential(state, paylaod) {
      state.course_potential = paylaod
    },
    SetCourseArtwork(state, payload) {
      state.course_artwork = payload
    },
    ResetArtwork(state) {
      state.course_artwork = []
    },
    SetCourseStudent(state, payload) {
      state.course_student = payload
    },
    SetTeachDays(state, payload) {
      state.teach_days = payload
    },
    SetCourseTypeIsLoading(state, value) {
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
        reservation: false,
        menu_reservation_start_date: "",
        menu_reservation_end_date: "",
        reservation_start_date_str: "",
        reservation_start_date: "",
        reservation_end_date_str: "",
        reservation_end_date: "",
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
        course_hours_obj: {
          HH: '01',
          mm: '00'
        },
        location: "",
        detail: "",
        music_performance: "",
        catification: "",
        price_course: 0,
        student_recived: 0,
        artwork_file: [],
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
                      start_time_object: { HH: "", mm: "" },
                      menu_start_time: false,
                      end_time: "",
                      end_time_object: { HH: "", mm: "" },
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
              start_time_object: { HH: "", mm: "" },
              end_time: "",
              end_time_object: { HH: "", mm: "" }
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
    },
    SetFilterCourseOption(state, payload) {
      state.filter_course_option = payload
    },
    SetCourseSeat(state, payload) {
      state.course_seat = payload
    },
    SetCheckDay(state, payload) {
      state.checkDay = payload
    }
  },
  actions: {
    // CHECK COURSE SEAT
    async GetCourseSeats(context, { courseId, coachId, courseTypeId, dayOfWeekId, timeId, coursePackageOptionsId, studentId }) {
      try {
        // let localhost = "http://localhost:3000"
        // let { data } = await axios.get(`${localhost}/api/v1/monitor/course/seats?courseId=${courseId}&courseTypeId=${courseTypeId}&coursePackageOptionsId=${coursePackageOptionsId}&dayOfWeekId=${dayOfWeekId}&timeId=${timeId}&coachId=${coachId}&studentId=${studentId}`)
        let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/monitor/course/seats?courseId=${courseId}&courseTypeId=${courseTypeId}&coursePackageOptionsId=${coursePackageOptionsId}&dayOfWeekId=${dayOfWeekId}&timeId=${timeId}&coachId=${coachId}&studentId=${studentId}`)
        if (data.statusCode === 200) {
          context.commit("SetCourseSeat", data.data)
        }
      } catch (error) {
        console.log(error)
      }
    },

    async GetCheckDate(context, { courseId, coachId, courseTypeId, dayOfWeekId, timeId, coursePackageOptionsId, studentId }) {
      try {
        // let localhost = "http://localhost:3000"
        // let { data } = await axios.get(`${localhost}/api/v1/monitor/out/regiscoursedate?courseId=${courseId}&courseTypeId=${courseTypeId}&coursePackageOptionsId=${coursePackageOptionsId}&dayOfWeekId=${dayOfWeekId}&timeId=${timeId}&coachId=${coachId}&studentId=${studentId}`)
        let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/monitor/out/regiscoursedate?courseId=${courseId}&courseTypeId=${courseTypeId}&coursePackageOptionsId=${coursePackageOptionsId}&dayOfWeekId=${dayOfWeekId}&timeId=${timeId}&coachId=${coachId}&studentId=${studentId}`)
        if (data.statusCode === 200) {
          context.commit("SetCheckDay", data.data)
        }
      } catch (error) {
        console.log(error)
      }
    },


    // DELETE : COURSE COACH
    async DeleteCourseCoach(context, { course_id, course_coach_id }) {
      try {
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            'Authorization': `Bearer ${VueCookie.get("token")}`
          }
        }
        let { data } = await axios.delete(`${process.env.VUE_APP_URL}/api/v1/admincourse/delete-course-coach/${course_coach_id}`, config)
        if (data.statusCode == 200) {
          context.dispatch("GetCourse", course_id)
          Swal.fire({
            icon: "success",
            title: VueI18n.t("succeed"),
            text: VueI18n.t("coach deleted"),
            timer: 3000,
            showDenyButton: false,
            showCancelButton: false,
            showConfirmButton: false,
            timerProgressBar: true,
          })
        }
      } catch (error) {
        if (error.response.data.message == "This coach cannot be deleted. Because the middle of teaching") {
          Swal.fire({
            icon: "error",
            title: VueI18n.t("can not delete coach"),
            text: VueI18n.t(error.response.data.message),
            timer: 3000,
            showDenyButton: false,
            showCancelButton: false,
            showConfirmButton: false,
            timerProgressBar: true,
          })
          context.dispatch("GetCourse", course_id)
        }
      }
    },
    // COURSE TYPES
    async GetCourseTypes(context, { category_id }) {
      try {
        let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/course/type?category_id=${category_id}`)
        if (data.statusCode === 200) {
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
          context.commit("SetCoachs", data.data)
        } else {
          throw { error: data }
        }
      } catch (error) {
        console.log(error)
      }
    },
    ChangeCourseData(context, course_data) {
      context.commit("SetCourseData", course_data)
    },
    // COACH :: LIST BY COURSE
    async GetCoachsByCourse(context, { course_id }) {
      context.commit("SetCoachListIsLoading", true)
      try {
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            'Authorization': `Bearer ${VueCookie.get("token")}`
          }
        }
        let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/schedule/manage-course/${course_id}`, config)
        if (data.statusCode === 200) {
          let datesList = []
          for await (let coach of data.data) {
            coach.checked = false
            let coachDate = coach
            if (!coachDate.cpo?.cpoId) {
              if (coachDate?.coachLeaveDate) {
                for await (const dateLeave of coachDate?.coachLeaveDate) {
                  datesList.push({
                    coachId: coach.coachId,
                    date: dateLeave.teachCompensationDate,
                    timeId: null,
                    start: dateLeave.teachCompensationStartTime,
                    end: dateLeave.teachCompensationEndTime,
                    startDate: coachDate.dates.startDate ? new Date(coachDate.dates.startDate).toLocaleDateString("th-TH") : '',
                    endDate: coachDate.dates.endDate ? new Date(coachDate.dates.endDate).toLocaleDateString("th-TH") : '',
                    time: `${dateLeave.teachCompensationStartTime}-${dateLeave.teachCompensationEndTime} ${VueI18n.t("o'clock")}`,
                    cpo: coachDate.cpo ? coachDate.cpo : null,
                    cpoId: coachDate.cpo?.cpoId ? coachDate.cpo?.cpoId : null,
                    students: coachDate.studentArr.filter(v => v.date == dateLeave.teachCompensationDate && v.startTime == coachDate.time.start && v.endTime == coachDate.time.end),
                    checked: false,
                  })
                }
              }
              for await (const date of coachDate.dates.date) {
                if (datesList.filter(v => v.date === date && v.coachId === coach.coachId).length === 0) {
                  datesList.push({
                    coachId: coach.coachId,
                    date: date,
                    timeId: coachDate.time.timeId,
                    start: coachDate.time.start,
                    end: coachDate.time.end,
                    startDate: coachDate.dates.startDate ? new Date(coachDate.dates.startDate).toLocaleDateString("th-TH") : '',
                    endDate: coachDate.dates.endDate ? new Date(coachDate.dates.endDate).toLocaleDateString("th-TH") : '',
                    time: `${coachDate.time.start}-${coachDate.time.end} ${VueI18n.t("o'clock")}`,
                    cpo: coachDate.cpo ? coachDate.cpo : null,
                    cpoId: coachDate.cpo?.cpoId ? coachDate.cpo?.cpoId : null,
                    students: coachDate.studentArr.filter(v => v.date == date && v.startTime == coachDate.time.start && v.endTime == coachDate.time.end),
                    checked: false,
                  })
                }
              }
            } else {
              for await (const date of coachDate.dates.date) {
                if (datesList.filter(v => v.coachId == coach.coachId && v.date === date && v.start === coachDate.time.start && v.end === coachDate.time.end && v.cpo.packageName === coachDate.cpo.packageName).length === 0) {
                  datesList.push({
                    coachId: coach.coachId,
                    date: date,
                    timeId: coachDate.time.timeId,
                    start: coachDate.time.start,
                    end: coachDate.time.end,
                    time: `${coachDate.time.start} - ${coachDate.time.end} ${VueI18n.t("o'clock")}`,
                    cpo: coachDate.cpo ? coachDate.cpo : null,
                    cpoId: coachDate.cpo.cpoId ? coachDate.cpo.cpoId : null,
                    students: coachDate.studentArr.filter(v => v.date == date && v.startTime == coachDate.time.start && v.endTime == coachDate.time.end),
                    checked: false,
                  })
                }
              }
            }
          }
          data.data.map((v) => {
            v.datesList = datesList?.filter(f => f.coachId == v.coachId)?.sort(function (a, b) {
              var dateA = new Date(a.date);
              var dateB = new Date(b.date);
              return dateA - dateB;
            });
            return v
          })
          let coachList = []
          for await (let coach of data.data) {
            if (!coachList.some(v => v.coachId == coach.coachId && coach.datesList.length > 0)) {
              coachList.push(coach)
            }
          }
          for await (let potential of data.data.filter(v => v.studentPotentialArr && v?.studentPotentialArr?.length > 0)) {
            if (coachList.some(v => v.coachId == potential.coachId)) {
              for (let list of coachList.filter(v => v.coachId == potential.coachId)) {
                list.studentPotentialArr = potential.studentPotentialArr
              }
            }
          }
          context.commit("SetCoachListIsLoading", false)
          // console.log("coachList ",coachList)
          await context.commit("SetCoachList", coachList)
        }
      } catch (error) {
        context.commit("SetCoachListIsLoading", false)
      }
    },
    // STUDENT :: LIST BY COACH
    async GetStudentByDate(context, { course_id, date, start_time, end_time, time_id, coach_id }) {
      context.commit("SetStudentListIsLoadIng", true)
      try {
        // const count_check_In_date = coach_data.filter(v => v.start === start_time && v.end === end_time)
        // const current_check_in = count_check_In_date.findIndex(v => v.date == date) + 1
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            'Authorization': `Bearer ${VueCookie.get("token")}`
          }
        }
        let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/studentlist/checkin/course/${course_id}/coach/${coach_id}/date/${date}/time/${time_id}`, config)

        if (data.statusCode === 200) {

          if (data.data.length > 0 && data.data?.filter(v => v?.potential?.checkInPotentialId).length !== data.data.length) {
            context.commit("SetStudentList", data.data)
            context.commit("SetNoChackInStudentList", [])
          } else {
            context.commit("SetStudentList", [])
            // let scheduleStudent = await axios.get(`http://localhost:3000/api/v1/schedule/manage-course-student/${course_id}/${date}?starTime=${start_time}&endTime=${end_time}&coachId=${coach_id}`, config)
            let scheduleStudent = await axios.get(`${process.env.VUE_APP_URL}/api/v1/schedule/manage-course-student/${course_id}/${date}?starTime=${start_time}&endTime=${end_time}&coachId=${coach_id}`, config)
            if (scheduleStudent.data.statusCode == 200) {
              let scheduleStudentData = scheduleStudent.data.data.filter(v => v.endTime == end_time && v.startTime == start_time && v.coachId == coach_id)
              // scheduleStudentData.map(v=>{
              //   v.countCheckIn = current_check_in
              //   v.totalDay = count_check_In_date.length
              //   return v
              // })
              context.commit("SetNoChackInStudentList", scheduleStudentData)
            }
          }

          context.commit("SetStudentListIsLoadIng", false)
        }
      } catch (error) {
        context.commit("SetStudentListIsLoadIng", false)
      }
    },
    // STUDENT :: LIST POTENTIAL BY COACH
    async GetStudentPotentialByCoach(context, { course_id, coach_id }) {
      context.commit("SetStudentPotentialListIsLoading", true)
      try {
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            'Authorization': `Bearer ${VueCookie.get("token")}`
          }
        }
        let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/studentlist/checkin/course/${course_id}/coach/${coach_id}`, config)
        if (data.statusCode === 200) {
          context.commit("SetStudentPotentialList", data.data)
          context.commit("SetStudentPotentialListIsLoading", false)
        }
      } catch (error) {
        context.commit("SetStudentPotentialListIsLoading", false)
      }

    },
    // RESERVE :: STUDENT LIST BY COURSE
    async GetStudentReserveByCourseId(context, { course_id }) {
      try {
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            'Authorization': `Bearer ${VueCookie.get("token")}`
          }
        }
        // let localhost = "http://localhost:3000"
        // let { data } = await axios.get(`${localhost}/api/v1/manage/reserve/course/${course_id}`, config)
        let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/manage/reserve/course/${course_id}`, config)
        if (data.statusCode === 200) {
          context.commit("SetStudentReserveList", data.data)
        }
      } catch (error) {
        console.log(error)
      }
    },
    // COURSE :: UPDATE COURSE DETAIL
    async UpdateCouserDetail(context, { course_id, course_data }) {
      try {
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            'Authorization': `Bearer ${VueCookie.get("token")}`
          }
        }
        let payload = {
          "reservation": course_data.reservation,
          "reservationEndDate": course_data.reservation_end_date,
          "reservationStartDate": course_data.reservation_start_date,
          "courseId": course_data.course_id,
          "courseTypeId": course_data.course_type_id,
          "type": course_data.type,
          "courseNameTh": course_data.course_name_th,
          "courseNameEn": course_data.course_name_en,
          "courseImg": typeof course_data.course_img == "object" ? null : course_data.course_img,
          "categoryId": course_data.category_id,
          "categoryNameTh": course_data.category_name_th,
          "courseOpenDate": course_data.course_open_date,
          "courseOpenDateStr": course_data.course_open_date_str,
          "coursePerTime": course_data.course_hours,
          "courseLocation": course_data.location,
          "courseDescription": course_data.detail,
          "courseMusicPerformance": course_data.music_performance,
          "courseCertification": course_data.catification,
          "coursePrice": parseInt(course_data.price_course),
          "courseRegisterStartDate": course_data?.coachs[0]?.register_date_range?.start_date ? course_data.coachs[0].register_date_range.start_date : null,
          "courseRegisterEndDate": course_data?.coachs[0]?.register_date_range?.end_date ? course_data.coachs[0].register_date_range.end_date : null,
          "coursePeriodStartDate": course_data.coachs[0].period.start_time ? course_data.coachs[0].period.start_time : null,
          "coursePeriodEndDate": course_data.coachs[0].period.end_time ? course_data.coachs[0].period.end_time : null,
          "courseStudentRecived": course_data.student_recived,
          "courseStudyEndDate": course_data?.coachs[0]?.class_date_range?.end_date,
          "courseStudyStartDate": course_data?.coachs[0]?.class_date_range?.start_date,
          "coachs": [],
          "dayOfweek": [],
        }
        if (course_data.course_type_id === "CT_2") {
          for await (const coach of course_data.coachs.filter(v => v.teach_day_data.length > 0)) {
            let teach_day_data = []
            for await (const date of coach.teach_day_data) {
              let class_date = []
              for await (const class_date_data of date.class_date) {
                class_date.push({
                  "dayOfWeekId": date.day_of_week_id,
                  "timeId": class_date_data.class_date_range.time_id,
                  "classDateRange": {
                    "startTime": class_date_data.class_date_range.start_time ? class_date_data.class_date_range.start_time : null,
                    "endTime": class_date_data.class_date_range.end_time ? class_date_data.class_date_range.end_time : null,
                  },
                  "students": parseInt(class_date_data.students)
                })
              }
              if (date.day_of_week_id) {
                if (teach_day_data.filter((v) => v.dayOfWeekId === date.day_of_week_id && v.courseCoachId === date.course_coach_id).length === 0) {
                  teach_day_data.push({
                    "dayOfWeekId": date.day_of_week_id,
                    "classOpen": date.class_open,
                    "teachDay": date.teach_day,
                    "courseCoachId": date.course_coach_id,
                    "classDate": class_date
                  })
                }
              } else {
                teach_day_data.push({
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
              "courseCoachId": coach.course_coach_id ? coach.course_coach_id : null,
              "coachName": coach.coach_name,
              "teachDayData": teach_day_data,
              "classDateRange": {
                "startDate": coach.class_date_range.start_date ? moment(coach.class_date_range.start_date).format("YYYY-MM-DD") : null,
                "endDate": coach.class_date_range.end_date ? moment(coach.class_date_range.end_date).format("YYYY-MM-DD") : null,
              },
              "registerDateRange": {
                "startDate": coach.register_date_range.start_date && coach.register_date_range.start_date !== "-" ? moment(coach.register_date_range.start_date).format("YYYY-MM-DD") : null,
                "endDate": coach.register_date_range.end_date && coach.register_date_range.end_date !== "-" ? moment(coach.register_date_range.end_date).format("YYYY-MM-DD") : null,
              },
              "period": {
                "startTime": coach.period.start_time ? coach.period.start_time : null,
                "endTime": coach.period.end_time ? coach.period.end_time : null
              }
            })
          }
        }

        let payloadData = new FormData()
        payloadData.append("payload", JSON.stringify(payload))
        if (typeof course_data.course_img == "object") {
          payloadData.append("img_url", course_data.course_img)
        }
        let { data } = await axios.patch(`${process.env.VUE_APP_URL}/api/v1/manage/update-course/${course_id}`, payloadData, config)
        if (data.statusCode === 200) {
          await context.dispatch("GetArtworkByCourse", { course_id: course_id })
          await context.dispatch("GetCourse", course_id)
          Swal.fire({
            icon: "success",
            title: VueI18n.t("succeed"),
            text: VueI18n.t("the course has been edited"),
            timer: 3000,
            showDenyButton: false,
            showCancelButton: false,
            showConfirmButton: false,
            timerProgressBar: true,
          })
          return await data.data
        }
      } catch (error) {
        if (error.response.data.message == "the current student more than course student recived") {
          Swal.fire({
            icon: "error",
            title: VueI18n.t("can not update course"),
            text: VueI18n.t(error.response.data.message),
            timer: 3000,
            showDenyButton: false,
            showCancelButton: false,
            showConfirmButton: false,
            timerProgressBar: true,
          })
          context.dispatch("GetCourse", course_id)
        } else {
          Swal.fire({
            icon: "error",
            title: VueI18n.t("something went wrong"),
            timer: 3000,
            showDenyButton: false,
            showCancelButton: false,
            showConfirmButton: false,
            timerProgressBar: true,
          })
        }

      }
    },
    // COURSE :: UPDATE COURSE COACH
    async UpdateCouserCoach(context, { course_id, course_data }) {
      try {
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
          "coachs": []
        }
        for await (const coach of course_data.coachs.filter(v => v.teach_day_data.length > 0)) {
          let teach_day_data = []
          for await (const date of coach.teach_day_data) {
            let class_date = []
            for await (const class_date_data of date.class_date) {
              class_date.push({
                "dayOfWeekId": date.day_of_week_id,
                "timeId": class_date_data.class_date_range.time_id,
                "classDateRange": {
                  "startTime": class_date_data.class_date_range.start_time ? class_date_data.class_date_range.start_time : null,
                  "endTime": class_date_data.class_date_range.end_time ? class_date_data.class_date_range.end_time : null,
                },
                "students": parseInt(class_date_data.students)
              })
            }
            if (date.day_of_week_id) {
              if (teach_day_data.filter((v) => v.dayOfWeekId === date.day_of_week_id && v.courseCoachId === date.course_coach_id).length === 0) {
                teach_day_data.push({
                  "dayOfWeekId": date.day_of_week_id,
                  "classOpen": date.class_open,
                  "teachDay": date.teach_day,
                  "courseCoachId": date.course_coach_id,
                  "classDate": class_date
                })
              }
            } else {
              teach_day_data.push({
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
            "courseCoachId": coach.course_coach_id ? coach.course_coach_id : null,
            "coachName": coach.coach_name,
            "teachDayData": teach_day_data,
            "classDateRange": {
              "startDate": coach.class_date_range.start_date ? moment(coach.class_date_range.start_date).format("YYYY-MM-DD") : null,
              "endDate": coach.class_date_range.end_date ? moment(coach.class_date_range.end_date).format("YYYY-MM-DD") : null,
            },
            "registerDateRange": {
              "startDate": coach.register_date_range.start_date && coach.register_date_range.start_date !== "-" ? moment(coach.register_date_range.start_date).format("YYYY-MM-DD") : null,
              "endDate": coach.register_date_range.end_date && coach.register_date_range.end_date !== "-" ? moment(coach.register_date_range.end_date).format("YYYY-MM-DD") : null,
            },
            "period": {
              "startTime": coach.period.start_time ? coach.period.start_time : null,
              "endTime": coach.period.end_time ? coach.period.end_time : null
            }
          })
        }
        let payloadData = new FormData()
        payloadData.append("payload", JSON.stringify(payload))
        let { data } = await axios.patch(`${process.env.VUE_APP_URL}/api/v1/manage/update-coach/${course_id}`, payloadData, config)
        if (data.statusCode === 200) {
          await context.dispatch("GetCourse", course_id)
          Swal.fire({
            icon: "success",
            title: VueI18n.t("succeed"),
            text: VueI18n.t("intervals and coaches have been corrected"),
            showDenyButton: false,
            showCancelButton: false,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          })
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: VueI18n.t("something went wrong"),
          timer: 3000,
          showDenyButton: false,
          showCancelButton: false,
          showConfirmButton: false,
          timerProgressBar: true,
        })
      }
    },
    // COURSE :: DELETE COURSE 
    async DeleteCourse(context, { course_id }) {
      try {
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            'Authorization': `Bearer ${VueCookie.get("token")}`
          }
        }
        let { data } = await axios.delete(`${process.env.VUE_APP_URL}/api/v1/manage/remove-course/${course_id}`, config)
        if (data.statusCode === 200) {
          await context.dispatch("GetCoursesList")
          Swal.fire({
            icon: "success",
            title: VueI18n.t("succeed"),
            text: VueI18n.t("delete course success"),
            timer: 3000,
            showDenyButton: false,
            showCancelButton: false,
            showConfirmButton: false,
            timerProgressBar: true,
          })

        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: VueI18n.t("failed to Delete, because data in monitor or order"),
          timer: 3000,
          showDenyButton: false,
          showCancelButton: false,
          showConfirmButton: false,
          timerProgressBar: true,
        })
      }
    },
    // COURSE :: UPDATE COURSE PACKAGE
    async UpdateCouserPackage(context, { course_id, course_data }) {
      try {
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
        course_data.packages.forEach((package_data, index) => {
          payload.packages.push({
            "packageId": package_data.package_id,
            "package": package_data.package,
            "students": package_data.students,
            "options": []
          })
          package_data.options.forEach((option_data) => {
            payload.packages[index].options.push({
              "coursePackageOptionId": option_data.course_package_option_id ? option_data.course_package_option_id : null,
              "packageId": payload.packages[index].packageId,
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
              "studentNumber": package_data.students
            })
          })
        })
        let payloadData = new FormData()
        payloadData.append("payload", JSON.stringify(payload))
        let { data } = await axios.patch(`${process.env.VUE_APP_URL}/api/v1/manage/update-cpo/${course_id}`, payloadData, config)
        if (data.statusCode === 200) {
          Swal.fire({
            icon: "success",
            title: VueI18n.t("succeed"),
            text: VueI18n.t("the package has been edited"),
            showDenyButton: false,
            showCancelButton: false,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          })
        }
      } catch (error) {
        if (error.response.data.message == "the current student more than course student recived") {
          Swal.fire({
            icon: "error",
            title: VueI18n.t("can not update course"),
            text: VueI18n.t(error.response.data.message),
            timer: 3000,
            showDenyButton: false,
            showCancelButton: false,
            showConfirmButton: false,
            timerProgressBar: true,
          })
          context.dispatch("GetCourse", course_id)
        } else {
          Swal.fire({
            icon: "error",
            title: VueI18n.t("something went wrong"),
            timer: 3000,
            showDenyButton: false,
            showCancelButton: false,
            showConfirmButton: false,
            timerProgressBar: true,
          })
        }
      }
    },
    // COURSE :: DELETE ARKWORK ID
    async RemoveArkworkByArkworkId(context, { artwork_data }) {
      try {
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            'Authorization': `Bearer ${VueCookie.get("token")}`
          }
        }
        let { data } = await axios.delete(`${process.env.VUE_APP_URL}/api/v1/course/artworkCourse/${artwork_data.artworkCourseId}`, config)
        if (data.statusCode == 200) {
          Swal.fire({
            icon: "success",
            title: VueI18n.t("succeed"),
            text: VueI18n.t("the file has been successfully deleted"),
            showDenyButton: false,
            showCancelButton: false,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          })
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: VueI18n.t("something went wrong"),
          timer: 3000,
          showDenyButton: false,
          showCancelButton: false,
          showConfirmButton: false,
          timerProgressBar: true,
        })
      }
    },
    // COURSE :: DELETA privilage
    async RemovePrivilageByCourseID(context, { course_id }) {
      try {
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            'Authorization': `Bearer ${VueCookie.get("token")}`
          }
        }
        let { data } = await axios.delete(`${process.env.VUE_APP_URL}/api/v1/course/privilage/${course_id}`, config)
        if (data.statusCode == 200) {
          Swal.fire({
            icon: "success",
            title: VueI18n.t("succeed"),
            text: VueI18n.t("the file has been successfully deleted"),
            showDenyButton: false,
            showCancelButton: false,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          })
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: VueI18n.t("something went wrong"),
          timer: 3000,
          showDenyButton: false,
          showCancelButton: false,
          showConfirmButton: false,
          timerProgressBar: true,
        })
      }
    },
    // COURSE :: UPDATE ARKWORK
    async UpdateCourseArkwork(context, { course_id, course_data }) {
      try {
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            'Authorization': `Bearer ${VueCookie.get("token")}`
          }
        }
        let payloadData = new FormData()
        if (course_data.privilege_file) {
          payloadData.append("img_privilage", course_data.privilege_file)
        }
        if (course_data.artwork_file) {
          for (let i = 0; i < course_data.artwork_file.length; i++) {
            payloadData.append(`img_artwork`, course_data.artwork_file[i]);
          }
        }
        let { data } = await axios.patch(`${process.env.VUE_APP_URL}/api/v1/manage/update-artwork/${course_id}`, payloadData, config)
        if (data.statusCode === 200) {
          await context.dispatch("GetArtworkByCourse", { course_id: course_id })
          await context.dispatch("GetCourse", course_id)

          Swal.fire({
            icon: "success",
            title: VueI18n.t("succeed"),
            text: VueI18n.t("learning Journey has been edited"),
            showDenyButton: false,
            showCancelButton: false,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          })


        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: VueI18n.t("something went wrong"),
          timer: 3000,
          showDenyButton: false,
          showCancelButton: false,
          showConfirmButton: false,
          timerProgressBar: true,
        })
      }
    },
    // COURSE :: LIST 
    async GetCoursesList(context,) {
      try {
        let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/course/list?limit=1000&page=1`)
        let courses = []
        // let category = {}
        let categorys = await axios.get(`${process.env.VUE_APP_URL}/api/v1/category`)
        if (data.statusCode === 200) {
          for await (const course of data.data) {
            let category = categorys.data.data.filter(v => v.categoryId == course.c_category_id)[0]
            // console.log(category)
            if (category) {
              courses.push({
                course_id: course.c_course_id,
                category_id: course.c_category_id,
                category: category.categoryNameTh ? category.categoryNameTh : "-",
                category_en: category.categoryNameEng ? category.categoryNameEng : "-",
                course_type: course.c_course_type_id === "CT_1" ? "คอร์สทั่วไป" : "คอร์สระยะสั้น",
                course_type_en: course.c_course_type_id === "CT_1" ? VueI18n.t("regular course") : VueI18n.t("short course"),
                course_type_id: course.c_course_type_id,
                course_th: course.c_course_name_th,
                course_en: course.c_course_name_en,
                status: course.c_course_status,
                isTruncated: true,
                course_open: course.c_course_open_date ? new Date(course.c_course_open_date).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric', }) : `${new Date(course.c_course_register_start_date).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric', })} - ${new Date(course.c_course_register_end_date).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric', })}`,
                course_open_date: course.c_course_open_date,
                course_open_start_time: course.c_course_register_start_date,
                course_open_end_time: course.c_course_register_end_date,
              })
            } else {
              if (categorys.data.statusCode === 400 && categorys.data.message === "Category not found.") {
                continue
              }
            }
          }
          context.commit("SetCourses", courses)
        }
      } catch (error) {
        console.log(error)
      }
    },
    // COURSE :: STUDENT
    async GetCourseStudent(context, { course_id, cpo_id }) {
      try {
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            'Authorization': `Bearer ${VueCookie.get("token")}`
          }
        }
        if (cpo_id) {
          let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/order/count/student?courseId=${course_id}&cpoId=${cpo_id}`, config)
          context.commit("SetCourseStudent", data.data)
        } else {
          let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/order/count/student?courseId=${course_id}`, config)
          context.commit("SetCourseStudent", data.data)
        }

      } catch (error) {
        console.log(error)
      }
    },
    //COURSE :: Artwork
    async GetArtworkByCourse(context, { course_id }) {
      try {
        let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/course/attcahment/${course_id}`)
        if (data.statusCode === 200) {
          if (data.data.length > 0) {
            for (const artwork of data.data) {
              artwork.attachmentUrl = artwork.attachmentCourse ? `${process.env.VUE_APP_URL}/api/v1/files/${artwork.attachmentCourse}` : null
            }
          }
          context.commit("SetCourseArtwork", data.data)
        } else {
          throw { error: data }
        }
      } catch (error) {
        console.log(error)
      }
    },
    // COURSE :: DETAIL
    async GetCourse(context, course_id) {
      context.commit("SetCourseIsLoading", true)
      try {
        let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/course/detail/${course_id}`)
        if (data.statusCode === 200) {
          let course_hours_part = data?.data?.coursePerTime?.toFixed(2)?.split(".")
          let course_hours_object = {}
          if (course_hours_part.length > 1) {
            course_hours_object = {
              HH: course_hours_part[0].padStart(2, '0'),
              mm: course_hours_part[1].padStart(2, '0')
            }
          } else {
            course_hours_object = {
              HH: data.data.coursePerTime.padStart(2, '0'),
              mm: "00"
            }
          }
          let payload = {
            reservation: data.data.reservationEndDate ? true : false,
            menu_reservation_start_date: "",
            menu_reservation_end_date: "",
            reservation_start_date_str: data.data.reservationStartDate ? dateFormatter(data.data.reservationStartDate, "DD MMT YYYYT") : "",
            reservation_start_date: data.data.reservationStartDate,
            reservation_end_date_str: data.data.reservationEndDate ? dateFormatter(data.data.reservationEndDate, "DD MMT YYYYT") : "",
            reservation_end_date: data.data.reservationEndDate,
            course_img_privilege: data.data.courseImgPrivilege ? `${process.env.VUE_APP_URL}/api/v1/files/${data.data.courseImgPrivilege}` : null,
            course_id: data.data.courseId,
            course_type_id: data.data.courseTypeId,
            course_type: data.data.courseTypeName,
            course_name_th: data.data.courseNameTh,
            course_name_en: data.data.courseNameEn,
            course_status: data.data.courseStatus,
            course_img: data.data.courseImg ? `${process.env.VUE_APP_URL}/api/v1/files/${data.data.courseImg}` : "",
            category_id: data.data.categoryId,
            category_name_th: data.data.categoryNameTh,
            category_name_en: data.data.categoryNameEn,
            course_open_date: data.data.courseOpenDate ? moment(data.data.courseOpenDate).format("YYYY-MM-DD") : "",
            course_open_date_str: data.data.courseOpenDate ? new Date(data.data.courseOpenDate).toLocaleDateString(VueI18n.locale == 'th' ? 'th-TH' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric', }) : "",
            menu_course_open_date: false,
            course_hours: data.data.coursePerTime,
            course_hours_obj: course_hours_object,
            location: data.data.courseLocation,
            detail: data.data.courseDescription,
            music_performance: data.data.courseMusicPerformance,
            catification: data.data.courseCertification,
            price_course: data.data.coursePrice,
            course_register_start_date: data.data.courseRegisterStartDate ? moment(data.data.courseRegisterStartDate).format("YYYY-MM-DD") : null,
            course_register_end_date: data.data.courseRegisterEndDate ? moment(data.data.courseRegisterEndDate).format("YYYY-MM-DD") : null,
            course_period_start_date: data.data.coursePeriodStartDate ? data.data.coursePeriodStartDate : null,
            course_period_end_date: data.data.coursePeriodEndDate ? data.data.coursePeriodEndDate : null,
            course_per_time: data.data.coursePerTime,
            student_recived: data.data.courseStudentRecived,
            course_study_end_date: data.data.courseStudyEndDate,
            course_study_start_date: data.data.courseStudyStartDate,
            course_study_end_date_str: data.data.courseStudyEndDate ? new Date(data.data.courseStudyEndDate).toLocaleDateString(VueI18n.locale == 'th' ? 'th-TH' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric', }) : null,
            course_study_start_date_str: data.data.courseStudyStartDate ? new Date(data.data.courseStudyStartDate).toLocaleDateString(VueI18n.locale == 'th' ? 'th-TH' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric', }) : null,
            coachs: [],
            packages: [],
            privilege_file: null,
            artwork_file: [],
            days_of_class: [],
            days: []
          }
          let teach_day_data = []
          if (data.data.coachs) {
            for await (let coach of data.data.coachs) {
              for await (let coach_date of data.data.dayOfWeek.filter(v => v.courseCoachId === coach.courseCoachId)) {
                // DAY OF CLASS
                if (payload.days_of_class.filter(v => v.day_of_week_id === coach_date.times[0].dayOfWeekId).length === 0) {
                  let dayName = dayOfWeekArray(coach_date.dayOfWeekName)
                  payload.days_of_class.push({
                    day_of_week_id: coach_date.times[0].dayOfWeekId,
                    course_coach_id: [coach_date.courseCoachId],
                    day: coach_date.dayOfWeekName,
                    dayName: dayName,
                    times: coach_date.times,
                  })
                }
                let class_dates = []
                for await (const time of coach_date.times) {

                  let startTimePart = time?.start?.split(":")
                  let endTimePart = time?.end?.split(":")
                  let startTime = {
                    "HH": startTimePart[0].padStart(2, '0'),
                    "mm": startTimePart[1] ? startTimePart[1].padStart(2, '0') : "00"
                  }
                  let endTime = {
                    "HH": endTimePart[0].padStart(2, '0'),
                    "mm": endTimePart[1] ? endTimePart[1].padStart(2, '0') : "00"
                  }
                  class_dates.push({
                    start_time: moment(time.start, "HH:mm"),
                    class_date_range: {
                      time_id: time.timeId ? time.timeId : null,
                      day_of_week_id: time.dayOfWeekId ? time.dayOfWeekId : null,
                      start_time: time.start,
                      start_time_object: time.start ? startTime : null,
                      menu_start_time: false,
                      end_time: time.end,
                      end_time_object: time.end ? endTime : null,
                      menu_end_time: false,
                    },
                    students: time.maximumStudent,
                  },)
                }
                // TEACH DAY
                teach_day_data.push({
                  day_of_week_id: coach_date.times[0].dayOfWeekId ? coach_date.times[0].dayOfWeekId : null,
                  class_open: coach_date.status === 'Active' ? true : false,
                  teach_day: coach_date.dayOfWeekName.map(v => parseInt(v)),
                  course_coach_id: coach_date.courseCoachId,
                  class_date: class_dates,
                })
              }
              let startTimePart = data.data.coursePeriodStartDate ? data?.data?.coursePeriodStartDate?.split(":") : null
              let endTimePart = data.data.coursePeriodStartDate ? data?.data?.coursePeriodEndDate?.split(":") : null
              let startTime = startTimePart ? {
                "HH": startTimePart[0],
                "mm": startTimePart[1] ? startTimePart[1] : "00"
              } : null
              let endTime = endTimePart ? {
                "HH": endTimePart[0],
                "mm": endTimePart[1] ? endTimePart[1] : "00"
              } : null
              payload.coachs.push(
                {
                  coach_id: coach.accountId,
                  course_coach_id: coach.courseCoachId,
                  coach_name: `${coach.coachFirstNameTh} ${coach.coachLastNameTh}`,
                  coach_name_en: `${coach.coachFirstNameEn} ${coach.coachLastNameEn}`,
                  teach_day_data: [],
                  teach_days_used: [],
                  class_date_range: {
                    start_date: data.data.courseStudyStartDate ? moment(data.data.courseStudyStartDate).format("YYYY-MM-DD") : null,
                    menu_start_date: false,
                    end_date: data.data.courseStudyStartDate ? moment(data.data.courseStudyEndDate).format("YYYY-MM-DD") : null,
                    menu_end_date: false,
                  },
                  class_date_range_str: {
                    start_date: data.data.courseStudyStartDate ? new Date(data.data.courseStudyStartDate).toLocaleDateString(VueI18n.locale == 'th' ? 'th-TH' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric', }) : null,
                    end_date: data.data.courseStudyStartDate ? new Date(data.data.courseStudyEndDate).toLocaleDateString(VueI18n.locale == 'th' ? 'th-TH' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric', }) : null,
                  },
                  register_date_range: {
                    start_date: data.data.courseRegisterStartDate ? moment(data.data.courseRegisterStartDate).format("YYYY-MM-DD") : null,
                    menu_start_date: false,
                    end_date: data.data.courseRegisterStartDate ? moment(data.data.courseRegisterEndDate).format("YYYY-MM-DD") : null,
                    menu_end_date: false,
                  },
                  register_date_range_str: {
                    start_date: data.data.courseRegisterEndDate ? new Date(data.data.courseRegisterStartDate).toLocaleDateString(VueI18n.locale == 'th' ? 'th-TH' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric', }) : "",
                    end_date: data.data.courseRegisterEndDate ? new Date(data.data.courseRegisterEndDate).toLocaleDateString(VueI18n.locale == 'th' ? 'th-TH' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric', }) : "",
                  },
                  period: {
                    start_time: data.data.coursePeriodStartDate ? data.data.coursePeriodStartDate : null,
                    start_time_object: data.data.coursePeriodStartDate ? startTime : null,
                    end_time: data.data.coursePeriodEndDate ? data.data.coursePeriodEndDate : null,
                    end_time_object: data.data.coursePeriodEndDate ? endTime : null,
                  },
                },
              )
            }
          }

          if (data.data.dayOfWeek) {
            for await (let coach_date of data.data.dayOfWeek.filter(v => v.status === 'Active')) {
              // DAYS
              let dayName = dayOfWeekArray(coach_date.dayOfWeekName)
              if (payload.days.filter(v => v.dayName === dayName).length === 0) {
                let times = []
                for await (let time of coach_date.times) {
                  if (times.filter(v => v.start === time.start && v.end === time.end).length === 0) {
                    times.push({
                      start: time.start,
                      end: time.end,
                      timeData: []
                    })
                    for await (let t of times) {
                      if (t.timeData.filter(v => v.courseCoachId == coach_date.courseCoachId).length === 0) {
                        t.timeData.push({
                          maximumStudent: time.maximumStudent,
                          dayOfWeekId: time.dayOfWeekId,
                          timeId: time.timeId,
                          courseCoachId: coach_date.courseCoachId,
                          coach_name: data.data.coachs.filter(v => v.courseCoachId === coach_date.courseCoachId)[0].coachFirstNameTh + " " + data.data.coachs.filter(v => v.courseCoachId === coach_date.courseCoachId)[0].coachLastNameTh,
                          coach_name_en: data.data.coachs.filter(v => v.courseCoachId === coach_date.courseCoachId)[0].coachFirstNameEn + " " + data.data.coachs.filter(v => v.courseCoachId === coach_date.courseCoachId)[0].coachLastNameEn,
                          coach_id: data.data.coachs.filter(v => v.courseCoachId === coach_date.courseCoachId)[0].accountId
                        })
                      }
                    }
                  }
                }
                payload.days.push({
                  day: coach_date.dayOfWeekName,
                  dayName: dayName,
                  times: times,
                })

              } else {
                for await (let day of payload.days.filter(v => v.dayName === dayName)) {
                  for (let time of coach_date.times) {
                    if (day.times.filter(v => v.start == time.start && v.end == time.end).length > 0) {
                      for await (let day_time of day.times.filter(v => v.start == time.start && v.end == time.end)) {
                        if (day_time.timeData.filter(v => v.courseCoachId === coach_date.courseCoachId).length === 0) {
                          day_time.timeData.push(
                            {
                              maximumStudent: time.maximumStudent,
                              dayOfWeekId: time.dayOfWeekId,
                              timeId: time.timeId,
                              courseCoachId: coach_date.courseCoachId,
                              coach_name: data.data.coachs.filter(v => v.courseCoachId === coach_date.courseCoachId)[0].coachFirstNameTh + " " + data.data.coachs.filter(v => v.courseCoachId === coach_date.courseCoachId)[0].coachLastNameTh,
                              coach_name_en: data.data.coachs.filter(v => v.courseCoachId === coach_date.courseCoachId)[0].coachFirstNameEn + " " + data.data.coachs.filter(v => v.courseCoachId === coach_date.courseCoachId)[0].coachLastNameEn,
                              coach_id: data.data.coachs.filter(v => v.courseCoachId === coach_date.courseCoachId)[0].accountId
                            }
                          )
                        }
                      }
                    } else {
                      let times = []
                      for await (let time of coach_date.times) {
                        if (!day.times.some(v => v.start === time.start && v.end === time.end)) {
                          times.push({
                            start: time.start,
                            end: time.end,
                            timeData: []
                          })
                          for await (let t of times) {
                            if (t.timeData.filter(v => v.courseCoachId == coach_date.courseCoachId).length === 0) {
                              t.timeData.push({
                                maximumStudent: time.maximumStudent,
                                dayOfWeekId: time.dayOfWeekId,
                                timeId: time.timeId,
                                courseCoachId: coach_date.courseCoachId,
                                coach_name: data.data.coachs.filter(v => v.courseCoachId === coach_date.courseCoachId)[0].coachFirstNameTh + " " + data.data.coachs.filter(v => v.courseCoachId === coach_date.courseCoachId)[0].coachLastNameTh,
                                coach_name_en: data.data.coachs.filter(v => v.courseCoachId === coach_date.courseCoachId)[0].coachFirstNameEn + " " + data.data.coachs.filter(v => v.courseCoachId === coach_date.courseCoachId)[0].coachLastNameEn,
                                coach_id: data.data.coachs.filter(v => v.courseCoachId === coach_date.courseCoachId)[0].accountId
                              })
                            }
                          }
                        }
                      }
                      day.times.push(...times)
                    }
                  }
                }
              }
            }
          }
          if (payload.coachs.length > 0) {

            for await (let coach of payload.coachs) {
              let teach_day = teach_day_data.filter(v => v.course_coach_id === coach.course_coach_id)
              teach_day.map((v) => {
                v?.class_date?.sort((a, b) => {
                  const startTimeA = moment(a.start_time);
                  const startTimeB = moment(b.start_time);
                  return startTimeA - startTimeB;
                });
                return v
              })
              coach.teach_day_data = teach_day
            }
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
                option_name_en: package_data.optionNameEn,
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
            for (let package_data of payload.packages) {
              package_data.options = options?.filter(v => v.package_id === package_data.package_id)?.sort((a, b) => {
                return a.amount - b.amount;
              });
            }
          }
          let config = {
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-type": "Application/json",
              'Authorization': `Bearer ${VueCookie.get("token")}`
            }
          }
          if (payload.course_type_id === "CT_1") {
            await context.commit("SetCourseData", payload)
          } else {
            let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/order/count/student?courseId=${course_id}`, config)
            if (data.statusCode === 200) {
              for (const student_data of data.data) {
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
        console.log(error)
      }
    },
    // COURSE :: CREATE
    async CreateCourse(context) {
      context.commit("SetCourseIsLoading", true)
      try {
        let course = context.state.course_data
        let payload = {
          "reservation": course.reservation,
          "reservationEndDate": course.reservation_end_date,
          "reservationStartDate": course.reservation_start_date,
          "categoryId": course.category_id,
          "courseTypeId": course.course_type_id,
          "courseImg": "",
          "courseNameTh": course.course_name_th,
          "courseNameEn": course.course_name_en,
          "courseOpenDate": course.course_open_date,
          "coursePerTime": course.course_hours,
          "startDate": course.start_date,
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
                  "start": date.class_date_range.start_time,
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
        data_payload.append("img_privilage", course.privilege_file)
        if (course.artwork_file) {
          for (let i = 0; i < course.artwork_file.length; i++) {
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
        let { data } = await axios.post(`${process.env.VUE_APP_URL}/api/v1/course/create`, data_payload, config)
        if (data.statusCode === 201) {
          context.commit("SetCourseIsLoading", false)
          router.replace({ name: "CourseList" })
          Swal.fire({
            icon: "success",
            title: VueI18n.t("succeed"),
            text: VueI18n.t("course has been created"),
            showDenyButton: false,
            showCancelButton: false,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
        } else {
          context.commit("SetCourseIsLoading", false)
          throw { message: data }
        }
      } catch (error) {
        context.commit("SetCourseIsLoading", false)
      }
    },
    // COURSE :: FILTER
    async GetCoursesFilter(context, { category_id, status, course_type_id, limit, page, search }) {
      if (page == 1) {
        context.commit("SetCoursesIsLoading", true)
      }
      try {
        if (!status) {
          status = ["Active", "Reserve"]
        }
        if (!course_type_id) {
          course_type_id = 'CT_1'
        }
        let query = ''
        if (search) {
          query = `&search=${search}`
        }
        // let localhost = "http://localhost:3000"
        // let { data } = await axios.get(`${localhost}/api/v1/course/limit?category_id=${category_id}&status=${status}&course_type_id=${course_type_id}&limit=${limit}&page=${page}${query}`)
        let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/course/limit?category_id=${category_id}&status=${status}&course_type_id=${course_type_id}&limit=${limit}&page=${page}${query}`)
        if (data.statusCode === 200) {
          for (const course of data.data) {
            // let course_studant_amount = 0
            course.student_course_data = []
            course.show = false
            course.course_url = course.course_img ? `${process.env.VUE_APP_URL}/api/v1/files/${course.course_img}` : ""
          }
          context.commit("SetFilterCourseOption", { limit: limit, page: page, count: data.data.length })
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
    // COURSE :: Delete Day Of Week
    async DeleteDayOfWeek(context, { day_of_week_id }) {
      try {
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            'Authorization': `Bearer ${VueCookie.get("token")}`
          }
        }
        let { data } = await axios.delete(`${process.env.VUE_APP_URL}/api/v1/manage/dayOfWeek/${day_of_week_id}`, config)
        if (data.statusCode === 200) {
          if (data.data[0] === "Delete Unsuccessfully:") {
            Swal.fire({
              icon: "error",
              text: VueI18n.t("can't be deleted Because the enrollment"),
              timer: 3000,
              timerProgressBar: true,
              showCancelButton: false,
              showConfirmButton: false,
            })
          } else {
            Swal.fire({
              icon: "success",
              title: VueI18n.t("succeed"),
              text: VueI18n.t("teaching days already deleted"),
              showDenyButton: false,
              showCancelButton: false,
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            })
          }
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: VueI18n.t("something went wrong"),
          timer: 3000,
          showDenyButton: false,
          showCancelButton: false,
          showConfirmButton: false,
          timerProgressBar: true,
        })
      }
    },
    // COURSE :: Delete Time
    async DeleteTime(context, { time_id }) {
      try {
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            'Authorization': `Bearer ${VueCookie.get("token")}`
          }
        }
        let { data } = await axios.delete(`${process.env.VUE_APP_URL}/api/v1/manage/time/${time_id}`, config)
        if (data.statusCode === 200) {
          if (data.data[0] === "Delete Unsuccessfully:") {
            Swal.fire({
              icon: "error",
              text: VueI18n.t("can't be deleted Because the enrollment"),
              timer: 3000,
              timerProgressBar: true,
              showCancelButton: false,
              showConfirmButton: false,
            })
          } else {
            Swal.fire({
              icon: "success",
              title: VueI18n.t("succeed"),
              text: VueI18n.t("teaching days already deleted"),
              showDenyButton: false,
              showCancelButton: false,
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            })
          }
        }
      } catch (error) {
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

        } else {
          throw { error: data };
        }
      } catch (error) {
        console.log(error);
      }

    },
    // EXPORT COURSE STUDENT LIST
    async ExportStudentList(context, { coach_list, course_id, course_name, course_type_id, lang }) {
      context.commit("SetExportIsLoading", true)
      try {
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            'Authorization': `Bearer ${VueCookie.get("token")}`
          }
        }
        let report = []
        const checked_count = coach_list.filter(v => v.checked)?.length
        let checking = []
        for await (const coach of coach_list) {

          if (coach.checked) {
            for await (const date of coach.datesList) {

              if (date.checked) {
                // const localhost = 'http://localhost:3000'
                let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/studentlist/checkin/course/${course_id}/coach/${coach.coachId}/date/${date.date}/time/${date.timeId}`, config)
                if (data.statusCode === 200) {
                  if (data.data.length > 0) {
                    for await (const student of data.data) {
                      if (course_type_id === "CT_1") {
                        report.push({
                          [lang == 'en' ? "date" : "วันที่"]: date.date,
                          [lang == 'en' ? "time" : "เวลาเรียน"]: date.time,
                          [lang == 'en' ? "coach name" : "ชื่อโค้ช"]: lang == "en" ? coach.coachNameEn : coach.coachName,
                          [lang == 'en' ? "student nickname" : "ชื่อเล่นนักเรียน"]: student?.nicknameEn !== null ? lang == "en" ? `${student?.nicknameEn}` : `${student?.nicknameTh}` : `${student?.nicknameTh}`,
                          [lang == 'en' ? "student name" : "ชื่อนักเรียน"]: lang == "en" ? `${student.firstNameEn} ${student.lastNameEn}` : `${student.firstNameTh} ${student.lastNameTh}`,
                          [lang == 'en' ? "class" : "ระดับชั้น"]: student?.classNameTh ? student?.classNameTh : student?.classNameTh,
                          [lang == 'en' ? "package" : "แพ็กเกจ"]: date.cpo.packageName,
                          [lang == 'en' ? "period" : "ระยะเวลา"]: lang == 'en' ? student.cpo?.optionNameEn : student.cpo?.optionName,
                          [lang == 'en' ? "times" : "จำนวนครั้ง"]: `${student.countCheckIn}/${student.totalDay}`,
                          [lang == 'en' ? "attendance" : "การเข้าเรียน"]: lang == 'en' ? student.statu : student.status === "punctual" ? "ตรงเวลา" :
                            student.status === "late" ? "สาย" :
                              student.status === "leave" ? "ลา" :
                                student.status === "emergency leave" ? 'ลาฉุกเฉิน' :
                                  student.status === "absent" ? 'ขาด' : '-',
                          [lang == 'en' ? "evolution" : "ระดับพัฒนาการ"]: lang == 'en' ? student.assessment?.evolution : student.assessment?.evolution ? student.assessment?.evolution === "very good" ? 'ดีมาก' : student.assessment?.evolution === "good" ? 'ดี' : 'ปรับปรุง' : '-',
                          [lang == 'en' ? "interest" : "ระดับความสนใจ"]: lang == 'en' ? student.assessment?.interest : student.assessment?.interest ? student.assessment?.interest === "very good" ? 'ดีมาก' : student.assessment?.interest === "good" ? 'ดี' : 'ปรับปรุง' : '-',
                          [lang == 'en' ? "remark" : "ความคิดเห็น"]: student.assessment?.remark ? student.assessment?.remark : "-",
                        })
                      } else {
                        report.push({
                          [lang == 'en' ? "date" : "วันที่"]: date.date,
                          [lang == 'en' ? "time" : "เวลาเรียน"]: date.time,
                          [lang == 'en' ? "coach name" : "ชื่อโค้ช"]: lang == "en" ? coach.coachNameEn : coach.coachName,
                          [lang == 'en' ? "student nickname" : "ชื่อเล่นนักเรียน"]: student?.nicknameEn !== null ? lang == "en" ? `${student?.nicknameEn}` : `${student?.nicknameTh}` : `${student?.nicknameTh}`,
                          [lang == 'en' ? "student name" : "ชื่อนักเรียน"]: lang == "en" ? `${student.firstNameEn} ${student.lastNameEn}` : `${student.firstNameTh} ${student.lastNameTh}`,
                          [lang == 'en' ? "class" : "ระดับชั้น"]: student?.classNameTh ? student?.classNameTh : student?.classNameTh,
                          [lang == 'en' ? "attendance" : "การเข้าเรียน"]: lang == 'en' ? student.statu : student.status === "punctual" ? "ตรงเวลา" :
                            student.status === "late" ? "สาย" :
                              student.status === "leave" ? "ลา" :
                                student.status === "emergency leave" ? 'ลาฉุกเฉิน' :
                                  student.status === "absent" ? 'ขาด' : '-',
                          [lang == 'en' ? "evolution" : "ระดับพัฒนาการ"]: lang == 'en' ? student.assessment?.evolution : student.assessment?.evolution ? student.assessment?.evolution === "very good" ? 'ดีมาก' : student.assessment?.evolution === "good" ? 'ดี' : 'ปรับปรุง' : '-',
                          [lang == 'en' ? "interest" : "ระดับความสนใจ"]: lang == 'en' ? student.assessment?.interest : student.assessment?.interest ? student.assessment?.interest === "very good" ? 'ดีมาก' : student.assessment?.interest === "good" ? 'ดี' : 'ปรับปรุง' : '-',
                          [lang == 'en' ? "remark" : "ความคิดเห็น"]: student.assessment?.remark ? student.assessment?.remark : "-",
                        })
                      }
                    }
                  } else {

                    if (date.students.length > 0) {
                      for await (const student of date.students) {
                        if (course_type_id === "CT_1") {
                          report.push({
                            [lang == 'en' ? "date" : "วันที่"]: date.date,
                            [lang == 'en' ? "time" : "เวลาเรียน"]: date.time,
                            [lang == 'en' ? "coach name" : "ชื่อโค้ช"]: lang == "en" ? coach.coachNameEn : coach.coachName,
                            [lang == 'en' ? "student nickname" : "ชื่อเล่นนักเรียน"]: student?.nicknameEn !== null ? lang == "en" ? `${student?.nicknameEn}` : `${student?.nicknameTh}` : `${student?.nicknameTh}`,
                            // [lang == 'en' ? "student nickname" : "ชื่อเล่นนักเรียน"]: lang == "en" ? `${student?.nicknameEn}` : `${student?.nicknameTh}`,
                            [lang == 'en' ? "student name" : "ชื่อนักเรียน"]: lang == "en" ? `${student.firstNameEn} ${student.lastNameEn}` : `${student.firstNameTh} ${student.lastNameTh}`,
                            [lang == 'en' ? "class" : "ระดับชั้น"]: student?.classNameTh ? student?.classNameTh : student?.classNameTh,
                            [lang == 'en' ? "package" : "แพ็กเกจ"]: date.cpo.packageName,
                            [lang == 'en' ? "period" : "ระยะเวลา"]: lang == 'en' ? student.cpo?.optionNameEn : student.cpo?.optionName,
                            [lang == 'en' ? "times" : "จำนวนครั้ง"]: "-",
                            [lang == 'en' ? "attendance" : "การเข้าเรียน"]: "-",
                            [lang == 'en' ? "evolution" : "ระดับพัฒนาการ"]: "-",
                            [lang == 'en' ? "interest" : "ระดับความสนใจ"]: "-",
                            [lang == 'en' ? "remark" : "ความคิดเห็น"]: "-",
                          })
                        } else {
                          report.push({
                            [lang == 'en' ? "date" : "วันที่"]: date.date,
                            [lang == 'en' ? "time" : "เวลาเรียน"]: date.time,
                            [lang == 'en' ? "coach name" : "ชื่อโค้ช"]: lang == "en" ? coach.coachNameEn : coach.coachName,
                            [lang == 'en' ? "student nickname" : "ชื่อเล่นนักเรียน"]: student?.nicknameEn !== null ? lang == "en" ? `${student?.nicknameEn}` : `${student?.nicknameTh}` : `${student?.nicknameTh}`,
                            [lang == 'en' ? "student name" : "ชื่อนักเรียน"]: lang == "en" ? `${student.firstNameEn} ${student.lastNameEn}` : `${student.firstNameTh} ${student.lastNameTh}`,
                            [lang == 'en' ? "class" : "ระดับชั้น"]: student?.classNameTh ? student?.classNameTh : student?.classNameTh,
                            [lang == 'en' ? "attendance" : "การเข้าเรียน"]: "-",
                            [lang == 'en' ? "evolution" : "ระดับพัฒนาการ"]: "-",
                            [lang == 'en' ? "interest" : "ระดับความสนใจ"]: "-",
                            [lang == 'en' ? "remark" : "ความคิดเห็น"]: "-",
                          })
                        }
                      }
                    } else {
                      for await (const student of coach.studentArr) {
                        if (course_type_id === "CT_1") {
                          report.push({
                            [lang == 'en' ? "date" : "วันที่"]: date.date,
                            [lang == 'en' ? "time" : "เวลาเรียน"]: date.time,
                            [lang == 'en' ? "coach name" : "ชื่อโค้ช"]: lang == "en" ? coach.coachNameEn : coach.coachName,
                            // [lang == 'en' ? "student nickname" : "ชื่อเล่นนักเรียน"]: lang == "en" ? `-` : `-`,
                            [lang == 'en' ? "student nickname" : "ชื่อเล่นนักเรียน"]: student?.nicknameEn !== null ? lang == "en" ? `${student?.nicknameEn}` : `${student?.nicknameTh}` : `${student?.nicknameTh}`,
                            [lang == 'en' ? "student name" : "ชื่อนักเรียน"]: lang == "en" ? `${student.firstNameEn} ${student.lastNameEn}` : `${student.firstNameTh} ${student.lastNameTh}`,
                            [lang == 'en' ? "class" : "ระดับชั้น"]: student?.classNameTh ? student?.classNameTh : student?.classNameTh,
                            [lang == 'en' ? "package" : "แพ็กเกจ"]: date.cpo.packageName,
                            [lang == 'en' ? "period" : "ระยะเวลา"]: lang == 'en' ? student.cpo?.optionNameEn : student.cpo?.optionName,
                            [lang == 'en' ? "times" : "จำนวนครั้ง"]: "-",
                            [lang == 'en' ? "attendance" : "การเข้าเรียน"]: "-",
                            [lang == 'en' ? "evolution" : "ระดับพัฒนาการ"]: "-",
                            [lang == 'en' ? "interest" : "ระดับความสนใจ"]: "-",
                            [lang == 'en' ? "remark" : "ความคิดเห็น"]: "-",
                          })
                        } else {
                          report.push({
                            [lang == 'en' ? "date" : "วันที่"]: date.date,
                            [lang == 'en' ? "time" : "เวลาเรียน"]: date.time,
                            [lang == 'en' ? "coach name" : "ชื่อโค้ช"]: lang == "en" ? coach.coachNameEn : coach.coachName,
                            [lang == 'en' ? "student nickname" : "ชื่อเล่นนักเรียน"]: student?.nicknameEn !== null ? lang == "en" ? `${student?.nicknameEn}` : `${student?.nicknameTh}` : `${student?.nicknameTh}`,
                            [lang == 'en' ? "student name" : "ชื่อนักเรียน"]: lang == "en" ? `${student.firstNameEn} ${student.lastNameEn}` : `${student.firstNameTh} ${student.lastNameTh}`,
                            [lang == 'en' ? "class" : "ระดับชั้น"]: student?.classNameTh ? student?.classNameTh : student?.classNameTh,
                            [lang == 'en' ? "times" : "จำนวนครั้ง"]: "-",
                            [lang == 'en' ? "attendance" : "การเข้าเรียน"]: "-",
                            [lang == 'en' ? "evolution" : "ระดับพัฒนาการ"]: "-",
                            [lang == 'en' ? "interest" : "ระดับความสนใจ"]: "-",
                            [lang == 'en' ? "remark" : "ความคิดเห็น"]: "-",
                          })
                        }
                      }
                    }
                  }
                }
              }
            }
            checking.push(coach.checked)
          }
        }
        if (checked_count === checking?.length) {
          var workbook = XLSX.utils.book_new();
          var worksheet = XLSX.utils.json_to_sheet(report);
          XLSX.utils.book_append_sheet(workbook, worksheet, "sheet 1");
          var excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
          var blob = new Blob([excelBuffer], { type: "application/octet-stream" });
          var url = URL.createObjectURL(blob);
          var link = document.createElement("a");
          link.href = url;
          link.download = `${course_name}.xlsx`;
          link.click();
          URL.revokeObjectURL(url);
          context.commit("SetExportIsLoading", false)
        } else {
          context.commit("SetExportIsLoading", false)
        }
      } catch (error) {
        context.commit("SetExportIsLoading", false)
        console.log(error)
      }
    },
    // EXPORT END COURSE STUDENT LIST
    async ExportEndStudentList(context, { coach_list, course_id, lang }) {
      context.commit("SetExportIsLoading", true)
      try {
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            'Authorization': `Bearer ${VueCookie.get("token")}`
          }
        }
        let report = []
        let checking = []
        let coachPotential = coach_list.filter(v => v.studentPotentialArr?.length > 0)
        for await (let coach of coachPotential) {
          let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/studentlist/checkin/course/${course_id}/coach/${coach.coachId}`, config)
          if (data.statusCode === 200) {
            for await (let student of data.data) {
              report.push({
                [lang == 'en' ? "date" : "วันที่"]: moment(student?.date).format("DD-MM-YYYY"),
                [lang == 'en' ? "student name" : "ชื่อนักเรียน"]: lang == 'en' ? `${student?.firstNameEn} ${student?.lastNameEn}` : `${student?.firstNameTh} ${student?.lastNameTh}`,
                [lang == 'en' ? "student nickname" : "ชื่อเล่นนักเรียน"]: student?.nicknameEn !== null ? lang == "en" ? `${student?.nicknameEn}` : `${student?.nicknameTh}` : `${student?.nicknameTh}`,
                [lang == 'en' ? "class" : "ระดับชั้น"]: student?.classNameTh ? student?.classNameTh : student?.classNameTh,
                [lang == 'en' ? "coach name" : "ชื่อโค้ช"]: lang == 'en' ? student?.coachNameEn : student?.coachName,
                [lang == 'en' ? "times" : "จำนวนครั้ง"]: `${student?.countCheckIn}/${student?.totalDay}`,
                [lang == 'en' ? "evolution" : "ระดับพัฒนาการ"]: lang == 'en' ? student?.evolution : student?.evolution ? student?.evolution === "very good" ? 'ดีมาก' : student?.evolution === "good" ? 'ดี' : 'ปรับปรุง' : '-',
                [lang == 'en' ? "interest" : "ระดับความสนใจ"]: student?.interest ? student?.interest : '-',
                [lang == 'en' ? "remark" : "ความคิดเห็น"]: student?.remark ? student?.remark : '-',
              })
            }
          }
          checking.push(coach)
        }

        if (checking.length === coachPotential?.length) {
          if (report.length > 0) {
            var workbook = XLSX.utils.book_new();
            var worksheet = XLSX.utils.json_to_sheet(report);
            XLSX.utils.book_append_sheet(workbook, worksheet, "sheet 1");
            var excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
            var blob = new Blob([excelBuffer], { type: "application/octet-stream" });
            var url = URL.createObjectURL(blob);
            var link = document.createElement("a");
            link.href = url;
            link.download = `รายชื่อนักเรียนจบคอร์ส.xlsx`;
            link.click();
            URL.revokeObjectURL(url);
          }
          context.commit("SetExportIsLoading", false)
        } else {
          context.commit("SetExportIsLoading", false)
        }
      } catch (error) {
        context.commit("SetExportIsLoading", false)
        console.log(error)
      }
    },
    // EXPORT STUDENT RESEVE
    async ExportReserveCourse(context, { studentReserveList, lang }) {
      try {
        let report = []
        for await (const student of studentReserveList) {
          const dowName = student?.dayOfWeekName?.split(",")
          const statusText = [
            { th: "รอกสนติดต่อ", en: "waiting" },
            { th: "ติดต่อแล้ว", en: "contacted" },
            { th: "ยกเลิกการจอง", en: "cancel" },
          ]
          report.push({
            [lang == 'en' ? "date" : "วันที่"]: moment(student?.createdDate).format("DD-MM-YYYY"),
            [lang == 'en' ? "status" : "สถานะ"]: lang == 'en' ? statusText.find(v => student.status == v.en).en : statusText.find(v => student.status == v.en).th,
            [lang == 'en' ? "course name" : "ชื่อคอร์ส"]: lang == 'en' ? student.courseNameEn : student.courseNameTh,
            [lang == 'en' ? "student name" : "ชื่อนักเรียน"]: lang == 'en' ? `${student?.firsNameEn} ${student?.lastNameEn}` : `${student?.firstNameTh} ${student?.lastNameTh}`,
            [lang == 'en' ? "student nickname" : "ชื่อเล่นนักเรียน"]: student?.nicknameEn !== null ? lang == "en" ? `${student?.nicknameEn}` : `${student?.nicknameTh}` : `${student?.nicknameTh}`,
            [lang == 'en' ? "class" : "ระดับชั้น"]: student?.classNameTh ? student?.classNameTh : student?.classNameTh,
            [lang == 'en' ? "tel" : "เบอร์โทรศัพท์"]: `${student?.tel}`,
            [lang == 'en' ? "coach name" : "ชื่อโค้ช"]: lang == 'en' ? `${student?.coachFirsNameEn} ${student?.coachLastNameEn}` : `${student?.coachFirstNameTh} ${student?.coachLastNameTh}`,
            [lang == 'en' ? "package" : "แพ็คเกจ"]: lang == 'en' ? `${student.packageName}-${student.optionNameEn}` : `${student.packageName}-${student.optionName}`,
            [lang == 'en' ? "date-time" : "วัน-เวลา"]: lang == 'en' ? `${dayOfWeekArray(dowName, lang)}(${student.startTime}-${student.endTime})` : `${dayOfWeekArray(dowName, lang)}(${student.startTime}-${student.endTime})`,
          })
        }
        if (report?.length > 0) {
          if (report.length === studentReserveList?.length) {
            var workbook = XLSX.utils.book_new();
            var worksheet = XLSX.utils.json_to_sheet(report);
            XLSX.utils.book_append_sheet(workbook, worksheet, "sheet 1");
            var excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
            var blob = new Blob([excelBuffer], { type: "application/octet-stream" });
            var url = URL.createObjectURL(blob);
            var link = document.createElement("a");
            link.href = url;
            link.download = `รายชื่อนักเรียนที่จอง.xlsx`;
            link.click();
            URL.revokeObjectURL(url);
          }
          context.commit("SetExportIsLoading", false)
        } else {
          context.commit("SetExportIsLoading", false)
        }
      } catch (error) {
        console.log(error)
      }
    },
  },
  getters: {
    getCourseSeats(state) {
      return state.course_seat
    },
    getCheckDate(state) {
      return state.checkDay
    },
    export_is_loading(state) {
      return state.export_is_loading
    },
    getNoChackInStudentList(state) {
      return state.no_check_in_student_list
    },
    getStudentPotentialListIsLoading(state) {
      return state.student_potential_list_is_loading
    },
    getStudentPotentialList(state) {
      return state.student_potential_list
    },
    getStudentReserveList(state) {
      return state.student_reserve_list
    },
    getStudentListIsLoading(state) {
      return state.stident_list_is_loading
    },
    getStudentList(state) {
      return state.student_list
    },
    getCoachList(state) {
      return state.coach_list
    },
    getCoachListIsLoading(state) {
      return state.coach_list_is_loading
    },
    getCourseArtwork(state) {
      return state.course_artwork
    },
    getCourseStudent(state) {
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
    getCourseTypeIsLoading(state) {
      return state.course_type_is_loading
    },
    getCoursePotential(state) {
      return state.course_potential
    },
    getFilterCourseOption(state) {
      return state.filter_course_option
    },
  },
};

export default CourseModules;

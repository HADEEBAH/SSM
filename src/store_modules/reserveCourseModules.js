import axios from "axios";
import moment from "moment";
import VueCookie from "vue-cookie";
import Swal from "sweetalert2";
import VueI18n from "../i18n";
var XLSX = require("xlsx");

function dayOfWeekArray(day) {
  let days = day;
  const weekdays = [
    VueI18n.t("sunday"),
    VueI18n.t("monday"),
    VueI18n.t("tuesday"),
    VueI18n.t("wednesday"),
    VueI18n.t("thursday"),
    VueI18n.t("friday"),
    VueI18n.t("saturday"),
  ];
  days.sort();
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
    return ranges
      .map(({ start, end }) =>
        start === end
          ? weekdays[start]
          : `${weekdays[start]} - ${weekdays[end]}`
      )
      .join(", ");
  }
}
const reserveCourseModules = {
  namespaced: true,
  state: {
    reserve_list: [],
    reserve_list_is_loading: false,
    dow_filter: [],
    time_filter: [],
    coach_filter: [],
  },
  mutations: {
    SetReserveList(state, payload) {
      state.reserve_list = payload
    },
    SetReserveListIsLoading(state, payload) {
      state.reserve_list_is_loading = payload
    },
    SetDowFilter(state, payload) {
      state.dow_filter = payload
    },
    SetTimeFilter(state, payload) {
      state.time_filter = payload
    },
    SetCoachFilter(state, payload) {
      state.coach_filter = payload
    }
  },
  actions: {
    async GetUserByRole(context) {
      try {
        const { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/account/role/R_3`)
        if (data.statusCode === 200) {
          data.data.map(v => {
            v.fullNameEn = `${v.firstNameEng} ${v.lastNameEng}`
            v.fullNameTh = `${v.firstNameTh} ${v.lastNameTh}`
            v.fullName = `${v.firstNameTh} ${v.lastNameTh} ( ${v.firstNameEng} ${v.lastNameEng} )`
            return v
          })
          context.commit('SetCoachFilter', data.data)
        }
      } catch (error) {
        console.log(error)
      }
    },
    async filterDowAndTime(context, { courses }) {
      try {
        let query = "?"
        if (courses.length > 0) {
          for (const course_id of courses) {
            query += `courseId=${course_id}&`
          }
        }
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            Authorization: `Bearer ${VueCookie.get("token")}`,
          },
        }

        const { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/course/reserve${query}`, config)
        if (data.statusCode === 200) {
          // console.log(data.data)
          const dow_filter = []
          const time_filter = []
          for (const course of data.data) {
            for (const dow of course.dow) {
              const dowName = dayOfWeekArray(dow.dowName.split(','))
              if (dow_filter.some(v => v.dowName == dowName)) {
                const dowIndex = dow_filter.findIndex(v => v.dowName == dowName)
                if (!dow_filter[dowIndex].dowId.some(v => v === dow.dowId)) {
                  dow_filter[dowIndex].dowId.push(dow.dowId)
                }
              } else {
                dow_filter.push({
                  dowId: [dow.dowId],
                  dowName: dowName
                })
              }
              for (const time of dow.times) {
                const timeName = `${time.start} - ${time.end}`
                if (time_filter.some(v => v.timeName == timeName)) {
                  const timeIndex = time_filter.findIndex(v => v.timeName == timeName)
                  if (!time_filter[timeIndex].timeId.some(v => v === time.timeId)) {
                    time_filter[timeIndex].timeId.push(time.timeId)
                  }
                } else {
                  time_filter.push({
                    timeId: [time.timeId],
                    timeName: `${time.start} - ${time.end}`,
                  })
                }
              }
            }
          }
          context.commit('SetDowFilter', dow_filter)
          context.commit('SetTimeFilter', time_filter)
        }
      } catch (error) {
        console.log(error)
      }
    },
    async ExportReserveList(context, { students, courses, course_types, packages, options, reserve_date, dows, coachs, times }) {
      try {
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            Authorization: `Bearer ${VueCookie.get("token")}`,
          },
        }
        let query = "?"
        if (students.length > 0) {
          for (const student_id of students) {
            query += `studentId=${student_id}&`
          }
        }
        if (courses.length > 0) {
          for (const course_id of courses) {
            query += `courseId=${course_id}&`
          }
        }
        if (course_types.length > 0) {
          for (const course_type_id of course_types) {
            query += `courseTypeId=${course_type_id}&`
          }
        }
        if (packages.length > 0) {
          for (const package_id of packages) {
            query += `courseTypeId=${package_id}&`
          }
        }
        if (options.length > 0) {
          for (const option_id of options) {
            query += `optionId=${option_id}&`
          }
        }
        if (dows.length > 0) {
          for (const dows_id of dows) {
            for (const dow_id of dows_id) {
              query += `dayOfWeekId=${dow_id}&`
            }
          }
        }
        if (coachs.length > 0) {
          for (const coach_id of coachs) {
            query += `coachId=${coach_id}&`
          }
        }
        if (times.length > 0) {
          for (const times_id of times) {
            for (const time_id of times_id) {
              query += `timeId=${time_id}&`
            }
          }
        }
        if (reserve_date) {
          query += `reserveDate=${reserve_date}`
        }
        const { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/order/reserve/export${query}`, config)
        if (data.statusCode === 200) {
          if (data.data.length > 0) {
            const reports = []
            for await (const reserve of data.data) {
              const dowName = dayOfWeekArray(reserve.dayOfWeekName.split(','))
              reports.push({
                "วันที่จอง": moment(reserve.createdDate).format("DD/MM/YYYY HH:mm"),
                "คอร์สเรียน": reserve.courseNameTh,
                "แพคเก็จ": reserve.packageName,
                "ระยะเวลา": reserve.optionName,
                "วันที่เรียน": dowName,
                "เวลาเรียน": `${reserve.start} - ${reserve.end}น.`,
                "โค้ช": `${reserve.coachFirstNameTh} ${reserve.coachLastNameTh}`,
                "นักเรียน": `${reserve.studentFirstNameTh} ${reserve.studentLastNameTh}`,
                "สถานะ": reserve.status === 'waiting' ? 'รอการติดต่อ' : reserve.status === 'contacted' ? 'ติดต่อแล้ว' : "ยกเลิกการจอง",
              })
            }
            var workbook = XLSX.utils.book_new();
            var worksheet = XLSX.utils.json_to_sheet(reports);
            XLSX.utils.book_append_sheet(workbook, worksheet, 'sheet1');
            var excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
            var blob = new Blob([excelBuffer], { type: "application/octet-stream" });
            var url = URL.createObjectURL(blob);
            var link = document.createElement("a");
            link.href = url;
            link.download = `reserveReport.xlsx`;
            link.click();
            URL.revokeObjectURL(url);
          }
        }
      } catch (error) {
        console.log(error)
      }
    },
    async GetReserveList(context, { search, limit, page, status }) {
      let startIndex = 0;
      let endIndex = 0;
      context.commit("SetReserveListIsLoading", true)
      try {
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            Authorization: `Bearer ${VueCookie.get("token")}`,
          },
        };

        // let { data } = await axios.get(`http://localhost:3002/api/v1/order/reserve/search-limit?searchData=${search}&limit=${limit}&page=${page}&status=${status}`, config)
        let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/order/reserve/search-limit?searchData=${search}&limit=${limit}&page=${page}&status=${status}`, config)
        if (data?.statusCode === 200) {
          startIndex = (page - 1) * limit;
          endIndex = page * limit;
          data.data.result = data.data?.result.slice(startIndex, endIndex)
          data.data.count = status === 'waiting' ? data.data?.amountPending : (status === 'cancel' ? data.data?.amountCancel : (status === 'contacted' ? data.data?.amountApproved : data.data?.amount))
          data.data.totalRows = data?.data?.searchAmount
          data.data?.result.map((item) => {
            const options = { year: "numeric", month: "long", day: "numeric" };
            const thaiLocale = "th-TH";
            item.dateTh = new Date(item.createdDate).toLocaleString(thaiLocale, options)
            item.timeTh = moment(item.createdDate).format("HH:mm")
            item.courseFullName = `${item.courseName}(${item.courseNameEn})`
            item.studentFullName = `${item.studentData.firstNameTh} ${item.studentData.lastNameTh}`
            item.studentFullNameEn = `${item.studentData.firstNameEn} ${item.studentData.lastNameEn}`
            item.createdByFullName = `${item.createdByData.firstNameTh} ${item.createdByData.lastNameTh}`
            item.createdByFullNameEn = `${item.createdByData.firstNameEn} ${item.createdByData.lastNameEn}`
            item.tel = item.createdByData.tel
          })
          await context.commit("SetReserveList", data.data)

          context.commit("SetReserveListIsLoading", false)
        }
      } catch (error) {
        context.commit("SetReserveListIsLoading", false)
      }
    },
    async UpdateStatusReserve(context, { reserve_id, reserve_data, search, limit, page, status }) {
      try {
        const config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            Authorization: `Bearer ${VueCookie.get("token")}`,
          },
        };
        // let localhost = "http://localhost:3002"
        // let { data } = await axios.patch(`${localhost}/api/v1/order/reserve/update/${reserve_id}`, reserve_data, config)
        let { data } = await axios.patch(`${process.env.VUE_APP_URL}/api/v1/order/reserve/update/${reserve_id}`, reserve_data, config)
        if (data.statusCode == 200) {
          await Swal.fire({
            icon: "success",
            title: VueI18n.t("succeed"),
            text: VueI18n.t("already edited"),
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          })
          context.dispatch("GetReserveList", {
            search: search,
            limit: limit,
            page: page,
            status: status
          })

        }
      } catch (error) {
        context.dispatch("GetReserveList", {
          search: search,
          limit: limit,
          page: page,
          status: status
        }
        )
        if (error.response?.data.statusCode == 400) {

          if (error.response.data.message == "Cannot register , fail at course monitor , course-coach or seats are full") {
            Swal.fire({
              icon: "warning",
              title: VueI18n.t("unable to register"),
              text: VueI18n.t("unable to register Due to insufficient seats or the coach teaching in another package"),
              timer: 3000,
              timerProgressBar: true,
              showCancelButton: false,
              showConfirmButton: false,
            })
          } else if (error?.response?.data?.message === "register duplicate") {
            Swal.fire({
              icon: "warning",
              title: VueI18n.t(
                "unable to register"
              ),
              text: VueI18n.t(
                "some students or students have already purchased the course"
              ),
              timer: 3000,
              timerProgressBar: true,
              showCancelButton: false,
              showConfirmButton: false,
            });
          } else if (error?.response?.data?.message == "Unable to register due to course and package status being closed.") {
            Swal.fire({
              icon: "warning",
              title: VueI18n.t("unable to register"),
              text: VueI18n.t(
                "unable to register due to course and package status being closed"
              ),
              timer: 3000,
              timerProgressBar: true,
              showCancelButton: false,
              showConfirmButton: false,
            });
          } else if (error?.response?.data?.message == "Cannot register , fail at course monitor , course-coach or seats are full") {
            Swal.fire({
              icon: "warning",
              title: VueI18n.t("unable to register"),
              text: VueI18n.t(
                "unable to register Due to insufficient seats or the coach teaching in another package"
              ),
              timer: 3000,
              timerProgressBar: true,
              showCancelButton: false,
              showConfirmButton: false,
            });
          } else if (error.response.data.message == "over register date") {
            Swal.fire({
              icon: "error",
              title: VueI18n.t("unable to register"),
              text: VueI18n.t(
                "outside the register date"
              ),
              showDenyButton: false,
              showCancelButton: false,
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            });
          } else if (error?.response?.data?.message === "Over Registration") {
            Swal.fire({
              icon: "warning",
              title: VueI18n.t("unable to registere"),
              text: VueI18n.t(
                "cannot register , The seats are full"
              ),
              timer: 3000,
              timerProgressBar: true,
              showCancelButton: false,
              showConfirmButton: false,
            });
          } else if (error?.response?.data?.message === "Unable to purchase the course because the course is in reserved status.") {
            Swal.fire({
              icon: "warning",
              title: VueI18n.t("unable to register"),
              text: VueI18n.t(
                "unable to purchase the course because the course is in reserved status"
              ),
              timer: 3000,
              timerProgressBar: true,
              showCancelButton: false,
              showConfirmButton: false,
            });
          } else if (error.response.data.message === "duplicate pending order") {
            Swal.fire({
              // icon: "error",
              // title: VueI18n.t("unable to register"),
              icon: "warning",
              title: VueI18n.t("warning"),
              text: VueI18n.t(
                "duplicate user in this course Unable to register"
              ),
              // text: VueI18n.t("unable to register Because the course is already in your registration history"),
              showCancelButton: false,
              showDenyButton: false,
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            })
          } else if (error.response.data.message === "User is duplicate in this course. Cannot enroll again") {
            Swal.fire({
              icon: "error",
              title: VueI18n.t("duplicate user in this course Unable to register"),
              showDenyButton: false,
              showCancelButton: false,
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            })
          } else if (error.response.data.message === "The price is not correct!!") {
            Swal.fire({
              icon: "error",
              title: VueI18n.t("the price is not correct payment cannot be processed"),
              showDenyButton: false,
              showCancelButton: false,
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            })
          } else if (error.response.data.message === "Cannot cancel reserve because the status is not pending") {
            Swal.fire({
              icon: "error",
              title: VueI18n.t("reservation cannot be cancelled"),
              text: VueI18n.t("this course is not in pending status"),
              showDenyButton: false,
              showCancelButton: false,
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            })
          } else {
            Swal.fire({
              icon: "error",
              title: VueI18n.t("something went wrong"),
              showDenyButton: false,
              showCancelButton: false,
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            })
          }
        } else {
          Swal.fire({
            icon: "error",
            title: VueI18n.t("something went wrong"),
            showDenyButton: false,
            showCancelButton: false,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          })
        }
      }
    },
    async UpdateStatusReserveAdmin(context, { reserve_id, reserve_data }) {
      try {
        const config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            Authorization: `Bearer ${VueCookie.get("token")}`,
          },
        };
        // let localhost = "http://localhost:3002"
        // let { data } = await axios.patch(`${localhost}/api/v1/order/reserve/update/${reserve_id}`, reserve_data, config)
        let { data } = await axios.patch(`${process.env.VUE_APP_URL}/api/v1/order/reserve/update/${reserve_id}`, reserve_data, config)
        if (data.statusCode == 200) {
          await Swal.fire({
            icon: "success",
            title: VueI18n.t("succeed"),
            text: VueI18n.t("already edited"),
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          })
        }
      } catch (error) {
        if (error.response?.data.statusCode == 400) {

          if (error.response.data.message == "Cannot register , fail at course monitor , course-coach or seats are full") {
            Swal.fire({
              icon: "warning",
              title: VueI18n.t("unable to register"),
              text: VueI18n.t("unable to register Due to insufficient seats or the coach teaching in another package"),
              timer: 3000,
              timerProgressBar: true,
              showCancelButton: false,
              showConfirmButton: false,
            })
          } else if (error?.response?.data?.message === "register duplicate") {
            Swal.fire({
              icon: "warning",
              title: VueI18n.t(
                "unable to register"
              ),
              text: VueI18n.t(
                "some students or students have already purchased the course"
              ),
              timer: 3000,
              timerProgressBar: true,
              showCancelButton: false,
              showConfirmButton: false,
            });
          } else if (error?.response?.data?.message == "Unable to register due to course and package status being closed.") {
            Swal.fire({
              icon: "warning",
              title: VueI18n.t("unable to register"),
              text: VueI18n.t(
                "unable to register due to course and package status being closed"
              ),
              timer: 3000,
              timerProgressBar: true,
              showCancelButton: false,
              showConfirmButton: false,
            });
          } else if (error?.response?.data?.message == "Cannot register , fail at course monitor , course-coach or seats are full") {
            Swal.fire({
              icon: "warning",
              title: VueI18n.t("unable to register"),
              text: VueI18n.t(
                "unable to register Due to insufficient seats or the coach teaching in another package"
              ),
              timer: 3000,
              timerProgressBar: true,
              showCancelButton: false,
              showConfirmButton: false,
            });
          } else if (error.response.data.message == "over register date") {
            Swal.fire({
              icon: "error",
              title: VueI18n.t("unable to register"),
              text: VueI18n.t(
                "outside the register date"
              ),
              showDenyButton: false,
              showCancelButton: false,
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            });
          } else if (error?.response?.data?.message === "Over Registration") {
            Swal.fire({
              icon: "warning",
              title: VueI18n.t("unable to registere"),
              text: VueI18n.t(
                "cannot register , The seats are full"
              ),
              timer: 3000,
              timerProgressBar: true,
              showCancelButton: false,
              showConfirmButton: false,
            });
          } else if (error?.response?.data?.message === "Unable to purchase the course because the course is in reserved status.") {
            Swal.fire({
              icon: "warning",
              title: VueI18n.t("unable to register"),
              text: VueI18n.t(
                "unable to purchase the course because the course is in reserved status"
              ),
              timer: 3000,
              timerProgressBar: true,
              showCancelButton: false,
              showConfirmButton: false,
            });
          } else if (error.response.data.message === "duplicate pending order") {
            Swal.fire({
              // icon: "error",
              // title: VueI18n.t("unable to register"),
              icon: "warning",
              title: VueI18n.t("warning"),
              text: VueI18n.t(
                "duplicate user in this course Unable to register"
              ),
              // text: VueI18n.t("unable to register Because the course is already in your registration history"),
              showCancelButton: false,
              showDenyButton: false,
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            })
          } else if (error.response.data.message === "User is duplicate in this course. Cannot enroll again") {
            Swal.fire({
              icon: "error",
              title: VueI18n.t("duplicate user in this course Unable to register"),
              showDenyButton: false,
              showCancelButton: false,
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            })
          } else if (error.response.data.message === "The price is not correct!!") {
            Swal.fire({
              icon: "error",
              title: VueI18n.t("the price is not correct payment cannot be processed"),
              showDenyButton: false,
              showCancelButton: false,
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            })
          } else if (error.response.data.message === "Cannot cancel reserve because the status is not pending") {
            Swal.fire({
              icon: "error",
              title: VueI18n.t("reservation cannot be cancelled"),
              text: VueI18n.t("this course is not in pending status"),
              showDenyButton: false,
              showCancelButton: false,
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            })
          } else {
            Swal.fire({
              icon: "error",
              title: VueI18n.t("something went wrong"),
              showDenyButton: false,
              showCancelButton: false,
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            })
          }
        } else {
          Swal.fire({
            icon: "error",
            title: VueI18n.t("something went wrong"),
            showDenyButton: false,
            showCancelButton: false,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          })
        }
      }
    },
    async UpdateAllStatusReserve(context, { courseId }) {
      try {
        const config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            Authorization: `Bearer ${VueCookie.get("token")}`,
          },
        };
        // let localhost = "http://localhost:3002"
        // const { data } = await axios.patch(`${localhost}/api/v1/order/reserve/update/all/${courseId}`, {}, config)
        const { data } = await axios.patch(`${process.env.VUE_APP_URL}/api/v1/order/reserve/update/all/${courseId}`, {}, config)
        if (data.statusCode === 200) {
          await Swal.fire({
            icon: "success",
            title: VueI18n.t("succeed"),
            text: VueI18n.t("already edited"),
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          })
        }
      } catch (error) {
        if (error.response?.data.statusCode == 400) {

          if (error.response.data.message == "Cannot register , fail at course monitor , course-coach or seats are full") {
            Swal.fire({
              icon: "warning",
              title: VueI18n.t("unable to register"),
              text: VueI18n.t("unable to register Due to insufficient seats or the coach teaching in another package"),
              timer: 3000,
              timerProgressBar: true,
              showCancelButton: false,
              showConfirmButton: false,
            })
          } else if (error?.response?.data?.message === "register duplicate") {
            Swal.fire({
              icon: "warning",
              title: VueI18n.t(
                "unable to register"
              ),
              text: VueI18n.t(
                "some students or students have already purchased the course"
              ),
              timer: 3000,
              timerProgressBar: true,
              showCancelButton: false,
              showConfirmButton: false,
            });
          } else if (error?.response?.data?.message == "Unable to register due to course and package status being closed.") {
            Swal.fire({
              icon: "warning",
              title: VueI18n.t("unable to register"),
              text: VueI18n.t(
                "unable to register due to course and package status being closed"
              ),
              timer: 3000,
              timerProgressBar: true,
              showCancelButton: false,
              showConfirmButton: false,
            });
          } else if (error?.response?.data?.message == "Cannot register , fail at course monitor , course-coach or seats are full") {
            Swal.fire({
              icon: "warning",
              title: VueI18n.t("unable to register"),
              text: VueI18n.t(
                "unable to register Due to insufficient seats or the coach teaching in another package"
              ),
              timer: 3000,
              timerProgressBar: true,
              showCancelButton: false,
              showConfirmButton: false,
            });
          } else if (error.response.data.message == "over register date") {
            Swal.fire({
              icon: "error",
              title: VueI18n.t("unable to register"),
              text: VueI18n.t(
                "outside the register date"
              ),
              showDenyButton: false,
              showCancelButton: false,
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            });
          } else if (error?.response?.data?.message === "Over Registration") {
            Swal.fire({
              icon: "warning",
              title: VueI18n.t("unable to registere"),
              text: VueI18n.t(
                "cannot register , The seats are full"
              ),
              timer: 3000,
              timerProgressBar: true,
              showCancelButton: false,
              showConfirmButton: false,
            });
          } else if (error?.response?.data?.message === "Unable to purchase the course because the course is in reserved status.") {
            Swal.fire({
              icon: "warning",
              title: VueI18n.t("unable to register"),
              text: VueI18n.t(
                "unable to purchase the course because the course is in reserved status"
              ),
              timer: 3000,
              timerProgressBar: true,
              showCancelButton: false,
              showConfirmButton: false,
            });
          } else if (error.response.data.message === "duplicate pending order") {
            Swal.fire({
              // icon: "error",
              // title: VueI18n.t("unable to register"),
              icon: "warning",
              title: VueI18n.t("warning"),
              text: VueI18n.t(
                "duplicate user in this course Unable to register"
              ),
              // text: VueI18n.t("unable to register Because the course is already in your registration history"),
              showCancelButton: false,
              showDenyButton: false,
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            })
          } else if (error.response.data.message === "User is duplicate in this course. Cannot enroll again") {
            Swal.fire({
              icon: "error",
              title: VueI18n.t("duplicate user in this course Unable to register"),
              showDenyButton: false,
              showCancelButton: false,
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            })
          } else if (error.response.data.message === "The price is not correct!!") {
            Swal.fire({
              icon: "error",
              title: VueI18n.t("the price is not correct payment cannot be processed"),
              showDenyButton: false,
              showCancelButton: false,
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            })
          } else if (error.response.data.message === "Cannot cancel reserve because the status is not pending") {
            Swal.fire({
              icon: "error",
              title: VueI18n.t("reservation cannot be cancelled"),
              text: VueI18n.t("this course is not in pending status"),
              showDenyButton: false,
              showCancelButton: false,
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            })
          } else {
            Swal.fire({
              icon: "error",
              title: VueI18n.t("something went wrong"),
              showDenyButton: false,
              showCancelButton: false,
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            })
          }
        } else {
          Swal.fire({
            icon: "error",
            title: VueI18n.t("something went wrong"),
            showDenyButton: false,
            showCancelButton: false,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          })
        }
      }
    }
  },
  getters: {
    reserveList(state) {
      return state.reserve_list;
    },
    reserveListIsLoading(state) {
      return state.reserve_list_is_loading;
    },
    dowFilter(state) {
      return state.dow_filter
    },
    timeFilter(state) {
      return state.time_filter
    },
    coachFilter(state) {
      return state.coach_filter
    }
  },
};

export default reserveCourseModules;

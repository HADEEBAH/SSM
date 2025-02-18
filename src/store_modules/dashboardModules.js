import axios from "axios";
import VueI18n from "../i18n";
import VueCookie from "vue-cookie";
var XLSX = require("xlsx");
import Swal from "sweetalert2";
function dayOfWeekArray(day) {
  let days = day
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
    return ranges.map(({ start, end }) => start === end ? weekdays[start] : `${weekdays[start]} - ${weekdays[end]}`).join(', ')
  }
}
const dashboardModules = {
  namespaced: true,
  state: {
    get_empty_course: [],
    get_empty_course_open: [],
    get_empty_course_close: [],
    get_course_type: {},
    // get_potential: {},
    get_potential_student_list: {},
    get_donut: {},
    get_graf: [],
    dashboard_loading: false,
    filter_years: [],
    series_chart: [],
    labels_chart: [],
    series_line_chart: [],
    labels_line_chart: [],
    labels_line_chart_month: [],
    labels_chart_en: [],
    get_student_value: [],
    get_all_student_list: [],
    get_current_student: [],
    get_potential_student: [],
    get_reserve_student: [],
    get_student_list_value: [],
    get_statustic: [],
    limit_statistic: {},
    statistic_filter: [],
    statistic_loading: false



  },
  mutations: {
    SetLoadingStatistic(state, value) {
      state.statistic_loading = value
    },
    SetStatisticFilter(state, payload) {
      state.statistic_filter = payload
    },
    SetGetStatistic(state, payload) {
      state.get_statustic = payload
    },
    SetLimitStatistic(state, payload) {
      state.limit_statistic = payload
    },
    SetGetEmptyCourse(state, payload) {
      state.get_empty_course = payload
    },
    SetGetEmptyCourseOpen(state, payload) {
      state.get_empty_course_open = payload
    },
    SetGetEmptyCourseClose(state, payload) {
      state.get_empty_course_close = payload
    },
    SetGetCourseType(state, payload) {
      state.get_course_type = payload
    },
    SetGetPotential(state, payload) {
      state.get_potential = payload
    },
    SetGetDonut(state, payload) {
      state.get_donut = payload
    },
    SetGetGraf(state, payload) {
      state.get_graf = payload
    },
    SetGetLoading(state, value) {
      state.dashboard_loading = value
    },
    SetFilterYears(state, value) {
      state.filter_years = value
    },
    SetSeriesChart(state, payload) {
      state.series_chart = payload
    },
    SetLabelsChart(state, payload) {
      state.labels_chart = payload
    },
    SetSeriesLineChart(state, payload) {
      state.series_line_chart = payload
    },
    SetLabelsLineChart(state, payload) {
      state.labels_line_chart = payload
    },
    SetLabelsLineCharMonth(state, payload) {
      state.labels_line_chart_month = payload
    },
    SetGetPotentialStudentList(state, payload) {
      state.get_potential_student_list = payload
    },
    SetLabelsChartEn(state, payload) {
      state.labels_chart_en = payload
    },
    SetGetStudentValue(state, payload) {
      state.get_student_value = payload
    },
    SetGetAllStudentList(state, payload) {
      state.get_all_student_list = payload
    },
    SetGetCurrentStudent(state, payload) {
      state.get_current_student = payload
    },
    SetGetPotentialStudent(state, payload) {
      state.get_potential_student = payload
    },
    SetGetReserveStudent(state, payload) {
      state.get_reserve_student = payload
    },
    SetGetStudentListValue(state, payload) {
      state.get_student_list_value = payload
    },

  },
  actions: {
    async FilterStatistic(context, { export_data }) {
      try {
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            'Authorization': `Bearer ${VueCookie.get("token")}`
          }
        }
        context.commit("SetLoadingStatistic", true)
        let courseTypeId = ''
        let courseId = ''
        let categoryId = ''

        if (export_data) {

          if (export_data?.courses_id) {
            for (const idCourse of export_data?.courses_id) {
              courseId += `&courseId=${idCourse}`
            }
          }
          if (export_data?.course_type_id) {
            for (const typeCourse of export_data?.course_type_id) {
              courseTypeId += `&courseTypeId=${typeCourse}`
            }
          }
          if (export_data?.category_id) {
            for (const idCategory of export_data?.category_id) {
              categoryId += `&categoryId=${idCategory}`
            }
          }
        }

        // let localhost = "http://localhost:3000"
        // let data = await axios.get(`${localhost}/api/v1/dashboard/statistic-course?limit=${''}${courseTypeId}${courseId}${categoryId}`, config)
        let data = await axios.get(`${process.env.VUE_APP_URL}/api/v1/dashboard/statistic-course?limit=${''}${courseTypeId}${courseId}${categoryId}`, config)
        if (data?.data?.statusCode === 200) {
          if (data?.data?.data?.data?.length > 0) {
            const reports = []
            for await (const reserve of data?.data?.data?.data) {
              reports.push({
                "ประเภทคอร์ส": reserve.courseTypeNameTh ? reserve.courseTypeNameTh : '',
                "อาณาจักร": reserve.categoryNameTh ? reserve.categoryNameTh : '',
                "ชื่อคอร์ส": reserve.courseNameTh ? reserve.courseNameTh : '',
                "จำนวนนักเรียนที่เรียนอยู่": reserve.studentCountInStudy ? reserve.studentCountInStudy : '',
                "วันที่เรียน": reserve.courseDateInfo ? reserve.courseDateInfo : ''
              })
            }
            reports.push({}, {
              "ประเภทคอร์ส": "รวม",
              "วันที่เรียน": data?.data?.data?.totalStudentCountInStudy ? data?.data?.data?.totalStudentCountInStudy : '',
            })
            var workbook = XLSX.utils.book_new();
            var worksheet = XLSX.utils.json_to_sheet(reports);
            XLSX.utils.book_append_sheet(workbook, worksheet, 'sheet1');
            var excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
            var blob = new Blob([excelBuffer], { type: "application/octet-stream" });
            var url = URL.createObjectURL(blob);
            var link = document.createElement("a");
            link.href = url;
            link.download = `statisticReport.xlsx`;
            link.click();
            URL.revokeObjectURL(url);
            context.commit("SetLoadingStatistic", false)

          } else {
            Swal.fire({
              icon: "warning",
              title: VueI18n.t("something went wrong"),
              text: VueI18n.t("data not found"),
              timer: 3000,
              timerProgressBar: true,
              showCancelButton: false,
              showConfirmButton: false,
            })
            context.commit("SetLoadingStatistic", false)

          }
        }
      } catch (error) {
        context.commit("SetLoadingStatistic", false)
        Swal.fire({
          icon: "warning",
          title: VueI18n.t("something went wrong"),
          text: VueI18n.t("data not found"),
          timer: 3000,
          timerProgressBar: true,
          showCancelButton: false,
          showConfirmButton: false,
        })
      }
    },
    async GetStatistic(context, { limit, page, search, category, course, courseTypeId }) {

      // {limit, page, search, category, course, courseTypeId}
      context.commit("SetLoadingStatistic", true)
      let queryLimit = ''
      let queryPage = ''
      let querySearch = ''
      let queryCategory = ''
      let queryCourse = ''
      let queryCourseTypeId = ''

      queryLimit += `&limit=${limit}`
      queryPage += `&page=${page}`
      querySearch += `&search=${search}`
      queryCategory += `&category=${category}`
      queryCourse += `&course=${course}`
      queryCourseTypeId += `&courseTypeId=${courseTypeId}`

      try {

        // let localhost = "http://localhost:3000"
        // let { data } = await axios.get(`${localhost}/api/v1/dashboard/statistic-course?${queryLimit}${queryPage}${querySearch}${queryCategory}${queryCourse}${queryCourseTypeId}`)
        let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/dashboard/statistic-course?${queryLimit}${queryPage}${querySearch}${queryCategory}${queryCourse}${queryCourseTypeId}`)

        if (data.statusCode === 200) {
          await context.commit('SetLimitStatistic', { limit: limit, page: page, count: data.data.length })
          context.commit("SetGetStatistic", data.data)
        }
        context.commit("SetLoadingStatistic", false)

      } catch (error) {

        context.commit("SetLoadingStatistic", false)

      }
    },

    // student type 1
    async GetStudentValue(context) {
      context.commit("SetGetLoading", true)

      try {
        // let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/dashboard/potencial-duplicate`)
        // let localhost = "http://localhost:3000"
        let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/dashboard/student-summary`)

        if (data.statusCode === 200) {
          context.commit("SetGetStudentValue", data.data)
          await context.dispatch("GetCourseType")
        }
      } catch (error) {
        context.commit("SetGetStudentValue", [])
        context.commit("SetGetLoading", false)

      }
    },
    // course type 2
    async GetCourseType(context) {
      try {
        let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/dashboard/course-type`)
        if (data.statusCode === 200) {
          await context.commit("SetGetCourseType", data.data)
          await context.dispatch("GetEmptyCourse")
          // await context.dispatch("GetPotential")
        }
      } catch (error) {
        await context.commit("SetGetLoading", false)
      }
    },
    // 3
    async GetEmptyCourse(context) {
      try {
        let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/dashboard/course-status`)

        let EmptyCourseOpen = []
        let EmptyCourseClose = []
        if (data.statusCode === 200) {
          data.data.courseStatus.map((items) => {
            items.time = `${items.start} - ${items.end}`
            items.dayOfWeek = dayOfWeekArray(items.dayOfWeekName.split(','))
            if (items.status === "Open") {
              EmptyCourseOpen.push(items)
            } else {
              EmptyCourseClose.push(items)
            }
          })
          // await context.dispatch("SetGetCourseType")
          await context.commit("SetGetEmptyCourse", data.data)
          await context.commit("SetGetEmptyCourseOpen", EmptyCourseOpen)
          await context.commit("SetGetEmptyCourseClose", EmptyCourseClose)
          await context.commit("SetGetLoading", false)
        }
      } catch (error) {
        await context.commit("SetGetLoading", false)
      }
    },

    async GetDonut(context, item) {
      context.commit("SetGetLoading", true)
      try {
        let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/order/dashboard/payment?month=${item.month}&year=${item.year}`)
        let chart = []
        let series_chart = []
        let labels_chart = []
        let labels_chart_en = []

        if (data?.statusCode === 200) {
          data.data.sumTotalSuccess = data.data.sumSuccess + data.data.otherTotal.sumSuccess
          data.data.sumTotalPending = data.data.sumPending + data.data.otherTotal.sumPending
          data.data.sumTotal = data.data.totalPrice + data.data.otherTotal.totalPrice
          data.data.datas?.map((items) => {
            items.stringSumSuccess = items?.sumSuccess.toLocaleString(undefined, { minimumFractionDigits: 2 })
            items.stringSumPending = items?.sumPending.toLocaleString(undefined, { minimumFractionDigits: 2 })
            items.stringTotal = items?.totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })
            chart.push(items)
          })
          data.data.otherTotal.stringSumSuccess = data.data.otherTotal?.sumSuccess.toLocaleString(undefined, { minimumFractionDigits: 2 })
          data.data.otherTotal.stringSumPending = data.data.otherTotal?.sumPending.toLocaleString(undefined, { minimumFractionDigits: 2 })
          data.data.otherTotal.stringTotal = data.data.otherTotal?.totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })

          chart.push(data.data.otherTotal)
          if (chart.length > 0) {
            chart.map((items) => {
              series_chart.push(parseFloat(items.totalPrice))
              labels_chart.push(items.courseNameTh)
              labels_chart_en.push(items.courseNameEn)

            })
          }
          context.commit("SetSeriesChart", series_chart)
          context.commit("SetLabelsChart", labels_chart)
          context.commit("SetLabelsChartEn", labels_chart_en)
          context.commit("SetGetDonut", data.data)
          context.commit("SetGetLoading", false)

        }
      } catch (error) {
        context.commit("SetGetLoading", false)

      }
    },

    async GetGraf(context, item) {
      context.commit("SetGetLoading", true)
      try {
        let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/order/dashboard/payment-income?month=${item.month}&year=${item.year}`)
        let lineChart = []
        let series_line_chart = []
        let labels_line_chart = []
        let labels_line_chart_month = []

        if (data.statusCode === 200) {

          data.data.orderData?.map((items) => {
            items.sumSuccess = parseFloat(items?.sumSuccess)
            let newDate = new Date(items.date).toLocaleDateString("en-CA")
            const date = new Date(items.date);
            const options = { weekday: 'long', timeZone: 'Asia/Bangkok', locale: 'th-TH' };
            const dayName = date.toLocaleString(VueI18n.locale == 'th' ? 'th-TH' : 'en-US', options);
            items.date = newDate.split("-")[2]
            // items.month = `เดือน ${newDate?.split("-")[1]}`
            items.month = `${VueI18n.t("month")} ${newDate?.split("-")[1]}`
            items.year = newDate.split("-")[0]
            items.thaiDayName = `${items.date} ${dayName}`
            lineChart.push(items)



          })

          if (lineChart.length > 0) {
            lineChart.map((items) => {
              series_line_chart.push(items.sumSuccess)
              labels_line_chart.push(items.thaiDayName)
              labels_line_chart_month.push(items.month)
            })
          }

          context.commit("SetSeriesLineChart", series_line_chart)
          context.commit("SetLabelsLineChart", labels_line_chart)
          context.commit("SetLabelsLineCharMonth", labels_line_chart_month)
          context.commit("SetGetGraf", data.data)
          context.commit("SetGetLoading", false)
        }
      } catch (error) {
        context.commit("SetGetLoading", false)
      }
    },

    async FilterYears(context) {
      try {
        let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/order/dashboard/year-option`)


        if (data.statusCode === 200) {
          // data.data?.map((items) => {
          //   items.thaiYears = items?.th
          //   items.usYears = items?.en
          // })
          context.commit("SetFilterYears", data.data)
          // console.log('data.data :>> ', data.data);
        }
      } catch (error) {
        context.commit("SetFilterYears", [])
      }
    },

    async GetStudentListValue(context) {
      context.commit("SetGetLoading", true)

      try {
        let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/dashboard/potencial-duplicate`)


        if (data.statusCode === 200) {
          context.commit("SetGetStudentListValue", data.data)
          await context.dispatch("GetAllStudentList")
        }
      } catch (error) {
        context.commit("SetGetStudentListValue", [])
        context.commit("SetGetLoading", false)

      }
    },
    async GetAllStudentList(context) {
      context.commit("SetGetLoading", true)

      try {
        let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/dashboard/all-student/`)


        if (data.statusCode === 200) {
          context.commit("SetGetAllStudentList", data.data)
          context.commit("SetGetLoading", false)


        }
      } catch (error) {
        context.commit("SetGetAllStudentList", [])
        context.commit("SetGetLoading", false)

      }
    },
    async GetCurrentStudent(context) {
      context.commit("SetGetLoading", true)

      try {
        // let localhost = "http://localhost:3000"
        let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/dashboard/current-student`)
        if (data.statusCode === 200) {
          context.commit("SetGetCurrentStudent", data.data)
          context.commit("SetGetLoading", false)
        }
      } catch (error) {
        context.commit("SetGetCurrentStudent", [])
        context.commit("SetGetLoading", false)

      }
    },
    async GetPotentialStudent(context) {
      context.commit("SetGetLoading", true)

      try {
        // let localhost = "http://localhost:3000"
        let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/dashboard/potential-student`)


        if (data.statusCode === 200) {
          context.commit("SetGetPotentialStudent", data.data)
          context.commit("SetGetLoading", false)

        }
      } catch (error) {
        context.commit("SetGetPotentialStudent", [])
        context.commit("SetGetLoading", false)


      }
    },
    async GetReserveStudent(context) {
      context.commit("SetGetLoading", true)
      try {
        let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/dashboard/reserve-student`)

        if (data.statusCode === 200) {
          data.data.countReserve.studentList.map((items) => {
            for (const item of items.course) {
              item.fullDateTh = new Date(item.createdDate).toLocaleDateString(VueI18n.locale == 'th' ? 'th-TH' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })
            }
          })
          context.commit("SetGetReserveStudent", data.data)
          context.commit("SetGetLoading", false)

        }
      } catch (error) {
        context.commit("SetGetReserveStudent", [])
        context.commit("SetGetLoading", false)

      }
    },


    // async GetPotential(context) {
    //   try {
    //     let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/dashboard/potencial/`)
    //     if (data.statusCode === 200) {
    //       data.data.countReserve.studentList.map((items) => {
    //         for (const item of items.course) {
    //           item.fullDateTh = new Date(item.createdDate).toLocaleDateString(
    //             "th-TH",
    //             {
    //               year: "numeric",
    //               month: "long",
    //               day: "numeric",
    //             }
    //           )
    //         }
    //       })
    //       await context.commit("SetGetLoading", false)
    //       await context.commit("SetGetPotential", data.data)
    //     }

    //   } catch (error) {
    //     await context.commit("SetGetLoading", false)
    //   }
    // },

    // async GetPotentialStudentList(context) {
    //   context.commit("SetGetLoading", true)

    //   try {

    //     let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/dashboard/potencial/`)
    //     if (data.statusCode === 200) {
    //       data.data.countReserve.studentList.map((items) => {
    //         for (const item of items.course) {
    //           item.fullDateTh = new Date(item.createdDate).toLocaleDateString(
    //             "th-TH",
    //             {
    //               year: "numeric",
    //               month: "long",
    //               day: "numeric",
    //             }
    //           )
    //         }
    //       })
    //       await context.commit("SetGetLoading", false)
    //       await context.commit("SetGetPotentialStudentList", data.data)
    //     }

    //   } catch (error) {
    //     await context.commit("SetGetLoading", false)
    //   }
    // },

  },
  getters: {
    getloadingStatistic(state) {
      return state.statistic_loading
    },
    getLimitStatistic(state) {
      return state.limit_statistic
    },
    getStatistic(state) {
      return state.get_statustic
    },
    getEmptyCourse(state) {
      return state.get_empty_course
    },
    getEmptyCourseOpen(state) {
      return state.get_empty_course_open
    },
    getEmptyCourseClose(state) {
      return state.get_empty_course_close
    },
    getCourseType(state) {
      return state.get_course_type
    },
    // getPotential(state) {
    //   return state.get_potential
    // },
    getDonut(state) {
      return state.get_donut
    },
    getGraf(state) {
      return state.get_graf
    },
    getloading(state) {
      return state.dashboard_loading
    },
    getFilterYears(state) {
      return state.filter_years
    },
    getSeriesChart(state) {
      return state.series_chart
    },
    getLabelsChart(state) {
      return state.labels_chart
    },
    getLabelsChartEn(state) {
      return state.labels_chart_en
    },
    getSeriesLineChart(state) {
      return state.series_line_chart
    },
    getLabelsLineChart(state) {
      return state.labels_line_chart
    },
    getLabelsLineChartMonth(state) {
      return state.labels_line_chart_month
    },
    getPotentialStudentList(state) {
      return state.get_potential_student_list
    },
    getStudentValue(state) {
      return state.get_student_value
    },
    getAllStudentList(state) {
      return state.get_all_student_list
    },
    getCurrentStudent(state) {
      return state.get_current_student
    },
    getPotentialStudent(state) {
      return state.get_potential_student
    },
    getReserveStudent(state) {
      return state.get_reserve_student
    },
    getStudentListValue(state) {
      return state.get_student_list_value
    },


  },
};

export default dashboardModules;

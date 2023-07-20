import axios from "axios";
// import VueCookie from "vue-cookie"
function dayOfWeekArray(day) {
  // console.log("dayOfWeekArray", day)
  // let day_arr = day
  let days = day
  // // console.log(day)
  const weekdays = [
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
    get_potential: {},
    get_donut: {},
    get_graf: [],
    dashboard_loading: false,
    filter_years: [],
    series_chart: [],
    labels_chart: [],
  },
  mutations: {
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
  },
  actions: {
    async GetEmptyCourse(context) {
      context.commit("SetGetLoading", true)

      try {
        // let { data } = await axios.get(` http://localhost:3000/api/v1/dashboard/course-status`)
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

          await context.commit("SetGetEmptyCourse", data.data)
          await context.commit("SetGetEmptyCourseOpen", EmptyCourseOpen)
          await context.commit("SetGetEmptyCourseClose", EmptyCourseClose)

          context.commit("SetGetLoading", false)

        }
      } catch (error) {
        context.commit("SetGetLoading", false)
      }
    },

    async GetCourseType(context) {
      context.commit("SetGetLoading", true)

      try {
        // let { data } = await axios.get(`http://localhost:3000/api/v1/dashboard/course-type`)
        let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/dashboard/course-type`)
        if (data.statusCode === 200) {
          context.commit("SetGetCourseType", data.data)
          // console.log("SetGetCourseType", data.data);
          context.commit("SetGetLoading", false)

        }
      } catch (error) {
        context.commit("SetGetLoading", false)

        // console.log("SetGetCourseType", error);
      }
    },

    async GetPotential(context) {
      context.commit("SetGetLoading", true)

      try {
        // let { data } = await axios.get(`http://localhost:3000/api/v1/dashboard/potencial/`)
        let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/dashboard/potencial/`)
        if (data.statusCode === 200) {
          context.commit("SetGetLoading", false)
          context.commit("SetGetPotential", data.data)
          // console.log("SetGetPotential", data.data);
        }

      } catch (error) {
        context.commit("SetGetLoading", false)
        // console.log("SetGetPotential", error);
      }
    },

    async GetDonut(context, item) {
      context.commit("SetGetLoading", true)
      console.log("GetDonut", item);
      try {
        // let { data } = await axios.get(` http://localhost:3002/api/v1/order/dashboard/payment?month=${item.month}&year=${item.year}`)
        let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/order/dashboard/payment?month=${item.month}&year=${item.year}`)
        let chart = []
        let series_chart = []
        let labels_chart = []
        if (data?.statusCode === 200) {

          console.log("data=>>>>>", data.data);
          data.data.datas?.map((items) => {
            items.sumSuccess = parseFloat(items?.sumSuccess)
            items.sumPending = parseFloat(items?.sumPending)
            items.totalPrice = parseFloat(items?.totalPrice)

            items.stringSumSuccess = items?.sumSuccess?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            items.stringSumPending = items?.sumPending?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            items.stringTotal = items?.totalPrice?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            chart.push(items)
          })
          data.data.otherTotal.stringSumSuccess = data.data.otherTotal?.sumSuccess?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          data.data.otherTotal.stringSumPending = data.data.otherTotal?.sumPending?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          data.data.otherTotal.stringTotal = data.data.otherTotal?.totalPrice?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

          chart.push(data.data.otherTotal)

          if (chart.length > 0) {
            chart.map((items)=>{
              series_chart.push(items.totalPrice)
              labels_chart.push(items.courseNameTh)
            })
          }

          context.commit("SetSeriesChart", series_chart)
          context.commit("SetLabelsChart", labels_chart)
          context.commit("SetGetDonut", data.data)
          context.commit("SetGetLoading", false)

        }
      } catch (error) {
        context.commit("SetGetLoading", false)

        // console.log("SetGetDonut", error);
      }
    },

    async GetGraf(context, item) {
      context.commit("SetGetLoading", true)
      console.log("GetGraf", item);
      try {
        // var { data } = await axios.get(`http://localhost:3002/api/v1/order/dashboard/payment-income?month=${item.month}&year=${item.year}`)
        // var { data } = await axios.get(`https://waraphat.alldemics.com/api/v1/order/dashboard/payment-income?month=${item.month}&year=${item.year}`)
        let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/order/dashboard/payment-income?month=${item.month}&year=${item.year}`)


        if (data.statusCode === 200) {
          context.commit("SetGetGraf", data.data)
          // console.log("SetGetGraf", data);


          data.data.orderData?.map((items) => {
            let newDate = new Date(items.date).toLocaleDateString("en-CA")
            // const day = newDate?.getDay();
            const date = new Date(items.date);
            const options = { weekday: 'long', timeZone: 'Asia/Bangkok', locale: 'th-TH' };
            const dayName = date.toLocaleString('th-TH', options);

            // // console.log("133", dayName);
            // let dayNames = ["วันอาทิตย์", "วันจันทร์", "วันอังคาร", "วันพุธ", "วันพฤหัสบดี", "วันศุกร์", "วันเสาร์"];
            items.date = newDate.split("-")[2]
            items.month = `เดือน ${newDate?.split("-")[1]}`
            items.year = newDate.split("-")[0]
            items.thaiDayName = `${items.date} ${dayName}`
          })
          context.commit("SetGetLoading", false)

        }
      } catch (error) {
        context.commit("SetGetLoading", false)
        // console.log("SetGetGraf", error);
      }
    },

    async FilterYears(context) {
      console.log("FilterYears");
      try {
        // var { data } = await axios.get(`http://localhost:3002/api/v1/order/dashboard/year-option`)
        let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/order/dashboard/year-option`)


        if (data.statusCode === 200) {
          data.data?.map((items) => {
            items.thaiYears = items?.th
            items.usYears = items?.en
          })
          context.commit("SetFilterYears", data.data)
          console.log("SetFilterYears", data);
        }
      } catch (error) {
        context.commit("SetFilterYears", [])
        console.log("SetFilterYears", error);
      }
    }
  },
  getters: {
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
    getPotential(state) {
      return state.get_potential
    },
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
    }
    

  },
};

export default dashboardModules;

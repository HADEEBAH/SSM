import axios from "axios";
// import VueCookie from "vue-cookie"

const dashboardModules = {
  namespaced: true,
  state: {
    get_empty_course: [],
    get_course_type: {},
    get_potential: {},
    get_donut: {},
    get_graf: [],
    dashboard_loading: false,
    filter_years: []
  },
  mutations: {
    SetGetEmptyCourse(state, payload) {
      state.get_empty_course = payload
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
  },
  actions: {
    async GetEmptyCourse(context) {
      context.commit("SetGetLoading", true)

      try {
        // let { data } = await axios.get(` http://localhost:3002/api/v1/dashboard/course-status`)
        let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/dashboard/course-status`)
        if (data.statusCode === 200) {
          context.commit("SetGetEmptyCourse", data.data)
          console.log("SetGetEmptyCourse", data.data);
          context.commit("SetGetLoading", false)

        }
      } catch (error) {
        context.commit("SetGetLoading", false)
        console.log("SetGetEmptyCourse", error);
      }
    },

    async GetCourseType(context) {
      context.commit("SetGetLoading", true)

      try {
        // let { data } = await axios.get(`http://localhost:3000/api/v1/dashboard/course-type`)
        let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/dashboard/course-type`)
        if (data.statusCode === 200) {
          context.commit("SetGetCourseType", data.data)
          console.log("SetGetCourseType", data.data);
          context.commit("SetGetLoading", false)

        }
      } catch (error) {
        context.commit("SetGetLoading", false)

        console.log("SetGetCourseType", error);
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
          console.log("SetGetPotential", data.data);
        }

      } catch (error) {
        context.commit("SetGetLoading", false)
        console.log("SetGetPotential", error);
      }
    },

    async GetDonut(context, item) {
      context.commit("SetGetLoading", true)
      console.log("GetDonut", item);
      try {
        // let { data } = await axios.get(` http://localhost:3002/api/v1/order/dashboard/payment?month=${item.month}&year=${item.year}`)
        let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/order/dashboard/payment?month=${item.month}&year=${item.year}`)
        if (data.statusCode === 200) {
          data.data.datas?.map((items) => {
            items.stringSumSuccess = items.sumSuccess.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            items.stringSumPending = items.sumPending.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            items.stringTotal = items.totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          })
          context.commit("SetGetDonut", data.data)
          console.log("SetGetDonut", data.data);

          // data.data.sumSuccessPercentage = ((data.data.sumSuccess / 100000) * 100).toString().split(".")[0]
          // data.data.sumPendingPercentage = ((data.data.sumPending / 100000) * 100).toString().split(".")[0]
          context.commit("SetGetLoading", false)

        }
      } catch (error) {
        context.commit("SetGetLoading", false)

        console.log("SetGetDonut", error);
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
          console.log("SetGetGraf", data);


          data.data.orderData?.map((items) => {
            let newDate = new Date(items.date).toLocaleDateString("en-CA")
            // const day = newDate?.getDay();
            const date = new Date(items.date);
            const options = { weekday: 'long', timeZone: 'Asia/Bangkok', locale: 'th-TH' };
            const dayName = date.toLocaleString('th-TH', options);

            // console.log("133", dayName);
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
        console.log("SetGetGraf", error);
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

    }
  },
};

export default dashboardModules;

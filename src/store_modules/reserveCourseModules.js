import axios from "axios";
import moment from "moment";
import VueCookie from "vue-cookie";
import Swal from "sweetalert2";
import VueI18n from "../i18n";
const reserveCourseModules = {
  namespaced: true,
  state: {
    reserve_list: [],
    reserve_list_is_loading: false,

  },
  mutations: {
    SetReserveList(state, payload) {
      state.reserve_list = payload
    },
    SetReserveListIsLoading(state, payload) {
      state.reserve_list_is_loading = payload
    }
  },
  actions: {
    // async GetReserveList(context) {
    //   context.commit("SetReserveListIsLoading", true)
    //   try {
    //     let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/order/reserve/getAll-studentDetail`)
    //     if (data.statusCode === 200) {
    //       data.data.map((item) => {
    //         const options = { year: "numeric", month: "long", day: "numeric" };
    //         const thaiLocale = "th-TH";
    //         item.dateTh = new Date(item.createdDate).toLocaleString(thaiLocale, options)
    //         item.timeTh = moment(item.createdDate).format("HH:mm")
    //         item.courseFullName = `${item.courseName}(${item.courseNameEn})`
    //         item.studentFullName = `${item.studentData.firstNameTh} ${item.studentData.lastNameTh}`
    //         item.studentFullNameEn = `${item.studentData.firstNameEn} ${item.studentData.lastNameEn}`
    //         item.createdByFullName = `${item.createdByData.firstNameTh} ${item.createdByData.lastNameTh}`
    //         item.createdByFullNameEn = `${item.createdByData.firstNameEn} ${item.createdByData.lastNameEn}`
    //         item.tel = item.createdByData.tel
    //       })
    //       // console.log(data.data)
    //       context.commit("SetReserveList", data.data)
    //       context.commit("SetReserveListIsLoading", false)
    //     }
    //   } catch (error) {
    //     context.commit("SetReserveListIsLoading", false)
    //   }
    // },
    async GetReserveList(context, { search, limit, page, status }) {
      let startIndex = 0;
      let endIndex = 0;
      context.commit("SetReserveListIsLoading", true)
      try {
        let localhost = "http://localhost:3002"
        let { data } = await axios.get(`${localhost}/api/v1/order/reserve/search-limit?searchData=${search}&limit=${limit}&page=${page}&status=${status}`)
        // let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/order/reserve/search-limit?searchData=${search}&limit=${limit}&page=${page}&status=${status}`)
        if (data.statusCode === 200) {
          startIndex = (page - 1) * limit;
          endIndex = page * limit;
          data.data.financeList = data.data?.financeList.slice(startIndex, endIndex)
          data.data.count = status === 'waiting' ? data.data?.amountPending : (status === 'cancel' ? data.data?.amountCancel : (status === 'contacted' ? data.data?.amountApproved : data.data?.amount))
          data.data.map((item) => {
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
          // console.log(data.data)
          context.commit("SetReserveList", data.data)
          context.commit("SetReserveListIsLoading", false)
        }
      } catch (error) {
        context.commit("SetReserveListIsLoading", false)
      }
    },
    async UpdateStatusReserve(context, { reserve_id, reserve_data }) {
      try {
        const config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            Authorization: `Bearer ${VueCookie.get("token")}`,
          },
        };
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
          context.dispatch("GetReserveList")
        }
      } catch (error) {
        context.dispatch("GetReserveList")
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
          } else if (error.response.data.message === "duplicate pending order") {
            Swal.fire({
              icon: "error",
              title: VueI18n.t("unable to register"),
              text: VueI18n.t("unable to register Because the course is already in your registration history"),
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
  },
};

export default reserveCourseModules;

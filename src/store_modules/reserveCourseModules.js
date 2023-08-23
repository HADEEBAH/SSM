import axios from "axios";
import moment from "moment";
import VueCookie from "vue-cookie";
import Swal from "sweetalert2";
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
    async GetReserveList(context) {
      context.commit("SetReserveListIsLoading", true)
      try {
        let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/order/reserve/getAll-studentDetail`)
        if (data.statusCode === 200) {
          data.data.map((item) => {
            const options = { year: "numeric", month: "long", day: "numeric" };
            const thaiLocale = "th-TH";
            item.dateTh = new Date(item.createdDate).toLocaleString(thaiLocale, options)
            item.timeTh = moment(item.createdDate).format("HH:mm")
            item.courseFullName = `${item.courseName}(${item.courseNameEn})`
            item.studentFullName = `${item.studentData.firstNameTh} ${item.studentData.lastNameTh}`
            item.createdByFullName = `${item.createdByData.firstNameTh} ${item.createdByData.lastNameTh}`
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
            title: "สำเร็จ",
            text: "( แก้ไขเรียบร้อยแล้ว )",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false
          })
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด"
        })
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

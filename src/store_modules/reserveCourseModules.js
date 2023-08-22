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
        // let localhost = "http://localhost:3002"
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
        // let localhost = "http://localhost:3002"
        let { data } = await axios.patch(`${process.env.VUE_APP_URL}/api/v1/order/reserve/update/${reserve_id}`, reserve_data, config)
        if (data.statusCode == 200) {
          await Swal.fire({
            icon: "success",
            title: "แก้ไขสำเร็จ",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
<<<<<<< HEAD
            confirmButtonText: "ตกลง",
            timer: 3000,
            timerProgressBar: true
=======
            showConfirmButton: false
>>>>>>> develop
          })
          context.dispatch("GetReserveList")
        }
      } catch (error) {
<<<<<<< HEAD
        // console.log(error)
        if(error.response?.data.statusCode == 400){
          if(error.response.data.message == "Cannot register , fail at course monitor , course-coach or seats are full"){
            Swal.fire({
                    icon: "error",
                    title: "ไม่สามารถลงทะเบียนได้",
                    text: "ไม่สามารถลงทะเบียนได้ เนื่องจากที่นั่งไม่เพียงพอ หรือ โค้ชมีสอนในแพ็กเกจอื่น",
                    showCancelButton: false,
                    confirmButtonText: "ตกลง",
                })
            }else if(error.response.data.message === "duplicate pending order"){
                Swal.fire({
                    icon: "error",
                    title: "ไม่สามารถลงทะเบียนได้",
                    text: "ไม่สามารถลลงทะเบียนได้ เนื่องจากหลักสูตรนี้อยู่ในประวัติการลงทะเบียนของคุณแล้ว",
                    showCancelButton: false,
                    confirmButtonText: "ตกลง",
                })
            }else if(error.response.data.message === "User is duplicate in this course. Cannot enroll again"){
                Swal.fire({
                    icon: "error",
                    title: "ผู้ใช้ซ้ำกันในหลักสูตรนี้ ไม่สามารถลงทะเบียนได้",
                    showCancelButton: false,
                    confirmButtonText: "ตกลง",
                })
            }else if(error.response.data.message === "The price is not correct!!"){
                Swal.fire({
                    icon: "error",
                    title: "ราคาไม่ถูกต้อง ไม่สามารถดำเนินการชำระได้",
                    showCancelButton: false,
                    confirmButtonText: "ตกลง",
                })
            }else if(error.response.data.message === "Cannot cancel reserve because the status is not pending"){
              Swal.fire({
                  icon: "error",
                  title: "ไม่สามารถยกเลิกการจองได้",
                  text: "ไม่สามารถยกเลิกการจองได้ เนื่องจากหลักสูตรนี้ไม่ได้อยู่ในสถานะรอดำเนินการ",
                  showCancelButton: false,
                  confirmButtonText: "ตกลง",
              })
          }else{
                Swal.fire({
                    icon: "error",
                    title: "เกิดข้อผิดพลาด",
                    showCancelButton: false,
                    confirmButtonText: "ตกลง",
                })
            }
          }else{
            Swal.fire({
              icon: "error",
              text: "เกิดข้อผิดพลาด",
              showCancelButton: false,
              confirmButtonText: "ตกลง",
            })
          }
=======
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด"
        })
>>>>>>> develop
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

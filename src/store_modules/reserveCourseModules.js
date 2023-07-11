import axios from "axios";
import moment from "moment";
import VueCookie from "vue-cookie";
import Swal from "sweetalert2";
const reserveCourseModules = {
    namespaced: true,
    state: {
      reserve_list : [],
      reserve_list_is_loading : false,

    },
    mutations: {
      SetReserveList(state, payload){
        state.reserve_list = payload
      },
      SetReserveListIsLoading(state, payload){
        state.reserve_list_is_loading = payload
      }
    },
    actions: {
        async GetReserveList(context){
          // console.log("GetReserveList")
          context.commit("SetReserveListIsLoading",true)
          try{
              // let localhost = "http://localhost:3002"
              let {data} = await axios.get(`${process.env.VUE_APP_URL}/api/v1/order/reserve/getAll-studentDetail`)
              if(data.statusCode === 200){
                  for(let reserve of data.data){
                    reserve.created_date = moment(reserve.createdDate).format("DD-MM-YYYY HH:mm")
                  }
                  context.commit("SetReserveList",data.data)
                  context.commit("SetReserveListIsLoading",false)
              }
          }catch(error){
              // console.log(error)
              context.commit("SetReserveListIsLoading",false)
          }
        },
        async UpdateStatusReserve(context,{reserve_id, reserve_data}){
          try{
            // console.log(reserve_id, reserve_data)
            const config = {
              headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-type": "Application/json",
                Authorization: `Bearer ${VueCookie.get("token")}`,
              },
            };
            // let localhost = "http://localhost:3002"
            let {data} = await axios.patch(`${process.env.VUE_APP_URL}/api/v1/order/reserve/update/${reserve_id}`, reserve_data, config)
            if(data.statusCode == 200){
              await Swal.fire({
                  icon:"success",
                  text: "แก้ไขสำเร็จ",
                  showDenyButton: false,
                  showCancelButton: false,
                  confirmButtonText: "ตกลง",
              }) 
            }
          }catch(error){
            // console.log(error)
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
  
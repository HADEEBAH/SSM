import axios from "axios";
import moment from "moment";
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
          console.log("GetReserveList")
          context.commit("SetReserveListIsLoading",true)
          try{
              // let localhost = "http://localhost:3002"
              let {data} = await axios.get(`${process.env.VUP_APP_URL}/api/v1/order/reserve/getAll-studentDetail`)
              if(data.statusCode === 200){
                  for(let reserve of data.data){
                    reserve.created_date = moment(reserve.createdDate).format("DD-MM-YYYY HH:mm")
                  }
                  context.commit("SetReserveList",data.data)
                  context.commit("SetReserveListIsLoading",false)
              }
          }catch(error){
              console.log(error)
              context.commit("SetReserveListIsLoading",false)
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
  
import axios from "axios";

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
        GetReserveList(context){
            context.commit("SetReserveListIsLoading",true)
            try{
                let {data} = axios.get(`${process.env.VUE_APP_URL}/api/v1/order/reserve/getAll`)
                if(data.statusCode === 200){
                    console.log(data)
                    context.commit("SetReserveList",data.data)
                    context.commit("SetReserveListIsLoading",false)
                }
            }catch(error){
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
  
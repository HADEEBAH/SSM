import axios from "axios";

const financeModules = {
  namespaced: true,
  state: {
    finance_detail : {},
  },
  mutations: {
    SetFinanceDetail(state, payload){
      state.finance_detail = payload
    },
  },
  actions: {
    async financeDetail(context,{order_number}){
      try{
        let {data} = await axios.get(`${process.env.VUE_APP_URL}/api/v1/adminpayment/${order_number}`)
        if(data.stateCode == 200){
          // console.log(data)
        }
      }catch(error){
        // console.log(error)
      }
    }
  },
  getters: {
    getFinanceDetail(state){
      return state.finance_detail
    }
  },
};

export default financeModules;

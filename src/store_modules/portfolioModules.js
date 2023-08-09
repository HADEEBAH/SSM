import axios from "axios";

const portfolioModules = {
  namespaced: true,
  state: {
    portfolio_data : {}
  },
  mutations: {
    SetPortfolioData(state, payload){
        state.portfolio_data = payload 
    }
  },
  actions: {
    async GetPortfolioData(context,{account_id}){
        try{
          let {data} = await axios.get(`${process.env.VUE_APP_URL}/api/v1/profile/portfolio/${account_id}`)
          if(data.statusCode === 200){
            context.commit("SetPortfolioData", data.data)
          
          }
        }catch(error){
            console.log(error)
        }
    }
  },
  getters: {
    portfolioData(state){
        return state.portfolio_data
    }
  },
};

export default portfolioModules;

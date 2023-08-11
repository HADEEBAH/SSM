import axios from "axios";

const portfolioModules = {
  namespaced: true,
  state: {
    portfolio_data : {},
    portfolio_is_loading : false,
  },
  mutations: {
    SetPortfolioData(state, payload){
      state.portfolio_data = payload 
    },
    SetPortfolioIsLoading(state, value){
      state.portfolio_is_loading = value
    }
  },
  actions: {
    async GetPortfolioData(context,{account_id}){
        context.commit("SetPortfolioIsLoading",true)
        try{
          let {data} = await axios.get(`${process.env.VUE_APP_URL}/api/v1/profile/portfolio/${account_id}`)
          if(data.statusCode === 200){
            context.commit("SetPortfolioData", data.data)
            context.commit("SetPortfolioIsLoading",false)
          }
        }catch(error){
          context.commit("SetPortfolioIsLoading",false)
          console.log(error)
        }
    }
  },
  getters: {
    portfolioData(state){
        return state.portfolio_data
    },
    portfolioIsloading(state){
      return state.portfolio_is_loading
  }
  },
};

export default portfolioModules;

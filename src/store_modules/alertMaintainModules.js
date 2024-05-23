import axios from "axios";
import VueCookie from "vue-cookie";
const alertMaintainModules = {
  namespaced: true,
  state: {
    alertData : {}
  },
  mutations: {
    SetAlertData(state, payload){
        state.alertData = payload
    },
    CloseAlert(state, value){
        let userDetail = JSON.parse(localStorage.getItem("userDetail"));
        state.alertData.isAlert = value
        userDetail.closeIsAlert = true
        localStorage.setItem("userDetail", JSON.stringify(userDetail))
    }
  },
  actions: {
    async GetAlertMaintain(context){
        try{
            let config = {
                headers: {
                  "Access-Control-Allow-Origin": "*",
                  "Content-type": "Application/json",
                  'Authorization': `Bearer ${VueCookie.get("token")}`
                }
            }
            const {data} = await axios.get(`${process.env.VUE_APP_URL}/api/v1/alert-maintain`, config)
            if(data.statusCode === 200){
                context.commit("SetAlertData", data.data)
            }
        }catch(error){
            console.log(error)
        }
    }
  },
  getters: {
    alertData(state){
        return state.alertData
    }
  },
};

export default alertMaintainModules;

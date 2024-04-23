import axios from "axios";
import Swal from "sweetalert2"
import VueCookie from "vue-cookie"
import VueI18n from "../i18n";

const config = {
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-type": "Application/json",
        Authorization: `Bearer ${VueCookie.get("token")}`,
    },
};
const satisfactionModules = {
    namespaced: true,
    state: {
        satisfactions: []
    },
    mutations: {
        SetSatisfactions(state, payload){
            state.satisfactions = payload
        }
    },
    actions: {
        async sendSatisfaction(context, { payload }){
            try{
              
                const {data} = await axios.post(`${process.env.VUE_APP_URL}/api/v1/satisfaction`, payload, config)
                if(data.statusCode === 201){
                    Swal.fire({
                        icon: "success",
                        title: VueI18n.t("succeed"),
                        text: VueI18n.t("thank you for participating in the satisfaction evaluation"),
                        showDenyButton: false,
                        showCancelButton: false,
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true
                    })
                }
            }catch(error){
                Swal.fire({
                    icon: "error",
                    title: VueI18n.t("fail"),
                    showDenyButton: false,
                    showCancelButton: false,
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                })
            }
        },
        async GetSatisfactionList(context){
            try {
                const {data} = await axios.get(`${process.env.VUE_APP_URL}/api/v1/satisfaction`, config)
                if (data.statusCode === 200) {
                    context.commit("SetSatisfactions", data.data)
                }
            } catch (error) {
                console.log(error)
            }
        }
    },
    getters: {
        satisfactions(state){
            return state.satisfactions
        }
    },
  };
  
  export default satisfactionModules;
  
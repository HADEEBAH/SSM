import axios from "axios"
import VueCookie from "vue-cookie"
const coachModules = {
    namespaced: true,
    state: {
        coach : {},
        coachs : {},
    },
    mutations: {
        SetCoach(state, payload){
            state.coach = payload
        },
        SetCoachs(state, payload){
            state.coachs = payload
        }
    },
    actions: {
        async GetCoach(context, {coach_id}){
            try{
                let config = {
                    headers:{
                        "Access-Control-Allow-Origin" : "*",
                        "Content-type": "Application/json",
                        'Authorization' : `Bearer ${VueCookie.get("token")}`
                    }
                  }
                let endPoint = `${process.env.VUE_APP_URL}/api/v1/mycourse/coach/${coach_id}`
                console.log(endPoint)
                let {data} = await axios.get(`${process.env.VUE_APP_URL}/api/v1/mycourse/coach/${coach_id}`,config)
                if(data.statusCode === 200){
                    console.log(data)
                }else{
                    throw data
                }
            }catch(error){
                console.log(error)
            }
        }
    },
    getters: {
        getCoach(state){
            return state.coach 
        },
        getCoachs(state){
            return state.coachs 
        }
    },
};

export default coachModules;

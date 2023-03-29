import axios from "axios"

const categoryModules = {
    namespaced: true,
    state: {
        categorys: [],
        category:{}
    },
    mutations: {
        SetCategorys(state, payload) {
            state.categorys = payload
        },
        SetCategory(state,payload){
            state.category = payload
        }
    },
    actions: {
        async GetCategorys(context) {
         
            try {
             
                console.log(process.env.VUE_APP_URL)
                let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/category`)
                // console.log("data", data);
                if (data.statusCode === 200) {
                    console.log("data", data.data);
                    context.commit("SetCategorys", data.data)
                }
            } catch (error) {
                console.log("error :", error)
            }
        },
        async GetCategoryCourse(context) {
            try {
                console.log(process.env.VUE_APP_URL)
                //let { data } = await axios.get(`http://localhost:3000/api/v1/category/course`)
                let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/category/course`)
                // console.log("data", data);
                if (data.statusCode === 200) {
                    console.log("data", data.data);
                    context.commit("SetCategorys", data.data)
                }
            } catch (error) {
                console.log("error :", error)
            }
        },
        async GetCategory(context, category_id){
            try {
              
                let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/category/${category_id}`)
                if(data.statusCode === 200){
                    context.commit("SetCategory", data.data)
                    console.log("SetCategory", data.data);
                }
            }catch(error){
                console.log(error)
            }
        }
    },
    getters: {
        getCategorys(state) {
            return state.categorys
        },
        getCategory(state) {
            console.log("abc");
            return state.category
            
        }
    },
};

export default categoryModules;

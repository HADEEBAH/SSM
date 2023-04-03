import axios from "axios"

const categoryModules = {
    namespaced: true,
    state: {
        categorys: [],
        category:{},
        category_is_loading : false,
        categorys_is_loading : false,
    },
    mutations: {
        SetCategorys(state, payload) {
            state.categorys = payload
        },
        SetCategory(state,payload){
            state.category = payload
        },
        SetCategoryIsLoading(state, value){
            state.category_is_loading = value
        },
        SetCategorysIsLoading(state, value){
            state.categorys_is_loading = value
        }
    },
    actions: {
        async GetCategorys(context) {
            context.commit("SetCategorysIsLoading", true)
            try {
                console.log(process.env.VUE_APP_URL)
                let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/category`)
                // console.log("data", data);
                if (data.statusCode === 200) {
                    console.log("data", data.data);
                    context.commit("SetCategorys", data.data)
                    context.commit("SetCategorysIsLoading", false)
                }
            } catch (error) {
                context.commit("SetCategorysIsLoading", false)
                console.log("error :", error)
            }
        },
        async GetCategoryCourse(context) {
            context.commit("SetCategorysIsLoading", true)
            try {
                console.log(process.env.VUE_APP_URL)
                let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/category/course`)
                if (data.statusCode === 200) {
                    context.commit("SetCategorys", data.data)
                    context.commit("SetCategorysIsLoading", false)
                }
            } catch (error) {
                context.commit("SetCategorysIsLoading", false)
                console.log("error :", error)
            }
        },
        async GetCategory(context, category_id){
            context.commit("SetCategoryIsLoading", true)
            try {
                let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/category/${category_id}`)
                if(data.statusCode === 200){
                    context.commit("SetCategory", data.data)
                    console.log("SetCategory", data.data);
                }
                context.commit("SetCategoryIsLoading", false)
            }catch(error){
                context.commit("SetCategoryIsLoading", false)
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
        },
        getCategoryIsLoading(state){
            return state.SetCategoryIsLoading
        },
        getCategorysIsLoading(state){
            return state.categorys_is_loading
        },
    },
};

export default categoryModules;

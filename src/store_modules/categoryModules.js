import axios from "axios"
const categoryModules = {
    namespaced: true,
    state: {
        categorys: [],
    },
    mutations: {
        SetCategorys(state, payload) {
            state.categorys = payload
        }
    },
    actions: {
        async getCategorys(context) {
            try {
                let { data } = await axios.get("http://192.168.72.187:3000/api/category")
                console.log("data", data);
                if (data.statusCode === 200) {
                    context.commit("SetCategorys", data.data)
                }
            } catch (error) {
                console.log("error :", error)
            }
        },
        // async getCategory(context, category_id) { 

        // },
    },
    getters: {
        getCategorys(state) {
            return state.categorys
        }
    },
};

export default categoryModules;

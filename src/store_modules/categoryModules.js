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
        async GetCategorys(context) {
            try {
                let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/category`)
                console.log("data", data);
                if (data.statusCode === 200) {
                    context.commit("SetCategorys", data.data)
                }
            } catch (error) {
                console.log("error :", error)
            }
        },
    },
    getters: {
        getCategorys(state) {
            return state.categorys
        }
    },
};

export default categoryModules;

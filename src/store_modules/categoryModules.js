import axios from "axios"
import Swal from "sweetalert2";
import VueCookie from "vue-cookie";
import VueI18n from "../i18n";
const categoryModules = {
    namespaced: true,
    state: {
        categorys: [],
        category: {},
        category_is_loading: false,
        categorys_is_loading: false,
    },
    mutations: {
        SetCategorys(state, payload) {
            state.categorys = payload
        },
        SetCategory(state, payload) {
            state.category = payload
        },
        SetCategoryIsLoading(state, value) {
            state.category_is_loading = value
        },
        SetCategorysIsLoading(state, value) {
            state.categorys_is_loading = value
        }
    },
    actions: {
        async GetCategorys(context) {
            context.commit("SetCategorysIsLoading", true)
            try {
                let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/category`)
                if (data.statusCode === 200) {
                    context.commit("SetCategorys", data.data)
                    context.commit("SetCategorysIsLoading", false)
                }
            } catch (error) {
                context.commit("SetCategorysIsLoading", false)
            }
        },
        async GetCategoryCourse(context) {
            context.commit("SetCategorysIsLoading", true)
            try {
                let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/category/course`)
                if (data.statusCode === 200) {
                    let categorys = data.data

                    for await (let category of categorys) {
                        category.show = false
                    }
                    context.commit("SetCategorys", categorys)
                    context.commit("SetCategorysIsLoading", false)
                }
            } catch (error) {
                context.commit("SetCategorysIsLoading", false)
            }
        },
        async GetCategory(context, category_id) {
            context.commit("SetCategoryIsLoading", true)
            try {
                let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/category/${category_id}`)
                if (data.statusCode === 200) {
                    context.commit("SetCategory", data.data)
                }
                context.commit("SetCategoryIsLoading", false)
            } catch (error) {
                context.commit("SetCategoryIsLoading", false)
            }
        },
        async DeleteCategory(context, { category_id }) {
            try {
                let config = {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Content-type": "Application/json",
                        Authorization: `Bearer ${VueCookie.get("token")}`,
                    },
                };
                let { data } = await axios.delete(`${process.env.VUE_APP_URL}/api/v1/category/${category_id}`, config)
                if (data.statusCode === 200) {
                    let category = await axios.get(`${process.env.VUE_APP_URL}/api/v1/category`)
                    if (category.data.statusCode === 200) {
                        context.commit("SetCategorys", category.data.data)
                    }

                    Swal.fire({
                        icon: "success",
                        title: VueI18n.t("succeed"),
                        text: VueI18n.t("successfully deleted item"),
                        timer: 3000,
                        timerProgressBar: true,
                        showCancelButton: false,
                        showConfirmButton: false,
                    });
                }
            } catch (error) {
                if (error.response.data.statusCode === 403) {
                    if (error.response.data.message === "Cannot delete this category because of the course") {
                        Swal.fire({
                            icon: "error",
                            title: VueI18n.t("this wls cannot be deleted because it has a course"),
                            timer: 3000,
                            timerProgressBar: true,
                            showCancelButton: false,
                            showConfirmButton: false,
                        })
                    }
                }
            }
        }
    },
    getters: {
        getCategorys(state) {
            return state.categorys
        },
        getCategory(state) {
            return state.category
        },
        getCategoryIsLoading(state) {
            return state.SetCategoryIsLoading
        },
        getCategorysIsLoading(state) {
            return state.categorys_is_loading
        },
    },
};

export default categoryModules;

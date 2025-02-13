import axios from "axios"
import Swal from "sweetalert2";
import VueCookie from "vue-cookie";
import VueI18n from "../i18n";
const categoryModules = {
    namespaced: true,
    state: {
        category_option: {},
        categorys: [],
        category: {},
        category_is_loading: false,
        categorys_is_loading: false,
        update_category: {}
    },
    mutations: {
        SetShowMore(state, payload) {
            const showMore = state.categorys.find((v) => v.categoryId === payload.categoryId).show
            state.categorys.find((v) => v.categoryId === payload.categoryId).show = !showMore
        },
        SetCategoryOption(state, payload) {
            state.category_option = payload
        },
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
        },
        SetUpdateCategory(state, value) {
            state.update_category = value
        },
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
        async GetCategoryCourse(context, { limit, page }) {
            if (page == 1) {
                context.commit("SetCategorysIsLoading", true)
            }
            try {
                // let localhost = "http://localhost:3000"
                // let { data } = await axios.get(`${localhost}/api/v1/category/limit?limit=${limit}&page=${page}`)
                let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/category/limit?limit=${limit}&page=${page}`)
                if (data.statusCode === 200) {
                    let categorys = data.data
                    for await (let category of categorys) {
                        category.show = false
                    }
                    context.commit('SetCategoryOption', { limit: limit, page: page, count: data.data.length })
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
                            title: VueI18n.t("something went wrong"),
                            text: VueI18n.t("this wls cannot be deleted because it has a course"),
                            timer: 3000,
                            timerProgressBar: true,
                            showCancelButton: false,
                            showConfirmButton: false,
                        })
                    }
                }
            }
        },
        async UpdateCategory(context, { category_id, payload }) {
            try {
                let config = {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Content-type": "Application/json",
                        Authorization: `Bearer ${VueCookie.get("token")}`,
                    },
                };
                let bodyFormData = new FormData();
                bodyFormData.append("categoryImg", null);
                bodyFormData.append("payload", JSON.stringify(payload));

                // let localhost = "http://localhost:3000"
                // let { data } = await axios.patch(`${localhost}/api/v1/category/${category_id}`, bodyFormData, config);
                let { data } = await axios.patch(`${process.env.VUE_APP_URL}/api/v1/category/${category_id}`, bodyFormData, config);
                if (data.statusCode === 200) {

                    context.commit("SetUpdateCategory", data.data)
                    Swal.fire({
                        icon: "success",
                        title: VueI18n.t("succeed"),
                        text: VueI18n.t("already edited"),
                        timer: 3000,
                        timerProgressBar: true,
                        showCancelButton: false,
                        showConfirmButton: false,
                    });
                    context.dispatch("GetCategorys")

                }
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: VueI18n.t("something went wrong"),
                    text: error.response.data.message,
                    timer: 3000,
                    timerProgressBar: true,
                    showCancelButton: false,
                    showConfirmButton: false,
                })

            }
        }


    },
    getters: {
        getCategoryOption(state) {
            return state.category_option
        },
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

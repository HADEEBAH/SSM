import axios from "axios";
// import Swal from "sweetalert2";
import VueCookie from "vue-cookie";
const bannerModules = {
  namespaced: true,
  state: {
    banner_list: [],
  },
  mutations: {
    SetBannerList(state, payload) {
      state.banner_list = payload;
    },
  },
  actions: {
    async GetBannerList(context) {
      try {
        let { data } = await axios.get(
          `${process.env.VUE_APP_URL}/api/v1/banner`
          // `http://localhost:3000/api/v1/banner`
        );
        if (data.statusCode === 200) {
          // data.data.unshift(banner_default)
          context.commit("SetBannerList", data.data);
        }
      } catch (error) {
        // console.log("error", error);

      }
    },

    async GetInsertBannerList(context, payload) {
      try {
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            'Authorization': `Bearer ${VueCookie.get("token")}`
          }
        }
        let { data } = await axios.post(
          // `http://localhost:3000/api/v1/banner`, payload ,config
          `${process.env.VUE_APP_URL}/api/v1/banner`, payload, config
        );
        // console.log("data=>", data);
        if (data.statusCode === 201) {
          context.dispatch("GetBannerList")
        }
      } catch (error) {
        // console.log("error", error);
      }
    },

    async GetDeleteBannerList(context, id) {
      try {
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            'Authorization': `Bearer ${VueCookie.get("token")}`
          }
        }
        let { data } = await axios.delete(
          // `http://localhost:3000/api/v1/banner/${id}`, config
          `${process.env.VUE_APP_URL}/api/v1/banner/${id}`, config
        );
        if (data.statusCode === 200) {
          context.dispatch("GetBannerList")
        }
      } catch (error) {
        // console.log("error", error);
      }
    },


  },
  getters: {
    getBannerList(state) {
      return state.banner_list;
    },
  },
};

export default bannerModules;

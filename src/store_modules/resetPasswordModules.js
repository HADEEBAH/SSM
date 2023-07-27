import axios from "axios";
const resetPasswordModules = {
  namespaced: true,
  state: {
    // FORGOT
    type_reset: "",
    value_reset: "",
    username_reset: "",
    response_reset: false,
    response_reset_message: "",
    response_otp: false,
    response_otp_message: ""
  },

  mutations: {
    setSendTypeForgotPassword (state, payload) {
      state.response_reset = payload
    },
    setSendTypeForgotPasswordMessage (state, payload) {
      state.response_reset_message = payload
    },
    setSendResetPassword (state, payload) {
      state.response_otp = payload
    },
    setSendResetPasswordMessage (state, payload) {
      state.response_otp_message = payload
    }
  },

  actions: {
    async SendTypeForgotPassword (context, {type, value, username = null}) {

      try {
        // const endpoint = type === "phone" ? `http://localhost:3000/api/v1/password/reset-phone` : `http://localhost:3000/api/v1/password/reset-email`
        const endpoint = type === "phone" ? `${process.env.VUE_APP_URL}/api/v1/password/reset-phone` : `${process.env.VUE_APP_URL}/api/v1/password/reset-email`
        const payload = {
          username:username,
          value:value
        }
        let {data} = await axios.post(
          `${endpoint}`,payload
        );
  
        if (data.statusCode === 201) {
          await context.commit("setSendTypeForgotPassword", data.success)
          await context.commit("setSendTypeForgotPasswordMessage", "")
        }
  
      } catch ({response}) {
        console.log("error", response);
        await context.commit("setSendTypeForgotPasswordMessage", response.data.message)
      }


    },

    async SendResetPasswordOtp (context, payload) {

      try {
        // const endpoint = `http://localhost:3000/api/v1/password/confirm-otp`
        const endpoint = `${process.env.VUE_APP_URL}/api/v1/password/confirm-otp`
  
        const config = {
          otp: payload.otp,
          newPassword: payload.new_password,
          confirmNewPassword: payload.confirm_new_password,
        }
  
        let {data} = await axios.post(endpoint,config);
  
        if (data.statusCode === 201) {
          await context.commit("setSendResetPassword", data.success)
          await context.commit("setSendResetPasswordMessage", "")
        }
  
      } catch ({response}) {
        console.log("error", response);
        await context.commit("setSendResetPasswordMessage", response.data.message)
      }

    }
  },

  getters: {
    responseTypeForgotPassword (state) {
      return state.response_reset
    },
    responseTypeForgotPasswordMessage (state) {
      return state.response_reset_message
    },

    responseResetPassword (state) {
      return state.response_otp
    },
    responseResetPasswordMessage (state) {
      return state.response_otp_message
    }
  },
};

export default resetPasswordModules;

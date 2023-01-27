const AdminMudules = {
  namespaced: true,
  state: {
    show_dialog_register_one_id : false,
    user_one_id : {
      firstname_th : "",
      lastname_th : "",
      firstname_en : "",
      lastname_en : "",
      phone_number : "",
      username : "",
      password : "",
      confirm_password : "",
    }
  },
  mutations: {
    ShowDialogRegisterOneId(state, value) {
      state.show_dialog_register_one_id = value
    },
    UserOneId(state, payload){
      state.user_one_id = payload
    }
  },
  actions: {
    changeDialogRegisterOneId(context, value){
      context.commit("ShowDialogRegisterOneId",value)
    },
    changeUserOneId(context, data){
      context.state.user_one_id = data
      console.log(context.state.user_one_id)
    }
  },
  getters :{
    getShowDialogRegisterOneId(state){
      return state.show_dialog_register_one_id
    },
    getUserOneId(state){
      return state.user_one_id
    },
  }
}

export default AdminMudules
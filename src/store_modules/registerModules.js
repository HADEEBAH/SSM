import router from "@/router"
import axios from "axios"
import Swal from "sweetalert2"
const RegisterModules = {
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
      accept_terms : false,
    }
  },
  // change state
  mutations: {
    ShowDialogRegisterOneId(state, value) {
      state.show_dialog_register_one_id = value
    },
    UserOneId(state, payload){
      state.user_one_id = payload
    }
  },
  actions: {
    async registerUserOneId(context){
      try{
        let phone_number = context.state.user_one_id.phone_number.replaceAll("-","")
        let {data} = await axios.post(" http://192.168.74.19:3000/api/v1/auth/register",{
          "accountTitleTh": "",
          "firstNameTh": context.state.user_one_id.firstname_th,
          "lastNameTh": context.state.user_one_id.lastname_th,
          "accountTitleEng": "",
          "firstNameEng": context.state.user_one_id.firstname_en,
          "lastNameEng": context.state.user_one_id.lastname_en,
          "idCardType": "",
          "idCardNum": "",
          "email": "",
          "mobileNo": phone_number,
          "userName": context.state.user_one_id.username,
          "passWord": context.state.user_one_id.password
        })
        if(data.statusCode === 201){
          Swal.fire({
            icon: 'success',
            title: data.message,
          }).then((result)=>{
            if(result.isConfirmed){
              router.push({name : 'Login'})
            }
          })
        } else { throw {message: data.message } }
      }catch(error){
        Swal.error({
          icon: 'error',
          title: error.message,
        })
      }
    },
    changeDialogRegisterOneId(context, value){
      if(value){
        context.commit("ShowDialogRegisterOneId",value)
      }else{
        context.commit("ShowDialogRegisterOneId", value)
        context.commit("UserOneId",{
          firstname_th : "",
          lastname_th : "",
          firstname_en : "",
          lastname_en : "",
          phone_number : "",
          username : "",
          password : "",
          confirm_password : "",
          accept_terms : false,
        })
      }
      
    },
    changeUserOneId(context, data){
      context.state.user_one_id = data
      console.log(context.state.user_one_id)
    },
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

export default RegisterModules
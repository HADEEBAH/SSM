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
    },
    ResetUserOneID(state){
      state.user_one_id  =  {
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
    }
  },
  actions: {
    async registerUserOneId(context){
      try{
        let phone_number = context.state.user_one_id.phone_number.replaceAll("-","")
        let {data} = await axios.post(`${process.env.VUE_APP_URL}/api/v1/auth/register`,{
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
        console.log(data)
        
        if(data.statusCode === 201){
          context.commit("ResetUserOneID")
          Swal.fire({
            icon: 'success',
            title: "ลงทะเบียนสำเร็จ",
          }).then((result)=>{
            if(result.isConfirmed){
              router.push({name : 'Login'})
            }
          })
        }
      }catch({response}){
        if(response.status === 400){
          console.log(response)
          Swal.fire({
            icon: 'error',
            title: `กรอกข้อมูลให้ถูกต้อง`,
          })
        }else{
          Swal.fire({
            icon: 'error',
            title: `เกิคข้อผิดพลาด`,
          })
        }
      }
    },
    changeDialogRegisterOneId(context, value){
      if(value){
        context.commit("ShowDialogRegisterOneId",value)
      }else{
        context.commit("ShowDialogRegisterOneId", value)
        localStorage.
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
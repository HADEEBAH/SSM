import axios from "axios"
import Swal from "sweetalert2"
import VueCookie from "vue-cookie"
import router from "@/router";
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
    },
    is_loading : false,
  },
  // change state
  mutations: {
    ShowDialogRegisterOneId(state, value) {
      state.show_dialog_register_one_id = value
    },
    SetIsLoading(state, value){
      state.is_loading = value
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
      context.commit("SetIsLoading", true)
      try{
        let phone_number = context.state.user_one_id.phone_number.replaceAll("-","")
        let {data} = await axios.post(`${process.env.VUE_APP_URL}/api/v1/register`,{
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
            title: "ลงทะเบียนสำเร็จ",
          }).then((result)=>{
            if(result.isConfirmed){
             axios.post(`${process.env.VUE_APP_URL}/api/v1/auth/login`, {
              "username": context.state.user_one_id.username,
              "password": context.state.user_one_id.password,
            }).then((res)=>{
              console.log("res : ",res)
              if (res.data.statusCode === 200) {
                  let roles_data = []
                  res.data.data.roles.forEach((role) => {
                      roles_data.push(role?.role_name_en)
                  });
                  let payload = {
                      account_id : res.data.data.account_id,
                      email : res.data.data.email,
                      first_name_en : res.data.data.first_name_en,
                      first_name_th : res.data.data.first_name_th,
                      last_name_en : res.data.data.last_name_en,
                      last_name_th : res.data.data.last_name_th,
                      role : res.data.data.role,
                      roles : roles_data,  
                      tel : res.data.data.tel,
                  }
                  VueCookie.set("token", res.data.data.token,1)
                  localStorage.setItem("userDetail",JSON.stringify(payload))
                  console.log("UserKingdom")
                  context.commit("SetIsLoading", false)
                  router.replace({ name: "UserKingdom" });
                  context.commit("ResetUserOneID")
              }
            })
            }
          })
        }
      }catch({response}){
        context.commit("SetIsLoading", false)
        if(response?.data.statusCode === 400){
          let text = ""
          switch (response.data.message.message){
            case "The mobile no must be at least 10 characters.":
              text = 'หมายเลขมือถือต้องมีอย่างน้อย 10 ตัวอักษร'
            break;
            case "username duplicate":
              text = 'username นี้ถูกใช้แล้ว'
            break;
            case "The password format is invalid.":
              text = 'รูปแบบรหัสผ่านไม่ถูกต้อง'
            break;
            case "The last name th format is invalid.":
              text = 'รูปแบบนามสกุลภาษาไทยไม่ถูกต้อง'
              break;
            case "The last name en format is invalid.":
              text = 'รูปแบบนามสกุลภาษาอังกฤษไม่ถูกต้อง'
              break;
          }
          Swal.fire({
            icon: 'error',
            title: `กรอกข้อมูลให้ถูกต้อง`,
            text : text ? text : response.data.message.message
          })
        }else{
          Swal.fire({
            icon: 'error',
            title: `เกิคข้อผิดพลาด`,
          })
        }
      }
    },
   
    async loginOneId(context) {
      context.commit("SetIsLoading", true)
        try {
            const { data } = await axios.post(`${process.env.VUE_APP_URL}/api/v1/auth/login`, {
                "username": context.state.user_one_id.username,
                "password": context.state.user_one_id.password,
            })
            console.log(data);
            if (data.statusCode === 200) {
                let roles = []
                if (data.data.roles.length > 0) {
                    data.data.roles.forEach((role) => {
                        roles.push(role.roleId)
                    });
                }
                let payload = {
                    account_id: data.data.account_id,
                    email: data.data.email,
                    first_name_en: data.data.first_name_en,
                    first_name_th: data.data.first_name_th,
                    last_name_en: data.data.last_name_en,
                    last_name_th: data.data.last_name_th,
                    role: data.data.roles,
                    roles: roles,
                    tel: data.data.tel,
                }
                VueCookie.set("token", data.data.token)
                localStorage.setItem("userDetail", JSON.stringify(payload))
                context.commit("SetIsLoading", false)
                router.replace({ name: "UserKingdom" })
            }
        } catch (response) {
          context.commit("SetIsLoading", false)
            console.log(response)
            if (response.message === "Request failed with status code 401") {
                Swal.fire({
                    icon: 'error',
                    title: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง",
                })
            } else {
                Swal.fire({
                    icon: 'error',
                    title: "เกิดข้อผิดพลาด",
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
    getIsLoading(state){
      return state.is_loading
    },
    getShowDialogRegisterOneId(state){
      return state.show_dialog_register_one_id
    },
    getUserOneId(state){
      return state.user_one_id
    },
  }
}

export default RegisterModules
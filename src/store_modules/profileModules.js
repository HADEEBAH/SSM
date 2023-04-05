import axios from "axios";
import VueCookie from "vue-cookie"
const profileModules = {
    namespaced: true,
    state: {
      user_data: {
        fname_th: "dieb",
        lname_th: "dieb",
        nationality: "TH",
        id_card: "xxxxx5656",
        date_of_birth: "20-20-20",
        tel: "165651251546",
        email: "gg@gmail.com",
  
      },
  
      profile_student_data: [
        {
          relation_id: "",
          student_id: "",
          parent_id: "",
          parent_firstname_th: "",
          parent_firstname_en: "",
          parent_lastname_th: "",
          parent_lastname_en: "",
          parent_tel: "",
          student: {
            accountId: "",
            email: "",
            firstNameTh: "",
            lastNameTh: "",
            nation: null,
            tel: ""
          },
          user_parent: {
            accountId: "",
            email: "",
            firstNameTh: "",
            lastNameTh: "",
            nation: null,
            tel: ""
          }
  
        }
      ],
  
      profile_parent_data: [
        {
          relation_id: "",
          student_id: "",
          parent_id: "",
          parent_firstname_th: "",
          parent_firstname_en: "",
          parent_lastname_th: "",
          parent_lastname_en: "",
          parent_tel: "",
          student: {
            accountId: "",
            email: "",
            firstNameTh: "",
            lastNameTh: "",
            nation: null,
            tel: ""
          },
          user_parent: {
            accountId: "",
            email: "",
            firstNameTh: "",
            lastNameTh: "",
            nation: null,
            tel: ""
          }
  
        }
      ],
  
      certificate_data: [
        {
          certificate_title: "การแข่งขันเปียโนการกุศล กลายปี 2565",
          race_day: "20 มิถุนายน 2565",
          certificate_card: "https://s3-ap-southeast-1.amazonaws.com/tksproduction/bmtimages/pY3BnhPQYpTxasKfx.jpeg",
        },
        {
          certificate_title: "การแข่งขันเปียโนการกุศล กลายปี 2565",
          race_day: "20 มิถุนายน 2565",
          certificate_card: "https://s3-ap-southeast-1.amazonaws.com/tksproduction/bmtimages/pY3BnhPQYpTxasKfx.jpeg",
        },
        {
          certificate_title: "การแข่งขันเปียโนการกุศล กลายปี 2565",
          race_day: "20 มิถุนายน 2565",
          certificate_card: "https://s3-ap-southeast-1.amazonaws.com/tksproduction/bmtimages/pY3BnhPQYpTxasKfx.jpeg",
        },
      ],
  
      password: {
        old_password: '',
        new_password: '',
        confirm_password: '',
      },
  
      security: {
        policy: ' บริษัท อินเทอร์เน็ตประเทศไทย จำกัด (มหาชน) มีความมุ่งมั่นที่จะดำเนินการตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 ให้สอดคล้องกับหลักเกณฑ์ของคณะกรรมการคุ้มครองข้อมูลส่วนบุคคลเพื่อให้มีหลักเกณฑ์การคุ้มครองสิทธิของเจ้าของข้อมูลเกี่ยวกับข้อมูลส่วนบุคคลสิทธิในความเป็นส่วนตัวและเสรีภาพในข้อมูลส่วนบุคคลของผู้เจ้าของข้อมูลและพัฒนาปรับปรุงนโยบายระเบียบปฏิบัติของ บริษัทให้ต่อเนื่องสืบไปเพื่อให้เป็นไปตามนโยบายการคุ้มครองข้อมูลส่วนบุคคลบริษัทจึงขอประกาศนโยบาย ดังนี้'
      },
  
    },
  mutations: {
    SetUserData(state, payload) {
      state.user_data = payload
    },
    
    SetProfileStudentData(state, payload) {
      state.student_data = payload
    },

    SetProfileParentData(state, payload) {
      state.parent_data = payload
    },

    SetCertificateData(state, payload) {
      state.certificate_data = payload
    },
    SetPassword(state, payload) {
      state.password = payload
    }

    },
  actions: {

    GetUserData(context, UserData) {
      context.commit("SetUserData", UserData)
      console.log("SetUserData", UserData);
    },

    // async GetProfileStudentData(context, account_id) {
    //   console.log("GetProfileStudentData", account_id);
    //   try {
    //     let config = {
    //       headers: {
    //           "Access-Control-Allow-Origin": "*",
    //           "Content-type": "Application/json",
    //           'Authorization': `Bearer ${VueCookie.get("token")}`
    //       }
    //   }
    //     let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/relations/user?parent_id${account_id}`,config)
    //     console.log("data_student",data)
    //     if (data.statusCode === 200) {
    //         context.commit("SetProfileStudentData", data.data)
    //         console.log("SetProfileStudentData", data.data);
    //     } else {
    //         throw { error: data }
    //     }
    // } catch (error) {
    //     console.log(error)
    // }
    // },

    // async GetProfileParentData(context, account_id) {
    //   console.log("GetProfileParentData", account_id);
    //   try {
    //     let config = {
    //       headers: {
    //           "Access-Control-Allow-Origin": "*",
    //           "Content-type": "Application/json",
    //           'Authorization': `Bearer ${VueCookie.get("token")}`
    //       }
    //   }
    //     let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/relations/user?student_id${account_id}`,config)
    //     console.log("data_parent",data)
    //     if (data.statusCode === 200) {
    //         context.commit("SetProfileParentData", data.data)
    //         console.log("SetProfileParentData", data.data);
    //     } else {
    //         throw { error: data }
    //     }
    // } catch (error) {
    //     console.log(error)
    // }
    // },

    async GetAll(context, account_id) {
      try {
        let config = {
          headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-type": "Application/json",
              'Authorization': `Bearer ${VueCookie.get("token")}`
          }
        }
       let data_local = JSON.parse(localStorage.getItem("userDetail"))
        if (data_local.roles.includes('R_5')) {
          let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/relations/user?student_id${account_id}`,config)
          console.log("data_parent",data)
          if (data.statusCode === 200) {
              context.commit("SetProfileParentData", data.data)
              console.log("SetProfileParentData", data.data);
          } else {
              throw { error: data }
          }
         }else{
          let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/relations/user?parent_id${account_id}`,config)
        console.log("data_student",data)
        if (data.statusCode === 200) {
            context.commit("SetProfileStudentData", data.data)
            console.log("SetProfileStudentData", data.data);
        } else {
            throw { error: data }
        }
         }
      } catch (error) {
        console.log(error)
    }
      
    },

    ChangeCertificateData(context, certificateData) {
      context.commit("SetCertificateData", certificateData)
    },
    
    ChangePassword(context, newPassword) {
      context.commit("SetPassword",newPassword )
    }

    },
  getters: {
    getUserData(state) {
      return state.user_data
    },
    getProfileStudentData(state) {
      return state.profile_student_data
    },
    getProfileParentData(state) {
      return state.profile_parent_data
    },
    getCertificateData(state) {
      return state.certificate_data
    },
    getPassword(state) {
      return state.password
    }
    },
  };
  
  export default profileModules;
  
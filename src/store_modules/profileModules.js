import axios from "axios";
import VueCookie from "vue-cookie"
const profileModules = {
  namespaced: true,
  state: {
    students: [],
    class_list: [],
    user_data: {
      fname_th: "dieb",
      lname_th: "dieb",
      nationality: "TH",
      id_card: "xxxxx5656",
      date_of_birth: "20-20-20",
      tel: "165651251546",
      email: "gg@gmail.com",

    },

    profile_user: [],

    profile_detail: {
      createdBy: null,
      createdDate: "",
      updatedBy: null,
      updatedDate: "",
      deletedBy: null,
      deletedDate: null,
      userOneId: "",
      accountTitleTh: null,
      firstNameTh: "",
      lastNameTh: "",
      accountTitleEng: null,
      firstNameEng: "",
      lastNameEng: "",
      email: "",
      mobileNo: "",
      status: "",
      nation: null,
      userName: "",
      passWord: "",
      userRoles: [],
      mystudents: [
        {
          accountId: "",
          firstNameTh: "",
          lastNameTh: ""
        }
      ],
      myparents: [
        {
          accountId: "",
          firstNameTh: "",
          lastNameTh: ""
        }
      ],
    },





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

    relation_detail: [],
    congenital_disease_list: ''

  },
  mutations: {
    SetClass(state, payload) {
      state.class_list = payload
    },
    SetUserData(state, payload) {
      state.user_data = payload
    },

    SetProfileUser(state, payload) {
      state.profile_user = payload
    },

    SetCertificateData(state, payload) {
      state.certificate_data = payload
    },
    SetPassword(state, payload) {
      state.password = payload
    },
    SetProfileDetail(state, payload) {
      state.profile_detail = payload

    },
    SetStudents(state, payload) {
      state.students = payload

    },

    SetRelationDetail(state, payload) {
      state.relation_detail = payload
    },
    SetCongenital(state, payload) {
      state.congenital_disease_list = payload
    },

  },
  actions: {
    async GetClassList(context) {
      try {
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            'Authorization': `Bearer ${VueCookie.get("token")}`
          }
        }
        const { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/class`, config)
        if (data.statusCode === 200) {
          console.log(data.data)
          data.data.push({
            classId: null,
            classNameTh: "อื่นๆ",
            classNameEn: "Other"
          })
          context.commit("SetClass", data.data)
        }
      } catch (error) {
        console.log(error)
      }
    },
    GetUserData(context, UserData) {
      context.commit("SetUserData", UserData)
    },

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
          let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/relations/user/?student_id=${account_id}`, config)
          if (data.statusCode === 200) {
            if (data?.data?.message !== "relation not found.") {
              localStorage.setItem("relations", JSON.stringify(data.data))
              await context.commit("SetProfileUser", data.data)
            } else {
              localStorage.setItem("relations", [])
              await context.commit("SetProfileUser", [])

            }
          } else {
            throw { error: data }
          }
        } else if (data_local.roles.includes('R_4')) {
          let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/relations/user/?parent_id=${account_id}`, config)
          if (data.statusCode === 200) {
            if (data?.data?.message !== "relation not found.") {
              let students = []
              for await (const student of data.data) {
                if (student.parentId == account_id) {
                  students.push(student.student)
                }
              }
              await context.commit("SetProfileUser", data.data)
              await context.commit("SetStudents", students)
              localStorage.setItem("relations", JSON.stringify(data.data))
            } else {
              localStorage.setItem("relations", []);
              await context.commit("SetProfileUser", [])

              throw { error: data };
            }
          } else {
            throw { error: data }
          }
        } else {
          localStorage.setItem("relations", []);
        }
      } catch (error) {
        console.log(error)
      }

    },

    async GetProfileDetail(context, account_id) {
      try {
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            'Authorization': `Bearer ${VueCookie.get("token")}`
          }
        }
        // let localhost = "http://localhost:3000"
        // let { data } = await axios.get(`${localhost}/api/v1/profile/${account_id}`, config)
        let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/profile/${account_id}`, config)
        let roles = {
          roleId: "",
          roleNameEng: "",
          roleNameTh: "",
        }
        if (data.statusCode === 200) {
          const response = data.data

          response.image = await response.image && response.image != "" ? `${process.env.VUE_APP_URL}/api/v1/files/${response.image}` : ""
          response.class = await response.class ? response.class : {
            classNameTh: "",
            classNameEn: "",
          }
          response.school = await response.school ? response.school : {
            schoolNameTh: "",
            schoolNameEn: "",
          }
          for await (const role of await response.userRoles) {
            roles.roleId = role.roleId
            roles.roleNameEng = role.roleNameEng
            roles.roleNameTh = role.roleNameTh
          }

          response.userRoles = await roles
          context.commit("SetProfileDetail", response)
        } else {
          throw { error: data }
        }
      } catch (error) {
        console.log(error);
      }
    },


    ChangeCertificateData(context, certificateData) {
      context.commit("SetCertificateData", certificateData)
    },

    ChangePassword(context, newPassword) {
      context.commit("SetPassword", newPassword)
    },

    async GetRelationData(context, account_id) {
      try {
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            'Authorization': `Bearer ${VueCookie.get("token")}`
          }
        }

        let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/relations/user-v2/?account_id=${account_id}`, config)
        let response = data.data

        if (data.statusCode === 200) {
          context.commit("SetRelationDetail", response)
          localStorage.setItem("relations", JSON.stringify(response))
        }
      } catch (error) {
        console.log(error);
      }
    },
    async GetCongenital(context) {
      try {
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            'Authorization': `Bearer ${VueCookie.get("token")}`
          }
        }
        // let localhost = "http://localhost:3000";
        // let { data } = await axios.get(`${localhost}/api/v1/congenitalDisease `, config)
        let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/congenitalDisease `, config)

        if (data.statusCode === 200) {
          context.commit("SetCongenital", data.data)
        }
      } catch (error) {
        console.log(error);
      }
    },

  },
  getters: {
    getUserData(state) {
      return state.user_data
    },
    getProfileUser(state) {
      return state.profile_user
    },
    getCertificateData(state) {
      return state.certificate_data
    },
    getPassword(state) {
      return state.password
    },
    getProfileDetail(state) {
      return state.profile_detail
    },
    getStudents(state) {
      return state.students
    },
    getRelationData(state) {
      return state.relation_detail
    },
    classList(state) {
      return state.class_list
    },
    getCongenital(state) {
      return state.congenital_disease_list
    }

  },
};

export default profileModules;

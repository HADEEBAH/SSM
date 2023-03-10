const UserManageModules = {
  namespaced: true,
  state: {

    user_data: {
      username_en: "",
      fname_th: "",
      lname_th: "",
      fname_en: "",
      lname_en: "",
      email: "",
      phone_num: "",
      roles: [],
      privilege: '',
      previewUrl: null,
      selectedbox: false,
      isCardOpen: false,
      // selectedboxParent: false,
      isCardParentOpen: false,

    },
    searchTerm: "",
    inputValue: "",



    students: {
      students_detail: [
        {
          username: "",
          firstname: "",
          lastname: "",
          tel: "",
        },
      ],


      students_card: [],
      certificates: [],
      certificate_detail: {
        name_certificate: "",
        certificate_date: "",
        previewUrl: null,
        fileName: ''
      }
    },
    parents: [
      {
        username: "",
        firstname: "",
        lastname: "",
        tel: "",
      },
    ]
  },
  mutations: {
    SetStudent(state, payload) {
      state.students = payload
    },

    SetUserData(state, payload) {
      state.userData = payload
    },

    SetCertificate(state, payload) {
      console.log(555,payload);
      state.students.certificates = payload
    },

  },

  actions: {
    changeStudentsData(context, studentData) {
      context.commit("studentData", studentData)
      console.log(studentData)
    },

    changeUserData(context, userData) {
      context.commit("userData", userData)
      console.log(userData)
    },

    changeParentData(context, ParentData) {
      context.commit("ParentData", ParentData)
      console.log(ParentData)
    },

    ChangeCardStudens(context, studentcardData) {
      context.commit("SetStudent", studentcardData)
      console.log(studentcardData)
    },
    changeStudentsCertificate(context, students) {
      context.commit("SetCertificate", students)
      console.log(555,students)
    }
  },

  getters: {
    getStudent(state) {
      return state.students
    },
    getParent(state) {
      return state.parents
    },
    getUserData(state) {
      return state.user_data
    },
    getCertificate(state) {
      console.log(555);
      return state.students.certificates
    },
  },
};

export default UserManageModules;

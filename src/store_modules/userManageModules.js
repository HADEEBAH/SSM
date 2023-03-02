const UserManageModules = {
  namespaced: true,
  state: {

    user_data: {
      username_en: "",
      fname_th: "",
      lname_th: "",
      fname_en: "MUMI",
      lname_en: "MIMU",
      email: "",
      phone_num: "",
      roles: [],
      privilege: '',
      previewUrl: null,
    },
    searchTerm: "",
    inputValue: "",
   


    students: [
      {
        username: "",
        firstname: "",
        lastname: "",
        tel: "",
      },
    ],
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
  },
};

export default UserManageModules;

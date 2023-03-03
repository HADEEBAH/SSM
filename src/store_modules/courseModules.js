import axios from "axios";
const CourseModules = {
  namespaced: true,
  state: {
    course_data: {
      type: "short_course",
      course_name_th: "",
      course_name_en: "",
      kingdom_name: "",
      kingdom_data: {},
      menu_course_open_date: false,
      course_open_date: "",
      course_hours: 0,
      location: "",
      detail: "",
      music_performance: "",
      catification: "",
      coachs: [
        {
          coach_name: "",
          teach_day_data: [
            {
              class_open: false,
              teach_day: [],
              class_date: [
                {
                  class_date_range: {
                    start_time: "",
                    menu_start_time: false,
                    end_time: "",
                    menu_end_time: false,
                  },
                  students: 0,
                },
              ],
            },
          ],
          class_date_range: {
            start_date: "",
            menu_start_date: false,
            end_date: "",
            menu_end_date: false,
          },
          register_date_range: {
            start_date: "",
            menu_start_date: false,
            end_date: "",
            menu_end_date: false,
          },
          period: {
            start_time: "",
            menu_start_time: false,
            end_time: "",
            menu_end_time: false,
          },
        },
      ],
      packages: [
        {
          package: "",
          students: 0,
          options: [
            {
              period_package: "",
              amount: 0,
              price_unit: 0,
              discount: false,
              discount_price: 0,
              privilege: "",
              net_price: 0,
              net_price_unit: 0,
            },
          ],
        },
      ],
    },
    cuurses :[],
  },
  mutations: {
    SetCourses(state, payload){
      state.courses = payload
    },
    SetCourseData(state, payload){
      state.course_data = payload
    }
  },
  actions: {
    ChangeCourseData(context, CourseData){
      console.log("CourseData : ",CourseData)
      context.commit("SetCourseData",CourseData)
    },
    async GetCurses(context){
      try{
        console.log(process.env.APP_URL)
        let {data} = await axios.get(process.env.APP_URL+"/api/v1/")
        if(data.statusCode === 200){
          console.log(data)
          context.commit("SetCourseData",data.data)
        }else{
          throw {message : data.message}
        }
    
      }catch(error){
        console.log(error)
      }
     
    }
  },
  getters: {
    getCourseData(state){
      return state.course_data
    }
  },
};

export default CourseModules;

import axios from "axios";
const CourseModules = {
  namespaced: true,
  state: {
    course_data: {
      type: "short_course",
      course_name_th: "",
      course_name_en: "",
      course_img : "",
      category_id : "",
      kingdom_name: "",
      course_open_date: "",
      course_hours: 0,
      location: "",
      detail: "",
      music_performance: "",
      catification: "",
      coachs: [
        {
          coach_id : "",
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
            end_time: "",
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
    packages : [],
    options: []
  },
  mutations: {
    SetPackages(state, payload){
      state.packages = payload
    },
    SetOptions(state, payload){
      state.options = payload
    },
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
    async CreateCourse(context){
      try{
        let payload = {}
        let {data} = await axios.get(process.env.APP_URL+"/api/v1/", payload)
        if(data.statusCode === 200){
          console.log(data)
          context.commit("SetCourseData",data.data)
        }else{
          throw {message : data.message}
        }
      }catch(error){
        console.log(error)
      }
    },
    async GetCourseDetail(context){
      try{
        let course = {
          type: "course_type_name_th",
          type_id : "course_type_id",
          course_name_th: "c_course_name_th",
          course_name_en: "c_course_name_en",
          course_img : "c_course_img",
          category_id : "category_id",
          category_name: "category_name_th",
          course_open_date: "c_course_open_date",
          course_hours: "c_course_per_time",
          location: "c_course_location",
          detail: "c_course_description",
          music_performance: "c_course_music_performance",
          catification: "c_course_certification",
          sttus :  "c_course_status",
          price : "c_course_price"
        }
        context.commit("SetCourseData",course)
      }catch(error){
        console.log(error)
      }
    },
    async GetCourses(context){
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
     
    },
    async GetPackages(){
      try{
        console.log()
      }catch(error){
        console.log(error)
      }
    },
    async GetOptions(){}
  },
  getters: {
    getCourseData(state){
      return state.course_data
    },
    getPackage(state){
      return state.packages
    },
    getOption(state){
      return state.options
    }
  },
};

export default CourseModules;

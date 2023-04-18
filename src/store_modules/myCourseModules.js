import axios from "axios";
import VueCookie from "vue-cookie"
const myCourseModules = {
    namespaced: true,
    state: {
        student_data: [
            {
                courseId: "",
                courseNameTh: "",
                courseNameEng: "",
                courseOpenDate: "",
                courseLocation: "",
                courseDescription: "",
                courseMusicPerformance: null,
                courseStatus: "",
                courseCertification: "",
                courseImg: "",
                coursePerTime: "",
                courseRegisterStartDate: null,
                courseRegisterEndDate: null,
                courseStudyStartDate: null,
                courseStudyEndDate: null,
                coursePeriodEndDate: null,
                coursePeriodStartDate: null,
                coursePrice: "",
                courseStudentRecived: "",
                courseStudentTotal: null,
                totalAmount: "",
                successCount: "",
                pendingCount: "",
                dates: [],
                orderId: "",
                orderItemId: "",
                cpoId: "",
                dayOfWeekId: "",
                timeId: "",
                coachId: "",
                coachName: "",
                orderStudentId: "",
                studentId: "",
                coursePackageOptionId: "",
                courseNameEn: "",
                start: "",
                end: "",
                dayOfWeekName: [],
            },
        ],
        itemTime: {},

        profile_booked: [
            {
                orderTmpId: null,
                studentId: null,
                coursePackageOptionId: "",
                dayOfWeekId: "",
                timeId: "",
                coachId: null,
                courseId: "",
                parentId: null,
                createdDate: "",
                createdBy: "",
                status: "",
                courseName: ""
            }
        ],

        my_course_detail:{
            courseId: "",
            courseNameTh: "",
            courseNameEng: "",
            coachId: "",
            coachName: "",
            dates: {
                day: [],
                date: [ ],
                count: "",
                totalDay: "",
                startDate: "",
                endDate: ""
            },
            realCount: "",
            time: {
                start: "",
                end: ""
            },
            checkIn: [
                {
                    checkInStudentId: "",
                    orderId: "",
                    courseId: "1",
                    studentId: "",
                    status: "",
                    date: ""
                }
            ]
        },

        my_course_student_id:'',

        student_is_loading: false,

        my_course:[],

    },
    mutations: {
        SetStudentData(state, payload) {
            state.student_data = payload;
        },
        SetcourseSchedule(state, payload) {
            state.itemTime = payload;
        },
        SetProfileBooked(state, payload) {
            state.profile_booked = payload;
        },
        SetMyCourseDetail(state, payload) {
            state.my_course_detail = payload;
        },
        SetStudentsLoading(state, payload) {
            state.student_is_loading = payload
        },
        SetMyCourseStudentId(state, payload) {
            state.my_course_student_id = payload
        },
        SetMyCourse(state, payload) {
            // state.my_course = ''
            state.my_course.push(payload)
        },
        SetCourseArrayEmpty(state) {
            state.my_course= []
        },
    },
    actions: {
        courseSchedule(context) {
            context.commit("SetcourseSchedule");
        },

        async GetStudentData(context, account_id) {
        let data_local = JSON.parse(localStorage.getItem("userDetail"))


            context.commit("student_is_loading", true);
            try {
                let config = {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Content-type": "Application/json",
                        'Authorization': `Bearer ${VueCookie.get("token")}`
                    }
                }
            //     this.user_detail = JSON.parse(localStorage.getItem("userDetail"))
            //   let user_account_id = this.user_detail.account_id
                let { data } = await axios.get(
                    
                    `${process.env.VUE_APP_URL}/api/v1/mycourse/student/${account_id}`, config
                );

                if (data.statusCode === 200) {
                    const dataCourseSchedule = {
                        dates: []
                    };
                    for (const course of data.data) {
                        for (const date of course.dates.date) {
                            dataCourseSchedule.dates.push({
                                start: date.replace(" 00:00:00", "") + ' ' + course.period.start ,
                                end: date.replace(" 00:00:00", "") + ' ' + course.period.end ,
                                name: `${course.courseNameTh}(${course.courseNameEng})`,
                                subtitle: course.coachName
                            })
                        }

                    }
                    // context.commit("student_is_loading", true);
                    if (data_local.roles.includes('R_4')) {
                        for (const item of data.data) {
                            context.commit("SetMyCourse", item)
                        }
                        context.commit("SetMyCourseStudentId", '')
                    } else {
                        context.commit("SetStudentData", data.data)
                    }
                    
                    context.commit("SetcourseSchedule", dataCourseSchedule);
                    // context.commit("student_is_loading", false);


                } else {
                    throw { error: data };
                }
            } catch (error) {
                console.log(error);
            }
        },
        async GetProfileBooked(context, account_id) { 
            console.log("GetProfileBooked", account_id);  
            try {
                let config = {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Content-type": "Application/json",
                        'Authorization': `Bearer ${VueCookie.get("token")}`
                    }
                }

            let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/order/reserve/${account_id}`, config );
            if (data.statusCode === 200) {
                for( const booked of data.data){
                    booked.courseImg = booked.courseImg ? `${process.env.VUE_APP_URL}/api/v1/files/${booked.courseImg}` : null
                }
                console.log("SetProfileBooked", data.data);
                context.commit("SetProfileBooked", data.data)
            } else {
                throw { error: data };
            }
            
            } catch (error) {
                console.log("err", error);
            }
        },
        async GetMyCourseDetail(context, { account_id, course_id }) {
            try {
                let config = {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Content-type": "Application/json",
                        'Authorization': `Bearer ${VueCookie.get("token")}`
                    }
                }
                let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/mycourse/checkin/student/${account_id}/course/${course_id}`, config);

                if (data.statusCode === 200) {
                    context.commit("SetMyCourseDetail".data.data)
                    console.log("SetMyCourseDetail".data.data);
                }
            } catch (error) {
                console.log("GetMyCourseDetail_err", error);
            }
        },
        async GetMyCourseStudentId(context ,account_id) {
            context.commit("SetMyCourseStudentId", account_id);   
        },
        async GetMyCourseArrayEmpty(context) {
            context.commit("SetCourseArrayEmpty"); 
            
        }
    },
    getters: {
        getStudentData(state) {
            return state.student_data;
        },
        getcourseSchedule(state) {
            return state.itemTime;
        },
        getProfileBooked(state) {
            return state.profile_booked; 
        },
        getMyCourseDetail(state) {
            return state.my_course_detail; 
        },
        getStudentsLoading(state) {
            return state.student_is_loading
        },
        getMyCourseStudent(state) {
            return state.my_course_student_id
        },
        getMyCourse(state) {
            return state.my_course
        },
        


    },
};

export default myCourseModules;
// mycourse module 
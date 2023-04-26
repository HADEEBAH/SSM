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

        my_course_detail: {
            courseId: "",
            courseNameTh: "",
            courseNameEng: "",
            coachId: "",
            coachName: "",
            dates: {
                day: [],
                date: [],
                count: 0,
                totalDay: 5,
                startDate: "",
                endDate: ""
            },
            realCount: '',
            time: {
                start: "",
                end: ""
            },
            checkIn: [
                {
                    checkInStudentId: "",
                    orderId: "",
                    courseId: "",
                    studentId: "",
                    status: "",
                    date: ""
                },

            ]
        },

        my_course_student_id: '',

        student_is_loading: false,
        course_list_is_loading: false,

        my_course: [],
        my_schadule: [],
        student_reserve : [],
    },
    mutations: {
        SetStudentReserve(state, payload){
            state.student_reserve = payload
        },
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
        SetCourseListIsLoading(state, payload) {
            state.course_list_is_loading = payload
        },
        SetMyCourseStudentId(state, payload) {
            state.my_course_student_id = payload
        },
        SetMyCourse(state, payload) {
            state.my_course = payload
        },
        SetCourseArrayEmpty(state) {
            state.my_course = []
        },
        SetMyschadule(state, payload) {
            state.my_schadule.push(payload)
        },
        SetschaduleArrayEmpty(state) {
            state.my_schadule = []
        },
        ResetMycourse(state){
            state.my_course = []
        }
    },
    actions: {
        courseSchedule(context) {
            context.commit("SetcourseSchedule");
        },

        async GetStudentData(context, account_id) {
            context.commit("SetStudentsLoading", true)
            context.commit("ResetMycourse")
            let data_local = JSON.parse(localStorage.getItem("userDetail"))
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
                let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/mycourse/student/${account_id}`, config);
                if (data.statusCode === 200) {
                    context.commit("SetStudentsLoading", false)
                    const dataCourseSchedule = {dates: []};
                    for (const course of data.data) {
                        for (const date of course.dates.date) {
                            dataCourseSchedule.dates.push({
                                start: date.replace(" 00:00:00", "") + ' ' + course.period.start,
                                end: date.replace(" 00:00:00", "") + ' ' + course.period.end,
                                timed: `${course.courseNameTh}(${course.courseNameEng})`,
                                name: course.student.firstNameTh,
                                subtitle: course.coachName,
                                courseId: course.courseId,
                            })
                        }
                    }
                    if (data_local.roles.includes('R_4')) {
                        console.log(data.data)
                        let MyCourse = []
                        for await (const item of data.data) {
                            if(MyCourse.filter(v=>v.orderItemId === item.orderItemId).length === 0){
                                MyCourse.push(item)
                            }
                        }
                        context.commit("SetMyCourse", MyCourse)
                        context.commit("SetMyCourseStudentId", '')
                    } else {
                        context.commit("SetStudentData", data.data)
                    }
                    context.commit("SetcourseSchedule", dataCourseSchedule);
                    context.commit("SetStudentsLoading", false)
                } else {
                    context.commit("SetStudentsLoading", false)
                    throw { error: data };
                }
            } catch (error) {
                context.commit("SetStudentsLoading", false)
                console.log(error);
            }
        },
        async GetStudentReserve(context, account_id){
            console.log("GetStudentReserve", account_id);
            try {
                let config = {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Content-type": "Application/json",
                        'Authorization': `Bearer ${VueCookie.get("token")}`
                    }
                }
                // let localHost = process.env.VUE_APP_URL
                let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/order/reserve/byStudentId/${account_id}`, config);
                if (data.statusCode === 200) {

                    for await (const item of data.data) {
                        item.createdByData = item.createdBy ? await axios.get(`${process.env.VUE_APP_URL}/api/v1/account/${item.createdBy}`, config) : null
                        item.StudentData = item.studentId ? await axios.get(`${process.env.VUE_APP_URL}/api/v1/account/${item.studentId}`, config) : null
                        item.coachData = item.coachId ? await axios.get(`${process.env.VUE_APP_URL}/api/v1/account/${item.coachId}`, config) : null
                    }

                    for (const booked of data.data) {
                        booked.courseImg = booked.courseImg ? `${process.env.VUE_APP_URL}/api/v1/files/${booked.courseImg}` : null
                    }
                    console.log("SetStudentReserve", data.data);
                    context.commit("SetStudentReserve", data.data)
                } else {
                    throw { error: data };
                }

            } catch (error) {
                console.log("err", error);
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

                let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/order/reserve/by/${account_id}`, config);
                if (data.statusCode === 200) {

                    for await (const item of data.data) {
                        item.createdByData = item.createdBy ? await axios.get(`${process.env.VUE_APP_URL}/api/v1/account/${item.createdBy}`, config) : null
                        item.StudentData = item.studentId ? await axios.get(`${process.env.VUE_APP_URL}/api/v1/account/${item.studentId}`, config) : null
                        item.coachData = item.coachId ? await axios.get(`${process.env.VUE_APP_URL}/api/v1/account/${item.coachId}`, config) : null
                    }

                    for (const booked of data.data) {
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
            console.log("GetMyCourseDetail")
            context.commit("SetCourseListIsLoading", true)
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

                    if (data.data && data.statusCode === 200) {
                        context.commit("SetMyCourseDetail", data.data)
                        console.log("SetMyCourseDetail ---->", data.data);
                        context.commit("SetCourseListIsLoading", false)
                    }
                    else {
                        context.commit("SetCourseListIsLoading", false)
                        data.data = {}
                    }

                }
                context.commit("SetCourseListIsLoading", false)

            } catch (error) {
                context.commit("SetCourseListIsLoading", false)
                console.log("GetMyCourseDetail_err", error);
            }
        },
        async GetMyCourseStudentId(context, account_id) {
            context.commit("SetMyCourseStudentId", account_id);
            context.commit("SetStudentsLoading", false)

        },
        async GetMyCourseArrayEmpty(context) {

            context.commit("SetCourseArrayEmpty");
            context.commit("SetschaduleArrayEmpty");
            context.commit("SetStudentsLoading", false)


        }
    },
    getters: {
        getStudentReserve(state){
            return state.student_reserve
        },
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
        getCourseListIsLoading(state) {
            return state.course_list_is_loading
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
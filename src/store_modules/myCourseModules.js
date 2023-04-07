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
    },
    mutations: {
        SetStudentData(state, payload) {
            state.student_data = payload
        },
        SetcourseSchedule(state, payload) {
            state.itemTime = payload;
        },
    },
    actions: {
        courseSchedule(context) {
            context.commit("SetcourseSchedule");
        },
        async GetStudentData(context, account_id) {

            try {
                let config = {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Content-type": "Application/json",
                        'Authorization': `Bearer ${VueCookie.get("token")}`
                    }
                }
                let { data } = await axios.get(
                    `${process.env.VUE_APP_URL}/api/v1/mycourse/student/${account_id}`, config
                );

                if (data.statusCode === 200) {
                    const dataCourseSchedule = {
                        dates: []
                    };
                    for (const course of data.data) {
                        for (const date of course.dates) {
                            dataCourseSchedule.dates.push({
                                start: date.replace(" 00:00:00", "") + ' ' + course.coursePeriodStartDate ,
                                end: date.replace(" 00:00:00", "") + ' ' + course.coursePeriodEndDate ,
                                name: `${course.courseNameTh}(${course.courseNameEng})`,
                                subtitle: course.coachName
                            })
                        }

                    }
                    context.commit("SetcourseSchedule", dataCourseSchedule);
                    context.commit("SetStudentData", data.data)

                } else {
                    throw { error: data };
                }
            } catch (error) {
                console.log(error);
            }
        },
    },
    getters: {
        getStudentData(state) {
            return state.student_data;
        },
        getcourseSchedule(state) {
            return state.itemTime;
        },

    },
};

export default myCourseModules;

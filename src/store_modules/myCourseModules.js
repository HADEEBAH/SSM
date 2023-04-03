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
        // dataCourseSchedule : {}
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
            // console.log("account_id =>", account_id);

            try {
                let config = {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Content-type": "Application/json",
                        'Authorization': `Bearer ${VueCookie.get("token")}`
                    }
                }
                let { data } = await axios.get(
                    // `${process.env.VUE_APP_URL}/api/v1/mycourse/student`, config
                    `${process.env.VUE_APP_URL}/api/v1/mycourse/student/${account_id}`, config
                );
                // console.log(data);

                if (data.statusCode === 200) {

                    //   const dataCourseSchedule = {};
                    // for (const i in data.data) {
                    // const dateTime = data.data[i].dates.toString();
                    // dataCourseSchedule.dates = dateTime.slice(0, 10);
                    // dataCourseSchedule.start = dataCourseSchedule.dates + ' ' + data.data[i].start,
                    // dataCourseSchedule.end = dataCourseSchedule.dates + ' ' + data.data[i].end,
                    // dataCourseSchedule.name = `${data.data[i].courseNameTh}(${data.data[i].courseNameEng})`,
                    // dataCourseSchedule.coachName = data.data[i].coachName;

                    // }
                    // new Date. getdate

                    const dataCourseSchedule = {
                        dates: []
                    };
                    for (const course of data.data) {
                        // console.log(course.start)
                        for (const date of course.dates) {
                            dataCourseSchedule.dates.push({
                                start: date.replace(" 00:00:00", "") + ' ' + course.start + ":00",
                                end: date.replace(" 00:00:00", "") + ' ' + course.end + ":00",
                                name: `${course.courseNameTh}(${course.courseNameEng})`,
                                subtitle: course.coachName
                            })
                            console.log(dataCourseSchedule)
                            // `${course.courseNameTh}(${course.courseNameEng})`




                            // `${dataCourseSchedule.dates.push(date.replace(" 00:00:00", ""))}(${course.start})`
                            // `${data.data[i].courseNameTh}(${data.data[i].courseNameEng})`


                            // console.log("object", course.replace(" 00:00:00", ""));
                            // console.log("obj", data.data[i].dates[0].split(" "));
                            // console.log("test --->", data.data[i].dates.splice(" "));
                            // console.log("end --->", data.data[i].dates.slice(0, 10) + ' ' + data.data[i].end);


                        }

                    }





                    context.commit("SetcourseSchedule", dataCourseSchedule);
                    context.commit("SetStudentData", data.data)
                    console.log("SetStudentData", data.data);
                    console.log("dataCourseSchedule", dataCourseSchedule);

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

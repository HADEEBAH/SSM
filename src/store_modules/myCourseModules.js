import axios from "axios";
import VueCookie from "vue-cookie"
import VueI18n from "../i18n";
function dayOfWeekArray(day) {
    let days = day
    const weekdays = [
        VueI18n.t("sunday"),
        VueI18n.t("monday"),
        VueI18n.t("tuesday"),
        VueI18n.t("wednesday"),
        VueI18n.t("thursday"),
        VueI18n.t("friday"),
        VueI18n.t("saturday"),
    ];
    days.sort();
    let ranges = [];
    if (days[0]) {
        let rangeStart = parseInt(days[0]);
        let prevDay = rangeStart;
        for (let i = 1; i < days.length; i++) {
            const day = parseInt(days[i]);
            if (day === prevDay + 1) {
                prevDay = day;
            } else {
                const rangeEnd = prevDay;
                ranges.push({ start: rangeStart, end: rangeEnd });
                rangeStart = day;
                prevDay = day;
            }
        }
        ranges.push({ start: rangeStart, end: prevDay });
        return ranges.map(({ start, end }) => start === end ? weekdays[start] : `${weekdays[start]} - ${weekdays[end]}`).join(', ')
    }
}
const myCourseModules = {
    namespaced: true,
    state: {
        student_data: [],
        itemTime: {},

        profile_booked: [],

        my_course_detail: {},

        my_course_student_id: '',

        student_is_loading: false,
        course_list_is_loading: false,

        my_course: [],
        my_schadule: [],
        student_reserve: [],
        /////////////////////////ยุทธ/////////////////////////
        student_course: []
    },
    mutations: {
        SetStudentReserve(state, payload) {
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
        ResetMycourse(state) {
            state.my_course = []
        },
        /////////////////////////ยุทธ/////////////////////////
        SetStudentCourse(state, payload) {
            state.student_course = payload
        },
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
                const dataCourseSchedule = { dates: [] };
                // let { data } = await axios.get(` http://localhost:3000/api/v1/mycourse/student/${account_id}`, config);
                let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/mycourse/student/${account_id}`, config);
                if (data.statusCode === 200) {
                    for await (let course of data.data) {
                        course.day_name = course.dates.day ? dayOfWeekArray(course.dates.day) : course.dates.day
                        for (const date of course.dates.date) {
                            if (course.period.start !== "Invalid date" && course.period.end !== "Invalid date") {
                                dataCourseSchedule.dates.push({
                                    start: date.replace(" 00:00:00", "") + ' ' + course.period.start,
                                    end: date.replace(" 00:00:00", "") + ' ' + course.period.end,
                                    name: data_local.roles.includes('R_5') ? `${course.courseNameTh}(${course.courseNameEng})` : `${course.student.firstNameTh}: ${course.courseNameTh}(${course.courseNameEng})`,
                                    timed: course.student.firstNameTh,
                                    start_time: course.period.start,
                                    end_time: course.period.end,
                                    subtitle: course.coachName,
                                    courseId: course.courseId,
                                })
                            }
                        }
                        if (course?.coachLeave) {
                            for (let coachLaeve of course?.coachLeave) {
                                if (coachLaeve.teachCompensationStartTime && coachLaeve.teachCompensationEndTime) {
                                    dataCourseSchedule.dates.push({
                                        start: coachLaeve.teachCompensationDate + " " + coachLaeve.teachCompensationStartTime,
                                        end: coachLaeve.teachCompensationDate + " " + coachLaeve.teachCompensationEndTime,
                                        name: data_local.roles.includes('R_5') ? `${course.courseNameTh}(${course.courseNameEng})` : `${course.student.firstNameTh}: ${course.courseNameTh}(${course.courseNameEng})`,
                                        timed: course.student.firstNameTh,
                                        start_time: coachLaeve.teachCompensationStartTime,
                                        end_time: coachLaeve.teachCompensationEndTime,
                                        subtitle: course.coachName,
                                        courseId: course.courseId,
                                    })
                                }
                            }
                        }

                    }

                    let holidays = await axios.get(`${process.env.VUE_APP_URL}/api/v1/holiday/all`, config);
                    if (holidays.data.statusCode === 200) {
                        for (let holiday of holidays.data.data) {
                            dataCourseSchedule.dates.push({
                                type: 'holiday',
                                name: holiday.holidayName,
                                start_date: `${holiday.holidayYears}-${holiday.holidayMonth}-${holiday.holidayDate}`,
                                start: `${holiday.holidayYears}-${holiday.holidayMonth}-${holiday.holidayDate}`,
                                // start_time: holiday.holidayStartTime ? holiday.holidayStartTime : null,
                                end: `${holiday.holidayYears}-${holiday.holidayMonth}-${holiday.holidayDate}`,
                                // end_time: holiday.holidayEndTime ? holiday.holidayEndTime : null,
                                subtitle: holiday.allDay,
                                colors: "#f19a5a"
                            })

                        }
                    }
                    if (data_local.roles.includes('R_4')) {
                        let MyCourse = []
                        for await (const item of data.data) {
                            if (MyCourse.filter(v => v.orderItemId === item.orderItemId).length === 0) {
                                MyCourse.push(item)
                            }
                        }
                        context.commit("SetMyCourse", MyCourse)
                        context.commit("SetMyCourseStudentId", '')
                    } else {
                        context.commit("SetStudentData", data.data)
                    }
                    console.log("246 => data", dataCourseSchedule)
                    context.commit("SetcourseSchedule", dataCourseSchedule);
                    context.commit("SetStudentsLoading", false)
                } else {
                    context.commit("SetStudentsLoading", false)
                    throw { error: data };
                }
            } catch (error) {
                context.commit("SetStudentsLoading", false)
            }
        },

        async GetStudentReserve(context, account_id) {
            try {
                let config = {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Content-type": "Application/json",
                        'Authorization': `Bearer ${VueCookie.get("token")}`
                    }
                }
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
                    context.commit("SetStudentReserve", data.data)
                } else {
                    throw { error: data };
                }

            } catch (error) {
                console.log(error);
            }
        },
        async GetProfileBooked(context, account_id) {
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
                        let arrayNumbers = item.dayOfWeekName.split(",").map(String);
                        item.day_name = item.dayOfWeekName ? dayOfWeekArray(arrayNumbers) : item.dayOfWeekName
                        item.createdByData = item.createdBy ? await axios.get(`${process.env.VUE_APP_URL}/api/v1/account/${item.createdBy}`, config) : null
                        item.StudentData = item.studentId ? await axios.get(`${process.env.VUE_APP_URL}/api/v1/account/${item.studentId}`, config) : null
                        item.coachData = item.coachId ? await axios.get(`${process.env.VUE_APP_URL}/api/v1/account/${item.coachId}`, config) : null
                        item.showData = false
                    }

                    for (const booked of data.data) {
                        booked.courseImg = booked.courseImg ? `${process.env.VUE_APP_URL}/api/v1/files/${booked.courseImg}` : null
                    }
                    context.commit("SetProfileBooked", data.data)
                    console.log("SetProfileBooked", data.data)
                } else {
                    throw { error: data };
                }

            } catch (error) {
                console.log(error);
            }
        },
        async GetMyCourseDetail(context, { account_id, course_id }) {
            context.commit("SetCourseListIsLoading", true)
            try {
                let config = {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Content-type": "Application/json",
                        'Authorization': `Bearer ${VueCookie.get("token")}`
                    }
                }
                // let { data } = await axios.get(`http://localhost:3000/api/v1/mycourse/checkin/student/${account_id}/course/${course_id}`, config);
                let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/mycourse/checkin/student/${account_id}/course/${course_id}`, config);

                if (data.data && data.statusCode === 200) {
                    if (data.data.checkIn) {
                        let potential = []
                        for (let course of data.data.checkIn) {
                            if (course.potential && !potential.some(v => v.checkInPotentialId == course.potential.checkInPotentialId)) {
                                potential.push(course.potential)
                            }
                        }
                        data.data.potential = potential
                    }


                    context.commit("SetMyCourseDetail", data.data)
                    context.commit("SetCourseListIsLoading", false)
                }
                else {
                    context.commit("SetCourseListIsLoading", false)
                    data.data = {}
                }


            } catch (error) {
                context.commit("SetCourseListIsLoading", false)
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


        },

        /////////////////////////ยุทธ/////////////////////////
        async GetStudentCourse(context, account_id) { // ดึงคอร์สของนักเรียนในการดูแบ
            try {
                let config = {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Content-type": "Application/json",
                        'Authorization': `Bearer ${VueCookie.get("token")}`
                    }
                }
                let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/mycourse/student/${account_id}`, config);
                if (data.statusCode === 200) {
                    context.commit("SetStudentCourse", data.data)
                }
            } catch (error) {
                console.log(error);
            }
        },

    },
    getters: {
        getStudentReserve(state) {
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
        /////////////////////////ยุทธ/////////////////////////
        getStudentCourse(state) {
            return state.student_course
        },



    },
};

export default myCourseModules;
// mycourse module 
import axios from "axios";
import VueCookie from "vue-cookie";
import VueI18n from "../i18n";
import { dateFormatter } from '@/functions/functions';
import moment from "moment";
import Swal from "sweetalert2";

function dayOfWeekArray(day) {
    let days = day;
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
        return ranges
            .map(({ start, end }) =>
                start === end
                    ? weekdays[start]
                    : `${weekdays[start]} - ${weekdays[end]}`
            )
            .join(", ");
    }
}
const adminCheckInModules = {
    namespaced: true,
    state: {
        courses: [],
        coachs: [],
        dayOfWeekName: [],
        time: [],
        scheduleCheckin: [],
        scheduleCheckinIsLoadIng: false
    },
    mutations: {
        SetCourses(state, payload) {
            state.courses = payload
        },
        SetCoachs(state, payload) {
            state.coachs = payload
        },
        SetDayOfWeekName(state, payload) {
            state.dayOfWeekName = payload
        },
        SetTime(state, payload) {
            state.time = payload
        },
        SetScheduleCheckin(state, payload) {
            state.scheduleCheckin = payload
        },
        SetScheduleCheckinIsLoadIng(state, value) {
            state.scheduleCheckinIsLoadIng = value
        },
        SetCheckInCoach(state, { index, students }) {
            state.scheduleCheckin[index].checkedIn = 1
            state.scheduleCheckin[index].checkInStudent = students.map(v => {
                // v.status = 'punctual' 
                return v
            })
        },
        async SetCheckInStudent(state, { payload }) {
            await state.scheduleCheckin.forEach((checkIn, Index) => {
                if (checkIn.checkInStudent) {
                    checkIn.checkInStudent.forEach((student, indexStudent) => {
                        if (payload.some(p => student.checkInStudentId == p.checkInStudentId)) {

                            if (!["leave"].includes(state.scheduleCheckin[Index].checkInStudent[indexStudent].status)) {
                                state.scheduleCheckin[Index].checkInStudent[indexStudent].countCheckIn += 1
                            } else {
                                state.scheduleCheckin[Index].checkInStudent[indexStudent].compensationStartTime = moment(state.scheduleCheckin[Index].checkInStudent[indexStudent].compensationStartTime, "HH:mm")
                                state.scheduleCheckin[Index].checkInStudent[indexStudent].compensationEndTime = moment(state.scheduleCheckin[Index].checkInStudent[indexStudent].compensationEndTime, "HH:mm")
                            }
                        }
                    })
                }

            });
        }
    },
    actions: {
        async SearchCourses(context, { search }) {
            context.commit("SetScheduleCheckin", [])
            try {
                let config = {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Content-type": "Application/json",
                        Authorization: `Bearer ${VueCookie.get("token")}`,
                    },
                };
                const { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/adminfeature/course?courseName=${search}`, config)
                if (data.statusCode == 200) {
                    context.commit("SetCourses", data.data.map(v => {
                        v.courseName = `${v.courseNameTh}(${v.courseNameEn})`
                        return v
                    }))
                }
            } catch (error) {
                console.log(error)
            }
        },
        async SearchCoach(context, { courseId }) {
            context.commit("SetScheduleCheckin", [])
            try {
                let config = {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Content-type": "Application/json",
                        Authorization: `Bearer ${VueCookie.get("token")}`,
                    },
                };
                const { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/adminfeature/coach/course?courseId=${courseId}`, config)
                if (data.statusCode == 200) {
                    context.commit("SetCoachs", data.data.map(v => {
                        v.coachName = `${v.coachNameTh}(${v.coachNameEn})`
                        return v
                    }))
                }
            } catch (error) {
                console.log(error)
            }
        },
        async SearchDayOfWeek(context, { courseId, coachId }) {
            context.commit("SetScheduleCheckin", [])
            try {
                let config = {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Content-type": "Application/json",
                        Authorization: `Bearer ${VueCookie.get("token")}`,
                    },
                };
                const { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/adminfeature/dow?courseId=${courseId}&coachId=${coachId}`, config)
                if (data.statusCode == 200) {
                    context.commit("SetDayOfWeekName", data.data.map(v => {
                        v.dayOfWeekName = dayOfWeekArray(v.day)
                        return v
                    }))
                }
            } catch (error) {
                console.log(error)
            }
        },
        async SearchTime(context, { courseId, coachId, dowId }) {
            context.commit("SetScheduleCheckin", [])
            try {
                let config = {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Content-type": "Application/json",
                        Authorization: `Bearer ${VueCookie.get("token")}`,
                    },
                };
                const { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/adminfeature/time?courseId=${courseId}&coachId=${coachId}&dayOfWeekId=${dowId}`, config)
                if (data.statusCode == 200) {
                    context.commit("SetTime", data.data.map(v => {
                        v.time = `${v.timeStart}-${v.timeEnd}`
                        v.openStudents = false
                        return v
                    }))
                }
            } catch (error) {
                console.log(error)
            }
        },
        async GetScheduleCheckIn(context, { course, coach, dayOfWeek, time, timeStart, timeEnd }) {
            try {
                context.commit("SetScheduleCheckinIsLoadIng", true)
                let config = {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Content-type": "Application/json",
                        Authorization: `Bearer ${VueCookie.get("token")}`,
                    },
                };
                // let localhost = "http://localhost:3000"
                // const { data } = await axios.get(`${localhost}/api/v1/adminfeature/schedule?courseId=${course}&coachId=${coach}&dowId=${dayOfWeek}&timeId=${time}&timeStart=${timeStart}&timeEnd=${timeEnd}`, config)
                const { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/adminfeature/schedule?courseId=${course}&coachId=${coach}&dowId=${dayOfWeek}&timeId=${time}&timeStart=${timeStart}&timeEnd=${timeEnd}`, config)
                if (data.statusCode == 200) {
                    context.commit("SetScheduleCheckinIsLoadIng", false)
                    for await (let checkIn of data.data) {
                        if (checkIn.checkInStudent) {
                            checkIn.checkInStudent = checkIn.checkInStudent.map(s => {
                                if (s?.compensationDate) {
                                    let compensationDate = moment(s.compensationDate).format("YYYY-MM-DD")
                                    s.compensationDateStr = dateFormatter(compensationDate, "DD MMT YYYYT")
                                    s.compensationStartTime = s.compensationStartTime ? moment(s.compensationStartTime, "HH:mm") : ''
                                    s.compensationEndTime = s.compensationEndTime ? moment(s.compensationEndTime, "HH:mm") : ''
                                } else {
                                    s.compensationDateStr = ""
                                    s.compensationDate = ""
                                }
                                s.menuCompensationDate = false
                                s.startTime = ""
                                s.endTime = ""
                                return s
                            })
                        }
                    }
                    context.commit("SetScheduleCheckin", data.data)
                }
            } catch (error) {
                context.commit("SetScheduleCheckinIsLoadIng", false)
                console.log(error)
            }
        },
        async UpdateCheckinStudents(context, { payload }) {
            try {
                let config = {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Content-type": "Application/json",
                        Authorization: `Bearer ${VueCookie.get("token")}`,
                    },
                };
                let Isleave = []
                let dataPayload = payload
                dataPayload.map(v => {
                    if (v.status !== "leave") {
                        v.compensationDate = ""
                        v.compensationStartTime = ""
                        v.compensationEndTime = ""
                    } else {
                        Isleave.push(v)
                        v.compensationStartTime = moment(v.compensationStartTime).format("HH:mm")
                        v.compensationEndTime = moment(v.compensationEndTime).format("HH:mm")
                    }
                    return v
                })
                const { data } = await axios.patch(`${process.env.VUE_APP_URL}/api/v1/adminfeature/checkinallstudent`, dataPayload, config)
                if (data.statusCode == 200) {
                    Swal.fire({
                        icon: "success",
                        title: VueI18n.t("succeed"),
                        text: VueI18n.t("saved successfully"),
                        timer: 3000,
                        showDenyButton: false,
                        showCancelButton: false,
                        showConfirmButton: false,
                        timerProgressBar: true,
                    })
                    context.commit("SetCheckInStudent", { payload: payload })
                    if (Isleave.length > 0) {
                        const { timeEnd, timeStart, coachId, courseId, timeId, dayOfWeekId } = context.state.scheduleCheckin[0]
                        await context.dispatch("GetScheduleCheckIn", {
                            course: courseId,
                            coach: coachId,
                            dayOfWeek: dayOfWeekId,
                            time: timeId,
                            timeStart,
                            timeEnd
                        })
                    }
                }
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: VueI18n.t("fail"),
                    text: VueI18n.t("save failed"),
                    timer: 3000,
                    showDenyButton: false,
                    showCancelButton: false,
                    showConfirmButton: false,
                    timerProgressBar: true,
                })
            }
        },
        async CheckInCoach(context, { checkInData, index }) {
            try {
                let config = {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Content-type": "Application/json",
                        Authorization: `Bearer ${VueCookie.get("token")}`,
                    },
                };
                const { data } = await axios.post(`${process.env.VUE_APP_URL}/api/v1/adminfeature/checkincoach`, {
                    ...checkInData
                }, config)
                if (data.statusCode == 201) {
                    context.commit("SetCheckInCoach", { index: index, students: data.data })
                }
            } catch (error) {
                console.log(error)
            }
        }
    },
    getters: {
        courses(state) {
            return state.courses
        },
        coachs(state) {
            return state.coachs
        },
        dayOfWeekName(state) {
            return state.dayOfWeekName
        },
        time(state) {
            return state.time
        },
        scheduleCheckin(state) {
            return state.scheduleCheckin
        },
        scheduleCheckinIsLoadIng(state) {
            return state.scheduleCheckinIsLoadIng
        }
    },
};

export default adminCheckInModules;

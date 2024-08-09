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
        scheduleCheckinIsLoadIng: false,
        updateCheckinStudentsIsLoading: false
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
            state.scheduleCheckin[index].checkInStudent = students?.map(items => {
              // items.status = items.status && items.status !== "" ? items.status : 'punctual'
              if (items?.compensationDate) {
                items.compensationDate = items.compensationDate ? items.compensationDate !== "Invalid date" ? moment(new Date(items.compensationDate)).format("YYYY-MM-DD") : null : null
                items.compensationDateStr = items.compensationDate ? items.compensationDate !== "Invalid date" ? dateFormatter(new Date(items.compensationDate), "DD MMT YYYYT") : null : null
  
                items.compensationStartTime = items.compensationStartTime ? moment(items.compensationStartTime, "HH:mm") : ''
                items.compensationEndTime = items.compensationEndTime ? moment(items.compensationEndTime, "HH:mm") : ''
              } else {
                  items.compensationDateStr = ""
                  items.compensationDate = ""
              }
              return items
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
        },

        SetUpdateCheckinStudentsIsLoading (state, payload) {
          state.updateCheckinStudentsIsLoading = payload
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
          let response = []
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
                    for await (let items of data.data) {
                      // data.data.map(items => {
                        if (items?.checkInStudent) {
                        // context.dispatch("CheckInCoach", { checkInData: checkIn, index: index })
                          items?.checkInStudent.map(item => {
                            if (item?.compensationDate) {
                                item.compensationDate = item.compensationDate ? item.compensationDate !== "Invalid date" ? moment(new Date(item.compensationDate)).format("YYYY-MM-DD") : null : null
                                item.compensationDateStr = item.compensationDate ? item.compensationDate !== "Invalid date" ? dateFormatter(new Date(item.compensationDate), "DD MMT YYYYT") : null : null
                  
                                // let compensationDate = moment(item.compensationDate).format("YYYY-MM-DD")
                                // item.compensationDateStr = dateFormatter(compensationDate, "DD MMT YYYYT")
                                item.compensationStartTime = item.compensationStartTime ? moment(item.compensationStartTime, "HH:mm") : ''
                                item.compensationEndTime = item.compensationEndTime ? moment(item.compensationEndTime, "HH:mm") : ''
                            } else {
                                item.compensationDateStr = ""
                                item.compensationDate = ""
                            }
                            item.menuCompensationDate = false
                            item.startTime = ""
                            item.endTime = ""

                            return item
                          })
                        }

                        response.push(items)
                        // return items
                      // })
                    }
                    await context.commit("SetScheduleCheckin", response)
                    context.commit("SetScheduleCheckinIsLoadIng", false)
                }
            } catch (error) {
                context.commit("SetScheduleCheckinIsLoadIng", false)
                console.log(error)
            }
        },
        async UpdateCheckinStudents(context, { payload }) {
              context.commit("SetUpdateCheckinStudentsIsLoading", true)
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
                dataPayload.map(items => {
                    if (items.status !== "leave") {
                        items.compensationDate = ""
                        items.compensationStartTime = ""
                        items.compensationEndTime = ""
                    } else {
                        Isleave.push(items)
                        items.compensationStartTime = moment(items.compensationStartTime).format("HH:mm")
                        items.compensationEndTime = moment(items.compensationEndTime).format("HH:mm")
                    }
                    return items
                })
                // const { data } = await axios.patch(`http://localhost:3000/api/v1/adminfeature/checkinallstudent`, dataPayload, config)
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
                    // if (Isleave.length > 0) {
                        const { timeEnd, timeStart, coachId, courseId, timeId, dayOfWeekId } = context.state.scheduleCheckin[0]
                        await context.dispatch("GetScheduleCheckIn", {
                            course: courseId,
                            coach: coachId,
                            dayOfWeek: dayOfWeekId,
                            time: timeId,
                            timeStart,
                            timeEnd
                        })
                    // }
                  context.commit("SetUpdateCheckinStudentsIsLoading", false)

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
                context.commit("SetUpdateCheckinStudentsIsLoading", false)
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
                // let localhost = "http://localhost:3000"
                // const { data } = await axios.post(`${localhost}/api/v1/adminfeature/checkincoach`, {
                const { data } = await axios.post(`${process.env.VUE_APP_URL}/api/v1/adminfeature/checkincoach`, {
                    ...checkInData
                }, config)
                if (data.statusCode == 201) {
                    console.log('SetCheckInCoach')
                    await context.commit("SetCheckInCoach", { index: index, students: data.data })
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
        },
        getUpdateCheckinStudentsIsLoading(state) {
          return state.updateCheckinStudentsIsLoading
        }
        
    },
};

export default adminCheckInModules;
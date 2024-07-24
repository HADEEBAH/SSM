import axios from "axios";
import VueCookie from "vue-cookie";
import VueI18n from "../i18n";
import { dateFormatter } from '@/functions/functions';
import moment from "moment";
import Swal from "sweetalert2";
var XLSX = require("xlsx");


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
        checkin_filter: [],

    },
    mutations: {
        SetCheckInFilter(state, payload) {
            state.checkin_filter = payload
        },
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
        async CheckInFilter(context, { account_id }) {
            console.log('account_id :>> ', account_id);
            context.commit("SetScheduleCheckinIsLoadIng", true)
            try {
                let config = {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Content-type": "Application/json",
                        'Authorization': `Bearer ${VueCookie.get("token")}`
                    }
                }
                let endpoint = `${process.env.VUE_APP_URL}/api/v1/admincourse/export-coach-checkin?accountId=${account_id}`
                let { data } = await axios.get(endpoint, config)
                if (data.statusCode == 200) {
                    // console.log('data.data :>> ', data.data);
                    let reports = []
                    data.data.forEach(filterData => {
                        // let getDate = ''
                        reports.push({
                            // "วันที่เรียน": filterData.schedule ? moment(filterData.schedule).format("DD/MM/YYYY HH:mm") : '-',
                            // "วันที่เรียน": filterData.schedule ? filterData.schedule : '-',
                            "เวลาเริ่มเรียน": filterData.timeStart ? filterData.timeStart : '-',
                            "เวลาสิ้นสุดการเรียน": filterData.timeEnd ? filterData.timeEnd : '-',
                            // "หมายเลขออเดอร์": order.order_number,
                            // "สถานะ": order.payment_status,
                            // "วันที่ชำระ": order.paid_date,
                            // "ประเภทการชำระเงิน": order.payment_type ? order.payment_type == 'cash' ? 'เงินสด' :
                            //   ['Credit Card', 'Credit Card Installment'].some(v => v == order.payment_type) ? 'บัตเครดิต/เดบิต' : 'โอนเงินเข้าบัญชี' : '',
                            // "ราคา": parseFloat(order.price).toLocaleString(undefined, { minimumFractionDigits: 2 }),
                            // "ผู้รับเงิน": order.payment?.recipient ? `${order.accountRecipientFirstNameTh} ${order.accountRecipientLastNameTh}` : '',
                            // "คอร์ส": order.courseNameTh,
                            // "ประเภทคอร์ส": order.courseTypeNameTh,
                            // "แพคเก็จ": order.packageName,
                            // "ระยะเวลา": order.optionName,
                            // "โค้ช": order.coach_name,
                            // "นักเรียน": order.student_name,
                            // "ชื่อเล่นนักเรียน": order.nickname,
                            // "ระดับชั้น": order.class_name,
                            // "ผู้ซื้อ": order.created_by_name,
                            // "วันที่ออกเอกสาร": moment().format("DD/MM/YYYY HH:mm"),
                        })
                        console.log('object :>> ', reports);
                    })

                    if (reports.length > 0) {
                        let config = {
                            headers: {
                                "Access-Control-Allow-Origin": "*",
                                "Content-type": "Application/json",
                                'Authorization': `Bearer ${VueCookie.get("token")}`
                            }
                        }
                        let { data } = await axios.post(`${process.env.VUE_APP_URL}/api/v1/admincourse/export-log`, {}, config)

                        var workbook = XLSX.utils.book_new();
                        var worksheet = XLSX.utils.json_to_sheet(reports);
                        XLSX.utils.book_append_sheet(workbook, worksheet, 'sheet1');
                        var excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
                        var blob = new Blob([excelBuffer], { type: "application/octet-stream" });
                        var url = URL.createObjectURL(blob);
                        var link = document.createElement("a");
                        link.href = url;
                        link.download = `coachCheckIn.xlsx`;
                        link.click();
                        URL.revokeObjectURL(url);
                        context.commit("SetCheckInFilter", data.data)
                        context.commit("SetScheduleCheckinIsLoadIng", false)
                    } else {
                        context.commit("SetScheduleCheckinIsLoadIng", false)
                        Swal.fire({
                            icon: "error",
                            title: VueI18n.t("something went wrong"),
                            text: VueI18n.t("data not found"),
                            timer: 3000,
                            timerProgressBar: true,
                            showCancelButton: false,
                            showConfirmButton: false,
                        })
                    }


                }

            } catch (error) {
                context.commit("SetScheduleCheckinIsLoadIng", false)
            }
        },
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
                    for await (let [index, checkIn] of data.data.entries()) {

                        if (checkIn.checkInStudent) {
                            context.dispatch("CheckInCoach", { checkInData: checkIn, index: index })
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
                    await context.commit("SetScheduleCheckin", data.data)
                    context.commit("SetScheduleCheckinIsLoadIng", false)
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
                // let localhost = "http://localhost:3000"
                // const { data } = await axios.post(`${localhost}/api/v1/adminfeature/checkincoach`, {
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
        getCheckinFilter(state) {
            return state.checkin_filter
        },
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
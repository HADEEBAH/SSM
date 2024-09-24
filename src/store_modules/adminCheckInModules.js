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

        SetUpdateCheckinStudentsIsLoading(state, payload) {
            state.updateCheckinStudentsIsLoading = payload
        }
    },
    actions: {
        async CheckInFilter(context, { export_data }) {
            context.commit("SetScheduleCheckinIsLoadIng", true)
            let coachId = ''
            let courseId = ''
            let courseStatus = ''
            let packageId = ''
            let optionId = ''
            let checkInStatus = ''
            let startTime = ''
            let endTime = ''
            let startDate = ''
            let endDate = ''
            let courseType = ''
            let coachCheckInStatus = ''
            if (export_data) {
                for (const idCoach of export_data.coach_id) {
                    coachId += `&accountId=${idCoach}`
                }
                for (const idCourse of export_data.course_name) {
                    courseId += `&courseId=${idCourse}`
                }
                for (const statusCourse of export_data.coure_status) {
                    courseStatus += `&courseStatus=${statusCourse}`
                }
                for (const idPackage of export_data.package_id) {
                    packageId += `&packageId=${idPackage}`
                }
                for (const idOptions of export_data.options_id) {
                    optionId += `&optionId=${idOptions}`
                }
                for (const statusCheckIn of export_data.check_in_status_options) {
                    checkInStatus += `&checkInStatus=${statusCheckIn}`
                }
                for (const typeCourse of export_data.course_type_id) {
                    courseType += `&courseTypeId=${typeCourse}`
                }
                for (const checkInStatusCoach of export_data.coach_check_in_status) {
                    coachCheckInStatus += `&stateCkeckIn=${checkInStatusCoach}`
                }

                export_data.start_time ? startTime = `startTime=${export_data.start_time}` : ''
                export_data.end_time ? endTime = `&endTime=${export_data.end_time}` : ''
                export_data.start_date ? startDate = `&startDate=${export_data.start_date}` : ''
                export_data.end_date ? endDate = `&endDate=${export_data.end_date}` : ''

            }
            try {
                let config = {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Content-type": "Application/json",
                        'Authorization': `Bearer ${VueCookie.get("token")}`
                    }
                }
                // let localhost = "http://localhost:3000"
                // let endpoint = `${localhost}/api/v1/admincourse/export-coach-checkin?${startTime}${endTime}${coachId}${courseId}${startDate}${endDate}${courseStatus}${packageId}${optionId}${checkInStatus}${courseType}${coachCheckInStatus}`
                let endpoint = `${process.env.VUE_APP_URL}/api/v1/admincourse/export-coach-checkin?${startTime}${endTime}${coachId}${courseId}${startDate}${endDate}${courseStatus}${packageId}${optionId}${checkInStatus}${courseType}${coachCheckInStatus}`
                let { data } = await axios.get(endpoint, config)
                if (data.statusCode == 200) {
                    let reports = []
                    await data.data.forEach(filterData => {
                        if (filterData.checkinStudent) {
                            let dateCheckIn = ''
                            let studentCheckInId = ''
                            let studyDate = ''
                            let satuscheckin = ''
                            let studentName = ''
                            let checkInCountPerDay = ''
                            let totalCheckInCount = ''
                            let packages = ''
                            let options = ''
                            const compareDates = (a, b) => {
                                const dateA = new Date(a.date);
                                const dateB = new Date(b.date);
                                return dateA - dateB;
                            };
                            // Sort the array by date
                            filterData.checkinStudent.sort(compareDates);

                            // Display the status sorted by date
                            filterData.checkinStudent.forEach(entry => {
                                dateCheckIn = entry.checkInTimeStamp
                                studentCheckInId = entry.checkinStudentId
                                studyDate = entry.date
                                satuscheckin = entry.status
                                if (!studentCheckInId) {
                                    satuscheckin = entry.status === null ? "ยังไม่มีการเช็คอิน" : ''
                                } else if (studentCheckInId && !dateCheckIn) {
                                    satuscheckin = entry.status === null ? "ยังไม่มีการเช็คอิน" : ''
                                } else if (studentCheckInId && dateCheckIn && !satuscheckin) {
                                    satuscheckin = entry.status === null ? "ยังไม่มีการเลือกสถานะ" : ''
                                } else {
                                    satuscheckin = entry.status ? (
                                        entry.status === "emergency leave" ? "ลาฉุกเฉิน" : (
                                            entry.status === "punctual" ? "ตรงเวลา" : (
                                                entry.status === "absent" ? "ขาด" : (
                                                    entry.status === "leave" ? "ลา" : (
                                                        entry.status === "late" ? "สาย" : null
                                                    )
                                                )
                                            )
                                        )
                                    ) : null
                                }

                                checkInCountPerDay = entry.countCheckIn
                                totalCheckInCount = entry.totalDay
                                studentName = `${entry.firstNameTh} ${entry.lastNameTh}`
                                packages = entry.packageName
                                options = entry.option_name


                                reports.push({
                                    "วันเวลาเช็คอิน": dateCheckIn ? filterData.checkinStudent ? moment(dateCheckIn).format("DD/MM/YYYY HH:mm:ss") : '-' : '',
                                    "วันที่เรียน": studyDate ? filterData.checkinStudent ? moment(studyDate).format("DD/MM/YYYY") : '-' : '',
                                    // "เวลาเริ่มเรียน": filterData.timeStart ? filterData.timeStart : '-',
                                    // "เวลาสิ้นสุดการเรียน": filterData.timeEnd ? filterData.timeEnd : '-',
                                    // "วันที่เริ่มเรียน": filterData.dateStart ? moment(filterData.dateStart).format("DD/MM/YYYY") : '-',
                                    // "วันที่สิ้นสุดการเรียน": filterData.endDate ? moment(filterData.endDate).format("DD/MM/YYYY") : '-',
                                    "ชื่อคอร์ส": filterData.courseNameTh ? filterData.courseNameTh : '-',
                                    "ชื่อโค้ช": filterData.firstNameTh ? `${filterData.firstNameTh} ${filterData.lastNameTh}` : '-',
                                    "ประเภทคอร์ส": filterData.courseTypeId ? filterData.courseTypeId === 'CT_1' ? VueI18n.locale == 'th' ? 'คอร์สทั่วไป' : 'General course' : VueI18n.locale == 'th' ? 'คอร์สระยะสั้น' : 'Short course' : '-',
                                    // "สถานะคอร์สเรียน": filterData.courseStatus ? filterData.courseStatus === 'Open' ? VueI18n.locale == 'th' ? 'คอร์สว่าง' : 'Course available' : VueI18n.locale == 'th' ? 'คอร์สเต็ม' : 'Full Course' : '-',
                                    "แพ็คเกจ": filterData.checkinStudent ? packages : '-',
                                    // "ช่วงเวลา": filterData.optionName ? filterData.optionName : '-',
                                    // "แพ็คเกจ": packages ? packages : '-',
                                    "ช่วงเวลา": options ? options : '-',
                                    "ชื่อนักเรียน": filterData.checkinStudent ? studentName : '-',
                                    "สถานะการเข้าสอนของโค้ช": filterData.checkinStudent ? totalCheckInCount : '0',
                                    "สถานะเช็คอิน": filterData.checkinStudent ? satuscheckin ? satuscheckin : '' : '',
                                    "จำนวนที่เช็คอิน": filterData.checkinStudent ? checkInCountPerDay : '0',
                                    "วันเรียนทั้งหมด": filterData.checkinStudent ? totalCheckInCount : '0',
                                    // "สถานะเช็คอิน": filterData.checkinStudent ? satuscheckin : '-',
                                })

                            });
                        } else {
                            reports.push({
                                "วันเวลาเช็คอิน": '-',
                                "วันที่เรียน": '-',

                                // "เวลาเริ่มเรียน": filterData.timeStart ? filterData.timeStart : '-',
                                // "เวลาสิ้นสุดการเรียน": filterData.timeEnd ? filterData.timeEnd : '-',
                                // "วันที่เริ่มเรียน": filterData.dateStart ? moment(filterData.dateStart).format("DD/MM/YYYY") : '-',
                                // "วันที่สิ้นสุดการเรียน": filterData.endDate ? moment(filterData.endDate).format("DD/MM/YYYY") : '-',
                                "ชื่อคอร์ส": filterData.courseNameTh ? filterData.courseNameTh : '-',
                                "ชื่อโค้ช": filterData.firstNameTh ? `${filterData.firstNameTh} ${filterData.lastNameTh}` : '-',
                                "ประเภทคอร์ส": filterData.courseTypeId ? filterData.courseTypeId === 'CT_1' ? VueI18n.locale == 'th' ? 'คอร์สทั่วไป' : 'General course' : VueI18n.locale == 'th' ? 'คอร์สระยะสั้น' : 'Short course' : '-',
                                // "สถานะคอร์สเรียน": filterData.courseStatus ? filterData.courseStatus === 'Open' ? VueI18n.locale == 'th' ? 'คอร์สว่าง' : 'Course available' : VueI18n.locale == 'th' ? 'คอร์สเต็ม' : 'Full Course' : '-',
                                // "แพ็คเกจ": filterData.packageName ? filterData.packageName : '-',
                                // "ช่วงเวลา": filterData.optionName ? filterData.optionName : '-',
                                "แพ็คเกจ": '-',
                                "ช่วงเวลา": '-',
                                "ชื่อนักเรียน": '-',
                                "สถานะเช็คอิน": '-',
                                "จำนวนที่เช็คอิน": '0',
                                "วันเรียนทั้งหมด": '0',
                            })
                        }



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
                            icon: "warning",
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
                                item.status ? item.status : item.status = 'punctual'

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
                    data.data.map(item => { item.status ? item.status : item.status = 'punctual' })
                    await context.commit("SetCheckInCoach", { index: index, students: data.data })
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
        },
        getUpdateCheckinStudentsIsLoading(state) {
            return state.updateCheckinStudentsIsLoading
        }

    },
};

export default adminCheckInModules;
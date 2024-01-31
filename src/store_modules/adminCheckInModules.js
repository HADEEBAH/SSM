import axios from "axios";
import VueCookie from "vue-cookie";
import VueI18n from "../i18n";
import { dateFormatter } from '@/functions/functions';
import moment from "moment";

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
        scheduleCheckin : [],
        scheduleCheckinIsLoadIng: false
    },
    mutations: {
        SetCourses(state, payload){
            state.courses = payload
        },
        SetCoachs(state, payload){
            state.coachs = payload
        },
        SetDayOfWeekName(state, payload){
            state.dayOfWeekName = payload
        },
        SetTime(state, payload){
            state.time = payload
        },
        SetScheduleCheckin(state, payload){
            state.scheduleCheckin = payload
        },
        SetScheduleCheckinIsLoadIng(state, value){
            state.scheduleCheckinIsLoadIng = value
        },
        SetCheckInCoach(state,{index, students}){
            state.scheduleCheckin[index].checkedIn = 1
            state.scheduleCheckin[index].checkInStudent = students
        },
        async SetCheckInStudent(state,{ checkInStudentId }){
            await state.scheduleCheckin.forEach((checkIn, Index) => {
                if( checkIn.checkInStudent){
                    const indexStudent = checkIn.checkInStudent.findIndex(v => v.checkInStudentId == checkInStudentId)
                    if(indexStudent > -1){
                        if(["late","punctual"].includes(state.scheduleCheckin[Index].checkInStudent[indexStudent].status)){
                            state.scheduleCheckin[Index].checkInStudent[indexStudent].countCheckIn += 1
                        }
                    }
                    
                }
                
            });
        }
    },
    actions: {
        async SearchCourses(context,{ search }){
            context.commit("SetScheduleCheckin",[])
            try{
                let config = {
                    headers: {
                      "Access-Control-Allow-Origin": "*",
                      "Content-type": "Application/json",
                      Authorization: `Bearer ${VueCookie.get("token")}`,
                    },
                };
                const { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/adminfeature/course?courseName=${search}`,config)
                if(data.statusCode == 200){
                    context.commit("SetCourses",data.data.map(v => {
                        v.courseName = `${v.courseNameTh}(${v.courseNameEn})`
                        return v
                    }))
                }
            }catch(error){
                console.log(error)
            }
        },
        async SearchCoach(context,{ courseId }){
            context.commit("SetScheduleCheckin",[])
            try{
                let config = {
                    headers: {
                      "Access-Control-Allow-Origin": "*",
                      "Content-type": "Application/json",
                      Authorization: `Bearer ${VueCookie.get("token")}`,
                    },
                };
                const { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/adminfeature/coach/course?courseId=${courseId}`,config)
                if(data.statusCode == 200){
                    context.commit("SetCoachs",data.data.map( v => { 
                        v.coachName = `${v.coachNameTh}(${v.coachNameEn})`
                        return v
                    }))
                }
            }catch(error){
                console.log(error)
            }
        },
        async SearchDayOfWeek(context,{ courseId, coachId }){
            context.commit("SetScheduleCheckin",[])
            try{
                let config = {
                    headers: {
                      "Access-Control-Allow-Origin": "*",
                      "Content-type": "Application/json",
                      Authorization: `Bearer ${VueCookie.get("token")}`,
                    },
                };
                const { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/adminfeature/dow?courseId=${courseId}&coachId=${coachId}`,config)
                if(data.statusCode == 200){
                    context.commit("SetDayOfWeekName",data.data.map( v => { 
                        v.dayOfWeekName = dayOfWeekArray(v.day)
                        return v
                    }))
                }
            }catch(error){
                console.log(error)
            }
        },
        async SearchTime(context, { courseId, coachId , dowId}){
            context.commit("SetScheduleCheckin",[])
            try{
                let config = {
                    headers: {
                      "Access-Control-Allow-Origin": "*",
                      "Content-type": "Application/json",
                      Authorization: `Bearer ${VueCookie.get("token")}`,
                    },
                };
                const { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/adminfeature/time?courseId=${courseId}&coachId=${coachId}&dayOfWeekId=${dowId}`,config)
                if(data.statusCode == 200){
                    context.commit("SetTime",data.data.map( v => { 
                        v.time = `${v.timeStart}-${v.timeEnd}`
                        v.openStudents = false
                        return v
                    }))
                }
            }catch(error){
                console.log(error)
            }
        },
        async GetScheduleCheckIn(context ,{ course, coach, dayOfWeek, time, timeStart, timeEnd }){
            try{
                context.commit("SetScheduleCheckinIsLoadIng",true)
                let config = {
                    headers: {
                      "Access-Control-Allow-Origin": "*",
                      "Content-type": "Application/json",
                      Authorization: `Bearer ${VueCookie.get("token")}`,
                    },
                };
                const {data} = await axios.get(`${process.env.VUE_APP_URL}/api/v1/adminfeature/schedule?courseId=${course}&coachId=${coach}&dowId=${dayOfWeek}&timeId=${time}&timeStart=${timeStart}&timeEnd=${timeEnd}`,config)
                if(data.statusCode == 200){
                    context.commit("SetScheduleCheckinIsLoadIng",false)
                    for await (let checkIn of data.data){
                        if(checkIn.checkInStudent){
                            checkIn.checkInStudent = checkIn.checkInStudent.map(s => { 
                                let compensationDate = moment(s.compensationDate).format("YYYY-MM-DD")
                                s.compensationDateStr =  s.compensationDate ? dateFormatter(compensationDate, "DD MMT YYYYT") : '',
                                s.menuCompensationDate = false
                                s.startTime = ""
                                s.endTime = ""
                                return s
                            })
                        }
                    }
                    context.commit("SetScheduleCheckin",data.data)
                }
            }catch(error){
                context.commit("SetScheduleCheckinIsLoadIng",false)
                console.log(error)
            }
        },
        async UpdateCheckinStudent(context, {checkInStudentId, status, payload}){
            try{
                let config = {
                    headers: {
                      "Access-Control-Allow-Origin": "*",
                      "Content-type": "Application/json",
                      Authorization: `Bearer ${VueCookie.get("token")}`,
                    },
                };
                const {data} = await axios.patch(`${process.env.VUE_APP_URL}/api/v1/adminfeature/checkIn/${checkInStudentId}`,{ status, ...payload },config)
                if(data.statusCode == 200){
                    context.commit("SetCheckInStudent",{ checkInStudentId })
                }
            }catch(error){
                console.log(error)
            }
        },
        async CheckInCoach(context, {checkInData, index}){
            try{
                let config = {
                    headers: {
                      "Access-Control-Allow-Origin": "*",
                      "Content-type": "Application/json",
                      Authorization: `Bearer ${VueCookie.get("token")}`,
                    },
                };
                const {data} = await axios.post(`${process.env.VUE_APP_URL}/api/v1/adminfeature/checkincoach`,{ 
                   ...checkInData
                },config)
                if(data.statusCode == 201){
                    context.commit("SetCheckInCoach",{index : index , students : data.data})
                }
            }catch(error){
                console.log(error)
            }
        }
    },
    getters: {
        courses(state){
            return state.courses
        },
        coachs(state){
            return state.coachs
        },
        dayOfWeekName(state){
            return state.dayOfWeekName
        },
        time(state){
            return state.time
        }, 
        scheduleCheckin(state){
            return state.scheduleCheckin
        },
        scheduleCheckinIsLoadIng(state){
            return state.scheduleCheckinIsLoadIng
        }
    },
};

export default adminCheckInModules;

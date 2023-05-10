import axios from "axios";
import VueCookie from "vue-cookie";
import moment from "moment";
import Swal from "sweetalert2";
import { dateFormatter } from '@/functions/functions';
const coachModules = {
  namespaced: true,
  state: {
    coach: {},
    coachs: {},
    my_courses: [],
    my_courses_is_loading: false,
    coach_check_in: {},
    student_check_in: [],
    coach_check_in_is_loading: false,
    coach_leaves: [],
    coach_leaves_is_loading: false,
    attachment_leave: []
  },
  mutations: {
    SetAttachmentLeave(state, payload) {
      state.attachment_leave = payload
    },
    SetCoachLeaves(state, payload) {
      state.coach_leaves = payload
    },
    SetCoachLeavesIsLoading(state, value) {
      state.coach_leaves_is_loading = value
    },
    SetCoach(state, payload) {
      state.coach = payload;
    },
    SetCoachs(state, payload) {
      state.coachs = payload;
    },
    SetCoachCheckIn(state, payload) {
      state.coach_check_in = payload
    },
    SetCoachCheckInIsLoading(state, value) {
      state.coach_check_in_is_loading = value
    },
    SetStudentCheckIn(state, payload) {
      state.student_check_in = payload
    },
    SetMyCourses(state, payload) {
      state.my_courses = payload;
    },
    SetMyCoursesIsLoading(state, value) {
      state.my_courses_is_loading = value;
    },
  },
  actions: {
    async DeleteAssessmentPotentialFile(context, { att_assessment_id }) {
      try {
        // let localhost = "http://localhost:3000"
        let { data } = await axios.delete(`${process.env.VUE_APP_URL}/api/v1/coachmanagement/potential/${att_assessment_id}`)
        console.log(data)
      } catch (error) {
        console.log(error)
      }
    },
    async DeleteAssessmentFile(context, { att_assessment_id }) {
      try {
        let { data } = await axios.delete(`${process.env.VUE_APP_URL}/api/v1/coachmanagement/assessment/${att_assessment_id}`)
        console.log(data)
      } catch (error) {
        console.log(error)
      }
    },
    async DeleteSummaryFile(context, { att_assessment_id }) {
      try {
        // let localhost = "http://localhost:3000"
        let { data } = await axios.delete(`${process.env.VUE_APP_URL}/api/v1/coachmanagement/summary/${att_assessment_id}`)
        console.log(data)
      } catch (error) {
        console.log(error)
      }
    },
    async UpdateAssessmentPotential(context, { students }) {
      try {
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            Authorization: `Bearer ${VueCookie.get("token")}`,
          },
        };
        for await (const student of students) {
          setTimeout(async () => {
            let payload = {
              status: student.check_in_status, // punctual, late,  leave, emergency leave, absent,
              evolution: student.potential.evolution ? student.potential.evolution : '',
              interest: student.potential.interest ? student.potential.interest : '',
              remark: student.potential.remark ? student.potential.remark : '',
            }
            let payloadData = new FormData()
            if (student.potentialfiles) {
              for (const file of student.potentialfiles) {
                payloadData.append(`img_url`, file);
              }
            }
            console.log(payload)
            payloadData.append("payload", JSON.stringify(payload))
            // let localhost = "http://localhost:3000"
            let { data } = await axios.patch(`${process.env.VUE_APP_URL}/api/v1/coachmanagement/potential/${student.potential.checkInPotentialId}`, payloadData, config)
            if (data.statusCode == 200) {
              console.log("patch", data)
            } else {
              throw { error: data }
            }
          }, 500)
        }
        await Swal.fire({
          icon: "success",
          title: "บันทึกสำเร็จ",
          showDenyButton: false,
          showCancelButton: false,
          cancelButtonText: "ยกเลิก",
          confirmButtonText: "ตกลง",
        })
      } catch (error) {
        console.log(error)
      }
    },
    async AssessmentStudent(context, { students }) {
      try {
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            Authorization: `Bearer ${VueCookie.get("token")}`,
          },
        };
        let count = 0
        console.log(students.length)
        for await (const student of students) {
          let payload = {
            status: student.check_in_status, // punctual, late,  leave, emergency leave, absent,
            compensation_date: student.compensation_date,
            compensation_start_time: student.start_time,
            compensation_end_time: student.end_time,
            evolution: student.assessment.evolution ? student.assessment.evolution : '',
            interest: student.assessment.interest ? student.assessment.interest : '',
            remark: student.assessment.remark ? student.assessment.remark : '',
            assessmentStudentsId: student.assessment.assessmentStudentsId,
          }
          let payloadData = new FormData()
          if (student.files) {
            for (const file of student.files) {
              payloadData.append(`img_url`, file);
            }
          }
          if (!student.assessment.assessmentStudentsId) {
            console.log("post", payload)
            payloadData.append("payload", JSON.stringify(payload))
            // let localhost = "http://localhost:3000"
            let { data } = await axios.post(`${process.env.VUE_APP_URL}/api/v1/coachmanagement/assessment/${student.check_in_student_id}`, payloadData, config)
            if (data.statusCode == 201) {
              console.log("post", data)
            } else {
              throw { error: data }
            }
          } else {
            console.log("patch", payload)
            payloadData.append("payload", JSON.stringify(payload))
            // let localhost = "http://localhost:3000"
            let { data } = await axios.patch(`${process.env.VUE_APP_URL}/api/v1/coachmanagement/assessment/${student.check_in_student_id}`, payloadData, config)
            if (data.statusCode == 200) {
              console.log("patch", data)
            } else {
              throw { error: data }
            }
          }
          count = count + 1
        }
        if (count === students.length) {
          await Swal.fire({
            icon: "success",
            title: "บันทึกสำเร็จ",
            showDenyButton: false,
            showCancelButton: false,
            cancelButtonText: "ยกเลิก",
            confirmButtonText: "ตกลง",
          })
        }
      } catch (error) {
        console.log(error)
      }
    },
    async CreateTeachingNotes(context, { check_in_coach_id, check_in_coach_data }) {
      try {
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            Authorization: `Bearer ${VueCookie.get("token")}`,
          },
        };
        let payload = {
          summary: check_in_coach_data.summary,
          homework: check_in_coach_data.homework,
          files: null
        }
        // let localhost = "http://localhost:3000"
        let { data } = await axios.patch(`${process.env.VUE_APP_URL}/api/v1/coachmanagement/summary/${check_in_coach_id}`, payload, config)
        if (data.statusCode === 200) {
          Swal.fire({
            icon: "success",
            title: "บันทึกสำเร็จ",
            showDenyButton: false,
            showCancelButton: false,
            cancelButtonText: "ยกเลิก",
            confirmButtonText: "ตกลง",
          })
        }
      } catch (error) {
        console.log(error)
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          showDenyButton: false,
          showCancelButton: false,
          cancelButtonText: "ยกเลิก",
          confirmButtonText: "ตกลง",
        })
      }
    },
    async GetCoachCheckIn(context, { course_id, date }) {
      try {
        let payload = {
          checkInCoachId: null,
          summary: null,
          homework: null,
          files: null
        }
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            Authorization: `Bearer ${VueCookie.get("token")}`,
          },
        };
        let user_detail = JSON.parse(localStorage.getItem("userDetail"));
        // let localhost ="http://localhost:3000"
        let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/coachmanagement/coach/${user_detail.account_id}/course/${course_id}/date/${date}`, config)
        if (data.statusCode === 200) {
          console.log(data.data)
          data.data.forEach((check_in) => {
            let img_url = []
            if (check_in.attachment.length > 0) {
              for (const img of check_in.attachment) {
                img_url.push({
                  sumAttId: img.sumAttId,
                  checkInCoachId: img.checkInCoachId,
                  attFiles: img.attFiles,
                  attFilesUrl: `${process.env.VUE_APP_URL}/api/v1/files/${img.attFiles}`,
                  originalFilesName: img.originalFilesName,
                  filesSize: img.filesSize,
                })
              }
            }
            payload = {
              checkInCoachId: check_in.checkInCoachId,
              courseId: check_in.courseId,
              date: check_in.date,
              summary: check_in.summary,
              homework: check_in.homework,
              attachment: img_url
            }
          })
          context.commit("SetCoachCheckIn", payload)
        } else {
          throw { error: data }
        }
      } catch (error) {
        console.log(error)
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          showDenyButton: false,
          showCancelButton: false,
          cancelButtonText: "ยกเลิก",
          confirmButtonText: "ตกลง",
        })
      }
    },
    async UpdateCheckInStudent(context, { students }) {
      try {
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            Authorization: `Bearer ${VueCookie.get("token")}`,
          },
        };
        for await (const student of students) {
          setTimeout(async () => {
            const now = new Date(student.compensationDate);
            const utcOffset = 7 * 60; // UTC+7 is 7 hours ahead of UTC
            const localOffset = now.getTimezoneOffset();
            const targetOffset = utcOffset + localOffset;
            const targetTime = now.getTime() + targetOffset * 60 * 1000;
            const utcPlus7Date = new Date(targetTime);
            console.log(moment(utcPlus7Date).format("YYYY-MM-DD HH:mm"))
            let payload = {
              status: student.status, // punctual, late,  leave, emergency leave, absent,
              compensationDate: student.compensationDate ? moment(utcPlus7Date).format("YYYY-MM-DD HH:mm") : '',
              compensationStartTime: student.compensationStartTime ? moment(student.compensationStartTime).format("HH:mm") : '',
              compensationEndTime: student.compensationEndTime ? moment(student.compensationEndTime).format("HH:mm") : '',
            }
            console.log("payload :", payload)
            let { data } = await axios.patch(`${process.env.VUE_APP_URL}/api/v1/checkin/student/${student.check_in_student_id}`, payload, config)
            console.log(data)
            if (data.statusCode !== 200) {
              throw { error: data }
            }
          }, 500)
        }
        Swal.fire({
          icon: "success",
          title: "บันทึกสำเร็จ",
          showDenyButton: false,
          showCancelButton: false,
          cancelButtonText: "ยกเลิก",
          confirmButtonText: "ตกลง",
        })
      } catch (error) {
        console.log(error)
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          showDenyButton: false,
          showCancelButton: false,
          cancelButtonText: "ยกเลิก",
          confirmButtonText: "ตกลง",
        })
      }
    },
    async GetStudentByTimeId(context, { course_id, time_id, date }) {
      try {
        console.log(course_id, time_id, date)
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            Authorization: `Bearer ${VueCookie.get("token")}`,
          },
        };
        // let user_detail = JSON.parse(localStorage.getItem("userDetail"));
        // let localhost ="http://localhost:3000"
        let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/coachmanagement/course/${course_id}/date/${date}`, config)
        // console.log(data)
        if (data.statusCode === 200) {
          data.data.forEach((student, index) => {
            //console.log("compensationStartTime : ",student.compensationStartTime )
            student.no = index + 1
            student.fullname = `${student.firstNameTh} ${student.lastNameTh}`
            student.check_in_student_id = student.checkInStudentId,
              student.menu_compensation_date = false,
              student.compensationDate = student.compensationDate ? student.compensationDate !== "Invalid date" ? moment(new Date(student.compensationDate)).format("YYYY-MM-DD") : null : null
            student.compensation_date_str = student.compensationDate ? student.compensationDate !== "Invalid date" ? dateFormatter(new Date(student.compensationDate), "DD MT YYYYT") : null : null
            student.compensationStartTime = student.compensationStartTime ? student.compensationStartTime !== "Invalid date" ? moment(student.compensationStartTime, "HH:mm") : null : null
            student.compensationEndTime = student.compensationEndTime ? student.compensationStartTime !== "Invalid date" ? moment(student.compensationEndTime, "HH:mm") : null : null
            student.files = []
            student.potentialfiles = []
          });

          context.commit("SetStudentCheckIn", data.data)
        }
      } catch (error) {
        console.log(error)
      }
    },
    async CheckInCoach(context, { course_id, time_id, date }) {
      context.commit("SetCoachCheckInIsLoading", true)
      try {
        console.log(course_id, time_id, date)
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            Authorization: `Bearer ${VueCookie.get("token")}`,
          },
        };
        // let localhost = "http://localhost:3000"
        let user_detail = JSON.parse(localStorage.getItem("userDetail"));
        const { data } = await axios.post(`${process.env.VUE_APP_URL}/api/v1/coachmanagement/coach/${user_detail.account_id}/course/${course_id}`, {
          "date": date,
          "timeId": time_id
        }, config)
        if (data.statusCode === 201) {
          // let localhost = "http://localhost:3000"
          let stadentData = await axios.get(`${process.env.VUE_APP_URL}/api/v1/coachmanagement/course/${course_id}/date/${date}`, config)
          // console.log(data)
          if (stadentData.data.statusCode === 200) {
            stadentData.data.data.forEach((student, index) => {
              student.no = index + 1
              student.fullname = `${student.firstNameTh} ${student.lastNameTh}`
              student.check_in_student_id = student.checkInStudentId,
                student.menu_compensation_date = false,
                student.compensation_date = "",
                student.compensation_date_str = "",
                student.class_time = "-"
              student.check_in_status = student.status
            });
            context.commit("SetCoachCheckInIsLoading", false)
            context.commit("SetStudentCheckIn", stadentData.data.data)
          } else {
            throw { error: data }
          }
        } else {
          context.commit("SetCoachCheckInIsLoading", false)
          throw { error: data }
        }
      } catch (error) {
        context.commit("SetCoachCheckInIsLoading", false)
        console.log(error)
      }
    },
    async GetMyCourses(context, { coach_id }) {
      context.commit("SetMyCoursesIsLoading", true);
      try {
        const options = {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        };
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            Authorization: `Bearer ${VueCookie.get("token")}`,
          },
        };
        let user_detail = JSON.parse(localStorage.getItem("userDetail"));
        // let localhost = "http://localhost:3000"
        const { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/coachmanagement/coach/${coach_id}`, config);
        console.log("GetMyCourses", data.data)
        if (data.statusCode == 200) {
          let courses_task = [];
          for (const course of data.data) {
            const course_data = await axios.get(`${process.env.VUE_APP_URL}/api/v1/course/detail/${course.courseId}`);
            if (course_data.data.statusCode === 200) {
              if (course.dates.date) {
                for (const dates of course.dates.date) {
                  let start_time = course.period.start;
                  let end_time = course.period.end;
                  const [start_hours, start_minutes] = start_time.split(":");
                  const [end_hours, end_minutes] = end_time.split(":");
                  const startDate = new Date(dates);
                  startDate.setHours(start_hours);
                  startDate.setMinutes(start_minutes);
                  const endDate = new Date(dates);
                  endDate.setHours(end_hours);
                  endDate.setMinutes(end_minutes);
                  if (courses_task.filter(v => v.course_id === course.courseId && v.time_id === course.timeId && v.day_of_week_id === course.dayOfWeekId && v.start_date === moment(startDate).format("YYYY-MM-DD")).length === 0) {
                    courses_task.push({
                      course_package_name: course.packageName,
                      course_option_name: course.optionName,
                      name: course_data.data.data.courseNameTh,
                      subtitle: course_data.data.data.courseNameEn,
                      course_id: course.courseId,
                      time_id: course.timeId,
                      day_of_week_id: course.dayOfWeekId,
                      coach: `${user_detail.first_name_th} ${user_detail.last_name_th}`,
                      start_date: moment(startDate).format("YYYY-MM-DD"),
                      start_date_str: startDate.toLocaleDateString("th-TH", options),
                      start: moment(startDate).format("YYYY-MM-DD HH:mm"),
                      end: moment(endDate).format("YYYY-MM-DD HH:mm"),
                      start_time: start_time,
                      end_time: end_time,
                      category_name: course_data.data.data.categoryNameTh,
                      course_img: course_data.data.data.courseImg ? `${process.env.VUE_APP_URL}/api/v1/files/${course_data.data.data.courseImg}` : "",
                      course_per_time: course_data.data.data.coursePerTime,
                      show_summary: false,
                      show_assessment: false,
                      show_assessment_pantential: false,
                    });
                  }
                }

              } else if (course.dates.dates) {
                for (const dates of course.dates.dates) {
                  let start_time = course.period.start;
                  let end_time = course.period.end;
                  const [start_hours, start_minutes] = start_time.split(":");
                  const [end_hours, end_minutes] = end_time.split(":");
                  const startDate = new Date(dates);
                  startDate.setHours(start_hours);
                  startDate.setMinutes(start_minutes);
                  const endDate = new Date(dates);
                  endDate.setHours(end_hours);
                  endDate.setMinutes(end_minutes);
                  if (courses_task.filter(v => v.course_id === course.courseId && v.time_id === course.timeId && v.day_of_week_id === course.dayOfWeekId && v.start_date === moment(startDate).format("YYYY-MM-DD")).length === 0) {
                    courses_task.push({
                      name: course_data.data.data.courseNameTh,
                      subtitle: course_data.data.data.courseNameEn,
                      course_id: course.courseId,
                      time_id: course.timeId,
                      day_of_week_id: course.dayOfWeekId,
                      coach: `${user_detail.first_name_th} ${user_detail.last_name_th}`,
                      start_date: moment(startDate).format("YYYY-MM-DD"),
                      start_date_str: startDate.toLocaleDateString("th-TH", options),
                      start: moment(startDate).format("YYYY-MM-DD HH:mm"),
                      end: moment(endDate).format("YYYY-MM-DD HH:mm"),
                      start_time: start_time,
                      end_time: end_time,
                      category_name: course_data.data.data.categoryNameTh,
                      // course_option_name: data.data.optionName,
                      course_package_name: data.data.packageName,
                      course_img: course_data.data.data.courseImg
                        ? `${process.env.VUE_APP_URL}/api/v1/files/${course_data.data.data.courseImg}`
                        : "",
                      course_per_time: course_data.data.data.coursePerTime,
                      show_summary: false,
                      show_assessment: false,
                      show_assessment_pantential: false,
                    });
                  }
                }
              }
            }
          }
          context.commit("SetMyCourses", courses_task);
          context.commit("SetMyCoursesIsLoading", false);
        }


        // let { data } = await axios.get(
        //   `${process.env.VUE_APP_URL}/api/v1/mycourse/coach/${coach_id}`,
        //   config
        // );
        // console.log(data);
        // if(data.statusCode === 200){
        //     console.log(data.data)

        //     let courses_task = []
        //     for(const course  of data.data){
        //         console.log(course)
        //         for(const dates of course.dates){
        //             let start_time = course?.start ? course?.start : course.coursePeriodStartDate
        //             let end_time =  course?.end ? course?.end :course.coursePeriodEndDate
        //             const [start_hours, start_minutes] = start_time.split(":");
        //             const [end_hours, end_minutes] = end_time.split(":");
        //             const startDate = new Date(dates);
        //             startDate.setHours(start_hours);
        //             startDate.setMinutes(start_minutes);
        //             const endDate = new Date(dates);
        //             endDate.setHours(end_hours);
        //             endDate.setMinutes(end_minutes);
        //             console.log(startDate.toISOString(), endDate.toISOString());
        //             courses_task.push({
        //                 name: course.courseNameTh,
        //                 subtitle : course.courseNameEn,
        //                 course_id : course.courseId,
        //                 coach : `${user_detail.first_name_th} ${user_detail.last_name_th}`,
        //                 start_date: moment(startDate).format("YYYY-MM-DD"),
        //                 start_date_str : startDate.toLocaleDateString('th-TH',options),
        //                 start: moment(startDate).format("YYYY-MM-DD HH:mm") ,
        //                 end: moment(endDate).format("YYYY-MM-DD HH:mm"),
        //                 start_time: start_time,
        //                 end_time: end_time,
        //                 course_img : course.courseImg ? `${process.env.VUE_APP_URL}/api/v1/files/${course.courseImg}` : "",
        //                 course_per_time: course.coursePerTime
        //             })
        //         }
        //     }
        //     context.commit("SetMyCourses",courses_task)
        //     context.commit("SetMyCoursesIsLoading", false)
        // }else{
        //     throw data
        // }
      } catch (error) {
        context.commit("SetMyCoursesIsLoading", false);
        console.log(error);
      }
    },
    async UploadFileSummary(context, { checkInCoach, files }) {
      try {
        console.log(checkInCoach)
        console.log(files)
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            Authorization: `Bearer ${VueCookie.get("token")}`,
          },
        };
        let payloadData = new FormData()
        payloadData.append("summary", checkInCoach.summary ? checkInCoach.summary : "")
        payloadData.append("homework", checkInCoach.homework ? checkInCoach.homework : "")
        if (files) {
          for await (const file of files) {
            payloadData.append(`img_url`, file);
          }
        }
        // let localhost = "http://localhost:3000"
        let { data } = await axios.patch(`${process.env.VUE_APP_URL}/api/v1/coachmanagement/summary/${checkInCoach.checkInCoachId}`, payloadData, config)
        console.log(data)
        if (data.statusCode == 200) {
          await Swal.fire({
            icon: "success",
            title: "บันทึกสำเร็จ",
            showDenyButton: false,
            showCancelButton: false,
            cancelButtonText: "ยกเลิก",
            confirmButtonText: "ตกลง",
          })
          // .then(async (result) => {
          //   if (result.isConfirmed) {
          //     let user_detail =  JSON.parse(localStorage.getItem("userDetail"));
          //     let date = new Date(checkInCoach.date).toISOString().substring(0, 10)
          //     let {data} = await axios.get(`${process.env.VUE_APP_URL}/api/v1/coachmanagement/coach/${user_detail.account_id}/course/${checkInCoach.courseId}/date/${date}`,config)
          //     if(data.statusCode === 200){
          //       console.log( data.data)
          //       let payload = {}
          //       data.data.forEach((check_in)=>{
          //         let img_url = []
          //         if(check_in.attachment.length > 0){
          //           for(const img of check_in.attachment ){
          //             img_url.push({
          //               sumAttId : img.sumAttId,
          //               checkInCoachId: img.checkInCoachId,
          //               attFiles: img.attFiles,
          //               attFilesUrl : `${process.env.VUE_APP_URL}/api/v1/files/${img.attFiles}`,

          //             })
          //           }
          //         }
          //         payload = {
          //           checkInCoachId : check_in.checkInCoachId,
          //           courseId : check_in.courseId,
          //           date: check_in.date,
          //           summary :check_in.summary,
          //           homework :check_in.homework,
          //           attachment : img_url
          //         }
          //       })
          //       context.commit("SetCoachCheckIn",payload)
          //     }
          //   }
          // })
        }
      } catch (error) {
        console.log(error)
      }
    },
    async GetAttachmentLeave(context, { coach_leave_id }) {
      try {
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            Authorization: `Bearer ${VueCookie.get("token")}`,
          },
        };
        // let localhost = "http://localhost:3000"
        let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/coach/leave/attachment/${coach_leave_id}`, config)
        if (data.statusCode === 200) {

          context.commit("SetAttachmentLeave", data.data)
        }
      } catch (error) {
        console.log(error)
      }
    },
    async SaveCoachLeave(context, { coach_leave_data, files }) {
      try {
        let user_detail = JSON.parse(localStorage.getItem("userDetail"))
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            Authorization: `Bearer ${VueCookie.get("token")}`,
          },
        };
        let payload = {
          coachId: coach_leave_data.coach_id,
          leaveType: coach_leave_data.leave_type,
          period: coach_leave_data.period,
          startDate: coach_leave_data.start_date,
          endDate: coach_leave_data.end_date,
          remark: coach_leave_data.remark,
          status: "pending",
          courses: []
        }
        await coach_leave_data.courses.forEach((course) => {
          payload.courses.push({
            courseId: course.course_id,
            substituteCoachId: course.substitute_coach_id,
            dayOfWeekId: course.day_of_week_id,
            timeId: course.time_id
          })
        })
        // let localhost = "http://localhost:3000"
        let payloadData = new FormData()
        payloadData.append("payload", JSON.stringify(payload))
        for (const [index, file] of files.entries()) {
          payloadData.append(`file${index}`, file, encodeURIComponent(file.name));
        }
        let { data } = await axios.post(`${process.env.VUE_APP_URL}/api/v1/coach/leave`, payloadData, config)
        if (data.statusCode === 201) {
          Swal.fire({
            icon: "success",
            title: "บันทึกสำเร็จ",
            showDenyButton: false,
            showCancelButton: false,
            cancelButtonText: "ยกเลิก",
            confirmButtonText: "ตกลง",
          }).then(async (result) => {
            if (result.isConfirmed) {
              let getLeaves = await axios.get(`${process.env.VUE_APP_URL}/api/v1/coach/leave/${user_detail.account_id}`, config)
              console.log(getLeaves)
              if (getLeaves.data.statusCode === 200) {
                context.commit("SetCoachLeaves", getLeaves.data.data)
              } else {
                throw { error: getLeaves }
              }
            }
          })

        }
      } catch (error) {
        console.log(error)
      }
    },
    async GetLeavesByAccountId(context, { account_id }) {
      try {
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            Authorization: `Bearer ${VueCookie.get("token")}`,
          },
        };
        // let localhost = "http://localhost:3000"
        let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/coach/leave/${account_id}`, config)
        if (data.statusCode === 200) {
          console.log(data.data)
          context.commit("SetCoachLeaves", data.data)
        }
      } catch (error) {
        console.log(error)
      }
    },
    async updateStatusCoachLeave(context, { coach_leave_id, status, account_id }) {
      try {
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            Authorization: `Bearer ${VueCookie.get("token")}`,
          },
        };
        // let localhost = "http://localhost:3000"
        let { data } = await axios.patch(`${process.env.VUE_APP_URL}/api/v1/coach/leave/${coach_leave_id}`, { status: status }, config)
        if (data.statusCode === 200) {
          // let localhost = "http://localhost:3000"
          let getLeaves = await axios.get(`${process.env.VUE_APP_URL}/api/v1/coach/leave/${account_id}`, config)
          if (data.statusCode === 200) {
            context.commit("SetCoachLeaves", getLeaves.data.data)
            Swal.fire({
              icon: "success",
              title: "แก้ไขสำเร็จ",
              showDenyButton: false,
              showCancelButton: false,
              cancelButtonText: "ยกเลิก",
              confirmButtonText: "ตกลง",
            })
          }
        }
      } catch (error) {
        console.log(error)
      }
    }
  },
  getters: {
    getCoach(state) {
      return state.coach;
    },
    getCoachs(state) {
      return state.coachs;
    },
    getMyCourses(state) {
      return state.my_courses;
    },
    getMyCoursesIsLoading(state) {
      return state.my_courses_is_loading;
    },
    getCoachCheckIn(state) {
      return state.coach_check_in
    },
    getCoachCheckInIsLoading(state) {
      return state.coach_check_in_is_loading
    },
    getCoachLeaves(state) {
      return state.coach_leaves
    },
    getCoachLeavesIsLoading(state) {
      return state.coach_leaves_is_loading
    },
    getStudentCheckIn(state) {
      return state.student_check_in
    },
    getAttachmentLeave(state) {
      return state.attachment_leave
    }
  },
};

export default coachModules;

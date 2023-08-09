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
    my_courses_leave: [],
    my_courses_leave_is_loading: false,
    coach_check_in: {},
    student_check_in: [],
    student_check_in_is_loading: false,
    coach_check_in_is_loading: false,
    coach_leaves: [],
    coach_leaves_is_loading: false,
    attachment_leave: [],
    coach_leave: {},
    show_dialog_coach_leave_form: false,
  },
  mutations: {
    SetMyCoursesLeave(state, payload) {
      state.my_courses_leave = payload
    },
    SetMyCoursesLeaveIsLoading(state, value) {
      state.my_courses_leave_is_loading = value
    },
    SetShowDialogCoachLeaveForm(state, payload) {
      state.show_dialog_coach_leave_form = payload
    },
    SetAttachmentLeave(state, payload) {
      state.attachment_leave = payload
    },
    SetCoachLeave(state, payload) {
      state.coach_leave = payload
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
    SetStudentCheckInIsLoading(state, payload) {
      state.student_check_in_is_loading = payload
    },
    SetMyCourses(state, payload) {
      state.my_courses = payload;
    },
    SetMyCoursesIsLoading(state, value) {
      state.my_courses_is_loading = value;
    },
  },
  actions: {
    async SearchCourseDateCoachLeave(context, { account_id, start_date, end_date }) {
      context.commit("SetMyCoursesLeaveIsLoading", true)
      let config = {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-type": "Application/json",
          Authorization: `Bearer ${VueCookie.get("token")}`,
        },
      };
      try {
        let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/manage/course-filter/${account_id}/?startDate=${start_date}&endDate=${end_date}`, config)
        if (data.statusCode == 200) {
          for (let course of data.data) {
            if (course.courseTypeId === 'CT_2') {
              course.dayOfWeekName = course.dayOfWeekName.split(",")
            }
          }
          context.commit("SetMyCoursesLeave", data.data)
          context.commit("SetMyCoursesLeaveIsLoading", false)
        }
      } catch (error) {
        context.commit("SetMyCoursesLeaveIsLoading", false)
      }
    },
    async DeleteAssessmentPotentialFile(context, { att_assessment_id }) {
      try {
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
        let { data } = await axios.delete(`${process.env.VUE_APP_URL}/api/v1/coachmanagement/summary/${att_assessment_id}`)
        console.log(data)
      } catch (error) {
        console.log(error)
      }
    },
    // ASSESSMENT POTENTIAL
    async UpdateAssessmentPotential(context, { students, course_id, time_id, date }) {
      context.commit("SetStudentCheckInIsLoading", true)
      try {
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            Authorization: `Bearer ${VueCookie.get("token")}`,
          },
        };
        let count = 0
        for await (const student of students.filter(v => v.potential)) {
          let payload = {
            status: student.check_in_status, // punctual, late,  leave, emergency leave, absent,
            evolution: student.potential.evolution ? student.potential.evolution : '',
            interest: student.potential.interest ? student.potential.interest : '',
            remark: student.potential.remark ? student.potential.remark : '',
          }
          let payloadData = new FormData()
          if (student.potentialfiles) {
            for (const file of student.potentialfiles) {
              payloadData.append("img_url", file);
            }
          }
          payloadData.append("payload", JSON.stringify(payload))
          let { data } = await axios.patch(`${process.env.VUE_APP_URL}/api/v1/coachmanagement/potential/${student.potential.checkInPotentialId}`, payloadData, config)
          if (data.statusCode == 200) {
            count = count + 1
          } else {
            throw { error: data }
          }
        }
        if (count === students.filter(v => v.potential).length) {
          context.commit("SetStudentCheckInIsLoading", false)
          await Swal.fire({
            icon: "success",
            title: "บันทึกสำเร็จ",
            showDenyButton: false,
            showCancelButton: false,
            cancelButtonText: "ยกเลิก",
            timer: 3000,
            confirmButtonText: "ตกลง",
          })
          setTimeout(() => {
            context.dispatch("GetStudentByTimeId", {
              course_id: course_id,
              date: date,
              time_id: time_id,
            })
          }, 200)
        }

      } catch (error) {
        context.commit("SetStudentCheckInIsLoading", false)
      }
    },
    // ASSESSMENT
    async AssessmentStudent(context, { students, course_id, date, time_id }) {
      context.commit("SetStudentCheckInIsLoading", true)
      try {
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            Authorization: `Bearer ${VueCookie.get("token")}`,
          },
        };
        let count = 0
        for await (const student of students) {
          if (student.assessment.rating_evolution === 3) {
            student.assessment.evolution = "adjust"
          } else if (student.assessment.rating_evolution === 4) {
            student.assessment.evolution = "good"
          } else if (student.assessment.rating_evolution === 5) {
            student.assessment.evolution = "very good"
          }
          if (student.assessment.rating_interest === 3) {
            student.assessment.interest = "adjust"
          } else if (student.assessment.rating_interest === 4) {
            student.assessment.interest = "good"
          } else if (student.assessment.rating_interest === 5) {
            student.assessment.interest = "very good"
          }
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
              payloadData.append(`img_url`, file, file.fileName);
            }
          }
          if (!student.assessment.assessmentStudentsId) {
            payloadData.append("payload", JSON.stringify(payload))
            let { data } = await axios.post(`${process.env.VUE_APP_URL}/api/v1/coachmanagement/assessment/${student.check_in_student_id}`, payloadData, config)
            if (data.statusCode == 201) {
              count = count + 1
            } else {
              throw { error: data }
            }
          } else {
            payloadData.append("payload", JSON.stringify(payload))
            let { data } = await axios.patch(`${process.env.VUE_APP_URL}/api/v1/coachmanagement/assessment/${student.check_in_student_id}`, payloadData, config)
            if (data.statusCode == 200) {
              count = count + 1
            } else {
              throw { error: data }
            }
          }
        }
        if (count === students.length) {
          context.commit("SetStudentCheckInIsLoading", false)
          await Swal.fire({
            icon: "success",
            title: "บันทึกสำเร็จ",
            showDenyButton: false,
            showCancelButton: false,
            cancelButtonText: "ยกเลิก",
            confirmButtonText: "ตกลง",
          }).then(async (result) => {
            if (result.isConfirmed) {
              context.dispatch("GetStudentByTimeId", {
                course_id: course_id,
                date: date,
                time_id: time_id,
              })
            }
          })
        }
      } catch (error) {
        await Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          showDenyButton: false,
          showCancelButton: false,
          cancelButtonText: "ยกเลิก",
          confirmButtonText: "ตกลง",
        })
        context.commit("SetStudentCheckInIsLoading", false)
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

        let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/coachmanagement/coach/${user_detail.account_id}/course/${course_id}/date/${date}`, config)
        if (data.statusCode === 200) {
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
                  filesType: img.filesType
                })
              }
            }
            payload = {
              checkInCoachId: check_in.checkInCoachId,
              courseId: check_in.courseId,
              date: check_in.date,
              summary: check_in.summary,
              homework: check_in.homework,
              attachment: img_url,
              summary_files: [],
            }
          })
          context.commit("SetCoachCheckIn", payload)
        } else {
          throw { error: data }
        }
      } catch (error) {
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
    async UpdateCheckInStudent(context, { students, course_id, date, time_id }) {
      try {
        context.commit("SetStudentCheckInIsLoading", true)
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            Authorization: `Bearer ${VueCookie.get("token")}`,
          },
        };
        let count = 0
        for await (const student of students) {
          let payload = {
            status: student.status, // punctual, late,  leave, emergency leave, absent,
            compensationDate: student.compensationDate ? moment(new Date(student.compensationDate)).format("YYYY-MM-DD") : '',
            compensationStartTime: student.compensationStartTime ? moment(student.compensationStartTime).format("HH:mm") : '',
            compensationEndTime: student.compensationEndTime ? moment(student.compensationEndTime).format("HH:mm") : '',
          }
          let { data } = await axios.patch(`${process.env.VUE_APP_URL}/api/v1/checkin/student/${student.check_in_student_id}`, payload, config)
          if (data.statusCode == 200) {
            count = count + 1
          } else {
            throw { error: data }
          }
        }
        if (count === students.length) {
          context.commit("SetStudentCheckInIsLoading", false)
          await Swal.fire({
            icon: "success",
            title: "บันทึกสำเร็จ",
            showDenyButton: false,
            showCancelButton: false,
            cancelButtonText: "ยกเลิก",
            confirmButtonText: "ตกลง",
          }).then(async (result) => {
            if (result.isConfirmed) {
              context.dispatch("GetStudentByTimeId", {
                course_id: course_id,
                date: date,
                time_id: time_id,
              })
            }
          })
        }
      } catch (error) {
        context.commit("SetStudentCheckInIsLoading", false)
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
    async GetStudentByTimeId(context, { course_id, date }) {
      try {
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            Authorization: `Bearer ${VueCookie.get("token")}`,
          },
        };
        let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/coachmanagement/course/${course_id}/date/${date}`, config)
        if (data.statusCode === 200) {
          let i = 1
          for await (let student of data.data) {
            student.no = i
            student.fullname = `${student.firstNameTh} ${student.lastNameTh}`
            student.check_in_student_id = student.checkInStudentId,
              student.menu_compensation_date = false,
              student.compensationDate = student.compensationDate ? student.compensationDate !== "Invalid date" ? moment(new Date(student.compensationDate)).format("YYYY-MM-DD") : null : null
            student.compensation_date_str = student.compensationDate ? student.compensationDate !== "Invalid date" ? dateFormatter(new Date(student.compensationDate), "DD MT YYYYT") : null : null
            student.compensationStartTime = student.compensationStartTime ? moment(student.compensationStartTime, "HH:mm") : null
            student.compensationEndTime = student.compensationEndTime ? moment(student.compensationEndTime, "HH:mm") : null
            student.files = []
            student.potentialfiles = []
            i = i + 1
          }
          await context.commit("SetStudentCheckIn", data.data)
        }
      } catch (error) {
        console.log(error)
      }
    },
    async CheckInCoach(context, { course_id, time_id, date, type }) {
      context.commit("SetCoachCheckInIsLoading", true)
      try {
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            Authorization: `Bearer ${VueCookie.get("token")}`,
          },
        };
        let user_detail = JSON.parse(localStorage.getItem("userDetail"));
        const { data } = await axios.post(`${process.env.VUE_APP_URL}/api/v1/coachmanagement/coach/${user_detail.account_id}/course/${course_id}`, {
          "date": date,
          "timeId": time_id,
          "type": type
        }, config)
        if (data.statusCode === 201) {
          let stadentData = await axios.get(`${process.env.VUE_APP_URL}/api/v1/coachmanagement/course/${course_id}/date/${date}`, config)
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
      }
    },
    ShowDialogCoachLeaveForm(context, value) {
      context.commit("SetShowDialogCoachLeaveForm", value)
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
        const { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/coachmanagement/coach/${coach_id}`, config);
        if (data.statusCode == 200) {
          let courses_task = [];
          let holidays = await axios.get(`${process.env.VUE_APP_URL}/api/v1/holiday/all`, config);
          if (holidays.data.statusCode === 200) {
            for await (let holiday of holidays.data.data) {
              courses_task.push({
                type: 'holiday',
                name: holiday.holidayName,
                start_date: `${holiday.holidayYears}-${holiday.holidayMonth}-${holiday.holidayDate}`,
                start: `${holiday.holidayYears}-${holiday.holidayMonth}-${holiday.holidayDate}`
              });
            }
          }
          for await (const course of data.data) {
            const course_data = await axios.get(`${process.env.VUE_APP_URL}/api/v1/course/detail/${course.courseId}`);
            if (course_data.data.statusCode === 200) {
              if (course.coachLeaveCourses.length > 0) {
                for await (const leaveCourse of course.coachLeaveCourses) {
                  let startDate = null
                  let endDate = null
                  let start_time = null
                  let end_time = null
                  if (leaveCourse.teachCompensationDate && leaveCourse.teachCompensationStartTime && leaveCourse.teachCompensationEndTime) {
                    start_time = leaveCourse.teachCompensationStartTime;
                    end_time = leaveCourse.teachCompensationEndTime;
                    const [start_hours, start_minutes] = start_time.split(":");
                    const [end_hours, end_minutes] = end_time.split(":");
                    startDate = new Date(leaveCourse.teachCompensationDate);
                    startDate.setHours(start_hours);
                    startDate.setMinutes(start_minutes);
                    endDate = new Date(leaveCourse.teachCompensationDate);
                    endDate.setHours(end_hours);
                    endDate.setMinutes(end_minutes);

                    if (courses_task.filter(v => v.course_id === course.courseId && v.time_id === course.timeId && v.day_of_week_id === course.dayOfWeekId && v.start_date === moment(startDate).format("YYYY-MM-DD")).length === 0) {
                      courses_task.push({
                        course_package_name: course.packageName,
                        course_option_name: course.optionName,
                        name: course.courseNameTh,
                        subtitle: course.courseNameEn,
                        course_id: course.courseId,
                        time_id: course.timeId,
                        type: course?.compType ? course?.compType : null,
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
                }
              }
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
                      type: course?.compType ? course?.compType : null,
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
                for await (const dates of course.dates.dates) {
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
                      name: course.courseNameTh,
                      subtitle: course.courseNameEn,
                      course_id: course.courseId,
                      time_id: course.timeId,
                      day_of_week_id: course.dayOfWeekId,
                      type: course?.compType ? course?.compType : null,
                      coach: `${user_detail.first_name_th} ${user_detail.last_name_th}`,
                      start_date: moment(startDate).format("YYYY-MM-DD"),
                      start_date_str: startDate.toLocaleDateString("th-TH", options),
                      start: moment(startDate).format("YYYY-MM-DD HH:mm"),
                      end: moment(endDate).format("YYYY-MM-DD HH:mm"),
                      start_time: start_time,
                      end_time: end_time,
                      category_name: course_data.data.data.categoryNameTh,
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
          const sub_coach = await axios.get(`${process.env.VUE_APP_URL}/api/v1/coachmanagement/subcoach/${coach_id}`, config);
          if (sub_coach.data.statusCode === 200) {
            for await (const course of sub_coach.data.data) {
              const course_data = await axios.get(`${process.env.VUE_APP_URL}/api/v1/course/detail/${course.courseId}`);
              if (course.dates.date) {
                for await (const dates of course.dates.date) {
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
                      name: course.courseNameTh,
                      subtitle: course.courseNameEn,
                      course_id: course.courseId,
                      time_id: course.timeId,
                      day_of_week_id: course.dayOfWeekId,
                      type: course?.compType ? course?.compType : null,
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
              }
            }
          }
          context.commit("SetMyCourses", courses_task);
          context.commit("SetMyCoursesIsLoading", false);
        }
      } catch (error) {
        context.commit("SetMyCoursesIsLoading", false);
      }
    },
    async UploadFileSummary(context, { checkInCoach, files, course_id, date }) {
      try {
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
        let { data } = await axios.patch(`${process.env.VUE_APP_URL}/api/v1/coachmanagement/summary/${checkInCoach.checkInCoachId}`, payloadData, config)
        if (data.statusCode == 200) {
          await Swal.fire({
            icon: "success",
            title: "บันทึกสำเร็จ",
            showDenyButton: false,
            showCancelButton: false,
            cancelButtonText: "ยกเลิก",
            confirmButtonText: "ตกลง",
          }).then(async (result) => {
            if (result.isConfirmed) {
              context.dispatch("GetCoachCheckIn", {
                course_id: course_id,
                date: date,
              })
            }
          })
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
        let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/coach/leave/attachment/${coach_leave_id}`, config)
        if (data.statusCode === 200) {

          context.commit("SetAttachmentLeave", data.data)
        }
      } catch (error) {
        console.log(error)
      }
    },
    // COACH LEAVE 
    async GetLeavesAll(context) {
      context.commit("SetCoachLeavesIsLoading", true)
      try {
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            Authorization: `Bearer ${VueCookie.get("token")}`,
          },
        };
        let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/coach/leave`, config)
        if (data.statusCode == 200) {
          data.data.map((val, i) => {
            val.index = i + 1
            return val
          })

          context.commit("SetCoachLeaves", data.data)
          context.commit("SetCoachLeavesIsLoading", false)
        }
      } catch (error) {
        context.commit("SetCoachLeavesIsLoading", false)
      }
    },
    async SaveCoachLeave(context, { coach_leave_data, files, admin }) {
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
          dates: []
        }
        for await (let date of coach_leave_data.dates) {
          let cousers = []
          for await (const course of date.courses) {
            cousers.push({
              courseId: course.course_id,
              substituteCoachId: course.substitute_coach_id ? course.substitute_coach_id : null,
              dayOfWeekId: course.day_of_week_id,
              timeId: course.time_id,
              type: course.type,
              compensationDate: course.compensation_date ? course.compensation_date : null,
              compensationStartTime: course.compensation_start_time_obj.HH ? `${course.compensation_start_time_obj.HH}:${course.compensation_start_time_obj.mm}` : null,
              compensationEndTime: course.compensation_end_time_obj.HH ? `${course.compensation_end_time_obj.HH}:${course.compensation_end_time_obj.mm}` : null,
            })
          }
          payload.dates.push({
            date: date.date,
            courses: cousers,
          })
        }
        let payloadData = new FormData()
        payloadData.append("payload", JSON.stringify(payload))
        for (const file of files) {
          payloadData.append(`files`, file);
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
              if (admin) {
                let getLeavesAll = await axios.get(`${process.env.VUE_APP_URL}/api/v1/coach/leave`, config)
                if (getLeavesAll.data.statusCode == 200) {
                  context.commit("SetCoachLeaves", getLeavesAll.data.data)
                  context.commit("SetCoachLeavesIsLoading", false)
                } else {
                  throw { error: getLeavesAll }
                }
              } else {
                let getLeaves = await axios.get(`${process.env.VUE_APP_URL}/api/v1/coach/leave/${user_detail.account_id}`, config)
                if (getLeaves.data.statusCode === 200) {
                  context.commit("SetShowDialogCoachLeaveForm", false)
                  context.commit("SetCoachLeaves", getLeaves.data.data)
                } else {
                  throw { error: getLeaves }
                }
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
        let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/coach/leave/${account_id}`, config)
        if (data.statusCode === 200) {
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
        let { data } = await axios.patch(`${process.env.VUE_APP_URL}/api/v1/coach/leave/${coach_leave_id}`, { status: status }, config)
        if (data.statusCode === 200) {
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
    },
    async updateStatusCoachLeaveAndCoach(context, { coach_leave_data, coach_leave_id }) {
      context.commit("SetCoachLeavesIsLoading", true)
      try {
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            Authorization: `Bearer ${VueCookie.get("token")}`,
          },
        };
        let { data } = await axios.patch(`${process.env.VUE_APP_URL}/api/v1/coach/leave/coach/status/${coach_leave_id}`, coach_leave_data, config)
        if (data.statusCode == 200) {
          Swal.fire({
            icon: "success",
            title: "บันทึกสำเร็จ",
            showDenyButton: false,
            showCancelButton: false,
            cancelButtonText: "ยกเลิก",
            confirmButtonText: "ตกลง",
          }).then(async (result) => {
            if (result.isConfirmed) {
              context.dispatch("GetLeavesDetail", { coach_leave_id: coach_leave_id })
            }
          })
          context.commit("SetCoachLeavesIsLoading", false)
        }
      } catch (error) {
        context.commit("SetCoachLeavesIsLoading", false)
      }
    },
    async GetLeavesDetail(context, { coach_leave_id }) {
      try {
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            Authorization: `Bearer ${VueCookie.get("token")}`,
          },
        };
        let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/coach/leave/detail/${coach_leave_id}`, config)
        if (data.statusCode == 200) {
          const options = {
            year: "numeric",
            month: "long",
            day: "numeric",
          };
          data.data.startThDate = new Date(data.data.startDate).toLocaleDateString("th-TH", options)
          data.data.endThDate = new Date(data.data.endDate).toLocaleDateString("th-TH", options)
          data.data.createDateTh = new Date(data.data.createdDate).toLocaleDateString("th-TH", options)
          for (let date of data.data.dates) {
            for (let course of date.courses) {
              if (course.type === "date") {

                let startPart = course.compensationStartTime.split(":")
                let endPart = course.compensationEndTime.split(":")
                course.menuCompensationDate = false
                course.compensationDate = course.compensationDate ? new Date(course.compensationDate).toISOString().split('T')[0] : null,
                  course.compensationDate_str = new Date(course.compensationDate).toLocaleDateString("th-TH", options)
                course.compensationStartTime = `${startPart[0] + ':' + startPart[1]}`
                course.compensationStartTimeObj = { HH: startPart[0], mm: startPart[1] }
                course.compensationEndTime = `${endPart[0] + ':' + endPart[1]}`
                course.compensationEndTimeObj = { HH: endPart[0], mm: endPart[1] }
              }
            }
          }

          context.commit("SetCoachLeave", data.data)
        }
      } catch (error) {
        console.log(error)
      }
    },
  },
  getters: {
    getMyCoursesLeave(state) {
      return state.my_courses_leave
    },
    getMyCoursesLeaveIsLoading(state) {
      return state.my_courses_leave_is_loading
    },
    getShowDialogCoachLeaveForm(state) {
      return state.show_dialog_coach_leave_form
    },
    getStudentCheckInIsLoading(state) {
      return state.student_check_in_is_loading
    },
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
    getCoachLeave(state) {
      return state.coach_leave
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

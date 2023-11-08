import axios from "axios";
import VueCookie from "vue-cookie";
import moment from "moment";
import Swal from "sweetalert2";
import { dateFormatter } from '@/functions/functions';
import VueI18n from "../i18n";
// import VueI18n from "vue-i18n";
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
    coach_leaves_all: [],
    coach_leaves_is_loading: false,
    attachment_leave: [],
    coach_leave: {},
    coach_leave_approved: {},
    coach_leave_pending: {},
    coach_leave_reject: {},
    coach_leave_cancel: {},
    show_dialog_coach_leave_form: false,
    student_list: [],
    student_list_load: false,
    courses_option: {},
    course_coach_list: [],
    calendar_coach: []

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
    SetCoachLeaveApproved(state, payload) {
      state.coach_leave_approved = payload
    },
    SetCoachLeavePending(state, payload) {
      state.coach_leave_pending = payload
    },
    SetCoachLeaveReject(state, payload) {
      state.coach_leave_reject = payload
    },
    SetCoachLeaveCancel(state, payload) {
      state.coach_leave_cancel = payload
    },
    SetCoachLeaves(state, payload) {
      state.coach_leaves = payload
    },
    SetNewCoachLeaves(state, payload) {
      state.coach_leaves_all = payload
    },
    SetCoachLeavesIsLoading(state, value) {
      state.coach_leave_is_loading = value
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
    SetStudentList(state, value) {
      state.student_list = value;
    },
    SetStudentListLoading(state, value) {
      state.student_list_load = value
    },
    SetCoursesOption(state, payload) {
      state.courses_option = payload
    },
    SetCourseCoachList(state, payload) {
      state.course_coach_list = payload
    },
    SetCalendarCoach(state, payload) {
      state.calendar_coach = payload
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
        await axios.delete(`${process.env.VUE_APP_URL}/api/v1/coachmanagement/potential/${att_assessment_id}`)
      } catch (error) {
        console.log(error)
      }
    },
    async DeleteAssessmentFile(context, { att_assessment_id }) {
      try {
        await axios.delete(`${process.env.VUE_APP_URL}/api/v1/coachmanagement/assessment/${att_assessment_id}`)
      } catch (error) {
        console.log(error)
      }
    },
    async DeleteSummaryFile(context, { att_assessment_id }) {
      try {
        await axios.delete(`${process.env.VUE_APP_URL}/api/v1/coachmanagement/summary/${att_assessment_id}`)
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
          Swal.fire({
            icon: "success",
            title: VueI18n.t("succeed"),
            text: `( ${VueI18n.t("saved")} )`,
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          }).finally(() => {
            context.dispatch("GetStudentByTimeId", {
              course_id: course_id,
              date: date,
              time_id: time_id,
            })
          })
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
          Swal.fire({
            icon: "success",
            title: VueI18n.t("succeed"),
            text: `( ${VueI18n.t("saved")} )`,
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          }).finally(() => {
            context.dispatch("GetStudentByTimeId", {
              course_id: course_id,
              date: date,
              time_id: time_id,
            })
          })
        }
      } catch (error) {
        await Swal.fire({
          icon: "error",
          title: VueI18n.t("something went wrong"),
          timer: 3000,
          showDenyButton: false,
          showCancelButton: false,
          showConfirmButton: false,
          timerProgressBar: true,
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
            title: VueI18n.t("succeed"),
            text: `( ${VueI18n.t("saved")} )`,
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          })

        }

      } catch (error) {
        Swal.fire({
          icon: "error",
          title: VueI18n.t("something went wrong"),
          timer: 3000,
          showDenyButton: false,
          showCancelButton: false,
          showConfirmButton: false,
          timerProgressBar: true,
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
          title: VueI18n.t("something went wrong"),
          timer: 3000,
          showDenyButton: false,
          showCancelButton: false,
          showConfirmButton: false,
          timerProgressBar: true,
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
        students = students.map(v => {
          v.compensationDate = v.compensationDate ? moment(new Date(v.compensationDate)).format("YYYY-MM-DD") : ''
          v.compensationStartTime = v.compensationStartTime ? moment(v.compensationStartTime).format("HH:mm") : ''
          v.compensationEndTime = v.compensationEndTime ? moment(v.compensationEndTime).format("HH:mm") : ''
          return v
        })
        const { data } = await axios.patch(`${process.env.VUE_APP_URL}/api/v1/checkin/studentall`, students, config)
        if (data.statusCode == 200) {
          context.commit("SetStudentCheckInIsLoading", false)
          await Swal.fire({
            icon: "success",
            title: VueI18n.t("succeed"),
            text: `( ${VueI18n.t("saved")} )`,
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          }).finally(() => {
            context.dispatch("GetStudentByTimeId", {
              course_id: course_id,
              date: date,
              time_id: time_id,
            })
          })
        }
        context.commit("SetStudentCheckInIsLoading", false)
      } catch ({ response }) {
        context.commit("SetStudentCheckInIsLoading", false)
        if (response.status === 400) {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t("warning"),
            text: `( ${VueI18n.t('unable to study on the specified date. because there are already classes on the specified date')} )`,
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          })
          context.dispatch("GetStudentByTimeId", {
            course_id: course_id,
            date: date,
            time_id: time_id,
          })
        } else {
          Swal.fire({
            icon: "error",
            title: VueI18n.t("something went wrong"),
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          })
          context.dispatch("GetStudentByTimeId", {
            course_id: course_id,
            date: date,
            time_id: time_id,
          })
        }

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
            student.fullname_en = `${student.firstNameEn} ${student.lastNameEn}`
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
              student.fullname_en = `${student.firstNameEn} ${student.lastNameEn}`
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
    async GetMyCourses(context, { limit, page, course_id }) {
      context.commit("SetMyCoursesIsLoading", true);
      try {
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            Authorization: `Bearer ${VueCookie.get("token")}`,
          },
        };
        // let user_detail = JSON.parse(localStorage.getItem("userDetail"));
        let courses_task = [];
        // let localhost = "http://localhost:3000"
        let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/schedule/coach-limit?limit=${limit}&page=${page}&courseId=${course_id}`, config)
        if (data.statusCode == 200) {
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
          
          context.commit("SetCoursesOption", { limit: limit, page: page, count: data.data.length })

        }
        context.commit("SetMyCourses", data.data);
        context.commit("SetMyCoursesIsLoading", false);
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
          Swal.fire({
            icon: "success",
            title: VueI18n.t("succeed"),
            text: `( ${VueI18n.t("saved")} )`,
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          }).finally(() => {
            context.dispatch("GetCoachCheckIn", {
              course_id: course_id,
              date: date,
            })
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
    // COACH LEAVE All 
    async GetLeavesAll(context, { limit, page }) {
      context.commit("SetCoachLeavesIsLoading", true)
      try {
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            Authorization: `Bearer ${VueCookie.get("token")}`,
          },
        };
        // let localhost = "http://localhost:3000"
        let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/coach/leave/limit?limit=${limit}&page=${page}`, config)
        if (data.statusCode == 200) {
          data.data?.leaveList?.map((val, i) => {
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
    // NEW COACH LEAVE All 
    async GetNewLeavesAll(context, { limit, page, status }) {
      let startIndex = 0;
      let endIndex = 0;

      context.commit("SetCoachLeavesIsLoading", true)
      try {
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            Authorization: `Bearer ${VueCookie.get("token")}`,
          },
        };
        // let localhost = "http://localhost:3000"
        let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/coach/leave/limits?limit=${limit}&page=${page}&status=${status}`, config)
        if (data.statusCode === 200) {

          startIndex = (page - 1) * limit;
          endIndex = page * limit;
          data.data.leaveList = data.data?.leaveList.slice(startIndex, endIndex)
          data.data.count = status === 'approved' ? data.data.amountApproved : (status === 'pending' ? data.data.amountPending : (status === 'reject' ? data.data.amountReject : (status === 'cancel' ? data.data.amountCancel : data.data.amount)))
          await context.commit("SetNewCoachLeaves", data.data)
          await context.commit("SetCoachLeavesIsLoading", false)
        }
      } catch (error) {
        context.commit("SetCoachLeavesIsLoading", false)
      }
    },

    async SaveCoachLeave(context, { coach_leave_data, files, admin }) {
      try {
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
          if (admin) {
            context.dispatch("GetLeavesAll",{
              limit : 10,
              page : 1,
            })
          
          } else {
            context.dispatch("GetLeavesByAccountId",{
              limit : 10,
              page : 1,
              status :"",
            })
          }
          Swal.fire({
            icon: "success",
            title: VueI18n.t("succeed"),
            text: `( ${VueI18n.t("the resignation letter has been sent")} )`,
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        }
      } catch (error) {
        console.log(error)
      }
    },
    async GetLeavesByAccountId(context, { limit, page, status }) {
      let startIndex = 0;
      let endIndex = 0;
      context.commit("SetCoachLeavesIsLoading", true)

      try {
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            Authorization: `Bearer ${VueCookie.get("token")}`,
          },
        };
        // let localhost = "http://localhost:3000"

        let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/coach/leave/coach-limit?limit=${limit}&page=${page}&status=${status}`, config)
        if (data.statusCode === 200) {
          data.data?.leavesList.map((val, i) => {
            val.index = i + 1
            return val
          })

          startIndex = (page - 1) * limit;
          endIndex = page * limit;
          data.data.leavesList = data.data?.leavesList.slice(startIndex, endIndex)
          data.data.count = status === 'approved' ? data.data.amountApproved : (status === 'pending' ? data.data.amountPending : (status === 'reject' ? data.data.amountReject : (status === 'cancel' ? data.data.amountCancel : data.data.amount)))
          await context.commit("SetCoachLeaves", data.data)
          await context.commit("SetCoachLeavesIsLoading", false)

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
          if (getLeaves.data.statusCode === 200) {
            context.commit("SetCoachLeaves", getLeaves.data.data)
            Swal.fire({
              icon: "success",
              title: VueI18n.t("succeed"),
              text: VueI18n.t("the leave leave request form has been successfully canceled"),
              timer: 3000,
              timerProgressBar: true,
              showCancelButton: false,
              showConfirmButton: false,
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
          if (coach_leave_data.status === "reject") {
            Swal.fire({
              icon: "success",
              title: VueI18n.t("succeed"),
              text: VueI18n.t("rejection confirmed"),
              timer: 3000,
              timerProgressBar: true,
              showCancelButton: false,
              showConfirmButton: false,
            }).finally(() => {
              context.dispatch("GetLeavesDetail", { coach_leave_id: coach_leave_id })
            })
            context.commit("SetCoachLeavesIsLoading", false)
          } else if (coach_leave_data.status === "approved") {
            context.dispatch("GetLeavesDetail", { coach_leave_id: coach_leave_id })

            Swal.fire({
              icon: "success",
              title: VueI18n.t("succeed"),
              text: VueI18n.t("approval has been confirmed"),
              timer: 3000,
              timerProgressBar: true,
              showCancelButton: false,
              showConfirmButton: false,
            })
            context.commit("SetCoachLeavesIsLoading", false)
          }

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
          for (let date of data.data.dates) {
            for (let course of date.courses) {
              if (course.type === "date") {
                let startPart = course.compensationStartTime.split(":")
                let endPart = course.compensationEndTime.split(":")
                course.menuCompensationDate = false
                course.compensationDate = course.compensationDate ? new Date(course.compensationDate).toISOString().split('T')[0] : null,
                  course.compensationDate_str = course.compensationDate
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
    async GetstudentList(context, { coach_id, course_id, type, limit, page }) {
      let startIndex = 0;
      let endIndex = 0;
      context.commit("SetStudentListLoading", true)
      try {
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            Authorization: `Bearer ${VueCookie.get("token")}`,
          },
        };
        // let localhost = "http://localhost:3000"

        let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/coachmanagement/student-limit/?coachId=${coach_id}&courseId=${course_id}&type=${type}&limit=${limit}&page=${page}`, config)
        if (data.statusCode == 200) {
          data.data?.data?.map((val, i) => {
            val.index = i + 1
            return val
          })

          startIndex = (page - 1) * limit;
          endIndex = page * limit;
          data.data.data = data.data?.data.slice(startIndex, endIndex)

        }
        context.commit("SetStudentList", data.data)
        context.commit("SetStudentListLoading", false)
      } catch ({ response }) {
        context.commit("SetStudentListLoading", false)
        if (response.status === 400) {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t("warning"),
            text: VueI18n.t("please choose a course"),
            showCancelButton: false,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
          })
        }
      }
    },
    resetStudentList(context) {
      context.commit("SetStudentList", [])
    },
    async GetCourseCoachList(context) {
      try {
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            Authorization: `Bearer ${VueCookie.get("token")}`,
          },
        };
        // let localhost = "http://localhost:3000"
        let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/schedule/course-by-coach`, config)
        if (data.statusCode == 200) {
          context.commit("SetCourseCoachList", data.data)
        }
      } catch (error) {
        console.log('error :>> ', error);
      }
    },
    async GetCalendarCoach(context, { start_date, end_date }) {
      try {
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            Authorization: `Bearer ${VueCookie.get("token")}`,
          },
        };
        // let localhost = "http://localhost:3000"
        let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/schedule/coach-calendar?startDate=${start_date}&endDate=${end_date}`, config)
        if (data.statusCode == 200) {
          context.commit("SetCalendarCoach", data.data)
        }
      } catch (error) {
        console.log('error :>> ', error);
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
    getNewCoachLeaves(state) {
      return state.coach_leaves_all
    },
    getCoachLeavesIsLoading(state) {
      return state.coach_leaves_is_loading
    },
    getStudentCheckIn(state) {
      return state.student_check_in
    },
    getAttachmentLeave(state) {
      return state.attachment_leave
    },
    getstudentList(state) {
      return state.student_list
    },
    getStudentListLoading(state) {
      return state.student_list_load
    },
    getCoursesOption(state) {
      return state.courses_option
    },
    getCourseCoachList(state) {
      return state.course_coach_list
    },
    getCalendarCoach(state) {
      return state.calendar_coach
    },

  },
};

export default coachModules;

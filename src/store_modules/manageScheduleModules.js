

import axios from "axios";
import VueCookie from "vue-cookie";
import Swal from "sweetalert2";
import VueI18n from "../i18n";
const manageScheduleModules = {
  namespaced: true,
  state: {
    get_filter_course: [],
    get_all_course: [],
    get_all_course_is_loading: false,
    get_all_holidays: [],
    get_all_holidays_is_loading: false,
    get_holidays_by_id: [],
    delete_holiday: [],
    events: [],
    date_arr: [],
    date_Holy_arr: [],
    data_in_schedule: [],
    data_filter_schedule: null,
    data_search_schedule: null,
    holiday_course: null,
    course_in_holidays: [],
    create_holiday: [],
  },
  mutations: {
    SetGetAllCourseIsLoading(state, value) {
      state.get_all_course_is_loading = value;
    },
    SetGetAllHolidaysIsLoading(state, value) {
      state.get_all_holidays_is_loading = value;
    },
    SetGetFilterCourse(state, payload) {
      state.get_filter_course = payload;
    },
    SetGetAllCourse(state, payload) {
      state.get_all_course = payload;
    },
    SetGetDateArray(state, payload) {
      state.date_arr = payload;
    },
    SetGetHolidayDateArray(state, payload) {
      state.date_Holy_arr = payload;
    },

    SetGetAllHolidays(state, payload) {
      state.get_all_holidays = payload;
    },
    SetGetHolidaysById(state, payload) {
      state.get_holidays_by_id = payload;
    },
    SetEvents(state, payload) {
      state.events = payload;
    },
    SetDataInSchedule(state, payload) {
      state.data_in_schedule = payload;
    },
    SetDataFilterSchedule(state, payload) {
      state.data_filter_schedule = payload;
    },
    ResetFilterSchedule(state) {
      state.data_filter_schedule = null
    },
    ResetSearchFilterSchedule(state) {
      state.data_search_schedule = null
    },
    SetSearchFilterSchedule(state, payload) {
      let res = null
      let eventSchadule = []
      let dataInSchadule = []
      if (payload !== "") {
        if (state.data_filter_schedule?.length > 0) {
          res = state.data_filter_schedule?.filter((items) =>
            (items.name && items.name?.indexOf(payload) !== -1) || (items.coach && items.coach?.indexOf(payload) !== -1) || (items.package && items.package?.indexOf(payload) !== -1)

          )

        } else if (state.data_in_schedule?.length > 0) {
          res = state.data_in_schedule?.filter((items) =>
            (items.name && items.name?.indexOf(payload) !== -1) || (items.coach && items.coach?.indexOf(payload) !== -1) || (items.package && items.package?.indexOf(payload) !== -1)
          )
        }

        if (res?.length > 0) {
          res.map((item) => {
            let times = null;
            times = item.allday ? null : `${item.startTime} - ${item.endTime}`;

            eventSchadule.push({
              name: item.name,
              start: item.start,
              timed: times,
              color: item.color,
              allday: item.allday,
              coach: item.coach,
              package: item.package,
              type: item.type,
              startTime: item.startTime,
              endTime: item.endTime,
              selectedDate: item.selectedDate,
              itmeData: item
            });

            dataInSchadule = eventSchadule;
          });

        }
        state.data_search_schedule = dataInSchadule
      } else {
        state.data_search_schedule = null
      }

    },
    SetFilterCourseHoliday(state, payload) {
      state.holiday_course = payload
    },
    SetCourseHoliday(state, payload) {
      state.course_in_holidays = payload
    },
    SetCreateHoliday(state, payload) {
      state.create_holiday = payload
    },
  },
  actions: {
    ResetFilte(context) {
      context.commit("ResetFilterSchedule")
    },
    ResetSearch(context) {
      context.commit("ResetSearchFilterSchedule")
    },
    async GetFilterCourse(context) {
      try {
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            Authorization: `Bearer ${VueCookie.get("token")}`,
          },
        };

        let { data } = await axios.get(
          `${process.env.VUE_APP_URL}/api/v1/course/all`,
          config
        );
        if (data.statusCode === 200) {
          context.commit("SetGetFilterCourse", data.data);
        }
      } catch (error) {
        console.log(error);
      }
    },

    async GetAllCourse(context) {
      context.commit("SetGetAllCourseIsLoading", true)
      try {
        // let config = {
        //   headers: {
        //     "Access-Control-Allow-Origin": "*",
        //     "Content-type": "Application/json",
        //     Authorization: `Bearer ${VueCookie.get("token")}`,
        //   },
        // };

        // let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/admincourse/`, config)
        let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/schedule/admin`)
        if (data.statusCode === 200) {
          let arr_tmp = [];

          for await (let items of data.data) {
            arr_tmp.push(items.dates.date || items.dates.dates);
          }
          context.commit("SetGetDateArray", arr_tmp);
          context.commit("SetGetAllCourseIsLoading", false)
          context.commit("SetGetAllCourse", data.data);

        }
      } catch (error) {
        context.commit("SetGetAllCourseIsLoading", false)
      }
    },

    async GetAllHolidays(context) {
      context.commit("SetGetAllHolidaysIsLoading", true)
      const thaiMonths = [
        "มกราคม",
        "กุมภาพันธ์",
        "มีนาคม",
        "เมษายน",
        "พฤษภาคม",
        "มิถุนายน",
        "กรกฎาคม",
        "สิงหาคม",
        "กันยายน",
        "ตุลาคม",
        "พฤศจิกายน",
        "ธันวาคม",
      ];
      let events = [];
      try {
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            Authorization: `Bearer ${VueCookie.get("token")}`,
          },
        };

        let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/holiday/all`, config);
        if (data.statusCode === 200) {
          let date_Holy_arr = [];

          for await (let items of data.data) {
            date_Holy_arr.push(items.dateFormat);
          }
          await context.commit("SetGetHolidayDateArray", date_Holy_arr);

          data.data.map((item) => {
            item.fullDateHolidaysTh = `${item.holidayDate} ${thaiMonths[parseInt(item.holidayMonth) - 1]} ${parseInt(item.holidayYears) + 543}`
            item.fullDate = `${item.holidayYears}-${item.holidayMonth}-${item.holidayDate}`
            if (item.holidayStartTime && item.holidayEndTime) {
              item.ob_holidayStartTime = {
                HH: item.holidayStartTime.split(":")[0],
                mm: item.holidayStartTime.split(":")[1],
              }
              item.ob_holidayEndTime = {
                HH: item.holidayEndTime.split(":")[0],
                mm: item.holidayEndTime.split(":")[1],
              }
            }
          });
          context.commit("SetGetAllHolidays", data.data);
          context.commit("SetGetAllHolidaysIsLoading", false)
          context.commit("SetEvents", events);


        }
      } catch (error) {
        context.commit("SetGetAllHolidaysIsLoading", false)
      }
    },

    async GetEditHolidays(context, payload) {
      try {
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            Authorization: `Bearer ${VueCookie.get("token")}`,
          },
        };

        let { data } = await axios.patch(
          `${process.env.VUE_APP_URL}/api/v1/holiday/update-holiday/${payload.holidayId}`,
          payload,
          config
        );
        if (data.statusCode === 200) {
          Swal.fire({
            icon: "success",
            title: VueI18n.t("succeed"),
            text: VueI18n.t("already edited"),
            // title: this.$t("succeed"),
            // text: this.$t("save data successfully"),
            showDenyButton: false,
            showCancelButton: false,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
          context.dispatch("GetAllHolidays");
          // context.dispatch("GetDataInSchedule", { month: new Date().getMonth() + 1, yaer: new Date().getFullYear() });
        } else {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t("unsuccessful"),
            text: VueI18n.t("failed to resolve"),
            showDenyButton: false,
            showCancelButton: false,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
        }
      } catch (error) {
        console.log(error);
      }
    },

    async GetHolidaysById(context, holidaysId) {
      const thaiMonths = [
        "มกราคม",
        "กุมภาพันธ์",
        "มีนาคม",
        "เมษายน",
        "พฤษภาคม",
        "มิถุนายน",
        "กรกฎาคม",
        "สิงหาคม",
        "กันยายน",
        "ตุลาคม",
        "พฤศจิกายน",
        "ธันวาคม",
      ];

      try {
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            Authorization: `Bearer ${VueCookie.get("token")}`,
          },
        };

        let { data } = await axios.get(
          `${process.env.VUE_APP_URL}/api/v1/holiday/id/${holidaysId}`,
          config
        );

        if (data.statusCode === 200) {
          data.data.map((item) => {
            item.fullDateHolidaysTh = `${item.holidayDate} ${thaiMonths[parseInt(item.holidayMonth) - 1]
              } ${parseInt(item.holidayYears) + 543}`;
            item.fullDateHolidays = `${item.holidayYears}-${item.holidayMonth}-${item.holidayDate}`;
            if (item.holidayStartTime && item.holidayEndTime) {
              let startTime = item.holidayStartTime.split(":");
              item.holidayStartTime = { HH: startTime[0], mm: startTime[1] };

              let endTime = item.holidayEndTime.split(":");
              item.holidayEndTime = { HH: endTime[0], mm: endTime[1] };
            }
          });
          context.commit("SetGetHolidaysById", data.data);
        }
      } catch (error) {
        console.log(error);
      }
    },

    async GetDataInSchedule(context, { month, year, search, courseId, coachId, status }) {
      let dataInSchadule = [];
      let queryCourseId = ''
      let queryCoachId = ''
      let queryStatus = ''
      if (courseId) {
        for (const idCourseId of courseId) {
          queryCourseId += `&courseId=${idCourseId}`
        }
      }
      if (coachId) {
        for (const value of coachId) {
          queryCoachId += `&coachId=${value}`
        }
      }
      if (status) {
        for (const item of status) {
          queryStatus += `&status=${item}`
        }
      }
      let queryParams = [
        `month=${month}`,
        `year=${year}`,
        search ? `search=${search}` : '',

      ].filter(param => param).join('&');
      context.commit("SetGetAllHolidaysIsLoading", true)
      try {
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            Authorization: `Bearer ${VueCookie.get("token")}`,
          },
        };
        // let localhost = "http://localhost:3000"
        // let { data } = await axios.get(`${localhost}/api/v1/schedule/courseholiday-limit?${queryParams}${queryCourseId}${queryCoachId}${queryStatus}`, config);
        let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/schedule/courseholiday-limit?${queryParams}${queryCourseId}${queryCoachId}${queryStatus}`, config);
        // let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/schedule/courseholiday-limit?month=${month}&year=${year}&search=${search}${queryCourseId}${queryCoachId}${queryStatus}`, config);

        if (data.statusCode === 200) {
          let eventSchadule = [];
          data.data.map((item) => {
            let times = null;
            let colors;
            if (item.type === "holiday") {
              colors = "#e9967a";
              if (!item.allDay) {
                times = `${item.startTime} - ${item.endTime}`;
                colors = "#f19a5a";
              }
            } else {
              times = `${item.startTime} - ${item.endTime}`;
              if (item.startDate) {
                switch (new Date(item.startDate).getDay()) {
                  case 0:
                    colors = "#F898A4";
                    break;
                  case 1:
                    colors = "#FFFACD";
                    break;
                  case 2:
                    colors = "#FFBBDA";
                    break;
                  case 3:
                    colors = "#D0F4DE";
                    break;
                  case 4:
                    colors = "#FFE2D1";
                    break;
                  case 5:
                    colors = "#C0E4F6";
                    break;
                  case 6:
                    colors = "#E8CFF8";
                    break;
                }
              }
            }
            eventSchadule.push({
              name: item.name,
              start: item.startDate,
              timed: times,
              color: colors,
              allday: item.allDay,
              coach: item.coachName,
              package: item.packageName,
              type: item.type,
              startTime: item.startTime,
              endTime: item.endTime,
              selectedDate: item.selectedDate,
              itmeData: item
            });
            dataInSchadule = eventSchadule;
          });

          context.commit("SetGetAllHolidaysIsLoading", false)
          context.commit("SetDataInSchedule", dataInSchadule);
          context.commit("SetDataFilterSchedule", null);
        }
      } catch (error) {
        context.commit("SetGetAllHolidaysIsLoading", false)
      }
    },

    async GetFilterSchedule(context, query) {
      context.commit("SetGetAllHolidaysIsLoading", true)
      let params = [];
      let eventSchadule = [];
      let dataInSchadule = [];
      let query_length = 0

      try {
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            Authorization: `Bearer ${VueCookie.get("token")}`,
          },
        };

        let key = Object.keys(query);

        key.forEach((items, index) => {
          if (query[items].length > 0) {
            query_length = query[items].length
          }
          params.push(`${key[index]}=${query[items].join(`&&${key[index]}=`)}`);
        });
        // let localhost = "http://localhost:3000"
        // const endpoint = `${localhost}/api/v1/schedule/filter-schedule?${params.join("&&")}`
        const endpoint = `${process.env.VUE_APP_URL}/api/v1/schedule/filter-schedule?${params.join("&&")}`
        let { data } = await axios.get(endpoint, config);
        const res = data.data;

        if (data.statusCode === 200) {
          res.map((item) => {
            let times = null;
            let colors;
            if (item.type === "holiday") {
              colors = "#e9967a";
              if (!item.allDay) {
                times = `${item.startTime} - ${item.endTime}`;
                colors = "#f19a5a";
              }
            } else {
              times = `${item.startTime} - ${item.endTime}`;
              if (item.startDate) {
                switch (new Date(item.startDate).getDay()) {
                  case 0:
                    colors = "#F898A4";
                    break;
                  case 1:
                    colors = "#FFFACD";
                    break;
                  case 2:
                    colors = "#FFBBDA";
                    break;
                  case 3:
                    colors = "#D0F4DE";
                    break;
                  case 4:
                    colors = "#FFE2D1";
                    break;
                  case 5:
                    colors = "#C0E4F6";
                    break;
                  case 6:
                    colors = "#E8CFF8";
                    break;
                }
              }
            }

            eventSchadule.push({
              name: item.name,
              start: item.startDate,
              timed: times,
              color: colors,
              allday: false,
              coach: item.coachName,
              package: item.packageName,
              type: "normal",
              startTime: item.startTime,
              endTime: item.endTime,
              selectedDate: item.selectedDate,
              itmeData: item,
            });

            dataInSchadule = eventSchadule;
          });
          if (query_length > 0) {
            // context.commit("SetDataInSchedule", dataInSchadule);
            context.commit("SetDataFilterSchedule", dataInSchadule);
            context.commit("SetGetAllHolidaysIsLoading", false)
          } else {
            // context.commit("SetDataInSchedule", []);

            context.commit("SetDataFilterSchedule", null);
            context.commit("SetGetAllHolidaysIsLoading", false)
          }
        }
      } catch (error) {
        context.commit("SetGetAllHolidaysIsLoading", false)
      }
    },

    async GetSearchSchedule(context, search) {
      await context.commit("SetSearchFilterSchedule", search);
    },
    async GetFilterCourseHoliday(context, { holidayDate, holidayMonth, holidayYears }) {
      try {
        // let localhost = "http://localhost:3000"
        // let { data } = await axios.get(`${localhost}/api/v1/schedule/holiday?holidayDate=${holidayDate}&holidayMonth=${holidayMonth}&holidayYears=${holidayYears}`)
        let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/schedule/holiday?holidayDate=${holidayDate}&holidayMonth=${holidayMonth}&holidayYears=${holidayYears}`)
        if (data.statusCode === 200) {
          context.commit("SetFilterCourseHoliday", data.data);
        }
      } catch (error) {
        Swal.fire({
          icon: "warning",
          title: VueI18n.t("this item cannot be made"),
          text: error,
          showDenyButton: false,
          showCancelButton: false,
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      }
    },
    async SetFilterCourseHoliday(context, dataForm) {
      try {
        // let localhost = "http://localhost:3000"
        // let { data } = await axios.post(`${localhost}/api/v1/schedule/holiday`, dataForm)
        let { data } = await axios.post(`${process.env.VUE_APP_URL}/api/v1/schedule/holiday`, dataForm)
        if (data.statusCode === 201) {
          context.commit("SetCourseHoliday", data.data);
        }
      } catch (error) {
        context.commit("SetCourseHoliday", error);

        if (error?.response?.data?.message === "Can't select these dates because they are duplications of existing schedules.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t("this item cannot be made"),
            text: VueI18n.t("can't select these dates because they are duplications of existing schedules"),
            showDenyButton: false,
            showCancelButton: false,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
        } else {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t("this item cannot be made"),
            text: error,
            showDenyButton: false,
            showCancelButton: false,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
        }

      }
    },
    async CreateHoliday(context, { payload }) {
      try {
        // let localhost = "http://localhost:3000"
        // let { data } = await axios.post( `${localhost}/api/v1/holiday/create`,payload)
        let { data } = await axios.post(`${process.env.VUE_APP_URL}/api/v1/holiday/create`, payload)
        if (data.statusCode === 201) {
          context.commit("SetCreateHoliday", true);
          Swal.fire({
            icon: "success",
            title: this.$t("succeed"),
            text: this.$t("save data successfully"),
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        }
      } catch (error) {
        context.commit("SetCourseHoliday", error);

        if (error?.response?.data?.message === 'Holiday with the same date already exists.') {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t("this item cannot be made"),
            text: VueI18n.t("this date is already built into a holiday"),
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          })
        } else {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t("this item cannot be made"),
            text: error,
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          })
        }

      }
    },




  },
  getters: {
    getFilterCourse(state) {
      return state.get_filter_course;
    },
    getAllCourse(state) {
      return state.get_all_course;
    },
    getDateArray(state) {
      return state.date_arr;
    },
    getHolidayDateArray(state) {
      return state.date_Holy_arr;
    },

    getAllHolidays(state) {
      return state.get_all_holidays;
    },
    getAllCourseIsLoading(state) {
      return state.get_all_course_is_loading
    },
    getAllHolidaysIsLoading(state) {
      return state.get_all_holidays_is_loading
    },
    getHolidaysById(state) {
      return state.get_holidays_by_id;
    },
    getEventsHolidays(state) {
      return state.events;
    },
    getdataInSchadule(state) {
      return state.data_in_schedule;
    },
    getFilterSchedule(state) {
      return state.data_filter_schedule;
    },
    getSearchFilterSchedule(state) {
      return state.data_search_schedule;
    },
    getFilterCourseHoliday(state) {
      return state.holiday_course;
    },
    getCreateHoliday(state) {
      return state.create_holiday;
    },
    getCourseHoliday(state) {
      return state.course_in_holidays;
    },
  },
};

export default manageScheduleModules;

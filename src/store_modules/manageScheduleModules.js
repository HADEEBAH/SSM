import axios from "axios";
import VueCookie from "vue-cookie";
import Swal from "sweetalert2";

const manageScheduleModules = {
  namespaced: true,
  state: {
    get_filter_course: [],
    get_all_course: [],
    get_all_course_is_loading : false,
    get_all_holidays: [],
    get_all_holidays_is_loading : false,
    get_holidays_by_id: [],
    delete_holiday: [],
    events: [],
    date_arr: [],
    data_in_schedule: [],
    data_filter_schedule: null,
    data_search_schedule: null,
  },
  mutations: {
    SetGetAllCourseIsLoading(state, value){
      state.get_all_course_is_loading = value;
    },
    SetGetAllHolidaysIsLoading(state, value){
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

            // console.log("item", item);
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
            });

            dataInSchadule = eventSchadule;
          });

        }
        state.data_search_schedule = dataInSchadule
      } else {
        state.data_search_schedule = null
      }

    },
  },
  actions: {
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
        console.log("GetCoursError", error);
      }
    },

    async GetAllCourse(context) {
      context.commit("SetGetAllCourseIsLoading", true)
      try {
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            Authorization: `Bearer ${VueCookie.get("token")}`,
          },
        };

        let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/admincourse/`, config)

        if (data.statusCode === 200) {
          let arr_tmp = [];

          for await (let items of data.data) {
            arr_tmp.push(items.dates.date || items.dates.dates);
          }
          await context.commit("SetGetDateArray", arr_tmp);
          await context.commit("SetGetAllCourseIsLoading", false)
          await context.commit("SetGetAllCourse", data.data);
        }
      } catch (error) {
        context.commit("SetGetAllCourseIsLoading", false)
        console.log("err", error);
      }
    },

    async GetAllHolidays(context) {
      context.commit("SetGetAllHolidaysIsLoading",true)
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
          // let event = []
          data.data.map((item) => {
            // console.log("item------->", item);
            item.fullDateHolidaysTh = `${item.holidayDate} ${thaiMonths[parseInt(item.holidayMonth) - 1]} ${parseInt(item.holidayYears) + 543}`
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

            // let days = item.holidayDate;
            // let month = item.holidayMonth;
            // let years = item.holidayYears;
            // let startDate = new Date(years, parseInt(month) - 1, days);
            // console.log("item.holidayStartTime", item.holidayStartTime);
            // let holidayTime = !item.allDay
            //     ? `${item.holidayStartTime}-${item.holidayEndTime}`
            //     : null;
            // event.push({
            //     name: item.holidayName,
            //     start: startDate,
            //     color: "#f19a5a",
            //     timed: holidayTime,
            // });
            // events = event;
          });
          context.commit("SetGetAllHolidays", data.data);
          context.commit("SetGetAllHolidaysIsLoading",false)
          context.commit("SetEvents", events);
        }
      } catch (error) {
        context.commit("SetGetAllHolidaysIsLoading",false)
        console.log("GetAllHolidaysError", error);
      }
    },

    async GetEditHolidays(context, payload) {
      try {
        console.log("payload=>", payload);
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
            title: "แก้ไขสำเร็จ",
            showDenyButton: false,
            showCancelButton: false,
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
          });
          context.dispatch("GetAllHolidays");
          context.dispatch("GetDataInSchedule");
        } else {
          Swal.fire({
            icon: "warning",
            title: "แก้ไขไม่สำเร็จ",
            showDenyButton: false,
            showCancelButton: false,
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
          });
        }
      } catch (error) {
        console.log("error", error);
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
            // item.fullDateHolidays = `${item.holidayDate} ${item.holidayMonth} ${item.holidayYears}`
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
        console.log("SetGetHolidaysById", error);
      }
    },

    async GetDataInSchedule(context) {
      let dataInSchadule = [];
      context.commit("SetGetAllHolidaysIsLoading",true)
      try {
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            Authorization: `Bearer ${VueCookie.get("token")}`,
          },
        };
        // let localhost = "http://localhost:3000"
        let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/admincourse/courseholiday`,config);
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
            // console.log(item)
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
              itmeData : item
            });

            dataInSchadule = eventSchadule;
          });
          // await context.commit("SetDataInSchedule", data.data)
          // console.log("SetDataInSchedule", data.data);
          context.commit("SetGetAllHolidaysIsLoading",false)
          context.commit("SetDataInSchedule", dataInSchadule);
          context.commit("SetDataFilterSchedule", null);
        }
      } catch (error) {
        context.commit("SetGetAllHolidaysIsLoading",false)
        console.log("error", error);
      }
    },

    async GetFilterSchedule(context, query) {
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
          // console.log(
          //   "object",
          //   `${key[index]}=${query[items].join(`&&${key[index]}=`)}`
          // );
          params.push(`${key[index]}=${query[items].join(`&&${key[index]}=`)}`);
        });

        // console.log("params", params.join("&&"));

        // const endpoint = `http://localhost:3000/api/v1/admincourse/filter-schedule?${params.join("&&")}`
        const endpoint = `${process.env.VUE_APP_URL}/api/v1/admincourse/filter-schedule?${params.join("&&")}`
        let { data } = await axios.get(endpoint, config);
        const res = data.data;

        if (data.statusCode === 200) {
          res.map((item) => {
            let times = null;
            let colors;
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

            eventSchadule.push({
              name: item.courseNameTh,
              start: item.startDate,
              timed: times,
              color: colors,
              allday: false,
              coach: item.coachName,
              package: item.packageName,
              type: "normal",
              startTime: item.startTime,
              endTime: item.endTime,
            });

            dataInSchadule = eventSchadule;
          });

          if (query_length > 0) {
            context.commit("SetDataFilterSchedule", dataInSchadule);
          } else {
            context.commit("SetDataFilterSchedule", null);
          }
        }
      } catch (error) {
        console.log(error);
      }
    },

    async GetSearchSchedule(context, search) {
      await context.commit("SetSearchFilterSchedule", search);
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
    getAllHolidays(state) {
      return state.get_all_holidays;
    },
    getAllCourseIsLoading(state){
      return state.get_all_course_is_loading
    },
    getAllHolidaysIsLoading(state){
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
  },
};

export default manageScheduleModules;

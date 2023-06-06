import axios from "axios";
import VueCookie from "vue-cookie"
import Swal from "sweetalert2";


const manageScheduleModules = {
    namespaced: true,
    state: {
        get_filter_course: [],
        get_all_course: [],
        get_all_holidays: [],
        get_holidays_by_id: [],
        delete_holiday: [],
        events: [],
        date_arr: []

    },
    mutations: {
        SetGetFilterCourse(state, payload) {
            state.get_filter_course = payload
        },
        SetGetAllCourse(state, payload) {
            state.get_all_course = payload
        },
        SetGetDateArray(state, payload) {
            state.date_arr = payload
        },
        SetGetAllHolidays(state, payload) {
            state.get_all_holidays = payload
        },
        SetGetHolidaysById(state, payload) {
            state.get_holidays_by_id = payload
        },
        SetEvents(state, payload) {
            state.events = payload
        },
    },
    actions: {
        async GetFilterCourse(context) {
            try {
                let config = {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Content-type": "Application/json",
                        'Authorization': `Bearer ${VueCookie.get("token")}`
                    }
                }

                let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/course/all`, config)
                if (data.statusCode === 200) {
                    context.commit("SetGetFilterCourse", data.data)
                }
            } catch (error) {
                console.log("GetCoursError", error);
            }
        },

        async GetAllCourse(context) {
            try {
                let config = {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Content-type": "Application/json",
                        'Authorization': `Bearer ${VueCookie.get("token")}`
                    }
                }

                let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/admincourse/`, config)

                if (data.statusCode === 200) {
                    let arr_tmp = []

                    for await (let items of data.data) {
                        console.log("itemmmmmm", items);
                        arr_tmp.push(items.dates.date || items.dates.dates)
                    }
                    await context.commit("SetGetDateArray", arr_tmp)
                    await context.commit("SetGetAllCourse", data.data)
                }
            } catch (error) {
                console.log("err", error);
            }
        },

        async GetAllHolidays(context) {
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
            ]
            let events = []
            try {
                let config = {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Content-type": "Application/json",
                        'Authorization': `Bearer ${VueCookie.get("token")}`
                    }
                }
                let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/holiday/all`, config)
                if (data.statusCode === 200) {
                    let event = []

                    data.data.map((item) => {
                        // console.log("item------->", item);
                        item.fullDateHolidaysTh = `${item.holidayDate} ${thaiMonths[parseInt(item.holidayMonth) - 1]} ${parseInt(item.holidayYears) + 543}`

                        let days = item.holidayDate;
                        let month = item.holidayMonth;
                        let years = item.holidayYears;
                        let startDate = new Date(years, parseInt(month) - 1, days);

                        let holidayTime = !item.allDay
                            ? `${item.holidayStartTime}-${item.holidayEndTime}`
                            : null;
                        event.push({
                            name: item.holidayName,
                            start: startDate,
                            color: "#f19a5a",
                            timed: holidayTime,
                        });
                        events = event;

                    })
                    context.commit("SetGetAllHolidays", data.data)
                    context.commit("SetEvents", events)
                }

            } catch (error) {
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
                        'Authorization': `Bearer ${VueCookie.get("token")}`
                    }
                }

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
                        timerProgressBar: true
                    })
                    context.dispatch("GetAllHolidays")
                } else {
                    Swal.fire({
                        icon: "warning",
                        title: "แก้ไขไม่สำเร็จ",
                        showDenyButton: false,
                        showCancelButton: false,
                        showConfirmButton: false,
                        timer: 1500,
                        timerProgressBar: true
                    })
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
            ]

            try {
                let config = {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Content-type": "Application/json",
                        'Authorization': `Bearer ${VueCookie.get("token")}`
                    }
                }

                let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/holiday/id/${holidaysId}`, config)

                if (data.statusCode === 200) {
                    data.data.map((item) => {
                        item.fullDateHolidaysTh = `${item.holidayDate} ${thaiMonths[parseInt(item.holidayMonth) - 1]} ${parseInt(item.holidayYears) + 543}`
                        // item.fullDateHolidays = `${item.holidayDate} ${item.holidayMonth} ${item.holidayYears}`
                        item.fullDateHolidays = `${item.holidayYears}-${item.holidayMonth}-${item.holidayDate}`
                        if (item.holidayStartTime && item.holidayEndTime) {
                            let startTime = item.holidayStartTime.split(":")
                            item.holidayStartTime = { HH: startTime[0], mm: startTime[1] }

                            let endTime = item.holidayEndTime.split(":")
                            item.holidayEndTime = { HH: endTime[0], mm: endTime[1] }
                        }

                    })
                    context.commit("SetGetHolidaysById", data.data)
                }

            } catch (error) {
                console.log("SetGetHolidaysById", error);

            }
        },



    },
    getters: {
        getFilterCourse(state) {
            return state.get_filter_course
        },
        getAllCourse(state) {
            return state.get_all_course
        },
        getDateArray(state) {
            return state.date_arr
        },
        getAllHolidays(state) {
            return state.get_all_holidays
        },
        getHolidaysById(state) {
            return state.get_holidays_by_id
        },
        getEventsHolidays(state) {
            return state.events
        },
    },
};

export default manageScheduleModules;
import axios from "axios";
import VueCookie from "vue-cookie"

const manageScheduleModules = {
    namespaced: true,
    state: {
        get_course: [],
        get_all_holidays: [],
        get_holidays_by_id: [],

    },
    mutations: {
        SetGetCourse(state, payload) {
            state.get_course = payload
        },
        SetGetAllHolidays(state, payload) {
            state.get_all_holidays = payload
        },
        SetGetHolidaysById(state, payload) {
            state.get_holidays_by_id = payload
        },
    },
    actions: {
        async GetCourse(context) {
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
                    context.commit("SetGetCourse", data.data)
                    console.log("SetGetCourse", data.data)
                }
            } catch (error) {
                console.log("GetCoursError", error);
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

                    data.data.map((item) => {
                        item.fullDateHolidaysTh = `${item.holidayDate} ${thaiMonths[parseInt(item.holidayMonth) - 1]} ${parseInt(item.holidayYears) + 543}`
                        if (item.holidayStartTime) {
                            let startTime = item.holidayStartTime.split(":")
                            console.log(startTime);
                            item.holidayStartTime_obj = { HH: startTime[0], mm: startTime[1] }
                        }
                        // i

                    })

                    context.commit("SetGetAllHolidays", data.data)
                    console.log("SetGetAllHolidays", data.data)
                }

            } catch (error) {
                console.log("GetAllHolidaysError", error);

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
                console.log("holidaysId", holidaysId);
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
                    console.log("SetGetHolidaysById", data.data)
                }

            } catch (error) {
                console.log("SetGetHolidaysById", error);

            }
        },


    },
    getters: {
        getCourse(state) {
            return state.get_course
        },
        getAllHolidays(state) {
            return state.get_all_holidays
        },
        getHolidaysById(state) {
            return state.get_holidays_by_id
        },
    },
};

export default manageScheduleModules;
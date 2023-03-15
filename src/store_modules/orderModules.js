import axios from "axios";

const orderModules = {
    namespaced: true,
    state: {
        course_order: {
            kingdom: {},
            course_type: "",
            course_type_id : "CT_1",
            package: "",
            package_data : {},
            option : "",
            option_data : "",
            period: 0,
            times_in_class: 0,
            day: "",
            time: "",
            coach: "",
            start_day: "",
            price: 0,
            detail : "",
            remark: "",
            parents: [],
            students: [],

        },
        // เขียนใน API
        // courses:[{
        //     course_id : "",
        //     course_type_id : "",
        //     category_id : "",
        //     category_name : "",
        //     option_id : "",
        //     option_name : "",
        //     package_id:"",
        //     package_name : "",
        //     day_of_weer_id : "",
        //     day_of_weer : "",
        //     time_id : "",
        //     time : "",
        //     start_date : "",
        //     remark : "",
        //     price : "",
        //     coahc : {
        //         account_id : " ",
        //     },
        //     students :[ {
        //         account_id : "",
        //         username: "",
        //         firstname: "",
        //         lastname: "",
        //         tel: "",
        //         is_other: false,
        //         parents: [{
        //             account_id : "",
        //             username: "",
        //             firstname: "",
        //             lastname: "",
        //                 tel: "",
        //         }]
        //     },{
        //         account_id : '',
        //         username: "",
        //         firstname: "",
        //         lastname: "",
        //         tel: "",
        //         is_other: true,
        //         parents: [{
        //             account_id : "",
        //             username: "",
        //             firstname: "",
        //             lastname: "",
        //                 tel: "",
        //         }]
        //     }],
        // }]
        order: {
            order_step : 0,
            order_number: "",
            courses:[],
            created_by : "",
            payment_status: "",
            payment_type: "",
            total_price: 0,
        }
    },
    mutations: {
        SetOrder(state, payload) {
            state.order = payload
        },
        SetOrderCourse(state, payload) {
            state.course_order = payload
        },
        SetResetCourseData(state) {
            state.course_order = {
                kingdom: {},
                course_type: "",
                course_type_id : "CT_1",
                package: "",
                package_data : {},
                option : "",
                option_data : "",
                period: 0,
                times_in_class: 0,
                day: "",
                time: "",
                coach: "",
                start_day: "",
                price: 0,
                detail : "",
                remark: "",
                parents: [],
                students: [],
            }
        }

    },
    actions: {
        resetCourseData(context) {
            context.commit("SetResetCourseData")
        },
        changeCourseOrderData(context, courseData) {
            console.log("changeCourseOrderData :",courseData)
            context.commit("SetOrderCourse", courseData)
        },
        changeOrderData(context, orderData) {
            context.commit("SetOrder", orderData)
            console.log(orderData)
        },
        async saveOrder() {
            try{
                let {data} = await axios.post(`${process.env.VUE_APP_URL}/api/v1/regis/course`,{
                    "courses": [
                        {
                            "coursePackageOptionId": "a4c70208-5625-47f1-a530-9695ef867e26",
                            "dayOfWeekId": "DOWW_33",
                            "timeId": "TT_33",
                            "time": "111",
                            "startDate": "SD_33",
                            "remark": "RMK",
                            "price": "300",
                            "coach": {
                                "accountId": "accountId",
                                "firstNameTh": "firstNameTh",
                            },
                            "student": [
                                {
                                    "accountId": "15",
                                    "userName": "userName",
                                    "firstNameTh": "firstNameTh",
                                    "lastNameTh": "lastNameTh",
                                    "tel": "tel",
                                    "isOther": true,
                                    "parent": {
                                        "accountId": "16",
                                        "parentFirstnameTh": "parentFirstnameThfromregis",
                                        "parentLastnameTh": "parentLastnameTh",
                                        "parentFirstnameEn": "parentFirstnameEn",
                                        "parentLastnameEn": "parentLastnameEn",
                                        "parentTel": "parentTel"
                                    }
                                },
                                {
                                    "accountId": "17",
                                    "userName": "userName",
                                    "firstNameTh": "firstNameTh",
                                    "lastNameTh": "lastNameTh",
                                    "tel": "tel",
                                    "isOther": false,
                                    "parent": {}
                                }
                            ]
                        },
                        {
                            "coursePackageOptionId": "46d912bf-e01e-4a8b-926f-afe0b6c06f83",
                            "dayOfWeekId": "111",
                            "timeId": "111",
                            "time": "111",
                            "startDate": "111",
                            "remark": "111",
                            "price": "111",
                            "coach": {
                                "accountId": "accountId",
                                "firstNameTh": "firstNameTh",
                            },
                            "student": [
                                {
                                    "accountId": "15",
                                    "userName": "userName",
                                    "firstNameTh": "firstNameTh",
                                    "lastNameTh": "lastNameTh",
                                    "tel": "tel",
                                    "isOther": false,
                                    "parent": {
                                        "accountId": "16",
                                        "parentFirstnameTh": "parentFirstnameThfromregis",
                                        "parentLastnameTh": "parentLastnameTh",
                                        "parentFirstnameEn": "parentFirstnameEn",
                                        "parentLastnameEn": "parentLastnameEn",
                                        "parentTel": "parentTel"
                                    }
                                }
                            ]
                        }
                    ],
                    "paymentStatus": "pending",
                    "paymentType": "",
                    "totalPrice": 3000,
                })
                console.log(data)
            }catch(error){
                console.log(error)
            }
        },
     
 
    },
    getters: {
        getOrder(state) {
            return state.order
        },
        getCourseOrder(state) {
            return state.course_order
        }

    },
};

export default orderModules;

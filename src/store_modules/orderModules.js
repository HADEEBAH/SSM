
import axios from "axios";
import Swal from "sweetalert2";
import router from "@/router";
import VueCookie from "vue-cookie";
import VueI18n from "../i18n";
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
const orderModules = {
  namespaced: true,
  state: {
    course_order: {
      apply_for_yourself: false,
      apply_for_others: false,
      apply_for_parent: false,
      course_id: "",
      kingdom: {},
      course_type: "",
      course_type_id: "CT_1",
      category_id: "",
      package: "",
      package_data: {},
      option: "",
      option_data: "",
      period: 0,
      times_in_class: 0,
      day: "",
      time: "",
      coach: "",
      start_day: "",
      price: 0,
      detail: "",
      remark: "",
      selected: true,
      parents: [],
      students: [],
    },
    order: {
      courses: [],
      type: null,
      // order_step: 0,
      order_number: null,
      created_by: null,
      payment_status: null,
      payment_type: null,
      total_price: 0,
      pay_date: null,
    },

    orders: [],
    order_detail: {},
    order_is_loading: false,
    orders_is_loading: false,
    relations: [],
    cart_list: [],
    cart_list_is_loading: false,
    reserve_list: [],
    student_list: [],
    students: [],
    order_history: [],
    order_history_is_loading: false,
    order_is_status: false,
    cart_list_option: {},
    amount_cart_list: 0,
    history_list: [],
    history_list_is_loading: false,
    history_list_option: {},
    filter_finance_data: [],
    order_number_detail: [],
    package_add_student: [],
    regis_status: ''
  },
  mutations: {
    SetOrderNumberDetail(state, payload) {
      state.order_number_detail = payload
    },
    SetOrderHistory(state, payload) {
      state.order_history = payload;
    },
    SetOrderHistoryIsLoading(state, value) {
      state.order_history_is_loading = value;
    },
    SetReserveList(state, payload) {
      state.reserve_list = payload;
    },
    SetOrderIsLoading(state, value) {
      state.order_is_loading = value;
    },
    SetOrdersIsLoading(state, value) {
      state.orders_is_loading = value;
    },
    SetRelation(state, payload) {
      state.relations = payload;
    },
    SetOrder(state, payload) {
      state.order = payload;
    },
    SetOrders(state, payload) {
      state.orders = payload;
    },
    SetCartList(state, payload) {
      state.cart_list = payload;
    },
    SetCartListOption(state, payload) {
      state.cart_list_option = payload
    },
    SetCartListIsLoading(state, payload) {
      state.cart_list_is_loading = payload;
    },
    SetOrderDetail(state, payload) {
      state.order_detail = payload;
    },
    SetStudents(state, payload) {
      state.students = payload;
    },
    SetStudentListOrderDetail(state, payload) {
      state.student_list = payload;
    },
    SetOrderCourse(state, payload) {
      state.course_order = payload;
    },
    SetResetCourseData(state) {
      state.course_order = {
        apply_for_yourself: false,
        apply_for_others: false,
        apply_for_parent: false,
        kingdom: {},
        course_id: "",
        course_type: "",
        course_type_id: "CT_1",
        category_id: "",
        package: "",
        package_data: {},
        option: "",
        option_data: "",
        period: 0,
        times_in_class: 0,
        day: "",
        time: "",
        coach: "",
        start_day: "",
        price: 0,
        detail: "",
        remark: "",
        selected: true,
        parents: [],
        students: [],
      };
    },
    SetOrderIsStatus(state, payload) {
      state.order_is_status = payload;
    },
    SetAmountCartList(state, payload) {
      state.amount_cart_list = payload;
    },
    SetHistoryList(state, payload) {
      state.history_list = payload;
    },
    SetHistoryListOption(state, payload) {
      state.history_list_option = payload
    },
    SetHistoryListIsLoading(state, payload) {
      state.history_list_is_loading = payload;
    },
    SetFilterFinance(state, payload) {
      state.filter_finance_data = payload
    },
    SetAdminCourseType(state, { payload, index }) {
      state.order.courses[index].course_type_id = payload
    },
    SetAdminCourseDetail(state, { payload, index }) {
      state.order.courses[index].course_list = payload
    },
    SetAdminPackageDetail(state, { payload, index }) {
      state.order.courses[index].package_list = payload
    },
    SetAdminOptionDetail(state, { payload, index }) {
      state.order.courses[index].option_list = payload
    },
    SetAdminDayDetail(state, { payload, index }) {
      state.order.courses[index].day_of_week_list = payload
    },
    SetDayAddStudent(state, { payload, index }) {
      state.order.courses[index].day_of_week_list = payload
    },
    SetAdminTimeDetail(state, { payload, index }) {
      state.order.courses[index].time_list = payload
    },
    SetTimeAddStudent(state, { payload, index }) {
      state.order.courses[index].time_list = payload
    },
    SetAdminCoachDetail(state, { payload, index }) {
      state.order.courses[index].coach_list = payload
    },
    SetRegisStatus(state, payload) {
      state.regis_status = payload

    },

  },
  actions: {
    async getHistory(context) {
      try {
        context.commit("SetOrderHistoryIsLoading", true);
        let mapHistory = [];
        const config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            Authorization: `Bearer ${VueCookie.get("token")}`,
          },
        };
        const { data } = await axios.get(
          `${process.env.VUE_APP_URL}/api/v1/order/history`,
          config
        );
        if (data.statusCode === 200) {
          data.data.map((items) => {
            const options = { year: "numeric", month: "long", day: "numeric" };
            const thaiLocale = "th-TH";
            items.thaiDate = new Date(items.createdDate).toLocaleString(
              thaiLocale,
              options
            );
          });
          for (const item of data.data) {
            if (item.courseImg && item.courseImg !== "") {
              item.courseImg = process.env.VUE_APP_URL.concat(
                `/api/v1/files/${item.courseImg}`
              );
              item.show_student = false;
            }
            if (
              data.data.filter((v) => v.orderNumber == item.orderNumber)
                .length > 0
            ) {
              let courses = [];
              for await (const course of data.data.filter(
                (v) => v.orderNumber == item.orderNumber
              )) {
                if (!courses.some((v) => v.orderItemId == course.orderItemId)) {
                  courses.push(course);
                }
              }
              const options = {
                year: "numeric",
                month: "long",
                day: "numeric",
              };
              const thaiLocale = "th-TH";

              if (!mapHistory.some((v) => v.orderId === item.orderId)) {
                mapHistory.push({
                  orderId: item.orderId,
                  orderNumber: item.orderNumber,
                  paymentStatus: item.paymentStatus,
                  courses: courses,
                  totalPrice: item.totalPrice,
                  createdDate: new Date(item.createdDate).toLocaleString(
                    thaiLocale,
                    options
                  ),
                  createdDateStr: moment(new Date(item.createdDate)).format(
                    "YYYY-MM-DD"
                  ),
                  createdByData: item.createdByData,
                });
              }
            }
          }
        }
        context.commit("SetOrderHistory", mapHistory);
        context.commit("SetOrderHistoryIsLoading", false);
      } catch (error) {
        console.log(error);
      }
    },
    resetCourseData(context) {
      context.commit("SetResetCourseData");
    },
    changeCourseOrderData(context, courseData) {
      context.commit("SetOrderCourse", courseData);
    },
    changeOrderData(context, orderData) {
      context.commit("SetOrder", orderData);
    },
    async GetRelations(context, { student_id }) {
      try {
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            Authorization: `Bearer ${VueCookie.get("token")}`,
          },
        };
        let { data } = await axios.get(
          `${process.env.VUE_APP_URL}/api/v1/relations/user?student_id=${student_id}`,
          config
        );
        if (data.statusCode === 200) {
          if (data.data && !data.data.message) {
            context.commit("SetRelation", data.data);
          }
        } else {
          throw { error: data };
        }
      } catch (error) {
        console.log(error);
      }
    },
    async GetOrders(context, { limit, page, status }) {
      let startIndex = 0;
      let endIndex = 0;
      context.commit("SetOrdersIsLoading", true);
      try {
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            Authorization: `Bearer ${VueCookie.get("token")}`,
          },
        };
        let students = [];
        // let localhost = "http://localhost:3000"
        // let { data } = await axios.get(`${localhost}/api/v1/adminpayment/limit?limit=${limit}&page=${page}&status=${status}`, config);
        let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/adminpayment/limit?limit=${limit}&page=${page}&status=${status}`, config);
        if (data.statusCode === 200) {

          startIndex = (page - 1) * limit;
          endIndex = page * limit;
          data.data.financeList = data.data?.financeList.slice(startIndex, endIndex)
          data.data.count = status === 'success' ? data.data?.amountSuccess : (status === 'pending' ? data.data?.amountPending : (status === 'cancel' ? data.data?.amountCancel : (status === 'fail' ? data.data?.amountFail : data.data?.amount)))
          if (data.data?.financeList?.length > 0) {
            for await (let order of data.data?.financeList) {

              for await (const student of order.student) {
                if (!students.some((v) => v.account_id == student.userOneId)) {
                  students.push({
                    student_name: `${student.firstNameTh} ${student.lastNameTh}`,
                    account_id: student.userOneId,
                  });
                }
              }
              if (order.payment_status === "success") {
                let inputDate = order.payment?.paymentDate
                let cutTime = order.payment?.paymentTime
                const year = parseInt(inputDate?.substring(0, 4));
                const month = parseInt(inputDate?.substring(4, 6));
                const day = inputDate?.substring(6, 8);
                const formatted = `${year}-${month}-${day}`;
                let HH = cutTime?.slice(0, 2);
                let mm = cutTime?.slice(2, 4);
                order.paid_date = `${formatted}`
                order.paid_time = `${HH + ":" + mm}`
              } else {
                order.paid_date = ""
                order.paid_time = ""
              }
              // order.course_name = `${order.course?.courseNameTh}(${order.course?.courseNameEn})`;
              order.course_nameTh = order.course?.courseNameTh;
              order.course_nameEn = order.course?.courseNameEn;
              order.student_name = `${order.user?.firstNameTh} ${order.user?.lastNameTh}`;
              order.student_name_en = `${order.user?.firstNameEng} ${order.user?.lastNameEng}`;
            }
          }

          context.commit("SetOrders", data.data);
          context.commit("SetStudents", students);
          context.commit("SetOrdersIsLoading", false);
        } else {
          // context.commit("SetOrdersIsLoading", true);
          context.commit("SetOrdersIsLoading", false);

          throw { error: data };
        }
      } catch (error) {
        console.log(error);
      }
    },
    async FilterFinanceData(context, { name, limit, page, status }) {
      let startIndex = 0;
      let endIndex = 0;
      let students = [];

      try {
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            'Authorization': `Bearer ${VueCookie.get("token")}`
          }
        }
        // let localhost = "http://localhost:3000"
        // let { data } = await axios.get(`${localhost}/api/v1/adminpayment/finance?search=${name}&limit=${limit}&page=${page}&status=${status}`, config)
        let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/adminpayment/finance?search=${name}&limit=${limit}&page=${page}&status=${status}`, config)

        if (data.statusCode === 200) {

          startIndex = (page - 1) * limit;
          endIndex = page * limit;
          data.data.financeList = data.data?.financeList.slice(startIndex, endIndex)
          data.data.count = status === 'success' ? data.data?.amountSuccess : (status === 'pending' ? data.data?.amountPending : (status === 'cancel' ? data.data?.amountCancel : (status === 'fail' ? data.data?.amountFail : data.data?.amount)))
          if (data.data?.financeList?.length > 0) {
            for await (let order of data.data?.financeList) {

              for await (const student of order.student) {
                if (!students.some((v) => v.account_id == student.userOneId)) {
                  students.push({
                    student_name: `${student.firstNameTh} ${student.lastNameTh}`,
                    account_id: student.userOneId,
                  });
                }
              }
              if (order.payment_status === "success") {
                let inputDate = order.payment?.paymentDate
                let cutTime = order.payment?.paymentTime
                const year = parseInt(inputDate?.substring(0, 4));
                const month = parseInt(inputDate?.substring(4, 6));
                const day = inputDate?.substring(6, 8);
                const formatted = `${year}-${month}-${day}`;
                let HH = cutTime?.slice(0, 2);
                let mm = cutTime?.slice(2, 4);
                order.paid_date = `${formatted}`
                order.paid_time = `${HH + ":" + mm}`
              } else if (order.payment_status === "cancel") {
                let inputDate = order.updatedDate
                let cutTime = order.updatedTime
                const year = parseInt(inputDate?.substring(0, 4));
                const month = parseInt(inputDate?.substring(4, 6));
                const day = inputDate?.substring(6, 8);
                const formatted = `${year}-${month}-${day}`;
                let HH = cutTime?.slice(0, 2);
                let mm = cutTime?.slice(2, 4);
                order.cancel_date = `${formatted}`
                order.cancel_time = `${HH + ":" + mm}`
                // paid date & time
                if (order.payment?.paymentDate) {
                  let inputDatePaid = order.payment?.paymentDate
                  let cutTimePaid = order.payment?.paymentTime
                  const yearPaid = parseInt(inputDatePaid?.substring(0, 4));
                  const monthPaid = parseInt(inputDatePaid?.substring(4, 6));
                  const dayPaid = inputDatePaid?.substring(6, 8);
                  const formattedPaid = `${yearPaid}-${monthPaid}-${dayPaid}`;
                  let HHPaid = cutTimePaid?.slice(0, 2);
                  let mmPaid = cutTimePaid?.slice(2, 4);
                  order.paid_date = `${formattedPaid}`
                  order.paid_time = `${HHPaid + ":" + mmPaid}`
                }


              } else {
                order.paid_date = ""
                order.paid_time = ""
                order.cancel_date = ""
                order.cancel_time = ""
              }
              // order.course_name = `${order.course?.courseNameTh}(${order.course?.courseNameEn})`;
              order.course_nameTh = order.course?.courseNameTh;
              order.course_nameEn = order.course?.courseNameEn;
              order.student_name = `${order.user[0]?.firstNameTh} ${order.user[0]?.lastNameTh}`;
              order.student_name_en = `${order.user[0]?.firstNameEng} ${order.user[0]?.lastNameEng}`;
            }
          }

          context.commit("SetOrders", data.data);
          context.commit("SetStudents", students);
          context.commit("SetOrdersIsLoading", false);
        } else {
          throw { error: data }
        }
      } catch (error) {
        console.log(error);
      }
    },
    async GetOrderDetail(context, { order_number }) {
      try {
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            Authorization: `Bearer ${VueCookie.get("token")}`,
          },
        };
        // let localhost = "http://localhost:3000"
        let { data } = await axios.get(
          // `${localhost}/api/v1/adminpayment/${order_number}`,
          `${process.env.VUE_APP_URL}/api/v1/adminpayment/${order_number}`,
          config
        );
        if (data.statusCode == 200) {
          let student_name_list = [];
          let student_name_list_en = []
          let student_list = [];
          for (const order_item of data.data.orderItem) {
            if (order_item?.course?.dayOfWeekName) {
              order_item.course.dayOfWeekNameStr = dayOfWeekArray(order_item.course.dayOfWeekName)
            }
            if (order_item.students.length > 0) {
              order_item.students.forEach((student) => {
                if (!student_name_list.includes(`${student?.firstNameTh} ${student?.lastNameTh}`)
                ) {
                  student_name_list.push(
                    `${student?.firstNameTh} ${student?.lastNameTh}`
                  );
                  student_name_list_en.push(
                    `${student?.firstNameEng} ${student?.lastNameEng}`
                  )
                  student_list.push(student);
                }
              });
              data.data.student_name_list = student_name_list.join(", ");
              data.data.student_name_list_en = student_name_list_en.join(", ")
            }
          }
          if (data.data.payment?.paymentDate) {
            if (data.data.payment.paymentDate) {
              const timestamp = `${data.data.payment.paymentDate} ${data.data.payment.paymentTime}`;
              const year = timestamp.substr(0, 4);
              const month = timestamp.substr(4, 2);
              const day = timestamp.substr(6, 2);
              const hours = timestamp.substr(9, 2);
              const minutes = timestamp.substr(11, 2);
              const seconds = timestamp.substr(13, 2);

              const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
              data.data.payment.paid_date = formattedDate;
            }
          }

          await context.commit("SetOrderDetail", data.data);

          await context.commit("SetStudentListOrderDetail", student_list);
        }
      } catch (error) {
        console.log(error);
      }
    },
    async saveCart(context, { cart_data, courseData }) {

      try {
        let order = cart_data;
        let payload = {
          order_id: null,
          courses: [],
          created_by: null,
          payment_status: "pending",
          payment_type: null,
          // total_price: 0,
          regis_type: "cart",
          pay_date: null,
          discount_price: 0
        };
        let total_price = 0;
        let studentUpdate = [];
        let allStudentsValid = true; // Flag to check if all students meet the criteria

        for (const course of order.courses) {
          let students = [];
          for (const student of course.students) {
            let { data } = await axios.get(

              `${process.env.VUE_APP_URL}/api/v1/account/auth/${student.account_id}`
            );
            let itemRole = '';

            if (data?.data?.roles) {
              for (const items of data?.data?.roles) {
                itemRole = items.roleId;
              }
            }


            if (!studentUpdate.some(v => v.studentId === student.account_id)) {
              if (itemRole === 'R_5') {
                if (student.nicknameTh && student.class) {
                  studentUpdate.push({
                    "studentId": student.account_id,
                    "nicknameTh": student.nicknameTh,
                    "class": student.class
                  });
                } else {
                  allStudentsValid = false;
                  break; // Exit the loop if the criteria are not met
                }
              } else {
                if (student.nicknameTh) {
                  studentUpdate.push({
                    "studentId": student.account_id,
                    "nicknameTh": student.nicknameTh,
                    "class": null
                  });
                }
              }
            }

            if (student.parents[0]) {
              students.push({
                account_id: student.account_id ? student.account_id : null,
                username: student.username,
                firstNameTh: student.firstname,
                lastNameTh: student.lastname,
                tel: student.tel,
                is_other: student.is_other,
                parent: {
                  account_id: student.parents[0].account_id,
                  parent_first_name_th: student.parents[0].firstname_th
                    ? student.parents[0].firstname_th
                    : "",
                  parent_last_name_th: student.parents[0].lastname_th
                    ? student.parents[0].lastname_th
                    : "",
                  parent_first_name_en: student.parents[0].firstname_en,
                  parent_last_name_eh: student.parents[0].lastname_en,
                  parent_tel: student.parents[0].tel,
                },
              });
            } else {
              students.push({
                account_id: student.account_id ? student.account_id : null,
                username: student.username,
                firstNameTh: student.firstname,
                lastNameTh: student.lastname,
                tel: student.tel,
                is_other: student.is_other,
                parent: {},
              });
            }
          }

          if (!allStudentsValid) {
            break; // Exit the loop if the criteria are not met
          }

          payload.courses.push({
            course_id: course.course_id ? course.course_id : null,
            course_type_id: course.course_type_id ? course.course_type_id : null,
            course_package_option_id: course.course_type_id == 'CT_1' ? course.coach.coursePackageOptionsId ? course.coach.coursePackageOptionsId : null : null,
            time_start: course.course_type_id == 'CT_1' ? course.coach.start ? course.coach.start : null : course.time.start ? course.time.start : null,
            time_end: course.course_type_id == 'CT_1' ? course.coach.end ? course.coach.end : null : course.time.end ? course.time.end : null,
            maximumStudent: course.course_type_id == 'CT_1' ? course.coach.maximumStudent ? course.coach.maximumStudent : null : course.time.maximumStudent,
            day_of_week_id: course.course_type_id == 'CT_1' ? course.coach.dayOfWeekId ? course.coach.dayOfWeekId : null : course.time.dayOfWeekId,
            time_id: course.course_type_id == 'CT_1' ? course.coach.timeId ? course.coach.timeId : null : course.time.timeId,
            course_coach_id: course.course_type_id == 'CT_1' ? course.coach.courseCoachId ? course.coach.courseCoachId : null : courseData.coachs[0]?.course_coach_id,
            coach_name_th: course.course_type_id == 'CT_1' ? course.coach.fullNameTh ? course.coach.fullNameTh : null : course.coach_name ? course.coach_name : null,
            coach_name_en: course.course_type_id == 'CT_1' ? course.coach.fullNameEn ? course.coach.fullNameEn : null : null,
            coach_id: course.course_type_id == 'CT_1' ? course.coach.coachId ? course.coach.coachId : null : course.coach_id ? course.coach_id : null,
            start_date: moment().format("YYYY-MM-DD"),
            remark: null,
            price: course.course_type_id === "CT_1" ? (course.option.price_unit ? course.option.price_unit : 0) : course.price ? course.price : 0,
            original_price: 0,
            student: students,
            status_discount_price: false,
            status_discount_percent: false,
            discount: course.course_type_id === "CT_1" ? (course.option.discount_price ? course.option.discount_price : 0) : courseData.discount ? courseData.discount : 0,
            admin_discount: 0
          })


          let count_price = course.course_type_id === "CT_1" ? (course.option.price_unit ? course.option.price_unit : 0) : course.price ? course.price : 0
          let count_discount = course.course_type_id === "CT_1" ? (course.option.discount_price ? course.option.discount_price : 0) : courseData.discount ? courseData.discount : 0
          let total_count = count_price - count_discount || 0
          let total_student = course?.students?.length ? course?.students?.length : 0
          let total_all = (total_count) * (total_student)
          total_price = total_all


          // let price = course.option?.net_price
          //   ? course.option.net_price
          //   : course.price;
          // total_price = total_price + price * course.students.length;
        }

        if (!allStudentsValid) {
          throw "please enter your name and class";
        }

        payload.total_price = total_price;
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            Authorization: `Bearer ${VueCookie.get("token")}`,
          },
        };
        // const localhost = 'http://localhost:3002'
        let { data } = await axios.post(
          // `${localhost}/api/v1/order/cart`,
          `${process.env.VUE_APP_URL}/api/v1/order/cart`,
          payload,
          config
        );

        if (data.statusCode === 201) {
          await Swal.fire({
            icon: "success",
            title: VueI18n.t("succeed"),
            text: VueI18n.t(
              "the course has been successfully added to the cart"
            ),
            showCancelButton: false,
            showConfirmButton: false,
            showDenyButton: false,
            timer: 3000,
            timerProgressBar: true,
          }).finally(() => {
            router.push({ name: "CartList" });
          });
          localStorage.removeItem("Order");
          context.commit("SetResetCourseData");
          context.commit("SetOrder", {
            order_step: 0,
            order_number: "",
            courses: [],
            created_by: "",
            payment_status: "",
            payment_type: "",
            total_price: 0,
          });
        }

      } catch (error) {
        context.commit("SetOrder", {
          order_step: 0,
          order_number: "",
          courses: [],
          created_by: "",
          payment_status: "",
          payment_type: "",
          total_price: 0,
        });
        if (error === "please enter your name and class") {
          Swal.fire({
            icon: "error",
            title: VueI18n.t("unable to register"),
            text: VueI18n.t(
              "please enter your name and class"
            ),
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error?.response?.data?.message === "Unable to add students to cart because the course already has students listed in the cart.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t(
              "unable to register"
            ),
            text: VueI18n.t(
              "unable to add students to cart because the course already has students listed in the cart"
            ),
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error?.response?.data?.message === "User not found.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t("unable to register"),
            text: VueI18n.t(
              "please enter the student's name"
            ),
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error?.response?.data?.message?.coursePackageOptionId === "Require.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t(
              "unable to register"
            ),
            text: "coursePackageOptionId is Require",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error?.response?.data?.message?.courseId === "Require.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t(
              "unable to register"
            ),
            text: "courseId is Require",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error?.response?.data?.message?.accountId === "Require.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t(
              "unable to register"
            ),
            text: "accountId is Require",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error?.response?.data?.message?.parentFirstnameTh === "Require.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t(
              "unable to register"
            ),
            text: "parentFirstnameTh is Require",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error?.response?.data?.message?.parentLastnameTh === "Require.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t(
              "unable to register"
            ),
            text: "parentLastnameTh is Require",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error?.response?.data?.message?.parentFirstnameEn === "Require.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t(
              "unable to register"
            ),
            text: "parentFirstnameEn is Require",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error?.response?.data?.message?.parentTel === "Require.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t(
              "unable to register"
            ),
            text: "parentTel is Require",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error?.response?.data?.message?.courseTypeId === "Require.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t(
              "unable to register"
            ),
            text: "courseTypeId is Require",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error?.response?.data?.message?.timeStart === "Require.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t(
              "unable to register"
            ),
            text: "timeStart is Require",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error?.response?.data?.message?.timeEnd === "Require.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t(
              "unable to register"
            ),
            text: "timeEnd is Require",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error?.response?.data?.message?.dayOfWeekId === "Require.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t(
              "unable to register"
            ),
            text: "dayOfWeekId is Require",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error?.response?.data?.message?.timeId === "Require.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t(
              "unable to register"
            ),
            text: "timeId is Require",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error?.response?.data?.message?.courseCoachId === "Require.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t(
              "unable to register"
            ),
            text: "courseCoachId is Require",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error?.response?.data?.message?.coachNameTh === "Require.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t(
              "unable to register"
            ),
            text: "coachNameTh is Require",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error?.response?.data?.message?.coachNameEn === "Require.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t(
              "unable to register"
            ),
            text: "coachNameEn is Require",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error?.response?.data?.message?.coachId === "Require.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t(
              "unable to register"
            ),
            text: "coachId is Require",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error?.response?.data?.message?.price === "Require.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t(
              "unable to register"
            ),
            text: "price is Require",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error?.response?.data?.message?.originalPrice === "Require.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t(
              "unable to register"
            ),
            text: "originalPrice is Require",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error?.response?.data?.message?.statusDiscountPrice === "Require.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t(
              "unable to register"
            ),
            text: "statusDiscountPrice is Require",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error?.response?.data?.message?.statusDiscountPercent === "Require.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t(
              "unable to register"
            ),
            text: "statusDiscountPercent is Require",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error?.response?.data?.message?.discount === "Require.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t(
              "unable to register"
            ),
            text: "discount is Require",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error?.response?.data?.message?.adminDiscount === "Require.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t(
              "unable to register"
            ),
            text: "adminDiscount is Require",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error?.response?.data?.message?.student === "Require.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t(
              "unable to register"
            ),
            text: "student is Require",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error?.response?.data?.message?.startDate === "Require.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t(
              "unable to register"
            ),
            text: "startDate is Require",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error?.response?.data?.message?.username === "Require.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t(
              "unable to register"
            ),
            text: "username is Require",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error?.response?.data?.message?.isOther === "Require.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t(
              "unable to register"
            ),
            text: "isOther is Require",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error?.response?.data?.message?.parent === "Require.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t(
              "unable to register"
            ),
            text: "parent is Require",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else {
          Swal.fire({
            icon: "error",
            title: VueI18n.t("this item cannot be made"),
            text: error,
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        }
      }
    },
    async saveOrder(context, { regis_type, my_data_class, type_checked, discount, courseData }) {

      // othert_data_class
      context.commit("SetOrderIsLoading", true);
      try {
        let order = context.state.order;
        let configs = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            Authorization: `Bearer ${VueCookie.get("token")}`,
          },
        };
        if (order.type !== "addStudent") {
          for await (const course of order.courses) {
            for await (const student of course.students) {
              await axios.post(
                `${process.env.VUE_APP_URL}/api/v1/account/add/username/one`,
                student,
                configs
              );
            }
          }
        } else {
          for await (const course of order.courses) {
            if (course.course_type_id == "CT_2") {
              course.start_date = moment(new Date()).format("YYYY-MM-DD")
            }
          }
        }
        let payload = {
          orderId: "",
          courses: [],
          created_by: order.created_by,
          payment_status: "pending",
          payment_type: order.payment_type,
          // total_price: 0,
          regis_type: regis_type,
          pay_date: order.pay_date ? order.pay_date : null,
          discount_price: discount ? discount : 0
        };
        let total_price = 0;
        const studentUpdate = []
        let allStudentsValid = true;
        for (const course of order.courses) {
          let students = [];
          for (const student of course.students) {
            let { data } = await axios.get(

              `${process.env.VUE_APP_URL}/api/v1/account/auth/${student.account_id}`
            );
            let itemRole = null;

            for (const items of data.data.roles) {
              itemRole = items.roleId;
            }
            if (regis_type !== "cart") {
              if (order.type !== "addStudent") {
                if (!studentUpdate.some(v => v.studentId === student.account_id)) {
                  // console.log('itemRole :>> ', itemRole);
                  // !itemRole ||
                  if (itemRole === 'R_5' || itemRole === 'R_4' || type_checked === true || !data.data.roles || !itemRole) {
                    if (student.nicknameTh && student.class) {
                      let checkClass = student.class === 'อื่นๆ' ? student.class = 'Other' : student.class
                      studentUpdate.push({
                        "studentId": student.account_id,
                        "nicknameTh": student.nicknameTh,
                        "congenitalDiseaseTh": student.congenital,
                        "schoolTh": student.school,
                        "class": student.otherClass ? student.otherClass : my_data_class ? student.otherClass ? student.otherClass : my_data_class : checkClass

                      });
                    } else {
                      allStudentsValid = false;
                      break; // Exit the loop if the criteria are not met
                    }
                  } else {
                    if (student.nicknameTh) {
                      studentUpdate.push({
                        "studentId": student.account_id,
                        "nicknameTh": student.nicknameTh,
                        // "class": student.class
                      });
                    }
                  }
                }

              }
            }
            if (student.parents[0]) {
              students.push({
                account_id: student.account_id ? student.account_id : "",
                username: student.username,
                firstNameTh: student.firstname,
                lastNameTh: student.lastname,
                tel: student.tel,
                is_other: student.is_other,
                parent: {
                  account_id: student.parents[0].account_id,
                  parent_first_name_th: student.parents[0].firstname_th
                    ? student.parents[0].firstname_th
                    : "",
                  parent_last_name_th: student.parents[0].lastname_th
                    ? student.parents[0].lastname_th
                    : "",
                  parent_first_name_en: student.parents[0].firstname_en,
                  parent_last_name_eh: student.parents[0].lastname_en,
                  parent_tel: student.parents[0].tel,
                },
              });
            } else {
              students.push({
                account_id: student.account_id ? student.account_id : "",
                username: student.username,
                firstNameTh: student.firstname,
                lastNameTh: student.lastname,
                tel: student.tel,
                is_other: student.is_other,
                parent: {},
              });
            }
            if (!allStudentsValid) {
              break; // Exit the loop if the criteria are not met
            }
          }
          let date_start = moment(course.course_data?.course_study_start_date?.trim()).format("YYYY-MM-DD");
          payload.courses.push({
            course_id: course.course_id ? course.course_id : null,
            course_type_id: course.course_type_id ? course.course_type_id : null,
            course_package_option_id: regis_type === "cart" ? (course.course_package_option_id ? course.course_package_option_id : null) : (course.course_type_id == 'CT_1' ? course.coach.coursePackageOptionsId ? course.coach.coursePackageOptionsId : null : null),
            time_start: regis_type === "cart" ? (course.time.start ? course.time.start : null) : (course.course_type_id == 'CT_1' ? (course.coach.start ? course.coach.start : null) : course.time.start ? course.time.start : null),
            time_end: regis_type === "cart" ? (course.time.end ? course.time.end : null) : (course.course_type_id == 'CT_1' ? course.coach.end ? course.coach.end : null : course.time.end ? course.time.end : null),
            maximumStudent: regis_type === "cart" ? (course.time.maximumStudent ? course.time.maximumStudent : null) : (course.course_type_id == 'CT_1' ? course.coach.maximumStudent ? course.coach.maximumStudent : null : course.time.maximumStudent),
            day_of_week_id: regis_type === "cart" ? (course.time.dayOfWeekId ? course.time.dayOfWeekId : null) : (course.course_type_id == 'CT_1' ? course.coach.dayOfWeekId ? course.coach.dayOfWeekId : null : course.time.dayOfWeekId),
            time_id: regis_type === "cart" ? (course.time.timeId ? course.time.timeId : null) : (course.course_type_id == 'CT_1' ? course.coach.timeId ? course.coach.timeId : null : course.time.timeId),
            course_coach_id: regis_type === "cart" ? (course.day.course_coach_id ? course.day.course_coach_id : null) : (course.course_type_id == 'CT_1' ? (course.coach.courseCoachId ? course.coach.courseCoachId : null) : courseData.coachs[0]?.course_coach_id),
            coach_name_th: regis_type === "cart" ? (course.coach_name ? course.coach_name : null) : (course.course_type_id == 'CT_1' ? course.coach.fullNameTh ? course.coach.fullNameTh : null : course.coach_name ? course.coach_name : null),
            coach_name_en: regis_type === "cart" ? (course.coach_name_en ? course.coach_name_en : null) : (course.course_type_id == 'CT_1' ? course.coach.fullNameEn ? course.coach.fullNameEn : null : null),
            coach_id: regis_type === "cart" ? (course.coach ? course.coach : null) : (course.course_type_id == 'CT_1' ? course.coach.coachId ? course.coach.coachId : null : course.coach_id ? course.coach_id : null),
            start_date: course.course_type_id === "CT_2" ? (date_start ? date_start : moment(new Date()).format("YYYY-MM-DD")) : (course.start_date ? course.start_date : moment(new Date()).format("YYYY-MM-DD")),
            remark: course.remark ? course.remark : null,
            price: course.option?.price_unit
              ? course.option.price_unit
              : order.type !== "cart" ? course.price : course.coursePrice,
            original_price: courseData ? courseData.price_course : 0,
            student: students,
            status_discount_price: course.checkedDiscountPrice ? course.checkedDiscountPrice : false,
            status_discount_percent: course.checkedDiscountPercent ? course.checkedDiscountPercent : false,
            discount: course.course_type_id === "CT_2" ? (regis_type == 'cart' ? course.discountPrice : discount ? discount : course.discount ? course.discount : 0) : course.option.discount === true || course.checkedDiscountPrice === true ? (course.discount ? course.discount : course.option.discount_price ? course.option.discount_price : 0) : 0,
            admin_discount: course.discountOther ? course.discountOther : "0"
          })
          // if (moreDiscount) {
          //   payload.courses.forEach((course, index) => {
          //     if (moreDiscount[index]) {
          //       course.adminDiscount = moreDiscount[index] // Add the "adminDiscount" key with the value from the `data` array
          //     } else {
          //       course.adminDiscount = 0
          //     }
          //   });
          // }
          let price = 0
          let discount_per_course = 0
          let students_amount = 0
          if (order.type == "addStudent") {
            // price = course.price;
            // total_price = order.total_price * course.students.length;
            total_price = order.total_price * course.students.length;
          } else if (regis_type === '') {
            if (course.course_type_id === "CT_1") {
              if (course.option.discount) {
                price = course.option?.price_unit
                discount_per_course = course.option?.discount_price
                students_amount = course.students?.length
                total_price = (price - discount_per_course) * students_amount
              } else {
                price = course.option?.price_unit
                students_amount = course.students?.length
                total_price = (price) * students_amount
              }
            } else {
              price = courseData.price_course
              discount_per_course = courseData.discount
              students_amount = course.students?.length
              total_price = (price - discount_per_course) * students_amount
            }

          } else {
            price = course.option?.net_price
              ? course.option.net_price
              : course.price;
            if (course.price * course.students.length !== price) {
              total_price = total_price + price * course.students.length;
            } else {
              total_price = total_price + price;
            }
          }
        }
        if (!allStudentsValid) {
          throw "please enter your name and class";
        }

        payload.total_price = total_price;
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            Authorization: `Bearer ${VueCookie.get("token")}`,
          },
        };
        try {
          // const localhost = 'http://localhost:3002'
          // let { data } = await axios.post(`${localhost}/api/v1/account/student/list`, studentUpdate, config)
          let { data } = await axios.post(`${process.env.VUE_APP_URL}/api/v1/account/student/list`, studentUpdate, config)
          if (data.statusCode === 201) {
            try {
              // const localhost = 'http://localhost:3002'
              let { data } = await axios.post(
                // `${localhost}/api/v1/order/regis/course`,
                `${process.env.VUE_APP_URL}/api/v1/order/regis/course`,
                payload,
                config
              );
              if (data.statusCode === 201) {
                context.commit("SetRegisStatus", data);

                let payment_payload = {
                  orderId: data.data.orderNumber,
                  total: data.data.totalPrice,
                  subtotal: 0.0,
                  vat: 0,
                  vatRate: 0,
                  orderDesc: "",
                };
                // const localhost = 'http://localhost:3000'

                let user_data = JSON.parse(localStorage.getItem("userDetail"));
                // const userLogin = await axios.get(
                //   `${localhost}/api/v1/account/${user_data.account_id}`
                // );
                const userLogin = await axios.get(
                  `${process.env.VUE_APP_URL}/api/v1/account/${user_data.account_id}`
                );
                if (userLogin.data.statusCode === 200) {
                  let roles = [];
                  if (userLogin.data.data.userRoles.length > 0) {
                    userLogin.data.data.userRoles.forEach((role) => {
                      roles.push(role.roleId);
                    });
                  }
                  let payload = {
                    account_id: userLogin.data.data.userOneId,
                    email: userLogin.data.data.email,
                    username: user_data.username,
                    password: user_data.password,
                    first_name_en: userLogin.data.data.firstNameEng,
                    first_name_th: userLogin.data.data.firstNameTh,
                    last_name_en: userLogin.data.data.lastNameEng,
                    last_name_th: userLogin.data.data.lastNameTh,
                    role: userLogin.data.data.userRoles,
                    roles: roles,
                    tel: userLogin.data.data.mobileNo,
                  };
                  localStorage.setItem("userDetail", JSON.stringify(payload));
                }
                if (order.type !== "addStudent") {
                  // const localhost = 'http://localhost:3003'
                  // let payment = await axios.post(
                  //   `${localhost}/api/v1/payment/code`,
                  //   payment_payload
                  // );

                  let payment = await axios.post(
                    `${process.env.VUE_APP_URL}/api/v1/payment/code`,
                    payment_payload
                  );
                  if (payment.data.statusCode === 201) {
                    window.location.href = payment.data.data;
                    setTimeout(() => {
                      localStorage.removeItem("Order");
                      context.commit("SetResetCourseData");
                      context.commit("SetOrder", {
                        type: "",
                        order_step: 0,
                        order_number: "",
                        courses: [],
                        created_by: "",
                        payment_status: "",
                        payment_type: "",
                        total_price: 0,
                      });
                      context.commit("SetOrderIsLoading", false);
                    }, 500);
                  }
                } else {
                  if (order.payment_status === "paid") {
                    let payment_payload = {
                      orderId: data.data.orderNumber,
                      paymentType: order.payment_type,
                      total: data.data.totalPrice,
                      recipient: user_data.account_id,
                      pay_date: order.pay_date
                    };
                    // let endpoint = 'http://localhost:3003'
                    let endpoint = process.env.VUE_APP_URL;
                    let payment = await axios.patch(
                      `${endpoint}/api/v1/payment/data/${data.data.orderNumber}`,
                      payment_payload
                    );
                    if (payment.data.statusCode === 200) {
                      Swal.fire({
                        icon: "success",
                        title: VueI18n.t("succeed"),
                        text: VueI18n.t("the transaction has been completed"),
                        showDenyButton: false,
                        showCancelButton: false,
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                      });
                      // router.replace({ name: "Finance" });
                      localStorage.removeItem("Order");
                      context.commit("SetResetCourseData");
                      context.commit("SetOrder", {
                        type: "",
                        order_step: 0,
                        order_number: "",
                        courses: [],
                        created_by: "",
                        payment_status: "",
                        payment_type: "",
                        total_price: 0,
                      });
                      context.commit("SetOrderIsLoading", false);
                    }
                  } else {
                    // const order_enpoint = `${process.env.VUE_APP_URL}/api/v1/order/update/${data.data.orderNumber}`
                    // const payment_payload = {
                    //   paymentType: "",
                    //   paymentStatus: "pending",
                    // };
                    // await axios.patch(order_enpoint, payment_payload)
                    Swal.fire({
                      icon: "success",
                      title: VueI18n.t("succeed"),
                      text: VueI18n.t("the transaction has been completed"),
                      showDenyButton: false,
                      showCancelButton: false,
                      showConfirmButton: false,
                      timer: 3000,
                      timerProgressBar: true,
                    });
                    // router.replace({ name: "Finance" });
                    localStorage.removeItem("Order");
                    context.commit("SetResetCourseData");
                    context.commit("SetOrder", {
                      type: "",
                      order_step: 0,
                      order_number: "",
                      courses: [],
                      created_by: "",
                      payment_status: "",
                      payment_type: "",
                      total_price: 0,
                    });
                    context.commit("SetOrderIsLoading", false);
                    context.commit("SetOrderIsStatus", true);
                  }
                }
              }
            } catch (error) {
              context.commit("SetRegisStatus", error?.response?.data);

              context.commit("SetOrderIsLoading", false);
              context.commit("SetOrderIsStatus", false);
              if (error?.response?.data?.message == "Parents cannot purchase courses for them") {
                Swal.fire({
                  icon: "warning",
                  title: VueI18n.t("unable to register"),
                  text: VueI18n.t(
                    "parents cannot resave the course to their parents"
                  ),
                  timer: 3000,
                  timerProgressBar: true,
                  showCancelButton: false,
                  showConfirmButton: false,
                });
              } if (error?.response?.data?.message === "Unable to purchase the course because the course is in reserved status.") {
                Swal.fire({
                  icon: "warning",
                  title: VueI18n.t("unable to register"),
                  text: VueI18n.t(
                    "unable to purchase the course because the course is in reserved status"
                  ),
                  timer: 3000,
                  timerProgressBar: true,
                  showCancelButton: false,
                  showConfirmButton: false,
                });
              } else if (error?.response?.data?.message === "Over Registration") {
                Swal.fire({
                  icon: "warning",
                  title: VueI18n.t("unable to registere"),
                  text: VueI18n.t(
                    "cannot register , The seats are full"
                  ),
                  timer: 3000,
                  timerProgressBar: true,
                  showCancelButton: false,
                  showConfirmButton: false,
                });
              } else if (error?.response?.data?.message == "Unable to register due to course and package status being closed.") {
                Swal.fire({
                  icon: "warning",
                  title: VueI18n.t("unable to register"),
                  text: VueI18n.t(
                    "unable to register due to course and package status being closed"
                  ),
                  timer: 3000,
                  timerProgressBar: true,
                  showCancelButton: false,
                  showConfirmButton: false,
                });
              } else if (error?.response?.data?.message == "Cannot register , Because your orders are duplicated.") {
                Swal.fire({
                  icon: "warning",
                  title: VueI18n.t("unable to register"),
                  text: VueI18n.t("because your orders are duplicated"),
                  timer: 3000,
                  timerProgressBar: true,
                  showCancelButton: false,
                  showConfirmButton: false,
                });
              } else if (error?.response?.data?.message == "Over Registration") {
                Swal.fire({
                  icon: "warning",
                  title: VueI18n.t("unable to register"),
                  text: VueI18n.t(
                    "cannot register , The seats are full"
                  ),
                  timer: 3000,
                  timerProgressBar: true,
                  showCancelButton: false,
                  showConfirmButton: false,
                });
              } else if (error?.response?.data?.message == "over study end date") {
                Swal.fire({
                  icon: "warning",
                  title: VueI18n.t("unable to register"),
                  text: VueI18n.t(
                    "the class period has ended"
                  ),
                  timer: 3000,
                  timerProgressBar: true,
                  showCancelButton: false,
                  showConfirmButton: false,
                });
              } else if (error?.response?.data?.message == "over register date") {
                Swal.fire({
                  icon: "warning",
                  title: VueI18n.t("unable to register"),
                  text: VueI18n.t(
                    "outside the register date"
                  ),
                  timer: 3000,
                  timerProgressBar: true,
                  showCancelButton: false,
                  showConfirmButton: false,
                });
              } else if (error?.response?.data?.message == "Cannot register , fail at course monitor , course-coach or seats are full") {
                Swal.fire({
                  icon: "warning",
                  title: VueI18n.t("unable to register"),
                  text: VueI18n.t(
                    "unable to register Due to insufficient seats or the coach teaching in another package"
                  ),
                  timer: 3000,
                  timerProgressBar: true,
                  showCancelButton: false,
                  showConfirmButton: false,
                });
              } else if (error?.response?.data?.message === "duplicate pending order") {
                Swal.fire({
                  // icon: "error",
                  // title: VueI18n.t("unable to register"),
                  icon: "warning",
                  title: VueI18n.t("unable to register"),
                  text: VueI18n.t(
                    "duplicate user in this course Unable to register"
                  ),
                  // text: VueI18n.t(
                  //   "unable to register Because the course is already in your registration history"
                  // ),
                  timer: 3000,
                  timerProgressBar: true,
                  showCancelButton: false,
                  showConfirmButton: false,
                });
              } else if (error?.response?.data?.message === "User is duplicate in this course. Cannot enroll again") {
                Swal.fire({
                  icon: "warning",
                  title: VueI18n.t(
                    "unable to register"
                  ),
                  text: VueI18n.t(
                    "duplicate user in this course Unable to register"
                  ),
                  timer: 3000,
                  timerProgressBar: true,
                  showCancelButton: false,
                  showConfirmButton: false,
                });
              } else if (error?.response?.data?.message === "The price is not correct!!") {
                Swal.fire({
                  icon: "warning",
                  title: VueI18n.t(
                    "unable to register"
                  ),
                  text: VueI18n.t(
                    "the price is not correct payment cannot be processed"
                  ),
                  timer: 3000,
                  timerProgressBar: true,
                  showCancelButton: false,
                  showConfirmButton: false,
                });
              } else if (error?.response?.data?.message === "Cannot register , The seats are full.") {
                Swal.fire({
                  icon: "warning",
                  title: VueI18n.t(
                    "unable to register"
                  ),
                  text: VueI18n.t(
                    "cannot register , The seats are full"
                  ),
                  timer: 3000,
                  timerProgressBar: true,
                  showCancelButton: false,
                  showConfirmButton: false,
                });
              } else if (error?.response?.data?.message === "register duplicate") {
                Swal.fire({
                  icon: "warning",
                  title: VueI18n.t(
                    "unable to register"
                  ),
                  text: VueI18n.t(
                    "some students or students have already purchased the course"
                  ),
                  timer: 3000,
                  timerProgressBar: true,
                  showCancelButton: false,
                  showConfirmButton: false,
                });
              } else if (error?.response?.data?.message === "register Duplicate") {
                Swal.fire({
                  icon: "warning",
                  title: VueI18n.t(
                    "unable to register"
                  ),
                  text: VueI18n.t(
                    "some students or students have already purchased the course"
                  ),
                  timer: 3000,
                  timerProgressBar: true,
                  showCancelButton: false,
                  showConfirmButton: false,
                });
              } else if (error === "please enter your name and class") {
                Swal.fire({
                  icon: "warning",
                  title: VueI18n.t("unable to register"),
                  text: VueI18n.t(
                    "please enter your name and class"
                  ),
                  timer: 3000,
                  timerProgressBar: true,
                  showCancelButton: false,
                  showConfirmButton: false,
                });
              } else if (error?.response?.data?.message === "User not found.") {
                Swal.fire({
                  icon: "warning",
                  title: VueI18n.t("unable to register"),
                  text: VueI18n.t(
                    "this user could not be found"
                  ),
                  timer: 3000,
                  timerProgressBar: true,
                  showCancelButton: false,
                  showConfirmButton: false,
                });
              } else if (error?.response?.data?.message?.coursePackageOptionId === "Require.") {
                Swal.fire({
                  icon: "warning",
                  title: VueI18n.t(
                    "unable to register"
                  ),
                  text: "coursePackageOptionId is Require",
                  timer: 3000,
                  timerProgressBar: true,
                  showCancelButton: false,
                  showConfirmButton: false,
                });
              } else if (error?.response?.data?.message?.courseId === "Require.") {
                Swal.fire({
                  icon: "warning",
                  title: VueI18n.t(
                    "unable to register"
                  ),
                  text: "courseId is Require",
                  timer: 3000,
                  timerProgressBar: true,
                  showCancelButton: false,
                  showConfirmButton: false,
                });
              } else if (error?.response?.data?.message?.accountId === "Require.") {
                Swal.fire({
                  icon: "warning",
                  title: VueI18n.t(
                    "unable to register"
                  ),
                  text: "accountId is Require",
                  timer: 3000,
                  timerProgressBar: true,
                  showCancelButton: false,
                  showConfirmButton: false,
                });
              } else if (error?.response?.data?.message?.parentFirstnameTh === "Require.") {
                Swal.fire({
                  icon: "warning",
                  title: VueI18n.t(
                    "unable to register"
                  ),
                  text: "parentFirstnameTh is Require",
                  timer: 3000,
                  timerProgressBar: true,
                  showCancelButton: false,
                  showConfirmButton: false,
                });
              } else if (error?.response?.data?.message?.parentLastnameTh === "Require.") {
                Swal.fire({
                  icon: "warning",
                  title: VueI18n.t(
                    "unable to register"
                  ),
                  text: "parentLastnameTh is Require",
                  timer: 3000,
                  timerProgressBar: true,
                  showCancelButton: false,
                  showConfirmButton: false,
                });
              } else if (error?.response?.data?.message?.parentFirstnameEn === "Require.") {
                Swal.fire({
                  icon: "warning",
                  title: VueI18n.t(
                    "unable to register"
                  ),
                  text: "parentFirstnameEn is Require",
                  timer: 3000,
                  timerProgressBar: true,
                  showCancelButton: false,
                  showConfirmButton: false,
                });
              } else if (error?.response?.data?.message?.parentTel === "Require.") {
                Swal.fire({
                  icon: "warning",
                  title: VueI18n.t(
                    "unable to register"
                  ),
                  text: "parentTel is Require",
                  timer: 3000,
                  timerProgressBar: true,
                  showCancelButton: false,
                  showConfirmButton: false,
                });
              } else if (error?.response?.data?.message?.courseTypeId === "Require.") {
                Swal.fire({
                  icon: "warning",
                  title: VueI18n.t(
                    "unable to register"
                  ),
                  text: "courseTypeId is Require",
                  timer: 3000,
                  timerProgressBar: true,
                  showCancelButton: false,
                  showConfirmButton: false,
                });
              } else if (error?.response?.data?.message?.timeStart === "Require.") {
                Swal.fire({
                  icon: "warning",
                  title: VueI18n.t(
                    "unable to register"
                  ),
                  text: "timeStart is Require",
                  timer: 3000,
                  timerProgressBar: true,
                  showCancelButton: false,
                  showConfirmButton: false,
                });
              } else if (error?.response?.data?.message?.timeEnd === "Require.") {
                Swal.fire({
                  icon: "warning",
                  title: VueI18n.t(
                    "unable to register"
                  ),
                  text: "timeEnd is Require",
                  timer: 3000,
                  timerProgressBar: true,
                  showCancelButton: false,
                  showConfirmButton: false,
                });
              } else if (error?.response?.data?.message?.dayOfWeekId === "Require.") {
                Swal.fire({
                  icon: "warning",
                  title: VueI18n.t(
                    "unable to register"
                  ),
                  text: "dayOfWeekId is Require",
                  timer: 3000,
                  timerProgressBar: true,
                  showCancelButton: false,
                  showConfirmButton: false,
                });
              } else if (error?.response?.data?.message?.timeId === "Require.") {
                Swal.fire({
                  icon: "warning",
                  title: VueI18n.t(
                    "unable to register"
                  ),
                  text: "timeId is Require",
                  timer: 3000,
                  timerProgressBar: true,
                  showCancelButton: false,
                  showConfirmButton: false,
                });
              } else if (error?.response?.data?.message?.courseCoachId === "Require.") {
                Swal.fire({
                  icon: "warning",
                  title: VueI18n.t(
                    "unable to register"
                  ),
                  text: "courseCoachId is Require",
                  timer: 3000,
                  timerProgressBar: true,
                  showCancelButton: false,
                  showConfirmButton: false,
                });
              } else if (error?.response?.data?.message?.coachNameTh === "Require.") {
                Swal.fire({
                  icon: "warning",
                  title: VueI18n.t(
                    "unable to register"
                  ),
                  text: "coachNameTh is Require",
                  timer: 3000,
                  timerProgressBar: true,
                  showCancelButton: false,
                  showConfirmButton: false,
                });
              } else if (error?.response?.data?.message?.coachNameEn === "Require.") {
                Swal.fire({
                  icon: "warning",
                  title: VueI18n.t(
                    "unable to register"
                  ),
                  text: "coachNameEn is Require",
                  timer: 3000,
                  timerProgressBar: true,
                  showCancelButton: false,
                  showConfirmButton: false,
                });
              } else if (error?.response?.data?.message?.coachId === "Require.") {
                Swal.fire({
                  icon: "warning",
                  title: VueI18n.t(
                    "unable to register"
                  ),
                  text: "coachId is Require",
                  timer: 3000,
                  timerProgressBar: true,
                  showCancelButton: false,
                  showConfirmButton: false,
                });
              } else if (error?.response?.data?.message?.price === "Require.") {
                Swal.fire({
                  icon: "warning",
                  title: VueI18n.t(
                    "unable to register"
                  ),
                  text: "price is Require",
                  timer: 3000,
                  timerProgressBar: true,
                  showCancelButton: false,
                  showConfirmButton: false,
                });
              } else if (error?.response?.data?.message?.originalPrice === "Require.") {
                Swal.fire({
                  icon: "warning",
                  title: VueI18n.t(
                    "unable to register"
                  ),
                  text: "originalPrice is Require",
                  timer: 3000,
                  timerProgressBar: true,
                  showCancelButton: false,
                  showConfirmButton: false,
                });
              } else if (error?.response?.data?.message?.statusDiscountPrice === "Require.") {
                Swal.fire({
                  icon: "warning",
                  title: VueI18n.t(
                    "unable to register"
                  ),
                  text: "statusDiscountPrice is Require",
                  timer: 3000,
                  timerProgressBar: true,
                  showCancelButton: false,
                  showConfirmButton: false,
                });
              } else if (error?.response?.data?.message?.statusDiscountPercent === "Require.") {
                Swal.fire({
                  icon: "warning",
                  title: VueI18n.t(
                    "unable to register"
                  ),
                  text: "statusDiscountPercent is Require",
                  timer: 3000,
                  timerProgressBar: true,
                  showCancelButton: false,
                  showConfirmButton: false,
                });
              } else if (error?.response?.data?.message?.discount === "Require.") {
                Swal.fire({
                  icon: "warning",
                  title: VueI18n.t(
                    "unable to register"
                  ),
                  text: "discount is Require",
                  timer: 3000,
                  timerProgressBar: true,
                  showCancelButton: false,
                  showConfirmButton: false,
                });
              } else if (error?.response?.data?.message?.adminDiscount === "Require.") {
                Swal.fire({
                  icon: "warning",
                  title: VueI18n.t(
                    "unable to register"
                  ),
                  text: "adminDiscount is Require",
                  timer: 3000,
                  timerProgressBar: true,
                  showCancelButton: false,
                  showConfirmButton: false,
                });
              } else if (error?.response?.data?.message?.student === "Require.") {
                Swal.fire({
                  icon: "warning",
                  title: VueI18n.t(
                    "unable to register"
                  ),
                  text: "student is Require",
                  timer: 3000,
                  timerProgressBar: true,
                  showCancelButton: false,
                  showConfirmButton: false,
                });
              } else if (error?.response?.data?.message?.startDate === "Require.") {
                Swal.fire({
                  icon: "warning",
                  title: VueI18n.t(
                    "unable to register"
                  ),
                  text: "startDate is Require",
                  timer: 3000,
                  timerProgressBar: true,
                  showCancelButton: false,
                  showConfirmButton: false,
                });
              } else if (error?.response?.data?.message?.username === "Require.") {
                Swal.fire({
                  icon: "warning",
                  title: VueI18n.t(
                    "unable to register"
                  ),
                  text: "username is Require",
                  timer: 3000,
                  timerProgressBar: true,
                  showCancelButton: false,
                  showConfirmButton: false,
                });
              } else if (error?.response?.data?.message?.isOther === "Require.") {
                Swal.fire({
                  icon: "warning",
                  title: VueI18n.t(
                    "unable to register"
                  ),
                  text: "isOther is Require",
                  timer: 3000,
                  timerProgressBar: true,
                  showCancelButton: false,
                  showConfirmButton: false,
                });
              } else if (error?.response?.data?.message?.parent === "Require.") {
                Swal.fire({
                  icon: "warning",
                  title: VueI18n.t(
                    "unable to register"
                  ),
                  text: "parent is Require",
                  timer: 3000,
                  timerProgressBar: true,
                  showCancelButton: false,
                  showConfirmButton: false,
                });
              } else {
                Swal.fire({
                  icon: "error",
                  title: VueI18n.t("unable to register"),
                  text: error,
                  timer: 3000,
                  timerProgressBar: true,
                  showCancelButton: false,
                  showConfirmButton: false,
                });
              }
            }
          }
        } catch (error) {
          if (error?.response?.data?.message == "schoolTh not found.") {
            Swal.fire({
              icon: "warning",
              title: VueI18n.t("this item cannot be made"),
              text: VueI18n.t(
                "please filter yourse school"
              ),
              timer: 3000,
              timerProgressBar: true,
              showCancelButton: false,
              showConfirmButton: false,
            });
          } else if (error?.response?.data?.message == "congenitalDiseaseTh not found.") {
            Swal.fire({
              icon: "warning",
              title: VueI18n.t("this item cannot be made"),
              text: VueI18n.t(
                "please filter yourse congenitalDisease"
              ),
              timer: 3000,
              timerProgressBar: true,
              showCancelButton: false,
              showConfirmButton: false,
            });
          } else if (error?.response?.data?.message == "class not found.") {
            Swal.fire({
              icon: "warning",
              title: VueI18n.t("this item cannot be made"),
              text: VueI18n.t(
                "please filter yourse more class"
              ),
              timer: 3000,
              timerProgressBar: true,
              showCancelButton: false,
              showConfirmButton: false,
            });
          } else if (error?.response?.data?.message === "Unable to purchase the course because the course is in reserved status.") {
            Swal.fire({
              icon: "warning",
              title: VueI18n.t("unable to register"),
              text: VueI18n.t(
                "unable to purchase the course because the course is in reserved status"
              ),
              timer: 3000,
              timerProgressBar: true,
              showCancelButton: false,
              showConfirmButton: false,
            });
          } else if (error?.response?.data?.message?.coursePackageOptionId === "Require.") {
            Swal.fire({
              icon: "warning",
              title: VueI18n.t(
                "unable to register"
              ),
              text: "coursePackageOptionId is Require",
              timer: 3000,
              timerProgressBar: true,
              showCancelButton: false,
              showConfirmButton: false,
            });
          } else if (error?.response?.data?.message?.courseId === "Require.") {
            Swal.fire({
              icon: "warning",
              title: VueI18n.t(
                "unable to register"
              ),
              text: "courseId is Require",
              timer: 3000,
              timerProgressBar: true,
              showCancelButton: false,
              showConfirmButton: false,
            });
          } else if (error?.response?.data?.message?.accountId === "Require.") {
            Swal.fire({
              icon: "warning",
              title: VueI18n.t(
                "unable to register"
              ),
              text: "accountId is Require",
              timer: 3000,
              timerProgressBar: true,
              showCancelButton: false,
              showConfirmButton: false,
            });
          } else if (error?.response?.data?.message?.parentFirstnameTh === "Require.") {
            Swal.fire({
              icon: "warning",
              title: VueI18n.t(
                "unable to register"
              ),
              text: "parentFirstnameTh is Require",
              timer: 3000,
              timerProgressBar: true,
              showCancelButton: false,
              showConfirmButton: false,
            });
          } else if (error?.response?.data?.message?.parentLastnameTh === "Require.") {
            Swal.fire({
              icon: "warning",
              title: VueI18n.t(
                "unable to register"
              ),
              text: "parentLastnameTh is Require",
              timer: 3000,
              timerProgressBar: true,
              showCancelButton: false,
              showConfirmButton: false,
            });
          } else if (error?.response?.data?.message?.parentFirstnameEn === "Require.") {
            Swal.fire({
              icon: "warning",
              title: VueI18n.t(
                "unable to register"
              ),
              text: "parentFirstnameEn is Require",
              timer: 3000,
              timerProgressBar: true,
              showCancelButton: false,
              showConfirmButton: false,
            });
          } else if (error?.response?.data?.message?.parentTel === "Require.") {
            Swal.fire({
              icon: "warning",
              title: VueI18n.t(
                "unable to register"
              ),
              text: "parentTel is Require",
              timer: 3000,
              timerProgressBar: true,
              showCancelButton: false,
              showConfirmButton: false,
            });
          } else if (error?.response?.data?.message?.courseTypeId === "Require.") {
            Swal.fire({
              icon: "warning",
              title: VueI18n.t(
                "unable to register"
              ),
              text: "courseTypeId is Require",
              timer: 3000,
              timerProgressBar: true,
              showCancelButton: false,
              showConfirmButton: false,
            });
          } else if (error?.response?.data?.message?.timeStart === "Require.") {
            Swal.fire({
              icon: "warning",
              title: VueI18n.t(
                "unable to register"
              ),
              text: "timeStart is Require",
              timer: 3000,
              timerProgressBar: true,
              showCancelButton: false,
              showConfirmButton: false,
            });
          } else if (error?.response?.data?.message?.timeEnd === "Require.") {
            Swal.fire({
              icon: "warning",
              title: VueI18n.t(
                "unable to register"
              ),
              text: "timeEnd is Require",
              timer: 3000,
              timerProgressBar: true,
              showCancelButton: false,
              showConfirmButton: false,
            });
          } else if (error?.response?.data?.message?.dayOfWeekId === "Require.") {
            Swal.fire({
              icon: "warning",
              title: VueI18n.t(
                "unable to register"
              ),
              text: "dayOfWeekId is Require",
              timer: 3000,
              timerProgressBar: true,
              showCancelButton: false,
              showConfirmButton: false,
            });
          } else if (error?.response?.data?.message?.timeId === "Require.") {
            Swal.fire({
              icon: "warning",
              title: VueI18n.t(
                "unable to register"
              ),
              text: "timeId is Require",
              timer: 3000,
              timerProgressBar: true,
              showCancelButton: false,
              showConfirmButton: false,
            });
          } else if (error?.response?.data?.message?.courseCoachId === "Require.") {
            Swal.fire({
              icon: "warning",
              title: VueI18n.t(
                "unable to register"
              ),
              text: "courseCoachId is Require",
              timer: 3000,
              timerProgressBar: true,
              showCancelButton: false,
              showConfirmButton: false,
            });
          } else if (error?.response?.data?.message?.coachNameTh === "Require.") {
            Swal.fire({
              icon: "warning",
              title: VueI18n.t(
                "unable to register"
              ),
              text: "coachNameTh is Require",
              timer: 3000,
              timerProgressBar: true,
              showCancelButton: false,
              showConfirmButton: false,
            });
          } else if (error?.response?.data?.message?.coachNameEn === "Require.") {
            Swal.fire({
              icon: "warning",
              title: VueI18n.t(
                "unable to register"
              ),
              text: "coachNameEn is Require",
              timer: 3000,
              timerProgressBar: true,
              showCancelButton: false,
              showConfirmButton: false,
            });
          } else if (error?.response?.data?.message?.coachId === "Require.") {
            Swal.fire({
              icon: "warning",
              title: VueI18n.t(
                "unable to register"
              ),
              text: "coachId is Require",
              timer: 3000,
              timerProgressBar: true,
              showCancelButton: false,
              showConfirmButton: false,
            });
          } else if (error?.response?.data?.message?.price === "Require.") {
            Swal.fire({
              icon: "warning",
              title: VueI18n.t(
                "unable to register"
              ),
              text: "price is Require",
              timer: 3000,
              timerProgressBar: true,
              showCancelButton: false,
              showConfirmButton: false,
            });
          } else if (error?.response?.data?.message?.originalPrice === "Require.") {
            Swal.fire({
              icon: "warning",
              title: VueI18n.t(
                "unable to register"
              ),
              text: "originalPrice is Require",
              timer: 3000,
              timerProgressBar: true,
              showCancelButton: false,
              showConfirmButton: false,
            });
          } else if (error?.response?.data?.message?.statusDiscountPrice === "Require.") {
            Swal.fire({
              icon: "warning",
              title: VueI18n.t(
                "unable to register"
              ),
              text: "statusDiscountPrice is Require",
              timer: 3000,
              timerProgressBar: true,
              showCancelButton: false,
              showConfirmButton: false,
            });
          } else if (error?.response?.data?.message?.statusDiscountPercent === "Require.") {
            Swal.fire({
              icon: "warning",
              title: VueI18n.t(
                "unable to register"
              ),
              text: "statusDiscountPercent is Require",
              timer: 3000,
              timerProgressBar: true,
              showCancelButton: false,
              showConfirmButton: false,
            });
          } else if (error?.response?.data?.message?.discount === "Require.") {
            Swal.fire({
              icon: "warning",
              title: VueI18n.t(
                "unable to register"
              ),
              text: "discount is Require",
              timer: 3000,
              timerProgressBar: true,
              showCancelButton: false,
              showConfirmButton: false,
            });
          } else if (error?.response?.data?.message?.adminDiscount === "Require.") {
            Swal.fire({
              icon: "warning",
              title: VueI18n.t(
                "unable to register"
              ),
              text: "adminDiscount is Require",
              timer: 3000,
              timerProgressBar: true,
              showCancelButton: false,
              showConfirmButton: false,
            });
          } else if (error?.response?.data?.message?.student === "Require.") {
            Swal.fire({
              icon: "warning",
              title: VueI18n.t(
                "unable to register"
              ),
              text: "student is Require",
              timer: 3000,
              timerProgressBar: true,
              showCancelButton: false,
              showConfirmButton: false,
            });
          } else if (error?.response?.data?.message?.startDate === "Require.") {
            Swal.fire({
              icon: "warning",
              title: VueI18n.t(
                "unable to register"
              ),
              text: "startDate is Require",
              timer: 3000,
              timerProgressBar: true,
              showCancelButton: false,
              showConfirmButton: false,
            });
          } else if (error?.response?.data?.message?.username === "Require.") {
            Swal.fire({
              icon: "warning",
              title: VueI18n.t(
                "unable to register"
              ),
              text: "username is Require",
              timer: 3000,
              timerProgressBar: true,
              showCancelButton: false,
              showConfirmButton: false,
            });
          } else if (error?.response?.data?.message?.isOther === "Require.") {
            Swal.fire({
              icon: "warning",
              title: VueI18n.t(
                "unable to register"
              ),
              text: "isOther is Require",
              timer: 3000,
              timerProgressBar: true,
              showCancelButton: false,
              showConfirmButton: false,
            });
          } else if (error?.response?.data?.message?.parent === "Require.") {
            Swal.fire({
              icon: "warning",
              title: VueI18n.t(
                "unable to register"
              ),
              text: "parent is Require",
              timer: 3000,
              timerProgressBar: true,
              showCancelButton: false,
              showConfirmButton: false,
            });
          } else if (error?.response?.data?.message == " not found nickname.") {
            Swal.fire({
              icon: "warning",
              title: VueI18n.t("this item cannot be made"),
              text: VueI18n.t(
                "please filter yourse nickname"
              ),
              timer: 3000,
              timerProgressBar: true,
              showCancelButton: false,
              showConfirmButton: false,
            });
          }
          console.log('error :>> ', error);

          context.commit("SetOrderIsLoading", false);

        }
      } catch (error) {
        if (error == "please enter your name and class") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t("this item cannot be made"),
            text: VueI18n.t(
              "please filter yourse class or nickname"
            ),
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error?.response?.data?.message === "Parameter missing. Required username.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t("unable to register"),
            text: VueI18n.t(
              "please enter the student's name"
            ),
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error?.response?.data?.message?.coursePackageOptionId === "Require.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t(
              "unable to register"
            ),
            text: "coursePackageOptionId is Require",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error?.response?.data?.message?.courseId === "Require.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t(
              "unable to register"
            ),
            text: "courseId is Require",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error?.response?.data?.message?.accountId === "Require.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t(
              "unable to register"
            ),
            text: "accountId is Require",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error?.response?.data?.message?.parentFirstnameTh === "Require.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t(
              "unable to register"
            ),
            text: "parentFirstnameTh is Require",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error?.response?.data?.message?.parentLastnameTh === "Require.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t(
              "unable to register"
            ),
            text: "parentLastnameTh is Require",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error?.response?.data?.message?.parentFirstnameEn === "Require.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t(
              "unable to register"
            ),
            text: "parentFirstnameEn is Require",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error?.response?.data?.message?.parentTel === "Require.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t(
              "unable to register"
            ),
            text: "parentTel is Require",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error?.response?.data?.message?.courseTypeId === "Require.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t(
              "unable to register"
            ),
            text: "courseTypeId is Require",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error?.response?.data?.message?.timeStart === "Require.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t(
              "unable to register"
            ),
            text: "timeStart is Require",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error?.response?.data?.message?.timeEnd === "Require.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t(
              "unable to register"
            ),
            text: "timeEnd is Require",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error?.response?.data?.message?.dayOfWeekId === "Require.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t(
              "unable to register"
            ),
            text: "dayOfWeekId is Require",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error?.response?.data?.message?.timeId === "Require.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t(
              "unable to register"
            ),
            text: "timeId is Require",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error?.response?.data?.message?.courseCoachId === "Require.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t(
              "unable to register"
            ),
            text: "courseCoachId is Require",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error?.response?.data?.message?.coachNameTh === "Require.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t(
              "unable to register"
            ),
            text: "coachNameTh is Require",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error?.response?.data?.message?.coachNameEn === "Require.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t(
              "unable to register"
            ),
            text: "coachNameEn is Require",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error?.response?.data?.message?.coachId === "Require.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t(
              "unable to register"
            ),
            text: "coachId is Require",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error?.response?.data?.message?.price === "Require.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t(
              "unable to register"
            ),
            text: "price is Require",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error?.response?.data?.message?.originalPrice === "Require.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t(
              "unable to register"
            ),
            text: "originalPrice is Require",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error?.response?.data?.message?.statusDiscountPrice === "Require.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t(
              "unable to register"
            ),
            text: "statusDiscountPrice is Require",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error?.response?.data?.message?.statusDiscountPercent === "Require.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t(
              "unable to register"
            ),
            text: "statusDiscountPercent is Require",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error?.response?.data?.message?.discount === "Require.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t(
              "unable to register"
            ),
            text: "discount is Require",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error?.response?.data?.message?.adminDiscount === "Require.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t(
              "unable to register"
            ),
            text: "adminDiscount is Require",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error?.response?.data?.message?.student === "Require.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t(
              "unable to register"
            ),
            text: "student is Require",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error?.response?.data?.message?.startDate === "Require.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t(
              "unable to register"
            ),
            text: "startDate is Require",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error?.response?.data?.message?.username === "Require.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t(
              "unable to register"
            ),
            text: "username is Require",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error?.response?.data?.message?.isOther === "Require.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t(
              "unable to register"
            ),
            text: "isOther is Require",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error?.response?.data?.message?.parent === "Require.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t(
              "unable to register"
            ),
            text: "parent is Require",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else {
          Swal.fire({
            icon: "error",
            title: VueI18n.t("this item cannot be made"),
            text: error,
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        }
        context.commit("SetOrderIsLoading", false);

      }



    },
    async updateOrderStatus(context, { order_detail }) {
      try {
        let payload = {
          paymentStatus: order_detail.paymentStatus,
          paymentType: order_detail.paymentType,
        };
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            Authorization: `Bearer ${VueCookie.get("token")}`,
          },
        };

        let { data } = await axios.patch(
          // `http://localhost:3002/api/v1/order/update/${order_detail.orderNumber}`,
          `${process.env.VUE_APP_URL}/api/v1/order/update/${order_detail.orderNumber}`,
          payload,
          config
        );
        if (data.statusCode === 200) {
          await Swal.fire({
            icon: "success",
            title: VueI18n.t("succeed"),
            text: VueI18n.t("order canceled successfully"),
            showDenyButton: false,
            showCancelButton: false,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          }).finally(() => {
            context.dispatch("GetOrderDetail", {
              order_number: order_detail.orderNumber,
            });
          });
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

        });
      }
    },
    async updatePayment(context, { order_data }) {
      context.commit("SetOrdersIsLoading", true)
      try {
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            Authorization: `Bearer ${VueCookie.get("token")}`,
          },
        };
        // const localhost = 'http://localhost:3002'
        // let updateStartDate = await axios.patch(`${localhost}/api/v1/order/update-orderid/${order_data.orderId}`, {}, config)
        let updateStartDate = await axios.patch(`${process.env.VUE_APP_URL}/api/v1/order/update-orderid/${order_data.orderId}`, {}, config)
        if (updateStartDate.data.statusCode == 200) {
          let payment_payload = {
            orderId: order_data.orderNumber,
            paymentType: order_data.paymentType,
            total: order_data.diffAdminDiscountTotal,
          };
          // const localhost = 'http://localhost:3003'
          let { data } = await axios.patch(
            // `http://localhost:3003/api/v1/payment/data/${order_data.orderNumber}`,
            `${process.env.VUE_APP_URL}/api/v1/payment/data/${order_data.orderNumber}`,
            payment_payload,
            config
          );
          if (data.statusCode === 200) {
            context.commit("SetOrdersIsLoading", false)
            await Swal.fire({
              icon: "success",
              title: VueI18n.t("succeed"),
              text: VueI18n.t("confirmation of successful payment"),
              showDenyButton: false,
              showCancelButton: false,
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            }).finally(() => {
              context.dispatch("GetOrderDetail", {
                order_number: order_data.orderNumber,
              });
            });
          }
        }
      } catch (error) {
        context.commit("SetOrdersIsLoading", false)
        if (error.response.data.message == "over study end date") {
          Swal.fire({
            icon: "error",
            title: VueI18n.t("unable to register"),
            text: VueI18n.t(
              "the class period has ended"
            ),
            showDenyButton: false,
            showCancelButton: false,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
        } else if (error.response.data.message == "over register date") {
          Swal.fire({
            icon: "error",
            title: VueI18n.t("unable to register"),
            text: VueI18n.t(
              "outside the register date"
            ),
            showDenyButton: false,
            showCancelButton: false,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
        } else if (
          error.response.data.message ==
          "Cannot register , fail at course monitor , course-coach or seats are full"
        ) {
          Swal.fire({
            icon: "error",
            title: VueI18n.t("unable to register"),
            text: VueI18n.t(
              "unable to register Due to insufficient seats or the coach teaching in another package"
            ),
            showDenyButton: false,
            showCancelButton: false,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
        } else if (error.response.data.message === "Cannot register , The seats are full.") {
          Swal.fire({
            icon: "error",
            title: VueI18n.t(
              "cannot register , The seats are full"
            ),
            showDenyButton: false,
            showCancelButton: false,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
        } else {
          Swal.fire({
            icon: "error",
            title: VueI18n.t("something went wrong"),
            timer: 3000,
            timerProgressBar: true,
            showDenyButton: false,
            showCancelButton: false,
          });
        }
      }
    },
    async savePayment(context, { paymnet_data }) {
      try {
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            Authorization: `Bearer ${VueCookie.get("token")}`,
          },
        };
        // const localhost = 'http://localhost:3002'
        // let updateStartDate = await axios.patch(`${localhost}/api/v1/order/update-orderid/${paymnet_data.orderId}`, {}, config)
        let updateStartDate = await axios.patch(`${process.env.VUE_APP_URL}/api/v1/order/update-orderid/${paymnet_data.orderId}`, {}, config)
        if (updateStartDate.data.statusCode == 200) {
          let payment_payload = {
            orderId: paymnet_data.orderNumber,
            total: paymnet_data.totalPrice,
            subtotal: 0.0,
            vat: 0,
            vatRate: 0,
            orderDesc: "",
          };
          // const localhost = 'http://localhost:3003'
          // let { data } = await axios.post(
          //   `${localhost}/api/v1/payment/code`,
          //   payment_payload
          // );
          let { data } = await axios.post(
            `${process.env.VUE_APP_URL}/api/v1/payment/code`,
            payment_payload
          );
          if (data.statusCode === 201) {
            window.location.href = data.data;
          }
        }

      } catch (error) {
        if (error.response.data.message == "over study end date") {
          Swal.fire({
            icon: "error",
            title: VueI18n.t("unable to register"),
            text: VueI18n.t(
              "the class period has ended"
            ),
            showDenyButton: false,
            showCancelButton: false,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
        } else if (error.response.data.message == "over register date") {
          Swal.fire({
            icon: "error",
            title: VueI18n.t("unable to register"),
            text: VueI18n.t(
              "outside the register date"
            ),
            showDenyButton: false,
            showCancelButton: false,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
        } else if (
          error.response.data.message ==
          "Cannot register , fail at course monitor , course-coach or seats are full"
        ) {
          Swal.fire({
            icon: "error",
            title: VueI18n.t("unable to register"),
            text: VueI18n.t(
              "unable to register Due to insufficient seats or the coach teaching in another package"
            ),
            showDenyButton: false,
            showCancelButton: false,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
        } else if (error.response.data.message === "Cannot register , The seats are full.") {
          Swal.fire({
            icon: "error",
            title: VueI18n.t(
              "cannot register , The seats are full"
            ),
            showDenyButton: false,
            showCancelButton: false,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
        } else {
          Swal.fire({
            icon: "error",
            title: VueI18n.t("something went wrong"),
            text: error.message,
            showDenyButton: false,
            showCancelButton: false,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
        }
      }
    },
    async GetCartList(context, { limit, page }) {
      if (page == 1) {
        context.commit("SetCartListIsLoading", true);
      }
      try {
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            Authorization: `Bearer ${VueCookie.get("token")}`,
          },
        };
        // const localhost = 'http://localhost:3002'
        let { data } = await axios.get(
          // `${localhost}/api/v1/order/cart/limit?limit=${limit}&page=${page}`,
          `${process.env.VUE_APP_URL}/api/v1/order/cart/limit?limit=${limit}&page=${page}`,
          config
        );
        if (data.statusCode === 200) {
          for await (const item of data.data) {
            item.dayOff = dayOfWeekArray(item.day?.day)
            item.course_img = item.course_img ? `${process.env.VUE_APP_URL}/api/v1/files/${item.course_img}` : null;
            if (item.course_type_id === "CT_1") {
              let discount = item.option.discount
                ? item.option.discount_price
                : 0;
              item.option.net_price_unit = item.option.price_unit - discount;
              item.option.net_price = item.option.price_unit - discount;
              item.option.total_price = item.option.net_price * item.students.length
            } else {
              item.net_price = item.price;
              // item.total_price = item.price * item.students.length
            }

          }
          context.commit("SetCartList", data.data);
          context.commit("SetCartListOption", { limit: limit, page: page, count: data.data.length })
          setTimeout(() => {
            context.commit("SetCartListIsLoading", false);
          }, 200);
          context.commit("SetCartListIsLoading", false);

        } else {
          throw { error: data };
        }
      } catch (error) {
        context.commit("SetCartListIsLoading", false);
      }
    },
    async DeleteCart(context, { cart_id }) {
      context.commit("SetCartListIsLoading", true);
      try {
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            Authorization: `Bearer ${VueCookie.get("token")}`,
          },
        };
        cart_id = cart_id.replaceAll(" ", "");
        let { data } = await axios.delete(
          `${process.env.VUE_APP_URL}/api/v1/order/cart/${cart_id}`,
          config
        );
        if (data.statusCode === 200) {
          let config = {
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-type": "Application/json",
              Authorization: `Bearer ${VueCookie.get("token")}`,
            },
          };
          let carts = await axios.get(
            `${process.env.VUE_APP_URL}/api/v1/order/cart/limit?limit=${5}&page=${1}`,
            config
          );
          if (carts.data.statusCode === 200) {
            for (const item of carts.data.data) {
              item.course_img = `${process.env.VUE_APP_URL}/api/v1/files/${item.course_img}`;
              if (item.course_type_id === "CT_1") {
                let discount = item.option.discount
                  ? item.option.discount_price
                  : 0;
                item.option.net_price_unit =
                  item.option.price_unit / item.option.amount;
                item.option.net_price = item.option.price_unit - discount;
              } else {
                item.net_price = item.price * item.students.length;
              }
            }
            context.commit("SetCartList", carts.data.data);
            context.commit("SetCartListIsLoading", false);
          } else {
            throw { error: carts };
          }
        } else {
          throw { error: data };
        }
      } catch (error) {
        context.commit("SetCartListIsLoading", false);
      }
    },
    async userUpdateOrderCancelStatus(context, { order_number }) {
      try {
        let payload = {
          paymentStatus: "cancel",
          paymentType: "",
        };
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            Authorization: `Bearer ${VueCookie.get("token")}`,
          },
        };
        let { data } = await axios.patch(
          `${process.env.VUE_APP_URL}/api/v1/order/update/${order_number}`,
          payload,
          config
        );
        if (data.statusCode === 200) {
          await Swal.fire({
            icon: "success",
            title: VueI18n.t("succeed"),
            text: VueI18n.t("order canceled successfully"),
            showDenyButton: false,
            showCancelButton: false,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          }).finally(() => {
            context.dispatch("GetHistoryList", { limit: 6, page: 1 })
          });
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

        });
      }
    },
    async CancelOrderDeleteScheduleAndMonitor(context, { order_number }) {

      try {
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            Authorization: `Bearer ${VueCookie.get("token")}`,
          },
        };
        // let localhost = "http://localhost:3002"
        // const { data } = await axios.delete(`${localhost}/api/v1/order/cancel-order/${order_number}`, config)
        const { data } = await axios.delete(`${process.env.VUE_APP_URL}/api/v1/order/cancel-order/${order_number}`, config)
        if (data.statusCode === 200) {
          await Swal.fire({
            icon: "success",
            title: VueI18n.t("succeed"),
            text: VueI18n.t("order canceled successfully"),
            showDenyButton: false,
            showCancelButton: false,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          }).finally(() => {
            context.dispatch("GetOrderDetail", {
              order_number: order_number,
            });
          });
        }
      } catch (error) {
        context.dispatch("GetOrderDetail", {
          order_number: order_number,
        });
        if (error?.response?.data?.message == "order is not success") {
          Swal.fire({
            icon: "error",
            title: VueI18n.t("order is not success"),
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else {
          Swal.fire({
            icon: "error",
            title: VueI18n.t("something went wrong"),
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        }
      }
    },
    // RESERVE COURSE
    // async CreateReserveCourse(context, { course_data, profile_id, }) {
    async CreateReserveCourse(context, { course_data, course_detail }) {
      // console.log('profile_id :>> ', profile_id);
      // profile_data
      // console.log('profile_data :>> ', profile_data);
      // profile_data
      // let myParent = ''

      // for (const items of profile_data?.myparents) {
      //   myParent = items?.accountId
      // }

      try {
        // let order = context.state.order;

        // let count = 0;
        let CheckStudentIsWaraphat = true
        if (course_data.students.some(v => !v.IsWaraphat && v.is_other)) {
          CheckStudentIsWaraphat = false
          Swal.fire({
            icon: "question",
            text: VueI18n.t("because there are students who are not in the school system, is it allowed to save student information?"),
            showDenyButton: false,
            showCancelButton: true,
            confirmButtonText: VueI18n.t("agree"),
            cancelButtonText: VueI18n.t("no"),
          }).then(async (result) => {
            if (result.isConfirmed) {
              CheckStudentIsWaraphat = true
            } else {
              course_data.students = course_data.students.filter(v => v.IsWaraphat === true)
              CheckStudentIsWaraphat = true
            }
            if (CheckStudentIsWaraphat) {
              let payload = {
                order_id: null,
                courses: [],
                created_by: null,
                payment_status: "",
                payment_type: null,
                total_price: 0,
                regis_type: "reserve",
                pay_date: null,
                discount_price: 0,
                // total_price: 0
              };
              // for await (let course of order.courses) {
              let studentsArr = [];

              for await (const student of course_data.students) {
                // for (const items of course_data.students) {
                //   student.is_waraphat = items.IsWaraphat
                // }
                if (student.parents[0]) {
                  studentsArr.push({

                    account_id: student.account_id ? student.account_id : null,
                    username: student.username,
                    firstNameTh: student.firstname,
                    lastNameTh: student.lastname,
                    tel: student.tel,
                    is_other: student.is_other,
                    is_waraphat: student.IsWaraphat,

                    parent: {
                      accountId: student.parents[0].account_id,
                      parentFirstnameTh: student.parents[0].firstname_th
                        ? student.parents[0].firstname_th
                        : "",
                      parentLastnameTh: student.parents[0].lastname_th
                        ? student.parents[0].lastname_th
                        : "",
                      parentFirstnameEn: student.parents[0].firstname_en,
                      parentLastnameEn: student.parents[0].lastname_en,
                      parentTel: student.parents[0].tel,
                    },
                  });
                } else {
                  studentsArr.push({
                    account_id: student.account_id ? student.account_id : null,
                    username: student.username,
                    firstNameTh: student.firstname,
                    lastNameTh: student.lastname,
                    tel: student.tel,
                    is_other: student.is_other,
                    is_waraphat: student.IsWaraphat,

                    parent: {},
                  });
                }

              }
              payload.courses.push({
                course_id: course_data.course_id ? course_data.course_id : null,
                course_type_id: course_data.course_type_id ? course_data.course_type_id : null,
                course_package_option_id: course_data.course_type_id == 'CT_1' ? course_data.coach.coursePackageOptionsId ? course_data.coach.coursePackageOptionsId : null : null,
                time_start: course_data.course_type_id == 'CT_1' ? course_data.coach.start ? course_data.coach.start : null : course_data.time.start ? course_data.time.start : null,
                time_end: course_data.course_type_id == 'CT_1' ? course_data.coach.end ? course_data.coach.end : null : course_data.time.end ? course_data.time.end : null,
                maximumStudent: course_data.course_type_id == 'CT_1' ? course_data.coach.maximumStudent ? course_data.coach.maximumStudent : null : course_data.time.maximumStudent,
                day_of_week_id: course_data.course_type_id == 'CT_1' ? course_data.coach.dayOfWeekId ? course_data.coach.dayOfWeekId : null : course_data.time.dayOfWeekId,
                time_id: course_data.course_type_id == 'CT_1' ? course_data.coach.timeId ? course_data.coach.timeId : null : course_data.time.timeId,
                course_coach_id: course_data.course_type_id == 'CT_1' ? (course_data.coach.courseCoachId ? course_data.coach.courseCoachId : null) : course_detail.coachs[0]?.course_coach_id ? course_detail.coachs[0]?.course_coach_id : null,
                coach_name_th: course_data.course_type_id == 'CT_1' ? course_data.coach.fullNameTh ? course_data.coach.fullNameTh : null : course_data.coach_name ? course_data.coach_name : null,
                coach_name_en: course_data.course_type_id == 'CT_1' ? course_data.coach.fullNameEn ? course_data.coach.fullNameEn : null : null,
                coach_id: course_data.course_type_id == 'CT_1' ? course_data.coach.coachId ? course_data.coach.coachId : null : course_data.coach ? course_data.coach : null,
                start_date: moment().format("YYYY-MM-DD"),
                remark: null,
                price: course_data.course_type_id === "CT_1" ? (course_data.option.price_unit ? course_data.option.price_unit : 0) : course_data.price ? course_data.price : 0,
                original_price: 0,
                student: studentsArr,
                status_discount_price: false,
                status_discount_percent: false,
                discount: course_data.course_type_id === "CT_1" ? (course_data.option.discount_price ? course_data.option.discount_price : 0) : course_detail.discount ? course_detail.discount : 0,
                admin_discount: 0
              })
              let config = {
                headers: {
                  "Access-Control-Allow-Origin": "*",
                  "Content-type": "Application/json",
                  Authorization: `Bearer ${VueCookie.get("token")}`,
                },
              };
              let { data } = await axios.post(
                // `http://localhost:3002/api/v1/order/reserve/create`,
                `${process.env.VUE_APP_URL}/api/v1/order/reserve/create`,
                payload,
                config
              );
              if (data.statusCode === 201) {
                // count = count + 1;
                // if (studentsArr.length === course_data.students.length) {
                await Swal.fire({
                  icon: "success",
                  title: VueI18n.t("succeed"),
                  text: VueI18n.t(
                    "successfully reserved a course Staff will contact you later"
                  ),
                  showDenyButton: false,
                  showCancelButton: false,
                  showConfirmButton: false,
                  timer: 3000,
                  timerProgressBar: true,
                }).finally(() => {
                  router.replace({ name: "UserKingdom" });
                });
                // }

              } else {
                throw { error: data.data };
              }
              // }

              // if (count === course_data.students.length) {
              //   await Swal.fire({
              //     icon: "success",
              //     title: VueI18n.t("succeed"),
              //     text: VueI18n.t(
              //       "successfully reserved a course Staff will contact you later"
              //     ),
              //     showDenyButton: false,
              //     showCancelButton: false,
              //     showConfirmButton: false,
              //     timer: 3000,
              //     timerProgressBar: true,
              //   }).finally(() => {
              //     router.replace({ name: "UserKingdom" });
              //   });
              // }
            }
          })
        } else {
          if (CheckStudentIsWaraphat) {
            let payload = {
              order_id: null,
              courses: [],
              created_by: null,
              payment_status: "",
              payment_type: null,
              total_price: 0,
              regis_type: "reserve",
              pay_date: null,
              discount_price: 0,
              // totalPrice: 0

            };
            // for await (let course of course_data) {
            let studentsArr = [];

            for await (const student of course_data.students) {
              // for (const items of course_data.students) {
              //   student.is_waraphat = items.IsWaraphat
              // }


              if (student.parents[0]) {
                // let students = [];
                studentsArr.push({
                  account_id: student.account_id ? student.account_id : null,
                  username: student.username,
                  firstNameTh: student.firstname,
                  lastNameTh: student.lastname,
                  tel: student.tel,
                  is_other: student.is_other,
                  is_waraphat: student.IsWaraphat,

                  parent: {
                    account_id: student.parents[0].account_id,
                    parent_first_name_th: student.parents[0].firstname_th
                      ? student.parents[0].firstname_th
                      : "",
                    parent_last_name_th: student.parents[0].lastname_th
                      ? student.parents[0].lastname_th
                      : "",
                    parent_first_name_en: student.parents[0].firstname_en,
                    parent_last_name_eh: student.parents[0].lastname_en,
                    parent_tel: student.parents[0].tel,
                  },
                });
              } else {
                studentsArr.push({
                  account_id: student.account_id ? student.account_id : null,
                  username: student.username,
                  firstNameTh: student.firstname,
                  lastNameTh: student.lastname,
                  tel: student.tel,
                  is_other: student.is_other,
                  is_waraphat: student.IsWaraphat,

                  parent: {},
                });
              }
            }
            payload.courses.push({
              course_id: course_data.course_id ? course_data.course_id : null,
              course_type_id: course_data.course_type_id ? course_data.course_type_id : null,
              course_package_option_id: course_data.course_type_id == 'CT_1' ? course_data.coach.coursePackageOptionsId ? course_data.coach.coursePackageOptionsId : null : null,
              time_start: course_data.course_type_id == 'CT_1' ? course_data.coach.start ? course_data.coach.start : null : course_data.time.start ? course_data.time.start : null,
              time_end: course_data.course_type_id == 'CT_1' ? course_data.coach.end ? course_data.coach.end : null : course_data.time.end ? course_data.time.end : null,
              maximumStudent: course_data.course_type_id == 'CT_1' ? course_data.coach.maximumStudent ? course_data.coach.maximumStudent : null : course_data.time.maximumStudent,
              day_of_week_id: course_data.course_type_id == 'CT_1' ? course_data.coach.dayOfWeekId ? course_data.coach.dayOfWeekId : null : course_data.time.dayOfWeekId,

              time_id: course_data.course_type_id == 'CT_1' ? course_data.coach.timeId ? course_data.coach.timeId : null : course_data.time.timeId,

              course_coach_id: course_data.course_type_id == 'CT_1' ? (course_data.coach.courseCoachId ? course_data.coach.courseCoachId : null) : course_detail.coachs[0]?.course_coach_id ? course_detail.coachs[0]?.course_coach_id : null,

              coach_name_th: course_data.course_type_id == 'CT_1' ? course_data.coach.fullNameTh ? course_data.coach.fullNameTh : null : course_data.coach_name ? course_data.coach_name : null,
              coach_name_en: course_data.course_type_id == 'CT_1' ? course_data.coach.fullNameEn ? course_data.coach.fullNameEn : null : null,

              coach_id: course_data.course_type_id == 'CT_1' ? (course_data.coach.coachId ? course_data.coach.coachId : null) : course_data.coach ? course_data.coach : null,
              start_date: moment().format("YYYY-MM-DD"),
              remark: null,
              price: course_data.course_type_id === "CT_1" ? (course_data.option.price_unit ? course_data.option.price_unit : 0) : course_data.price ? course_data.price : 0,
              original_price: 0,
              student: studentsArr,
              status_discount_price: false,
              status_discount_percent: false,
              discount: course_data.course_type_id === "CT_1" ? (course_data.option.discount_price ? course_data.option.discount_price : 0) : course_detail.discount ? course_detail.discount : 0,
              admin_discount: 0
            })

            let config = {
              headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-type": "Application/json",
                Authorization: `Bearer ${VueCookie.get("token")}`,
              },
            };
            let { data } = await axios.post(
              // `http://localhost:3002/api/v1/order/reserve/create`,
              `${process.env.VUE_APP_URL}/api/v1/order/reserve/create`,
              payload,
              config
            );
            if (data.statusCode === 201) {
              // count = count + 1;
              // if (studentsArr.length === course_data.students.length) {

              await Swal.fire({
                icon: "success",
                title: VueI18n.t("succeed"),
                text: VueI18n.t(
                  "successfully reserved a course Staff will contact you later"
                ),
                showDenyButton: false,
                showCancelButton: false,
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
              }).finally(() => {
                router.replace({ name: "UserKingdom" })


              });
              // }

            } else {
              throw { error: data.data };
            }
            // }
          }
        }

        // if (count === course_data.students.length) {
        //   await Swal.fire({
        //     icon: "success",
        //     title: VueI18n.t("succeed"),
        //     text: VueI18n.t(
        //       "successfully reserved a course Staff will contact you later"
        //     ),
        //     showDenyButton: false,
        //     showCancelButton: false,
        //     showConfirmButton: false,
        //     timer: 3000,
        //     timerProgressBar: true,
        //   }).finally(() => {
        //     router.replace({ name: "UserKingdom" });
        //   });
        // }
      } catch (error) {
        if (error.response?.data?.message === 'Parents cannot resave the course to their parents.') {
          Swal.fire({
            icon: "error",
            title: VueI18n.t("something went wrong"),
            text: VueI18n.t("parents cannot resave the course to their parents"),
            showDenyButton: false,
            showCancelButton: false,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
        } else if (error.response?.data?.message === 'Cannot resave the course to their parents.') {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t("warning"),
            text: VueI18n.t("cannot resave the course to their parents"),
            showDenyButton: false,
            showCancelButton: false,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
        } else if (error.response?.data?.message === 'You have already reserved this course.') {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t("warning"),
            text: VueI18n.t("duplicate user in this course Unable to register"),
            showDenyButton: false,
            showCancelButton: false,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
        } else if (error?.response?.data?.message?.coursePackageOptionId === "Require.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t(
              "unable to register"
            ),
            text: "coursePackageOptionId is Require",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error?.response?.data?.message?.courseId === "Require.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t(
              "unable to register"
            ),
            text: "courseId is Require",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error?.response?.data?.message?.accountId === "Require.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t(
              "unable to register"
            ),
            text: "accountId is Require",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error?.response?.data?.message?.parentFirstnameTh === "Require.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t(
              "unable to register"
            ),
            text: "parentFirstnameTh is Require",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error?.response?.data?.message?.parentLastnameTh === "Require.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t(
              "unable to register"
            ),
            text: "parentLastnameTh is Require",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error?.response?.data?.message?.parentFirstnameEn === "Require.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t(
              "unable to register"
            ),
            text: "parentFirstnameEn is Require",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error?.response?.data?.message?.parentTel === "Require.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t(
              "unable to register"
            ),
            text: "parentTel is Require",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error?.response?.data?.message?.courseTypeId === "Require.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t(
              "unable to register"
            ),
            text: "courseTypeId is Require",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error?.response?.data?.message?.timeStart === "Require.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t(
              "unable to register"
            ),
            text: "timeStart is Require",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error?.response?.data?.message?.timeEnd === "Require.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t(
              "unable to register"
            ),
            text: "timeEnd is Require",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error?.response?.data?.message?.dayOfWeekId === "Require.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t(
              "unable to register"
            ),
            text: "dayOfWeekId is Require",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error?.response?.data?.message?.timeId === "Require.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t(
              "unable to register"
            ),
            text: "timeId is Require",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error?.response?.data?.message?.courseCoachId === "Require.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t(
              "unable to register"
            ),
            text: "courseCoachId is Require",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error?.response?.data?.message?.coachNameTh === "Require.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t(
              "unable to register"
            ),
            text: "coachNameTh is Require",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error?.response?.data?.message?.coachNameEn === "Require.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t(
              "unable to register"
            ),
            text: "coachNameEn is Require",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error?.response?.data?.message?.coachId === "Require.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t(
              "unable to register"
            ),
            text: "coachId is Require",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error?.response?.data?.message?.price === "Require.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t(
              "unable to register"
            ),
            text: "price is Require",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error?.response?.data?.message?.originalPrice === "Require.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t(
              "unable to register"
            ),
            text: "originalPrice is Require",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error?.response?.data?.message?.statusDiscountPrice === "Require.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t(
              "unable to register"
            ),
            text: "statusDiscountPrice is Require",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error?.response?.data?.message?.statusDiscountPercent === "Require.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t(
              "unable to register"
            ),
            text: "statusDiscountPercent is Require",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error?.response?.data?.message?.discount === "Require.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t(
              "unable to register"
            ),
            text: "discount is Require",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error?.response?.data?.message?.adminDiscount === "Require.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t(
              "unable to register"
            ),
            text: "adminDiscount is Require",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error?.response?.data?.message?.student === "Require.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t(
              "unable to register"
            ),
            text: "student is Require",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error?.response?.data?.message?.startDate === "Require.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t(
              "unable to register"
            ),
            text: "startDate is Require",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error?.response?.data?.message?.username === "Require.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t(
              "unable to register"
            ),
            text: "username is Require",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error?.response?.data?.message?.isOther === "Require.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t(
              "unable to register"
            ),
            text: "isOther is Require",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error?.response?.data?.message?.parent === "Require.") {
          Swal.fire({
            icon: "warning",
            title: VueI18n.t(
              "unable to register"
            ),
            text: "parent is Require",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else {
          Swal.fire({
            icon: "error",
            title: VueI18n.t("something went wrong"),
            showDenyButton: false,
            showCancelButton: false,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
        }

      }
    },
    async GetReserceCourse(context, { course_id }) {
      try {
        let { data } = await axios.get(
          `${process.env.VUE_APP_URL}/api/v1/order/reserve/byCourse/${course_id}`
        );
        if (data.statusCode === 200) {
          context.commit("SetReserveList", data.data);
        }
      } catch (error) {
        await Swal.fire({
          icon: "error",
          title: VueI18n.t("something went wrong"),
          text: VueI18n.t(error.message),
          timer: 3000,
          showDenyButton: false,
          showCancelButton: false,
          showConfirmButton: false,
          timerProgressBar: true,
        });
      }
    },
    async GetReserceByCreatedBy(context, { account_id }) {
      try {
        let { data } = await axios.get(
          `${process.env.VUE_APP_URL}/api/v1/order/reserve/byCreatedBy/${account_id}`
        );
        if (data.statusCode === 200) {
          context.commit("SetReserveList", data.data);
        }
      } catch (error) {
        await Swal.fire({
          icon: "error",
          title: VueI18n.t("something went wrong"),
          text: VueI18n.t(error.message),
          timer: 3000,
          showDenyButton: false,
          showCancelButton: false,
          showConfirmButton: false,
          timerProgressBar: true,
        });
      }
    },
    async GetAmountCartList(context) {
      try {
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            Authorization: `Bearer ${VueCookie.get("token")}`,
          },
        };
        let { data } = await axios.get(
          `${process.env.VUE_APP_URL}/api/v1/order/cart/badge`,
          config
        );
        if (data.statusCode === 200) {
          context.commit("SetAmountCartList", data.data);
        } else {
          throw { error: data };
        }
      } catch (error) {
        console.log(error);
      }
    },
    async GetHistoryList(context, { limit, page }) {

      if (page == 1) {
        context.commit("SetOrderHistoryIsLoading", true);
      }
      try {
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            Authorization: `Bearer ${VueCookie.get("token")}`,
          },
        };
        // const localhost = 'http://localhost:3002'
        // let { data } = await axios.get(
        //   `${localhost}/api/v1/order/history/limit?limit=${limit}&page=${page}`,
        //   config
        // )
        let { data } = await axios.get(
          `${process.env.VUE_APP_URL}/api/v1/order/history/limit?limit=${limit}&page=${page}`,
          config
        )
        // let { data } = await axios.get(
        //   `${process.env.VUE_APP_URL}/api/v1/order/history/limit?limit=${limit}&page=${page}`,
        //   config
        // )
        // let mapHistory = [];
        if (data.statusCode === 200) {
          data.data.map((items) => {
            const options = { year: "numeric", month: "long", day: "numeric" };
            const thaiLocale = "th-TH";
            items.thaiDate = new Date(items.createdDate).toLocaleString(
              thaiLocale,
              options
            );
            if (items.courseImg && items.courseImg !== "") {
              items.courseImg = process.env.VUE_APP_URL.concat(
                `/api/v1/files/${items.courseImg}`
              );
            }
            items.show_student = false;
            return items
          });
          const history = []
          for (const item of data.data) {
            if (!history.some(v => v.orderNumber === item.orderNumber)) {
              history.push({
                orderId: item.orderId,
                orderNumber: item.orderNumber,
                createdDate: item.createdDate,
                createdByData: item.createdByData,
                totalPrice: item.totalPrice,
                paymentStatus: item.paymentStatus,
                courses: data.data.filter(v => v.orderNumber === item.orderNumber)
              })
            }
          }
          context.commit("SetHistoryList", history);
          context.commit("SetHistoryListOption", { limit: limit, page: page, count: data.data.length })
          setTimeout(() => {
            context.commit("SetOrderHistoryIsLoading", false);
          }, 200);
        } else {
          throw { error: data };
        }
      } catch (error) {
        context.commit("SetOrderHistoryIsLoading", false);
      }
    },
    async GetOrderDetailByOrderNumber(context, { orderNumber }) {
      try {
        // const { data } = await axios.get(`http://localhost:3000/api/v1/schedule/order?orderNumber=${orderNumber}`)
        const { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/schedule/order?orderNumber=${orderNumber}`)
        if (data.statusCode === 200) {
          context.commit("SetOrderNumberDetail", data.data)
        }
      } catch (error) {
        await Swal.fire({
          icon: "error",
          title: VueI18n.t("something went wrong"),
          text: VueI18n.t(error.response.data.message),
          timer: 3000,
          showDenyButton: false,
          showCancelButton: false,
          showConfirmButton: false,
          timerProgressBar: true,
        });
      }
    },
    async UpdateScheduleAndCheckIn(context, { orderNumber, orderItemId, lastTime, type, endDate }) {
      try {
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            Authorization: `Bearer ${VueCookie.get("token")}`,
          },
        };
        // let localhost = "http://localhost:3000"
        // const { data } = await axios.post(`${localhost}/api/v1/schedule/AutoResetScheldule`, {
        const { data } = await axios.post(`${process.env.VUE_APP_URL}/api/v1/schedule/AutoResetScheldule`, {
          orderNumber,
          orderItemId,
          lastCount: lastTime,
          type,
          endDate,
        }, config)
        if (data.statusCode === 201) {
          await Swal.fire({
            icon: "success",
            title: VueI18n.t("succeed"),
            text: VueI18n.t("saved successfully"),
            timer: 3000,
            showDenyButton: false,
            showCancelButton: false,
            showConfirmButton: false,
            timerProgressBar: true,
          });
        }
      } catch (error) {
        await Swal.fire({
          icon: "error",
          title: VueI18n.t("something went wrong"),
          text: VueI18n.t(error.response.data.message),
          timer: 3000,
          showDenyButton: false,
          showCancelButton: false,
          showConfirmButton: false,
          timerProgressBar: true,
        });
      }
    },
    async GetCoursesFilter(context, { category_id, status, course_type_id, index }) {

      try {
        if (!status) {
          status = ["Active", "Reserve"]
        }
        if (!course_type_id) {
          course_type_id = 'CT_1'
        }


        // let localhost = "http://localhost:3000"
        // let { data } = await axios.get(`${localhost}/api/v1/course/limit?category_id=${category_id}&status=${status}&course_type_id=${course_type_id}&limit=${limit}&page=${page}${query}`)
        let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/course/limit?category_id=${category_id}&status=${status}&course_type_id=${course_type_id}&limit=${null}&page=${null}`)
        if (data.statusCode === 200) {
          // for (const course of data.data) {
          //   // let course_studant_amount = 0
          //   course.student_course_data = []
          //   course.show = false
          //   course.course_url = course.course_img ? `${process.env.VUE_APP_URL}/api/v1/files/${course.course_img}` : ""
          // }
          data.data.map((course) => {
            course.student_course_data = []
            course.show = false
            course.course_url = course.course_img ? `${process.env.VUE_APP_URL}/api/v1/files/${course.course_img}` : null
          })
          context.commit("SetAdminCourseDetail", { payload: data.data, index: index })
          // context.commit("SetCourses", data.data)
        } else {
          context.commit("SetCoursesIsLoading", false)
          throw { message: data.message }
        }
      } catch (error) {
        context.commit("SetCoursesIsLoading", false)
        console.log(error)
      }

    },
    async GetPackagesAddStudent(context, { course_id, index }) {
      try {
        // let localhost = "http://localhost:3000"
        // let { data } = await axios.get(`${localhost}/api/v1/course/detail/addstudent/status-course/${course_id}`)
        let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/course/detail/addstudent/status-course/${course_id}`)
        if (data.statusCode === 200) {

          context.commit("SetAdminPackageDetail", { payload: data.data, index: index })

        } else {
          throw { error: data }
        }
      } catch (error) {
        console.log(error)
      }
    },
    async GetOptionAddStudent(context, { course_id, package_id, index }) {
      try {
        // let localhost = "http://localhost:3000"
        // let { data } = await axios.get(`${localhost}/api/v1/course/detail/addstudent/status-package/${course_id}/${package_id}`)
        let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/course/detail/addstudent/status-package/${course_id}/${package_id}`)
        if (data.statusCode === 200) {
          context.commit("SetAdminOptionDetail", { payload: data.data, index: index })
        } else {
          throw { error: data }
        }
      } catch (error) {
        console.log(error)
      }
    },
    async GetDayAddStudent(context, { course_id, package_id, option_id, index }) {
      let getDayDuplicate = []
      try {
        // let localhost = "http://localhost:3000"
        // let { data } = await axios.get(`${localhost}/api/v1/course/detail/addstudent/status-day/${course_id}/${package_id}/${option_id}`)
        let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/course/detail/addstudent/status-day/${course_id}/${package_id}/${option_id}`)
        if (data.statusCode === 200) {
          let dayOpen = data?.data?.filter((item) => item?.status === "Open");
          for (const itemsDays of dayOpen) {
            if (getDayDuplicate?.length === 0) {
              getDayDuplicate.push(itemsDays)
            } else if (!getDayDuplicate.some((items) => itemsDays.dayOfWeekName === items.dayOfWeekName)) {
              getDayDuplicate.push(itemsDays)
            }
          }
          for (const items of data.data) {
            let dayArray = items.dayOfWeekName.split(',')
            let dayString = dayOfWeekArray(dayArray)
            items.dayName = dayString

          }
          context.commit("SetAdminDayDetail", { payload: getDayDuplicate, index: index })
          context.commit("SetDayAddStudent", { payload: dayOpen, index: index })

        } else {
          throw { error: data }
        }
      } catch (error) {
        console.log(error)
      }
    },
    async GetTimeAddStudent(context, { course_id, package_id, option_id, day_ofweek_id, index }) {
      let getTimeDuplicate = []
      try {
        let payloads = {}
        payloads.courseId = course_id
        payloads.packageId = package_id
        payloads.optionId = option_id
        payloads.dayOfWeekIds = day_ofweek_id

        // let localhost = "http://localhost:3000"
        // let { data } = await axios.post(`${localhost}/api/v1/course/detail/addstudent/status-time`, payloads)
        let { data } = await axios.post(`${process.env.VUE_APP_URL}/api/v1/course/detail/addstudent/status-time`, payloads)
        if (data.statusCode === 201) {

          let timeOpen = data?.data?.filter((item) => item?.status === "Open");

          for (const itemsTime of timeOpen) {
            if (getTimeDuplicate?.length === 0) {
              getTimeDuplicate.push(itemsTime)
            } else if (!getTimeDuplicate.some((items) => itemsTime.start === items.start && itemsTime.end === items.end)) {
              getTimeDuplicate.push(itemsTime)

            }
          }



          context.commit("SetAdminTimeDetail", { payload: getTimeDuplicate, index: index })
          context.commit("SetTimeAddStudent", { payload: timeOpen, index: index })
        } else {
          throw { error: data }
        }
      } catch (error) {
        console.log(error)
      }
    },
    async GetCoachAddStudent(context, { course_id, package_id, option_id, day_ofweek_id, time_id, index }) {
      try {

        let payloads = {}
        payloads.courseId = course_id
        payloads.packageId = package_id
        payloads.optionId = option_id
        payloads.dayOfWeekIds = day_ofweek_id
        payloads.timeIds = time_id

        // let localhost = "http://localhost:3000"
        // let { data } = await axios.post(`${localhost}/api/v1/course/detail/addstudent/status-coach`, payloads)
        let { data } = await axios.post(`${process.env.VUE_APP_URL}/api/v1/course/detail/addstudent/status-coach`, payloads)
        if (data.statusCode === 201) {

          for (const items of data.data) {
            items.fullNameTh = `${items.firstNameTh} ${items.lastNameTh}`
            items.fullNameEn = `${items.firstNameEn} ${items.lastNameEn}`
          }
          context.commit("SetAdminCoachDetail", { payload: data.data, index: index })
        } else {
          throw { error: data }
        }
      } catch (error) {
        console.log(error)
      }
    },
    // ChangeCourseType(context, { course, index }) {
    //   // context.commit("SetOrder", orderData);
    //   context.commit("SetAdminCoachDetail", { payload: course, index: index })

    // },
  },
  getters: {
    orderHistory(state) {
      return state.order_history;
    },
    orderHistoryIsLoading(state) {
      return state.order_history_is_loading;
    },

    getReserveList(state) {
      return state.reserve_list;
    },
    getOrder(state) {
      return state.order;
    },
    getCourseOrder(state) {
      return state.course_order;
    },
    getOrders(state) {
      return state.orders;
    },
    getOrderDetail(state) {
      return state.order_detail;
    },
    getStudents(state) {
      return state.students;
    },
    getOrderIsLoading(state) {
      return state.order_is_loading;
    },
    getOrdersIsLoading(state) {
      return state.orders_is_loading;
    },
    getRelations(state) {
      return state.relations;
    },
    getStudentList(state) {
      return state.student_list;
    },
    getCartList(state) {
      return state.cart_list;
    },
    getCartListOption(state) {
      return state.cart_list_option
    },
    getCartListIsLoading(state) {
      return state.cart_list_is_loading;
    },
    getOrderIsStatus(state) {
      return state.order_is_status;
    },
    getAmountCartList(state) {
      return state.amount_cart_list;
    },
    getHistoryList(state) {
      return state.history_list;
    },
    getHistoryListOption(state) {
      return state.history_list_option
    },
    getHistoryListIsLoading(state) {
      return state.history_list_is_loading;
    },
    getFilterFinanceData(state) {
      return state.filter_finance_data
    },
    getOrderNumberDetail(state) {
      return state.order_number_detail
    },
    getCourses(state) {
      return state.courses
    },
    getPackagesAddStudent(state) {
      return state.package_add_student
    },
    getRegisStatus(state) {
      return state.regis_status
    },
  },
};

export default orderModules;

// orderModule

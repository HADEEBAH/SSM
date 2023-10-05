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
      type: "",
      order_step: 0,
      order_number: "",
      courses: [],
      created_by: "",
      payment_status: "",
      payment_type: "",
      total_price: 0,
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
  },
  mutations: {
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
    async GetOrders(context) {
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
        let { data } = await axios.get(
          `${process.env.VUE_APP_URL}/api/v1/adminpayment/`,
          config
        );
        if (data.statusCode === 200) {
          if (data.data.length > 0) {
            for await (let order of data.data) {
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
              order.course_name = `${order.course?.courseNameTh}(${order.course?.courseNameEn})`;
              order.student_name = `${order.user?.firstNameTh} ${order.user?.lastNameTh}`;
              order.student_name_en = `${order.user?.firstNameEng} ${order.user?.lastNameEng}`;
            }
          }
          context.commit("SetOrders", data.data);
          context.commit("SetStudents", students);
          context.commit("SetOrdersIsLoading", false);
        } else {
          context.commit("SetOrdersIsLoading", true);
          throw { error: data };
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
        let { data } = await axios.get(
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
                // console.log(student)
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
    async saveCart(context, { cart_data }) {
      try {
        let order = cart_data;
        let payload = {
          order_id: "",
          courses: {},
          created_by: "",
          paymentStatus: "pending",
          paymentType: "",
          totalPrice: 0,
        };
        let total_price = 0;
        await order.courses.forEach((course) => {
          let students = [];
          course.students.forEach((student) => {
            if (student.parents[0]) {
              students.push({
                accountId: student.account_id ? student.account_id : "",
                userName: student.username,
                firstNameTh: student.firstname,
                lastNameTh: student.lastname,
                tel: student.tel,
                isOther: student.is_other,
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
              students.push({
                accountId: student.account_id ? student.account_id : "",
                userName: student.username,
                firstNameTh: student.firstname,
                lastNameTh: student.lastname,
                tel: student.tel,
                isOther: student.is_other,
                parent: {},
              });
            }
          });
          payload.courses = {
            courseId: course.course_id,
            courseName: course.course_name,
            coursePackageOptionId: course.option.course_package_option_id
              ? course.option.course_package_option_id
              : "",
            dayOfWeekId: course?.time?.timeData
              ? course.time.timeData.filter(
                (v) => v.coach_id === course.coach_id
              )[0].dayOfWeekId
              : course.time.dayOfWeekId,
            timeId: course?.time?.timeData
              ? course.time.timeData.filter(
                (v) => v.coach_id === course.coach_id
              )[0].timeId
              : course.time.timeId,
            time: course.time ? course.time : "",
            startDate: "",
            remark: "",
            price: course.option.net_price
              ? course.option.net_price
              : course.price,
            coach: {
              accountId: course.coach_id,
              fullName: course.coach_name,
            },
            student: students,
          };
          let price = course.option?.net_price
            ? course.option.net_price
            : course.price;
          total_price = total_price + price * course.students.length;
        });
        payload.totalPrice = total_price;
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            Authorization: `Bearer ${VueCookie.get("token")}`,
          },
        };
        let { data } = await axios.post(
          `${process.env.VUE_APP_URL}/api/v1/order/cart`,
          payload,
          config
        );
        if (data.statusCode === 201) {
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
        console.log(error);
      }
    },
    async saveOrder(context, { regis_type }) {
      // console.log(regis_type)
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
          order_id: "",
          courses: [],
          created_by: order.created_by,
          paymentStatus: "pending",
          paymentType: order.payment_type,
          totalPrice: 0,
          regisType: regis_type,
        };
        let total_price = 0;
        await order.courses.forEach((course) => {
          let students = [];
          course.students.forEach((student) => {
            if (student.parents[0]) {
              students.push({
                accountId: student.account_id ? student.account_id : "",
                userName: student.username,
                firstNameTh: student.firstname,
                lastNameTh: student.lastname,
                tel: student.tel,
                isOther: student.is_other,
                parent: {
                  accountId: student.parents[0].account_id,
                  parentFirstnameTh: student.parents[0].firstname_th
                    ? student.parents[0].firstname_th
                    : "",
                  parentLastnameTh: student.parents[0].lastname_en
                    ? student.parents[0].lastname_en
                    : "",
                  parentFirstnameEn: student.parents[0].firstname_en,
                  parentLastnameEn: student.parents[0].lastname_en,
                  parentTel: student.parents[0].tel,
                },
              });
            } else {
              students.push({
                accountId: student.account_id ? student.account_id : "",
                userName: student.username,
                firstNameTh: student.firstname,
                lastNameTh: student.lastname,
                tel: student.tel,
                isOther: student.is_other,
                parent: {},
              });
            }
          });
          payload.courses.push({
            courseId: course.course_id,
            coursePackageOptionId: course.option.course_package_option_id ? course.option.course_package_option_id : null,
            dayName: course.day?.dayName
              ? course.day.dayName
              : course.day.day
                ? dayOfWeekArray(course.day.day)
                : "",
            dayOfWeekId: course?.time?.timeData
              ? course.time.timeData.filter(
                (v) => v.coach_id === course.coach_id
              )[0].dayOfWeekId
              : course.time.dayOfWeekId,
            timeId: course?.time?.timeData
              ? course.time.timeData.filter(
                (v) => v.coach_id === course.coach_id
              )[0].timeId
              : course.time.timeId,
            time: course.time,
            startDate: course.start_date ? course.start_date : moment(new Date()).format("YYYY-MM-DD"),
            remark: course.remark ? course.remark : "",
            price: course.option?.net_price
              ? course.option.net_price
              : course.price,
            coach: {
              accountId: course.coach_id ? course.coach_id : course.coach,
              fullName: course.coach_name,
            },
            student: students,
          });
          let price = course.option?.net_price
            ? course.option.net_price
            : course.price;
          if (course.price * course.students.length !== price) {
            total_price = total_price + price * course.students.length;
          } else {
            total_price = total_price + price;
          }
        });
        payload.totalPrice = total_price;
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            Authorization: `Bearer ${VueCookie.get("token")}`,
          },
        };
        // console.log(payload)
        // let localhost = `http://localhost:3002`
        let { data } = await axios.post(
          `${process.env.VUE_APP_URL}/api/v1/order/regis/course`,
          payload,
          config
        );
        if (data.statusCode === 201) {
          let payment_payload = {
            orderId: data.data.orderNumber,
            total: data.data.totalPrice,
            subtotal: 0.0,
            vat: 0,
            vatRate: 0,
            orderDesc: "",
          };

          let user_data = JSON.parse(localStorage.getItem("userDetail"));
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
              };
              // let endpoint = "http://localhost:3003"
              // let endpoint = process.env.VUE_APP_URL;
              let payment = await axios.patch(
                `${process.env.VUE_APP_URL}/api/v1/payment/data/${data.data.orderNumber}`,
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
              const order_enpoint = `${process.env.VUE_APP_URL}/api/v1/order/update/${data.data.orderNumber}`
              const payment_payload = {
                paymentType: "",
                paymentStatus: "pending",
              };
              await axios.patch(order_enpoint, payment_payload)
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
        context.commit("SetOrderIsLoading", false);
        context.commit("SetOrderIsStatus", false);
        if (error.response.data.message == "over study end date") {
          Swal.fire({
            icon: "error",
            title: VueI18n.t("unable to register"),
            text: VueI18n.t(
              "the class period has ended"
            ),
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error.response.data.message == "over register date") {
          Swal.fire({
            icon: "error",
            title: VueI18n.t("unable to register"),
            text: VueI18n.t(
              "outside the register date"
            ),
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
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
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error.response.data.message === "duplicate pending order") {
          Swal.fire({
            icon: "error",
            title: VueI18n.t("unable to register"),
            text: VueI18n.t(
              "unable to register Because the course is already in your registration history"
            ),
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (
          error.response.data.message ===
          "User is duplicate in this course. Cannot enroll again"
        ) {
          Swal.fire({
            icon: "error",
            title: VueI18n.t(
              "something went wrong"
            ),
            text: VueI18n.t(
              "duplicate user in this course Unable to register"
            ),
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (
          error.response.data.message === "The price is not correct!!"
        ) {
          Swal.fire({
            icon: "error",
            title: VueI18n.t(
              "something went wrong"
            ),
            text: VueI18n.t(
              "the price is not correct payment cannot be processed"
            ),
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else if (error.response.data.message === "Cannot register , The seats are full.") {
          Swal.fire({
            icon: "error",
            title: VueI18n.t(
              "something went wrong"
            ),
            text: VueI18n.t(
              "cannot register , The seats are full"
            ),
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
    async updateOrderStatus(context, { order_detail }) {
      try{
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
      }catch(error){
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
        // let localhost = "http://localhost:3002"
        let updateStartDate = await axios.patch(`${process.env.VUE_APP_URL}/api/v1/order/update-orderid/${order_data.orderId}`, {}, config)
        if (updateStartDate.data.statusCode == 200) {
          // console.log(updateStartDate)
          let payment_payload = {
            orderId: order_data.orderNumber,
            paymentType: order_data.paymentType,
            total: order_data.totalPrice,
          };
          let { data } = await axios.patch(
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
        // console.log(paymnet_data)
        // let localhost = "http://localhost:3002"
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            Authorization: `Bearer ${VueCookie.get("token")}`,
          },
        };
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
    async GetCartList(context, account_id) {
      context.commit("SetCartListIsLoading", true);
      try {
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            Authorization: `Bearer ${VueCookie.get("token")}`,
          },
        };
        let { data } = await axios.get(
          `${process.env.VUE_APP_URL}/api/v1/order/cart/${account_id}`,
          config
        );
        if (data.statusCode === 200) {
          for await (const item of data.data) {
            item.course_img = `${process.env.VUE_APP_URL}/api/v1/files/${item.course_img}`;

            if (item.course_type_id === "CT_1") {
              let discount = item.option.discount
                ? item.option.discount_price
                : 0;
              item.option.net_price_unit =
                item.option.price_unit / item.option.amount;
              item.option.net_price =
                (item.option.price_unit - discount) * item.students.length;
            } else {
              item.net_price = item.price * item.students.length;
            }

          }
          context.commit("SetCartList", data.data);
          setTimeout(() => {
            context.commit("SetCartListIsLoading", false);
          }, 200);
        } else {
          throw { error: data };
        }
      } catch (error) {
        context.commit("SetCartListIsLoading", false);
      }
    },
    async DeleteCart(context, { cart_id, account_id }) {
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
            `${process.env.VUE_APP_URL}/api/v1/order/cart/${account_id}`,
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
      try{
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
            context.dispatch("getHistory")
          });
        }
      }catch(error){
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
    // RESERVE COURSE
    async CreateReserveCourse(context, { course_data }) {
      try {
        let count = 0;
        for await (let student of course_data.students) {
          let payload = {
            studentId: student.account_id,
            coursePackageOptionId: null,
            dayOfWeekId: null,
            timeId: null,
            courseId: course_data.course_id,
            parentId: null,
            coachId: course_data.coach_id ? course_data.coach_id : null,
            orderTmpId: null,
          };
          if (course_data.course_type_id === "CT_1") {
            payload.dayOfWeekId = course_data?.time?.timeData
              ? course_data.time.timeData.filter(
                (v) => v.coach_id === course_data.coach_id
              )[0].dayOfWeekId
              : course_data.time.dayOfWeekId;
            payload.coursePackageOptionId =
              course_data.option.course_package_option_id;
            payload.timeId = course_data?.time?.timeData
              ? course_data.time.timeData.filter(
                (v) => v.coach_id === course_data.coach_id
              )[0].timeId
              : course_data.time.timeId;
          }
          let config = {
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-type": "Application/json",
              Authorization: `Bearer ${VueCookie.get("token")}`,
            },
          };
          let { data } = await axios.post(
            `${process.env.VUE_APP_URL}/api/v1/order/reserve/create`,
            payload,
            config
          );
          if (data.statusCode === 201) {
            count = count + 1;
          } else {
            throw { error: data.data };
          }
        }
        if (count === course_data.students.length) {
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
        }
      } catch (error) {
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
    },
    async GetReserceCourse(context, {course_id}){
      try{
        let { data } = await axios.get(
          `${process.env.VUE_APP_URL}/api/v1/order/reserve/byCourse/${course_id}`
        );
        if (data.statusCode === 200) {
          context.commit("SetReserveList", data.data);
        }
      }catch(error){
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
    getCartList(state) {
      return state.cart_list;
    },
    getStudentList(state) {
      return state.student_list;
    },
    getCartListIsLoading(state) {
      return state.cart_list_is_loading;
    },
    getOrderIsStatus(state) {
      return state.order_is_status;
    },
  },
};

export default orderModules;

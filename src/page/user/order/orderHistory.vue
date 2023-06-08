<template>
  <v-app>
    <v-container>
      {{ setFunction }}
      <div v-if="!history || history.length == 0">
        <v-card class="my-3" flat>
          <v-card-text
            class="rounded-lg border-2 border-[#ff6b81] text-lg font-bold"
            align="center"
          >
            ไม่พบข้อมูล
          </v-card-text>
        </v-card>
      </div>
      <div v-for="(order, index) in history" :key="`${index}-order`">
        <v-card class="mb-3"> 
          <v-card-text>
            <v-row  dense class="mb-3">
              <v-col>
                <label class="text-caption">หมายเลขคำสั่งซื้อ:</label>
                <v-row dense>
                  <v-col class="font-bold">
                    {{ order.orderNumber }}
                  </v-col>
                </v-row>
              </v-col>
              <v-col
                  cols="12"
                  sm="6"
                  class="align-self-center"
                  align="right"
                  @click="nextStep(order)"
                >
                  <v-chip
                    v-if="order.paymentStatus === 'success'"
                    color="#F0F9EE"
                    text-color="#58A144"
                  >
                    ชำระเงินแล้ว
                  </v-chip>

                  <v-chip
                    v-else-if="order.paymentStatus === 'pending'"
                    color="#FFF9E8"
                    text-color="#FCC419"
                  >
                    รอชำระเงิน
                  </v-chip>

                  <v-chip
                    v-else-if="order.paymentStatus === 'cancel'"
                    color="#FDECEC"
                    text-color="#F03D3E"
                  >
                    ยกเลิกแล้ว
                  </v-chip>
                  
                  <v-chip v-else color="#FDECEC" text-color="#F03D3E">
                    เกิดข้อผิดพลาด
                  </v-chip>
              </v-col>
            </v-row>
            <v-card outlined class="mb-3" v-for="(course, index_courses) in order.courses" :key="`${index_courses}_courses`">
              <v-row>
                <v-col cols="3" class="pr-0">
                  <v-img
                    v-if="course.courseImg"
                    :src="course.courseImg"
                    cover
                    :height="course.show_student ? '' : '160'"
                    class="w-full h-full rounded-l-lg"
                  />
                  <img v-else src="@/assets/course/payment.png" height="160" />
                </v-col>
                <v-col>
                  <v-card-text class="pa-2">
                    <v-row dense>
                      <v-col>
                        <v-row dense>
                          <v-col
                            cols="12"
                            sm="6"
                            class="align-self-center text-lg font-bold"
                            >{{ course.courseNameTh }}</v-col
                          >
                        </v-row>
                        <v-row dense>
                          <v-col class="text-md py-2" cols="12" sm="6">
                            <v-row dense>
                              <v-col cols="auto">โค้ช :</v-col>
                              <v-col>{{
                                course.coachName ? course.coachName : "-"
                              }}</v-col>
                            </v-row>
                          </v-col>
                          <v-col class="text-md py-2" cols="12" sm="6">
                            <v-row dense>
                              <v-col cols="auto">เวลา :</v-col>
                              <v-col>{{
                                `${
                                  course.coursePeriodStartDate &&
                                  course.coursePeriodStartDate !== ""
                                    ? course.coursePeriodStartDate
                                    : course.timeStart
                                    ? course.timeStart
                                    : "-"
                                } - ${
                                  course.coursePeriodEndDate &&
                                  course.coursePeriodEndDate !== ""
                                    ? course.coursePeriodEndDate
                                    : course.timeEnd
                                    ? course.timeEnd
                                    : "-"
                                } น.`
                              }}</v-col>
                            </v-row>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                    <v-row
                      dense
                      :class="course.show_student ? 'mb-3' : ''"
                      class="d-flex align-center"
                    >
                      <v-col align="center">
                        <v-btn
                          @click="course.show_student = !course.show_student"
                          text
                          class="font-bold"
                          >แสดงรายการนักเรียน<v-icon color="#ff6b81">{{
                            course.show_student
                              ? "mdi-chevron-up"
                              : "mdi-chevron-down"
                          }}</v-icon></v-btn
                        >
                      </v-col>
                      <v-col cols="auto" v-if="order.paymentStatus === 'pending'">
                        <v-btn @click="payment(order)" outlined color="#ff6b81"
                          ><v-icon>mdi-cash</v-icon>ดำเนินการชำระเงิน</v-btn
                        >
                      </v-col>
                    </v-row>
                    <v-expand-transition>
                      <div v-if="course.show_student" class="border rounded-md pa-2">
                        <v-row dense>
                          <v-col class="font-bold" align="center">
                            ชื่อ-สกุล
                          </v-col>
                          <v-col class="font-bold" align="center"> เบอร์โทร </v-col>
                          <v-col class="font-bold" align="center"> email </v-col>
                        </v-row>
                        <v-divider class="my-2"></v-divider>
                        <v-row
                          v-for="(student, index) in course.students"
                          :key="`${index}-student`"
                        >
                          <v-col align="center">
                            {{ `${student.firstNameTh} ${student.lastNameTh}` }}
                          </v-col>
                          <v-col align="center">
                            {{ `${student.mobileNo}` }}
                          </v-col>
                          <v-col align="center">
                            {{ `${student.email}` }}
                          </v-col>
                        </v-row>
                      </div>
                    </v-expand-transition>
                  </v-card-text>
                </v-col>
              </v-row>
            </v-card>
            <v-row dense>
              <v-col class="font-bold" align="right">
                เวลาที่ทำรายการ:
              </v-col>
              <v-col cols="5" align="right">
                {{ order.createdDate }}
              </v-col>
            </v-row>
            <v-row dense>
              <v-col class="font-bold" align="right"> ทำรายการโดย: </v-col>
              <v-col cols="5" align="right">
                {{
                  `${order.createdByData.firstNameTh}  ${order.createdByData.lastNameTh}`
                }}
              </v-col>
            </v-row>
            <v-row dense>
              <v-col class="font-bold" align="right"> ราคาชำระ: </v-col>
              <v-col cols="5" align="right">
                {{ order.totalPrice.toLocaleString() }} บาท
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </div>
      <!-- <div v-for="(order, index) in history" :key="index">
        <v-card class="mb-3" v-for="(course, index_course) in order.courses" :key="`${index_course}-course`">
          <v-row>
            <v-col cols="3" class="pr-0">
              <v-img
                v-if="course.courseImg"
                :src="course.courseImg"
                cover
                class="w-full h-full rounded-l-lg"
              />
              <img v-else src="@/assets/course/payment.png" height="270" />
            </v-col>
            <v-col cols="9">
              <v-card-text class="pa-2">
                <v-row dense>
                  <v-col>
                    <v-row dense>
                      <v-col
                        cols="12"
                        sm="6"
                        class="align-self-center text-lg font-bold"
                        >{{ course.courseNameTh }}</v-col
                      >
                      <v-col
                        cols="12"
                        sm="6"
                        class="align-self-center"
                        align="right"
                        @click="nextStep(order)"
                      >
                        <v-chip
                          v-if="course.paymentStatus === 'success'"
                          color="#F0F9EE"
                          text-color="#58A144"
                        >
                          ชำระเงินแล้ว
                        </v-chip>

                        <v-chip
                          v-else-if="course.paymentStatus === 'pending'"
                          color="#FFF9E8"
                          text-color="#FCC419"
                        >
                          รอชำระเงิน
                        </v-chip>

                        <v-chip
                          v-else-if="course.paymentStatus === 'cancel'"
                          color="#FDECEC"
                          text-color="#F03D3E"
                        >
                          ยกเลิกแล้ว
                        </v-chip>

                        <v-chip v-else color="#FDECEC" text-color="#F03D3E">
                          เกิดข้อผิดพลาด
                        </v-chip>
                      </v-col>
                    </v-row>
                    <v-row dense>
                      <v-col class="text-md py-2" cols="12" sm="6">
                        <v-row dense>
                          <v-col cols="auto">โค้ช :</v-col>
                          <v-col>{{
                            course.coachName ? course.coachName : "-"
                          }}</v-col>
                        </v-row>
                      </v-col>
                      <v-col class="text-md py-2" cols="12" sm="6">
                        <v-row dense>
                          <v-col cols="auto">เวลา :</v-col>
                          <v-col>{{
                            `${
                              course.coursePeriodStartDate &&
                              course.coursePeriodStartDate !== ""
                                ? course.coursePeriodStartDate
                                : course.timeStart
                                ? course.timeStart
                                : "-"
                            } - ${
                              course.coursePeriodEndDate &&
                              course.coursePeriodEndDate !== ""
                                ? course.coursePeriodEndDate
                                : course.timeEnd
                                ? course.timeEnd
                                : "-"
                            } น.`
                          }}</v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
                <v-row dense>
                  <v-col class="font-bold" align="right">
                    หมายเลขคำสั่งซื้อ:
                  </v-col>
                  <v-col cols="5" align="right">
                    {{ order.orderNumber }}
                  </v-col>
                </v-row>
                <v-row dense>
                  <v-col class="font-bold" align="right">
                    เวลาที่ทำรายการ:
                  </v-col>
                  <v-col cols="5" align="right">
                    {{ genDate(course.createdDate) }}
                  </v-col>
                </v-row>
                <v-row dense>
                  <v-col class="font-bold" align="right"> ทำรายการโดย: </v-col>
                  <v-col cols="5" align="right">
                    {{
                      `${course.createdByData.firstNameTh}  ${course.createdByData.lastNameTh}`
                    }}
                  </v-col>
                </v-row>
                <v-row dense>
                  <v-col class="font-bold" align="right"> ราคาชำระ: </v-col>
                  <v-col cols="5" align="right">
                    {{ course.totalPrice.toLocaleString() }} บาท
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-text class="py-2">
                <v-row
                  dense
                  :class="course.show_student ? 'mb-3' : ''"
                  class="d-flex align-center"
                >
                  <v-col>
                    <v-btn
                      @click="course.show_student = !course.show_student"
                      text
                      class="font-bold"
                      >แสดงรายการนักเรียน<v-icon color="#ff6b81">{{
                        order.show_student
                          ? "mdi-chevron-up"
                          : "mdi-chevron-down"
                      }}</v-icon></v-btn
                    >
                  </v-col>
                  <v-col cols="auto" v-if="course.paymentStatus === 'pending'">
                    <v-btn @click="payment(order)" outlined color="#ff6b81"
                      ><v-icon>mdi-cash</v-icon>ดำเนินการชำระเงิน</v-btn
                    >
                  </v-col>
                </v-row>
                <v-expand-transition>
                  <div v-if="order.show_student" class="border rounded-md pa-2">
                    <v-row dense>
                      <v-col class="font-bold" align="center">
                        ชื่อ-สกุล
                      </v-col>
                      <v-col class="font-bold" align="center"> เบอร์โทร </v-col>
                      <v-col class="font-bold" align="center"> email </v-col>
                    </v-row>
                    <v-divider class="my-2"></v-divider>
                    <v-row
                      v-for="(student, index) in course.students"
                      :key="`${index}-student`"
                    >
                      <v-col align="center">
                        {{ `${student.firstNameTh} ${student.lastNameTh}` }}
                      </v-col>
                      <v-col align="center">
                        {{ `${student.mobileNo}` }}
                      </v-col>
                      <v-col align="center">
                        {{ `${student.email}` }}
                      </v-col>
                    </v-row>
                  </div>
                </v-expand-transition>
              </v-card-text>
            </v-col>
          </v-row>
        </v-card>
      </div> -->
    </v-container>
  </v-app>
</template>
  
  <script>
import axios from "axios";
import VueCookie from "vue-cookie";
import { dateFormatter } from "../../../functions/functions";
import { mapActions, mapGetters } from "vuex";
import Swal from "sweetalert2";
export default {
  name: "orderHistory",
  components: {},
  data: () => ({
    panel: false,
    history: [],
  }),
  created() {
    // this.$store.dispatch("NavberUserModules/changeTitleNavber","ประวัติการซื้อ")
    // this.getHistory()
  },
  mounted() {
    this.$store.dispatch(
      "NavberUserModules/changeTitleNavber",
      "ประวัติการการลงทะเบียน"
    );
  },
  watch: {},
  computed: {
    ...mapGetters(),
    setFunction() {
      this.getHistory();
      return "";
    },
  },
  methods: {
    ...mapActions({
      savePayment: "OrderModules/savePayment",
    }),
    genDate(date) {
      return dateFormatter(new Date(date), "DD MT YYYYT");
    },
    payment(payment_data) {
      Swal.fire({
        icon: "question",
        title: "ดำเนินการชำระเงินใช่หรือไม่?",
        showDenyButton: false,
        showCancelButton: true,
        cancelButtonText: "ยกเลิก",
        confirmButtonText: "ตกลง",
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.savePayment({ paymnet_data: payment_data });
        }
      });
    },
    async getHistory() {
      let mapHistory = [];
      const config = {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-type": "Application/json",
          Authorization: `Bearer ${VueCookie.get("token")}`,
        },
      };
      //  let localhost = "http://localhost:3002"
      const { data } = await axios.get( `${process.env.VUE_APP_URL}/api/v1/order/history`, config );
      console.log("data", data);
      

      for (const item of data.data) {
        console.log("item =>", data.data.filter(v => v.orderNumber == item.orderNumber))
        
        if (item.courseImg && item.courseImg !== "") {
          item.courseImg = process.env.VUE_APP_URL.concat(
            `/api/v1/files/${item.courseImg}`
          );
          item.show_student = false;
        }
        if( data.data.filter(v => v.orderNumber == item.orderNumber).length > 0){
          let courses = []
          for await (const course of data.data.filter(v => v.orderNumber == item.orderNumber)){
            if(!courses.some(v => v.orderItemId == course.orderItemId)){
              courses.push(course)
            }
          }
          if(!mapHistory.some(v => v.orderId === item.orderId)){
            mapHistory.push({
              orderId : item.orderId,
              orderNumber :  item.orderNumber,
              paymentStatus : item.paymentStatus,
              courses : courses,
              totalPrice: item.totalPrice,
              createdDate : this.genDate(item.createdDate),
              createdByData : item.createdByData
            });
          }
        }
      }
      console.log("mapHistory", mapHistory);
      this.history = mapHistory;
    },

    nextStep(items) {
      console.log("paymentStatus", items);
      if (items.paymentStatus === "success") {
        this.$router.push({ name: "StudentsSchedule" });
      } else if (items.paymentStatus === "pending") {
        this.$router.push({ name: "userCourseOrder" });
      } else if (items.paymentStatus === "cancel") {
        this.$router.push({
          name: "userCourseDetail_courseId",
          params: { course_id: items.courseId },
        });
      }
    },
  },
};
</script>
  
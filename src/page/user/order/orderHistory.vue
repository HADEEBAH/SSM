<template>
  <v-app>
    <v-container>
      <loading-overlay
        v-if="order_history_is_loading"
        :loading="order_history_is_loading"
      ></loading-overlay>
      <template v-else>
        <div v-if="!order_history || order_history.length == 0">
          <v-card class="my-3" flat>
            <v-card-text
              class="rounded-lg border-2 border-[#ff6b81] text-lg font-bold"
              align="center"
            >
              ไม่พบข้อมูล
            </v-card-text>
          </v-card>
        </div>

        <div v-for="(order, index) in order_history" :key="`${index}-order`">
          <v-card class="mb-3">
            <!-- <pre>{{ order }}</pre> -->
            <v-card-text>
              <v-row dense class="mb-3">
                <v-col>
                  <label class="text-caption">หมายเลขคำสั่งซื้อ: </label>
                  <v-row dense>
                    <v-col class="font-bold">
                      {{ order.orderNumber }}
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" sm="6" class="align-self-center" align="right">
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
              <v-card
                outlined
                class="mb-3"
                v-for="(course, index_courses) in order.courses"
                :key="`${index_courses}_courses`"
              >
                <v-row>
                  <!-- :height="course.show_student ? '' : '160'"
                      class="w-full h-full rounded-l-lg" 
                      class="w-full h-full rounded-lg"
                    -->
                  <v-col cols="12" sm="4" md="4" lg="4" class="pa-5">
                    <v-img
                      v-if="course.courseImg"
                      :src="course.courseImg"
                      cover
                      :height="heightImg()"
                      :width="widthImg()"
                      class="rounded-lg"
                    />
                    <img
                      v-else
                      src="@/assets/course/payment.png"
                      height="160"
                    />
                  </v-col>
                  <v-col cols="12" sm="8" md="8" lg="8">
                    <v-card-text class="pa-2">
                      <v-row dense>
                        <v-col class="pa-5">
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
                                    course.timeStartOrder &&
                                    course.timeStartOrder !== ""
                                      ? course.timeStartOrder
                                      : "-"
                                  } - ${
                                    course.timeEndOrder &&
                                    course.timeEndOrder !== ""
                                      ? course.timeEndOrder
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
                        <v-col align="center" class="my-5">
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
                      </v-row>
                      <v-expand-transition>
                        <div
                          v-if="course.show_student"
                          class="border rounded-md pa-5"
                        >
                          <v-row
                            dense
                            v-for="(student, index) in course.students"
                            :key="`${index}-student`"
                          >
                            <v-card flat class="w-full my-2">
                              <v-card-text class="border-2 border-[#ff6b81]">
                                <v-col cols="12" calign="start">
                                  <span class="font-bold"> ชื่อ-สกุล : </span>
                                  {{
                                    `${student.firstNameTh} ${student.lastNameTh}`
                                  }}
                                </v-col>
                                <v-col cols="12" calign="start">
                                  <span class="font-bold"> เบอร์โทร : </span>
                                  {{ `${student.mobileNo}` }} </v-col
                                ><v-col cols="12" calign="start">
                                  <span class="font-bold"> email : </span>
                                  {{ `${student.email}` }}
                                </v-col>
                              </v-card-text>
                            </v-card>
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
              <v-row dense>
                <v-col
                  cols="12"
                  align="right"
                  v-if="order.paymentStatus === 'pending'"
                >
                  <v-btn @click="payment(order)" outlined color="#ff6b81"
                    ><v-icon>mdi-cash</v-icon>ดำเนินการชำระเงิน</v-btn
                  >
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </div>
      </template>
    </v-container>
  </v-app>
</template>
  
  <script>
import { dateFormatter } from "../../../functions/functions";
import { mapActions, mapGetters } from "vuex";
import loadingOverlay from "../../../components/loading/loadingOverlay";
import Swal from "sweetalert2";
export default {
  name: "orderHistory",
  components: { loadingOverlay },
  data: () => ({
    panel: false,
    course_id_select: "",
  }),
  created() {
    // this.$store.dispatch("NavberUserModules/changeTitleNavber","ประวัติการซื้อ")
  },
  mounted() {
    this.$store.dispatch(
      "NavberUserModules/changeTitleNavber",
      "ประวัติการการลงทะเบียน"
    );
    this.getHistory();
  },
  watch: {},
  computed: {
    ...mapGetters({
      order_history: "OrderModules/orderHistory",
      order_history_is_loading: "OrderModules/orderHistoryIsLoading",
    }),
  },
  methods: {
    ...mapActions({
      savePayment: "OrderModules/savePayment",
      getHistory: "OrderModules/getHistory",
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
    widthImg() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return 330;
        case "sm":
          return 500;
        case "md":
          return 500;
        case "lg":
          return 500;
        case "xl":
          return 500;
      }
    },

    heightImg() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return 250;
        case "sm":
          return 300;
        case "md":
          return 300;
        case "lg":
          return 280;
        case "xl":
          return 405.5;
      }
    },
  },
};
</script>
  
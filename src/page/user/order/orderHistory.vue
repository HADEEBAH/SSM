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
              {{ $t("no data found") }}
            </v-card-text>
          </v-card>
        </div>

        <div v-for="(order, index) in order_history" :key="`${index}-order`">
          <v-card class="mb-3">
            <v-card-text>
              <v-row dense class="mb-3">
                <v-col>
                  <label class="text-caption">{{ $t("order number") }}: </label>
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
                    {{ $t(order.paymentStatus) }}
                  </v-chip>

                  <v-chip
                    v-else-if="order.paymentStatus === 'pending'"
                    color="#FFF9E8"
                    text-color="#FCC419"
                  >
                    {{ $t(order.paymentStatus) }}
                  </v-chip>

                  <v-chip
                    v-else-if="order.paymentStatus === 'cancel'"
                    color="#FDECEC"
                    text-color="#F03D3E"
                  >
                    {{ $t(order.paymentStatus) }}
                  </v-chip>

                  <v-chip v-else color="#FDECEC" text-color="#F03D3E">
                    เกิดข้อผิดพลาด
                    {{ $t("something went wrong") }}
                  </v-chip>
                </v-col>
              </v-row>
              <v-card
                outlined
                class="mb-3"
                v-for="(course, index_courses) in order.courses"
                :key="`${index_courses}_courses`"
              >
              <v-card-text>
                <v-row>
                  <v-col cols="12" sm="4" md="4" lg="4" class="pa-2">
                    <v-img
                      v-if="course.courseImg"
                      :src="course.courseImg"
                      cover
                      height="180"
                      class="rounded-lg h-full"
                    />
                    <img
                      v-else
                      src="@/assets/course/payment.png"
                      height="160"
                    />
                  </v-col>
                  <v-col cols="12" sm="8" md="8" lg="8">
                    <v-row dense>
                      <v-col class="">
                        <v-row dense>
                          <v-col
                            cols="12"
                            sm="6"
                            class="align-self-center text-lg font-bold"
                            >{{
                              $i18n.locale == "th"
                                ? course.courseNameTh
                                : course.courseNameEn
                            }}</v-col
                          >
                        </v-row>
                        <v-row dense>
                          <v-col class="text-md py-2" cols="12" sm="6">
                            <v-row dense>
                              <v-col cols="auto">{{ $t("coach") }} : </v-col>
                              <v-col>{{
                                $i18n.locale == "th"
                                  ? course.coachName
                                    ? course.coachName
                                    : "-"
                                  : course.coachNameEn
                                  ? course.coachNameEn
                                  : "-"
                              }}</v-col>
                            </v-row>
                          </v-col>
                          <v-col class="text-md py-2" cols="12" sm="6">
                            <v-row dense>
                              <v-col cols="auto">{{ $t("times") }} :</v-col>
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
                                } ${$t("o'clock")}`
                              }}</v-col>
                            </v-row>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                    <v-row
                      dense
                      :class="course.show_student ? 'mb-2' : ''"
                      class="d-flex align-center"
                    >
                      <v-col align="center">
                        <v-btn
                          @click="course.show_student = !course.show_student"
                          text
                          class="font-bold"
                          >{{ $t("show student list")
                          }}<v-icon color="#ff6b81">{{
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
                        class="rounded-md pa-2"
                      >
                        <v-row
                          dense
                          v-for="(student, index) in course.students"
                          :key="`${index}-student`"
                        >
                          <v-card flat class="w-full mb-2">
                            <v-card-text class="border-2 border-[#ff6b81]">
                              <v-row dense>
                                <v-col cols="12" sm="4" align="start">
                                  <span class="font-bold"
                                    >{{ $t("first name") }} -
                                    {{ $t("last name") }} :
                                  </span>
                                </v-col>
                                <v-col cols="12" sm="8" align="start">
                                  {{
                                    $i18n.locale == "th"
                                      ? `${student.firstNameTh} ${student.lastNameTh}`
                                      : `${student.firstNameEng} ${student.lastNameEng}`
                                  }}
                                </v-col>
                              </v-row>
                              <v-row dense>
                                <v-col cols="12" sm="4" align="start">
                                  <span class="font-bold">
                                    {{ $t("phone number") }} :
                                  </span>
                                </v-col>
                                <v-col cols="12" sm="8" align="start">
                                  {{ `${student.mobileNo}` }} 
                                </v-col>
                              </v-row>
                              <v-row dense>
                                <v-col cols="12" sm="4" align="start">
                                  <span class="font-bold">
                                    {{ $t("email") }} :
                                  </span>
                                </v-col>
                                <v-col cols="12" sm="8" align="start">
                                  {{ `${student.email}` }}
                                </v-col>
                              </v-row>
                            </v-card-text>
                          </v-card>
                        </v-row>
                      </div>
                    </v-expand-transition>
                  </v-col>
                </v-row>
              </v-card-text>
              
              </v-card>
              <v-row dense>
                <v-col class="font-bold" align="right">
                  {{ $t("transaction time") }}:
                </v-col>
                <v-col cols="5" align="right">
                  {{ genDate(order.createdDateStr) }}
                </v-col>
              </v-row>
              <v-row dense>
                <v-col class="font-bold" align="right">
                  {{ $t("listed by") }}:
                </v-col>
                <v-col cols="5" align="right">
                  {{
                    $i18n.locale == "th"
                      ? `${order.createdByData.firstNameTh}  ${order.createdByData.lastNameTh}`
                      : `${order.createdByData.firstNameEng}  ${order.createdByData.lastNameEng}`
                  }}
                </v-col>
              </v-row>
              <v-row dense>
                <v-col class="font-bold" align="right">
                  {{ $t("paid price") }}:
                </v-col>
                <v-col cols="5" align="right">
                  {{ order.totalPrice.toLocaleString() }} {{ $t("baht") }}
                </v-col>
              </v-row>
              <v-row dense>
                <v-col
                  cols="12"
                  sm="auto"
                  align="right"
                  v-if="
                    order.paymentStatus === 'pending' &&
                    order.createdByData.userOneId == userData.account_id
                  "
                >
                  <v-btn
                    :class="$vuetify.breakpoint.smAndUp ? '' : 'w-full'"
                    @click="cancelOrder(order.orderId)"
                    depressed
                    dark
                    color="#ff6b81"
                    ><v-icon>mdi-close</v-icon>{{ $t("cancel") }}</v-btn
                  >
                </v-col>
                <v-col
                  cols="12"
                  sm="auto"
                  align="right"
                  v-if="order.paymentStatus === 'pending'"
                >
                  <v-btn 
                  :class="$vuetify.breakpoint.smAndUp ? '' : 'w-full'"  
                  @click="payment(order)" outlined color="#ff6b81"
                    ><v-icon>mdi-cash</v-icon
                    >{{ $t("proceed to payment") }}</v-btn
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
import { mapActions, mapGetters } from "vuex";
import loadingOverlay from "@/components/loading/loadingOverlay";
import Swal from "sweetalert2";
export default {
  name: "orderHistory",
  components: { loadingOverlay },
  data: () => ({
    panel: false,
    course_id_select: "",
    userData: null,
  }),
  mounted() {
    this.userData = JSON.parse(localStorage.getItem("userDetail"));
    this.$store.dispatch("NavberUserModules/changeTitleNavber", "my order");
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
      userUpdateOrderCancelStatus: "OrderModules/userUpdateOrderCancelStatus",
      savePayment: "OrderModules/savePayment",
      getHistory: "OrderModules/getHistory",
    }),
    genDate(date) {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(date).toLocaleString(
        this.$i18n.locale == "th" ? "th-TH" : "en-US",
        options
      );
    },
    cancelOrder(order_id) {
      Swal.fire({
        icon: "question",
        title: this.$t("want to cancel?"),
        showDenyButton: false,
        showCancelButton: true,
        cancelButtonText: this.$t("cancel"),
        confirmButtonText: this.$t("agree"),
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.userUpdateOrderCancelStatus({
            order_id: order_id,
          });
        }
      });
    },
    payment(payment_data) {
      Swal.fire({
        icon: "question",
        title: this.$t("proceed with payment?"),
        showDenyButton: false,
        showCancelButton: true,
        cancelButtonText: this.$t("cancel"),
        confirmButtonText: this.$t("agree"),
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

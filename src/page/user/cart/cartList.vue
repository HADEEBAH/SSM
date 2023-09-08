<template>
  <v-container class="h-full">
    {{ setFunctions }}
    <loading-overlay :loading="cart_list_is_loading"></loading-overlay>
    <div v-if="!cart_list_is_loading" class="h-full">
      <v-row class="h-full content-center" v-if="cart_list.length == 0">
        <v-col cols="12" class="webkit-center">
          <span class="text-xl font-bold text-center my-5 pink--text">
            {{ $t("can't find items in the basket") }}
          </span>
          <v-img src="@/assets/cart/basket.svg" max-width="300px"> </v-img>
        </v-col>
      </v-row>
      <div v-if="cart_list.length > 0">
        <v-row class="mb-16">
          <v-col
            cols="12"
            v-for="(item, index_item) in cart_list"
            :key="`${index_item}-cart`"
          >
            <v-card class="rounded-lg mt-5">
              <v-row dense>
                <v-col cols="3">
                  <v-img
                    :src="item.course_img"
                    cover
                    height="270"
                    class="w-full h-full rounded-l-lg"
                  />
                </v-col>
                <v-col>
                  <v-card-text>
                    <v-row dense>
                      <v-col cols="12">
                        <v-row dense>
                          <v-col>
                            <v-row dense>
                              <v-col class="text-lg font-bold">
                                {{
                                  $i18n.locale == "th"
                                    ? item.course_name_th
                                    : item.course_name_en
                                }}
                              </v-col>
                              <v-col cols="auto">
                                <v-checkbox
                                  class="card_checkbox"
                                  color="error"
                                  hide-details
                                  @change="selectOne($event, item.course_id)"
                                  v-model="item.checked"
                                >
                                </v-checkbox>
                              </v-col>
                            </v-row>
                            <v-row dense>
                              <v-col
                                cols="12"
                                sm="6"
                                class="text-md font-semibold"
                              >
                                {{ $t("coach") }} :
                                {{
                                  $i18n.locale == "th"
                                    ? item.coach_name
                                    : item.coach_name_en
                                }}
                              </v-col>
                              <v-col
                                cols="12"
                                sm="6"
                                class="text-md font-semibold"
                              >
                              </v-col>
                            </v-row>
                            <v-row dense>
                              <v-col>
                                {{ item.detail }}
                              </v-col>
                            </v-row>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                    <v-row dense v-if="item.course_type_id === 'CT_1'">
                      <v-col align="right" cols="8">{{
                        $t("number of times studied")
                      }}</v-col>
                      <v-col
                        align="right"
                        cols="4"
                        class="text-md font-semibold text-[#FF6B81]"
                      >
                        {{ item.option.amount }} {{ $t("time") }}</v-col
                      >
                    </v-row>
                    <v-row dense>
                      <v-col align="right" cols="8">
                        {{ $t("number of students") }}</v-col
                      >
                      <v-col
                        align="right"
                        cols="4"
                        class="text-md font-semibold text-[#FF6B81]"
                      >
                        {{ item.students.length }} {{ $t("person") }}</v-col
                      >
                    </v-row>
                    <v-row dense v-if="item.course_type_id === 'CT_1'">
                      <v-col align="right" cols="8">{{ $t("discount") }}</v-col>
                      <v-col
                        align="right"
                        cols="4"
                        class="text-md font-semibold text-[#FF6B81]"
                      >
                        {{ item.option.discount_price }} {{ $t("baht") }}</v-col
                      >
                    </v-row>
                    <v-row dense class="mb-3">
                      <v-col align="right" cols="8">
                        {{ $t("paid price") }}</v-col
                      >
                      <v-col
                        align="right"
                        cols="4"
                        class="text-md font-semibold text-[#FF6B81]"
                      >
                        {{
                          item.course_type_id === "CT_1"
                            ? item.option.net_price.toLocaleString()
                            : item.net_price.toLocaleString()
                        }}
                        {{ $t("baht") }}</v-col
                      >
                    </v-row>
                    <div align="right">
                      <v-btn
                        outlined
                        color="red"
                        @click="removeCart(item.order_tmp_id)"
                        ><v-icon> mdi-delete</v-icon>
                        {{ $t("delete item") }}</v-btn
                      >
                    </div>
                  </v-card-text>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col>
            <v-checkbox hide-details color="pink" v-model="policy">
              <template v-slot:label>
                {{ $t("accept") }}
                <a class="mx-2 font-weight-bold" @click="policy_show = true">
                  {{ $t("terms of service and privacy policy") }}
                </a>
                <!-- และ
                <a class="mx-2 font-weight-bold"
                  >นโยบายความคุ้มครองข้อมูลส่วนบุคคล</a
                > -->
              </template>
            </v-checkbox>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="12" sm="4">
            <v-checkbox
              class="card_checkbox"
              color="error"
              hide-details
              :label="$t('total')"
              @change="selectAll($event)"
              v-model="selected_all"
            ></v-checkbox>
          </v-col>
          <v-col cols="6" sm="4">
            {{ $t("total") }}
            <b class="text-[#ff6b81]"
              >{{ total_price.toLocaleString() }} {{ $t("baht") }}</b
            >
          </v-col>
          <v-col cols="6" sm="4" align="end">
            <v-btn depressed dark color="#ff6b81" @click="savePayment">
              {{ $t("cash out") }} ({{ count_selected_cart }})
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </div>
    <v-dialog
      v-model="policy_show"
      persistent
      :width="$vuetify.breakpoint.smAndUp ? `60vw` : ''"
    >
      <v-card flat class="pa-2">
        <v-row dense>
          <v-col class="pa-2" align="right">
            <v-btn icon @click="policy_show = false">
              <v-icon color="red"> mdi-close </v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-card-title>
          <v-row dense>
            <v-col align="center"> policy </v-col>
          </v-row>
        </v-card-title>
        <v-card-text>
          <v-row dense>
            <v-col cols="12">
              <TermOfUse />
            </v-col>
          </v-row>
          <v-row dense>
            <v-col>
              <v-checkbox hide-details color="pink" v-model="policy">
                <template v-slot:label>
                  {{ $t("accept") }}
                  <a class="mx-2 font-weight-bold">
                    {{ $t("terms of service and privacy policy") }}
                  </a>
                </template>
              </v-checkbox>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-row dense>
            <v-col align="right">
              <v-btn
                outlined
                color="#ff6b81"
                text-color="#ff6b81"
                @click="closePolicy()"
              >
                {{ $t("cancel") }}
              </v-btn>
            </v-col>
            <v-col>
              <v-btn
                depressed
                dark
                color="#ff6b81"
                @click="policy_show = false"
              >
                {{ $t("agree") }}
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import Swal from "sweetalert2";
import { mapActions, mapGetters } from "vuex";
import loadingOverlay from "@/components/loading/loadingOverlay.vue";
import TermOfUse from "@/components/termOfUse.vue";
export default {
  components: {
    loadingOverlay,
    TermOfUse,
  },
  data: () => ({
    policy: false,
    policy_show: false,
    search: "",
    drawer: true,
    detail: false,
    selected: [],
    allSelected: false,
    userIds: [],
    oneSelect: [],
    selectedCourse: [],
    selected_all: false,
    count_selected_cart: 0,
    total_price: 0,
    user_login: {},
  }),
  created() {},
  mounted() {
    this.$store.dispatch("NavberUserModules/changeTitleNavber", "cart");
    this.user_login = JSON.parse(localStorage.getItem("userDetail"));
    this.cart_list.map((val) => {
      val.checked = false;
    });
  },

  methods: {
    ...mapActions({
      GetCartList: "OrderModules/GetCartList",
      saveOrder: "OrderModules/saveOrder",
      changeOrderData: "OrderModules/changeOrderData",
      DeleteCart: "OrderModules/DeleteCart",
      GetAllCourseMonitor: "CourseMonitorModules/GetAllCourseMonitor",
    }),
    closePolicy() {
      this.policy = false;
      this.policy_show = false;
    },
    removeCart(cart_id) {
      Swal.fire({
        icon: "question",
        title: this.$t("want to delete this item?"),
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: this.$t("agree"),
        cancelButtonText: this.$t("cancel"),
      }).then(async (result) => {
        if (result.isConfirmed) {
          if (cart_id.length > 0) {
            for await (const id of cart_id) {
              this.DeleteCart({
                cart_id: id,
                account_id: this.user_login.account_id,
              });
            }
          }
        }
      });
    },
    sumtotal() {
      this.total_price = 0;
      this.count_selected_cart = this.cart_list.filter((v) => v.checked).length;
      this.cart_list.forEach((course) => {
        if (course.checked) {
          if (course.course_type_id === "CT_1") {
            this.total_price = this.total_price + course.option.net_price;
          } else {
            this.total_price = this.total_price + course.net_price;
          }
        }
      });
    },
    selectOne(bool, key) {
      let result = this.cart_list.map((element) => {
        if (element.category_id == key) {
          element.checked = bool;
        }

        return element;
      });
      let resultAll = result.filter((element) => {
        if (!element.checked) {
          this.selected_all = false;
          return element;
        }
      });
      if (resultAll.length == 0) {
        this.selected_all = true;
      }
      this.sumtotal();
    },
    selectAll(bool) {
      this.cart_list.map((element) => {
        element.checked = bool;

        return element;
      });

      this.sumtotal();
    },
    savePayment() {
      if (!this.policy) {
        this.policy_show = true;
      } else {
        if (this.cart_list.filter((v) => v.checked === true).length > 0) {
          let isValiDateCourse = [];
          this.order.courses = this.cart_list.filter((v) => v.checked === true);
          this.order.total_price = this.total_price;
          this.order.payment_status = "pending";
          this.order.created_by = this.user_login.account_id;
          this.order.type = "cart";
          this.changeOrderData(this.order);
          this.GetAllCourseMonitor().then(() => {
            this.order.courses.forEach((course) => {
              if (
                this.course_monitors.filter(
                  (v) =>
                    v.courseMonitorEntity_coach_id === course.coach &&
                    v.courseMonitorEntity_course_id === course.course_id &&
                    v.courseMonitorEntity_day_of_week_id ===
                      course.day_of_week_id &&
                    v.courseMonitorEntity_time_id === course.time_id
                ).length > 0
              ) {
                if (
                  this.course_monitors.some(
                    (v) =>
                      v.courseMonitorEntity_coach_id === course.coach &&
                      v.courseMonitorEntity_course_id === course.course_id &&
                      v.courseMonitorEntity_day_of_week_id ===
                        course.day_of_week_id &&
                      v.courseMonitorEntity_time_id === course.time_id &&
                      v.courseMonitorEntity_current_student +
                        course.students.length <=
                        v.courseMonitorEntity_maximum_student &&
                      v.courseMonitorEntity_status === "Open"
                  )
                ) {
                  isValiDateCourse.push(true);
                } else {
                  isValiDateCourse.push(false);
                }
              } else {
                isValiDateCourse.push(true);
              }
            });
            if (isValiDateCourse.includes(false)) {
              Swal.fire({
                icon: "error",
                title: this.$t(
                  "the selected course is full and payment cannot be made"
                ),
                showDenyButton: false,
                showCancelButton: true,
                confirmButtonText: this.$t("agree"),
                cancelButtonText: this.$t("cancel"),
              });
            } else {
              this.saveOrder({regis_type : ""}).then(() => {
                for (const cart of this.cart_list) {
                  for (const id of cart.order_tmp_id) {
                    this.DeleteCart({
                      cart_id: id,
                      account_id: this.user_login.account_id,
                    });
                  }
                }
              });
            }
          });
        }
      }
    },
  },

  computed: {
    ...mapGetters({
      cart_list: "OrderModules/getCartList",
      cart_list_is_loading: "OrderModules/getCartListIsLoading",
      course_order: "OrderModules/getCourseOrder",
      categorys_is_loading: "CategoryModules/getCategorysIsLoading",
      course_monitors: "CourseMonitorModules/getCourseMonitor",
      order: "OrderModules/getOrder",
    }),
    setFunctions() {
      this.GetCartList(this.user_login.account_id);
      return "";
    },
    MobileSize() {
      const { xs } = this.$vuetify.breakpoint;
      return !!xs;
    },
    IpadSize() {
      const { sm } = this.$vuetify.breakpoint;
      return !!sm;
    },
    IpadProSize() {
      const { md } = this.$vuetify.breakpoint;
      return !!md;
    },
  },
};
</script>

<style scoped>
.card_checkbox {
  margin-top: -5px;
  margin-right: 10px;
}

.card-total {
  background-color: #fbf3f5;
  position: absolute;
  bottom: -1px;
  width: 100%;
  left: 0px;
}

.alltext {
  margin-right: -50px;
}

.webkit-center {
  text-align: -webkit-center;
}
</style>

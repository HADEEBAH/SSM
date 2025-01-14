<template>
  <v-container class="h-full">
    {{ setFunctions }}
    <loading-overlay
      :loading="cart_list_is_loading || order_is_loading"
    ></loading-overlay>
    <div v-if="!cart_list_is_loading || order_is_loading" class="h-full">
      <v-row class="h-full content-center" v-if="cart_list.length == 0">
        <v-col cols="12" class="webkit-center">
          <span class="text-xl font-bold text-center my-5 pink--text">
            {{ $t("can't find items in the basket") }}
          </span>
          <v-img src="@/assets/cart/basket.svg" max-width="300px"> </v-img>
        </v-col>
      </v-row>
      <div v-if="cart_list.length > 0">
        <v-row class="mb-5" ref="cart_list">
          <v-col
            cols="12"
            v-for="(item, index_item) in cart_list"
            :key="`${index_item}-cart`"
          >
            <v-card class="rounded-lg mt-5">
              <v-row dense>
                <!-- img -->
                <v-col cols="12" sm="4">
                  <v-img
                    :src="
                      item.course_img
                        ? item.course_img
                        : require(`@/assets/course/default_course_img.svg`)
                    "
                    :aspect-ratio="16 / 9"
                    class="rounded-lg my-5 mx-3"
                    style="max-width: 500px"
                  >
                    <template v-slot:placeholder>
                      <v-row
                        class="fill-height ma-0"
                        align="center"
                        justify="center"
                      >
                        <v-progress-circular
                          indeterminate
                          color="#ff6b81"
                        ></v-progress-circular>
                      </v-row>
                    </template>
                  </v-img>
                </v-col>
                <v-col cols="12" sm="8">
                  <v-card-text>
                    <v-row dense>
                      <v-col cols="12">
                        <v-row dense>
                          <v-col>
                            <v-row dense>
                              <!-- course_name -->
                              <v-col class="text-lg font-bold">
                                {{
                                  $i18n.locale == "th"
                                    ? item.course_name_th
                                    : item.course_name_en
                                }}
                              </v-col>
                              <!-- card_checkbox -->
                              <v-col cols="auto">
                                <v-checkbox
                                  class="card_checkbox"
                                  color="#ff6b81"
                                  hide-details
                                  @change="selectOne($event, item.course_id)"
                                  v-model="item.checked"
                                >
                                </v-checkbox>
                              </v-col>
                            </v-row>
                            <v-row dense>
                              <!-- coach -->
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
                    <v-row dense>
                      <v-col align="right" cols="8">{{
                        $t("school day")
                      }}</v-col>
                      <v-col
                        align="right"
                        cols="4"
                        class="text-md font-semibold text-[#FF6B81]"
                      >
                        {{ item.dayOff }}</v-col
                      >
                    </v-row>
                    <v-row dense>
                      <v-col align="right" cols="8">{{
                        $t("class time")
                      }}</v-col>
                      <v-col
                        align="right"
                        cols="4"
                        class="text-md font-semibold text-[#FF6B81]"
                      >
                        {{ item.time?.start }} - {{ item.time?.end }}</v-col
                      >
                    </v-row>
                    <v-row dense>
                      <v-col align="right" cols="8">{{
                        $t("coach name")
                      }}</v-col>
                      <v-col
                        align="right"
                        cols="4"
                        class="text-md font-semibold text-[#FF6B81]"
                      >
                        {{
                          $i18n.locale == "th"
                            ? item.coach_name
                            : item.coach_name_en
                        }}
                        <!-- {{ item?. first_name }}  {{ item?.last_name }} -->
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
                        {{
                          item.option.discount ? item.option.discount_price : 0
                        }}
                        {{ $t("baht") }}</v-col
                      >
                    </v-row>
                    <v-row dense v-if="item.course_type_id === 'CT_2'">
                      <v-col align="right" cols="8">{{ $t("discount") }}</v-col>
                      <v-col
                        align="right"
                        cols="4"
                        class="text-md font-semibold text-[#FF6B81]"
                      >
                        {{ item.discountPrice }} {{ $t("baht") }}</v-col
                      >
                    </v-row>
                    <v-row dense class="mb-3">
                      <v-col align="right" cols="8">
                        {{ $t("paid price") }}</v-col
                      >
                      <!-- <pre>{{ item }}</pre> -->
                      <v-col
                        align="right"
                        cols="4"
                        class="text-md font-semibold text-[#FF6B81]"
                      >
                        {{
                          item.course_type_id === "CT_1"
                            ? (
                                item.option.total_price ?? item.total_price
                              )?.toLocaleString()
                            : item.total_price?.toLocaleString()
                        }}
                        {{ $t("baht") }}</v-col
                      >
                    </v-row>
                    <div align="right">
                      <v-btn
                        outlined
                        color="#ff6b81"
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
        <v-row v-if="isDataReceived">
          <v-col cols="12" align="center">
            <v-progress-circular
              indeterminate
              color="#ff6b81"
              size="50"
            ></v-progress-circular>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col>
            <v-checkbox hide-details color="#ff6b81" v-model="policy">
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
              hide-details
              :label="$t('total')"
              @change="selectAll($event)"
              color="#ff6b81"
              v-model="selected_all"
            ></v-checkbox>
          </v-col>
          <v-col cols="6" sm="4">
            {{ $t("total") }}
            <b class="text-[#ff6b81]"
              >{{ total_price?.toLocaleString() }} {{ $t("baht") }}</b
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
              <v-icon color="#ff6b81"> mdi-close </v-icon>
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
              <v-checkbox hide-details color="#ff6b81" v-model="policy">
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
    isLoading: true,
    isStopLoading: false,
    scrollTop: 0,
    countDatePerPage: 0,
    isDataReceived: false,
    waitingProcess: false,
    sameHistoryLength: false,
  }),
  created() {
    this.GetAmountCartList();

    this.user_login = JSON.parse(localStorage.getItem("userDetail"));
  },
  mounted() {
    // window.addEventListener("scroll", this.handleScroll);
    this.GetAmountCartList();
    this.$store.dispatch("NavberUserModules/changeTitleNavber", "cart");
    this.cart_list.map((val) => {
      val.checked = false;
    });
    this.GetCartList({
      limit: 100,
      page: 1,
    });
  },
  destroyed() {
    // window.removeEventListener("scroll", this.handleScroll);
  },

  methods: {
    ...mapActions({
      GetCartList: "OrderModules/GetCartList",
      saveOrder: "OrderModules/saveOrder",
      changeOrderData: "OrderModules/changeOrderData",
      DeleteCart: "OrderModules/DeleteCart",
      GetAllCourseMonitor: "CourseMonitorModules/GetAllCourseMonitor",
      GetAmountCartList: "OrderModules/GetAmountCartList",
    }),
    closePolicy() {
      this.policy = false;
      this.policy_show = false;
    },
    // handleScroll() {
    //   this.scrollTop = window.scrollY; // ตัวเลขเมื่อ scroll ตัวเลขเริ่มนับจากบนสุด = 0
    //   let device = document.body.offsetHeight - 56; // ค่าของหน้าจอ device
    //   let ref = this.$refs.cart_list?.clientHeight; // ค่ามาจาก ref
    //   let countA = this.scrollTop + device;

    //   if (countA >= ref && !this.sameHistoryLength) {
    //     this.loadMoreData();
    //   }

    //   if (countA < ref) {
    //     this.sameHistoryLength = false;
    //   }
    // },
    // async loadMoreData() {
    //   this.countDatePerPage = this.cart_list?.length;

    //   if (!this.isDataReceived) {
    //     this.isDataReceived = true;

    //     if (!this.waitingProcess) {
    //       this.waitingProcess = true;

    //       await this.GetCartList({
    //         limit: this.cart_list_option.limit,
    //         page: this.cart_list_option.page + 1,
    //       });

    //       this.isDataReceived = false;
    //       this.waitingProcess = false;

    //       if (this.cart_list?.length === this.countDatePerPage) {
    //         this.sameHistoryLength = true;
    //       } else {
    //         this.sameHistoryLength = false;
    //       }
    //     }
    //   }
    // },
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
          this.GetAmountCartList({ account_id: this.user_login.account_id });
          if (cart_id.length > 0) {
            for await (const id of cart_id) {
              this.DeleteCart({
                cart_id: id,
                account_id: this.user_login.account_id,
              });
            }
            this.GetCartList({
              limit: 100,
              page: 1,
            });
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
            this.total_price = this.total_price + course.option.total_price;
          } else {
            this.total_price = this.total_price + course.total_price;
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
    async savePayment() {
      this.order_is_loading = true;

      if (!this.policy) {
        this.policy_show = true;
      } else {
        this.order_is_loading = true;
        if (this.cart_list.filter((v) => v.checked === true).length > 0) {
          this.order.courses = this.cart_list.filter((v) => v.checked === true);
          this.order.total_price = this.total_price;
          this.order.payment_status = "pending";
          this.order.created_by = this.user_login.account_id;
          this.order.type = "cart";
          this.changeOrderData(this.order);

          await this.saveOrder({ regis_type: "cart" });
          if (this.regis_status.statusCode === 201) {
            for (const cart of this.order.courses) {
              for (const id of cart.order_tmp_id) {
                this.DeleteCart({
                  cart_id: id,
                  account_id: this.user_login.account_id,
                });
              }
            }
          } else {
            this.policy = false;
            this.selected_all = false;
          }
        }

        await this.GetCartList({
          limit: 100,
          page: 1,
        });

        this.order_is_loading = true;

        this.order_is_loading = false;

        this.total_price = 0;
        this.order_is_loading = false;
      }
      this.order_is_loading = false;
    },
  },

  computed: {
    ...mapGetters({
      cart_list_option: "OrderModules/getCartListOption",
      cart_list: "OrderModules/getCartList",
      cart_list_is_loading: "OrderModules/getCartListIsLoading",
      course_order: "OrderModules/getCourseOrder",
      categorys_is_loading: "CategoryModules/getCategorysIsLoading",
      course_monitors: "CourseMonitorModules/getCourseMonitor",
      order: "OrderModules/getOrder",
      amount_cart_list: "OrderModules/getAmountCartList",
      order_is_loading: "OrderModules/getOrderIsLoading",
      regis_status: "OrderModules/getRegisStatus",
    }),
    setFunctions() {
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

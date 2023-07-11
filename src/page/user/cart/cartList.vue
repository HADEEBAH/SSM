<template>
 
  <v-app class="overflow-x-hidden overflaow-y-hidden">
    {{ setFunctions }}
    <v-container>
      <loading-overlay :loading="categorys_is_loading"></loading-overlay>
      <!-- <pre>{{ cart_list }}</pre> -->
      <v-row v-if="cart_list.length == 0">
        <v-col cols="12" class="text-xl font-bold text-center my-5 pink--text">
          ไม่พบข้อมูลในตะกร้า
        </v-col>
        <v-col cols="12">
          <v-img src="../../../assets/cart/noCart.png"> </v-img>
        </v-col>
      </v-row>
      <div v-else>
        <v-row class="mb-16">
          <v-col
            cols="12"
            v-for="(item, index_item) in cart_list"
            :key="`${index_item}-cart`"
          >
            <!-- <pre>{{item}}</pre> -->
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
                                {{ item.course_name_th }}({{ item.course_name_en }})
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
                                <!-- {{ item.checked }} -->
                              </v-col>
                            </v-row>
                            <v-row dense>
                              <v-col
                                cols="12"
                                sm="6"
                                class="text-md font-semibold"
                              >
                                โค้ช : {{ item.coach_name }}
                              </v-col>
                              <v-col
                                cols="12"
                                sm="6"
                                class="text-md font-semibold"
                              >
                                <!-- เวลา : {{ item.time.start }}-{{ item.time.end }} -->
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
                      <v-col align="right" cols="8"> จำนวนครั้งที่เรียน</v-col>
                      <v-col
                        align="right"
                        cols="4"
                        class="text-md font-semibold text-[#FF6B81]"
                      >
                        {{ item.option.amount }} ครั้ง</v-col
                      >
                    </v-row>
                    <v-row dense>
                      <v-col align="right" cols="8"> จำนวนนักเรียน</v-col>
                      <v-col
                        align="right"
                        cols="4"
                        class="text-md font-semibold text-[#FF6B81]"
                      >
                        {{ item.students.length }} คน</v-col
                      >
                    </v-row>
                    <v-row dense v-if="item.course_type_id === 'CT_1' ">
                      <v-col align="right" cols="8"> ส่วนลด</v-col>
                      <v-col
                        align="right"
                        cols="4"
                        class="text-md font-semibold text-[#FF6B81]"
                      >
                        {{ item.option.discount_price }} บาท</v-col
                      >
                    </v-row>
                    <v-row dense class="mb-3">
                      <v-col align="right" cols="8"> ราคาชำระ</v-col>
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
                        บาท</v-col
                      >
                    </v-row>
                    <!-- <pre>{{ item }}</pre> -->
                    <div align="right">
                      <v-btn
                        outlined
                        color="red"
                        @click="removeCart(item.order_tmp_id)"
                        ><v-icon> mdi-delete</v-icon> ลบรายการ</v-btn
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
            <v-checkbox
                hide-details
                color="pink"
                v-model="policy"
              >
              <template v-slot:label>
                ยอมรับ <a class="mx-2 font-weight-bold"> ข้อกำหนดการใช้บริการ </a> และ <a class="mx-2 font-weight-bold" >นโยบายความคุ้มครองข้อมูลส่วนบุคคล</a>
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
              label="ทั้งหมด"
              @change="selectAll($event)"
              v-model="selected_all"
            ></v-checkbox>
          </v-col>
          <v-col cols="6" sm="4">
            รวมทั้งหมด
            <b class="text-[#ff6b81]">{{ total_price.toLocaleString() }} บาท</b>
          </v-col>
          <v-col cols="6" sm="4" align="end">
            <v-btn depressed dark color="#ff6b81" @click="savePayment">
              ชำระเงิน ({{ count_selected_cart }})
            </v-btn>
          </v-col>
        </v-row>
      </div>
      <!-- <v-btn depressed dark color="#ff6b81" @click="saveCartData"> ชำระเงิน  </v-btn> -->
    </v-container>
    <v-dialog 
      v-model="policy_show" 
      v-if="policy_show" 
      persistent
      :width="$vuetify.breakpoint.smAndUp ? `60vw` : ''"
    >
      <v-card flat class="pa-2">
        <v-row dense>
          <v-col class="pa-2" align="right">
            <v-btn
              icon
              @click="policy_show = false"
            >  
              <v-icon color="red">
                mdi-close
              </v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-card-title >
          <v-row dense>
            <v-col align="center">
              policy
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text>
          <v-row dense>
            <v-col cols="12">
              <TermOfUse/>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col>
              <v-checkbox
                hide-details
                color="pink"
                v-model="policy"
              >
                <template v-slot:label>
                  ยอมรับ <a class="mx-2 font-weight-bold"> ข้อกำหนดการใช้บริการ </a> และ <a class="mx-2 font-weight-bold" >นโยบายความคุ้มครองข้อมูลส่วนบุคคล</a>
                </template>
              </v-checkbox>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-row dense>
            <v-col align="right">
              <v-btn outlined color="#ff6b81" text-color="#ff6b81" @click="closePolicy()">
                ยกเลิก
              </v-btn>
            </v-col>
            <v-col>
              <v-btn depressed dark color="#ff6b81" @click="policy_show = false">
                ตกลง
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>
<script>
import Swal from "sweetalert2";
import { mapActions, mapGetters } from "vuex";
import loadingOverlay from "../../../components/loading/loadingOverlay.vue";
import TermOfUse from '@/components/termOfUse.vue'
export default {
  components: {
    loadingOverlay,
    TermOfUse
  },
  data: () => ({
    policy: false,
    policy_show : false,
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
    // carts: {},
    total_price: 0,
    user_login: {},
  }),
  created() {},
  mounted() {
    // // console.log(this.user_login.account_id)
    // // console.log(this.carts)
    this.$store.dispatch("NavberUserModules/changeTitleNavber", "รถเข็น");
    this.user_login = JSON.parse(localStorage.getItem("userDetail"));
    // this.carts = JSON.parse(localStorage.getItem(this.user_login.account_id))
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
      // monitor
      GetAllCourseMonitor: "CourseMonitorModules/GetAllCourseMonitor",
    }),
    closePolicy(){
      this.policy = false
      this.policy_show = false
    },
    removeCart(cart_id) {
      // console.log(cart_id);
      Swal.fire({
        icon: "question",
        title: "ต้องการลบรายการนี้หรือไม่ ?",
        showDenyButton: false,
        showCancelButton: true,
        cancelButtonText: "ยกเลิก",
        confirmButtonText: "ตกลง",
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
        // console.log("index", index);

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
      // // console.log("bool", bool);
      this.cart_list.map((element) => {
        // // console.log("element", element);
        element.checked = bool;

        return element;
      });

      // console.log("result", result);

      this.sumtotal();
      // this.cart_list = result;
    },
    savePayment() {
      if(!this.policy){
        this.policy_show = true
      }else{
        if (this.cart_list.filter((v) => v.checked === true).length > 0) {
          let isValiDateCourse = [];
          this.order.courses = this.cart_list.filter((v) => v.checked === true);
          this.order.total_price = this.total_price;
          this.order.payment_status = "pending";
          this.order.created_by = this.user_login.account_id;
          this.order.type = "cart"
          this.changeOrderData(this.order);
          this.GetAllCourseMonitor().then(() => {
            // console.log("course_monitors", this.course_monitors);
            // // console.log("courses",this.order.courses)
            this.order.courses.forEach((course) => {
              // console.log("courses", course);
              if ( this.course_monitors.filter( (v) => v.courseMonitorEntity_coach_id === course.coach &&
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
                        course.students.length <= v.courseMonitorEntity_maximum_student && v.courseMonitorEntity_status === "Open"
                  )
                ) {
                  isValiDateCourse.push(true);
                } else {
                  // console.log( this.course_monitors)
                  isValiDateCourse.push(false);
                }
              } else {
                isValiDateCourse.push(true);
              }
            });
            // console.log(isValiDateCourse);
            if (isValiDateCourse.includes(false)) {
              Swal.fire({
                icon: "error",
                title: "คอร์สที่เลือกเต็มแล้วไม่สามารถชำระเงินได้",
                showDenyButton: false,
                showCancelButton: true,
                cancelButtonText: "ยกเลิก",
                confirmButtonText: "ตกลง",
              });
            } else {
              this.saveOrder().then(()=>{
                for (const cart of this.cart_list) {
                  for (const id of cart.order_tmp_id) {
                    this.DeleteCart({
                      cart_id: id,
                      account_id: this.user_login.account_id,
                    });
                  }
                }
              })
              
            }
          });
        }
      }
    },
  },

  computed: {
    ...mapGetters({
      cart_list: "OrderModules/getCartList",
      course_order: "OrderModules/getCourseOrder",
      categorys_is_loading: "CategoryModules/getCategorysIsLoading",
      course_monitors: "CourseMonitorModules/getCourseMonitor",
      order: "OrderModules/getOrder",
    }),
    setFunctions(){
      this.GetCartList(this.user_login.account_id);
      return ""
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
</style>
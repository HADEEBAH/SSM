<template>
  <v-app class="overflow-x-hidden overflow-y-hidden">
    <v-container>
      <loading-overlay :loading="categorys_is_loading"></loading-overlay>
      <v-row v-if="cart_list.length == 0">
        <v-col cols="12">
          <v-img src="../../../assets/cart/noCart.png"> </v-img>
        </v-col>
        <v-col cols="12" class="text-xl font-bold text-center my-5 pink--text">
          ไม่พบข้อมูลในตะกร้า
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
                              <v-col cols="12" sm="6" class="text-md font-semibold">
                                โค้ช : {{ item.coach_name }}
                              </v-col>
                              <v-col cols="12" sm="6" class="text-md font-semibold">
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
                    <v-row  dense v-if="item.course_type_id === 'CT_1'">
                        <v-col align="right" cols="8"> จำนวนครั้งที่เรียน</v-col>
                        <v-col align="right" cols="4" class="text-md font-semibold text-[#FF6B81]">
                        {{ item.option.amount }} ครั้ง</v-col
                        >
                    </v-row>
                    <v-row dense>
                        <v-col align="right" cols="8"> จำนวนนักเรียน</v-col>
                        <v-col align="right" cols="4" class="text-md font-semibold text-[#FF6B81]">
                          {{ item.students.length }} คน</v-col
                        >
                    </v-row>
                    <v-row dense v-if="item.course_type_id === 'CT_1'">
                      <v-col align="right" cols="8"> ส่วนลด</v-col>
                      <v-col align="right" cols="4" class="text-md font-semibold text-[#FF6B81]">
                        {{ item.option.discount_price }} บาท</v-col
                      >
                    </v-row>
                    <v-row dense class="mb-3">
                      <v-col align="right" cols="8"> ราคาชำระ</v-col>
                      <v-col align="right" cols="4" class="text-md font-semibold text-[#FF6B81]">
                        {{ item.course_type_id==="CT_1" ? item.option.net_price : item.net_price }} บาท</v-col
                      >
                    </v-row>
                    <div align="right">
                      <v-btn outlined color="red"><v-icon> mdi-delete</v-icon> ลบสินค้า</v-btn>
                    </div>
                  </v-card-text>
                </v-col>
              </v-row>
            </v-card>
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
            <b class="text-[#ff6b81]">{{ total_price }} บาท</b>
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
  </v-app>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import loadingOverlay from "../../../components/loading/loadingOverlay.vue";
export default {
  components: {
    loadingOverlay,
  },
  data: () => ({
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
    // console.log(this.user_login.account_id)
    // console.log(this.carts)
    this.$store.dispatch("NavberUserModules/changeTitleNavber", "รถเข็น");

    this.user_login = JSON.parse(localStorage.getItem("userDetail"));
    // this.carts = JSON.parse(localStorage.getItem(this.user_login.account_id))
    this.GetCartList(this.user_login.account_id);
    this.cart_list.map((val) => {
      val.checked = false;
    });
    //  this.getCourseOrder()
  },

  methods: {
    // selectAll(e) {
    //   if (e) {
    //     this.items.forEach((item) => {
    //       item.selected = true;
    //     });
    //   } else {
    //     this.items.forEach((item) => {
    //       item.selected = false;
    //     });
    //   }
    // },
    ...mapActions({
      GetCartList: "OrderModules/GetCartList",
      saveOrder: "OrderModules/saveOrder",
      changeOrderData: "OrderModules/changeOrderData",
      DeleteCart : "OrderModules/DeleteCart",
    }),

    sumtotal() {
      this.total_price = 0;
      this.count_selected_cart = this.cart_list.filter((v) => v.checked).length;
      this.cart_list.forEach((course) => {
        if (course.checked) {
          if(course.course_type_id === "CT_1"){
            this.total_price = this.total_price + course.option.net_price;
          }else{
            this.total_price = this.total_price + course.net_price;
          }
        }
      });
    },

    selectOne(bool, key) {
      let result = this.cart_list.map((element, index) => {
        console.log("index", index);

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
      // console.log("bool", bool);
      let result = this.cart_list.map((element) => {
        // console.log("element", element);
        element.checked = bool;

        return element;
      });

      console.log("result", result);

      this.sumtotal();
      // this.cart_list = result;
    },

    savePayment() {
      this.order.courses = this.cart_list;
      this.order.total_price = this.total_price;
      this.order.payment_status = "pending";
      this.order.created_by = this.user_login.account_id;
      this.changeOrderData(this.order);
      // this.saveOrder();
      for (const cart of this.cart_list) {
        console.log(cart.orders_tmp_id);
        this.DeleteCart({cart_id : cart.orders_tmp_id})
      }
      console.log("saveOrder");
    },
  },

  computed: {
    ...mapGetters({
      cart_list: "OrderModules/getCartList",
      course_order: "OrderModules/getCourseOrder",
      categorys_is_loading : "CategoryModules/getCategorysIsLoading",

      order: "OrderModules/getOrder",
    }),
    // sumtotal() {
    //   let total = this.carts.total_price;
    //   console.log("total",this.carts.total_price);
    //   this.cart_list.forEach((course) => {
    //       total = total + course.price
    //       console.log(course.price);
    //   } )

    //   return total;
    // },

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
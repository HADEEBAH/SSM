<template>
  <v-app class="overflow-x-hidden overflow-y-hidden">
    <v-container>
      <v-row v-if="cart_list.length == 0">
        <v-col cols="12">
          <v-img src="../../../assets/cart/noCart.png" >
          </v-img>
        </v-col>
        <v-col cols="12" class="text-xl font-bold text-center my-5 pink--text" >
          ไม่พบข้อมูลในตะกร้า
        </v-col>
        
      </v-row>
   
      <div v-else>
        <v-row class="mb-16" >
          <v-col
            cols="12"
            v-for="(item, index_item) in cart_list"
            :key="`${index_item}-cart`"
          >
            <!-- <pre>{{item}}</pre> -->
            <v-card class="rounded-xl mt-5">
              <v-card-text>
                <v-row dense>
                  <v-col cols="12">
                    <v-row dense>
                      <v-col cols="auto">
                        <v-img
                          class="align-end text-white rounded-xl mt-5"
                          src="@/assets/cart/cart.png"
                          cover
                          max-width="104"
                          max-height="111"
                        >
                        </v-img>
                      </v-col>
                      <v-col>
                        <v-row dense>
                          <v-col class="text-lg font-bold">
                            {{item.course_name_th}}({{ item.course_name_en}}) </v-col>
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
                            ศูนย์รวมครูสอนกีต้าร์แห่งประเทศไทยสอนโดยคุณครู ฝีมือดี
                            หลักสูตรทันสมัย หลักสูตรที่ออกแบบเพื่อนัก เรียนทุกเพศ
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-col>

                  <!-- <v-col cols="6">เวลาที่ทำรายการ</v-col>
                  <v-col cols="6" class="text-md font-semibold">
                    {{}}</v-col> -->

                  <v-col cols="6"> ราคา</v-col>
                  <v-col cols="6" class="text-md font-semibold text-[#FF6B81]">
                    {{ item.option.price_unit * item.students.length }} บาท</v-col
                  >
                  <v-col cols="6"> จำนวนครั้งที่เรียน</v-col>
                  <v-col cols="6" class="text-md font-semibold text-[#FF6B81]">
                    {{ item.option.amount}} ครั้ง</v-col
                  >

                  <!-- <v-col cols="6"> ราคา/ครั้ง</v-col>
                  <v-col cols="6" class="text-md font-semibold text-[#FF6B81]">
                    {{ item.option.net_price_unit }}</v-col
                  > -->

                  <v-col cols="6"> จำนวนนักเรียน</v-col>
                  <v-col cols="6" class="text-md font-semibold text-[#FF6B81]">
                    {{ item.students.length }} คน</v-col>

                  <v-col cols="6"> ส่วนลด</v-col>
                  <v-col cols="6" class="text-md font-semibold text-[#FF6B81]">
                    {{ item.option.discount_price }} บาท</v-col
                  >

                  <v-col cols="6"> ราคาชำระ</v-col>
                  <v-col cols="6" class="text-md font-semibold text-[#FF6B81]">
                    {{ item.option.net_price }} บาท</v-col
                  >
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- <div class="grid grid-cols-12 card-total pa-2">
          <div class="mt-2 col-span-3">
            <v-checkbox
              class="card_checkbox"
              color="error"
              hide-details
              label="ทั้งหมด"
              @change="selectAll($event)"
              v-model="selected_all"
            ></v-checkbox>
          </div>
          <div :class="MobileSize ? 'mt-2 col-span-5' : 'mt-2 col-span-5 ml-40 '">
            รวมทั้งหมด<b class="text-[#ff6b81] ml-1"
              >{{ cart_list.total_price }} บาท</b
            >
          </div>
          <div :class="MobileSize ? 'mt-2 ' : 'mt-2 ml-56 '">
            <v-btn depressed dark color="#ff6b81" @click="savePaymen"> ชำระเงิน ({{ count_selected_cart }}) </v-btn>
          </div>      
        </div> -->

      <v-row dense>
          <v-col cols="12" sm="4" >
            <v-checkbox
              class="card_checkbox"
              color="error"
              hide-details
              label="ทั้งหมด"
              @change="selectAll($event)"
              v-model="selected_all"
            ></v-checkbox>
          </v-col>
          <v-col cols="6" sm="4" >
            รวมทั้งหมด <b class="text-[#ff6b81]">{{ cart_list.total_price }} บาท</b>
          </v-col>
          <v-col cols="6" sm="4" align="end">
            <v-btn depressed dark color="#ff6b81" @click="savePaymen"> ชำระเงิน ({{ count_selected_cart }}) </v-btn>
          </v-col>
        </v-row>

  </div>
      <!-- <v-btn depressed dark color="#ff6b81" @click="saveCartData"> ชำระเงิน  </v-btn> -->
    </v-container>
  </v-app>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
export default {
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
    user_login: {}
  }),
  created() {},

  mounted() {
    // console.log(this.user_login.account_id)
    // console.log(this.carts)
    this.$store.dispatch("NavberUserModules/changeTitleNavber", "รถเข็น");

    this.user_login = JSON.parse(localStorage.getItem("userDetail"))
    // this.carts = JSON.parse(localStorage.getItem(this.user_login.account_id))
    this.GetCartList(this.user_login.account_id)
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
      GetCartList: 'OrderTestModules/GetCartList',
      saveOrder: 'OrderModules/saveOrder'
    }),
  
    sumtotal() {
      this.cart_list.total_price = 0;
      this.count_selected_cart = this.cart_list.filter((v)=>v.checked).length
      this.cart_list.forEach((course) => {
        if (course.checked) {
          this.cart_list.total_price =
            this.cart_list.total_price + course.option.net_price;
        }
      });
    },

    selectOne(bool, key) {
      // console.log("bool", bool);
      // console.log("key", key);

      let result = this.cart_list.map((element, index) => {
        // console.log("element", element);
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

      // console.log("resultAll", resultAll);

      if (resultAll.length == 0) {
        this.selected_all = true;
      }

      

      // if (!this.oneSelect.includes(courseId)) {
      //   this.oneSelect.push(courseId);
      //   console.log("cheekOne", this.oneSelect);
      // } else {
      //   this.oneSelect.splice(this.index_item, 1);
      // }
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

    savePaymen() {
      this.saveOrder()
      console.log("saveOrder");
    }
   
  },

  computed: {

    ...mapGetters({
      cart_list: "OrderTestModules/getCartList",
     course_order: "OrderModules/getCourseOrder",

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
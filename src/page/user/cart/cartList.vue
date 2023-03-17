<template>
  <v-app class="overflow-x-hidden overflow-y-hidden">
    <v-container>
      <!-- <pre>{{ carts.total_price }}</pre> -->
      <v-row class="mb-16">
        <v-col
          cols="12"
          v-for="(item, index_item) in carts.courses"
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
                        <v-col class="text-lg font-bold">{{
                          item.course_name
                        }}</v-col>
                        <v-col cols="auto">
                          <v-checkbox
                            class="card_checkbox"
                            color="error"
                            hide-details
                            @change="selectOne($event, item.course_id)"
                            v-model="item.checked"
                          >
                          </v-checkbox>
                          {{ item.checked }}
                        </v-col>
                      </v-row>
                      <v-row dense>
                        <v-col cols="12" sm="6" class="text-md font-semibold">
                          โค้ช : {{ item.coach_name }}
                        </v-col>
                        <v-col cols="12" sm="6" class="text-md font-semibold">
                          เวลา : {{ item.time.start }}-{{ item.time.end }}
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

                <v-col cols="6"> หมายเลขคำสั่งซื้อ :</v-col>
                <v-col cols="6" class="text-md font-semibold"> 147935248</v-col>

                <v-col cols="6">เวลาที่ทำรายการ</v-col>
                <v-col cols="6" class="text-md font-semibold">{{
                  `09/07/2022 15:21`
                }}</v-col>

                <v-col cols="6"> ราคา</v-col>
                <v-col cols="6" class="text-md font-semibold text-[#FF6B81]">
                  {{ item.option.total_price.toLocaleString() }}</v-col
                >
                <v-col cols="6"> จำนวนครั้งที่เรียน</v-col>
                <v-col cols="6" class="text-md font-semibold text-[#FF6B81]">
                  {{ item.option.amount.toLocaleString()
                  }}<span> ครั้ง</span></v-col
                >

                <v-col cols="6"> ราคา/ครั้ง</v-col>
                <v-col cols="6" class="text-md font-semibold text-[#FF6B81]">
                  {{ item.option.price_unit.toLocaleString() }}</v-col
                >

                <v-col cols="6"> ส่วนลด</v-col>
                <v-col cols="6" class="text-md font-semibold text-[#FF6B81]">
                  {{ item.option.discount_price.toLocaleString() }}</v-col
                >

                <v-col cols="6"> ราคาชำระ</v-col>
                <v-col cols="6" class="text-md font-semibold text-[#FF6B81]">
                  {{ item.option.net_price.toLocaleString() }}</v-col
                >
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <div class="grid grid-cols-12 card-total pa-2">
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
            >{{ carts.total_price.toLocaleString() }}บาท</b
          >
        </div>
        <div :class="MobileSize ? 'mt-2 ' : 'mt-2 ml-56 '">
          <v-btn depressed dark color="#ff6b81"> ชำระเงิน ({{ count_selected_cart }}) </v-btn>
        </div>
      </div>
    </v-container>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    search: "",
    drawer: true,
    // carts:{ "order_step": 1,  "order_number": "", "courses": [ { "kingdom": "เปียนโนสุดหรรษา", "course_type": "คอร์สทั่วไป", "course_type_id": "CT_1", "package": "Exclusive Package", "package_data": { "package_id": "PACK_1", "package": "Exclusive Package", "students": 1, "options": [ { "package_id": "PACK_1", "option_id": "OP_2", "period_package": "รายเดือน", "amount": 4, "price_unit": 1800, "discount": false, "discount_price": 100, "privilege": "", "total_price": 7200, "net_price": 7100, "net_price_unit": 1775 }, { "package_id": "PACK_1", "option_id": "OP_1", "period_package": "รายวัน", "amount": 1, "price_unit": 500, "discount": true, "discount_price": 0, "privilege": "", "total_price": 500, "net_price": 500, "net_price_unit": 500 } ] }, "option": { "package_id": "PACK_1", "option_id": "OP_2", "period_package": "รายเดือน", "amount": 4, "price_unit": 1800, "discount": false, "discount_price": 100, "privilege": "", "total_price": 7200, "net_price": 7100, "net_price_unit": 1775 }, "option_data": "", "period": 1, "times_in_class": 0, "day": { "course_coach_id": [ "328e3dde-2ee6-488e-83b1-7d397a46e797" ], "day": "0", "times": [ { "start": "17:00", "end": "18:00", "maximumStudent": 10, "dayOfWeekId": "03f3eb4c-05f6-43a1-ba8f-3558a3a4f2ac", "timeId": "07e02360-a952-4c10-b32f-c12781ed503e" }, { "start": "16:00", "end": "17:00", "maximumStudent": 10, "dayOfWeekId": "03f3eb4c-05f6-43a1-ba8f-3558a3a4f2ac", "timeId": "8414d7d0-f418-4a6d-aba3-3731137af8a4" } ] }, "time": { "start": "17:00", "end": "18:00", "maximumStudent": 10, "dayOfWeekId": "03f3eb4c-05f6-43a1-ba8f-3558a3a4f2ac", "timeId": "07e02360-a952-4c10-b32f-c12781ed503e" }, "coach": "328e3dde-2ee6-488e-83b1-7d397a46e797", "start_day": "", "price": 7200, "detail": "", "remark": "", "parents": [], "students": [ { "account_id": "00001", "student_name": "Test Test 01", "username": "surahet", "firstname": "Test", "lastname": "Test 01", "tel": "0821241243", "parents": [], "is_account": false, "is_other": false } ], "category_id": "c13589d1-a78f-496e-9ac3-91cc36388427", "course_name": "ไวโอลีน(Violin)", "time_count": 4 }, { "kingdom": "เปียนโนสุดหรรษา", "course_type": "คอร์สทั่วไป", "course_type_id": "CT_1", "package": "Exclusive Package", "package_data": { "package_id": "PACK_1", "package": "Exclusive Package", "students": 1, "options": [ { "package_id": "PACK_1", "option_id": "OP_2", "period_package": "รายเดือน", "amount": 4, "price_unit": 1800, "discount": false, "discount_price": 100, "privilege": "", "total_price": 7200, "net_price": 7100, "net_price_unit": 1775 }, { "package_id": "PACK_1", "option_id": "OP_1", "period_package": "รายวัน", "amount": 1, "price_unit": 500, "discount": true, "discount_price": 0, "privilege": "", "total_price": 500, "net_price": 500, "net_price_unit": 500 } ] }, "option": { "package_id": "PACK_1", "option_id": "OP_2", "period_package": "รายเดือน", "amount": 4, "price_unit": 1800, "discount": false, "discount_price": 100, "privilege": "", "total_price": 7200, "net_price": 7100, "net_price_unit": 1775 }, "option_data": "", "period": 1, "times_in_class": 0, "day": { "course_coach_id": [ "328e3dde-2ee6-488e-83b1-7d397a46e797" ], "day": "0", "times": [ { "start": "17:00", "end": "18:00", "maximumStudent": 10, "dayOfWeekId": "03f3eb4c-05f6-43a1-ba8f-3558a3a4f2ac", "timeId": "07e02360-a952-4c10-b32f-c12781ed503e" }, { "start": "16:00", "end": "17:00", "maximumStudent": 10, "dayOfWeekId": "03f3eb4c-05f6-43a1-ba8f-3558a3a4f2ac", "timeId": "8414d7d0-f418-4a6d-aba3-3731137af8a4" } ] }, "time": { "start": "17:00", "end": "18:00", "maximumStudent": 10, "dayOfWeekId": "03f3eb4c-05f6-43a1-ba8f-3558a3a4f2ac", "timeId": "07e02360-a952-4c10-b32f-c12781ed503e" }, "coach": "328e3dde-2ee6-488e-83b1-7d397a46e797", "start_day": "", "price": 7200, "detail": "", "remark": "", "parents": [], "students": [ { "account_id": "00001", "student_name": "Test Test 01", "username": "surahet", "firstname": "Test", "lastname": "Test 01", "tel": "0821241243", "parents": [], "is_account": false, "is_other": false } ], "category_id": "c13589d1-a78f-496e-9ac3-91cc36388427", "course_id": "a37de582-501e-4a70-a4df-1d9e395871bf", "course_name": "ไวโอลีน(Violin)", "time_count": 4 } ], "created_by": "00001", "payment_status": "", "payment_type": "", "total_price": 0, "selected": false  },
    carts: {
      order_step: 1,
      order_number: "",
      courses: [
        {
          kingdom: "เปียนโนสุดหรรษา",
          course_type: "คอร์สทั่วไป",
          course_type_id: "CT_1",
          package: "Exclusive Package",
          package_data: {
            package_id: "PACK_1",
            package: "Exclusive Package",
            students: 1,
            options: [
              {
                course_package_option_id:
                  "2a90df52-4779-45bd-9ca6-adcba46bb5e1",
                package_id: "PACK_1",
                option_id: "OP_2",
                period_package: "รายเดือน",
                amount: 4,
                price_unit: 1800,
                discount: true,
                discount_price: 100,
                privilege: "",
                total_price: 7200,
                net_price: 7100,
                net_price_unit: 1775,
              },
              {
                course_package_option_id:
                  "57824019-de18-433f-badd-2ce4fc8ccf1f",
                package_id: "PACK_1",
                option_id: "OP_1",
                period_package: "รายวัน",
                amount: 1,
                price_unit: 500,
                discount: false,
                discount_price: 0,
                privilege: "",
                total_price: 500,
                net_price: 500,
                net_price_unit: 500,
              },
            ],
          },
          option: {
            course_package_option_id: "2a90df52-4779-45bd-9ca6-adcba46bb5e1",
            package_id: "PACK_1",
            option_id: "OP_2",
            period_package: "รายเดือน",
            amount: 4,
            price_unit: 1800,
            discount: true,
            discount_price: 100,
            privilege: "",
            total_price: 7200,
            net_price: 7100,
            net_price_unit: 1775,
          },
          option_data: "",
          period: 1,
          times_in_class: 0,
          day: {
            course_coach_id: ["328e3dde-2ee6-488e-83b1-7d397a46e797"],
            day: "0",
            times: [
              {
                start: "17:00",
                end: "18:00",
                maximumStudent: 10,
                dayOfWeekId: "03f3eb4c-05f6-43a1-ba8f-3558a3a4f2ac",
                timeId: "07e02360-a952-4c10-b32f-c12781ed503e",
              },
              {
                start: "16:00",
                end: "17:00",
                maximumStudent: 10,
                dayOfWeekId: "03f3eb4c-05f6-43a1-ba8f-3558a3a4f2ac",
                timeId: "8414d7d0-f418-4a6d-aba3-3731137af8a4",
              },
            ],
          },
          time: {
            start: "17:00",
            end: "18:00",
            maximumStudent: 10,
            dayOfWeekId: "03f3eb4c-05f6-43a1-ba8f-3558a3a4f2ac",
            timeId: "07e02360-a952-4c10-b32f-c12781ed503e",
          },
          coach: "328e3dde-2ee6-488e-83b1-7d397a46e797",
          start_day: "",
          price: 7200,
          detail: "",
          remark: "",
          parents: [],
          students: [
            {
              account_id: "00001",
              student_name: "Test Test 01",
              username: "surahet",
              firstname: "Test",
              lastname: "Test 01",
              tel: "0821241243",
              parents: [],
              is_account: false,
              is_other: false,
            },
          ],
          category_id: "c13589d1-a78f-496e-9ac3-91cc36388427",
          course_id: "a37de582-501e-4a70-a4df-1d9e395871bf",
          course_name: "ไวโอลีน(Violin)",
          time_count: 4,
          coach_name: "จิรายุทธ ช่างเรือ",
          coach_id: "1335419642465165",
        },
        {
          kingdom: "เปียนโนสุดหรรษา",
          course_type: "คอร์สทั่วไป",
          course_type_id: "CT_1",
          package: "Exclusive Package",
          package_data: {
            package_id: "PACK_1",
            package: "Exclusive Package",
            students: 1,
            options: [
              {
                course_package_option_id:
                  "2a90df52-4779-45bd-9ca6-adcba46bb5e1",
                package_id: "PACK_1",
                option_id: "OP_2",
                period_package: "รายเดือน",
                amount: 4,
                price_unit: 1800,
                discount: true,
                discount_price: 100,
                privilege: "",
                total_price: 7200,
                net_price: 7100,
                net_price_unit: 1775,
              },
              {
                course_package_option_id:
                  "57824019-de18-433f-badd-2ce4fc8ccf1f",
                package_id: "PACK_1",
                option_id: "OP_1",
                period_package: "รายวัน",
                amount: 1,
                price_unit: 500,
                discount: false,
                discount_price: 0,
                privilege: "",
                total_price: 500,
                net_price: 500,
                net_price_unit: 500,
              },
            ],
          },
          option: {
            course_package_option_id: "2a90df52-4779-45bd-9ca6-adcba46bb5e1",
            package_id: "PACK_1",
            option_id: "OP_2",
            period_package: "รายเดือน",
            amount: 4,
            price_unit: 1800,
            discount: true,
            discount_price: 100,
            privilege: "",
            total_price: 7200,
            net_price: 7100,
            net_price_unit: 1775,
          },
          option_data: "",
          period: 1,
          times_in_class: 0,
          day: {
            course_coach_id: ["328e3dde-2ee6-488e-83b1-7d397a46e797"],
            day: "0",
            times: [
              {
                start: "17:00",
                end: "18:00",
                maximumStudent: 10,
                dayOfWeekId: "03f3eb4c-05f6-43a1-ba8f-3558a3a4f2ac",
                timeId: "07e02360-a952-4c10-b32f-c12781ed503e",
              },
              {
                start: "16:00",
                end: "17:00",
                maximumStudent: 10,
                dayOfWeekId: "03f3eb4c-05f6-43a1-ba8f-3558a3a4f2ac",
                timeId: "8414d7d0-f418-4a6d-aba3-3731137af8a4",
              },
            ],
          },
          time: {
            start: "17:00",
            end: "18:00",
            maximumStudent: 10,
            dayOfWeekId: "03f3eb4c-05f6-43a1-ba8f-3558a3a4f2ac",
            timeId: "07e02360-a952-4c10-b32f-c12781ed503e",
          },
          coach: "328e3dde-2ee6-488e-83b1-7d397a46e797",
          start_day: "",
          price: 7200,
          detail: "",
          remark: "",
          parents: [],
          students: [
            {
              account_id: "00001",
              student_name: "Test Test 01",
              username: "surahet",
              firstname: "Test",
              lastname: "Test 01",
              tel: "0821241243",
              parents: [],
              is_account: false,
              is_other: false,
            },
          ],
          category_id: "c13589d1-a78f-496e-9ac3-91cc36388427",
          course_id: "a37de582-501e-4a70-a4df-1d9e395871bf",
          course_name: "ไวโอลีน(Violin)",
          time_count: 4,
          coach_name: "จิรายุทธ ช่างเรือ",
          coach_id: "1335419642465165",
        },
      ],
      created_by: "00001",
      payment_status: "",
      payment_type: "",
      total_price: 0,
    },

    selected: [],
    allSelected: false,
    userIds: [],
    oneSelect: [],
    selectedCourse: [],
    selected_all: false,
    count_selected_cart: 0
  }),
  created() {
    // console.log("selectedCourse", this.selectedCourse)
    this.carts.courses.map((val) => {
      val.checked = false;
    });
  },

  mounted() {
    this.user_login = JSON.parse(localStorage.getItem("userDetail"))
    this.cart = JSON.parse(localStorage.getItem(this.user_login.account_id))
    this.$store.dispatch("NavberUserModules/changeTitleNavber", "รถเข็น");
    this.user_login = JSON.parse(localStorage.getItem("userDetail"))
    this.cart = JSON.parse(localStorage.getItem(this.user_login.account_id))
    console.log(this.user_login);
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

    sumtotal() {
      this.carts.total_price = 0;
      this.count_selected_cart = this.carts.courses.filter((v)=>v.checked).length
      this.carts.courses.forEach((course) => {
        console.log("course.checked", course.checked);
        if (course.checked) {
          this.carts.total_price =
            this.carts.total_price + course.option.net_price;
        }
      });
    },

    selectOne(bool, key) {
      console.log("bool", bool);
      console.log("key", key);

      let result = this.carts.courses.map((element, index) => {
        console.log("element", element);
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

      console.log("resultAll", resultAll);

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
      console.log("bool", bool);
      let result = this.carts.courses.map((element) => {
        console.log("element", element);
        element.checked = bool;

        return element;
      });

      console.log("result", result);

      this.sumtotal();
      this.carts.courses = result;
     
    },
  },

  computed: {
    // sumtotal() {
    //   let total = this.carts.total_price;
    //   console.log("total",this.carts.total_price);
    //   this.carts.courses.forEach((course) => {
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
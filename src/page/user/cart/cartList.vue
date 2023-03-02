<template>
  <v-app class="overflow-x-hidden overflow-y-hidden">
    <v-container>
      <v-row class="mb-16">
        <v-col cols="12" v-for="item in items" :key="item.id">
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
                        <v-col class="text-lg font-bold">{{item.name}}</v-col>
                        <v-col cols="auto">
                          <v-checkbox
                            class="card_checkbox"
                            color="error"
                            hide-details
                            v-model="item.selected"
                          >
                          </v-checkbox>
                        </v-col>
                      </v-row>
                      <v-row dense>
                        <v-col cols="12" sm="6" class="text-md font-semibold">
                          โค้ช : อัครพงศ์ เวชสุวรรณ
                        </v-col>
                        <v-col cols="12" sm="6" class="text-md font-semibold">
                          เวลา : 13.00-14.00
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

                <v-col cols="6"> ราคาชำระ</v-col>
                <v-col cols="6" class="text-md font-semibold text-[#FF6B81]">{{
                  item.price
                }}</v-col>
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
            value="error"
            hide-details
            label="ทั้งหมด"
            @change="selectAll($event)"
          ></v-checkbox>
        </div>
        <div :class="MobileSize ? 'mt-2 col-span-5' : 'mt-2 col-span-5 ml-40 '">
          รวมทั้งหมด<b class="text-[#ff6b81] ml-1">{{ sumtotal.toLocaleString() }}บาท</b>
        </div>
        <div :class="MobileSize ? 'mt-2 ' : 'mt-2 ml-56 '">
          <v-btn depressed dark color="#ff6b81"> ชำระเงิน (2) </v-btn>
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
    items: [
      { id: 1, name: "A", selected: false, price: 500 },
      { id: 2, name: "B", selected: false, price: 500 },
      { id: 3, name: "C", selected: false, price: 500 },
      { id: 4, name: "D", selected: false, price: 500 },
      { id: 5, name: "E", selected: false, price: 500 },
      { id: 6, name: "F", selected: false, price: 500 },
      { id: 7, name: "G", selected: false, price: 500 },
      { id: 8, name: "H", selected: false, price: 500 },
      { id: 9, name: "I", selected: false, price: 500 },
    ],
    selected: [],
    allSelected: false,
    userIds: [],
 
  }),

  mounted() {
    this.$store.dispatch("NavberUserModules/changeTitleNavber", "รถเข็น");
  },

  methods: {
    selectAll(e) {
      if (e) {
        this.items.forEach((item) => {
          item.selected = true;
        });
      } else {
        this.items.forEach((item) => {
          item.selected = false;
        });
      }
    },
  },

  computed: {
    sumtotal() {
      let total = 0;
      this.items
        .filter((v) => (v.selected === true))
        .forEach((item) => {
          total = total + item.price;
        });

      return total;
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
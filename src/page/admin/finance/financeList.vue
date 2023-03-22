<template>
    <v-app> 
      <v-container>
        <headerPage title="การเงิน"></headerPage>
        <v-row dense class="mb-3">
          <v-col>
            <v-text-field hide-details dense prepend-inner-icon="mdi-magnify" outlined placeholder="ค้นหาหมายเลขใบสั่งซื้อ, ชื่อผู้เรียน, ชื่อคอร์ส"></v-text-field>
          </v-col>
        </v-row>
        <v-row dense class="mb-3">
          <v-col cols="12" sm="4"  @click="tab = 'all'" >
            <img-card title="ทั้งหมด" class="cursor-pointer" :class="tab === 'all' ? 'img-card-active':''" count="5" units="รายการ">
              <template v-slot:img>
                <v-img max-height="90" max-width="70" src="../../../assets/course/all_course.png"></v-img>
              </template>
              <template v-slot:header>
                  <div class="font-bold"> คอร์สทั่วไป </div>
              </template>
              <template v-slot:detail>
                  <v-row class="d-flex align-end">
                      <v-col align="center" class="text-3xl font-bold">5</v-col>
                      <v-col class="text-sm">รายการ</v-col>
                  </v-row>
              </template>
            </img-card>
          </v-col>
          <v-col cols="12" sm="4"  @click="tab = 'paid'" >
            <img-card class="cursor-pointer" :class="tab === 'paid' ? 'img-card-active':''" >
              <template v-slot:img>
                <v-img max-height="90" max-width="70" src="../../../assets/course/file_money.png"></v-img>
              </template>
              <template v-slot:header>
                  <div class="font-bold"> ชำระแล้ว </div>
              </template>
              <template v-slot:detail>
                  <v-row class="d-flex align-end">
                      <v-col align="center" class="text-3xl font-bold">5</v-col>
                      <v-col class="text-sm">รายการ</v-col>
                  </v-row>
              </template>
            </img-card>
          </v-col>
          <v-col cols="12" sm="4"  @click="tab = 'pending'" >
            <img-card  class="cursor-pointer" :class="tab === 'pending' ? 'img-card-active':''">
              <template v-slot:img>
                <v-img max-height="90" max-width="70" src="../../../assets/course/short_course.png"></v-img>
              </template>
              <template v-slot:header>
                  <div class="font-bold"> รอดำเนินการ </div>
              </template>
              <template v-slot:detail>
                  <v-row class="d-flex align-end">
                      <v-col align="center" class="text-3xl font-bold">1</v-col>
                      <v-col class="text-sm">รายการ</v-col>
                  </v-row>
              </template>
            </img-card>
          </v-col>
        </v-row>
        <!-- <pre>{{ orders }}</pre> -->
        <v-data-table
          class="elevation-1 header-table"
          :headers="columns"
          :items="orders"
          :items-per-page="5"
        >
          <template v-slot:[`item.orderNumber`] ="{ item }">
            <span class="font-semibold">{{ item.orderNumber }}</span>  
          </template>
          <template v-slot:[`item.course`] ="{ item }">
            <span class="font-semibold">{{ item.course }}</span>  
          </template>
          <template v-slot:[`item.totalPrice`] ="{ item }">
            <span class="font-semibold">{{ item.totalPrice ? genPrice(item.totalPrice) : '-' }}</span>  
          </template>
          <template v-slot:[`item.paymentStatus`] ="{ item }">
            <div class="d-flex align-center pa-1 rounded-lg" 
            :class="item.paymentStatus === 'pending' ? 'bg-[#FFF9E8] text-[#FCC419]' : item.paymentStatus === 'success' ? 'bg-[#F0F9EE] text-[#58A144]' : 'bg-[#ffeeee] text-[#f00808]'">
              <span class="w-full text-center">{{ item.paymentStatus == 'pending' ? 'รอดำเนินการ' : item.paymentStatus === "success" ? "สำเร็จ": "ยกเลิก"   }}</span>
            </div>
          </template>
          <template v-slot:[`item.actions`] ="{item}">
            <v-btn text class="underline" color="#FF6B81" @click="$router.push({name:'Finance_orderID', params:{order_id : item.orderId}})">เพิ่มเติม</v-btn>
          </template>
        </v-data-table>
      </v-container>
    </v-app>
</template>
<script>
import imgCard from '@/components/course/imgCard.vue';
import headerPage from '@/components/header/headerPage.vue';
import { mapActions, mapGetters } from 'vuex';
export default {
  name: "financeList",
  components:{
    headerPage,
    imgCard
  },
  data: () => ({
    tab : "all",
    items: ["ทั้งหมด", "ชำระเงินแล้ว", "รอดำเนินการ"],
    columns:[
      {text: 'หมายเลขคำสั่งซื้อ',align: 'start',sortable: false, value: 'orderNumber',width: 150},
      {text: 'ชื่อผู้เรียน',align: 'start',sortable: false, value: 'student_name'},
      {text: 'ชื่อคอร์ส',align: 'start',sortable: false, value: 'course'},
      {text: 'ราคา',align: 'start',sortable: false, value: 'totalPrice'},
      {text: 'สถานะการชำระ',align: 'center',sortable: false, value: 'paymentStatus'},
      {text: 'วันที่ชำระ',align: 'start',sortable: false, value: 'paid_date'},
      { text: '', align: 'center', value: 'actions', sortable: false },
    ],
    // orders : [
    //   {order_id: "00000001", student_name: ["กมลรัตน์ สิทธิกรชัย", "ออกัส สิงหาคม"], course: "เปียโนสากล (Family)", price: 2000, status:'ชำระเงินแล้ว', paid_date: "22/07/2022" },
    //   {order_id: "00000222", student_name: ["น่านฟ้า ทะเลไกล"], course: "ไวโอลินเบื้องต้น (Exclusive)", price: 2000, status:'รอดำเนินการ', paid_date: ""},
    //   {order_id: "00000333", student_name: ["ออกัส สิงหาคม"], course: "ไวโอลินเบื้องต้น (Exclusive)ไวโอลินเวิร์คช้อป", price: 1000, status:'ชำระเงินแล้ว', paid_date: "22/07/2022"},
    //   {order_id: "00000004", student_name: ["วรวุฒิ สาระวงศ์"], course: "เปียโนสากล (Exclusive)", price: 2000, status:'รอดำเนินการ', paid_date: ""},
    // ]
  }),
  created() {},
  mounted() {
    this.GetOrders()
  },
  methods: {
    ...mapActions({
      GetOrders : "OrderModules/GetOrders"
    }),
    genPrice(price){
      return price.toLocaleString() 
    }
  },
  computed: {
    ...mapGetters({
      orders : "OrderModules/getOrders"
    })
  },
  watch: {},
};
</script>
<style>

</style>
<template>
    <v-app> 
      <v-container>
        <headerPage title="การเงิน"></headerPage>
        <v-row>
          <v-col>
            <v-text-field dense prepend-inner-icon="mdi-magnify" outlined placeholder="ค้นหาหมายเลขใบสั่งซื้อ, ชื่อผู้เรียน, ชื่อคอร์ส"></v-text-field>
          </v-col>
        </v-row>
        <v-card>
          <v-tabs
            v-model="tab"
            align-with-title
          >
            <v-tabs-slider color="green"></v-tabs-slider>
            <v-tab
              v-for="(item, item_index) in items"
              :key="item"
            >
              <span :class="tab === item_index ?'green--text' : ''">{{ `${item}(${item === 'ทั้งหมด' ? orders.length : item === 'ชำระเงินแล้ว' ? orders.filter(v => v.status === 'ชำระเงินแล้ว').length : orders.filter(v => v.status === 'รอดำเนินการ').length })` }}</span>
            </v-tab>
          </v-tabs>
          <v-tabs-items v-model="tab">
            <v-tab-item
              v-for="item in items"
              :key="item"
            >
              <v-data-table
                :headers="columns"
                :items="orders"
                :items-per-page="5"
              >
                <template v-slot:[`item.order_id`] ="{ item }">
                  <span class="font-semibold">{{ item.order_id }}</span>  
                </template>
                <template v-slot:[`item.course`] ="{ item }">
                  <span class="font-semibold">{{ item.course }}</span>  
                </template>
                <template v-slot:[`item.price`] ="{ item }">
                  <span class="font-semibold">{{ item.price.toLocaleString() }}</span>  
                </template>
                <template v-slot:[`item.status`] ="{ item }">
                  <v-chip
                    dark
                    label
                    outlined
                    :color="item.status === 'รอดำเนินการ' ? '#EE9B00' : '#53B536' "
                  >
                    {{ item.status }}
                  </v-chip>
                </template>
                <template v-slot:[`item.actions`] ="{item}">
                  <v-btn text class="underline" color="#2F55A4" @click="$router.push({name:'Finance_orderID', params:{order_id : item.order_id}})">เพิ่มเติม</v-btn>
                </template>
              </v-data-table>
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </v-container>
    </v-app>
</template>
<script>
import headerPage from '@/components/header/headerPage.vue';
export default {
  name: "financeList",
  components:{
    headerPage,
  },
  data: () => ({
    tab : null,
    items: ["ทั้งหมด", "ชำระเงินแล้ว", "รอดำเนินการ"],
    columns:[
      {text: 'หมายเลขคำสั่งซื้อ',align: 'start',sortable: false, value: 'order_id'},
      {text: 'ชื่อผู้เรียน',align: 'start',sortable: false, value: 'student_name'},
      {text: 'ชื่อคอร์ส',align: 'start',sortable: false, value: 'course'},
      {text: 'ราคา',align: 'start',sortable: false, value: 'price'},
      {text: 'สถานะการชำระ',align: 'center',sortable: false, value: 'status'},
      {text: 'วันที่ชำระ',align: 'start',sortable: false, value: 'paid_date'},
      { text: '', align: 'center', value: 'actions', sortable: false },
    ],
    orders : [
      {order_id: "00000001", student_name: ["กมลรัตน์ สิทธิกรชัย", "ออกัส สิงหาคม"], course: "เปียโนสากล (Family)", price: 2000, status:'ชำระเงินแล้ว', paid_date: "22/07/2022" },
      {order_id: "00000222", student_name: ["น่านฟ้า ทะเลไกล"], course: "ไวโอลินเบื้องต้น (Exclusive)", price: 2000, status:'รอดำเนินการ', paid_date: ""},
      {order_id: "00000333", student_name: ["ออกัส สิงหาคม"], course: "ไวโอลินเบื้องต้น (Exclusive)ไวโอลินเวิร์คช้อป", price: 1000, status:'ชำระเงินแล้ว', paid_date: "22/07/2022"},
      {order_id: "00000004", student_name: ["วรวุฒิ สาระวงศ์"], course: "เปียโนสากล (Exclusive)", price: 2000, status:'รอดำเนินการ', paid_date: ""},
    ]
  }),
  created() {},
  mounted() {},
  methods: {},
  computed: {},
  watch: {},
};
</script>
<style>

</style>
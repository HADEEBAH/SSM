<template>
  <v-app>
    <v-container>
      <headerPage :breadcrumbs="breadcrumbs"></headerPage>
      <!-- <pre>{{ order_detail }}</pre> -->
      <v-card class="mb-3">
        <v-card-text>
          <v-row>
            <v-col>
              <rowData icon="mdi-notebook-outline" title="หมายเลขคำสั่งซื้อ"
                >: {{ `${$route.params.order_id}` }}</rowData
              >
              <rowData icon="mdi-rename-box-outline" title="ชื่อผู้เรียน"
                >: {{order_detail.student_name_list}}</rowData
              >
            </v-col>
            <v-col cols="12" sm="auto">
              <v-chip
                label
                :color="order_detail.paymentStatus === 'pending'
                ? '#FFF9E8'
                : order_detail.paymentStatus === 'success'
                ? '#F0F9EE'
                : '#ffeeee'"
                :text-color=" order_detail.paymentStatus === 'pending'
                ? '#FCC419'
                : order_detail.paymentStatus === 'success'
                ? '#58A144'
                : '#f00808'"
              >
                {{ order_detail.paymentStatus == "pending"
                ? "รอดำเนินการ"
                : order_detail.paymentStatus === "success"
                ? "สำเร็จ"
                : "ยกเลิก" }}
              </v-chip>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <v-row>
        <v-col cols="12" sm="7">
          <v-card>
            <v-card-text>
              <v-card class="mb-3" v-for="(data, index) in order_detail.orderItem" :key="index">
                <v-card-title class="bg-[#FEFAFD]">
                  <v-img
                    class="headder-card-img pl-3"
                    v-if="data.course.courseTypeId === 'CT_1'"
                    max-height="36.38px"
                    max-width="176px"
                    src="../../../assets/finance/Vector.png"
                  >
                    <span class="font-bold text-base">คอร์สทั่วไป</span>
                  </v-img>
                  <v-img
                    class="headder-card-img pl-3"
                    v-if="data.course.courseTypeId === 'CT_2'"
                    max-height="36.38px"
                    max-width="176px"
                    src="../../../assets/finance/Vector (1).png"
                  >
                    <span class="font-bold text-base">คอร์สระยะสั้น</span>
                  </v-img>
                </v-card-title>
                <v-card-text class="bg-[#FEFAFD]">
                  <v-row>
                    <v-col>
                      <rowData
                        col_header="12"
                        col_detail="12"
                        title="คอร์สเรียน"
                      > {{ `${data.course.courseNameTh}(${data.course.courseNameEn})` }}</rowData >
                    </v-col>
                    <v-col>
                      <rowData col_header="12" col_detail="12" title="อาณาจักร">
                        {{ data.course.categoryNameTh }}</rowData
                      >
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <rowData col_header="12" col_detail="12" title="โค้ช">
                        {{ data.coachName }}</rowData
                      >
                    </v-col>
                    <v-col>
                      <rowData
                        col_header="12"
                        col_detail="12"
                        title="วันที่เริ่ม"
                      >
                        {{ new Date(data.startDate).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric', }) }}</rowData
                      >
                    </v-col>
                  </v-row>
                  <template v-if="data.course.courseTypeId === 'CT_1'">
                    <v-row>
                      <v-col>
                        <rowData
                          col_header="12"
                          col_detail="12"
                          title="แพ็คเกจ"
                        >
                          {{ data.cpo.packageName }}</rowData
                        >
                      </v-col>
                      <v-col>
                        <rowData
                          col_header="12"
                          col_detail="12"
                          title="ระยะเวลา"
                        >
                          {{ data.cpo.optionName }}</rowData
                        >
                      </v-col>
                    </v-row>
                  </template>
                    <v-row>
                      <v-col>
                        <rowData
                          col_header="12"
                          col_detail="12"
                          title="วัน - เวลา"
                        >
                        {{ `${dayOfWeekArray(data.course.dayOfWeekName)} (${data.course.start} - ${data.course.end})` }}</rowData
                        >
                      </v-col>
                      <v-col>
                        <rowData col_header="12" col_detail="12" title="ราคา">
                          {{ parseInt(data.price).toLocaleString() }} บาท</rowData
                        >
                      </v-col>
                    </v-row>
                </v-card-text>
              </v-card>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="5">
          <v-card>
            <v-card-text>
              <v-card class="mb-3">
                <v-card-text class="bg-[#FFF5F6]">
                  <rowData col_header="4" col_detail="8" title="ราคารวม"
                    >:
                    <span class="w-full font-bold">{{
                      order_detail.totalPrice.toLocaleString()
                    }}</span>
                    บาท
                  </rowData>
                  <!-- <rowData col_header="5" col_detail="7" title="หมายเหตุ"
                    >: {{ payment.remark ? payment.remark : "-" }}</rowData
                  > -->
                  <rowData v-if="order_detail.payment" col_header="4" col_detail="8" title="วันที่ชำระ"
                    >: {{order_detail.payment.paid_date ? order_detail.payment.paid_date : "-" }}</rowData
                  >
                </v-card-text>
              </v-card>
              <template v-if="order_detail.paymentStatus === 'success'">
                <div class="font-bold">วิธีการชำระเงิน</div>
                <v-card v-for="(status, index) in payment_status.filter(
                    (v) => v.value === order_detail.paymentType
                  )"
                  :key="index"
                  class="cursor-pointer mb-3"
                  @click="chengeStatus(status)"
                >
                
                  <v-card-actions>
                    <v-row class="d-flex align-center">
                      <v-col cols="auto"
                        ><v-icon
                          :color="
                            order_detail.paymentType === status.value
                              ? '#FF6B81'
                              : ''
                          "
                          >{{
                            order_detail.paymentType === status.value
                              ? "mdi-radiobox-marked"
                              : "mdi-radiobox-blank"
                          }}</v-icon
                        ></v-col
                      >
                      <v-col cols="auto">
                        <v-avatar>
                          <v-img
                            v-if="status.value === 'unpaid'"
                            src="../../../assets/finance/close.png"
                          ></v-img>
                          <v-img
                            v-if="status.value === 'credit card' || status.value == 'Credit Card'"
                            src="../../../assets/finance/card.png"
                          ></v-img>
                          <v-img
                            v-if="status.value === 'transfer'"
                            src="../../../assets/finance/mobile_cash.png"
                          ></v-img>
                          <v-img
                            v-if="status.value === 'cash'"
                            src="../../../assets/finance/cash.png"
                          ></v-img>
                        </v-avatar>
                      </v-col>
                      <v-col>
                        {{ status.text }}
                      </v-col>
                    </v-row>
                  </v-card-actions>
                </v-card>
              </template>
              <template v-else-if="order_detail.paymentStatus !== 'cancel'">
                <div class="font-bold mb-3">เลือกวิธีการชำระเงิน</div>
                <v-card
                  v-for="(status, index) in payment_status"
                  :key="index"
                  class="cursor-pointer mb-3"
                  @click="chengeStatus(status)"
                >
                  <v-card-actions>
                    <v-row class="d-flex align-center">
                      <v-col cols="auto"
                        ><v-icon
                          :color="
                            order_detail.paymentType.toLowerCase() === status.value
                              ? '#FF6B81'
                              : ''
                          "
                          >{{
                            order_detail.paymentType.toLowerCase() === status.value
                              ? "mdi-radiobox-marked"
                              : "mdi-radiobox-blank"
                          }}</v-icon
                        ></v-col
                      >
                      <v-col cols="auto">
                        <v-avatar>
                          <v-img
                            v-if="status.value === 'unpaid'"
                            src="../../../assets/finance/close.png"
                          ></v-img>
                          <v-img
                            v-if="status.value === 'credit card'"
                            src="../../../assets/finance/card.png"
                          ></v-img>
                          <v-img
                            v-if="status.value === 'transfer'"
                            src="../../../assets/finance/mobile_cash.png"
                          ></v-img>
                          <v-img
                            v-if="status.value === 'cash'"
                            src="../../../assets/finance/cash.png"
                          ></v-img>
                        </v-avatar>
                      </v-col>
                      <v-col>
                        {{ status.text }}
                      </v-col>
                    </v-row>
                  </v-card-actions>
                </v-card>
              </template>
            </v-card-text>
            <v-card-actions>
            <v-btn
                v-if="order_detail.paymentStatus === 'success'"
                class="w-full"
                color="#ff6b81"
                dark
                >ออกใบเสร็จฉบับเต็ม</v-btn
              >
              <v-row dense v-else>
                <v-col cols="12">
                  <v-btn
                    v-if="order_detail.paymentType === '' || order_detail.paymentType==='unpaid' "
                    class="w-full"
                    color="#ff6b81"
                    dark
                    >ส่งการแจ้งเตือน</v-btn
                  >
                  <v-btn
                    v-if="order_detail.paymentType !== '' && order_detail.paymentType !== 'unpaid' && order_detail.paymentStatus !== 'cancel'"
                    depressed
                    class="w-full"
                    color="#ff6b81"
                    :disabled="order_detail.paymentStatus == 'cancel'"
                    dark
                    @click="confirmPayment()"
                    >ยืนยันการชำระ</v-btn>
                </v-col>
                <v-col cols="12">
                  <v-btn 
                  class="w-full" 
                  text 
                  :disabled="order_detail.paymentStatus == 'cancel'"
                  color="#ff6b81" 
                  :dark="!order_detail.paymentStatus == 'cancel'"
                  @click="cancelOrder()"
                    >ยกเลิกการซื้อคอร์ส</v-btn
                  >
                </v-col>
              </v-row>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <!-- DIALOG -->
      <!-- <v-dialog class="pa-2" width="50vw" v-model="dialog_show" persistent>
        <v-card>
          <v-card-title>
            <v-row>
              <v-col cols="12" align="right">
                <v-btn icon @click="dialog_show = false">
                  <v-icon color="#ff6b81">mdi-close</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-card-title>
          <dialogCard text="ยืนยันการชำระเงินเรียบร้อย"></dialogCard>
        </v-card>
      </v-dialog> -->
    </v-container>
  </v-app>
</template>
  
  <script>
import headerPage from "@/components/header/headerPage.vue";
import rowData from "@/components/label/rowData.vue";
// import dialogCard from "@/components/dialog/dialogCard.vue";
import { mapActions, mapGetters } from 'vuex';
import Swal from 'sweetalert2';
export default {
  name: "financeDetail",
  components: { headerPage, rowData },
  data: () => ({
    dialog_show: false,
    payment_types: ["เงินสด", "บัตรเคตดิต", "โอนเข้าบัญชีโรงเรียน"],
    breadcrumbs: [
      { text: "การเงิน", to: "Finance" },
      { text: "รายละเอียดเพิ่มเติม", to: "" },
    ],
    course: [
      {
        course_type: "general_course",
        course_name: "เปียโนสากล ",
        category: "ศิลปะดนตรีสมัยใหม่",
        coach: "อาทิตย์ แย้มยิ้มเบิกบาน",
        package_name: "Family Package",
        period_name: "รายเดือน (4 ครั้ง)",
        class_data: "วันเสาร์ (10.00-11.00)",
        course_open: "16 กรกฎาคม 2564",
        price: 2000,
      },
      {
        course_type: "short_course",
        course_name: "ไวโลลินเวิร์กช้อป ",
        category: "ศิลปะดนตรีสมัยใหม่",
        coach: "อาทิตย์ แย้มยิ้มเบิกบาน",
        package_name: "Family Package",
        period_name: "รายเดือน (4 ครั้ง)",
        class_data: "10.00-11.00",
        course_open: "20 กรกฎาคม 2564",
        price: 1500,
      },
    ],
    payment: {
      total_price: 3500,
      remark: "",
      paid_at: "",
      status: "unpaid",
      payment_type: "",
      payee: "",
    },
    payment_status: [
      {
        text: "ยังไม่ชำระเงิน",
        img: "../../../assets/finance/close.png",
        value: "unpaid",
      },
      {
        text: "เครดิต/เดบิท",
        img: "../../../assets/finance/card.png",
        value: "Credit Card",
      },
      {
        text: "โอนเงินเข้าบัญชีโรงเรียน",
        img: "../../../assets/finance/mobile_cash.png",
        value: "transfer",
      },
      {
        text: "เงินสด",
        img: "../../../assets/finance/cash.png",
        value: "cash",
      },
    ],
  }),
  created() {
    this.GetOrderDetail({order_number : this.$route.params.order_id})
  },
  mounted() {},
  watch: {},
  computed: {
    ...mapGetters({
      order_detail : "OrderModules/getOrderDetail",
      student_list : "OrderModules/getStudentListOrderDetail",
    })
  },
  methods: {
    ...mapActions({
      GetOrderDetail : "OrderModules/GetOrderDetail",
      updatePayment : "OrderModules/updatePayment",
      updateOrderStatus: "OrderModules/updateOrderStatus"
    }),
    chengeStatus(status) {
      this.order_detail.paymentType = status.value;
    },
    cancelOrder(){
      this.order_detail.paymentStatus = "cancel"
      Swal.fire({
        icon: "question",
        title : "การยกเลิกคำสั่งซื้อ",
        text: `ต้องการยกเลิกคำสั่งซื้อหมายเลข ${this.order_detail.orderNumber}`,
        showDenyButton: false,
        showCancelButton: true,
        cancelButtonText: "ยกเลิก",
        confirmButtonText: "ตกลง",
      }).then(async (result) =>{
        if (result.isConfirmed) {
          // console.log(this.order_detail)
          this.updateOrderStatus({order_detail : this.order_detail})
        }
      })
    },
    confirmPayment() {
      Swal.fire({
        icon: "question",
        title : "ยืนยันการชำระเงิน",
        text: "ยืนยันการชำระเงินใช่หรือไม่?",
        showDenyButton: false,
        showCancelButton: true,
        cancelButtonText: "ยกเลิก",
        confirmButtonText: "ตกลง",
      }).then(async (result) =>{
        if (result.isConfirmed) {
          console.log(this.order_detail)
          this.updatePayment({order_data : this.order_detail})
        }
      })
      // this.payment.status = "paid";
      // this.dialog_show = true
    },
    dayOfWeekArray(day) {
      const daysOfWeek = [
        "วันอาทิตย์",
        "วันจันทร์",
        "วันอังคาร",
        "วันพุธ",
        "วันพฤหัสบดี",
        "วันศุกร์",
        "วันเสาร์",
      ];

      const validDays = day.filter((d) => d >= 0 && d <= 6);
      if (validDays) {
        const firstThreeDays = validDays.map((d) => daysOfWeek[d]);
        return `${firstThreeDays.join(" , ")}`;
      } else {
        return "Invalid days";
      }
    },
  },
};
</script>
  <style>
.headder-card-img {
  position: relative;
  left: -23px;
}
.card-dialog {
  width: 50vw;
}
</style>
  
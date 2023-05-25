<template>
  <v-app>
    <v-container>
      <headerPage :breadcrumbs="breadcrumbs"></headerPage>
      <v-card class="mb-3">
        <v-card-text>
          <v-row>
            <v-col>
              <rowData icon="mdi-notebook-outline" title="หมายเลขคำสั่งซื้อ"
                >: {{ `${$route.params.order_id}` }}</rowData
              >
              <rowData icon="mdi-rename-box-outline" title="ชื่อผู้เรียน"
                >: กมลรัตน์ สิทธิกรชัย, ออกัส สิงหาคม</rowData
              >
            </v-col>
            <v-col cols="12" sm="auto">
              <v-chip
                label
                :color="payment.status === 'unpaid' ? '#FFF9E8' : '#F0F9EE'"
                :text-color="
                  payment.status === 'unpaid' ? '#FCC419' : '#58A144'
                "
              >
                {{ payment.status === "unpaid" ? "รอดำเนินการ" : "ชำระแล้ว" }}
              </v-chip>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <v-row>
        <v-col cols="12" sm="7">
          <v-card>
            <v-card-text>
              <v-card class="mb-3" v-for="(data, index) in course" :key="index">
                <v-card-title class="bg-[#FEFAFD]">
                  <v-img
                    class="headder-card-img pl-3"
                    v-if="data.course_type === 'general_course'"
                    max-height="36.38px"
                    max-width="176px"
                    src="../../../assets/finance/Vector.png"
                  >
                    <span class="font-bold text-base">คอร์สทั่วไป</span>
                  </v-img>
                  <v-img
                    class="headder-card-img pl-3"
                    v-if="data.course_type === 'short_course'"
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
                      >
                        {{ data.course_name }}</rowData
                      >
                    </v-col>
                    <v-col>
                      <rowData col_header="12" col_detail="12" title="อาณาจักร">
                        {{ data.category }}</rowData
                      >
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <rowData col_header="12" col_detail="12" title="โค้ช">
                        {{ data.coach }}</rowData
                      >
                    </v-col>
                    <v-col>
                      <rowData
                        col_header="12"
                        col_detail="12"
                        title="วันที่เริ่ม"
                      >
                        {{ data.course_open }}</rowData
                      >
                    </v-col>
                  </v-row>
                  <template v-if="data.course_type === 'general_course'">
                    <v-row>
                      <v-col>
                        <rowData
                          col_header="12"
                          col_detail="12"
                          title="แพ็คเกจ"
                        >
                          {{ data.package_name }}</rowData
                        >
                      </v-col>
                      <v-col>
                        <rowData
                          col_header="12"
                          col_detail="12"
                          title="ระยะเวลา"
                        >
                          {{ data.period_name }}</rowData
                        >
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col>
                        <rowData
                          col_header="12"
                          col_detail="12"
                          title="วัน - เวลา"
                        >
                          {{ data.class_data }}</rowData
                        >
                      </v-col>
                      <v-col>
                        <rowData col_header="12" col_detail="12" title="ราคา">
                          {{ data.price.toLocaleString() }}</rowData
                        >
                      </v-col>
                    </v-row>
                  </template>
                  <template v-else>
                    <v-row>
                      <v-col>
                        <rowData
                          col_header="12"
                          col_detail="12"
                          title="วัน - เวลา"
                        >
                          {{
                            `${data.course_open} (${data.class_data})`
                          }}</rowData
                        >
                      </v-col>
                      <v-col>
                        <rowData col_header="12" col_detail="12" title="ราคา">
                          {{ data.price.toLocaleString() }}</rowData
                        >
                      </v-col>
                    </v-row>
                  </template>
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
                  <rowData col_header="5" col_detail="7" title="ราคารวม"
                    >:
                    <span class="w-full font-bold">{{
                      payment.total_price.toLocaleString()
                    }}</span>
                  </rowData>
                  <rowData col_header="5" col_detail="7" title="หมายเหตุ"
                    >: {{ payment.remark ? payment.remark : "-" }}</rowData
                  >
                  <rowData col_header="5" col_detail="7" title="วันที่ชำระ"
                    >: {{ payment.paid_at ? payment.paid_at : "-" }}</rowData
                  >
                </v-card-text>
              </v-card>
              <template v-if="payment.status === 'paid'">
                <div class="font-bold">วิธีการชำระเงิน</div>
                <v-card
                  v-for="(status, index) in payment_status.filter(
                    (v) => v.value === payment.payment_type
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
                            payment.payment_type === status.value
                              ? '#FF6B81'
                              : ''
                          "
                          >{{
                            payment.payment_type === status.value
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
                            v-if="status.value === 'cadit card'"
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
              <template v-else>
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
                            payment.payment_type === status.value
                              ? '#FF6B81'
                              : ''
                          "
                          >{{
                            payment.payment_type === status.value
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
                            v-if="status.value === 'cadit card'"
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
                v-if="payment.status === 'paid'"
                class="w-full"
                color="#ff6b81"
                dark
                >ออกใบเสร็จฉบับเต็ม</v-btn
              >
              <v-row dense v-else>
                <v-col cols="12">
                  <v-btn
                    v-if="payment.payment_type === 'unpaid'"
                    class="w-full"
                    color="#ff6b81"
                    dark
                    >ส่งการแจ้งเตือน</v-btn
                  >
                  <v-btn
                    v-if="payment.payment_type !== 'unpaid'"
                    class="w-full"
                    color="#ff6b81"
                    dark
                    @click="confirmPayment()"
                    >ยืนยันการชำระ</v-btn
                  >
                </v-col>
                <v-col cols="12">
                  <v-btn class="w-full" text color="#ff6b81" dark
                    >ยกเลิกการซื้อคอร์ส</v-btn
                  >
                </v-col>
              </v-row>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <!-- DIALOG -->
      <v-dialog class="pa-2" width="50vw" v-model="dialog_show" persistent>
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
      </v-dialog>
    </v-container>
  </v-app>
</template>
  
  <script>
import headerPage from "@/components/header/headerPage.vue";
import rowData from "@/components/label/rowData.vue";
import dialogCard from "@/components/dialog/dialogCard.vue";
export default {
  name: "financeDetail",
  components: { headerPage, rowData, dialogCard },
  data: () => ({
    dialog_show: true,
    payment_types: ["เงินสด", "บัตรเคตดิต", "โอนเข้าบัญชีโรงเรียน"],
    breadcrumbs: [
      { text: "การเงิน", to: "Finance" },
      { text: "รายระเอียดเพิ่มเติม", to: "" },
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
        value: "cadit card",
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
  created() {},
  mounted() {},
  watch: {},
  computed: {},
  methods: {
    chengeStatus(status) {
      this.payment.payment_type = status.value;
    },
    confirmPayment() {
      this.payment.status = "paid";
      // this.dialog_show = true
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
  
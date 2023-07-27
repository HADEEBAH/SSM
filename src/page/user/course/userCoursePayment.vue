<template>
  <v-app>
    <v-container>
      <v-row>
        <v-col align="center">
          <v-img
            width="300"
            height="200"
            src="@/assets/course/payment.png"
          ></v-img>
        </v-col>
      </v-row>
      <v-row>
        <v-col
          align="center"
          class="text-lg font-bold"
          :class="
            payload.responseMessage !== 'Data Incomplete'
              ? 'text-[#58A144]'
              : 'text-[#e00]'
          "
        >
          {{ paymentStatus }}
        </v-col>
      </v-row>
      <div align="center">
        <div style="width: 400px">
          <v-row>
            <v-col align="left" class="font-bold"> รายละเอียด </v-col>
          </v-row>
          <v-row>
            <v-col cols="6" sm="4" align="left"> หมายเลขคำสั่งชื้อ : </v-col>
            <v-col align="right">{{ payload.orderId }}</v-col>
          </v-row>
          <v-row>
            <v-col cols="6" sm="4" align="left"> วันที่ชำระเงิน : </v-col>
            <v-col align="right">{{
              formatDate(payload.transactionDate)
            }}</v-col>
          </v-row>
          <v-row>
            <v-col cols="6" sm="4" align="left"> เวลาชำระเงิน :</v-col>
            <v-col align="right">{{
              formatTime(payload.transactionTime)
            }}</v-col>
          </v-row>
          <v-row>
            <v-col cols="6" sm="4" align="left"> ยอดที่ต้องชำระ :</v-col>
            <v-col align="right"
              >{{
                parseFloat(payload.receiveAmount).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              }}บาท</v-col
            >
          </v-row>
          <v-row>
            <v-col cols="6" sm="4" align="left"> ชำระเงินทั้งหมด : </v-col>
            <v-col align="right"
              >{{
                parseFloat(payload.receiveAmount).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              }}บาท</v-col
            >
          </v-row>
          <v-row dense>
            <v-col
              cols="12"
              v-if="
                payload.responseMessage === 'Data Incomplete' ||
                payload.responseMessage === 'Cancel'
              "
            >
              <v-btn class="w-full" outlined color="#ff6b81"
                >ชำระอีกครั้ง</v-btn
              >
            </v-col>
            <v-col cols="12">
              <v-btn
                @click="$router.push({ name: 'UserKingdom' })"
                v-if="payload.responseMessage === 'Success'"
                class="w-full"
                outlined
                color="#ff6b81"
                >กลับสู่หน้าหลัก</v-btn
              >
            </v-col>
            <v-col cols="12">
              <v-btn
                class="w-full"
                dark
                color="#ff6b81"
                @click="$router.push({ name: 'StudentsSchedule' })"
                depressed
                >ไปหน้าคอร์สเรียนของฉัน</v-btn
              >
            </v-col>
          </v-row>
        </div>
      </div>
    </v-container>
  </v-app>
</template>

<script>
const Buffer = require("buffer").Buffer;
export default {
  name: "userCoursePayment",
  components: {},
  data: () => ({
    payload: "",
    paymentStatus: "",
  }),
  created() {
    const base64Str = this.$route.query.payload;
    const objStr = Buffer.from(base64Str, "base64").toString("utf-8");
    this.payload = JSON.parse(objStr);
    // console.log(this.payload)
  },
  beforeDestroy() {
    window.removeEventListener("beforeunload", this.preventNavigation);
  },
  mounted() {
    window.addEventListener("beforeunload", this.preventNavigation);
    this.paymentStatus =
      this.payload.responseMessage === "Success"
        ? "ชำระเงินสำเร็จ"
        : this.payload.responseMessage === "Cancel"
        ? "รอการชำระ"
        : "ชำระเงินไม่สำเร็จ";
  },
  watch: {},
  computed: {},
  methods: {
    preventNavigation() {
      this.$router.replace({ name: "UserKingdom" });
    },
    formatDate(date_str) {
      const year = date_str.substring(0, 4);
      const month = date_str.substring(4, 6);
      const day = date_str.substring(6, 8);
      return new Date(`${year}-${month}-${day}`).toLocaleDateString("th-TH", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      // return `${day}/${month}/${year}`;
    },
    formatTime(time_str) {
      const hour = time_str.substring(0, 2);
      const minute = time_str.substring(2, 4);
      const second = time_str.substring(4, 6);
      return `${hour}:${minute}:${second}`;
    },
  },
};
</script>
  
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
          {{ $t(paymentStatus.toLocaleLowerCase()) }}
        </v-col>
      </v-row>
      <div align="center">
        <div style="width: 400px">
          <v-row>
            <v-col align="left" class="font-bold"> {{ $t("details") }} </v-col>
          </v-row>
          <v-row>
            <v-col cols="6" sm="4" align="left">
              {{ $t("order number") }} :
            </v-col>
            <v-col align="right">{{ payload.orderId }}</v-col>
          </v-row>
          <v-row>
            <v-col cols="6" sm="4" align="left">
              {{ $t("payment date") }} :
            </v-col>
            <v-col align="right">{{
              formatDate(payload.transactionDate)
            }}</v-col>
          </v-row>
          <v-row>
            <v-col cols="6" sm="4" align="left">
              {{ $t("payment time") }} :</v-col
            >
            <v-col align="right">{{
              formatTime(payload.transactionTime)
            }}</v-col>
          </v-row>
          <v-row>
            <v-col cols="6" sm="5" align="left">
              {{ $t("amount to be paid") }} :</v-col
            >
            <v-col align="right"
              >{{
                parseFloat(payload.receiveAmount).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              }}
              {{ $t("baht") }}</v-col
            >
          </v-row>
          <v-row>
            <v-col cols="6" sm="4" align="left">
              {{ $t("payment amount") }} :
            </v-col>
            <v-col align="right"
              >{{
                parseFloat(payload.receiveAmount).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              }}{{ $t("baht") }}</v-col
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
              <v-btn class="w-full" outlined color="#ff6b81">{{
                $t("pay again")
              }}</v-btn>
            </v-col>
            <v-col cols="12">
              <v-btn
                @click="$router.push({ name: 'UserKingdom' })"
                v-if="payload.responseMessage === 'Success'"
                class="w-full"
                outlined
                color="#ff6b81"
                >{{ $t("return to home page") }}</v-btn
              >
            </v-col>
            <v-col cols="12">
              <v-btn
                class="w-full"
                dark
                color="#ff6b81"
                @click="
                  $router.push({
                    name: 'StudentsSchedule',
                    params: { action: 'MyCourse' },
                  })
                "
                depressed
                >{{ $t("go to my course page") }}</v-btn
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
  },
  beforeDestroy() {
    window.removeEventListener("beforeunload", this.preventNavigation);
  },
  mounted() {
    window.addEventListener("beforeunload", this.preventNavigation);
    this.paymentStatus = this.payload.responseMessage;
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
      return new Date(`${year}-${month}-${day}`).toLocaleDateString(
        this.$i18n.locale == "th" ? "th-TH" : "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      );
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
  
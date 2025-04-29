<template>
  <v-app>
    <v-container>
      <headerPage :breadcrumbs="breadcrumbs"></headerPage>
      <v-card class="mb-3">
        <v-card-text>
          <v-row>
            <v-col>
              <rowData icon="mdi-notebook-outline" :title="$t('order number')"
                >: {{ `${$route.params.order_id}` }}</rowData
              >
              <rowData icon="mdi-rename-box-outline" :title="$t('student list')"
                >:
                {{
                  $i18n.locale == "th"
                    ? order_detail.student_name_list
                    : order_detail.student_name_list_en
                }}</rowData
              >
            </v-col>
            <v-col cols="12" sm="auto">
              <v-chip
                label
                :color="
                  order_detail.paymentStatus === 'pending'
                    ? '#FFF9E8'
                    : order_detail.paymentStatus === 'success'
                    ? '#F0F9EE'
                    : '#ffeeee'
                "
                :text-color="
                  order_detail.paymentStatus === 'pending'
                    ? '#FCC419'
                    : order_detail.paymentStatus === 'success'
                    ? '#58A144'
                    : '#f00808'
                "
              >
                {{ $t(order_detail.paymentStatus) }}
              </v-chip>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <v-row>
        <v-col cols="12" sm="7">
          <v-card>
            <v-card-text>
              <v-card
                class="mb-3"
                v-for="(data, index) in order_detail.orderItem"
                :key="index"
              >
                <v-card-title class="bg-[#FEFAFD]">
                  <v-img
                    class="headder-card-img pl-3"
                    v-if="data.course.courseTypeId === 'CT_1'"
                    max-height="36.38px"
                    max-width="176px"
                    src="@/assets/finance/Vector.png"
                  >
                    <span class="font-bold text-base">{{
                      $t("general course")
                    }}</span>
                  </v-img>
                  <v-img
                    class="headder-card-img pl-3"
                    v-if="data.course.courseTypeId === 'CT_2'"
                    max-height="36.38px"
                    max-width="176px"
                    src="@/assets/finance/Vector (1).png"
                  >
                    <span class="font-bold text-base">{{
                      $t("short course")
                    }}</span>
                  </v-img>
                </v-card-title>
                <v-card-text class="bg-[#FEFAFD]">
                  <v-row>
                    <v-col>
                      <rowData
                        col_header="12"
                        col_detail="12"
                        :title="$t('course')"
                      >
                        {{
                          $i18n.locale == "th"
                            ? data.course.courseNameTh
                            : data.course.courseNameEn
                        }}</rowData
                      >
                    </v-col>
                    <v-col>
                      <rowData
                        col_header="12"
                        col_detail="12"
                        :title="$t('warraphat learning sphere')"
                      >
                        {{
                          $i18n.locale == "th"
                            ? data.course.categoryNameTh
                            : data.course.categoryNameEng
                        }}</rowData
                      >
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <rowData
                        col_header="12"
                        col_detail="12"
                        :title="$t('coach')"
                      >
                        {{
                          $i18n.locale == "th"
                            ? data.coachName
                            : data.coachNameEn
                        }}</rowData
                      >
                    </v-col>
                    <v-col>
                      <rowData
                        col_header="12"
                        col_detail="12"
                        :title="$t('start date')"
                      >
                        {{ GenDate(data.startDate) }}</rowData
                      >
                    </v-col>
                  </v-row>
                  <template v-if="data.course.courseTypeId === 'CT_1'">
                    <v-row>
                      <v-col>
                        <rowData
                          col_header="12"
                          col_detail="12"
                          :title="$t('package')"
                        >
                          {{ data.cpo.packageName }}</rowData
                        >
                      </v-col>
                      <v-col>
                        <rowData
                          col_header="12"
                          col_detail="12"
                          :title="$t('period')"
                        >
                          {{
                            $i18n.locale == "th"
                              ? data.cpo.optionName
                              : data.cpo.optionNameEn
                          }}</rowData
                        >
                      </v-col>
                    </v-row>
                  </template>
                  <v-row>
                    <v-col>
                      <v-row dense>
                        <v-col cols="12" class="font-bold">
                          {{ `${$t("day")} - ${$t("times")}` }}
                        </v-col>
                        <v-col cols="12">
                          {{
                            `${data.course.dayOfWeekNameStr} (${data.course.start} - ${data.course.end})`
                          }}
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col>
                      <rowData
                        col_header="12"
                        col_detail="12"
                        :title="$t('price')"
                      >
                        {{
                          parseInt(
                            data.price ? data.price : "0"
                          )?.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                          })
                        }}
                        {{ $t("baht") }}</rowData
                      >
                    </v-col>
                  </v-row>
                  <!-- <v-row>
                    <v-col>
                      <rowData
                        col_header="12"
                        col_detail="12"
                        :title="$t('remark')"
                      >
                        {{ data?.remark ? data?.remark : "-" }}</rowData
                      >
                    </v-col>
                  </v-row> -->
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
                  <rowData col_header="4" col_detail="8" :title="$t('price')"
                    >:
                    <span class="w-full font-bold">{{
                      order_detail.sumPrice?.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })
                    }}</span>
                    {{ $t("baht") }}
                  </rowData>
                  <rowData col_header="4" col_detail="8" :title="$t('discount')"
                    >:
                    <span class="w-full font-bold">{{
                      order_detail.sumDiscountCourse?.toLocaleString(
                        undefined,
                        {
                          minimumFractionDigits: 2,
                        }
                      )
                    }}</span>
                    {{ $t("baht") }}
                  </rowData>
                  <rowData
                    col_header="4"
                    col_detail="8"
                    :title="$t('more discount')"
                    >:
                    <span class="w-full font-bold">{{
                      order_detail.sumAdminDiscount?.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })
                    }}</span>
                    {{ $t("baht") }}
                  </rowData>
                  <rowData
                    col_header="4"
                    col_detail="8"
                    :title="$t('total amount')"
                    >:
                    <span class="w-full font-bold">{{
                      order_detail.diffAdminDiscountTotal?.toLocaleString(
                        undefined,
                        {
                          minimumFractionDigits: 2,
                        }
                      )
                    }}</span>
                    {{ $t("baht") }}
                  </rowData>
                  <rowData
                    v-if="order_detail.payment?.paymentDate"
                    col_header="4"
                    col_detail="8"
                    :title="$t('payment date')"
                    >:
                    {{
                      order_detail.payment
                        ? GenDate(order_detail.payment.paid_date)
                        : "-"
                    }}
                  </rowData>
                  <rowData
                    v-if="order_detail.payment?.paymentDate"
                    col_header="4"
                    col_detail="8"
                    :title="$t('payment time')"
                    >: {{ order_detail.payment.paid_date.slice(11, 16) }}
                    {{ $t("o'clock") }}
                  </rowData>
                </v-card-text>
              </v-card>
              <template v-if="order_detail.paymentStatus === 'success'">
                <div class="font-bold">{{ $t("payment method") }}</div>
                <v-card
                  v-for="(status, index) in payment_status.filter(
                    (v) =>
                      v.value ===
                      ([
                        'QR Code Payment',
                        'Internet Banking',
                        'Corporate Banking',
                      ].some((v) => v == order_detail.paymentType)
                        ? (order_detail.paymentType = 'transfer')
                        : ['Credit Card', 'Credit Card Installment'].some(
                            (v) => v == order_detail.paymentType
                          )
                        ? (order_detail.paymentType = 'Credit Card')
                        : order_detail.paymentType)
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
                            src="@/assets/finance/close.png"
                          ></v-img>
                          <v-img
                            v-if="status.value == 'Credit Card'"
                            src="@/assets/finance/card.png"
                          ></v-img>
                          <v-img
                            v-if="status.value === 'transfer'"
                            src="@/assets/finance/mobile_cash.png"
                          ></v-img>
                          <v-img
                            v-if="status.value === 'cash'"
                            src="@/assets/finance/cash.png"
                          ></v-img>
                        </v-avatar>
                      </v-col>
                      <v-col>
                        {{ $t(status.text) }}
                      </v-col>
                    </v-row>
                  </v-card-actions>
                </v-card>
              </template>
              <template v-else-if="order_detail.paymentStatus !== 'cancel'">
                <div class="font-bold mb-3">
                  {{ $t("choose payment method") }}
                </div>
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
                            order_detail.paymentType === status.value
                              ? '#FF6B81'
                              : ''
                          "
                          >{{
                            order_detail.paymentType === status.value
                              ? "mdi-radiobox-marked"
                              : "mdi-radiobox-blank"
                          }}
                        </v-icon>
                      </v-col>
                      <v-col cols="auto">
                        <v-avatar>
                          <v-img
                            v-if="status.value === ''"
                            src="@/assets/finance/close.png"
                          ></v-img>
                          <v-img
                            v-if="status.value === 'Credit Card'"
                            src="@/assets/finance/card.png"
                          ></v-img>
                          <v-img
                            v-if="status.value === 'transfer'"
                            src="@/assets/finance/mobile_cash.png"
                          ></v-img>
                          <v-img
                            v-if="status.value === 'cash'"
                            src="@/assets/finance/cash.png"
                          ></v-img>
                        </v-avatar>
                      </v-col>
                      <v-col>
                        {{ $t(status.text) }}
                      </v-col>
                    </v-row>
                  </v-card-actions>
                </v-card>
              </template>
              <template v-if="order_detail.paymentStatus === 'success'">
                <v-row dense>
                  <v-col class="font-bold">
                    {{ $t("receipt language") }}
                  </v-col>
                </v-row>
                <v-radio-group v-model="pdf_lang" row>
                  <v-radio
                    :label="$t('thai')"
                    color="#ff6b81"
                    value="th"
                  ></v-radio>
                  <v-radio
                    :label="$t('english')"
                    color="#ff6b81"
                    value="en"
                  ></v-radio>
                </v-radio-group>
              </template>
            </v-card-text>
            <v-card-actions>
              <v-btn
                v-if="order_detail.paymentStatus === 'success'"
                class="w-full"
                color="#ff6b81"
                dark
                @click="exportBill()"
                >{{ $t("print receipt") }}</v-btn
              >
              <v-row dense v-else>
                <v-col cols="12">
                  <v-btn
                    v-if="
                      order_detail.paymentType === '' ||
                      order_detail.paymentType === 'unpaid'
                    "
                    class="w-full"
                    color="#ff6b81"
                    dark
                    @click="sendNotificationByAccount(student_list)"
                    >{{ $t("send notification") }}</v-btn
                  >
                  <v-btn
                    v-if="
                      order_detail.paymentType !== '' &&
                      order_detail.paymentType !== 'unpaid' &&
                      order_detail.paymentStatus !== 'cancel'
                    "
                    depressed
                    class="w-full"
                    color="#ff6b81"
                    :disabled="order_detail.paymentStatus == 'cancel'"
                    dark
                    @click="confirmPayment()"
                    >{{ $t("confirm payment") }}</v-btn
                  >
                </v-col>
                <v-col cols="12">
                  <v-btn
                    class="w-full"
                    text
                    :disabled="order_detail.paymentStatus == 'cancel'"
                    color="#ff6b81"
                    :dark="!order_detail.paymentStatus == 'cancel'"
                    @click="cancelOrder()"
                    >{{ $t("cancel course purchase") }}</v-btn
                  >
                </v-col>
              </v-row>
            </v-card-actions>
            <v-card-text
              class="pa-2"
              v-if="order_detail.paymentStatus == 'success'"
            >
              <v-row dense>
                <v-col>
                  <v-btn
                    class="w-full"
                    text
                    :disabled="order_detail.paymentStatus == 'cancel'"
                    color="#ff6b81"
                    :dark="!order_detail.paymentStatus == 'cancel'"
                    @click="cancelOrderSuccess()"
                    >{{ $t("cancel course purchase") }}</v-btn
                  >
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-dialog v-model="pdf_open" fullscreen>
        <v-card class="pa-2" align="right">
          <v-btn icon @click="pdf_open = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <iframe
            class="w-full pdf-iframe"
            id="printPdf"
            name="printPdf"
          ></iframe>
        </v-card>
      </v-dialog>
    </v-container>
    <loading-overlay :loading="orders_is_loading"></loading-overlay>
  </v-app>
</template>

<script>
import headerPage from "@/components/header/headerPage.vue";
import rowData from "@/components/label/rowData.vue";
import { mapActions, mapGetters } from "vuex";
import Swal from "sweetalert2";
import mixin from "@/mixin";
import pdfMake from "pdfmake";
import pdfFonts from "@/assets/custom-fonts.js";
import loadingOverlay from "@/components/loading/loadingOverlay.vue";
import {
  convertToThaiBaht,
  convertToEnglishCurrency,
} from "@/functions/functions.js";
import moment from "moment";
export default {
  name: "financeDetail",
  components: { headerPage, rowData, loadingOverlay },
  mixins: [mixin],
  data: () => ({
    pdf_open: false,
    dialog_show: false,
    pdf_lang: "th",
    payment_status: [
      {
        text: "unpaid",
        img: "@/assets/finance/close.png",
        value: "",
      },
      {
        text: "credit/debit",
        img: "@/assets/finance/card.png",
        value: "Credit Card",
      },
      {
        text: "transfer to school account",
        img: "@/assets/finance/mobile_cash.png",
        value: "transfer",
      },
      {
        text: "cash",
        img: "@/assets/finance/cash.png",
        value: "cash",
      },
    ],
    notification_name: "แจ้งเตือน",
    notification_description: "หมายเลขออร์เดอร์ที่ ... ยังไม่ชำระเงิน",
  }),
  created() {
    this.GetOrderDetail({ order_number: this.$route.params.order_id });
  },
  mounted() {
    this.pdf_lang = this.$i18n.locale;
  },
  watch: {
    "$i18n.locale": function () {
      this.GetOrderDetail({ order_number: this.$route.params.order_id });
    },
  },
  computed: {
    ...mapGetters({
      orders_is_loading: "OrderModules/getOrdersIsLoading",
      order_detail: "OrderModules/getOrderDetail",
      student_list: "OrderModules/getStudentList",
    }),
    breadcrumbs() {
      return [
        { text: this.$t("finance"), to: "Finance" },
        { text: this.$t("more details"), to: "" },
      ];
    },
  },
  methods: {
    ...mapActions({
      GetOrderDetail: "OrderModules/GetOrderDetail",
      updatePayment: "OrderModules/updatePayment",
      updateOrderStatus: "OrderModules/updateOrderStatus",
      CancelOrderDeleteScheduleAndMonitor:
        "OrderModules/CancelOrderDeleteScheduleAndMonitor",
    }),
    cancelOrderSuccess() {
      Swal.fire({
        icon: "question",
        title: this.$t("order cancellation"),
        text: `${this.$t("want to cancel order no.")} ${
          this.order_detail.orderNumber
        }`,
        showDenyButton: false,
        showCancelButton: true,
        cancelButtonText: this.$t("no"),
        confirmButtonText: this.$t("agree"),
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.order_detail.paymentStatus = "cancel";
          this.CancelOrderDeleteScheduleAndMonitor({
            order_number: this.$route.params.order_id,
          });
        } else {
          this.GetOrderDetail({ order_number: this.$route.params.order_id });
        }
      });
    },
    GenDate(date) {
      return new Date(date).toLocaleDateString(
        this.$i18n.locale == "th" ? "th-TH" : "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      );
    },
    async exportBill() {
      if (this.order_detail.paymentStatus === "success") {
        // Define the image paths
        var headerImagePath = require("@/assets/FrontPortfolio/Logo.png");
        var logoLightImagePath = require("@/assets/FrontPortfolio/logo_light.png");
        // Load the images using the file loader
        var headerImageData = await this.loadImageFromFile(headerImagePath);
        var logoLightImageData = await this.loadImageFromFile(
          logoLightImagePath
        );
        // Convert image URLs to data URLs directly
        var headerImageDataUrl = await this.convertImageToDataFile(
          headerImageData
        );
        var logoLightImageDataUrl = await this.convertImageToDataFile(
          logoLightImageData
        );
        pdfMake.vfs = pdfFonts.pdfMake.vfs;
        pdfMake.fonts = {
          Kanit: {
            normal: "Kanit-Regular.ttf",
            bold: "Kanit-Bold.ttf",
            italics: "Kanit-Italic.ttf",
            bolditalics: "Kanit-BoldItalic.ttf",
          },
          Fontello: {
            normal: "fontello.ttf",
            bold: "fontello.ttf",
            italics: "fontello.ttf",
            bolditalics: "fontello.ttf",
          },
          Roboto: {
            normal:
              "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf",
            bold: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf",
            italics:
              "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf",
            bolditalics:
              "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf",
          },
          Symbol: {
            normal: "Symbol",
          },
        };
        var docDefinition = {
          pageMargins: [20, 30, 20, 30],
          pageSize: {
            width: 595,
            height: 842,
          },
          content: [
            // Header
            {
              columns: [
                {
                  width: "40%",
                  stack: [
                    {
                      margin: [0, -20, 0, -20],
                      image: headerImageDataUrl,
                      alignment: "center",
                      width: 100,
                      height: 100,
                      arguments: "justify",
                    },
                    {
                      text: [
                        { text: "warraphat learning sphere ", fontSize: 14 },
                      ],
                      margin: [0, 0],
                    },
                    { text: "(วรพัฒน์ เลิร์นนิ่ง สเฟียร์)", fontSize: 10 },
                    {
                      text:
                        this.pdf_lang == "th"
                          ? "63 ถนน พัฒโนอุทิศ ตำบล หาดใหญ่ อำเภอหาดใหญ่ สงขลา 90110"
                          : "63 Phatthano Uthit Road, Hat Yai Subdistrict, Hat Yai District, Songkhla 90110",
                      fontSize: 10,
                      margin: [0, 5],
                    },
                  ],
                },
                {},
                {
                  width: "40%",
                  stack: [
                    {
                      text:
                        this.pdf_lang == "th" ? "ใบเสร็จรับเงิน" : "receipt",
                      fontSize: 24,
                      color: "#318ce7",
                      bold: false,
                      alignment: "center",
                    },
                    {
                      text: this.pdf_lang == "th" ? "ต้นฉบับ" : "original",
                      color: "#318ce7",
                      fontSize: 10,
                      bold: false,
                      alignment: "center",
                    },
                    {
                      canvas: [
                        {
                          type: "line",
                          x1: 0,
                          y1: 0,
                          x2: 200,
                          y2: 0,
                          lineWidth: 1,
                          color: "#999",
                        },
                      ],
                    },
                    {
                      text: `${this.pdf_lang == "th" ? "เลขที่" : "No."}: ${
                        this.$route.params.order_id
                      }`,
                      margin: [0, 5],
                      color: "#318ce7",
                      fontSize: 10,
                    },
                    {
                      text: `${
                        this.pdf_lang == "th" ? "วันที่" : "Date"
                      } : ${moment(this.order_detail.payment.paid_date).format(
                        "DD/MM/YYYY"
                      )}`,
                      margin: [0, 5],
                      color: "#318ce7",
                      fontSize: 10,
                    },
                    {
                      canvas: [
                        {
                          type: "line",
                          x1: 0,
                          y1: 0,
                          x2: 200,
                          y2: 0,
                          lineWidth: 1,
                          color: "#999",
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            // Customer Information
            {
              columns: [
                {
                  width: "10%",
                  stack: [
                    {
                      text: this.pdf_lang == "th" ? "ชื่อ-สกุล :" : "Name :",
                      color: "#318ce7",
                      margin: [0, 5],
                    },
                  ],
                },
                {
                  stack: [
                    {
                      text:
                        this.pdf_lang == "th"
                          ? `${this.order_detail.student_name_list}`
                          : `${this.order_detail.student_name_list_en}`,
                      color: "#318ce7",
                      margin: [0, 5],
                    },
                  ],
                },
              ],
            },
            // Table
            {
              table: {
                headerRows: 1,
                widths: ["auto", "*", "auto", "auto", "auto"],
                body: this.GenCourseItem(),
              },
              margin: [0, 0, 0, 20],
            },
            // Total
            {
              alignment: "center",
              canvas: [
                {
                  type: "line",
                  x1: 0,
                  y1: 0,
                  x2: 540,
                  y2: 0,
                  lineWidth: 1,
                  color: "#999",
                },
              ],
            },
            {
              columns: [
                {
                  width: "60%",
                  text: `(${
                    this.pdf_lang == "th"
                      ? convertToThaiBaht(
                          this.order_detail.diffAdminDiscountTotal
                        )
                      : convertToEnglishCurrency(
                          this.order_detail.diffAdminDiscountTotal
                        )
                  })`,
                  color: "#ff6b81",
                  margin: [0, 88.5, 0, 0],
                },
                {
                  columns: [
                    {
                      width: "auto",
                      stack: [
                        {
                          text:
                            this.pdf_lang == "th"
                              ? "รวมเป็นเงิน"
                              : "total price",
                          margin: [0, 5],
                          color: "#ff6b81",
                          alignment: "right",
                        },
                        {
                          text: this.pdf_lang == "th" ? "ส่วนลด" : "discount",
                          margin: [0, 5],
                          color: "#ff6b81",
                          alignment: "right",
                        },
                        {
                          text:
                            this.pdf_lang == "th"
                              ? "จำนวนเงินหลังหักส่วนลด"
                              : "Amount after discount",
                          margin: [0, 5],
                          color: "#ff6b81",
                          alignment: "right",
                        },
                        {
                          text:
                            this.pdf_lang == "th"
                              ? "จำนวนเงินรวมทั้งสิ้น"
                              : "net price",
                          margin: [0, 5],
                          color: "#ff6b81",
                          alignment: "right",
                        },
                      ],
                    },
                    {
                      stack: [
                        {
                          text: `${this.order_detail.grandTotal?.toLocaleString(
                            "en-US",
                            { minimumFractionDigits: 2 }
                          )} ${this.pdf_lang == "th" ? "บาท" : "Baht"}`,
                          margin: [0, 5],
                          color: "#ff6b81",
                          alignment: "right",
                        },
                        {
                          text: `${this.order_detail.sumAdminDiscount?.toLocaleString(
                            "en-US",
                            { minimumFractionDigits: 2 }
                          )} ${this.pdf_lang == "th" ? "บาท" : "Baht"}`,
                          margin: [0, 5],
                          color: "#ff6b81",
                          alignment: "right",
                        },
                        {
                          text: `${this.order_detail.diffAdminDiscountTotal?.toLocaleString(
                            "en-US",
                            { minimumFractionDigits: 2 }
                          )} ${this.pdf_lang == "th" ? "บาท" : "Baht"}`,
                          margin: [0, 5],
                          color: "#ff6b81",
                          alignment: "right",
                        },

                        {
                          text: `${this.order_detail.diffAdminDiscountTotal?.toLocaleString(
                            "en-US",
                            { minimumFractionDigits: 2 }
                          )} ${this.pdf_lang == "th" ? "บาท" : "Baht"}`,
                          margin: [0, 5],
                          color: "#ff6b81",
                          alignment: "right",
                        },
                      ],
                    },
                  ],
                },
              ],
              margin: [0, 20, 0, 40],
            },
            // Footer
            {
              absolutePosition: { x: 20, y: 600 },
              text: [
                this.pdf_lang == "th"
                  ? "การชำระเงินจะสมบูรณ์เมือบริษัทได้รับเงินเรียบร้อยแล้ว\t"
                  : "Verification complete; company received payment\t",
                {
                  text: `${
                    this.order_detail.paymentType === "cash"
                      ? "\uE800"
                      : "\uF096"
                  }`,
                  style: "icon",
                },
                this.pdf_lang == "th" ? " เงินสด\t" : " Cash\t",
                { text: "\uF096", style: "icon" },
                this.pdf_lang == "th" ? " เช็ค\t" : " Cheque\t",
                {
                  text: `${
                    ["transfer", "QR Code Payment"].includes(
                      this.order_detail.paymentType
                    )
                      ? "\uE800"
                      : "\uF096"
                  }`,
                  style: "icon",
                },
                this.pdf_lang == "th" ? " โอนเงิน\t" : " Transfer\t",
                {
                  text: `${
                    ["Credit Card"].includes(this.order_detail.paymentType)
                      ? "\uE800"
                      : "\uF096"
                  }`,
                  style: "icon",
                },
                this.pdf_lang == "th" ? " ช่องทางอื่นๆ" : " Other",
              ],
              fontSize: 12,
            },
            {
              absolutePosition: { x: 20, y: 620 },
              columns: [
                {
                  width: "auto",
                  text: this.pdf_lang == "th" ? "ช่องทาง" : "Method",
                  margin: [0, 5],
                },
                {
                  text: `${
                    this.payment_status.filter(
                      (v) => v.value == this.order_detail.paymentType
                    )[0].text
                  }`,
                  margin: [0, 5],
                  color: "#ff6b81",
                  alignment: "center",
                },
                {
                  width: "auto",
                  text: this.pdf_lang == "th" ? "วันที่" : "Date",
                  margin: [0, 5],
                },
                // {
                //   text: `${new Date(
                //     this.order_detail.payment.paid_date
                //   ).toLocaleDateString("th-TH", {
                //     year: "numeric",
                //     month: "long",
                //     day: "numeric",
                //   })}`,
                //   margin: [0, 5],
                //   color: "#ff6b81",
                //   alignment: "center",
                // },
                {
                  text: `${moment(this.order_detail.payment.paid_date).format(
                    "DD/MM/YYYY HH:mm"
                  )} ${this.pdf_lang == "th" ? "น." : ""}`,
                  margin: [0, 5],
                  color: "#ff6b81",
                  alignment: "center",
                },
                {
                  width: "auto",
                  text: this.pdf_lang == "th" ? "จำนวนเงิน" : "Amount",
                  margin: [0, 5],
                },
                {
                  text: `${this.order_detail.diffAdminDiscountTotal?.toLocaleString(
                    "en-US",
                    { minimumFractionDigits: 2 }
                  )} ${this.pdf_lang == "th" ? "บาท" : "Baht"}`,
                  margin: [0, 5],
                  color: "#ff6b81",
                  alignment: "center",
                },
              ],
              margin: [0, 0, 0, 20],
            },
            {
              absolutePosition: { x: 20, y: 670 },
              columns: [
                {
                  stack: [
                    {
                      text: !this.order_detail.payment.recipient
                        ? this.pdf_lang == "th"
                          ? `${this.order_detail.created_by_data.firstNameTh} ${this.order_detail.created_by_data.lastNameTh}`
                          : `${this.order_detail.created_by_data.firstNameEng} ${this.order_detail.created_by_data.lastNameEng}`
                        : "\n",
                      margin: [0, 5],
                      alignment: "center",
                    },
                    {
                      text: this.pdf_lang == "th" ? `ผู้จ่ายเงิน` : "payer",
                      margin: [0, 5],
                      alignment: "center",
                    },
                  ],
                  margin: [0, 30, 0, 0],
                },
                {
                  stack: [
                    {
                      text: `${moment(
                        this.order_detail.payment.paid_date
                      ).format(
                        "DD/MM/YYYY"
                      )} ${this.order_detail.payment.paid_date.slice(11, 16)} ${
                        this.pdf_lang == "th" ? "น." : ""
                      }`,
                      // text: `${moment(this.order_detail.createdDate).format(
                      //   "DD/MM/YYYY HH:mm"
                      // )} ${this.pdf_lang == "th" ? "น." : ""}`,
                      margin: [0, 5],
                      alignment: "center",
                      fontSize: 11,
                    },
                    {
                      text: this.pdf_lang == "th" ? "วันที่" : "Date",
                      margin: [0, 5],
                      alignment: "center",
                    },
                  ],
                  margin: [0, 30, 0, 0],
                },
                {
                  image: logoLightImageDataUrl,
                  alignment: "center",
                  width: 140,
                  height: 140,
                  arguments: "justify",
                },
                {
                  stack: [
                    {
                      text: this.order_detail.payment.recipient
                        ? this.pdf_lang == "th"
                          ? `${this.order_detail.payment.recipient.firstNameTh} ${this.order_detail.payment.recipient.lastNameTh}`
                          : `${this.order_detail.payment.recipient.firstNameEng} ${this.order_detail.payment.recipient.lastNameEng}`
                        : "\n", //ต้องแก้
                      margin: [0, 5],
                      alignment: "center",
                    },
                    {
                      text: this.pdf_lang == "th" ? `ผู้รับเงิน` : "Payee",
                      margin: [0, 5],
                      alignment: "center",
                    },
                  ],
                  margin: [0, 30, 0, 0],
                },
                {
                  stack: [
                    {
                      text: `${moment(
                        this.order_detail.payment.paid_date
                      ).format(
                        "DD/MM/YYYY"
                      )} ${this.order_detail.payment.paid_date.slice(11, 16)} ${
                        this.pdf_lang == "th" ? "น." : ""
                      }`,
                      margin: [0, 5],
                      alignment: "center",
                      fontSize: 11,
                    },
                    {
                      text: this.pdf_lang == "th" ? "วันที่" : "Date",
                      margin: [0, 5],
                      alignment: "center",
                    },
                  ],
                  margin: [0, 30, 0, 0],
                },
              ],
            },
          ],
          defaultStyle: {
            font: "Kanit",
          },
          styles: {
            icon: {
              font: "Fontello",
              fontSize: 14,
            },
          },
        };
        this.pdf_open = true;
        setTimeout(() => {
          pdfMake.createPdf(docDefinition).open({}, window.frames["printPdf"]);
        }, 500);
      }
    },
    GenCourseItem() {
      let row = [
        [
          {
            text: this.pdf_lang == "th" ? "ลำดับ" : "No.",
            fillColor: "#dedede",
            alignment: "center",
          },
          {
            text: this.pdf_lang == "th" ? "รายละเอียด" : "Detail",
            fillColor: "#dedede",
            alignment: "center",
          },
          {
            text: this.pdf_lang == "th" ? "จำนวน" : "Amount",
            fillColor: "#dedede",
            alignment: "center",
          },
          {
            text:
              this.pdf_lang == "th" ? "ราคาต่อหน่วย(บาท)" : "Unit/price(Baht)",
            fillColor: "#dedede",
            alignment: "center",
          },
          {
            text: this.pdf_lang == "th" ? "ราคา(บาท)" : "Price(Baht)",
            fillColor: "#dedede",
            alignment: "center",
          },
          // {
          //   text: this.pdf_lang == "th" ? "หมายเหตุ" : "Remark",
          //   fillColor: "#dedede",
          //   alignment: "center",
          // },
        ],
      ];
      this.order_detail.orderItem.forEach((course, index) => {
        row.push([
          {
            text: `${index + 1}`,
            alignment: "center",
            color: "#ff6b81",
          },
          {
            stack: [
              {
                text: `${
                  this.pdf_lang == "th"
                    ? course?.course?.categoryNameTh
                    : course?.course?.categoryNameEng
                }`,
                color: "#ff6b81",
              },
              {
                text: `${
                  this.pdf_lang == "th"
                    ? course.course.courseNameTh
                    : course.course.courseNameEn
                }(${this.dayOfWeekArray(course.course.dayOfWeekName)} (${
                  course.course.start
                } - ${course.course.end}))`,
                color: "#ff6b81",
              },
              {
                text: `${
                  course?.cpo?.packageName ? course.cpo.packageName : ""
                }`,
                color: "#ff6b81",
              },
              {
                text: `${
                  course?.cpo?.optionName
                    ? this.pdf_lang == "th"
                      ? course.cpo.optionName
                      : course.cpo.optionNameEn
                    : ""
                }`,
                color: "#ff6b81",
              },
              {
                text: course.remark
                  ? `*หมายเหตุ: ${course.remark ? course.remark : ""}`
                  : "",
                color: "#ff6b81",
              },
            ],
            alignment: "left",
          },
          {
            text: `${course.students.length}`,
            color: "#ff6b81",
            alignment: "center",
          },
          {
            text: `${parseFloat(course.unitPrice)?.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`,
            color: "#ff6b81",
            alignment: "right",
          },
          {
            text: `${parseFloat(course.totalPrice)?.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`,
            color: "#ff6b81",
            alignment: "right",
          },
          // {
          //   text: `${course.remark}`,
          //   color: "#ff6b81",
          //   alignment: "center",
          // },
        ]);
      });
      return row;
    },
    loadImageFromFile(filePath) {
      return new Promise((resolve, reject) => {
        var img = new Image();
        img.onload = () => {
          resolve(img);
        };
        img.onerror = (error) => {
          reject(error);
        };
        img.src = filePath;
      });
    },
    convertImageToDataFile(image) {
      return new Promise((resolve, reject) => {
        var canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;

        var ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0);

        canvas.toBlob((blob) => {
          var reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result);
          };
          reader.onerror = (error) => {
            reject(error);
          };
          reader.readAsDataURL(blob);
        }, "image/png");
      });
    },
    getBase64ImageFromURL(url) {
      return new Promise((resolve, reject) => {
        var img = new Image();
        img.setAttribute("crossOrigin", "anonymous");

        img.onload = () => {
          var canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;

          var ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);

          var dataURL = canvas.toDataURL("image/png");

          resolve(dataURL);
        };

        img.onerror = (error) => {
          reject(error);
        };

        img.src = url;
      });
    },
    sendNotificationByAccount(account) {
      let payload = {
        notificationName: "แจ้งเตือนการชำระเงิน",
        notificationNameEn: "Payment reminder",
        notificationDescription: `หมายเลขออร์เดอร์ที่ ${
          this.$route.params.order_id
        } ของคุณ ${account
          .map((val) => {
            return `${val.firstNameTh} ${val.lastNameTh}`;
          })
          .join(account.length > 1 ? ", " : "")} ยังไม่ชำระเงิน`,
        notificationDescriptionEn: `Order number at ${
          this.$route.params.order_id
        } ของคุณ ${account
          .map((val) => {
            return `${val.firstNameEn} ${val.lastNameEn}`;
          })
          .join(account.length > 1 ? ", " : "")} Not yet paid`,
        accountId: account,
        path: null,
      };
      this.sendNotification(payload, true);
    },
    chengeStatus(status) {
      this.order_detail.paymentType = status.value;
    },
    cancelOrder() {
      Swal.fire({
        icon: "question",
        title: this.$t("order cancellation"),
        text: `${this.$t("want to cancel order no.")} ${
          this.order_detail.orderNumber
        }`,
        showDenyButton: false,
        showCancelButton: true,
        cancelButtonText: this.$t("no"),
        confirmButtonText: this.$t("agree"),
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.order_detail.paymentStatus = "cancel";
          this.updateOrderStatus({ order_detail: this.order_detail });
        } else {
          this.GetOrderDetail({ order_number: this.$route.params.order_id });
        }
      });
    },
    confirmPayment() {
      Swal.fire({
        icon: "question",
        title: this.$t("confirm payment"),
        text: this.$t("do you want to confirm your payment?"),
        showDenyButton: false,
        showCancelButton: true,
        cancelButtonText: this.$t("no"),
        confirmButtonText: this.$t("agree"),
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.updatePayment({ order_data: this.order_detail });
        } else {
          this.GetOrderDetail({ order_number: this.$route.params.order_id });
        }
      });
    },
    dayOfWeekArray(day) {
      let days = day;
      const weekdays = [
        this.pdf_lang == "th" ? "วันอาทิตย์" : "Sunday",
        this.pdf_lang == "th" ? "วันจันทร์" : "Monday",
        this.pdf_lang == "th" ? "วันอังคาร" : "Tuesday",
        this.pdf_lang == "th" ? "วันพุธ" : "Wednesday",
        this.pdf_lang == "th" ? "วันพฤหัสบดี" : "Thursday",
        this.pdf_lang == "th" ? "วันศุกร์" : "Friday",
        this.pdf_lang == "th" ? "วันเสาร์" : "Saturday",
      ];
      days.sort();
      let ranges = [];
      if (days[0]) {
        let rangeStart = parseInt(days[0]);
        let prevDay = rangeStart;
        for (let i = 1; i < days.length; i++) {
          const day = parseInt(days[i]);
          if (day === prevDay + 1) {
            prevDay = day;
          } else {
            const rangeEnd = prevDay;
            ranges.push({ start: rangeStart, end: rangeEnd });
            rangeStart = day;
            prevDay = day;
          }
        }
        ranges.push({ start: rangeStart, end: prevDay });
        return ranges
          .map(({ start, end }) =>
            start === end
              ? weekdays[start]
              : `${weekdays[start]} - ${weekdays[end]}`
          )
          .join(", ");
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

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
                >: {{ order_detail.student_name_list }}</rowData
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
                {{
                  order_detail.paymentStatus == "pending"
                    ? "รอดำเนินการ"
                    : order_detail.paymentStatus === "success"
                    ? "สำเร็จ"
                    : "ยกเลิก"
                }}
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
                      >
                        {{
                          `${data.course.courseNameTh}(${data.course.courseNameEn})`
                        }}</rowData
                      >
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
                        {{
                          new Date(data.startDate).toLocaleDateString("th-TH", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        }}</rowData
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
                        {{
                          `${dayOfWeekArray(data.course.dayOfWeekName)} (${
                            data.course.start
                          } - ${data.course.end})`
                        }}</rowData
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
                  <rowData
                    v-if="order_detail.payment"
                    col_header="4"
                    col_detail="8"
                    title="วันที่ชำระ"
                    >:
                    {{
                      new Date(
                        order_detail.payment.paid_date
                      ).toLocaleDateString("th-TH", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                        ? new Date(
                            order_detail.payment.paid_date
                          ).toLocaleDateString("th-TH", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "-"
                    }}
                  </rowData>
                  <rowData
                    v-if="order_detail.payment"
                    col_header="4"
                    col_detail="8"
                    title="เวลาที่ชำระ"
                    >:

                    {{ order_detail.payment.paid_date.slice(11, 16) }} น.
                  </rowData>
                </v-card-text>
              </v-card>
              <template v-if="order_detail.paymentStatus === 'success'">
                <div class="font-bold">วิธีการชำระเงิน</div>
                <v-card
                  v-for="(status, index) in payment_status.filter(
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
                            v-if="status.value == 'Credit Card'"
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
                            v-if="status.value === 'unpaid'"
                            src="../../../assets/finance/close.png"
                          ></v-img>
                          <v-img
                            v-if="status.value === 'Credit Card'"
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
                @click="exportBill()"
                >ออกใบเสร็จฉบับเต็ม</v-btn
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
                    >ส่งการแจ้งเตือน</v-btn
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
                    >ยืนยันการชำระ</v-btn
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
import { mapActions, mapGetters } from "vuex";
import Swal from "sweetalert2";
import mixin from "../../../mixin";
import pdfMake from 'pdfmake'
import pdfFonts from '../../../assets/custom-fonts.js'
export default {
  name: "financeDetail",
  components: { headerPage, rowData },
  mixins: [mixin],
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
    notification_name: "แจ้งเตือน",
    notification_description: "หมายเลขออร์เดอร์ที่ ... ยังไม่ชำระเงิน",
  }),
  created() {
    this.GetOrderDetail({ order_number: this.$route.params.order_id });
  },
  mounted() {},
  watch: {},
  computed: {
    ...mapGetters({
      order_detail: "OrderModules/getOrderDetail",
      student_list: "OrderModules/getStudentList",
    }),
  },
  methods: {
    ...mapActions({
      GetOrderDetail: "OrderModules/GetOrderDetail",
      updatePayment: "OrderModules/updatePayment",
      updateOrderStatus: "OrderModules/updateOrderStatus",
    }),
    async exportBill(){
      console.log("exportBill")
      // Define the image paths
      var headerImagePath = require('../../../assets/FrontPortfolio/Logo.png');

      // Load the images using the file loader
      var headerImageData = await this.loadImageFromFile(headerImagePath);
      // Convert image URLs to data URLs directly
      var headerImageDataUrl = await this.convertImageToDataFile(headerImageData);
      console.log(headerImageDataUrl)
      pdfMake.vfs = pdfFonts.pdfMake.vfs
      pdfMake.fonts = {
          Kanit: {
            normal: 'Kanit-Regular.ttf',
            bold: 'Kanit-Bold.ttf',
            italics: 'Kanit-Italic.ttf',
            bolditalics: 'Kanit-BoldItalic.ttf'          
          },
          Roboto: {
              normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
              bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
              italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
              bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf'
          },
      }
      var docDefinition = {
        pageMargins: [ 20, 30, 20, 30 ],
        pageSize: {
          width: 595,
          height: 842
        },
        content: [
          // Header
          {
            columns: [
              {
                width: '40%',
                stack: [
                  {
                    margin: [0, -20, 0, -20],
                    alignment: 'center',
                    image: headerImageDataUrl,
                    width: 120,
                    height: 120,
                    arguments:'justify'
                  },
                  {
                    text: [ {text:'warraphat learning sphere ',fontSize: 14}],
                    margin: [0, 0]
                  },
                  {text:'(วรพัฒน์ เลิร์นนิ่ง สเฟียร์)', fontSize: 10,},
                  {
                    text: '63 ถนน พัฒโนอุทิศ ตำบล หาดใหญ่ อำเภอหาดใหญ่ สงขลา 90110',
                    fontSize: 10,
                    margin: [0, 5]
                  },
                ]
              },
              {},
              {
                width: '40%',
                stack: [
                  {
                    text: 'ใบเสร็จรับเงิน',
                    fontSize: 24,
                    bold: false,
                    alignment: 'center',
                  },
                  {
                    text: 'ต้นฉบับ',
                    fontSize: 10,
                    bold: false,
                    alignment: 'center',
                  },
                  {
                    canvas: [
                      {
                        type: 'line',
                        x1: 0,
                        y1: 0,
                        x2: 200,
                        y2: 0,
                        lineWidth: 1,
                        color:'#999'
                      }
                    ]
                  },
                  {
                    text: `เลขที่: ${this.$route.params.order_id}`,
                    margin: [0, 5],
                    fontSize: 10,
                  },
                  {
                    text: `วันที่: ${new Date().toLocaleDateString("th-TH",{year: 'numeric', month: 'short', day: 'numeric'})} ${new Date().toLocaleTimeString("en-GB")}น.`,
                    margin: [0, 5],
                    fontSize: 10,
                  },
                  {
                    canvas: [
                      {
                        type: 'line',
                        x1: 0,
                        y1: 0,
                        x2: 200,
                        y2: 0,
                        lineWidth: 1,
                        color:'#999'
                      }
                    ]
                  },
                ]
              }
            ]
          },
          // Customer Information
          {
            columns: [
              {
                width: '10%',
                stack: [
                  {
                    text: 'ชื่อ-สกุล:',
                    margin: [0, 5]
                  },
                 
                ]
              },
              {
                stack: [
                  {
                    text: `${this.order_detail.student_name_list}`,
                    margin: [0, 5]
                  },
                ]
              }
            ]
          },
          // Table
          {
            table: {
              headerRows: 1,
              widths: ['auto', '*', 'auto'],
              body: [
                // Table headers
                [
                  {
                    text: 'ลำดับ',
                    fillColor: '#dedede',
                    alignment: 'center'
                  },
                  {
                    text: 'รายละเอียด',
                    fillColor: '#dedede',
                    alignment: 'center'
                  },
                  {
                    text: 'ราคา',
                    fillColor: '#dedede',
                    alignment: 'center'
                  }
                ],
                // Table data
                [
                  {
                    text: '1',
                    alignment: 'center'
                  },
                  {
                    text: 'Item 1',
                    alignment: 'left'
                  },
                  {
                    text: '$20',
                    alignment: 'right'
                  }
                ],
                [
                  {
                    text: '2',
                    alignment: 'center'
                  },
                  {
                    text: 'Item 2',
                    alignment: 'left'
                  },
                  {
                    text: '$15',
                    alignment: 'right'
                  }
                ],
                [
                  {
                    text: '3',
                    alignment: 'center'
                  },
                  {
                    text: 'Item 3',
                    alignment: 'left'
                  },
                  {
                    text: '$15',
                    alignment: 'right'
                  }
                ]
              ]
            },
            margin: [0, 20, 0, 20]
          },
          // Total
          {
            alignment : "center",
            canvas: [
              {
                
                type: 'line',
                x1: 0,
                y1: 0,
                x2: 540,
                y2: 0,
                lineWidth: 1,
                color:'#999'
              }
            ]
          },
          {
            columns: [
              {
                width: '40%',
                text: '( เจ็ดพันบาทถ้วน )'
              },
              {
                columns: [
                  {
                    width: '60%',
                    stack: [
                      {
                        text: 'รวมเป็นเงิน',
                        margin: [0, 5],
                        alignment : "right"
                      },
                      {
                        text: 'จำนวนเงินรวมทั้งสิ้น',
                        margin: [0, 5],
                        alignment : "right"
                      },
                    ]
                  },
                  {
                    stack: [
                      {
                        text: `${this.order_detail.totalPrice.toLocaleString("en-US",{minimumFractionDigits : 2})} บาท`,
                        margin: [0, 5],
                        alignment : "right"
                      },
                      {
                        text: `${this.order_detail.totalPrice.toLocaleString("en-US",{minimumFractionDigits : 2})} บาท`,
                        margin: [0, 5],
                        alignment : "right"
                      },
                    ]
                  }
                ]
              },
            ],
            margin: [0, 20, 0, 20],
          
          },
          {
            text : 'การชำระเงินจะสมบูรณ์เมือบริษัทได้รับเงินเรียบร้อยแล้ว',
          },
          {
            columns: [
              {
                width: "auto",
                text: 'ช่องทาง',
                margin: [0, 5],
              },
              {
                text: `${this.payment_status.filter(v => v.value == this.order_detail.paymentType)[0].text}`,
                margin: [0, 5],
                alignment : "center"
              },
              { 
                width: "auto",
                text: 'วันที่',
                margin: [0, 5],
              },
              {
                text: `${new Date( this.order_detail.payment.paid_date ).toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric"})}`,
                margin: [0, 5],
                alignment : "center"
              },
              {
                width: "auto",
                text: 'จำนวนเงิน',
                margin: [0, 5],
              },
              {
                text: `${this.order_detail.totalPrice.toLocaleString("en-US",{minimumFractionDigits : 2})} บาท`,
                margin: [0, 5],
                alignment : "center"
              },
            ]
          },
        // Footer
          
        ],
        defaultStyle:{
          font:'Kanit'
        }
      };
      let pdfDoc = pdfMake.createPdf(docDefinition)
      pdfDoc.getBlob((blob) => {
        var url = URL.createObjectURL(blob);
        // Open the PDF in a new tab
        window.open(url);
      });
    },
    GenCourseItem(){},
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
        var canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;

        var ctx = canvas.getContext('2d');
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
        }, 'image/png');
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

        img.onerror = error => {
          reject(error);
        };

        img.src = url;
      });
    },
    sendNotificationByAccount(account) {
      let payload = {
        notificationName: this.notification_name,
        notificationDescription: this.notification_description,
        accountId: account,
      };
      console.log(payload);
      this.sendNotification(payload);
    },
    chengeStatus(status) {
      this.order_detail.paymentType = status.value;
    },
    cancelOrder() {
      this.order_detail.paymentStatus = "cancel";
      Swal.fire({
        icon: "question",
        title: "การยกเลิกคำสั่งซื้อ",
        text: `ต้องการยกเลิกคำสั่งซื้อหมายเลข ${this.order_detail.orderNumber}`,
        showDenyButton: false,
        showCancelButton: true,
        cancelButtonText: "ยกเลิก",
        confirmButtonText: "ตกลง",
      }).then(async (result) => {
        if (result.isConfirmed) {
          // console.log(this.order_detail)
          this.updateOrderStatus({ order_detail: this.order_detail });
        }
      });
    },
    confirmPayment() {
      Swal.fire({
        icon: "question",
        title: "ยืนยันการชำระเงิน",
        text: "ยืนยันการชำระเงินใช่หรือไม่?",
        showDenyButton: false,
        showCancelButton: true,
        cancelButtonText: "ยกเลิก",
        confirmButtonText: "ตกลง",
      }).then(async (result) => {
        if (result.isConfirmed) {
          console.log(this.order_detail);
          this.updatePayment({ order_data: this.order_detail });
        }
      });
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
  
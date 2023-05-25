<template>
  <v-app>
    <v-container>
      <v-row>
        <v-col cols="6" sm="6" align="start">
          <headerPage title="การเงิน"></headerPage>
        </v-col>
        <v-col cols="6" sm="6" align="end">
          <v-btn color="#ff6b81" class="white--text" @click="show_dialog = true"
            >Export</v-btn
          >
        </v-col>
      </v-row>
      <v-row dense class="mb-3">
        <v-col>
          <v-text-field
            hide-details
            dense
            prepend-inner-icon="mdi-magnify"
            outlined
            placeholder="ค้นหาหมายเลขใบสั่งซื้อ, ชื่อผู้เรียน, ชื่อคอร์ส"
            v-model="search"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row dense class="mb-3">
        <v-col cols="12" sm="4" @click="tab = 'all'">
          <img-card
            title="ทั้งหมด"
            class="cursor-pointer"
            :class="tab === 'all' ? 'img-card-active' : ''"
            count="5"
            units="รายการ"
          >
            <template v-slot:img>
              <v-img
                max-height="90"
                max-width="70"
                src="../../../assets/course/all_course.png"
              ></v-img>
            </template>
            <template v-slot:header>
              <div class="font-bold">คอร์สทั่วไป</div>
            </template>
            <template v-slot:detail>
              <v-row class="d-flex align-end">
                <v-col align="center" class="text-3xl font-bold">5</v-col>
                <v-col class="text-sm">รายการ</v-col>
              </v-row>
            </template>
          </img-card>
        </v-col>
        <v-col cols="12" sm="4" @click="tab = 'paid'">
          <img-card
            class="cursor-pointer"
            :class="tab === 'paid' ? 'img-card-active' : ''"
          >
            <template v-slot:img>
              <v-img
                max-height="90"
                max-width="70"
                src="../../../assets/course/file_money.png"
              ></v-img>
            </template>
            <template v-slot:header>
              <div class="font-bold">ชำระแล้ว</div>
            </template>
            <template v-slot:detail>
              <v-row class="d-flex align-end">
                <v-col align="center" class="text-3xl font-bold">5</v-col>
                <v-col class="text-sm">รายการ</v-col>
              </v-row>
            </template>
          </img-card>
        </v-col>
        <v-col cols="12" sm="4" @click="tab = 'pending'">
          <img-card
            class="cursor-pointer"
            :class="tab === 'pending' ? 'img-card-active' : ''"
          >
            <template v-slot:img>
              <v-img
                max-height="90"
                max-width="70"
                src="../../../assets/course/short_course.png"
              ></v-img>
            </template>
            <template v-slot:header>
              <div class="font-bold">รอดำเนินการ</div>
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

      <v-data-table
        v-model="selected"
        :headers="columns"
        :items="orders"
        item-key="name"
        :search="search"
        show-select
        class="elevation-1 header-table"
      >
        <template v-slot:[`item.paymentStatus`]="{ item }">
          <div
            class="d-flex align-center pa-1 rounded-lg"
            :class="
              item.paymentStatus === 'pending'
                ? 'bg-[#FFF9E8] text-[#FCC419]'
                : item.paymentStatus === 'success'
                ? 'bg-[#F0F9EE] text-[#58A144]'
                : 'bg-[#ffeeee] text-[#f00808]'
            "
          >
            <span class="w-full text-center">{{
              item.paymentStatus == "pending"
                ? "รอดำเนินการ"
                : item.paymentStatus === "success"
                ? "สำเร็จ"
                : "ยกเลิก"
            }}</span>
          </div>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            text
            class="underline"
            color="#FF6B81"
            @click="
              $router.push({
                name: 'Finance_orderID',
                params: { order_id: item.orderId },
              })
            "
            >เพิ่มเติม</v-btn
          >
        </template>
      </v-data-table>

      <!-- <v-data-table
        :headers="columns"
        :items="orders"
        :search="search"
        v-model="selected"
        show-select
        :items-per-page="itemsPerPage"
        class="elevation-1 header-table"
      >
        <template v-slot:[`item.orderNumber`]="{ item }">
          <span class="font-semibold">{{ item.orderNumber }}</span>
        </template>
        <template v-slot:[`item.course`]="{ item }">
          <span class="font-semibold">{{ item.course }}</span>
        </template>
        <template v-slot:[`item.totalPrice`]="{ item }">
          <span class="font-semibold">{{
            item.totalPrice ? genPrice(item.totalPrice) : "-"
          }}</span>
        </template>
        <template v-slot:[`item.paymentStatus`]="{ item }">
          <div
            class="d-flex align-center pa-1 rounded-lg"
            :class="
              item.paymentStatus === 'pending'
                ? 'bg-[#FFF9E8] text-[#FCC419]'
                : item.paymentStatus === 'success'
                ? 'bg-[#F0F9EE] text-[#58A144]'
                : 'bg-[#ffeeee] text-[#f00808]'
            "
          >
            <span class="w-full text-center">{{
              item.paymentStatus == "pending"
                ? "รอดำเนินการ"
                : item.paymentStatus === "success"
                ? "สำเร็จ"
                : "ยกเลิก"
            }}</span>
          </div>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            text
            class="underline"
            color="#FF6B81"
            @click="
              $router.push({
                name: 'Finance_orderID',
                params: { order_id: item.orderId },
              })
            "
            >เพิ่มเติม</v-btn
          >
        </template>
      </v-data-table> -->

      <!-- DIALOG -->
      <v-dialog
        v-model="show_dialog"
        class="overflow-x-hidden overflow-y-hidden"
      >
        <v-card class="py-3">
          <v-card-title>
            <v-row>
              <v-col cols="6" align="end" class="font-semibold">Export</v-col>
              <v-col cols="6" align="right">
                <v-btn icon @click="show_dialog = false" v-model="closeModal">
                  <v-icon color="#ff6b81">mdi-close</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-card-title>
          <!-- รายละเอียดคอร์สเรียน -->
          <headerCard title="รายละเอียดคอร์สเรียน"></headerCard>
          <v-card-text class="py-0">
            <v-divider class="mb-3"></v-divider>
            <!-- 1 -->
            <v-row dense>
              <!-- ชื่อผู้เรียน -->
              <v-col cols="12" sm="6">
                <label-custom text="ชื่อผู้เรียน"></label-custom>
                <v-autocomplete
                  dense
                  v-model="selectStudent"
                  :items="items"
                  multiple
                  class="py-1"
                  label="กรุณากรอกชื่อผู้เรียน"
                  outlined
                  color="#FF6B81"
                  item-color="#FF6B81"
                >
                  <template v-slot:selection="{ item, index }">
                    <v-chip v-if="index === 0">
                      <span>{{ item }}</span>
                    </v-chip>
                    <span v-if="index === 1" class="grey--text text-caption">
                      (+{{ selectStudent.length - 1 }} others)
                    </span>
                  </template>
                </v-autocomplete>
              </v-col>
              <!-- สถานะการชำเงิน -->
              <v-col cols="12" sm="6">
                <label-custom text="สถานะการชำเงิน"></label-custom>
                <v-autocomplete
                  dense
                  class="py-1"
                  :items="statusPayment"
                  item-text="namePayment"
                  item-value="valuePayment"
                  label="กรุณาเลือกสถานะ"
                  outlined
                  color="#FF6B81"
                  item-color="#FF6B81"
                  v-model="selectStatusPayment"
                  multiple
                  hide-details
                >
                  <template v-slot:selection="{ item, index }">
                    <v-chip v-if="index === 0">
                      <span>{{ item.namePayment }}</span>
                    </v-chip>
                    <span v-if="index === 1" class="grey--text text-caption">
                      (+{{ selectStatusPayment.length - 1 }} others)
                    </span>
                  </template>
                </v-autocomplete>
              </v-col>
            </v-row>
            <!-- 2 -->
            <v-row dense>
              <!-- ประเภทการชำระเงิน -->
              <v-col cols="12" sm="6">
                <label-custom text="ประเภทการชำระเงิน"></label-custom>
                <v-autocomplete
                  dense
                  :items="typeOfPayment"
                  item-text="nameOfType"
                  item-value="valueOfType"
                  v-model="selectTypePayment"
                  label="กรุณาเลือกประเภทการชำระเงิน"
                  outlined
                  multiple
                  hide-details
                  class="py-1"
                  color="#FF6B81"
                  item-color="#FF6B81"
                >
                  <template v-slot:selection="{ item, index }">
                    <v-chip v-if="index === 0">
                      <span>{{ item.nameOfType }}</span>
                    </v-chip>
                    <span v-if="index === 1" class="grey--text text-caption">
                      (+{{ selectTypePayment.length - 1 }} others)
                    </span>
                  </template>
                </v-autocomplete>
              </v-col>
              <!-- ชื่อคอร์ส -->
              <v-col cols="12" sm="6">
                <label-custom text="ชื่อคอร์ส"></label-custom>
                <v-select
                  dense
                  class="py-1"
                  :items="courseName"
                  label="กรุณาเลือกชื่อคอร์ส"
                  outlined
                  color="#FF6B81"
                  v-model="selectCourseName"
                ></v-select>
              </v-col>
            </v-row>
            <!-- 3 -->
            <v-row dense>
              <!-- ประเภทคอร์ส -->
              <v-col cols="12" sm="6">
                <label-custom text="ประเภทคอร์ส"></label-custom>
                <v-autocomplete
                  dense
                  class="py-1"
                  :items="courseType"
                  item-text="typeName"
                  item-value="typeOfValue"
                  v-model="selectCoursType"
                  label="กรุณาเลือกประเภทคอร์ส"
                  outlined
                  multiple
                  color="#FF6B81"
                  item-color="#FF6B81"
                  @input="setCourseType()"
                >
                  <template v-slot:selection="{ item, index }">
                    <v-chip v-if="index === 0">
                      <span>{{ item.typeName }}</span>
                    </v-chip>
                    <span v-if="index === 1" class="grey--text text-caption">
                      (+{{ selectCoursType.length - 1 }} others)
                    </span>
                  </template>
                </v-autocomplete>
              </v-col>
              <v-col cols="12" sm="6">
                <v-row dense>
                  <!-- แพ็คเกจ -->
                  <v-col cols="12" sm="6" md="6">
                    <label-custom text="แพ็คเกจ"></label-custom>
                    <v-autocomplete
                      dense
                      :items="packages"
                      item-text="packageName"
                      item-value="packageValue"
                      v-model="selectPackages"
                      class="py-1"
                      label="กรุณาเลือกแพ็คเกจ"
                      outlined
                      multiple
                      color="#FF6B81"
                      item-color="#FF6B81"
                      :disabled="disableExportpackage"
                    >
                      <template v-slot:selection="{ item, index }">
                        <v-chip v-if="index === 0">
                          <span>{{ item.packageName }}</span>
                        </v-chip>
                        <span
                          v-if="index === 1"
                          class="grey--text text-caption"
                        >
                          (+{{ selectPackages.length - 1 }} others)
                        </span>
                      </template>
                    </v-autocomplete>
                  </v-col>
                  <!-- ระยะเวลาคอร์ส -->
                  <v-col cols="12" sm="6" md="6">
                    <label-custom text="ระยะเวลาคอร์ส"></label-custom>
                    <v-autocomplete
                      dense
                      :items="courseTime"
                      item-text="courseTimeName"
                      item-value="courseTimeValue"
                      v-model="selectCourseTime"
                      class="py-1"
                      label="กรุณาเลือกระยะเวลา"
                      outlined
                      multiple
                      color="#FF6B81"
                      item-color="#FF6B81"
                    >
                      <template v-slot:selection="{ item, index }">
                        <v-chip v-if="index === 0">
                          <span>{{ item.courseTimeName }}</span>
                        </v-chip>
                        <span
                          v-if="index === 1"
                          class="grey--text text-caption"
                        >
                          (+{{ selectCourseTime.length - 1 }} others)
                        </span>
                      </template>
                    </v-autocomplete>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-card-text>
          <!-- รายละเอียดการชำระเงิน -->

          <headerCard title="รายละเอียดการชำระเงิน"></headerCard>
          <v-card-text class="py-0">
            <v-divider class="mb-3"></v-divider>
            <!-- วันที่สร้างเอกสาร -->
            <v-row dense>
              <v-col cols="12" sm="6">
                <v-row>
                  <v-col cols="12" sm="6">
                    <label-custom text="วันที่สร้างเอกสาร"></label-custom>
                    <v-menu
                      v-model="selectDateDocStart"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          dense
                          v-model="dateDocStart"
                          label="เลือกระยะเวลาเริ่ม"
                          outlined
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                          color="#FF6B81"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="dateDocStart"
                        @input="selectDateDocStart = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>

                  <v-col cols="12" sm="6">
                    <label-custom text=" ถึง"></label-custom>
                    <v-menu
                      v-model="selectDateDocEnd"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          dense
                          v-model="dateDocEnd"
                          label="เลือกระยะเวลาสิ้นสุด"
                          outlined
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                          color="#FF6B81"
                          :disabled="!dateDocStart"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="dateDocEnd"
                        @input="selectDateDocEnd = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                </v-row>
              </v-col>

              <!-- วันที่ชำระ -->
              <v-col cols="12" sm="6">
                <v-row>
                  <v-col cols="12" sm="6">
                    <label-custom text="วันที่ชำระ"></label-custom>
                    <v-menu
                      v-model="selectDatePayStart"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          dense
                          v-model="datePayStart"
                          label="เลือกระยะเวลาเริ่ม"
                          outlined
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                          color="#FF6B81"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="datePayStart"
                        @input="selectDatePayStart = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>

                  <v-col cols="12" sm="6">
                    <label-custom text=" ถึง"></label-custom>

                    <v-menu
                      v-model="selectDatePayEnd"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          dense
                          v-model="datePayEnd"
                          label="เลือกระยะเวลาสิ้นสุด"
                          outlined
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                          color="#FF6B81"
                          :disabled="!datePayStart"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="datePayEnd"
                        @input="selectDatePayEnd = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row dense>
              <v-col cols="12" sm="6">
                <label-custom text="มูลค่าบริการ"></label-custom>
                <v-text-field
                  label="กรุณากรอกมูลค่าบริการ"
                  outlined
                  dense
                  v-model="serviceChargeStart"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <label-custom text="ถึง"></label-custom>
                <v-text-field
                  label="กรุณากรอกมูลค่าบริการ"
                  outlined
                  dense
                  v-model="serviceChargeEnd"
                >
                </v-text-field>
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-text
            class="py-0"
            v-if="
              dateDocStart != '' ||
              dateDocEnd != '' ||
              datePayStart != '' ||
              datePayEnd != ''
            "
          >
            <div class="mdi mdi-chat-alert">
              สามารถเลือกกรอกเฉพาะรายการที่ต้องการ Export
            </div>
          </v-card-text>

          <!-- BUTTON -->
          <v-card-text class="py-0">
            <v-row dense>
              <v-col cols="12" sm="6"></v-col>
              <v-col cols="12" sm="6">
                <v-row>
                  <v-col cols="12" sm="8" align="end">
                    <v-btn depressed @click="closeDialog()">
                      ล้างข้อมูล
                    </v-btn></v-col
                  >
                  <v-col cols="12" sm="4" align="end">
                    <v-btn depressed color="error"> เรียกดูทั้งหมด </v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-container>
  </v-app>
</template>
<script>
import imgCard from "@/components/course/imgCard.vue";
import headerPage from "@/components/header/headerPage.vue";
import headerCard from "@/components/header/headerCard.vue";
import LabelCustom from "../../../components/label/labelCustom.vue";
import { dateFormatter } from "@/functions/functions";

import { mapActions, mapGetters } from "vuex";
export default {
  name: "financeList",
  components: {
    headerPage,
    imgCard,
    headerCard,
    LabelCustom,
  },
  data: () => ({
    search: "",
    itemsPerPage: 10,
    show_dialog: false,
    selectStudent: "",
    selectStatusPayment: "",
    statusPayment: [
      { namePayment: "ชำระแล้ว", valuePayment: "Payed" },
      { namePayment: "รอดำเนินการ", valuePayment: "waitToPayed" },
    ],
    selectTypePayment: "",
    typeOfPayment: [
      { nameOfType: "เงินสด", valueOftype: "cash" },
      { nameOfType: "บัตรเครดิต / เดบิต", valueOftype: "card" },
      { nameOfType: "โอนเงินเข้าบัญชี", valueOftype: "banckIn" },
    ],
    selectCourseName: "",
    courseName: [],
    selectCoursType: [],
    courseType: [
      { typeName: "คอร์สทั่วไป", typeOfValue: "CT_1" },
      { typeName: "คอร์สระยะสั้น", typeOfValue: "CT_2" },
    ],
    selectPackages: "",
    packages: [
      { packageName: "Exclusive Package", packageValue: "Exclusive Package" },
      { packageName: "Family Package", packageValue: "Family Package" },
      { packageName: "Group Package", packageValue: "Group Package" },
    ],
    selectCourseTime: "",
    courseTime: [
      { courseTimeName: "รายวัน", courseTimeValue: "day" },
      { courseTimeName: "รายเดือน", courseTimeValue: "month" },
      { courseTimeName: "รายเทอม", courseTimeValue: "semester" },
      { courseTimeName: "รายปี", courseTimeValue: "year" },
    ],

    disableExportpackage: false,
    selectDate: true,
    open_date: "",

    dateDocStart: "",
    dateDocEnd: "",
    selectDateDocStart: false,
    selectDateDocEnd: false,
    datePayStart: "",
    datePayEnd: "",
    selectDatePayStart: false,
    selectDatePayEnd: false,
    serviceChargeStart: "",
    serviceChargeEnd: "",
    closeModal: true,

    selected: [],
    headers: [
      {
        text: "Dessert (100g serving)",
        align: "start",
        sortable: false,
        value: "name",
      },
      { text: "Calories", value: "calories" },
      { text: "Fat (g)", value: "fat" },
      { text: "Carbs (g)", value: "carbs" },
      { text: "Protein (g)", value: "protein" },
      { text: "Iron (%)", value: "iron" },
    ],
    desserts: [
      {
        name: "Frozen Yogurt",
        calories: 159,
        fat: 6.0,
        carbs: 24,
        protein: 4.0,
        iron: 1,
      },
      {
        name: "Ice cream sandwich",
        calories: 237,
        fat: 9.0,
        carbs: 37,
        protein: 4.3,
        iron: 1,
      },
      {
        name: "Eclair",
        calories: 262,
        fat: 16.0,
        carbs: 23,
        protein: 6.0,
        iron: 7,
      },
      {
        name: "Cupcake",
        calories: 305,
        fat: 3.7,
        carbs: 67,
        protein: 4.3,
        iron: 8,
      },
      {
        name: "Gingerbread",
        calories: 356,
        fat: 16.0,
        carbs: 49,
        protein: 3.9,
        iron: 16,
      },
      {
        name: "Jelly bean",
        calories: 375,
        fat: 0.0,
        carbs: 94,
        protein: 0.0,
        iron: 0,
      },
      {
        name: "Lollipop",
        calories: 392,
        fat: 0.2,
        carbs: 98,
        protein: 0,
        iron: 2,
      },
      {
        name: "Honeycomb",
        calories: 408,
        fat: 3.2,
        carbs: 87,
        protein: 6.5,
        iron: 45,
      },
      {
        name: "Donut",
        calories: 452,
        fat: 25.0,
        carbs: 51,
        protein: 4.9,
        iron: 22,
      },
      {
        name: "KitKat",
        calories: 518,
        fat: 26.0,
        carbs: 65,
        protein: 7,
        iron: 6,
      },
    ],

    tab: "all",
    items: ["ทั้งหมด", "ชำระเงินแล้ว", "รอดำเนินการ"],
    columns: [
      {
        text: "หมายเลขคำสั่งซื้อ",
        align: "start",
        sortable: false,
        value: "orderNumber",
        width: 150,
      },
      {
        text: "ชื่อผู้เรียน",
        align: "center",
        sortable: false,
        value: "student_name",
      },
      {
        text: "นามสกุลผู้เรียน",
        align: "center",
        sortable: false,
        value: "student_name",
      },
      { text: "ชื่อคอร์ส", align: "center", sortable: false, value: "course" },
      { text: "ราคา", align: "center", sortable: false, value: "totalPrice" },
      {
        text: "สถานะการชำระ",
        align: "center",
        sortable: false,
        value: "paymentStatus",
      },
      {
        text: "วันที่ชำระ",
        align: "center",
        sortable: false,
        value: "paid_date",
      },
      { text: "", align: "center", value: "actions", sortable: false },
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
    this.GetOrders();
  },
  methods: {
    ...mapActions({
      GetOrders: "OrderModules/GetOrders",
    }),
    genPrice(price) {
      return price.toLocaleString();
    },
    setCourseType() {
      if (
        this.selectCoursType.length === 1 &&
        this.selectCoursType.includes("CT_2")
      ) {
        console.log("ปิด");
        this.disableExportpackage = true;
      } else {
        console.log("เปิด");
        this.disableExportpackage = false;
      }
    },
    inputDate(e, data) {
      switch (data) {
        case "course open":
          this.open_date = dateFormatter(e, "DD MT YYYYT");
          break;
        case "register start date":
          this.register_date_range_str.start_date = dateFormatter(
            e,
            "DD MT YYYYT"
          );
          break;
        case "register end date":
          this.register_date_range_str.end_date = dateFormatter(
            e,
            "DD MT YYYYT"
          );
          break;
        case "class start date":
          this.class_date_range_str.start_date = dateFormatter(
            e,
            "DD MT YYYYT"
          );
          break;
        case "class end date":
          this.class_date_range_str.end_date = dateFormatter(e, "DD MT YYYYT");
          break;
      }
    },
    closeDialog() {
      (this.selectStudent = ""),
        (this.selectStatusPayment = ""),
        (this.selectTypePayment = ""),
        (this.selectCourseName = ""),
        (this.selectPackages = ""),
        (this.selectCourseTime = ""),
        (this.dateDocStart = ""),
        (this.dateDocEnd = ""),
        (this.datePayStart = ""),
        (this.datePayEnd = ""),
        (this.serviceChargeStart = ""),
        (this.serviceChargeEnd = "");
    },
  },
  computed: {
    ...mapGetters({
      orders: "OrderModules/getOrders",
    }),
  },
  watch: {},
};
</script>
<style>
</style>
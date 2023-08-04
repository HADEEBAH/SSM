<template>
  <v-app>
    <loading-overlay :loading="orders_is_loading"></loading-overlay>
    <v-container v-if="!orders_is_loading">
      <v-row>
        <v-col cols="6" sm="6" align="start">
          <headerPage title="การเงิน"></headerPage>
        </v-col>
        <v-col cols="6" sm="6" align="end">
          <v-btn
            depressed
            color="#ff6b81"
            class="white--text"
            @click="ShowDialogExport"
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
              <div class="font-bold">ทั้งหมด</div>
            </template>
            <template v-slot:detail>
              <v-row class="d-flex align-end">
                <v-col align="center" class="text-3xl font-bold">{{
                  orders.length
                }}</v-col>
                <v-col class="text-sm">รายการ</v-col>
              </v-row>
            </template>
          </img-card>
        </v-col>
        <v-col cols="12" sm="4" @click="tab = 'success'">
          <img-card
            class="cursor-pointer"
            :class="tab === 'success' ? 'img-card-active' : ''"
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
                <v-col align="center" class="text-3xl font-bold">{{
                  orders.filter((v) => v.payment_status === "success").length
                }}</v-col>
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
                <v-col align="center" class="text-3xl font-bold">{{
                  orders.filter((v) => v.payment_status === "pending").length
                }}</v-col>
                <v-col class="text-sm">รายการ</v-col>
              </v-row>
            </template>
          </img-card>
        </v-col>
      </v-row>
      <v-data-table
        v-model="selected"
        :headers="columns"
        :items="
          tab == 'all' ? orders : orders.filter((v) => v.payment_status === tab)
        "
        item-key="order_number"
        :search="search"
        show-select
        class="elevation-1 header-table"
      >
        <template v-slot:[`item.total_price`]="{ item }">
          {{
            item.total_price.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })
          }}
        </template>
        <template v-slot:[`item.payment_status`]="{ item }">
          <div
            class="d-flex align-center pa-1 rounded-lg"
            :class="
              item.payment_status === 'pending'
                ? 'bg-[#FFF9E8] text-[#FCC419]'
                : item.payment_status === 'success'
                ? 'bg-[#F0F9EE] text-[#58A144]'
                : 'bg-[#ffeeee] text-[#f00808]'
            "
          >
            <span class="w-full text-center">{{
              item.payment_status == "pending"
                ? "รอดำเนินการ"
                : item.payment_status === "success"
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
                params: { order_id: item.order_number },
              })
            "
            >เพิ่มเติม</v-btn
          >
        </template>
        <template v-slot:[`no-results`]>
          <div class="font-bold">ไม่พบข้อมูลในตาราง</div>
        </template>
      </v-data-table>
      <!-- DIALOG -->
      <v-dialog v-model="show_dialog">
        <v-card class="pa-3">
          <v-row>
            <v-col cols="12" align="right">
              <v-btn icon @click="closeDialog()">
                <v-icon color="#ff6b81">mdi-close</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-card-title>
            <v-row dense>
              <v-col cols="12" align="center" class="font-semibold"
                >Export</v-col
              >
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
                  v-model="export_filter.students"
                  :items="username_list"
                  :search-input.sync="search_student"
                  @input="search_student = null"
                  multiple
                  item-text="fullname"
                  item-value="userOneId"
                  class="py-1"
                  label="กรุณากรอกชื่อผู้เรียน"
                  outlined
                  color="#FF6B81"
                  item-color="#FF6B81"
                >
                  <template v-slot:no-data>
                    <v-list-item>
                      <v-list-item-title> ไม่พบข้อมูล </v-list-item-title>
                    </v-list-item>
                  </template>
                  <template v-slot:selection="data">
                    <v-chip
                      v-bind="data.attrs"
                      :input-value="data.selected"
                      color="#FBF3F5"
                    >
                      {{ `${data.item.firstNameTh} ${data.item.lastNameTh}` }}
                      <v-icon
                        @click="remove(data.item.userOneId)"
                        color="#ff6b81"
                        >mdi-close-circle</v-icon
                      >
                    </v-chip>
                  </template>
                  <template v-slot:item="{ item }">
                    {{ `${item.firstNameTh} ${item.lastNameTh}` }}
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
                  v-model="export_filter.payment_status"
                  multiple
                  hide-details
                >
                  <template v-slot:selection="{ item, index }">
                    <v-chip dark v-if="index === 0" color="#FF6B81">
                      <span>{{ item.namePayment }}</span>
                    </v-chip>
                    <span v-if="index === 1" class="grey--text text-caption">
                      (+{{ export_filter.payment_status.length - 1 }} others)
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
                <!-- {{ export_filter.payment_type }} -->
                <v-autocomplete
                  dense
                  :items="typeOfPayment"
                  item-text="name"
                  item-value="value"
                  v-model="export_filter.payment_type"
                  label="กรุณาเลือกประเภทการชำระเงิน"
                  outlined
                  multiple
                  hide-details
                  class="py-1"
                  color="#FF6B81"
                  item-color="#FF6B81"
                >
                  <template v-slot:selection="{ item, index }">
                    <v-chip dark v-if="index === 0" color="#FF6B81">
                      <span>{{ item.name }}</span>
                    </v-chip>
                    <span v-if="index === 1" class="grey--text text-caption">
                      (+{{ export_filter.payment_type.length - 1 }} others)
                    </span>
                  </template>
                </v-autocomplete>
              </v-col>
              <!-- ชื่อคอร์ส -->
              <v-col cols="12" sm="6">
                <label-custom text="ชื่อคอร์ส"></label-custom>
                <v-autocomplete
                  dense
                  :items="courses"
                  item-text="course"
                  item-value="course_id"
                  v-model="export_filter.course_id"
                  label="กรุณาเลือกชื่อคอร์ส"
                  outlined
                  multiple
                  hide-details
                  class="py-1"
                  color="#FF6B81"
                  item-color="#FF6B81"
                >
                  <template v-slot:selection="{ item, index }">
                    <v-chip dark v-if="index === 0" color="#FF6B81">
                      <span>{{ item.course }}</span>
                    </v-chip>
                    <span v-if="index === 1" class="grey--text text-caption">
                      (+{{ export_filter.course_id.length - 1 }} others)
                    </span>
                  </template>
                </v-autocomplete>
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
                  v-model="export_filter.course_type_id"
                  label="กรุณาเลือกประเภทคอร์ส"
                  outlined
                  multiple
                  color="#FF6B81"
                  item-color="#FF6B81"
                  @input="setCourseType()"
                >
                  <template v-slot:selection="{ item, index }">
                    <v-chip dark v-if="index === 0" color="#FF6B81">
                      <span>{{ item.typeName }}</span>
                    </v-chip>
                    <span v-if="index === 1" class="grey--text text-caption">
                      (+{{ export_filter.course_type_id.length - 1 }} others)
                    </span>
                  </template>
                </v-autocomplete>
              </v-col>
              <v-col cols="12" sm="6">
                <v-row dense>
                  <!-- แพ็กเกจ -->
                  <v-col cols="12" sm="6" md="6">
                    <label-custom text="แพ็กเกจ"></label-custom>
                    <v-autocomplete
                      dense
                      :items="packages"
                      item-text="packageName"
                      item-value="packageId"
                      v-model="export_filter.package_id"
                      class="py-1"
                      label="กรุณาเลือกแพ็กเกจ"
                      outlined
                      multiple
                      color="#FF6B81"
                      item-color="#FF6B81"
                      :disabled="disableExportpackage"
                    >
                      <template v-slot:selection="{ item, index }">
                        <v-chip dark v-if="index === 0" color="#FF6B81">
                          <span>{{ item.packageName }}</span>
                        </v-chip>
                        <span
                          v-if="index === 1"
                          class="grey--text text-caption"
                        >
                          (+{{ export_filter.package_id.length - 1 }} others)
                        </span>
                      </template>
                    </v-autocomplete>
                  </v-col>
                  <!-- ระยะเวลาคอร์ส -->
                  <v-col cols="12" sm="6" md="6">
                    <label-custom text="ระยะเวลาคอร์ส"></label-custom>
                    <v-autocomplete
                      dense
                      :items="options"
                      item-text="optionName"
                      item-value="optionId"
                      v-model="export_filter.option_id"
                      class="py-1"
                      label="กรุณาเลือกระยะเวลา"
                      outlined
                      multiple
                      color="#FF6B81"
                      item-color="#FF6B81"
                    >
                      <template v-slot:selection="{ item, index }">
                        <v-chip dark v-if="index === 0" color="#FF6B81">
                          <span>{{ item.optionName }}</span>
                        </v-chip>
                        <span
                          v-if="index === 1"
                          class="grey--text text-caption"
                        >
                          (+{{ export_filter.option_id.length - 1 }} others)
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
                      v-model="export_filter.select_date_doc_start"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          dense
                          v-model="export_filter.date_doc_start"
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
                        v-model="export_filter.date_doc_start"
                        @input="export_filter.select_date_doc_start = false"
                        locale="th-TH"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>

                  <v-col cols="12" sm="6">
                    <label-custom text=" ถึง"></label-custom>
                    <v-menu
                      v-model="export_filter.select_date_doc_end"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          dense
                          v-model="export_filter.date_doc_end"
                          label="เลือกระยะเวลาสิ้นสุด"
                          outlined
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                          color="#FF6B81"
                          :disabled="!export_filter.date_doc_start"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="export_filter.date_doc_end"
                        @input="export_filter.select_date_doc_end = false"
                        :min="export_filter.date_doc_start"
                        locale="th-TH"
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
                      v-model="export_filter.select_date_pay_start"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          dense
                          v-model="export_filter.date_pay_start"
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
                        v-model="export_filter.date_pay_start"
                        @input="export_filter.select_date_pay_start = false"
                        locale="th-TH"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>

                  <v-col cols="12" sm="6">
                    <label-custom text=" ถึง"></label-custom>

                    <v-menu
                      v-model="export_filter.select_date_pay_end"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          dense
                          v-model="export_filter.date_pay_end"
                          label="เลือกระยะเวลาสิ้นสุด"
                          outlined
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                          color="#FF6B81"
                          :disabled="!export_filter.date_pay_start"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="export_filter.date_pay_end"
                        @input="export_filter.select_date_pay_end = false"
                        :min="export_filter.date_pay_start"
                        locale="th-TH"
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
                  type="number"
                  v-model="export_filter.service_charge_start"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <label-custom text="ถึง"></label-custom>
                <v-text-field
                  label="กรุณากรอกมูลค่าบริการ"
                  outlined
                  dense
                  type="number"
                  v-model="export_filter.service_charge_end"
                >
                </v-text-field>
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-text
            class="py-0"
            v-if="
              export_filter.date_pay_start != '' ||
              export_filter.date_doc_end != '' ||
              export_filter.date_pay_start != '' ||
              export_filter.date_pay_end != ''
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
                    <v-btn depressed @click="clearDateExport()"
                      >ล้างข้อมูล</v-btn
                    ></v-col
                  >
                  <v-col cols="12" sm="4" align="end">
                    <v-btn
                      :loading="finance_filter_loading"
                      depressed
                      dark
                      color="#ff6b81"
                      @click="Export()"
                    >
                      เรียกดูทั้งหมด
                    </v-btn>
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
import loadingOverlay from "../../../components/loading/loadingOverlay.vue";
import { mapActions, mapGetters } from "vuex";
export default {
  name: "financeList",
  components: {
    headerPage,
    imgCard,
    headerCard,
    LabelCustom,
    loadingOverlay,
  },
  data: () => ({
    search: "",
    search_student: null,
    itemsPerPage: 10,
    show_dialog: false,
    statusPayment: [
      { namePayment: "ชำระแล้ว", valuePayment: "success" },
      { namePayment: "รอดำเนินการ", valuePayment: "pending" },
      { namePayment: "ยกเลิก", valuePayment: "cancel" },
    ],
    typeOfPayment: [
      { name: "เงินสด", value: "cash" },
      { name: "บัตรเครดิต / เดบิต", value: "Credit Card" },
      { name: "โอนเงินเข้าบัญชี", value: "transfer" },
    ],
    courseName: [],
    courseType: [
      { typeName: "คอร์สทั่วไป", typeOfValue: "CT_1" },
      { typeName: "คอร์สระยะสั้น", typeOfValue: "CT_2" },
    ],
    export_filter: {
      course_id: [],
      course_type_id: [],
      students: [],
      payment_type: [],
      payment_status: [],
      option_id: "",
      package_id: [],
      select_date_doc_start: false,
      select_date_doc_end: false,
      date_doc_start: "",
      date_doc_end: "",
      select_date_pay_start: false,
      select_date_pay_end: false,
      date_pay_start: "",
      date_pay_end: "",
      service_charge_start: "",
      service_charge_end: "",
    },
    disableExportpackage: false,
    selectDate: true,
    open_date: "",
    closeModal: true,
    selected: [],
    tab: "all",
    items: ["ทั้งหมด", "ชำระเงินแล้ว", "รอดำเนินการ"],
    columns: [
      {
        text: "หมายเลขคำสั่งซื้อ",
        align: "start",
        sortable: false,
        value: "order_number",
        width: 150,
      },
      {
        text: "ชื่อ-นามสกุลผู้เรียน",
        align: "center",
        sortable: false,
        value: "student_name",
      },
      {
        text: "ชื่อคอร์ส",
        align: "center",
        sortable: false,
        value: "course_name",
      },
      { text: "ราคา", align: "center", sortable: false, value: "total_price" },
      {
        text: "สถานะการชำระ",
        align: "center",
        sortable: false,
        value: "payment_status",
      },
      {
        text: "วันที่ชำระ",
        align: "center",
        sortable: false,
        value: "paid_date",
      },
      { text: "", align: "center", value: "actions", sortable: false },
    ],
  }),
  created() {
    this.GetCoursesList();
    this.GetOptions();
    this.GetPackages();
    this.GetOrders();
  },
  mounted() {},
  methods: {
    ...mapActions({
      GetOrders: "OrderModules/GetOrders",
      GetCoursesList: "CourseModules/GetCoursesList",
      GetOptions: "CourseModules/GetOptions",
      GetPackages: "CourseModules/GetPackages",
      financeFilter: "FinanceModules/financeFilter",
      searchNameUser: "loginModules/searchNameUser",
    }),
    remove(item) {
      const index = this.export_filter.students.indexOf(item);
      if (index >= 0) {
        const index = this.export_filter.students.splice(index, 1);
      }
    },
    ShowDialogExport() {
      this.export_filter.course_id = [];
      this.export_filter.course_type_id = [];
      this.export_filter.students = [];
      this.export_filter.payment_type = [];
      this.export_filter.payment_status = [];
      this.selected.forEach((order) => {
        console.log(order);
        if (!this.export_filter.course_id.includes(order.course_id)) {
          this.export_filter.course_id.push(order.course_id);
        }
        if (!this.export_filter.course_type_id.includes(order.course_type_id)) {
          this.export_filter.course_type_id.push(order.course_type_id);
        }
        if (!this.export_filter.payment_type.includes(order.payment_type)) {
          this.export_filter.payment_type.push(order.payment_type);
        }
        if (!this.export_filter.payment_status.includes(order.payment_status)) {
          this.export_filter.payment_status.push(order.payment_status);
        }
      });
      this.show_dialog = true;
    },
    genPrice(price) {
      return price.toLocaleString();
    },
    setCourseType() {
      if (
        this.export_filter.course_type_id.length === 1 &&
        this.export_filter.course_type_id.includes("CT_2")
      ) {
        // console.log("ปิด");
        this.disableExportpackage = true;
      } else {
        // console.log("เปิด");
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
    Export() {
      this.financeFilter({ filter: this.export_filter });
    },
    closeDialog() {
      this.show_dialog = false;
      this.clearDateExport();
    },
    clearDateExport() {
      this.export_filter = {
        course_id: [],
        course_type_id: [],
        students: [],
        payment_type: [],
        payment_status: [],
        option_id: [],
        package_id: [],
        select_date_doc_start: false,
        select_date_doc_end: false,
        date_doc_start: "",
        date_doc_end: "",
        select_date_pay_start: false,
        select_date_pay_end: false,
        date_pay_start: "",
        date_pay_end: "",
        service_charge_start: "",
        service_charge_end: "",
      };
    },
  },
  computed: {
    ...mapGetters({
      orders: "OrderModules/getOrders",
      orders_is_loading: "OrderModules/getOrdersIsLoading",
      courses: "CourseModules/getCourses",
      students: "OrderModules/getStudents",
      username_list: "loginModules/getUsernameList",
      packages: "CourseModules/getPackages",
      options: "CourseModules/getOptions",
      finance_filter: "FinanceModules/getFinanceFilter",
      finance_filter_loading: "FinanceModules/getFinanceLoading",
    }),
  },
  watch: {
    search_student(val) {
      console.log(val);
      if (val.length > 3) {
        this.loading = true;
        this.searchNameUser({ search_name: val }).then(() => {
          this.loading = false;
        });
      }
    },
  },
};
</script>
<style>
</style>
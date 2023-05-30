<template>
  <v-app>
    <v-container>
      <headerPage title="เพิ่มผู้เรียน"></headerPage>
      <v-row dense class="mb-3">
        <v-col cols="12" sm>
          <label-custom text="ผู้เรียน"></label-custom>
          <v-row class="d-flex align-center">
            <v-col cols="12" sm="8" class="mt-2">
              <v-autocomplete
                chips
                deletable-chips
                hide-details
                :loading="loading"
                prepend-inner-icon="mdi-magnify"
                dense
                cache-items
                v-model="students"
                :items="student"
                :search-input.sync="search"
                placeholder="ค้นหา/เลือกผู้เรียน"
                label="ค้นหา/เลือกผู้เรียน"
                outlined
                multiple
                clearable
                item-color="#ff6b81"
                color="#ff6b81"
                item-value="student_name"
              >
                <template v-slot:selection="data">
                  <v-chip
                    v-bind="data.attrs"
                    :input-value="data.selected"
                    @click="data.select"
                    color="#FBF3F5"
                  >
                    {{ data.item }}
                    <v-icon @click="remove(data.item)" color="#ff6b81"
                      >mdi-close-circle</v-icon
                    >
                  </v-chip>
                </template>
              </v-autocomplete>
            </v-col>
            <v-col cols="12" sm="auto">
              <label
                class="primary--text cursor-pointer underline"
                @click="changeDialogRegisterOneId(true)"
                >สมัคร One ID</label
              >
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-form ref="course_form" v-model="validate_form">
        <v-card
        v-for="(course, course_index) in order.courses"
        class="mb-3"
        :key="course_index"
        >
          <v-row class="pa-2">
            <v-col align="right">
              <v-icon larg color="#FF6B81" @click="removeCourse(course_index)" v-if="order.courses.length >= 2" > mdi-delete </v-icon>
            </v-col>
          </v-row>
          <v-card-text>
            <v-row>
              <!--  คอร์สทั่วไป btn -->
              <v-col cols="auto">
                <v-btn
                  outlined
                  @click="selectCourseType('CT_1', course)"
                  :color="course.course_type_id === 'CT_1' ? '#ff6b81' : '#999999'"><v-icon>
                    {{ course.course_type_id === "CT_1"
                        ? "mdi-radiobox-marked"
                        : "mdi-radiobox-blank"
                    }}</v-icon
                  > คอร์สทั่วไป</v-btn>
              </v-col>
              <!-- คอร์สระยะสั้น btn -->
              <v-col>
                <v-btn
                  @click="selectCourseType('CT_2', course)"
                  outlined
                  :color="course.course_type_id === 'CT_2' ? '#ff6b81' : '#999999'"
                  ><v-icon>{{
                    course.course_type_id === "CT_2" ? "mdi-radiobox-marked" : "mdi-radiobox-blank"
                  }}</v-icon>
                  คอร์สระยะสั้น</v-btn
                >
              </v-col>
            </v-row>
            <!-- คอร์สทั่วไป detail -->
            <v-row dense>
              <v-col cols="12" sm="4">
                <label-custom text="อาณาจักร"></label-custom>
                <v-autocomplete
                  dense
                  item-value="categoryId"
                  item-text="categoryNameTh"
                  v-model="course.category_id"
                  :items="categorys"
                  placeholder="เลือกอาณาจักร"
                  :rules="rules.category"
                  outlined
                  color="pink"
                  item-color="pink"
                  @change="selectCategory($event, course.course_type_id, course)"
                >
                  <template v-slot:no-data>
                    <v-list-item>
                      <v-list-item-title> ไม่พบข้อมูล </v-list-item-title>
                    </v-list-item>
                  </template>
                  <template v-slot:item="{ item }">
                    <v-list-item-content>
                      <v-list-item-title
                        ><span
                          :class="course.category_id === item.categoryId ? 'font-bold' : ''"
                          >{{ item.categoryNameTh }}</span
                        ></v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-icon>{{ course.category_id === item.categoryId ? "mdi-check-circle" : "mdi-radiobox-blank" }}</v-icon>
                    </v-list-item-action>
                  </template>
                </v-autocomplete>
              </v-col>
              <v-col cols="12" sm="4" v-if="course.course_options.length > 0">
                <label-custom text="คอร์สเรียน"></label-custom>
                <v-autocomplete
                  dense
                  item-value="course_id"
                  item-text="course_name_th"
                  v-model="course.course_id"
                  :items="course.course_options"
                  :rules="rules.course"
                  placeholder="เลือกคอร์สเรียน"
                  outlined
                  color="pink"
                  item-color="pink"
                  @change="selectCourse(course.course_id, course)"
                >
                  <template v-slot:no-data>
                    <v-list-item>
                      <v-list-item-title> ไม่พบข้อมูล </v-list-item-title>
                    </v-list-item>
                  </template>
                  <template v-slot:item="{ item }">
                    <v-list-item-content>
                      <v-list-item-title
                        ><span
                          :class="
                            course.course_id === item.course_id ? 'font-bold' : ''
                          "
                          >{{ item.course_name_th }}</span
                        ></v-list-item-title
                      >
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-icon>
                        {{
                          course.course_id === item.course_id
                            ? "mdi-check-circle"
                            : "mdi-radiobox-blank"
                        }}</v-icon
                      >
                    </v-list-item-action>
                  </template>
                </v-autocomplete>
              </v-col>
            </v-row>
            <v-row dense v-if="course.course_type_id == 'CT_1' && course.course_data && course">
              <v-col cols="12" sm="4">
                <label-custom text="แพ็คเกจ"></label-custom>
                <v-autocomplete
                  item-value="package_id"
                  item-text="package"
                  item-color="pink"
                  color="pink"
                  dense
                  :rules="rules.package"
                  v-model="course.package"
                  :items="course.course_data.packages"
                  placeholder="เลือกแพ็คเกจ"
                  outlined
                  @change="course.option_data = {}"
                >
                </v-autocomplete>
              </v-col>
              <v-col cols="12" sm="4" v-if="course.package">
                <label-custom text="ระยะเวลา"></label-custom>
                <v-autocomplete
                  dense
                  :rules="rules.option"
                  v-model="course.option_data"
                  :items="course.course_data.packages.filter(v => v.package_id == course.package)[0].options"
                  placeholder="เลือกระยะเวลา"
                  outlined
                  item-color="pink"
                  color="pink"
                  @change="Calprice(course)"
                >
                  <template v-slot:selection="data">
                  {{ `${ data.item.option_name }` }}
                  </template>
                  <template v-slot:item="{ item }">
                    <v-list-item-content>
                      <v-list-item-title
                        ><span
                          :class="
                            course.option_data.package_id === item.package_id ? 'font-bold' : ''
                          "
                          >{{ item.option_name }}</span
                        ></v-list-item-title
                      >
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-icon>
                        {{
                          course.option_data.package_id === item.package_id
                            ? "mdi-check-circle"
                            : "mdi-radiobox-blank"
                        }}</v-icon
                      >
                    </v-list-item-action>
                  </template>
                </v-autocomplete>
              </v-col>
              <v-col v-if="course.option_data" cols="12" sm="2" >
                <label-custom text="จำนวนครั้ง"></label-custom>
                <v-text-field
                    dense
                    disabled
                    :value="course.option_data.amount"
                    outlined
                  ></v-text-field>
              </v-col>
            </v-row>
            <v-row dense v-if="course.course_type_id == 'CT_1' && course.course_data && course.course_id">
              <v-col cols="12" sm="2">
                <label-custom text="วัน"></label-custom> 
                <v-autocomplete
                  dense
                  :rules="rules.day"
                  v-model="course.day"
                  item-text="dayName"
                  item-value="day_of_week_id"
                  :items="course.course_data.days_of_class"
                  placeholder="เลือกวัน"
                  outlined
                  item-color="pink"
                  color="pink"
                >
                </v-autocomplete>
              </v-col>
              <v-col cols="12" sm="3" v-if="course.day">
                <label-custom text="เวลา"></label-custom>
                <v-select
                  dense
                  :rules="rules.time"
                  v-model="course.time"
                  :items="course.course_data.days_of_class.filter(v => v.day_of_week_id === course.day)[0].times"
                  placeholder="เลือกเวลา"
                  outlined
                  item-color="pink"
                  color="pink"
                  @change="course.coach = {}"
                >
                  <template v-slot:selection="data">
                  {{ `${data.item.start}-${data.item.end}น.` }}
                  </template>
                  <template v-slot:no-data>
                    <v-list-item>
                      <v-list-item-title> ไม่พบข้อมูล </v-list-item-title>
                    </v-list-item>
                  </template>
                  <template v-slot:item="{ item }">
                    <v-list-item-content>
                      <v-list-item-title
                        ><span
                          :class="course.time.timeId === item.timeId ? 'font-bold' : ''"
                          >{{ item.start }}-{{ item.end }}น.</span
                        ></v-list-item-title
                      >
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-icon>{{course.time.timeId === item.timeId ? "mdi-check-circle": "mdi-radiobox-blank"}}</v-icon>
                    </v-list-item-action>
                  </template>
                </v-select>
              </v-col>
              <v-col cols="12" sm="4" v-if="course.course_data && course.time">
                <label-custom text="โค้ช"></label-custom>
                <v-autocomplete
                  dense
                  :rules="rules.coach"
                  v-model="course.coach"
                  :items="course.course_data.coachs.filter(v => v.teach_day_data.map(v => v.timeId === course.time.timeId))"
                  placeholder="เลือกโค้ช"
                  outlined
                  item-color="pink"
                  color="pink"
                >
                  <template v-slot:selection="data">
                  {{ `${data.item.coach_name}` }}
                  </template>
                  <template v-slot:item="{ item }">
                    <v-list-item-content>
                      <v-list-item-title
                        ><span
                          :class="course.coach.course_coach_id === item.course_coach_id ? 'font-bold' : ''"
                          >{{ item.coach_name }}</span
                        ></v-list-item-title
                      >
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-icon>{{course.coach.course_coach_id === item.course_coach_id ? "mdi-check-circle": "mdi-radiobox-blank"}}</v-icon>
                    </v-list-item-action>
                  </template>
                </v-autocomplete>
              </v-col>
              <v-col cols="12" sm="3" v-if="course.coach">
                <label-custom text="วันเริ่ม"></label-custom>
                <v-menu
                  v-model="course.menu_start_date"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      dense
                      outlined
                      :rules="rules.start_date"
                      v-model="course.start_date_str"
                      readonly
                      placeholder="เลือกวันเริ่ม"
                      v-bind="attrs"
                      v-on="on"
                    >
                      <template v-slot:append>
                        <v-icon
                          :color="
                            course.start_date ? '#FF6B81' : ''
                          "
                          >mdi-calendar</v-icon
                        >
                      </template>
                    </v-text-field>
                  </template>
                  <v-date-picker
                    :min="today.toISOString()"
                    v-model="course.start_date"
                    @input="inputDate($event, 'course open',course )"
                  ></v-date-picker>
                </v-menu>
              </v-col>
            </v-row>
            <v-row dense v-if="course.course_type_id == 'CT_2' && course.course_id">
              <v-col cols="12" sm="4" v-if="course.course_type_id == 'CT_2'">
                <label-custom text="วันที่"></label-custom>
                <v-text-field v-if="course.course_id" dense  disabled outlined :value="course.start_date_str"></v-text-field>
              </v-col>
              <v-col cols="12" sm="4">
                <label-custom text="เวลา"></label-custom>
                <!-- <pre>{{ course_data }}</pre> -->
                <v-text-field
                  disabled
                  outlined
                  dense
                  :value="`${course.time_str}น.`"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="4">
                <label-custom text="โค้ช"></label-custom>
                <!-- {{ course.coach }} -->
                <v-text-field
                  dense
                  outlined
                  disabled
                  :value="course.coach.coach_name"
                >
                </v-text-field>
              </v-col>
            </v-row>
            <!-- PRICE -->
            <v-row dense>
              <v-col cols="12" sm="4" v-if="course.price > 0">
                <label-custom text="ราคา"></label-custom>
                <v-text-field 
                  dense
                  :rules="rules.price"
                  v-model="course.price"
                  @change="CalTotalPrice()"
                  :items="student"
                  outlined
                  type="number"
                  item-color="pink"
                  color="pink"
                  suffix="บาท"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12">
                <label-custom text="หมายเหตุราคา"></label-custom>
                <v-textarea
                  v-model="course.remark"
                  auto-grow
                  outlined
                ></v-textarea>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-form>
      
      <v-row class="mb-3">
        <v-col align="center">
          <v-btn
            outlined
            class=""
            color="#ff6b81"
            @click="addCourse"
          ><span class="mdi mdi-plus-circle-outline">เพิ่มคอร์ส</span></v-btn>
        </v-col>
      </v-row>
      <template v-if="order.courses.length > 0">
        <div class="text-lg font-bold">สถานะการชำระเงิน</div>
        <v-divider class="mb-3"></v-divider>
        <v-row dense class="mb-3">
          <v-col cols="12" sm="8">
            <v-card class="text-xl" color="#FBF3F5">
              <v-card-text>
                <v-row>
                  <v-col class="text-lg font-bold">ราคารวม :</v-col>
                  <v-col cols="auto" class="text-lg font-bold text-pink-500">{{ order.total_price.toLocaleString(undefined,{  minimumFractionDigits: 2,}) }}</v-col>
                  <v-col cols="auto" class="text-lg font-bold">บาท</v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="8">
            <v-card
              class="cursor-pointer mb-3"
              @click="order.payment_status = 'paid'"
            >
              <v-card-text>
                <v-row dense class="d-flex align-start">
                  <v-col cols="auto" class="mr-2">
                    <v-icon
                      :color="order.payment_status === 'paid' ? '#FF6B81' : ''"
                      >{{
                        order.payment_status === "paid"
                          ? "mdi-radiobox-marked"
                          : "mdi-radiobox-blank"
                      }}</v-icon
                    ></v-col>
                  <v-col class="ml-2">
                    <v-row>
                      <v-col cols="auto" class="pa-0">
                        <v-avatar>
                          <v-img
                            src="@/assets/create_student/check 1.png"
                            max-height="24"
                            max-width="24"
                          ></v-img>
                        </v-avatar>
                      </v-col>
                      <v-col> ชำระเงินเรียบร้อยแล้ว </v-col>
                    </v-row>
                    <v-row dense v-if=" order.payment_status === 'paid'">
                      <v-col cols="auto">
                        <v-autocomplete
                          dense
                          hide-details
                          v-model="order.payment_type"
                          item-value="value"
                          item-text="label"
                          :items="transfer"
                          placeholder="เลือกช่องทางการชำระ"
                          outlined
                          color="pink"
                          item-color="pink"
                        >
                          <template v-slot:no-data>
                            <v-list-item>
                              <v-list-item-title> ไม่พบข้อมูล </v-list-item-title>
                            </v-list-item>
                          </template>
                          <template v-slot:item="{ item }">
                            <v-list-item-content>
                              <v-list-item-title
                                ><span
                                  :class="
                                    order.payment_type === item.value ? 'font-bold' : ''
                                  "
                                  >{{ item.label }}</span
                                ></v-list-item-title
                              >
                            </v-list-item-content>
                            <v-list-item-action>
                              <v-icon>
                                {{
                                  order.payment_type === item.value 
                                    ? "mdi-check-circle"
                                    : "mdi-radiobox-blank"
                                }}</v-icon
                              >
                            </v-list-item-action>
                          </template>
                        </v-autocomplete>
                      </v-col>
                      <v-col cols="auto">
                        ผู้รับเงิน : <span class="text-pink-500 font-medium">{{ `${user_detail.first_name_th} ${user_detail.last_name_th}` }}</span>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
            <v-card
              class="cursor-pointer mb-3"
              @click="order.payment_status = 'warn'"
            >
              <v-card-text>
                <v-row class="d-flex align-center">
                  <v-col cols="auto"
                    ><v-icon
                      :color="order.payment_status === 'warn' ? '#FF6B81' : ''"
                      >{{
                        order.payment_status === "warn"
                          ? "mdi-radiobox-marked"
                          : "mdi-radiobox-blank"
                      }}</v-icon
                    ></v-col
                  >
                  <v-col cols="auto" class="pa-0">
                    <v-avatar>
                      <v-img
                        src="@/assets/create_student/notification 1.png"
                        max-height="24"
                        max-width="24"
                      ></v-img>
                    </v-avatar>
                  </v-col>
                  <v-col> ส่งแจ้งเตือนการชำระ </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </template>
      <!-- BUTTON :ACTION -->
      <v-row>
        <v-col align="right" sm="" cols="12">
          <v-btn
            outlined
            :class="$vuetify.breakpoint.smAndUp ? 'btn-size-lg' : 'w-full'"
            color="#ff6b81"
          >
            ยกเลิก
          </v-btn>
        </v-col>
        <v-col sm="auto" cols="12">
          <v-btn
            depressed
            :class="$vuetify.breakpoint.smAndUp ? 'btn-size-lg' : 'w-full'"
            dark
            color="#ff6b81"
            @click="saveOrder()"
          >
            ยืนยัน
          </v-btn>
        </v-col>
      </v-row>
      <v-dialog persistent v-model="show_dialog_register_one_id" width="60vw">
        <registerDialogForm state="student" dialog title="สมัคร One ID"></registerDialogForm>
      </v-dialog>
    </v-container>
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
        <v-btn
          class="centerbtn mt-10"
          color="#ff6b81"
          @click="$router.push({ name: 'Finance' })"
          ><div class="text-white">ดูสถานะการเงิน</div></v-btn
        >
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import headerPage from "@/components/header/headerPage.vue";
import LabelCustom from "@/components/label/labelCustom.vue";
import dialogCard from "@/components/dialog/dialogCard.vue";
import registerDialogForm from "@/components/user_menage/registerDialogForm.vue";
import { mapActions, mapGetters } from "vuex";
import { dateFormatter } from "@/functions/functions";
export default {
  name: "addlearnPage",
  components: {
    headerPage,
    LabelCustom,
    registerDialogForm,
    dialogCard,
  },
  props: {},
  data: () => ({
    user_detail : null,
    course_name_th: "",
    course_id: "",
    search : null,
    students : [],
    loading : false,
    // packages: [],
    dialog_show: false,
    date: "",
    username: "",
    show_dialog: false,
    filter_search: "",
    add_data: {},
    student: [
      "กมลรัตน์ สิทธิกรชัย",
      "กมลพร ศรีโสภา",
      "เนตรกมล ศรีโสภา",
      "จารุณี กมลอาทิตย์",
    ],
    today: new Date(),
    selected: [""],
    pay: "",
    transfer: [
      {label : "โอนเข้าบัญชี", value : "transfer"}, 
      {label : "บัตรเครดิต", value : "credit card"}, 
      {label : "เงินสด", value : "cash"}
    ],
    rules: {
      category:[(val) => (val || "").length > 0 || "โปรดเลือกอาณาจักร" ],
      course: [(val) => (val || "").length > 0 || "โปรดเลือกคอร์สเรียน"],
      package : [(val) => (val || "").length > 0 || "โปรดเลือกแพ็คเกจ"],
      option : [(val) => (val) || "โปรดเลือกระยะเวลา"],
      day : [(val) => (val || "").length > 0 || "โปรดเลือกวันเรียน"],
      time : [(val) => (val) || "โปรดเลือกเวลาเรียน"],
      coach : [(val) => (val) || "โปรดเลือกโค้ช"],
      start_date : [(val) => (val || "").length > 0 || "โปรดเลือกวันเริ่ม"],
      price : [(val) => (val || "") > 0 || "โปรดเลือกระบุราคา"],
    },
  }),
  created() {},
  mounted() {
    this.user_detail = JSON.parse(localStorage.getItem("userDetail"));
    this.GetCategorys()
  },
  watch: {
    search (val) {
      if(val.length > 3 ){ this.searchUser(val) }
    },
  },
  methods: {
    ...mapActions({
      changeDialogRegisterOneId: "RegisterModules/changeDialogRegisterOneId",
      changeOrderData: "OrderModules/changeOrderData",
      save: "OrderModules/save",
      GetCategorys: "CategoryModules/GetCategorys",
      GetCoursesFilter: "CourseModules/GetCoursesFilter",
      GetPackages: "CourseModules/GetPackages",
      GetCourse: "CourseModules/GetCourse",
      searchNameUser: "loginModules/searchNameUser"
    }),
    searchUser(name){
      this.loading = true
      console.log(name)
      setTimeout(()=>{
        this.searchNameUser({search_name :name})
        this.loading = false
      },500)
     
    },
    remove(item) {
      const index = this.order.students.indexOf(item);
      if (index >= 0) this.order.students.splice(index, 1);
    },
    CalTotalPrice(){
      this.order.total_price = 0
      for(let course of this.order.courses){
        console.log(course)
        if(course.price){
          this.order.total_price = this.order.total_price + parseInt(course.price)
        }
      }
    },
    selectCourseType(type, course){
      course.category_id = ""
      course.course_id = ""
      course.course_type_id = type
      course.course_type = ""
      course.package_data = {}
      course.package = ""
      course.option = ""
      course.option_data = {}
      course.day = ""
      course.time = ""
      course.time_str = ""
      course.coach = ""
      course.manu_start_date = false
      course.start_date_str = ""
      course.start_date = ""
      course.price = 0
      course.detail = ""
      course.remark = ""
    },
    addCourse() {
      this.order.courses.push({
        course_options : [],
        course_data : null,
        apply_for_yourself : false,
        apply_for_others : false,
        course_id : "",
        course_type: "",
        course_type_id : "CT_1",
        category_id: "",
        package: "",
        package_data : null,
        option : "",
        option_data : "",
        period: 0,
        times_in_class: 0,
        day: "",
        time: "",
        coach: "",
        manu_start_date : true,
        start_date_str : "",
        start_date : "",
        start_day: "",
        price: 0,
        detail : "",
        remark: "",
        selected : true,
        parents: [],
        students: [],
      });
    },
    Calprice(course){
      course.price = course.option_data.net_price
      this.CalTotalPrice()
    },
    inputDate(e, type, data) {
      switch (type) {
        case "course open":
          data.start_date_str = dateFormatter(
            e,
            "DD MT YYYYT"
          );
          break;
      }
    },
    openDialog() {
      this.dialog_show = true;
      console.log(this.dialog_show, "<---");
    },
    removeCourse(index) {
      // this.$delete(this.short_course)
      this.order.courses.splice(index, 1);
    },
    selectCategory(categoryId, course_type_id, course) {
      console.log(categoryId, course_type_id)
      this.GetCoursesFilter({
        category_id: categoryId,
        status: "Active",
        course_type_id: course_type_id,
      }).then(()=>{
        if(this.courses.length > 0){
          course.course_options = this.courses
        }
        
      })
    },
    selectCourse(courseId,course) {
      console.log("course_id", courseId);
      if(courseId){
        this.GetCourse(courseId).then(()=>{
          if(this.course_data){
            course.course_data = this.course_data
          }
          if(this.course_data.course_type_id === 'CT_2'){
            course.start_date = this.course_data.course_study_start_date
            course.start_date_str = this.course_data.course_study_start_date_str
            course.coach = this.course_data.coachs[0]
            course.time_str = `${this.course_data.course_period_start_date}-${this.course_data.course_period_end_date}`
            course.price = parseInt(this.course_data.price_course)
            this.CalTotalPrice()
          }
        })
      }
    },
    saveOrder(){
      this.$refs.course_form.validate(); 
      if(this.validate_form){
        console.log(this.validate_form)
      }
    }

  },
  computed: {
    ...mapGetters({
      show_dialog_register_one_id: "RegisterModules/getShowDialogRegisterOneId",
      order: "OrderModules/getOrder",
      categorys: "CategoryModules/getCategorys",
      course_data: "CourseModules/getCourseData",
      courses: "CourseModules/getCourses",
      packages: "CourseModules/getPackages",
      last_user_registered: "RegisterModules/getLastUserRegistered",
    }),
    MobileSize() {
      const { xs } = this.$vuetify.breakpoint;
      return !!xs;
    },
    IpadSize() {
      const { sm } = this.$vuetify.breakpoint;
      return !!sm;
    },
  },
};
</script>
<style scoped>
.sub-register-pc {
  position: absolute;
  left: 65%;
  margin-top: 48px;
}

sub-register-sm {
  left: 65%;
  margin-top: 180px;
}

.centerbtn {
  margin: 0;
  top: 50%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
</style>

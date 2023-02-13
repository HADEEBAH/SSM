<template>
  <v-app>
    <v-container>
      <headerPage title="เพิ่มผู้เรียน"></headerPage>
      <v-row>
        <v-col>
          <label-custom text="ผู้เรียน"></label-custom>
          <label
            class="sub-register primary--text cursor-pointer underline"
            @click="changeDialogRegisterOneId(true)"
            >สมัคร One ID</label
          >
          <v-row>
            <v-col cols="12" sm="8" class="mt-1">
              <v-autocomplete
                prepend-inner-icon="mdi-magnify"
                dense
                v-model="order.students"
                :items="student"
                placeholder="ค้นหา/เลือกผู้เรียน"
                label="ค้นหา/เลือกผู้เรียน"
                outlined
                chips
                deletable-chips
                multiple
                clearable
                item-color="#ff6b81"
                item-value="student_name"
                @change="ChangeOrederData(order)"
              >
              
              </v-autocomplete>
            </v-col>
          </v-row>
          <v-card
            v-for="(student_data, index) in order.courses"
            class="mt-6"
            :key="index"
          >
            <v-card-text>
              <v-radio-group v-model="student_data.type">
                <v-row dense>
                  <v-col cols="12" sm="2">
                    <v-radio color="green" value="general_course">
                      <template v-slot:label>
                        <v-row dense>
                          <v-col cols="8" sm="12">
                            <label>คอร์สทั่วไป</label>
                          </v-col>
                        </v-row>
                      </template>
                    </v-radio>
                  </v-col>
                  <v-col cols="12" sm="2">
                    <v-radio color="green" value="short_course">
                      <template v-slot:label>
                        <v-row dense>
                          <v-col cols="8" sm="12">
                            <label>คอร์สระยะสั้น</label>
                          </v-col>
                        </v-row>
                      </template>
                    </v-radio>
                  </v-col>
                </v-row>
              </v-radio-group>
              <template v-if="student_data.type === 'general_course'">
                <v-row>
                  <v-col cols="12" sm="4">
                    <label-custom text="อาณาจักร"></label-custom>
                    <v-autocomplete
                      dense
                      v-model="student_data.kingdom"
                      :items="kingdom"
                      placeholder="เลือกอาณาจักร"
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
                                student_data.kingdom === item ? 'font-bold' : ''
                              "
                              >{{ item }}</span
                            ></v-list-item-title
                          >
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-icon> {{ student_data.kingdom === item ? 'mdi-check-circle' : 'mdi-radiobox-blank' }}</v-icon
                          >
                        </v-list-item-action>
                      </template>
                    </v-autocomplete>
                  </v-col>

                  <v-col cols="12" sm="4">
                    <label-custom text="คอร์สเรียน"></label-custom>
                    <v-autocomplete
                      dense
                      v-model="student_data.courses"
                      :items="courses"
                      placeholder="เลือกคอร์สเรียน"
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
                                student_data.courses === item ? 'font-bold' : ''
                              "
                              >{{ item }}</span
                            ></v-list-item-title
                          >
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-icon> {{ student_data.courses === item ? 'mdi-check-circle' : 'mdi-radiobox-blank' }}</v-icon
                          >
                        </v-list-item-action>
                      </template>
                    </v-autocomplete>
                  </v-col>
                </v-row>
                <v-row class="">
                  <v-col cols="12" sm="4">
                    <label-custom text="แพ็คเกจ"></label-custom>
                    <v-autocomplete
                      item-color="pink"
                      color="pink"
                      dense
                      v-model="student_data.coursepackage"
                      :items="coursepackage"
                      placeholder="เลือกแพ็คเกจ"
                      outlined
                    >
                    </v-autocomplete>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <label-custom text="ระยะเวลา"></label-custom>
                    <v-autocomplete
                      dense
                      v-model="student_data.period"
                      :items="period"
                      placeholder="เลือกระยะเวลา"
                      outlined
                      item-color="pink"
                      color="pink"
                    >
                    </v-autocomplete>
                  </v-col>
                  <v-col cols="12" sm="2">
                    <label-custom text="จำนวนครั้ง"></label-custom>
                    <template v-slot:prepend-item>
                      <v-text-field
                        dense
                        v-model="filter_search"
                        outlined
                      ></v-text-field>
                    </template>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="2">
                    <label-custom text="วัน"></label-custom>
                    <v-autocomplete
                      dense
                      v-model="student_data.day"
                      :items="day"
                      placeholder="เลือกวัน"
                      outlined
                      item-color="pink"
                      color="pink"
                    >
                    </v-autocomplete>
                  </v-col>
                  <v-col cols="12" sm="2">
                    <label-custom text="เวลา"></label-custom>
                    <v-autocomplete
                      dense
                      v-model="student_data.time"
                      :items="time"
                      placeholder="เลือกเวลา"
                      outlined
                      item-color="pink"
                      color="pink"
                    >
                    </v-autocomplete>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <label-custom text="โค้ช"></label-custom>
                    <v-autocomplete
                      dense
                      v-model="student_data.coach"
                      :items="coach"
                      placeholder="เลือกโค้ช"
                      outlined
                      item-color="pink"
                      color="pink"
                    >
                    </v-autocomplete>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <label-custom text="วันเริ่ม"></label-custom>
                    <v-menu
                      v-model="course_data.menu_course_open_date"
                      :close-on-content-click="false"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                      
                    >
                    <!-- :nudge-right="40" -->
                      <template v-slot:activator="{ on, attrs }">
                        <!-- <v-text-field
                          v-model="student_data.date"
                          placeholder="เลือกวันเริ่ม"
                          append-icon="mdi-calendar"
                          outlined
                          dense
                          v-bind="attrs"
                          v-on="on"
                          item-color="pink"
                      color="pink"
                        > -->
                        <v-text-field
                        dense
                        outlined
                        v-model="course_data.course_open_date_str"
                        readonly
                        :rules="rules.course_open_date"
                        placeholder="เลือกวันเริ่ม"
                        v-bind="attrs"
                        v-on="on"
                      >
                      <template v-slot:append>
                          <v-icon
                            :color="course_data.course_open_date ? '#FF6B81' : ''"
                            >mdi-calendar</v-icon
                          >
                        </template>
                      </v-text-field>
                      </template>
                      <!-- <v-date-picker
                        v-model="student_data.date"
                        @input="menu2 = false"
                      ></v-date-picker> -->
                      <v-date-picker
                      v-model="course_data.course_open_date"
                      @input="inputDate($event,'course open')"
                    ></v-date-picker>
                    </v-menu>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="4">
                    <label-custom text="ราคา"></label-custom>
                    <v-text-field
                      dense
                      v-model="student_data.price"
                      :items="student"
                      outlined
                      item-color="pink"
                      color="pink"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" sm="8">
                    <label-custom text="หมายเหตุราคา"></label-custom>
                    <v-textarea
                      v-model="student_data.pricedetail"
                      class="form-learn"
                      auto-grow
                      outlined
                      item-color="pink"
                      color="pink"
                    ></v-textarea>
                  </v-col>
                </v-row>
              </template>
              <template v-else>
                <v-row>
                  <v-col cols="12" sm="4">
                    <label-custom text="อาณาจักร"></label-custom>
                    <v-autocomplete
                      dense
                      v-model="student_data.kingdom"
                      :items="kingdom"
                      placeholder="เลือกอาณาจักร"
                      outlined
                    >
                    </v-autocomplete>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <label-custom text="คอร์สเรียน"></label-custom>
                    <v-autocomplete
                      dense
                      v-model="student_data.courses"
                      :items="courses"
                      placeholder="เลือกคอร์สเรียน"
                      outlined
                    >
                    </v-autocomplete>
                  </v-col>
                </v-row>
              </template>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <div class="btn text-left">
        <v-btn class="btn3 mt-10" @click="addCourse">เพิ่มคอร์ส</v-btn>
      </div>
      <v-row class="mt-15">
        <v-col cols="12" sm="10">
          <div class="mt-5">
            <h3>ราคารวม :</h3>
          </div>
          <div class="d-flex align-center justify-end">
            <v-card class="pr-20 pl-10 pt-5 pb-5 mb-2">
              <h3>สถานะการชำระเงิน</h3>
              <v-radio-group v-model="student_data.pay">
                <v-row dense>
                  <v-col class="pr-20">
                    <v-radio color="green" value="paid">
                      <template v-slot:label>
                        <v-row dense>
                          <v-col cols="12" sm="12">
                            <label>ชำระเงินเรียบร้อยแล้ว</label>
                          </v-col>
                        </v-row>
                      </template>
                    </v-radio>
                    <v-radio color="green" value="warn">
                      <template v-slot:label>
                        <v-row dense>
                          <v-col cols="12" sm="12">
                            <label>ส่งแจ้งเตือนการชำระ</label>
                          </v-col>
                        </v-row>
                      </template>
                    </v-radio>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-autocomplete
                      dense
                      v-model="student_data.transfer"
                      :items="transfer"
                      placeholder="โอนเข้าบัญชี"
                      outlined
                    >
                    </v-autocomplete>
                  </v-col>
                </v-row> </v-radio-group
            ></v-card>
          </div>
        </v-col>
      </v-row>
      <!-- <div class="btn text-center">
        <v-btn class="btn1 mr-8 mt-20 mb-5" outlined color="error"
          >ยกเลิก</v-btn
        >
        <v-btn class="btn2 ml-8 mt-20 mb-5">ยืนยัน</v-btn>
      </div> -->
      <v-row >
        <v-col align="right" sm="" cols="12" >
          <v-btn outlined :class="$vuetify.breakpoint.smAndUp?'btn-size-lg': 'w-full'" color="#ff6b81">
            ยกเลิก
          </v-btn>
        </v-col>
        <v-col sm="auto" cols="12">
          <v-btn  depressed :class="$vuetify.breakpoint.smAndUp?'btn-size-lg': 'w-full'" dark color="#ff6b81" @click="save(order)"> 
            ยืนยัน 
          </v-btn>
        </v-col>
      </v-row>
      <v-dialog persistent v-model="show_dialog_register_one_id" width="60vw">
        <registerDialogForm dialog title="สมัคร One ID"></registerDialogForm>
      </v-dialog>
    </v-container>
  </v-app>
</template>

<script>
import headerPage from "@/components/header/headerPage.vue";
import LabelCustom from "@/components/label/labelCustom.vue";
import registerDialogForm from "@/components/user_menage/registerDialogForm.vue";
import { mapActions, mapGetters } from "vuex";
import {dateFormatter} from "@/functions/functions" 
export default {
  name: "addlearnPage",
  components: {
    headerPage,
    LabelCustom,
    registerDialogForm,
  },
  props: {},
  data: () => ({
    
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
    kingdom: ["1", "2", "3"],
    courses: ["3", "2", "1"],
    coursepackage: ["Exclusive", "Family", "Group"],
    period: ["3 วัน", "3 เดือน", "3 ปี"],
    day: ["วันจันทร์", "วันอังคาร", "วันพุธ", "วันพฤหัส", "วันศุกร์", "วันเสาร์", "วันอาทิตย์"],
    time: ["12.00-130.00", "13.00-14.00"],
    coach: ["Robert", "Lewandowski"],
    selected: [""],
    pay: "",
    transfer: ["โอนเข้าบัญชี", "บัตรเครดิต", "เงินสด"],
    student_data: {
      type: "",
      kingdom: "",
      courses: "",
      coursepackage: "",
      period: {},
      day: "",
      time: "",
      date: "",
      menu: "",
      coach: "",
      price: "",
      pricedetail: "",
      pay: "",
      transfer: "",
      course: [
        {
          type: "general_course",
          coursepackage: "",
          period: {},
          day: "",
          time: "",
          coach: "",
          date: "",
          price: "",
          pricedetail: "",
          kingdom: "",
          courses: "",
        },
      ],
    },

    rules: {  
                
                course_open_date : [val => (val || '').length > 0 || 'โปรดเลือกวันเริ่มเรียน'],
            
            },
  }),

  created() {},

  mounted() {

  },

  methods: {
    ...mapActions({
      changeDialogRegisterOneId: "RegisterModules/changeDialogRegisterOneId",
      ChangeOrederData: "OrderModules/ChangeOrederData",
      save: "OrderModules/save",
    }),
    addCourse() {
      this.order.courses.push({
        type: "short_course",
        kingdom: "",
        courses: "",
        // coursepackage: "",
        // period: {},
        // day: "",
        // time: "",
        // coach: "",
        // menu: "",
        // price: "",
        // pricedetail: "",
      });
      this.ChangeOrederData(this.order)
    },

    inputDate(e,data){
                switch (data) {
                    case "course open":
                        this.course_data.course_open_date_str = dateFormatter(e, "DD MT YYYYT")
                    break;
                    case "register start date":
                        this.register_date_range_str.start_date = dateFormatter(e, "DD MT YYYYT")
                    break;
                    case "register end date":
                        this.register_date_range_str.end_date = dateFormatter(e, "DD MT YYYYT")
                    break;
                    case "class start date":
                        this.class_date_range_str.start_date = dateFormatter(e, "DD MT YYYYT")
                    break;
                    case "class end date":
                        this.class_date_range_str.end_date = dateFormatter(e, "DD MT YYYYT")
                    break;
                }
            },

  },
  computed: {
    ...mapGetters({
      show_dialog_register_one_id: "RegisterModules/getShowDialogRegisterOneId",
      order: "OrderModules/getOrder",
      course_data: "CourseModules/getCourseData",
    }),
  },
  watch: {},
};
</script>
<style scoped>
.sub-register {
  position: absolute;
  left: 58%;
}
</style>

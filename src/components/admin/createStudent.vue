<template>
  <v-app>
    <v-container>
      <headerPage title="เพิ่มผู้เรียน"></headerPage>
      <v-row>
        <v-col cols="12" sm>
          <label-custom text="ผู้เรียน"></label-custom>

          <v-row class="d-flex align-center">
            <v-col cols="12" sm="8" class="mt-2">
              <v-autocomplete
                hide-details
                prepend-inner-icon="mdi-magnify"
                dense
                v-model="order.students"
                :items="student"
                placeholder="ค้นหา/เลือกผู้เรียน"
                label="ค้นหา/เลือกผู้เรียน"
                outlined
                multiple
                clearable
                item-color="#ff6b81"
                color="#ff6b81"
                item-value="student_name"
                @change="ChangeOrederData(order)"
                ><template v-slot:selection="data">
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
          <v-card
            v-for="(student_data, index) in order.courses"
            class="mt-6"
            :key="index"
          >
            <v-card-text>
              <v-row>
                <v-col cols="auto">
                  <v-btn
                    outlined
                    @click="student_data.course_type = 'general_course'"
                    :color="
                      student_data.course_type === 'general_course'
                        ? '#ff6b81'
                        : ''
                    "
                    ><v-icon>
                      {{
                        student_data.course_type === "general_course"
                          ? "mdi-radiobox-marked"
                          : "mdi-radiobox-blank"
                      }}</v-icon
                    >
                    คอร์สทั่วไป</v-btn
                  >
                </v-col>
                <v-col>
                  <v-btn
                    @click="student_data.course_type = 'short_course'"
                    outlined
                    :color="
                      student_data.course_type === 'short_course'
                        ? '#ff6b81'
                        : ''
                    "
                    ><v-icon>{{
                      student_data.course_type === "short_course"
                        ? "mdi-radiobox-marked"
                        : "mdi-radiobox-blank"
                    }}</v-icon>
                    คอร์สระยะสั้น</v-btn
                  >
                </v-col>
              </v-row>
              <template v-if="student_data.course_type === 'general_course'">
                <br />
                <v-row dense>
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
                          <v-icon>
                            {{
                              student_data.kingdom === item
                                ? "mdi-check-circle"
                                : "mdi-radiobox-blank"
                            }}</v-icon
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
                          <v-icon>
                            {{
                              student_data.courses === item
                                ? "mdi-check-circle"
                                : "mdi-radiobox-blank"
                            }}</v-icon
                          >
                        </v-list-item-action>
                      </template>
                    </v-autocomplete>
                  </v-col>
                </v-row>
                <v-row dense>
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
                <v-row dense>
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
                                student_data.time === item ? 'font-bold' : ''
                              "
                              >{{ item }}</span
                            ></v-list-item-title
                          >
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-icon>
                            {{
                              student_data.time === item
                                ? "mdi-check-circle"
                                : "mdi-radiobox-blank"
                            }}</v-icon
                          >
                        </v-list-item-action>
                      </template>
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
                              :color="
                                course_data.course_open_date ? '#FF6B81' : ''
                              "
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
                        @input="inputDate($event, 'course open')"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                </v-row>
                <v-row dense>
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
                      color="#ff6b81"
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
        <v-btn
          outlined
          class="btn3 mt-10 centerbtn"
          color="#ff6b81"
          @click="addCourse"
          ><span class="mdi mdi-plus-circle-outline"></span> เพิ่มคอร์ส</v-btn
        >
      </div>
      <div class="text-lg">สถานะการชำระเงิน</div>
      <hr />
      <br />
      <v-row>
        <v-col cols="12" sm="8">
          <v-card class="text-xl" color="#FBF3F5">
            <v-card-text>
              <v-row>
                <v-col class="text-lg font-bold">ราคารวม :</v-col>
                <v-col cols="auto" class="text-lg font-bold text-pink-500"
                  >1,000
                </v-col>
                <v-col cols="auto" class="text-lg font-bold">บาท</v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" sm="8">
        <v-card class="cursor-pointer mb-3 " @click="order.payment_status='paid'">
          <v-card-actions>
              <v-row class="d-flex align-center">
                  <v-col cols="auto"><v-icon :color="order.payment_status === 'paid' ? '#FF6B81' :'' ">{{order.payment_status === 'paid' ? 'mdi-radiobox-marked' :'mdi-radiobox-blank' }}</v-icon></v-col>
                  <v-col cols="auto" class="pa-0">
                      <v-avatar>
                          <v-img src="@/assets/create_student/check 1.png" max-height="24" max-width="24"></v-img>
                          
                      </v-avatar>
                  </v-col>
                  <v-col>
                    ชำระเงินเรียบร้อยแล้ว
                  </v-col>
              </v-row>
          </v-card-actions> 

          <v-row>
            <v-col cols="auto" class="ml-15">
<v-autocomplete
                      dense
                      v-model="order.payment_type"
                      :items="transfer"
                      placeholder="โอนเข้าบัญชี"
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
                                order.payment_type === item ? 'font-bold' : ''
                              "
                              >{{ item }}</span
                            ></v-list-item-title
                          >
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-icon>
                            {{
                              order.payment_type === item
                                ? "mdi-check-circle"
                                : "mdi-radiobox-blank"
                            }}</v-icon
                          >
                        </v-list-item-action>
                      </template>
                    </v-autocomplete>
            </v-col>

            
           <v-col cols="auto" class="pa-5">
            ผู้รับเงิน : <span class="text-pink-500 font-medium">พรทรัพย์ ร่ำรวยทอง</span>
                  </v-col>
          </v-row> 
        </v-card>

     

        <v-card class="cursor-pointer mb-3 " @click="order.payment_status='warn'">
          <v-card-actions>
              <v-row class="d-flex align-center">
                  <v-col cols="auto"><v-icon :color="order.payment_status === 'warn' ? '#FF6B81' :'' ">{{order.payment_status === 'warn' ? 'mdi-radiobox-marked' :'mdi-radiobox-blank' }}</v-icon></v-col>
                  <v-col cols="auto" class="pa-0">
                      <v-avatar>
                          <v-img src="@/assets/create_student/notification 1.png" max-height="24" max-width="24"></v-img>
                          
                      </v-avatar>
                  </v-col>
                  <v-col>
                    ส่งแจ้งเตือนการชำระ
                  </v-col>
              </v-row>
          </v-card-actions>
        </v-card>

        </v-col>
      </v-row>

      <!-- <v-row class="mt-15">
        <v-col cols="12" sm="10">
          <div class="mt-5">
            <h3>ราคารวม :</h3>
          </div>
          <div class="d-flex align-center justify-end">
            <v-card class="pr-20 pl-10 pt-5 pb-5 mb-2">
              <h3>สถานะการชำระเงิน</h3>
              <v-radio-group v-model="order.payment_status">
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
                      v-model="order.payment_type"
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
      </v-row> -->

      <!-- <div class="btn text-center">
        <v-btn class="btn1 mr-8 mt-20 mb-5" outlined color="error"
          >ยกเลิก</v-btn
        >
        <v-btn class="btn2 ml-8 mt-20 mb-5">ยืนยัน</v-btn>
      </div> -->

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
           @click="openDialog()"
          >
            ยืนยัน
          </v-btn>
        </v-col>
      </v-row>
      <v-dialog persistent v-model="show_dialog_register_one_id" width="60vw">
        <registerDialogForm dialog title="สมัคร One ID"></registerDialogForm>
      </v-dialog>
    </v-container>

    <!-- DIALOG -->
    <v-dialog class="pa-2" width="50vw" v-model="dialog_show" persistent >
                <v-card>
                    <v-card-title>
                        <v-row>
                            <v-col  cols="12" align="right">
                                <v-btn icon @click="dialog_show = false">
                                    <v-icon color="#ff6b81">mdi-close</v-icon>
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-card-title>
                    <dialogCard text="ยืนยันการชำระเงินเรียบร้อย"></dialogCard>
                    <v-btn class="centerbtn mt-10" color="#ff6b81" @click="$router.push({ name: 'Finance'})"><div class="text-white">ดูสถานะการเงิน</div></v-btn>
                </v-card>
    </v-dialog>
  </v-app>
</template>

<script>


import headerPage from "@/components/header/headerPage.vue";
import LabelCustom from "@/components/label/labelCustom.vue";
import dialogCard from '@/components/dialog/dialogCard.vue';
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
    kingdom: ["อาณาจักรศิลปะสมัยใหม่", "อาณาจักร P.E."],
    courses: ["ไวโอลินเบื้องต้น"],
    coursepackage: ["Exclusive", "Family", "Group"],
    period: ["3 วัน", "3 เดือน", "3 ปี"],
    day: [
      "วันจันทร์",
      "วันอังคาร",
      "วันพุธ",
      "วันพฤหัส",
      "วันศุกร์",
      "วันเสาร์",
      "วันอาทิตย์",
    ],
    time: ["12.00-130.00", "13.00-14.00"],
    coach: ["Robert", "Lewandowski"],
    selected: [""],
    pay: "",
    transfer: ["โอนเข้าบัญชี", "บัตรเครดิต", "เงินสด"],

    rules: {
      course_open_date: [
        (val) => (val || "").length > 0 || "โปรดเลือกวันเริ่มเรียน",
      ],
    },
  }),

  created() {},

  mounted() {},

  methods: {
    ...mapActions({
      changeDialogRegisterOneId: "RegisterModules/changeDialogRegisterOneId",
      ChangeOrederData: "OrderModules/ChangeOrederData",
      save: "OrderModules/save",
    }),
    remove(item) {
      const index = this.order.students.indexOf(item);
      if (index >= 0) this.order.students.splice(index, 1);
    },
    addCourse() {
      this.order.courses.push({
        course_type: "short_course",
        package: "",
        time_period: "",
        time_count: 0,
        day: "",
        time: "",
        coach: "",
        start_day: "",
        price: 0,
        remark: "",
      });
      this.ChangeOrederData(this.order);
    },
    inputDate(e, data) {
      switch (data) {
        case "course open":
          this.course_data.course_open_date_str = dateFormatter(
            e,
            "DD MT YYYYT"
          );
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
    openDialog() {
      this.dialog_show = true
      console.log(this.dialog_show, '<---');
    }
  },
  computed: {
    ...mapGetters({
      show_dialog_register_one_id: "RegisterModules/getShowDialogRegisterOneId",
      order: "OrderModules/getOrder",
      course_data: "CourseModules/getCourseData",

      MobileSize() {
        const { xs } = this.$vuetify.breakpoint;
        return !!xs;
      },
      IpadSize() {
        const { sm } = this.$vuetify.breakpoint;
        return !!sm;
      },
    }),
  },
  watch: {
    "student_data.course_type": function (val) {
      console.log(val);
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

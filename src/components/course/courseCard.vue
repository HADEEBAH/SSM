<template>
  <div>
    <!-- Upload file -->
    <v-card class="mx-3" flat>
      <v-card-text class="border-dashed border-2 border-blue-600 rounded-lg">
        <v-row v-if="previewUrl">
          <v-col align="center"  class="rounded-lg pa-0">
            <v-img  :src="previewUrl" style="max-width: 200px" align="right">
              <v-btn icon class="bg-[#f00]" dark><v-icon>mdi-close</v-icon></v-btn>
            </v-img>
          </v-col>
        </v-row>
        <v-row v-if="!previewUrl">
          <v-col cols="12" class="flex align-center justify-center">
            <v-img
              src="../../assets/course/upload_file.png"
              max-height="105"
              max-width="122"
            ></v-img>
          </v-col>
          <v-col cols="12" class="flex align-center justify-center text-h5">
            อัพโหลดภาพหน้าปกคอร์สเรียน
          </v-col>
          <v-col
            cols="12"
            class="flex align-center justify-center text-caption"
          >
            ( ขนาดไฟล์งานไม่เกิน 500 Mb ต้องเป็นไฟล์ JPG, PNG )
          </v-col>
          <v-col cols="12" class="flex align-center justify-center">
            <v-btn outlined color="blue" @click="openFileSelector"
              >เลือกไฟล์</v-btn
            >
            <input
              ref="fileInput"
              type="file"
              @change="uploadFile"
              style="display: none"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <!-- Detail -->
    <v-card flat>
      <headerCard title="รายละเอียด"></headerCard>
      <v-card-text class="py-0">
        <v-divider class="mb-3"></v-divider>
        <v-row dense>
          <v-col cols="12" sm="6">
            <label-custom required text="ชื่อคอร์ส(ภาษาไทย)"></label-custom>
            <v-text-field
              dense
              @keypress="inputName($event, 'th')"
              :rules="rules.course_name_th"
              outlined
              @change="ChangeCourseData(course_data)"
              @focus="$event.target.select()"
              v-model="course_data.course_name_th"
              placeholder="ระบุชื่อคอร์ส(ภาษาไทย)"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <label-custom required text="ชื่อคอร์ส(ภาษาอังกฤษ)"></label-custom>
            <v-text-field
              dense
              outlined
              @focus="$event.target.select()"
              @keypress="inputName($event, 'en')"
              :rules="rules.course_name_en"
              v-model="course_data.course_name_en"
              @change="ChangeCourseData(course_data)"
              placeholder="ระบุชื่อคอร์ส(ภาษาอังกฤษ)"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="12" sm="6">
            <label-custom required text="ชื่ออาณาจักร"></label-custom>

            <v-autocomplete
              dense
              :rules="rules.kingdom"
              v-model="course_data.category_id"
              color="#FF6B81"
              :items="categorys"
              item-text="categoryNameTh"
              item-value="categoryId"
              item-color="pink"
              outlined
              @change="ChangeCourseData(course_data)"
              placeholder="ระบุชื่ออาณาจักร"
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
                      :class="course_data.category_id === item.categoryId ? 'font-bold' : ''"
                      >{{ item.categoryNameTh }}</span
                    ></v-list-item-title>
                </v-list-item-content>
                <v-list-item-action>
                  <v-icon v-if="course_data.category_id === item.categoryId"
                    >mdi-check-circle</v-icon
                  >
                </v-list-item-action>
              </template>
            </v-autocomplete>
          </v-col>
          <v-col cols="12" sm="6">
            <label-custom required text="วันเปิดคอร์ส"></label-custom>
            <v-menu
              v-model="course_data.menu_course_open_date"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  dense
                  outlined
                  v-model="course_data.course_open_date_str"
                  readonly
                  :rules="rules.course_open_date"
                  placeholder="ระบุวันที่เปิดคอร์ส"
                  @change="ChangeCourseData(course_data)"
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
              <v-date-picker
                :min="today.toISOString()"
                v-model="course_data.course_open_date"
                @input="inputDate($event, 'course open')"
              ></v-date-picker>
            </v-menu>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="12" sm="6">
            <label-custom
              required
              text="จำนวนชั่วโมงการเรียน/ครั้ง"
            ></label-custom>
            <v-text-field
              class="input-text-right"
              suffix="ชั่วโมง"
              dense
              @focus="$event.target.select()"
              type="number"
              outlined
              @change="ChangeCourseData(course_data)"
              :rules="rules.course_hours"
              v-model.number="course_data.course_hours"
              placeholder="ระบุจำนวนชั่วโมงการเรียน/ครั้ง"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <label-custom required text="สถานที่เรียน"></label-custom>
            <v-text-field
              dense
              outlined
              @focus="$event.target.select()"
              :rules="rules.location"
              v-model="course_data.location"
              placeholder="ระบุสถานที่เรียน"
            ></v-text-field>
          </v-col>
        </v-row>
        <!-- Course Type  :: general course -->
        <template v-if="course_data.type === 'general_course'">
          <v-row dense>
            <v-col cols="12">
              <label-custom text="รายละเอียดคอร์ส"></label-custom>
              <v-textarea
                v-model="course_data.detail"
                outlined
                @change="ChangeCourseData(course_data)"
                placeholder="กรอกรายละเอียด..."
              ></v-textarea>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12">
              <label-custom text="music performance"></label-custom>
              <v-textarea
                v-model="course_data.music_performance"
                outlined
                @change="ChangeCourseData(course_data)"
                placeholder="กรอกรายละเอียด..."
              ></v-textarea>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12">
              <label-custom text="catification"></label-custom>
              <v-textarea
                v-model="course_data.catification"
                outlined
                @change="ChangeCourseData(course_data)"
                placeholder="กรอกรายละเอียด..."
              ></v-textarea>
            </v-col>
          </v-row>
        </template>
        <!-- Course Type  :: short course -->
        <template v-else>
          <v-row dense>
            <v-col cols="12">
              <label-custom required text="โค้ช"></label-custom>
              <v-autocomplete
                dense
                :rules="rules.coach"
                v-model="course_data.coachs[0].coach_id"
                color="#FF6B81"
                :items="coachs"
                item-value="accountId"
                item-text="fullNameTh"
                item-color="pink"
                outlined
                placeholder="ระบุโค้ช"
                @change="ChangeCourseData(course_data)"
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
                          course_data.coachs[0].coach_id === item.accountId
                            ? 'font-bold'
                            : ''
                        "
                        >{{ `${item.firstNameTh} ${item.lastNameTh}` }}</span
                      ></v-list-item-title
                    >
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-icon v-if="course_data.coachs[0].coach_id === item.accountId"
                      >mdi-check-circle</v-icon
                    >
                  </v-list-item-action>
                </template>
              </v-autocomplete>
            </v-col>
          </v-row>
        </template>
      </v-card-text>
      <!-- Course Type  :: short course -->
      <template v-if="course_data.type === 'short_course'">
        <headerCard title="วันและเวลา"></headerCard>
        <v-card-text class="py-0">
          <v-divider class="mb-3"></v-divider>
          <v-row dense>
            <v-col cols="12" sm="6">
              <label-custom required text="วันที่รับสมัคร"></label-custom>
              <v-row>
                <v-col>
                  <v-menu
                    v-model=" course_data.coachs[0].register_date_range.menu_start_date"
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
                        v-model="register_date_range_str.start_date"
                        readonly
                        @change="ChangeCourseData(course_data)"
                        placeholder="เลือกวันที่เริ่ม"
                        v-bind="attrs"
                        v-on="on"
                      >
                        <template v-slot:append>
                          <v-icon
                            :color="course_data.coachs[0].register_date_range.start_date ? '#FF6B81': ''"
                            >mdi-calendar</v-icon
                          >
                        </template>
                      </v-text-field>
                    </template>
                    <v-date-picker
                      @input="inputDate($event, 'register start date')"
                      :min="today.toISOString()"
                      v-model=" course_data.coachs[0].register_date_range.start_date"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="auto" class="mt-2 px-0"
                  ><v-icon>mdi-minus</v-icon></v-col
                >
                <v-col>
                  <v-menu
                    v-model="course_data.coachs[0].register_date_range.menu_end_date"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        dense
                        outlined
                        @change="ChangeCourseData(course_data)"
                        :rules="rules.end_date"
                        placeholder="เลือกวันที่สิ้นสุด"
                        v-model="register_date_range_str.end_date"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      >
                        <template v-slot:append>
                          <v-icon
                            :color="course_data.coachs[0].register_date_range.end_date ? '#FF6B81': ''"
                            >mdi-calendar</v-icon
                          >
                        </template>
                      </v-text-field>
                    </template>
                    <v-date-picker
                      :min="course_data.coachs[0].register_date_range.start_date ? course_data.coachs[0].register_date_range.start_date : today.toISOString()"
                      @input="inputDate($event, 'register end date')"
                      v-model=" course_data.coachs[0].register_date_range.end_date"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12" sm="6">
              <label-custom required text="วันที่เรียน"></label-custom>
              <v-row>
                <v-col>
                  <v-menu
                    v-model="
                      course_data.coachs[0].class_date_range.menu_start_date
                    "
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        dense
                        @change="ChangeCourseData(course_data)"
                        outlined
                        :rules="rules.start_date"
                        placeholder="เลือกวันที่เริ่ม"
                        v-model="class_date_range_str.start_date"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      >
                        <template v-slot:append>
                          <v-icon
                            :color="course_data.coachs[0].class_date_range.start_date ? '#FF6B81': ''"
                            >mdi-calendar</v-icon
                          >
                        </template>
                      </v-text-field>
                    </template>
                    <v-date-picker
                      :min="today.toISOString()"
                      @input="inputDate($event, 'class start date')"
                      v-model=" course_data.coachs[0].class_date_range.start_date "
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="auto" class="mt-2 px-0"
                  ><v-icon>mdi-minus</v-icon></v-col
                >
                <v-col>
                  <v-menu
                    v-model="
                      course_data.coachs[0].class_date_range.menu_end_date
                    "
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        dense
                        outlined
                        @change="ChangeCourseData(course_data)"
                        :rules="rules.end_date"
                        v-model="class_date_range_str.end_date"
                        readonly
                        placeholder="เลือกวันที่สิ้นสุด"
                        v-bind="attrs"
                        v-on="on"
                      >
                        <template v-slot:append>
                          <v-icon
                            :color=" course_data.coachs[0].class_date_range.end_date? '#FF6B81' : '' "
                            >mdi-calendar</v-icon
                          >
                        </template>
                      </v-text-field>
                    </template>
                    <v-date-picker
                    :min="course_data.coachs[0].class_date_range.start_date ? course_data.coachs[0].class_date_range.start_date : today.toISOString()"
                      @input="inputDate($event, 'class end date')"
                      v-model="course_data.coachs[0].class_date_range.end_date"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>
            </v-col>
            <!-- PERIOD -->
            <v-col cols="12" sm="6">
              <label-custom required text="เวลาเรียน"></label-custom>
              <v-row>
                <v-col>
                  <TimePicker
                      :minuteStep="60"
                      format="HH:mm"
                      style="width: 100% !important"
                      :class="course_data.coachs[0].period.start_time ? 'active' : ''"
                      placeholder="เวลาเริ่มต้น"
                      @change="genStartTimeEndTime($event)"
                      v-model="course_data.coachs[0].period.start_time"
                      ></TimePicker>
                </v-col>
                <v-col cols="auto" class="mt-2 px-0"
                  ><v-icon>mdi-minus</v-icon></v-col
                >
                <v-col cols="12" sm="6">
                  <TimePicker
                      :minuteStep="60"
                      format="HH:mm"
                      style="width: 100% !important"
                      :class="course_data.coachs[0].period.end_time ? 'active' : ''"
                      placeholder="เวลาสิ้นสุด"
                      @change="limitEndTime($event)"
                      v-model="course_data.coachs[0].period.end_time"
                      ></TimePicker>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12">
              <label-custom text="รายละเอียดคอร์ส"></label-custom>
              <v-textarea
                v-model="course_data.detail"
                outlined
                @change="ChangeCourseData(course_data)"
                placeholder="กรอกรายละเอียด..."
              ></v-textarea>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12">
              <label-custom text="catification"></label-custom>
              <v-textarea
                v-model="course_data.catification"
                outlined
                @change="ChangeCourseData(course_data)"
                placeholder="กรอกรายละเอียด..."
              ></v-textarea>
            </v-col>
          </v-row>
        </v-card-text>
      </template>
    </v-card>
  </div>

</template>
  
  <script>
import LabelCustom from "@/components/label/labelCustom.vue";
import headerCard from "@/components/header/headerCard.vue";
import { mapGetters, mapActions } from "vuex";
import { Input, TimePicker } from 'ant-design-vue';
import { inputValidation, dateFormatter } from "@/functions/functions";
import moment from 'moment';
export default {
  name: "courseCard",
  props:{
    categorys : {type : Array},
    coachs : {type : Array},
  },
  components: {
    LabelCustom,
    headerCard,
    TimePicker
  },
  directives: {
    'ant-input': Input,
  },
  data: () => ({
    today:new Date(),
    previewUrl: null,
    // coachs: [ 
    //   {account_id : "16775648309278", first_name_th : 'ฟาติมา', last_name_th : 'จูฮัน', full_name : "ฟาติมา จูฮัน"} ,
    //   {account_id : "4294589844485338", first_name_th : 'ทดสอบ', last_name_th : 'ทดสอบ', full_name : "ทดสอบ ทดสอบ"}
    // ],
    rules: {
      course_name_th: [
        (val) => (val || "").length > 0 || "โปรดระบุชื่อคอร์ส(ภาษาไทย)",
      ],
      course_name_en: [
        (val) => (val || "").length > 0 || "โปรดระบุชื่อคอร์ส(ภาษาอังกฤษ)",
      ],
      kingdom: [(val) => (val || "").length > 0 || "โปรดเลือกอาณาจักร"],
      course_open_date: [
        (val) => (val || "").length > 0 || "โปรดเลือกวันที่เปิดคอร์ส",
      ],
      course_hours: [
        (val) => (val || "") > 0 || "โปรดระบุชั่วโมงการเรียน/ครั้ง",
      ],
      location: [(val) => (val || "").length > 0 || "โปรดระบุสถานที่"],
      coach: [(val) => (val || "").length > 0 || "โปรดระบุโค้ช"],
      start_date: [(val) => (val || "").length > 0 || "โปรดเลือกวันที่เริ่ม"],
      end_date: [(val) => (val || "").length > 0 || "โปรดเลือกวันที่สิ้นสุด"],
      start_time: [(val) => (val || "").length > 0 || "โปรดเลือกเวลาเริ่ม"],
      end_time: [(val) => (val || "").length > 0 || "โปรดเลือกเวลาสิ้นสุด"],
    },
    course_open_date_str: "",
    register_date_range_str: {
      start_date: "",
      end_date: "",
    },
    class_date_range_str: {
      start_date: "",
      end_date: "",
    },
  }),
  created() {
  },
  mounted() {
   
  },
  watch: {},
  computed: {
    ...mapGetters({
      course_data: "CourseModules/getCourseData",
    }),
  },
  methods: {
    ...mapActions({
      ChangeCourseData: "CourseModules/ChangeCourseData",
    }),
    genStartTimeEndTime(value){
      if (value) {
        const end = moment(value).add(this.course_data.course_hours, 'hour')
        this.course_data.coachs[0].period.end_time = end
      }
      this.ChangeCourseData(this.course_data)
    },
    limitEndTime(value){
      let start = this.course_data.coachs[0].period.start_time
      let end =  moment(value)
      if (start.isAfter(end)) {
        const endTime = moment(start).add(this.course_data.course_hours, 'hour')
        this.course_data.coachs[0].period.end_time = endTime
      }
      this.ChangeCourseData(this.course_data)
    },
    removeFile(){
      this.previewUrl = ""
    },
    inputName(e, lang) {
      inputValidation(e, lang);
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
    openFileSelector() {
      this.$refs.fileInput.click();
    },
    // uploadFile() {
    //   this.file = this.$refs.fileInput.files[0];
    //   if (!this.file) return;
    //   const reader = new FileReader();
    //   reader.onload = (e) => {
    //     this.previewUrl = e.target.result;
    //   };
    //   reader.readAsDataURL(this.file);
    // },

    uploadFile() {
      this.file = this.$refs.fileInput.files[0];
      console.log("file=>",this.file);
      if (!this.file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.preview_url = e.target.result;
      };
      reader.readAsDataURL(this.file);
    },
  },
};
</script>
  
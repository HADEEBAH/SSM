<template>
  <div>
    <v-card
      v-for="(coach, coach_index) in course_data.coachs"
      :class="`bg-[${color}] mb-5`"
      :key="coach_index"
    >
      <!-- TEACH DAY -->
      <template v-for="(teach_day, teach_day_index) in coach.teach_day_data">
        <v-card-text :key="`${teach_day_index}-day`" class="border">
          <v-divider
            v-if="teach_day_index > 0"
            :key="teach_day_index"
          ></v-divider>
          <v-row dense>
            <v-col cols="12" class="flex align-center justify-end">
              <v-switch
                :disabled="disable"
                v-model="teach_day.class_open"
                color="green"
                hide-details
                label="เปิดสอน"
              ></v-switch>
            </v-col>
          </v-row>
          <v-row dense class="flex align-center justify-end">
            <v-col cols="12" sm="4">
              <label-custom required text="โค้ช"></label-custom>
              <v-autocomplete
                dense
                :disabled="disable ? disable : teach_day_index > 0 ? true : false"
                :outlined="!disable"
                :filled="disable"
                v-model="coach.coach_id"
                color="#FF6B81"
                :items="coach.coach_id ? coachs : coachsOptions"
                item-value="accountId"
                item-text="fullNameTh"
                item-color="pink"
                @change="findTeachDays(coach, coach_index)"
                :rules="rules.course"
                placeholder="โค้ช"
              >
                <template v-slot:no-data>
                  <v-list-item>
                    <v-list-item-title> ไม่พบข้อมูล </v-list-item-title>
                  </v-list-item>
                </template>
                <template v-slot:></template>
                <template v-slot:item="{ item }">
                  <v-list-item-content>
                    <v-list-item-title
                      ><span
                        :class="
                          coach.coach_id === item.accountId ? 'font-bold' : ''
                        "
                        >{{ item.fullNameTh }}</span
                      ></v-list-item-title
                    >
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-icon v-if="coach.coach_id === item.accountId"
                      >mdi-check-circle</v-icon
                    >
                  </v-list-item-action>
                </template>
              </v-autocomplete>
            </v-col>
            <v-col cols="12" sm="4">
              <label-custom required text="วันสอน"></label-custom>
              <v-autocomplete
                dense
                :disabled="disable"
                :outlined="!disable"
                :filled="disable"
                chips
                :rules="rules.class_date"
                deletable-chips
                item-color="#FF6B81"
                multiple
                small-chips
                color="#FF6B81"
                :items="days"
                item-text="label"
                item-value="value"
                placeholder="โปรดเลือกเวลา"
                v-model="teach_day.teach_day"
                @change="ChangeCourseData(course_data)"
              ></v-autocomplete>
            </v-col>
            <v-col cols="6" sm="2">
              <v-btn
                text
                :disabled="disable"
                v-if="teach_day_index === coach.teach_day_data.length - 1"
                color="green"
                @click="addTeachDay(coach)"
              >
                <v-icon>mdi-calendar-plus-outline</v-icon>
                เพิ่มวันสอน
              </v-btn>
            </v-col>
            <v-col cols="6" sm="2">
              <v-btn
                :disabled="disable"
                text
                color="red"
                v-if="coach.teach_day_data.length > 1"
                @click="removeTeachDay(coach.teach_day_data, teach_day_index)"
              ><v-icon>mdi-calendar-plus-outline</v-icon>
                ลบวันสอน
              </v-btn>
            </v-col>
          </v-row>
          <!-- CLASS TIME -->
          <template
            v-for="(class_date, class_date_index) in teach_day.class_date"
          >
            <v-row
              dense
              :key="`${class_date_index}-date`"
            >
              <v-col cols="12" sm="6">
                <label-custom required text="ช่วงเวลา"></label-custom>
                <v-row dense class="mb-3">
                  <v-col class="px-2" cols="12" sm="6">
                    <TimePicker
                      style="width: 100% !important"
                      class="w-full"
                      :minuteStep="60"
                      format="HH:mm"
                      :class="
                        class_date.class_date_range.start_time ? 'active' : ''
                      "
                      placeholder="เวลาเริ่มต้น"
                      @change="genStartTimeEndTime($event, coach_index, teach_day_index, class_date_index)"
                      v-model="class_date.class_date_range.start_time"
                    ></TimePicker>
                  </v-col>
                  <v-col class="px-2" cols="12" sm="6">
                    <TimePicker
                      disabled 
                      style="width: 100% !important"
                      :minuteStep="60"
                      format="HH:mm"
                      :class="class_date.class_date_range.end_time ? 'active' : ''"
                      placeholder="เวลาสิ้นสุด"
                      @change="limitEndTime($event, coach_index, teach_day_index, class_date_index)"
                      v-model="class_date.class_date_range.end_time"
                    ></TimePicker>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" sm="3">
                <label-custom required text="นักเรียนที่รับได้"></label-custom>
                <v-text-field
                  class="input-text-right"
                  dense
                  :disabled="disable"
                  :outlined="!disable"
                  :filled="disable"
                  type="number"
                  suffix="คน"
                  @focus="$event.target.select()"
                  :rules="rules.students"
                  v-model="class_date.students"
                  placeholder="ระบุนักเรียนที่รับได้"
                ></v-text-field>
              </v-col>
              <v-col cols="6" sm="2" class="d-flex align-center">
                <v-btn
                  :disabled="disable"
                  text
                  v-if="class_date_index === teach_day.class_date.length - 1"
                  color="green"
                  @click="addTime(teach_day)"
                >
                  <v-icon>mdi-timer-plus-outline</v-icon>
                  เพิ่มเวลา
                </v-btn>
              </v-col>
              <v-col cols="6" sm="2" class="d-flex align-center">
                <v-btn
                  :disabled="disable"
                  v-if="teach_day.class_date.length > 1"
                  text
                  color="red"
                  @click="removeTime(teach_day.class_date, class_date_index)"
                >
                  <v-icon>mdi-timer-minus-outline</v-icon>
                  ลบเวลา
                </v-btn>
              </v-col>
            </v-row>
          </template>
        </v-card-text>
      </template>
    </v-card>
  </div>
</template>
  
<script>
import LabelCustom from "../label/labelCustom.vue";
import { mapGetters, mapActions } from "vuex";
import { Input, TimePicker } from "ant-design-vue";
import moment from 'moment';
export default {
  components: {
    LabelCustom,
    TimePicker,
  },
  props: {
    color: { type: String, default: "#fcfcfc" },
    coachs : {type : Array },
    disable: { type: Boolean },
  },
  directives: {
    "ant-input": Input,
  },
  data: () => ({
    select_coachs : [],
    coachs_option : [],
    days: [
      { label: "วันอาทิตย์", value: 0 },
      { label: "วันจันทร์", value: 1 },
      { label: "วันอังคาร", value:2 },
      { label: "วันพุท", value: 3 },
      { label: "วันพฤหัสบดี", value:4 },
      { label: "วันศุกร์", value: 5 },
      { label: "วันเสาร์", value: 6 },
    ],  
    rules: {
      course: [(val) => (val || "").length > 0 || "โปรดเลือกโค้ช"],
      class_date: [(val) => (val || "").length > 0 || "โปรดเลือกวันที่"],
      start_time: [(val) => (val || "").length > 0 || "โปรดเลือกเวลาเริ่ม"],
      end_time: [(val) => (val || "").length > 0 || "โปรดเลือกเวลาสิ้นสุด"],
      students: [(val) => (val || "").length > 0 || "โปรดระบุจำนวนนักเรียน"],
    },
  }),

  created() {
   this.coachs_option = this.coachs
  },
  mounted() {},
  watch: {

  },
  computed: {
    ...mapGetters({
      course_data: "CourseModules/getCourseData",
      teach_days : "CourseModules/getTeachDays"
    }),
    coachsOptions(){
      console.log(this.select_coachs)
      if (this.select_coachs.length === 0) return this.coachs;
      return this.coachs_option.filter(
        (item) => this.select_coachs.includes(item.accountId)
      );
    },
  },
  methods: {
    ...mapActions({
      ChangeCourseData: "CourseModules/ChangeCourseData",
      GetTeachDays: "CourseModules/GetTeachDays",
    }),
    
    genStartTimeEndTime(value, coach_index, teach_day_index, class_date_index){
      if (value) {
        const end = moment(value).add(this.course_data.course_hours, 'hour')
        this.course_data.coachs[coach_index].teach_day_data[teach_day_index].class_date[class_date_index].class_date_range.end_time = end
      }
    },
    limitEndTime(value, coach_index, teach_day_index, class_date_index){
      let start =  this.course_data.coachs[coach_index].teach_day_data[teach_day_index].class_date[class_date_index].class_date_range.start_time
      let end =  moment(value)
      if (start.isAfter(end)) {
        const endTime = moment(start).add(this.course_data.course_hours, 'hour')
        this.course_data.coachs[coach_index].teach_day_data[teach_day_index].class_date[class_date_index].class_date_range.end_time = endTime
      }
    },
    findTeachDays(coach_data, coach_index) {
      this.select_coachs.push({coach:coach_data, index:coach_index})
      this.GetTeachDays(coach_data).then(()=>{
        this.course_data.coachs[coach_index].teach_days_used = this.teach_days
      })
      this.ChangeCourseData(this.course_data)
    },
    addTeachDay(data) {
      console.log(data);
      data.teach_day_data.push({
        teach_day: [],
        class_date: [
          {
            class_date_range: {
              start_date: "",
              menu_start_date: false,
              end_date: "",
              menu_end_date: false,
            },
            students: 0,
          },
        ],
      });
      this.ChangeCourseData(this.course_data);
    },
    removeTeachDay(data, index) {
      data.splice(index, 1);
      this.ChangeCourseData(this.course_data);
    },
    addTime(data) {
      data.class_date.push({
        class_date_range: {
          start_date: "",
          menu_start_date: false,
          end_date: "",
          menu_end_date: false,
        },
        students: 0,
      });
      this.ChangeCourseData(this.course_data);
    },
    removeTime(data, index) {
      data.splice(index, 1);
      this.ChangeCourseData(this.course_data);
    },
  },
};
</script>

  
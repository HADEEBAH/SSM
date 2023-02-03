<template>
  <v-app>
    <v-img v-if="$vuetify.breakpoint.smAndUp" class="img-header" src="../../assets/course/img_header.png"></v-img>
    <v-container>  
      <headerPage title="สร้างคอร์สเรียน"></headerPage>
      <v-radio-group v-model="course_data.type">
        <v-row dense>
          <v-col cols="12" sm="3">
            <v-radio  color="green" value="general_course">
              <template v-slot:label>
                <v-row dense>
                  <v-col cols="4" sm="12">
                    <v-img src="../../assets/course/general_course_icon.jpg" height="50" max-height="80" max-width="80"></v-img>
                  </v-col>
                  <v-col cols="8" sm="12">
                    <label>คอร์สทั่วไป</label>
                  </v-col>
                </v-row>
              </template>
            </v-radio>
          </v-col>
          <v-col cols="12"  sm="3">
            <v-radio color="green" value="short_course">
              <template v-slot:label>
                <v-row dense>
                  <v-col cols="4" sm="12">
                    <v-img src="../../assets/course/short_course_icon.jpg" height="50" max-height="80" max-width="80"></v-img>
                  </v-col>
                  <v-col cols="8" sm="12">
                    <label>คอร์สระยะสั้น</label>
                  </v-col>
                </v-row>
              </template>
            </v-radio>
          </v-col>
        </v-row>
      </v-radio-group>
      <v-stepper
          alt-labels
          v-model="step"
        >
        <v-stepper-header v-if="course_data.type === 'general_course'" style="box-shadow : none !important">
          <template v-for="(header, index) in step_header_data">
            <v-stepper-step :key="`${index}-step`" color="pink" :step="index+1">
              <label :class="step == index+1 ? 'pink--text font-bold':''">{{ header }}</label>
            </v-stepper-step>
            <v-divider :key="index" v-if="index !== step_header_data.length -1 "></v-divider>
          </template>
        </v-stepper-header>
        <!-- Step 1 -->
        <v-stepper-content step="1">
          <!-- Upload file -->
          <v-card >
            <v-card-text class="border-dashed border-2 border-blue-600 rounded-lg">
              <v-row v-if="previewUrl">
                <v-col>
                  <img :src="previewUrl" style="max-height:200px"/>
                </v-col>
              </v-row>
              <v-row v-if="!previewUrl">
                <v-col cols="12"  class="flex align-center justify-center">
                    <v-img src="../../assets/course/upload_file.png" max-height="105" max-width="122"></v-img>
                </v-col>
                <v-col cols="12"  class="flex align-center justify-center text-h5">
                  อัพโหลดภาพหน้าปกคอร์สเรียน
                </v-col>
                <v-col cols="12"  class="flex align-center justify-center text-caption">
                  ( ขนาดไฟล์งานไม่เกิน 500 Mb ต้องเป็นไฟล์ JPG, PNG ) 
                </v-col>
                <v-col cols="12"  class="flex align-center justify-center">
                    <v-btn outlined color="blue" @click="OpenFileSelector">เลือกไฟล์</v-btn>
                    <input ref="fileInput" type="file" @change="uploadFile" style="display: none;" />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
          <!-- Detail -->
          <v-card flat>
            <headerCard title="รายละเอียด" divider></headerCard>
            <v-card-text>
              <v-row dense>
                <v-col cols="12" sm="6">
                  <label-custom required text="ชื่อคอร์ส(ภาษาไทย)"></label-custom>
                  <v-text-field dense outlined v-model="course_data.course_name_th" placeholder="ระบุชื่อคอร์ส(ภาษาไทย)"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <label-custom required text="ชื่อคอร์ส(ภาษาอังกฤษ)"></label-custom>
                  <v-text-field dense outlined v-model="course_data.course_name_en" placeholder="ระบุชื่อคอร์ส(ภาษาอังกฤษ)"></v-text-field>
                </v-col>
              </v-row>
              <v-row dense>
                <v-col cols="12" sm="6">
                  <label-custom required text="ชื่ออาณาจักร"></label-custom>
                  <v-autocomplete
                    dense
                    :search-input="filter.kingdom"
                    v-model="course_data.kingdom_name"
                    :items="kingdoms"
                    placeholder="ระบุชื่ออาณาจักร"
                    outlined
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" sm="6">
                  <label-custom required text="วันเปิดคอร์ส"></label-custom>
                  <v-text-field dense outlined v-model="course_data.course_open" placeholder="ระบุวันเปิดคอร์ส"></v-text-field>
                </v-col>
              </v-row>
              <v-row dense>
                <v-col cols="12" sm="6">
                  <label-custom required text="จำนวนชั่วโมงการเรียน/ครั้ง"></label-custom>
                  <v-text-field class="input-text-right" suffix="ชั่วโมง" dense type="number" outlined v-model.number="course_data.course_hours" placeholder="ระบุจำนวนชั่วโมงการเรียน/ครั้ง"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <label-custom required text="สถานที่เรียน"></label-custom>
                  <v-text-field dense outlined v-model="course_data.location" placeholder="ระบุสถานที่เรียน"></v-text-field>
                </v-col>
              </v-row>
              <!-- Course Type  :: general course -->
              <template v-if="course_data.type === 'general_course'">
                <v-row dense>
                  <v-col cols="12">
                    <label-custom text="รายละเอียดคอร์ส"></label-custom>
                    <v-textarea v-model="course_data.detail" outlined placeholder="กรอกรายละเอียด..."></v-textarea>
                  </v-col>
                </v-row>
                <v-row dense>
                  <v-col cols="12">
                    <label-custom text="music performance"></label-custom>
                    <v-textarea v-model="course_data.music_performance" outlined placeholder="กรอกรายละเอียด..."></v-textarea>
                  </v-col>
                </v-row>
                <v-row dense>
                  <v-col cols="12">
                    <label-custom text="catification"></label-custom>
                    <v-textarea v-model="course_data.catification" outlined placeholder="กรอกรายละเอียด..."></v-textarea>
                  </v-col>
                </v-row>
              </template>
              <!-- Course Type  :: short course -->
              <template v-else>
                <v-row dense>
                  <v-col cols="12">
                    <label-custom text="โค้ช"></label-custom>
                    <v-autocomplete
                    dense
                    v-model="course_data.coachs[0].coach_name"
                    :items="courses"
                    placeholder="ระบุโค้ช"
                    outlined
                  ></v-autocomplete>
                  </v-col>
                </v-row>
              </template>
            </v-card-text>
             <!-- Course Type  :: short course -->
            <template v-if="course_data.type === 'short_course'">
              <headerCard title="วันและเวลา" divider></headerCard>
              <v-card-text>
                <v-divider class="mb-4"></v-divider>
                <v-row dense>
                  <v-col cols="12" sm="6">
                    <label-custom required text="วันที่รับสมัคร"></label-custom>
                    <InputDateRange></InputDateRange>
                  </v-col>
                </v-row>
                <v-row dense>
                  <v-col cols="12" sm="6">
                    <label-custom required text="วันที่เรียน"></label-custom>
                    <InputDateRange></InputDateRange>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <label-custom required text="เวลาเรียน"></label-custom>
                    <InputDateRange time_picker icon="mdi-clock-outline"></InputDateRange>
                  </v-col>
                </v-row>
                <v-row dense>
                  <v-col cols="12">
                    <label-custom text="รายละเอียดคอร์ส"></label-custom>
                    <v-textarea v-model="course_data.detail" outlined placeholder="กรอกรายละเอียด..."></v-textarea>
                  </v-col>
                </v-row>
                <v-row dense>
                  <v-col cols="12">
                    <label-custom text="catification"></label-custom>
                    <v-textarea v-model="course_data.catification" outlined placeholder="กรอกรายละเอียด..."></v-textarea>
                  </v-col>
                </v-row>
              </v-card-text>
            </template>
          </v-card>
        </v-stepper-content>
         <!-- Step 2 -->
        <v-stepper-content step="2">
          <v-card flat>
            <headerCard title="รายละเอียดเวลาและโค้ช" divider>
              <template v-slot:actions>
                <v-btn outlined color="pink" @click="addCoach">
                  <v-icon>mdi-plus-circle-outline</v-icon>
                  เพิ่มโค้ช
                </v-btn>
              </template>
            </headerCard>
            <v-card-text>
              <!-- COACH -->
              <v-card v-for="(coach, coach_index) in course_data.coachs" class="bg-grey-card mb-5" :key="coach_index">
                 <!-- TEACH DAY -->
                <template v-for="(teach_day,teach_day_index) in coach.teach_day_data">
                  <v-card-text :key="`${teach_day_index}-day`">
                    <v-divider v-if="teach_day_index > 0" :key="teach_day_index"></v-divider>
                    <v-row dense>
                      <v-col cols="12" class="flex align-center justify-end">
                        <v-switch
                          v-model="coach.close_coach"
                          color="red"
                          value="red"
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
                          :disabled="teach_day_index > 0"
                          v-model="coach.coach_name"
                          :items="courses"
                          placeholder="โค้ช"
                          outlined
                        ></v-autocomplete>
                      </v-col>
                      <v-col cols="12" sm="4">
                        <label-custom required text="วันสอน"></label-custom>
                        <v-autocomplete 
                        dense
                        v-model="teach_day.teach_day"
                        :items="days"
                        item-text="label"
                        placeholder="เลือกวันสอน"
                        outlined
                        ></v-autocomplete>
                      </v-col>
                      <v-col cols="12" sm="2">
                        <v-btn text v-if="teach_day_index === coach.teach_day_data.length -1" color="green" @click="addTeachDay(coach)">
                          <v-icon>mdi-calendar-plus-outline</v-icon>
                          เพิ่มวันสอน
                        </v-btn>
                      </v-col>
                      <v-col cols="12" sm="2">
                        <v-btn text color="red" v-if="coach.teach_day_data.length > 1" @click="removeTeachDay(coach.teach_day_data, teach_day_index)">
                          <v-icon>mdi-calendar-plus-outline</v-icon>
                          ลบวันสอน
                        </v-btn>
                      </v-col>
                    </v-row>
                    <!-- CLASS TIME -->
                    <template v-for="(class_date, class_date_index) in teach_day.class_date">
                       <v-row dense class="flex align-center justify-end" :key="`${class_date_index}-date`">
                        <v-col cols="12" sm="4">
                          <label-custom required text="ช่วงเวลา"></label-custom>
                          <InputDateRange time_picker icon="mdi-clock-outline"></InputDateRange>
                        </v-col>
                        <v-col cols="12" sm="4">
                          <label-custom required text="นักเรียนที่รับได้"></label-custom>
                          <v-text-field class="input-text-right" dense type="number" suffix="คน" outlined v-model="class_date.students" placeholder="ระบุนักเรียนที่รับได้"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="2">
                          <v-btn text v-if="class_date_index === teach_day.class_date.length -1" color="green" @click="addTime(teach_day)">
                            <v-icon>mdi-timer-plus-outline</v-icon>
                            เพิ่มเวลา
                          </v-btn>
                        </v-col>
                        <v-col cols="12" sm="2">
                          <v-btn v-if="teach_day.class_date.length > 1" text color="red" @click="removeTime( teach_day.class_date, class_date_index)">
                            <v-icon>mdi-timer-minus-outline</v-icon>
                            ลบเวลา
                          </v-btn>
                        </v-col>
                      </v-row>
                    </template>
                  </v-card-text>
                </template>
              </v-card>
            </v-card-text>
          </v-card>
        </v-stepper-content>
        <!-- Step 3 -->
        <v-stepper-content step="3">
          <v-card flat v-for="(package_data, index) in course_data.packages" :key="index">
            <headerCard :icon="'mdi-card-account-details-outline'" :icon_color="'pink'" :title="`แพ็คเก็ตที่ ${index+1}`" divider></headerCard>
            <v-card-text>
              <v-card class="bg-grey-card mb-3">
                <v-card-text>
                  <v-row dense>
                    <v-col>
                      <label-custom required text="แพ็ตเกจ"></label-custom>
                      <v-autocomplete dense :filterable="true" :items="packages" v-model="package_data.package" outlined></v-autocomplete>
                     
                    </v-col>
                    <v-col>
                      <label-custom required text="จำนวนนักเรียน/คน"></label-custom>
                      <v-text-field suffix="คน" class="input-text-right" dense outlined v-model="package_data.students"></v-text-field>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
              <v-card class="bg-grey-card" :class="package_data.options.length > 1 ? 'mb-3' :''" v-for="(option, option_index) in package_data.options" :key="option_index">
                <v-card-text>
                  <v-row dense class="d-flex align-center">
                    <v-col cols="4">
                      <label-custom required text="แพ็ตเกจ"></label-custom>
                      <v-autocomplete dense :search-input="searchInput" :items="options" v-model="option.period_package" outlined></v-autocomplete>
                    </v-col>
                    <v-col cols="4">
                      <label-custom required text="จำนวนครั้ง/คน"></label-custom>
                      <v-text-field class="input-text-right" dense outlined placeholder="ระบุจำนวน ครั้ง/คน" v-model="option.amount" ></v-text-field>
                    </v-col>
                    <v-col cols="2">
                      <v-btn v-if="option_index === (package_data.options.length - 1)" @click="addOptions(package_data.options)" class="w-full" outlined color="green">
                        <v-icon>mdi-plus-box-multiple</v-icon>
                        เพิ่ม
                      </v-btn>
                    </v-col>
                    <v-col cols="2">
                      <v-btn v-if="package_data.options.length > 1 " class="w-full" outlined color="red">
                        <v-icon>mdi-delete-empty</v-icon>
                        ลบ
                      </v-btn>
                    </v-col>
                  </v-row>
                  <v-row dense>
                    <v-col cols="4">
                      <label-custom required text="ราคา/คน"></label-custom>
                      <v-text-field class="input-text-right" dense outlined placeholder="ระบุราคา บาท/คน" v-model="option.price_unit"></v-text-field>
                    </v-col>
                    <v-col>
                      <v-row  class="flex align-center">
                        <v-col cols="auto">
                          <v-checkbox
                            v-model="option.discount"
                            label="มี่สวนลด"
                          ></v-checkbox>
                        </v-col>
                        <v-col cols="5 pt-8">
                          <v-text-field 
                            dense 
                            class="input-text-right"
                            :disabled="!option.discount" 
                            placeholder="ระบุส่วนลด/บาท" 
                            :outlined="option.discount" 
                            :filled="!option.discount" 
                            v-model="option.discount_price"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                  <v-row dense>
                    <v-col>
                      <LabelCustom text="สิทธิ์พิเศษ"></LabelCustom>
                      <v-textarea dense outlined v-model="option.privilege"></v-textarea>
                    </v-col>
                  </v-row>
                  <!-- TOTAL -->
                  <v-card v-if="option.discount" flat style="background-color : #FBF3F5">
                    <v-card-text>
                      <v-row>
                        <v-col>เหลือราคา</v-col>
                        <v-col class="pink--text text-right">{{ option.net_price.toLocaleString() }}</v-col>
                        <v-col>บาท เฉลี่ย</v-col>
                        <v-col class="pink--text text-right">{{ option.net_price_unit.toLocaleString()}}</v-col>
                        <v-col>บาท/คน</v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-card-text>
              </v-card>
            </v-card-text>
          </v-card>
          <v-row dense>
            <v-col class="d-flex align-center justify-center" cols="12">
              <v-btn outlined color="pink" @click="addPackage(course_data.packages)"><v-icon>mdi-plus-circle-outline</v-icon>เพิ่มแพ็คเกจ</v-btn>
            </v-col>
          </v-row>
        </v-stepper-content>
        <v-card flat>
            <v-card-text >
              <v-row dense>
                <v-col align="right">
                  <v-btn v-if="step > 1" class="pink--text" style="width: 120px" text @click="step = step-1" >ย้อนกลับ</v-btn>
                </v-col>
                <v-col cols="auto" v-if="step < 3">
                  <v-btn class="white--text grey" style="width: 120px" depressed @click="step = step+1">ถัดไป</v-btn>
                </v-col>
                <v-col cols="auto" v-else>
                  <v-btn class="white--text grey w-full" depressed @click="step = step+1">สร้างคอร์สเรียน</v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
      </v-stepper>
    </v-container>
  </v-app>
</template>  
<script>
import headerPage from "@/components/header/headerPage.vue"
import LabelCustom from '@/components/label/labelCustom.vue';
import InputDateRange from '@/components/input/inputDateRangePicker.vue'
import headerCard from "@/components/header/headerCard.vue";
export default {
  name: "CourseCreate",
  components:{
    headerPage,
    LabelCustom,
    InputDateRange,
    headerCard
  },
  props: {
    title: { type: String },
  },
  data: () => ({
    menu: false,
    step: 1,
    file: null,
    dragOver: false,
    previewUrl : null,
    filter:{
      kingdom:"",
      option: "",
      package : ""
    },
    days:[
      {label:'วันอาทิตย์', value:"Sunday"},
      {label:'วันจันทร์', value:"Monday"},
      {label:'วันอังคาร', value:"Tuesday"},
      {label:'วันพุท', value:"Wednesday"},
      {label:'วันพฤหัสบดี', value:"Thursday"},
      {label:'วันศุกร์', value:"Friday"},
      {label:'วันเสาร์', value:"Saturday"},
    ],
    packages:["Exclusive Package", "Family Package", "Group Package"],
    options:["รายวัน", "รายเดือน", "รายเทมอ", "รายปี"], 
    step_header_data : ["คอร์สเรียน", "ช่วงเวลาและโค้ช", "แพ็คเกจ"],
    courses:["โค้ชหนุ่ม", "โค้ชพอล"],
    course_data : {
      type : "general_course",
      course_name_th : "",
      course_name_en : "",
      kingdom_name : "",
      kingdom_data : {},
      course_open_date : "",
      course_hours : 0,
      location : "",
      detail : "",
      music_performance: "",
      catification : "",
      coachs : [
        { 
          close_coach : false,
          coach_name : "",
          teach_day_data :[{
            teach_day : "sunday",
            class_date:[
              { 
                class_date_range:{
                  start_date : "",
                  menu_start_date : false,
                  end_date : "",
                  menu_end_date : false,
                },
                students : 0
              }
            ]
          }],
          class_date_range:{
            start_date : "",
            menu_start_date : false,
            end_date : "",
            menu_end_date : false,
          },
          application_date_range:{
            start_date : "",
            menu_start_date : false,
            end_date : "",
            menu_end_date : false,
          },
          period : {
            start_date : "",
            menu_start_date : false,
            end_date : "",
            menu_end_date : false,
          },
       }
      ],
      packages:[
        {
          package:"",
          students: 0,
          options : [
            {
              period_package:"",
              amount: 0,
              price_unit : 0,
              discount : false,
              discount_price : 0,
              privilege : "",
              net_price : 0,
              net_price_unit : 0,
            }
          ]
        }
      ]
    },
    kingdoms : ["อาณาจักรศิลปะสมัยใหม่", "อาณาจักร P.E."],
    }),
  created() {},
  mounted() {},
  watch: {
    "course_data.type"(newQuestion) {
      if(newQuestion){
        this.step = 1
      }
    }
  },
  computed: {},
  methods: {
    OpenFileSelector(){
      this.$refs.fileInput.click()
    },
    uploadFile() {
      this.file = this.$refs.fileInput.files[0]
      if (!this.file) return
      const reader = new FileReader()
      reader.onload = (e) => {
        this.previewUrl = e.target.result
      }
      reader.readAsDataURL(this.file)
    },
    addCoach(){
      this.course_data.coachs.push({
          close_coach : false,
          coach_name : "",
          teach_day_data :[{
            teach_day : "sunday",
            class_date:[
              { 
                class_date_range:{
                  start_date : "",
                  menu_start_date : false,
                  end_date : "",
                  menu_end_date : false,
                },
                students : 0
              }
            ]
          }],
          class_date_range:{
            start_date : "",
            menu_start_date : false,
            end_date : "",
            menu_end_date : false,
          },
          application_date_range:{
            start_date : "",
            menu_start_date : false,
            end_date : "",
            menu_end_date : false,
          },
          period : {
            start_date : "",
            menu_start_date : false,
            end_date : "",
            menu_end_date : false,
          },
      })
    },
    removeCoach(data, index){
      data.splice(index, 1)
    },
    addTime(data){
      data.class_date.push({
        class_date_range:{
          start_date : "",
          menu_start_date : false,
          end_date : "",
          menu_end_date : false,
        },
        students : 0
      })
    },
    removeTime(data, index){
      data.splice(index, 1)
    },
    addTeachDay(data){
      data.teach_day_data.push({
        teach_day : "sunday",
        class_date:[
          { 
            class_date_range:{
              start_date : "",
              menu_start_date : false,
              end_date : "",
              menu_end_date : false,
            },
            students : 0
          }
        ]
      })
    },
    removeTeachDay(data, index){
      data.splice(index, 1)
    },
    addPackage(data){
      data.push({
        package:"",
        students: 0,
        options : [
          {
            period_package:"",
            amount: 0,
            price_unit : 0,
            discount : false,
            discount_price : 0,
            privilege : "",
            net_price : 0,
            net_price_unit : 0,
          }
        ]
      })
    },
    addOptions(data){
      data.push({
        period_package:"",
        amount: 0,
        price_unit : 0,
        discount : false,
        discount_price : 0,
        privilege : "",
        net_price : 0,
        net_price_unit : 0,
      })
    }
  },
};
</script>
<style scoped>
  .sub-menu {
    font-weight: 600;
    color: #2f3542;
    font-size: 22px;
  }
  .bg-grey-card{
    background-color: #FCFCFC;
  }
  /deep/.input-text-right input{
    text-align: right !important;
  }
  .img-header{
    position: absolute; 
    right: 0px;
    max-height: 180px;
    max-width: 250px;
  }
</style>
      
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
          <template v-for="(header, index) in step_header_data" >
            <v-stepper-step :key="index" color="pink" :step="index+1">
              <label :class="step === index+1 ? 'pink--text font-bold':''">{{ header }}</label>
            </v-stepper-step>
            <v-divider :key="index" v-if="index !== step_header_data.length -1 "></v-divider>
          </template>
        </v-stepper-header>
        <!-- Step 1 -->
        <v-stepper-content
          step="1"
        >
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
            <v-card-title class="font-bold text-2xl">รายละเอียด</v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-row>
                <v-col cols="12" sm="6">
                  <label-custom required text="ชื่อคอร์ส(ภาษาไทย)"></label-custom>
                  <label></label>
                  <v-text-field dense outlined v-model="course_data.course_name_th" placeholder="ระบุชื่อคอร์ส(ภาษาไทย)"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <label-custom required text="ชื่อคอร์ส(ภาษาอังกฤษ)"></label-custom>
                  <v-text-field dense outlined v-model="course_data.course_name_en" placeholder="ระบุชื่อคอร์ส(ภาษาอังกฤษ)"></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="6">
                  <label-custom required text="ชื่ออาณาจักร"></label-custom>
                  <label></label>
                  <v-select
                    dense
                    v-model="course_data.kingdom_name"
                    :items="kingdoms"
                    placeholder="ระบุชื่ออาณาจักร"
                    outlined
                  >
                  <template v-slot:prepend-item>
                    <v-text-field dense v-model="filter_kingdom" outlined placeholder="ระบุชื่ออาณาจักร"></v-text-field>
                  </template>
                </v-select>
                </v-col>
                <v-col cols="12" sm="6">
                  <label-custom required text="วันเปิดคอร์ส"></label-custom>
                  <v-text-field dense outlined v-model="course_data.course_open" placeholder="ระบุวันเปิดคอร์ส"></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="6">
                  <label-custom required text="จำนวนชั่วโมงการเรียน/ครั้ง"></label-custom>
                  <label></label>
                  <v-text-field dense type="number" outlined v-model.number="course_data.course_hours" placeholder="ระบุจำนวนชั่วโมงการเรียน/ครั้ง"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <label-custom required text="สถานที่เรียน"></label-custom>
                  <v-text-field dense outlined v-model="course_data.location" placeholder="ระบุสถานที่เรียน"></v-text-field>
                </v-col>
              </v-row>
              <!-- Course Type  :: general course -->
              <template v-if="course_data.type === 'general_course'">
                <v-row>
                  <v-col cols="12">
                    <label-custom text="รายละเอียดคอร์ส"></label-custom>
                    <v-textarea v-model="course_data.detail" outlined placeholder="กรอกรายละเอียด..."></v-textarea>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <label-custom text="music performance"></label-custom>
                    <v-textarea v-model="course_data.music_performance" outlined placeholder="กรอกรายละเอียด..."></v-textarea>
                  </v-col>
                </v-row>
              </template>
              <!-- Course Type  :: short course -->
              <template v-else>
                <v-row>
                  <v-col cols="12">
                    <label-custom text="โค้ช"></label-custom>
                    <v-select
                    dense
                    v-model="course_data.kingdom_name"
                    :items="kingdoms"
                    placeholder="ระบุโค้ช"
                    outlined
                  ></v-select>
                  </v-col>
                </v-row>
              </template>
              <v-row>
                <v-col cols="12">
                  <label-custom text="catification"></label-custom>
                  <v-textarea v-model="course_data.catification" outlined placeholder="กรอกรายละเอียด..."></v-textarea>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
          <v-crad>
            <v-card-text>
              <v-row dense>
                <v-col class="flex align-center justify-end">
                  <v-btn class="white--text grey" depressed @click="step = 2">ถัดไป</v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-crad>
        </v-stepper-content>
         <!-- Step 2 -->
         <v-stepper-content
          step="2"
        >
          <v-card flat>
            <v-card-title class="font-bold text-2xl">
              <v-row>
                <v-col>รายละเอียดเวลาและโค้ช</v-col>
                <v-col cols="auto">
                  <v-btn outlined color="pink" @click="addCoach">
                    <v-icon>mdi-plus-circle-outline</v-icon>
                    เพิ่มโค้ช
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-card v-for="(coach, index) in course_data.coachs" class="bg-grey-card mb-5" :key="index">
                <v-card-text>
                  <v-row>
                    <v-col cols="12" class="flex align-center justify-end">
                      <v-switch
                        v-model="coach.close_coach"
                        color="red"
                        value="red"
                        hide-details
                        label="ปิดสอน"
                      ></v-switch>
                    </v-col>
                  </v-row>
                  <v-row class="flex align-center justify-end">
                    <v-col cols="12" sm="6">
                      <label-custom required text="โค้ช"></label-custom>
                      <label></label>
                      <v-text-field dense type="number" outlined v-model.number="coach.coach_name" placeholder="ระบุโค้ช"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="4">
                      <label-custom required text="วันสอน"></label-custom>
                      <v-text-field dense outlined v-model="coach.teach_day" placeholder="ระบุวันสอน"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="2">
                      <v-btn text color="green">
                        <v-icon>mdi-calendar-plus-outline</v-icon>
                        เพิ่มวันสอน
                      </v-btn>
                    </v-col>
                  </v-row>
                  <v-row class="flex align-center justify-end">
                    <v-col cols="12" sm="6">
                      <label-custom required text="ช่วงเวลา"></label-custom>
                      <label></label>
                      <v-text-field dense type="number" outlined v-model.number="coach.period" placeholder="ระบุช่วงเวลา"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="4">
                      <label-custom required text="นักเรียนที่รับได้"></label-custom>
                      <v-text-field dense outlined v-model="coach.max_students" placeholder="ระบุนักเรียนที่รับได้"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="2">
                      <v-btn text color="green">
                        <v-icon>mdi-calendar-plus-outline</v-icon>
                        เพิ่มวันสอน
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-card-text>
          </v-card>
          <v-card>
            <v-card-text>
              <v-row dense>
                <v-col class="flex align-center justify-end">
                  <v-btn class="white--text grey" depressed >ถัดไป</v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-stepper-content>
      </v-stepper>
    </v-container>
  </v-app>
</template>  
<script>
import headerPage from "@/components/header/headerPage.vue"
import LabelCustom from '@/components/label/labelCustom.vue';
export default {
  name: "CourseCreate",
  components:{
    headerPage,
    LabelCustom
  },
  props: {
    title: { type: String },
  },
  data: () => ({
    step: 1,
    file: null,
    dragOver: false,
    previewUrl : null,
    filter_kingdom : "",
    step_header_data : ["คอร์สเรียน", "ช่วงเวลาและโค้ช", "แพ็คเกจ"],
    courses:["โค้ชหนุ่ม", "โค้ชพอล"],
    course_data : {
      type : "general_course",
      course_name_th : "",
      course_name_en : "",
      kingdom_name : "",
      kingdom_data : {},
      course_open : "",
      course_hours : 0,
      location : "",
      detail : "",
      music_performance: "",
      catification : "",
      coachs : [
        { 
          close_coach : false,
          coach_name : "",
          teach_day : "",
          period : "",
          max_students : 0,
       }
      ]
    },
    kingdoms : ["อาณาจักรศิลปะสมัยใหม่", "อาณาจักร P.E."],
  }),
  created() {},
  mounted() {},
  watch: {},
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
        teach_day : "",
        period : "",
        max_students : 0,
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
  .img-header{
    position: absolute; 
    right: 0px;
    max-height: 180px;
    max-width: 250px;
  }
</style>
      
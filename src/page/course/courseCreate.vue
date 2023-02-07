<template>
  <v-app>
    <v-img
      v-if="$vuetify.breakpoint.smAndUp"
      class="img-header"
      src="../../assets/course/img_header.png"
    ></v-img>
    <v-container>
      <headerPage title="สร้างคอร์สเรียน"></headerPage>
      <v-radio-group v-model="course_data.type">
        <v-row dense>
          <v-col cols="12" sm="3">
            <v-radio color="green" value="general_course">
              <template v-slot:label>
                <v-row dense>
                  <v-col cols="4" sm="12">
                    <v-img
                      src="../../assets/course/general_course_icon.jpg"
                      height="50"
                      max-height="80"
                      max-width="80"
                    ></v-img>
                  </v-col>
                  <v-col cols="8" sm="12">
                    <label>คอร์สทั่วไป</label>
                  </v-col>
                </v-row>
              </template>
            </v-radio>
          </v-col>
          <v-col cols="12" sm="3">
            <v-radio color="green" value="short_course">
              <template v-slot:label>
                <v-row dense>
                  <v-col cols="4" sm="12">
                    <v-img
                      src="../../assets/course/short_course_icon.jpg"
                      height="50"
                      max-height="80"
                      max-width="80"
                    ></v-img>
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
      <v-stepper alt-labels v-model="step">
        <v-stepper-header
          v-if="course_data.type === 'general_course'"
          style="box-shadow: none !important"
        >
          <template v-for="(header, index) in step_header_data">
            <v-stepper-step
              :key="`${index}-step`"
              color="#FF6B81"
              :step="index + 1"
            >
              <label
                :class="step == index + 1 ? 'text-[#FF6B81] font-bold' : ''"
                >{{ header }}</label
              >
            </v-stepper-step>
            <v-divider
              :key="index"
              v-if="index !== step_header_data.length - 1"
            ></v-divider>
          </template>
        </v-stepper-header>
        <!-- Step 1 -->
        <v-stepper-content step="1" class="pa-2 pt-3">
          <!-- Upload file -->
          <v-card class="mx-3" flat>
            <v-card-text
              class="border-dashed border-2 border-blue-600 rounded-lg"
            >
              <v-row v-if="previewUrl">
                <v-col>
                  <img :src="previewUrl" style="max-height: 200px" />
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
                <v-col
                  cols="12"
                  class="flex align-center justify-center text-h5"
                >
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
                  <label-custom
                    required
                    text="ชื่อคอร์ส(ภาษาไทย)"
                  ></label-custom>
                  <v-text-field
                    dense
                    @keypress="inputName($event, 'th')"
                    :rules="rules.course_name_th"
                    outlined
                    @focus="$event.target.select()"
                    :v-model="course_data.course_name_th"
                    placeholder="ระบุชื่อคอร์ส(ภาษาไทย)"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <label-custom
                    required
                    text="ชื่อคอร์ส(ภาษาอังกฤษ)"
                  ></label-custom>
                  <v-text-field
                    dense
                    outlined
                    @focus="$event.target.select()"
                    @keypress="inputName($event, 'en')"
                    :rules="rules.course_name_en"
                    v-model="course_data.course_name_en"
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
                    v-model="course_data.kingdom_name"
                    color="#FF6B81"
                    :items="kingdoms"
                    item-color="pink"
                    outlined
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
                            :class="
                              course_data.kingdom_name === item ? 'font-bold': ''"
                            >{{ item }}</span
                          ></v-list-item-title
                        >
                      </v-list-item-content>
                      <v-list-item-action>
                        <v-icon v-if="course_data.kingdom_name === item"
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
                      v-model="course_data.course_open_date"
                      @input="inputDate($event,'course open')"
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
                      placeholder="กรอกรายละเอียด..."
                    ></v-textarea>
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
                      :rules="rules.course"
                      v-model="course_data.coachs[0].coach_name"
                      color="#FF6B81"
                      :items="courses"
                      item-color="pink"
                      outlined
                      
                      placeholder="ระบุโค้ช"
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
                              :class="course_data.coachs[0].coach_name === item ? 'font-bold' : ''"
                              >{{ item }}</span
                            ></v-list-item-title
                          >
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-icon
                            v-if="course_data.coachs[0].coach_name === item"
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
                          v-model="course_data.coachs[0].register_date_range.menu_start_date "
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
                              placeholder="เลือกวันที่เริ่ม"
                              v-bind="attrs"
                              v-on="on"
                            >
                              <template v-slot:append>
                                <v-icon :color="course_data.coachs[0].register_date_range.start_date ? '#FF6B81' : ''">mdi-calendar</v-icon>
                              </template>
                            </v-text-field>
                          </template>
                          <v-date-picker
                            @input="inputDate($event, 'register start date')"
                            v-model="course_data.coachs[0].register_date_range.start_date"
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
                              :rules="rules.end_date"
                              placeholder="เลือกวันที่สิ้นสุด"
                              v-model="register_date_range_str.end_date"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                            >
                              <template v-slot:append>
                                <v-icon :color="course_data.coachs[0].register_date_range.end_date ? '#FF6B81': '' ">mdi-calendar</v-icon>
                              </template>
                            </v-text-field>
                          </template>
                          <v-date-picker
                            @input="inputDate($event, 'register end date')"
                            v-model="course_data.coachs[0].register_date_range.end_date"
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
                            course_data.coachs[0].class_date_range.menu_start_date"
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
                              placeholder="เลือกวันที่เริ่ม"
                              v-model="class_date_range_str.start_date"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                            >
                              <template v-slot:append>
                                <v-icon :color="course_data.coachs[0].class_date_range.start_date ? '#FF6B81': ''">mdi-calendar</v-icon>
                              </template>
                            </v-text-field>
                          </template>
                          <v-date-picker
                            @input="inputDate($event, 'class start date')"
                            v-model=" course_data.coachs[0].class_date_range.start_date"
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
                              :rules="rules.end_date"
                              v-model="class_date_range_str.end_date"
                              readonly
                              placeholder="เลือกวันที่สิ้นสุด"
                              v-bind="attrs"
                              v-on="on"
                            >
                              <template v-slot:append>
                                <v-icon :color="course_data.coachs[0].class_date_range.end_date ? '#FF6B81': ''">mdi-calendar</v-icon >
                              </template>
                            </v-text-field>
                          </template>
                          <v-date-picker
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
                        <v-menu
                          v-model="course_data.coachs[0].period.menu_start_time"
                          :close-on-content-click="false"
                          transition="scale-transition"
                          offset-y
                          min-width="auto"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              dense
                              outlined
                              :rules="rules.start_time"
                              v-model="course_data.coachs[0].period.start_time"
                              readonly
                              placeholder="เลือกเวลา"
                              v-bind="attrs"
                              v-on="on"
                            >
                              <template v-slot:append>
                                <v-icon :color="course_data.coachs[0].period.start_time ? '#FF6B81': ''">mdi-clock-outline</v-icon>
                              </template>
                            </v-text-field>
                          </template>
                          <v-time-picker
                            v-model="course_data.coachs[0].period.start_time"
                          ></v-time-picker>
                        </v-menu>
                      </v-col>
                      <v-col cols="auto" class="mt-2 px-0"
                        ><v-icon>mdi-minus</v-icon></v-col
                      >
                      <v-col>
                        <v-menu
                          v-model="course_data.coachs[0].period.menu_end_time"
                          :close-on-content-click="false"
                          transition="scale-transition"
                          offset-y
                          min-width="auto"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              dense
                              outlined
                              :rules="rules.end_time"
                              v-model="course_data.coachs[0].period.end_time"
                              readonly
                              placeholder="เลือกเวลา"
                              v-bind="attrs"
                              v-on="on"
                            >
                              <template v-slot:append>
                                <v-icon :color="course_data.coachs[0].period.end_time ? '#FF6B81': ''">mdi-clock-outline</v-icon>
                              </template>
                            </v-text-field>
                          </template>
                          <v-time-picker
                            v-model="course_data.coachs[0].period.end_time"
                          ></v-time-picker>
                        </v-menu>
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
                      placeholder="กรอกรายละเอียด..."
                    ></v-textarea>
                  </v-col>
                </v-row>
              </v-card-text>
            </template>
          </v-card>
        </v-stepper-content>
        <!-- Step 2 -->
        <v-stepper-content step="2" class="pa-2">
          <v-card flat>
            <headerCard title="รายละเอียดเวลาและโค้ช">
              <template v-slot:actions>
                <v-btn outlined color="#FF6B81" @click="addCoach">
                  <v-icon>mdi-plus-circle-outline</v-icon>
                  เพิ่มโค้ช
                </v-btn>
              </template>
            </headerCard>
            <v-card-text class="pt-0">
              <v-divider class="mb-3"></v-divider>
              <!-- COACH -->
              <coachs-card></coachs-card>
            </v-card-text>
          </v-card>
        </v-stepper-content>
        <!-- Step 3 -->
        <v-stepper-content step="3" class="pa-2">
          <package-card></package-card>
          <v-row dense>
            <v-col class="d-flex align-center justify-center" cols="12">
              <v-btn
                outlined
                color="#FF6B81"
                @click="addPackage(course_data.packages)"
                ><v-icon>mdi-plus-circle-outline</v-icon>เพิ่มแพ็คเกจ</v-btn
              >
            </v-col>
          </v-row>
        </v-stepper-content>
        <v-card flat>
          <v-card-text>
            <v-row dense>
              <v-col cols="12" sm align="right">
                <v-btn
                  v-if="step > 1"
                  color="#FF6B81"
                  style="width: 120px"
                  text
                  @click="step = step - 1"
                  >ย้อนกลับ</v-btn
                >
              </v-col>
              <v-col cols="auto" v-if="step < 3">
                <v-btn
                  dark
                  color="#FF6B81"
                  class="white--text"
                  style="width: 120px"
                  depressed
                  @click="step = step + 1"
                  >ถัดไป</v-btn
                >
              </v-col>
              <v-col cols="auto" v-else>
                <v-btn
                  color="#FF6B81"
                  class="white--text w-full"
                  depressed
                  @click="step = step + 1"
                  >สร้างคอร์สเรียน</v-btn
                >
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-stepper>
    </v-container>
  </v-app>
</template>  
<script>
import headerPage from "@/components/header/headerPage.vue";
import LabelCustom from "@/components/label/labelCustom.vue";
import headerCard from "@/components/header/headerCard.vue";
import CoachsCard from "@/components/course/coachsCard.vue";
import PackageCard from "@/components/course/packageCard.vue";
import {inputValidation, dateFormatter} from "@/functions/functions" 
import { mapGetters, mapActions } from "vuex";
export default {
  name: "CourseCreate",
  components: {
    headerPage,
    LabelCustom,
    headerCard,
    CoachsCard,
    PackageCard,
  },
  data: () => ({
    menu: false,
    step: 1,
    file: null,
    dragOver: false,
    previewUrl: null,
    filter: {
      kingdom: "",
      option: "",
      package: "",
    },
    days: [
      { label: "วันอาทิตย์", value: "Sunday" },
      { label: "วันจันทร์", value: "Monday" },
      { label: "วันอังคาร", value: "Tuesday" },
      { label: "วันพุท", value: "Wednesday" },
      { label: "วันพฤหัสบดี", value: "Thursday" },
      { label: "วันศุกร์", value: "Friday" },
      { label: "วันเสาร์", value: "Saturday" },
    ],
    packages: ["Exclusive Package", "Family Package", "Group Package"],
    packages_selected: [],
    options: ["รายวัน", "รายเดือน", "รายเทมอ", "รายปี"],
    options_selected: [],
    step_header_data: ["คอร์สเรียน", "ช่วงเวลาและโค้ช", "แพ็คเกจ"],
    courses: ["โค้ชหนุ่ม", "โค้ชพอล"],
    kingdoms: ["อาณาจักรศิลปะสมัยใหม่", "อาณาจักร P.E."],
    rules: {  
      course_name_th: [val => (val || '').length > 0 || 'โปรดระบุชื่อคอร์ส(ภาษาไทย)'],
      course_name_en: [val => (val || '').length > 0 || 'โปรดระบุชื่อคอร์ส(ภาษาอังกฤษ)'],
      kingdom: [val => (val || '').length > 0 || 'โปรดเลือกอาณาจักร'],
      course_open_date : [val => (val || '').length > 0 || 'โปรดเลือกวันที่เปิดคอร์ส'],
      course_hours : [val => (val || '').length > 0 || 'โปรดระบุชั่วโมงการเรียน/ครั้ง'],
      location : [val => (val || '').length > 0 || 'โปรดระบุสถานที่'],
      course :[val => (val || '').length > 0 || 'โปรดระบุโค้ช'],
      start_date : [val => (val || '').length > 0 || 'โปรดเลือกวันที่เริ่ม'],
      end_date : [val => (val || '').length > 0 || 'โปรดเลือกวันที่สิ้นสุด'],
      start_time : [val => (val || '').length > 0 || 'โปรดเลือกเวลาเริ่ม'],
      end_time : [val => (val || '').length > 0 || 'โปรดเลือกเวลาสิ้นสุด'],
    },
    course_open_date_str : "",
    register_date_range_str : {
      start_date : "",
      end_date : "",
    },
    class_date_range_str : {
      start_date : "",
      end_date : "",
    }
  }),
  created() {},
  mounted() {},
  watch: {
    "course_data.type"(newQuestion) {
      if (newQuestion) {
        this.step = 1;
      }
    },
  },
  computed: {
    ...mapGetters({
      course_data: "CourseModules/getCourseData",
    }),
  },
  methods: {
    ...mapActions({
      ChangeCourseData: "CourseModules/ChangeCourseData",
    }),
    inputName(e, lang){
      inputValidation(e, lang)
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
    openFileSelector() {
      this.$refs.fileInput.click();
    },
    uploadFile() {
      this.file = this.$refs.fileInput.files[0];
      if (!this.file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl = e.target.result;
      };
      reader.readAsDataURL(this.file);
    },
    addCoach() {
      this.course_data.coachs.push({
        close_coach: false,
        coach_name: "",
        teach_day_data: [
          {
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
          },
        ],
        class_date_range: {
          start_date: "",
          menu_start_date: false,
          end_date: "",
          menu_end_date: false,
        },
        register_date_range: {
          start_date: "",
          menu_start_date: false,
          end_date: "",
          menu_end_date: false,
        },
        period: {
          start_date: "",
          menu_start_date: false,
          end_date: "",
          menu_end_date: false,
        },
      });
      this.ChangeCourseData(this.course_data);
    },
    removeCoach(data, index) {
      data.splice(index, 1);
      this.ChangeCourseData(this.course_data);
    },
    addPackage(data) {
      data.push({
        package: "",
        students: 0,
        options: [
          {
            period_package: "",
            amount: 0,
            price_unit: 0,
            discount: false,
            discount_price: 0,
            privilege: "",
            net_price: 0,
            net_price_unit: 0,
          },
        ],
      });
      this.ChangeCourseData(this.course_data);
    },
  },
};
</script>
<style scoped>
.sub-menu {
  font-weight: 600;
  color: #2f3542;
  font-size: 22px;
}
.bg-grey-card {
  background-color: #fcfcfc;
}
/deep/.input-text-right input {
  text-align: right !important;
}
.img-header {
  position: absolute;
  right: 0px;
  max-height: 180px;
  max-width: 250px;
}
</style>
      
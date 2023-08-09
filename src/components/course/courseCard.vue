<template>
  <div>
    <!-- Upload file -->
    <v-card class="mx-3" flat>
      <v-card-text class="border-dashed border-2 border-blue-600 rounded-lg">
        <v-row v-if="preview_url">
          <v-col align="center" class="rounded-lg pa-0">
            <v-img :src="preview_url" style="max-width: 200px" align="right">
              <v-btn
                v-if="!disable"
                icon
                class="bg-[#f00]"
                dark
                @click="removeFile"
                ><v-icon>mdi-close</v-icon></v-btn
              >
            </v-img>
          </v-col>
        </v-row>
        <v-row v-if="!preview_url">
          <v-col cols="12" class="flex align-center justify-center">
            <v-img
              src="../../assets/course/upload_file.png"
              max-height="105"
              max-width="122"
            ></v-img>
          </v-col>
          <v-col cols="12" class="flex align-center justify-center text-h5">
            อัปโหลดภาพหน้าปกคอร์สเรียน
          </v-col>
          <v-col
            cols="12"
            class="flex align-center justify-center text-caption"
          >
            ( คำแนะนำ : ควรอัปโหลดรูปที่มีขนาด 1024 x 576 (16:9) และ ขนาดไฟล์ไม่เกิน 10 Mb ต้องเป็นไฟล์ JPG, PNG )
          </v-col>
          <v-col
            cols="12"
            class="flex align-center justify-center text-caption"
          >
            <!-- <span class="font-weight-bold">คำแนะนำ</span> :
            ควรอัปโหลดรูปที่มีขนาด 1280 x 500px -->
          </v-col>
          <v-col cols="12" class="flex align-center justify-center">
            <v-btn outlined color="blue" @click="openFileSelector"
              >เลือกไฟล์</v-btn
            >
            <input
              ref="fileInput"
              type="file"
              accept="image/png, image/jpeg"
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
              :disabled="disable"
              :outlined="!disable"
              :filled="disable"
              @keypress="inputName($event, 'th')"
              :rules="rules.course_name_th"
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
              :disabled="disable"
              :outlined="!disable"
              :filled="disable"
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
              :disabled="disable"
              :outlined="!disable"
              :filled="disable"
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
                      :class="
                        course_data.category_id === item.categoryId
                          ? 'font-bold'
                          : ''
                      "
                      >{{ item.categoryNameTh }}</span
                    ></v-list-item-title
                  >
                </v-list-item-content>
                <v-list-item-action>
                  <v-icon v-if="course_data.category_id === item.categoryId"
                    >mdi-check-circle</v-icon
                  >
                </v-list-item-action>
              </template>
            </v-autocomplete>
          </v-col>
          <v-col cols="12" sm="6" v-if="course_data.course_type_id === 'CT_1'">
            <label-custom required text="วันเปิดคอร์ส"></label-custom>
            <v-menu
              :disabled="disable"
              v-model="course_data.menu_course_open_date"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  dense
                  :disabled="disable"
                  :outlined="!disable"
                  :filled="disable"
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
                locale="th-TH"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="12" sm="6">
            <label-custom
              required
              text="จำนวนชั่วโมงการเรียน/ครั้ง"
            ></label-custom>
            <div>
              <v-text-field
                :disabled="disable"
                :outlined="!disable"
                :filled="disable"
                dense
                suffix="ชั่วโมง"
                :style="`width:${widthfull()}px;`"
                style="position: absolute; display: block; z-index: 4"
                @focus="SelectedStartDate($event, course_data.course_hours)"
                :rules="rules.course_hours"
                v-model="course_data.course_hours"
              >
              </v-text-field>
              <VueTimepicker
                class="time-picker-hidden"
                hide-clear-button
                advanced-keyboard
                :style="`width:${widthfull()}px;`"
                v-model="course_data.course_hours_obj"
                @change="
                  ChangeHours(
                    course_data.course_hours_obj,
                    course_data.course_hours
                  )
                "
              >
              </VueTimepicker>
            </div>
            <!-- <v-text-field
              class="input-text-right"
              suffix="ชั่วโมง"
              dense
              @focus="$event.target.select()"
              type="number"
              :disabled="disable"
              :outlined="!disable"
              :filled="disable"
              @change="ChangeCourseData(course_data)"
              :rules="rules.course_hours"
              v-model.number="course_data.course_hours"
              placeholder="ระบุจำนวนชั่วโมงการเรียน/ครั้ง"
            ></v-text-field> -->
          </v-col>
          <v-col cols="12" sm="6">
            <label-custom required text="สถานที่เรียน"></label-custom>
            <v-text-field
              dense
              :disabled="disable"
              :outlined="!disable"
              :filled="disable"
              @focus="$event.target.select()"
              :rules="rules.location"
              v-model="course_data.location"
              placeholder="ระบุสถานที่เรียน"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" v-if="course_data.course_type_id === 'CT_2'">
            <label-custom
              required
              text="จำนวนนักเรียนที่รับได้/ครั้ง"
            ></label-custom>
            <v-text-field
              dense
              :disabled="disable"
              :outlined="!disable"
              :filled="disable"
              type="number"
              @focus="$event.target.select()"
              v-model="course_data.student_recived"
              placeholder="ระบุจำนวนนักเรียนที่รับได้"
            ></v-text-field>
          </v-col>
        </v-row>
        <!-- Course Type  :: general course -->
        <template v-if="course_data.course_type_id === 'CT_1'">
          <v-row dense>
            <v-col cols="12">
              <label-custom text="รายละเอียดคอร์ส"></label-custom>
              <vue-editor
                :editorToolbar="customToolbar"
                :placeholder="course_data.detail ? '' : 'กรอกรายละเอียด...'"
                :disabled="disable"
                @text-change="ChangeCourseData(course_data)"
                v-model="course_data.detail"
              ></vue-editor>
              <!-- <v-textarea
                v-model="course_data.detail"
                :disabled="disable"
                :outlined="!disable"
                :filled="disable"
                @change="ChangeCourseData(course_data)"
                placeholder="กรอกรายละเอียด..."
              ></v-textarea> -->
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12">
              <label-custom text="performance"></label-custom>
              <vue-editor
                :editorToolbar="customToolbar"
                :placeholder="
                  course_data.music_performance ? '' : 'กรอกรายละเอียด...'
                "
                :disabled="disable"
                @text-change="ChangeCourseData(course_data)"
                v-model="course_data.music_performance"
              ></vue-editor>
              <!-- <v-textarea
                v-model="course_data.music_performance"
                :disabled="disable"
                :outlined="!disable"
                :filled="disable"
                @change="ChangeCourseData(course_data)"
                placeholder="กรอกรายละเอียด..."
              ></v-textarea> -->
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12">
              <label-custom text="certification"></label-custom>
              <vue-editor
                :editorToolbar="customToolbar"
                :placeholder="
                  course_data.catification ? '' : 'กรอกรายละเอียด...'
                "
                :disabled="disable"
                @text-change="ChangeCourseData(course_data)"
                v-model="course_data.catification"
              ></vue-editor>
              <!-- <v-textarea
                v-model="course_data.catification"
                :disabled="disable"
                :outlined="!disable"
                :filled="disable"
                @change="ChangeCourseData(course_data)"
                placeholder="กรอกรายละเอียด..."
              ></v-textarea> -->
            </v-col>
          </v-row>
        </template>
        <!-- Course Type  :: short course -->
        <template v-if="course_data.course_type_id === 'CT_2'">
          <v-row dense>
            <v-col cols="12" sm="6">
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
                :disabled="disable"
                :outlined="!disable"
                :filled="disable"
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
                    <v-icon
                      v-if="course_data.coachs[0].coach_id === item.accountId"
                      >mdi-check-circle</v-icon
                    >
                  </v-list-item-action>
                </template>
              </v-autocomplete>
            </v-col>
            <v-col cols="12" sm="6">
              <label-custom required text="ราคา/คน"></label-custom>
              <v-text-field
                placeholder="ระบุราคา"
                dense
                :disabled="disable"
                :outlined="!disable"
                :filled="disable"
                @focus="$event.target.select()"
                class="input-text-right"
                type="number"
                v-model="course_data.price_course"
                @change="ChangeCourseData(course_data)"
              >
              </v-text-field>
            </v-col>
          </v-row>
        </template>
      </v-card-text>
      <!-- Course Type  :: short course -->
      <template v-if="course_data.course_type_id === 'CT_2'">
        <headerCard title="วันและเวลา"></headerCard>
        <v-card-text class="py-0">
          <v-divider class="mb-3"></v-divider>
          <v-row dense>
            <v-col cols="12" sm="6">
              <label-custom required text="วันที่รับสมัคร"></label-custom>
              <v-row>
                <v-col>
                  <v-menu
                    :disabled="disable"
                    v-model="
                      course_data.coachs[0].register_date_range.menu_start_date
                    "
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        dense
                        :disabled="disable"
                        :outlined="!disable"
                        :filled="disable"
                        :rules="rules.start_date"
                        v-model="register_date_range_str.start_date"
                        readonly
                        placeholder="เลือกวันที่เริ่ม"
                        v-bind="attrs"
                        v-on="on"
                      >
                        <template v-slot:append>
                          <v-icon
                            :color="
                              course_data.coachs[0].register_date_range
                                .start_date
                                ? '#FF6B81'
                                : ''
                            "
                            >mdi-calendar</v-icon
                          >
                        </template>
                      </v-text-field>
                    </template>
                    <v-date-picker
                      @input="inputDate($event, 'register start date')"
                      @change="StartDateRegisCourse(course_data)"
                      :min="today.toISOString()"
                      v-model="
                        course_data.coachs[0].register_date_range.start_date
                      "
                      locale="th-TH"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="auto" class="mt-2 px-0"
                  ><v-icon>mdi-minus</v-icon></v-col
                >
                <v-col>
                  <v-menu
                    :disabled="
                      disable ||
                      !course_data.coachs[0].register_date_range.start_date
                    "
                    v-model="
                      course_data.coachs[0].register_date_range.menu_end_date
                    "
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        dense
                        :disabled="
                          disable ||
                          !course_data.coachs[0].register_date_range.start_date
                        "
                        :outlined="!disable"
                        :filled="disable"
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
                            :color="
                              course_data.coachs[0].register_date_range.end_date
                                ? '#FF6B81'
                                : ''
                            "
                            >mdi-calendar</v-icon
                          >
                        </template>
                      </v-text-field>
                    </template>
                    <v-date-picker
                      :min="
                        course_data.coachs[0].register_date_range.start_date
                          ? course_data.coachs[0].register_date_range.start_date
                          : today.toISOString()
                      "
                      @input="inputDate($event, 'register end date')"
                      v-model="
                        course_data.coachs[0].register_date_range.end_date
                      "
                      locale="th-TH"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" sm="6">
              <label-custom required text="วันสอน"></label-custom>
              <v-autocomplete
                dense
                :disabled="disable"
                :outlined="!disable"
                :filled="disable"
                chips
                :rules="rules.class_date"
                deletable-chips
                item-color="pink"
                multiple
                color="#FF6B81"
                :items="days_confix"
                item-text="label"
                item-value="value"
                placeholder="โปรดเลือกวันสอน"
                v-model="course_data.coachs[0].teach_day_data[0].teach_day"
              >
                <template v-slot:selection="{ attrs, item, selected }">
                  <v-chip
                    v-bind="attrs"
                    :input-value="selected"
                    close
                    small
                    color="#ffeeee"
                    text-color="#ff6b81"
                    @click:close="
                      removeChip(
                        item,
                        course_data.coachs[0].teach_day_data[0].teach_day
                      )
                    "
                  >
                    <strong>{{ item.label }}</strong>
                  </v-chip>
                </template>
              </v-autocomplete>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12" sm="6" class="pr-2">
              <label-custom required text="วันที่เรียน"></label-custom>
              <v-row>
                <v-col>
                  <v-menu
                    :disabled="disable"
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
                        :disabled="disable"
                        :outlined="!disable"
                        :filled="disable"
                        :rules="rules.start_date"
                        placeholder="เลือกวันที่เริ่ม"
                        v-model="class_date_range_str.start_date"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      >
                        <template v-slot:append>
                          <v-icon
                            :color="
                              course_data.coachs[0].class_date_range.start_date
                                ? '#FF6B81'
                                : ''
                            "
                            >mdi-calendar</v-icon
                          >
                        </template>
                      </v-text-field>
                    </template>
                    <v-date-picker
                      :min="
                        course_data.coachs[0].register_date_range.end_date
                          ? course_data.coachs[0].register_date_range.end_date
                          : today.toISOString()
                      "
                      @change="StartDateStudyCourse(course_data)"
                      @input="inputDate($event, 'class start date')"
                      v-model="
                        course_data.coachs[0].class_date_range.start_date
                      "
                      locale="th-TH"
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
                    :disabled="
                      disable ||
                      !course_data.coachs[0].class_date_range.start_date
                    "
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        dense
                        :disabled="
                          disable ||
                          !course_data.coachs[0].class_date_range.start_date
                        "
                        :outlined="!disable"
                        :filled="disable"
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
                            :color="
                              course_data.coachs[0].class_date_range.end_date
                                ? '#FF6B81'
                                : ''
                            "
                            >mdi-calendar</v-icon
                          >
                        </template>
                      </v-text-field>
                    </template>
                    <v-date-picker
                      :min="
                        course_data.coachs[0].class_date_range.start_date
                          ? course_data.coachs[0].class_date_range.start_date
                          : today.toISOString()
                      "
                      @input="inputDate($event, 'class end date')"
                      v-model="course_data.coachs[0].class_date_range.end_date"
                      locale="th-TH"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" sm="6" class="px-0">
              <label-custom required text="เวลาเรียน"></label-custom>
              <v-row>
                <v-col cols="auto">
                  <v-text-field
                    :disabled="disable"
                    :outlined="!disable"
                    :filled="disable"
                    dense
                    :style="`width:${width()}px;`"
                    style="position: absolute; display: block; z-index: 4"
                    @focus="
                      SelectedStartDate(
                        $event,
                        course_data.coachs[0].period.start_time
                      )
                    "
                    :rules="rules.start_time"
                    v-model="course_data.coachs[0].period.start_time"
                  >
                  </v-text-field>
                  <VueTimepicker
                    class="time-picker-hidden"
                    hide-clear-button
                    advanced-keyboard
                    :style="`width:${width()}px;`"
                    v-model="course_data.coachs[0].period.start_time_object"
                    @change="
                      ChangeStartDate(course_data.coachs[0].period, course_data)
                    "
                  >
                  </VueTimepicker>
                </v-col>
                <v-col cols="auto" class="mt-2 px-0"
                  ><v-icon>mdi-minus</v-icon></v-col
                >
                <v-col>
                  <v-text-field
                    disabled
                    :outlined="!disable"
                    :filled="disable"
                    dense
                    :style="`width:${width()}px;`"
                    style="position: absolute; display: block; z-index: 4"
                    :rules="rules.end_time"
                    v-model="course_data.coachs[0].period.end_time"
                  >
                  </v-text-field>
                  <VueTimepicker
                    class="time-picker-hidden"
                    hide-clear-button
                    advanced-keyboard
                    v-model="course_data.coachs[0].period.end_time_object"
                  >
                  </VueTimepicker>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row dense>
            <!-- PERIOD -->
          </v-row>
          <v-row dense>
            <v-col cols="12">
              <label-custom text="รายละเอียดคอร์ส"></label-custom>
              <v-textarea
                v-model="course_data.detail"
                :disabled="disable"
                :outlined="!disable"
                :filled="disable"
                @change="ChangeCourseData(course_data)"
                placeholder="กรอกรายละเอียด..."
              ></v-textarea>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12">
              <label-custom text="certification"></label-custom>
              <v-textarea
                v-model="course_data.catification"
                :disabled="disable"
                :outlined="!disable"
                :filled="disable"
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
// import { Input, TimePicker } from "ant-design-vue";
import VueTimepicker from "vue2-timepicker/src/vue-timepicker.vue";
import Swal from "sweetalert2";
import {
  inputValidation,
  dateFormatter,
  CheckFileSize,
} from "@/functions/functions";
import { VueEditor } from "vue2-editor";
import moment from "moment";
export default {
  name: "courseCard",
  props: {
    coachs: { type: Array },
    categorys: { type: Array },
    disable: { type: Boolean, default: false },
    edited: { type: Boolean },
  },
  components: {
    LabelCustom,
    headerCard,
    VueTimepicker,
    VueEditor,
  },
  // directives: {
  //   "ant-input": Input,
  // },
  data: () => ({
    today: new Date(),
    preview_url: null,
    days_confix: [
      { label: "วันอาทิตย์", value: 0 },
      { label: "วันจันทร์", value: 1 },
      { label: "วันอังคาร", value: 2 },
      { label: "วันพุธ", value: 3 },
      { label: "วันพฤหัสบดี", value: 4 },
      { label: "วันศุกร์", value: 5 },
      { label: "วันเสาร์", value: 6 },
    ],
    customToolbar: [
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
    ],
    rules: {
      course_name_th: [
        (val) => (val || "").length > 0 || "โปรดระบุชื่อคอร์ส(ภาษาไทย)",
        (val) =>
          val.length < 256 || "ชื่อคอร์ส(ภาษาไทย)ความยาวเกินกว่าที่กำหนด",
      ],
      course_name_en: [
        (val) => (val || "").length > 0 || "โปรดระบุชื่อคอร์ส(ภาษาอังกฤษ)",
        (val) =>
          val.length < 256 || "ชื่อคอร์ส(ภาษาอังกฤษ)ความยาวเกินกว่าที่กำหนด",
      ],
      kingdom: [(val) => (val || "").length > 0 || "โปรดเลือกอาณาจักร"],
      course_open_date: [
        (val) => (val || "").length > 0 || "โปรดเลือกวันที่เปิดคอร์ส",
      ],
      course_hours: [
        (val) => (val || "") > 0 || "โปรดระบุชั่วโมงการเรียน/ครั้ง",
        (val) => val < 25 || "ชั่วโมงการเรียนเกินกว่าที่กำหนด",
      ],
      location: [(val) => (val || "").length > 0 || "โปรดระบุสถานที่"],
      class_date: [(val) => (val || "").length > 0 || "โปรดเลือกวันที่"],
      coach: [(val) => (val || "").length > 0 || "โปรดระบุโค้ช"],
      start_date: [(val) => (val || "").length > 0 || "โปรดเลือกวันที่เริ่ม"],
      end_date: [(val) => (val || "").length > 0 || "โปรดเลือกวันที่สิ้นสุด"],
      start_time: [(val) => (val || "").length > 0 || "โปรดเลือกเวลาเริ่ม"],
      end_time: [(val) => (val || "").length > 0 || "โปรดเลือกเวลาสิ้นสุด"],
      student_recived: [
        (val) => (val || "") > 0 || "โปรดระบุจำนวนนักเรียนที่รับได้",
        (val) => val < 1000 || "จำนวนนักเรียนที่รับได้เกินกว่าที่กำหนด",
      ],
      price: [(val) => (val || "") > 0 || "โปรดระบุราคา"],
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
    if (this.edited) {
      this.preview_url = this.course_data?.course_img;
      this.class_date_range_str = {
        start_date: dateFormatter(
          this.course_data?.coachs[0].class_date_range.start_date,
          "DD MMT YYYYT"
        ),
        end_date: dateFormatter(
          this.course_data?.coachs[0].class_date_range.end_date,
          "DD MMT YYYYT"
        ),
      };
      this.register_date_range_str = {
        start_date: dateFormatter(
          this.course_data?.coachs[0].register_date_range.start_date,
          "DD MMT YYYYT"
        ),
        end_date: dateFormatter(
          this.course_data?.coachs[0].register_date_range.end_date,
          "DD MMT YYYYT"
        ),
      };
    }
  },
  mounted() {},
  watch: {
    disable: function () {
      if (this.edited) {
        if (this.disable) {
          this.preview_url = this.course_data.course_img;
        }
      }
    },
    "course_data.course_type_id": function () {
      this.removeFile();
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
    removeChip(item, value) {
      value.splice(value.indexOf(item), 1);
    },
    StartDateRegisCourse(course_data) {
      // console.log("StartDateRegisCourse")
      this.course_data.coachs[0].register_date_range.end_date = "";
      this.register_date_range_str.end_date = "";
      this.ChangeCourseData(course_data);
    },
    StartDateStudyCourse(course_data) {
      // console.log("StartDateStudyCourse")
      this.course_data.coachs[0].class_date_range.end_date = "";
      this.class_date_range_str.end_date = "";
      this.ChangeCourseData(course_data);
    },
    SelectedStartDate(e) {
      e.target.parentNode.parentNode.parentNode.parentNode.parentNode
        .getElementsByClassName("time-picker-hidden")[0]
        .getElementsByTagName("input")[0]
        .focus();
    },
    ChangeHours(hours, course_hours) {
      console.log("couser_hours", course_hours);
      if (hours) {
        this.course_data.course_hours =
          parseInt(hours.HH) + "." + parseInt(hours.mm);
      }
    },
    ChangeStartDate(date) {
      if (!date.start_time_object.mm) {
        date.start_time_object.mm = "00";
      }
      this.course_data.course_period_start_date = `${date.start_time_object.HH}:${date.start_time_object.mm}`;
      if (
        parseInt(date.start_time_object.HH) +
          parseInt(this.course_data.course_hours_obj.HH) >=
        24
      ) {
        date.end_time_object.HH =
          "0" +
          `${
            parseInt(date.start_time_object.HH) +
            parseInt(this.course_data.course_hours_obj.HH) -
            24
          }`.slice(-2);
      } else {
        date.end_time_object.HH = `${
          "0" +
          (parseInt(date.start_time_object.HH) +
            parseInt(this.course_data.course_hours_obj.HH))
        }`.slice(-2);
      }
      if (
        parseInt(date.start_time_object.mm) +
          parseInt(this.course_data.course_hours_obj.mm) >
        60
      ) {
        date.end_time_object.mm = `${
          "0" +
          (parseInt(date.start_time_object.mm) +
            parseInt(this.course_data.course_hours_obj.mm) -
            60)
        }`.slice(-2);
      } else {
        date.end_time_object.mm = `${
          "0" +
          (parseInt(date.start_time_object.mm) +
            parseInt(this.course_data.course_hours_obj.mm))
        }`.slice(-2);
      }
      date.start_time = `${date.start_time_object.HH}:${date.start_time_object.mm}`;
      date.end_time = `${date.end_time_object.HH}:${date.end_time_object.mm}`;
      this.course_data.course_period_end_date = date.end_time;
    },
    width() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return 99;
        case "sm":
          return 147.5;
        case "md":
          return 180.5;
        case "lg":
          return 251.5;
        case "xl":
          return 401.75;
      }
    },
    widthfull() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return 246;
        case "sm":
          return 343;
        case "md":
          return 409;
        case "lg":
          return 500;
        case "xl":
          return 572;
      }
    },
    genStartTimeEndTime(value) {
      if (value) {
        const end = moment(value).add(this.course_data.course_hours, "hour");
        this.course_data.coachs[0].period.end_time = end;
      }
      this.ChangeCourseData(this.course_data);
    },
    limitEndTime(value) {
      let start = this.course_data.coachs[0].period.start_time;
      let end = moment(value);
      if (start.isAfter(end)) {
        const endTime = moment(start).add(
          this.course_data.course_hours,
          "hour"
        );
        this.course_data.coachs[0].period.end_time = endTime;
      }
      this.ChangeCourseData(this.course_data);
    },
    removeFile() {
      this.preview_url = null;
      this.course_data.course_img = null;
      this.ChangeCourseData(this.course_data);
    },
    inputName(e, lang) {
      inputValidation(e, lang);
    },
    inputDate(e, data) {
      switch (data) {
        case "course open":
          this.course_data.course_open_date_str = dateFormatter(
            e,
            "DD MMT YYYYT"
          );
          break;
        case "register start date":
          this.register_date_range_str.start_date = dateFormatter(
            e,
            "DD MMT YYYYT"
          );
          break;
        case "register end date":
          this.register_date_range_str.end_date = dateFormatter(
            e,
            "DD MMT YYYYT"
          );
          break;
        case "class start date":
          this.class_date_range_str.start_date = dateFormatter(
            e,
            "DD MMT YYYYT"
          );
          break;
        case "class end date":
          this.class_date_range_str.end_date = dateFormatter(e, "DD MMT YYYYT");
          break;
      }
    },
    openFileSelector() {
      this.$refs.fileInput.click();
    },
    uploadFile() {
      this.file = this.$refs.fileInput.files[0];
      if (!this.file) return;
      if (CheckFileSize(this.file) === true) {
        const fileType = this.file.type;
        if (fileType === "image/png" || fileType === "image/jpeg") {
          this.course_data.course_img = this.file;
          this.ChangeCourseData(this.course_data);
          const reader = new FileReader();
          reader.onload = (e) => {
            this.preview_url = e.target.result;
          };
          reader.readAsDataURL(this.file);
        } else {
          Swal.fire({
            icon: "error",
            text: "อัปโหลดเฉพาะไฟล์รูปภาพ(png, jpeg)เท่านั้น",
            showDenyButton: false,
            showCancelButton: false,
            confirmButtonText: "ตกลง",
            cancelButtonText: "ยกเลิก",
          });
        }
      }
    },
  },
};
</script>
  
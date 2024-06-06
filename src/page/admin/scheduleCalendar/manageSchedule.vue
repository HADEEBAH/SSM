

<template>
  <v-container>
    <headerPage :title="$t('manage tables')"></headerPage>
    <v-row class="py-2">
      <v-col cols="12" sm="8" class="w-full">
        <!-- <v-text-field
          dense
          class="w-full"
          outlined
          :label="$t('search')"
          color="pink"
          hide-details
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          @keyup="GetSearchSchedule(search)"
        ></v-text-field> -->
      </v-col>
      <v-col cols="6" sm="2" align="center" class="w-full">
        <v-btn
          @click="show_dialog_holoday = true"
          color="#FF6B81"
          class="white--text btn-size-lg w-full"
          depressed
          block
          ><span class="mdi mdi-plus">{{ $t("add a holiday") }}</span>
        </v-btn>
      </v-col>
      <v-col cols="6" sm="2" align="center" class="w-full">
        <v-btn
          outlined
          color="#FF6B81"
          class="w-full"
          depressed
          block
          @click="filter_dialog = true"
        >
          <v-icon size="24" class="mdi mdi-filter-variant"></v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        v-if="get_all_holidays_is_loading || get_all_course_is_loading"
        cols="12"
        md="8"
        sm="8"
        class="d-flex align-center justify-center"
      >
        <v-progress-circular
          :size="70"
          :width="7"
          color="#ff6b81"
          indeterminate
        ></v-progress-circular>
      </v-col>
      <v-col
        v-show="!get_all_holidays_is_loading && !get_all_course_is_loading"
        cols="12"
        md="8"
        sm="8"
      >
        <calendarAdmin :searchFilter="search"></calendarAdmin>
      </v-col>
      <v-col cols="12" md="4" sm="4">
        <v-card class="my-3 pa-2 max-h-[300px] overflow-auto rounded-lg">
          <!-- วันที่ -->
          <v-card-text>
            <div class="pink--text font-bold text-center">
              {{ formattedDate }}
            </div>
          </v-card-text>
          <div class="font-bold">{{ $t("course schedule") }}</div>
          <!-- ตารางวิชาเรียน -->
          <div
            v-if="get_all_holidays_is_loading || get_all_course_is_loading"
            class="pa-2"
          >
            <v-row>
              <v-col align="center">
                <v-progress-circular
                  :size="70"
                  :width="7"
                  color="#ff6b81"
                  indeterminate
                ></v-progress-circular>
              </v-col>
            </v-row>
          </div>
          <div v-else-if="courseDate()">
            <v-alert
              class="my-2"
              border="left"
              colored-border
              color="#ff6b81"
              elevation="2"
              v-for="(item, index) in courseDate()"
              :key="index"
            >
              <v-row dense class="font-bold">
                <v-col cols="12" sm="6">
                  {{
                    $i18n.locale == "th"
                      ? item?.courseName?.courseNameTh
                      : item?.courseName?.courseNameEn
                  }}
                </v-col>
                <v-col cols="12" sm="6">
                  {{ item?.time?.start }} - {{ item?.time?.end }}</v-col
                >
              </v-row>

              <v-row dense>
                <v-col cols="12" sm="6"
                  >{{ $t("coach") }} :
                  {{
                    $i18n.locale == "th" ? item?.coachName : item?.coachNameEn
                  }}
                </v-col>
                <v-col cols="12" sm="6">
                  <v-chip
                    v-if="item?.cpo?.packageName"
                    :color="
                      item?.cpo?.packageName
                        ? package_options.filter(
                            (v) => v.value === item?.cpo?.packageName
                          )[0]?.bg_color
                        : ''
                    "
                    :style="
                      item.cpo.packageName
                        ? `color:${
                            package_options.filter(
                              (v) => v.value === item?.cpo?.packageName
                            )[0]?.color
                          }`
                        : ''
                    "
                  >
                    {{
                      item?.cpo?.packageName
                        ? package_options.filter(
                            (v) => v.value === item?.cpo?.packageName
                          )[0]?.label
                        : ""
                    }}
                  </v-chip>
                </v-col>
              </v-row>

              <div v-if="item?.courseMonitor?.length > 0">
                <v-row
                  dense
                  v-for="(seat, index) in item?.courseMonitor.filter(
                    (v) => v.timeId === item.time.timeId
                  )"
                  :key="index"
                >
                  <v-col
                    cols="12"
                    class="mdi mdi-account-group-outline"
                    style="color: #ff6b81"
                  >
                    {{ seat?.currentStudent }} / {{ seat?.maximumStudent }}
                    {{ $t("seat") }}
                  </v-col>
                </v-row>
              </div>
            </v-alert>
          </div>

          <div v-else>
            <v-alert
              class="my-2"
              border="left"
              colored-border
              :color="item?.allDay === true ? '#e9967a' : '#f19a5a'"
              elevation="2"
              v-for="(item, index) in AllHolidayDate()"
              :key="index"
            >
              <v-row dense class="font-bold">
                <v-col cols="12">
                  {{ $t("holiday") }} {{ GenDate(item?.fullDate) }}
                </v-col>
              </v-row>

              <v-row dense class="">
                <v-col cols="12" sm="6">
                  {{ item?.holidayName }}
                </v-col>

                <v-col cols="12" sm="6">
                  {{
                    item?.allDay === true
                      ? $t("all days")
                      : `${item.holidayStartTime} - ${item.holidayEndTime}`
                  }}
                </v-col>
              </v-row>
            </v-alert>
          </div>

          <!-- แก้ไขวันหยุด -->
        </v-card>
        <v-card class="pa-2 max-h-[300px] overflow-auto rounded-lg">
          <div class="font-bold">{{ $t("holiday") }}</div>
          <v-card-text
            v-for="(getHolidays, index_holidays) in get_all_holidays"
            :key="index_holidays"
            class="bg-[#FDF1E7] my-2 rounded-lg"
            color="#ED7D2B"
          >
            <v-row dense>
              <v-col cols="6" sm="" class="font-bold" style="color: #f19a5a">
                {{ GenDate(getHolidays?.fullDate) }}
              </v-col>
              <v-col
                cols="6"
                sm="auto"
                @click="editHolidays(getHolidays)"
                align="end"
              >
                <span
                  class="mdi mdi-pencil-box cursor-pointer"
                  style="color: #f19a5a; font-size: 2em"
                ></span>
              </v-col>
            </v-row>
            <div style="color: #f19a5a">
              {{ getHolidays.holidayName }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- แก้ไขวันหยุด -->
    <template>
      <v-row justify="center">
        <v-dialog
          v-model="show_dialog_edit_holoday"
          persistent
          max-width="600px"
        >
          <v-form ref="form_dialog" v-model="form_dialog">
            <v-card>
              <v-container>
                <v-card-title>
                  <v-row dense>
                    <v-col class="absolute top-0 right-0" cols="12" align="end">
                      <v-btn icon @click="closeDialog">
                        <v-icon color="#ff6b81">mdi-close</v-icon>
                      </v-btn>
                    </v-col>

                    <v-col cols="12" align="center" class="font-bold">
                      {{ $t("edit holiday") }}
                    </v-col>
                  </v-row>
                </v-card-title>

                <v-card-text>
                  <v-row dense>
                    <!-- วันที่ -->
                    <v-col cols="12" sm="8">
                      <label class="font-weight-bold">{{ $t("date") }}</label>
                      <v-menu
                        v-model="selectEditHolidaydates"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            dense
                            outlined
                            append-icon="mdi-calendar"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                            color="#FF6B81"
                            v-model="holidaydatesTh"
                          ></v-text-field>
                        </template>

                        <v-date-picker
                          v-model="editHolidayDates"
                          @input="
                            setHolidaydates(editHolidayDates),
                              (selectEditHolidaydates = false)
                          "
                          :min="tomorrowDate()"
                          locale="th-TH"
                        ></v-date-picker>
                      </v-menu>
                    </v-col>
                    <!-- Switch -->
                    <v-col
                      cols="12"
                      sm="4"
                      class="text-center align-self-center"
                    >
                      <v-switch
                        v-model="setDataEditDialog.allDay"
                        :label="$t('all days')"
                        color="#FF6B81"
                        inset
                        @change="changeSwish(setDataEditDialog)"
                      ></v-switch>
                    </v-col>
                  </v-row>

                  <v-row dense v-if="setDataEditDialog.allDay === false">
                    <!-- เวลาเริ่ม -->

                    <v-col cols="12" sm="6">
                      <label class="font-weight-bold">{{
                        $t("start time")
                      }}</label>
                      <br />
                      <!-- :rules="start_time" -->
                      <v-text-field
                        outlined
                        dense
                        style="
                          position: absolute;
                          display: block;
                          z-index: 4;
                          max-width: 141.5px;
                        "
                        @focus="SelectedStartDate($event)"
                        :rules="compensation_start_time"
                        :value="setDataEditDialog.holidayStartTime"
                        color="#FF6B81"
                      ></v-text-field>
                      <VueTimepicker
                        class="time-picker-hidden"
                        hide-clear-button
                        input-class="input-size-lg"
                        advanced-keyboard
                        @change="resetTimeEdit()"
                        v-model="setDataEditDialog.ob_holidayStartTime"
                        close-on-complete
                        color="#FF6B81"
                      >
                      </VueTimepicker>
                    </v-col>
                    <!-- เวลาสิ้นสุด -->
                    <v-col cols="12" sm="6">
                      <label class="font-weight-bold">{{
                        $t("end time")
                      }}</label>
                      <br />
                      <!-- :rules="start_time" -->
                      <v-text-field
                        outlined
                        dense
                        style="
                          position: absolute;
                          display: block;
                          z-index: 4;
                          max-width: 141.5px;
                        "
                        @focus="SelectedStartDate($event)"
                        :rules="compensation_end_time"
                        :value="setDataEditDialog.holidayEndTime"
                        color="#FF6B81"
                      ></v-text-field>
                      <VueTimepicker
                        class="time-picker-hidden"
                        hide-clear-button
                        input-class="input-size-lg"
                        advanced-keyboard
                        @change="
                          setDataEditDialog.holidayEndTime = `${setDataEditDialog.ob_holidayEndTime.HH} : ${setDataEditDialog.ob_holidayEndTime.mm}`
                        "
                        v-model="setDataEditDialog.ob_holidayEndTime"
                        close-on-complete
                        :hour-range="
                          checkHourEdit(setDataEditDialog.ob_holidayStartTime)
                        "
                        color="#FF6B81"
                      >
                      </VueTimepicker>
                    </v-col>
                  </v-row>

                  <v-row dense>
                    <v-col cols="12">
                      <label class="font-weight-bold">{{
                        $t("holiday name")
                      }}</label>
                      <v-textarea
                        v-model="setDataEditDialog.holidayName"
                        outlined
                        :placeholder="
                          $t(
                            'specify the name of the holiday, such as Songkran Day'
                          )
                        "
                        :rules="holiday_name"
                        color="#FF6B81"
                      ></v-textarea>
                    </v-col>
                  </v-row>
                </v-card-text>

                <v-card-actions>
                  <v-row dense>
                    <!-- Delete -->
                    <v-col cols="6" align="center">
                      <v-btn class="w-full" depressed @click="deleteHoliday">
                        {{ $t("delete holiday") }}
                      </v-btn>
                    </v-col>
                    <!-- Confirm -->
                    <v-col cols="6" align="center">
                      <v-btn
                        depressed
                        color="#FF6B81"
                        class="white--text w-full"
                        @click="editHolidaysData()"
                      >
                        {{ $t("save") }}
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card-actions>
              </v-container>
            </v-card>
          </v-form>
        </v-dialog>
      </v-row>
    </template>

    <!-- เพิ่มวันหยุด -->
    <template>
      <v-row justify="center">
        <v-dialog v-model="show_dialog_holoday" persistent max-width="600px">
          <v-form ref="form_dialog" v-model="form_dialog">
            <v-card>
              <v-container>
                <v-card-title>
                  <v-row>
                    <v-col
                      cols="12"
                      align="end"
                      class="font-bold absolute right-0 top-0"
                    >
                      <v-btn icon @click="closeDialog">
                        <v-icon color="#ff6b81">mdi-close</v-icon>
                      </v-btn>
                    </v-col>

                    <v-col cols="12" align="center" class="font-bold">
                      {{ $t("add a holiday") }}
                    </v-col>
                  </v-row>
                </v-card-title>

                <v-card-text>
                  <v-row dense>
                    <!-- วันที่ -->
                    <v-col cols="12" sm="8">
                      <label class="font-weight-bold">{{ $t("date") }}</label>

                      <v-menu
                        v-model="selectHolidaydates"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            dense
                            :label="$t('specify the date')"
                            outlined
                            append-icon="mdi-calendar"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                            :rules="dates"
                            color="#FF6B81"
                            v-model="holidaydatesTh"
                          >
                          </v-text-field>
                        </template>

                        <v-date-picker
                          v-model="holidaydates"
                          @input="
                            setHolidaydates(holidaydates),
                              (selectHolidaydates = false)
                          "
                          :min="tomorrowDate()"
                          :locale="$i18n.locale == 'th' ? 'th-TH' : 'en-US'"
                        ></v-date-picker>
                      </v-menu>
                    </v-col>
                    <!-- Switch -->
                    <v-col cols="12" sm="4" class="align-self-center">
                      <v-switch
                        v-model="holidaySwitch"
                        :label="$t('all days')"
                        color="#FF6B81"
                        inset
                        @change="changeSwitchHoliday($event)"
                      ></v-switch>
                    </v-col>
                  </v-row>
                  <!-- เวลา -->
                  <v-row v-if="!holidaySwitch" dense>
                    <!-- เวลาเริ่ม -->
                    <v-col cols="6">
                      <label class="font-weight-bold">{{
                        $t("start time")
                      }}</label>
                      <br />
                      <v-text-field
                        readonly
                        outlined
                        dense
                        style="
                          position: absolute;
                          display: block;
                          z-index: 4;
                          max-width: 141.5px;
                        "
                        @focus="SelectedStartDate($event)"
                        :rules="compensation_start_time"
                        v-model="holidayStartTime"
                        color="#FF6B81"
                      >
                      </v-text-field>
                      <VueTimepicker
                        class="time-picker-hidden"
                        hide-clear-button
                        input-class="input-size-lg"
                        advanced-keyboard
                        v-model="holidayStartTime"
                        close-on-complete
                        @change="resetTime()"
                        color="#FF6B81"
                      ></VueTimepicker>
                    </v-col>
                    <!-- เวลาสิ้นสุด -->
                    <v-col cols="6">
                      <label class="font-weight-bold">{{
                        $t("end time")
                      }}</label>
                      <br />
                      <v-text-field
                        readonly
                        outlined
                        dense
                        style="
                          position: absolute;
                          display: block;
                          z-index: 4;
                          max-width: 141.5px;
                        "
                        @focus="SelectedStartDate($event)"
                        :rules="compensation_end_time"
                        v-model="holidayEndTime"
                        color="#FF6B81"
                      >
                      </v-text-field>
                      <VueTimepicker
                        :disabled="!holidayStartTime"
                        class="time-picker-hidden"
                        hide-clear-button
                        input-class="input-size-lg"
                        advanced-keyboard
                        v-model="holidayEndTime"
                        close-on-complete
                        :hour-range="checkHour(holidayStartTime)"
                        color="#FF6B81"
                      ></VueTimepicker>
                    </v-col>
                  </v-row>

                  <v-row dense>
                    <v-col cols="12">
                      <label class="font-weight-bold">{{
                        $t("holiday name")
                      }}</label>
                      <v-textarea
                        v-model="nameHoliday"
                        outlined
                        :placeholder="
                          $t(
                            'specify the name of the holiday, such as Songkran Day'
                          )
                        "
                        :rules="holiday_name"
                        color="#FF6B81"
                      ></v-textarea>
                    </v-col>
                  </v-row>
                </v-card-text>

                <v-card-actions>
                  <v-row dense>
                    <v-col cols="12" align="center">
                      <v-btn
                        depressed
                        color="#FF6B81"
                        class="white--text w-full"
                        @click="CreateHolidays()"
                      >
                        {{ $t("save") }}
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card-actions>
              </v-container>
            </v-card>
          </v-form>
        </v-dialog>
      </v-row>
    </template>

    <!-- DIALOG FILTER -->
    <template>
      <v-row justify="center">
        <v-dialog v-model="filter_dialog" persistent max-width="600px">
          <v-card>
            <v-container>
              <v-card-title>
                <v-row dense>
                  <v-col
                    cols="12"
                    align="end"
                    class="font-bold absolute top-0 right-0"
                  >
                    <v-btn class="" icon @click="filter_dialog = false">
                      <v-icon color="#ff6b81">mdi-close</v-icon>
                    </v-btn>
                  </v-col>
                  <v-col cols="12" align="center" class="font-bold">
                    {{ $t("filter") }}
                  </v-col>
                </v-row>
              </v-card-title>
              <v-card-text>
                <v-badge
                  color="#FF6B81"
                  :content="selectedCourse.length"
                  :value="selectedCourse.length"
                >
                  <label class="font-weight-bold">{{ $t("courses") }}</label>
                </v-badge>
                <v-autocomplete
                  outlined
                  v-model="selectedCourse"
                  :items="get_filter_course"
                  :item-text="
                    $i18n.locale == 'th' ? 'courseNameTh' : 'courseNameEn'
                  "
                  item-value="courseId"
                  multiple
                  color="#FF6B81"
                  item-color="#FF6B81"
                  dense
                  :placeholder="this.$t('courses')"
                >
                  <template v-slot:no-data>
                    <v-list-item>
                      <v-list-item-title>
                        {{ $t("course information not found") }}
                      </v-list-item-title>
                    </v-list-item>
                  </template>
                  <template v-slot:selection="{ item, index }">
                    <v-chip v-if="index === 0">
                      <span>{{
                        $i18n.locale == "th"
                          ? item.courseNameTh
                          : item.courseNameEn
                      }}</span>
                    </v-chip>
                    <span v-if="index === 1" class="grey--text text-caption">
                      (+{{ selectedCourse.length - 1 }} {{ $t("others") }})
                    </span>
                  </template>
                </v-autocomplete>

                <!-- สถานะคอร์ส -->
                <v-badge
                  color="#FF6B81"
                  :content="selectedCourseType.length"
                  :value="selectedCourseType.length"
                >
                  <label class="font-weight-bold">{{
                    $t("courses status")
                  }}</label>
                </v-badge>
                <v-autocomplete
                  outlined
                  v-model="selectedCourseType"
                  :items="courseType"
                  :item-text="
                    $i18n.locale == 'th' ? 'coursTypeName' : 'coursTypeNameEn'
                  "
                  item-value="courseTypeValue"
                  multiple
                  color="#FF6B81"
                  item-color="#FF6B81"
                  dense
                  :placeholder="this.$t('courses status')"
                >
                  <template v-slot:no-data>
                    <v-list-item>
                      <v-list-item-title>
                        {{ $t("course status information not found") }}
                      </v-list-item-title>
                    </v-list-item>
                  </template>
                  <template v-slot:selection="{ item, index }">
                    <v-chip v-if="index === 0">
                      <span>{{
                        $i18n.locale == "th"
                          ? item.coursTypeName
                          : item.coursTypeNameEn
                      }}</span>
                    </v-chip>
                    <span v-if="index === 1" class="grey--text text-caption">
                      (+{{ selectedCourseType.length - 1 }} {{ $t("others") }})
                    </span>
                  </template>
                </v-autocomplete>

                <!-- โค้ช -->
                <v-badge
                  color="#FF6B81"
                  :content="selectedCoach.length"
                  :value="selectedCoach.length"
                >
                  <label class="font-weight-bold">{{ $t("coach") }}</label>
                </v-badge>
                <v-autocomplete
                  outlined
                  v-model="selectedCoach"
                  :items="get_coachs"
                  :item-text="
                    $i18n.locale == 'th' ? 'fullNameTh' : 'fullNameEh'
                  "
                  item-value="accountId"
                  multiple
                  color="#FF6B81"
                  item-color="#FF6B81"
                  dense
                  :placeholder="this.$t('coach')"
                >
                  <template v-slot:no-data>
                    <v-list-item>
                      <v-list-item-title>
                        {{ $t("coach information not found") }}
                      </v-list-item-title>
                    </v-list-item>
                  </template>
                  <template v-slot:selection="{ item, index }">
                    <v-chip v-if="index === 0">
                      <span>{{
                        $i18n.locale == "th" ? item.fullNameTh : item.fullNameEh
                      }}</span>
                    </v-chip>
                    <span v-if="index === 1" class="grey--text text-caption">
                      (+{{ selectedCoach.length - 1 }} {{ $t("others") }})
                    </span>
                  </template>
                </v-autocomplete>

                <v-row>
                  <v-col cols="12" sm="6" align="center">
                    <v-btn
                      @click="ClarData()"
                      depressed
                      outlined
                      :color="'#ff6b81'"
                      class="w-full"
                    >
                      {{ $t("clear") }}
                    </v-btn>
                  </v-col>
                  <v-col cols="12" sm="6" align="center">
                    <v-btn
                      @click="
                        filterSchedules(
                          selectedCourse,
                          selectedCoach,
                          selectedCourseType
                        )
                      "
                      depressed
                      :color="'#ff6b81'"
                      class="white--text w-full"
                    >
                      {{ $t("filter") }}
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-container>
          </v-card>
        </v-dialog>
      </v-row>
    </template>

    <!-- DIALOG SUCCES -->
    <v-dialog
      class="pa-2"
      width="30vw"
      v-model="dialog_show_success"
      persistent
    >
      <v-card>
        <v-card-title> </v-card-title>
        <dialogCard :text="this.$t('save data successfully')"></dialogCard>
        <div class="my-5 text-center">
          <v-btn color="#ff6b81" @click="dialog_show_success = false">
            {{ $t("save") }}
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import calendarAdmin from "@/components/calendar/calendarAdmin.vue";
import dialogCard from "@/components/dialog/dialogCard.vue";
import VueCookie from "vue-cookie";
import Swal from "sweetalert2";
import axios from "axios";
import { mapActions, mapGetters } from "vuex";
import VueTimepicker from "vue2-timepicker/src/vue-timepicker.vue";
import headerPage from "@/components/header/headerPage.vue";
import { inputValidation } from "@/functions/functions";
import moment from "moment";

export default {
  components: {
    calendarAdmin,
    dialogCard,
    VueTimepicker,
    headerPage,
  },
  data: () => ({
    dialog: true,
    search: "",
    thaiDaysOfWeek: [
      "วันอาทิตย์",
      "วันจันทร์",
      "วันอังคาร",
      "วันพุธ",
      "วันพฤหัสบดี",
      "วันศุกร์",
      "วันเสาร์",
    ],
    thaiMonths: [
      "มกราคม",
      "กุมภาพันธ์",
      "มีนาคม",
      "เมษายน",
      "พฤษภาคม",
      "มิถุนายน",
      "กรกฎาคม",
      "สิงหาคม",
      "กันยายน",
      "ตุลาคม",
      "พฤศจิกายน",
      "ธันวาคม",
    ],
    courseType: [
      {
        coursTypeName: "คอร์สเต็ม",
        coursTypeNameEn: "Full course",
        courseTypeValue: "Close",
      },
      {
        coursTypeName: "คอร์สว่าง",
        coursTypeNameEn: "Course available",
        courseTypeValue: "Open",
      },
    ],

    show_dialog_holoday: false,
    dialog_show_success: false,
    show_dialog_edit_holoday: false,
    selectHolidaydates: false,
    holidaydates: "",
    holidaydatesTh: "",
    holidaySwitch: true,
    nameHoliday: "",
    filter_dialog: false,
    selectedCourse: [],
    selectedCourseType: [],
    selectedCoach: [],
    holidayStartTime: {},
    holidayEndTime: {},
    selectEditHolidaydates: false,
    editHolidayName: "",
    selectEditHoliday: "",
    selectEditStartTime: "",
    selectEditEndTime: "",
    editHolidayDates: null,

    EditHolidayStartTime: "",
    EditHolidayEndTime: "",

    package_options: [
      {
        label: "Family Package",
        value: "Family Package",
        color: "#FFFFFF",
        bg_color: "#58A144",
      },
      {
        label: "Exclusive Package",
        value: "Exclusive Package",
        color: "#FFFFFF",
        bg_color: "#FCC419",
      },

      {
        label: "Group Package",
        value: "Group Package",
        color: "#FFFFFF",
        bg_color: "#43A4F5",
      },
      {
        label: "ชดเชย",
        value: "Student Compensation",
        color: "#FFFFFF",
        bg_color: "#A9A9A9",
      },
    ],

    time_frame: "month",
    nowDate: new Date().toISOString(),
    todayDate: new Date().toLocaleDateString(),
    setDataEditDialog: {},
    courseToday: [],
    resultSearchSchedule: null,
    form_dialog: false,
  }),

  created() {
    this.GetAllHolidays();
    this.GetAllCourse();
  },
  mounted() {
    this.GetCoachs();
    this.GetFilterCourse();
  },
  methods: {
    ...mapActions({
      GetFilterCourse: "ManageScheduleModules/GetFilterCourse",
      GetAllCourse: "ManageScheduleModules/GetAllCourse",
      GetCoachs: "CourseModules/GetCoachs",
      GetAllHolidays: "ManageScheduleModules/GetAllHolidays",
      GetHolidaysById: "ManageScheduleModules/GetHolidaysById",
      GetEditHolidays: "ManageScheduleModules/GetEditHolidays",
      GetDataInSchedule: "ManageScheduleModules/GetDataInSchedule",
      GetFilterSchedule: "ManageScheduleModules/GetFilterSchedule",
      GetSearchSchedule: "ManageScheduleModules/GetSearchSchedule",
      ResetFilte: "ManageScheduleModules/ResetFilte",
      ResetSearch: "ManageScheduleModules/ResetSearch",
    }),
    ClarData() {
      this.ResetFilte();
      this.GetDataInSchedule({
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      });
      this.filter_dialog = false;
      this.selectedCourseType = [];
      this.selectedCourse = [];
      this.selectedCoach = [];
    },
    GenDate(date) {
      if (date) {
        let options = {
          year: "numeric",
          month: "long",
          day: "numeric",
        };
        return new Date(date).toLocaleDateString(
          this.$i18n.locale == "th" ? "th-TH" : "en-US",
          options
        );
      }
    },
    checkHour(startTime) {
      let hour = [];
      let h = startTime.split(":")[0];
      for (let hr = h; hr < 24; hr++) {
        if (hr > h) {
          hour.push(hr);
        }
      }
      return hour;
    },

    resetTime() {
      this.holidayEndTime = "";
    },

    checkHourEdit(ob_holidayStartTime) {
      let hour = [];
      for (let hr = ob_holidayStartTime.HH; hr < 24; hr++) {
        if (hr > ob_holidayStartTime.HH) {
          hour.push(hr);
        }
      }
      return hour;
    },

    resetTimeEdit() {
      this.setDataEditDialog.holidayStartTime = `${this.setDataEditDialog.ob_holidayStartTime.HH} : ${this.setDataEditDialog.ob_holidayStartTime.mm}`;
      this.setDataEditDialog.holidayEndTime = "";
    },

    SelectedStartDate(e) {
      e.target.parentNode.parentNode.parentNode.parentNode.parentNode
        .getElementsByClassName("time-picker-hidden")[0]
        .getElementsByTagName("input")[0]
        .focus();
    },

    changeSwish(item) {
      if (!item.allDay) {
        this.setDataEditDialog.ob_holidayStartTime = { HH: "", mm: "" };
        this.setDataEditDialog.ob_holidayEndTime = { HH: "", mm: "" };
        this.setDataEditDialog.holidayStartTime = "";
        this.setDataEditDialog.holidayEndTime = "";
      }
    },

    setHolidaydates(item) {
      let options = {
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      this.holidaydatesTh = new Date(item).toLocaleDateString(
        this.$i18n.locale == "th" ? "th-TH" : "en-US",
        options
      );
    },

    async filterSchedules(courseId, coachId, status) {
      this.GetFilterSchedule({ courseId, coachId, status });
      this.filter_dialog = false;
    },

    async deleteHoliday() {
      Swal.fire({
        icon: "question",
        title: this.$t("do you want to delete a holiday?"),
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: this.$t("agree"),
        cancelButtonText: this.$t("no"),
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            let config = {
              headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-type": "Application/json",
                Authorization: `Bearer ${VueCookie.get("token")}`,
              },
            };
            let { data } = await axios.delete(
              `${process.env.VUE_APP_URL}/api/v1/holiday/id/${this.setDataEditDialog.holidayId}`,
              config
            );
            if (data.statusCode === 200) {
              (this.show_dialog_edit_holoday = false), this.GetAllHolidays();
              this.GetDataInSchedule({
                month: new Date().getMonth() + 1,
                year: new Date().getFullYear(),
              });
              Swal.fire({
                icon: "success",
                title: this.$t("succeed"),
                text: this.$t("save data successfully"),
                timer: 3000,
                timerProgressBar: true,
                showCancelButton: false,
                showConfirmButton: false,
              });
            }
          } catch (error) {
            Swal.fire({
              icon: "error",
              title: this.$t("something went wrong"),
              timer: 3000,
              timerProgressBar: true,
              showCancelButton: false,
              showConfirmButton: false,
            });
          }
        }
      });
    },

    validate(e, type) {
      inputValidation(e, type);
    },

    async CreateHolidays() {
      this.$refs.form_dialog.validate();
      if (this.form_dialog) {
        Swal.fire({
          icon: "question",
          title: this.$t("do you want to create a holiday?"),
          showDenyButton: false,
          showCancelButton: true,
          confirmButtonText: this.$t("agree"),
          cancelButtonText: this.$t("no"),
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              let config = {
                headers: {
                  "Access-Control-Allow-Origin": "*",
                  "Content-type": "Application/json",
                  Authorization: `Bearer ${VueCookie.get("token")}`,
                },
              };

              let payload = {
                holidayName: this.nameHoliday,
                description: "",
                allDay: this.holidaySwitch,
                holidayDate: this.holidaydates.split("-")[2],
                holidayMonth: this.holidaydates.split("-")[1],
                holidayYears: this.holidaydates.split("-")[0],
                holidayStartTime: this.holidayStartTime
                  ? this.holidayStartTime
                  : null,
                holidayEndTime: this.holidayEndTime
                  ? this.holidayEndTime
                  : null,
              };
              let { data } = await axios.post(
                `${process.env.VUE_APP_URL}/api/v1/holiday/create`,
                payload,
                config
              );
              this.show_dialog_holoday = false;
              this.holidaydates = "";
              this.holidaySwitch = true;
              this.holidayStartTime = "";
              this.holidayEndTime = "";
              this.nameHoliday = "";
              this.GetAllHolidays();
              this.GetDataInSchedule({
                month: new Date().getMonth() + 1,
                year: new Date().getFullYear(),
              });
              this.holidaydatesTh = "";

              if (data.statusCode === 201) {
                if (data.data && data.message == "Created Sucessful") {
                  Swal.fire({
                    icon: "success",
                    title: this.$t("succeed"),
                    text: this.$t("save data successfully"),
                    timer: 3000,
                    timerProgressBar: true,
                    showCancelButton: false,
                    showConfirmButton: false,
                  });
                } else {
                  Swal.fire({
                    icon: "error",
                    title: this.$t("save failed"),
                    timer: 3000,
                    timerProgressBar: true,
                    showCancelButton: false,
                    showConfirmButton: false,
                  });
                }
              }
            } catch (error) {
              if (error.response.data.statusCode === 400) {
                if (
                  error.response.data.message ==
                  "Holiday with the same date already exists."
                ) {
                  Swal.fire({
                    icon: "info",
                    title: this.$t("something went wrong"),
                    text: this.$t("this date is already built into a holiday"),
                    timer: 3000,
                    timerProgressBar: true,
                    showCancelButton: false,
                    showConfirmButton: false,
                  }).then(async (result) => {
                    if (result.isConfirmed) {
                      this.holidaydates = "";
                      this.holidaySwitch = true;
                      this.holidayStartTime = "";
                      this.holidayEndTime = "";
                      this.nameHoliday = "";
                      this.GetAllHolidays();
                    }
                  });
                }
              }
            }
          }
        });
      }
    },

    holidayDates() {
      const date = parseInt(this.holidayDate);
      const month = this.thaiMonths[parseInt(this.holidayMonth) - 1];
      const year = parseInt(this.holidayYears) + 543;

      return `${date} ${month} ${year}`;
    },

    editHolidays(holiday) {
      this.show_dialog_edit_holoday = true;
      this.setDataEditDialog = { ...holiday };
      let options = {
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      this.holidaydatesTh = new Date(holiday.fullDate).toLocaleDateString(
        this.$i18n.locale == "th" ? "th-TH" : "en-US",
        options
      );
    },

    async editHolidaysData() {
      this.$refs.form_dialog.validate();
      if (this.form_dialog) {
        this.setDataEditDialog.holidayDate = this.editHolidayDates
          ? this.editHolidayDates.split("-")[2]
          : this.setDataEditDialog.holidayDate;
        this.setDataEditDialog.holidayMonth = this.editHolidayDates
          ? this.editHolidayDates.split("-")[1]
          : this.setDataEditDialog.holidayMonth;
        this.setDataEditDialog.holidayYears = this.editHolidayDates
          ? this.editHolidayDates.split("-")[0]
          : this.setDataEditDialog.holidayYears;
        if (this.setDataEditDialog.allDay === true) {
          this.setDataEditDialog.holidayStartTime = null;
          this.setDataEditDialog.holidayEndTime = null;
        } else {
          this.setDataEditDialog.holidayStartTime =
            this.setDataEditDialog.ob_holidayStartTime.HH +
            ":" +
            this.setDataEditDialog.ob_holidayStartTime.mm;

          this.setDataEditDialog.holidayEndTime =
            this.setDataEditDialog.ob_holidayEndTime.HH +
            ":" +
            this.setDataEditDialog.ob_holidayEndTime.mm;
        }

        Swal.fire({
          icon: "question",
          title: this.$t("do you want to edit your holiday?"),
          showDenyButton: false,
          showCancelButton: true,
          confirmButtonText: this.$t("agree"),
          cancelButtonText: this.$t("no"),
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              let payload = {};
              payload = { ...this.setDataEditDialog };
              this.GetEditHolidays(payload);
              this.GetDataInSchedule({
                month: new Date().getMonth() + 1,
                year: new Date().getFullYear(),
              });
              this.show_dialog_edit_holoday = false;
              this.editHolidayDates = null;
              this.setDataEditDialog = {};
            } catch (error) {
              console.log(error);
            }
          }
        });
      }
    },

    tomorrowDate() {
      const tomorrow = new Date();
      if (this.holidaySwitch) {
        let tomorrowDate = tomorrow.getDate() + 2;
        tomorrow.setDate(tomorrowDate);
      } else {
        let tomorrowDate = tomorrow.getDate() + 1;
        tomorrow.setDate(tomorrowDate);
      }

      return tomorrow.toISOString();
    },

    changeSwitchHoliday() {
      this.holidayStartTime = "";
      this.holidayEndTime = "";
      this.editHolidayDates = null;
    },

    closeDialog() {
      this.show_dialog_holoday = false;
      this.holidaydates = "";
      this.holidaySwitch = true;
      this.holidayStartTime = "";
      this.holidayEndTime = "";
      this.nameHoliday = "";
      this.show_dialog_edit_holoday = false;
      this.setDataEditDialog = {};
      this.editHolidayDates = null;
      this.holidaydatesTh = null;
    },
    courseDate() {
      let courseTodayDate = moment(new Date()).format("YYYY-MM-DD");
      let getAllCourseDate = [];
      let success = "";
      let allCourse = [];
      for (let [index, item] of this.date_arr.entries()) {
        for (const CourseDate of item) {
          getAllCourseDate.push(CourseDate);
          if (courseTodayDate == CourseDate) {
            success = true;
            if (allCourse.length == 0) {
              allCourse.push(this.get_all_course[index]);
            } else if (
              !allCourse.some(
                (v) =>
                  v?.coachId == this.get_all_course[index]?.coachId &&
                  v?.courseId == this.get_all_course[index]?.courseId &&
                  v?.coursePackageOptionId ==
                    this.get_all_course[index]?.coursePackageOptionId &&
                  v?.timeId == this.get_all_course[index]?.timeId
              )
            ) {
              allCourse.push(this.get_all_course[index]);
            }
          }
        }
      }
      return success && allCourse;
    },
    AllHolidayDate() {
      let holyTodayDate = moment(new Date()).format("YYYY-MM-DD");

      let allHolidaysData = [];
      for (let [index, item] of this.date_Holy_arr.entries()) {
        if (holyTodayDate == item) {
          allHolidaysData.push(this.get_all_holidays[index]);
        }
      }
      return allHolidaysData;
    },
  },

  computed: {
    ...mapGetters({
      itemTime: "MyCourseModules/getcourseSchedule",
      get_filter_course: "ManageScheduleModules/getFilterCourse", //get all course
      get_all_course: "ManageScheduleModules/getAllCourse",
      get_all_course_is_loading: "ManageScheduleModules/getAllCourseIsLoading",
      date_arr: "ManageScheduleModules/getDateArray",
      date_Holy_arr: "ManageScheduleModules/getHolidayDateArray",
      get_coachs: "CourseModules/getCoachs",
      get_all_holidays: "ManageScheduleModules/getAllHolidays",
      get_all_holidays_is_loading:
        "ManageScheduleModules/getAllHolidaysIsLoading",
      get_holidays_by_id: "ManageScheduleModules/getHolidaysById",
      data_in_schedule: "ManageScheduleModules/getdataInSchadule",
      data_filter_schedule: "ManageScheduleModules/getFilterSchedule",
      data_search_schedule: "ManageScheduleModules/getSearchFilterSchedule",
    }),
    dates() {
      return [
        (val) =>
          (val || "").length > 0 ||
          this.$t("please select at least 1 day before the holiday"),
      ];
    },
    compensation_start_time() {
      return [
        (val) =>
          (val || "").length > 0 || this.$t("please select a start time"),
      ];
    },
    compensation_end_time() {
      return [
        (val) => (val || "").length > 0 || this.$t("please select an end time"),
      ];
    },
    holiday_name() {
      return [
        (val) =>
          (val || "").length > 0 ||
          this.$t("please specify the name of the holiday"),
      ];
    },
    formattedDate() {
      let date = new Date();
      return date.toLocaleDateString(
        this.$i18n.locale == "th" ? "th-TH" : "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
          weekday: "long",
        }
      );
    },
  },
};
</script>

<style scoped>
::-webkit-scrollbar {
  width: 5px;
}
::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #c7c7c7;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #c7c7c7;
}
</style>

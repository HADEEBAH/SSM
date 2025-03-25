

<template>
  <v-container>
    <headerPage :title="$t('manage tables')"></headerPage>
    <v-row class="py-2">
      <v-col cols="12" sm="6" class="w-full">
        <v-text-field
          dense
          class="w-full"
          outlined
          :label="$t('search')"
          color="pink"
          hide-details
          v-model="filter_search"
          prepend-inner-icon="mdi-magnify"
          @keypress.enter="filterSchedules()"
        ></v-text-field>
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
      <v-col cols="4" sm="2" align="center" class="w-full">
        <v-btn
          @click="addHoliday()"
          color="#FF6B81"
          class="white--text btn-size-lg w-full"
          depressed
          block
          ><span class="mdi mdi-plus">{{ $t("add a holiday") }}</span>
        </v-btn>
      </v-col>
      <v-col cols="4" sm="2" align="center" class="w-full">
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
      <!-- Export Coach -->
      <v-col cols="4" sm="2" align="center" class="w-full">
        <v-btn
          outlined
          color="#FF6B81"
          class="w-full"
          depressed
          block
          @click="filter_coach = true"
        >
          {{ $t("export") }}
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
        <!-- :searchCourse="selectedCourse"
          :searchCourseType="selectedCourseType"
          :searchChose="selectedCoach" -->
        <calendarAdmin
          @schedule-data="handleScheduleData"
          :search-filter="filter_search"
          :searchCourse="selectedCourse"
          :searchCourseType="selectedCourseType"
          :searchChose="selectedCoach"
        ></calendarAdmin>
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
        </v-card>
        <!-- แก้ไขวันหยุด -->
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
                      <v-btn icon @click="closeEdited()">
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
                    <v-col cols="12" sm="12">
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
                            disabled
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
                  </v-row>
                  <!-- ชื่อวันหยุด -->
                  <v-row dense>
                    <v-col cols="12">
                      <label class="font-weight-bold">{{
                        $t("holiday name")
                      }}</label>
                      <v-text-field
                        dense
                        v-model="setDataEditDialog.holidayName"
                        outlined
                        :placeholder="
                          $t(
                            'specify the name of the holiday, such as Songkran Day'
                          )
                        "
                        :rules="holiday_name"
                        color="#FF6B81"
                      ></v-text-field>
                    </v-col>
                  </v-row>

                  <!-- ข้อมูลคอร์สทป-->

                  <div v-if="holiday_course?.length > 0">
                    <div
                      v-for="(items, items_index) in holiday_course"
                      :key="items_index"
                    >
                      <v-card class="mb-6" v-if="items.courseTypeId == 'CT_1'">
                        <v-card-text>
                          <label class="font-weight-bold">{{
                            $t("course")
                          }}</label>
                          <v-text-field
                            dense
                            outlined
                            readonly
                            color="#FF6B81"
                            :value="
                              $i18n.locale == 'th'
                                ? items.courseNameTh
                                : items.courseNameEn
                            "
                          >
                          </v-text-field>
                          <!-- วัน/เวลาชดเชย -->
                          <label class="font-weight-bold">{{
                            $t("compensation date")
                          }}</label>
                          <v-menu
                            v-model="items.edit_date_bool"
                            :close-on-content-click="true"
                            transition="scale-transition"
                            min-width="auto"
                            color="#ff6b81"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field
                                :rules="compensation_date_rule"
                                dense
                                outlined
                                readonly
                                :placeholder="$t('choose a compensation date')"
                                v-bind="attrs"
                                v-on="on"
                                v-model="items.edit_date_string"
                                append-icon="mdi-calendar"
                                color="#ff6b81"
                              >
                              </v-text-field>
                            </template>
                            <!-- :allowed-dates="allowedDates" -->

                            <v-date-picker
                              v-model="items.selectStudyDate"
                              :min="new Date().toISOString()"
                              @input="
                                inputEditDateArr(items.selectStudyDate, items)
                              "
                              :locale="$i18n.locale == 'th' ? 'th-TH' : 'en-US'"
                              color="#ff6b81"
                            ></v-date-picker>
                          </v-menu>
                        </v-card-text>
                      </v-card>
                    </div>
                  </div>
                </v-card-text>

                <v-card-actions>
                  <v-row dense>
                    <!-- Delete -->
                    <v-col cols="6" align="center">
                      <v-btn
                        class="w-full"
                        depressed
                        @click="deletedHolidayFunction(setDataEditDialog)"
                      >
                        {{ $t("delete holiday") }}
                      </v-btn>
                    </v-col>
                    <!-- Confirm -->
                    <v-col cols="6" align="center">
                      <v-btn
                        depressed
                        color="#FF6B81"
                        class="white--text w-full"
                        @click="editHolidaysData(setDataEditDialog)"
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
          <v-form ref="add_holidat_dialog" v-model="add_holidat_dialog">
            <v-card>
              <v-container>
                <v-card-title>
                  <v-row>
                    <v-col
                      cols="12"
                      align="end"
                      class="font-bold absolute right-0 top-0"
                    >
                      <v-btn icon @click="closeAddHolidayDialog()">
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
                    <v-col cols="12">
                      <label class="font-weight-bold">{{ $t("date") }}</label>

                      <v-menu
                        v-model="create_holiday_date_bool"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        transition="scale-transition"
                        offset-y
                        color="#ff6b81"
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            dense
                            :placeholder="$t('specify the date')"
                            outlined
                            append-icon="mdi-calendar"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                            :rules="dates"
                            color="#FF6B81"
                            v-model="create_holiday_date_string"
                          >
                          </v-text-field>
                        </template>

                        <v-date-picker
                          v-model="create_holiday_date_picker"
                          @input="
                            setHolidaydates(create_holiday_date_picker),
                              (create_holiday_date_bool = false)
                          "
                          color="#ff6b81"
                          :min="tomorrowDate()"
                          :locale="$i18n.locale == 'th' ? 'th-TH' : 'en-US'"
                        ></v-date-picker>
                      </v-menu>
                    </v-col>
                    <!-- </v-row> -->
                    <!-- ชื่อวันหยุด -->
                    <!-- <v-row dense> -->
                    <v-col cols="12">
                      <label class="font-weight-bold">{{
                        $t("holiday name")
                      }}</label>

                      <v-text-field
                        v-model="nameHoliday"
                        dense
                        outlined
                        :placeholder="
                          $t(
                            'specify the name of the holiday, such as Songkran Day'
                          )
                        "
                        :rules="holiday_name"
                        color="#FF6B81"
                      ></v-text-field>
                    </v-col>
                  </v-row>

                  <!-- ข้อมูลคอร์สทป-->
                  <div
                    v-if="
                      holiday_course?.length > 0 && create_holiday_date_string
                    "
                  >
                    <div
                      v-for="(items, items_index) in holiday_course"
                      :key="items_index"
                    >
                      <v-card class="mb-6" v-if="items.courseTypeId == 'CT_1'">
                        <v-card-text>
                          <label class="font-weight-bold">{{
                            $t("course")
                          }}</label>
                          <v-text-field
                            dense
                            outlined
                            readonly
                            color="#FF6B81"
                            :value="
                              $i18n.locale == 'th'
                                ? items.courseNameTh
                                : items.courseNameEn
                            "
                          >
                          </v-text-field>
                          <!-- วัน/เวลาชดเชย -->
                          <label class="font-weight-bold">{{
                            $t("compensation date")
                          }}</label>
                          <v-menu
                            v-model="items.compensation_date_bool"
                            :close-on-content-click="true"
                            transition="scale-transition"
                            min-width="auto"
                            color="#ff6b81"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field
                                :rules="compensation_date_rule"
                                dense
                                outlined
                                readonly
                                :placeholder="$t('choose a compensation date')"
                                v-bind="attrs"
                                v-on="on"
                                v-model="items.compensation_date_string"
                                append-icon="mdi-calendar"
                                color="#ff6b81"
                              >
                              </v-text-field>
                            </template>
                            <!-- :allowed-dates="allowedDates" -->

                            <v-date-picker
                              v-model="items.selectStudyDate"
                              :min="new Date().toISOString()"
                              @input="
                                inputDateArr(items.selectStudyDate, items)
                              "
                              :locale="$i18n.locale == 'th' ? 'th-TH' : 'en-US'"
                              color="#ff6b81"
                            ></v-date-picker>
                          </v-menu>
                          <!-- </v-col> -->
                          <!-- Time -->
                          <!-- <v-col cols="12" dense>
                            {{ $t("period") }}
                            <v-row dense class="mb-3">
                              Start Time
                              <v-col class="px-2" cols="12" sm="6">
                                <v-text-field
                                  outlined
                                  dense
                                  :disabled="!compenData.dateSrt"
                                  :style="`width:${widthTime()}px;`"
                                  style="
                                    position: absolute;
                                    display: block;
                                    z-index: 4;
                                  "
                                  @focus="compensationStartDate($event)"
                                  :rules="compensation_start_time_rule"
                                  v-model="add_compensation_start_time"
                                  color="#ff6b81"
                                >
                                </v-text-field>
                                <VueTimepicker
                                  class="time-picker-hidden"
                                  hide-clear-button
                                  :style="`width:${widthTime()}px;`"
                                  input-class="input-size-lg"
                                  advanced-keyboard
                                  v-model="add_compensation_start_time"
                                  close-on-complete
                                  color="#ff6b81"
                                  @change="updateTimeStart($event, compenData)"
                                ></VueTimepicker>
                              </v-col>
                              End Time
                              <v-col class="px-2" cols="12" sm="6">
                                <v-text-field
                                  outlined
                                  dense
                                  :disabled="!compenData.timeStart"
                                  :style="`width:${widthTime()}px;`"
                                  style="
                                    position: absolute;
                                    display: block;
                                    z-index: 4;
                                  "
                                  @focus="compensationStartDate($event)"
                                  :rules="compensation_end_time_rule"
                                  v-model="add_compensation_end_time"
                                  color="#ff6b81"
                                >
                                </v-text-field>
                                <VueTimepicker
                                  class="time-picker-hidden"
                                  hide-clear-button
                                  :style="`width:${widthTime()}px;`"
                                  input-class="input-size-lg"
                                  advanced-keyboard
                                  v-model="add_compensation_end_time"
                                  close-on-complete
                                  color="#ff6b81"
                                  @change="updateTimeEnd($event, compenData)"
                                  :hour-range="checkHourEnd(compenData)"
                                ></VueTimepicker>
                              </v-col>
                            </v-row>
                          </v-col> -->
                          <!-- </v-row>
                        </v-col> -->
                        </v-card-text>
                      </v-card>
                    </div>
                  </div>
                </v-card-text>
                <!-- <pre>{{ holiday_course }}</pre>/ -->
                <v-card-actions>
                  <v-row dense>
                    <v-col cols="12" align="center">
                      <v-btn
                        depressed
                        color="#FF6B81"
                        class="white--text w-full"
                        :disabled="!add_holidat_dialog"
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
                    <v-chip
                      v-if="index === 0"
                      color="#FF6B81"
                      class="white--text"
                    >
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
                  :item-text="$i18n.locale == 'th' ? 'typeName' : 'typeNameEn'"
                  item-value="typeOfValue"
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
                    <v-chip
                      v-if="index === 0"
                      color="#FF6B81"
                      class="white--text"
                    >
                      <span>{{
                        $i18n.locale == "th" ? item.typeName : item.typeNameEn
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
                    <v-chip
                      v-if="index === 0"
                      color="#FF6B81"
                      class="white--text"
                    >
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
    <!-- class="sticky-header" -->
    <!-- DIALOG FILTER COACH-->
    <template>
      <v-row justify="center">
        <v-dialog v-model="filter_coach" persistent max-width="600px">
          <v-card class="pa-3">
            <v-card-title>
              <v-row dense>
                <v-col align="center">
                  <!-- {{ $t("export course check in") }} -->
                </v-col>
                <v-col cols="auto" align="end">
                  <v-btn icon @click="closeFilterCoach">
                    <v-icon color="#ff6b81">mdi-close</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-title>
            <!-- DATE -->
            <v-row dense>
              <!-- Start DATE -->
              <v-col cols="12" sm="6">
                <label class="font-weight-bold">{{ $t("since date") }}</label>
                <label :text="$t('created date')"></label>
                <v-menu
                  v-model="export_data.select_date_doc_start"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  color="#FF6B81"
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      dense
                      :value="
                        !export_data.start_date
                          ? export_data.start_date
                          : dateFormat(export_data.start_date)
                      "
                      :placeholder="$t('please select a start date')"
                      outlined
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      color="#FF6B81"
                    >
                      <template v-slot:append>
                        <v-icon :color="export_data.start_date ? '#FF6B81' : ''"
                          >mdi-calendar</v-icon
                        >
                      </template>
                    </v-text-field>
                  </template>
                  <v-date-picker
                    v-model="export_data.start_date"
                    @input="export_data.select_start_date = false"
                    color="#FF6B81"
                    :locale="$i18n.locale == 'th' ? 'th-TH' : 'en-US'"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" sm="6">
                <!-- End Date -->
                <label class="font-weight-bold">{{ $t("to date") }}</label>
                <v-menu
                  v-model="export_data.select_date_doc_end"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <!-- :disabled="!export_data.start_date" :min="
                    export_data.start_date ? export_data.start_date :
                    today.toISOString() " -->

                    <v-text-field
                      dense
                      :value="
                        !export_data.end_date
                          ? export_data.end_date
                          : dateFormat(export_data.end_date)
                      "
                      :placeholder="$t('please select an end date')"
                      outlined
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      color="#FF6B81"
                    >
                      <template v-slot:append>
                        <v-icon :color="export_data.end_date ? '#FF6B81' : ''"
                          >mdi-calendar</v-icon
                        >
                      </template>
                    </v-text-field>
                  </template>
                  <v-date-picker
                    :min="export_data.start_date ? export_data.start_date : ''"
                    v-model="export_data.end_date"
                    @input="inputDate($event, 'selected end date')"
                    color="#FF6B81"
                    locale="th-TH"
                  ></v-date-picker>
                </v-menu>
              </v-col>
            </v-row>
            <!-- TIME -->

            <v-row dense>
              <!-- TIME -->
              <!-- <v-col cols="12" sm="6">
                <label class="font-weight-bold">{{ $t("period") }}</label>
                <v-row dense>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      outlined
                      dense
                      :style="`width:${widthPeriod()}px;`"
                      style="position: absolute; display: block; z-index: 4"
                      @focus="SelectedStartDate($event)"
                      v-model="export_data.start_time"
                      color="#FF6B81"
                    ></v-text-field>
                    <VueTimepicker
                      class="time-picker-hidden"
                      hide-clear-button
                      input-class="input-size-lg"
                      advanced-keyboard
                      @change="resetTimeEditExport()"
                      v-model="formattedStartTime"
                      close-on-complete
                      color="#FF6B81"
                    >
                    </VueTimepicker>
                  </v-col>
                  เวลาสิ้นสุด

                  <v-col cols="12" sm="6">
                    <v-text-field
                      outlined
                      dense
                      :style="`width:${widthPeriod()}px;`"
                      style="position: absolute; display: block; z-index: 4"
                      @focus="SelectedStartDate($event)"
                      v-model="export_data.end_time"
                      color="#FF6B81"
                    ></v-text-field>
                    <VueTimepicker
                      class="time-picker-hidden"
                      hide-clear-button
                      input-class="input-size-lg"
                      advanced-keyboard
                      v-model="formattedEndTime"
                      close-on-complete
                      :hour-range="checkHourExpord(export_data.start_time)"
                      color="#FF6B81"
                    >
                    </VueTimepicker>
                  </v-col>
                </v-row>
              </v-col> -->
              <!-- โค้ช -->
              <v-col cols="12" sm="6">
                <label class="font-weight-bold">{{ $t("coach") }}</label>
                <v-autocomplete
                  outlined
                  v-model="export_data.coach_id"
                  :items="get_coachs"
                  :item-text="
                    $i18n.locale == 'th' ? 'fullNameTh' : 'fullNameEh'
                  "
                  item-value="accountId"
                  multiple
                  color="pink"
                  item-color="pink"
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
                    <v-chip dark v-if="index === 0" color="#FF6B81">
                      <span>{{
                        $i18n.locale == "th" ? item.fullNameTh : item.fullNameEh
                      }}</span>
                    </v-chip>
                    <span
                      v-if="index === 1"
                      class="grey--text text-caption"
                      color="#FF6B81"
                    >
                      (+{{ export_data.coach_id.length - 1 }}
                      {{ $t("others") }})
                    </span>
                  </template>
                </v-autocomplete>
              </v-col>

              <!-- ชื่อคอร์ส -->

              <!-- ชื่อคอร์ส -->
              <v-col cols="12" sm="6">
                <label class="font-weight-bold">{{ $t("course name") }}</label>
                <v-autocomplete
                  outlined
                  v-model="export_data.course_name"
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
                    <v-chip dark v-if="index === 0" color="#FF6B81">
                      <span>{{
                        $i18n.locale == "th"
                          ? item.courseNameTh
                          : item.courseNameEn
                      }}</span>
                    </v-chip>
                    <span v-if="index === 1" class="grey--text text-caption">
                      (+{{ export_data.course_name.length - 1 }}
                      {{ $t("others") }})
                    </span>
                  </template>
                </v-autocomplete>
              </v-col>
              <!-- ประเภทคอร์ส -->
              <v-col cols="12" sm="6">
                <label class="font-weight-bold">{{ $t("course type") }}</label>
                <v-autocomplete
                  dense
                  :items="courseType"
                  :item-text="$i18n.locale == 'th' ? 'typeName' : 'typeNameEn'"
                  item-value="typeOfValue"
                  v-model="export_data.course_type_id"
                  :placeholder="$t('please select a course type')"
                  outlined
                  multiple
                  color="#FF6B81"
                  item-color="#FF6B81"
                  @input="setCourseType()"
                >
                  <template v-slot:selection="{ item, index }">
                    <v-chip dark v-if="index === 0" color="#FF6B81">
                      <span>{{ item.typeName }}</span>
                    </v-chip>
                    <span v-if="index === 1" class="grey--text text-caption">
                      (+{{ export_data.course_type_id.length - 1 }}
                      {{ $t("Others") }})
                    </span>
                  </template>
                </v-autocomplete>
              </v-col>

              <!-- PACKGE -->

              <!-- course type -->
              <!-- <v-col cols="12" sm="6">
                <label class="font-weight-bold">{{
                  $t("course status")
                }}</label>
                <v-autocomplete
                  outlined
                  v-model="export_data.coure_status"
                  :items="courseStatus"
                  :item-text="
                    $i18n.locale == 'th' ? 'coursTypeName' : 'coursTypeNameEn'
                  "
                  item-value="courseTypeValue"
                  multiple
                  color="#FF6B81"
                  item-color="#FF6B81"
                  dense
                  :placeholder="this.$t('please select a course status')"
                >
                  <template v-slot:no-data>
                    <v-list-item>
                      <v-list-item-title>
                        {{ $t("course status information not found") }}
                      </v-list-item-title>
                    </v-list-item>
                  </template>
                  <template v-slot:selection="{ item, index }">
                    <v-chip dark v-if="index === 0" color="#FF6B81">
                      <span>{{
                        $i18n.locale == "th"
                          ? item.coursTypeName
                          : item.coursTypeNameEn
                      }}</span>
                    </v-chip>
                    <span v-if="index === 1" class="grey--text text-caption">
                      (+{{ export_data.coure_status.length - 1 }}
                      {{ $t("others") }})
                    </span>
                  </template>
                </v-autocomplete>
              </v-col> -->
              <!-- แพ็กเกจ -->
              <v-col cols="12" sm="6">
                <label class="font-weight-bold">{{ $t("package") }}</label>
                <v-autocomplete
                  dense
                  :items="packages"
                  item-text="packageName"
                  item-value="packageId"
                  v-model="export_data.package_id"
                  :placeholder="$t('please select a package')"
                  outlined
                  multiple
                  color="#FF6B81"
                  item-color="#FF6B81"
                >
                  <template v-slot:selection="{ item, index }">
                    <v-chip dark v-if="index === 0" color="#FF6B81">
                      <span>{{ item.packageName }}</span>
                    </v-chip>
                    <span v-if="index === 1" class="grey--text text-caption">
                      (+{{ export_data.package_id.length - 1 }}
                      {{ $t("others") }})
                    </span>
                  </template>
                </v-autocomplete>
              </v-col>
              <!-- ระยะเวลาคอร์ส -->
              <v-col cols="12" sm="6">
                <label class="font-weight-bold">{{ $t("period") }}</label>
                <v-autocomplete
                  dense
                  :items="options_data"
                  :item-text="
                    $i18n.locale == 'th' ? 'optionName' : 'optionNameEn'
                  "
                  item-value="optionId"
                  v-model="export_data.options_id"
                  class="py-1"
                  :placeholder="$t('please select a period')"
                  outlined
                  multiple
                  color="#FF6B81"
                  item-color="#FF6B81"
                >
                  <template v-slot:selection="{ item, index }">
                    <v-chip dark v-if="index === 0" color="#FF6B81">
                      <span>{{
                        $i18n.locale == "th"
                          ? item.optionName
                          : item.optionNameEn
                      }}</span>
                    </v-chip>
                    <span v-if="index === 1" class="grey--text text-caption">
                      (+{{ export_data.options_id.length - 1 }}
                      {{ $t("others") }})
                    </span>
                  </template>
                </v-autocomplete>
              </v-col>
              <v-col cols="12" sm="6">
                <label class="font-weight-bold">{{
                  $t("coach checkin status")
                }}</label>
                <!-- :items="checkInStatusOptions" -->

                <v-autocomplete
                  v-model="export_data.coach_check_in_status"
                  :items="coachCheckInStatusOptions"
                  :item-text="$i18n.locale == 'th' ? 'nameTh' : 'nameEn'"
                  item-value="value"
                  outlined
                  multiple
                  color="#FF6B81"
                  item-color="#FF6B81"
                  class="py-1"
                  :placeholder="this.$t('please select a coach checkin status')"
                  dense
                  @change="checkStatusOptions"
                >
                  <template v-slot:selection="{ item, index }">
                    <v-chip dark v-if="index === 0" color="#FF6B81">
                      <span>{{
                        $i18n.locale == "th" ? item.nameTh : item.nameEn
                      }}</span>
                    </v-chip>
                    <span v-if="index === 1" class="grey--text text-caption">
                      (+{{ export_data.coach_check_in_status.length - 1 }}
                      {{ $t("others") }})
                    </span>
                  </template>
                </v-autocomplete>
              </v-col>
              <v-col cols="12" sm="6">
                <label class="font-weight-bold">{{
                  $t("check in status")
                }}</label>
                <!-- :items="checkInStatusOptions" -->
                <v-autocomplete
                  v-model="export_data.check_in_status_options"
                  :items="checkInStatusOptions"
                  :item-text="$i18n.locale == 'th' ? 'nameTh' : 'nameEn'"
                  item-value="value"
                  :disabled="coachCheckInData"
                  outlined
                  multiple
                  color="#FF6B81"
                  item-color="#FF6B81"
                  class="py-1"
                  :placeholder="this.$t('please select check in status')"
                  dense
                >
                  <template v-slot:selection="{ item, index }">
                    <v-chip dark v-if="index === 0" color="#FF6B81">
                      <span>{{
                        $i18n.locale == "th" ? item.nameTh : item.nameEn
                      }}</span>
                    </v-chip>
                    <span v-if="index === 1" class="grey--text text-caption">
                      (+{{ export_data.check_in_status_options.length - 1 }}
                      {{ $t("others") }})
                    </span>
                  </template>
                </v-autocomplete>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" sm="8" align="end">
                <v-btn depressed @click="cleareData()">{{
                  $t("clear data")
                }}</v-btn></v-col
              >
              <v-col cols="12" sm="4" align="end">
                <v-btn
                  depressed
                  dark
                  color="#ff6b81"
                  :loading="loading_export"
                  @click="exportCheckin()"
                >
                  {{ $t("view all") }}
                </v-btn>
              </v-col>
            </v-row>
            <!-- <v-row dense>
              <v-col cols="12" sm="6">
                <v-btn @click="cleareData()">
                  {{ $t("clear data") }}
                </v-btn>
              </v-col>
              <v-col cols="12" sm="6">
                <v-btn @click="exportCheckin()">
                  {{ $t("export") }}
                </v-btn>
              </v-col>
            </v-row> -->
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
// import VueCookie from "vue-cookie";
import Swal from "sweetalert2";
// import axios from "axios";
import { mapActions, mapGetters } from "vuex";
// import VueTimepicker from "vue2-timepicker/src/vue-timepicker.vue";
import headerPage from "@/components/header/headerPage.vue";
import { inputValidation } from "@/functions/functions";
import moment from "moment";
// import { dateFormatter } from "@/functions/functions";

export default {
  components: {
    calendarAdmin,
    dialogCard,
    // VueTimepicker,
    headerPage,
  },
  data: () => ({
    today: new Date(),
    filter_search: "",
    dialog: true,
    search: "",
    loading_export: false,
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
    courseStatus: [
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
    courseType: [
      {
        typeName: "คอร์สทั่วไป",
        typeNameEn: "General course",
        typeOfValue: "CT_1",
      },
      {
        typeName: "คอร์สระยะสั้น",
        typeNameEn: "Short course",
        typeOfValue: "CT_2",
      },
    ],
    selectedCourses: [
      {
        courseId: "11111",
        fullNameTh: "aaaaaa",
        fullNameEn: "AAAAA",
      },
      {
        courseId: "222",
        fullNameTh: "bbbb",
        fullNameEn: "BBBBB",
      },
      {
        courseId: "333",
        fullNameTh: "cccc",
        fullNameEn: "CCCCC",
      },
      {
        courseId: "444",
        fullNameTh: "dddd",
        fullNameEn: "DDDDD",
      },
    ],
    courses: null,

    show_dialog_holoday: false,
    dialog_show_success: false,
    show_dialog_edit_holoday: false,
    selectHolidaydates: false,
    holidaydates: "",
    holidaydatesTh: "",
    holidaySwitch: true,
    nameHoliday: "",
    filter_dialog: false,
    filter_coach: false,
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
    add_holidat_dialog: false,
    select_month: "",
    select_year: "",
    select_search: "",

    checkInStatusOptions: [
      {
        nameEn: "punctual",
        nameTh: "ตรงเวลา",
        value: "punctual",
      },
      {
        nameEn: "late",
        nameTh: "สาย",
        value: "late",
      },
      {
        nameEn: "leave",
        nameTh: "ลา",
        value: "leave",
      },
      {
        nameEn: "emergency leave",
        nameTh: "ลาฉุกเฉิน",
        value: "emergency leave",
      },
      {
        nameEn: "absent",
        nameTh: "ขาด",
        value: "absent",
      },
      {
        nameEn: "no status has been selected yet",
        nameTh: "ยังไม่มีการเลือกสถานะ",
        value: "noStatus",
      },
    ],
    coachCheckInStatusOptions: [
      {
        nameEn: "already check-in",
        nameTh: "เช็คอินแล้ว",
        value: "CheckIn",
      },
      {
        nameEn: "No check-in yet",
        nameTh: "ยังไม่มีการเช็คอิน",
        value: "noCheckIn",
      },
    ],
    export_data: {
      course_name: "",
      coach_id: "",
      student_name: "",
      start_date: "",
      end_date: "",
      select_date_doc_start: false,
      select_date_doc_end: false,
      start_time: "",
      end_time: "",
      select_start_time: "",
      select_end_time: "",
      check_in_status_options: [],
      coure_status: [],
      packages: [],
      package_id: [],
      options_id: [],
      course_type_id: [],
      coach_check_in_status: [],
      storedData: "",
    },
    coachCheckInData: false,
    menuCompensationDate: false,
    compensation_date_str: "",
    compensation_date: "",
    compensationStartTime: {},
    compensation_start_time_obj: {},
    compensation_start_time: "",
    compensation_end_time_obj: {},
    compensation_end_time: "",
    compensation: [
      {
        course: "",
        dateSrt: "",
        date: "",
        menuDate: false,
        timeStart: "",
        timeEnd: "",
      },
    ],
    add_compensation_start_time: "",
    add_compensation_end_time: "",
    course_type: [],
    compensation_date_bool: false,
    edit_date_bool: false,
    compensation_date_string: "",
    selectStudyDate: "",
    course_index: 0,
    create_holiday_date_bool: false,
    create_holiday_date_string: "",
    create_holiday_date_picker: "",
  }),

  created() {
    this.storedData = JSON.parse(localStorage.getItem("userDetail"));
    this.GetAllHolidays();
    this.GetAllCourse();
    this.GetOptions();
    this.GetPackages();
    // this.holiday_course = [];
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
      packages: "CourseModules/getPackages",
      options_data: "CourseModules/getOptions",
      getCheckinFilter: "adminCheckInModules/getCheckinFilter",
      holiday_course: "ManageScheduleModules/getFilterCourseHoliday",
      create_holiday: "ManageScheduleModules/getCreateHoliday",
      course_in_holidays: "ManageScheduleModules/getCourseHoliday",
      holiday_status: "ManageScheduleModules/getHolidayStatus",
      query_data: "ManageScheduleModules/getQueryData",
    }),

    // filteredCheckInStatusOptions() {
    //   let options = this.checkInStatusOptions;
    //   if (this.storedData.account_id == "200438430336") {
    //     options.push({
    //       nameEn: "no check in",
    //       nameTh: "ยังไม่มีการเช็คอิน",
    //       value: "noCheckIn",
    //     });
    //   }
    //   return options;
    // },
    formattedStartTime: {
      get() {
        // Return time with minutes set to 00
        return this.export_data.start_time.split(":")[0] + ":00";
      },
      set(value) {
        // Update the time, ensuring minutes are always 00
        this.export_data.start_time = value;
      },
    },
    formattedEndTime: {
      get() {
        // Return time with minutes set to 00
        return this.export_data.end_time.split(":")[0] + ":00";
      },
      set(value) {
        // Update the time, ensuring minutes are always 00
        this.export_data.end_time = value;
      },
    },
    dates() {
      return [
        (val) =>
          (val || "").length > 0 ||
          this.$t("please select at least 1 day before the holiday"),
      ];
    },
    compensation_start_time_rule() {
      return [
        (val) => {
          // Check if val is in "HH:mm" format
          const isValidTime = /^([01]\d|2[0-3]):([0-5]\d)$/.test(val);
          return isValidTime || this.$t("please select a start time");
        },
      ];
    },
    compensation_end_time_rule() {
      return [
        (val) => {
          // Check if val is in "HH:mm" format
          const isValidTime = /^([01]\d|2[0-3]):([0-5]\d)$/.test(val);
          return isValidTime || this.$t("please select an end time");
        },
      ];
    },

    holiday_name() {
      return [
        (val) =>
          (val || "").length > 0 ||
          this.$t("please specify the name of the holiday"),
      ];
    },
    compensation_date_rule() {
      return [
        (val) => (val || "").length > 0 || this.$t("please select a date"),
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
    rules() {
      return {
        start_date: [
          (val) =>
            (val || "").length > 0 || this.$t("please select a start date"),
        ],
        period: [
          (val) =>
            (val || "").length > 0 || this.$t("please select a time period"),
        ],
        type_leave: [
          (val) =>
            (val || "").length > 0 || this.$t("please select leave type"),
        ],
        type: [
          (val) => (val || "").length > 0 || this.$t("please select type"),
        ],
        end_date: [
          (val) =>
            (val || "").length > 0 || this.$t("please select an end date"),
        ],
        course: [
          (val) => (val || "").length > 0 || this.$t("please select a course"),
        ],
        coach: [
          (val) => (val || "").length > 0 || this.$t("please select a coach"),
        ],
        sub_coach: [
          (val) =>
            (val || "").length > 0 ||
            this.$t("please select a substitute instructor"),
        ],
        compensation_date: [
          (val) => (val || "").length > 0 || this.$t("please select a date"),
        ],
        compensation_start_time: [
          (val) =>
            (val || "").length == 5 || this.$t("please select a start time"),
        ],
        compensation_end_time: [
          (val) =>
            (val || "").length == 5 || this.$t("please select an end time"),
        ],
      };
    },
  },
  mounted() {
    this.storedData = JSON.parse(localStorage.getItem("userDetail"));
    this.GetCoachs();
    this.GetFilterCourse();
    // this.holiday_course = [];
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
      GetPackages: "CourseModules/GetPackages",
      GetOptions: "CourseModules/GetOptions",
      CheckInFilter: "adminCheckInModules/CheckInFilter",
      GetFilterCourseHoliday: "ManageScheduleModules/GetFilterCourseHoliday",
      CreateCourseHoliday: "ManageScheduleModules/CreateCourseHoliday",
      CreateHoliday: "ManageScheduleModules/CreateHoliday",
      DeleteHoliday: "ManageScheduleModules/DeleteHoliday",
      EditedHolidayCourse: "ManageScheduleModules/EditedHolidayCourse",
    }),

    compensationStartDate(e) {
      e.target.parentNode.parentNode.parentNode.parentNode.parentNode
        .getElementsByClassName("time-picker-hidden")[0]
        .getElementsByTagName("input")[0]
        .focus();
    },
    inputDateArr(newDate, compenData) {
      let options = {
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      compenData.compensation_date_string = new Date(
        newDate
      ).toLocaleDateString(
        this.$i18n.locale == "th" ? "th-TH" : "en-US",
        options
      );
      // this.compensation_start_time_obj = { HH: "", mm: "" };
      // this.compensation_start_time = "";
      // this.compensation_end_time_obj = { HH: "", mm: "" };
      // this.compensation_end_time = "";
    },
    inputEditDateArr(newDate, compenData) {
      let options = {
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      compenData.edit_date_string = new Date(newDate).toLocaleDateString(
        this.$i18n.locale == "th" ? "th-TH" : "en-US",
        options
      );
      // this.compensation_start_time_obj = { HH: "", mm: "" };
      // this.compensation_start_time = "";
      // this.compensation_end_time_obj = { HH: "", mm: "" };
      // this.compensation_end_time = "";
    },
    updateTimeStart(newTime, compenData) {
      this.add_compensation_start_time = newTime.displayTime;
      compenData.timeStart = newTime.displayTime;
    },
    updateTimeEnd(newTime, compenData) {
      this.add_compensation_end_time = newTime.displayTime;
      compenData.timeEnd = newTime.displayTime;
    },
    checkHourEnd(time) {
      let hour = [];
      let h = parseInt(time?.timeStart?.split(":")[0], 10);

      for (let hr = h + 1; hr < 24; hr++) {
        hour.push(hr);
      }

      return hour;
    },
    async checkStatusOptions() {
      this.coachCheckInData = false;
      this.coachCheckInData =
        this.export_data.coach_check_in_status.length === 1 &&
        this.export_data.coach_check_in_status.includes("noCheckIn");

      if (this.coachCheckInData) {
        this.export_data.check_in_status_options = [];
      }
      return this.coachCheckInData;
    },
    async exportCheckin() {
      this.loading_export = true;
      await this.CheckInFilter({ export_data: this.export_data });
      this.loading_export = false;
    },
    widthPeriod() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return 300;
        case "sm":
          return 140;
        case "md":
          return 140;
        case "lg":
          return 140;
        case "xl":
          return 140;
      }
    },
    cleareData() {
      this.export_data = {
        course_name: "",
        coach_id: "",
        student_name: "",
        start_date: "",
        end_date: "",
        select_date_doc_start: false,
        select_date_doc_end: false,
        start_time: "",
        end_time: "",
        select_start_time: "",
        select_end_time: "",
        check_in_status_options: [],
        coure_status: [],
        packages: [],
        package_id: [],
        options_id: [],
        course_type_id: [],
        coach_check_in_status: [],
      };
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
    widthTime() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return 238;
        case "sm":
          return 180;
        case "md":
          return 140.5;
        case "lg":
          return 200.5;
        case "xl":
          return 405.5;
      }
    },
    inputDate(e, data) {
      switch (data) {
        case "selected end date":
          this.export_data.select_date_doc_end = false;
          // this.export_data.end_date = dateFormatter(e, "DD MMT YYYYT");
          break;
      }
    },

    handleScheduleData(month, year, search) {
      this.select_month = month;
      this.select_year = year;
      this.select_search = search;
    },
    ClarData() {
      this.ResetFilte();
      // this.GetDataInSchedule({
      //   month: new Date().getMonth() + 1,
      //   year: new Date().getFullYear(),
      // });
      this.GetDataInSchedule({
        month: this.select_month,
        year: this.select_year,
        // search: this.select_search ? this.select_search : "",
        search: this.filter_search,
        courseId: [],
        coachId: [],
        status: [],
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
    dateFormat(date) {
      return new Date(date).toLocaleDateString(
        this.$i18n.locale == "th" ? "th-TH" : "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      );
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
    checkHourExpord(startTime) {
      const startHour = parseInt(startTime.split(":")[0], 10);
      const hours = [];

      for (let i = startHour + 1; i < 24; i++) {
        hours.push(i);
      }

      return hours;
    },

    resetTimeEdit() {
      this.setDataEditDialog.holidayStartTime = `${this.setDataEditDialog.ob_holidayStartTime.HH} : ${this.setDataEditDialog.ob_holidayStartTime.mm}`;
      this.setDataEditDialog.holidayEndTime = "";
    },
    resetTimeEditExport() {
      this.export_data.select_start_time = `${this.export_data.start_time.HH} : ${this.export_data.start_time.mm}`;
      // this.export_data.start_time =
      //   this.export_data.start_time.split(":")[0] + ":00";
      this.export_data.end_time = "";
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

    closeEdited() {
      this.show_dialog_edit_holoday = false;
      this.create_holiday_date_string = null;
      this.holiday_course = [];
      this.holiday_course.map(
        (course) => (
          (course.create_holiday_date_string = null),
          (course.create_holiday_date_string = null)
        )
      );
    },
    setHolidaydates(item) {
      let options = {
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      this.create_holiday_date_string = new Date(item).toLocaleDateString(
        this.$i18n.locale == "th" ? "th-TH" : "en-US",
        options
      );
      const [holidayYears, holidayMonth, holidayDate] = item.split("-");

      this.GetFilterCourseHoliday({ holidayDate, holidayMonth, holidayYears });
      this.compensation = [
        {
          course: "",
          dateSrt: "",
          date: "",
          menuDate: false,
          timeStart: "",
          timeEnd: "",
        },
      ];
    },

    async filterSchedules() {
      // courseId, coachId, status

      // this.GetFilterSchedule({ courseId, coachId, status });
      this.GetDataInSchedule({
        month: this.select_month,
        year: this.select_year,
        // search: this.select_search ? this.select_search : "",
        search: this.filter_search,
        courseId: this.selectedCourse,
        coachId: this.selectedCoach,
        status: this.selectedCourseType,
        // courseId: courseId,
        // coachId: coachId,
        // status: status,
      });
      this.filter_dialog = false;
    },

    async deletedHolidayFunction(items) {
      // console.log("object :>> ", this.holidaydatesTh);
      // const thaiDate = this.holidaydatesTh;

      // // Mapping of Thai month names to month numbers
      // const thaiMonths = {
      //   มกราคม: "01",
      //   กุมภาพันธ์: "02",
      //   มีนาคม: "03",
      //   เมษายน: "04",
      //   พฤษภาคม: "05",
      //   มิถุนายน: "06",
      //   กรกฎาคม: "07",
      //   สิงหาคม: "08",
      //   กันยายน: "09",
      //   ตุลาคม: "10",
      //   พฤศจิกายน: "11",
      //   ธันวาคม: "12",
      // };

      // // Parse the date
      // const [day, thaiMonth, thaiYear] = thaiDate.split(" ");
      // const month = thaiMonths[thaiMonth]; // Get month number
      // const year = parseInt(thaiYear, 10) - 543; // Convert Buddhist year to Gregorian year

      // // Format the date
      // const formattedDate = moment(
      //   `${year}-${month}-${day}`,
      //   "YYYY-MM-DD"
      // ).format("YYYY-MM-DD");
      // let [choseYear, choseMonth] = formattedDate.split("-");
      // console.log("choseYear :>> ", choseYear);
      // console.log("choseMonth :>> ", choseMonth);
      // console.log(formattedDate); // Output: 2025-01-30

      Swal.fire({
        icon: "question",
        title: this.$t("do you want to delete a holiday?"),
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: this.$t("agree"),
        cancelButtonText: this.$t("no"),
      }).then(async (result) => {
        if (result.isConfirmed) {
          await this.DeleteHoliday({
            holiday_id: items.holidayId,
            query_data: this.query_data,
          });
          this.show_dialog_edit_holoday = false;
        }
      });
    },

    // async deleteHoliday() {
    //   Swal.fire({
    //     icon: "question",
    //     title: this.$t("do you want to delete a holiday?"),
    //     showDenyButton: false,
    //     showCancelButton: true,
    //     confirmButtonText: this.$t("agree"),
    //     cancelButtonText: this.$t("no"),
    //   }).then(async (result) => {
    //     if (result.isConfirmed) {
    //       try {
    //         let config = {
    //           headers: {
    //             "Access-Control-Allow-Origin": "*",
    //             "Content-type": "Application/json",
    //             Authorization: `Bearer ${VueCookie.get("token")}`,
    //           },
    //         };
    //         let { data } = await axios.delete(
    //           `${process.env.VUE_APP_URL}/api/v1/holiday/id/${this.setDataEditDialog.holidayId}`,
    //           config
    //         );
    //         if (data.statusCode === 200) {
    //           this.show_dialog_holoday = false;
    //           this.holidaydates = "";
    //           this.holidaySwitch = true;
    //           this.holidayStartTime = "";
    //           this.holidayEndTime = "";
    //           this.nameHoliday = "";
    //           this.show_dialog_edit_holoday = false;
    //           this.setDataEditDialog = {};
    //           this.editHolidayDates = null;
    //           this.holidaydatesTh = null;
    //           (this.show_dialog_edit_holoday = false), this.GetAllHolidays();

    //           this.GetDataInSchedule({
    //             month: this.select_month,
    //             year: this.select_year,
    //             // search: this.select_search ? this.select_search : "",
    //             search: this.filter_search,

    //             courseId: this.selectedCourse,
    //             coachId: this.selectedCoach,
    //             status: this.selectedCourseType,
    //           });
    //           Swal.fire({
    //             icon: "success",
    //             title: this.$t("succeed"),
    //             text: this.$t("save data successfully"),
    //             timer: 3000,
    //             timerProgressBar: true,
    //             showCancelButton: false,
    //             showConfirmButton: false,
    //           });
    //         }
    //       } catch (error) {
    //         Swal.fire({
    //           icon: "error",
    //           title: this.$t("something went wrong"),
    //           timer: 3000,
    //           timerProgressBar: true,
    //           showCancelButton: false,
    //           showConfirmButton: false,
    //         });
    //       }
    //     }
    //   });
    // },

    validate(e, type) {
      inputValidation(e, type);
    },

    // async CreateHolidays() {
    //   this.$refs.add_holidat_dialog.validate();
    //   if (this.add_holidat_dialog) {
    //     Swal.fire({
    //       icon: "question",
    //       title: this.$t("do you want to create a holiday?"),
    //       showDenyButton: false,
    //       showCancelButton: true,
    //       confirmButtonText: this.$t("agree"),
    //       cancelButtonText: this.$t("no"),
    //     }).then(async (result) => {
    //       if (result.isConfirmed) {
    //         // let payload = {
    //         //   holidayName: this.nameHoliday,
    //         //   holidayDate: this.holidaydates.split("-")[2],
    //         //   holidayMonth: this.holidaydates.split("-")[1],
    //         //   holidayYears: this.holidaydates.split("-")[0],
    //         // };
    //         // await this.CreateHoliday(payload);
    //         // if (this.create_holiday === true) {
    //         //   const mappedData = this.holiday_course.map((course) => ({
    //         //     courseId: course.courseId,
    //         //     courseNameTh: course.courseNameTh,
    //         //     courseNameEn: course.courseNameEn,
    //         //     courseTypeId: course.courseTypeId,
    //         //     selectStudyDate:
    //         //       course.courseTypeId == "CT_1" ? course.selectStudyDate : null,
    //         //     students: course.students.map((student) => ({
    //         //       studentId: student.studentId,
    //         //       firstNameTh: student.firstNameTh,
    //         //       lastNameTh: student.lastNameTh,
    //         //       packageName: student.packageName,
    //         //       optionName: student.optionName,
    //         //       optionNameEn: student.optionNameEn,
    //         //       timeStart: student.timeStart,
    //         //       timeEnd: student.timeEnd,
    //         //       orderId: student.orderId,
    //         //       coachId: student.coachId,
    //         //       dayOfWeekId: student.dayOfWeekId,
    //         //       orderItemId: student.orderItemId,
    //         //       timeId: student.timeId,
    //         //       coursePackageOptionId: student.coursePackageOptionId,
    //         //       orderStudentId: student.orderStudentId,
    //         //       dayOfWeekName: student.dayOfWeekName,
    //         //     })),
    //         //   }));
    //         //   await this.SetFilterCourseHoliday(mappedData);
    //         //   this.closeDialog();
    //         // } else {
    //         //   this.closeDialog();
    //         // }

    //         // await this.GetAllHolidays();
    //         // await this.GetAllCourse();
    //         // await this.GetDataInSchedule({
    //         //   month: this.select_month,
    //         //   year: this.select_year,
    //         //   search: this.filter_search,
    //         //   courseId: this.selectedCourse,
    //         //   coachId: this.selectedCoach,
    //         //   status: this.selectedCourseType,
    //         // });

    //         try {
    //           let config = {
    //             headers: {
    //               "Access-Control-Allow-Origin": "*",
    //               "Content-type": "Application/json",
    //               Authorization: `Bearer ${VueCookie.get("token")}`,
    //             },
    //           };

    //           let payload = {
    //             holidayName: this.nameHoliday,
    //             holidayDate: this.create_holiday_date_picker.split("-")[2],
    //             holidayMonth: this.create_holiday_date_picker.split("-")[1],
    //             holidayYears: this.create_holiday_date_picker.split("-")[0],
    //           };
    //           let { data } = await axios.post(
    //             `${process.env.VUE_APP_URL}/api/v1/holiday/create`,
    //             payload,
    //             config
    //           );

    //           this.GetAllHolidays();
    //           this.GetDataInSchedule({
    //             month: this.select_month,
    //             year: this.select_year,
    //             // search: this.select_search ? this.select_search : "",
    //             search: this.filter_search,
    //             courseId: this.selectedCourse,
    //             coachId: this.selectedCoach,
    //             status: this.selectedCourseType,
    //           });

    //           // Reset validation state
    //           this.$refs.add_holidat_dialog.reset();
    //           // Reset form fields
    //           this.show_dialog_holoday = false;
    //           this.holidaydates = "";
    //           this.holidaySwitch = true;
    //           this.holidayStartTime = "";
    //           this.holidayEndTime = "";
    //           this.nameHoliday = "";
    //           this.show_dialog_edit_holoday = false;
    //           this.setDataEditDialog = {};
    //           this.editHolidayDates = null;
    //           this.holidaydatesTh = null;

    //           if (data.statusCode === 201) {
    //             if (data.data && data.message == "Created Sucessful") {
    //               Swal.fire({
    //                 icon: "success",
    //                 title: this.$t("succeed"),
    //                 text: this.$t("save data successfully"),
    //                 timer: 3000,
    //                 timerProgressBar: true,
    //                 showCancelButton: false,
    //                 showConfirmButton: false,
    //               });
    //               const mappedData = this.holiday_course.map((course) => ({
    //                 courseId: course.courseId,
    //                 courseNameTh: course.courseNameTh,
    //                 courseNameEn: course.courseNameEn,
    //                 courseTypeId: course.courseTypeId,
    //                 selectStudyDate:
    //                   course.courseTypeId == "CT_1"
    //                     ? course.selectStudyDate
    //                     : null,
    //                 students: course.students.map((student) => ({
    //                   studentId: student.studentId,
    //                   firstNameTh: student.firstNameTh,
    //                   lastNameTh: student.lastNameTh,
    //                   packageName: student.packageName,
    //                   optionName: student.optionName,
    //                   optionNameEn: student.optionNameEn,
    //                   timeStart: student.timeStart,
    //                   timeEnd: student.timeEnd,
    //                   orderId: student.orderId,
    //                   coachId: student.coachId,
    //                   dayOfWeekId: student.dayOfWeekId,
    //                   orderItemId: student.orderItemId,
    //                   timeId: student.timeId,
    //                   coursePackageOptionId: student.coursePackageOptionId,
    //                   orderStudentId: student.orderStudentId,
    //                   dayOfWeekName: student.dayOfWeekName,
    //                 })),
    //               }));
    //               await this.SetFilterCourseHoliday(mappedData);
    //               this.closeDialog();
    //             } else {
    //               Swal.fire({
    //                 icon: "error",
    //                 title: this.$t("save failed"),
    //                 timer: 3000,
    //                 timerProgressBar: true,
    //                 showCancelButton: false,
    //                 showConfirmButton: false,
    //               });
    //             }
    //           }
    //         } catch (error) {
    //           if (error.response.data.statusCode === 400) {
    //             if (
    //               error.response.data.message ==
    //               "Holiday with the same date already exists."
    //             ) {
    //               Swal.fire({
    //                 icon: "warning",
    //                 title: this.$t("something went wrong"),
    //                 text: this.$t("this date is already built into a holiday"),
    //                 timer: 3000,
    //                 timerProgressBar: true,
    //                 showCancelButton: false,
    //                 showConfirmButton: false,
    //               });
    //               this.closeDialog();
    //               // .then(async (result) => {
    //               //   if (result.isConfirmed) {
    //               //     this.holidaydates = "";
    //               //     this.holidaySwitch = true;
    //               //     this.holidayStartTime = "";
    //               //     this.holidayEndTime = "";
    //               //     this.nameHoliday = "";
    //               //     this.GetAllHolidays();
    //               //   }
    //               // });
    //             }
    //           }
    //         }
    //       }
    //     });
    //   }
    // },
    addHoliday() {
      this.show_dialog_holoday = true;
    },
    async CreateHolidays() {
      // let [year, month] = this.create_holiday_date_picker.split("-");
      this.$refs.add_holidat_dialog.validate();
      if (this.add_holidat_dialog) {
        Swal.fire({
          icon: "question",
          title: this.$t("do you want to create a holiday?"),
          showDenyButton: false,
          showCancelButton: true,
          confirmButtonText: this.$t("agree"),
          cancelButtonText: this.$t("no"),
        }).then(async (result) => {
          if (result.isConfirmed) {
            let mappedData = [];
            if (this.holiday_course?.length > 0) {
              mappedData = this.holiday_course.map((course) => ({
                courseId: course.courseId,
                courseNameTh: course.courseNameTh,
                courseNameEn: course.courseNameEn,
                courseTypeId: course.courseTypeId,
                holidaySelectDate: this.create_holiday_date_picker,
                selectStudyDate:
                  course.courseTypeId == "CT_1" ? course.selectStudyDate : null,
                holidayName: this.nameHoliday,
                holidayDate: this.create_holiday_date_picker.split("-")[2],
                holidayMonth: this.create_holiday_date_picker.split("-")[1],
                holidayYears: this.create_holiday_date_picker.split("-")[0],
                students: course.students.map((student) => ({
                  studentId: student.studentId,
                  firstNameTh: student.firstNameTh,
                  lastNameTh: student.lastNameTh,
                  packageName: student.packageName,
                  optionName: student.optionName,
                  optionNameEn: student.optionNameEn,
                  timeStart: student.timeStart,
                  timeEnd: student.timeEnd,
                  orderId: student.orderId,
                  coachId: student.coachId,
                  dayOfWeekId: student.dayOfWeekId,
                  orderItemId: student.orderItemId,
                  timeId: student.timeId,
                  coursePackageOptionId: student.coursePackageOptionId,
                  orderStudentId: student.orderStudentId,
                  dayOfWeekName: student.dayOfWeekName,
                })),
              }));
              await this.CreateCourseHoliday({
                payload: mappedData,
                queryData: this.query_data,
              }).then(async () => {
                if (
                  this.course_in_holidays !== 400 ||
                  this.course_in_holidays !== 500
                ) {
                  // await this.GetDataInSchedule({
                  //   month: month,
                  //   year: year,
                  //   search: this.filter_search,
                  //   courseId: this.selectedCourse,
                  //   coachId: this.selectedCoach,
                  //   status: this.selectedCourseType,
                  // });
                  await this.closeAddHolidayDialog();
                  this.show_dialog_holoday = false;
                }
              });
            } else {
              mappedData = {
                holidayName: this.nameHoliday,
                holidayDate: this.create_holiday_date_picker.split("-")[2],
                holidayMonth: this.create_holiday_date_picker.split("-")[1],
                holidayYears: this.create_holiday_date_picker.split("-")[0],
              };
              this.CreateHoliday({
                payload: mappedData,
                queryData: this.query_data,
              }).then(async () => {
                if (
                  this.course_in_holidays !== 400 ||
                  this.course_in_holidays !== 500
                ) {
                  // await this.GetDataInSchedule({
                  //   month: month,
                  //   year: year,
                  //   search: this.filter_search,
                  //   courseId: this.selectedCourse,
                  //   coachId: this.selectedCoach,
                  //   status: this.selectedCourseType,
                  // });
                  await this.closeAddHolidayDialog();
                  this.show_dialog_holoday = false;
                  // Swal.fire({
                  //   icon: "success",
                  //   title: this.$t("succeed"),
                  //   text: this.$t("create holiday success"),
                  //   timer: 3000,
                  //   timerProgressBar: true,
                  //   showCancelButton: false,
                  //   showConfirmButton: false,
                  // });
                }
              });
            }

            // if (this.holiday_status) {
            //   this.closeDialog();

            // }
            // if (this.course_in_holidays.response.status === 201) {
            //   // success
            //   this.closeDialog();
            // }
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

    async editHolidays(holiday) {
      await this.GetFilterCourseHoliday({
        holidayDate: holiday.holidayDate,
        holidayMonth: holiday.holidayMonth,
        holidayYears: holiday.holidayYears,
      });
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

    async editHolidaysData(holiday_data) {
      // holiday_data
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
              await this.GetEditHolidays(payload);
              let mappedData = [];
              mappedData = this.holiday_course.map((course) => ({
                courseId: course.courseId,
                courseNameTh: course.courseNameTh,
                courseNameEn: course.courseNameEn,
                courseTypeId: course.courseTypeId,
                holidaySelectDate: holiday_data.fullDate,
                selectStudyDate:
                  course.courseTypeId == "CT_1"
                    ? course.selectStudyDate
                      ? course.selectStudyDate
                      : course.scheduleCompensationRefDate
                    : null,
                // holidayName: this.nameHoliday,
                // holidayDate: this.create_holiday_date_picker.split("-")[2],
                // holidayMonth: this.create_holiday_date_picker.split("-")[1],
                // holidayYears: this.create_holiday_date_picker.split("-")[0],
                students: course.students.map((student) => ({
                  studentId: student.studentId,
                  firstNameTh: student.firstNameTh,
                  lastNameTh: student.lastNameTh,
                  packageName: student.packageName,
                  optionName: student.optionName,
                  optionNameEn: student.optionNameEn,
                  timeStart: student.timeStart,
                  timeEnd: student.timeEnd,
                  orderId: student.orderId,
                  coachId: student.coachId,
                  dayOfWeekId: student.dayOfWeekId,
                  orderItemId: student.orderItemId,
                  timeId: student.timeId,
                  coursePackageOptionId: student.coursePackageOptionId,
                  orderStudentId: student.orderStudentId,
                  dayOfWeekName: student.dayOfWeekName,
                })),
              }));

              await this.EditedHolidayCourse({
                payload: mappedData,
                queryData: this.query_data,
              });
              // this.GetDataInSchedule({
              //   month: new Date().getMonth() + 1,
              //   year: new Date().getFullYear(),
              // });
              // this.GetDataInSchedule({
              //   month: this.select_month,
              //   year: this.select_year,
              //   // search: this.select_search ? this.select_search : "",
              //   search: this.filter_search,
              //   courseId: this.selectedCourse,
              //   coachId: this.selectedCoach,
              //   status: this.selectedCourseType,
              // });
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

    addCourse() {
      this.compensation.push({
        course: "",
        dateSrt: "",
        date: "",
        menuDate: false,
        timeStart: "",
        timeEnd: "",
      });
      // console.log("this.compensation :>> ", this.compensation);
    },
    closeAddHolidayDialog() {
      this.show_dialog_holoday = false;
      this.create_holiday_date_bool = false;
      this.create_holiday_date_string = null;
      this.nameHoliday = null;
    },
    closeDialog() {
      this.$refs.add_holidat_dialog.reset();
      this.compensation = [
        {
          course: "",
          dateSrt: "",
          date: "",
          menuDate: false,
          timeStart: "",
          timeEnd: "",
        },
      ];
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
      // this.holiday_course = [];
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
    closeFilterCoach() {
      this.filter_coach = false;
      this.export_data = {
        course_name: "",
        coach_id: "",
        student_name: "",
        start_date: "",
        end_date: "",
        select_date_doc_start: false,
        select_date_doc_end: false,
        start_time: "",
        end_time: "",
        select_start_time: "",
        select_end_time: "",
        check_in_status_options: [],
        coure_status: [],
        packages: [],
        package_id: [],
        options_id: [],
        course_type_id: [],
      };
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
.sticky-header {
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1;
  margin-bottom: 15px;
  /* box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.4); */
}
</style>

<template>
  <v-container ref="profile_booked">
    {{ setFunctions }}
    <!-- <loading-overlay
      :loading="student_is_loading || student_booking_is_loading"
    ></loading-overlay> -->
    <loading-overlay :loading="loading_overlay"></loading-overlay>
    <div>
      <label class="text-xl font-bold">{{
        $t("class schedule information")
      }}</label>
      <v-row dense class="my-3">
        <v-col cols="4">
          <v-card
            flat
            @click="
              data_local.roles.length > 0
                ? $router.push({
                    name: 'StudentsSchedule',
                    params: { action: 'MyCourse' },
                  })
                : ''
            "
            class="rounded-lg"
          >
            <v-card-text
              :class="
                this.$route.params.action == 'MyCourse'
                  ? 'bg-[#FF6B81]'
                  : 'bg-[#F5F5F5]'
              "
              class="rounded-lg flex justify-center align-center pa-2"
            >
              <label
                :class="
                  this.$route.params.action == 'MyCourse'
                    ? 'text-white'
                    : ' text-[#B3B3B3]'
                "
                class="font-bold mr-2"
                >{{ $t("mycourse") }}</label
              >
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="4">
          <v-card
            flat
            @click="
              data_local.roles.length > 0
                ? $router.push({
                    name: 'StudentsSchedule',
                    params: { action: 'MySchedule' },
                  })
                : ''
            "
            class="rounded-lg"
          >
            <v-card-text
              :class="
                this.$route.params.action == 'MySchedule'
                  ? 'bg-[#FF6B81]'
                  : 'bg-[#F5F5F5]'
              "
              class="rounded-lg flex justify-center align-center pa-2"
            >
              <label
                :class="
                  this.$route.params.action == 'MySchedule'
                    ? 'text-white'
                    : ' text-[#B3B3B3]'
                "
                class="font-bold mr-2"
                >{{ $t("study schedule") }}</label
              >
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="4">
          <v-card
            flat
            @click="
              $router.push({
                name: 'StudentsSchedule',
                params: { action: 'MyBooking' },
              })
            "
            class="rounded-lg"
          >
            <v-card-text
              :class="
                this.$route.params.action == 'MyBooking'
                  ? 'bg-[#FF6B81]'
                  : 'bg-[#F5F5F5]'
              "
              class="rounded-lg flex justify-center align-center pa-2"
            >
              <label
                :class="
                  this.$route.params.action == 'MyBooking'
                    ? 'text-white'
                    : ' text-[#B3B3B3]'
                "
                class="font-bold mr-2"
                >{{ $t("booked course") }}</label
              >
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- PAGE 1 -->
      <v-expand-x-transition transition="scale-transition">
        <div v-if="$route.params.action == 'MyCourse'">
          <!-- Role Parent -->
          <div v-if="data_local.roles?.includes('R_4')">
            <v-row dense class="mb-3">
              <v-col cols="12">
                <v-autocomplete
                  v-model="search_course_detail"
                  :items="students"
                  :item-text="
                    $i18n.locale == 'th'
                      ? 'studentFirstnameTh'
                      : 'studentFirstnameEn'
                  "
                  item-value="studentId"
                  dense
                  filled
                  hide-details
                  clearable
                  :label="$t('select your students here')"
                  @change="searchStudentCourse(search_course_detail)"
                >
                  <template v-slot:no-data>
                    <div class="mx-3 font-bold">
                      {{ $t("no data available") }}
                    </div>
                  </template>
                </v-autocomplete>
              </v-col>
            </v-row>
            <div v-for="(item, index) in my_course" :key="`${index}-my_course`">
              <v-card
                outlined
                class="mb-3 pa-2"
                @click="
                  $router.push({
                    name: 'StudentCourse',
                    params: { course_id: item.courseId },
                  })
                "
              >
                <v-card-text>
                  <v-row dense>
                    <!-- img -->
                    <v-col cols="12" sm="5">
                      <v-img
                        :src="
                          item.courseImg
                            ? showImg(item.courseImg)
                            : require(`@/assets/course/default_course_img.svg`)
                        "
                        class="rounded-lg"
                        :aspect-ratio="16 / 9"
                      >
                        <template v-slot:placeholder>
                          <v-row
                            class="fill-height ma-0"
                            align="center"
                            justify="center"
                          >
                            <v-progress-circular
                              indeterminate
                              color="#ff6b81"
                            ></v-progress-circular>
                          </v-row>
                        </template>
                      </v-img>
                    </v-col>
                    <!-- detail -->
                    <v-col cols="12" sm="3">
                      <v-row dense>
                        <v-col class="text-lg font-bold">
                          {{
                            $i18n.locale == "th"
                              ? item.courseNameTh
                              : item.courseNameEng
                          }}
                        </v-col>
                      </v-row>
                      <v-row dense>
                        <v-col class="text-slate-400">
                          <span class="mdi mdi-account"
                            >{{ $t("coach") }} :</span
                          >
                          {{
                            $i18n.locale == "th"
                              ? item.coachName
                              : item.coachNameEng
                          }}
                          <!-- {{ item.coachName == null ? "-" : item.coachName }} -->
                        </v-col>
                      </v-row>
                      <v-row dense>
                        <v-col class="text-slate-400">
                          <span class="mdi mdi-account"
                            >{{ $t("learner") }} :</span
                          >
                          {{
                            $i18n.locale == "th"
                              ? item.student?.firstNameTh
                              : item.student?.firstNameEng
                          }}
                          {{
                            $i18n.locale == "th"
                              ? item.student?.lastNameTh
                              : item.student?.lastNameEng
                          }}
                        </v-col>
                      </v-row>
                      <v-row dense>
                        <v-col class="text-slate-400">
                          <span class="mdi mdi-account"
                            >{{ $t("listed by") }} :</span
                          >
                          {{
                            $i18n.locale == "th"
                              ? item.createdBy?.firstNameTh
                              : item.createdBy?.firstNameEng
                          }}
                          {{
                            $i18n.locale == "th"
                              ? item.createdBy?.lastNameTh
                              : item.createdBy?.lastNameEng
                          }}
                        </v-col>
                      </v-row>
                      <v-row dense>
                        <v-col>
                          <v-chip color="#F9B320" dark>
                            {{
                              `${dayOfWeekArray(item.dates.day)} ${
                                item.period.start
                              } - ${item.period.end} ${$t("o'clock")}`
                            }}
                          </v-chip>
                        </v-col>
                      </v-row>
                    </v-col>

                    <!-- circle -->
                    <v-col
                      cols="12"
                      sm="4"
                      class="d-flex align-center justify-center"
                    >
                      <v-progress-circular
                        :rotate="-90"
                        :size="90"
                        :width="10"
                        :value="(item.dates.count / item.dates.totalDay) * 100"
                        color="#ff6b81"
                      >
                        {{ item.dates.count }} / {{ item.dates.totalDay }}
                        <br />{{ $t("time") }}
                      </v-progress-circular>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </div>
          </div>
          <!-- Role Student -->
          <div v-if="data_local.roles?.includes('R_5')">
            <v-card v-if="student_data.length == 0">
              <v-card-text
                class="text-center border-2 border-[#ff6b81] rounded-lg"
              >
                <span class="text-lg font-bold">
                  <v-icon color="#ff6b81">mdi-alert-outline</v-icon>
                  {{ $t("course information not found") }}
                </span>
              </v-card-text>
            </v-card>
            <div
              v-else
              v-for="(item, index) in student_data.filter((v) => !v.comp)"
              :key="`${index}-student_data`"
            >
              <v-card
                outlined
                @click="
                  $router.push({
                    name: 'StudentCourse',
                    params: { course_id: item.courseId },
                  })
                "
                class="mb-3 pa-2"
              >
                <v-row dense>
                  <!-- img -->
                  <v-col cols="12" sm="5" align="center">
                    <v-img
                      :src="
                        item.courseImg
                          ? showImg(item.courseImg)
                          : require(`@/assets/course/default_course_img.svg`)
                      "
                      class="rounded-lg"
                      :aspect-ratio="16 / 9"
                    >
                      <template v-slot:placeholder>
                        <v-row
                          class="fill-height ma-0"
                          align="center"
                          justify="center"
                        >
                          <v-progress-circular
                            indeterminate
                            color="#ff6b81"
                          ></v-progress-circular>
                        </v-row> </template
                    ></v-img>
                  </v-col>
                  <!-- detail -->
                  <v-col cols="12" sm="4">
                    <v-row dense>
                      <v-col class="text-lg font-bold">
                        {{
                          $i18n.locale == "th"
                            ? item.courseNameTh
                            : item.courseNameEng
                        }}
                        <!-- {{ item.courseNameTh == "" ? "-" : item.courseNameTh }}
                        ({{
                          item.courseNameEng == "" ? "-" : item.courseNameEng
                        }}) -->
                      </v-col>
                    </v-row>
                    <v-row dense>
                      <v-col class="text-slate-400">
                        <span class="mdi mdi-account">{{ $t("coach") }} :</span>
                        {{
                          $i18n.locale == "th"
                            ? item.coachName
                            : item.coachNameEng
                        }}

                        <!-- {{ item.coachName == null ? "-" : item.coachName }} -->
                      </v-col>
                    </v-row>
                    <v-row dense>
                      <v-col class="text-slate-400">
                        <span class="mdi mdi-account"
                          >{{ $t("learner") }} :</span
                        >
                        {{
                          $i18n.locale == "th"
                            ? item.student?.firstNameTh
                            : item.student?.firstNameEng
                        }}
                        {{
                          $i18n.locale == "th"
                            ? item.student?.lastNameTh
                            : item.student?.lastNameEng
                        }}
                      </v-col>
                    </v-row>
                    <v-row dense>
                      <v-col class="text-slate-400">
                        <span class="mdi mdi-account"
                          >{{ $t("listed by") }} :</span
                        >
                        {{
                          $i18n.locale == "th"
                            ? item.createdBy?.firstNameTh
                            : item.createdBy?.firstNameEng
                        }}
                        {{
                          $i18n.locale == "th"
                            ? item.createdBy?.lastNameTh
                            : item.createdBy?.lastNameEng
                        }}
                      </v-col>
                    </v-row>
                    <v-row dense>
                      <!-- <pre>{{ item }}</pre> -->
                      <v-col cols="12">
                        <v-chip color="#F9B320" dark>
                          {{
                            `${dayOfWeekArray(item.dates.day)} ${
                              item.period.start
                            } - ${item.period.end} ${$t("o'clock")}`
                          }}
                        </v-chip>
                      </v-col>
                    </v-row>
                  </v-col>
                  <!-- circle -->
                  <v-col
                    cols="12"
                    sm="3"
                    class="d-flex align-center justify-center"
                  >
                    <v-progress-circular
                      :rotate="-90"
                      :size="90"
                      :width="10"
                      :value="(item.dates.count / item.dates.totalDay) * 100"
                      color="#ff6b81"
                    >
                      {{ item.dates.count }} / {{ item.dates.totalDay }}
                      <br />{{ $t("time") }}
                    </v-progress-circular>
                  </v-col>
                </v-row>
              </v-card>
            </div>
          </div>
        </div>
      </v-expand-x-transition>

      <!-- PAGE 2 -->
      <v-expand-x-transition transition="scale-transition">
        <div v-if="$route.params.action == 'MySchedule'">
          <!-- Role parent -->
          <div v-if="data_local.roles?.includes('R_4')">
            <v-row class="mb-3">
              <v-col cols="12">
                <v-autocomplete
                  v-model="search_course"
                  :items="students"
                  :item-text="
                    $i18n.locale == 'th'
                      ? 'studentFirstnameTh'
                      : 'studentFirstnameEn'
                  "
                  item-value="studentId"
                  dense
                  filled
                  clearable
                  hide-details
                  :label="$t('select your students here')"
                  @change="searchStudentCourse(search_course)"
                >
                  <template v-slot:no-data>
                    <div class="mx-3 font-bold">
                      {{ $t("no data available") }}
                    </div>
                  </template>
                </v-autocomplete>
              </v-col>
            </v-row>
            <v-row class="mb-2">
              <v-col cols="12" align="center">
                <v-card flat width="340px">
                  <v-card-text
                    class="pa-2 border-2 border-[#ff6b81] rounded-lg"
                  >
                    <v-row dense class="d-flex justify-center">
                      <v-col
                        cols="auto"
                        v-for="(time, time_index) in time_frame_list"
                        :key="`${time_index}-time`"
                      >
                        <v-btn
                          @click="time_frame = time.value"
                          depressed
                          :dark="time_frame === time.value"
                          :color="
                            time_frame === time.value ? '#ff6b81' : '#F5F5F5'
                          "
                          >{{ time.label }}</v-btn
                        >
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
            <div>
              <template>
                <calendarStudent
                  :events="itemTime.dates"
                  :type="time_frame"
                ></calendarStudent>
              </template>
            </div>
          </div>
          <!-- Role Student -->
          <div v-if="data_local.roles?.includes('R_5')">
            <v-row class="mb-2">
              <v-col cols="12" align="center">
                <v-card flat width="340px">
                  <v-card-text
                    class="pa-2 border-2 border-[#ff6b81] rounded-lg"
                  >
                    <v-row dense class="d-flex justify-center">
                      <v-col
                        cols="auto"
                        v-for="(time, time_index) in time_frame_list"
                        :key="`${time_index}-time-r5`"
                      >
                        <v-btn
                          @click="time_frame = time.value"
                          depressed
                          :dark="time_frame === time.value"
                          :color="
                            time_frame === time.value ? '#ff6b81' : '#F5F5F5'
                          "
                          >{{ time.label }}</v-btn
                        >
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
            <calendarStudent
              :events="itemTime.dates"
              :type="time_frame"
            ></calendarStudent>
          </div>
        </div>
      </v-expand-x-transition>
      <!-- PAGE 3 -->
      <v-expand-x-transition transition="scale-transition">
        <div v-if="$route.params.action == 'MyBooking'">
          <!-- Role Parent -->
          <div v-if="data_local.roles?.includes('R_4')">
            <!-- search -->
            <v-row class="mb-3">
              <v-col cols="12">
                <v-autocomplete
                  v-model="search_booked"
                  :items="students"
                  :item-text="
                    $i18n.locale == 'th'
                      ? 'studentFirstnameTh'
                      : 'studentFirstnameEn'
                  "
                  item-value="studentId"
                  dense
                  filled
                  hide-details
                  :label="$t('select your students here')"
                  @change="searchStudentBooked(search_booked)"
                >
                  <template v-slot:no-data>
                    <div class="mx-3 font-bold">
                      {{ $t("no data available") }}
                    </div>
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
                        >
                          {{
                            $i18n.locale == "th"
                              ? `${item.studentFirstnameTh} ${item.studentLastnameTh}`
                              : `${item.studentFirstnameEn} ${item.studentLastnameEn}`
                          }}</span
                        ></v-list-item-title
                      >
                    </v-list-item-content>
                  </template>
                </v-autocomplete>
              </v-col>
            </v-row>
            <!-- length == 0 -->
            <v-card-text
              class="pa-5 text-center border-2 border-[#ff6b81] rounded-lg"
              v-if="ReserveList().length == 0"
            >
              <span class="text-lg font-bold">
                <v-icon color="#ff6b81">mdi-alert-outline</v-icon>
                {{ $t("booking information not found") }}
              </span>
            </v-card-text>
            <!-- details -->
            <div v-else>
              <v-row dense>
                <v-card
                  v-for="(item_booked, index_booked) in ReserveList()"
                  :key="`${index_booked}-reserve`"
                  @click="showCard(index, item_booked)"
                  class="mb-3 cursor-pointer w-full"
                >
                  <v-card-text>
                    <v-row dense>
                      <!-- img -->
                      <v-col cols="12" sm="3">
                        <v-img
                          :aspect-ratio="16 / 9"
                          :src="
                            item_booked.courseImg
                              ? item_booked.courseImg
                              : require(`@/assets/student_course/download.png`)
                          "
                          style="max-width: 300px"
                        >
                          <template v-slot:placeholder>
                            <v-row
                              class="fill-height ma-0"
                              align="center"
                              justify="center"
                            >
                              <v-progress-circular
                                indeterminate
                                color="#ff6b81"
                              ></v-progress-circular>
                            </v-row>
                          </template>
                        </v-img>
                      </v-col>
                      <!-- detail -->
                      <v-col cols="12" sm="5">
                        <v-col class="text-lg font-bold">
                          {{
                            $i18n.locale == "th"
                              ? item_booked.courseNameTh
                              : item_booked.courseNameEn
                          }}
                        </v-col>
                        <v-col class="text-slate-400">
                          <span class="mdi mdi-account"
                            >{{ $t("coach") }} :</span
                          >
                          {{
                            $i18n.locale == "th"
                              ? item_booked.coachData?.data.data?.firstNameTh
                              : item_booked.coachData?.data.data?.firstNameEng
                          }}

                          {{
                            $i18n.locale == "th"
                              ? item_booked.coachData?.data.data?.lastNameTh
                              : item_booked.coachData?.data.data?.lastNameEng
                          }}
                        </v-col>
                        <v-col class="text-slate-400">
                          <span class="mdi mdi-account"
                            >{{ $t("learner") }} :</span
                          >
                          {{
                            $i18n.locale == "th"
                              ? item_booked.StudentData?.data.data?.firstNameTh
                              : item_booked.StudentData?.data.data?.firstNameEng
                          }}
                          {{
                            $i18n.locale == "th"
                              ? item_booked.StudentData?.data.data?.lastNameTh
                              : item_booked.StudentData?.data.data?.lastNameEng
                          }}
                        </v-col>

                        <v-col class="text-slate-400">
                          <span class="mdi mdi-account"
                            >{{ $t("listed by") }} :</span
                          >
                          {{
                            $i18n.locale == "th"
                              ? item_booked.createdByData?.data.data
                                  ?.firstNameTh
                              : item_booked.createdByData?.data.data
                                  ?.firstNameEng
                          }}
                          {{
                            $i18n.locale == "th"
                              ? item_booked.createdByData?.data.data?.lastNameTh
                              : item_booked.createdByData?.data.data
                                  ?.lastNameEng
                          }}
                        </v-col>

                        <v-col>
                          <v-chip color="#F9B320" dark>
                            {{ item_booked.day_name }}
                            {{ item_booked.start }} - {{ item_booked.end }}
                            {{ $t("o'clock") }}
                          </v-chip>
                        </v-col>

                        <v-row dense>
                          <v-col cols="auto">
                            <v-card outlined>
                              <v-card-text class="py-0"> </v-card-text>
                            </v-card>
                          </v-col>
                        </v-row>
                      </v-col>
                      <!-- circle -->
                      <v-col
                        cols="12"
                        sm="4"
                        class="d-flex align-center"
                        align="center"
                      >
                        <v-row>
                          <v-col>
                            <v-chip
                              :color="
                                item_booked.status === 'contacted'
                                  ? '#d9ead3'
                                  : item_booked.status === 'waiting'
                                  ? '#FDFBE5'
                                  : '#FAD0CF'
                              "
                              :text-color="
                                item_booked.status === 'contacted'
                                  ? 'green'
                                  : item_booked.status === 'waiting'
                                  ? 'yellow'
                                  : 'red'
                              "
                            >
                              <span>{{
                                item_booked.status === "waiting"
                                  ? $t("waiting for contact")
                                  : item_booked.status === "contacted"
                                  ? $t("contacted")
                                  : $t("cancel reservation")
                              }}</span>
                            </v-chip>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                    <!-- data details -->
                    <div
                      v-if="activeCard === index && !course_is_loading"
                      class="mt-3"
                    >
                      <v-card>
                        <v-row dense class="pa-3">
                          <v-col
                            cols="12"
                            md="12"
                            sm="12"
                            class="text-lg font-bold"
                          >
                            {{
                              $i18n.locale == "th"
                                ? course_data.course_name_th
                                : course_data.course_name_en
                            }}
                          </v-col>
                          <v-col cols="12" md="12" sm="12">
                            <span
                              class="mdi mdi-calendar-today"
                              style="color: #ff6b81"
                            ></span>
                            {{ item_booked.day_name }}
                          </v-col>

                          <v-col cols="12" md="12" sm="12">
                            <span
                              class="mdi mdi-clock-outline"
                              style="color: #ff6b81"
                            ></span>
                            {{ course_data.course_hours }}
                            {{ $t("hrs./time") }}
                          </v-col>

                          <v-col cols="12" md="12" sm="12" class="text-lg">
                            <div v-html="course_data.detail"></div>
                          </v-col>
                          <v-col cols="12" md="12" sm="12">
                            <div class="mt-8">
                              <label-custom text="Performance"></label-custom>
                            </div>
                            <v-divider class=""></v-divider>
                            <span class="pa-2">
                              <div v-html="course_data.music_performance"></div>
                            </span>
                          </v-col>
                          <v-col cols="12" md="12" sm="12">
                            <div class="mt-8">
                              <label-custom text="Certification"></label-custom>
                            </div>
                            <v-divider class=""></v-divider>
                            <span class="pa-2">
                              <div v-html="course_data.catification"></div>
                            </span>
                          </v-col>
                        </v-row>
                      </v-card>
                    </div>
                  </v-card-text>
                </v-card>
              </v-row>
              <v-row v-if="isDataReceived">
                <v-col cols="12" align="center">
                  <v-progress-circular
                    indeterminate
                    color="#ff6b81"
                    size="50"
                  ></v-progress-circular>
                </v-col>
              </v-row>
            </div>
          </div>
          <!-- Role student -->
          <div v-if="!data_local.roles?.includes('R_4')">
            <v-card-text
              class="pa-5 text-center border-2 border-[#ff6b81] rounded-lg"
              v-if="ReserveList().length == 0"
            >
              <span class="text-lg font-bold">
                <v-icon color="#ff6b81">mdi-alert-outline</v-icon>
                {{ $t("booking information not found") }}
              </span>
            </v-card-text>
            <div v-if="profile_booked.length >= 1">
              <v-row dense>
                <v-card
                  v-for="(item_booked, index_booked) in ReserveList()"
                  :key="`${index_booked}-reserve`"
                  @click="showCard(index_booked, item_booked)"
                  class="my-3 cursor-pointer w-full"
                >
                  <v-card-text>
                    <v-row dense>
                      <!-- img -->
                      <v-col cols="12" sm="3">
                        <v-img
                          :aspect-ratio="16 / 9"
                          :src="
                            item_booked.courseImg
                              ? item_booked.courseImg
                              : require(`@/assets/student_course/download.png`)
                          "
                          style="max-width: 300px"
                        >
                          <template v-slot:placeholder>
                            <v-row
                              class="fill-height ma-0"
                              align="center"
                              justify="center"
                            >
                              <v-progress-circular
                                indeterminate
                                color="#ff6b81"
                              ></v-progress-circular>
                            </v-row>
                          </template>
                        </v-img>
                      </v-col>
                      <!-- detail -->
                      <v-col cols="12" sm="5">
                        <v-col class="text-lg font-bold">
                          {{
                            $i18n.locale == "th"
                              ? item_booked.courseNameTh
                              : item_booked.courseNameEn
                          }}
                        </v-col>
                        <v-col class="text-slate-400">
                          <span class="mdi mdi-account"
                            >{{ $t("coach") }} :</span
                          >
                          {{
                            $i18n.locale == "th"
                              ? item_booked.coachData?.data.data?.firstNameTh
                              : item_booked.coachData?.data.data?.firstNameEng
                          }}

                          {{
                            $i18n.locale == "th"
                              ? item_booked.coachData?.data.data?.lastNameTh
                              : item_booked.coachData?.data.data?.lastNameEng
                          }}
                        </v-col>
                        <v-col class="text-slate-400">
                          <span class="mdi mdi-account"
                            >{{ $t("learner") }} :</span
                          >
                          {{
                            $i18n.locale == "th"
                              ? item_booked.StudentData?.data.data?.firstNameTh
                              : item_booked.StudentData?.data.data?.firstNameEng
                          }}
                          {{
                            $i18n.locale == "th"
                              ? item_booked.StudentData?.data.data?.lastNameTh
                              : item_booked.StudentData?.data.data?.lastNameEng
                          }}
                        </v-col>

                        <v-col class="text-slate-400">
                          <span class="mdi mdi-account"
                            >{{ $t("listed by") }} :</span
                          >

                          {{
                            $i18n.locale == "th"
                              ? item_booked.createdByData?.data.data
                                  ?.firstNameTh
                              : item_booked.createdByData?.data.data
                                  ?.firstNameEng
                          }}
                          {{
                            $i18n.locale == "th"
                              ? item_booked.createdByData?.data.data?.lastNameTh
                              : item_booked.createdByData?.data.data
                                  ?.lastNameEng
                          }}
                        </v-col>

                        <v-col>
                          <v-chip color="#F9B320" dark>
                            {{ item_booked.day_name }}
                            {{ item_booked.start }} - {{ item_booked.end }}
                            {{ $t("o'clock") }}
                          </v-chip>
                        </v-col>
                      </v-col>
                      <!-- ship -->
                      <v-col
                        cols="12"
                        sm="4"
                        class="d-flex align-center"
                        align="center"
                      >
                        <v-row>
                          <v-col>
                            <v-chip
                              :color="
                                item_booked.status === 'contacted'
                                  ? '#d9ead3'
                                  : item_booked.status === 'waiting'
                                  ? '#FDFBE5'
                                  : '#FAD0CF'
                              "
                              :text-color="
                                item_booked.status === 'contacted'
                                  ? 'green'
                                  : item_booked.status === 'waiting'
                                  ? 'yellow'
                                  : 'red'
                              "
                            >
                              <span>{{
                                item_booked.status === "waiting"
                                  ? $t("waiting for contact")
                                  : item_booked.status === "contacted"
                                  ? $t("contacted")
                                  : $t("cancel reservation")
                              }}</span>
                            </v-chip>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                    <!-- card Detail -->
                    <div
                      v-if="activeCard === index_booked && !course_is_loading"
                      class="mt-3"
                    >
                      <v-card outlined>
                        <v-row dense class="pa-3">
                          <v-col
                            cols="12"
                            md="12"
                            sm="12"
                            class="text-lg font-bold"
                          >
                            {{
                              $i18n.locale == "th"
                                ? course_data.course_name_th
                                : course_data.course_name_en
                            }}
                            <!-- {{
                            `${course_data.course_name_th} (${course_data.course_name_en})`
                          }} -->
                          </v-col>
                          <v-col cols="12" md="12" sm="12">
                            <span
                              class="mdi mdi-calendar-today"
                              style="color: #ff6b81"
                            ></span>
                            {{ item_booked.day_name }}
                          </v-col>

                          <v-col cols="12" md="12" sm="12">
                            <span
                              class="mdi mdi-clock-outline"
                              style="color: #ff6b81"
                            ></span>
                            {{ course_data.course_hours.toFixed(2) }}
                            {{ $t("hrs./time") }}
                          </v-col>

                          <v-col cols="12" md="12" sm="12" class="text-lg">
                            <div v-html="course_data.detail"></div>
                          </v-col>
                          <v-col cols="12" md="12" sm="12">
                            <div class="mt-8">
                              <label-custom text="Performance"></label-custom>
                            </div>
                            <v-divider class=""></v-divider>
                            <span class="pa-2">
                              <div v-html="course_data.music_performance"></div>
                            </span>
                          </v-col>

                          <v-col cols="12" md="12" sm="12">
                            <div class="mt-8">
                              <label-custom text="Certification"></label-custom>
                            </div>
                            <v-divider class=""></v-divider>
                            <span class="pa-2">
                              <div v-html="course_data.catification"></div>
                            </span>
                          </v-col>
                        </v-row>
                      </v-card>
                    </div>
                  </v-card-text>
                </v-card>
              </v-row>
              <v-row v-if="isDataReceived">
                <v-col cols="12" align="center">
                  <v-progress-circular
                    indeterminate
                    color="#ff6b81"
                    size="50"
                  ></v-progress-circular>
                </v-col>
              </v-row>
            </div>
          </div>
        </div>
      </v-expand-x-transition>
    </div>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import calendarStudent from "@/components/calendar/calendarStudent.vue";
import labelCustom from "@/components/label/labelCustom.vue";
import loadingOverlay from "@/components/loading/loadingOverlay.vue";

export default {
  components: {
    calendarStudent,
    labelCustom,
    loadingOverlay,
  },
  data: () => ({
    activePage: 1,
    booked: "จองแล้ว",
    value: "",
    data_local: JSON.parse(localStorage.getItem("userDetail")),
    defaultImageUrl:
      "https://cdn.vectorstock.com/i/preview-1x/82/99/no-image-available-like-missing-picture-vector-43938299.jpg",
    loading: true,
    show_detail: false,
    activeCard: null,
    course_type: [
      { name: "คอร์สของฉัน", value: "MyCourse" },
      { name: "ตารางเรียน", value: "MySchedule" },
      { name: "คอร์สที่จอง", value: "MyBooking" },
    ],
    tasks: [],
    data_search_course: [],
    search_course: "",
    search_course_detail: "",
    search_schadule: "",
    search_booked: "",
    type_selected: "studentsSchedule",
    time_frame: "month",
    a_test: "",
    b_test: "",
    item: {},
    item_data: "",
    user_detail: {},
    clearable: false,
    userRelationsAccountId: "",
    scrollTop: 0,
    countDatePerPage: 0,
    isDataReceived: false,
    waitingProcess: false,
    sameHistoryLength: false,
    loading_overlay: true,
    relations_account: "",
  }),
  beforeCreate() {
    localStorage.removeItem("userRelationsAccountId");
  },
  created() {
    if (this.$route.query.token) {
      this.loginShareToken(this.$route);
    }
  },
  beforeDestroy() {
    localStorage.removeItem("userRelationsAccountId");
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  async beforeMount() {
    this.user_detail = JSON.parse(localStorage.getItem("userDetail"));
    this.GetProfileDetail(this.user_detail.account_id);
  },
  async mounted() {
    this.$store.dispatch("MyCourseModules/GetMyCourseArrayEmpty");
    window.addEventListener("scroll", this.handleScroll);
    await this.GetProfileBooked({
      account_id: this.user_detail?.account_id,
      limit: 2,
      page: 1,
    });
    if (
      this.user_detail.roles?.includes("R_5") ||
      this.profile_detail?.userRoles?.roleId?.includes("R_5")
    ) {
      await this.GetStudentData(this.user_detail.account_id);

      this.loading_overlay = false;
    } else if (this.user_detail.roles?.includes("R_4")) {
      await this.GetStudentData(this.user_detail.account_id);
      this.loading_overlay = false;
    } else {
      this.$router.push({
        name: "StudentsSchedule",
        params: { action: "MyBooking" },
      });
      this.loading_overlay = false;
    }
  },
  beforeUpdate() {
    this.$store.dispatch(
      "NavberUserModules/changeTitleNavber",
      "class schedule information"
    );
  },

  computed: {
    ...mapGetters({
      student_data: "MyCourseModules/getStudentData",
      itemTime: "MyCourseModules/getcourseSchedule",
      profile_booked: "MyCourseModules/getProfileBooked",
      student_reserve: "MyCourseModules/getStudentReserve",
      course_data: "CourseModules/getCourseData",
      course_is_loading: "CourseModules/getCourseIsLoading",
      profile_user: "ProfileModules/getProfileUser",
      students: "ProfileModules/getStudents",
      student_is_loading: "MyCourseModules/getStudentsLoading",
      student_booking_is_loading: "MyCourseModules/getStudentsBookingLoading",
      my_course: "MyCourseModules/getMyCourse",
      reserve_option: "MyCourseModules/getReserveOption",
      profile_detail: "ProfileModules/getProfileDetail",
    }),
    setFunctions() {
      if (this.user_detail.roles.includes("R_5")) {
        this.GetAll(this.user_detail.account_id);
      } else if (this.user_detail.roles.includes("R_4")) {
        this.GetAll(this.user_detail.account_id);
      } else if (this.profile_detail?.userRoles?.roleId?.includes("R_5")) {
        this.GetAll(this.user_detail.account_id);
      }

      return "";
    },
    MobileSize() {
      const { xs } = this.$vuetify.breakpoint;
      return !!xs;
    },
    IpadSize() {
      const { sm } = this.$vuetify.breakpoint;
      return !!sm;
    },

    cal() {
      return this.ready ? this.$refs.calendar : null;
    },

    time_frame_list() {
      return [
        { label: this.$t("daily"), value: "day" },
        { label: this.$t("weekly"), value: "week" },
        { label: this.$t("monthly"), value: "month" },
      ];
    },
  },
  methods: {
    ...mapActions({
      GetStudentData: "MyCourseModules/GetStudentData",
      GetProfileBooked: "MyCourseModules/GetProfileBooked",
      GetAll: "ProfileModules/GetAll",
      GetStudentReserve: "MyCourseModules/GetStudentReserve",
      loginShareToken: "loginModules/loginShareToken",
      GetCourse: "CourseModules/GetCourse",
      GetProfileDetail: "ProfileModules/GetProfileDetail",
    }),

    dayOfWeekArray(day) {
      let days = day;
      const weekdays = [
        this.$t("sunday"),
        this.$t("monday"),
        this.$t("tuesday"),
        this.$t("wednesday"),
        this.$t("thursday"),
        this.$t("friday"),
        this.$t("saturday"),
      ];
      let ranges = [];
      if (days[0]) {
        let rangeStart = parseInt(days[0]);
        let prevDay = rangeStart;
        for (let i = 1; i < days.length; i++) {
          const day = parseInt(days[i]);
          if (day === prevDay + 1) {
            prevDay = day;
          } else {
            const rangeEnd = prevDay;
            ranges.push({ start: rangeStart, end: rangeEnd });
            rangeStart = day;
            prevDay = day;
          }
        }
        ranges.push({ start: rangeStart, end: prevDay });
        return ranges
          .map(({ start, end }) =>
            start === end
              ? weekdays[start]
              : `${weekdays[start]} - ${weekdays[end]}`
          )
          .join(", ");
      }
    },

    async searchStudentCourse(studentId) {
      if (studentId !== null) {
        this.$store.dispatch("MyCourseModules/GetMyCourseArrayEmpty");
        await this.GetStudentData(studentId);
      } else {
        this.GetStudentData(this.user_detail.account_id);
      }
    },

    async searchStudentSchadule(studentId) {
      this.$store.dispatch("MyCourseModules/GetMyCourseArrayEmpty");

      await this.GetStudentData(studentId);
    },

    async searchStudentBooked(studentId) {
      this.relations_account = studentId;
      this.loading_overlay = true;
      await this.GetProfileBooked({
        account_id: studentId,
        limit: this.reserve_option.limit,
        page: 1,
      });
      this.loading_overlay = false;
    },

    handleScroll() {
      this.scrollTop = window.scrollY; // ตัวเลขเมื่อ scroll ตัวเลขเริ่มนับจากบนสุด = 0
      let device = document.body.offsetHeight - 56; // ค่าของหน้าจอ device
      let ref = this.$refs.profile_booked?.clientHeight; // ค่ามาจาก ref
      let countA = this.scrollTop + device;

      if (countA >= ref && !this.sameHistoryLength) {
        this.loadMoreData();
      }

      if (countA < ref) {
        this.sameHistoryLength = false;
      }
    },
    async loadMoreData() {
      this.countDatePerPage = this.profile_booked?.length;

      if (!this.isDataReceived) {
        this.isDataReceived = true;

        if (!this.waitingProcess) {
          this.waitingProcess = true;

          if (this.user_detail.roles?.includes("R_4")) {
            if (!this.search_booked) {
              await this.GetProfileBooked({
                account_id: this.user_detail?.account_id,
                limit: this.reserve_option.limit,
                page: this.reserve_option.page + 1,
              });
            } else {
              await this.GetProfileBooked({
                account_id: this.relations_account,
                limit: this.reserve_option.limit,
                page: this.reserve_option.page + 1,
              });
            }
            this.isDataReceived = false;
            this.waitingProcess = false;
          } else {
            await this.GetProfileBooked({
              account_id: this.user_detail?.account_id,
              limit: this.reserve_option.limit,
              page: this.reserve_option.page + 1,
            });
            this.isDataReceived = false;
            this.waitingProcess = false;
          }
          if (this.profile_booked?.length === this.countDatePerPage) {
            this.sameHistoryLength = true;
          } else {
            this.sameHistoryLength = false;
          }
        }
      }
    },

    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },

    showCard(index, course) {
      this.GetCourse(course.courseId);
      if (this.activeCard !== index) {
        this.activeCard = index;
      } else {
        this.activeCard = null;
      }
    },

    ReserveList() {
      let reserveList = [];
      if (this.profile_booked) {
        this.profile_booked.forEach((reserve) => {
          if (
            reserveList.filter(
              (v) =>
                v.coachId == reserve.coachId &&
                v.courseId == reserve.courseId &&
                v.dayOfWeekId === reserve.dayOfWeekId &&
                v.timeId === reserve.timeId &&
                v.studentId === reserve.studentId
            ).length === 0
          ) {
            reserveList.push(reserve);
          }
        });
      }
      return reserveList;
    },
    dayOfWeekName(days) {
      const daysOfWeek = [
        this.$t("sunday"),
        this.$t("monday"),
        this.$t("tuesday"),
        this.$t("wednesday"),
        this.$t("thursday"),
        this.$t("friday"),
        this.$t("saturday"),
      ];
      const dayNames = [];
      for (let i = 0; i < days.length; i++) {
        const dayIndex = days[i];
        dayNames.push(daysOfWeek[dayIndex]);
      }
      return dayNames.join(" - ");
    },

    showImg(item) {
      return `${process.env.VUE_APP_URL}/api/v1/files/${item}`;
    },

    showData() {
      this.show_detail = true;
    },
  },
};
</script>

<style scoped>
.v-progress-circular {
  margin: 1rem;
}
</style>

<template>
  <v-container>
    <header-page :title="$t('select teaching information')"></header-page>
    <v-row dense class="mb-3">
      <v-col
        cols="12"
        sm="3"
        v-for="(tab_data, tab_index) in tabs"
        :key="tab_index"
      >
        <v-btn
          class="w-full pa-2"
          @click="tab = tab_data.value"
          depressed
          :dark="tab === tab_data.value"
          :color="tab === tab_data.value ? '#ff6b81' : '#F5F5F5'"
        >
          {{ $t(tab_data.label) }}
        </v-btn>
      </v-col>
    </v-row>
    <!-- TAB 1 -->
    <div v-if="tab === 'teaching list'">
      <loading-overlay :loading="my_courses_is_loading"> </loading-overlay>

      <v-row class="mb-2">
        <v-col cols="12" align="center">
          <v-card flat width="340px">
            <v-card-text class="pa-2 border-2 border-[#ff6b81] rounded-lg">
              <v-row dense class="d-flex justify-center">
                <v-col
                  cols="12"
                  sm
                  v-for="(time, time_index) in time_frame_list"
                  :key="`${time_index}-time`"
                >
                  <v-btn
                    class="w-full"
                    @click="time_frame = time.value"
                    depressed
                    :dark="time_frame === time.value"
                    :color="time_frame === time.value ? '#ff6b81' : '#F5F5F5'"
                    >{{ $t(time.label) }}</v-btn
                  >
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <!-- รายวัน -->
      <template v-if="time_frame === 'day'">
        <!-- COURSE LIST -->
        <v-card
          outlined
          class="mb-2"
          v-for="(course, course_index) in my_courses.filter(
            (v) => v.start_date === genToday && v?.type !== 'holiday'
          )"
          :key="course_index"
        >
          <v-card-text
            class="cursor-pointer"
            @click="
              $router.push({
                name: 'menageCourseDetail',
                params: {
                  courseId: course.course_id,
                  timeId: course.time_id,
                  dayOfWeekId: course.day_of_week_id,
                  date: course.start_date,
                  typeEvent: 'null',
                },
              })
            "
          >
            <v-row dense>
              <v-col cols="12" sm="4">
                <v-img
                  :aspect-ratio="16 / 9"
                  :cover="$vuetify.breakpoint.smAndUp"
                  :class="
                    $vuetify.breakpoint.smAndUp ? 'rounded-lg' : 'rounded-lg'
                  "
                  :src="
                    course.course_img || course.course_img !== ''
                      ? course.course_img
                      : require(`@/assets/course/default_course_img.svg`)
                  "
                  :max-width="$vuetify.breakpoint.smAndUp ? 500 : ''"
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
              <v-col cols="12" sm="8">
                <v-row dense>
                  <v-col class="text-lg font-bold">{{
                    `${$i18n.locale == "th" ? course.name : course.subtitle}`
                  }}</v-col>
                  <v-col cols="auto">
                    <v-chip small color="#F9B320" dark
                      >{{ `${course.start_time}-${course.end_time}` }}น.</v-chip
                    >
                  </v-col>
                </v-row>
                <v-row dense>
                  <v-col cols="auto"
                    ><v-icon color="#ff6b81">mdi-bookshelf</v-icon></v-col
                  >
                  <v-col>{{
                    `${$t("warraphat learning sphere")} : ${
                      $i18n.locale == "th"
                        ? course.category_name
                        : course.category_name_en
                    }`
                  }}</v-col>
                </v-row>
                <v-row dense>
                  <v-col cols="12" v-if="course.course_package_name">
                    <rowData mini icon="mdi-account-box-multiple">{{
                      `${$t("package")} :  ${course.course_package_name}`
                    }}</rowData>
                  </v-col>
                </v-row>
                <v-row dense>
                  <v-col cols="auto"
                    ><v-icon color="#ff6b81">mdi-clock-outline</v-icon></v-col
                  >
                  <v-col>{{
                    `${$t("teaching time")} : ${course.course_per_time} ${$t(
                      "hour"
                    )}`
                  }}</v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        <v-card
          flat
          v-if="
            my_courses.filter(
              (v) => v.start_date === genToday && v?.type !== 'holiday'
            ).length == 0
          "
        >
          <v-card-text
            class="pa-2 py-4 text-center border-2 border-[#ff6b81] rounded-lg"
          >
            <span class="text-lg font-bold">
              <v-icon color="#ff6b81">mdi-alert-outline</v-icon>
              {{ $t("teaching information not found") }}
            </span>
          </v-card-text>
        </v-card>
      </template>
      <!-- รายสัปดาห์ -->
      <template v-else>
        <!-- COURSE LIST -->
        <v-row class="justify-center">
          <v-col cols="12" class="align-center text-center">
            <v-progress-circular
              color="#ff6b81"
              v-if="my_courses_is_loading"
              indeterminate
              size="64"
            ></v-progress-circular>

            <calendarCoach
              v-if="!my_courses_is_loading"
              class="w-full"
              :events="my_courses"
              :type="time_frame"
            ></calendarCoach>
          </v-col>
        </v-row>
      </template>
    </div>
    <!-- TAB 2 -->
    <div v-if="tab === 'my teaching'">
      <v-row>
        <v-col cols="auto"> {{ $t("my teaching information") }} : </v-col>
        <v-col class="font-bold">
          {{
            $i18n.locale == "th"
              ? profile_detail.firstNameTh
              : profile_detail.firstNameEng
          }}
        </v-col>
      </v-row>
      <v-row dense>
        <v-col>
          <span class="font-bold">{{ $t("choose a course") }}</span>
          <v-autocomplete
            v-model="filter_course"
            :item-text="$i18n.locale == 'th' ? 'name' : 'subtitle'"
            item-value="course_id"
            :items="my_courses.filter((v) => !v.type)"
            outlined
            dense
          >
            <template v-slot:no-data>
              <v-row dense>
                <v-col align="center">{{ $t("no data found") }}</v-col>
              </v-row>
            </template>
          </v-autocomplete>
        </v-col>
      </v-row>
      <div v-if="filterMycourse().length == 0">
        <v-card flat>
          <v-card-text
            class="pa-2 py-4 text-center border-2 border-[#ff6b81] rounded-lg"
          >
            <span class="text-lg font-bold">
              <v-icon color="#ff6b81">mdi-alert-outline</v-icon>
              {{ $t("teaching information not found") }}
            </span>
          </v-card-text>
        </v-card>
      </div>
      <v-card
        dense
        class="mb-3"
        elevation="0"
        flat
        v-for="(course, course_index) in filterMycourse()"
        :key="`${course_index}-course`"
      >
        <v-card-text class="bg-[#FBF3F5]">
          <v-row dense>
            <v-col cols="12" sm="4">
              <v-img
                class="rounded-lg"
                style="max-width: 500px"
                :src="
                  course.course_img || course.course_img !== ''
                    ? course.course_img
                    : require(`@/assets/course/default_course_img.svg`)
                "
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
            <v-col>
              <v-row dense>
                <v-col class="font-bold text-md">{{
                  GenDateStr(new Date(course.start_date_str))
                }}</v-col>
              </v-row>
              <v-row dense>
                <v-col cols="12">
                  <rowData mini icon="mdi-account"
                    >{{ $t("warraphat learning sphere") }} :
                    {{
                      $i18n.locale == "th"
                        ? course.category_name
                        : course.category_name_en
                    }}</rowData
                  >
                </v-col>

                <v-col cols="12" v-if="course.course_package_name">
                  <rowData mini icon="mdi-account-box-multiple"
                    >{{ $t("package") }} :
                    {{ course.course_package_name }}</rowData
                  >
                </v-col>
                <v-col cols="12">
                  <rowData mini icon="mdi-bookshelf"
                    >{{ $t("course") }} :{{
                      `${$i18n.locale == "th" ? course.name : course.subtitle}`
                    }}</rowData
                  >
                </v-col>
                <v-col cols="12">
                  <rowData mini icon="mdi-clock-time-four-outline"
                    >{{ $t("teaching time") }} {{ course.course_per_time }}
                    {{ $t("hour") }}</rowData
                  >
                </v-col>
                <v-col cols="12">
                  <v-chip small color="#F9B320" dark
                    >{{ `${course.start_time} - ${course.end_time}` }}
                    {{ $t("o'clock") }}</v-chip
                  >
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col
              align="center"
              @click="
                !course.show_assessment
                  ? OpenAssessment(course)
                  : (course.show_assessment = false)
              "
              class="cursor-pointer"
              >{{ $t("assess students") }}
              <v-icon color="#ff6b81">{{
                course.show_assessment ? "mdi-chevron-up" : "mdi-chevron-down"
              }}</v-icon></v-col
            >
            <v-col
              align="center"
              @click="
                !course.show_assessment_pantential
                  ? OpenAssessmentPotential(course)
                  : (course.show_assessment_pantential = false)
              "
              class="cursor-pointer"
              >{{ $t("assess potential") }}
              <v-icon color="#ff6b81">{{
                course.show_assessment_pantential
                  ? "mdi-chevron-up"
                  : "mdi-chevron-down"
              }}</v-icon></v-col
            >
            <v-col
              align="center"
              @click="
                !course.show_summary
                  ? OpenSummary(course)
                  : (course.show_summary = false)
              "
              class="cursor-pointer"
              >{{ $t("teaching summary notes") }}
              <v-icon color="#ff6b81">{{
                course.show_summary ? "mdi-chevron-up" : "mdi-chevron-down"
              }}</v-icon></v-col
            >
          </v-row>
        </v-card-text>
        <v-expand-transition>
          <template v-if="course.show_assessment">
            <v-card-text>
              <v-card
                flat
                v-if="
                  student_check_in.filter(
                    (v) =>
                      v.type === 'general' &&
                      (v.status == 'punctual' || v.status == 'late')
                  ).length === 0
                "
              >
                <v-card-text
                  class="pa-2 py-4 text-center border-2 border-[#ff6b81] rounded-lg"
                >
                  <span class="text-lg font-bold">
                    <v-icon color="#ff6b81">mdi-alert-outline</v-icon>
                    {{ $t("student assessment data not found") }}
                  </span>
                </v-card-text>
              </v-card>
              <v-card
                outlined
                class="mb-3"
                v-for="(student, index) in student_check_in.filter(
                  (v) =>
                    v.type === 'general' &&
                    (v.status == 'punctual' || v.status == 'late')
                )"
                :key="`${index}-checkin`"
              >
                <v-card-text>
                  <v-row dense>
                    <v-col cols="12" sm class="text-lg font-bold">
                      {{ index + 1 }} .
                      {{
                        $i18n.locale == "th"
                          ? student.fullname
                          : student.fullname_en
                      }}</v-col
                    >
                    <v-col cols="12" sm="auto">
                      <v-row dense class="d-flex aling-center">
                        <v-col align="right"> {{ $t("attendance") }}: </v-col>
                        <v-col cols="auto">
                          <v-chip
                            class="font-bold"
                            :color="
                              check_in_status_options.filter(
                                (v) => v.value === student.status
                              )[0].bg_color
                            "
                            :style="`color:${
                              check_in_status_options.filter(
                                (v) => v.value === student.status
                              )[0].color
                            }`"
                            v-if="
                              check_in_status_options.filter(
                                (v) => v.value === student.status
                              ).length > 0
                            "
                            >{{
                              $t(
                                check_in_status_options.filter(
                                  (v) => v.value === student.status
                                )[0].label
                              )
                            }}
                          </v-chip>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                  <v-row dense>
                    <v-col cols="12" sm align="left" class="font-semibold">
                      {{ $t("developmental level") }}
                      <v-rating
                        background-color="pink lighten-3"
                        color="pink"
                        large
                        :value="
                          evolution_options.filter(
                            (v) => v.value === student.assessment.evolution
                          ).length > 0
                            ? evolution_options.filter(
                                (v) => v.value === student.assessment.evolution
                              )[0].num_value
                            : 0
                        "
                        :length="
                          evolution_options.filter(
                            (v) => v.value === student.assessment.evolution
                          ).length > 0
                            ? evolution_options.filter(
                                (v) => v.value === student.assessment.evolution
                              )[0].num_value
                            : 0
                        "
                        small
                        readonly
                      ></v-rating>
                    </v-col>
                    <v-col cols="12" sm align="left" class="font-semibold"
                      >{{ $t("interest level") }}
                      <v-rating
                        background-color="pink lighten-3"
                        color="pink"
                        large
                        :value="
                          interest_options.filter(
                            (v) => v.value === student.assessment.interest
                          ).length > 0
                            ? interest_options.filter(
                                (v) => v.value === student.assessment.interest
                              )[0].num_value
                            : 0
                        "
                        :length="
                          interest_options.filter(
                            (v) => v.value === student.assessment.interest
                          ).length > 0
                            ? interest_options.filter(
                                (v) => v.value === student.assessment.interest
                              )[0].num_value
                            : 0
                        "
                        small
                        readonly
                      ></v-rating>
                    </v-col>
                    <v-col cols="12" sm align="center">
                      <v-btn
                        class="w-full"
                        outlined
                        @click="showComment(student)"
                        color="#ff6b81"
                        ><v-icon>mdi-message-text-outline</v-icon
                        >{{ $t("view comments") }}</v-btn
                      >
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-card-text>
          </template>
        </v-expand-transition>
        <v-expand-transition>
          <template v-if="course.show_assessment_pantential">
            <v-card-text>
              <v-card-text>
                <v-card
                  flat
                  v-if="
                    student_check_in.filter((v) => v.potential).length === 0
                  "
                >
                  <v-card-text
                    class="pa-2 py-4 text-center border-2 border-[#ff6b81] rounded-lg"
                  >
                    <span class="text-lg font-bold">
                      <v-icon color="#ff6b81">mdi-alert-outline</v-icon>
                      {{ $t("no potential assessment information found") }}
                    </span>
                  </v-card-text>
                </v-card>
                <v-card
                  outlined
                  class="mb-3"
                  v-for="(student, index) in student_check_in.filter(
                    (v) => v.potential
                  )"
                  :key="`${index}-checkin`"
                >
                  <v-card-text>
                    <v-row dense>
                      <v-col cols="12" sm class="text-lg font-bold">
                        {{ index + 1 }} .
                        {{
                          $i18n.locale == "th"
                            ? student.fullname
                            : student.fullname_en
                        }}</v-col
                      >
                      <v-col cols="12" sm="auto" align="center">
                        <v-row dense class="d-flex aling-center">
                          <v-col align="right"> {{ $t("attendance") }}: </v-col>
                          <v-col cols="auto">
                            <v-chip
                              class="font-bold"
                              :color="
                                check_in_status_options.filter(
                                  (v) => v.value === student.status
                                )[0].bg_color
                              "
                              :style="`color:${
                                check_in_status_options.filter(
                                  (v) => v.value === student.status
                                )[0].color
                              }`"
                              v-if="
                                check_in_status_options.filter(
                                  (v) => v.value === student.status
                                ).length > 0
                              "
                              >{{
                                $t(
                                  check_in_status_options.filter(
                                    (v) => v.value === student.status
                                  )[0].label
                                )
                              }}
                            </v-chip>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                    <v-row dense>
                      <v-col align="left" class="font-semibold"
                        >{{ $t("developmental level") }}:
                        <v-rating
                          background-color="pink lighten-3"
                          color="pink"
                          large
                          readonly
                          small
                          :value="
                            evolution_options.filter(
                              (v) => v.value === student.potential.evolution
                            ).length > 0
                              ? evolution_options.filter(
                                  (v) => v.value === student.potential.evolution
                                )[0].num_value
                              : 0
                          "
                          :length="
                            evolution_options.filter(
                              (v) => v.value === student.potential.evolution
                            ).length > 0
                              ? evolution_options.filter(
                                  (v) => v.value === student.potential.evolution
                                )[0].num_value
                              : 0
                          "
                        ></v-rating>
                      </v-col>
                      <v-col col="12" sm="auto">
                        <v-btn
                          class="w-full"
                          outlined
                          @click="showPotentialComment(student)"
                          color="#ff6b81"
                          ><v-icon>mdi-message-text-outline</v-icon
                          >{{ $t("view comments") }}</v-btn
                        >
                      </v-col>
                    </v-row>
                    <v-row dense>
                      <v-col> {{ $t("interest level") }}</v-col>
                    </v-row>
                    <v-row dense>
                      <v-col class="font-semibold">
                        <span>
                          {{ student.potential.interest }}
                        </span>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-card-text>
            </v-card-text>
          </template>
        </v-expand-transition>
        <v-expand-transition>
          <template v-if="course.show_summary">
            <v-card-text>
              <v-card
                flat
                v-if="
                  !coach_check_in.summary &&
                  !coach_check_in.homework &&
                  !coach_check_in.attachment
                "
              >
                <v-card-text
                  class="pa-2 py-4 text-center border-2 border-[#ff6b81] rounded-lg"
                >
                  <span class="text-lg font-bold">
                    <v-icon color="#ff6b81">mdi-alert-outline</v-icon>
                    {{ $t("can't find teaching summaries") }}
                  </span>
                </v-card-text>
              </v-card>
              <v-card outlined v-else>
                <v-card-text>
                  <v-row>
                    <v-col>
                      {{ $t("teaching notes") }} :
                      <span class="font-semibold">{{
                        coach_check_in.summary ? coach_check_in.summary : "-"
                      }}</span></v-col
                    >
                  </v-row>
                  <v-row>
                    <v-col>
                      {{ $t("development / homework") }} :
                      <span class="font-semibold">{{
                        coach_check_in.homework ? coach_check_in.homework : "-"
                      }}</span>
                    </v-col>
                  </v-row>
                  <div v-if="coach_check_in.attachment.length > 0">
                    <v-row dense>
                      <v-col class="font-bold">
                        {{ $t("attachments") }} :</v-col
                      >
                    </v-row>

                    <v-card
                      @click="openFileSummary(file)"
                      flat
                      class="mb-3"
                      v-for="(file, index) of coach_check_in.attachment"
                      :key="`${index}-fileattachment`"
                    >
                      <v-card-text class="border-2 border-[#ff6b81] rounded-lg">
                        <v-row dense>
                          <v-col cols="auto" class="pr-2">
                            <imgFileType
                              :mime_type="file.filesType"
                            ></imgFileType>
                          </v-col>
                          <v-col class="px-2">
                            <span class="font-bold">{{
                              file.originalFilesName
                            }}</span
                            ><br />
                            <span class="text-caption"
                              >{{ $t("file size") }} :
                              {{ (file.filesSize / 1000000).toFixed(2) }}
                              MB</span
                            >
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </div>
                </v-card-text>
              </v-card>
            </v-card-text>
          </template>
        </v-expand-transition>
      </v-card>
    </div>
    <!-- TAB 3 -->
    <div v-if="tab === 'request leave'">
      <loading-overlay :loading="coach_leaves_is_loadings"> </loading-overlay>
      <!-- leave form -->
      <v-row>
        <v-col align="right">
          <v-btn
            @click="showLeaveForm"
            :class="$vuetify.breakpoint.smAndUp ? '' : 'w-full'"
            outlined
            color="#ff6b81"
            ><v-icon>mdi-plus-circle-outline</v-icon
            >{{ $t("take leave form") }}</v-btn
          >
        </v-col>
      </v-row>
      <!-- tab_selected -->
      <v-row dense>
        <v-col cols="12" sm="7" @click="(tab_selected = ''), clickTab()">
          <img-card
            :class="
              tab_selected === ''
                ? 'img-card-active cursor-pointer drop-shadow-lg'
                : 'cursor-pointer drop-shadow-lg'
            "
            style="border-radius: 16px"
          >
            <template v-slot:img>
              <v-img
                max-height="90"
                max-width="70"
                src="@/assets/leave/leave_all.png"
              ></v-img>
            </template>
            <template v-slot:header>
              <div class="font-bold">{{ $t("all") }}</div>
            </template>
            <template v-slot:detail>
              <v-row class="d-flex align-end">
                <v-col align="center" class="text-3xl font-bold">
                  {{ coach_leaves.amount ? coach_leaves.amount : 0 }}
                </v-col>
                <v-col class="text-sm">{{ $t("list") }}</v-col>
              </v-row>
            </template>
          </img-card>
        </v-col>
        <!-- tab2 -->
        <v-col
          cols="12"
          sm="5"
          @click="(tab_selected = 'approved'), clickTab()"
        >
          <img-card
            class="cursor-pointer drop-shadow-lg"
            :class="tab_selected === 'approved' ? 'img-card-active' : ''"
            style="border-radius: 16px"
          >
            <template v-slot:img>
              <v-img
                max-height="90"
                max-width="70"
                src="@/assets/leave/approve.png"
              ></v-img>
            </template>
            <template v-slot:header>
              <div class="font-bold">{{ $t("approved") }}</div>
            </template>
            <template v-slot:detail>
              <v-row class="d-flex align-end">
                <v-col align="center" class="text-3xl font-bold">
                  {{
                    coach_leaves.amountApproved
                      ? coach_leaves.amountApproved
                      : 0
                  }}
                </v-col>
                <v-col class="text-sm">{{ $t("list") }}</v-col>
              </v-row>
            </template>
          </img-card>
        </v-col>
      </v-row>
      <!-- tab_selected -->
      <v-row dense class="mb-3">
        <!-- TAB 3 waiting for approval-->
        <v-col cols="12" sm="4" @click="(tab_selected = 'pending'), clickTab()">
          <img-card
            class="cursor-pointer drop-shadow-lg"
            :class="tab_selected === 'pending' ? 'img-card-active' : ''"
            style="border-radius: 16px"
          >
            <template v-slot:img>
              <v-img
                max-height="90"
                max-width="70"
                src="@/assets/leave/panding.png"
              ></v-img>
            </template>
            <template v-slot:header>
              <div class="font-bold">{{ $t("waiting for approval") }}</div>
            </template>
            <template v-slot:detail>
              <v-row class="d-flex align-end">
                <v-col align="center" class="text-3xl font-bold">
                  {{
                    coach_leaves.amountPending ? coach_leaves.amountPending : 0
                  }}
                </v-col>
                <v-col class="text-sm">{{ $t("list") }}</v-col>
              </v-row>
            </template>
          </img-card>
        </v-col>
        <!-- TAB 4 reject-->
        <v-col cols="12" sm="4" @click="(tab_selected = 'reject'), clickTab()">
          <img-card
            class="cursor-pointer drop-shadow-lg"
            :class="tab_selected === 'reject' ? 'img-card-active' : ''"
            style="border-radius: 16px"
          >
            <template v-slot:img>
              <v-img
                max-height="90"
                max-width="70"
                src="@/assets/leave/non-approve.png"
              ></v-img>
            </template>

            <template v-slot:header>
              <div class="font-bold">{{ $t("reject") }}</div>
            </template>
            <template v-slot:detail>
              <v-row class="d-flex align-end">
                <v-col align="center" class="text-3xl font-bold">
                  {{
                    coach_leaves.amountReject ? coach_leaves.amountReject : 0
                  }}
                </v-col>
                <v-col class="text-sm">{{ $t("list") }}</v-col>
              </v-row>
            </template>
          </img-card>
        </v-col>
        <!-- TAB 5 cancel-->
        <v-col cols="12" sm="4" @click="(tab_selected = 'cancel'), clickTab()">
          <img-card
            class="cursor-pointer drop-shadow-lg"
            :class="tab_selected === 'cancel' ? 'img-card-active' : ''"
            style="border-radius: 16px"
          >
            <template v-slot:img>
              <v-img
                max-height="90"
                max-width="70"
                src="@/assets/leave/cancel.png"
              ></v-img>
            </template>

            <template v-slot:header>
              <div class="font-bold">{{ $t("cancel") }}</div>
            </template>
            <template v-slot:detail>
              <v-row class="d-flex align-end">
                <v-col align="center" class="text-3xl font-bold">
                  {{
                    coach_leaves.amountCancel ? coach_leaves.amountCancel : 0
                  }}
                </v-col>
                <v-col class="text-sm">{{ $t("list") }}</v-col>
              </v-row>
            </template>
          </img-card>
        </v-col>
      </v-row>
      <!-- TABLE -->
      <v-data-table
        class="elevation-1 header-table"
        :headers="column"
        :items="coach_leaves.leavesList"
        :single-expand="singleExpand"
        :expanded.sync="expanded"
        item-key="coachLeaveId"
        show-expand
        :items-per-page="itemsPerPage"
        :server-items-length="coach_leaves.count"
        :options.sync="options"
        ref="coach_leaves"
        :footer-props="{
          'disable-pagination': disable_pagination_btn,
        }"
      >
        <!-- <template v-slot:no-data>
          {{ $t("leave information not found") }}
        </template> -->

        <template v-slot:[`no-results`]>
          <div class="font-bold">
            {{ $t("no data found in table") }}
          </div>
        </template>

        <template v-slot:no-data>
          <v-row class="fill-height ma-0 pa-5" align="center" justify="center">
            <v-progress-circular
              indeterminate
              color="#ff6b81"
            ></v-progress-circular>
          </v-row>
        </template>

        <template v-slot:[`item.count`]="{ item }">
          {{ item.index }}
        </template>
        <template v-slot:[`item.date`]="{ item }">
          {{
            item.startDate === item.endDate
              ? genDate(item.startDate)
              : `${genDate(item.startDate)} - ${genDate(item.endDate)}`
          }}
        </template>
        <template v-slot:[`item.leaveType`]="{ item }">
          {{ $t(item.leaveType) }}
        </template>
        <template v-slot:[`item.status`]="{ item }">
          <div
            class="d-flex align-center pa-1 rounded-lg"
            :class="
              item.status === 'pending'
                ? 'bg-[#FFF9E8] text-[#FCC419]'
                : item.status === 'approved'
                ? 'bg-[#F0F9EE] text-[#58A144]'
                : item.status === 'cancel'
                ? 'bg-[#e8e8e8] text-[#636363]'
                : 'bg-[#ffeeee] text-[#f00808]'
            "
          >
            <span class="w-full text-center">{{
              $t(
                item.status == "pending" ? "waiting for approval" : item.status
              )
            }}</span>
          </div>
        </template>
        <template v-slot:[`item.action`]="{ item }">
          <v-btn
            class="mr-3"
            icon
            color="#ff6b81"
            @click="showDialogDetail(item)"
            ><v-icon>mdi-eye-outline</v-icon>
          </v-btn>
          <v-btn
            :disabled="item.status !== 'pending'"
            icon
            color="#ff6b81"
            @click="cancelCoachLeave(item)"
            ><v-icon>mdi-file-cancel-outline</v-icon>
          </v-btn>
        </template>
        <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length" class="py-3">
            <div v-for="(date, index) in item.dates" :key="`${index}-courses`">
              <v-row
                v-for="(course, index) in date.courses"
                :key="`${index}-courses`"
              >
                <v-col cols="auto" class="font-bold">
                  {{ date.date ? GenDateStr(new Date(date.date)) : "-" }}
                </v-col>
                <v-col class="font-bold"
                  >{{ $t("course") }}:
                  {{ `${course.courseNameTh}(${course.courseNameEn})` }}</v-col
                >
                <v-col cols="5" v-if="course.type !== 'date'"
                  >{{ $t("substitute teacher") }}:
                  {{
                    $i18n.locale == "th"
                      ? `${course.substituteCoachFirstNameTh} ${course.substituteCoachLastNameTh}`
                      : `${course.substituteCoachFirstNameEn} ${course.substituteCoachLastNameEn}`
                  }}</v-col
                >
                <v-col cols="5" v-if="course.type === 'date'"
                  >{{ $t("substitute teaching date") }}:
                  {{
                    `${GenDateStr(new Date(course.compensationDate))}(${
                      course.compensationStartTime
                    }:${course.compensationEndTime})${$t("o'clock")}`
                  }}
                </v-col>
              </v-row>
            </div>
          </td>
        </template>
      </v-data-table>
    </div>
    <!-- TAB 4 -->
    <div v-if="tab === 'student lists'">
      <loading-overlay :loading="student_list_load"> </loading-overlay>

      <v-row>
        <v-col cols="auto"> {{ $t("my teaching information") }} :</v-col>
        <v-col class="font-bold">
          {{
            $i18n.locale == "th"
              ? profile_detail.firstNameTh
              : profile_detail.firstNameEng
          }}
        </v-col>
      </v-row>
      <!-- เลือกคอร์ส -->
      <v-row dense>
        <v-col>
          <span class="font-bold">{{ $t("choose a course") }}</span>
          <v-autocomplete
            v-model="filter_course_student"
            :item-text="$i18n.locale == 'th' ? 'name' : 'subtitle'"
            item-value="course_id"
            :items="my_courses.filter((v) => !v.type)"
            @change="filterCourseStudent(filter_course_student)"
            outlined
            dense
          >
            <template v-slot:no-data>
              <v-row dense>
                <v-col align="center">{{ $t("no data found") }}</v-col>
              </v-row>
            </template>
          </v-autocomplete>
        </v-col>
      </v-row>

      <!-- TAB -->
      <v-row class="mb-2">
        <v-col cols="12" align="center">
          <v-card flat width="340px">
            <v-card-text class="pa-2 border-2 border-[#ff6b81] rounded-lg">
              <v-row dense class="d-flex justify-center">
                <v-col
                  cols="12"
                  sm
                  v-for="(type, type_index) in student_type"
                  :key="`${type_index}-time`"
                >
                  <v-btn
                    class="w-full"
                    @click="selectStudentType(type.value)"
                    depressed
                    :dark="select_student_type === type.value"
                    :color="
                      select_student_type === type.value ? '#ff6b81' : '#F5F5F5'
                    "
                    >{{ $t(type.label) }}</v-btn
                  >
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- TABLE -->
      <v-card>
        <v-card-text>
          <!-- :loading="student_list_load" -->
          <v-data-table
            class="elevation-1 header-table"
            :headers="studentListHeader"
            :items="student_list"
          >
            <template v-slot:[`item.firstName`]="{ item }">
              {{ $i18n.locale == "th" ? item.firstNameTh : item.firstNameEn }}
            </template>
            <template v-slot:[`item.lastName`]="{ item }">
              {{ $i18n.locale == "th" ? item.lastNameTh : item.lastNameEn }}
            </template>
            <template v-slot:no-data>
              {{ $t("no data found in table") }}</template
            >
          </v-data-table>
        </v-card-text>
      </v-card>
    </div>

    <!-- CREATE :: LEAVE -->
    <v-dialog
      persistent
      :width="$vuetify.breakpoint.smAndUp ? '70vw' : ''"
      v-model="show_dialog_coach_leave_form"
      v-if="show_dialog_coach_leave_form"
    >
      <v-card class="pa-1">
        <v-row dense>
          <v-col class="pa-0" align="right">
            <v-btn @click="closeDialogLeaveForm" icon color="#ff6b81"
              ><v-icon>mdi-close</v-icon></v-btn
            >
          </v-col>
        </v-row>
        <coachLeaveForm></coachLeaveForm>
      </v-card>
    </v-dialog>
    <!-- DETAIL :: LEAVE -->
    <v-dialog
      persistent
      :width="$vuetify.breakpoint.smAndUp ? '60vw' : ''"
      v-model="show_leave_detail"
      v-if="show_leave_detail"
    >
      <v-card class="pa-1 mb-3">
        <v-row dense>
          <v-col align="right">
            <v-btn icon color="#ff6b81" @click="closeDialogLeaveDetail()"
              ><v-icon>mdi-close</v-icon></v-btn
            >
          </v-col>
        </v-row>
        <v-card-title class="d-flex justify-center">
          {{ $t("leave request form") }}
        </v-card-title>
        <v-card-text>
          <v-row dense class="mb-3">
            <v-col align="right"> {{ $t("status") }} : </v-col>
            <v-col cols="auto">
              <div
                class="btn-size-lg d-flex align-center pa-1 rounded-xl"
                :class="
                  edited_coach_leave_data.status === 'pending'
                    ? 'bg-[#FFF9E8] text-[#FCC419]'
                    : edited_coach_leave_data.status === 'approved'
                    ? 'bg-[#F0F9EE] text-[#58A144]'
                    : edited_coach_leave_data.status === 'cancel'
                    ? 'bg-[#e8e8e8] text-[#636363]'
                    : 'bg-[#ffeeee] text-[#f00808]'
                "
              >
                <span class="w-full text-center">{{
                  $t(
                    edited_coach_leave_data.status == "pending"
                      ? "waiting for approval"
                      : edited_coach_leave_data.status
                  )
                }}</span>
              </div>
            </v-col>
          </v-row>
          <v-row
            v-if="edited_coach_leave_data.status === 'reject'"
            dense
            class="mb-3"
          >
            <v-col>
              {{ $t("note") }}:
              <span class="font-bold">{{
                edited_coach_leave_data.remarkReject
              }}</span>
            </v-col>
          </v-row>
          <v-card flat class="mb-3">
            <v-card-text class="border border-1 rounded-lg">
              <v-row>
                <v-col cols="12" sm="6">
                  <div>{{ $t("leave date") }}</div>
                  <div class="font-semibold pl-2">
                    {{
                      `${genDate(
                        edited_coach_leave_data.startDate
                      )} - ${genDate(edited_coach_leave_data.endDate)}`
                    }}
                  </div>
                </v-col>
                <v-col cols="12" sm="6">
                  <div>{{ $t("period") }}</div>
                  <div class="font-semibold pl-2">
                    {{ $t(edited_coach_leave_data.period) }}
                  </div>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <div>{{ $t("leave type") }}</div>
                  <div class="font-semibold pl-2">
                    {{ $t(edited_coach_leave_data.leaveType) }}
                  </div>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <div>{{ $t("cause of leave") }}</div>
                  <div class="font-semibold pl-2">
                    {{ edited_coach_leave_data.remark }}
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
          <template v-if="edited_coach_leave_data?.dates.length > 0">
            <div
              class="mb-3"
              v-for="(date, index_date) in edited_coach_leave_data.dates"
              :key="`${index_date}-course`"
            >
              <v-row dense>
                <v-col cols="auto">
                  <v-icon color="#ff6b81">mdi-calendar-outline</v-icon>
                </v-col>
                <v-col class="font-bold text-lg">
                  {{ date.date ? GenDateStr(new Date(date.date)) : "-" }}
                </v-col>
              </v-row>
              <v-card
                class="mb-3"
                flat
                v-for="(course, index) in date.courses"
                :key="index"
              >
                <v-card-text class="rounded-md border">
                  <v-radio-group readonly v-model="course.type" row>
                    <v-radio
                      :label="$t('have a substitute teacher')"
                      color="#ff6b81"
                      value="teach"
                    ></v-radio>
                    <v-radio
                      :label="$t('there is no substitute teacher')"
                      color="#ff6b81"
                      value="date"
                    ></v-radio>
                  </v-radio-group>
                  <v-row dense>
                    <v-col cols="auto">
                      <v-icon color="#ff6b81"
                        >mdi-card-account-details-outline</v-icon
                      >
                    </v-col>
                    <v-col class="font-bold text-lg">
                      {{ $t("course") }}
                    </v-col>
                  </v-row>
                  <v-divider class="my-2"></v-divider>
                  <v-card flat>
                    <v-card-text class="border border-1 rounded-lg">
                      <v-row dense>
                        <v-col>
                          <div>{{ $t("course name") }}</div>
                          <div class="font-semibold pl-2">
                            {{
                              `${
                                $i18n.locale == "th"
                                  ? course.courseNameTh
                                  : course.courseNameEn
                              } ${course.startTime}-${course.endTime}`
                            }}
                          </div>
                        </v-col>
                      </v-row>
                      <v-row dense v-if="course.type === 'teach'">
                        <v-col>
                          <div>{{ $t("substitute teacher") }}</div>
                          <div class="font-semibold pl-2">
                            {{
                              $i18n.locale == "th"
                                ? `${course.substituteCoachFirstNameTh} ${course.substituteCoachLastNameTh}`
                                : `${course.substituteCoachFirstNameEn} ${course.substituteCoachLastNameEn}`
                            }}
                          </div>
                        </v-col>
                      </v-row>
                      <v-row dense v-if="course.type === 'date'">
                        <v-col>
                          <div>{{ $t("compensation date") }}</div>
                          <div class="font-semibold pl-2">
                            {{
                              `${GenDateStr(
                                new Date(course.compensationDate)
                              )} (${course.compensationStartTime}-${
                                course.compensationEndTime
                              })`
                            }}
                          </div>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-card-text>
              </v-card>
            </div>
            <v-row dense>
              <v-col class="font-bold text-lg"> {{ $t("attachments") }} </v-col>
            </v-row>
            <v-divider class="my-2"></v-divider>
            <template v-for="(file, index) of attachment_leave">
              <v-card
                v-if="file.coachLeaveAttachmentId"
                @click="dowloadFile(file)"
                flat
                class="mb-3"
                :key="`${index}-file`"
              >
                <v-card-text class="border-2 border-[#ff6b81] rounded-lg">
                  <v-row>
                    <v-col cols="auto" class="pr-2">
                      <imgFileType :mime_type="file.fileType"></imgFileType>
                    </v-col>
                    <v-col class="px-2">
                      <span class="font-bold">{{ file.fileName }}</span
                      ><br />
                      <span class="text-caption"
                        >{{ $t("file size") }} :
                        {{ (file.size / 1000000).toFixed(2) }} MB</span
                      >
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
              <v-card flat v-else :key="`${index}-file`">
                <v-card-text
                  class="border-2 border-[#ff6b81] rounded-lg"
                  align="center"
                >
                  {{ $t("attachment not found") }}
                </v-card-text>
              </v-card>
            </template>
          </template>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- COMMENT -->
    <v-dialog
      persistent
      :width="$vuetify.breakpoint.smAndUp ? '60vw' : ''"
      v-model="show_comment"
      v-if="show_comment"
    >
      <v-card class="pa-1">
        <v-row dense>
          <v-col class="pa-0" cols="12" align="right">
            <v-btn icon @click="closeComment">
              <v-icon color="#ff6b81">mdi-close</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-card-text>
          <v-row dense>
            <v-col align="center" class="text-lg font-bold">{{
              $t("additional comments")
            }}</v-col>
          </v-row>
          <v-row class="mb-3" dense>
            <v-col cols="12">
              <labelCustom :text="$t('add a comment')"></labelCustom>
              <div>{{ show_comment_data.assessment.remark }}</div>
            </v-col>
          </v-row>
          <div v-if="show_comment_data.assessment.attachment.length > 0">
            <v-row dense>
              <v-col class="font-bold"> {{ $t("attachments") }} :</v-col>
            </v-row>
            <v-card
              @click="openFile(file)"
              flat
              class="mb-3"
              v-for="(file, index) of show_comment_data.assessment.attachment"
              :key="`${index}-fileattachment`"
            >
              <v-card-text class="border-2 border-[#ff6b81] rounded-lg">
                <v-row dense>
                  <v-col cols="auto" class="pr-2">
                    <imgFileType :mime_type="file.filesType"></imgFileType>
                  </v-col>
                  <v-col class="px-2">
                    <span class="font-bold">{{ file.originalFilesName }}</span
                    ><br />
                    <span class="text-caption"
                      >{{ $t("file size") }} :
                      {{ (file.filesSize / 1000000).toFixed(2) }} MB</span
                    >
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- POTENTIAL -->
    <v-dialog
      persistent
      :width="$vuetify.breakpoint.smAndUp ? '60vw' : ''"
      v-model="show_potential_comment"
      v-if="show_potential_comment"
    >
      <v-card class="pa-1">
        <v-row dense>
          <v-col class="pa-0" cols="12" align="right">
            <v-btn icon @click="closePotentialComment">
              <v-icon color="#ff6b81">mdi-close</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-card-text>
          <v-row dense>
            <v-col align="center" class="text-lg font-bold"
              >{{ $t("additional comments") }}
            </v-col>
          </v-row>
          <v-row class="mb-3" dense>
            <v-col>
              <labelCustom :text="$t('add a comment')"></labelCustom>
              <div>{{ show_potential_data.potential.remark }}</div>
            </v-col>
          </v-row>
          <div
            v-if="show_potential_data.potential.attachmentPotential.length > 0"
          >
            <v-row dense>
              <v-col class="font-bold text-lg">
                {{ $t("attachments") }} :
              </v-col>
            </v-row>
            <v-card
              @click="openFile(file)"
              flat
              class="mb-3"
              v-for="(file, index) of show_potential_data.potential
                .attachmentPotential"
              :key="`${index}-fileattachment`"
            >
              <v-card-text class="border-2 border-[#ff6b81] rounded-lg">
                <v-row>
                  <v-col cols="auto" class="pr-2">
                    <imgFileType :mime_type="file.filesType"></imgFileType>
                  </v-col>
                  <v-col class="px-2">
                    <span class="font-bold">{{ file.originalFilesName }}</span
                    ><br />
                    <span class="text-caption"
                      >{{ $t("file size") }} :
                      {{ (file.filesSize / 1000000).toFixed(2) }} MB</span
                    >
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import calendarCoach from "@/components/calendar/calendarCoach.vue";
import headerPage from "@/components/header/headerPage.vue";
import rowData from "@/components/label/rowData.vue";
import imgCard from "@/components/course/imgCard.vue";
import moment from "moment";
import labelCustom from "@/components/label/labelCustom.vue";
import Swal from "sweetalert2";
import { dateFormatter } from "@/functions/functions";
import { mapActions, mapGetters } from "vuex";
import coachLeaveForm from "@/components/coach_leave/coachLeaveForm.vue";
import router from "@/router";
import imgFileType from "@/components/file_type/imgFileType.vue";
import loadingOverlay from "@/components/loading/loadingOverlay.vue";

export default {
  name: "menageCourse",
  components: {
    calendarCoach,
    headerPage,
    rowData,
    imgCard,
    labelCustom,
    coachLeaveForm,
    imgFileType,
    loadingOverlay,
  },
  data: () => ({
    form_coach_leave: false,
    singleExpand: false,
    expanded: [],
    filter_course: "",
    filter_course_student: "",
    user_detail: "",
    tab: "teaching list",
    today: new Date(),
    evolution_options: [
      { label: "ดีมาก", value: "very good", num_value: 5 },
      { label: "ดี", value: "good", num_value: 4 },
      { label: "ปรับปรุง", value: "adjust", num_value: 3 },
    ],
    interest_options: [
      { label: "ดีมาก", value: "very good", num_value: 5 },
      { label: "ดี", value: "good", num_value: 4 },
      { label: "ปรับปรุง", value: "adjust", num_value: 3 },
    ],
    tabs: [
      { label: "today's teaching program", value: "teaching list" },
      { label: "my teaching", value: "my teaching" },
      { label: "to request leave", value: "request leave" },
      { label: "student list", value: "student lists" },
    ],
    time_frame_list: [
      { label: "daily", value: "day" },
      { label: "weekly", value: "week" },
      { label: "monthly", value: "month" },
    ],
    student_type: [
      { label: "all students", value: "all" },
      { label: "students complete the course", value: "potential" },
    ],
    time_frame: "day",
    select_student_type: "all",
    menu: false,
    check_in_status_options: [
      {
        label: "punctual",
        value: "punctual",
        color: "#58A144",
        bg_color: "#F0F9EE",
      },
      { label: "late", value: "late", color: "#FCC419", bg_color: "#FFF9E8" },
      { label: "leave", value: "leave", color: "#43A4F5", bg_color: "#CFE2F3" },
      {
        label: "emergency leave",
        value: "emergency leave",
        color: "#43A4F5",
        bg_color: "#CFE2F3",
      },
      {
        label: "absent",
        value: "absent",
        color: "#F03D3E",
        bg_color: "#F4CCCC",
      },
    ],
    select_date: `${new Date().getFullYear()}-${
      new Date().getMonth() + 1
    }-${new Date().getDate()}`,
    student_list_header: [
      { text: "ลำดับ", align: "center", sortable: false, value: "index" },

      { text: "ชื่อ", align: "start", sortable: false, value: "firstNameTh" },
      {
        text: "นามสกุล",
        align: "start",
        sortable: false,
        value: "lastNameTh",
      },
      { text: "เบอร์โทร", align: "start", sortable: false, value: "tel" },
      {
        text: "อีเมล",
        align: "start",
        sortable: false,
        value: "email",
      },
    ],
    previewUrl: null,
    coach_leave_data: {
      menu_start_date: false,
      start_date: null,
      start_date_str: "",
      menu_end_date: false,
      end_date: null,
      end_date_str: "",
      period: "",
      coach_id: "",
      remark: "",
      status: "",
      leave_type: "",
      courses: [
        {
          my_course_id: "",
          course_id: "",
          substitute_coach_id: "",
          day_of_week_id: "",
          time_id: "",
        },
      ],
    },
    edited_coach_leave_data: {},
    selected_files: [],
    show_detail: false,
    show_leave_form: false,
    show_leave_detail: false,
    show_comment: false,
    show_comment_data: {},
    show_potential_comment: false,
    show_potential_data: {},
    select_status: "all",
    coach_leaves_arr: [],
    test: "",
    options: {},
    tab_selected: "",
    tabs_temp: "",
    tabs_change: false,
    disable_pagination_btn: false,
    coach_leaves_is_loadings: true,
    page: 1,
    itemsPerPage: 10,
  }),

  watch: {
    // tab: function () {
    //   this.GetMyCourses({ coach_id: this.user_detail.account_id });
    //   this.my_courses_is_loading = false;
    // },
    options: {
      handler() {
        this.loadItems();
      },
    },
  },

  created() {
    this.resetStudentList();
    this.GetLoading(true);
    if (this.$route.query.token) {
      this.loginShareToken(this.$route);
    }
    this.user_detail = JSON.parse(localStorage.getItem("userDetail"));
    // this.GetMyCourses({ coach_id: this.user_detail.account_id });
    // this.GetLeavesByAccountId({ account_id: this.user_detail.account_id });
    this.GetCoachs();
  },

  mounted() {
    this.GetMyCourses({ coach_id: this.user_detail.account_id });
    this.my_courses_is_loading = false;
    if (
      this.user_detail?.roles?.filter(
        (val) => val === "R_3" || val === "R_2" || val === "R_1"
      ).length === 0
    ) {
      router.replace({ name: "UserKingdom" });
    }
    this.$store.dispatch("NavberUserModules/changeTitleNavber", "management");
    if (this.user_detail?.account_id) {
      this.GetProfileDetail(this.user_detail.account_id);
    }

    this.GetLoading(false);
  },

  computed: {
    ...mapGetters({
      my_courses: "CoachModules/getMyCourses",
      coachs: "CourseModules/getCoachs",
      coach_leaves: "CoachModules/getCoachLeaves",
      attachment_leave: "CoachModules/getAttachmentLeave",
      student_check_in: "CoachModules/getStudentCheckIn",
      coach_check_in: "CoachModules/getCoachCheckIn",
      my_courses_is_loading: "CoachModules/getMyCoursesIsLoading",
      profile_detail: "ProfileModules/getProfileDetail",
      show_dialog_coach_leave_form: "CoachModules/getShowDialogCoachLeaveForm",
      coach_leaves_is_loading: "CoachModules/getCoachLeavesIsLoading",
      student_list: "CoachModules/getstudentList",
      student_list_load: "CoachModules/getStudentListLoading",
    }),
    column() {
      return [
        {
          text: this.$t("no."),
          align: "center",
          sortable: false,
          value: "count",
        },

        {
          text: this.$t("date"),
          align: "start",
          sortable: false,
          value: "date",
        },
        {
          text: this.$t("type of take leave"),
          align: "start",
          sortable: false,
          value: "leaveType",
        },
        {
          text: this.$t("status"),
          align: "start",
          sortable: false,
          value: "status",
        },
        { text: "", align: "right", sortable: false, value: "action" },
      ];
    },
    studentListHeader() {
      return [
        {
          text: this.$t("no."),
          align: "center",
          sortable: false,
          value: "index",
        },

        {
          text: this.$t("first name"),
          align: "start",
          sortable: false,
          value: "firstName",
        },
        {
          text: this.$t("last name"),
          align: "start",
          sortable: false,
          value: "lastName",
        },
        {
          text: this.$t("phone number"),
          align: "start",
          sortable: false,
          value: "tel",
        },
        {
          text: this.$t("email"),
          align: "start",
          sortable: false,
          value: "email",
        },
      ];
    },
    // SetFunctionsComputed() {
    //   this.GetMyCourses({ coach_id: this.user_detail.account_id });
    //   this.GetLeavesByAccountId({ account_id: this.user_detail.account_id });
    //   this.GetCoachs();
    //   return "";
    // },
    genToday() {
      return moment(new Date()).format("YYYY-MM-DD");
    },

    validateCoachLeave() {
      let start_date = this.coach_leave_data.start_date ? true : false;
      let end_date = this.coach_leave_data.end_date ? true : false;
      let period = this.coach_leave_data.period ? true : false;
      let leave_type = this.coach_leave_data.leave_type ? true : false;
      let course =
        this.coach_leave_data.courses.length > 0
          ? this.coach_leave_data.courses[0].my_course_id
            ? true
            : false
          : false;
      return !(start_date && end_date && period && leave_type && course);
    },

    periods() {
      return [
        { label: this.$t("full day leave"), value: "full" },
        { label: this.$t("morning leave"), value: "morning" },
        { label: this.$t("afternoon leave"), value: "afternoon" },
      ];
    },

    leaveTypes() {
      return [
        { label: this.$t("sick leave"), value: "sick" },
        { label: this.$t("personal"), value: "personal" },
        { label: this.$t("take annual leave"), value: "take annual leave" },
      ];
    },
  },
  methods: {
    ...mapActions({
      GetAllHolidays: "ManageScheduleModules/GetAllHolidays",
      GetMyCourses: "CoachModules/GetMyCourses",
      GetCoachs: "CourseModules/GetCoachs",
      SaveCoachLeave: "CoachModules/SaveCoachLeave",
      GetLeavesByAccountId: "CoachModules/GetLeavesByAccountId",
      updateStatusCoachLeave: "CoachModules/updateStatusCoachLeave",
      GetAttachmentLeave: "CoachModules/GetAttachmentLeave",
      GetStudentByTimeId: "CoachModules/GetStudentByTimeId",
      GetCoachCheckIn: "CoachModules/GetCoachCheckIn",
      loginShareToken: "loginModules/loginShareToken",
      GetProfileDetail: "ProfileModules/GetProfileDetail",
      ShowDialogCoachLeaveForm: "CoachModules/ShowDialogCoachLeaveForm",
      GetLoading: "LoadingModules/GetLoading",
      GetstudentList: "CoachModules/GetstudentList",
      resetStudentList: "CoachModules/resetStudentList",
    }),
    filterCourseStudent(items) {
      this.GetstudentList({
        coach_id: this.user_detail.account_id,
        course_id: items,
        type: this.select_student_type,
      });
    },
    selectStudentType(items) {
      this.GetstudentList({
        coach_id: this.user_detail.account_id,
        course_id: this.filter_course_student,
        type: items,
      });
      this.select_student_type = items;
    },
    SelectedStatus(status) {
      this.select_status = status;
      this.coach_leaves_arr = [];

      if (status !== "all") {
        this.coach_leave_arr = this.coach_leaves.filter(
          (items) => status === items.status
        );
        this.coach_leave_arr.map((items, i) => {
          items.index = i + 1;
        });
      } else {
        this.GetLeavesByAccountId({ account_id: this.user_detail.account_id });
      }
    },
    GenDateStr(date) {
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      return date.toLocaleDateString(
        this.$i18n.locale == "th" ? "th-TH" : "en-US",
        options
      );
    },
    openFileSummary(file) {
      window.open(file.attFilesUrl, "_blank");
    },
    openFile(file) {
      if (file.attachmentPotentialId) {
        let url = `${process.env.VUE_APP_URL}/api/v1/files/${file.attachmentFiles}`;
        window.open(url, "_blank");
      } else if (file.attId) {
        let url = `${process.env.VUE_APP_URL}/api/v1/files/${file.attFiles}`;
        window.open(url, "_blank");
      }
    },
    showPotentialComment(course) {
      this.show_potential_comment = true;
      this.show_potential_data = course;
    },
    closePotentialComment() {
      this.show_potential_comment = false;
      this.show_potential_data = {};
    },
    showComment(course) {
      this.show_comment = true;
      this.show_comment_data = course;
    },
    closeComment() {
      this.show_comment = false;
      this.show_comment_data = {};
    },
    CloseOpenSummaryAll() {
      for (const course of this.my_courses) {
        course.show_summary = false;
        course.show_assessment = false;
        course.show_assessment_pantential = false;
      }
    },
    OpenSummary(course) {
      this.CloseOpenSummaryAll();
      this.GetCoachCheckIn({
        course_id: course.course_id,
        date: course.start_date,
      });
      course.show_summary = !course.show_summary;
      course.show_assessment = false;
      course.show_assessment_pantential = false;
    },
    OpenAssessment(course) {
      this.CloseOpenSummaryAll();
      this.GetStudentByTimeId({
        course_id: course.course_id,
        date: course.start_date,
        time_id: course.time_id,
      });
      course.show_summary = false;
      course.show_assessment = !course.show_assessment;
      course.show_assessment_pantential = false;
    },
    OpenAssessmentPotential(course) {
      this.CloseOpenSummaryAll();
      this.GetStudentByTimeId({
        course_id: course.course_id,
        date: course.start_date,
        time_id: course.time_id,
      });
      course.show_summary = false;
      course.show_assessment = false;
      course.show_assessment_pantential = !course.show_assessment_pantential;
    },
    genDate(date) {
      return dateFormatter(new Date(date), "DD MMT YYYYT");
    },
    RemoveCourse(index) {
      this.coach_leave_data.courses.splice(index, 1);
    },
    AddCourse() {
      this.coach_leave_data.courses.push({
        my_course_id: "",
        course_id: "",
        substitute_coach_id: "",
        day_of_week_id: "",
        time_id: "",
      });
    },
    cancelCoachLeave(data) {
      Swal.fire({
        icon: "question",
        title: this.$t("do you want to cancel your leave?"),
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: this.$t("agree"),
        cancelButtonText: this.$t("cancel"),
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.updateStatusCoachLeave({
            coach_leave_id: data.coachLeaveId,
            status: "cancel",
            account_id: this.user_detail.account_id,
          });
        }
      });
    },
    dowloadFile(file) {
      let url = `${process.env.VUE_APP_URL}/api/v1/files/${file.attachmentFile}`;
      window.open(url, "_blank");
    },
    GenCourseLeaveOptions() {
      let my_course_data = [];
      this.my_courses.forEach((course) => {
        my_course_data.push({
          my_course_id: `${course.course_id}|${course.day_of_week_id}|${course.time_id}`,
          cousre_id: course.course_id,
          course_name: `${course.name} ${course.start_time} - ${course.end_time}น.`,
          time_id: course.time_id,
          day_of_week_id: course.day_of_week_id,
        });
      });
      return my_course_data;
    },
    inputDate(e, data) {
      switch (data) {
        case "start":
          this.coach_leave_data.start_date_str = dateFormatter(
            e,
            "DD MT YYYYT"
          );
          break;
        case "end":
          this.coach_leave_data.end_date_str = dateFormatter(e, "DD MT YYYYT");
          break;
      }
    },
    showLeaveForm() {
      this.ShowDialogCoachLeaveForm(true);
      this.show_leave_form = true;
    },
    closeDialogLeaveForm() {
      this.selected_files = [];
      this.show_leave_form = false;
      this.ShowDialogCoachLeaveForm(false);
      this.coach_leave_data = {
        menu_start_date: false,
        start_date: null,
        start_date_str: "",
        menu_end_date: false,
        end_date: null,
        end_date_str: "",
        period: "",
        coach_id: "",
        day_of_week_id: "",
        time_id: "",
        remark: "",
        status: "",
        leave_type: "",
        courses: [
          {
            my_course_id: "",
            course_id: "",
            substitute_coach_id: "",
            day_of_week_id: "",
            time_id: "",
          },
        ],
      };
    },
    showDialogDetail(leave_data) {
      this.show_leave_detail = true;
      this.edited_coach_leave_data = leave_data;
      this.GetAttachmentLeave({ coach_leave_id: leave_data.coachLeaveId });
    },
    closeDialogLeaveDetail() {
      this.show_leave_detail = false;
      this.edited_coach_leave_data = {};
      // this.attachment_leave = [];
    },
    openFileSelector() {
      this.$refs.fileInput.click();
    },
    removeFile(index) {
      this.selected_files.splice(index, 1);
    },
    filterMycourse() {
      if (this.filter_course) {
        return this.my_courses.filter(
          (v) => v.course_id === this.filter_course && !v.type
        );
      } else {
        return this.my_courses.filter((v) => !v.type);
      }
    },

    async clickTab() {
      if (this.tabs_temp !== this.tab_selected) {
        this.tabs_change = true;
      }
      await this.loadItems(this.tab_selected);
    },

    async loadItems(status) {
      this.tab_selected =
        !status || status === ""
          ? this.tab_selected === ""
            ? ""
            : this.tab_selected
          : status;

      if (this.tabs_temp !== this.tab_selected) {
        this.tabs_change = true;
      }
      this.tabs_temp = this.tab_selected;

      this.loading = true;
      await this.moreData(this.tab_selected);
      this.loading = false;
    },

    async moreData(status) {
      let { page, itemsPerPage } = this.options;
      this.disable_pagination_btn = true;
      this.coach_leaves.leavesList = [];
      await this.GetLeavesByAccountId({
        limit: itemsPerPage,
        page: this.tabs_change ? 1 : page,
        status: status,
      });
      if (this.tabs_change) {
        this.$refs.coach_leaves.$props.options.page = 1;
      }

      this.disable_pagination_btn = false;
      this.tabs_change = false;
      this.coach_leaves_is_loadings = false;
    },

    // filterMycourseStudent() {
    //   if (this.filter_course_student) {
    //     return this.my_courses.filter(
    //       (v) => v.course_id === this.filter_course && !v.type
    //     );
    //   } else {
    //     return this.my_courses.filter((v) => !v.type);
    //   }
    // },
  },
};
</script>

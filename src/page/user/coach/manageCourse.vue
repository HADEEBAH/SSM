<template>
  <div>
    <v-container>
      <header-page title="เลือกข้อมูลการสอน"></header-page>
      <v-row dense class="mb-3">
        <v-col
          cols="12"
          sm="4"
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
            {{ tab_data.label }}
          </v-btn>
        </v-col>
      </v-row>
      <div v-if="tab === 'teaching list'">
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
                      >{{ time.label }}</v-btn
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
          <div
            v-for="(course, course_index) in my_courses.filter(
              (v) => v.start_date === genToday
            )"
            :key="course_index"
          >
            <!-- {{ new Date(course.start) }} -->
            <v-card
              outlined
              class="mb-2"
              @click="
                $router.push({
                  name: 'menageCourseDetail',
                  params: {
                    courseId: course.course_id,
                    timeId: course.time_id,
                    dayOfWeekId: course.day_of_week_id,
                    date: course.start_date,
                  },
                })
              "
            >
              <v-card-text class="cursor-pointer">
                <v-row dense>
                  <v-col cols="12" sm="auto">
                    <v-img
                      :contain="$vuetify.breakpoint.smAndUp"
                      :cover="$vuetify.breakpoint.smAndUp"
                      class="rounded-lg"
                      :src="
                        course.course_img || course.course_img !== ''
                          ? course.course_img
                          : require(`@/assets/course/default_course_img.svg`)
                      "
                      max-height="160"
                      :max-width="$vuetify.breakpoint.smAndUp ? 160 : ''"
                    ></v-img>
                  </v-col>
                  <v-col>
                    <v-row dense>
                      <v-col class="text-lg font-bold">{{
                        `${course.name}(${course.subtitle})`
                      }}</v-col>
                      <v-col cols="auto">
                        <v-chip small color="#F9B320" dark
                          >{{
                            `${course.start_time}-${course.end_time}`
                          }}น.</v-chip
                        >
                      </v-col>
                    </v-row>
                    <v-row dense>
                      <v-col cols="auto"
                        ><v-icon color="#ff6b81">mdi-bookshelf</v-icon></v-col
                      >
                      <v-col>{{ `อาณาจักร :${course.category_name}` }}</v-col>
                    </v-row>
                    <v-row dense>
                      <v-col cols="12" v-if="course.course_package_name">
                        <rowData mini icon="mdi-account-box-multiple"
                          >แพ็คเกจ : {{ course.course_package_name }}</rowData
                        >
                      </v-col>
                    </v-row>
                    <v-row dense>
                      <v-col cols="auto"
                        ><v-icon color="#ff6b81"
                          >mdi-clock-outline</v-icon
                        ></v-col
                      >
                      <v-col>{{
                        `เวลาสอน :${course.course_per_time} ชั่วโมง`
                      }}</v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </div>
          <div
            v-if="
              my_courses.filter((v) => v.start_date === genToday).length == 0
            "
          >
            <v-card flat>
              <v-card-text
                class="pa-2 py-4 text-center border-2 border-[#ff6b81] rounded-lg"
              >
                <span class="text-lg font-bold">
                  <v-icon color="#ff6b81">mdi-alert-outline</v-icon>
                  ไม่พบข้อมูลการสอน
                </span>
              </v-card-text>
            </v-card>
          </div>
        </template>
        <!-- รายสัปดาห์ -->
        <template v-else>
          <!-- COURSE LIST -->
          <div align="center">
            <v-progress-circular
              color="#ff6b81"
              v-if="my_courses_is_loading"
              indeterminate
              size="64"
            ></v-progress-circular>
          </div>
          <calendarCoach
            v-if="!my_courses_is_loading"
            :events="my_courses"
            :type="time_frame"
          ></calendarCoach>
        </template>
      </div>
      <div v-if="tab === 'my teaching'">
        <v-row>
          <v-col cols="auto"> ข้อมูลการสอนของฉัน : </v-col>
          <v-col class="font-bold">
            {{ profile_detail.firstNameTh }}
          </v-col>
        </v-row>
        <v-row dense>
          <v-col>
            <span class="font-bold">เลือกคอร์ส</span>
            <v-autocomplete
              v-model="filter_course"
              item-text="name"
              item-value="course_id"
              :items="my_courses"
              outlined
              dense
            ></v-autocomplete>
          </v-col>
        </v-row>
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
                  height="160"
                  :src="
                    course.course_img || course.course_img !== ''
                      ? course.course_img
                      : require(`@/assets/course/default_course_img.svg`)
                  "
                />
              </v-col>
              <v-col>
                <v-row dense>
                  <v-col class="font-bold text-md">{{
                    course.start_date_str
                  }}</v-col>
                </v-row>
                <v-row dense>
                  <v-col cols="12">
                    <rowData mini icon="mdi-account"
                      >อาณาจักร : {{ course.category_name }}</rowData
                    >
                  </v-col>

                  <v-col cols="12" v-if="course.course_package_name">
                    <rowData mini icon="mdi-account-box-multiple"
                      >แพ็คเกจ : {{ course.course_package_name }}</rowData
                    >
                  </v-col>
                  <v-col cols="12">
                    <rowData mini icon="mdi-bookshelf"
                      >คอร์สเรียน :{{
                        `${course.name}(${course.subtitle})`
                      }}</rowData
                    >
                  </v-col>
                  <v-col cols="12">
                    <rowData mini icon="mdi-clock-time-four-outline"
                      >เวลาสอน {{ course.course_per_time }} ชั่วโมง</rowData
                    >
                  </v-col>
                  <v-col cols="12">
                    <v-chip small color="#F9B320" dark
                      >{{
                        `${course.start_time} - ${course.end_time}`
                      }}น.</v-chip
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
                >ประเมินนักเรียน
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
                >ประเมินศักยภาพ
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
                >บันทึกสรุปการสอน
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
                      ไม่พบข้อมูลการประเมินนักเรียน
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
                        {{ index + 1 }} . {{ student.fullname }}</v-col
                      >
                      <v-col cols="12" sm="auto">
                        <v-row dense class="d-flex aling-center">
                          <v-col align="right"> การเข้าเรียน: </v-col>
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
                                check_in_status_options.filter(
                                  (v) => v.value === student.status
                                )[0].label
                              }}
                            </v-chip>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                    <v-row dense>
                      <v-col cols="12" sm align="left" class="font-semibold">
                        ระดับพัฒนาการ
                        <v-rating
                          background-color="pink lighten-3"
                          color="pink"
                          large
                          :value="
                            evolution_options.filter(
                              (v) => v.value === student.assessment.evolution
                            ).length > 0
                              ? evolution_options.filter(
                                  (v) =>
                                    v.value === student.assessment.evolution
                                )[0].num_value
                              : 0
                          "
                          :length="
                            evolution_options.filter(
                              (v) => v.value === student.assessment.evolution
                            ).length > 0
                              ? evolution_options.filter(
                                  (v) =>
                                    v.value === student.assessment.evolution
                                )[0].num_value
                              : 0
                          "
                          small
                          readonly
                        ></v-rating>
                      </v-col>
                      <v-col cols="12" sm align="left" class="font-semibold"
                        >ระดับความสนใจ
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
                          >ดูความคิดเห็น</v-btn
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
                        ไม่พบข้อมูลการประเมินศักยภาพ
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
                      <v-row>
                        <v-col class="text-lg font-bold">
                          {{ index + 1 }} . {{ student.fullname }}</v-col
                        >
                        <v-col align="center">
                          <v-row dense class="d-flex aling-center">
                            <v-col align="right"> การเข้าเรียน: </v-col>
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
                                  check_in_status_options.filter(
                                    (v) => v.value === student.status
                                  )[0].label
                                }}
                              </v-chip>
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col align="left" class="font-semibold"
                          >ระดับพัฒนาการ :
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
                                    (v) =>
                                      v.value === student.potential.evolution
                                  )[0].num_value
                                : 0
                            "
                            :length="
                              evolution_options.filter(
                                (v) => v.value === student.potential.evolution
                              ).length > 0
                                ? evolution_options.filter(
                                    (v) =>
                                      v.value === student.potential.evolution
                                  )[0].num_value
                                : 0
                            "
                          ></v-rating>
                        </v-col>
                        <v-col col="12" sm="auto">
                          <v-btn
                            outlined
                            @click="showPotentialComment(student)"
                            color="#ff6b81"
                            ><v-icon>mdi-message-text-outline</v-icon
                            >ดูความคิดเห็น</v-btn
                          >
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col> ระดับความสนใจ </v-col>
                      </v-row>
                      <v-row>
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
                      ไม่พบข้อมูลบันทึกสรุปการสอน
                    </span>
                  </v-card-text>
                </v-card>
                <v-card outlined v-else>
                  <v-card-text>
                    <v-row>
                      <v-col>
                        บันทึกการสอน :
                        <span class="font-semibold">{{
                          coach_check_in.summary ? coach_check_in.summary : "-"
                        }}</span></v-col
                      >
                    </v-row>
                    <v-row>
                      <v-col>
                        พัฒนาการ / การบ้าน :
                        <span class="font-semibold">{{
                          coach_check_in.homework
                            ? coach_check_in.homework
                            : "-"
                        }}</span>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col
                        >ไฟล์แนบ :
                        <template v-if="coach_check_in.attachment.length > 0">
                          <label
                            class="mr-2 text-[#ff6b81] underline underline-offset-1 cursor-pointer"
                            text
                            @click="openFileSummary(att)"
                            v-for="(
                              att, index_att
                            ) in coach_check_in.attachment"
                            :key="`${index_att}-att`"
                          >
                            {{ att.originalFilesName }}
                          </label>
                        </template>
                        <template v-else>
                          <span> - </span>
                        </template>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-card-text>
            </template>
          </v-expand-transition>
        </v-card>
      </div>
      <div v-if="tab === 'request leave'">
        <v-row>
          <v-col align="right">
            <v-btn
              @click="showLeaveForm"
              :class="$vuetify.breakpoint.smAndUp ? '' : 'w-full'"
              outlined
              color="#ff6b81"
              ><v-icon>mdi-plus-circle-outline</v-icon>แบบฟอร์มขอลา</v-btn
            >
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="12" sm="7" @click="SelectedStatus('all')">
            <img-card
              :color="select_status == 'all' ? '#FBF3F5' : '#ffffff'"
              class="cursor-pointer"
              :class="tab === 'all' ? 'img-card-active' : ''"
            >
              <template v-slot:img>
                <v-img
                  max-height="90"
                  max-width="70"
                  src="../../../assets/leave/leave_all.png"
                ></v-img>
              </template>
              <template v-slot:header>
                <div class="font-bold text-center">ทั้งหมด</div>
              </template>
              <template v-slot:detail>
                <v-row class="d-flex align-end">
                  <v-col align="end" class="text-3xl font-bold">{{
                    coach_leaves.length
                  }}</v-col>
                  <v-col class="text-sm">รายการ</v-col>
                </v-row>
              </template>
            </img-card>
          </v-col>
          <v-col cols="12" sm="5" @click="SelectedStatus('approved')">
            <img-card
              :color="select_status == 'approved' ? '#FBF3F5' : '#ffffff'"
              class="cursor-pointer"
              :class="tab === 'all' ? 'img-card-active' : ''"
            >
              <template v-slot:img>
                <v-img
                  max-height="90"
                  max-width="70"
                  src="../../../assets/leave/approve.png"
                ></v-img>
              </template>
              <template v-slot:header>
                <div class="font-bold text-center text-[#57A363]">อนุมัติ</div>
              </template>
              <template v-slot:detail>
                <v-row class="d-flex align-end mb-1">
                  <v-col
                    align="end"
                    class="text-3xl font-bold text-[#57A363]"
                    >{{
                      coach_leaves.filter((v) => v.status === "approved").length
                    }}</v-col
                  >
                  <v-col class="text-sm">รายการ</v-col>
                </v-row>
              </template>
            </img-card>
          </v-col>
        </v-row>
        <v-row dense class="mb-3">
          <v-col cols="12" sm="4" @click="SelectedStatus('pending')">
            <img-card
              :color="select_status == 'pending' ? '#FBF3F5' : '#ffffff'"
              class="cursor-pointer"
              :class="tab === 'all' ? 'img-card-active' : ''"
            >
              <template v-slot:img>
                <v-img
                  max-height="90"
                  max-width="70"
                  src="../../../assets/leave/panding.png"
                ></v-img>
              </template>
              <template v-slot:header>
                <div class="font-bold text-center text-[#FCC419]">
                  รออนุมัติ
                </div>
              </template>
              <template v-slot:detail>
                <v-row class="d-flex align-end">
                  <v-col
                    align="end"
                    class="text-3xl font-bold text-[#FCC419]"
                    >{{
                      coach_leaves.filter((v) => v.status === "pending").length
                    }}</v-col
                  >
                  <v-col class="text-sm">รายการ</v-col>
                </v-row>
              </template>
            </img-card>
          </v-col>
          <v-col cols="12" sm="4" @click="SelectedStatus('reject')">
            <img-card
              :color="select_status == 'reject' ? '#FBF3F5' : '#ffffff'"
              class="cursor-pointer"
              :class="tab === 'all' ? 'img-card-active' : ''"
            >
              <template v-slot:img>
                <v-img
                  max-height="90"
                  max-width="70"
                  src="../../../assets/leave/non-approve.png"
                ></v-img>
              </template>
              <template v-slot:header>
                <div class="font-bold text-center text-[#F03D3E]">
                  ไม่อนุมัติ
                </div>
              </template>
              <template v-slot:detail>
                <v-row class="d-flex align-end">
                  <v-col
                    align="end"
                    class="text-3xl font-bold text-[#F03D3E]"
                    >{{
                      coach_leaves.filter((v) => v.status === "reject").length
                    }}</v-col
                  >
                  <v-col class="text-sm">รายการ</v-col>
                </v-row>
              </template>
            </img-card>
          </v-col>
          <v-col cols="12" sm="4" @click="SelectedStatus('cancel')">
            <img-card
              :color="select_status == 'cancel' ? '#FBF3F5' : '#ffffff'"
              class="cursor-pointer"
              :class="tab === 'all' ? 'img-card-active' : ''"
            >
              <template v-slot:img>
                <v-img
                  max-height="90"
                  max-width="70"
                  src="../../../assets/leave/cancel.png"
                ></v-img>
              </template>
              <template v-slot:header>
                <div class="font-bold text-center text-[#999999]">ยกเลิก</div>
              </template>
              <template v-slot:detail>
                <v-row class="d-flex align-end">
                  <v-col
                    align="end"
                    class="text-3xl font-bold text-[#999999]"
                    >{{
                      coach_leaves.filter((v) => v.status === "cancel").length
                    }}</v-col
                  >
                  <v-col class="text-sm">รายการ</v-col>
                </v-row>
              </template>
            </img-card>
          </v-col>
        </v-row>
        <v-card>
          <v-card-text>
            <v-data-table
              class="elevation-1 header-table"
              :headers="column"
              :items="
                select_status == 'all'
                  ? coach_leaves
                  : coach_leaves.filter((v) => v.status === select_status)
              "
              :single-expand="singleExpand"
              :expanded.sync="expanded"
              item-key="coachLeaveId"
              show-expand
            >
            <template v-slot:no-data>
                ไม่พบข้อมูลใบลา
            </template>
              <template v-slot:[`item.date`]="{ item }">
                {{
                  item.startDate === item.endDate
                    ? genDate(item.startDate)
                    : `${genDate(item.startDate)} - ${genDate(item.endDate)}`
                }}
              </template>
              <template v-slot:[`item.leaveType`]="{ item }">
                {{
                  item.leaveType === "personal"
                    ? "ลากิจ"
                    : item.leaveType === "sick"
                    ? "ลาป่วย"
                    : "ลาพักร้อน"
                }}
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
                    item.status == "pending"
                      ? "รออนุมัติ"
                      : item.status === "approved"
                      ? "อนุมัติ"
                      : item.status === "cancel"
                      ? "ยกเลิก"
                      : "ไม่อนุมัติ"
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
                <v-btn :disabled="item.status !== 'pending'" icon color="#ff6b81" @click="cancelCoachLeave(item)"
                  ><v-icon>mdi-file-cancel-outline</v-icon>
                </v-btn>
              </template>
              <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length" class="py-3">
                  <div
                    v-for="(date, index) in item.dates"
                    :key="`${index}-courses`"
                  >
                    <v-row
                      v-for="(course, index) in date.courses"
                      :key="`${index}-courses`"
                    >
                      <v-col cols="auto" class="font-bold">
                        {{ date.date ? GenDateStr(new Date(date.date)) : "-" }}
                      </v-col>
                      <v-col class="font-bold"
                        >คอร์ส:
                        {{
                          `${course.courseNameTh}(${course.courseNameEn})`
                        }}</v-col
                      >
                      <v-col cols="5" v-if="course.type !== 'date'"
                        >ผู้สอนแทน:
                        {{
                          `${course.substituteCoachFirstNameTh} ${course.substituteCoachLastNameTh}`
                        }}</v-col
                      >
                      <v-col cols="5" v-if="course.type === 'date'"
                        >วันที่สอนแทน:
                        {{
                          `${GenDateStr(new Date(course.compensationDate))}(${
                            course.compensationStartTime
                          }:${course.compensationEndTime})น.`
                        }}
                      </v-col>
                    </v-row>
                  </div>
                </td>
              </template>
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
            แบบฟอร์มขอลา
          </v-card-title>
          <v-card-text>
            <v-row dense class="mb-3">
              <v-col align="right"> สภานะ : </v-col>
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
                    edited_coach_leave_data.status == "pending"
                      ? "รออนุมัติ"
                      : edited_coach_leave_data.status === "approved"
                      ? "อนุมัติ"
                      : edited_coach_leave_data.status === "cancel"
                      ? "ยกเลิก"
                      : "ไม่อนุมัติ"
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
                หมายเหตุ:
                <span class="font-bold">{{
                  edited_coach_leave_data.remarkReject
                }}</span>
              </v-col>
            </v-row>
            <v-card flat class="mb-3">
              <v-card-text class="border border-1 rounded-lg">
                <v-row>
                  <v-col>
                    <div>วันที่ลา</div>
                    <div class="font-semibold pl-2">
                      {{
                        `${genDate(
                          edited_coach_leave_data.startDate
                        )} - ${genDate(edited_coach_leave_data.endDate)}`
                      }}
                    </div>
                  </v-col>
                  <v-col>
                    <div>ช่วงเวลา</div>
                    <div class="font-semibold pl-2">
                      {{
                        edited_coach_leave_data.period === "full"
                          ? "ลาเต็มวัน"
                          : edited_coach_leave_data.period === "morning"
                          ? "ลาช่วงเช้า"
                          : "ลาช่วงบ่าย"
                      }}
                    </div>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <div>ประเภทการลา</div>
                    <div class="font-semibold pl-2">
                      {{
                        edited_coach_leave_data.leaveType === "sick"
                          ? "ลาป่วย"
                          : edited_coach_leave_data.leaveType === "personal"
                          ? "ลากิจ"
                          : "ลาพักร้อน"
                      }}
                    </div>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <div>สาเหตุการลา</div>
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
                        label="มีผู้สอนแทน"
                        color="#ff6b81"
                        value="teach"
                      ></v-radio>
                      <v-radio
                        label="ไม่มีผู้สอนแทน"
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
                      <v-col class="font-bold text-lg"> คอร์ส </v-col>
                    </v-row>
                    <v-divider class="my-2"></v-divider>
                    <v-card flat>
                      <v-card-text class="border border-1 rounded-lg">
                        <v-row dense>
                          <v-col>
                            <div>ชื่อคอร์ส</div>
                            <div class="font-semibold pl-2">
                              {{
                                `${course.courseNameTh} ${course.startTime}-${course.endTime}`
                              }}
                            </div>
                          </v-col>
                        </v-row>
                        <v-row dense v-if="course.type === 'teach'">
                          <v-col>
                            <div>ผู้สอนแทน</div>
                            <div class="font-semibold pl-2">
                              {{
                                `${course.substituteCoachFirstNameTh} ${course.substituteCoachLastNameTh}`
                              }}
                            </div>
                          </v-col>
                        </v-row>
                        <v-row dense v-if="course.type === 'date'">
                          <v-col>
                            <div>วันที่ชดเชย</div>
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
                <v-col class="font-bold text-lg"> ไฟล์แนบ </v-col>
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
                        <v-img
                          height="35"
                          width="26"
                          src="../../../assets/coachLeave/file-pdf.png"
                        />
                      </v-col>
                      <v-col class="px-2">
                        <span class="font-bold">{{ file.fileName }}</span
                        ><br />
                        <span class="text-caption"
                          >ขนาดไฟล์ :
                          {{ (file.size / 1000000).toFixed(2) }} MB</span
                        >
                      </v-col>
                      <!-- <v-col cols="auto" class="pl-2">
                        <v-btn @click="removeFile(index)" icon color="#ff6b81"><v-icon>mdi-close</v-icon></v-btn>
                      </v-col> -->
                    </v-row>
                  </v-card-text>
                </v-card>
                <v-card flat v-else :key="`${index}-file`">
                  <v-card-text
                    class="border-2 border-[#ff6b81] rounded-lg"
                    align="center"
                  >
                    ไม่พบไฟล์แนบ
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
              <v-col align="center" class="text-lg font-bold"
                >ความคิดเห็นเพิ่มเติม</v-col
              >
            </v-row>
            <v-row class="mb-3" dense>
              <v-col cols="12">
                <labelCustom text="เพิ่มความคิดเห็น"></labelCustom>
                <div>{{ show_comment_data.assessment.remark }}</div>
              </v-col>
            </v-row>
            <div v-if="show_comment_data.assessment.attachment.length > 0">
              <v-row dense>
                <v-col class="font-bold"> ไฟล์แนบ </v-col>
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
                      <v-img
                        height="35"
                        width="26"
                        src="../../../assets/coachLeave/file-pdf.png"
                      />
                    </v-col>
                    <v-col class="px-2">
                      <span class="font-bold">{{ file.originalFilesName }}</span
                      ><br />
                      <span class="text-caption"
                        >ขนาดไฟล์ :
                        {{ (file.filesSize / 1000000).toFixed(2) }} MB</span
                      >
                    </v-col>
                    <!-- <v-col cols="auto" class="pl-2">
                              <v-btn @click="removePotentialFile(index)" icon color="#ff6b81"><v-icon>mdi-close</v-icon></v-btn>
                              </v-col> -->
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
          <!-- {{ show_potential_data }} -->
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
                >ความคิดเห็นเพิ่มเติม</v-col
              >
            </v-row>
            <v-row class="mb-3" dense>
              <v-col>
                <labelCustom text="เพิ่มความคิดเห็น"></labelCustom>
                <div>{{ show_potential_data.potential.remark }}</div>
              </v-col>
            </v-row>
            <div
              v-if="
                show_potential_data.potential.attachmentPotential.length > 0
              "
            >
              <v-row dense>
                <v-col class="font-bold text-lg"> ไฟล์แนบ </v-col>
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
                      <v-img
                        height="35"
                        width="26"
                        src="../../../assets/coachLeave/file-pdf.png"
                      />
                    </v-col>
                    <v-col class="px-2">
                      <span class="font-bold">{{ file.originalFilesName }}</span
                      ><br />
                      <span class="text-caption"
                        >ขนาดไฟล์ :
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
    {{ SetFunctionsComputed }}
  </div>
</template>
  <script>
import calendarCoach from "@/components/calendar/calendarCoach.vue";
import headerPage from "../../../components/header/headerPage.vue";
import rowData from "../../../components/label/rowData.vue";
import imgCard from "../../../components/course/imgCard.vue";
import moment from "moment";
import labelCustom from "../../../components/label/labelCustom.vue";
import Swal from "sweetalert2";
import { dateFormatter } from "@/functions/functions";
import { mapActions, mapGetters } from "vuex";
import coachLeaveForm from "../../../components/coach_leave/coachLeaveForm.vue";
// import LoadingOverlay from '../../../components/loading/loadingOverlay.vue';
export default {
  name: "menageCourse",
  components: {
    calendarCoach,
    headerPage,
    rowData,
    imgCard,
    labelCustom,
    coachLeaveForm,
  },
  data: () => ({
    form_coach_leave: false,
    singleExpand: false,
    expanded: [],
    filter_course: "",
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
      { label: "รายการสอนวันนี้", value: "teaching list" },
      { label: "การสอนของฉัน", value: "my teaching" },
      { label: "ลงเวลาเพื่อขอลา", value: "request leave" },
    ],
    time_frame_list: [
      { label: "รายวัน", value: "day" },
      { label: "รายสัปดาห์", value: "week" },
      { label: "รายเดือน", value: "month" },
    ],
    time_frame: "day",
    menu: false,
    check_in_status_options: [
      {
        label: "ตรงเวลา",
        value: "punctual",
        color: "#58A144",
        bg_color: "#F0F9EE",
      },
      { label: "สาย", value: "late", color: "#FCC419", bg_color: "#FFF9E8" },
      { label: "ลา", value: "leave", color: "#43A4F5", bg_color: "#CFE2F3" },
      {
        label: "ลาฉุกเฉิน",
        value: "emergency leave",
        color: "#43A4F5",
        bg_color: "#CFE2F3",
      },
      { label: "ขาด", value: "absent", color: "#F03D3E", bg_color: "#F4CCCC" },
    ],
    select_date: `${new Date().getFullYear()}-${
      new Date().getMonth() + 1
    }-${new Date().getDate()}`,
    column: [
      { text: "วันที่", align: "center", sortable: false, value: "date" },
      {
        text: "ประเภทการลา",
        align: "center",
        sortable: false,
        value: "leaveType",
      },
      { text: "สถานะ", align: "center", sortable: false, value: "status" },
      { text: "", align: "right", sortable: false, value: "action" },
    ],
    previewUrl: null,
    periods: [
      { label: "ลาเต็มวัน", value: "full" },
      { label: "ลาช่วงเช้า", value: "morning" },
      { label: "ลาช่วงบ่าย", value: "afternoon" },
    ],
    leaveTypes: [
      { label: "ลาป่วย", value: "sick" },
      { label: "ลากิจ", value: "personal" },
      { label: "ลาพักร้อน", value: "take annual leave" },
    ],
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
  }),
  created() {
    this.user_detail = JSON.parse(localStorage.getItem("userDetail"));
    this.GetMyCourses({ coach_id: this.user_detail.account_id });
    this.GetLeavesByAccountId({ account_id: this.user_detail.account_id });
    this.GetCoachs();
    // if (this.$route.query.token) {
    //  this.loginShareToken(this.$route.query.token)
    // }
  },
  beforeMount() {
    if (this.$route.query.token) {
     this.loginShareToken(this.$route)
    }
  },
  mounted() {
    this.$store.dispatch("NavberUserModules/changeTitleNavber", "จัดการ");
    if (this.user_detail?.account_id) {
      this.GetProfileDetail(this.user_detail.account_id);
    }
  },
  watch: {
    tab: function () {
      this.GetMyCourses({ coach_id: this.user_detail.account_id });
    },
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
    }),
    SetFunctionsComputed() {
      return "";
    },
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
      console.log(start_date && end_date && period && leave_type && course);
      return !(start_date && end_date && period && leave_type && course);
    },
  },
  methods: {
    ...mapActions({
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
    }),
    SelectedStatus(status) {
      console.log(status);
      this.select_status = status;
    },
    GenDateStr(date) {
      const options = {
        year: "numeric",
        month: "short",
        day: "numeric",
        calendar: "buddhist",
        era: "short",
      };
      return date.toLocaleDateString("th-TH", options);
    },
    openFileSummary(file) {
      // console.log(file)
      window.open(file.attFilesUrl, "_blank");
    },
    openFile(file) {
      if (file.attId) {
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
      // console.log(date)
      return dateFormatter(new Date(date), "DD MT YYYYT");
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
        title: "ต้องการยกเลิกใบลาใช่หรือไม่ ?",
        showDenyButton: false,
        showCancelButton: true,
        cancelButtonText: "ยกเลิก",
        confirmButtonText: "ตกลง",
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
      console.log(file.attachmentFile);
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
      console.log(leave_data);
      this.show_leave_detail = true;
      this.edited_coach_leave_data = leave_data;
      this.GetAttachmentLeave({ coach_leave_id: leave_data.coachLeaveId });
    },
    closeDialogLeaveDetail() {
      this.show_leave_detail = false;
      this.edited_coach_leave_data = {};
      this.attachment_leave = [];
    },
    openFileSelector() {
      this.$refs.fileInput.click();
    },
    removeFile(index) {
      this.selected_files.splice(index, 1);
    },
    uploadFile() {
      const files = this.$refs.fileInput.files;
      console.log(files);
      if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          this.selected_files.push(files[i]);
        }
      }
    },
    filterMycourse() {
      if (this.filter_course) {
        return this.my_courses.filter(
          (v) => v.course_id === this.filter_course
        );
      } else {
        return this.my_courses;
      }
    },
  },
};
</script>
  
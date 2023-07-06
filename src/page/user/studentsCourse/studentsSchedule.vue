<template>
  <v-container>
    {{ setFunctions }}
    <loading-overlay :loading="student_is_loading"></loading-overlay>
    <div>
      <label class="text-xl font-bold">ข้อมูลตารางเรียน</label>
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
                >คอร์สของฉัน</label
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
                >ตารางเรียน</label
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
              class="rounded-lg font-bold flex justify-center align-center pa-2"
            >
              คอร์สที่จอง
            </v-card-text>
          </v-card>
        </v-col>

        <!-- <v-col cols="4" v-if="$route.params.action == 'studentsSchedule'"> ตารางเรียน </v-col>
        <v-col cols="4" v-if="$route.params.action == 'MyBooking'"> คอร์สที่จอง </v-col> -->
      </v-row>

      <!-- PAGE 1 -->
      <v-expand-x-transition transition="scale-transition">
        <!-- <div v-if="type_selected == 'MyCourse'"> -->
        <div v-if="$route.params.action == 'MyCourse'">
          <!-- Role Parent -->
          <div v-if="data_local.roles.includes('R_4')">
            <v-row dense class="mb-3">
              <v-col cols="12">
                <v-autocomplete
                  v-model="search_course_detail"
                  :items="students"
                  item-text="studentFirstnameTh"
                  item-value="studentId"
                  dense
                  filled
                  hide-details
                  clearable
                  label="เลือกนักเรียนของคุณได้ที่นี้"
                  @change="searchStudentCourse(search_course_detail)"
                ></v-autocomplete>
              </v-col>
            </v-row>
            <div v-for="(item, index) in my_course" :key="index">
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
                    <v-col cols="12" sm="2">
                      <v-img
                        max-height="180"
                        :src="
                          item.courseImg
                            ? showImg(item.courseImg)
                            : require(`@/assets/course/default_course_img.svg`)
                        "
                      ></v-img>
                    </v-col>
                    <!-- detail -->
                    <v-col cols="12" sm="7">
                      <v-row dense>
                        <v-col class="text-lg font-bold">
                          {{
                            item.courseNameTh == "" ? "-" : item.courseNameTh
                          }}
                          ({{
                            item.courseNameEng == "" ? "-" : item.courseNameEng
                          }})
                        </v-col>
                      </v-row>
                      <v-row dense>
                        <v-col class="text-slate-400">
                          <span class="mdi mdi-account">โค้ช :</span>
                          {{ item.coachName == null ? "-" : item.coachName }}
                        </v-col>
                      </v-row>
                      <v-row dense>
                        <v-col class="text-slate-400">
                          <span class="mdi mdi-account">ผู้เรียน :</span>
                          {{
                            !item.student.firstNameTh
                              ? "-"
                              : item.student.firstNameTh
                          }}
                          {{
                            !item.student.lastNameTh
                              ? "-"
                              : item.student.lastNameTh
                          }}
                          <!-- {{ item.student.firstNameTh }} -->
                          <!-- {{ !my_course_detail.coachName? '-' :  my_course_detail.coachName}} -->
                        </v-col>
                      </v-row>
                      <v-row dense>
                        <v-col class="text-slate-400">
                          <span class="mdi mdi-account">ทำรายการโดย :</span>
                          <!-- {{ !item.createdBy.firstNameTh? "-" : item.createdBy.firstNameTh }}  {{ !item.createdBy.lastNameTh? "-" : item.createdBy.lastNameTh }}  -->
                          {{
                            !item.createdBy ? "-" : item.createdBy.firstNameTh
                          }}
                          {{
                            !item.createdBy ? "-" : item.createdBy.lastNameTh
                          }}
                        </v-col>
                      </v-row>
                      <v-row dense>
                        <v-col>
                          <v-chip color="#F9B320" dark>
                            {{
                              `${item.day_name} ${item.period.start} - ${item.period.end}น.`
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
                      <!-- {{ item.courseNameEn }} -->
                      <v-progress-circular
                        :rotate="-90"
                        :size="90"
                        :width="10"
                        :value="(item.dates.count / item.dates.totalDay) * 100"
                        color="#ff6b81"
                      >
                        {{ item.dates.count }} / {{ item.dates.totalDay }}
                        <br />ครั้ง
                      </v-progress-circular>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </div>
          </div>
          <!-- Role Student -->
          <div v-if="data_local.roles.includes('R_5')">
            <v-card v-if="student_data.length == 0">
              <v-card-text
                class="text-center border-2 border-[#ff6b81] rounded-lg"
              >
                <span class="text-lg font-bold">
                  <v-icon color="#ff6b81">mdi-alert-outline</v-icon>
                  ไม่พบข้อมูลคอร์สเรียน
                </span>
              </v-card-text>
            </v-card>
            <div
              v-else
              v-for="(item, index) in student_data.filter((v) => !v.comp)"
              :key="index"
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
                    <!-- <v-col
                      style="
                        display: block;
                        margin-left: auto;
                        margin-right: auto;
                        width: 100%;
                        margin-top: 10%;
                      "
                    > -->
                    <v-img
                      :src="
                        item.courseImg
                          ? showImg(item.courseImg)
                          : require(`@/assets/course/default_course_img.svg`)
                      "
                      class="w-full h-full rounded-lg"
                      cover
                      height="200"
                    ></v-img>
                    <!-- </v-col> -->
                  </v-col>
                  <!-- detail -->
                  <v-col cols="12" sm="3">
                    <v-row dense>
                      <v-col class="text-lg font-bold">
                        {{ item.courseNameTh == "" ? "-" : item.courseNameTh }}
                        ({{
                          item.courseNameEng == "" ? "-" : item.courseNameEng
                        }})
                      </v-col>
                    </v-row>
                    <v-row dense>
                      <v-col class="text-slate-400">
                        <span class="mdi mdi-account">โค้ช :</span>
                        {{ item.coachName == null ? "-" : item.coachName }}
                      </v-col>
                    </v-row>
                    <v-row dense>
                      <v-col class="text-slate-400">
                        <span class="mdi mdi-account">ผู้เรียน :</span>
                        {{
                          !item.student.firstNameTh
                            ? "-"
                            : item.student.firstNameTh
                        }}
                        {{
                          !item.student.lastNameTh
                            ? "-"
                            : item.student.lastNameTh
                        }}
                      </v-col>
                    </v-row>
                    <v-row dense>
                      <v-col class="text-slate-400">
                        <span class="mdi mdi-account">ทำรายการโดย :</span>

                        {{ !item.createdBy ? "-" : item.createdBy.firstNameTh }}
                        {{ !item.createdBy ? "-" : item.createdBy.lastNameTh }}
                      </v-col>
                    </v-row>
                    <v-row dense>
                      <v-col>
                        <v-chip color="#F9B320" dark>
                          {{
                            `${item.day_name} ${item.period.start} - ${item.period.end}น.`
                          }}
                        </v-chip>
                      </v-col>
                    </v-row>
                  </v-col>
                  <!-- circle -->
                  <v-col cols="12" sm="4" class="d-flex align-end justify-end">
                    <!-- {{ item.courseNameEn }} -->
                    <v-progress-circular
                      :rotate="-90"
                      :size="90"
                      :width="10"
                      :value="(item.dates.count / item.dates.totalDay) * 100"
                      color="#ff6b81"
                    >
                      {{ item.dates.count }} / {{ item.dates.totalDay }}
                      <br />ครั้ง
                    </v-progress-circular>
                  </v-col>
                </v-row>
                <!-- </v-card-text> -->
              </v-card>
            </div>
          </div>
        </div>
      </v-expand-x-transition>

      <!-- PAGE 2 -->
      <v-expand-x-transition transition="scale-transition">
        <!-- <div v-if="type_selected == 'MySchedule'"> -->
        <div v-if="$route.params.action == 'MySchedule'">
          <!-- Role parent -->
          <div v-if="data_local.roles.includes('R_4')">
            <v-row class="mb-3">
              <v-col cols="12">
                <v-autocomplete
                  v-model="search_course"
                  :items="students"
                  item-text="studentFirstnameTh"
                  item-value="studentId"
                  dense
                  filled
                  clearable
                  hide-details
                  label="เลือกนักเรียนของคุณได้ที่นี้"
                  @change="searchStudentCourse(search_course)"
                ></v-autocomplete>
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
          <div v-if="data_local.roles.includes('R_5')">
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
            <diV>
              <template>
                <calendarStudent
                  :events="itemTime.dates"
                  :type="time_frame"
                ></calendarStudent>
              </template>
            </diV>
          </div>
        </div>
      </v-expand-x-transition>

      <!-- PAGE 3 -->
      <v-expand-x-transition transition="scale-transition">
        <!-- <div v-if="type_selected == 'MyBooking'"> -->
        <div v-if="$route.params.action == 'MyBooking'">
          <!-- <pre>{{ profile_booked }}</pre> -->
          <!-- Role Parent -->
          <div v-if="data_local.roles.includes('R_4')">
            <v-row class="mb-3">
              <v-col cols="12">
                <v-autocomplete
                  v-model="search_booked"
                  :items="students"
                  item-text="studentFirstnameTh"
                  item-value="studentId"
                  dense
                  filled
                  hide-details
                  label="เลือกนักเรียนของคุณได้ที่นี้"
                  @change="searchStudentBooked(search_booked)"
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-card-text
              class="pa-5 text-center border-2 border-[#ff6b81] rounded-lg"
              v-if="ReserveList().length == 0"
            >
              <span class="text-lg font-bold">
                <v-icon color="#ff6b81">mdi-alert-outline</v-icon>
                ไม่พบข้อมูลการจอง
              </span>
            </v-card-text>
            <div v-else>
              <v-card
                v-for="(item_booked, index_booked) in ReserveList()"
                :key="`${index_booked}-reserve`"
                @click="showCard(index, item_booked)"
                class="mb-3 cursor-pointer"
              >
                <v-card-text>
                  <div>
                    <v-row dense>
                      <!-- img -->
                      <v-col cols="12" sm="2">
                        <img
                          :src="
                            item_booked.courseImg
                              ? item_booked.courseImg
                              : `../../../assets/student_course/download.png`
                          "
                        />
                      </v-col>
                      <!-- detail -->
                      <v-col cols="12" sm="6">
                        <v-col class="text-lg font-bold">
                          {{
                            item_booked.courseNameTh == ""
                              ? "-"
                              : item_booked.courseNameTh
                          }}
                          ({{
                            item_booked.courseNameEn == ""
                              ? "-"
                              : item_booked.courseNameEn
                          }})
                        </v-col>
                        <v-col class="text-slate-400">
                          <span class="mdi mdi-account">โค้ช :</span>
                          {{
                            !item_booked.coachData.data.data.firstNameTh
                              ? "-"
                              : item_booked.coachData.data.data.firstNameTh
                          }}
                          {{
                            !item_booked.coachData.data.data.lastNameTh
                              ? "-"
                              : item_booked.coachData.data.data.lastNameTh
                          }}
                        </v-col>
                        <v-col class="text-slate-400">
                          <span class="mdi mdi-account">ผู้เรียน :</span>
                          {{
                            !item_booked.StudentData.data.data.firstNameTh
                              ? "-"
                              : item_booked.StudentData.data.data.firstNameTh
                          }}
                          {{
                            !item_booked.StudentData.data.data.lastNameTh
                              ? "-"
                              : item_booked.StudentData.data.data.lastNameTh
                          }}
                        </v-col>

                        <v-col class="text-slate-400">
                          <span class="mdi mdi-account">ทำรายการโดย :</span>

                          {{
                            !item_booked.createdByData.data.data.firstNameTh
                              ? "-"
                              : item_booked.createdByData.data.data.firstNameTh
                          }}
                          {{
                            !item_booked.createdByData.data.data.lastNameTh
                              ? "-"
                              : item_booked.createdByData.data.data.lastNameTh
                          }}
                        </v-col>

                        <v-col>
                          <v-chip color="#F9B320" dark>
                            {{ item_booked.day_name }}
                            {{ item_booked.start }} - {{ item_booked.end }} น.
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
                            <v-chip color="#d9ead3" text-color="green">
                              <span>{{
                                item_booked.status === "waiting"
                                  ? "รอการติดต่อ"
                                  : item_booked.status
                              }}</span>
                            </v-chip>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                  </div>
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
                            `${course_data.course_name_th} (${course_data.course_name_en})`
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
                          {{ course_data.course_hours }} ชม. / ครั้ง
                        </v-col>

                        <v-col cols="12" md="12" sm="12" class="text-lg">
                          {{ course_data.detail }}
                        </v-col>
                        <v-col cols="12" md="12" sm="12">
                          <div class="mt-8">
                            <label-custom
                              text="Music performance"
                            ></label-custom>
                          </div>
                          <v-divider class=""></v-divider>
                          <span class="pa-2">
                            {{ course_data.music_performance }}
                          </span>
                        </v-col>
                        <v-col cols="12" md="12" sm="12">
                          <div class="mt-8">
                            <label-custom text="Certification"></label-custom>
                          </div>
                          <v-divider class=""></v-divider>
                          <span class="pa-2">
                            {{ course_data.catification }}
                          </span>
                        </v-col>
                      </v-row>
                    </v-card>
                  </div>
                </v-card-text>
              </v-card>
            </div>
          </div>
          <!-- Role student -->
          <div v-if="data_local.roles.includes('R_5')">
            <v-card-text
              class="pa-5 text-center border-2 border-[#ff6b81] rounded-lg"
              v-if="ReserveList().length == 0"
            >
              <span class="text-lg font-bold">
                <v-icon color="#ff6b81">mdi-alert-outline</v-icon>
                ไม่พบข้อมูลการจอง
              </span>
            </v-card-text>
            <!-- <v-card flat v-if="ReserveList().length == 0">
              <v-card-text
                class="pa-2 text-center border-2 border-[#ff6b81] rounded-lg"
              >
                <span class="text-lg font-bold">
                  <v-icon color="#ff6b81">mdi-alert-outline</v-icon>
                  ไม่พบข้อมูลการจอง
                </span>
              </v-card-text>
            </v-card> -->
            <div v-else>
              <v-card
                v-for="(item_booked, index_booked) in ReserveList()"
                :key="`${index_booked}-reserve`"
                @click="showCard(index, item_booked)"
                class="my-5 cursor-pointer"
              >
                <v-card-text>
                  <div>
                    <v-row dense>
                      <!-- img -->
                      <v-col cols="12" sm="2">
                        <img
                          :src="
                            item_booked.courseImg
                              ? item_booked.courseImg
                              : `../../../assets/student_course/download.png`
                          "
                        />
                      </v-col>
                      <!-- detail -->
                      <v-col cols="12" sm="6">
                        <v-col class="text-lg font-bold">
                          {{
                            item_booked.courseNameTh == ""
                              ? "-"
                              : item_booked.courseNameTh
                          }}
                          ({{
                            item_booked.courseNameEn == ""
                              ? "-"
                              : item_booked.courseNameEn
                          }})
                        </v-col>
                        <v-col class="text-slate-400">
                          <span class="mdi mdi-account">โค้ช :</span>
                          {{
                            !item_booked.coachData.data.data.firstNameTh
                              ? "-"
                              : item_booked.coachData.data.data.firstNameTh
                          }}
                          {{
                            !item_booked.coachData.data.data.lastNameTh
                              ? "-"
                              : item_booked.coachData.data.data.lastNameTh
                          }}
                        </v-col>
                        <v-col class="text-slate-400">
                          <span class="mdi mdi-account">ผู้เรียน :</span>
                          {{
                            !item_booked.StudentData.data.data.firstNameTh
                              ? "-"
                              : item_booked.StudentData.data.data.firstNameTh
                          }}
                          {{
                            !item_booked.StudentData.data.data.lastNameTh
                              ? "-"
                              : item_booked.StudentData.data.data.lastNameTh
                          }}
                        </v-col>

                        <v-col class="text-slate-400">
                          <span class="mdi mdi-account">ทำรายการโดย :</span>

                          {{
                            !item_booked.createdByData.data.data.firstNameTh
                              ? "-"
                              : item_booked.createdByData.data.data.firstNameTh
                          }}
                          {{
                            !item_booked.createdByData.data.data.lastNameTh
                              ? "-"
                              : item_booked.createdByData.data.data.lastNameTh
                          }}
                        </v-col>

                        <v-col>
                          <v-chip color="#F9B320" dark>
                            {{ item_booked.day_name }} {{ item_booked.start }} -
                            {{ item_booked.end }} น.
                          </v-chip>
                        </v-col>
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
                            <v-chip color="#d9ead3" text-color="green">
                              <span>{{
                                item_booked.status === "waiting"
                                  ? "รอการติดต่อ"
                                  : item_booked.status
                              }}</span>
                            </v-chip>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                  </div>
                  <div
                    v-if="activeCard === index && !course_is_loading"
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
                            `${course_data.course_name_th} (${course_data.course_name_en})`
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
                          {{ course_data.course_hours }} ชม. / ครั้ง
                        </v-col>

                        <v-col cols="12" md="12" sm="12" class="text-lg">
                          <div v-html="course_data.detail"></div>
                        </v-col>
                        <v-col cols="12" md="12" sm="12">
                          <div class="mt-8">
                            <label-custom
                              text="Music performance"
                            ></label-custom>
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
            </div>
          </div>
        </div>
      </v-expand-x-transition>
    </div>
  </v-container>
</template>
  
  <script>
import { mapActions, mapGetters } from "vuex";
import calendarStudent from "../../../components/calendar/calendarStudent.vue";
import labelCustom from "@/components/label/labelCustom.vue";
import loadingOverlay from "../../../components/loading/loadingOverlay.vue";

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
    time_frame_list: [
      { label: "รายวัน", value: "day" },
      { label: "รายสัปดาห์", value: "week" },
      { label: "รายเดือน", value: "month" },
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
    user_details: localStorage.getItem("userDetail"),
  }),
  beforeCreate() {
    localStorage.removeItem("userRelationsAccountId");
  },
  created() {
    this.userRelationsAccountId = localStorage.getItem(
      "userRelationsAccountId"
    );
    // if (this.$route.query.token) {
    //  this.loginShareToken(this.$route.query.token)
    // }
    this.user_detail = JSON.parse(localStorage.getItem("userDetail"));
    // this.GetStudentData(this.user_detail.account_id);
  },

  beforeMount() {
    if (this.$route.query.token) {
      this.loginShareToken(this.$route);
    }
  },

  beforeUpdate() {
    this.$store.dispatch(
      "NavberUserModules/changeTitleNavber",
      "ข้อมูลตารางเรียน"
    );
  },
  mounted() {
    this.$store.dispatch("MyCourseModules/GetMyCourseArrayEmpty");

    if (localStorage.getItem("userRelationsAccountId")) {
      console.log(localStorage.getItem("userRelationsAccountId"));
    } else if (this.user_detail.roles.includes("R_5")) {
      this.GetStudentData(this.user_detail.account_id);
    }
    // else {
    //   // this.GetStudentData(null);
    //   this.GetStudentData(this.user_detail.account_id);
    // }
  },

  methods: {
    ...mapActions({
      GetStudentData: "MyCourseModules/GetStudentData",
      GetProfileBooked: "MyCourseModules/GetProfileBooked",
      GetAll: "ProfileModules/GetAll",
      GetStudentReserve: "MyCourseModules/GetStudentReserve",
      loginShareToken: "loginModules/loginShareToken",
      //COURSE
      GetCourse: "CourseModules/GetCourse",
    }),
    prev() {
      this.$refs.calendar.prev();
      console.log(this.$refs.calendar.title);
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
      // set activeCard to the clicked index
    },

    async searchStudentCourse(studentId) {
      if (studentId !== null) {
        this.$store.dispatch("MyCourseModules/GetMyCourseArrayEmpty");
        console.log("item1", studentId);
        await this.GetStudentData(studentId);
        console.log("mycourse1", this.student_data);
      } else {
        console.log("this.user_detail.account_id", this.user_detail.account_id);
        this.GetStudentData(this.user_detail.account_id);
      }
    },

    async searchStudentSchadule(studentId) {
      this.$store.dispatch("MyCourseModules/GetMyCourseArrayEmpty");

      console.log("item", studentId);
      await this.GetStudentData(studentId);
    },

    async searchStudentBooked(studentId) {
      console.log("item", studentId);
      await this.GetProfileBooked(studentId);
    },
    ReserveList() {
      let reserveList = [];
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
      // this.student_reserve.forEach((reserve) => {
      //   if (
      //     reserveList.filter(
      //       (v) =>
      //         v.coachId == reserve.coachId &&
      //         v.courseId == reserve.courseId &&
      //         v.dayOfWeekId === reserve.dayOfWeekId &&
      //         v.timeId === reserve.timeId &&
      //         v.studentId === reserve.studentId
      //     ).length === 0
      //   ) {
      //     reserveList.push(reserve);
      //   }
      // });
      // console.log("student_reserve :", this.student_reserve);
      return reserveList;
    },
    dayOfWeekName(days) {
      const daysOfWeek = [
        "อาทิตย์",
        "จันทร์",
        "อังคาร",
        "พุธ",
        "พฤหัสบดี",
        "ศุกร์",
        "เสาร์",
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

  beforeDestroy() {
    localStorage.removeItem("userRelationsAccountId");
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
      my_course: "MyCourseModules/getMyCourse",
    }),
    // studentData: {
    //   get() {
    //     return this.student_data;
    //   },
    // },
    setFunctions() {
      if (this.user_detail.roles.includes("R_5")) {
        // this.GetStudentReserve(this.user_detail.account_id);
        this.GetAll(this.user_detail.account_id);
      }
      this.GetProfileBooked(this.user_detail.account_id);
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
  },
};
</script>
  
  <style scoped>
.v-progress-circular {
  margin: 1rem;
}
</style>
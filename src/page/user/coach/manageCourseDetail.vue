<template>
  <v-app>
    {{ setFunctios }}
    <v-container>
      <v-card flat>
        <v-card-text class="bg-[#FBF3F5] border">
          <v-row>
            <!-- {{ course_data }} -->
            <v-col cols="auto">
              <v-img
                class="rounded-lg"
                :src="
                  course_data.course_img || course_data.course_img !== ''
                    ? course_data.course_img
                    : require(`@/assets/course/default_course_img.svg`)
                "
                max-height="120"
                max-width="120"
              ></v-img>
            </v-col>
            <v-col>
              <v-row>
                <v-col cols="12" sm>
                  <div class="text-md font-bold">
                    {{ course_data.category_name_th }}
                  </div>
                </v-col>
                <v-col cols="12" sm>
                  <div class="text-md font-bold">
                    {{ GenDate($route.params.date) }}
                  </div>
                </v-col>
              </v-row>
              <v-row dense>
                <v-col cols="12" sm class="pa-0">
                  <rowData mini icon="mdi-bookshelf"
                    >คอร์สเรียน : {{ course_data.course_name_th }}</rowData
                  >
                </v-col>
                <!-- <v-col cols="12" sm="4"  class="pa-0"> 
                    <rowData mini  icon=" mdi-account-box-multiple">แพ็คเกจ : Family</rowData>
                </v-col> -->
                <v-col cols="12" sm class="pa-0">
                  <rowData mini icon="mdi-clock-outline"
                    >เวลาสอน {{ course_data.course_hours }} ชั่วโมง</rowData
                  >
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <v-row dense>
        <v-col class="text-md font-bold"> ลงเวลาเข้าสอน </v-col>
      </v-row>
      <v-row dense class="mb-3">
        <v-col align="center">
          <!-- {{coach_check_in}} -->
          <v-btn
            @click="checkIn()"
            depressed
            dense
            :disabled="CheckInByDate()"
            :color="coach_check_in.checkInCoachId ? '#E6E6E6' : '#ff6b81'"
            class="w-full rounded-lg"
            :loading="coach_check_in_is_loading"
            :class="
              coach_check_in.checkInCoachId ? 'green--text' : 'white--text'
            "
          >
            <template v-if="coach_check_in.checkInCoachId">
              <v-icon class="mr-2">mdi-check-circle</v-icon> เข้าสอน
            </template>
            <template v-else>
              <v-icon class="mr-2">mdi-clock-edit-outline</v-icon>
              กดเพื่อลงเวลาเข้าสอน
            </template>
          </v-btn>
        </v-col>
      </v-row>
      <!-- <pre>{{student_check_in}}</pre> -->
      <v-tabs class="mb-3" v-model="tab" color="#ff6b81" grow>
        <v-tab class="border-b-2" href="#check in"> เช็คชื่อ </v-tab>
        <v-tab
          :disabled="student_check_in.length == 0"
          class="border-b-2"
          href="#assess students"
        >
          ประเมินนักเรียน
        </v-tab>
        <v-tab
          :disabled="student_check_in.length == 0"
          class="border-b-2"
          href="#teaching summary"
        >
          บันทึกสรุปการสอน
        </v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item value="check in">
          <v-row class="mb-3" dense v-if="cpo_options.length > 1">
            <v-col
              cols="12"
              sm="4"
              v-for="(cpo, index_cpo) in cpo_options"
              :key="`${index_cpo}-cpo`"
            >
              <v-btn
                class="w-full"
                :dark="package_name_filter === cpo"
                :color="package_name_filter === cpo ? '#ff6b81' : ''"
                dense
                depressed
                @click="filterPackage(cpo)"
                >{{ cpo }}</v-btn
              >
            </v-col>
          </v-row>
          <v-card elevation="1" class="mb-2">
            <v-form v-model="validate_form" ref="validate_form">
              <v-data-table
                class="header-table border"
                :items="
                  coach_check_in.checkInCoachId
                    ? student_check_in.filter((v) =>
                        v.cpo?.packageName
                          ? v.cpo.packageName === package_name_filter
                          : true
                      )
                    : []
                "
                item-key="no"
                :expanded.sync="expanded_index"
                :headers="headers"
              >
                <template v-slot:[`item.actions`]="{ item }">
                  <div class="pt-5">
                    <v-select
                      v-model="item.status"
                      required
                      :rules="rules.status_text"
                      :items="FilterStatusCheckIn(item)"
                      outlined
                      dense
                      item-text="label"
                      item-value="value"
                      @change="selectCheckInStatus(item, $event)"
                    >
                      <template #item="{ item }">
                        <v-list-item-content>
                          <v-list-item-title :style="`color:${item.color}`">{{
                            item.label
                          }}</v-list-item-title>
                        </v-list-item-content>
                      </template>
                      <template #selection="{ item }">
                        <v-list-item-title :style="`color:${item.color}`">{{
                          item.label
                        }}</v-list-item-title>
                      </template>
                    </v-select>
                  </div>
                </template>
                <template v-slot:[`item.package`]="{ item }">
                  <span class="font-semibold" v-if="item?.cpo?.packageName">
                    {{ `${item.cpo.packageName}` }}</span
                  >
                  <span class="font-semibold" v-else> - </span>
                </template>
                <template v-slot:[`item.class_time`]="{ item }">
                  {{ `${item.countCheckIn}/${item.totalDay}` }}
                </template>
                <template v-slot:expanded-item="{ headers, item }">
                  <!-- <pre>{{ item }}</pre> -->
                  <td class="pa-2" :colspan="headers.length" align="center">
                    <v-row dense>
                      <v-col cols="12" sm="2">วันเรียนชดเชย</v-col>
                      <v-col cols="12" sm="4">
                        <v-menu
                          v-model="item.menu_compensation_date"
                          :close-on-content-click="false"
                          transition="scale-transition"
                          min-width="auto"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              dense
                              outlined
                              :rules="rules.compensation_date"
                              v-model="item.compensation_date_str"
                              readonly
                              placeholder="เลือกวันที่ชดเชย"
                              v-bind="attrs"
                              v-on="on"
                            >
                              <template v-slot:append>
                                <v-icon
                                  :color="
                                    item.compensationDate ? '#FF6B81' : ''
                                  "
                                  >mdi-calendar</v-icon
                                >
                              </template>
                            </v-text-field>
                          </template>
                          <v-date-picker
                            :min="new Date($route.params.date).toISOString()"
                            @input="inputDate($event, item)"
                            v-model="item.compensationDate"
                            locale="th-TH"
                          ></v-date-picker>
                        </v-menu>
                      </v-col>
                      <v-col cols="auto" class="pr-2">
                        <v-text-field
                          outlined
                          dense
                          :style="`width:${width()}px;`"
                          style="position: absolute; display: block; z-index: 4"
                          @focus="
                            SelectedStartDate(
                              $event,
                              item.compensationStartTime
                            )
                          "
                          :rules="rules.start_time"
                          :value="genTime(item.compensationStartTime)"
                        >
                        </v-text-field>
                        <TimePicker
                          class="time-picker-hidden"
                          :minuteStep="30"
                          placeholder="เวลาเริ่ม"
                          :style="`width:${width()}px;`"
                          :class="item.start_time ? 'active' : ''"
                          format="HH:mm"
                          v-model="item.compensationStartTime"
                        >
                        </TimePicker>
                      </v-col>
                      <v-col cols="auto" class="pl-2">
                        <v-text-field
                          outlined
                          dense
                          :style="`width:${width()}px;`"
                          style="position: absolute; display: block; z-index: 4"
                          @focus="
                            SelectedStartDate($event, item.compensationEndTime)
                          "
                          :rules="rules.end_time"
                          :value="genTime(item.compensationEndTime)"
                        >
                        </v-text-field>
                        <TimePicker
                          class="time-picker-hidden"
                          :minuteStep="30"
                          :style="`width:${width()}px;`"
                          format="HH:mm"
                          :class="item.end_time ? 'active' : ''"
                          placeholder="เวลาสิ้นสุด"
                          v-model="item.compensationEndTime"
                        ></TimePicker>
                      </v-col>
                    </v-row>
                  </td>
                </template>
                <template v-slot:no-data>
                  <v-row dense>
                    <v-col align="center"> ไม่พบข้อมูลในตาราง </v-col>
                  </v-row>
                </template>
              </v-data-table>
            </v-form>
          </v-card>
          <v-row>
            <v-col align="right">
              <v-btn
                :class="$vuetify.breakpoint.smAndUp ? 'btn-size-lg' : 'w-full'"
                v-if="student_check_in.length > 0"
                dense
                outlined
                @click="CheckInStudents(student_check_in)"
                color="#ff6b81"
                >บันทึก</v-btn
              >
            </v-col>
          </v-row>
        </v-tab-item>
        <v-tab-item value="assess students">
          <!-- TAB ASSESS -->
          <v-card class="mb-2" flat>
            <v-card-text class="border bg-[#F6F0F1]">
              <v-row>
                <v-col cols="12" sm="6" class="pr-1">
                  <v-btn
                    depressed
                    class="w-full"
                    :class="
                      tab_evaluate === 'evaluate_students' ? 'white--text' : ''
                    "
                    :color="
                      tab_evaluate === 'evaluate_students' ? '#ff6b81' : ''
                    "
                    @click="tab_evaluate = 'evaluate_students'"
                  >
                    ประเมินนักเรียน
                  </v-btn>
                </v-col>
                <v-col cols="12" sm="6" class="pl-1">
                  <v-badge
                    v-if="
                      student_check_in.filter((v) => v.type === 'potential')
                        .length > 0
                    "
                    size="x-large"
                    class="w-full"
                    :content="
                      student_check_in.filter((v) => v.type === 'potential')
                        .length
                    "
                    color="red"
                  >
                    <v-btn
                      depressed
                      :disabled="
                        !student_check_in.filter((v) => v.type === 'potential')
                          .length > 0
                      "
                      class="w-full"
                      :class="
                        tab_evaluate === 'learners_potential'
                          ? 'white--text'
                          : ''
                      "
                      :color="
                        tab_evaluate === 'learners_potential' ? '#ff6b81' : ''
                      "
                      @click="tab_evaluate = 'learners_potential'"
                    >
                      ประเมินศักยภาพผู้เรียน
                    </v-btn>
                  </v-badge>
                  <v-btn
                    v-else
                    depressed
                    :disabled="
                      !student_check_in.filter((v) => v.potential).length > 0
                    "
                    class="w-full"
                    :class="
                      tab_evaluate === 'learners_potential' ? 'white--text' : ''
                    "
                    :color="
                      tab_evaluate === 'learners_potential' ? '#ff6b81' : ''
                    "
                    @click="tab_evaluate = 'learners_potential'"
                  >
                    ประเมินศักยภาพผู้เรียน
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
          <!-- DETAIL :: EVALUATE -->
          <div v-if="tab_evaluate === 'evaluate_students'">
            <v-form ref="learners_form" v-model="learners_form">
              <template
                v-if="
                  student_check_in.filter(
                    (v) =>
                      v.type === 'general' &&
                      (v.status == 'punctual' || v.status == 'late')
                  ).length > 0
                "
              >
                <v-card
                  class="mb-2"
                  flat
                  style="border: 1px solid #999"
                  v-for="(student, index_student) in student_check_in.filter(
                    (v) =>
                      v.type === 'general' &&
                      (v.status == 'punctual' || v.status == 'late')
                  )"
                  :key="`${index_student}-student`"
                >
                  <!-- <pre>{{ student.checkInStudentId }}</pre> -->
                  <v-card-text>
                    <v-row class="d-flex align-center">
                      <v-col cols="12" sm class="text-lg font-bold">
                        {{ student.no }} {{ student.fullname }}
                      </v-col>
                      <v-col
                        cols="12"
                        sm="5"
                        class="pa-1 text-md text-[#999999]"
                      >
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
                    <v-row class="d-flex align-center">
                      <v-col cols="12" sm="4">
                        <labelCustom text="ระดับพัฒนาการ"></labelCustom>
                        <v-select
                          outlined
                          dense
                          :rules="rules.evolution"
                          v-model="student.assessment.evolution"
                          :items="evolution_options"
                        >
                          <template v-slot:item="{ item }">
                            <v-list-item-content>
                              <v-list-item-title>
                                <v-rating
                                  readonly
                                  :length="item.num_value"
                                  :value="item.num_value"
                                  color="#ff6b81"
                                ></v-rating>
                              </v-list-item-title>
                            </v-list-item-content>
                          </template>
                          <template v-slot:selection="{ item }">
                            <v-rating
                              readonly
                              :length="item.num_value"
                              :value="item.num_value"
                              color="#ff6b81"
                            ></v-rating>
                          </template>
                        </v-select>
                        <!-- <v-rating
                        v-model="student.assessment.rating_evolution"
                        background-color="pink lighten-3"
                        @input="CheckRating($event, student.checkInStudentId, 'assessment_evolution')"
                        color="pink"
                        large
                        length="5"
                        :min="2"
                      ></v-rating> -->
                      </v-col>
                      <v-col cols="12" sm="4">
                        <labelCustom text="ระดับความสนใจ"></labelCustom>
                        <v-select
                          outlined
                          dense
                          :rules="rules.interest"
                          v-model="student.assessment.interest"
                          :items="interest_options"
                        >
                          <template v-slot:item="{ item }">
                            <v-list-item-content>
                              <v-list-item-title>
                                <v-rating
                                  readonly
                                  :length="item.num_value"
                                  :value="item.num_value"
                                  color="#ff6b81"
                                ></v-rating>
                              </v-list-item-title>
                            </v-list-item-content>
                          </template>
                          <template v-slot:selection="{ item }">
                            <v-rating
                              readonly
                              :length="item.num_value"
                              :value="item.num_value"
                              color="#ff6b81"
                            ></v-rating>
                          </template>
                        </v-select>
                        <!-- <v-rating
                        v-model="student.assessment.rating_interest"
                        background-color="pink lighten-3" 
                        @input="CheckRating($event, student.checkInStudentId, 'assessment_interest')"
                        color="pink"
                        large
                        length="5"
                      ></v-rating> -->
                      </v-col>
                      <v-col cols="12" sm="auto">
                        <v-btn
                          outlined
                          class="text-sm w-full"
                          color="#ff6b81"
                          @click="
                            selectStudentComment(student.checkInStudentId)
                          "
                        >
                          แสดงความคิดเห็น
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </template>
              <v-card v-else outlined class="my-3">
                <v-card-text class="text-lg font-bold" align="center">
                  ไม่พบข้อมูล
                </v-card-text>
              </v-card>
              <v-row>
                <v-col cols="12" sm align="right">
                  <v-btn
                    color="#ff6b81"
                    @click="clearAssessment()"
                    outlined
                    dense
                    :class="
                      $vuetify.breakpoint.smAndUp ? 'btn-size-lg' : 'w-full'
                    "
                  >
                    ล้างข้อมูล
                  </v-btn>
                </v-col>
                <v-col cols="12" sm="auto">
                  <v-btn
                    color="#ff6b81"
                    @click="saveAssessmentStudent()"
                    dark
                    depressed
                    dense
                    :class="
                      $vuetify.breakpoint.smAndUp ? 'btn-size-lg' : 'w-full'
                    "
                  >
                    บันทึก
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </div>
          <!-- DETAIL :: POTENTIAl -->
          <div v-else>
            <v-form ref="potential_form" v-model="potential_form">
              <v-card
                class="mb-2"
                flat
                style="border: 1px solid #999"
                v-for="(student, index_student) in student_check_in.filter(
                  (v) => v.potential
                )"
                :key="`${index_student}-student`"
              >
                <v-card-text>
                  <!-- <pre>{{ student.potential }}</pre> -->
                  <v-row class="d-flex align-center">
                    <v-col cols="12" sm class="text-lg font-bold">
                      {{ student.no }} {{ student.fullname }}
                    </v-col>
                    <v-col cols="12" sm="5" class="pa-1 text-md text-[#999999]">
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
                  <v-row class="d-flex align-center">
                    <v-col cols="12" sm>
                      <!-- {{student.potential}} -->
                      <labelCustom text="ระดับพัฒนาการ"></labelCustom>
                      <v-select
                        outlined
                        dense
                        :rules="rules.evolution"
                        v-model="student.potential.evolution"
                        :items="evolution_options"
                      >
                        <template v-slot:item="{ item }">
                          <v-list-item-content>
                            <v-list-item-title>
                              <v-rating
                                readonly
                                :length="item.num_value"
                                :value="item.num_value"
                                color="#ff6b81"
                              ></v-rating>
                            </v-list-item-title>
                          </v-list-item-content>
                        </template>
                        <template v-slot:selection="{ item }">
                          <v-rating
                            readonly
                            :length="item.num_value"
                            :value="item.num_value"
                            color="#ff6b81"
                          ></v-rating>
                        </template>
                      </v-select>
                    </v-col>
                    <v-col cols="12" sm="auto">
                      <v-btn
                        outlined
                        class="text-sm w-full"
                        color="#ff6b81"
                        @click="showDialogPotential(student.checkInStudentId)"
                      >
                        แสดงความคิดเห็น
                      </v-btn>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <labelCustom text="ระดับความสนใจ"></labelCustom>
                      <v-textarea
                        outlined
                        :rules="rules.interest_text"
                        v-model="student.potential.interest"
                      ></v-textarea>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
              <v-row>
                <v-col cols="12" sm align="right">
                  <v-btn
                    color="#ff6b81"
                    @click="clearPotentialAssessment()"
                    outlined
                    dense
                    :class="
                      $vuetify.breakpoint.smAndUp ? 'btn-size-lg' : 'w-full'
                    "
                  >
                    ล้างข้อมูล
                  </v-btn>
                </v-col>
                <v-col cols="12" sm="auto">
                  <v-btn
                    color="#ff6b81"
                    @click="saveUpdateAssessmentPotential()"
                    dark
                    depressed
                    dense
                    :class="
                      $vuetify.breakpoint.smAndUp ? 'btn-size-lg' : 'w-full'
                    "
                  >
                    บันทึก
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </div>
        </v-tab-item>
        <v-tab-item value="teaching summary">
          <v-form ref="summary_form" v-model="summary_form">
            <v-row dense>
              <v-col>
                <labelCustom text="บันทึกการสอน"></labelCustom>
                <v-textarea
                  outlined
                  :rules="rules.summary"
                  placeholder="ระบุความคิดเห็น..."
                  v-model="coach_check_in.summary"
                ></v-textarea>
              </v-col>
            </v-row>
            <v-row dense>
              <v-col>
                <labelCustom text="พัฒนาการ / การบ้าน"></labelCustom>
                <v-textarea
                  outlined
                  :rules="rules.homework"
                  placeholder="ระบุความคิดเห็น..."
                  v-model="coach_check_in.homework"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-form>
          <!-- Upload file -->
          <v-card flat class="mb-3">
            <v-card-text
              class="border-dashed border-2 border-pink-600 rounded-lg"
            >
              <v-row
                v-if="
                  preview_summary_files && preview_summary_files?.length > 0
                "
              >
                <v-col
                  cols="12"
                  sm="4"
                  align="center"
                  class="rounded-lg pa-2"
                  v-for="(file, index) in preview_summary_files"
                  :key="index"
                >
                  <template v-if="!file.attId && file.search('video') > -1">
                    <v-card flat>
                      <div class="flex justify-end">
                        <v-btn
                          icon
                          class="bg-[#f00]"
                          dark
                          @click="removeSummaryFile(index)"
                        >
                          <v-icon>mdi-close</v-icon>
                        </v-btn>
                      </div>
                      <video :src="file" controls></video>
                    </v-card>
                  </template>
                  <template
                    v-if="file.attId && file.filesType.search('video') > -1"
                  >
                    <v-card flat>
                      <div class="flex justify-end">
                        <v-btn
                          icon
                          class="bg-[#f00]"
                          dark
                          @click="removeSummaryFileInbase(file, index)"
                          ><v-icon>mdi-close</v-icon></v-btn
                        >
                      </div>
                      <video :src="file.url" controls></video>
                    </v-card>
                  </template>
                  <template v-else>
                    <v-img
                      v-if="file.attId && file.filesType.search('video') == -1"
                      :src="file.url"
                      contain
                      max-height="200"
                      max-width="200"
                      align="right"
                    >
                      <v-btn
                        icon
                        class="bg-[#f00]"
                        dark
                        @click="removeSummaryFileInbase(file, index)"
                        ><v-icon>mdi-close</v-icon></v-btn
                      >
                    </v-img>
                    <v-img
                      v-if="!file.attId && file.search('video') == -1"
                      :src="file"
                      contain
                      max-height="200"
                      max-width="200"
                      align="right"
                    >
                      <v-btn
                        v-if="coach_check_in.attachment.length == 0"
                        icon
                        class="bg-[#f00]"
                        dark
                        @click="removeSummaryFile(index)"
                        ><v-icon>mdi-close</v-icon></v-btn
                      >
                    </v-img>
                  </template>
                </v-col>
              </v-row>
              <v-row
                v-if="
                  preview_summary_files && preview_summary_files?.length == 0
                "
              >
                <v-col cols="12" class="flex align-center justify-center">
                  <v-img
                    src="../../../assets/manage_coach/upload_file.png"
                    max-height="105"
                    max-width="122"
                  >
                  </v-img>
                </v-col>
                <v-col
                  cols="12"
                  class="flex align-center justify-center text-h5"
                >
                  แนบไฟล์รูปภาพหรือวิดีโอ
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" class="flex align-center justify-center">
                  <v-btn
                    text
                    class="underline"
                    color="#ff6b81"
                    @click="openFileSelector"
                    >อัพโหลดไฟล์แนบ</v-btn
                  >
                  <input
                    ref="fileInput"
                    type="file"
                    accept="image/* ,video/*"
                    multiple
                    @change="previewSummaryFile"
                    style="display: none"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
          <v-row dense>
            <v-col cols="12" sm="6">
              <v-btn
                class="w-full"
                text
                color="#ff6b81"
                @click="clearTeachingNote"
              >
                ล้างข้อมูล
              </v-btn>
            </v-col>
            <v-col cols="12" sm="6">
              <v-btn
                class="w-full"
                depressed
                color="#ff6b81"
                dark
                @click="saveSummary()"
              >
                บันทึก
              </v-btn>
            </v-col>
          </v-row>
        </v-tab-item>
      </v-tabs-items>
      <!-- COMMENT -->
      <v-dialog
        persistent
        :width="$vuetify.breakpoint.smAndUp ? '60vw' : ''"
        v-model="show_comment_dialog"
        v-if="show_comment_dialog"
      >
        <!-- <pre>{{student_check_in[selected_student]}}</pre> -->
        <v-card class="pa-1">
          <v-row dense>
            <v-col class="pa-1" cols="12" align="right">
              <v-btn icon @click="closeStudentComment()">
                <v-icon color="#ff6b81">mdi-close</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-card-text>
            <v-row dense>
              <v-col align="center" class="text-lg font-bold">
                ความคิดเห็นเพิ่มเติม
              </v-col>
            </v-row>
            <v-row dense>
              <v-col>
                <labelCustom text="เพิ่มความคิดเห็น"></labelCustom>
                <v-textarea
                  outlined
                  v-model="comment_dialog_tmp.remark"
                ></v-textarea>
              </v-col>
            </v-row>
            <div v-if="comment_dialog_tmp.attachment.length > 0">
              <v-row dense>
                <v-col class="font-bold text-lg"> ไฟล์แนบ </v-col>
              </v-row>
              <v-card
                flat
                class="mb-3"
                v-for="(file, index) of comment_dialog_tmp.attachment"
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
                    <v-col @click="openFile(file)" class="px-2 cursor-pointer">
                      <span class="font-bold">
                        {{ file.originalFilesName }} </span
                      ><br />
                      <span class="text-caption"
                        >ขนาดไฟล์ :
                        {{ (file.filesSize / 1000000).toFixed(2) }} MB</span
                      >
                    </v-col>
                    <v-col cols="auto" class="pl-2">
                      <v-btn
                        @click="
                          removeAccessmentFileInBase(file, selected_student)
                        "
                        icon
                        color="#ff6b81"
                        ><v-icon>mdi-close</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </div>
            <v-card
              flat
              class="mb-3"
              v-if="student_check_in[selected_student].type === 'general'"
            >
              <v-card-text
                class="border-dashed border-2 border-pink-600 rounded-lg"
              >
                <v-row>
                  <v-col cols="12" class="flex align-center justify-center">
                    <v-img
                      src="../../../assets/manage_coach/upload_file.png"
                      max-height="105"
                      max-width="122"
                    ></v-img>
                  </v-col>
                  <v-col cols="12" class="flex align-center justify-center">
                    <v-btn
                      text
                      class="underline"
                      color="#ff6b81"
                      @click="openGeneralfileInputSelector"
                      >อัพโหลดไฟล์แนบ</v-btn
                    >
                    <input
                      ref="generalfileInput"
                      type="file"
                      multiple
                      @change="uploadGeneralFile()"
                      style="display: none"
                    />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
            <div v-if="comment_dialog_tmp.files.length > 0" class="mb-3">
              <v-row dense>
                <v-col class="font-bold text-lg"> ไฟล์แนบ </v-col>
              </v-row>
              <v-divider class="my-2"></v-divider>
              <v-card
                @click="openFile(file)"
                flat
                class="mb-3"
                v-for="(file, index) of comment_dialog_tmp.files"
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
                      <span class="font-bold">{{ file.name }}</span
                      ><br />
                      <span class="text-caption"
                        >ขนาดไฟล์ :
                        {{ (file.size / 1000000).toFixed(2) }} MB</span
                      >
                    </v-col>
                    <v-col cols="auto" class="pl-2">
                      <v-btn
                        @click="removeAccessmentFile(selected_student, index)"
                        icon
                        color="#ff6b81"
                        ><v-icon>mdi-close</v-icon></v-btn
                      >
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </div>
            <v-row dense>
              <v-col cols="12" sm="6">
                <v-btn
                  class="w-full"
                  @click="clearStudentComment()"
                  text
                  color="#ff6b81"
                >
                  ล้างข้อมูล
                </v-btn>
              </v-col>
              <v-col cols="12" sm="6">
                <v-btn
                  class="w-full"
                  @click="confirmStudentComment(selected_student)"
                  depressed
                  color="#ff6b81"
                  dark
                >
                  ตกลง
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>
      <!-- COMMENT PROTENTIAL -->
      <v-dialog
        persistent
        :width="$vuetify.breakpoint.smAndUp ? '60vw' : ''"
        v-model="show_comment_potential_dialog"
        v-if="show_comment_potential_dialog"
      >
        <v-card class="pa-1">
          <!-- <pre>{{student_check_in[selected_student].potential.checkInPotentialId}}</pre> -->
          <v-row dense>
            <v-col class="pa-1" cols="12" align="right">
              <v-btn icon @click="closeDialogPotential(selected_student)">
                <v-icon color="#ff6b81">mdi-close</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-card-text>
            <v-row dense>
              <v-col align="center" class="text-lg font-bold">
                ความคิดเห็นเพิ่มเติม
              </v-col>
            </v-row>
            <v-row dense>
              <v-col>
                <labelCustom text="เพิ่มความคิดเห็น"></labelCustom>
                <v-textarea
                  outlined
                  v-model="comment_potential_dialog_tmp.remark"
                ></v-textarea>
              </v-col>
            </v-row>
            <div
              v-if="comment_potential_dialog_tmp.attachmentPotential.length > 0"
            >
              <v-row dense>
                <v-col class="font-bold text-lg"> ไฟล์แนบ </v-col>
              </v-row>
              <v-card
                flat
                class="mb-3"
                v-for="(
                  file, index
                ) of comment_potential_dialog_tmp.attachmentPotential"
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
                    <v-col @click="openFile(file)" class="px-2 cursor-pointer">
                      <!-- {{ file }} -->
                      <span class="font-bold">
                        {{ file.originalFilesName }}</span
                      ><br />
                      <span class="text-caption"
                        >ขนาดไฟล์ :
                        {{ (file.filesSize / 1000000).toFixed(2) }} MB</span
                      >
                    </v-col>
                    <v-col cols="auto" class="pl-2">
                      <v-btn
                        @click="
                          removePotentialFileInBase(file, selected_student)
                        "
                        icon
                        color="#ff6b81"
                        ><v-icon>mdi-close</v-icon></v-btn
                      >
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </div>
            <v-card
              flat
              class="mb-3"
              v-if="
                student_check_in[selected_student].potential.type ===
                'potential'
              "
            >
              <v-card-text
                class="border-dashed border-2 border-pink-600 rounded-lg"
              >
                <v-row>
                  <v-col cols="12" class="flex align-center justify-center">
                    <v-img
                      src="../../../assets/manage_coach/upload_file.png"
                      max-height="105"
                      max-width="122"
                    ></v-img>
                  </v-col>
                  <v-col cols="12" class="flex align-center justify-center">
                    <v-btn
                      text
                      class="underline"
                      color="#ff6b81"
                      @click="openPotentialfileInputSelector"
                      >อัพโหลดไฟล์แนบ</v-btn
                    >
                    <input
                      ref="potentialfileInput"
                      type="file"
                      multiple
                      @change="uploadPotentialFile()"
                      style="display: none"
                    />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <div
              v-if="comment_potential_dialog_tmp.files.length > 0"
              class="mb-3"
            >
              <v-row dense>
                <v-col class="font-bold text-lg"> ไฟล์แนบ </v-col>
              </v-row>
              <v-divider class="my-2"></v-divider>
              <v-card
                flat
                class="mb-3"
                v-for="(file, index) of comment_potential_dialog_tmp.files"
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
                      <span class="font-bold">{{ file.name }}</span
                      ><br />
                      <span class="text-caption"
                        >ขนาดไฟล์ :
                        {{ (file.size / 1000000).toFixed(2) }} MB</span
                      >
                    </v-col>
                    <v-col cols="auto" class="pl-2">
                      <v-btn
                        @click="removePotentialFile(index)"
                        icon
                        color="#ff6b81"
                        ><v-icon>mdi-close</v-icon></v-btn
                      >
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </div>
            <v-row dense>
              <v-col cols="12" sm="6">
                <v-btn
                  class="w-full"
                  @click="clearDialogPotential(selected_student)"
                  text
                  color="#ff6b81"
                >
                  ล้างข้อมูล
                </v-btn>
              </v-col>
              <v-col cols="12" sm="6">
                <v-btn
                  class="w-full"
                  @click="confirmDialogPotential(selected_student)"
                  depressed
                  color="#ff6b81"
                  dark
                >
                  ตกลง
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>
      <loading-overlay :loading="student_check_in_is_loading"></loading-overlay>
    </v-container>
  </v-app>
</template>
<script>
import loadingOverlay from "../../../components/loading/loadingOverlay.vue";
import { dateFormatter, CheckFileSize } from "@/functions/functions";
import rowData from "@/components/label/rowData.vue";
import labelCustom from "../../../components/label/labelCustom.vue";
import { mapActions, mapGetters } from "vuex";
import { Input, TimePicker } from "ant-design-vue";
import Swal from "sweetalert2";
import mixin from "@/mixin";
// import VueTimepicker from "vue2-timepicker/src/vue-timepicker.vue";
import moment from "moment";
export default {
  name: "menageCourseDetail",
  components: { rowData, loadingOverlay, labelCustom, TimePicker },
  mixins: [mixin],
  directives: {
    "ant-input": Input,
  },

  data: () => ({
    tab: "check in",
    fileURL: null,
    filename: "",
    validate_form: false,
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
    expanded_index: [],
    check_in: false,
    previewUrl: null,
    show_comment_dialog: false,
    tab_evaluate: "evaluate_students", // Evaluate students, Assess the learner's potential
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
    headers: [
      { text: "ลำดับ", align: "center", sortable: false, value: "no" },
      {
        text: "ชื่อ-สกุล",
        align: "center",
        sortable: false,
        value: "fullname",
      },
      { text: "แพ็คเกจ", align: "center", sortable: false, value: "package" },
      {
        text: "จำนวนครั้ง",
        align: "center",
        sortable: false,
        value: "class_time",
      },
      {
        text: "การเข้าเรียน",
        align: "center",
        width: "200",
        sortable: false,
        value: "actions",
      },
    ],
    learners_form: false,
    potential_form: false,
    summary_form: false,
    rules: {
      status_text: [(val) => !!val || "โปรดระบุสถานะการเข้าเรียน"],
      compensation_date: [(val) => !!val || "โปรดระบุวันชดเชย"],
      start_time: [(val) => !!val || "โปรดระบุเวลาเริ่ม"],
      end_time: [(val) => !!val || "โปรดระบุเวลาสิ้นสุด"],
      evolution: [(val) => !!val || "โปรดเลือกระดับพัฒนาการ"],
      interest: [(val) => !!val || "โปรดเลือกระดับความสนใจ"],
      interest_text: [(val) => !!val > 0 || "โปรดระบุระดับความสนใจ"],
      summary: [(val) => !!val > 0 || "โปรดระบุบันทึกการสอน"],
      homework: [(val) => !!val > 0 || "โปรดระบุพัฒนาการ / การบ้าน"],
    },
    comment_dialog_tmp: {
      id: "",
      remark: "",
      files: [],
    },
    comment_potential_dialog_tmp: {
      id: "",
      remark: "",
      files: [],
    },
    selected_student: null,
    preview_summary_files: [],
    selected_files: [],
    cpo_options: [],
    show_comment_potential_dialog: false,
    package_name_filter: null,
  }),
  created() {
    this.GetStudentByTimeId({
      course_id: this.$route.params.courseId,
      date: this.$route.params.date,
      time_id: this.$route.params.timeId,
    });
  },
  mounted() {},
  watch: {
    coach_check_in: function () {
      // console.log(this.coach_check_in);
      this.preview_summary_files = [];
      if (this.coach_check_in.attachment) {
        if (this.coach_check_in?.attachment.length > 0) {
          for (const img_url of this.coach_check_in.attachment) {
            // console.log(img_url);
            this.preview_summary_files.push({
              url: img_url.attFilesUrl,
              attId: img_url.sumAttId,
              originalFilesName: img_url.originalFilesName,
              filesType: img_url.filesType,
            });
          }
        }
      }
    },
    student_check_in: function () {
      this.student_check_in.forEach((check_in_data) => {
        if (check_in_data?.cpo?.packageName) {
          if (!this.package_name_filter) {
            this.package_name_filter = check_in_data?.cpo?.packageName;
          }
          if (!this.cpo_options.includes(check_in_data.cpo.packageName)) {
            this.cpo_options.push(check_in_data.cpo.packageName);
          }
        }
        if (
          check_in_data.status === "leave" ||
          check_in_data.status === "special case"
        ) {
          this.selectCheckInStatus(check_in_data, check_in_data.status);
          this.expanded_index.push(check_in_data);
        }
      });
    },
    tab: function () {
      this.GetStudentByTimeId({
        course_id: this.$route.params.courseId,
        date: this.$route.params.date,
        time_id: this.$route.params.timeId,
      });
      this.GetCoachCheckIn({
        course_id: this.$route.params.courseId,
        date: this.$route.params.date,
      });
    },
  },
  computed: {
    ...mapGetters({
      course_data: "CourseModules/getCourseData",
      coach_check_in: "CoachModules/getCoachCheckIn",
      student_check_in: "CoachModules/getStudentCheckIn",
      coach_check_in_is_loading: "CoachModules/getCoachCheckInIsLoading",
      student_check_in_is_loading: "CoachModules/getStudentCheckInIsLoading",
    }),
    setFunctios() {
      this.GetCourse(this.$route.params.courseId);
      this.GetCoachCheckIn({
        course_id: this.$route.params.courseId,
        date: this.$route.params.date,
      });

      return "";
    },
  },
  methods: {
    ...mapActions({
      GetCoachCheckIn: "CoachModules/GetCoachCheckIn",
      GetCourse: "CourseModules/GetCourse",
      CheckInCoach: "CoachModules/CheckInCoach",
      GetStudentByTimeId: "CoachModules/GetStudentByTimeId",
      UpdateCheckInStudent: "CoachModules/UpdateCheckInStudent",
      AssessmentStudent: "CoachModules/AssessmentStudent",
      CreateTeachingNotes: "CoachModules/CreateTeachingNotes",
      UploadFileSummary: "CoachModules/UploadFileSummary",
      UpdateAssessmentPotential: "CoachModules/UpdateAssessmentPotential",
      DeleteAssessmentFile: "CoachModules/DeleteAssessmentFile",
      DeleteSummaryFile: "CoachModules/DeleteSummaryFile",
      DeleteAssessmentPotentialFile:
        "CoachModules/DeleteAssessmentPotentialFile",
    }),
    //check in by date
    CheckInByDate() {
      // let check_in_date = moment(this.$route.params.date).format("YYYY-MM-DD")
      // let today = moment().format("YYYY-MM-DD")
      // if(check_in_date == today){
      //   return false
      // }else{
      //   return true
      // }

      return false;
    },
    genTime(time) {
      if (time) {
        return moment(time).format("HH:mm");
      } else {
        return "";
      }
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
    CheckRating(rating_data, checkInId, type) {
      if (
        this.student_check_in.filter((v) => v.checkInStudentId === checkInId)
          .length > 0
      ) {
        this.student_check_in
          .filter((v) => v.checkInStudentId === checkInId)
          .forEach((student) => {
            if (type === "assessment_evolution") {
              if (student.assessment.rating_evolution < 3) {
                student.assessment.rating_evolution = 3;
              }
            } else if (type === "assessment_interest") {
              if (student.assessment.rating_interest < 3) {
                student.assessment.rating_interest = 3;
              }
            } else if (type === "potential_evolution") {
              if (student.assessment.rating_evolution < 3) {
                student.assessment.rating_evolution = 3;
              }
            }
          });
      }
    },
    FilterStatusCheckIn(selected_data) {
      if (this.course_data.course_type_id === "CT_1") {
        // // console.log(`Total :${ parseInt(selected_data.totalDay/4) } count : ${selected_data.countCheckInleave}`)
        if (
          parseInt(selected_data.totalDay / 4) > selected_data.countCheckInleave
        ) {
          return this.check_in_status_options;
        } else {
          if (selected_data.status === "leave") {
            return this.check_in_status_options;
          } else {
            return this.check_in_status_options.filter(
              (v) => v.value !== "leave"
            );
          }
        }
      } else {
        return this.check_in_status_options;
      }
    },
    clearTeachingNote() {
      this.coach_check_in.summary = null;
      this.coach_check_in.homework = null;
      this.coach_check_in.files = null;
    },
    filterPackage(packageName) {
      this.package_name_filter = packageName;
    },
    GenUrlFile(part) {
      return `${process.env.VUE_APP_URL}/api/v1/files/${part}`;
    },
    openFile(file) {
      // console.log(file);
      if (file.attId) {
        let url = `${process.env.VUE_APP_URL}/api/v1/files/${file.attFiles}`;
        window.open(url, "_blank");
      } else if (file.attachmentPotentialId) {
        let url = `${process.env.VUE_APP_URL}/api/v1/files/${file.attachmentFiles}`;
        window.open(url, "_blank");
      }
    },
    confirmDialogPotential(selected_student) {
      this.selected_files = [];
      this.student_check_in[selected_student].potential.confirm = true;
      this.student_check_in[selected_student].potential.remark =
        this.comment_potential_dialog_tmp.remark;
      this.student_check_in[selected_student].potentialfiles =
        this.comment_potential_dialog_tmp.files;
      this.show_comment_potential_dialog = false;
    },
    showDialogPotential(id) {
      for (let i = 0; i < this.student_check_in.length; i++) {
        if (this.student_check_in[i].checkInStudentId === id) {
          this.selected_student = i;
        }
      }
      console.log(
        this.student_check_in[this.selected_student].potential
          .attachmentPotential
      );
      this.selected_files = [];
      this.comment_potential_dialog_tmp = {
        id: this.student_check_in[this.selected_student].potential
          .checkInPotentialId,
        remark: this.student_check_in[this.selected_student].potential.remark,
        files: this.student_check_in[this.selected_student].potentialfiles
          ? this.student_check_in[this.selected_student].potentialfiles
          : [],
        attachmentPotential:
          this.student_check_in[this.selected_student].potential
            .attachmentPotential,
      };
      this.show_comment_potential_dialog = true;
    },
    clearDialogPotential() {
      this.comment_potential_dialog_tmp.id = "";
      this.comment_potential_dialog_tmp.remark = "";
      this.comment_potential_dialog_tmp.files = [];
      this.selected_files = [];
    },
    closeDialogPotential() {
      this.comment_potential_dialog_tmp.id = "";
      this.comment_potential_dialog_tmp.remark = "";
      this.comment_potential_dialog_tmp.files = [];
      this.comment_potential_dialog_tmp.attachmentPotential = [];
      this.selected_files = [];
      this.show_comment_potential_dialog = false;
    },
    GenDate(data) {
      return new Date(data).toLocaleDateString("th-TH", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long",
      });
    },
    async saveSummary() {
      this.$refs.summary_form.validate();
      if (this.summary_form) {
        Swal.fire({
          icon: "question",
          title: "ต้องการบันทึกใช่หรือไม่ ?",
          showDenyButton: false,
          showCancelButton: true,
          cancelButtonText: "ยกเลิก",
          confirmButtonText: "ตกลง",
        }).then(async (result) => {
          if (result.isConfirmed) {
            await this.UploadFileSummary({
              checkInCoach: this.coach_check_in,
              files: this.coach_check_in.summary_files,
              course_id: this.$route.params.courseId,
              date: this.$route.params.date,
            });
          }
        });
      }
    },
    async saveUpdateAssessmentPotential() {
      // // console.log(this.student_check_in)
      this.$refs.potential_form.validate();
      if (this.potential_form) {
        Swal.fire({
          icon: "question",
          title: "ต้องการบันทึกใช่หรือไม่ ?",
          showDenyButton: false,
          showCancelButton: true,
          cancelButtonText: "ยกเลิก",
          confirmButtonText: "ตกลง",
        }).then(async (result) => {
          if (result.isConfirmed) {
            await this.UpdateAssessmentPotential({
              students: this.student_check_in,
              course_id: this.$route.params.courseId,
              date: this.$route.params.date,
              time_id: this.$route.params.timeId,
            });
          }
        });
      }
    },
    saveCreateTeachingNotes() {
      Swal.fire({
        icon: "question",
        title: "ต้องการบันทึกใช่หรือไม่ ?",
        showDenyButton: false,
        showCancelButton: true,
        cancelButtonText: "ยกเลิก",
        confirmButtonText: "ตกลง",
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.CreateTeachingNotes({
            check_in_coach_id: this.coach_check_in.checkInCoachId,
            check_in_coach_data: this.coach_check_in,
          });
        }
      });
    },
    async saveAssessmentStudent() {
      this.$refs.learners_form.validate();
      if (this.learners_form) {
        Swal.fire({
          icon: "question",
          title: "ต้องการบันทึกใช่หรือไม่ ?",
          showDenyButton: false,
          showCancelButton: true,
          cancelButtonText: "ยกเลิก",
          confirmButtonText: "ตกลง",
        }).then(async (result) => {
          if (result.isConfirmed) {
            await this.AssessmentStudent({
              students: this.student_check_in,
              course_id: this.$route.params.courseId,
              date: this.$route.params.date,
              time_id: this.$route.params.timeId,
            });
          }
        });
      }
    },
    async CheckInStudents(item) {
      let student_id = [];
      await item.map((val) => {
        student_id.push({ studentId: val.studentId });
      });
      this.$refs.validate_form.validate();
      if (this.validate_form) {
        Swal.fire({
          icon: "question",
          title: "ต้องการบันทึกใช่หรือไม่ ?",
          showDenyButton: false,
          showCancelButton: true,
          cancelButtonText: "ยกเลิก",
          confirmButtonText: "ตกลง",
        }).then(async (result) => {
          if (result.isConfirmed) {
            this.UpdateCheckInStudent({
              students: this.student_check_in,
              course_id: this.$route.params.courseId,
              date: this.$route.params.date,
              time_id: this.$route.params.timeId,
            });
            let payload = {
              notificationName: "แจ้งเตือนการเช็คอิน",
              notificationDescription: `เช็คอินเรียบร้อย`,
              accountId: student_id,
            };
            this.sendNotification(payload);
          }
        });
      }
    },
    SelectedStartDate(e) {
      e.target.parentNode.parentNode.parentNode.parentNode.parentNode
        .getElementsByClassName("time-picker-hidden")[0]
        .getElementsByTagName("input")[0]
        .focus();
      e.target.parentNode.parentNode.parentNode.parentNode.parentNode
        .getElementsByClassName("time-picker-hidden")[0]
        .getElementsByTagName("input")[0]
        .click();
    },
    checkIn() {
      if (!this.coach_check_in.checkInCoachId) {
        Swal.fire({
          icon: "question",
          title: "ต้องการลงเวลาเข้าสอนใช่หรือไม่",
          showDenyButton: false,
          showCancelButton: true,
          confirmButtonText: "ตกลง",
          cancelButtonText: "ยกเลิก",
        }).then(async (result) => {
          if (result.isConfirmed) {
            this.check_in = true;
            await this.CheckInCoach({
              course_id: this.course_data.course_id,
              date: this.$route.params.date,
              time_id: this.$route.params.timeId,
              type: this.$route.params.typeEvent,
            }).then(async () => {
              await this.GetCoachCheckIn({
                course_id: this.$route.params.courseId,
                date: this.$route.params.date,
              });
            });
          }
        });
      }
    },
    selectStudentComment(id) {
      for (let i = 0; i < this.student_check_in.length; i++) {
        if (this.student_check_in[i].checkInStudentId === id) {
          this.selected_student = i;
        }
      }
      console.log(
        this.student_check_in[this.selected_student].assessment.attachment
      );
      this.comment_dialog_tmp = {
        id: this.student_check_in[this.selected_student].assessment
          .assessmentStudentsId
          ? this.student_check_in[this.selected_student].assessment
              .assessmentStudentsId
          : "",
        remark: this.student_check_in[this.selected_student].assessment.remark,
        attachment:
          this.student_check_in[this.selected_student].assessment.attachment,
        files: this.student_check_in[this.selected_student].files
          ? this.student_check_in[this.selected_student].files
          : [],
      };
      // if (!this.student_check_in[this.selected_student].assessment.assessmentStudentsId ) {
      //   this.student_check_in[this.selected_student].assessment.oldremark =
      //     this.student_check_in[this.selected_student].assessment.remark;
      // }
      this.show_comment_dialog = true;
    },
    confirmStudentComment(selected_student) {
      this.selected_files = [];
      this.show_comment_dialog = false;
      this.student_check_in[selected_student].assessment.confrim = true;
      this.student_check_in[selected_student].assessment.remark =
        this.comment_dialog_tmp.remark;
      this.student_check_in[selected_student].files =
        this.comment_dialog_tmp.files;
      this.student_check_in[selected_student].assessment.attachment =
        this.comment_dialog_tmp.attachment;
    },
    clearStudentComment() {
      // this.comment_dialog_tmp.evolution = "";
      this.comment_dialog_tmp.remark = "";
      this.comment_dialog_tmp.files = [];
      // this.comment_dialog_tmp.attachment = []
      this.selected_files = [];
    },
    closeStudentComment() {
      // console.log(selected_student);
      this.comment_dialog_tmp.id = "";
      this.comment_dialog_tmp.remark = "";
      this.comment_dialog_tmp.files = [];
      this.comment_dialog_tmp.attachment = [];
      this.selected_files = [];
      this.show_comment_dialog = false;
    },
    timeRange(item) {
      item.time = `${item.start_time || "Start time"} - ${
        item.end_time || "End time"
      }`;
    },
    selectCheckInStatus(item, status) {
      // console.log(item);
      if (status === "leave" || status === "special case") {
        // const index = this.students.filter((d) => d.no === item.no)
        this.expanded_index.push(item);
      } else {
        this.expanded_index.forEach((expanded, index) => {
          if (expanded.checkInStudentId === item.checkInStudentId) {
            this.expanded_index.splice(index, 1);
          }
        });
        item.compensationDate = null;
        item.compensationStartTime = null;
        item.compensationEndTime = null;
      }
    },
    inputDate(e, item) {
      this.student_check_in.filter(
        (v) => v.no === item.no
      )[0].compensation_date_str = dateFormatter(e, "DD MMT YYYYT");
    },
    openFileSelector() {
      this.$refs.fileInput.click();
    },
    openGeneralfileInputSelector() {
      this.$refs.generalfileInput.click();
    },
    openPotentialfileInputSelector() {
      this.$refs.potentialfileInput.click();
    },
    removeAccessmentFile(selected_student, index) {
      this.student_check_in[selected_student].files.splice(index, 1);
    },
    removePotentialFileInBase(file, selected_student) {
      // console.log(file);
      Swal.fire({
        icon: "question",
        title: "ต้องการลบใช่หรือไม่",
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: "ตกลง",
        cancelButtonText: "ยกเลิก",
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.DeleteAssessmentPotentialFile({
            att_assessment_id: file.attachmentPotentialId,
          }).then(() => {
            this.student_check_in[
              selected_student
            ].potential.attachmentPotential.forEach((att, index) => {
              if (file.attachmentPotentialId === att.attachmentPotentialId) {
                this.student_check_in[
                  selected_student
                ].potential.attachmentPotential.splice(index, 1);
              }
            });
          });
        }
      });
    },
    removeAccessmentFileInBase(file, selected_student) {
      // console.log(file);
      Swal.fire({
        icon: "question",
        title: "ต้องการลบใช่หรือไม่",
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: "ตกลง",
        cancelButtonText: "ยกเลิก",
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.DeleteAssessmentFile({ att_assessment_id: file.attId }).then(
            () => {
              this.student_check_in[
                selected_student
              ].assessment.attachment.forEach((att, index) => {
                if (file.attId === att.attId) {
                  this.student_check_in[
                    selected_student
                  ].assessment.attachment.splice(index, 1);
                }
              });
            }
          );
        }
      });
    },
    removePotentialFile(selected_student, index) {
      this.student_check_in[selected_student].potentialfiles.splice(index, 1);
    },
    clearAssessment() {
      console.log("1184 => ", this.student_check_in);
      for (const student of this.student_check_in) {
        student.assessment.evolution = "";
        student.assessment.interest = "";
        student.assessment.remark = "";
        student.files = [];
      }
    },
    clearPotentialAssessment() {
      for (const student of this.student_check_in) {
        student.potential.evolution = "";
        student.potential.interest = "";
        student.potential.remark = "";
        student.potentialfiles = [];
      }
    },
    // uploadFile() {
    //   this.file = this.$refs.fileInput.files[0];
    //   if (!this.file) return;
    //   const reader = new FileReader();
    //   reader.onload = (e) => {
    //     this.previewUrl = e.target.result;
    //   };
    //   reader.readAsDataURL(this.file);
    // },
    uploadGeneralFile() {
      // console.log("selected_student", this.selected_student);
      const files = this.$refs.generalfileInput.files;
      if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          if (CheckFileSize(files[i]) === true) {
            this.selected_files.push(files[i]);
            this.comment_dialog_tmp.files.push(files[i]);
          }
        }
      }
    },
    uploadPotentialFile() {
      const files = this.$refs.potentialfileInput.files;
      if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          if (CheckFileSize(files[i]) === true) {
            this.selected_files.push(files[i]);
            this.comment_potential_dialog_tmp.files.push(files[i]);
          }
        }
      }
    },

    previewSummaryFile(event) {
      const selectedFiles = event.target.files;
      // this.coach_check_in.summary_files = [];
      const fileUrls = [];
      for (let i = 0; i < selectedFiles.length; i++) {
        if (CheckFileSize(selectedFiles[i]) === true) {
          // console.log(selectedFiles[i]);
          this.coach_check_in.summary_files.push(selectedFiles[i]);
          const file = selectedFiles[i];
          const reader = new FileReader();
          reader.onload = () => {
            fileUrls.push(reader.result);
            if (fileUrls.length == selectedFiles.length) {
              this.preview_summary_files = [
                ...this.preview_summary_files,
                ...fileUrls,
              ];
            }
          };
          reader.readAsDataURL(file);
        }
      }
    },
    removeSummaryFile(index) {
      this.preview_summary_files.splice(index, 1);
      this.coach_check_in.summary_files.splice(index, 1);
    },
    removeSummaryFileInbase(file, index) {
      // console.log(this.coach_check_in);
      Swal.fire({
        icon: "question",
        title: "ต้องการลบใช่หรือไม่",
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: "ตกลง",
        cancelButtonText: "ยกเลิก",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await this.DeleteSummaryFile({ att_assessment_id: file.attId }).then(
            () => {
              this.preview_summary_files.splice(index, 1);
              this.coach_check_in.attachment.splice(index, 1);
            }
          );
        }
      });
      //this.coach_check_in.summary_files.splice(index, 1)
      //
    },

    handleFileChange(event) {
      const file = event.target.files[0];
      this.convertToBase64(file);
    },
    convertToBase64(file) {
      const reader = new FileReader();

      reader.onload = () => {
        const base64Image = reader.result.split(",")[1];
        this.filename = file.name;
        const fileType = file.type;

        const convertedFile = this.base64ToFile(
          base64Image,
          this.filename,
          fileType
        );
        this.fileURL = URL.createObjectURL(convertedFile);
      };

      reader.readAsDataURL(file);
    },
    base64ToFile(base64Image, filename, fileType) {
      const binaryString = window.atob(base64Image);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);

      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const blob = new Blob([bytes], { type: fileType });
      const convertedFile = new File([blob], filename, { type: fileType });

      return convertedFile;
    },
  },
};
</script>
<style>
</style>

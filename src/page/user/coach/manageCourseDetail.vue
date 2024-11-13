<template>
  <v-app>
    {{ setFunctios }}
    <loading-overlay :loading="studentCheckInLoading"></loading-overlay>
    <v-container>
      <v-card flat>
        <v-card-text class="bg-[#FBF3F5] border">
          <v-row>
            <v-col cols="12" sm="4">
              <v-img
                class="rounded-lg"
                :src="
                  course_data.course_img || course_data.course_img !== ''
                    ? course_data.course_img
                    : require(`@/assets/course/default_course_img.svg`)
                "
                style="max-width: 500px"
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
            <v-col cols="12" sm="8">
              <v-row>
                <v-col cols="12" sm>
                  <div class="text-md font-bold">
                    {{
                      $i18n.locale == "th"
                        ? course_data.category_name_th
                        : course_data.category_name_en
                    }}
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
                    >{{ $t("course") }} :
                    {{
                      $i18n.locale == "th"
                        ? course_data.course_name_th
                        : course_data.course_name_en
                    }}</rowData
                  >
                </v-col>
                <v-col cols="12" sm class="pa-0">
                  <rowData mini icon="mdi-clock-outline"
                    >{{ $t("teaching time") }}
                    {{ course_data.course_hours.toFixed(2) }}
                    {{ $t("hour") }}</rowData
                  >
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <v-row dense>
        <v-col class="text-md font-bold"> {{ $t("check in teach") }} </v-col>
      </v-row>
      <v-row dense class="mb-3">
        <v-col align="center">
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
              <v-icon class="mr-2">mdi-check-circle</v-icon>
              {{ $t("teaching check in") }}
            </template>
            <template v-else>
              <v-icon class="mr-2">mdi-clock-edit-outline</v-icon>
              {{ $t("press to enter the teaching time") }}
            </template>
          </v-btn>
        </v-col>
      </v-row>
      <v-tabs class="mb-3" v-model="tab" color="#ff6b81" grow>
        <v-tab class="border-b-2" href="#check in"
          >{{ $t("check in student") }}
        </v-tab>
        <v-tab
          :disabled="student_check_in.length == 0"
          class="border-b-2"
          href="#assess students"
        >
          {{ $t("assess students") }}
        </v-tab>
        <v-tab
          :disabled="student_check_in.length == 0"
          class="border-b-2"
          href="#teaching summary"
        >
          {{ $t("teaching summary notes") }}
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
          <!-- :items="
                  coach_check_in.checkInCoachId
                    ? matchStartTime(student_check_in)
                    : []
                " -->
          <v-card elevation="1" class="mb-2">
            <v-form v-model="validate_form" ref="validate_form">
              <v-data-table
                class="header-table border"
                :items="coach_check_in.checkInCoachId ? student_check_in : []"
                item-key="no"
                :expanded.sync="expanded_index"
                :headers="headers"
              >
                <template v-slot:[`item.number`]="{ index }">
                  <tr>
                    <td>{{ index + 1 }}</td>
                  </tr>
                </template>
                <template v-slot:[`item.fullname`]="{ item }">
                  {{
                    $i18n.locale == "th"
                      ? item.firstNameTh + " " + item.lastNameTh
                      : item.firstNameEn + " " + item.lastNameEn
                  }}
                </template>
                <template v-slot:[`item.nickname`]="{ item }">
                  {{
                    $i18n.locale == "th"
                      ? item.nicknameTh
                      : item.nicknameEn
                      ? item.nicknameEn
                      : "-"
                  }}
                </template>
                <template v-slot:[`item.class`]="{ item }">
                  {{
                    $i18n.locale == "th"
                      ? item.classNameTh
                      : item.classNameEn
                      ? item.classNameEn
                      : "-"
                  }}
                </template>

                <template v-slot:[`item.actions`]="{ item }">
                  <div class="pt-5">
                    <v-select
                      v-model="item.status"
                      required
                      :rules="status_text"
                      :items="FilterStatusCheckIn(item)"
                      outlined
                      dense
                      item-text="label"
                      item-value="value"
                      @change="selectCheckInStatus(item, $event)"
                      :disabled="item.disable === true"
                      color="#ff6b81"
                      item-color="#ff6b81"
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
                  <td class="pa-2" :colspan="headers.length" align="center">
                    <v-row dense>
                      <v-col cols="12" sm="2">{{
                        $t("compensatory study day")
                      }}</v-col>
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
                              :rules="compensation_date"
                              v-model="item.compensation_date_str"
                              readonly
                              :placeholder="$t('choose a compensation date')"
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
                          :rules="start_time"
                          :value="genTime(item.compensationStartTime)"
                        >
                        </v-text-field>
                        <TimePicker
                          class="time-picker-hidden"
                          :minuteStep="30"
                          :placeholder="$t('start time')"
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
                          :rules="end_time"
                          :value="genTime(item.compensationEndTime)"
                        >
                        </v-text-field>
                        <TimePicker
                          class="time-picker-hidden"
                          :minuteStep="30"
                          :style="`width:${width()}px;`"
                          format="HH:mm"
                          :class="item.end_time ? 'active' : ''"
                          :placeholder="$t('end time')"
                          v-model="item.compensationEndTime"
                        ></TimePicker>
                      </v-col>
                    </v-row>
                  </td>
                </template>
                <template v-slot:no-data>
                  <v-row dense>
                    <v-col align="center">
                      {{ $t("no data found in table") }}
                    </v-col>
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
                >{{ $t("save") }}</v-btn
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
                    {{ $t("assess students") }}
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
                      {{ $t("assess the learner's potential") }}
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
                    {{ $t("assess the learner's potential") }}
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
                <!-- &&
                      v.timeStart === this.startTime &&
                      v.timeEnd === this.endTime -->
                <v-card
                  class="mb-2"
                  flat
                  style="border: 1px solid #999"
                  v-for="(student, index_student) in student_check_in.filter(
                    (v) =>
                      v.type === 'general' &&
                      (v.status === 'punctual' || v.status === 'late')
                  )"
                  :key="`${index_student}-student`"
                >
                  <v-card-text>
                    <v-row class="d-flex align-center">
                      <v-col cols="12" sm class="text-lg font-bold">
                        {{ index_student + 1 }}
                        {{
                          $i18n.locale == "th"
                            ? student.fullname
                            : student.fullname_en
                        }}
                      </v-col>
                      <v-col
                        cols="12"
                        sm="5"
                        class="pa-1 text-md text-[#999999]"
                      >
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
                        <labelCustom
                          :text="$t('developmental level')"
                        ></labelCustom>
                        <v-select
                          outlined
                          dense
                          item-color="#ff6b81"
                          color="#ff6b81"
                          :rules="evolution"
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
                      </v-col>
                      <v-col cols="12" sm="4">
                        <labelCustom :text="$t('interest level')"></labelCustom>
                        <v-select
                          outlined
                          dense
                          :rules="interest"
                          item-color="#ff6b81"
                          color="#ff6b81"
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
                          {{ $t("comment") }}
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </template>
              <v-card v-else outlined class="my-3">
                <v-card-text class="text-lg font-bold" align="center">
                  {{ $t("no data found") }}
                </v-card-text>
              </v-card>
              <v-row>
                <v-col cols="12" sm align="right">
                  <v-btn
                    color="#ff6b81"
                    @click="clearAssessment()"
                    outlined
                    dense
                    :class="$vuetify.breakpoint.smAndUp ? '' : 'w-full'"
                  >
                    {{ $t("delete information") }}
                  </v-btn>
                </v-col>
                <v-col cols="12" sm="auto">
                  <v-btn
                    color="#ff6b81"
                    @click="saveAssessmentStudent()"
                    dark
                    depressed
                    dense
                    class="w-64"
                  >
                    {{ $t("sent information") }}
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
                  <v-row class="d-flex align-center">
                    <v-col cols="12" sm class="text-lg font-bold">
                      {{ student.no }}
                      {{
                        $i18n.locale == "th"
                          ? student.fullname
                          : student.fullname_en
                      }}
                    </v-col>
                    <v-col cols="12" sm="5" class="pa-1 text-md text-[#999999]">
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
                  <v-row class="d-flex align-center">
                    <v-col cols="12" sm>
                      <labelCustom
                        :text="$t('developmental level')"
                      ></labelCustom>
                      <v-select
                        outlined
                        dense
                        :rules="evolution"
                        item-color="#ff6b81"
                        color="#ff6b81"
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
                        {{ $t("show comment") }}
                      </v-btn>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <labelCustom :text="$t('interest level')"></labelCustom>
                      <v-textarea
                        outlined
                        :rules="interest_text"
                        item-color="#ff6b81"
                        color="#ff6b81"
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
                    :class="$vuetify.breakpoint.smAndUp ? '' : 'w-full'"
                  >
                    {{ $t("delete information") }}
                  </v-btn>
                </v-col>
                <v-col cols="12" sm="auto">
                  <v-btn
                    color="#ff6b81"
                    @click="saveUpdateAssessmentPotential(student_check_in)"
                    dark
                    depressed
                    dense
                    class="w-64"
                  >
                    {{ $t("sent information") }}
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
                <labelCustom :text="$t('teaching notes')"></labelCustom>
                <v-textarea
                  outlined
                  color="#ff6b81"
                  :rules="summary"
                  :placeholder="$t('specify your opinion') + '...'"
                  v-model="coach_check_in.summary"
                ></v-textarea>
              </v-col>
            </v-row>
            <v-row dense>
              <v-col>
                <labelCustom :text="$t('development / homework')"></labelCustom>
                <v-textarea
                  outlined
                  item-color="#ff6b81"
                  color="#ff6b81"
                  :rules="homework"
                  :placeholder="$t('specify your opinion') + '...'"
                  v-model="coach_check_in.homework"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-form>
          <div v-if="student_check_in_is_loading" class="w-full" align="center">
            <v-progress-circular
              indeterminate
              size="64"
              color="#ff6b81"
            ></v-progress-circular>
          </div>
          <!-- Upload file -->
          <v-card v-else flat class="mb-3">
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
                      <v-btn
                        icon
                        small
                        class="bg-[#ff6b81] absolute top-0 right-0 z-[4]"
                        dark
                        @click="removeSummaryFile(index)"
                      >
                        <v-icon>mdi-close</v-icon>
                      </v-btn>
                      <video width="100%" :src="file" controls></video>
                    </v-card>
                  </template>
                  <template
                    v-if="file.attId && file.filesType.search('video') > -1"
                  >
                    <v-card flat>
                      <v-btn
                        icon
                        small
                        class="bg-[#ff6b81] absolute top-0 right-0 z-[4]"
                        dark
                        @click="removeSummaryFileInbase(file, index)"
                        ><v-icon>mdi-close</v-icon></v-btn
                      >
                      <video width="100%" :src="file.url" controls></video>
                    </v-card>
                  </template>
                  <template v-else>
                    <v-card
                      width="100%"
                      flat
                      v-if="file.attId && file.filesType.search('video') == -1"
                    >
                      <v-btn
                        icon
                        small
                        class="bg-[#cdcdcd] absolute top-0 right-8 z-[4]"
                        dark
                        @click="showAttachmentDialog(file)"
                        ><v-icon>mdi-eye</v-icon></v-btn
                      >
                      <v-btn
                        icon
                        small
                        class="bg-[#ff6b81] absolute top-0 right-0 z-[4]"
                        dark
                        @click="removeSummaryFileInbase(file, index)"
                        ><v-icon>mdi-close</v-icon>
                      </v-btn>
                      <v-img
                        :src="file.url"
                        cover
                        max-height="200"
                        width="100%"
                        align="center"
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
                    </v-card>

                    <v-card
                      width="100%"
                      flat
                      v-if="!file.attId && file.search('video') == -1"
                    >
                      <v-btn
                        icon
                        small
                        class="bg-[#cdcdcd] absolute top-0 right-8 z-[4]"
                        dark
                        @click="showAttachmentDialog(file)"
                        ><v-icon>mdi-eye</v-icon></v-btn
                      >
                      <v-btn
                        icon
                        small
                        class="bg-[#ff6b81] absolute top-0 right-0 z-[4]"
                        dark
                        @click="removeSummaryFile(index)"
                        ><v-icon>mdi-close</v-icon></v-btn
                      >
                      <v-img
                        :src="file"
                        style="max-width: 500px"
                        :aspect-ratio="16 / 9"
                        class="rounded-lg"
                        align="center"
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
                    </v-card>
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
                    src="@/assets/manage_coach/upload_file.png"
                    max-height="105"
                    max-width="122"
                  >
                  </v-img>
                </v-col>
                <v-col
                  cols="12"
                  class="flex align-center justify-center text-h5"
                >
                  {{ $t("attach a photo or video file") }}
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" class="flex align-center justify-center">
                  <v-btn
                    text
                    class="underline"
                    color="#ff6b81"
                    @click="openFileSelector"
                    >{{ $t("upload attachment") }}</v-btn
                  >
                  <input
                    id="fileInput"
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
            <v-col cols="12" sm align="right">
              <v-btn
                outlined
                :class="$vuetify.breakpoint.smAndUp ? '' : 'w-full'"
                color="#ff6b81"
                @click="clearTeachingNote"
              >
                {{ $t("delete information") }}
              </v-btn>
            </v-col>
            <v-col cols="12" sm="auto">
              <v-btn
                class="w-64"
                depressed
                color="#ff6b81"
                dark
                @click="saveSummary(student_check_in)"
                :loading="is_loading"
              >
                {{ $t("save") }}
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
                {{ $t("additional comments") }}
              </v-col>
            </v-row>
            <v-row dense>
              <v-col>
                <labelCustom :text="$t('add a comment')"></labelCustom>
                <v-textarea
                  outlined
                  color="#ff6b81"
                  v-model="comment_dialog_tmp.remark"
                ></v-textarea>
              </v-col>
            </v-row>
            <div v-if="comment_dialog_tmp.attachment.length > 0">
              <v-row dense>
                <v-col class="font-bold text-lg">{{ $t("attachments") }}</v-col>
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
                      <imgFileType :mime_type="file.filesType"></imgFileType>
                    </v-col>
                    <v-col @click="openFile(file)" class="px-2 cursor-pointer">
                      <span class="font-bold">
                        {{ file.originalFilesName }} </span
                      ><br />
                      <span class="text-caption"
                        >{{ $t("file size") }} :
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
                      src="@/assets/manage_coach/upload_file.png"
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
                      >{{ $t("upload attachment") }}</v-btn
                    >
                    <input
                      id="generalfileInput"
                      ref="generalfileInput"
                      type="file"
                      multiple
                      @change="uploadGeneralFile"
                      style="display: none"
                    />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
            <div v-if="comment_dialog_tmp.files.length > 0" class="mb-3">
              <v-row dense>
                <v-col class="font-bold text-lg">
                  {{ $t("attachments") }}</v-col
                >
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
                      <imgFileType :mime_type="file.filesType"></imgFileType>
                    </v-col>
                    <v-col class="px-2">
                      <span class="font-bold">{{ file.name }}</span
                      ><br />
                      <span class="text-caption"
                        >{{ $t("file size") }} :
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
                  {{ $t("delete information") }}
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
                  {{ $t("accepts") }}
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
                {{ $t("additional comments") }}
              </v-col>
            </v-row>
            <v-row dense>
              <v-col>
                <labelCustom :text="$t('add a comment')"></labelCustom>
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
                <v-col class="font-bold text-lg">
                  {{ $t("attachments") }}
                </v-col>
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
                      <imgFileType :mime_type="file.filesType"></imgFileType>
                    </v-col>
                    <v-col @click="openFile(file)" class="px-2 cursor-pointer">
                      <span class="font-bold">
                        {{ file.originalFilesName }}</span
                      ><br />
                      <span class="text-caption"
                        >{{ $t("file size") }} :
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
                      src="@/assets/manage_coach/upload_file.png"
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
                      >{{ $t("upload attachment") }}</v-btn
                    >
                    <input
                      id="potentialfileInput"
                      ref="potentialfileInput"
                      type="file"
                      multiple
                      @change="uploadPotentialFile"
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
                <v-col class="font-bold text-lg">
                  {{ $t("attachments") }}</v-col
                >
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
                      <imgFileType :mime_type="file.filesType"></imgFileType>
                    </v-col>
                    <v-col class="px-2">
                      <span class="font-bold">{{ file.name }}</span
                      ><br />
                      <span class="text-caption"
                        >{{ $t("file size") }} :
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
                  {{ $t("delete information") }}
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
                  {{ $t("agree") }}
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>

      <v-dialog
        persistent
        :width="$vuetify.breakpoint.smAndUp ? '60vw' : ''"
        v-model="show_attachment_dialog"
      >
        <v-card>
          <v-container grid-list-xs>
            <v-row>
              <v-col cols="12" class="text-center">
                <v-btn
                  icon
                  class="bg-[#cdcdcd] absolute top-1 right-1"
                  dark
                  @click="show_attachment_dialog = !show_attachment_dialog"
                  ><v-icon>mdi-close</v-icon></v-btn
                >
                <span class="font-weight-bold">{{ $t("image example") }} </span>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-img
                  contain
                  :src="files_attachment_dialog"
                  class="max-h-[400px] max-w-400px rounded-lg"
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
            </v-row>
          </v-container>
        </v-card>
      </v-dialog>

      <loading-overlay :loading="student_check_in_is_loading"></loading-overlay>
    </v-container>
  </v-app>
</template>
<script>
import loadingOverlay from "@/components/loading/loadingOverlay.vue";
import { dateFormatter, CheckFileSize } from "@/functions/functions";
import rowData from "@/components/label/rowData.vue";
import labelCustom from "@/components/label/labelCustom.vue";
import { mapActions, mapGetters } from "vuex";
import { Input, TimePicker } from "ant-design-vue";
import Swal from "sweetalert2";
import mixin from "@/mixin";
import imgFileType from "@/components/file_type/imgFileType.vue";

import moment from "moment";
export default {
  name: "menageCourseDetail",
  components: { rowData, loadingOverlay, labelCustom, TimePicker, imgFileType },
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
    // check_in_status_options: [
    //   {
    //     label: "punctual",
    //     value: "punctual",
    //     color: "#58A144",
    //     bg_color: "#F0F9EE",
    //   },
    //   { label: "late", value: "late", color: "#FCC419", bg_color: "#FFF9E8" },
    //   { label: "leave", value: "leave", color: "#43A4F5", bg_color: "#CFE2F3" },
    //   {
    //     label: "emergency leave",
    //     value: "emergency leave",
    //     color: "#43A4F5",
    //     bg_color: "#CFE2F3",
    //   },
    //   {
    //     label: "absent",
    //     value: "absent",
    //     color: "#F03D3E",
    //     bg_color: "#F4CCCC",
    //   },
    // ],
    learners_form: false,
    potential_form: false,
    summary_form: false,
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
    show_attachment_dialog: false,
    files_attachment_dialog: null,
    is_loading: false,
    startTime: "",
    endTime: "",
  }),
  async created() {
    await this.GetStudentByTimeId({
      course_id: this.$route.params.courseId,
      date: this.$route.params.date,
      time_id: this.$route.params.timeId,
      time_start: this.$route.params.timeStart,
      time_end : this.$route.params.timeEnd
    });
  },
  mounted() {
    this.$store.dispatch("NavberUserModules/changeTitleNavber", "management");
    this.startTime = this.$route.params.timeStart;
    this.endTime = this.$route.params.timeEnd;
  },
  watch: {
    coach_check_in: function () {
      this.preview_summary_files = [];
      if (this.coach_check_in.attachment) {
        if (this.coach_check_in?.attachment.length > 0) {
          for (const img_url of this.coach_check_in.attachment) {
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
        if (check_in_data.status === "leave") {
          this.selectCheckInStatus(check_in_data, check_in_data.status);
          this.expanded_index.push(check_in_data);
        }
      });
    },
    tab: async function () {
      await this.GetStudentByTimeId({
        course_id: this.$route.params.courseId,
        date: this.$route.params.date,
        time_id: this.$route.params.timeId,
        time_start: this.$route.params.timeStart,
        time_end :this.$route.params.timeEnd
      });
      await this.GetCoachCheckIn({
        course_id: this.$route.params.courseId,
        date: this.$route.params.date,
        time_id: this.$route.params.timeId,
        time_start: this.$route.params.timeStart,
        time_end: this.$route.params.timeEnd,
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
      studentCheckInLoading: "CoachModules/getStudentCheckInLoading",
    }),
    start_time() {
      return [(val) => !!val || this.$t("please specify start time")];
    },
    end_time() {
      return [(val) => !!val || this.$t("please specify end time")];
    },
    evolution() {
      return [(val) => !!val || this.$t("please select developmental level")];
    },
    interest() {
      return [(val) => !!val || this.$t("please select your interest level")];
    },
    interest_text() {
      return [
        (val) => !!val > 0 || this.$t("please specify the level of interest"),
      ];
    },
    summary() {
      return [(val) => !!val > 0 || this.$t("please specify teaching notes")];
    },
    homework() {
      return [
        (val) => !!val > 0 || this.$t("please specify development / homework"),
      ];
    },
    compensation_date() {
      return [(val) => !!val || this.$t("please specify a compensation date")];
    },
    status_text() {
      return [(val) => !!val || this.$t("please state your attendance status")];
    },
    headers() {
      return [
        {
          text: this.$t("no."),
          align: "center",
          sortable: false,
          value: "number",
        },
        {
          text: `${this.$t("first name")} - ${this.$t("last name")}`,
          align: "center",
          sortable: false,
          value: "fullname",
        },
        {
          text: `${this.$t("nickname")}`,
          align: "center",
          sortable: false,
          value: "nickname",
        },
        {
          text: `${this.$t("class")}`,
          align: "center",
          sortable: false,
          value: "class",
        },
        {
          text: this.$t("package"),
          align: "center",
          sortable: false,
          value: "package",
        },
        {
          text: this.$t("number of times studied"),
          align: "center",
          sortable: false,
          value: "class_time",
        },
        {
          text: this.$t("attendance"),
          align: "center",
          width: "200",
          sortable: false,
          value: "actions",
        },
      ];
    },
    setFunctios() {
      this.GetCourse(this.$route.params.courseId);
      this.GetCoachCheckIn({
        course_id: this.$route.params.courseId,
        date: this.$route.params.date,
        time_id: this.$route.params.timeId,
        time_start: this.$route.params.timeStart,
        time_end: this.$route.params.timeEnd,
      });

      return "";
    },
    check_in_status_options() {
      return [
        {
          label: this.$t("punctual"),
          value: "punctual",
          color: "#58A144",
          bg_color: "#F0F9EE",
        },
        {
          label: this.$t("late"),
          value: "late",
          color: "#FCC419",
          bg_color: "#FFF9E8",
        },
        {
          label: this.$t("leave"),
          value: "leave",
          color: "#43A4F5",
          bg_color: "#CFE2F3",
        },
        {
          label: this.$t("emergency leave"),
          value: "emergency leave",
          color: "#43A4F5",
          bg_color: "#CFE2F3",
        },
        {
          label: this.$t("absent"),
          value: "absent",
          color: "#F03D3E",
          bg_color: "#F4CCCC",
        },
      ];
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
    // matchStartTime(items) {
    //   const matchedStudents = items.filter((student) => {
    //     return (
    //       student.timeStart === this.startTime &&
    //       student.timeEnd === this.endTime
    //     );
    //   });
    //   return matchedStudents;
    // },

    showAttachmentDialog(item) {
      this.files_attachment_dialog = item.url ? item.url : item;
      this.show_attachment_dialog = true;
    },
    //check in by date
    CheckInByDate() {
      let check_in_date = moment(this.$route.params.date).format("YYYY-MM-DD")
      let today = moment().format("YYYY-MM-DD")
      if(moment(today).isSame(check_in_date)){
        return false
      }else{
        return true
      }

      // const current = moment().format("YYYY/MM/DD");
      // const currentMoment = moment(current);
      // const teachingDate = this.$route.params.date;
      // const countDate = currentMoment.isBefore(teachingDate);
      // console.log("countDate :>> ", countDate);

      // return false;
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
      } else if (this.course_data.course_type_id === "CT_2") {
        return this.check_in_status_options.filter((v) => v.value !== "leave");
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
      return new Date(data).toLocaleDateString(
        this.$i18n.locale == "th" ? "th-TH" : "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
          weekday: "long",
        }
      );
    },
    async saveSummary(items) {
      let student_id = [];
      await items.map((val) => {
        student_id.push({ studentId: val.studentId });
      });

      this.$refs.summary_form.validate();
      if (this.summary_form) {
        Swal.fire({
          icon: "question",
          title: this.$t("want to save?"),
          showDenyButton: false,
          showCancelButton: true,
          confirmButtonText: this.$t("agree"),
          cancelButtonText: this.$t("no"),
        }).then(async (result) => {
          if (result.isConfirmed) {
            this.is_loading = true;
            await this.UploadFileSummary({
              checkInCoach: this.coach_check_in,
              files: this.coach_check_in.summary_files,
              course_id: this.$route.params.courseId,
              date: this.$route.params.date,
            }).then(async () => {
              // setTimeout (() => {
              // await this.GetCheckInCoach({
              //   course_id: this.course_data.course_id,
              //   date: this.$route.params.date,
              //   time_id: this.$route.params.timeId,
              //   time_start: this.$route.params.timeStart,
              //   time_end: this.$route.params.timeEnd,
              //   type: this.$route.params.typeEvent,
              // });
              await this.GetCoachCheckIn({
                course_id: this.$route.params.courseId,
                date: this.$route.params.date,
                time_id: this.$route.params.timeId,
                time_start: this.$route.params.timeStart,
                time_end: this.$route.params.timeEnd,
              });
              // }, 200);
            });

            this.is_loading = false;
            if (student_id.length > 0) {
              let payload = {
                notificationName: "แจ้งเตือนการบันทึกสรุปการสอน",
                notificationNameEn:
                  "Notification for recording teaching summary",
                notificationDescription: `โค้ชบันทึกสรุปของคอร์ส ${this.course_data.course_name_th} เรียบร้อยแล้ว`,
                notificationDescriptionEn: `The coach has already recorded the summary of the ${this.course_data.course_name_en}`,
                accountId: student_id,
                path: null,
              };

              this.sendNotification(payload);
            }
          }
        });
      }
    },
    async saveUpdateAssessmentPotential(item) {
      let potential_student = [];
      await item.map((val) => {
        if (val.totalDay - val.countCheckIn === 0) {
          potential_student.push({ studentId: val.studentId });
        }
      });
      this.$refs.potential_form.validate();
      if (this.potential_form) {
        Swal.fire({
          icon: "question",
          title: this.$t("want to save?"),
          showDenyButton: false,
          showCancelButton: true,
          confirmButtonText: this.$t("agree"),
          cancelButtonText: this.$t("no"),
        }).then(async (result) => {
          if (result.isConfirmed) {
            await this.UpdateAssessmentPotential({
              students: this.student_check_in,
              course_id: this.$route.params.courseId,
              date: this.$route.params.date,
              time_id: this.$route.params.timeId,
              time_start: this.$route.params.timeStart,
              time_end : this.$route.params.timeEnd
            });

            if (potential_student.length > 0) {
              let payload = {
                notificationName: "แจ้งเตือนการประเมินศักยภาพผู้เรียน",
                notificationNameEn:
                  "Notification of student potential assessment",
                notificationDescription: `โค้ชบันทึกสรุปของคอร์ส ${this.course_data.course_name_th} เรียบร้อยแล้ว`,
                notificationDescriptionEn: `The coach assesses the potential of the course's students ${this.course_data.course_name_en} completed`,
                accountId: potential_student,
                path: null,
              };

              this.sendNotification(payload);
            }
          }
        });
      }
    },
    saveCreateTeachingNotes() {
      Swal.fire({
        icon: "question",
        title: this.$t("want to save?"),
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: this.$t("agree"),
        cancelButtonText: this.$t("no"),
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
          title: this.$t("want to save?"),
          showDenyButton: false,
          showCancelButton: true,
          confirmButtonText: this.$t("agree"),
          cancelButtonText: this.$t("no"),
        }).then(async (result) => {
          if (result.isConfirmed) {
            await this.AssessmentStudent({
              students: this.student_check_in,
              course_id: this.$route.params.courseId,
              date: this.$route.params.date,
              time_id: this.$route.params.timeId,
              time_start: this.$route.params.timeStart,
              time_end: this.$route.params.timeEnd
            });
            let payload = {
              notificationName: "แจ้งเตือนการประเมินผู้เรียน",
              notificationNameEn: "Learner assessment notification",
              notificationDescription: "โค้ชได้ประเมินนักเรียนเรียบร้อยแล้ว",
              notificationDescriptionEn:
                "The coach has already assessed the student.",
              accountId: this.student_check_in,
              path: `/studentCourse/${this.$route.params.courseId}`,
            };

            this.sendNotification(payload);
          }
        });
      }
    },
    async CheckInStudents(item) {
      let student_id = [];
      let graduate_student_id = [];

      await item.map((val) => {
        student_id.push({ studentId: val.studentId });
        if (val.totalDay - val.countCheckIn === 1) {
          graduate_student_id.push({ studentId: val.studentId });
        }
        if (val.status === "leave" && !val.compensationDate) {
          Swal.fire({
            icon: "question",
            title: this.$t("please select the compensation date again"),
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
          val.compensationDate == "";
          val.compensation_date_str == "";
        }
      });

      this.$refs.validate_form.validate();
      if (this.validate_form) {
        Swal.fire({
          icon: "question",
          title: this.$t("want to save?"),
          showDenyButton: false,
          showCancelButton: true,
          confirmButtonText: this.$t("agree"),
          cancelButtonText: this.$t("no"),
        }).then(async (result) => {
          if (result.isConfirmed) {
            this.UpdateCheckInStudent({
              students: this.student_check_in,
              course_id: this.$route.params.courseId,
              date: this.$route.params.date,
              time_id: this.$route.params.timeId,
              time_start: this.$route.params.timeStart,
              time_end: this.$route.params.timeEnd
            });
            let payload = {
              notificationName: "แจ้งเตือนการเช็คอิน",
              notificationNameEn: "Check-in notification",
              notificationDescription: `เช็คอินคอร์ส ${this.course_data.course_name_th} เรียบร้อยแล้ว`,
              notificationDescriptionEn: `Course ${this.course_data.course_name_en} has been successfully checked in.`,
              accountId: student_id,
              path: null,
            };
            this.sendNotification(payload);

            if (graduate_student_id.length > 0) {
              let graduate_payload = {
                notificationName: "แจ้งเตือนการเรียน",
                notificationNameEn: "Study reminder",
                notificationDescription: `คอร์ส${this.course_data.course_name_th} ของท่านใกล้จะครบแพ็คเกจแล้วสามารถเลือกซื้อคอร์สเพิ่มเติมได้ค่ะ`,
                notificationDescriptionEn: `Your ${this.course_data.course_name_en} course is almost complete. You can choose to purchase additional courses.`,
                accountId: graduate_student_id,
                path: null,
              };

              this.sendNotification(graduate_payload);
            }
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
          title: this.$t("want to invest time in teaching?"),
          showDenyButton: false,
          showCancelButton: true,
          confirmButtonText: this.$t("agree"),
          cancelButtonText: this.$t("no"),
        }).then(async (result) => {
          if (result.isConfirmed) {
            this.check_in = true;
            await this.CheckInCoach({
              course_id: this.course_data.course_id,
              date: this.$route.params.date,
              time_id: this.$route.params.timeId,
              time_start: this.$route.params.timeStart,
              time_end: this.$route.params.timeEnd,
              type: this.course_data.course_type_id,
              // type: this.$route.params.typeEvent,
            }).then(async () => {
              await this.GetCoachCheckIn({
                course_id: this.$route.params.courseId,
                date: this.$route.params.date,
                time_id: this.$route.params.timeId,
                time_start: this.$route.params.timeStart,
                time_end: this.$route.params.timeEnd,
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
      this.comment_dialog_tmp.remark = "";
      this.comment_dialog_tmp.files = [];
      this.selected_files = [];
    },
    closeStudentComment() {
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
      if (status === "leave") {
        this.expanded_index.push(item);
      } else {
        this.expanded_index.forEach((expanded, index) => {
          if (expanded.checkInStudentId === item.checkInStudentId) {
            this.expanded_index.splice(index, 1);
          }
        });
        item.compensation_date_str = null;
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
      Swal.fire({
        icon: "question",
        title: this.$t("do you want to delete it?"),
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: this.$t("agree"),
        cancelButtonText: this.$t("no"),
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
      Swal.fire({
        icon: "question",
        title: this.$t("do you want to delete it?"),
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: this.$t("agree"),
        cancelButtonText: this.$t("no"),
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
    uploadGeneralFile(event) {
      const files = this.$refs.generalfileInput.files;
      if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          if (CheckFileSize(files[i], event.target.id) === true) {
            this.selected_files.push(files[i]);
            this.comment_dialog_tmp.files.push(files[i]);
          }
        }
      }
    },
    uploadPotentialFile(event) {
      const files = this.$refs.potentialfileInput.files;
      if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          if (CheckFileSize(files[i], event.target.id) === true) {
            this.selected_files.push(files[i]);
            this.comment_potential_dialog_tmp.files.push(files[i]);
          }
        }
      }
    },

    previewSummaryFile(event) {
      let accept = event.target.accept.split(",");
      const selectedFiles = event.target.files;
      const fileUrls = [];
      let type_file = [];
      for (let type of accept) {
        type_file.push(type.split("/")[0]);
      }
      for (let i = 0; i < selectedFiles.length; i++) {
        let file_type = selectedFiles[i].type.split("/");
        if (type_file.includes(file_type[0])) {
          if (CheckFileSize(selectedFiles[i], event.target.id) === true) {
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
        } else {
          Swal.fire({
            icon: "error",
            title: this.$t("please upload only photo and video files"),
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        }
      }
    },
    removeSummaryFile(index) {
      let index_att = 0;
      if (this.coach_check_in.attachment.length > 0) {
        index_att = this.coach_check_in.attachment.length;
      }
      this.coach_check_in.summary_files.splice(index - index_att, 1);
      this.preview_summary_files.splice(index, 1);
    },
    removeSummaryFileInbase(file, index) {
      Swal.fire({
        icon: "question",
        title: this.$t("do you want to delete it?"),
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: this.$t("agree"),
        cancelButtonText: this.$t("no"),
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

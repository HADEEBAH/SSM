<template>
  <v-app>
    <v-container>
      {{ setFunctions }}
      <loading-overlay :loading="course_is_loading"></loading-overlay>
      <header-page :breadcrumbs="breadcrumbs"></header-page>

      <v-row class="mb-3">
        <v-col cols="12" sm @click="tab = 'course'">
          <img-card
            vertical
            class="cursor-pointer"
            :class="tab === 'course' ? 'img-card-active' : ''"
          >
            <template v-slot:img>
              <v-img
                height="72"
                width="72"
                src="@/assets/course/course.png"
              ></v-img>
              <span class="text-lg font-bold"> {{ $t("course") }} </span>
            </template>
          </img-card>
        </v-col>
        <v-col
          v-if="course_data.course_type_id === 'CT_1'"
          cols="12"
          sm
          @click="tab = 'time and coach'"
        >
          <img-card
            vertical
            class="cursor-pointer"
            :class="tab === 'time and coach' ? 'img-card-active' : ''"
          >
            <template v-slot:img>
              <v-img
                height="72"
                width="72"
                src="@/assets/course/time_and_coach.png"
              ></v-img>
              <span class="text-lg font-bold">
                {{ $t("time and coach") }}
              </span>
            </template>
          </img-card>
        </v-col>
        <v-col
          v-if="course_data.course_type_id === 'CT_1'"
          cols="12"
          sm
          @click="tab = 'package'"
        >
          <img-card
            vertical
            class="cursor-pointer"
            :class="tab === 'package' ? 'img-card-active' : ''"
          >
            <template v-slot:img>
              <v-img
                height="72"
                width="72"
                src="@/assets/course/package.png"
              ></v-img>
              <span class="text-lg font-bold"> {{ $t("package") }} </span>
            </template>
          </img-card>
        </v-col>
        <v-col
          v-if="course_data.course_type_id === 'CT_1'"
          cols="12"
          sm
          @click="tab = 'arkwork'"
        >
          <img-card
            vertical
            class="cursor-pointer"
            :class="tab === 'arkwork' ? 'img-card-active' : ''"
          >
            <template v-slot:img>
              <v-img
                height="72"
                width="72"
                src="@/assets/course/upload_file.png"
              ></v-img>
              <span class="text-lg font-bold"> Learning Journey </span>
            </template>
          </img-card>
        </v-col>

        <v-col cols="12" sm @click="tab = 'student list'">
          <img-card
            vertical
            class="cursor-pointer"
            :class="tab === 'student list' ? 'img-card-active' : ''"
          >
            <template v-slot:img>
              <v-img
                height="72"
                width="72"
                src="@/assets/course/student_list.png"
              ></v-img>
              <span class="text-lg font-bold"> {{ $t("student list") }} </span>
            </template>
          </img-card>
        </v-col>
      </v-row>
      <!-- BODY -->
      <v-card v-if="!course_is_loading">
        <v-card-text>
          <v-tabs-items v-model="tab">
            <!-- COURSE -->
            <v-tab-item value="course">
              <v-form ref="course_form" v-model="courseValidate">
                <course-card
                  :disable="!course_edit"
                  edited
                  :categorys="categorys"
                  :coachs="coachs"
                ></course-card>
              </v-form>
              <!-- ACTION -->
              <v-row class="px-4" v-if="!course_edit">
                <v-col align="right">
                  <v-btn
                    color="#FF6B81"
                    class="white--text btn-size-lg"
                    depressed
                    @click="course_edit = true"
                  >
                    {{ $t("edit") }}
                  </v-btn>
                </v-col>
              </v-row>
              <v-row class="px-4" v-if="course_edit">
                <v-col align="right">
                  <v-btn
                    color="#FF6B81"
                    class="btn-size-lg"
                    outlined
                    @click="cancelEdit()"
                    >{{ $t("cancel") }}</v-btn
                  >
                </v-col>
                <v-col cols="auto">
                  <v-btn
                    color="#FF6B81"
                    class="white--text btn-size-lg"
                    depressed
                    @click="CourseUpdateDetail()"
                  >
                    {{ $t("save") }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-tab-item>
            <!-- COACH AND TIME -->
            <v-tab-item value="time and coach">
              <v-card flat class="mb-3">
                <headerCard :title="$t('details of time and coach')">
                  <template v-slot:actions>
                    <v-btn
                      outlined
                      :disabled="!course_edit"
                      color="#FF6B81"
                      @click="addCoach"
                    >
                      <v-icon>mdi-plus-circle-outline</v-icon>
                      {{ $t("add coach") }}
                    </v-btn>
                  </template>
                </headerCard>
                <v-card-text class="pt-0">
                  <v-divider class="mb-3"></v-divider>
                  <v-form ref="coach_form" v-model="coachValidate">
                    <!-- COACH -->
                    <coachs-card
                      :disable="!course_edit"
                      :coachs="coachs"
                      edited
                    ></coachs-card>
                  </v-form>
                </v-card-text>
              </v-card>
              <!-- ACTION -->
              <v-row class="px-4" v-if="!course_edit">
                <v-col align="right">
                  <v-btn
                    color="#FF6B81"
                    class="white--text btn-size-lg"
                    depressed
                    @click="course_edit = true"
                  >
                    {{ $t("edit") }}
                  </v-btn>
                </v-col>
              </v-row>
              <v-row class="px-4" v-if="course_edit">
                <v-col align="right">
                  <v-btn
                    color="#FF6B81"
                    class="btn-size-lg"
                    outlined
                    @click="cancelEdit()"
                  >
                    {{ $t("cancel") }}</v-btn
                  >
                </v-col>
                <v-col cols="auto">
                  <v-btn
                    color="#FF6B81"
                    class="white--text btn-size-lg"
                    depressed
                    @click="CourseUpdateCoach()"
                    >{{ $t("save") }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-tab-item>
            <!-- PACKAGE -->
            <v-tab-item value="package">
              <v-form ref="package_form" v-model="packageValidate">
                <package-card :disable="!course_edit" edited></package-card>
              </v-form>
              <v-row dense>
                <v-col align="center">
                  <v-btn
                    :disabled="!course_edit"
                    outlined
                    color="#ff6b81"
                    @click="addPackage(course_data.packages)"
                    ><v-icon>mdi-plus</v-icon> {{ $t("add package") }}</v-btn
                  >
                </v-col>
              </v-row>
              <!-- ACTION -->
              <v-row class="px-4" v-if="!course_edit">
                <v-col align="right">
                  <v-btn
                    color="#FF6B81"
                    class="white--text btn-size-lg"
                    depressed
                    @click="course_edit = true"
                  >
                    {{ $t("edit") }}
                  </v-btn>
                </v-col>
              </v-row>
              <v-row class="px-4" v-if="course_edit">
                <v-col align="right">
                  <v-btn
                    color="#FF6B81"
                    class="btn-size-lg"
                    outlined
                    @click="cancelEdit()"
                  >
                    {{ $t("cancel") }}
                  </v-btn>
                </v-col>
                <v-col cols="auto">
                  <v-btn
                    color="#FF6B81"
                    class="white--text btn-size-lg"
                    depressed
                    @click="CourseUpdatePackage()"
                  >
                    {{ $t("save") }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-tab-item>
            <!-- ARKWORk -->
            <v-tab-item value="arkwork">
              <v-card class="mx-3 mb-3" flat>
                <headerCard :title="$t('special rights')"></headerCard>
                <v-card-text
                  class="border-dashed border-2 border-blue-600 rounded-lg"
                >
                  <v-row
                    v-if="
                      course_data.course_img_privilege || preview_privilege_url
                    "
                  >
                    <v-col align="center" class="rounded-lg pa-0">
                      <v-img
                        :src="
                          course_data.course_img_privilege
                            ? course_data.course_img_privilege
                            : preview_privilege_url
                        "
                        contain
                        style="max-width: 200px"
                        align="right"
                      >
                        <v-btn
                          v-if="course_edit && course_data.course_img_privilege"
                          icon
                          class="bg-[#f00]"
                          dark
                          @click="removePrivilegeFileData"
                          ><v-icon>mdi-close</v-icon></v-btn
                        >
                        <v-btn
                          v-else-if="course_edit && preview_privilege_url"
                          icon
                          class="bg-[#f00]"
                          dark
                          @click="removePrivilegeFile"
                          ><v-icon>mdi-close</v-icon></v-btn
                        >
                      </v-img>
                    </v-col>
                  </v-row>
                  <v-row
                    v-if="
                      !preview_privilege_url &&
                      !course_data.course_img_privilege
                    "
                  >
                    <v-col cols="12" class="flex align-center justify-center">
                      <v-img
                        src="@/assets/course/upload_file.png"
                        max-height="105"
                        max-width="122"
                      ></v-img>
                    </v-col>
                    <v-col
                      cols="12"
                      class="flex align-center justify-center text-h5"
                    >
                      {{ $t("upload privileged images") }}
                    </v-col>
                    <v-col
                      cols="12"
                      class="flex align-center justify-center text-caption"
                    >
                      (
                      {{
                        $t(
                          "suggestion : Should upload an image with size 1024 x 576 (16:9) and file size not over 5 Mb must be JPG, PNG file"
                        )
                      }}
                      )
                    </v-col>
                    <v-col cols="12" class="flex align-center justify-center">
                      <v-btn
                        outlined
                        color="blue"
                        :disabled="!course_edit"
                        @click="openFilePrivilegeSelector"
                        >{{ $t("select file") }}</v-btn
                      >
                      <input
                        id="fileInputPrivilege"
                        ref="fileInputPrivilege"
                        type="file"
                        @change="uploadPrivilegeFile"
                        accept="image/png, image/jpeg"
                        style="display: none"
                      />
                    </v-col>
                  </v-row>
                </v-card-text>
                <headerCard title="Learning Journey"></headerCard>
                <v-card-text
                  class="border-dashed border-2 border-blue-600 rounded-lg"
                >
                  <v-row
                    v-if="
                      preview_artwork_files && preview_artwork_files.length > 0
                    "
                  >
                    <v-col
                      cols="3"
                      align="center"
                      class="rounded-lg pa-2"
                      v-for="(file, index) in preview_artwork_files"
                      :key="index"
                    >
                      <v-img
                        v-if="file?.artworkCourseId"
                        :src="file.attachmentUrl"
                        contain
                        max-height="200"
                        max-width="200"
                        align="right"
                      >
                        <v-btn
                          v-if="course_edit"
                          icon
                          class="bg-[#f00]"
                          dark
                          @click="removeArtworkFileData(file, index)"
                          ><v-icon>mdi-close</v-icon></v-btn
                        >
                      </v-img>
                      <v-img
                        v-else
                        :src="file"
                        contain
                        max-height="200"
                        max-width="200"
                        align="right"
                      >
                        <v-btn
                          v-if="course_edit"
                          icon
                          class="bg-[#f00]"
                          dark
                          @click="removeArtworkFile(index)"
                          ><v-icon>mdi-close</v-icon></v-btn
                        >
                      </v-img>
                    </v-col>
                  </v-row>
                  <v-row
                    v-if="
                      !preview_artwork_files ||
                      preview_artwork_files.length == 0
                    "
                  >
                    <v-col cols="12" class="flex align-center justify-center">
                      <v-img
                        src="@/assets/course/upload_file.png"
                        max-height="105"
                        max-width="122"
                      ></v-img>
                    </v-col>
                    <v-col
                      cols="12"
                      class="flex align-center justify-center text-h5"
                    >
                      {{ $t("upload Learning Journey") }}
                    </v-col>
                    <v-col
                      cols="12"
                      class="flex align-center justify-center text-caption"
                    >
                      (
                      {{
                        $t(
                          "suggestion : Should upload an image with size 1024 x 576 (16:9) and file size not over 5 Mb must be JPG, PNG file"
                        )
                      }}
                      )
                    </v-col>
                  </v-row>
                  <v-row dense>
                    <v-col align="center">
                      <input
                        ref="fileInputArtwork"
                        type="file"
                        @change="previewArtWorkFile"
                        accept="image/png, image/jpeg"
                        multiple
                        style="display: none"
                      />
                      <v-btn
                        :disabled="!course_edit"
                        outlined
                        color="blue"
                        @click="openFileArtworSelector"
                        >{{ $t("select file") }}</v-btn
                      >
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
              <!-- ACTION -->
              <v-row class="px-4" v-if="!course_edit">
                <v-col align="right">
                  <v-btn
                    color="#FF6B81"
                    class="white--text btn-size-lg"
                    depressed
                    @click="course_edit = true"
                  >
                    {{ $t("edit") }}
                  </v-btn>
                </v-col>
              </v-row>
              <v-row class="px-4" v-if="course_edit">
                <v-col align="right">
                  <v-btn
                    color="#FF6B81"
                    class="btn-size-lg"
                    outlined
                    @click="cancelEdit()"
                    >{{ $t("cancel") }}</v-btn
                  >
                </v-col>
                <v-col cols="auto">
                  <v-btn
                    color="#FF6B81"
                    class="white--text btn-size-lg"
                    depressed
                    @click="CourseUpdateArkwork()"
                  >
                    {{ $t("save") }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-tab-item>
            <!-- STUDENT LIST -->
            <v-tab-item value="student list">
              <v-row>
                <v-col>
                  <v-tabs v-model="student_tab" color="#ff6b81" class="mb-3">
                    <v-tab value="students in course">{{
                      $t("students in the course")
                    }}</v-tab>
                    <v-tab value="student booking">{{
                      $t("students reserve")
                    }}</v-tab>
                    <v-tab value="student potential">{{
                      $t("students complete the course")
                    }}</v-tab>
                  </v-tabs>
                </v-col>
                <v-col cols="auto">
                  <v-btn
                    v-if="student_tab == 0"
                    :disabled="!coach_list.some((v) => v.checked === true)"
                    depressed
                    color="#ff6b81"
                    :dark="coach_list.some((v) => v.checked === true)"
                    @click="exportStudents()"
                  >
                    {{ $t("export") }}
                  </v-btn>
                </v-col>
              </v-row>
              <v-tabs-items v-model="student_tab" class="rounded-lg">
                <v-tab-item valus="students in course">
                  <v-card flat dent class="mb-3 rounded-lg">
                    <v-card-text class="py-2 bg-[#FCE0E7] rounded-lg">
                      <v-row dense class="d-flex align-center">
                        <v-col cols="auto">
                          <v-btn icon @click="selectAllCoach()">
                            <v-icon color="#ff6b81">{{
                              selected_all_coach
                                ? "mdi-checkbox-marked"
                                : "mdi-checkbox-blank-outline"
                            }}</v-icon>
                          </v-btn>
                        </v-col>
                        <v-col class="text-[#ff6b81] font-bold">{{
                          $t("coach list")
                        }}</v-col>
                        <v-col cols="auto">
                          <v-text-field
                            class="bg-white rounded-lg"
                            v-model="search_student_list"
                            dense
                            outlined
                            hide-details
                            :placeholder="
                              $t('search for student name, coach name')
                            "
                            prepend-inner-icon="mdi-magnify"
                            @input="searchStudentList(search_student_list)"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                  <v-row dense v-if="coach_list_is_loading">
                    <v-col align="center">
                      <v-progress-circular
                        indeterminate
                        color="red"
                      ></v-progress-circular>
                    </v-col>
                  </v-row>
                  <template v-else>
                    <div
                      v-if="
                        search_student_list
                          ? search_student_datas.length === 0
                          : coach_list?.filter(
                              (v) => v.allDates?.studentArr.length > 0
                            ).length === 0
                      "
                    >
                      <v-card dense outlined>
                        <v-card-text>
                          <v-row>
                            <v-col class="font-bold" align="center">
                              {{ $t("no data found") }}
                            </v-col>
                          </v-row>
                        </v-card-text>
                      </v-card>
                    </div>
                    <template v-else>
                      <div
                        v-for="(coach, coach_index) in search_student_list
                          ? search_student_datas
                          : coach_list?.filter(
                              (v) => v.allDates?.studentArr.length > 0
                            )"
                        :key="`${coach_index}-coach_index`"
                      >
                        <v-card
                          v-if="coach.allDates?.studentArr.length > 0"
                          outlined
                          dense
                          class="rounded-lg cursor-pointer mb-3 bg-[#FCFCFC]"
                        >
                          <v-card-text class="pa-2">
                            <v-row dense class="d-flex align-center">
                              <v-col cols="auto">
                                <v-btn icon @click="selectCoachChecked(coach)">
                                  <v-icon color="#ff6b81">{{
                                    coach.checked
                                      ? "mdi-checkbox-marked"
                                      : "mdi-checkbox-blank-outline"
                                  }}</v-icon>
                                </v-btn>
                              </v-col>
                              <v-col
                                cols="auto"
                                @click="selectCoach(coach, coach_index)"
                              >
                                <v-icon color="#ff6b81">mdi-account</v-icon>
                              </v-col>
                              <v-col
                                @click="selectCoach(coach, coach_index)"
                                class="font-bold"
                              >
                                {{ $t("coach") }}:
                                {{
                                  $i18n.locale == "th"
                                    ? `${coach.firstNameTh} ${coach.lastNameTh}`
                                    : `${coach.firstNameEn} ${coach.lastNameEn}`
                                }}
                              </v-col>
                              <v-col
                                cols="auto"
                                @click="selectCoach(coach, coach_index)"
                              >
                                <v-icon
                                  >{{
                                    selected_coach === coach_index
                                      ? "mdi-chevron-up"
                                      : "mdi-chevron-down"
                                  }}
                                </v-icon>
                              </v-col>
                            </v-row>
                          </v-card-text>
                        </v-card>
                        <v-expand-transition>
                          <div
                            v-if="selected_coach === coach_index"
                            class="pa-3 bg-[#FCFCFC] rounded-b-lg"
                          >
                            <!-- FILTER -->
                            <v-row dense class="mb-3">
                              <v-col>
                                <v-autocomplete
                                  dense
                                  v-model="filter.dow"
                                  outlined
                                  hide-details
                                  item-text="label"
                                  item-value="value"
                                  :items="dow_option"
                                  :placeholder="$t('day')"
                                  @change="filterDateByCoach(coach_index)"
                                ></v-autocomplete>
                              </v-col>
                              <v-col>
                                <v-menu
                                  ref="menu1"
                                  v-model="filter.date_menu"
                                  :close-on-content-click="false"
                                  transition="scale-transition"
                                  offset-y
                                  max-width="290px"
                                  min-width="auto"
                                >
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                      dense
                                      outlined
                                      v-model="filter.date"
                                      :placeholder="$t('date')"
                                      persistent-hint
                                      append-icon="mdi-calendar"
                                      v-bind="attrs"
                                      v-on="on"
                                    ></v-text-field>
                                  </template>
                                  <v-date-picker
                                    v-model="filter.date"
                                    no-title
                                    @change="filterDateByCoach(coach_index)"
                                    @input="filter.date_menu = false"
                                    locale="th-TH"
                                  ></v-date-picker>
                                </v-menu>
                              </v-col>
                              <v-col>
                                <v-autocomplete
                                  v-model="filter.time"
                                  :items="time_option"
                                  outlined
                                  item-value="timeId"
                                  dense
                                  :placeholder="$t('times')"
                                  cache-items
                                  @change="filterDateByCoach(coach_index)"
                                >
                                  <template v-slot:selection="{ item }">
                                    {{
                                      `${item.start} - ${item.end} ${$t(
                                        "o'clock"
                                      )}`
                                    }}
                                  </template>
                                  <template v-slot:item="{ item }">
                                    <v-list-item-content>
                                      <v-list-item-title>
                                        {{
                                          `${item.start} - ${item.end} ${$t(
                                            "o'clock"
                                          )}`
                                        }}
                                      </v-list-item-title>
                                    </v-list-item-content>
                                  </template>
                                </v-autocomplete>
                              </v-col>
                              <v-col>
                                <v-autocomplete
                                  dense
                                  v-model="filter.package"
                                  outlined
                                  hide-details
                                  item-text="packageName"
                                  item-value="packageId"
                                  :items="package_option"
                                  :placeholder="$t('package')"
                                  @change="filterDateByCoach(coach_index)"
                                ></v-autocomplete>
                              </v-col>
                              <v-col cols="auto">
                                <v-btn
                                  color="#ff6b81"
                                  @click="resetFilter()"
                                  icon
                                  ><v-icon>mdi-refresh</v-icon></v-btn
                                >
                              </v-col>
                            </v-row>
                            <!-- Herder -->
                            <v-row
                              dense
                              class="mb-3 font-bold"
                              v-if="
                                coach.datesList.length > 0 &&
                                coach.allDates.studentArr.length > 0
                              "
                            >
                              <v-col cols="auto">
                                <div style="width: 44px"></div>
                              </v-col>
                              <v-col cols="3" align="center">{{
                                $t("day and date")
                              }}</v-col>
                              <v-col cols="3" align="center">{{
                                $t("class time")
                              }}</v-col>
                              <v-col
                                cols="3"
                                align="center"
                                v-if="course_data.course_type_id === 'CT_1'"
                                >{{ $t("package") }}</v-col
                              >
                              <v-col align="right"></v-col>
                            </v-row>
                            <v-card
                              v-if="
                                coach.datesList.length === 0 ||
                                coach.allDates.studentArr.length === 0
                              "
                              outlined
                              class="my-3"
                            >
                              <v-card-text
                                class="text-lg font-bold"
                                align="center"
                              >
                                {{ $t("student information not found") }}
                              </v-card-text>
                            </v-card>
                            <div
                              v-if="
                                coach.datesList.length > 0 &&
                                coach.allDates.studentArr.length > 0
                              "
                            >
                              <div
                                v-for="(date, index_date) in filterDateByCoach(
                                  coach_index
                                )"
                                :key="`${index_date}-date`"
                              >
                                <v-card
                                  @click="selectSchedule(index_date, date)"
                                  outlined
                                  class="rounded-lg cursor-pointer mb-3"
                                  dense
                                >
                                  <v-card-text class="pa-2">
                                    <v-row dense class="d-flex align-center">
                                      <v-col cols="auto">
                                        <v-btn
                                          icon
                                          @click="selectDateChecked(date)"
                                        >
                                          <v-icon color="#ff6b81">{{
                                            date.checked
                                              ? "mdi-checkbox-marked"
                                              : "mdi-checkbox-blank-outline"
                                          }}</v-icon>
                                        </v-btn>
                                      </v-col>
                                      <v-col
                                        cols="3"
                                        class="font-bold"
                                        align="center"
                                        >{{
                                          getDateFormattor(
                                            date.date,
                                            "DW DD MMT YYYYT"
                                          )
                                        }}
                                      </v-col>
                                      <v-col
                                        cols="3"
                                        class="font-bold"
                                        align="center"
                                      >
                                        {{ date.time }}
                                      </v-col>
                                      <v-col
                                        cols="3"
                                        align="center"
                                        v-if="
                                          course_data.course_type_id === 'CT_1'
                                        "
                                      >
                                        <v-chip
                                          text-color="white"
                                          :color="
                                            date.cpo.packageId === 'PACK_1'
                                              ? 'primary'
                                              : date.cpo.packageId === 'PACK_2'
                                              ? 'pink'
                                              : '#ED7D2B'
                                          "
                                        >
                                          {{ date.cpo.packageName }}
                                        </v-chip>
                                      </v-col>
                                      <v-col align="right">
                                        <v-icon
                                          >{{
                                            selected_schedule === index_date
                                              ? "mdi-chevron-up"
                                              : "mdi-chevron-down"
                                          }}
                                        </v-icon>
                                      </v-col>
                                    </v-row>
                                  </v-card-text>
                                </v-card>
                                <v-expand-transition>
                                  <div
                                    v-if="selected_schedule === index_date"
                                    class="px-3 mb-3"
                                  >
                                    <v-row dense v-if="student_list_is_loading">
                                      <v-col align="center">
                                        <v-progress-circular
                                          indeterminate
                                          color="red"
                                        ></v-progress-circular>
                                      </v-col>
                                    </v-row>
                                    <template v-else>
                                      <div
                                        v-if="
                                          student_list.filter(
                                            (v) =>
                                              v.cpo?.packageName ===
                                              date.cpo?.packageName
                                          ).length === 0 &&
                                          date.students.length === 0
                                        "
                                      >
                                        <v-card dense outlined>
                                          <v-card-text>
                                            <v-row>
                                              <v-col
                                                class="font-bold"
                                                align="center"
                                              >
                                                {{
                                                  $t(
                                                    "student information not found"
                                                  )
                                                }}
                                              </v-col>
                                            </v-row>
                                          </v-card-text>
                                        </v-card>
                                      </div>
                                      <div v-else>
                                        <v-row
                                          dense
                                          class="d-flex align-center mb-2"
                                        >
                                          <v-col>
                                            <v-divider></v-divider>
                                          </v-col>
                                          <v-col cols="auto">
                                            {{ $t("student information") }}
                                          </v-col>
                                          <v-col>
                                            <v-divider></v-divider>
                                          </v-col>
                                        </v-row>
                                        <v-card class="mb-2" flat dense>
                                          <v-card-text
                                            class="pa-2 bg-[#FCE0E7] rounded-lg"
                                          >
                                            <v-row
                                              dense
                                              class="text-md font-bold"
                                            >
                                              <v-col cols="1" align="center">{{
                                                $t("no.")
                                              }}</v-col>
                                              <v-col cols align="center">
                                                {{ $t("first name") }} -
                                                {{ $t("last name") }}
                                              </v-col>
                                              <v-col
                                                cols="2"
                                                align="center"
                                                v-if="
                                                  course_data.course_type_id ===
                                                  'CT_1'
                                                "
                                              >
                                                {{ $t("period") }}
                                              </v-col>
                                              <v-col
                                                cols="2"
                                                align="center"
                                                v-if="
                                                  course_data.course_type_id ===
                                                  'CT_1'
                                                "
                                              >
                                                {{ $t("number of times") }}
                                              </v-col>
                                              <v-col
                                                cols="4"
                                                align="center"
                                                v-else
                                              >
                                                {{
                                                  $t("start date - end date")
                                                }}
                                              </v-col>
                                              <v-col cols="4"></v-col>
                                            </v-row>
                                          </v-card-text>
                                        </v-card>
                                        <div
                                          v-if="
                                            student_list.filter(
                                              (v) =>
                                                v.cpo?.packageName ===
                                                date.cpo?.packageName
                                            ).length > 0
                                          "
                                        >
                                          <v-card
                                            class="mb-2"
                                            outlined
                                            dense
                                            v-for="(
                                              student, student_index
                                            ) in student_list.filter(
                                              (v) =>
                                                v.cpo?.packageName ===
                                                date.cpo?.packageName
                                            )"
                                            :key="student_index"
                                          >
                                            <v-card-text class="pa-2">
                                              <v-row
                                                dense
                                                class="text-md font-bold flex align-center"
                                              >
                                                <v-col cols="1" align="center"
                                                  >{{ student_index + 1 }}
                                                </v-col>
                                                <v-col cols align="center"
                                                  >{{
                                                    $i18n.locale == "th"
                                                      ? `${student.firstNameTh} ${student.lastNameTh}`
                                                      : `${student.firstNameEn} ${student.lastNameEn}`
                                                  }}
                                                </v-col>
                                                <v-col
                                                  cols="4"
                                                  align="center"
                                                  v-if="
                                                    course_data.course_type_id ===
                                                    'CT_2'
                                                  "
                                                  >{{
                                                    `${date.startDate} - ${date.endDate}`
                                                  }}
                                                </v-col>
                                                <v-col
                                                  cols="2"
                                                  align="center"
                                                  v-else
                                                  >{{ student.cpo?.optionName }}
                                                </v-col>
                                                <v-col
                                                  cols="2"
                                                  align="center"
                                                  v-if="
                                                    course_data.course_type_id ===
                                                    'CT_1'
                                                  "
                                                >
                                                  {{ student.countCheckIn }}/{{
                                                    student.totalDay
                                                  }}
                                                </v-col>
                                                <v-col cols="4">
                                                  <v-row dense>
                                                    <v-col class="pa-0">
                                                      <v-btn
                                                        text
                                                        class="px-1"
                                                        color="#ff6b81"
                                                        @click="
                                                          showDialogAssessment(
                                                            student,
                                                            date
                                                          )
                                                        "
                                                      >
                                                        <v-icon
                                                          >mdi-check-decagram-outline
                                                        </v-icon>
                                                        {{
                                                          $t("view evaluation")
                                                        }}
                                                      </v-btn>
                                                    </v-col>
                                                    <v-col class="pa-0">
                                                      <v-btn
                                                        text
                                                        disabled
                                                        class="px-1"
                                                        color="#ff6b81"
                                                      >
                                                        <v-icon>
                                                          mdi-clipboard-text-search-outline
                                                        </v-icon>
                                                        {{ $t("view profile") }}
                                                      </v-btn>
                                                    </v-col>
                                                  </v-row>
                                                </v-col>
                                              </v-row>
                                            </v-card-text>
                                          </v-card>
                                        </div>
                                        <div v-else>
                                          <v-card
                                            class="mb-2"
                                            outlined
                                            dense
                                            v-for="(
                                              student, student_index
                                            ) in date.students"
                                            :key="`${student_index}-index`"
                                          >
                                            <v-card-text class="pa-2">
                                              <v-row
                                                dense
                                                class="text-md font-bold flex align-center"
                                              >
                                                <v-col cols="1" align="center"
                                                  >{{ student_index + 1 }}
                                                </v-col>
                                                <v-col cols align="center"
                                                  >{{
                                                    $i18n.locale == "th"
                                                      ? `${student.firstNameTh} ${student.lastNameTh}`
                                                      : `${student.firstNameEn} ${student.lastNameEn}`
                                                  }}
                                                </v-col>

                                                <v-col
                                                  cols="2"
                                                  align="center"
                                                  v-if="
                                                    course_data.course_type_id ===
                                                    'CT_1'
                                                  "
                                                >
                                                  {{ date.cpo?.optionName }}
                                                </v-col>
                                                <v-col
                                                  cols="2"
                                                  align="center"
                                                  v-if="
                                                    course_data.course_type_id ===
                                                    'CT_1'
                                                  "
                                                >
                                                  -
                                                </v-col>
                                                <v-col
                                                  cols="4"
                                                  align="center"
                                                  v-else
                                                >
                                                  <span class="font-bold">{{
                                                    `${date.startDate} - ${date.endDate}`
                                                  }}</span>
                                                </v-col>
                                                <v-col cols="4">
                                                  <v-row dense>
                                                    <v-col class="pa-0">
                                                      <v-btn
                                                        text
                                                        class="px-1"
                                                        color="#ff6b81"
                                                        disabled
                                                      >
                                                        <v-icon
                                                          >mdi-check-decagram-outline
                                                        </v-icon>
                                                        {{
                                                          $t("view evaluation")
                                                        }}
                                                      </v-btn>
                                                    </v-col>
                                                    <v-col class="pa-0">
                                                      <v-btn
                                                        text
                                                        disabled
                                                        class="px-1"
                                                        color="#ff6b81"
                                                      >
                                                        <v-icon>
                                                          mdi-clipboard-text-search-outline
                                                        </v-icon>
                                                        {{ $t("view profile") }}
                                                      </v-btn>
                                                    </v-col>
                                                  </v-row>
                                                </v-col>
                                              </v-row>
                                            </v-card-text>
                                          </v-card>
                                        </div>
                                      </div>
                                    </template>
                                  </div>
                                </v-expand-transition>
                              </div>
                            </div>
                          </div>
                        </v-expand-transition>
                      </div>
                    </template>
                  </template>
                </v-tab-item>
                <v-tab-item valus="student booking">
                  <v-data-table
                    class="header-table rounded-lg"
                    :headers="column"
                    :items="student_reserve_list"
                  >
                    <template v-slot:no-data>
                      <v-row dense>
                        <v-col align="center">
                          {{ $t("no data found") }}
                        </v-col>
                      </v-row>
                    </template>
                    <template v-slot:[`item.fullname`]="{ item }">
                      {{
                        $i18n.locale == "th"
                          ? `${item.firstNameTh} ${item.lastNameTh}`
                          : `${item.firsNameEn} ${item.lastNameEn}`
                      }}
                    </template>
                    <template v-slot:[`item.course_name`]="{ item }">
                      {{ `${item.courseNameTh}(${item.courseNameEn})` }}
                    </template>
                    <template v-slot:[`item.package`]="{ item }">
                      {{
                        `${item.packageName}-${
                          item.optionName
                        }/${dayOfWeekArray(item.dayOfWeekName)}${
                          item.startTime
                        }-${item.endTime}`
                      }}
                    </template>
                    <template v-slot:[`item.coach`]="{ item }">
                      {{
                        $i18n.locale == "th"
                          ? `${item.coachFirstNameTh} ${item.coachLastNameTh}`
                          : `${item.coachFirsNameEn} ${item.coachLastNameEn}`
                      }}
                    </template>
                    <template v-slot:[`item.createdDate`]="{ item }">
                      {{ genDate(item.createdDate) }}
                    </template>
                    <template v-slot:[`item.status`]="{ item }">
                      <v-chip
                        class="w-full flex justify-center"
                        label
                        :text-color="
                          item.status === 'waiting' ? '#58A144' : '#FCC419'
                        "
                        :color="
                          item.status === 'waiting' ? '#F0F9EE' : '#FFF9E8'
                        "
                        >{{
                          item.status === "waiting"
                            ? $t("waiting for contact")
                            : item.status
                        }}
                      </v-chip>
                    </template>
                  </v-data-table>
                </v-tab-item>
                <v-tab-item valus="students potential">
                  <v-card flat dent class="mb-3 rounded-lg">
                    <v-card-text class="py-2 bg-[#FCE0E7] rounded-lg">
                      <v-row dense class="d-flex align-center">
                        <v-col cols="auto">
                          <v-btn icon @click="selectAllCoach()">
                            <v-icon color="#ff6b81">{{
                              selected_all_coach
                                ? "mdi-checkbox-marked"
                                : "mdi-checkbox-blank-outline"
                            }}</v-icon>
                          </v-btn>
                        </v-col>
                        <v-col class="text-[#ff6b81] font-bold">{{
                          $t("coach list")
                        }}</v-col>
                        <v-col cols="auto">
                          <v-text-field
                            v-model="search_student_potential"
                            class="bg-white rounded-lg"
                            dense
                            outlined
                            hide-details
                            :placeholder="
                              $t('search for student name, coach name')
                            "
                            prepend-inner-icon="mdi-magnify"
                            @input="
                              searchStudentPotential(search_student_potential)
                            "
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                  <v-row dense v-if="coach_list_is_loading">
                    <v-col align="center">
                      <v-progress-circular
                        indeterminate
                        color="red"
                      ></v-progress-circular>
                    </v-col>
                  </v-row>
                  <template v-else>
                    <div
                      v-if="
                        search_student_potential
                          ? search_student_potential_datas.length === 0
                          : coach_list.filter(
                              (v) => v.allDates.studentPotentialArr.length > 0
                            ).length === 0
                      "
                    >
                      <v-card dense outlined>
                        <v-card-text>
                          <v-row>
                            <v-col class="font-bold" align="center">
                              {{ $t("no data found") }}
                            </v-col>
                          </v-row>
                        </v-card-text>
                      </v-card>
                    </div>
                    <template v-else>
                      <div
                        v-for="(coach, coach_index) in search_student_potential
                          ? search_student_potential_datas
                          : coach_list.filter(
                              (v) => v.allDates.studentPotentialArr.length > 0
                            )"
                        :key="`${coach_index}-potential_index`"
                      >
                        <v-card
                          @click="seletedCoachPotential(coach, coach_index)"
                          outlined
                          dense
                          class="rounded-lg cursor-pointer mb-3 bg-[#FCFCFC]"
                        >
                          <v-card-text class="pa-2">
                            <v-row dense class="d-flex align-center">
                              <v-col cols="auto">
                                <v-icon color="#ff6b81">mdi-account</v-icon>
                              </v-col>
                              <v-col class="font-bold">
                                {{ $t("coach") }}:
                                {{
                                  $i18n.locale == "th"
                                    ? `${coach.firstNameTh} ${coach.lastNameTh}`
                                    : `${coach.firstNameEn} ${coach.lastNameEn}`
                                }}
                              </v-col>
                              <v-col cols="auto">
                                <v-icon
                                  >{{
                                    selected_coach_potential === coach_index
                                      ? "mdi-chevron-up"
                                      : "mdi-chevron-down"
                                  }}
                                </v-icon>
                              </v-col>
                            </v-row>
                          </v-card-text>
                        </v-card>
                        <v-expand-transition>
                          <div
                            v-if="selected_coach_potential === coach_index"
                            class="pa-3 bg-[#FCFCFC] rounded-b-lg"
                          >
                            <v-row
                              dense
                              v-if="student_potential_list_is_loading"
                            >
                              <v-col align="center">
                                <v-progress-circular
                                  indeterminate
                                  color="red"
                                ></v-progress-circular>
                              </v-col>
                            </v-row>
                            <div v-else>
                              <div v-if="student_potential_list.length === 0">
                                <v-card dense outlined>
                                  <v-card-text>
                                    <v-row>
                                      <v-col class="font-bold" align="center">
                                        {{
                                          $t("student information not found")
                                        }}
                                      </v-col>
                                    </v-row>
                                  </v-card-text>
                                </v-card>
                              </div>
                              <div v-if="student_potential_list.length > 0">
                                <v-row dense class="d-flex align-center mb-2">
                                  <v-col>
                                    <v-divider></v-divider>
                                  </v-col>
                                  <v-col cols="auto">{{
                                    $t("student information")
                                  }}</v-col>
                                  <v-col>
                                    <v-divider></v-divider>
                                  </v-col>
                                </v-row>
                                <v-card class="mb-2" flat dense>
                                  <v-card-text
                                    class="pa-2 bg-[#FCE0E7] rounded-lg"
                                  >
                                    <v-row dense class="text-md font-bold">
                                      <v-col cols="1" align="center">{{
                                        $t("no.")
                                      }}</v-col>
                                      <v-col cols align="center"
                                        >{{
                                          $t("first name") +
                                          " - " +
                                          $t("last name")
                                        }}
                                      </v-col>
                                      <v-col cols="2" align="center"
                                        >{{ $t("period") }}
                                      </v-col>
                                      <v-col cols="2" align="center"
                                        >{{ $t("number of times") }}
                                      </v-col>
                                      <v-col cols="4"></v-col>
                                    </v-row>
                                  </v-card-text>
                                </v-card>
                                <div v-if="student_potential_list.length > 0">
                                  <v-card
                                    class="mb-2"
                                    outlined
                                    dense
                                    v-for="(
                                      potential, potential_index
                                    ) in student_potential_list"
                                    :key="`${potential_index}-potential`"
                                  >
                                    <v-card-text class="pa-2">
                                      <v-row
                                        dense
                                        class="text-md font-bold flex align-center"
                                      >
                                        <v-col cols="1" align="center"
                                          >{{ potential_index + 1 }}
                                        </v-col>
                                        <v-col cols align="center"
                                          >{{
                                            `${potential.firstNameTh} ${potential.lastNameTh}`
                                          }}
                                        </v-col>
                                        <v-col cols="2" align="center"
                                          >{{ potential.cpo?.optionName }}
                                        </v-col>
                                        <v-col cols="2" align="center">
                                          {{ potential.countCheckIn }}/{{
                                            potential.totalDay
                                          }}
                                        </v-col>
                                        <v-col cols="4">
                                          <v-row dense>
                                            <v-col class="pa-0">
                                              <v-btn
                                                text
                                                class="px-1"
                                                color="#ff6b81"
                                                @click="
                                                  showDialogAssessment(
                                                    potential
                                                  )
                                                "
                                              >
                                                <v-icon
                                                  >mdi-check-decagram-outline
                                                </v-icon>
                                                {{ $t("view evaluation") }}
                                              </v-btn>
                                            </v-col>
                                            <v-col class="pa-0">
                                              <v-btn
                                                text
                                                disabled
                                                class="px-1"
                                                color="#ff6b81"
                                              >
                                                <v-icon>
                                                  mdi-clipboard-text-search-outline
                                                </v-icon>
                                                {{ $t("view profile") }}
                                              </v-btn>
                                            </v-col>
                                          </v-row>
                                        </v-col>
                                      </v-row>
                                    </v-card-text>
                                  </v-card>
                                </div>
                              </div>
                            </div>
                          </div>
                        </v-expand-transition>
                      </div>
                    </template>
                  </template>
                </v-tab-item>
              </v-tabs-items>
            </v-tab-item>
          </v-tabs-items>
        </v-card-text>
      </v-card>
      <v-dialog
        width="60vw"
        v-if="show_dialog_assessmet"
        v-model="show_dialog_assessmet"
      >
        <v-card>
          <v-card-text class="pa-2">
            <v-row dense>
              <v-col></v-col>
              <v-col class="pa-0" cols="auto">
                <v-btn icon color="red" @click="closeDialogAssessment()"
                  ><v-icon>mdi-close</v-icon></v-btn
                >
              </v-col>
            </v-row>
            <v-row dense class="mb-3">
              <v-col align="center" class="font-bold text-lg">
                {{ $t("assessment") }}
              </v-col>
            </v-row>
            <v-card
              v-if="student_data_assessment?.checkInPotentialId"
              class="mb-3"
            >
              <v-card-text>
                <v-row>
                  <v-col cols="auto">
                    <v-img
                      width="40"
                      height="40"
                      src="@/assets/course/potential.png"
                    ></v-img>
                  </v-col>
                  <v-col cols class="font-bold text-lg"
                    >{{ $t("assess the overview") }}
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-card flat>
                      <v-card-text class="bg-[#FBF3F5]">
                        <v-row dense>
                          <v-col>{{ $t("developmental level") }} </v-col>
                        </v-row>
                        <v-row dense>
                          <v-col>
                            <v-select
                              outlined
                              dense
                              v-model="student_data_assessment.evolution"
                              :items="evolution_options"
                              hide-details
                              readonly
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
                        </v-row>
                        <v-row dense>
                          <v-col>
                            <span class="text-[#999999]">
                              {{ $t("interest level") }}:
                            </span>
                            {{
                              student_data_assessment.Interest
                                ? student_data_assessment.Interest
                                : "-"
                            }}
                          </v-col>
                        </v-row>
                        <v-row dense>
                          <v-col>
                            <span class="text-[#999999]">
                              {{ $t("comments") }}:
                            </span>
                            {{
                              student_data_assessment.remark
                                ? student_data_assessment.remark
                                : "-"
                            }}
                          </v-col>
                        </v-row>
                        <v-row dense>
                          <v-col cols="12">
                            <b>{{ $t("attachments") }}: </b>
                            <v-card
                              @click="openFile(file.attachmentFiles)"
                              flat
                              class="mb-3"
                              v-for="(
                                file, index_file
                              ) in student_data_assessment.attachmentPotential"
                              :key="index_file"
                            >
                              <v-card-text
                                class="border-2 border-[#ff6b81] rounded-lg"
                              >
                                <v-row>
                                  <v-col align="center">
                                    <imgFileType
                                      :mime_type="file.filesType"
                                    ></imgFileType>
                                  </v-col>
                                  <v-col cols="12" sm="10" align="start">
                                    <span class="font-bold">{{
                                      file.originalFilesName
                                    }}</span
                                    ><br />
                                    <span class="text-caption"
                                      >{{ $t("file size") }} :
                                      {{
                                        (file.filesSize / 1000000).toFixed(2)
                                      }}
                                      MB</span
                                    >
                                  </v-col>
                                </v-row>
                              </v-card-text>
                            </v-card>
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
            <div v-if="student_data_assessment?.assessment.length > 0">
              <v-card
                class="mb-3"
                v-for="(assess, index) in student_data_assessment?.assessment"
                :key="`${index}-assess`"
              >
                <v-card-text>
                  <v-row dense>
                    <v-col cols="auto">
                      <v-icon color="#ff6b81">mdi-calendar-month</v-icon>
                    </v-col>
                    <v-col class="font-bold">
                      {{
                        new Date(assess.date).toLocaleDateString(
                          $i18n.locale == "th" ? "th-TH" : "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )
                      }}
                    </v-col>
                    <v-col cols="auto">
                      <v-chip
                        class="font-bold"
                        :color="
                          check_in_status_options.filter(
                            (v) => v.value === assess.status
                          )[0].bg_color
                        "
                        :style="`color:${
                          check_in_status_options.filter(
                            (v) => v.value === assess.status
                          )[0].color
                        }`"
                        v-if="
                          check_in_status_options.filter(
                            (v) => v.value === assess.status
                          ).length > 0
                        "
                        >{{
                          $t(
                            check_in_status_options.filter(
                              (v) => v.value === assess.status
                            )[0].label
                          )
                        }}
                      </v-chip>
                    </v-col>
                  </v-row>
                  <v-row dense>
                    <v-col> {{ $t("developmental level") }}</v-col>
                  </v-row>
                  <v-row dense>
                    <v-col>
                      <v-select
                        outlined
                        dense
                        v-model="assess.assessment.evolution"
                        :items="evolution_options"
                        hide-details
                        readonly
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
                  </v-row>
                  <v-row dense>
                    <v-col> {{ $t("interest level") }}</v-col>
                  </v-row>
                  <v-row dense>
                    <v-col>
                      <v-select
                        outlined
                        dense
                        v-model="assess.assessment.interest"
                        :items="interest_options"
                        hide-details
                        readonly
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
                  </v-row>
                  <v-row dense>
                    <v-col>
                      <span class="text-[#999999]"> {{ $t("comments") }}: </span
                      >{{ assess.assessment.remark }}
                    </v-col>
                  </v-row>
                  <v-card
                    @click="openFile(file.attFiles)"
                    flat
                    class="mb-3"
                    v-for="(file, index_file) in assess.assessment.attachment"
                    :key="index_file"
                  >
                    <v-card-text class="border-2 border-[#ff6b81] rounded-lg">
                      <v-row>
                        <v-col align="center">
                          <imgFileType
                            :mime_type="file.filesType"
                          ></imgFileType>
                        </v-col>
                        <v-col cols="12" sm="10" align="start">
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
                </v-card-text>
              </v-card>
            </div>
            <div v-else-if="student_data_assessment?.assessment">
              <v-card class="mb-3">
                <v-card-text>
                  <v-row dense>
                    <v-col cols="auto">
                      <v-icon color="#ff6b81">mdi-calendar-month</v-icon>
                    </v-col>
                    <v-col class="font-bold">
                      {{
                        new Date(
                          student_data_assessment.date
                        ).toLocaleDateString(
                          $i18n.locale == "th" ? "th-TH" : "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )
                      }}
                    </v-col>
                    <v-col cols="auto">
                      <v-chip
                        class="font-bold"
                        :color="
                          check_in_status_options.filter(
                            (v) => v.value === student_data_assessment.status
                          )[0].bg_color
                        "
                        :style="`color:${
                          check_in_status_options.filter(
                            (v) => v.value === student_data_assessment.status
                          )[0].color
                        }`"
                        v-if="
                          check_in_status_options.filter(
                            (v) => v.value === student_data_assessment.status
                          ).length > 0
                        "
                        >{{
                          $t(
                            check_in_status_options.filter(
                              (v) => v.value === student_data_assessment.status
                            )[0].label
                          )
                        }}
                      </v-chip>
                    </v-col>
                  </v-row>
                  <v-row dense>
                    <v-col>{{ $t("developmental level") }} </v-col>
                  </v-row>
                  <v-row dense>
                    <v-col>
                      <v-select
                        outlined
                        dense
                        v-model="student_data_assessment.assessment.evolution"
                        :items="evolution_options"
                        hide-details
                        readonly
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
                  </v-row>
                  <v-row dense>
                    <v-col>{{ $t("interest level") }}</v-col>
                  </v-row>
                  <v-row dense>
                    <v-col>
                      <v-select
                        outlined
                        dense
                        v-model="student_data_assessment.assessment.interest"
                        :items="interest_options"
                        hide-details
                        readonly
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
                  </v-row>
                  <v-row dense>
                    <v-col>
                      <span class="text-[#999999]"> {{ $t("comments") }}: </span
                      >{{ student_data_assessment.assessment.remark }}
                    </v-col>
                  </v-row>
                  <v-card
                    @click="openFile(file.attFiles)"
                    flat
                    class="mb-3"
                    v-for="(file, index_file) in student_data_assessment
                      .assessment.attachment"
                    :key="index_file"
                  >
                    <v-card-text class="border-2 border-[#ff6b81] rounded-lg">
                      <v-row>
                        <v-col align="center">
                          <imgFileType
                            :mime_type="file.filesType"
                          ></imgFileType>
                        </v-col>
                        <v-col cols="12" sm="10" align="start">
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
                </v-card-text>
              </v-card>
            </div>
            <v-card
              outlined
              class="mb-3"
              v-if="
                !student_data_assessment?.potential &&
                student_data_assessment?.assessment.length == 0
              "
            >
              <v-card-text>
                <v-row dense>
                  <v-col align="center"
                    >{{ $t("assessment not found") }}
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
            <v-row dense>
              <v-col align="center">
                <v-btn
                  color="#ff6b81"
                  @click="closeDialogAssessment()"
                  depressed
                  dark
                  class="btn-size-lg"
                  >{{ $t("agree") }}</v-btn
                >
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-container>
  </v-app>
</template>

<script>
import courseCard from "@/components/course/courseCard.vue";
import packageCard from "@/components/course/packageCard.vue";
import coachsCard from "@/components/course/coachsCard.vue";
import HeaderPage from "@/components/header/headerPage.vue";
import headerCard from "@/components/header/headerCard.vue";
import ImgCard from "@/components/course/imgCard.vue";
import loadingOverlay from "@/components/loading/loadingOverlay.vue";
import Swal from "sweetalert2";
import { CheckFileSize, dateDMY, dateFormatter } from "@/functions/functions";
import imgFileType from "@/components/file_type/imgFileType.vue";
import { mapGetters, mapActions } from "vuex";
import mixin from "@/mixin";

export default {
  name: "coureDetail",
  components: {
    HeaderPage,
    ImgCard,
    courseCard,
    coachsCard,
    packageCard,
    headerCard,
    loadingOverlay,
    imgFileType,
  },
  mixins: [mixin],
  data: () => ({
    courseValidate: false,
    coachValidate: false,
    packageValidate: false,
    slide_group: null,
    show_dialog_assessmet: false,
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
    selected_coach: "",
    selected_schedule: "",

    tab: "course",
    filter: {
      dow: "",
      date_menu: false,
      date: "",
      date_formatter: "",
      time: "",
      package: "",
    },
    time_option: [],
    dow_option: [],
    search_student_list: "",
    package_option: [],
    day_option: [
      { label: "วันอาทิตย์", value: 0 },
      { label: "วันจันทร์", value: 1 },
      { label: "วันอังคาร", value: 2 },
      { label: "วันพุธ", value: 3 },
      { label: "วันพฤหัสบดี", value: 4 },
      { label: "วันศุกร์", value: 5 },
      { label: "วันเสาร์", value: 6 },
    ],
    student_tab: null,
    course_edit: false,
    privilege_file: null,
    preview_privilege_url: null,
    artwork_files: [],
    preview_artwork_files: [],
    student_data_assessment: {},
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
    selected_all_coach: false,
    selected_coach_potential: null,
    search_coach_list: [],
    search_student_datas: [],
    search_student_potential: "",
    search_student_potential_datas: [],
  }),
  mounted() {},
  watch: {
    student_tab: function () {
      this.GetStudentReserveByCourseId({
        course_id: this.$route.params.course_id,
      });
    },
    course_artwork: function () {
      this.preview_artwork_files = [];
      if (this.course_artwork.length > 0) {
        for (const arkwork of this.course_artwork) {
          this.preview_artwork_files.push(arkwork);
        }
      }
      this.preview_privilege_url = this.course_data.course_img_privilege;
    },
    tab: function () {
      this.course_edit = false;
      this.$store.dispatch(
        "CourseModules/GetCourse",
        this.$route.params.course_id
      );
      this.GetArtworkByCourse({ course_id: this.$route.params.course_id });
      this.preview_privilege_url = this.course_data.course_img_privilege;
      this.GetCoachsByCourse({ course_id: this.$route.params.course_id });
    },
  },
  computed: {
    ...mapGetters({
      coachs: "CourseModules/getCoachs",
      categorys: "CategoryModules/getCategorys",
      course_data: "CourseModules/getCourseData",
      course_is_loading: "CourseModules/getCourseIsLoading",
      course_artwork: "CourseModules/getCourseArtwork",
      coach_list: "CourseModules/getCoachList",
      coach_list_is_loading: "CourseModules/getCoachListIsLoading",
      student_list: "CourseModules/getStudentList",
      student_list_is_loading: "CourseModules/getStudentListIsLoading",
      student_reserve_list: "CourseModules/getStudentReserveList",
      student_potential_list: "CourseModules/getStudentPotentialList",
      student_potential_list_is_loading:
        "CourseModules/getStudentPotentialListIsLoading",
    }),
    breadcrumbs() {
      return [
        { text: this.$t("manage all courses"), to: "CourseList" },
        { text: this.$t("course details"), to: "" },
      ];
    },
    column() {
      return [
        {
          text: this.$t("first name") + " - " + this.$t("last name"),
          align: "center",
          sortable: false,
          value: "fullname",
        },
        {
          text: this.$t("phone number"),
          align: "center",
          sortable: false,
          value: "tel",
        },
        {
          text: this.$t("course name"),
          align: "center",
          sortable: false,
          value: "course_name",
        },
        {
          text: this.$t("package"),
          align: "center",
          sortable: false,
          value: "package",
        },
        {
          text: this.$t("coach"),
          align: "center",
          sortable: false,
          value: "coach",
        },
        {
          text: this.$t("reserve date"),
          align: "center",
          sortable: false,
          value: "createdDate",
        },
        {
          text: this.$t("status"),
          align: "center",
          sortable: false,
          value: "status",
        },
      ];
    },
    setFunctions() {
      this.$store.dispatch(
        "CourseModules/GetCourse",
        this.$route.params.course_id
      );
      this.$store.dispatch("CategoryModules/GetCategorys");
      this.$store.dispatch("CourseModules/GetCoachs");
      this.GetArtworkByCourse({ course_id: this.$route.params.course_id });
      this.GetCoachsByCourse({ course_id: this.$route.params.course_id });
      return "";
    },
  },
  methods: {
    ...mapActions({
      GetCourse: "CourseModules/GetCourse",
      ChangeCourseData: "CourseModules/ChangeCourseData",
      UpdateCourse: "CourseModules/UpdateCourse",
      UpdateCouserDetail: "CourseModules/UpdateCouserDetail",
      UpdateCouserCoach: "CourseModules/UpdateCouserCoach",
      UpdateCouserPackage: "CourseModules/UpdateCouserPackage",
      UpdateCourseArkwork: "CourseModules/UpdateCourseArkwork",
      GetArtworkByCourse: "CourseModules/GetArtworkByCourse",
      GetCoachsByCourse: "CourseModules/GetCoachsByCourse",
      RemoveArkworkByArkworkId: "CourseModules/RemoveArkworkByArkworkId",
      GetStudentByDate: "CourseModules/GetStudentByDate",
      GetStudentReserveByCourseId: "CourseModules/GetStudentReserveByCourseId",
      GetStudentPotentialByCoach: "CourseModules/GetStudentPotentialByCoach",
      RemovePrivilageByCourseID: "CourseModules/RemovePrivilageByCourseID",
      ExportStudentList: "CourseModules/ExportStudentList",
    }),
    searchStudentPotential(search) {
      let coach_list_search = [];
      const regex = new RegExp(search.trim(), "i");
      for (let coach of this.coach_list.filter(
        (v) => v.allDates.studentPotentialArr.length > 0
      )) {
        const coach_full_name = `${coach.firstNameTh} ${coach.lastNameTh}`;
        if (coach_full_name.search(regex) > -1) {
          coach_list_search.push(coach);
        }
        for (let student of coach.allDates.studentPotentialArr) {
          const student_full_name = `${student.firstNameTh} ${student.lastNameTh}`;
          if (student_full_name.search(regex) > -1) {
            if (
              coach_list_search.filter((v) => v.coachId === coach.coachId)
                .length === 0
            ) {
              coach_list_search.push(coach);
            }
          }
        }
      }
      (this.selected_coach = ""),
        (this.selected_schedule = ""),
        (this.selected_coach_potential = null);
      this.search_student_potential_datas = coach_list_search;
    },
    searchStudentList(search) {
      let coach_list_search = [];
      const regex = new RegExp(search.trim(), "i");
      for (let coach of this.coach_list.filter(
        (v) => v.allDates.studentArr.length > 0
      )) {
        const coach_full_name = `${coach.firstNameTh} ${coach.lastNameTh}`;
        if (coach_full_name.search(regex) > -1) {
          coach_list_search.push(coach);
        }
        for (let student of coach.allDates.studentArr) {
          const student_full_name = `${student.firstNameTh} ${student.lastNameTh}`;
          if (student_full_name.search(regex) > -1) {
            if (
              coach_list_search.filter((v) => v.coachId === coach.coachId)
                .length === 0
            ) {
              coach_list_search.push(coach);
            }
          }
        }
      }
      (this.selected_coach = ""),
        (this.selected_schedule = ""),
        (this.selected_coach_potential = null);
      this.search_student_datas = coach_list_search;
    },
    resetFilter() {
      this.filter = {
        dow: "",
        date_menu: false,
        date: "",
        date_formatter: "",
        time: "",
        package: "",
      };
    },
    filterDateByCoach(coach_index) {
      let filterCoachList = this.coach_list[coach_index].datesList;
      if (this.filter.dow) {
        filterCoachList = filterCoachList.filter(
          (v) => new Date(v.date).getDay() === this.filter.dow
        );
      }
      if (this.filter.date) {
        filterCoachList = filterCoachList.filter(
          (v) => v.date == this.filter.date
        );
      }
      if (this.filter.time) {
        filterCoachList = filterCoachList.filter(
          (v) => v.timeId === this.filter.time
        );
      }
      if (this.filter.package) {
        filterCoachList = filterCoachList.filter(
          (v) => v.cpo.packageId === this.filter.package
        );
      }
      if (
        this.filter.dow ||
        this.filter.date ||
        this.filter.time ||
        this.filter.package
      ) {
        return filterCoachList;
      } else {
        return this.coach_list[coach_index].datesList;
      }
    },
    async dowOption(selected_coach) {
      let dow = [];
      this.dow_option = [];
      if (selected_coach >= 0) {
        let coach = this.coach_list[selected_coach].allDates;
        for await (const day of coach.dates.day) {
          if (dow.length === 0) {
            dow.push(this.day_option.filter((v) => v.value == day)[0]);
          } else if (dow.filter((v) => v.value == day).length === 0) {
            dow.push(this.day_option.filter((v) => v.value == day)[0]);
          }
        }
      }
      this.dow_option = dow;
    },
    async filterPackageCoach(selected_coach) {
      this.package_option = [];
      if (selected_coach >= 0) {
        let coach = this.coach_list[selected_coach].allDates;
        if (this.package_option.length === 0) {
          this.package_option.push(coach.cpo);
        } else if (
          this.package_option.filter((v) => v.cpoId === coach.cpo.cpoId)
            .length == 0
        ) {
          this.package_option.push(coach.cpo);
        }
      }
    },
    //FILTER DATE COACH LIST
    async filterTimeCoach(selected_coach) {
      this.time_option = [];
      if (selected_coach >= 0) {
        let coach = this.coach_list[selected_coach].allDates;
        if (this.time_option.length > 0) {
          this.time_option.push(coach.time);
        } else if (
          this.time_option.filter((v) => v.timeId === coach.time.timeId)
            .length === 0
        ) {
          this.time_option.push(coach.time);
        }
        // }
      }
    },
    //EXPORT STUDENT
    exportStudents() {
      this.ExportStudentList({
        coach_list: this.coach_list,
        course_id: this.$route.params.course_id,
        course_name: this.course_data.course_name_th,
        course_type_id: this.course_data.course_type_id,
      });
    },
    readFile(file) {
      return `${process.env.VUE_APP_URL}/api/v1/files/${file}`;
    },
    seletedCoachPotential(coach, index) {
      if (index == this.selected_coach_potential) {
        this.selected_coach_potential = null;
      } else {
        this.selected_coach_potential = index;
        this.GetStudentPotentialByCoach({
          course_id: this.$route.params.course_id,
          coach_id: coach.coachId,
        });
      }
    },
    getDateFormattor(date, format) {
      return dateFormatter(date, format);
    },
    genDate(date) {
      return dateDMY(date);
    },
    // SELECT CHECK BOX COACH
    selectAllCoach() {
      this.coach_list.map((v) => (v.checked = !this.selected_all_coach));
      this.coach_list.map((v) =>
        v.datesList.map((date) => (date.checked = !this.selected_all_coach))
      );
      this.selected_all_coach = !this.selected_all_coach;
    },
    selectCoachChecked(coach) {
      coach.datesList.map((v) => (v.checked = !coach.checked));
      coach.checked = !coach.checked;
    },
    selectDateChecked(data) {
      data.checked = !data.checked;
    },
    dayOfWeekArray(day) {
      // console.log(day)
      let days = day.split(",");
      const weekdays = [
        this.$t("sunday"),
        this.$t("monday"),
        this.$t("tuesday"),
        this.$t("wednesday"),
        this.$t("thursday"),
        this.$t("friday"),
        this.$t("saturday"),
      ];
      days.sort();
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
    openFilePrivilegeSelector() {
      this.$refs.fileInputPrivilege.click();
    },
    openFileArtworSelector() {
      this.$refs.fileInputArtwork.click();
    },
    // UPDATE FILE
    uploadPrivilegeFile(event) {
      this.privilege_file = this.$refs.fileInputPrivilege.files[0];
      const allowedTypes = ["image/png", "image/jpeg"];
      if (CheckFileSize(this.privilege_file, event.target.id) === true) {
        const fileType = this.privilege_file.type;
        if (fileType === "image/png" || fileType === "image/jpeg") {
          this.course_data.privilege_file =
            this.$refs.fileInputPrivilege.files[0];
          this.ChangeCourseData(this.course_data);
          if (
            this.privilege_file &&
            allowedTypes.includes(this.privilege_file.type)
          ) {
            if (!this.privilege_file) return;
            const reader = new FileReader();
            reader.onload = (e) => {
              this.preview_privilege_url = e.target.result;
            };
            reader.readAsDataURL(this.privilege_file);
          }
        } else {
          Swal.fire({
            icon: "error",
            title: this.$t("something went wrong"),
            text: this.$t("upload only image files (png, jpeg) only"),
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        }
      }
    },
    showDialogAssessment(student_data, date) {
      this.show_dialog_assessmet = true;
      this.student_data_assessment = student_data;
      this.student_data_assessment.time = date.time;
      this.student_data_assessment.str_date = dateFormatter(
        this.student_data_assessment.date,
        "DW DD MMT YYYYT"
      );
    },
    closeDialogAssessment() {
      this.show_dialog_assessmet = false;
      this.student_data_assessment = {};
    },
    previewArtWorkFile(event) {
      const selectedFiles = event.target.files;
      const allowedTypes = ["image/png", "image/jpeg"];
      const fileUrls = [];
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        if (CheckFileSize(file, event.target.id) === true) {
          if (allowedTypes.includes(file.type)) {
            this.course_data.artwork_file.push(file);
            const reader = new FileReader();
            reader.onload = () => {
              fileUrls.push(reader.result);
              if (fileUrls.length == selectedFiles.length) {
                this.preview_artwork_files = [
                  ...this.preview_artwork_files,
                  ...fileUrls,
                ];
              }
            };
            reader.readAsDataURL(file);
          }
        }
      }
      this.ChangeCourseData(this.course_data);
    },
    // REMOVE
    removeArtworkFile(index) {
      this.preview_artwork_files.splice(index, 1);
    },
    removeArtworkFileData(data, index) {
      Swal.fire({
        icon: "question",
        title: "do you want to delete this file?",
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: this.$t("agree"),
        cancelButtonText: this.$t("cancel"),
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.RemoveArkworkByArkworkId({ artwork_data: data });
          this.preview_artwork_files.splice(index, 1);
        }
      });
    },
    removePrivilegeFile() {
      this.preview_privilege_url = null;
    },
    removePrivilegeFileData() {
      Swal.fire({
        icon: "question",
        title: "do you want to delete this file?",
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: this.$t("agree"),
        cancelButtonText: this.$t("cancel"),
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.RemovePrivilageByCourseID({
            course_id: this.$route.params.course_id,
          }).then(() => {
            this.course_data.course_img_privilege = null;
            this.preview_privilege_url = null;
          });
        }
      });
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
    async CourseUpdateDetail() {
      this.$refs.course_form.validate();
      if (this.courseValidate) {
        Swal.fire({
          icon: "question",
          title: this.$t("do you want to edit your course?"),
          showDenyButton: false,
          showCancelButton: true,
          confirmButtonText: this.$t("agree"),
          cancelButtonText: this.$t("cancel"),
        }).then(async (result) => {
          if (result.isConfirmed) {
            let student_list = await this.UpdateCouserDetail({
              course_id: this.course_data.course_id,
              course_data: this.course_data,
            });
            if (student_list.students?.length > 0) {
              const options = {
                year: "numeric",
                month: "long",
                day: "numeric",
              };
              // for (const student_account of student_list.students) {
              // console.log("student_account :>> ", student_account.studentId);

              let payload = {
                notificationName: "แจ้งเตือนเลื่อนวันเปิดเรียน",
                notificationDescription: `คอร์ส ${
                  this.course_data.course_name_th
                } เลื่อนเป็นวันที่ ${new Date(
                  student_list.afterDate
                )?.toLocaleDateString("th-TH", options)}`,
                accountId: student_list.students,
                path: null,
              };
              this.sendNotification(payload);
              // }
            }

            this.course_edit = false;
          }
        });
      }
    },
    CourseUpdateCoach() {
      this.$refs.coach_form.validate();
      if (this.coachValidate) {
        Swal.fire({
          icon: "question",
          title: this.$t("do you want to edit your course?"),
          showDenyButton: false,
          showCancelButton: true,
          confirmButtonText: this.$t("agree"),
          cancelButtonText: this.$t("cancel"),
        }).then(async (result) => {
          if (result.isConfirmed) {
            this.UpdateCouserCoach({
              course_id: this.course_data.course_id,
              course_data: this.course_data,
            }).then(() => {
              this.course_edit = false;
            });
          }
        });
      }
    },
    CourseUpdatePackage() {
      this.$refs.package_form.validate();
      if (this.packageValidate) {
        Swal.fire({
          icon: "question",
          title: this.$t("do you want to edit your course?"),
          showDenyButton: false,
          showCancelButton: true,
          confirmButtonText: this.$t("agree"),
          cancelButtonText: this.$t("cancel"),
        }).then(async (result) => {
          if (result.isConfirmed) {
            this.UpdateCouserPackage({
              course_id: this.course_data.course_id,
              course_data: this.course_data,
            }).then(() => {
              this.course_edit = false;
              this.GetCourse(this.$route.params.course_id);
              this.GetArtworkByCourse({
                course_id: this.$route.params.course_id,
              });
            });
          }
        });
      }
    },
    async CourseUpdateArkwork() {
      await Swal.fire({
        icon: "question",
        title: this.$t("do you want to edit your course?"),
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: this.$t("agree"),
        cancelButtonText: this.$t("cancel"),
      }).then(async (result) => {
        if (result.isConfirmed) {
          await this.UpdateCourseArkwork({
            course_id: this.course_data.course_id,
            course_data: this.course_data,
          });
          this.course_edit = false;
        }
      });
    },
    updateCourse() {
      Swal.fire({
        icon: "question",
        title: this.$t("do you want to edit your course?"),
        showDenyButton: false,
        showCancelButton: false,
        confirmButtonText: this.$t("agree"),
        cancelButtonText: this.$t("cancel"),
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.UpdateCourse({ course_data: this.course_data });
        }
      });
    },
    addCoach() {
      this.course_data.coachs.push({
        coach_id: "",
        coach_name: "",
        teach_days_used: [],
        teach_day_data: [
          {
            class_open: false,
            teach_day: [],
            class_date: [
              {
                class_date_range: {
                  start_time: "",
                  start_time_object: { HH: "", mm: "" },
                  menu_start_time: false,
                  end_time: "",
                  end_time_object: { HH: "", mm: "" },
                  menu_end_time: false,
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
          start_time: "",
          end_time: "",
        },
      });
      this.ChangeCourseData(this.course_data);
    },
    removeCoach(data, index) {
      data.splice(index, 1);
      this.ChangeCourseData(this.course_data);
    },
    cancelEdit() {
      this.course_edit = false;
      this.GetCourse(this.$route.params.course_id);
    },
    selectCoach(coach, index) {
      if (this.selected_coach !== index) {
        this.selected_coach = index;
        this.dowOption(index);
        this.filterPackageCoach(index);
        this.filterTimeCoach(index);
      } else {
        this.selected_coach = "";
      }
    },
    selectSchedule(index, date) {
      this.GetStudentByDate({
        course_id: this.$route.params.course_id,
        date: date.date,
      });
      if (this.selected_schedule !== index) {
        this.selected_schedule = index;
      } else {
        this.selected_schedule = "";
      }
    },
    openFile(file) {
      let fileName = `${process.env.VUE_APP_URL}/api/v1/files/${file}`;
      window.open(fileName, "_blank");
    },
  },
};
</script>
<style></style>

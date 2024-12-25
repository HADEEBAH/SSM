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
          v-if="courses_data.course_type_id === 'CT_1'"
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
          v-if="courses_data.course_type_id === 'CT_1'"
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
          v-if="courses_data.course_type_id === 'CT_1'"
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
                    :disabled="!courseValidate"
                    :loading="update_loading"
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
                    <!-- :disabled="!course_edit" -->

                    <v-btn outlined color="#FF6B81" @click="addCoach">
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
              <!-- <v-row class="px-4" v-if="!course_edit">
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
              </v-row> -->
            </v-tab-item>
            <!-- PACKAGE -->
            <v-tab-item value="package">
              <v-form ref="package_form" v-model="packageValidate">
                <package-card :disable="!course_edit" edited></package-card>
              </v-form>
              <v-row dense v-if="data_package?.length < 3">
                <v-col align="center">
                  <!-- :disabled="!course_edit" -->

                  <v-btn
                    outlined
                    color="#ff6b81"
                    @click="addPackage(course_created_data.packages)"
                    ><v-icon>mdi-plus</v-icon> {{ $t("add package") }}</v-btn
                  >
                </v-col>
              </v-row>
              <!-- ACTION -->
              <!-- <v-row class="px-4" v-if="!course_edit">
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
              </v-row> -->
              <!-- <v-row class="px-4" v-if="course_edit">
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
              </v-row> -->
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
                      courses_data.course_img_privilege || preview_privilege_url
                    "
                  >
                    <v-col align="center" class="rounded-lg pa-0">
                      <v-img
                        :src="
                          courses_data.course_img_privilege
                            ? courses_data.course_img_privilege
                            : preview_privilege_url
                        "
                        style="max-width: 300px"
                        :aspect-ratio="16 / 9"
                        class="rounded-lg"
                        contain
                        align="right"
                      >
                        <v-btn
                          v-if="
                            course_edit && courses_data.course_img_privilege
                          "
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
                      !courses_data.course_img_privilege
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
                      ({{
                        $t(
                          "suggestion : Should upload an image with size 1024 x 576 (16:9) and file size not over 5 Mb must be JPG, PNG file"
                        )
                      }})
                    </v-col>
                    <v-col
                      cols="12"
                      class="flex align-center justify-center mt-5"
                    >
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
                      preview_artwork_files && preview_artwork_files?.length > 0
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
                        style="max-width: 300px"
                        :aspect-ratio="16 / 9"
                        class="rounded-lg"
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
                        style="max-width: 300px"
                        :aspect-ratio="16 / 9"
                        class="rounded-lg"
                        contain
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
                      preview_artwork_files?.length == 0
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
                      ({{
                        $t(
                          "suggestion : Should upload an image with size 1024 x 576 (16:9) and file size not over 5 Mb must be JPG, PNG file"
                        )
                      }})
                    </v-col>
                  </v-row>
                  <v-row dense>
                    <v-col align="center">
                      <input
                        id="fileInputArtwork"
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
                    <v-tab
                      value="student potential"
                      @click="studentsPotentials()"
                      >{{ $t("students complete the course") }}</v-tab
                    >
                  </v-tabs>
                </v-col>
                <v-col cols="auto">
                  <v-btn
                    v-if="student_tab == 0"
                    :disabled="!coach_list.some((v) => v.checked === true)"
                    depressed
                    color="#ff6b81"
                    :loading="export_is_loading"
                    :dark="coach_list.some((v) => v.checked === true)"
                    @click="show_dialog_export_student = true"
                  >
                    {{ $t("export") }}
                  </v-btn>
                  <v-btn
                    v-if="student_tab == 1"
                    depressed
                    color="#ff6b81"
                    :disabled="!student_reserve_list.length > 0"
                    :dark="student_reserve_list.length > 0"
                    @click="show_dialog_export_reserve_student = true"
                  >
                    {{ $t("export") }}
                  </v-btn>
                  <v-btn
                    v-if="student_tab == 2"
                    depressed
                    color="#ff6b81"
                    :dark="!DisableButtonExport()"
                    :disabled="DisableButtonExport()"
                    :loading="export_is_loading"
                    @click="show_dialog_export_end_student = true"
                  >
                    {{ $t("export") }}
                  </v-btn>
                </v-col>
              </v-row>
              <v-tabs-items v-model="student_tab" class="rounded-lg">
                <!-- นักเรียนในคอร์ส -->
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
                          <v-btn
                            color="#ff6b81"
                            @click="searchStudentList"
                            prepend-inner-icon="mdi-magnify"
                            dark
                          >
                            <v-icon dark> mdi-magnify </v-icon>

                            {{ $t("search for student name, coach name") }}
                          </v-btn>
                          <!-- <v-text-field
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
                          ></v-text-field> -->
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
                          ? search_student_datas?.length === 0
                          : coach_list?.filter((v) => v?.datesList.length > 0)
                              .length === 0
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
                          : coach_list?.filter((v) => v?.datesList?.length > 0)"
                        :key="`${coach_index}-coach_index`"
                      >
                        <v-card
                          v-if="coach?.datesList?.length > 0"
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
                                    ? `${coach.coachName}`
                                    : `${coach.coachNameEn}`
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
                              <v-col
                                v-if="
                                  course_created_data.course_type_id == 'CT_1'
                                "
                              >
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
                              v-if="coach.datesList?.length > 0"
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
                                v-if="
                                  course_created_data.course_type_id === 'CT_1'
                                "
                                >{{ $t("package") }}</v-col
                              >
                              <v-col align="right"></v-col>
                            </v-row>
                            <v-card
                              v-if="coach.datesList?.length === 0"
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
                            <div v-if="coach.datesList?.length > 0">
                              <div
                                v-for="(date, index_date) in filterDateByCoach(
                                  coach_index
                                )"
                                :key="`${index_date}-date`"
                              >
                                <v-card
                                  @click="
                                    selectSchedule(
                                      index_date,
                                      date,
                                      filterDateByCoach(coach_index)
                                    )
                                  "
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
                                          course_created_data.course_type_id ===
                                          'CT_1'
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
                                          coach.dateLists?.length === 0
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
                                        <!-- STUDENT HEADER -->
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
                                              <v-col cols align="center"
                                                >{{ $t("first name") }} -
                                                {{ $t("last name") }}
                                              </v-col>
                                              <v-col
                                                cols="2"
                                                align="center"
                                                v-if="
                                                  course_created_data.course_type_id ===
                                                  'CT_1'
                                                "
                                              >
                                                {{ $t("period") }}
                                              </v-col>
                                              <v-col
                                                v-if="
                                                  course_created_data.course_type_id ===
                                                  'CT_1'
                                                "
                                                cols="2"
                                                align="center"
                                              >
                                                {{ $t("number of times") }}
                                              </v-col>
                                              <v-col
                                                v-else
                                                cols="4"
                                                align="center"
                                              >
                                                {{
                                                  $t("start date - end date")
                                                }}
                                              </v-col>
                                              <v-col cols>
                                                {{ $t("status") }}
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
                                            )?.length > 0
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
                                                    course_created_data.course_type_id ===
                                                    'CT_2'
                                                  "
                                                >
                                                  {{
                                                    `${date.startDate} - ${date.endDate}`
                                                  }}
                                                </v-col>
                                                <v-col
                                                  cols="2"
                                                  align="center"
                                                  v-else
                                                  >{{
                                                    student.cpo
                                                      ? $i18n.locale == "th"
                                                        ? student.cpo
                                                            ?.optionName
                                                        : student.cpo
                                                            ?.optionNameEn
                                                      : "-"
                                                  }}
                                                </v-col>
                                                <v-col
                                                  cols="2"
                                                  align="center"
                                                  v-if="
                                                    course_created_data.course_type_id ===
                                                    'CT_1'
                                                  "
                                                >
                                                  {{ student.countCheckIn }}/{{
                                                    student.totalDay
                                                  }}
                                                </v-col>
                                                <v-col
                                                  cols
                                                  v-if="!student.status"
                                                >
                                                  <v-chip
                                                    color="orange"
                                                    outlined
                                                  >
                                                    {{
                                                      $t(
                                                        "no status has been selected yet"
                                                      )
                                                    }}
                                                  </v-chip>
                                                </v-col>
                                                <v-col cols v-else>
                                                  <!-- {{ pre$t(student.status) }} -->
                                                  <v-chip
                                                    align="center"
                                                    class="font-bold"
                                                    :color="
                                                      check_in_status_options.filter(
                                                        (v) =>
                                                          v.value ===
                                                          student.status
                                                      )[0].bg_color
                                                    "
                                                    :style="`color:${
                                                      check_in_status_options.filter(
                                                        (v) =>
                                                          v.value ===
                                                          student.status
                                                      )[0].color
                                                    }`"
                                                    v-if="
                                                      check_in_status_options.filter(
                                                        (v) =>
                                                          v.value ===
                                                          student.status
                                                      )?.length > 0
                                                    "
                                                  >
                                                    {{ $t(student.status) }}
                                                  </v-chip>
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
                                                        :to="{
                                                          name: 'UserDetail',
                                                          params: {
                                                            account_id:
                                                              student.studentId,
                                                            action: 'view',
                                                            from: 'courseDetail',
                                                          },
                                                        }"
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
                                        <!-- NO student check in -->
                                        <div v-else>
                                          <v-card
                                            class="mb-2"
                                            outlined
                                            dense
                                            v-for="(
                                              student, student_index
                                            ) in no_check_in_student_list"
                                            :key="`${student_index}-index`"
                                          >
                                            <!-- {{student }} -->
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
                                                      ? `${student.studentName}`
                                                      : `${student.studentNameEn}`
                                                  }}
                                                </v-col>

                                                <v-col
                                                  cols="2"
                                                  align="center"
                                                  v-if="
                                                    course_created_data.course_type_id ===
                                                    'CT_1'
                                                  "
                                                >
                                                  {{
                                                    $i18n.locale == "th"
                                                      ? student.optionName
                                                      : student.optionNameEn
                                                  }}
                                                </v-col>
                                                <v-col
                                                  v-if="
                                                    course_created_data.course_type_id ===
                                                    'CT_1'
                                                  "
                                                  cols="2"
                                                  align="center"
                                                >
                                                  {{
                                                    `${student.countCheckIn}/${student.totalDay}`
                                                  }}
                                                </v-col>
                                                <v-col
                                                  v-else
                                                  cols="4"
                                                  align="center"
                                                >
                                                  <span class="font-bold">{{
                                                    `${date.startDate} - ${date.endDate}`
                                                  }}</span>
                                                </v-col>
                                                <v-col>
                                                  <span class="text-sm">{{
                                                    $t("no check in admin")
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
                                                        :to="{
                                                          name: 'UserDetail',
                                                          params: {
                                                            account_id:
                                                              student.studentId,
                                                            action: 'view',
                                                            from: 'courseDetail',
                                                          },
                                                        }"
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
                <!-- นักเรียนจองคิว -->
                <v-tab-item valus="student booking">
                  <v-row dense v-if="course_created_data.reservation">
                    <v-col class="pr-3" cols="12" align="right">
                      <v-btn
                        @click="UpdateReserveAll(student_reserve_list)"
                        class="mb-3"
                        dense
                        dark
                        depressed
                        color="#ff6b81"
                      >
                        {{ $t("all contacted") }}
                      </v-btn>
                    </v-col>
                  </v-row>
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
                          ? `${item.firstNameTh ? item.firstNameTh : ""} ${
                              item.lastNameTh ? item.lastNameTh : ""
                            }`
                          : `${item.firsNameEn ? item.firsNameEn : ""} ${
                              item.lastNameEn ? item.lastNameEn : ""
                            }`
                      }}
                    </template>
                    <template v-slot:[`item.course_name`]="{ item }">
                      {{ `${item.courseNameTh}(${item.courseNameEn})` }}
                    </template>
                    <template v-slot:[`item.package`]="{ item }">
                      {{
                        item.packageName !== null &&
                        item.packageName !== undefined &&
                        item.optionName !== null &&
                        item.optionName !== undefined &&
                        item.optionNameEn !== null &&
                        item.optionNameEn !== undefined &&
                        item.dayOfWeekName !== null &&
                        item.dayOfWeekName !== undefined &&
                        item.startTime !== null &&
                        item.startTime !== undefined &&
                        item.endTime !== null &&
                        item.endTime !== undefined
                          ? `${item.packageName}-${
                              $i18n.locale == "th"
                                ? item.optionName
                                : item.optionNameEn
                            }/${dayOfWeekArray(item.dayOfWeekName)}${
                              item.startTime
                            }-${item.endTime}`
                          : "-"
                      }}
                    </template>
                    <template v-slot:[`item.coach`]="{ item }">
                      {{
                        $i18n.locale == "th"
                          ? `${
                              item.coachFirstNameTh ? item.coachFirstNameTh : ""
                            } ${
                              item.coachLastNameTh ? item.coachLastNameTh : ""
                            }`
                          : `${
                              item.coachFirsNameEn
                                ? item.coachFirsNameEn
                                : item.coachFirsNameEn
                            } ${
                              item.coachLastNameEn ? item.coachLastNameEn : ""
                            }`
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
                          item.status === 'contacted' ? '#58A144' : '#FCC419'
                        "
                        :color="
                          item.status === 'contacted' ? '#F0F9EE' : '#FFF9E8'
                        "
                        >{{
                          item.status === "waiting"
                            ? $t("waiting for contact")
                            : $t(item.status)
                        }}
                      </v-chip>
                      <!-- <v-select
                        v-model="item.status"
                        dense
                        outlined
                        hide-details
                        item-color="#ff6b81"
                        :items="status"
                        item-text="label"
                        item-value="value"
                        @change="updateReserve(item.reserveId, item)"
                      >
                        <template v-slot:selection="{ item }">
                          <v-list-item-title>
                            <v-icon :color="item.color">
                              {{ item.icon }}
                            </v-icon>
                            {{ item.label }}
                          </v-list-item-title>
                        </template>

                        <template v-slot:item="{ props, item }">
                          <v-list-item-avatar v-bind="props">
                            <v-icon :color="item.color">
                              {{ item.icon }}
                            </v-icon>
                          </v-list-item-avatar>
                          <v-list-item-title v-bind="props">
                            {{ item.label }}
                          </v-list-item-title>
                        </template>
                      </v-select> -->
                    </template>
                  </v-data-table>
                </v-tab-item>
                <!-- นักเรียนจบคอร์ส -->
                <v-tab-item valus="student potential">
                  <!-- Search Students -->

                  <v-card flat dent class="mb-3 rounded-lg">
                    <v-card-text class="py-2 bg-[#FCE0E7] rounded-lg">
                      <v-row dense class="d-flex align-center">
                        <v-col class="text-[#ff6b81] font-bold">{{
                          $t("coach list")
                        }}</v-col>
                        <v-col cols="auto">
                          <v-btn
                            color="#ff6b81"
                            @click="searchStudentPotential"
                            prepend-inner-icon="mdi-magnify"
                            dark
                          >
                            <v-icon dark> mdi-magnify </v-icon>

                            {{ $t("search for student name, coach name") }}
                          </v-btn>
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
                    <!-- <div
                      v-if="
                        search_student_potential
                          ? search_student_potential_datas?.length === 0
                          : coach_list.filter(
                              (v) => v.studentPotentialArr?.length > 0
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
                          : coachListPotential(coach_list)"
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
                                    ? `${coach.coachName}`
                                    : `${coach.coachNameEn}`
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
                              <div v-if="student_potential_list?.length === 0">
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
                              <div v-if="student_potential_list?.length > 0">
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
                                <div v-if="student_potential_list?.length > 0">
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
                                          >{{
                                            $i18n.locale == "th"
                                              ? potential.cpo?.optionName
                                              : potential.cpo?.optionNameEn
                                          }}
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
                                                :to="{
                                                  name: 'UserDetail',
                                                  params: {
                                                    account_id:
                                                      potential.studentId,
                                                    action: 'view',
                                                    from: 'courseDetail',
                                                  },
                                                }"
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
                    </template> -->

                    <div v-if="students_potential.length < 0">
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
                        v-for="(coach_data, coach_index) in students_potential"
                        :key="`${coach_index}-coach_index`"
                      >
                        <v-card
                          @click="
                            seletedCoachPotential(coach_data, coach_index)
                          "
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
                                    ? `${coach_data.coachName}`
                                    : `${coach_data.coachNameEn}`
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
                              <div v-if="coach_data?.students?.length === 0">
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
                              <div v-if="coach_data?.students?.length > 0">
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
                                <div v-if="coach_data?.students?.length > 0">
                                  <v-card
                                    class="mb-2"
                                    outlined
                                    dense
                                    v-for="(
                                      students_data, students_index
                                    ) in coach_data.students"
                                    :key="`${students_index}-students_index`"
                                  >
                                    <v-card-text class="pa-2">
                                      <v-row
                                        dense
                                        class="text-md font-bold flex align-center"
                                      >
                                        <!-- INDEX -->
                                        <v-col cols="1" align="center"
                                          >{{ students_index + 1 }}
                                        </v-col>
                                        <!-- STD NAME -->
                                        <v-col cols align="center">
                                          {{
                                            $i18n.locale == "th"
                                              ? `${students_data.firstNameTh} ${students_data.lastNameTh}`
                                              : `${students_data.firstNameEn} ${students_data.lastNameEn}`
                                          }}
                                        </v-col>
                                        <!-- CPO -->
                                        <v-col cols="2" align="center">
                                          {{
                                            students_data.optionName ||
                                            students_data.optionNameEn
                                              ? $i18n.locale == "th"
                                                ? students_data.optionName
                                                : students_data.optionNameEn
                                              : "-"
                                          }}
                                        </v-col>
                                        <!-- COUNT CHECKIn -->
                                        <v-col cols="2" align="center"
                                          >{{ students_data.countCheckIn }}/{{
                                            students_data.totalPotential
                                          }}
                                        </v-col>
                                        <!-- ประเมิน / โปรไฟล์ -->
                                        <!-- <v-col cols="4">
                                          <v-row dense>
                                            <v-col class="pa-0">
                                              <v-btn
                                                text
                                                class="px-1"
                                                color="#ff6b81"
                                                @click="
                                                  showDialogAssessment(
                                                    students_data
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
                                                :to="{
                                                  name: 'UserDetail',
                                                  params: {
                                                    account_id:
                                                      students_data.studentId,
                                                    action: 'view',
                                                    from: 'courseDetail',
                                                  },
                                                }"
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
                                        </v-col> -->
                                        <v-col cols="4">
                                          <v-row dense>
                                            <v-col class="pa-0">
                                              <v-btn
                                                text
                                                class="px-1"
                                                color="#ff6b81"
                                                @click="
                                                  showDialogAssessmentPotential(
                                                    students_data
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
                                                :to="{
                                                  name: 'UserDetail',
                                                  params: {
                                                    account_id:
                                                      students_data.studentId,
                                                    action: 'view',
                                                    from: 'courseDetail',
                                                  },
                                                }"
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
      <!-- DIALOG ASSESSMENT -->
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
              outlined
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
                            {{ student_data_assessment.Interest || "-" }}
                          </v-col>
                        </v-row>
                        <v-row dense>
                          <v-col>
                            <span class="text-[#999999]"
                              >{{ $t("comments") }}:
                            </span>
                            {{ student_data_assessment.remark || "-" }}
                          </v-col>
                        </v-row>
                        <v-row dense>
                          <v-col cols="12">
                            <b>{{ $t("attachments") }}: </b>
                            <v-card
                              outlined
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
            <div v-if="student_data_assessment?.assessment?.length > 0">
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
                          )?.length > 0
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
                    outlined
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
              <v-card outlined class="mb-3">
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
                          )?.length > 0
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
                    outlined
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
                student_data_assessment?.assessment?.length == 0
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
      <!-- DIALOG ASSESSMENT POTENTIAL -->
      <v-dialog
        width="60vw"
        v-if="show_dialog_assessmet_potential"
        v-model="show_dialog_assessmet_potential"
      >
        <v-card>
          <v-card-text class="pa-2">
            <v-row dense>
              <v-col></v-col>
              <v-col class="pa-0" cols="auto">
                <v-btn
                  icon
                  color="red"
                  @click="closeDialogAssessmentPotential()"
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
              v-if="student_data_assessment_potential?.checkInPotentialId"
              class="mb-3"
              outlined
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
                              v-model="
                                student_data_assessment_potential.evolution
                              "
                              :items="evolution_options"
                              :placeholder="
                                $t('no information has been filled in yet')
                              "
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
                              student_data_assessment_potential.Interest || "-"
                            }}
                          </v-col>
                        </v-row>
                        <v-row dense>
                          <v-col>
                            <span class="text-[#999999]"
                              >{{ $t("comments") }}:
                            </span>
                            {{
                              student_data_assessment_potential.remark || "-"
                            }}
                          </v-col>
                        </v-row>
                        <v-row dense>
                          <v-col cols="12">
                            <b>{{ $t("attachments") }}: </b>

                            <v-card
                              outlined
                              @click="openFile(file.attachmentPotential)"
                              flat
                              class="mb-3"
                              v-for="(
                                file, index_file
                              ) in student_data_assessment_potential.attachmentPotential"
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
            <div
              v-if="student_data_assessment_potential?.assessment?.length > 0"
            >
              <v-card
                class="mb-3"
                v-for="(
                  assess, index
                ) in student_data_assessment_potential?.assessment"
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
                          )?.length > 0
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
                        v-model="assess.evolution"
                        :items="evolution_options"
                        hide-details
                        readonly
                        :placeholder="
                          $t('no information has been filled in yet')
                        "
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
                        v-model="assess.Interest"
                        :items="interest_options"
                        hide-details
                        readonly
                        :placeholder="
                          $t('no information has been filled in yet')
                        "
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
                      >{{ assess.remark }}
                    </v-col>
                  </v-row>
                  <v-card
                    outlined
                    @click="openFile(file.attachmentFiles)"
                    flat
                    class="mb-3"
                    v-for="(file, index_file) in assess.assessmentFiles"
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
              <v-card outlined class="mb-3">
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
                          )?.length > 0
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
                    outlined
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
                student_data_assessment?.assessment?.length == 0
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
                  @click="closeDialogAssessmentPotential()"
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
      <!-- EXPORT : STUDENT -->
      <v-dialog
        width="40vw"
        v-if="show_dialog_export_student"
        v-model="show_dialog_export_student"
      >
        <v-card>
          <v-card-title>
            <v-row>
              <v-col>
                {{ $t("language") }}
              </v-col>
              <v-col cols="auto">
                <v-btn icon @click="show_dialog_export_student = false">
                  <v-icon color="#ff6b81">mdi-close</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col class="text-center">
                <v-radio-group v-model="exportStudentLang" row>
                  <v-radio :label="$t('thai')" value="th"></v-radio>
                  <v-radio :label="$t('english')" value="en"></v-radio>
                </v-radio-group>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-btn
                  class="w-full"
                  depressed
                  color="#ff6b81"
                  dark
                  @click="exportStudents(exportStudentLang)"
                >
                  {{ $t("export") }}
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>
      <!-- EXPORT : END STUDENT -->
      <v-dialog
        width="40vw"
        v-if="show_dialog_export_end_student"
        v-model="show_dialog_export_end_student"
      >
        <v-card>
          <v-card-title>
            <v-row>
              <v-col>
                {{ $t("language") }}
              </v-col>
              <v-col cols="auto">
                <v-btn icon @click="show_dialog_export_end_student = false">
                  <v-icon color="#ff6b81">mdi-close</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col class="text-center">
                <v-radio-group v-model="exportStudentLang" row>
                  <v-radio :label="$t('thai')" value="th"></v-radio>
                  <v-radio :label="$t('english')" value="en"></v-radio>
                </v-radio-group>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-btn
                  class="w-full"
                  depressed
                  color="#ff6b81"
                  dark
                  @click="exportStudentsEndCourse(exportStudentLang)"
                >
                  {{ $t("export") }}
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>
      <!-- EXPORT : RESERVE -->
      <v-dialog
        width="40vw"
        v-if="show_dialog_export_reserve_student"
        v-model="show_dialog_export_reserve_student"
      >
        <v-card>
          <v-card-title>
            <v-row>
              <v-col>
                {{ $t("language") }}
              </v-col>
              <v-col cols="auto">
                <v-btn icon @click="show_dialog_export_reserve_student = false">
                  <v-icon color="#ff6b81">mdi-close</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col class="text-center">
                <v-radio-group v-model="exportStudentLang" row>
                  <v-radio :label="$t('thai')" value="th"></v-radio>
                  <v-radio :label="$t('english')" value="en"></v-radio>
                </v-radio-group>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-btn
                  class="w-full"
                  depressed
                  color="#ff6b81"
                  dark
                  @click="exportStudentsReserveCourse(exportStudentLang)"
                >
                  {{ $t("export") }}
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>
      <!-- dialog search student_list -->
      <student-in-course
        v-if="studentListDialog"
        :statusBool="studentListDialog"
        :courseId="course_created_data.course_id"
        :studentType="
          inpotentialBool
            ? (studentType = 'inpotential')
            : (studentType = 'potential')
        "
        @input="studentListDialog = $event"
      ></student-in-course>
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
import studentInCourse from "@/components/students/studentInCourse.vue";
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
    studentInCourse,
  },
  mixins: [mixin],
  data: () => ({
    exportStudentLang: "th",
    courseValidate: false,
    coachValidate: false,
    packageValidate: false,
    slide_group: null,
    show_dialog_assessmet: false,
    show_dialog_assessmet_potential: false,
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
    student_data_assessment_potential: {},
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
    select_export_end: false,
    show_dialog_export_student: false,
    show_dialog_export_end_student: false,
    show_dialog_export_reserve_student: false,
    studentListDialog: false,
    inpotentialBool: false,
    studentType: "",
    update_loading: false,
  }),
  mounted() {
    this.CoursesData({ course_id: this.$route.params.course_id });
  },

  watch: {
    student_tab: function () {
      const course_id = this.$route.params.course_id;
      this.GetStudentReserveByCourseId({
        course_id: course_id,
      });
    },
    course_artwork: function () {
      this.preview_artwork_files = [];
      if (this.course_artwork.length > 0) {
        for (const arkwork of this.course_artwork) {
          this.preview_artwork_files.push(arkwork);
        }
      }

      // this.preview_privilege_url = `https://waraphat.alldemics.com/api/v1/files/${this.courses_data.course_img_privilege}`;
      // this.preview_privilege_url = this.courses_data.course_img_privilege;
    },

    tab: function (tabName) {
      if (tabName === "course") {
        this.CoursesData({ course_id: this.$route.params.course_id });
      } else if (tabName === "time and coach") {
        this.CoachData({ course_id: this.$route.params.course_id });
      } else if (tabName === "package") {
        this.PackagesData({ course_id: this.$route.params.course_id });
      } else if (tabName === "student list") {
        this.GetCoachsByCourse({ course_id: this.$route.params.course_id });
        this.GetCourse(this.$route.params.course_id).then(() => {
          this.courses_data.course_type_id = this.data_course.course_type_id;
        });

        //  this.$store.dispatch(
        //   "CourseModules/GetCourse",
        //   this.$route.params.course_id
        // );
      } else if (tabName === "arkwork") {
        this.GetArtworkByCourse({
          course_id: this.$route.params.course_id,
        }).then(() => {
          this.preview_privilege_url = this.courses_data.course_img_privilege;
          this.preview_artwork_files.map((items) => {
            this.course_created_data.artwork_file.push(items);
          });
        });
      } else {
        this.CoursesData({ course_id: this.$route.params.course_id });
      }

      // this.course_edit = false;
      // this.$store.dispatch(
      //   "CourseModules/GetCourse",
      //   this.$route.params.course_id
      // );
      // this.GetArtworkByCourse({ course_id: this.$route.params.course_id });
      // this.preview_privilege_url = this.art_work_data.course_img_privilege;
      // this.GetCoachsByCourse({ course_id: this.$route.params.course_id });
    },
  },

  computed: {
    ...mapGetters({
      coachs: "CourseModules/getCoachs",
      categorys: "CategoryModules/getCategorys",
      course_created_data: "CourseModules/getCourseData",
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
      no_check_in_student_list: "CourseModules/getNoChackInStudentList",
      export_is_loading: "CourseModules/export_is_loading",
      students_potential: "CourseModules/getAllStudentPotentialList",
      courses_data: "CourseModules/getCoursesData",
      data_course: "CourseModules/getCourseData",
      coach_data: "CourseModules/getCoachData",
      data_package: "CourseModules/getPackageData",
      art_work_data: "CourseModules/getArtWorkData",
    }),
    breadcrumbs() {
      return [
        { text: this.$t("manage all courses"), to: "CourseList" },
        { text: this.$t("course details"), to: "" },
      ];
    },
    status() {
      return [
        {
          label: this.$t("waiting"),
          value: "waiting",
          icon: "mdi-timer-sand-complete",
          color: "#f1c232",
        },
        {
          label: this.$t("confirmed"),
          value: "contacted",
          icon: "mdi-check-circle",
          color: "green",
        },
        {
          label: this.$t("canceled"),
          value: "cancel",
          icon: "mdi-close-circle",
          color: "red",
        },
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
      // this.$store.dispatch(
      //   "CourseModules/GetCourse",
      //   this.$route.params.course_id
      // );
      // this.CoachData({ course_id: this.$route.params.course_id });

      this.CoursesData({ course_id: this.$route.params.course_id });
      // this.$store.dispatch(
      //   "CourseModules/CoursesData",
      //   this.$route.params.course_id
      // );
      this.$store.dispatch("CategoryModules/GetCategorys");
      this.$store.dispatch("CourseModules/GetCoachs");
      // this.GetArtworkByCourse({ course_id: this.$route.params.course_id });
      // this.GetCoachsByCourse({ course_id: this.$route.params.course_id });
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
      ExportEndStudentList: "CourseModules/ExportEndStudentList",
      ExportReserveCourse: "CourseModules/ExportReserveCourse",
      UpdateStatusReserveAdmin: "reserveCourseModules/UpdateStatusReserveAdmin",
      UpdateAllStatusReserve: "reserveCourseModules/UpdateAllStatusReserve",
      GetAllStudentPotentialList: "CourseModules/GetAllStudentPotentialList",
      CoursesData: "CourseModules/CoursesData",
      CoachData: "CourseModules/CoachData",
      PackagesData: "CourseModules/PackagesData",
      ArtWorkData: "CourseModules/ArtWorkData",
    }),
    async studentsPotentials() {
      await this.GetAllStudentPotentialList({
        course_id: this.$route.params.course_id,
      });
    },
    UpdateReserveAll() {
      // items
      // let hasWaitingStatus = items.some((item) => item.status === "waiting");
      if (this.course_created_data.course_status === "Active") {
        Swal.fire({
          icon: "question",
          title: this.$t("do you want to change your status?"),
          showDenyButton: false,
          showCancelButton: true,
          cancelButtonText: this.$t("no"),
          confirmButtonText: this.$t("agree"),
        }).then(async (result) => {
          if (result.isConfirmed) {
            // if (hasWaitingStatus) {
            await this.UpdateAllStatusReserve({
              courseId: this.$route.params.course_id,
            });
            // }
            await this.GetStudentReserveByCourseId({
              course_id: this.$route.params.course_id,
            });
          }
        });
      } else {
        Swal.fire({
          icon: "error",
          title: this.$t("something went wrong"),
          text: this.$t("please open a course"),
          timer: 3000,
          timerProgressBar: true,
          showCancelButton: false,
          showConfirmButton: false,
        }).then(() => {
          this.GetStudentReserveByCourseId({
            course_id: this.$route.params.course_id,
          });
        });
      }
    },
    updateReserve(reserve_id, reserve_data) {
      if (this.course_created_data.course_status === "Active") {
        Swal.fire({
          icon: "question",
          title: this.$t("do you want to change your status?"),
          showDenyButton: false,
          showCancelButton: true,
          cancelButtonText: this.$t("no"),
          confirmButtonText: this.$t("agree"),
        }).then(async (result) => {
          if (result.isConfirmed) {
            this.UpdateStatusReserveAdmin({
              reserve_id: reserve_id,
              reserve_data: reserve_data,
            });
          }
        });
      } else {
        Swal.fire({
          icon: "error",
          title: this.$t("something went wrong"),
          text: this.$t("please open a course"),
          timer: 3000,
          timerProgressBar: true,
          showCancelButton: false,
          showConfirmButton: false,
        }).then(() => {
          this.GetStudentReserveByCourseId({
            course_id: this.$route.params.course_id,
          });
        });
      }
    },
    DisableButtonExport() {
      // return this.search_student_potential
      //   ? !this.search_student_potential_datas.length > 0
      //   : !this.coach_list.filter((v) => v.studentPotentialArr?.length > 0)
      //       .length > 0;
      return !this.students_potential;
    },
    // searchStudentPotential(search) {
    //   let coach_list_search = [];
    //   const regex = new RegExp(search.trim(), "i");
    //   for (let coach of this.coach_list.filter(
    //     (v) => v.studentPotentialArr.length > 0
    //   )) {
    //     const coach_full_name = `${coach.coachNmae}`;
    //     if (coach_full_name.search(regex) > -1) {
    //       coach_list_search.push(coach);
    //     }
    //     for (let student of coach.studentPotentialArr) {
    //       const student_full_name = `${student.firstNameTh} ${student.lastNameTh}`;
    //       if (student_full_name.search(regex) > -1) {
    //         if (
    //           coach_list_search.filter((v) => v.coachId === coach.coachId)
    //             .length === 0
    //         ) {
    //           coach_list_search.push(coach);
    //         }
    //       }
    //     }
    //   }
    //   (this.selected_coach = ""),
    //     (this.selected_schedule = ""),
    //     (this.selected_coach_potential = null);
    //   this.search_student_potential_datas = coach_list_search;
    // },
    // searchStudentList(search) {
    //   let coach_list_search = [];
    //   const regex = new RegExp(search.trim(), "i");
    //   for (let coach of this.coach_list.filter(
    //     (v) => v.studentArr.length > 0
    //   )) {
    //     const coach_full_name = `${coach.firstNameTh} ${coach.lastNameTh}`;
    //     if (coach_full_name.search(regex) > -1) {
    //       coach_list_search.push(coach);
    //     }
    //     for (let student of coach.studentArr) {
    //       const student_full_name = `${student.firstNameTh} ${student.lastNameTh}`;
    //       if (student_full_name.search(regex) > -1) {
    //         if (
    //           coach_list_search.filter((v) => v.coachId === coach.coachId)
    //             .length === 0
    //         ) {
    //           coach_list_search.push(coach);
    //         }
    //       }
    //     }
    //   }
    //   (this.selected_coach = ""),
    //     (this.selected_schedule = ""),
    //     (this.selected_coach_potential = null);
    //   this.search_student_datas = coach_list_search;
    // },
    searchStudentPotential() {
      this.studentListDialog = true; // Set to true only once
      this.inpotentialBool = false;
    },
    searchStudentList() {
      this.studentListDialog = true; // Set to true only once
      this.inpotentialBool = true;
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
        let coach = this.coach_list[selected_coach];
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
        let coach = this.coach_list[selected_coach];
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
        let coach = this.coach_list[selected_coach];
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
    exportStudents(lang) {
      this.ExportStudentList({
        coach_list: this.coach_list,
        course_id: this.$route.params.course_id,
        course_name: this.course_created_data.course_name_th,
        course_type_id: this.course_created_data.course_type_id,
        lang,
      });
    },
    //EXPORT STUDENT RESERVE
    exportStudentsReserveCourse(lang) {
      this.ExportReserveCourse({
        studentReserveList: this.student_reserve_list,
        lang,
      });
    },
    //EXPORT STUDENT END COURSES
    exportStudentsEndCourse(lang) {
      this.ExportEndStudentList({
        coach_list: this.coach_list,
        course_id: this.$route.params.course_id,
        lang,
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
        // this.GetStudentPotentialByCoach({
        //   course_id: this.$route.params.course_id,
        //   coach_id: coach.coachId,
        // });
        this.students_potential;
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

    // SELECT CHECK BOX COACH END
    selectAllCoachEnd() {
      this.select_export_end = true;
    },

    selectCoachChecked(coach) {
      coach.datesList.map((v) => (v.checked = !coach.checked));
      coach.checked = !coach.checked;
    },
    selectDateChecked(data) {
      data.checked = !data.checked;
    },
    dayOfWeekArray(day) {
      if (!day) {
        return "";
      }
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
      this.$refs.fileInputArtwork.value = null;
      this.$refs.fileInputArtwork.click();
    },
    // UPDATE FILE
    uploadPrivilegeFile(event) {
      this.privilege_file = this.$refs.fileInputPrivilege.files[0];
      const allowedTypes = ["image/png", "image/jpeg"];
      if (CheckFileSize(this.privilege_file, event.target.id) === true) {
        const fileType = this.privilege_file.type;
        if (fileType === "image/png" || fileType === "image/jpeg") {
          this.course_created_data.privilege_file =
            this.$refs.fileInputPrivilege.files[0];
          this.ChangeCourseData(this.course_created_data);
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
    showDialogAssessmentPotential(student_data) {
      let assmentData = {};
      for (let items of student_data.assessment) {
        // items = assmentData
        assmentData = items;
      }
      (this.show_dialog_assessmet_potential = true),
        (this.student_data_assessment_potential = assmentData);
    },
    closeDialogAssessment() {
      this.show_dialog_assessmet = false;
      this.student_data_assessment = {};
    },
    closeDialogAssessmentPotential() {
      (this.show_dialog_assessmet_potential = false),
        (this.student_data_assessment_potential = {});
    },
    previewArtWorkFile(event) {
      const selectedFiles = event.target.files;
      const allowedTypes = ["image/png", "image/jpeg"];
      const fileUrls = [];
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        if (CheckFileSize(file, event.target.id) === true) {
          if (allowedTypes.includes(file.type)) {
            this.course_created_data.artwork_file.push(file);
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
      }
    },
    // REMOVE

    async removeArtworkFile(index) {
      await this?.course_created_data?.artwork_file?.splice(index, 1);
      this?.preview_artwork_files?.splice(index, 1);
    },
    async removeArtworkFileData(data, index) {
      Swal.fire({
        icon: "question",
        title: this.$t("do you want to delete this file?"),
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: this.$t("agree"),
        cancelButtonText: this.$t("no"),
      }).then(async (result) => {
        if (result.isConfirmed) {
          await this.RemoveArkworkByArkworkId({
            artwork_data: data,
            course_id: this.$route.params.course_id,
          }).then(async () => {
            this.preview_artwork_files.splice(index, 1);
            await this.course_created_data.artwork_file.splice(index, 1);
            // await this.GetArtworkByCourse({
            //   course_id: this.$route.params.course_id,
            // });
            //   .then(() => {
            //   this.preview_privilege_url =
            //     this.courses_data.course_img_privilege;
            //   this.preview_artwork_files.map((items) => {
            //     this.course_created_data.artwork_file.push(items);
            //   });
            // });
          });
        }
      });
    },
    removePrivilegeFile() {
      this.preview_privilege_url = null;
    },
    removePrivilegeFileData() {
      Swal.fire({
        icon: "question",
        title: this.$t("do you want to delete this file?"),
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: this.$t("agree"),
        cancelButtonText: this.$t("no"),
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.RemovePrivilageByCourseID({
            course_id: this.$route.params.course_id,
          }).then(() => {
            this.course_created_data.course_img_privilege = null;
            this.preview_privilege_url = null;
          });
        }
      });
    },
    addPackage() {
      // data.push({
      //   package: "",
      //   students: 0,
      //   options: [
      //     {
      //       period_package: "",
      //       amount: 0,
      //       price_unit: 0,
      //       discount: false,
      //       discount_price: 0,
      //       privilege: "",
      //       net_price: 0,
      //       net_price_unit: 0,
      //     },
      //   ],
      // });
      // this.ChangeCourseData(this.course_created_data);
      this.data_package.push({
        add_new_package: true,
        package_id: null,
        package: null,
        students: 1,
        options: [
          {
            add_new_option: true,
            discount_price: 0,
            package_id: null,
            package: null,
            students: 0,
            options: [
              {
                option_id: null,
                period_package: null,
                amount: 0,
                price_unit: 0,
                discount: false,
                discount_price: 0,
                privilege: null,
                net_price: 0,
                net_price_unit: 0,
              },
            ],
          },
        ],
        option_selected: [],
        option_list: [
          {
            option_id: "OP_1",
            option_name: "รายวัน",
            option_name_en: "Daily",
          },
          {
            option_id: "OP_2",
            option_name: "รายเดือน",
            option_name_en: "Monthly",
          },
          {
            option_id: "OP_3",
            option_name: "รายเทอม",
            option_name_en: "Per term",
          },
          {
            option_id: "OP_4",
            option_name: "รายปี",
            option_name_en: "Yearly",
          },
          {
            option_id: "OP_5",
            option_name: "ราย 4 ครั้ง",
            option_name_en: "4 times",
          },
          {
            option_id: "OP_6",
            option_name: "ราย 2 เดือน",
            option_name_en: "2 months",
          },
          {
            option_id: "OP_7",
            option_name: "ราย 10 ครั้ง",
            option_name_en: "10 times",
          },
        ],
      });
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
          cancelButtonText: this.$t("no"),
        }).then(async (result) => {
          if (result.isConfirmed) {
            let path = null;
            this.update_loading = true;
            if (!this.courses_data?.courseImg?.lastModified) {
              const url = this.courses_data?.courseImg;
              path = url?.split("/api/v1/files/")[1];
            }
            let payload = {
              course_id: this.courses_data?.course_id,
              course_name_th: this.courses_data?.course_name_th,
              course_name_en: this.courses_data?.course_name_en,
              course_open_date: this.courses_data?.course_open_date,
              course_type_id: this.courses_data?.course_type_id,
              course_location: this.courses_data?.location,
              course_description: this.courses_data?.description,
              course_music_performance: this.courses_data?.music_performance,
              course_certification: this.courses_data?.certification,
              course_image: null,
              category_id: this.courses_data?.category_id,
              course_img:
                !this.courses_data?.courseImg ||
                this.courses_data?.courseImg?.lastModified
                  ? null
                  : path,
              reservation_start_date: this.courses_data?.reservation_start_date,
              reservation_end_date: this.courses_data?.reservation_end_date,
              student_recived: this.courses_data?.student_recived,
              discount_price: this.courses_data?.discount_price
                ? this.courses_data?.discount_price
                : 0,
              course_register_date: {
                start_date:
                  this.courses_data?.course_register_date?.start_date_formatted,
                end_date:
                  this.courses_data?.course_register_date?.end_date_formatted,
              },
              reservation: this.courses_data?.reservation,
              coach_id: this.courses_data?.coach_id,
              course_study_start_date:
                this.courses_data?.course_study_date?.start_date_formatted,
              course_study_end_date:
                this.courses_data?.course_study_date?.end_date_formatted,
              course_study_time: {
                time_id: this.courses_data?.course_study_time?.time_id,
                start_time: this.courses_data?.course_study_time?.start_time,
                end_time: this.courses_data?.course_study_time?.end_time,
                students: this.courses_data?.course_study_time?.students,
                day_of_week_id:
                  this.courses_data?.course_study_time?.day_of_week_id,
              },
              course_study_date: {
                day_of_week_id:
                  this.courses_data?.course_study_date?.day_of_week_id,
                day_of_week_name: this.courses_data?.teach_day?.join(","),
                course_coach_id:
                  this.courses_data?.course_study_date?.course_coach_id,
                status: this.courses_data?.course_study_date?.status,
              },
              course_per_time: this.courses_data?.course_hours,
              course_price: this.courses_data?.course_price,
              course_period_start_date:
                this.course_data?.course_study_time?.start_time_object ||
                this.courses_data?.course_study_time?.start_time,
              course_period_end_date:
                this.course_data?.course_study_time?.end_time_object ||
                this.courses_data?.course_study_time?.end_time,

              // course_checked_discount: this.courses_data?.checked_discount_bool,
            };
            await this.UpdateCouserDetail({
              course_id: this.courses_data?.course_id,
              data_payload: payload,
              course_file: this.courses_data?.courseImg,
            }).then(() => {
              this.update_loading = false;
            });
            this.course_edit = false;
          }
        });
      }

      // this.$refs.course_form.validate();
      // if (this.courseValidate) {
      //   Swal.fire({
      //     icon: "question",
      //     title: this.$t("do you want to edit your course?"),
      //     showDenyButton: false,
      //     showCancelButton: true,
      //     confirmButtonText: this.$t("agree"),
      //     cancelButtonText: this.$t("no"),
      //   }).then(async (result) => {
      //     if (result.isConfirmed) {
      //       let student_list = await this.UpdateCouserDetail({
      //         course_id: this.course_created_data.course_id,
      //         course_created_data: this.course_created_data,
      //       });
      //       if (student_list?.students?.length > 0) {
      //         const options = {
      //           year: "numeric",
      //           month: "long",
      //           day: "numeric",
      //         };

      //         let payload = {
      //           notificationName: "แจ้งเตือนเลื่อนวันเปิดเรียน",
      //           notificationNameEn:
      //             "Notification of postponement of school opening date",
      //           notificationDescription: `คอร์ส ${
      //             this.course_created_data.course_name_th
      //           } เลื่อนเป็นวันที่ ${new Date(
      //             student_list.afterDate
      //           )?.toLocaleDateString("th-TH", options)}`,
      //           notificationDescriptionEn: `course ${
      //             this.course_created_data.course_name_en
      //           } postponed to date ${new Date(
      //             student_list.afterDate
      //           )?.toLocaleDateString("en-En", options)}`,
      //           accountId: student_list.students,
      //           path: null,
      //         };
      //         this.sendNotification(payload);
      //         // }
      //       }

      //       this.course_edit = false;
      //     }
      //   });
      // }
    },
    coachListPotential(coach_list) {
      let coachList = [];
      const coachs = coach_list.filter(
        (v) => v.studentPotentialArr?.length > 0
      );
      if (coachs.length > 0) {
        for (const coach of coachs) {
          if (!coachList.some((v) => v.coachId == coach.coachId)) {
            coachList.push(coach);
          }
        }
      }
      return coachList;
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
          cancelButtonText: this.$t("no"),
        }).then(async (result) => {
          if (result.isConfirmed) {
            this.UpdateCouserCoach({
              course_id: this.course_created_data.course_id,
              course_created_data: this.course_created_data,
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
          cancelButtonText: this.$t("no"),
        }).then(async (result) => {
          if (result.isConfirmed) {
            this.UpdateCouserPackage({
              course_id: this.course_created_data.course_id,
              course_created_data: this.course_created_data,
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
        cancelButtonText: this.$t("no"),
      }).then(async (result) => {
        if (result.isConfirmed) {
          await this.UpdateCourseArkwork({
            // course_id: this.course_created_data.course_id,
            // course_created_data: this.course_created_data,
            course_id: this.$route.params.course_id,
            course_data: this.course_created_data,
            privilage_file: this.course_created_data.privilege_file,
            artwork_files: this?.course_created_data?.artwork_file,
          }).then(() => {
            this.preview_privilege_url = null;
            this.preview_artwork_files.map((items) => {
              this.course_created_data.artwork_file.push(items);
            });
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
        cancelButtonText: this.$t("no"),
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.UpdateCourse({ course_created_data: this.course_created_data });
        }
      });
    },
    addCoach() {
      this.coach_data.push({
        coach_id: "",
        coach_name: "",
        teach_days_used: [],
        teach_day_data: [
          {
            edited_coach: false,
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
      this.ChangeCourseData(this.course_created_data);
    },
    removeCoach(data, index) {
      data.splice(index, 1);
      this.ChangeCourseData(this.course_created_data);
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
    selectSchedule(index, date, coach_data) {
      this.GetStudentByDate({
        course_id: this.$route.params.course_id,
        date: date.date,
        start_time: date.start,
        end_time: date.end,
        time_id: date.timeId,
        coach_id: date.coachId,
        coach_data,
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
// course Detail
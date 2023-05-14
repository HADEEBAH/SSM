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
                src="../../../assets/course/course.png"
              ></v-img>
              <span class="text-lg font-bold"> คอร์สเรียน </span>
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
                src="../../../assets/course/time_and_coach.png"
              ></v-img>
              <span class="text-lg font-bold"> ช่วงเวลาและโค้ช </span>
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
                src="../../../assets/course/package.png"
              ></v-img>
              <span class="text-lg font-bold"> แพ็คเกจ </span>
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
                src="../../../assets/course/upload_file.png"
              ></v-img>
              <span class="text-lg font-bold"> งานศิลปะ </span>
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
                src="../../../assets/course/student_list.png"
              ></v-img>
              <span class="text-lg font-bold"> รายชื่อนักเรียน </span>
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
                    >แก้ไข
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
                    >ยกเลิก</v-btn
                  >
                </v-col>
                <v-col cols="auto">
                  <v-btn
                    color="#FF6B81"
                    class="white--text btn-size-lg"
                    depressed
                    @click="CourseUpdateDetail()"
                    >บันทึก
                  </v-btn>
                </v-col>
              </v-row>
            </v-tab-item>
            <!-- COACH AND TIME -->
            <v-tab-item value="time and coach">
              <v-card flat>
                <headerCard title="รายละเอียดเวลาและโค้ช">
                  <template v-slot:actions>
                    <v-btn
                      outlined
                      :disabled="!course_edit"
                      color="#FF6B81"
                      @click="addCoach"
                    >
                      <v-icon>mdi-plus-circle-outline</v-icon>
                      เพิ่มโค้ช
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
                    >แก้ไข
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
                    >ยกเลิก</v-btn
                  >
                </v-col>
                <v-col cols="auto">
                  <v-btn
                    color="#FF6B81"
                    class="white--text btn-size-lg"
                    depressed
                    @click="CourseUpdateCoach()"
                    >บันทึก
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
                    ><v-icon>mdi-plus</v-icon>เพิ่มแพ็คเกจ</v-btn
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
                    >แก้ไข
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
                    >ยกเลิก</v-btn
                  >
                </v-col>
                <v-col cols="auto">
                  <v-btn
                    color="#FF6B81"
                    class="white--text btn-size-lg"
                    depressed
                    @click="CourseUpdatePackage()"
                    >บันทึก
                  </v-btn>
                </v-col>
              </v-row>
            </v-tab-item>
            <!-- ARKWORk -->
            <v-tab-item value="arkwork">
              <v-card class="mx-3 mb-3" flat>
                <headerCard title="สิทธิพิเศษ"></headerCard>
                <v-card-text
                  class="border-dashed border-2 border-blue-600 rounded-lg"
                >
                  <!-- <v-row v-if="course_data.course_img_privilege">
                    <v-col align="center" class="rounded-lg pa-0">
                      <v-img
                        :src="course_data.course_img_privilege"
                        contain
                        style="max-width: 200px"
                        align="right"
                      >
                        <v-btn
                          v-if="course_edit"
                          icon
                          class="bg-[#f00]"
                          dark
                          @click="removePrivilegeFileData"
                          ><v-icon>mdi-close</v-icon></v-btn
                        >
                      </v-img>
                    </v-col>
                  </v-row> -->
                  <v-row v-if="preview_privilege_url">
                    <v-col align="center" class="rounded-lg pa-0">
                      <v-img
                        :src="preview_privilege_url"
                        contain
                        style="max-width: 200px"
                        align="right"
                      >
                        <v-btn
                          v-if="course_edit"
                          icon
                          class="bg-[#f00]"
                          dark
                          @click="removePrivilegeFile"
                          ><v-icon>mdi-close</v-icon></v-btn
                        >
                      </v-img>
                    </v-col>
                  </v-row>
                  <v-row v-if="!preview_privilege_url">
                    <v-col cols="12" class="flex align-center justify-center">
                      <v-img
                        src="../../../assets/course/upload_file.png"
                        max-height="105"
                        max-width="122"
                      ></v-img>
                    </v-col>
                    <v-col
                      cols="12"
                      class="flex align-center justify-center text-h5"
                    >
                      อัพโหลดภาพสิทธิพิเศษ
                    </v-col>
                    <v-col
                      cols="12"
                      class="flex align-center justify-center text-caption"
                    >
                      ( ขนาดไฟล์งานไม่เกิน 10 Mb ต้องเป็นไฟล์ JPG, PNG )
                    </v-col>
                    <v-col cols="12" class="flex align-center justify-center">
                      <v-btn
                        outlined
                        color="blue"
                        :disabled="!course_edit"
                        @click="openFilePrivilegeSelector"
                        >เลือกไฟล์</v-btn
                      >
                      <input
                        ref="fileInputPrivilege"
                        type="file"
                        @change="uploadPrivilegeFile"
                        accept="image/png, image/jpeg"
                        style="display: none"
                      />
                    </v-col>
                  </v-row>
                </v-card-text>
                <headerCard title="งานศิลปะ"></headerCard>
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
                        src="../../../assets/course/upload_file.png"
                        max-height="105"
                        max-width="122"
                      ></v-img>
                    </v-col>
                    <v-col
                      cols="12"
                      class="flex align-center justify-center text-h5"
                    >
                      อัพโหลดภาพงานศิลปะ
                    </v-col>
                    <v-col
                      cols="12"
                      class="flex align-center justify-center text-caption"
                    >
                      ( ขนาดไฟล์งานไม่เกิน 10 Mb ต้องเป็นไฟล์ JPG, PNG )
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
                        >เลือกไฟล์</v-btn
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
                    >แก้ไข
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
                    >ยกเลิก</v-btn
                  >
                </v-col>
                <v-col cols="auto">
                  <v-btn
                    color="#FF6B81"
                    class="white--text btn-size-lg"
                    depressed
                    @click="CourseUpdateArkwork()"
                    >บันทึก
                  </v-btn>
                </v-col>
              </v-row>
            </v-tab-item>
            <!-- STUDENT LIST -->
            <v-tab-item value="student list">
              <v-tabs v-model="student_tab" color="#ff6b81" class="mb-3">
                <v-tab value="students in course">นักเรียนในคอร์ส</v-tab>
                <v-tab value="student booking">นักเรียนจองคิว</v-tab>
                <v-tab value="student potential">นักเรียนที่จบ</v-tab>
              </v-tabs>
              <v-tabs-items v-model="student_tab" class="rounded-lg">
                <v-tab-item valus="students in course">
                  <!-- <pre>{{coach_list}}</pre> -->
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
                        <v-col class="text-[#ff6b81] font-bold"
                          >รายชื่อโค้ช</v-col
                        >
                        <v-col cols="auto">
                          <v-text-field
                            class="bg-white rounded-lg"
                            dense
                            outlined
                            hide-details
                            placeholder="ค้นหาชื่อนักเรียน, ชื่อโค้ช"
                            prepend-inner-icon="mdi-magnify"
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
                    <div v-if="coach_list.length === 0">
                      <v-card dense outlined>
                        <v-card-text>
                          <v-row>
                            <v-col class="font-bold" align="center">
                              ไม่พบข้อมูลนักเรียน
                            </v-col>
                          </v-row>
                        </v-card-text>
                      </v-card>
                    </div>
                    <template v-else>
                      <div
                        v-for="(coach, coach_index) in coach_list"
                        :key="`${coach_index}-coach_index`"
                      >
                        <v-card
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
                                โค้ช:
                                {{ `${coach.firstNameTh} ${coach.lastNameTh}` }}
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
                                  outlined
                                  hide-details
                                  placeholder="วัน"
                                ></v-autocomplete>
                              </v-col>
                              <v-col>
                                <v-autocomplete
                                  dense
                                  outlined
                                  hide-details
                                  placeholder="วันที่"
                                ></v-autocomplete>
                              </v-col>
                              <v-col>
                                <v-autocomplete
                                  dense
                                  outlined
                                  hide-details
                                  placeholder="เวลา"
                                ></v-autocomplete>
                              </v-col>
                              <v-col>
                                <v-autocomplete
                                  dense
                                  outlined
                                  hide-details
                                  placeholder="แพ็คเกจ"
                                ></v-autocomplete>
                              </v-col>
                            </v-row>
                            <!-- Herder -->
                            <v-row dense class="mb-3 font-bold">
                              <v-col cols="auto">
                                <div style="width: 44px"></div>
                              </v-col>
                              <v-col cols="3" align="center"
                                >วันและวันที่</v-col
                              >
                              <v-col cols="3" align="center">เวลาเรียน</v-col>
                              <v-col
                                cols="3"
                                align="center"
                                v-if="course_data.course_type_id === 'CT_1'"
                                >แพ็คเกจ</v-col
                              >
                              <v-col align="right"></v-col>
                            </v-row>
                            <v-card
                              v-if="coach.datesList.length === 0"
                              outlined
                              class="my-3"
                            >
                              <v-card-text
                                class="text-lg font-bold"
                                align="center"
                              >
                                ไม่พบข้อมูลนักเรียน
                              </v-card-text>
                            </v-card>
                            <div v-if="coach.datesList.length > 0">
                              <div
                                v-for="(date, index_date) in coach.datesList"
                                :key="`${index_date}-date`"
                              >
                                <v-card
                                  @click="selectSchedule(index_date, date)"
                                  outlined
                                  class="rounded-lg cursor-pointer mb-3"
                                  dense
                                >
                                  <!-- {{ student }} -->
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
                                                ไม่พบข้อมูลนักเรียน
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
                                          <v-col cols="auto"
                                            >ข้อมูลนักเรียน</v-col
                                          >
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
                                              <v-col cols="1" align="center"
                                                >ลำดับ</v-col
                                              >
                                              <v-col cols align="center">
                                                ชื่อ - นามสกุล
                                              </v-col>
                                              <v-col
                                                cols="2"
                                                align="center"
                                                v-if="
                                                  course_data.course_type ===
                                                  'CT_1'
                                                "
                                              >
                                                ระยะเวลา
                                              </v-col>
                                              <v-col
                                                cols="2"
                                                align="center"
                                                v-if="
                                                  course_data.course_type ===
                                                  'CT_1'
                                                "
                                              >
                                                จำนวนครั้ง
                                              </v-col>
                                              <v-col
                                                cols="4"
                                                align="center"
                                                v-else
                                              >
                                                วันเริ่ม - วันสิ้นสุด
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
                                                    `${student.firstNameTh} ${student.lastNameTh}`
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
                                                        ดูประเมิน
                                                      </v-btn>
                                                    </v-col>
                                                    <v-col class="pa-0">
                                                      <v-btn
                                                        text
                                                        class="px-1"
                                                        color="#ff6b81"
                                                      >
                                                        <v-icon>
                                                          mdi-clipboard-text-search-outline
                                                        </v-icon>
                                                        ดูโปรไฟล์
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
                                            <!-- <pre>{{ student }}</pre> -->
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
                                                    `${student.firstNameTh} ${student.lastNameTh}`
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
                                                        ดูประเมิน
                                                      </v-btn>
                                                    </v-col>
                                                    <v-col class="pa-0">
                                                      <v-btn
                                                        text
                                                        class="px-1"
                                                        color="#ff6b81"
                                                      >
                                                        <v-icon>
                                                          mdi-clipboard-text-search-outline
                                                        </v-icon>
                                                        ดูโปรไฟล์
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
                    <template v-slot:[`item.fullname`]="{ item }">
                      {{ `${item.firstNameTh} ${item.lastNameTh}` }}
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
                      {{ `${item.coachFirstNameTh} ${item.coachLastNameTh}` }}
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
                          item.status === 'ติดต่อนักเรียน'
                            ? '#F0F9EE'
                            : '#FFF9E8'
                        "
                        >{{
                          item.status === "waiting"
                            ? "ติดต่อนักเรียน"
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
                        <v-col class="text-[#ff6b81] font-bold"
                          >รายชื่อโค้ช</v-col
                        >
                        <v-col cols="auto">
                          <v-text-field
                            class="bg-white rounded-lg"
                            dense
                            outlined
                            hide-details
                            placeholder="ค้นหาชื่อนักเรียน, ชื่อโค้ช"
                            prepend-inner-icon="mdi-magnify"
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
                    <div v-if="coach_list.length === 0">
                      <v-card dense outlined>
                        <v-card-text>
                          <v-row>
                            <v-col class="font-bold" align="center">
                              ไม่พบข้อมูลนักเรียน
                            </v-col>
                          </v-row>
                        </v-card-text>
                      </v-card>
                    </div>
                    <template v-else>
                      <div
                        v-for="(coach, coach_index) in coach_list"
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
                                โค้ช:
                                {{ `${coach.firstNameTh} ${coach.lastNameTh}` }}
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
                                        ไม่พบข้อมูลนักเรียน
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
                                  <v-col cols="auto">ข้อมูลนักเรียน</v-col>
                                  <v-col>
                                    <v-divider></v-divider>
                                  </v-col>
                                </v-row>
                                <v-card class="mb-2" flat dense>
                                  <v-card-text
                                    class="pa-2 bg-[#FCE0E7] rounded-lg"
                                  >
                                    <v-row dense class="text-md font-bold">
                                      <v-col cols="1" align="center"
                                        >ลำดับ</v-col
                                      >
                                      <v-col cols align="center"
                                        >ชื่อ - นามสกุล
                                      </v-col>
                                      <!-- <v-col cols="1" align="center"
                                                                            >ชื่อเล่น
                                                                            </v-col
                                                                            > -->
                                      <!-- <v-col cols="3" align="center"
                                                                            >วันเริ่ม - วันสิ้นสุด
                                                                            </v-col> -->
                                      <v-col cols="2" align="center"
                                        >ระยะเวลา
                                      </v-col>
                                      <v-col cols="2" align="center"
                                        >จำนวนครั้ง
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
                                    <!-- <pre>{{ potential }}</pre> -->
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
                                        <!-- <v-col cols="3" align="center">{{
                                                                                        `${student.start_date} - ${student.end_date}`
                                                                                    }}
                                                                                </v-col> -->
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
                                              >
                                                <v-icon
                                                  >mdi-check-decagram-outline
                                                </v-icon>
                                                ดูประเมิน
                                              </v-btn>
                                            </v-col>
                                            <v-col class="pa-0">
                                              <v-btn
                                                text
                                                class="px-1"
                                                color="#ff6b81"
                                              >
                                                <v-icon>
                                                  mdi-clipboard-text-search-outline
                                                </v-icon>
                                                ดูโปรไฟล์
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
                การประเมิน
              </v-col>
            </v-row>
            <v-card v-if="student_data_assessment?.potential" class="mb-3">
              <v-card-text>
                <v-row>
                  <v-col cols="auto">
                    <v-img
                      width="40"
                      height="40"
                      src="../../../assets/course/potential.png"
                    ></v-img>
                  </v-col>
                  <v-col cols class="font-bold text-lg"> ประเมินภาพรวม </v-col>
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
                        check_in_status_options.filter(
                          (v) => v.value === student_data_assessment.status
                        )[0].label
                      }}
                    </v-chip>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-card flat>
                      <v-card-text class="bg-[#FBF3F5]">
                        <v-row dense>
                          <v-col>
                            {{
                              student_data_assessment.potential.remark
                                ? student_data_assessment.potential.remark
                                : "-"
                            }}
                          </v-col>
                        </v-row>
                        <v-row dense>
                          <v-col>
                            พัฒนาการ:
                            <span class="text-[#ff6b81] font-bold"
                              >{{
                                student_data_assessment.potential.evolution
                                  ? student_data_assessment.potential
                                      .evolution === "very good"
                                    ? "ดีมาก"
                                    : student_data_assessment.potential
                                        .evolution === "good"
                                    ? "ดี"
                                    : "ปรับปรุง"
                                  : "-"
                              }}
                            </span>
                            ความสนใจ:
                            <span class="font-bold text-[#ff6b81]">{{
                              student_data_assessment.potential.interest
                                ? student_data_assessment.potential.interest ===
                                  "very good"
                                  ? "ดีมาก"
                                  : student_data_assessment.potential
                                      .interest === "good"
                                  ? "ดี"
                                  : "ปรับปรุง"
                                : "-"
                            }}</span>
                          </v-col>
                        </v-row>
                        <v-row dense>
                          <v-col
                            v-for="(file, index) in student_data_assessment
                              .potential.attachmentPotential"
                            :key="`${index}-attachment`"
                          >
                            <v-img
                              width="89"
                              height="89"
                              :src="readFile(file.attFiles)"
                            ></v-img>
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
            <v-card
              class="mb-3"
              v-if="student_data_assessment?.assessment?.assessmentStudentsId"
            >
              <v-card-text>
                <v-row dense>
                  <v-col cols="auto">
                    <v-icon color="#ff6b81">mdi-calendar-month</v-icon>
                  </v-col>
                  <v-col class="font-bold">
                    {{ student_data_assessment.str_date }}
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
                        check_in_status_options.filter(
                          (v) => v.value === student_data_assessment.status
                        )[0].label
                      }}
                    </v-chip>
                  </v-col>
                </v-row>
                <v-row dense>
                  <v-col cols="auto">
                    เวลาเรียน : {{ student_data_assessment.time }}
                  </v-col>
                </v-row>
                <v-row dense>
                  <v-col>
                    พัฒนาการ:
                    <span class="text-[#ff6b81] font-bold"
                      >{{
                        student_data_assessment.assessment.evolution
                          ? student_data_assessment.assessment.evolution ===
                            "very good"
                            ? "ดีมาก"
                            : student_data_assessment.assessment.evolution ===
                              "good"
                            ? "ดี"
                            : "ปรับปรุง"
                          : "-"
                      }}
                    </span>
                    ความสนใจ:
                    <span class="font-bold text-[#ff6b81]">{{
                      student_data_assessment.assessment.interest
                        ? student_data_assessment.assessment.interest ===
                          "very good"
                          ? "ดีมาก"
                          : student_data_assessment.assessment.interest ===
                            "good"
                          ? "ดี"
                          : "ปรับปรุง"
                        : "-"
                    }}</span>
                  </v-col>
                </v-row>
                <v-row dense>
                  <v-col>
                    <span class="text-[#999999]"> ความคิดเห็น: </span
                    >{{ student_data_assessment.assessment.remark }}
                  </v-col>
                </v-row>
                <v-row dense>
                  <v-col
                    v-for="(file, index) in student_data_assessment.assessment
                      .attachment"
                    :key="`${index}-attachment`"
                  >
                    <v-img
                      width="89"
                      height="89"
                      :src="readFile(file.attFiles)"
                    ></v-img>
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
                  >ตกลง</v-btn
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
import loadingOverlay from "../../../components/loading/loadingOverlay.vue";
import Swal from "sweetalert2";
import { CheckFileSize, dateDMY, dateFormatter } from "@/functions/functions";
// import rowData from '@/components/label/rowData.vue';
import { mapGetters, mapActions } from "vuex";

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
  },
  data: () => ({
    courseValidate : false,
    coachValidate : false,
    packageValidate : false,

    slide_group: null,
    show_dialog_assessmet: false,
    column: [
      {
        text: "ชื่อ - นามสกุล",
        align: "center",
        sortable: false,
        value: "fullname",
      },
      { text: "เบอร์โทรศัพท์", align: "center", sortable: false, value: "tel" },
      {
        text: "ชื่อคอร์ส",
        align: "center",
        sortable: false,
        value: "course_name",
      },
      { text: "แพ็คเกจ", align: "center", sortable: false, value: "package" },
      { text: "โค้ช", align: "center", sortable: false, value: "coach" },
      {
        text: "วันที่จอง",
        align: "center",
        sortable: false,
        value: "createdDate",
      },
      { text: "สถานะ", align: "center", sortable: false, value: "status" },
    ],
    selected_coach: "",
    selected_schedule: "",
    breadcrumbs: [
      { text: "จัดการคอร์สทั้งหมด", to: "CourseList" },
      { text: "รายละเอียดคอร์สเรียน", to: "" },
    ],
    tab: "course",
    tab_menu: [
      {
        label: "คอร์สเรียน",
        value: "course",
        img: "../../../assets/course/course.png",
      },
      {
        label: "ช่วงเวลาและโค้ช",
        value: "time and coach",
        img: "../../../assets/course/time_and_coach.png",
      },
      {
        label: "แพ็คเกจ",
        value: "package",
        img: "../../../assets/course/package.png",
      },
      {
        label: "งานศิลปะ",
        value: "arkwork",
        img: "../../../assets/course/course.png",
      },
      {
        label: "รายชื่อนักเรียน",
        value: "student list",
        img: "../../../assets/course/student_list.png",
      },
    ],
    day_option: [
      { label: "วันอาทิตย์", value: 0 },
      { label: "วันจันทร์", value: 0 },
      { label: "วันอังคาร", value: 0 },
      { label: "วันพุธ", value: 0 },
      { label: "วันพฤหัสบดี", value: 0 },
      { label: "วันศุกร์", value: 0 },
      { label: "วันเสาร์", value: 0 },
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
    selected_all_coach: false,
    selected_coach_potential: null,
  }),
  created() {},
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
      RemovePrivilageByCourseID  : "CourseModules/RemovePrivilageByCourseID"
    }),
    readFile(file) {
      return `${process.env.VUE_APP_URL}/api/v1/files/${file}`;
    },
    seletedCoachPotential(coach, index) {
      this.selected_coach_potential = index;
      console.log(coach);
      this.GetStudentPotentialByCoach({
        course_id: this.$route.params.course_id,
        coach_id: coach.coachId,
      });
    },
    getDateFormattor(date, format) {
      // console.log(date, format)
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
      const daysOfWeek = [
        "วันอาทิตย์",
        "วันจันทร์",
        "วันอังคาร",
        "วันพุธ",
        "วันพฤหัสบดี",
        "วันศุกร์",
        "วันเสาร์",
      ];
      if (day.search(",") > -1) {
        let day_arr = day.split(",");
        const validDays = day_arr.filter((d) => d >= 0 && d <= 6);
        if (validDays) {
          const firstThreeDays = validDays.map((d) => daysOfWeek[d]);
          return `${firstThreeDays.join(" , ")}`;
        } else {
          return "Invalid days";
        }
      } else {
        return daysOfWeek[day];
      }
    },
    openFilePrivilegeSelector() {
      this.$refs.fileInputPrivilege.click();
    },
    openFileArtworSelector() {
      this.$refs.fileInputArtwork.click();
    },
    // UPDATE FILE
    uploadPrivilegeFile() {
      this.privilege_file = this.$refs.fileInputPrivilege.files[0];
      const allowedTypes = ["image/png", "image/jpeg"];
      if (CheckFileSize(this.privilege_file) === true) {
        const fileType = this.file.type; 
        console.log(fileType)
        if (fileType === 'image/png' || fileType === 'image/jpeg') {
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
        }else{
          Swal.fire({
            icon: "error",
            title: "อัพโหลดเฉพาะไฟล์รูปภาพ(png, jpeg)เท่านั้น",
            showDenyButton: false,
            showCancelButton: false,
            confirmButtonText: "ตกลง",
            cancelButtonText: "ยกเลิก",
          })
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
        if (CheckFileSize(file) === true) {
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
          } else {
            // Display error message or handle invalid file type
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
        title: "ต้องการลบไฟล์นี้ใช่หรือไม่",
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: "ตกลง",
        cancelButtonText: "ยกเลิก",
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
    removePrivilegeFileData(){
      Swal.fire({
        icon: "question",
        title: "ต้องการลบไฟล์นี้ใช่หรือไม่",
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: "ตกลง",
        cancelButtonText: "ยกเลิก",
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.RemovePrivilageByCourseID({ course_id: this.$route.params.course_id });
          this.preview_privilege_url = null;
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
    CourseUpdateDetail() {
      this.$refs.course_form.validate()
      if(this.courseValidate){
        Swal.fire({
          icon: "question",
          title: "ต้องการแก้ไขคอร์สใช่มั้ย",
          showDenyButton: false,
          showCancelButton: true,
          confirmButtonText: "ตกลง",
          cancelButtonText: "ยกเลิก",
        }).then(async (result) => {
          if (result.isConfirmed) {
            this.UpdateCouserDetail({
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
    CourseUpdateCoach() {
      this.$refs.coach_form.validate()
      console.log(this.coachValidate)
      if(this.coachValidate){
        Swal.fire({
          icon: "question",
          title: "ต้องการแก้ไขคอร์สใช่มั้ย",
          showDenyButton: false,
          showCancelButton: true,
          confirmButtonText: "ตกลง",
          cancelButtonText: "ยกเลิก",
        }).then(async (result) => {
          if (result.isConfirmed) {
            this.UpdateCouserCoach({
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
    CourseUpdatePackage() { 
      this.$refs.package_form.validate()
      if(this.packageValidate){
        Swal.fire({
          icon: "question",
          title: "ต้องการแก้ไขคอร์สใช่มั้ย",
          showDenyButton: false,
          showCancelButton: true,
          confirmButtonText: "ตกลง",
          cancelButtonText: "ยกเลิก",
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
        title: "ต้องการแก้ไขคอร์สใช่มั้ย",
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: "ตกลง",
        cancelButtonText: "ยกเลิก",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await this.UpdateCourseArkwork({
            course_id: this.course_data.course_id,
            course_data: this.course_data,
          }).then( async () => {
            await setTimeout(async()=>{
              await this.GetArtworkByCourse({
                course_id: this.$route.params.course_id,
              });
              this.course_edit = false;
              this.preview_privilege_url = this.course_data.course_img_privilege;
            },200)
            await this.GetCourse(this.$route.params.course_id)
          });

        }
      });
    },
    updateCourse() {
      Swal.fire({
        icon: "question",
        title: "ต้องการแก้ไขคอร์สใช่มั้ย",
        showDenyButton: false,
        showCancelButton: false,
        confirmButtonText: "ตกลง",
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.UpdateCourse({ course_data: this.course_data });
        }
      });
      // this.ChangeCourseData(this.course_data);
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
                  menu_start_time: false,
                  end_time: "",
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
  },
};
</script>
<style >
</style>
  
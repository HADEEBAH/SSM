<template>
  <v-container>
    <loading-overlay :loading="categorys_is_loading"></loading-overlay>
    <v-row dense>
      <v-col class="my-5" style="text-align: -webkit-center" cols="12">
        <div class="cicle">
          <v-img
            class="image-cropper items-end"
            :src="
              profile_detail.image !== ''
                ? profile_detail.image
                : require('@/assets/profile/default_image_profile.svg')
            "
          />
        </div>
      </v-col>
    </v-row>
    <div class="text-center text-xl font-bold">
      {{
        $i18n.locale == "th"
          ? profile_detail.firstNameTh
          : profile_detail.firstNameEng
      }}
      {{
        $i18n.locale == "th"
          ? profile_detail.lastNameTh
          : profile_detail.lastNameEng
      }}
    </div>
    <div class="my-3 text-center">
      <v-btn
        depressed
        color="#FF6B81"
        class="white--text rounded-xl"
        @click="show_detail()"
      >
        {{ $t("view personal information") }}
      </v-btn>
    </div>
    <!-- ROLE STUDENT คอร์สเรียน-->
    <div v-if="profile_detail?.userRoles?.roleId === 'R_5'">
      <div class="mt-8">
        <label-custom :text="$t('course')"></label-custom>
      </div>
      <v-divider class="mb-3"></v-divider>
      <!-- COURSE -->
      <v-row
        dense
        class="d-flex align-center cursor-pointer"
        @click="
          $router.push({
            name: 'FrontPortfolio',
            params: { account_id: user_login.account_id },
          })
        "
      >
        <v-col cols="2" sm="1">
          <v-icon class="pa-2" color="#ff6b81">mdi-book-account-outline</v-icon>
        </v-col>
        <v-col cols="5" sm="6"> {{ $t("port") }} </v-col>
      </v-row>
      <v-row
        dense
        class="mt-3 cursor-pointer"
        @click="
          $router.push({
            name: 'StudentsSchedule',
            params: { action: 'MyCourse' },
          })
        "
      >
        <v-col cols="2" sm="1">
          <v-icon class="pa-2" color="#ff6b81">mdi-school-outline</v-icon>
        </v-col>
        <v-col cols="5" sm="6" align="left" class="mt-1" align-self="center">
          <label>{{ $t("my course") }}</label>
        </v-col>
        <v-col cols="3" sm="4" align="right" class="mt-1">
          <label class="pink--text">
            {{ student_course.length }}
            {{ $t("courses") }}</label
          >
        </v-col>
        <v-col cols="2" sm="1" align="right" class="mt-2">
          <span class="mdi mdi-chevron-right"></span>
        </v-col>
      </v-row>

      <!-- CERTIFICATE -->
      <v-row
        dense
        class="mt-3 mb-3 cursor-pointer"
        @click="
          $router.push({
            name: 'ProfileCertificate',
            params: { account_id: profile_detail.userOneId },
          })
        "
      >
        <v-col cols="2" sm="1">
          <v-icon class="pa-2" color="#ff6b81"
            >mdi-file-certificate-outline</v-icon
          >
        </v-col>
        <v-col
          cols="5"
          sm="6"
          alopenAddRelationDialogStudent
          information
          in
          chargeign="left"
          class="mt-1"
          align-self="center"
        >
          {{ $t("competitions and certificates") }}
        </v-col>
        <v-col cols="3" sm="4" align="right" class="mt-1">
          <label class="pink--text"
            >{{ certificate_count.countCertificate }}
            {{ $t("competition") }}</label
          >
        </v-col>
        <v-col cols="2" sm="1" align="right" class="mt-2">
          <span class="mdi mdi-chevron-right"></span>
        </v-col>
      </v-row>
    </div>

    <!-- ROLE STUDENT ข้อมูลผู้ปกครอง -->
    <div v-if="profile_detail?.userRoles?.roleId === 'R_5'">
      <v-row class="mb-1">
        <v-col align="start" class="d-flex align-center">
          <label-custom :text="$t('parent information')"></label-custom>
        </v-col>
        <v-col cols="auto" align="end">
          <v-btn dense outlined color="#ff6b81" @click="openAddRelationDialog">
            <v-icon>mdi-plus-circle-outline</v-icon
            >{{ $t("add parent information") }}</v-btn
          >
        </v-col>
      </v-row>
      <v-divider class="mb-3"></v-divider>
      <!-- card parent -->
      <div v-if="relation_data.length > 0">
        <v-card
          v-for="(profile, index) in relation_data"
          :key="`${index}-profile`"
          class="cursor-pointer my-5"
          @click="openParentDialog(profile.parent)"
        >
          <v-card-text>
            <v-row dense>
              <!-- col avatar -->
              <v-col cols="auto" v-if="profile.parent.parentImage !== ''">
                <v-img
                  :src="profile.parent.parentImage"
                  alt="Card image"
                  class="rounded-full ml-3 image-cropper"
                  style="max-width: 50px; max-height: 50px"
                />
              </v-col>
              <v-col cols="auto" v-else>
                <v-img
                  src="@/assets/userKingdom/default_image_profile.svg"
                  alt="Card image"
                  class="rounded-full ml-3 image-cropper"
                  style="max-width: 50px; max-height: 50px"
                />
              </v-col>
              <!-- col name -->
              <v-col cols="8" sm="10" class="d-flex align-center pa-3">
                <v-row dense>
                  <v-col cols="6" sm="4">
                    {{
                      $i18n.locale == "th"
                        ? profile.parent.parentFirstnameTh
                        : profile.parent.parentFirstnameEn
                    }}
                    <!-- {{
                      !profile.parent.parentFirstnameTh
                        ? "-"
                        : profile.parent.parentFirstnameTh
                    }} -->
                  </v-col>
                  <v-col cols="6" sm="4">
                    {{
                      $i18n.locale == "th"
                        ? profile.parent.parentLastnameTh
                        : profile.parent.parentLastnameEn
                    }}

                    <!-- {{
                      !profile.parent.parentLastnameTh
                        ? "-"
                        : profile.parent.parentLastnameTh
                    }} -->
                  </v-col>
                  <v-col class="text-slate-400">{{
                    !profile.parent.parentTel ? "-" : profile.parent.parentTel
                  }}</v-col>
                </v-row>
              </v-col>
              <!-- col arrow -->
              <v-col cols="auto" class="d-flex align-center justify-center">
                <v-icon>mdi-chevron-right</v-icon>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </div>
      <div v-else>
        <v-card class="rounded-lg my-3">
          <v-card-text class="text-center border-2 border-[#ff6b81] rounded-lg">
            <span class="text-lg font-bold">
              <v-icon color="#ff6b81">mdi-alert-outline</v-icon>
              {{ $t("parent information not found") }}
            </span>
          </v-card-text>
        </v-card>
        <!-- <v-card dense outlined>
          <v-card-text
            class="pa-5 text-center border-2 border-[#ff6b81] rounded-lg"
          >
            <span class="text-lg font-bold">
              <v-icon color="#ff6b81">mdi-alert-outline</v-icon>
              ไม่พบข้อมูลของผู้ปกครอง
            </span>
          </v-card-text>
        </v-card> -->
      </div>
    </div>

    <!-- ROLE ALL ทั่วไป -->
    <div class="mb-3">
      <div class="mt-8">
        <label-custom :text="$t('general')"></label-custom>
      </div>
      <v-divider class=""></v-divider>
      <!-- password -->
      <v-row dense class="mt-3 cursor-pointer" @click="show_password()">
        <v-col cols="2" sm="1">
          <v-icon class="pa-2" color="#ff6b81">mdi-lock-outline</v-icon>
        </v-col>
        <v-col cols="8" sm="9" align="left" class="mt-1">
          <label>{{ $t("password") }}</label>
        </v-col>

        <v-col cols="2" sm="2" align="right">
          <span class="mdi mdi-chevron-right"></span>
        </v-col>
      </v-row>
      <!-- 
      <v-row dense class="mt-3 cursor-pointer">
        <v-col cols="2" sm="1">
          <v-icon class="pa-2" color="#ff6b81">mdi mdi-earth</v-icon>
        </v-col>
        <v-col cols="8" sm="9" align="left" class="mt-1">
          <label>{{ $t("language") }}</label>
        </v-col>

        <v-col cols="2" sm="2" align="right">
          <span class="mdi mdi-chevron-right"></span>
        </v-col>
      </v-row> -->
    </div>
    <!-- ROLE PARENT ข้อมูลนักเรียนในความดูแล-->
    <div v-if="profile_detail?.userRoles?.roleId === 'R_4'">
      <v-row class="mb-1">
        <v-col align="start" class="d-flex align-center">
          <label-custom
            :text="$t('student information in charge')"
          ></label-custom>
        </v-col>
        <v-col cols="auto" align="end">
          <v-btn dense outlined color="#ff6b81" @click="openAddRelationDialog">
            <v-icon>mdi-plus-circle-outline</v-icon>
            {{ $t("add student information in charge") }}</v-btn
          >
        </v-col>
      </v-row>
      <v-divider class="mb-3"></v-divider>
      <div v-if="relation_data.length >= 1">
        <v-card
          v-for="(profile, index) in relation_data"
          :key="`${index}-profile`"
          class="mb-5 cursor-pointer"
          @click="openDialogStudent(profile.student)"
        >
          <v-row dense class="my-5">
            <!-- col avatar -->
            <v-col cols="12" sm="2" class="webkit-center">
              <div v-if="profile.student.studentImage !== ''">
                <img
                  :src="profile.student.studentImage"
                  alt="Card image"
                  class="rounded-full image-cropper ml-3"
                  style="max-width: 50px; max-height: 50px"
                />
              </div>
              <div v-else>
                <img
                  src="@/assets/userKingdom/default_image_profile.svg"
                  alt="Card image"
                  class="rounded-full image-cropper ml-3"
                  style="max-width: 50px; max-height: 50px"
                />
              </div>
            </v-col>

            <v-col cols="12" sm="10" class="d-flex align-center pa-3">
              <v-row dense>
                <v-col cols="4">
                  <!-- {{
                    !profile.student.studentFirstnameTh
                      ? "-"
                      : profile.student.studentFirstnameTh
                  }} -->
                  <!-- {{ profile.student.studentFirstnameEn }}
                  {{ profile.student.studentFirstnameTh }} -->
                  {{
                    $i18n.locale == "th"
                      ? profile.student.studentFirstnameTh
                      : profile.student.studentFirstnameEn
                  }}
                </v-col>
                <v-col cols="4">
                  <!-- {{
                    !profile.student.studentLastnameTh
                      ? "-"
                      : profile.student.studentLastnameTh
                  }} -->
                  {{
                    $i18n.locale == "th"
                      ? profile.student.studentLastnameTh
                      : profile.student.studentLastnameEn
                  }}
                </v-col>
                <v-col class="pink--text">
                  {{ profile.student.course }}
                  {{ $t("courses") }}
                </v-col>

                <!-- col arrow -->
                <v-col cols="auto">
                  <span class="mdi mdi-chevron-right"></span>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card>
      </div>
      <div v-else>
        <v-card class="rounded-lg my-3">
          <v-card-text class="text-center border-2 border-[#ff6b81] rounded-lg">
            <span class="text-lg font-bold">
              <v-icon color="#ff6b81">mdi-alert-outline</v-icon>
              {{ $t("student information not found") }}
            </span>
          </v-card-text>
        </v-card>
      </div>
    </div>
    <!-- ROLE ALL -->
    <div class="mt-8">
      <label-custom :text="$t('policy')"></label-custom>
    </div>
    <v-divider class=""></v-divider>
    <v-row dense class="mt-3 cursor-pointer" @click="show_rules()">
      <v-col cols="2" sm="1">
        <v-icon class="pa-2" color="#ff6b81">mdi-file-document-outline</v-icon>
      </v-col>
      <v-col cols="8" sm="9" align="left" class="mt-1" align-self="center">
        <label>{{ $t("terms of service and privacy policy") }}</label>
      </v-col>

      <v-col cols="2" sm="2" align="right">
        <span class="mdi mdi-chevron-right"></span>
      </v-col>
    </v-row>

    <div class="my-3 text-center">
      <v-btn
        depressed
        color="#FF6B81"
        class="white--text rounded-lg drop-shadow-lg"
        @click="logOut"
      >
        {{ $t("logout") }}
      </v-btn>
    </div>
    <!-- PARENT DIALOG  -->
    <v-dialog
      v-if="dialog_show"
      class="pa-2"
      :width="!MobileSize ? `60vw` : ``"
      v-model="dialog_show"
      persistent
    >
      <v-card>
        <v-card-title>
          <v-row>
            <v-col cols="6" align="left">
              {{ $t("parent information") }}
            </v-col>
            <v-col cols="6" align="right">
              <v-btn icon @click="closeDialog">
                <v-icon color="#ff6b81">mdi-close</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text>
          <div class="profileCard my-5 center">
            <v-img
              src="@/assets/userManagePage/imgcardafterupload.png"
              class="iconInCard drop-shadow-md"
            >
            </v-img>
            <div style="position: absolute">
              <div v-if="getParentDataDialog.parentImage != ''">
                <v-img
                  :src="getParentDataDialog.parentImage"
                  class="image-cropper"
                >
                </v-img>
              </div>
              <div v-else>
                <v-img
                  src="@/assets/userKingdom/default_image_profile.svg"
                  class="image-cropper"
                  style="width: 190px; height: 190px"
                >
                </v-img>
              </div>
            </div>
          </div>
          <v-row dense>
            <!--TH NAME -->
            <v-col cols="12" sm="6">
              <label-custom :text="$t('first name(thai)')"></label-custom>
              <br />
              {{
                $i18n.locale == "th"
                  ? getParentDataDialog.parentFirstnameTh
                  : getParentDataDialog.parentFirstnameEn
              }}

              <!-- {{
                !getParentDataDialog.parentFirstnameTh
                  ? "-"
                  : getParentDataDialog.parentFirstnameTh
              }} -->
            </v-col>
            <!-- TH LNAME -->
            <v-col cols="12" sm="6">
              <label-custom :text="$t('last name(thai)')"></label-custom>
              <br />
              {{
                $i18n.locale == "th"
                  ? getParentDataDialog.parentLastnameTh
                  : getParentDataDialog.parentLastnameEn
              }}

              <!-- {{
                !getParentDataDialog.parentLastnameTh
                  ? "-"
                  : getParentDataDialog.parentLastnameTh
              }} -->
            </v-col>
            <!-- nationality -->
            <v-col cols="12" sm="6">
              <label-custom :text="$t('nationality')"></label-custom>
              <br />
              {{
                !getParentDataDialog.parentNation
                  ? "-"
                  : getParentDataDialog.parentNation
              }}
            </v-col>
            <!-- tel -->
            <v-col cols="12" sm="6">
              <label-custom :text="$t('phone number')"></label-custom>
              <br />
              {{
                !getParentDataDialog.parentTel
                  ? "-"
                  : getParentDataDialog.parentTel
              }}
            </v-col>
            <!-- email -->
            <v-col cols="12" sm="6">
              <label-custom :text="$t('email')"></label-custom>
              <br />
              {{
                !getParentDataDialog.parentEmail
                  ? "-"
                  : getParentDataDialog.parentEmail
              }}
            </v-col>
          </v-row>
          <v-row dense>
            <v-col align="center">
              <v-btn
                class="white--text"
                color="#FF6B81"
                @click="removeRelation(getParentDataDialog)"
              >
                {{ $t("delete parent data") }}
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
        <div class="my-5 text-center"></div>
      </v-card>
    </v-dialog>
    <!-- STUDENT DIALOG  -->
    <v-dialog
      v-if="show_student_data"
      class="pa-2"
      :width="!MobileSize ? `60vw` : ``"
      v-model="show_student_data"
      persistent
    >
      <v-card>
        <v-card-title>
          <v-row>
            <v-col cols="6" align="left">
              {{ $t("student information") }}
            </v-col>
            <v-col cols="6" align="right">
              <v-btn icon @click="closeDialog">
                <v-icon color="#ff6b81">mdi-close</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text>
          <v-row style="text-align: -webkit-center" class="justify-center my-5">
            <div class="cicle">
              <v-img
                class="image-cropper"
                :src="
                  dialogGetStudentData.studentImage !== ''
                    ? dialogGetStudentData.studentImage
                    : require(`@/assets/userKingdom/default_image_profile.svg`)
                "
              />
            </div>
          </v-row>

          <v-row dense>
            <!--TH NAME -->
            <v-col cols="12" sm="6">
              <label-custom :text="$t('first name(thai)')"></label-custom>
              <br />
              {{
                $i18n.locale == "th"
                  ? dialogGetStudentData.studentFirstnameTh
                  : dialogGetStudentData.studentFirstnameEn
              }}
              <!-- {{
                !dialogGetStudentData.studentFirstnameTh
                  ? "-"
                  : dialogGetStudentData.studentFirstnameTh
              }} -->
            </v-col>
            <!-- TH LNAME -->
            <v-col cols="12" sm="6">
              <label-custom :text="$t('last name(thai)')"></label-custom>
              <br />
              {{
                $i18n.locale == "th"
                  ? dialogGetStudentData.studentLastnameTh
                  : dialogGetStudentData.studentLastnameEn
              }}

              <!-- {{
                !dialogGetStudentData.studentLastnameTh
                  ? "-"
                  : dialogGetStudentData.studentLastnameTh
              }} -->
            </v-col>
            <!-- nationality -->
            <v-col cols="12" sm="6">
              <label-custom :text="$t('nationality')"></label-custom>
              <br />
              {{
                !dialogGetStudentData.studentNation
                  ? "-"
                  : dialogGetStudentData.studentNation
              }}
            </v-col>
            <!-- tel -->
            <v-col cols="12" sm="6">
              <label-custom :text="$t('phone number')"></label-custom>
              <br />
              {{
                !dialogGetStudentData.studentTel
                  ? "-"
                  : dialogGetStudentData.studentTel
              }}
            </v-col>
            <!-- email -->
            <v-col cols="12" sm="6">
              <label-custom :text="$t('email')"></label-custom>
              <br />
              {{
                !dialogGetStudentData.studentEmail
                  ? "-"
                  : dialogGetStudentData.studentEmail
              }}
            </v-col>
          </v-row>

          <div class="mt-8">
            <label-custom :text="$t('course')"></label-custom>
          </div>
          <v-divider class=""></v-divider>

          <!-- COURSE -->
          <v-row
            dense
            class="mt-3 d-flex align-center cursor-pointer"
            @click="
              $router.push({
                name: 'FrontPortfolio',
                params: { account_id: dialogGetStudentData.studentId },
              })
            "
          >
            <v-col cols="2" sm="1">
              <v-icon class="pa-2" color="#ff6b81"
                >mdi-book-account-outline</v-icon
              >
            </v-col>
            <v-col cols="5" sm="6"> {{ $t("port") }}</v-col>
          </v-row>
          <v-row
            dense
            class="mt-3 cursor-pointer"
            @click="myCourseStudent(dialogGetStudentData.studentId)"
          >
            <v-col cols="2" sm="1">
              <img src="@/assets/profile/cource.png" />
            </v-col>
            <v-col cols="5" sm="6" align="left" class="mt-1">
              <label>{{ $t("student course") }}</label>
            </v-col>
            <v-col cols="3" sm="4" align="right" class="mt-1">
              <label class="pink--text"
                >{{ dialogGetStudentData.course }} {{ $t("courses") }}</label
              >
            </v-col>
            <v-col cols="2" sm="1" align="right" class="mt2">
              <span class="mdi mdi-chevron-right"></span>
            </v-col>
          </v-row>

          <!-- CERTIFICATE -->
          <v-row
            dense
            class="mt-3 cursor-pointer"
            @click="show_certificate(dialogGetStudentData.studentId)"
          >
            <v-col cols="2" sm="1">
              <img src="@/assets/profile/certificate.png" />
            </v-col>
            <v-col cols="5" sm="6" align="left" class="mt-1">
              <label>{{ $t("competitions and certificates") }}</label>
            </v-col>
            <v-col cols="3" sm="4" align="right" class="mt-1">
              <label class="pink--text"
                >{{ certificate_count.countCertificate }}
                {{ $t("competition") }}</label
              >
            </v-col>
            <v-col cols="2" sm="1" align="right" class="mt-2">
              <span class="mdi mdi-chevron-right"></span>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col align="center">
              <v-btn
                class="white--text"
                color="#FF6B81"
                @click="removeRelation(dialogGetStudentData)"
              >
                {{ $t("delete student information") }}
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
        <div class="my-5 text-center"></div>
      </v-card>
    </v-dialog>

    <!-- CHECK USER PARENT DIALOG-->
    <v-dialog
      v-model="add_relation"
      :width="$vuetify.breakpoint.smAndUp ? '50vw' : ''"
    >
      <v-card class="pa-2">
        <v-row dense>
          <v-col cols="12" align="right">
            <v-btn color="#ff6b81" icon @click="closeDialog"
              ><v-icon>mdi-close</v-icon></v-btn
            >
          </v-col>
        </v-row>
        <header-card
          icon="mdi-card-account-details-outline"
          icon_color="#ff6b81"
          :title="
            profile_detail?.userRoles?.roleId === 'R_5'
              ? this.$t('add parents')
              : this.$t('add student')
          "
        >
        </header-card>
        <v-card-text class="pa-2">
          <v-row dense>
            <v-col cols="9">
              <labelCustom :text="this.$t('username')"></labelCustom>
              <v-text-field
                :rules="rules.usernameRules"
                @keydown="validate($event, 'en')"
                ref="username"
                dense
                outlined
                v-model="relation_user.username"
                @change="checkUsername(relation_user.username)"
                :placeholder="this.$t('username')"
              >
                <template v-slot:append>
                  <v-icon v-if="relation_user.account_id" color="green"
                    >mdi-checkbox-marked-circle-outline</v-icon
                  >
                </template>
              </v-text-field>
              <template v-if="!relation_user.account_id">
                <label>
                  {{ $t("if you don't have an account yet, please") }}
                </label>
                <label
                  class="text-[#ff6b81] underline cursor-pointer mt-5"
                  @click="registerRelation"
                  >{{ $t("sign up for One ID") }}</label
                >
              </template>
            </v-col>
            <v-col cols="auto">
              <br />
              <v-btn
                :loading="is_loading"
                color="#ff6b81"
                @click="checkUsername(relation_user.username)"
                depressed
                dark
                >{{ $t("agree") }}</v-btn
              >
            </v-col>
          </v-row>
          <template>
            <v-row dense>
              <v-col cols="12">
                <labelCustom :text="$t('first name(english)')"></labelCustom>
                <v-text-field
                  disabled
                  dense
                  outlined
                  v-model="relation_user.firstname_en"
                  :placeholder="$t('english first name')"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row dense>
              <v-col cols="12">
                <labelCustom :text="$t('last name(english)')"></labelCustom>
                <v-text-field
                  disabled
                  dense
                  outlined
                  v-model="relation_user.lastname_en"
                  :placeholder="$t('english last name')"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row dense>
              <v-col cols="12">
                <labelCustom :text="$t('phone number')"></labelCustom>
                <v-text-field
                  disabled
                  dense
                  outlined
                  v-model="relation_user.tel"
                  :placeholder="$t('phone number')"
                ></v-text-field>
              </v-col>
            </v-row>
          </template>
        </v-card-text>
        <v-card-actions class="px-6">
          <v-row dense>
            <v-col>
              <v-btn
                @click="closeDialog"
                class="w-full"
                color="#ff6b81"
                outlined
                >{{ $t("cancel") }}</v-btn
              >
            </v-col>
            <v-col>
              <v-btn
                :color="!valid ? '#CCCCCC' : '#ff6b81'"
                class="w-full"
                :dark="valid"
                :disabled="!valid"
                depressed
                @click="addRelations"
                >{{ $t("save") }}</v-btn
              >
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- DIALOG::REGISTER -->
    <v-dialog
      persistent
      v-if="show_dialog_register_one_id"
      v-model="show_dialog_register_one_id"
      :width="!MobileSize ? `60vw` : ``"
    >
      {{ register_type }}
      <registerDialogForm
        dialog
        :title="this.$t('sign up for One ID')"
        :state="register_type"
      ></registerDialogForm>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import labelCustom from "@/components/label/labelCustom.vue";
import loadingOverlay from "@/components/loading/loadingOverlay.vue";
import registerDialogForm from "@/components/user_menage/registerDialogForm.vue";
import headerCard from "@/components/header/headerCard.vue";
import VueCookie from "vue-cookie";
import Swal from "sweetalert2";
import axios from "axios";
import { inputValidation } from "@/functions/functions";

export default {
  components: {
    labelCustom,
    loadingOverlay,
    registerDialogForm,
    headerCard,
  },
  data: () => ({
    user_relation: [],
    user_login: {},
    data_local: JSON.parse(localStorage.getItem("userDetail")),
    dialog_show: false,
    show_student_data: false,
    add_parent: false,
    add_relation: false,
    edit_parent: false,
    valid: false,

    set_parent_id: "",
    item_data: "",
    parent: {
      account_id: "",
      firstname_en: "",
      lastname_en: "",
      username: "",
      tel: "",
    },
    relation_user: {
      account_id: "",
      firstname_en: "",
      lastname_en: "",
      username: "",
      tel: "",
    },
    register_type: "parent",
    getParentDataDialog: {},
    getStudentDataDialog: {},
    dialogGetStudentData: {},
    list_course_count: 0,

    userRelationsAccountId: "",
  }),

  created() {
    this.user_login = JSON.parse(localStorage.getItem("userDetail"));
  },
  beforeMount() {
    this.GetRelationDataV2(this.user_login.account_id);
    this.GetProfileDetail(this.user_login.account_id);
    this.GetStudentCourse(this.user_login.account_id);
  },
  mounted() {
    this.$store.dispatch("NavberUserModules/changeTitleNavber", "profile");
    this.GetCertificateCount({ account_id: this.user_login.account_id });
  },

  watch: {
    last_user_registered: function () {
      if (this.last_user_registered.type === "parent") {
        this.AddRelations({
          studentId: this.data_local.account_id,
          parentId: this.last_user_registered.account_id,
        }).then(() => {
          this.GetAll(this.user_login.account_id);
          this.GetRelationDataV2(this.user_login.account_id);
          for (const item of JSON.parse(localStorage.getItem("relations"))) {
            this.GetStudentData(item.student.studentId);
          }
        });
      } else if (this.last_user_registered.type === "student") {
        this.AddRelations({
          studentId: this.last_user_registered.account_id,
          parentId: this.user_login.account_id,
        }).then(() => {
          this.GetAll(this.user_login.account_id);
          this.GetRelationDataV2(this.user_login.account_id);
        });
      }
      this.add_parent = false;
      this.add_relation = false;
    },
  },

  methods: {
    ...mapActions({
      loginOneId: "loginModules/loginOneId",
      logOut: "loginModules/logOut",
      GetAll: "ProfileModules/GetAll",
      GetStudentData: "MyCourseModules/GetStudentData",
      GetCourse: "CourseModules/GetCourse",
      changeDialogRegisterOneId: "RegisterModules/changeDialogRegisterOneId",
      checkUsernameOneid: "loginModules/checkUsernameOneid",
      GetRelations: "OrderModules/GetRelations",
      AddRelations: "RegisterModules/AddRelations",
      RemoveRelation: "RegisterModules/RemoveRelation",
      GetProfileDetail: "ProfileModules/GetProfileDetail",
      GetRelationDataV2: "ProfileModules/GetRelationData",
      GetStudentCourse: "MyCourseModules/GetStudentCourse",
      GetCertificateCount: "UserManageModules/GetCertificateCount",
    }),

    async getStudentData(order_item_id) {
      await this.$store.dispatch("getStudentData", order_item_id);
    },

    validate(e, type) {
      inputValidation(e, type);
    },

    show_detail() {
      this.$router.push({
        name: "ProfileDetail",
        params: { profile_id: this.data_local.account_id },
      });
    },
    show_relations() {
      // role parent
      if (this.data_local.roles.includes("R_4")) {
        this.$router.push({
          name: "ProfileRelations",
          params: { action: "Roleparent_view" },
        });
      } else {
        this.$router.push({
          name: "ProfileRelations",
          params: { action: "Rolestudent_view" },
        });
      }
    },
    show_certificate(account_id) {
      this.$router.push({
        name: "ProfileCertificate",
        params: { account_id: account_id },
      });
    },
    show_password() {
      this.$router.push({ name: "ForgotPassword" });
    },
    show_rules() {
      this.$router.push({ name: "ProfileRules" });
    },
    closeDialog() {
      this.dialog_show = false;
      this.show_student_data = false;
      this.add_relation = false;
    },
    openParentDialog(item) {
      this.getParentDataDialog = item;
      this.dialog_show = true;
    },
    openDialogStudent(item) {
      this.dialogGetStudentData = item;
      this.show_student_data = true;
      this.GetCertificateCount({ account_id: item.studentId });
    },
    openAddRelationDialog() {
      this.add_relation = true;
      this.relation_user = {
        account_id: "",
        firstname_en: "",
        lastname_en: "",
        username: "",
        tel: "",
      };
    },
    registerRelation() {
      this.register_type =
        this.profile_detail?.userRoles?.roleId === "R_5" ? "parent" : "student";
      this.changeDialogRegisterOneId(true);
    },
    async removeRelation(relations) {
      Swal.fire({
        icon: "question",
        title: this.$t("do you want to delete this item?"),
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: this.$t("agree"),
        cancelButtonText: this.$t("cancel"),
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.dialog_show = false;
          this.RemoveRelation({
            studentId:
              this.profile_detail?.userRoles?.roleId === "R_5"
                ? this.profile_detail.userOneId
                : relations.studentId,
            parentId:
              this.profile_detail?.userRoles?.roleId === "R_5"
                ? relations.parentId
                : this.profile_detail.userOneId,
          })
            .then(() => {
              this.GetRelationDataV2(this.user_login.account_id);
              Swal.fire({
                icon: "success",
                title: this.$t("succeed"),
                text: this.$t("already deleted"),
                timer: 3000,
                timerProgressBar: true,
                showCancelButton: false,
                showConfirmButton: false,
              });
            })
            .catch(() => {
              Swal.fire({
                icon: "error",
                title: this.$t("failed to delete"),
                timer: 3000,
                timerProgressBar: true,
                showCancelButton: false,
                showConfirmButton: false,
              });
            });
          this.dialog_show = false;
          this.show_student_data = false;
        }
      });
    },
    checkUsername(username, type) {
      if (username) {
        this.checkUsernameOneid({
          username: username,
          status: "",
          type: type,
        }).then(() => {
          if (type === "student") {
            if (this.user_student_data.length > 0) {
              this.course_order.students.filter(
                (v) => v.username === username
              )[0].firstname_en = this.user_student_data[0].firstNameEng;
              this.course_order.students.filter(
                (v) => v.username === username
              )[0].lastname_en = this.user_student_data[0].lastNameEng;
              this.course_order.students.filter(
                (v) => v.username === username
              )[0].firstname_th = this.user_student_data[0].firstNameTh;
              this.course_order.students.filter(
                (v) => v.username === username
              )[0].lastname_th = this.user_student_data[0].lastNameTh;
              this.course_order.students.filter(
                (v) => v.username === username
              )[0].student_name = `${this.user_student_data[0].firstNameEng} ${this.user_student_data[0].lastNameEng} `;
              this.course_order.students.filter(
                (v) => v.username === username
              )[0].tel = this.user_student_data[0].mobileNo;
              this.course_order.students.filter(
                (v) => v.username === username
              )[0].username = username;
              this.course_order.students.filter(
                (v) => v.username === username
              )[0].account_id = this.user_student_data[0].userOneId;
            } else {
              this.course_order.students.filter(
                (v) => v.username === username
              )[0].firstname_en = "";
              this.course_order.students.filter(
                (v) => v.username === username
              )[0].lastname_en = "";
              this.course_order.students.filter(
                (v) => v.username === username
              )[0].student_name = "";
              this.course_order.students.filter(
                (v) => v.username === username
              )[0].tel = "";
              this.course_order.students.filter(
                (v) => v.username === username
              )[0].username = username;
              this.course_order.students.filter(
                (v) => v.username === username
              )[0].account_id = "";
            }
          } else {
            if (this.user_data.length > 0) {
              if (this.edit_parent) {
                this.edit_parent = false;
              }
              this.relation_user = {
                account_id: this.user_data[0].userOneId,
                username: username,
                firstname_en: this.user_data[0].firstNameEng,
                lastname_en: this.user_data[0].lastNameEng,
                tel: this.user_data[0].mobileNo,
              };

              if (
                this.course_order.students.filter(
                  (v) => v.is_other === false
                )[0]?.parents?.length > 0
              ) {
                let parents = this.course_order.students.filter(
                  (v) => v.is_other === false
                )[0].parents;
                parents[0].firstname_en = this.user_data[0].firstNameEng;
                parents[0].lastname_en = this.user_data[0].lastNameEng;
                parents[0].tel = this.user_data[0].mobileNo;
                parents[0].account_id = this.user_data[0].userOneId;
                parents[0].username = username;
              }
            }
          }
        });
        this.valid = true;
      } else {
        this.user_data = [];
      }
    },
    removeParent(student) {
      this.course_order.students
        .filter((v) => v.username === student.username)[0]
        .parents.splice(0, 1);
    },
    removeParentData(index) {
      this.profile_user.splice(index, 1);
      this.profile_user.push({
        relationId: "",
        studentId: "",
        parentId: "",
        student: {},
        parent: {},
      });
    },

    async addRelations() {
      Swal.fire({
        icon: "question",
        title: this.$t("do you want to add a parent?"),
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: this.$t("agree"),
        cancelButtonText: this.$t("cancel"),
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            let config = {
              headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-type": "Application/json",
                Authorization: `Bearer ${VueCookie.get("token")}`,
              },
            };

            let payload = {};

            if (this.profile_detail?.userRoles?.roleId === "R_5") {
              payload = {
                studentId: this.user_login.account_id,
                parentId: this.relation_user.account_id,
              };
            } else {
              payload = {
                parentId: this.user_login.account_id,
                studentId: this.relation_user.account_id,
              };
            }

            let { data } = await axios.post(
              // `http://localhost:3000/api/v1/relations/user`,
              `${process.env.VUE_APP_URL}/api/v1/relations/user`,
              payload,
              config
            );

            if (data.statusCode === 201) {
              if (data.data.message !== "Duplicate relation.") {
                this.add_relation = false;
                this.GetRelationDataV2(this.user_login.account_id);

                Swal.fire({
                  icon: "success",
                  title: this.$t("succeed"),
                  text: this.$t("saved successfully"),
                  timer: 3000,
                  timerProgressBar: true,
                  showCancelButton: false,
                  showConfirmButton: false,
                });
              } else {
                throw { error: data };
              }
            } else {
              throw { message: data.message };
            }
          } catch ({ response }) {
            if (
              response?.data?.message ===
              "Can not add relations because roles have already, Parent is not match."
            ) {
              this.error_message = this.$t(
                "a relationship cannot be established because they are in the same role"
              );
            } else if (response?.data?.message === "Duplicate relation.") {
              this.error_message = this.$t("duplicate relationship");
            } else if (
              response?.data?.message ===
              "Can not use the same accountID to create Relations."
            ) {
              this.error_message = this.$t(
                "the relationship could not be established because of the same username"
              );
            } else {
              this.error_message = this.$t("something went wrong");
            }
            Swal.fire({
              icon: `${
                this.error_message === this.$t("something went wrong")
                  ? "error"
                  : "warning"
              }`,
              title: `${
                this.error_message === this.$t("something went wrong")
                  ? this.error_message
                  : this.$t("warning")
              }`,
              text: `${
                this.error_message === this.$t("something went wrong")
                  ? ""
                  : `(${this.error_message})`
              }`,
              timer: 3000,
              timerProgressBar: true,
              showCancelButton: false,
              showConfirmButton: false,
            }).then((result) => {
              if (result.isConfirmed) {
                this.add_relation = false;
                this.user_login = JSON.parse(
                  localStorage.getItem("userDetail")
                );
                this.GetRelationDataV2(this.user_login.account_id);
              }
            });
          }
        } else {
          Swal.fire(this.$t("your data will not be saved"), "", "info");
        }
      });
    },

    myCourseStudent(item) {
      this.userRelationsAccountId = item;
      this.$store.dispatch(
        "MyCourseModules/GetMyCourseStudentId",
        this.userRelationsAccountId
      );
      this.$router.push({
        name: "StudentsSchedule",
        params: { action: "MyCourse" },
      });
      this.GetStudentData(this.userRelationsAccountId);
    },
  },
  beforeDestroy() {
    localStorage.setItem("userRelationsAccountId", this.userRelationsAccountId);
  },
  computed: {
    ...mapGetters({
      user_one_id: "loginModules/getUserOneId",
      student_data: "MyCourseModules/getStudentData",
      categorys_is_loading: "CategoryModules/getCategorysIsLoading",
      profile_user: "ProfileModules/getProfileUser",
      course_order: "OrderModules/getCourseOrder",
      last_user_registered: "RegisterModules/getLastUserRegistered",
      show_dialog_register_one_id: "RegisterModules/getShowDialogRegisterOneId",
      user_data: "loginModules/getUserData",
      is_loading: "loginModules/getIsLoading",
      my_course_student_id: "MyCourseModules/getMyCourseStudent",
      my_course: "MyCourseModules/getMyCourse",
      profile_detail: "ProfileModules/getProfileDetail",
      relation_data: "ProfileModules/getRelationData",
      student_course: "MyCourseModules/getStudentCourse",
      certificate_count: "UserManageModules/certificate_count",
    }),
    MobileSize() {
      const { xs } = this.$vuetify.breakpoint;
      return !!xs;
    },

    rules() {
      return {
        usernameRules: [
          (val) =>
            (val || "").length > 5 ||
            this.$t("please enter a username at least 6 characters long"),
          (val) =>
            (val || "").length < 20 ||
            this.$t("please enter a username no longer than 20 characters"),
          (val) =>
            /[A-Za-z0-9 ]/g.test(val) ||
            this.$t("the username cannot contain special characters"),
          (val) =>
            !/[\uD800-\uDBFF][\uDC00-\uDFFF]/g.test(val) ||
            "ชื่อผู้ใช้ต้องไม่มีอิโมจิ",
        ],
        passwordRules: [
          (val) =>
            (val || "").length > 7 ||
            this.$t(
              "please enter a password that is at least 8 characters long"
            ),
          (val) =>
            (val || "").length < 20 ||
            this.$t("please enter a password of no more than 20 characters"),
          (val) =>
            !/[ ]/g.test(val) ||
            this.$t("the username cannot contain special characters"),
        ],
      };
    },
  },
};
</script>

<style scoped>
.profileCard {
  min-height: 200px;
  min-width: 200px;
  max-height: 200px;
  max-width: 200px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.center {
  margin-left: auto;
  margin-right: auto;
}

/* .btncenter {
    display: block;
    margin-left: auto;
    margin-right: auto;
  } */

.profileInCard {
  min-height: 160px;
  min-width: 160px;
  max-height: 200px;
  max-width: 200px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-cropper {
  width: 180px;
  height: 180px;
  position: relative;
  overflow: hidden;
  border-radius: 100%;
  margin: -1%;
}
.webkit-center {
  text-align: -webkit-center;
}
</style>

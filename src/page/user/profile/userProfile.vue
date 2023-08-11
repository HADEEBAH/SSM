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
      {{ profile_detail.firstNameTh }} {{ profile_detail.lastNameTh }}
    </div>
    <div class="my-3 text-center">
      <v-btn
        depressed
        color="#FF6B81"
        class="white--text rounded-xl"
        @click="show_detail()"
      >
        ดูข้อมูลส่วนตัว
      </v-btn>
    </div>
    <!-- ROLE STUDENT คอร์สเรียน-->
    <div v-if="profile_detail?.userRoles?.roleId === 'R_5'">
      <div class="mt-8">
        <label-custom text="คอร์สเรียน"></label-custom>
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
        <v-col cols="5" sm="6"> พอร์ตโฟลิโอ </v-col>
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
          <label>คอร์สเรียนของฉัน</label>
        </v-col>
        <v-col cols="3" sm="4" align="right" class="mt-1">
          <label class="pink--text">
            {{ student_course.length }}
            คอร์ส</label
          >
        </v-col>
        <v-col cols="2" sm="1" align="right" class="mt-2">
          <span class="mdi mdi-chevron-right"></span>
        </v-col>
      </v-row>
      <!-- CERTIFICATE -->
      <v-row dense class="mt-3 mb-3">
        <v-col cols="2" sm="1">
          <v-icon class="pa-2" color="#ff6b81"
            >mdi-file-certificate-outline</v-icon
          >
        </v-col>
        <v-col cols="5" sm="6" align="left" class="mt-1" align-self="center">
          <label>การแข่งขันและเกียรติบัตร</label>
        </v-col>
        <v-col cols="3" sm="4" align="right" class="mt-1">
          <label class="pink--text">2 การแข่ง</label>
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
          <label-custom text="ข้อมูลผู้ปกครอง"></label-custom>
        </v-col>
        <v-col cols="auto" align="end">
          <v-btn dense outlined color="#ff6b81" @click="openAddRelationDialog">
            <v-icon>mdi-plus-circle-outline</v-icon>เพิ่มข้อมูลผู้ปกครอง</v-btn
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
                  src="../../../assets/userKingdom/default_image_profile.svg"
                  alt="Card image"
                  class="rounded-full ml-3 image-cropper"
                  style="max-width: 50px; max-height: 50px"
                />
              </v-col>
              <!-- col name -->
              <v-col cols="8" sm="10" class="d-flex align-center pa-3">
                <v-row dense>
                  <v-col cols="6" sm="4"
                    >{{
                      !profile.parent.parentFirstnameTh
                        ? "-"
                        : profile.parent.parentFirstnameTh
                    }}
                  </v-col>
                  <v-col cols="6" sm="4">
                    {{
                      !profile.parent.parentLastnameTh
                        ? "-"
                        : profile.parent.parentLastnameTh
                    }}</v-col
                  >
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
        <v-card>
          <v-card-text
            class="pa-5 text-center border-2 border-[#ff6b81] rounded-lg"
          >
            <span class="text-lg font-bold">
              <v-icon color="#ff6b81">mdi-alert-outline</v-icon>
              ไม่พบข้อมูลของผู้ปกครอง
            </span>
          </v-card-text>
        </v-card>
      </div>
    </div>

    <!-- ROLE ALL ทั่วไป -->
    <div class="mb-3">
      <div class="mt-8">
        <label-custom text="ทั่วไป"></label-custom>
      </div>
      <v-divider class=""></v-divider>
      <!-- password -->
      <v-row dense class="mt-3 cursor-pointer" @click="show_password()">
        <v-col cols="2" sm="1">
          <v-icon class="pa-2" color="#ff6b81">mdi-lock-outline</v-icon>
        </v-col>
        <v-col cols="8" sm="9" align="left" class="mt-1">
          <label>รหัสผ่าน</label>
        </v-col>

        <v-col cols="2" sm="2" align="right">
          <span class="mdi mdi-chevron-right"></span>
        </v-col>
      </v-row>

      <v-row dense class="mt-3 cursor-pointer">
        <v-col cols="2" sm="1">
          <v-icon class="pa-2" color="#ff6b81">mdi mdi-earth</v-icon>
        </v-col>
        <v-col cols="8" sm="9" align="left" class="mt-1">
          <label>ภาษา</label>
        </v-col>

        <v-col cols="2" sm="2" align="right">
          <span class="mdi mdi-chevron-right"></span>
        </v-col>
      </v-row>
    </div>
    <!-- ROLE PARENT ข้อมูลนักเรียนในความดูแล-->
    <div v-if="profile_detail?.userRoles?.roleId === 'R_4'">
      <v-row class="mb-1">
        <v-col align="start" class="d-flex align-center">
          <label-custom text="ข้อมูลนักเรียนในความดูแล"></label-custom>
        </v-col>
        <v-col cols="auto" align="end">
          <v-btn dense outlined color="#ff6b81" @click="openAddRelationDialog">
            <v-icon>mdi-plus-circle-outline</v-icon
            >เพิ่มข้อมูลนักเรียนในความดูแล</v-btn
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
                  src="../../../assets/userKingdom/default_image_profile.svg"
                  alt="Card image"
                  class="rounded-full image-cropper ml-3"
                  style="max-width: 50px; max-height: 50px"
                />
              </div>
            </v-col>

            <v-col cols="12" sm="10" class="d-flex align-center pa-3">
              <v-row dense>
                <v-col cols="4">
                  {{
                    !profile.student.studentFirstnameTh
                      ? "-"
                      : profile.student.studentFirstnameTh
                  }}
                </v-col>
                <v-col cols="4">
                  {{
                    !profile.student.studentLastnameTh
                      ? "-"
                      : profile.student.studentLastnameTh
                  }}
                </v-col>
                <v-col class="pink--text">
                  {{ profile.student.course }}
                  คอร์ส
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
        <v-card flat>
          <v-card-text
            class="pa-5 text-center border-2 border-[#ff6b81] rounded-lg"
          >
            <span class="text-lg font-bold">
              <v-icon color="#ff6b81">mdi-alert-outline</v-icon>
              ไม่พบข้อมูลของนักเรียน
            </span>
          </v-card-text>
        </v-card>
      </div>
    </div>
    <!-- ROLE ALL -->
    <div class="mt-8">
      <label-custom text="นโยบาย"></label-custom>
    </div>
    <v-divider class=""></v-divider>

    <!-- policy -->
    <!-- <v-row dense class="mt-3" @click="show_policy()">
      <v-col cols="2" sm="1">
        <img src="@/assets/profile/policy.png" />
      </v-col>
      <v-col cols="8" sm="9" align="left" class="mt-1">
        <label>นโยบายการคุ้มครองข้อมูลส่วนบุคลล</label>
      </v-col>

      <v-col cols="2" sm="2" align="right">
        <span class="mdi mdi-chevron-right"></span>
      </v-col>
    </v-row> -->
    <!-- rules -->
    <v-row dense class="mt-3 cursor-pointer" @click="show_rules()">
      <v-col cols="2" sm="1">
        <v-icon class="pa-2" color="#ff6b81">mdi-file-document-outline</v-icon>
      </v-col>
      <v-col cols="8" sm="9" align="left" class="mt-1" align-self="center">
        <label>เงื่อนไขการใช้บริการและนโยบายการคุ้มครองข้อมูลส่วนบุคคล</label>
      </v-col>

      <v-col cols="2" sm="2" align="right">
        <span class="mdi mdi-chevron-right"></span>
      </v-col>
    </v-row>
    <div class="text-center my-5">
      <v-btn outlined color="pink" @click="logOut"> ออกจากระบบ </v-btn>
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
            <v-col cols="6" align="left"> ข้อมูลผู้ปกครอง </v-col>
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
                  src="../../../assets/userKingdom/default_image_profile.svg"
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
              <label-custom text="ชื่อ (ภาษาไทย)"></label-custom>
              <br />
              {{
                !getParentDataDialog.parentFirstnameTh
                  ? "-"
                  : getParentDataDialog.parentFirstnameTh
              }}
            </v-col>
            <!-- TH LNAME -->
            <v-col cols="12" sm="6">
              <label-custom text="นามสกุล (ภาษาไทย)"></label-custom>
              <br />
              {{
                !getParentDataDialog.parentLastnameTh
                  ? "-"
                  : getParentDataDialog.parentLastnameTh
              }}
            </v-col>
            <!-- nationality -->
            <v-col cols="12" sm="6">
              <label-custom text="สัญชาติ"></label-custom>
              <br />
              {{
                !getParentDataDialog.parentNation
                  ? "-"
                  : getParentDataDialog.parentNation
              }}
              <!-- {{ getParentDataDialog.parentNation == null ? '-' : getParentDataDialog.parentNation}} -->
            </v-col>
            <!-- tel -->
            <v-col cols="12" sm="6">
              <label-custom text="เบอร์โทรศัพท์"></label-custom>
              <br />
              {{
                !getParentDataDialog.parentTel
                  ? "-"
                  : getParentDataDialog.parentTel
              }}
            </v-col>
            <!-- email -->
            <v-col cols="12" sm="6">
              <label-custom text="อีเมล"></label-custom>
              <br />
              {{
                !getParentDataDialog.parentEmail
                  ? "-"
                  : getParentDataDialog.parentEmail
              }}
              <!-- {{ getParentDataDialog.parentTel== ''? '-' : getParentDataDialog.parentTel}} -->
            </v-col>
          </v-row>
          <v-row dense>
            <!-- v-if="profile_user.length >= 1" -->

            <v-col align="center">
              <v-btn
                class="white--text"
                color="#FF6B81"
                @click="removeRelation(getParentDataDialog)"
              >
                ลบข้อมูลผู้ปกครอง
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
            <v-col cols="6" align="left"> ข้อมูลนักเรียน </v-col>
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
              <label-custom text="ชื่อ (ภาษาไทย)"></label-custom>
              <br />
              {{
                !dialogGetStudentData.studentFirstnameTh
                  ? "-"
                  : dialogGetStudentData.studentFirstnameTh
              }}
            </v-col>
            <!-- TH LNAME -->
            <v-col cols="12" sm="6">
              <label-custom text="นามสกุล (ภาษาไทย)"></label-custom>
              <br />
              {{
                !dialogGetStudentData.studentLastnameTh
                  ? "-"
                  : dialogGetStudentData.studentLastnameTh
              }}
            </v-col>
            <!-- nationality -->
            <v-col cols="12" sm="6">
              <label-custom text="สัญชาติ"></label-custom>
              <br />
              {{
                !dialogGetStudentData.studentNation
                  ? "-"
                  : dialogGetStudentData.studentNation
              }}
            </v-col>
            <!-- tel -->
            <v-col cols="12" sm="6">
              <label-custom text="เบอร์โทรศัพท์"></label-custom>
              <br />
              {{
                !dialogGetStudentData.studentTel
                  ? "-"
                  : dialogGetStudentData.studentTel
              }}
            </v-col>
            <!-- email -->
            <v-col cols="12" sm="6">
              <label-custom text="อีเมล"></label-custom>
              <br />
              {{
                !dialogGetStudentData.studentEmail
                  ? "-"
                  : dialogGetStudentData.studentEmail
              }}
            </v-col>
          </v-row>

          <div class="mt-8">
            <label-custom text="คอร์สเรียน"></label-custom>
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
            <v-col cols="5" sm="6"> พอร์ตโฟลิโอ</v-col>
          </v-row>
          <v-row
            dense
            class="mt-3 cursor-pointer"
            @click="myCourseStudent(dialogGetStudentData.studentId)"
          >
            <v-col cols="2" sm="1">
              <img src="../../../assets/profile/cource.png" />
            </v-col>
            <v-col cols="5" sm="6" align="left" class="mt-1">
              <label>คอร์สเรียนของนักเรียน</label>
            </v-col>
            <v-col cols="3" sm="4" align="right" class="mt-1">
              <label class="pink--text"
                >{{ dialogGetStudentData.course }} คอร์ส</label
              >
            </v-col>
            <v-col cols="2" sm="1" align="right" class="mt2">
              <span class="mdi mdi-chevron-right"></span>
            </v-col>
          </v-row>

          <!-- CERTIFICATE -->
          <v-row dense class="mt-3 cursor-pointer" @click="show_certificate()">
            <v-col cols="2" sm="1">
              <img src="../../../assets/profile/certificate.png" />
            </v-col>
            <v-col cols="5" sm="6" align="left" class="mt-1">
              <label>การแข่งขันและเกียรติบัตร</label>
            </v-col>
            <v-col cols="3" sm="4" align="right" class="mt-1">
              <label class="pink--text">2 การแข่ง</label>
            </v-col>
            <v-col cols="2" sm="1" align="right" class="mt-2">
              <span class="mdi mdi-chevron-right"></span>
            </v-col>
          </v-row>
          <v-row dense>
            <!-- v-if="profile_user.length >= 1" -->

            <v-col align="center">
              <v-btn
                class="white--text"
                color="#FF6B81"
                @click="removeRelation(dialogGetStudentData)"
              >
                ลบข้อมูลนักเรียน
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
              ? 'เพิ่มผู้ปกครอง'
              : 'เพิ่มนักเรียน'
          "
        >
        </header-card>
        <v-card-text class="pa-2">
          <v-row dense>
            <v-col cols="9">
              <labelCustom text="Username"></labelCustom>
              <v-text-field
                :rules="rules.usernameRules"
                @keypress="validate($event, 'en')"
                ref="username"
                dense
                outlined
                v-model="relation_user.username"
                @change="checkUsername(relation_user.username)"
                placeholder="Username"
              >
                <template v-slot:append>
                  <v-icon v-if="relation_user.account_id" color="green"
                    >mdi-checkbox-marked-circle-outline</v-icon
                  >
                </template>
              </v-text-field>
              <template v-if="!relation_user.account_id">
                <label> หากยังไม่มีบัญชีผู้ใช้กรุณา </label>
                <label
                  class="text-[#ff6b81] underline cursor-pointer mt-5"
                  @click="registerRelation"
                  >สมัคร One ID</label
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
                >ตกลง</v-btn
              >
            </v-col>
          </v-row>
          <template>
            <v-row dense>
              <v-col cols="12">
                <labelCustom text="ชื่อ(ภาษาอังกฤษ)"></labelCustom>
                <v-text-field
                  disabled
                  dense
                  outlined
                  v-model="relation_user.firstname_en"
                  placeholder="ชื่อภาษาอังกฤษ"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row dense>
              <v-col cols="12">
                <labelCustom text="นามสกุล(ภาษาอังกฤษ)"></labelCustom>
                <v-text-field
                  disabled
                  dense
                  outlined
                  v-model="relation_user.lastname_en"
                  placeholder="นามสกุลภาษาอังกฤษ"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row dense>
              <v-col cols="12">
                <labelCustom text="เบอร์โทรศัพท์"></labelCustom>
                <v-text-field
                  disabled
                  dense
                  outlined
                  v-model="relation_user.tel"
                  placeholder="เบอร์โทรศัพท์"
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
                >ยกเลิก</v-btn
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
                >บันทึก</v-btn
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
        title="สมัคร One ID"
        :state="register_type"
      ></registerDialogForm>
    </v-dialog>
  </v-container>
  <!-- </v-form> -->
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import labelCustom from "@/components/label/labelCustom.vue";
import loadingOverlay from "../../../components/loading/loadingOverlay.vue";
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
    rules: {
      usernameRules: [
        (val) =>
          (val || "").length > 5 ||
          "โปรดระบุชื่อผู้ใช้ความยาวไม่น้อยกว่า 6 ตัวอักษร",
        (val) =>
          (val || "").length < 20 ||
          "โปรดระบุชื่อผู้ใชความยาวไม่เกิน 20 ตัวอักษร",
        (val) => /[A-Za-z0-9 ]/g.test(val) || "ชื่อผู้ใช้ต้องไม่มีอักขระพิเศษ",
        (val) =>
          !/[\uD800-\uDBFF][\uDC00-\uDFFF]/g.test(val) ||
          "ชื่อผู้ใช้ต้องไม่มีอิโมจิ",
      ],
      passwordRules: [
        (val) =>
          (val || "").length > 7 ||
          "โปรดระบุรหัสผ่านความยาวอย่างน้อย 8 ตัวอักษร",
        (val) =>
          (val || "").length < 20 ||
          "โปรดระบุรหัสผ่านความยาวไม่เกิน 20 ตัวอักษร",
        (val) => !/[ ]/g.test(val) || "ชื่อผู้ใช้ต้องไม่มีอักขระพิเศษ",
      ],
    },

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
    this.$store.dispatch("NavberUserModules/changeTitleNavber", "โปรไฟล์");
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
    show_certificate() {
      this.$router.push({ name: "ProfileCertificate" });
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
        title: "คุณต้องการลบรายการนี้ใช่หรือไม่ ?",
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: "ตกลง",
        cancelButtonText: "ยกเลิก",
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
              Swal.fire({
                icon: "success",
                title: "ลบสำเร็จ",
              });
              this.GetRelationDataV2(this.user_login.account_id);
            })
            .catch(() => {
              Swal.fire({
                icon: "error",
                title: "ลบไม่สำเร็จ",
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
        title: "คุณต้องการเพิ่มผู้ปกครองหรือไม่",
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: "ตกลง",
        cancelButtonText: "ยกเลิก",
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
                Swal.fire({
                  icon: "success",
                  title: "บันทึกสำเร็จ",
                });
                this.add_relation = false;
                this.GetRelationDataV2(this.user_login.account_id);
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
              this.error_message =
                "ไม่สามารถสร้างความสัมพันธ์ได้เนื่องจากอยู่ในบทบาทเดียวกัน";
            } else if (response?.data?.message === "Duplicate relation.") {
              this.error_message = "ความสัมพันธ์ซ้ำกัน";
            } else if (
              response?.data?.message ===
              "Can not use the same accountID to create Relations."
            ) {
              this.error_message =
                "ไม่สามารถสร้างความสัมพันธ์ได้เนื่องจากชื่อผู้ใช้เดียวกัน";
            } else {
              this.error_message = "เกิดข้อผิดพลาด";
            }
            Swal.fire({
              icon: `${
                this.error_message === "เกิดข้อผิดพลาด" ? "error" : "warning"
              }`,
              title: `${
                this.error_message === "เกิดข้อผิดพลาด"
                  ? this.error_message
                  : "คำเตือน"
              }`,
              text: `${
                this.error_message === "เกิดข้อผิดพลาด"
                  ? ""
                  : `(${this.error_message})`
              }`,
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
          Swal.fire("ข้อมูลของคุณจะไม่บันทึก", "", "info");
        }
      });
    },

    myCourseStudent(item) {
      this.userRelationsAccountId = item;
      this.$store.dispatch(
        "MyCourseModules/GetMyCourseStudentId",
        this.userRelationsAccountId
      );
      this.$router.push({ name: "StudentsSchedule" });
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
    }),
    MobileSize() {
      const { xs } = this.$vuetify.breakpoint;
      return !!xs;
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

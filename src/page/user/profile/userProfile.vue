<template>
  <v-container>
    <!-- {{ my_course }} -->
    <!-- {{ profile_user }} -->
    <!-- {{ data_local }} -->

    <loading-overlay :loading="categorys_is_loading"></loading-overlay>

    <!-- <div class="profileCard my-5 center">
      <v-img
        src="@/assets/userManagePage/imgcardafterupload.png"
        class="iconInCard drop-shadow-md"
      >
      </v-img>
      <div style="position: absolute">
        <div>
          <v-img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTC_N_JBXW49fAT5BDrX0izmY5Z8lx-we3Oag&usqp=CAU"
            class="image-cropper"
          >
          </v-img>
        </div>
      </div>
    </div> -->
    <v-row dense>
      <v-col class="my-5" style="text-align: -webkit-center" cols="12">
        <!-- {{ profile_detail.image }} -->
        <!-- {{ data_local.image }} -->
        <div class="cicle">
          <v-img
            class="image-cropper items-end"
            :src="
              data_local.image !== ''
                ? data_local.image
                : `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTC_N_JBXW49fAT5BDrX0izmY5Z8lx-we3Oag&usqp=CAU`
            "
          />
        </div>
      </v-col>
    </v-row>
    <div class="text-center text-xl font-bold">
      {{ data_local.first_name_th }} {{ data_local.last_name_th }}
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
    <div v-if="data_local.roles.includes('R_5')">
      <div class="mt-8">
        <label-custom text="คอร์สเรียน"></label-custom>
      </div>
      <v-divider class=""></v-divider>
      <!-- COURSE -->
      <v-row
        dense
        class="mt-3"
        @click="$router.push({ name: 'StudentsSchedule' })"
      >
        <v-col cols="2" sm="1">
          <img src="../../../assets/profile/cource.png" />
        </v-col>
        <v-col cols="5" sm="6" align="left" class="mt-1">
          <label>คอร์สเรียนของฉัน</label>
        </v-col>
        <v-col cols="3" sm="4" align="right" class="mt-1">
          <label class="pink--text">{{ student_data.length }} คอร์ส</label>
        </v-col>
        <v-col cols="2" sm="1" align="right" class="mt2">
          <span class="mdi mdi-chevron-right"></span>
        </v-col>
      </v-row>
      <!-- CERTIFICATE -->
      <!-- @click="show_certificate() -->
      <v-row dense class="mt-3 mb-3">
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
    </div>

    <!-- ROLE STUDENT ข้อมูลผู้ปกครอง -->
    <div v-if="data_local.roles.includes('R_5')">
      <v-row class="mb-1">
        <v-col align="start" class="d-flex align-center">
          <label-custom text="ข้อมูลผู้ปกครอง"></label-custom>
        </v-col>
        <v-col cols="auto" align="end">
          <v-btn dense outlined color="#ff6b81" @click="openAddParentDialog">
            <v-icon>mdi-plus-circle-outline</v-icon>เพิ่มข้อมูลผู้ปกครอง</v-btn
          >
        </v-col>
      </v-row>
      <v-divider class="mb-3"></v-divider>

      <!-- card parent -->
      <div v-if="profile_user.length >= 1">
        <v-card
          v-for="(profile, index) in profile_user"
          :key="`${index}-profile`"
          class="cursor-pointer my-5"
        >
          <v-row dense class="my-5" @click="openParentDialog(profile.parent)">
            <!-- col avatar -->
            <v-col cols="auto">
              <v-img
                :src="
                  profile.parent.parentImage !== ''
                    ? profile.parent.parentImage
                    : `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEpKC_pI1Y_lmnOSDilaMdTDvWbDicz53xGA&usqp=CAU`
                "
                alt="Card image"
                class="rounded-full ml-3 image-cropper"
                style="max-width: 50px; max-height: 50px"
              />
            </v-col>
            <!-- col name -->
            <v-col cols="12" sm="10" class="d-flex align-center pa-3">
              <v-row dense>
                <v-col cols="4"
                  >{{
                    !profile.parent.parentFirstnameTh
                      ? "-"
                      : profile.parent.parentFirstnameTh
                  }}
                </v-col>
                <v-col cols="4">
                  {{
                    !profile.parent.parentLastnameTh
                      ? "-"
                      : profile.parent.parentLastnameTh
                  }}</v-col
                >
                <v-col class="text-slate-400">{{
                  !profile.parent.parentTel ? "-" : profile.parent.parentTel
                }}</v-col>
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
      <v-row dense class="mt-3" @click="show_password()">
        <v-col cols="2" sm="1">
          <img src="@/assets/profile/password.png" />
        </v-col>
        <v-col cols="8" sm="9" align="left" class="mt-1">
          <label>รหัสผ่าน</label>
        </v-col>

        <v-col cols="2" sm="2" align="right">
          <span class="mdi mdi-chevron-right"></span>
        </v-col>
      </v-row>
      <!-- translate -->
      <!-- <v-row
        dense
        class="mt-3"
        @click="$router.push({ name: 'ProfileLanguages' })"
      > -->
      <v-row dense class="mt-3">
        <v-col cols="2" sm="1">
          <img src="@/assets/profile/langueges.png" />
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
    <div v-if="data_local.roles.includes('R_4')">
      <v-row class="mb-1">
        <v-col align="start" class="d-flex align-center">
          <label-custom text="ข้อมูลนักเรียนในความดูแล"></label-custom>
        </v-col>
      </v-row>
      <v-divider class="mb-3"></v-divider>
      <div v-if="profile_user.length >= 1">
        <v-card
          v-for="(profile, index) in profile_user"
          :key="`${index}-profile`"
          class="mb-5 cursor-pointer"
        >
          <!-- <pre>{{ profile }}</pre> -->

          <v-row dense class="my-5" @click="openDialogStudent(profile.student)">
            <!-- col avatar -->
            <v-col cols="12" sm="2" class="webkit-center">
              <img
                :src="
                  profile.student.studentImage !== ''
                    ? profile.student.studentImage
                    : `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEpKC_pI1Y_lmnOSDilaMdTDvWbDicz53xGA&usqp=CAU`
                "
                alt="Card image"
                class="rounded-full image-cropper ml-3"
                style="max-width: 50px; max-height: 50px"
              />
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
                  {{
                    my_course.filter(
                      (val) => val.studentId === profile.studentId
                    ).length
                  }}
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
        <v-card>
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
    <v-row dense class="mt-3" @click="show_policy()">
      <v-col cols="2" sm="1">
        <img src="@/assets/profile/policy.png" />
      </v-col>
      <v-col cols="8" sm="9" align="left" class="mt-1">
        <label>นโยบายการคุ้มครองข้อมูลส่วนบุคลล</label>
      </v-col>

      <v-col cols="2" sm="2" align="right">
        <span class="mdi mdi-chevron-right"></span>
      </v-col>
    </v-row>
    <!-- rules -->
    <v-row dense class="mt-3" @click="show_rules()">
      <v-col cols="2" sm="1">
        <img src="@/assets/profile/rules.png" />
      </v-col>
      <v-col cols="8" sm="9" align="left" class="mt-1">
        <label>ข้อกำหนดการและเงื่อนไขการใช้บริการ</label>
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
              <div>
                <v-img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTC_N_JBXW49fAT5BDrX0izmY5Z8lx-we3Oag&usqp=CAU"
                  class="image-cropper"
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
                !getParentData.parentFirstnameTh
                  ? "-"
                  : getParentData.parentFirstnameTh
              }}
            </v-col>
            <!-- TH LNAME -->
            <v-col cols="12" sm="6">
              <label-custom text="นามสกุล (ภาษาไทย)"></label-custom>
              <br />
              {{
                !getParentData.parentLastnameTh
                  ? "-"
                  : getParentData.parentLastnameTh
              }}
            </v-col>
            <!-- nationality -->
            <v-col cols="12" sm="6">
              <label-custom text="สัญชาติ"></label-custom>
              <br />
              ยังไม่มีข้อมูล
              <!-- {{ getParentData.parentNation == null ? '-' : getParentData.parentNation}} -->
            </v-col>
            <!-- id_card -->
            <!-- <v-col cols="12" sm="6">
          <label-custom text="เลขบัตรประชาชน"></label-custom>
          <br/>
           {{getParentData.student_id == ''? '-': getParentData.student_id}}
        </v-col> -->
            <!-- date_of_birth -->
            <!-- <v-col cols="12" sm="6">
          <label-custom text="วันเกิด"></label-custom>
          <br/>
            {{ getParentData.parent_firstname_th == ''? '-' : getParentData.parent_firstname_th}}
        </v-col> -->
            <!-- tel -->
            <v-col cols="12" sm="6">
              <label-custom text="เบอร์โทรศัพท์"></label-custom>
              <br />
              {{ !getParentData.parentTel ? "-" : getParentData.parentTel }}
            </v-col>
            <!-- email -->
            <v-col cols="12" sm="6">
              <label-custom text="อีเมล"></label-custom>
              <br />
              ยังไม่มีข้อมูล
              <!-- {{ getParentData.parentTel== ''? '-' : getParentData.parentTel}} -->
            </v-col>
          </v-row>
          <v-row dense>
            <v-col align="center">
              <v-btn
                class="white--text"
                color="#FF6B81"
                @click="removeRelation(getParentData)"
                v-if="profile_user.length >= 1"
              >
                ลบข้อมูลผู้ปกครอง
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
        <!-- <dialogCard text="แก้ไขอาณาจักรเรียบร้อย"></dialogCard> -->
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
          <!-- <div class="profileCard my-5 center">
            <v-img
              src="@/assets/userManagePage/imgcardafterupload.png"
              class="iconInCard drop-shadow-md"
            >
            </v-img>
            <div style="position: absolute">
              <div>
                <v-img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTC_N_JBXW49fAT5BDrX0izmY5Z8lx-we3Oag&usqp=CAU"
                  class="image-cropper"
                >
                </v-img>
              </div>
            </div>
          </div> -->
          <v-row style="text-align: -webkit-center" class="justify-center my-5">
            <!-- {{ dialogGetStudentData }} -->
            <div class="cicle">
              <v-img
                class="image-cropper"
                :src="
                  dialogGetStudentData.studentImage !== ''
                    ? ialogGetStudentData.studentImage
                    : `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEpKC_pI1Y_lmnOSDilaMdTDvWbDicz53xGA&usqp=CAU`
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
            <!-- id_card -->
            <!-- <v-col cols="12" sm="6">
            <label-custom text="เลขบัตรประชาชน"></label-custom>
            <br/>
            {{ dialogGetStudentData.accountId == ''? '-' : dialogGetStudentData.accountId }}
          </v-col> -->
            <!-- date_of_birth -->
            <!-- <v-col cols="12" sm="6">
            <label-custom text="วันเกิด"></label-custom>
            <br/>
            {{ dialogGetStudentData.accountId == ''? '-' : dialogGetStudentData.accountId }}
          </v-col> -->
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
          <!-- @click="$router.push({ name: 'StudentsSchedule' })" -->

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
                >{{
                  my_course.filter(
                    (val) => val.studentId === dialogGetStudentData.studentId
                  ).length
                }}
                คอร์ส</label
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
        </v-card-text>
        <!-- <dialogCard text="แก้ไขอาณาจักรเรียบร้อย"></dialogCard> -->
        <div class="my-5 text-center"></div>
      </v-card>
    </v-dialog>

    <!-- CHECK USER PARENT DIALOG-->
    <v-dialog v-model="add_parent" width="50vw" class="d-flex align-center">
      <v-card class="pa-2" width="50vw">
        <header-card
          icon="mdi-card-account-details-outline"
          icon_color="#ff6b81"
          title="ผู้ปกครอง"
        >
          <template #actions>
            <v-btn icon @click="closeDialog"><v-icon>mdi-close</v-icon></v-btn>
          </template>
        </header-card>
        <v-card-text class="pb-2">
          <v-row dense>
            <v-col cols="9">
              <labelCustom text="Username"></labelCustom>
              <v-text-field
                :hide-details="!parent.account_id"
                dense
                outlined
                v-model="parent.username"
                @change="checkUsername(parent.username)"
                @keyup.enter="checkUsername(parent.username)"
                @blur="checkUsername(parent.username)"
                placeholder="Username"
              >
                <template v-slot:append>
                  <v-icon v-if="parent.account_id" color="green"
                    >mdi-checkbox-marked-circle-outline</v-icon
                  >
                </template>
              </v-text-field>
              <template v-if="!parent.account_id">
                <label> หากยังไม่มีบัญชีผู้ใช้กรุณา </label>
                <label
                  class="text-[#ff6b81] underline cursor-pointer mt-5"
                  @click="registerParent"
                  >สมัคร One ID</label
                >
              </template>
            </v-col>
            <v-col cols="auto">
              <br />
              <v-btn
                :loading="is_loading"
                color="#ff6b81"
                @click="checkUsername(parent.username)"
                depressed
                dark
                >ตกลง</v-btn
              >
            </v-col>
          </v-row>
          <template>
            <v-row dense>
              <v-col cols="12">
                <labelCustom required text="ชื่อ(ภาษาอักฤษ)"></labelCustom>
                <v-text-field
                  :disabled="user_data.length > 0"
                  dense
                  outlined
                  v-model="parent.firstname_en"
                  placeholder="ชื่อภาษาอังกฤษ"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row dense>
              <v-col cols="12">
                <labelCustom required text="นามสกุล(ภาษาอักฤษ)"></labelCustom>
                <v-text-field
                  :disabled="user_data.length > 0"
                  dense
                  outlined
                  v-model="parent.lastname_en"
                  placeholder="นามสกุลภาษาอังกฤษ"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row dense>
              <v-col cols="12">
                <labelCustom required text="เบอร์โทรศัพท์"></labelCustom>
                <v-text-field
                  :disabled="user_data.length > 0"
                  dense
                  outlined
                  v-model="parent.tel"
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
                class="w-full"
                color="#ff6b81"
                dark
                depressed
                @click="addParent"
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
      <registerDialogForm
        dialog
        title="สมัคร One ID"
        :state="register_type"
      ></registerDialogForm>
    </v-dialog>
  </v-container>
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

// import dialogCard from "@/components/dialog/dialogCard.vue";
// import axios from "axios";
// import VueCookie from "vue-cookie"
export default {
  components: {
    labelCustom,
    loadingOverlay,
    registerDialogForm,
    headerCard,
    // dialogCard,
  },
  data: () => ({
    data_local: JSON.parse(localStorage.getItem("userDetail")),
    dialog_show: false,
    show_student_data: false,
    add_parent: false,
    edit_parent: false,
    set_parent_id: "",
    item_data: "",
    parent: {
      account_id: "",
      firstname_en: "",
      lastname_en: "",
      username: "",
      tel: "",
    },
    register_type: "parent",
    getParentData: {},
    dialogGetStudentData: {},
    list_course_count: 0,
  }),
  created() {
    this.GetRelations({
      student_id: this.user_login.account_id,
      parent_id: "",
    });
    this.user_login = JSON.parse(localStorage.getItem("userDetail"));
    console.log("testq", this.user_relation);
    this.GetAll(this.user_login.account_id);
    for (const item of JSON.parse(localStorage.getItem("relations"))) {
      this.GetStudentData(item.student.studentId);
    }
  },
  mounted() {
    this.$store.dispatch("NavberUserModules/changeTitleNavber", "บัญชีผู้ใช้");
    this.user_login = JSON.parse(localStorage.getItem("userDetail"));
    this.user_relation = JSON.parse(localStorage.getItem("relations"));
    this.GetAll(this.user_login.account_id);
    if (this.order_data) {
      this.GetCourse(this.order_data.course_id);
    }
    this.$store.dispatch("MyCourseModules/GetMyCourseArrayEmpty");
    if (this.$store.state.MyCourseModules.my_course_student_id !== "") {
      this.GetStudentData(
        this.$store.state.MyCourseModules.my_course_student_id
      );
    } else {
      if (JSON.parse(localStorage.getItem("relations"))?.length != 0) {
        for (const item of JSON.parse(localStorage.getItem("relations"))) {
          this.GetStudentData(item.student.studentId);
        }
      } else {
        if (!this.user_detail.roles.includes("R_4")) {
          this.GetStudentData(this.user_detail.account_id);
        } else {
          this.GetStudentData(null);
        }
      }
    }
  },

  watch: {
    "course_order.apply_for_yourself": function () {
      if (this.course_order.apply_for_yourself) {
        this.course_order.students.push({
          account_id: this.user_login.account_id,
          student_name: `${this.user_login.first_name_th} ${this.user_login.last_name_th}`,
          username: "surahet",
          firstname_en: this.user_login.first_name_th,
          lastname_en: this.user_login.last_name_th,
          tel: this.user_login.tel,
          parents: [],
          is_account: false,
          is_other: false,
        });
        if (this.relations.length > 0) {
          this.course_order.students[
            this.course_order.students.length - 1
          ].parents.push({
            account_id: this.relations[0].parent.parentId,
            firstname_en: this.relations[0].parent.parentFirstnameEn,
            lastname_en: this.relations[0].parent.parentLastnameEn,
            username: this.relations[0].parent.parentUsername,
            tel: this.relations[0].parent.parentTel,
          });
        }
      } else {
        this.course_order.students.forEach((student, index) => {
          if (student.is_other === false) {
            this.course_order.students.splice(index, 1);
          }
        });
      }
    },
    "course_order.apply_for_others": function () {
      if (this.course_order.apply_for_others) {
        this.course_order.students.push({
          student_name: "",
          account_id: "",
          username: "",
          firstname_en: "",
          lastname_en: "",
          tel: "",
          parents: [],
          is_account: false,
          is_other: true,
        });
      } else {
        this.course_order.students.forEach((student, index) => {
          if (student.is_other === true) {
            this.course_order.students.splice(index, 1);
          }
        });
      }
    },
    last_user_registered: function () {
      console.log(this.last_user_registered);
      if (this.last_user_registered.type === "parent") {
        this.AddRelations({
          studentId: this.data_local.account_id,
          parentId: this.last_user_registered.account_id,
        }).then(() => {
          this.GetAll(this.user_login.account_id);
          for (const item of JSON.parse(localStorage.getItem("relations"))) {
            this.GetStudentData(item.student.studentId);
          }
        });

        // if (
        //   this.course_order.students.filter((v) => v.is_other === false)[0]
        //     .parents.length === 0
        // ) {
        //   this.course_order.students
        //     .filter((v) => v.is_other === false)[0]
        //     .parents.push({
        //       account_id: this.last_user_registered.account_id,
        //       firstname_en: this.last_user_registered.firstname_en,
        //       lastname_en: this.last_user_registered.lastname_en,
        //       firstname_th: this.last_user_registered.firstname_th,
        //       lastname_th: this.last_user_registered.lastname_th,
        //       tel: this.last_user_registered.phone_number,
        //       username: this.last_user_registered.username,
        //     });
        // } else {
        //   this.course_order.students
        //     .filter((v) => v.is_other === false)[0]
        //     .parents.forEach((parent) => {
        //       parent.account_id = this.last_user_registered.account_id;
        //       parent.firstname_en = this.last_user_registered.firstname_en;
        //       parent.lastname_en = this.last_user_registered.lastname_en;
        //       parent.firstname_th = this.last_user_registered.firstname_th;
        //       parent.lastname_th = this.last_user_registered.lastname_th;
        //       parent.phone_number = this.last_user_registered.phone_number;
        //       parent.username = this.last_user_registered.username;
        //     });
        // }
      } else if (this.last_user_registered.type === "student") {
        this.course_order.students[
          this.course_order.students.length - 1
        ].account_id = this.last_user_registered.account_id;
        this.course_order.students[
          this.course_order.students.length - 1
        ].firstname_en = this.last_user_registered.firstname_en;
        this.course_order.students[
          this.course_order.students.length - 1
        ].lastname_en = this.last_user_registered.lastname_en;
        this.course_order.students[
          this.course_order.students.length - 1
        ].firstname_th = this.last_user_registered.firstname_th;
        this.course_order.students[
          this.course_order.students.length - 1
        ].lastname_th = this.last_user_registered.lastname_th;
        this.course_order.students[
          this.course_order.students.length - 1
        ].student_name = `${this.last_user_registered.firstname_en} ${this.last_user_registered.lastname_en} `;
        this.course_order.students[this.course_order.students.length - 1].tel =
          this.last_user_registered.phone_number;
        this.course_order.students[
          this.course_order.students.length - 1
        ].username = this.last_user_registered.username;
        this.course_order.students[
          this.course_order.students.length - 1
        ].is_other = true;
        this.course_order.students[
          this.course_order.students.length - 1
        ].is_account = true;
        this.course_order.students[
          this.course_order.students.length - 1
        ].parents = [];
      }
      this.dialog_parent = false;
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
    }),

    async getStudentData(order_item_id) {
      await this.$store.dispatch("getStudentData", order_item_id);
      // Access the data in your component
      const studentData = this.$store.state.studentData;
      console.log(studentData);
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
      // this.$router.push({ name: "ProfilePassword" });
      window.location.href = `https://testoneid.inet.co.th/type_forgot_password?oauth_pass=true`;
    },
    show_policy() {
      this.$router.push({ name: "ProfilePolicy" });
    },
    show_rules() {
      this.$router.push({ name: "ProfileRules" });
    },
    closeDialog() {
      this.dialog_show = false;
      this.show_student_data = false;
      this.add_parent = false;
      this.add_parent = false;
    },
    openParentDialog(item) {
      this.getParentData = item;
      this.dialog_show = true;
    },
    openDialogStudent(item) {
      this.dialogGetStudentData = item;
      this.show_student_data = true;
    },
    openAddParentDialog() {
      this.add_parent = true;
    },
    registerParent() {
      this.register_type = "parent";
      // this.changeCourseOrderData(this.course_order)
      this.changeDialogRegisterOneId(true);
    },
    openDialogParent() {
      this.parent = {
        account_id: "",
        firstname_en: "",
        lastname_en: "",
        username: "",
        tel: "",
      };
      this.dialog_parent = true;
    },
    removeRelation(relations) {
      console.log(relations);
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
            studentId: this.data_local.account_id,
            parentId: relations.parentId,
          }).then(() => {
            this.GetAll(this.user_login.account_id);
          });
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
            console.log("user_student_data", this.course_order.students.filter);
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
              this.parent = {
                account_id: this.user_data[0].userOneId,
                username: username,
                firstname_en: this.user_data[0].firstNameEng,
                lastname_en: this.user_data[0].lastNameEng,
                tel: this.user_data[0].mobileNo,
              };
              console.log("course_order", this.course_order);

              if (
                this.course_order.students.filter(
                  (v) => v.is_other === false
                )[0].parents.length > 0
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
      // this.ChangeOrederData(this.order);
    },

    addParent() {
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
            this.user_login = JSON.parse(localStorage.getItem("userDetail"));

            console.log("object", this.user_data);
            for (const data of this.user_data) {
              console.log("data", data);
              this.set_parent_id = data.userOneId;
              console.log("userOneId", this.set_parent_id);
            }
            let payload = {
              studentId: this.user_login.account_id,
              parentId: this.set_parent_id,
            };
            console.log("payload :", payload);
            let { data } = await axios.post(
              `${process.env.VUE_APP_URL}/api/v1/relations/user`,
              payload,
              config
            );

            if (data.statusCode === 201) {
              if (data.data && data.data.message !== "Duplicate relation.") {
                console.log("succes");
                this.add_parent = false;
                this.user_login = JSON.parse(
                  localStorage.getItem("userDetail")
                );
                this.GetAll(this.user_login.account_id);
              } else {
                throw { error: data };
              }
            } else {
              throw { message: data.message };
            }
          } catch (error) {
            console.log(error);
            Swal.fire({
              icon: "error",
              title: "Duplicate relation",
            });
          }
        } else {
          Swal.fire("ข้อมูลของคุณจะไม่บันทึก", "", "info");
        }
      });
    },

    myCourseStudent(item) {
      this.$store.dispatch("MyCourseModules/GetMyCourseStudentId", item);
      this.$router.push({ name: "StudentsSchedule" });
    },
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
    }),
    MobileSize() {
      const { xs } = this.$vuetify.breakpoint;
      return !!xs;
    },

    // studentData: {
    //   get() {
    //     return this.student_data;
    //   },
    // },
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
  max-height: 160px;
  max-width: 160px;
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

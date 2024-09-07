<template>
  <v-form ref="form" v-model="valid" lazy-validation>
    <v-container>
      <v-row dense>
        <v-col class="my-5" style="text-align: -webkit-center" cols="12">
          <div class="cicle">
            <v-img
              class="image-cropper items-end"
              :src="
                preview_file !== ''
                  ? preview_file
                  : profile_detail.image !== ''
                  ? profile_detail.image
                  : require('@/assets/profile/default_image_profile.svg')
              "
            >
              <v-btn
                v-if="isEnabled && preview_file === ''"
                color="#ff6b81"
                @click="openFileSelector"
                class="w-full white--text"
                >{{ $t("change photo") }}</v-btn
              >
              <v-btn
                v-if="preview_file !== ''"
                color="#ff6b81"
                @click="removeImg"
                class="w-full white--text"
              >
                <span class="mdi mdi-close">{{ $t("cancel") }}</span>
              </v-btn>
            </v-img>
          </div>
          <input
            id="fileInput"
            ref="fileInput"
            type="file"
            @change="uploadFile"
            accept="image/*"
            hidden
          />
        </v-col>
        <!--TH NAME -->
        <v-col cols="12" sm="6">
          <label-custom :text="$t('first name(thai)')"></label-custom>
          <v-text-field
            placeholder="-"
            v-model="profile_detail.firstNameTh"
            outlined
            dense
            :rules="rules.firstNameThRules"
            :disabled="!isEnabled"
            color="#ff6b81"
            @keydown="validate($event, 'th-special')"
          >
            <!-- :error-messages="
              getErrorMessage(profile_detail.firstNameTh, 'thai')
            " -->
          </v-text-field>
        </v-col>
        <!-- TH LNAME -->
        <v-col cols="12" sm="6">
          <label-custom :text="$t('last name(thai)')"></label-custom>
          <v-text-field
            placeholder="-"
            v-model="profile_detail.lastNameTh"
            outlined
            dense
            :rules="rules.lastNameThRules"
            :disabled="!isEnabled"
            color="#ff6b81"
            @keydown="validate($event, 'th-special')"
          >
          </v-text-field>
        </v-col>
        <!-- nickname -->
        <v-col cols="12" sm="6">
          <label-custom :text="$t('nickname')"></label-custom>
          <v-text-field
            placeholder="-"
            v-model="profile_detail.nicknameTh"
            outlined
            color="#ff6b81"
            dense
            :rules="rules.nickName"
            @keydown="validate($event, 'free-nonum')"
            :disabled="!isEnabled"
          >
          </v-text-field>
        </v-col>
        <!-- nationality -->
        <!-- @keydown="validate($event, 'th-special')" -->
        <!-- <v-col cols="12" sm="6">
          <label-custom :text="$t('nationality')"></label-custom>
          <v-text-field
            placeholder="-"
            v-model="profile_detail.nation"
            outlined
            dense
            :disabled="!isEnabled"
            color="#ff6b81"
          >
          </v-text-field>
        </v-col> -->
        <v-col cols="12" sm="6">
          <label-custom :text="$t('phone number')"></label-custom>
          <v-text-field
            @keydown="validate($event, 'number')"
            @input="checkPhoneNumber"
            maxlength="12"
            required
            placeholder="-"
            v-model="profile_detail.mobileNo"
            color="#ff6b81"
            outlined
            dense
            disabled
          >
          </v-text-field>
        </v-col>
        <!-- email -->
        <v-col cols="12" sm="6">
          <label-custom :text="$t('email')"></label-custom>
          <v-text-field
            placeholder="-"
            v-model="profile_detail.email"
            outlined
            dense
            disabled
            color="#ff6b81"
          >
          </v-text-field>
        </v-col>
        <!-- nickname -->
        <v-col cols="12" sm="6">
          <label-custom :text="$t('school')"></label-custom>
          <v-text-field
            :placeholder="$t('please specify the name of the school')"
            v-model="profile_detail.school.schoolNameTh"
            outlined
            dense
            color="#ff6b81"
            :disabled="!isEnabled"
          >
          </v-text-field>
          <!-- schoolList -->
          <!-- <v-combobox
            v-model="profile_detail.school.schoolNameTh"
            :items="class_list"
            item-text="classNameTh"
            dense
            outlined
            color="#ff6B81"
            item-color="#ff6b81"
            :placeholder="$t('select school')"
            :disabled="!isEnabled"
          >
            <template #no-data>
              <v-list-item>
                {{ $t("data not found") }}
              </v-list-item>
            </template>
          </v-combobox> -->
        </v-col>
        <v-col
          cols="12"
          sm="6"
          v-if="profile_detail?.userRoles?.roleId === 'R_5'"
        >
          <label-custom :text="$t('class')"></label-custom>
          <v-autocomplete
            v-model="selectedClass"
            :items="class_list"
            item-value="classNameTh"
            item-text="classNameTh"
            color="#ff6B81"
            item-color="#ff6b81"
            outlined
            :rules="!selectedClass.classNameTh ? rules.class : ''"
            :disabled="!isEnabled"
            dense
          >
            <template #no-data>
              <v-list-item>
                {{ $t("data not found") }}
              </v-list-item>
            </template>
          </v-autocomplete>
        </v-col>
        <v-col
          cols="12"
          sm="6"
          v-if="
            profile_detail?.userRoles?.roleId === 'R_5' &&
            selectedClass === 'อื่นๆ'
          "
        >
          <label-custom :text="$t('please enter your class')"></label-custom>
          <v-text-field
            v-model="otherClass"
            placeholder="-"
            outlined
            color="#ff6b81"
            dense
            :rules="rules.class"
            :disabled="!isEnabled"
          >
          </v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <label-custom :text="$t('congenital disease')"></label-custom>
          <v-text-field
            :placeholder="$t('please specify congenital disease')"
            v-model="profile_detail.congenitalDisease"
            outlined
            dense
            color="#ff6b81"
            :disabled="!isEnabled"
          >
          </v-text-field>
          <!-- AllergiesList -->
          <!-- <v-combobox
            v-model="profile_detail.congenitalDisease"
            :items="congenital_list"
            item-text="diseaseNameTh"
            dense
            outlined
            color="#ff6B81"
            item-color="#ff6b81"
            :placeholder="$t('select congenital disease')"
            :disabled="!isEnabled"
          >
            <template #no-data>
              <v-list-item>
                {{ $t("data not found") }}
              </v-list-item>
            </template>
          </v-combobox> -->
        </v-col>
        <!-- BTN -->
      </v-row>
      <v-row justify="center">
        <v-col cols="6" class="my-3 text-center" v-if="!isEnabled">
          <v-btn
            class="white--text mb-5 w-full"
            depressed
            color="#ff6b81"
            @click="edit()"
          >
            <span class="mdi mdi-pencil-outline">{{ $t("edit") }}</span>
          </v-btn>
        </v-col>
        <v-col cols="6" v-if="isEnabled">
          <v-btn
            outlined
            class="my-5 w-full"
            depressed
            color="#ff6b81"
            @click="cancel()"
          >
            <span>{{ $t("cancel") }}</span>
          </v-btn>
        </v-col>
        <v-col cols="6" v-if="isEnabled">
          <v-btn
            :loading="is_loading"
            :disabled="!valid"
            class="white--text my-5 w-full"
            depressed
            :color="!valid ? '' : '#ff6b81'"
            @click="submitEdit()"
          >
            <span>{{ $t("save") }}</span>
          </v-btn>
        </v-col>
      </v-row>
      <v-dialog
        v-if="profile_fail"
        v-model="profile_fail"
        persistent
        :width="$vuetify.breakpoint.smAndUp ? `60vw` : ''"
      >
        <v-card flat>
          <v-card-title>
            <v-row dense>
              <v-col align="center"> {{ $t("incomplete information") }} </v-col>
            </v-row>
          </v-card-title>
          <v-card-text>
            <v-row dense>
              <v-col align="center">
                {{ $t("please complete personal information") }}
              </v-col>
            </v-row>
            <v-row dense>
              <!-- <v-col align="right">
                <v-btn
                  outlined
                  color="#ff6b81"
                  @click="closeDialogPorfile(false)"
                  >{{ $t("cancel") }}</v-btn
                >
              </v-col> -->
              <v-col align="center">
                <v-btn
                  depressed
                  color="#ff6b81"
                  dark
                  @click="closeDialogPorfile(false)"
                  >{{ $t("agree") }}</v-btn
                >
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-container>
  </v-form>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { inputValidation } from "@/functions/functions";
import LabelCustom from "@/components/label/labelCustom.vue";
import VueCookie from "vue-cookie";
import Swal from "sweetalert2";
import axios from "axios";
export default {
  components: {
    LabelCustom,
  },
  data: () => ({
    isEnabled: false,
    valid: false,
    is_loading: false,
    user_detail: {},
    image_profile: {},
    preview_file: "",
    firstNameTh: "",
    lastNameTh: "",
    nation: "",
    mobileNo: "",
    email: "",
    selectedClass: null,
    otherClass: "",
    checkTrue: true,
  }),
  beforeRouteLeave(to, from, next) {
    if (
      this.profile_detail.firstNameTh &&
      this.profile_detail.lastNameTh &&
      !this.isEnabled
    ) {
      next();
    } else {
      this.changeProfileFail(true);
    }
  },
  async created() {
    this.user_detail = JSON.parse(localStorage.getItem("userDetail"));
    await this.GetClassList();
    this.selectedClass = await this.profile_detail.class;
  },
  async mounted() {
    await this.$store.dispatch(
      "NavberUserModules/changeTitleNavber",
      "personal information"
    );
    this.selectedClass = await this.profile_detail.class;
  },
  watch: {
    async selectedClass(newValue) {
      // this.selectedClass = await this.profile_detail.class;
      if (newValue !== "อื่นๆ") {
        this.otherClass = "";
      }
    },
  },

  methods: {
    ...mapActions({
      GetClassList: "ProfileModules/GetClassList",
      loginOneId: "loginModules/loginOneId",
      GetUserData: "ProfileModules/GetUserData",
      GetAll: "ProfileModules/GetAll",
      GetProfileDetail: "ProfileModules/GetProfileDetail",
      changeProfileFail: "loginModules/changeProfileFail",
      GetCongenital: "ProfileModules/GetCongenital",
    }),
    // getErrorMessage(text, language) {
    //   const thaiPattern =
    //     /^[\u0E00-\u0E7F\d\s!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]+$/;

    //   if (language === "thai" && !thaiPattern.test(text)) {
    //     return [this.$t("invalid Thai languages")];
    //   } else {
    //     return [];
    //   }
    // },
    getErrorMessage(text, language) {
      const thaiPattern =
        /^[\u0E00-\u0E7F\d\s!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]+$/;

      if (text === "") {
        return [];
      }
      if (language === "thai" && !thaiPattern.test(text)) {
        return [this.$t("invalid Thai languages")];
      } else {
        return [];
      }
    },
    preventPaste(event) {
      event.preventDefault();
    },
    edit() {
      this.isDisabled = false;
      this.isEnabled = true;
      this.buttonName = this.$t("save");
    },
    cancel() {
      this.GetProfileDetail(this.$route.params.profile_id);
      this.isDisabled = true;
      this.isEnabled = false;
    },
    closeDialogPorfile(value) {
      this.changeProfileFail(value);
    },
    // async submitEdit() {
    //   if (this.$refs.form.validate()) {
    //     Swal.fire({
    //       icon: "question",
    //       title: this.$t("do you want to edit your profile information?"),
    //       showDenyButton: false,
    //       showCancelButton: true,
    //       confirmButtonText: this.$t("agree"),
    //       cancelButtonText: this.$t("cancel"),
    //     }).then(async (result) => {
    //       if (result.isConfirmed) {
    //         try {
    //           this.is_loading = true;
    //           let config = {
    //             headers: {
    //               "Access-Control-Allow-Origin": "*",
    //               "Content-type": "Application/json",
    //               Authorization: `Bearer ${VueCookie.get("token")}`,
    //             },
    //           };

    //           // Extract the classNameTh from selectedClass
    //           let payload = {
    //             firstNameTh: this.profile_detail.firstNameTh,
    //             lastNameTh: this.profile_detail.lastNameTh,
    //             nation: this.profile_detail.nation,
    //             mobileNo: this.profile_detail.mobileNo,
    //             email: this.profile_detail.email,
    //             schoolTh: this.profile_detail.school.schoolNameTh,
    //             nicknameTh: this.profile_detail?.nicknameTh
    //               ? this.profile_detail.nicknameTh
    //               : "",
    //             congenitalDiseaseTh: this.profile_detail?.congenitalDisease
    //               ? this.profile_detail.congenitalDisease
    //               : "",
    //             className:
    //               this.selectedClass?.classNameTh || this.selectedClass,
    //           };

    //           this.user_detail = JSON.parse(localStorage.getItem("userDetail"));
    //           let user_account_id = this.user_detail.account_id;

    //           let payloadData = new FormData();
    //           payloadData.append("payload", JSON.stringify(payload));
    //           if (this.image_profile.name) {
    //             payloadData.append("imageProfile", this.image_profile);
    //           }

    //           let { data } = await axios.patch(
    //             `${process.env.VUE_APP_URL}/api/v1/profile/${user_account_id}`,
    //             payloadData,
    //             config
    //           );

    //           if (data.statusCode === 200) {
    //             let data_storage = JSON.parse(
    //               localStorage.getItem("userDetail")
    //             );
    //             data_storage.first_name_th = data.data.firstNameTh;
    //             data_storage.last_name_th = data.data.lastNameTh;
    //             data_storage.image = `${data.data.image}`;
    //             localStorage.setItem(
    //               "userDetail",
    //               JSON.stringify(data_storage)
    //             );
    //             await this.GetProfileDetail(this.$route.params.profile_id);

    //             this.is_loading = false;
    //             this.preview_file = "";
    //             this.dialog_show = true;
    //             this.isDisabled = true;
    //             this.isEnabled = false;
    //             this.buttonName = this.$t("edit");
    //             document.getElementById("fileInput").value = "";
    //             Swal.fire({
    //               icon: "success",
    //               title: this.$t("succeed"),
    //               text: this.$t("profile has been edited"),
    //               showDenyButton: false,
    //               showCancelButton: false,
    //               showConfirmButton: false,
    //               timerProgressBar: true,
    //               timer: 3000,
    //             });
    //             await this.GetClassList();
    //           } else {
    //             throw { message: data.message };
    //           }
    //         } catch (error) {
    //           Swal.fire({
    //             icon: "error",
    //             title: this.$t("something went wrong"),
    //             text: error.message,
    //             timer: 3000,
    //             timerProgressBar: true,
    //             showCancelButton: false,
    //             showConfirmButton: false,
    //           });
    //         }
    //       }
    //     });
    //   }
    // },
    // async submitEdit() {
    //   if (this.$refs.form.validate()) {
    //     Swal.fire({
    //       icon: "question",
    //       title: this.$t("do you want to edit your profile information?"),
    //       showDenyButton: false,
    //       showCancelButton: true,
    //       confirmButtonText: this.$t("agree"),
    //       cancelButtonText: this.$t("cancel"),
    //     }).then(async (result) => {
    //       if (result.isConfirmed) {
    //         try {
    //           this.is_loading = true;
    //           let config = {
    //             headers: {
    //               "Access-Control-Allow-Origin": "*",
    //               "Content-type": "Application/json",
    //               Authorization: `Bearer ${VueCookie.get("token")}`,
    //             },
    //           };

    //           let payload = {
    //             firstNameTh: this.profile_detail.firstNameTh,
    //             lastNameTh: this.profile_detail.lastNameTh,
    //             nation: this.profile_detail.nation,
    //             mobileNo: this.profile_detail.mobileNo,
    //             email: this.profile_detail.email,
    //             schoolTh: this.profile_detail.school.schoolNameTh,
    //             nicknameTh: this.profile_detail?.nicknameTh
    //               ? this.profile_detail.nicknameTh
    //               : "",
    //             congenitalDiseaseTh: this.profile_detail?.congenitalDisease
    //               ? this.profile_detail.congenitalDisease
    //               : "",
    //             // className: this.profile_detail?.class?.classNameTh
    //             //   ? this.profile_detail.class.classNameTh
    //             //   : "",
    //             className: this.otherClass
    //               ? this.otherClass
    //               : this.selectedClass?.classNameTh,
    //             // className:
    //             //   this.selectedClass?.classNameTh || this.selectedClass,
    //           };

    //           this.user_detail = JSON.parse(localStorage.getItem("userDetail"));
    //           let user_account_id = this.user_detail.account_id;

    //           let payloadData = new FormData();
    //           payloadData.append("payload", JSON.stringify(payload));
    //           if (this.image_profile.name) {
    //             payloadData.append("imageProfile", this.image_profile);
    //           }
    //           // let localhost = "http://localhost:3000";
    //           let { data } = await axios.patch(
    //             // `${localhost}/api/v1/profile/${user_account_id}`,
    //             `${process.env.VUE_APP_URL}/api/v1/profile/${user_account_id}`,
    //             payloadData,
    //             config
    //           );
    //           if (data.statusCode === 200) {
    //             let data_storage = JSON.parse(
    //               localStorage.getItem("userDetail")
    //             );
    //             data_storage.first_name_th = data.data.firstNameTh;
    //             data_storage.last_name_th = data.data.lastNameTh;
    //             data_storage.image = `${data.data.image}`;
    //             localStorage.setItem(
    //               "userDetail",
    //               JSON.stringify(data_storage)
    //             );
    //             this.is_loading = false;
    //             this.preview_file = "";
    //             this.dialog_show = true;
    //             this.isDisabled = true;
    //             this.isEnabled = false;
    //             this.buttonName = this.$t("edit");
    //             document.getElementById("fileInput").value = "";
    //             // Swal.fire({
    //             //   icon: "success",
    //             //   title: "แก้ไขโปรไฟล์สำเร็จ 55",
    //             //   timer: 3000,
    //             // });
    //             Swal.fire({
    //               icon: "success",
    //               title: this.$t("succeed"),
    //               text: this.$t("profile has been edited"),
    //               showDenyButton: false,
    //               showCancelButton: false,
    //               showConfirmButton: false,
    //               timerProgressBar: true,
    //               timer: 3000,
    //             });
    //             await this.GetProfileDetail(this.$route.params.profile_id);

    //             await this.GetClassList();
    //             // this.checkTrue
    //           } else {
    //             throw { message: data.message };
    //           }
    //         } catch (error) {
    //           Swal.fire({
    //             icon: "error",
    //             title: this.$t("something went wrong"),
    //             text: error.message,
    //             timer: 3000,
    //             timerProgressBar: true,
    //             showCancelButton: false,
    //             showConfirmButton: false,
    //           });
    //         }
    //       }
    //     });
    //   }
    // },

    async submitEdit() {
      if (this.$refs.form.validate()) {
        Swal.fire({
          icon: "question",
          title: this.$t("do you want to edit your profile information?"),
          showDenyButton: false,
          showCancelButton: true,
          confirmButtonText: this.$t("agree"),
          cancelButtonText: this.$t("cancel"),
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              this.is_loading = true;
              let config = {
                headers: {
                  "Access-Control-Allow-Origin": "*",
                  "Content-type": "Application/json",
                  Authorization: `Bearer ${VueCookie.get("token")}`,
                },
              };

              let payload = {
                firstNameTh: this.profile_detail.firstNameTh,
                lastNameTh: this.profile_detail.lastNameTh,
                nation: this.profile_detail.nation,
                mobileNo: this.profile_detail.mobileNo,
                email: this.profile_detail.email,
                schoolTh: this.profile_detail.school.schoolNameTh
                  ? this.profile_detail.school.schoolNameTh
                  : "",
                nicknameTh: this.profile_detail?.nicknameTh
                  ? this.profile_detail.nicknameTh
                  : "",
                congenitalDiseaseTh: this.profile_detail?.congenitalDisease
                  ? this.profile_detail.congenitalDisease
                  : "",
                className:
                  this.profile_detail?.userRoles?.roleId == "R_5"
                    ? this.otherClass
                      ? this.otherClass
                      : this.selectedClass?.classNameTh || this.selectedClass
                    : "",
              };

              this.user_detail = JSON.parse(localStorage.getItem("userDetail"));
              let user_account_id = this.user_detail.account_id;

              let payloadData = new FormData();
              payloadData.append("payload", JSON.stringify(payload));
              if (this.image_profile.name) {
                payloadData.append("imageProfile", this.image_profile);
              }

              let { data } = await axios.patch(
                `${process.env.VUE_APP_URL}/api/v1/profile/${user_account_id}`,
                payloadData,
                config
              );
              if (data.statusCode === 200) {
                let data_storage = JSON.parse(
                  localStorage.getItem("userDetail")
                );
                data_storage.first_name_th = data.data.firstNameTh;
                data_storage.last_name_th = data.data.lastNameTh;
                data_storage.image = `${data.data.image}`;
                localStorage.setItem(
                  "userDetail",
                  JSON.stringify(data_storage)
                );
                this.is_loading = false;
                this.preview_file = "";
                this.dialog_show = true;
                this.isDisabled = true;
                this.isEnabled = false;
                this.buttonName = this.$t("edit");
                document.getElementById("fileInput").value = "";

                Swal.fire({
                  icon: "success",
                  title: this.$t("succeed"),
                  text: this.$t("profile has been edited"),
                  showDenyButton: false,
                  showCancelButton: false,
                  showConfirmButton: false,
                  timerProgressBar: true,
                  timer: 3000,
                });

                await this.GetProfileDetail(this.$route.params.profile_id);
                await this.GetClassList();

                // If `otherClass` is not empty, add it to `class_list` if it's not already there
                if (
                  this.otherClass &&
                  !this.class_list.includes(this.otherClass)
                ) {
                  this.class_list.push(this.otherClass);
                }

                // Set `selectedClass` to `otherClass` if `otherClass` is filled
                if (this.otherClass) {
                  this.selectedClass = this.otherClass;
                }
              } else {
                throw { message: data.message };
              }
            } catch (error) {
              Swal.fire({
                icon: "error",
                title: this.$t("something went wrong"),
                text: error.message,
                timer: 3000,
                timerProgressBar: true,
                showCancelButton: false,
                showConfirmButton: false,
              });
            }
          }
        });
      }
    },

    openFileSelector() {
      this.$refs.fileInput.click();
    },

    uploadFile() {
      let allowedExtension = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/bmp",
      ];
      let files = this.$refs.fileInput.files[0];

      if (files.size > (10240 * 1024) / 2) {
        Swal.fire({
          icon: "warning",
          title: this.$t("the file size is too large"),
          text: this.$t("set the size not to exceed 5MB"),
          timer: 3000,
          showDenyButton: false,
          showCancelButton: false,
          showConfirmButton: false,
          timerProgressBar: true,
        });
        document.getElementById("fileInput").value = "";
      } else if (allowedExtension.indexOf(files.type) === -1) {
        Swal.fire({
          icon: "warning",
          title: this.$t("invalid file format"),
          text: this.$t("please upload an image file"),
          timer: 3000,
          showDenyButton: false,
          showCancelButton: false,
          showConfirmButton: false,
          timerProgressBar: true,
        });
        document.getElementById("fileInput").value = "";
      } else {
        this.preview_file = URL.createObjectURL(files);
        this.image_profile = files;
      }
    },

    removeImg() {
      document.getElementById("fileInput").value = "";
      this.preview_file = "";
    },

    validate(e, type) {
      inputValidation(e, type);
    },
    checkPhoneNumber() {
      let x = this.user_data.phone_num.replace(/\D/g, "");
      x = x.match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
      this.user_data.phone_num = !x[2]
        ? x[1]
        : x[1] + "-" + x[2] + (x[3] ? "-" + x[3] : "");
    },
  },
  computed: {
    ...mapGetters({
      class_list: "ProfileModules/classList",
      user_one_id: "loginModules/getUserOneId",
      user_data: "ProfileModules/getUserData",
      profile_user: "ProfileModules/getProfileUser",
      profile_detail: "ProfileModules/getProfileDetail",
      profile_fail: "loginModules/getProfileFail",
      congenital_list: "ProfileModules/getCongenital",
    }),
    // isButtonDisabled() {
    //   // Disable the button if either input has an error
    //   return (
    //     this.getErrorMessage(this.profile_detail.firstNameTh, "thai").length >
    //       0 ||
    //     this.getErrorMessage(this.profile_detail.lastNameTh, "thai").length > 0
    //   );
    // },
    setFunctions() {
      this.GetAll(this.user_detail.account_id);
      this.GetProfileDetail(this.$route.params.profile_id);
      return "";
    },
    // firstNameThRules() {
    //   return [
    //     (val) =>
    //       (val || "").length > 1 ||
    //       this.$t(
    //         "please enter your name (thai) with a length of at least 2 characters"
    //       ),
    //     (val) =>
    //       (val || "").length < 20 ||
    //       this.$t(
    //         "please enter your name (thai) length not exceeding 20 characters"
    //       ),
    //     (val) =>
    //       /[ก-๏\s]/g.test(val) || this.$t("please enter your name in thai"),
    //     (val) =>
    //       val.split(" ").length <= 1 ||
    //       this.$t("please enter your name in thai"),
    //     (val) =>
    //       !/[\uD800-\uDBFF][\uDC00-\uDFFF]/g.test(val) ||
    //       this.$t("please enter your name in thai"),
    //   ];
    // },
    // firstNameEnRules() {
    //   const specialCharsRegex = /[A-Za-z]/g;
    //   const emojiRegex = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
    //   return [
    //     (val) =>
    //       (val || "").length > 1 ||
    //       this.$t(
    //         "please enter your name (english), at least 2 characters long"
    //       ),
    //     (val) =>
    //       (val || "").length < 20 ||
    //       this.$t(
    //         "please enter your name (english) length not exceeding 20 characters"
    //       ),
    //     (val) =>
    //       specialCharsRegex.test(val) ||
    //       this.$t("please enter your name in english"),
    //     (val) =>
    //       !emojiRegex.test(val) || this.$t("please enter your name in english"),
    //   ];
    // },
    // lastNameThRules() {
    //   return [
    //     (val) =>
    //       (val || "").length > 1 ||
    //       this.$t(
    //         "please enter your last name (Thai), at least 2 characters long"
    //       ),
    //     (val) =>
    //       (val || "").length < 20 ||
    //       this.$t(
    //         "please enter your last name (Thai) not more than 20 characters"
    //       ),
    //     (val) =>
    //       val.split(" ").length <= 1 ||
    //       this.$t("please enter your last name in thai"),
    //     (val) =>
    //       /[ก-๏\s]/g.test(val) ||
    //       this.$t("please enter your last name in thai"),
    //     (val) =>
    //       !/[\uD800-\uDBFF][\uDC00-\uDFFF]/g.test(val) ||
    //       this.$t("please enter your last name in thai"),
    //   ];
    // },
    // lastNameEnRules() {
    //   const specialCharsRegex = /[A-Za-z]/g;
    //   const emojiRegex = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
    //   return [
    //     (val) =>
    //       (val || "").length > 1 ||
    //       "โปรดระบุนามสกุล (ภาษาอังกฤษ) ความยาวอย่างน้อย 2 ตัวอักษร",
    //     (val) =>
    //       (val || "").length < 20 ||
    //       "โปรดระบุนามสกุล (ภาษาอังกฤษ) ความยาวไม่เกิน 20 ตัวอักษร",
    //     (val) => specialCharsRegex.test(val) || "กรุณากรอกนามสกุลภาษาอังกฤษ",
    //     (val) => !emojiRegex.test(val) || "กรุณากรอกสกุลภาษาอังกฤษ",
    //   ];
    // },
    rules() {
      return {
        email: [
          (value) => !!value || "Required.",
          (value) => (value || "").length <= 20 || "Max 20 characters",
          (value) => {
            const pattern =
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return pattern.test(value) || this.$t("invalid email");
          },
        ],
        phone_number: [
          (val) =>
            ((val || "").length > 0 && val.length === 12) ||
            this.$t("please enter a 10-digit phone number"),
        ],
        nation: [
          (val) =>
            (val || "").length > 1 ||
            this.$t("please specify the length of not less than 2 characters"),
          (val) =>
            (val || "").length < 20 ||
            this.$t(
              "please specify your identity, length not exceeding 20 characters"
            ),
          (val) =>
            /[ก-๏\s]/g.test(val) ||
            this.$t("nationality cannot contain special characters"),
          (val) =>
            !/[\uD800-\uDBFF][\uDC00-\uDFFF]/g.test(val) ||
            this.$t("sanchat must not have emojis"),
        ],
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
            this.$t("username cannot contain emojis"),
        ],
        firstNameThRules: [
          (val) =>
            (val || "").length > 1 ||
            this.$t(
              "please enter your name (thai) with a length of at least 2 characters"
            ),
          (val) =>
            (val || "").length < 100 ||
            this.$t(
              "please enter your name (thai) length not exceeding 20 characters"
            ),
          (val) =>
            /[ก-๏\s]/g.test(val) || this.$t("please enter your thai name"),
          (val) =>
            !/[\uD800-\uDBFF][\uDC00-\uDFFF]/g.test(val) ||
            this.$t("please enter your thai name"),
        ],
        lastNameThRules: [
          (val) =>
            (val || "").length > 1 ||
            this.$t(
              "please enter your last name (Thai), at least 2 characters long"
            ),
          (val) =>
            (val || "").length < 100 ||
            this.$t(
              "please enter your last name (Thai) not more than 20 characters"
            ),
          (val) =>
            /[ก-๏\s]/g.test(val) ||
            this.$t("please enter your last name in thai"),
          (val) =>
            !/[\uD800-\uDBFF][\uDC00-\uDFFF]/g.test(val) ||
            this.$t("please enter your last name in thai"),
        ],
        lastNameEnRules: [
          (val) =>
            (val || "").length > 1 ||
            "โปรดระบุนามสกุล (ภาษาอังกฤษ) ความยาวอย่างน้อย 2 ตัวอักษร",
          (val) =>
            (val || "").length < 20 ||
            "โปรดระบุนามสกุล (ภาษาอังกฤษ) ความยาวไม่เกิน 20 ตัวอักษร",
          (val) => /[A-Za-z]/g.test(val) || "กรุณากรอกนามสกุลภาษาอังกฤษ",
          (val) =>
            !/[\uD800-\uDBFF][\uDC00-\uDFFF]/g.test(val) ||
            "กรุณากรอกสกุลภาษาอังกฤษ",
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
        nickName: [
          (val) =>
            (val || "").length > 1 ||
            this.$t(
              "please enter your nickName with a length of at least 2 characters"
            ),
          (val) =>
            (val || "").length < 20 ||
            this.$t(
              "please enter your nickName length not exceeding 20 characters"
            ),
          // (val) =>
          //   /[ก-๏\s]/g.test(val) || this.$t("please enter your thai name"),
          // (val) =>
          //   !/[\uD800-\uDBFF][\uDC00-\uDFFF]/g.test(val) ||
          //   this.$t("please enter your thai name"),
        ],
        class: [
          (val) =>
            (val || "").length > 1 || this.$t("please select your class"),
        ],
        confirm_password: (val) =>
          (val && val.length > 7) ||
          "โปรดระบุยืนยันรหัสผ่านความยาวอย่างน้อย 8 ตัวอักษร",
        match: (password) => (value) =>
          value === password || "รหัสผ่านไม่ตรงกัน",
      };
    },
  },
};
</script>

<style script>
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

.center {
  margin-left: auto;
  margin-right: auto;
}
.image-cropper {
  width: 180px;
  height: 180px;
  position: relative;
  overflow: hidden;
  border-radius: 100%;
  margin: -1%;
}
.cicle {
  /* margin: 25px 0; */
  /* padding: 1px; */
  width: 200px;
  height: 200px;
  border-radius: 100%;
  border: 12px solid transparent;
  /* background-size: 100% 100%, 50% 50%, 50% 50%, 50% 50%, 50% 50%; */
  background-repeat: no-repeat;
  background-image: linear-gradient(white, white),
    linear-gradient(30deg, #ff6b81 36%, #ff6b81 30%),
    linear-gradient(120deg, #ff6b81 36%, #ff6b81 30%),
    linear-gradient(300deg, #ff6b81 36%, #ff6b81 30%),
    linear-gradient(210deg, #ff6b81 36%, #ff6b81 30%);
  background-position: center center, left top, right top, left bottom,
    right bottom;
  background-origin: content-box, border-box, border-box, border-box, border-box;
  background-clip: content-box, border-box, border-box, border-box, border-box;
  /* transform: rotate(30deg); */
}
</style>

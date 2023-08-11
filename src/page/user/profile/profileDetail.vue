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
                >เปลี่ยนรูป</v-btn
              >
              <v-btn
                v-if="preview_file !== ''"
                color="#ff6b81"
                @click="removeImg"
                class="w-full white--text"
              >
                <span class="mdi mdi-close">ยกเลิก</span>
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
          <label-custom text="ชื่อ (ภาษาไทย)"></label-custom>
          <v-text-field
            @keypress="validate($event, 'th-special')"
            placeholder="-"
            v-model="profile_detail.firstNameTh"
            outlined
            dense
            :rules="rules.firstNameThRules"
            :disabled="!isEnabled"
          >
          </v-text-field>
        </v-col>
        <!-- TH LNAME -->
        <v-col cols="12" sm="6">
          <label-custom text="นามสกุล (ภาษาไทย)"></label-custom>
          <v-text-field
            @keypress="validate($event, 'th-special')"
            placeholder="-"
            v-model="profile_detail.lastNameTh"
            outlined
            dense
            :rules="rules.lastNameThRules"
            :disabled="!isEnabled"
          >
          </v-text-field>
        </v-col>
        <!-- nationality -->
        <v-col cols="12" sm="6">
          <label-custom text="สัญชาติ"></label-custom>
          <v-text-field
            @keypress="validate($event, 'th-special')"
            placeholder="-"
            v-model="profile_detail.nation"
            outlined
            dense
            :disabled="!isEnabled"
          >
          </v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <label-custom text="เบอร์โทรศัพท์"></label-custom>
          <v-text-field
            @keypress="validate($event, 'th')"
            @input="checkPhoneNumber"
            maxlength="12"
            required
            placeholder="-"
            v-model="profile_detail.mobileNo"
            outlined
            dense
            disabled
          >
          </v-text-field>
        </v-col>
        <!-- email -->
        <v-col cols="12" sm="6">
          <label-custom text="อีเมล"></label-custom>
          <v-text-field
            placeholder="-"
            v-model="profile_detail.email"
            outlined
            dense
            disabled
          >
          </v-text-field>
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
            <span class="mdi mdi-pencil-outline">แก้ไข</span>
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
            <span>ยกเลิก</span>
          </v-btn>
        </v-col>
        <v-col cols="6" v-if="isEnabled">
          <v-btn
            :loading="is_loading"
            :disabled="!valid"
            class="white--text my-5 w-full"
            depressed
            color="#ff6b81"
            @click="submitEdit()"
          >
            <span>บันทึก</span>
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
              <v-col align="center"> ข้อมูลไม่ครบถ้วน </v-col>
            </v-row>
          </v-card-title>
          <v-card-text>
            <v-row dense>
              <v-col align="center"> กรุณากรอกข้อมูลส่วนตัวให้ครบถ้วน </v-col>
            </v-row>
            <v-row dense>
              <v-col align="right">
                <v-btn
                  outlined
                  color="#ff6b81"
                  @click="closeDialogPorfile(false)"
                  >ยกเลิก</v-btn
                >
              </v-col>
              <v-col>
                <v-btn
                  depressed
                  color="#ff6b81"
                  dark
                  @click="closeDialogPorfile(false)"
                  >ตกลง</v-btn
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
    valid: true,
    rules: {
      email: [
        (value) => !!value || "Required.",
        (value) => (value || "").length <= 20 || "Max 20 characters",
        (value) => {
          const pattern =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || "Invalid e-mail.";
        },
      ],
      phone_number: [
        (val) =>
          ((val || "").length > 0 && val.length === 12) ||
          "โปรดระบุเบอร์โทรศัพท์ 10 หลัก",
      ],
      nation: [
        (val) =>
          (val || "").length > 1 ||
          "โปรดระบุสันชาติความยาวไม่น้อยกว่า 2 ตัวอักษร",
        (val) =>
          (val || "").length < 20 ||
          "โปรดระบุสันชาติความยาวไม่เกิน 20 ตัวอักษร",
        (val) => /[ก-๏\s]/g.test(val) || "สันชาติต้องไม่มีอักขระพิเศษ",
        (val) =>
          !/[\uD800-\uDBFF][\uDC00-\uDFFF]/g.test(val) ||
          "สันชาติต้องไม่มีอิโมจิ",
      ],
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
      firstNameThRules: [
        (val) =>
          (val || "").length > 1 ||
          "โปรดระบุชื่อ (ภาษาไทย) ความยาวอย่างน้อย 2 ตัวอักษร",
        (val) =>
          (val || "").length < 20 ||
          "โปรดระบุชื่อ (ภาษาไทย) ความยาวไม่เกิน 20 ตัวอักษร",
        (val) => /[ก-๏\s]/g.test(val) || "กรุณากรอกชื่อภาษาไทย",
        (val) =>
          !/[\uD800-\uDBFF][\uDC00-\uDFFF]/g.test(val) ||
          "กรุณากรอกชื่อภาษาไทย",
      ],
      firstNameEnRules: [
        (val) =>
          (val || "").length > 1 ||
          "โปรดระบุชื่อ (ภาษาอังกฤษ) ความยาวอย่างน้อย 2 ตัวอักษร",
        (val) =>
          (val || "").length < 20 ||
          "โปรดระบุชื่อ (ภาษาอังกฤษ) ความยาวไม่เกิน 20 ตัวอักษร",
        (val) => /[A-Za-z]/g.test(val) || "กรุณากรอกชื่อภาษาอังกฤษ",
        (val) =>
          !/[\uD800-\uDBFF][\uDC00-\uDFFF]/g.test(val) ||
          "กรุณากรอกชื่อภาษาอังกฤษ",
      ],
      lastNameThRules: [
        (val) =>
          (val || "").length > 1 ||
          "โปรดระบุนามสกุล (ภาษาไทย) ความยาวอย่างน้อย 2 ตัวอักษร",
        (val) =>
          (val || "").length < 20 ||
          "โปรดระบุนามสกุล (ภาษาไทย) ความยาวไม่เกิน 20 ตัวอักษร",
        (val) => /[ก-๏\s]/g.test(val) || "กรุณากรอกนามสกุลภาษาไทย",
        (val) =>
          !/[\uD800-\uDBFF][\uDC00-\uDFFF]/g.test(val) ||
          "กรุณากรอกสกุลภาษาไทย",
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
      confirm_password: (val) =>
        (val && val.length > 7) ||
        "โปรดระบุยืนยันรหัสผ่านความยาวอย่างน้อย 8 ตัวอักษร",
      match: (password) => (value) => value === password || "รหัสผ่านไม่ตรงกัน",
    },

    is_loading: false,
    user_detail: {},
    image_profile: {},
    preview_file: "",
    firstNameTh: "",
    lastNameTh: "",
    nation: "",
    mobileNo: "",
    email: "",
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
  created() {
    this.user_detail = JSON.parse(localStorage.getItem("userDetail"));
  },
  mounted() {
    this.$store.dispatch(
      "NavberUserModules/changeTitleNavber",
      "ข้อมูลส่วนตัว"
    );
  },

  methods: {
    ...mapActions({
      loginOneId: "loginModules/loginOneId",
      GetUserData: "ProfileModules/GetUserData",
      GetAll: "ProfileModules/GetAll",
      GetProfileDetail: "ProfileModules/GetProfileDetail",
      changeProfileFail: "loginModules/changeProfileFail",
    }),
    edit() {
      this.isDisabled = false;
      this.isEnabled = true;
      this.buttonName = "บันทึก";
    },
    cancel() {
      this.GetProfileDetail(this.$route.params.profile_id);
      this.isDisabled = true;
      this.isEnabled = false;
    },
    closeDialogPorfile(value) {
      this.changeProfileFail(value);
    },
    submitEdit() {
      if (this.$refs.form.validate()) {
        Swal.fire({
          icon: "question",
          title: "คุณต้องการแก้ไขข้อมูลโปรไฟล์หรือไม่",
          showDenyButton: false,
          showCancelButton: true,
          confirmButtonText: "ตกลง",
          cancelButtonText: "ยกเลิก",
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
                Swal.fire({
                  icon: "success",
                  title: "แก้ไขโปรไฟล์สำเร็จ",
                  timer: 3000,
                });
                let data_storage = JSON.parse(
                  localStorage.getItem("userDetail")
                );
                data_storage.first_name_th = data.data.firstNameTh;
                data_storage.last_name_th = data.data.lastNameTh;
                data_storage.image = `${process.env.VUE_APP_URL}/api/v1/files/${data.data.image}`;
                localStorage.setItem(
                  "userDetail",
                  JSON.stringify(data_storage)
                );
                this.GetProfileDetail(this.$route.params.profile_id);

                this.is_loading = false;
                this.preview_file = "";
                this.dialog_show = true;
                this.isDisabled = true;
                this.isEnabled = false;
                this.buttonName = "แก้ไข";
                document.getElementById("fileInput").value = "";
              } else {
                throw { message: data.message };
              }
            } catch (error) {
              Swal.fire({
                icon: "error",
                title: error.message,
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

      if (files.size > 10240 * 1024) {
        Swal.fire({
          icon: "warning",
          title: "ขนาดไฟล์ใหญ่เกินไป",
          text: "( กำหนดขนาดไม่เกิน 10MB )",
        });
        document.getElementById("fileInput").value = "";
      } else if (allowedExtension.indexOf(files.type) === -1) {
        Swal.fire({
          icon: "warning",
          title: "รูปแบบไฟล์ไม่ถูกต้อง",
          text: "( กรุณาอัปโหลดไฟล์รูปภาพ )",
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
      user_one_id: "loginModules/getUserOneId",
      user_data: "ProfileModules/getUserData",
      profile_user: "ProfileModules/getProfileUser",
      profile_detail: "ProfileModules/getProfileDetail",
      profile_fail: "loginModules/getProfileFail",
    }),
    setFunctions() {
      this.GetAll(this.user_detail.account_id);
      this.GetProfileDetail(this.$route.params.profile_id);
      return "";
    },
    firstNameThRules() {
      const specialCharsRegex = /[ก-๏\s]/g;
      const emojiRegex = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
      return [
        (val) =>
          (val || "").length > 1 ||
          "โปรดระบุชื่อ (ภาษาไทย) ความยาวอย่างน้อย 2 ตัวอักษร",
        (val) =>
          (val || "").length < 20 ||
          "โปรดระบุชื่อ (ภาษาไทย) ความยาวไม่เกิน 20 ตัวอักษร",
        (val) => specialCharsRegex.test(val) || "กรุณากรอกชื่อภาษาไทย",
        (val) => !emojiRegex.test(val) || "กรุณากรอกชื่อภาษาไทย",
      ];
    },
    firstNameEnRules() {
      const specialCharsRegex = /[A-Za-z]/g;
      const emojiRegex = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
      return [
        (val) =>
          (val || "").length > 1 ||
          "โปรดระบุชื่อ (ภาษาอังกฤษ) ความยาวอย่างน้อย 2 ตัวอักษร",
        (val) =>
          (val || "").length < 20 ||
          "โปรดระบุชื่อ (ภาษาอังกฤษ) ความยาวไม่เกิน 20 ตัวอักษร",
        (val) => specialCharsRegex.test(val) || "กรุณากรอกชื่อภาษาอังกฤษ",
        (val) => !emojiRegex.test(val) || "กรุณากรอกชื่อภาษาอังกฤษ",
      ];
    },
    lastNameThRules() {
      const specialCharsRegex = /[ก-๏\s]/g;
      const emojiRegex = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
      return [
        (val) =>
          (val || "").length > 1 ||
          "โปรดระบุนามสกุล (ภาษาไทย) ความยาวอย่างน้อย 2 ตัวอักษร",
        (val) =>
          (val || "").length < 20 ||
          "โปรดระบุนามสกุล (ภาษาไทย) ความยาวไม่เกิน 20 ตัวอักษร",
        (val) => specialCharsRegex.test(val) || "กรุณากรอกนามสกุลภาษาไทย",
        (val) => !emojiRegex.test(val) || "กรุณากรอกสกุลภาษาไทย",
      ];
    },
    lastNameEnRules() {
      const specialCharsRegex = /[A-Za-z]/g;
      const emojiRegex = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
      return [
        (val) =>
          (val || "").length > 1 ||
          "โปรดระบุนามสกุล (ภาษาอังกฤษ) ความยาวอย่างน้อย 2 ตัวอักษร",
        (val) =>
          (val || "").length < 20 ||
          "โปรดระบุนามสกุล (ภาษาอังกฤษ) ความยาวไม่เกิน 20 ตัวอักษร",
        (val) => specialCharsRegex.test(val) || "กรุณากรอกนามสกุลภาษาอังกฤษ",
        (val) => !emojiRegex.test(val) || "กรุณากรอกสกุลภาษาอังกฤษ",
      ];
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

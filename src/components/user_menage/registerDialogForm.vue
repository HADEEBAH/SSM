<template>
  <v-form ref="form" v-model="valid" lazy-validation>
    {{ state }}
    <v-card
      :flat="crad_flat"
      :class="
        $vuetify.breakpoint.mdAndUp ? (dialog ? '' : 'card-padding') : 'py-2'
      "
    >
      <v-card-title>
        <v-row dense v-if="dialog">
          <v-col class="text-right">
            <v-btn icon @click="changeDialogRegisterOneId(false)"
              ><v-icon>mdi-close</v-icon></v-btn
            >
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
        <v-row dense>
          <v-col class="text-center text-lg font-bold">{{ title }}</v-col>
        </v-row>
        <v-row dense>
          <v-col cols="12" sm="6">
            <label>ชื่อ(ภาษาไทย)</label>
            <v-text-field
              dense
              ref="firstname_th"
              :rules="firstNameThRules"
              required
              v-model="user_one_id.firstname_th"
              placeholder="ระบุชื่อ(ภาษาไทย)"
              @change="changeUserOneId(user_one_id)"
              @keypress="Validation($event, 'th')"
              outlined
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <label>นามสกุล(ภาษาไทย)</label>
            <v-text-field
              dense
              ref="lastname_th"
              :rules="lastNameThRules"
              required
              v-model="user_one_id.lastname_th"
              placeholder="ระบุนามสกุล(ภาษาไทย)"
              @change="changeUserOneId(user_one_id)"
              @keypress="Validation($event, 'th')"
              outlined
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="12" sm="6">
            <label>ชื่อ(ภาษาอังกฤษ)</label>
            <v-text-field
              dense
              ref="firstname_en"
              :rules="firstNameEhRules"
              required
              v-model="user_one_id.firstname_en"
              placeholder="ระบุชื่อ(ภาษาอังกฤษ)"
              @change="changeUserOneId(user_one_id)"
              @keypress="Validation($event, 'en')"
              outlined
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <label>นามสกุล(ภาษาอังกฤษ)</label>
            <v-text-field
              dense
              ref="lastname_en"
              :rules="lastNameEnRules"
              required
              v-model="user_one_id.lastname_en"
              placeholder="ระบุนามสกุล(ภาษาอังกฤษ)"
              @change="changeUserOneId(user_one_id)"
              @keypress="Validation($event, 'en')"
              outlined
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col>
            <label>เบอร์โทร</label>
            <v-text-field
              dense
              ref="phone_number"
              maxlength="12"
              :rules="rules.phone_number"
              required
              v-model="user_one_id.phone_number"
              @input="checkPhoneNumber"
              @keypress="Validation($event, 'number')"
              placeholder="ระบุเบอร์โทร"
              @change="changeUserOneId(user_one_id)"
              outlined
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col>
            <!-- <label>ผู้ใช้งาน/OneID(ภาษาอังกฤษ)</label> -->
            <label>Username</label>
            <v-text-field
              autocomplete="off-autofill"
              dense
              ref="username_rig"
              :rules="usernameRules"
              required
              v-model="user_one_id.username"
              placeholder="ระบุชื่อผู้ใช้งาน"
              @keypress="Validation($event, 'en')"
              @change="changeUserOneId(user_one_id)"
              outlined
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col>
            <label>รหัสผ่าน</label>
            <v-text-field
              dense
              autocomplete="off-autofill"
              ref="password_rig"
              @keypress="Validation($event, 'en')"
              :type="show_password ? 'text' : 'password'"
              :rules="passwordRules"
              required
              v-model="user_one_id.password"
              :append-icon="
                show_password ? 'mdi-eye-outline' : 'mdi-eye-off-outline'
              "
              @click:append="show_password = !show_password"
              placeholder="ระบุรหัสผ่าน"
              @change="changeUserOneId(user_one_id)"
              outlined
            >
            </v-text-field>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col>
            <label>ยืนยันรหัสผ่าน</label>
            <v-text-field
              dense
              ref="confirm_password"
              :type="show_confirm_password ? 'text' : 'password'"
              :rules="[
                rules.confirm_password,
                rules.match(user_one_id.password),
              ]"
              required
              v-model="user_one_id.confirm_password"
              placeholder="ยืนยันรหัสผ่าน"
              :append-icon="
                show_confirm_password
                  ? 'mdi-eye-outline'
                  : 'mdi-eye-off-outline'
              "
              @click:append="show_confirm_password = !show_confirm_password"
              @change="changeUserOneId(user_one_id)"
              outlined
            >
            </v-text-field>
          </v-col>
        </v-row>
        <v-row dense class="d-flex align-center">
          <v-col cols="auto">
            <v-checkbox
              v-model="user_one_id.accept_terms"
              @change="changeUserOneId(user_one_id)"
              color="pink lighten-1"
            >
              <template v-slot:label>
                <label>
                  การเปิดบัญชี ท่านรับทราบและตกลงตาม
                  <label class="cursor-pointer underline text-[#FF6B81]"
                    >เงื่อนไขการบริการ & นโยบายความเป็นส่วนตัว</label
                  ></label
                >
              </template>
            </v-checkbox>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-row dense>
          <v-col class="text-center">
            <v-btn
              :loading="is_loading"
              :disabled="!user_one_id.accept_terms"
              depressed
              class="white--text"
              :class="
                $vuetify.breakpoint.mdAndUp
                  ? 'btn-register'
                  : 'w-full btn-register'
              "
              @click="save"
              >ลงทะเบียน</v-btn
            >
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-form>
</template>  
<script>
import { mapActions, mapGetters } from "vuex";
import { inputValidation } from "@/functions/functions";
export default {
  name: "registerDialogForm",
  props: {
    title: { type: String },
    dialog: { type: Boolean, default: false },
    crad_flat: { type: Boolean, default: false },
    state: { type: String },
  },
  data: () => ({
    valid: true,
    show_password: false,
    show_confirm_password: false,
    phone_number: "",
    rules: {
      phone_number: [
        (val) =>
          ((val || "").length > 0 && val.length === 12) ||
          "โปรดระบุเบอร์โทร 10 หลัก",
      ],
      username_rig: [
        (val) =>
          (val || "").length > 5 ||
          "โปรดระบุชื่อผู้ใช้ความยาวอย่างน้อย 6 ตัวอักษร",
      ],
      password_rig: [
        (val) =>
          (val && val.length > 7) ||
          "โปรดระบุรหัสผ่านความยาวอย่างน้อย 8 ตัวอักษร",
      ],
      confirm_password: (val) =>
        (val && val.length > 7) ||
        "โปรดระบุรหัสผ่านความยาวอย่างน้อย 8 ตัวอักษร",
      match: (password) => (value) => value === password || "รหัสผ่านไม่ตรงกัน",
    },
  }),
  created() {},
  mounted() {},
  methods: {
    ...mapActions({
      changeDialogRegisterOneId: "RegisterModules/changeDialogRegisterOneId",
      changeUserOneId: "RegisterModules/changeUserOneId",
      registerUserOneId: "RegisterModules/registerUserOneId",
      registerParent: "RegisterModules/registerParent",
    }),
    checkPhoneNumber() {
      let x = this.user_one_id.phone_number.replace(/\D/g, "");
      x = x.match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
      this.user_one_id.phone_number = !x[2]
        ? x[1]
        : x[1] + "-" + x[2] + (x[3] ? "-" + x[3] : "");
    },
    save() {
      if (this.state === "parent" || this.state === "student") {
        if (this.$refs.form.validate()) {
          console.log(this.registerParent({ type: this.state }));
        }
      } else {
        if (this.$refs.form.validate()) {
          this.registerUserOneId();
        }
      }
    },
    Validation(e, lang) {
      inputValidation(e, lang);
    },
  },
  computed: {
    ...mapGetters({
      is_loading: "RegisterModules/getIsLoading",
      show_dialog_register_one_id: "RegisterModules/getShowDialogRegisterOneId",
      user_one_id: "RegisterModules/getUserOneId",
      course_data: "CourseModules/getCourseData",
    }),
    firstNameThRules() {
      const specialCharsRegex = /[&*/#@! 0-9๐-๙]/g;
      const emojiRegex = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
      return [
        (val) =>
          (val || "").length > 1 ||
          "โปรดระบุชื่อ (ภาษาไทย) ความยาวอย่างน้อย 2 ตัวอักษร",
        (val) =>
          (val || "").length < 20 ||
          "โปรดระบุชื่อ (ภาษาไทย) ความยาวไม่เกิน 20 ตัวอักษร",
        (val) =>
          !specialCharsRegex.test(val) ||
          "กรุณากรอกชื่อภาษาไทย",
        (val) => !emojiRegex.test(val) || "กรุณากรอกชื่อภาษาไทย",
      ];
    },
    firstNameEhRules() {
      const specialCharsRegex = /[&*/#@! 0-9๐-๙]/g;
      const emojiRegex = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
      return [
      (val) =>
          (val || "").length > 1 ||
          "โปรดระบุชื่อ (ภาษาอังกฤษ) ความยาวอย่างน้อย 2 ตัวอักษร",
        (val) =>
          (val || "").length < 20 ||
          "โปรดระบุชื่อ (ภาษาอังกฤษ) ความยาวไม่เกิน 20 ตัวอักษร",
        (val) =>
          !specialCharsRegex.test(val) ||
          "กรุณากรอกชื่อภาษาอังกฤษ",
        (val) => !emojiRegex.test(val) || "กรุณากรอกชื่อภาษาอังกฤษ",
      ];
    },
    lastNameThRules() {
      const specialCharsRegex = /[&*/#@! 0-9๐-๙]/g;
      const emojiRegex = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
      return [
      (val) =>
          (val || "").length > 1 ||
          "โปรดระบุนามสกุล (ภาษาไทย) ความยาวอย่างน้อย 2 ตัวอักษร",
        (val) =>
          (val || "").length < 20 ||
          "โปรดระบุนามสกุล (ภาษาไทย) ความยาวไม่เกิน 20 ตัวอักษร",
        (val) =>
          !specialCharsRegex.test(val) ||
          "กรุณากรอกนามสกุลภาษาไทย",
        (val) => !emojiRegex.test(val) || "กรุณากรอกสกุลภาษาไทย",
      ];
    },
    lastNameEnRules() {
      const specialCharsRegex = /[&*/#@! 0-9๐-๙]/g;
      const emojiRegex = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
      return [
      (val) =>
          (val || "").length > 1 ||
          "โปรดระบุนามสกุล (ภาษาอังกฤษ) ความยาวอย่างน้อย 2 ตัวอักษร",
        (val) =>
          (val || "").length < 20 ||
          "โปรดระบุนามสกุล (ภาษาอังกฤษ) ความยาวไม่เกิน 20 ตัวอักษร",
        (val) =>
          !specialCharsRegex.test(val) ||
          "กรุณากรอกนามสกุลภาษาอังกฤษ",
        (val) => !emojiRegex.test(val) || "กรุณากรอกสกุลภาษาอังกฤษ",
      ];
    },
    usernameRules() {
      const specialCharsRegex = /[&*/#@! ]/g;
      const emojiRegex = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
      return [
        (val) =>
          (val || "").length > 5 ||
          "โปรดระบุชื่อผู้ใช้ความยาวไม่น้อยกว่า 6 ตัวอักษร",
        (val) =>
          (val || "").length < 20 ||
          "โปรดระบุชื่อผู้ใชความยาวไม่เกิน 20 ตัวอักษร",
        (val) =>
          !specialCharsRegex.test(val) ||
          "ชื่อผู้ใช้ต้องไม่มีอักขระพิเศษ",
        (val) => !emojiRegex.test(val) || "ชื่อผู้ใช้ต้องไม่มีอิโมจิ",
      ];
    },passwordRules() {
      const specialCharsRegex = /[ ]/g;
      return [
        (val) =>
          (val || "").length > 7 ||
          "โปรดระบุรหัสผ่านความยาวไม่น้อยกว่า 8 ตัวอักษร",
        (val) =>
          (val || "").length < 20 ||
          "โปรดระบุรหัสผ่านความยาวไม่เกิน 20 ตัวอักษร",
        (val) =>
          !specialCharsRegex.test(val) ||
          "ชื่อผู้ใช้ต้องไม่มีอักขระพิเศษ",
      ];
    },
  },
  watch: {},
};
</script>
<style>
.child-header {
  font-weight: 600;
  font-size: 22px;
}
.title {
  font-weight: 700;
  font-size: 24px;
}
.sub-title {
  font-weight: 700;
  font-size: 12px;
}
.btn-register {
  background-color: #ff6b81 !important;
}
.card-padding {
  padding: 40px 32px 40px 32px;
}
</style>
        

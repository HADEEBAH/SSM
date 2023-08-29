<template>
  <v-container>
    <v-row dense>
      <v-col cols="12" class="text-center m-auto">
        <v-img
          src="@/assets/changePassword/confirm_current_password.svg"
          class="max-w-md m-auto"
        />
      </v-col>
      <v-col cols="12" class="text-center">
        <label class="font-weight-bold"> เลือกวิธีการเปลี่ยนรหัสผ่าน </label>
      </v-col>
      <v-col cols="12" class="text-center">
        <v-radio-group
          v-model="type"
          mandatory
          row
          class="justify-center"
          @change="value = ''"
        >
          <v-radio
            label="ผ่านโทรศัพท์มือถือ (SMS)"
            value="phone"
            color="#aeaeae"
            class="align-self-center ml-auto"
          ></v-radio>
          <v-radio
            label="ผ่านอีเมล"
            value="email"
            color="#aeaeae"
            class="align-self-center mr-auto"
          ></v-radio>
        </v-radio-group>
      </v-col>
      <v-col cols="12" class="text-center w-full">
        <v-text-field
          v-model="value"
          :class="
            MobileSize
              ? 'w-[100%!important] m-[auto!important]'
              : 'w-[50%!important] m-[auto!important]'
          "
          :label="type === 'email' ? 'ระบุอีเมล' : 'ระบุเบอร์โทรศัพท์'"
          @input="type === 'email' ? '' : checkPhoneNumber()"
          :maxlength="type === 'email' ? 100 : 12"
          @keypress="type === 'email' ? '' : Validation($event, 'number')"
          solo
          @paste="preventPaste"
          @copy="preventCopy"
        >
        </v-text-field>
      </v-col>
      <v-col cols="12" class="text-center w-full">
        <v-text-field
          v-model="username"
          :class="
            MobileSize
              ? 'w-[100%!important] m-[auto!important]'
              : 'w-[50%!important] m-[auto!important]'
          "
          label="ระบุชื่อผู้ใช้ (username)"
          solo
          @keypress="Validation($event, 'en-number')"
          @paste="preventPaste"
          @copy="preventCopy"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row dense class="text-center">
      <v-col cols="12">
        <v-btn
          :disabled="loading"
          :loading="loading"
          @click="sendTypeChangePassword()"
          :class="
            MobileSize
              ? 'w-[100%!important] text-[#FF6B81!important] font-bold'
              : 'w-[50%!important] text-[#FF6B81!important] font-bold'
          "
          color="#F0F2F5"
          >ยืนยัน</v-btn
        >
      </v-col>
    </v-row>
    <v-btn
      @click="backToHome()"
      text
      dark
      :class="
        MobileSize
          ? 'absolute top-[1%] right-[2%]'
          : 'absolute top-[1%] right-[1%]'
      "
      color="#FF6B81"
    >
      <v-icon class="mr-2">mdi mdi-home</v-icon> กลับหน้าหลัก
    </v-btn>
  </v-container>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import router from "@/router";
import Swal from "sweetalert2";
import { inputValidation } from "@/functions/functions";

export default {
  data: () => ({
    type: "",
    value: "",
    username: "",
    loading: false,
  }),
  methods: {
    ...mapActions({
      SendTypeForgotPassword: "ResetPasswordModules/SendTypeForgotPassword",
    }),

    backToHome() {
      router.push({ name: "UserKingdom" });
    },

    async sendTypeChangePassword() {
      this.loading = true;
      if (this.type !== "") {
        await this.SendTypeForgotPassword({
          type: this.type,
          value:
            this.type === "phone" ? this.value.replaceAll("-", "") : this.value,
          username: this.username,
        });
        if (this.responseTypeForgotPassword) {
          this.loading = false;

          router.push({ name: "ResetPassword" });
        } else {
          this.loading = false;
          let error_message = "";
          if (this.type === "phone") {
            if (
              this.responseTypeForgotPasswordMessage ===
              "Parameter missing. Required username parameter."
            ) {
              error_message = "กรุณากรอก ชื่อผู้ใช้ (username)";
            } else if (
              this.responseTypeForgotPasswordMessage ===
              "Parameter missing. Required tel_no parameter."
            ) {
              error_message = "กรุณากรอก เบอร์โทรศัพท์";
            } else if (
              this.responseTypeForgotPasswordMessage ===
              "username and Tel not found"
            ) {
              error_message = "ชื่อผู้ใช้หรือเบอร์โทรศัพท์ไม่ถูกต้อง";
            } else {
              error_message = "เกิดข้อผิดพลาด";
            }
          } else {
            if (
              this.responseTypeForgotPasswordMessage ===
              "Parameter missing. Required username parameter."
            ) {
              error_message = "กรุณากรอก ชื่อผู้ใช้ (username)";
            } else if (
              this.responseTypeForgotPasswordMessage ===
              "Parameter missing. Required email parameter."
            ) {
              error_message = "กรุณากรอก เบอร์โทรศัพท์";
            } else if (
              this.responseTypeForgotPasswordMessage ===
              "username and email not found."
            ) {
              error_message = "ชื่อผู้ใช้หรืออีเมลไม่ถูกต้อง";
            } else {
              error_message = "เกิดข้อผิดพลาด";
            }
          }
          Swal.fire({
            icon: error_message === "เกิดข้อผิดพลาด" ? "error" : "warning",
            title: "คำเตือน",
            text: `${error_message}`,
          });
        }
      }
    },
    checkPhoneNumber() {
      let x = this.value.replace(/\D/g, "");
      x = x.match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
      this.value = !x[2] ? x[1] : x[1] + "-" + x[2] + (x[3] ? "-" + x[3] : "");
    },

    Validation(e, lang) {
      inputValidation(e, lang);
    },

    preventPaste(event) {
      event.preventDefault();
    },
    preventCopy(event) {
      event.preventDefault();
    },
  },
  computed: {
    ...mapGetters({
      responseTypeForgotPassword:
        "ResetPasswordModules/responseTypeForgotPassword",
      responseTypeForgotPasswordMessage:
        "ResetPasswordModules/responseTypeForgotPasswordMessage",
    }),

    MobileSize() {
      const { xs } = this.$vuetify.breakpoint;
      return !!xs;
    },
  },
};
</script>
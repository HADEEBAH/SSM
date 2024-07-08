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
        <label class="font-weight-bold">
          {{ $t("choose a method to change your password") }}</label
        >
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
            :label="$t('via mobile phone (SMS)')"
            value="phone"
            color="#FF6B81"
            class="align-self-center ml-auto"
          ></v-radio>
          <v-radio
            :label="$t('via email')"
            value="email"
            color="#FF6B81"
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
          :label="
            type === 'email' ? $t('specify email') : $t('specify phone number')
          "
          @input="type === 'email' ? '' : checkPhoneNumber()"
          :maxlength="type === 'email' ? 100 : 12"
          @keydown="
            type === 'email'
              ? Validation($event, 'email')
              : Validation($event, 'number')
          "
          color="#FF6B81"
          solo
          @paste="preventPaste"
          @copy="preventCopy"
          :rules="type === 'email' ? rules.email : rules.phone_number"
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
          :label="$t('specify username')"
          color="#FF6B81"
          solo
          @keydown="Validation($event, 'en-number')"
          @paste="preventPaste"
          @copy="preventCopy"
          :rules="rules.usernameRules"
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
          >{{ $t("confirm") }}</v-btn
        >
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import router from "@/router";
import Swal from "sweetalert2";
import { inputValidation } from "@/functions/functions";
import VueCookie from "vue-cookie";

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
          if (this.type === "phone") {
            router.push({ name: "ResetPassword" });
          } else {
            Swal.fire({
              icon: "success",
              title: this.$t("succeed"),
              text: `${this.$t("sent a password change link to")} ${
                this.value
              }`,
              timer: 3000,
              timerProgressBar: true,
              showCancelButton: false,
              showConfirmButton: false,
            });
            if (VueCookie.get("token")) {
              router.push({ name: "UserKingdom" });
            } else {
              router.push({ name: "Login" });
            }
          }
        } else {
          this.loading = false;
          let error_message = "";
          if (this.type === "phone") {
            if (
              this.responseTypeForgotPasswordMessage ===
              "Parameter missing. Required username parameter."
            ) {
              error_message = this.$t("please enter your username");
            } else if (
              this.responseTypeForgotPasswordMessage ===
              "Parameter missing. Required tel_no parameter."
            ) {
              error_message = this.$t("please enter your phone number");
            } else if (
              this.responseTypeForgotPasswordMessage ===
              "username and Tel not found"
            ) {
              error_message = this.$t("invalid username or phone number");
            } else {
              error_message = this.$t("something went wrong");
            }
          } else {
            if (
              this.responseTypeForgotPasswordMessage ===
              "Parameter missing. Required username parameter."
            ) {
              error_message = this.$t("please enter your username");
            } else if (
              this.responseTypeForgotPasswordMessage ===
              "Parameter missing. Required email parameter."
            ) {
              error_message = this.$t("please enter your email");
            } else if (
              this.responseTypeForgotPasswordMessage ===
              "username and email not found."
            ) {
              error_message = this.$t("invalid username or email");
            } else {
              error_message = this.$t("something went wrong");
            }
          }
          Swal.fire({
            icon:
              error_message === this.$t("something went wrong")
                ? "error"
                : "warning",
            title: this.$t("warning"),
            text: `${error_message}`,
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        }
      }
    },
    checkPhoneNumber() {
      let x = this.value.replace(/\D/g, "");
      x = x.match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
      this.value = !x[2] ? x[1] : x[1] + "-" + x[2] + (x[3] ? "-" + x[3] : "");
    },

    Validation(e, type) {
      inputValidation(e, type);
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

    rules() {
      return {
        email: [
          (value) => {
            const pattern =
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return pattern.test(value) || this.$t("invalid email");
          },
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
        phone_number: [
          (val) =>
            ((val || "").length > 0 && val.length === 12) ||
            this.$t("please enter a 10-digit phone number"),
        ],
      };
    },
  },
};
</script>
<template>
  <v-container class="p-0">
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-card
        :flat="crad_flat"
        :width="$vuetify.breakpoint.smAndUp ? '60vw' : ''"
      >
        <v-container>
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
                <label>{{ $t("first name(thai)") }}</label>
                <!-- @keydown="Validation($event, 'th-special')" -->
                <v-text-field
                  dense
                  ref="firstname_th"
                  :rules="firstNameThRules"
                  required
                  v-model="user_one_id.firstname_th"
                  :placeholder="$t('specify first name(Thai)')"
                  @change="changeUserOneId(user_one_id)"
                  outlined
                  color="#FF6B81"
                  :error-messages="
                    getErrorMessage(user_one_id.firstname_th, 'thai')
                  "
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <label>{{ $t("last name(thai)") }}</label>
                <!-- @keydown="Validation($event, 'th-special')" -->
                <v-text-field
                  dense
                  ref="lastname_th"
                  :rules="lastNameThRules"
                  required
                  v-model="user_one_id.lastname_th"
                  :placeholder="$t('specify last name(Thai)')"
                  @change="changeUserOneId(user_one_id)"
                  outlined
                  color="#FF6B81"
                  :error-messages="
                    getErrorMessage(user_one_id.lastname_th, 'thai')
                  "
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row dense>
              <v-col cols="12" sm="6">
                <label>{{ $t("first name(english)") }}</label>
                <!-- @keydown="Validation($event, 'en-special')" -->

                <v-text-field
                  dense
                  ref="firstname_en"
                  :rules="firstNameEnRules"
                  required
                  v-model="user_one_id.firstname_en"
                  :placeholder="$t('specify first name(english)')"
                  @change="changeUserOneId(user_one_id)"
                  outlined
                  color="#FF6B81"
                  :error-messages="
                    getErrorMessage(user_one_id.firstname_en, 'english')
                  "
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <label>{{ $t("last name(english)") }}</label>
                <!-- @keydown="Validation($event, 'en-special')" -->
                <v-text-field
                  dense
                  ref="lastname_en"
                  :rules="lastNameEnRules"
                  required
                  v-model="user_one_id.lastname_en"
                  :placeholder="$t('specify last name(english)')"
                  @change="changeUserOneId(user_one_id)"
                  outlined
                  color="#FF6B81"
                  :error-messages="
                    getErrorMessage(user_one_id.lastname_en, 'english')
                  "
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row dense>
              <v-col>
                <label>{{ $t("phone number") }}</label>
                <!-- @keydown="Validation($event, 'number')" -->
                <!-- :error-messages="
                    getErrorMessage(user_one_id.phone_number, 'number')
                  " -->
                <v-text-field
                  dense
                  ref="phone_number"
                  maxlength="12"
                  :rules="phone_number"
                  required
                  v-model="user_one_id.phone_number"
                  @input="checkPhoneNumber"
                  :placeholder="$t('specify phone number')"
                  @change="changeUserOneId(user_one_id)"
                  outlined
                  color="#FF6B81"
                  @keydown="Validation($event, 'number')"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row dense>
              <v-col>
                <!-- @keydown="Validation($event, 'en-number')" -->

                <label>{{ $t("username") }}</label>
                <v-text-field
                  autocomplete="off-autofill"
                  dense
                  ref="username_rig"
                  :rules="usernameRules"
                  required
                  v-model="user_one_id.username"
                  :placeholder="$t('specify username')"
                  @change="changeUserOneId(user_one_id)"
                  outlined
                  color="#FF6B81"
                  :error-messages="
                    getErrorMessage(user_one_id.username, 'userNameText')
                  "
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row dense>
              <v-col>
                <label>{{ $t("password") }}</label>
                <!-- @keydown="Validation($event, 'en')" -->

                <v-text-field
                  dense
                  autocomplete="off-autofill"
                  ref="password_rig"
                  :type="show_password ? 'text' : 'password'"
                  :rules="passwordRules"
                  required
                  v-model="user_one_id.password"
                  :append-icon="
                    show_password ? 'mdi-eye-outline' : 'mdi-eye-off-outline'
                  "
                  @click:append="show_password = !show_password"
                  :placeholder="$t('specify password')"
                  @change="changeUserOneId(user_one_id)"
                  outlined
                  color="#FF6B81"
                  :error-messages="
                    getErrorMessage(user_one_id.password, 'english')
                  "
                >
                </v-text-field>
              </v-col>
            </v-row>
            <v-row dense>
              <v-col>
                <label>{{ $t("confirm password") }}</label>
                <!-- @keydown="Validation($event, 'en')" -->

                <v-text-field
                  dense
                  ref="confirm_password"
                  :type="show_confirm_password ? 'text' : 'password'"
                  :rules="[confirm_password, confirmPasswordRule]"
                  required
                  v-model="user_one_id.confirm_password"
                  :placeholder="$t('confirm password')"
                  :append-icon="
                    show_confirm_password
                      ? 'mdi-eye-outline'
                      : 'mdi-eye-off-outline'
                  "
                  @click:append="show_confirm_password = !show_confirm_password"
                  @change="changeUserOneId(user_one_id)"
                  outlined
                  color="#FF6B81"
                  :error-messages="
                    getErrorMessage(user_one_id.confirm_password, 'english')
                  "
                >
                </v-text-field>
              </v-col>
            </v-row>
            <v-row dense class="d-flex align-center">
              <v-col cols="auto">
                <v-checkbox
                  class="inline-block"
                  v-model="user_one_id.accept_terms"
                  @change="changeUserOneId(user_one_id)"
                  color="pink lighten-1"
                  :rules="[confirm_checkbox]"
                >
                  <template v-slot:label>
                    <label>
                      {{
                        $t(
                          "by opening an account, you acknowledge and agree to"
                        )
                      }}
                      <a
                        @click="policy_show = true"
                        class="cursor-pointer underline text-[#FF6B81]"
                        >{{ $t("terms of service and privacy policy") }}</a
                      >
                    </label>
                  </template>
                </v-checkbox>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-row dense>
              <!-- :class="
                    $vuetify.breakpoint.mdAndUp
                      ? 'btn-register'
                      : 'w-full btn-register'
                  " -->
              <v-col class="text-center">
                <v-btn
                  :loading="is_loading"
                  :disabled="!valid"
                  depressed
                  class="white--text"
                  :color="!valid ? '' : '#ff6b81'"
                  :class="
                    $vuetify.breakpoint.smAndUp ? 'btn-size-lg' : 'w-full'
                  "
                  @click="save"
                  >{{ $t("register") }}</v-btn
                >
              </v-col>
            </v-row>
          </v-card-actions>
        </v-container>
      </v-card>
    </v-form>

    <v-dialog
      v-model="policy_show"
      v-if="policy_show"
      persistent
      :width="$vuetify.breakpoint.smAndUp ? `60vw` : ''"
    >
      <v-card flat class="pa-2">
        <v-row dense>
          <v-col class="pa-2" align="right">
            <v-btn icon @click="policy_show = false">
              <v-icon color="red"> mdi-close </v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-card-text>
          <v-row dense>
            <v-col cols="12">
              <TermOfUse />
            </v-col>
          </v-row>
          <v-row dense>
            <v-col>
              <v-checkbox
                hide-details
                color="pink"
                v-model="user_one_id.accept_terms"
              >
                <template v-slot:label>
                  <label>
                    {{ $t("accept") }}
                    <a class="cursor-pointer underline text-[#FF6B81]">{{
                      $t("terms of service and privacy policy")
                    }}</a>
                  </label>
                </template>
              </v-checkbox>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-row dense>
            <v-col align="right">
              <v-btn
                outlined
                color="#ff6b81"
                text-color="#ff6b81"
                @click="
                  (policy_show = false), (user_one_id.accept_terms = false)
                "
              >
                {{ $t("cencel") }}
              </v-btn>
            </v-col>
            <v-col>
              <v-btn
                depressed
                dark
                color="#ff6b81"
                @click="policy_show = false"
              >
                {{ $t("agree") }}
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import { inputValidation } from "@/functions/functions";
import TermOfUse from "@/components/termOfUse.vue";
export default {
  components: {
    TermOfUse,
  },
  name: "registerDialogForm",
  props: {
    title: { type: String },
    dialog: { type: Boolean, default: false },
    crad_flat: { type: Boolean, default: false },
    state: { type: String },
  },
  data: () => ({
    policy_show: false,
    policy: false,
    valid: false,
    show_password: false,
    show_confirm_password: false,
    rules: {
      match: (password) => (value) =>
        value === password || "passwords do not match",
    },
  }),
  created() {},
  mounted() {
    this.valid = false;
  },
  methods: {
    ...mapActions({
      changeDialogRegisterOneId: "RegisterModules/changeDialogRegisterOneId",
      changeUserOneId: "RegisterModules/changeUserOneId",
      registerUserOneId: "RegisterModules/registerUserOneId",
      registerParent: "RegisterModules/registerParent",
    }),
    getErrorMessage(text, language) {
      const thaiPattern =
        /^[\u0E00-\u0E7F\d\s!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]+$/;
      const englishPattern =
        /^[a-zA-Z\d\s!''"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]+$/;
      // const numberPattern = /^[/(\d{0,3})(\d{0,3})(\d{0,4})/]+$/;
      const userNamePattern = /^[a-zA-Z\d0-9\s!]+$/;
      if (this.user_one_id.accept_terms === true) {
        this.valid = true;
      }
      if (text === "") {
        return [];
      }
      // Return an error message if the pattern is not matched
      // else if (language === "number" && !numberPattern.test(text)) {
      //   return [this.$t("555")];
      // }
      if (language === "thai" && !thaiPattern.test(text)) {
        return [this.$t("invalid Thai languages")];
      } else if (language === "english" && !englishPattern.test(text)) {
        return [this.$t("invalid English languages")];
      } else if (language === "userNameText" && !userNamePattern.test(text)) {
        return [this.$t("invalid user name")];
      } else {
        return [];
      }
    },

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
          this.registerParent({ type: this.state });
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
    confirm_password() {
      return (val) =>
        (val && val.length > 7) ||
        this.$t(
          "please enter a confirmation password that is at least 8 characters long"
        );
    },
    confirm_checkbox() {
      return (val) =>
        (val && val === true) || this.$t("please enter a checkbox");
    },
    confirmPasswordRule() {
      return (v) =>
        v === this.user_one_id.password || this.$t("passwords do not match");
    },
    phone_number() {
      return [
        (val) =>
          ((val || "").length > 0 && val[0] === "0") ||
          this.$t("please enter a phone number starting with 0"),
        (val) =>
          ((val || "").length > 0 && val.length === 12) ||
          this.$t("please enter a 10-digit phone number"),
      ];
    },
    usernameRules() {
      return [
        (val) =>
          (val || "").length > 5 ||
          this.$t("please enter a username at least 6 characters long"),
        (val) =>
          (val || "").length < 30 ||
          this.$t("please enter a username no longer than 30 characters"),
        (val) =>
          val.split(" ").length <= 1 ||
          this.$t("the username cannot contain special characters"),
        (val) =>
          /[A-Za-z0-9]/.test(val) ||
          this.$t("the username cannot contain special characters"),
        (val) =>
          !/[\uD800-\uDBFF\d][\uDC00-\uDFFF]/g.test(val) ||
          this.$t("username cannot contain emojis"),
      ];
    },
    firstNameThRules() {
      return [
        (val) =>
          (val || "").length > 1 ||
          this.$t(
            "please enter your name (thai) with a length of at least 2 characters"
          ),
        (val) =>
          (val || "").length < 20 ||
          this.$t(
            "please enter your name (thai) length not exceeding 20 characters"
          ),
        // (val) =>
        //   /[ก-๏\s]/g.test(val) || this.$t("please enter your name in thai"),
        // (val) =>
        //   val.split(" ").length <= 1 ||
        //   this.$t("please enter your name in thai"),
        (val) =>
          !/[\uD800-\uDBFF\d\s!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~][\uDC00-\uDFFF]/g.test(
            val
          ) || this.$t("please enter your name in thai"),
      ];
    },
    firstNameEnRules() {
      return [
        (val) =>
          (val || "").length > 1 ||
          this.$t(
            "please enter your name (english), at least 2 characters long"
          ),
        (val) =>
          (val || "").length < 20 ||
          this.$t(
            "please enter your name (english) length not exceeding 20 characters"
          ),
        (val) =>
          /[A-Za-z]/g.test(val) || this.$t("please enter your name in english"),
        // (val) =>
        //   val.split(" ").length <= 1 ||
        //   this.$t("please enter your name in english"),
        (val) =>
          !/[\uD800-\uDBFF\d\s!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~][\uDC00-\uDFFF]/g.test(
            val
          ) || this.$t("please enter your name in english"),
      ];
    },
    lastNameThRules() {
      return [
        (val) =>
          (val || "").length > 1 ||
          this.$t(
            "please enter your last name (Thai), at least 2 characters long"
          ),
        (val) =>
          (val || "").length < 20 ||
          this.$t(
            "please enter your last name (Thai) not more than 20 characters"
          ),
        // (val) =>
        //   val.split(" ").length <= 1 ||
        //   this.$t("please enter your last name in thai"),
        // (val) =>
        //   /[ก-๏\s]/g.test(val) ||
        //   this.$t("please enter your last name in thai"),
        (val) =>
          !/[\uD800-\uDBFF\d\s!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~][\uDC00-\uDFFF]/g.test(
            val
          ) || this.$t("please enter your last name in thai"),
      ];
    },
    lastNameEnRules() {
      return [
        (val) =>
          (val || "").length > 1 ||
          this.$t(
            "please enter your last name (English), at least 2 characters long"
          ),
        (val) =>
          (val || "").length < 20 ||
          this.$t(
            "please enter your last name (English). length not exceeding 20 characters"
          ),
        // (val) =>
        //   val.split(" ").length <= 1 ||
        //   this.$t("please enter your last name in english"),
        (val) =>
          /[A-Za-z ]/g.test(val) ||
          this.$t("please enter your last name in english"),
        (val) =>
          !/[\uD800-\uDBFF\d\s!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~][\uDC00-\uDFFF ]/g.test(
            val
          ) || this.$t("please enter your last name in english"),
      ];
    },
    passwordRules() {
      return [
        (val) =>
          (val || "").length > 7 || `${this.$t("please enter a password that is at least 8 characters long")}`,
        (v) => /^(?=.*[0-9])(?=.*[a-zA-Z])([A-Za-z\d@$!%*?&]+)$/.test(v) || 
        // (v) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/.test(v) || 
          this.$t('password must consist of at least one English alphabet. Using special characters'),
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

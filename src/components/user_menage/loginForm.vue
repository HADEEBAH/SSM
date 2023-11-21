<!-- snacbar สำหรับ popup -->
<template>
  <div :style="MobileSize ? 'width: 90%; ' : 'width: 50%;'">
    <v-form ref="form" v-model="valid">
      <v-card
        :class="
          MobileSize
            ? 'bg-white rounded-xl my-20 drop-shadow-lg '
            : 'bg-white rounded-xl my-20 drop-shadow-lg '
        "
      >
        <v-card-text>
          <div class="w-full" align="center" v-if="image">
            <v-img
              src="@/assets/navbar/logo.svg"
              style="width: 50%; height: 50%"
            ></v-img>
          </div>
          <v-row v-else>
            <v-col class="text-2xl text-center text-bold text-black">
              {{ $t("login") }}
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12" class="pa-0 text-bold text-black">
              <label>{{ $t("username/oneid") }}</label>
              <!-- 
              @keydown="validate($event, 'en-number')" -->
              <!--  -->

              <v-text-field
                dense
                v-model="user_one_id.username"
                :placeholder="$t('enter username')"
                outlined
                :rules="usernameRules"
                color="#ff6b81"
                :error-messages="
                  getErrorMessage(user_one_id.username, 'userNameText')
                "
              ></v-text-field>
            </v-col>
            <v-col cols="12" class="pa-0 text-bold text-black">
              <label>{{ $t("password") }}</label>
              <!-- @keydown="validate($event, 'en')" -->
              <!--  -->

              <v-text-field
                dense
                autocomplete="off-autofill"
                ref="password"
                :type="show_password ? 'text' : 'password'"
                :append-icon="
                  show_password ? 'mdi-eye-outline' : 'mdi-eye-off-outline'
                "
                v-model="user_one_id.password"
                :placeholder="$t('enter password')"
                @click:append="show_password = !show_password"
                outlined
                @keyup.enter="login()"
                color="#ff6b81"
                :rules="passwordRules"
                :error-messages="
                  getErrorMessage(user_one_id.password, 'passwordText')
                "
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-btn
                :disabled="!valid"
                width="100%"
                depressed
                :dark="valid"
                :loading="is_loading"
                :color="!valid ? '' : '#ff6b81'"
                @click="login()"
              >
                {{ $t("login") }}
              </v-btn>
            </v-col>
            <v-col cols="12">
              <v-btn
                outlined
                :disabled="is_loading"
                color="#ff6b81"
                width="100%"
                @click="toRegisterPage()"
              >
                {{ $t("register for an account") }}
              </v-btn>
            </v-col>
          </v-row>
          <div
            class="text-center mt-2 text_bottom cursor-pointer"
            v-if="bottomtext"
            @click="forgot_password()"
          >
            {{ $t("forgotten your password?") }}
          </div>
          <div v-else class="text-center mt-2">
            {{ $t("don't have an account yet?") }}
            <span class="text_bottom">{{ $t("register") }}</span>
          </div>
        </v-card-text>
      </v-card>
    </v-form>
  </div>
</template>

<script>
import { inputValidation } from "@/functions/functions";
import { mapActions, mapGetters } from "vuex";
export default {
  props: {
    image: { type: Boolean, default: false },
    bottomtext: { type: String, default: "ลืมรหัสผ่านใช่หรือไม่ ?" },
  },
  data: () => ({
    show_password: false,
    logo: `${process.env.VUE_APP_URL}/logo.svg`,
    valid: false,
  }),
  mounted() {
    this.valid = false;
  },
  beforeMount() {
    if (this.$route.query.token) {
      this.loginShareToken(this.$route);
    }
  },
  computed: {
    ...mapGetters({
      user_one_id: "loginModules/getUserOneId",
      is_loading: "loginModules/getIsLoading",
    }),

    // isButtonDisabled() {
    //   // Disable the button if either input has an error

    //   return (
    //     this.getErrorMessage(this.user_one_id.username, "userNameText").length >
    //       0 ||
    //     this.getErrorMessage(this.user_one_id.password, "passwordText").length >
    //       0
    //   );
    // },
    usernameRules() {
      return [
        (val) =>
          (val || "").length > 5 ||
          this.$t("please enter a username at least 6 characters long"),
        (val) =>
          (val || "").length < 30 ||
          this.$t("please enter a username no longer than 30 characters"),
        (val) =>
          /[A-Za-z0-9 ]/g.test(val) ||
          this.$t("the username cannot contain special characters"),
        (val) =>
          !/[\uD800-\uDBFF][\uDC00-\uDFFF]/g.test(val) ||
          this.$t("username cannot contain emojis"),
      ];
    },
    passwordRules() {
      return [
        (val) =>
          (val || "").length > 7 ||
          this.$t("please enter a password that is at least 8 characters long"),
      ];
    },
    MobileSize() {
      const { xs } = this.$vuetify.breakpoint;
      return !!xs;
    },
    IpadSize() {
      const { sm } = this.$vuetify.breakpoint;
      return !!sm;
    },
  },

  methods: {
    ...mapActions({
      loginOneId: "loginModules/loginOneId",
      loginShareToken: "loginModules/loginShareToken",
    }),

    getErrorMessage(text, language) {
      // Check the pattern based on the language
      const userNamePattern = /^[a-zA-Z\d0-9\s!]+$/;
      const passwordPattern = /^[a-zA-Z\d\s!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]+$/;
      // if (text.length == 0) {
      //   return [];
      // }
      // Return an error message if the pattern is not matched
      if (text === "") {
        return [];
      }
      if (language === "userNameText" && !userNamePattern.test(text)) {
        return [this.$t("invalid user name")];
      } else if (language === "passwordText" && !passwordPattern.test(text)) {
        return [this.$t("invalid user password")];
      } else {
        return [];
      }
    },

    login() {
      if (this.$refs.form.validate()) {
        this.loginOneId();
      }
    },
    toRegisterPage() {
      this.$router.replace({ name: "Register" });
    },
    validate(e, type) {
      inputValidation(e, type);
    },

    forgot_password() {
      this.$router.push({ name: "ForgotPassword" });
    },
  },

  beforeDestroy() {
    this.$store.commit("loginModules/SetIsLoading", false);
  },
};
</script>

<style scoped>
.text_bottom {
  color: #ff6b81;
}
</style>

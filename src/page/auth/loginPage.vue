<!-- <template>
  <v-app>
    <v-container>
      <v-layout
        class="flex align-center justify-center my-6 "
        style="width: 100%; height: 100%"
      >
        <v-card :class="$vuetify.breakpoint.mdAndUp ? 'card-padding' : 'py-5'">
          <div class="ml-24 mt-5 mr-3">
            <v-img v-if="$vuetify.breakpoint.smAndUp" class="img-header-login" src="@/assets/login/login.png" />
          </div>
          <v-card-text> 
            <v-row dense>
              <v-col>
                <h2 class="title-login">ชื่อผู้ใช้งาน/OneID</h2>
                <v-text-field
                  class="login-form"
                  dense
                  ref="username"
                  :rules="rules.username"
                  required
                  v-model="username"
                  placeholder="ระบุชื่อผู้ใช้งาน"
                  outlined
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row dense>
              <v-col>
                <h2 class="title-login">รหัสผ่าน</h2>
                <v-text-field
                  class="login-form"
                  dense
                  ref="password"
                  :type="show_password ? 'text' : 'password'"
                  :rules="rules.password"
                  required
                  v-model="password"
                  :append-icon="
                    show_password ? 'mdi-eye-outline' : 'mdi-eye-off-outline'
                  "
                  @click:append="show_password = !show_password"
                  placeholder="ระบุรหัสผ่าน"
                  outlined
                >
                </v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-row dense>
              <v-col class="text-center">
                <v-btn
                  depressed
                  class="white--text btn-login"
                  :class="
                    $vuetify.breakpoint.mdAndUp
                      ? 'btn-login'
                      : 'w-full btn-login'
                  "
                  @click="login"
                  >เข้าสู่ระบบ</v-btn
                >
              </v-col>
            </v-row>
          </v-card-actions>
          <v-card-actions>
            <v-row dense>
              <v-col class="text-center">
                <v-btn
                  class="btn-register1"
                  outlined
                  color="#ff6b81"
                  width="300px"
                  :class="
                    $vuetify.breakpoint.mdAndUp
                      ? 'btn-register1'
                      : 'w-full btn-register1'
                  "
                  @click="save"
                  >ลงทะเบียน</v-btn
                >
              </v-col>
            </v-row>
          </v-card-actions>
          <h4 to="/" class="text-center forgotpassword mt-3">
            ลืมรหัสผ่านใช่หรือไม่ ?
          </h4>
        </v-card>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
export default {
  name: "loginPage",
  props: {
    dialog: { type: Boolean, default: false },
  },
  data: () => ({
    show_password: false,
    rules: {
      username: [(val) => (val || "").length > 0 || "โปรดระบุชื่อผู้ใช้"],
      password: [(val) => (val || "").length > 0 || "โปรดระบุรหัสผ่าน"],
    },
  }),
  created() {},
  mounted() {},
  methods: {},
  computed: {},
  watch: {},
};
</script>

<style scoped>
.v-text-field.login-form {
  width: 300px;
}
.title-login {
  font-weight: bold;
}
.btn-login {
  background-color: #ff6b81 !important;
  width: 300px;
  border-radius: 5px;
}
/* .btn-register {
  background-color: #ff6b81 !important;
  width: 100%;
} */
.card-padding {
  padding: 40px 40px 40px 40px;
}

.forgotpassword {
  cursor: pointer;
  color: #ff6b81;
  font-weight: 500;
  font-size: 12px;
}
.img-header-login{
     
    max-height: 156px;
    max-width: 156px;
  }
#app {
  background: url('@/assets/login/login-bg.jpg')
    no-repeat center center !important;
  background-size: cover; 
  
}
</style> -->

<template>
  <v-app>
    <v-container>
      <div
        class="d-flex align-center justify-center"
        style="width: 100%; height: 100%"
      >
        <v-card
          :class="
            MobileSize
              ? 'bg-white rounded-xl my-15 '
    : 'bg-white rounded-xl my-32 '
              
          "
        >  
        <v-card-text >
<div class="w-full" align="center"> <v-img
            src="../../assets/login/login.jpg"
            style="width: 50%; height: 50% ; "
          ></v-img></div>
         
        
            <v-row dense>
              <v-col cols="12" class="pa-0">
                <label>ชื่อผู้ใช้งาน / OneID</label>
                <v-text-field
                  @keypress="validate($event,'en')"
                  dense
                  ref="username"
                  :rules="rules.username"
                  required
                  v-model="user_one_id.username"
                  placeholder="ระบุชื่อผู้ใช้งาน"
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="12" class="pa-0">
                <label>รหัสผ่าน</label>
                <v-text-field
                  @keypress="validate($event,'en')"
                  dense
                  ref="password"
                  :type="show_password ? 'text' : 'password'"
                  :rules="rules.password"
                  required
                  :append-icon="
                    show_password ? 'mdi-eye-outline' : 'mdi-eye-off-outline'
                  "
                  v-model="user_one_id.password"
                  placeholder="ระบุรหัสผ่าน"
                  @click:append="show_password = !show_password"
                  outlined
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-btn
                width="100%"
                  depressed
                  dark
                  color="#ff6b81"
                  @click="loginOneId(user_one_id)"
                >
                เข้าสู่ระบบ
                </v-btn>
              </v-col>
              <v-col cols="12">
                <v-btn outlined color="#ff6b81" width="100%" @click="toRegisterPage()"> ลงทะเบียน </v-btn>
              </v-col>
            </v-row>
            <div  class="text-center mt-2" color="#ff6b81">ลืมรหัสผ่านใช่หรือไม่ ?</div>
          </v-card-text>
        </v-card>
      </div>
    </v-container>
  </v-app>
</template>

<script>
import router from '@/router';
import {inputValidation} from '@/functions/functions';

import { mapActions, mapGetters } from "vuex";
export default {
  data: () => ({
    show_password: false,
    rules: {
      username: [(val) => (val || "").length > 0 || "โปรดระบุชื่อผู้ใช้"],
      password: [(val) => (val || "").length > 0 || "โปรดระบุรหัสผ่าน"],
    },
  }),

  computed: {
    ...mapGetters({
      user_one_id: "loginModules/getUserOneId",
    }),
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
    }),

    toRegisterPage() {
      router.push({ name: 'Register' })
    },

    validate(e, type) {
      inputValidation(e, type)
    }
  },
};
</script>

<style scoped>
#app {
  background: url("@/assets/login/login-bg.jpg") no-repeat !important;
  background-size: cover;
}
</style>
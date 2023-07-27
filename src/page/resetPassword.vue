<template>
  <v-container>
    <v-row dense>
      <v-col cols="12" class="text-center m-auto my-5">
        <v-img src="@/assets/changePassword/reset_password.svg" class="max-w-sm m-auto"/>
      </v-col>
      <v-col cols="12" class="text-center">
        <label class="font-weight-bold">
          ยืนยันรหัสผ่านใหม่
        </label>
      </v-col>
      
      <v-col cols="12" class="text-center w-full">
        <v-text-field
          v-model="password"
          :append-icon="show_password ? 'mdi-eye' : 'mdi-eye-off'"
          :class="MobileSize ? 'w-[100%!important] m-[auto!important]' : 'w-[50%!important] m-[auto!important]'"
          label="รหัสผ่านใหม่"
          :type="show_password ? 'text' : 'password'"
          @click:append="show_password = !show_password"
          color="#FF6B81"
          solo
          :rules="rules.password"
        ></v-text-field>
      </v-col>
      <v-col cols="12" class="text-center w-full">
        <v-text-field
          v-model="confirm_password"
          :append-icon="show_confirm_password ? 'mdi-eye' : 'mdi-eye-off'"
          :class="MobileSize ? 'w-[100%!important] m-[auto!important]' : 'w-[50%!important] m-[auto!important]'"
          label="ยืนยันรหัาผ่านใหม่"
          :type="show_confirm_password ? 'text' : 'password'"
          @click:append="show_confirm_password = !show_confirm_password"
          color="#FF6B81"
          solo
          :rules="rules.password"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row dense class="text-center" >
      <v-col cols="12" >
        <v-btn
        :disabled="loading"
        :loading="loading"
        @click="sendResetPassword()"
        :class="MobileSize ? 'w-[100%!important] text-[#FF6B81!important] font-bold' : 'w-[50%!important] text-[#FF6B81!important] font-bold'"
        color="#F0F2F5">ยืนยัน</v-btn>
      </v-col>
    </v-row>

    <v-dialog 
      v-model="otp_dialog" 
      persistent
      :width="$vuetify.breakpoint.smAndUp ? `60vw` : ''"
    >
      <v-card flat >
        <v-container>
          <v-row dense>
            <v-col class="pa-2" align="right">
              <v-btn
                icon
                @click="otp_dialog = false"
              >  
                <v-icon color="red">
                  mdi-close
                </v-icon>
              </v-btn>
            </v-col>
          </v-row>

          <v-row dense>
            <v-col cols="12" class="text-center">
              <label class="font-weight-bold">
                ยืนยัน OTP
              </label>
            </v-col>
          </v-row>

          <v-card-text>
            <v-row dense>
              <v-col cols="12" class="text-center">
                <v-otp-input
                  v-model="otp"
                  :class="MobileSize ? 'w-[100%!important] m-[auto!important]' : 'w-[50%!important] m-[auto!important]'"
                  length="6"
                ></v-otp-input>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-row dense>
              <v-col align="right">
                <v-btn outlined color="#ff6b81" text-color="#ff6b81" @click="otp_dialog = false">
                  ยกเลิก
                </v-btn>
              </v-col>
              <v-col>
                <v-btn depressed dark color="#ff6b81" @click="confirmOtp()">
                  ตกลง
                </v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-container>
      </v-card>
    </v-dialog>
    <v-btn @click="backToHome()" text dark :class="MobileSize ? 'absolute top-[1%] right-[2%]' : 'absolute top-[1%] right-[1%]' " color="#FF6B81">
      <v-icon class="mr-2">mdi mdi-home</v-icon> กลับหน้าหลัก
    </v-btn>
  </v-container>
</template>
<script>
  import { mapActions, mapGetters } from "vuex";
  import router from "@/router";
import Swal from "sweetalert2";
  
  export default {
    data: () => ({
      otp: "",
      password: "",
      confirm_password: "",
      loading: false,
      loading_otp: false,
      otp_dialog: false,

      show_password: false,
      show_confirm_password: false,

      rules: {
        password: [
          (val) =>
            (val || "").length > 7 ||
            "โปรดระบุรหัสผ่านความยาวไม่น้อยกว่า 8 ตัวอักษร",
        ],
      },
    }),
    methods: {
      ...mapActions({
        SendTypeForgotPassword: "ResetPasswordModules/SendTypeForgotPassword",
        SendResetPasswordOtp: "ResetPasswordModules/SendResetPasswordOtp"
      }),

      backToHome() {
        router.push({ name: "UserKingdom" });
      },

      async sendResetPassword () {
        this.loading = true

        if (this.password === "") {
          this.loading = false
          Swal.fire({
            icon: "warning",
            title: "รหัสผ่านไม่ถูกต้อง",
            text: "(กรุณาระบุรหัสผ่านใหม่อีกครั้ง)"
          })
        } else if (this.confirm_password === "") {
          this.loading = false
          Swal.fire({
            icon: "warning",
            title: "ยืนยันรหัสผ่านไม่ถูกต้อง",
            text: "(กรุณาระบุยืนยันรหัสผ่านใหม่อีกครั้ง)"
          })
        } else if (this.password.length < 8) {
          this.loading = false
          Swal.fire({
            icon: "warning",
            title: "รหัสผ่านไม่ถูกต้อง",
            text: "(กรุณาระบุรหัสผ่านมากกว่า 8 ตัวอักษร)"
          })
        } else if (this.confirm_password.length < 8) {
          this.loading = false
          Swal.fire({
            icon: "warning",
            title: "ยืนยันรหัสผ่านไม่ถูกต้อง",
            text: "(กรุณาระบุยืนยันรหัสผ่านมากกว่า 8 ตัวอักษร)"
          })
        } else if (this.password !== this.confirm_password) {
          this.loading = false
          Swal.fire({
            icon: "warning",
            title: "รหัสผ่านไม่ตรงกัน",
            text: "(กรุณาระบุยืนยันรหัสผ่านให้ตรงกัน)"
          })
        } else {
          this.otp_dialog = true
          this.loading = false
        }
      },

      async confirmOtp () {
        this.loading_otp = false
        if (this.otp !== "" && this.otp.length === 6) {
          this.loading_otp = false

          const payload = {
            otp: this.otp,
            new_password: this.password,
            confirm_new_password: this.confirm_password,
          }
          await this.SendResetPasswordOtp(payload)

          if (this.responseResetPassword) {
            this.otp_dialog = false
            
            Swal.fire({
              icon: "success",
              title: "แก้ไขรหัสผ่านสำเร็จ",
              timer: 3000,
              showConfirmButton: false,
              timerProgressBar: true
            }).finally(()=>{
              router.push({ name: "Login" });
            })

          } else {
            Swal.fire({
              icon: "warning",
              title: "ยืนยัน OTP ไม่สำเร็จ",
              text: "(กรุณาระบุ OTP ให้ถูกต้อง)"
            })
          }
          this.loading_otp = false
        }
      }
    },
    computed: {
      ...mapGetters({
        responseResetPassword: "ResetPasswordModules/responseResetPassword",
        responseResetPasswordMessage: "ResetPasswordModules/responseResetPasswordMessage",
      }),

      MobileSize() {
        const { xs } = this.$vuetify.breakpoint;
        return !!xs;
      },
    }
  };
</script>
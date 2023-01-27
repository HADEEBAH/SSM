<template>
  <v-container>
    <v-row>
      <v-layout align-center justify-center mt-20>
        <v-flex xs12 sm8 md4>
          <div class="nametitle">
            <v-title>เข้าสู่ระบบ</v-title>
          </div>
          <v-card-text>
            <form>
              <v-col>
                <h2 class="title">ชื่อผู้ใช้งาน/OneID</h2>
                <v-text-field
                  background-color="#d9d9d9"
                  placeholder="กรอกชื่อผู้ใช้"
                  solo
                ></v-text-field>
              </v-col>
              <v-col>
                <h2 class="title">รหัสผ่าน</h2>
                <v-text-field
                  background-color="#d9d9d9"
                  :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                  placeholder="กรอกรหัสผ่าน"
                  solo
                ></v-text-field>
              </v-col>
              <h4 to="/" class="forgotpassword">ลืมรหัสผ่าน</h4>
              <div>
                <v-btn class="loginbutton" x-large> เข้าสู่ระบบ </v-btn>
              </div>
              <h4 to="/" class="register">ลงทะเบียนผู้ใช้ใหม่</h4>
            </form>
          </v-card-text>
        </v-flex>
      </v-layout>
    </v-row>
  </v-container>
</template>

<script>
export default {};
</script>

<style>
.loginbutton {
  font-family: "Prompt";
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  width: 330px;
  margin-left: 12px;
  margin-top: 15px;
}
.title {
  margin-bottom: 15px;
  margin-top: -15px;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 23px;

  color: #000000;
}
.nametitle {
  margin-bottom: 25px;
  padding-bottom: 30px;
  text-align: center;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  color: #000000;
}
.forgotpassword {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  text-align: right;
  text-decoration-line: underline;
  margin-bottom: 20px;
  margin-top: -25px;
  margin-right: 10px;
  cursor: pointer;
  color: #0c729f;
}
.register {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  text-decoration-line: underline;
  margin-top: 20px;
  text-align: center;
  color: #575757;
}
</style>
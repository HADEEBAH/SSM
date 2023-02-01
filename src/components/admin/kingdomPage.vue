<template>
  <v-form>
    <header class="headerkingdom">สร้างอาณาจักร</header>
    <v-container>
      <v-row>
        <v-layout align-center justify-center mt-20>
          <v-col>
            <!-- <div class="titlekingdom"><v-title>สร้างอาณาจักร</v-title></div> -->
            <v-card-text>
              <form>
                <h2 class="title">ชื่ออาณาจักร</h2>
                <v-text-field
                  class="form1"
                  placeholder="กรอกชื่ออาณาจักร"
                  outlined
                ></v-text-field>
                <h2 class="title">รายละเอียด</h2>
                <v-textarea
                  class="form2"
                  placeholder="กรอกรายละเอียด..."
                  auto-grow
                  outlined
                ></v-textarea>
                <h2 class="title">อัปโหลดภาพหน้าปกอาณาจักร</h2>
                <div class="btn text-center">
                    <v-btn class="btn1" outlined color="error">ยกเลิก</v-btn>
                    <v-btn class="btn2" >ยืนยัน</v-btn>
                </div>
              </form>
            </v-card-text>
          </v-col>
        </v-layout>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
export default {};
</script>

<style scoped>
.headerkingdom {
  font-style: normal;
  font-weight: 700;
  font-size: 28px;
  margin-left: 195px;
  margin-top: 50px;
  margin-bottom: -90px;
}
.title {
  margin-bottom: 5px;
  margin-top: 30px;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 23px;
}
.form1 {
  width: 1120px;
  height: 65px;
}
.form2 {
  width: 1120px;
  resize: none;
}
.btn {
    margin-top: 150px;
}
.btn1 {
  margin-right: 30px;
}
.btn2 {
  margin-left: 30px;
}
.theme--light.v-btn.btn1 {
    color: red;
}
.theme--light.v-btn.btn2 {
    color: white;
}
.theme--light.v-btn.v-btn--has-bg {
    background-color: #f30606;
}
</style>

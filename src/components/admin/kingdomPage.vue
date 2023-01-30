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
                <h2 class="title1">ชื่ออาณาจักร</h2>
                <v-text-field
                  class="form1"
                  placeholder="กรอกชื่ออาณาจักร"
                  outlined
                ></v-text-field>
                <h2 class="title2">รายละเอียด</h2>
                <v-textarea
                  class="form2"
                  placeholder="กรอกรายละเอียด..."
                  auto-grow
                  outlined
                ></v-textarea>
                <h2 class="titleupload">อัปโหลดภาพหน้าปกอาณาจักร</h2>
                <!--UPLOAD-->
                <form enctype="multipart/form-data" novalidate>
                  <div class="dropbox">
                    <input
                      type="file"
                      multiple
                      :name="uploadFieldName"
                      :disabled="isSaving"
                      accept="image/*"
                      class="input-file"
                    />
                    <p>
                      Drop file here or click to upload
                    </p>
                    <!-- <p v-if="isSaving">Uploading {{ fileCount }} files...</p> -->
                  </div>
                </form>
                <div class="btn text-center">
                  <v-btn class="btn1" outlined color="error">ยกเลิก</v-btn>
                  <v-btn class="btn2">ยืนยัน</v-btn>
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
  margin-left: 30px;
  margin-top: 30px;
  margin-bottom: -70px;
  padding-left: 60px;
}
.title1 {
  margin-bottom: 10px;
  margin-top: 0px;
  padding-left: 60px;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 23px;
}
.title2 {
  margin-bottom: 10px;
  margin-top: 25px;
  padding-left: 60px;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 23px;
}
.titleupload {
  margin-bottom: 10px;
  margin-top: 15px;
  padding-left: 60px;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 23px;
  color: #000000;
}
.form1 {
  width: 90%;
  height: 65px;
  padding-left: 60px;
}
.form2 {
  width: 90%;
  resize: none;
  padding-left: 60px;
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
.dropbox {
  outline: 2px dashed rgb(22, 20, 20); /* the dash box */
  outline-offset: -10px;
  background: white;
  color: rgb(11, 11, 11);
  /* padding-left: 35px; */
  width: 40%;
  height: 40%;
  position: relative;
  cursor: pointer;
  margin-left: 55px;
}

.input-file {
  opacity: 0; /* invisible but it's there! */
  width: 100%;
  height: 115px;
  position: absolute;
  cursor: pointer;
}

.dropbox:hover {
  background: white; /* when mouse over to the drop zone, change color */
}

.dropbox p {
  font-size: 1.7em;
  text-align: center;
  padding: 50px 0;
}
</style>

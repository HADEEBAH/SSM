<template>
  <v-app>
    <v-container>
      <headerPage title="สร้างอาณาจักร"></headerPage>
      <v-row>
        <v-col>
          <h2 class="title1 mb-2">ชื่ออาณาจักร</h2>
          <v-text-field
            class="form1 mb-6"
            placeholder="กรอกชื่ออาณาจักร"
            outlined
            v-model="namekingdom"
          ></v-text-field>
          <h2 class="title2 mb-2">รายละเอียด</h2>
          <v-textarea
            class="form2"
            placeholder="กรอกรายละเอียด..."
            auto-grow
            outlined
            v-model="detail"
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
              <p>Drop file here or click to upload</p>
              <!-- <p v-if="isSaving">Uploading {{ fileCount }} files...</p> -->
            </div>
          </form>
          <div class="btn text-center">
            <v-btn class="btn1" outlined color="error">ยกเลิก</v-btn>
            <v-btn class="btn2">ยืนยัน</v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import headerPage from "@/components/header/headerPage.vue";
export default {
  name: "kingdomPage",
  components: {
    headerPage,
  },
  props: {
    title: { type: String },
  },
  data: () => ({}),

  created() {},

  mounted() {},

  watch: {},

  computed: {},

  methods: {},
};
</script>

<style scoped>
.title1 {
  font-weight: 500;
  font-size: 20px;
  line-height: 23px;
}
.headerkingdom {
  font-style: normal;
  font-weight: 700;
  font-size: 28px;
  margin-left: 195px;
  margin-top: 50px;
  margin-bottom: -90px;
}
.title2 {
  font-weight: 500;
  font-size: 20px;
  line-height: 23px;
}
.titleupload {
  font-weight: 500;
  font-size: 20px;
  line-height: 23px;
}
.form1 {
  width: 95%;
  height: 65px;
}
.form2 {
  width: 95%;
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
  color: #ff6b81;
}
.theme--light.v-btn.btn2 {
  color: white;
}
.theme--light.v-btn.v-btn--has-bg {
  background-color: #ff6b81;
}
.dropbox {
  outline: 2px dashed rgb(22, 20, 20); /* the dash box */
  outline-offset: -10px;
  background: white;
  color: rgb(11, 11, 11);
  margin-left: -8px;
  width: 40%;
  height: 90px;
  position: relative;
  cursor: pointer;
}

.input-file {
  opacity: 0; /* invisible but it's there! */
  width: 100%;
  height: 90px;
  position: absolute;
  cursor: pointer;
}
.dropbox p {
  font-size: 1.5em;
  text-align: center;
  padding: 30px 0;
 
}
</style>

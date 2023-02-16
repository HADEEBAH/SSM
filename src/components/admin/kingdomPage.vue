<template>
  <v-app>
    <v-container>
      <headerPage title="สร้างอาณาจักร"></headerPage>
      <!-- <v-row>
        <v-col>
          <label-custom >ชื่ออาณาจักร</label-custom>
          <v-text-field
            class="form1 mb-6"
            placeholder="กรอกชื่ออาณาจักร"
            outlined
            v-model="kingdom.kingdom_name"
          ></v-text-field>
          <label-custom class="title2 mb-2">รายละเอียด</label-custom>
          <v-textarea
            class="form2"
            placeholder="กรอกรายละเอียด..."
            auto-grow
            outlined
            v-model="kingdom.detail"
          ></v-textarea>
          <label-custom class="titleupload">อัปโหลดภาพหน้าปกอาณาจักร</label-custom>
          UPLOAD
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
              <p v-if="isSaving">Uploading {{ fileCount }} files...</p>
            </div>
          </form>
          <div class="btn text-center">
            <v-btn class="btn1" outlined color="error">ยกเลิก</v-btn>
            <v-btn class="btn2">ยืนยัน</v-btn>
          </div>
        </v-col>
      </v-row> -->
      <v-row dense>
        <v-col>
          <label-custom text="ชื่ออาณาจักร(ภาษาไทย)"></label-custom>
          <v-text-field
            dense
            placeholder="กรอกชื่ออาณาจักร"
            outlined
            v-model="kingdom.kingdom_name_th"
          ></v-text-field>
        </v-col>
        <v-col>
          <label-custom text="ชื่ออาณาจักร(ภาษาอังกฤษ)"></label-custom>
          <v-text-field
            dense
            placeholder="กรอกชื่ออาณาจักร"
            outlined
            v-model="kingdom.kingdom_name_eng"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row dense>
        <v-col>
          <label-custom text="รายละเอียด"></label-custom>
          <v-textarea
            dense
            class="form2"
            placeholder="กรอกรายละเอียด..."
            auto-grow
            outlined
            v-model="kingdom.detail"
          ></v-textarea>
        </v-col>
      </v-row>

      <v-row dense>
        <v-col>
          <label-custom text="อัปโหลดภาพหน้าปกอาณาจักร"></label-custom>
          <v-card class="mx-3" flat>
            <v-card-text
              class="border-dashed border-2 border-blue-600 rounded-lg"
            >
              <v-row v-if="preview_url">
                <v-col>
                  <img :src="preview_url" style="max-height: 200px" />
                </v-col>
              </v-row>
              <v-row v-if="!preview_url">
                <v-col cols="12" class="flex align-center justify-center">
                  <v-img
                    src="../../assets/course/upload_file.png"
                    max-height="105"
                    max-width="122"
                  ></v-img>
                </v-col>
                <v-col
                  cols="12"
                  class="flex align-center justify-center text-h5"
                >
                  อัพโหลดภาพหน้าปกคอร์สเรียน
                </v-col>
                <v-col
                  cols="12"
                  class="flex align-center justify-center text-caption"
                >
                  ( ขนาดไฟล์งานไม่เกิน 500 Mb ต้องเป็นไฟล์ JPG, PNG )
                </v-col>
                <v-col cols="12" class="flex align-center justify-center">
                  <v-btn outlined color="blue" @click="openFileSelector"
                    >เลือกไฟล์</v-btn
                  >
                  <input
                    ref="fileInput"
                    type="file"
                    @change="uploadFile"
                    style="display: none"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row >
        <v-col align="right" sm="" cols="12" >
          <v-btn outlined :class="$vuetify.breakpoint.smAndUp?'btn-size-lg': 'w-full'" color="#ff6b81">
            ยกเลิก
          </v-btn>
        </v-col>
        <v-col sm="auto" cols="12">
          <v-btn  depressed :class="$vuetify.breakpoint.smAndUp?'btn-size-lg': 'w-full'" dark color="#ff6b81" > 
            ยืนยัน 
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import headerPage from "@/components/header/headerPage.vue";
import LabelCustom from "../label/labelCustom.vue";
export default {
  name: "kingdomPage",
  components: {
    headerPage,
    LabelCustom,
  },
  data: () => ({
    kingdom: {
      kingdom_name_th: "",
      kingdom_name_eng: "",
      detail: "",
    },
    preview_url: null
  }),

  created() {},

  mounted() {},

  watch: {},

  computed: {},

  methods: {
    openFileSelector() {
      this.$refs.fileInput.click();
    },
    uploadFile() {
      this.file = this.$refs.fileInput.files[0];
      if (!this.file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl = e.target.result;
      };
      reader.readAsDataURL(this.file);
    },
  },
};
</script>

<!-- <style scoped>
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
</style> -->

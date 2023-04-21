<template>
  <v-app>
    <v-container>
      <headerPage title="สร้างอาณาจักร"></headerPage>
      <v-row dense>
        <v-col>
          <label-custom text="อัปโหลดภาพหน้าปกอาณาจักร"></label-custom>

          <v-card class="mx-3" flat>
            <v-card-text
              class="border-dashed border-2 border-blue-600 rounded-lg"
            >
                <v-img
                  v-if="!enabled"
                  style="
                    max-height: 105px;
                    max-width: 122px;
                    margin-left: auto;
                    margin-right: auto;
                  "
                  :src="showImg"
                >
                </v-img>

                <div v-else>
                  <v-row v-if="preview_url">
                    <v-col class="flex align-center justify-center">
                      <v-img
                        :src="preview_url"
                        style="max-width: 150px"
                        class="text-right"
                      >
                        <v-btn icon>
                          <v-icon color="#ff6b81" @click="closeImage()"
                            >mdi-close-circle</v-icon
                          >
                        </v-btn>
                      </v-img>
                    </v-col>
                    <input
                      ref="fileInput"
                      type="file"
                      @change="uploadFile"
                      style="display: none"
                    />
                  </v-row>

                  <v-row v-if="!preview_url">
                    <v-col cols="12" class="flex align-center justify-center">
                      <v-img
                        src="../../../assets/course/upload_file.png"
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
                      ( ขนาดไฟล์งานไม่เกิน 1 Mb ต้องเป็นไฟล์ JPG, PNG )
                    </v-col>
                    <v-col cols="12" class="flex align-center justify-center">
                      <v-btn outlined color="blue" @click="openFileSelector"
                        >เลือกไฟล์</v-btn
                      >
                      <input
                        ref="fileInput"
                        type="file"
                        accept="image/png, image/jpeg"
                        @change="uploadFile"
                        style="display: none"
                      />
                    </v-col>
                  </v-row>
                </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <br />

      <label-custom text="รายละเอียดอาณาจักร"></label-custom>
      <hr />
      <br />

      <v-row dense>
        <v-col cols="12" sm="6">
          <label-custom text="ชื่ออาณาจักร(ภาษาไทย)"></label-custom>

            <v-text-field
              dense
              placeholder="กรอกชื่ออาณาจักร"
              outlined
              v-model="kingdom.kingdom_name_th"
              @keypress="validate($event, 'th')"
            ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <label-custom text="ชื่ออาณาจักร(ภาษาอังกฤษ)"></label-custom>

            <v-text-field
              dense
              placeholder="กรอกชื่ออาณาจักร"
              outlined
              v-model="kingdom.kingdom_name_eng"
              @keypress="validate($event, 'en')"
            ></v-text-field>
         
        </v-col>
      </v-row>

      <v-row dense>
        <v-col cols="12" sm="6">
          <label-custom text="จัดสอนโดย"></label-custom>

            <v-text-field
              dense
              placeholder="ระบุสถาบันผู้จัดสอน เช่น ศูนย์ดนตรี Manila Tamarind"
              outlined
              v-model="kingdom.learning_method"
            ></v-text-field>
        </v-col>
      </v-row>

      <v-row dense>
        <v-col cols="12">
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

   
        <v-row dense v-if="enabled">
          <v-col align="right" sm="" cols="12">
            <v-btn
              outlined
              :class="$vuetify.breakpoint.smAndUp ? 'btn-size-lg' : 'w-full'"
              color="#ff6b81"
              @click="cancleText()"
            >
              ยกเลิก
            </v-btn>
          </v-col>

          <v-col sm="auto" cols="12">
            <v-btn
              class="white--text mb-5"
              depressed
              :disabled="!isInputValid"
              :color="isInputValid ? '#ff6b81' : ''"
              :class="$vuetify.breakpoint.smAndUp ? 'btn-size-lg' : 'w-full'"
              @click="openDialog()"
              >บันทึก
            </v-btn>
          </v-col>
        </v-row>
        <v-col cols="12" sm="12" v-if="!enabled" align="right">
          <v-btn
            class="white--text my-5 w-full"
            depressed
            :disabled="!isInputValid"
            :color="isInputValid ? '#ff6b81' : ''"
            :class="$vuetify.breakpoint.smAndUp ? 'btn-size-lg' : 'w-full'"
            @click="showBtn()"
          >
            <span class="mdi mdi-pencil-outline">แก้ไข</span>
          </v-btn>
        </v-col>
      <v-dialog class="pa-2" width="50vw" v-model="dialog_show" persistent>
        <v-card>
          <v-card-title>
            <v-row>
              <v-col cols="12" align="right">
                <v-btn icon @click="closeDialog">
                  <v-icon color="#ff6b81">mdi-close</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-card-title>
          <dialogCard text="สร้างอาณาจักรเรียบร้อย"></dialogCard>
          <div class="my-5 text-center">
          <v-btn color="#ff6b81"  @click="goToManageKingdomPage()" >
            ตกลง
        </v-btn>
      </div>
        </v-card>
      </v-dialog>
    </v-container>
  </v-app>
</template>

<script>
import headerPage from "@/components/header/headerPage.vue";
import LabelCustom from "../../../components/label/labelCustom.vue";
import dialogCard from "@/components/dialog/dialogCard.vue";
import { inputValidation, CheckFileSize } from "@/functions/functions";
import Swal from "sweetalert2";
import axios from "axios";
import VueCookie from "vue-cookie"
export default {
  name: "kingdomPage",
  components: {
    headerPage,
    LabelCustom,
    dialogCard,
  },
  data: () => {
    return {
      inputValue: "",
      dialog_show: false,
      enabled: true,
      editFile: false,
      disable: false,
      saved: false,
      preview_url: null,
      showImg: "",
      kingdom: {
        kingdom_name_th: "",
        kingdom_name_eng: "",
        detail: "",
        learning_method: "",
      },
    };
  },

  created() {},

  mounted() {},

  watch: {},

  computed: {
    isInputValid() {
      return (
        this.kingdom.kingdom_name_th.trim().length > 0 &&
        this.kingdom.kingdom_name_eng.trim().length > 0 &&
        this.kingdom.learning_method.trim().length > 0 &&
        this.kingdom.detail.trim().length > 0
      );
    },
  },

  methods: {
    closeDialog() {
      this.dialog_show = false;
      this.saved = true;
    },
    closeImage() {
      this.preview_url = null;
    },
    openFileSelector() {
      this.$refs.fileInput.click();
    },
    edit() {
      this.$router.push({ name: "Finance" });
    },
    goToManageKingdomPage() {
      this.$router.push({ name: "ManageKingdom" })
    },
    cancleText() {
      this.kingdom.kingdom_name_th = "";
      this.kingdom.kingdom_name_eng = "";
      this.kingdom.learning_method = "";
      this.kingdom.detail = "";
      this.preview_url = "";
    },
    openDialog() {
      Swal.fire({
        icon: "question",
        title: "คุณต้องการสร้างอาณาจักรหรือไม่",
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: "ตกลง",
        cancelButtonText: "ยกเลิก",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {

            let config = {
                headers:{
                    "Access-Control-Allow-Origin" : "*",
                    "Content-type": "Application/json",
                    'Authorization' : `Bearer ${VueCookie.get("token")}`
                }
            }
            console.log("preview_url", this.file);
            let bodyFormData = new FormData();
            bodyFormData.append("img_url", this.file);
            bodyFormData.append("category_name_th",this.kingdom.kingdom_name_th);
            bodyFormData.append("category_name_en",this.kingdom.kingdom_name_eng);
            bodyFormData.append("category_description", this.kingdom.detail);
            bodyFormData.append("taught_by", this.kingdom.learning_method);
            console.log("header", config);
            let { data } = await axios.post( `${process.env.VUE_APP_URL}/api/v1/category`, bodyFormData, config);
            if (data.statusCode === 201) {
              this.showImg = `${process.env.VUE_APP_URL}/api/v1/files/${data.data.categoryImg}`;
              this.dialog_show = true;
              this.disable = false;
              this.enabled = false;
              this.buttonName = "แก้ไข";
            } else {
              throw { message: data.message };
            }
          } catch (error) {
            console.log(error);
            Swal.fire({
              icon: "error",
              title: error.message,
            });
          }
        } else {
          Swal.fire("ข้อมูลของคุณจะไม่บันทึก", "", "info");
        }
      });
    },
    uploadFile() {
      this.file = this.$refs.fileInput.files[0];
      if (!this.file) return;
      if(CheckFileSize(this.file) === true){
        const reader = new FileReader();
        reader.onload = (e) => {
          this.preview_url = e.target.result;
        };
        reader.readAsDataURL(this.file);
      }
    },
    validate(e, type) {
      inputValidation(e, type);
    },

    showBtn() {
      this.editFile = true;
      this.disable = false;
      this.enabled = false;
    },
  },
};
</script>

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
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
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

      <!-- <div>
        <input type="text" v-model="inputValue" />
        <button :class="isInputValid ? 'active' : ''">Submit</button>
      </div> -->

      <v-row>
        <v-col align="right" sm="" cols="12">
          <v-btn
            outlined
            :class="$vuetify.breakpoint.smAndUp ? 'btn-size-lg' : 'w-full'"
            color="#ff6b81"
          >
            ยกเลิก
          </v-btn>
        </v-col>
        <v-col sm="auto" cols="12">
          <v-btn
            v-if="!saved"
            depressed
            :class="$vuetify.breakpoint.smAndUp ? 'btn-size-lg' : 'w-full'"
            class="white--text"
            :disabled="!isInputValid"
            :color="isInputValid ? '#ff6b81' : ''"
            @click="openDialog()"
          >
            บันทึก
          </v-btn>

          <v-btn
            v-else
            depressed
            :class="$vuetify.breakpoint.smAndUp ? 'btn-size-lg' : 'w-full'"
            class="white--text"
            :disabled="!isInputValid"
            :color="isInputValid ? '#ff6b81' : ''"
            @click="edit()"
          >
            แก้ไข
          </v-btn>
        </v-col>
      </v-row>

      <!-- DIALOG -->
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
        </v-card>
      </v-dialog>
    </v-container>
  </v-app>
</template>

<script>
import headerPage from "@/components/header/headerPage.vue";
import LabelCustom from "../label/labelCustom.vue";
import dialogCard from "@/components/dialog/dialogCard.vue";
import Swal from "sweetalert2";
import axios from "axios";
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
      saved: false,
      preview_url: null,
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

    buttonText() {
      return this.clickCount ? "บันทึก" : "แก้ไข";
    },
  },

  methods: {
    closeDialog() {
      this.dialog_show = false;
      this.saved = true;
    },
    openFileSelector() {
      this.$refs.fileInput.click();
    },
    edit() {
      this.$router.push({ name: "Finance" });
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
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          try {
            console.log("preview_url", this.preview_url);
            let { data } = await axios.post(
              "http://192.168.72.187:3000/api/category",
              {
                category_name_th: this.kingdom.kingdom_name_th,
                category_name_eng: this.kingdom.kingdom_name_eng,
                img_file: this.preview_url,
                detail: this.kingdom.detail,
                taught_by: this.kingdom.coach,
              }
            );
            console.log(data);
            if (data.statusCode === 201) {
              this.dialog_show = true;
            } else {
              throw { message: data.message };
            }
          } catch (error) {
            Swal.fire({
              icon: "error",
              title: error.message,
            });
          }
        } else if (result.isDenied) {
          Swal.fire("Changes are not saved", "", "info");
        }
      });
      // this.dialog_show = true;
    },
    createKingdom() {},
    uploadFile() {
      this.file = this.$refs.fileInput.files[0];
      console.log(this.file);
      if (!this.file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.preview_url = e.target.result;
        console.log(this.preview_url);
      };
      reader.readAsDataURL(this.file);
    },
  },
};
</script>

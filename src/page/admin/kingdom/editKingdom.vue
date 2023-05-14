<template>
  <v-container>
    <!-- {{ showImg(category.categoryImg)  }} -->
    <headerPage title="แก้ไขอาณาจักร" class="my-5"></headerPage>
    <label-custom text="อัปโหลดภาพหน้าปกอาณาจักร"></label-custom>
    <v-card style="border: dashed blue">
      <v-card-title primary-title  align="end">
        <v-btn icon v-if="preview_url">
          <v-icon color="#ff6b81" @click="closeImage()"
            >mdi-close-circle</v-icon
          >
        </v-btn>
      </v-card-title>
      <v-card-text>
       
        <div v-if="category.categoryImg">
          <v-img
            v-if="showData"
            style="
              max-height: 105px;
              max-width: 122px;
              margin-left: auto;
              margin-right: auto;
            "
            :src="showImg(category.categoryImg)"
          >
          </v-img>

          <div v-else>
            <v-img
              @click="openFileSelector"
              class="text-right"
              style="
                max-height: 105px;
                max-width: 122px;
                margin-left: auto;
                margin-right: auto;
              "
              :src="preview_url ? preview_url : showImg(category.categoryImg)"
            />
            <v-row v-if="!preview_url" >
                    <v-col cols="12" class="flex align-center justify-center mt-5">
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
          </div>
        </div>  
        <div v-else class="text-center">
        <v-progress-circular  
        indeterminate 
        :size="70"
        :width="7"
        color="#ff6b81"></v-progress-circular>
      </div>
      </v-card-text>
    </v-card>

    <br />

    <v-row dense>
      <v-col cols="12" sm="6">
        <label-custom text="ชื่ออาณาจักร(ภาษาไทย)"></label-custom>
        <v-text-field
          :disabled="showData"
          dense
          placeholder="กรอกชื่ออาณาจักร"
          outlined
          v-model="category.categoryNameTh"
          @keypress="validate($event, 'th')"
        ></v-text-field>
      </v-col>

      <v-col cols="12" sm="6">
        <label-custom text="ชื่ออาณาจักร(ภาษาอังกฤษ)"></label-custom>
        <v-text-field
          :disabled="showData"
          dense
          placeholder="กรอกชื่ออาณาจักร"
          outlined
          v-model="category.categoryNameEng"
          @keypress="validate($event, 'en')"
        ></v-text-field>
      </v-col>

      <v-row dense>
        <v-col cols="12" sm="6">
          <label-custom text="จัดสอนโดย"></label-custom>
          <v-text-field
            :disabled="showData"
            dense
            placeholder="ระบุสถาบันผู้จัดสอน เช่น ศูนย์ดนตรี Manila Tamarind"
            outlined
            v-model="category.taughtBy"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-row>
    <v-row dense>
      <v-col cols="12">
        <label-custom text="รายละเอียด"></label-custom>
        <v-textarea
          :disabled="showData"
          dense
          class="form2"
          placeholder="กรอกรายละเอียด..."
          auto-grow
          outlined
          v-model="category.categoryDescription"
        ></v-textarea>
      </v-col>
    </v-row>

    <v-col cols="12" sm="12" v-if="showData" align="right">
      <v-btn
        class="white--text my-5 w-full"
        depressed
        color="#ff6b81"
        :class="$vuetify.breakpoint.smAndUp ? 'btn-size-lg' : 'w-full'"
        @click="showBtn()"
      >
        <span class="mdi mdi-pencil-outline">แก้ไข</span>
      </v-btn>
    </v-col>

    <div v-else>
      <v-row dense>
        <v-col align="right" sm="" cols="12">
          <v-btn
            outlined
            :class="$vuetify.breakpoint.smAndUp ? 'btn-size-lg' : 'w-full'"
            color="#ff6b81"
            @click="goToManageKingdomPage()"
          >
            ยกเลิก
          </v-btn>
        </v-col>

        <v-col sm="auto" cols="12">
          <v-btn
            class="white--text mb-5"
            depressed
            color="#ff6b81"
            :class="$vuetify.breakpoint.smAndUp ? 'btn-size-lg' : 'w-full'"
            @click="openDialog()"
            >บันทึก
          </v-btn>
        </v-col>
      </v-row>
    </div>

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
        <dialogCard text="แก้ไขอาณาจักรเรียบร้อย"></dialogCard>
        <div class="my-5 text-center">
          <v-btn color="#ff6b81" @click="goToManageKingdomPage()"> ตกลง </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import dialogCard from "@/components/dialog/dialogCard.vue";
import Swal from "sweetalert2";
import axios from "axios";
import { inputValidation } from "@/functions/functions";
import headerPage from "@/components/header/headerPage.vue";
import { mapActions, mapGetters } from "vuex";
import LabelCustom from "../../../components/label/labelCustom.vue";
import VueCookie from "vue-cookie"
export default {
  components: {
    headerPage,
    LabelCustom,
    dialogCard,
  },
  data: () => ({
    preview_url: null,
    showData: true,
    dialog_show: false,
    // kingdom: {
    //   kingdom_name_th: "",
    //   kingdom_name_eng: "",
    //   detail: "",
    //   learning_method: "",
    // },
  }),
  mounted() {},
  created() {
    this.GetCategory(this.$route.params.category_id);
  },
  methods: {
    ...mapActions({
      GetCategory: "CategoryModules/GetCategory",
    }),

    closeImage() {
      this.preview_url = null;
    },
    closeDialog() {
      this.dialog_show = false;
    },

    cancleText() {},
    getCategory(categoryId) {
      console.log("category_id", categoryId);
      this.GetCategory(categoryId);
    },

    showImg(item) {
      console.log(item);
      return item;
    },

    openFileSelector() {
      this.$refs.fileInput.click();
    },

    uploadFile() {
      this.file = this.$refs.fileInput.files[0];
      console.log("file=>", this.file);
      if (!this.file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.preview_url = e.target.result;
      };
      reader.readAsDataURL(this.file);
    },

    showBtn() {
      this.showData = false;
    },

    goToManageKingdomPage() {
      this.$router.push({ name: "ManageKingdom" });
    },

    validate(e, type) {
      inputValidation(e, type);
    },

    openDialog() {
      Swal.fire({
        icon: "question",
        title: "คุณต้องการแก้ไขอาณาจักรหรือไม่",
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: "ตกลง",
        cancelButtonText: "ยกเลิก",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            console.log("preview_url", this.file);
            const payload = {
              categoryNameTh:this.category.categoryNameTh,
              categoryNameEng: this.category.categoryNameEng,
              taughtBy: this.category.taughtBy,
              categoryDescription: this.category.categoryDescription
            }
            let bodyFormData = new FormData();
            bodyFormData.append("categoryImg", this.file ?  this.file : null);
            bodyFormData.append(
              "payload",
              JSON.stringify(payload)
            );

            // bodyFormData.append("categoryImg", this.file ?  this.file : null);
            // bodyFormData.append("categoryNameTh",this.category.categoryNameTh );
            // bodyFormData.append( "categoryNameEng", this.category.categoryNameEng );
            // bodyFormData.append("taughtBy", this.category.taughtBy);
            // bodyFormData.append("categoryDescription", this.category.categoryDescription  );

            let config = {
                    headers:{
                        "Access-Control-Allow-Origin" : "*",
                        "Content-type": "Application/json",
                        'Authorization' : `Bearer ${VueCookie.get("token")}`
                    }
                }
            let { data } = await axios.patch(
              `${process.env.VUE_APP_URL}/api/v1/category/${this.$route.params.category_id}`,
              bodyFormData, config
            );
            if (data.statusCode === 200) {
              this.dialog_show = true;
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
  },
  computed: {
    ...mapGetters({
      category: "CategoryModules/getCategory",
    }),

    categoryData: {
      get() {
        return this.category;
      },
    },
  },
};
</script>

<style>
</style>
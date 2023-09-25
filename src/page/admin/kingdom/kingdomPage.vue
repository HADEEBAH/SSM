<template>
  <v-app>
    <v-container>
      <headerPage :title="$t(`wls setup`)"></headerPage>
      <v-row dense>
        <v-col>
          <label-custom
            :text="$t(`upload the cover image of wls`)"
          ></label-custom>

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
                    id="inputFile"
                    ref="fileInput"
                    type="file"
                    @change="uploadFile($event)"
                    style="display: none"
                  />
                </v-row>

                <v-row v-if="!preview_url">
                  <v-col cols="12" class="flex align-center justify-center">
                    <v-img
                      src="@/assets/course/upload_file.png"
                      max-height="105"
                      max-width="122"
                    ></v-img>
                  </v-col>
                  <v-col
                    cols="12"
                    class="flex align-center justify-center text-h5"
                  >
                    {{ $t(`upload the cover image of wls`) }}
                  </v-col>
                  <v-col
                    cols="12"
                    class="flex align-center justify-center text-caption"
                  >
                    (
                    {{
                      $t(
                        "suggestion : Should upload an image with size 1024 x 576 (16:9) and file size not over 5 Mb must be JPG, PNG file"
                      )
                    }}
                    )
                  </v-col>
                  <v-col cols="12" class="flex align-center justify-center">
                    <v-btn outlined color="blue" @click="openFileSelector">{{
                      $t("choose file")
                    }}</v-btn>
                    <input
                      id="inputFile"
                      ref="fileInput"
                      type="file"
                      accept="image/png, image/jpeg"
                      @change="uploadFile($event)"
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

      <label-custom :text="$t('wls course information')"></label-custom>
      <hr />
      <br />

      <v-row dense>
        <v-col cols="12" sm="6">
          <label-custom :text="$t(`wls name (Thai)`)"></label-custom>
          <v-text-field
            dense
            :placeholder="$t(`fill in wls name`)"
            outlined
            v-model="kingdom.kingdom_name_th"
            @keydown="validate($event, 'th')"
            @paste="preventPaste"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <label-custom :text="$t(`wls name (English)`)"></label-custom>

          <v-text-field
            dense
            :placeholder="$t(`fill in wls name`)"
            outlined
            v-model="kingdom.kingdom_name_eng"
            @keydown="validate($event, 'en')"
            @paste="preventPaste"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row dense>
        <v-col cols="12" sm="6">
          <label-custom :text="$t('instructor')"></label-custom>

          <v-text-field
            dense
            :placeholder="
              $t(
                `specify the teaching institution, e.g. Manila Tamarind Music Center`
              )
            "
            outlined
            v-model="kingdom.learning_method"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row dense>
        <v-col cols="12">
          <label-custom :text="$t('wls detailed description')"></label-custom>

          <v-textarea
            dense
            class="form2"
            :placeholder="$t(`Fill in the details...`)"
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
            {{ $t("cancel") }}
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
            >{{ $t("save") }}
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
          <span class="mdi mdi-pencil-outline">{{ $t("edit") }}</span>
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
          <dialogCard :text="$t('completely build a wls')"></dialogCard>
          <div class="my-5 text-center">
            <v-btn color="#ff6b81" @click="goToManageKingdomPage()">
              {{ $t("agree") }}
            </v-btn>
          </div>
        </v-card>
      </v-dialog>
    </v-container>
  </v-app>
</template>

<script>
import headerPage from "@/components/header/headerPage.vue";
import LabelCustom from "@/components/label/labelCustom.vue";
import dialogCard from "@/components/dialog/dialogCard.vue";
import { inputValidation, CheckFileSize } from "@/functions/functions";
import Swal from "sweetalert2";
import axios from "axios";
import VueCookie from "vue-cookie";
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
        this.kingdom.kingdom_name_th.trim()?.length > 0 &&
        this.kingdom.kingdom_name_eng.trim()?.length > 0 &&
        this.kingdom.learning_method.trim()?.length > 0 &&
        this.kingdom.detail.trim()?.length > 0
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
      this.$router.push({ name: "ManageKingdom" });
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
        title: this.$t("do you want to build an wls?"),
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: this.$t("agree"),
        cancelButtonText: this.$t("no"),
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            let config = {
              headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-type": "Application/json",
                Authorization: `Bearer ${VueCookie.get("token")}`,
              },
            };
            const payload = {
              category_name_th: this.kingdom.kingdom_name_th,
              category_name_en: this.kingdom.kingdom_name_eng,
              category_description: this.kingdom.detail,
              taught_by: this.kingdom.learning_method,
            };

            let bodyFormData = new FormData();
            bodyFormData.append("img_url", this.file);
            bodyFormData.append("payload", JSON.stringify(payload));
            let { data } = await axios.post(
              `${process.env.VUE_APP_URL}/api/v1/category`,
              bodyFormData,
              config
            );
            if (data.statusCode === 201) {
              this.showImg = `${process.env.VUE_APP_URL}/api/v1/files/${data.data.categoryImg}`;
              this.disable = false;
              this.enabled = false;
              this.buttonName = this.$t("edit");

              Swal.fire({
                icon: "success",
                title: this.$t("succeed"),
                text: this.$t("wls has been built"),
                timer: 3000,
                timerProgressBar: true,
                showCancelButton: false,
                showConfirmButton: false,
              }).finally(() => {
                this.goToManageKingdomPage();
              });
            } else {
              throw { message: data.message };
            }
          } catch (error) {
            Swal.fire({
              icon: "error",
              title: error.message,
              timer: 3000,
              timerProgressBar: true,
              showCancelButton: false,
              showConfirmButton: false,
            });
          }
        } else {
          Swal.fire(this.$t("your data will not be saved"), "", "info");
        }
      });
    },
    uploadFile(event) {
      this.file = this.$refs.fileInput.files[0];
      if (!this.file) return;
      if (CheckFileSize(this.file, event.target.id) === true) {
        const fileType = this.file.type;
        if (fileType === "image/png" || fileType === "image/jpeg") {
          const reader = new FileReader();
          reader.onload = (e) => {
            this.preview_url = e.target.result;
          };
          reader.readAsDataURL(this.file);
        } else {
          Swal.fire({
            icon: "error",
            title: this.$t("something went wrong"),
            text: this.$t("upload only image files (png, jpeg) only"),
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        }
      }
    },
    validate(e, type) {
      inputValidation(e, type);
    },
    preventPaste(event) {
      event.preventDefault();
    },

    showBtn() {
      this.editFile = true;
      this.disable = false;
      this.enabled = false;
    },
  },
};
</script>

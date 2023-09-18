<template>
  <v-container>
    <v-form ref="category_form" v-model="category_form">
      <headerPage :title="$t('edit wls')" class="my-5"></headerPage>
      <label-custom :text="$t('upload the cover image of wls')"></label-custom>
      <v-card style="border: dashed blue">
        <v-card-title primary-title align="end">
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
              <v-row v-if="!preview_url">
                <v-col cols="12" class="flex align-center justify-center mt-5">
                  <v-btn outlined color="blue" @click="openFileSelector">{{
                    $t("select file")
                  }}</v-btn>
                  <input
                    id="inputFile"
                    ref="fileInput"
                    type="file"
                    @change="uploadFile($event)"
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
              color="#ff6b81"
            ></v-progress-circular>
          </div>
        </v-card-text>
      </v-card>
      <br />
      <v-row dense>
        <v-col cols="12" sm="6">
          <label-custom required :text="$t('wls name (thai)')"></label-custom>
          <v-text-field
            :rules="rules.category_name_th"
            :disabled="showData"
            dense
            :placeholder="$t('fill in wls name')"
            outlined
            v-model="category.categoryNameTh"
            @keypress="validate($event, 'th')"
          ></v-text-field>
        </v-col>

        <v-col cols="12" sm="6">
          <label-custom
            required
            :text="$t('wls name (english)')"
          ></label-custom>
          <v-text-field
            :rules="rules.category_name_en"
            :disabled="showData"
            dense
            :placeholder="$t('fill in wls name')"
            outlined
            v-model="category.categoryNameEng"
            @keypress="validate($event, 'en')"
          ></v-text-field>
        </v-col>

        <v-row dense>
          <v-col cols="12" sm="6">
            <label-custom required :text="$t('instructor')"></label-custom>
            <v-text-field
              :rules="rules.taughtBy"
              :disabled="showData"
              dense
              :placeholder="
                $t(
                  'specify the teaching institution, e.g. Manila Tamarind Music Center'
                )
              "
              outlined
              v-model="category.taughtBy"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-row>
      <v-row dense>
        <v-col cols="12">
          <label-custom :text="$t('wls detailed description')"></label-custom>
          <v-textarea
            :disabled="showData"
            dense
            class="form2"
            :placeholder="$t('fill in the details...')"
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
          <span class="mdi mdi-pencil-outline">{{ $t("edit") }}</span>
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
              {{ $t("cancel") }}
            </v-btn>
          </v-col>

          <v-col sm="auto" cols="12">
            <v-btn
              class="white--text mb-5"
              depressed
              color="#ff6b81"
              :class="$vuetify.breakpoint.smAndUp ? 'btn-size-lg' : 'w-full'"
              @click="openDialog()"
              >{{ $t("save") }}
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </v-form>

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
        <dialogCard :text="$t('the wls has been edited')"></dialogCard>
        <div class="my-5 text-center">
          <v-btn color="#ff6b81" @click="goToManageKingdomPage()">
            {{ $t("agree") }}
          </v-btn>
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
import LabelCustom from "@/components/label/labelCustom.vue";
import VueCookie from "vue-cookie";
import { CheckFileSize } from "@/functions/functions";
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
    category_form: false,
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
      this.GetCategory(categoryId);
    },

    showImg(item) {
      return item;
    },

    openFileSelector() {
      this.$refs.fileInput.click();
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
            text: this.$t("upload only image files (png, jpeg) only"),
            showDenyButton: false,
            showCancelButton: false,
            confirmButtonText: this.$t("agree"),
            cancelButtonText: this.$t("cancel"),
          });
        }
      }
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
      this.$refs.category_form.validate();
      if (this.category_form) {
        Swal.fire({
          icon: "question",
          title: this.$t("do you want to edit wls?"),
          showDenyButton: false,
          showCancelButton: true,
          confirmButtonText: this.$t("agree"),
          cancelButtonText: this.$t("cancel"),
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              const payload = {
                categoryNameTh: this.category.categoryNameTh,
                categoryNameEng: this.category.categoryNameEng,
                taughtBy: this.category.taughtBy,
                categoryDescription: this.category.categoryDescription,
              };
              let bodyFormData = new FormData();
              bodyFormData.append("categoryImg", this.file ? this.file : null);
              bodyFormData.append("payload", JSON.stringify(payload));

              let config = {
                headers: {
                  "Access-Control-Allow-Origin": "*",
                  "Content-type": "Application/json",
                  Authorization: `Bearer ${VueCookie.get("token")}`,
                },
              };
              let { data } = await axios.patch(
                `${process.env.VUE_APP_URL}/api/v1/category/${this.$route.params.category_id}`,
                bodyFormData,
                config
              );
              if (data.statusCode === 200) {
                this.goToManageKingdomPage();
                Swal.fire({
                  icon: "success",
                  title: this.$t("succeed"),
                  text: this.$t("wls has been edited"),
                  timer: 3000,
                  timerProgressBar: true,
                  showCancelButton: false,
                  showConfirmButton: false,
                });
              } else {
                throw { message: data.message };
              }
            } catch (error) {
              Swal.fire({
                icon: "error",
                title: error.message,
              });
            }
          } else {
            Swal.fire("ข้อมูลของคุณจะไม่บันทึก", "", "info");
          }
        });
      }
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
    rules() {
      return {
        category_name_th: [
          (val) =>
            (val || "").length > 0 || this.$t("please specify wls name (Thai)"),
          (val) =>
            val.length < 50 ||
            this.$t("wls name (Thai) longer than specified length"),
        ],
        category_name_en: [
          (val) =>
            (val || "").length > 0 ||
            this.$t("please specify wls name (English)"),
          (val) =>
            val.length < 50 ||
            this.$t(" wls name (English) longer than specified"),
        ],
        taughtBy: [
          (val) =>
            (val || "").length > 0 ||
            this.$t("please specify the teaching organizer"),
          (val) =>
            val.length < 50 ||
            this.$t(
              "the organizer of the lesson is longer than the specified length"
            ),
        ],
      };
    },
  },
};
</script>

<style></style>

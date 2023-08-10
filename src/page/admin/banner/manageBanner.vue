<template>
  <v-container class="h-full">
    <label class="text-xl font-bold">จัดการแบนเนอร์</label>
    <v-row dense class="my-3">
      <v-col cols="12" sm="3">
        <v-card
          class="ma-1 rounded-lg card-package-size max-h-[400px!important]"
          @click="openFileSelector()"
        >
          <v-row class="h-full m-auto">
            <v-col cols="12" class="text-center align-self-center">
              <v-icon color="#ff6b81" size="84"> mdi-plus </v-icon>
              <label class="block text-[#ff6b81]">เพิ่มรูป</label>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col cols="12" sm="9">
        <v-slide-group center-active>
          <v-slide-item
            v-for="(banner, index) in banner_list"
            :key="index"
            v-slot="{ active, toggle }"
          >
            <v-card
              :class="active ? '' : ''"
              class="ma-1 rounded-lg card-package-size max-h-[400px!important]"
              @click="toggle"
            >
              <v-img
                cover
                class="h-full rounded-lg max-h-[400px!important]"
                :src="banner.bannerPath"
                :alt="banner.bannerName"
              >
                <v-scale-transition>
                  <v-icon
                    v-if="active"
                    color="white"
                    size="48"
                    @click="removeBannerFiles(banner.bannerId)"
                    >mdi-close-circle-outline</v-icon
                  >
                </v-scale-transition>
                <template v-slot:placeholder>
                  <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                  >
                    <v-progress-circular
                      indeterminate
                      color="#ff6b81"
                    ></v-progress-circular>
                  </v-row>
                </template>
              </v-img>
            </v-card>
          </v-slide-item>
        </v-slide-group>
      </v-col>

      <input
        id="fileInput"
        ref="fileInput"
        type="file"
        accept="image/png, image/jpeg"
        @change="uploadFile"
        style="display: none"
        multiple
      />
    </v-row>

    <v-row dense>
      <v-col cols="12">
        <label class="text-xl font-bold">ตัวอย่างรูปภาพ</label>
        <v-slide-group class="mt-3" v-if="files_preview" center-active>
          <v-slide-item
            v-for="(banner, index) in files_preview"
            :key="index"
            v-slot="{ active, toggle }"
          >
            <v-card
              :class="active ? '' : ''"
              class="ma-1 rounded-lg card-package-size max-h-[400px!important]"
              @click="toggle"
            >
              <v-img
                cover
                class="h-full rounded-lg max-h-[400px!important]"
                :src="banner"
              >
                <v-scale-transition>
                  <v-icon
                    @click="removeBannerFilesPreview(index)"
                    v-if="active"
                    color="white"
                    size="48"
                    >mdi-close-circle-outline</v-icon
                  >
                </v-scale-transition>
              </v-img>
            </v-card>
          </v-slide-item>
        </v-slide-group>
        <v-alert
          v-if="files_preview.length === 0"
          outlined
          color="#ff6b81"
          border="left"
          class="mt-3"
        >
          ไม่มีรูปตัวอย่าง <br />
          <span class="font-weight-bold">คำแนะนำ</span> : ควรอัปโหลดรูปที่มีขนาด
          1024 x 576 (16:9)
        </v-alert>
      </v-col>
    </v-row>
    <v-row dense class="float-right">
      <v-col cols="12">
        <v-btn
          :loading="loading"
          :disabled="files_preview.length > 0 && disabled ? false : true"
          @click="insertBannerList()"
          color="success"
          >บันทึก</v-btn
        >
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { CheckFileSizeV2, CheckFileSizeType } from "@/functions/functions";
import Swal from "sweetalert2";
export default {
  components: {},
  data() {
    return {
      files_input: [],
      files_preview: [],
      loading: false,
      disabled: false,
    };
  },
  beforeMount() {
    this.GetBannerList();
  },
  methods: {
    ...mapActions({
      GetBannerList: "BannerModules/GetBannerList",
      GetInsertBannerList: "BannerModules/GetInsertBannerList",
      GetDeleteBannerList: "BannerModules/GetDeleteBannerList",
    }),

    openFileSelector() {
      this.$refs.fileInput.click();
    },

    uploadFile(event) {
      if (!this.$refs.fileInput.files) return;

      for (let i = 0; i < this.$refs.fileInput.files.length; i++) {
        const file = this.$refs.fileInput.files[i];
        this.files_input.push(this.$refs.fileInput.files[i]);
        if (!CheckFileSizeType(file, event.target.id)) return;
        if (CheckFileSizeV2(file, event.target.id)) {
          const reader = new FileReader();
          reader.onload = () => {
            this.files_preview.push(reader.result);
          };
          reader.readAsDataURL(file);
        }
      }
      this.disabled = true;
    },

    async insertBannerList() {
      Swal.fire({
        icon: "question",
        text: "คุณต้องการเพิ่มแบนเนอร์ใช่หรือไม่",
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: "ตกลง",
        cancelButtonText: "ยกเลิก",
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.loading = true;
          this.disabled = false;
          let bodyFormData = new FormData();

          const payload = {
            bannerName: null,
          };
          bodyFormData.append("payload", JSON.stringify(payload));

          if (this.files_input.length > 0) {
            for await (const banner of this.files_input) {
              bodyFormData.append(`img_url`, banner);
            }
            await this.GetInsertBannerList(bodyFormData);
          }
          this.files_preview = [];
          this.files_input = [];
          this.loading = false;
          document.getElementById("fileInput").value = "";

          Swal.fire({
            icon: "success",
            text: "เพิ่มแบนเนอร์สำเร็จ",
            showDenyButton: false,
            showCancelButton: false,
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
          });
        }
      });
    },

    removeBannerFilesPreview(index) {
      this.files_preview.splice(index, 1);
      this.files_input.splice(index, 1);
    },

    async removeBannerFiles(id) {
      Swal.fire({
        icon: "question",
        text: "คุณต้องการลบแบรนเนอร์ใช่หรือไม่",
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: "ตกลง",
        cancelButtonText: "ยกเลิก",
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.GetDeleteBannerList(id);
          document.getElementById("fileInput").value = "";

          Swal.fire({
            icon: "success",
            text: "ลบแบรนเนอร์สำเร็จ",
            showDenyButton: false,
            showCancelButton: false,
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
          });
        }
      });
    },
  },
  computed: {
    ...mapGetters({
      banner_list: "BannerModules/getBannerList",
    }),
  },
};
</script>
<style scoped>
.card-package-size {
  width: 400px;
  height: 200px;
}
.line-card-package {
  width: 218px;
  height: 4px;
  background: linear-gradient(141.48deg, #ff6b81 14.35%, #fdcb6e 85.47%);
}
</style>

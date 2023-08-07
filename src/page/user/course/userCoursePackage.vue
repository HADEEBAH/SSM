<template>
  <v-app>
    {{ SetFunction }}
    <v-container>
      <ImgCard color="#FEFBFC" outlined class="mb-3">
        <template v-slot:img>
          <v-img
            contain
            class="rounded-lg"
            :src="
              course_data.course_img || course_data.course_img !== ''
                ? course_data.course_img
                : require(`@/assets/course/default_course_img.svg`)
            "
            max-height="140"
            max-width="140"
          >
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular
                  indeterminate
                  color="#ff6b81"
                ></v-progress-circular>
              </v-row> </template
          ></v-img>
        </template>
        <template v-slot:header>
          <div class="text-md font-bold">
            {{ `${course_data.course_name_th}(${course_data.course_name_en})` }}
          </div>
          <div class="text-sm">{{ course_data.location }}</div>
        </template>
        <template v-slot:detail>
          <v-row dense>
            <v-col cols="12" sm="6" class="pa-0">
              <rowData mini col_detail="8" icon="mdi-clock-outline">
                {{ course_data.course_hours }} ชม. / ครั้ง</rowData
              >
            </v-col>
            <!-- <v-col cols="12" sm="6"  class="pa-0"> 
                        <rowData mini col_detail="5" icon="mdi-account-group-outline">9 / 15 ที่นั่ง</rowData> 
                    </v-col> -->
          </v-row>
        </template>
      </ImgCard>
      <v-row dense>
        <v-col cols="12" class="text-lg font-bold">เลือกแพ็กเกจ</v-col>
      </v-row>
      <v-row dense class="d-flex align-center">
        <v-col cols="8" sm class="text-sm text-[#ff6b81]"
          >*มีสิทธิ์พิเศษสำหรับการสมัครรายเดือน / รายเทอม / รายปี</v-col
        >
        <v-col cols="auto" sm="auto">
          <v-btn
            color="#F9B320"
            :disabled="!course_data.course_img_privilege"
            @click="show_dialog_privilege = true"
            class="white--text rounded-xl"
            depressed
            >ดูสิทธิ์พิเศษ</v-btn
          >
        </v-col>
      </v-row>

      <!-- BUTTON -->
      <v-row dense>
        <v-col
          cols="12"
          sm="auto"
          v-for="(package_course, package_index) in course_data.packages"
          :key="package_index"
        >
          <v-btn
            dense
            depressed
            class="w-full"
            :color="
              selected_package.package_id === package_course.package_id
                ? '#ff6b81'
                : '#F5F5F5'
            "
            :class="
              selected_package.package_id === package_course.package_id
                ? 'white--text'
                : 'text-[#B3B3B3]'
            "
            @click="selected_package = package_course"
          >
            {{ package_course.package }}
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col>{{
          `${selected_package.package} 1 :${selected_package.students}`
        }}</v-col>
      </v-row>
      <v-slide-group center-active>
        <v-slide-item
          v-for="(option, option_index) in selected_package.options"
          :key="option_index"
          v-slot="{ active, toggle }"
        >
          <v-card
            outlined
            :class="active ? '' : ''"
            class="ma-4 card-package-size"
            @click="toggle"
          >
            <v-card-text align="center">
              <v-row dense>
                <v-col class="text-lg font-bold"
                  >{{ `${option.option_name}(${option.amount}ครั้ง)` }}
                </v-col>
              </v-row>
              <v-row dense>
                <v-col><div class="line-card-package"></div></v-col>
              </v-row>
              <v-row dense v-if="!option.discount">
                <v-col class="text-lg font-bold">
                  <span class="text-5xl font-black">{{
                    option.total_price.toLocaleString()
                  }}</span>
                  บาท
                </v-col>
              </v-row>
              <v-row dense v-else>
                <v-col class="text-lg font-bold">
                  <span class="text-md line-through font-black">{{
                    option.total_price.toLocaleString()
                  }}</span>
                  <span class="text-5xl red--text font-black">{{
                    option.net_price.toLocaleString()
                  }}</span>
                  บาท
                </v-col>
              </v-row>
              <v-row dense>
                <v-col class="text-sm">
                  {{ option.privilege.slice(0, 30).trim() }}
                  <span v-if="option.privilege.length > 30">...</span>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-text align="center">
              <v-row
                dense
                v-if="
                  course_artwork.length > 0 && course_artwork[0].attachmentUrl
                "
                @click="show_dialog_artwork = true"
              >
                <v-col class="text-sm underline text-[#0076D6]">
                  ดูเพิ่มเติม
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions class="absolute inset-x-0 bottom-0">
              <v-row dense>
                <v-col cols="12">
                  <v-btn
                    :disabled="option.net_price < 0"
                    depressed
                    class="w-full font-bold white--text"
                    color="#ff6b81"
                    @click="selectedPackage(option)"
                    >สมัครเรียน</v-btn
                  >
                </v-col>
              </v-row>
            </v-card-actions>
          </v-card>
        </v-slide-item>
      </v-slide-group>
      <!-- DIALOG :: PRIVILEGE -->
      <v-dialog
        v-if="show_dialog_privilege"
        v-model="show_dialog_privilege"
        persistent
        :width="$vuetify.breakpoint.smAndUp ? '50vw' : ''"
      >
        <v-card>
          <v-card-title>
            <v-row>
              <v-col class="font-bold w-3">สิทธิ์พิเศษ</v-col>
              <v-col cols="auto" align="right">
                <v-btn icon @click="show_dialog_privilege = false"
                  ><v-icon color="#ff6b81">mdi-close</v-icon></v-btn
                >
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-text>
            <v-img
              contain
              max-height="600"
              max-width="800"
              :src="course_data.course_img_privilege"
            >
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular
                    indeterminate
                    color="#ff6b81"
                  ></v-progress-circular>
                </v-row> </template
            ></v-img>
          </v-card-text>
          <!-- <v-card-actions>
                    <v-row dense>
                        <v-col align="center"><v-btn @click="show_dialog_privilege = false" class="btn-size-lg" dark depressed color="#ff6b81">Close</v-btn></v-col>
                    </v-row>
                </v-card-actions> -->
        </v-card>
      </v-dialog>
      <!-- DIALOG :: ARTWORK -->
      <v-dialog
        v-if="show_dialog_artwork"
        v-model="show_dialog_artwork"
        persistent
        :width="$vuetify.breakpoint.smAndUp ? '60vw' : ''"
      >
        <v-card class="pa-2">
          <v-row dense>
            <v-col cols="12" align="right">
              <v-btn icon @click="show_dialog_artwork = false"
                ><v-icon color="#ff6b81">mdi-close</v-icon></v-btn
              >
            </v-col>
          </v-row>
          <v-card-title>
            <v-row dense>
              <v-col cols="12" align="center" class="font-bold w-3">
                Learning Journey
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col
                cols="12"
                :sm="course_artwork.length > '3' ? '4' : ''"
                v-for="(artwork, index) in course_artwork"
                :key="`${index}-artwork`"
                class="webkit-center"
              >
                <v-img
                  @click="SelectedImg(artwork.attachmentUrl)"
                  :src="artwork.attachmentUrl"
                  aspect-ratio="1"
                  class="bg-grey-lighten-2 cursor-pointer"
                  cover
                  width="350px"
                  height="300px"
                >
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
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>

      <v-dialog
        v-model="show_full_img"
        persistent
        :width="$vuetify.breakpoint.smAndUp ? `60vw` : ''"
      >
        <v-card>
          <v-container>
            <v-row dense class="absolute right-1 top-1">
              <v-col cols="12">
                <v-btn icon @click="CloseImgFull()"
                  ><v-icon color="#ff6b81">mdi-close</v-icon></v-btn
                >
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" class="webkit-center">
                <v-img
                  :src="img_selected"
                  aspect-ratio="1"
                  contain
                  max-width="500px"
                  class="bg-grey-lighten-2"
                >
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
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-dialog>
    </v-container>
  </v-app>
</template>

<script>
import ImgCard from "@/components/course/imgCard.vue";
import rowData from "@/components/label/rowData.vue";
import { mapGetters, mapActions } from "vuex";
export default {
  name: "userCourseDetail",
  components: { ImgCard, rowData },
  data: () => ({
    show_dialog_artwork: false,
    show_dialog_privilege: false,
    selected_package: {},
    show_full_img: false,
    img_selected: "",
  }),
  created() {
    this.order_data = JSON.parse(localStorage.getItem("Order"));
  },
  mounted() {
    this.changeCourseOrderData(this.order_data);
    this.GetCourse(this.$route.params.course_id);
    this.$store.dispatch("NavberUserModules/changeTitleNavber", "แพ็กเกจ");
    if (this.course_data) {
      this.selected_package = this.course_data.packages[0];
    }
  },
  watch: {},
  computed: {
    ...mapGetters({
      course_data: "CourseModules/getCourseData",
      course_order: "OrderModules/getCourseOrder",
      order: "OrderModules/getOrder",
      course_artwork: "CourseModules/getCourseArtwork",
    }),
    SetFunction() {
      this.GetArtworkByCourse({ course_id: this.$route.params.course_id });
      return "";
    },
  },
  methods: {
    ...mapActions({
      GetCourse: "CourseModules/GetCourse",
      changeCourseOrderData: "OrderModules/changeCourseOrderData",
      changeOrderData: "OrderModules/changeOrderData",
      GetArtworkByCourse: "CourseModules/GetArtworkByCourse",
    }),
    SelectedImg(img) {
      this.img_selected = img;
      this.show_full_img = true;
    },
    CloseImgFull() {
      this.img_selected = "";
      this.show_full_img = false;
    },
    selectedPackage(option) {
      // // console.log("Options :", option);
      // // console.log("Select :", this.selected_package);
      this.course_order.option = option;
      this.course_order.price = option.total_price;
      this.course_order.time_count = option.amount;
      this.course_order.package = this.selected_package.package;
      this.course_order.package_data = this.selected_package;
      this.course_order.apply_for_yourself = false;
      this.course_order.apply_for_others = false;
      this.course_order.times_in_class = 0;
      this.course_order.day = "";
      this.course_order.time = "";
      this.course_order.coach = "";
      this.course_order.start_day = "";
      this.course_order.price = 0;
      this.course_order.detail = "";
      this.course_order.remark = "";
      this.course_order.selected = true;
      this.course_order.parents = [];
      this.course_order.students = [];
      this.order.order_step = 1;
      this.changeCourseOrderData(this.course_order);
      this.changeOrderData(this.order);
      localStorage.setItem("Order", JSON.stringify(this.course_order));
      this.$router.push({ name: "userCourseOrder" });
    },
  },
};
</script>
<style scoped>
.card-package-size {
  height: 380px;
  width: 254px;
  border-radius: 8px;
}
.line-card-package {
  width: 218px;
  height: 4px;
  background: linear-gradient(141.48deg, #ff6b81 14.35%, #fdcb6e 85.47%);
}
.gallery {
  margin: 5px;
  float: left;
  width: 350px;
}

.gallery img {
  width: 100%;
  height: auto;
}

.webkit-center {
  text-align: -webkit-center;
}
</style>

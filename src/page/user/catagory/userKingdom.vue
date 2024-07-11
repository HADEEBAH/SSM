<template>
  <v-app
    class="overflow-x-hidden overflow-y-hidden bg-kingdom"
    :style="
      MobileSize ? `background-size: contain;` : `background-size: cover;`
    "
  >
    {{ setFunctions }}
    <v-card ref="banner_bar" class="mb-3" flat tile>
      <v-window show-arrows>
        <template #next="{ on, attrs }">
          <v-btn
            class="bg-[#fff] btn-slide"
            color="#FF7518"
            icon
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </template>
        <template #prev="{ on, attrs }">
          <v-btn
            class="bg-[#fff] btn-slide"
            color="#FF7518"
            icon
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
        </template>
        <v-window-item v-for="(slide, i) in banner_list" :key="i">
          <v-img
            cover
            :height="BannerHeight"
            max-width="1920px"
            :src="slide.bannerPath"
          ></v-img>
        </v-window-item>
      </v-window>
    </v-card>
    <v-container ref="hello">
      <v-row class="row mb-3">
        <v-col cols="12">
          <div class="text-2xl font-bold text-white">
            {{ $t("hello") }}
            {{
              profile_detail.firstNameTh
                ? $i18n.locale == "th"
                  ? ", " + profile_detail.firstNameTh
                  : ", " + profile_detail.firstNameEng
                : ""
            }}
          </div>
        </v-col>
      </v-row>
      <v-card class="rounded-xl pa-2">
        <v-card-text>
          <v-row ref="filter_bar">
            <v-col
              cols="12"
              sm="4"
              class="text-2xl align-self-center font-weight-bold"
            >
              {{ $t("warraphat learning sphere") }}
            </v-col>
            <v-col cols="12" sm="8" style="text-align: -webkit-right">
              <v-text-field
                v-model="search_kingdom"
                :class="`bg-white rounded-full ${
                  !MobileSize ? 'w-2/5' : 'w-full'
                } `"
                hide-details
                dense
                outlined
                color="#ff6b81"
                :label="$t('find the learning wls that interests you here')"
                prepend-inner-icon="mdi-magnify"
              />
            </v-col>
          </v-row>
          <v-row ref="category_list">
            <v-col
              cols="6"
              md="3"
              sm="6"
              class="pa-1 mb-3 d-flex justify-center"
              v-for="(item, index_item) in searchKingdom(search_kingdom)"
              :key="index_item"
            >
              <categoryCardVue :category="item"></categoryCardVue>
            </v-col>
            <v-col
              cols="12"
              v-if="searchKingdom(search_kingdom)?.length === 0"
              class="font-weight-bold text-center text-xl"
            >
              {{ $t("wls not found") }}
            </v-col>
          </v-row>
          <v-row v-if="isDataReceived">
            <v-col cols="12" align="center">
              <v-progress-circular
                indeterminate
                color="#ff6b81"
                size="50"
              ></v-progress-circular>
            </v-col>
          </v-row>
          <loading-overlay :loading="categorys_is_loading"></loading-overlay>
        </v-card-text>
      </v-card>
    </v-container>
  </v-app>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import loadingOverlay from "@/components/loading/loadingOverlay.vue";
import categoryCardVue from "@/components/card/categoryCard.vue";
export default {
  components: {
    loadingOverlay,
    categoryCardVue,
  },
  data: () => ({
    showCategorys: [],
    imgurl: "categoryImg",
    defaultImageUrl:
      "https://cdn.vectorstock.com/i/preview-1x/82/99/no-image-available-like-missing-picture-vector-43938299.jpg",
    search: "",
    showData: false,
    first_name_en: "",
    drawer: true,
    user_detail: null,
    slides: [
      {
        src: "https://5.imimg.com/data5/SELLER/Default/2022/5/LE/OI/YW/151848745/school-banner-designing-service-1000x1000.png",
      },
      {
        src: "https://5.imimg.com/data5/SELLER/Default/2022/5/BV/SM/WD/151848745/school-banner-designing-service-1000x1000.png",
      },
      {
        src: "https://marketplace.canva.com/EAE_Jn0OgPs/1/0/1600w/canva-white-back-to-school-banner-landscape-KeLgY-6EvN8.jpg",
      },
    ],
    dataStorage: {},
    userDetail: false,
    search_kingdom: "",
    data_search_kingdom: [],
    item_data: "",
    showingFullText: false,
    isLoading: true,
    isStopLoading: false,
    scrollTop: 0,
    countDatePerPage: 0,
    isDataReceived: false,
    waitingProcess: false,
    sameHistoryLength: false,
  }),

  async created() {
    this.dataStorage = JSON.parse(localStorage.getItem("userDetail"));
    if (this.dataStorage) {
      await this.GetAll(this.dataStorage.account_id);
      await this.GetBannerList();
    }
    localStorage.removeItem("Order");
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
    this.$store.dispatch(
      "NavberUserModules/changeTitleNavber",
      "warraphat learning sphere"
    );
    this.$store.dispatch("CategoryModules/GetCategoryCourse", {
      limit: 12,
      page: 1,
    });
  },

  methods: {
    ...mapActions({
      GetCategoryCourse: "CategoryModules/GetCategoryCourse",
      changeCourseOrderData: "OrderModules/changeCourseOrderData",
      GetAll: "ProfileModules/GetAll",
      GetProfileDetail: "ProfileModules/GetProfileDetail",
      logOut: "loginModules/logOut",
      GetBannerList: "BannerModules/GetBannerList",
    }),
    handleScroll() {
      this.scrollTop = window.scrollY; // ตัวเลขเมื่อ scroll ตัวเลขเริ่มนับจากบนสุด = 0
      let hello = this.$refs.hello?.clientHeight; // ค่ามาจาก ref filter
      let device = document.body.offsetHeight - (56 + hello); // ค่าของหน้าจอ device
      let countA = this.scrollTop + device;
      if (countA >= 0 && !this.sameHistoryLength) {
        this.loadMoreData();
      }
      if (countA < hello) {
        this.sameHistoryLength = false;
      }
    },

    async loadMoreData() {
      this.countDatePerPage = this.category_list?.length;

      if (!this.isDataReceived) {
        this.isDataReceived = true;

        if (!this.waitingProcess) {
          this.waitingProcess = true;

          await this.GetCategoryCourse({
            account_id: this.user_login?.account_id,
            limit: this.category_option.limit,
            page: this.category_option.page + 1,
          });

          this.isDataReceived = false;
          this.waitingProcess = false;

          if (this.category_list?.length === this.countDatePerPage) {
            this.sameHistoryLength = true;
          } else {
            this.sameHistoryLength = false;
          }
        }
      }
    },

    height() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return 240;
        case "sm":
          return 320;
        case "md":
          return 400;
        case "lg":
          return 480;
        case "xl":
          return 560;
      }
    },
    selectedCategory(category) {
      this.course_order.kingdom = category.categoryNameTh;
      this.course_order.category_id = category.categoryId;
      this.changeCourseOrderData(this.course_order);
      localStorage.setItem("Order", JSON.stringify(this.course_order));
      this.$router.push({
        name: "userCourseList_categoryId",
        params: { category_id: category.categoryId },
      });
    },
    searchKingdom(val) {
      if (val) {
        return this.categorys.filter(
          (v) =>
            v.categoryNameTh.indexOf(val) !== -1 ||
            v.categoryNameEng.toLowerCase().indexOf(val.toLowerCase()) !== -1
        );
      } else {
        return this.categorys;
      }
    },
    showImg(item) {
      return `${process.env.VUE_APP_URL}/api/v1/files/${item}`;
    },
  },

  computed: {
    ...mapGetters({
      category_option: "CategoryModules/getCategoryOption",
      course_order: "OrderModules/getCourseOrder",
      categorys: "CategoryModules/getCategorys",
      categorys_is_loading: "CategoryModules/getCategorysIsLoading",
      profile_user: "ProfileModules/getProfileUser",
      profile_detail: "ProfileModules/getProfileDetail",
      banner_list: "BannerModules/getBannerList",
    }),
    BannerHeight() {
      if (this.$vuetify.breakpoint.mdAndUp) {
        return 480;
      } else {
        return 320;
      }
    },
    setFunctions() {
      if (this.dataStorage) {
        this.GetProfileDetail(this.dataStorage.account_id);
      }

      return "";
    },
    MobileSize() {
      const { xs } = this.$vuetify.breakpoint;
      return !!xs;
    },
    IpadSize() {
      const { sm } = this.$vuetify.breakpoint;
      return !!sm;
    },
  },
};
</script>

<style scoped>
.bottomimg {
  margin-top: -40px;
  background-position: "center";
  background-repeat: "no-repeat";
  background-size: "cover";
  padding-top: 68px;
}

.text_field_pc {
  margin-top: 50px;
}

/* Hide scrollbar for Chrome, Safari and Opera */
/* .example::-webkit-scrollbar {
  display: none;
} */

/* Hide scrollbar for IE, Edge and Firefox */
.example {
  -ms-overflow-style: none;
  /* IE and Edge */
  scrollbar-width: none;
  /* Firefox */
}

/* .item {
  width: 300px;
  min-height: 120px;
  max-height: auto;
  float: left;
  margin: 3px;
  padding: 3px;
} */

.bg-kingdom {
  background-image: url("@/assets/userKingdom/kingdom_bg_img.svg");
  background-position: top;
  background-repeat: no-repeat;
  /* background-size: contain; */
}

/* .banner-container {
  position: relative;
  width: auto;
  height: 500px;
  overflow: hidden;
}

.banner-container img {
  position: absolute;
  top: 50%;
  left: 50%;
  min-height: 100%;
  min-width: 100%;
  transform: translate(-50%, -50%);
} */
.box-shadows {
  box-shadow: 0 1px 1px -2px rgb(90 126 241 / 20%),
    0 2px 2px 0 rgb(54 176 255 / 14%), 0 4px 16px 0 rgb(90 102 255 / 12%) !important;
}

.slider-container {
  width: 300px;
  height: 300px;
}

.slider-container-pc {
  width: 100px;
  height: 100px;
}

.slider-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>

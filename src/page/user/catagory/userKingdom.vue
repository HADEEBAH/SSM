<template>
  <!--  -->
  <v-app
    class="overflow-x-hidden overflow-y-hidden bg-kingdom"
    :style="
      MobileSize ? `background-size: contain;` : `background-size: cover;`
    "
  >
    <v-container fluid class="my-5">
      {{ setFunctions }}
      <v-row class="row">
        <v-col cols="12">
          <div class="text-2xl font-bold text-white">
            <!-- สวัสดี, {{ dataStorage ? dataStorage.first_name_th : "" }} -->
            สวัสดี
            {{
              profile_detail.firstNameTh ? "," + profile_detail.firstNameTh : ""
            }}
          </div>
        </v-col>
      </v-row>
    </v-container>

    <v-card
      class="rounded-xl pa-2"
      :style="
        !MobileSize
          ? {
              'border-bottom-right-radius': '0px !important',
              'border-bottom-left-radius': '0px !important',
            }
          : ''
      "
    >
      <v-carousel
        class="rounded-xl max-w-[1920px!important] max-h-[1080px!important]"
        cycle
        height="auto"
        hide-delimiter-background
        hide-delimiters
      >
        <v-carousel-item
          v-for="(slide, i) in banner_list"
          :key="i"
        class="max-w-[1920px] max-h-[1080px]"
          

        >
        <v-img
        :src="slide.bannerPath"
        :aspect-ratio="16 / 9"
        class="max-w-[1920px] max-h-[1080px]"
        >

        </v-img>
        </v-carousel-item>
      </v-carousel>
      <v-card-text>
        <v-row>
          <v-col
            cols="12"
            sm="4"
            class="text-2xl align-self-center font-weight-bold"
          >
            อาณาจักร
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
              label="ค้นหาอาณาจักรการเรียนรู้ที่คุณสนใจได้ที่นี้"
              prepend-inner-icon="mdi-magnify"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col
            cols="6"
            md="4"
            sm="6"
            class="pa-1"
            v-for="(item, index_item) in searchKingdom(search_kingdom)"
            :key="index_item"
          >
            <v-card class="h-full rounded-lg box-shadows">
              <!-- :src="item.categoryImg && item.categoryImg !== null ? showImg(item.categoryImg) : defaultImageUrl" -->
              <v-img
                @click="selectedCategory(item)"
                :aspect-ratio="16 / 9"
                :src="
                  item.categoryImg && item.categoryImg !== ''
                    ? item.categoryImg
                    : require('@/assets/userKingdom/default_category_img.svg')
                "
                class="cursor-pointer"
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
              <v-card-title
                :class="$vuetify.breakpoint.smAndUp ? 'text-md' : 'text-sm'"
                class="font-bold cursor-pointer"
                @click="selectedCategory(item)"
              >
                {{ item.categoryNameTh }}
                ({{ item.categoryNameEng }})
              </v-card-title>

              <v-card-subtitle>
                <div class="mb-2">โดย {{ item.taughtBy }}</div>
                <div>
                  {{
                    item.show
                      ? `${item.categoryDescription}`
                      : `${item.categoryDescription.slice(0, 15).trim()}`
                  }}
                  <span
                    v-if="item.categoryDescription.length > 15"
                    class="text-red-500 cursor-pointer"
                    @click="item.show = !item.show"
                    >{{ item.show ? `น้อยลง` : `อ่านต่อ...` }}</span
                  >
                </div>
              </v-card-subtitle>
            </v-card>
          </v-col>
          <v-col
            cols="12"
            v-if="searchKingdom(search_kingdom).length === 0"
            class="font-weight-bold text-center text-xl"
          >
            ไม่พบอาณาจักร
          </v-col>
        </v-row>
        <loading-overlay :loading="categorys_is_loading"></loading-overlay>
      </v-card-text>
    </v-card>
  </v-app>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import loadingOverlay from "../../../components/loading/loadingOverlay.vue";
export default {
  components: {
    loadingOverlay,
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
    items: [
      { id: 1, itemName: "อาณาจักรศิลปะสมัยใหม่" },
      { id: 2, itemName: "อาณาจักรศิลปะสมัยใหม่" },
      { id: 3, itemName: "อาณาจักรศิลปะสมัยใหม่" },
      { id: 4, itemName: "อาณาจักรศิลปะสมัยใหม่" },
      { id: 5, itemName: "อาณาจักรศิลปะสมัยใหม่" },
      { id: 6, itemName: "อาณาจักรศิลปะสมัยใหม่" },
      { id: 7, itemName: "อาณาจักรศิลปะสมัยใหม่" },
      { id: 8, itemName: "อาณาจักรศิลปะสมัยใหม่" },
      { id: 9, itemName: "อาณาจักรศิลปะสมัยใหม่" },
    ],
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
    body: "I am some text! Instead of being on the data object, though, I would be pulled from the store.",
  }),

  created() {
    this.dataStorage = JSON.parse(localStorage.getItem("userDetail"));
    if (this.dataStorage) {
      this.GetAll(this.dataStorage.account_id);
    }
    localStorage.removeItem("Order");
  },

  beforeMount() {
    this.GetBannerList();
  },

  mounted() {
    this.$store.dispatch("NavberUserModules/changeTitleNavber", "อาณาจักร");
  },

  methods: {
    ...mapActions({
      changeCourseOrderData: "OrderModules/changeCourseOrderData",
      createKingdom: "OrderModules/createKingdom",
      GetAll: "ProfileModules/GetAll",
      GetProfileDetail: "ProfileModules/GetProfileDetail",
      logOut: "loginModules/logOut",
      GetBannerList: "BannerModules/GetBannerList",
    }),
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
      course_order: "OrderModules/getCourseOrder",
      categorys: "CategoryModules/getCategorys",
      categorys_is_loading: "CategoryModules/getCategorysIsLoading",
      profile_user: "ProfileModules/getProfileUser",
      profile_detail: "ProfileModules/getProfileDetail",
      banner_list: "BannerModules/getBannerList",
    }),
    setFunctions() {
      this.$store.dispatch("CategoryModules/GetCategoryCourse");
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
  background-image: url("../../../assets/userKingdom/kingdom_bg_img.svg");
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


<template>
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
            <!-- {{ profile_detail }} -->
            <!-- สวัสดี, {{ dataStorage ? dataStorage.first_name_th : "" }} -->
            สวัสดี, {{ profile_detail ? profile_detail.firstNameTh : "" }}
          </div>
        </v-col>
      </v-row>
    </v-container>
    <v-card class="rounded-xl">
      <v-card
        class="mx-auto block rounded-xl drop-shadow-lg mt-3 ml-3 mr-3 banner-container"
      >
        <template>
          <v-carousel cycle hide-delimiter-background>
            <v-carousel-item
              v-for="(slide, i) in slides"
              :key="i"
              :src="slide.src"
              cover
            ></v-carousel-item>
          </v-carousel>
        </template>
      </v-card>

      <v-container fluid>
        <v-row>
          <v-col
            cols="12"
            sm="2"
            class="text-2xl align-self-center font-weight-bold"
          >
            อาณาจักร
          </v-col>
          <v-col cols="12" sm="10" style="text-align: -webkit-right">
            <v-text-field
              @keyup="searchKingdom()"
              v-model="search_kingdom"
              :class="`bg-white rounded-xl ${
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
        <!-- <pre>{{ categorys }}</pre> -->
        <v-row>
          <v-col
            cols="6"
            md="4"
            sm="6"
            class="pa-2"
            v-for="item in search_kingdom !== ''
              ? data_search_kingdom
              : categorys"
            :key="item.id"
          >
            <v-card class="h-full block drop-shadow-lg">
              <!-- :src="item.categoryImg && item.categoryImg !== null ? showImg(item.categoryImg) : defaultImageUrl" -->

              <v-img
                v-if="item.categoryImg && item.categoryImg !== null"
                @click="selectedCategory(item)"
                contain
                height="180"
                :src="showImg(item.categoryImg)"
              ></v-img>
              <v-img
                v-else
                @click="selectedCategory(item)"
                contain
                src="../../../assets/userKingdom/category_img.svg"
                height="180"
              ></v-img>
              <v-card-title
                :class="$vuetify.breakpoint.smAndUp ? 'text-md' : 'text-sm'"
                class="font-bold"
              >
                {{ item.categoryNameTh }}
              </v-card-title>

              <v-card-subtitle>
                <div class="my-5">
                  โดย {{ item.taughtBy }}
                  <!-- <span class="text-red-500 cursor-pointer">อ่านต่อ...</span> -->
                </div>
                <!-- <div>
                  {{ item.categoryDescription }}
                </div> -->

                <!-- <div v-for="(item, index) in items" :key="index">
  <h2>{{ item.title }}</h2>
  <p>{{ showFullContent[index] ? item.content : item.content.slice(0, 100) }}</p>
  <button @click="showFullContent[index] = !showFullContent[index]">
    {{ showFullContent[index] ? 'Read less' : 'Read more' }}
  </button>
</div> -->
              </v-card-subtitle>
            </v-card>
          </v-col>
          <v-col
            cols="12"
            v-if="
              (search_kingdom !== '' && data_search_kingdom.length === 0) ||
              categorys.length === 0
            "
            class="font-weight-bold text-center text-xl"
          >
            ไม่พบอาณาจักร
          </v-col>
        </v-row>
        <loading-overlay :loading="categorys_is_loading"></loading-overlay>
      </v-container>
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
  }),
  created() {
    this.dataStorage = JSON.parse(localStorage.getItem("userDetail"));
    if (this.dataStorage) {
      console.log("this.dataStorage created", this.dataStorage);
      this.GetAll(this.dataStorage.account_id);
    }
    localStorage.removeItem("Order");
    localStorage.setItem("Order", JSON.stringify(this.course_order));
  },

  mounted() {
    this.$store.dispatch("NavberUserModules/changeTitleNavber", "อาณาจักร");
    document.getElementById("read-more").addEventListener("click", function () {
      document.getElementById("long-text").style.display = "block";
    });
  },

  methods: {
    ...mapActions({
      changeCourseOrderData: "OrderModules/changeCourseOrderData",
      createKingdom: "OrderModules/createKingdom",
      GetAll: "ProfileModules/GetAll",
      GetProfileDetail: "ProfileModules/GetProfileDetail",
      logOut: "loginModules/logOut",
    }),

    selectedCategory(category) {
      console.log("category", category);
      this.course_order.kingdom = category.categoryNameTh;
      this.course_order.category_id = category.categoryId;
      this.changeCourseOrderData(this.course_order);
      localStorage.setItem("Order", JSON.stringify(this.course_order));
      this.$router.push({
        name: "userCourseList_categoryId",
        params: { category_id: category.categoryId },
      });
    },
    showImg(item) {
      return `${process.env.VUE_APP_URL}/api/v1/files/${item}`;
    },
    searchKingdom() {
      this.data_search_kingdom = this.categorys.filter((val) => {
        if (
          val.categoryNameTh.indexOf(this.search_kingdom) !== -1 ||
          val.categoryNameEng
            .toLowerCase()
            .indexOf(this.search_kingdom.toLowerCase()) !== -1
        ) {
          return val;
        }
      });
    },
    shortenedText(detail) {
      console.log("detail", detail);
      // for (const item_data of this.categorys) {
      //   console.log("item_data", item_data);
      //   console.log("category", item_data.categoryDescription);
      // }

      return this.detail.slice(0, 10);
    },
  },

  computed: {
    ...mapGetters({
      course_order: "OrderModules/getCourseOrder",
      categorys: "CategoryModules/getCategorys",
      categorys_is_loading: "CategoryModules/getCategorysIsLoading",
      profile_user: "ProfileModules/getProfileUser",
      profile_detail: "ProfileModules/getProfileDetail",
    }),
    setFunctions() {
      this.$store.dispatch("CategoryModules/GetCategoryCourse");
      if (this.dataStorage) {
        console.log("this.dataStorage compute", this.dataStorage);
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

    // categoryDescription() {
    //   for (const iterator of this.categorys) {
    //     console.log("object", iterator);
    //   }
    //   if (this.showingFullText) {
    //     return this.body;
    //   }

    //   return `${this.body.slice(0, 20).trim()}...`;
    // },
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
.example::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.example {
  -ms-overflow-style: none;
  /* IE and Edge */
  scrollbar-width: none;
  /* Firefox */
}

.item {
  width: 300px;
  min-height: 120px;
  /* max-height: auto;
    float: left; */
  /* margin: 3px;
    padding: 3px; */
}

.bg-kingdom {
  background-image: url("../../../assets/userKingdom/kingdom_bg_img.svg");
  background-position: top;
  background-repeat: no-repeat;
  /* background-size: contain; */
}

.banner-container {
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
}
</style>
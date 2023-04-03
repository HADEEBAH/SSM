
<template>
  <v-app class="overflow-x-hidden overflow-y-hidden">
    <v-img
      src="../../../assets/navbar_user/kingdomBg.png"
      class="rounded-none bottomimg"
    >
      <div class="text-2xl ml-5 mt-10 font-bold text-white">
        Hello {{ dataStorage ? dataStorage.first_name_en : "" }}
      </div>
      <v-autocomplete
        :class="
          MobileSize
            ? 'mt-14 ml-5 mr-5 bg-white rounded-xl'
            : 'text_field_pc ml-5 mr-5 bg-white rounded-xl'
        "
        hide-details
        dense
        outlined
        label="ค้นหาอณาจักการเรียนรู้ที่คุณสนใจได้ที่นี้"
        suffix="All"
        prepend-inner-icon="mdi-magnify"
        :items="[1, 2, 3, 4]"
      />
      <div></div>
    </v-img>
    <v-card
      :style="
        MobileSize
          ? 'margin-top: -20%; border-radius:  0.75rem;'
          : 'margin-top: -60%; border-radius:  0.75rem;' || IpadSize
          ? 'margin-top: -50%; border-radius:  0.75rem;'
          : ''
      "
    >
      <v-card
        class="mx-auto block rounded-xl drop-shadow-lg mt-3 ml-3 mr-3"
        max-width=""
      >
        <template>
          <v-carousel cycle hide-delimiter-background>
            <v-carousel-item
              height="300px"
              v-for="(slide, i) in slides"
              :key="i"
              :src="slide.src"
              cover
            ></v-carousel-item>
          </v-carousel>
        </template>
      </v-card>
      <headerPage title="อาณาจักร" class="ml-5"></headerPage>

      <v-container fluid grid-list-md>
        <v-row>
          <v-col
            cols="12"
            md="4"
            sm="6"
            v-for="item in categorys"
            :key="item.id"
          >
            <v-card
              class="mx-auto block rounded-xl drop-shadow-lg"
              max-width="344"
              @click="selectedCategory(item)"
            >
              <v-img
                :src="
                  item.categoryImg ? showImg(item.categoryImg) : defaultImageUrl
                "
                height="300px"
              ></v-img>

              <v-card-title>
                {{ item.categoryNameTh }}
              </v-card-title>

              <v-card-subtitle>
                <div>
                  {{ item.categoryNameEng }}
                  <span class="text-red-500 cursor-pointer">อ่านต่อ...</span>
                </div>
              </v-card-subtitle>
            </v-card>
          </v-col>
        </v-row>
        <loading-overlay :loading="categorys_is_loading"></loading-overlay>
      </v-container>
    </v-card>
  </v-app>
</template>
 
<script>
import headerPage from "@/components/header/headerPage.vue";
import { mapActions, mapGetters } from "vuex";
import loadingOverlay from "../../../components/loading/loadingOverlay.vue";
export default {
  components: {
    loadingOverlay,
    headerPage,
  },
  data: () => ({
    imgurl: "categoryImg",
    defaultImageUrl:
      "https://cdn.vectorstock.com/i/preview-1x/82/99/no-image-available-like-missing-picture-vector-43938299.jpg",
    search: "",
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
  }),
  created() {
    this.dataStorage = JSON.parse(localStorage.getItem("userDetail"));
    //console.log("true", this.dataStorage);
    if (this.dataStorage) {
      //console.log("true", this.dataStorage.role);
    } else {
      //console.log("false");
    }
  },

  mounted() {
    this.$store.dispatch("CategoryModules/GetCategoryCourse");
    this.$store.dispatch("NavberUserModules/changeTitleNavber", "อาณาจักร");
  },

  methods: {
    ...mapActions({
      changeCourseOrderData: "OrderModules/changeCourseOrderData",
      createKingdom: "OrderModules/createKingdom",
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
  },

  computed: {
    ...mapGetters({
      course_order: "OrderModules/getCourseOrder",
      categorys: "CategoryModules/getCategorys",
      categorys_is_loading : "CategoryModules/getCategorysIsLoading",
    }),
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
</style>
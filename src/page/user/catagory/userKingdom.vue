
<template>
  
  <v-app class="overflow-x-hidden overflow-y-hidden bg-kingdom" :style="MobileSize ? `background-size: contain;` : `background-size: cover;`">
    <v-container fluid class="my-5">
      <v-row class="row">
        <v-col cols="12">
          <div class="text-2xl font-bold text-white">
            สวัสดี, {{ dataStorage ? dataStorage.first_name_en : "" }}
          </div>
        </v-col>
      </v-row>
    </v-container>
    
    <v-card
    class="rounded-xl"
    >
      <v-card
        class="mx-auto block rounded-xl drop-shadow-lg mt-3 ml-3 mr-3"
        max-width=""
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
          <v-col cols="12" sm="2" class="text-2xl align-self-center font-weight-bold">
            อาณาจักร
          </v-col>
          <v-col cols="12" sm="10" style="text-align: -webkit-right">
            <v-text-field
              @keyup="searchKingdom()"
              v-model="search_kingdom"
              :class="`bg-white rounded-xl ${!MobileSize ? 'w-2/5' : 'w-full'} `"
              hide-details
              dense
              outlined
              label="ค้นหาอาณาจักรการเรียนรู้ที่คุณสนใจได้ที่นี้"
              prepend-inner-icon="mdi-magnify"
            />
          </v-col>
        </v-row>

        <v-row >
          <v-col
            cols="12"
            md="4"
            sm="6"
            v-for="item in (search_kingdom !== '' ? data_search_kingdom : categorys )"
            :key="item.id"
          >
            <v-card  
              class="mx-auto block rounded-xl drop-shadow-lg"
              max-width="344"
              @click="selectedCategory(item)"
            >
              <v-img
                :src="item.categoryImg && item.categoryImg !== null ? showImg(item.categoryImg) : defaultImageUrl"
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
          <v-col cols="12" v-if="search_kingdom !== '' && data_search_kingdom.length === 0 || categorys.length === 0" class="font-weight-bold text-center text-xl">
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
    item_data: ""
  }),
  created() {
    this.dataStorage = JSON.parse(localStorage.getItem("userDetail"));
    //console.log("true", this.dataStorage);
    if (this.dataStorage) {
      //console.log("true", this.dataStorage.role);
    } else {
      //console.log("false");
    }
    this.GetAll(this.dataStorage.account_id);
    for (const item_data of this.profile_user) {
      console.log("itm", item_data);
    }
    this.GetStudentData(this.item_data.student.studentId); 

    localStorage.removeItem("Order")
    localStorage.setItem("Order", JSON.stringify(this.course_order))
  },

  mounted() {
    this.$store.dispatch("CategoryModules/GetCategoryCourse");
    this.$store.dispatch("NavberUserModules/changeTitleNavber", "อาณาจักร");
  },

  methods: {
    ...mapActions({
      changeCourseOrderData: "OrderModules/changeCourseOrderData",
      createKingdom: "OrderModules/createKingdom",
      GetAll: "ProfileModules/GetAll",

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
      this.data_search_kingdom = this.categorys.filter((val)=>{
        if (val.categoryNameTh.indexOf(this.search_kingdom) !== -1 || val.categoryNameEng.toLowerCase().indexOf(this.search_kingdom.toLowerCase()) !== -1 ) {
          return val
        }
      })
    }
  },

  computed: {
    ...mapGetters({
      course_order: "OrderModules/getCourseOrder",
      categorys: "CategoryModules/getCategorys",
      categorys_is_loading: "CategoryModules/getCategorysIsLoading",
      profile_user: "ProfileModules/getProfileUser",
      
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

.bg-kingdom {
  background-image: url("@/assets/kingdom_bg_img.svg");
  background-position: top;
  background-repeat: no-repeat;
  /* background-size: contain; */
}
</style>
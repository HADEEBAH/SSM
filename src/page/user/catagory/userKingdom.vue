
<template>
  <v-app class="overflow-x-hidden overflow-y-hidden" >
      <v-img src="../../../assets/navbar_user/kingdomBg.png" class="rounded-none bottomimg">
        <div class="text-2xl ml-5 mt-10 font-bold text-white">Hello, Sarah</div>
        <v-autocomplete 
        :class="
          MobileSize
            ? 'mt-14 ml-5 mr-5 bg-white rounded-xl'
            : 'text_field_pc ml-5 mr-5 bg-white rounded-xl'
        " hide-details dense outlined label="ค้นหาอณาจักการเรียนรู้ที่คุณสนใจได้ที่นี้" suffix="All"
          prepend-inner-icon="mdi-magnify" :items="[1, 2, 3, 4]" />
        <div></div>
      </v-img>
      <v-card 
      :style="MobileSize? 'margin-top: -20%; border-radius:  0.75rem;' : 'margin-top: -60%; border-radius:  0.75rem;' || IpadSize? 'margin-top: -50%; border-radius:  0.75rem;' : ''">
      <template>
        <v-carousel 
        cycle 
        hide-delimiter-background    
        style="max-width:97%; max-height: 100%; margin-left: 20px; margin-top: 20px; margin-bottom: 10px; border-radius: 0.75rem;">
          <v-carousel-item v-for="(slide, i) in slides" :key="i" :src="slide.src" cover></v-carousel-item>
        </v-carousel>
      </template>


      <headerPage title="อาณาจักร" class="ml-5"></headerPage>

      <v-container fluid grid-list-md>
        <v-row>
          <v-col cols="12" md="4" sm="6" v-for="item in categorys" :key="item.id">
            <v-card class="rounded-xl" @click="selectedCategory(item)">
              <v-img style="
                    display: block;   
                    margin-left: auto; 
                    margin-right: auto;
                    border-top-left-radius: 0.75rem;
                    border-top-right-radius: 0.75rem;
                    max-width: 80%;
                    max-height: 80%;
                  " :src=" item.img_url ? item.img_url: 'https://media.istockphoto.com/id/1216251206/vector/no-image-available-icon.jpg?s=170667a&w=0&k=20&c=N-XIIeLlhUpm2ZO2uGls-pcVsZ2FTwTxZepwZe4DuE4= '"
                 cover>
              </v-img>
              <v-card-title>{{ item.category_name_th }}</v-card-title>
              <v-card-subtitle class="pt-4">โดย ศูนย์ดนตรี Manila Tamarind</v-card-subtitle>

              <v-card-text>
                <div>
                  {{ item.categoryNameEng }}
                  <span class="text-red-500 cursor-pointer">อ่านต่อ...</span>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-app>
</template>
 
<script>
import headerPage from "@/components/header/headerPage.vue";
import { mapActions, mapGetters } from "vuex";
export default {
  components: {
    headerPage,
  },
  data: () => ({
    search: "",
    drawer: true,
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
        src: 'https://5.imimg.com/data5/SELLER/Default/2022/5/LE/OI/YW/151848745/school-banner-designing-service-1000x1000.png',
      },
      {
        src: 'https://5.imimg.com/data5/SELLER/Default/2022/5/BV/SM/WD/151848745/school-banner-designing-service-1000x1000.png',
      },
      {
        src: 'https://marketplace.canva.com/EAE_Jn0OgPs/1/0/1600w/canva-white-back-to-school-banner-landscape-KeLgY-6EvN8.jpg',
      }
    ],
    dataStorage: {},
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
    this.$store.dispatch("CategoryModules/GetCategorys");
    this.$store.dispatch("NavberUserModules/changeTitleNavber", "อาณาจักร");
  },
  computed: {
    ...mapGetters({
      courses: "OrderModules/getCourses",
      categorys: "CategoryModules/getCategorys",
    }),
    MobileSize () {
      const { xs } = this.$vuetify.breakpoint
      return !!xs
    },
    IpadSize () {
      const { sm } = this.$vuetify.breakpoint
      return !!sm
    }
  },

  methods: {
    ...mapActions({
      changeCourseData: "OrderModules/changeCourseData",
      createKingdom: "OrderModules/createKingdom",
    }),
    selectedCategory(category) {
      this.courses.kingdom = category;
      this.changeCourseData(this.courses);
      this.$router.push({ name: "userCourseList" });
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
</style>

<template>
  <v-app class="overflow-x-hidden">
    <div :max-height="MobileSize ? '250 ' : '375'" class="position">
      <v-img
        src="../../../assets/navbar_user/kingdomBg.png"
        class="rounded-none bottomimg"
      >
        <div class="text-2xl ml-5 mt-10 font-bold text-white">Hello, Sarah</div>
        <v-text-field
          :class="
            MobileSize
              ? 'ml-5 mr-5 bg-white rounded-xl'
              : 'mt-14 ml-5 mr-5 bg-white rounded-xl'
          "
          outlined
          dense
          hide-details
          prepend-inner-icon="mdi-magnify"
          v-model="search"
          placeholder="ค้นหาอาณาจักรการเรียนรู้ที่คุณสนใจได้ที่นี่"
        >
          <template v-slot:append>
            <v-select  class="mySelect mr-2"  dense hide-details  flat :items="[1, 2, 3, 4]" >
            </v-select>
          </template> </v-text-field
      ></v-img>
    </div>
    <!-- <v-img
      src="../../../assets/navbar_user/kingdomBg.png"
      style="z-index: 10; position: absolute;"
      :max-height="$vuetify.breakpoint.smAndUp ? '250' : '375'"
      width="100%"
    >
      <headerPage title="Hello, Sarah" class="ml-5 mt-10"></headerPage>
      <v-text-field
        class="ml-5 mr-5 bg-white rounded-xl"
        outlined
        dense
        hide-details
        prepend-inner-icon="mdi-magnify"
        v-model="search"
        placeholder="ค้นหาอาณาจักรการเรียนรู้ที่คุณสนใจได้ที่นี่"
      ></v-text-field
    ></v-img> -->
    <!-- <v-card class="rounded-xl card-body"> -->
    <v-card
      :class="MobileSize ? 'rounded-xl card_body_sm' : 'rounded-xl card_body'"
    >
      <v-img
        src="../../../assets/navbar_user/banner.png"
        class="mt-5 rounded-xl ml-5 mr-5 mb-5"
      >
      </v-img>

      <headerPage title="อาณาจักร" class="ml-5"></headerPage>

      <v-container fluid grid-list-md>
        <v-row>
          <v-col cols="12" md="6" sm="6" v-for="item in items" :key="item.id">
            <v-card class="rounded-xl">
              <v-img
                class="align-end text-white rounded-t-xl"
                height="200"
                src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
                cover
              >
              </v-img>
              <v-card-title>อาณาจักรศิลปะสมัยใหม่</v-card-title>
              <v-card-subtitle class="pt-4"
                >โดย ศูนย์ดนตรี Manila Tamarind</v-card-subtitle
              >

              <v-card-text>
                <div>
                  เที่ยงคืนพาวเวอร์แฮมเบอร์เกอร์สแควร์เย้ว เก๊ะหมิง
                  สต๊อกอึ๋มหลวงพี่พลาซ่าหลิน จือฟลุทเยลลี่
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
export default {
  components: {
    headerPage,
  },
  data: () => ({
    search: "",
    drawer: true,
    items: [
      { id: 1, itemName: "asdsa" },
      { id: 2, itemName: "asdsa" },
      { id: 3, itemName: "asdsa" },
      { id: 4, itemName: "asdsa" },
      { id: 5, itemName: "asdsa" },
      { id: 6, itemName: "asdsa" },
      { id: 7, itemName: "asdsa" },
      { id: 8, itemName: "asdsa" },
      { id: 9, itemName: "asdsa" },
    ],
  }),

  computed: {
    MobileSize() {
      const { xs } = this.$vuetify.breakpoint;
      return !!xs;
    },
    IpadSize() {
      const { sm } = this.$vuetify.breakpoint;
      return !!sm;
    },
  },

  methods: {},
};
</script>

<style scoped>
.card_body {
  /* margin-top: -250px; */
  position: absolute;
  top: 300px;
}
.card_body_sm {
  margin-top: -70px;
}

.bgimg {
  z-index: -5;
  position: absolute;
  width: 100%;
}
.bottomimg {
  margin-top: -68px;
  max-width: "100%";
  background-position: "center";
  background-repeat: "no-repeat";
  background-size: "cover";
  padding-top: 68px;
}

.position {
  position: relative;
}

.mySelect  {
   border: none !important;
   width: 50px;
}
</style>
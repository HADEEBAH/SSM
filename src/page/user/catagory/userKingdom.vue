
<template>
  <v-app class="overflow-x-hidden overflow-y-hidden">
    <div :max-height="MobileSize ? '250 ' : '375'" class="position">
      <v-img
        src="../../../assets/navbar_user/kingdomBg.png"
        class="rounded-none bottomimg"
      >
        <div class="text-2xl ml-5 mt-10 font-bold text-white">Hello, Sarah</div>
        <!-- <v-text-field
          :class="
            MobileSize
              ? 'mt-14 ml-5 mr-5 bg-white rounded-xl'
              : 'text_field_pc ml-5 mr-5 bg-white rounded-xl'
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
          </template> </v-text-field> -->
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
    </div>
    <v-card
      :class="MobileSize ? 'rounded-xl card_body_sm' : 'rounded-xl card_body'"
      @click="
        $router.push({
          name: 'userCourseList_kingdomID',
          params: { kingdom_id: '0001' },
        })
      "
    >
      <center>
        <v-img
          src="../../../assets/navbar_user/banner.png"
          class="rounded-xl mt-5 ml-5 mr-5"
        >
        </v-img>
      </center>
      <!-- class="mt-5 rounded-xl ml-15 mr-15 mb-5 center" -->
      <div class="ml-5 text-lg font-bold mt-2">อาณาจักร</div>

      <v-container fluid grid-list-md>
        <v-row>
          <v-col cols="12" md="4" sm="6" v-for="item in items" :key="item.id">
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
export default {
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

  mounted() {
    this.$store.dispatch("NavberUserModules/changeTitleNavber", "อาณาจักร");
  },
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

  margin-top: -800px;
}
.card_body_sm {
  margin-top: -70px;
}

.bottomimg {
  margin-top: -40px;
  max-width: "100%";
  background-position: "center";
  background-repeat: "no-repeat";
  background-size: "cover";
  padding-top: 68px;
}

.position {
  position: relative;
}

.mySelect {
  border: none !important;
  width: 50px;
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
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
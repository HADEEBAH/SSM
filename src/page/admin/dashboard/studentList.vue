<template>
  <v-container>
    <v-row dense>
      <v-col cols="12" sm="6">
        <headerPage :breadcrumbs="breadcrumbs"></headerPage>
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field
          hide-details
          dense
          prepend-inner-icon="mdi-magnify"
          outlined
          placeholder="ค้นหา"
          v-model="search"
        ></v-text-field>
      </v-col>
    </v-row>
    <!-- 4 TAB -->
    <v-row dense>
      <!-- TAB 1  ผู้เรียนทั้งหมด-->
      <v-col cols="12" sm="3" md="3" @click="tab = 'allLearners'">
        <img-card
          title="ผู้เรียนทั้งหมด"
          class="cursor-pointer"
          :class="tab === 'allLearners' ? 'img-card-active' : ''"
          count="5"
          units="รายการ"
        >
          <template v-slot:img>
            <v-img src="../../../assets/studentsList/allstudent.svg"></v-img>
          </template>
          <template v-slot:header>
            <div class="font-bold">ผู้เรียนทั้งหมด</div>
          </template>
          <template v-slot:detail>
            <v-row class="d-flex align-end">
              <v-col align="center" class="text-3xl font-bold">300</v-col>
              <v-col class="text-sm">คน</v-col>
            </v-row>
          </template>
        </img-card>
      </v-col>
      <!-- TAB 2 ผู้เรียนปัจจุบัน-->
      <v-col cols="12" sm="3" md="3" @click="tab = 'currentLearners'">
        <img-card
          class="cursor-pointer"
          :class="tab === 'currentLearners' ? 'img-card-active' : ''"
        >
          <template v-slot:img>
            <v-img
              max-height="90"
              max-width="70"
              src="../../../assets/studentsList/nowstudent.svg"
            ></v-img>
          </template>
          <template v-slot:header>
            <div class="font-bold">ผู้เรียนปัจจุบัน</div>
          </template>
          <template v-slot:detail>
            <v-row class="d-flex align-end">
              <v-col align="center" class="text-3xl font-bold">290</v-col>
              <v-col class="text-sm">คน</v-col>
            </v-row>
          </template>
        </img-card>
      </v-col>
      <!-- TAB 3 ผู้เรียนใกล้จบ-->
      <v-col cols="12" sm="3" md="3" @click="tab = 'learnersNearingGrad'">
        <img-card
          class="cursor-pointer"
          :class="tab === 'learnersNearingGrad' ? 'img-card-active' : ''"
        >
          <template v-slot:img>
            <v-img
              max-height="90"
              max-width="70"
              src="../../../assets/studentsList/studentgrad.svg"
            ></v-img>
          </template>
          <template v-slot:header>
            <div class="font-bold">ผู้เรียนใกล้จบ</div>
          </template>
          <template v-slot:detail>
            <v-row class="d-flex align-end">
              <v-col align="center" class="text-3xl font-bold">10</v-col>
              <v-col class="text-sm">คน</v-col>
            </v-row>
          </template>
        </img-card>
      </v-col>
      <!-- TAB 4 ผู้เรียนจองคอร์ส-->
      <v-col cols="12" sm="3" md="3" @click="tab = 'learnersBooked'">
        <img-card
          class="cursor-pointer"
          :class="tab === 'learnersBooked' ? 'img-card-active' : ''"
        >
          <template v-slot:img>
            <v-img src="../../../assets/studentsList/booked.svg"></v-img>
          </template>
          <template v-slot:header>
            <div class="font-bold">ผู้เรียนจองคอร์ส</div>
          </template>
          <template v-slot:detail>
            <v-row class="d-flex align-end">
              <v-col align="center" class="text-3xl font-bold">100</v-col>
              <v-col class="text-sm">คน</v-col>
            </v-row>
          </template>
        </img-card>
      </v-col>
    </v-row>

    <!-- Detail Tab 1 -->
  </v-container>
</template>
  
  <script>
import { mapActions, mapGetters } from "vuex";
import headerPage from "@/components/header/headerPage.vue";
import imgCard from "@/components/course/imgCard.vue";

export default {
  components: {
    headerPage,
    imgCard,
  },
  data: () => ({
    breadcrumbs: [
      { text: "แดชบอร์ด", to: "DashboardList" },
      { text: "รายชื่อนักเรียน", to: "" },
    ],
    search: "",
    tab: "allLearners",
  }),
  mounted() {},
  methods: {
    ...mapActions({}),
  },
  computed: {
    ...mapGetters({}),
  },
};
</script>
  
  <style>
</style>
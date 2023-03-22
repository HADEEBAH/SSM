<template>
  <v-container>
    <label class="text-xl font-bold">จัดการอาณาจักรทั้งหมด</label>
    <div class="my-5">
      <v-data-table
        class="elevation-1 header-table"
        :headers="column"
        :items="categorys"
        :loading="LoadingTable"
      >
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn text color="#FF6B81" @click="$router.push({name:'EditKingdom', params:{category_id : item.categoryId}})">
            <v-icon>mdi-text-box-search-outline</v-icon>
            ดูรายละเอียด
          </v-btn>
        </template>
      </v-data-table>
    </div>
  </v-container>
</template>
  
  <script>
import { mapActions, mapGetters } from "vuex";
export default {
  data: () => ({
    column: [
      {
        text: "ชื่ออาณาจักร(ไทย)",
        align: "start",
        sortable: false,
        value: "categoryNameTh",
      },
      {
        text: "ชื่ออาณาจักร(อังกฤษ)",
        align: "start",
        sortable: false,
        value: "categoryNameEng",
      },
      { text: "จัดสอนโดย", align: "start", sortable: false, value: "taughtBy" },
      { text: "", align: "center", value: "actions", sortable: false },
    ],
  }),
  mounted() {
    this.$store.dispatch("CategoryModules/GetCategorys");
  },
  methods: {
    ...mapActions({
      GetCategorys: "CategoryModules/GetCategorys",
    }),

  },
  computed: {
    ...mapGetters({
      categorys: "CategoryModules/getCategorys",
    }),
    LoadingTable(){
            console.log(this.categorys)
            return !this.categorys
        } 
  },
};
</script>
  
  <style scoped>
.pink-header {
  background-color: pink;
}
</style>
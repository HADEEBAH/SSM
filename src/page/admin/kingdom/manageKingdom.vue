<template>
  <v-container>
    <!-- <label class="text-xl font-bold">จัดการอาณาจักรทั้งหมด</label> -->
    <header-page slot_tag title="จัดการอาณาจักรทั้งหมด">
      <v-text-field
        class="w-full"
        outlined
        dense
        hide-details
        prepend-inner-icon="mdi-magnify"
        v-model="search"
        placeholder="ค้นหา"
      ></v-text-field>
    </header-page>

    <div class="my-5">
      <v-data-table
        class="elevation-1 header-table"
        :headers="column"
        :items="categorys"
        :loading="LoadingTable"
        :search="search"
      >
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            text
            color="#FF6B81"
            @click="
              $router.push({
                name: 'EditKingdom',
                params: { category_id: item.categoryId },
              })
            "
          >
            <v-icon>mdi-text-box-search-outline</v-icon>
            ดูรายละเอียด
          </v-btn>
          <v-btn icon color="#ff6b81" @click="categoryDelete(item)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
        <template v-slot:[`no-results`]>
          <div class="font-bold">ไม่พบข้อมูลในตาราง</div>
        </template>
      </v-data-table>
    </div>
  </v-container>
</template>
  <script>
import { mapActions, mapGetters } from "vuex";
import Swal from "sweetalert2";
import headerPage from "@/components/header/headerPage.vue";

export default {
  components: {
    headerPage,
  },
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
    search: "",
  }),
  mounted() {
    this.$store.dispatch("CategoryModules/GetCategorys");
  },
  methods: {
    ...mapActions({
      GetCategorys: "CategoryModules/GetCategorys",
      DeleteCategory: "CategoryModules/DeleteCategory",
    }),
    categoryDelete(category) {
      Swal.fire({
        icon: "question",
        title: `ต้องการลบ ${category.categoryNameTh}`,
        showDenyButton: false,
        showCancelButton: true,
        cancelButtonText: "ยกเลิก",
        confirmButtonText: "ตกลง",
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.DeleteCategory({ category_id: category.categoryId });
        }
      });
    },
  },
  computed: {
    ...mapGetters({
      categorys: "CategoryModules/getCategorys",
    }),
    LoadingTable() {
      return !this.categorys;
    },
  },
};
</script>
  
  <style scoped>
.pink-header {
  background-color: pink;
}
</style>
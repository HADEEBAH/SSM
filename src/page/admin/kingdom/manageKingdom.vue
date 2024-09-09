<template>
  <v-container>
    <header-page slot_tag :title="$t('customization')">
      <v-text-field
        class="w-full"
        outlined
        dense
        hide-details
        prepend-inner-icon="mdi-magnify"
        v-model="search"
        color="#FF6B81"
        :placeholder="$t('search')"
      ></v-text-field>
    </header-page>

    <div class="my-5">
      <v-data-table
        class="elevation-1 header-table"
        :headers="column"
        :items="categorys"
        :loading="LoadingTable"
        :search="search"
        :footer-props="{
          'items-per-page-options': [10, 20, 30, 40, 50],
        }"
      >
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            text
            color="#FF6B81"
            :to="{
              name: 'EditKingdom',
              params: { category_id: item.categoryId },
            }"
          >
            <v-icon>mdi-text-box-search-outline</v-icon>
            {{ $t("view details") }}
          </v-btn>
          <v-btn icon color="#ff6b81" @click="categoryDelete(item)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
        <template v-slot:[`no-results`]>
          <div class="font-bold">{{ $t("no data found in table") }}</div>
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
        title: `${this.$t("do you want to delete")} ${
          this.$i18n.locale == "th"
            ? category.categoryNameTh
            : category.categoryNameEng
        } ${this.$t("?")}`,
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: this.$t("agree"),
        cancelButtonText: this.$t("cancel"),
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
    column() {
      return [
        {
          text: this.$t("wls name (thai)"),
          align: "start",
          sortable: false,
          value: "categoryNameTh",
        },
        {
          text: this.$t("wls name (english)"),
          align: "start",
          sortable: false,
          value: "categoryNameEng",
        },
        {
          text: this.$t("instructor"),
          align: "start",
          sortable: false,
          value: "taughtBy",
        },
        { text: "", align: "center", value: "actions", sortable: false },
      ];
    },
  },
};
</script>

<style scoped>
.pink-header {
  background-color: pink;
}
</style>

<template>
  <v-container>
    <header-page slot_tag :title="$t(`manage reservations`)">
      <v-text-field
        class="w-full"
        outlined
        dense
        hide-details
        prepend-inner-icon="mdi-magnify"
        v-model="search"
        :placeholder="$t(`search`)"
      ></v-text-field>
    </header-page>

    <v-row class="mb-2" dense>
      <template v-for="(type, type_index) in course_type">
        <v-col
          cols="12"
          sm="3"
          :key="`${type_index}-type`"
          @click="type_selected = type.value"
        >
          <img-card
            class="cursor-pointer"
            :class="type_selected === type.value ? 'img-card-active' : ''"
          >
            <template v-slot:img>
              <v-img
                v-if="type.value == 'all'"
                max-height="90"
                max-width="70"
                src="@/assets/coachLeave/all.png"
              ></v-img>
              <v-img
                v-if="type.value == 'contacted'"
                max-height="90"
                max-width="70"
                src="@/assets/coachLeave/accept.png"
              ></v-img>
              <v-img
                v-if="type.value == 'waiting'"
                max-height="90"
                max-width="70"
                src="@/assets/coachLeave/wait.png"
              ></v-img>
              <v-img
                v-if="type.value == 'cancel'"
                max-height="90"
                max-width="70"
                src="@/assets/coachLeave/disaccept.png"
              ></v-img>
            </template>
            <template v-slot:header>
              <div class="font-bold">{{ type.name }}</div>
            </template>
            <template v-slot:detail>
              <v-row class="d-flex align-end">
                <v-col cols="12" align="center" class="text-3xl font-bold">{{
                  type.value == "all"
                    ? reserve_list.length
                    : reserve_list.filter((v) => v.status == type.value).length
                }}</v-col>
                <v-col class="text-center text-sm">รายการ</v-col>
              </v-row>
            </template>
          </img-card>
        </v-col>
      </template>
    </v-row>
    <loading-overlay
      v-if="reserve_list_is_loading"
      :loading="reserve_list_is_loading"
    ></loading-overlay>
    <v-card v-else outlined>
      <v-data-table
        class="header-table"
        :headers="columns"
        :items="
          type_selected === 'all'
            ? reserve_list
            : reserve_list.filter((v) => v.status === type_selected)
        "
        :search="search"
        :sort-by="sortBy"
        :sort-desc="sortDesc"
        @update:sort-by="updateSortBy"
        @update:sort-desc="updateSortDesc"
      >
        <template v-slot:no-data>
          <v-row dense>
            <v-col align="center"> {{ $t("no data found") }} </v-col>
          </v-row>
        </template>

        <template v-slot:[`item.createdDate`]="{ item }">
          {{ formatDate(item.createdDate) }}
        </template>

        <template v-slot:[`item.status`]="{ item }">
          <v-autocomplete
            dense
            outlined
            hide-details
            @change="update(item.reserveId, item)"
            item-color="pink"
            :items="status"
            item-text="label"
            item-value="value"
            v-model="item.status"
          >
          </v-autocomplete>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>
  
  <script>
import headerPage from "@/components/header/headerPage.vue";
import imgCard from "@/components/course/imgCard.vue";
import { mapActions, mapGetters } from "vuex";
import LoadingOverlay from "../../../components/loading/loadingOverlay.vue";
import Swal from "sweetalert2";
export default {
  name: "manageCourseReserve",
  components: { headerPage, imgCard, LoadingOverlay },
  data: () => ({
    type_selected: "all",
    search: "",
    sortBy: "date",
    sortDesc: false,
  }),
  created() {
    this.GetReserveList();
  },
  mounted() {},
  watch: {},
  computed: {
    ...mapGetters({
      reserve_list: "reserveCourseModules/reserveList",
      reserve_list_is_loading: "reserveCourseModules/reserveListIsLoading",
    }),
    course_type() {
      return [
        { name: this.$t("all"), value: "all" },
        { name: this.$t("waiting"), value: "waiting" },
        { name: this.$t("Confirmed"), value: "contacted" },
        { name: this.$t("canceled"), value: "cancel" },
      ];
    },
    status() {
      return [
        { label: this.$t("waiting"), value: "waiting" },
        { label: this.$t("Confirmed"), value: "contacted" },
        { label: this.$t("canceled"), value: "cancel" },
      ];
    },
    columns() {
      return [
        {
          text: this.$t("reserve date"),
          value: "createdDate",
          align: "start",
        },
        {
          text: this.$t("booking time"),
          align: "start",
          sortable: false,
          value: "timeTh",
        },
        {
          text: this.$t("course name"),
          align: "start",
          sortable: false,
          value: this.$i18n.locale == "th" ? "courseName" : "courseNameEn",
        },
        {
          text: this.$t("first name - last name learner"),
          align: "start",
          sortable: false,
          value:
            this.$i18n.locale == "th" ? "studentFullName" : "studentFullNameEn",
        },
        {
          text: this.$t("first name - last name booker"),
          align: "start",
          sortable: false,
          value:
            this.$i18n.locale == "th"
              ? "createdByFullName"
              : "createdByFullNameEn",
        },
        {
          text: this.$t("contact number"),
          align: "start",
          sortable: false,
          value: "tel",
        },
        {
          text: this.$t("booking status"),
          align: "start",
          sortable: false,
          value: "status",
        },
        { text: "", align: "start", value: "actions", sortable: false },
      ];
    },
  },
  methods: {
    ...mapActions({
      GetReserveList: "reserveCourseModules/GetReserveList",
      UpdateStatusReserve: "reserveCourseModules/UpdateStatusReserve",
    }),
    update(reserve_id, reserve_data) {
      Swal.fire({
        icon: "question",
        title: this.$t("do you want to change your status?"),
        showDenyButton: false,
        showCancelButton: true,
        cancelButtonText: this.$t("cancel"),
        confirmButtonText: this.$t("agree"),
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.UpdateStatusReserve({
            reserve_id: reserve_id,
            reserve_data: reserve_data,
          });
        }
      });
    },

    formatDate(dateString) {
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      return new Date(dateString).toLocaleDateString(
        this.$i18n.locale == "th" ? "th-TH" : "en-US",
        options
      );
    },

    updateSortBy(value) {
      this.sortBy = value;
    },
    updateSortDesc(value) {
      this.sortDesc = value;
    },
    // formatDate(dateString) {
    //   // Format the date using the toLocaleDateString method
    //   return new Date(dateString).toLocaleDateString();
    // },
  },
};
</script>
  
<template>
  <v-container>
    <header-page slot_tag title="จัดการการจอง">
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
                <v-col align="center" class="text-3xl font-bold">{{
                  type.value == "all"
                    ? reserve_list.length
                    : reserve_list.filter((v) => v.status == type.value).length
                }}</v-col>
                <v-col class="text-sm">รายการ</v-col>
              </v-row>
            </template>
          </img-card>
        </v-col>
      </template>
    </v-row>
    <v-card outlined>
      <v-data-table
        :headers="columns"
        :items="
          type_selected === 'all'
            ? reserve_list
            : reserve_list.filter((v) => v.status === type_selected)
        "
        :search="search"
      >
        <template v-slot:no-data>
          <v-row dense>
            <v-col align="center"> ไม่พบข้อมูล </v-col>
          </v-row>
        </template>
        <template v-slot:[`item.course_name`]="{ item }">
          <v-row dense>
            <v-col>
              {{ `${item.courseName}(${item.courseNameEn})` }}
            </v-col>
          </v-row>
        </template>
        <template v-slot:[`item.student_name`]="{ item }">
          <v-row dense>
            <v-col>
              {{
                `${item.studentData.firstNameTh} ${item.studentData.lastNameTh}`
              }}
            </v-col>
          </v-row>
        </template>
        <template v-slot:[`item.created_by`]="{ item }">
          <v-row dense>
            <v-col>
              {{
                `${item.createdByData.firstNameTh} ${item.createdByData.lastNameTh}`
              }}
            </v-col>
          </v-row>
        </template>
        <template v-slot:[`item.tel`]="{ item }">
          <v-row dense>
            <v-col>
              {{ `${item.createdByData.tel}` }}
            </v-col>
          </v-row>
        </template>
        <template v-slot:[`item.status`]="{ item }">
          <v-autocomplete
            dense
            outlined
            hide-details
            @change="
              UpdateStatusReserve({
                reserve_id: item.reserveId,
                reserve_data: item,
              })
            "
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
export default {
  name: "manageCourseReserve",
  components: { headerPage, imgCard },
  data: () => ({
    type_selected: "all",
    search: "",
    course_type: [
      { name: "ทั้งหมด", value: "all" },
      { name: "รอการติดต่อ", value: "waiting" },
      { name: "ติดต่อแล้ว", value: "contacted" },
      { name: "ยกเลิกการจอง", value: "cancel" },
    ],
    status: [
      { label: "รอการติดต่อ", value: "waiting" },
      { label: "ติดต่อแล้ว", value: "contacted" },
      { label: "ยกเลิกการจอง", value: "cancel" },
    ],
    columns: [
      {
        text: "วันที่จอง",
        align: "start",
        sortable: false,
        value: "ThDate",
      },
      {
        text: "เวลาที่จอง",
        align: "start",
        sortable: false,
        value: "ThTime",
      },
      {
        text: "ชื่อคอร์ส",
        align: "start",
        sortable: false,
        value: "course_name",
      },
      {
        text: "ชื่อ-นามสกุลผู้เรียน",
        align: "start",
        sortable: false,
        value: "student_name",
      },
      {
        text: "ชื่อ-นามสกุลผู้จอง",
        align: "start",
        sortable: false,
        value: "created_by",
      },
      { text: "เบอร์ติดต่อ", align: "start", sortable: false, value: "tel" },
      {
        text: "สถานะการจอง",
        align: "start",
        sortable: false,
        value: "status",
      },
      { text: "", align: "start", value: "actions", sortable: false },
    ],
  }),
  created() {
    this.GetReserveList();
  },
  mounted() {},
  watch: {},
  computed: {
    ...mapGetters({
      reserve_list: "reserveCourseModules/reserveList",
      reserve_list_is_loading: "reserveCourseModules/reserve_list_is_loading",
    }),
  },
  methods: {
    ...mapActions({
      GetReserveList: "reserveCourseModules/GetReserveList",
      UpdateStatusReserve: "reserveCourseModules/UpdateStatusReserve",
    }),
  },
};
</script>
  
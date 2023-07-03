<template>
    <v-container>
        <header-page title="จัดการการจอง"></header-page>
        <v-row class="mb-2">
          <template  v-for="(type, type_index) in course_type"  >
            <v-col cols="12"  sm="auto"  :key="`${type_index}-type`"  @click="type_selected = type.value" >
              <img-card class="cursor-pointer" :class="type_selected === type.value ? 'img-card-active':''">
                <template v-slot:img> 
                    <v-img v-if="type.value== 'all'" max-height="90" max-width="70" src="../../../assets/coachLeave/all.png"></v-img>
                    <!-- <v-img v-if="type.value== 'registered'" max-height="90" max-width="70" src="../../../assets/coachLeave/accept.png"></v-img> -->
                    <v-img v-if="type.value== 'contacted'" max-height="90" max-width="70" src="../../../assets/coachLeave/accept.png"></v-img>
                    <v-img v-if="type.value== 'waiting'" max-height="90" max-width="70" src="../../../assets/coachLeave/wait.png"></v-img>
                    <v-img v-if="type.value== 'cancel'" max-height="90" max-width="70" src="../../../assets/coachLeave/disaccept.png"></v-img>
                </template>
                <template v-slot:header>
                    <div class="font-bold"> {{ type.name }} </div>
                </template>
                <template v-slot:detail>
                    <v-row class="d-flex align-end">
                        <v-col align="center" class="text-3xl font-bold"></v-col>
                        <v-col class="text-sm">รายการ</v-col>
                    </v-row>
                </template>
              </img-card>
            </v-col>
          </template>
          
        </v-row>
        <pre>
          {{ reserve_list }}
        </pre>
        <v-card outlined>
          <v-data-table 
          :headers="columns"
          :items="reserve_list"
          >
          </v-data-table>
        </v-card>
    </v-container>
</template>
  
  <script>
  import headerPage from "../../../components/header/headerPage.vue";
//   import rowData from "../../../components/label/rowData.vue";
  import imgCard from "../../../components/course/imgCard.vue";
import { mapActions, mapGetters } from 'vuex';
  export default {
    name:"manageCourseReserve",
    components: {headerPage,imgCard },
    data: () => ({
      type_selected: "all",
      course_type: [
            { name: "ทั้งหมด", value: "all" },
            { name: "รอการติดต่อ", value: "waiting"},
            { name: "ติดต่อแล้ว", value: "contacted"},
            // { name: "ลงทะเบียนแล้ว", value: "registered"},
            { name: "ยกเลิกการจอง", value: "cancel"},
        ],
      columns: [
      {
          text: "วันที่จอง",
          align: "center",
          sortable: false,
          value: "created_date",
        },
        {
          text: "ชื่อคอร์ส",
          align: "center",
          sortable: false,
          value: "course_name",
        },
        {
          text: "ชื่อ-นามสกุลผู้เรียน",
          align: "center",
          sortable: false,
          value: "student_name",
        },
        { text: "ชื่อ-นามสกุลผู้จอง", align: "center", sortable: false, value: "created_by" },
        {
          text: "สถานะการจอง",
          align: "center",
          sortable: false,
          value: "status",
        },
        { text: "", align: "center", value: "actions", sortable: false },
      ],
    }),
    created() {
      this.GetReserveList()
    },
    mounted() {},
    watch: {},
    computed: {
      ...mapGetters({
        reserve_list: "reserveCourseModules/reserveList",
        reserve_list_is_loading: "reserveCourseModules/reserve_list_is_loading",
      })
    },
    methods: {
      ...mapActions({
        GetReserveList:"reserveCourseModules/GetReserveList"
      })
    },
  };
  </script>
  
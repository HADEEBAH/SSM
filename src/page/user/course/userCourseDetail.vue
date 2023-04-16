<template>
  <v-app>
    <v-container>
      <!-- {{ course_data }} -->
      <v-img
        contain
        class="rounded-lg mb-3"
        max-height="180"
        :src="course_data.course_img ? course_data.course_img : 'https://cdn.vuetifyjs.com/images/cards/cooking.png'"
      ></v-img>
      <v-row dense
        ><v-col class="text-lg font-bold">
          {{ `${course_data.course_name_th} (${course_data.course_name_en})` }}
        </v-col>
      </v-row>
      <v-row dense><v-col class="text-md">{{`โดย ${course_data.location}`}}</v-col></v-row>
      <template v-if="course_data.course_type_id === 'CT_2'">
        <v-row dense>
          <v-col cols="auto">
            <v-icon  class="mr-2" color="#ff6b81">mdi-currency-usd</v-icon>
          </v-col>
          <v-col class="font-bold">{{parseFloat(course_data.price_course).toLocaleString()}} บาท/คน</v-col>
        </v-row>
        <rowData col_detail="5" mini icon="mdi-account-group-outline"
          > {{ course_data.course_studant_amount ?   course_data.course_studant_amount : 0 }} / {{course_data.student_recived}} ที่นั่ง</rowData
        >
      </template>
      <!-- GENERAL COURSE -->
      <template v-if="course_data.course_type_id === 'CT_1'">
        <!-- <rowData col_detail="5" mini icon="mdi-calendar-today"
          >วันเสาร์ - อาทิตย์</rowData
        > -->
        <rowData col_detail="5" mini icon="mdi-clock-time-four-outline"
          >{{ course_data.course_hours  }} ชม. / ครั้ง</rowData
        >
        <!-- <rowData col_detail="5" mini icon="mdi-account-group-outline"
          > 9 / 10 ที่นั่ง</rowData
        > -->
      </template>
      <v-row dense>
        <v-col cols="12" class="text-[#999999]">
          {{ course_data.detail  }}</v-col
        >
      </v-row>
      <v-expansion-panels flat>
        <v-expansion-panel  v-if="course_data.course_type_id === 'CT_2'">
          <v-expansion-panel-header class="px-0 font-bold">
            วันและเวลา
            <template v-slot:actions>
              <v-icon color="#ff6b81"> $expand </v-icon>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content class="border-t pt-3">
            <v-row dense>
              <v-col cols="auto">วันรับสมัคร:</v-col>
              <v-col> {{ new Date(course_data.course_register_start_date).toLocaleDateString("th-TH",date_options)}}-{{ new Date(course_data.course_register_end_date).toLocaleDateString("th-TH",date_options)}}</v-col>
            </v-row>
            <v-row dense>
              <v-col cols="auto">วันเรียน:</v-col>
              <v-col>{{ new Date(course_data.course_study_start_date).toLocaleDateString("th-TH",date_options)}} - {{ new Date(course_data.course_study_end_date).toLocaleDateString("th-TH",date_options)}} ({{ getTime(course_data.course_period_start_date) }}-{{ getTime(course_data.course_period_end_date) }} น.)</v-col>
            </v-row>
           
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header class="px-0 font-bold">
            Music performance
            <template v-slot:actions>
              <v-icon color="#ff6b81"> $expand </v-icon>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content class="border-t pt-3">
              {{ course_data.music_performance }}
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header class="px-0 font-bold">
            Certification
            <template v-slot:actions>
              <v-icon color="#ff6b81"> $expand </v-icon>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content class="border-t pt-3">
            {{ course_data.catification }}
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      
      <v-row>
        <v-col
          v-if="course_order.course_type_id === 'CT_1'"
          cols="12"
          class="flex justify-center"
        >
          <v-btn
            depressed
            class="w-full font-bold white--text"
            @click="$router.push({ name: 'userCoursePackage_courseId', params:{course_id : $route.params.course_id} })"
            color="#ff6b81"
          >
            เลือกแพ็คเกจ
          </v-btn>
        </v-col>
        <v-col
          v-if="course_order.course_type_id === 'CT_2'"
          cols="12"
          class="flex justify-center"
        >
          <v-btn
            v-if=" course_data.course_studant_amount ? course_data.course_studant_amount < course_data.student_recived : 0 < course_data.student_recived"
            depressed
            class="w-full font-bold white--text"
            @click="registerCourse"
            color="#ff6b81"
          >
            สมัคร
          </v-btn>
          <v-btn
            v-else
            depressed
            class="w-full font-bold white--text"
            @click="reserveCourse"
            color="#ff6b81"
          >
            จองคอร์สเรียน
          </v-btn>
        </v-col>
      </v-row>
        <!-- DIALOG :: COURSE FULL -->
        <v-dialog width="60vw" v-model="show_dialog" persistent >
            <v-card>
                <v-card-title>
                    <v-row>
                        <v-col align="right">
                            <v-btn icon @click="show_dialog = false"><v-icon color="#ff6b81">mdi-close</v-icon></v-btn>
                        </v-col>
                    </v-row>
                </v-card-title>
                <v-card-text>
                    <dialog-card text="คอร์สเต็มแล้ว" subtitle="ขณะนี้คลาสเรามีผู้เรียนเต็มจำนวนแล้ว ขอบคุณท่านที่สนใจคอร์สของเรา ">
                        <template #img>
                            <v-img max-height="124" max-width="156" src="@/assets/course/course_full.png"></v-img>
                        </template>
                        <template #btn>
                            <v-btn @click="show_dialog = false" depressed color="#ff6b81" class="w-full" dark>ตกลง</v-btn>
                        </template>                    
                    </dialog-card>
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-container>
    <loading-overlay :loading="course_is_loading"></loading-overlay>
  </v-app>
</template>
  
  <script>
import dialogCard from "@/components/dialog/dialogCard.vue";
import rowData from "@/components/label/rowData.vue";
import loadingOverlay from "../../../components/loading/loadingOverlay.vue";
import Swal from "sweetalert2";
import { mapActions, mapGetters } from "vuex";
import moment from 'moment';
export default {
  name: "userCourseDetail",
  components: { rowData, dialogCard, loadingOverlay },
  data: () => ({
    show_dialog: false,
    date_options: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      locale: 'th-TH'
    }
  }),
  created() {
    this.GetCourse(this.$route.params.course_id)
    this.order_data = JSON.parse(localStorage.getItem("Order"))
    if(this.order_data.course_type_id === "CT_2"){
      this.GetCourseStudent({course_id: this.order_data.course_id,cpo_id: null})
    }
  },
  mounted() {
    this.GetCourse(this.$route.params.course_id)
    this.$store.dispatch("NavberUserModules/changeTitleNavber", "คอร์สเรียน");
  },
  watch: {},
  computed: {
    ...mapGetters({
      course_data : "CourseModules/getCourseData",
      course_order: "OrderModules/getCourseOrder",
      order: "OrderModules/getOrder",
      course_is_loading : "CourseModules/getCourseIsLoading"
    }),
  },
  methods: {
    ...mapActions({
      GetCourse : "CourseModules/GetCourse",
      changeCourseOrderData: "OrderModules/changeCourseOrderData",
      changeOrderData: "OrderModules/changeOrderData",
      GetCourseStudent: "CourseModules/GetCourseStudent",
      CreateReserveCourse : "OrderModules/CreateReserveCourse",
    }),
    getTime(time){
      return moment(time).format("HH:mm")
    },
    reserveCourse(){
      Swal.fire({
        icon: "question",
        title: "ต้องการจองคอร์สนี้ใช่หรือไม่",
        showDenyButton: false,
        showCancelButton: false,
        confirmButtonText: "ตกลง",
      }).then(async (result) => {
        if (result.isConfirmed) {
          if( this.course_data.course_type_id === "CT_2" ){
            this.course_order.price = parseFloat(this.course_data.price_course)
            this.CreateReserveCourse({course_data : this.course_order})
          }
        }
      })
     
    },
    registerCourse(){
      this.order.order_step = 1
      console.log(this.course_data.price_course)
      if(this.course_order.students.length > 0){
        this.course_order.apply_for_yourself = false,
        this.course_order.apply_for_others = false,
        this.course_order.times_in_class = 0
        this.course_order.day =  ""
        this.course_order.time = ""
        this.course_order.coach = ""
        this.course_order.start_day = ""
        this.course_order.price = 0
        this.course_order.detail = ""
        this.course_order.remark = ""
        this.course_order.selected = true
        this.course_order.parents = []
        this.course_order.students = []
      }
      if( this.course_data.course_type_id === "CT_2" ){
        this.course_order.price = parseFloat(this.course_data.price_course)
        this.changeCourseOrderData(this.course_order)
      }
      this.changeOrderData(this.order)
      this.$router.push({name : "userCourseOrder"})
    }
  },
};
</script>
  
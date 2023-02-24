<template>
  <v-app>
    <v-container>
      <v-img
        class="rounded-lg mb-3"
        max-height="30vw"
        src="https://cdn.vuetifyjs.com/images/cards/cooking.png"
      ></v-img>
      <v-row dense
        ><v-col class="text-lg font-bold"
          >เปียโนป๊อปเบื้องต้น (Popular Piano )
        </v-col></v-row
      >
      <v-row dense
        ><v-col class="text-md">โดย ศูนย์ดนตรี Manila Tamarind</v-col></v-row
      >
      <template v-if="courses.course_type === 'short_course'">
        <v-row dense>
          <v-col cols="auto">
            <v-icon color="#ff6b81">mdi-currency-usd</v-icon>
          </v-col>
          <v-col class="font-bold">1,600 บาท/คน</v-col>
        </v-row>
      </template>
      <!-- GENERAL COURSE -->
      <template v-if="courses.course_type === 'general_course'">
        <rowData col_detail="5" mini icon="mdi-calendar-today"
          >วันเสาร์ - อาทิตย์</rowData
        >
        <rowData col_detail="5" mini icon="mdi-clock-time-four-outline"
          >1 ชม. / ครั้ง</rowData
        >
        <rowData col_detail="5" mini icon="mdi-account-group-outline"
          >9 / 15 ที่นั่ง</rowData
        >
        <v-row>
          <v-col class="text-xs text-[999999]">
            หลักสูตรนี้เน้นการฝึกเล่นเปียโน ประกอบการร้องเพลง
            ทั้งบรรเลงเดี่ยวและรวมวง เน้นความสนุกสนานเพลิดเพลิน
            โดยผู้เรียนสามารถเลือกเพลงได้ตามความสนใจ ทั้งเพลงไทย และสากล ทั้งแนว
            Rock , Pop ฯลฯ
          </v-col>
        </v-row>
      </template>
      <v-expansion-panels flat>
        <v-expansion-panel>
          <v-expansion-panel-header class="px-0 font-bold">
            วันและเวลา
            <template v-slot:actions>
              <v-icon color="#ff6b81"> $expand </v-icon>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content class="border-t pt-3">
            <v-row dense>
              <v-col cols="auto">วันรับสมัคร:</v-col>
              <v-col> 10 ก.พ -10 มี.ค. 2566</v-col>
            </v-row>
            <v-row dense>
              <v-col cols="auto">วันเรียน:</v-col>
              <v-col>13-15 มี.ค. 2566 (13.00-14.30 น.)</v-col>
            </v-row>
            <v-row dense>
              <v-col cols="12" class="text-[#999999]">
                หลักสูตรนี้เน้นการฝึกเล่นเปียโน ประกอบการร้องเพลง
                ทั้งบรรเลงเดี่ยวและรวมวง เน้นความสนุกสนานเพลิดเพลิน
                โดยผู้เรียนสามารถเลือกเพลงได้ตามความสนใจ ทั้งเพลงไทยและสากล
                ทั้งแนว Rock , Pop ฯลฯ</v-col
              >
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
            A สุนทรียะด้านการฟังและเล่นดนตรี<br />
            K ทฤษฎีดนตรีสากล<br />
            S 1 ทักษะการอ่านโน้ตดนตรีสากล<br />
            S2 ทักษะการฟังเสียง Ear training<br />
            S3 ทักษะการบรรเลงเดี่ยว Solo<br />
            S4 ทักษะการบรรเลงรวมวง
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
            สู่การสอบเทียบมาตรฐาน Trinity และ ABRSM
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-row>
        <v-col
          v-if="courses.course_type === 'general_course'"
          cols="12"
          class="flex justify-center"
        >
          <v-btn
            depressed
            class="w-full font-bold white--text"
            @click="$router.push({ name: 'userCoursePackage' })"
            color="#ff6b81"
          >
            เลือกแพ็คเกจ
          </v-btn>
        </v-col>
        <v-col
          v-if="courses.course_type === 'short_course'"
          cols="12"
          class="flex justify-center"
        >
          <v-btn
            depressed
            class="w-full font-bold white--text"
            @click="$router.push({ name: 'userCourseOrder' })"
            color="#ff6b81"
          >
            สมัคร
          </v-btn>
        </v-col>
        <v-col
          v-if="courses.course_type === 'short_course'"
          cols="12"
          class="flex justify-center"
        >
          <v-btn
            depressed
            class="w-full font-bold white--text"
            @click="show_dialog = true"
            color="#ff6b81"
          >
            สมัคร (เต็ม)
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
  </v-app>
</template>
  
  <script>
  import dialogCard from "@/components/dialog/dialogCard.vue";
import rowData from "@/components/label/rowData.vue";
import { mapActions, mapGetters } from "vuex";
export default {
  name: "userCourseDetail",
  components: { rowData, dialogCard },
  data: () => ({
    show_dialog: false,
  }),
  created() {},
  mounted() {
    this.$store.dispatch("NavberUserModules/changeTitleNavber", "คอร์สเรียน");
  },
  watch: {},
  computed: {
    ...mapGetters({
      courses: "OrderModules/getCourses",
    }),
  },
  methods: {
    ...mapActions({
      changeCourseData: "OrderModules/changeCourseData",
    }),
  },
};
</script>
  
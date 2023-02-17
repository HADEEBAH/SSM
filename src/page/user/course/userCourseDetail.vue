<template>
    <v-app>
      <v-container>
        <v-img class="rounded-lg mb-3" max-height="50vw" src="https://cdn.vuetifyjs.com/images/cards/cooking.png"></v-img>
        <v-row dense><v-col class="text-lg font-bold">เปียโนป๊อปเบื้องต้น (Popular Piano ) </v-col></v-row>
        <v-row dense><v-col class="text-md">โดย ศูนย์ดนตรี Manila Tamarind</v-col></v-row>
        <rowData col_detail="5" mini icon="mdi-calendar-today">วันเสาร์ - อาทิตย์</rowData>
        <rowData col_detail="5" mini icon="mdi-clock-time-four-outline">1 ชม. / ครั้ง</rowData>
        <rowData col_detail="5" mini icon="mdi-account-group-outline">9 / 15 ที่นั่ง</rowData>
        <v-row >
            <v-col class="text-xs text-[999999]">
                หลักสูตรนี้เน้นการฝึกเล่นเปียโน ประกอบการร้องเพลง ทั้งบรรเลงเดี่ยวและรวมวง เน้นความสนุกสนานเพลิดเพลิน โดยผู้เรียนสามารถเลือกเพลงได้ตามความสนใจ ทั้งเพลงไทย
                และสากล ทั้งแนว Rock , Pop ฯลฯ
            </v-col>
        </v-row>
        <v-expansion-panels flat >
            <v-expansion-panel>
                <v-expansion-panel-header class="px-0 ">
                    Music performance
                    <template v-slot:actions>
                        <v-icon color="#ff6b81">
                        $expand
                        </v-icon>
                    </template>
                </v-expansion-panel-header>
                <v-expansion-panel-content class="border-t pt-3">
                    A    สุนทรียะด้านการฟังและเล่นดนตรี<br>
                    K    ทฤษฎีดนตรีสากล<br>
                    S 1  ทักษะการอ่านโน้ตดนตรีสากล<br>
                    S2  ทักษะการฟังเสียง Ear training<br>
                    S3  ทักษะการบรรเลงเดี่ยว Solo<br>
                    S4  ทักษะการบรรเลงรวมวง
                </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
                <v-expansion-panel-header class="px-0">
                    Certification
                    <template v-slot:actions>
                        <v-icon color="#ff6b81">
                        $expand
                        </v-icon>
                    </template>
                </v-expansion-panel-header>
                <v-expansion-panel-content class="border-t pt-3">
                    สู่การสอบเทียบมาตรฐาน Trinity และ ABRSM
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>
        <v-row>
            <v-col cols="12" class="flex justify-center">
                <v-btn depressed class="w-full font-bold white--text" @click="$router.push({name : 'userCoursePackage_courseID' , params: {course_id : $route.params.course_id}})" color="#ff6b81" >
                    เลือกแพ็คเกจ
                </v-btn>
            </v-col>
        </v-row>
      </v-container>
    </v-app>
  </template>
  
  <script>
  import rowData from '@/components/label/rowData.vue';
  export default {
    name:"userCourseDetail",
    components: {rowData},
    data: () => ({}),
    created() {},
    mounted() {
        this.$store.dispatch("NavberUserModules/changeTitleNavber","คอร์สเรียน")
    },
    watch: {},
    computed: {},
    methods: {},
  };
  </script>
  
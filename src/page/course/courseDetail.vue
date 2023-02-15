<template>
    <v-app>
      <v-container>
        <header-page :breadcrumbs="breadcrumbs"></header-page>
        <v-row class="mb-3" >
            <v-col cols="12" sm="3" @click="tab='course'">
                <img-card vertical class="cursor-pointer" :class="tab === 'course' ? 'img-card-active':''">
                    <template v-slot:img>
                        <v-img max-height="72" max-width="72" src="../../assets/course/course.png"></v-img>
                        <span class="text-lg font-bold"> คอร์สเรียน </span>
                    </template>
                </img-card>
            </v-col>    
            <v-col cols="12" sm="3" @click="tab='time and coach'">
                <img-card vertical class="cursor-pointer" :class="tab === 'time and coach' ? 'img-card-active':''">
                    <template v-slot:img>
                        <v-img max-height="72" max-width="72" src="../../assets/course/time_and_coach.png"></v-img>
                        <span class="text-lg font-bold"> ช่วงเวลาและโค้ช </span>
                    </template>
                </img-card>
            </v-col>
            <v-col cols="12" sm="3"  @click="tab='package'">
                <img-card vertical class="cursor-pointer" :class="tab === 'package' ? 'img-card-active':''">
                    <template v-slot:img>
                        <v-img max-height="72" max-width="72" src="../../assets/course/package.png"></v-img>
                        <span class="text-lg font-bold"> แพ็คเกจ </span>
                    </template>
                </img-card>
            </v-col>
            <v-col cols="12" sm="3" @click="tab='student list'">
                <img-card vertical class="cursor-pointer" :class="tab === 'student list' ? 'img-card-active':''">
                    <template v-slot:img>
                        <v-img max-height="72" max-width="72" src="../../assets/course/student_list.png"></v-img>
                        <span class="text-lg font-bold"> รายชื่อนักเรียน </span>
                    </template>
                </img-card>
            </v-col>
        </v-row>
        <!-- BODY -->
        <v-card>
            <v-card-text>
                <v-tabs-items v-model="tab">
                    <!-- COURSE -->
                    <v-tab-item value="course">
                        <courseCard v-if="course_edit"></courseCard>
                        <template v-else>
                            <v-card flat>
                                <v-card-text class="border border-2 border-[#ff6b81] border-600 rounded-lg" align="center"> 
                                    <v-img 
                                        src="../../assets/course/student_list.png" 
                                        max-height="299"
                                        max-width="365">
                                    </v-img>
                                </v-card-text>
                            </v-card>
                            <v-card flat>
                                <header-card title="รายละเอียด"></header-card>
                                <v-card-text class="py-0">
                                    <v-divider class="mb-3"></v-divider>
                                    <v-row>
                                        <v-col>
                                            <rowData title="ชื่อคอร์ส (ภาษาไทย)" vertical>
                                                เวิร์คช้อปไวโอลินพื้นฐาน
                                            </rowData>
                                        </v-col>
                                        <v-col>
                                            <rowData title="ชื่อคอร์ส (ภาษาอังกฤษ)" vertical>
                                                Violin foundation workshop
                                            </rowData>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col>
                                            <rowData title="ชื่ออาณาจักร" vertical>
                                                อาณาจักรสมัยใหม่
                                            </rowData>
                                        </v-col>
                                        <template v-if="co"></template>
                                        <v-col>
                                            <rowData title="วันเปิดคอร์ส" vertical>
                                                16 ม.ค. 2566
                                            </rowData>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col>
                                            <rowData title="จำนวนชั่วโมงการเรียน /ครั้ง" vertical>
                                                60 นาที
                                            </rowData>
                                        </v-col>
                                        <v-col>
                                            <rowData title="สถานที่เรียน" vertical>
                                                ศูนย์กรุงเทพ
                                            </rowData>
                                        </v-col>
                                    </v-row>
                                    <rowData title="โค้ช" vertical>
                                        โค้ชพอล
                                    </rowData>
                                    <rowData title="รายละเอียดคอร์ส" vertical>
                                        หลักสูตรนี้รียนตั้งแต่ระดับพื้นฐานจนกึ่งการเล่นพลงคลาสสิคระดับสูง โดยใช้ตำรา
                                        แบบฝึกของ Suzuki Violin เน้นทักษะการอ่านโน้ต ทักษะการฟังแยกเสียง และสอนแทรกทฤษฎีดนตรีสากล ตลอดจนการดนตรีจากประเทศอังกฤษและประเทศชั้นนำ
                                    </rowData>
                                    <rowData title="Music performance" vertical>
                                        A   สุนทรียะด้านการฟังและเล่นดนตรี
                                        K   ทฤษฎีดนตรีสากล
                                        ร1 ทักษะการอ่านโน้ตดนตรีสากล
                                        s2 ทักษะการฟังเสียง (Ear training)
                                        S3 ทักษะการบรรเลงเตี่ยว (Solo)
                                        S4 ทักษะการบรรเลงรวมวง (Accom)
                                    </rowData>
                                    <rowData title="Certification" vertical>
                                        สู่การสอบเทียนมาตรฐาน Trinity แล: ABRSM
                                    </rowData>
                                </v-card-text>
                            </v-card>
                        </template>
                        <!-- Actions -->
                        <v-row  class="px-4" v-if="!course_edit" >
                            <v-col  align="right">
                                <v-btn 
                                    color="#FF6B81"
                                    class="white--text btn-size-lg"
                                    depressed
                                    @click="course_edit = true"
                                >แก้ไข
                                </v-btn>
                            </v-col>
                        </v-row>
                        <v-row class="px-4"  v-if="course_edit">
                            <v-col align="right">
                                <v-btn 
                                    color="#FF6B81"
                                    class="btn-size-lg"
                                    outlined
                                    @click="course_edit = false"
                                >ยกเลิก
                                </v-btn>
                            </v-col>
                            <v-col cols="auto"> 
                                <v-btn
                                    color="#FF6B81"
                                    class="white--text btn-size-lg"
                                    depressed
                                >บันทึก
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-tab-item>
                    <!-- COACH AND TIME -->
                    <v-tab-item value="time and coach"> 
                        <coachs-card disable></coachs-card>
                    </v-tab-item>
                    <!-- PACKAGE -->
                    <v-tab-item value="package">
                        <package-card disable></package-card>
                    </v-tab-item>
                    <!-- STUDENT LIST -->
                    <v-tab-item value="student list">
                        <v-tabs v-model="student_tab" color="#ff6b81" class="mb-3">
                            <v-tab value="students in course">นักเรียกในคอร์ส</v-tab>
                            <v-tab value="student booking">นักเรียกจองคิว</v-tab>
                        </v-tabs>
                        <v-tabs-items v-model="student_tab">
                            <v-tab-item valus="students in course">
                                <v-card flat dent class="mb-3 rounded-lg">
                                    <v-card-text class="bg-[#FCE0E7] rounded-lg">
                                        <span class="text-[#ff6b81] font-bold">รายชื่อนักเรียน</span>
                                    </v-card-text>
                                </v-card>
                                <div v-for="(course_data,course_index) in course" :key="course_index">
                                    <v-card outlined dense class="bg-[#FCFCFC]">
                                        <v-card-text >
                                            <v-row dense class="d-flex align-center">
                                                <v-col cols="auto" >
                                                    <v-icon color="#ff6b81">mdi-account</v-icon>
                                                </v-col>
                                                <v-col class="font-bold">
                                                    โค้ช: {{ course_data.name }}
                                                </v-col>
                                                <v-col cols="auto">
                                                    <v-icon>mdi-chevron-down</v-icon>
                                                </v-col>
                                            </v-row>
                                        </v-card-text>
                                    </v-card>
                                    <div class="pa-3 bg-[#FCFCFC] rounded-b-lg">
                                        <!-- FILTER -->
                                        <v-row dense class="mb-3">
                                            <v-col>
                                                <v-autocomplete 
                                                    dense
                                                    outlined
                                                    hide-details
                                                    placeholder="วัน"
                                                ></v-autocomplete>
                                            </v-col>
                                            <v-col>
                                                <v-autocomplete 
                                                    dense
                                                    outlined
                                                    hide-details
                                                    placeholder="วันที่"
                                                ></v-autocomplete>
                                            </v-col>
                                            <v-col>
                                                <v-autocomplete 
                                                    dense
                                                    outlined
                                                    hide-details
                                                    placeholder="เวลา"
                                                ></v-autocomplete>
                                            </v-col>
                                            <v-col>
                                                <v-autocomplete 
                                                    dense
                                                    outlined
                                                    hide-details
                                                    placeholder="package"
                                                ></v-autocomplete>
                                            </v-col>
                                        </v-row>
                                        <!-- Herder -->
                                        <v-row class="mb-3">
                                            <v-col cols="3" align="center">วันและวันที่</v-col>
                                            <v-col cols="3" align="center">เวลาเรียน</v-col>
                                            <v-col cols="3" align="center">แพ็คเกจ</v-col>
                                            <v-col align="right">
                                               
                                            </v-col>
                                        </v-row>
                                        <v-card outlined class="mb-3" dense v-for="(schedule, schedule_index) in course_data.schedule" :key="schedule_index">
                                            <v-card-text class="pa-2">
                                                <v-row dense class="d-flex align-center">
                                                    <v-col cols="3" class="font-bold" align="center">{{ schedule.date }}</v-col>
                                                    <v-col cols="3" class="font-bold" align="center">{{ schedule.time }}</v-col>
                                                    <v-col cols="3" align="center">
                                                        <v-chip text-color="white"  :color=" schedule.package === 'Exclusive Package' ? 'primary' : 'pink'">{{ schedule.package }}</v-chip>
                                                    </v-col>
                                                    <v-col align="right">
                                                        <v-icon>mdi-chevron-down</v-icon>
                                                    </v-col>
                                                </v-row>
                                            </v-card-text>
                                        </v-card>
                                    </div>
                                </div>      
                            </v-tab-item>
                            <v-tab-item valus="student booking">
                            </v-tab-item>
                        </v-tabs-items>
                    </v-tab-item>
                </v-tabs-items>  
            </v-card-text>
        </v-card>
      </v-container>
    </v-app>
</template>
  
<script>
import courseCard from '@/components/course/courseCard.vue';
import packageCard from '@/components/course/packageCard.vue';
import coachsCard from '@/components/course/coachsCard.vue';
import HeaderPage from '@/components/header/headerPage.vue';
import headerCard from '@/components/header/headerCard.vue';
import ImgCard from '@/components/course/imgCard.vue';
import rowData from '@/components/label/rowData.vue';
    export default {
        name:"coureDetail",
        components: {HeaderPage, ImgCard, courseCard, headerCard ,rowData, coachsCard, packageCard},
        data: () => ({ 
            breadcrumbs : [
                {text:"จัดการคอร์สทั้งหมด",to:"CourseList"},
                {text:"รายละเอียดคอร์สเรียน",to:""}
            ],
            tab : "student list",
            student_tab : null,
            course_edit : false,
            course : [
                {
                    name : "องศา วงกลม",
                    schedule : [
                        {
                            date : "เสาร์ 12 กรกฏาคม 2566",
                            time : "10.00น. - 11.00น.",
                            package : "Exclusive Package",
                            students : [
                                {
                                    student_name : 'จิตรลดา มาลินี',
                                    nick_name  : "แตง",
                                    start_date : "10/07/2022",
                                    end_date : " 17/08/2022",
                                    period_package : "รายวัน",
                                    amount : "4"
                                },
                                {
                                    student_name : 'จิตรลดา มาลินี',
                                    nick_name  : "แตง",
                                    start_date : "10/07/2022",
                                    end_date : " 17/08/2022",
                                    period_package : "รายวัน",
                                    amount : "4"
                                },
                                {
                                    student_name : 'จิตรลดา มาลินี',
                                    nick_name  : "แตง",
                                    start_date : "10/07/2022",
                                    end_date : " 17/08/2022",
                                    period_package : "รายวัน",
                                    amount : "4"
                                },
                            ],
                        },
                        {
                            date : "เสาร์ 12 กรกฏาคม 2566",
                            time : "10.00น. - 11.00น.",
                            package : "Group Package",
                            students : [
                                {
                                    student_name : 'จิตรลดา มาลินี',
                                    nick_name  : "แตง",
                                    start_date : "10/07/2022",
                                    end_date : " 17/08/2022",
                                    period_package : "รายวัน",
                                    amount : "4"
                                },
                                {
                                    student_name : 'จิตรลดา มาลินี',
                                    nick_name  : "แตง",
                                    start_date : "10/07/2022",
                                    end_date : " 17/08/2022",
                                    period_package : "รายวัน",
                                    amount : "4"
                                },
                                {
                                    student_name : 'จิตรลดา มาลินี',
                                    nick_name  : "แตง",
                                    start_date : "10/07/2022",
                                    end_date : " 17/08/2022",
                                    period_package : "รายวัน",
                                    amount : "4"
                                },
                            ],
                        },
                    ]
                },
                {
                    name : "พงศพัศ เดชบุญ",
                    schedule : [
                        {
                            date : "เสาร์ 12 กรกฏาคม 2566",
                            time : "10.00น. - 11.00น.",
                            package : "Exclusive Package",
                            students : [
                                {
                                    student_name : 'จิตรลดา มาลินี',
                                    nick_name  : "แตง",
                                    start_date : "10/07/2022",
                                    end_date : " 17/08/2022",
                                    period_package : "รายวัน",
                                    amount : "4"
                                },
                                {
                                    student_name : 'จิตรลดา มาลินี',
                                    nick_name  : "แตง",
                                    start_date : "10/07/2022",
                                    end_date : " 17/08/2022",
                                    period_package : "รายวัน",
                                    amount : "4"
                                },
                                {
                                    student_name : 'จิตรลดา มาลินี',
                                    nick_name  : "แตง",
                                    start_date : "10/07/2022",
                                    end_date : " 17/08/2022",
                                    period_package : "รายวัน",
                                    amount : "4"
                                },
                            ],
                        },
                        {
                            date : "เสาร์ 12 กรกฏาคม 2566",
                            time : "10.00น. - 11.00น.",
                            package : "Group Package",
                            students : [
                                {
                                    student_name : 'จิตรลดา มาลินี',
                                    nick_name  : "แตง",
                                    start_date : "10/07/2022",
                                    end_date : " 17/08/2022",
                                    period_package : "รายวัน",
                                    amount : "4"
                                },
                                {
                                    student_name : 'จิตรลดา มาลินี',
                                    nick_name  : "แตง",
                                    start_date : "10/07/2022",
                                    end_date : " 17/08/2022",
                                    period_package : "รายวัน",
                                    amount : "4"
                                },
                                {
                                    student_name : 'จิตรลดา มาลินี',
                                    nick_name  : "แตง",
                                    start_date : "10/07/2022",
                                    end_date : " 17/08/2022",
                                    period_package : "รายวัน",
                                    amount : "4"
                                },
                            ],
                        },
                    ]
                }
            ]
        }),
        created() {},
        mounted() {},
        watch: {},
        computed: {},
        methods: {},
    };
</script>
  
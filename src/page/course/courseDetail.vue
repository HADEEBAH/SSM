<template>
    <v-app>
      <v-container>
        <header-page :breadcrumbs="breadcrumbs"></header-page>
        <v-row class="mb-3">
            <v-col cols="12" sm="2" @click="tab='course'">
                <img-card vertical class="cursor-pointer" :class="tab === 'course' ? 'img-card-active':''">
                    <template v-slot:img>
                        <v-img max-height="72" max-width="72" src="../../assets/course/course.png"></v-img>
                        <span class="text-lg font-bold"> คอร์สเรียน </span>
                    </template>
                </img-card>
            </v-col>
            <v-col cols="12" sm="2" @click="tab='time and coach'">
                <img-card vertical class="cursor-pointer" :class="tab === 'time and coach' ? 'img-card-active':''">
                    <template v-slot:img>
                        <v-img max-height="72" max-width="72" src="../../assets/course/time_and_coach.png"></v-img>
                        <span class="text-lg font-bold"> ช่วงเวลาและโค้ช </span>
                    </template>
                </img-card>
            </v-col>
            <v-col cols="12" sm="2" @click="tab='package'">
                <img-card vertical class="cursor-pointer" :class="tab === 'package' ? 'img-card-active':''">
                    <template v-slot:img>
                        <v-img max-height="72" max-width="72" src="../../assets/course/package.png"></v-img>
                        <span class="text-lg font-bold"> แพ็คเกจ </span>
                    </template>
                </img-card>
            </v-col>
            <v-col cols="12" sm="2" @click="tab='student list'">
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
                    <v-tab-item value="course">
                        <courseCard v-if="course_edit"></courseCard>
                        <v-row v-if="!course_edit" class="px-8">
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
                        <v-row class="px-8"  v-if="course_edit">
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
                </v-tabs-items>
              
            </v-card-text>
        </v-card>
      </v-container>
    </v-app>
</template>
  
<script>
import courseCard from '@/components/course/courseCard.vue'
import HeaderPage from '@/components/header/headerPage.vue';
import ImgCard from '@/components/course/imgCard.vue';
    export default {
        name:"coureDetail",
        components: {HeaderPage, ImgCard, courseCard},
        data: () => ({
            breadcrumbs : [
                {text:"จัดการคอร์สทั้งหมด",to:"CourseList"},
                {text:"รายละเอียดคอร์สเรียน",to:""}
            ],
            tab : "course",
            course_edit : false,
        }),
        created() {},
        mounted() {},
        watch: {},
        computed: {},
        methods: {},
    };
</script>
  
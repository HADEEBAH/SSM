<template>
    <v-app>
        <v-tabs
            v-model="tab"
            fixed-tabs
            background-color="#FFF0F5"
            light
            color="#ff6b81"
        >
            <v-tab href="#teaching list">
                รายการสอนวันนี้
            </v-tab>
            <v-tab href="#my teaching">
               การสอนของฉัน
            </v-tab>
            <v-tab href="#request leave">
                ลงเวลาเพื่อขอลา
            </v-tab>
            <v-tabs-items v-model="tab">
                <v-tab-item value="teaching list" class="pa-4">
                    <v-row>
                        <v-col></v-col>
                        <v-col cols="3" align="right">
                            <v-select  outlined dense :items="time_frame_list" v-model="time_frame"></v-select>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            วันจันทร์ที่ 25 กรกฎาคม 2565
                            <v-menu
                                ref="menu"
                                v-model="menu"
                                :close-on-content-click="false"
                                :return-value.sync="date"
                                transition="scale-transition"
                                offset-y
                                min-width="auto"
                            >
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn icon 
                                        v-bind="attrs"
                                        v-on="on">
                                        <v-icon color="#ff6b81">mdi-calendar-blank-outline</v-icon>
                                    </v-btn>
                                
                                </template>
                                <v-date-picker
                                    v-model="date"
                                    no-title
                                    @input="menu1 = false"
                                ></v-date-picker>
                                </v-menu>
                        </v-col>
                    </v-row>
                    <!-- COURSE LIST -->
                    <div v-for="(course, course_index) in courses" :key="course_index">
                        <v-card outlined dense>
                            <v-card-title>
                                <v-row>
                                    <v-col cols="auto">
                                        <v-img max-height="100" max-width="100" src="https://cdn.vuetifyjs.com/images/cards/cooking.png"></v-img>
                                    </v-col>
                                    <v-col></v-col>
                                </v-row>
                            </v-card-title>
                        </v-card>
                    </div>
                </v-tab-item>
                <v-tab-item value="my teaching">my teaching</v-tab-item>
                <v-tab-item value="request leave">request leave</v-tab-item>
            </v-tabs-items>
        </v-tabs>  
    </v-app>
  </template>
  <script>
  export default {
    name:"menageCourse",
    components: {},
    data: () => ({
        tab : "",
        time_frame_list : ["รายวัน", "รายสัปดาห์", "รายเดือน"],
        time_frame : "",
        menu1 : false,
        date : "",
        courses : [
            { course_name: "เปียโนป๊อปเบื้องต้น (Popular Piano ) ", coach_name: "นายสมชาย ศรีชาตรี", time: "10:00 - 11:00", course_hours : "1",},
            { course_name: "เปียโนป๊อปเบื้องต้น (Popular Piano ) ", coach_name: "นายสมชาย ศรีชาตรี", time: "10:00 - 11:00", course_hours : "1",},
            { course_name: "เปียโนป๊อปเบื้องต้น (Popular Piano ) ", coach_name: "นายสมชาย ศรีชาตรี", time: "10:00 - 11:00", course_hours : "1",},
            { course_name: "เปียโนป๊อปเบื้องต้น (Popular Piano ) ", coach_name: "นายสมชาย ศรีชาตรี", time: "10:00 - 11:00", course_hours : "1",},
            { course_name: "เปียโนป๊อปเบื้องต้น (Popular Piano ) ", coach_name: "นายสมชาย ศรีชาตรี", time: "10:00 - 11:00", course_hours : "1",},
            { course_name: "เปียโนป๊อปเบื้องต้น (Popular Piano ) ", coach_name: "นายสมชาย ศรีชาตรี", time: "10:00 - 11:00", course_hours : "1",},
        ],
    }),
    created() {},
    mounted() {
        this.$store.dispatch("NavberUserModules/changeTitleNavber", "จัดการ");
    },
    watch: {},
    computed: {},
    methods: {},
  };
  </script>
  
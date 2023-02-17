<template>
    <v-app>
      <v-container>
        <v-row dense>
            <v-col cols="12">
                <v-text-field  outlined hide-details dense prepend-inner-icon="mdi-magnify" placeholder="ค้นหาอาณาจัดรการเรียนรู้ที่คุณสนใจได้ที่นี่"></v-text-field>
            </v-col>
        </v-row>
        <v-row dense>
            <v-col class="text-lg font-bold">{{ category.name }}</v-col>
        </v-row>
        <v-row dense>
            <v-col cols="5" v-for="(type, type_index) in course_type" :key="type_index">
                <v-card flat @click="type_selected = type.value" class="rounded-lg">
                    <v-card-text :class="type_selected === type.value ? 'bg-[#FF6B81]' : 'bg-[#F5F5F5]'" class="rounded-lg flex justify-center align-center pa-2">
                        <label :class="type_selected === type.value ? 'text-white' : ' text-[#B3B3B3]' " class="font-bold mr-2">{{type.name}}</label>
                        <v-avatar size="32" color="white" class="font-bold" :class="type_selected === type.value ? 'text-[#ff6b81]' : 'text-[#B3B3B3]'">{{ type.amount }}</v-avatar>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <v-row dense>
            <template v-if="!loading">
                <v-col cols="6" sm="4" v-for="(course, course_index) in category.courses" :key="course_index">
                    <v-card @click="$router.push({name: 'userCourseDetail_courseID', params:{course_id : course.course_id}})">
                        <v-img
                            height="109"
                            src="https://cdn.vuetifyjs.com/images/cards/cooking.png"
                        >
                        <v-row>
                            <v-col class="pa-4" align="right"> <v-chip  color="#F9B320" text-color="white">{{ `${course.period}ชั่วโมง`  }}</v-chip></v-col>
                        </v-row>
                        </v-img>
                        <v-card-title class="  font-bold text-sm pa-2">
                        <v-row dense class="d-flex align-center">
                            <v-col>{{ course.course_name }}</v-col>
                            <v-col class="d-flex align-center text-[#ff6b81]" cols="auto"><v-icon color="#ff6b81" size="18">mdi-account-group-outline</v-icon>{{ `${course.amount}/${course.maximum}` }}</v-col>
                        </v-row>  
                        </v-card-title>
                        <v-card-text class="text-xs pa-2">
                            หลักสูตรนี้เน้นการฝึกเล่นเปียโนประกอบการร้องเพลง ทั้งบรรเลงเดี่ยวและรวมวงดนตรีพร้อมทั้งยังมีการผสม
                            ผสานการร้อลเพลงและการเล่นเปีโนอย่างลงตัว...
                        </v-card-text>
                    </v-card>
                </v-col>
            </template>
            <template v-else>
                <v-col cols="6" v-for="(course, course_index) in category.courses" :key="course_index">
                    <v-card>
                        <v-skeleton-loader
                            type="image, list-item"
                        ></v-skeleton-loader>
                    </v-card>
                </v-col>
            </template>
           
        </v-row>
      </v-container>
    </v-app>
  </template>
  
  <script>
    export default {
        name:"userCourseList",  
        data: () => ({
            loading : true,
            course_type : [{name : "คอร์สทั่วไป", amount : "8", value:"general_course"},{name : "คอร์สระยะสั้น", amount : "2", value:'short_course'}],
            type_selected : "general_course",
            category:{
                name : "อาณาจักรดนตรีสมัยใหม่",
                courses:[
                    {course_id : '00001', course_name : "เปียโน + ขับร้อง", amount : 9, maximum: 15, detail : "หลักสูตรนี้เน้นการฝึกเล่นเปียโนประกอบการร้องเพลง ทั้งบรรเลงเดี่ยวและรวมวงดนตรีพร้อมทั้งยังมีการผสม ผสานการร้อลเพลงและการเล่นเปีโนอย่างลงตัว...", period: 1},
                    {course_id : '00002', course_name : "เปียโน + ขับร้อง", amount : 9, maximum: 15, detail : "หลักสูตรนี้เน้นการฝึกเล่นเปียโนประกอบการร้องเพลง ทั้งบรรเลงเดี่ยวและรวมวงดนตรีพร้อมทั้งยังมีการผสม ผสานการร้อลเพลงและการเล่นเปีโนอย่างลงตัว...", period: 1},
                    {course_id : '00003', course_name : "เปียโน + ขับร้อง", amount : 9, maximum: 15, detail : "หลักสูตรนี้เน้นการฝึกเล่นเปียโนประกอบการร้องเพลง ทั้งบรรเลงเดี่ยวและรวมวงดนตรีพร้อมทั้งยังมีการผสม ผสานการร้อลเพลงและการเล่นเปีโนอย่างลงตัว...", period: 1},
                    {course_id : '00004', course_name : "เปียโน + ขับร้อง", amount : 9, maximum: 15, detail : "หลักสูตรนี้เน้นการฝึกเล่นเปียโนประกอบการร้องเพลง ทั้งบรรเลงเดี่ยวและรวมวงดนตรีพร้อมทั้งยังมีการผสม ผสานการร้อลเพลงและการเล่นเปีโนอย่างลงตัว...", period: 1},
                ]
            }
        }),
        created() {},
        mounted() {
            setTimeout(() => {
                this.loading = false
            }, 200);
            this.$store.dispatch("NavberUserModules/changeTitleNavber","คอร์สเรียน")
        },
        watch: {
            "type_selected":function(){
                this.loading = true
                setTimeout(() => {
                    this.loading = false
                }, 200);
            }
        },
        computed: {},
        methods: {},
    };
  </script>
  
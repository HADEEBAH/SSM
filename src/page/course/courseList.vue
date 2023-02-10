<template>
    <v-app>
      <v-container>
        <header-page title="จัดการคอร์สทั้งหมด">
            <v-text-field class="w-full" outlined dense hide-details prepend-inner-icon="mdi-magnify" v-model="search" placeholder="ค้นหา"></v-text-field>
        </header-page>
        <v-row class="mb-2">
            <v-col cols="12" sm="4"  @click="tab = 'all'" >
                <img-card class="cursor-pointer" :class="tab === 'all' ? 'img-card-active':''" title="คอร์สทั้งหมด" count="10" units="รายการ" >
                    <template v-slot:img> 
                        <v-img max-height="90" max-width="70" src="../../assets/course/all_course.png"></v-img>
                    </template>
                </img-card>
            </v-col>
            <v-col cols="12" sm="4" @click="tab = 'general'">
                <img-card  class="cursor-pointer" :class="tab === 'general' ? 'img-card-active':''" title="คอร์สทั่วไป" count="5" units="รายการ">
                    <template v-slot:img> 
                        <v-img  max-height="90" max-width="70" src="../../assets/course/general_course.png"></v-img>
                    </template>
                </img-card>
            </v-col>
            <v-col cols="12" sm="4" @click="tab = 'short'"> 
                <img-card  class="cursor-pointer" :class="tab === 'short' ? 'img-card-active':''" title="คอร์สระยะสั้น" count="5" units="รายการ">
                    <template v-slot:img> 
                        <v-img  max-height="90" max-width="70" src="../../assets/course/short_course.png"></v-img>
                    </template>
                </img-card>
            </v-col>
        </v-row>
        <v-data-table
            class="elevation-1 header-table"
            :headers="column"
            :items="courses"
        >
        <template v-slot:[`item.status`]="{ item }">
            <v-autocomplete dense outlined hide-details item-color="pink" :items="status" v-model="item.status">
            </v-autocomplete>
        </template>
        <template v-slot:[`item.actions`] ="{item}">
            <v-btn text color="#FF6B81" @click="$router.push({name:'Course_courseID', params:{course_id : item.course_id}})">
                <v-icon>mdi-text-box-search-outline</v-icon>
                ดูรายละเอียด
            </v-btn>
        </template>
        </v-data-table>
      </v-container>
    </v-app>
  </template>
  <script>
  import headerPage from '@/components/header/headerPage.vue';
  import imgCard from '@/components/course/imgCard.vue';
  export default {
    name:"courseList",
    components: {
        headerPage,
        imgCard,
    },
    data: () => ({
        search : "",
        tab : "all",
        status: [
            "เปิดเรียน",
            "ปิดคอร์สเรียน",
            "ปิดชั่วคราว",
        ],
        column:[
            {text: 'ชื่อคอร์ส',align: 'start',sortable: false, value: 'course'},
            {text: 'ชื่ออาณาจักร',align: 'start',sortable: false, value: 'category'},
            {text: 'ประเภทคอร์ส',align: 'start',sortable: false, value: 'course_type'},
            {text: 'วันเปิด-ปิดรับสมัคร',align: 'start',sortable: false, value: 'course_open'},
            {text: 'สถานะ',align: 'center',sortable: false, value: 'status'},
            {text: '', align: 'center', value: 'actions', sortable: false },
        ],
        courses:[
            {course_id:'000001', course : "เปียโน Kpop",category : "ศิลปะสมัยใหม่", course_type:"คอร์สทั่วไป",course_open : "12 มี.ค. - 29 มี.ค. 2566", status:"เปิดเรียน"},
            {course_id:'000002', course : "เปียโนสากล",category : "ศิลปะสมัยใหม่", course_type:"คอร์สระยะสั้น",course_open : "12 มี.ค. - 29 มี.ค. 2566", status:"ปิดคอร์สเรียน"},
            {course_id:'000003', course : "ไวโอลิน",category : "ศิลปะสมัยใหม่", course_type:"คอร์สทั่วไป",course_open : "12 มี.ค. - 29 มี.ค. 2566", status:"ปิดชั่วคราว"},
            {course_id:'000004', course : "เวิร์กช๊อปกีต้าร์ไฟฟ้า เบื้องต้น",category : "คอร์สระยะสั้น", course_type:"คอร์สทั่วไป",course_open : "12 มี.ค. - 29 มี.ค. 2566", status:"เปิดเรียน"},
            {course_id:'000005', course : "ว่ายน้ำ",category : "กีฬา P.E.", course_type:"คอร์สทั่วไป",course_open : "12 มี.ค. - 29 มี.ค. 2566", status:"เปิดเรียน"},
        ],
    }),
    created() {},
    mounted() {},
    watch: {},
    computed: {},
    methods: {},
  };
  </script>
<style>
   
</style>
  
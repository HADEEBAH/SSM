<template>
    <v-app>
      <v-container>
        <header-page title="จัดการคอร์สทั้งหมด">
            <v-text-field class="w-full" outlined dense hide-details prepend-inner-icon="mdi-magnify" v-model="search" placeholder="ค้นหา"></v-text-field>
        </header-page>
        <v-row>
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
        column:[
            {text: 'ชื่อคอร์ส',align: 'start',sortable: false, value: 'course'},
            {text: 'ชื่ออาณาจักร',align: 'start',sortable: false, value: 'category'},
            {text: 'ประเภทคอร์ส',align: 'start',sortable: false, value: 'course_type'},
            {text: 'วันเปิด-ปิดรับสมัคร',align: 'start',sortable: false, value: 'course_open'},
            {text: 'สถานะ',align: 'center',sortable: false, value: 'status'},
            { text: '', align: 'center', value: 'actions', sortable: false },
        ],
        courses:[
            
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
    .img-card-active.v-card{
        background-color: #FDF7E3;
    }
</style>
  
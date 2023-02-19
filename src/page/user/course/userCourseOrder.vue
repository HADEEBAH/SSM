<template>
    <v-app>
      <v-container>
        <ImgCard color="#FEFBFC" outlined class="mb-3">
            <template v-slot:img>
                <v-row dense class="d-flex align-center h-full">
                    <v-col>
                        <v-img class="rounded-lg" src="https://cdn.vuetifyjs.com/images/cards/cooking.png" max-height="122" max-width="122"></v-img>
                    </v-col>
                </v-row>
            </template>
            <template v-slot:header>
                <div class="text-md font-bold"> เปียโนป๊อปเบื้องต้น (Popular ... </div>
                <div class="text-sm"> โดย ศูนย์ดนตรี Manila Tamarind ... </div>
            </template>
            <template v-slot:detail>
                <v-row dense>
                    <v-col cols="12" sm="6" class="pa-0">
                        <rowData mini col_detail="5" icon="mdi-clock-outline">1 ชม. / ครั้ง</rowData>
                    </v-col>
                    <v-col cols="12" sm="6"  class="pa-0"> 
                        <rowData mini col_detail="5" icon="mdi-account-group-outline">9 / 15 ที่นั่ง</rowData> 
                    </v-col>
                </v-row>
            </template>
        </ImgCard>
        <!-- SELECT CLASS DATE -->
        <v-row dense>
            <v-col class="text-lg font-bold">
                เลือกช่วงวันเรียน
            </v-col>
        </v-row>
        <v-radio-group
            v-model="order.courses[0].day"
        >
            <v-row>
                <v-col cols="6" v-for="(date , date_index) in class_dates" :key="date_index">
                    <v-radio
                        :label="date.label"
                        color="#ff6B81"
                        :value="date"
                    ></v-radio>
                </v-col>
            </v-row>
        </v-radio-group>
        <template v-if="order.courses[0].day">
            <v-row>
                <v-col class="text-lg font-bold">เลือกช่วงเวลาเรียน</v-col>
            </v-row>
            <v-radio-group 
                v-model="order.courses[0].time_period"
            >
                <v-row>
                    <v-col cols="6" v-for="(time , time_index) in order.courses[0].day.times" :key="time_index">
                        <v-radio
                            color="#ff6B81"
                            :value="`${time.start}-${time.end}`"
                        >
                            <template v-slot:label>
                                {{`${time.start}-${time.end}`}} 
                            </template>
                        </v-radio>
                    </v-col>
                </v-row>
            </v-radio-group>
        </template>
        <!-- REGISTER -->
        <v-row dense>
            <v-col class="text-lg font-bold">
                สมัครเรียนให้
            </v-col>
        </v-row>
        <v-row dense>
            <v-col cols="12" sm="6">
                <v-checkbox color="#ff6B81" hide-details label="สมัครเรียนให้ตัวเอง"></v-checkbox>
            </v-col>
            <v-col cols="12" sm="6">
                <v-checkbox color="#ff6B81" hide-details label="สมัครเรียนให้ผู้อื่น"></v-checkbox>
            </v-col>
        </v-row>
      </v-container>
    </v-app>
  </template>
  
  <script>
  import ImgCard from '@/components/course/imgCard.vue'
  import rowData from '@/components/label/rowData.vue'
import { mapGetters } from 'vuex';
  export default {
    name:"userCourseOrder",
    components: {ImgCard, rowData},
    data: () => ({
        class_dates :[
            { label : "อาทิตย์", value: 0 ,times : [
                {start : '9:00',end : '10:00', maximum_student : 38, students_amount : 26 },
                {start : '10:00',end : '11:00', maximum_student : 38, students_amount : 26 },
                {start : '11:00',end : '12:00', maximum_student : 38, students_amount : 26 },
                {start : '12:00',end : '13:00', maximum_student : 38, students_amount : 26 },
            ] },
            { label : "จันทร์", value: 1 ,times : [
                {start : '9:00',end : '10:00', maximum_student : 38, students_amount : 26 },
                {start : '10:00',end : '11:00', maximum_student : 38, students_amount : 26 },
                {start : '11:00',end : '12:00', maximum_student : 38, students_amount : 26 },
            ] },
            { label : "อังคาร", value: 2 ,times : [
                {start : '9:00',end : '10:00', maximum_student : 38, students_amount : 26 },
                {start : '10:00',end : '11:00', maximum_student : 38, students_amount : 26 },
                {start : '11:00',end : '12:00', maximum_student : 38, students_amount : 26 },
            ]  },
            { label : "พุทธ", value: 3 ,times : [
                {start : '9:00',end : '10:00', maximum_student : 38, students_amount : 26 },
                {start : '10:00',end : '11:00', maximum_student : 38, students_amount : 26 },
                {start : '11:00',end : '12:00', maximum_student : 38, students_amount : 26 },
            ]  },
            { label : "พฤหัสบดี", value: 4  },
            { label : "ศุกร์", value: 5  },
            { label : "เสาร์", value: 6  },
        ],
        register_type : "",
    }),
    created() {},
    mounted() {
        this.$store.dispatch("NavberUserModules/changeTitleNavber","สมัครเรียน")
    },
    watch: {},
    computed: {
        ...mapGetters({
            order : 'OrderModules/getOrder'
        })
    },
    methods: {},
  };
  </script>
  
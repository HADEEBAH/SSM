<template>
    <v-container>
        <headerPage title="การอนุมัติลา"></headerPage>
    
        <v-row class="mb-2">
            <v-col cols="12" sm="3"  @click="tab = 'all'" >
                <img-card class="cursor-pointer" :class="tab === 'all' ? 'img-card-active':''">
                    <template v-slot:img> 
                        <v-img max-height="90" max-width="70" src="../../../assets/coachLeave/all.png"></v-img>
                    </template>
                    <template v-slot:header>
                        <div class="font-bold"> ทั้งหมด </div>
                    </template>
                    <template v-slot:detail>
                        <v-row class="d-flex align-end">
                            <v-col align="center" class="text-3xl font-bold">10</v-col>
                            <v-col class="text-sm">รายการ</v-col>
                        </v-row>
                    </template>
                </img-card>
            </v-col>
            <v-col cols="12" sm="3" @click="tab = 'accepted'">
                <img-card  class="cursor-pointer" :class="tab === 'accepted' ? 'img-card-active':''">
                    <template v-slot:img> 
                        <v-img  max-height="90" max-width="70" src="../../../assets/coachLeave/accept.png"></v-img>
                    </template>
                    <template v-slot:header>
                        <div class="font-bold"> อนุมัติ </div>
                    </template>
                    <template v-slot:detail>
                        <v-row class="d-flex align-end">
                            <v-col align="center" class="text-3xl font-bold">5</v-col>
                            <v-col class="text-sm">รายการ</v-col>
                        </v-row>
                    </template>
                </img-card>
            </v-col>
            <v-col cols="12" sm="3" @click="tab = 'waitToAccept'"> 
                <img-card  class="cursor-pointer" :class="tab === 'waitToAccept' ? 'img-card-active':''">
                    <template v-slot:img> 
                        <v-img  max-height="90" max-width="70" src="../../../assets/coachLeave/wait.png"></v-img>
                    </template>
                    <template v-slot:header>
                        <div class="font-bold"> รออนุมัติ </div>
                    </template>
                    <template v-slot:detail>
                        <v-row class="d-flex align-end">
                            <v-col align="center" class="text-3xl font-bold">5</v-col>
                            <v-col class="text-sm">รายการ</v-col>
                        </v-row>
                    </template>
                </img-card>
            </v-col>
            <v-col cols="12" sm="3" @click="tab = 'disaccept'"> 
                <img-card  class="cursor-pointer" :class="tab === 'disaccept' ? 'img-card-active':''">
                    <template v-slot:img> 
                        <v-img  max-height="90" max-width="70" src="../../../assets/coachLeave/disaccept.png"></v-img>
                    </template>
                    <template v-slot:header>
                        <div class="font-bold"> ปฏิเสธ </div>
                    </template>
                    <template v-slot:detail>
                        <v-row class="d-flex align-end">
                            <v-col align="center" class="text-3xl font-bold">5</v-col>
                            <v-col class="text-sm">รายการ</v-col>
                        </v-row>
                    </template>
                </img-card>
            </v-col>
        </v-row>

        <v-expand-x-transition transition="scale-transition">
        <div v-if="tab = 'all'">
            <!--   v-for="(item, item_index) in student_data"
            :key="item_index" -->
          <v-card
          
            class="my-5"
          >
          <v-data-table 
            class="elevation-1 header-table"
            :headers="column"
            :items="courses"
            :loading="LoadingTable"
        >
        <template v-slot:[`item.status`]="{ item }">
            <v-autocomplete dense outlined hide-details item-color="pink" :items="status" v-model="item.status">
            </v-autocomplete>
        </template>
        <template>
            <v-btn text color="#FF6B81" >
                <v-icon>mdi-text-box-search-outline</v-icon>
                ดูรายละเอียด
            </v-btn>
        </template>
        </v-data-table>
          </v-card>
        </div>
      </v-expand-x-transition>
  
    </v-container>
  </template>
  
  <script>
  import headerPage from "@/components/header/headerPage.vue";
  import imgCard from '@/components/course/imgCard.vue';
  import { mapActions, mapGetters } from "vuex";
  export default {
    components: {
          headerPage,
          imgCard
    },
      data: () => ({
            tab: "all",
            column:[
            {text: 'รหัสโค้ช',align: 'start',sortable: false, value: ''},
            {text: 'ชื่อ - นามสกุล',align: 'start',sortable: false, value: ''},
            {text: 'ประเภทการลา',align: 'start',sortable: false, value: ''},
            {text: 'วันเริ่มลา',align: 'start',sortable: false, value: ''},
            {text: 'วันที่ส่งคำขอ',align: 'center',sortable: false, value: ''},
            {text: '', align: 'center', value: 'actions', sortable: false },
            {text: '', align: 'center', value: 'show', sortable: false },
        ],
      }),
      mounted() { },
      methods: {
          ...mapActions({}),
      },
      computed: {
            ...mapGetters({ }),
      },
  }
  </script>
  
  <style>
  
  </style>
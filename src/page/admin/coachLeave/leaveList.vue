<template>
    <v-container>
        <headerPage title="การอนุมัติลา"></headerPage>
        <v-row class="mb-2">
            <template  v-for="(type, type_index) in course_type"  >
                <v-col cols="12" sm="3"  :key="`${type_index}-type`"  @click="type_selected = type.value" >
                    <img-card class="cursor-pointer" :class="type_selected === type.value ? 'img-card-active':''">
                        <template v-slot:img> 
                            <v-img v-if="type.value== 'all'" max-height="90" max-width="70" src="../../../assets/coachLeave/all.png"></v-img>
                            <v-img v-if="type.value== 'approved'" max-height="90" max-width="70" src="../../../assets/coachLeave/accept.png"></v-img>
                            <v-img v-if="type.value== 'pending'" max-height="90" max-width="70" src="../../../assets/coachLeave/wait.png"></v-img>
                            <v-img v-if="type.value== 'reject'" max-height="90" max-width="70" src="../../../assets/coachLeave/disaccept.png"></v-img>
                        </template>
                        <template v-slot:header>
                            <div class="font-bold"> {{ type.name }} </div>
                        </template>
                        <template v-slot:detail>
                            <v-row class="d-flex align-end">
                                <v-col align="center" class="text-3xl font-bold">{{type.value === 'all' ? coach_leaves.length : coach_leaves.filter(v=>v.status === type.value).length}}</v-col>
                                <v-col class="text-sm">รายการ</v-col>
                            </v-row>
                        </template>
                    </img-card>
                </v-col>
            </template>
        </v-row> 
        <!-- TABLE -->
        <v-card class="my-5" >
            <!-- <pre>{{ coach_leaves }}</pre> -->
            <v-data-table 
                class="elevation-1 header-table"
                :items="type_selected === 'all' ? coach_leaves : coach_leaves.filter(v => v.status == type_selected)"
                :loading="coach_leaves_is_loading" 
                :headers="column">
                <template v-slot:[`item.actions`]="{ item }">
                    <div
                        class="d-flex align-center pa-1 rounded-lg"
                        :class="
                            item.status === 'pending'
                            ? 'bg-[#FFF9E8] text-[#FCC419]'
                            : item.status === 'approved'
                            ? 'bg-[#F0F9EE] text-[#58A144]'
                            : item.status === 'cancel'
                            ? 'bg-[#e8e8e8] text-[#636363]'
                            : 'bg-[#ffeeee] text-[#f00808]'
                        "
                        >
                        <span class="w-full text-center">{{
                            item.status == "pending"
                            ? "รออนุมัติ"
                            : item.status === "approved"
                            ? "อนุมัติ"
                            : item.status === "cancel"
                            ? "ยกเลิก"
                            : "ไม่อนุมัติ"
                        }}</span>
                    </div>
                </template>
                <template v-slot:[`item.show`]="{item}">
                    <v-btn
                        @click="showDetail(item.coachLeaveId)"
                        class="mr-3"
                        icon
                        color="#ff6b81"
                    ><v-icon>mdi-eye-outline</v-icon>
                    </v-btn>
                    <v-btn icon color="#ff6b81"
                    ><v-icon>mdi-file-cancel-outline</v-icon>
                    </v-btn>
                </template>
            </v-data-table>
        </v-card>
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
        type_selected: "all",
        column:[
            {text: 'รหัสโค้ช',align: 'start',sortable: false, value: 'accountId'},
            {text: 'ชื่อ - นามสกุล',align: 'start',sortable: false, value: 'fullnameTh'},
            {text: 'ประเภทการลา',align: 'start',sortable: false, value: 'leaveTypeStr'},
            {text: 'วันเริ่มลา',align: 'start',sortable: false, value: 'startDateStr'},
            {text: 'วันที่ส่งคำขอ',align: 'center',sortable: false, value: 'createdDateStr'},
            {text: '', align: 'center', value: 'actions', sortable: false },
            {text: '', align: 'center', value: 'show', sortable: false },
            ],
        course_type: [
            { name: "ทั้งหมด", value: "all" , img: "../../../assets/coachLeave/all.png"},
            { name: "อนุมัติ", value: "approved" , img: "../../../assets/coachLeave/accept.png"},
            { name: "รออนุมัติ", value: "pending", img: "../../../assets/coachLeave/wait.png" },
            { name: "ปฏิเสธ", value: "reject", img: "../../../assets/coachLeave/disaccept.png" },
        ],
    }),
    created(){
        this.GetLeavesAll()
    },
    mounted() { },
    methods: {
        ...mapActions({
            GetLeavesAll : "CoachModules/GetLeavesAll"
        }),
        showDetail(coach_leave_id){
            this.$router.push({name: 'LeaveDetail_coachleaveId', params:{coachleave_id :coach_leave_id }})
        },
    },
    computed: {
        ...mapGetters({ 
            coach_leaves : "CoachModules/getCoachLeaves",
            coach_leaves_is_loading : "CoachModules/getCoachLeavesIsLoading"
        }),
    },
  }
  </script>
  
  <style>
  
  </style>
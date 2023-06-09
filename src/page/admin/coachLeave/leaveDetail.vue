<template>
    <v-container>
        <header-page :breadcrumbs="breadcrumbs"></header-page>
        <v-card flat>
            <v-card-title>
                <v-row dense>
                    <v-col cols="auto" >
                        <span  class="text-[#ff6b81]">{{ coach_leave.fullNameTh }}</span>
                    </v-col>
                    <v-col cols="auto">
                        <v-chip
                            :color=" coach_leave.status === 'pending'
                                ? '#FFF9E8'
                                : coach_leave.status === 'approved'
                                ? '#F0F9EE'
                                : coach_leave.status === 'cancel'
                                ? '#e8e8e8'
                                : '#ffeeee'"
                            :text-color=" coach_leave.status === 'pending'
                                ? '#FCC419'
                                : coach_leave.status === 'approved'
                                ? '#58A144'
                                : coach_leave.status === 'cancel'
                                ? '#636363'
                                : '#f00808'"
                            class="chips"
                            >
                            {{  coach_leave.status == "pending"
                                ? "รออนุมัติ"
                                : coach_leave.status === "approved"
                                ? "อนุมัติ"
                                : coach_leave.status === "cancel"
                                ? "ยกเลิก"
                                : "ไม่อนุมัติ"}}
                        </v-chip>
                    </v-col>
                </v-row>
            </v-card-title>
            <v-card-subtitle v-if="coach_leave.status==='reject'">
                <v-row>
                    <v-col>
                        <span class="text-[#999999]">สาเหตุการปฏิเสธ: </span> 
                        <span class="text-[#333333] font-semibold">{{ coach_leave.remark_reject ? coach_leave.remark_reject : '-'}}</span>
                    </v-col>
                </v-row>
            </v-card-subtitle>
            <v-card-text>
                <v-card class="mb-3">
                    <v-card-text>
                        <v-row>
                            <v-col>
                                <span class="text-[#999999]">วันที่ลา:</span>
                                <div  class="text-[#2F3542] font-semibold">{{ `${coach_leave.startDateStr} - ${coach_leave.endDateStr}`  }}</div>
                            </v-col>
                            <v-col>
                                <span class="text-[#999999]">ประเภทการลา:</span>
                                <div  class="text-[#2F3542] font-semibold">{{ coach_leave.leaveTypeStr}}</div>
                            </v-col>
                            <v-col>
                                <span class="text-[#999999]">ช่วงเวลา: </span>
                                <div  class="text-[#2F3542] font-semibold">{{ periods.filter(v => v.value == coach_leave.period).length > 0 ?  periods.filter(v => v.value == coach_leave.period)[0].label : "-" }}</div>
                            </v-col>
                            <v-col>
                                <span class="text-[#999999]">วันที่ส่งคำขอ: </span>
                                <div  class="text-[#2F3542] font-semibold">{{ coach_leave.createdDateStr }}</div>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
                <!-- {{ coachs }} -->
                <v-card class="mb-3">
                    <v-data-table
                        class="elevation-1 header-table"
                        :headers="column"
                        :items="coach_leave.courses"
                    >
                        <template v-slot:[`item.coach`]="{ item }">
                            <v-row dense>
                                <v-col>
                                    <v-select
                                        dense
                                        :disabled="coach_leave.status === 'pending' ? false: true"
                                        v-model="item.substituteCoachId"
                                        outlined
                                        hide-details
                                        item-value="accountId"
                                        item-text="fullNameTh"
                                        @change="selectCoach(item)"
                                        :items="coachs.filter(v=>v.accountId !== coach_leave.coachId)"
                                    >
                                    </v-select>
                                </v-col>
                            </v-row>
                        </template>
                    </v-data-table>
                </v-card>
                <v-card class="mb-3">
                    <v-card-text>
                        <v-row dense>
                            <v-col cols="12" class="text-[#999999] font-bold">เหตุผลการลา</v-col>
                            <v-col class="text-[#333333] pl-5">{{  coach_leave.remark  }}</v-col>
                        </v-row>
                        <v-row dense>
                            <v-col cols="12" class="font-bold">ไฟล์แนบ</v-col>
                            <v-col>
                                <template v-if="coach_leave.attachments.length > 0">
                                    <v-card
                                        flat
                                        class="mb-3"
                                        v-for="(file, index) of coach_leave.attachments"
                                        :key="`${index}-file`"
                                        @click="dowloadFile(file)"
                                    >
                                        <v-card-text class="border-2 border-[#ff6b81] rounded-lg">
                                            <v-row>
                                                <v-col cols="auto" class="pr-2">
                                                <v-img
                                                    height="35"
                                                    width="26"
                                                    src="../../../assets/coachLeave/file-pdf.png"
                                                />
                                                </v-col>
                                                <v-col class="px-2">
                                                    <span class="font-bold">{{ file.fileName }}</span>
                                                    <br />
                                                    <span class="text-caption"
                                                        >ขนาดไฟล์ :
                                                        {{ (file.size / 1000000).toFixed(2) }} MB</span
                                                    >
                                                </v-col>
                                                <!-- <v-col cols="auto" class="pl-2">
                                                    <v-btn @click="removeFile(index)" icon color="#ff6b81"
                                                        ><v-icon>mdi-close</v-icon></v-btn
                                                    >
                                                </v-col> -->
                                            </v-row>
                                        </v-card-text>
                                    </v-card>
                                </template>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
                <v-row dense v-if="coach_leave.status === 'pending'">
                    <v-col align="right">
                        <v-btn @click="show_disapproved = true" class="mr-3" outlined color="#ff6b81">
                            ไม่อนุมัติ
                        </v-btn>
                    </v-col>
                    <v-col cols="auto">
                        <v-btn @click="updateStatus('approved')" depressed dark  color="#ff6b81">
                            อนุมัติ
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
        <v-dialog v-if="show_disapproved" persistent v-model="show_disapproved" :width="$vuetify.breakpoint.smAndUp ? '60vw' : ''">
            <v-card>
                <v-row dense>
                    <v-col align="right">
                       <v-btn icon  @click="closeDisapprovedDialog()"><v-icon color="#ff6b81">mdi-close</v-icon></v-btn>
                    </v-col>
                </v-row>
                <v-card-title>
                    <v-row dense>
                        <v-col align="center">
                            <span class="text-[#D1392B] font-bold">ปฏิเสธคำขอลา</span> 
                        </v-col>
                    </v-row>
                </v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col align="center">
                            <v-img width="175" height="185" src="../../../assets/coachLeave/disapproved.png"></v-img>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col >
                            <label-custom text="เหตุผลการปฏิเสธ"></label-custom>
                            <v-textarea v-model="coach_leave.remark_reject" outlined dense placeholder="กรอกรายระเอียด..."></v-textarea>
                        </v-col>
                    </v-row>
                    <v-row dense>
                        <v-col align="right">
                            <v-btn @click="closeDisapprovedDialog()" text color="#ff6b81" dark>ยกเลิก</v-btn>
                        </v-col>
                        <v-col>
                            <v-btn depressed color="#ff6b81" dark @click="updateStatus('reject')">ตกลง</v-btn>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-container>
</template>
<script>
    import headerPage from "@/components/header/headerPage.vue";    
    import Swal from "sweetalert2";
    import { mapActions, mapGetters } from 'vuex';
    import LabelCustom from '../../../components/label/labelCustom.vue';
    export default {
        name:"leaveDetail",
        components: {headerPage, LabelCustom},
        data: () => ({
            periods: [
                { label: "ลาเต็มวัน", value: "full" },
                { label: "ลาช่วงเช้า", value: "morning" },
                { label: "ลาช่วงบ่าย", value: "afternoon" },
            ],
            breadcrumbs: [
                { text: "การลา", to: "LeaveList" },
                { text: "รายระเอียด", to: "" },
            ],
            item : {status : "pending"},
            column:[
                {text: 'ชื่อคอร์ส',align: 'start',sortable: false, value: 'courseNameTh'},
                {text: 'ชื่อผู้แทน',align: 'start',sortable: false, value: 'coach', width:400},
            ],
            show_disapproved: false,
        }),
        created() {
            this.GetCoach()
            this.GetLeavesDetail({coach_leave_id : this.$route.params.coachleave_id})
        },
        mounted() {},
        watch: {},
        computed: {
            ...mapGetters({
                coach_leave : "CoachModules/getCoachLeave",
                coachs : "CourseModules/getCoachs",
                coach_leaves_is_loading : "CoachModules/getCoachLeavesIsLoading"
            })
        },
        methods: {
            ...mapActions({
                GetLeavesDetail : "CoachModules/GetLeavesDetail",
                GetCoach : "CourseModules/GetCoachs",
                updateStatusCoachLeaveAndCoach : "CoachModules/updateStatusCoachLeaveAndCoach"
            }),
            closeDisapprovedDialog(){
                this.show_disapproved = false 
            },
            selectCoach(coach_selected){
                let coach_detail = this.coachs.filter(v => v.accountId === coach_selected.substituteCoachId)[0]
                coach_selected.substitutefirstNameEn = coach_detail.firstNameEng
                coach_selected.substitutefirstNameTh = coach_detail.firstNameTh
                coach_selected.substitutelastNameEn = coach_detail.lastNameEng
                coach_selected.substitutelastNameTh = coach_detail.lastNameTh
                coach_selected.substitutefullNameEn = coach_detail.fullNameEh
                coach_selected.substitutefullNameTh = coach_detail.fullNameTh
            },
            dowloadFile(file) {
                console.log(file)
                // let url = `${process.env.VUE_APP_URL}/api/v1/files/${file.attachmentFile}`
                window.open(file.attachmentFileUrl, '_blank');
            },
            updateStatus(status){
                let text = status === "reject" ? "ต้องการปฏิเสธใบลานี้หรือไม่?" : "ต้องการอนุมัติใบลานี้หรือไม่?"
                Swal.fire({
                    icon: "question",
                    text: text,
                    showDenyButton: false,
                    showCancelButton: true,
                    confirmButtonText: "ตกลง",
                    cancelButtonText: "ยกเลิก",
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        this.coach_leave.status = status
                        this.updateStatusCoachLeaveAndCoach({coach_leave_id : this.coach_leave.coachLeaveId, coach_leave_data :  this.coach_leave}).then(()=>{
                            this.closeDisapprovedDialog()
                        })
                    }
                })
               
            }
        },
    };
</script>
  
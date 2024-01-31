<template>
    <v-container>
        <headerPage :title="$t('check in later')" />
        <v-card class="mb-3" outlined rounded="lg">
            <v-card-text>
                <v-row>
                    <v-col cols="12" sm="">
                        <v-autocomplete 
                            v-model="filter.course"
                            dense 
                            outlined
                            hide-details 
                            cache-items
                            :loading="loadingFilter"
                            :search-input.sync="searchCourse"
                            :items="courses"
                            item-value="courseId"
                            item-text="courseName"
                            :placeholder="$t('course')">
                            <template v-slot:no-data>
                                <v-list-item>
                                    <v-list-item-title>
                                        {{ $t("enter course name") }}
                                    </v-list-item-title>
                                </v-list-item>
                            </template>
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="">
                        <v-autocomplete 
                            v-model="filter.coach"
                            dense 
                            outlined 
                            hide-details 
                            :items="coachs"
                            item-value="coachId"
                            item-text="coachName"
                            :placeholder="$t('coach')">
                            <template v-slot:no-data>
                                <v-list-item>
                                    <v-list-item-title>
                                        {{ $t("no data found") }}
                                    </v-list-item-title>
                                </v-list-item>
                            </template>
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="">
                        <v-autocomplete 
                            v-model="filter.dayOfWeek"
                            dense 
                            outlined 
                            hide-details 
                            :items="dayOfWeekName"
                            item-value="dayOfWeekId"
                            item-text="dayOfWeekName"
                            :placeholder="$t('date')">
                            <template v-slot:no-data>
                                <v-list-item>
                                    <v-list-item-title>
                                        {{ $t("no data found") }}
                                    </v-list-item-title>
                                </v-list-item>
                            </template>
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="">
                        <v-autocomplete
                            v-model="filter.time" 
                            dense 
                            outlined 
                            hide-details 
                            :items="time"
                            item-value="timeId"
                            item-text="time"
                            :placeholder="$t('times')">
                        </v-autocomplete>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
        <div v-if="scheduleCheckinIsLoadIng" class="w-full d-flex align-center justify-center" style="height: 400px;">
            <v-progress-circular 
                indeterminate 
                color="pink"
                size="64"
            >
            </v-progress-circular>
        </div>
        <template v-else-if="scheduleCheckin.length > 0">
            <v-card class="mb-3" dense outlined rounded="lg" color="#ffe1e5">
                <v-card-text>
                    <v-row>
                        <v-col class="d-flex align-center font-bold text-[#ff6b81]"> {{$t('date list')}} </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
            <div v-for="( schedule, IndexSchedule) in scheduleCheckin" :key="`${IndexSchedule}-schedule`" >
                <v-card     
                    dense 
                    outlined 
                    class="mb-3" 
                    rounded="lg"
                    @click="openExpand(IndexSchedule)"
                >
                    <v-card-text class="border-left-10">
                        <v-row>
                            <v-col class="d-flex align-center font-bold text-base">{{schedule.date}} </v-col>
                            <v-col cols="auto">
                                <v-btn 
                                    depressed 
                                    color="#ff6b81"
                                    :dark="!schedule.checkedIn == 1"
                                    :disabled="schedule.checkedIn == 1"
                                    @click="CheckedInCoach(schedule, IndexSchedule)"
                                > 
                                    {{$t('check in teach')}} 
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
                <template v-if="schedule.checkedIn ">
                    <v-expand-transition v-show="schedule.openStudents"  >
                        <div class="pl-6 mb-3">
                            <v-card v-if="$vuetify.breakpoint.smAndUp" class="mb-3" dense outlined rounded="lg" color="#ffe1e5">
                                <v-card-text>
                                    <v-row>
                                        <v-col cols="" class="font-bold text-[#ff6b81]" align="center">{{ $t("first name - last name")}}</v-col>
                                        <v-col cols="3" class="font-bold text-[#ff6b81]" align="center">{{ $t("package") }}</v-col>
                                        <v-col cols="2" class="font-bold text-[#ff6b81]" align="center">{{ $t("number of times studied")}}</v-col>
                                        <v-col cols="3"></v-col>
                                    </v-row>
                                </v-card-text>
                            </v-card>
                            <v-card 
                                v-for="(student, indexStudent) in schedule?.checkInStudent"
                                :key="`${indexStudent}-student`"
                                class="mb-3" 
                                dense 
                                outlined 
                                rounded="lg">
                                <v-card-text>
                                    <v-row>
                                        <v-col cols="12" sm="" class="d-flex align-center" :class="$vuetify.breakpoint.smAndUp ? 'justify-center' : ''">{{ student.studentName }}</v-col>
                                        <v-col cols="12" sm="3" class="d-flex align-center" :class="$vuetify.breakpoint.smAndUp ? 'justify-center' : ''">
                                            <v-chip v-if="student.packageId" dark :color="packageColor(student.packageId)">{{student.packageName}}</v-chip>
                                        </v-col>
                                        <v-col cols="12" sm="2" class="d-flex align-center" :class="$vuetify.breakpoint.smAndUp ? 'justify-center' : ''">{{ `${$vuetify.breakpoint.smAndUp? '' : $t("number of times studied")+': '} ${student.countCheckIn}/${student.totalCheckIn}` }}</v-col>
                                        <v-col  cols="12" sm="3">
                                            <v-select 
                                                v-model="student.status"
                                                hide-details 
                                                outlined 
                                                dense
                                                color="#ff6b81"
                                                :items="check_in_status_options"
                                                item-text="label"
                                                item-value="value"
                                                @change="CheckInStudent(student.checkInStudentId, student)"
                                            >
                                                <template #item="{ item }">
                                                    <v-list-item-content>
                                                    <v-list-item-title :style="`color:${item.color}`">{{
                                                        item.label
                                                    }}</v-list-item-title>
                                                    </v-list-item-content>
                                                </template>
                                                <template #selection="{ item }">
                                                    <v-list-item-title :style="`color:${item.color}`">{{
                                                    item.label
                                                    }}</v-list-item-title>
                                                </template>
                                            </v-select>
                                        </v-col>
                                    </v-row>
                                    <v-row v-if="student.status==='leave'" dense>
                                        <v-col cols="12" sm="2" class="d-flex jusify-center align-center">{{ $t("compensatory study day")  }}</v-col>
                                        <v-col cols="12" sm="4">
                                            <v-menu
                                            v-model="student.menuCompensationDate"
                                            :close-on-content-click="false"
                                            transition="scale-transition"
                                            min-width="auto"
                                            >
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-text-field
                                                    dense
                                                    outlined
                                                    hide-details
                                                    v-model="student.compensationDateStr"
                                                    readonly
                                                    :placeholder="$t('choose a compensation date')"
                                                    v-bind="attrs"
                                                    v-on="on"
                                                >
                                                <template v-slot:append>
                                                    <v-icon
                                                    :color="student.compensationDate ? '#FF6B81' : ''"
                                                    >mdi-calendar</v-icon
                                                    >
                                                </template>
                                                </v-text-field>
                                            </template>
                                            <v-date-picker
                                                @input="inputDate(IndexSchedule, indexStudent, student)"
                                                @change="CheckInStudent(student.checkInStudentId, student)"
                                                v-model="student.compensationDate"
                                                locale="th-TH"
                                            ></v-date-picker>
                                            </v-menu>
                                        </v-col>
                                        <v-col cols="auto" class="pr-2">
                                            <v-text-field
                                                outlined
                                                dense
                                                hide-details
                                                :style="`width:${width()}px;`"
                                                style="position:absolute; display: block; z-index: 4"
                                                @focus="SelectedStartDate($event, student.compensationStartTime)"
                                                :value="genTime(student.compensationStartTime)"
                                                @change="CheckInStudent(student.checkInStudentId, student)"

                                            >
                                            </v-text-field>
                                            <TimePicker
                                                class="time-picker-hidden"
                                                :minuteStep="30"
                                                :placeholder="$t('start time')"
                                                :style="`width:${width()}px;`"
                                                :class="student.startTime ? 'active' : ''"
                                                format="HH:mm"
                                                v-model="student.compensationStartTime"
                                            >
                                            </TimePicker>
                                        </v-col>
                                        <v-col cols="auto" class="pl-2">
                                            <v-text-field
                                                outlined
                                                dense
                                                :style="`width:${width()}px;`"
                                                style="position:absolute; display: block; z-index: 4"
                                                :value="genTime(student.compensationEndTime)"
                                                @focus="SelectedStartDate($event, student.compensationEndTime)"
                                                @change="CheckInStudent(student.checkInStudentId, student)"
                                            >
                                            </v-text-field>
                                            <TimePicker
                                                class="time-picker-hidden"
                                                :minuteStep="30"
                                                :style="`width:${width()}px;`"
                                                format="HH:mm"
                                                :class="student.endTime ? 'active' : ''"
                                                :placeholder="$t('end time')"
                                                v-model="student.compensationEndTime"
                                            ></TimePicker>
                                        </v-col>
                                    </v-row>
                                </v-card-text>
                            </v-card>
                        </div>
                    </v-expand-transition>
                </template>
            </div>
        </template>
        <div v-else>
            <v-card dense outlined>
                <v-card-text class="font-bold text-lg" align="center">
                   {{  $t("please selete data") }}
                </v-card-text>
            </v-card>
        </div>
       
    </v-container>
</template>

<script>
import headerPage from "@/components/header/headerPage.vue";
import { mapActions, mapGetters } from 'vuex';
import moment from "moment";
import { Input, TimePicker } from "ant-design-vue";
import { dateFormatter } from "@/functions/functions";

export default {
    name: "AdminCheckin",
    components : {headerPage, TimePicker},
    directives: {
        "ant-input": Input,
    },
    data() {
        return {
            filter : {
                course : "",
                coach : "",
                time : "",
                dayOfWeek : "",
            },
            packages_color : [
                {
                    value : "PACK_1",
                    color: "primary"
                },
                {
                    value : "PACK_2",
                    color: "pink"
                },
                {
                    value : "PACK_3",
                    color: "#ED7D2B"
                },
            ],
            searchCourse : null,
            searchCoach : null,
            loadingFilter : false,
        }
    },
    computed: {
        ...mapGetters({
            courses : "adminCheckInModules/courses",
            coachs : "adminCheckInModules/coachs",
            dayOfWeekName : "adminCheckInModules/dayOfWeekName",
            time : "adminCheckInModules/time",
            scheduleCheckin : "adminCheckInModules/scheduleCheckin",
            scheduleCheckinIsLoadIng : "adminCheckInModules/scheduleCheckinIsLoadIng",
            
        }),
        breadcrumbs() {
            return [
                { text: this.$t("admin"), to: "" },
                { text: this.$t("check in"), to: "" },
            ];
        },
        check_in_status_options() {
            return [
                {
                    label: this.$t("punctual"),
                    value: "punctual",
                    color: "#58A144",
                    bg_color: "#F0F9EE",
                },
                {
                    label: this.$t("late"),
                    value: "late",
                    color: "#FCC419",
                    bg_color: "#FFF9E8",
                },
                {
                    label: this.$t("leave"),
                    value: "leave",
                    color: "#43A4F5",
                    bg_color: "#CFE2F3",
                },
                {
                    label: this.$t("emergency leave"),
                    value: "emergency leave",
                    color: "#43A4F5",
                    bg_color: "#CFE2F3",
                },
                {
                    label: this.$t("absent"),
                    value: "absent",
                    color: "#F03D3E",
                    bg_color: "#F4CCCC",
                },
            ];
        }
    },
    watch:{
        searchCourse(val) {
            if (val?.length > 3) {
                this.loadingFilter = true
                this.SearchCourses({
                    search : val
                }).then(()=>{ 
                    this.loadingFilter = false 
                })
            }
        },
        'filter.course':function(val){
            if(val){
                this.SearchCoach({ courseId : val })
                this.filter =  {
                    course : val,
                    coach : "",
                    time : "",
                    dayOfWeek : "",
                }
            } 
        },
        'filter.coach':function(val){
            if(val){
                this.SearchDayOfWeek({ 
                    courseId : this.filter.course,
                    coachId : val 
                })
            } 
        },
        'filter.dayOfWeek':function(val){
            if(val){
                this.SearchTime({ 
                    courseId : this.filter.course,
                    coachId : this.filter.coach,
                    dowId : val,
                })
            } 
        },
        filter:{
            handler(val){
                if(val.course && val.coach && val.dayOfWeek && val.time){
                    this.GetScheduleCheckIn({
                        ...val,
                        timeStart : this.time.filter(v => v.timeId === val.time)[0].timeStart,
                        timeEnd: this.time.filter(v => v.timeId === val.time)[0].timeEnd
                    })
                }
            },
            deep : true      
        }
    },
    methods:{
        ...mapActions({
            SearchCourses :"adminCheckInModules/SearchCourses",
            SearchCoach :"adminCheckInModules/SearchCoach",
            SearchDayOfWeek :"adminCheckInModules/SearchDayOfWeek",
            SearchTime :"adminCheckInModules/SearchTime",
            GetScheduleCheckIn: "adminCheckInModules/GetScheduleCheckIn",
            UpdateCheckinStudent : "adminCheckInModules/UpdateCheckinStudent",
            CheckInCoach : "adminCheckInModules/CheckInCoach"
        }),
        inputDate(indexSchedule, indexStudent, item) {
            this.scheduleCheckin[indexSchedule].checkInStudent[indexStudent].compensationDateStr = dateFormatter(item.compensationDate, "DD MMT YYYYT")
        },
        width() {
            switch (this.$vuetify.breakpoint.name) {
                case "xs":
                return 99;
                case "sm":
                return 147.5;
                case "md":
                return 180.5;
                case "lg":
                return 251.5;
                case "xl":
                return 401.75;
            }
        },
        SelectedStartDate(e) {
            e.target.parentNode.parentNode.parentNode.parentNode.parentNode
                .getElementsByClassName("time-picker-hidden")[0]
                .getElementsByTagName("input")[0]
                .focus();
            e.target.parentNode.parentNode.parentNode.parentNode.parentNode
                .getElementsByClassName("time-picker-hidden")[0]
                .getElementsByTagName("input")[0]
                .click();
        },
        genTime(time) {
            if (time) {
                return moment(time).format("HH:mm");
            } else {
                return "";
            }
        },
        packageColor(packageId){
            console.log(this.packages_color.filter(v => v.value == packageId)[0].color)
            return this.packages_color.filter(v => v.value == packageId)[0].color
        },
        openExpand(index){
            this.scheduleCheckin[index].openStudents = !this.scheduleCheckin[index].openStudents
        },
        CheckedInCoach(checkInData, index){
            this.CheckInCoach({ checkInData, index })
        },
        CheckInStudent(checkInStudentId, studentData){
            let payload = {
                compensationDate: "",
                compensationStartTime: "",
                compensationEndTime: "",
            }
            if(studentData.status === "leave" && studentData.compensationDate && studentData.compensationStartTime && studentData.compensationEndTime){
                payload = {
                    compensationDate: studentData.compensationDate,
                    compensationStartTime: studentData.compensationStartTime,
                    compensationEndTime: studentData.compensationEndTime,
                }
                this.UpdateCheckinStudent({checkInStudentId, status : studentData.status , payload})
            }else{
                this.UpdateCheckinStudent({checkInStudentId, status : studentData.status , payload})
            }
            
        }
    }
};
</script>

<style></style>

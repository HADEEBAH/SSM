<template>
  <v-container>
    <!-- <div v-for="(test,index) in profile_user" :key="index">
    <pre>{{ test.student.studentId  }}</pre>
    </div> -->
    <div class="mx-10 my-5">
      <label class="text-xl font-bold">ข้อมูลตารางเรียน</label>
   
    
 
      <v-row dense class="my-3">
        <v-col
          cols="4"
          v-for="(type, type_index) in course_type"
          :key="type_index"
        >
          <v-card flat @click="type_selected = type.value" class="rounded-lg">
            <v-card-text
              :class="
                type_selected === type.value ? 'bg-[#FF6B81]' : 'bg-[#F5F5F5]'
              "
              class="rounded-lg flex justify-center align-center pa-2"
            >
              <label
                :class="
                  type_selected === type.value
                    ? 'text-white'
                    : ' text-[#B3B3B3]'
                "
                class="font-bold mr-2"
                >{{ type.name }}</label
              >
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- PAGE 1 -->
      <v-expand-x-transition transition="scale-transition">
        
        <div v-if="type_selected == 'students_course'">

    <v-row v-if="data_local.roles.includes('R_4')" class="my-5">
        <v-col cols="12" sm="10">
            <v-text-field
              @keyup="searchStudentCourse()"
              v-model="search_course"
              :class="`bg-white rounded-xl ${!MobileSize ? 'w-4/5' : 'w-full'} `"
              hide-details
              dense
              outlined
              label="ค้นหาคอร์สเรียนของนักเรียนได้ที่นี้"
              prepend-inner-icon="mdi-magnify"
            />
          </v-col>

          <v-card 
          @click="$router.push({ name: 'StudentCourse', params:{course_id: item.courseId }})"
           v-for="item in (search_course !== '' ? data_search_course : student_data )" :key="item.id">

            <v-row dense >
              <!-- img -->
              <v-col cols="12" sm="2">
                <v-col
                  style="     
                    display: block;         
                    margin-left: auto;        
                    margin-right: auto;  
                    width: 100%; 
                    margin-top: 10%; 
                  "
                >
                <v-img :src="item.courseImg?  showImg(item.courseImg) : defaultImageUrl"></v-img>
           
              </v-col>
              </v-col>
              <!-- detail -->
              <v-col cols="12" sm="6">
                <v-col class="text-lg font-bold">
                  {{ item.courseNameTh == ''? '-' : item.courseNameTh }}
                  ({{ item.courseNameEng  == ''? '-' : item.courseNameEng }})
                  
                </v-col>
                <!-- <v-col class="text-slate-400">
                  {{ item.courseNameEng  == ''? '-' : item.courseNameEng }}
                </v-col> -->
                <v-col class="text-slate-400">
                  <span class="mdi mdi-account">โค้ช :</span>
                  {{ item.coachName  == null ? '-' : item.coachName}}
                </v-col>
                <v-col >
                 
                  <!-- v-for="(day, index_day) in dayOfWeekName" :key="index_day" -->
                  <v-card color="yellow" class="rounded-lg text-center" >
                    <!-- {{ dayOfWeekName(item.dates.day)  == ''? '-' : dayOfWeekName(item.dates.day) }} -->
                    {{ item.period.start }} - {{ item.period.end }} น.
                  </v-card>
                  <!-- {{ item.courseNameEn }} -->
                </v-col>
              </v-col>

              <!-- circle -->
              <v-col cols="12" sm="4" class="pt-6" align="center">
                <v-col>
                  <!-- {{ item.courseNameEn }} -->
                  <v-progress-circular
                    :rotate="-90"
                    :size="90"
                    :width="10"
                    :value="(item.dates.count / item.dates.totalDay) * 100"
                    color="#ff6b81"
                  >
                    {{ item.dates.count }} / {{ item.dates.totalDay }} <br />ครั้ง
                  </v-progress-circular>
                </v-col>
              </v-col>
            </v-row>

          </v-card>

    <v-col cols="12" v-if="search_course !== '' && data_search_course.length === 0 || student_data.length === 0" class="font-weight-bold text-center text-xl">
            ไม่พบคอร์สเรียน
          </v-col>


      </v-row>

       
    <div v-if="data_local.roles.includes('R_5')" >
      <div v-for="(item, index) in student_data" :key="index">
          <v-card
         
            @click="$router.push({ name: 'StudentCourse', params:{course_id: item.courseId }})"
            class="my-10 drop-shadow-lg"
          >
            <v-row dense >
              <!-- img -->
              <v-col cols="12" sm="2">
                <v-col
                  style="     
                    display: block;         
                    margin-left: auto;        
                    margin-right: auto; 
                    width: 100%; 
                    margin-top: 10%; 
                  "
                >
                <v-img :src="item.courseImg?  showImg(item.courseImg) : defaultImageUrl"></v-img>
           
              </v-col>
              </v-col>
              <!-- detail -->
              <v-col cols="12" sm="6">
                <v-col class="text-lg font-bold">
                  {{ item.courseNameTh == ''? '-' : item.courseNameTh }}
                  ({{ item.courseNameEng  == ''? '-' : item.courseNameEng }})
                  
                </v-col>
                <!-- <v-col class="text-slate-400">
                  {{ item.courseNameEng  == ''? '-' : item.courseNameEng }}
                </v-col> -->
                <v-col class="text-slate-400">
                  <span class="mdi mdi-account">โค้ช :</span>
                  {{ item.coachName  == null ? '-' : item.coachName}}
                </v-col>
                <v-col >
                 
                  <!-- v-for="(day, index_day) in dayOfWeekName" :key="index_day" -->
                  <v-card color="yellow" class="rounded-lg text-center" >
                    <!-- {{ dayOfWeekName(item.dates.day)  == ''? '-' : dayOfWeekName(item.dates.day) }} -->
                    {{ item.period.start }} - {{ item.period.end }} น.
                  </v-card>
                  <!-- {{ item.courseNameEn }} -->
                </v-col>
              </v-col>

              <!-- circle -->
              <v-col cols="12" sm="4" class="pt-6" align="center">
                <v-col>
                  <!-- {{ item.courseNameEn }} -->
                  <v-progress-circular
                    :rotate="-90"
                    :size="90"
                    :width="10"
                    :value="(item.dates.count / item.dates.totalDay) * 100"
                    color="#ff6b81"
                  >
                    {{ item.dates.count }} / {{ item.dates.totalDay }} <br />ครั้ง
                  </v-progress-circular>
                </v-col>
              </v-col>
            </v-row>
          </v-card>
      </div>
    </div>
          
         
            <v-card-text 
          class="pa-5 text-center border-2 border-[#ff6b81] rounded-lg"
          
          v-if="student_data.length == '0' " 
          >
            <span class="text-lg font-bold">
              <v-icon color="#ff6b81">mdi-alert-outline</v-icon>
              ไม่พบข้อมูลคอร์สเรียน
            </span>
          </v-card-text>

        </div>
      </v-expand-x-transition>

      <!-- PAGE 2 -->
      <v-expand-x-transition transition="scale-transition">
        <div v-if="type_selected == 'students_schedule'">
          <v-row class="mb-2">
            <v-col cols="12" align="center">
              <v-card flat width="340px">
                <v-card-text class="pa-2 border-2 border-[#ff6b81] rounded-lg">
                  <v-row dense class="d-flex justify-center">
                    <v-col
                      cols="auto"
                      v-for="(time, time_index) in time_frame_list"
                      :key="`${time_index}-time`"
                    >
                      <v-btn
                        @click="time_frame = time.value"
                        depressed
                        :dark="time_frame === time.value"
                        :color="
                          time_frame === time.value ? '#ff6b81' : '#F5F5F5'
                        "
                        >{{ time.label }}</v-btn
                      >
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
          <diV>
            <template>
              <calendarStudent
                :events="itemTime.dates"
                :type="time_frame"
              ></calendarStudent>
            </template>
          </diV>
        </div>
      </v-expand-x-transition>

      <!-- PAGE 3 -->
      <v-expand-x-transition transition="scale-transition">
        <div v-if="type_selected == 'students_bookedcourse' ">
           
        <div v-for="(item_booked, index_booked) in profile_booked" :key="index_booked">
            <v-card v-if="profile_booked.length != '0'" @click="showCard(index, item_booked)" class="my-5">
              <v-card-text>
                <div>
                  <v-row dense>
                    <!-- img -->
                    <v-col cols="12" sm="2">
                        <img :src="item_booked.courseImg ? item_booked.courseImg :`../../../assets/student_course/download.png`" />
                    </v-col>
                    <!-- detail -->
                    <v-col cols="12" sm="6" class="text-lg font-bold " >
                      <v-row dense>
                        <v-col>
                          {{ item_booked.courseName }}
                        </v-col>
                      </v-row>
                      <v-row dense>
                        <v-col cols="auto">
                          <v-card outlined >
                            <v-card-text class="py-0"> 
                              <!-- {{` ${dayOfWeekName(item_booked.dayOfWeekName.split(","))} ${item_booked.start}-${item_booked.end}น.` }}  -->
                            </v-card-text>
                          </v-card>
                        </v-col>
                      </v-row>
                    </v-col>
                    <!-- circle -->
                    <v-col cols="12" sm="4" class="d-flex align-center" align="center">
                      <v-row>
                        <v-col>
                          <v-chip color="#d9ead3" text-color="green" >
                            <span>{{ item_booked.status === 'waiting' ? "รอการติดต่อ" : item_booked.status }}</span>
                          </v-chip>
                        <!-- <v-progress-circular
                          :size="90"
                          :width="15"
                          value="booked"
                          color="#DBDBDB"
                          ><span class="text-pink-500">
                            {{ item_booked.status === 'waiting' ? "รอการติดต่อ" : item_booked.status }}</span
                          ></v-progress-circular> -->
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </div>
                <div  v-if="activeCard === index && !course_is_loading" class="mt-3">
                  
                  <v-card>
                    <v-row dense class="pa-3">
                      <v-col cols="12" md="12" sm="12"  class="text-lg font-bold ">
                         {{ `${course_data.course_name_th} (${course_data.course_name_en})` }}
                      </v-col> 
                      <v-col cols="12" md="12" sm="12">
                        <span class="mdi mdi-calendar-today" style="color: #ff6b81;"></span> 
                        {{dayOfWeekName(item_booked.dayOfWeekName.split(","))}}
                      </v-col> 

                      <v-col cols="12" md="12" sm="12">
                        <span class="mdi mdi-clock-outline" style="color: #ff6b81;"></span> {{course_data.course_hours}} ชม. / ครั้ง 
                      </v-col>

                      <v-col cols="12" md="12" sm="12" class="text-lg ">
                        {{course_data.detail}}
                      </v-col>
                      <v-col cols="12" md="12" sm="12">
                        <div class="mt-8">
                          <label-custom text="Music performance"></label-custom>
                        </div>
                        <v-divider class=""></v-divider>
                        <span class="pa-2">
                          {{course_data.music_performance}}
                        </span>
                      </v-col>

                      <v-col cols="12" md="12" sm="12">
                        <div class="mt-8">
                          <label-custom text="Certification"></label-custom>
                        </div>
                        <v-divider class=""></v-divider>
                        <span class="pa-2">
                          {{course_data.music_performance}}
                        </span>
                      </v-col>
                    </v-row>
                </v-card>
              </div>
              </v-card-text>
              
            </v-card> 

          </div>
          <!-- <v-card v-if="profile_booked.length == '0'" class="border-solid mt-8 pa-5 text-center text-xl">
            <span class="mdi mdi-alert-outline" style="color: #ff6b81;"></span>  ไม่พบข้อมูลการจอง
          </v-card> -->
          <v-card-text 
          class="pa-5 text-center border-2 border-[#ff6b81] rounded-lg"
          v-if="profile_booked.length == '0'"
          >
            <span class="text-lg font-bold">
              <v-icon color="#ff6b81">mdi-alert-outline</v-icon>
              ไม่พบข้อมูลการจอง
            </span>
          </v-card-text>

          
        </div>
      </v-expand-x-transition>
    </div>
  </v-container>
</template>
  
  <script>
import { mapActions, mapGetters } from "vuex";
import calendarStudent from "../../../components/calendar/calendarStudent.vue";
import labelCustom from "@/components/label/labelCustom.vue";

export default {
  components: {
    calendarStudent,
    labelCustom
  },
  data: () => ({
    activePage: 1,
    booked: "จองแล้ว",
    value: "",
    data_local: JSON.parse(localStorage.getItem("userDetail")),
    defaultImageUrl:
      "https://cdn.vectorstock.com/i/preview-1x/82/99/no-image-available-like-missing-picture-vector-43938299.jpg",
    loading: true,
    show_detail: false,
    activeCard: null,
    course_type: [
      { name: "คอร์สของฉัน", value: "students_course" },
      { name: "ตารางเรียน", value: "students_schedule" },
      { name: "คอร์สที่จอง", value: "students_bookedcourse" },
    ],
    time_frame_list: [
      { label: "รายวัน", value: "day" },
      { label: "รายสัปดาห์", value: "week" },
      { label: "รายเดือน", value: "month" },
    ],
    tasks: [],
      data_search_course: [],
      search_course: "",
    type_selected: "students_course",
    time_frame: "month",
    a_test: "",
    b_test: "",
    item: {},
    item_data: "",
   

  }),
  created() {
    this.user_detail = JSON.parse(localStorage.getItem("userDetail"));
    this.GetProfileBooked(this.user_detail.account_id);
    this.GetAll(this.user_detail.account_id);
    
    for (const item_data of this.profile_user) {
      this.GetStudentData(item_data.student.studentId); 
    }

  },

  mounted() {
    this.$store.dispatch(
      "NavberUserModules/changeTitleNavber",
      "ข้อมูลตารางเรียน"
    );
    this.user_detail = JSON.parse(localStorage.getItem("userDetail"));
    // this.GetStudentData(this.user_detail.account_id);
    this.GetProfileBooked(this.user_detail.account_id);
    this.GetAll(this.user_detail.account_id);
    
    for (const item_data of this.profile_user) {
      this.GetStudentData(item_data.student.studentId); 
    }

  },

  watch: {
    type_selected: function () {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 200);
    },

  },
  methods: {
    ...mapActions({
      GetStudentData: "MyCourseModules/GetStudentData",
      GetProfileBooked: "MyCourseModules/GetProfileBooked",
      GetAll: "ProfileModules/GetAll",

      //COURSE
      GetCourse : "CourseModules/GetCourse",
    }),
    prev() {
      this.$refs.calendar.prev();
      console.log(this.$refs.calendar.title);
    },
    next() {
      this.$refs.calendar.next();
    },

    showCard(index, course) {
      this.GetCourse(course.courseId)
      if( this.activeCard !== index ){
        this.activeCard = index; 
      }else{
        this.activeCard = null
      }
     // set activeCard to the clicked index
    },

    searchStudentCourse() {
      this.data_search_course = this.student_data.filter((val)=>{
        if (val.courseNameTh.indexOf(this.search_course) !== -1 || val.courseNameEng.toLowerCase().indexOf(this.search_course.toLowerCase()) !== -1 ) {
          return val
        }
      })
    },
  dayOfWeekName(days) {
    const daysOfWeek = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];
    const dayNames = [];
    for (let i = 0; i < days.length; i++) {
      const dayIndex = days[i];
      dayNames.push(daysOfWeek[dayIndex]);
    }
    return dayNames.join(' - ');
  },

    showImg(item) {
      return `${process.env.VUE_APP_URL}/api/v1/files/${item}`;
    },

      showData() {
      this.show_detail = true
    },

 
  
  },

  computed: {
    ...mapGetters({
      student_data: "MyCourseModules/getStudentData",
      itemTime: "MyCourseModules/getcourseSchedule",
      profile_booked: "MyCourseModules/getProfileBooked",
      course_data : "CourseModules/getCourseData",
      course_is_loading: "CourseModules/getCourseIsLoading",
      profile_user: "ProfileModules/getProfileUser",

    }),
    studentData: {
      get() {
        return this.student_data;
      },
    },

    MobileSize() {
      const { xs } = this.$vuetify.breakpoint;
      return !!xs;
    },
    IpadSize() {
      const { sm } = this.$vuetify.breakpoint;
      return !!sm;
    },
 
    cal() {
      return this.ready ? this.$refs.calendar : null;
    },
  },
};
</script>
  
  <style scoped>
.v-progress-circular {
  margin: 1rem;
}


</style>
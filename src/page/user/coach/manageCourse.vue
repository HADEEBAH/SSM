<template>
  <div>
    {{SetFunctionsComputed}}
    <v-container>
      <header-page  title="เลือกข้อมูลการสอน" ></header-page>
      <v-row dense class="mb-3">
        <v-col cols="auto" sm="4" v-for="(tab_data, tab_index) in tabs" :key="tab_index">
          <v-btn 
            class="w-full pa-2" 
            @click="tab =  tab_data.value" 
            depressed 
            :dark="tab === tab_data.value" 
            :color="tab === tab_data.value ? '#ff6b81' : '#F5F5F5'">
            {{ tab_data.label }}
          </v-btn>
        </v-col>
      </v-row>
      <div v-if="tab === 'teaching list'">
        <v-row class="mb-2">
          <v-col cols="12"  align="center">
            <v-card  flat width="340px"  >
              <v-card-text class="pa-2 border-2 border-[#ff6b81] rounded-lg">
                <v-row dense class="d-flex justify-center">
                  <v-col cols="auto" v-for="(time, time_index) in time_frame_list" :key="`${time_index}-time`">
                    <v-btn 
                    @click="time_frame = time.value" 
                    depressed 
                    :dark = "time_frame === time.value"
                    :color="time_frame === time.value ? '#ff6b81' : '#F5F5F5' " >{{time.label}}</v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <!-- รายวัน -->
        <template v-if="time_frame === 'day'">
          <!-- COURSE LIST -->
          <div v-for="(course, course_index) in my_courses.filter(v => v.start_date === genToday)" :key="course_index">
            <!-- {{ new Date(course.start) }} -->
            <v-card outlined class="mb-2" @click="$router.push({name : 'menageCourseDetail', params:{ courseId : course.course_id, timeId : course.time_id, dayOfWeekId: course.day_of_week_id, date : course.start_date }})">
              <v-card-text class="cursor-pointer ">
                <v-row dense>
                  <v-col cols="auto">
                    <v-img contain class="rounded-lg" :src="course.course_img ? course.course_img :'https://cdn.vuetifyjs.com/images/cards/cooking.png'" max-height="160" max-width="160"></v-img>
                  </v-col>
                  <v-col>
                    <v-row dense>
                      <v-col class="text-lg font-bold">{{`${course.name}(${course.subtitle})`}}</v-col>
                    </v-row>
                    <v-row dense>
                      <v-col cols="auto"><v-icon  color="#ff6b81">mdi-bookshelf</v-icon></v-col>
                      <v-col >{{`อาณาจักร :${course.category_name}`}}</v-col>
                    </v-row>
                    <v-row dense>
                      <v-col cols="auto"><v-icon color="#ff6b81">mdi-clock-outline</v-icon></v-col>
                      <v-col >{{`เวลาสอน :${course.course_per_time} ชั่วโมง`}}</v-col>
                    </v-row>
                  </v-col>
                  <v-col>
                    <v-chip small color="#F9B320" dark>{{ `${course.start_time}-${course.end_time}` }}น.</v-chip>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
            <!-- <course-card-list  class="mb-2 cursor-pointer " bg_color="#fff" 
            :title="`${course.name}(${course.subtitle})`" 
            :course_per_time="`เวลาสอน :${course.course_per_time}`" :period="`${course.start_time}-${course.end_time}`">
              <template #img>
                <v-img class="rounded-lg" :src="course.course_img ? course.course_img :'https://cdn.vuetifyjs.com/images/cards/cooking.png'" max-height="120" max-width="120"></v-img>
              </template>
            </course-card-list> -->
          </div>
          <div v-if="my_courses.filter(v => v.start_date === genToday).length == 0">
            <v-card flat>
              <v-card-text class="pa-2 py-4 text-center border-2 border-[#ff6b81] rounded-lg">
                 <span class="text-lg font-bold"> 
                   <v-icon color="#ff6b81">mdi-alert-outline</v-icon> ไม่พบข้อมูลการสอน
                 </span>              
              </v-card-text>
            </v-card>
          </div>
        </template>
        <!-- รายสัปดาห์ -->
        <template v-else>
          <!-- <pre>{{ my_courses }}</pre> -->
          <!-- COURSE LIST -->
          <calendarCoach
            :events="my_courses"
            :type="time_frame"
          ></calendarCoach>
        </template>
      </div>
      
      <div v-if="tab === 'my teaching'">
        <v-row>
          <v-col cols="auto">
            ข้อมูลการสอนข้อฉัน : 
          </v-col>
          <v-col class="font-bold">
            {{ `${user_detail.first_name_th} ${user_detail.last_name_th}`}}
          </v-col>
        </v-row>
        <v-row dense>
          <v-col>
              <span class="font-bold">เลือกคอร์ส</span>
              <v-autocomplete v-model="filter_course" item-text="name" item-value="course_id" :items="my_courses"  outlined dense></v-autocomplete>
          </v-col>
        </v-row>
        <v-card  dense class=" mb-3" elevation="0" flat  v-for="(course, course_index) in filterMycourse()" :key="`${course_index}-course`">
          <v-card-text class="bg-[#FBF3F5]">
            <v-row dense>
              <v-col cols="4">
                <v-img class="rounded-lg" height="160" :src="course.course_img ? course.course_img :'https://cdn.vuetifyjs.com/images/cards/cooking.png'" />
              </v-col>
              <v-col>
                <v-row>
                  <v-col class="font-bold text-md">{{ course.start_date_str }}</v-col>
                </v-row>
                <v-row dense>
                  <v-col cols="12">
                    <rowData mini  icon="mdi-account">อาณาจักร : {{ course.category_name }}</rowData>
                  </v-col>
                  <v-col cols="12">
                    <rowData mini  icon="mdi-bookshelf">คอร์สเรียน : {{ `${course.name}(${course.subtitle})` }}</rowData>
                  </v-col>
                  <v-col cols="12">
                    <rowData mini  icon="mdi-clock-time-four-outline">เวลาสอน {{ course.course_per_time }} ชั่วโมง</rowData>
                  </v-col>
                  <v-col cols="12">
                    <v-chip small color="#F9B320" dark>{{ `${course.start_time} - ${course.end_time}` }}น.</v-chip>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row dense>
              <v-col align="center" @click="OpenAssessment(course)" class="cursor-pointer">ประเมินนักเรียน <v-icon color="#ff6b81">{{course.show_assessment ? 'mdi-chevron-up' : 'mdi-chevron-down'}}</v-icon></v-col>
              <v-col align="center" @click="OpenAssessmentPotential(course)" class="cursor-pointer">ประเมินศักยภาพ <v-icon color="#ff6b81">{{course.show_assessment_pantential ? 'mdi-chevron-up' : 'mdi-chevron-down'}}</v-icon></v-col>
              <v-col align="center" @click="OpenSummary(course)" class="cursor-pointer">ประเมินภาพรวม <v-icon color="#ff6b81">{{course.show_summary ? 'mdi-chevron-up' : 'mdi-chevron-down'}}</v-icon></v-col>
            </v-row>
          </v-card-text>
          <v-expand-transition>
            <template v-if="course.show_assessment"> 
              <v-card-text>
                <v-card flat  v-if="student_check_in.filter(v => v.type === 'general' && (v.status == 'punctual' || v.status == 'late')).length === 0">
                  <v-card-text class="pa-2 py-4 text-center border-2 border-[#ff6b81] rounded-lg">
                    <span class="text-lg font-bold"> 
                      <v-icon color="#ff6b81">mdi-alert-outline</v-icon> ไม่พบข้อมูลการสอน
                    </span>              
                  </v-card-text>
                </v-card>
                <v-card outlined class="mb-3" v-for="(student, index) in student_check_in.filter(v => v.type === 'general' && (v.status == 'punctual' || v.status == 'late'))" :key="`${index}-checkin`">
                  <v-card-text>
                      <v-row>
                        <v-col class="text-lg font-bold"> {{ index+1 }} . {{ student.fullname }}</v-col>
                        <v-col align="center"> 
                          <v-row dense class="d-flex aling-center">
                              <v-col align="right"> การเข้าเรียน: </v-col>
                              <v-col cols="auto">
                                  <v-chip class="font-bold" :color="check_in_status_options.filter(v => v.value === student.status)[0].bg_color" :style="`color:${check_in_status_options.filter(v => v.value === student.status)[0].color}`" v-if="check_in_status_options.filter(v => v.value === student.status).length > 0" >{{ check_in_status_options.filter(v => v.value === student.status)[0].label }} </v-chip>
                              </v-col>
                            </v-row>
                          </v-col>
                      </v-row>
                      <v-row>
                        <v-col align="left" class="font-semibold">พัฒนาการ : <span class="text-[#ff6b81]" >{{student.assessment.evolution === "very good" ? "ดีมาก" : student.assessment.evolution === "good" ? "ดี" : student.assessment.evolution === "adjust" ? "ปรับปรุง" : "-" }}</span></v-col>
                        <v-col align="center" class="font-semibold">ความสนใจ : <span class="text-[#ff6b81]" >{{student.assessment.interest === "very good" ? "ดีมาก" : student.assessment.interest === "good" ? "ดี" :  student.assessment.evolution === "adjust" ? "ปรับปรุง" :"-" }}</span></v-col>
                        <v-col align="center">
                          <v-btn outlined @click="showComment(student)" color="#ff6b81"><v-icon>mdi-message-text-outline</v-icon>ดูความคิดเห็น</v-btn>
                        </v-col>
                      </v-row>
                  </v-card-text>
                </v-card>
              </v-card-text>
            </template>
          </v-expand-transition>
          <v-expand-transition>
            <template v-if="course.show_assessment_pantential"> 
              <v-card-text>
                <v-card-text>
                <v-card flat  v-if="student_check_in.filter(v => v.potential).length === 0">
                  <v-card-text class="pa-2 py-4 text-center border-2 border-[#ff6b81] rounded-lg">
                    <span class="text-lg font-bold"> 
                      <v-icon color="#ff6b81">mdi-alert-outline</v-icon> ไม่พบข้อมูลการสอน
                    </span>              
                  </v-card-text>
                </v-card>
                <v-card outlined class="mb-3" v-for="(student, index) in student_check_in.filter(v => v.potential)" :key="`${index}-checkin`">
                  <v-card-text>
                      <v-row>
                        <v-col class="text-lg font-bold"> {{ index+1 }} . {{ student.fullname }}</v-col>
                        <v-col align="center"> 
                          <v-row dense class="d-flex aling-center">
                              <v-col align="right"> การเข้าเรียน: </v-col>
                              <v-col cols="auto">
                                  <v-chip class="font-bold" :color="check_in_status_options.filter(v => v.value === student.status)[0].bg_color" :style="`color:${check_in_status_options.filter(v => v.value === student.status)[0].color}`" v-if="check_in_status_options.filter(v => v.value === student.status).length > 0" >{{ check_in_status_options.filter(v => v.value === student.status)[0].label }} </v-chip>
                              </v-col>
                            </v-row>
                          </v-col>
                      </v-row>
                      <v-row>
                        <v-col align="left" class="font-semibold">พัฒนาการ : <span class="text-[#ff6b81]" >{{student.assessment.evolution === "very good" ? "ดีมาก" : student.assessment.evolution === "good" ? "ดี" : student.assessment.evolution === "adjust" ? "ปรับปรุง" : "-" }}</span></v-col>
                        <v-col align="center" class="font-semibold">ความสนใจ : <span class="text-[#ff6b81]" >{{student.assessment.interest === "very good" ? "ดีมาก" : student.assessment.interest === "good" ? "ดี" :  student.assessment.evolution === "adjust" ? "ปรับปรุง" :"-" }}</span></v-col>
                        <v-col align="center">
                          <v-btn outlined @click="showComment(student)" color="#ff6b81"><v-icon>mdi-message-text-outline</v-icon>ดูความคิดเห็น</v-btn>
                        </v-col>
                      </v-row>
                  </v-card-text>
                </v-card>
              </v-card-text>
              </v-card-text>
            </template>
          </v-expand-transition>
          <v-expand-transition>
            <template v-if="course.show_summary"> 
            <v-card-text >
              <v-card flat v-if="!coach_check_in.summary &&  !coach_check_in.homework && !coach_check_in.attachment">
                <v-card-text class="pa-2 py-4 text-center border-2 border-[#ff6b81] rounded-lg">
                  <span class="text-lg font-bold"> 
                    <v-icon color="#ff6b81">mdi-alert-outline</v-icon> ไม่พบข้อมูลการสอน
                  </span>              
                </v-card-text>
              </v-card>
              <v-card outlined v-else>
                <v-card-text> 
                  <v-row>
                    <v-col> บันทึกการสอน : <span class="font-semibold">{{coach_check_in.summary}}</span></v-col>
                  </v-row>
                  <v-row>
                    <v-col> พัฒนาการ / การบ้าน :  <span class="font-semibold">{{coach_check_in.homework}}</span> </v-col>
                  </v-row>
                  <v-row>
                    <v-col>ไฟล์แนบ : 
                      <a class="text-[#ff6b81]" 
                       v-for="(att, index_att) in coach_check_in.attachment" 
                       :key="`${index_att}-att`"> ไฟล์ {{ index_att+1 }} </a>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-card-text>
          </template>
        </v-expand-transition>
        </v-card>
      
      </div>
      <div v-if="tab === 'request leave'">
        <v-row>
          <v-col align="right">
            <v-btn @click="showLeaveForm" :class="$vuetify.breakpoint.smAndUp ? '' : 'w-full'" outlined color="#ff6b81"><v-icon>mdi-plus-circle-outline</v-icon>แบบฟอร์มการลา</v-btn>
          </v-col>
        </v-row>
        <v-row dense >
          <v-col cols="7">
            <img-card class="cursor-pointer" :class="tab === 'all' ? 'img-card-active':''">
              <template v-slot:img> 
                  <v-img max-height="90" max-width="70" src="../../../assets/leave/leave_all.png"></v-img>
              </template>
              <template v-slot:header>
                  <div class="font-bold text-center"> คอร์สทั้งหมด </div>
              </template>
              <template v-slot:detail>
                  <v-row class="d-flex align-end">
                      <v-col align="end" class="text-3xl font-bold">{{ coach_leaves.length }}</v-col>
                      <v-col class="text-sm">รายการ</v-col>
                  </v-row>
              </template>
            </img-card>
          </v-col>
          <v-col cols="5">
            <img-card class="cursor-pointer h-full" :class="tab === 'all' ? 'img-card-active':''">
              <template v-slot:img> 
                  <v-img max-height="90" max-width="70" src="../../../assets/leave/approve.png"></v-img>
              </template>
              <template v-slot:header>
                  <div class="font-bold text-center text-[#57A363]"> อนุมัติ </div>
              </template>
              <template v-slot:detail>
                  <v-row class="d-flex align-end">
                      <v-col align="end" class="text-3xl font-bold text-[#57A363]">{{ coach_leaves.filter(v => v.status === 'approved').length }}</v-col>
                      <v-col class="text-sm ">รายการ</v-col>
                  </v-row>
              </template>
            </img-card>
          </v-col>
        </v-row>
        <v-row dense class="mb-3">
          <v-col cols="4">
            <img-card class="cursor-pointer" :class="tab === 'all' ? 'img-card-active':''">
              <template v-slot:img> 
                  <v-img max-height="90" max-width="70" src="../../../assets/leave/panding.png"></v-img>
              </template>
              <template v-slot:header>
                  <div class="font-bold  text-center text-[#FCC419]"> รออนุมัติ </div>
              </template>
              <template v-slot:detail>
                  <v-row class="d-flex align-end">
                      <v-col align="end" class="text-3xl font-bold  text-[#FCC419]">{{ coach_leaves.filter(v => v.status === 'pending').length}}</v-col>
                      <v-col class="text-sm">รายการ</v-col>
                  </v-row>
              </template>
            </img-card>
          </v-col>
          <v-col cols="4">
            <img-card class="cursor-pointer" :class="tab === 'all' ? 'img-card-active':''">
              <template v-slot:img> 
                  <v-img max-height="90" max-width="70" src="../../../assets/leave/non-approve.png"></v-img>
              </template>
              <template v-slot:header>
                  <div class="font-bold text-center  text-[#F03D3E]"> ไม่อนุมัติ </div>
              </template>
              <template v-slot:detail>
                  <v-row class="d-flex align-end">
                      <v-col align="end" class="text-3xl font-bold  text-[#F03D3E]">{{ coach_leaves.filter(v => v.status === 'disapproved').length }}</v-col>
                      <v-col class="text-sm">รายการ</v-col>
                  </v-row>
              </template>
            </img-card>
          </v-col>
          <v-col cols="4">
            <img-card class="cursor-pointer" :class="tab === 'all' ? 'img-card-active':''">
              <template v-slot:img> 
                  <v-img max-height="90" max-width="70" src="../../../assets/leave/cancel.png"></v-img>
              </template>
              <template v-slot:header>
                  <div class="font-bold text-center text-[#999999]"> ยกเลิก </div>
              </template>
              <template v-slot:detail>
                  <v-row class="d-flex align-end">
                      <v-col align="end" class="text-3xl font-bold text-[#999999]">{{ coach_leaves.filter(v => v.status === 'cancel').length }}</v-col>
                      <v-col class="text-sm">รายการ</v-col>
                  </v-row>
              </template>
            </img-card>
          </v-col>
        </v-row>
        <v-card>
          <v-card-text>
            <v-data-table 
              class="elevation-1 header-table"
              :headers="column"
              :items="coach_leaves"
              :single-expand="singleExpand"
              :expanded.sync="expanded"
              item-key="coachLeaveId"
              show-expand
            >
            <template v-slot:[`item.date`]="{ item }">
                {{ item.startDate === item.endDate ? genDate(item.startDate) : `${genDate(item.startDate)} - ${genDate(item.endDate)}`  }}
            </template>
            <template v-slot:[`item.leaveType`]="{ item }">
                {{ item.leaveType === "personal" ? "ลากิจ" :item.leaveType === "sick" ? "ลาป่วย" : "ลาพักร้อน" }}
            </template>
            <template v-slot:[`item.status`]="{ item }">
              <div class="d-flex align-center pa-1 rounded-lg" 
                :class="item.status === 'pending' ? 'bg-[#FFF9E8] text-[#FCC419]' : item.status === 'approved' ? 'bg-[#F0F9EE] text-[#58A144]' : item.status === 'cancel' ? 'bg-[#e8e8e8] text-[#636363]':'bg-[#ffeeee] text-[#f00808]'">
                <span class="w-full text-center">{{ item.status == 'pending' ? 'รออนุมัติ' : item.status === "approved" ? "อนุมัติ":  item.status === "cancel" ? "ยกเลิก":"ไม่อนุมัติ"   }}</span>
              </div>
            </template>
            <template v-slot:[`item.action`]="{ item }">
                <v-btn class="mr-3" icon color="#ff6b81" @click="showDialogDetail(item)"><v-icon>mdi-eye-outline</v-icon> </v-btn>
                <v-btn icon color="#ff6b81" @click="cancelCoachLeave(item)"><v-icon>mdi-file-cancel-outline</v-icon> </v-btn>
            </template>
            <template v-slot:expanded-item="{ headers, item }">
              <td :colspan="headers.length" class="py-3">
                <v-row>
                  <v-col cols="12">ผู้สอนแทน: {{ `${item.substituteCoachFirstNameTh} ${item.substituteCoachLastNameTh}` }}</v-col>
                </v-row>
              </td>
            </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </div>
      <!-- CREATE :: LEAVE -->
      <v-dialog persistent :width="$vuetify.breakpoint.smAndUp ? '60vw' : ''" v-model="show_leave_form" v-if="show_leave_form">
        <v-card class="pa-1">
          <v-row dense>
              <v-col class="pa-0" align="right">
                <v-btn @click="closeDialogLeaveForm" icon color="#ff6b81"><v-icon>mdi-close</v-icon></v-btn>
              </v-col>
          </v-row>
          <v-card-title class="d-flex justify-center">
            แบบฟอร์มขอลา
          </v-card-title>
          <v-card-text>
            <!-- DATE LEAVE AND PERIOD -->
            <v-row dense>
              <v-col cols="12">
                วันที่ลา
                <v-row dense>
                  <v-col cols="12" sm=6>
                    <v-menu
                      v-model="coach_leave_data.menu_start_date"
                      :close-on-content-click="false"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            dense
                            outlined
                            v-model="coach_leave_data.start_date_str"
                            readonly
                            placeholder="เลือกวันที่เริ่มต้น"
                            v-bind="attrs"
                            v-on="on"
                          >
                            <template v-slot:append>
                              <v-icon
                                :color=" coach_leave_data.start_date? '#FF6B81' : '' "
                                >mdi-calendar</v-icon
                              >
                            </template>
                          </v-text-field>
                        </template>
                        <v-date-picker
                          :min="today.toISOString()"
                          @input="inputDate($event, 'start')"
                          v-model="coach_leave_data.start_date"
                        ></v-date-picker>
                    </v-menu>  
                  </v-col>
                  <v-col cols="12" sm=6>
                    <v-menu
                      v-model="coach_leave_data.menu_end_date"
                      :close-on-content-click="false"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            dense
                            outlined
                            v-model="coach_leave_data.end_date_str"
                            readonly
                            placeholder="เลือกวันที่สิ้นสุด"
                            v-bind="attrs"
                            v-on="on"
                          >
                            <template v-slot:append>
                              <v-icon
                                :color="coach_leave_data.end_date? '#FF6B81' : '' "
                                >mdi-calendar</v-icon
                              >
                            </template>
                          </v-text-field>
                        </template>
                        <v-date-picker
                          :min="coach_leave_data.start_date ? coach_leave_data.start_date : today.toISOString()"
                          @input="inputDate($event, 'end')"
                          v-model="coach_leave_data.end_date"
                        ></v-date-picker>
                    </v-menu>  
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row dense>
              <v-col cols="12">
                ช่วงเวลา
                <v-select 
                dense 
                outlined 
                :items="periods" 
                item-text="label"
                item-value="value"
                v-model="coach_leave_data.period"></v-select>
              </v-col>
            </v-row>
            <!-- TYPE -->
            <v-row dense>
              <v-col cols="12">
                ประเภทการลา
                <v-select 
                dense 
                outlined 
                :items="leaveTypes" 
                item-text="label"
                item-value="value"
                v-model="coach_leave_data.leave_type"></v-select>
              </v-col>
            </v-row>
            <v-row dense>
              <v-col cols="auto">
                <v-icon color="#ff6b81">mdi-card-account-details-outline</v-icon>
              </v-col>
              <v-col class="font-bold text-lg ">
                 คอร์ส
              </v-col>
            </v-row>
            <v-divider class="my-2"></v-divider>
            <div >
              <v-card class="mb-3" flat  v-for="(course, index) in coach_leave_data.courses" :key="index">
                <v-card-text class="rounded-md border">
                  <div v-if="coach_leave_data.courses.length > 1" align="right"><v-btn icon color="red" @click="RemoveCourse(index)"><v-icon>mdi-close</v-icon></v-btn></div>
                  <v-row dense>
                    <v-col>
                      ชื่อคอร์ส
                      <v-select 
                      dense 
                      outlined 
                      v-model="course.my_course_id"
                      :items="GenCourseLeaveOptions()" 
                      item-value="my_course_id" 
                      item-text="course_name" ></v-select>
                    </v-col>
                  </v-row>
                  <v-row dense>
                    <v-col>
                      ผู้สอนแทน
                      <v-select 
                      dense 
                      outlined 
                      :items="coachs.filter(v => v.accountId !== user_detail.account_id )" 
                      item-value="accountId" 
                      item-text="fullNameTh" 
                      v-model="course.substitute_coach_id">
                    </v-select>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </div>
            <v-row dense>
              <v-col align="center">
                <v-btn outlined color='#FF6b81' @click="AddCourse"><v-icon>mdi-plus</v-icon> เพิ่มคอร์ส </v-btn>
              </v-col>
            </v-row>
            <v-row dense>
              <v-col>
                รายละเอียดการลา
                <v-textarea v-model="coach_leave_data.remark" outlined></v-textarea>
              </v-col>
            </v-row>
            <v-card flat class="mb-3">
                <v-card-text class="border-dashed border-2 border-pink-600 rounded-lg">
                  <v-row dense>
                    <v-col cols="12" class="flex align-center justify-center">
                        <v-img
                        src="../../../assets/manage_coach/upload_file.png"
                        max-height="80"
                        max-width="100"
                        ></v-img>
                    </v-col>
                    <v-col cols="12" class="flex align-center justify-center text-lg">
                        แนบไฟล์
                    </v-col>
                    <v-col cols="12" class="flex align-center justify-center">
                        <v-btn text class="underline" color="#ff6b81" @click="openFileSelector"
                        >อัพโหลดไฟล์แนบ</v-btn
                        >
                        <input
                        ref="fileInput"
                        type="file"
                        multiple 
                        @change="uploadFile"
                        style="display: none"
                        />
                    </v-col>
                  </v-row>
                </v-card-text>
            </v-card>
            <div v-if="selected_files.length > 0" class="mb-3">
              <v-row dense>
                <v-col class="font-bold text-lg ">
                  ไฟล์แนบ
                </v-col>
              </v-row>
              <v-divider class="my-2"></v-divider>
              <v-card flat class="mb-3" v-for="(file, index) of selected_files" :key="`${index}-file`">
                <v-card-text class="border border-2 border-[#ff6b81] rounded-lg">
                  <v-row>
                    <v-col cols="auto" class="pr-2">
                      <v-img height="35" width="26" src="../../../assets/coachLeave/file-pdf.png"/>
                    </v-col>
                    <v-col  class="px-2">
                        <span class="font-bold">{{ file.name }}</span><br>
                        <span class="text-caption">ขนาดไฟล์ : {{ (file.size / 1000000).toFixed(2) }} MB</span>
                    </v-col>
                    <v-col cols="auto" class="pl-2">
                      <v-btn @click="removeFile(index)" icon color="#ff6b81"><v-icon>mdi-close</v-icon></v-btn>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </div>
            <v-row>
              <v-col cols="12" sm align="right">
                <v-btn text color="#ff6b81" @click="closeDialogLeaveForm()">ยกเลิก</v-btn>
              </v-col>
              <v-col cols="12" sm="auto" align="right">
                <v-btn depressed :disabled="validateCoachLeave" :dark="!validateCoachLeave" @click="saveCoachLeave()" color="#ff6b81">ส่งใบลา</v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>
      <!-- DETAIL :: LEAVE -->
      <v-dialog persistent :width="$vuetify.breakpoint.smAndUp ? '60vw' : ''" v-model="show_leave_detail" v-if="show_leave_detail">
        <v-card class="pa-1 mb-3" >
          <v-row dense>
            <v-col align="right">
              <v-btn icon color="#ff6b81" @click="closeDialogLeaveDetail()"><v-icon>mdi-close</v-icon></v-btn>
            </v-col>
          </v-row>
          <v-card-title class="d-flex justify-center">
            แบบฟอร์มขอลา
          </v-card-title>
          <v-card-text>
            <v-row dense class="mb-3">
              <v-col align="right">
                สภานะ :
              </v-col>
              <v-col cols="auto">
                <div  class="btn-size-lg d-flex align-center pa-1 rounded-xl" 
                  :class="edited_coach_leave_data.status === 'pending' ? 'bg-[#FFF9E8] text-[#FCC419]' : edited_coach_leave_data.status === 'approved' ? 'bg-[#F0F9EE] text-[#58A144]' : edited_coach_leave_data.status === 'cancel' ? 'bg-[#e8e8e8] text-[#636363]':'bg-[#ffeeee] text-[#f00808]'">
                  <span class="w-full text-center">{{ edited_coach_leave_data.status == 'pending' ? 'รออนุมัติ' : edited_coach_leave_data.status === "approved" ? "อนุมัติ":  edited_coach_leave_data.status === "cancel" ? "ยกเลิก":"ไม่อนุมัติ"   }}</span>
                </div>
              </v-col>
            </v-row>
             <v-card flat class="mb-3">
              <v-card-text class="border border-1 rounded-lg">
                <v-row>
                  <v-col>
                    <div>วันที่ลา</div>
                    <div class="font-semibold pl-2">{{`${genDate(edited_coach_leave_data.startDate)} - ${genDate(edited_coach_leave_data.endDate)}`}}</div>
                  </v-col>
                  <v-col>
                    <div>ช่วงเวลา</div>
                    <div class="font-semibold pl-2">{{ edited_coach_leave_data.period === "full" ? 'ลาเต็มวัน' : edited_coach_leave_data.period === "morning" ? "ลาช่วงเช้า" : "ลาช่วงบ่าย"  }}</div>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <div>ประเภทการลา</div>
                    <div class="font-semibold pl-2">{{ edited_coach_leave_data.leaveType === "sick" ? 'ลาป่วย' : edited_coach_leave_data.leaveType === "personal" ? 'ลากิจ' : 'ลาพักร้อน' }}</div>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <div>สาเหตุการลา</div>
                    <div class="font-semibold pl-2">{{ edited_coach_leave_data.remark }}</div>
                  </v-col>
                </v-row>
              </v-card-text>
             </v-card>
             <template v-if="edited_coach_leave_data.courses.length > 0"  >
              <div class="mb-3" v-for=" (course, index_course) in edited_coach_leave_data.courses" :key="`${index_course}-course`">
                <v-row dense>
                  <v-col cols="auto">
                    <v-icon color="#ff6b81">mdi-card-account-details-outline</v-icon>
                  </v-col>
                  <v-col class="font-bold text-lg ">
                    คอร์ส
                  </v-col>
                </v-row>
                <v-divider class="my-2"></v-divider>
                <v-card flat>
                  <v-card-text class="border border-1 rounded-lg">
                    <v-row dense>
                      <v-col>
                        <div>ชื่อคอร์ส</div>
                        <div class="font-semibold pl-2">{{ `${course.courseNameTh} ${course.startTime}-${course.endTime}` }}</div>
                      </v-col>
                    </v-row>
                    <v-row dense>
                      <v-col>
                        <div>ผู้สอนแทน</div>
                        <div class="font-semibold pl-2">{{ `${course.substituteCoachFirstNameTh} ${course.substituteCoachLastNameTh}` }}</div>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </div>
              <v-row dense>
                <v-col class="font-bold text-lg ">
                  ไฟล์แนบ
                </v-col>
              </v-row>
              <v-divider class="my-2"></v-divider>
              <v-card @click="dowloadFile(file)" flat class="mb-3" v-for="(file, index) of attachment_leave" :key="`${index}-file`">
                <v-card-text class="border border-2 border-[#ff6b81] rounded-lg">
                  <v-row>
                    <v-col cols="auto" class="pr-2">
                      <v-img height="35" width="26" src="../../../assets/coachLeave/file-pdf.png"/>
                    </v-col>
                    <v-col  class="px-2">
                        <span class="font-bold">{{ file.fileName }}</span><br>
                        <span class="text-caption">ขนาดไฟล์ : {{ (file.size / 1000000).toFixed(2) }} MB</span>
                    </v-col>
                    <!-- <v-col cols="auto" class="pl-2">
                      <v-btn @click="removeFile(index)" icon color="#ff6b81"><v-icon>mdi-close</v-icon></v-btn>
                    </v-col> -->
                  </v-row>
                </v-card-text>
              </v-card>
             </template>
          </v-card-text>
        </v-card>
      </v-dialog>
      <!-- COMMENT -->
      <v-dialog persistent :width="$vuetify.breakpoint.smAndUp ? '60vw' : ''" v-model="show_comment" v-if="show_comment">
        <v-card  class="pa-1">
                <v-row dense>
                    <v-col class="pa-0" cols="12" align="right">
                        <v-btn icon @click="closeComment">
                            <v-icon color="#ff6b81">mdi-close</v-icon>
                        </v-btn>
                    </v-col>
                </v-row>
                <v-card-text>
                  <v-row dense>
                    <v-col align="center" class="text-lg font-bold">ความคิดเห็นเพิ่มเติม</v-col>
                  </v-row>
                  <v-row dense>
                      <v-col>
                          <labelCustom text="เพิ่มความคิดเห็น"></labelCustom>
                          <div>{{show_comment_data.assessment.remark}}</div>
                      </v-col>
                  </v-row>
                  <div v-if="show_comment_data.assessment.attachment.length > 0">
                      <v-row dense>
                          <v-col class="font-bold text-lg ">
                          ไฟล์แนบ
                          </v-col>
                      </v-row>
                      <v-card flat class="mb-3" v-for="(file, index) of show_comment_data.assessment.attachment" :key="`${index}-fileattachment`">
                          <v-card-text class="border border-2 border-[#ff6b81] rounded-lg">
                          <v-row>
                              <v-col cols="auto" class="pr-2">
                              <v-img height="35" width="26" src="../../../assets/coachLeave/file-pdf.png"/>
                              </v-col>
                              <v-col  class="px-2">
                                  <span class="font-bold">{{ `ไฟล์ ${index+1}`}}</span><br>
                                  <!-- <span class="text-caption">ขนาดไฟล์ : {{ (0 / 1000000).toFixed(2) }} MB</span> -->
                              </v-col>
                              <!-- <v-col cols="auto" class="pl-2">
                              <v-btn @click="removePotentialFile(index)" icon color="#ff6b81"><v-icon>mdi-close</v-icon></v-btn>
                              </v-col> -->
                          </v-row>
                          </v-card-text>
                      </v-card>
                  </div>
                </v-card-text>
            </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>
  <script>
import calendarCoach from "@/components/calendar/calendarCoach.vue";
import headerPage from '../../../components/header/headerPage.vue';
import rowData from '../../../components/label/rowData.vue';
import imgCard from '../../../components/course/imgCard.vue';
import moment from 'moment';
import labelCustom from '../../../components/label/labelCustom.vue';
import Swal from "sweetalert2";
import { dateFormatter } from "@/functions/functions";
import { mapActions, mapGetters } from "vuex";
export default {
  name: "menageCourse",
  components: { calendarCoach, headerPage, rowData, imgCard,labelCustom },
  data: () => ({
    singleExpand: false,
    expanded: [],
    filter_course: "",
    user_detail : "",
    tab: "teaching list",
    today : new Date(),
    tabs : [
      {label: "รายการสอนวันนี้", value:"teaching list"},
      {label: "การสอนของฉัน", value:"my teaching"},
      {label: "ลงเวลาเพื่อขอลา", value:"request leave"}
    ],
    time_frame_list: [
      { label: "รายวัน", value: "day" },
      { label: "รายสัปดาห์", value: "week" },
      { label: "รายเดือน", value: "month" },
    ],
    time_frame: "day",
    menu: false,
    check_in_status_options :[
        {label : "ตรงเวลา", value : "punctual", color: "#58A144", bg_color : "#F0F9EE"},
        {label : "สาย", value : "late", color: "#FCC419", bg_color : "#FFF9E8"},
        {label : "ลา", value : "leave", color: "#43A4F5", bg_color : "#CFE2F3"},
        {label : "ลาฉุกเฉิน", value : "emergency leave", color: "#43A4F5", bg_color : "#CFE2F3"}, 
        {label : "ขาด", value : "absent", color: "#F03D3E", bg_color : "#F4CCCC"},
    ],
    select_date : `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}`,
    column:[
        {text: 'วันที่',align: 'center',sortable: false, value: 'date'},
        {text: 'ประเภทการลา',align: 'center',sortable: false, value: 'leaveType'},
        {text: 'สถานะ',align: 'center',sortable: false, value: 'status'},
        {text: '',align: 'right',sortable: false, value: 'action'},
    ],
    previewUrl : null,
    periods :[
      {label : "ลาเต็มวัน", value: "full"},
      {label : "ลาช่วงเช้า", value: "morning"},
      {label : "ลาช่วงบ่าย", value: "afternoon"},
    ],
    leaveTypes : [
      {label : 'ลาป่วย', value : 'sick'},
      {label : 'ลากิจ', value : "personal"},
      {label : 'ลาพักร้อน', value :"take annual leave"},
    ],
    coach_leave_data : {
      menu_start_date : false,
      start_date :null,
      start_date_str : "",
      menu_end_date : false,
      end_date : null,
      end_date_str : "",
      period : "",
      coach_id : "",
      remark : "",
      status : "",
      leave_type : "",
      courses : [
        {
          my_course_id : "",
          course_id : "",
          substitute_coach_id : "",
          day_of_week_id: "",
          time_id : "",
        }
      ]
    },
    edited_coach_leave_data : {},
    selected_files : [],
    show_detail : false,
    show_leave_form : false,
    show_leave_detail : false,
    show_comment : false,
    show_comment_data : {}
  }),
  created() {
    this.user_detail = JSON.parse(localStorage.getItem("userDetail"))
    
    // this.GetLeavesByAccountId({account_id : this.user_detail.account_id})
    
  },
  mounted() {
    this.$store.dispatch("NavberUserModules/changeTitleNavber", "จัดการ");
  },
  watch: {},
  computed: {
    ...mapGetters({
      my_courses : "CoachModules/getMyCourses",
      coachs : "CourseModules/getCoachs",
      coach_leaves : "CoachModules/getCoachLeaves",
      attachment_leave: "CoachModules/getAttachmentLeave",
      student_check_in : "CoachModules/getStudentCheckIn",
      coach_check_in : "CoachModules/getCoachCheckIn"
    }),
    SetFunctionsComputed(){
      this.GetMyCourses({coach_id : this.user_detail.account_id})
      this.GetLeavesByAccountId({account_id : this.user_detail.account_id})
      this.GetCoachs()
      return ''
    },
    genToday(){
      return moment(new Date()).format("YYYY-MM-DD")
    },
    validateCoachLeave(){
      let start_date = this.coach_leave_data.start_date ? true : false 
      let end_date = this.coach_leave_data.end_date ? true : false 
      let period = this.coach_leave_data.period ? true : false 
      let leave_type = this.coach_leave_data.leave_type ? true : false
      let course = this.coach_leave_data.courses.length > 0 ? this.coach_leave_data.courses[0].my_course_id ? true : false : false
      console.log(start_date && end_date && period && leave_type && course)
      return !(start_date && end_date && period && leave_type && course)
    }
  },
  methods: {
    ...mapActions({
      GetMyCourses : "CoachModules/GetMyCourses",
      GetCoachs : "CourseModules/GetCoachs",
      SaveCoachLeave : "CoachModules/SaveCoachLeave",
      GetLeavesByAccountId : "CoachModules/GetLeavesByAccountId",
      updateStatusCoachLeave : "CoachModules/updateStatusCoachLeave",
      GetAttachmentLeave : "CoachModules/GetAttachmentLeave",
      GetStudentByTimeId : "CoachModules/GetStudentByTimeId",
      GetCoachCheckIn : "CoachModules/GetCoachCheckIn"
    }),
    showComment(course){
      this.show_comment = true
      this.show_comment_data = course
    },
    closeComment(){
      this.show_comment = false
      this.show_comment_data = {}
    },
    CloseOpenSummaryAll(){
      for(const course of this.my_courses){
        course.show_summary = false
        course.show_assessment = false
        course.show_assessment_pantential = false
      }
    },
    OpenSummary(course){
      this.CloseOpenSummaryAll()
      this.GetCoachCheckIn({course_id :course.course_id, date : course.start_date})
      if(course.show_summary){
        course.show_summary = false
      }else{
        course.show_summary = true
      }
      course.show_assessment = false
      course.show_assessment_pantential = false
    },
    OpenAssessment(course){
      this.CloseOpenSummaryAll()
      this.GetStudentByTimeId({course_id :course.course_id, date : course.start_date, time_id: course.time_id})
      course.show_summary = false
      if(course.show_assessment){
        course.show_assessment = false
      }else{
        course.show_assessment = true
      }
      course.show_assessment_pantential = false
    },
    OpenAssessmentPotential(course){
      this.CloseOpenSummaryAll()
      this.GetStudentByTimeId({course_id :course.course_id, date : course.start_date, time_id: course.time_id})
      course.show_summary = false
      course.show_assessment = false
      if(course.show_assessment_pantential){
        course.show_assessment_pantential = false
      }else{
        course.show_assessment_pantential = true
      }
    },
    genDate(date){
      // console.log(date)
      return dateFormatter(new Date(date), "DD MT YYYYT")
    },
    RemoveCourse(index){
      this.coach_leave_data.courses.splice(index, 1)
    },
    AddCourse(){
      this.coach_leave_data.courses.push(
        {
          my_course_id : "",
          course_id : "",
          substitute_coach_id : "",
          day_of_week_id: "",
          time_id : "",
        }
      )
    },
    cancelCoachLeave(data){    
      Swal.fire({
        icon: "question",
        title: "ต้องการยกเลิกใบลาใช่หรือไม่ ?",
        showDenyButton: false,
        showCancelButton: true,
        cancelButtonText: "ยกเลิก",
        confirmButtonText: "ตกลง",
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.updateStatusCoachLeave({coach_leave_id : data.coachLeaveId, status : 'cancel', account_id :this.user_detail.account_id})
        }
      })
      
    },
    dowloadFile(file){
      let parts = file.attachmentFile.split("/")
      console.log(parts)
      let endpoint = `${process.env.VUE_APP_URL}/api/v1/files/`
      parts.forEach((part, index)=>{
        if((parts.length - 1) !== index){
          endpoint = endpoint+`${part}/`
        }else{
          endpoint = endpoint+encodeURIComponent(part)
        }
      })
      // const https = require('https');
      // const fs = require('fs');
      // console.log(endpoint)
      // let filename =  file.fileName
      // window.open(endpoint, '_self');
      // https.get(endpoint, (response) => {
      //   const fileStream = fs.createWriteStream(filename);
      //   response.pipe(fileStream);
      //   fileStream.on('finish', () => {
      //     console.log(`File ${filename} downloaded successfully.`);
      //   });
      // }).on('error', (err) => {
      //   console.error(`Error downloading file: ${err.message}`);
      // });
    },
    saveCoachLeave(){
      Swal.fire({
        icon: "question",
        title: "ต้องการส่งใบลาใช่หรือไม่ ?",
        showDenyButton: false,
        showCancelButton: true,
        cancelButtonText: "ยกเลิก",
        confirmButtonText: "ตกลง",
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.coach_leave_data.courses.forEach((course)=>{
            let my_course_id_part = course.my_course_id.split("|")
            course.course_id = my_course_id_part[0]
            course.day_of_week_id = my_course_id_part[1]
            course.time_id  = my_course_id_part[2]
          })
          this.coach_leave_data.coach_id = this.user_detail.account_id
          this.SaveCoachLeave({coach_leave_data : this.coach_leave_data,files : this.selected_files})
          this.closeDialogLeaveForm()
        }
      })
   
    },
    GenCourseLeaveOptions(){
      let my_course_data = []
      this.my_courses.forEach((course) => {
        my_course_data.push({
          my_course_id : `${course.course_id}|${course.day_of_week_id}|${course.time_id}`,
          cousre_id : course.course_id,
          course_name : `${course.name} ${course.start_time} - ${course.end_time}น.`,
          time_id : course.time_id,
          day_of_week_id : course.day_of_week_id,
        })
      });
      return my_course_data
    },
    inputDate(e, data) {
      switch (data) {
        case "start":
          this.coach_leave_data.start_date_str = dateFormatter(
            e,
            "DD MT YYYYT"
          );
          break;
        case "end":
          this.coach_leave_data.end_date_str = dateFormatter(
            e,
            "DD MT YYYYT"
          );
          break;
      }
    },
    showLeaveForm(){
      this.show_leave_form = true
    },
    closeDialogLeaveForm(){
      this.show_leave_form = false
      this.coach_leave_data = {
        menu_start_date : false,
        start_date :null,
        start_date_str : "",
        menu_end_date : false,
        end_date : null,
        end_date_str : "",
        period : "",
        coach_id : "",
        day_of_week_id: "",
        time_id : "",
        remark : "",
        status : "",
        leave_type : "",
        courses : [
          {
            my_course_id : "",
            course_id : "",
            substitute_coach_id : "",
            day_of_week_id: "",
            time_id : "",
          }
        ]
      }
    },
    showDialogDetail(leave_data){
      console.log(leave_data)
      this.show_leave_detail = true
      this.edited_coach_leave_data = leave_data
      this.GetAttachmentLeave({coach_leave_id : leave_data.coachLeaveId})
     
    },
    closeDialogLeaveDetail(){
      this.show_leave_detail = false
      this.edited_coach_leave_data = {}
      this.attachment_leave = []
    },
    openFileSelector() {
      this.$refs.fileInput.click();
    },
    removeFile(index){
      this.selected_files.splice(index, 1)
    },
    uploadFile() {
      const files = this.$refs.fileInput.files
      console.log(files)
      if(files.length > 0){
        for (let i = 0; i < files.length; i++) {
          this.selected_files.push(files[i])
        }
      }
    },
    filterMycourse(){
      if(this.filter_course){
        return this.my_courses.filter(v => v.course_id === this.filter_course)
      }else{
        return this.my_courses
      }
      
    }
  },
};
</script>
  
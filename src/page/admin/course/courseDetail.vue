<template>
    <v-app>
        <v-container>
            {{setFunctions}}
            <loading-overlay :loading="course_is_loading"></loading-overlay>
            <header-page :breadcrumbs="breadcrumbs"></header-page>
            
            <v-row class="mb-3">
                <v-col cols="12" sm @click="tab = 'course'">
                    <img-card
                        vertical
                        class="cursor-pointer"
                        :class="tab === 'course' ? 'img-card-active' : ''"
                    >
                        <template v-slot:img>
                            <v-img
                                height="72"
                                width="72"
                                src="../../../assets/course/course.png"
                            ></v-img>
                            <span class="text-lg font-bold"> คอร์สเรียน </span>
                        </template>
                    </img-card>
                </v-col>
                <v-col
                    v-if="course_data.course_type_id === 'CT_1'"
                    cols="12"
                    sm
                    @click="tab = 'time and coach'"
                >
                    <img-card
                        vertical
                        class="cursor-pointer"
                        :class="tab === 'time and coach' ? 'img-card-active' : ''"
                    >
                        <template v-slot:img>
                            <v-img
                                height="72"
                                width="72"
                                src="../../../assets/course/time_and_coach.png"
                            ></v-img>
                            <span class="text-lg font-bold"> ช่วงเวลาและโค้ช </span>
                        </template>
                    </img-card>
                </v-col>
                <v-col
                    v-if="course_data.course_type_id === 'CT_1'"
                    cols="12"
                    sm
                    @click="tab = 'package'"
                >
                    <img-card
                        vertical
                        class="cursor-pointer"
                        :class="tab === 'package' ? 'img-card-active' : ''"
                    >
                        <template v-slot:img>
                            <v-img
                                height="72"
                                width="72"
                                src="../../../assets/course/package.png"
                            ></v-img>
                            <span class="text-lg font-bold"> แพ็คเกจ </span>
                        </template>
                    </img-card>
                </v-col>
                <v-col
                    v-if="course_data.course_type_id === 'CT_1'"
                    cols="12"
                    sm
                    @click="tab = 'arkwork'"
                >
                    <img-card
                        vertical
                        class="cursor-pointer"
                        :class="tab === 'arkwork' ? 'img-card-active' : ''"
                    >
                        <template v-slot:img>
                            <v-img
                                height="72"
                                width="72"
                                src="../../../assets/course/upload_file.png"
                            ></v-img>
                            <span class="text-lg font-bold"> งานศิลปะ </span>
                        </template>
                    </img-card>
                </v-col>
                
                <v-col cols="12" sm @click="tab = 'student list'">
                    <img-card
                        vertical
                        class="cursor-pointer"
                        :class="tab === 'student list' ? 'img-card-active' : ''"
                    >
                        <template v-slot:img>
                            <v-img
                                height="72"
                                width="72"
                                src="../../../assets/course/student_list.png"
                            ></v-img>
                            <span class="text-lg font-bold"> รายชื่อนักเรียน </span>
                        </template>
                    </img-card>
                </v-col>
            </v-row>
            <!-- BODY -->
            <v-card v-if="!course_is_loading">
                <v-card-text>
                    <v-tabs-items v-model="tab">
                        <!-- COURSE -->
                        <v-tab-item value="course">
                            <course-card
                                :disable="!course_edit"
                                edited
                                :categorys="categorys"
                                :coachs="coachs"
                            ></course-card>
                            <!-- ACTION -->
                            <v-row class="px-4" v-if="!course_edit">
                                <v-col align="right">
                                    <v-btn
                                        color="#FF6B81"
                                        class="white--text btn-size-lg"
                                        depressed
                                        @click="course_edit = true"
                                    >แก้ไข
                                    </v-btn>
                                </v-col>
                            </v-row>
                            <v-row class="px-4" v-if="course_edit">
                                <v-col align="right">
                                    <v-btn
                                        color="#FF6B81"
                                        class="btn-size-lg"
                                        outlined
                                        @click="cancelEdit()"
                                    >ยกเลิก</v-btn>
                                </v-col>
                                <v-col cols="auto">
                                    <v-btn
                                        color="#FF6B81"
                                        class="white--text btn-size-lg"
                                        depressed
                                        @click="CourseUpdateDetail()"
                                    >บันทึก
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-tab-item>
                        <!-- COACH AND TIME -->
                        <v-tab-item value="time and coach">
                            <v-card flat>
                                <headerCard title="รายละเอียดเวลาและโค้ช">
                                    <template v-slot:actions>
                                        <v-btn
                                            outlined
                                            :disabled="!course_edit"
                                            color="#FF6B81"
                                            @click="addCoach"
                                        >
                                            <v-icon>mdi-plus-circle-outline</v-icon>
                                            เพิ่มโค้ช
                                        </v-btn>
                                    </template>
                                </headerCard>
                                <v-card-text class="pt-0">
                                    <v-divider class="mb-3"></v-divider>
                                    <!-- COACH -->
                                    <coachs-card
                                        :disable="!course_edit"
                                        :coachs="coachs"
                                        edited
                                    ></coachs-card>
                                </v-card-text>
                            </v-card>
                            <!-- ACTION -->
                            <v-row class="px-4" v-if="!course_edit">
                                <v-col align="right">
                                    <v-btn
                                        color="#FF6B81"
                                        class="white--text btn-size-lg"
                                        depressed
                                        @click="course_edit = true"
                                    >แก้ไข
                                    </v-btn>
                                </v-col>
                            </v-row>
                            <v-row class="px-4" v-if="course_edit">
                                <v-col align="right">
                                    <v-btn
                                        color="#FF6B81"
                                        class="btn-size-lg"
                                        outlined
                                        @click="cancelEdit()"
                                    >ยกเลิก</v-btn>
                                </v-col>
                                <v-col cols="auto">
                                    <v-btn
                                        color="#FF6B81"
                                        class="white--text btn-size-lg"
                                        depressed
                                        @click="CourseUpdateCoach()"
                                    >บันทึก
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-tab-item>
                        <!-- PACKAGE -->
                        <v-tab-item value="package">
                            <package-card :disable="!course_edit" edited></package-card>
                            <v-row dense>
                                <v-col align="center">
                                    <v-btn :disabled="!course_edit" outlined color="#ff6b81" @click="addPackage(course_data.packages)"><v-icon>mdi-plus</v-icon>เพิ่มแพ็คเกจ</v-btn>
                                </v-col>
                            </v-row>
                             <!-- ACTION -->
                             <v-row class="px-4" v-if="!course_edit">
                                <v-col align="right">
                                    <v-btn
                                        color="#FF6B81"
                                        class="white--text btn-size-lg"
                                        depressed
                                        @click="course_edit = true"
                                    >แก้ไข
                                    </v-btn>
                                </v-col>
                            </v-row>
                            <v-row class="px-4" v-if="course_edit">
                                <v-col align="right">
                                    <v-btn
                                        color="#FF6B81"
                                        class="btn-size-lg"
                                        outlined
                                        @click="cancelEdit()"
                                    >ยกเลิก</v-btn>
                                </v-col>
                                <v-col cols="auto">
                                    <v-btn
                                        color="#FF6B81"
                                        class="white--text btn-size-lg"
                                        depressed
                                        @click="CourseUpdatePackage()"
                                    >บันทึก
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-tab-item>
                         <!-- ARKWORk -->
                         <v-tab-item value="arkwork">
                            <v-card class="mx-3 mb-3" flat>
                                <headerCard title="สิทธิพิเศษ"></headerCard>
                                <v-card-text class="border-dashed border-2 border-blue-600 rounded-lg">
                                    <v-row v-if="preview_privilege_url">
                                    <v-col align="center"  class="rounded-lg pa-0">
                                        <v-img  :src="preview_privilege_url" contain style="max-width: 200px" align="right">
                                        <v-btn v-if="course_edit" icon class="bg-[#f00]" dark @click="removePrivilegeFile"><v-icon>mdi-close</v-icon></v-btn>
                                        </v-img>
                                    </v-col>
                                    </v-row>
                                    <v-row v-if="!preview_privilege_url">
                                    <v-col cols="12" class="flex align-center justify-center">
                                        <v-img
                                        src="../../../assets/course/upload_file.png"
                                        max-height="105"
                                        max-width="122"
                                        ></v-img>
                                    </v-col>
                                    <v-col cols="12" class="flex align-center justify-center text-h5">
                                        อัพโหลดภาพสิทธิพิเศษ
                                    </v-col>
                                    <v-col
                                        cols="12"
                                        class="flex align-center justify-center text-caption"
                                    >
                                        ( ขนาดไฟล์งานไม่เกิน 1 Mb ต้องเป็นไฟล์ JPG, PNG )
                                    </v-col>
                                    <v-col cols="12" class="flex align-center justify-center">
                                        <v-btn outlined color="blue" :disabled="!course_edit" @click="openFilePrivilegeSelector"
                                        >เลือกไฟล์</v-btn
                                        >
                                        <input
                                        ref="fileInputPrivilege"
                                        type="file"
                                        @change="uploadPrivilegeFile"
                                        accept="image/png, image/jpeg"
                                        style="display: none"
                                        />
                                    </v-col>
                                    </v-row>
                                </v-card-text>
                                <headerCard title="งานศิลปะ"></headerCard>
                                <v-card-text class="border-dashed border-2 border-blue-600 rounded-lg">
                                    <v-row v-if="preview_artwork_files && preview_artwork_files.length > 0">
                                    <v-col cols="3" align="center" class="rounded-lg pa-2" v-for="(file, index) in preview_artwork_files" :key="index">
                                        <v-img 
                                        v-if="file?.artworkCourseId" 
                                        :src="file.attachmentUrl" 
                                        contain
                                        max-height="200"
                                        max-width="200"  align="right">
                                        <v-btn v-if="course_edit" icon class="bg-[#f00]" dark @click="removeArtworkFileData(file,index)"><v-icon>mdi-close</v-icon></v-btn>
                                        </v-img>
                                        <v-img 
                                        v-else
                                        :src="file" 
                                        contain
                                        max-height="200"
                                        max-width="200"  align="right">
                                        <v-btn  v-if="course_edit" icon class="bg-[#f00]" dark @click="removeArtworkFile(index)"><v-icon>mdi-close</v-icon></v-btn>
                                        </v-img>
                                    </v-col>
                                    </v-row>
                                    <v-row v-if="!preview_artwork_files || preview_artwork_files.length == 0">
                                    <v-col cols="12" class="flex align-center justify-center">
                                        <v-img
                                        src="../../../assets/course/upload_file.png"
                                        max-height="105"
                                        max-width="122"
                                        ></v-img>
                                    </v-col>
                                    <v-col cols="12" class="flex align-center justify-center text-h5">
                                        อัพโหลดภาพงานศิลปะ
                                    </v-col>
                                    <v-col
                                        cols="12"
                                        class="flex align-center justify-center text-caption"
                                    >
                                        ( ขนาดไฟล์งานไม่เกิน 1 Mb ต้องเป็นไฟล์ JPG, PNG )
                                    </v-col>
                                    </v-row>
                                    <v-row dense>
                                    <v-col align="center">
                                        <input
                                        ref="fileInputArtwork"
                                        type="file"
                                        @change="previewArtWorkFile"
                                        accept="image/png, image/jpeg"
                                        multiple
                                        style="display: none"
                                        />
                                        <v-btn :disabled="!course_edit" outlined color="blue" @click="openFileArtworSelector">เลือกไฟล์</v-btn>
                                    </v-col>
                                    </v-row>
                                </v-card-text>
                            </v-card>
                             <!-- ACTION -->
                             <v-row class="px-4" v-if="!course_edit">
                                <v-col align="right">
                                    <v-btn
                                        color="#FF6B81"
                                        class="white--text btn-size-lg"
                                        depressed
                                        @click="course_edit = true"
                                    >แก้ไข
                                    </v-btn>
                                </v-col>
                            </v-row>
                            <v-row class="px-4" v-if="course_edit">
                                <v-col align="right">
                                    <v-btn
                                        color="#FF6B81"
                                        class="btn-size-lg"
                                        outlined
                                        @click="cancelEdit()"
                                    >ยกเลิก</v-btn>
                                </v-col>
                                <v-col cols="auto">
                                    <v-btn
                                        color="#FF6B81"
                                        class="white--text btn-size-lg"
                                        depressed
                                        @click="CourseUpdateArkwork()"
                                    >บันทึก
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-tab-item>
                        <!-- STUDENT LIST -->
                        <v-tab-item value="student list">
                            <v-tabs v-model="student_tab" color="#ff6b81" class="mb-3">
                                <v-tab value="students in course">นักเรียกในคอร์ส</v-tab>
                                <v-tab value="student booking">นักเรียกจองคิว</v-tab>
                            </v-tabs>
                            <v-tabs-items v-model="student_tab" class="rounded-lg">
                                <v-tab-item valus="students in course">
                                    <v-card flat dent class="mb-3 rounded-lg">
                                        <v-card-text class="py-2 bg-[#FCE0E7] rounded-lg">
                                            <v-row dense class="d-flex align-center">
                                                <v-col class="text-[#ff6b81] font-bold"
                                                >รายชื่อโค้ช
                                                </v-col
                                                >
                                                <v-col cols="auto">
                                                    <v-text-field
                                                        class="bg-white rounded-lg"
                                                        dense
                                                        outlined
                                                        hide-details
                                                        placeholder="ค้นหาชื่อนักเรียน, ชื่อโค้ช"
                                                        prepend-inner-icon="mdi-magnify"
                                                    ></v-text-field>
                                                </v-col>
                                            </v-row>
                                        </v-card-text>
                                    </v-card>
                                    <div
                                        v-for="(course_data, course_index) in student_courses"
                                        :key="course_index"
                                    >
                                        <v-card
                                            @click="selectCoach(course_index)"
                                            outlined
                                            dense
                                            class="rounded-lg cursor-pointer mb-3 bg-[#FCFCFC]"
                                        >
                                            <v-card-text class="pa-2">
                                                <v-row dense class="d-flex align-center">
                                                    <v-col cols="auto">
                                                        <v-icon color="#ff6b81">mdi-account</v-icon>
                                                    </v-col>
                                                    <v-col class="font-bold">
                                                        โค้ช: {{ course_data.name }}
                                                    </v-col>
                                                    <v-col cols="auto">
                                                        <v-icon>{{
                                                                selected_coach === course_index
                                                                    ? "mdi-chevron-up"
                                                                    : "mdi-chevron-down"
                                                            }}
                                                        </v-icon>
                                                    </v-col>
                                                </v-row>
                                            </v-card-text>
                                        </v-card>
                                        <v-expand-transition>
                                            <div
                                                v-if="selected_coach === course_index"
                                                class="pa-3 bg-[#FCFCFC] rounded-b-lg"
                                            >
                                                <!-- FILTER -->
                                                <v-row dense class="mb-3">
                                                    <v-col>
                                                        <v-autocomplete
                                                            dense
                                                            outlined
                                                            hide-details
                                                            placeholder="วัน"
                                                        ></v-autocomplete>
                                                    </v-col>
                                                    <v-col>
                                                        <v-autocomplete
                                                            dense
                                                            outlined
                                                            hide-details
                                                            placeholder="วันที่"
                                                        ></v-autocomplete>
                                                    </v-col>
                                                    <v-col>
                                                        <v-autocomplete
                                                            dense
                                                            outlined
                                                            hide-details
                                                            placeholder="เวลา"
                                                        ></v-autocomplete>
                                                    </v-col>
                                                    <v-col>
                                                        <v-autocomplete
                                                            dense
                                                            outlined
                                                            hide-details
                                                            placeholder="package"
                                                        ></v-autocomplete>
                                                    </v-col>
                                                </v-row>
                                                <!-- Herder -->
                                                <v-row dense class="mb-3 font-bold">
                                                    <v-col cols="3" align="center">วันและวันที่</v-col>
                                                    <v-col cols="3" align="center">เวลาเรียน</v-col>
                                                    <v-col cols="3" align="center">แพ็คเกจ</v-col>
                                                    <v-col align="right"></v-col>
                                                </v-row>
                                                <div
                                                    v-for="(schedule, schedule_index) in course_data.schedule"
                                                    :key="schedule_index"
                                                >
                                                    <v-card
                                                        @click="selectSchedule(schedule_index)"
                                                        outlined
                                                        class="rounded-lg cursor-pointer mb-3"
                                                        dense
                                                    >
                                                        <v-card-text class="pa-2">
                                                            <v-row dense class="d-flex align-center">
                                                                <v-col
                                                                    cols="3"
                                                                    class="font-bold"
                                                                    align="center"
                                                                >{{ schedule.date }}
                                                                </v-col
                                                                >
                                                                <v-col
                                                                    cols="3"
                                                                    class="font-bold"
                                                                    align="center"
                                                                >{{ schedule.time }}
                                                                </v-col
                                                                >
                                                                <v-col cols="3" align="center">
                                                                    <v-chip
                                                                        text-color="white"
                                                                        :color="schedule.package === 'Exclusive Package'? 'primary': 'pink'"
                                                                    >{{ schedule.package }}
                                                                    </v-chip
                                                                    >
                                                                </v-col>
                                                                <v-col align="right">
                                                                    <v-icon>{{
                                                                            selected_schedule === schedule_index
                                                                                ? "mdi-chevron-up"
                                                                                : "mdi-chevron-down"
                                                                        }}
                                                                    </v-icon>
                                                                </v-col>
                                                            </v-row>
                                                        </v-card-text>
                                                    </v-card>
                                                    <v-expand-transition>
                                                        <div
                                                            v-if="selected_schedule === schedule_index"
                                                            class="px-3 mb-3"
                                                        >
                                                            <v-row dense class="d-flex align-center mb-2">
                                                                <v-col>
                                                                    <v-divider></v-divider>
                                                                </v-col>
                                                                <v-col cols="auto">ข้อมูลนักเรียน</v-col>
                                                                <v-col>
                                                                    <v-divider></v-divider>
                                                                </v-col>
                                                            </v-row>
                                                            <v-card class="mb-2" flat dense>
                                                                <v-card-text
                                                                    class="pa-2 bg-[#FCE0E7] rounded-lg"
                                                                >
                                                                    <v-row dense class="text-md font-bold">
                                                                        <v-col cols="1" align="center">ลำดับ</v-col>
                                                                        <v-col cols="2" align="center"
                                                                        >ชื่อ - นามสกุล
                                                                        </v-col
                                                                        >
                                                                        <v-col cols="1" align="center"
                                                                        >ชื่อเล่น
                                                                        </v-col
                                                                        >
                                                                        <v-col cols="3" align="center"
                                                                        >วันเริ่ม - วันสิ้นสุด
                                                                        </v-col
                                                                        >
                                                                        <v-col cols="1" align="center"
                                                                        >ระยะเวลา
                                                                        </v-col
                                                                        >
                                                                        <v-col cols="auto" align="center"
                                                                        >จำนวนครั้ง
                                                                        </v-col
                                                                        >
                                                                        <v-col></v-col>
                                                                    </v-row>
                                                                </v-card-text>
                                                            </v-card>
                                                            <v-card
                                                                class="mb-2"
                                                                outlined
                                                                dense
                                                                v-for="(student, student_index) in schedule.students"
                                                                :key="student_index"
                                                            >
                                                                <v-card-text class="pa-2">
                                                                    <v-row
                                                                        dense
                                                                        class="text-md font-bold flex align-center"
                                                                    >
                                                                        <v-col cols="1" align="center">{{
                                                                                student_index + 1
                                                                            }}
                                                                        </v-col>
                                                                        <v-col cols="2" align="center">{{
                                                                                student.student_name
                                                                            }}
                                                                        </v-col>
                                                                        <v-col cols="1" align="center">{{
                                                                                student.nick_name
                                                                            }}
                                                                        </v-col>
                                                                        <v-col cols="3" align="center">{{
                                                                                `${student.start_date} - ${student.end_date}`
                                                                            }}
                                                                        </v-col>
                                                                        <v-col cols="1" align="center">{{
                                                                                student.period_package
                                                                            }}
                                                                        </v-col>
                                                                        <v-col cols="1" align="center"
                                                                        >{{ student.amount }}/4
                                                                        </v-col
                                                                        >
                                                                        <v-col cols="auto">
                                                                            <v-row dense>
                                                                                <v-col class="pa-0">
                                                                                    <v-btn
                                                                                        text
                                                                                        class="px-1"
                                                                                        color="#ff6b81"
                                                                                    >
                                                                                        <v-icon
                                                                                        >mdi-check-decagram-outline
                                                                                        </v-icon
                                                                                        >
                                                                                        ดูประเมิน
                                                                                    </v-btn>
                                                                                </v-col>
                                                                                <v-col class="pa-0">
                                                                                    <v-btn
                                                                                        text
                                                                                        class="px-1"
                                                                                        color="#ff6b81"
                                                                                    >
                                                                                        <v-icon
                                                                                        >
                                                                                            mdi-clipboard-text-search-outline
                                                                                        </v-icon
                                                                                        >
                                                                                        ดูโปรไฟล์
                                                                                    </v-btn>
                                                                                </v-col>
                                                                            </v-row>
                                                                        </v-col>
                                                                    </v-row>
                                                                </v-card-text>
                                                            </v-card>
                                                        </div>
                                                    </v-expand-transition>
                                                </div>
                                            </div>
                                        </v-expand-transition>
                                    </div>
                                </v-tab-item>
                                <v-tab-item valus="student booking">
                                    <v-data-table
                                        class="header-table rounded-lg"
                                        :headers="column"
                                        :items="students_booking"
                                    >
                                        <template v-slot:[`item.status`]="{ item }">
                                            <v-chip
                                                class="w-full flex justify-center"
                                                label
                                                :text-color=" item.status === 'ติดต่อนักเรียน'? '#58A144': '#FCC419'"
                                                :color="item.status === 'ติดต่อนักเรียน'? '#F0F9EE': '#FFF9E8'"
                                            >{{ item.status }}
                                            </v-chip
                                            >
                                        </template>
                                    </v-data-table>
                                </v-tab-item>
                            </v-tabs-items>
                        </v-tab-item>
                    </v-tabs-items>
                </v-card-text>
            </v-card>
        </v-container>
    </v-app>
</template>

<script>
import courseCard from "@/components/course/courseCard.vue";
import packageCard from "@/components/course/packageCard.vue";
import coachsCard from "@/components/course/coachsCard.vue";
import HeaderPage from "@/components/header/headerPage.vue";
import headerCard from "@/components/header/headerCard.vue";
import ImgCard from "@/components/course/imgCard.vue";
import loadingOverlay from "../../../components/loading/loadingOverlay.vue";
import Swal from "sweetalert2";
import {CheckFileSize} from "@/functions/functions" 
// import rowData from '@/components/label/rowData.vue';
import {mapGetters, mapActions} from "vuex";

export default {
    name: "coureDetail",
    components: {
        HeaderPage,
        ImgCard,
        courseCard,
        coachsCard,
        packageCard,
        headerCard,
        loadingOverlay,
    },
    data: () => ({
        slide_group : null,
        column: [
            {
                text: "ชื่อ - นามสกุล",
                align: "start",
                sortable: false,
                value: "fullname",
            },
            {text: "เบอร์โทรศัพท์", align: "start", sortable: false, value: "tel"},
            {
                text: "ชื่อคอร์ส",
                align: "start",
                sortable: false,
                value: "course_name",
            },
            {text: "แพ็คเกจ", align: "start", sortable: false, value: "package"},
            {text: "สถานะ", align: "center", sortable: false, value: "status"},
        ],
        students_booking: [
            {
                fullname: "ยศพัฒน์ โชคชัย",
                tel: "089-111-1111",
                course_name: "เปียโนป๊อป",
                package: "Exclusive - รายเดือน / วันเสาร์ (10.00-11.00)",
                status: "ติดต่อนักเรียน",
            },
            {
                fullname: "ณภัค ธนสมบัติ",
                tel: "089-111-1111",
                course_name: "เปียโนป๊อป",
                package: "Exclusive - รายเดือน / วันเสาร์ (10.00-11.00)",
                status: "รอติดต่อ",
            },
            {
                fullname: "พชรี วงศ์ทิพย์",
                tel: "089-111-1111",
                course_name: "เปียโนป๊อป",
                package: "Exclusive - รายเดือน / วันเสาร์ (10.00-11.00)",
                status: "ติดต่อนักเรียน",
            },
        ],
        selected_coach: "",
        selected_schedule: "",
        breadcrumbs: [
            {text: "จัดการคอร์สทั้งหมด", to: "CourseList"},
            {text: "รายละเอียดคอร์สเรียน", to: ""},
        ],
        tab: "course",
        tab_menu : [
            {label : "คอร์สเรียน", value : "course", img : "../../../assets/course/course.png"},
            {label : "ช่วงเวลาและโค้ช", value : "time and coach", img : "../../../assets/course/time_and_coach.png"},
            {label : "แพ็คเกจ", value : "package", img : "../../../assets/course/package.png"},
            {label : "งานศิลปะ", value : "arkwork", img : "../../../assets/course/course.png"},
            {label : "รายชื่อนักเรียน", value : "student list", img : "../../../assets/course/student_list.png"}
        ],
        student_tab: null,
        course_edit: false,
        student_courses: [
            {
                name: "องศา วงกลม",
                schedule: [
                    {
                        date: "เสาร์ 12 กรกฏาคม 2566",
                        time: "10.00น. - 11.00น.",
                        package: "Exclusive Package",
                        students: [
                            {
                                student_name: "จิตรลดา มาลินี",
                                nick_name: "แตง",
                                start_date: "10/07/2022",
                                end_date: " 17/08/2022",
                                period_package: "รายวัน",
                                amount: "4",
                            },
                            {
                                student_name: "จิตรลดา มาลินี",
                                nick_name: "แตง",
                                start_date: "10/07/2022",
                                end_date: " 17/08/2022",
                                period_package: "รายวัน",
                                amount: "4",
                            },
                            {
                                student_name: "จิตรลดา มาลินี",
                                nick_name: "แตง",
                                start_date: "10/07/2022",
                                end_date: " 17/08/2022",
                                period_package: "รายวัน",
                                amount: "4",
                            },
                        ],
                    },
                    {
                        date: "เสาร์ 12 กรกฏาคม 2566",
                        time: "10.00น. - 11.00น.",
                        package: "Group Package",
                        students: [
                            {
                                student_name: "จิตรลดา มาลินี",
                                nick_name: "แตง",
                                start_date: "10/07/2022",
                                end_date: " 17/08/2022",
                                period_package: "รายวัน",
                                amount: "4",
                            },
                            {
                                student_name: "จิตรลดา มาลินี",
                                nick_name: "แตง",
                                start_date: "10/07/2022",
                                end_date: " 17/08/2022",
                                period_package: "รายวัน",
                                amount: "4",
                            },
                            {
                                student_name: "จิตรลดา มาลินี",
                                nick_name: "แตง",
                                start_date: "10/07/2022",
                                end_date: " 17/08/2022",
                                period_package: "รายวัน",
                                amount: "4",
                            },
                        ],
                    },
                ],
            },
            {
                name: "พงศพัศ เดชบุญ",
                schedule: [
                    {
                        date: "เสาร์ 12 กรกฏาคม 2566",
                        time: "10.00น. - 11.00น.",
                        package: "Exclusive Package",
                        students: [
                            {
                                student_name: "จิตรลดา มาลินี",
                                nick_name: "แตง",
                                start_date: "10/07/2022",
                                end_date: " 17/08/2022",
                                period_package: "รายวัน",
                                amount: "4",
                            },
                            {
                                student_name: "จิตรลดา มาลินี",
                                nick_name: "แตง",
                                start_date: "10/07/2022",
                                end_date: " 17/08/2022",
                                period_package: "รายวัน",
                                amount: "4",
                            },
                            {
                                student_name: "จิตรลดา มาลินี",
                                nick_name: "แตง",
                                start_date: "10/07/2022",
                                end_date: " 17/08/2022",
                                period_package: "รายวัน",
                                amount: "4",
                            },
                        ],
                    },
                    {
                        date: "เสาร์ 12 กรกฏาคม 2566",
                        time: "10.00น. - 11.00น.",
                        package: "Group Package",
                        students: [
                            {
                                student_name: "จิตรลดา มาลินี",
                                nick_name: "แตง",
                                start_date: "10/07/2022",
                                end_date: " 17/08/2022",
                                period_package: "รายวัน",
                                amount: "4",
                            },
                            {
                                student_name: "จิตรลดา มาลินี",
                                nick_name: "แตง",
                                start_date: "10/07/2022",
                                end_date: " 17/08/2022",
                                period_package: "รายวัน",
                                amount: "4",
                            },
                            {
                                student_name: "จิตรลดา มาลินี",
                                nick_name: "แตง",
                                start_date: "10/07/2022",
                                end_date: " 17/08/2022",
                                period_package: "รายวัน",
                                amount: "4",
                            },
                        ],
                    },
                ],
            },
        ],
        privilege_file: null,
        preview_privilege_url : null,
        artwork_files : [],
        preview_artwork_files : [],
    }),
    created() {},
    mounted() {},
    watch: {
        course_artwork : function(){
            this.preview_artwork_files = []
           if(this.course_artwork.length > 0){
                for(const arkwork of this.course_artwork){
                    console.log(arkwork)
                    this.preview_artwork_files.push(arkwork)
                }
           } 
           this.preview_privilege_url = this.course_data.course_img_privilege
        },
        tab: function () {
            this.GetArtworkByCourse({course_id : this.$route.params.course_id})
            this.preview_privilege_url = this.course_data.course_img_privilege
            this.course_edit = false;
            this.$store.dispatch("CourseModules/GetCourse",  this.$route.params.course_id);
          
        },
    },
    computed: {
        ...mapGetters({
            coachs: "CourseModules/getCoachs",
            categorys: "CategoryModules/getCategorys",
            course_data: "CourseModules/getCourseData",
            course_is_loading: "CourseModules/getCourseIsLoading",
            course_artwork :"CourseModules/getCourseArtwork"
        }),
        setFunctions(){
            this.$store.dispatch("CourseModules/GetCourse",  this.$route.params.course_id);
            this.$store.dispatch("CategoryModules/GetCategorys");
            this.$store.dispatch("CourseModules/GetCoachs");
            this.GetArtworkByCourse({course_id : this.$route.params.course_id})
            return ''
        }
    },
    methods: {
        ...mapActions({
            GetCourse: "CourseModules/GetCourse",
            ChangeCourseData: "CourseModules/ChangeCourseData",
            UpdateCourse: "CourseModules/UpdateCourse",
            UpdateCouserDetail: "CourseModules/UpdateCouserDetail",
            UpdateCouserCoach: "CourseModules/UpdateCouserCoach",
            UpdateCouserPackage: "CourseModules/UpdateCouserPackage",
            UpdateCourseArkwork : "CourseModules/UpdateCourseArkwork",
            GetArtworkByCourse : "CourseModules/GetArtworkByCourse",
            RemoveArkworkByArkworkId : "CourseModules/RemoveArkworkByArkworkId"
        }),
        openFilePrivilegeSelector() {
            this.$refs.fileInputPrivilege.click();
        },
        openFileArtworSelector(){
            this.$refs.fileInputArtwork.click()
        },
          // UPDATE FILE
        uploadPrivilegeFile() {
        this.privilege_file = this.$refs.fileInputPrivilege.files[0];
        const allowedTypes = ["image/png", "image/jpeg"];
        if(CheckFileSize(this.privilege_file) === true){
            this.course_data.privilege_file = this.$refs.fileInputPrivilege.files[0];
            this.ChangeCourseData(this.course_data);
            if (this.privilege_file && allowedTypes.includes(this.privilege_file.type)) {
            if (!this.privilege_file) return;
            const reader = new FileReader();
            reader.onload = (e) => {
                this.preview_privilege_url = e.target.result;
            };
            reader.readAsDataURL(this.privilege_file);
            }
        }
        },
        previewArtWorkFile(event) {
        const selectedFiles = event.target.files;
        const allowedTypes = ["image/png", "image/jpeg"];
        const fileUrls = [];
        for (let i = 0; i < selectedFiles.length; i++) {
            const file = selectedFiles[i];
            if(CheckFileSize(file) === true){
                if (allowedTypes.includes(file.type)) {
                    this.course_data.artwork_file.push(file)
                    const reader = new FileReader();
                    reader.onload = () => {
                    fileUrls.push(reader.result);
                    if (fileUrls.length == selectedFiles.length) {
                        this.preview_artwork_files = [...this.preview_artwork_files, ...fileUrls];
                    }
                    };
                    reader.readAsDataURL(file);
                } else {
                    // Display error message or handle invalid file type
                }
            } 
        }
        this.ChangeCourseData(this.course_data);
        },
        // REMOVE 
        removeArtworkFile(index){
            this.preview_artwork_files.splice(index, 1)
        },
        removeArtworkFileData(data, index){
            Swal.fire({
                icon: "question",
                title: "ต้องการลบไฟล์นี้ใช่หรือไม่",
                showDenyButton: false,
                showCancelButton: true,
                confirmButtonText: "ตกลง",
                cancelButtonText: "ยกเลิก",
            })
            .then(async (result) => {
                if (result.isConfirmed) {
                    this.RemoveArkworkByArkworkId({artwork_data : data})
                    this.preview_artwork_files.splice(index, 1)
                }
            })
        },
        removePrivilegeFile(){
            this.preview_privilege_url = null
        },
        addPackage(data) {
            data.push({
                package: "",
                students: 0,
                options: [
                {
                    period_package: "",
                    amount: 0,
                    price_unit: 0,
                    discount: false,
                    discount_price: 0,
                    privilege: "",
                    net_price: 0,
                    net_price_unit: 0,
                },
                ],
            });
            this.ChangeCourseData(this.course_data);
        },
        CourseUpdateDetail(){
            Swal.fire({
                icon: "question",
                title: "ต้องการแก้ไขคอร์สใช่มั้ย",
                showDenyButton: false,
                showCancelButton: true,
                confirmButtonText: "ตกลง",
                cancelButtonText: "ยกเลิก",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    this.UpdateCouserDetail({course_id :  this.course_data.course_id ,course_data : this.course_data })
                    .then(()=>{
                        this.course_edit = false;
                        this.GetCourse(this.$route.params.course_id);
                        this.GetArtworkByCourse({course_id : this.$route.params.course_id})
                    })
                }
            })
        },
        CourseUpdateCoach(){
            console.log(this.course_data.coachs)
            Swal.fire({
                icon: "question",
                title: "ต้องการแก้ไขคอร์สใช่มั้ย",
                showDenyButton: false,
                showCancelButton: true,
                confirmButtonText: "ตกลง",
                cancelButtonText: "ยกเลิก",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    this.UpdateCouserCoach({course_id :  this.course_data.course_id ,course_data : this.course_data })
                    .then(()=>{
                        this.course_edit = false;
                        this.GetCourse(this.$route.params.course_id);
                        this.GetArtworkByCourse({course_id : this.$route.params.course_id})
                    })
                }
            })
        },
        CourseUpdatePackage(){
            Swal.fire({
                icon: "question",
                title: "ต้องการแก้ไขคอร์สใช่มั้ย",
                showDenyButton: false,
                showCancelButton: true,
                confirmButtonText: "ตกลง",
                cancelButtonText: "ยกเลิก",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    this.UpdateCouserPackage({course_id :  this.course_data.course_id ,course_data : this.course_data })
                    .then(()=>{
                        this.course_edit = false;
                        this.GetCourse(this.$route.params.course_id);
                        this.GetArtworkByCourse({course_id : this.$route.params.course_id})
                    })
                }
            })
        },
        CourseUpdateArkwork(){
            Swal.fire({
                icon: "question",
                title: "ต้องการแก้ไขคอร์สใช่มั้ย",
                showDenyButton: false,
                showCancelButton: true,
                confirmButtonText: "ตกลง",
                cancelButtonText: "ยกเลิก",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    this.UpdateCourseArkwork({course_id :  this.course_data.course_id ,course_data : this.course_data }).then(()=>{
                        this.course_edit = false;
                        this.GetCourse(this.$route.params.course_id);
                        this.GetArtworkByCourse({course_id : this.$route.params.course_id})
                    })
                }
            })
        },
        updateCourse() {
            Swal.fire({
                icon: "question",
                title: "ต้องการแก้ไขคอร์สใช่มั้ย",
                showDenyButton: false,
                showCancelButton: false,
                confirmButtonText: "ตกลง",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    this.UpdateCourse({course_data: this.course_data});
                }
            })
            // this.ChangeCourseData(this.course_data);
        },
        addCoach() {
            this.course_data.coachs.push({
                coach_id: "",
                coach_name: "",
                teach_days_used: [],
                teach_day_data: [
                    {
                        class_open: false,
                        teach_day: [],
                        class_date: [
                            {
                                class_date_range: {
                                    start_time: "",
                                    menu_start_time: false,
                                    end_time: "",
                                    menu_end_time: false,
                                },
                                students: 0,
                            },
                        ],
                    },
                ],
                class_date_range: {
                    start_date: "",
                    menu_start_date: false,
                    end_date: "",
                    menu_end_date: false,
                },
                register_date_range: {
                    start_date: "",
                    menu_start_date: false,
                    end_date: "",
                    menu_end_date: false,
                },
                period: {
                    start_time: "",
                    end_time: "",
                },
            });
            this.ChangeCourseData(this.course_data);
        },
        removeCoach(data, index) {
            data.splice(index, 1);
            this.ChangeCourseData(this.course_data);
        },
        cancelEdit() {
            this.course_edit = false;
            this.GetCourse(this.$route.params.course_id);
        },
        selectCoach(coach) {
            if (this.selected_coach !== coach) {
                this.selected_coach = coach;
            } else {
                this.selected_coach = "";
            }
        },
        selectSchedule(schedule) {
            if (this.selected_schedule !== schedule) {
                this.selected_schedule = schedule;
            } else {
                this.selected_schedule = "";
            }
        },
    },
};
</script>
  
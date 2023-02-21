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
        <template v-if="$route.params.package_id !== 'short-course'">
            <v-row dense>
                <v-col class="text-lg font-bold">
                    เลือกช่วงวันเรียน
                </v-col>
            </v-row>
            <v-radio-group
                v-model="courses.day"
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
            <template v-if="courses.day">
                <v-row>
                    <v-col class="text-lg font-bold">เลือกช่วงเวลาเรียน</v-col>
                </v-row>
                <v-radio-group 
                    @change="courses.coach = ''"
                    v-model="courses.time_period"
                >
                    <v-row>
                        <v-col cols="6" v-for="(time , time_index) in courses.day.times" :key="time_index">
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
            <template v-if="courses.time_period">
                <v-row>
                    <v-col class="text-lg font-bold">เลือกโค้ช</v-col>
                </v-row>
                <v-autocomplete
                dense
                v-model="courses.coach"
                color="#FF6B81"
                :items="coachs"
                item-text="name"
                item-value="coach_id"
                item-color="pink"
                outlined
                placeholder="เลือกโค้ช"
                >
                <template v-slot:no-data>
                    <v-list-item>
                    <v-list-item-title> ไม่พบข้อมูล </v-list-item-title>
                    </v-list-item>
                </template>
                <template v-slot:item="{ item }">
                    <v-list-item-content>
                    <v-list-item-title
                        ><span
                        :class="courses.coach === item.coach_id ? 'font-bold' : ''"
                        >{{ item.name }}</span
                        ></v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-action>
                    <v-icon v-if="courses.coach === item.coach_id"
                        >mdi-check-circle</v-icon
                    >
                    </v-list-item-action>
                </template>
                </v-autocomplete>
            </template>
        </template>
        <!-- REGISTER -->
        <v-row dense>
            <v-col class="text-lg font-bold">
                สมัครเรียนให้
            </v-col>
        </v-row>
        <v-row dense class="d-flex align-center">
            <v-col >
                <v-checkbox v-model="apply_for_yourself" color="#ff6B81" label="สมัครเรียนให้ตัวเอง"></v-checkbox>
            </v-col>
            <v-col cols="auto" v-if="apply_for_yourself">
                <v-btn dense outlined color="#ff6b81" @click="dialog_parent = true"><v-icon>mdi-plus-circle-outline</v-icon>เพิ่มข้อมูลผู้ปกครอง</v-btn>
            </v-col>
        </v-row>
        <v-row dense>
            <v-col cols="12" sm="6">
                <v-checkbox v-model="apply_for_others" color="#ff6B81" label="สมัครเรียนให้ผู้อื่น"></v-checkbox>
            </v-col>
        </v-row>
        <!-- PARENT -->
        <template v-if="courses.students.length > 0">
            <div class="mb-3" v-for="(parent, index_parent) in courses.students.filter(v => v.is_other === false)[0].parents" :key="`${index_parent}-perent`">
                <v-row dense class="mb-3"> 
                    <v-col cols="auto"><v-icon color="#ff6b81">mdi-card-account-details-outline</v-icon></v-col>
                    <v-col class="text-lg font-bold">{{ `ผู้ปกครอง` }}</v-col>
                </v-row>
                <v-card outlined>
                    <v-card-text>
                        <v-row dense>
                            <v-col cols="12" sm="6">
                                <labelCustom required text="ชื่อ(ภาษาอักฤษ)"></labelCustom>
                                <v-text-field dense outlined v-model="parent.firstname_en" placeholder="ชื่อภาษาอังกฤษ"></v-text-field>
                            </v-col>
                            <v-col  cols="12" sm="6">
                                <labelCustom required text="นามสกุล(ภาษาอักฤษ)"></labelCustom>
                                <v-text-field dense outlined v-model="parent.lastname_en" placeholder="นามสกุลภาษาอังกฤษ"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row dense>
                            <v-col  cols="12" sm="6">
                                <labelCustom required text="เบอร์โทรศัพท์"></labelCustom>
                                <v-text-field dense outlined v-model="parent.tel"  placeholder="เบอร์โทรศัพท์"></v-text-field>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </div>
        </template>
        <!-- STUDENT -->
        <div v-for="(student, index_student) in courses.students.filter(v => v.is_other === true)" :key="index_student">
            <v-row dense > 
                <v-col cols="auto"><v-icon color="#ff6b81">mdi-card-account-details-outline</v-icon></v-col>
                <v-col class="text-lg font-bold">{{ `ผู้เรียน ${index_student+1}` }}</v-col>
                <v-col cols="auto" v-if="courses.students.filter(v => v.is_other === true).length > 1">
                    <v-btn @click="removeStudent(student)" small icon color="red" dark><v-icon>mdi-close</v-icon></v-btn>
                </v-col>
            </v-row>
            <v-card outlined class="mb-3">
                <v-card-text>
                    <v-row dense class="d-flex align-center">
                        <v-col  cols="12" sm="5">
                            <labelCustom text="Username (ถ้ามี)"></labelCustom>
                            <v-text-field hide-details dense outlined v-model="student.username"  placeholder="Username"></v-text-field>
                            <label>
                                หากยังไม่มีบัญชีผู้ใช้กรุณา
                            </label>
                            <label
                                class="text-[#ff6b81] underline cursor-pointer mt-5"
                                @click="changeDialogRegisterOneId(true)"
                            >สมัคร One ID</label>
                        </v-col>
                        <v-col cols="auto">
                            <v-btn color="#ff6b81" depressed dark @click="is_account = true">ตกลง</v-btn>
                        </v-col>
                    </v-row>
                    <template v-if="is_account">
                        <v-row dense>
                            <v-col cols="12" sm="6">
                                <labelCustom required text="ชื่อ(ภาษาอักฤษ)"></labelCustom>
                                <v-text-field dense outlined v-model="student.firstname_en" placeholder="ชื่อภาษาอังกฤษ"></v-text-field>
                            </v-col>
                            <v-col  cols="12" sm="6">
                                <labelCustom required text="นามสกุล(ภาษาอักฤษ)"></labelCustom>
                                <v-text-field dense outlined v-model="student.lastname_en" placeholder="นามสกุลภาษาอังกฤษ"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row dense>
                            <v-col  cols="12" sm="6">
                                <labelCustom required text="เบอร์โทรศัพท์"></labelCustom>
                                <v-text-field dense outlined v-model="student.tel"  placeholder="เบอร์โทรศัพท์"></v-text-field>
                            </v-col>
                        </v-row>
                    </template>
                </v-card-text>
            </v-card>
            <v-row dense v-if="index_student === courses.students.filter(v => v.is_other === true).length - 1">
                <v-col>
                    <v-btn @click="addStudent" text dense color="#ff6b81"><v-icon>mdi-plus-circle-outline</v-icon>เพิ่มผู้เรียน</v-btn>
                </v-col>
            </v-row>
        </div>
        <v-row dense>
            <v-col cols="12" sm="6">
                <v-btn class="w-full" outlined dense color="#ff6b81">เพิ่มรถเข็น</v-btn>
            </v-col>
            <v-col cols="12" sm="6">
                <v-btn class="w-full" dark depressed dense color="#ff6b81">ชำระเงิน</v-btn>
            </v-col>
        </v-row>
      </v-container>
      <!-- DIALOG :: ADD PARENT-->
      <v-dialog v-model="dialog_parent">
        <v-card class="pa-2">
            <header-card icon="mdi-card-account-details-outline" icon_color="#ff6b81" title="ผู้ปกครอง"></header-card>
            <v-card-text class="pb-2">
                <v-row dense>
                    <v-col cols="12" sm="6">
                        <labelCustom required text="ชื่อ(ภาษาอักฤษ)"></labelCustom>
                        <v-text-field dense outlined v-model="parent.firstname_en" placeholder="ชื่อภาษาอังกฤษ"></v-text-field>
                    </v-col>
                    <v-col  cols="12" sm="6">
                        <labelCustom required text="นามสกุล(ภาษาอักฤษ)"></labelCustom>
                        <v-text-field dense outlined v-model="parent.lastname_en" placeholder="นามสกุลภาษาอังกฤษ"></v-text-field>
                    </v-col>
                </v-row>
                <v-row dense>
                    <v-col  cols="12" sm="6">
                        <labelCustom required text="เบอร์โทรศัพท์"></labelCustom>
                        <v-text-field dense outlined v-model="parent.tel"  placeholder="เบอร์โทรศัพท์"></v-text-field>
                    </v-col>
                    <v-col  cols="12" sm="6">
                        <labelCustom text="Username (ถ้ามี)"></labelCustom>
                        <v-text-field dense outlined v-model="parent.username"  placeholder="Username"></v-text-field>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions class="px-6">
                <v-row dense>
                    <v-col>
                        <v-btn @click="closeDialogParent" class="w-full" color="#ff6b81" outlined >ยกเลิก</v-btn>
                    </v-col>
                    <v-col>
                        <v-btn class="w-full" color="#ff6b81" dark depressed @click="addParent">บันทึก</v-btn>
                    </v-col>
                </v-row>
            </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- DIALOG::REGISTER -->
      <v-dialog
            persistent
            v-model="show_dialog_register_one_id"
            width="60vw"
          >
            <registerDialogForm
              dialog
              title="สมัคร One ID"
            ></registerDialogForm>
          </v-dialog>
    </v-app>
  </template>
  
<script>
import ImgCard from '@/components/course/imgCard.vue'
import rowData from '@/components/label/rowData.vue'
import headerCard from '@/components/header/headerCard.vue';
import labelCustom from '@/components/label/labelCustom.vue';
import registerDialogForm from '@/components/user_menage/registerDialogForm.vue';
import { mapActions, mapGetters } from 'vuex';
  export default {
    name:"userCourseOrder",
    components: {ImgCard, rowData, headerCard, labelCustom, registerDialogForm },
    data: () => ({
        coachs:[
            {name : 'โค้ชหนุ่ม',coach_id : "00001" },
            {name : 'โค้ชพอล',coach_id : "00002" },
        ],
        parent:{
            username: "surahet",
            firstname_en: "สุรเชษฐ์",
            lastname_en: "พุฒยืน",
            tel: "089-999-9999",
        },
        is_account : false,
        dialog_parent : false,
        apply_for_yourself : false, 
        apply_for_others : false,
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
    watch: {
        "apply_for_yourself" : function(){
            if(this.apply_for_yourself){
                this.courses.students.push({
                    student_name: "สุรเชษฐ์ พุฒยืน",
                    username: "surahet",
                    firstname: "สุรเชษฐ์",
                    lastname: "พุฒยืน",
                    tel: "089-999-9999",
                    parents: [],
                    is_other : false,
                })
            }else{
                this.courses.students.forEach((student, index)=>{
                    console.log(student, index)
                    if(!student.is_other){
                        this.order.students.splice(index, 1)
                    }
                })
            }
        },
        "apply_for_others" : function(){
            if(this.apply_for_others){
                this.courses.students.push({
                    student_name: "",
                    username: "",
                    firstname: "",
                    lastname: "",
                    tel: "",
                    parents: [],
                    is_other : true,
                })
            }else{
                this.courses.students.forEach((student, index)=>{
                    if(student.is_other){
                        this.order.students.splice(index, 1)
                    }
                })
            }
        }
    },
    computed: {
        ...mapGetters({
            courses : "OrderModules/getCourses",
            order: "OrderModules/getOrder",
            show_dialog_register_one_id : "RegisterModules/getShowDialogRegisterOneId"
        })
    },
    methods: {
        ...mapActions({
            changeCourseData : "OrderModules/changeCourseData",
            changeOrederData: "OrderModules/ChangeOrederData",
            changeDialogRegisterOneId : 'RegisterModules/changeDialogRegisterOneId'
        }),
        addParent(){
            this.courses.students.filter(v => v.is_other === false)[0].parents.push({
              ...this.parent
            })
            this.parent = {
                firstname_en : "",
                lastname : "",
                username : "",
                tel : ""
            }
            this.changeCourseData(this.courses)
            this.dialog_parent = false
        },
        addStudent(){
            this.courses.students.push({
                student_name: "กมลรัตน์ สิทธิกรชัย",
                username: "",
                firstname: "",
                lastname: "",
                tel: "",
                is_other : true,
                parents: []
            })
        },
        removeStudent(student){ 
            this.courses.students.splice(this.courses.students.findIndex(v => v.username === student.username),1 )
        },
        closeDialogParent(){
           this.dialog_parent = false
        },

    },
  };
  </script>
  
<template>
    <v-app>
        <!-- <loadingOverlay :loading="course_is_loading"></loadingOverlay> -->
        <!-- <pre>{{ course_order }}</pre> -->
        <!-- <pre>{{ course_data.days_of_class[0].times[0] }}</pre> -->
        <v-container>
            <ImgCard color="#FEFBFC" outlined class="mb-3">
                <template v-slot:img>
                    <v-row dense class="d-flex align-center h-full">
                        <v-col>
                            <v-img class="rounded-lg"
                                   :src="course_data.course_img ? course_data.course_img : 'https://cdn.vuetifyjs.com/images/cards/cooking.png'" max-height="122" max-width="122"></v-img>
                        </v-col>
                    </v-row>
                </template>
                <template v-slot:header>
                    <div class="text-md font-bold">{{ `${course_data.course_name_th}(${course_data.course_name_en})`}} </div>
                    <div class="text-sm">{{ course_data.location }}</div>
                </template>
                <template v-slot:detail>
                    <v-row dense>
                        <v-col cols="12" sm="6" class="pa-0">
                            <rowData mini col_detail="5" icon="mdi-clock-outline"> {{ course_data.course_hours  }} ชม. / ครั้ง</rowData>
                        </v-col>
                        <!-- <v-col cols="12" sm="6"  class="pa-0">
                            <rowData mini col_detail="5" icon="mdi-account-group-outline">9 / 15 ที่นั่ง</rowData>
                        </v-col> -->
                    </v-row>
                </template>
            </ImgCard>
            <!-- SELECT CLASS DATE -->
            <template v-if="course_order.course_type_id == 'CT_1'">
                <!-- <pre>{{  course_data.days_of_class  }}</pre> -->
                <v-row dense>
                    <v-col class="text-lg font-bold">
                        เลือกช่วงวันเรียน
                    </v-col>
                </v-row>
                <v-radio-group
                    v-model="course_order.day"
                    @change="resetTime"
                >
                    <v-row>
                        <v-col cols="6" v-for="(date , date_index) in course_data.days_of_class" :key="date_index">
                            <v-radio
                                :label="dayOfWeekArray(date.day)"
                                color="#ff6B81"
                                :value="date"
                            ></v-radio>
                        </v-col>
                    </v-row>
                </v-radio-group>
                <template v-if="course_order.day">
                    <v-row>
                        <v-col class="text-lg font-bold">เลือกช่วงเวลาเรียน</v-col>
                    </v-row>
                    <v-radio-group
                        v-model="course_order.time"
                    >
                        <v-row>
                            <v-col cols="6" v-for="(time , time_index) in course_order.day.times" :key="time_index">
                                <v-row dense >
                                    <v-col cols="auto" class="d-flex aling-center">
                                        <v-radio
                                        :disabled = "GenReserve(time) >= time.maximumStudent"
                                        color="#ff6B81"
                                        :value="time"
                                        >
                                            <template v-slot:label>
                                                {{`${time.start}-${time.end} (${time.maximumStudent - GenReserve(time)})`}}
                                            </template>
                                        </v-radio>
                                    </v-col>
                                    <v-col v-if="GenReserve(time) >= time.maximumStudent">
                                        <v-btn @click="CreateReserve(time)" text class="underline" color="#ff6b81">จอง</v-btn>
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>
                    </v-radio-group>
                </template>
                <template v-if="course_order.time">
                    <v-row>
                        <v-col class="text-lg font-bold">เลือกโค้ช</v-col>
                    </v-row>
                    <!-- {{course_data.coachs.filter(v => course_order.day.course_coach_id.includes(v.course_coach_id))}} -->
                    <v-autocomplete
                        dense
                        v-model="course_order.coach_id"
                        color="#FF6B81"
                        :items="course_data.coachs.filter(v => course_order.day.course_coach_id.includes(v.course_coach_id))"
                        item-text="coach_name"
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
                                    :class="course_order.coach === item.course_coach_id ? 'font-bold' : ''"
                                >{{ item.coach_name }}</span
                                ></v-list-item-title>
                            </v-list-item-content>
                            <v-list-item-action>
                                <v-icon v-if="course_order.coach === item.course_coach_id"
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
                    <v-checkbox :disabled="course_order.apply_for_yourself ? false : checkMaximumStudent() || checkApplyForYourselfRole()"  v-model="course_order.apply_for_yourself" color="#ff6B81" label="สมัครเรียนให้ตัวเอง"></v-checkbox>
                </v-col>
                <v-col cols="auto" v-if="course_order.apply_for_yourself">
                    <v-btn :disabled="course_order.students.filter(v => v.is_other === false)[0].parents.length > 0" dense outlined color="#ff6b81" @click="openDialogParent"><v-icon>mdi-plus-circle-outline</v-icon>เพิ่มข้อมูลผู้ปกครอง</v-btn>
                </v-col>
            </v-row>
            <v-row dense>
                <v-col cols="12" sm="6">
                    <v-checkbox :disabled="course_order.apply_for_others ? false : checkMaximumStudent()" v-model="course_order.apply_for_others" color="#ff6B81" label="สมัครเรียนให้ผู้อื่น"></v-checkbox>
                </v-col>
            </v-row>
            <!-- PARENT -->
            <template v-if="course_order.students.filter(v => v.is_other === false).length > 0">
                <div class="mb-3" v-for="(parent, index_parent) in course_order.students.filter(v => v.is_other === false)[0].parents" :key="`${index_parent}-perent`">
                    <v-row dense class="mb-3">
                        <v-col cols="auto"><v-icon color="#ff6b81">mdi-card-account-details-outline</v-icon></v-col>
                        <v-col class="text-lg font-bold">{{ `ผู้ปกครอง` }}</v-col>
                        <v-col cols="auto">
                            <v-btn @click="removeParent(course_order.students.filter(v => v.is_other === false)[0])"  small icon color="red" dark><v-icon>mdi-close</v-icon></v-btn>
                        </v-col>
                    </v-row>
                    <v-card outlined>
                        <v-card-text>
                            <v-row dense class="d-flex align-center" v-if="!edit_parent">
                                <v-col  cols="12" sm="6">
                                    <labelCustom text="Username (ถ้ามี)"></labelCustom>
                                    <v-text-field :disabled="!edit_parent" @blur="checkUsername(parent.username)" @keyup.enter="checkUsername(parent.username)" dense outlined v-model="parent.username"  placeholder="Username" ></v-text-field>
                                </v-col>
                                <v-col  cols="12" sm="6">
                                    <v-btn dense outlined color="#ff6b81" @click="edit_parent = true"><v-icon>mdi-account-edit-outline</v-icon>แก้ไขข้อมูลผู้ปกครอง</v-btn>
                                </v-col>
                            </v-row>
                            <v-row dense v-if="edit_parent">
                                <v-col  cols="6" >
                                    <labelCustom text="Username (ถ้ามี)"></labelCustom>
                                    <v-text-field
                                        :hide-details="!parent.account_id"
                                        dense
                                        outlined
                                        v-model="parent.username"
                                        @change="checkUsername(parent.username)"
                                        @keyup.enter="checkUsername(parent.username)"
                                        @blur="checkUsername(parent.username)"
                                        placeholder="Username">
                                        <template v-slot:append>
                                            <v-icon v-if="parent.account_id" color="green">mdi-checkbox-marked-circle-outline</v-icon>
                                        </template>
                                    </v-text-field>
                                    <template  v-if="!parent.account_id">
                                        <label>
                                            หากยังไม่มีบัญชีผู้ใช้กรุณา
                                        </label>
                                        <label
                                            class="text-[#ff6b81] underline cursor-pointer mt-5"
                                            @click="registerParent"
                                        >สมัคร One ID</label>
                                    </template>
                                </v-col>
                                <v-col cols="auto" >
                                    <br>
                                    <v-btn :loading="is_loading" color="#ff6b81" @click="checkUsername(parent.username)" depressed dark>ตกลง</v-btn>
                                </v-col>
                            </v-row>
                            <v-row dense>
                                <v-col cols="12" sm="4">
                                    <labelCustom required text="ชื่อ(ภาษาอักฤษ)"></labelCustom>
                                    <v-text-field :disabled="user_data.length > 0 || !edit_parent" dense outlined v-model="parent.firstname_en" placeholder="ชื่อภาษาอังกฤษ"></v-text-field>
                                </v-col>
                                <v-col  cols="12" sm="4">
                                    <labelCustom required text="นามสกุล(ภาษาอักฤษ)"></labelCustom>
                                    <v-text-field :disabled="user_data.length > 0 || !edit_parent" dense outlined v-model="parent.lastname_en" placeholder="นามสกุลภาษาอังกฤษ"></v-text-field>
                                </v-col>
                                <v-col  cols="12" sm="4">
                                    <labelCustom required text="เบอร์โทรศัพท์"></labelCustom>
                                    <v-text-field :disabled="user_data.length > 0 || !edit_parent" dense outlined v-model="parent.tel"  placeholder="เบอร์โทรศัพท์"></v-text-field>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </div>
            </template>
            <!-- STUDENT -->
            <div v-for="(student, index_student) in course_order.students.filter(v => v.is_other === true)" :key="index_student">
                <v-row dense >
                    <v-col cols="auto"><v-icon color="#ff6b81">mdi-card-account-details-outline</v-icon></v-col>
                    <v-col class="text-lg font-bold">{{ `ผู้เรียน ${index_student+1}` }}</v-col>
                    <v-col cols="auto" v-if="course_order.students.filter(v => v.is_other === true).length > 1">
                        <v-btn @click="removeStudent(student)"  small icon color="red" dark><v-icon>mdi-close</v-icon></v-btn>
                    </v-col>
                </v-row>
                <v-card outlined class="mb-3">
                    <v-card-text>
                        <v-row dense class="d-flex align-center">
                            <v-col  cols="9" sm="5">
                                <labelCustom text="Username (ถ้ามี)"></labelCustom>
                                <v-text-field
                                    :hide-details="!student.account_id"
                                    dense
                                    outlined
                                    v-model="student.username"
                                    @change="checkUsername(student.username, 'student', index_student)"
                                    @keyup.enter="checkUsername(student.username, 'student', index_student)"
                                    @blur="checkUsername(student.username, 'student', index_student)"
                                    placeholder="Username">
                                    <template v-slot:append>
                                        <v-icon v-if="student.account_id" color="green">mdi-checkbox-marked-circle-outline</v-icon>
                                    </template>
                                </v-text-field>
                                <template  v-if="!student.account_id">
                                    <label>
                                        หากยังไม่มีบัญชีผู้ใช้กรุณา
                                    </label>
                                    <label
                                        class="text-[#ff6b81] underline cursor-pointer mt-5"
                                        @click="registerStudent"
                                    >สมัคร One ID</label>
                                </template>
                            </v-col>
                            <v-col cols="auto" class="mb-2">
                                <v-btn :loading="is_loading" color="#ff6b81" @click="checkUsername(student.username, 'student', index_student)" depressed dark>ตกลง</v-btn>
                            </v-col>
                        </v-row>
                        <template v-if="student.account_id">
                            <v-row dense>
                                <v-col cols="12" sm="6">
                                    <labelCustom required text="ชื่อ(ภาษาอักฤษ)"></labelCustom>
                                    <v-text-field :disabled="student.account_id" dense outlined v-model="student.firstname_en" placeholder="ชื่อภาษาอังกฤษ"></v-text-field>
                                </v-col>
                                <v-col  cols="12" sm="6">
                                    <labelCustom required text="นามสกุล(ภาษาอักฤษ)"></labelCustom>
                                    <v-text-field :disabled="student.account_id" dense outlined v-model="student.lastname_en" placeholder="นามสกุลภาษาอังกฤษ"></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row dense>
                                <v-col  cols="12" sm="6">
                                    <labelCustom required text="เบอร์โทรศัพท์"></labelCustom>
                                    <v-text-field :disabled="student.account_id" dense outlined v-model="student.tel"  placeholder="เบอร์โทรศัพท์"></v-text-field>
                                </v-col>
                            </v-row>
                        </template>
                    </v-card-text>
                </v-card>
                <v-row class="mb-3" dense v-if="index_student === course_order.students.filter(v => v.is_other === true).length - 1">
                    <v-col>
                        <v-btn v-if="!checkMaximumStudent()" @click="addStudent" text dense color="#ff6b81"><v-icon>mdi-plus-circle-outline</v-icon>เพิ่มผู้เรียน</v-btn>
                    </v-col>
                </v-row>
            </div>
            <!-- <pre>{{ course_order.students.filter(v => v.is_other === true) }}</pre> -->
            <div v-if="checkMaximumStudent()" class="text-[#F03D3E] mb-3">
                ผู้เรียนครบจำนวนที่คลาสจะรับได้แล้ว
            </div>
            <v-row dense>
                <v-col cols="12" sm="6">
                    <v-btn class="w-full" :disabled="disable_add_to_cart" outlined dense color="#ff6b81"  @click="addToCart">เพิ่มรถเข็น</v-btn>
                </v-col>
                <v-col cols="12" sm="6">
                    <v-btn
                        class="w-full white--text"
                        :disabled="false"
                        elevation="0"
                        dense
                        @click="checkOut"
                        :color="disable_checkout ?  '#C4C4C4': '#ff6b81'">ชำระเงิน</v-btn>
                </v-col>
            </v-row>
        </v-container>
        <!-- LOADING -->
        <loading-overlay :loading="order_is_loading"></loading-overlay>
        <!-- DIALOG :: ADD PARENT-->
        <v-dialog v-model="dialog_parent" width="50vw" class="d-flex align-center">
            <v-card class="pa-2" width="50vw">
                <header-card icon="mdi-card-account-details-outline" icon_color="#ff6b81" title="ผู้ปกครอง">
                    <template #actions>
                        <v-btn icon @click="closeDialogParent"><v-icon>mdi-close</v-icon></v-btn>
                    </template>
                </header-card>
                <v-card-text class="pb-2" >
                    <v-row dense>
                        <v-col  cols="9" >
                            <labelCustom text="Username (ถ้ามี)"></labelCustom>
                            <v-text-field
                                :hide-details="!parent.account_id"
                                dense
                                outlined
                                v-model="parent.username"
                                @change="checkUsername(parent.username)"
                                @keyup.enter="checkUsername(parent.username)"
                                @blur="checkUsername(parent.username)"
                                placeholder="Username">
                                <template v-slot:append>
                                    <v-icon v-if="parent.account_id" color="green">mdi-checkbox-marked-circle-outline</v-icon>
                                </template>
                            </v-text-field>
                            <template  v-if="!parent.account_id">
                                <label>
                                    หากยังไม่มีบัญชีผู้ใช้กรุณา
                                </label>
                                <label
                                    class="text-[#ff6b81] underline cursor-pointer mt-5"
                                    @click="registerParent"
                                >สมัคร One ID</label>
                            </template>
                        </v-col>
                        <v-col cols="auto" >
                            <br>
                            <v-btn :loading="is_loading" color="#ff6b81" @click="checkUsername(parent.username)" depressed dark>ตกลง</v-btn>
                        </v-col>
                    </v-row>
                    <template>
                        <v-row dense>
                            <v-col cols="12">
                                <labelCustom required text="ชื่อ(ภาษาอักฤษ)"></labelCustom>
                                <v-text-field :disabled="user_data.length > 0" dense outlined v-model="parent.firstname_en" placeholder="ชื่อภาษาอังกฤษ"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row dense>
                            <v-col  cols="12">
                                <labelCustom required text="นามสกุล(ภาษาอักฤษ)"></labelCustom>
                                <v-text-field :disabled="user_data.length > 0" dense outlined v-model="parent.lastname_en" placeholder="นามสกุลภาษาอังกฤษ"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row dense>
                            <v-col  cols="12">
                                <labelCustom required text="เบอร์โทรศัพท์"></labelCustom>
                                <v-text-field :disabled="user_data.length > 0" dense outlined v-model="parent.tel"  placeholder="เบอร์โทรศัพท์"></v-text-field>
                            </v-col>
                        </v-row>
                    </template>
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
        <v-dialog persistent v-model="show_dialog_cart" width="60vw">
            <v-card>
                <v-card-title>
                    <v-row>
                        <v-col align="right">
                            <v-btn @click="closeDialogCart" icon ><v-icon color ="#ff6b81">mdi-close</v-icon></v-btn>
                        </v-col>
                    </v-row>
                </v-card-title>
                <dialog-card checkmark text="เพิ่มคอร์สเรียนไปยังรถเข็นเรียบร้อยแล้ว">
                    <template #btn>
                        <v-btn depressed class="w-full" dense color="#ff6b81" dark @click="closeDialogCart">ตกลง</v-btn>
                    </template>
                </dialog-card>
            </v-card>
        </v-dialog>
        <!-- DIALOG::REGISTER -->
        <v-dialog
            persistent
            v-if="show_dialog_register_one_id"
            v-model="show_dialog_register_one_id"
            width="60vw"
        >
            <registerDialogForm
                dialog
                title="สมัคร One ID"
                :state="register_type"
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
import dialogCard from '@/components/dialog/dialogCard.vue';
import loadingOverlay from '../../../components/loading/loadingOverlay.vue';
import Swal from "sweetalert2";
import {mapActions, mapGetters} from 'vuex';
export default {
    name:"userCourseOrder",
    components: {ImgCard, rowData, headerCard, labelCustom, registerDialogForm, dialogCard, loadingOverlay},
    data: () => ({
        edit_parent: false,
        parent : {
            account_id : "",
            firstname_en : "",
            lastname_en : "",
            username : "",
            tel : ""
        },
        order_data : null,
        user_login : {},
        show_dialog_cart : false,
        dialog_parent : false,
        register_type : "parent",
        disable_add_to_cart : false,
        disable_checkout : false,
    }),
    created() {
        this.checkMaximumStudent()
        this.order_data = JSON.parse(localStorage.getItem("Order"))
        this.user_login = JSON.parse(localStorage.getItem("userDetail"))
        setTimeout(() => {
            if(this.order_data){
                if(this.order_data.course_type_id === "CT_1"){
                    this.GetCourseStudent({course_id: this.order_data.course_id,cpo_id: this.order_data.option.course_package_option_id})
                }
                this.GetRelations({student_id : this.user_login.account_id, parent_id : ""})
                this.GetCourse( this.order_data.course_id)
            }
            // this.course_order = this.order_data
        }, 200);
    },
    mounted() {
        this.checkMaximumStudent()
        this.checkApplyForYourselfRole()
        this.$store.dispatch("NavberUserModules/changeTitleNavber","สมัครเรียน")
      
    },
    watch: {
        "course_order.apply_for_yourself" : function(){
            if(this.course_order.apply_for_yourself){
                this.course_order.students.push({
                    account_id: this.user_login.account_id,
                    student_name: `${this.user_login.first_name_th} ${this.user_login.last_name_th}`,
                    username: "surahet",
                    firstname_en: this.user_login.first_name_th,
                    lastname_en: this.user_login.last_name_th,
                    tel: this.user_login.tel,
                    parents: [],
                    is_account : false,
                    is_other : false,
                })
                if(this.relations.length > 0){
                    this.course_order.students[this.course_order.students.length -1].parents.push(
                        {
                            account_id : this.relations[0].parent.parentId,
                            firstname_en : this.relations[0].parent.parentFirstnameEn,
                            lastname_en :  this.relations[0].parent.parentLastnameEn,
                            username : this.relations[0].parent.parentUsername,
                            tel : this.relations[0].parent.parentTel
                        }
                    )

                }
            }else{
                this.course_order.students.forEach((student, index)=>{
                    if(student.is_other === false){
                        this.course_order.students.splice(index,1)
                    }

                })
            }
        },
        "course_order.apply_for_others" : function(){
            if(this.course_order.apply_for_others){
                this.course_order.students.push({
                    student_name: "",
                    account_id: "",
                    username: "",
                    firstname_en: "",
                    lastname_en: "",
                    tel: "",
                    parents: [],
                    is_account : false,
                    is_other : true,
                })
            }else{
                this.course_order.students.forEach((student, index)=>{
                    if(student.is_other === true){
                        this.course_order.students.splice(index,1)
                    }
                })
            }
        },
        "last_user_registered" :function (){
            if(this.last_user_registered.type === "parent"){
                if(this.course_order.students.filter(v => v.is_other === false)[0].parents.length === 0){
                    this.course_order.students.filter(v => v.is_other === false)[0].parents.push({
                        account_id :this.last_user_registered.account_id,
                        firstname_en : this.last_user_registered.firstname_en,
                        lastname_en : this.last_user_registered.lastname_en,
                        firstname_th : this.last_user_registered.firstname_th,
                        lastname_th : this.last_user_registered.lastname_th,
                        tel : this.last_user_registered.phone_number,
                        username : this.last_user_registered.username
                    })
                }else{
                    this.course_order.students.filter(v => v.is_other === false)[0].parents.forEach((parent)=>{
                        parent.account_id = this.last_user_registered.account_id
                        parent.firstname_en = this.last_user_registered.firstname_en
                        parent.lastname_en = this.last_user_registered.lastname_en
                        parent.firstname_th = this.last_user_registered.firstname_th
                        parent.lastname_th = this.last_user_registered.lastname_th
                        parent.phone_number = this.last_user_registered.phone_number
                        parent.username = this.last_user_registered.username
                    })
                }
            }else if(this.last_user_registered.type === "student"){
                this.course_order.students[ this.course_order.students.length-1].account_id = this.last_user_registered.account_id
                this.course_order.students[ this.course_order.students.length-1].firstname_en = this.last_user_registered.firstname_en
                this.course_order.students[ this.course_order.students.length-1].lastname_en = this.last_user_registered.lastname_en
                this.course_order.students[ this.course_order.students.length-1].firstname_th = this.last_user_registered.firstname_th
                this.course_order.students[ this.course_order.students.length-1].lastname_th = this.last_user_registered.lastname_th
                this.course_order.students[ this.course_order.students.length-1].student_name  = `${this.last_user_registered.firstname_en} ${this.last_user_registered.lastname_en} `
                this.course_order.students[ this.course_order.students.length-1].tel = this.last_user_registered.phone_number
                this.course_order.students[ this.course_order.students.length-1].username = this.last_user_registered.username
                this.course_order.students[ this.course_order.students.length-1].is_other = true
                this.course_order.students[ this.course_order.students.length-1].is_account = true
                this.course_order.students[ this.course_order.students.length-1].parents= []
            }
            this.dialog_parent = false
        },
    },
    computed: {
        ...mapGetters({
            course_order : "OrderModules/getCourseOrder",
            course_data : "CourseModules/getCourseData",
            order: "OrderModules/getOrder",
            show_dialog_register_one_id : "RegisterModules/getShowDialogRegisterOneId",
            user_data : "loginModules/getUserData",
            user_student_data : "loginModules/getUserStudentData",
            is_loading : "loginModules/getIsLoading",
            order_is_loading : "OrderModules/getOrderIsLoading",
            last_user_registered:"RegisterModules/getLastUserRegistered",
            relations : "OrderModules/getRelations",
            course_student : "CourseModules/getCourseStudent",
            course_is_loading : 'CourseModules/getCourseIsLoading'
        }),
       
    },
    methods: {
        ...mapActions({
            GetCourseStudent : "CourseModules/GetCourseStudent",
            GetRelations : "OrderModules/GetRelations",
            GetCourse : "CourseModules/GetCourse",
            changeCourseOrderData : "OrderModules/changeCourseOrderData",
            resetCourseData  : "OrderModules/resetCourseData",
            changeOrderData: "OrderModules/changeOrderData",
            changeDialogRegisterOneId : 'RegisterModules/changeDialogRegisterOneId',
            saveOrder : "OrderModules/saveOrder",
            saveCart : "OrderModules/saveCart",
            checkUsernameOneid : "loginModules/checkUsernameOneid",
            CreateReserveCourse : "OrderModules/CreateReserveCourse",
        }),
        resetTime(){
            this.course_order.time = null
        },
        GenReserve(time_data){
            let studentNum = 0
            let course_student_filter  = this.course_student.filter((v)=> v.courseId == this.course_order.course_id   && v.coursePackageOptionId == this.course_order.option.course_package_option_id && v.dayOfWeekId === time_data.dayOfWeekId && v.timeId == time_data.timeId)
            // console.log("course_student_filters :",course_student_filter)
            for(const student  of course_student_filter){
                studentNum = studentNum + parseInt(student.sum_student)
            }
            return studentNum
        },
        CreateReserve(time){
            this.course_order.time_reserve = time
            Swal.fire({
                icon: "question",
                title: "ต้องการจองคอร์สนี้ใช่หรือไม่",
                showDenyButton: false,
                showCancelButton: false,
                confirmButtonText: "ตกลง",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    this.CreateReserveCourse({course_data : this.course_order})
                }
            })
        },
       
        checkApplyForYourselfRole(){
            let roles = ["R_1", "R_2", "R_3", "R_4"]
            let is_equal = false
            if(is_equal === false){
                for(const role of this.user_login.roles ){
                    is_equal = roles.includes(role)
                    if(is_equal){
                        return is_equal
                    }
                }
            }
            return is_equal
        },
        dayOfWeekArray(day) {
            const daysOfWeek = ["วันอาทิตย์", "วันจันทร์", "วันอังคาร", "วันพุธ", "วันพฤหัสบดี", "วันศุกร์", "วันเสาร์"];
            
            const validDays = day.filter(d => d >= 0 && d <= 6);
            if (validDays) {
                const firstThreeDays = validDays.map(d => daysOfWeek[d]);
                return `${firstThreeDays.join(" , ")}`;
            } else {
                return "Invalid days";
            }
        },
        checkMaximumStudent(){
            let max = false
            if(this.course_order.course_type_id === 'CT_1'){
                if(this.course_order.package_data.students){
                    max = this.course_order.package_data.students <= this.course_order.students.length
                }
            }else if(this.course_order.course_type_id === 'CT_2'){
                max = false
            }
            return max
        },
        registerStudent(){
            this.register_type = "student"
            this.changeCourseOrderData(this.course_order)
            this.changeDialogRegisterOneId(true)
        },
        registerParent(){
            this.register_type = "parent"
            this.changeCourseOrderData(this.course_order)
            this.changeDialogRegisterOneId(true)
        },
        openDialogParent(){
            this.parent = {
                account_id : "",
                firstname_en : "",
                lastname_en : "",
                username : "",
                tel : ""
            }
            this.dialog_parent = true
        },
        addParent(){
            this.course_order.students.filter(v => v.is_other === false)[0].parents.push({
                ...this.parent
            })
            this.parent = {
                account_id : "",
                firstname_en : "",
                lastname_en : "",
                username : "",
                tel : ""
            }
            this.user_data = []
            this.changeCourseOrderData(this.course_order)
            this.dialog_parent = false
        },
        addStudent(){
            this.course_order.students.push({
                account_id: "",
                student_name: "",
                username: "",
                firstname_en: "",
                lastname_en: "",
                tel: "",
                is_other : true,
                is_account : false,
                parents: []
            })
        },
        closeDialogCart(){
            this.show_dialog_cart = false
            this.$router.push({name : "UserKingdom"})
        },
        addToCart(){
            if(this.course_order.course_type_id == "CT_2"){
                let days_of_class = this.course_data.days_of_class[0]
                this.course_order.time = days_of_class.times[0]
            }
            this.course_order.coach_name = this.course_data.coachs.filter(v => this.course_order.day.course_coach_id.includes(v.course_coach_id))[0].coach_name
            this.course_order.coach = this.course_data.coachs[0].coach_id
            this.course_order.coach_id = this.course_data.coachs[0].coach_id
            this.course_order.coach_name = this.course_data.coachs[0].coach_name,
                this.order.courses.push(
                    {...this.course_order}
                )
            this.order.created_by = this.user_login.account_id
            this.changeOrderData(this.order)
            localStorage.setItem(this.user_login.account_id, JSON.stringify(this.order))
            this.saveCart({cart_data : this.order})
            this.resetCourseData()
            this.show_dialog_cart = true
        },
        removeParent(student){
            this.course_order.students.filter(v => v.username === student.username)[0].parents.splice(0 ,1 )
        },
        removeStudent(student){
            this.course_order.students.splice(this.course_order.students.findIndex(v => v.username === student.username),1 )
        },
        closeDialogParent(){
            this.dialog_parent = false
        },
        checkOut(){
            if(this.course_order.course_type_id == "CT_1"){
                this.course_order.coach_name = this.course_data.coachs.filter(v => this.course_order.day.course_coach_id.includes(v.course_coach_id))[0].coach_name
            }else{
                this.course_order.time = this.course_data.days_of_class[0].times[0] 
                this.course_order.coach_name = this.course_data.coachs[0].coach_name
            }
            this.course_order.coach = this.course_data.coachs[0].coach_id
            this.course_order.coach_id = this.course_data.coachs[0].coach_id
            if(this.order.courses.filter(v => v.course_id === this.course_order.course_id).length === 0){
                this.order.courses.push(
                    {...this.course_order}
                )
            }
            this.order.created_by = this.user_login.account_id
            this.changeOrderData(this.order)
            if(this.course_order.course_type_id == "CT_1"){
                if(this.course_order.day && this.course_order.time){
                    this.saveOrder()
                }else{
                    Swal.fire({
                        icon :"error",
                        text : `ข้อมูลไม่ถูกต้อง ${this.course_order.day} : ${this.course_order.time}`
                    })
                }
            }else{
                this.saveOrder()
            }
           
        },
        checkUsername(username, type){
            if(username){
                this.checkUsernameOneid({username : username, status : "", type : type}).then(()=>{
                    if(type === 'student'){
                        if(this.user_student_data.length > 0){
                            this.course_order.students.filter(v => v.username === username)[0].firstname_en =  this.user_student_data[0].firstNameEng
                            this.course_order.students.filter(v => v.username === username)[0].lastname_en  =  this.user_student_data[0].lastNameEng
                            this.course_order.students.filter(v => v.username === username)[0].firstname_th=  this.user_student_data[0].firstNameTh
                            this.course_order.students.filter(v => v.username === username)[0].lastname_th  =  this.user_student_data[0].lastNameTh
                            this.course_order.students.filter(v => v.username === username)[0].student_name  = `${this.user_student_data[0].firstNameEng} ${this.user_student_data[0].lastNameEng} `
                            this.course_order.students.filter(v => v.username === username)[0].tel = this.user_student_data[0].mobileNo
                            this.course_order.students.filter(v => v.username === username)[0].username =  username
                            this.course_order.students.filter(v => v.username === username)[0].account_id =  this.user_student_data[0].userOneId
                        }else{
                            this.course_order.students.filter(v => v.username === username)[0].firstname_en = ""
                            this.course_order.students.filter(v => v.username === username)[0].lastname_en  =  ""
                            this.course_order.students.filter(v => v.username === username)[0].student_name  = ""
                            this.course_order.students.filter(v => v.username === username)[0].tel = ""
                            this.course_order.students.filter(v => v.username === username)[0].username = username
                            this.course_order.students.filter(v => v.username === username)[0].account_id = ""
                        }

                    }else{
                        if(this.user_data.length > 0){
                            if(this.edit_parent){
                                this.edit_parent = false
                            }
                            this.parent ={
                                account_id : this.user_data[0].userOneId,
                                username: username,
                                firstname_en:this.user_data[0].firstNameEng,
                                lastname_en:  this.user_data[0].lastNameEng,
                                tel: this.user_data[0].mobileNo,
                            }
                            if(this.course_order.students.filter(v => v.is_other === false)[0].parents.length > 0){
                                let parents =  this.course_order.students.filter(v => v.is_other === false)[0].parents
                                parents[0].firstname_en = this.user_data[0].firstNameEng
                                parents[0].lastname_en = this.user_data[0].lastNameEng
                                parents[0].tel = this.user_data[0].mobileNo
                                parents[0].account_id = this.user_data[0].userOneId
                                parents[0].username = username
                            }
                        }
                    }
                })
            }else{
                this.user_data = []
            }
        },
    }
};

</script>
  
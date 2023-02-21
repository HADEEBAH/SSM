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
        <v-row dense>
            <v-col cols="12" class="text-lg font-bold">เลือกแพ็คเกจ</v-col> 
        </v-row>
        <v-row dense class="d-flex align-center">
            <v-col cols="12" sm class="text-sm text-[#ff6b81]">*มีสิทธิพิเศษสำหรับการสมัครรายเดือน / รายเทอม / รายปี</v-col>
            <v-col cols="12" sm="auto">
                <v-btn color="#F9B320" @click="show_dialog_privilege = true" class="white--text rounded-xl" depressed>ดูสิทธิพิเศษ</v-btn>
            </v-col>
        </v-row>
        <!-- BUTTON -->
        <v-row dense>
            <v-col cols="12" sm="auto" v-for="(package_course, package_index) in packages" :key="package_index">
                <v-btn 
                    dense
                    depressed
                    class="w-full"
                    :color="selected_package.value === package_course.value ? '#ff6b81' : '#F5F5F5'" 
                    :class="selected_package.value === package_course.value ? 'white--text' : 'text-[#B3B3B3]'" 
                    @click="selected_package = package_course">
                        {{ package_course.name }}
                    </v-btn>
            </v-col>
        </v-row>
        <v-row>
            <v-col>{{ `${selected_package.remark} ${selected_package.students}:${selected_package.maximum}` }}</v-col>
        </v-row>
        <v-slide-group
            center-active
        >
            <v-slide-item
                v-for="(option, option_index) in selected_package.options"
                :key="option_index"
                v-slot="{ active, toggle }"
            >
                <v-card :class="active ? '':''" class="ma-4  card-package-size" @click="toggle">
                    <v-card-text align="center">
                        <v-row dense>
                            <v-col  class="text-lg font-bold">{{ `${option.option_name}(${option.amount}ครั้ง)`}} </v-col>
                        </v-row>
                        <v-row dense>
                            <v-col ><div class="line-card-package"></div></v-col>
                        </v-row>  
                        <v-row dense>
                            <v-col class="text-lg font-bold">
                               <span class="text-5xl font-black">{{  option.price.toLocaleString()  }}</span>
                               บาท 
                            </v-col>
                        </v-row>  
                        <v-row dense>
                            <v-col class="text-sm">
                                ร่วมแข่งขันเวทีการประกวดชั้นนำ    
                            </v-col>
                        </v-row>  
                        <v-row dense>
                            <v-col class="text-sm">
                                อาหารว่าง Snack Box
                            </v-col>
                        </v-row>  
                        <v-row dense>
                            <v-col class="text-sm">
                                Digital Portfolio ใช้ยื่นเพื่อการศึกษาต่อ
                            </v-col>
                        </v-row>  
                        <v-row dense>
                            <v-col class="text-sm underline text-[#0076D6]">
                                ดูเพิ่มเติม
                            </v-col>
                        </v-row>  
                    </v-card-text>
                    <v-card-actions class="absolute inset-x-0 bottom-0">
                        <v-row dense>
                            <v-col cols="12">
                                <v-btn depressed class="w-full font-bold white--text" color="#ff6b81" @click="selectedPackage(option)">สมัครเรียน</v-btn>
                            </v-col>
                        </v-row>
                    </v-card-actions>
                </v-card>
            </v-slide-item>
        </v-slide-group>
         <!-- DIALOG :: PRIVILEGE -->
         <v-dialog width="70vw" v-model="show_dialog_privilege" persistent >
            <v-card>
                <v-card-title>
                    <v-row>
                        <v-col class="font-bold">สิทธิพิเศษ</v-col>
                        <v-col cols="auto" align="right">
                            <v-btn icon @click="show_dialog_privilege = false"><v-icon color="#ff6b81">mdi-close</v-icon></v-btn>
                        </v-col>
                    </v-row>
                </v-card-title>
                <v-card-text>
                    <v-img src="@/assets/course/privilege.png"></v-img>
                </v-card-text>
                <v-card-actions>
                    <v-row dense>
                        <v-col align="center"><v-btn @click="show_dialog_privilege = false" class="btn-size-lg" dark depressed color="#ff6b81">Close</v-btn></v-col>
                    </v-row>
                </v-card-actions>
            </v-card>
        </v-dialog>
      </v-container>
    </v-app>
  </template>
  
  <script>
    import ImgCard from '@/components/course/imgCard.vue';
    import rowData from '@/components/label/rowData.vue';
import { mapGetters,mapActions } from 'vuex';
  export default {
    name:"userCourseDetail",
    components: {ImgCard, rowData},
    data: () => ({
        show_dialog_privilege : false,
        selected_package:{name : "Exclusive Package", value:"Exclusive", students: 1, maximum : 1, remark : 'เรียนเดี่ยว',
            options: [
                {option_name: "รายวัน",  price:500, amount: 1,},
                {option_name: "รายเดือน",  price:2000, amount: 4,},
                {option_name: "รายเทอม",  price:8000, amount: 16,},
                {option_name: "รายปี",  price:18000, amount: 24,},
            ]
        },
        packages: [
            {name : "Exclusive Package", value:"Exclusive", students: 1, maximum : 1, remark : 'เรียนเดี่ยว', 
                options: [
                    {option_name: "รายวัน",  price:500, amount: 1,},
                    {option_name: "รายเดือน",  price:2000, amount: 4,},
                    {option_name: "รายเทอม",  price:8000, amount: 16,},
                    {option_name: "รายปี",  price:18000, amount: 24,},
                ]
            },
            {name : "Family Package", value:"Family", students: 1, maximum : 2,  remark : 'เรียนคู่',
                options: [
                    {option_name: "รายวัน",  price:500, amount: 1,},
                    {option_name: "รายเดือน",  price:2000, amount: 4,},
                    {option_name: "รายเทอม",  price:8000, amount: 16,},
                    {option_name: "รายปี",  price:18000, amount: 24,},
                ]
            },
            {name : "Group Package", value:"Gruop", students: 1, maximum : 8,  remark : 'เรียนกลุ่ม', options:[
                    {option_name: "รายเทอม",  price:2000, amount: 16,},
                    {option_name: "รายปี",  price:3000, amount: 24,},
            ]},
        ]
    }),
    created() {},
    mounted() {
        this.$store.dispatch("NavberUserModules/changeTitleNavber","แพ็คเกจ")
    },
    watch: {},
    computed: {
        ...mapGetters({
            courses : "OrderModules/getCourses",
        })
    },
    methods: {
        ...mapActions({
            changeCourseData : "OrderModules/changeCourseData",
        }),
        selectedPackage(option){
            this.courses.option = option.option_name
            this.courses.price = option.price
            this.courses.time_count = option.amount
            this.courses.package = this.selected_package.name
            this.courses.package_data = this.selected_package
            this.changeCourseData(this.courses)
            this.$router.push({ name : 'userCourseOrder', })
        }
    },
  };
  </script>
  <style scoped>
    .card-package-size{
        height: 380px;
        width: 254px;
        border-radius: 8px;
    }
    .line-card-package{
        width: 218px;
        height: 4px;
        background: linear-gradient(141.48deg, #FF6B81 14.35%, #FDCB6E 85.47%);
    }
    </style>
  
<template>
    <v-app>
        <v-container>
            <headerPage :breadcrumbs="breadcrumbs"></headerPage>
            <div class="pl-8 mb-4">
                <rowData title="หมายเลขคำสั่งซื้อ">{{ `${$route.params.order_id}` }}</rowData>
                <rowData title="ชื่อผู้เรียน">กมลรัตน์ สิทธิกรชัย, ออกัส สิงหาคม</rowData>
                <v-btn color="#FF6B81" text @click="chengeStatus">เปลี่ยนสถานะ</v-btn>
            </div>
            <v-divider class="mb-3"></v-divider>
            <v-row>
                <v-col cols="7">
                    <div v-for="(data, index) in course"  :key="index">
                        <v-card flat class="bg-grey-card">
                            <v-card-text>
                                <v-radio-group v-model="data.course_type" class="mt-0">
                                    <v-radio color="green" v-if="data.course_type === 'general_course'" value="general_course" label="คอร์สทั่วไป"></v-radio>
                                    <v-radio color="green" v-if="data.course_type === 'short_course'" value="short_course" label="คอร์สระยะสั้น"></v-radio>
                                </v-radio-group>
                                <rowData title="คอร์สเรียน">{{ data.course_name }}</rowData>
                                <rowData title="อาณาจักร">{{ data.category }}</rowData>
                                <rowData title="โค้ช">{{ data.coach }}</rowData>
                                <template v-if="data.course_type === 'general_course'">
                                    <rowData title="แพ็คเกจ">{{ data.package_name }}</rowData>
                                    <rowData title="ระยะเวลา">{{ data.period_name }}</rowData>
                                    <rowData title="วัน - เวลา">{{ data.class_data }}</rowData>
                                    <rowData title="วันที่เริ่ม">{{ data.course_open }}</rowData>
                                </template>
                                <rowData v-else title="วัน - เวลา">{{ `${data.course_open} (${data.class_data})` }}</rowData>
                                <rowData title="ราคา">{{ data.price.toLocaleString() }}</rowData>
                            </v-card-text>
                        </v-card>
                        <v-divider class="my-4" v-if="index !== course.length-1"></v-divider>
                    </div>
                </v-col>
                <v-col cols="5">
                    <v-card flat>
                        <v-card-text>
                            <rowData col_header="5" :col_detail="7" title="ราคารวม">{{ payment.total_price }}</rowData>
                            <rowData col_header="5" :col_detail="7" title="หมายเหตุ">{{ payment.remark ? payment.remark : '-' }}</rowData>
                            <rowData col_header="5" :col_detail="7" title="วันที่ชำระ">{{ payment.paid_at }}</rowData>
                            <rowData col_header="5" :col_detail="7" title="สถานะการชำระ">
                                <v-chip
                                    dark
                                    label
                                    outlined
                                    :color="payment.status === 'รอดำเนินการ' ? '#EE9B00' : '#53B536' "
                                >
                                    {{ payment.status }}
                                </v-chip>
                            </rowData>
                            <rowData  v-if="payment.status !== 'รอดำเนินการ'" col_header="5" :col_detail="7" title="วิธีการชำระเงิน">{{ payment.payment_type }}</rowData>
                            <v-row  v-else dense class="d-flex align-center">
                                <v-col cols="5" class="font-bold">วิธีการชำระเงิน</v-col>
                                <v-col cols="7" >
                                    <v-autocomplete
                                        class="w-full "
                                        dense
                                        hide-details
                                        v-model="payment.payment_type"
                                        color="#FF6B81"
                                        :items="payment_types"
                                        item-color="pink"
                                        outlined
                                        placeholder="ยังไม่ชำระเงิน"
                                    >
                                        <template v-slot:no-data>
                                        <v-list-item>
                                            <v-list-item-title>
                                            ไม่พบข้อมูล
                                            </v-list-item-title>
                                        </v-list-item>
                                        </template>
                                        <template v-slot:item="{ item }" >
                                        <v-list-item-content >
                                            <v-list-item-title ><span :class="payment.payment_type === item ? 'font-bold':''">{{ item }}</span></v-list-item-title>
                                        </v-list-item-content>
                                        <v-list-item-action>
                                            <v-icon v-if="payment.payment_type === item">mdi-check-circle</v-icon>
                                        </v-list-item-action>
                                        </template>  
                                    </v-autocomplete>
                                </v-col>
                            </v-row>
                            <rowData col_header="5" :col_detail="7" title="ผู้รับเงิน">{{ payment.payee }}</rowData>
                        </v-card-text>
                            <template v-if="payment.status === 'รอดำเนินการ'">
                                <v-btn dark color="#FF6B81" class="w-full mb-3">
                                    <v-icon color="yellow">mdi-bell-outline</v-icon>ส่งแจ้งเตือนการชำระเงิน</v-btn>
                                <v-btn dark color="#FF6B81" class="w-full  mb-3">
                                    <v-icon color="green">mdi-check-circle-outline</v-icon>ยืนยันการชำระเงิน</v-btn>
                                <v-btn dark color="#FF6B81" class="w-full  mb-3">
                                    <v-icon color="red">mdi-close-circle-outline</v-icon>ยกเลิกการซื้อคอร์ส</v-btn>
                            </template>
                            <v-btn v-else-if="payment.status === 'ชำระเงินแล้ว'" dark color="#FF6B81" class="w-full">ออกใบเสร็จรับเงิน</v-btn>
                    </v-card>
                </v-col>
            </v-row> 
        </v-container>
    </v-app>
  </template>
  
  <script>
  import headerPage from '@/components/header/headerPage.vue';
  import rowData from '@/components/label/rowData.vue';
  export default {
    name:"financeDetail",
    components: {headerPage, rowData},
    data: () => ({
        payment_types:["เงินสด","บัตรเคตดิต","โอนเข้าบัญชีโรงเรียน"],
        breadcrumbs : [
            {text:"การเงิน",to:"Finance"},
            {text:"รายระเอียดเพิ่มเติม",to:""}
        ],
        course:[
            { course_type : "general_course", course_name : "เปียโนสากล ", category:"ศิลปะดนตรีสมัยใหม่", coach: "อาทิตย์ แย้มยิ้มเบิกบาน", package_name :"Family Package", period_name : "รายเดือน (4 ครั้ง)" ,class_data : "วันเสาร์ (10.00-11.00)" ,course_open : "16 กรกฎาคม 2564", price : 2000},
            { course_type : "short_course", course_name : "ไวโลลินเวิร์กช้อป ", category:"ศิลปะดนตรีสมัยใหม่", coach: "อาทิตย์ แย้มยิ้มเบิกบาน", package_name :"Family Package", period_name : "รายเดือน (4 ครั้ง)" ,class_data : "10.00-11.00" ,course_open : "20 กรกฎาคม 2564", price : 1500},
        ],
        payment:{
            total_price : 3500,
            remark : '',
            // paid_at : '22/07/2022',
            // status : "ชำระเงินแล้ว",
            // payment_type: "เงินสด",
            // payee : "พรทรัพย์ ร่ำรวยทอง",
            paid_at : '',
            status : "รอดำเนินการ",
            payment_type: "",
            payee : ""
        }
    }),
    created() {},
    mounted() {},
    watch: {},
    computed: {

    },
    methods: {
        chengeStatus(){
            if(this.payment.status === "รอดำเนินการ"){
                this.payment = {
                    total_price : 3500,
                    remark : '',
                    paid_at : '22/07/2022',
                    status : "ชำระเงินแล้ว",
                    payment_type: "เงินสด",
                    payee : "พรทรัพย์ ร่ำรวยทอง",
                }
            }else{
                this.payment = {
                    total_price : 3500,
                    remark : '',
                    paid_at : '',
                    status : "รอดำเนินการ",
                    payment_type: "",
                    payee : ""
                }
            }
        }
    },
  };
  </script>
  
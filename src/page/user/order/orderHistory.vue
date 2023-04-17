<template>
    <v-app>
      <v-container>
        <div v-for="(order, index) in history" :key="index">
            <v-card class="mb-3">
                <v-row>
                    <v-col cols="3" class="pr-0">
                        <v-img
                            v-if="order.courseImg" 
                            :src="order.courseImg"
                            cover
                            class="w-full h-full rounded-l-lg"
                        />
                        <img v-else src="@/assets/course/payment.png" height="270">
                    </v-col>
                    <v-col cols="9">
                        <v-card-text class="pa-2">  
                            <v-row dense>
                                <v-col>
                                    <v-row dense>
                                        <v-col cols="12" sm="6" class="align-self-center text-lg font-bold">{{ order.courseNameTh }}</v-col>
                                        <v-col cols="12" sm="6" class="align-self-center" align="right">
                                            <v-chip v-if="order.paymentStatus === 'success'"
                                        
                                                color="#F0F9EE"
                                                text-color="#58A144"
                                            >
                                                ชำระเงินแล้ว
                                            </v-chip>

                                            <v-chip v-else-if="order.paymentStatus === 'pending'"
                                                
                                                color="#FFF9E8"
                                                text-color="#FCC419"
                                            >
                                                รอชำระเงิน
                                            </v-chip>

                                            <v-chip v-else-if="order.paymentStatus === 'cancel'"
                                                
                                                color="#FDECEC"
                                                text-color="#F03D3E"
                                            >
                                                ยกเลิกแล้ว
                                            </v-chip>
                                            <v-chip v-else
                                         
                                                color="#FDECEC"
                                                text-color="#F03D3E"
                                            >
                                                เกิดข้อผิดพลาด
                                            </v-chip>
                                        </v-col>
                                    </v-row>
                                    <v-row dense>
                                        <v-col class="text-md  py-2"  cols="12" sm="6">
                                            <v-row dense>
                                                <v-col cols="auto" >โค้ช :</v-col>
                                                <v-col>{{ order.coachName ? order.coachName : "-" }}</v-col>
                                            </v-row>    
                                        </v-col>
                                        <v-col class="text-md  py-2"  cols="12" sm="6">
                                            <v-row dense>
                                                <v-col cols="auto">เวลา :</v-col>
                                                <v-col>{{  `${order.coursePeriodStartDate && order.coursePeriodStartDate !== "" ? order.coursePeriodStartDate : order.timeStart ? order.timeStart : "-"} - ${order.coursePeriodEndDate && order.coursePeriodEndDate !== "" ? order.coursePeriodEndDate : order.timeEnd ? order.timeEnd : "-"} น.`  }}</v-col>
                                            </v-row>    
                                        </v-col>
                                    </v-row>
                                </v-col>
                            </v-row>
                            <v-row dense>
                                <v-col class="font-bold" align="right">
                                    หมายเลขคำสั่งซื้อ:
                                </v-col>
                                <v-col cols="5" align="right">
                                {{ order.orderNumber }} 
                                </v-col>
                            </v-row>
                            <v-row dense>
                                <v-col class="font-bold" align="right">
                                    เวลาที่ทำรายการ:
                                </v-col>
                                <v-col  cols="5"  align="right">
                                {{ genDate(order.createdDate) }} 
                                </v-col>
                            </v-row>
                            <v-row dense>
                                <v-col class="font-bold" align="right">
                                    ทำรายการโดย:
                                </v-col>
                                <v-col cols="5" align="right">
                                {{`${order.createdByData.firstNameTh}  ${order.createdByData.lastNameTh}` }} 
                                </v-col>
                            </v-row>
                            <v-row dense>
                                <v-col class="font-bold"  align="right">
                                    ราคาชำระ:
                                </v-col>
                                <v-col  cols="5" align="right">
                                {{ order.totalPrice.toLocaleString() }} บาท 
                                </v-col>
                            </v-row>
                        </v-card-text>
                        <v-card-text class="py-2">
                            <v-row dense :class="order.show_student ? 'mb-3' : ''" class="d-flex align-center ">
                                <v-col>
                                    <v-btn @click="order.show_student = !order.show_student" text class="font-bold">แสดงรายการนักเรียน<v-icon color="#ff6b81" >{{order.show_student ? 'mdi-chevron-up' : 'mdi-chevron-down'}}</v-icon></v-btn>
                                </v-col>
                                <v-col cols="auto" v-if="order.paymentStatus === 'pending'">
                                    <v-btn @click="payment(order)" outlined color="#ff6b81"><v-icon>mdi-cash</v-icon>ดำเนินการชำระเงิน</v-btn>
                                </v-col>
                            </v-row>
                            <v-expand-transition >
                                <div v-if="order.show_student" class="border rounded-md pa-2">
                                    <v-row dense >
                                        <v-col class="font-bold" align="center">
                                            ชื่อ-สกุล
                                        </v-col>
                                        <v-col class="font-bold" align="center">
                                            เบอร์โทร
                                        </v-col>
                                        <v-col class="font-bold" align="center">
                                            email
                                        </v-col>
                                    </v-row>
                                    <v-divider class="my-2"></v-divider>
                                    <v-row  v-for="(student, index) in order.students" :key="`${index}-student`">
                                        <v-col  align="center">
                                            {{ `${student.firstNameTh} ${student.lastNameTh}`  }}
                                        </v-col>
                                        <v-col  align="center">
                                            {{ `${student.mobileNo}`  }}
                                        </v-col>
                                        <v-col  align="center">
                                            {{ `${student.email}`  }}
                                        </v-col>
                                    </v-row>
                                </div>
                            </v-expand-transition>
                        </v-card-text>
                    </v-col>
                </v-row>
            </v-card>
           
        </div>
      </v-container>
    </v-app>
  </template>
  
  <script>
  import axios from "axios"
  import VueCookie from "vue-cookie"
  import {dateFormatter} from "../../../functions/functions"
  import {mapActions, mapGetters} from 'vuex';
  import Swal from "sweetalert2";
  export default {
    name:"orderHistory",
    components: {},
    data: () => ({
        panel: false,
        history: []
    }),
    created() {
        this.$store.dispatch("NavberUserModules/changeTitleNavber","ประวัติการซื้อ")
        this.getHistory()
    },
    mounted() {},
    watch: {},
    computed: {
        ...mapGetters()
    },
    methods: {
        ...mapActions({
            savePayment : "OrderModules/savePayment"
        }),
        genDate(date){
            return dateFormatter(new Date(date),"DD MT YYYYT")
        },
        payment(payment_data){
            Swal.fire({
                icon: "question",
                title: "ดำเนินการชำระเงินใช่หรือไม่?",
                showDenyButton: false,
                showCancelButton: true,
                cancelButtonText: "ยกเลิก",
                confirmButtonText: "ตกลง",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    this.savePayment({paymnet_data : payment_data })
                }
            })
        },
        async getHistory () {
            let mapHistory = []
            const config = {
            headers:{
                "Access-Control-Allow-Origin" : "*",
                "Content-type": "Application/json",
                'Authorization' : `Bearer ${VueCookie.get("token")}`
            }
            }
            //  let localhost = "http://localhost:3002"
            const {data} = await axios.get(`${process.env.VUE_APP_URL}/api/v1/order/history`,config)
            console.log("data", data)
            // const mapHistory = await data.data.map(async(val)=>{
            //   if (val.courseImg && val.courseImg !== "") {
            //     val.courseImg = process.env.VUE_APP_URL.concat(`/api/v1/files/${val.courseImg}`)
            //   }
            //   return await val
            // })

            for (const item of data.data) {
            if (item.courseImg && item.courseImg !== "") {
                item.courseImg = process.env.VUE_APP_URL.concat(`/api/v1/files/${item.courseImg}`)
                item.show_student = false
            }
            mapHistory.push(item)
            }
            console.log("mapHistory", mapHistory)
            this.history = mapHistory
        }
    },
  };
  </script>
  
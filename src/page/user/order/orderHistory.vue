<template>
    <v-app>
      <v-container>
        <!-- <div v-for="(order, index) in orders" :key="index"> -->
            <!-- <v-card class="mb-3"> -->
                <!-- <v-card-text> -->
                    <!-- <v-row dense> -->
                        <!-- <v-col cols="4"> -->
                            <!-- <img src="@/assets/course/payment.png" width="" height=""> -->
                        <!-- </v-col> -->
                        <!-- <v-col cols="8"> -->
                            <!-- <v-row dense> -->
                                <!-- <v-col class="text-lg font-bold">{{ order.course_name    }}</v-col> -->
                            <!-- </v-row> -->
                            <!-- <v-row dense> -->
                                <!-- <v-col class="text-md"  cols="12" sm="6"> -->
                                    <!-- <v-row> -->
                                        <!-- <v-col cols="auto" >โค้ช :</v-col> -->
                                        <!-- <v-col>{{  order.coach  }}</v-col> -->
                                    <!-- </v-row>     -->
                                <!-- </v-col> -->
                                <!-- <v-col class="text-md"  cols="12" sm="6"> -->
                                    <!-- <v-row> -->
                                        <!-- <v-col cols="auto">เวลา :</v-col> -->
                                        <!-- <v-col>{{  `${order.times.start}-${order.times.end}`  }}</v-col> -->
                                    <!-- </v-row>     -->
                                <!-- </v-col> -->
                            <!-- </v-row> -->
                            <!-- <v-row danse> -->
                                <!-- <v-col>{{  order.course_detail  }}</v-col> -->
                            <!-- </v-row> -->
                        <!-- </v-col> -->
                    <!-- </v-row> -->
                    <!-- <v-row dense> -->
                        <!-- <v-col cols="4" class="font-bold"> -->
                            <!-- หมายเลขคำสั่งซื้อ: -->
                        <!-- </v-col> -->
                        <!-- <v-col  align="right"> -->
                           <!-- {{ order.order_number }}  -->
                        <!-- </v-col> -->
                    <!-- </v-row> -->
                    <!-- <v-row dense> -->
                        <!-- <v-col cols="4" class="font-bold"> -->
                            <!-- เวลาที่ทำรายการ: -->
                        <!-- </v-col> -->
                        <!-- <v-col  align="right"> -->
                           <!-- {{ order.created_date }}  -->
                        <!-- </v-col> -->
                    <!-- </v-row> -->
                    <!-- <v-row dense> -->
                        <!-- <v-col cols="4" class="font-bold"> -->
                            <!-- ราคาชำระ: -->
                        <!-- </v-col> -->
                        <!-- <v-col align="right"> -->
                           <!-- {{ order.price }}  -->
                        <!-- </v-col> -->
                    <!-- </v-row> -->
                <!-- </v-card-text> -->
            <!-- </v-card> -->
        <!-- </div> -->
        <div v-for="(order, index) in history" :key="index">
            <v-card class="mb-3">
                <v-card-text>
                    <v-row dense>
                        <v-col cols="4">
                            <img v-if="order.courseImg" :src="order.courseImg" width="" height="">
                            <img v-else src="@/assets/course/payment.png" width="" height="">
                        </v-col>
                        <v-col cols="8">
                            <v-row dense>
                                <v-col cols="12" sm="6" class="align-self-center text-lg font-bold">{{ order.courseNameTh }}</v-col>
                                <v-col cols="12" sm="6" class="align-self-center" >
                                  <v-chip v-if="order.paymentStatus === 'success'"
                                    class="ma-2"
                                    color="#F0F9EE"
                                    text-color="#58A144"
                                  >
                                    ชำระเงินแล้ว
                                  </v-chip>

                                  <v-chip v-else-if="order.paymentStatus === 'pending'"
                                    class="ma-2"
                                    color="#FFF9E8"
                                    text-color="#FCC419"
                                  >
                                    รอชำระเงิน
                                  </v-chip>

                                  <v-chip v-else
                                    class="ma-2"
                                    color="#FDECEC"
                                    text-color="#F03D3E"
                                  >
                                    ยกเลิกแล้ว
                                  </v-chip>

                                </v-col>
                            </v-row>
                            <v-row dense>
                                <v-col class="text-md"  cols="12" sm="6">
                                    <v-row>
                                        <v-col cols="auto" >โค้ช :</v-col>
                                        <v-col>{{ order.coachName ? order.coachName : "-" }}</v-col>
                                    </v-row>    
                                </v-col>
                                <v-col class="text-md"  cols="12" sm="6">
                                    <v-row>
                                        <v-col cols="auto">เวลา :</v-col>
                                        <v-col>{{  `${order.coursePeriodStartDate && order.coursePeriodStartDate !== "" ? order.coursePeriodStartDate : "-"}-${order.coursePeriodEndDate && order.coursePeriodEndDate !== "" ? order.coursePeriodEndDate : "-"}`  }}</v-col>
                                    </v-row>    
                                </v-col>
                            </v-row>
                            <v-row danse>
                                <v-col>{{  order.courseDescription !== "" ? order.courseDescription : "-"  }}</v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                    <v-row dense>
                        <v-col cols="4" class="font-bold">
                            หมายเลขคำสั่งซื้อ:
                        </v-col>
                        <v-col  align="right">
                           {{ order.orderNumber }} 
                        </v-col>
                    </v-row>
                    <v-row dense>
                        <v-col cols="4" class="font-bold">
                            เวลาที่ทำรายการ:
                        </v-col>
                        <v-col  align="right">
                           {{ order.createdDate }} 
                        </v-col>
                    </v-row>
                    <v-row dense>
                        <v-col cols="4" class="font-bold">
                            ราคาชำระ:
                        </v-col>
                        <v-col align="right">
                           {{ order.totalPrice }} 
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </div>
      </v-container>
    </v-app>
  </template>
  
  <script>
  import axios from "axios"
  import VueCookie from "vue-cookie"
  export default {
    name:"orderHistory",
    components: {},
    data: () => ({
        orders : [
        {
            course_name : "กีตาร์ออนไลน์",
            status : "ชำระเงินแล้ว",
            coach : "อัครพงศ์ เวชสุวรรณ",
            times : {
                start : "15:00",
                end : "16:00",
            },
            order_number : "OR-20230329-009",
            created_date : "29/03/2023 12:00",
            price : 500,
            course_detail: "ศูนย์รวมครูสอนกีต้าร์แห่งประเทศไทยสอนโดยคุณครูฝีมือดี หลักสูตรทันสมัย หลักสูตรที่ออกแบบเพื่อนักเรียนทุกเพศ",
        },
        {
            course_name : "กีตาร์ออนไลน์",
            status : "ชำระเงินแล้ว",
            coach : "อัครพงศ์ เวชสุวรรณ",
            times : {
                start : "15:00",
                end : "16:00",
            },
            order_number : "OR-20230329-010",
            created_date : "29/03/2023 12:00",
            price : 500,
            course_detail: "ศูนย์รวมครูสอนกีต้าร์แห่งประเทศไทยสอนโดยคุณครูฝีมือดี หลักสูตรทันสมัย หลักสูตรที่ออกแบบเพื่อนักเรียนทุกเพศ",
        },
        {
            course_name : "กีตาร์ออนไลน์",
            status : "ชำระเงินแล้ว",
            coach : "อัครพงศ์ เวชสุวรรณ",
            times : {
                start : "15:00",
                end : "16:00",
            },
            order_number : "OR-20230329-010",
            created_date : "29/03/2023 12:00",
            price : 500,
            course_detail: "ศูนย์รวมครูสอนกีต้าร์แห่งประเทศไทยสอนโดยคุณครูฝีมือดี หลักสูตรทันสมัย หลักสูตรที่ออกแบบเพื่อนักเรียนทุกเพศ",
        }
    ],
    history: []
    }),
    created() {
        this.$store.dispatch("NavberUserModules/changeTitleNavber","ประวัติการซื้อ")
        this.getHistory()
    },
    mounted() {},
    watch: {},
    computed: {},
    methods: {
      async getHistory () {
        let mapHistory = []
        const config = {
          headers:{
              "Access-Control-Allow-Origin" : "*",
              "Content-type": "Application/json",
              'Authorization' : `Bearer ${VueCookie.get("token")}`
          }
        }
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
          }
          mapHistory.push(item)
        }
        console.log("mapHistory", mapHistory)
        this.history = mapHistory
      }
    },
  };
  </script>
  
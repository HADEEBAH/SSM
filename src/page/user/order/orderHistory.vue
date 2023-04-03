<template>
    <v-app>
      <v-container>
        <div v-for="(order, index) in orders" :key="index">
            <v-card class="mb-3">
                <v-card-text>
                    <v-row dense>
                        <v-col cols="4">
                            <img src="@/assets/course/payment.png" width="" height="">
                        </v-col>
                        <v-col cols="8">
                            <v-row dense>
                                <v-col class="text-lg font-bold">{{ order.course_name    }}</v-col>
                            </v-row>
                            <v-row dense>
                                <v-col class="text-md"  cols="12" sm="6">
                                    <v-row>
                                        <v-col cols="auto" >โค้ช :</v-col>
                                        <v-col>{{  order.coach  }}</v-col>
                                    </v-row>    
                                </v-col>
                                <v-col class="text-md"  cols="12" sm="6">
                                    <v-row>
                                        <v-col cols="auto">เวลา :</v-col>
                                        <v-col>{{  `${order.times.start}-${order.times.end}`  }}</v-col>
                                    </v-row>    
                                </v-col>
                            </v-row>
                            <v-row danse>
                                <v-col>{{  order.course_detail  }}</v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                    <v-row dense>
                        <v-col cols="4" class="font-bold">
                            หมายเลขคำสั่งซื้อ:
                        </v-col>
                        <v-col  align="right">
                           {{ order.order_number }} 
                        </v-col>
                    </v-row>
                    <v-row dense>
                        <v-col cols="4" class="font-bold">
                            เวลาที่ทำรายการ:
                        </v-col>
                        <v-col  align="right">
                           {{ order.created_date }} 
                        </v-col>
                    </v-row>
                    <v-row dense>
                        <v-col cols="4" class="font-bold">
                            ราคาชำระ:
                        </v-col>
                        <v-col align="right">
                           {{ order.price }} 
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </div>
      </v-container>
    </v-app>
  </template>
  
  <script>
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
    ]
    }),
    created() {
        this.$store.dispatch("NavberUserModules/changeTitleNavber","ประวัติการซื้อ")
    },
    mounted() {},
    watch: {},
    computed: {},
    methods: {},
  };
  </script>
  
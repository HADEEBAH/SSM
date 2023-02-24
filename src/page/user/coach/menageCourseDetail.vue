<template>
  <v-app>
    <v-container>
        <imgCard color="#FEFBFC" outlined class="mb-3">
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
        </imgCard>
        <v-row dense>
            <v-col class="text-md font-bold">
                ลงเวลาเข้าสอน 
            </v-col>
        </v-row>
        <v-row dense class="mb-3">
            <v-col align="center">
               <v-btn depressed dense color="#ff6b81" class="w-full white--text rounded-lg">
                    กดเพื่อลงเวลาเข้าสอน
               </v-btn>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="auto">เช็คชื่อ</v-col>
            <v-col cols="auto">ประเมินนักเรียน</v-col>
            <v-col cols="auto">บันทึกสรุปการสอน</v-col>
        </v-row>
    </v-container>
  </v-app>
</template>
<script>
import imgCard from '@/components/course/imgCard.vue';
import rowData from '@/components/label/rowData.vue';
export default {
  name:"menageCourseDetail",
  components: {imgCard, rowData},
  data: () => ({}),
  created() {},
  mounted() {},
  watch: {},
  computed: {},
  methods: {},
};
</script>

<template>
  <v-container>
    <v-card class="my-5">
      <div>
        <v-row dense>
          <v-col cols="4" sm="6">
            <v-col>
              <!-- {{ item}} -->
              <!-- {{ item.orderStudentId }} -->
            </v-col>
          </v-col>
          <v-col cols="4">
            <v-col sm="6" class="text-lg font-bold">
              <!-- {{ item.courseNameTh }} -->
            </v-col>
            <v-col sm="6" class="text-slate-400">
              <!-- {{ item.courseNameEn }} -->
            </v-col>
            <v-col sm="6" class="text-slate-400">
              <!-- <span class="mdi mdi-account"></span> {{ item.courseNameTh }} -->
            </v-col>
            <v-col>
              <v-card color="yellow" class="rounded-xl text-center">
                วันจันทร์ 16:00 - 17:00 น.
              </v-card>
              <!-- {{ item.courseNameEn }} -->
            </v-col>
          </v-col>

          <v-col cols="4" sm="6">
            <v-col>
              <!-- {{ item.courseNameEn }} -->
            </v-col>
          </v-col>
        </v-row>
      </div>
    </v-card>

    <label-custom text="ข้อมูลการเรียน"></label-custom>

    <v-card class="pa-2">
        <!-- v-if="finishStudy == true" -->
        <v-row>
            <v-col cols="2" sm="1">
                <img src="../../../assets/student_course/certificates.png"/>
            </v-col>
            <v-col class="text-lg font-bold" cols="8"  >ผลประเมินศักยาภาพ</v-col>
            <v-col cols="2"> 
                <v-card class="rounded-xl text-center " style="color:#58A144; background-color: #F0F9EE;">
                    ตรงเวลา
              </v-card>
            </v-col>
        </v-row>
        <v-card color="#FBF3F5" class="my-2 mx-5">
          <v-card-title>
            พัฒนาการ: <span class="text-rose-400">ดี</span> <span class="ml-2">ความสนใจ: </span> <span class="text-rose-400">ความสนใจดี</span>
          </v-card-title>
          <v-card-text>
            ความคิดเห็นจากโค้ช:<span class="text-black ml-1">มีความพยายามอ่านโน๊ตและมีการทำการบ้านมาเป็นอย่างดีมี
ทักษะเฉพาะตัวคิดไวทำไวมีวินัยใส่ใจในการเรียนปฦิบัติตามคำสอนของโค้ชอย่างเคร่ง
ครัดมาเรียนตรงเวลา มีมารยาทในการพูดจา</span>
          </v-card-text>
          <v-row>
            <v-col sm="4">
              <img src="../../../assets/profile/thaiFlag.png"  class="my-5 mx-5"/>
            </v-col>
            <v-col  sm="4">
              <img src="../../../assets/profile/thaiFlag.png"  class="my-5 mx-5"/>
            </v-col>
          </v-row>
</v-card>
    </v-card>

    <template>
      <v-card class="my-5 drop-shadow-lg rounded-xl" v-for="(data, index) in items" :key="index">
        <v-card-text>
          <v-row class="" dense>
            <v-col cols="12" v-if="checked == true">
                <v-checkbox
                v-model="checked[index]"
              color="#FF6B81"
              hide-details
            ></v-checkbox>
            </v-col>
            <v-col cols="2" sm="1">
              <v-icon color="#FF6B81">mdi-calendar-plus-outline</v-icon>
            </v-col>
            <v-col cols="8" >
              <v-icon color="#FF6B81">{{ data.title }}</v-icon>
            </v-col>
            <v-col cols="2">
              <v-card class="rounded-xl text-center " style="color:#58A144; background-color: #F0F9EE;">
                    ตรงเวลา
              </v-card>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col class="text-caption">
              1,000 miles of wonder 1,000 miles of wonder 1,000 miles of wonder
              1,000 miles of wonder</v-col
            >
          </v-row>
          <v-row dense>
            <v-col class="text-caption">
                พัฒนาการ: <span class="text-rose-400">ดี</span>  ความสนใจ:  <span class="text-rose-400">ความสนใจดี</span> </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" align="center">
              <v-btn color="#FF6B81" text @click="show = !show">
                ดูเพิ่มเติม
                <v-icon>{{
                  show ? "mdi-chevron-up" : "mdi-chevron-down"
                }}</v-icon>
              </v-btn>

              <v-expand-transition>
                <div v-show="show">
                  <v-divider></v-divider>

                  <v-card-text>
                    I'm a thing. But, like most politicians,
                  </v-card-text>
                </div>
              </v-expand-transition></v-col
            >
          </v-row>
        </v-card-text>

        <v-card-text class="center pa-2"> </v-card-text>
      </v-card> </template
  >
     <!-- DIALOG -->
     <v-dialog class="pa-2" width="50vw" v-model="dialog_show" persistent>
      <v-card>
        <v-card-title>
          <v-row>
            <v-col cols="12" align="right">
              <v-btn icon @click="dialog_show = false">
                <v-icon color="#ff6b81">mdi-close</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-title>
        <img src="../../../assets/student_course/download.png" class="mx-40 my-10"/>
        <v-card-text class="text-center font-bold text-xl"> ดาวน์โหลดแบบประเมินเรียบร้อย</v-card-text>
        <v-btn color="#FF6B81" class="white--text w-60 mx-64 my-10" @click="dialog_show = false">
            ตกลง
        </v-btn>
      </v-card>
    </v-dialog>

<v-row v-if="checked == true">
    <v-col cols="12" class="text-center" >
        <v-btn  class="pink--text w-full" @click="closedownload()">
            ยกเลิก
        </v-btn>
    </v-col>
    <v-col cols="12" class="text-center" >
        <v-btn color="#FF6B81" class="white--text w-full" @click="download()">
            ดาวน์โหลด
        </v-btn>
    </v-col>
</v-row>

<v-row v-else>
    <v-col cols="12" class="text-center" >
        <v-btn color="#FF6B81" class="white--text w-full" @click="download()">
            ดาวน์โหลดผลการประเมิน
        </v-btn>
    </v-col>
</v-row>

</v-container>

 
</template>

          <!-- <v-card v-for="(data, index) in items" :key="index" class="pa-2 my-5">
            <v-icon color="#FF6B81">mdi-calendar-plus-outline</v-icon>
              <span class="text-lg">{{ data.title }}</span>
          </v-card> -->

  
<script>
import { mapActions, mapGetters } from "vuex";
import labelCustom from "../../../components/label/labelCustom.vue";
export default {
  components: {
    labelCustom,
  },
  data: () => ({
    show: false,
    checked: false,
    dialog_show: false,
    check: [],
    items: [
      {
        id: 1,
        title: "Card 1",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        imageUrl: "https://picsum.photos/id/1/200/200",
      },
      {
        id: 2,
        title: "Card 2",
        description:
          "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        imageUrl: "https://picsum.photos/id/2/200/200",
      },
      {
        id: 3,
        title: "Card 3",
        description:
          "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        imageUrl: "https://picsum.photos/id/3/200/200",
      },
    ],
  }),
  mounted() {
    this.$store.dispatch(
      "NavberUserModules/changeTitleNavber",
      "ข้อมูลคอร์สเรียน"
    );
  },
  methods: {
    ...mapActions({}),
      download() {
        console.log("open");
       this.checked = true 
    },
    closedownload() {
      this.checked = false 
    },
  },
  computed: {
    ...mapGetters({}),
  },


};
</script>
  
  <style scoped>

</style>
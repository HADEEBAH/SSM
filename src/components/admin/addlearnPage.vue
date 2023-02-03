<template>
  <v-app>
    <v-container>
      <headerPage title="เพิ่มผู้เรียน"></headerPage>
      <v-row>
        <v-col>
          <label-custom class="mb-1" text="ผู้เรียน"></label-custom>
          <label
            class="sub-register primary--text cursor-pointer underline"
            @click="changeDialogRegisterOneId(true)"
            >สมัคร One ID</label
          >
          <v-row>
            <v-col cols="12" sm="8">
              <v-autocomplete
                prepend-inner-icon="mdi-magnify"
                dense
                v-model="selected"
                :items="student"
                placeholder="ค้นหา/เลือกผู้เรียน"
                label="ค้นหา/เลือกผู้เรียน"
                single-line
                outlined
                chips
                multiple
                deletable-chips
                clearable
              >
              </v-autocomplete>
            </v-col>
          </v-row>
          <v-card class="mt-6">
            <v-card-text>
              <v-radio-group v-model="add_data.type">
                <v-row dense>
                  <v-col cols="12" sm="2">
                    <v-radio color="green" value="general_course">
                      <template v-slot:label>
                        <v-row dense>
                          <v-col cols="8" sm="12">
                            <label>คอร์สทั่วไป</label>
                          </v-col>
                        </v-row>
                      </template>
                    </v-radio>
                  </v-col>
                  <v-col cols="12" sm="2">
                    <v-radio color="green" value="short_course">
                      <template v-slot:label>
                        <v-row dense>
                          <v-col cols="8" sm="12">
                            <label>คอร์สระยะสั้น</label>
                          </v-col>
                        </v-row>
                      </template>
                    </v-radio>
                  </v-col>
                </v-row>
              </v-radio-group>
              <v-row>
                <v-col cols="12" sm="4">
                  <label-custom text="อาณาจักร"></label-custom>
                  <v-autocomplete
                    dense
                    v-model="add_data.kingdom"
                    :items="kingdom"
                    placeholder="เลือกอาณาจักร"
                    outlined
                  >
                  </v-autocomplete>
                </v-col>
                <v-col cols="12" sm="4">
                  <label-custom text="คอร์สเรียน"></label-custom>
                  <v-autocomplete
                    dense
                    v-model="add_data.course"
                    :items="course"
                    placeholder="เลือกอาณาจักร"
                    outlined
                  >
                  </v-autocomplete>
                </v-col>
              </v-row>
              <v-row class="">
                <v-col cols="12" sm="4">
                  <label-custom text="แพ็คเกจ"></label-custom>
                  <v-autocomplete
                    dense
                    v-model="add_data.coursepackage"
                    :items="coursepackage"
                    placeholder="เลือกแพ็คเกจ"
                    outlined
                  >
                  </v-autocomplete>
                </v-col>
                <v-col cols="12" sm="4">
                  <label-custom text="ระยะเวลา"></label-custom>
                  <v-autocomplete
                    dense
                    v-model="add_data.period"
                    :items="period"
                    placeholder="เลือกระยะเวลา"
                    outlined
                  >
                  </v-autocomplete>
                </v-col>
                <v-col cols="12" sm="2">
                  <label-custom text="จำนวนครั้ง"></label-custom>
                  <template v-slot:prepend-item>
                    <v-text-field
                      dense
                      v-model="filter_search"
                      outlined
                    ></v-text-field>
                  </template>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="2">
                  <label-custom text="วัน"></label-custom>
                  <v-autocomplete
                    dense
                    v-model="add_data.day"
                    :items="day"
                    placeholder="เลือกวัน"
                    outlined
                  >
                  </v-autocomplete>
                </v-col>
                <v-col cols="12" sm="2">
                  <label-custom text="เวลา"></label-custom>
                  <v-autocomplete
                    dense
                    v-model="add_data.time"
                    :items="time"
                    placeholder="เลือกเวลา"
                    outlined
                  >
                  </v-autocomplete>
                </v-col>
                <v-col cols="12" sm="4">
                  <label-custom text="โค้ช"></label-custom>
                  <v-autocomplete
                    dense
                    v-model="add_data.coach"
                    :items="coach"
                    placeholder="เลือกโค้ช"
                    outlined
                  >
                  </v-autocomplete>
                </v-col>
                <v-col cols="12" sm="4">
                  <label-custom text="วันเริ่ม"></label-custom>
                  <v-menu
                    ref="menu"
                    v-model="menu"
                    :close-on-content-click="false"
                    :return-value.sync="date"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="date"
                        placeholder="เลือกวันเริ่ม"
                        append-icon="mdi-calendar"
                        outlined
                        dense
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="date" no-title scrollable>
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="menu = false">
                        Cancel
                      </v-btn>
                      <v-btn
                        text
                        color="primary"
                        @click="$refs.menu.save(date)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="4">
                  <label-custom text="ราคา"></label-custom>
                  <v-text-field
                    dense
                    v-model="add_data.student"
                    :items="student"
                    outlined
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="8">
                  <label-custom text="หมายเหตุราคา"></label-custom>
                  <v-textarea
                    class="form-learn"
                    auto-grow
                    outlined
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
          <v-card class="mt-20">
            <v-card-text>
              <v-radio-group v-model="add_data.type">
                <v-row dense>
                  <v-col cols="12" sm="2">
                    <v-radio color="green" value="general_course">
                      <template v-slot:label>
                        <v-row dense>
                          <v-col cols="8" sm="12">
                            <label>คอร์สทั่วไป</label>
                          </v-col>
                        </v-row>
                      </template>
                    </v-radio>
                  </v-col>
                  <v-col cols="12" sm="2">
                    <v-radio color="green" value="short_course">
                      <template v-slot:label>
                        <v-row dense>
                          <v-col cols="8" sm="12">
                            <label>คอร์สระยะสั้น</label>
                          </v-col>
                        </v-row>
                      </template>
                    </v-radio>
                  </v-col>
                </v-row>
              </v-radio-group>
              <v-row>
                <v-col cols="12" sm="4">
                  <label-custom text="อาณาจักร"></label-custom>
                  <v-autocomplete
                    dense
                    v-model="add_data.kingdom"
                    :items="kingdom"
                    placeholder="เลือกอาณาจักร"
                    outlined
                  >
                  </v-autocomplete>
                </v-col>
                <v-col cols="12" sm="4">
                  <label-custom text="คอร์สเรียน"></label-custom>
                  <v-autocomplete
                    dense
                    v-model="add_data.course"
                    :items="course"
                    placeholder="เลือกอาณาจักร"
                    outlined
                  >
                  </v-autocomplete>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <div class="btn text-left">
        <v-btn class="btn3 mt-10" @click="addCourse">เพิ่มคอร์ส</v-btn>
      </div>

      <div class="btn text-center">
        <v-btn class="btn1 mr-8 mt-20 mb-5" outlined color="error"
          >ยกเลิก</v-btn
        >
        <v-btn class="btn2 ml-8 mt-20 mb-5">ยืนยัน</v-btn>
      </div>
      <v-dialog persistent v-model="show_dialog_register_one_id" width="60vw">
        <registerDialogForm dialog title="สมัคร One ID"></registerDialogForm>
      </v-dialog>
    </v-container>
  </v-app>
</template>

<script>
import headerPage from "@/components/header/headerPage.vue";
import LabelCustom from "@/components/label/labelCustom.vue";
import registerDialogForm from "@/components/user_menage/registerDialogForm.vue";
import { mapActions, mapGetters } from "vuex";
export default {
  name: "addlearnPage",
  components: {
    headerPage,
    LabelCustom,
    registerDialogForm,
  },
  props: {},
  data: () => ({
    username: "",
    show_dialog: false,
    filter_search: "",
    add_data: {},
    student: [
      "กมลรัตน์ สิทธิกรชัย",
      "กมลพร ศรีโสภา",
      "เนตรกมล ศรีโสภา",
      "จารุณี กมลอาทิตย์",
    ],
    kingdom: ["1", "2", "3"],
    course: ["3", "2", "1"],
    coursepackage: ["มา 1 จ่าย 3", "มา 3 จ่ายเงิน"],
    period: ["3 วัน", "3 เดือน", "3 ปี"],
    day: ["Monday", "Saturday"],
    time: ["12", "14"],
    coach: ["Robert", "Lewandowski"],
    selected: [""],
    menu: "",
  }),

  created() {},

  mounted() {},

  methods: {
    ...mapActions({
      changeDialogRegisterOneId: "RegisterModules/changeDialogRegisterOneId",
    }),
    addCourse(){
      this.add_course.course.push({
        type: "",
        course : "",
        kingdom : "",
      })
    }
  },
  computed: {
    ...mapGetters({
      show_dialog_register_one_id: "RegisterModules/getShowDialogRegisterOneId",
    }),
  },
  watch: {},
};
</script>
<style scoped>
.sub-register {
  position: absolute;
  left: 58%;
}
</style>

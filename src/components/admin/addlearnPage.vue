<template>
  <v-app>
    <v-container>
      <headerPage title="เพิ่มผู้เรียน"></headerPage>
      <v-row>
        <v-col>
          <h2 class="title1 mb-1">ผู้เรียน</h2>
          <v-row>
            <v-col cols="12" sm="8">
              <v-select
                dense
                v-model="selected"
                :items="student"
                placeholder="ค้นหา/เลือกผู้เรียน"
                outlined
                chips
                multiple
              >
                <template v-slot:prepend-item>
                  <v-text-field
                    dense
                    v-model="filter_search"
                    outlined
                    placeholder="ค้นหา/เลือกผู้เรียน"
                  ></v-text-field>
                </template>
              </v-select>
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
                  <label>อาณาจักร</label>
                  <v-select
                    dense
                    v-model="add_data.student"
                    :items="student"
                    placeholder="เลือกอาณาจักร"
                    outlined
                  >
                    <template v-slot:prepend-item>
                      <v-text-field
                        dense
                        v-model="filter_search"
                        outlined
                        placeholder="เลือกอาณาจักร"
                      ></v-text-field>
                    </template>
                  </v-select>
                </v-col>
                <v-col cols="12" sm="4">
                  <label>คอร์สเรียน</label>
                  <v-select
                    dense
                    v-model="add_data.student"
                    :items="student"
                    placeholder="เลือกอาณาจักร"
                    outlined
                  >
                    <template v-slot:prepend-item>
                      <v-text-field
                        dense
                        v-model="filter_search"
                        outlined
                        placeholder="เลือกอาณาจักร"
                      ></v-text-field>
                    </template>
                  </v-select>
                </v-col>
              </v-row>
              <v-row class="">
                <v-col cols="12" sm="4">
                  <label>แพ็คเกจ</label>
                  <v-select
                    dense
                    v-model="add_data.student"
                    :items="student"
                    placeholder="เลือกแพ็คเกจ"
                    outlined
                  >
                    <template v-slot:prepend-item>
                      <v-text-field
                        dense
                        v-model="filter_search"
                        outlined
                        placeholder="เลือกแพ็คเกจ"
                      ></v-text-field>
                    </template>
                  </v-select>
                </v-col>
                <v-col cols="12" sm="4">
                  <label>ระยะเวลา</label>
                  <v-select
                    dense
                    v-model="add_data.student"
                    :items="student"
                    placeholder="เลือกระยะเวลา"
                    outlined
                  >
                    <template v-slot:prepend-item>
                      <v-text-field
                        dense
                        v-model="filter_search"
                        outlined
                        placeholder="เลือกระยะเวลา"
                      ></v-text-field>
                    </template>
                  </v-select>
                </v-col>
                <v-col cols="12" sm="2">
                  <label>จำนวนครั้ง</label>
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
                  <label>วัน</label>
                  <v-select
                    dense
                    v-model="add_data.student"
                    :items="student"
                    placeholder="เลือกวัน"
                    outlined
                  >
                    <template v-slot:prepend-item>
                      <v-text-field
                        dense
                        v-model="filter_search"
                        outlined
                        placeholder="เลือกวัน"
                      ></v-text-field>
                    </template>
                  </v-select>
                </v-col>
                <v-col cols="12" sm="2">
                  <label>เวลา</label>
                  <v-select
                    dense
                    v-model="add_data.student"
                    :items="student"
                    placeholder="เลือกเวลา"
                    outlined
                  >
                    <template v-slot:prepend-item>
                      <v-text-field
                        dense
                        v-model="filter_search"
                        outlined
                        placeholder="เลือกเวลา"
                      ></v-text-field>
                    </template>
                  </v-select>
                </v-col>
                <v-col cols="12" sm="4">
                  <label>โค้ช</label>
                  <v-select
                    dense
                    v-model="add_data.student"
                    :items="student"
                    placeholder="เลือกโค้ช"
                    outlined
                  >
                    <template v-slot:prepend-item>
                      <v-text-field
                        dense
                        v-model="filter_search"
                        outlined
                        placeholder="เลือกโค้ช"
                      ></v-text-field>
                    </template>
                  </v-select>
                </v-col>
                <v-col cols="12" sm="4">
                  <label>วันเริ่ม</label>
                  <v-menu
                    ref="calender"
                    v-model="calender"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="dateFormatted"
                        outlined
                        dense
                        placeholder="เลือกวันเริ่ม"
                        append-icon="mdi-calendar"
                        v-bind="attrs"
                        @blur="date = parseDate(dateFormatted)"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="date"
                      no-title
                      @input="calender = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="4">
                  <label>ราคา</label>
                  <v-text-field
                    dense
                    v-model="add_data.student"
                    :items="student"
                    outlined
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="8">
                  <label>หมายเหตุราคา</label>
                  <v-textarea
                    class="form-learn"
                    auto-grow
                    outlined
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <div class="btn text-left">
        <v-btn class="btn3 mt-10">เพิ่มคอร์ส</v-btn>
      </div>
      <div class="btn text-center">
        <v-btn class="btn1 mr-8 mt-20 mb-5" outlined color="error"
          >ยกเลิก</v-btn
        >
        <v-btn class="btn2 ml-8 mt-20 mb-5">ยืนยัน</v-btn>
      </div>
    </v-container>
  </v-app>
</template>

<script>
import headerPage from "@/components/header/headerPage.vue";
export default {
  name: "addlearnPage",
  components: {
    headerPage,
  },
  props: {},
  data: () => ({
    filter_search: "",
    add_data: {},
    student: [
      "กมลรัตน์ สิทธิกรชัย",
      "กมลพร ศรีโสภา",
      "เนตรกมล ศรีโสภา",
      "จารุณี กมลอาทิตย์",
    ],
    selected: [""],
  }),

  created() {},

  mounted() {},

  watch: {},

  computed: {},

  methods: {},
};
</script>
<style scoped></style>

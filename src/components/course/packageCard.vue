<template>
  <div>
    <v-card
      flat
      v-for="(package_data, index) in course_data.packages"
      :key="index"
    >
      <headerCard
        :icon="'mdi-card-account-details-outline'"
        :icon_color="'#FF6B81'"
        :title="`แพ็กเกจที่ ${index + 1}`"
      >
        <template slot="actions">
          <v-btn
            v-if="!package_data.course_package_option_id"
            icon
            color="red"
            @click="removePackage(index)"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </template>
      </headerCard>
      <v-card-text class="pt-0">
        <v-divider class="mb-3"></v-divider>
        <v-card class="bg-grey-card mb-3">
          <v-card-text>
            <v-row dense>
              <v-col cols="12" sm="6">
                <label-custom required text="แพ็กเกจ"></label-custom>
                <v-autocomplete
                  dense
                  :disabled="disable"
                  :outlined="!disable"
                  :filled="disable"
                  v-model="package_data.package_id"
                  color="#FF6B81"
                  :rules="rules.packages"
                  :items="packageList(index)"
                  item-value="packageId"
                  item-text="packageName"
                  item-color="pink"
                  @change="checkPackage(package_data.package_id, package_data)"
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
                          :class="
                            package_data.package === item.packageId
                              ? 'font-bold'
                              : ''
                          "
                          >{{ item.packageName }}</span
                        ></v-list-item-title
                      >
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-icon v-if="package_data.package === item.packageId"
                        >mdi-check-circle</v-icon
                      >
                    </v-list-item-action>
                  </template>
                </v-autocomplete>
              </v-col>
              <v-col cols="12" sm="6">
                <label-custom required text="จำนวนนักเรียน (คน)"></label-custom>
                <v-text-field
                  suffix="คน"
                  type="number"
                  :disabled="
                    package_data.package_id !== 'PACK_3' ? true : disable
                  "
                  :outlined="!disable"
                  :filled="disable"
                  :rules="rules.packages_student"
                  @focus="$event.target.select()"
                  class="input-text-right"
                  dense
                  v-model.number="package_data.students"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        <v-card
          class="bg-grey-card"
          :class="package_data.options.length > 1 ? 'mb-3' : ''"
          v-for="(option, option_index) in package_data.options"
          :key="option_index"
        >
          <v-card-text>
            <v-row dense class="d-flex align-center">
              <v-col cols="12" sm="4">
                <label-custom required text="ระยะเวลา"></label-custom>
                <v-autocomplete
                  dense
                  :disabled="disable"
                  :outlined="!disable"
                  :filled="disable"
                  v-model="option.period_package"
                  color="#FF6B81"
                  :rules="rules.options"
                  item-text="optionName"
                  item-value="optionId"
                  :items="optionsList(index, option_index)"
                  item-color="pink"
                  @change="checkOption(option, option_index, package_data)"
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
                          :class="
                            option.period_package === item.optionId
                              ? 'font-bold'
                              : ''
                          "
                          >{{ item.optionName }}</span
                        ></v-list-item-title
                      >
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-icon v-if="option.period_package === item.optionId"
                        >mdi-check-circle</v-icon
                      >
                    </v-list-item-action>
                  </template>
                </v-autocomplete>
              </v-col>
              <v-col cols="12" sm="4">
                <label-custom required text="จำนวนครั้ง/คน"></label-custom>
                <v-text-field
                  class="input-text-right"
                  dense
                  :disabled="disable"
                  :outlined="!disable"
                  :filled="disable"
                  @focus="$event.target.select()"
                  :rules="rules.options_amount"
                  type="number"
                  placeholder="ระบุจำนวน ครั้ง/คน"
                  v-model.number="option.amount"
                  @change="calNetPrice(option)"
                ></v-text-field>
              </v-col>
              <v-col cols="6" sm="2">
                <v-btn
                  :disabled="disable"
                  v-if="option_index === package_data.options.length - 1"
                  @click="addOptions(package_data.options)"
                  class="w-full"
                  outlined
                  color="green"
                >
                  <v-icon>mdi-plus-box-multiple</v-icon>
                  เพิ่มระยะเวลา
                </v-btn>
              </v-col>
              <v-col cols="6" sm="2">
                <template v-if="!option.course_package_option_id">
                  <v-btn
                    :disabled="disable"
                    v-if="package_data.options.length > 1"
                    class="w-full"
                    outlined
                    color="red"
                    @click="removeOptions(package_data.options, option_index)"
                  >
                    <v-icon>mdi-delete-empty</v-icon>
                    ลบระยะเวลา
                  </v-btn>
                </template>
              </v-col>
            </v-row>
            <v-row dense>
              <v-col cols="12" sm="4">
                <label-custom required text="ราคา/คน"></label-custom>
                <v-text-field
                  class="input-text-right"
                  dense
                  :disabled="disable"
                  :outlined="!disable"
                  :filled="disable"
                  :rules="rules.price_unit"
                  @focus="$event.target.select()"
                  type="number"
                  placeholder="ระบุราคา บาท/คน"
                  v-model.number="option.price_unit"
                  @change="calNetPrice(option)"
                ></v-text-field>
              </v-col>
              <v-col>
                <v-row class="flex align-center">
                  <v-col cols="12" sm="auto">
                    <v-checkbox
                      :disabled="disable"
                      v-model="option.discount"
                      @input="calNetPrice(option)"
                      label="มีส่วนลด"
                    ></v-checkbox>
                  </v-col>
                  <v-col cols="12" sm="5" class="pt-8">
                    <v-text-field
                      dense
                      type="number"
                      class="input-text-right"
                      :rules="rules.discount"
                      @focus="$event.target.select()"
                      :disabled="!option.discount || disable"
                      placeholder="ระบุส่วนลด/บาท"
                      :outlined="option.discount || disable"
                      :filled="!option.discount || disable"
                      v-model.number="option.discount_price"
                      @change="calNetPrice(option)"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row dense>
              <v-col>
                <LabelCustom text="สิทธิ์พิเศษ"></LabelCustom>
                <v-textarea
                  dense
                  :disabled="disable"
                  :outlined="!disable"
                  :filled="disable"
                  v-model="option.privilege"
                ></v-textarea>
              </v-col>
            </v-row>
            <!-- TOTAL -->
            <v-card
              v-if="option.discount"
              flat
              style="background-color: #fbf3f5"
            >
              <v-card-text>
                <v-row>
                  <v-col>เหลือราคา</v-col>
                  <v-col class="text-[#FF6B81] font-bold text-right">{{
                    option.net_price.toLocaleString()
                  }}</v-col>
                  <v-col>บาท เฉลี่ย</v-col>
                  <v-col class="text-[#FF6B81] font-bold text-right">{{
                    option.net_price_unit.toLocaleString()
                  }}</v-col>
                  <v-col>บาท/ครั้ง</v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-card-text>
        </v-card>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
import HeaderCard from "../header/headerCard.vue";
import LabelCustom from "../label/labelCustom.vue";
import { mapGetters, mapActions } from "vuex";
export default {
  props: {
    disable: { type: Boolean, default: false },
    edited: { type: Boolean, default: false },
  },
  components: {
    LabelCustom,
    HeaderCard,
  },
  data: () => ({
    packages_selected: [],
    options_selected: [],
    minimum_students: 0,
  }),
  created() {},
  mounted() {
    this.$store.dispatch("CourseModules/GetPackages");
    this.$store.dispatch("CourseModules/GetOptions");
  },
  watch: {},
  computed: {
    ...mapGetters({
      course_data: "CourseModules/getCourseData",
      packages_data: "CourseModules/getPackages",
      options_data: "CourseModules/getOptions",
    }),
    rules() {
      const vm = this;
      return {
        packages: [
          function (val) {
            return (val || "").length > 0 || "โปรดเลือกแพ็กเกจ";
          },
        ],
        packages_student: [
          function (val) {
            return (val || "") > vm.minimum_students
              ? vm.minimum_students
              : 0 || "โปรดระบุจำนวนนักเรียน";
          },
        ],
        options: [
          function (val) {
            return (val || "").length > 0 || "โปรดเลือกระยะเวลา";
          },
        ],
        options_amount: [
          function (val) {
            return (val || "") > 0 || "โปรดระบุจำนวนครั้ง/คน";
          },
        ],
        price_unit: [
          function (val) {
            return (val || "") > 0 || "โปรดระบุราคาต่อ/คน";
          },
        ],
      };
    },
  },
  methods: {
    ...mapActions({
      ChangeCourseData: "CourseModules/ChangeCourseData",
    }),
    packageList(package_index) {
      let used_package = [];
      let current_package = this.course_data.packages[package_index].package_id;
      for (const package_data of this.course_data.packages) {
        if (package_data.package_id !== current_package) {
          used_package.push(package_data.package_id);
        }
      }
      return this.packages_data.filter(
        (v) => !used_package.includes(v.packageId)
      );
    },
    removePackage(index) {
      this.course_data.packages.splice(index, 1);
    },
    optionsList(package_index, options_index) {
      let used_options = [];
      let current_option =
        this.course_data.packages[package_index].options[options_index]
          .period_package;
      for (const option_data of this.course_data.packages[package_index]
        .options) {
        if (option_data.period_package !== current_option) {
          used_options.push(option_data.period_package);
        }
      }
      return this.options_data.filter(
        (v) => !used_options.includes(v.optionId)
      );
    },
    calNetPrice(data) {
      if (data.discount_price < 0) {
        data.discount_price = 0;
      }
      if (data.discount) {
        if (data.price_unit - data.discount_price < 0) {
          data.discount_price = data.price_unit - 1;
          data.net_price = data.price_unit - data.discount_price;
          data.net_price_unit = data.net_price / data.amount;
        } else {
          data.net_price = data.price_unit - data.discount_price;
          data.net_price_unit = data.net_price / data.amount;
        }
      }
    },
    checkOption(option_data) {
      if (option_data.period_package === "OP_1") {
        option_data.amount = 1;
      } else if (option_data.period_package === "OP_2") {
        option_data.amount = 4;
      } else if (option_data.period_package === "OP_3") {
        option_data.amount = 12;
      } else if (option_data.period_package === "OP_4") {
        option_data.amount = 24;
      } else if (option_data.period_package === "OP_5") {
        option_data.amount = 4;
      } else if (option_data.period_package === "OP_6") {
        option_data.amount = 8;
      } else if (option_data.period_package === "OP_7") {
        option_data.amount = 10;
      }
    },
    checkPackage(package_data, packages) {
      let minimum_students_data = this.minimum_students;
      if (package_data === "PACK_1") {
        packages.students = 1;
      } else if (package_data === "PACK_2") {
        packages.students = 2;
      } else if (package_data === "PACK_3") {
        packages.students = 3;
        minimum_students_data = 3;
      }
      return { packages, minimum_students_data };
    },
    addOptions(data) {
      data.push({
        period_package: "",
        amount: 0,
        price_unit: 0,
        discount: false,
        discount_price: 0,
        privilege: "",
        net_price: 0,
        net_price_unit: 0,
      });
      this.ChangeCourseData(this.course_data);
    },
    removeOptions(data, index) {
      data.splice(index, 1);
      this.ChangeCourseData(this.course_data);
    },
  },
};
</script>
<style></style>
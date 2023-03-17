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
        :title="`แพ็คเกจที่ ${index + 1}`"
      ></headerCard>
      <v-card-text class="pt-0">
        <v-divider class="mb-3"></v-divider>
        <v-card class="bg-grey-card mb-3">
          <v-card-text>
            <v-row dense>
              <v-col cols="12" sm="6">
                <label-custom required text="แพ็ตเกจ"></label-custom>
                <v-autocomplete 
                    dense
                    :disabled="disable"
                    :outlined="!disable"
                    :filled="disable"
                    v-model="package_data.package"
                    color="#FF6B81"
                    :rules="rules.packages"
                    :items="packages_data"
                    item-value="packageId"
                    item-text="packageName"
                    item-color="pink"
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
                        <v-list-item-title ><span :class="package_data.package === item.packageId ? 'font-bold':''">{{ item.packageName }}</span></v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-action>
                        <v-icon v-if="package_data.package === item.packageId">mdi-check-circle</v-icon>
                    </v-list-item-action>
                    </template>  
                </v-autocomplete>
              </v-col>
              <v-col cols="12" sm="6">
                <label-custom required text="จำนวนนักเรียน/คน"></label-custom>
                <v-text-field
                  suffix="คน"
                  type="number"
                  :disabled="disable"
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
                    :items="options_data"
                    item-color="pink"
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
                        <v-list-item-title ><span :class="option.period_package === item.optionId ? 'font-bold':''">{{ item.optionName }}</span></v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-action>
                        <v-icon v-if="option.period_package === item.optionId">mdi-check-circle</v-icon>
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
                      label="มีส่วนลด"
                    ></v-checkbox>
                  </v-col>
                  <v-col cols="12" sm="5" class="pt-8">
                    <v-text-field
                      dense
                      type="number"
                      class="input-text-right"
                      @focus="$event.target.select()"
                      :disabled="!option.discount"
                      placeholder="ระบุส่วนลด/บาท"
                      :outlined="option.discount"
                      :filled="!option.discount"
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
  props:{
    disable: {type: Boolean, default: false},
  },
  components: {
    LabelCustom,
    HeaderCard
  },
  data: () => ({
    packages_selected: [],
    options_selected: [],
    rules: {  
      packages: [val => (val || '').length > 0 || 'โปรดเลือกแพ็คเกจ'],
      packages_student: [val => (val || '') > 0 || 'โปรดระบุจำนวนนักเรียน'],
      options : [val => (val || '').length > 0 || 'โปรดเลือกระยะเวลา'],
      options_amount : [val => (val || '') > 0 || 'โปรดระบุจำนวนครั้ง/คน'],
      price_unit : [val => (val || '') > 0 || 'โปรดระบุราคาต่อ/คน'],
    },
  }),
  created() {
    
  },
  mounted() {
    this.$store.dispatch("CourseModules/GetPackages")
    this.$store.dispatch("CourseModules/GetOptions")
  },
  watch: {},
  computed: {
    ...mapGetters({
      course_data: "CourseModules/getCourseData",
      packages_data : "CourseModules/getPackages",
      options_data : "CourseModules/getOptions",
    }),
  },
  methods: {
    ...mapActions({
      ChangeCourseData: "CourseModules/ChangeCourseData",
    }),
    calNetPrice(data){
      if(data.discount){
        data.net_price = (data.price_unit * data.amount) - data.discount_price
        data.net_price_unit = data.net_price / data.amount
      }
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
      this.ChangeCourseData(this.course_data)
    },
    removeOptions(data, index){
        data.splice(index, 1);
        this.ChangeCourseData(this.course_data)
    },
  },
};
</script>
<style></style>
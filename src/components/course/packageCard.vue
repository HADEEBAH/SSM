<template>
  <div v-if="data_package?.length === 0 && edited">
    <template>
      <v-row class="fill-height ma-0" align="center" justify="center">
        <v-progress-circular
          indeterminate
          color="#ff6b81"
        ></v-progress-circular>
      </v-row>
    </template>
  </div>

  <div v-else>
    <v-card flat v-for="(item_package, index) in data_package" :key="index">
      <headerCard
        :icon="'mdi-card-account-details-outline'"
        :icon_color="'#FF6B81'"
        :title="`${$t('package no.')} ${index + 1}`"
      >
        <template slot="actions">
          <v-btn
            v-if="
              !item_package.course_package_option_id &&
              edited &&
              item_package.add_new_package
            "
            :disabled="checked()"
            icon
            color="#FF6B81"
            @click="saveAddNewPackage(item_package)"
          >
            <v-icon>mdi-content-save-all-outline</v-icon>
          </v-btn>
          <v-btn
            v-if="
              !item_package.course_package_option_id && data_package?.length > 1
            "
            icon
            color="red"
            @click="removePackage(index, item_package)"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </template>
      </headerCard>
      <v-card-text class="pt-0">
        <v-divider class="mb-3"></v-divider>
        <!-- PACKAGE -->
        <v-card class="bg-grey-card mb-3">
          <v-card-text>
            <v-row dense>
              <!-- PACKAGE -->
              <v-col cols="12" sm="4">
                <label-custom required :text="$t('package')"></label-custom>
                <v-autocomplete
                  dense
                  :disabled="item_package.edit_package"
                  :outlined="!item_package.edit_package"
                  :filled="item_package.edit_package"
                  v-model="item_package.package_id"
                  color="#FF6B81"
                  :rules="rules.packages"
                  :items="packageList(index)"
                  item-value="packageId"
                  item-text="packageName"
                  item-color="#ff6b81"
                  @change="checkPackage(item_package.package_id, item_package)"
                >
                  <template v-slot:no-data>
                    <v-list-item>
                      <v-list-item-title>
                        {{ $t("no data found") }}</v-list-item-title
                      >
                    </v-list-item>
                  </template>
                  <template v-slot:item="{ item }">
                    <v-list-item-content>
                      <v-list-item-title
                        ><span
                          :class="
                            item_package.package === item.packageId
                              ? 'font-bold'
                              : ''
                          "
                          >{{ item.packageName }}</span
                        ></v-list-item-title
                      >
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-icon v-if="item_package.package === item.packageId"
                        >mdi-check-circle</v-icon
                      >
                    </v-list-item-action>
                  </template>
                </v-autocomplete>
              </v-col>
              <!-- PACKAGE STUDENS -->
              <v-col cols="12" sm="4">
                <label-custom
                  required
                  :text="`${$t('number of students')} (${$t('person')})`"
                ></label-custom>
                <v-text-field
                  suffix="คน"
                  type="number"
                  :disabled="
                    item_package.package_id !== 'PACK_3'
                      ? true
                      : item_package.edit_package
                  "
                  :outlined="!item_package.edit_package"
                  :filled="item_package.edit_package"
                  :rules="packages_student(item_package.students, index)"
                  @focus="$event.target.select()"
                  class="input-text-right"
                  dense
                  :min="item_package.package_id == 'PACK_3' ? 3 : 1"
                  v-model.number="item_package.students"
                ></v-text-field>
              </v-col>
              <!-- BUTTONS -->
              <v-col cols="12" sm="4" class="mt-6">
                <!-- EDIT -->
                <v-btn
                  v-if="item_package.edit_package"
                  icon
                  color="#FF6B81"
                  @click="editPackage(item_package)"
                  ><v-icon>mdi-pencil-outline</v-icon></v-btn
                >
                <!-- SAVE -->
                <v-btn
                  v-if="
                    !item_package.edit_package &&
                    edited &&
                    !item_package.add_new_package
                  "
                  :disabled="checkedPackage(item_package)"
                  icon
                  color="#FF6B81"
                  @click="saveUpdatePackage(index, data_package)"
                  ><v-icon>mdi-content-save-all-outline</v-icon></v-btn
                >
                <!-- DELETE -->
                <!-- <v-btn
                  v-if="!item_package.edit_package"
                  icon
                  color="#FF6B81"
                  @click="deletePackage(index, data_package)"
                  ><v-icon>mdi-delete-outline</v-icon></v-btn
                > -->
                <!-- REFRESH -->
                <v-btn
                  v-if="
                    !item_package.edit_package &&
                    edited &&
                    !item_package.add_new_package
                  "
                  icon
                  color="#FF6B81"
                  @click="refreshPackage(item_package)"
                  ><v-icon>mdi-refresh</v-icon></v-btn
                >
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        <!-- OPTIONS -->
        <v-card
          class="bg-grey-card"
          :class="item_package.options.length > 1 ? 'mb-3' : ''"
          v-for="(option, option_index) in item_package.options"
          :key="option_index"
        >
          <v-card-text>
            <v-row dense class="d-flex align-center">
              <!-- period -->
              <v-col cols="12" sm="4">
                <label-custom required :text="$t('period')"></label-custom>
                <v-autocomplete
                  dense
                  item-disabled="disabled"
                  :disabled="option.edit_package_option"
                  :outlined="!option.edit_package_option"
                  :filled="option.edit_package_option"
                  v-model="option.option_id"
                  color="#FF6B81"
                  :rules="rules.options"
                  :item-text="
                    $i18n.locale == 'th' ? 'option_name' : 'option_name_en'
                  "
                  item-value="option_id"
                  :items="
                    optionsList(
                      index,
                      option.option_id,
                      item_package.option_list
                    )
                  "
                  item-color="#ff6b81"
                  @focus="handleFocus"
                  @change="checkOption(option, item_package)"
                >
                  <!-- <v-autocomplete
                  dense
                  v-model="option.option_id"
                  item-text="option_name"
                  item-value="option_id"
                  :items="options_data_list"
                > -->
                  <template v-slot:no-data>
                    <v-list-item>
                      <v-list-item-title>
                        {{ $t("no data found") }}</v-list-item-title
                      >
                    </v-list-item>
                  </template>
                  <!-- <template v-slot:item="{ item }">
                    <v-list-item-content>
                      <v-list-item-title>
                        <span
                          :class="
                            option.period_package === item.optionId
                              ? 'font-bold'
                              : ''
                          "
                          >{{
                            $i18n.locale == "th"
                              ? item.optionName
                              : item.optionNameEn
                          }}</span
                        >
                      </v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-icon v-if="option.period_package === item.optionId"
                        >mdi-check-circle</v-icon
                      >
                    </v-list-item-action>
                  </template> -->
                </v-autocomplete>
              </v-col>
              <!-- NUMBER / PERSON -->
              <v-col cols="12" sm="4">
                <label-custom
                  required
                  :text="$t('number of times/person')"
                ></label-custom>
                <v-text-field
                  class="input-text-right"
                  dense
                  :disabled="option.edit_package_option"
                  :outlined="!option.edit_package_option"
                  :filled="option.edit_package_option"
                  @focus="$event.target.select()"
                  :rules="rules.options_amount"
                  type="number"
                  :placeholder="$t('specify the number of times/person')"
                  v-model.number="option.amount"
                  @change="calNetPrice(option)"
                  color="#FF6B81"
                ></v-text-field>
              </v-col>
              <!-- BUTTONS -->
              <v-col cols="12" sm="4">
                <v-row dens v-if="edited">
                  <!-- BUTTONS -->
                  <v-col cols="12" sm="8">
                    <!-- EDIT -->
                    <v-btn
                      v-if="option.edit_package_option"
                      icon
                      color="#FF6B81"
                      @click="editPackageOption(option)"
                      ><v-icon>mdi-pencil-outline</v-icon></v-btn
                    >
                    <v-btn
                      v-if="
                        option_index === item_package.options.length - 1 &&
                        !option.edit_package_option
                      "
                      @click="addOptions(item_package.options)"
                      icon
                      color="green"
                    >
                      <v-icon>mdi-plus-box-multiple</v-icon>
                    </v-btn>
                    <!-- SAVE -->
                    <v-btn
                      v-if="
                        !option.edit_package_option &&
                        !option.add_new_option &&
                        !item_package.add_new_package
                      "
                      :disabled="checkedOption(option)"
                      icon
                      color="#FF6B81"
                      @click="saveUpdatePackageOption(option, item_package)"
                      ><v-icon>mdi-content-save-all-outline</v-icon></v-btn
                    >
                    <!-- DELETE -->
                    <v-btn
                      v-if="
                        !option.edit_package_option &&
                        item_package.options?.length > 1
                      "
                      icon
                      color="#FF6B81"
                      @click="
                        deletePackageOption(
                          option_index,
                          option,
                          item_package.options
                        )
                      "
                      ><v-icon>mdi-delete-outline</v-icon></v-btn
                    >
                    <!-- REFRESH -->
                    <v-btn
                      v-if="
                        !option.edit_package_option &&
                        !option.add_new_option &&
                        !item_package.add_new_package
                      "
                      icon
                      color="#FF6B81"
                      @click="refreshPackageOption(option)"
                      ><v-icon>mdi-refresh</v-icon></v-btn
                    >
                  </v-col>
                </v-row>
                <v-row dense v-else>
                  <v-col cols="6" sm="6">
                    <v-btn
                      :disabled="disable"
                      v-if="option_index === item_package.options.length - 1"
                      @click="
                        addOptions(
                          item_package.options,
                          option_index,
                          item_package
                        )
                      "
                      class="w-full"
                      outlined
                      color="green"
                    >
                      <v-icon>mdi-plus-box-multiple</v-icon>
                      {{ $t("add period") }}
                    </v-btn>
                  </v-col>
                  <v-col cols="6" sm="6">
                    <template v-if="!option.course_package_option_id">
                      <v-btn
                        :disabled="disable"
                        v-if="item_package.options.length > 1"
                        class="w-full"
                        outlined
                        color="red"
                        @click="
                          removeOptions(
                            item_package.options,
                            option_index,
                            item_package
                          )
                        "
                      >
                        <v-icon>mdi-delete-empty</v-icon>
                        {{ $t("delete period") }}
                      </v-btn>
                    </template>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row dense>
              <!-- PRICE -->
              <v-col cols="12" sm="4">
                <label-custom
                  required
                  :text="`${$t('price')}/${$t('person')}`"
                ></label-custom>
                <v-text-field
                  class="input-text-right"
                  dense
                  :disabled="option.edit_package_option"
                  :outlined="!option.edit_package_option"
                  :filled="option.edit_package_option"
                  :rules="rules.price_unit"
                  @focus="$event.target.select()"
                  type="number"
                  :placeholder="$t('specify price baht/person')"
                  v-model.number="option.price_unit"
                  @change="calNetPrice(option)"
                  color="#FF6B81"
                ></v-text-field>
              </v-col>
              <v-col>
                <v-row class="flex align-center">
                  <!-- DISCOUNT BOOL -->

                  <v-col cols="12" sm="auto">
                    <v-checkbox
                      :disabled="option.edit_package_option"
                      v-model="option.discount"
                      @input="calNetPrice(option)"
                      :label="$t('there is a discount')"
                      color="#FF6B81"
                    ></v-checkbox>
                  </v-col>
                  <!-- DISCOUNT NUMBER-->

                  <v-col cols="12" sm="5" class="pt-8">
                    <v-text-field
                      dense
                      type="number"
                      class="input-text-right"
                      :rules="rules.discount"
                      @focus="$event.target.select()"
                      :disabled="!option.discount || option.edit_package_option"
                      :placeholder="$t('specify discount/baht')"
                      :outlined="option.discount || option.edit_package_option"
                      :filled="!option.discount || option.edit_package_option"
                      v-model.number="option.discount_price"
                      @change="calNetPrice(option)"
                      color="#FF6B81"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row dense>
              <!-- PRIVILAGE -->
              <v-col>
                <LabelCustom :text="$t('special rights')"></LabelCustom>
                <v-textarea
                  dense
                  :disabled="option.edit_package_option"
                  :outlined="!option.edit_package_option"
                  :filled="option.edit_package_option"
                  v-model="option.option_description"
                  color="#FF6B81"
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
                  <v-col cols="12" sm="6">
                    <v-row dense>
                      <v-col cols>{{ $t("price remaining") }}</v-col>
                      <v-col
                        cols="auto"
                        class="text-[#FF6B81] font-bold text-right"
                      >
                        {{
                          option.price_unit - option.discount_price
                            ? option.price_unit - option.discount_price
                            : 0?.toLocaleString()
                        }}
                        <!-- {{ option.net_price?.toLocaleString() }} -->
                      </v-col>
                      <v-col cols="auto">{{ $t("baht") }} </v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-row dense>
                      <v-col>{{ $t("average") }}</v-col>
                      <v-col
                        cols="auto"
                        class="text-[#FF6B81] font-bold text-right"
                      >
                        {{
                          (option.price_unit - option.discount_price) /
                          option.amount
                            ? (option.price_unit - option.discount_price) /
                              option.amount
                            : 0?.toLocaleString()
                        }}
                        <!-- {{ option.net_price_unit?.toLocaleString() }} -->
                      </v-col>
                      <v-col cols="auto"
                        >{{ $t("baht") }}/{{ $t("time") }}</v-col
                      >
                    </v-row>
                  </v-col>
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
import { mapGetters, mapActions, mapMutations } from "vuex";
import Swal from "sweetalert2";

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
    selected_option: false,
    option_selected: [],
    options_data_list: [
      {
        option_id: "OP_1",
        option_name: "รายวัน",
        option_name_en: "Daily",
      },
      {
        option_id: "OP_2",
        option_name: "รายเดือน",
        option_name_en: "Monthly",
      },
      {
        option_id: "OP_3",
        option_name: "รายเทอม",
        option_name_en: "Per term",
      },
      {
        option_id: "OP_4",
        option_name: "รายปี",
        option_name_en: "Yearly",
      },
      {
        option_id: "OP_5",
        option_name: "ราย 4 ครั้ง",
        option_name_en: "4 times",
      },
      {
        option_id: "OP_6",
        option_name: "ราย 2 เดือน",
        option_name_en: "2 months",
      },
      {
        option_id: "OP_7",
        option_name: "ราย 10 ครั้ง",
        option_name_en: "10 times",
      },
    ],
    selectedOptions: [],
    checkIndexOption: 0,
  }),
  created() {},
  mounted() {
    this.$store.dispatch("CourseModules/GetPackages");
    this.$store.dispatch("CourseModules/GetOptions");
  },
  watch: {},
  computed: {
    ...mapGetters({
      data_package: "CourseModules/getPackageData",
      // course_data: "CourseModules/getCourseData",
      packages_data: "CourseModules/getPackages",
      options_data: "CourseModules/getOptions",
      refresh_package: "CourseModules/getrefeshPackage",
      refresh_package_options: "CourseModules/getrefeshPackageOption",
    }),

    rules() {
      const vm = this;
      return {
        packages: [
          function (val) {
            return (val || "").length > 0 || vm.$t("please select a package");
          },
        ],
        options: [
          function (val) {
            return (val || "").length > 0 || vm.$t("please select a period");
          },
        ],
        options_amount: [
          function (val) {
            return (
              (val || "") > 0 ||
              vm.$t("please specify the number of times/person")
            );
          },
        ],
        price_unit: [
          function (val) {
            return (val || "") > 0 || vm.$t("please specify price / person");
          },
        ],
      };
    },
    data_options() {
      return this.data_package?.map((pkg) => pkg.options).flat();
    },
    filteredOptions() {
      const currentPackage = this.data_package.find(
        (pkg) => pkg.package_id === this.currentPackageId
      );

      if (!currentPackage) {
        return this.data_options;
      }

      const existingOptionIds = currentPackage.options.map(
        (opt) => opt.option_id
      );

      return this.data_options.filter(
        (option) => !existingOptionIds.includes(option.optionId)
      );
    },
  },
  destroyed() {
    this.ResetStateCourseData();
  },
  methods: {
    ...mapActions({
      ChangeCourseData: "CourseModules/ChangeCourseData",
      UpdatePackage: "CourseModules/UpdatePackage",
      UpdatePackageOption: "CourseModules/UpdatePackageOption",
      DeletePackege: "CourseModules/DeletePackege",
      DeletePackegeOption: "CourseModules/DeletePackegeOption",
      CreateNewPackage: "CourseModules/CreateNewPackage",
      CreateNewPackageOption: "CourseModules/CreateNewPackageOption",
      RefreshPackage: "CourseModules/RefreshPackage",
      RefreshPackageOption: "CourseModules/RefreshPackageOption",
    }),
    ...mapMutations({
      ResetStateCourseData: "CourseModules/ResetStateCourseData",
    }),
    editPackage(item_package) {
      item_package.edit_package = false;
    },
    saveUpdatePackage(index, course_data) {
      Swal.fire({
        icon: "question",
        title: this.$t("do you want to update a package"),
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: this.$t("agree"),
        cancelButtonText: this.$t("cancel"),
      }).then(async (result) => {
        if (result.isConfirmed) {
          let payload = {
            old_package_id: "",
            package_id: "",
            student_number: 0,
          };
          if (course_data[index].package === "Exclusive Package") {
            payload.old_package_id = "PACK_1";
          } else if (course_data[index].package === "Family Package") {
            payload.old_package_id = "PACK_2";
          } else if (course_data[index].package === "Group Package") {
            payload.old_package_id = "PACK_3";
          }
          payload.package_id = course_data[index].package_id;
          payload.student_number = course_data[index].students;
          this.UpdatePackage({
            course_id: this.$route.params.course_id,
            payload,
          });
        }
      });
    },

    async refreshPackage(item_package) {
      let old_package_id = null;
      if (item_package.package === "Exclusive Package") {
        old_package_id = "PACK_1";
      } else if (item_package.package === "Family Package") {
        old_package_id = "PACK_2";
      } else if (item_package.package === "Group Package") {
        old_package_id = "PACK_3";
      }
      await this.RefreshPackage({
        course_id: this.$route.params.course_id,
        package_id: old_package_id,
      });
      item_package.package_id = this.refresh_package.packageId;
      item_package.students = this.refresh_package.studentNumber;
    },
    editPackageOption(item_package) {
      item_package.edit_package_option = false;
    },
    saveUpdatePackageOption(option, item_package) {
      if (option.course_package_option_id) {
        // UPDATE OLD OPTION

        Swal.fire({
          icon: "question",
          title: this.$t("do you want to update a option"),
          showDenyButton: false,
          showCancelButton: true,
          confirmButtonText: this.$t("agree"),
          cancelButtonText: this.$t("cancel"),
        }).then(async (result) => {
          if (result.isConfirmed) {
            let data_payload = {
              course_package_option_id: option.course_package_option_id,
              package_id: option.package_id,
              option_id: option.option_id,
              hour_per_time: option.amount,
              price_per_person: option.price_unit,
              discount_status: option.discount,
              discount_price: option.discount_price ? option.discount_price : 0,
              option_description: option.option_description,
              net_price_unit: option.net_price_unit,
              student_number: option.students,
            };
            this.UpdatePackageOption({
              course_id: this.$route.params.course_id,
              payload: data_payload,
            });
          }
        });
      } else {
        // ADD NEW OPTION
        Swal.fire({
          icon: "question",
          title: this.$t("do you want to create a option"),
          showDenyButton: false,
          showCancelButton: true,
          confirmButtonText: this.$t("agree"),
          cancelButtonText: this.$t("cancel"),
        }).then(async (result) => {
          if (result.isConfirmed) {
            let data_payload = {
              course_package_option_id: null,
              option_id: option.option_id,
              hour_per_time: option.amount,
              price_per_person: option.price_unit,
              discount_status: option.discount,
              discount_price: option.discount_price ? option.discount_price : 0,
              option_description: option.option_description,
              net_price_unit: option.net_price_unit,
              package_id: item_package.package_id,
              student_number: item_package.students,
            };
            this.CreateNewPackageOption({
              course_id: this.$route.params.course_id,
              payload: data_payload,
            });
          }
        });
      }
    },
    deletePackageOption(option_index, option, data) {
      if (option.course_package_option_id) {
        // OLD OPTION
        Swal.fire({
          icon: "question",
          title: this.$t("do you want to delete a option"),
          showDenyButton: false,
          showCancelButton: true,
          confirmButtonText: this.$t("agree"),
          cancelButtonText: this.$t("cancel"),
        }).then(async (result) => {
          if (result.isConfirmed) {
            this.DeletePackegeOption({
              course_id: this.$route.params.course_id,
              cpo: option.course_package_option_id,
            });
          }
        });
      } else {
        // NEWUPTION
        data.splice(option_index, 1);
      }
    },
    async refreshPackageOption(option) {
      await this.RefreshPackageOption({
        course_id: this.$route.params.course_id,
        cpo: option.course_package_option_id,
      });
      option.option_id = this.refresh_package_options.optionId;
      option.amount = this.refresh_package_options.hourPerTime;
      option.price_unit = this.refresh_package_options.pricePerPerson;
      option.discount =
        this.refresh_package_options.discountStatus === 1 ? true : false;
      option.discount_price = this.refresh_package_options.discountPrice;
      option.option_description =
        this.refresh_package_options.optionDescription;
    },
    checkedPackage(item_package) {
      let package_id = null;
      let student_number = 0;
      package_id = item_package.package_id;
      student_number = item_package.students;

      // this.data_package?.map((items) => {
      //   package_id = items.package_id;
      //   student_number = items.students > 0;
      // });
      return !package_id || !student_number;
    },
    checkedOption(option) {
      let option_id = null;
      let student_anount = 0;
      let price = 0;
      option_id = option.option_id;
      student_anount = option.amount;
      price = option.price_unit > 0;
      return (
        !option_id ||
        !student_anount ||
        !price ||
        (option.discount && option.discount_price < 1)
      );
    },
    checked() {
      let package_id = null;
      let student_number = 0;
      let option_id = null;
      let student_anount = 0;
      let price = 0;
      let check_discount = null;

      this.data_package?.map((items) => {
        package_id = items.package_id;
        student_number = items.students > 0;
        items.options?.map((item) => {
          option_id = item.option_id;
          student_anount = item.amount;
          price = item.price_unit > 0;
          check_discount = item.discount && item.discount_price < 1;
        });
      });
      return (
        !package_id ||
        !student_number ||
        !option_id ||
        !student_anount ||
        !price ||
        check_discount
      );
    },
    saveAddNewPackage(item_package) {
      Swal.fire({
        icon: "question",
        title: this.$t("do you want to create a package"),
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: this.$t("agree"),
        cancelButtonText: this.$t("cancel"),
      }).then(async (result) => {
        if (result.isConfirmed) {
          let data_payload = {
            package_id: "",
            package: "",
            student_number: 0,
            options: [],
          };
          if (item_package.package_id === "PACK_1") {
            data_payload.package = "Exclusive Package";
          } else if (item_package.package_id === "PACK_2") {
            data_payload.package = "Family Package";
          } else if (item_package.package_id === "PACK_3") {
            data_payload.package = "Group Package";
          }

          // data_payload.package = data_payload.package;
          data_payload.package_id = item_package.package_id;
          data_payload.student_number = item_package.students;
          item_package.options.map((item) => {
            data_payload.options.push({
              package_id: item_package.package_id,
              option_id: item.option_id,
              hour_per_time: item.amount,
              price_per_person: item.price_unit ? item.price_unit : 0,
              discount_price: item.discount_price ? item.discount_price : 0,
              discount_status: item.discount ? true : false,
              option_description: item.option_description
                ? item.option_description
                : null,
              net_price_unit: item.net_price ? item.net_price : 0,
              student_number: item_package.students ? item_package.students : 0,
            });
          });
          await this.CreateNewPackage({
            course_id: this.$route.params?.course_id,
            payload: data_payload,
          });
        }
      });
    },

    packages_student(val, index) {
      let package_id = this.data_package[index].package_id;
      let minimum_students = 0;
      if (package_id === "PACK_1") {
        minimum_students = 1;
      } else if (package_id === "PACK_2") {
        minimum_students = 2;
      } else if (package_id === "PACK_3") {
        minimum_students = 3;
      }
      return [
        (val || "") >= minimum_students ||
          `${this.$t(
            "please specify the number of students at least"
          )} ${minimum_students} ${this.$t("person")}`,
      ];
    },
    packageList(package_index) {
      let used_package = [];
      let current_package = this.data_package[package_index].package_id;
      for (const package_data of this.data_package) {
        if (package_data.package_id !== current_package) {
          used_package.push(package_data.package_id);
        }
      }
      return this.packages_data.filter(
        (v) => !used_package.includes(v.packageId)
      );
    },
    removePackage(index, item_package) {
      if (item_package.package) {
        // DELETE OLD PACKAGE
        Swal.fire({
          icon: "question",
          title: this.$t("do you want to delete a package"),
          showDenyButton: false,
          showCancelButton: true,
          confirmButtonText: this.$t("agree"),
          cancelButtonText: this.$t("cancel"),
        }).then(async (result) => {
          if (result.isConfirmed) {
            this.DeletePackege({
              course_id: this.$route.params.course_id,
              package_id: item_package.package_id,
            });
          }
        });
      } else {
        // DELETE NEW PACKAGE
        this.data_package.splice(index, 1);
      }
    },
    handleFocus() {
      this.selected_option = true;
    },

    optionsList(package_index, options_id, option_list) {
      let ckeckedPackage = this.data_package[package_index];
      let beforeSelected = option_list?.filter((items) => {
        return !ckeckedPackage?.option_selected?.includes(items.option_id);
      });

      let afterSelected = [];

      if (options_id) {
        afterSelected = option_list?.filter((items) => {
          return items.option_id === options_id;
        });
      }

      const combinations = [...afterSelected, ...beforeSelected];

      return combinations;
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

    // checkOption(
    //   option_data,
    //   newOptionId,
    //   package_index,
    //   option_index,
    //   item_package
    // ) {
    //   console.log("option_data :>> ", option_data);

    //   console.log("item_package :>> ", item_package);

    //   if (option_data.option_id === "OP_1") {
    //     option_data.amount = 1;
    //   } else if (option_data.option_id === "OP_2") {
    //     option_data.amount = 4;
    //   } else if (option_data.option_id === "OP_3") {
    //     option_data.amount = 12;
    //   } else if (option_data.option_id === "OP_4") {
    //     option_data.amount = 24;
    //   } else if (option_data.option_id === "OP_5") {
    //     option_data.amount = 4;
    //   } else if (option_data.option_id === "OP_6") {
    //     option_data.amount = 8;
    //   } else if (option_data.option_id === "OP_7") {
    //     option_data.amount = 10;
    //   }
    //   // this.data_package[package_index].options[option_index].option_id

    //   //  this.data_package[package_index].option_list.filter((items)=> )
    // },

    checkOption(option_data, item_package) {
      if (option_data.option_id === "OP_1") {
        option_data.amount = 1;
      } else if (option_data.option_id === "OP_2") {
        option_data.amount = 4;
      } else if (option_data.option_id === "OP_3") {
        option_data.amount = 12;
      } else if (option_data.option_id === "OP_4") {
        option_data.amount = 24;
      } else if (option_data.option_id === "OP_5") {
        option_data.amount = 4;
      } else if (option_data.option_id === "OP_6") {
        option_data.amount = 8;
      } else if (option_data.option_id === "OP_7") {
        option_data.amount = 10;
      }

      let option_selected = [];

      item_package.options.forEach((option) => {
        const matchedOption = item_package.options.find(
          (opt) => opt.option_id === option.option_id
        );
        if (matchedOption) {
          option_selected.push(matchedOption);
        }
      });

      let option_ids = option_selected.map((option) => option.option_id);

      item_package.option_selected = [...option_ids];
    },
    checkPackage(package_data, packages) {
      let minimum_students_data = this.minimum_students;
      if (package_data === "PACK_1") {
        packages.students = 1;
        packages.minimum_students = 1;
      } else if (package_data === "PACK_2") {
        packages.students = 2;
        packages.minimum_students = 3;
      } else if (package_data === "PACK_3") {
        packages.students = 3;
        minimum_students_data = 3;
        packages.minimum_students = 3;
      }
      return { packages, minimum_students_data };
    },
    addOptions(data) {
      data.push({
        add_new_option: false,
        period_package: "",
        amount: 0,
        price_unit: 0,
        discount: false,
        discount_price: 0,
        option_description: "",
        net_price: 0,
        net_price_unit: 0,
      });
      // this.ChangeCourseData(this.course_data);
    },
    removeOptions(data, index, item_package) {
      data.splice(index, 1);
      item_package.option_selected.splice(index, 1);
      // this.ChangeCourseData(this.course_data);
    },
  },
};
</script>
<style></style>

<template>
  <v-app>
    <loading-overlay :loading="orders_is_loadings"></loading-overlay>
    <!-- v-if="!orders_is_loading" -->
    <v-container>
      <v-row>
        <v-col cols="6" sm="6" align="start">
          <headerPage :title="$t('finance')"></headerPage>
        </v-col>
        <v-col cols="6" sm="6" align="end">
          <v-btn
            depressed
            color="#ff6b81"
            class="white--text"
            @click="ShowDialogExport"
            >{{ $t("export") }}</v-btn
          >
        </v-col>
      </v-row>
      <v-row dense class="mb-3">
        <v-col cols="6" sm="6" align="start"> </v-col>
        <v-col cols="12" sm="6" align="end">
          <v-text-field
            hide-details
            dense
            outlined
            :placeholder="$t('search order number')"
            v-model="search_filter"
            color="#ff6b81"
            append-outer-icon="mdi-magnify"
            @click:append-outer="clickTab(search_filter)"
            @keyup.enter="clickTab(search_filter)"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row dense class="mb-3">
        <!-- บน -->
        <v-col cols="12" sm="6" @click="(tab_selected = ''), clickTab()">
          <img-card
            :class="
              tab_selected === ''
                ? 'img-card-active cursor-pointer drop-shadow-lg'
                : 'cursor-pointer drop-shadow-lg'
            "
            style="border-radius: 16px"
          >
            <template v-slot:img>
              <v-img
                max-height="90"
                max-width="70"
                src="@/assets/course/all_course.png"
              ></v-img>
            </template>
            <template v-slot:header>
              <div class="font-bold">{{ $t("all") }}</div>
            </template>
            <template v-slot:detail>
              <v-row class="d-flex align-end">
                <v-col align="center" class="text-3xl font-bold">
                  {{ orders.amount ? orders.amount : 0 }}
                </v-col>
                <v-col class="text-sm">{{ $t("list") }}</v-col>
              </v-row>
            </template>
          </img-card>
        </v-col>
        <v-col cols="12" sm="6" @click="(tab_selected = 'success'), clickTab()">
          <img-card
            class="cursor-pointer drop-shadow-lg"
            :class="tab_selected === 'success' ? 'img-card-active' : ''"
            style="border-radius: 16px"
          >
            <template v-slot:img>
              <v-img
                max-height="90"
                max-width="70"
                src="@/assets/course/file_money.png"
              ></v-img>
            </template>
            <template v-slot:header>
              <div class="font-bold">{{ $t("paid") }}</div>
            </template>
            <template v-slot:detail>
              <v-row class="d-flex align-end">
                <v-col align="center" class="text-3xl font-bold">
                  {{ orders.amountSuccess ? orders.amountSuccess : 0 }}
                </v-col>
                <v-col class="text-sm">{{ $t("list") }}</v-col>
              </v-row>
            </template>
          </img-card>
        </v-col>

        <!-- ล่าง -->
        <!-- TAB 3-->
        <v-col cols="12" sm="4" @click="(tab_selected = 'pending'), clickTab()">
          <img-card
            class="cursor-pointer drop-shadow-lg"
            :class="tab_selected === 'pending' ? 'img-card-active' : ''"
            style="border-radius: 16px"
          >
            <template v-slot:img>
              <v-img
                max-height="90"
                max-width="70"
                src="@/assets/course/short_course.png"
              ></v-img>
            </template>
            <template v-slot:header>
              <div class="font-bold">{{ $t("pending") }}</div>
            </template>
            <template v-slot:detail>
              <v-row class="d-flex align-end">
                <v-col align="center" class="text-3xl font-bold">
                  {{ orders.amountPending ? orders.amountPending : 0 }}
                </v-col>
                <v-col class="text-sm">{{ $t("list") }}</v-col>
              </v-row>
            </template>
          </img-card>
        </v-col>
        <!-- TAB 4 reject-->
        <v-col cols="12" sm="4" @click="(tab_selected = 'cancel'), clickTab()">
          <img-card
            class="cursor-pointer drop-shadow-lg"
            :class="tab_selected === 'cancel' ? 'img-card-active' : ''"
            style="border-radius: 16px"
          >
            <template v-slot:img>
              <v-img
                max-height="90"
                max-width="70"
                src="@/assets/leave/cancel.png"
              ></v-img>
            </template>

            <template v-slot:header>
              <div class="font-bold">{{ $t("cancel") }}</div>
            </template>
            <template v-slot:detail>
              <v-row class="d-flex align-end">
                <v-col align="center" class="text-3xl font-bold">
                  {{ orders.amountCancel ? orders.amountCancel : 0 }}
                </v-col>
                <v-col class="text-sm">{{ $t("list") }}</v-col>
              </v-row>
            </template>
          </img-card>
        </v-col>

        <!-- TAB 5 cancel-->
        <v-col cols="12" sm="4" @click="(tab_selected = 'fail'), clickTab()">
          <img-card
            class="cursor-pointer drop-shadow-lg"
            :class="tab_selected === 'fail' ? 'img-card-active' : ''"
            style="border-radius: 16px"
          >
            <template v-slot:img>
              <v-img
                max-height="90"
                max-width="70"
                src="@/assets/finance/fail.png"
              ></v-img>
            </template>

            <template v-slot:header>
              <div class="font-bold">{{ $t("fail") }}</div>
            </template>
            <template v-slot:detail>
              <v-row class="d-flex align-end">
                <v-col align="center" class="text-3xl font-bold">
                  {{ orders.amountFail ? orders.amountFail : 0 }}
                </v-col>
                <v-col class="text-sm">{{ $t("list") }}</v-col>
              </v-row>
            </template>
          </img-card>
        </v-col>
      </v-row>
      <v-data-table
        v-model="selected"
        :headers="columns"
        :items="orders.financeList"
        item-key="order_number"
        show-select
        class="elevation-1 header-table"
        :items-per-page="itemsPerPage"
        :server-items-length="search_bool ? orders.totalRows : orders.count"
        :options.sync="options"
        ref="orders"
        :footer-props="{
          'disable-pagination': disable_pagination_btn,
          'items-per-page-options': [10, 20, 30, 40, 50],
          'items-per-page-text': 'Rows per page:',
        }"
      >
        <template v-slot:[`item.total_price`]="{ item }">
          {{
            item.total_price.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })
          }}
        </template>
        <template v-slot:[`item.paid_date`]="{ item }">
          {{
            item.paid_date ? GenDate(item.paid_date) + " " + item.paid_time : ""
          }}
        </template>
        <template v-slot:[`item.updated_date`]="{ item }">
          <!-- <pre>{{ item }}</pre> -->
          {{
            item.cancel_date
              ? GenDate(item.cancel_date) + " " + item.cancel_time
              : ""
          }}
        </template>
        <template v-slot:[`item.payment_status`]="{ item }">
          <div
            class="d-flex align-center pa-1 rounded-lg"
            :class="
              item.payment_status === 'pending'
                ? 'bg-[#FFF9E8] text-[#FCC419]'
                : item.payment_status === 'success'
                ? 'bg-[#F0F9EE] text-[#58A144]'
                : item.payment_status === 'cancel'
                ? 'bg-[#e8e8e8] text-[#636363]'
                : item.payment_status === 'fail'
                ? 'bg-[#F4CCCC] text-[#F03D3E]'
                : ''
            "
          >
            <span class="w-full text-center">{{
              $t(item.payment_status)
            }}</span>
          </div>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            text
            class="underline"
            color="#FF6B81"
            @click="
              $router.push({
                name: 'Finance_orderID',
                params: { order_id: item.order_number },
              })
            "
            >{{ $t("see more") }}</v-btn
          >
        </template>
        <template v-slot:[`item.created_date`]="{ item }">
          <!-- {{ new Date(item.created_date).toLocaleDateString() }} -->
          {{
            new Date(item.created_date).toLocaleDateString(
              $i18n.locale == "th" ? "th-TH" : "en-US",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            )
          }}
        </template>
        <template v-slot:[`no-results`]>
          <div class="font-bold">
            {{ $t("no data found in table") }}
          </div>
        </template>
        <template v-slot:no-data>
          <div class="font-bold">
            {{ $t("no data found in table") }}
          </div>
        </template>
      </v-data-table>
      <!-- DIALOG -->
      <v-dialog v-model="show_dialog">
        <v-card class="pa-3">
          <v-row>
            <v-col cols="12" align="right">
              <v-btn icon @click="closeDialog()">
                <v-icon color="#ff6b81">mdi-close</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-card-title>
            <v-row dense>
              <v-col cols="12" align="center" class="font-semibold">{{
                $t("export")
              }}</v-col>
            </v-row>
          </v-card-title>
          <!-- รายละเอียดคอร์สเรียน -->
          <headerCard :title="$t('course details')"></headerCard>
          <v-card-text class="py-0">
            <v-divider class="mb-3"></v-divider>
            <!-- 1 -->
            <v-row dense>
              <!-- ชื่อผู้เรียน -->
              <v-col cols="12" sm="6">
                <label-custom :text="$t('student name')"></label-custom>
                <v-autocomplete
                  dense
                  v-model="export_filter.students"
                  :items="username_list"
                  :search-input.sync="search_student"
                  @input="search_student = null"
                  multiple
                  item-text="fullname"
                  item-value="userOneId"
                  class="py-1"
                  :label="$t('please enter the student name')"
                  outlined
                  color="#FF6B81"
                  item-color="#FF6B81"
                >
                  <template v-slot:no-data>
                    <v-list-item>
                      <v-list-item-title>
                        {{ $t("no data found") }}
                      </v-list-item-title>
                    </v-list-item>
                  </template>
                  <template v-slot:selection="data">
                    <v-chip
                      v-bind="data.attrs"
                      :input-value="data.selected"
                      color="#FBF3F5"
                    >
                      {{
                        $i18n.locale == "th"
                          ? `${data.item.firstNameTh} ${data.item.lastNameTh}`
                          : `${data.item.firstNameEng} ${data.item.lastNameEng}`
                      }}
                      <v-icon
                        @click="remove(data.item.userOneId)"
                        color="#ff6b81"
                        >mdi-close-circle</v-icon
                      >
                    </v-chip>
                  </template>
                  <template v-slot:item="{ item }">
                    {{
                      $i18n.locale == "th"
                        ? `${item.firstNameTh} ${item.lastNameTh}`
                        : `${item.firstNameEng} ${item.lastNameEng}`
                    }}
                  </template>
                </v-autocomplete>
              </v-col>
              <!-- สถานะการชำเงิน -->
              <v-col cols="12" sm="6">
                <label-custom :text="$t('payment status')"></label-custom>
                <v-autocomplete
                  dense
                  class="py-1"
                  :items="statusPayment"
                  :item-text="
                    $i18n.locale == 'th' ? 'namePayment' : 'namePaymentEn'
                  "
                  item-value="valuePayment"
                  :label="$t('please select a status')"
                  outlined
                  color="#FF6B81"
                  item-color="#FF6B81"
                  v-model="export_filter.payment_status"
                  multiple
                  hide-details
                >
                  <template v-slot:selection="{ item, index }">
                    <v-chip dark v-if="index === 0" color="#FF6B81">
                      <span>{{
                        $i18n.locale == "th"
                          ? item.namePayment
                          : item.namePaymentEn
                      }}</span>
                    </v-chip>
                    <span v-if="index === 1" class="grey--text text-caption">
                      (+{{ export_filter.payment_status.length - 1 }}
                      {{ $t("others") }} )
                    </span>
                  </template>
                </v-autocomplete>
              </v-col>
            </v-row>
            <!-- 2 -->
            <v-row dense>
              <!-- ประเภทการชำระเงิน -->
              <v-col cols="12" sm="6">
                <label-custom :text="$t('payment type')"></label-custom>
                <v-autocomplete
                  dense
                  :items="typeOfPayment"
                  :item-text="$i18n.locale == 'th' ? 'name' : 'nameEn'"
                  item-value="value"
                  v-model="export_filter.payment_type"
                  :label="$t('please select a payment type')"
                  outlined
                  multiple
                  hide-details
                  class="py-1"
                  color="#FF6B81"
                  item-color="#FF6B81"
                >
                  <template v-slot:selection="{ item, index }">
                    <v-chip dark v-if="index === 0" color="#FF6B81">
                      <span>{{
                        $i18n.locale == "th" ? item.name : item.nameEn
                      }}</span>
                    </v-chip>
                    <span v-if="index === 1" class="grey--text text-caption">
                      (+{{ export_filter.payment_type.length - 1 }}
                      {{ $t("others") }})
                    </span>
                  </template>
                </v-autocomplete>
              </v-col>
              <!-- ชื่อคอร์ส -->
              <v-col cols="12" sm="6">
                <label-custom :text="$t('course name')"></label-custom>
                <v-autocomplete
                  dense
                  :items="courses"
                  :item-text="$i18n.locale == 'th' ? 'course_th' : 'course_en'"
                  item-value="course_id"
                  v-model="export_filter.course_id"
                  :label="$t('please select a course')"
                  outlined
                  multiple
                  hide-details
                  class="py-1"
                  color="#FF6B81"
                  item-color="#FF6B81"
                >
                  <template v-slot:selection="{ item, index }">
                    <v-chip dark v-if="index === 0" color="#FF6B81">
                      <span>{{
                        $i18n.locale == "th" ? item.course_th : item.course_en
                      }}</span>
                    </v-chip>
                    <span v-if="index === 1" class="grey--text text-caption">
                      (+{{ export_filter.course_id.length - 1 }}
                      {{ $t("others") }})
                    </span>
                  </template>
                </v-autocomplete>
              </v-col>
            </v-row>
            <!-- 3 -->
            <v-row dense>
              <!-- ประเภทคอร์ส -->
              <v-col cols="12" sm="6">
                <label-custom :text="$t('course type')"></label-custom>
                <v-autocomplete
                  dense
                  class="py-1"
                  :items="courseType"
                  :item-text="$i18n.locale == 'th' ? 'typeName' : 'typeNameEn'"
                  item-value="typeOfValue"
                  v-model="export_filter.course_type_id"
                  :label="$t('please select a course type')"
                  outlined
                  multiple
                  color="#FF6B81"
                  item-color="#FF6B81"
                  @input="setCourseType()"
                >
                  <template v-slot:selection="{ item, index }">
                    <v-chip dark v-if="index === 0" color="#FF6B81">
                      <span>{{ item.typeName }}</span>
                    </v-chip>
                    <span v-if="index === 1" class="grey--text text-caption">
                      (+{{ export_filter.course_type_id.length - 1 }}
                      {{ $t("Others") }})
                    </span>
                  </template>
                </v-autocomplete>
              </v-col>
              <v-col cols="12" sm="6">
                <v-row dense>
                  <!-- แพ็กเกจ -->
                  <v-col cols="12" sm="6" md="6">
                    <label-custom :text="$t('package')"></label-custom>
                    <v-autocomplete
                      dense
                      :items="packages"
                      item-text="packageName"
                      item-value="packageId"
                      v-model="export_filter.package_id"
                      class="py-1"
                      :label="$t('please select a package')"
                      outlined
                      multiple
                      color="#FF6B81"
                      item-color="#FF6B81"
                      :disabled="disableExportpackage"
                    >
                      <template v-slot:selection="{ item, index }">
                        <v-chip dark v-if="index === 0" color="#FF6B81">
                          <span>{{ item.packageName }}</span>
                        </v-chip>
                        <span
                          v-if="index === 1"
                          class="grey--text text-caption"
                        >
                          (+{{ export_filter.package_id.length - 1 }}
                          {{ $t("others") }})
                        </span>
                      </template>
                    </v-autocomplete>
                  </v-col>
                  <!-- ระยะเวลาคอร์ส -->
                  <v-col cols="12" sm="6" md="6">
                    <label-custom :text="$t('period')"></label-custom>
                    <v-autocomplete
                      dense
                      :items="options_data"
                      :item-text="
                        $i18n.locale == 'th' ? 'optionName' : 'optionNameEn'
                      "
                      item-value="optionId"
                      v-model="export_filter.option_id"
                      class="py-1"
                      :label="$t('please select a period')"
                      outlined
                      multiple
                      color="#FF6B81"
                      item-color="#FF6B81"
                      :disabled="disableExportpackage"
                    >
                      <template v-slot:selection="{ item, index }">
                        <v-chip dark v-if="index === 0" color="#FF6B81">
                          <span>{{
                            $i18n.locale == "th"
                              ? item.optionName
                              : item.optionNameEn
                          }}</span>
                        </v-chip>
                        <span
                          v-if="index === 1"
                          class="grey--text text-caption"
                        >
                          (+{{ export_filter.option_id.length - 1 }}
                          {{ $t("others") }})
                        </span>
                      </template>
                    </v-autocomplete>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-card-text>
          <!-- รายละเอียดการชำระเงิน -->
          <headerCard :title="$t('peyment detail55')"></headerCard>
          <v-card-text class="py-0">
            <v-divider class="mb-3"></v-divider>
            <!-- วันที่สร้างเอกสาร -->
            <v-row dense>
              <v-col cols="12">
                <label-custom :text="$t('order number')"></label-custom>
                <v-combobox
                  v-model="export_filter.order_number"
                  :items="export_filter.order_number"
                  :placeholder="$t('please enter order number')"
                  outlined
                  dense
                  multiple
                  chips
                  clearable
                  color="#FF6B81"
                  item-color="#FF6B81"
                >
                  <template v-slot:selection="{ item }">
                    <v-chip dark color="#FF6B81">
                      <span>{{ item }}</span>
                    </v-chip>
                    <!-- <span v-if="index === 1" class="grey--text text-caption">
                      (+{{ export_filter.course_type_id.length - 1 }}
                      {{ $t("Others") }})
                    </span> -->
                  </template>
                </v-combobox>
                <!-- <v-text-field
                  :label="$t('please enter order number')"
                  outlined
                  v-ship
                  dense
                  v-model="export_filter.order_number"
                >
                </v-text-field> -->
              </v-col>
            </v-row>
            <v-row dense>
              <v-col cols="12" sm="6">
                <v-row>
                  <v-col cols="12" sm="6">
                    <label-custom :text="$t('created date')"></label-custom>
                    <v-menu
                      v-model="export_filter.select_date_doc_start"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          dense
                          :value="
                            !export_filter.date_doc_start
                              ? export_filter.date_doc_start
                              : GenDate(export_filter.date_doc_start)
                          "
                          :label="$t('please select a start date')"
                          outlined
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                          color="#FF6B81"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        :max="today"
                        v-model="export_filter.date_doc_start"
                        @input="export_filter.select_date_doc_start = false"
                        :locale="$i18n.locale == 'th' ? 'th-TH' : 'en-US'"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>

                  <v-col cols="12" sm="6">
                    <label-custom :text="$t('to')"></label-custom>
                    <v-menu
                      v-model="export_filter.select_date_doc_end"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          dense
                          :value="
                            !export_filter.date_doc_end
                              ? export_filter.date_doc_end
                              : GenDate(export_filter.date_doc_end)
                          "
                          :label="$t('please select an end date')"
                          outlined
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                          color="#FF6B81"
                          :disabled="!export_filter.date_doc_start"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="export_filter.date_doc_end"
                        @input="export_filter.select_date_doc_end = false"
                        :min="export_filter.date_doc_start"
                        :max="today"
                        :locale="$i18n.locale == 'th' ? 'th-TH' : 'en-US'"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                </v-row>
              </v-col>

              <!-- วันที่ชำระ -->
              <v-col cols="12" sm="6">
                <v-row>
                  <v-col cols="12" sm="6">
                    <label-custom :text="$t('payment date')"></label-custom>
                    <v-menu
                      v-model="export_filter.select_date_pay_start"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          dense
                          :value="
                            !export_filter.date_pay_start
                              ? export_filter.date_pay_start
                              : GenDate(export_filter.date_pay_start)
                          "
                          :label="$t('please select a start date')"
                          outlined
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                          color="#FF6B81"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        :max="today"
                        v-model="export_filter.date_pay_start"
                        @input="export_filter.select_date_pay_start = false"
                        locale="th-TH"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>

                  <v-col cols="12" sm="6">
                    <label-custom :text="$t('to')"></label-custom>

                    <v-menu
                      v-model="export_filter.select_date_pay_end"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          dense
                          :value="
                            !export_filter.date_pay_end
                              ? export_filter.date_pay_end
                              : GenDate(export_filter.date_pay_end)
                          "
                          :label="$t('please select an end date')"
                          outlined
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                          color="#FF6B81"
                          :disabled="!export_filter.date_pay_start"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="export_filter.date_pay_end"
                        @input="export_filter.select_date_pay_end = false"
                        :min="export_filter.date_pay_start"
                        :max="today"
                        :locale="$i18n.locale == 'th' ? 'th-TH' : 'en-US'"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row dense>
              <v-col cols="12" sm="6">
                <label-custom :text="$t('service value')"></label-custom>
                <v-text-field
                  :label="$t('please enter the service value start')"
                  outlined
                  dense
                  type="number"
                  v-model="export_filter.service_charge_start"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <label-custom :text="$t('to')"></label-custom>
                <v-text-field
                  :label="$t('please enter the service value end')"
                  outlined
                  dense
                  type="number"
                  v-model="export_filter.service_charge_end"
                >
                </v-text-field>
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-text
            class="py-0"
            v-if="
              export_filter.date_pay_start != '' ||
              export_filter.date_doc_end != '' ||
              export_filter.date_pay_start != '' ||
              export_filter.date_pay_end != ''
            "
          >
            <div class="mdi mdi-chat-alert">
              {{
                $t(
                  "you can choose to fill in only the items you want to export"
                )
              }}
            </div>
          </v-card-text>

          <!-- BUTTON -->
          <v-card-text class="py-0">
            <v-row dense>
              <v-col cols="12" sm="6"></v-col>
              <v-col cols="12" sm="6">
                <v-row>
                  <v-col cols="12" sm="8" align="end">
                    <v-btn depressed @click="clearDateExport()">{{
                      $t("clear data")
                    }}</v-btn></v-col
                  >
                  <v-col cols="12" sm="4" align="end">
                    <v-btn
                      :loading="finance_filter_loading"
                      depressed
                      dark
                      color="#ff6b81"
                      @click="Export()"
                    >
                      {{ $t("view all") }}
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-container>
  </v-app>
</template>
<script>
import imgCard from "@/components/course/imgCard.vue";
import headerPage from "@/components/header/headerPage.vue";
import headerCard from "@/components/header/headerCard.vue";
import LabelCustom from "@/components/label/labelCustom.vue";
import { dateFormatter } from "@/functions/functions";
import loadingOverlay from "@/components/loading/loadingOverlay.vue";
import { mapActions, mapGetters } from "vuex";
export default {
  name: "financeList",
  components: {
    headerPage,
    imgCard,
    headerCard,
    LabelCustom,
    loadingOverlay,
  },
  data: () => ({
    search_bool: false,
    search_filter: "",
    today: new Date().toISOString(),
    search_student: null,
    show_dialog: false,
    statusPayment: [
      {
        namePayment: "ชำระแล้ว",
        namePaymentEn: "Paid",
        valuePayment: "success",
      },
      {
        namePayment: "รอดำเนินการ",
        namePaymentEn: "Pending",
        valuePayment: "pending",
      },
      {
        namePayment: "ยกเลิก",
        namePaymentEn: "Cancel",
        valuePayment: "cancel",
      },
    ],
    typeOfPayment: [
      { name: "เงินสด", nameEn: "Cash", value: "cash" },
      {
        name: "บัตรเครดิต / เดบิต",
        nameEn: "Credit Card",
        value: "Credit Card",
      },
      { name: "โอนเงินเข้าบัญชี", nameEn: "Transfer", value: "transfer" },
    ],
    courseName: [],
    courseType: [
      {
        typeName: "คอร์สทั่วไป",
        typeNameEn: "General course",
        typeOfValue: "CT_1",
      },
      {
        typeName: "คอร์สระยะสั้น",
        typeNameEn: "Short course",
        typeOfValue: "CT_2",
      },
    ],
    export_filter: {
      course_id: [],
      course_type_id: [],
      students: [],
      payment_type: [],
      payment_status: [],
      option_id: "",
      package_id: [],
      order_number: [],
      select_date_doc_start: false,
      select_date_doc_end: false,
      date_doc_start: "",
      date_doc_end: "",
      select_date_pay_start: false,
      select_date_pay_end: false,
      date_pay_start: "",
      date_pay_end: "",
      service_charge_start: "",
      service_charge_end: "",
    },
    disableExportpackage: false,
    selectDate: true,
    open_date: "",
    closeModal: true,
    selected: [],
    tab: "all",
    items: ["ทั้งหมด", "ชำระเงินแล้ว", "รอดำเนินการ"],
    options: {},
    tab_selected: "",
    tabs_temp: "",
    tabs_change: false,
    disable_pagination_btn: false,
    orders_is_loadings: true,
    page: 1,
    itemsPerPage: 10,
    text_temp: "",
    text_change: false,
  }),
  watch: {
    options: {
      handler() {
        this.loadItems();
      },
    },

    search_student(val) {
      if (val.length > 3) {
        this.loading = true;
        this.searchNameUser({ search_name: val }).then(() => {
          this.loading = false;
        });
      }
    },
  },
  created() {
    this.GetCoursesList();
    this.GetOptions();
    this.GetPackages();
    // this.GetOrders();
  },
  computed: {
    ...mapGetters({
      orders: "OrderModules/getOrders",
      orders_is_loading: "OrderModules/getOrdersIsLoading",
      courses: "CourseModules/getCourses",
      students: "OrderModules/getStudents",
      username_list: "loginModules/getUsernameList",
      packages: "CourseModules/getPackages",
      options_data: "CourseModules/getOptions",
      finance_filter: "FinanceModules/getFinanceFilter",
      finance_filter_loading: "FinanceModules/getFinanceLoading",
      filter_finance_data: "OrderModules/getFilterFinanceData",
    }),
    columns() {
      return [
        {
          text: this.$t("order number"),
          align: "start",
          sortable: false,
          value: "order_number",
          width: 150,
        },
        {
          text: this.$t("first name - last name student"),
          align: "start",
          sortable: false,
          value: this.$i18n.locale == "th" ? "student_name" : "student_name_en",
        },
        {
          text: this.$t("course name"),
          align: "start",
          sortable: false,
          value: this.$i18n.locale == "th" ? "course_nameTh" : "course_nameEn",
        },
        {
          text: this.$t("price"),
          align: "start",
          sortable: false,
          value: "total_price",
        },
        {
          text: this.$t("payment status"),
          align: "start",
          sortable: false,
          value: "payment_status",
        },
        {
          text: this.$t("created date"),
          align: "start",
          sortable: false,
          value: "created_date",
        },
        {
          text: this.$t("payment date"),
          align: "start",
          sortable: false,
          value: "paid_date",
        },

        {
          text: this.$t("canceled date"),
          align: "start",
          sortable: false,
          value: "updated_date",
        },
        { text: "", align: "start", value: "actions", sortable: false },
      ];
    },
  },
  methods: {
    ...mapActions({
      GetOrders: "OrderModules/GetOrders",
      GetCoursesList: "CourseModules/GetCoursesList",
      GetOptions: "CourseModules/GetOptions",
      GetPackages: "CourseModules/GetPackages",
      financeFilter: "FinanceModules/financeFilter",
      searchNameUser: "loginModules/searchNameUser",
      FilterFinanceData: "OrderModules/FilterFinanceData",
    }),
    GenDate(date) {
      return new Date(date).toLocaleDateString(
        this.$i18n.locale == "th" ? "th-TH" : "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      );
    },
    remove(item) {
      for (let i = 0; i < this.export_filter.students.length; i++) {
        if (this.export_filter.students[i] == item) {
          this.export_filter.students.splice(i, 1);
        }
      }
    },
    ShowDialogExport() {
      this.export_filter.course_id = [];
      this.export_filter.course_type_id = [];
      this.export_filter.students = [];
      this.export_filter.payment_type = [];
      this.export_filter.payment_status = [];
      this.export_filter.order_number = [];
      this.selected.forEach((order) => {
        if (!this.export_filter.course_id.includes(order.course_id)) {
          this.export_filter.course_id.push(order.course_id);
        }
        if (!this.export_filter.course_type_id.includes(order.course_type_id)) {
          this.export_filter.course_type_id.push(order.course_type_id);
        }
        if (!this.export_filter.payment_type.includes(order.payment_type)) {
          this.export_filter.payment_type.push(order.payment_type);
        }
        if (!this.export_filter.payment_status.includes(order.payment_status)) {
          this.export_filter.payment_status.push(order.payment_status);
        }
        if (!this.export_filter.order_number.includes(order.order_number)) {
          this.export_filter.order_number.push(order.order_number);
          console.log(
            "this.export_filter.order_number :>> ",
            this.export_filter.order_number
          );
        }
      });
      this.show_dialog = true;
    },
    genPrice(price) {
      return price.toLocaleString();
    },
    setCourseType() {
      if (
        this.export_filter.course_type_id.length === 1 &&
        this.export_filter.course_type_id.includes("CT_2")
      ) {
        this.disableExportpackage = true;
      } else {
        this.disableExportpackage = false;
      }
    },
    inputDate(e, data) {
      switch (data) {
        case "course open":
          this.open_date = dateFormatter(e, "DD MT YYYYT");
          break;
        case "register start date":
          this.register_date_range_str.start_date = dateFormatter(
            e,
            "DD MT YYYYT"
          );
          break;
        case "register end date":
          this.register_date_range_str.end_date = dateFormatter(
            e,
            "DD MT YYYYT"
          );
          break;
        case "class start date":
          this.class_date_range_str.start_date = dateFormatter(
            e,
            "DD MT YYYYT"
          );
          break;
        case "class end date":
          this.class_date_range_str.end_date = dateFormatter(e, "DD MT YYYYT");
          break;
      }
    },
    Export() {
      this.financeFilter({ filter: this.export_filter });
    },
    closeDialog() {
      this.show_dialog = false;
      this.clearDateExport();
    },
    clearDateExport() {
      this.export_filter = {
        course_id: [],
        course_type_id: [],
        students: [],
        payment_type: [],
        payment_status: [],
        option_id: [],
        package_id: [],
        select_date_doc_start: false,
        select_date_doc_end: false,
        date_doc_start: "",
        date_doc_end: "",
        select_date_pay_start: false,
        select_date_pay_end: false,
        date_pay_start: "",
        date_pay_end: "",
        service_charge_start: "",
        service_charge_end: "",
      };
    },
    async clickTab() {
      this.search_bool = true;
      if (this.tabs_temp !== this.tab_selected) {
        this.tabs_change = true;
      }
      if (this.text_temp !== this.search_filter) {
        this.text_change = true;
      }
      await this.loadItems(this.tab_selected);
    },

    async loadItems(status) {
      this.tab_selected =
        !status || status === ""
          ? this.tab_selected === ""
            ? ""
            : this.tab_selected
          : status;

      if (this.tabs_temp !== this.tab_selected) {
        this.tabs_change = true;
      }
      this.tabs_temp = this.tab_selected;

      if (this.text_temp !== this.search_filter) {
        this.text_change = true;
      }
      this.text_temp = this.search_filter;

      this.orders_is_loadings = true;
      await this.moreData(this.tab_selected);
      this.orders_is_loadings = false;
    },

    async moreData(status) {
      let { page, itemsPerPage } = this.options;
      this.disable_pagination_btn = true;
      this.orders.financeList = [];
      this.orders_is_loadings = true;
      await this.FilterFinanceData({
        name: this.search_filter,
        limit: this.search_filter
          ? this.text_change
            ? 10
            : itemsPerPage
          : this.tabs_change
          ? 10
          : itemsPerPage,

        page: this.search_filter
          ? this.text_change
            ? 1
            : page
          : this.tabs_change
          ? 1
          : page,
        // limit: itemsPerPage,

        // page: this.tabs_change ? 1 : page,
        // page: page,
        status: status,
      });

      if (this.tabs_change) {
        this.$refs.orders.$props.options.page = 1;
        this.$refs.orders.$props.options.itemsPerPage = 10;
      }
      if (this.text_change) {
        this.$refs.orders.$props.options.page = 1;
        this.$refs.orders.$props.options.itemsPerPage = 10;
      }

      this.disable_pagination_btn = false;
      this.tabs_change = false;
      this.text_change = false;
      // this.orders_is_loadings = false;
    },
  },
};
</script>

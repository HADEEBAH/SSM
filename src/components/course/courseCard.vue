<template>
  <div>
    <!-- Upload file -->
    <v-card class="mx-3" flat>
      <v-card-text
        class="border-dashed border-2 rounded-lg"
        style="border: dashed rgb(255, 107, 129)"
      >
        <v-row v-if="preview_url || course_data.courseImg">
          <v-col align="center" class="rounded-lg pa-0 my-3">
            <v-img
              :src="preview_url ? preview_url : course_data.courseImg"
              style="max-width: 500px"
              :aspect-ratio="16 / 9"
              class="rounded-lg"
              align="right"
            >
              <v-btn
                v-if="!disable"
                icon
                class="bg-[#f00]"
                dark
                @click="removeFile"
                ><v-icon>mdi-close</v-icon></v-btn
              >
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular
                    indeterminate
                    color="#ff6b81"
                  ></v-progress-circular>
                </v-row>
              </template>
            </v-img>
          </v-col>
        </v-row>
        <v-row v-if="!preview_url && !course_data.courseImg">
          <v-col cols="12" class="flex align-center justify-center">
            <v-img
              src="@/assets/course/upload_file.png"
              max-height="105"
              max-width="122"
            ></v-img>
          </v-col>
          <v-col cols="12" class="flex align-center justify-center text-h5">
            {{ $t("upload the cover image of the course") }}
          </v-col>
          <v-col
            cols="12"
            class="flex align-center justify-center text-caption"
          >
            (
            {{
              $t(
                "suggestion : Should upload an image with size 1024 x 576 (16:9) and file size not over 5 Mb must be JPG, PNG file"
              )
            }}
            )
          </v-col>
          <v-col
            cols="12"
            class="flex align-center justify-center text-caption"
          >
          </v-col>
          <v-col cols="12" class="flex align-center justify-center">
            <v-btn
              outlined
              color="#ff6b81"
              @click="openFileSelector"
              :disabled="disable"
              >{{ $t("select file") }}</v-btn
            >
            <input
              ref="fileInput"
              type="file"
              accept="image/png, image/jpeg"
              @change="uploadFile"
              id="course_img"
              style="display: none"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <!-- Detail -->
    <v-card flat>
      <headerCard :title="$t('details')"></headerCard>
      <v-card-text class="py-0">
        <v-divider class="mb-3"></v-divider>
        <v-row dense>
          <v-col cols="12" sm="6">
            <label-custom
              required
              :text="$t('course name (thai)')"
            ></label-custom>
            <!-- @keydown="inputName($event, 'th')" :rules="course_name_th"
            @paste="preventPaste" -->
            <!-- @change="ChangeCourseData(course_data)" -->

            <v-text-field
              dense
              :disabled="disable"
              :outlined="!disable"
              :filled="disable"
              @focus="$event.target.select()"
              v-model="course_data.course_name_th"
              :placeholder="$t('specify the course name (thai)')"
              :error-messages="
                getErrorMessage(course_data.course_name_th, 'thai')
              "
              color="#ff6b81"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <label-custom
              required
              :text="$t('course name (english)')"
            ></label-custom>
            <!-- :rules="course_name_en" -->
            <!-- @paste="preventPaste" @keydown="inputName($event, 'en-spcebar')"  -->
            <!-- @change="ChangeCourseData(course_data)" -->

            <v-text-field
              dense
              :disabled="disable"
              :outlined="!disable"
              :filled="disable"
              @focus="$event.target.select()"
              v-model="course_data.course_name_en"
              :placeholder="$t('specify the course name (english)')"
              color="#ff6b81"
              :error-messages="
                getErrorMessage(course_data.course_name_en, 'english')
              "
            ></v-text-field>
          </v-col>
        </v-row>
        <!-- @change="ChangeCourseData(course_data)" -->

        <v-row dense>
          <v-col cols="12" sm="6">
            <label-custom required :text="$t('wls name')"></label-custom>
            <v-autocomplete
              dense
              :rules="kingdom"
              v-model="course_data.category_id"
              color="#FF6B81"
              :items="categorys"
              :item-text="
                $i18n.locale == 'th' ? 'categoryNameTh' : 'categoryNameEng'
              "
              item-value="categoryId"
              item-color="#ff6b81"
              :disabled="disable"
              :outlined="!disable"
              :filled="disable"
              :placeholder="$t('specify wls name')"
            >
              <template v-slot:no-data>
                <v-list-item>
                  <v-list-item-title
                    >{{ $t("no data found") }}
                  </v-list-item-title>
                </v-list-item>
              </template>
              <template v-slot:item="{ item }">
                <v-list-item-content>
                  <v-list-item-title
                    ><span
                      :class="
                        course_data.category_id === item.categoryId
                          ? 'font-bold'
                          : ''
                      "
                      >{{
                        $i18n.locale == "th"
                          ? item.categoryNameTh
                          : item.categoryNameEng
                      }}</span
                    ></v-list-item-title
                  >
                </v-list-item-content>
                <v-list-item-action>
                  <v-icon v-if="course_data.category_id === item.categoryId"
                    >mdi-check-circle</v-icon
                  >
                </v-list-item-action>
              </template>
            </v-autocomplete>
          </v-col>
          <v-col cols="12" sm="6" v-if="course_data.course_type_id === 'CT_1'">
            <label-custom
              required
              :text="$t('course opening date')"
            ></label-custom>
            <!-- <v-menu
              :disabled="disable"
              v-model="course_data.menu_course_open_date"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  dense
                  :disabled="disable"
                  :outlined="!disable"
                  :filled="disable"
                  v-model="course_data.course_open_date_str"
                  readonly
                  :rules="course_open_date"
                  :placeholder="$t('specify the course opening date')"
                  @change="ChangeCourseData(course_data)"
                  v-bind="attrs"
                  v-on="on"
                  color="#ff6b81"
                >
                  <template v-slot:append>
                    <v-icon
                      :color="course_data.course_open_date ? '#FF6B81' : ''"
                      >mdi-calendar</v-icon
                    >
                  </template>
                </v-text-field>
              </template>
              <v-date-picker
                :min="today.toISOString()"
                v-model="course_data.course_open_date"
                @input="inputDate($event, 'course open')"
                locale="th-TH"
              ></v-date-picker>
            </v-menu> -->

            <v-menu
              :disabled="disable"
              v-model="menu_course_open_date"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  dense
                  :disabled="disable"
                  :outlined="!disable"
                  :filled="disable"
                  v-model="course_data.course_open_date_str"
                  readonly
                  :rules="course_open_date_rules"
                  :placeholder="$t('specify the course opening date')"
                  v-bind="attrs"
                  v-on="on"
                  color="#ff6b81"
                >
                  <template v-slot:append>
                    <v-icon
                      :color="course_data.course_open_date ? '#FF6B81' : ''"
                      >mdi-calendar</v-icon
                    >
                  </template>
                </v-text-field>
              </template>
              <v-date-picker
                :min="today.toISOString()"
                v-model="course_open_date"
                @input="
                  inputDate(
                    course_open_date,
                    'course open',
                    (menu_course_open_date = false)
                  )
                "
                locale="th-TH"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="12" sm="6">
            <label-custom
              required
              :text="$t('class hours/time')"
            ></label-custom>
            <div>
              <v-text-field
                :disabled="disable"
                :outlined="!disable"
                :filled="disable"
                dense
                :suffix="$t('hour')"
                :style="`width:${widthfull()}px;`"
                style="position: absolute; display: block; z-index: 4"
                @focus="SelectedStartDate($event, course_data.course_hours)"
                :rules="course_hours"
                v-model="course_data.course_hours"
              >
              </v-text-field>
              <VueTimepicker
                class="time-picker-hidden"
                hide-clear-button
                advanced-keyboard
                :style="`width:${widthfull()}px;`"
                v-model="course_data.course_hour_time"
                @change="
                  ChangeHours(
                    course_data.course_hour_time,
                    course_data.course_hours
                  )
                "
              >
              </VueTimepicker>
            </div>
          </v-col>
          <v-col cols="12" sm="6">
            <label-custom required :text="$t('study place')"></label-custom>
            <v-text-field
              dense
              :disabled="disable"
              :outlined="!disable"
              :filled="disable"
              @focus="$event.target.select()"
              :rules="location"
              v-model="course_data.location"
              :placeholder="$t('specify the place of study')"
              color="#ff6b81"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" v-if="course_data.course_type_id === 'CT_2'">
            <label-custom
              required
              :text="$t('accepted students/time')"
            ></label-custom>
            <v-text-field
              dense
              :rules="student_recived"
              :disabled="disable"
              :outlined="!disable"
              :filled="disable"
              type="number"
              @focus="$event.target.select()"
              v-model="course_data.student_recived"
              :placeholder="$t('specify students who can accept')"
              color="#ff6b81"
            ></v-text-field>
          </v-col>
        </v-row>
        <!-- Course Type  :: general course -->
        <!-- @text-change="ChangeCourseData(course_data)" -->

        <template v-if="course_data.course_type_id === 'CT_1'">
          <v-row dense>
            <!-- :placeholder="
                  course_data.description
                    ? ''
                    : $t('enter course details') + '...'
                " -->
            <v-col cols="12">
              <label-custom :text="$t('course details')"></label-custom>
              <vue-editor
                :editorToolbar="customToolbar"
                :disabled="disable"
                v-model="course_data.description"
              ></vue-editor>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12">
              <!-- :placeholder="
                  course_data.music_performance
                    ? ''
                    : $t('enter details') + '...'
                " -->
              <label-custom :text="'Performance'"></label-custom>
              <vue-editor
                :editorToolbar="customToolbar"
                :disabled="disable"
                @text-change="ChangeCourseData(course_data)"
                v-model="course_data.music_performance"
              ></vue-editor>
            </v-col>
          </v-row>
          <!-- @text-change="ChangeCourseData(course_data)" -->

          <v-row dense>
            <v-col cols="12">
              <!-- :placeholder="
                  course_data.certification ? '' : $t('enter details') + '...'
                " -->
              <label-custom :text="'Certification'"></label-custom>
              <vue-editor
                :editorToolbar="customToolbar"
                :disabled="disable"
                v-model="course_data.certification"
              ></vue-editor>
            </v-col>
          </v-row>
        </template>
        <!-- Course Type  :: short course -->
        <template v-if="course_data.course_type_id === 'CT_2'">
          <v-row dense>
            <!-- @change="ChangeCourseData(course_data)" -->

            <v-col cols="12" sm="6">
              <label-custom required :text="$t('coach')"></label-custom>
              <v-autocomplete
                dense
                :rules="coach"
                v-model="course_data.coach_id"
                color="#FF6B81"
                :items="coachs"
                item-value="accountId"
                :item-text="$i18n.locale == 'th' ? 'fullNameTh' : 'fullNameEh'"
                item-color="#ff6b81"
                :disabled="disable"
                :outlined="!disable"
                :filled="disable"
                :placeholder="$t('specify coach')"
              >
                <template v-slot:no-data>
                  <v-list-item>
                    <v-list-item-title>
                      {{ $t("no data found") }}
                    </v-list-item-title>
                  </v-list-item>
                </template>
                <template v-slot:item="{ item }">
                  <v-list-item-content>
                    <v-list-item-title
                      ><span
                        :class="
                          course_data.coach_id === item.accountId
                            ? 'font-bold'
                            : ''
                        "
                        >{{
                          $i18n.locale == "th"
                            ? `${item.firstNameTh} ${item.lastNameTh}`
                            : `${item.firstNameEng} ${item.lastNameEng}`
                        }}</span
                      ></v-list-item-title
                    >
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-icon v-if="course_data.coach_id === item.accountId"
                      >mdi-check-circle</v-icon
                    >
                  </v-list-item-action>
                </template>
              </v-autocomplete>
            </v-col>
            <!-- @change="ChangeCourseData(course_data)" -->

            <v-col cols="12" sm="6">
              <label-custom
                required
                :text="`${$t('price')}/${$t('person')}`"
              ></label-custom>
              <v-text-field
                :placeholder="$t('specify price')"
                dense
                :rules="price"
                :disabled="disable"
                :outlined="!disable"
                :filled="disable"
                @focus="$event.target.select()"
                class="input-text-right"
                type="number"
                v-model="course_data.course_price"
                color="#FF6B81"
              >
              </v-text-field>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col align-self="start">
              <v-checkbox
                v-model="course_data.checked_discount"
                :label="$t('there is a discount')"
                :disabled="disable"
                @click="ckeckClick(course_data.checked_discount)"
                color="#FF6B81"
              ></v-checkbox>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col v-if="course_data.checked_discount">
              <v-text-field
                :placeholder="$t('specify discount/baht')"
                dense
                class="input-text-right"
                :disabled="disable"
                :rules="rulesDiscount"
                :min="1"
                :max="
                  checkMaxPrice(
                    course_data.discount_price,
                    course_data.course_price
                  )
                "
                outlined
                type="number"
                v-model="course_data.discount_price"
                color="#FF6B81"
              >
              </v-text-field
            ></v-col>
          </v-row>
        </template>
      </v-card-text>
      <!-- @focus="$event.target.select()" -->
      <!-- Course Type  :: short course -->
      <template v-if="course_data.course_type_id === 'CT_2'">
        <headerCard :title="$t('date and time')"></headerCard>
        <v-card-text class="py-0">
          <v-divider class="mb-3"></v-divider>
          <v-row dense>
            <v-col cols="12" sm="6">
              <label-custom
                required
                :text="$t('admission date')"
              ></label-custom>
              <v-row>
                <v-col>
                  <v-menu
                    :disabled="disable"
                    v-model="course_data.course_register_date.menu_start_date"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        dense
                        :disabled="disable"
                        :outlined="!disable"
                        :filled="disable"
                        :rules="start_date"
                        v-model="
                          course_data.course_register_date.start_date_str
                        "
                        readonly
                        :placeholder="$t('choose start date')"
                        v-bind="attrs"
                        v-on="on"
                        color="#FF6B81"
                      >
                        <template v-slot:append>
                          <v-icon
                            :color="
                              course_data.course_register_date
                                .start_date_formatted
                                ? '#FF6B81'
                                : ''
                            "
                            >mdi-calendar</v-icon
                          >
                        </template>
                      </v-text-field>
                    </template>
                    <v-date-picker
                      @input="inputDate($event, 'register start date')"
                      @change="StartDateRegisCourse(course_data)"
                      :min="today.toISOString()"
                      v-model="
                        course_data.course_register_date.start_date_formatted
                      "
                      locale="th-TH"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="auto" class="mt-2 px-0"
                  ><v-icon>mdi-minus</v-icon></v-col
                >
                <v-col>
                  <v-menu
                    :disabled="
                      disable ||
                      !course_data.course_register_date.start_date_formatted
                    "
                    v-model="course_data.course_register_date.menu_end_date"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <!-- @change="ChangeCourseData(course_data)" -->

                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        dense
                        :disabled="
                          disable ||
                          !course_data.course_register_date.start_date_formatted
                        "
                        :outlined="!disable"
                        :filled="disable"
                        :rules="end_date"
                        :placeholder="$t('choose an end date')"
                        v-model="course_data.course_register_date.end_date_str"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        color="#FF6B81"
                      >
                        <template v-slot:append>
                          <v-icon
                            :color="
                              course_data.course_register_date
                                .end_date_formatted
                                ? '#FF6B81'
                                : ''
                            "
                            >mdi-calendar</v-icon
                          >
                        </template>
                      </v-text-field>
                    </template>
                    <v-date-picker
                      :min="
                        course_data.course_register_date.start_date_formatted
                          ? course_data.course_register_date
                              .start_date_formatted
                          : today.toISOString()
                      "
                      @input="inputDate($event, 'register end date')"
                      v-model="
                        course_data.course_register_date.end_date_formatted
                      "
                      locale="th-TH"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" sm="6">
              <label-custom required :text="$t('teaching day')"></label-custom>
              <v-autocomplete
                dense
                :disabled="disable"
                :outlined="!disable"
                :filled="disable"
                chips
                :rules="class_date"
                deletable-chips
                item-color="#ff6b81"
                multiple
                color="#FF6B81"
                :items="days_confix"
                :item-text="$i18n.locale == 'th' ? 'label' : 'label_en'"
                item-value="value"
                :placeholder="$t('please select a teaching date')"
                v-model="course_data.teach_day"
              >
                <template v-slot:selection="{ attrs, item, selected }">
                  <v-chip
                    :disabled="disable"
                    v-bind="attrs"
                    :input-value="selected"
                    close
                    small
                    color="#ffeeee"
                    text-color="#ff6b81"
                    @click:close="removeChip(item, course_data.teach_day)"
                  >
                    <strong>{{
                      $i18n.locale == "th" ? item.label : item.label_en
                    }}</strong>
                  </v-chip>
                </template>
              </v-autocomplete>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12" sm="6" class="pr-2">
              <label-custom required :text="$t('class date')"></label-custom>
              <v-row>
                <v-col>
                  <v-menu
                    :disabled="disable"
                    v-model="course_data.course_study_date.menu_start_date"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        dense
                        :disabled="disable"
                        :outlined="!disable"
                        :filled="disable"
                        :rules="start_date"
                        :placeholder="$t('choose start date')"
                        v-model="course_data.course_study_date.start_date_str"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        color="#FF6B81"
                      >
                        <template v-slot:append>
                          <v-icon
                            :color="
                              course_data.course_study_date.start_date_formatted
                                ? '#FF6B81'
                                : ''
                            "
                            >mdi-calendar</v-icon
                          >
                        </template>
                      </v-text-field>
                    </template>
                    <v-date-picker
                      :min="
                        course_data.course_register_date.end_date_formatted
                          ? course_data.course_register_date.end_date_formatted
                          : today.toISOString()
                      "
                      @change="StartDateStudyCourse(course_data)"
                      @input="inputDate($event, 'class start date')"
                      v-model="
                        course_data.course_study_date.start_date_formatted
                      "
                      :locale="$i18n.locale == 'th' ? 'th-TH' : 'en-US'"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="auto" class="mt-2 px-0"
                  ><v-icon>mdi-minus</v-icon></v-col
                >
                <v-col>
                  <v-menu
                    v-model="course_data.course_study_date.menu_end_date"
                    :disabled="
                      disable ||
                      !course_data.course_study_date.start_date_formatted
                    "
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <!-- @change="ChangeCourseData(course_data)" -->
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        dense
                        :disabled="
                          disable ||
                          !course_data.course_study_date.start_date_formatted
                        "
                        :outlined="!disable"
                        :filled="disable"
                        :rules="end_date"
                        v-model="course_data.course_study_date.end_date_str"
                        readonly
                        :placeholder="$t('choose an end date')"
                        v-bind="attrs"
                        v-on="on"
                        color="#FF6B81"
                      >
                        <template v-slot:append>
                          <v-icon
                            :color="
                              course_data.course_study_date.end_date_formatted
                                ? '#FF6B81'
                                : ''
                            "
                            >mdi-calendar</v-icon
                          >
                        </template>
                      </v-text-field>
                    </template>
                    <v-date-picker
                      :min="
                        course_data.course_study_date.start_date_formatted
                          ? course_data.course_study_date.start_date_formatted
                          : today.toISOString()
                      "
                      @input="inputDate($event, 'class end date')"
                      v-model="course_data.course_study_date.end_date_formatted"
                      :locale="$i18n.locale == 'th' ? 'th-TH' : 'en-US'"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" sm="6" class="px-0">
              <label-custom required :text="$t('class time')"></label-custom>
              <v-row>
                <!-- START -->
                <v-col cols="auto">
                  <v-text-field
                    :disabled="disable"
                    :outlined="!disable"
                    :filled="disable"
                    dense
                    :style="`width:${width()}px;`"
                    style="position: absolute; display: block; z-index: 4"
                    @focus="
                      SelectedStartDate(
                        $event,
                        course_data.course_study_time.start_time
                      )
                    "
                    :rules="start_time"
                    v-model="course_data.course_study_time.start_time"
                    color="#FF6B81"
                  >
                  </v-text-field>
                  <VueTimepicker
                    class="time-picker-hidden"
                    hide-clear-button
                    advanced-keyboard
                    :style="`width:${width()}px;`"
                    v-model="course_data.course_study_time.start_time_object"
                    @change="
                      ChangeStartDate(
                        course_data.course_study_time,
                        course_data
                      )
                    "
                    color="#FF6B81"
                  >
                  </VueTimepicker>
                </v-col>
                <v-col cols="auto" class="mt-2 px-0"
                  ><v-icon>mdi-minus</v-icon></v-col
                >
                <!-- END -->
                <v-col>
                  <v-text-field
                    disabled
                    :outlined="!disable"
                    :filled="disable"
                    dense
                    :style="`width:${width()}px;`"
                    style="position: absolute; display: block; z-index: 4"
                    :rules="end_time"
                    v-model="course_data.course_study_time.end_time"
                    color="#FF6B81"
                  >
                  </v-text-field>
                  <VueTimepicker
                    class="time-picker-hidden"
                    hide-clear-button
                    advanced-keyboard
                    v-model="course_data.course_study_time.end_time_object"
                    color="#FF6B81"
                  >
                  </VueTimepicker>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row dense>
            <!-- PERIOD -->
          </v-row>
          <!-- @change="ChangeCourseData(course_data)" -->

          <v-row dense>
            <v-col cols="12">
              <label-custom :text="$t('course details')"></label-custom>
              <v-textarea
                v-model="course_data.description"
                :disabled="disable"
                :outlined="!disable"
                :filled="disable"
                :placeholder="
                  course_data.description
                    ? ''
                    : $t('enter course details') + '...'
                "
                color="#FF6B81"
              ></v-textarea>
            </v-col>
          </v-row>
          <!-- @change="ChangeCourseData(course_data)" -->

          <v-row dense>
            <v-col cols="12">
              <label-custom :text="'Certification'"></label-custom>
              <v-textarea
                v-model="course_data.certification"
                :disabled="disable"
                :outlined="!disable"
                :filled="disable"
                :placeholder="$t('enter details') + '...'"
                color="#FF6B81"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-card-text>
      </template>
    </v-card>
    <v-card class="mx-3 mb-3" flat v-if="course_data.course_type_id === 'CT_2'">
      <headerCard title="Learning Journey"></headerCard>
      <!-- UPLOAD IMAGE/VDO -->
      <v-card-text class="border-dashed border-2 border-blue-600 rounded-lg">
        <v-row
          v-if="
            short_preview_artwork_files &&
            short_preview_artwork_files?.length > 0
          "
        >
          <v-col
            cols="6"
            sm="3"
            align="center"
            class="rounded-lg pa-2"
            v-for="(file, index) in short_preview_artwork_files"
            :key="index"
          >
            <div v-if="file?.artworkCourseId && file.filesType">
              <!-- VDO CARD -->
              <v-card
                width="100%"
                flat
                v-if="
                  file?.artworkCourseId &&
                  (file.filesType === 'video/mp4' ||
                    file.filesType === 'video/x-matroska')
                "
              >
                <v-btn
                  icon
                  small
                  class="bg-[#cdcdcd] absolute top-1 right-8 z-[4]"
                  dark
                  @click="showImageDialog(file)"
                  ><v-icon>mdi-eye</v-icon></v-btn
                >
                <v-btn
                  v-if="!disable"
                  icon
                  small
                  class="bg-[#f00] absolute top-1 right-0 z-[4]"
                  dark
                  @click="removeArtworkFileData(file, index)"
                  ><v-icon>mdi-close</v-icon></v-btn
                >
                <video
                  :src="file.attachmentUrl"
                  controls
                  width="100%"
                  style="max-width: 500px"
                  :aspect-ratio="16 / 9"
                  class="rounded-lg"
                  align="center"
                ></video>
              </v-card>
              <!-- IMAG CARD -->
              <v-card
                width="100%"
                flat
                v-if="
                  file?.artworkCourseId &&
                  (file.filesType === 'image/png' ||
                    file.filesType === 'image/jpeg')
                "
              >
                <v-btn
                  icon
                  small
                  class="bg-[#cdcdcd] absolute top-1 right-8 z-[4]"
                  dark
                  @click="showImageDialog(file)"
                  ><v-icon>mdi-eye</v-icon></v-btn
                >
                <v-btn
                  v-if="!disable"
                  icon
                  small
                  class="bg-[#f00] absolute top-1 right-0 z-[4]"
                  dark
                  @click="removeArtworkFileData(file, index)"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-img
                  :src="file.attachmentUrl"
                  style="max-width: 500px"
                  :aspect-ratio="16 / 9"
                  class="rounded-lg"
                  align="center"
                >
                  <template v-slot:placeholder>
                    <v-row
                      class="fill-height ma-0"
                      align="center"
                      justify="center"
                    >
                      <v-progress-circular
                        indeterminate
                        color="#ff6b81"
                      ></v-progress-circular>
                    </v-row>
                  </template>
                </v-img>
              </v-card>
            </div>
            <div v-else>
              <!-- VDO CARD -->
              <v-card
                width="100%"
                flat
                v-if="
                  file.type === 'video/mp4' || file.type === 'video/x-matroska'
                "
              >
                <v-btn
                  icon
                  small
                  class="bg-[#cdcdcd] absolute top-1 right-8 z-[4]"
                  dark
                  @click="showImageDialog(file)"
                  ><v-icon>mdi-eye</v-icon></v-btn
                >
                <v-btn
                  icon
                  small
                  class="bg-[#f00] absolute top-1 right-0 z-[4]"
                  dark
                  @click="removeArtworkFile(index)"
                  ><v-icon>mdi-close</v-icon></v-btn
                >
                <video
                  :src="file.url"
                  controls
                  width="100%"
                  style="max-width: 500px"
                  :aspect-ratio="16 / 9"
                  class="rounded-lg"
                  align="center"
                ></video>
              </v-card>
              <!-- IMAG CARD -->
              <v-card
                width="100%"
                flat
                v-if="file.type === 'image/png' || file.type === 'image/jpeg'"
              >
                <v-btn
                  icon
                  small
                  class="bg-[#cdcdcd] absolute top-1 right-8 z-[4]"
                  dark
                  @click="showImageDialog(file)"
                  ><v-icon>mdi-eye</v-icon></v-btn
                >
                <v-btn
                  icon
                  small
                  class="bg-[#f00] absolute top-1 right-0 z-[4]"
                  dark
                  @click="removeArtworkFile(index)"
                  ><v-icon>mdi-close</v-icon></v-btn
                >
                <v-img
                  :src="file.url"
                  style="max-width: 500px"
                  :aspect-ratio="16 / 9"
                  class="rounded-lg"
                  align="center"
                >
                  <template v-slot:placeholder>
                    <v-row
                      class="fill-height ma-0"
                      align="center"
                      justify="center"
                    >
                      <v-progress-circular
                        indeterminate
                        color="#ff6b81"
                      ></v-progress-circular>
                    </v-row>
                  </template>
                </v-img>
              </v-card>
            </div>
          </v-col>
        </v-row>
        <v-row
          v-if="
            !short_preview_artwork_files ||
            short_preview_artwork_files?.length == 0
          "
        >
          <v-col cols="6" sm="3" class="flex align-center justify-center">
            <v-img
              src="@/assets/course/upload_file.png"
              max-height="105"
              max-width="122"
            ></v-img>
          </v-col>
          <v-col cols="12" class="flex align-center justify-center text-h5">
            {{ $t("upload Learning Journey") }}
          </v-col>
          <v-col
            cols="12"
            class="flex align-center justify-center text-caption"
          >
            ({{
              $t(
                "suggestion : Should upload an image with size 1024 x 576 (16:9) and file size not over 5 Mb must be JPG, PNG file"
              )
            }})
          </v-col>
        </v-row>
        <v-row dense>
          <v-col align="center">
            <input
              id="fileInputArtwork"
              ref="fileInputArtwork"
              type="file"
              @change="previewArtWorkFile"
              accept="image/png, image/jpeg ,video/*"
              multiple
              style="display: none"
            />
            <v-btn
              outlined
              color="blue"
              @click="openFileArtworSelector"
              :disabled="disable"
              >{{ $t("select file") }}</v-btn
            >
          </v-col>
        </v-row>
      </v-card-text>
      <!-- UPDOAD LINK -->
      <v-card class="my-5 rounded-lg">
        <v-app-bar dark color="#FF6B81">
          <v-toolbar-title>{{ $t("add video link") }}</v-toolbar-title>

          <v-spacer></v-spacer>
        </v-app-bar>
        <!-- <iframe width="100%" height="100%" src="https://www.youtube.com/embed/KOFFt04zS6o?si=ahE26X4iqHEtMTAr&autoplay=1&mute=1" title="Zweed n&#39; Roll - ช่วงเวลา (A Moment) [Official Video]" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen allow="autoplay"></iframe> -->
        <v-card-text>
          <div
            v-for="(item_vdo, index_vdo) in course_data.art_work_link"
            :key="index_vdo"
          >
            <div v-if="item_vdo?.artworkCourseId">
              <v-row dense>
                <v-col cols="12" sm="4" align-self="center">
                  <v-text-field
                    :label="$t('link vdo')"
                    prepend-icon="mdi-youtube"
                    :color="item_vdo.attachmentCourse ? '#FF6B81' : ''"
                    v-model="item_vdo.attachmentCourse"
                    readonly
                  ></v-text-field>
                </v-col>
                <!-- <v-col></v-col> -->
                <!-- 2222 -->
                <v-col cols="12" sm="6" align="center">
                  <v-card
                    class="mt-auto"
                    v-if="item_vdo.attachmentCourse"
                    style="height: 80px; width: 160px"
                  >
                    <v-btn
                      icon
                      small
                      class="bg-[#cdcdcd] absolute top-2 right-3 z-[4]"
                      dark
                      @click="showImageDialog(item_vdo)"
                      ><v-icon>mdi-eye</v-icon></v-btn
                    >
                    <div
                      id="video"
                      style="height: 80px; width: 160px; object-fit: cover"
                      v-html="item_vdo.attachmentCourse"
                    ></div>
                  </v-card>
                </v-col>
                <!-- 3333 -->
                <v-col cols="12" sm="2" align-self="center" align="center">
                  <v-btn
                    text
                    @click="deleteLinkURL(item_vdo, index_vdo)"
                    color="red"
                    :disabled="disable"
                  >
                    <v-icon color="red">mdi-minus-circle</v-icon>
                    {{ $t("delete item") }}
                  </v-btn>
                </v-col>
              </v-row>
              <v-divider class="my-2"></v-divider>
            </div>
            <div v-else>
              <v-row dense>
                <!-- 1111 -->
                <v-col cols="12" sm="4" align-self="center">
                  <v-text-field
                    :label="$t('link vdo')"
                    prepend-icon="mdi-youtube"
                    color="#FF6B81"
                    v-model="item_vdo.url"
                    @input="validateData()"
                    :disabled="disable"
                  ></v-text-field>
                </v-col>
                <!-- 2222 -->
                <v-col cols="12" sm="6" align="center">
                  <v-card
                    class="mt-auto"
                    v-if="item_vdo.url"
                    style="height: 80px; width: 160px"
                  >
                    <v-btn
                      icon
                      small
                      class="bg-[#cdcdcd] absolute top-2 right-3 z-[4]"
                      dark
                      @click="showImageDialog(item_vdo)"
                      ><v-icon>mdi-eye</v-icon></v-btn
                    >
                    <div
                      id="video"
                      style="height: 80px; width: 160px; object-fit: cover"
                      v-html="item_vdo.url"
                    ></div>
                  </v-card>
                </v-col>
                <!-- 3333 -->
                <v-col cols="12" sm="2" align-self="center" align="center">
                  <v-btn
                    text
                    @click="deleteLink(index_vdo)"
                    color="red"
                    :disabled="disable"
                  >
                    <v-icon color="red">mdi-minus-circle</v-icon>
                    {{ $t("delete item") }}
                  </v-btn>
                </v-col>
              </v-row>
              <v-divider class="my-2"></v-divider>
            </div>
          </div>
          <div class="rounded-lg d-flex justify-center align-center my-3">
            <v-btn
              @click="addNewLink"
              outlined
              color="#ff6b81"
              class="rounded-lg"
              :disabled="disable"
            >
              <v-icon>mdi-plus-circle</v-icon>
              {{ $t("add item") }}
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-card>
    <!-- DIALOG SHOW IMAGE -->
    <!-- <v-dialog
      persistent
      :width="$vuetify.breakpoint.smAndUp ? '60vw' : ''"
      v-model="show_attachment_dialog"
    >
      <v-card>
        <v-container grid-list-xs>
          <v-row>
            <v-col cols="12" class="text-center">
              <v-btn
                icon
                class="bg-[#cdcdcd] absolute top-1 right-1"
                dark
                @click="show_attachment_dialog = !show_attachment_dialog"
                ><v-icon>mdi-close</v-icon></v-btn
              >
              <span class="font-weight-bold">{{ $t("image example") }} </span>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              IMAGE

              <v-img
                v-if="
                  typeImg === 'img' ||
                  typeImg === 'image/png' ||
                  typeImg === 'image/jpeg'
                "
                contain
                :src="biggesImage"
                class="rounded-lg"
                :style="
                  $vuetify.breakpoint.lgAndUp
                    ? 'height: 600px; width: 1000px; object-fit: cover; margin: auto;'
                    : $vuetify.breakpoint.mdAndUp
                    ? 'height: 1000px; width: 800px; object-fit: cover; margin: auto;'
                    : $vuetify.breakpoint.smAndUp
                    ? 'height: 800px; width: 600px; object-fit: cover; margin: auto;'
                    : 'object-fit: cover; margin: auto;'
                "
                :aspect-ratio="16 / 9"
              >
                <template v-slot:placeholder>
                  <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                  >
                    <v-progress-circular
                      indeterminate
                      color="#ff6b81"
                    ></v-progress-circular>
                  </v-row>
                </template>
              </v-img>
              VDO
              <video
                v-else-if="
                  typeImg === 'video' ||
                  typeImg === 'video/mp4' ||
                  typeImg === 'video/x-matroska'
                "
                class="rounded-lg d-flex justify-center align-center"
                :style="
                  $vuetify.breakpoint.lgAndUp
                    ? 'height: 600px; width: 1000px; object-fit: cover; margin: auto;'
                    : $vuetify.breakpoint.mdAndUp
                    ? 'height: 1000px; width: 800px; object-fit: cover; margin: auto;'
                    : $vuetify.breakpoint.smAndUp
                    ? 'height: 800px; width: 600px; object-fit: cover; margin: auto;'
                    : 'object-fit: cover; margin: auto;'
                "
                autoplay
                muted
                controls
                loop
              >
                <source :src="biggesImage" type="video/mp4" />
              </video>

              YOUTUBE
              <div
                v-else
                id="video"
                class="rounded-lg d-flex justify-center align-center"
                :aspect-ratio="16 / 9"
                :style="
                  $vuetify.breakpoint.lgAndUp
                    ? 'height: 600px; width: 1000px; object-fit: cover; margin: auto;'
                    : $vuetify.breakpoint.mdAndUp
                    ? 'height: 1000px; width: 800px; object-fit: cover; margin: auto;'
                    : $vuetify.breakpoint.smAndUp
                    ? 'height: 800px; width: 600px; object-fit: cover; margin: auto;'
                    : 'object-fit: cover; margin: auto;'
                "
                v-html="biggesImage"
              ></div>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog> -->

    <!-- IMAGE -->
    <v-dialog
      v-model="show_attachment_dialog"
      max-width="888.88px"
      v-if="
        typeImg === 'img' || typeImg === 'image/png' || typeImg === 'image/jpeg'
      "
    >
      <v-card>
        <!-- Close Button -->
        <v-btn
          icon
          small
          class="bg-[#f00] absolute top-2 right-2 z-[4]"
          dark
          @click="closeShowImage()"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>

        <!-- Window Container -->
        <v-window v-model="activeWindow">
          <v-window-item>
            <v-img
              :src="biggesImage"
              max-width="100%"
              max-height="80vh"
              contain
            >
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular
                    indeterminate
                    color="#ff6b81"
                  ></v-progress-circular>
                </v-row>
              </template>
            </v-img>
          </v-window-item>
        </v-window>
      </v-card>
    </v-dialog>
    <!-- VDO -->
    <v-dialog
      v-model="show_attachment_dialog"
      v-else-if="
        typeImg === 'video' ||
        typeImg === 'video/mp4' ||
        typeImg === 'video/x-matroska'
      "
      :width="$vuetify.breakpoint.smAndUp ? '888.88px' : ''"
    >
      <v-card>
        <v-carousel
          hide-delimiters
          :show-arrows="false"
          :height="$vuetify.breakpoint.smAndUp ? 'auto' : '100%'"
        >
          <v-btn
            icon
            small
            class="bg-[#f00] absolute top-2 right-2 z-[4]"
            dark
            @click="closeShowImage()"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-carousel-item>
            <!-- VDO -->
            <template
              v-if="
                typeImg === 'video' ||
                typeImg === 'video/mp4' ||
                typeImg === 'video/x-matroska'
              "
            >
              <video
                id="videoPlayer"
                width="100%"
                style="height: 100%; width: 100%"
                class="video-content"
                autoplay
                muted
                controls
                loop
              >
                <source :src="biggesImage" type="video/mp4" />
              </video>
            </template>
          </v-carousel-item>
        </v-carousel>
      </v-card>
    </v-dialog>
    <!-- YOUTUBE -->
    <div v-else>
      <!-- PHONE -->
      <v-dialog
        v-model="show_attachment_dialog"
        v-if="!$vuetify.breakpoint.smAndUp"
      >
        <v-card>
          <v-carousel hide-delimiters :show-arrows="false" height="200">
            <v-btn
              icon
              small
              class="bg-[#f00] absolute top-2 right-2 z-[4]"
              dark
              @click="closeShowImage()"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-carousel-item>
              <!-- youtube -->
              <template>
                <div
                  id="video"
                  style="height: 100%; width: 100%"
                  v-html="biggesImage"
                ></div>
              </template>
            </v-carousel-item>
          </v-carousel>
        </v-card>
      </v-dialog>
      <!-- PC -->
      <v-dialog v-model="show_attachment_dialog" v-else max-width="888.88px">
        <v-card>
          <v-carousel hide-delimiters :show-arrows="false">
            <v-btn
              icon
              small
              class="bg-[#f00] absolute top-2 right-2 z-[4]"
              dark
              @click="closeShowImage()"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-carousel-item>
              <!-- youtube -->
              <template>
                <div
                  id="video"
                  style="height: 100%; width: 100%"
                  v-html="biggesImage"
                ></div>
              </template>
            </v-carousel-item>
          </v-carousel>
        </v-card>
      </v-dialog>
    </div>

    <!-- RESERVE -->
    <v-card flat>
      <headerCard :title="$t('reservations')"></headerCard>
      <v-card-text class="py-0">
        <v-divider class="mb-3"></v-divider>
        <v-row dense>
          <v-col class="py-0">
            <v-checkbox
              v-model="course_data.reservation"
              :disabled="disable"
              @change="ChengeReservation($event)"
              :label="
                $t('course reservations open before the class start date')
              "
              color="#ff6b81"
            >
            </v-checkbox>
          </v-col>
        </v-row>
        <v-row v-if="course_data.reservation" dense>
          <v-col cols="12">
            <label-custom
              required
              :text="$t('reservation date range')"
            ></label-custom>
          </v-col>
          <v-col cols="12" sm="6" class="pt-0">
            <v-menu
              v-model="course_data.menu_reservation_start_date"
              :disabled="disable"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="course_data.reservation_start_date_str"
                  dense
                  :disabled="disable"
                  :outlined="!disable"
                  :filled="disable"
                  readonly
                  :placeholder="$t('please select a reservation start date')"
                  v-bind="attrs"
                  v-on="on"
                  color="#ff6b81"
                  :rules="reservation_start_date"
                >
                  <template v-slot:append>
                    <v-icon
                      :color="
                        course_data.reservation_start_date ? '#FF6B81' : ''
                      "
                      >mdi-calendar</v-icon
                    >
                  </template>
                </v-text-field>
              </template>
              <v-date-picker
                :min="today.toISOString()"
                v-model="course_data.reservation_start_date"
                @input="inputDate($event, 'reservation start')"
                locale="th-TH"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="12" sm="6" class="pt-0">
            <v-menu
              v-model="course_data.menu_reservation_end_date"
              :close-on-content-click="false"
              :disabled="disable"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="course_data.reservation_end_date_str"
                  :disabled="disable"
                  :outlined="!disable"
                  :filled="disable"
                  dense
                  readonly
                  :placeholder="$t('please select a reservation end date')"
                  v-bind="attrs"
                  v-on="on"
                  color="#ff6b81"
                  :rules="reservation_end_date"
                >
                  <template v-slot:append>
                    <v-icon
                      :color="course_data.reservation_end_date ? '#FF6B81' : ''"
                      >mdi-calendar</v-icon
                    >
                  </template>
                </v-text-field>
              </template>
              <v-date-picker
                :min="
                  course_data.reservation_start_date
                    ? course_data.reservation_start_date
                    : today.toISOString()
                "
                v-model="course_data.reservation_end_date"
                @input="inputDate($event, 'reservation end')"
                locale="th-TH"
              ></v-date-picker>
            </v-menu>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import LabelCustom from "@/components/label/labelCustom.vue";
import headerCard from "@/components/header/headerCard.vue";
import { mapGetters, mapMutations, mapActions } from "vuex";
import VueTimepicker from "vue2-timepicker/src/vue-timepicker.vue";
import Swal from "sweetalert2";
import {
  inputValidation,
  dateFormatter,
  CheckFileSize,
} from "@/functions/functions";
import { VueEditor } from "vue2-editor";
import moment from "moment";
export default {
  name: "courseCard",
  props: {
    coachs: { type: Array },
    categorys: { type: Array },
    disable: { type: Boolean, default: false },
    edited: { type: Boolean },
    course_type: { type: String },
  },
  components: {
    LabelCustom,
    headerCard,
    VueTimepicker,
    VueEditor,
  },
  data: () => ({
    today: new Date(),
    preview_url: null,
    days_confix: [
      { label: "วันอาทิตย์", label_en: "Sunday", value: 0 },
      { label: "วันจันทร์", label_en: "Monday", value: 1 },
      { label: "วันอังคาร", label_en: "Tuesday", value: 2 },
      { label: "วันพุธ", label_en: "Wednesday", value: 3 },
      { label: "วันพฤหัสบดี", label_en: "Thursday", value: 4 },
      { label: "วันศุกร์", label_en: "Friday", value: 5 },
      { label: "วันเสาร์", label_en: "Saturday", value: 6 },
    ],
    customToolbar: [
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
    ],
    course_open_date_str: "",
    register_date_range_str: {
      start_date: "",
      end_date: "",
    },
    class_date_range_str: {
      start_date: "",
      end_date: "",
    },
    menu_course_open_date: false,
    menu_course_register_start_date: false,
    course_open_date: null,
    register_course_start_date: null,
    short_preview_artwork_files: [],
    biggesImage: null,
    show_attachment_dialog: false,
    typeImg: null,
  }),
  destroyed() {
    this.ResetStateCourseData();
  },
  created() {
    if (this.edited) {
      this.preview_url = this.course_data?.courseImg
        ? this.course_data?.courseImg
        : null;
      this.class_date_range_str = {
        start_date: dateFormatter(
          // "2024-12-31 00:00:00",
          // "2024-12-15T17:00:00.000Z",
          this?.course_data?.course_study_date?.start_date,
          "DD MMT YYYYT"
        ),
        end_date: dateFormatter(
          // "2024-12-15T17:00:00.000Z",
          this.course_data?.course_study_date.end_date,
          "DD MMT YYYYT"
        ),
      };
      this.register_date_range_str = {
        start_date: dateFormatter(
          // "2024-12-10T17:00:00.000Z",
          this.course_data?.course_register_date.start_date,
          "DD MMT YYYYT"
        ),
        end_date: dateFormatter(
          // "2024-12-20T17:00:00.000Z",
          this.course_data?.course_register_date.end_date,
          "DD MMT YYYYT"
        ),
      };
    }
  },
  mounted() {},
  watch: {
    // course_data: function () {
    //   this.short_preview_artwork_files = [];
    //   this.preview_artwork_link = [];
    //   if (
    //     this.course_data?.art_work_image_video?.length > 0 ||
    //     this.course_data?.art_work_image_video !== null
    //   ) {
    //     this.short_preview_artwork_files =
    //       this.course_data.art_work_image_video;
    //   } else if (this.course_data?.art_work_link?.length > 0) {
    //     this.preview_artwork_link = this.course_data.art_work_link;
    //   }
    // },

    course_data: function () {
      this.short_preview_artwork_files = [];
      this.preview_artwork_link = [];

      if (
        this.course_data?.art_work_image_video?.length > 0 ||
        this.course_data?.art_work_image_video !== null
      ) {
        // Filter out empty objects from art_work_image_video
        this.short_preview_artwork_files =
          this.course_data.art_work_image_video.filter(
            (item) => Object.keys(item).length > 0
          );
      } else if (this.course_data?.art_work_link?.length > 0) {
        this.preview_artwork_link = this.course_data.art_work_link;
      }
    },
    // Watch for changes in start_time_object and update start_time
    "course_data.course_study_time.start_time_object": {
      deep: true,
      handler(newValue) {
        const { HH, mm } = newValue;
        this.course_data.course_study_time.start_time = `${HH}:${mm}`;
      },
    },
    // Watch for changes in start_time and update start_time_object
    "course_data.course_study_time.start_time": {
      handler(newValue) {
        const [HH, mm] = newValue.split(":");
        this.course_data.course_study_time.start_time_object = { HH, mm };
      },
    },
    // Watch for changes in end_time_object and update end_time
    "course_data.course_study_time.end_time_object": {
      deep: true,
      handler(newValue) {
        const { HH, mm } = newValue;
        this.course_data.course_study_time.end_time = `${HH}:${mm}`;
      },
    },
    // Watch for changes in end_time and update end_time_object
    "course_data.course_study_time.end_time": {
      handler(newValue) {
        const [HH, mm] = newValue.split(":");
        this.course_data.course_study_time.end_time_object = { HH, mm };
      },
    },
    disable: function () {
      if (this.edited) {
        if (this.disable) {
          this.preview_url = this.course_data.courseImg
            ? this.course_data.courseImg
            : null;
        }
      }
    },
    course_type: function () {
      this.preview_url = null;
      this.register_date_range_str.start_date = null;
      this.register_date_range_str.end_date = null;
      this.course_data.course_open_date_str = null;
      this.class_date_range_str.start_date = null;
      this.class_date_range_str.end_date = null;
      this.course_data.reservation = false;
      this.course_data.course_id = null;
      this.course_data.course_name_th = null;
      this.course_data.course_name_en = null;
      this.course_data.course_open_date = null;
      this.course_data.course_img = null;
      this.course_data.category_id = null;
      this.course_data.course_hours = 1.0;
      this.course_data.course_hour_time = {
        HH: "01",
        mm: "00",
      };
      this.course_data.location = null;
      this.course_data.description = null;
      this.course_data.music_performance = null;
      this.course_data.certification = null;
      this.course_data.menu_course_open_date = false;
      this.course_data.menu_reservation_start_date = null;
      this.course_data.menu_reservation_end_date = null;
      this.course_data.reservation_start_date_str = null;
      this.course_data.reservation_start_date = null;
      this.course_data.reservation_end_date_str = null;
      this.course_data.reservation_end_date = null;
      this.course_data.coach_id = null;
      this.course_data.student_recived = null;
      this.course_data.course_price = 0;
      this.course_data.checked_discount = false;
      this.course_data.discount_price = 0;
      this.course_data.course_register_date = {
        start_date: null,
        menu_start_date: false,
        end_date: null,
        menu_end_date: false,
      };
      this.course_data.course_study_date = {
        start_time: "",
        start_time_object: { HH: "", mm: "" },
        menu_start_time: false,
        end_time: "",
        end_time_object: { HH: "", mm: "" },
        menu_end_time: false,
      };
      this.course_data.course_study_time = {
        start_time: "",
        start_time_object: { HH: "", mm: "" },
        end_time: "",
        end_time_object: { HH: "", mm: "" },
      };
      this.course_data.teach_day = [];
    },
  },
  computed: {
    ...mapGetters({
      // course_data: "CourseModules/getCourseData",
      course_data: "CourseModules/getCoursesData",
    }),

    courseDataProcessed() {
      if (this.course_data.course_type_id === "CT_2") {
        return {
          ...this.course_data,
          coachs: [
            {
              course_id: null,
              coach_id: null,
              course_coach_id: null,
              coach_name: null,
              teach_day_data: [
                {
                  day_of_week_id: null,
                  class_open: false,
                  teach_day: [],
                  course_coach_id: null,
                  class_date: [
                    {
                      start_time: null,
                      class_date_range: {
                        time_id: null,
                        day_of_week_id: null,
                        start_time: null,
                        start_time_object: {
                          HH: null,
                          mm: null,
                        },
                        menu_start_time: false,
                        end_time: null,
                        end_time_object: {
                          HH: null,
                          mm: null,
                        },
                        menu_end_time: false,
                      },
                      students: 0,
                    },
                  ],
                },
              ],
            },
          ],
        };
      } else if (this.course_data.course_type_id === "CT_1") {
        return {
          course_id: null,
          course_name_th: null,
          course_name_en: null,
          course_open_date: null,
          course_type_id: "CT_1",
          location: null,
          detail: null,
          music_performance: null,
          certification: null,
          course_image: null,
          course_hours: 1.0,
          category_id: null,
          courseImg: null,
          menu_course_open_date: false,
          menu_reservation_start_date: null,
          menu_reservation_end_date: null,
          reservation_start_date_str: null,
          reservation_start_date: null,
          course_hour_time: {
            HH: null,
            mm: null,
          },
          course_open_date_str: null,
        };
      }
      return this.course_data;
    },

    isButtonDisabled() {
      // Disable the button if either input has an error
      !this.course_data.course_name_th && !this.course_data.course_name_en;

      return (
        this.getErrorMessage(this.course_data.course_name_th, "thai").length >
          0 ||
        this.getErrorMessage(this.course_data.course_name_en, "english")
          .length > 0 ||
        !this.course_data.course_name_th.trim()?.length > 0 ||
        !this.course_data.course_name_en.trim()?.length > 0
      );
    },

    course_name_th() {
      return [
        (val) =>
          (val || "").length > 0 ||
          this.$t("please specify the course name (thai)"),
        (val) =>
          val.length < 256 ||
          this.$t("the course name (thai) is longer than the specified length"),
      ];
    },
    course_name_en() {
      return [
        (val) =>
          (val || "").length > 0 ||
          this.$t("please specify the course name (english)"),
        (val) =>
          val.length < 256 ||
          this.$t(
            "the course name (english) is longer than the specified length"
          ),
      ];
    },
    kingdom() {
      return [
        (val) => (val || "").length > 0 || this.$t("please select a wls"),
      ];
    },
    course_open_date_rules() {
      return [
        (val) =>
          (val || "").length > 0 ||
          this.$t("please select a course opening date"),
      ];
    },
    reservation_start_date() {
      return [
        (val) =>
          (val || "").length > 0 ||
          this.$t("please select a reservation start date"),
      ];
    },
    reservation_end_date() {
      return [
        (val) =>
          (val || "").length > 0 ||
          this.$t("please select a reservation end date"),
      ];
    },
    course_hours() {
      return [
        (val) => (val || "") > 0 || this.$t("please specify class hours/time"),
        (val) => val < 25 || this.$t("excessive study hours"),
      ];
    },
    location() {
      return [
        (val) => (val || "").length > 0 || this.$t("please specify a location"),
      ];
    },
    class_date() {
      return [
        (val) =>
          (val || "").length > 0 || this.$t("please select a teaching date"),
      ];
    },
    coach() {
      return [
        (val) => (val || "").length > 0 || this.$t("please specify a coach"),
      ];
    },
    start_date() {
      return [
        (val) =>
          (val || "").length > 0 || this.$t("please select a start date"),
      ];
    },
    end_date() {
      return [
        (val) => (val || "").length > 0 || this.$t("please select an end date"),
      ];
    },
    start_time() {
      return [
        (val) =>
          (val || "").length == 5 || this.$t("please select a start time"),
      ];
    },
    end_time() {
      return [
        (val) =>
          (val || "").length == 5 || this.$t("please select an end time"),
      ];
    },
    student_recived() {
      return [
        (val) =>
          val > 0 || this.$t("please specify students who can be accepted"),
        (val) =>
          val < 1000 || this.$t("students who can accept more than the limit"),
      ];
    },
    price() {
      return [(val) => val > 0 || this.$t("please specify price")];
    },
    rulesDiscount() {
      return [
        () =>
          this.course_data.discount_price !== "" ||
          this.$t("please fill out the information correctly"),
        () =>
          parseInt(this.course_data.discount_price) <
            this.course_data.course_price ||
          `${this.$t("number must be lest than")} ${
            this.course_data.course_price
          }`,
        () =>
          parseInt(this.course_data.discount_price) >= 1 ||
          this.$t("number must be 1"),
      ];
    },
  },
  methods: {
    ...mapMutations({
      ResetStateCourseData: "CourseModules/ResetStateCourseData",
    }),
    ...mapActions({
      RemoveArkworkByArkworkId: "CourseModules/RemoveArkworkByArkworkId",
    }),

    async deleteLinkURL(item_vdo, index_vdo) {
      Swal.fire({
        icon: "question",
        title: this.$t("do you want to delete this file?"),
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: this.$t("agree"),
        cancelButtonText: this.$t("no"),
      }).then(async (result) => {
        if (result.isConfirmed) {
          await this.RemoveArkworkByArkworkId({
            artwork_data: item_vdo,
            course_id: this.$route.params.course_id,
          }).then(async () => {
            this.course_data?.art_work_link?.splice(index_vdo, 1);
            // await this.course_created_data.artwork_file.splice(index_vdo, 1);

            if (this.course_data.art_work_link?.length <= 0) {
              this.addNewLink();
            }
          });
        }
      });
    },

    async removeArtworkFileData(item_vdo, index_vdo) {
      Swal.fire({
        icon: "question",
        title: this.$t("do you want to delete this file?"),
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: this.$t("agree"),
        cancelButtonText: this.$t("no"),
      }).then(async (result) => {
        if (result.isConfirmed) {
          await this.RemoveArkworkByArkworkId({
            artwork_data: item_vdo,
            course_id: this.$route.params.course_id,
          }).then(async () => {
            await this.course_data.art_work_image_video.splice(index_vdo, 1);
            this.short_preview_artwork_files.splice(index_vdo, 1);

            // this.course_data?.art_work_image_video?.splice(index_vdo, 1);
            // await this.short_preview_artwork_files?.splice(index_vdo, 1);
          });
        }
      });
    },

    openFileArtworSelector() {
      this.$refs.fileInputArtwork.value = null;
      this.$refs.fileInputArtwork.click();
    },

    previewArtWorkFile(event) {
      let accept = event.target.accept.split(",");
      const selectedFiles = event.target.files;
      const fileUrls = [];
      let type_file = [];
      for (let type of accept) {
        type_file.push(type.split("/")[0]);
      }

      for (let i = 0; i < selectedFiles.length; i++) {
        let file_type = selectedFiles[i].type.split("/");

        if (type_file.includes(file_type[0])) {
          if (CheckFileSize(selectedFiles[i], event.target.id) === true) {
            // this.course_data.artwork_file.push(selectedFiles[i]);
            this.course_data?.art_work_image_video?.push(selectedFiles[i]);

            const file = selectedFiles[i];

            const reader = new FileReader();
            reader.onload = () => {
              fileUrls.push({
                url: reader.result,
                type: file.type, // Store the file type
              });
              if (fileUrls.length == selectedFiles.length) {
                this.short_preview_artwork_files = [
                  ...this.short_preview_artwork_files,
                  ...fileUrls,
                ];
                // this.course_data.art_work_image_video =
                //   this.short_preview_artwork_files;
              }
            };
            reader.readAsDataURL(file);
          }
        } else {
          Swal.fire({
            icon: "error",
            title: this.$t("please upload only photo and video files"),
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        }
      }
    },

    // REMOVE

    // async previewArtWorkFile(event) {
    //   const accept = event.target.accept.split(",");
    //   const selectedFiles = event.target.files;
    //   const fileUrls = [];
    //   const type_file = accept.map((type) => type.split("/")[0]);

    //   for (let i = 0; i < selectedFiles.length; i++) {
    //     const file_type = selectedFiles[i].type.split("/");

    //     if (type_file.includes(file_type[0])) {
    //       if (await CheckFileSize(selectedFiles[i], event.target.id)) {
    //         const file = selectedFiles[i];
    //         this.course_data.art_work_image_video.push(file);

    //         const reader = new FileReader();
    //         reader.onload = () => {
    //           fileUrls.push({
    //             url: reader.result,
    //             type: file.type, // Store the file type
    //           });

    //           if (fileUrls.length === selectedFiles.length) {
    //             this.short_preview_artwork_files = [
    //               ...this.short_preview_artwork_files,
    //               ...fileUrls,
    //             ];
    //           }
    //         };
    //         reader.readAsDataURL(file);
    //       }
    //     } else {
    //       Swal.fire({
    //         icon: "error",
    //         title: this.$t("please upload only photo and video files"),
    //         timer: 3000,
    //         timerProgressBar: true,
    //         showCancelButton: false,
    //         showConfirmButton: false,
    //       });
    //     }
    //   }
    // },
    async removeArtworkFile(index) {
      await this?.course_data?.art_work_image_video?.splice(index, 1);
      this?.short_preview_artwork_files?.splice(index, 1);
    },

    addNewLink() {
      this.course_data.art_work_link.push({
        url: null,
      });
    },
    async deleteLink(index_vdo) {
      await this.course_data.art_work_link.splice(index_vdo, 1);
      if (this.course_data.art_work_link?.length <= 0) {
        this.addNewLink();
      }
    },

    showImageDialog(item) {
      this.biggesImage = item.url
        ? item.url
        : item.attachmentUrl
        ? item.attachmentUrl
        : item.attachmentCourse
        ? item.attachmentCourse
        : item;
      this.typeImg = item.type ? item.type : item.filesType;
      this.show_attachment_dialog = true;
    },

    closeShowImage() {
      this.show_attachment_dialog = false;
      this.typeImg = null;
      this.biggesImage = null;
    },

    validateData() {
      try {
        const urlVideo = this.course_data.art_work_link?.map((item) => {
          return item.url ? item.url : item;
        });
        if (urlVideo) {
          const validUrl = this.course_data.art_work_link?.map((item) => {
            const regexYoutubeIframeUrl =
              /<iframe.*?src="https:\/\/www\.youtube\.com\/embed\/.*?".*?><\/iframe>/i;
            const match = item.url
              ? item.url?.match(regexYoutubeIframeUrl)
              : item;
            return match;
          });
          if (validUrl) {
            this.course_data.art_work_link?.map((item) => {
              const urlVDO = this.updateIframeSize(item.url);
              const urlUpdate = this.updateIframeSrc(urlVDO);
              item.url = urlUpdate;
              return item.url;
            });
            // this.submitCreateEmbed();
          }
        }
      } catch (error) {
        console.log("error :>> ", error);
      }
    },
    updateIframeSize(urlVideo) {
      try {
        const widthRegex = /width="\d+"/;
        const heightRegex = /height="\d+"/;

        const updatedWidth = `width="100%"`;
        const updatedHeight = `height="100%"`;

        let updatedUrlVideo = urlVideo.replace(widthRegex, updatedWidth);
        updatedUrlVideo = updatedUrlVideo.replace(heightRegex, updatedHeight);

        return updatedUrlVideo;
      } catch (error) {
        console.log("error :>> ", error);
      }
    },
    updateIframeSrc(urlVideo) {
      try {
        const srcPattern =
          /src="(https:\/\/www\.youtube\.com\/embed\/[^\s?"]+)(\?[^"]*)?"/;
        const match = urlVideo.match(srcPattern);

        if (!match) {
          return urlVideo;
        }

        const baseUrl = match[1];
        const queryParams = match[2] || "";

        if (
          queryParams.includes("autoplay=1") &&
          queryParams.includes("mute=1")
        ) {
          return urlVideo;
        }

        const newUrl = `${baseUrl}${
          queryParams ? `${queryParams}&` : "?"
        }autoplay=1&mute=1`;

        return urlVideo.replace(srcPattern, `src="${newUrl}"`);
      } catch (error) {
        console.log("error :>> ", error);
      }
    },

    // formattedStartTime: {
    //   get() {
    //     return this.course_data.course_study_time.start_time;
    //   },
    //   set(value) {
    //     // Update the text value and synchronize with the object
    //     this.course_data.course_study_time.start_time = value;

    //     const [HH, mm] = value.split(":");
    //     this.course_data.course_study_time.start_time_object = { HH, mm };
    //   },
    // },

    ckeckClick(item) {
      if (item == false) {
        this.course_data.discount_price = 0;
      }
    },
    checkMaxPrice(discount, course_price) {
      return discount < course_price;
    },
    ChengeReservation(e) {
      if (!e) {
        this.course_data.menu_reservation_start_date = false;
        this.course_data.menu_reservation_end_date = false;
        this.course_data.reservation_start_date_str = "";
        this.course_data.reservation_start_date = "";
        this.course_data.reservation_end_date_str = "";
        this.course_data.reservation_end_date = "";
      }
    },
    getErrorMessage(text, language) {
      // Check the pattern based on the language
      const thaiPattern =
        /^[\u0E00-\u0E7F\d\s!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]+$/;
      const englishPattern = /^[a-zA-Z\d\s!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]+$/;
      if (text?.length == 0) {
        return [];
      }
      // Return an error message if the pattern is not matched
      if (language === "thai" && !thaiPattern.test(text)) {
        return [this.$t("invalid Thai languages")];
      } else if (language === "english" && !englishPattern.test(text)) {
        return [this.$t("invalid English languages")];
      } else {
        return [];
      }
    },
    removeChip(item, value) {
      value.splice(value.indexOf(item.value), 1);
    },
    StartDateRegisCourse() {
      this.course_data.course_register_date.end_date = "";
      this.register_date_range_str.end_date = "";
      // this.ChangeCourseData(course_data);
    },
    StartDateStudyCourse() {
      this.course_data.course_study_date.end_date = "";
      this.class_date_range_str.end_date = "";
      // this.ChangeCourseData(course_data);
    },
    SelectedStartDate(e) {
      e.target.parentNode.parentNode.parentNode.parentNode.parentNode
        .getElementsByClassName("time-picker-hidden")[0]
        .getElementsByTagName("input")[0]
        .focus();
    },
    ChangeHours(hours) {
      if (hours) {
        this.course_data.course_hours =
          parseInt(hours.HH) + "." + parseInt(hours.mm);
      }
    },
    ChangeStartDate(date) {
      let time_obj = { HH: "", mm: "" };
      date.end_time_object = time_obj;
      if (!date.start_time_object.mm) {
        date.start_time_object.mm = "00";
      }
      date.start_time = `${date.start_time_object.HH}:${date.start_time_object.mm}`;
      if (
        parseInt(date.start_time_object.HH) +
          parseInt(this.course_data.course_hour_time.HH) >=
        24
      ) {
        date.end_time_object.HH = `${
          parseInt(date.start_time_object.HH) +
          parseInt(this.course_data.course_hour_time.HH) -
          24
        }`.padStart(2, "0");
      } else {
        date.end_time_object.HH = `${
          parseInt(date.start_time_object.HH) +
          parseInt(this.course_data.course_hour_time.HH)
        }`.padStart(2, "0");
      }
      if (
        parseInt(date.start_time_object.mm) +
          parseInt(this.course_data.course_hour_time.mm) >
        59
      ) {
        date.end_time_object.mm = `${
          parseInt(date.start_time_object.mm) +
          parseInt(this.course_data.course_hour_time.mm) -
          60
        }`.padStart(2, "0");

        if (parseInt(date.end_time_object.HH) + 1 >= 24) {
          date.end_time_object.HH = `${
            parseInt(date.end_time_object.HH) + 1 - 24
          }`.padStart(2, "0");
        } else {
          date.end_time_object.HH = `${
            parseInt(date.end_time_object.HH) + 1
          }`.padStart(2, "0");
        }
      } else {
        date.end_time_object.mm = `${
          parseInt(date.start_time_object.mm) +
          parseInt(this.course_data.course_hour_time.mm)
        }`.padStart(2, "0");
      }
      date.end_time = `${date.end_time_object.HH}:${date.end_time_object.mm}`;
    },

    width() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return 99;
        case "sm":
          return 147.5;
        case "md":
          return 180.5;
        case "lg":
          return 251.5;
        case "xl":
          return 401.75;
      }
    },
    widthfull() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return 246;
        case "sm":
          return 343;
        case "md":
          return 409;
        case "lg":
          return 500;
        case "xl":
          return 572;
      }
    },
    genStartTimeEndTime(value) {
      if (value) {
        const end = moment(value).add(this.course_data.course_hours, "hour");
        this.course_data.course_study_time.end_time = end;
      }
      // this.ChangeCourseData(this.course_data);
    },
    limitEndTime(value) {
      let start = this.course_data.course_study_time.start_time;
      let end = moment(value);
      if (start.isAfter(end)) {
        const endTime = moment(start).add(
          this.course_data.course_hours,
          "hour"
        );
        this.course_data.course_study_time.end_time = endTime;
      }
      // this.ChangeCourseData(this.course_data);
    },
    removeFile() {
      this.preview_url = null;
      this.course_data.courseImg = null;
      // this.ChangeCourseData(this.course_data);
    },
    inputName(e, lang) {
      inputValidation(e, lang);
    },
    inputDate(e, data) {
      let options = {
        year: "numeric",
        month: "long",
        day: "numeric",
      };

      switch (data) {
        case "reservation start":
          this.course_data.menu_reservation_start_date = false;
          this.course_data.reservation_start_date_str = dateFormatter(
            e,
            "DD MMT YYYYT"
          );
          break;
        case "reservation end":
          this.course_data.menu_reservation_end_date = false;
          this.course_data.reservation_end_date_str = dateFormatter(
            e,
            "DD MMT YYYYT"
          );
          break;
        case "course open":
          // this.course_data.course_open_date_str = dateFormatter(
          //   e,
          //   "DD MMT YYYYT"
          // );
          this.course_data.course_open_date = e;
          this.course_data.course_open_date_str = new Date(
            e
          ).toLocaleDateString(
            this.$i18n.locale == "th" ? "th-TH" : "en-US",
            options
          );
          break;
        case "register start date":
          this.course_data.course_register_date.menu_start_date = false;
          this.course_data.course_register_date.start_date_str = dateFormatter(
            e,
            "DD MMT YYYYT"
          );
          // this.register_date_range_str.start_date = dateFormatter(
          //   e,
          //   "DD MMT YYYYT"
          // );
          break;
        case "register end date":
          // this.register_date_range_str.end_date = dateFormatter(
          //   e,
          //   "DD MMT YYYYT"
          // );
          this.course_data.course_register_date.menu_end_date = false;
          this.course_data.course_register_date.end_date_str = dateFormatter(
            e,
            "DD MMT YYYYT"
          );
          break;
        case "class start date":
          // this.class_date_range_str.start_date = dateFormatter(
          //   e,
          //   "DD MMT YYYYT"
          // );
          this.course_data.course_study_date.menu_start_date = false;
          this.course_data.course_study_date.start_date_str = dateFormatter(
            e,
            "DD MMT YYYYT"
          );
          break;
        case "class end date":
          // this.class_date_range_str.end_date = dateFormatter(e, "DD MMT YYYYT");
          this.course_data.course_study_date.menu_end_date = false;
          this.course_data.course_study_date.end_date_str = dateFormatter(
            e,
            "DD MMT YYYYT"
          );
          break;
      }
    },
    openFileSelector() {
      this.$refs.fileInput.click();
    },
    uploadFile(event) {
      this.file = this.$refs.fileInput.files[0];
      if (!this.file) return;
      if (CheckFileSize(this.file, event.target.id) === true) {
        const fileType = this.file.type;
        if (fileType === "image/png" || fileType === "image/jpeg") {
          this.course_data.courseImg = this.file;
          // this.ChangeCourseData(this.course_data);
          const reader = new FileReader();
          reader.onload = (e) => {
            this.preview_url = e.target.result;
            // this.course_data.preview_url = this.preview_url;
          };
          reader.readAsDataURL(this.file);
        } else {
          Swal.fire({
            icon: "error",
            title: this.$t("something went wrong"),
            text: this.$t("upload only image files (png, jpeg) only"),
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        }
      }
    },
    preventPaste(event) {
      event.preventDefault();
    },
  },
};
</script>

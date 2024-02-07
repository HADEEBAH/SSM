<template>
  <div>
    <!-- Upload file -->
    <v-card class="mx-3" flat>
      <v-card-text
        class="border-dashed border-2 rounded-lg"
        style="border: dashed rgb(255, 107, 129)"
      >
        <v-row v-if="preview_url">
          <v-col align="center" class="rounded-lg pa-0 my-3">
            <v-img
              :src="preview_url"
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
        <v-row v-if="!preview_url">
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

            <v-text-field
              dense
              :disabled="disable"
              :outlined="!disable"
              :filled="disable"
              @change="ChangeCourseData(course_data)"
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

            <v-text-field
              dense
              :disabled="disable"
              :outlined="!disable"
              :filled="disable"
              @focus="$event.target.select()"
              v-model="course_data.course_name_en"
              @change="ChangeCourseData(course_data)"
              :placeholder="$t('specify the course name (english)')"
              color="#ff6b81"
              :error-messages="
                getErrorMessage(course_data.course_name_en, 'english')
              "
            ></v-text-field>
          </v-col>
        </v-row>
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
              item-color="pink"
              :disabled="disable"
              :outlined="!disable"
              :filled="disable"
              @change="ChangeCourseData(course_data)"
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
            <v-menu
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
                v-model="course_data.course_hours_obj"
                @change="
                  ChangeHours(
                    course_data.course_hours_obj,
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
        <template v-if="course_data.course_type_id === 'CT_1'">
          <v-row dense>
            <v-col cols="12">
              <label-custom :text="$t('course details')"></label-custom>
              <vue-editor
                :editorToolbar="customToolbar"
                :placeholder="
                  course_data.detail ? '' : $t('enter course details') + '...'
                "
                :disabled="disable"
                @text-change="ChangeCourseData(course_data)"
                v-model="course_data.detail"
              ></vue-editor>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12">
              <label-custom :text="'Performance'"></label-custom>
              <vue-editor
                :editorToolbar="customToolbar"
                :placeholder="
                  course_data.music_performance
                    ? ''
                    : $t('enter details') + '...'
                "
                :disabled="disable"
                @text-change="ChangeCourseData(course_data)"
                v-model="course_data.music_performance"
              ></vue-editor>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12">
              <label-custom :text="'Certification'"></label-custom>
              <vue-editor
                :editorToolbar="customToolbar"
                :placeholder="
                  course_data.catification ? '' : $t('enter details') + '...'
                "
                :disabled="disable"
                @text-change="ChangeCourseData(course_data)"
                v-model="course_data.catification"
              ></vue-editor>
            </v-col>
          </v-row>
        </template>
        <!-- Course Type  :: short course -->
        <template v-if="course_data.course_type_id === 'CT_2'">
          <v-row dense>
            <v-col cols="12" sm="6">
              <label-custom required :text="$t('coach')"></label-custom>
              <v-autocomplete
                dense
                :rules="coach"
                v-model="course_data.coachs[0].coach_id"
                color="#FF6B81"
                :items="coachs"
                item-value="accountId"
                :item-text="$i18n.locale == 'th' ? 'fullNameTh' : 'fullNameEh'"
                item-color="pink"
                :disabled="disable"
                :outlined="!disable"
                :filled="disable"
                :placeholder="$t('specify coach')"
                @change="ChangeCourseData(course_data)"
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
                          course_data.coachs[0].coach_id === item.accountId
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
                    <v-icon
                      v-if="course_data.coachs[0].coach_id === item.accountId"
                      >mdi-check-circle</v-icon
                    >
                  </v-list-item-action>
                </template>
              </v-autocomplete>
            </v-col>
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
                v-model="course_data.price_course"
                @change="ChangeCourseData(course_data)"
                color="#FF6B81"
              >
              </v-text-field>
            </v-col>
          </v-row>
        </template>
      </v-card-text>
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
                    v-model="
                      course_data.coachs[0].register_date_range.menu_start_date
                    "
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
                        v-model="register_date_range_str.start_date"
                        readonly
                        :placeholder="$t('choose start date')"
                        v-bind="attrs"
                        v-on="on"
                        color="#FF6B81"
                      >
                        <template v-slot:append>
                          <v-icon
                            :color="
                              course_data.coachs[0].register_date_range
                                .start_date
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
                        course_data.coachs[0].register_date_range.start_date
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
                      !course_data.coachs[0].register_date_range.start_date
                    "
                    v-model="
                      course_data.coachs[0].register_date_range.menu_end_date
                    "
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        dense
                        :disabled="
                          disable ||
                          !course_data.coachs[0].register_date_range.start_date
                        "
                        :outlined="!disable"
                        :filled="disable"
                        @change="ChangeCourseData(course_data)"
                        :rules="end_date"
                        :placeholder="$t('choose an end date')"
                        v-model="register_date_range_str.end_date"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        color="#FF6B81"
                      >
                        <template v-slot:append>
                          <v-icon
                            :color="
                              course_data.coachs[0].register_date_range.end_date
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
                        course_data.coachs[0].register_date_range.start_date
                          ? course_data.coachs[0].register_date_range.start_date
                          : today.toISOString()
                      "
                      @input="inputDate($event, 'register end date')"
                      v-model="
                        course_data.coachs[0].register_date_range.end_date
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
                item-color="pink"
                multiple
                color="#FF6B81"
                :items="days_confix"
                :item-text="$i18n.locale == 'th' ? 'label' : 'label_en'"
                item-value="value"
                :placeholder="$t('please select a teaching date')"
                v-model="course_data.coachs[0].teach_day_data[0].teach_day"
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
                    @click:close="
                      removeChip(
                        item,
                        course_data.coachs[0].teach_day_data[0].teach_day
                      )
                    "
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
                    v-model="
                      course_data.coachs[0].class_date_range.menu_start_date
                    "
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
                        v-model="class_date_range_str.start_date"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        color="#FF6B81"
                      >
                        <template v-slot:append>
                          <v-icon
                            :color="
                              course_data.coachs[0].class_date_range.start_date
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
                        course_data.coachs[0].register_date_range.end_date
                          ? course_data.coachs[0].register_date_range.end_date
                          : today.toISOString()
                      "
                      @change="StartDateStudyCourse(course_data)"
                      @input="inputDate($event, 'class start date')"
                      v-model="
                        course_data.coachs[0].class_date_range.start_date
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
                    v-model="
                      course_data.coachs[0].class_date_range.menu_end_date
                    "
                    :disabled="
                      disable ||
                      !course_data.coachs[0].class_date_range.start_date
                    "
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        dense
                        :disabled="
                          disable ||
                          !course_data.coachs[0].class_date_range.start_date
                        "
                        :outlined="!disable"
                        :filled="disable"
                        @change="ChangeCourseData(course_data)"
                        :rules="end_date"
                        v-model="class_date_range_str.end_date"
                        readonly
                        :placeholder="$t('choose an end date')"
                        v-bind="attrs"
                        v-on="on"
                        color="#FF6B81"
                      >
                        <template v-slot:append>
                          <v-icon
                            :color="
                              course_data.coachs[0].class_date_range.end_date
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
                        course_data.coachs[0].class_date_range.start_date
                          ? course_data.coachs[0].class_date_range.start_date
                          : today.toISOString()
                      "
                      @input="inputDate($event, 'class end date')"
                      v-model="course_data.coachs[0].class_date_range.end_date"
                      :locale="$i18n.locale == 'th' ? 'th-TH' : 'en-US'"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" sm="6" class="px-0">
              <label-custom required :text="$t('class time')"></label-custom>
              <v-row>
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
                        course_data.coachs[0].period.start_time
                      )
                    "
                    :rules="start_time"
                    v-model="course_data.coachs[0].period.start_time"
                    color="#FF6B81"
                  >
                  </v-text-field>
                  <VueTimepicker
                    class="time-picker-hidden"
                    hide-clear-button
                    advanced-keyboard
                    :style="`width:${width()}px;`"
                    v-model="course_data.coachs[0].period.start_time_object"
                    @change="
                      ChangeStartDate(course_data.coachs[0].period, course_data)
                    "
                    color="#FF6B81"
                  >
                  </VueTimepicker>
                </v-col>
                <v-col cols="auto" class="mt-2 px-0"
                  ><v-icon>mdi-minus</v-icon></v-col
                >
                <v-col>
                  <v-text-field
                    disabled
                    :outlined="!disable"
                    :filled="disable"
                    dense
                    :style="`width:${width()}px;`"
                    style="position: absolute; display: block; z-index: 4"
                    :rules="end_time"
                    v-model="course_data.coachs[0].period.end_time"
                    color="#FF6B81"
                  >
                  </v-text-field>
                  <VueTimepicker
                    class="time-picker-hidden"
                    hide-clear-button
                    advanced-keyboard
                    v-model="course_data.coachs[0].period.end_time_object"
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
          <v-row dense>
            <v-col cols="12">
              <label-custom :text="$t('course details')"></label-custom>
              <v-textarea
                v-model="course_data.detail"
                :disabled="disable"
                :outlined="!disable"
                :filled="disable"
                @change="ChangeCourseData(course_data)"
                :placeholder="$t('enter course details') + '...'"
                color="#FF6B81"
              ></v-textarea>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12">
              <label-custom :text="'Certification'"></label-custom>
              <v-textarea
                v-model="course_data.catification"
                :disabled="disable"
                :outlined="!disable"
                :filled="disable"
                @change="ChangeCourseData(course_data)"
                :placeholder="$t('enter details') + '...'"
                color="#FF6B81"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-card-text>
      </template>
    </v-card>
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
              :label="$t('course reservations open before the class start date')"
              color="#ff6b81"
            >
            </v-checkbox>
          </v-col>
        </v-row>
        <v-row v-if="course_data.reservation" dense >
          <v-col cols="12">
            <label-custom required :text="$t('reservation date range')"></label-custom>
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
                  :placeholder="$t('specify the reservation date range')"
                  v-bind="attrs"
                  v-on="on"
                  color="#ff6b81"
                >
                  <template v-slot:append>
                    <v-icon
                      :color="course_data.reservation_start_date ? '#FF6B81' : ''"
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
                  :placeholder="$t('specify the reservation date range')"
                  v-bind="attrs"
                  v-on="on"
                  color="#ff6b81"
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
                :min="course_data.reservation_start_date ? course_data.reservation_start_date : today.toISOString()"
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
import { mapGetters, mapActions } from "vuex";
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
  }),
  created() {
    if (this.edited) {
      this.preview_url = this.course_data?.course_img;
      this.class_date_range_str = {
        start_date: dateFormatter(
          this.course_data?.coachs[0].class_date_range.start_date,
          "DD MMT YYYYT"
        ),
        end_date: dateFormatter(
          this.course_data?.coachs[0].class_date_range.end_date,
          "DD MMT YYYYT"
        ),
      };
      this.register_date_range_str = {
        start_date: dateFormatter(
          this.course_data?.coachs[0].register_date_range.start_date,
          "DD MMT YYYYT"
        ),
        end_date: dateFormatter(
          this.course_data?.coachs[0].register_date_range.end_date,
          "DD MMT YYYYT"
        ),
      };
    }
  },
  mounted() {},
  watch: {
    disable: function () {
      if (this.edited) {
        if (this.disable) {
          this.preview_url = this.course_data.course_img;
        }
      }
    },
    "course_data.course_type_id": function () {
      this.removeFile();
    },
  },
  computed: {
    ...mapGetters({
      course_data: "CourseModules/getCourseData",
    }),
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
    course_open_date() {
      return [
        (val) =>
          (val || "").length > 0 ||
          this.$t("please select a course opening date"),
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
  },
  methods: {
    ...mapActions({
      ChangeCourseData: "CourseModules/ChangeCourseData",
    }),
    ChengeReservation(e){
      if(!e){
        this.course_data.menu_reservation_start_date = false
        this.course_data.menu_reservation_end_date = false
        this.course_data.reservation_start_date_str = ""
        this.course_data.reservation_start_date = ""
        this.course_data.reservation_end_date_str = ""
        this.course_data.reservation_end_date = ""
      }
    },
    getErrorMessage(text, language) {
      // Check the pattern based on the language
      const thaiPattern =
        /^[\u0E00-\u0E7F\d\s!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]+$/;
      const englishPattern = /^[a-zA-Z\d\s!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]+$/;
      if (text.length == 0) {
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
    StartDateRegisCourse(course_data) {
      this.course_data.coachs[0].register_date_range.end_date = "";
      this.register_date_range_str.end_date = "";
      this.ChangeCourseData(course_data);
    },
    StartDateStudyCourse(course_data) {
      this.course_data.coachs[0].class_date_range.end_date = "";
      this.class_date_range_str.end_date = "";
      this.ChangeCourseData(course_data);
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
      if (!date.start_time_object.mm) {
        date.start_time_object.mm = "00";
      }
      date.start_time = `${date.start_time_object.HH}:${date.start_time_object.mm}`;
      if (
        parseInt(date.start_time_object.HH) +
          parseInt(this.course_data.course_hours_obj.HH) >=
        24
      ) {
        date.end_time_object.HH = `${
          parseInt(date.start_time_object.HH) +
          parseInt(this.course_data.course_hours_obj.HH) -
          24
        }`.padStart(2, "0");
      } else {
        date.end_time_object.HH = `${
          parseInt(date.start_time_object.HH) +
          parseInt(this.course_data.course_hours_obj.HH)
        }`.padStart(2, "0");
      }
      if (
        parseInt(date.start_time_object.mm) +
          parseInt(this.course_data.course_hours_obj.mm) >
        59
      ) {
        date.end_time_object.mm = `${
          parseInt(date.start_time_object.mm) +
          parseInt(this.course_data.course_hours_obj.mm) -
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
          parseInt(this.course_data.course_hours_obj.mm)
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
        this.course_data.coachs[0].period.end_time = end;
      }
      this.ChangeCourseData(this.course_data);
    },
    limitEndTime(value) {
      let start = this.course_data.coachs[0].period.start_time;
      let end = moment(value);
      if (start.isAfter(end)) {
        const endTime = moment(start).add(
          this.course_data.course_hours,
          "hour"
        );
        this.course_data.coachs[0].period.end_time = endTime;
      }
      this.ChangeCourseData(this.course_data);
    },
    removeFile() {
      this.preview_url = null;
      this.course_data.course_img = null;
      this.ChangeCourseData(this.course_data);
    },
    inputName(e, lang) {
      inputValidation(e, lang);
    },
    inputDate(e, data) {
      switch (data) {
        case "reservation start":
          this.course_data.menu_reservation_start_date = false
          this.course_data.reservation_start_date_str = dateFormatter(
            e,
            "DD MMT YYYYT"
          );
          break;
        case "reservation end":
          this.course_data.menu_reservation_end_date = false
          this.course_data.reservation_end_date_str = dateFormatter(
            e,
            "DD MMT YYYYT"
          );
          break; 
        case "course open":
          this.course_data.course_open_date_str = dateFormatter(
            e,
            "DD MMT YYYYT"
          );
          break;
        case "register start date":
          this.register_date_range_str.start_date = dateFormatter(
            e,
            "DD MMT YYYYT"
          );
          break;
        case "register end date":
          this.register_date_range_str.end_date = dateFormatter(
            e,
            "DD MMT YYYYT"
          );
          break;
        case "class start date":
          this.class_date_range_str.start_date = dateFormatter(
            e,
            "DD MMT YYYYT"
          );
          break;
        case "class end date":
          this.class_date_range_str.end_date = dateFormatter(e, "DD MMT YYYYT");
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
          this.course_data.course_img = this.file;
          this.ChangeCourseData(this.course_data);
          const reader = new FileReader();
          reader.onload = (e) => {
            this.preview_url = e.target.result;
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

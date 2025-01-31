<template>
  <v-container class="h-full">
    <v-row dense>
      <v-row dense>
        <v-col cols="12" sm="6">
          <v-img
            :aspect-ratio="16 / 9"
            class="rounded-lg"
            :src="
              course_data.course_img || course_data.course_img !== ''
                ? course_data.course_img
                : require(`@/assets/course/default_course_img.svg`)
            "
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
        <v-col cols="12" sm="6" class="d-flex flex-column">
          <v-row dense
            ><v-col class="text-lg font-bold">
              {{
                `${
                  $i18n.locale == "th"
                    ? course_data.course_name_th
                    : course_data.course_name_en
                }`
              }}
            </v-col>
          </v-row>
          <v-row dense>
            <v-col class="text-md">{{
              `${$t("by")} ${course_data.location}`
            }}</v-col>
          </v-row>
          <v-row v-if="course_data.course_type_id === 'CT_2'" dense>
            <v-col cols="auto">
              <v-icon class="mr-2" color="#ff6b81">mdi-currency-usd</v-icon>
            </v-col>
            <v-col class="font-bold"
              >{{
                parseFloat(
                  course_data.course_price ? course_data.course_price : 0
                ).toLocaleString()
              }}
              {{ $t("baht") }}/{{ $t("course") }}</v-col
            >
          </v-row>
          <v-row
            v-if="course_data.course_type_id === 'CT_2' && course_data.discount"
            dense
          >
            <v-col cols="auto">
              <v-icon class="mr-2" color="#ff6b81">mdi-sale</v-icon>
            </v-col>
            <v-col class="font-bold">
              {{ `${$t("discount")}` }}
              {{ parseFloat(course_data.discount).toLocaleString() }}
              {{ $t("baht") }}/{{ $t("course") }}</v-col
            >
          </v-row>
          <rowData
            v-if="course_data.course_type_id === 'CT_2'"
            col_detail="5"
            mini
            icon="mdi-account-group-outline"
          >
            <!-- {{
            course_monitors?.length == 1
              ? course_monitors[0].m_current_student
              : 0
          }}
          / {{ course_data.student_recived }} {{ $t("seat") }} -->
            {{
              course_seat.countSeatByCourse ? course_seat.countSeatByCourse : 0
            }}
            /
            {{
              course_seat.maxStudentByCourse
                ? course_seat.maxStudentByCourse
                : 0
            }}
            {{ $t("seat") }}
          </rowData>
          <rowData
            v-if="course_data.course_type_id === 'CT_1'"
            col_detail="5"
            mini
            icon="mdi-clock-time-four-outline"
            >{{ course_data.course_hours.toFixed(2) }} {{ $t("hrs.") }}/{{
              $t("time")
            }}</rowData
          >
          <v-row dense>
            <v-col cols="12" class="text-[#999999] overflow-hidden">
              <label v-html="course_data.detail"></label>
            </v-col>
          </v-row>
          <v-expansion-panels flat>
            <v-expansion-panel v-if="course_data.course_type_id === 'CT_2'">
              <v-expansion-panel-header class="px-0 font-bold">
                {{ $t("date and time") }}
                <template v-slot:actions>
                  <v-icon color="#ff6b81"> $expand </v-icon>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content class="border-t pt-3">
                <v-row dense>
                  <v-col cols="auto" class="font-bold"
                    >{{ $t("admission date") }}:</v-col
                  >
                  <v-col>
                    {{
                      new Date(
                        course_data.course_register_start_date
                      ).toLocaleDateString(
                        $i18n.locale == "th" ? "th-TH" : "en-US",
                        date_options
                      )
                    }}
                    -
                    {{
                      new Date(
                        course_data.course_register_end_date
                      ).toLocaleDateString(
                        $i18n.locale == "th" ? "th-TH" : "en-US",
                        date_options
                      )
                    }}</v-col
                  >
                </v-row>
                <v-row dense>
                  <v-col cols="auto" class="font-bold"
                    >{{ $t("study date") }}:</v-col
                  >
                  <v-col
                    >{{
                      new Date(
                        course_data.course_study_start_date
                      ).toLocaleDateString(
                        $i18n.locale == "th" ? "th-TH" : "en-US",
                        date_options
                      )
                    }}
                    -
                    {{
                      new Date(
                        course_data.course_study_end_date
                      ).toLocaleDateString(
                        $i18n.locale == "th" ? "th-TH" : "en-US",
                        date_options
                      )
                    }}
                    ({{ course_data.course_period_start_date }}-{{
                      course_data.course_period_end_date
                    }}
                    {{ $t("o'clock") }})</v-col
                  >
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel v-if="course_data.course_type_id === 'CT_1'">
              <v-expansion-panel-header class="px-0 font-bold">
                {{ "Performance" }}
                <template v-slot:actions>
                  <v-icon color="#ff6b81"> $expand </v-icon>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content class="border-t pt-3 overflow-hidden">
                <label v-html="course_data.music_performance"></label>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header class="px-0 font-bold">
                {{ "Certification" }}
                <template v-slot:actions>
                  <v-icon color="#ff6b81"> $expand </v-icon>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content class="border-t pt-3 overflow-hidden">
                <label v-html="course_data.catification"></label>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
          <!-- IMAGE -->
          <div v-if="course_image?.length > 0 && !$vuetify.breakpoint.smAndUp">
            <v-row dense>
              <v-col cols="12" class="text-2xl my-5 font-bold">
                {{ $t("Learning Journey") }}
              </v-col>
              <v-col class="text-xl">
                {{ $t("image") }}
              </v-col>
            </v-row>

            <!-- <div v-if="course_image_is_loading">
              <v-row dense>
                <v-col
                  cols="6"
                  sm="4"
                  v-for="(course, course_index) in 3"
                  :key="course_index"
                >
                  <v-card>
                    <v-skeleton-loader
                      type="image, list-item"
                    ></v-skeleton-loader>
                  </v-card>
                </v-col>
              </v-row>
            </div> -->

            <div ref="scrollImageContainer" class="horizontal-scroll my-3">
              <v-card
                class="horizontal-scroll__item my-2"
                v-for="(event, index) in course_image"
                :key="index"
              >
                <v-btn
                  icon
                  small
                  class="bg-[#cdcdcd] absolute top-2 right-3 z-[4]"
                  dark
                  @click="showImageDialog(event)"
                >
                  <v-icon>mdi-eye</v-icon>
                </v-btn>
                <v-img
                  :src="event.attachmentUrl"
                  cover
                  align="center"
                  style="
                    max-width: 100%;
                    max-height: 100%;

                    object-fit: cover;
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
              </v-card>
            </div>
          </div>

          <!-- VDO & YOUTUBE -->
          <div v-if="course_vdo?.length > 0 && !$vuetify.breakpoint.smAndUp">
            <v-row dense>
              <v-col class="text-xl">
                {{ $t("VDO") }}
              </v-col>
            </v-row>
            <!-- <div v-if="course_vdo_is_loading">
              <v-row dense>
                <v-col
                  cols="6"
                  sm="4"
                  v-for="(course, course_index) in 3"
                  :key="course_index"
                >
                  <v-card>
                    <v-skeleton-loader
                      type="image, list-item"
                    ></v-skeleton-loader>
                  </v-card>
                </v-col>
              </v-row>
            </div> -->

            <div ref="scrollVdoContainer" class="horizontal-scroll my-3">
              <div
                class="horizontal-scroll__item my-2"
                v-for="(event, index) in course_vdo"
                :key="index"
              >
                <div>
                  <!-- VDO -->
                  <v-card
                    class="mt-auto"
                    v-if="
                      event.filesType === 'video/mp4' ||
                      event.filesType === 'video/x-matroska'
                    "
                  >
                    <v-btn
                      icon
                      small
                      class="bg-[#cdcdcd] absolute top-2 right-3 z-[4]"
                      dark
                      @click="showImageDialog(event)"
                      ><v-icon>mdi-eye</v-icon></v-btn
                    >
                    <video
                      cover
                      align="center"
                      style="
                        max-width: 100%;
                        max-height: 100%;
                        height: 180px;
                        width: 100%;
                        object-fit: cover;
                      "
                      :aspect-ratio="16 / 9"
                      autoplay
                      muted
                      controls
                      loop
                    >
                      <source :src="event.attachmentUrl" type="video/mp4" />
                    </video>
                  </v-card>
                  <!-- YOUTUBE -->
                  <v-card v-else-if="event.filesType === 'link'">
                    <v-btn
                      icon
                      small
                      class="bg-[#cdcdcd] absolute top-2 right-3 z-[4]"
                      dark
                      @click="showImageDialog(event)"
                      ><v-icon>mdi-eye</v-icon></v-btn
                    >
                    <div
                      id="video"
                      cover
                      align="center"
                      style="
                        max-width: 100%;
                        max-height: 100%;
                        height: 180px;
                        width: 100%;
                        object-fit: cover;
                      "
                      :aspect-ratio="16 / 9"
                      v-html="event.attachmentCourse"
                    ></div>
                  </v-card>
                </div>
              </div>
            </div>
          </div>

          <!-- IMG -->
          <div
            v-if="
              course_data.artWorkImage?.length > 0 &&
              !$vuetify.breakpoint.smAndUp
            "
          >
            <!-- <headerCard title="Learning Journey"></headerCard> -->
            <v-row dense>
              <v-col cols="12" class="text-2xl my-5 font-bold">
                {{ $t("Learning Journey") }}
              </v-col>
              <v-col class="text-xl">
                {{ $t("image") }}
              </v-col>
            </v-row>
            <!-- IMAGE -->
            <v-row dense class="my-5">
              <v-col
                cols="6"
                v-for="(event, index) in course_data.artWorkImage"
                :key="index"
                class="d-flex flex-column"
              >
                <!-- IMAGE -->
                <v-card class="mt-auto">
                  <v-btn
                    icon
                    small
                    class="bg-[#cdcdcd] absolute top-2 right-3 z-[4]"
                    dark
                    @click="showImageDialog(event)"
                    ><v-icon>mdi-eye</v-icon></v-btn
                  >
                  <v-img
                    :src="event.attachmentUrl"
                    cover
                    align="center"
                    style="
                      max-width: 100%;
                      max-height: 100%;
                      height: 219.6px;
                      width: 100%;
                      object-fit: cover;
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
                </v-card>
              </v-col>
            </v-row>
          </div>
          <!-- VDO -->
          <div
            v-if="
              course_data.artWorkVideo?.length > 0 &&
              !$vuetify.breakpoint.smAndUp
            "
          >
            <v-row dense>
              <v-col class="text-xl">
                {{ $t("link vdo") }}
              </v-col>
            </v-row>
            <v-row dense class="my-5">
              <v-col
                cols="6"
                v-for="(event, index) in course_data.artWorkVideo"
                :key="index"
                class="d-flex flex-column"
              >
                <!-- VDO -->
                <v-card
                  class="mt-auto"
                  v-if="
                    event.filesType === 'video/mp4' ||
                    event.filesType === 'video/x-matroska'
                  "
                >
                  <v-btn
                    icon
                    small
                    class="bg-[#cdcdcd] absolute top-2 right-3 z-[4]"
                    dark
                    @click="showImageDialog(event)"
                    ><v-icon>mdi-eye</v-icon></v-btn
                  >
                  <video
                    style="
                      max-width: 100%;
                      max-height: 100%;
                      height: 219.6px;
                      width: 100%;
                      object-fit: cover;
                    "
                    :aspect-ratio="16 / 9"
                    autoplay
                    muted
                    controls
                    loop
                  >
                    <source :src="event.attachmentUrl" type="video/mp4" />
                  </video>
                </v-card>
                <!-- YOUTUBE -->
                <v-card class="mt-auto" v-else-if="event.filesType === 'link'">
                  <v-btn
                    icon
                    small
                    class="bg-[#cdcdcd] absolute top-2 right-3 z-[4]"
                    dark
                    @click="showImageDialog(event)"
                    ><v-icon>mdi-eye</v-icon></v-btn
                  >
                  <!-- <iframe height="100%" width="100%" :src="event.link"> </iframe> -->
                  <div
                    id="video"
                    style="
                      max-width: 100%;
                      max-height: 100%;
                      height: 219.6px;
                      width: 100%;
                      object-fit: cover;
                    "
                    v-html="event.attachmentCourse"
                    :aspect-ratio="16 / 9"
                  ></div>
                </v-card>
              </v-col>
            </v-row>
          </div>

          <v-row>
            <v-col
              v-if="course_order.course_type_id === 'CT_1'"
              cols="12"
              class="flex justify-center"
            >
              <v-btn
                depressed
                class="w-full font-bold white--text mt-auto"
                @click="
                  $router.push({
                    name: 'userCoursePackage_courseId',
                    params: { course_id: $route.params.course_id },
                  })
                "
                color="#ff6b81"
              >
                {{ $t("choose a package") }}
              </v-btn>
            </v-col>
            <v-col
              v-if="course_order.course_type_id === 'CT_2'"
              cols="12"
              class="flex justify-center"
            >
              <!-- v-if="
                course_monitors?.length == 1
                  ? course_monitors[0].m_current_student <
                    course_data.student_recived
                  : 0 < course_data.student_recived
              " -->
              <v-btn
                v-if="
                  course_seat?.countSeatByCourse <
                  course_seat?.maxStudentByCourse
                "
                depressed
                :disabled="validateRegisterCourse() ? true : false"
                class="w-full font-bold white--text mt-auto"
                @click="registerCourse"
                color="#ff6b81"
              >
                {{ $t("register for a course") }}
              </v-btn>
              <v-btn
                v-else
                depressed
                disabled
                class="w-full font-bold white--text mt-auto"
                color="#ff6b81"
              >
                {{ $t("full course") }}
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <!-- GENERAL COURSE -->

      <!-- DIALOG :: COURSE FULL -->
      <v-dialog width="60vw" v-model="show_dialog" persistent>
        <v-card>
          <v-card-title>
            <v-row>
              <v-col align="right">
                <v-btn icon @click="show_dialog = false"
                  ><v-icon color="#ff6b81">mdi-close</v-icon></v-btn
                >
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-text>
            <dialog-card
              :text="$t('the course is full')"
              :subtitle="
                $t(
                  'currently our class is full of students. thank you for your interest in our course.'
                )
              "
            >
              <template #img>
                <v-img
                  max-height="124"
                  max-width="156"
                  src="@/assets/course/course_full.png"
                ></v-img>
              </template>
              <template #btn>
                <v-btn
                  @click="show_dialog = false"
                  depressed
                  color="#ff6b81"
                  class="w-full"
                  dark
                  >{{ $t("agree") }}</v-btn
                >
              </template>
            </dialog-card>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-row>
    <div v-if="course_is_loading">
      <v-row dense>
        <v-col
          cols="6"
          sm="4"
          v-for="(course, course_index) in 3"
          :key="course_index"
        >
          <v-card>
            <v-skeleton-loader type="image, list-item"></v-skeleton-loader>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- IMAGE -->
    <div v-if="course_image?.length > 0 && $vuetify.breakpoint.smAndUp">
      <v-row dense>
        <v-col cols="12" class="text-2xl my-5 font-bold">
          {{ $t("Learning Journey") }}
        </v-col>
        <v-col class="text-xl">
          {{ $t("image") }}
        </v-col>
      </v-row>

      <!-- <div v-if="course_image_is_loading">
        <v-row dense>
          <v-col
            cols="6"
            sm="4"
            v-for="(course, course_index) in 3"
            :key="course_index"
          >
            <v-card>
              <v-skeleton-loader type="image, list-item"></v-skeleton-loader>
            </v-card>
          </v-col>
        </v-row>
      </div> -->

      <div ref="scrollImageContainer" class="horizontal-scroll my-3">
        <v-card
          class="horizontal-scroll__item_pc my-2"
          v-for="(event, index) in course_image"
          :key="index"
        >
          <v-btn
            icon
            small
            class="bg-[#cdcdcd] absolute top-2 right-3 z-[4]"
            dark
            @click="showImageDialog(event)"
          >
            <v-icon>mdi-eye</v-icon>
          </v-btn>

          <v-img
            :src="event.attachmentUrl"
            contain
            cover
            align="center"
            style="
              max-width: 100%;
              max-height: 100%;
              height: 180px;
              width: 100%;
              object-fit: cover;
            "
            :aspect-ratio="16 / 9"
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
        </v-card>
      </div>
    </div>

    <!-- VDO & YOUTUBE -->
    <div v-if="course_vdo?.length > 0 && $vuetify.breakpoint.smAndUp">
      <v-row dense>
        <v-col class="text-xl">
          {{ $t("VDO") }}
        </v-col>
      </v-row>
      <!-- <div v-if="course_vdo_is_loading">
        <v-row dense>
          <v-col
            cols="6"
            sm="4"
            v-for="(course, course_index) in 3"
            :key="course_index"
          >
            <v-card>
              <v-skeleton-loader type="image, list-item"></v-skeleton-loader>
            </v-card>
          </v-col>
        </v-row>
      </div> -->

      <div ref="scrollVdoContainer" class="horizontal-scroll my-3">
        <div
          class="horizontal-scroll__item_pc my-2"
          v-for="(event, index) in course_vdo"
          :key="index"
        >
          <div>
            <!-- VDO -->
            <v-card
              class="mt-auto"
              v-if="
                event.filesType === 'video/mp4' ||
                event.filesType === 'video/x-matroska'
              "
            >
              <v-btn
                icon
                small
                class="bg-[#cdcdcd] absolute top-2 right-3 z-[4]"
                dark
                @click="showImageDialog(event)"
                ><v-icon>mdi-eye</v-icon></v-btn
              >
              <video
                cover
                align="center"
                style="
                  max-width: 100%;
                  max-height: 100%;
                  height: 180px;
                  width: 100%;
                  object-fit: cover;
                "
                :aspect-ratio="16 / 9"
                autoplay
                muted
                controls
                loop
              >
                <source :src="event.attachmentUrl" type="video/mp4" />
              </video>
            </v-card>
            <!-- YOUTUBE -->
            <v-card v-else-if="event.filesType === 'link'">
              <v-btn
                icon
                small
                class="bg-[#cdcdcd] absolute top-2 right-3 z-[4]"
                dark
                @click="showImageDialog(event)"
                ><v-icon>mdi-eye</v-icon></v-btn
              >
              <div
                id="video"
                cover
                align="center"
                style="
                  max-width: 100%;
                  max-height: 100%;
                  height: 180px;
                  width: 100%;
                  object-fit: cover;
                "
                :aspect-ratio="16 / 9"
                v-html="event.attachmentCourse"
              ></div>
            </v-card>
          </div>
        </div>
      </div>
    </div>

    <!-- <div
      v-if="course_data.artWorkVideo?.length > 0 && $vuetify.breakpoint.smAndUp"
    >
      <v-row dense>
        <v-col class="text-xl">
          {{ $t("link vdo") }}
        </v-col>
      </v-row>
      <v-row dense class="my-5">
        <v-col
          cols="6"
          sm="3"
          v-for="(event, index) in course_data.artWorkVideo"
          :key="index"
          class="d-flex flex-column"
        >
          VDO
          <v-card
            class="mt-auto"
            v-if="
              event.filesType === 'video/mp4' ||
              event.filesType === 'video/x-matroska'
            "
          >
            <v-btn
              icon
              small
              class="bg-[#cdcdcd] absolute top-2 right-3 z-[4]"
              dark
              @click="showImageDialog(event)"
              ><v-icon>mdi-eye</v-icon></v-btn
            >
            <video
              style="height: 219.6px; width: 100%; object-fit: cover"
              autoplay
              muted
              controls
              loop
            >
              <source :src="event.attachmentUrl" type="video/mp4" />
            </video>
          </v-card>
          YOUTUBE
          <v-card class="mt-auto" v-else-if="event.filesType === 'link'">
            <v-btn
              icon
              small
              class="bg-[#cdcdcd] absolute top-2 right-3 z-[4]"
              dark
              @click="showImageDialog(event)"
              ><v-icon>mdi-eye</v-icon></v-btn
            >
            <div
              id="video"
              style="height: 219.6px; width: 100%; object-fit: cover"
              v-html="event.attachmentCourse"
            ></div>
          </v-card>
        </v-col>
      </v-row>
    </div> -->

    <!-- DIALOG SHOW IMAGE -->
    <v-dialog
      persistent
      :width="$vuetify.breakpoint.smAndUp ? '100vw' : ''"
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
                @click="closeShowImage()"
                ><v-icon>mdi-close</v-icon></v-btn
              >
              <span class="font-weight-bold">{{ $t("image example") }} </span>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <!-- IMAGE -->
              <!-- class="max-h-[300px] max-w-300px rounded-lg" -->

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
              <!-- VDO -->
              <!-- style="object-fit: cover; margin: auto" -->

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

              <!-- YOUTUBE -->
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
    </v-dialog>
    <loading-overlay :loading="course_is_loading"></loading-overlay>
  </v-container>
</template>

<script>
import dialogCard from "@/components/dialog/dialogCard.vue";
import rowData from "@/components/label/rowData.vue";
import loadingOverlay from "@/components/loading/loadingOverlay.vue";
import Swal from "sweetalert2";
import { mapActions, mapGetters } from "vuex";
import moment from "moment";

// import headerCard from "@/components/header/headerCard.vue";

// import ImgCard from "@/components/course/imgCard.vue";

export default {
  name: "userCourseDetail",
  components: {
    rowData,
    dialogCard,
    loadingOverlay,
    // headerCard,
    // ImgCard
  },
  data: () => ({
    page: 1,
    show_dialog: false,
    date_options: {
      year: "numeric",
      month: "long",
      day: "numeric",
      locale: "th-TH",
    },
    show_attachment_dialog: false,
    biggesImage: null,
    typeImg: null,
    // eventRefs: [],
    // activeIndex: 0,
  }),
  async created() {
    this.order_data = JSON.parse(localStorage.getItem("Order"));
    this.changeCourseOrderData(this.order_data);
    await this.GetCourse(this.$route.params.course_id);

    if (this.order_data.course_type_id === "CT_2") {
      await this.GetCourseStudent({
        course_id: this.order_data.course_id,
        cpo_id: null,
      });
      // await this.GetCourse(this.$route.params.course_id);
      await this.GetShortCourseMonitor({
        course_id: this.order_data.course_id,
      });
      await this.GetCourseSeats({
        courseId: this.course_data?.course_id,
        coursePackageOptionsId: "",
        dayOfWeekId:
          this.course_data?.days[0]?.times[0]?.timeData[0]?.dayOfWeekId,
        timeId: this.course_data?.days[0]?.times[0]?.timeData[0]?.timeId,
        coachId: this.course_data?.days[0]?.times[0]?.timeData[0]?.coach_id,
        studentId: "",
        courseTypeId: this.course_data?.course_type_id,
      });
    }
    // await this.GetCourseImage({
    //   course_id: this.$route.params.course_id,
    //   page: 1,
    // });
    // await this.GetCourseVdo({
    //   course_id: this.$route.params.course_id,
    //   page: 1,
    // });
  },
  async mounted() {
    await this.$store.dispatch("NavberUserModules/changeTitleNavber", "course");
    await this.GetCourseImage({
      course_id: this.$route.params.course_id,
      limit: 10,
      page: 1,
    });
    await this.GetCourseVdo({
      course_id: this.$route.params.course_id,
      limit: 10,
      page: 1,
    });
    await this.$refs.scrollVdoContainer?.addEventListener(
      "scroll",
      this.trackVdoScroll
    );
    await this.$refs.scrollImageContainer?.addEventListener(
      "scroll",
      this.trackImageScroll
    );
  },
  async beforeDestroy() {
    await this.$refs.scrollVdoContainer?.removeEventListener(
      "scroll",
      this.trackVdoScroll
    );
    await this.$refs.scrollImageContainer?.removeEventListener(
      "scroll",
      this.trackImageScroll
    );
  },
  computed: {
    ...mapGetters({
      limit_image: "CourseModules/getLimitImage",
      limit_vdo: "CourseModules/getLimitVdo",
      course_image_is_loading: "CourseModules/getCourseImageIsLoading",
      course_vdo_is_loading: "CourseModules/getCourseVdoIsLoading",
      course_image: "CourseModules/getCourseImages",
      course_vdo: "CourseModules/getCourseVdos",
      course_data: "CourseModules/getCourseData",
      course_order: "OrderModules/getCourseOrder",
      order: "OrderModules/getOrder",
      course_is_loading: "CourseModules/getCourseIsLoading",
      course_monitors: "CourseMonitorModules/getCourseMonitor",
      course_seat: "CourseModules/getCourseSeats",
    }),
    MobileSize() {
      const { xs } = this.$vuetify.breakpoint;
      return !!xs;
    },
  },

  methods: {
    ...mapActions({
      GetCourseImage: "CourseModules/GetCourseImage",
      GetCourseVdo: "CourseModules/GetCourseVdo",
      GetCourse: "CourseModules/GetCourse",
      changeCourseOrderData: "OrderModules/changeCourseOrderData",
      changeOrderData: "OrderModules/changeOrderData",
      GetCourseStudent: "CourseModules/GetCourseStudent",
      CreateReserveCourse: "OrderModules/CreateReserveCourse",
      GetGeneralCourseMonitor: "CourseMonitorModules/GetGeneralCourseMonitor",
      GetShortCourseMonitor: "CourseMonitorModules/GetShortCourseMonitor",
      GetCourseSeats: "CourseModules/GetCourseSeats",
    }),
    trackImageScroll() {
      const scrollImageContainer = this.$refs.scrollImageContainer;
      if (!scrollImageContainer) return;

      const scrollLeft = scrollImageContainer.scrollLeft;
      // Round to nearest 500 and check if it's a new value
      const roundedScroll = Math.round(scrollLeft / 500) * 500;

      if (
        roundedScroll !== this.lastLoggedScroll &&
        roundedScroll % 500 === 0
      ) {
        this.lastLoggedScroll = roundedScroll; // Store last logged value to prevent duplicates
        if (this.lastLoggedScroll > 0) {
          this.GetCourseImage({
            course_id: this.$route.params.course_id,
            limit: this.limit_image.limit,
            page: this.limit_image.page + 1,
          });
        }
      }
    },

    trackVdoScroll() {
      const scrollVdoContainer = this.$refs.scrollVdoContainer;
      if (!scrollVdoContainer) return;

      const scrollLeft = scrollVdoContainer.scrollLeft;
      // Round to nearest 500 and check if it's a new value
      const roundedScroll = Math.round(scrollLeft / 500) * 500;

      if (
        roundedScroll !== this.lastLoggedScroll &&
        roundedScroll % 500 === 0
      ) {
        this.lastLoggedScroll = roundedScroll; // Store last logged value to prevent duplicates
        if (this.lastLoggedScroll > 0) {
          this.GetCourseVdo({
            course_id: this.$route.params.course_id,
            limit: this.limit_vdo.limit,
            page: this.limit_vdo.page + 1,
          });
        }
      }
    },

    showImageDialog(item) {
      this.biggesImage = item.attachmentUrl
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

    getTime(time) {
      return moment(time).format("HH:mm");
    },
    reserveCourse() {
      Swal.fire({
        icon: "question",
        title: this.$t("want to book this course?"),
        showDenyButton: false,
        showCancelButton: false,
        confirmButtonText: this.$t("agree"),
      }).then(async (result) => {
        if (result.isConfirmed) {
          if (this.course_data.course_type_id === "CT_2") {
            this.course_order.price = parseFloat(this.course_data.course_price);
            // this.course_order.price = parseFloat(this.course_data.price_course);
            this.CreateReserveCourse({ course_data: this.course_order });
          }
        }
      });
    },
    validateRegisterCourse() {
      // eslint-disable-next-line no-unused-vars
      let tobay = moment().format("YYYY-MM-DD");

      return !moment(tobay).isBetween(
        this.course_data.course_register_start_date,
        this.course_data.course_register_end_date,
        null,
        "[]"
      );
      // return false;
    },
    registerCourse() {
      this.order.order_step = 1;
      if (this.course_order.students.length > 0) {
        (this.course_order.apply_for_yourself = false),
          (this.course_order.apply_for_others = false),
          (this.course_order.times_in_class = 0);
        this.course_order.day = "";
        this.course_order.time = "";
        this.course_order.coach = "";
        this.course_order.start_day = "";
        this.course_order.price = 0;
        this.course_order.detail = "";
        this.course_order.remark = "";
        this.course_order.selected = true;
        this.course_order.parents = [];
        this.course_order.students = [];
      }
      if (this.course_data.course_type_id === "CT_2") {
        this.course_order.price = parseFloat(this.course_data.course_price);
        // this.course_order.price = parseFloat(this.course_data.price_course);
        this.changeCourseOrderData(this.course_order);
      }
      this.changeOrderData(this.order);
      localStorage.setItem("Order", JSON.stringify(this.course_order));
      this.$router.push({ name: "userCourseOrder" });
    },
  },
};
</script>


<style scoped>
.horizontal-scroll {
  display: flex;
  gap: 5px;
  height: 200px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
}

.horizontal-scroll::-webkit-scrollbar {
  display: none;
}

.horizontal-scroll__item {
  align-items: center;
  /* background-color: red; */
  color: white;
  border: 1px solid black;
  display: flex;
  flex: 0 0 30%;
  /* font-size: 40px; */
  justify-content: center;
  scroll-snap-align: start;
}
.horizontal-scroll__item_pc {
  align-items: center;
  /* background-color: red; */
  color: white;
  border: 1px solid black;
  /* display: flex; */
  flex: 0 0 20%;
  /* font-size: 40px; */
  justify-content: center;
  scroll-snap-align: start;
}
</style>
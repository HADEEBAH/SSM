<template>
  <v-container class="overflow-x-hidden overflow-y-hidden">
    <pre>{{ show_by_id }}</pre>
    <!-- <pre>{{ student_schedule }}</pre> -->
    <!-- <pre>{{ data_user_relation_management }}</pre> -->
    -----------------------------------------------

    <v-row dense>
      <v-col>
        <headerPage :breadcrumbs="breadcrumbs"></headerPage>
        <v-card class="mx-auto">
          <headerCard
            class="ml-6 mt-8"
            :icon="'mdi-card-account-details-outline'"
            :icon_color="'#FF6B81'"
            :title="title"
          ></headerCard>
          <v-divider class="mx-10"></v-divider>

          <!-- <v-card class="mt-10 ml-5 mr-5" color="#FCFCFC">
            <v-card-text class="mt-3">
              <v-row align="center">
                <v-col cols="12" sm="4">
                  <label-custom text="Username(English)"></label-custom>
                  <v-text-field
                    v-bind:disabled="isDisabled"
                    placeholder="กรุณาระบุชื่อผู้ใช้งาน(ภาษาอังกฤษ)"
                    @keypress="validate($event, 'en')"
                    v-model="user_data.username_en"
                    hide-details
                    outlined
                    dense
                    @keyup.enter="checkData"
                    :color="isMatch ? 'pink' : 'blue'"
                  >
                    <template #append>
                      <v-icon v-if="isMatch">mdi-check</v-icon>
                    </template>
                  </v-text-field>

                  <span class="text-sm red--text" v-if="isNotMatch"
                    >{{ username_alert }}
                  </span>
                </v-col>
                <v-col cols="12" sm="4">
                  <label>หากไม่มี กรุณา </label>
                  <label
                    class="primary--text cursor-pointer mt-5"
                    @click="changeDialogRegisterOneId(true)"
                    >สมัคร One ID
                  </label>
                </v-col>
                <v-col cols="12" sm="auto">
                  <v-img
                    class="img-one ml-auto mr-10 mb-2"
                    src="@/assets/manageuser/logo_one platform.svg"
                /></v-col>
              </v-row>
            </v-card-text>
          </v-card> -->

          <!-- Check User Name ด้านบนสุด -->
          <v-card class="mt-10 ml-5 mr-5" color="#FCFCFC">
            <v-card-text class="mt-3">
              <v-row align="center">
                <v-col cols="12" sm="8">
                  <label-custom text="Username(English)"></label-custom>
                  <v-text-field
                    placeholder="กรุณาระบุชื่อผู้ใช้งาน(ภาษาอังกฤษ)"
                    @keypress="validate($event, 'en')"
                    v-model="show_by_id.userName"
                    hide-details
                    outlined
                    dense
                    disabled
                  >
                    <template #append>
                      <v-icon>mdi-check</v-icon>
                    </template>
                  </v-text-field>
                </v-col>
                <!-- <v-col cols="12" sm="4">
                  <label>หากไม่มี กรุณา </label>
                  <label
                    class="primary--text cursor-pointer mt-5"
                    @click="changeDialogRegisterOneId(true)"
                    >สมัคร One ID
                  </label>
                </v-col> -->
                <v-col cols="12" sm="auto" align="end">
                  <v-img
                    class="img-one ml-auto mr-10 mb-2"
                    src="@/assets/manageuser/logo_one platform.svg"
                /></v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <div v-if="isMatch === true">
            <v-card class="mt-10 ml-5 mr-5" color="#FCFCFC">
              <v-card-text class="mt-3">
                <v-row>
                  <v-col cols="12" sm="4">
                    <div class="profileCard" @click="openFileSelector">
                      <v-img
                        v-if="!previewUrl"
                        src="@/assets/userManagePage/imgcard.png"
                        class="iconInCard drop-shadow-md"
                      >
                      </v-img>

                      <v-img
                        v-else
                        src="@/assets/userManagePage/imgcardafterupload.png"
                        class="iconInCard drop-shadow-md"
                        style="position: relative"
                      >
                      </v-img>

                      <div style="position: absolute">
                        <div v-if="previewUrl !== null">
                          <img
                            :src="previewUrl"
                            v-if="previewUrl"
                            class="profileInCard"
                          />

                          <v-img
                            src="@/assets/userManagePage/camera.png"
                            max-height="30"
                            max-width="30"
                            class="camera"
                          >
                          </v-img>
                        </div>

                        <div v-if="!previewUrl">
                          <v-img
                            src="@/assets/userManagePage/uploadPhoto.png"
                            max-height="30"
                            max-width="30"
                            class="mx-15"
                          >
                          </v-img>
                          <v-spacer class="text-center">Upload Photo</v-spacer>
                          <v-spacer class="text-center"
                            >ต้องเป็นไฟล์ภาพ</v-spacer
                          >
                          <v-spacer class="text-center"
                            >( PNG JPG ) เท่านั้น</v-spacer
                          >
                          <v-spacer class="text-center"
                            >ขนาดภาพไม่เกิน 500 Mb</v-spacer
                          >
                        </div>
                        <input
                          ref="fileInput"
                          type="file"
                          @change="uploadFile"
                          style="display: none"
                          class="rounded-full"
                          accept="image/*"
                        />
                      </div>
                    </div>
                  </v-col>

                  <v-col>
                    <v-row>
                      <v-col cols="12" sm="6">
                        <label-custom text="ชื่อ (ภาษาไทย)"></label-custom>
                        <v-text-field
                          @keypress="validate($event, 'th')"
                          placeholder=""
                          v-model="show_by_id.firstNameTh"
                          :rules="rules.name"
                          outlined
                          dense
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <label-custom text="นามสกุล (ภาษาไทย)"></label-custom>
                        <v-text-field
                          @keypress="validate($event, 'th')"
                          placeholder=""
                          v-model="show_by_id.lastNameTh"
                          :rules="rules.name"
                          outlined
                          dense
                        >
                        </v-text-field>
                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col cols="12" sm="6">
                        <label-custom
                          text="First Name (English)"
                        ></label-custom>
                        <v-text-field
                          v-bind:disabled="isDisabled"
                          @keypress="validate($event, 'en')"
                          placeholder=""
                          v-model="show_by_id.firstNameEng"
                          :rules="rules.name"
                          outlined
                          dense
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <label-custom text="Last Name (English)"></label-custom>
                        <v-text-field
                          v-bind:disabled="isDisabled"
                          @keypress="validate($event, 'en')"
                          placeholder=""
                          v-model="show_by_id.lastNameEng"
                          :rules="rules.name"
                          outlined
                          dense
                        >
                        </v-text-field>
                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col cols="12" sm="6">
                        <label-custom text="อีเมล"></label-custom>
                        <v-text-field
                          @keypress="validate($event, 'en', 'number')"
                          placeholder=""
                          v-model="show_by_id.email"
                          outlined
                          dense
                          disabled
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <label-custom text="เบอร์โทรศัพท์"></label-custom>
                        <v-text-field
                          disabled
                          @keypress="validate($event, 'number')"
                          v-model="show_by_id.mobileNo"
                          :rules="rules.name"
                          outlined
                          dense
                          required
                          @input="checkPhoneNumber"
                          maxlength="12"
                        >
                        </v-text-field>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <div v-for="(item, index) in show_by_id.userRoles" :key="index">
              <!-- การจัดการสิทธิ์ -->
              <headerCard
                class="ml-6 mt-8"
                :icon="'mdi-card-account-details-outline'"
                :icon_color="'#FF6B81'"
                :title="title2"
              ></headerCard>
              <v-divider class="mx-10"></v-divider>
              <v-card class="mt-10 ml-5 mr-5" color="#FCFCFC">
                <v-card-text class="mt-3">
                  <v-row class="mr-3 ml-3">
                    <v-col cols="12" sm="5">
                      <label-custom text="บทบาทผู้ใช้งาน"></label-custom>
                      <!-- <v-card
                        class="rounded-xl w-2/5 text-center pa-1"
                        style="background-color: #fbf3f5"
                        >{{ item.roleNameTh }}</v-card -->

                      <v-autocomplete
                        :key="index"
                        dense
                        v-model="item.roleId"
                        :items="roles"
                        item-value="role"
                        item-text="role"
                        :label="item.roleNameTh"
                        placeholder="กรุณาเลือกบทบาทผู้ใช้งาน"
                        single-line
                        outlined
                        chips
                        deletable-chips
                        item-color="#ff6b81"
                        color="#ff6b81"
                        @change="selectRole"
                      >
                        {{ item.roleNameTh }}
                        <template #selection="{ item }">
                          <v-chip
                            color="#FBF3F5"
                            v-bind="item.attrs"
                            :input-value="item.role"
                            @click="item.role"
                          >
                            {{ item.role }}
                            <!-- <v-icon @click="remove(item)" color="#ff6b81"
                              >mdi-close-circle</v-icon
                            > -->
                          </v-chip>
                        </template>
                        <template v-slot:item="{ item }">
                          <v-list-item-content>
                            <v-list-item-title
                              ><span
                                :class="
                                  selectRoles.includes(item.role)
                                    ? 'font-bold'
                                    : ''
                                "
                                >{{ item.role }}</span
                              ></v-list-item-title
                            >
                          </v-list-item-content>
                          <v-list-item-action>
                            <v-icon color="#FF6B81">
                              {{
                                selectRoles.includes(item.role)
                                  ? "mdi-checkbox-marked"
                                  : "mdi-checkbox-blank-circle-outline"
                              }}</v-icon
                            >
                          </v-list-item-action>
                        </template>
                      </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="4"></v-col>

                    <!-- <v-col cols="12" sm="6">
                    <label-custom text="สิทธิ์ผู้ใช้งาน"></label-custom>
                    <v-autocomplete
                      dense
                      v-model="privilege"
                      :disabled="
                        privilege === 'ผู้ปกครอง' && sortBy[0] === 'ผู้ปกครอง'
                      "
                      :items="period"
                      placeholder="กรุณาเลือกสิทธิ์ผู้ใช้งาน"
                      outlined
                      color="pink"
                      item-color="pink"
                    >
                    </v-autocomplete>
                  </v-col> -->
                  </v-row>
                </v-card-text>
              </v-card>

              <!-- check box In Parent -->
              <v-row
                v-if="
                  item.roleId == 'R_4' &&
                  data_user_relation_management.length <= 0
                "
              >
                <v-col cols="12" sm="6" class="ml-10">
                  <v-checkbox
                    v-model="isOpenParent"
                    label="ต้องการเพิ่มนักเรียนในการดูแล"
                    value="Jacob"
                    color="pink"
                    item-color="pink"
                    @change="onCheckboxChange"
                  ></v-checkbox>
                </v-col>
              </v-row>
              <!-- Card Add Students in parent -->
              <!-- <div v-if="isOpenParent">
                <headerCard
                  class="ml-6 mt-8"
                  :icon="'mdi-file-plus-outline'"
                  :icon_color="'#FF6B81'"
                  :title="addStudentData"
                ></headerCard>
                <v-divider class="mx-10"></v-divider>
                <v-card
                  class="mt-10 ml-10 mr-10"
                  color="#FCFCFC"
                  v-for="(
                      relations, index_relations
                    ) in data_user_relation_management"
                    :key="`${index_relations}-student`"
                >
                  <v-card-text class="mt-3">
                    <v-row dense>
                      <v-col align="right">
                        <v-icon
                          larg
                          color="#FF6B81"
                          @click="removeCardStudent(student_index)"
                          v-if="students.students_detail.length >= 1"
                        >
                          mdi-delete
                        </v-icon>
                      </v-col>
                    </v-row>

                    <v-row dense align="center">
                      <v-col cols="12" sm="6">
                        <label-custom
                          text="Student’s Username (English)"
                        ></label-custom>
                        <v-text-field
                          v-bind:disabled="isDisabled"
                          @keypress="validate($event, 'en', 'number')"
                          hide-details
                          v-model="student.username"
                          :rules="rules.name"
                          outlined
                          dense
                          @keyup.enter="checkData"
                          :color="isMatch ? 'blue' : 'red'"
                        >
                          <template #append>
                            <v-icon v-if="isMatch">mdi-check</v-icon>
                          </template>
                        </v-text-field>
                        <span class="text-sm red--text" v-if="isNotMatch"
                          >{{ username_alert }}
                        </span>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <label>หากไม่มี กรุณา </label>
                        <label
                          class="primary--text cursor-pointer mt-5"
                          @click="changeDialogRegisterOneId(true)"
                          >สมัคร One ID
                        </label>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <label-custom
                          text="First Name (English)"
                        ></label-custom>
                        <v-text-field
                          @keypress="validate($event, 'en')"
                          placeholder=""
                          v-model="student.firstname"
                          :rules="rules.name"
                          outlined
                          dense
                          disabled
                          filled
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <label-custom text="Last Name (English)"></label-custom>
                        <v-text-field
                          @keypress="validate($event, 'en')"
                          placeholder=""
                          v-model="student.lastname"
                          :rules="rules.name"
                          outlined
                          dense
                          disabled
                          filled
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <label-custom text="เบอร์โทรศัพท์"></label-custom>
                        <v-text-field
                          @keypress="validate($event, 'number')"
                          placeholder=""
                          disabled
                          v-model="student.tel"
                          :rules="rules.name"
                          outlined
                          filled
                          dense
                          required
                          maxlength="12"
                        >
                        </v-text-field>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
                <v-col cols="12" sm="6" align="right">
                  <v-btn
                    outlined
                    class="btn3 mt-10"
                    color="#ff6b81"
                    @click="addStudentsCard"
                  >
                    <span class="mdimdi-plus-circle-outline"
                      >เพิ่มนักเรียน</span
                    >
                  </v-btn>
                </v-col>
                TABLE
                <div class="my-5 mx-10">
                  :items="datausers"
                  :search="search"
                  :page.sync="page"
                  :items-per-page="itemsPerPage"
                  :sort-by="user_data.sortBy"
                  <v-data-table
                    :headers="headers"
                    @page-count="pageCount = $event"
                    class="elevation-1 header-table"
                  >
                    <template v-slot:[`item.actions`]="{ item }">
                      <v-icon small color="#FF6B81"> mdi-eye-outline </v-icon>
                      <v-icon
                        small
                        class="ml-5"
                        color="#FF6B81"
                        @click="editItem(item)"
                      >
                        mdi-pencil
                      </v-icon>
                      <v-icon
                        class="ml-5"
                        small
                        color="#FF6B81"
                        @click="deleteItem(item)"
                      >
                        mdi-delete
                      </v-icon>
                    </template>
                  </v-data-table>
                </div>
              </div> -->

              <div v-if="isOpenParent">
                <headerCard
                  class="ml-6 mt-8"
                  :icon="'mdi-file-plus-outline'"
                  :icon_color="'#FF6B81'"
                  :title="addStudentData"
                ></headerCard>
                <v-divider class="mx-10"></v-divider>

                <div>
                  <v-card
                    class="mt-2 ml-10 mr-10"
                    color="#FCFCFC"
                    v-for="(
                      relations, index_relations
                    ) in data_user_relation_management"
                    :key="index_relations"
                  >
                    <v-card-text>
                      <v-col align="right">
                        <v-icon
                          larg
                          color="#FF6B81"
                          @click="removeRelations(index_relations)"
                        >
                          mdi-delete
                        </v-icon>
                      </v-col>
                      <v-row dense align="center">
                        <v-col cols="12" sm="6">
                          <label-custom
                            text="Student Username (English)"
                          ></label-custom>
                          <!-- <label-custom
                            :text="
                              show_by_id.userRoles.length !== 0 &&
                              show_by_id.userRoles
                                .map((val) => {
                                  return val?.roleId;
                                })
                                .join() === 'R_4'
                                ? 'Student Username (English)'
                                : 'Parent Username (English)'
                            "
                          ></label-custom> -->
                          <div>
                            {{
                              !relations.student.studentUsername
                                ? "-"
                                : relations.student.studentUsername
                            }}
                          </div>
                        </v-col>

                        <v-col cols="12" sm="6">
                          <label-custom
                            text="First Name (English)"
                          ></label-custom>
                          <div>
                            {{
                              !relations.student.studentFirstnameEn
                                ? "-"
                                : relations.student.studentFirstnameEn
                            }}
                          </div>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <label-custom
                            text="Last Name (English)"
                          ></label-custom>
                          <div>
                            {{
                              !relations.student.studentLastnameEn
                                ? "-"
                                : relations.student.studentLastnameEn
                            }}
                          </div>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <label-custom text="เบอร์โทรศัพท์"></label-custom>
                          <div>
                            {{
                              !relations.student.studentTel
                                ? "-"
                                : relations.student.studentTel
                            }}
                          </div>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </div>

                <div>
                  <v-card class="mt-10 ml-10 mr-10" color="#FCFCFC">
                    <v-card-text class="mt-3">
                      <v-col cols="auto" align="center">
                        <v-btn
                          dense
                          outlined
                          color="#ff6b81"
                          @click="openAddRelationsDialog"
                        >
                          <v-icon>mdi-plus-circle-outline</v-icon
                          >เพิ่มข้อมูลนักเรียน</v-btn
                        >
                      </v-col>
                    </v-card-text>
                  </v-card>
                </div>

                <!-- TABLE -->
                <div>
                  <headerCard
                    class="ml-6 mt-8"
                    :icon="'mdi-school-outline'"
                    :icon_color="'#FF6B81'"
                    :title="title3"
                  ></headerCard>
                  <v-divider class="mx-10"></v-divider>
                  <div class="my-5 mx-10">
                    <!-- :items="datausers"
                  :search="search"
                  :page.sync="page"
                  :items-per-page="itemsPerPage"
                  :sort-by="user_data.sortBy" -->
                    <v-data-table
                      :headers="headersTabs"
                      @page-count="pageCount = $event"
                      class="elevation-1 header-table"
                      :items="student_schedule"
                    >
                      <template v-slot:[`item.actions`]="{ item }">
                        <v-icon small color="#FF6B81"> mdi-eye-outline </v-icon>
                        <v-icon
                          small
                          class="ml-5"
                          color="#FF6B81"
                          @click="editItem(item)"
                        >
                          mdi-pencil
                        </v-icon>
                        <v-icon
                          class="ml-5"
                          small
                          color="#FF6B81"
                          @click="deleteItem(item)"
                        >
                          mdi-delete
                        </v-icon>
                      </template>
                    </v-data-table>
                  </div>
                </div>
              </div>

              <!-- check box In Student -->
              <v-row
                v-if="
                  item.roleId == 'R_5' &&
                  data_user_relation_management.length <= 0
                "
              >
                <v-col cols="12" sm="6" class="ml-10">
                  <v-checkbox
                    v-model="isOpenStudent"
                    label="ต้องการเพิ่มผู้ปกครอง"
                    value="parent"
                    color="pink"
                    item-color="pink"
                    @change="onCheckboxChangeParent"
                  ></v-checkbox>
                </v-col>
              </v-row>

              <!-- Card Add Parent in Student -->

              <div v-if="isOpenStudent">
                <headerCard
                  class="ml-6 mt-8"
                  :icon="'mdi-file-plus-outline'"
                  :icon_color="'#FF6B81'"
                  :title="addParentData"
                ></headerCard>
                <v-divider class="mx-10"></v-divider>

                <div>
                  <v-card
                    class="mt-10 ml-10 mr-10"
                    color="#FCFCFC"
                    v-for="(
                      relations, index_relations
                    ) in data_user_relation_management"
                    :key="index_relations"
                  >
                    <v-card-text>
                      <v-col align="right">
                        <v-icon
                          larg
                          color="#FF6B81"
                          @click="removeRelations(index_relations)"
                        >
                          mdi-delete
                        </v-icon>
                      </v-col>
                      <v-row dense align="center">
                        <v-col cols="12" sm="6">
                          <label-custom
                            text="Parent’s Username (English)"
                          ></label-custom>
                          <div>
                            {{
                              !relations.parent.parentUsername
                                ? "-"
                                : relations.parent.parentUsername
                            }}
                          </div>
                        </v-col>

                        <v-col cols="12" sm="6">
                          <label-custom
                            text="First Name (English)"
                          ></label-custom>
                          <div>
                            {{
                              !relations.parent.parentFirstnameEn
                                ? "-"
                                : relations.parent.parentFirstnameEn
                            }}
                          </div>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <label-custom
                            text="Last Name (English)"
                          ></label-custom>
                          <div>
                            {{
                              !relations.parent.parentLastnameEn
                                ? "-"
                                : relations.parent.parentLastnameEn
                            }}
                          </div>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <label-custom text="เบอร์โทรศัพท์"></label-custom>
                          <div>
                            {{
                              !relations.parent.parentTel
                                ? "-"
                                : relations.parent.parentTel
                            }}
                          </div>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </div>

                <div>
                  <v-col cols="auto" align="center">
                    <v-btn
                      dense
                      outlined
                      color="#ff6b81"
                      @click="openAddRelationsDialog"
                    >
                      <v-icon>mdi-plus-circle-outline</v-icon
                      >เพิ่มข้อมูลผู้ปกครอง</v-btn
                    >
                  </v-col>

                  <!-- <v-row dense align="center">
                        <v-col cols="12" sm="6">
                          <label-custom
                            text="Parent’s Username (English)"
                          ></label-custom>
                          <v-text-field
                            v-bind:disabled="isDisabled"
                            @keypress="validate($event, 'en', 'number')"
                            hide-details
                            v-model="parents.username"
                            :rules="rules.name"
                            outlined
                            dense
                            @keyup.enter="checkData"
                            :color="isMatch ? 'blue' : 'red'"
                          >
                            <template #append>
                              <v-icon v-if="isMatch">mdi-check</v-icon>
                            </template>
                          </v-text-field>
                          <span class="text-sm red--text" v-if="isNotMatch"
                            >{{ username_alert }}
                          </span>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <label>หากไม่มี กรุณา </label>
                          <label
                            class="primary--text cursor-pointer mt-5"
                            @click="changeDialogRegisterOneId(true)"
                            >สมัคร One ID
                          </label>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <label-custom
                            text="First Name (English)"
                          ></label-custom>
                          <v-text-field
                            @keypress="validate($event, 'en')"
                            placeholder=""
                            v-model="parents.firstname"
                            :rules="rules.name"
                            outlined
                            dense
                            disabled
                            filled
                          >
                          </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <label-custom
                            text="Last Name (English)"
                          ></label-custom>
                          <v-text-field
                            @keypress="validate($event, 'en')"
                            placeholder=""
                            v-model="parents.lastname"
                            :rules="rules.name"
                            outlined
                            dense
                            disabled
                            filled
                          >
                          </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <label-custom text="เบอร์โทรศัพท์"></label-custom>
                          <v-text-field
                            @keypress="validate($event, 'number')"
                            placeholder=""
                            disabled
                            v-model="parents.tel"
                            :rules="rules.name"
                            outlined
                            filled
                            dense
                            required
                            maxlength="12"
                          >
                          </v-text-field>
                        </v-col>
                      </v-row> -->
                </div>

                <!-- TABLE -->
                <div>
                  <headerCard
                    class="ml-6 mt-8"
                    :icon="'mdi-school-outline'"
                    :icon_color="'#FF6B81'"
                    :title="title3"
                  ></headerCard>
                  <v-divider class="mx-10"></v-divider>
                  <div class="my-5 mx-10">
                    <!-- :items="datausers"
                  :search="search"
                  :page.sync="page"
                  :items-per-page="itemsPerPage"
                  :sort-by="user_data.sortBy" -->
                    <v-data-table
                      :headers="headersTabs"
                      @page-count="pageCount = $event"
                      class="elevation-1 header-table"
                      :items="student_schedule"
                    >
                      <template v-slot:[`item.actions`]="{ item }">
                        <v-icon small color="#FF6B81"> mdi-eye-outline </v-icon>
                        <v-icon
                          small
                          class="ml-5"
                          color="#FF6B81"
                          @click="editItem(item)"
                        >
                          mdi-pencil
                        </v-icon>
                        <v-icon
                          class="ml-5"
                          small
                          color="#FF6B81"
                          @click="deleteItem(item)"
                        >
                          mdi-delete
                        </v-icon>
                      </template>
                    </v-data-table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- BUTTON -->
          <!-- <v-col class="text-right mt-5">
              <v-btn 
              class="white--text" 
              :disabled="!isInputValid"
              :color="isInputValid ? '#ff6b81' : ''"
              @click="onClick()"
              >
                {{ buttonText }}</v-btn
              >
            </v-col> -->
          <v-col class="text-right mt-5">
            <v-btn
              depressed
              class="white--text"
              color="#ff6b81"
              @click="updateData()"
            >
              บันทึก
            </v-btn>

            <!-- <v-btn
              depressed
              class="white--text text-right mt-5"
              :disabled="!isInputValid"
              :color="isInputValid ? '#ff6b81' : ''"
              @click="edit()"
            >
              <span class="mdi mdi-pencil-outline"></span> แก้ไข
            </v-btn> -->
          </v-col>
        </v-card>
      </v-col>
    </v-row>

    <!-- DIALOG -->
    <v-dialog class="pa-2" width="50vw" v-model="dialog_show" persistent>
      <v-card>
        <v-card-title>
          <v-row>
            <v-col cols="12" align="right">
              <v-btn icon @click="closeDialog">
                <v-icon color="#ff6b81">mdi-close</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-title>
        <dialogCard text="บันทึกข้อมูลสำเร็จ"></dialogCard>
      </v-card>
    </v-dialog>

    <!-- CHECK USER PARENT DIALOG-->
    <v-dialog v-model="add_relations" width="50vw" class="d-flex align-center">
      <v-card class="pa-2" width="50vw">
        <header-card
          icon="mdi-card-account-details-outline"
          icon_color="#ff6b81"
          :title="
            show_by_id.userRoles.length !== 0 &&
            show_by_id.userRoles
              .map((val) => {
                return val?.roleId;
              })
              .join() === 'R_4'
              ? 'เพิ่มนักเรียน'
              : 'เพิ่มผู้ปกครอง'
          "
        >
          <template #actions>
            <v-btn icon @click="closeDialog"><v-icon>mdi-close</v-icon></v-btn>
          </template>
        </header-card>
        <v-card-text class="pb-2">
          <v-row dense>
            <v-col cols="9">
              <labelCustom text="Username"></labelCustom>
              <v-text-field
                :hide-details="!relation.account_id"
                dense
                outlined
                v-model="relation.username"
                @change="
                  checkUsername(
                    relation.username,
                    show_by_id.userRoles.length !== 0 &&
                      show_by_id.userRoles
                        .map((val) => {
                          return val?.roleId;
                        })
                        .join() === 'R_4'
                      ? 'parent'
                      : 'student'
                  )
                "
                @keyup.enter="
                  checkUsername(
                    relation.username,
                    show_by_id.userRoles.length !== 0 &&
                      show_by_id.userRoles
                        .map((val) => {
                          return val?.roleId;
                        })
                        .join() === 'R_4'
                      ? 'parent'
                      : 'student'
                  )
                "
                @blur="
                  checkUsername(
                    relation.username,
                    show_by_id.userRoles.length !== 0 &&
                      show_by_id.userRoles
                        .map((val) => {
                          return val?.roleId;
                        })
                        .join() === 'R_4'
                      ? 'parent'
                      : 'student'
                  )
                "
                placeholder="Username"
              >
                <template v-slot:append>
                  <v-icon v-if="relation.account_id" color="green"
                    >mdi-checkbox-marked-circle-outline</v-icon
                  >
                </template>
              </v-text-field>
              <template v-if="!relation.account_id">
                <label> หากยังไม่มีบัญชีผู้ใช้กรุณา </label>
                <label
                  class="text-[#ff6b81] underline cursor-pointer mt-5"
                  @click="registerParent"
                  >สมัคร One ID</label
                >
              </template>
            </v-col>
            <v-col cols="auto">
              <br />
              <v-btn
                :loading="is_loading"
                color="#ff6b81"
                @click="
                  checkUsername(
                    relation.username,
                    show_by_id.userRoles.length !== 0 &&
                      show_by_id.userRoles
                        .map((val) => {
                          return val?.roleId;
                        })
                        .join() === 'R_4'
                      ? 'parent'
                      : 'student'
                  )
                "
                depressed
                dark
                >ตกลง</v-btn
              >
            </v-col>
          </v-row>
          <template>
            <v-row dense>
              <v-col cols="12">
                <labelCustom required text="ชื่อ(ภาษาอักฤษ)"></labelCustom>
                <v-text-field
                  :disabled="user_data.length > 0"
                  dense
                  outlined
                  v-model="relation.firstname_en"
                  placeholder="ชื่อภาษาอังกฤษ"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row dense>
              <v-col cols="12">
                <labelCustom required text="นามสกุล(ภาษาอักฤษ)"></labelCustom>
                <v-text-field
                  :disabled="user_data.length > 0"
                  dense
                  outlined
                  v-model="relation.lastname_en"
                  placeholder="นามสกุลภาษาอังกฤษ"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row dense>
              <v-col cols="12">
                <labelCustom required text="เบอร์โทรศัพท์"></labelCustom>
                <v-text-field
                  :disabled="user_data.length > 0"
                  dense
                  outlined
                  v-model="relation.tel"
                  placeholder="เบอร์โทรศัพท์"
                ></v-text-field>
              </v-col>
            </v-row>
          </template>
        </v-card-text>
        <v-card-actions class="px-6">
          <v-row dense>
            <v-col>
              <v-btn
                @click="closeDialog"
                class="w-full"
                color="#ff6b81"
                outlined
                >ยกเลิก</v-btn
              >
            </v-col>
            <v-col>
              <v-btn
                class="w-full"
                color="#ff6b81"
                dark
                depressed
                @click="addParent"
                >บันทึก</v-btn
              >
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- DIALOG::REGISTER -->
    <v-dialog
      persistent
      v-if="show_dialog_register_one_id"
      v-model="show_dialog_register_one_id"
      :width="!MobileSize ? `60vw` : ``"
    >
      <registerDialogForm
        dialog
        title="สมัคร One ID"
        :state="register_type"
      ></registerDialogForm>
    </v-dialog>

    <!-- DIALOG -->
    <v-dialog class="pa-2" width="50vw" v-model="show_sucsess" persistent>
      <v-card>
        <v-card-title>
          <v-row>
            <v-col cols="12" align="right">
              <v-btn icon @click="closeDialog">
                <v-icon color="#ff6b81">mdi-close</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-title>
        <dialogCard text="แก้ไขข้อมูลเรียบร้อย"></dialogCard>
        <div class="my-5 text-center">
          <v-btn color="#ff6b81" @click="goToManageKingdomPage()"> ตกลง </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </v-container>
</template>
  <script>
import { inputValidation } from "@/functions/functions";
import LabelCustom from "@/components/label/labelCustom.vue";
import headerPage from "@/components/header/headerPage.vue";
import headerCard from "@/components/header/headerCard.vue";
import registerDialogForm from "@/components/user_menage/registerDialogForm.vue";
import dialogCard from "@/components/dialog/dialogCard.vue";
import { mapActions, mapGetters } from "vuex";
import VueCookie from "vue-cookie";
import Swal from "sweetalert2";
import axios from "axios";
export default {
  name: "userMenagePage",
  components: {
    headerPage,
    headerCard,
    registerDialogForm,
    LabelCustom,
    dialogCard,
  },
  data: () => ({
    saved: false,
    isDisabled: false,
    isEnabled: true,
    previewUrl: null,
    inputValue: "",
    username_alert: "",
    isMatch: false,
    isNotMatch: true,
    searchTerm: "",
    selectRoles: [],
    isOpenParent: false,
    isOpenStudent: false,
    add_parent: false,
    add_student: false,
    add_relations: false,
    show_sucsess: false,
    // username_en: "",
    // fname_th: "",
    // lname_th: "",
    // fname_en: "",
    // lname_en: "",
    // email: "",
    // phone_num: "",
    // students: [
    //   {
    //     username: "",
    //     firstname: "",
    //     lastname: "",
    //     tel: "",
    //   },changeUserData
    // ],
    // parents: [
    //   {
    //     username: "",
    //     firstname: "",
    //     lastname: "",
    //     tel: "",
    //   },
    // ],
    dataArray: ["apple", "banana", "orange"],
    dialog_show: false,
    show_dialog: false,
    selectedItem: false,
    student_id: "",
    register_type: "",
    test: "",

    // sortBy: [],
    // privilege: "",
    relation: {
      account_id: "",
      firstname_en: "",
      lastname_en: "",
      username: "",
      tel: "",
    },

    roles: [
      { role: "Super Admin", privilege: "superAdmin" },
      { role: "Admin", privilege: "admin" },
      { role: "โค้ช", privilege: "โค้ช" },
      { role: "ผู้ปกครอง", privilege: "ผู้ปกครอง" },
      { role: "นักเรียน", privilege: "นักเรียน" },
    ],
    people: [
      { id: 1, name: "John Doe", email: "johndoe@example.com", age: 30 },
      { id: 2, name: "Jane Doe", email: "janedoe@example.com", age: 25 },
      { id: 3, name: "Bob Smith", email: "bobsmith@example.com", age: 40 },
    ],
    headers: [
      { text: "ชื่อ", value: "student.firstNameTh", sortable: false },
      { text: "นามสกุล", value: "student.lastNameTh", sortable: false },
      { text: "ชื่อคอร์ส", value: "cpo.categoryNameTh", sortable: false },
      { text: "แพ็คเกจ", value: "cpo.packageName", sortable: false },
      { text: "โค้ช", value: "coachName", sortable: false },
      { text: "ประเภท", value: "oneid", sortable: false },
      { text: "ระยะเวลา", value: "cpo.optionName", sortable: false },
      { text: "วัน", value: "days", sortable: false },
      { text: "เวลาเริ่ม", value: "period.start", sortable: false },
      { text: "เวลาสิ้นสุด", value: "period.end", sortable: false },
    ],
    headersTabs: [
      { text: "ชื่อ", value: "student.firstNameTh", sortable: false },
      { text: "นามสกุล", value: "student.lastNameTh", sortable: false },
      { text: "ชื่อคอร์ส", value: "cpo.categoryNameTh", sortable: false },
      { text: "แพ็คเกจ", value: "cpo.packageName", sortable: false },
      { text: "โค้ช", value: "coachName", sortable: false },
      { text: "ประเภท", value: "oneid", sortable: false },
      { text: "ระยะเวลา", value: "cpo.optionName", sortable: false },
      { text: "วัน", value: "days", sortable: false },
      { text: "เวลาเริ่ม", value: "period.start", sortable: false },
      { text: "เวลาสิ้นสุด", value: "period.end", sortable: false },
      { text: "ราคา", value: "price", sortable: false },
    ],
    period: ["admin", "Super admin", "โค้ช", "ผู้ปกครอง"],
    breadcrumbs: [
      { text: "จัดการผู้ใช้งาน", to: "UserList" },
      { text: "แก้ไขข้อมูลผู้ใช้งาน", to: "" },
    ],
    title: "ข้อมูลผู้ใช้งาน",
    title2: "การจัดการสิทธิ์",
    title3: "ข้อมูลคอร์สเรียน",
    addStudentData: "เพิ่มข้อมูลผู้ใช้นักเรียน",
    addParentData: "เพิ่มข้อมูลผู้ใช้ของผู้ปกครอง",
    rules: {
      name: [
        (val) =>
          (val || "").length > 0 ||
          "ชื่อผู้ใช้ไม่ถูกต้อง กรุณาตรวจสอบใหม่อีกครั้ง",
      ],
      username: [
        () =>
          !this.isMatch ? "ชื่อผู้ใช้ไม่ถูกต้อง กรุณาตรวจสอบใหม่อีกครั้ง " : "",
      ],
      email: [
        (value) => !!value || "Required.",
        (value) => (value || "").length <= 20 || "Max 20 characters",
        (value) => {
          const pattern =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || "Invalid e-mail.";
        },
      ],
    },

    clickCount: 0,
  }),
  beforeCreate() {
    for (const item_relation of this.data_user_relation_management) {
      console.log("test", item_relation.studentId);
      this.student_id = item_relation.studentId;
    }
  },
  created() {},
  beforeMount() {
    this.params = this.$route.params.account_id;
    for (const item_relation of this.data_user_relation_management) {
      console.log("test", item_relation.studentId);
      this.student_id = item_relation.studentId;
    }
  },
  mounted() {
    if (this.$route.params.action == "edit") {
      this.isMatch = true;
      if (
        this.user_data.selectedbox ==
        this.user_data.privilege.includes("นักเรียน")
      ) {
        console.log("นักเรียน");
        this.user_data.isCardOpen = true;
      }
      if (this.user_data.selectedbox == false) {
        console.log("ปิดนักเรียน");
        this.user_data.isCardOpen = false;
      } else if (
        this.user_data.selectedbox ==
        this.user_data.privilege.includes("ผู้ปกครอง")
      ) {
        this.user_data.isCardParentOpen = true;
      }
    }
  },
  methods: {
    ...mapActions({
      changeDialogRegisterOneId: "RegisterModules/changeDialogRegisterOneId",
      changeStudentsData: "UserManageModules/changeStudentsData",
      changeParentData: "UserManageModules/changeParentData",
      ChangeCardStudens: "UserManageModules/ChangeCardStudens",
      GetShowById: "UserModules/GetShowById",
      GetStudentSchedule: "UserModules/GetStudentSchedule",
      GetDataRelationsManagement:
        "UserManageModules/GetDataRelationsManagement",
      GetUserById: "UserModules/GetUserById",
      checkUsernameOneid: "loginModules/checkUsernameOneid",
      AddRelations: "RegisterModules/AddRelations",
    }),
    openFileSelector() {
      this.$refs.fileInput.click();
    },
    selectRole() {
      this.selectRoles;
    },

    // uploadFile() {
    //   this.file = this.$refs.fileInput.files[0];
    //   if (!this.file) return;
    //   const reader = new FileReader();
    //   reader.onload = (e) => {
    //     this.previewUrl = e.target.result;
    //   };
    //   reader.readAsDataURL(this.file);
    // },

    uploadFile() {
      this.file = this.$refs.fileInput.files[0];
      console.log("file=>", this.file);
      if (!this.file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.preview_url = e.target.result;
      };
      reader.readAsDataURL(this.file);
    },

    // checkUsername() {
    //   return this.isMatch == false
    //     ? "ชื่อผู้ใช้ไม่ถูกต้อง กรุณาตรวจสอบใหม่อีกครั้ง"
    //     : "";
    // },

    checkData() {
      if (
        this.dataArray.includes(
          this.user_data.username_en ||
            this.students.username ||
            this.parents.username
        )
      ) {
        this.isMatch = true;
        this.isNotMatch = false;
      } else {
        this.isMatch = false;
        this.isNotMatch = true;
        this.username_alert = "ชื่อผู้ใช้ไม่ถูกต้อง กรุณาตรวจสอบใหม่อีกครั้ง ";
        console.log(this.username_alert, "--> false");
      }
    },

    validate(e, type) {
      inputValidation(e, type);
    },
    checkPhoneNumber() {
      let x = this.user_data.phone_num.replace(/\D/g, "");
      x = x.match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
      console.log(x);
      this.user_data.phone_num = !x[2]
        ? x[1]
        : x[1] + "-" + x[2] + (x[3] ? "-" + x[3] : "");
    },

    openDialog() {
      this.dialog_show = true;
      this.isDisabled = true;
      this.isEnabled = false;
      this.show_sucsess = true;
    },

    closeDialog() {
      this.dialog_show = false;
      this.saved = true;
      this.add_relations = false;
      this.show_sucsess = false;
      this.relation = {
        account_id: "",
        firstname_en: "",
        lastname_en: "",
        username: "",
        tel: "",
      };
    },

    edit() {
      this.isDisabled = false;
      this.isEnabled = true;
    },

    onClick() {
      if (this.clickCount === 0) {
        // Show modal on the first click
        this.dialog_show = true;
        this.clickCount++;
      } else {
        // Navigate to another page on the second click
        this.$router.push({ name: "Finance" });
      }
    },

    onCheckboxChange() {
      if (this.user_data.selectedbox) {
        // Checkbox is selected, open the card
        this.user_data.isCardOpen = true;
      } else {
        // Checkbox is unselected, close the card
        this.user_data.isCardOpen = false;
      }
    },

    onCheckboxChangeParent() {
      if (this.user_data.selectedboxParent) {
        // Checkbox is selected, open the card
        this.user_data.isCardParentOpen = true;
      } else {
        // Checkbox is unselected, close the card
        this.user_data.isCardParentOpen = false;
      }
    },

    addStudentsCard() {
      this.students.students_detail.push({
        username: "",
        firstname: "",
        lastname: "",
        tel: "",
      });
      this.ChangeCardStudens(this.students);
    },

    removeCardStudent(index) {
      this.students.students_detail.splice(index, 1);
      this.ChangeCardStudens(this.students);
    },
    removeRelations(index) {
      console.log("wait API Delete Relations", index);
    },
    remove(item) {
      console.log(item, "dddd");
      const index = this.selectRoles.indexOf(item.role);
      this.selectRoles.splice(index, 1);

      // console.log(index, "sss");
      // if (index >= 0) this.roles.splice(index, 1);
    },

    checkUsername(username, type) {
      if (username) {
        this.checkUsernameOneid({
          username: username,
          status: "",
          type: type,
        }).then(() => {
          console.log("user_data", this.user_data);
          console.log("typ test", type);
          if (type === "student") {
            console.log("user_student_data", this.course_order.students.filter);
            if (this.user_student_data.length > 0) {
              this.course_order.students.filter(
                (v) => v.username === username
              )[0].firstname_en = this.user_student_data[0].firstNameEng;
              this.course_order.students.filter(
                (v) => v.username === username
              )[0].lastname_en = this.user_student_data[0].lastNameEng;
              this.course_order.students.filter(
                (v) => v.username === username
              )[0].firstname_th = this.user_student_data[0].firstNameTh;
              this.course_order.students.filter(
                (v) => v.username === username
              )[0].lastname_th = this.user_student_data[0].lastNameTh;
              this.course_order.students.filter(
                (v) => v.username === username
              )[0].student_name = `${this.user_student_data[0].firstNameEng} ${this.user_student_data[0].lastNameEng} `;
              this.course_order.students.filter(
                (v) => v.username === username
              )[0].tel = this.user_student_data[0].mobileNo;
              this.course_order.students.filter(
                (v) => v.username === username
              )[0].username = username;
              this.course_order.students.filter(
                (v) => v.username === username
              )[0].account_id = this.user_student_data[0].userOneId;
            } else {
              this.course_order.students.filter(
                (v) => v.username === username
              )[0].firstname_en = "";
              this.course_order.students.filter(
                (v) => v.username === username
              )[0].lastname_en = "";
              this.course_order.students.filter(
                (v) => v.username === username
              )[0].student_name = "";
              this.course_order.students.filter(
                (v) => v.username === username
              )[0].tel = "";
              this.course_order.students.filter(
                (v) => v.username === username
              )[0].username = username;
              this.course_order.students.filter(
                (v) => v.username === username
              )[0].account_id = "";
            }
          } else {
            if (this.user_data.length > 0) {
              if (this.edit_parent) {
                this.edit_parent = false;
              }
              this.relation = {
                account_id: this.user_data[0].userOneId,
                username: username,
                firstname_en: this.user_data[0].firstNameEng,
                lastname_en: this.user_data[0].lastNameEng,
                tel: this.user_data[0].mobileNo,
              };
              console.log("course_order", this.course_order);

              if (
                this.course_order.students.filter(
                  (v) => v.is_other === false
                )[0].parents.length > 0
              ) {
                let parents = this.course_order.students.filter(
                  (v) => v.is_other === false
                )[0].parents;
                parents[0].firstname_en = this.user_data[0].firstNameEng;
                parents[0].lastname_en = this.user_data[0].lastNameEng;
                parents[0].tel = this.user_data[0].mobileNo;
                parents[0].account_id = this.user_data[0].userOneId;
                parents[0].username = username;
              }
            }
          }
        });
      } else {
        this.user_data = [];
      }
    },

    openAddRelationsDialog() {
      this.add_relations = true;
    },
    registerParent() {
      this.register_type = "parent";
      this.register_type = "student";
      // this.changeCourseOrderData(this.course_order)
      this.changeDialogRegisterOneId(true);
    },
    addParent() {
      Swal.fire({
        icon: "question",
        title: "คุณต้องการเพิ่มผู้ปกครองหรือไม่",
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: "ตกลง",
        cancelButtonText: "ยกเลิก",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            let config = {
              headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-type": "Application/json",
                Authorization: `Bearer ${VueCookie.get("token")}`,
              },
            };

            console.log("object", this.user_data);
            for (const data of this.user_data) {
              console.log("data", data);
              this.set_parent_id = data.userOneId;
              console.log("userOneId", this.set_parent_id);
            }
            let payload = {
              studentId:
                this.show_by_id
                  ?.map((val) => {
                    return val.roleId;
                  })
                  .join() == "R_4"
                  ? this.show_by_id
                      .map((val) => {
                        return val.roleId;
                      })
                      .join()
                  : this.$route.params.account_id,
              parentId: this.set_parent_id,
            };
            console.log("payload :", payload);
            let { data } = await axios.post(
              `${process.env.VUE_APP_URL}/api/v1/relations/user`,
              payload,
              config
            );

            if (data.statusCode === 201) {
              if (data.data && data.data.message !== "Duplicate relation.") {
                console.log("succes");
                this.add_relationt = false;
                // this.GetAll(this.user_login.account_id);
                setTimeout(() => {
                  this.GetDataRelationsManagement(this.data_user_by_id);
                }, 1000);
                this.relation = {
                  account_id: "",
                  firstname_en: "",
                  lastname_en: "",
                  username: "",
                  tel: "",
                };
              } else {
                throw { error: data };
              }
            } else {
              throw { message: data.message };
            }
          } catch (error) {
            console.log(error);
            Swal.fire({
              icon: "error",
              title: "Duplicate relation",
            });
          }
        } else {
          Swal.fire("ข้อมูลของคุณจะไม่บันทึก", "", "info");
        }
      });
    },
    addStudent() {
      Swal.fire({
        icon: "question",
        title: "คุณต้องการเพิ่มนักเรียนหรือไม่",
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: "ตกลง",
        cancelButtonText: "ยกเลิก",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            let config = {
              headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-type": "Application/json",
                Authorization: `Bearer ${VueCookie.get("token")}`,
              },
            };
            this.user_login = JSON.parse(localStorage.getItem("userDetail"));
            console.log("addStudent", this.user_data);
            for (const data of this.user_data) {
              console.log("addStudent_data", data);
              this.set_student_id = data.userOneId;
              console.log("userOneId", this.set_student_id);
            }
            let payload = {
              studentId: this.set_student_id,
              parentId: this.$route.params.account_id,
            };
            console.log("payload_addStudent :", payload);
            let { data } = await axios.post(
              `${process.env.VUE_APP_URL}/api/v1/relations/user`,
              payload,
              config
            );

            if (data.statusCode === 201) {
              if (data.data && data.data.message !== "Duplicate relation.") {
                console.log("succes");
                this.add_parent = false;
                this.add_student = false;
                this.user_login = JSON.parse(
                  localStorage.getItem("userDetail")
                );
                // this.GetAll(this.user_login.account_id);
                setTimeout(() => {
                  this.GetDataRelationsManagement(this.data_user_by_id);
                }, 1000);
                this.student = {
                  account_id: "",
                  firstname_en: "",
                  lastname_en: "",
                  username: "",
                  tel: "",
                };
              } else {
                throw { error: data };
              }
            } else {
              throw { message: data.message };
            }
          } catch (error) {
            console.log(error);
            Swal.fire({
              icon: "error",
              title: "Duplicate relation",
            });
          }
        } else {
          Swal.fire("ข้อมูลของคุณจะไม่บันทึก", "", "info");
        }
      });
    },

    async updateData(account_id) {
      console.log("user_account_id", account_id);
      Swal.fire({
        icon: "question",
        title: "คุณต้องการแก้ไขข้อมูลหรือไม่",
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: "ตกลง",
        cancelButtonText: "ยกเลิก",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            let config = {
              headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-type": "Application/json",
                Authorization: `Bearer ${VueCookie.get("token")}`,
              },
            };

            let payload = {
              firstNameTh: this.show_by_id.firstNameTh,
              lastNameTh: this.show_by_id.lastNameTh,
              firstNameEng: this.show_by_id.firstNameEng,
              lastNameEng: this.show_by_id.lastNameEng,
              email: this.show_by_id.email,
              mobileNo: this.show_by_id.mobileNo,
              role: [
                {
                  roleId: "",
                },
              ],
              // roles: [
              //   {
              //     roleId: this.item.roleId,
              //   },
              // ],
            };

            let user_account_id = this.$route.params.account_id;

            let { data } = await axios.patch(
              `${process.env.VUE_APP_URL}/api/v1/usermanagement/update/${user_account_id}`,
              config,
              payload
            );
            if (data.statusCode === 200) {
              this.dialog_show = true;
            } else {
              throw { error: data };
            }
          } catch (error) {
            console.log(error);
            Swal.fire({
              icon: "error",
              title: error.message,
            });
          }
        } else {
          Swal.fire("ข้อมูลของคุณจะไม่บันทึก", "", "info");
        }
      });
    },
  },
  computed: {
    ...mapGetters({
      show_dialog_register_one_id: "RegisterModules/getShowDialogRegisterOneId",
      students: "UserManageModules/getStudent",
      // user_data: "UserManageModules/getUserData",
      parents: "UserManageModules/getParent",
      show_by_id: "UserModules/getShowById",
      student_schedule: "UserModules/getStudentSchedule",
      data_user_relation_management:
        "UserManageModules/getDataRelationsManagement",
      data_user_by_id: "UserModules/getUserById",
      user_one_id: "loginModules/getUserOneId",
      user_data: "loginModules/getUserData",
      is_loading: "loginModules/getIsLoading",
      user_student_data: "loginModules/getUserStudentData",
      last_user_registered: "RegisterModules/getLastUserRegistered",
    }),

    isInputValid() {
      return console.log("ABC");
      // this.user_data.username_en.trim().length > 0 &&
      // this.user_data.fname_th.trim().length > 0 &&
      // this.user_data.lname_th.trim().length > 0 &&
      // this.user_data.fname_en.trim().length > 0 &&
      // this.user_data.lname_en.trim().length > 0 &&
      // this.user_data.email.trim().length > 0 &&
      // this.user_data.phone_num.trim().length > 0
      // this.sortBy.trim().length > 0 &&
      // this.students.username.trim().length > 0 &&
      // this.student.firstname.trim().length > 0 &&
      // this.student.lastname.trim().length > 0 &&
      // this.selectedbox.trim().length > 0 &&
      // this.student.tel.detail.trim().length > 0
    },

    MobileSize() {
      const { xs } = this.$vuetify.breakpoint;
      return !!xs;
    },
    IpadSize() {
      const { sm } = this.$vuetify.breakpoint;
      return !!sm;
    },
  },
  watch: {
    last_user_registered: async function (val) {
      this.add_parent = false;
      this.add_student = false;

      console.log(this.last_user_registered);
      console.log("val", val);
      if (this.last_user_registered.type === "parent") {
        this.AddRelations({
          studentId: this.$route.params.account_id,
          parentId: this.last_user_registered.account_id,
        }).then(() => {
          this.GetDataRelationsManagement(this.data_user_by_id);
        });
      } else if (this.last_user_registered.type === "student") {
        this.AddRelations({
          parentId: this.$route.params.account_id,
          studentId: this.last_user_registered.account_id,
        }).then(() => {
          this.GetDataRelationsManagement(this.data_user_by_id);
        });
      }
      this.dialog_parent = false;
    },
    "data_user_relation_management.length": function () {
      // for (const item_relation of this.data_user_relation_management) {
      //   this.GetStudentSchedule(item_relation.studentId);
      //   console.log("test", item_relation.studentId);
      // }

      for (const show_data of this.show_by_id.userRoles) {
        console.log("show_data", show_data);
        if (show_data.roleId == "R_4") {
          if (this.data_user_relation_management.length > 0) {
            this.isOpenParent = true;
            for (const item_relation of this.data_user_relation_management) {
              this.GetStudentSchedule(item_relation.studentId);
            }
          } else {
            this.data_user_relation_management = [];
          }
        } else if (show_data.roleId == "R_5") {
          if (this.data_user_relation_management.length > 0) {
            this.isOpenStudent = true;
            for (const item_relation of this.data_user_relation_management) {
              this.GetStudentSchedule(item_relation.studentId);
            }
          } else {
            this.data_user_relation_management = [];
          }
        } else {
          console.log("show_data", show_data.roleId);
        }
      }
    },
  },
};
</script>
  <style scoped>
.img-one {
  width: 140px;
  height: 60px;
}
.btn-manage {
  position: absolute;
  left: 86%;
  top: 95%;
}
.upload-photo {
  border-color: #ff6b81;
}

.profileCard {
  min-height: 200px;
  min-width: 200px;
  max-height: 200px;
  max-width: 200px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.iconInCard {
  min-height: 200px;
  min-width: 200px;
  max-height: 200px;
  max-width: 200px;
}

.profileInCard {
  min-height: 160px;
  min-width: 160px;
  max-height: 160px;
  max-width: 160px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.camera {
  position: absolute;
  margin-left: 60px;
}
</style>
  
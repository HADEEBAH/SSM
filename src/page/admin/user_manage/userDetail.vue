<template>
  <v-container class="overflow-x-hidden overflow-y-hidden">
    <div v-if="$route.params.action == 'view'">
      <v-row dense>
        <!-- {{ $route.params.action }} {{ $route.params.account_id }} -->
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

            <v-card class="mt-10 ml-5 mr-5" color="#FCFCFC">
              <v-card-text class="mt-3">
                <v-row align="center">
                  <v-col>
                    <label-custom text="Username(English)"></label-custom>
                    <div v-if="!isEnabled">
                      {{ user_data.username_en }}
                      <v-icon class="ml-5">mdi-check</v-icon>
                    </div>
                    <div v-else>
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
                    </div>
                  </v-col>
                  <v-col sm="auto">
                    <v-img
                      class="img-one mb-2"
                      align="center"
                      src="@/assets/manageuser/logo_one platform.svg"
                  /></v-col>
                </v-row>
              </v-card-text>
            </v-card>
            <br />

            <div>
              <v-tabs
                v-model="tab"
                background-color="transparent"
                color="pink"
                grow
              >
                <v-tab v-for="item in items" :key="item">
                  {{ item }}
                </v-tab>
              </v-tabs>
              <!-- TABS 1 -->
              <v-expand-x-transition transition="scale-transition">
                <div v-if="tab === 0">
                  <!-- ข้อมูลทั้่วไป -->

                  <v-card class="mt-10 ml-5 mr-5" color="#FCFCFC">
                    <v-card-text class="mt-3">
                      <v-row>
                        <v-col cols="12" sm="3">
                          <div class="profileCard">
                            <v-img
                              src="@/assets/userManagePage/imgcard.png"
                              class="imageInCard drop-shadow-md"
                            >
                            </v-img>
                            <div style="position: absolute">
                              <v-card-text class="upload-photo pa-3">
                                <!-- <img
                                  :src="user_data.previewUrl"
                                  class="rounded-full"
                                  style="height: 100%; width: 100%"
                                /> -->
                                <v-img
                                  src="@/assets/userManagePage/uploadPhoto.png"
                                  max-height="30"
                                  max-width="30"
                                >
                                </v-img>
                              </v-card-text>
                            </div>
                          </div>
                        </v-col>
                        <v-col class="ml-5">
                          <v-row>
                            <v-col cols="12" sm="6">
                              <label-custom
                                text="ชื่อ (ภาษาไทย)"
                              ></label-custom>
                              <div v-if="!isEnabled">
                                {{ user_data.fname_th }}
                              </div>
                              <div v-else>
                                <v-text-field
                                  v-bind:disabled="isDisabled"
                                  @keypress="validate($event, 'th')"
                                  placeholder=""
                                  v-model="user_data.fname_th"
                                  outlined
                                  dense
                                >
                                </v-text-field>
                              </div>
                            </v-col>

                            <v-col cols="12" sm="6">
                              <label-custom
                                text="นามสกุล (ภาษาไทย)"
                              ></label-custom>
                              <div v-if="!isEnabled">
                                {{ user_data.lname_th }}
                              </div>
                              <div v-else>
                                <v-text-field
                                  v-bind:disabled="isDisabled"
                                  @keypress="validate($event, 'th')"
                                  placeholder=""
                                  v-model="user_data.lname_th"
                                  :rules="rules.name"
                                  outlined
                                  dense
                                >
                                </v-text-field>
                              </div>
                            </v-col>
                          </v-row>

                          <v-row>
                            <v-col cols="12" sm="6">
                              <label-custom
                                text="First Name (English)"
                              ></label-custom>
                              <div v-if="!isEnabled">
                                {{ user_data.fname_en }}
                              </div>
                              <div v-else>
                                <v-text-field
                                  v-bind:disabled="isDisabled"
                                  @keypress="validate($event, 'en')"
                                  placeholder=""
                                  v-model="user_data.fname_en"
                                  :rules="rules.name"
                                  outlined
                                  dense
                                ></v-text-field>
                              </div>
                            </v-col>
                            <v-col cols="12" sm="6">
                              <label-custom
                                text="Last Name (English)"
                              ></label-custom>

                              <div v-if="!isEnabled">
                                {{ user_data.lname_en }}
                              </div>
                              <div v-else>
                                <v-text-field
                                  v-bind:disabled="isDisabled"
                                  @keypress="validate($event, 'en')"
                                  placeholder=""
                                  v-model="user_data.lname_en"
                                  :rules="rules.name"
                                  outlined
                                  dense
                                >
                                </v-text-field>
                              </div>
                            </v-col>
                          </v-row>

                          <v-row>
                            <v-col cols="12" sm="6">
                              <label-custom text="อีเมล"></label-custom>
                              <div v-if="!isEnabled">{{ user_data.email }}</div>
                              <div v-else>
                                <v-text-field
                                  v-bind:disabled="isDisabled"
                                  @keypress="validate($event, 'en', 'number')"
                                  placeholder=""
                                  v-model="user_data.email"
                                  :rules="rules.email"
                                  outlined
                                  dense
                                >
                                </v-text-field>
                              </div>
                            </v-col>
                            <v-col cols="12" sm="6">
                              <label-custom text="เบอร์โทรศัพท์"></label-custom>
                              <div v-if="!isEnabled">
                                {{ user_data.phone_num }}
                              </div>
                              <div v-else>
                                <v-text-field
                                  v-bind:disabled="isDisabled"
                                  @keypress="validate($event, 'en', 'number')"
                                  placeholder=""
                                  v-model="user_data.email"
                                  :rules="rules.email"
                                  outlined
                                  dense
                                  required
                                  @input="checkPhoneNumber"
                                  maxlength="12"
                                >
                                </v-text-field>
                              </div>
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>

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
                        <v-col cols="12" sm="6">
                          <label-custom text="บทบาทผู้ใช้งาน"></label-custom>
                          <div>{{ user_data.privilege }}</div>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>

                  <!-- check box -->
                  <v-row>
                    <v-col
                      cols="12"
                      sm="6"
                      class="ml-10"
                      v-if="user_data.privilege.includes('ผู้ปกครอง')"
                    >
                      <v-checkbox
                        v-model="user_data.selectedbox"
                        label="ต้องการเพิ่มนักเรียนในการดูแล"
                        value="Jacob"
                        color="pink"
                        item-color="pink"
                        @change="onCheckboxChange"
                      ></v-checkbox>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col
                      cols="12"
                      sm="6"
                      class="ml-10"
                      v-if="user_data.privilege.includes('นักเรียน')"
                    >
                      <v-checkbox
                        v-model="user_data.selectedboxParent"
                        label="ต้องการเพิ่มผู้ปกครอง"
                        value="parent"
                        color="pink"
                        item-color="pink"
                        @change="onCheckboxChangeParent"
                      ></v-checkbox>
                    </v-col>
                  </v-row>

                  <div v-if="user_data.isCardOpen">
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
                      v-for="(student, student_index) in students"
                      :key="`${student_index}-student`"
                    >
                      <v-card-text class="mt-3">
                        <v-row dense>
                          <v-col align="right">
                            <v-icon
                              larg
                              color="#FF6B81"
                              @click="removeCardStudent(student_index)"
                              v-if="student.length >= 2"
                            >
                              mdi-delete
                            </v-icon>
                          </v-col>
                        </v-row>
                        <!-- Student Data -->
                        <v-row dense align="center">
                          <v-col cols="12" sm="6">
                            <label-custom
                              text="Student’s Username (English)"
                            ></label-custom>
                            <div>{{ student.username }}</div>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <label-custom
                              text="First Name (English)"
                            ></label-custom>
                            <div>
                              {{ student.firstname }}
                            </div>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <label-custom
                              text="Last Name (English)"
                            ></label-custom>
                            <div>{{ student.lastname }}</div>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <label-custom text="เบอร์โทรศัพท์"></label-custom>
                            <div>{{ student.tel }}</div>
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>
                    <!-- TABLE -->
                    <!-- :items="datausers"
                  :search="search"
                  :page.sync="page"
                  :items-per-page="itemsPerPage"
                  :sort-by="user_data.sortBy" -->
                    <div class="my-5 mx-10">
                      <v-data-table
                        :headers="headers"
                        @page-count="pageCount = $event"
                        class="elevation-1 header-table"
                      >
                        <template v-slot:[`item.actions`]="{ item }">
                          <v-icon small color="#FF6B81">
                            mdi-eye-outline
                          </v-icon>
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

                  <!-- Card Add Parent -->
                  <div v-if="user_data.isCardParentOpen">
                    <headerCard
                      class="ml-6 mt-8"
                      :icon="'mdi-file-plus-outline'"
                      :icon_color="'#FF6B81'"
                      :title="addParentData"
                    ></headerCard>
                    <v-divider class="mx-10"></v-divider>
                    <v-card class="mt-10 ml-10 mr-10" color="#FCFCFC">
                      <v-card-text class="mt-3">
                        <v-row dense align="center">
                          <v-col cols="12" sm="6">
                            <label-custom
                              text="Parent’s Username (English)"
                            ></label-custom>
                            <div>{{ parents.username }}</div>
                          </v-col>

                          <v-col cols="12" sm="6">
                            <label-custom
                              text="First Name (English)"
                            ></label-custom>
                            <div>{{ parents.firstname }}</div>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <label-custom
                              text="Last Name (English)"
                            ></label-custom>
                            <div>{{ parents.lastname }}</div>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <label-custom text="เบอร์โทรศัพท์"></label-custom>
                            <div>{{ parents.tel }}</div>
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </div>
                  <!-- Button -->
                  <div v-if="!isEnabled">
                    <v-row>
                      <v-col class="text-right mt-5 mr-10">
                        <v-btn
                          class="white--text mb-5"
                          depressed
                          color="#ff6b81"
                          @click="edit()"
                        >
                          <span class="mdi mdi-pencil-outline">แก้ไข</span>
                        </v-btn>
                      </v-col>
                    </v-row>
                  </div>
                  <div v-else class="text-right mt-5 mr-10">
                    <v-row>
                      <v-col align="right" sm="" cols="12">
                        <v-btn
                          :class="
                            $vuetify.breakpoint.smAndUp
                              ? 'btn-size-lg'
                              : 'w-52 ml-10'
                          "
                          class="white--text mb-5"
                          outlined
                          color="error"
                          @click="cancel()"
                        >
                          ยกเลิก
                        </v-btn>
                      </v-col>
                      <v-col sm="auto" cols="12">
                        <v-btn
                          :class="
                            $vuetify.breakpoint.smAndUp
                              ? 'btn-size-lg'
                              : 'w-52 ml-10'
                          "
                          class="white--text mb-5"
                          depressed
                          color="#ff6b81"
                          @click="submitEdit()"
                        >
                          บันทึก
                        </v-btn>
                      </v-col>
                    </v-row>
                  </div>
                  <!-- ปิดข้อมูลผู้ใช้งาน -->
                </div>
              </v-expand-x-transition>
              <!-- TabS 2 -->
              <v-expand-x-transition>
                <div v-if="tab === 1" class="ml-6 mt-8">
                  <headerCard
                    class="ml-6 mt-8"
                    :icon="'mdi-calendar-today'"
                    :icon_color="'#FF6B81'"
                    :title="title3"
                  ></headerCard>
                  <v-divider class="mx-10"></v-divider>
                  <v-row class="mt-5 ml-6 mt-8">
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="search"
                        prepend-inner-icon="mdi-magnify"
                        label="ค้นหา"
                        single-line
                        hide-details
                        dense
                        outlined
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <!-- Table -->
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
              </v-expand-x-transition>
              <!-- Tabs 3 -->
              <div v-if="tab === 2" class="ml-6 mt-8">
                <headerCard
                  class="ml-6 mt-8"
                  :icon="'mdi-calendar-today'"
                  :icon_color="'#FF6B81'"
                  :title="title3"
                ></headerCard>
                <v-divider class="mx-10"></v-divider>
                <v-row class="mx-5 my-5">
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="search"
                      prepend-inner-icon="mdi-magnify"
                      label="ค้นหา"
                      hide-details
                      dense
                      outlined
                      color="pink"
                    ></v-text-field>
                 
                  
                  </v-col>

                  <v-col cols="12" sm="6" align="right">
                    <label
                      class="pink--text cursor-pointer mt-5"
                      @click="addCertificateDialog('add')"
                      ><span class="mdi mdi-file-plus-outline"></span>
                      เพิ่มการแข่งขันและเกียรติบัตร
                    </label>
                  </v-col>
                </v-row>
                <!-- Card Certificate -->

                <v-card
                  class="mb-5"
                  v-for="(item, index) in students.certificates"
                  :key=index
                >
                <div class="mx-5 my-5">
                  <v-row>
                    <v-col cols="12" sm="6" class="ml-5 front-bold">{{ item.name_certificate }}</v-col>
                    <v-col cols="12" sm="">วันที่แข่ง:{{ item.certificate_date }}</v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="8">
                      <v-row>
                        <v-col cols="1">
                          <v-img
                            src="@/assets/userManagePage/certificate .png"
                            width="50px"
                            height="50px"
                            contain
                          ></v-img>
                        </v-col>
                        <v-col cols="" align-self="center"><span class="pink--text underline underline-offset-2">{{item.fileName }}</span></v-col>
                      </v-row>
                    </v-col>

                    <v-col cols="4" align="end">
                      <v-row>
                        <v-col cols="10" align="end">
                          <v-btn
                            v-if="!item.previewUrl"
                            depressed
                            class="white--text"
                            color="#ff6b81"
                            @click="editCertificateDialog(item, index)"
                          >
                            <span class="mdi mdi-plus"></span> เพิ่มหนังสือรับรอง
                          </v-btn>
                          <v-btn
                            v-else
                            depressed
                            class="white--text"
                            color="#ff6b81"
                            @click="detailCertificateDialog(item, index)"
                          >
                            แสดงหนังสือรับรอง
                          </v-btn>
                        </v-col>

                        <v-col cols="2" align="end">
                          <v-icon
                            larg
                            color="#FF6B81"
                            @click="removeCertificate(index)"
                            v-if="students.certificates.length >= 2"
                          >
                            mdi-delete
                          </v-icon>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </div>
                  
                </v-card>

                <!-- DIALOG -->
                <v-dialog
                  class="pa-2"
                  width="50vw"
                  v-model="certificate_dialog_show"
                  persistent
                >
                  <v-card>
                    <v-card-title>
                      {{ selectedIndex }}
                      <v-row>
                        <v-col cols="12" align="right">
                          <v-btn icon @click="closeDialog">
                            <v-icon color="#ff6b81">mdi-close</v-icon>
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-card-title>
                    <div class="mx-5 text-center mb-5">
                      <label-custom
                        text="เพิ่มการแข่งขันและเกียรติบัตร"
                      ></label-custom>
                    </div>

                    <v-row dense class="ml-5 mx-5">
                      <v-col cols="12">
                        <label>การแข่งขัน</label>
                        <v-text-field
                          placeholder="กรุณาระบุชื่อการแข่งขัน"
                          v-model="name_certificate"
                          hide-details
                          outlined
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <label>วันที่</label>
                        <v-text-field
                          placeholder="กรุณาระบุชื่อการแข่งขัน"
                          v-model="certificate_date"
                          hide-details
                          outlined
                        >
                          <template #append>
                            <v-icon>mdi-calendar-today</v-icon>
                          </template>
                        </v-text-field>
                      </v-col>
                    </v-row>
                    <!-- Upload file -->
                    <v-card class="mx-5 my-5" flat>
                      <v-card-text
                        class="border-dashed border-2 border-blue-600 rounded-lg"
                      >
                        <v-row>
                          <v-col
                            cols="12"
                            class="flex align-center justify-center"
                          >
                            <v-img
                              src="@/assets/course/upload_file.png"
                              max-height="105"
                              max-width="122"
                            ></v-img>
                          </v-col>
                          <v-col
                            cols="12"
                            class="flex align-center justify-center text-h5"
                          >
                            อัพโหลดเกียรติบัตร
                          </v-col>
                          <v-col
                            cols="12"
                            class="flex align-center justify-center text-caption"
                          >
                            ( ขนาดไฟล์งานไม่เกิน 500 Mb ต้องเป็นไฟล์ JPG, PNG )
                          </v-col>
                          <v-col
                            cols="12"
                            class="flex align-center justify-center"
                          >
                            <v-btn
                              outlined
                              color="blue"
                              @click="openFileSelector"
                              >เลือกไฟล์</v-btn
                            >
                            <input
                              ref="fileInput"
                              type="file"
                              @change="uploadFile"
                              style="display: none"
                              accept="image/*"
                            />
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>
                    <v-card v-if="fileName !== ''" class="pa-4 ma-4">
                      <v-row>
                        <v-col cols="2">
                          <v-img src="../../../assets/userManagePage/pdfIcon.png" width="30px" height="30px"></v-img>
                        </v-col>
                        <v-col cols="8"><span>{{ fileName }}</span></v-col>
                        <v-col cols="2" align="end"><v-icon @click="removeFile()">mdi-close</v-icon></v-col>
                      </v-row>
                    </v-card>

                    <div class="text-center mx-5 mb-5">
                      <v-btn
                      v-if="status === 'create'"
                        depressed
                        class="white--text"
                        color="#ff6b81"
                        @click="saveDialog()"
                      >
                        บันทึก
                      </v-btn>
                      <v-btn
                      v-else-if="status === 'edit'"
                        depressed
                        class="white--text"
                        color="#ff6b81"
                        @click="saveEditDialog(selectedIndex)"
                      >
                        บันทึก
                      </v-btn>
                      <v-btn
                      v-else
                        depressed
                        class="white--text"
                        color="#ff6b81"
                        @click="certificate_dialog_show = false"
                      >
                        ปิด
                      </v-btn>
                    </div>
                  </v-card>
                </v-dialog>

                <!-- DIALOG SHOW CERTIFICATE -->
                <!-- <v-dialog v-model="certificate_show">
                  <v-row>
                    <v-col cols="12" align="right">
                      <v-btn icon @click="closeDialog">
                        <v-icon color="#ff6b81">mdi-close</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                  <div
                    v-for="(
                      certificate, certificate_index
                    ) in students.certificates"
                    :key="`${certificate_index}-certificate`"
                  >
                    {{ certificate.previewUrl }}
                  </div>
                </v-dialog> -->
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <div v-else>
      <userManageForm></userManageForm>
    </div>
  </v-container>
</template>

<script>
import Swal from "sweetalert2";
import { inputValidation } from "@/functions/functions";
import LabelCustom from "@/components/label/labelCustom.vue";
import headerPage from "@/components/header/headerPage.vue";
import headerCard from "@/components/header/headerCard.vue";
import userManageForm from "@/components/user_menage/userManageForm.vue";
import { mapActions, mapGetters } from "vuex";
export default {
  components: {
    headerPage,
    headerCard,
    userManageForm,
    LabelCustom,
  },
  data: () => ({
    tab: null,
    items: ["ข้อมูลทั่วไป", "คอร์สเรียน", "การแข่งขันและเกียรติบัตร"],
    // text: "Lorem ipsum dolor",
    // text2: "Lorem ipsum dolor2",

    breadcrumbs: [
      { text: "จัดการผู้ใช้งาน", to: "UserList" },
      { text: "เพิ่มผู้ใช้งาน", to: "" },
    ],
    headers: [
      { text: "ชื่อ-นามสกุล", value: "name,lastname", sortable: false },
      { text: "ชื่อคอร์ส", value: "lastname", sortable: false },
      { text: "แพ็คเกจ", value: "email", sortable: false },
      { text: "โค้ช", value: "username", sortable: false },
      { text: "ประเภท", value: "oneid", sortable: false },
      { text: "ระยะเวลา", value: "role", sortable: false },
      { text: "วัน - เวลา", value: "actions", sortable: false },
    ],
    headersTabs: [
      { text: "ชื่อ-นามสกุล", value: "name,lastname", sortable: false },
      { text: "ชื่อคอร์ส", value: "lastname", sortable: false },
      { text: "แพ็คเกจ", value: "email", sortable: false },
      { text: "โค้ช", value: "username", sortable: false },
      { text: "ประเภท", value: "oneid", sortable: false },
      { text: "ระยะเวลา", value: "role", sortable: false },
      { text: "วัน - เวลา", value: "actions", sortable: false },
      { text: "ราคา", value: "price", sortable: false },
    ],

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
    search: "",
    name_certificate: "",
    certificate_date: "",
    certificateType: "",
    title: "ข้อมูลผู้ใช้งาน",
    title2: "การจัดการสิทธิ์",
    title3: "คอร์สเรียน",
    addStudentData: "เพิ่มข้อมูลผู้ใช้นักเรียน",
    addParentData: "เพิ่มข้อมูลผู้ใช้ของผู้ปกครอง",
    selectRoles: [],
    cart_certificate: [],
    isMatch: false,
    isDisabled: false,
    isEnabled: false,
    certificate_show: false,
    addCertificate_dialog_show: false,
    certificate_dialog_show: false,
    fileName: '',
    previewUrl: null,
    status: 'create',
    selectedIndex: ''

  }),
  created() {},
  mounted() {
    if (this.user_data.privilege.includes("นักเรียน")) {
      if (this.user_data.selectedbox == true) {
        this.user_data.isCardOpen = true;
      }
    } else if (this.user_data.privilege.includes("ผู้ปกครอง")) {
      if (this.user_data.selectedbox == true) {
        this.user_data.isCardParentOpen = true;
      }
    } else {
      console.log("object");
      this.user_data.isCardOpen = false;
      this.user_data.isCardParentOpen = false;
    }
    // if (this.selectedbox == this.user_data.privilege.includes("นักเรียน")) {
    //   console.log("ผู้ปกครอง");
    //   console.log("front",this.selectedbox );
    //   console.log(this.user_data.privilege.includes("นักเรียน"));
    //   this.isCardOpen = true;
    // } else if (
    //   this.selectedbox == this.user_data.privilege.includes("ผู้ปกครอง")
    // ) {
    //   console.log("นักเรียน");
    //   this.isCardParentOpen = true;
    // } else {
    //   console.log("outt");
    //   this.isCardOpen = false;
    //   this.isCardParentOpen = false;
    // }
  },
  methods: {
    ...mapActions({
      changeDialogRegisterOneId: "RegisterModules/changeDialogRegisterOneId",
      changeStudentsData: "UserManageModules/changeStudentsData",
      changeUserData: "UserManageModules/changeUserData",
      changeParentData: "UserManageModules/changeParentData",
      changeStudentsCertificate:
        "ChangeStudentsCertificate/ChangeStudentsCertificate",
    }),

    openFileSelector() {
      this.$refs.fileInput.click();
    },

    onCheckboxChange() {
      if (this.selectedbox) {
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
    edit() {
      this.isDisabled = false;
      this.isEnabled = true;
      this.buttonName = "บันทึก";
    },

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
    submitEdit() {
      console.log("submitEdit");
      Swal.fire({
        title: "คุณต้องการแก้ไขข้อมูลหรือไม่",
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: "ตกลง",
        cancelButtonText: "ยกเลิก",
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          Swal.fire("Saved!", "", "success");
        } else if (result.isDenied) {
          Swal.fire("Changes are not saved", "", "info");
        }
      });
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
    addStudents() {
      this.students.push({
        username: "",
        firstname: "",
        lastname: "",
        tel: "",
      });
    },
    DialogCertificate() {
      this.certificate_dialog_show = true;
    },
    closeDialog() {
      this.certificate_dialog_show = false;
      this.certificate_show = false;
      this.addCertificate_dialog_show = false;
    },
    // uploadFile() {
    //   this.file = this.$refs.fileInput.files[0];
    //   this.fileName = this.file.name
    //   console.log(this.file);
    //   if (!this.file) return;
    //   const reader = new FileReader();
    //   reader.onload = (e) => {
    //     console.log(e);
    //     this.previewUrl = e.target.result;
    //   };
    //   reader.readAsDataURL(this.file);
    // },
    uploadFile() {
      this.file = this.$refs.fileInput.files[0];
      console.log("file=>",this.file);
      if (!this.file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.preview_url = e.target.result;
      };
      reader.readAsDataURL(this.file);
    },
    removeFile() {
      this.fileName = ''
    },
    addCertificateCard() {
      this.students.certificates.push({
        name_certificate: "",
        certificate_date: "",
        previewUrl: null,
        
      });
    },
    showCertificate() {
      this.certificate_show = true;
    },

    addCertificateDialog(type) {
      this.status = 'create'
      this.name_certificate = ''
      this.certificate_date = ''
      this.file = ''
      this.fileName = ''
      this.previewUrl = null
      this.certificate_dialog_show = true
      this.certificateType = type
    },
    editCertificateDialog(item, index) {
      this.status = 'edit'
      this.selectedIndex = index
      this.name_certificate = item.name_certificate
      this.certificate_date = item.certificate_date
      this.previewUrl = item.previewUrl
      this.certificate_dialog_show = true
    },
    detailCertificateDialog(item, index) {
      this.status = 'detail'
      this.selectedIndex = index
      this.name_certificate = item.name_certificate
      this.certificate_date = item.certificate_date
      this.previewUrl = item.previewUrl
      this.certificate_dialog_show = true
    },
    saveDialog() {
      console.log("create success", {
        name_certificate: this.name_certificate,
        certificate_date: this.certificate_date,
        previewUrl: this.previewUrl,

      });

      if (this.status == "create") {
        this.students.certificates.push({
          name_certificate: this.name_certificate,
          certificate_date: this.certificate_date,
          previewUrl: this.previewUrl,
          fileName: this.fileName
        });
      }
      this.certificate_dialog_show = false;
    },
    saveEditDialog(index) {
      console.log("create success", {
        name_certificate: this.name_certificate,
        certificate_date: this.certificate_date,
        previewUrl: this.previewUrl,
      });

      if (this.status !== "create") {
        console.log('edit select array', this.students.certificates[index]);
        this.students.certificates[index].name_certificate = this.name_certificate;
        this.students.certificates[index].certificate_date = this.certificate_date;
        this.students.certificates[index].previewUrl = this.previewUrl;
        this.students.certificates[index].fileName = this.fileName;
      }
      this.certificate_dialog_show = false;
    },
    removeCertificate(index) {
      this.students.certificates.splice(index, 1);
    }

  },
  computed: {
    ...mapGetters({
      show_dialog_register_one_id: "RegisterModules/getShowDialogRegisterOneId",
      students: "UserManageModules/getStudent",
      user_data: "UserManageModules/getUserData",
      parents: "UserManageModules/getParent",
      certificates: "UserManageModules/getCertificate",
    }),
  },
  watch: {},
};
</script>

<style scoped>
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

.imageInCard {
  min-height: 200px;
  min-width: 200px;
  max-height: 200px;
  max-width: 200px;
}
</style>
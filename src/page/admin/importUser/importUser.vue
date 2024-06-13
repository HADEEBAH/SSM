<template>
  <v-container>
    <headerPage :title="$t('import user')" slot_tag>
      <template>
        <v-row dense>
          <v-col>
            <v-btn
              outlined
              dense
              color="#ff6b81"
              @click="downloadTemplateFile()"
            >
              <v-icon>mdi-download-box-outline</v-icon>
              <span>{{ $t("download template") }}</span>
            </v-btn>
          </v-col>
          <!-- <v-col>
                      <v-btn depressed dark dense color="#ff6b81">
                          <v-icon>mdi mdi-upload-box</v-icon>
                          <span>upload template</span>
                      </v-btn>
                  </v-col> -->
        </v-row>
      </template>
    </headerPage>
    <v-card
      v-if="!fileStudent && !fileParent && !returnFile"
      outlined
      class="text-center"
    >
      <v-card-text>
        <v-row>
          <v-col>
            {{ $t("please upload file") }}
          </v-col>
        </v-row>
        <v-row dense>
          <v-col>
            <v-btn
              depressed
              dark
              dense
              color="#ff6b81"
              @click="openFileSeleter()"
            >
              <v-icon>mdi mdi-upload-box</v-icon>
              <span>{{ $t("upload template") }}</span>
            </v-btn>
          </v-col>
        </v-row>
        <input
          ref="fileInput"
          style="display: none"
          type="file"
          @input="handleFileChange"
          accept=".xlsx"
        />
      </v-card-text>
    </v-card>
    <div
      v-if="!fileStudent && !fileParent && !returnFile"
      class="text-red-700 my-1"
    >
      <strong> * {{ $t("cannot use file extensions other than XLSX") }}</strong>
      <br />
      <strong>
        *
        {{
          $t(
            "the system will not display information if the user does not enter student and parent information"
          )
        }}</strong
      >
    </div>
    <div v-if="!uploadIsloading">
      <div v-if="fileParent" class="mb-3">
        <v-row dense>
          <v-col>
            <span class="text-lg">
              <strong>{{ $t("parent") }}</strong>
            </span>
          </v-col>
        </v-row>
        <v-card outlined class="mb-3">
          <!-- {{ formattedHeadersParent }} <BR />
          {{ fileParent }} -->
          <v-data-table
            v-if="fileParent && headersParent.length > 0"
            :headers="formattedHeadersParent"
            :items="fileParent"
            hide-default-footer
            disable-pagination
          >
            <template #item="data">
              <tr>
                <template v-for="(item, index) in data.item">
                  <td v-if="!unHeader.includes(index)" :key="index">
                    <input
                      v-if="index !== 'REMARK'"
                      class="input-border rounded-md"
                      v-model="item.value"
                    />
                    <span
                      class="text-xs"
                      :class="
                        validateInputTable(data.item, index)
                          ? `${validateInputTable(data.item, index)?.color}`
                          : ''
                      "
                    >
                      {{
                        validateInputTable(data.item, index)
                          ? validateInputTable(data.item, index).text
                          : ""
                      }}
                    </span>
                  </td>
                </template>
              </tr>
            </template>
          </v-data-table>
        </v-card>
      </div>
      <div v-if="fileStudent">
        <v-row dense>
          <v-col>
            <span class="text-lg">
              <strong>{{ $t("student") }}</strong>
            </span>
          </v-col>
        </v-row>
        <v-card outlined class="mb-3">
          <!-- {{ formattedHeadersStudent }} -->
          <v-data-table
            v-if="fileStudent && headersStudent.length > 0"
            :headers="formattedHeadersStudent"
            :items="fileStudent"
            hide-default-footer
            disable-pagination
          >
            <template #item="data">
              <tr>
                <template v-for="(item, index) in data.item">
                  <td v-if="!unHeader.includes(index)" :key="index">
                    <input
                      v-if="index !== 'REMARK'"
                      class="input-border rounded-md"
                      v-model="item.value"
                    />
                    <span
                      class="text-xs"
                      :class="
                        validateInputTable(data.item, index)
                          ? `${validateInputTable(data.item, index)?.color}`
                          : ''
                      "
                    >
                      {{
                        validateInputTable(data.item, index)
                          ? validateInputTable(data.item, index).text
                          : ""
                      }}
                    </span>
                  </td>
                </template>
              </tr>
            </template>
          </v-data-table>
        </v-card>
      </div>
      <v-row v-if="fileStudent || fileParent" dense>
        <v-col align="right">
          <v-btn outlined color="#ff6b81" @click="cancel()">{{
            $t("cancel")
          }}</v-btn>
        </v-col>
        <v-col cols="auto">
          <v-btn depressed dark color="#ff6b81" @click="save()">{{
            $t("save")
          }}</v-btn>
        </v-col>
      </v-row>
    </div>
    <div
      v-else
      class="w-full d-flex justify-center align-center"
      style="height: 300px"
    >
      <v-progress-circular
        :size="50"
        color="pink"
        indeterminate
      ></v-progress-circular>
    </div>
  </v-container>
</template>
  
  <script>
import headerPage from "@/components/header/headerPage.vue";
import { mapActions, mapGetters, mapMutations } from "vuex";
const XLSX = require("xlsx");
export default {
  components: { headerPage },
  data() {
    return {
      fileParent: null,
      fileStudent: null,
      file: null,
      headersStudent: [],
      headersParent: [],
      // formattedHeadersStudent: [
      //   {
      //     text: "INDEX",
      //     value: "INDEX",

      //     // sortable: false,
      //   },
      // ],
      // formattedHeadersParent: [
      //   {
      //     text: "INDEX",
      //     value: "INDEX",

      //     // sortable: false,
      //   },
      //   {
      //     text: "TEL",
      //     value: "TEL",

      //     // sortable: false,
      //   },
      //   { text: "USERNAME", value: "USERNAME" },
      //   { text: "PASSWORD", value: "PASSWORD" },
      //   { text: "TITLE_NAME_TH", value: "TITLE_NAME_TH" },
      //   { text: "FIRST_NAME_TH", value: "FIRST_NAME_TH" },
      //   { text: "LAST_NAME_TH", value: "LAST_NAME_TH" },
      //   { text: "TITLE_NAME_EN", value: "TITLE_NAME_EN" },
      //   { text: "FIRST_NAME_EN", value: "FIRST_NAME_EN" },
      //   { text: "LAST_NAME_EN", value: "LAST_NAME_EN" },
      // ],
      unHeader: ["ROLE", "ROLE_ID", "ACCOUNT_ID"],
    };
  },
  computed: {
    ...mapGetters({
      returnFile: "importUserModules/returnFile",
      uploadIsloading: "importUserModules/uploadIsloading",
    }),
    formattedHeadersStudent() {
      return this.headersStudent.map((header) => ({
        text: header,
        value: header,
      }));
    },
    formattedHeadersParent() {
      return this.headersParent.map((header) => ({
        text: header,
        value: header,
      }));
    },
  },
  mounted() {
    this.setReturnFile(null);
  },
  watch: {
    returnFile: function (val) {
      this.file = null;

      if (val.STUDENT.length >= 1) {
        this.headersStudent = Object.keys(val.STUDENT[0]).filter(
          (v) => !this.unHeader.includes(v)
        );
      } else {
        this.headersStudent = [];
      }

      if (val.PARENT.length >= 1) {
        this.headersParent = Object.keys(val.PARENT[0]).filter(
          (v) => !this.unHeader.includes(v)
        );
      } else {
        this.headersParent = [];
      }
      this.fileParent = val.PARENT.length >= 1 ? val.PARENT : [];
      this.fileStudent = val.STUDENT.length >= 1 ? val.STUDENT : [];
    },
  },
  methods: {
    ...mapActions({
      downloadfile: "importUserModules/downloadfile",
      uploadUser: "importUserModules/uploadUser",
    }),
    ...mapMutations({
      setReturnFile: "importUserModules/setReturnFile",
    }),
    downloadTemplateFile() {
      this.downloadfile();
    },
    openFileSeleter() {
      this.$refs.fileInput.click();
    },
    validateInputRowTable(data) {
      const row = [];
      for (const key of Object.keys(data.item)) {
        if (this.validateInputTable(data.item, key)) {
          row.push("x");
        }
      }
      return row.length > 0;
    },
    validateInputTable(data, index) {
      const error = [
        "Username is already used.",
        "The username or password or tel format is invalid.",
        "Duplicate username",
        "Parameter missing. Required username.",
        "Username relation not found. Or this username role not match.",
      ];
      switch (index) {
        // case 'USERNAME':
        //     if (!data[index].value || data[index].value.length < 6) {
        //         return {text : this.$t('please enter a username at least 6 characters long'), color: "#ee3333"}
        //     }
        //     break;
        // case 'PASSWORD':
        //     if (!data[index].value || data[index].value.length < 8 ) {
        //         return {text : this.$t('please enter a password that is at least 8 characters long'), color: "#ee3333"}
        //     } else if ( !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/.test(data[index].value)) {
        //         return {text :this.$t('password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'), color: "#ee3333"}
        //     }
        //     break;
        case "REMARK":
          if (error.includes(data[index].value)) {
            return {
              text: this.$t(data[index].value),
              color: "text-[#ee3333]",
            };
          }
          if (!error.includes(data[index].value)) {
            return {
              text: this.$t(data[index].value),
              color: "text-[#4b8333]",
            };
          }
          break;
      }
    },
    handleFileChange(event) {
      try {
        this.file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
          const arrayBuffer = e.target.result;
          const workbook = XLSX.read(arrayBuffer, { type: "array" });
          const sheetNames = workbook.SheetNames;
          for (const sheetName of sheetNames) {
            if (sheetName === "STUDENT") {
              const worksheet = workbook.Sheets[sheetName];
              console.log("worksheet :>> ", worksheet);
              // const data = XLSX.utils.sheet_to_json(worksheet);
              const data = XLSX.utils.sheet_to_json(worksheet, {
                // header: 1, // Use this if you want to use the first row as headers, or specify an array of headers.
                defval: null, // Default value for empty cells
                raw: false, // Keep original values, including null
              });
              if (data?.length >= 1) {
                this.headersStudent = Object.keys(data[0]);
                // Create an array of objects with a 'value' property for each cell
                if (data?.length >= 1) {
                  this.fileStudent = data.map((row) => {
                    const rowData = {};
                    this.headersStudent.forEach((header) => {
                      rowData[header] = { value: row[header] }; // Initialize value property
                    });
                    return rowData;
                  });
                }
              }
            } else if (sheetName === "PARENT") {
              const worksheet = workbook.Sheets[sheetName];
              // const data = XLSX.utils.sheet_to_json(worksheet);
              const data = XLSX.utils.sheet_to_json(worksheet, {
                // header: 1, // Use this if you want to use the first row as headers, or specify an array of headers.
                defval: null, // Default value for empty cells
                raw: false, // Keep original values, including null
              });

              if (data?.length >= 1) {
                this.headersParent = Object.keys(data[0]);
                console.log("data[0] :>> ", data[0]);
                // Create an array of objects with a 'value' property for each cell
                if (data?.length >= 1) {
                  this.fileParent = data.map((row) => {
                    const rowData = {};
                    this.headersParent.forEach((header) => {
                      // rowData[header] =  row[header] // Initialize value property
                      rowData[header] = { value: row[header] }; // Initialize value property
                    });
                    return rowData;
                  });
                }
              }
            }
          }
        };
        reader.readAsArrayBuffer(this.file);
      } catch (error) {
        console.log("error :>> ", error);
      }
    },
    save() {
      this.uploadUser({
        payload: {
          STUDENT: this.fileStudent ? this.fileStudent : [],
          PARENT: this.fileParent ? this.fileParent : [],
        },
      });
    },
    cancel() {
      this.fileStudent = null;
      this.fileParent = null;
      this.file = null;
      this.setReturnFile(null);
    },
  },
};
</script>
  
  <style>
</style>
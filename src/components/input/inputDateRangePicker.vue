<template>
  <v-row>
    <v-col>
      <v-menu
        v-model="menu_start_date"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            dense
            outlined
            v-model="start_date"
            :append-icon="icon"
            readonly
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-time-picker v-if="time_picker" v-model="start_date"></v-time-picker>
        <v-date-picker
          v-else
          v-model="start_date"
          locale="th-TH"
        ></v-date-picker>
      </v-menu>
    </v-col>
    <v-col cols="auto" class="mt-2 px-0"><v-icon>mdi-minus</v-icon></v-col>
    <v-col>
      <v-menu
        v-model="menu_end_date"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            dense
            outlined
            v-model="end_date"
            :append-icon="icon"
            readonly
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-time-picker v-if="time_picker" v-model="end_date"></v-time-picker>
        <v-date-picker v-else v-model="end_date" locale="th-TH"></v-date-picker>
      </v-menu>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    icon: { type: String, default: " mdi-calendar" },
    time_picker: { type: Boolean, default: false },
  },
  name: "InputDateRange",
  components: {},
  data: () => ({
    menu_start_date: false,
    menu_end_date: false,
    start_date: "",
    end_date: "",
  }),
  created() {},
  mounted() {},
  watch: {},
  computed: {},
  methods: {},
};
</script>
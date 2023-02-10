<template>
    <v-row dense class="d-flex align-center">
        <v-col :cols="col_header" class="font-bold">{{ title }}</v-col>
        <v-col :cols="col_detail">
            : <slot></slot>
        </v-col>
    </v-row>
</template>
  
  <script>
export default {
  name: "rowData",
  props:{
    col_header : {type: String, default:"3"},
    col_detail : {type: String, default:"9"},
    title : {type :String},
  },
  components: {},
  data: () => ({}),
  created() {},
  mounted() {},
  watch: {},
  computed: {},
  methods: {},
};
</script>
  
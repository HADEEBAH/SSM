<template>
    <v-row dense class="d-flex align-center">
        <v-col v-if="!title" cols="auto">
          <v-icon v-if="icon" class="mr-2" :color="icon_color">{{ icon }}</v-icon>
        </v-col>
        <v-col v-else :cols="mini ? col_detail : '12'" :sm="vertical ? '12' : col_header" class="font-bold">
          <v-icon v-if="icon" class="mr-2" :color="icon_color">{{ icon }}</v-icon>{{ title }}
        </v-col>
        <v-col :cols="mini ? col_detail : '12'" :sm="vertical ? '12' : col_detail" :class="vertical ? 'pl-2' : ''">
            <slot></slot>
        </v-col>
    </v-row>
</template>
  
<script>
export default {
  name: "rowData",
  props:{
    icon:{type: String},
    icon_color:{type: String, default:"#FF6B81"},
    col_header : {type: String, default:"3"},
    col_detail : {type: String, default:"9"},
    title : {type :String},
    vertical : {type : Boolean},
    mini : {type : Boolean}
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
  
<template>
  <v-autocomplete
    dense
    v-model="selected_data"
    color="#FF6B81"
    :items="items"
    :item-text="item_text"
    item-color="#ff6b81"
    :placeholder="placeholder"
    :outlined="outlined"
  >
    <template v-slot:no-data>
      <v-list-item>
        <v-list-item-title> ไม่พบข้อมูล </v-list-item-title>
      </v-list-item>
    </template>
    <template v-slot:item="{ item }">
      <v-list-item-content>
        <v-list-item-title
          ><span :class="selected_data === item ? 'font-bold' : ''">{{
            item
          }}</span></v-list-item-title
        >
      </v-list-item-content>
      <v-list-item-action>
        <v-icon v-if="selected_data === item">mdi-check-circle</v-icon>
      </v-list-item-action>
    </template>
  </v-autocomplete>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
export default {
  props: {
    items: { type: Array },
    item_text: { type: String },
    placeholder: { type: String },
    outlined: { type: Boolean, default: true },
  },
  name: "AutoComplete",
  components: {},
  data: () => ({
    selected_data: "",
  }),
  created() {},
  mounted() {},
  watch: {
    selected_data() {
      this.$emit("selected_data", this.selected_data);
    },
  },
  computed: {
    ...mapGetters({}),
  },
  methods: {
    ...mapActions({}),
  },
};
</script>
<style scoped>
.v-list-item .primary--text .v-list-item--active {
  background-color: #fbf3f5 !important;
  color: #ff6b81;
}
</style>
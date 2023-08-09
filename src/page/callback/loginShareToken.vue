<script>
import loadingOverlay from "../../components/loading/loadingOverlay.vue";
import {mapActions} from "vuex"
export default {
  name:"helloWorld",
  components: {loadingOverlay},
  data: () => ({}),
  mounted() {},
  watch: {},
  computed: {},
  methods: {
    ...mapActions({
      loginShareToken: "loginModules/loginShareToken",
    }),
  },
};
</script>
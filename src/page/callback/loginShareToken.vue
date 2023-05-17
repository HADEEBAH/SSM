<script>
import loadingOverlay from "../../components/loading/loadingOverlay.vue";
import {mapActions} from "vuex"
export default {
  name:"helloWorld",
  components: {loadingOverlay},
  data: () => ({}),
  created() {
    if (this.$route.query.token) {
      console.log("this.$route.params.page", this.$route.params.page);
     this.loginShareToken({token:this.$route.query.token, page:this.$route.params.page})
    }
  },
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
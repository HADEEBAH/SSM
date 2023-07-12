// import VueCookie from "vue-cookie";
// import Swal from "sweetalert2";
// import axios from "axios";
import io from "socket.io-client";
import { mapActions } from "vuex";
import { notification } from 'ant-design-vue';

export default {
  data() {
    return {
      socket: null,
      socketioURL: process.env.VUE_APP_URL,
      // socketioURL: 'http://localhost:3004',
      socket_id: ""
    }
  },
  mounted() {
    // Connect Socket
    this.socket = io(
      this.socketioURL,
      {
        query: { account_id: JSON.parse(localStorage.getItem("userDetail")) ? JSON.parse(localStorage.getItem("userDetail")).account_id : "" },
        transports: ['websocket']
      }
    );
    this.socket.on("connect", () => {
      console.log("socket connected: ", this.socket.connected);
    });
    this.socket.on("events", (data) => {
      this.GetNotifications(data)
      notification.open({
        message: data.notificationName,
        description:data.notificationDescription
      });
    });
    this.socket.on("disconnect", (reason) => {
      console.log("[socket disconnected]: ", reason);
    });
    this.socket.on("connect_error", (error) => {
      console.error("[connect error]: ", error);
    });
  },
  methods: {
    ...mapActions({ GetNotifications: "NotificationsModules/GetNotifications" }),
    async sendNotification(params) {
      this.socket.emit("events", params, (response) => {
        console.log("response: ", response);
      });
    }
  },
  beforeDestroy() {
    this.socket.disconnect()
  },
}

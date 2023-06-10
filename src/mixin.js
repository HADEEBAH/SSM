// import VueCookie from "vue-cookie";
// import Swal from "sweetalert2";
// import axios from "axios";
import io from "socket.io-client";
import { mapActions } from "vuex";

export default {
  data() {
    return {
      socket: null,
      socketioURL: process.env.VUE_APP_URL,
      // socketioURL: 'http://localhost:3004',
      socket_id: ""
    }
  },
  created: function () {
    console.log('Printing from the Mixin')
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
      console.log("[socket connected]: ", this.socket.connected);
    });
    this.socket.on("events", (data) => {
      this.GetNotifications(data)
      console.log("[data]: ", data);

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
      // let config = {
      //   headers: {
      //     "Access-Control-Allow-Origin": "*",
      //     "Content-type": "Application/json",
      //     Authorization: `Bearer ${VueCookie.get("token")}`,
      //   },
      // };
      // try {
      // let { data } = await axios.post(
      // `${process.env.VUE_APP_URL}/api/v1/notification`,
      //   `http://localhost:3004/api/v1/notification`,
      //   params,
      //   config
      // );

      // console.log("data=>", data);

      // } catch (error) {
      //   console.log("error=>", error);
      // }
    }
  },
  beforeDestroy() {
    this.socket.disconnect()
  },
}

import io from "socket.io-client";
import { mapActions } from "vuex";
import { notification } from 'ant-design-vue';
import Swal from "sweetalert2";

export default {
  data() {
    return {
      socket: null,
      // socketioURL: "http://localhost:3004",
      socketioURL: process.env.VUE_APP_URL,
      socket_id: ""
    }
  },
  mounted() {
    this.socket = io(
      this.socketioURL,
      {
        query: { account_id: JSON.parse(localStorage.getItem("userDetail")) ? JSON.parse(localStorage.getItem("userDetail")).account_id : "" },
        transports: ['websocket']
      }
    );

    this.socket.on("events", (data) => {
      this.GetNotifications(data)
      notification.open({
        message: data.notificationName,
        description: data.notificationDescription
      });
    });
  },
  methods: {
    ...mapActions({ GetNotifications: "NotificationsModules/GetNotifications" }),

    async sendNotification(params, notify = false) {
      this.socket.emit("events", params, (response) => {
        if (response) {
          if (notify) {
            Swal.fire({
              icon: "success",
              title: this.$i18n.locale == "th" ? "สำเร็จ" : "success",
              text: this.$i18n.locale == "th" ? "( ส่งการแจ้งเตือนเรียบร้อยแล้ว )" : "( Notification successfully sent )",
              timer: 3000,
              timerProgressBar: true,
              showCancelButton: false,
              showConfirmButton: false,
              showDenyButton: false,

            })
          }
        } else {
          Swal.fire({
            icon: "warning",
            title: this.$i18n.locale == "th" ? "ไม่สำเร็จ" : "unsuccessful",
            text: this.$i18n.locale == "th" ? "( ส่งการแจ้งเตือนไม่สำเร็จ )" : "( Failed to send notification )",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
            showDenyButton: false,
          })
        }
      });
    }
  },
  watch: {
    $route(to, from) {
      if (to) {
        this.socket.disconnect()
      }
      if (from) {
        this.socket.connect()
      }
    }
  },
  beforeDestroy() {
    this.socket.disconnect()
  },
}

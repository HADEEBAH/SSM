import axios from "axios";

const notificatiosModules = {
    namespaced: true,
    state: {
        get_notifications: {},
        get_notifications_all: [],
        notifications_read: []
    },
    mutations: {
        SetGetNotify(state, payload) {
            state.get_notifications = payload
        },
        setgetNotificationsAll(state, payload) {
            state.get_notifications_all = payload
        },
        setgetNotificationsRead(state, payload) {
            state.notifications_read = payload
        },
    },
    actions: {

        async GetNotifications(context, data) {
          const user_detail = JSON.parse(localStorage.getItem("userDetail"));
          context.commit("SetGetNotify", data)
          await context.dispatch("GetNotificationsAll", { account_id :user_detail.account_id, limit: 10 })
        },

        async GetNotificationsAll(context, { account_id, limit }) {
            try {
                // let { data } = await axios.get(`http://localhost:3004/api/v1/notification/byId/${account_id}?limit=${limit}`)
                let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/notification/byId/${account_id}?limit=${limit}`)
                if (data.statusCode === 200) {
                    await context.commit("setgetNotificationsAll", data.data)
                }
            } catch (error) {
                console.log(error);
            }
        },

        async ReadNotifications(context, item) {
            try {
                let { data } = await axios.patch(`${process.env.VUE_APP_URL}/api/v1/notification/read/${item.notification_id}`)
                if (data.statusCode === 200) {
                    context.dispatch("GetNotificationsAll", item.account_id)
                }
            } catch (error) {
                console.log(error);
            }
        }


    },
    getters: {
        getNotifications(state) {
            return state.get_notifications
        },
        getNotificationsAll(state) {
            return state.get_notifications_all
        },
        readNotifications(state) {
            return state.notifications_read
        }

    },
};

export default notificatiosModules;

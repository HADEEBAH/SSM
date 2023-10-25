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
            context.dispatch("GetNotificationsAll", user_detail.account_id)
        },

        async GetNotificationsAll(context, account_id) {
            try {
                let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/notification/byId/${account_id}`)
                if (data.statusCode === 200) {
                    context.commit("setgetNotificationsAll", data.data)
                }
            } catch (error) {
                console.log(error);
            }
        },

        async ReadNotifications(context, item) {
            try {
                let { data } = await axios.patch(`${process.env.VUE_APP_URL}/api/v1/notification/read/${item.notification_id}`)
                if (data.statusCode === 200) {
                  context.dispatch("GetNotificationsAll",item.account_id)
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

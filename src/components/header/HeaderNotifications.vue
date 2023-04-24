<template>
  <div class="notifications">
    <button class="show_button" @click="show">
      <span v-show="unreadCount > 0">{{ counter }}</span>
    </button>
    <DarkLayer
      class="dark-layer"
      v-if="notificationsShown"
      :style="{ top: `${headerHeight}px` }"
      @onClose="close"
      v-click-outside="close"
    >
      <div class="notification_wrapper" @mousedown.stop>
        <button class="close" type="button" @click="close"></button>
        <div class="notifications_list">
          <h2>Уведомления</h2>
          <!-- <div v-if="notifications.length===0">Уведомлений нет</div> -->
          <ul class="notification_list">
            <li
              class="notification"
              v-for="(notification, i) in notifications"
              :key="i"
              v-bind:class="{ unread: notification.messageRead === '0' }"
              @click="readNotification(notification)"
            >
              <div
                class="notification_content"
                v-bind:class="{ row: !notification.name }"
              >
                <div
                  class="notification_name"
                  v-html="notification.name"
                  v-if="notification.name"
                ></div>
                <div class="notification_date">
                  {{ notification.messageDate.day }}
                  {{ notification.messageDate.month }}
                  {{ notification.messageDate.year }},
                  {{ notification.messageDate.hour }}:{{
                    notification.messageDate.minute
                  }}
                </div>
                <div
                  class="notification_text"
                  v-html="notification.messageText"
                ></div>
              </div>
            </li>
          </ul>
          <div
            class="loading"
            v-intersection="updateNotifications"
            v-if="!isEndLoading"
          ></div>
        </div>
      </div>
    </DarkLayer>
    <div class="push" v-if="pushNotificationShown">
      <ul class="notification_list" v-click-outside="close">
        <li
          class="notification"
          v-for="(notification, i) in pushNotifications"
          :key="i"
          v-bind:class="{ read: notification.messageRead === true }"
        >
          <div class="notification_icon"></div>
          {{ notification.messageID }}
          <div
            class="notification_content"
            v-bind:class="{ row: !notification.name }"
          >
            <div
              class="notification_name"
              v-html="notification.name"
              v-if="notification.name"
            ></div>
            <div class="notification_date">
              {{ notification.messageDate.day }}
              {{ notification.messageDate.month }}
              {{ notification.messageDate.year }}
            </div>
            <div
              class="notification_text"
              v-html="notification.messageText"
            ></div>
          </div>
          <button
            type="button"
            class="notification_delete"
            @click="readNotification(notification)"
          ></button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import DarkLayer from "@/components/modals/DarkLayer.vue";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "HeaderNotifications",

  components: {
    DarkLayer,
  },

  computed: {
    ...mapGetters([
      "notificationsShown",
      "pushNotificationShown",
      "notifications",
      "pushNotifications",
      "count",
      "unreadCount",
      "isEndLoading",
      "openedListLength",
      "headerHeight",
    ]),

    counter() {
      return this.unreadCount > 99 ? "99+" : this.unreadCount;
    },
  },

  methods: {
    updateNotifications() {
      this.openedListLength < this.notifications.length
        ? this.updateOpenedListLength(this.notifications.length)
        : null;

      this.loadingNotifications({
        count: 10,
        startFrom: this.openedListLength,
      });
      this.readAllNotification();
    },
    ...mapActions([
      "fetchNotificationShown",
      "fetchNotification",
      "fetchPushNotification",
      "fetchUnreadCount",
      "loadingNotifications",
      "updateOpenedListLength",
    ]),
    show() {
      this.fetchNotificationShown(true);
      this.readAllNotification();
      this.sendStatistics();
    },
    close() {
      this.fetchNotificationShown(false);
      this.updateOpenedListLength(0);
    },
    readNotification(item) {
      if (item.messageRead === "0") {
        axios
          .post("/mobileapp/api/notification/", {
            notificationId: item.messageID,
          })
          .then(() => {
            this.fetchUnreadCount(this.unreadCount - 1);
          });
        item.messageRead = 1;
      }
    },
    readAllNotification() {
      let readNotifications = [];
      for (let notification of this.notifications) {
        if (notification.messageRead === "0") {
          readNotifications.push(notification.messageID);
          notification.messageRead = 1;
        }
      }
      if (readNotifications.length > 0) {
        axios
          .post("/mobileapp/api/notification/", {
            notificationId: readNotifications,
          })
          .then(() => {
            this.fetchUnreadCount(0);
          });
      }
    },

    sendStatistics() {
      axios.post("mobileapp/api/statistic/add", {
        ACTION_CODE: "notification.list",
        MODULE: "notification",
        EXTRA_PARAMS: {
          TITLE: "Все уведомления",
          URL: "/notification",
        },
      });
    },
  },

  watch: {
    notificationsShown: function () {
      if (this.notificationsShown) this.readAllNotification();
    },
  },

  mounted() {
    this.fetchPushNotification(0);
    this.fetchNotification();

    setInterval(() => {
      this.fetchPushNotification(this.count);
    }, 30000);
  },
};
</script>

<style lang="scss" scoped>
.show_button {
  width: 100%;
  height: 100%;
  border-radius: 50px;
  background: none;
  border: none;
  cursor: pointer;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.89 22 12 22ZM18 16V11C18 7.93 16.36 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.63 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z' fill='%23DAE1E9'/%3E%3C/svg%3E%0A");
  position: relative;

  span {
    position: absolute;
    top: 0;
    right: 0;
    transform: translateX(50%);

    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 50%;
    background-color: var(--red700);
    box-shadow: 0 0 0 3px var(--gray700);

    @extend .overline;
    color: var(--white900);
  }
}

.push {
  position: fixed;
  top: var(--headerHeight);
  left: unset;
  right: 0;
  width: 50%;
  height: unset;
  z-index: var(--notifications);

  .notification_list {
    overflow: auto;
    width: 100%;
    height: unset;
    min-width: calc(var(--maxWidthContainer) / 2);
    margin: 0;
    padding: 0;
    list-style-type: none;
    margin-right: 0;
    margin-left: auto;
    box-sizing: border-box;
  }
}

.notification_wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  max-width: calc(var(--maxWidthContainer) / 2);
  margin-right: 0;
  margin-left: auto;
  background-color: #fff;
  position: relative;
  .close {
    position: absolute;
    left: 0;
    top: 32px;
    width: 48px;
    height: 40px;
    transform: translateX(-100%);
    background-color: var(--gray300);
    background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M18.3 5.71C17.91 5.32 17.28 5.32 16.89 5.71L12 10.59L7.10997 5.7C6.71997 5.31 6.08997 5.31 5.69997 5.7C5.30997 6.09 5.30997 6.72 5.69997 7.11L10.59 12L5.69997 16.89C5.30997 17.28 5.30997 17.91 5.69997 18.3C6.08997 18.69 6.71997 18.69 7.10997 18.3L12 13.41L16.89 18.3C17.28 18.69 17.91 18.69 18.3 18.3C18.69 17.91 18.69 17.28 18.3 16.89L13.41 12L18.3 7.11C18.68 6.73 18.68 6.09 18.3 5.71Z' fill='%23445562'/%3E%3C/svg%3E%0A");
    background-repeat: no-repeat;
    background-position: center;
    cursor: pointer;
    border: none;
    border-radius: 20px 0px 0px 20px;
    opacity: 0.7;
    transition: 0.3s opacity ease;
    &:hover {
      opacity: 1;
    }
  }
  h2 {
    font-weight: 400;
    font-size: 36px;
    line-height: 42px;
    color: var(--gray900);
    margin: 0;
    padding: var(--mainPadding);
    padding-bottom: var(--v-rhythm-6);
    padding-top: var(--v-rhythm-8);
  }
  @include phones {
    width: 85%;
  }
}

.notification_list {
  .push & {
    background-color: unset;
    min-width: unset;
  }
}

.notification {
  background-color: #fff;
  box-sizing: border-box;
  padding: 16px var(--mainPadding);
  display: flex;
  position: relative;
  overflow: hidden;
  transition: 0.3s opacity ease, 0.3s transform ease, 0.3s max-height ease,
    0.1s padding ease 0.3s, 0.1s margin ease 0.3s, 0.1s visibility ease 0.3s;
  max-width: calc(var(--maxWidthContainer) / 2 - 54px);
  box-sizing: border-box;
  margin-bottom: 4px;
  cursor: pointer;

  &.read {
    opacity: 0;
    transform: translateY(-100%);
    max-height: 0;
    padding-right: 0;
    padding-left: 0;
    margin: 0;
    visibility: hidden;
  }

  &.unread {
    background: rgba(226, 229, 234, 0.6);
  }

  .push & {
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05),
      0px 10px 20px rgba(0, 0, 0, 0.1);
    border-bottom: 0;
    padding: 16px;
    margin-bottom: 16px;
    margin-left: 0;
    width: 100%;
    min-width: unset;
  }

  &:before {
    content: "";
    position: absolute;
    bottom: 0;
    left: var(--mainPadding);
    height: 1px;
    width: calc(100% - 2 * var(--mainPadding));
    background-color: var(--gray300);
  }
}

.notification_icon {
  height: 40px;
  width: 40px;
  border-radius: 40px;
  background-color: var(--red300);
  background-image: url("data:image/svg+xml,%3Csvg width='14' height='17' viewBox='0 0 14 17' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7.11594 1.60583V2.03894L7.54461 2.10072C9.6344 2.40191 11.2464 4.2006 11.2464 6.3696V8.28888C11.2464 9.79787 11.9076 11.223 13.06 12.1977C13.2239 12.3388 13.3116 12.5335 13.3116 12.7374C13.3116 13.1255 12.995 13.4421 12.6069 13.4421H1.24818C0.860013 13.4421 0.543472 13.1255 0.543472 12.7374C0.543472 12.5315 0.63264 12.3374 0.788992 12.2031C1.94714 11.2232 2.60869 9.79831 2.60869 8.28888V6.3696C2.60869 4.20054 4.22003 2.40191 6.31043 2.10072L6.73913 2.03896V1.60583V0.862356C6.73913 0.758136 6.82335 0.67395 6.92753 0.67395C7.03171 0.67395 7.11594 0.758136 7.11594 0.862356V1.60583Z' stroke='%23AB052D'/%3E%3Cpath d='M8.74332 15.1305C8.38634 15.7656 7.70551 16.1957 6.9276 16.1957C6.14968 16.1957 5.46885 15.7656 5.11187 15.1305H8.74332Z' stroke='%23AB052D'/%3E%3C/svg%3E%0A");
  background-repeat: no-repeat;
  background-position: center;
}

.notification_content {
  flex: 1;
  display: flex;
  flex-wrap: wrap;

  .push & {
    padding-left: 16px;
    padding-right: 16px;
  }

  &.row {
    flex-direction: column;
    flex-wrap: nowrap;

    .notification_date {
      width: unset;
    }
  }
}

.notification_name {
  width: 50%;
  font-weight: 500;
  font-size: 16px;
  line-height: 20px;
  color: var(--gray900);
  padding-bottom: 4px;

  ::v-deep {
    a {
      color: var(--red900);
      text-decoration: none;
      font-weight: 400;
      font-size: 16px;
      line-height: 20px;
    }
  }
}

.notification_date {
  width: 50%;
  text-align: left;
  font-weight: 400;
  font-size: 12px;
  margin-bottom: var(--v-rhythm-1);
  line-height: 14px;
  color: var(--gray500);
  white-space: nowrap;
}

.notification_text {
  width: 100%;
  padding-right: 8px;
  flex: 1;
  word-break: break-word;

  &::v-deep a {
    color: var(--red900);
    text-decoration: none;
    font-weight: 400;
    font-size: inherit;
    line-height: 20px;
  }
}

.notification_delete {
  width: 40px;
  height: 40px;
  cursor: pointer;
  border: none;
  background-color: #0000;
  background-image: url("data:image/svg+xml,%3Csvg width='14' height='14' viewBox='0 0 14 14' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M13 1L7 7M1 13L7 7M7 7L1 1M7 7L13 13' stroke='%239CA6AB' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E%0A");
  background-repeat: no-repeat;
  background-position: top center;
}
.notifications_list {
  overflow-y: auto;
}

.dark-layer {
  @include phones {
    // высота мобильного меню
    bottom: 63px;
  }
}
</style>

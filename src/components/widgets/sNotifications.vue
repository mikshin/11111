<template>
  <div class="widget_container">
    <div class="widget_headline">
      <div class="icon"></div>
      <h3>{{ name }}</h3>
    </div>
    <div class="widget_content" v-bind:class="{ loading: !loaded }">
      <ul class="notification_list" v-if="notifications">
        <template v-for="(notification, i) in notifications">
          <li class="notification" :key="i" v-if="i <= 3">
            <span
              class="notification_content"
              v-html="notification.messageText"
            ></span>
            <span class="notification_date">
              {{ notification.messageDate.day }}
              {{ notification.messageDate.month }}
              {{ notification.messageDate.year }},
              {{ notification.messageDate.hour }}:{{
                notification.messageDate.minute
              }}</span
            >
          </li>
        </template>
      </ul>
      <span v-else>Уведомлений нет</span>
    </div>
    <button
      class="show_all"
      @click="fetchNotificationShown(true)"
      v-if="notifications && notifications.length > 4"
    >
      Все уведомления
    </button>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
export default {
  props: {
    name: null,
  },
  computed: mapGetters(["notifications", "loaded"]),
  methods: mapActions([
    "fetchNotificationShown",
    "fetchNotification",
    "fetchPushNotification",
  ]),
  mounted() {
    this.fetchNotification();
    setInterval(() => {
      this.fetchNotification();
    }, 30000);
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/styles/sidebarWidgets";

.notification_list {
  margin: 0;
  padding: 0;
  list-style-type: none;
}

.notification {
  padding: 12px 0;
  border-bottom: 1px solid var(--gray300);
  display: flex;
  flex-direction: column-reverse;
  word-break: break-word;
}

.notification_content {
  padding-bottom: 12px;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;

  ::v-deep {
    a {
      color: var(--red900);
      text-decoration: none;
    }
  }
}

.notification_date {
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: var(--gray500);
  margin-bottom: var(--v-rhythm-1);
}

.show_all {
  width: 100%;
  background-color: #fff;
  height: 56px;
  // box-shadow: 0px -8px 16px rgba(9, 0, 109, 0.08);
  border-top: 2px solid var(--gray300);
  font-weight: 700;
  font-size: 14px;
  line-height: 20px;
  color: var(--red900);
  margin-top: -1px;
  cursor: pointer;
}

.icon {
  background-image: url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8.00008 14.6667C8.73341 14.6667 9.33341 14.0667 9.33341 13.3333H6.66675C6.66675 14.0667 7.26008 14.6667 8.00008 14.6667ZM12.0001 10.6667V7.33332C12.0001 5.28666 10.9067 3.57332 9.00008 3.11999V2.66666C9.00008 2.11332 8.55341 1.66666 8.00008 1.66666C7.44675 1.66666 7.00008 2.11332 7.00008 2.66666V3.11999C5.08675 3.57332 4.00008 5.27999 4.00008 7.33332V10.6667L2.66675 12V12.6667H13.3334V12L12.0001 10.6667Z' fill='%23A5B2BA'/%3E%3C/svg%3E%0A");
}
</style>

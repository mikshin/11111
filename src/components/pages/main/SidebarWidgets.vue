<template>
  <section class="sidebar-widgets">
    <template v-for="widget in widgetsToRender">
      <Component
        :is="widget.componentName"
        :key="widget.id"
        v-bind="widget.props"
      ></Component>
    </template>
  </section>
</template>

<script>
/* eslint-disable camelcase */
import { getAssotiatedWidgets } from "@utils";

import Notifications from "@widgets/sNotifications.vue";
import Poll from "@widgets/sPoll.vue";
import WidgetBirthdays from "@components/widgets/WidgetBirthdays.vue";
import WidgetThanks from "@components/widgets/WidgetThanks.vue";
import NewEmployeesWidget from "@widgets/NewEmployeesWidget.vue";
import PhotoContestWidget from "@widgets/PhotoContestWidget.vue";
import QuestionListWidget from "@widgets/question-list-widget/QuestionListWidget.vue";
import AdvertisementWidget from "@widgets/advertisements-widget/AdvertisementWidget.vue";
import CommunitiesWidgetTabs from "@widgets/CommunitiesWidgetTabs.vue";
import HotlineBanner from "@widgets/HotlineBanner.vue";
import WidgetBanners from "@widgets/WidgetBanners.vue";

export default {
  name: "SidebarWidgets",

  components: {
    Notifications,
    Poll,
    WidgetBirthdays,
    WidgetThanks,
    NewEmployeesWidget,
    PhotoContestWidget,
    QuestionListWidget,
    AdvertisementWidget,
    CommunitiesWidgetTabs,
    HotlineBanner,
    WidgetBanners,
  },

  data() {
    return {
      widgetsComponents: {
        banner_hotline_main: {
          componentName: "HotlineBanner",
          id: 1,
          props: {
            variant: "narrow",
          },
        },
        banner_vertical_main: {
          componentName: "WidgetBanners",
          id: 2,
          props: {
            dataFetchPath: "/mobileapp/api/banners/verticalWidget",
            variant: "narrow",
          },
        },
        head_question: {
          componentName: "QuestionListWidget",
          id: 3,
        },
        notification: {
          componentName: "Notifications",
          id: 4,
        },
        vote_main: {
          componentName: "Poll",
          id: 5,
        },
        birthday_main: {
          componentName: "WidgetBirthdays",
          id: 6,
        },
        graduate_main: {
          componentName: "WidgetThanks",
          id: 7,
        },
        new_employee_main: {
          componentName: "NewEmployeesWidget",
          id: 8,
        },
        photo_contest_main: {
          componentName: "PhotoContestWidget",
          id: 9,
        },
        addvertising: {
          componentName: "AdvertisementWidget",
          id: 10,
        },
        community_main: {
          componentName: "CommunitiesWidgetTabs",
          id: 11,
        },
      },
    };
  },

  props: {
    widgets: {
      type: Array,
      required: true,
    },
  },

  computed: {
    widgetsToRender() {
      return getAssotiatedWidgets(this.widgets, this.widgetsComponents);
    },
  },
};
</script>

<style lang="scss" scoped>
.sidebar-widgets {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: var(--v-rhythm-6);
}
</style>

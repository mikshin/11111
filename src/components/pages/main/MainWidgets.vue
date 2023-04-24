<template>
  <div class="main-widgets">
    <Component
      v-for="widget in widgetsToRender"
      :is="widget.componentName"
      :key="widget.id"
      v-bind="widget.props"
    ></Component>
  </div>
</template>

<script>
/* eslint-disable camelcase */
import { getAssotiatedWidgets } from "@utils";

import MainNews from "@components/pages/main/MainNews.vue";
import MainRatings from "@components/pages/main/MainRatings.vue";
import MainEvents from "@components/pages/main/MainEvents.vue";

import ProjectsWidgetLk from "@widgets/ProjectsWidgetLk.vue";
import WidgetBanners from "@widgets/WidgetBanners.vue";
import HotlineBanner from "@widgets/HotlineBanner.vue";
import WidgetCommunities from "@widgets/WidgetCommunities.vue";
import WidgetAnnouncements from "@widgets/WidgetAnnouncements.vue";

export default {
  name: "MainWidgets",

  components: {
    MainNews,
    MainRatings,
    ProjectsWidgetLk,
    MainEvents,
    WidgetBanners,
    HotlineBanner,
    WidgetCommunities,
    WidgetAnnouncements,
  },

  props: {
    widgets: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      widgetsComponents: {
        banner_hotline_main: {
          componentName: "HotlineBanner",
          id: 1,
        },
        banner_horizontal_main: {
          componentName: "WidgetBanners",
          id: 2,
          props: {
            dataFetchPath: "/mobileapp/api/banners/horizontalWidget",
          },
        },
        news: {
          componentName: "MainNews",
          id: 3,
        },
        raiting: {
          componentName: "MainRatings",
          id: 4,
        },
        project: {
          componentName: "ProjectsWidgetLk",
          id: 5,
        },
        calendar_main: {
          componentName: "MainEvents",
          id: 6,
        },
        addvertising: {
          componentName: "WidgetAnnouncements",
          id: 7,
        },
        community_main: {
          componentName: "WidgetCommunities",
          id: 8,
        },
      },
    };
  },

  computed: {
    breakpoints() {
      return this.$store.getters.breakpoints;
    },
    widgetsToRender() {
      return getAssotiatedWidgets(this.widgets, this.widgetsComponents).filter(
        (widget) => {
          const onlyDesktopWidgets = ["banner_horizontal_main"];

          return !(
            onlyDesktopWidgets.includes(widget.type) && this.breakpoints.phones
          );
        }
      );
    },
  },

  methods: {},

  mounted() {},
};
</script>

<style lang="scss" scoped>
.main-widgets {
  display: flex;
  flex-direction: column;
  gap: var(--v-rhythm-20);

  @include desktop {
    gap: var(--v-rhythm-15);
  }

  @include laptop {
    gap: var(--v-rhythm-10);
  }

  @include phones {
    gap: var(--v-rhythm-6);
  }
}
</style>

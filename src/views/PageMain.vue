<template>
  <AppPage class="page-main" :noTitle="true" :noBreadcrumbs="true">
    <MainSidebar
      class="page-main__main-sidebar"
      :class="{ loading: !pageReady }"
      :notMobileReverse="true"
    >
      <template #main>
        <MainWidgets class="page-main__main-widget" :widgets="widgets" />
      </template>

      <template #sidebar>
        <SidebarWidgets
          class="page-main__sidebar-widget"
          :widgets="sidebarWidgets"
        />
      </template>
    </MainSidebar>
  </AppPage>
</template>

<script>
import AppPage from "@/components/UI/page/AppPage.vue";
import MainSidebar from "@/components/UI/page/MainSidebar.vue";
import MainWidgets from "@/components/pages/main/MainWidgets.vue";
import SidebarWidgets from "@/components/pages/main/SidebarWidgets.vue";
import { mapActions, mapGetters } from "vuex";
import axios from "axios";

export default {
  name: "PageMain",

  components: {
    AppPage,
    MainSidebar,
    MainWidgets,
    SidebarWidgets,
  },

  data() {
    return {
      widgets: [],
      sidebarWidgets: [],
      filesModalVisible: false,
    };
  },

  computed: {
    ...mapGetters(["pageReady"]),
  },

  methods: {
    ...mapActions(["fetchPage"]),
  },

  mounted() {
    axios
      .get("/mobileapp/api/widget/?type=main")
      .then((response) => {
        this.widgets = response.data.widgets;
        this.sidebarWidgets = response.data.sidebarWidgets;

        this.fetchPage(true);
      })
      .catch((error) => {
        console.log(error);
        this.fetchPage(false);
      });
  },
};
</script>

<style lang="scss" scoped></style>

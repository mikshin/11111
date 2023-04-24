<template>
  <AppPage class="page-divisions">
    <div class="page-divisions__content" :class="{ loading: pageIsLoading }">
      <div class="page-divisions__aside">
        <TabsNav
          class="page-divisions__tabs-nav"
          v-if="tabsNav.length > 0"
          :tabs="tabsNav"
          :isAdditionally="true"
          :activeTabObj="activeTab"
          @changeTab="changeRouterPath"
        />

        <InputSearchDepartment
          class="page-divisions__search"
          :input="inputSearchDepartment"
          v-if="activeTab.id"
          :depId="activeTab.id"
          @selectDep="selectDep"
        />

        <AppTree
          v-if="treeData.length"
          class="page-divisions__app-tree"
          :class="{ loading: treeDataIsLoading }"
          :treeData="treeData"
          @toggleActive="toggleActive"
        />
      </div>

      <div class="page-divisions__main" :class="{ loading: depIsLoading }">
        <DivisionInfo
          class="page-divisions__info"
          id="pageDivisionsInfo"
          v-if="depData"
          :depData="depData"
          :depNav="depNav"
          :depStructure="depStructure"
        />

        <DivisionSections
          class="page-divisions__sections"
          v-if="depData && depNav.length > 0"
          :sectionsList="depNav"
          :selectDepId="selectDepId"
          :сountEmployee="depData.innerEmployeeCount"
        />
      </div>
    </div>
  </AppPage>
</template>

<script>
import AppPage from "@/components/UI/page/AppPage.vue";
import TabsNav from "@/components/UI/tabs/TabsNav.vue";
import DivisionInfo from "@/components/divisions/DivisionInfo.vue";
import DivisionSections from "@/components/divisions/DivisionSections.vue";
import InputSearchDepartment from "@/components/UI/inputs/InputSearchDepartment";
import AppTree from "@/components/UI/tree/AppTree.vue";
import axios from "axios";
import VueScrollTo from "vue-scrollto";

export default {
  name: "PageDivisions",

  components: {
    AppPage,
    TabsNav,
    DivisionInfo,
    DivisionSections,
    InputSearchDepartment,
    AppTree,
  },

  props: {},

  data() {
    return {
      tabsNav: [],
      pageIsLoading: false,
      activeTab: {},
      selectDepId: null,
      depIsLoading: false,
      depData: null,
      depNav: [],
      depStructure: {},
      inputSearchDepartment: {
        placeholder: "Поиск по подразделениям",
        required: false,
      },
      treeData: [],
      treeDataIsLoading: false,
    };
  },

  computed: {
    pathId() {
      const pathArr = this.$route.path.split("/");
      const pathId = pathArr[pathArr.length - 1];
      return pathId;
    },

    currentUser() {
      return JSON.parse(localStorage.currentUser);
    },
  },

  methods: {
    toggleActive(e) {
      this.selectDepId = e.ID;
      //!TODO сделать offset переменной, зависящей от высоты шапки
      VueScrollTo.scrollTo("#pageDivisionsInfo", { offset: -92 });
    },

    selectDep(id) {
      this.selectDepId = id;
    },

    async getTabsNav() {
      try {
        this.pageIsLoading = true;
        const response = await axios({
          method: "get",
          url: `/mobileapp/api/orgstructure/depLevelMain/?currentUserId=${this.currentUser.ID}`,
        });
        const values = Object.values(response.data);
        values.forEach((value) => {
          this.tabsNav.push({ name: value.NAME, id: value.ID });
        });
        this.changeActiveTab(this.pathId);
      } catch (error) {
        console.log(error);
      } finally {
        this.pageIsLoading = false;
      }
    },

    async getDepInfo(id) {
      try {
        this.depIsLoading = true;
        this.depData = await this.getDepData(id);
        this.depNav = await this.getDepNav(id);
        this.depStructure = await this.getDepStructure(id);
      } finally {
        this.depIsLoading = false;
      }
    },

    async getDepData(id) {
      try {
        this.depData = null;
        const response = await axios({
          method: "get",
          url: `/mobileapp/api/orgstructure/depDetail/?depId=${id}`,
        });
        return response.data;
      } catch (error) {
        console.log(error);
      }
    },

    async getDepNav(id) {
      try {
        this.depNav = [];
        const response = await axios({
          method: "get",
          url: `/mobileapp/api/orgstructure/contentMenu?depId=${id}`,
        });
        return response.data;
      } catch (error) {
        console.log(error);
        return [];
      }
    },

    async getDepStructure(id) {
      try {
        this.depStructure = {};
        const response = await axios({
          method: "get",
          url: `/mobileapp/api/orgstructure/depStructure?depId=${id}`,
        });
        return response.data;
      } catch (error) {
        console.log(error);
      }
    },

    changeActiveTab(id) {
      this.activeTab = this.tabsNav.find((item) => item.id === id);
    },

    changeRouterPath(e) {
      if (e.id !== this.pathId) {
        this.$router.push(`/divisions/${e.id}`);
      }
    },

    async fetchTreeData() {
      try {
        this.treeData = [];
        this.treeDataIsLoading = true;
        const response = await axios({
          method: "get",
          url: `/mobileapp/api/orgstructure/?sectionId=${this.activeTab.id}`,
        });
        const values = Object.values(response.data);
        values.forEach((value) => {
          this.treeData.push(value);
        });
      } catch (error) {
        console.log(error);
      } finally {
        this.treeDataIsLoading = false;
      }
    },
  },

  watch: {
    $route() {
      this.changeActiveTab(this.pathId);
    },

    activeTab() {
      this.selectDepId = this.activeTab.id;
      this.fetchTreeData();
    },

    selectDepId() {
      this.getDepInfo(this.selectDepId);
    },
  },

  mounted() {
    this.getTabsNav();
  },
};
</script>

<style scoped lang="scss">
.page-divisions {
  &__content {
    width: 100%;
    display: flex;
    gap: var(--v-rhythm-8);
  }

  &__aside {
    width: calc(437 * 100% / 1376);

    flex-shrink: 0;
  }

  &__search {
    width: 100%;

    ::v-deep {
      .input-search-department__input {
        border: none;
      }
    }
  }

  &__tabs-nav {
  }

  &__main {
    width: calc(907 * 100% / 1376);

    display: flex;
    flex-direction: column;
    gap: var(--v-rhythm-12);
  }

  &__info {
  }

  &__sections {
  }

  @include laptop {
    &__content {
      flex-direction: column;
    }

    &__aside {
      width: 100%;
    }

    &__main {
      width: 100%;
    }
  }
}
</style>
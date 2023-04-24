// !TODO разбить на несколько компонентов, убрать поаторяющиеся куски в коде
<template>
  <div class="app-orgstructure" :class="{ loading: isLoading }">
    <template v-if="!isLoading">
      <div class="app-orgstructure__aside">
        <div class="app-orgstructure__nav">
          <TabsNav
            class="app-orgstructure__tabs-nav"
            :tabs="tabsNav"
            :isAdditionally="true"
            :activeTabObj="activeTab"
            @clickTab="clickTab"
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
            class="app-orgstructure__navbar"
            :class="{ loading: treeDataIsLoading }"
            :key="appTreeKey"
            :treeData="treeData"
            @toggleActive="toggleActive"
          />
        </div>
      </div>
      <div class="app-orgstructure__main" :class="{ loading: depIsLoading }">
        <div class="app-orgstructure__main-title" v-if="depInfo">
          {{ depInfo.NAME }}
        </div>

        <ul class="app-orgstructure__main-nav" v-if="depMenu.length > 0">
          <li
            class="app-orgstructure__main-nav-item"
            v-for="(item, i) in depMenu"
            :key="i"
          >
            <a
              :href="`#${item.name}`"
              class="app-orgstructure__main-nav-link text-btn"
              @click.prevent="goToArticle(item.name)"
              >{{ item.placeholder }}</a
            >
          </li>
        </ul>

        <div class="app-orgstructure__main-content">
          <LeaderCard
            class="app-orgstructure__leader"
            v-if="depHeadInfo"
            :canAddQuestion="depHeadInfo.ADD_QUESTION"
            :vacation="depHeadInfo.VACATION"
            :fired="depHeadInfo.FIRED"
            :id="depHeadInfo.ID"
            :src="depHeadInfo.USER_PHOTO"
            :fullName="depHeadInfo.FULL_NAME"
            :company="depHeadInfo.COMPANY"
            :division="depHeadInfo.UF_DEPARTMENT"
            :workPosition="depHeadInfo.UF_WORK_POSITION"
            :workPhone="depHeadInfo.WORK_PHONE"
            :innerWorkPhone="depHeadInfo.PHONE_INNER"
            :personPhone="depHeadInfo.WORK_PHONE"
            :workEmail="depHeadInfo.EMAIL"
            :workAddress="depHeadInfo.WORK_STREET"
            :deputySrc="
              depHeadInfo.UF_SUBSTITUTE
                ? depHeadInfo.UF_SUBSTITUTE.USER_PHOTO
                : null
            "
            :deputySubstitute="depHeadInfo.UF_SUBSTITUTE"
            :deputyID="
              depHeadInfo.UF_SUBSTITUTE ? depHeadInfo.UF_SUBSTITUTE.ID : null
            "
            :deputyWorkPosition="
              depHeadInfo.UF_SUBSTITUTE
                ? depHeadInfo.UF_SUBSTITUTE.UF_WORK_POSITION
                : null
            "
            :headSrc="
              depHeadInfo.UF_HEAD ? depHeadInfo.UF_HEAD.USER_PHOTO : null
            "
            :headFullName="
              depHeadInfo.UF_HEAD ? depHeadInfo.UF_HEAD.FULL_NAME : null
            "
            :headID="depHeadInfo.UF_HEAD ? depHeadInfo.UF_HEAD.ID : null"
            :headWorkPosition="
              depHeadInfo.UF_HEAD ? depHeadInfo.UF_HEAD.UF_WORK_POSITION : null
            "
            :headVacation="
              depHeadInfo.UF_HEAD ? depHeadInfo.UF_HEAD.VACATION : null
            "
            :headFired="depHeadInfo.UF_HEAD ? depHeadInfo.UF_HEAD.FIRED : null"
          />

          <div
            class="app-orgstructure__subordinate"
            id="subordinate"
            v-if="depChildDeps.length"
          >
            <div class="app-orgstructure__subordinate-title">
              Подразделения ({{ depChildDepsCount }})
            </div>
            <ul class="app-orgstructure__divisions">
              <li
                class="app-orgstructure__division"
                v-for="item in depChildDeps"
                :key="item.ID"
                @click="appTreeKey++"
              >
                <router-link
                  :to="'/orgstructure/' + item.ID"
                  class="app-orgstructure__division-title"
                >
                  {{ item.NAME }}
                  <span
                    class="app-orgstructure__subordinate-title-count"
                    v-if="item.COUNT_EMPLOYEE"
                    >({{ item.COUNT_EMPLOYEE }})</span
                  >
                </router-link>
                <PersonCard
                  class="app-orgstructure__division-leader"
                  v-if="item.HEAD_INFO"
                  :personData="item.HEAD_INFO"
                />
              </li>
            </ul>
            <!-- !TODO сделать, что бы во время подгрузки на кнопке появлялся лодер -->
            <div class="app-orgstructure__more" v-if="!depChildDepsEnd">
              <button
                class="app-orgstructure__more-btn text-btn"
                @click="addDepChildDep"
              >
                <span>Загрузить ещё</span>
                <user-icons :iconName="'arrow-down'" />
              </button>
            </div>
          </div>

          <div
            class="app-orgstructure__subordinate"
            id="users"
            v-if="depEmployees.length"
          >
            <div class="app-orgstructure__subordinate-title">
              Сотрудники ({{ depEmployeesDepsCount }})
            </div>
            <div class="app-orgstructure__employees">
              <PersonCard
                class="app-orgstructure__employee"
                v-for="item in depEmployees"
                :key="item.ID"
                :personData="item"
              />
            </div>
            <!-- !TODO сделать, что бы во время подгрузки на кнопке появлялся лодер -->
            <div class="app-orgstructure__more" v-if="!depEmployeesEnd">
              <button
                class="app-orgstructure__more-btn text-btn"
                @click="addDepEmployees"
              >
                <span>Загрузить ещё</span>
                <user-icons :iconName="'arrow-down'" />
              </button>
            </div>
          </div>

          <div
            class="app-orgstructure__subordinate"
            id="documents"
            v-if="depDocuments.length"
          >
            <div class="app-orgstructure__subordinate-title">
              Документы ({{ depDocumentsCount }})
            </div>
            <div class="app-orgstructure__documents">
              <AppDocument
                class="app-orgstructure__document"
                v-for="doc in depDocuments"
                :key="doc.ID"
                :fileTitle="doc.FILE.originalName"
                :fileSize="doc.FILE.fileSize"
                :fileExtension="doc.FILE.extension"
                :fileLink="doc.FILE.fileLink"
                :fileDate="doc.TIMESTAMP_X"
              />
            </div>
            <!-- !TODO сделать, что бы во время подгрузки на кнопке появлялся лодер -->
            <div class="app-orgstructure__more" v-if="!depDocumentsEnd">
              <button
                class="app-orgstructure__more-btn text-btn"
                @click="addDepDocuments"
              >
                <span>Загрузить ещё</span>
                <user-icons :iconName="'arrow-down'" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import axios from "axios";
import TabsNav from "@/components/UI/tabs/TabsNav.vue";
import PersonCard from "@/components/person-cards/PersonCard.vue";
import LeaderCard from "@/components/person-cards/LeaderCard.vue";
import InputSearchDepartment from "@/components/UI/inputs/InputSearchDepartment";
import AppTree from "@/components/UI/tree/AppTree.vue";
import VueScrollTo from "vue-scrollto";
import AppDocument from "@/components/UI/document/AppDocument.vue";

export default {
  name: "AppOrgstructure",

  components: {
    TabsNav,
    PersonCard,
    LeaderCard,
    AppTree,
    InputSearchDepartment,
    AppDocument,
  },

  props: {},

  data() {
    return {
      tabsNav: [],

      activeTab: {},

      treeData: [],

      depInfo: null,
      depHeadInfo: null,

      depChildDeps: [],
      depChildDepsEnd: true,
      depChildDepsCount: 0,

      depEmployees: [],
      depEmployeesEnd: true,
      depEmployeesDepsCount: 0,

      depDocuments: [],
      depDocumentsEnd: true,
      depDocumentsCount: 0,

      depMenu: [],

      isLoading: true,
      treeDataIsLoading: false,
      appTreeKey: 0,
      depIsLoading: false,
      inputSearchDepartment: {
        placeholder: "Поиск по подразделениям",
        required: false,
      },
    };
  },

  methods: {
    changeUrl(id) {
      if (this.$route.fullPath !== `/orgstructure/${id}`) {
        this.$router.push(`/orgstructure/${id}`);
      }
    },

    clickTab(e) {
      if (e.id) {
        this.activeTab = e;
        this.changeUrl(e.id);
      }
    },

    toggleActive(e) {
      this.changeUrl(e.ID);
    },

    async getDepMenu() {
      try {
        const response = await axios({
          method: "get",
          url: `/mobileapp/api/orgstructure/contentMenuDep?depId=${this.depId}`,
        });
        this.depMenu = response.data;
      } catch (error) {
        console.log(error);
      }
    },

    goToArticle(id) {
      //!TODO сделать offset переменной, зависящей от высоты шапки
      VueScrollTo.scrollTo(`#${id}`, { offset: -92 });
    },

    async fetchTabsNav() {
      try {
        const response = await axios({
          method: "get",
          url: `/mobileapp/api/orgstructure/depLevelMain/?currentUserId=${this.currentUser.ID}`,
        });
        const values = Object.values(response.data);
        values.forEach((value) => {
          this.tabsNav.push({ name: value.NAME, id: value.ID });
        });
      } catch (error) {
        console.log(error);
      } finally {
        this.isLoading = false;
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

    async fetchDepInfo() {
      try {
        this.depInfo = null;
        this.depHeadInfo = null;
        this.depChildDepsCount = 0;
        this.depEmployeesDepsCount = 0;
        this.depDocumentsCount = 0;

        this.depIsLoading = true;
        const response = await axios({
          method: "get",
          url: `/mobileapp/api/orgstructure/depInfo/?depId=${this.depId}`,
        });

        this.depInfo = response.data.depInfo;
        this.depHeadInfo = response.data.headInfo;
        this.depChildDepsCount = response.data.innerDepartmentCount;
        this.depEmployeesDepsCount = response.data.innerEmployeeCount;
        this.depDocumentsCount = response.data.innerDocumentCount;
      } catch (error) {
        console.log(error);
      } finally {
        this.depIsLoading = false;
        this.updateTabs();
      }
    },

    async fetchDepСhildDep() {
      try {
        const response = await axios({
          method: "get",
          url: `/mobileapp/api/orgstructure/childDep/?count=3&startFrom=${this.depChildDeps.length}&depId=${this.depId}`,
        });

        this.depChildDepsEnd = response.data.end;
        return Object.values(response.data.depInfo);
      } catch (error) {
        return [];
      }
    },

    async addDepChildDep() {
      this.depChildDeps = [
        ...this.depChildDeps,
        ...(await this.fetchDepСhildDep()),
      ];
    },

    async fetchDepEmployees() {
      try {
        const response = await axios({
          method: "get",
          url: `/mobileapp/api/orgstructure/depEmployee/?count=3&startFrom=${this.depEmployees.length}&depId=${this.depId}`,
        });

        this.depEmployeesEnd = response.data.end;
        return Object.values(response.data.employee);
      } catch (error) {
        return [];
      }
    },

    async addDepEmployees() {
      this.depEmployees = [
        ...this.depEmployees,
        ...(await this.fetchDepEmployees()),
      ];
    },

    async fetchDepDocuments() {
      try {
        const response = await axios({
          method: "get",
          url: `/mobileapp/api/orgstructure/depDocumentListAll?count=6&startFrom=${this.depDocuments.length}&depId=${this.depId}`,
        });

        if (response) {
          this.depDocumentsEnd = response.data.end;
          return response.data.documents;
        } else {
          this.depDocumentsEnd = true;
          return [];
        }
      } catch (error) {
        return [];
      }
    },

    async addDepDocuments() {
      this.depDocuments = [
        ...this.depDocuments,
        ...(await this.fetchDepDocuments()),
      ];
    },

    clear() {
      this.depMenu = [];
      this.depChildDeps = [];
      this.depEmployees = [];
      this.depDocuments = [];
    },

    updateTabs() {
      if (!this.activeTab.id) {
        this.activeTab =
          this.tabsNav[this.findIndexTabNav(this.depInfo.ROOT_SECTION_ID)];
      }
    },

    selectDep(id) {
      this.changeUrl(id);
      this.appTreeKey++;
    },

    findIndexTabNav(id) {
      return this.tabsNav.findIndex((item) => item.id === id);
    },

    async getinfo() {
      this.clear();
      this.fetchDepInfo();
      this.getDepMenu();
      this.depChildDeps = await this.fetchDepСhildDep();
      this.depEmployees = await this.fetchDepEmployees();
      this.depDocuments = await this.fetchDepDocuments();
    },
  },

  computed: {
    depId() {
      return this.$route.params.catchAll;
    },

    currentUser() {
      return JSON.parse(localStorage.currentUser);
    },
  },

  async mounted() {
    await this.fetchTabsNav();

    if (!this.depId) {
      this.$nextTick(() => {
        this.activeTab = this.tabsNav[0];
        this.changeUrl(this.activeTab.id);
      });
    } else {
      if (this.findIndexTabNav(this.depId) > -1) {
        this.$nextTick(() => {
          this.activeTab = this.tabsNav[this.findIndexTabNav(this.depId)];
        });
      }

      this.getinfo();
    }
  },

  watch: {
    activeTab() {
      this.fetchTreeData();
    },

    depId() {
      this.getinfo();
    },

    $route: {
      immediate: true,
      handler() {},
    },
  },
};
</script>

<style lang="scss" scoped>
.app-orgstructure {
  display: flex;
  gap: var(--v-rhythm-8);

  &__aside {
    position: relative;

    width: 437px;
    flex-shrink: 0;
  }

  &__nav {
    position: sticky;
    top: calc(var(--headerHeight) + var(--v-rhythm-6));
    left: 0;
  }

  &__navbar {
    max-height: calc(100vh - 140px - 24px);
    overflow-y: auto;
  }

  &__main {
    width: 100%;
  }

  &__main-title {
    margin-bottom: var(--v-rhythm-8);

    @extend .h2;
    color: var(--gray900);
  }

  &__main-nav {
    margin-bottom: var(--v-rhythm-10);

    display: flex;
    flex-wrap: wrap;
  }

  &__main-nav-item {
  }

  &__main-nav-link {
  }

  &__main-content {
    display: flex;
    flex-direction: column;
    gap: var(--v-rhythm-10);
  }

  &__leader {
  }

  &__subordinate {
  }

  &__subordinate-title {
    margin-bottom: var(--v-rhythm-6);

    @extend .h3;
    color: var(--gray500);
  }

  &__subordinate-title-count {
    color: var(--gray500);
  }

  &__more {
    margin-top: var(--v-rhythm-6);
    padding: 6px var(--v-rhythm-2);
    width: 100%;
    display: flex;
    justify-content: center;

    background-color: var(--white900);
    border: 2px solid var(--gray200);

    &-btn {
    }
  }

  &__divisions {
    display: flex;
    flex-direction: column;
    gap: var(--v-rhythm-8);
  }

  &__division {
    *:last-child {
      margin-bottom: 0;
    }
  }

  &__division-title {
    display: block;

    margin-bottom: var(--v-rhythm-4);

    @extend .h4;
    color: var(--gray700);
  }

  &__division-leader {
  }

  &__employees {
    display: flex;
    flex-direction: column;
    gap: var(--v-rhythm-2);
  }

  &__employee {
  }

  &__documents {
    padding: var(--v-rhythm-4) 0;

    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--v-rhythm-8);

    background-color: var(--white900);
  }

  &__document {
  }

  @include desktop {
    gap: var(--v-rhythm-6);

    &__aside {
      width: 380px;
    }
  }

  @include laptop {
    flex-direction: column;

    &__aside {
      width: 100%;
    }
  }

  @include phones {
    &__main-nav {
      margin-bottom: var(--v-rhythm-4);
    }

    &__documents {
      grid-template-columns: 1fr;
    }
  }
}
.page-divisions__search {
  width: 100%;

  ::v-deep {
    .input-search-department__input {
      border: none;
    }
  }
}
</style>

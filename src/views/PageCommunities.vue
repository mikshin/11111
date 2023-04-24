<template>
  <AppPage class="page-communities">
    <MainSidebar class="page-communities__main-sidebar">
      <template #main>
        <div class="page-communities__main" :class="{ loading: isLoading }">
          <div
            class="page-communities__communities"
            v-if="communities.length > 0"
          >
            <CommunityCard
              class="page-communities__community"
              v-for="community in communities"
              :key="community.ID"
              :communityData="community"
            />

            <div
              v-if="!communitiesIsEnd"
              v-intersection="uploadCommunities"
            ></div>
          </div>

          <div class="page-communities__text-default" v-else>
            Сообщества не найдены
          </div>
        </div>
      </template>
      <template #sidebar>
        <div class="page-communities__sidebar">
          <button
            class="page-communities__sidebar-btn primary-btn"
            @click="openAddModal"
          >
            Добавить сообщество
          </button>

          <AppFilter
            class="page-communities__sidebar-filter"
            :key="filterKey"
            :isLoading="filterIsLoading"
            :isDisabledSubmit="isDisabledSubmit"
            :isDisabledReset="isDisabledReset"
            @filterSubmit="getFilteredCommunities"
            @filterReset="filterReset"
          >
            <InputTemplate
              class="page-communities__sidebar-input-template"
              v-for="(input, i) in filterInputs"
              :key="i"
              :input="input"
              @onChange="getInputTemplateNewValue"
            />
          </AppFilter>
        </div>
      </template>
    </MainSidebar>

    <transition name="fade">
      <CommunityAddEditModal
        :key="addEditModalKey"
        :isVisible="addEditModalIsOpen"
        :isEdit="false"
        @onClose="closeAddEditModal"
        @update="update"
      />
    </transition>
  </AppPage>
</template>

<script>
import axios from "axios";
import AppPage from "@/components/UI/page/AppPage.vue";
import MainSidebar from "@/components/UI/page/MainSidebar.vue";
import CommunityCard from "@/components/communities/CommunityCard.vue";
import AppFilter from "@/components/filter/AppFilter.vue";
import InputTemplate from "@/components/UI/inputTemplate.vue";
import { objectEmptyCheck } from "@/assets/scripts/scripts.js";
import CommunityAddEditModal from "@/components/communities/CommunityAddEditModal.vue";

export default {
  name: "PageCommunities",

  components: {
    AppPage,
    MainSidebar,
    CommunityCard,
    AppFilter,
    InputTemplate,
    CommunityAddEditModal,
  },

  props: {},

  data() {
    return {
      isLoading: false,
      communities: [],
      communitiesIsEnd: true,

      filterInputs: [],
      filterKey: 0,
      filterIsLoading: false,
      parametrsFilter: null,

      isDisabledSubmit: true,

      addEditModalKey: 0,
      addEditModalIsOpen: false,
    };
  },

  computed: {
    isDisabledReset() {
      return !this.parametrsFilter ? true : false;
    },
  },

  methods: {
    openAddModal() {
      this.addEditModalIsOpen = true;
    },

    closeAddEditModal() {
      this.addEditModalIsOpen = false;
      this.addEditModalKey += 1;
    },

    async uploadCommunities() {
      this.communities = [
        ...this.communities,
        ...(await this.getCommunities()),
      ];
    },

    async getFilteredCommunities() {
      this.communities = [];
      this.communities = await this.getCommunities();
      this.isDisabledSubmit = true;
    },

    async getCommunities() {
      try {
        this.isLoading = true;
        this.communitiesIsEnd = true;
        const response = await axios({
          method: "post",
          url: `/mobileapp/api/group/list`,
          data: {
            count: 10,
            startFrom: this.communities.length,
            filter: this.parametrsFilter,
          },
        });

        this.communitiesIsEnd = response.data.end;
        return response.data.data;
      } catch (error) {
        console.log(error);
        return [];
      } finally {
        this.isLoading = false;
      }
    },

    // Получаем данные для инпутов с сервера
    async getFilterInputs() {
      try {
        this.filterIsLoading = true;
        const response = await axios({
          method: "get",
          url: "/mobileapp/api/group/filter",
        });
        this.filterInputs = response.data;
      } catch {
        this.filterInputs = [];
      } finally {
        this.filterIsLoading = false;
      }
    },

    filterReset() {
      // Переинициализируем компонент, что бы сбросить данные вложенных инпутов
      this.filterKey += 1;
      this.parametrsFilter = null;
      this.getFilteredCommunities();
    },

    getInputTemplateNewValue(data) {
      const currentFilter = data.data;
      // Исключаем первое срабатывание при инициализации
      if (currentFilter.newValue !== null) {
        const filterName = currentFilter.input.name;
        let filterValue;

        if (typeof currentFilter.newValue === "object") {
          if (currentFilter.newValue.code) {
            filterValue = currentFilter.newValue.code;
          } else if (currentFilter.newValue.length) {
            filterValue = this.getCode(currentFilter.newValue);
          } else {
            filterValue = null;
          }
        } else {
          filterValue = currentFilter.newValue;
        }

        if (filterValue) {
          this.parametrsFilter
            ? (this.parametrsFilter[filterName] = filterValue)
            : (this.parametrsFilter = {
                [filterName]: filterValue,
              });
        } else {
          this.clearParametrsFilter(filterName);
        }

        this.isDisabledSubmit = false;
      }
    },

    clearParametrsFilter(parametr) {
      if (this.parametrsFilter && parametr in this.parametrsFilter) {
        delete this.parametrsFilter[parametr];
        if (objectEmptyCheck(this.parametrsFilter)) this.parametrsFilter = null;
      }
    },

    update(id) {
      this.$router.push(`/communities/${id}`);
    },
  },

  watch: {},

  mounted() {
    // Получаем список сообществ
    this.uploadCommunities();
    // Получаем фильтры
    this.getFilterInputs();
  },
};
</script>

<style scoped lang="scss">
.page-communities {
  &__main-sidebar {
  }

  &__main {
  }

  &__communities {
    width: 100%;

    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--v-rhythm-8);
  }

  &__community {
  }

  &__text-default {
    @extend .h2;
    color: var(--gray500);
  }

  &__sidebar {
    display: flex;
    flex-direction: column;
    gap: var(--v-rhythm-6);
  }

  &__sidebar-btn {
    width: 100%;
  }

  &__sidebar-filter {
    width: 100%;
  }

  @include phones {
    &__communities {
      grid-template-columns: repeat(1, 1fr);
      gap: var(--v-rhythm-4);
    }
  }
}
</style>
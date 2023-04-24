<template>
  <AppPage class="page-stop-cards">
    <MainSidebar
      class="page-stop-cards__main-sidebar"
      :class="{ loading: isLoading }"
    >
      <template #main>
        <div class="page-stop-cards__dropdown-list">
          <StopDropdown
            class="page-stop-cards__stop-dropdown"
            v-for="(item, index) in monthsList"
            :key="index"
            :index="item.id"
            :titleString="item.name"
            :filter="filterForCards"
            @changeCardsList="changeCardsList"
            @fetchEnd="fetchEndHandler"
          />
        </div>
      </template>
      <template #sidebar>
        <router-link
          to="/stop_cards/new"
          class="page-stop-cards__sidebar-btn primary-btn"
        >
          Заполнить Стоп-карту
        </router-link>

        <JsonExcel
          v-if="browserWindowWidth > 767 && isUserCanDownloadRegistry"
          :fields="tableFelds"
          :fetch="download"
          name="реестр Стоп-карт.xls"
          worksheet="Реестр Стоп-карт"
        >
          <button
            class="page-stop-cards__sidebar-btn secondary-btn"
            :disabled="stopCardsList.length === 0"
          >
            <UserIcons :iconName="'download'" />
            <span>Скачать реестр</span>
          </button>
        </JsonExcel>
        <AppFilter
          :key="filterKey"
          :isLoading="isLoading"
          :isDisabledSubmit="isDisabledSubmit"
          :isDisabledReset="isDisabledReset"
          @filterSubmit="updateFilterForCards"
          @filterReset="filterReset"
        >
          <template v-for="(input, i) in filterInputs">
            <FilterPeriod
              :key="i"
              v-if="input.type === 'period'"
              :name="input.placeholder"
              @onChange="getPeriodNewValue"
            />

            <InputTemplate
              v-else
              :key="i"
              :input="input"
              :ref="input.name"
              @onChange="getInputTemplateNewValue"
            />
          </template>
        </AppFilter>
      </template>
    </MainSidebar>
  </AppPage>
</template>

<script>
/* eslint-disable */
import AppPage from "@/components/UI/page/AppPage.vue";
import MainSidebar from "@/components/UI/page/MainSidebar.vue";
import AppFilter from "@/components/filter/AppFilter.vue";
import InputTemplate from "@/components/UI/inputTemplate.vue";
import FilterPeriod from "@/components/UI/filter/FilterPeriod.vue";

import axios from "axios";
import JsonExcel from "vue-json-excel";
import StopDropdown from "@/components/stop-cards/StopDropdown.vue";
import { mapGetters } from "vuex";
import { isEqual, cloneDeep } from "lodash";

import {
  swapKeysAndValues,
  objectEmptyCheck,
} from "@/assets/scripts/scripts.js";

export default {
  name: "PageStopCards",

  components: {
    StopDropdown,
    AppPage,
    MainSidebar,
    JsonExcel,
    AppFilter,
    InputTemplate,
    FilterPeriod,
  },

  data() {
    return {
      isLoading: false,

      monthsList: null,

      stopCardsList: [],

      tableFelds: null,

      unloadTableData: null,

      filterInputs: [],

      parametrsFilter: null,

      filterForCards: null,

      filterKey: 0,

      isFetching: false,

      possibleUserStopCardsActions: [],
    };
  },

  computed: {
    exportMonths() {
      return this.stopCardsList.join(";");
    },

    ...mapGetters(["browserWindowWidth"]),

    isDisabledReset() {
      return this.parametrsFilter ? false : true;
    },

    isDisabledSubmit() {
      return (
        isEqual(this.parametrsFilter, this.filterForCards) || this.isFetching
      );
    },

    isUserCanDownloadRegistry() {
      return this.possibleUserStopCardsActions.includes("export");
    },
  },

  methods: {
    download() {
      return this.stopCardsList.length > 0 ? this.fetchData() : null;
    },

    fetchEndHandler() {
      this.isFetching = false;
    },

    async fetchData() {
      const response = await axios.get(
        "/mobileapp/api/stopCardsReestr/export/?month=" + this.exportMonths
      );

      this.tableFelds = swapKeysAndValues(response.data.head);
      return response.data.body;
    },

    async fetchFilter() {
      try {
        this.isLoading = true;
        const response = await axios({
          method: "get",
          url: `/mobileapp/api/stopCardsReestr/filter`,
        });
        this.filterInputs = response.data;
      } catch (error) {
        console.log(error);
      } finally {
        this.isLoading = false;
      }
    },

    updateFilterForCards() {
      this.isFetching = true;

      this.filterForCards = this.parametrsFilter
        ? cloneDeep(this.parametrsFilter)
        : null;
    },

    filterReset() {
      // Переинициализируем компонент, что бы сбросить данные вложенных инпутов
      this.filterKey += 1;
      this.parametrsFilter = null;
      this.updateFilterForCards();
      this.isFetching = false;
    },

    async getStopCardsReestr() {
      try {
        this.isLoading = true;
        const response = await axios({
          method: "get",
          url: `/mobileapp/api/stopCardsReestr/month`,
        });
        this.monthsList = response.data;
      } catch (error) {
        console.log("error");
      } finally {
        this.isLoading = false;
      }
    },

    changeCardsList(e) {
      const index = this.stopCardsList.indexOf(e);
      if (index === -1) {
        this.stopCardsList.push(e);
      } else {
        this.stopCardsList.splice(index, 1);
      }
    },

    getCode(arr) {
      return arr.map((item) => item.code);
    },

    getInputTemplateNewValue(data) {
      const currentFilter = data.data;
      const filterName = currentFilter.input.name;
      let filterValue;

      if (
        currentFilter.newValue &&
        typeof currentFilter.newValue === "object"
      ) {
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
        if (!this.parametrsFilter) {
          this.parametrsFilter = {};
        }
        this.$set(this.parametrsFilter, filterName, filterValue);
      } else {
        this.clearParametrsFilter(filterName);
      }
    },

    clearParametrsFilter(parametr) {
      if (this.parametrsFilter) {
        this.$delete(this.parametrsFilter, parametr);
        if (objectEmptyCheck(this.parametrsFilter)) this.parametrsFilter = null;
      }
    },

    getPeriodNewValue(data) {
      const currentFilterValue = data.data;
      const currentFilterType = data.sortDate;

      if (currentFilterValue) {
        if (!this.parametrsFilter) {
          this.parametrsFilter = {};
        }
        this.$set(this.parametrsFilter, "DEFAULT_DATE", currentFilterValue);
      } else if (this.parametrsFilter && this.parametrsFilter.DEFAULT_DATE) {
        this.clearParametrsFilter("DEFAULT_DATE");
      }

      this.validatePeriod(currentFilterType);
    },

    validatePeriod(type) {
      if (type === "multi" && this.parametrsFilter?.DEFAULT_DATE) {
        this.isValidPeriod =
          Object.keys(this.parametrsFilter.DEFAULT_DATE).length < 2
            ? false
            : true;
      } else {
        this.isValidPeriod = true;
      }
    },

    async getUserActionsRights() {
      try {
        const response = await axios({
          method: "get",
          url: `/mobileapp/api/stopCardsReestr/action`,
        });

        this.possibleUserStopCardsActions = response.data;
      } catch (error) {
        console.log(error);
      }
    },
  },

  mounted() {
    this.getStopCardsReestr();
    this.fetchFilter();
    this.getUserActionsRights();
  },
};
</script>

<style scoped lang="scss">
.page-stop-cards {
  &__dropdown-list {
    display: flex;
    flex-direction: column;
  }

  &__stop-dropdown {
    width: 100%;
  }

  &__sidebar-btn {
    width: 100%;
  }

  @include laptop {
    &__main-sidebar {
      gap: 0;
    }
  }
}
</style>

<template>
  <AppPage class="page-training"
    ><MainSidebar>
      <template #main>
        <div
          class="page-training__main-column-inner"
          :class="{
            loading: isLoading,
          }"
        >
          <div class="page-training__cards-list" v-if="trainingItems">
            <CourseCard
              v-for="card in trainingItems"
              :key="card.id"
              v-bind="card"
              :isDraft="card.draft"
              :isNewEmployee="card.new_employee"
            ></CourseCard>
          </div>
          <div class="page-text-default" v-else>{{ noDataText }}</div>
          <div v-if="!isEndLoading" v-intersection="fetchMoreTrainings"></div>
        </div>
      </template>
      <template #sidebar>
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
import axios from "axios";

import AppPage from "@/components/UI/page/AppPage.vue";
import MainSidebar from "@/components/UI/page/MainSidebar.vue";
import CourseCard from "@components/cards/CourseCard.vue";

import AppFilter from "@/components/filter/AppFilter.vue";
import InputTemplate from "@/components/UI/inputTemplate.vue";
import FilterPeriod from "@/components/UI/filter/FilterPeriod.vue";

import { isEqual, cloneDeep } from "lodash";
import { objectEmptyCheck } from "@utils";

export default {
  name: "PageTraining",
  components: {
    AppPage,
    MainSidebar,
    CourseCard,
    AppFilter,
    InputTemplate,
    FilterPeriod,
  },
  data() {
    return {
      isLoading: true,
      isEndLoading: true,

      trainingItems: null,

      parametrsFilter: null,
      filterForCards: null,

      filterInputs: [],
      filterKey: 0,
    };
  },
  mounted() {},

  methods: {
    updateFilterForCards() {
      this.filterForCards = this.parametrsFilter
        ? cloneDeep(this.parametrsFilter)
        : null;
    },
    async fetchTrainings() {
      try {
        if (!this.isLazyLoad) {
          this.isLoading = true;
        }
        this.isEndLoading = true;
        const response = await axios({
          method: "post",
          url: `/mobileapp/api/learning/list`,
          data: {
            count: 6,
            startFrom: this.trainingItems?.length || 0,
            filter: this.parametrsFilter,
          },
        });

        this.isEndLoading = response.data.end;

        if (this.isLazyLoad) {
          this.trainingItems = [...this.trainingItems, ...response.data.data];
        } else {
          this.trainingItems = response.data.data;
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.isLazyLoad = false;
        this.isLoading = false;
      }
    },
    async fetchMoreTrainings() {
      this.isLazyLoad = true;
      await this.fetchTrainings();
    },
    async fetchFilter() {
      try {
        this.isLoading = true;
        const response = await axios({
          method: "get",
          url: `/mobileapp/api/learning/filterField`,
        });
        this.filterInputs = response.data;
      } catch (error) {
        console.log(error);
      } finally {
        this.isLoading = false;
      }
    },
    filterReset() {
      // Переинициализируем компонент, что бы сбросить данные вложенных инпутов
      this.filterKey += 1;
      this.parametrsFilter = null;
      this.updateFilterForCards();
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
    async fetchListWithParams() {
      this.trainingItems = null;
      await this.fetchTrainings();
    },
  },

  computed: {
    isDisabledSubmit() {
      return (
        isEqual(this.parametrsFilter, this.filterForCards) || this.isLoading
      );
    },
    isDisabledReset() {
      return this.parametrsFilter || this.filterForCards ? false : true;
    },
    isNoResultsForFilter() {
      return this.filterForCards && !this.isLoading && !this.trainingItems;
    },
    noDataText() {
      return this.isNoResultsForFilter
        ? "Результатов не найдено"
        : "Курсы не найдены";
    },
  },

  watch: {
    filterForCards() {
      (this.trainingItems = null), this.fetchTrainings();
    },
  },

  created() {
    this.fetchTrainings();
    this.fetchFilter();
  },
};
</script>

<style lang="scss" scoped>
.page-training {
  &__cards-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(390px, 1fr));
    grid-auto-rows: minmax(280px, auto);
    gap: var(--v-rhythm-8);
  }

  @include phones {
    &__cards-list {
      grid-template-columns: 100%;
      gap: var(--v-rhythm-4);
    }
  }
}
</style>
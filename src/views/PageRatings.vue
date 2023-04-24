<template>
  <AppPage class="rating">
    <MainSidebar>
      <template #main>
        <div class="rating__items-wrapper" :class="{ loading: isLoading }">
          <div class="rating__list" v-if="rating">
            <template v-for="(month, m) in rating">
              <div class="rating__month" :key="m" v-if="month.ratings">
                <span class="rating__month-name">
                  {{ month.month }}
                </span>
                <template v-for="(rating, r) in month.ratings">
                  <span class="rating__type-name" :key="r">
                    {{ rating.name }}
                  </span>
                  <template v-for="obj in rating.raitingCard">
                    <RatingList :data="obj" :key="obj.ID" />
                  </template>
                </template>
              </div>
            </template>
          </div>
          <div v-else class="rating__no_results">Рейтингов не найдено</div>
          <div v-intersection="getMoreRatings" v-if="!isEnd"></div>
        </div>
      </template>
      <template #sidebar>
        <AppFilter
          :key="filterKey"
          :isLoading="isFilterLoading"
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
import AppPage from "@/components/UI/page/AppPage.vue";
import RatingList from "@/components/pages/rating/RatingList.vue";
import MainSidebar from "@/components/UI/page/MainSidebar.vue";
import AppFilter from "@/components/filter/AppFilter.vue";
import InputTemplate from "@/components/UI/inputTemplate.vue";
import FilterPeriod from "@/components/UI/filter/FilterPeriod.vue";

import axios from "axios";

import { isEqual, cloneDeep } from "lodash";

import { objectEmptyCheck } from "@/assets/scripts/scripts.js";

export default {
  name: "PageRatings",

  components: {
    RatingList,
    AppPage,
    MainSidebar,
    AppFilter,
    InputTemplate,
    FilterPeriod,
  },

  data() {
    return {
      rating: null,

      isLoading: true,

      isFilterLoading: true,

      isFetching: false,

      filterInputs: [],

      parametrsFilter: null,

      filterForCards: null,

      filterKey: 0,

      isEnd: false,

      startFrom: 0,
    };
  },

  mounted() {
    this.getRatings();
    this.fetchFilter();
  },

  watch: {
    filterForCards() {
      this.getRatings();
    },
  },

  computed: {
    isDisabledReset() {
      return this.parametrsFilter ? false : true;
    },

    isDisabledSubmit() {
      return (
        isEqual(this.parametrsFilter, this.filterForCards) || this.isFetching
      );
    },
  },

  methods: {
    async getRatings() {
      let response;

      try {
        this.isLoading = true;
        this.rating = null;

        response = await axios({
          method: "post",
          url:
            `/mobileapp/api/raiting/?count=3` +
            (this.startFrom ? "&startFrom=" + this.startFrom : ""),
          data: {
            extraFilter: this.filterForCards,
          },
        });
        this.rating = response.data.data;
        this.isEnd = response.data.end;
      } catch (error) {
        if (error.response.data.errorMessage === "Рейтингов не найдено") {
          this.rating = null;
        } else {
          console.log(error.response);
        }
      } finally {
        this.isLoading = false;
        this.isFetching = false;
        this.getStartFrom();
      }
    },

    async getMoreRatings() {
      if (this.startFrom > 0) {
        let response;

        try {
          response = await axios({
            method: "post",
            url: `/mobileapp/api/raiting/?count=3&startFrom=` + this.startFrom,
            data: {
              extraFilter: this.filterForCards,
            },
          });
          this.rating = [...this.rating, ...response.data.data];
          this.isEnd = response.data.end;
        } finally {
          this.getStartFrom();
        }
      }
    },
    getStartFrom() {
      // console.log(this.rating[this.rating.length - 1]);
      this.startFrom = this.rating[this.rating.length - 1].monthKey;
    },
    async fetchFilter() {
      try {
        this.isFilterLoading = true;
        const response = await axios({
          method: "get",
          url: `/mobileapp/api/raiting/filter`,
        });
        this.filterInputs = response.data;
      } catch (error) {
        console.log(error);
      } finally {
        this.isFilterLoading = false;
      }
    },

    updateFilterForCards() {
      this.isFetching = true;
      this.filterForCards = this.parametrsFilter
        ? cloneDeep(this.parametrsFilter)
        : null;
      this.startFrom = 0;
    },

    filterReset() {
      // Переинициализируем компонент, что бы сбросить данные вложенных инпутов
      this.filterKey += 1;
      this.parametrsFilter = null;
      this.updateFilterForCards();
      this.isFetching = false;
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
        this.parametrsFilter
          ? (this.parametrsFilter.DEFAULT_DATE = currentFilterValue)
          : (this.parametrsFilter = {
              DEFAULT_DATE: currentFilterValue,
            });
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
  },
};
</script>

<style lang="scss" scoped>
.rating-item {
  &__list {
    display: flex;
  }
  &__place {
    display: flex;
    flex-direction: column-reverse;
  }
  &__month-name {
  }
  &__name {
  }
  &__place-item {
    ul {
      display: flex;
    }
  }
}
.rating {
  &__month {
    border-top: 2px solid var(--gray300);
    margin-bottom: var(--v-rhythm-20);
    &:last-child {
      margin-bottom: 0;
    }
  }
  &__month-name {
    @extend .h2;
    padding-top: var(--v-rhythm-3);
    display: block;
  }
  &__no_results {
    @extend .h2;
    color: var(--gray500);
  }
  &__type-name {
    @extend .h3;
    padding-top: var(--v-rhythm-8);
    margin-bottom: var(--v-rhythm-5);
    display: block;
  }
}
</style>

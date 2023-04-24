<template>
  <AppFilter
    class="page-search-filter"
    :key="componentKey"
    :isLoading="isLoading"
    :isDisabledSubmit="isDisabledSubmit"
    :isDisabledReset="isDisabledReset"
    @filterSubmit="filterSubmit"
    @filterReset="filterReset"
  >
    <template v-for="(input, i) in inputs">
      <FilterPeriod
        class="page-search-filter__filter-period"
        :key="i"
        v-if="input.type === 'period'"
        :name="input.placeholder"
        @onChange="getPeriodNewValue"
      />

      <InputTemplate
        class="page-search-filter__input-template"
        v-else
        :key="i"
        :input="input"
        :ref="input.name"
        @onChange="getInputTemplateNewValue"
      />
    </template>
  </AppFilter>
</template>

<script>
import axios from "axios";
import AppFilter from "@/components/filter/AppFilter.vue";
import InputTemplate from "@/components/UI/inputTemplate.vue";
import { objectEmptyCheck } from "@/assets/scripts/scripts.js";
import FilterPeriod from "@/components/UI/filter/FilterPeriod.vue";

export default {
  name: "PageSearchFilter",

  components: {
    AppFilter,
    InputTemplate,
    FilterPeriod,
  },

  props: {
    activeCategory: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      componentKey: 0,
      isLoading: false,
      parametrsFilter: null,
      inputs: [],
      isValidPeriod: true,
    };
  },

  computed: {
    isDisabledSubmit() {
      return this.parametrsFilter && this.isValid ? false : true;
    },

    isDisabledReset() {
      return !this.parametrsFilter ? true : false;
    },

    isValid() {
      return this.isValidPeriod;
    },
  },

  methods: {
    // Получаем данные для инпутов с сервера
    async getInputs(ENTITY, EXTRA_PARAMS = null) {
      try {
        this.isLoading = true;
        const response = await axios({
          method: "post",
          url: "/mobileapp/api/search/filter/",
          data: {
            ENTITY: ENTITY,
            EXTRA_PARAMS: { UF_1C_IDENTIFICATOR: EXTRA_PARAMS },
          },
        });
        this.inputs = response.data;
      } catch {
        this.inputs = [];
      } finally {
        this.isLoading = false;
      }
    },

    clearParametrsFilter(parametr) {
      if (this.parametrsFilter) {
        delete this.parametrsFilter[parametr];
        if (objectEmptyCheck(this.parametrsFilter)) this.parametrsFilter = null;
      }
    },

    filterSubmit() {
      this.$emit("filterSubmit", {
        parametrsFilter: this.parametrsFilter,
        activeCategory: this.activeCategory,
      });
    },

    filterReset() {
      // Переинициализируем компонент, что бы сбросить данные вложенных инпутов
      this.componentKey += 1;
      this.parametrsFilter = null;
      this.$emit("filterReset", this.parametrsFilter);

      this.getInputs(this.activeCategory);
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

    getInputTemplateNewValue(data) {
      const currentFilter = data.data;
      const filterName = currentFilter.input.name;
      let filterValue;

      if (typeof currentFilter.newValue === "object") {
        if (currentFilter.newValue) {
          if (currentFilter.newValue.code) {
            filterValue = currentFilter.newValue.code;
          } else if (currentFilter.newValue.length) {
            filterValue = this.getCode(currentFilter.newValue);
          }
        } else {
          filterValue = null;
        }
      } else {
        filterValue = currentFilter.newValue;
      }

      // Делаем запрос, что бы получить данные для селектов Подразделение и Должность
      if (filterName === "UF_1C_IDENTIFICATOR") {
        this.getInputs(this.activeCategory, filterValue);
      }

      if (filterValue) {
        this.parametrsFilter
          ? (this.parametrsFilter[filterName] = filterValue)
          : (this.parametrsFilter = {
              [filterName]: filterValue,
            });
      } else {
        this.clearParametrsFilter(filterName);

        if (filterName === "UF_1C_IDENTIFICATOR") {
          this.clearDepAndPos();
        }
      }
    },

    getCode(arr) {
      return arr.map((item) => item.code);
    },

    clearDepAndPos() {
      // Перерисовывам компонент, что бы сбросить выбранные значения
      ["UF_DEPARTMENT", "UF_WORK_POSITION"].forEach((item) => {
        if (this.parametrsFilter && this.parametrsFilter[item]) {
          this.clearParametrsFilter(item);
          this.$refs[item][0].$vnode.key += Date.now();
        }
      });
    },
  },

  watch: {
    activeCategory() {
      this.filterReset();
      this.getInputs(this.activeCategory);
    },

    parametrsFilter() {
      if (this.parametrsFilter === null) this.filterReset();
    },
  },

  mounted() {
    this.getInputs(this.activeCategory);
  },
};
</script>

<style scoped lang="scss"></style>
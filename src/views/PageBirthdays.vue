<template>
  <AppPage class="page-birthdays">
    <MainSidebar class="page-birthdays__main-sidebar">
      <template #main>
        <div class="page-birthdays__main" :class="{ loading: isLoading }">
          <div class="page-birthdays__birthday-list" v-if="birthdays.length">
            <Birthday
              class="page-birthdays__birthday"
              v-for="(birthday, k) in birthdays"
              :key="k"
              :birthday="birthday"
              withDate="true"
              :day="calculateToday(birthday.PERSONAL_BIRTHDAY)"
            />

            <div v-intersection="updateBirthdays" v-if="!isEndLoading"></div>
          </div>

          <div class="page-birthdays__text-default" v-else>
            Дни рождения не найдены
          </div>
        </div>
      </template>
      <template #sidebar>
        <div class="page-birthdays__sidebar">
          <AppFilter
            class="page-birthdays__sidebar-filter"
            :key="filterKey"
            :isLoading="filterIsLoading"
            :isDisabledSubmit="isDisabledSubmit"
            :isDisabledReset="!parametrsFilter"
            @filterSubmit="getBirthdays"
            @filterReset="filterReset"
          >
            <InputRadio
              :input="{ radioValue: inputRadio.radioValue }"
              @onChange="getRadioValue"
            />

            <InputTemplate
              class="page-birthdays__sidebar-input-template"
              v-for="(input, i) in inputs"
              :key="i"
              :input="input"
              @onChange="getParametrsFilter"
            />
          </AppFilter>
        </div>
      </template>
    </MainSidebar>
  </AppPage>
</template>

<script>
import axios from "axios";

import AppPage from "@/components/UI/page/AppPage.vue";
import MainSidebar from "@/components/UI/page/MainSidebar.vue";
import Birthday from "@/components/pages/birthdays/birthday.vue";
import AppFilter from "@/components/filter/AppFilter.vue";
import InputRadio from "@/components/UI/inputs/InputRadio";
import InputTemplate from "@/components/UI/inputTemplate.vue";
import { objectEmptyCheck } from "@/assets/scripts/scripts.js";

export default {
  name: "PageBirthdays",

  components: {
    AppPage,
    MainSidebar,
    Birthday,
    AppFilter,
    InputTemplate,
    InputRadio,
  },

  data() {
    return {
      birthdays: [],
      months: [
        "января",
        "февраля",
        "марта",
        "апреля",
        "мая",
        "июня",
        "июля",
        "августа",
        "сентября",
        "октября",
        "ноября",
        "декабря",
      ],
      todayDay: new Date().getDate(),
      isEndLoading: true,
      isLoading: false,

      inputRadio: {
        type: "",
        radioValue: [
          {
            name: "По дате",
            type: "date",
            code: "date",
          },
          {
            name: "По месяцу",
            type: "select",
            code: "month",
          },
        ],
      },

      filterInputs: [],
      filterKey: 0,
      filterIsLoading: false,
      parametrsFilter: null,
      isDisabledSubmit: true,
    };
  },

  computed: {
    todayMonth() {
      return this.months[new Date().getMonth()];
    },

    inputs() {
      return this.filterInputs.filter(
        (item) => item.type === this.inputRadio.type
      );
    },
  },

  methods: {
    getRadioValue(value) {
      this.inputRadio.type = value.data.newValue.type;
      this.parametrsFilter = null;
    },

    async loadContent(startFrom) {
      try {
        this.isLoading = true;
        this.isEndLoading = true;
        const response = await axios({
          method: "get",
          url: `/mobileapp/api/birthday`,
          params: {
            count: 20,
            startFrom: startFrom,
            filter: this.parametrsFilter,
          },
        });

        this.isEndLoading = response.data.end;
        return response.data.data;
      } catch (error) {
        this.isEndLoading = true;
        return [];
      } finally {
        this.isLoading = false;
      }
    },

    async getBirthdays() {
      this.isDisabledSubmit = true;
      this.birthdays = await this.loadContent(0);
    },

    async updateBirthdays() {
      this.birthdays = [
        ...this.birthdays,
        ...(await this.loadContent(this.birthdays.length)),
      ];
    },

    // Получаем данные для инпутов с сервера
    async getFilterInputs() {
      try {
        this.filterIsLoading = true;
        const response = await axios({
          method: "get",
          url: "/mobileapp/api/birthday/filter/",
        });
        this.filterInputs = response.data;
      } catch {
        this.filterInputs = [];
      } finally {
        this.filterIsLoading = false;
      }
    },

    getParametrsFilter(data) {
      const currentFilter = data.data;
      const filterType = currentFilter.input.type;
      const filterName = currentFilter.input.name;
      let filterValue;

      if (this.parametrsFilter || currentFilter.newValue) {
        this.isDisabledSubmit = false;
      }

      if (currentFilter.newValue) {
        if (filterType === "date") {
          filterValue = currentFilter.newValue;
        } else if (filterType === "select") {
          filterValue = currentFilter.newValue.code;
        }
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
    },

    clearParametrsFilter(parametr) {
      if (this.parametrsFilter && parametr in this.parametrsFilter) {
        delete this.parametrsFilter[parametr];
        if (objectEmptyCheck(this.parametrsFilter)) this.parametrsFilter = null;
      }
    },

    filterReset() {
      // Переинициализируем компонент, что бы сбросить данные вложенных инпутов
      this.filterKey += 1;
      this.parametrsFilter = null;
      this.inputRadio.type = "";
      this.getBirthdays();
    },

    calculateToday(incomingDay) {
      if (
        incomingDay.day == this.todayDay &&
        incomingDay.month === this.todayMonth
      )
        return "today";
      return "";
    },
  },

  watch: {
    parametrsFilter() {
      if (!this.parametrsFilter) {
        this.getBirthdays();
      }
    },
  },

  mounted() {
    this.getBirthdays();
    // Получаем фильтры
    this.getFilterInputs();
  },
};
</script>

<style lang="scss" scoped>
.page-birthdays {
  &__main-sidebar {
  }

  &__main {
  }

  &__birthday {
  }

  &__text-default {
    @extend .h2;
    color: var(--gray500);
  }

  &__sidebar {
  }

  &__sidebar-filter {
  }

  &__sidebar-input-template {
  }
}
</style>

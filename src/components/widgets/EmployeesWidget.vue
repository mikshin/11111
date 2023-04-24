<template>
  <WidgetWrapper
    class="employees-widget"
    :class="{ loading: isLoading }"
    :iconName="'group'"
    :title="name"
  >
    <div class="employees-widget__content">
      <div
        class="employees-widget__card"
        v-for="card in employees"
        :key="card.id"
      >
        <SimplePersonCard
          class="employees-widget__card-person"
          :avatar="{
            src: card.USER_PHOTO,
            alt: card.FULL_NAME,
          }"
          :fullName="card.FULL_NAME"
          :profession="card.UF_WORK_POSITION"
          :link="true"
          :id="card.ID"
          :vacation="card.VACATION"
          :fired="card.FIRED"
        />
      </div>
      <div v-if="!isEndLoading" v-intersection="updata"></div>
    </div>
  </WidgetWrapper>
</template>

<script>
import axios from "axios";

import WidgetWrapper from "@/components/widgets/WidgetWrapper.vue";
import SimplePersonCard from "@/components/person-cards/SimplePersonCard.vue";

export default {
  name: "EmployeesWidget",

  components: {
    WidgetWrapper,
    SimplePersonCard,
  },

  props: {
    name: {
      type: String,
      required: false,
      default: "Сотрудники",
    },

    depId: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      isLoading: false,
      employees: [],
      isEndLoading: true,
    };
  },

  computed: {},

  methods: {
    async fetchNewEmployees() {
      try {
        this.isLoading = true;
        const response = await axios({
          method: "get",
          url: `/mobileapp/api/orgstructure/listDepEmployee?count=10&startFrom=${this.employees.length}&depId=${this.depId}`,
        });
        this.isEndLoading = response.data.end;
        return response.data.employee;
      } catch (error) {
        console.log(error);
      } finally {
        this.isLoading = false;
      }
    },

    async getNewEmployees() {
      this.employees = await this.fetchNewEmployees();
    },

    async updata() {
      const response = await this.fetchNewEmployees();
      this.employees = [...this.employees, ...response];
    },
  },

  watch: {},

  mounted() {
    this.getNewEmployees();
  },
};
</script>

<style scoped lang="scss">
.employees-widget {
  &__content {
    overflow-y: auto;
    // Убираем баг, с полосой прокрутки
    height: calc(100% + 1px);
  }

  &__card {
    width: 100%;
    padding: var(--v-rhythm-2) var(--v-rhythm-3);

    display: flex;
    align-items: center;
  }

  &__card-person {
  }
}
</style>
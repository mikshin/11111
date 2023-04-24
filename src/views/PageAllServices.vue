<template>
  <AppPage class="page-services" :noTitle="false">
    <MainSidebar
      class="page-services__main_sidebar"
      :class="{ loading: !isDataLoaded }"
    >
      <template #main>
        <div class="page-services__main_body">
          <ServiceCard
            v-for="service in fetchedServices"
            :key="service.id"
            :service="service"
            @modalShow="showModal"
          />

          <div v-if="!isEndLoading" v-intersection="updata"></div>
        </div>
        <div v-if="!fetchedServices" class="page-services__no_results">
          Сервисы не найдены
        </div>
      </template>
      <template #sidebar>
        <ServicesFilter
          @filterSubmit="updateServices"
          @filterReset="resetFilter"
        />
      </template>
    </MainSidebar>
    <transition name="fade">
      <ServiceRequestModal
        v-if="isModalVisible"
        :serviceID="serviceID"
        @closeModal="isModalVisible = false"
      />
    </transition>
  </AppPage>
</template>

<script>
import AppPage from "@/components/UI/page/AppPage.vue";
import MainSidebar from "@/components/UI/page/MainSidebar.vue";
import axios from "axios";
import ServiceCard from "../components/pages/Services/ServiceCard.vue";
import ServicesFilter from "../components/pages/Services/ServicesFilter.vue";
import ServiceRequestModal from "../components/modals/ServiceRequestModal.vue";
export default {
  name: "PageAllServices",

  components: {
    AppPage,
    MainSidebar,
    ServiceCard,
    ServicesFilter,
    ServiceRequestModal,
  },

  props: {
    // some: {
    //   type: String,
    //   required: false,
    //   default: "",
    // },
  },

  data() {
    return {
      fetchedServices: [],
      serviceID: "",
      isDataLoaded: false,
      isEndLoading: true,
      isModalVisible: false,
      count: 10,
      startFrom: 0,
      filter: {
        NAME: "",
      },
    };
  },

  computed: {},
  methods: {
    async getServices() {
      try {
        this.isDataLoaded = false;
        axios.defaults.headers["PAGE_VISIT_DATE"] = Date.now();
        const response = await axios.post(
          `/mobileapp/api/services/getServiceList`,
          {
            filter: this.filter,
            count: this.count,
            startFrom: this.startFrom,
          }
        );
        if (response) {
          if (response.data.end) {
            this.isEndLoading = true;
          }
          return response.data.data;
        }
      } catch (e) {
        console.log(e);
      } finally {
        this.isDataLoaded = true;
      }
    },
    async initialFetch() {
      this.fetchedServices = await this.getServices();
    },
    updateServices(e) {
      if (e.length > 0) {
        this.filter.NAME = e;
        this.initialFetch();
      }
    },
    async updata() {
      const response = await this.getServices();
      this.fetchedServices = [...this.fetchedServices, ...response];
    },
    resetFilter() {
      this.filter.NAME = "";
      this.initialFetch();
    },
    showModal(i) {
      this.isModalVisible = !this.isModalVisible;
      this.serviceID = i;
    },
  },

  watch: {},

  mounted() {
    this.initialFetch();
  },
};
</script>

<style scoped lang="scss">
.page-services {
  &__no_results {
    @extend .h2;
    color: var(--gray500);
  }
  &__main_body {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--v-rhythm-8);
  }
  @include phones {
    &__main_body {
      grid-template-columns: 1fr;
    }
  }
}
</style>
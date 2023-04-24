<template>
  <div class="advertisements_page-wrapper">
    <AppPage class="page-manager-questions">
      <MainSidebar class="page-manager-questions__main_sidebar">
        <template #main>
          <div
            class="advertisements_page__cards_wrapper"
            v-if="advertisementsList.length > 0"
          >
            <div
              class="advertisements_page__card"
              v-for="(i, index) in advertisementsList"
              :key="index"
            >
              <AdvertisementCard :cardInfo="i" />
            </div>
            <div v-if="!isEndLoading" v-intersection="updata"></div>
          </div>
          <div v-else class="advertisements_page__text-default">
            Объявления не найдены
          </div>
        </template>
        <template #sidebar>
          <div class="advertisements_page__sidebar">
            <button
              class="advertisements_page__sidebar-btn primary-btn"
              @click="openAddModal"
            >
              Добавить объявление
            </button>

            <AdvertisementsFilter
              class="advertisements_page__filter"
              @filterOptions="filterChanged"
            />
          </div>
        </template>
      </MainSidebar>

      <transition name="fade">
        <AdvertisementAddEditModal
          :key="addEditModalKey"
          :isVisible="addEditModalIsOpen"
          :isEdit="false"
          @onClose="closeAddEditModal"
          @update="updateAfterAdd"
        />
      </transition>
    </AppPage>
  </div>
</template>

<script>
import axios from "axios";
import AppPage from "@/components/UI/page/AppPage.vue";
import MainSidebar from "@/components/UI/page/MainSidebar.vue";
import AdvertisementsFilter from "@/components/pages/Advertisements/AdvertisementsFilter.vue";
import AdvertisementCard from "@/components/pages/Advertisements/AdvertisementCard.vue";
import AdvertisementAddEditModal from "@/components/pages/Advertisements/AdvertisementAddEditModal.vue";

export default {
  name: "PageAdvertisements",

  components: {
    AppPage,
    MainSidebar,
    AdvertisementsFilter,
    AdvertisementCard,
    AdvertisementAddEditModal,
  },

  props: {},

  data() {
    return {
      isAdvLoading: true,
      advertisementsList: [],
      isEndLoading: true,
      startFrom: 0,
      count: 6,
      filter: "",

      addEditModalKey: 0,
      addEditModalIsOpen: false,
    };
  },

  computed: {},

  methods: {
    closeAddEditModal() {
      this.addEditModalIsOpen = false;
      this.addEditModalKey += 1;
    },

    openAddModal() {
      this.addEditModalIsOpen = true;
    },

    async getList() {
      this.isAdvLoading = true;
      try {
        axios.defaults.headers["PAGE_VISIT_DATE"] = Date.now();
        const response = await axios.post("/mobileapp/api/advertising/list", {
          filter: this.filter,
          startFrom: this.startFrom,
          count: this.count,
        });
        if (response) {
          this.isEndLoading = response.data.end;
          // this.advertisementsList = response.data.data;
          this.startFrom += response.data.data.length;
          return response.data.data;
        }
      } catch (e) {
        console.log(e);
      } finally {
        this.isAdvLoading = false;
      }
    },
    async getAdvertisements() {
      this.advertisementsList = await this.getList();
    },
    async updata() {
      const response = await this.getList();
      this.advertisementsList = [...this.advertisementsList, ...response];
    },
    filterChanged(e) {
      this.filter = e;
      this.startFrom = 0;
      this.getAdvertisements();
    },
    updateAfterAdd() {
      this.advertisementsList = [];
      this.startFrom = 0;
      this.getAdvertisements();
    },
  },

  watch: {},

  mounted() {
    this.getAdvertisements();
  },
};
</script>

<style scoped lang="scss">
.advertisements_page {
  &__cards_wrapper {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--v-rhythm-5) var(--v-rhythm-8);
  }
  &__card {
    align-self: stretch;
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

  &__text-default {
    @extend .h2;
    color: var(--gray500);
  }

  @include phones {
    &__cards_wrapper {
      grid-template-columns: 1fr;
      gap: var(--v-rhythm-2);
    }
  }
}
</style>
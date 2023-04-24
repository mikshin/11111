<template>
  <WidgetWrapper
    :iconName="'services'"
    :title="'Популярные сервисы'"
    v-if="fetchedServices && fetchedServices.length"
  >
    <div class="display_hack">
      <div class="service_widget__wrapper" :class="{ loading: isLoading }">
        <ul class="service_widget__list">
          <li
            class="service_widget__list_item"
            v-for="(service, index) in fetchedServices"
            :key="index"
            @click="showModal(service.ID)"
          >
            <span class="service_widget__text">
              {{ service.NAME }}
            </span>
            <span class="service_widget__circle">
              <UserIcons
                class="service_widget__circle-icon"
                :iconName="'arrow-right'"
              />
            </span>
          </li>
        </ul>
      </div>
      <div class="service_widget__footer">
        <router-link to="/services" class="service_widget__link"
          >Все сервисы</router-link
        >
      </div>
    </div>
    <transition name="fade">
      <ServiceRequestModal
        v-if="isModalVisible"
        :serviceID="serviceID"
        @closeModal="isModalVisible = false"
      />
    </transition>
  </WidgetWrapper>
</template>

<script>
import axios from "axios";
import ServiceRequestModal from "@/components/modals/ServiceRequestModal.vue";
import WidgetWrapper from "@/components/widgets/WidgetWrapper.vue";
export default {
  name: "ServicesWidget",

  components: { WidgetWrapper, ServiceRequestModal },

  props: {
    // some: {
    //   type: String,
    //   required: false,
    //   default: "",
    // },
  },

  data() {
    return {
      isLoading: true,
      fetchedServices: [],
      isModalVisible: false,
      serviceID: "",
    };
  },

  computed: {},

  methods: {
    async getServicesForWidget() {
      try {
        this.isLoading = true;
        const response = await axios.get(
          "/mobileapp/api/services/getServiceWidget"
        );
        if (response) {
          this.fetchedServices = response.data.data;
        }
      } catch (e) {
        console.log(e);
      } finally {
        this.isLoading = false;
      }
    },
    showModal(i) {
      this.isModalVisible = !this.isModalVisible;
      this.serviceID = i;
    },
  },

  watch: {},

  mounted() {
    this.getServicesForWidget();
  },
};
</script>

<style scoped lang="scss">
.service_widget {
  &__wrapper {
    padding: var(--v-rhythm-5) 0;
  }
  &__list_item {
    height: 64px;
    background-color: var(--white900);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 var(--v-rhythm-8);
    cursor: pointer;
    @include transition();

    @include hover {
      background-color: var(--red300);
      .service_widget__text {
        color: var(--red900);
      }
    }
  }
  &__text {
    @extend .subtitle-2;
    color: var(--gray900);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  &__circle {
    width: 38px;
    height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    border-radius: 50%;
    background-color: var(--red900);
    border: 1px solid var(--red900);
    @include transition(background-color);
  }

  &__circle-icon {
    width: 20px;
    height: 20px;

    fill: var(--white900);
    @include transition(fill);
  }
  &__footer {
    height: 76px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-top: 2px solid var(--gray300);
  }
  &__link {
    color: var(--red900);
    font-weight: bold;
    font-size: 14px;
  }
  @include phones {
    &__list_item {
      min-height: 48px;
      height: auto;
    }
    &__text {
      -webkit-line-clamp: 2;
    }
  }
}
.display_hack {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}
</style>
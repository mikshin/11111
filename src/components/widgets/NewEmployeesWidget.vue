<template>
  <!-- v-if="newEmployees" нужен для того, что бы скрывать виджет на главной, если нет сотрудников -->
  <WidgetWrapper
    v-if="newEmployees.length"
    class="new-employees-widget"
    :iconName="'group'"
    :title="name"
    :class="{ loading: isLoading }"
  >
    <div class="new-employees-widget__content">
      <div
        class="new-employees-widget__card"
        v-for="card in newEmployees"
        :key="card.id"
      >
        <SimplePersonCard
          class="new-employees-widget__card-person"
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
        <button
          class="new-employees-widget__card-button"
          @click="sendCongratulation(card)"
        >
          <WelcomeTooltip class="new-employees-widget__card-tooltip" />
        </button>
      </div>
      <div v-if="!isEndLoading" v-intersection="updata"></div>
    </div>

    <transition name="fade">
      <AppModal
        class="new-employees-widget__popup"
        v-if="isPopupVisible"
        @onClose="isPopupVisible = !isPopupVisible"
        :maxWidth="'600'"
      >
        <div class="new-employees-widget__popup-content">
          <div class="new-employees-widget__popup-title">
            Приветствие отправлено!
          </div>
          <p class="new-employees-widget__popup-message">
            <template v-if="this.sendCongratulationResponse.status === 200"
              >Вы поприветствовали нового сотрудника
              <router-link
                class="new-employees-widget__popup-message-link"
                :to="`/lk?=${currentCard.ID}`"
                >{{ currentCard.FULL_NAME }}</router-link
              ></template
            >
            <template v-else
              >К сожалению, произошла ошибка. Повторите попытку позже.</template
            >
          </p>
        </div>
      </AppModal>
    </transition>
  </WidgetWrapper>
</template>

<script>
import axios from "axios";

import WidgetWrapper from "@/components/widgets/WidgetWrapper.vue";
import SimplePersonCard from "@/components/person-cards/SimplePersonCard.vue";
import WelcomeTooltip from "@/components/UI/tooltip/WelcomeTooltip.vue";
import AppModal from "@/components/modals/AppModal.vue";

export default {
  name: "NewEmployeesWidget",

  components: {
    WidgetWrapper,
    SimplePersonCard,
    WelcomeTooltip,
    AppModal,
  },

  props: {
    name: {
      type: String,
      required: false,
      default: "Новые сотрудники",
    },
  },

  data() {
    return {
      isLoading: false,
      sendCongratulationIsLoading: false,
      newEmployees: [],
      isEndLoading: true,
      isPopupVisible: false,
      sendCongratulationResponse: null,
      currentCard: null,
    };
  },

  computed: {},

  methods: {
    async fetchNewEmployees() {
      try {
        this.isLoading = true;
        const response = await axios({
          method: "get",
          url: `mobileapp/api/newEmployee/?count=10&startFrom=${this.newEmployees.length}`,
        });

        this.isEndLoading = response.data.end;
        return response.data;
      } catch (error) {
        return [];
      } finally {
        this.isLoading = false;
      }
    },

    async getNewEmployees() {
      const response = await this.fetchNewEmployees();
      this.newEmployees = response.data;
    },

    async updata() {
      const response = await this.fetchNewEmployees();
      this.newEmployees = [...this.newEmployees, ...response.data];
    },

    async sendCongratulation(card) {
      try {
        this.currentCard = card;
        this.sendCongratulationIsLoading = true;
        const response = await axios({
          method: "post",
          url: `mobileapp/api/newEmployee/add/`,
          data: {
            recipientId: card.ID,
          },
        });

        this.sendCongratulationResponse = response;
        this.showPopup();
      } catch (error) {
        console.log(error);
      } finally {
        this.sendCongratulationIsLoading = false;
      }
    },

    showPopup() {
      this.isPopupVisible = true;

      setTimeout(() => {
        this.isPopupVisible = false;
      }, 3000);
    },
  },

  watch: {},

  mounted() {
    this.getNewEmployees();
  },
};
</script>

<style scoped lang="scss">
.new-employees-widget {
  &__content {
    max-height: 476px;
    overflow-y: auto;
  }

  &__card {
    width: 100%;
    padding: var(--v-rhythm-2) var(--v-rhythm-3);

    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--v-rhythm-2);
  }

  &__card-person {
  }

  &__card-button {
    flex-shrink: 0;
  }

  &__card-tooltip {
  }

  &__popup {
    &-content {
    }

    &-title {
      margin-bottom: var(--v-rhythm-4);

      @extend .h3;
      color: var(--gray900);
    }

    &-message {
      @extend .body-2;
      color: var(--gray900);
    }

    &-message-link {
      color: var(--red900);

      cursor: pointer;
      @include transition();

      &:active {
        opacity: var(--active-opacity);
      }
    }
  }
}
</style>
<template>
  <WidgetWrapper
    class="birthdays-widget-list"
    :iconName="'cake'"
    :title="name"
    :class="{ loading: isLoading }"
  >
    <div class="birthdays-widget-list__content">
      <div
        class="birthdays-widget-list__card"
        v-for="card in birthdaysList"
        :key="card.id"
      >
        <div class="birthdays-widget-list__card-date">
          {{ card.PERSONAL_BIRTHDAY.day }} {{ card.PERSONAL_BIRTHDAY.month }}
        </div>
        <SimplePersonCard
          class="birthdays-widget-list__card-person"
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
          class="birthdays-widget-list__card-button"
          v-if="card.accessCongratulate || card.accessReminderAdd"
          @click="action(card)"
        >
          <SimpleTooltip
            v-if="card.accessCongratulate"
            :iconName="'cake'"
            :content="'Поздравить'"
          />
          <SimpleTooltip
            v-else-if="card.accessReminderAdd"
            :iconName="'bell'"
            :content="'Напомнить'"
          />
        </button>
      </div>
      <div v-if="!isEndLoading" v-intersection="updata"></div>
    </div>

    <transition name="fade" v-if="selectUser && selectUser.accessCongratulate">
      <HappyBirthdayModal
        :isVisible="popupIsVisible"
        :user="selectUser"
        @closePopup="popupIsVisible = false"
      />
    </transition>

    <transition
      name="fade"
      v-else-if="selectUser && selectUser.accessReminderAdd"
    >
      <BirthdayReminderModal
        :isVisible="popupIsVisible"
        :user="selectUser"
        @closePopup="popupIsVisible = false"
        @sended="hideReminder"
      />
    </transition>
  </WidgetWrapper>
</template>

<script>
import axios from "axios";

import WidgetWrapper from "@/components/widgets/WidgetWrapper.vue";
import SimplePersonCard from "@/components/person-cards/SimplePersonCard.vue";
import SimpleTooltip from "@/components/UI/tooltip/SimpleTooltip.vue";
import HappyBirthdayModal from "@/components/modals/HappyBirthdayModal.vue";
import BirthdayReminderModal from "@/components/modals/BirthdayReminderModal.vue";

export default {
  name: "BirthdaysWidgetList",

  components: {
    WidgetWrapper,
    SimplePersonCard,
    SimpleTooltip,
    HappyBirthdayModal,
    BirthdayReminderModal,
  },

  props: {
    name: {
      type: String,
      required: false,
      default: "Дни рождения",
    },

    depId: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      isLoading: false,
      birthdaysList: [],
      isEndLoading: true,
      popupIsVisible: false,
      selectUser: null,
    };
  },

  computed: {},

  methods: {
    async fetchBirthdaysList() {
      try {
        this.isLoading = true;
        this.isEndLoading = true;
        const response = await axios({
          method: "get",
          // url: `/mobileapp/api/orgstructure/birthdays/?count=10&startFrom=${this.birthdaysList.length}&depId=4646`,
          url: `/mobileapp/api/orgstructure/birthdays/?count=10&startFrom=${this.birthdaysList.length}&depId=${this.depId}`,
        });

        if (response) {
          this.isEndLoading = response.data.end;
          return response.data;
        } else {
          return null;
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.isLoading = false;
      }
    },

    async getBirthdaysList() {
      const response = await this.fetchBirthdaysList();
      if (response) this.birthdaysList = response.data;
    },

    async updata() {
      const response = await this.fetchBirthdaysList();
      this.birthdaysList = [...this.birthdaysList, ...response.data];
    },

    action(card) {
      this.selectUser = Object.assign({}, card);
      this.popupIsVisible = true;
    },

    hideReminder() {
      const user = this.birthdaysList.find(
        (item) => item.ID === this.selectUser.ID
      );
      user.accessReminderAdd = false;
    },
  },

  watch: {},

  mounted() {
    this.getBirthdaysList();
  },
};
</script>

<style scoped lang="scss">
.birthdays-widget-list {
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

  &__card-date {
    width: calc(80 * 100% / 414);
    margin-right: var(--v-rhythm-2);
    flex-shrink: 0;

    @extend .subtitle-1;
    color: var(--gray500);
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  &__card-person {
    padding-left: var(--v-rhythm-2);
    margin-right: auto;

    border-left: 1px solid var(--gray500);
  }

  &__card-button {
    width: 24px;
    height: 24px;
    margin-left: var(--v-rhythm-2);

    flex-shrink: 0;
  }

  &__card-tooltip {
  }

  &__popup {
  }
}
</style>
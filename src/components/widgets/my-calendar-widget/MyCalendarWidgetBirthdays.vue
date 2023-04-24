<template>
  <div class="my-calendar-widget-birthdays">
    <ul
      class="my-calendar-widget-birthdays__list"
      v-if="listBirthdays.length > 0"
    >
      <li
        class="my-calendar-widget-birthdays__card"
        v-for="item in listBirthdays"
        :key="item.ID"
      >
        <SimplePersonCard
          class="my-calendar-widget-birthdays__card-person"
          :avatar="{
            src: item.USER_PHOTO,
            alt: item.FULL_NAME,
          }"
          :fullName="item.FULL_NAME"
          :profession="item.UF_WORK_POSITION"
          :link="true"
          :id="item.ID"
          :vacation="item.VACATION"
          :fired="item.FIRED"
        />

        <button
          class="my-calendar-widget-birthdays__card-button"
          v-if="item.accessCongratulate || item.accessReminderAdd"
          @click="action(item)"
        >
          <SimpleTooltip
            v-if="item.accessCongratulate"
            :iconName="'cake'"
            :content="'Поздравить'"
          />
          <SimpleTooltip
            v-else-if="item.accessReminderAdd"
            :iconName="'bell'"
            :content="'Напомнить'"
          />
        </button>
      </li>
    </ul>

    <span class="my-calendar-widget-birthdays__text-default" v-else
      >На выбранную дату дней рождений нет</span
    >

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
  </div>
</template>

<script>
import SimplePersonCard from "@/components/person-cards/SimplePersonCard.vue";
import SimpleTooltip from "@/components/UI/tooltip/SimpleTooltip.vue";
import HappyBirthdayModal from "@/components/modals/HappyBirthdayModal.vue";
import BirthdayReminderModal from "@/components/modals/BirthdayReminderModal.vue";

export default {
  name: "MyCalendarWidgetBirthdays",

  components: {
    SimplePersonCard,
    SimpleTooltip,
    HappyBirthdayModal,
    BirthdayReminderModal,
  },

  props: {
    listBirthdays: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      popupIsVisible: false,
      selectUser: null,
    };
  },

  computed: {},

  methods: {
    action(card) {
      this.selectUser = Object.assign({}, card);
      this.popupIsVisible = true;
    },

    hideReminder() {
      const user = this.listBirthdays.find(
        (item) => item.ID === this.selectUser.ID
      );
      user.accessReminderAdd = false;
    },
  },

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss">
.my-calendar-widget-birthdays {
  &__list {
    display: flex;
    flex-direction: column;
    gap: var(--v-rhythm-4);
  }

  &__card {
    width: 100%;

    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--v-rhythm-2);
  }

  &__card-person {
  }

  &__card-button {
    width: 24px;
    height: 24px;

    flex-shrink: 0;
  }

  &__text-default {
    @extend .body-1;
    color: var(--gray900);
  }
}
</style>
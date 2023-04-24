<template>
  <div class="birthday__item" v-if="birthday">
    <span
      v-if="isShowDate"
      class="birthday__date"
      :class="{ today: day === 'today' }"
    >
      {{ birthday.PERSONAL_BIRTHDAY.day }}
      {{ birthday.PERSONAL_BIRTHDAY.month }}
    </span>
    <SimplePersonCard
      class="birthday__card"
      :avatar="{
        src: birthday.USER_PHOTO,
        alt: birthday.FULL_NAME,
      }"
      :fullName="birthday.FULL_NAME"
      :profession="birthday.UF_DEPARTMENT"
      :link="true"
      :id="birthday.ID"
      :vacation="birthday.VACATION"
      :fired="birthday.FIRED"
    />
    <button
      class="birthday__button"
      v-if="day === 'today'"
      @click="congratulate(birthday.ID)"
    >
      <SimpleTooltip
        class="birthday__button-icon"
        :iconName="'cake'"
        :content="'Поздравить'"
      />
    </button>
    <button
      class="birthday__button"
      v-else
      @click="remind(birthday)"
      :disabled="!birthday.accessReminderAdd"
    >
      <SimpleTooltip
        class="birthday__button-icon"
        :class="{
          'birthday__button-icon--active': !birthday.accessReminderAdd,
        }"
        :iconName="'bell'"
        :content="
          birthday.accessReminderAdd ? 'Напомнить' : 'Напоминание добавлено'
        "
      />
    </button>

    <AppModal
      v-if="isModalShown"
      @onClose="isModalShown = !isModalShown"
      :maxWidth="'600'"
    >
      <div class="modal__wrapper">
        <div class="modal__headline" v-if="isRemind">
          {{ text }}
        </div>
        <template v-else>
          <HappyBirthdayModal
            :user="birthday"
            :isVisible="isModalShown"
            @closePopup="isModalShown = false"
            :isResizeable="true"
            @click="onSended(birthday.ID)"
          />
        </template>
      </div>
    </AppModal>
  </div>
</template>

<script>
import AppModal from "@/components/modals/AppModal.vue";
import SimplePersonCard from "@/components/person-cards/SimplePersonCard.vue";
import SimpleTooltip from "@/components/UI/tooltip/SimpleTooltip.vue";
import axios from "axios";
import HappyBirthdayModal from "@/components/modals/HappyBirthdayModal.vue";

export default {
  data() {
    return {
      isModalShown: false,
      isRemind: false,
      text: "Напоминание добавлено",
      congratMessage: "",
      congratID: 0,
    };
  },
  props: {
    birthday: null,
    day: null,
    isShowDate: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    AppModal,
    SimplePersonCard,
    SimpleTooltip,
    HappyBirthdayModal,
  },
  methods: {
    congratulate(el) {
      this.isRemind = false;
      this.isModalShown = true;
      this.congratID = el;
    },
    remind(item) {
      axios
        .post("/mobileapp/api/birthday/addReminder/", {
          birthdayUserId: item.ID,
        })
        .then(() => {
          this.isRemind = true;
          this.text = "Напоминание добавлено";
          this.isModalShown = true;
          setTimeout(() => {
            this.isModalShown = false;
          }, 1000);
          item.accessReminderAdd = false;
        });
    },
    onSended() {
      axios
        .post("/mobileapp/api/birthday/add", {
          recipientId: this.congratID,
          text: this.congratMessage,
        })
        .then(() => {
          this.isRemind = true;
          this.text = "Ваше поздравление успешно отправлено";
          setTimeout(() => {
            this.isModalShown = false;
          }, 1000);
        });
    },
    change(data) {
      this.congratMessage = data.data.newValue;
    },
  },
};
</script>

<style lang="scss" scoped>
.birthday {
  &__headline {
    @extend .caption-2;
    color: var(--gray500);
    padding: var(--v-rhythm-4) 0;
  }
  &__card {
    flex: 1;
  }
  &__item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: var(--v-rhythm-2) 0;
    fill: var(--red900);

    &:hover {
      .birthday__button {
        opacity: 1;
      }
    }
  }
  &__button {
    padding-left: 10px;
    opacity: 1;
  }
  &__button-icon {
    &--active {
      ::v-deep {
        .info-tooltip__icon {
          fill: var(--red900);
        }
      }
    }
  }
  &__date {
    min-width: 92px;
    display: block;
    height: 100%;
    margin-right: 24px;
    position: relative;
    @extend .subtitle-1;
    color: var(--gray500);
    &:after {
      content: "";
      position: absolute;
      right: 0;
      top: 50%;
      height: 56px;
      transform: translateY(-50%);
      width: 1px;
      background-color: var(--gray300);
    }
    &.today {
      color: var(--gray900);
    }
  }
}
</style>

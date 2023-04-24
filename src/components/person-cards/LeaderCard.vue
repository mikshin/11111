<template>
  <div class="leader-card">
    <div class="leader-card__column">
      <SimplePicture class="leader-card__photo" :src="src" :alt="fullName" />

      <VacationLabel class="leader-card__label" v-if="vacation" />
      <FiredLabel class="leader-card__label" v-else-if="fired" />

      <div class="leader-card__btns" v-if="canAddQuestion">
        <AskQuestionButton
          class="leader-card__btn leader-card__ask-question-btn"
          @openModalDialog="toggleModal"
          :title="'Задать вопрос'"
        />

        <!-- Пока функционал не реализовываем. -->
        <!-- <button class="leader-card__btn secondary-btn">
          <UserIcons :iconName="'cake'" />
          <span>Поздравить с Днем Рождения</span>
        </button> -->
      </div>
    </div>
    <div class="leader-card__info">
      <div class="leader-card__head">
        <ProfileName
          class="leader-card__profile"
          :id="id"
          :name="fullName"
          :company="company"
          :division="division"
          :profession="workPosition"
        />
      </div>
      <ul class="leader-card__contacts">
        <li class="leader-card__contact">
          <span class="leader-card__contact-title">Внутренний телефон</span>
          <a
            class="leader-card__contact-link"
            v-if="workPhone"
            :href="`tel:${workPhone}`"
            >{{ workPhoneWithInnerCode }}</a
          >
          <span class="leader-card__contact-link" v-else>-</span>
        </li>
        <li class="leader-card__contact">
          <span class="leader-card__contact-title">Мобильный телефон</span>
          <a
            class="leader-card__contact-link"
            v-if="personPhone"
            :href="`tel:${personPhone}`"
            >{{ personPhone }}</a
          >
          <span class="leader-card__contact-link" v-else>-</span>
        </li>
        <li class="leader-card__contact">
          <span class="leader-card__contact-title">Почта</span>
          <a
            class="leader-card__contact-link"
            v-if="workEmail"
            :href="`mailto:${workEmail}`"
            >{{ workEmail }}</a
          >
          <span class="leader-card__contact-link" v-else>-</span>
        </li>
        <li class="leader-card__contact">
          <span class="leader-card__contact-title">Адрес</span>
          <address class="leader-card__contact-link" v-if="workAddress">
            {{ workAddress }}
          </address>
          <span class="leader-card__contact-link" v-else>-</span>
        </li>
      </ul>
      <div class="leader-card__supervisor" v-if="deputySubstitute">
        <span class="leader-card__supervisor-title">Заместитель</span>
        <SimplePersonCard
          class="leader-card__supervisor-person"
          :avatar="{
            src: deputySubstitute.USER_PHOTO,
            alt: deputySubstitute.NAME_FI,
          }"
          :fullName="deputySubstitute.NAME_FI"
          :profession="deputySubstitute.UF_WORK_POSITION"
          :link="true"
          :id="deputySubstitute.ID"
          :vacation="deputySubstitute.VACATION"
          :fired="deputySubstitute.FIRED"
        />
      </div>
      <div class="leader-card__supervisor" v-if="headFullName">
        <span class="leader-card__supervisor-title">Руководитель</span>
        <SimplePersonCard
          class="leader-card__supervisor-person"
          :avatar="{
            src: headSrc,
            alt: headFullName,
          }"
          :fullName="headFullName"
          :profession="headWorkPosition"
          :link="true"
          :id="headID"
          :vacation="headVacation"
          :fired="headFired"
        />
      </div>
    </div>
    <transition name="fade">
      <AskQuestionModal
        v-if="isModalVisible"
        @closeModal="toggleModal"
        :recipient="questionProfileInfo"
      />
    </transition>
  </div>
</template>

<script>
import SimplePicture from "@/components/UI/SimplePicture.vue";
import ProfileName from "@/components/person-cards/ProfileName.vue";
import SimplePersonCard from "@/components/person-cards/SimplePersonCard.vue";
import AskQuestionButton from "@/components/pages/AskManager/AskQuestionButton.vue";
import AskQuestionModal from "@/components/modals/AskQuestionModal.vue";
import VacationLabel from "@/components/UI/labels/VacationLabel.vue";
import FiredLabel from "@/components/UI/labels/FiredLabel.vue";

export default {
  name: "LeaderCard",

  components: {
    SimplePicture,
    ProfileName,
    SimplePersonCard,
    AskQuestionButton,
    AskQuestionModal,
    VacationLabel,
    FiredLabel,
  },

  data() {
    return {
      isModalVisible: false,
    };
  },

  props: {
    canAddQuestion: {
      type: Boolean,
      default: false,
    },
    vacation: {
      type: Boolean,
      required: false,
    },
    fired: {
      type: Boolean,
      required: false,
    },
    id: {
      type: String,
      required: false,
    },
    src: {
      type: String,
      required: false,
    },
    fullName: {
      type: String,
      required: false,
    },
    company: {
      type: String,
      required: false,
    },
    division: {
      type: String,
      required: false,
    },
    workPosition: {
      type: String,
      required: false,
    },
    workPhone: {
      type: String,
      required: false,
    },
    innerWorkPhone: {
      type: String,
      required: false,
    },
    personPhone: {
      type: String,
      required: false,
    },
    workEmail: {
      type: String,
      required: false,
    },
    workAddress: {
      type: String,
      required: false,
    },
    deputySrc: {
      type: String,
      required: false,
    },
    deputySubstitute: {
      type: Object,
      required: false,
    },
    deputyID: {
      type: String,
      required: false,
    },
    deputyWorkPosition: {
      type: String,
      required: false,
    },
    headSrc: {
      type: String,
      required: false,
    },
    headFullName: {
      type: String,
      required: false,
    },
    headID: {
      type: String,
      required: false,
    },
    headWorkPosition: {
      type: String,
      required: false,
    },
    headVacation: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  methods: {
    toggleModal() {
      this.isModalVisible = !this.isModalVisible;
    },
  },
  computed: {
    workPhoneWithInnerCode() {
      return this.innerWorkPhone
        ? `${this.workPhone} (доб. ${this.innerWorkPhone})`
        : this.workPhone;
    },
    questionProfileInfo() {
      return {
        value: {
          code: this.id,
          label: this.fullName,
        },
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.leader-card {
  display: flex;

  background: var(--white900);
  box-shadow: 0 0 0 2px var(--gray200);

  &__column {
    position: relative;

    width: 320px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;

    background: rgba(242, 245, 248, 0.5);
  }

  &__photo {
    width: 100%;
    height: 320px;
    flex-shrink: 0;
  }

  &__label {
    position: absolute;
    top: var(--v-rhythm-4);
    left: var(--v-rhythm-4);
  }

  &__btns {
    display: flex;
    flex-direction: column;
    gap: var(--v-rhythm-2);
    flex-basis: 100%;
    padding: var(--v-rhythm-4) var(--v-rhythm-3);
  }

  &__btn {
    width: 100%;
  }

  &__ask-question-btn {
    margin-bottom: unset;
  }

  &__info {
    width: 100%;
    padding: var(--v-rhythm-6) var(--v-rhythm-8);
    display: flex;
    flex-direction: column;
    gap: var(--v-rhythm-6);

    box-shadow: 0 0 0 1px var(--gray200);
  }

  &__head {
    display: flex;
    gap: var(--v-rhythm-6);
    align-items: flex-start;
  }

  &__profile {
    width: 100%;
  }

  &__contacts {
    position: relative;

    padding-top: var(--v-rhythm-5);
    display: flex;
    flex-direction: column;
    gap: var(--v-rhythm-3);

    &::before {
      content: "";

      position: absolute;
      top: 0;
      left: 0;
      transform: translateY(-100%);

      width: 100%;
      height: 2px;

      background-color: var(--gray200);
    }
  }

  &__contact {
    display: flex;
    flex-direction: column;
    gap: var(--v-rhythm-1);
  }

  &__contact-title {
    @extend .caption-2;
    color: var(--gray500);
  }

  &__contact-link {
    @extend .body-2;
    color: var(--gray900);
    font-style: normal;
  }

  &__supervisor {
    position: relative;

    padding-top: var(--v-rhythm-1);

    &::before {
      content: "";

      position: absolute;
      top: 0;
      left: 0;
      transform: translateY(-100%);

      width: 100%;
      height: 2px;

      background-color: var(--gray200);
    }
  }

  &__supervisor-title {
    display: block;
    margin-bottom: var(--v-rhythm-4);

    @extend .caption-2;
    color: var(--gray500);
  }

  &__supervisor-person {
  }

  @include desktop {
    &__column {
      width: 240px;
    }

    &__photo {
      height: 240px;
    }
  }

  @include phones {
    flex-direction: column;

    &__column {
      width: 100%;
    }

    &__info {
      padding: var(--v-rhythm-6) 10px;
    }

    &__supervisor-title {
      margin-bottom: var(--v-rhythm-3);
    }
  }
}
</style>
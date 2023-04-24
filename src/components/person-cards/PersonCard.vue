<template>
  <!-- !TODO переделать анимацию раскрытия -->
  <div class="person-card">
    <div class="person-card__column" v-if="!isMob">
      <SimplePicture
        class="person-card__photo"
        :src="personData.USER_PHOTO"
        :alt="personData.FULL_NAME"
      />
      <VacationLabel class="person-card__label" v-if="personData.VACATION" />
      <FiredLabel class="person-card__label" v-else-if="personData.FIRED" />

      <!-- Пока функционал не реализовываем. -->
      <!-- <transition name="fade">
        <div class="person-card__btns" v-if="isOpen">
          <button class="person-card__btn secondary-btn">
            <UserIcons :iconName="'cake'" />
            <span>Поздравить с Днем Рождения</span>
          </button>
        </div>
      </transition> -->
    </div>
    <div class="person-card__info">
      <div class="person-card__head" v-if="!isMob">
        <ProfileName
          class="person-card__profile"
          :id="personData.ID"
          :isSmall="true"
          :name="personData.FULL_NAME"
          :company="personData.COMPANY"
          :division="personData.UF_DEPARTMENT"
          :profession="personData.UF_WORK_POSITION"
        />
        <button
          class="person-card__more text-btn"
          :class="{ 'person-card__more--open': isOpen }"
          @click="open"
        >
          <span>{{ moreText }}</span>
          <UserIcons class="person-card__more-icon" :iconName="'arrow-down'" />
        </button>
      </div>

      <UserIcons
        class="person-card__vacation-label-mob"
        v-if="isMob && personData.VACATION"
        :iconName="'vacation-label'"
      />

      <AppProfile
        class="person-card__head-mob"
        v-if="isMob"
        :simplePicture="{
          src: personData.USER_PHOTO,
          alt: personData.FULL_NAME,
        }"
        :profileName="{
          id: personData.ID,
          name: personData.FULL_NAME,
          company: personData.COMPANY,
          division: personData.UF_DEPARTMENT,
          profession: personData.UF_WORK_POSITION,
        }"
      />
      <!-- Пока функционал не реализовываем. -->
      <!-- <transition name="fade">
        <div class="person-card__btns" v-if="isOpen && isMob">
          <button class="person-card__btn secondary-btn">
            <UserIcons :iconName="'cake'" />
            <span>Поздравить с Днем Рождения</span>
          </button>
        </div>
      </transition> -->
      <ul class="person-card__contacts">
        <li class="person-card__contact">
          <span class="person-card__contact-title">Внутренний телефон</span>
          <a
            class="person-card__contact-link"
            v-if="personData.UF_PHONE_INNER"
            :href="`tel:${personData.UF_PHONE_INNER}`"
            v-html="personData.UF_PHONE_INNER"
          ></a>
          <span class="person-card__contact-link" v-else>-</span>
        </li>
        <li class="person-card__contact">
          <span class="person-card__contact-title">Почта</span>
          <a
            class="person-card__contact-link"
            v-if="personData.EMAIL"
            :href="`mailto:${personData.EMAIL}`"
            v-html="personData.EMAIL"
          ></a>
          <span class="person-card__contact-link" v-else>-</span>
        </li>
        <transition name="fade">
          <li class="person-card__contact" v-if="isOpen">
            <span class="person-card__contact-title">Мобильный телефон</span>
            <a
              class="person-card__contact-link"
              v-if="personData.WORK_PHONE"
              :href="`tel:${personData.WORK_PHONE}`"
              v-html="personData.WORK_PHONE"
            ></a>
            <span class="person-card__contact-link" v-else>-</span>
          </li></transition
        >
        <transition name="fade">
          <li class="person-card__contact" v-if="isOpen">
            <span class="person-card__contact-title">Адрес</span>
            <address
              v-if="personData.WORK_STREET"
              class="person-card__contact-link"
              v-html="personData.WORK_STREET"
            ></address>
            <span class="person-card__contact-link" v-else>-</span>
          </li></transition
        >
      </ul>
      <transition name="fade">
        <div
          class="person-card__supervisor"
          v-if="isOpen && personData.UF_HEAD"
        >
          <span class="person-card__supervisor-title">Руководитель</span>
          <SimplePersonCard
            class="person-card__supervisor-person"
            :avatar="{
              src: personData.UF_HEAD.USER_PHOTO,
              alt: personData.UF_HEAD.FULL_NAME,
            }"
            :fullName="personData.UF_HEAD.FULL_NAME"
            :profession="personData.UF_HEAD.UF_WORK_POSITION"
            :link="true"
            :id="personData.UF_HEAD.ID"
            :vacation="personData.UF_HEAD.VACATION"
            :fired="personData.UF_HEAD.FIRED"
          />
        </div>
      </transition>
      <div class="person-card__wrap-more" v-if="isMob">
        <button
          class="person-card__more text-btn"
          :class="{ 'person-card__more--open': isOpen }"
          @click="open"
        >
          <span>{{ moreText }}</span>
          <UserIcons class="person-card__more-icon" :iconName="'arrow-down'" />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import SimplePicture from "@/components/UI/SimplePicture.vue";
import ProfileName from "@/components/person-cards/ProfileName.vue";
import AppProfile from "@/components/person-cards/AppProfile.vue";
import SimplePersonCard from "@/components/person-cards/SimplePersonCard.vue";
import VacationLabel from "@/components/UI/labels/VacationLabel.vue";
import FiredLabel from "@/components/UI/labels/FiredLabel.vue";

export default {
  name: "PersonCard",

  components: {
    SimplePicture,
    ProfileName,
    AppProfile,
    SimplePersonCard,
    VacationLabel,
    FiredLabel,
  },

  data() {
    return {
      isOpen: false,
    };
  },

  props: {
    personData: {
      type: Object,
      required: true,
    },
  },

  computed: {
    ...mapGetters(["browserWindowWidth"]),

    moreText() {
      return this.isOpen ? "Свернуть" : "Узнать подробнее";
    },

    // workPhone() {
    //   return this.personData.UF_PHONE_INNER
    //     ? `${this.personData.WORK_PHONE} (доб. ${this.personData.UF_PHONE_INNER})`
    //     : this.personData.WORK_PHONE;
    // },

    isMob() {
      return this.browserWindowWidth < 768 ? true : false;
    },
  },

  methods: {
    open() {
      this.isOpen = !this.isOpen;
    },
  },

  mounted() {},
};
</script>

<style lang="scss" scoped>
// !TODO оптимизировать стили декоративных черточек
.person-card {
  display: flex;

  background: var(--white900);
  box-shadow: 0 0 0 2px var(--gray200);

  &__column {
    position: relative;

    width: 244px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;

    background: rgba(242, 245, 248, 0.5);
  }

  &__photo {
    width: 100%;
    height: 244px;
    flex-shrink: 0;
  }

  &__label {
    position: absolute;
    top: var(--v-rhythm-4);
    left: var(--v-rhythm-4);
  }

  &__vacation-label-mob {
    position: absolute;
    top: var(--v-rhythm-4);
    left: var(--v-rhythm-4);

    width: 16px;
    height: 16px;
  }

  &__btns {
    display: flex;
    flex-direction: column;
    gap: var(--v-rhythm-2);
    flex-basis: 100%;
    padding: var(--v-rhythm-3) var(--v-rhythm-2);
  }

  &__btn {
    width: 100%;
  }

  &__info {
    position: relative;

    width: 100%;
    padding: var(--v-rhythm-4) var(--v-rhythm-6);
    display: flex;
    flex-direction: column;
    gap: var(--v-rhythm-5);

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

  &__more {
    margin-left: auto;
    flex-shrink: 0;

    &--open {
      .person-card__more-icon {
        transform: rotate(-180deg);
      }
    }
  }

  &__contacts {
    position: relative;

    padding-top: var(--v-rhythm-4);
    display: flex;
    flex-direction: column;
    gap: 10px;

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
    gap: calc(var(--v-rhythm-1) / 2);
  }

  &__contact-title {
    @extend .caption-2;
    color: var(--gray500);
  }

  &__contact-link {
    width: max-content;

    @extend .body-1;
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
      width: 180px;
    }

    &__photo {
      height: 180px;
    }

    &__head {
      gap: var(--v-rhythm-3);
    }
  }

  @include phones {
    &__info {
      padding: {
        top: 10px;
        right: 10px;
        bottom: 5px;
        left: 10px;
      }
      gap: var(--v-rhythm-4);
    }

    &__btns {
      position: relative;

      padding: {
        top: var(--v-rhythm-4);
        right: 0;
        bottom: 0;
        left: 0;
      }

      gap: var(--v-rhythm-1);

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

    &__contacts {
      padding-top: var(--v-rhythm-3);
    }

    &__supervisor-title {
      margin-bottom: var(--v-rhythm-3);
    }

    &__wrap-more {
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

    &__more {
      margin: unset;
      width: 100%;
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  @include transition();
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
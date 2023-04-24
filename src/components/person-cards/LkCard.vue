<template>
  <div class="lk-card" :class="{ loading: isLoading }">
    <div class="lk-card__column">
      <div class="lk-card__photo">
        <VacationLabel class="lk-card__label" v-if="profileData.VACATION" />
        <FiredLabel class="lk-card__label" v-else-if="profileData.FIRED" />

        <AppAvatar
          class="lk-card__img"
          v-if="isMine"
          :src="this.profileData.USER_PHOTO"
          :alt="this.profileData.FULL_NAME"
          url="mobileapp/api/user/changePhoto"
        />
        <SimplePicture
          class="lk-card__img"
          v-else
          :src="this.profileData.USER_PHOTO"
          :alt="this.profileData.FULL_NAME"
        />
      </div>

      <div class="lk-card__btns" v-if="!isMine">
        <!-- <button class="lk-card__btn primary-btn">Задать вопрос</button> -->
        <AskQuestionButton
          class="lk-card__btn"
          v-if="profileData.ADD_QUESTION"
          @openModalDialog="toggleModal"
          :title="'Задать вопрос'"
          :isFired="profileData.FIRED"
        />

        <button
          class="lk-card__btn primary-btn"
          @click="thanksModalData.isOpen = true"
          :disabled="profileData.FIRED"
        >
          Поблагодарить
        </button>

        <button
          class="lk-card__btn secondary-btn"
          v-if="isBirthday"
          @click="birthdayModalisVisible = true"
          :disabled="profileData.FIRED"
        >
          <UserIcons :iconName="'cake'" />
          <span>Поздравить с Днем Рождения</span>
        </button>
      </div>
      <div class="lk-card__awards" v-if="awardsData">
        <AppReward
          class="lk-card__app-reward"
          v-for="(award, i) in awardsData"
          :key="i"
          :place="award.place"
          :title="award.name"
          :time="award.active_from"
        />
      </div>
    </div>
    <div class="lk-card__info">
      <div class="lk-card__head">
        <ProfileName
          class="lk-card__profile"
          :name="this.profileData.FULL_NAME"
          :profession="this.profileData.UF_WORK_POSITION"
          :birthday="this.profileData.PERSONAL_BIRTHDAY"
        />
      </div>
      <div class="lk-card__info-block">
        <span class="lk-card__info-block-title">Заместитель</span>
        <EditableSubstitute
          class="lk-card__editable-substitute"
          :substituteObj="this.profileData.UF_SUBSTITUTE"
          :id="id"
          v-if="isMine"
        />
        <template v-else>
          <SimplePersonCard
            class="lk-card__supervisor-person"
            v-if="this.profileData.UF_SUBSTITUTE"
            :avatar="{
              src: this.profileData.UF_SUBSTITUTE.USER_PHOTO,
              alt: this.profileData.UF_SUBSTITUTE.FULL_NAME,
            }"
            :fullName="this.profileData.UF_SUBSTITUTE.FULL_NAME"
            :profession="this.profileData.UF_WORK_POSITION"
            :link="true"
            :id="this.profileData.UF_SUBSTITUTE.ID"
            :vacation="this.profileData.UF_SUBSTITUTE.VACATION"
            :fired="this.profileData.UF_SUBSTITUTE.FIRED"
          />
          <div class="lk-card__supervisor-person" v-else>Не назначен</div>
        </template>
      </div>
      <div class="lk-card__info-block">
        <span class="lk-card__info-block-title">Структура подразделения</span>
        <SubdivisionTree
          class="lk-card__subdivision-tree"
          v-if="this.profileData.UF_DEPARTMENT"
          :dataObj="this.profileData.UF_DEPARTMENT"
        />
      </div>
    </div>

    <ContactsProfile
      class="lk-card__contacts-profile"
      :isMine="isMine"
      :id="id"
      :isFired="profileData.FIRED"
    />

    <transition name="fade">
      <ThanksModal
        :dataObj="thanksModal"
        @onClose="thanksModalData.isOpen = false"
      />
    </transition>

    <transition name="fade">
      <AskQuestionModal
        v-if="isModalVisible"
        @closeModal="toggleModal"
        :recipient="questionProfileInfo"
      />
    </transition>

    <transition name="fade">
      <HappyBirthdayModal
        :isVisible="birthdayModalisVisible"
        :user="profileData"
        @closePopup="birthdayModalisVisible = false"
      />
    </transition>
  </div>
</template>

<script>
import ProfileName from "@/components/person-cards/ProfileName.vue";
import SimplePersonCard from "@/components/person-cards/SimplePersonCard.vue";
import AppAvatar from "@/components/UI/AppAvatar.vue";
import SimplePicture from "@/components/UI/SimplePicture.vue";
import ThanksModal from "@/components/modals/ThanksModal.vue";
import AppReward from "@/components/UI/ratings/AppReward.vue";
import SubdivisionTree from "@/components/person-cards/subdivision-tree/SubdivisionTree.vue";
import axios from "axios";

import ContactsProfile from "@/components/widgets/ContactsProfile.vue";
import EditableSubstitute from "@/components/pages/lk/EditableSubstitute.vue";
import AskQuestionButton from "@/components/pages/AskManager/AskQuestionButton.vue";
import AskQuestionModal from "@/components/modals/AskQuestionModal.vue";
import HappyBirthdayModal from "@/components/modals/HappyBirthdayModal.vue";
import VacationLabel from "@/components/UI/labels/VacationLabel.vue";
import FiredLabel from "@/components/UI/labels/FiredLabel.vue";

export default {
  name: "LkCard",

  components: {
    ProfileName,
    SimplePersonCard,
    AppAvatar,
    SimplePicture,
    ThanksModal,
    AppReward,
    SubdivisionTree,
    ContactsProfile,
    EditableSubstitute,
    AskQuestionButton,
    AskQuestionModal,
    HappyBirthdayModal,
    VacationLabel,
    FiredLabel,
  },

  data() {
    return {
      isLoading: false,

      profileData: {},

      awardsData: null,

      thanksModalData: {
        isOpen: false,
      },

      isModalVisible: false,

      birthdayModalisVisible: false,
    };
  },

  props: {
    isMine: {
      type: Boolean,
      required: true,
    },

    id: {
      type: String,
      required: true,
    },

    awardsArr: {
      type: Array,
      required: false,
    },
  },

  computed: {
    thanksModal() {
      return {
        isOpen: this.thanksModalData.isOpen,
        id: this.id,
        fullName: this.profileData.FULL_NAME,
      };
    },

    questionProfileInfo() {
      return {
        value: {
          code: this.profileData.ID,
          label: this.profileData.FULL_NAME,
        },
      };
    },

    isBirthday() {
      if (this.profileData.PERSONAL_BIRTHDAY) {
        const thisDay = new Date().getDate();
        const thisMonth = new Date().getMonth() + 1;
        const day = this.profileData.PERSONAL_BIRTHDAY.split(".")[0];
        const month = this.profileData.PERSONAL_BIRTHDAY.split(".")[1];
        return thisMonth == month && thisDay == day ? true : false;
      }

      return false;
    },
  },

  methods: {
    toggleModal() {
      this.isModalVisible = !this.isModalVisible;
    },
    async fetchProfileData() {
      try {
        this.isLoading = true;
        const response = await axios({
          method: "get",
          url: `mobileapp/api/user/getUserPersonalInfo?profileId=${this.id}`,
        });
        this.profileData = response.data;
      } catch (error) {
        console.log(error);
      } finally {
        this.isLoading = false;
      }
    },

    async fetchAwardsData() {
      try {
        const response = await axios({
          method: "get",
          url: `mobileapp/api/user/getRaitingWinner?userId=${this.id}`,
        });
        this.awardsData = response.data;
      } catch (error) {
        console.log(error);
      }
    },
  },

  mounted() {
    this.fetchProfileData();
    this.fetchAwardsData();
  },
};
</script>

<style lang="scss" scoped>
.lk-card {
  display: flex;

  background: var(--white900);
  box-shadow: 0 0 0 2px var(--gray200);

  &__label {
    position: absolute;
    z-index: 1;
    left: var(--v-rhythm-4);
    top: var(--v-rhythm-4);
  }
  &__ask-question {
    display: flex;
    margin-top: var(--v-rhythm-2);
    width: 100%;
  }
  &__column {
    width: calc(320 * 100% / 1376);
    flex-shrink: 0;
    display: flex;
    flex-direction: column;

    background-color: rgba(242, 245, 248, 0.5);
  }

  &__photo {
    position: relative;

    width: 100%;
    padding-bottom: 100%;
    flex-shrink: 0;
  }

  &__img {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    object-fit: cover;
    object-position: center;
  }

  &__btns {
    display: flex;
    flex-direction: column;
    gap: var(--v-rhythm-2);
    padding: var(--v-rhythm-4) var(--v-rhythm-3);
  }

  &__btn {
    width: 100%;
  }

  &__awards {
    padding: var(--v-rhythm-4) var(--v-rhythm-3);

    display: flex;
    gap: var(--v-rhythm-2) calc(8 * 100% / 296);
    justify-content: center;
    flex-wrap: wrap;
  }

  &__app-reward {
    width: calc(144 * 100% / 296);
    min-width: 100px;
  }

  &__info {
    width: calc(619 * 100% / 1376);
    padding: var(--v-rhythm-6) var(--v-rhythm-8);
    display: flex;
    flex-direction: column;
    gap: var(--v-rhythm-8);

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

  &__info-block {
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

  &__info-block-title {
    display: block;
    margin-bottom: var(--v-rhythm-4);

    @extend .caption-2;
    color: var(--gray500);
  }

  &__editable-substitute {
  }

  &__supervisor-person {
    @extend .body-2;
    color: var(--gray900);
  }

  &__subdivision-tree {
    max-width: 100%;
    overflow-x: auto;
  }

  &__contacts-profile {
    width: calc(437 * 100% / 1376);
    flex-shrink: 0;
  }

  @include laptop {
    flex-wrap: wrap;

    &__column {
      width: calc(320 * 100% / 959);
    }

    &__info {
      width: calc(639 * 100% / 959);
    }

    &__contacts-profile {
      width: 100%;
    }
  }

  @include phones {
    &__info {
      padding: var(--v-rhythm-6) 10px;
    }

    &__info-block-title {
      margin-bottom: var(--v-rhythm-3);
    }
  }

  @media screen and (max-width: 600px) {
    margin: 0 var(--negativeMainPadding);
    box-shadow: unset;

    &__column {
      width: 100%;
    }

    &__info {
      width: 100%;
    }
  }
}
</style>
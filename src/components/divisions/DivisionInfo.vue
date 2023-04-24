<template>
  <div class="division-info">
    <div class="division-info__title division-info__border-bottom">
      {{ depData.depInfo.NAME ? depData.depInfo.NAME : "Не указано" }}
    </div>

    <DivisionNav
      class="division-info__nav division-info__border-bottom"
      v-if="depNav.length > 0"
      :depNav="depNav"
    />

    <div
      class="division-info__description division-info__border-bottom"
      v-if="depData.depInfo.DESCRIPTION"
      v-html="depData.depInfo.DESCRIPTION"
    ></div>

    <ul
      class="division-info__contacts division-info__border-bottom"
      v-if="
        depData.depInfo.WORK_STREET ||
        depData.depInfo.UF_PHONE_OUTER ||
        depData.depInfo.UF_PHONE_INNER
      "
    >
      <li class="division-info__contacts-item">
        Адрес офиса –
        <address
          class="division-info__contacts-address"
          v-if="depData.depInfo.WORK_STREET"
        >
          {{ depData.depInfo.WORK_STREET }}
        </address>
        <span class="division-info__text-default" v-else>Не указан</span>
      </li>
      <li class="division-info__contacts-item">
        Телефон (внешний) —
        <a
          class="division-info__contacts-link"
          v-if="depData.depInfo.UF_PHONE_OUTER"
          :href="`tel:${depData.depInfo.UF_PHONE_OUTER}`"
          >{{ depData.depInfo.UF_PHONE_OUTER }}</a
        >
        <span class="division-info__text-default" v-else>Не указан</span>
      </li>
      <li class="division-info__contacts-item">
        Телефон (внутренний) —
        <a
          class="division-info__contacts-link"
          v-if="depData.depInfo.UF_PHONE_INNER"
          :href="`tel:${depData.depInfo.UF_PHONE_INNER}`"
          >{{ depData.depInfo.UF_PHONE_INNER }}</a
        >
        <span class="division-info__text-default" v-else>Не указан</span>
      </li>
    </ul>

    <div class="division-info__person division-info__border-bottom">
      <div class="division-info__person-title">Руководитель подразделения</div>
      <SimplePersonCard
        v-if="depData.headInfo"
        class="division-info__person-card"
        :avatar="{
          src: depData.headInfo.USER_PHOTO,
          alt: depData.headInfo.FULL_NAME,
        }"
        :fullName="depData.headInfo.FULL_NAME"
        :profession="depData.headInfo.UF_WORK_POSITION"
        :link="true"
        :id="depData.headInfo.ID"
        :vacation="depData.headInfo.VACATION"
        :fired="depData.headInfo.FIRED"
      />
      <span class="division-info__text-default" v-else>Не указан</span>
      <div style="display: flex; gap: 16px">
        <div
          v-if="depData.headInfo && depData.headInfo.ADD_QUESTION"
          class="division-info__question_button"
        >
          <AskQuestionButton
            @openModalDialog="toggleModal"
            :title="'Задать вопрос'"
          />
        </div>
        <div class="division-info__question_button">
          <router-link to="/questions" class="secondary-btn"
            >Все вопросы</router-link
          >
        </div>
      </div>
    </div>

    <div class="division-info__structure division-info__border-bottom">
      <div class="division-info__structure-title">Структура подразделения</div>
      <SubdivisionTree
        class="division-info__structure-tree"
        :dataObj="depStructure"
      />
    </div>
    <transition name="fade">
      <AskQuestionModal
        v-if="isModalVisible"
        @closeModal="toggleModal"
        :recipient="{
          value: {
            code: depData.headInfo.ID,
            label: depData.headInfo.FULL_NAME,
          },
        }"
      />
    </transition>
  </div>
</template>

<script>
import SimplePersonCard from "@/components/person-cards/SimplePersonCard.vue";
import SubdivisionTree from "@/components/person-cards/subdivision-tree/SubdivisionTree.vue";
import DivisionNav from "@/components/divisions/DivisionNav.vue";
import AskQuestionModal from "@/components/modals/AskQuestionModal.vue";
import AskQuestionButton from "@/components/pages/AskManager/AskQuestionButton.vue";

export default {
  name: "DivisionInfo",

  components: {
    SimplePersonCard,
    SubdivisionTree,
    DivisionNav,
    AskQuestionModal,
    AskQuestionButton,
  },

  props: {
    depData: {
      type: Object,
      required: true,
    },

    depNav: {
      type: Array,
      required: true,
    },

    depStructure: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      isModalVisible: false,
    };
  },

  computed: {},

  methods: {
    toggleModal() {
      this.isModalVisible = !this.isModalVisible;
    },
  },

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss">
.division-info {
  width: 100%;
  padding: {
    top: var(--v-rhythm-8);
    right: var(--v-rhythm-6);
    bottom: var(--v-rhythm-4);
    left: var(--v-rhythm-6);
  }

  display: flex;
  flex-direction: column;
  gap: var(--v-rhythm-5);

  background-color: var(--white900);
  &__question_button {
    max-width: 320px;
    margin-top: var(--v-rhythm-4);
  }
  &__border-bottom {
    padding-bottom: var(--v-rhythm-5);
    border-bottom: 1px solid var(--gray300);

    &:last-child {
      padding-bottom: unset;
      border-bottom: unset;
    }
  }

  &__title {
    @extend .h3;
    color: var(--gray900);
  }

  &__nav {
    width: 100%;
  }

  &__description {
    @extend .body-2;
    @extend .v-html;
    color: var(--gray700);
  }

  &__contacts {
    display: flex;
    flex-direction: column;
  }

  &__contacts-item {
    @extend .body-2;
    color: var(--gray700);
  }

  &__contacts-address {
    font-style: normal;
    display: inline;
  }

  &__contacts-link {
    @include transition();
    cursor: pointer;

    @include hover {
      color: var(--red900);
    }

    &:active {
      opacity: var(--active-opacity);
    }
  }

  &__person {
  }

  &__person-title {
    margin-bottom: var(--v-rhythm-2);

    @extend .caption-2;
    color: var(--gray500);
  }

  &__person-card {
    padding: var(--v-rhythm-2) 0;

    ::v-deep {
      .simple-person-card__vacation-label {
        top: 4px;
      }
    }
  }

  &__text-default {
    @extend .overline;
    color: var(--gray900);
  }

  &__structure {
  }

  &__structure-title {
    margin-bottom: var(--v-rhythm-4);

    @extend .caption-2;
    color: var(--gray500);
  }

  &__structure-tree {
  }
}
</style>
<template>
  <div
    class="advertisement_card__wrapper"
    :class="{ advertisement_card__archive: cardInfo.ARCHIVE }"
    @click.self="moveto"
  >
    <div class="advertisement_card__category-wrapper">
      <span
        class="advertisement_card__category"
        :class="{ advertisement_card__archive: cardInfo.ARCHIVE }"
      >
        <span v-if="cardInfo.THEMA">{{ cardInfo.THEMA }}</span>
        <span v-else>Категория</span>
      </span>
      <span
        class="advertisement_card__category_is_mine"
        :class="{ advertisement_card__archive: cardInfo.ARCHIVE }"
        v-if="isMine"
        >MОЁ</span
      >
    </div>
    <div
      class="advertisement_card__header"
      @click.self="moveto"
      v-html="cardInfo.NAME"
    ></div>
    <div class="advertisement_card__author_block" v-if="cardInfo.CREATED_BY">
      <p class="advertisement_card__author_text">Автор:</p>
      <SimplePersonCard
        :avatar="{ src: cardInfo.CREATED_BY.USER_PHOTO }"
        :fullName="cardInfo.CREATED_BY.FULL_NAME"
        :link="true"
        :id="cardInfo.CREATED_BY.ID"
        :profession="cardInfo.CREATED_BY.UF_WORK_POSITION"
        :vacation="cardInfo.CREATED_BY.VACATION"
        :fired="cardInfo.CREATED_BY.FIRED"
      />
    </div>
    <div class="advertisement_card__author_block" @click.self="moveto">
      <p class="advertisement_card__author_text extra_margin">
        <!-- Опубликовано: -->
        <span
          class="advertisement_card__author_text_inner"
          :class="{ advertisement_card__archive: cardInfo.ARCHIVE }"
          >{{ cardInfo.ACTIVE_FROM }}</span
        >
      </p>
    </div>
    <div
      class="advertisement_card__text"
      :class="{ advertisement_card__safari_text: detectSafariBrowser }"
      v-html="cardInfo.PREVIEW_TEXT"
      @click.self="moveto"
    ></div>
    <div class="advertisement_card__buttons_block" @click.self="moveto">
      <router-link
        :to="`/advertisements/${cardInfo.ID}`"
        class="primary-btn"
        :class="{ 'secondary-btn': cardInfo.ARCHIVE }"
        >Подробнее</router-link
      >
      <CommentsCounter
        :counter="cardInfo.COMMENT_COUNT"
        :url="`/advertisements/${cardInfo.ID}`"
      />
    </div>
    <!-- {{ cardInfo }} -->
  </div>
</template>

<script>
import SimplePersonCard from "@/components/person-cards/SimplePersonCard.vue";
import CommentsCounter from "../../UI/counter/CommentsCounter.vue";
export default {
  name: "AdvertisementCard",

  components: { SimplePersonCard, CommentsCounter },

  props: {
    cardInfo: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {};
  },

  computed: {
    currentUser() {
      return JSON.parse(localStorage.currentUser);
    },
    isMine() {
      return this.currentUser.ID === this.cardInfo?.CREATED_BY?.ID;
    },
    detectSafariBrowser() {
      const appleExpression = /Apple/i;
      const safariExpression = /Safari/i;
      const isAppleSafari = () => {
        return (
          appleExpression.test(navigator.vendor) &&
          safariExpression.test(navigator.userAgent)
        );
      };
      if (isAppleSafari()) {
        return true;
      } else {
        return false;
      }
    },
  },

  methods: {
    moveto() {
      this.$router.push(`/advertisements/${this.cardInfo.ID}`);
    },
  },

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss">
.extra_margin {
  margin-top: var(--v-rhythm-2);
}
.advertisement_card {
  &__wrapper {
    padding: var(--v-rhythm-8);
    background-color: var(--white900);
    display: flex;
    flex-direction: column;
    height: 100%;
    cursor: pointer;
    &.advertisement_card__archive {
      color: var(--gray500);
    }
  }
  &__category-wrapper {
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    z-index: 1;
    cursor: auto;
  }
  &__category {
    @extend .overline;
    color: var(--red900);
    height: var(--v-rhythm-9);
    display: flex;
    align-items: center;
    &.advertisement_card__archive {
      color: var(--gray500);
    }
  }

  &__category_is_mine {
    @extend .overline;
    background-color: #05ab83;
    color: var(--white900);
    padding: var(--v-rhythm-3) var(--v-rhythm-4);
    border-radius: var(--v-rhythm-8);
    &.advertisement_card__archive {
      background-color: var(--gray500);
      color: var(--white900);
    }
  }
  &__header {
    @extend .h4;
    margin-top: var(--v-rhythm-5);
  }
  &__author_block {
    margin-top: var(--v-rhythm-2);
  }
  &__author_text {
    @extend .subtitle-1;
    // margin-top: var(--v-rhythm-3);
    margin-bottom: var(--v-rhythm-3);
    cursor: auto;
    display: inline-block;
  }
  &__author_text_inner {
    @extend .body-1;
    color: var(--gray900);
    &.advertisement_card__archive {
      color: var(--gray500);
    }
  }
  &__text {
    @extend .v-html;
    // min-height: var(--v-rhythm-12);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  &__safari_text {
    display: block;
    max-height: 50px;
    overflow: hidden;
    @include phones {
      max-height: 42px;
    }
  }
  &__buttons_block {
    margin-top: var(--v-rhythm-5);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
@include phones {
  .advertisement_card {
    &__wrapper {
      padding: var(--v-rhythm-4);
    }
  }
}
</style>

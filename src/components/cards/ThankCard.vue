<template>
  <div class="thank-card">
    <div class="thank-card__user" v-if="userFrom">
      <div class="thank-card__user-pic">
        <SimplePicture
          class="thank-card__simple-picture"
          :alt="userFrom.fullName"
          :src="userFrom.src"
          @onClick="goToLk(userFrom.id)"
        />
        <UserIcons
          class="thank-card__label"
          v-if="userFrom.vacation"
          :iconName="'vacation-label'"
        />
        <UserIcons
          class="thank-card__label"
          v-else-if="userFrom.fired"
          :iconName="'fired-label'"
        />
      </div>

      <div class="thank-card__user-info" @click="goToLk(userFrom.id)">
        <span class="thank-card__user-name">{{ userFrom.fullName }}</span>
        <span
          class="thank-card__user-work-position"
          v-if="userFrom.workPosition"
          >{{ userFrom.workPosition }}</span
        >
      </div>
    </div>

    <div class="thank-card__congratulation">
      <div class="thank-card__congratulation-text">{{ congratulation }}</div>
      <div
        class="thank-card__signature"
        v-if="userTo"
        @click="goToLk(userTo.id)"
      >
        <div class="thank-card__signature-name-wrap">
          <UserIcons
            class="thank-card__signature-label"
            v-if="userTo.vacation"
            :iconName="'vacation-label'"
          />
          <UserIcons
            class="thank-card__signature-label"
            v-else-if="userTo.fired"
            :iconName="'fired-label'"
          />
          <span class="thank-card__signature-name">{{ userTo.fullName }}</span>
        </div>
        <span
          class="thank-card__signature-work-position"
          v-if="userTo.workPosition"
          >{{ userTo.workPosition }}</span
        >
      </div>
      <time class="thank-card__date">{{ date }}</time>
    </div>
  </div>
</template>

<script>
import SimplePicture from "@/components/UI/SimplePicture.vue";

export default {
  name: "ThankCard",

  components: {
    SimplePicture,
  },

  props: {
    userFrom: {
      type: Object,
      required: false,
    },

    userTo: {
      type: Object,
      required: false,
    },

    congratulation: {
      type: String,
      required: true,
    },

    date: {
      type: String,
      required: true,
    },
  },

  computed: {},

  methods: {
    goToLk(id) {
      this.$router.push(`/lk?=${id}`);
    },
  },
};
</script>

<style scoped lang="scss">
.thank-card {
  padding: var(--v-rhythm-8) var(--v-rhythm-4);

  display: flex;
  flex-direction: column;

  border-top: var(--v-rhythm-1) solid var(--gray300);
  background-color: var(--white900);

  &:first-child {
    border-color: transparent;
  }

  &__user {
    width: 100%;
    margin-bottom: var(--v-rhythm-4);
    padding-bottom: var(--v-rhythm-8);

    display: flex;
    flex-direction: column;
    align-items: center;

    border-bottom: 1px solid var(--gray300);
  }

  &__user-pic {
    position: relative;

    width: 100px;
    height: 100px;
    margin-bottom: var(--v-rhythm-5);

    cursor: pointer;

    @include transition(opacity);

    @include hover {
      & + .thank-card__user-info .thank-card__user-name {
        color: var(--red900);
      }
    }

    &:active {
      opacity: var(--active-opacity);
    }
  }
  &__simple-picture {
    width: 100%;
    height: 100%;

    border-radius: 50%;
    overflow: hidden;
  }

  &__label {
    position: absolute;
    top: -2px;
    left: -2px;

    width: 24px;
    height: 24px;
  }

  &__user-info {
    display: flex;
    flex-direction: column;
    gap: var(--v-rhythm-1);

    text-align: center;

    cursor: pointer;
    @include transition(opacity);

    @include hover {
      .thank-card__user-name {
        color: var(--red900);
      }
    }

    &:active {
      opacity: var(--active-opacity);
    }
  }

  &__user-name {
    @extend .h4;
    color: var(--gray900);

    @include transition(color);
  }

  &__user-work-position {
    @extend .caption-1;
    color: var(--gray500);
  }

  &__congratulation {
    width: 100%;
  }

  &__congratulation-text {
    margin-bottom: var(--v-rhythm-6);

    @extend .body-1;
    color: var(--gray900);
    text-align: center;
    word-break: break-word;
  }

  &__signature {
    width: 100%;
    margin-bottom: var(--v-rhythm-4);

    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: var(--v-rhythm-1);

    font-style: italic;

    cursor: pointer;
    @include transition(opacity);

    &:active {
      opacity: var(--active-opacity);
    }

    &-name {
      @extend .subtitle-1;
      color: var(--red900);
    }

    &-work-position {
      @extend .caption-1;
      color: var(--gray500);
    }
  }

  &__signature-name-wrap {
    display: flex;
    gap: var(--v-rhythm-2);
    align-items: center;
  }

  &__signature-label {
    width: 17px;
    height: 17px;

    flex-shrink: 0;
  }

  &__date {
    display: block;
    width: 100%;

    @extend .overline;
    color: var(--gray500);
    text-align: right;
    font-style: normal;
  }

  @include phones {
    padding: {
      top: var(--v-rhythm-4);
      right: 10px;
      bottom: var(--v-rhythm-6);
      left: 10px;
    }

    &__user {
      margin-bottom: var(--v-rhythm-3);
      padding-bottom: var(--v-rhythm-6);
    }

    &__user-pic {
      margin-bottom: var(--v-rhythm-4);
    }

    &__user-info {
      gap: 2px;
    }

    &__congratulation {
    }

    &__congratulation-text {
      margin-bottom: var(--v-rhythm-4);
    }

    &__signature {
      margin-bottom: var(--v-rhythm-3);

      gap: 2px;
    }
  }
}
</style>

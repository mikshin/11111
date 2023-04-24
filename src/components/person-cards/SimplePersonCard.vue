<template>
  <div
    class="simple-person-card"
    :class="{
      'simple-person-card--mini': isMiniSize,
      'simple-person-card--link': link && id,
      'simple-person-card--disabled': isDisabled,
    }"
    @click="goToLk"
  >
    <SimplePicture
      class="simple-person-card__avatar"
      :alt="avatar.alt"
      :src="avatar.src"
      :src2x="avatar.src2x"
      :webpSrc="avatar.webpSrc"
      :webpSrc2x="avatar.webpSrc2x"
      :mediaArray="avatar.mediaArray"
    />

    <UserIcons
      class="simple-person-card__label"
      v-if="vacation"
      :iconName="'vacation-label'"
    />
    <UserIcons
      class="simple-person-card__label"
      v-else-if="fired"
      :iconName="'fired-label'"
    />

    <div class="simple-person-card__info">
      <span class="simple-person-card__full-name" v-html="fullName"></span>
      <span
        class="simple-person-card__profession"
        v-if="profession"
        v-html="profession"
      ></span>
      <span v-if="postDate" class="simple-person-card__profession">{{
        postDate
      }}</span>
    </div>
  </div>
</template>

<script>
import SimplePicture from "@/components/UI/SimplePicture.vue";

export default {
  name: "SimplePersonCard",

  components: {
    SimplePicture,
  },

  props: {
    avatar: {
      type: Object,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    link: {
      type: Boolean,
      required: false,
    },
    id: {
      type: String,
      required: false,
    },
    profession: {
      type: String,
      required: false,
      default: "",
    },
    isMiniSize: {
      type: Boolean,
      required: false,
      default: false,
    },
    isDisabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    postDate: {
      type: String,
      required: false,
      default: null,
    },
    vacation: {
      type: Boolean,
      required: false,
      default: false,
    },
    fired: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  methods: {
    goToLk() {
      if (
        this.link &&
        this.id &&
        this.$router.history.current.fullPath !== `/lk?=${this.id}` &&
        !this.isDisabled
      )
        this.$router.push(`/lk?=${this.id}`);

      this.$emit("onClock");
    },
  },
};
</script>

<style scoped lang="scss">
.simple-person-card {
  position: relative;

  display: flex;
  gap: var(--v-rhythm-2);

  &__avatar {
    width: 40px;
    height: 40px;
    flex-shrink: 0;

    box-shadow: 0 0 0 1px var(--red300);
    border-radius: 50%;
    overflow: hidden;
  }

  &__label {
    position: absolute;
    top: -4px;
    left: -4px;

    width: 16px;
    height: 16px;
  }

  &__info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: var(--v-rhythm-1);
  }

  &__full-name {
    @extend .subtitle-1;
    color: var(--gray900);

    @include transition(color);
    .chat__contact & {
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }

  &__profession {
    @extend .caption-1;
    color: var(--gray500);
    .chat__contact & {
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }

  &--mini & {
    &__avatar {
      width: 24px;
      height: 24px;
    }

    &__full-name {
      @extend .body-1;
    }

    &__label {
      width: 11px;
      height: 11px;
    }
  }

  &--link:not(.simple-person-card--disabled) {
    cursor: pointer;
    @include transition(opacity);

    @include hover {
      .simple-person-card__full-name {
        color: var(--red900);
      }
    }

    &:active {
      opacity: var(--active-opacity);
    }
  }

  &--disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  @include phones {
    &__avatar {
      width: 34px;
      height: 34px;
    }

    &__info {
      gap: calc(var(--v-rhythm-1) / 2);
    }
  }
}
</style>

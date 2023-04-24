<template>
  <div class="photo-card" :class="{ 'photo-card--winner': place }">
    <div class="photo-card__picture-wrapper" @click="photoCardClick">
      <RewardMedal
        class="photo-card__medal"
        v-if="place"
        :place="`${place}`"
        :fontSize="'20px'"
      />
      <SimplePicture
        class="photo-card__picture"
        :alt="title"
        :src="imageLink"
      />
    </div>
    <div class="photo-card__info">
      <div class="photo-card__fio" v-if="userFIO">{{ userFIO }}</div>
      <div class="photo-card__title" v-if="title">«{{ title }}»</div>
      <div class="photo-card__icons-wrapper">
        <SimpleLikesCounter
          class="photo-card__likes"
          :url="'/mobileapp/api/photoContest/photo/like/'"
          :fetchParametrs="{
            photoContestId: photoContestId,
            cardId: id,
          }"
          :counterNumber="likes.count"
          :isLiked="likes.liked"
          :isDisabled="likes.disabled"
          @likeClick="likeClick"
        />
        <!-- <CommentsCounter
          v-if="commentsCount !== null"
          :counter="commentsCount"
          :url="`/photo_contests/${photoContestId}`"
        /> -->
      </div>
    </div>
  </div>
</template>

<script>
import SimplePicture from "@/components/UI/SimplePicture.vue";
import RewardMedal from "@/components/UI/ratings/RewardMedal.vue";
import SimpleLikesCounter from "@/components/UI/counter/SimpleLikesCounter.vue";
// import CommentsCounter from "@/components/UI/counter/CommentsCounter.vue";

export default {
  name: "PhotoCard",

  components: {
    SimplePicture,
    RewardMedal,
    SimpleLikesCounter,
    // CommentsCounter,
  },

  props: {
    id: {
      type: String,
      required: true,
    },

    photoContestId: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    userFIO: {
      type: String,
      required: true,
    },

    imageLink: {
      type: String,
      required: true,
    },

    place: {
      required: true,
    },

    likes: {
      type: Object,
      required: true,
    },
    commentsCount: {
      type: [Number, null],
      require: false,
      default: null,
    },
  },

  data() {
    return {};
  },

  computed: {},

  methods: {
    photoCardClick() {
      this.$emit("photoCardClick", this.id);
    },

    likeClick(oldLikeStatus) {
      this.$emit("likeClick", { id: this.id, oldLikeStatus: oldLikeStatus });
    },
  },

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss">
.photo-card {
  position: relative;

  display: flex;
  flex-direction: column;

  &__medal {
    position: absolute;
    top: 8px;
    right: 10px;
    z-index: 1;
  }

  &__picture-wrapper {
    position: relative;

    width: 100%;
    padding-top: calc(188 * 100% / 212);

    background-color: var(--gray500);

    cursor: pointer;
    @include transition(opacity);

    &:active {
      opacity: var(--active-opacity);
    }
  }

  &__icons-wrapper {
    display: flex;
  }

  &__picture {
    position: absolute;
    top: 0;
    left: 0;

    width: 100%;
    height: 100%;

    object-fit: cover;
    object-position: center;
  }

  &__info {
    flex-basis: 100%;
    width: 100%;
    padding: var(--v-rhythm-4) var(--v-rhythm-1) var(--v-rhythm-2);

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--v-rhythm-1);

    text-align: center;

    overflow: hidden;
  }

  &__fio {
    @extend .subtitle-1;
    color: var(--gray900);
  }

  &__title {
    @extend .subtitle-2;
    color: var(--gray500);
    max-width: 75%;
  }

  &__likes {
    margin-top: auto;
  }

  &--winner {
    .photo-card {
      &__info {
        padding-top: var(--v-rhythm-5);
      }

      &__fio {
        @extend .h4;
      }
    }
  }
}
</style>
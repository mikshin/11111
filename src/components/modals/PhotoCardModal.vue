<template>
  <AppModal
    class="photo-card-modal"
    v-if="isVisible"
    @onClose="$emit('onClose')"
    :maxWidth="'980'"
  >
    <div class="photo-card-modal__conent">
      <SimplePicture
        class="photo-card-modal__picture"
        :alt="title"
        :src="imageLink"
      />
      <div class="photo-card-modal__info" v-if="userFIO || title || likes">
        <div class="photo-card-modal__fio" v-if="userFIO">{{ userFIO }}</div>
        <div class="photo-card-modal__title" v-if="title">«{{ title }}»</div>
        <SimpleLikesCounter
          class="photo-card-modal__likes"
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
      </div>
    </div>
  </AppModal>
</template>

<script>
import AppModal from "@/components/modals/AppModal.vue";
import SimplePicture from "@/components/UI/SimplePicture.vue";
import SimpleLikesCounter from "@/components/UI/counter/SimpleLikesCounter.vue";

export default {
  name: "PhotoCardModal",

  components: {
    AppModal,
    SimplePicture,
    SimpleLikesCounter,
  },

  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },

    id: {
      type: String,
      required: false,
    },

    photoContestId: {
      type: String,
      required: false,
    },

    title: {
      type: String,
      required: false,
    },

    userFIO: {
      type: String,
      required: false,
    },

    imageLink: {
      type: String,
      required: true,
    },

    likes: {
      type: Object,
      required: false,
    },
  },

  data() {
    return {};
  },

  computed: {},

  methods: {
    likeClick(oldLikeStatus) {
      this.$emit("likeClick", { id: this.id, oldLikeStatus: oldLikeStatus });
    },
  },

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss">
.photo-card-modal {
  &__conent {
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: var(--v-rhythm-8);
  }

  &__picture {
    background-color: var(--gray500);
  }

  &__info {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--v-rhythm-4);

    text-align: center;

    overflow: hidden;
  }

  &__fio {
    @extend .body-2;
    color: var(--gray900);
  }

  &__title {
    @extend .h3;
    color: var(--gray700);
  }

  &__likes {
  }
}
</style>
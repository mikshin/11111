<template>
  <button
    class="carousel-btn"
    :class="{
      'carousel-btn--big': isBig,
      'carousel-btn__transparent': transparent,
    }"
    :id="id"
    @click="$emit('onClick')"
  >
    <UserIcons
      class="carousel-btn__icon"
      :class="{ 'carousel-btn__icon__transparent': transparent }"
      :iconName="iconName"
      :style="customStyle"
    />
  </button>
</template>

<script>
export default {
  name: "CarouselBtn",

  components: {},

  props: {
    id: {
      type: String,
      required: false,
    },

    prevNext: {
      type: String,
      required: true,
    },

    isBig: {
      type: Boolean,
      required: false,
      default: false,
    },
    customStyle: {
      type: String,
      require: false,
      default: "",
    },
    transparent: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {};
  },

  computed: {
    iconName() {
      let iconName;
      if (this.prevNext === "prev") iconName = "arrow-left";
      if (this.prevNext === "next") iconName = "arrow-right";
      return iconName;
    },
  },

  methods: {},

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss">
.carousel-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;

  background-color: var(--red900);
  border-radius: 50%;

  cursor: pointer;
  @include transition();

  &:active:not(.swiper-button-disabled) {
    opacity: var(--active-opacity);
  }

  &.swiper-button-disabled {
    background-color: var(--gray500);
    cursor: default;
  }

  &--big {
    width: 64px;
    height: 64px;

    .carousel-btn__icon {
      width: 30px;
      height: 30px;
    }
  }
  &__transparent {
    background-color: var(--white900);
    border: 1px solid var(--red900);
  }
  &.swiper-button-disabled.carousel-btn__transparent {
    background-color: var(--white900);
    opacity: 0.3;
  }
  &__icon {
    width: 20px;
    height: 20px;

    fill: var(--white900);
    &__transparent {
      fill: var(--red900);
    }
  }
}
</style>
<template>
  <button class="to-top" v-show="scY" @click="scrollTop">
    <UserIcons class="to-top__icon" :iconName="'arrow-up'" />
  </button>
</template>

<script>
export default {
  data() {
    return {
      isFixed: false,

      scTimer: 0,
      scY: 0,
    };
  },
  methods: {
    scrollTop() {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },

    handleScroll: function () {
      if (this.scTimer) return;
      this.scTimer = setTimeout(() => {
        this.scY = window.scrollY;
        clearTimeout(this.scTimer);
        this.scTimer = 0;
      }, 100);
    },
  },

  mounted() {
    window.addEventListener("scroll", this.handleScroll);
  },

  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll);
  },

  computed: {},
};
</script>

<style lang="scss" scoped>
.to-top {
  position: fixed;
  right: calc(
    (100vw / 2) - (var(--maxWidthContainer) / 2) + var(--mainPadding)
  );
  bottom: 40px;
  z-index: 100;

  --totop-size: 64px;
  width: var(--totop-size);
  height: var(--totop-size);

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: var(--red900);
  border-radius: 50%;
  @include transition(opacity);

  @media screen and (max-width: 1440px) {
    right: var(--mainPadding);
  }

  &__icon {
    fill: var(--white900);
  }

  @include phones {
    --totop-size: 32px;

    bottom: 83px;
  }
}
</style>
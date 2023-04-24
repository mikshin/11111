<template>
  <button class="function-btn" @click="clickBtn">
    <UserIcons class="function-btn__icon" :iconName="iconName" />
  </button>
</template>

<script>
export default {
  name: "FunctionBtn",

  components: {},

  props: {
    iconName: {
      type: String,
      required: true,
    },
  },

  data() {
    return {};
  },

  computed: {},

  methods: {
    clickBtn() {
      this.$emit("clickBtn");
    },
  },

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss">
.function-btn {
  --top-btn-color: var(--gray700);

  width: 44px;
  height: 44px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 2px solid var(--top-btn-color);
  border-radius: 8px;

  @include transition();

  @include hover {
    --top-btn-color: var(--red900);
  }

  &:active {
    opacity: var(--active-opacity);
  }

  &__icon {
    width: 24px;
    height: 24px;

    fill: var(--top-btn-color);
    @include transition();
  }

  @include phones {
    width: 24px;
    height: 24px;

    &__icon {
      width: 16px;
      height: 16px;
    }
  }
}
</style>
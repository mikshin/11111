<template>
  <div class="simple-trigger">
    <div class="simple-trigger__count">{{ count }}</div>
    <div class="simple-trigger__info">
      <span class="simple-trigger__title">{{ title }}</span>
      <UserIcons class="simple-trigger__icon" :iconName="iconName" />
    </div>
  </div>
</template>

<script>
export default {
  name: "SimpleTrigger",

  components: {},

  props: {
    count: {
      type: Number,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    iconName: {
      type: String,
      required: true,
    },
  },

  data() {
    return {};
  },

  computed: {},

  methods: {},

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss">
.simple-trigger {
  display: flex;
  gap: var(--v-rhythm-4);

  &__count {
    position: relative;
    top: -10px;

    @include font(100px, 1, 700);
    color: var(--red900);
  }

  &__info {
    display: flex;
    flex-direction: column;
  }

  &__title {
    @extend .subtitle-2;
    color: var(--gray500);
  }

  &__icon {
    width: 40px;
    height: 40px;

    fill: var(--gray500);
  }

  @include phones {
    &__count {
      top: -6px;
      font-size: 66px;
    }
  }
}
</style>
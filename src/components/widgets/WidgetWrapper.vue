<template>
  <div
    class="widget-wrapper"
    :class="{ 'widget-wrapper--style-filter': styleModif === 'filter' }"
  >
    <div class="widget-wrapper__header" v-if="title || iconName">
      <div class="widget-wrapper__icon" v-if="iconName">
        <UserIcons class="widget-wrapper__user-icon" :iconName="iconName" />
      </div>
      <span class="widget-wrapper__title">{{ title }}</span>
    </div>
    <div class="widget-wrapper__main">
      <slot></slot>
    </div>
    <div class="widget-wrapper__footer" v-if="textBtn">
      <button
        class="widget-wrapper__btn text-btn"
        @click="$emit('clickWidgetBtn')"
      >
        {{ textBtn }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "WidgetWrapper",

  components: {},

  props: {
    iconName: {
      type: String,
      required: false,
    },
    title: {
      type: String,
      required: false,
    },
    textBtn: {
      type: String,
      required: false,
    },
    styleModif: {
      type: String,
      required: false,
    },
  },

  data() {
    return {};
  },

  methods: {},

  computed: {},
};
</script>

<style scoped lang="scss">
.widget-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;

  background-color: var(--white900);
  box-shadow: 0 0 0 2px var(--gray200);

  &__header {
    position: relative;
    z-index: 1;

    display: flex;
    align-items: center;
    gap: var(--v-rhythm-4);
    padding: var(--v-rhythm-3) var(--v-rhythm-4);

    box-shadow: 0 0 0 2px var(--gray200);
  }

  &__icon {
    width: 40px;
    height: 40px;

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 50%;
    background-color: var(--red300);
  }

  &__user-icon {
    width: 24px;
    height: 24px;

    fill: var(--red900);
  }

  &__title {
    @extend .subtitle-1;
    color: var(--gray900);
  }

  &__main {
    // 64px высота шапки виджета
    height: calc(100% - 64px);
  }

  &__footer {
    display: flex;
    flex-direction: column;
    align-items: center;

    padding: var(--v-rhythm-3) var(--v-rhythm-4);

    box-shadow: 0 0 0 2px var(--gray200);
  }

  &--style-filter {
    .widget-wrapper {
      &__header {
        padding: var(--v-rhythm-2);

        gap: var(--v-rhythm-3);

        background: var(--gradient);

        box-shadow: none;
      }

      &__icon {
        width: 40px;
        height: 40px;

        background-color: var(--gray100);
      }

      &__user-icon {
        width: 24px;
        height: 24px;

        fill: var(--gray500);
      }

      &__title {
        @extend .subtitle-2;
        color: var(--white900);
      }
    }
  }
}
</style>

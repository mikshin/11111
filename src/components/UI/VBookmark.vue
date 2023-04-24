<template>
  <div class="v-bookmark">
    <tippy
      class="v-bookmark__tooltip"
      animation="fade"
      arrow
      theme="light"
      :touch="true"
      :flipOnUpdate="true"
      :boundary="'viewport'"
      placement="bottom"
    >
      <template v-slot:trigger>
        <button class="v-bookmark__btn">
          <UserIcons
            class="v-bookmark__icon"
            :class="{
              active: isActive,
            }"
            iconName="bookmark"
          />
        </button>
      </template>

      <div class="v-bookmark__content" v-if="$slots.content">
        <slot name="content"></slot>
      </div>
    </tippy>
  </div>
</template>

<script>
export default {
  name: "",

  components: {},

  props: {
    isActive: {
      type: Boolean,
      default: false,
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
.v-bookmark {
  @include font(0, 1);
  &__btn {
    cursor: pointer;

    @include hover {
      .v-bookmark__icon {
        fill: var(--red900);
      }
    }
  }

  &__icon {
    width: 40px;
    height: 40px;

    fill: var(--gray100);
    stroke: var(--red900);
    stroke-width: 2px;

    @include transition();

    &.active {
      fill: var(--red900);
    }
  }

  &__content {
    padding: {
      top: 20px;
      bottom: 14px;
      inline: 18px;
    }

    @extend .caption-1;
    color: var(--gray700);
  }
}
</style>
<template>
  <DarkLayer @onClose="close">
    <div class="app-modal" :style="{ 'max-width': `${maxWidth}px` }">
      <button class="app-modal__close-btn" @click="close">
        <UserIcons :iconName="'X'" />
      </button>
      <slot></slot>
    </div>
  </DarkLayer>
</template>

<script>
import DarkLayer from "@/components/modals/DarkLayer.vue";

export default {
  name: "AppModal",

  components: {
    DarkLayer,
  },

  data() {
    return {};
  },

  props: {
    maxWidth: {
      type: String,
      required: true,
    },
  },

  methods: {
    close() {
      this.$emit("onClose");
    },
  },
};
</script>

<style lang="scss" scoped>
.app-modal {
  position: relative;

  max-height: 100%;
  width: 100%;
  padding: var(--v-rhythm-13) var(--v-rhythm-17);

  background-color: var(--white900);

  cursor: default;
  overflow: auto;
  @include transition(max-width);

  &__close-btn {
    position: absolute;
    top: 16px;
    right: 16px;

    width: 24px;
    height: 24px;

    fill: var(--gray500);
    cursor: pointer;
    @include transition();

    &:active {
      opacity: var(--active-opacity);
    }
  }
  @include phones {
    padding-left: var(--v-rhythm-6);
    padding-right: var(--v-rhythm-6);
  }
}
</style>

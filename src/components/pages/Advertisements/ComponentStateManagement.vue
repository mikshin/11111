<template>
  <tippy
    class="more-tooltip"
    trigger="click"
    interactive
    animation="fade"
    :animate-fill="false"
    theme="light"
    :placement="'bottom'"
    :appendTo="appendTo"
    :zIndex="99"
    :flipOnUpdate="true"
  >
    <template v-slot:trigger>
      <slot></slot>
    </template>
    <div class="more-tooltip__modal">
      <template v-for="(action, i) in actions">
        <button
          class="more-tooltip__modal-btn"
          :key="i"
          :disabled="action.disabled"
          @click="$emit('actions', action.code)"
        >
          {{ action.name }}
        </button>
      </template>
    </div>
  </tippy>
</template>

<script>
export default {
  name: "ComponentStateManagement",

  components: {},

  props: {
    actions: {
      type: [Array, Object],
      required: true,
    },
    appendToId: {
      type: String,
      required: true,
    },
  },

  data() {
    return {};
  },

  computed: {},

  methods: {
    appendTo() {
      return document.querySelector(`#${this.appendToId}`);
    },
  },

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss">
.more-tooltip {
  position: relative;

  &__modal {
    padding: var(--v-rhythm-2) 0;

    display: flex;
    flex-direction: column;

    border: 1px solid var(--gray500);
  }

  &__modal-btn {
    width: 100%;
    padding: var(--v-rhythm-3);

    @extend .body-1;
    color: var(--gray900);
    text-align: left;

    @include transition();
    cursor: pointer;

    &[disabled] {
      color: var(--gray500);
      background-color: var(--gray100);

      cursor: default;
    }

    @include hover {
      &:not([disabled]) {
        background-color: var(--gray100);
      }
    }

    &:active:not([disabled]) {
      opacity: var(--active-opacity);
    }
  }
}
</style>
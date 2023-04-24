<template>
  <input
    class="simple-input"
    :class="{ 'simple-input--disabled': isDisabled }"
    :type="type"
    v-model="value"
    :disabled="isDisabled"
    :placeholder="placeholder"
    @input="$emit('changeValue', value)"
    @keydown.enter="$emit('keydownEnter')"
  />
</template>

<script>
export default {
  name: "SimpleInput",

  components: {},

  data() {
    return {
      value: "",
    };
  },

  props: {
    placeholder: {
      type: String,
      required: false,
      default: "",
    },
    type: {
      type: String,
      required: false,
      default: "text",
    },
    isDisabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  computed: {},

  methods: {},
};
</script>

<style scoped lang="scss">
.simple-input {
  padding: 15px 23px;

  @extend .body-2;
  color: var(--gray900);

  background-color: var(--white900);
  border: 1px solid var(--gray500);

  @include transition();

  &::placeholder {
    color: var(--gray500);
  }

  &:focus {
    border: 1px solid var(--red500);
  }

  &--disabled {
    padding-right: 39px;

    background-image: url(~@/assets/images/icons/lock.svg);
    background-repeat: no-repeat;
    background-position: center right 15px;
    background-size: 24px;

    cursor: not-allowed;
  }

  @include hover {
    &:not(.simple-input--disabled) {
      border: 1px solid var(--red500);
    }
  }

  @include phones {
    padding: 13px 11px;
  }
}
</style>

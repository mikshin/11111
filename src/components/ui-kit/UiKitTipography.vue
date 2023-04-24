<template>
  <span class="ui-kit-tipography" :class="classMidif">{{ modif }}</span>
</template>

<script>
export default {
  name: "UiKitTipography",
  props: {
    modif: {
      type: String,
      required: true,
    },
  },
  computed: {
    classMidif() {
      return `ui-kit-tipography--${this.modif}`;
    },
  },
};
</script>

<style scoped lang="scss">
.ui-kit-tipography {
  &--h1 {
    @extend .h1;
  }
  &--h2 {
    @extend .h2;
  }
  &--h3 {
    @extend .h3;
  }
  &--h4 {
    @extend .h4;
  }
  &--subtitle-1 {
    @extend .subtitle-1;
  }
  &--subtitle-2 {
    @extend .subtitle-2;
  }
  &--body-1 {
    @extend .body-1;
  }
  &--body-2 {
    @extend .body-2;
  }
  &--caption-1 {
    @extend .caption-1;
  }
  &--caption-2 {
    @extend .caption-2;
  }
  &--button {
    @extend .button;
  }
  &--overline {
    @extend .overline;
  }
}
</style>

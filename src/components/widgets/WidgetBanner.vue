<template>
  <div
    class="widget-banner"
    :class="{
      'widget-banner--narrow': isNarrowType,
    }"
    :style="{
      'background-image': backgroundImageEncoded,
    }"
  >
    <div class="widget-banner__inner">
      <div
        class="widget-banner__headline"
        :class="{
          'widget-banner__headline--small': isNarrowType,
        }"
      >
        {{ name }}
      </div>
      <div
        class="widget-banner__text"
        :class="{
          'widget-banner__text--no-clamp-text': !isClampText,
        }"
        v-html="text"
      ></div>
      <div class="widget-banner__under-text-block">
        <slot name="under-text"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "WidgetBanner",

  components: {},

  props: {
    name: {
      type: String,
      default: "",
    },
    text: {
      type: String,
      default: "",
    },
    backgroundImage: {
      type: String,
      default: "",
    },
    variant: {
      type: String,
      required: false,
      validator: (value) => ["narrow"].includes(value),
    },
    isClampText: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {};
  },

  computed: {
    // Корректно обрабатывает пробелы в урле изображения
    backgroundImageEncoded() {
      return `url(${encodeURIComponent(this.backgroundImage)})`;
    },
    isNarrowType() {
      return this.variant === "narrow";
    },
  },

  methods: {},

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss">
.widget-banner {
  position: relative;

  display: flex;
  min-height: 278px;
  max-width: 100%;
  width: 100%;

  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;

  &__inner {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: auto;
    padding: var(--v-rhythm-14) var(--v-rhythm-16);

    background-color: rgba(0, 0, 0, 0.2);
  }

  &__headline {
    @extend .h2;

    margin-bottom: var(--v-rhythm-4);

    color: var(--white900);
    word-break: break-word;

    &--small {
      @extend .h3;
    }
  }

  &__text {
    @extend .subtitle-2;

    @include line-clamp(2);
    margin-bottom: var(--v-rhythm-4);

    color: var(--white900);

    &--no-clamp-text {
      -webkit-line-clamp: unset !important;
    }
  }

  &__under-text-block {
    margin-top: auto;
  }

  @mixin narrow-version {
    min-height: 388px;

    .widget-banner__inner {
      padding: var(--v-rhythm-12) var(--v-rhythm-8);
      padding-bottom: calc(var(--v-rhythm-12) + var(--v-rhythm-18));
    }

    .widget-banner__headline {
      margin-bottom: var(--v-rhythm-6);
    }

    .widget-banner__text {
      -webkit-line-clamp: 3;
    }
  }

  &--narrow {
    @include narrow-version;
  }

  @include phones {
    @include narrow-version;
  }
}
</style>
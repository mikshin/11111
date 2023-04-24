<template>
  <WidgetWrapper
    class="app-filter"
    :iconName="'filter'"
    :title="'Фильтр'"
    :styleModif="'filter'"
  >
    <div class="app-filter__content" :class="{ loading: isLoading }">
      <form class="app-filter__form" action="#">
        <div class="app-filter__form-inputs">
          <slot></slot>
        </div>

        <div class="app-filter__form-btns">
          <button
            class="app-filter__form-btn primary-btn"
            type="submit"
            @click.prevent="filterSubmit"
            :disabled="isDisabledSubmit"
          >
            Применить фильтр
          </button>

          <button
            class="app-filter__form-btn secondary-btn"
            type="reset"
            @click.prevent="filterReset"
            :disabled="isDisabledReset"
          >
            Сбросить фильтр
          </button>
        </div>
      </form>
    </div>
  </WidgetWrapper>
</template>

<script>
import WidgetWrapper from "@widgets/WidgetWrapper.vue";

export default {
  name: "AppFilter",

  components: {
    WidgetWrapper,
  },

  props: {
    isLoading: {
      type: Boolean,
      required: true,
    },

    isDisabledSubmit: {
      type: Boolean,
      required: true,
    },

    isDisabledReset: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {};
  },

  computed: {},

  methods: {
    filterSubmit() {
      this.$emit("filterSubmit");
    },

    filterReset() {
      this.$emit("filterReset");
    },
  },

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss">
.app-filter {
  &__content {
    padding: var(--v-rhythm-4) 10px 10px;
  }

  &__form {
  }

  &__form-inputs {
    display: flex;
    flex-direction: column;
    gap: var(--v-rhythm-8);

    ::v-deep {
      & > .input_container {
        margin-top: 0;
      }
    }
  }

  &__form-btns {
    margin-top: var(--v-rhythm-8);

    display: flex;
    flex-direction: column;
    gap: var(--v-rhythm-4);
  }

  &__form-btn {
    width: 100%;
  }
}
</style>
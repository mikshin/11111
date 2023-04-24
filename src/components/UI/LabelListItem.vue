<template>
  <div class="label-list-item">
    <router-link class="label-list-item__link" :to="to" :append="append">
      <div class="label-list-item__text">
        <slot name="text"></slot>
      </div>
      <div class="label-list-item__label">
        <slot name="label"></slot>
      </div>
    </router-link>
  </div>
</template>

<script>
export default {
  name: "LabelListItem",

  components: {},

  props: {
    to: {
      type: String,
      required: true,
    },
    append: {
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
.label-list-item {
  &__link {
    display: flex;
    align-items: center;
    padding: var(--v-rhythm-2) var(--v-rhythm-3);
    justify-content: space-between;
    gap: 12px;

    @include hover {
      .label-list-item__text {
        color: var(--red700);
      }
    }
  }

  &__text {
    color: var(--red900);
    @extend .subtitle-2;
  }

  @include phones {
    &__link {
      align-items: flex-start;
      flex-direction: column-reverse;
    }
  }
}
</style>
<template>
  <VBookmark class="training-bookmark" :isActive="isActive">
    <template #content v-if="isShowTooltip">
      <div class="training-bookmark__tooltip-content">
        <p class="training-bookmark__tooltip-content-paragraph">
          Закладка уже установлена в другом уроке.
        </p>
        <p class="training-bookmark__tooltip-content-paragraph">
          Если поставить закладку здесь, она будет убрана с прошлого места.
        </p>
      </div>
    </template>
  </VBookmark>
</template>

<script>
import VBookmark from "@UI/VBookmark.vue";

export default {
  name: "",

  components: {
    VBookmark,
  },

  props: {
    isActive: {
      type: Boolean,
      default: false,
    },
    isShowTooltip: {
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
.training-bookmark {
  &__tooltip-content {
    display: flex;
    flex-direction: column;
    gap: var(--v-rhythm-2);
    max-width: 200px;
  }
}
</style>
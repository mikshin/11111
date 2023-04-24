<template>
  <div class="universal_app_counter__wrapper">
    <div v-if="instance.VIEW_COUNT >= 0">
      <UniversalViewsCounter
        :endpoint="viewsEndPoints"
        :counter="instance.VIEW_COUNT"
        :urlId="instance.ID"
      />
    </div>
    <div v-if="instance.LIKE_COUNT >= 0">
      <UniversalLikesCounter
        :endpoint="likesEndPoints"
        :counter="instance.LIKE_COUNT"
        :urlId="instance.ID"
      />
    </div>
    <div v-if="instance.COMMENT_COUNT >= 0">
      <UniversalCommentsCounter
        :endpoint="commentsEndPoints"
        :counter="instance.COMMENT_COUNT"
      />
    </div>
  </div>
</template>

<script>
import UniversalViewsCounter from "@/components/UI/counter/UnviversalCounter/UniversalViewsCounter.vue";
import UniversalLikesCounter from "@/components/UI/counter/UnviversalCounter/UniversalLikesCounter.vue";
import UniversalCommentsCounter from "@/components/UI/counter/UnviversalCounter/UniversalCommentsCounter.vue";

export default {
  name: "UniversalAppCounter",

  components: {
    UniversalViewsCounter,
    UniversalLikesCounter,
    UniversalCommentsCounter,
  },

  props: {
    instance: {
      type: Object,
      required: true,
    },
    likesEndPoints: {
      type: Object,
    },
    viewsEndPoints: {
      type: Object,
    },
    commentsEndPoints: {
      type: Object,
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
.universal_app_counter {
  &__wrapper {
    display: inline-flex;
    gap: var(--v-rhythm-2);
    position: relative;
    z-index: 1;
  }
}
</style>
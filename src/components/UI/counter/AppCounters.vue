<template>
  <div class="app-counters" :class="{ 'app-counters--reverse': isReverse }">
    <ViewsCounter
      v-if="counterViews"
      class="app-counters__counter"
      :counter="counterViews.counter"
      :urlId="urlId"
    />
    <LikesCounter
      v-if="counterLikes"
      class="app-counters__counter"
      :counter="counterLikes.counter"
      :urlId="urlId"
      :isActive="counterLikes.isActive"
    />
    <CommentsCounter
      v-if="counterComments"
      class="app-counters__counter"
      :counter="counterComments.counter"
      :url="counterComments.url"
    />
  </div>
</template>

<script>
import LikesCounter from "@/components/UI/counter/LikesCounter.vue";
import ViewsCounter from "@/components/UI/counter/ViewsCounter.vue";
import CommentsCounter from "@/components/UI/counter/CommentsCounter.vue";

export default {
  name: "AppCounters",

  components: { LikesCounter, ViewsCounter, CommentsCounter },

  props: {
    urlId: {
      type: [String, Number],
      required: true,
    },

    isReverse: {
      type: Boolean,
      required: false,
      default: false,
    },

    counterViews: {
      type: Object,
      required: false,
    },

    counterLikes: {
      type: Object,
      required: false,
    },

    counterComments: {
      type: Object,
      required: false,
    },
  },

  data() {
    return {};
  },

  computed: {},

  methods: {},
};
</script>

<style scoped lang="scss">
.app-counters {
  display: flex;
  flex-wrap: wrap;
  gap: var(--v-rhythm-1);

  &--reverse {
    flex-direction: row-reverse;
  }

  &__counter {
  }
}
</style>

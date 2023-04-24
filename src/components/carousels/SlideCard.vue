<template>
  <div class="slide-card" @click="$emit('onClick', id)">
    <div class="slide-card__title">{{ trimmedTitle }}</div>
    <div class="slide-card__circle">
      <UserIcons class="slide-card__circle-icon" :iconName="'arrow-right'" />
    </div>
  </div>
</template>

<script>
import { trimmedString } from "@/assets/scripts/scripts.js";

export default {
  name: "SlideCard",

  components: {},

  props: {
    title: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
  },

  data() {
    return {};
  },

  computed: {
    trimmedTitle() {
      return trimmedString(this.title, 40);
    },
  },

  methods: {},

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss">
.slide-card {
  padding: var(--v-rhythm-5) var(--v-rhythm-4);

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--v-rhythm-2);

  background-color: var(--red100);
  box-shadow: 4px 4px 8px rgba(9, 0, 109, 0.1);
  border-radius: 16px;
  cursor: pointer;
  @include transition();

  @include hover {
    background-color: var(--red300);

    .slide-card__circle {
      background-color: var(--red900);
    }

    .slide-card__circle-icon {
      fill: var(--white900);
    }
  }

  &:active {
    opacity: var(--active-opacity);
  }

  &__title {
    color: var(--gray900);
    @extend .subtitle-2;
    word-break: break-word;
  }

  &__circle {
    width: 38px;
    height: 38px;

    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    border-radius: 50%;
    border: 1px solid var(--red900);
    @include transition(background-color);
  }

  &__circle-icon {
    width: 20px;
    height: 20px;

    fill: var(--red900);
    @include transition(fill);
  }
}
</style>
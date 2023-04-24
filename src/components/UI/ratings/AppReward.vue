<template>
  <div class="app-reward">
    <div class="app-reward__medal">
      <RewardMedal
        class="app-reward__icon"
        :place="place"
        :fontSize="rewardMedalFontSize"
      />
    </div>
    <span class="app-reward__title">{{ title }}</span>
    <time class="app-reward__time" datetime="">{{ time }}</time>
  </div>
</template>

<script>
import RewardMedal from "@/components/UI/ratings/RewardMedal.vue";
import { mapGetters } from "vuex";

export default {
  name: "AppReward",

  components: {
    RewardMedal,
  },

  props: {
    place: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: false,
    },

    time: {
      type: String,
      required: false,
    },
  },

  data() {
    return {};
  },

  computed: {
    ...mapGetters(["browserWindowWidth"]),

    rewardMedalFontSize() {
      return this.browserWindowWidth > 767 ? "26px" : "18px";
    },
  },

  methods: {},

  mounted() {},
};
</script>

<style scoped lang="scss">
.app-reward {
  display: flex;
  flex-direction: column;
  align-items: center;

  color: var(--gray700);
  text-align: center;

  &__medal {
    padding: 2px 0;
    margin-bottom: var(--v-rhythm-2);
  }

  &__icon {
    width: 51px;
    height: 64px;
  }

  &__title {
    margin-bottom: var(--v-rhythm-1);

    @extend .caption-2;
  }

  &__time {
    @extend .overline;
  }

  @include phones {
    &__medal {
      margin-bottom: var(--v-rhythm-1);
    }

    &__icon {
      width: 40px;
      height: 50px;
    }

    &__title {
      margin-bottom: calc(var(--v-rhythm-1) / 2);
    }
  }
}
</style>

<template>
  <div class="reward-medal">
    <div class="reward-medal__wrap">
      <div class="reward-medal__place" :style="{ 'font-size': fontSize }">
        {{ place }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "RewardMedal",

  components: {},

  props: {
    place: {
      type: String,
      required: true,
    },
    fontSize: {
      type: String,
      required: false,
    },
  },

  data() {
    return {};
  },

  computed: {},

  methods: {},

  mounted() {},
};
</script>

<style scoped lang="scss">
.reward-medal {
  width: 40px;
  height: 50px;

  background-image: url("~@/assets/icons/place.svg");

  background-repeat: no-repeat;
  background-size: 100%;
  background-position: center;

  &__wrap {
    height: 100%;
    padding-top: calc(19 * 100% / 40);
    display: flex;
    justify-content: center;
  }

  &__place {
    // position: absolute;
    // top: 19px;
    // left: 50%;
    // transform: translateX(-50%);

    @include font(18px, 0, 700);
    color: var(--gray700);
  }
}
</style>

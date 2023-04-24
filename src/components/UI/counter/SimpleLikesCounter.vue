<template>
  <AppCounter
    class="simple-likes-counter"
    :class="{ 'simple-likes-counter--disabled': isDisabled }"
    :counterIcon="'like'"
    :counterNumber="counterNumber"
    :isActive="isLiked"
    :isDisabled="isDisabled"
    @click="like"
  />
</template>

<script>
import axios from "axios";
import AppCounter from "@/components/UI/counter/AppCounter.vue";

export default {
  name: "SimpleLikesCounter",

  components: {
    AppCounter,
  },

  props: {
    url: {
      type: String,
      required: true,
    },

    fetchParametrs: {
      type: Object,
      required: true,
    },

    counterNumber: {
      type: Number,
      required: true,
    },

    isLiked: {
      type: Boolean,
      required: true,
    },

    isDisabled: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {
      isHold: false,
    };
  },

  computed: {
    params() {
      return {
        ...this.fetchParametrs,
        type: this.isLiked ? "dislike" : "like",
      };
    },
  },

  methods: {
    async like() {
      if (!this.isHold) {
        try {
          this.isHold = true;
          await axios({
            method: "post",
            url: this.url,
            data: this.params,
          });
          this.$emit("likeClick", this.isLiked);
        } catch (error) {
          console.log(error);
        } finally {
          this.isHold = false;
        }
      }
    },
  },

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss">
.simple-likes-counter {
  cursor: pointer;

  &:not(.simple-likes-counter--disabled):active {
    opacity: var(--active-opacity);
  }

  &--disabled {
    cursor: default;
  }
}
</style>
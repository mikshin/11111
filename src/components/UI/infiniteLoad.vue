<template>
  <div v-scroll="infiniteLoad" ref="scroller" class="scroller"></div>
</template>
<script>
export default {
  data() {
    return {
      visible: false,
      isComplete: false,
    };
  },
  methods: {
    infiniteLoad() {
      if (this.visible) {
        let position =
          window.screen.height -
          this.$refs.scroller.getBoundingClientRect().top;
        if (position > 0 && !this.isComplete) {
          this.$emit("onLoading");
          this.isComplete = true;
          setTimeout(() => {
            this.isComplete = false;
          }, 1000);
        }
      }
    },
  },
  mounted() {
    this.visible = true;
  },
  destroyed() {
    this.visible = false;
  },
};
</script>

<style lang="scss" scoped>
.scroller {
  height: 0px;
  width: 100%;
}
</style>

<template>
  <div class="combo">
    <template v-for="(combo, i) in item.comboValue">
      <polls-form :item="combo" :key="i" @onChange="change" />
    </template>
  </div>
</template>
<script>
export default {
  props: {
    item: Object,
  },
  components: {
    PollsForm: () => import("./pollsForm.vue"),
  },
  data() {
    return {
      answers: {},
    };
  },
  methods: {
    change() {
      this.answers[this.item.name] = [];
      for (let form of this.$children) {
        for (let input of form.$children) {
          if (input.input.type === "checkbox" && input.newValue === true) {
            this.answers[this.item.name].push([input.input.name]);
          } else if (input.input.type === "radio" && input.newValue) {
            this.answers[this.item.name].push([input.newValue.code]);
          } else if (input.input.type === "select" && input.newValue) {
            if (input.newValue.length) {
              for (let select of input.newValue) {
                this.answers[this.item.name].push([select.code]);
              }
            } else {
              this.answers[this.item.name].push([input.newValue.code]);
            }
          } else if (
            (input.input.type === "text" || input.input.type === "textarea") &&
            input.newValue
          ) {
            this.answers[this.item.name].push([
              input.input.name,
              input.newValue,
            ]);
          }
        }
      }
      if (this.answers[this.item.name].length) {
        this.$emit("onComplete");
      }
      this.$emit("onChange", { answers: this.answers });
    },
  },
  mounted() {
    this.$set(this.answers, this.item.name, []);
  },
};
</script>

<style lang="scss" scoped></style>

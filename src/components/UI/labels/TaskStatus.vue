<template>
  <AppLabel :collorClass="appLabelColor">{{ status }}</AppLabel>
</template>

<script>
import AppLabel from "@/components/UI/labels/AppLabel.vue";

export default {
  name: "TaskStatus",

  components: {
    AppLabel,
  },

  props: {
    status: {
      type: String,
      required: true,
    },
  },

  data() {
    return {};
  },

  computed: {
    appLabelColor() {
      let color;
      if (this.status === "Ждет выполнения") {
        color = "red900";
      } else if (this.status === "Выполняется") {
        color = "red700";
      } else if (this.status === "Завершена") {
        color = "chat-primary";
      } else if (this.status === "Отложена") {
        color = "gray500";
      } else if (this.status === "Просрочена") {
        color = "gray900";
      }
      return color;
    },
  },

  methods: {},

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss"></style>
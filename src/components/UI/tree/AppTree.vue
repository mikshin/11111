<template>
  <ul class="app-tree">
    <TreeItem
      class="app-tree__item"
      v-for="treeItem in treeData"
      :item="treeItem"
      :key="treeItem.ID"
      :activeItem="activeItem"
      @toggleActive="toggleActive"
    />
  </ul>
</template>

<script>
import TreeItem from "./TreeItem.vue";

export default {
  name: "AppTree",

  components: {
    TreeItem,
  },

  props: {
    treeData: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      activeItem: {},
    };
  },

  methods: {
    toggleActive(e) {
      this.activeItem = e;
      this.$emit("toggleActive", this.activeItem);
    },
  },

  watch: {},

  mounted() {},
};
</script>

<style lang="scss" scoped>
.app-tree {
  padding: var(--v-rhythm-3) 0 var(--v-rhythm-2);

  background-color: var(--white900);
  border: 2px solid var(--gray200);

  overflow: hidden;
}
</style>

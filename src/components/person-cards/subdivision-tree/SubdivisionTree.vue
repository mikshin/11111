<template>
  <div class="subdivision-tree">
    <SubdivisionTreeItem
      class="subdivision-tree__item"
      :dataObj="isHidden ? subdivisions : dataObj"
      :numberHiddenDivisions="numberHiddenDivisions"
      :isHidden="isHidden"
      @showMore="isHidden = false"
    />
  </div>
</template>

<script>
import SubdivisionTreeItem from "./SubdivisionTreeItem.vue";

export default {
  name: "SubdivisionTree",

  components: { SubdivisionTreeItem },

  props: {
    dataObj: {
      type: Object,
      required: false,
    },
  },

  data() {
    return {
      subdivisions: Object.assign({}, this.dataObj),
      levels: 0,
      isHidden: false,
    };
  },

  computed: {
    numberHiddenDivisions() {
      return this.levels - 4;
    },
  },

  methods: {
    recalculateLevels(obj, level) {
      this.levels = level;
      obj.level = level;
      if (obj.CHILD) {
        this.recalculateLevels(obj.CHILD, ++level);
      }
    },

    findLevels(obj, levelNumber) {
      return obj.level === levelNumber
        ? obj
        : this.findLevels(obj.CHILD, levelNumber);
    },
  },

  mounted() {
    this.recalculateLevels(this.subdivisions, 1);

    if (this.numberHiddenDivisions > 0) {
      this.isHidden = true;

      this.subdivisions.CHILD = this.findLevels(
        this.subdivisions,
        this.numberHiddenDivisions + 2
      );
    }
  },
};
</script>

<style lang="scss" scoped>
.subdivision-tree {
  &__item {
  }
}
</style>

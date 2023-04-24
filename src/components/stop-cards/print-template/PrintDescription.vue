<template>
  <div class="print__description">
    <ul class="print__description-list">
      <li
        class="print__description-item"
        v-for="(item, i) in description"
        :key="i"
      >
        <span class="print__description-name">{{ item.name }}</span>
        <span class="print__description-value">{{ item.value }}</span>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  props: {
    description: Object,
  },
};
</script>

<style lang="scss" scoped>
.print {
  -webkit-print-color-adjust: exact;
  font-family: "HeliosC";

  &__description {
    padding-top: 26px;
    &-item {
      padding-bottom: 4px;
      border-bottom: 1px solid #dae1e9;
    }
    &-name {
      font-style: italic;
      font-weight: 700;
      font-size: 8px;
      line-height: 13px;
      color: #83929c;
      width: 200px;
      display: inline-block;
    }
    &-description {
      font-style: normal;
      font-weight: 400;
      font-size: 8px;
      line-height: 13px;
      color: #2b3444;
    }
  }
}
</style>


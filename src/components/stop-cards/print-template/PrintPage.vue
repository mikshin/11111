<template>
  <div class="print__page">
    <PrintHeadline :ID="ID" />
    <div class="print__wrapper">
      <PrintDescription :description="printHeadline" />
      <PrintInputs :inputs="inputs" />
    </div>
  </div>
</template>
<script>
import PrintHeadline from "./PrintHeadline.vue";
import PrintDescription from "./PrintDescription.vue";
import PrintInputs from "./PrintInputs.vue";
export default {
  components: {
    PrintHeadline,
    PrintDescription,
    PrintInputs,
  },
  props: {
    ID: null,
    headline: Object,
    inputs: null,
    printHeadline: null,
  },
};
</script>

<style lang="scss" scoped>
.print {
  &__page {
    background: white;
    width: 148mm;
    height: 793px;
    display: block;
    margin: 0 auto;
    margin-bottom: 0;
  }
  &__wrapper {
    padding: 0 30px;
    display: flex;
    flex-direction: column;
  }
}
</style>

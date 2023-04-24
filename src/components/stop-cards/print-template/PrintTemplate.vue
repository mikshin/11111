<template>
  <div class="print" v-if="printData">
    <PrintPage
      v-for="(input, i) in printData"
      :key="i"
      :headline="headline"
      :inputs="input"
      :ID="ID"
      :printHeadline="printHeadline"
    />
  </div>
</template>
<script>
import PrintPage from "./PrintPage.vue";
export default {
  components: { PrintPage },
  props: {
    printData: null,
    ID: null,
    printHeadline: null,
  },
  data() {
    return {
      headline: {},
    };
  },
};
</script>

<style lang="scss" scoped>
.print {
  display: none;
}
@media print {
  .print {
    display: block;
  }
}
</style>

<style lang="scss">
@media print {
  header,
  footer,
  .stop__description,
  .breadcrumbs,
  .main-title,
  .stop__information {
    display: none !important;
  }
  .print {
    display: block !important;
  }
  .app__main,
  .container {
    padding: 0 !important;
    margin: 0 !important;
  }
  html,
  body {
    width: 148mm;
    height: 210mm;
  }
  @page {
    size: A5;
    margin: 0;
  }
}
</style>

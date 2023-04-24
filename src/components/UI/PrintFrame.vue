<template>
  <iframe
    v-if="src"
    class="print-frame"
    ref="printIframe"
    :style="iframeStlyes"
    @load="runPrint"
    :src="src"
  ></iframe>
</template>

<script>
import { Browser } from "@utils";

export default {
  name: "PrintFrame",

  components: {},

  props: {
    src: {
      type: String,
      required: false,
      default: "",
    },
  },

  data() {
    return {};
  },

  computed: {
    iframeStlyes() {
      if (Browser.isFirefox() && Browser.getFirefoxMajorVersion() < 110) {
        return "width: 1px; height: 100px; position: fixed; left: 0; top: 0; opacity: 0; border-width: 0; margin: 0; padding: 0";
      } else {
        return "visibility: hidden; height: 0; width: 0; position: absolute; border: 0";
      }
    },
  },

  methods: {
    runPrint() {
      // Для Сафари и низких версий Лисы нужна задержка, так как они все равно не успевают загрузить фрейм
      // даже при срабатывании события готовой загрузки
      if (
        Browser.isSafari() ||
        (Browser.isFirefox() && Browser.getFirefoxMajorVersion() < 110)
      ) {
        setTimeout(() => {
          this.print();
        }, 1000);
      } else {
        this.print();
      }
    },
    print() {
      this.$refs.printIframe.focus();
      this.$refs.printIframe.contentWindow.print();
      this.$emit("afterprint");
    },
  },

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss"></style>

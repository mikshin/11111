<template>
  <AppFilter
    :key="componentKey"
    :isLoading="isLoading"
    :isDisabledSubmit="false"
    :isDisabledReset="false"
    @filterSubmit="filterSubmit"
    @filterReset="filterReset"
  >
    <InputTextV2 :input="filter" ref="inpt" />
    {{ filterData }}
  </AppFilter>
</template>

<script>
import AppFilter from "@/components/filter/AppFilter.vue";
import InputTextV2 from "../../UI/inputs/InputTextV2.vue";
import axios from "axios";
export default {
  name: "ServicesFilter",

  components: { AppFilter, InputTextV2 },

  props: {
    // some: {
    //   type: String,
    //   required: false,
    //   default: "",
    // },
  },

  data() {
    return {
      filter: {},
      isLoading: true,
      componentKey: 1,
      filterData: "",
    };
  },

  computed: {},
  methods: {
    async getFilters() {
      this.isLoading = true;
      const response = await axios.get(
        "/mobileapp/api/services/getServiceFilter"
      );
      if (response) {
        this.filter = response.data[0];
        this.isLoading = false;
      }
    },
    filterSubmit() {
      this.$emit("filterSubmit", this.$refs.inpt.newValue);
    },

    filterReset() {
      this.componentKey += 1;
      this.$emit("filterReset");
    },
  },

  watch: {},

  mounted() {
    this.getFilters();
  },
};
</script>

<style scoped lang="scss"></style>
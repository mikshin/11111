<template>
  <AppFilter
    :key="componentKey"
    :isLoading="isLoading"
    :isDisabledSubmit="false"
    :isDisabledReset="false"
    @filterSubmit="filterSubmit"
    @filterReset="filterReset"
  >
    <template v-for="(input, idx) in inputs">
      <InputTemplate
        :key="idx"
        class="page-search-filter__input-template"
        :input="input"
        :ref="input.name"
        @onChange="getInputTemplateNewValue"
      />
    </template>
  </AppFilter>
</template>

<script>
import axios from "axios";
import AppFilter from "@/components/filter/AppFilter.vue";
import InputTemplate from "@/components/UI/inputTemplate.vue";

export default {
  name: "QuestionsFilter",

  components: { AppFilter, InputTemplate },

  props: {},

  data() {
    return {
      parametrsFilter: null,
      isLoading: false,
      componentKey: 0,
      inputs: [],
      selectedCompany: [],
      selectedDepartment: [],
      selectedManager: [],
      selectedCategory: [],
      isAnswerWaiting: false,
      COMPANY: null,
      DEPARTMENT: null,
    };
  },

  computed: {},

  methods: {
    async getFilterList() {
      try {
        this.isLoading = true;
        await axios
          .get(`/mobileapp/api/question/getFilter`, {
            params: {
              companyId: this.COMPANY,
              departmentId: this.DEPARTMENT,
            },
          })
          .then((response) => {
            if (response) {
              this.inputs = response.data;
            }
          });
      } catch (e) {
        console.log(e);
        this.inputs = [];
      } finally {
        this.isLoading = false;
      }
    },
    filterReset() {
      this.COMPANY = null;
      this.DEPARTMENT = null;
      this.inputs = [];
      this.getFilterList();
      this.componentKey += 1;
      this.$emit("filtersReset");
    },
    filterSubmit() {
      const data = [];
      const tmp = this.$refs;
      for (let i in tmp) {
        const val = this.$refs[i][0].newValue;
        const obj = {};

        if (Array.isArray(val)) {
          obj[i] = val;
        } else {
          obj[i] = val;
        }
        data.push(obj);
      }
      this.$emit("changingFilter", data);
    },
    clearSelects() {
      this.DEPARTMENT = [];
      ["DEPARTMENT", "RECIPIENT_ID", "CATEGORY"].forEach((item) => {
        this.$refs[item][0].input.defaultValue = [];
        this.$refs[item][0].$vnode.key += Date.now();
        this.$refs[item][0].newValue = [];
      });
    },
    getInputTemplateNewValue(e) {
      let name = e.data.input.name;
      if (name === "COMPANY") {
        this.clearSelects();
        this.selectedCompany = e.data.newValue?.code;
        this.COMPANY = this.selectedCompany;
        this.getFilterList();
      }
      if (name === "DEPARTMENT") {
        if (e.data.newValue) {
          this.selectedDepartment = e.data.newValue.map((i) => {
            return i.code;
          });
          this.DEPARTMENT = this.selectedDepartment;
          this.getFilterList();
        }
      }
      if (name === "RECIPIENT_ID") {
        this.selectedManager = e.data.newValue?.code;
      }
      if (name === "CATEGORY") {
        this.selectedCategory = e.data.newValue?.code;
      }
      if (name === "ANSWER_REQUIRED") {
        this.isAnswerWaiting = e.data.newValue;
      }
    },
  },

  watch: {},

  mounted() {
    this.getFilterList();
  },
};
</script>

<style scoped lang="scss"></style>
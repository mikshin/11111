<template>
  <fieldset class="filter-period">
    <span class="filter-period__name">{{ name }}</span>
    <Input
      :input="{
        type: 'radio',
        placeholder: '',
        radioValue: [{ name: 'Точная дата', code: 'single' }],
        name: 'data',
      }"
      :key="singleKey"
      @onChange="selectRadio"
    />
    <Input
      :input="{
        type: 'date',
        placeholder: 'Дата',
        name: 'dateFrom',
      }"
      v-if="sortDate == 'single'"
      @onChange="changeFilter"
      :key="'date'"
    />

    <Input
      :input="{
        type: 'radio',
        placeholder: '',
        radioValue: [{ name: 'Период', code: 'multi' }],
        name: 'data',
      }"
      :key="multiKey"
      @onChange="selectRadio"
    />
    <Input
      :input="{
        type: 'date',
        placeholder: 'Дата',
        name: 'dateFrom',
      }"
      v-if="sortDate == 'multi'"
      :key="'dateFrom'"
      @onChange="changeFilter"
    />
    <Input
      :input="{
        type: 'date',
        placeholder: 'Дата',
        name: 'dateTo',
      }"
      v-if="sortDate == 'multi'"
      :key="'dateTo'"
      @onChange="changeFilter"
    />
  </fieldset>
</template>

<script>
import Input from "@/components/UI/inputTemplate.vue";

export default {
  name: "FilterPeriod",

  components: {
    Input,
  },

  props: {
    name: null,
  },

  data() {
    return {
      sortDate: "",
      newValue: null,
      input: {
        name: "PUBLICATION_DATE",
        type: "period",
      },
      isValid: true,
      singleKey: 0,
      multiKey: 1,
    };
  },

  methods: {
    changeFilter(data) {
      const currentInput = data.data;
      const currentInputValue = currentInput.newValue;
      const currentInputName = currentInput.input.name;

      if (currentInputValue) {
        if (currentInputValue.length === 10) {
          let newValue = this.splitDate(currentInputValue);

          this.makeNewValue(currentInputName, newValue);
        } else if (currentInputValue.length === 0) {
          this.clearNewValue(currentInputName);
        } else {
          return;
        }
      } else {
        this.newValue = null;
      }

      this.onChange();
    },

    selectRadio(data) {
      const value = data.data.newValue;
      if (value) {
        this.sortDate = value.code;
        this.newValue = null;
      }
    },

    onChange() {
      this.$emit("onChange", { data: this.newValue, sortDate: this.sortDate });
    },

    splitDate(str) {
      const arrDate = str.split(".");
      return {
        day: arrDate[0],
        month: arrDate[1],
        year: arrDate[2],
      };
    },

    clearNewValue(key) {
      if (Object.keys(this.newValue).length > 1) {
        this.$delete(this.newValue, key);
      } else {
        this.newValue = null;
      }
    },

    makeNewValue(key, value) {
      !this.newValue ? (this.newValue = {}) : null;
      this.newValue[key] = value;
    },
  },

  watch: {
    sortDate() {
      this.onChange();

      if (this.sortDate === "single") {
        this.multiKey = Date.now();
      } else if (this.sortDate === "multi") {
        this.singleKey = Date.now();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.filter-period {
  border: none;
  padding: 0;

  &__name {
    display: block;
    margin-bottom: var(--v-rhythm-4);

    color: var(--gray500);
    @extend .subtitle-2;
  }
}
</style>
<template>
  <form class="filter" ref="filter" :key="componentKey">
    <div class="filter__header">
      <div class="filter__icon">
        <UserIcons :iconName="'filter'" />
      </div>
      Фильтр
    </div>

    <div class="filter__main">
      <div class="filter__inputs">
        <template v-for="(input, i) in filter">
          <template v-if="input.type === 'period'">
            <FilterPeriod
              class="filter__filter-period"
              :key="i"
              @onChange="changeFilter"
              :name="input.name"
            />
          </template>
          <span
            class="filter__label"
            v-else-if="input.type === 'label'"
            :key="i"
            >{{ input.name }}</span
          >
          <CheckboxList
            v-else-if="input.type === 'checkboxList'"
            :key="i"
            :input="input"
            @onChange="changeFilter"
          />

          <Input :input="input" :key="i" v-else @onChange="changeFilter" />
        </template>
      </div>

      <div class="filter__btns">
        <button
          class="filter__btn primary-btn"
          type="button"
          @click="submitForm"
          :disabled="isDisabled"
        >
          Применить фильтр
        </button>

        <button
          class="filter__btn secondary-btn"
          type="reset"
          :disabled="!Object.keys(filterValue).length > 0"
          @click="reset"
        >
          Сбросить фильтр
        </button>
      </div>
    </div>
  </form>
</template>

<script>
import Input from "@/components/UI/inputTemplate.vue";
import FilterPeriod from "@/components/UI/filter/FilterPeriod.vue";
import CheckboxList from "@/components/UI/inputs/CheckboxList.vue";

export default {
  components: {
    Input,
    FilterPeriod,
    CheckboxList,
  },
  props: {
    filter: null,
  },
  data() {
    return {
      filterValue: {},
      isDisabled: true,
      sortDate: "",
      componentKey: 0,
    };
  },
  methods: {
    submitForm() {
      this.$emit("onUpdate", {
        data: this.filterValue,
      });
      this.isDisabled = true;
    },
    changeFilter() {
      this.filterValue = {};

      let inputs = this.$children;

      for (let key in inputs) {
        let input = inputs[key];
        if (input.newValue) {
          if (input.input.type === "select") {
            if (Array.isArray(input.newValue)) {
              let selectValue = [];
              for (let selectKey in input.newValue) {
                selectValue.push(input.newValue[selectKey].code);
              }
              this.$set(this.filterValue, input.input.name, selectValue);
            } else {
              this.$set(
                this.filterValue,
                input.input.name,
                input.newValue.code
              );
            }
          } else if (input.input.type === "radio") {
            this.$set(this.filterValue, input.input.name, input.newValue.code);
          } else {
            this.$set(this.filterValue, input.input.name, input.newValue);
          }
        }
      }
      this.$emit("onChange", {
        data: this.filterValue,
      });
      this.isDisabled = false;
    },
    reset() {
      this.filterValue = {};
      this.$emit("reset");
      // for (let key in this.$children) {
      //   this.$children[key].newValue = "";
      //   this.$children[key].sortDate = "";
      // }

      // Переинициализируем компонент, что бы сбросить данные вложенных инпутов
      this.componentKey += 1;
      this.submitForm();
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
.filter {
  background-color: var(--white900);
  border: 1px solid var(--gray200);

  &__header {
    padding: var(--v-rhythm-2);

    display: flex;
    align-items: center;

    color: var(--white900);
    @extend .subtitle-2;

    background: var(--gradient);
  }

  &__icon {
    height: 40px;
    width: 40px;
    margin-right: var(--v-rhythm-3);

    display: flex;
    align-items: center;
    justify-content: center;

    background-color: var(--gray100);
    border-radius: 50%;

    fill: var(--gray500);
  }

  &__main {
    padding: var(--v-rhythm-4) 10px 10px;

    display: flex;
    flex-direction: column;
    gap: var(--v-rhythm-8);
  }

  &__filter-period {
    margin-top: var(--v-rhythm-4);
  }

  &__submit-btn {
    width: 100%;
  }

  &__label {
    color: var(--gray500);
    margin-bottom: var(--v-rhythm-6);
    margin-top: var(--v-rhythm-8);
    display: block;
    @extend .subtitle-2;
  }

  &__btns {
    display: flex;
    flex-direction: column;
    gap: var(--v-rhythm-4);
  }

  &__btn {
    width: 100%;
  }
}
</style>

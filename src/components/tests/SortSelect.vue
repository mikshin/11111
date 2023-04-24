<template>
  <div class="sort-select">
    <span
      class="sort-select__title"
      :class="{
        required: required,
      }"
      v-if="title"
      >{{ title }}</span
    >

    <div class="sort-select__wrapper">
      <ul class="sort-select__list">
        <li class="sort-select__item" v-for="(item, i) in selectList" :key="i">
          <AppSelect
            class="sort-select__item-input"
            :name="item.code"
            :placeholder="'Порядковый №'"
            :selectValues="selectValues"
            :defaultValue="item.defaultValue"
            :required="true"
            :multiple="false"
            :autocomplete="false"
            :showRequired="false"
            :showErrors="true"
            @emitData="getData"
          />

          <span class="sort-select__item-label">{{ item.label }}</span>
        </li>
      </ul>

      <InputErrors class="sort-select__errors" :errors="this.errors" />
    </div>
  </div>
</template>

<script>
import AppSelect from "@/components/tests/AppSelect.vue";
import InputErrors from "@/components/UI/inputs/assets/InputErrors.vue";

export default {
  name: "SortSelect",

  components: {
    AppSelect,
    InputErrors,
  },

  props: {
    name: {
      type: [String, Number],
      required: true,
    },

    title: {
      type: String,
      required: false,
      default: "",
    },

    selectList: {
      type: Array,
      required: true,
    },

    required: {
      type: Boolean,
      required: false,
      default: false,
    },

    showErrors: {
      type: Boolean,
      required: false,
      default: true,
    },
  },

  data() {
    return {
      inputDataList: [],
      isValid: false,
      value: [],
      errors: [],
      // Нужно для того, что бы при инициализации не выскакивали errors
      firstValidate: true,
    };
  },

  computed: {
    selectValues() {
      const selectValues = [];
      for (let i = 1; i <= this.selectList.length; i++) {
        if (!this.value.find((item) => item.code === i)) {
          selectValues.push({ code: i, label: `${i}` });
        }
      }
      return selectValues;
    },
  },

  methods: {
    getData(data) {
      // Проверка первичной инициализации или переключения пользователем
      const index = this.inputDataList.findIndex(
        (item) => item.name === data.name
      );

      if (index >= 0) {
        // При переключении
        this.inputDataList[index] = data;
      } else {
        // При первичной инициализации
        this.inputDataList.push(data);
      }

      // Проверяем, что все инпуты проинициализировались
      if (this.inputDataList.length === this.selectList.length) {
        // Получаем ответы
        this.getValue(data);

        this.validate();
      }
    },

    getValue(data) {
      const index = this.value.findIndex((item) => item.label === data.name);
      if (index >= 0) {
        if (!data.value.length) {
          this.value.splice(index, 1);
        } else if (data.value[0].code !== this.value[index].code) {
          this.value[index].code = data.value[0].code;
        }
      } else {
        if (data.value.length)
          this.value.push({ label: data.name, code: data.value[0].code });
      }
    },

    validate() {
      this.errors = [];
      if (this.required && this.value.length !== this.selectList.length) {
        this.isValid = false;
        if (!this.firstValidate && this.showErrors) {
          this.errors.push("Данное поле обязательно для заполнения");
        }
      } else {
        this.isValid = true;
      }

      this.firstValidate ? (this.firstValidate = false) : null;
      this.emitData();
    },

    emitData() {
      this.$emit("emitData", {
        name: this.name,
        value: this.value,
        type: "sortSelect",
        isValid: this.isValid,
      });
    },
  },

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss">
.sort-select {
  display: flex;
  flex-direction: column;
  gap: var(--v-rhythm-6);

  &__title {
    @extend .subtitle-2;
    color: var(--gray500);
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: var(--v-rhythm-2);
  }

  &__item {
    display: flex;
    align-items: center;
    gap: var(--v-rhythm-4);
  }

  &__item-input {
    width: 200px;
  }

  &__item-label {
    @extend .body-1;
    color: var(--gray900);
  }

  @media screen and (max-width: 500px) {
    &__list {
      gap: var(--v-rhythm-4);
    }

    &__item {
      flex-direction: column-reverse;
      align-items: flex-start;
    }

    &__item-input {
      width: 100%;
    }
  }
}
</style>
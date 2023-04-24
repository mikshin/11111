<template>
  <div class="group-checkbox">
    <span
      class="group-checkbox__title"
      :class="{
        required: required,
      }"
      v-if="title"
      >{{ title }}</span
    >

    <div class="group-checkbox__wrapper">
      <ul class="group-checkbox__list">
        <li
          class="group-checkbox__item"
          v-for="(item, i) in checkboxList"
          :key="i"
        >
          <AppCheckbox
            class="group-checkbox__input"
            :name="item.code"
            :title="item.label"
            :showErrors="false"
            :defaultValue="item.defaultValue"
            @emitData="getData"
          />
        </li>
      </ul>

      <InputErrors class="group-checkbox__errors" :errors="this.errors" />
    </div>
  </div>
</template>

<script>
import AppCheckbox from "@/components/tests/AppCheckbox.vue";
import InputErrors from "@/components/UI/inputs/assets/InputErrors.vue";

export default {
  name: "GroupCheckbox",

  components: {
    AppCheckbox,
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

    checkboxList: {
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

  computed: {},

  methods: {
    getData(data) {
      // Проверка первичной инициализации или переключения пользователем
      const index = this.inputDataList.findIndex(
        (item) => item.name === data.name
      );

      if (index >= 0) {
        // При переключении чекбоксов
        this.inputDataList[index] = data;
      } else {
        // При первичной инициализации
        this.inputDataList.push(data);
      }

      // Проверяем, что все инпуты проинициализировались
      if (this.inputDataList.length === this.checkboxList.length) {
        // Получаем ответы
        this.getValue(data);

        this.validate();
      }
    },

    getValue(data) {
      const index = this.value.findIndex((item) => item === data.name);

      if (index >= 0) {
        if (!data.value) this.value.splice(index, 1);
      } else {
        if (data.value) this.value.push(data.name);
      }
    },

    validate() {
      this.errors = [];
      if (this.required && !this.value.length) {
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
        type: "groupCheckbox",
        isValid: this.isValid,
      });
    },
  },

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss">
.group-checkbox {
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
    align-items: flex-start;
    gap: var(--v-rhythm-2);
  }

  &__item {
  }
}
</style>
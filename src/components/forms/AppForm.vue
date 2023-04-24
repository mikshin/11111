<template>
  <form class="app-form">
    <slot name="inputs"></slot>

    <div class="app-form__btns">
      <button
        class="primary-btn"
        type="submit"
        @click.prevent="submitForm"
        :disabled="!isValid || isDisableSubmit"
      >
        {{ btnSubmitText }}
      </button>

      <button
        class="secondary-btn"
        v-if="btnResetText"
        type="reset"
        @click.prevent="resetForm"
      >
        {{ btnResetText }}
      </button>

      <button class="secondary-btn" v-else @click.prevent="cancelForm">
        Отменить
      </button>
    </div>
  </form>
</template>

<script>
export default {
  name: "AppForm",

  components: {},

  props: {
    inputDataList: {
      type: Array,
      required: true,
    },

    btnSubmitText: {
      type: String,
      required: false,
      default: "Отправить",
    },

    isDisableSubmit: {
      type: Boolean,
      default: false,
    },

    btnResetText: {
      type: String,
      required: false,
    },
  },

  data() {
    return {};
  },

  computed: {
    isValid() {
      let validity;
      for (const item of this.inputDataList) {
        validity = item.isValid;
        if (item.isValid === false) {
          break;
        }
      }
      return validity;
    },
  },

  methods: {
    cancelForm() {
      this.$emit("cancelForm");
    },

    submitForm() {
      this.$emit("submitForm", this.getDataForm());
    },

    getDataForm() {
      let form = new FormData();

      this.inputDataList.forEach((item) => {
        // Добавляем новые файлы
        if (item.type === "file") {
          // Добавляем новые файлы
          const newFiles = item.addFiles.map((file) => {
            const newName = /\s/g.test(file.name)
              ? file.name.trim().replace(/\s/g, "_")
              : file.name;

            return new File([file], newName, { type: file.type });
          });

          for (const file of newFiles) {
            form.append(item.name, file);
          }

          // Добавляем id удаленных файлов
          for (const fileId of item.deleteFiles) {
            form.append(item.deleteName, fileId);
          }
        } else if (item.type === "search-persons") {
          // Добавляем id новых юзеров
          for (const userId of item.addValue) {
            form.append(item.name, userId);
          }
          // Добавляем id удаленных юзеров
          for (const userId of item.deleteValue) {
            form.append(item.deleteName, userId);
          }
        } else if (item.type === "select") {
          if (item.newValue.length > 0) {
            for (const newValue of item.newValue) {
              form.append(item.name, newValue.code);
            }
          }
        } else {
          if (item.newValue) {
            form.append(item.name, item.newValue);
          }
        }
      });
      return form;
    },

    resetForm() {
      this.$emit("resetForm");
    },
  },

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss">
.app-form {
  &__btns {
    display: flex;
    gap: var(--v-rhythm-4);
  }
}
</style>
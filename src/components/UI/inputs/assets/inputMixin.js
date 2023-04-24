export const inputMixin = {
  props: {
    lazyValidation: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isValid: null,
      errors: [],
      isDirty: false,
    };
  },
  methods: {
    validate() {
      this.errors = [];
      // проверка на обязательность
      if (this.input.required) {
        if (Array.isArray(this.newValue)) {
          if (this.newValue.length > 0) {
            this.isValid = true;
          } else {
            this.isValid = false;
            this.errors.push("Данное поле обязательно для заполнения");
          }
        } else if (this.newValue) {
          this.isValid = true;
        } else {
          this.isValid = false;
          this.errors.push("Данное поле обязательно для заполнения");
        }
      } else {
        this.isValid = true;
      }
      // проверка на маску
      if (
        (this.input.type === "tel" ||
          this.input.type === "email" ||
          this.input.type === "date") &&
        this.newValue
      ) {
        let reg = new RegExp(this.reg[this.input.type]);
        if (reg.test(this.newValue)) {
          this.isValid = true;
        } else {
          this.isValid = false;
          this.errors.push("Проверьте правильное заполнение поля");
        }
      }

      // Проверка для поролей, не должно быть пробелов
      if (this.input.type === "password" && /\s/.test(this.newValue)) {
        this.errors.push("Не допустимый символ");
        this.isValid = false;
      }

      this.$emit("onChange", {
        data: this,
      });
    },
  },

  mounted() {
    if (!this.input.required) {
      this.isValid = true;
    }
    if (this.input.value) {
      this.newValue = this.value;
    }

    if (this.input.defaultValue) {
      if (this.lazyValidation && !this.isDirty) return;

      this.validate();
    }
  },

  created() {
    this.$on("onChange", () => {
      this.isDirty = true;
    });
  },
};

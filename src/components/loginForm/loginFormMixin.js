export const loginFormMixin = {
  data() {
		return {
			pass: "",
      errors: "",
      inputsValid: [],
      isActive: false,
      isLoading: false
		};
	},

	methods: {
		validForm(data) {
      if (this.inputsValid.length === 0) {
        this.inputsValid = [
          {
            id: data._uid,
            isValid: data.isValid,
          },
        ];
      } else {
        if (this.inputsValid.filter((i) => i.id === data._uid).length) {
          this.inputsValid = this.inputsValid.map((i) => {
            i.isValid = i.id === data._uid ? data.isValid : i.isValid;
            return i;
          });
        } else {
          this.inputsValid = [
            ...this.inputsValid,
            { id: data._uid, isValid: data.isValid },
          ];
        }
      }
      this.isActive = this.inputsValid.filter((i) => !i.isValid).length === 0;
    },
	},
}
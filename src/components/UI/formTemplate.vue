<template>
  <form @submit.prevent="sendForm" :class="{ sended: sended }">
    <template v-for="(input, key) in inputs">
      <Input :key="key" :input="input" />
    </template>
    <div class="sended">
      {{ successMessage }}
    </div>
    <div class="form-slot" ref="formSlot">
      <slot></slot>
    </div>
    <!-- !!!Не удалять, на этом спане держится вся валидация. Костыль починим при рефакторинге -->
    <span class="visually-hidden">{{ isFormValid }}</span>
  </form>
</template>
<script>
import Input from "./inputTemplate.vue";
import axios from "axios";

export default {
  components: {
    Input,
  },
  props: {
    name: null,
    inputs: null,
    submitAdress: null,
  },
  data() {
    return {
      sended: false,
      successMessage: "",
      isMounted: false,
      dbase: null,
      switcher: true,
    };
  },
  methods: {
    sendForm: function () {
      if (this.submitAdress) {
        let formData = new FormData(this.$el);
        // логика добавления значения для файлов
        let fileInput;
        for (let item of this.$children) {
          if (item.type === "file") {
            fileInput = item;
            formData.set(fileInput.name, fileInput.files);
          }
        }

        // конец файлов

        // отправляем на сервер

        axios
          .post(this.submitAdress, formData)
          .then(() => {
            this.sended = true;
            this.successMessage = "Форма успешно отправлена";
            this.$emit("onSuccess", true);
          })
          .catch((error) => {
            this.successMessage = "Произошла ошибка при отправке формы";
            console.log(error);

            this.$emit("onSuccess", false);
            // Если происходит ошибка, то запускается процесс локального сохранения
            let data = [];
            for (let item of this.$children) {
              // тут надо добавить логику для файлов
              if (item._vnode.tag === "label") {
                if (item.newValue != null) {
                  data.push({
                    name: item.name,
                    value: item.newValue,
                  });
                }
              }
            }
          });
      }
    },
    refresh() {
      this.switcher = !this.switcher;
    },
  },
  computed: {
    isFormValid() {
      this.switcher;
      if (!this.isMounted) return;
      let counter = 0;
      let length = 0;
      const slotInputs = this.$slots.default;
      let slotWrappedInputs = [];
      const propInputs = this.$refs.name;

      // Включение инпутов внутри оберток
      if (slotInputs != undefined) {
        for (let input of slotInputs) {
          if (
            input.data &&
            input.data.staticClass &&
            input.data.staticClass === "input_container-wrapper"
          ) {
            for (let i = 0; i < input.children.length; i++) {
              const element = input.children[i];
              slotWrappedInputs.push(element);
            }
          }
        }
      }

      // Проверка для инпутов в слоте в обертках
      if (slotWrappedInputs.length) {
        for (let input of slotWrappedInputs) {
          const vComp = input.componentInstance;
          if (vComp && vComp.isValid) {
            counter++;
          }
          if (vComp && vComp._vnode.data.staticClass === "input_container") {
            length++;
          }
        }
      }

      //Проверка для инпутов в слоте
      if (slotInputs != undefined) {
        for (let input of slotInputs) {
          const vComp = input.componentInstance;
          if (vComp && vComp.isValid) {
            counter++;
          }
          if (vComp && vComp._vnode.data.staticClass === "input_container") {
            length++;
          }
        }
      }

      // Проверка для инпутов в пропсах
      if (propInputs != undefined) {
        for (let input of propInputs) {
          if (input.isValid) {
            counter++;
          }
          if (input._vnode.data.staticClass === "input_container") {
            length++;
          }
        }
      }

      this.$emit("onValidate", { data: counter === length });

      if (counter === length) return true;
      return false;
    },
  },
  mounted() {
    this.isMounted = true;

    const observer = new MutationObserver(this.refresh);
    observer.observe(this.$el, {
      childList: true,
      subtree: true,
    });
    this.observer = observer;
  },

  beforeUnmount() {
    this.observer.disconnect();
  },
};
</script>

<style lang="scss" scoped>
form {
  &.sended {
    label {
      opacity: 0;
    }
  }
}
</style>

<template>
  <div class="input_container">
    <!-- Текстариа -->
    <InputTextarea
      :input="input"
      v-if="input.type === 'textarea'"
      @onChange="getComponentData"
    />

    <!-- Текстовый инпут -->
    <InputText
      :input="input"
      v-if="input.type === 'text'"
      @onChange="getComponentData"
    />

    <!-- Поиск -->
    <InputSearch
      :input="input"
      v-if="input.type === 'search'"
      @onChange="getComponentData"
    />

    <!-- Поиск сотрудников -->
    <InputSearchPersons
      :input="input"
      v-if="input.type === 'search-persons'"
      @onChange="getComponentData"
      @onDelete="deletePerson"
      @onAdd="addPerson"
    />

    <!-- Поиск подразделений -->
    <InputSearchDepartment
      :input="input"
      v-if="input.type === 'search-department'"
      @onChange="getComponentData"
    />

    <!-- Пароль -->
    <InputPassword
      :input="input"
      v-if="input.type === 'password'"
      @onChange="getComponentData"
    />

    <!-- Телефон -->
    <InputPhone
      :input="input"
      v-if="input.type === 'tel'"
      @onChange="getComponentData"
    />

    <!-- Почта -->
    <InputEmail
      :input="input"
      v-if="input.type === 'email'"
      @onChange="getComponentData"
    />

    <!-- Селект -->
    <InputSelect
      :input="input"
      :lazyValidation="lazyValidation"
      v-else-if="input.type === 'select'"
      @onChange="getComponentData"
      :disabled="disabled"
    />

    <!-- Датапикер -->
    <InputDatePicker
      :input="input"
      :lazyValidation="lazyValidation"
      v-else-if="input.type === 'date'"
      @onChange="getComponentData"
    />

    <!-- Датапикер с датой и временем -->
    <InputDatetimePicker
      :input="input"
      v-else-if="input.type === 'datetime'"
      @onChange="getComponentData"
    />

    <!-- Датапикер только время -->
    <InputTime
      :input="input"
      v-else-if="input.type === 'time'"
      @onChange="getComponentData"
    />

    <!-- Датапикер с интервальным временем -->
    <InputTimeInterval
      :input="input"
      v-else-if="input.type === 'timeInterval'"
      @onChange="getComponentData"
    />

    <!-- Радио -->
    <InputRadio
      :input="input"
      v-else-if="input.type === 'radio'"
      @onChange="getComponentData"
    />

    <!-- Чекбокс -->
    <InputCheckbox
      :input="input"
      v-else-if="input.type === 'checkbox'"
      @onChange="getComponentData"
    />

    <!-- Файл -->
    <InputFile
      :input="input"
      v-else-if="input.type === 'file'"
      @onChange="getComponentData"
    />

    <!-- Файл -->
    <InputFileV2
      :input="input"
      v-else-if="input.type === 'fileV2'"
      @onChange="getComponentData"
    />

    <!-- Висивиг -->
    <InputVueEditor
      :input="input"
      v-else-if="input.type === 'editor'"
      @onChange="getComponentData"
    />
  </div>
</template>

<script>
import InputTextarea from "@UI/inputs/InputTextarea.vue";
import InputDatePicker from "@UI/inputs/InputDatePicker.vue";
import InputDatetimePicker from "@UI/inputs/InputDatetimePicker.vue";
import InputTime from "@UI/inputs/InputTime.vue";
import InputTimeInterval from "@UI/inputs/InputTimeInterval.vue";
import InputSelect from "@UI/inputs/InputSelect.vue";
import InputCheckbox from "@UI/inputs/InputCheckbox.vue";
import InputRadio from "@UI/inputs/InputRadio.vue";
import InputFile from "@UI/inputs/InputFile.vue";
import InputFileV2 from "@UI/inputs/InputFileV2.vue";
import InputText from "@UI/inputs/InputText.vue";
import InputSearch from "@UI/inputs/InputSearch.vue";
import InputSearchPersons from "@UI/inputs/InputSearchPersons.vue";
import InputSearchDepartment from "@UI/inputs/InputSearchDepartment.vue";
import InputPassword from "@UI/inputs/InputPassword.vue";
import InputPhone from "@UI/inputs/InputPhone.vue";
import InputEmail from "@UI/inputs/InputEmail.vue";
import InputVueEditor from "@UI/inputs/InputVueEditor.vue";

export default {
  name: "InputTemplate",
  props: {
    input: Object,
    lazyValidation: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    InputTextarea,
    InputDatePicker,
    InputDatetimePicker,
    InputTime,
    InputSelect,
    InputCheckbox,
    InputRadio,
    InputFile,
    InputFileV2,
    InputText,
    InputSearch,
    InputSearchPersons,
    InputSearchDepartment,
    InputPassword,
    InputPhone,
    InputEmail,
    InputVueEditor,
    InputTimeInterval,
  },
  data() {
    return {
      newValue: this.input.defaultValue,
      files: [],
      mentionedUsers: [],
      image: null,
      isValid: null,
      // Показывает, вызывалось вызывалось ли хоть раз onChange
      isDirty: false,
    };
  },
  methods: {
    getComponentData(value) {
      setTimeout(() => {
        this.isValid = value.data.isValid;
        this.newValue = value.data.newValue;
        this.files = value.data.files;
        this.image = value.data.image;
        this.mentionedUsers = value.data.mentionedUsers;

        this.$emit("onChange", {
          data: this,
        });
      }, 0);
    },
    deletePerson(data) {
      this.$emit("onDelete", data);
    },
    addPerson(data) {
      this.$emit("onAdd", data.user);
    },
  },
  mounted() {
    if (!this.input.required) {
      this.isValid = true;
    }
    if (this.input.value) {
      this.newValue = this.value;
    }
    this.$emit("onChange", {
      data: this,
    });
  },
  watch: {
    "input.required"(newValue) {
      if (newValue) {
        this.isValid = false;
      } else {
        this.isValid = true;
      }
    },
  },
  computed: {
    foo() {
      return this.input.required;
    },
  },
  created() {
    this.$on("onChange", () => {
      this.isDirty = true;
    });
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/styles/inputTemplate.scss";
</style>

<template>
  <div class="input-generator">
    <template v-for="(input, i) in inputs">
      <InputTextareaV2
        class="input-generator__textarea"
        v-if="input.type === 'textarea'"
        :key="i"
        :input="input"
        @getThisData="getThisData"
      />
      <InputFileV2
        class="input-generator__file"
        v-if="input.type === 'file'"
        :key="i"
        :input="input"
        @getThisData="getThisData"
      />
      <InputSearchPersonsV2
        class="input-generator__search-persons"
        v-if="input.type === 'search-persons'"
        :key="i"
        :input="input"
        @getThisData="getThisData"
      />
      <InputTextV2
        class="input-generator__text"
        v-if="input.type === 'text'"
        :key="i"
        :input="input"
        @getThisData="getThisData"
      />
      <InputCheckboxV2
        class="input-generator__сheckbox"
        v-if="input.type === 'checkbox'"
        :key="i"
        :input="input"
        @getThisData="getThisData"
      />
      <InputEditorV2
        class="input-generator__editor"
        v-if="input.type === 'editor'"
        :key="i"
        :input="input"
        :isEditing="true"
        @getThisData="getThisData"
      />
      <InputSelectV2
        class="input-generator__select"
        v-if="input.type === 'select'"
        :key="i"
        :input="input"
        :isEditing="true"
        @getThisData="getThisData"
        @onChange="onChange"
      />
    </template>
  </div>
</template>

<script>
import InputTextV2 from "@/components/UI/inputs/InputTextV2";
import InputTextareaV2 from "@/components/UI/inputs/InputTextareaV2";
import InputFileV2 from "@/components/UI/inputs/InputFileV2";
import InputSearchPersonsV2 from "@/components/UI/inputs/InputSearchPersonsV2";
import InputCheckboxV2 from "@/components/UI/inputs/InputCheckboxV2";
import InputEditorV2 from "@/components/UI/inputs/InputEditorV2";
import InputSelectV2 from "@/components/UI/inputs/InputSelectV2";

export default {
  name: "InputGenerator",

  components: {
    InputTextV2,
    InputTextareaV2,
    InputFileV2,
    InputSearchPersonsV2,
    InputCheckboxV2,
    InputEditorV2,
    InputSelectV2,
  },

  props: {
    inputs: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      inputDataList: [],
    };
  },

  computed: {},

  methods: {
    getThisData(data) {
      const index = this.inputDataList.findIndex(
        (item) => item.name === data.name
      );

      index >= 0
        ? (this.inputDataList[index] = data)
        : this.inputDataList.push(data);

      this.$emit("getInputDataList", this.inputDataList);
    },

    // Событие есть не у всех инпутов. Добавляется по необходимости
    onChange(data) {
      this.$emit("onChange", data);
    },
  },

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss"></style>
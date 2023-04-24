<template>
  <div class="editable-input">
    <div class="editable-input__value" v-if="!editing" @click="openEdit">
      <slot></slot>
    </div>
    <template v-else>
      <imask-input
        class="editable-input__input"
        v-if="type === 'tel'"
        v-focus
        v-model="value"
        type="tel"
        :lazy="false"
        mask="+{7}(000)000-00-00"
      />

      <input
        class="editable-input__input"
        v-else-if="type === 'email'"
        v-focus
        v-model="value"
        type="email"
        :placeholder="placeholder"
      />

      <input
        class="editable-input__input"
        v-else
        v-focus
        v-model="value"
        type="text"
        @input="$emit('inputChange', value)"
        :placeholder="placeholder"
      />
    </template>
    <button
      class="editable-input__button"
      :class="{ 'editable-input__button--active': editing }"
      @click="change"
    >
      <UserIcons
        class="editable-input__button-icon"
        :iconName="editing ? 'check' : 'pen'"
      />
    </button>
  </div>
</template>

<script>
import { IMaskComponent } from "vue-imask";

export default {
  name: "EditableInput",

  components: { "imask-input": IMaskComponent },

  props: {
    type: {
      type: String,
      required: false,
      default: "",
    },

    placeholder: {
      type: String,
      required: false,
      default: "",
    },

    editingIsOpen: {
      type: Boolean,
      required: false,
    },
  },

  data() {
    return {
      value: "",
      editing: false,
    };
  },

  computed: {},

  methods: {
    openEdit() {
      this.editing = true;
    },

    closeEdit() {
      this.editing = false;
      this.value = "";
    },

    change() {
      if (this.editing) {
        this.$emit("saveChange", this.value);
      } else {
        this.openEdit();
      }
    },
  },

  watch: {
    editing() {
      this.$emit("changeEditing", this.editing);
    },

    editingIsOpen() {
      !this.editingIsOpen ? this.closeEdit() : null;
    },
  },
};
</script>

<style scoped lang="scss">
.editable-input {
  display: flex;
  align-items: center;

  // @include transition();

  @include hover {
    background-color: var(--gray100);
    box-shadow: 0 0 0 1px var(--gray300);

    .editable-input__button {
      opacity: 1;
    }
  }

  &__value {
    flex-grow: 1;
    padding: {
      top: var(--v-rhythm-2);
      bottom: var(--v-rhythm-2);
    }

    @extend .body-2;
    color: var(--gray900);

    cursor: pointer;
  }

  &__input {
    padding: var(--v-rhythm-2);

    flex-grow: 1;

    @extend .body-2;
    color: var(--gray900);
    font-size: 16px;

    border: none;
    box-shadow: 0 0 0 1px var(--red900);
    background-color: var(--white900);

    &::placeholder {
      color: var(--gray500);
    }
  }

  &__button {
    padding: var(--v-rhythm-2);

    flex-shrink: 0;

    // @include transition();
    cursor: pointer;
    opacity: 0;

    fill: var(--red900);

    &--active {
      opacity: 1;
      fill: var(--red900) !important;
    }

    @include no-hover {
      opacity: 1;
      fill: var(--gray300);
    }

    &:active {
      opacity: var(--active-opacity) !important;
    }

    &-icon {
      width: 24px;
      height: 24px;
    }
  }

  @include phones {
    &__value,
    &__input {
      padding-top: 6px;
      padding-bottom: 6px;
    }

    &__button {
      padding-top: var(--v-rhythm-1);
      padding-bottom: var(--v-rhythm-1);
    }
  }
}
</style>

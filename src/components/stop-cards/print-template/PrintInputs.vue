<template>
  <div class="input__wrapper">
    <div
      class="input"
      v-for="(input, i) in inputs"
      :key="i"
      v-bind:class="input.class"
    >
      <div class="input__name">{{ input.name }}</div>
      <div class="input__values" v-if="input.type === 'checkbox'">
        <div
          class="input__value"
          v-for="(item, i) in input.values"
          :key="i"
          v-bind:class="{ active: include(item, input.value) }"
        >
          <div class="checkbox"></div>
          {{ item }}
        </div>
      </div>
      <div class="input__values" v-else-if="input.type === 'text'">
        {{ input.value }}
      </div>
      <div class="input__values" v-else-if="input.type === 'file'">
        {{ fileNames(input.value) }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    inputs: null,
  },
  computed: {
    fileNames() {
      return (arr) => {
        let newArr = arr.map((item) => item.originalName);
        return newArr.join(", ");
      };
    },
  },
  methods: {
    include(value, values) {
      let tmp = [];

      for (let obj in values) {
        tmp.push(values[obj]);
      }
      return tmp.includes(value);
    },
  },
};
</script>

<style lang="scss" scoped>
.print {
  -webkit-print-color-adjust: exact;
}
.input {
  &__wrapper {
    margin-top: 20px;
    display: flex;
    flex-wrap: wrap;
    border: 2px solid #ebeff4;
  }
  &__name {
    -webkit-print-color-adjust: exact;
    padding: 8px 10px 7px;
    background-color: var(--gray700);
    color: #fff;
    font-weight: 700;
    font-size: 10px;
    line-height: 15px;
    width: 100%;
  }
  &__values {
    padding: var(--v-rhythm-2) 10px;
    word-break: break-all;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
  }
  &__value {
    display: flex;
    padding-top: 5px;
    &.active {
      .checkbox {
        -webkit-print-color-adjust: exact;
        opacity: 1;
        border: var(--red900);
        // background: red;
        background-image: url("data:image/svg+xml,%3Csvg width='18' height='18' viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M16 0H2C0.9 0 0 0.9 0 2V16C0 17.1 0.9 18 2 18H16C17.1 18 18 17.1 18 16V2C18 0.9 17.1 0 16 0ZM7.71 13.29C7.32 13.68 6.69 13.68 6.3 13.29L2.71 9.7C2.32 9.31 2.32 8.68 2.71 8.29C3.1 7.9 3.73 7.9 4.12 8.29L7 11.17L13.88 4.29C14.27 3.9 14.9 3.9 15.29 4.29C15.68 4.68 15.68 5.31 15.29 5.7L7.71 13.29Z' fill='%23AB052D'/%3E%3C/svg%3E%0A");
      }
    }
  }
  &.small {
    width: 50%;
    height: 156px;
    &:nth-child(2n) {
      border-left: 2px solid #ebeff4;
    }
  }
  &.medium {
    width: 100%;
    height: 200px;
  }
  &.half {
    width: 100%;
    height: 260px;
    overflow: hidden;
    .input__values {
      -webkit-line-clamp: 11;
    }
  }
  &.full {
    width: 100%;
    height: 540px;
    overflow: hidden;
    .input__values {
      -webkit-line-clamp: 25;
    }
  }
}
.checkbox {
  height: 18px;
  width: 18px;
  position: relative;
  border: 2px solid var(--gray500);
  border-radius: 2px;
  background-position: center;
  background-repeat: no-repeat;
  background: none;
  transition: 0.3s background ease, 0.3s border ease;
  margin-right: 8px;
}
</style>


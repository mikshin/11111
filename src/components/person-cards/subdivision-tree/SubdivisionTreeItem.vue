<template>
  <div class="subdivision-tree-item">
    <span class="subdivision-tree-item__division-name">{{ dataObj.NAME }}</span>
    <router-link
      class="subdivision-tree-item__link"
      :to="`/lk?=${dataObj.HEAD.ID}`"
      v-if="dataObj.HEAD"
    >
      <span class="subdivision-tree-item__full-name">{{
        dataObj.HEAD.FULL_NAME
      }}</span>
      <span class="subdivision-tree-item__profession">{{
        dataObj.HEAD.UF_WORK_POSITION
      }}</span>
    </router-link>
    <div
      :class="{
        'subdivision-tree-item__inner-division': isHidden,
      }"
    >
      <button
        class="subdivision-tree-item__more-btn"
        v-if="isHidden"
        @click="$emit('showMore')"
      >
        {{ btnShowMore }}
      </button>

      <SubdivisionTreeItem
        class="subdivision-tree-item__inner-division"
        v-if="dataObj.CHILD"
        :dataObj="dataObj.CHILD"
        :numberHiddenDivisions="numberHiddenDivisions"
      />
    </div>
  </div>
</template>

<script>
import { sklonenie } from "@/assets/scripts/scripts.js";

export default {
  name: "SubdivisionTreeItem",

  components: {},

  props: {
    dataObj: {
      type: Object,
      required: true,
    },

    numberHiddenDivisions: {
      type: Number,
      required: true,
    },

    isHidden: {
      type: Boolean,
      required: false,
    },
  },

  data() {
    return {};
  },

  computed: {
    btnShowMore() {
      return `Показать ещё ${this.numberHiddenDivisions} ${sklonenie(
        this.numberHiddenDivisions,
        ["уровень", "уровня", "уровней"]
      )}...`;
    },
  },

  methods: {},

  mounted() {},
};
</script>

<style lang="scss" scoped>
.subdivision-tree-item {
  &__division-name {
    display: block;

    color: var(--gray900);
    @extend .subtitle-2;
  }

  &__link {
    margin-top: var(--v-rhythm-1);

    display: flex;
    flex-direction: column;

    color: var(--gray700);
    @include font(14px, 20px);
    font-style: italic;

    @include transition();

    @include hover {
      .subdivision-tree-item__full-name {
        color: var(--red900);
      }
    }

    &:active {
      opacity: var(--active-opacity);
    }
  }

  &__full-name {
  }

  &__profession {
  }

  &__inner-division {
    position: relative;

    padding-top: var(--v-rhythm-4);
    padding-left: var(--v-rhythm-12);

    &::before {
      content: "";

      position: absolute;
      top: 7px;
      left: 0;

      width: 32px;
      height: 24px;

      border-left: 2px solid var(--red900);
      border-bottom: 2px solid var(--red900);
    }
  }

  &__more-btn {
    @extend .subtitle-2;
    color: var(--red900);

    @include transition();

    &:active {
      opacity: var(--active-opacity);
    }
  }

  @include phones {
    &__link {
      @include font(12px, 16px);
    }

    &__inner-division {
      padding-top: var(--v-rhythm-3);
      padding-left: var(--v-rhythm-9);

      &::before {
        width: 21px;
        height: 16px;
      }
    }
  }
}
</style>

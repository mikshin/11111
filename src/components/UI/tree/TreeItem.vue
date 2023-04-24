<template>
  <li class="tree-item">
    <div
      class="tree-item__btn"
      :class="{ 'tree-item__btn--active': activeItem.ID === item.ID }"
    >
      <div
        class="tree-item__wrap-icon"
        :class="{ 'tree-item__wrap-icon--open': isOpen }"
        v-if="item.HAS_CHILD"
      >
        <UserIcons
          class="tree-item__icon"
          :iconName="isOpen ? 'control-minus' : 'control-plus'"
          @eventClick="openInnerList"
        />
      </div>
      <span class="tree-item__text" @click="$emit('toggleActive', item)">{{
        item.NAME
      }}</span>
    </div>
    <ul
      class="tree-item__inner-list"
      :class="{ loading: isLoading }"
      v-if="isOpen"
    >
      <tree-item
        class="tree-item__inner-item"
        v-for="treeItem in treeData"
        :key="treeItem.ID"
        :item="treeItem"
        :activeItem="activeItem"
        @toggleActive="(e) => $emit('toggleActive', e)"
      ></tree-item>
    </ul>
  </li>
</template>

<script>
import axios from "axios";

export default {
  name: "TreeItem",

  components: {},

  props: {
    item: {
      type: Object,
      required: true,
    },
    activeItem: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      treeData: [],

      isOpen: false,

      isLoading: false,
    };
  },

  computed: {},

  methods: {
    async fetchTreeData() {
      try {
        this.isLoading = true;
        const response = await axios({
          method: "get",
          url: `/mobileapp/api/orgstructure/?sectionId=${this.item.ID}`,
        });
        const values = Object.values(response.data);
        values.forEach((value) => {
          this.treeData.push(value);
        });
      } catch {
        this.treeData = [];
      } finally {
        this.isLoading = false;
      }
    },

    openInnerList() {
      this.treeData.length === 0 ? this.fetchTreeData() : null;
      this.isOpen = !this.isOpen;
    },
  },
};
</script>

<style lang="scss" scoped>
// !TODO сделать рефакторинг, сделать мобильные стили
.tree-item {
  &__btn {
    position: relative;

    display: flex;
    gap: var(--v-rhythm-2);
    padding: var(--v-rhythm-2) var(--v-rhythm-3);

    @extend .body-2;
    color: var(--gray900);

    background-color: var(--white900);

    user-select: none;

    &::before {
      content: "";

      position: absolute;
      top: 0;
      right: 0;

      height: 100%;
      width: 1376px;
    }

    @include hover {
      &::before {
        background-color: var(--gray100);
      }

      .tree-item__wrap-icon,
      .tree-item__text {
        background-color: var(--gray100);
      }
    }

    &--active {
      &::before {
        background-color: var(--gray100);
      }

      .tree-item__wrap-icon,
      .tree-item__text {
        background-color: var(--gray100);
      }

      .tree-item__text {
        @extend .subtitle-2;
        color: var(--red900);
      }
    }
  }

  &__icon,
  &__text {
    position: relative;
    z-index: 1;

    cursor: pointer;

    &:active {
      opacity: var(--active-opacity);
    }
  }

  &__wrap-icon {
    position: relative;
    z-index: 1;

    line-height: 1;
    font-size: 0;

    background-color: var(--white900);

    &--open {
      &::before {
        content: "";

        position: absolute;
        top: 24px;
        left: 11px;

        width: 2px;
        height: calc(100% - 24px + 8px);
        border-left: 2px dotted var(--gray300);
      }
    }
  }

  &__icon {
    width: 24px;
    height: 24px;
    flex-shrink: 0;

    fill: var(--red500);
  }

  &__text {
    flex-grow: 1;
    padding-left: 4px;

    background-color: var(--white900);

    @include hover {
      color: var(--red900);
    }
  }

  &__inner-list {
    padding-left: 23px;
  }

  &__inner-item {
    position: relative;

    &::after {
      content: "";

      position: absolute;
      top: 2px;
      left: 0px;

      width: 2px;

      border-left: 2px dotted var(--gray300);
    }

    &:not(:last-child) {
      &::after {
        bottom: 0;
      }
    }

    &:last-child {
      &::after {
        height: 18px;
      }
    }

    &::before {
      content: "";

      position: absolute;
      top: 19px;
      left: 3px;
      z-index: 1;

      width: 16px;
      height: 2px;

      border-bottom: 2px dotted var(--gray300);
    }
  }
}
</style>

<template>
  <ul class="tabs-nav" :class="{ 'tabs-nav--additionally': isAdditionally }">
    <li class="tabs-nav__item" v-for="item in tabs" :key="item.name">
      <button
        class="tabs-nav__link"
        :class="{ 'tabs-nav__link--active': activeTab.name === item.name }"
        @click="changeTab(item)"
      >
        {{ item.name }}
        <SimpleTooltip
          class="tabs-nav__link-tooltip"
          :iconName="'info'"
          :content="item.tooltip"
          v-if="item.tooltip"
        />
        <span class="tabs-nav__link-counter" v-if="item.counter > 0">{{
          counter(item.counter)
        }}</span>
      </button>
    </li>
  </ul>
</template>

<script>
import SimpleTooltip from "@/components/UI/tooltip/SimpleTooltip.vue";

export default {
  name: "TabsNav",

  components: {
    SimpleTooltip,
  },

  props: {
    tabs: {
      type: Array,
      required: true,
    },

    activeTabObj: {
      type: Object,
      required: false,
      default: function () {
        return null;
      },
    },

    isAdditionally: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  data() {
    return {
      activeTab: {},
    };
  },

  mounted() {
    this.updateActiveTab();
  },

  computed: {},

  methods: {
    counter(count) {
      return count > 99 ? "99+" : count;
    },

    updateActiveTab() {
      this.$nextTick(() => {
        this.activeTabObj
          ? (this.activeTab = this.activeTabObj)
          : (this.activeTab = this.tabs[0]);

        this.emitActivTab();
      });
    },

    emitActivTab() {
      this.$emit("changeTab", this.activeTab);
    },

    changeTab(item) {
      if (this.activeTab != item) {
        this.activeTab = item;

        item.route ? this.$router.push(item.route) : null;

        this.emitActivTab();
      }

      this.$emit("clickTab", item);
    },
  },

  watch: {
    activeTabObj() {
      this.updateActiveTab();
    },
  },
};
</script>

<style lang="scss" scoped>
.tabs-nav {
  position: relative;

  display: flex;
  gap: var(--v-rhythm-6);
  overflow-x: auto;

  &::before {
    content: "";

    position: absolute;
    left: 0;
    bottom: 0;

    width: 100%;
    height: 2px;

    background-color: var(--gray300);
  }

  &__item {
    flex-shrink: 0;
  }

  &__link {
    position: relative;

    display: flex;
    align-items: center;
    gap: 8px;
    padding-bottom: 10px;

    @extend .body-2;
    color: var(--gray900);
    border-bottom: 2px solid transparent;
    text-align: left;

    cursor: pointer;
    @include transition();

    @include hover {
      color: var(--red900);
    }

    &:active {
      opacity: var(--active-opacity);
    }

    &--active {
      // в макете у активного таба font-weight: 700, но т.к. из-за этого дергается контент, то это не стали делать. В макете должны поправить.
      color: var(--red900);

      border-color: var(--red900);

      .tabs-nav__link-counter {
        background-color: var(--red900);
      }
    }
  }

  &__link-tooltip {
  }

  &__link-counter {
    width: 20px;
    height: 20px;

    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    @extend .overline;
    color: var(--white900);

    border-radius: 50%;
    background-color: var(--gray500);
    @include transition();
  }

  &--additionally {
    min-height: 44px;
    align-items: flex-end;
    gap: unset;

    &::before {
      display: none;
    }

    .tabs-nav {
      &__item {
        flex-grow: 1;
      }

      &__link {
        width: 100%;
        align-items: flex-end;
        justify-content: center;
        padding: var(--v-rhythm-3) var(--v-rhythm-2);

        @extend .caption-1;

        border-bottom: none;
        background-color: var(--gray300);

        @include hover {
          color: var(--white900);

          background-color: var(--red900);
        }

        &--active {
          padding-top: var(--v-rhythm-4);
          // в макете у активного таба font-weight: 700, но т.к. из-за этого дергается контент, то это не стали делать. В макете должны поправить.
          color: var(--white900);

          background-color: var(--red900);
          border-radius: 4px 4px 0px 0px;
        }
      }

      &__link-tooltip {
      }
    }
  }
}
</style>

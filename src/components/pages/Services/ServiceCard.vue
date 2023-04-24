<template>
  <div class="service_card__wrapper" @click="clickMethod(service.ID)">
    <div class="service_card__body">
      <span class="service_card__text">
        {{ service.NAME }}
      </span>
      <span class="service_card__circle">
        <UserIcons
          class="service_card__circle-icon"
          :iconName="'arrow-right'"
        />
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "ServiceCard",

  components: {},

  props: {
    service: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {};
  },

  computed: {},

  methods: {
    clickMethod(id) {
      this.$emit("modalShow", id);
    },
  },

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss">
.service_card {
  &__wrapper {
    height: 78px;
    background-color: var(--white900);
    border-radius: var(--v-rhythm-4);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 4px 4px 8px rgba(9, 0, 109, 0.1);
    @include transition();

    @include hover {
      background-color: var(--red300);

      .service_card__circle {
        background-color: var(--red900);
      }

      .service_card__circle-icon {
        fill: var(--white900);
      }
    }
  }
  &__body {
    display: flex;
    justify-content: space-between;
    width: 100%;
    align-items: center;
    padding: 0 var(--v-rhythm-4);
  }
  &__text {
    @extend .subtitle-2;
    color: var(--gray900);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  &__circle {
    width: 38px;
    height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    border-radius: 50%;
    border: 1px solid var(--red900);
    @include transition(background-color);
  }

  &__circle-icon {
    width: 20px;
    height: 20px;

    fill: var(--red900);
    @include transition(fill);
  }
}
</style>
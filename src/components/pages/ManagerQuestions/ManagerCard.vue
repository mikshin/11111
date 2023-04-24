<template>
  <div class="manager-card__wrapper">
    <SimplePicture
      class="manager-card__user-pic"
      :alt="manager.FULL_NAME"
      :src="manager.USER_PHOTO"
      @onClick="goToLink(manager.ID)"
      style="cursor: pointer"
    />
    <div class="manager-card__labels">
      <div class="manager-card__badge">отвечает</div>
      <VacationLabel class="manager-card__label" v-if="manager.VACATION" />
      <FiredLabel class="manager-card__label" v-else-if="manager.FIRED" />
    </div>

    <div class="manager-card__info-wrapper" @click="goToLink(manager.ID)">
      <div class="manager-card__name">
        {{ manager.FULL_NAME }}
      </div>
      <div class="manager-card__position">
        {{ manager.UF_WORK_POSITION }}
      </div>
    </div>
  </div>
</template>

<script>
import SimplePicture from "@/components/UI/SimplePicture.vue";
import VacationLabel from "@/components/UI/labels/VacationLabel.vue";
import FiredLabel from "@/components/UI/labels/FiredLabel.vue";

export default {
  name: "ManagerCard",

  components: {
    SimplePicture,
    VacationLabel,
    FiredLabel,
  },
  props: {
    manager: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {};
  },

  methods: {
    goToLink(id) {
      this.$router.push(`/lk?=${id}`);
    },
  },
};
</script>

<style scoped lang="scss">
.manager-card {
  &__wrapper {
    max-width: 320px;
    position: relative;
    width: 100%;
  }
  &__labels {
    position: absolute;
    top: var(--v-rhythm-4);
    left: var(--v-rhythm-4);

    display: flex;
    flex-direction: column;
    gap: var(--v-rhythm-2);
    align-items: flex-start;
  }
  &__badge {
    @extend .overline;

    background-color: var(--white900);
    border-radius: var(--v-rhythm-3);
    padding: 7px 8px 5px 8px;
  }
  &__label {
  }
  &__info-wrapper {
    cursor: pointer;
    background: var(--gray100);
    padding: var(--v-rhythm-4);
  }
  &__name {
    @extend .h3;
    margin-bottom: var(--v-rhythm-2);
  }
  &__position {
    @extend .body-2;
  }
}
@media (max-width: 768px) {
  .manager-card {
    &__wrapper {
      max-width: 100%;
    }
  }
}
</style>
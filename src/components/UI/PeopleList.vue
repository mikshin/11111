<template>
  <div class="people-list">
    <template v-if="peopleList.length > 0">
      <div
        class="people-list__link"
        v-for="(item, i) in peopleList"
        :key="i"
        @click="$emit('selectUser', item)"
      >
        <SimplePersonCard
          class="people-list__item"
          :avatar="{ alt: item.FULL_NAME, src: item.USER_PHOTO }"
          :fullName="item.FULL_NAME"
          :profession="item.UF_WORK_POSITION"
          :vacation="item.VACATION"
          :fired="item.FIRED"
        />
      </div>
      <div v-intersection="upload" v-if="!updataIsEnd"></div>
    </template>
    <div class="people-list__default" v-else>Ничего не найдено</div>
  </div>
</template>

<script>
import SimplePersonCard from "@/components/person-cards/SimplePersonCard.vue";

export default {
  name: "PeopleList",

  components: {
    SimplePersonCard,
  },

  props: {
    peopleList: {
      type: Array,
      required: true,
    },

    updataIsEnd: {
      type: Boolean,
      required: true,
    },
  },

  methods: {
    upload() {
      this.$emit("upload");
    },
  },
};
</script>

<style scoped lang="scss">
.people-list {
  padding: var(--v-rhythm-2) 0;
  max-height: 296px;
  overflow-y: auto;

  background-color: var(--white900);
  box-shadow: var(--boxShadowList), 0 0 0 2px var(--red500);

  &__link {
    padding: var(--v-rhythm-2) var(--v-rhythm-4);

    cursor: pointer;
    @include transition();

    @include hover {
      background-color: var(--gray100);
    }

    &:active {
      opacity: var(--active-opacity);
    }
  }

  &__item {
  }

  &__default {
    padding: var(--v-rhythm-2) var(--v-rhythm-4);

    @extend .body-2;
    color: var(--gray900);
  }
}
</style>

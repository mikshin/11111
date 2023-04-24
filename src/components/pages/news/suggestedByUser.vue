<template>
  <div class="user-info" v-if="data.NEWS_AUTHOR">
    <div class="user-info__heading">
      <span>Новость предоставлена пользователем</span>
    </div>
    <div>
      <router-link
        :to="'/lk?=' + data.NEWS_AUTHOR.ID"
        class="user-info__fio"
        tag="h4"
        v-html="data.NEWS_AUTHOR.FULL_NAME"
      >
      </router-link>
    </div>
    <div class="user-info__department">
      <span
        class="user-info__about-company"
        v-if="data.NEWS_AUTHOR.COMPANY_NAME"
        v-html="data.NEWS_AUTHOR.COMPANY_NAME"
      ></span>
      <span
        class="user-info__about-company"
        v-if="data.NEWS_AUTHOR.DEPARTMENTS"
        v-html="data.NEWS_AUTHOR.DEPARTMENTS"
      ></span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
    },
  },
};
</script>

<style lang="scss" scoped>
.user-info {
  border-top: 1px solid var(--gray500);

  .user-info__heading span {
    color: var(--gray500);
    font-size: 12px;
    text-transform: none;
    font-weight: 500;
    margin-bottom: var(--v-rhythm-1);
    display: inline-block;
  }

  &__fio {
    margin-bottom: 2px;
    font-size: 12px;
    &:hover {
      color: var(--red900);
    }
  }

  &__department {
    display: flex;
    flex-direction: column;

    .user-info__about-company {
      color: var(--gray900);
      font-size: 12px;
      line-height: 12px;
      text-transform: none;
      font-weight: 500;
      margin-bottom: var(--v-rhythm-1);
    }
  }
}
</style>
<template>
  <router-link class="app-logo" to="/">
    <img class="app-logo__img" src="~@/assets/images/logo.svg" alt="" />
  </router-link>
</template>

<script>
export default {
  name: "AppLogo",
};
</script>

<style scoped lang="scss">
.app-logo {
  width: 292px;
  height: 36px;
  display: block;

  &__img {
    width: 100%;
    height: 100%;
    object-position: center;
    object-fit: contain;
  }
}
</style>

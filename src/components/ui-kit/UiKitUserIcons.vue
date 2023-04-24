<template>
  <div class="ui-kit-user-icons">
    <UserIcons :iconName="iconName" />
    <span class="ui-kit-user-icons__name">{{ iconName }}</span>
  </div>
</template>

<script>
export default {
  name: "UiKitUserIcons",
  props: {
    iconName: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped lang="scss">
.ui-kit-user-icons {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>

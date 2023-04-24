<template>
  <svg class="user-icons" @click="$emit('eventClick')">
    <use :xlink:href="iconPath"></use>
  </svg>
</template>

<script>
export default {
  name: "UserIcons",
  props: {
    iconName: {
      type: String,
      required: true,
    },
  },

  computed: {
    iconPath() {
      return `/img/icons/sprites/user-icons.svg?1#${this.iconName}`;
    },
  },
};
</script>

// атрибут scoped не ставить, иначе эти стили будут подключаться ниже стилей того компонента, внутри которого он вызывается.
<style lang="scss">
.user-icons {
  --icon-size: 24px;

  width: var(--icon-size);
  height: var(--icon-size);
  display: block;
}
</style>
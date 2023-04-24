<template>
  <ul class="breadcrumbs">
    <li class="breadcrumbs__item" v-for="(item, i) in breadcrumbs" :key="i">
      <template v-if="i !== breadcrumbs.length - 1">
        <router-link
          class="breadcrumbs__link"
          v-if="item.path"
          :to="item.path"
          :title="item.name"
        >
          {{ item.name }}
        </router-link>

        <div class="breadcrumbs__link breadcrumbs__link--plug" v-else>
          {{ item.name }}
        </div>

        <UserIcons class="breadcrumbs__item-icon" :iconName="'arrow-right'" />
      </template>

      <span class="breadcrumbs__current" v-else>{{ item.name }}</span>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    dopName: null,
    anotherName: {
      type: String,
      required: false,
      default: "",
    },

    fullPath: {
      type: Array,
      required: false,
    },
  },

  data() {
    return {};
  },
  methods: {
    getRouterData(n) {
      console.log(n);
    },
  },
  computed: {
    breadcrumbs() {
      const breadcrumbs = [
        {
          name: "Главная",
          path: "/",
        },
      ];

      if (this.fullPath) {
        return [...breadcrumbs, ...this.fullPath];
      } else {
        let curRoutes = this.$route.matched[0].path.split("/");
        if (curRoutes.length > 2) {
          curRoutes.splice(0, 1);
          curRoutes.splice(curRoutes.length - 1, 1);

          let routes = this.$router.options.routes;
          let path = "";
          let routePath = "";
          let i = 0;

          for (let curRoute of curRoutes) {
            path += "/" + curRoute;

            for (let route of routes) {
              if (path === route.path) {
                routePath += "/" + this.$route.path.split("/")[i + 1];
                i++;

                breadcrumbs.push({
                  name: route.name,
                  path: routePath,
                });

                break;
              }
            }
          }
        }
        if (this.anotherName) {
          breadcrumbs.push({
            name: this.anotherName,
            path: this.$route.path,
          });
        } else if (this.dopName) {
          breadcrumbs.push({
            name: this.$route.name + this.dopName,
            path: this.$route.path,
          });
        } else {
          breadcrumbs.push({
            name: this.$route.name,
            path: this.$route.path,
          });
        }
      }

      return breadcrumbs;
    },
  },

  mounted() {},
};
</script>

<style lang="scss" scoped>
.breadcrumbs {
  // Потом убрать
  margin-bottom: var(--v-rhythm-6);

  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--v-rhythm-2);

  &__item {
    display: flex;
    align-items: center;
    gap: var(--v-rhythm-2);
  }

  &__link {
    @extend .caption-1;
    color: var(--gray900);
    white-space: nowrap;
    word-break: break-word;

    max-width: calc(80vw);
    overflow: hidden;
    text-overflow: ellipsis;

    &:not(.breadcrumbs__link--plug) {
      cursor: pointer;

      @include transition(opacity);

      &:active {
        opacity: var(--active-opacity);
      }
    }
  }

  &__item-icon {
    flex-shrink: 0;
    width: 16px;
    height: 16px;

    fill: var(--gray900);
  }

  &__current {
    @extend .caption-2;
    color: var(--gray500);
    word-break: break-word;
  }
}
</style>

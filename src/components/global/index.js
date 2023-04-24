import UserIcons from "./UserIcons";
import AppButtons from "./AppButtons";
import { TippyComponent } from "vue-tippy";
TippyComponent.name = "tippy";
import "tippy.js/themes/light.css";

import vSelect from "vue-select";
vSelect.name = "v-select";

export default [UserIcons, AppButtons, TippyComponent, vSelect];

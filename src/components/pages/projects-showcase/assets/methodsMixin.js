export const methodsMixin = {
  data() {
    return {
      projectMembersSelect: [],
    };
  },
  methods: {
    closePopup() {
      this.startFinishErrors = [];
      this.usersErrors = [];
      this.keyIntervarError = true;
      this.objArr = [];
      this.projectMembers.length = 1;
      this.controlPoints.length = 1;
      this.$emit("onClose");
    },
    onValid(data) {
      this.isFormValid = data.data;
    },
    getDataForm() {
      this.modifyArrayData();
      let form = new FormData();
      this.data ? form.append("ID", this.data.ID) : null;

      for (let child in this.$refs.form.$children) {
        let item = this.$refs.form.$children[child];

        if (item.files) {
          if (item.input.type === "file") {
            const filesArr = [];
            item._data.files.forEach((i) => {
              const newName = /\s/g.test(i.name)
                ? i.name.trim().replace(/\s/g, "_")
                : i.name;
              filesArr.push(new File([i], newName, { type: i.type }));
            });
            for (let k = 0; k < filesArr.length; k++) {
              form.append(`params${item.input.name}`, filesArr[k]);
            }
          }
        }
        if (item.newValue) {
          if (item.input.type === "date") {
            form.append(`params${item.input.name}`, item.newValue);
          } else if (item.input.type === "search-persons") {
            for (let val in item.newValue) {
              form.append(`members${item.input.name}`, item.newValue[val].ID);
            }
          } else {
            if (
              typeof item.newValue === "object" ||
              Array.isArray(item.newValue)
            ) {
              if (item.input.name.includes("ROLE_ID")) {
                form.append(`members${item.input.name}`, item.newValue["code"]);
              } else {
                form.append(`params${item.input.name}`, item.newValue["code"]);
              }
            } else {
              form.append(`params${item.input.name}`, item.newValue);
            }
          }
        }
      }

      return form;
    },

    AddControlPoint(e) {
      e.preventDefault();
      const random = this.getRandomId();
      this.controlPoints.push([
        {
          type: "date",
          placeholder: "Дата контрольной точки",
          name: `[KEY_POINT][n${random}][VALUE]`,
        },
        {
          type: "text",
          placeholder: "Название контрольной точки проекта",
          name: `[KEY_POINT][n${random}][DESCRIPTION]`,
          maxLength: 80,
        },
      ]);
    },

    DeleteControlPoint($event, i, name) {
      $event.preventDefault();
      this.controlPoints.splice(i, 1);

      let id = name.substring(12);
      id = id.substring(0, id.indexOf("]"));
      let deleteIndex = this.keyArr.findIndex((keyObj) => {
        return keyObj.key == id;
      });
      this.keyArr.splice(deleteIndex, 1);
      this.validateDate("[ACTIVE_FROM]");
    },

    modifyArrayData() {
      this.keyArr = this.keyArr.sort(function (a, b) {
        if (
          a.date.split(".").reverse().join("") >
          b.date.split(".").reverse().join("")
        )
          return 1;
        if (
          a.date.split(".").reverse().join("") ==
          b.date.split(".").reverse().join("")
        )
          return 0;
        if (
          a.date.split(".").reverse().join("") <
          b.date.split(".").reverse().join("")
        )
          return -1;
      });

      this.keyArr.forEach((element, j) => {
        const key = element.key;

        this.controlPoints.forEach((controlEl) => {
          let valueName = controlEl[0].name;

          if (valueName.includes(key)) {
            controlEl[0].name = `[KEY_POINT][${j}][VALUE]`;
            controlEl[1].name = `[KEY_POINT][${j}][DESCRIPTION]`;
          }
        });
      });

      // for (let i = 0; i < this.controlPoints.length; i++) {
      //   const element = this.controlPoints[i];

      //   for (let j = 0; j < element.length; j++) {
      //     const obj = element[j];
      //     j === 0 ? (obj.name = `[KEY_POINT][n${i}][VALUE]`) : null;
      //     j === 1 ? (obj.name = `[KEY_POINT][n${i}][DESCRIPTION]`) : null;
      //   }
      // }

      for (let i = 0; i < this.projectMembers.length; i++) {
        const element = this.projectMembers[i];

        for (let j = 0; j < element.length; j++) {
          const obj = element[j];
          j === 0 ? (obj.name = `[${i}][ROLE_ID]`) : null;
          j === 1 ? (obj.name = `[${i}][USER_ID]`) : null;
        }
      }
    },

    validateDate(e) {
      setTimeout(() => {
        this.startFinishErrors = [];
        this.keyIntervarError = true;
      }, 0);

      if (e === "[ACTIVE_FROM]") {
        this.dateStart = this.$refs[e][0].newValue;
      } else if (e === "[ACTIVE_TO]") {
        this.dateEnd = this.$refs[e][0].newValue;
      } else {
        let blockId = e.substring(12);
        blockId = blockId.substring(0, blockId.indexOf("]"));
        let dateRef = `[KEY_POINT][${blockId}][VALUE]`;
        let descRef = `[KEY_POINT][${blockId}][DESCRIPTION]`;
        let dateEl = this.$refs[dateRef][0];
        let descEl = this.$refs[descRef][0];
        let obj = {};

        let isInArr = this.keyArr.findIndex((keyObj) => {
          return keyObj.key == blockId;
        });

        obj.key = blockId;

        if (dateEl.newValue) {
          obj.date = dateEl.newValue;
        } else {
          obj.date = "";
        }

        if (descEl.newValue) {
          obj.description = descEl.newValue;
        } else {
          obj.description = "";
        }

        if (isInArr === -1) {
          this.keyArr.push(obj);
        } else {
          this.keyArr[isInArr] = obj;
        }
      }

      // Проверка дата начала < дата конца
      e === "[ACTIVE_FROM]"
        ? (this.dateStart = this.$refs[e][0].newValue)
        : null;
      e === "[ACTIVE_TO]" ? (this.dateEnd = this.$refs[e][0].newValue) : null;

      if (this.dateStart && this.dateEnd) {
        let dateStart = parseInt(
          this.dateStart.split(".").reverse().join(""),
          10
        );
        let dateEnd = parseInt(this.dateEnd.split(".").reverse().join(""), 10);

        if (dateEnd > 0 && dateStart > 0 && dateEnd <= dateStart) {
          setTimeout(() => {
            this.startFinishErrors.push(
              "Дата окончания проекта должна быть больше даты начала"
            );
          }, 0);
        } else if (this.dateEnd != "" && this.dateStart != "") {
          setTimeout(() => {
            this.keyIntervarError = false;
          }, 0);
        }

        // Проверка дата начала < контрольные точки < дата конца
        if (dateStart > 0 && dateEnd > 0) {
          this.keyArr.forEach((keyObj) => {
            let modifValue = parseInt(
              keyObj.date.split(".").reverse().join("")
            );

            if (modifValue - dateStart < 0) {
              setTimeout(() => {
                this.startFinishErrors.push(
                  "Ошибка. Дата начала проекта позже контрольной точки"
                );
              }, 0);
            } else if (dateEnd - modifValue < 0) {
              setTimeout(() => {
                this.startFinishErrors.push(
                  "Ошибка. Дата окончания проекта раньше контрольной точки"
                );
              }, 0);
            }
          });
        }
      }
    },

    validateUsers(e) {
      setTimeout(() => {
        this.usersErrors = [];
      }, 0);

      let blockId = e.substring(1);
      blockId = blockId.substring(0, blockId.indexOf("]"));
      let roleKey = `[${blockId}][ROLE_ID]`;
      let userKey = `[${blockId}][USER_ID]`;
      let roleEl = this.$refs[roleKey][0];
      let userEl = this.$refs[userKey][0];
      let roleArr = [];
      let userArr = [];
      let objRole = {};
      let objUser = {};

      let isInArr = this.objArr.findIndex((userObj) => {
        return userObj.id == blockId;
      });

      if (roleEl.newValue) {
        objRole.key = roleKey;
        objRole.value = roleEl.newValue.code;
      } else {
        objRole.key = roleKey;
        objRole.value = "";
      }

      if (userEl.newValue != null && userEl.newValue.length > 0) {
        objUser.key = userKey;
        objUser.value = userEl.newValue[0].ID;
      } else {
        objUser.key = userKey;
        objUser.value = "";
      }

      if (isInArr === -1) {
        this.objArr.push({ id: blockId, role: objRole, user: objUser });
      } else {
        this.objArr[isInArr] = { id: blockId, role: objRole, user: objUser };
      }

      for (let i = 0; i < this.objArr.length; i++) {
        const obj = this.objArr[i];
        obj.role.value != "" ? roleArr.push(obj.role.value) : null;
        obj.user.value != "" ? userArr.push(obj.user.value) : null;
      }

      let counter = 0;
      for (const el of roleArr) {
        if (el == 1) {
          counter++;
        }
        if (counter > 1) {
          setTimeout(() => {
            this.usersErrors.push(
              "Ошибка. У проекта может быть только один руководитель"
            );
          }, 0);
          break;
        }
      }
      if (counter === 0) {
        setTimeout(() => {
          counter = 0;
          this.usersErrors.push(
            "Ошибка. Необходимо указать руководителя проекта"
          );
        }, 0);
      }

      let userArrSet = new Set(userArr);
      if (userArrSet.size !== userArr.length) {
        setTimeout(() => {
          this.usersErrors.push(
            "Ошибка. Один человек может выполнять только одну роль в проекте"
          );
        }, 0);
      }
    },

    AddProjectMember(e) {
      let randomId = this.getRandomId();
      this.$emit("onChange", {
        data: this,
      });
      e.preventDefault();
      this.projectMembers.push([
        {
          type: "select",
          placeholder: "Роль",
          required: true,
          name: `[${randomId}][ROLE_ID]`,
          selectValue: this.projectMembersSelect,
        },
        {
          type: "search-persons",
          required: true,
          placeholder: "Пользователь",
          name: `[${randomId}][USER_ID]`,
          maxLength: 40,
          singleSelect: true,
        },
      ]);
    },

    DeleteProjectMember($event, i, name) {
      $event.preventDefault();
      this.projectMembers.splice(i, 1);

      let id = name.substring(1);
      id = id.substring(0, id.indexOf("]"));
      let deleteIndex = this.objArr.findIndex((userObj) => {
        return userObj.id == id;
      });
      this.objArr.splice(deleteIndex, 1);
      this.validateUsers("[0][ROLE_ID]");
    },

    getRandomId() {
      return Math.random().toString(36).substr(2, 19);
    },
  },

  computed: {
    currentUser() {
      return JSON.parse(localStorage.currentUser);
    },

    activePoints() {
      return this.controlPoints.length;
    },

    memberCount() {
      return this.projectMembers.length;
    },
  },
};

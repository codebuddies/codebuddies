import { Migrations } from "meteor/percolate:migrations";

Migrations.add({
  version: 1,
  name: "fontawesome",
  up() {
    Activities.update(
      { icon: "fa-sign-out" },
      { $set: { icon: "fa-sign-out-alt" } },
      { multi: true }
    );
    Notifications.update(
      { icon: "fa-trash-o" },
      { $set: { icon: "fa-trash-alt" } },
      { multi: true }
    );
    Notifications.update(
      { icon: "fa-pencil-square-o" },
      { $set: { icon: "fa-edit" } },
      { multi: true }
    );
  },
  down() {
    Activities.update(
      { icon: "fa-sign-out-alt" },
      { $set: { icon: "fa-sign-out" } },
      { multi: true }
    );
    Notifications.update(
      { icon: "fa-trash-alt" },
      { $set: { icon: "fa-trash-o" } },
      { multi: true }
    );
    Notifications.update(
      { icon: "fa-edit" },
      { $set: { icon: "fa-pencil-square-o" } },
      { multi: true }
    );
  }
});

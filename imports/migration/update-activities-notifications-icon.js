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

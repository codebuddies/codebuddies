// Bot uses comma separated values
// Ex: create hangout, tomorrow at 6 pm, YOUR HANGOUT TITLE

import Chrono from "chrono-node";

const Parser = {
  parse(message) {
    const segments = message
      .split(",")
      .map(item => item.trim())
      .filter(Boolean);
    if (!segments.length) return ActionsTable[0];
    const action = Parser.getAction(segments[0]);
    if (!action) return ActionsTable[0];

    if (action.command === "create hangout") {
      if (!segments[2] || !segments[1]) {
        action.reply = !segments[1]
          ? "Date is required for hangout. Try Again."
          : "Title is required for hangout. Try Again.";
        return action;
      }
      action.title = segments[2];
      action.date = Parser.getDate(segments[1]);
      if (!action.date) action.reply = "Date unrecognized, Try Again.";
    }
    return action;
  },

  getDate(text) {
    return Chrono.parseDate(text, new Date());
  },

  getAction(text) {
    return ActionsTable.find(
      item => text.toLowerCase().indexOf(item.command) > -1
    );
  }
};

export default Parser;

const ActionsTable = [
  {
    command: "help",
    reply: `Supported Actions: create hangout, list hangout.
      Try: "create hangout, tomorrow at 6 pm, YOUR HANGOUT TITLE"
    `
  },
  {
    command: "how are you?",
    reply: `I'm good.`
  },
  {
    command: "create hangout"
  },
  {
    command: "list hangout"
  }
];

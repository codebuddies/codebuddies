// Bot uses comma separated values
// Ex: create hangout, tomorrow at 6 pm, YOUR HANGOUT TITLE

import Chrono from "chrono-node";

const Parser = {
  parse(message) {
    const segments = message
      .split(",")
      .map(item => item.trim())
      .filter(Boolean);
    if (!segments.length) return Parser.getAction("help");
    const action = Parser.getAction(segments[0]);
    if (!action) return Parser.getAction("help");

    if (action.command === "create hangout") {
      console.log("DEBUG[Chrono] 1", message, segments);
      if (!segments[2] || !segments[1]) {
        action.reply = !segments[1]
          ? "Date is required for hangout. Try Again."
          : "Title is required for hangout. Try Again.";
        return action;
      }
      action.title = segments[2];
      action.date = Parser.getDate(segments[1]);
      console.log("DEBUG[Chrono] 2", action.date);
      if (!action.date) action.reply = "Date unrecognized. Please try Again.";
    }
    return action;
  },

  getDate(text) {
    const result = Chrono.parse(text, new Date(), { forwardDate: true });
    if (!result || !result.length || !result[0].start) return;
    const start = result[0].start.date();
    const end = result[0].end && result[0].end.date();
    return { start, end };
  },

  getAction(text) {
    const { command, reply } = ActionsTable.find(
      item => text.toLowerCase().indexOf(item.command) > -1
    );
    return { command, reply };
  }
};

export default Parser;

const ActionsTable = [
  {
    command: "help",
    reply: `Supported Actions: create hangout, list hangouts. Examples:
      "create hangout, tomorrow at 6 pm, YOUR HANGOUT TITLE"
      "create hangout, today from 9 to 10pm, teaching intermediate git for practice"
      "create hangout, next sunday from 7:30 to 9 pm, pairing on algorithms",
      "create hangout, in 2 hours, studying python from the Official Python tutorial"
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
    command: "list hangouts"
  }
];

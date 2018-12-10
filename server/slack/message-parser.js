// Bot uses comma separated values
// Ex: create hangout, tomorrow at 6 pm, YOUR HANGOUT TITLE

import Chrono from "chrono-node";

function removeFormatting(originalTopic) {
  let topic = ` ${originalTopic}`.slice(1);
  let idxOpen = topic.indexOf("<http");
  while (idxOpen !== -1) {
    let idxClose = topic.indexOf(">", idxOpen + 1);
    if (idxClose !== -1) {
      const urls = topic.substring(idxOpen + 1, idxClose);
      const idxBar = urls.indexOf("|");
      const url = idxBar !== -1 ? urls.substring(0, idxBar) : urls;
      const firstPart = topic.substring(0, idxOpen);
      const lastPart = topic.substring(idxClose + 1);
      topic = `${firstPart}${url}${lastPart}`;
    } else {
      return topic;
    }
    idxOpen = topic.indexOf("<http");
  }

  const charsToReplace = [{ from: "&lt;", to: "<" }, { from: "&gt;", to: ">" }, { from: "&amp;", to: "&" }];
  topic = charsToReplace.reduce((acc, tuple) => acc.split(tuple.from).join(tuple.to), topic);

  return topic;
}

const TOPIC_LEN = 300;
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
      if (!segments[2] || !segments[1]) {
        action.reply = !segments[1]
          ? "Date is required for hangout. Try Again."
          : "Title is required for hangout. Try Again.";
        return action;
      }
      action.title = segments[2];
      action.date = Parser.getDate(segments[1]);
      if (!action.date) action.reply = "Date unrecognized. Please try Again.";
    } else if (action.command === "til") {
      const [_, ...rest] = segments;
      const concatTopic = rest.join(", ").trim();
      const topic = removeFormatting(concatTopic);
      if (!topic) {
        action.reply = "Please share something you learned. Try Again.";
        return action;
      } else if (topic.length > TOPIC_LEN) {
        action.reply = `Please keep the message to no more than ${TOPIC_LEN} characters. Current length: ${
          topic.length
        }`;
        return action;
      }
      action.topic = topic;
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
    const { command, reply } = ActionsTable.find(item => text.toLowerCase().indexOf(item.command) > -1);
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
      "til, #Django crispy forms rocks! https://django-crispy-forms.readthedocs.io/en/latest/ #Python #WebDev"
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
  },
  {
    command: "til"
  }
];

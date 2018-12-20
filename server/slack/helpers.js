import Chrono from "chrono-node";

const Helpers = {
  getCommandAndSegments(message) {
    if (!message || !message.trim()) return {};

    const command = message
      .trim()
      .split(" ")[0]
      .toLowerCase();
    const segments = message
      .substr(command.length)
      .trim()
      .split(",")
      .map(item => item.trim())
      .filter(Boolean);

    return { command, segments };
  },

  getDate(text) {
    const result = Chrono.parse(text, new Date(), { forwardDate: true });
    if (!result || !result.length || !result[0].start) return {};
    const start = result[0].start.date();
    const end = result[0].end && result[0].end.date();
    return { start, end };
  },

  removeFormatting(originalTopic) {
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
};

export default Helpers;

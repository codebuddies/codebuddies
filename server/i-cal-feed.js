import moment from "moment";
import ics from "ics";

const iCalFeed = {
  handleRequest(params, req, res) {
    console.log("iCalFeed.handleRequest called");

    const hangouts = Hangouts.find({
      end: {
        $gte: moment()
          .subtract(1, "months")
          .toDate()
      }
    }).fetch();
    const events = hangouts.map(hangout => {
      return {
        productId: "codebuddies/ics",
        uid: hangout._id,
        title: hangout.topic,
        description: hangout.description + `\n${hangout.externalURL}`,
        start: moment
          .utc(hangout.start)
          .format("YYYY-M-D-H-m")
          .split("-"),
        end: moment
          .utc(hangout.start)
          .format("YYYY-M-D-H-m")
          .split("-"),
        organizer: {
          name: hangout.host && hangout.host.name,
          email: "noreply@codebuddies.org"
        },
        method: "REQUEST"
      };
    });

    const { error, value } = ics.createEvents(events);

    if (error) {
      console.log("iCalFeed.handleRequest Error:", error);
      res.statusCode = 500;
      return res.end();
    }

    res.statusCode = 200;
    res.setHeader("Content-type", "text/calendar;charset=UTF-8");
    res.write(value);
    res.end();
  }
};

export default iCalFeed;

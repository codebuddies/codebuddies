import { tweetLearning } from "../twitter/methods.js";

export default {
  addLearning: function(data) {
    const learning = {
      title: data.title,
      userId: data.user_id,
      username: data.username,
      created_at: new Date(),
      hangout_id: data.hangout_id,
      study_group_id: data.study_group_id,
      kudos: 0
    };

    try {
      const learning_id = Learnings.insert(learning);

      //tweet user learning
      if (data.optInTweet === true) {
        tweetLearning(learning);
      }
      return learning_id;
    } catch (e) {
      console.log("learning error", e.toString());
      return null;
    }
  }
};

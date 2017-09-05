import { $ }  from 'meteor/jquery';
import { chai } from 'meteor/practicalmeteor:chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Factory } from 'meteor/dburles:factory';



// cannot create hangout if not logged in
chai.should();

describe('CreateHangout', () => {

	beforeEach(function () {
    	resetDatabase();
  	});

  	Hangouts = new Mongo.Collection("hangouts");

	it('Store created hangout in the database', () => {

		let example_hangout = {
		  topic: "Discussion: Using Python for Research - Week 3 of EdX's HarvardX: PH526x",
		  slug: "discussion:-using-python-for-research---week-3-of-edx's-harvardx:-ph526x",
		  description: "In this meeting, we will be continuing our exploration of Python's data analysis\nlibraries through the \"Using Python for Research\" course offered by Harvard\nthrough EdX: https://www.edx.org/course/using-python-research-harvardx-ph526x\n\nDETAILS OF THIS MEETUP\n\nWe will finish working through the homework exercises for WEEK 3 of the course,\nspecifically Case Study 2 and Case Study 3 (Classication).\n\nNB: It is STRONGLY RECOMMENDED that participants finish the corresponding\n\"comprehension checks\" and lectures for Week 3 as we will be working\nthrough/discussing the homework for Week 3.\n\nDown the road, we hope this material will lead to free exploration of existing\npublic data sets and other fun projects. We hope you can join us as we work\ntowards this goal!",
		  description_in_quill_delta: {
		    ops: [
		      {
		        "insert": "In this meeting, we will be continuing our exploration of Python's data analysis libraries through the \"Using Python for Research\" course offered by Harvard through EdX: https://www.edx.org/course/using-python-research-harvardx-ph526x\nDETAILS OF THIS MEETUP\nWe will finish working through the homework exercises for WEEK 3 of the course, specifically Case Study 2 and Case Study 3 (Classication).\nNB: It is STRONGLY RECOMMENDED that participants finish the corresponding \"comprehension checks\" and lectures for Week 3 as we will be working through/discussing the homework for Week 3.\nDown the road, we hope this material will lead to free exploration of existing public data sets and other fun projects. We hope you can join us as we work towards this goal!\n\n"
		      }
		    ]
		  },
		  start: "2017-09-02T02:07:00.000Z",
		  end: "2017-09-03T02:07:00.000Z",
		  duration: 1440,
		  type: "silent",
		  host: {
		    id: "8iT63HQuAkq4gdP2N",
		    name: "linda",
		    avatar: "https://secure.gravatar.com/avatar/c347be2945fbc4f9a4a24f9f361d17d8.jpg?s=72&d=https%3A%2F%2Fa.slack-edge.com%2F66f9%2Fimg%2Favatars%2Fava_0015-72.png"
		  },
		  attendees: [
		    {
		      "id": "5qocx2ZpKf9nrap3H",
		      "name": "codebuddies",
		      "avatar": "https://avatars.slack-edge.com/2017-07-11/210945910657_1e4c9780f852d27b2018_72.jpg"
		    }
		  ],
		  users: [
		    "8iT63HQuAkq4gdP2N",
		    "5qocx2ZpKf9nrap3H"
		  ],
		  day_reminder_sent: true,
		  hourly_reminder_sent: true,
		  views: 122,
		  visibility: true,
		  created_at: "2017-08-29T02:07:13.222Z",
		  group: {
		    id: "F324WBABpmfcgM6yX",
		    title: "test number one",
		    slug: "test-number-one"
		  }
		}
		Hangouts.insert(example_hangout);
		var hangout = Hangouts.findOne(example_hangout._id);
		hangout.topic.should.not.be.undefined;
		hangout.description.should.not.be.undefined;
	});


});


// if logged in, when I click on button to create 
// what fields in the hangout form cannot be null
// Once I create a new hangout, DB should reflect the hangout
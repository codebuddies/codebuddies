Template.about.onCreated(function(){
  var title = "CodeBuddies | About";
  var metaInfo = {name: "description", content: "Our community spends a lot of time helping each other on Slack, but it's hard to schedule study times in advance in a chatroom, and it's also hard to know who else is online possibly working on the same thing at the same time. This website solves those issues."};
  DocHead.setTitle(title);
  DocHead.addMeta(metaInfo);
});

Template.about.onRendered(function(){
	$(function() {

    // Move to the top of the page on render
    var $window = $(window);
    if ($window.scrollTop() > 0) {
      $window.scrollTop(0);
    }

    Meteor.call('getImages', {}, function(err, data) {
      if (err) {
        console.error(err);
      } else {
        const countries = data.countries || [];
        const popupHtml = ($divContributors, contributors) => {
          contributors.forEach(c => {
            let title = `${c.title} `;
            if (c.twitter) {
              title += `<a href='${c.twitter}'><i class='fa fa-twitter'></i></a>`;
            }
            if (c.github) {
              title += `<a href='${c.github}' target='_blank'><i class='fa fa-github'></i></a>`;
            }
            if (c.blog) {
              title += `<a href='${c.blog}' target='_blank'><i class='fa fa-link'></i></a>`;
            }
            $divContributors.append(
              `<a rel="popover" class="user-popover" title="${title}" data-content="${c.content}" data-placement="top" data-toggle="popover">
                <img src="${c.img}" class="img-circle" alt="${c.alt}">
              </a>`, '\n');
          });
        }

        const $divflags = $('div.flags');
        countries.forEach(country => {
          $divflags.append(`<img src='${country}'>`, '\n');
        });

        popupHtml($('div.core-contributors'), data['core-contributors']);
        popupHtml($('div.code-contributors'), data['code-contributors']);

        const $divContributors = $('div.other-contributors');
        data['other-contributors'].forEach(c => {
          $divContributors.append(`<img src="${c.img}" class="img-circle" alt="${c.alt}" />`, '\n');
        });

    	  //$('a.user-popover').popover({ trigger: "hover", html: "true" });
    	  $('a.user-popover').each(function () {
            var $elem = $(this);
            $elem.popover({
                placement: 'top',
                trigger: 'hover',
                html: true,
                container: $elem,
                animation: false,
                title: 'Name goes here',
                content: 'This is the popover content. You should be able to mouse over HERE.'
            });
        });

        // display fallback image if image url of contributor is broken
        $('img.img-circle').on('error', function() {
           $(this).prop('src', '/images/unknown.png');
        });
      }
    });

	 });
});

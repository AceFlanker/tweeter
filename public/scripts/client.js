/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

const createTweetElement = function(tweetObj) {
  const userAvatar = $('<img>').addClass('tweet-avatar').attr('src', tweetObj.user.avatars);
  const userName = $('<span>').addClass('tweet-name').text(tweetObj.user.name);
  const headerDivLeft = $('<div>').addClass('header-left').append(userAvatar, userName);
  const userHandle = $('<span>').addClass('tweet-id').text(tweetObj.user.handle);
  const headerDivRight = $('<div>').addClass('header-right').append(userHandle);
  const tweetHeader = $('<header>').addClass('old-tweet').append(headerDivLeft, headerDivRight);

  const userTweet = $('<p>').addClass('old-tweet').append(document.createTextNode(tweetObj.content.text));

  const tweetDate = $('<span>').addClass('tweet-date').text(timeago.format(tweetObj.created_at));
  const footerDivLeft = $('<div>').addClass('footer-left').append(tweetDate);
  const footerDivRight = $('<div>').addClass('footer-right').html(`
    <a href=""><i class="fas fa-flag"></i></a>
    <a href=""><i class="fas fa-retweet"></i></a>
    <a href=""><i class="fas fa-heart"></i></a>
  `);
  const tweetFooter = $('<footer>').addClass('old-tweet').append(footerDivLeft, footerDivRight);
  const tweetArticle = $('<article>').addClass('old-tweet').append(tweetHeader, userTweet, tweetFooter);
  return tweetArticle;
}


const renderTweets = function(tweets) {
  const tweetSorted = tweets.sort((a, b) => {
    return b.created_at - a.created_at;
  }) 
  for (const tweet of tweetSorted) {
    $('.tweets-container').append(createTweetElement(tweet)); 
  }  
}

const tweetSubmit = function() {
  $('#tweet-text').submit(function(event) {
    event.preventDefault();
    const $tweetText = $('#tweet-text :input').val();
    if ($tweetText.length < 1) {
      if ($('.submit-error').text() !== 'Message cannot be empty') {
        $('.submit-error').hide().text('');
      }
      return $('.submit-error').text('Message cannot be empty').slideDown(750);
    }
    if ($tweetText.length > 140) {
      if ($('.submit-error').text() !== 'Message exceeds the maximum characters allowed') {
        $('.submit-error').hide().text('');
      }
      return $('.submit-error').text('Message exceeds the maximum characters allowed').slideDown(750);
    }
    // $('.submit-error').attr('style', 'display:none').text('');
    $('.submit-error').hide();
    const $data = $('#tweet-text :input').serialize();
    $.ajax({
      url: '/tweets',
      type: 'post',
      data: $data,
      success: function() {
        $('#tweet-text textarea').val('')
        $.ajax({
          url: '/tweets',
          type: 'get',
          dataType: 'json',
          success: function(data) {
            $('.new-tweet .counter').text(140);
            updateTweet(data);
          }
        })
      }
    })
  })
};

const updateTweet = function(data) {
  const tweetSorted = data.sort((a, b) => {
    return b.created_at - a.created_at;
  });
  $('.tweets-container').prepend(createTweetElement(tweetSorted[0]));
}

const loadTweets = function() {
  $.ajax({
    url: '/tweets',
    type: 'get',
    dataType: 'json',
    success: function(data) {
      renderTweets(data);
    }
  })
};
loadTweets();

const animateToggle = function() {
  $('.fa-angle-double-down').animate({
    bottom: '0.05em'
  }, 125, 'linear', function() {
    $('.fa-angle-double-down').animate({
      top: '0.1em'
    }, 250, 'linear', function() {
      $('.fa-angle-double-down').animate({
        bottom: '0.05em'
      }, 125, 'linear', function() {
        $('.fa-angle-double-down').attr('style', 'position:relative');
      }).promise().then(requestAnimationFrame(animateToggle));
    })
  })
}

const writeToggle = function() {
  $('.write-tweet').click(function() {
    $('section.new-tweet').slideToggle('slow');
    $('.new-tweet textarea').focus();
  })
}

$(document).ready(function() {
  tweetSubmit();
  animateToggle();
  writeToggle();
});


//// The code that enables the arrow animation

// const animateEnable = function() {
//   $('.write-tweet').hover(function() {
//     animateToggle();
//   }, function() {
//     $('.fa-angle-double-down').stop(true);
//   })
//   $('.write-tweet').mouseleave(function() {
//     $('.fa-angle-double-down').stop(true);
//   })
// };


//// User data JSON template for reference

// const data = [
//   {
//     "user": {
//       "name": "Newton",
//       "avatars": "https://i.imgur.com/73hZDYK.png"
//       ,
//       "handle": "@SirIsaac"
//     },
//     "content": {
//       "text": "If I have seen further it is by standing on the shoulders of giants"
//     },
//     "created_at": 1461116232227
//   },
//   {
//     "user": {
//       "name": "Descartes",
//       "avatars": "https://i.imgur.com/nlhLi3I.png",
//       "handle": "@rd" },
//     "content": {
//       "text": "Je pense , donc je suis"
//     },
//     "created_at": 1461113959088
//   }
// ];


//// Pure HTML code Insertion for reference

// const createTweetElement = function(tweetObj) {
//   const userName = tweetObj.user.name;
//   const userAvatar = tweetObj.user.avatars;
//   const userHandle = tweetObj.user.handle;
//   const tweetDate = timeago.format(tweetObj.created_at);
//   const $tweet = `
//     <article class="old-tweet">
//       <header class="old-tweet"> 
//         <div class="header-left">
//           <img class="tweet-avatar" src="${userAvatar}"></img>
//           <span class="tweet-name">${userName}</span>
//         </div>
//         <div class="header-right">
//           <span class="tweet-id">${userHandle}</span>
//         </div>
//       </header>
//       <p class="old-tweet"></p>
//       <footer class="old-tweet">
//         <div class="footer-left">
//           <span class="tweet-date">${tweetDate}</span>
//         </div>
//         <div class="footer-right">
//           <a href=""><i class="fas fa-flag"></i></a>
//           <a href=""><i class="fas fa-retweet"></i></a>
//           <a href=""><i class="fas fa-heart"></i></a>
//         </div>
//       </footer>
//     </article>`;
//   return $tweet;
// }
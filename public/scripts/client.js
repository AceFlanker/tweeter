/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
$(function() {
  tweetSubmit();
  animateToggle();
  writeToggle();
});

//// HTML Insertion
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

//// Displaying existing tweets
const renderTweets = function(tweets) {
  // Empting the "tweets-container" element
  $('.tweets-container').empty(); 
  // Populating the tweet list
  for (const tweet of tweets) {
    $('.tweets-container').prepend(createTweetElement(tweet)); 
  }  
}

//// Tweet Submission
const tweetSubmit = function() {
  $('#tweet-text').submit(function(event) {
    event.preventDefault();
    const $tweetText = $('#tweet-text :input').val();
    // Error message will be displayed upon an invalid submission
    if ($tweetText.length < 1) {
      // Error message will not go away if the same error is repeated upon submission
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
    // Any previous error message will go away upon a valid submission
    $('.submit-error').hide();
    // Converts message to JSON format
    const $data = $('#tweet-text :input').serialize();
    // POST submission
    $.post('/tweets', $data)
      .done(function() {
        // Empting the textarea input field
        $('#tweet-text textarea').val('');
        $.get('/tweets')
          .done(function(data) {
            // Word counter resets
            $('.new-tweet .counter').text(140);
            // Updates the list of tweets
            renderTweets(data);
          })
      })

    //// "Longhand" .ajax for reference
    // $.ajax({
    //   url: '/tweets',
    //   type: 'post',
    //   data: $data,
    //   success: function() {
    //     $('#tweet-text textarea').val('')
    //     $.ajax({
    //       url: '/tweets',
    //       type: 'get',
    //       dataType: 'json',
    //       success: function(data) {
    //         $('.new-tweet .counter').text(140);
    //         renderTweets(data);
    //       }
    //     })
    //   }
    // })
  })
};

//// Loads tweets from database and displays them
const loadTweets = function() {
  $.get('/tweets', function(data) {
    renderTweets(data);
  })
  //// "Longhand" .ajax for reference
  // $.ajax({
  //   url: '/tweets',
  //   type: 'get',
  //   dataType: 'json',
  //   success: function(data) {
  //     renderTweets(data);
  //   }
  // })
};

//// Initial injection of tweets into HTML
loadTweets();

//// The "Write a new tweet" button on the nav bar
const writeToggle = function() {
  $('.write-tweet').click(function() {
    $('section.new-tweet').slideToggle('slow');
    $('.new-tweet textarea').focus();
  })
}

//// Floating arrows animation on the nav bar
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


//// The code that enables the arrow animation upon a mouse over

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
//// NOTE: 

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
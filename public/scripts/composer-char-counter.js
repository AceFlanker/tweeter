$(function() {
  wordCounter();
});

const wordCounter = function() {
  const $inputfield = $('#tweet-text');
  $inputfield.on('input', function() {
    const $counter = 140 - $('textarea', this).val().length;
    if ($counter < 0) {
      $('.counter', this).css('color', 'red');
    } else {
      $('.counter', this).css('color', '');
    }
    $('.counter', this).text($counter);
  });
};

//// Pure Vanilla JavaScript Version for Reference

// document.addEventListener('DOMContentLoaded', function(e) {
//   const inputfield = document.querySelector('#tweet-text');
//   inputfield.addEventListener('input', function(event) {
//     const counter = 140 - event.target.value.length;
//     if (counter < 0) {
//       this.querySelector('.counter').style.color = 'red';
//     } else {
//       this.querySelector('.counter').style.color = '';
//     }
//     inputfield.querySelector('.counter').innerText = counter;
//   });
// })
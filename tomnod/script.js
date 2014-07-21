$(document).ready(function(){
  console.log('Initiated!');
  OpenBadges.issue(['http://www.example.com', '127.0.0.1'], function(errors, successes) { 
  	console.log(errors);
  });
});
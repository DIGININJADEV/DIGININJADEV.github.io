$(document).ready(function(){
  console.log('Initiated!');
  OpenBadges.issue(['http://digininjadev.github.io/tomnod/1.json'], function(errors, successes) { 
  	console.log(errors);
  	console.log(successes);
  });
});
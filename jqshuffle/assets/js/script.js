$(document).ready(function () {
	
	var container = $("#container");
    
    var stopParsing = false,
    $allFeelings = [],
    $allSentences = [],
    $feelingsArr = [],
    feelingsObj = {};
    
    parseWeFeelFine('all');
    
    index = 0;
    

    function shuffleText(feelings){
        if(index < feelings.length){
        console.log('Shuffling: '+feelings[index]);
        container.shuffleLetters({
			"text": feelings[index]
		});
        setTimeout(function(){
            shuffleText(feelings); 
        },1000);
        index++;
        }
    }
    
    function parseWeFeelFine(feeling){
		
		$class = '.' + feeling;

		$.getJSON( "http://127.0.0.1:50076/wefeelfine.xml", function( data ) {
		var items = [];
		for(i=0;i<data.length;i++){
			var feeling = JSON.parse(data[i]);
			var tempObj = {};
			tempObj.id = i,
			tempObj.feeling = feeling.sentence.charAt(0).toUpperCase() +feeling.sentence.slice(1),
			tempObj.gender = feeling.gender,
			tempObj.country = feeling.country,
			tempObj.city = feeling.city,
			tempObj.sentence = feeling.sentence;
			items.push(tempObj);
		}
			parseFeelings(items,feeling);
		});
		
	}
    
    function parseFeelings(JSON,setClass){
		$classNameOnly = setClass;
		$catName = $classNameOnly;		
		//$('#feeds').append('<ul id="feedList" class="'+$classNameOnly+'"></ul>');
		for(i=0;i<JSON.length;i++){
           
			  feeling = JSON[i].feeling;
				$allSentences.push(JSON[i].sentence);
				$allFeelings.push(JSON[i].feeling);
				$feelingsArr.push(1);
				$fontSize = feelingsObj[feeling];
				
			
		}
		
		//console.log($allSentences);
		
		$matchCount = [];
		$uniqueFeelings = unique($allFeelings);
		console.log($uniqueFeelings.length);
		for(i=0;i<$uniqueFeelings.length;i++){
			$feeling = $uniqueFeelings[i];
			count = 0;
			for(x=0;x<$allFeelings.length;x++){
				if($allFeelings[x] == $feeling){
					count++;	
				}
			}
			$matchCount.push($feeling+':'+count);
		}
		
		console.log($matchCount);
		
		//console.log($matchCount);
		for(i=0;i<$matchCount.length;i++){
			$feelingName = $matchCount[i].split(':');
			if($feelingName[0] != ''){
				$currentFeeling = $feelingName[0];
				//console.log($feelingName);
				feelingsObj[$currentFeeling] = $feelingName[1];
			}
		}
		
	
		for(i=0;i<$uniqueFeelings.length;i++){
			currentFeeling = $uniqueFeelings[i];
		}
		
		
		$fontTypes = [
			"'Indie Flower', cursive",
			"'Droid Sans', sans-serif",
			"'Shadows Into Light', cursive",
			"'Inconsolata'",
			"'Permanent Marker', cursive",
			"'Crafty Girls', cursive",
			"'Josefin Sans', sans-serif",
			"'Noticia Text', serif",
			"'Chewy', cursive"
		];
		
		shuffle($uniqueFeelings);
        shuffleText($uniqueFeelings);
		
		
				
    }
    
    function shuffle(array) {
    var currentIndex = array.length
        , temporaryValue
        , randomIndex
        ;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
	}
    function unique(list) {
    var result = [];
    $.each(list, function(i, e) {
    if ($.inArray(e, result) == -1) result.push(e);
    });
      return result;
	}
});


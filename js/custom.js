
var winW,
	winH,
	winS = $(window).scrollTop(),
	isMobile = false,
	isTablet = false,
	tabletThr = 1024,				// tablet threshold
	mobileThr = 720,				// mobile threshold
	header,							  // header
	hH = 56,						  // header height
	pR = 4,             // paralax ratio
	displaySubmenu = true,	// display submenu
	closeNavSidebar = false, // Close Sidebar Navigation					
	maxSliderCycles = 1,   // Max Background Image Slider Cycles
	autoplaySlider = false, // If True, Automatically Starts Main Image Slider 
	autoplayPortfolio = true, // If True, Automatically Starts Portfolio Slider
  swipeOpenNav = true,      // Open Sidebar Navigation on Mobile Device Swipe
	currentIndex = 0,
	reloadOnResize = true;

$.ajaxSetup({ cache: false }); // Prevents caching

// jQ Easing extension

jQuery.easing.swing = jQuery.easing.swing;
jQuery.extend( jQuery.easing, {
	def: 'easeOutQuad',
	swing: function (x, t, b, c, d) {
		//alert(jQuery.easing.default);
		return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
	},
	easeInExpo: function (x, t, b, c, d) {
		return (t===0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
	},
	easeOutExpo: function (x, t, b, c, d) {
		return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
	},
	easeInOutExpo: function (x, t, b, c, d) {
		if (t===0) return b;
		if (t==d) return b+c;
		if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
		return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
	}
});

function initOnLoad() {
	
	adjustContent();
	slideSwitcher( $("#testimonials") );
	formActionHandler( $("#contact-form"), "php/sendmail.php" );
	if ( !isMobile ) { buildBGParalax( $(".bg-paralax-fx") ); }
	buildNavigation( $("#header-nav") );
}

function goGA( event, category, label ) {
	
	// Checking if Analytics is enabled
	if ( typeof(ga) == "function" ) { ga('send', 'event', category, event, label); }
	else { console.log( "goGA: Google Analytics was not initialized properly." ); }
	
}

function initOnReady() {
	
	header = $("#main-header");
	portfolioHeader = $("#portfolio-main-header");
	buildSubmenu();
	buildSlider();
	buildPortfolio();
}

$(document).on({
	ready: function(){
		initOnReady();
	}
});

$(window).on({

	load: function(){
		initOnLoad();
	},
	
	scroll: function(){
		// winS stores distance in px to top, resets to 0				
		winS = $(window).scrollTop();
		if ( winS >= 100 ) {
			header.addClass("compact"); 
			portfolioHeader.addClass("compact"); 
		}else { 
		header.removeClass("compact");
		portfolioHeader.removeClass("compact");
		$("#submenu").removeClass("submenuOpen");
		$("#submenu").css("display","none");
		}
		
	},
	
	resize: function(){
		// On window resize
		getWindowDimensions();
		adjustContent();
	}
	
});

$(window).on("orientationchange",function(){
  location.reload();
});

function getWindowDimensions(){

	winH = $(window).height();
	winW = $(window).width();
	
	if ( winW < tabletThr ) { isTablet = true; } else { isTablet = false; }
	if ( winW < mobileThr ) { isMobile = true; } else { isMobile = false; }
	
}

function adjustContent(){
	
	// 0. Getting window dimensions
	
	getWindowDimensions();
	
	// 2. Adjusting testimonials slideshow
	
	var liMH = 0,
		ulH = 0;
	
	$("#testimonials-container")
		.find("li")
		.each(
			function(){
				var liH = $(this).height();
				if ( liH > liMH ){
					liMH = liH;
					ulH = liMH;
					$("#testimonials-container").height( ulH );
				}	
		})
		.each(
			function(){
				var liH = $(this).height();
				
				if ( liH < ulH ) {
					$(this).css({
						top: (ulH-liH)/2
					});
				}
		});	
		
	// 3. Adjusting Submenu
	
	if($("#nav-trigger").css('display') == 'block'){
		console.log('Setting to false');
		displaySubmenu = false;
	}else{
		displaySubmenu = true;
	}
	
}

function slideSwitcher( slideShow ) {
	
	var slides = slideShow.find(".slides"),
		slideNav = slideShow.find(".slide-nav"),
		slideNavItems = slideShow.find(".slide-nav li");
		
	slideNavItems
		.on({
			click: function(){
				var slideInd = $(this).index();
				slideNavItems.removeClass("current");
				$(this).addClass("current");
				
				slides
					.find("li")
					.removeClass("current")
					.eq(slideInd)
					.addClass("current");
				
				return false;
			}
		});
	
}

function formActionHandler( form, actionURL ){
	
	form.on({
		submit: function(){
			
			$(this).removeClass("sent");
			
			var reqEmpty = $(this).find(".required").filter( function(){ return $(this).val() == ""; }),
				data = "";
				
			$(this).find(".invalid").removeClass("invalid");
			
			if ( reqEmpty.length !== 0 ) {
				reqEmpty
					.first()
					.addClass("invalid")
					.focus();
			} else {
			
				data = $(this).serialize();
							
				$.ajax({
					type: "POST",
					url: actionURL,
					data: data,
					beforeSend: function(){ form.addClass("standby"); },
					success: function( data ) {
						form.addClass("sent");
						setTimeout(function(){ resetForm( form ); }, 2000 );
					}
				});
			}
			
			return false;
		}
	});
	
	function resetForm( form ) {
		form.find("input, textarea").val("");
	}
	
}

function getBGImgSizes( objs ) {

	var outputArr = [];

	objs.each(
		function(){
			var objBGI = $(this).css("background-image").replace(/url\(|\)|\"/gm, "");
				img = new Image(),
				objBGS = parseInt($(this).css("background-size"),10);
			
			img.src = objBGI;			
			console.log(img.src);
			$(img).on({ load: function(){

					var bgW = img.width,
						bgH = img.height,
						bgR = bgW/bgH;
					
					if ( objBGS ) {
						bgW = objBGS;
						bgH = bgW/bgR;
					}
					
					outputArr.push( bgW + "x" + bgH );

				}
			});

		}
	);
	
	return outputArr;

}

function buildBGParalax ( objs ) {

	var objsArr = getBGImgSizes( objs );	
	
	objs.each(function(){
	
		var obj = $(this);
	
		$(window).on({
			scroll: function(){
				var oT = obj.offset().top,
					oH = obj.height(),
					oBP = obj.css("background-position"),
					oIS = objsArr[(obj.index()-1)];
					oBP = oBP.split(" ");
					oIS = oIS.split(/x/);
				
				var oIH = oIS[1],
					oBPx = oBP[0]; 
					
				if ( winS >= oT && winS < oT+oH) {
					obj.css({
						backgroundPosition: oBPx + " " + ((oH-oIH)+winS/pR) +"px"
					});
				}
				
			},
			resize: function(){
				
				// window resize fix
				objs.attr("style", "");

			}
		});
		
	});

}

function buildNavigation ( nav ) {
	
	//  $("#header-nav-container ul.navRoot > li a")
	
	var items = $("#header-nav-container ul.navRoot > li > a:not([class='external'])");
	
	items.on({
		click: function(){
			if ( !$(this).parent().hasClass("current")  ) {
			
				nav.find("li").removeClass("current");
				$(this).parent().addClass("current");
				
				var ind = $(this).parent().index(),
					sec = $("section").eq(ind),
					sT = sec.offset().top,					
					dH = $(document).height();	
					delta = sT-hH;
					
					
				if ( delta < 0 ) { delta = 0;}
				if ( delta > dH-winH ) { delta = dH-winH;}
				$('html, body').animate({scrollTop: delta}, "slow"); 
						
			}
			
			return false;
			
		}
		
		
	});
	
	var submenuItems = $("#header-nav-container ul.navRoot > li > ul > li > a");
	
	submenuItems.on({
		click: function(){
			if($(this).attr('href').length){
			$(this).target = "_blank";
        window.open($(this).prop('href'));
			}
			return false;
		}
		
	});

	var submenuItems = $("#portfolio-header-nav-container ul.navRoot > li > ul > li > a");
	
	submenuItems.on({
		click: function(){
			if($(this).attr('href').length){
			$(this).target = "_blank";
        window.open($(this).prop('href'));
			}
			return false;
		}
		
	});
		
	nav.find(".logo a")
		.on({
			click: function(){
				$("body, html").stop().animate({
					scrollTop: 0
				},2000, "easeInOutExpo");
				return false;
			}
		});
	
	$("#nav-trigger").on({
		click: function(){
			$("body").toggleClass("show-nav");
			return false;
		}
	});
	
	$("#back-to-top").on({
		click: function(){
			$("body, html").stop().animate({
					scrollTop: 0
				},2000, "easeInOutExpo");
				return false;	
		}
	});
	

	
	if ( isMobile || isTablet ) {
		$("#wrapper").swipe({
			threshold: 75,
			allowPageScroll: "vertical",
			swipeLeft: function() {
				if(swipeOpenNav){
					if ( !$("body").hasClass("show-nav") ){ $("body").addClass("show-nav"); }
				}else{
					$("#SwipeLeft").click();
				}
					
			},
			swipeRight: function() {
				if(swipeOpenNav){
					if ( $("body").hasClass("show-nav") ){ $("body").removeClass("show-nav"); }
				}else{
					$("#SwipeRight").click();
				}				
			},
			tap: function(){
				if ( $("body").hasClass("show-nav") ){ $("body").removeClass("show-nav"); } 
			}
			
		});
		$(".portfolio #panel").swipe({
			threshold: 75,
			allowPageScroll: "vertical",
			tap: function(){
				if($(this).hasClass('flip')){
					$(this).removeClass('flip');
				}else{
					$(this).addClass('flip');
				}
			}
			
		});
	}
	
		
	scrollSwitcher( $("section"), nav );
	
}


function scrollSwitcher( container, nav ) {
	
	container
		.each(function(){
			var obj = $(this),
				off = obj.offset(),
				top = off.top-hH,
				h = obj.height(),
				ind = obj.index();

			$(window).on({
				scroll: function(){
					//console.log('winS:'+winS+' top-1:'+(top-1)+' top+h:'+(top-h));
					if ( winS > top-1 && winS <= top+h ) {
						var curNav = nav.find("li").eq(ind);
						if( !curNav.has("ul").length ){						
							if ( !curNav.hasClass("current") ) {
								$index = ind - 1;
								$children = $("#header-nav-container ul.navRoot > li");
								nav.find("li").removeClass("current");
								$children.eq($index).addClass("current");
								$currentNav = $children.eq($index).text();
								if ($currentNav.toLowerCase().indexOf("portfolio") >= 0){
									swipeOpenNav = false
									if(autoplayPortfolio){
										flipPortfolioSlides();
										autoplayPortfolio = false;
									}
								}else{
									swipeOpenNav = true;
								}
							}
						}
					} else if ( winS === 0 ) {
						nav.find("li").removeClass("current");
						nav.find("li:first").addClass("current");
					}
				}
			});
		})
	
}

function buildSubmenu(){
	keepOpen = false;
	console.log('displaySubmenu:'+displaySubmenu);
	console.log('creating submenu');
	$( "#header-nav-container ul li .submenu" ).each(function( index ) {
		$(this).mouseenter(function(){keepOpen = true});
		$(this).mouseleave(function(){
			keepOpen = false;
			if(displaySubmenu){
				$(this).toggleClass("submenuOpen");
			}else{
				$(this).toggleClass("submenuOpenInline");
			}
			});
		$(this).siblings("a").mouseenter(function(){
			if(displaySubmenu){
				winS = $(window).scrollTop();
				if(winS >= 100){
					$(this).siblings("ul").toggleClass("submenuOpen");					
				}
			}else{
				$(this).siblings("ul").toggleClass("submenuOpenInline");
			}
		});
		$(this).siblings("a").mouseleave(function(){
			if(displaySubmenu){
				winS = $(window).scrollTop();
				if(winS >= 100){
					$(this).siblings("ul").toggleClass("submenuOpen");
				}
			}else{
				$(this).siblings("ul").toggleClass("submenuOpenInline");
			}
			});
	
	});
	
}

function flipPortfolioSlides(){
	$(".portfolio #panel").each(function(index) {
		$(this).addClass('flip').delay(2000).queue(function(next){
    	$(this).removeClass('flip');
    	next();
		});	
	});
	
}

function buildPortfolio(){
	var autoFlip = true,
	portfolio = [],
	portfolioCycles = 0,
	stopCycle = false;

	$('.hover').hover(function(){
			$(this).addClass('flip');
	},function(){
			if(autoFlip)
				$(this).removeClass('flip');
	});
	$(".portfolio li.read-more").each(function(index) {
    $(this).click(function(){
			return false	
		});
  });
	
	$left = 0;
	
	$(".portfolio #panel").each(function(index) {
    var portfolioItem = {};
		
		$bgImg    = $(this).find(">:first-child").css("background-image");
		$bgImg = $bgImg.replace('small','big');
		$readMore = $(this).find('.read-more a');
		$zoomIn   = $(this).find('.zoom-in a').attr('href',index);
		
		portfolioItem.id = index,
		portfolioItem.bgImg = $bgImg;
		portfolioItem.left = $left;
		$left += 480;
		portfolio.push(portfolioItem);
		$portfolioNavHTML = $("#portfolioNav").html();
		if(index === 0){
			$portfolioItemLink = '<a href="#" class="portfolioNavCurrent">'+(index + 1)+'</a>';
		}else{
			$portfolioItemLink = '<a href="#">'+(index + 1)+'</a>';
		}
		
		$("#portfolioNav").html($portfolioNavHTML + $portfolioItemLink);
		
			
		$zoomIn.click(function(){
			autoFlip = false;
			$portfolioID = $(this).attr('href');
			$("#portfolio-zoom-in").css('background', ''+portfolio[$portfolioID].bgImg+' center no-repeat');
			$("#portfolio-zoom-in").modal({opacity: 90, minWidth: 400, minHeight: 450, autoResize: true, overlayClose: true, closeHTML: '', containerCss: 'portfolio-zoom-in-container', 
			onOpen: function (dialog) {
				dialog.overlay.fadeIn('slow', function () {dialog.container.slideDown('slow', function () {dialog.data.fadeIn('slow');});
				});
			}, onClose: function(dialog){
				dialog.data.fadeOut('fast', function () {
				dialog.container.slideUp('fast', function () {
				dialog.overlay.fadeOut('fast', function () {
				$.modal.close(); // must call this!
				autoFlip = true;
				//portfolioCycles = parseInt($portfolioID) + 1;
				//cyclePortfolio();
					$('.hover').hover(function(){
						$(this).addClass('flip');
						},function(){
								if(autoFlip)
									$(this).removeClass('flip');							
						});
					});
				});
			});
		}});
			return false		
		});
  });
	
	$("#portfolioNav a").each(function(index) {
    $(this).click(function(){
			cyclePortfolio(index);	
			return false;
		});
  });
	
	$("#SwipeLeft").click(function(){
		if(currentIndex != null){	
			if(currentIndex >= (portfolio.length - 1)){
				$index = 0;
			}else{
				$index = (currentIndex + 1);
			}
			cyclePortfolio($index);
		}
	});
	
	$("#SwipeRight").click(function(){
		if(currentIndex != null){
			if(currentIndex === 0){
				$index = 	(portfolio.length - 1);
			}else{
				$index = (currentIndex - 1);
			}
			cyclePortfolio($index);		
		}

	});
	

	function cyclePortfolio(index){
		if(index > -1){
		}else{
			if(currentIndex > -1){
				index = currentIndex + 1;
			}else{
				index = 0;
			}			
		}
		currentIndex = index;
		winW = $(window).width();
		if(winW <= 640){
			$leftMargin = 0;
		}else{
			$leftMargin = 20;		
		}
		$portfolioItemW = ($(".portfolio #panel").eq(0).width() + $leftMargin); 
		$portfolioItemW = (parseInt($portfolioItemW) * index);
		setTimeout(function(){
		if(portfolioCycles >= portfolio.length){
			portfolioLeft = '0px';
			portfolioCycles = 0;
		}else{
			$portfolioW = 5000;
			var portfolioLeft = $portfolioItemW;
			console.log('Left:'+portfolioLeft);
			if(portfolioLeft > 0){
				portfolioLeft = '-' + portfolioLeft + 'px'; 				
			}else{
				portfolioLeft = portfolioLeft + 'px'; 
			}
		}
		$(".portfolio").width($portfolioW);
		$(".portfolio").animate({left: portfolioLeft}, 1000, function() {
			$("#portfolioNav a").each(function() {
        $(this).removeClass("portfolioNavCurrent"); // css({'font-weight':'300','color':'rgba(0,0,0,1)','background-color':'rgba(0,0,0,0)','border':'1px solid rgba(0,0,0,1)'});
      });
			$("#portfolioNav a").eq(index).addClass("portfolioNavCurrent"); // css({'font-weight':'bold','color':'rgba(0,0,0,1)','background-color':'rgba(0,0,0,0.5)','border':'1px solid rgba(0,0,0,1)'});
			//$("#portfolioNav a").eq(index).addClass("portfolioNavCurrent");
			});
		
		}, 1000);
		return true;
	}
	
	$maxWidth = (parseInt(portfolio.length) * 460);
	$(".portfolio").width($maxWidth);
	
	/*
	// JqueryUI Slider
	$(function() {
    $maxWidth = ((parseInt(portfolio.length) * 460) - 500);
		$( "#portfolioSlider" ).slider({ max: $maxWidth, change: function( event, ui ) {
				console.log(ui.value);
				$incrementValue = parseInt(ui.value);
				$animateLeft = '-' + $incrementValue + 'px';
				$portfolioW    = $(".portfolio").width() + $incrementValue;
				console.log('Current Pos: ' + ui.value + ' max: '+$maxWidth);
				if(parseInt(ui.value) > ($maxWidth - 250)){
					$portfolioW = '100%';
					$animateLeft = '0px';
					$("#portfolioSlider").slider( "value", 0 );
				}
				$(".portfolio").width($portfolioW);
				$(".portfolio").animate({left: $animateLeft}, 500, function() {});
			}			
		});
  });
	*/
	
}

// Background Imaeg Slider

/*
<h3 class="no-margin">Neat Solution For A</h3>
			<h2>Growing<br> Business</h2>
			<p>The state-of-the-art HTML5 powered flexible layout with lightspeed fast CSS3 transition effects. Works perfect in any modern mobile and desktop browsers ...</p>
*/
var cycles = 0;
var endCycles = false;
var imageSet1 = [["images/cover_back_plain.jpg","Neat Solution For A","Growing<br> Business","The state-of-the-art HTML5 powered flexible layout with lightspeed fast CSS3 transition effects. Works perfect in any modern mobile and desktop browsers ..."], ["images/cover_back.jpg","Responsive And","Mobile<br> Friendly","Fully responsive layout! Adapted for every modern mobile device on the market. Includes Sidebar Slide Out Navigation on Small Screens..."], ["images/cover_back_plain.jpg","Neat Solution For A","Growing<br> Business","The state-of-the-art HTML5 powered flexible layout with lightspeed fast CSS3 transition effects. Works perfect in any modern mobile and desktop browsers ..."], ["images/cover_back_plain.jpg","Neat Solution For A","Growing<br> Business","The state-of-the-art HTML5 powered flexible layout with lightspeed fast CSS3 transition effects. Works perfect in any modern mobile and desktop browsers ..."], ["images/cover_back_plain.jpg","Neat Solution For A","Growing<br> Business","The state-of-the-art HTML5 powered flexible layout with lightspeed fast CSS3 transition effects. Works perfect in any modern mobile and desktop browsers ..."], ["images/cover_back_plain.jpg","Neat Solution For A","Growing<br> Business","The state-of-the-art HTML5 powered flexible layout with lightspeed fast CSS3 transition effects. Works perfect in any modern mobile and desktop browsers ..."], ["images/cover_back_plain.jpg","Neat Solution For A","Growing<br> Business","The state-of-the-art HTML5 powered flexible layout with lightspeed fast CSS3 transition effects. Works perfect in any modern mobile and desktop browsers ..."], ["images/cover_back_plain.jpg","Neat Solution For A","Growing<br> Business","The state-of-the-art HTML5 powered flexible layout with lightspeed fast CSS3 transition effects. Works perfect in any modern mobile and desktop browsers ..."], ["images/cover_back_plain.jpg","Neat Solution For A","Growing<br> Business","The state-of-the-art HTML5 powered flexible layout with lightspeed fast CSS3 transition effects. Works perfect in any modern mobile and desktop browsers ..."], ["images/cover_back_plain.jpg","Neat Solution For A","Growing<br> Business","The state-of-the-art HTML5 powered flexible layout with lightspeed fast CSS3 transition effects. Works perfect in any modern mobile and desktop browsers ..."]];
var currentImageSet1 = 0;

function buildSlider(){
	console.log('Building slider');
	for(i=0;i<imageSet1.length;i++){
		var slideIndex = i + 1;
		$slideNavHTML = $("#cover .coverSlideNav div").html();
		if(i===0){
			$slideNavHTML += '<a href="#" class="currentSlider"></a>';
		}else{
			$slideNavHTML += '<a href="#" ></a>';
		}
		$("#cover .coverSlideNav div").html($slideNavHTML);
	}
	$coverSlideNavW = (30 * imageSet1.length) + 'px';

	winW = $(window).width();
	if(winW <= 350){
	//$("#cover .coverSlideNav div a").css("width","6px");
	//$("#cover .coverSlideNav div a").css("height","6px");		
	}
	$("#cover .coverSlideNav div").css("width",$coverSlideNavW);
	$("#cover .coverSlideNav div a").each(function(index) {
    	$(this).on({
			click: function(){
					switchSlide(index);
					return true;
				}
			})
  });
	if(autoplaySlider)
		setTimeout("changeBackgroundImages()", 5000);
}

function img1Fade(){
			$('#cover').fadeOut(1500, function(){
				$("#cover").css('background', 'url("'+imageSet1[currentImageSet1][0]+'") center bottom no-repeat');
				$("#cover h3").text(imageSet1[currentImageSet1][1]);
				$("#cover h2").html(imageSet1[currentImageSet1][2]);
				$("#cover p").text(imageSet1[currentImageSet1][3]);
				switchSliderButton(currentImageSet1);
			});
			$('#cover').fadeIn(2000);
			if(currentImageSet1 >= imageSet1.length - 1) {
				currentImageSet1 = 0;
				cycles += 1;
				if(cycles === maxSliderCycles){
					endCycles = true;
					$("#cover .coverSlideNav div").fadeIn(10000);	
				}
			}else{
				currentImageSet1 += 1;	
			}
		if(!endCycles){			
			setTimeout("changeBackgroundImages()", 7000);	
		}else{
			//$("#cover .coverSlideNav div").fadeIn('slow');	
		}
}

function switchSlide(index){
	console.log('Switching to slide:'+index);
	$('#cover').fadeOut(1000, function(){
				$("#cover").css('background', 'url("'+imageSet1[index][0]+'") center bottom no-repeat');
				$("#cover h3").text(imageSet1[index][1]);
				$("#cover h2").html(imageSet1[index][2]);
				$("#cover p").text(imageSet1[index][3]);
				switchSliderButton(index);
			});
	$('#cover').fadeIn(1000);	
}

function switchSliderButton(buttonIndex){
	$("#cover .coverSlideNav div a").removeClass("currentSlider");
	$("#cover .coverSlideNav div a").each(function(index) {
		if(index === buttonIndex){
			$(this).addClass("currentSlider");
		}
	});		
}

function changeBackgroundImages() {
		img1Fade();
}

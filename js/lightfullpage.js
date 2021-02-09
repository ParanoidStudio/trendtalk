var topScroll = 0;
var scrolling = 0;
$('body,html').animate({scrollTop: 0}, 10);
$(window).bind('mousewheel', function(event) {

    if (event.originalEvent.wheelDelta >= 0 && !scrolling) {

        if (topScroll > 0) {

            currPage--;

            console.log("-___"+currPage+"___-");

            setTimeout(updatePages(currPage), 800);
            console.log("scrolling up");

            topScroll = topScroll - Math.floor($('body .section').height());
            $('body,html').animate({scrollTop: topScroll}, 500); // 700
            scrolling = 1;
        }
        setTimeout(function(){scrolling = 0},500);
        event.stopPropagation()
    }
        
    else {
        if ( (($(document).height() - $(window).height()) - 20 ) > topScroll && !scrolling) {

            currPage++;

            console.log("-___"+currPage+"___-");

            setTimeout(updatePages(currPage), 800);
            console.log("scrolling down");
            
            topScroll = topScroll + Math.floor($('body .section').height());
            $('body,html').animate({scrollTop: topScroll}, 500); // 500 
            scrolling = 1;
            setTimeout(function(){scrolling = 0},500);
            event.stopPropagation()
        }
    }
});
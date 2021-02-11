var topScroll = 0;
var scrolling = 0;
$('body,html').animate({scrollTop: 0}, 10);
$(window).bind('mousewheel', async function(event) {

    if (!scrolling && event.originalEvent.wheelDelta >= 0) {

        if (topScroll > 0) {

            
            console.log("scrolling up");
            
            topScroll = topScroll - Math.floor($('body .section').height());
            scrolling = 1;

            $('body,html').animate({scrollTop: topScroll}, 500, ()=>{
                scrolling = 0;
                currPage--;
                console.log("After dark the sun've risen.");
                if(currPage == currPage - currPage%blockSize){
                    updatePages();
                }
            }); // 700
            
        }    
    }
        
    else {
        if ( ( ($(document).height() - $(window).height()) - 20 ) > topScroll && currPage < supPage) {

            console.log("scrolling down");

            topScroll = topScroll + Math.floor($('body .section').height());
    
            scrolling = 1;
            //setTimeout(function(){scrolling = 0},500);  // вот это может вызывать лаги;
            $('body,html').animate({scrollTop: topScroll}, 5000, ()=>{
                scrolling = 0;
                currPage++;
                console.log("After dark the light`s come.");
                if(currPage == currPage - currPage%blockSize + 1){
                    updatePages();
                }
            });
        }
    }
});


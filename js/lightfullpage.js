var topScroll = 0;
var scrolling = 0;
$('body,html').animate({scrollTop: 0}, 10);
$(window).bind('mousewheel', async function(event) {

    if (!scrolling && event.originalEvent.wheelDelta >= 0) {

        if (topScroll > 0) {

            
            console.log("II.scrolling up");
            
            topScroll = topScroll - Math.floor($('body .section').height());
            scrolling = 1;
            currPage--; 
            $('body,html').animate({scrollTop: topScroll}, 500, ()=>{
                console.log("II.a after scroll page" + currPage);
                if(currPage == currPage - currPage%blockSize){
                    updatePages();
                } else {
                    scrolling = 0;
                }
            }); // 700
        }    
    }
        
    else {
        if ( !scrolling && ( ($(document).height() - $(window).height()) - 20 ) > topScroll && currPage < supPage) {

            console.log("I. scrolling down");

            topScroll = topScroll + Math.floor($('body .section').height());
            currPage++;
            scrolling = 1;
            event.stopPropagation();
            //setTimeout(function(){scrolling = 0},500);  // вот это может вызывать лаги;
            $('body,html').animate({scrollTop: topScroll}, 500, ()=>{
                console.log("I.a after scroll page"+ currPage);
                if(currPage == currPage - currPage%blockSize + 1){
                    updatePages();
                }else{
                    scrolling = 0;   
                }
            });
        }
    }
});


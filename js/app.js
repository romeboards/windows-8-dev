/*  SI.COM DUAL SPEED PROTOTYPE
    dan // dev // tectonic [gotectonic dot com]
    questions? daniel.kass at tufts.edu

    GIVENS:
        a) There are always the same number of sections between the big container and the small container
        b) The index of a section in the big container matches up to the index of the sections in the small container
        c) There are a variable number of articles in the big and small sections, but always > 0
        d) There should probably be a few more listed here..

    NOTES:
        a) This code is meant simply as a reference. No use for the actual SI.com app is intended, but you are welcome 
            to use whatever you'd like.
        b) This prototype is given 'as is' and does not reflect at all the **final** visual style, interaction model, or motion specifics
            of the app as designed by tectonic. 
        c) The expanded module layout is shown for the third module (SI Writers) on the small timeline, the rest simply expand/close.
        d) [DEAD] signifies a design or concept that has since been changed or removed from the final design iteration
        e) Scroll functionality is implemented with the DOM element.scrollLeft attribute. However, there are advantages to using a CSS3
            transformX() instead, namely because the Windows 8 independent animation thread applies only to manipulations that don't 
            require a DOM layout pass. This would be my recommendation to achieve the smoothest motion possible.
        f) For the smoothest animation, the ratio between the **width** (in pixels) of the top section vs. the **width** of the bottom section
            is of utmost importance. If they are too close or too different in width, the animation is blocky and/or uncomfortable. 
            I would say the ideal difference is 1.5x-3x greater.

    6.29.2012: Dual speed motion finalized 
    7.1.2012:  Expand functionality
    7.6.2012:  Close functionality
    7.19.2012: Box Score AppBar functionality - [DEAD] 
*/

(function () {

    /* Globals */
    var $mainContent,
        $containerBig,
        containerBigLeftX,
        $containerSmall,
        containterSmallLeftX,
        $focusedTimeStamp,
        focusedSectionBig = {
            section: undefined,
            width: undefined,
            leftX: undefined
        },
        focusedSectionSmall = {
            section: undefined,
            width: undefined,
            leftX: undefined
        },
        currentIndex,
        currentRatio,
        bigCausedScrolling,
        smallCausedScrolling,
        expandedView;

    /* Main */
    $(function () {
        $mainContent = $('.main-content');
        $containerBig = $('.container-big'),
        $containerSmall = $('.container-small'),
        $focusedTimeStamp = $('ul.time-stamps li').eq(0),
        containerBigLeftX = $containerBig.position().left,
        containerSmallLeftX = $containerSmall.position().left,
        currentIndex = 0,
        currentRatio = 0;
        bigCausedScrolling = false,
        smallCausedScrolling = false,
        expandedView = false;

        getInitialSections();
        updateTimeStamp(currentIndex);          // [DEAD]

        /* Big container scroll event */
        $containerBig.scroll(function () {

            if(!smallCausedScrolling) {
                $('.container-big > section').each(function (index) {

                    var $sectionBig = $(this),
                        sectionBigLeftX = Math.round($sectionBig.position().left),
                        sectionBigWidth = $sectionBig.outerWidth(),
                        sectionBigRightX = sectionBigLeftX + sectionBigWidth;

                    if (sectionBigLeftX <= 0 && sectionBigRightX > 0) {

                        // new section in focus
                        if (currentIndex != index) {

                            focusedSectionBig.section = $sectionBig;
                            focusedSectionBig.width = sectionBigWidth;
                            currentIndex = index;

                            updateTimeStamp(index);
                            updateSmallSection(index);
                        }

                        focusedSectionBig.leftX = sectionBigLeftX;                   // current section pos within its container
                        currentRatio = Math.abs(sectionBigLeftX / sectionBigWidth);  // percentage traveled within that container
                        var newSmallLeftX = focusedSectionSmall.width * currentRatio;      
                        var totalCurrentWidth = findCurrentWidth($containerSmall);
                        bigCausedScrolling = true;                                   // so the two scroll functions don't cancel each other out
                        containerSmallLeftX = newSmallLeftX + totalCurrentWidth;
                        showTimeStamp(currentRatio);                                 // [DEAD] updates the time stamp
                        $containerSmall[0].scrollLeft = containerSmallLeftX;         // using native JS instead of jQuery had a minor optimization effect
                        return false;
                    }
                });
            }

            containerBigLeftX = $containerBig.scrollLeft();
            smallCausedScrolling = false;
        });

        /* Small container scroll event */
        $containerSmall.scroll(function () {

            if (!bigCausedScrolling) {
                $('.container-small > section').each(function (index) {

                    var $sectionSmall = $(this),
                        sectionSmallLeftX = Math.round($sectionSmall.position().left),
                        sectionSmallWidth = $sectionSmall.outerWidth(),
                        sectionSmallRightX = sectionSmallLeftX + sectionSmallWidth;

                    if (sectionSmallLeftX <= 0 && sectionSmallRightX > 0) {

                        // new section in focus
                        if (currentIndex.index != index) {

                            focusedSectionSmall.section = $sectionSmall;
                            focusedSectionSmall.width = sectionSmallWidth;
                            currentIndex = index;

                            updateTimeStamp(index);
                            updateBigSection(index);
                        }

                        focusedSectionSmall.leftX = sectionSmallLeftX;
                        currentRatio = Math.abs(focusedSectionSmall.leftX / focusedSectionSmall.width);
                        var newBigLeftX = focusedSectionBig.width * currentRatio;
                        var totalCurrentWidth = findCurrentWidth($containerBig);
                        smallCausedScrolling = true;
                        containerBigLeftX = newBigLeftX + totalCurrentWidth;
                        showTimeStamp(currentRatio);
                        $containerBig[0].scrollLeft = containerBigLeftX;   //Optimized - using native JS instead of jQuery
                        return false;
                    }
                });
            }

            containerSmallLeftX = $containerSmall.scrollLeft();
            bigCausedScrolling = false;
        });

        showTimeStamp(currentRatio);            
        
        /* Article click event (obviously) */
        $('article').bind('click', articleClick);

        /* Box Score AppBar functionality [DEAD] */

        //Default hide children
        $('.boxscore').hide();
        $('.boxscore-main').show();
        
        //Down a Level
        $('.box-content ul.box-list li').click(function () {
            
            var $list = $(this).closest('.boxscore'),
            index = $(this).index();

            if ($list.children('.boxscore').length) {
                $list.children('.box-content').slideUp();
                $list.children('.boxscore').eq(index).show().css({position : 'static'}).children('.box-content').slideDown();
            }
        });

        //Up a Level
        $('.box-content .box-title').click(function () {

            var $list = $(this).closest('.boxscore'),
                $parent = $list.parent();
                index = $(this).index();

                if (!$list.hasClass('boxscore-main')) {
                    $list.children('.box-content').slideUp();
                    $parent.children('.box-content').slideDown();
                }
         });
    });  /* End of main */

    function getInitialSections() {

        checkBigSections();
        checkSmallSections();
    }

    function articleClick() {

        if (!expandedView) centerArticle($(this));
        expandedView = true;    
    }

    /* Run through the big sections and see which one is in 'focus' */
    function checkBigSections() {

        $('.container-big > section').each(function (index) {

            var $sectionBig = $(this),
                sectionBigX = Math.round($sectionBig.position().left),
                sectionBigWidth = $sectionBig.outerWidth(),
                right = sectionBigX + sectionBigWidth;

            if (sectionBigX <= 0 && right >= 0) {

                focusedSectionBig.section = $sectionBig;
                focusedSectionBig.width = sectionBigWidth;
                focusedSectionBig.leftX = Math.abs(sectionBigX);
                focusedSectionBig.index = index;
                currentIndex = index;
                return false;
            }
        });
    }

    /* Run through the small sections and see which one is in 'focus' */
    function checkSmallSections() {

        $('.container-small > section').each(function (index) {

            var $sectionSmall = $(this),
                sectionSmallLeftX = Math.round($sectionSmall.position().left),
                sectionSmallWidth = $sectionSmall.outerWidth(),
                right = sectionSmallLeftX + sectionSmallWidth;

            if (sectionSmallLeftX <= 0 && right > 0) {

                focusedSectionSmall.section = $sectionSmall;
                focusedSectionSmall.width = sectionSmallWidth;
                focusedSectionSmall.leftX = Math.abs(sectionSmallLeftX);
                focusedSectionSmall.index = index;
                currentIndex = index;
                return false;
            }
        });
    }

    /* Update the small section at 'index' to be the one in focus */
    function updateSmallSection(newIndex) {

        var $sectionSmall = $('.container-small > section').eq(newIndex),
            sectionSmallLeftX = Math.round($sectionSmall.position().left),
            sectionSmallWidth = $sectionSmall.outerWidth(),
            right = sectionSmallLeftX + sectionSmallWidth;

        focusedSectionSmall.section = $sectionSmall;
        focusedSectionSmall.width = sectionSmallWidth;
        focusedSectionSmall.leftX = sectionSmallLeftX;
        focusedSectionSmall.index = newIndex;
    }

    /* Update the big section at 'index' to be the one in focus */
    function updateBigSection(newIndex) {

        var $sectionBig = $('.container-big > section').eq(newIndex),
            sectionBigX = Math.round($sectionBig.position().left),
            sectionBigWidth = $sectionBig.outerWidth(),
            right = sectionBigX + sectionBigWidth;

        focusedSectionBig.section = $sectionBig;
        focusedSectionBig.width = sectionBigWidth;
        focusedSectionBig.leftX = sectionBigX;
        focusedSectionBig.index = newIndex;
    }

    /* Display the progressive time stamp [DEAD] */
    function showTimeStamp(ratio) {

        $focusedTimeStamp.css({ opacity : 1 - ratio + .1 });
        $focusedTimeStamp.css({ width: ratio*100 + '%' });
    }

    /* Update the progressive time stamp [DEAD] */
    function updateTimeStamp(index) {

        var $timeStamps = $('ul.time-stamps li');

        $focusedTimeStamp = $timeStamps.eq(index);

        $timeStamps.each(function () {
            $(this).hide();
        });

        $focusedTimeStamp.show();
    }

    /* Add up the widths of all the previous sections before the one in focus to detirmine the scrollLeft property */
    function findCurrentWidth($container) {

        var width = 0;

        $('section', $container).each(function (index) {
            var $section = $(this);
            if (index == currentIndex) return false;
            else width += $section.outerWidth();
        });

        return width;
    }

    /* Add up the widths of all the sections within a container */
    function findtotalCurrentWidth($container) {

        var width = 0;

        $('section', $container).each(function (index) {
            width += $(this).outerWidth();
        });

        return width;
    }

    /* Center an article on the page, but for the animation's sake its not animated and executed until expandArticle() */
    function centerArticle($article) {

        var $container = $article.parent().parent(),                                        //container > section > article
            containerX = $container.scrollLeft(),
            containerWidth = findtotalCurrentWidth($container),
            centerPoint = $mainContent.outerWidth() / 2,
            articleLeft = $article.offset().left,                                           //non-expanded, non-centered pos
            articleCenterPoint = $article.outerWidth() / 2,
            articleNewLeft;                                                                 //non-expanded, centered pos 

            containerX += articleLeft - centerPoint + articleCenterPoint;
            articleNewLeft = centerPoint - articleCenterPoint;

            //can't center b/c at the beginning
            if (containerX <= 0) {
                containerX = 0;

            // can't center b/c at the end
            } else if(containerX >= (containerWidth - $mainContent.outerWidth())) {
                containerX = containerWidth - $mainContent.outerWidth();
            }

            $container.css({ "z-index": "999" });                                            //Makes sure the content is above the other container
            $('.container').css("overflow-x", "hidden");                                   //Prevent scrolling on the containers
            $('article').unbind('click');

            expandArticle($article, articleLeft, articleNewLeft, containerX);              //Expand the article with the centered info
    }

    /* Expand the article. Because the container has overflow:scroll set, this requires some hacking around:
        1) The article gets set to position: fixed. A spacer is added to separate the timeline in the articles place.
        2) A background fill is added behind to illustrate that the timeline won't scroll when expanded.
    */
    function expandArticle($article, articleOrigLeft, articleCenteredLeft, containerCenteredX) {

        var $container = $article.parent().parent(),                                                          //container > section > article
            articleOrigTop = $article.offset().top,
            articleOrigWidth = $article.outerWidth(),
            articleOrigHeight = $article.outerHeight(),
            articlePadding = articleOrigWidth - $article.width(),
            articleExpandedWidth = 1060,                                                                      //not accounting for padding
            articleLeftOffset = (articleExpandedWidth + articlePadding - articleOrigWidth) / 2.0,             //Amount the article must grow on each side
            whiteSpaceOffset = 25,                                                                            //Splits the timeline a little more
            expandDuration = 750,
            expandEasing = 'easeOutExpo';

        $article.after('<div id="space"></div><div id="fill"></div>');                                        //Add in space and fill divs
        $('.article-content', $article).hide();                                                               //Hide the module content
        $('.article-expanded-content', $article).show().css({ display: '-ms-flexbox' });                      //Show the expanded content

        $('#space')
            .css({
                left: articleOrigLeft,                                                                        //set the space to be @ original, centered pos
                width: articleOrigWidth,
                height: articleOrigHeight,
                marginLeft: $article.css('marginLeft'),
                marginRight: $article.css('marginRight')
            })
            .animate({
                    left: articleCenteredLeft - articleLeftOffset - whiteSpaceOffset,                         //animate to new space pos and expand
                    width: articleExpandedWidth + articlePadding + (whiteSpaceOffset*2)
                }, {
                    duration: expandDuration,
                    queue: false,
                    easing: expandEasing
            });

        containerCenteredX += articleLeftOffset + whiteSpaceOffset;                                           //scroll back for 'split the timeline' effect
        $container
            .animate({
                scrollLeft: containerCenteredX
            }, {    
                duration: expandDuration,
                easing: expandEasing
            });
        
        $article
            .css({
                left: articleOrigLeft,                                          // Set the pos css for animation purposes
                top: articleOrigTop,
                height: articleOrigHeight,
            })
            .addClass('expanded')
            .animate({
                  left: articleCenteredLeft - articleLeftOffset,                // Animate to new pos
                  top: '0px',
                  height: $mainContent.outerHeight(),                           // Animates to top/bottom of the screen
                  width: articleExpandedWidth
             }, {
                  duration: expandDuration * 1.05,                              // Made this 5% slower than the other two animations
                  queue: false,
                  easing: expandEasing,
                  complete: function () {

                      //Animation complete
                      $('#fill').bind('click', function () {                    // Bind a click event to our new fill div, to close the article
                          if (expandedView) closeExpandedArticle();
                          expandedView = false;
                      });
                  }
             });

    }

    /* Not 100% pleased with this implementation, but lots of workarounds had to be made. First, because you cannot animate to 'auto' for left and top, 
        the expanded article animates to the position of the space div behind it, as that space is animating shut to patch up the right side of the
        timeline. At the same time, the timeline is scrolling back into position to patch up the left side. Finally, extra divs are removed and the 
        css of the article is reset to make it retain its old position, now centered in the window.
     */
    function closeExpandedArticle() {
        
        var $article = $('.expanded'),
            $container = $article.parent().parent(),                                        // Container > section > article
            containerX = $container.scrollLeft(),
            articlePadding = $article.outerWidth() - $article.width(),
            articleWidth = $article.outerWidth(),
            articleOrigWidth,
            articleLeftOffset,
            whiteSpaceOffset = 25,                                                          // This should probably be a global, b/c its the same in expand and close...
            closeDuration = 750,
            closeEasing = 'easeOutExpo';

        $('.article-content', '.expanded').show();

        var $clone = $article.clone();                                                      // A clone is used to ditermine the width if it were set to 'auto'
        $('.article-expanded-content', $clone).remove();
        $clone.removeClass('expanded').css({ 'width': 'auto' }).appendTo($article.parent());
        articleOrigWidth = $clone.outerWidth();
        articleLeftOffset = (articleWidth - articleOrigWidth) / 2.0;                        // Distance the article must shrink on each side

        $clone.remove();

        $('#space')
            .animate({
                left: $('#space').offset().left + articleLeftOffset + whiteSpaceOffset,
                width: articleOrigWidth + articlePadding,
            }, {
                duration: closeDuration * 1.5,
                queue: false,
                easing: closeEasing
            });

        $article
            .animate({
                left: $('#space').offset().left + articleLeftOffset + whiteSpaceOffset,                      // Set the pos css for animation purposes
                height: $('#space').height(),
                top: $('#space').offset().top,
                width: articleOrigWidth
            }, {
                duration: closeDuration,
                queue: false,
                easing: 'easeOutExpo',
                complete: function () {                                                                     // The css and space div must be removed when this animation completes

                    $('.article-expanded-content', '.expanded').hide();

                    $(this).css({                                                                           // Set the css to make this new position 'stick'
                        top: 'auto',                                                                        // This would have been simpler to animate to 'auto' if it were possible!
                        left: 'auto',
                        width: articleOrigWidth
                    }).removeClass('expanded');
                    $('#space').remove();                                                                   // Remove the spacer once its not needed anymore
                    $('.container').css("overflow-x", "scroll");                                            // Re-enable scrolling
                    $container.css({ "z-index": "1" });
                    $('article').bind('click', articleClick);
                }
            });
            
        containerX -= (articleLeftOffset + whiteSpaceOffset);       
        $container
            .animate({
                    scrollLeft: containerX
                }, {
                    duration: closeDuration * 1.5,
                    easing: closeEasing
            });

        $('#fill').remove();
    }

})();
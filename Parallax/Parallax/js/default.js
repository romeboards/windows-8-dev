$(function () {

    var totalWidth = 1366,
        margin = 100;


   /* $('img').each(function (index) {

        var $img = $(this),
            imgX = Math.round($img.position().left),
            progress = (imgX + $img.width()) / (totalWidth + $img.width());

        if (progress > 1.0) progress = 1.0;
        else if (progress < 0.0) progress = 0.0;

        var marginLeft = -Math.round(progress * margin),
            marginRight = -(margin + marginLeft);

        $img.css({
            'margin-right': marginRight + 'px',
            'margin-left': marginLeft + 'px',
        });
    });*/
    
    $('ul.old').scroll(function () {

        $('ul.old img').each(function (index) {

            var $img = $(this),
                imgX = Math.round($img.position().left),
                progress = (imgX + $img.width()) / (totalWidth + $img.width());

            if (progress > 1.0) progress = 1.0;
            else if (progress < 0.0) progress = 0.0;

            var marginLeft = - Math.round(progress * margin),
                marginRight = - (margin + marginLeft);       

            $img.css({
                'margin-right': marginRight  + 'px',
                'margin-left': marginLeft + 'px',
            });       
        });
    });
});

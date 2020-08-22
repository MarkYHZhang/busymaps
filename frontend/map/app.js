window.onload = function() {
    floatingPanel();
    range();

    closeLoading();
}

function closeLoading() {
    setTimeout( function() {
        $('#loading').animate({
            opacity: 0,
            top: "-50px"
        }, 400, function() {
            $('#loading').remove();
        });
    }, 500);
}

function floatingPanel() {
    let toggle = $('#floating-panel-toggle');
    let body = $('#floating-panel');
    let initHeight = body.height();
    
    toggle.click(function() {
        let height = body.height();

        toggle.text(height == 0 ? 'Hide map options' : 'Show map options');

        body.animate({
            height: height == 0 ? initHeight : 0
        });
    });
}

function range() {
    let sheet = document.createElement('style');
    let $rangeInput = $('#range input');
    let prefs = ['webkit-slider-runnable-track', 'moz-range-track', 'ms-track'];

    let num = $('.range-labels li').length;
    let width = $rangeInput.width();
    let labelSize = width / num;
    let range = $('#range');

    $('.range-labels li').css({width: labelSize + "px"});
    range.css({
        "margin": `5px calc(2em + ${(labelSize/2) - 2}px)`,
        "margin-top": `15px`,
    });

    document.body.appendChild(sheet);

    let getTrackStyle = function (el) {  
        let curVal = el.value;
        let val = (((curVal - 1) * labelSize) / (labelSize * (num - 1))) * 100;
        let style = '';

        // Set active label
        $('.range-labels li').removeClass('active selected');
    
        let curLabel = $('.range-labels').find('li:nth-child(' + curVal + ')');
    
        curLabel.addClass('active selected');
        // curLabel.prevAll().addClass('selected');
    
        // Change background gradient
        for (let i = 0; i < prefs.length; i++) {
            style += `#range input::- ${prefs[i]}{background: linear-gradient(to right, #37adbf 0%, #37adbf ${val}%, #b2b2b2 ${val}%, #b2b2b2 100%)}`;
        }

        return style;
    }

    $rangeInput.on('input', function () {
        sheet.textContent = getTrackStyle(this);
    });

    // Change input value on label click
    $('.range-labels li').on('click', function () {
        let index = $(this).index();
    
        $rangeInput.val(index + 1).trigger('input');
    });
}
window.onload = function() {
    floatingPanel();
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
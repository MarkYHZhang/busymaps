window.onload = function() {
    $('.animateItem').css({opacity: 0});
    $('.animateButton').css({opacity: 0});

    loadParticles();
    loadContent();
}

async function loadContent() {
    let title = document.getElementById("animateTitle");
    let items = document.getElementsByClassName("animateItem");

    $(items).css({
        "transition": "1s"
    })

    await animateTitle(title);

    for(let i = 0; i < items.length; ++i) {
        animateFadeIn(items, i);
    }

    setTimeout(function() {
        loadButton();
    }, (items.length + 1) * 500);
}

async function animateTitle(e) {
    let text = e.innerHTML;
    let random = '';
    let logoTitleContainer = e.innerHTML;
    let possible = "-+*/|}{[]~\\\":;?/.><=+-_)(*&^%$#@!)}";

    e.innerHTML = '';

    function generateRandomTitle(random) {
        return new Promise(function(resolve, _) {
            setTimeout( function() {
                e.innerHTML = random;
                resolve();
            }, 75 );
        });
    }

    return new Promise(function(resolve, _) {
        setTimeout( async function() {
            for(let i = 0; i < text.length+1; ++i) {
                random = text.substr(0, i);

                for(let j = i; j < text.length; ++j) { 
                    random += possible.charAt(Math.floor(Math.random() * possible.length)); 
                }

                await generateRandomTitle(random);
            }

            console.log("??");
            resolve();
        }, 75 );
    });
}

function animateFadeIn(e, i) {
    return new Promise(function(resolve, _) {
        setTimeout(function() {
            $(e[i])
                .animate({opacity: 1})
                .removeClass('animate');

            resolve();
        }, i * 500);
    });
}

function loadButton() {
    $('.animateButton').animate({opacity: 1});
}
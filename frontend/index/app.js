config = {
    "particles": {
        "number": {
            "value": 20,
            "density": {
                "enable": true,
                "value_area": 1500
            }
        },
        "color": {
            "value": "#ffffff"
        },
        "shape": {
            "type": "circle",
            "stroke": {
                "width": 0,
                "color": "#000000"
            },
            "polygon": {
                "nb_sides": 5
            },
            "image": {
                "src": "img/github.svg",
                "width": 100,
                "height": 100
            }
        },
        "opacity": {
            "value": 0.5,
            "random": false,
            "anim": {
                "enable": false,
                "speed": 1,
                "opacity_min": 0.1,
                "sync": false
            }
        },
        "size": {
            "value": 3,
            "random": true,
            "anim": {
                "enable": false,
                "speed": 40,
                "size_min": 0.1,
                "sync": false
            }
        },
        "line_linked": {
            "enable": true,
            "distance": 350,
            "color": "#ffffff",
            "opacity": 0.4,
            "width": 1
        },
        "move": {
            "enable": true,
            "speed": 2,
            "direction": "none",
            "random": false,
            "straight": false,
            "out_mode": "out",
            "bounce": false,
            "attract": {
                "enable": false,
                "rotateX": 600,
                "rotateY": 1200
            }
        }
    },
    "interactivity": {
        "detect_on": "canvas",
        "events": {
            "onhover": {
                "enable": true,
                "mode": "grab"
            },
            "onclick": {
                "enable": true,
                "mode": "push"
            },
            "resize": true
            },
            "modes": {
            "grab": {
                "distance": 140,
                "line_linked": {
                "opacity": 1
                }
            },
            "bubble": {
                "distance": 400,
                "size": 40,
                "duration": 2,
                "opacity": 8,
                "speed": 3
            },
            "repulse": {
                "distance": 200,
                "duration": 0.4
            },
            "push": {
                "particles_nb": 4
            },
            "remove": {
                "particles_nb": 2
            }
        }
    }
}

window.onload = function() {
    $('.animateItem').css({opacity: 0});
    $('.animateButton').css({opacity: 0});

    loadParticles();
    loadContent();
}

function loadParticles() {
    particlesJS("particles-js", config);
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
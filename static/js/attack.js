import { victory } from "./end-game.js";
export function attack() {
    const urlParams = new URLSearchParams(window.location.search);
    const heroClass = urlParams.get('heroclass');
    const selectedHeroElement = document.getElementById('selectedHero');
    selectedHeroElement.style.backgroundImage = 'url(../static/images/field/' + heroClass + '.png)';
    const opponentHeroElement = document.getElementById('opponenthero');
    const opponentheroHealthElement = document.getElementById('Player2HealthValue');
    const fightCards = document.querySelectorAll(".field__card");
    console.log(fightCards, "fightCards")

    fightCards.forEach(function (e) {
        if (e.classList.contains('canAttack')) {
            e.style.zIndex = 10000;
            let newbg  = 'url("../../static/images/creatures-attack/' + e.style.backgroundImage.slice(35);
            e.style.backgroundImage = newbg;
            e.addEventListener("mousedown", function () {
                var svgField = document.getElementById('svg');
                var xOrigin = e.offsetLeft + e.offsetWidth / 2;
                var yOrigin = e.offsetTop + e.offsetHeight / 2;
                svg.style.display = "block";
                document.getElementById("arrowcursor").style.visibility = "visible";
                document.body.style.cursor = "none";
                e.classList.add("activeCard");

                document.body.addEventListener('mousemove', function (e2) {
                    var xDest = e2.clientX;
                    var yDest = e2.clientY;
                    var angleDeg = Math.atan2(yDest - yOrigin, xDest - xOrigin) * 180 / Math.PI;
                    var deg = angleDeg + 90;
                    document.getElementById("arrowcursor").style.left = xDest + 'px';
                    document.getElementById("arrowcursor").style.top = yDest + 30 + 'px';
                    document.getElementById("arrowcursor").style.transform = 'rotate(' + deg + 'deg) translate(-50%, -110%)';
                    svgpath.setAttribute('d', 'M' + xDest + ',' + (yDest - 75) + ' ' + xOrigin + ',' + (yOrigin - 98) + '');

                    // }
                    opponentHeroElement.addEventListener("mouseover", function () {
                        document.getElementById("innercursor").style.visibility = "visible";
                        document.getElementById("outercursor").style.visibility = "visible";
                        document.getElementById("innercursor").style.left = xDest + 'px';
                        document.getElementById("innercursor").style.top = yDest + 'px';
                        document.getElementById("outercursor").style.left = xDest + 'px';
                        document.getElementById("outercursor").style.top = yDest + 'px';
                    });

                });

                e.addEventListener("click", function () {
                    svg.style.display = "none";
                    document.body.style.cursor = "url(../static/images/cursor/cursor.png) 10 2, auto";
                    document.getElementById("arrowcursor").style.visibility = "hidden";
                    document.getElementById("innercursor").style.visibility = "hidden";
                    document.getElementById("outercursor").style.visibility = "hidden";
                    if (e.classList.contains('canAttack')) {
                        let newbg = 'url("../../static/images/creatures/' + e.style.backgroundImage.slice(42);
                        e.style.backgroundImage = newbg;
                    }
                    e.classList.remove('canAttack');
                    e.style.removeProperty("zIndex")
                });

                opponentHeroElement.onclick = function () {
                    if (svg.style.display == "block") {
                        const cardAttack = document.querySelector(".activeCard").childNodes[1].textContent;
                        opponentheroHealthElement.textContent = String(Number(opponentheroHealthElement.textContent) - cardAttack);
                        opponentheroHealthElement.style.color = '#c70d0d';
                        if (opponentheroHealthElement.textContent <= 0) { victory() }
                        setTimeout(function () {
                            opponentheroHealthElement.style.color = '#FFFFFF';
                        }, 2000);
                    };
                    svg.style.display = "none";
                    document.body.style.cursor = "url(../static/images/cursor/cursor.png) 10 2, auto";

                    document.getElementById("arrowcursor").style.visibility = "hidden";
                    document.getElementById("innercursor").style.visibility = "hidden";
                    document.getElementById("outercursor").style.visibility = "hidden";
                    if (e.classList.contains('canAttack')) {
                        let newbg = 'url("../../static/images/creatures/' + e.style.backgroundImage.slice(42);
                        e.style.backgroundImage = newbg;
                    }
                    e.classList.remove('canAttack');
                    e.style.removeProperty("zIndex");
                    e.classList.remove("activeCard");
                };

                const botCards = document.querySelectorAll(".field__empty_opp");
                const botCardsField = document.getElementById('background__field_opp')
                let emptyElement = document.createElement("div")
                emptyElement.classList.add('field__empty')
                botCards.forEach(function (e3) {
                    e3.style.zIndex = '14'
                    e3.onclick = function () {
                        if (svg.style.display == "block") {
                            e3.classList.add("activeTarget");
                            const cardAttack = document.querySelector(".activeCard").childNodes[1].textContent;
                            const botCardHP = document.querySelector(".activeTarget").childNodes[2];
                            botCardHP.textContent -= cardAttack;
                            if (botCardHP.textContent <= 0)
                            {
                                e3.remove()
                                if (!botCardsField.firstChild) {
                                    botCardsField.appendChild(emptyElement)
                                }
                            }
                            botCardHP.style.color = '#c70d0d';
                            setTimeout(function () {
                                botCardHP.style.color = '#FFFFFF';
                            }, 2000);
                        };
                        svg.style.display = "none";
                        document.body.style.cursor = "url(../static/images/cursor/cursor.png) 10 2, auto";
                        document.getElementById("arrowcursor").style.visibility = "hidden";
                        document.getElementById("innercursor").style.visibility = "hidden";
                        document.getElementById("outercursor").style.visibility = "hidden";
                        if (e.classList.contains('canAttack')) {
                            let newbg = 'url("../../static/images/creatures/' + e.style.backgroundImage.slice(42);
                            e.style.backgroundImage = newbg;
                        }
                        e.classList.remove('canAttack');
                        e.style.removeProperty("zIndex");
                        e3.classList.remove("activeTarget");
                        e.classList.remove("activeCard");
                    };
                    e3.style.removeProperty("zIndex");
                });

            }, { once: true })
        }
    })
}


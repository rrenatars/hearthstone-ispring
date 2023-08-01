import { socket } from "./websocket.js";
import { game } from "./game.js";

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
        if ((e.classList.contains('canAttack')) || (e.getAttribute("data-specification") === "rush")) {
            e.style.zIndex = 100;

            e.addEventListener("mousedown", function () {
                var svgField = document.getElementById('svg');
                var xOrigin = e.offsetLeft + e.offsetWidth / 2;
                var yOrigin = e.offsetTop + e.offsetHeight / 2;
                svg.style.display = "block";
                document.getElementById("arrowcursor").style.visibility = "visible";
                document.body.style.cursor = "none";
                e.classList.add("activeCard");
                e.style.zIndex = "-1";

                document.body.addEventListener('mousemove', function (e2) {
                    var xDest = e2.clientX;
                    var yDest = e2.clientY;
                    var angleDeg = Math.atan2(yDest - yOrigin, xDest - xOrigin) * 180 / Math.PI;
                    var deg = angleDeg + 90;
                    document.getElementById("arrowcursor").style.left = xDest + 'px';
                    document.getElementById("arrowcursor").style.top = yDest + 30 + 'px';
                    document.getElementById("arrowcursor").style.transform = 'rotate(' + deg + 'deg) translate(-50%, -110%)';
                    svgpath.setAttribute('d', 'M' + xDest + ',' + (yDest - 75) + ' ' + xOrigin + ',' + (yOrigin - 98) + '');

                    // opponentHeroElement.addEventListener("mouseover", function () {
                    //     document.getElementById("innercursor").style.visibility = "visible";
                    //     document.getElementById("outercursor").style.visibility = "visible";
                    //     document.getElementById("innercursor").style.left = opponentHeroElement.offsetLeft + opponentHeroElement.offsetWidth / 2 + "px";
                    //     document.getElementById("innercursor").style.top = opponentHeroElement.offsetTop + opponentHeroElement.offsetHeight / 2 + "px";
                    //     document.getElementById("outercursor").style.left = opponentHeroElement.offsetLeft + opponentHeroElement.offsetWidth / 2 + "px";
                    //     document.getElementById("outercursor").style.top = opponentHeroElement.offsetTop + opponentHeroElement.offsetHeight / 2 + "px";
                    // });

                });

                // e.addEventListener("click", function () {
                //     svg.style.display = "none";
                //     document.body.style.cursor = "url(../static/images/cursor/cursor.png) 10 2, auto";
                //     document.getElementById("arrowcursor").style.visibility = "hidden";
                //     document.getElementById("innercursor").style.visibility = "hidden";
                //     document.getElementById("outercursor").style.visibility = "hidden";
                //     // e.classList.remove('canAttack');
                //     e.style.removeProperty("zIndex");
                // });

                opponentHeroElement.onclick = function (p) {
                    if ((e.getAttribute("data-specification") === "rush") && !(e.classList.contains("canAttack"))) {
                        const label = document.getElementById("attackWarning");
                        label.style.visibility = "visible";
                        label.style.opacity = "1";
                        var x = Math.round(p.clientX) - label.offsetWidth / 1.5 + "px";
                        var y = Math.round(p.clientY) - label.offsetHeight / 1.5 + "px";
                        label.style.left = x;
                        label.style.top = y;
                        setTimeout(function () {
                            label.style.visibility = "hidden"
                        }, 1500);
                        label.style.transition = "all 3s";
                        label.style.fontSize = "26px"
                        label.style.opacity = "0"


                        // function warningLabel()
                        // {
                        //     const label = document.createElement("span");
                        //     label.textContent = "Дождитесь следующего хода!";
                        //     label.style.visibility = "visible";
                        //     label.style.opacity = "1";
                        //     var x = Math.round(p.clientX) - label.offsetWidth / 1.5 + "px";
                        //     var y = Math.round(p.clientY) - label.offsetHeight / 1.5 + "px";
                        //     label.style.left = x;
                        //     label.style.top = y;
                        //     setTimeout(function () {
                        //         label.style.visibility = "hidden";
                        //         label.remove()
                        //     }, 1500);
                        //     label.style.transition = "all 3s";
                        //     label.style.fontSize = "26px"
                        //     label.style.opacity = "0";
                        // }
                    }
                    else {
                        if (svg.style.display == "block") {
                            if (e.id != "heropower") {
                                const cardAttack = document.querySelector(".activeCard").childNodes[1].textContent;
                                opponentheroHealthElement.textContent = String(Number(opponentheroHealthElement.textContent) - cardAttack)
                            }
                            else {
                                opponentheroHealthElement.textContent = String(Number(opponentheroHealthElement.textContent) - 2);
                            }
                            opponentheroHealthElement.style.color = '#c70d0d';
                            if (opponentheroHealthElement.textContent <= 0) { Victory() }
                            setTimeout(function () {
                                opponentheroHealthElement.style.color = '#FFFFFF';
                            }, 2000);
                        };
                        svg.style.display = "none";
                        document.body.style.cursor = "url(../static/images/cursor/cursor.png) 10 2, auto";

                        document.getElementById("arrowcursor").style.visibility = "hidden";
                        document.getElementById("innercursor").style.visibility = "hidden";
                        document.getElementById("outercursor").style.visibility = "hidden";
                        e.classList.remove("canAttack");
                        e.removeAttribute("data-specification");
                        e.style.removeProperty("zIndex");
                        e.classList.remove("activeCard");
                    }
                };

                const botCards = document.querySelectorAll(".field__empty_opp");
                botCards.forEach(function (e3) {

                    // function provocationOnField() {

                    //     botCards.forEach(function (e4) {
                    //         if (e4.getAttribute("data-specification") === "provocation") {
                    //             return true;
                    //         }
                    //         else {
                    //             return false
                    //         } 
                    //     })
                    // };

                    // provocationOnField();

                    // if (provocationOnField === false) {
                    //     e3.onclick = botCardClick
                    // }
                    // else {
                    //     if (e3.getAttribute("data-specification") === "provocation") {
                    //         e3.onclick = botCardClick
                    //     }
                    // }

                    // provocationOnField();

                    e3.onclick = botCardClick
                    function botCardClick() {
                        if (svg.style.display == "block") {
                            e3.classList.add("activeTarget");
                            const botCardHP = document.querySelector(".activeTarget").childNodes[2];

                            collision(e, e3);

                            if ((e.getAttribute("data-specification") === "poison") || (e.getAttribute("data-specification") === "poison divineShield")) {
                                e3.classList.add("shake");
                                botCardHP.textContent -= botCardHP.textContent;
                            }
                            else {
                                const cardAttack = document.querySelector(".activeCard").childNodes[1].textContent;
                                botCardHP.textContent -= cardAttack;
                            }

                            if (botCardHP.textContent <= 0) {
                                e3.style.transition = "all 2s";
                                botCardHP.style.opacity = "0";
                                e3.style.opacity = "0"
                                setTimeout(function () {
                                    e3.remove()
                                }, 2100);

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
                        e.classList.remove("canAttack");
                        e.removeAttribute("data-specification");
                        e.style.removeProperty("zIndex");
                        e3.classList.remove("activeTarget");
                        e.classList.remove("activeCard");
                        // socket.send(JSON.stringify({
                        //     type: "attack",
                        //     data: {
                        //         player: (game.player1.turn ? true : false),
                        //         idAttack: e.id,
                        //         idDefense: e3.id,
                        //     }
                        // }))
                    };
                });
            }, { once: true })

        }
    })
}

function collision(attacker, defender) {
    const tempBlock = document.createElement("div");
    tempBlock.classList.add("field__card");
    document.getElementById("background__field").insertBefore(tempBlock, attacker.nextSibling);
    attacker.style.position = "absolute";
    attacker.style.width = "110px";
    attacker.style.height = "144px";
    attacker.style.left = tempBlock.getBoundingClientRect().left + "px";
    attacker.style.top = tempBlock.getBoundingClientRect().top + "px";
    attacker.style.zIndex = "101";
    setTimeout(function () {
        attacker.style.transition = "all 0.3s";
        attacker.style.marginTop = defender.getBoundingClientRect().top - attacker.getBoundingClientRect().top + defender.offsetHeight - defender.offsetHeight / 2 + "px";
        if ((defender.getBoundingClientRect().left - attacker.getBoundingClientRect().left) > 0) {
            attacker.style.marginLeft = defender.getBoundingClientRect().left - attacker.getBoundingClientRect().left - defender.offsetWidth / 3 + "px";
        }
        else if ((defender.getBoundingClientRect().left - attacker.getBoundingClientRect().left) < 0) {
            attacker.style.marginLeft = defender.getBoundingClientRect().left - attacker.getBoundingClientRect().left + defender.offsetWidth / 3 + "px";
        }
        else {
            attacker.style.marginLeft = "0px";
        }

        setTimeout(back, 1000);

    }, 200)

    function back() {
        attacker.style.transition = "all 5s";
        attacker.style.marginTop = -(defender.getBoundingClientRect().top - attacker.getBoundingClientRect().top + defender.offsetHeight - defender.offsetHeight / 2) + "px";
        if ((defender.getBoundingClientRect().left - attacker.getBoundingClientRect().left) > 0) {
            attacker.style.marginLeft = -(defender.getBoundingClientRect().left - attacker.getBoundingClientRect().left - defender.offsetWidth / 3) + "px";
        }
        else if ((defender.getBoundingClientRect().left - attacker.getBoundingClientRect().left) < 0) {
            attacker.style.marginLeft = -(defender.getBoundingClientRect().left - attacker.getBoundingClientRect().left + defender.offsetWidth / 3) + "px";
        }
        else {
            attacker.style.marginLeft = "0px";
        }
        document.getElementById("background__field").insertBefore(attacker, tempBlock.nextSibling);
        attacker.style.position = "none";
        attacker.style.width = "100px";
        attacker.style.height = "134px";
        attacker.style.zIndex = "-1";
    }
}

function Lose() {
    const urlParams = new URLSearchParams(window.location.search);
    const heroClass = urlParams.get('heroclass');
    const loseImage = document.getElementById('loseimg');
    const endbg = document.getElementById('endbg');
    loseImage.style.backgroundImage = "url(../static/images/field/" + heroClass + "LoseGame.png)";
    loseImage.style.width = "863px";
    loseImage.style.height = "818px";
    loseImage.style.zIndex = 9999;
    loseImage.style.position = "absolute";
    loseImage.style.top = "50%";
    loseImage.style.left = "50%";
    loseImage.style.marginRight = "-50%";
    loseImage.style.transform = "translate(-50%, -50%)";
    endbg.style.zIndex = 999;
    endbg.style.backdropFilter = "blur(3px)";
    endbg.style.textAlign = "center";
    endbg.style.margin = "0";
    endbg.style.width = "100%";
    endbg.style.height = "100%";
    endbg.style.position = "absolute";
    endbg.style.bottom = "0";
    endbg.style.top = "0";
    endbg.style.left = "0";
    endbg.style.right = "0";
    endbg.style.backgroundColor = "#666666";
    endbg.style.opacity = "0.95";
}

function Victory() {
    const urlParams = new URLSearchParams(window.location.search);
    const heroClass = urlParams.get('heroclass');
    const winImage = document.getElementById('winimg');
    const endbg = document.getElementById('endbg');
    winImage.style.backgroundImage = "url(../static/images/field/" + heroClass + "WinGame.png)";
    winImage.style.width = "793px";
    winImage.style.height = "704px";
    winImage.style.zIndex = 9999;
    winImage.style.position = "absolute";
    winImage.style.top = "50%";
    winImage.style.left = "50%";
    winImage.style.marginRight = "-50%";
    winImage.style.transform = "translate(-50%, -50%)";
    endbg.style.zIndex = 999;
    endbg.style.backdropFilter = "blur(3px)";
    endbg.style.textAlign = "center";
    endbg.style.margin = "0";
    endbg.style.width = "100%";
    endbg.style.height = "100%";
    endbg.style.position = "absolute";
    endbg.style.bottom = "0";
    endbg.style.top = "0";
    endbg.style.left = "0";
    endbg.style.right = "0";
    endbg.style.backgroundColor = "#666666";
    endbg.style.opacity = "0.95";
}
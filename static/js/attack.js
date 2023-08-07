import {victory} from "./end-game.js";
import {socket} from "./websocket.js"
import {game} from "./game.js"

export function attack() {
    const urlParams = new URLSearchParams(window.location.search);
    const heroClass = urlParams.get('heroclass');
    const selectedHeroElement = document.getElementById('selectedHero');
    selectedHeroElement.style.backgroundImage = 'url(../static/images/field/' + heroClass + '.png)';
    const opponentHeroElement = document.getElementById('opponenthero');
    const opponentheroHealthElement = document.getElementById('Player2HealthValue');
    const fightCards = document.querySelectorAll(".field__card");
    const myBattlefield = document.getElementById("background__field")
    const enemyBattlefield = document.getElementById("background__field_opp")
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
                // e.style.zIndex = "-1";

                document.body.addEventListener('mousemove', function (e2) {
                    if (document.querySelector(".activeCard")) {
                        var xDest = e2.clientX;
                        var yDest = e2.clientY;
                        var angleDeg = Math.atan2(yDest - yOrigin, xDest - xOrigin) * 180 / Math.PI;
                        var deg = angleDeg + 90;
                        document.getElementById("arrowcursor").style.left = xDest + 'px';
                        document.getElementById("arrowcursor").style.zIndex = 14;
                        document.getElementById("arrowcursor").style.top = yDest + 30 + 'px';
                        document.getElementById("arrowcursor").style.transform = 'rotate(' + deg + 'deg) translate(-50%, -110%)';
                        svgpath.setAttribute('d', 'M' + xDest + ',' + (yDest - 75) + ' ' + xOrigin + ',' + (yOrigin - 98) + '');
                    }
                    if (document.querySelector(".activeCard")) {
                        let cardsHand = document.querySelectorAll(".cards__card")
                        cardsHand.forEach((cardHand) => {
                            console.log(document.getElementById("arrowcursor"))
                            cardHand.classList.remove("cards__card")
                            cardHand.classList.add("cards__card_hover-off")
                        });
                    }

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
                    } else {
                        if (svg.style.display == "block") {
                            if (e.id != "heropower") {
                                const cardAttack = document.querySelector(".activeCard").childNodes[1].textContent;
                                opponentheroHealthElement.textContent = String(Number(opponentheroHealthElement.textContent) - cardAttack)
                            } else {
                                opponentheroHealthElement.textContent = String(Number(opponentheroHealthElement.textContent) - 2);
                            }
                            opponentheroHealthElement.style.color = '#c70d0d';
                            if (opponentheroHealthElement.textContent <= 0) {
                                victory()
                            }
                            setTimeout(function () {
                                opponentheroHealthElement.style.color = '#FFFFFF';
                            }, 2000);
                        }
                        ;
                        svg.style.display = "none";
                        document.body.style.cursor = "url(../static/images/cursor/cursor.png) 10 2, auto";

                        document.getElementById("arrowcursor").style.visibility = "hidden";
                        document.getElementById("innercursor").style.visibility = "hidden";
                        document.getElementById("outercursor").style.visibility = "hidden";
                        e.classList.remove("canAttack");
                        e.removeAttribute("data-specification");
                        e.style.removeProperty("zIndex");
                        e.classList.remove("activeCard");

                        let cardsHand = document.querySelectorAll(".cards__card_hover-off")
                        console.log(cardsHand, "attack")
                        cardsHand.forEach((cardHand) => {
                            console.log("----", cardHand)
                            cardHand.classList.add("cards__card")
                            cardHand.classList.remove("cards__card_hover-off")
                        });
                        socket.send(JSON.stringify({
                            type: "attack",
                            data: {
                                player: (game.player1.turn ? game.player1.name : game.player2.name),
                                idAttack: e.id,
                                idDefense: opponentHeroElement.id,
                            }
                        }))
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
                            const botCard = document.querySelector(".activeTarget")
                            const botCardHP = botCard.childNodes[2];
                            const botCardAttackValue = botCard.querySelector(".card__attack").textContent

                            const cardAttack = document.querySelector(".activeCard")
                            const cardAttackValue = cardAttack.childNodes[1].textContent;
                            const cardAttackHP = cardAttack.querySelector(".card__hp")

                            collision(e, e3);

                            if ((e.getAttribute("data-specification") === "poisonous")) {
                                e3.classList.add("shake");
                                botCardHP.textContent = 0;
                                console.log(botCardHP);
                                console.log(botCardHP.textContent)
                                console.log("poisonous")
                            } else {
                                botCardHP.textContent -= cardAttackValue;
                                cardAttackHP.textContent -= botCardAttackValue
                                console.log("bot card hp", botCardHP)
                                console.log("card attack hp", cardAttackHP)
                            }

                            if (botCardHP.textContent <= 0) {
                                e3.style.transition = "all 2s";
                                botCardHP.style.opacity = "0";
                                e3.style.opacity = "0"
                                setTimeout(function () {
                                    e3.remove()
                                    if (enemyBattlefield.childElementCount === 0) {
                                        let emptyField = document.createElement("div")
                                        emptyField.classList.add("field__empty_opp")
                                        enemyBattlefield.append(emptyField)
                                    }
                                }, 2100);
                            }

                            if (cardAttackHP.textContent <= 0) {
                                e.style.transition = "all 2s";
                                cardAttackHP.style.opacity = "0";
                                e.style.opacity = "0"
                                setTimeout(function () {
                                    e.remove()
                                    if (myBattlefield.childElementCount === 0) {
                                        let emptyField = document.createElement("div")
                                        emptyField.classList.add("field__empty")
                                        myBattlefield.append(emptyField)
                                    }
                                }, 2100);
                            }

                            botCardHP.style.color = '#c70d0d';
                            setTimeout(function () {
                                botCardHP.style.color = '#FFFFFF';
                            }, 2000);

                            cardAttackHP.style.color = '#c70d0d';
                            setTimeout(function () {
                                cardAttackHP.style.color = '#FFFFFF';
                            }, 2000);
                        }
                        ;
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

                        let cardsHand = document.querySelectorAll(".cards__card_hover-off")
                        cardsHand.forEach((cardHand) => {
                            cardHand.classList.add("cards__card")
                            cardHand.classList.remove("cards__card_hover-off")
                        });
                        socket.send(JSON.stringify({
                            type: "attack",
                            data: {
                                player: localStorage.getItem("id"),
                                idAttack: e.id,
                                idDefense: e3.id,
                            }
                        }))
                    };
                });
            }, {once: true})

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
        } else if ((defender.getBoundingClientRect().left - attacker.getBoundingClientRect().left) < 0) {
            attacker.style.marginLeft = defender.getBoundingClientRect().left - attacker.getBoundingClientRect().left + defender.offsetWidth / 3 + "px";
        } else {
            attacker.style.marginLeft = "0px";
        }

        setTimeout(back, 1000);

    }, 200)

    function back() {
        attacker.style.transition = "all 5s";
        attacker.style.marginTop = -(defender.getBoundingClientRect().top - attacker.getBoundingClientRect().top + defender.offsetHeight - defender.offsetHeight / 2) + "px";
        if ((defender.getBoundingClientRect().left - attacker.getBoundingClientRect().left) > 0) {
            attacker.style.marginLeft = -(defender.getBoundingClientRect().left - attacker.getBoundingClientRect().left - defender.offsetWidth / 3) + "px";
        } else if ((defender.getBoundingClientRect().left - attacker.getBoundingClientRect().left) < 0) {
            attacker.style.marginLeft = -(defender.getBoundingClientRect().left - attacker.getBoundingClientRect().left + defender.offsetWidth / 3) + "px";
        } else {
            attacker.style.marginLeft = "0px";
        }
        document.getElementById("background__field").insertBefore(attacker, tempBlock.nextSibling);
        attacker.style.position = "none";
        attacker.style.width = "100px";
        attacker.style.height = "134px";
        attacker.style.zIndex = "-1";
    }
}


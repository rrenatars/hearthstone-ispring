import {victory} from "./end-game.js";
import {socket} from "./websocket.js"
import {game} from "./game.js"

export function attack() {
    const urlParams = new URLSearchParams(window.location.search);
    const heroClass = urlParams.get("heroclass");
    const selectedHeroElement = document.getElementById("selectedHero");
    const selectedHeroPowerElement = document.getElementById("heropower");
    selectedHeroElement.style.backgroundImage = "url(../static/images/field/' + heroClass + '.png)";
    const opponentHeroElement = document.getElementById("opponenthero");
    const opponentheroHealthElement = document.getElementById("Player2HealthValue");
    const fightCards = document.querySelectorAll(".field__card");
    const manaElement = document.getElementById("MyMana");
    const myBattlefield = document.getElementById("background__field")
    const enemyBattlefield = document.getElementById("background__field_opp")
    console.log(fightCards, "fightCards");
    var tauntOnField = false;

    if (heroClass == "Mage") {
        selectedHeroPowerElement.classList.add("field__card");
        let mana = parseInt(manaElement.textContent);
        if (mana >= 2) {
            selectedHeroPowerElement.classList.add("canAttack")
        } else {
            selectedHeroPowerElement.classList.remove("canAttack")
        }
    }


    fightCards.forEach(function (e) {
        if ((e.classList.contains('canAttack')) || (e.getAttribute("data-specification") === "rush")) {
            e.style.zIndex = 100;

            e.addEventListener("mousedown", function () {
                var xOrigin = e.offsetLeft + e.offsetWidth / 2;
                var yOrigin = e.offsetTop + e.offsetHeight / 2;
                svg.style.display = "block";
                document.getElementById("arrowcursor").style.visibility = "visible";
                document.body.style.cursor = "none";
                e.classList.add("activeCard");
                e.style.zIndex = "-1";

                document.body.addEventListener('mousemove', function (e2) {
                    if (document.querySelector(".activeCard")) {
                        var xDest = e2.clientX;
                        var yDest = e2.clientY;
                        var angleDeg = Math.atan2(yDest - yOrigin, xDest - xOrigin) * 180 / Math.PI;
                        var deg = angleDeg + 90;
                        document.getElementById("arrowcursor").style.left = xDest + 'px';
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
                        const comment = document.getElementById("comment");
                        const commentText = document.getElementById("commentText");
                        commentText.innerText = "Это существо\nсможет атаковать в\nмой следующий ход.";
                        comment.style.opacity = "1";
                        commentText.style.fontSize = "17px";
                        setTimeout(function () {
                            comment.style.opacity = "0"
                        }, 1500);

                        opponentHeroElement.classList.remove("activeTarget");
                        e.classList.remove("activeCard");
                        e.classList.remove("canAttack");
                        e.removeAttribute("data-specification");
                        e.style.removeProperty("zIndex");
                    } else if (tauntOnField === true) {
                        if (svg.style.display == "block") {
                            const comment = document.getElementById("comment");
                            const commentText = document.getElementById("commentText");
                            if ((heroClass == "Mage") || (heroClass == "Rogue")) {
                                commentText.innerText = "Я должна\nатаковать\nпровокатора."
                            } else {
                                commentText.innerText = "Я должен\nатаковать\nпровокатора."
                            }
                            comment.style.opacity = "1";
                            commentText.style.fontSize = "20px";
                            setTimeout(function () {
                                comment.style.opacity = "0"
                            }, 1500);
                        }
                    } else {
                        if (svg.style.display == "block") {

                            if (e.id != "heropower") {
                                collision(e, opponentHeroElement);
                            }

                            setTimeout(
                                () => {

                                    if (e.id != "heropower") {
                                        const cardAttack = document.querySelector(".activeCard").childNodes[1].textContent;
                                        opponentheroHealthElement.textContent = String(Number(opponentheroHealthElement.textContent) - cardAttack)
                                    } else {
                                        opponentheroHealthElement.textContent = String(Number(opponentheroHealthElement.textContent) - 1);
                                    }
                                    opponentheroHealthElement.style.color = '#c70d0d';
                                    if (opponentheroHealthElement.textContent <= 0) {
                                        Victory()
                                    }
                                    setTimeout(function () {
                                        opponentheroHealthElement.style.color = '#FFFFFF';
                                    }, 2000);
                                }, 255)
                            svg.style.display = "none";
                            document.body.style.cursor = "url(../static/images/cursor/cursor.png) 10 2, auto";

                            document.getElementById("arrowcursor").style.visibility = "hidden";
                            document.getElementById("innercursor").style.visibility = "hidden";
                            document.getElementById("outercursor").style.visibility = "hidden";
                        }
                        ;
                    }

                    let cardsHand = document.querySelectorAll(".cards__card_hover-off")
                    console.log(cardsHand, "attack")
                    cardsHand.forEach((cardHand) => {
                        console.log("----", cardHand)
                        cardHand.classList.add("cards__card")
                        cardHand.classList.remove("cards__card_hover-off")
                    });
                };

                const botCards = document.querySelectorAll(".field__empty_opp");
                botCards.forEach(function (e3) {
                    tauntOnField = false;

                    botCards.forEach(function (e4) {
                        if (e4.getAttribute("data-specification") === "taunt") {
                            e4.onclick = botCardClick;
                            tauntOnField = true
                        }
                    })

                    // if (e3.getAttribute("data-specification") === "divine-shield")
                    // {
                    //     let shield = document.createElement("img");
                    //     shield.src = "/static/images/field/divine-shield.png";
                    //     e3.style.position = "relative";
                    //     shield.classList.add("divine-shield")
                    //     e3.appendChild(shield);
                    // }

                    if (tauntOnField === false) {
                        e3.onclick = botCardClick
                    } else {
                        e3.onclick = () => {
                            if (svg.style.display == "block") {
                                const comment = document.getElementById("comment");
                                const commentText = document.getElementById("commentText");
                                if ((heroClass == "Mage") || (heroClass == "Rogue")) {
                                    commentText.innerText = "Я должна\nатаковать\nпровокатора."
                                } else {
                                    commentText.innerText = "Я должен\nатаковать\nпровокатора."
                                }
                                comment.style.opacity = "1";
                                commentText.style.fontSize = "20px";
                                setTimeout(function () {
                                    comment.style.opacity = "0"
                                }, 1500);
                            }
                        }
                    }


                    function botCardClick() {

                        if (svg.style.display == "block") {

                            if (e.id != "heropower") {
                                collision(e, this)
                            }

                            const cardAttack = document.querySelector(".activeCard")
                            const cardAttackHP = cardAttack.querySelector(".card__hp")

                            setTimeout(
                                () => {
                                    this.classList.add("activeTarget");
                                    const botCardHP = document.querySelector(".activeTarget").childNodes[2];
                                    const botCardAttack = document.querySelector(".activeTarget").childNodes[1]
                                    if (e.id == "heropower") {
                                        botCardHP.textContent -= 1;
                                    } else if (e.getAttribute("data-specification") === "poisonous") {
                                        botCardHP.textContent -= botCardHP.textContent;
                                    } else {
                                        const cardAttackValue = cardAttack.childNodes[1];
                                        botCardHP.textContent -= cardAttackValue.textContent;
                                        cardAttackHP.textContent -= botCardAttack.textContent
                                    }

                                    if (botCardHP.textContent <= 0) {
                                        this.style.transition = "all 1s";
                                        this.classList.add("killed");
                                        this.style.opacity = "0";
                                        var killed = this
                                        setTimeout(function () {
                                            killed.remove()
                                            if (enemyBattlefield.childElementCount === 0) {
                                                let emptyField = document.createElement("div")
                                                emptyField.classList.add("field__empty_opp")
                                                enemyBattlefield.append(emptyField)
                                            }
                                        }, 1010);
                                    }

                                    if (cardAttackHP.textContent <= 0) {
                                        e.style.transition = "all 1s";
                                        e.classList.add("killed");
                                        e.style.opacity = "0";
                                        var killed = e
                                        setTimeout(function () {
                                            e.remove()
                                            if (myBattlefield.childElementCount === 0) {
                                                let emptyField = document.createElement("div")
                                                emptyField.classList.add("field__empty")
                                                myBattlefield.append(emptyField)
                                            }
                                        }, 1010);
                                    }

                                    botCardHP.style.color = '#c70d0d';
                                    setTimeout(function () {
                                        botCardHP.style.color = '#FFFFFF';
                                    }, 1500);

                                    cardAttackHP.style.color = '#c70d0d';
                                    setTimeout(function () {
                                        cardAttackHP.style.color = '#FFFFFF';
                                    }, 1500);
                                }, 255)


                        }
                        ;
                        svg.style.display = "none";
                        document.body.style.cursor = "url(../static/images/cursor/cursor.png) 10 2, auto";
                        document.getElementById("arrowcursor").style.visibility = "hidden";
                        document.getElementById("innercursor").style.visibility = "hidden";
                        document.getElementById("outercursor").style.visibility = "hidden";
                    };
                });
            }, {once: true})

        }
    })
}

export function collision(attacker, defender) {
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
        attacker.style.transition = "all 0.05s";
        attacker.style.marginTop = defender.getBoundingClientRect().top - attacker.getBoundingClientRect().top + defender.offsetHeight - defender.offsetHeight / 2 + "px";
        if ((defender.getBoundingClientRect().left - attacker.getBoundingClientRect().left) > 0) {
            attacker.style.marginLeft = defender.getBoundingClientRect().left - attacker.getBoundingClientRect().left - defender.offsetWidth / 3 + "px";
        } else if ((defender.getBoundingClientRect().left - attacker.getBoundingClientRect().left) < 0) {
            attacker.style.marginLeft = defender.getBoundingClientRect().left - attacker.getBoundingClientRect().left + defender.offsetWidth / 3 + "px";
        } else {
            attacker.style.marginLeft = "0px";
        }
        ;

        damageImg();
        setTimeout(back, 1000);

    }, 200)

    function back() {
        attacker.style.transition = "all 1s";
        attacker.style.marginTop = -(defender.getBoundingClientRect().top - attacker.getBoundingClientRect().top + defender.offsetHeight - defender.offsetHeight / 2) + "px";
        if ((defender.getBoundingClientRect().left - attacker.getBoundingClientRect().left) > 0) {
            attacker.style.marginLeft = -(defender.getBoundingClientRect().left - attacker.getBoundingClientRect().left - defender.offsetWidth / 3) + "px";
        } else if ((defender.getBoundingClientRect().left - attacker.getBoundingClientRect().left) < 0) {
            attacker.style.marginLeft = -(defender.getBoundingClientRect().left - attacker.getBoundingClientRect().left + defender.offsetWidth / 3) + "px";
        } else {
            attacker.style.marginLeft = "0px";
        }
        document.getElementById("background__field").insertBefore(attacker, tempBlock.nextSibling);
        attacker.style.position = "static";
        attacker.style.width = "100px";
        attacker.style.height = "134px";
        attacker.style.zIndex = "-1";
        tempBlock.remove();
        defender.classList.remove("activeTarget");
        attacker.classList.remove("activeCard");
        attacker.classList.remove("canAttack");
        attacker.removeAttribute("data-specification");
        attacker.style.removeProperty("zIndex");
        console.log("сработал remove")
    }

    function damageImg() {
        console.log("damage img")
        const attackValue = document.querySelector(".activeCard").childNodes[1].textContent;
        let damageImage = document.createElement("img");
        let damageText = document.createElement("div");
        damageImage.src = "/static/images/field/damage.png";
        defender.style.position = "relative";
        if (attacker.getAttribute("data-specification") === "taunt") {
            damageImage.classList.add("tauntDamage");
            damageText.classList.add("tauntDamageText");
        } else if (defender.id == "opponenthero") {
            defender.style.position = "absolute";
            damageImage.classList.add("opponentHeroDamage");
            damageText.classList.add("opponentHeroDamageText");
        } else {
            damageImage.classList.add("damage");
            damageText.classList.add("damageText");
        }
        if ((attacker.getAttribute("data-specification") === "poisonous") && (defender.id != "opponenthero")) {
            const hpValue = defender.childNodes[2].textContent;
            damageText.innerText = String(-hpValue);
        } else {
            if (attackValue != 0) {
                damageText.innerText = String(-attackValue)
            }
        }
        defender.appendChild(damageImage);
        defender.appendChild(damageText);
        setTimeout(
            () => {
                damageImage.style.transition = "all 1.2s";
                damageText.style.transition = "all 1.2s";
                damageImage.style.opacity = "0";
                damageText.style.opacity = "0";
                setTimeout(
                    () => {
                        damageImage.remove();
                        damageText.remove();

                        socket.send(JSON.stringify({
                            type: "attack",
                            data: {
                                player: (localStorage.getItem("id")),
                                idAttack: attacker.id,
                                idDefense: defender.id,
                            }
                        }))
                    }, 1200)
            }, 500)
    }
}
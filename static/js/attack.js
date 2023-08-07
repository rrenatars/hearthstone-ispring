import { socket } from "./websocket.js";
import { game } from "./game.js";

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
    console.log(fightCards, "fightCards");
    var tauntOnField = false;

    if (heroClass == "Mage") {
        selectedHeroPowerElement.classList.add("field__card");
        let mana = parseInt(manaElement.textContent);
        if (mana >= 2) {
            selectedHeroPowerElement.classList.add("canAttack")
        }
        else {
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
                    var xDest = e2.clientX;
                    var yDest = e2.clientY;
                    var angleDeg = Math.atan2(yDest - yOrigin, xDest - xOrigin) * 180 / Math.PI;
                    var deg = angleDeg + 90;
                    document.getElementById("arrowcursor").style.left = xDest + 'px';
                    document.getElementById("arrowcursor").style.top = yDest + 30 + 'px';
                    document.getElementById("arrowcursor").style.transform = 'rotate(' + deg + 'deg) translate(-50%, -110%)';
                    svgpath.setAttribute('d', 'M' + xDest + ',' + (yDest - 75) + ' ' + xOrigin + ',' + (yOrigin - 98) + '');

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

                    }
                    else if (tauntOnField === true) {
                        if (svg.style.display == "block") {
                            const comment = document.getElementById("comment");
                            const commentText = document.getElementById("commentText");
                            if ((heroClass == "Mage") || (heroClass == "Rogue")) {
                                commentText.innerText = "Я должна\nатаковать\nпровокатора."
                            }
                            else {
                                commentText.innerText = "Я должен\nатаковать\nпровокатора."
                            }
                            comment.style.opacity = "1";
                            commentText.style.fontSize = "20px";
                            setTimeout(function () {
                                comment.style.opacity = "0"
                            }, 1500);
                        }
                    }
                    else {
                        if (svg.style.display == "block") {

                            if (e.id != "heropower") {
                                collision(e, opponentHeroElement);
                            }

                            setTimeout(
                                () => {

                                    if (e.id != "heropower") {
                                        const cardAttack = document.querySelector(".activeCard").childNodes[1].textContent;
                                        opponentheroHealthElement.textContent = String(Number(opponentheroHealthElement.textContent) - cardAttack)
                                    }
                                    else {
                                        opponentheroHealthElement.textContent = String(Number(opponentheroHealthElement.textContent) - 1);
                                    }
                                    opponentheroHealthElement.style.color = '#c70d0d';
                                    if (opponentheroHealthElement.textContent <= 0) { Victory() }
                                    setTimeout(function () {
                                        opponentheroHealthElement.style.color = '#FFFFFF';
                                    }, 2000);

                                }, 255)
                        };
                    }
                    svg.style.display = "none";
                    document.body.style.cursor = "url(../static/images/cursor/cursor.png) 10 2, auto";

                    document.getElementById("arrowcursor").style.visibility = "hidden";
                    document.getElementById("innercursor").style.visibility = "hidden";
                    document.getElementById("outercursor").style.visibility = "hidden";

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
                    }
                    else {
                        e3.onclick = () => {
                            if (svg.style.display == "block") {
                                const comment = document.getElementById("comment");
                                const commentText = document.getElementById("commentText");
                                if ((heroClass == "Mage") || (heroClass == "Rogue")) {
                                    commentText.innerText = "Я должна\nатаковать\nпровокатора."
                                }
                                else {
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

                            setTimeout(
                                () => {
                                    this.classList.add("activeTarget");
                                    const botCardHP = document.querySelector(".activeTarget").childNodes[2];
                                    if (e.id == "heropower") {
                                        botCardHP.textContent -= 1;
                                    }
                                    else if (e.getAttribute("data-specification") === "poisonous")
                                    {
                                        botCardHP.textContent -= botCardHP.textContent;
                                    }
                                    else {
                                        const cardAttack = document.querySelector(".activeCard").childNodes[1].textContent;
                                        botCardHP.textContent -= cardAttack;
                                    }

                                    if (botCardHP.textContent <= 0) {
                                        this.style.transition = "all 1s";
                                        this.classList.add("killed");
                                        this.style.opacity = "0";
                                        var killed = this
                                        setTimeout(function () {
                                            killed.remove()
                                        }, 1010);

                                    }

                                    botCardHP.style.color = '#c70d0d';
                                    setTimeout(function () {
                                        botCardHP.style.color = '#FFFFFF';
                                    }, 1500);
                                }, 255)


                        };
                        svg.style.display = "none";
                        document.body.style.cursor = "url(../static/images/cursor/cursor.png) 10 2, auto";
                        document.getElementById("arrowcursor").style.visibility = "hidden";
                        document.getElementById("innercursor").style.visibility = "hidden";
                        document.getElementById("outercursor").style.visibility = "hidden";

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
        }
        else if ((defender.getBoundingClientRect().left - attacker.getBoundingClientRect().left) < 0) {
            attacker.style.marginLeft = defender.getBoundingClientRect().left - attacker.getBoundingClientRect().left + defender.offsetWidth / 3 + "px";
        }
        else {
            attacker.style.marginLeft = "0px";
        };

        damageImg();
        setTimeout(back, 1000);

    }, 200)


    function back() {
        attacker.style.transition = "all 1s";
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
    }

    function damageImg() {
        const attackValue = document.querySelector(".activeCard").childNodes[1].textContent;
        let damageImage = document.createElement("img");
        let damageText = document.createElement("div");
        damageImage.src = "/static/images/field/damage.png";
        defender.style.position = "relative";
        if (attacker.getAttribute("data-specification") === "taunt") {
            damageImage.classList.add("tauntDamage");
            damageText.classList.add("tauntDamageText");
        }
        else if (defender.id == "opponenthero")
        {
            defender.style.position = "absolute";
            damageImage.classList.add("opponentHeroDamage");
            damageText.classList.add("opponentHeroDamageText");
        }
        else {
            damageImage.classList.add("damage");
            damageText.classList.add("damageText");
        }
        if ((attacker.getAttribute("data-specification") === "poisonous") && (defender.id != "opponenthero")) {
            const hpValue = defender.childNodes[2].textContent;
            damageText.innerText = String(-hpValue);
        }
        else {
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
                    }, 1200)
            }, 500)
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
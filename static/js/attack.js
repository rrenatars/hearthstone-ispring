export function attack() {
    const urlParams = new URLSearchParams(window.location.search);
    const heroClass = urlParams.get('heroclass');
    const selectedHeroElement = document.getElementById('selectedHero');
    selectedHeroElement.style.backgroundImage = 'url(../static/images/field/' + heroClass + '.png)';
    const selectedHeroPowerElement = document.getElementById('heropower');
    selectedHeroPowerElement.style.backgroundImage = 'url(../static/images/field/' + heroClass + 'power.png)';
    const heroHealthElement = document.getElementById('Player1HealthValue');
    let player1HealthValue = parseInt(heroHealthElement.textContent);
    const opponentHeroElement = document.getElementById('opponenthero');
    const opponentheroHealthElement = document.getElementById('Player2HealthValue');
    let player2HealthValue = parseInt(opponentheroHealthElement.textContent);
    const winImage = document.getElementById('winimg');
    const loseImage = document.getElementById('loseimg');
    const endbg = document.getElementById('endbg');
    const fightCards = document.querySelectorAll(".field__card");

    fightCards.forEach(function (e){
        if (e.classList.contains('canAttack')) {
            e.addEventListener("mousedown", function () {
                var svgField = document.getElementById('svg');
                var xOrigin = e.offsetLeft + e.offsetWidth / 2;
                var yOrigin = e.offsetTop + e.offsetHeight / 2;
                svg.style.display = "block";
                document.getElementById("arrowcursor").style.visibility = "visible";
                document.body.style.cursor = "none";

                const cardAttack = e.querySelector('.card__attack').textContent

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
                    //     document.getElementById("innercursor").style.left = xDest + 'px';
                    //     document.getElementById("innercursor").style.top = yDest + 'px';
                    //     document.getElementById("outercursor").style.left = xDest + 'px';
                    //     document.getElementById("outercursor").style.top = yDest + 'px';
                    // });


                    e.addEventListener("click", function () {
                        svg.style.display = "none";
                        document.body.style.cursor = "url(../static/images/cursor/cursor.png) 10 2, auto";
                        document.getElementById("arrowcursor").style.visibility = "hidden";
                        document.getElementById("innercursor").style.visibility = "hidden";
                        document.getElementById("outercursor").style.visibility = "hidden";
                        e.classList.remove('canAttack');
                    });

                    opponentHeroElement.addEventListener("click", function () {
                        if (svg.style.display == "block") {
                            opponentheroHealthElement.textContent = String(Number(opponentheroHealthElement.textContent) - parseInt(cardAttack));
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
                        e.classList.remove('canAttack');
                    });

                    const botCards = document.querySelectorAll(".field__empty_opp");
                    botCards.forEach(function (e3) {
                        e3.addEventListener("click", function () {
                            if (svg.style.display == "block") {
                                opponentheroHealthElement.textContent = String(Number(opponentheroHealthElement.textContent) - parseInt(cardAttack));
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
                            e.classList.remove('canAttack');

                        });
                    })


                })
            })

        }
    })
}

function Victory() {
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

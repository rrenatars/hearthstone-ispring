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

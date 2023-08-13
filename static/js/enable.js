const beforeStyleAnim = document.createElement("style");
document.head.appendChild(beforeStyleAnim);

export function enableToDrag(manaValue) {
    function animateCardsEnableToDrag(b, s) {
        beforeStyleAnim.innerHTML = `.cards__card_enable-to-drag::before {` +
            `filter: brightness(1) sepia(1) hue-rotate(60deg) saturate(` + s + `) blur(` + b + `px);
        }`;

        setTimeout(function () {
            if (b === 9) {
                animateCardsEnableToDrag(6, s);
            } else if (s === 16) {
                animateCardsEnableToDrag(b + 1, 4);
            } else {
                animateCardsEnableToDrag(b + 1, s + 1)
            }
        }, 500);
    }

    const cards = document.querySelectorAll(".cards__card")

    cards.forEach((card) => {
        if ((manaValue >= parseInt(card.querySelector(".card__mana").textContent)) && (document.querySelectorAll(".field__card").length < 7)) {
            card.classList.add("cards__card_enable-to-drag")
            const style = window.getComputedStyle(card, "::before");
            const cardPortraitUrl = card.style.backgroundImage.match(/url\(["']?([^"']+)["']?\)/)[1];
            let beforeStyle = document.createElement('style');
            beforeStyle.innerHTML = `
            .cards__card_enable-to-drag::before {
                background-image: url(` + cardPortraitUrl + `);
            }
            `;
            // Добавляем созданный стиль в голову документа
            document.head.appendChild(beforeStyle);

            const innerE = document.createElement("div")
            innerE.style.backgroundImage = "url(" + cardPortraitUrl + ")"
            innerE.style.backgroundSize = "cover"
            innerE.classList.add("cards__card_inner")
            card.style.backgroundImage = ''
            card.append(innerE)

            animateCardsEnableToDrag(6, 4);
        }
    })
}

export function enableToAttack(cardsToAttack) {
    function animateCardsEnableToAttack(b, s) {
        beforeStyleAnim.innerHTML = `.canAttack::before {` +
            `filter: brightness(1) sepia(1) hue-rotate(60deg) saturate(` + s + `) blur(` + b + `px);
    }`;

        setTimeout(function () {
            if (b === 9) {
                animateCardsEnableToAttack(6, s);
            } else if (s === 16) {
                animateCardsEnableToAttack(b + 1, 4);
            } else {
                animateCardsEnableToAttack(b + 1, s + 1)
            }
        }, 500);
    }

    for (const card of document.querySelectorAll(".field__card")) {
        card.classList.remove("canAttack")
    }

    const cardsOnField = document.querySelectorAll(".field__card")
    for (let i = 0; i < cardsToAttack.length; i++) {
        for (let j = 0; j < cardsOnField.length; j++) {
            if (i === j && cardsToAttack[i].cardID === cardsOnField[j].id) {
                cardsOnField[j].classList.add("canAttack")
                const cardPortraitUrl = cardsOnField[j].style.backgroundImage.match(/url\(["']?([^"']+)["']?\)/)[1];

                const innerE = document.createElement("div")
                innerE.style.backgroundImage = "url(" + cardPortraitUrl + ")"
                innerE.style.backgroundSize = "cover"
                innerE.classList.add("cards__card_inner")
                cardsOnField[j].style.backgroundImage = ''
                const hpElement = cardsOnField[j].querySelector(".card__hp")
                const manaElement = cardsOnField[j].querySelector(".card__mana")
                const attackElement = cardsOnField[j].querySelector(".card__attack")

                innerE.append(attackElement)
                innerE.append(hpElement)
                innerE.append(manaElement)

                cardsOnField[j].append(innerE)

                animateCardsEnableToAttack(6, 4);
            }
        }
    }
}
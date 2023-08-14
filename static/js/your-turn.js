export function yourTurn() {
    let yourTurnElement = document.createElement("img")

    yourTurnElement.classList.add("your-turn")
    yourTurnElement.src = "../../static/images/field/your-turn.png"
    document.body.append(yourTurnElement)

    setTimeout(function () {
        document.body.removeChild(document.querySelector(".your-turn"))
    }, 2000)
}
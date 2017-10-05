var inquirer = require('inquirer');
var colors = require('colors');
var BasicCard = require('./BasicCard.js');
var ClozeCard = require('./ClozeCard.js');
var questAns = require('./flashCardLibrary.json');
var fs = require('fs');


var playCard;
var findCard;
var count = 0;


function gameMenu() {
    inquirer.prompt([{
        type: "list",
        message: "\nPlease select from the choices below:",
        choices: ["Griddle-me-this!", "Flash!", "Exit..."],
        name: "game"

    }]).then((answer) => {

        switch (answer.game) {

            case 'Griddle-me-this!':
                console.log(`Tell me some random facts!`.rainbow);
                setTimeout(create, 1500);
                break;

            case 'Flash!':
                console.log(`Let's play! Answer the question!`);
                setTimeout(play, 1500);
                break;

            case 'Exit...':
                console.log(`Good by Earthling!`.america.underline);
                // setTimeout(exit, 1500);
                return;
                break;
        }
    });
}
gameMenu();

function create() {

    inquirer.prompt([{
        type: "list",
        message: "What kind of card do you want to create?",
        choices: ["BasicCard", "ClozeCard"],
        name: "cardType"
    }]).then((questData) => {
        var cardType = questData.cardType;
        console.log(cardType);

        if (cardType === "BasicCard") {
            inquirer.prompt([{
                type: "input",
                message: "Enter your question Earthling!",
                name: "front"
            }, {
                type: 'input',
                message: 'Tell me your secret (Answer silly)',
                name: 'back'
            }]).then((cardInfo) => {

                var cardObj = {
                    type: "BasicCard",
                    front: cardInfo.front,
                    back: cardInfo.back
                };
                questAns.push(cardObj); //need to fix.
                fs.writeFile('flashCardLibrary.json', JSON.stringify(questAns, null, 2));

                inquirer.prompt([{
                    type: 'confirm',
                    message: 'Do you want to tell me about something else?',
                    name: 'anotherQ'
                }]).then((questData) => {
                    if (questData.anotherQ === true) {
                        create();
                    } else {
                        setTimeout(gameMenu, 1500);
                    }
                })
            })
        } else {
            inquirer.prompt([{
                type: "input",
                message: "Tell me something interesting! I'll hide the answer in the next step.",
                name: "text"
            }, {
                type: "input",
                message: "What's the answer you would like me to hide?",
                name: "cloze"

            }]).then((cardInfo) => {
                var cardObj = {
                    type: "ClozeCard",
                    message: cardInfo.text,
                    cloze: cardInfo.cloze
                };
                if (cardObj.text.indexOf(cardObj.cloze) !== -1) {
                    questAns.push(cardObj);

                    fs.writeFile('flashCardLibrary.json', JSON.stringify(questAns, null, 2));
                } else {
                    console.log("Enter a word from your sentence!");
                }
                inquirer.prompt([{
                    type: "confirm",
                    message: "Do you want to create another card?",
                    name: "anotherQ"
                }]).then((questData) => {
                    if (questData.anotherQ === true) {
                        create();
                    } else {
                        setTimeout(gameMenu, 1500);
                    }
                })
            })
        }
    })
}

function retrieveCard(card) {
    if (card.type === "BasicCard") {
        playCard = new BasicCard(card.front, card.back);

        return playCard.front;
    } else if (card.type === "ClozeCard") {
        playCard = new ClozeCard(card.text, card.cloze);

        return playCard.hiddenCloze();
    }
}

function play() {
    if (count < questAns.length) {
        findCard = retrieveCard(questAns[count]);

        inquirer.prompt([{
            type: "input",
            message: findCard,
            name: "question"
        }]).then((answer) => {

            if (answer.question === questAns[count].back || answer.question === questAns[count].cloze) {
                console.log("Woo hoo! You're awesome!".bgCyan);
            } else {
                if (playCard.front !== undefined) {
                    console.log("WRONG! That is not correct! " + questAns[count].back.bgWhite.red + " is the correct answer!");
                } else {
                    console.log("WRONG! That is not correct! " + questAns[count].cloze.bgWhite.red + " is the correct answer!");
                }
            }

            count++;
            play();
        })
    } else {
        count = 0;
        gameMenu();
    }
};
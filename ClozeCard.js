function ClozeCard(text, cloze) {
    this.text = text.split(cloze);
    this.cloze = cloze;
};

function ClozeQuestions() {
    this.hiddenCloze = function() {
        return `${this.text[0]}...${this.text[1]}`;
    };
};

ClozeCard.prototype = new ClozeQuestions();

exports = ClozeCard;
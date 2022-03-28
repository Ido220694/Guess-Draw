var EasyWords = ["add","air","bag","bad","baby","apple","ball","balloon",
"black","bell","blue", "birds","border", "brain","bread","box","brown", "building",
"camera", "card", "chain", "cold", "check","smile","year", "yellow","why","yes",
"zero","winter","tree","triangle","circle","water","sad", "top","sun","two","table",
"nine","sleep","star","up","summer","red","six","sheet","egg","eye"
];

var MedimWords = ["above","accident","account","adult","airplane","air","again",
"age","alive","all","alone","alphabet","angle","ants","back","attack","army","animal",
"bear","birthday","boat","between","bottle","bridge", "bus", "burn", "cake",
"cat","cell", "chair", "connected", "cut","coffee","cream","zebra","world","weather",
"train","victory","time","tea","view","temperature","storm","sheep","small","snake",
"snow","women","vote"];

var HardWords = ["activity","afraid","alike","atmosphere", "average","blood",
"bicycle", "breathe", "broken", "brother", "car", "change", "city", "class", "copy",
"count", "country", "dance", "danger", "complete","chicken","chemical","cow",
"cover","climate","climb","clock","traffic","sport","step","war","song","running",
"telephone", "wolf","dog","bar","gravity"
];


const getWord = (num) => {
    function generateRandomWordHard() {
        return HardWords[randInt(HardWords.length)];
      }
    function generateRandomWordEasy() {
        return EasyWords[randInt(EasyWords.length)];
      }
    function generateRandomWordMedium() {
        return MedimWords[randInt(MedimWords.length)];
      }
    function randInt(lessThan) {
        return Math.floor(Math.random() * lessThan);
      }
    

    var wordChosen;
    if(num == 1){
      wordChosen =generateRandomWordEasy();
    }
    else if(num == 2){
      wordChosen =generateRandomWordMedium();
    }
    else{
      wordChosen = generateRandomWordHard();

    }
    return wordChosen;

}

export default getWord;
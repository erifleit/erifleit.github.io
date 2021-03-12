$(document).ready(function(){
  var textField = $("#fname")

  function getNumber(a){
    var d = new Date()
    var num1 = parseInt(d.getTime().toString().slice(-4))
    var num2 = parseInt(d.getTime().toString().substring(7, 11))
    var r = (num1*num2).toString()
    if(a > 8){
      r = `${num1}`+r
    }
    return r.slice(-a)
  }

  function replaceCharAt(str, c, index){
    s = String(str)
    return s.substring(0, index) +
     c + s.substring(index)
  }

  function getShortWord(){
    const vowels = ["a", "e", "i", "o", "u", "y", "A", "E", "I", "O", "U", "Y"]
    const consonants = ["b", "c", "d", "f", "g", "h", "j", "k", "l", "m", "n", "p", "q", "r", "s", "t", "v", "w", "x", "z"]

    var num = getNumber(9).toString().split('')
    var word = ''

    num.forEach((element, index) => {
      if(index == 1 || index == 4 || index == 7){
        shuffle(vowels)
        num[index] = parseInt(element)
        word += vowels[num[index]]
      }
      else {
        num[index] = parseInt(element)
        shuffle(consonants)
        if(num[index] % 2) word += consonants[num[index]].toUpperCase()
        else word += consonants[num[index]]
      }
    });
    if(word.includes("nig") || word.includes("sex") || word.includes("dic")){
      return getShortWord()
    }
    return word
  }

  function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex -= 1
      temporaryValue = array[currentIndex]
      array[currentIndex] = array[randomIndex]
      array[randomIndex] = temporaryValue
    }
    return array
  }

  function getSymbol(){
    var symbols = ["!","@","#","$","%","^","&","*",",",".","/","?","+","=","-","_"]
    shuffle(symbols)
    var num = getNumber(4)
    var index = num % (symbols.length)
    return symbols[index]
  }

  function getWord(field){
    var word = getShortWord()

    var length = word.length
    word = replaceCharAt(word, getSymbol(), parseInt(length/3))
    word = replaceCharAt(word, getSymbol(), parseInt(length/3)*2+1)

    var nums = getNumber(6).toString()

    word += `${getSymbol()}${nums.substring(0,3)}`

    field.val(word)
  }

  var button = $('#refresh').click(function(){
    $(".link").css("display", "contents")
    getWord(textField)
  })

  var button = $('#copy').click(function(){
    copyToClipboard("fname")
  })

  function copyToClipboard(elementId) {
    var aux = document.createElement("input")
    aux.setAttribute("value", $(`#${elementId}`).val())
    document.body.appendChild(aux)
    aux.select()
    document.execCommand("copy")
    document.body.removeChild(aux)
  }

})
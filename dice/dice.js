console.log("hello")

$(document).ready(function(){

  let test = false

  let numbers = []
  let timeInterval = 50
  let dice = 2

  const sum = (a) => a.reduce((b, c) => b + c)

  const r = (a, b) => Math.floor(Math.random() * (b - a + 1) + a)

  const timeout = () => {
    setTimeout(() => {
      if(test){
        numbers = []
        for(let i = 0 ; i < dice ; i ++){
          numbers.push(r(1, 6))
        }
        $('#number').text(sum(numbers))
        timeout()
      }        
    }, timeInterval);
  }
    

  $('#button').on('mousedown', function() {
    test = true
    $('#n1').text(``)
    timeout()
  }).on('mouseup mouseleave', function() {
    test = false
    $('#n1').text(numbers.join(' + '))
  });

  $('#button').on('touchstart', function() {
    test = true
    $('#n1').text(``)
    numbers = []
    for(let i = 0 ; i < dice ; i ++){
      numbers.push(r(1, 6))
    }
    $('#number').text(sum(numbers))
    timeout()
  }).on('touchend', function() {
    test = false
    $('#n1').text(numbers.join(' + '))
  });
});
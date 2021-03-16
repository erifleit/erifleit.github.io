$(document).ready(function(){

  $('#refresh').click(function(){
    start(0,0)
  })

  var size = 8
  var steps = 0
  var board = createArray([], size)

  board.forEach( (element, index) => {
    board[index] = createArray({visited: false, step: null}, size)
  })

  function start(x, y){
    visit(x, y, 1);
    if (move(x,y,1)){
      console.log(steps)
      showBoard(board)
      return console.log("Success")
    }
    return "failed";
  }

  function visit(x, y, step){
    board[x][y] = {visited: true, step: step};
  }

  function unvisit(x, y){
    board[x][y] = {visited: false, step: null};
  }

  function move(x, y, step){
    steps++
    visit(x, y, step)

    if(step == size*size) return true

    //move 1
    if (moveHelper(x + 1, y + 2, step)) return true

    //move 2
    if (moveHelper(x + 2, y + 1, step)) return true

    //move 3
    if (moveHelper(x + 2, y - 1, step)) return true

    //move 4
    if (moveHelper(x + 1, y - 2, step)) return true

    //move 5
    if (moveHelper(x - 1, y - 2, step)) return true

    //move 6
    if (moveHelper(x - 2, y - 1, step)) return true

    //move 7
    if (moveHelper(x - 2, y + 1, step)) return true

    //move 8
    if (moveHelper(x - 1, y + 2, step)) return true

    unvisit(x, y)
    return false;
  }

  function createArray(value, length){
    var array = []
    for(var i = 0; i < length ; i++)
      array[i] = value
    return array
  }

  function showBoard(array){
    array.forEach((a,x) => {
      a.forEach((b, y) => {
        $(`#${x}${y}`).text(b.step)
      })
    })
  }

  function moveHelper(x, y, step){
    return x >= 0 && x < size && y >= 0 && y < size && !board[x][y].visited ? move(x,y,step+1) : false
  }

  console.log(board)

})
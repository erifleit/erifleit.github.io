$(document).ready(function(){

  $('#refresh-async').click(function(){
    $('#refresh').attr("onclick", "").unbind("click");
    $('#refresh-async').attr("onclick", "").unbind("click");
    start(0,0)
  })

  var speed = 100
  var size = 8
  var steps = 0
  var board = create2DArray({visited: false, step: null}, size)

  async function start(x, y){
    var moved = await move(x,y,1) 
    if (moved){
      console.log(steps)
      showBoard(board)
      return true
    }
    return false
  }

  async function visit(x, y, step){
    return new Promise(
      resolve => setTimeout(() => {
        board[x][y] = {visited: true, step: step};
        $(`#${x}${y}`).text(step)
        return resolve(true)
      }, speed)
    )
  }

  async function unvisit(x, y){
    return new Promise(
      resolve => setTimeout(() => {
        board[x][y] = {visited: false, step: null};
        $(`#${x}${y}`).text("")
        return resolve(true)
      }, speed)
    )
  }

  async function move(x, y, step){
    steps++
    await visit(x, y, step)

    if(step == size*size) return true

    //move 1
    await movePiece(x + 1, y + 2, step)

    //move 2
    await movePiece(x + 2, y + 1, step)

    //move 3
    await movePiece(x + 2, y - 1, step)

    //move 4
    await movePiece(x + 1, y - 2, step)

    //move 5
    await movePiece(x - 1, y - 2, step)

    //move 6
    await movePiece(x - 2, y - 1, step)

    //move 7
    await movePiece(x - 2, y + 1, step)

    //move 8
    await movePiece(x - 1, y + 2, step)

    await unvisit(x, y)
    return false;
  }

  async function movePiece(x, y, step){
    if(x >= 0 && x < size && y >= 0 && y < size){
      if(!board[x][y].visited){
        var moved = await move(x,y,step+1)
        if(moved){
          return true
        }
      }
    }
    return false
  }

  function create2DArray(value, length){
    var array = []
    for(var i = 0; i < length ; i++){
      array.push([])
      for(var j = 0; j < length ; j++)
        array[i].push(value)
    }
    return array
  }

  function showBoard(array){
    array.forEach((a,x) => {
      a.forEach((b, y) => {
        $(`#${x}${y}`).text(b.step)
      })
    })
  }

})
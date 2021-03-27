$(document).ready(function(){

  var steps = 0
  var isSolving = false
  var stopped = false
  var id = 0

  speed = $('input[name=speed]:checked', '#speedForm').val()
  $('#speedForm').change(() => {
    speed = $('input[name=speed]:checked', '#speedForm').val()
  })

  $('#solve').click(function(){
    disabled(['#height', '#width', '#solve-async', '#solve', '#x', '#y'], true)
    start($('#x').val()-1, $('#y').val()-1, $('#width').val(), $('#height').val())
  })

  $('#solve-async').click(() => {
    disabled(['#height', '#width', '#solve-async', '#solve', '#x', '#y'], true)
    startAsync($('#x').val()-1, $('#y').val()-1, $('#width').val(), $('#height').val())
  })

  $('#clear').click(() => {
    id++
    clearBoard()
    disabled(['#height', '#width', '#solve-async', '#solve', '#x', '#y'], false)
    displayMessage("hide")
  })

  $('#stop').click(() => {
    isSolving = false 
    stopped = true
    disabled(['#solve-async', '#solve'], true)
    displayMessage("stopped")
  })

  const moves = [
    { x: 1, y: 2 },
    { x: 2, y: 1 },
    { x: 2, y: -1 },
    { x: 1, y: -2 },
    { x: -1, y: -2 },
    { x: -2, y: -1 },
    { x: -2, y: 1 },
    { x: -1, y: 2 }
  ]

  class Board {
    constructor(w, h) {
      this.height = h
      this.width = w
      this.area = w * h
      this.id = id
      this.board = create2DArray({ visited: false, step: null }, w, h)
      this.getBoard = () => this.board
      this.visit = (x, y, step) => {
        this.board[x][y] = { visited: true, step: step }
      }
      this.unvisit = (x, y) => {
        this.board[x][y] = { visited: false, step: null }
      }
      this.isVisited = (x, y) => this.board[x][y].visited
    }
  }

  function start(x, y, w, h){
    steps = 0
    let board = new Board(w, h)
    if (move(x, y, 1, board)){
      if(!stopped) displayMessage("success", showBoard, board)
      showBoard(board.board)
    }
    else displayMessage("fail")
  }

  function move(x, y, step, board){
    if(steps > 50000000){
      displayMessage("timeout")
      stopped = true
      return true
    }
    steps++
    board.visit(x, y, step)
    if(step == board.area){
      return true
    }
    
    let moved = false;
    let i = 0
    while(!moved && i < moves.length){
      moved = movePiece(moves[i].x + x, moves[i].y + y, step, board, false)
      i++
    }
    if(moved) return true

    board.unvisit(x, y)
    return false;
  }

  class BoardAsync {
    constructor(w, h) {
      this.height = h
      this.width = w
      this.area = w * h
      this.id = id
      this.board = create2DArray({ visited: false, step: null }, w, h)
      this.visit = (x, y, step) => {
        this.board[x][y] = { visited: true, step: step }
        $(`#${x}${y}`).text(step)
      };
      this.unvisit = (x, y) => {
        this.board[x][y] = { visited: false, step: null }
        $(`#${x}${y}`).text("")
      };
      this.isVisited = (x, y) => this.board[x][y].visited
    }
  }

  async function startAsync(x, y, w, h){
    steps = 0
    let board = new BoardAsync(w, h)
    isSolving = true
    let moved = await moveAsync(x, y, 1, board) 
    if (moved){
      if(!stopped) displayMessage("success")
      return true
    }
    displayMessage("fail")
    return false
  }

  async function moveAsync(x, y, step, board){
    await visit(x, y, step, board)

    if(step == board.area){
      isSolving = false
      return true
    }

    let moved = false;
    let i = 0
    while(!moved && i < moves.length){
      moved = await movePiece(moves[i].x + x, moves[i].y + y, step, board, true)
      i++
    }
    
    if(moved){
      return true
    }
    await unvisit(x, y, board)
    return false
  }

  async function visit(x, y, step, board){
    return new Promise(
      resolve => setTimeout(() => {
        if(isSolving && board.id == id){
          board.visit(x, y, step)
          steps++
        } 
        return resolve(true)
      }, speed)
    )
  }

  async function unvisit(x, y, board){
    $(`#${x}${y}`).css("color","red")
    return new Promise(
      resolve => setTimeout(() => {
        $(`#${x}${y}`).css("color","black")
        if(isSolving && board.id == id) board.unvisit(x, y)
        return resolve(true)
      }, speed)
    )
  }

  function movePiece(x, y, step, board, async){
    if(inBounds(x, y, board.width, board.height) && !board.isVisited(x, y)){
      if(async){
        return moveAsync(x, y, step + 1, board)
      } else {
        return move(x, y, step + 1, board)
      }
    }
    else return false
  }

  function create2DArray(value, w, h){
    let array = []
    for(let i = 0; i < h ; i++){
      array.push([])
      for(let j = 0; j < w ; j++)
        array[i].push(value)
    }
    return array
  }

  function inBounds(x, y, w, h){
    return x >= 0 && x < h && y >= 0 && y < w
  }

  function showBoard(array){
    array.forEach((a,x) => {
      a.forEach((b, y) => {
        $(`#${x}${y}`).text(b.step)
      })
    })
  }

  function clearBoard(){
    $(".white").text("")
    $(".black").text("")
  }

  function displayMessage(type, callback, board){
    switch (type) {
      case "timeout":
        $("#message").text("Sorry! It was taking too long so I had to give up in order to prevent your browser from crashing! 😞 \n I tried 50 million steps!").css("color", "red")
        break;
      case "success":
        $("#message").text(`Success! This solution took ${steps} steps to be found!`).css("color", "green")
        break;
      case "hide":
        $("#message").text("")
        break;
      case "fail":
        $("#message").text(`Sorry! Could not find a solution from that starting location! I tried all ${steps} possible steps from that position`).css("color", "red")
        break;
      case "stopped":
        $("#message").text(`You have stopped it after ${steps} steps`).css("color", "red")
      default:
        break;
    }
  }

  function disabled(array, boo){
    array.forEach( element => {
      $(element).attr("disabled", boo)
    })
  }

})
$(document).ready(function(){

  $("#height").change(() => location.reload())
  $("#width").change(() => location.reload())

  updateSize()

  function updateSize(){
    var height = $("#height").val()
    var width = $("#width").val()
    var containerWidth = parseInt($(".chessboard").css("width").replace("px", ""))
    var cellWidth = 70
    var cellHeight = cellWidth
    var newBoardHeight = height * cellHeight
    var newBoardWidth = cellWidth * width
    var rowWhite = $(".row.row-white")[0]
    var rowBlack = $(".row.row-black")[0]

    updateRow([rowWhite, rowBlack], width)
    setBoard(".chessboard", height, rowWhite, rowBlack)
    updateSizeCSS(
      [".white", ".black", ".chessboard"], 
      [[cellWidth], [cellWidth], [newBoardWidth, newBoardHeight]]
    )
    updateOptions(["#x","#y"], [width, height])
  }

  function updateSizeCSS(elements, sizes){
    elements.forEach((element, index) => {
      $(element).css({
        "width" : sizes[index][0],
        "height" : sizes[index][1] || sizes[index][0]
      })
    })
  }

  function updateRow(rows, width){
    let whiteCell = $(".white")[0]
    let blackCell = $(".black")[0]
    rows.forEach((row) => {
      while($(row).children().length > width)
        $(row).children().last().remove()
      while($(row).children().length < width){
        let prev = $(row).children().last().attr('class')
        if(prev == "black") $(whiteCell).clone().appendTo(row)
        else $(blackCell).clone().appendTo(row)
      }
    })
  }

  function setBoard(board, height, rowWhite, rowBlack){
    $(board).empty()
    for(var i = 0 ; i < height ; i++){
      if(i % 2 == 0) $(rowWhite).clone().appendTo(board)
      else $(rowBlack).clone().appendTo(board)
    }
    $.each($(board).children(),(x, vx) => {
      $.each($(vx).children(), (y, vy) => {
        $(vy).attr("id", `${x}${y}`)
      })
    })
  }

  function updateOptions(options, size){
    options.forEach((option, i) => {
      while($(option).children().length > size[i])
        $(option).children().last().remove()
      while($(option).children().length < size[i]){
        var op = parseInt($(option).children().last().attr('value')) + 1
        $(option).children().last().clone()
        .attr("value", op).text(op).appendTo(option)
      }
    })
  }

})
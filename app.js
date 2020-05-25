document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const scoreDisplay = document.querySelector('#score')
    const startBtn = document.querySelector('#start-button')
    const width = 10
    let nextRandom = 0
    let timerId
    let score = 0
    const colors = [
        'orange',
        'blue',
        'green',
        'gray',
        'black'
    ]

    //The Tetrominoes

    const lTetromino = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
    ]

    const zTetromino = [
        [1, 2, width, width+1],
        [0, width, width + 1, 2 * width + 1],
        [1, 2, width, width + 1],
        [0, width, width + 1, 2 * width + 1]
    ]    

    const tTetromino = [
        [0, 1, 2, width+1],
        [1, width, width+1, 2*width+1],
        [1, width, width+1, width+2],
        [0, width, width+1, 2*width]
    ]

    const iTetromino = [
        [0, width, 2 * width, 3 * width],
        [0, 1, 2, 3],
        [0, width, 2 * width, 3 * width],
        [0, 1, 2, 3]
    ]

    const oTetromino = [
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1]
    ]

    const theTetrominoes = [lTetromino, zTetromino, tTetromino, iTetromino, oTetromino]

    let currentPosition = 4
    let currentRotation = 0

    //randomly select a Tetromino and its first rotation
    let random = Math.floor(Math.random()*theTetrominoes.length)
    console.log(random)

    let current = theTetrominoes[random][currentRotation]
    console.log(theTetrominoes)
    console.log(theTetrominoes[0][0])

    // draw the Tetromino
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino')
            squares[currentPosition + index].style.backgroundColor = colors[random]
        })
    }

    //undraw the Tetromino
    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino')
            squares[currentPosition + index].style.backgroundColor = ''
        })
    }

    //make tetrominoes move down every second
    // timerId = setInterval(moveDown, 500)

    //asign functions to keyCodes
    function control(e){
        if(e.keyCode === 37){
            moveLeft()
        } else if (e.keyCode === 38) {
            rotate()
        } else if (e.keyCode === 39) {
            moveRight()
        } else if (e.keyCode === 40) {
            moveDown()
        }
    }
    document.addEventListener('keyup', control)

    //move down function
    function moveDown() {
        undraw()
        currentPosition += width
        draw()
        freeze()
    }

    //freeze function
    function freeze () {
        if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))
            //start new tetromino falling
            random = nextRandom
            nextRandom = Math.floor(Math.random() * theTetrominoes.length)
            current = theTetrominoes[random][currentRotation]
            currentPosition = 4
            draw()
            displayShape()
            addScore()
            gameOver()
        }
    }

    //move the tetromino left, unless it is at the edge or there is blockage
    function moveLeft () {
        undraw()
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)

        if(!isAtLeftEdge) currentPosition -=1

        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition +=1
        }

        draw()
    }

    //move the tetromino left, unless it is at the edge or there is blockage
    function moveRight() {
        undraw()
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === 9)

        if (!isAtRightEdge) currentPosition += 1

        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -= 1
        }

        draw()
    }

    //rotate the tetromino
    function rotate() {
        undraw()
        currentRotation ++
        if(currentRotation === current.length) {
            currentRotation = 0
        }
        current = theTetrominoes[random][currentRotation]
        draw()
    }

    //shpw up-next tetromino in mini-grid display
    const displaySquares = document.querySelectorAll('.mini-grid div')
    const displayWidth = 4
    const displayIndex = 0
    
    // the tetrominoes without rotation
    const upNextTetrominoes = [ //here why doesn't it work if we do lTetromino[0] instead of rewriting each?
        [1, displayWidth + 1, displayWidth * 2 + 1, 2], //L
        [1, 2, displayWidth, displayWidth + 1], //Z
        [0, 1, 2, displayWidth + 1], //T
        [0, displayWidth, 2 * displayWidth, 3 * displayWidth], //I
        [0, 1, displayWidth, displayWidth + 1] //o
    ]

    //display the shape in mini grid
    // this is 1:05 to 1:14 in video; there's some bug in my "view next shape"
    function displayShape() {
        //remove tetromino styling from the grid
        displaySquares.forEach(square => {
            square.classList.remove('tetromino')
            square.style.backgroundColor = ''
        })
        //
        upNextTetrominoes[nextRandom].forEach( index => {
            displaySquares[displayIndex + index].classList.add('tetromino')
            displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
        })
    }

    // add functonality to the button
    startBtn.addEventListener('click', () => {
        if (timerId){
            clearInterval(timerId)
            timerId = null
        }   else {
            draw()
            timerId = setInterval(moveDown, 500)
            nextRandom = Math.floor(Math.random() * theTetrominoes.length)
            displayShape()
            addScore()
    }
    }) 

    //add score
    function addScore() {
        for (let i = 0; i < 199; i +=width) {
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

            if(row.every(index => squares[index].classList.contains('taken'))) {
                score +=10
                scoreDisplay.innerHTML = score
                row.forEach(index => {
                    squares[index].classList.remove('taken')
                    squares[index].classList.remove('tetromino')
                    squares[index].style.backgroundColor = ''
                })
                const squaresRemoved = squares.splice(i, width)
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell)) 
            }
        }
    }    

    //game over
    function gameOver(){
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            scoreDisplay.innerHTML = 'End - Score:' + score
            clearInterval(timerId)   
        }
    }


})


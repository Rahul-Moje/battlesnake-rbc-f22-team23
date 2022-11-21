import express from 'express';

export default function runServer(handlers) {
  const app = express();
  app.use(express.json());

  app.get("/", (req, res) => {
    res.send(handlers.info());
  });

  app.post("/start", (req, res) => {
    handlers.start(req.body);
    res.send("ok");
  });


  app.post("/move", (req, res) => {
    // Step 1: Generate moves that don't hit a wall or obstacles (arr1)
    // Step 2: Generate moves that don't hit another snake (arr2)
    // Step 3: Generate moves that don't hit yourself (arr3)
    // Step 4: Generate moves that go towards the closest food item (arr4)
    // Step 5: Find moves in all of arr1, arr2, and arr3 (arr5)
    // Step 6: Find moves that are all in arr5 and arr4 (arr6)
    // Step 6a: If arr6 is not empty, randomly choose a move in arr6
    // Step 6b: Else choose any move in arr 5
    //API Reference - https://docs.battlesnake.com/api
    //console.log(req.body);
    var safeWallMoves = findSafeMovesForWallsOrObstacles(req.body.board, req.body.you);
    var safeMove = 'down';
    if(safeWallMoves.length != 0) {
      safeMove = safeWallMoves[Math.floor(Math.random()*safeWallMoves.length)]
    }
    console.log('Next move', safeMove);
    return { move: safeMove }
  });

  app.post("/end", (req, res) => {
    handlers.end(req.body);
    res.send("ok");
  });

  app.use(function(req, res, next) {
    res.set("Server", "battlesnake/github/starter-snake-javascript");
    next();
  })

  const host = '0.0.0.0';
  const port = process.env.PORT || 8000;

  app.listen(port, host, () => {
    console.log(`Running Battlesnake at http://${host}:${port}...`)
  });
}

export function findSafeMovesForWallsOrObstacles(board, snake) {
  var result = []
  var boardXMin = 0, boardXMax = board.width - 1;
  var boardYMin = 0, boardYMax = board.height - 1;
  if (snake.head.x != boardXMin) {
    result.push('left');
  }
  if (snake.head.x != boardXMax) {
    result.push('right');
  }
  if (snake.head.y != boardYMax) {
    result.push('up');
  }
  if (snake.head.y != boardYMin) {
    result.push('down');
  }
  console.log(result);
  return result
}

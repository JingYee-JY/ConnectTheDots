App = function()
{
    var colors = ['', '#F90169', '#FFF5DA', '#08AEAD', '#FBCE59', '#F25528', '#01A27E'];
    var currentLineId;
    var lines = [];
    var gridLines = [];
    var gameState;
    var completedLevels = 0;
    var numberOfDots = ['', 4,4,5,5,6,6,6,6,6,6,6,6]

    this.init = function()
    {
        var levelProgression = wade.retrieveLocalObject('flowLevelProgression');
        console.log(levelProgression)
        completedLevels = levelProgression.completedLevels;
        this.createMainMenu();
    };

    this.createMainMenu = function()
    {
        gameState = 'mainMenu';
        console.log(gameState)
        var screenWidth = wade.getScreenWidth();
        var screenHeight = wade.getScreenHeight();
        wade.setMinScreenSize(0, 0);

        //// create background
        var backSprite = new Sprite();
        backSprite.setSize(screenWidth, screenHeight);
        backSprite.setDrawFunction(wade.drawFunctions.solidFill_('#433836'));
        var backObject = new SceneObject(backSprite);
        wade.addSceneObject(backObject);

        // create level buttons in a 3x3 grid in the middle of the screen
        var gridSizeCloumns = 3;
        var gridSizeRows = 4
        var buttonSize = Math.min(screenWidth, screenHeight) / 5;
        var cellSize = buttonSize * 1.2;
        console.log(gridSizeCloumns,gridSizeRows)
        for (var i=0; i < gridSizeCloumns; i++)
        {
            for (var j=0; j < gridSizeRows; j++)
            {
                console.log(i,j)
                // create a sprite for the border of the button
                var buttonSprite = new Sprite();
                buttonSprite.setSize(buttonSize, buttonSize);
                var x = (i - gridSizeCloumns/2 + 0.5) * cellSize;
                var y = (j - gridSizeCloumns/2 + 0.5) * cellSize;
                buttonSprite.setDrawFunction(function(context)
                {
                    var pos = this.getPosition();
                    var radius = buttonSize;
                    context.beginPath();
                    context.strokeStyle = '#666666';
                    context.lineWidth = buttonSize / 15;
                    context.moveTo(pos.x - radius, pos.y -radius);
                    context.roundRect(pos.x - radius/2 ,pos.y - radius/2, radius, radius, 3);
                    context.fillStyle  ='#666666'
                    context.fillRect(pos.x - radius/2 ,pos.y - radius/2,radius, radius)
                    context.stroke();
                });

                // create a scene object for the button
                var button = new SceneObject(buttonSprite, 0, x, y);
                button.levelId = j * gridSizeCloumns + i + 1;
                button.unlocked = (completedLevels >= button.levelId - 1);
                wade.addSceneObject(button);

                if (!button.unlocked)
                {
                    // create a lock icon - a rectangle first
                    var rectangle = new Sprite();
                    rectangle.setSize(buttonSize * 0.4, buttonSize * 0.4);
                    rectangle.setDrawFunction(function(context)
                    {
                        var pos = this.getPosition();
                        var radius = buttonSize * 0.4;
                        context.beginPath();
                        context.strokeStyle = '#D0D0D0';
                        context.moveTo(pos.x - radius, pos.y -radius);
                        context.lineWidth = buttonSize / 15;
                        context.roundRect(pos.x - radius/2 ,pos.y - radius/2, radius, radius, 3);
                        context.fillStyle  ='#D0D0D0'
                        context.fillRect(pos.x - radius/2 ,pos.y - radius/2,radius, radius)
                        context.stroke();
                    });
                    button.addSprite(rectangle, {y: buttonSize * 0.05});

                    // then half a circle
                    var halfCircle = new Sprite();
                    halfCircle.setSize(buttonSize, buttonSize);
                    halfCircle.setDrawFunction(function(context)
                    {
                        var pos = this.getPosition();
                        var radius = buttonSize / 8;
                        var strokeStyle = context.strokeStyle;
                        var lineWidth = context.lineWidth;
                        context.beginPath();
                        context.moveTo(pos.x - radius, pos.y);
                        context.strokeStyle = '#D0D0D0';
                        context.lineWidth = buttonSize / 15;
                        context.arc(pos.x, pos.y, radius, Math.PI, 2 * Math.PI, false);
                        context.stroke();
                        context.strokeStyle = strokeStyle;
                        context.lineWidth = lineWidth;
                    });
                    button.addSprite(halfCircle, {y: -buttonSize  / 5.5});

                    // then a circle
                    var circle = new Sprite();
                    circle.setSize(buttonSize, buttonSize);
                    circle.setDrawFunction(function(context)
                    {
                        var pos = this.getPosition();
                        var radius = buttonSize / 25;
                        var strokeStyle = context.strokeStyle;
                        var lineWidth = context.lineWidth;
                        context.beginPath();
                        context.moveTo(pos.x - radius, pos.y);
                        context.strokeStyle = '#666666';
                        context.lineWidth = buttonSize / 20;
                        context.arc(pos.x, pos.y, radius, 0, 2 * Math.PI, false);
                        context.stroke();
                        context.fillStyle  ='#666666'
                        context.fillRect(pos.x - radius/2 ,pos.y - radius/2,radius, radius)
                        context.strokeStyle = strokeStyle;
                        context.lineWidth = lineWidth;
                    });
                    button.addSprite(circle, {y: buttonSize /13});
                }
                else
                {
                    // add text to show which level the button is for
                    var levelText = new TextSprite(button.levelId, (buttonSize / 2) + 'px Londrina Solid', 'white', 'center');
                    button.addSprite(levelText, {x:0, y: buttonSize / 6});
                }

                // make buttons clickable
                button.onMouseUp = function()
                {
                    if (!this.unlocked)
                    {
                        return;
                    }
                    playClickSound()
                    setTimeout(() => {
                        instructionPage.classList.remove("hide")
                        wade.app.loadLevel(this.levelId);
                    }, 200);
                };
                wade.addEventListener(button, 'onMouseUp');
            }
        }

        // tell the player what to do
        /*var textSprite = new TextSprite('Choose level', (Math.min(screenWidth, screenHeight) / 17) + 'px Londrina Solid', 'white', 'center');
        wade.addSceneObject(new SceneObject(textSprite, 0, 0,- Math.min(screenWidth, screenHeight) / 2 + Math.min(screenWidth, screenHeight) / 10));
        */
    };

    this.onResize = function()
    {
        console.log(gameState)
        if (gameState != 'mainMenu' && gameState != undefined)
        {
            return
        }
        else{
            console.log("menu")
            var levelProgression = wade.retrieveLocalObject('flowLevelProgression');
            console.log(levelProgression)
            completedLevels = levelProgression.completedLevels;
            wade.clearScene();
            this.createMainMenu();
        }
    };

    this.loadLevel = function(levelId)
    {
        gameState = 'loading';

        console.log(levelId)
        selectionPage.classList.add("hide")
        this.currentLevelId = levelId;
        wade.clearScene();
        var screenWidth = wade.getScreenWidth();
        var screenHeight = wade.getScreenHeight();

        // create loading text
        var loadingText = new TextSprite('Loading level...', (Math.min(screenWidth, screenHeight) / 10) + 'px Londrina Solid', '#88f', 'center');
        var loading = new SceneObject(loadingText);
        wade.addSceneObject(loading);
        loading.onResize = function(eventData)
        {
            this.getSprite().setFont((Math.min(eventData.width, eventData.height) / 10) + 'px Londrina Solid');
        };
        wade.addEventListener(loading, 'onResize');

        // load level data
        var levelFile = 'levels/' + levelId + '.json';
        var level = {};
        wade.preloadJson(levelFile, level, function()
        {
            wade.removeSceneObject(loading);
            wade.app.startLevel(level.data,levelId);
        }, true);
    };

    this.worldToGrid = function(x, y)
    {
        var grid = wade.getSceneObject('grid');
        var pos = grid.getPosition();
        var size = grid.getSprite().getSize();
        var gridX = Math.floor((x - (pos.x - size.x / 2)) / (size.x / grid.numCells));
        var gridY = Math.floor((y - (pos.y - size.y / 2)) / (size.y / grid.numCells));
        return {x: gridX, y: gridY, valid: (gridX >=0 && gridY >=0 && gridX < grid.numCells && gridY < grid.numCells)};
    };

    this.gridToWorld = function(x, y)
    {
        var grid = wade.getSceneObject('grid');
        var pos = grid.getPosition();
        var size = grid.getSprite().getSize();
        var worldX = (x + 0.5) * size.x / grid.numCells + pos.x - size.x / 2;
        var worldY = (y + 0.5) * size.y / grid.numCells + pos.y - size.y / 2;
        return {x: worldX, y: worldY};
    };

    this.startLevel = function(levelData, levelId)
    {
        this.levelData = levelData;
        gameState = 'playing';

        wade.clearScene();
        var screenWidth = wade.getScreenWidth();
        var screenHeight = wade.getScreenHeight();

        var backgroundWidth = screenWidth / 2.5;
        var backgroundHeight = screenHeight / 15;

        //// create background
        var backSprite = new Sprite();
        backSprite.setSize(screenWidth, screenHeight);
        backSprite.setDrawFunction(wade.drawFunctions.solidFill_('#433836'));
        var backObject = new SceneObject(backSprite);
        wade.addSceneObject(backObject);

        // create a header background
        var background = new Sprite();
        background.setSize(backgroundWidth, backgroundHeight);
        var x = -(screenWidth - backgroundWidth - backgroundWidth/2) / 2;
        var y = -(screenHeight - backgroundHeight) / 2.25;
        console.log("L")
        background.setDrawFunction(function(context)
        {
            var pos = this.getPosition();
            context.beginPath();
            context.strokeStyle = '#6EB3D2';
            context.lineWidth = 10;
            context.moveTo(pos.x - backgroundWidth, pos.y - backgroundHeight);
            context.roundRect(pos.x,pos.y, backgroundWidth, backgroundHeight, 3);
            context.fillStyle  ='#6EB3D2'
            context.fillRect(pos.x ,pos.y,backgroundWidth, backgroundHeight)
            context.stroke();
        });
        var level = new SceneObject(background, 0, x, y);
        wade.addSceneObject(level);

        // add text to show which level the button is for
        var levelText = new TextSprite("Level " + levelId, (backgroundHeight) + 'px Londrina Solid', 'white', 'center');
        level.addSprite(levelText, {x:backgroundWidth / 2, y: backgroundHeight - 8});

        // create a grid
        var numCells = levelData.length;
        var minSize = Math.min(wade.getScreenWidth(), wade.getScreenHeight()) - 20;
        var cellSize = minSize / numCells;
        var gridSprite = new Sprite();
        gridSprite.setSize(minSize, minSize);
        gridSprite.setDrawFunction(wade.drawFunctions.grid_(numCells, numCells, '#7A6F6D', 5));
        var grid = new SceneObject(gridSprite);
        grid.numCells = numCells;
        grid.setName('grid');
        wade.addSceneObject(grid);
        wade.setMinScreenSize(minSize, minSize);

        // add dots
        for (var i=0; i < numCells; i++)
        {
            for (var j=0; j < numCells; j++)
            {
                var colorId = levelData[j][i];
                if (colorId)
                {
                    var dotSprite = new Sprite();
                    var dotSize = cellSize * 0.7;
                    var dotPosition = this.gridToWorld(j, i);
                    dotSprite.setSize(dotSize, dotSize);
                    dotSprite.color = colors[colorId];
                    wade.addSceneObject(new SceneObject(dotSprite, 0, dotPosition.x + 0.5, dotPosition.y + 0.5));
                    dotSprite.setDrawFunction(function(context)
                    {
                        var pos = this.getPosition();
                        var size = this.getSize();
                        var fillStyle = context.fillStyle;
                        context.fillStyle = this.color;
                        context.beginPath();
                        context.moveTo(pos.x, pos.y);
                        context.arc(pos.x, pos.y, size.x / 2, 0, Math.PI * 2, false);
                        context.fill();
                        context.fillStyle = fillStyle;
                    });
                }
            }
        }

        // set up line objects
        lines.length = 0;
        for (i=1; i < numberOfDots[levelId] + 1; i++)
        {
            var lineSprite = new Sprite();
            lineSprite.setSize(minSize, minSize);
            var lineObject = new SceneObject(lineSprite);
            wade.addSceneObject(lineObject);
            lines[i] = lineObject;
            lineObject.points = [];
            lineObject.color = colors[i];

            lineSprite.setDrawFunction(function(context)
            {
                var points = this.getSceneObject().points;
                var color = this.getSceneObject().color;
                if (points.length)
                {
                    // store context properties that we are going to change
                    var lineWidth = context.lineWidth;
                    var strokeStyle = context.strokeStyle;
                    var lineCap = context.lineCap;
                    var lineJoin = context.lineJoin;

                    // set new context properties
                    context.lineWidth = cellSize / 5;
                    context.strokeStyle = color;
                    context.lineCap = context.lineJoin = 'round';

                    // draw line
                    context.beginPath();
                    var worldPoint = wade.app.gridToWorld(points[0].x, points[0].y);
                    context.moveTo(worldPoint.x, worldPoint.y);
                    for (var i=1; i < points.length; i++)
                    {
                        worldPoint = wade.app.gridToWorld(points[i].x, points[i].y);
                        context.lineTo(worldPoint.x, worldPoint.y);
                    }
                    context.stroke();

                    // restore context properties
                    context.lineWidth = lineWidth;
                    context.strokeStyle = strokeStyle;
                    context.lineCap = lineCap;
                    context.lineJoin = lineJoin;
                }
            });
        }

        // set up the state of the lines on the grid
        for (i=0; i < levelData.length; i++)
        {
            gridLines[i] = [];
        }
    };

    this.onMouseDown = function(eventData)
    {
        if (gameState == 'playing')
        {
            var gridCoords = this.worldToGrid(eventData.screenPosition.x, eventData.screenPosition.y);
            if (!gridCoords.valid)
            {
                currentLineId = 0;
            }
            else if (this.levelData[gridCoords.x][gridCoords.y])                // is it a dot?
            {
                currentLineId = this.levelData[gridCoords.x][gridCoords.y];
                if (lines[currentLineId].points)
                {
                    for (var k=0; k < lines[currentLineId].points.length; k++)
                    {
                        var p = lines[currentLineId].points[k];
                        gridLines[p.x][p.y] = 0;
                    }
                }
                lines[currentLineId].points = [gridCoords];
                lines[currentLineId].connected = false;
                gridLines[gridCoords.x][gridCoords.y] = currentLineId;
                lines[currentLineId].getSprite().setDirtyArea();
            }
            else if (gridLines[gridCoords.x][gridCoords.y])                     // is it a line segment?
            {
                currentLineId = gridLines[gridCoords.x][gridCoords.y];
                lines[currentLineId].connected = false;
                var points = lines[currentLineId].points;
                for (var i=0; i < points.length; i++)
                {
                    if (points[i].x == gridCoords.x && points[i].y == gridCoords.y)
                    {
                        for (var j=i+1; j < points.length; j++)
                        {
                            gridLines[points[j].x][points[j].y] = 0;
                        }
                        points.length = i+1;
                        lines[currentLineId].getSprite().setDirtyArea();
                    }
                }
            }
        }
    };

    this.onMouseMove = function(eventData)
    {
        if (gameState == 'playing' && wade.isMouseDown())
        {
            // check that grid coordinates are valid, and that we have a valid currentLineId
            var gridCoords = this.worldToGrid(eventData.screenPosition.x, eventData.screenPosition.y);
            if (!gridCoords.valid || !currentLineId)
            {
                currentLineId = 0;
                return;
            }

            // have we moved to a new cell at all?
            var points = lines[currentLineId].points;
            if (points[points.length-1].x == gridCoords.x && points[points.length-1].y == gridCoords.y)
            {
                return;
            }

            // are we intersecting the same line? If so, remove all the points of the line after this point
            if (gridLines[gridCoords.x][gridCoords.y] == currentLineId)
            {
                for (var i=0; i < points.length; i++)
                {
                    var p = points[i];
                    if (p.x == gridCoords.x && p.y == gridCoords.y)
                    {
                        for (var j=i+1; j < points.length; j++)
                        {
                            gridLines[points[j].x][points[j].y] = 0;
                        }
                        points.length = i+1;
                        lines[currentLineId].getSprite().setDirtyArea();
                        return;
                    }
                }
            }
            else if (gridLines[gridCoords.x][gridCoords.y])
            {
                return;
            }

            // avoid diagonals
            var dx = points[points.length-1].x - gridCoords.x;
            var dy = points[points.length-1].y - gridCoords.y;
            if (dx && dy)
            {
                return;
            }

            // check for dots at the new coordinates
            var dot = this.levelData[gridCoords.x][gridCoords.y];
            if (dot && dot != currentLineId)
            {
                return;
            }

            // have we moved too much?
            var invalid = false;
            if (Math.abs(dx) > 1)
            {
                var signX = dx > 0? 1 : -1;
                for (i=1; i < Math.abs(dx) && !invalid; i++)
                {
                    invalid = this.levelData[gridCoords.x + signX * i][gridCoords.y] || gridLines[gridCoords.x + signX * i][gridCoords.y];
                }
                if (invalid)
                {
                    return;
                }
                else
                {
                    for (i=1; i < Math.abs(dx); i++)
                    {
                        points.push({x: gridCoords.x + signX * i, y: gridCoords.y});
                        gridLines[gridCoords.x + signX * i][gridCoords.y] = currentLineId;
                    }
                }
            }
            else if (Math.abs(dy) > 1)
            {
                var signY = dy > 0? 1 : -1;
                for (i=1; i < Math.abs(dy) && !invalid; i++)
                {
                    invalid = this.levelData[gridCoords.x][gridCoords.y + signY * i] || gridLines[gridCoords.x][gridCoords.y + signY * i];
                }
                if (invalid)
                {
                    return;
                }
                else
                {
                    for (i=1; i < Math.abs(dy); i++)
                    {
                        points.push({x: gridCoords.x, y: gridCoords.y + signY * i});
                        gridLines[gridCoords.x][gridCoords.y + signY * i] = currentLineId;
                    }
                }
            }

            // all good, let's add a new point
            points.push(gridCoords);
            gridLines[gridCoords.x][gridCoords.y] = currentLineId;
            lines[currentLineId].getSprite().setDirtyArea();

            // did we just make a connection?
            if (dot == currentLineId)
            {
                lines[currentLineId].connected  = true;
                currentLineId = 0;
                // do we have all the connections that we need?
                for (i=1; i < lines.length; i++)
                {
                    if (!lines[i].connected)
                    {
                        return;
                    }
                }
                // go back to the main menu after 1 second
                gameState = 'finished';
                completedLevels = Math.max(completedLevels, this.currentLevelId);
                wade.storeLocalObject('flowLevelProgression', {completedLevels: completedLevels});
                setTimeout(function()
                {
                    endGame();
                    gameState = 'mainMenu';
                    wade.deleteCanvases();
                }, 1000);
            }
        }
    };
};
//@ sourceURL=flow.js

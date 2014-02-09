
/**
 * This is simple Tetris game is based on HTML5 and JavaScritpt.
 * Much of the inspiration and ideas come from the http://www.freetetris.org/
 * 
 * The 2D image is mainly draw in Canvas and it uses Local Storate to store game data and states
 *
 */

// Basic information for the Tetris , like rows and cols and the size of the cell.
var TETRIS_ROWS = 20;
var TETRIS_COLS = 14;
var CELL_SIZE = 24;
// If there is no block in the cell position, it is represent as 0.
var NO_BLOCK = 0;
//canvas and context variables 
var tetris_canvas;
var tetris_ctx;
// This records the current scores. 
var curScore = 0;
// This records the current speed.
var curSpeed = 1;
// This records the highest score. 
var maxScore = 0;
var curScoreEle , curSpeedEle , maxScoreEle;
var curTimer;
// Check if game is on.
var isPlaying = true;
// The current falling Tetriminos. 
var currentFall;
// The fallen Tetriminos.
var tetris_status = [];

//Initializing the Tetris to 0 (NO_BLOCK)
for (var i = 0; i < TETRIS_ROWS ; i++ )
{
	tetris_status[i] = [];
	for (var j = 0; j < TETRIS_COLS ; j++ )
	{
		tetris_status[i][j] = NO_BLOCK;
	}
}

// Defining the color of the Tetriminos.
colors = ["#fff", "#f00" , "#0f0" , "#00f"
	, "#c60" , "#f0f" , "#0ff" , "#609"];

// Shape of the Tetris
// Each Tetriminos will show up at the middle of the Tetris board
var blockArr = [
	// Tetriminos: Z
	[
		{x: TETRIS_COLS / 2 - 1 , y:0 , color:1},
		{x: TETRIS_COLS / 2 , y:0 ,color:1},
		{x: TETRIS_COLS / 2 , y:1 ,color:1},
		{x: TETRIS_COLS / 2 + 1 , y:1 , color:1}
	],
	// Tetriminos: S 
	[
		{x: TETRIS_COLS / 2 + 1 , y:0 , color:2},
		{x: TETRIS_COLS / 2 , y:0 , color:2},
		{x: TETRIS_COLS / 2 , y:1 , color:2},
		{x: TETRIS_COLS / 2 - 1 , y:1 , color:2}
	],
	// Tetriminos: O
	[
		{x: TETRIS_COLS / 2 - 1 , y:0 , color:3},
		{x: TETRIS_COLS / 2 , y:0 ,  color:3},
		{x: TETRIS_COLS / 2 - 1 , y:1 , color:3},
		{x: TETRIS_COLS / 2 , y:1 , color:3}
	],
	// Tetriminos: L
	[
		{x: TETRIS_COLS / 2 - 1 , y:0 , color:4},
		{x: TETRIS_COLS / 2 - 1, y:1 , color:4},
		{x: TETRIS_COLS / 2 - 1 , y:2 , color:4},
		{x: TETRIS_COLS / 2 , y:2 , color:4}
	],
	// Tetriminos:：J
	[
		{x: TETRIS_COLS / 2  , y:0 , color:5},
		{x: TETRIS_COLS / 2 , y:1, color:5},
		{x: TETRIS_COLS / 2  , y:2, color:5},
		{x: TETRIS_COLS / 2 - 1, y:2, color:5}
	],
	// Tetriminos: I
	[
		{x: TETRIS_COLS / 2 , y:0 , color:6},
		{x: TETRIS_COLS / 2 , y:1 , color:6},
		{x: TETRIS_COLS / 2 , y:2 , color:6},
		{x: TETRIS_COLS / 2 , y:3 , color:6}
	],
	// Tetriminos: T
	[
		{x: TETRIS_COLS / 2 , y:0 , color:7},
		{x: TETRIS_COLS / 2 - 1 , y:1 , color:7},
		{x: TETRIS_COLS / 2 , y:1 , color:7},
		{x: TETRIS_COLS / 2 + 1, y:1 , color:7}
	]
];
// Initialization of the falling Tetriminos.
var initBlock = function()
{
	//Randomly generate the current Tetriminos.
	var rand = Math.floor(Math.random() * blockArr.length);
	currentFall = [
		{x: blockArr[rand][0].x , y: blockArr[rand][0].y
			, color: blockArr[rand][0].color},
		{x: blockArr[rand][1].x , y: blockArr[rand][1].y
			, color: blockArr[rand][1].color},
		{x: blockArr[rand][2].x , y: blockArr[rand][2].y
			, color: blockArr[rand][2].color},
		{x: blockArr[rand][3].x , y: blockArr[rand][3].y 
			, color: blockArr[rand][3].color}
	];
};
// creating a Canvas Object(Tetris Board)  with number of rows & cols and cell sizes 
var createCanvas = function(rows , cols , cellWidth, cellHeight)
{
	tetris_canvas = document.createElement("canvas");
	// Setting up canvas size
	tetris_canvas.width = cols * cellWidth;
	tetris_canvas.height = rows * cellHeight;
	// Setting the border
	tetris_canvas.style.border = "1px solid black";
	// 2D drawer of the canvas
	tetris_ctx = tetris_canvas.getContext('2d');
	// Begin a path in the Tetris to draw a net of cells.  
	tetris_ctx.beginPath();
	for (var i = 1 ; i < TETRIS_ROWS ; i++)
	{
		tetris_ctx.moveTo(0 , i * CELL_SIZE);
		tetris_ctx.lineTo(TETRIS_COLS * CELL_SIZE , i * CELL_SIZE);
	}
	for (var i = 1 ; i < TETRIS_COLS ; i++)
	{
		tetris_ctx.moveTo(i * CELL_SIZE , 0);
		tetris_ctx.lineTo(i * CELL_SIZE , TETRIS_ROWS * CELL_SIZE);
	}
	tetris_ctx.closePath(); 
	// Setting the color of the net.
	tetris_ctx.strokeStyle = "#aaa";
	// Setting the width of the line.
	tetris_ctx.lineWidth = 0.3;
	// Draw
	tetris_ctx.stroke();
}
// Drawing the Tetriminos.
var drawBlock = function()
{
	for (var i = 0; i < TETRIS_ROWS ; i++ )
	{
		for (var j = 0; j < TETRIS_COLS ; j++ )
		{
			// Draw color on cells that are not NO_BLOCK (with different color)
			if(tetris_status[i][j] != NO_BLOCK)
			{
				// setting up the color
				tetris_ctx.fillStyle = colors[tetris_status[i][j]];
				// draw on the center of each cell.
				tetris_ctx.fillRect(j * CELL_SIZE + 1 
					, i * CELL_SIZE + 1, CELL_SIZE - 2 , CELL_SIZE - 2);
			}
			// Draw white on NO_BlOCK cells
			else
			{
				//Setting up color up to white.
				tetris_ctx.fillStyle = 'white';
				tetris_ctx.fillRect(j * CELL_SIZE + 1 
					, i * CELL_SIZE + 1 , CELL_SIZE - 2 , CELL_SIZE - 2);
			}
		}
	}
}
// On load function for the window.
window.onload = function()
{
	// Creating the canvas object and attach it to the body of the HTML page
	createCanvas(TETRIS_ROWS , TETRIS_COLS , CELL_SIZE , CELL_SIZE);
	document.body.appendChild(tetris_canvas);
	// Get the speed, the Score, and the highest Score to respect global variable.
	curScoreEle = document.getElementById("curScoreEle");
	curSpeedEle = document.getElementById("curSpeedEle");
	maxScoreEle = document.getElementById("maxScoreEle");
	// Load the data about tetris_status from the local storage. 
	var tmpStatus = localStorage.getItem("tetris_status");
	// Conditional operator to check if temStatus is null or not
	tetris_status = tmpStatus == null ? tetris_status : JSON.parse(tmpStatus);
	// Draw the Cells
	drawBlock();
	// Load the current score from local storage
	curScore = localStorage.getItem("curScore");
	curScore = curScore == null ? 0 : parseInt(curScore);
	curScoreEle.innerHTML = curScore;
	// load the highest score;
	maxScore = localStorage.getItem("maxScore");
	maxScore = maxScore == null ? 0 : parseInt(maxScore);
	maxScoreEle.innerHTML = maxScore;
	// load the current speed
	curSpeed = localStorage.getItem("curSpeed");
	curSpeed = curSpeed == null ? 1 : parseInt(curSpeed);
	curSpeedEle.innerHTML = curSpeed;
	// Initialing the blocks
	initBlock();
	//  Set the interval for moving down. 
	curTimer = setInterval("moveDown();" ,  500 / curSpeed);
}
// Checking if any line is full
var lineFull = function()
{
	// Go through every single line 
	for (var i = 0; i < TETRIS_ROWS ; i++ )
	{
		var flag = true;
		for (var j = 0 ; j < TETRIS_COLS ; j++ )
		{
			if(tetris_status[i][j] == NO_BLOCK)
			{
				//set the flag if any of the cells is NO_BLOCK
				flag = false;
				break;
			}
		}
		// if a line is a full cells.
		if(flag)
		{
			// Adding 100 to the score
			curScoreEle.innerHTML = curScore+= 100;
			// Store the current score to the local storage.
			localStorage.setItem("curScore" , curScore);
			// If current score is better than level scores
			// The speed will go up --> level up
			if( curScore >= curSpeed * curSpeed * 500)
			{
				curSpeedEle.innerHTML = curSpeed += 1;
				// store the current speed to the localStorage.
				localStorage.setItem("curSpeed" , curSpeed);
				clearInterval(curTimer);
				curTimer = setInterval("moveDown();" ,  500 / curSpeed);
			}
			// After finding the a full-cell line, clearing up the lines.
			//And moving above cells down. 
			for (var k = i ; k > 0 ; k--)
			{
				for (var l = 0; l < TETRIS_COLS ; l++ )
				{
					tetris_status[k][l] =tetris_status[k-1][l];
				}
			}
			//redraw the cells
			drawBlock();      3
		}
	}
}
// 控制方块向下掉。
var moveDown = function()
{
	// 定义能否下掉的旗标
	var canDown = true;    //①
	// 遍历每个方块，判断是否能向下掉
	for (var i = 0 ; i < currentFall.length ; i++)
	{
		// 判断是否已经到“最底下”
		if(currentFall[i].y >= TETRIS_ROWS - 1)
		{
			canDown = false;
			break;
		}
		// 判断下一格是否“有方块”, 如果下一格有方块，不能向下掉
		if(tetris_status[currentFall[i].y + 1][currentFall[i].x] != NO_BLOCK)
		{
			canDown = false;
			break;
		}
	}
	// 如果能向下“掉”
	if(canDown)
	{
		// 将下移前的每个方块的背景色涂成白色
		for (var i = 0 ; i < currentFall.length ; i++)
		{
			var cur = currentFall[i];
			// 设置填充颜色
			tetris_ctx.fillStyle = 'white';
			// 绘制矩形
			tetris_ctx.fillRect(cur.x * CELL_SIZE + 1 
				, cur.y * CELL_SIZE + 1 , CELL_SIZE - 2 , CELL_SIZE - 2);
		}
		// 遍历每个方块, 控制每个方块的y坐标加1。
		// 也就是控制方块都下掉一格
		for (var i = 0 ; i < currentFall.length ; i++)
		{
			var cur = currentFall[i];
			cur.y ++;
		}
		// 将下移后的每个方块的背景色涂成该方块的颜色值
		for (var i = 0 ; i < currentFall.length ; i++)
		{
			var cur = currentFall[i];
			// 设置填充颜色
			tetris_ctx.fillStyle = colors[cur.color];
			// 绘制矩形
			tetris_ctx.fillRect(cur.x * CELL_SIZE + 1 
				, cur.y * CELL_SIZE + 1 , CELL_SIZE - 2 , CELL_SIZE - 2);
		}
	}
	// 不能向下掉
	else
	{
		// 遍历每个方块, 把每个方块的值记录到tetris_status数组中
		for (var i = 0 ; i < currentFall.length ; i++)
		{
			var cur = currentFall[i];
			// 如果有方块已经到最上面了，表明输了
			if(cur.y < 2)
			{
				// 清空Local Storage中的当前积分值、游戏状态、当前速度
				localStorage.removeItem("curScore");
				localStorage.removeItem("tetris_status");
				localStorage.removeItem("curSpeed");
				if(confirm("您已经输了！是否参数排名？"))
				{
					// 读取Local Storage里的maxScore记录
					maxScore = localStorage.getItem("maxScore");
					maxScore = maxScore == null ? 0 : maxScore ;
					// 如果当前积分大于localStorage中记录的最高积分
					if(curScore >= maxScore)
					{
						// 记录最高积分
						localStorage.setItem("maxScore" , curScore);
					}
				}
				// 游戏结束
				isPlaying = false;
				// 清除计时器
				clearInterval(curTimer);
				return;
			}
			// 把每个方块当前所在位置赋为当前方块的颜色值
			tetris_status[cur.y][cur.x] = cur.color;
		}
		// 判断是否有“可消除”的行
		lineFull();
		// 使用Local Storage记录俄罗斯方块的游戏状态
		localStorage.setItem("tetris_status" , JSON.stringify(tetris_status));
		// 开始一组新的方块。
		initBlock();
	}
}
// 定义左移方块的函数
var moveLeft = function()
{
	// 定义能否左移的旗标
	var canLeft = true;
	for (var i = 0 ; i < currentFall.length ; i++)
	{
		// 如果已经到了最左边，不能左移
		if(currentFall[i].x <= 0)
		{
			canLeft = false;
			break;
		}
		// 或左边的位置已有方块，不能左移
		if (tetris_status[currentFall[i].y][currentFall[i].x - 1] != NO_BLOCK)
		{
			canLeft = false;
			break;
		}
	}
	// 如果能左移
	if(canLeft)
	{
		// 将左移前的每个方块的背景色涂成白色
		for (var i = 0 ; i < currentFall.length ; i++)
		{
			var cur = currentFall[i];
			// 设置填充颜色
			tetris_ctx.fillStyle = 'white';
			// 绘制矩形
			tetris_ctx.fillRect(cur.x * CELL_SIZE +1 
				, cur.y * CELL_SIZE + 1 , CELL_SIZE - 2, CELL_SIZE - 2);
		}
		// 左移所有正在下掉的方块
		for (var i = 0 ; i < currentFall.length ; i++)
		{
			var cur = currentFall[i];
			cur.x --;
		}
		// 将左移后的每个方块的背景色涂成方块对应的颜色
		for (var i = 0 ; i < currentFall.length ; i++)
		{
			var cur = currentFall[i];
			// 设置填充颜色
			tetris_ctx.fillStyle = colors[cur.color];
			// 绘制矩形
			tetris_ctx.fillRect(cur.x * CELL_SIZE + 1  
				, cur.y * CELL_SIZE + 1, CELL_SIZE - 2 , CELL_SIZE - 2);
		}
	}
}
// 定义右移方块的函数
var moveRight = function()
{
	// 定义能否右移的旗标
	var canRight = true;
	for (var i = 0 ; i < currentFall.length ; i++)
	{
		// 如果已到了最右边，不能右移
		if(currentFall[i].x >= TETRIS_COLS - 1)
		{
			canRight = false;
			break;
		}
		// 如果右边的位置已有方块，不能右移
		if (tetris_status[currentFall[i].y][currentFall[i].x + 1] != NO_BLOCK)
		{
			canRight = false;
			break;
		}
	}
	// 如果能右移
	if(canRight)
	{		
		// 将右移前的每个方块的背景色涂成白色
		for (var i = 0 ; i < currentFall.length ; i++)
		{
			var cur = currentFall[i];
			// 设置填充颜色
			tetris_ctx.fillStyle = 'white';
			// 绘制矩形
			tetris_ctx.fillRect(cur.x * CELL_SIZE + 1  
				, cur.y * CELL_SIZE + 1 , CELL_SIZE - 2 , CELL_SIZE - 2);
		}
		// 右移所有正在下掉的方块
		for (var i = 0 ; i < currentFall.length ; i++)
		{
			var cur = currentFall[i];
			cur.x ++;
		}
		// 将右移后的每个方块的背景色涂成各方块对应的颜色
		for (var i = 0 ; i < currentFall.length ; i++)
		{
			var cur = currentFall[i];
			// 设置填充颜色
			tetris_ctx.fillStyle = colors[cur.color];
			// 绘制矩形
			tetris_ctx.fillRect(cur.x * CELL_SIZE + 1 
				, cur.y * CELL_SIZE + 1 , CELL_SIZE - 2, CELL_SIZE -2);
		}
	}
}
// 定义旋转方块的函数
var rotate = function()
{
	// 定义记录能否旋转的旗标
	var canRotate = true;
	for (var i = 0 ; i < currentFall.length ; i++)
	{
		var preX = currentFall[i].x;
		var preY = currentFall[i].y;
		// 始终以第三个方块作为旋转的中心,
		// i == 2时，说明是旋转的中心
		if(i != 2)
		{
			// 计算方块旋转后的x、y坐标
			var afterRotateX = currentFall[2].x + preY - currentFall[2].y;
			var afterRotateY = currentFall[2].y + currentFall[2].x - preX;
			// 如果旋转后所在位置已有方块，表明不能旋转
			if(tetris_status[afterRotateY][afterRotateX + 1] != NO_BLOCK)
			{
				canRotate = false;
				break;
			}
			// 如果旋转后的坐标已经超出了最左边边界
			if(afterRotateX < 0 || tetris_status[afterRotateY - 1][afterRotateX] != NO_BLOCK)
			{
				moveRight();
				afterRotateX = currentFall[2].x + preY - currentFall[2].y;
				afterRotateY = currentFall[2].y + currentFall[2].x - preX;
				break;
			}
			if(afterRotateX < 0 || tetris_status[afterRotateY-1][afterRotateX] != NO_BLOCK)
			{
				moveRight();
				break;
			}
			// 如果旋转后的坐标已经超出了最右边边界
			if(afterRotateX >= TETRIS_COLS - 1 || 
				tetris_status[afterRotateY][afterRotateX+1] != NO_BLOCK)
			{
				moveLeft();
				afterRotateX = currentFall[2].x + preY - currentFall[2].y;
				afterRotateY = currentFall[2].y + currentFall[2].x - preX;
				break;
			}
			if(afterRotateX >= TETRIS_COLS - 1 || 
				tetris_status[afterRotateY][afterRotateX+1] != NO_BLOCK)
			{
				moveLeft();
				break;
			}
		}
	}
	// 如果能旋转
	if(canRotate)
	{
		// 将旋转移前的每个方块的背景色涂成白色
		for (var i = 0 ; i < currentFall.length ; i++)
		{
			var cur = currentFall[i];
			// 设置填充颜色
			tetris_ctx.fillStyle = 'white';
			// 绘制矩形
			tetris_ctx.fillRect(cur.x * CELL_SIZE + 1  
				, cur.y * CELL_SIZE + 1 , CELL_SIZE - 2, CELL_SIZE - 2);
		}
		for (var i = 0 ; i < currentFall.length ; i++)
		{
			var preX = currentFall[i].x;
			var preY = currentFall[i].y;
			// 始终以第三个方块作为旋转的中心,
			// i == 2时，说明是旋转的中心
			if(i != 2)
			{
				currentFall[i].x = currentFall[2].x + 
					preY - currentFall[2].y;
				currentFall[i].y = currentFall[2].y + 
					currentFall[2].x - preX;
			}
		}
		// 将旋转后的每个方块的背景色涂成各方块对应的颜色
		for (var i = 0 ; i < currentFall.length ; i++)
		{
			var cur = currentFall[i];
			// 设置填充颜色
			tetris_ctx.fillStyle = colors[cur.color];
			// 绘制矩形
			tetris_ctx.fillRect(cur.x * CELL_SIZE + 1 
				, cur.y * CELL_SIZE + 1 , CELL_SIZE - 2, CELL_SIZE - 2);
		}
	}
}
window.focus();
// 为窗口的按键事件绑定事件监听器
window.onkeydown = function(evt)
{
	switch(evt.keyCode)
	{
		// 按下了“向下”箭头
		case 40:
			if(!isPlaying)
				return;
			moveDown();
			break;
		// 按下了“向左”箭头
		case 37:
			if(!isPlaying)
				return;
			moveLeft();
			break;
		// 按下了“向右”箭头
		case 39:
			if(!isPlaying)
				return;
			moveRight();
			break;
		// 按下了“向上”箭头
		case 38:
			if(!isPlaying)
				return;
			rotate();
			break;
	}
}
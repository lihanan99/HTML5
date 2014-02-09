
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
	// Tetriminos:��J
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
// ���Ʒ������µ���
var moveDown = function()
{
	// �����ܷ��µ������
	var canDown = true;    //��
	// ����ÿ�����飬�ж��Ƿ������µ�
	for (var i = 0 ; i < currentFall.length ; i++)
	{
		// �ж��Ƿ��Ѿ���������¡�
		if(currentFall[i].y >= TETRIS_ROWS - 1)
		{
			canDown = false;
			break;
		}
		// �ж���һ���Ƿ��з��顱, �����һ���з��飬�������µ�
		if(tetris_status[currentFall[i].y + 1][currentFall[i].x] != NO_BLOCK)
		{
			canDown = false;
			break;
		}
	}
	// ��������¡�����
	if(canDown)
	{
		// ������ǰ��ÿ������ı���ɫͿ�ɰ�ɫ
		for (var i = 0 ; i < currentFall.length ; i++)
		{
			var cur = currentFall[i];
			// ���������ɫ
			tetris_ctx.fillStyle = 'white';
			// ���ƾ���
			tetris_ctx.fillRect(cur.x * CELL_SIZE + 1 
				, cur.y * CELL_SIZE + 1 , CELL_SIZE - 2 , CELL_SIZE - 2);
		}
		// ����ÿ������, ����ÿ�������y�����1��
		// Ҳ���ǿ��Ʒ��鶼�µ�һ��
		for (var i = 0 ; i < currentFall.length ; i++)
		{
			var cur = currentFall[i];
			cur.y ++;
		}
		// �����ƺ��ÿ������ı���ɫͿ�ɸ÷������ɫֵ
		for (var i = 0 ; i < currentFall.length ; i++)
		{
			var cur = currentFall[i];
			// ���������ɫ
			tetris_ctx.fillStyle = colors[cur.color];
			// ���ƾ���
			tetris_ctx.fillRect(cur.x * CELL_SIZE + 1 
				, cur.y * CELL_SIZE + 1 , CELL_SIZE - 2 , CELL_SIZE - 2);
		}
	}
	// �������µ�
	else
	{
		// ����ÿ������, ��ÿ�������ֵ��¼��tetris_status������
		for (var i = 0 ; i < currentFall.length ; i++)
		{
			var cur = currentFall[i];
			// ����з����Ѿ����������ˣ���������
			if(cur.y < 2)
			{
				// ���Local Storage�еĵ�ǰ����ֵ����Ϸ״̬����ǰ�ٶ�
				localStorage.removeItem("curScore");
				localStorage.removeItem("tetris_status");
				localStorage.removeItem("curSpeed");
				if(confirm("���Ѿ����ˣ��Ƿ����������"))
				{
					// ��ȡLocal Storage���maxScore��¼
					maxScore = localStorage.getItem("maxScore");
					maxScore = maxScore == null ? 0 : maxScore ;
					// �����ǰ���ִ���localStorage�м�¼����߻���
					if(curScore >= maxScore)
					{
						// ��¼��߻���
						localStorage.setItem("maxScore" , curScore);
					}
				}
				// ��Ϸ����
				isPlaying = false;
				// �����ʱ��
				clearInterval(curTimer);
				return;
			}
			// ��ÿ�����鵱ǰ����λ�ø�Ϊ��ǰ�������ɫֵ
			tetris_status[cur.y][cur.x] = cur.color;
		}
		// �ж��Ƿ��С�������������
		lineFull();
		// ʹ��Local Storage��¼����˹�������Ϸ״̬
		localStorage.setItem("tetris_status" , JSON.stringify(tetris_status));
		// ��ʼһ���µķ��顣
		initBlock();
	}
}
// �������Ʒ���ĺ���
var moveLeft = function()
{
	// �����ܷ����Ƶ����
	var canLeft = true;
	for (var i = 0 ; i < currentFall.length ; i++)
	{
		// ����Ѿ���������ߣ���������
		if(currentFall[i].x <= 0)
		{
			canLeft = false;
			break;
		}
		// ����ߵ�λ�����з��飬��������
		if (tetris_status[currentFall[i].y][currentFall[i].x - 1] != NO_BLOCK)
		{
			canLeft = false;
			break;
		}
	}
	// ���������
	if(canLeft)
	{
		// ������ǰ��ÿ������ı���ɫͿ�ɰ�ɫ
		for (var i = 0 ; i < currentFall.length ; i++)
		{
			var cur = currentFall[i];
			// ���������ɫ
			tetris_ctx.fillStyle = 'white';
			// ���ƾ���
			tetris_ctx.fillRect(cur.x * CELL_SIZE +1 
				, cur.y * CELL_SIZE + 1 , CELL_SIZE - 2, CELL_SIZE - 2);
		}
		// �������������µ��ķ���
		for (var i = 0 ; i < currentFall.length ; i++)
		{
			var cur = currentFall[i];
			cur.x --;
		}
		// �����ƺ��ÿ������ı���ɫͿ�ɷ����Ӧ����ɫ
		for (var i = 0 ; i < currentFall.length ; i++)
		{
			var cur = currentFall[i];
			// ���������ɫ
			tetris_ctx.fillStyle = colors[cur.color];
			// ���ƾ���
			tetris_ctx.fillRect(cur.x * CELL_SIZE + 1  
				, cur.y * CELL_SIZE + 1, CELL_SIZE - 2 , CELL_SIZE - 2);
		}
	}
}
// �������Ʒ���ĺ���
var moveRight = function()
{
	// �����ܷ����Ƶ����
	var canRight = true;
	for (var i = 0 ; i < currentFall.length ; i++)
	{
		// ����ѵ������ұߣ���������
		if(currentFall[i].x >= TETRIS_COLS - 1)
		{
			canRight = false;
			break;
		}
		// ����ұߵ�λ�����з��飬��������
		if (tetris_status[currentFall[i].y][currentFall[i].x + 1] != NO_BLOCK)
		{
			canRight = false;
			break;
		}
	}
	// ���������
	if(canRight)
	{		
		// ������ǰ��ÿ������ı���ɫͿ�ɰ�ɫ
		for (var i = 0 ; i < currentFall.length ; i++)
		{
			var cur = currentFall[i];
			// ���������ɫ
			tetris_ctx.fillStyle = 'white';
			// ���ƾ���
			tetris_ctx.fillRect(cur.x * CELL_SIZE + 1  
				, cur.y * CELL_SIZE + 1 , CELL_SIZE - 2 , CELL_SIZE - 2);
		}
		// �������������µ��ķ���
		for (var i = 0 ; i < currentFall.length ; i++)
		{
			var cur = currentFall[i];
			cur.x ++;
		}
		// �����ƺ��ÿ������ı���ɫͿ�ɸ������Ӧ����ɫ
		for (var i = 0 ; i < currentFall.length ; i++)
		{
			var cur = currentFall[i];
			// ���������ɫ
			tetris_ctx.fillStyle = colors[cur.color];
			// ���ƾ���
			tetris_ctx.fillRect(cur.x * CELL_SIZE + 1 
				, cur.y * CELL_SIZE + 1 , CELL_SIZE - 2, CELL_SIZE -2);
		}
	}
}
// ������ת����ĺ���
var rotate = function()
{
	// �����¼�ܷ���ת�����
	var canRotate = true;
	for (var i = 0 ; i < currentFall.length ; i++)
	{
		var preX = currentFall[i].x;
		var preY = currentFall[i].y;
		// ʼ���Ե�����������Ϊ��ת������,
		// i == 2ʱ��˵������ת������
		if(i != 2)
		{
			// ���㷽����ת���x��y����
			var afterRotateX = currentFall[2].x + preY - currentFall[2].y;
			var afterRotateY = currentFall[2].y + currentFall[2].x - preX;
			// �����ת������λ�����з��飬����������ת
			if(tetris_status[afterRotateY][afterRotateX + 1] != NO_BLOCK)
			{
				canRotate = false;
				break;
			}
			// �����ת��������Ѿ�����������߽߱�
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
			// �����ת��������Ѿ����������ұ߽߱�
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
	// �������ת
	if(canRotate)
	{
		// ����ת��ǰ��ÿ������ı���ɫͿ�ɰ�ɫ
		for (var i = 0 ; i < currentFall.length ; i++)
		{
			var cur = currentFall[i];
			// ���������ɫ
			tetris_ctx.fillStyle = 'white';
			// ���ƾ���
			tetris_ctx.fillRect(cur.x * CELL_SIZE + 1  
				, cur.y * CELL_SIZE + 1 , CELL_SIZE - 2, CELL_SIZE - 2);
		}
		for (var i = 0 ; i < currentFall.length ; i++)
		{
			var preX = currentFall[i].x;
			var preY = currentFall[i].y;
			// ʼ���Ե�����������Ϊ��ת������,
			// i == 2ʱ��˵������ת������
			if(i != 2)
			{
				currentFall[i].x = currentFall[2].x + 
					preY - currentFall[2].y;
				currentFall[i].y = currentFall[2].y + 
					currentFall[2].x - preX;
			}
		}
		// ����ת���ÿ������ı���ɫͿ�ɸ������Ӧ����ɫ
		for (var i = 0 ; i < currentFall.length ; i++)
		{
			var cur = currentFall[i];
			// ���������ɫ
			tetris_ctx.fillStyle = colors[cur.color];
			// ���ƾ���
			tetris_ctx.fillRect(cur.x * CELL_SIZE + 1 
				, cur.y * CELL_SIZE + 1 , CELL_SIZE - 2, CELL_SIZE - 2);
		}
	}
}
window.focus();
// Ϊ���ڵİ����¼����¼�������
window.onkeydown = function(evt)
{
	switch(evt.keyCode)
	{
		// �����ˡ����¡���ͷ
		case 40:
			if(!isPlaying)
				return;
			moveDown();
			break;
		// �����ˡ����󡱼�ͷ
		case 37:
			if(!isPlaying)
				return;
			moveLeft();
			break;
		// �����ˡ����ҡ���ͷ
		case 39:
			if(!isPlaying)
				return;
			moveRight();
			break;
		// �����ˡ����ϡ���ͷ
		case 38:
			if(!isPlaying)
				return;
			rotate();
			break;
	}
}
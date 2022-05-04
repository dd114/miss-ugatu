import React, { useState, useEffect, Component } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { View, ScreenSpinner, AdaptivityProvider, AppRoot, ConfigProvider, SplitLayout, SplitCol } from '@vkontakte/vkui';
// import '@vkontakte/vkui/dist/vkui.css';

class App extends Component {

	componentDidMount(){
		const canvas = document.getElementById('canvas');
		const ctx = canvas.getContext('2d');

		const img = new Image();
		const background = new Image()
		const topPipe = new Image()
		const bottomPipe = new Image()
		const bird1 = new Image()
		const bird2 = new Image()
		const bird3 = new Image()
		const birds = [bird1, bird2, bird3]

		img.src = "https://i.ibb.co/Q9yv5Jk/flappy-bird-set.png";
		background.src = "https://i.ibb.co/TH4dXYh/background.png"
		topPipe.src = "https://i.ibb.co/Sv0gWQt/topPipe.png"
		bottomPipe.src = "https://i.ibb.co/5BvD5Lw/bottom-Pipe.png"
		bird1.src = "https://i.ibb.co/mt8098S/bird1.png"
		bird2.src = "https://i.ibb.co/Vw854hc/bird2.png"
		bird3.src = "https://i.ibb.co/C2c7cWP/bird3.png"

		if (topPipe.width === bottomPipe.width && topPipe.height === bottomPipe.height) console.log("Correct")
		else console.log("INCORRECT")


// general settings
		let gamePlaying = false;
		const gravity = .5;
		const speed = 6.2;
		const size = [bird1.width, bird1.height];
		const jump = -11.5;
		const cTenth = (canvas.width / 10);
		const spaceBetweenPipe = 4 * size[0]

		let index = 0,
			bestScore = 0,
			flight,
			flyHeight,
			currentScore,
			pipes;



		canvas.height = window.innerHeight;

		console.log(canvas.width, canvas.height)





// pipe settings
		const pipeWidth = 78;
		const pipeGap = 270;
		const pipeLoc = () => ((Math.random() * (canvas.height - spaceBetweenPipe)) % topPipe.height);

		const setup = () => {
			currentScore = 0;
			flight = jump;

			// set initial flyHeight (middle of screen - size of the bird)
			flyHeight = (canvas.height / 2) - (size[1] / 2);

			// setup first 3 pipes
			pipes = Array(3).fill().map((a, i) => {
				// console.log(a, i);
				return [canvas.width + (i * (pipeGap + pipeWidth)), pipeLoc()]
			});
		}

		const render = () => {
			// console.log("RENDER")

			// make the pipe and bird moving
			index++;

			// ctx.clearRect(0, 0, canvas.width, canvas.height);

			// background first part
			ctx.drawImage(background, -((index * (speed / 2)) % canvas.width) + canvas.width, 0, canvas.width, canvas.height);
			// background second part
			ctx.drawImage(background, -(index * (speed / 2)) % canvas.width, 0, canvas.width, canvas.height);

			// pipe display
			if (gamePlaying){
				pipes.map(pipe => {
					// pipe moving
					pipe[0] -= speed;

					// top pipe
					ctx.drawImage(topPipe, pipe[0], pipe[1] - topPipe.height, topPipe.width, topPipe.height);
					// bottom pipe
					ctx.drawImage(bottomPipe, pipe[0], pipe[1] + spaceBetweenPipe, bottomPipe.width, bottomPipe.height);


					// give 1 point & create new pipe
					if(pipe[0] <= -pipeWidth){
						currentScore++;
						// check if it's the best score
						bestScore = Math.max(bestScore, currentScore);

						// remove & create new pipe
						pipes = [...pipes.slice(1), [pipes[pipes.length-1][0] + pipeGap + pipeWidth, pipeLoc()]];
						console.log(pipes);
					}

					// if hit the pipe, end
					if ([
						pipe[0] <= cTenth + size[0],
						pipe[0] + pipeWidth >= cTenth,
						pipe[1] > flyHeight || pipe[1] + pipeGap < flyHeight + size[1]
					].every(elem => elem)) {
						gamePlaying = false;
						setup();
					}
				})
			}
			// draw bird
			if (gamePlaying) {
				// ctx.drawImage(img, 432, Math.floor((index % 9) / 3) * size[1], ...size, cTenth, flyHeight, ...size);
				ctx.drawImage(birds[index % birds.length], cTenth, flyHeight, ...size);

				flight += gravity;
				flyHeight = Math.min(flyHeight + flight, canvas.height - size[1]);
			} else {
				// ctx.drawImage(img, 432, Math.floor((index % 9) / 3) * size[1], ...size, ((canvas.width / 2) - size[0] / 2), flyHeight, ...size);
				ctx.drawImage(birds[index % birds.length], ((canvas.width / 2) - size[0] / 2), flyHeight, ...size);

				flyHeight = (canvas.height / 2) - (size[1] / 2);

				// text accueil
				ctx.fillText(`Best score : ${bestScore}`, 85, 245);
				ctx.fillText('Click to play', 90, 535);
				ctx.font = "bold 30px courier";
			}

			document.getElementById('bestScore').innerHTML = `Best : ${bestScore}`;
			document.getElementById('currentScore').innerHTML = `Current : ${currentScore}`;

			// tell the browser to perform anim
			window.requestAnimationFrame(render);
		}

// launch setup
		setup();
		background.onload = render;

// start game
		document.addEventListener('click', () => {
			// console.log("addEventListener")
			gamePlaying = true
		});
		window.onclick = () => {
			// console.log("onclick")
			flight = jump;
		}

		// console.log(gamePlaying)
	}

render() {
	return (
		<div>
			<header>
				<h1>Floppy Bird</h1>
				<div className="score-container">
					<div id="bestScore"></div>
					<div id="currentScore"></div>
				</div>
			</header>

			<canvas id="canvas" width="431"></canvas>
		</div>

	);
}


}

export default App;

import React, { useState, useEffect, Component } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { View, ScreenSpinner, AdaptivityProvider, AppRoot, ConfigProvider, SplitLayout, SplitCol } from '@vkontakte/vkui';
// import '@vkontakte/vkui/dist/vkui.css';

import  './css/index.css'

import backgroundImg from './img/background.png'
import topPipeImg from './img/topPipe.png'
import bottomPipeImg from './img/bottomPipe.png'
import bird1Img from './img/bird1.png'
import bird2Img from './img/bird2.png'
import bird3Img from './img/bird3.png'


class App extends Component {

	componentDidMount(){

		const canvas = document.querySelector('canvas');
		const ctx = canvas.getContext('2d');

		canvas.height = window.innerHeight - document.querySelector('header').clientHeight - 17; // it must be changed
		canvas.width = window.innerWidth;

		console.log(canvas.width, canvas.height)

		const background = new Image()
		const topPipe = new Image()
		const bottomPipe = new Image()
		const bird1 = new Image()
		const bird2 = new Image()
		const bird3 = new Image()
		const birds = [bird1, bird2, bird3]

		background.src = backgroundImg
		topPipe.src = topPipeImg
		bottomPipe.src = bottomPipeImg
		bird1.src = bird1Img
		bird2.src = bird2Img
		bird3.src = bird3Img

		if (topPipe.width === bottomPipe.width && topPipe.height === bottomPipe.height)
			console.log("Correct")
		else
			console.log("INCORRECT")


// general settings
// 		const kHeight = canvas.height / 730;
		const kHeight = canvas.height / 600;
		const kWidth = canvas.width / 431;

		let gamePlaying = false;
		const gravity = .5;
		const speed = 5.2;
		const jump = -11.5;
		const cTenth = (canvas.width / 10);

		const size = [51, 36]; // must be changed in another picture
		topPipe.width = 78; // must be changed in another picture
		topPipe.height = 480; // must be changed in another picture

		const spaceBetweenPipe = 4 * size[0]



		let index = 0,
			bestScore = 0,
			flight,
			flyHeight,
			currentScore,
			pipes;









// pipe settings

		const pipeGap = 300 * kHeight;
		const offset = 0.1 * canvas.height;
		const pipeLoc = () => (((canvas.height / 2 - 0.5 * spaceBetweenPipe)  + (Math.random() - 0.5) * (canvas.height - 2 * spaceBetweenPipe - offset)) % (topPipe.height * kHeight));


		const fillEllipse = (x, y, radiusX, radiusY, rotation, color) => {
			ctx.fillStyle = color;
			ctx.beginPath();
			ctx.ellipse(x, y, radiusX, radiusY, rotation, 0, 2 * Math.PI);
			ctx.fill();
		}



		const setup = () => {
			currentScore = 0;
			flight = jump;

			// set initial flyHeight (middle of screen - size of the bird)
			flyHeight = (canvas.height / 2) - (size[1] / 2);

			// setup first 3 pipes
			pipes = Array(3).fill().map((a, i) => {
				// console.log(a, i);
				let height = pipeLoc()
				// console.log(height, typeof height)
				return [canvas.width + (i * (pipeGap + topPipe.width)), height]
			});

			document.getElementById('bestScore').innerHTML = `Best : ${bestScore}`;
			document.getElementById('currentScore').innerHTML = `Current : ${currentScore}`;
		}

		// let penultimateTime = -1;
		// let lastTime = -1;

		const render = () => {

			// console.log("RENDER")

			// penultimateTime = lastTime
			// lastTime = performance.now()

			// if (index === 5) console.log(lastTime - penultimateTime)

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
					ctx.drawImage(topPipe, pipe[0], pipe[1] - topPipe.height * kHeight, topPipe.width * kWidth, topPipe.height * kHeight);
					// bottom pipe
					ctx.drawImage(bottomPipe, pipe[0], pipe[1] + spaceBetweenPipe, bottomPipe.width * kWidth, bottomPipe.height * kHeight);


					// give 1 point & create new pipe
					if(pipe[0] < -topPipe.width * kWidth){
						currentScore++;
						// check if it's the best score
						bestScore = Math.max(bestScore, currentScore);

						// remove & create new pipe
						pipes = [...pipes.slice(1), [pipes[pipes.length-1][0] + pipeGap + topPipe.width, pipeLoc()]];
						console.log(pipes);

						document.getElementById('bestScore').innerHTML = `Best : ${bestScore}`;
						document.getElementById('currentScore').innerHTML = `Current : ${currentScore}`;
					}


					/*
					console.log([
						pipe[0] <= cTenth + size[0],
						pipe[0] + topPipe.width >= cTenth,
						pipe[1] > flyHeight || ((pipe[1] + spaceBetweenPipe) < (flyHeight + size[1]))
					])
					*/

					/*
					fillEllipse(pipe[0], pipe[1] + spaceBetweenPipe, 5, 5, 0, 'blue')
					fillEllipse(pipe[0], pipe[1], 5, 5, 0, 'blue')
					fillEllipse(cTenth + size[0], flyHeight + size[1], 5, 5, 0, 'red')
					*/


					// console.log(pipe[0], pipe[1], spaceBetweenPipe)


					// if hit the pipe, end
					if ([
						pipe[0] <= cTenth + size[0],
						pipe[0] + topPipe.width * kWidth >= cTenth,
						pipe[1] > flyHeight || ((pipe[1] + spaceBetweenPipe) < (flyHeight + size[1]))
					].every(elem => elem)) {
						console.log('HIT', pipes)
						console.log('Size', size)
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
				ctx.fillText(`Best score : ${bestScore}`, canvas.width / 2 - 120 - 5, canvas.height / 2 - 120);
				ctx.fillText('Click to play', canvas.width / 2 - 120, canvas.height / 2 + 120);
				ctx.font = "bold 30px courier";
			}



			// tell the browser to perform anim
			// window.requestAnimationFrame(render);
		}

// launch setup
		setup();
		// background.onload = render;
		setInterval(render, 1000 / 60)
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
	// const styles = {
	// 	canvas : {
	// 		width: innerWidth,
	// 		height: innerHeight
	// 	}
	// }

	return (
		<div>
			<header>
				<h1>Floppy Bird</h1>
				<div className="score-container">
					<div id="bestScore"></div>
					<div id="currentScore"></div>
				</div>
			</header>

			{/*<canvas style={styles.canvas}></canvas>*/}
			<canvas ></canvas>

		</div>

	);
}


}

export default App;

import React, {useState, useEffect, Component} from 'react';
import bridge from '@vkontakte/vk-bridge';
import {View, ScreenSpinner, AdaptivityProvider, AppRoot, ConfigProvider, SplitLayout, SplitCol} from '@vkontakte/vkui';
// import '@vkontakte/vkui/dist/vkui.css';

import './css/index.css'
import {collection, doc, updateDoc, getDoc, setDoc} from 'firebase/firestore'

import backgroundImg from './img/miss/background.jpg'
import topPipeImg from './img/miss/topPipe.png'
import bottomPipeImg from './img/miss/bottomPipe.png'
import bird1Img from './img/miss/face2.png'
import fireStore from "./DB";
// import bird2Img from './img/bird2.png'
// import bird3Img from './img/bird3.png'


class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            bestScore: 0,
            id: -1,
            currentScore: 0,
            constBestScore: 0
        }


        bridge.send('VKWebAppGetUserInfo')
            .then((data) => {
                console.log('data.id', data.id)

                this.setState({
                    id: data.id.toString()
                })

                this.getData(data.id).then((result) => {

                    if (result !== false) {
                        this.setState({
                            bestScore: result.bestScore,
                            constBestScore: result.bestScore
                        })
                    } else {
                        let date = new Date()
                        setDoc(doc(fireStore, 'users', data.id.toString()), {
                            bestScore: 0, Name: data.first_name, Surname: data.last_name,
                            timeOfBestScore: date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear(),
                            idVK: data.id
                        });
                    }

                })
            })


    }

    async getData(id) {
        const docRef = doc(fireStore, "users", id.toString());
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists())
            return false;
        return docSnap.data()
    }

    componentWillUnmount() {

    }

    componentDidMount() {

        const canvas = document.querySelector('canvas');
        const ctx = canvas.getContext('2d');

        canvas.height = window.innerHeight - document.querySelector('header').clientHeight - 17 - 30; // it must be changed
        canvas.width = window.innerWidth;

        console.log(canvas.width, canvas.height)

        const background = new Image()
        const topPipe = new Image()
        const bottomPipe = new Image()
        const bird1 = new Image()
        // const bird2 = new Image()
        // const bird3 = new Image()
        const birds = [bird1]

        background.src = backgroundImg
        topPipe.src = topPipeImg
        bottomPipe.src = bottomPipeImg
        bird1.src = bird1Img
        // bird2.src = bird2Img
        //         // bird3.src = bird3Img

        if (topPipe.width === bottomPipe.width && topPipe.height === bottomPipe.height)
            console.log("Correct")
        else
            console.log("INCORRECT")


// general settings
// 		const kHeight = canvas.height / 730;
        const kHeight = canvas.height / 700;
        // const kWidth = canvas.width / 431;
        const kWidth = canvas.width / 630;

        let gamePlaying = false;
        let gravity;
        let speed;
        // let jump = -11.5;
        let jump = -10;
        const cTenth = (canvas.width / 10);

        const size = [65, 90]; // must be changed in another picture
        topPipe.width = 78; // must be changed in another picture
        topPipe.height = 480; // must be changed in another picture

        const spaceBetweenPipe = 4 * size[0]


        let index = 0, flight, flyHeight, pipes;


// pipe settings

        // const pipeGap = 300 * kHeight;
        const pipeGap = 0.8 * canvas.width;
        const offset = 0.1 * canvas.height;
        const pipeLoc = () => (((canvas.height - spaceBetweenPipe) / 2 + (Math.random() - 0.5) * ((canvas.height - spaceBetweenPipe) - offset)) % (topPipe.height * kHeight));

        console.log('pipeGap:', pipeGap)

        const fillEllipse = (x, y, radiusX, radiusY, rotation, color) => {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.ellipse(x, y, radiusX, radiusY, rotation, 0, 2 * Math.PI);
            ctx.fill();
        }


        const setup = () => {
            // currentScore = 0;
            this.setState({
                currentScore: 0
            })
            flight = jump;

            // set initial flyHeight (middle of screen - size of the bird)
            flyHeight = (canvas.height / 2) - (size[1] / 2);

            // setup first 3 pipes
            pipes = Array(3).fill().map((a, i) => {
                // console.log(a, i);
                let height = pipeLoc()
                // console.log(height, typeof height)
                return [canvas.width + i * pipeGap, height]
            });

            // document.getElementById('bestScore').innerHTML = `Best : ${bestScore}`;
            // document.getElementById('currentScore').innerHTML = `Current : ${currentScore}`;

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
            if (gamePlaying) {
                pipes.map(pipe => {
                    // pipe moving
                    pipe[0] -= speed;

                    // top pipe
                    ctx.drawImage(topPipe, pipe[0], pipe[1] - topPipe.height * kHeight, topPipe.width * kWidth, topPipe.height * kHeight);
                    // bottom pipe
                    ctx.drawImage(bottomPipe, pipe[0], pipe[1] + spaceBetweenPipe, bottomPipe.width * kWidth, bottomPipe.height * kHeight);


                    // give 1 point & create new pipe
                    if (pipe[0] < -topPipe.width * kWidth) {
                        // currentScore++;

                        // check if it's the best score
                        // bestScore = ;
                        this.setState({
                            bestScore: Math.max(this.state.bestScore, this.state.currentScore + 1),
                            currentScore: this.state.currentScore + 1
                        })

                        // console.log('State:', this.state)
                        // remove & create new pipe
                        pipes = [...pipes.slice(1), [pipes[pipes.length - 1][0] + pipeGap + topPipe.width, pipeLoc()]];
                        // console.log(pipes);

                        // document.getElementById('bestScore').innerHTML = `Best : ${bestScore}`;
                        // document.getElementById('currentScore').innerHTML = `Current : ${currentScore}`;
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
                    if ([pipe[0] <= cTenth + size[0], pipe[0] + topPipe.width * kWidth >= cTenth, pipe[1] > flyHeight || ((pipe[1] + spaceBetweenPipe) < (flyHeight + size[1]))].every(elem => elem)) {
                        // console.log('HIT', pipes)
                        // console.log('Size', size)
                        gamePlaying = false;
                        setup();

                        if (this.state.bestScore <= this.state.constBestScore) return
                        updateDoc(doc(fireStore, 'users', this.state.id.toString()), {
                            bestScore: this.state.bestScore
                        })
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
                ctx.fillText(`Best score : ${this.state.bestScore}`, canvas.width / 2 - 120 - 5, canvas.height / 2 - 120);
                ctx.fillText('Click to play', canvas.width / 2 - 120, canvas.height / 2 + 120);
                ctx.font = "bold 30px courier";
            }


            // tell the browser to perform anim
            window.requestAnimationFrame(render);
        }


        const checkFPS = () => {

            let time, sum = 0, index = 1, requestID, cancel = false, avg = -1, offset = 5;

// setTimeout(setup, 1000);
            setupTime();

            function setupTime() {
                time = performance.now();
                requestID = window.requestAnimationFrame(step);
                setTimeout(cancelAnimation, 1000);
            }

            function cancelAnimation() {
                // console.log("CANCEL ANIMATION")
                console.log('AVG FPS =', avg);

                cancel = true;

                let currentFPS = -1;
                let kFrameRate;
                if (avg > 45 && avg < 80) {
                    currentFPS = 60;
                } else if (avg > 80 && avg < 110) {
                    currentFPS = 90;
                } else if (avg > 110 && avg < 135) {
                    currentFPS = 120;
                } else {
                    console.error("App has been crashed", "currentFPS =", currentFPS)
                    window.location.reload()
                    return
                }

                kFrameRate = 60 / currentFPS

                gravity = .5 * kFrameRate;
                speed = 5.2 * kWidth * kFrameRate;
                // jump = -11.5 * kFrameRate;

                render();

                console.log('currentFPS =', currentFPS);
            }

            function step() {
                // console.log("STEP")

                let time2 = performance.now()
                let fps = 1000 / (time2 - time);


                if (fps === Infinity) {
                    time2 = performance.now();
                    time = time2;
                    window.requestAnimationFrame(step);
                    return;
                }

                if (fps > 150 || fps < 20) {
                    time2 = performance.now();
                    time = time2;
                    window.requestAnimationFrame(step);
                    return;
                }

                ++index;

                if (index <= offset) {
                    time2 = performance.now();
                    time = time2;
                    window.requestAnimationFrame(step);
                    return;
                }

                sum += fps;
                avg = sum / (index - offset);


                // console.log(`Index: ${(index - offset)}`);
                // console.log(`Sum: ${sum}`);
                // console.log(`FPS: ${fps}`);
                // console.log(`AVG: ${avg}`);
                // console.log(sum === Infinity);

                if (sum === Infinity) {
                    console.log(time + " " + fps + " " + time2);
                    return;
                }


                if (cancel === true) {
                    window.cancelAnimationFrame(requestID);
                    console.log("Animation has canceled")
                    return;
                }

                time = time2;
                window.requestAnimationFrame(step);
            }

        }

// launch setup
        setup();
        bird1.onload = checkFPS;
        // setInterval(render, 1000 / 60)
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


        console.log('VK events')

        // bridge.send("VKWebAppShowLeaderBoardBox", {user_result: 100})
        // .then((data) => console.log(data))
        // .catch(error => console.log(error))


        // .catch(error => console.log(error))

        // чтобы ловить события в консоль:

        /*
                bridge.subscribe((e) => {
                    if (e.detail.type !== undefined) {
                        console.log('bridge event', e)
                    }
                });
        */


        // this.getData().then(r => console.log('getData:', r))


    }





    render() {
        return (
            <div>
                <header>
                    <div id="clouds">
                        <h1>Miss IATM</h1>
                    </div>
                    <div className="score-container">
                        <div id="bestScore">Best : {this.state.bestScore}</div>

                        <div id="currentScore">Current : {this.state.currentScore}</div>

                    </div>
                </header>

                {/*<canvas style={styles.canvas}></canvas>*/}
                <canvas></canvas>

            </div>

        );
    }


}

export default App;

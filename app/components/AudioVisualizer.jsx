import { useEffect, useRef, useState } from 'react';

const AudioVisualizer = () => {
	const canvasRef = useRef(null);
	const [transcript, setTranscript] = useState('');

	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');

		canvas.width = window.innerWidth;
		canvas.height = 10;

		const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
		gradient.addColorStop(0, 'red');
		gradient.addColorStop(0.25, 'orange');
		gradient.addColorStop(0.5, 'yellow');
		gradient.addColorStop(0.75, 'green');
		gradient.addColorStop(1, 'blue');

		let recognition = new window.webkitSpeechRecognition();
		recognition.continuous = true;
		recognition.interimResults = true;
		recognition.lang = 'en-US';

		recognition.onresult = (event) => {
			let interimTranscript = '';
			for (let i = event.resultIndex; i < event.results.length; i++) {
				const { transcript, isFinal } = event.results[i][0];
				if (isFinal) {
					setTranscript(transcript);
				} else {
					interimTranscript += transcript;
				}
			}
			setTranscript(interimTranscript);
		};

		recognition.start();

		navigator.mediaDevices.getUserMedia({ audio: true })
			.then(stream => {
				const audioCtx = new AudioContext();
				const source = audioCtx.createMediaStreamSource(stream);

				const analyser = audioCtx.createAnalyser();
				analyser.fftSize = 2048;

				source.connect(analyser);
				analyser.connect(audioCtx.destination);

				const dataArray = new Uint8Array(analyser.frequencyBinCount);

				const draw = () => {
					const width = canvas.width;
					const height = canvas.height;

					analyser.getByteFrequencyData(dataArray);

					ctx.clearRect(0, 0, width, height);

					ctx.beginPath();

					for (let i = 0; i < dataArray.length; i++) {
						const x = (i / dataArray.length) * width;
						const y = (1 - dataArray[i] / 255) * height;
						if (i === 0) {
							ctx.moveTo(x, y);
						} else {
							ctx.lineTo(x, y);
						}
					}

					ctx.strokeStyle = gradient;
					ctx.lineWidth = 2;
					ctx.stroke();

					requestAnimationFrame(draw);
				};

				draw();
			})
			.catch(error => {
				console.error(error);
			});

		return () => {
			recognition.stop();
		};
	}, []);

	return (
		<div>
			<canvas ref={canvasRef} />
			<p>{transcript}</p>
		</div>
	);
};

export default AudioVisualizer;

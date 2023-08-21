import { useEffect, useRef } from 'react';

const audioFileLink = "https://cdn.pixabay.com/audio/2023/05/07/audio_a614cb257b.mp3"

const MusicPlayer = () => {
	const audioRef = useRef(null);
	const canvasRef = useRef(null);

	useEffect(() => {
		// Get the audio element
		const audio = audioRef.current;

		// Create the audio context
		const context = new AudioContext();

		// Create the source node
		const source = context.createMediaElementSource(audio);

		// Create the analyser node
		const analyser = context.createAnalyser();

		// Connect the nodes
		source.connect(analyser);
		analyser.connect(context.destination);

		// Set the FFT size (must be a power of two)
		analyser.fftSize = 256;

		// Get the canvas element
		const canvas = canvasRef.current;

		// Get the canvas context
		const ctx = canvas.getContext('2d');

		// Create the frequency data array
		const freqData = new Uint8Array(analyser.frequencyBinCount);

		// Draw the frequency data on the canvas
		function draw() {
			// Get the frequency data
			analyser.getByteFrequencyData(freqData);

			// Clear the canvas
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			// Set the bar width and spacing
			const barWidth = canvas.width / freqData.length;
			const barSpacing = barWidth / 4;

			// Set the bar colors
			ctx.fillStyle = '#f00';
			ctx.strokeStyle = '#000';

			// Draw the bars
			for (let i = 0; i < freqData.length; i++) {
				const barHeight = (freqData[i] / 255) * canvas.height;
				const x = i * (barWidth + barSpacing);
				const y = canvas.height - barHeight;
				ctx.fillRect(x, y, barWidth, barHeight);
				ctx.strokeRect(x, y, barWidth, barHeight);
			}

			// Call the draw function again
			requestAnimationFrame(draw);
		}

		// Call the draw function
		draw();

		// Cleanup function
		return () => {
			// Disconnect the nodes
			source.disconnect();
			analyser.disconnect();
		};
	}, []);

	return (
		<div>
			<audio
				ref={audioRef}
				controls
				src={audioFileLink}
			/>
			<canvas
				ref={canvasRef}
				width={400}
				height={200}
				style={{ backgroundColor: '#ccc' }}
			/>
		</div>
	);
};

export default MusicPlayer;

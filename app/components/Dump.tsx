import React, { useState } from 'react';
import classNames from '@/utils/classNames';

interface DumpProps {
	title?: string;
	data: any;
	className?: string;
}

const Dump: React.FC<DumpProps> = ({ title, data, className }) => {
	const [isCopied, setIsCopied] = useState(false);

	const handleCopyClick = () => {
		const jsonString = JSON.stringify(data, null, 4);
		const tempTextArea = document.createElement('textarea');
		tempTextArea.value = jsonString;
		document.body.appendChild(tempTextArea);
		tempTextArea.select();
		document.execCommand('copy');
		document.body.removeChild(tempTextArea);
		setIsCopied(true);
		setTimeout(() => setIsCopied(false), 2000); // Reset copied status after 2 seconds
	};

	return (
		<div className={classNames('p-4 bg-red-50', `${className}`)}>
			<button
				className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
				onClick={handleCopyClick}
			>
				{isCopied ? 'Copied!' : 'Copy'}
			</button>

			{title && <h1>{title}</h1>}

			<pre>{JSON.stringify(data, null, 4)}</pre>

		</div>
	);
};

export default Dump;

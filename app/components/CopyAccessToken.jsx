import React, { useState } from 'react';

const CopyAccessToken = ({ session }) => {
	const [isCopied, setIsCopied] = useState(false);

	const handleCopyClick = () => {
		if (session.status !== 'authenticated') {
			alert('You are not authenticated');
			return;
		}

		const accessToken = session.data.token;
		navigator.clipboard.writeText(accessToken);
		setIsCopied(true);
		setTimeout(() => {
			setIsCopied(false);
		}, 1500);
	};

	return (
		<div>
			{process.env.NODE_ENV === 'development' && <button onClick={handleCopyClick}>{isCopied ? '!!!' : 'CAT'}</button>}
		</div>
	);
};

export default CopyAccessToken;

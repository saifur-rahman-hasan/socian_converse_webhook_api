import React from 'react';

const FixedCenteredLayout = ({ children }) => {
	return (
		<div className="fixed inset-0 flex items-center justify-center bg-gray-100">
			{children}
		</div>
	);
};

export default FixedCenteredLayout;

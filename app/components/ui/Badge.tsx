import React from 'react';

interface BadgeProps {
	color: string;
	text: string;
}

export default function Badge({ color, text }: BadgeProps) {
	const colors = {
		red: 'fill-red-500',
		yellow: 'fill-yellow-500',
		green: 'fill-green-500',
		blue: 'fill-blue-500',
		indigo: 'fill-indigo-500',
		purple: 'fill-purple-500',
		pink: 'fill-pink-500',
	};

	return (
		<span className={`inline-flex items-center gap-x-1.5 rounded-full px-2 py-1 text-xs font-medium text-gray-900 ring-1 ring-inset ring-gray-200`}>
			<svg className="h-1.5 w-1.5" viewBox="0 0 6 6" aria-hidden="true">
				<circle cx={3} cy={3} r={3} className={colors[color]} />
			</svg>

			{text}
		</span>
	);
}
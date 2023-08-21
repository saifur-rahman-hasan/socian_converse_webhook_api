import React, { useRef, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import classNames from "@/utils/classNames";

interface AutoGrowTextareaProps {
	value: string;
	onChange: (value: string) => void;
	minRows?: number;
	maxRows?: number;
	className?: string;
	[key: string]: any; // Allow additional props
}

const AutoGrowTextarea: React.FC<AutoGrowTextareaProps> = ({
	                                                           value,
	                                                           onChange,
	                                                           minRows = 1,
	                                                           maxRows = 5,
	                                                           className = '',
	                                                           ...rest
                                                           }) => {
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const adjustTextareaHeight = () => {
		if (textareaRef.current) {
			textareaRef.current.style.height = 'auto';
			const scrollHeight = textareaRef.current.scrollHeight;
			const computedStyle = getComputedStyle(textareaRef.current);
			const lineHeight = parseFloat(computedStyle.lineHeight);
			const minHeight = minRows * lineHeight;
			const maxHeight = maxRows * lineHeight;
			textareaRef.current.style.height = `${Math.min(maxHeight, Math.max(minHeight, scrollHeight))}px`;
		}
	};

	useEffect(() => {
		adjustTextareaHeight();
	}, [value, minRows, maxRows]);

	const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
		if (onChange) {
			onChange(event.target.value);
		}
	};

	const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
		console.log('Event:', event);
	};


	return (
		<textarea
			ref={textareaRef}
			defaultValue={value}
			value={value || ''}
			onKeyDown={handleKeyDown}
			onChange={handleChange}
			className={classNames(
				`block w-full pt-4 resize-none border-0 py-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6`,
				`auto-grow-textarea`,
				`${className}`
			)}
			{...rest}
		/>
	);
};

export default AutoGrowTextarea;

import Image from 'next/image';
import mergeClasses from '@/utils/classNames';

interface ImageWrapperProps {
	src: string;
	alt: string;
	size?: number | string | { width: string; height: string };
	className?: string | null;
}

const ImageWrapper: React.FC<ImageWrapperProps> = ({ src, alt, size = 50, className = null }) => {
	const wrapperClasses = mergeClasses('image-wrapper', className);

	let wrapperStyle: React.CSSProperties = {
		position: 'relative',
		width: '100%',
	};

	if (typeof size === 'number') {
		wrapperStyle = {
			...wrapperStyle,
			width: `${size}px`,
		};
	} else if (typeof size === 'string') {
		wrapperStyle = {
			...wrapperStyle,
			width: size,
		};
	} else if (typeof size === 'object' && size !== null) {
		if (size.width && size.height) {
			wrapperStyle.width = size.width;
			wrapperStyle.height = size.height;
		}
	}

	return (
		<div className={wrapperClasses} style={wrapperStyle}>
			<Image src={src} alt={alt} layout="fill" objectFit="cover" />
		</div>
	);
};

export default ImageWrapper;

import { useEffect, useState } from 'react';

export default function useDeviceType() {
	const [deviceType, setDeviceType] = useState('');

	useEffect(() => {
		const handleResize = () => {
			const { innerWidth } = window;

			if (innerWidth < 576) {
				setDeviceType('mobile');
			} else if (innerWidth >= 576 && innerWidth < 768) {
				setDeviceType('tablet');
			} else if (innerWidth >= 768 && innerWidth < 992) {
				setDeviceType('laptop');
			} else if (innerWidth >= 992 && innerWidth < 1200) {
				setDeviceType('desktop');
			} else if (innerWidth >= 1200 && innerWidth < 1440) {
				setDeviceType('desktop-lg');
			} else if (innerWidth >= 1440 && innerWidth < 1920) {
				setDeviceType('desktop-xl');
			} else {
				setDeviceType('tv');
			}
		};

		handleResize();

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	return deviceType;
}
const Loader = ({ size = 'md' }) => {
    const sizes = {
        xs: 'loading-xs',
        sm: 'loading-sm',
        md: 'loading-md',
        lg: 'loading-lg',
    };

    return <span className={`loading loading-infinity ${sizes[size]}`}></span>;
};

export default Loader;
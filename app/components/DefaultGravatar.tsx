import classNames from '@/utils/classNames';

export default function DefaultGravatar({ className }){
    return (
        <img
            className={classNames(
                'h-10 w-10 rounded-full',
                className
            )}
            src={`http://www.gravatar.com/avatar/2f8d197f57aecd0b67f9d0c4c5b8b2b2.jpg?s=100`}
            alt="gravatar"
        />
    )
}
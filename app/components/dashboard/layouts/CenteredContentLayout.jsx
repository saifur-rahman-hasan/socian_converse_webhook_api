export default function CenteredContentLayout({ children }){
	return (
		<div
			className={`h-screen w-screen fixed flex justify-items-center items-center text-center mx-auto`}
		>
			<div className={`min-w-56 mx-auto`}>{children}</div>
		</div>
	)
}
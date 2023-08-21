import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
	const meta = {
		title: 'Socian Converse',
		description: 'Clone and deploy your own Next.js portfolio in minutes.',
		image: 'https://assets.vercel.com/image/upload/q_auto/front/vercel/dps.png',
	}

	return (
		<Html lang="en" className="h-full bg-gray-100">
			<Head>
				<meta name="robots" content="follow, index" />
				<meta name="description" content={meta.description} />
				<meta property="og:site_name" content={meta.title} />
				<meta property="og:description" content={meta.description} />
				<meta property="og:title" content={meta.title} />
				<meta property="og:image" content={meta.image} />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:site" content="@yourname" />
				<meta name="twitter:title" content={meta.title} />
				<meta name="twitter:description" content={meta.description} />
				<meta name="twitter:image" content={meta.image} />
			</Head>
			<body className="h-full overflow-y-auto">
				<Main />
				<NextScript />
			</body>
		</Html>
	)
}
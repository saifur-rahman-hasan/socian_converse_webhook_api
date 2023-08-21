import dynamic from 'next/dynamic'
import React from 'react'

const NonSSRWrapper = props => (
	<React.Fragment>{props.children}</React.Fragment>
)

const NoSSRWrapper = dynamic(() => Promise.resolve(NonSSRWrapper), {
	ssr: false
});

export default NoSSRWrapper;


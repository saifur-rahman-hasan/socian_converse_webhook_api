/** @type {import('next').NextConfig} */
const path = require('path');

module.exports = {
    output: 'standalone',
    images: {
        domains: [
            "socianaistorageaccount.blob.core.windows.net",
            "images.unsplash.com",
            "tailwindui.com",
            "www.gravatar.com"
        ]
    },
    webpack(config) {
        config.resolve.alias['@components'] = path.join(__dirname, 'components');
        config.resolve.alias['@workspace'] = path.join(__dirname, 'store/features/workspace');

        return config;
    }
}

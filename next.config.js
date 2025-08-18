// /** @type {import('next').NextConfig} */
// const nextConfig = {
//     output: 'export',     // これが静的エクスポートのキー
//     // disDir: 'out',
//     trailingSlash: true,  // URL末尾にスラッシュを付ける設定（必要に応じて）
// };

// module.exports = nextConfig;


/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    output: 'export',
    env: {
        API_URL: process.env.API_URL,
        SURVEY_API_URL: process.env.SURVEY_API_URL,
        API_KEY: process.env.API_KEY, // 開発時のみ利用
    },
};

module.exports = nextConfig;

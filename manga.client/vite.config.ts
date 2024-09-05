import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import plugin from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import child_process from 'child_process';
import { env } from 'process';
import { VitePWA } from 'vite-plugin-pwa'

const baseFolder =
    env.APPDATA !== undefined && env.APPDATA !== ''
        ? `${env.APPDATA}/ASP.NET/https`
        : `${env.HOME}/.aspnet/https`;

const certificateName = "manga.client";
const certFilePath = path.join(baseFolder, `${certificateName}.pem`);
const keyFilePath = path.join(baseFolder, `${certificateName}.key`);

if (!fs.existsSync(certFilePath) || !fs.existsSync(keyFilePath)) {
    if (0 !== child_process.spawnSync('dotnet', [
        'dev-certs',
        'https',
        '--export-path',
        certFilePath,
        '--format',
        'Pem',
        '--no-password',
    ], { stdio: 'inherit', }).status) {
        throw new Error("Could not create certificate.");
    }
}

const target = env.ASPNETCORE_HTTPS_PORT ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}` :
    env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(';')[0] : 'https://localhost:7103';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        plugin(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
            manifest: {
                "short_name": "トカエル",
                "name": "Tocaeru-トカエル",
                "icons": [
                {
                    "src": "/TocaeruCircle.png",
                    "sizes": "398x398",
                    "type": "image/png"
                },
                {
                    "src": "/Tocaeru512Circle.png",
                    "sizes": "512x512",
                    "type": "image/png"
                },
                ],
                "start_url": "/",
                "display": "standalone",
                "theme_color": "#E97032",
                "background_color": "#ffffff",
                "description": "Tocaeru(トカエル)は日本初の漫画の物々交換を簡単に楽しめるサービスです。/n/nアプリをインストールしてより便利に！",
                "screenshots": [
                {
                    "src": "https://manga-img-bucket.s3.ap-northeast-1.amazonaws.com/TocaeruLogo.webp",
                    "sizes": "959x252",
                    "type": "image/webp"
                }
                ]
            }
          })
        ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    server: {
        proxy: {
            '^/weatherforecast': {
                target,
                secure: false
            }
        },
        port: 5173,
        https: {
            key: fs.readFileSync(keyFilePath),
            cert: fs.readFileSync(certFilePath),
        }
    }
})

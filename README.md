# EZFind2

- Latest Release: Version 2.4 (Alpha)
- Build docker image: docker compose --env-file .env build
- Create docker container: docker compose --env-file .env up -d

# Common Commands

- npm run dev (run the project)
- assets
  - npx pwa-asset-generator public/icon/icon-base.png public/icon --favicon --icon-only --padding "0px" --path-override /icon --manifest public/manifest.json && npx pwa-asset-generator public/icon/icon-base.png public/icon--icon-only --padding "10px" --path-override /icon --manifest public/manifest.json && npx pwa-asset-generator public/splashscreens/splash-base.png public/splashscreens --splash-only --path-override /icon --manifest public/manifest.json # generate favicon, icons, and splashscreens

# Libraries

- next-pwa
- next-auth
- next-qrcode
- react-icons
- react-textarea-autosize
- chakra-ui
- chakra-react-select
- prisma
- prisma-adapter
- prisma-client
- browser-image-compression
- dymojs

# EZFind2

- Latest Release: Version 2.4 (Alpha)
- Build docker image: docker compose --env-file .env build
- Create docker container: docker compose --env-file .env up -d

# Common Commands

- npm run dev (run the project)
- assets
  - npx pwa-asset-generator public/icon/icon-base.png --favicon --icon-only --padding "0px" --path-override /icon --manifest public/manifest.json # generate favicon
  - npx pwa-asset-generator public/icon/icon-base.png --icon-only --padding "10px" --path-override /icon --manifest public/manifest.json # generate app icons

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

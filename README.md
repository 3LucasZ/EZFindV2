# EZFind2

- Latest Release: Version 2.4 (Alpha)
- Build docker image: docker compose --env-file .env build
- Create docker container: docker compose --env-file .env up -d

# Common Commands

- npm run dev (run the project)
- assets
  - Note: although jpg compresses images better than png, it does not support transparency at all. Therefore, we use --type png on all commands.
  - npx pwa-asset-generator public/icon/icon-base.png public/icon --favicon --icon-only --padding "0px" --path-override /icon --manifest public/manifest.json --opaque false --type png --xhtml && npx pwa-asset-generator public/icon/icon-base.png public/icon --icon-only --padding "10px" --path-override /icon --manifest public/manifest.json --opaque true --type png --xhtml && npx pwa-asset-generator public/splashscreens/splash-base.png public/splashscreens --splash-only --path-override /splashscreens --manifest public/manifest.json --opaque false --type png --xhtml # generate icons and splashscreens

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

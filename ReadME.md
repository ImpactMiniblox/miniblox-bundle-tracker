# Miniblox Bundle Tracker

This is a simple bundle tracker for a low-effort Minecraft port to the browser named [Miniblox](miniblox.io).
It is updated every 5 minutes and commits the latest bundle to the repository.

## Why?

For updating my [Vape For Miniblox](https://codeberg.org/RealPacket/VapeForMiniblox/)
fork and my [Miniblox dumpers](https://codeberg.org/RealPacket/miniblox-dumpers),
haven't actually used it for that yet.

## Usage

Most people won't need to run this since looking at the `git diff`s
or the bundle source in the repository is pretty much the entire point of this project,
and that can be done in the GitHub or Codeberg UI.
If you want to anyways, you just run `deno task run` and it will fetch the miniblox page,
use a regex to find the bundle script tag,
download the latest bundle, format it, and commit it to the repository.

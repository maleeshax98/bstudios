## Showing videos from the cloudinary folder instead of youtube links in `  <BtsGallery initialImages={btsImages} initialVideos={btsVideos} />`

## Context

- Instead of fetching video links in sanity for BtsGallery and BTS page get videos from cloudinary and show them.

## Design

- In BtsGallery component and BTS show them mixed like videos and images.
- Remove the tabs for photos and videos.
- Autoplay videos (muted, looping, playsInline).
- Care about the responsive ness on videos because they can be different dimentions.
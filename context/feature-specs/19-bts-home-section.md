## Adding a BTS section in home page

We need a new section in the home page to display the BTS (Behind The Scenes) content.

I want to use the same design like, `<SampleGallery initialImages={sampleImages} />` but there will be youtube videos also.

## Context

- Same design like `<SampleGallery initialImages={sampleImages} />` but there will be tabs to select photos and videos.
- there will be 12 photos and 6 videos newest one.
- There will be button called see more at the end.
- need to place the section before the contact section in home page
- If nothing to show do not show anything.
- If no videos but images are there only show images
- If no images but videos are there only show videos
- If nothing to show do not show anything.

## Plan

- Need to create a BTS type in sanity types
- for the images cloudinary folder will be `BTS`.
- There will be fields for youtube video link and title
- need quries to fetch the data youtube video links and show them.
- and get the images from the cloudinary folder and show them also.

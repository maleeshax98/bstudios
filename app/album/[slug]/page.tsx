import type { Metadata } from "next";
import { notFound } from "next/navigation";
import * as React from "react";
import { Suspense } from "react";
import { AlbumGallery, MediaItem } from "@/components/album/album-gallery";
import { sanityFetch } from "@/sanity/live";
import { ALBUM_BY_SLUG_QUERY } from "@/sanity/queries";
import { getImages, getVideos, CloudinaryResource } from "@/lib/cd";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getAlbumData(slug: string) {
  try {
    const { data: album } = await sanityFetch({
      query: ALBUM_BY_SLUG_QUERY,
      params: { slug },
      stega: false,
    });
    return album;
  } catch (error) {
    console.warn(`Could not fetch album data for ${slug}:`, error);
    return null;
  }
}

/**
 * Server-Side cached media fetch for specific Cloudinary folder.
 * getImages/getVideos internally use searchCloudinaryWithCache with
 * native fetch caching (revalidate: 3600) so media data is cached locally
 * for 1 hour without hitting the Cloudinary Search API on every page load.
 */
async function getCachedAlbumMedia(folderName: string) {
  const [imagesRes, videosRes] = await Promise.all([
    getImages(folderName, undefined, 12).catch(() => ({
      resources: [],
      nextCursor: null,
      totalCount: 0,
    })),
    getVideos(folderName, undefined, 12).catch(() => ({
      resources: [],
      nextCursor: null,
      totalCount: 0,
    })),
  ]);
  return { imagesRes, videosRes };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  let album = null;
  try {
    const { data } = await sanityFetch({
      query: ALBUM_BY_SLUG_QUERY,
      params: { slug },
      stega: false,
    });
    album = data;
  } catch (error) {
    console.warn(`Could not fetch metadata for album ${slug}:`, error);
  }

  if (!album) {
    return {
      title: "Album Not Found — B studio",
      description: "The requested archive album could not be found.",
    };
  }

  const title = `${album.title || "Archive"} — B studio | High-End Cinematic Gallery`;
  const description =
    album.description ||
    `Explore ${album.title || "the archive"} by B studio — high-end editorial and cinematic storytelling.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: album.thumbnail ? [{ url: album.thumbnail }] : [],
    },
  };
}

async function AlbumContent({ slug }: { slug: string }) {
  const album = await getAlbumData(slug);

  if (!album) {
    notFound();
  }

  // Fetch initial batch of photos and videos from Cloudinary via native cached fetch
  let rawImages: CloudinaryResource[] = [];
  let rawVideos: CloudinaryResource[] = [];
  let photosCursor: string | null = null;
  let videosCursor: string | null = null;

  const folderName = album.cloudinaryFolder?.trim();
  if (folderName) {
    const { imagesRes, videosRes } = await getCachedAlbumMedia(folderName);
    rawImages = imagesRes.resources;
    photosCursor = imagesRes.nextCursor;
    rawVideos = videosRes.resources;
    videosCursor = videosRes.nextCursor;
  }

  // Map to MediaItem
  const photos: MediaItem[] = rawImages.map((img) => ({
    id: img.asset_id || img.public_id,
    type: "image",
    url: img.secure_url || img.url,
    width: img.width,
    height: img.height,
    alt: `${album.title || "Album"} Still`,
    format: img.format,
  }));

  const videos: MediaItem[] = rawVideos.map((vid) => ({
    id: vid.asset_id || vid.public_id,
    type: "video",
    url: vid.secure_url || vid.url,
    width: vid.width,
    height: vid.height,
    duration: vid.duration,
    alt: `${album.title || "Album"} Film`,
    format: vid.format,
  }));

  // Fallback: If no photos or videos were loaded from Cloudinary folder but Sanity has thumbnail
  if (photos.length === 0 && videos.length === 0 && album.thumbnail) {
    photos.push({
      id: "thumbnail-preview",
      type: "image",
      url: album.thumbnail,
      alt: album.title || "Archive Project",
    });
  }

  let formattedDate: string | null = album.date ? String(album.date) : null;
  if (!formattedDate && album.publishedAt) {
    try {
      formattedDate = new Date(album.publishedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      });
    } catch {
      formattedDate = null;
    }
  }

  const albumData = {
    id: album._id,
    title: album.title || "Untitled Archive",
    description: album.description,
    date: formattedDate,
    category: album.category?.title,
    cloudinaryFolder: album.cloudinaryFolder,
    mediaType: album.Media,
    thumbnail: album.thumbnail,
  };

  return (
    <AlbumGallery
      album={albumData}
      initialPhotos={photos}
      initialVideos={videos}
      initialPhotosCursor={photosCursor}
      initialVideosCursor={videosCursor}
    />
  );
}

/**
 * Minimalist Pure White Fallback displaying centered "loading..." text
 * until the welcome title sequence intro mounts.
 */
function AlbumFallback() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-black select-none">
      <p className="font-serif italic text-sm text-text-muted lowercase tracking-widest animate-pulse">
        loading...
      </p>
    </div>
  );
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  return (
    <Suspense fallback={<AlbumFallback />}>
      <AlbumContent slug={slug} />
    </Suspense>
  );
}

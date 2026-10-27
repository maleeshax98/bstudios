import { defineQuery } from "next-sanity";

export const ALBUMS_QUERY = defineQuery(`
  *[_type == "album"] | order(publishedAt desc, _createdAt desc) {
    _id,
    title,
    description,
    date,
    category->{
      _id,
      title
    },
    alt,
    thumbnail,
    cloudinaryFolder,
    Media,
    count,
    duration,
    slug,
    publishedAt
  }
`);

export const FEATURED_ALBUMS_QUERY = defineQuery(`
  *[_type == "album" && isFeatured == true] | order(publishedAt desc, _createdAt desc) {
    _id,
    title,
    description,
    date,
    category->{
      _id,
      title
    },
    alt,
    thumbnail,
    cloudinaryFolder,
    Media,
    count,
    duration,
    slug,
    isFeatured,
    publishedAt
  }
`);

export const FEATURED_WORKS_QUERY = FEATURED_ALBUMS_QUERY;

export const PAGINATED_ALBUMS_QUERY = defineQuery(`
  *[_type == "album"] | order(publishedAt desc, _createdAt desc) [$start...$end] {
    _id,
    title,
    description,
    date,
    category->{
      _id,
      title
    },
    alt,
    thumbnail,
    cloudinaryFolder,
    Media,
    count,
    duration,
    slug,
    publishedAt
  }
`);


export const CATEGORIES_QUERY = defineQuery(`
  *[_type == "category"] | order(title asc) {
    _id,
    title
  }
`);

export const ALBUM_BY_SLUG_QUERY = defineQuery(`
  *[_type == "album" && slug.current == $slug][0] {
    _id,
    title,
    description,
    date,
    category->{
      _id,
      title
    },
    alt,
    thumbnail,
    cloudinaryFolder,
    Media,
    count,
    duration,
    slug,
    publishedAt
  }
`);

export const ALBUM_SLUGS_QUERY = defineQuery(`
  *[_type == "album" && defined(slug.current)] {
    "slug": slug.current
  }
`);

export const PACKAGES_QUERY = defineQuery(`
  *[_type == "package"] | order(order asc, _createdAt asc) {
    _id,
    title,
    serviceCategory,
    description,
    deliverables,
    price,
    badge,
    order
  }
`);

export const PACKAGES_BY_CATEGORY_QUERY = defineQuery(`
  *[_type == "package" && lower(serviceCategory) == lower($category)] | order(order asc, _createdAt asc) {
    _id,
    title,
    serviceCategory,
    description,
    deliverables,
    price,
    badge,
    order
  }
`);

export const SERVICES_QUERY = defineQuery(`
  *[_type == "services"] | order(publishedAt asc, _createdAt asc) {
    _id,
    title,
    subTitle,
    description,
    image,
    slug,
    publishedAt
  }
`);

export const COLORGRADING_QUERY = defineQuery(`
  *[_type == "colorgrading"] | order(publishedAt asc, _createdAt asc) {
    _id,
    title,
    subTitle,
    description,
    image,
    slug,
    publishedAt
  }
`);


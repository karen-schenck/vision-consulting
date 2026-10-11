const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? '').replace(/\/$/, '');

/** Prefix a public asset with the path where GitHub Pages mounts the site. */
export function assetPath(src: string) {
  if (!basePath || !src.startsWith('/') || src.startsWith('//')) return src;
  if (src === basePath || src.startsWith(`${basePath}/`)) return src;
  return `${basePath}${src}`;
}

# Background Images

For the application to display correctly, you need to add a background image:

1. Add a file named `bg-pattern.jpg` to this directory
2. The image should be a high-quality background that works well with glass morphism effects
3. Recommended resolution: at least 1920×1080px
4. Dark or gradient images work best since text will be displayed on top

Alternatively, you can change the image paths in the code to point to an external image URL or use a different image name.

## Image References in Code

The background image is referenced in:
- Landing page (`frontend/src/app/page.tsx`)
- Login page (`frontend/src/app/auth/signin/page.tsx`)

Both files use this path: `url('/images/bg-pattern.jpg')` 
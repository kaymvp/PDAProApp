// declarations.d.ts or images.d.ts
// ---------------------------------------------------------------------------
// This declaration tells TypeScript how to interpret `.png` image imports.
// In React Native, images are bundled as numerical IDs (after being processed
// by Metro bundler), so we declare the module accordingly.
// ---------------------------------------------------------------------------

declare module '*.png' {
  const content: number; // Images are resolved to numeric IDs in React Native
  export default content;
}

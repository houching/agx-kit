import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://agx-kit.pages.dev',
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    starlight({
      title: 'AGX Kit',
      description: 'Antigravity-first AI agent engineering kit with rules, skills, workflows, and Vantage console aesthetics.',
      defaultLocale: 'root',
      locales: {
        root: {
          label: 'English',
          lang: 'en',
        },
        km: {
          label: 'ភាសាខ្មែរ',
          lang: 'km',
        },
      },
      favicon: '/images/logo.svg',
      logo: {
        src: './src/assets/logo.png',
      },
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/houching/agx-kit' },
      ],
      customCss: ['./src/styles/vantage.css'],
      sidebar: [
        {
          label: 'Getting Started',
          translations: { km: 'ការចាប់ផ្តើម (Getting Started)' },
          items: [
            { label: 'Introduction', slug: 'introduction' },
            { label: 'Installation', slug: 'installation' },
          ],
        },
        {
          label: 'Core Concepts',
          translations: { km: 'គំនិតស្នូល (Core Concepts)' },
          items: [
            { label: 'Agents', slug: 'agents' },
            { label: 'Skills', slug: 'skills' },
            { label: 'Workflows', slug: 'workflows' },
            { label: 'Managed Updates & Rollback', slug: 'updates' },
            { label: 'Antigravity Runtime', slug: 'antigravity' },
          ],
        },
        {
          label: 'Guide',
          translations: { km: 'សៀវភៅណែនាំ (Guide)' },
          items: [
            { label: 'Structured Brainstorming', slug: 'guide/brainstorm' },
            { label: 'Project Planning', slug: 'guide/plan' },
            { label: 'Create New Application', slug: 'guide/create' },
            { label: 'Add a New Feature', slug: 'guide/new-feature' },
            { label: 'Systematic Debugging', slug: 'guide/debugging' },
            { label: 'Test Generation', slug: 'guide/test' },
            { label: 'Preview Management', slug: 'guide/preview' },
            { label: 'Project Status', slug: 'guide/status' },
            { label: 'Multi-Agent Orchestration', slug: 'guide/orchestration' },
            { label: 'Production Deployment', slug: 'guide/deployment' },
          ],
        },
        {
          label: 'Reference',
          translations: { km: 'ឯកសារយោង (Reference)' },
          items: [
            { label: 'Commands & Options', slug: 'cli' },
            { label: 'Changelog', slug: 'changelog' },
          ],
        },
      ],
    }),
  ],
});

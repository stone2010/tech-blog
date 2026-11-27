/** 站点基础信息：改这里就能换成你自己的品牌 */
export const siteConfig = {
  name: 'Stone',
  journal: 'Field Notes',
  description: '关于 AI、编程、硬件与开源实践的技术记录。写给未来的自己，也写给偶然路过的你。',
  intro: '一名持续学习的软件开发者。这里收录我的技术文章、实验记录与项目笔记，用来沉淀思考，也用来对抗遗忘。',
  author: 'Stone',
  role: 'Software Engineer / Technical Writer',
  github: 'https://github.com/stone2010',
  email: 'hello@example.com',
  location: 'China',
  now: [
    { label: 'Building', value: 'AI-native developer tools' },
    { label: 'Reading', value: 'Designing Data-Intensive Applications' },
    { label: 'Learning', value: 'Systems programming & compilers' },
  ],
} as const

import { ArrowRight } from 'lucide-react'
import { categories, categoryCount } from '../data/categories'

export default function Categories() {
  return (
    <section className="container page-section">
      <header className="page-header">
        <span className="eyebrow mono">INDEX / CATEGORIES</span>
        <h1>分类</h1>
        <p>用主题而不是时间组织内容，方便按兴趣进入。</p>
      </header>

      <div className="category-list">
        {categories.map((category, index) => (
          <a key={category.key} className="category-row" href={`#/category/${encodeURIComponent(category.key)}`}>
            <span className="mono category-index">{String(index + 1).padStart(2, '0')}</span>
            <div>
              <h2>{category.key}</h2>
              <p>{category.description}</p>
            </div>
            <span className="mono category-count">{String(categoryCount(category.key)).padStart(2, '0')} entries</span>
            <ArrowRight size={17} />
          </a>
        ))}
      </div>
    </section>
  )
}

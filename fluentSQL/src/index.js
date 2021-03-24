import database from '../database/database.json'
import FluentSQLBuilder from './fluentSQL.js'

const result = FluentSQLBuilder
  .for(database)
  .where({ registered: /^(2020|2019)/ })
  .where({ category: /^(securiy|developer|quality assurance)$/ })
  .where({ phone: /\((852|850|810)\)/})
  .select(['name', 'company', 'phone', 'category', 'registered'])
  .orderBy('category')
  .build()

console.table(result)

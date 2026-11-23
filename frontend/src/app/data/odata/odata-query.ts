export class ODataQuery {
  private readonly filters: string[] = [];
  private params: Record<string, string> = {};

  static create(): ODataQuery {
    return new ODataQuery();
  }

  static escape(value: string): string {
    return value.replace(/'/g, "''");
  }

  select(...fields: string[]): this {
    this.params['$select'] = fields.join(',');
    return this;
  }

  expand(...navigations: string[]): this {
    this.params['$expand'] = navigations.join(',');
    return this;
  }

  filter(expression: string | null | undefined): this {
    if (expression) this.filters.push(expression);
    return this;
  }

  contains(field: string, value: string | null | undefined): this {
    const term = value?.trim();
    if (!term) return this;
    return this.filter(`contains(tolower(${field}),'${ODataQuery.escape(term.toLowerCase())}')`);
  }

  equals(field: string, value: string | number | null | undefined): this {
    if (value == null || value === '') return this;
    const literal = typeof value === 'number' ? String(value) : `'${ODataQuery.escape(value)}'`;
    return this.filter(`${field} eq ${literal}`);
  }

  orderBy(field: string, direction: 'asc' | 'desc' = 'asc'): this {
    this.params['$orderby'] = `${field} ${direction}`;
    return this;
  }

  page(page: number, pageSize: number): this {
    this.params['$top'] = String(pageSize);
    this.params['$skip'] = String(Math.max(0, page - 1) * pageSize);
    return this;
  }

  top(value: number): this {
    this.params['$top'] = String(value);
    return this;
  }

  count(): this {
    this.params['$count'] = 'true';
    return this;
  }

  build(): Record<string, string> {
    const result = { ...this.params };
    if (this.filters.length) {
      result['$filter'] = this.filters.map((f) => (this.filters.length > 1 ? `(${f})` : f)).join(' and ');
    }
    return result;
  }
}

export interface ODataCollection<T> {
  value: T[];
  '@odata.count'?: number;
}

import { ODataQuery } from './odata-query';

describe('ODataQuery', () => {
  it('builds select, order, paging and count parameters', () => {
    const params = ODataQuery.create()
      .select('Id', 'PatientName')
      .orderBy('IssuedAt', 'desc')
      .page(3, 10)
      .count()
      .build();

    expect(params).toEqual({
      $select: 'Id,PatientName',
      $orderby: 'IssuedAt desc',
      $top: '10',
      $skip: '20',
      $count: 'true',
    });
  });

  it('combines filters with "and" and escapes quotes', () => {
    const params = ODataQuery.create().contains('PatientName', "D'Ávila").equals('Type', 'Structured').build();

    expect(params['$filter']).toBe("(contains(tolower(PatientName),'d''ávila')) and (Type eq 'Structured')");
  });

  it('ignores empty filter values', () => {
    const params = ODataQuery.create().contains('PatientName', '  ').equals('Type', null).build();

    expect(params['$filter']).toBeUndefined();
  });
});

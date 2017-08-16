CREATE OR REPLACE PACKAGE fema_data AS
  FEMA_TABLE_NAME VARCHAR2(80) := 'FEMA_APPLICANT_DATA';
  TYPE recordArray IS TABLE OF FEMA_APPLICANT_DATA%ROWTYPE INDEX BY PLS_INTEGER;
  TYPE summaryRec
    IS RECORD ( summaryColumn VARCHAR2(100), summaryAmount NUMBER(15,2));
  TYPE summaryArray IS TABLE OF summaryRec INDEX BY PLS_INTEGER;
  TYPE localeArray IS TABLE OF VARCHAR2(32767) INDEX BY PLS_INTEGER;
  TYPE disasterArray IS TABLE OF VARCHAR2(32767) INDEX BY PLS_INTEGER;

PROCEDURE get_locales
(
  stateid IN VARCHAR2,
  localetype IN VARCHAR2,
  disasterid IN VARCHAR2,
  results OUT localeArray
);

PROCEDURE get_disasters
(
  stateid IN VARCHAR2,
  localetype IN VARCHAR2 DEFAULT NULL,
  localevalues IN VARCHAR2 DEFAULT NULL,
  results OUT disasterArray
);

PROCEDURE get_records (
  disasterid      IN VARCHAR2,
  stateid      IN VARCHAR2 DEFAULT NULL,
  localetype   IN VARCHAR2 DEFAULT NULL,
  localevalues   IN VARCHAR2 DEFAULT NULL,
  selectcols   IN VARCHAR2 DEFAULT NULL,
  summarycols   IN VARCHAR2 DEFAULT NULL,
  results      OUT recordArray,
  summaryresults OUT summaryArray
);
END fema_data;
/


CREATE OR REPLACE PACKAGE BODY fema_data AS

PROCEDURE get_locales (
  stateid IN VARCHAR2,
  localetype IN VARCHAR2,
  disasterid IN VARCHAR2,
  results OUT localeArray
) AS
  sql_stmt   VARCHAR2(32767);
  disasterClause VARCHAR2(32767);
BEGIN

  IF disasterid != 'ALL'
  THEN
      disasterClause := 'AND fad.DSTER_ID IN (' || disasterid || ')';
  END IF;

  sql_stmt := 'SELECT UNIQUE ' || localetype || ' AS ' || localetype || '
     FROM '|| FEMA_TABLE_NAME || ' fad
    WHERE  fad.DMGE_STATE_CD = :STATEID
      ' || disasterClause || '
    ORDER
       BY 1';
    EXECUTE IMMEDIATE sql_stmt BULK COLLECT
       INTO results
      USING stateid;
  EXCEPTION
    WHEN no_data_found THEN
      dbms_output.put_line('No data returned');
END get_locales;

PROCEDURE get_disasters (
  stateid IN VARCHAR2,
  localetype IN VARCHAR2 DEFAULT NULL,
  localevalues IN VARCHAR2 DEFAULT NULL,
  results OUT disasterArray
) AS
  sql_stmt   VARCHAR2(32767);
  localeClause VARCHAR2(32767);
  localevaluesList DBMS_UTILITY.uncl_array;
BEGIN

  IF localetype IS NOT NULL
  THEN
    localeClause := 'AND fad.' || localetype || ' IN (' ;

    FOR CURRENT_ROW IN (
      with test as
        (select localevalues from dual)
        select regexp_substr(localevalues, '[^,]+', 1, rownum) SPLIT
        from test
        connect by level <= length (regexp_replace(localevalues, '[^,]+'))  + 1)
    LOOP
      localevaluesList(localevaluesList.COUNT) := CURRENT_ROW.SPLIT;
    END LOOP;

    FOR i IN localevaluesList.FIRST .. localevaluesList.LAST LOOP
      localeClause := localeClause || '''' || localevaluesList(i) || '''';
      IF i < localevaluesList.LAST
      THEN
        localeClause := localeClause || ',';
      END IF;
    END LOOP;
    localeClause := localeClause || ')';
  END IF;

  sql_stmt := 'SELECT UNIQUE DSTER_ID AS DSTER_ID
     FROM '|| FEMA_TABLE_NAME || ' fad
    WHERE  fad.DMGE_STATE_CD = :STATEID
      ' || localeClause || '
    ORDER
       BY 1';

    EXECUTE IMMEDIATE sql_stmt BULK COLLECT
       INTO results
      USING stateid;
  EXCEPTION
    WHEN no_data_found THEN
        dbms_output.put_line('No data returned');
END get_disasters;

PROCEDURE get_records (
  disasterid      IN VARCHAR2,
  stateid      IN VARCHAR2 DEFAULT NULL,
  localetype   IN VARCHAR2 DEFAULT NULL,
  localevalues   IN VARCHAR2 DEFAULT NULL,
  selectcols   IN VARCHAR2 DEFAULT NULL,
  summarycols   IN VARCHAR2 DEFAULT NULL,
  results      OUT recordArray,
  summaryresults OUT summaryArray
) AS
  sql_stmt   VARCHAR2(32767);
  summary_sql_stmt   VARCHAR2(32767);
  localeClause VARCHAR2(32767);
  disasterClause VARCHAR2(32767);
  stateClause VARCHAR2(32767);
  selectClause VARCHAR2(32767);
  whereClause VARCHAR2(32767);
  localevaluesList DBMS_UTILITY.uncl_array;
  selectColsList DBMS_UTILITY.uncl_array;
  selectColsListLen BINARY_INTEGER;
  summaryColsList DBMS_UTILITY.uncl_array;
  summaryColsListLen BINARY_INTEGER;
BEGIN

  IF stateid IS NOT NULL
  THEN
    stateClause := 'fad.DMGE_STATE_CD =''' || stateid || '''';
  END IF;

  IF disasterid != 'ALL'
  THEN
    disasterClause := 'fad.DSTER_ID IN (' || disasterid || ')';
  END IF;

  IF localetype IS NOT NULL
  THEN
    localeClause := 'fad.' || localetype || ' IN (' ;

    FOR CURRENT_ROW IN (
      with test as
        (select localevalues from dual)
        select regexp_substr(localevalues, '[^,]+', 1, rownum) SPLIT
        from test
        connect by level <= length (regexp_replace(localevalues, '[^,]+'))  + 1)
    LOOP
      localevaluesList(localevaluesList.COUNT) := CURRENT_ROW.SPLIT;
    END LOOP;

    FOR i IN localevaluesList.FIRST .. localevaluesList.LAST LOOP
      localeClause := localeClause || '''' || localevaluesList(i) || '''';
      IF i < localevaluesList.LAST
      THEN
        localeClause := localeClause || ',';
      END IF;
    END LOOP;
    localeClause := localeClause || ')';
  END IF;

  IF stateClause IS NOT NULL OR disasterClause IS NOT NULL OR localeClause IS NOT NULL
  THEN
    IF stateClause IS NOT NULL
    THEN
      whereClause := 'WHERE ' || stateClause || ' ';
    END IF;

    IF disasterClause IS NOT NULL
    THEN
      IF whereClause IS NULL
      THEN
        whereClause := 'WHERE ' || disasterClause || ' ';
      ELSE
        whereClause := whereClause || ' AND ' || disasterClause || ' ';
      END IF;
    END IF;

    IF localeClause IS NOT NULL
    THEN
      IF whereClause IS NULL
      THEN
        whereClause := 'WHERE ' || localeClause || ' ';
      ELSE
        whereClause := whereClause || ' AND ' || localeClause || ' ';
      END IF;
    END IF;
  END IF;

  IF summarycols IS NOT NULL
  THEN
    DBMS_UTILITY.comma_to_table ( list => summarycols, tablen => summaryColsListLen, tab => summaryColsList);
    summary_sql_stmt := '';
    FOR i IN 1 .. summaryColsListLen LOOP
      summary_sql_stmt := summary_sql_stmt || 'SELECT ''' || summaryColsList(i) || ''',' ||
                                      'SUM(' || summaryColsList(i) || ') AS ' || summaryColsList(i) ||
                                      ' FROM '|| FEMA_TABLE_NAME || ' fad ' || whereClause ;
      IF i < summaryColsListLen
      THEN
        summary_sql_stmt := summary_sql_stmt || CHR(10) || 'UNION ALL' || CHR(10);
      END IF;
    END LOOP;
    summary_sql_stmt := summary_sql_stmt || CHR(10) || 'UNION ALL' || CHR(10) ||
                        'SELECT ''NumberOfRecords'', count(*) FROM '|| FEMA_TABLE_NAME || ' fad '|| whereClause ;
  ELSIF selectcols IS NOT NULL
  THEN
    DBMS_UTILITY.comma_to_table ( list => selectcols, tablen => selectColsListLen, tab => selectColsList);
    FOR i IN 1 .. selectColsListLen LOOP
      selectClause := selectClause || selectColsList(i);
      IF i < selectColsListLen
      THEN
        selectClause := selectClause || ',';
      END IF;
    END LOOP;
  ELSE
    selectClause := ' * ';
  END IF;

  IF summarycols IS NULL
  THEN
    sql_stmt := 'SELECT ' || selectClause || '
            FROM '|| FEMA_TABLE_NAME || ' fad '
             || whereClause ;
    EXECUTE IMMEDIATE sql_stmt BULK COLLECT INTO results;
  ELSE
    EXECUTE IMMEDIATE summary_sql_stmt BULK COLLECT INTO summaryresults;
  END IF;

  EXCEPTION
    WHEN no_data_found THEN
        dbms_output.put_line('No data returned');
  END get_records;

END fema_data;
/

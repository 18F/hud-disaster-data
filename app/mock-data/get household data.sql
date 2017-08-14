PROCEDURE get_disasters (
  disasterid      IN VARCHAR2,
  stateid      IN VARCHAR2,
    localetype   IN VARCHAR2,
    localevalues   IN VARCHAR2,
    selectCols   IN VARCHAR2,
    summaryCols   IN VARCHAR2,
    results      OUT resultArray
) AS
    sql_stmt   VARCHAR2(32767);
    localeClause VARCHAR2(32767);
    disasterClause VARCHAR2(32767);
    disasterClause VARCHAR2(32767);
    selectClause VARCHAR2(32767);
    whereClause VARCHAR2(32767);
    type summaryColsList IS TABLE OF VARCHAR(32767) INDEX BY PLS_INTEGER;
BEGIN

IF stateid IS NOT NULL
THEN
    stateClause := 'fad.DMGE_STATE_CD IN (' || stateid || ')';
END IF;

IF disasterid != 'ALL'
THEN
    disasterClause := 'fad.DSTER_ID IN (' || disasterid || ')';
END IF;

IF localetype IS NOT NULL
THEN
    localeClause := 'fad.' || localetype || ' IN (' || localevalues || ')';
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

IF summaryCols IS NOT NULL
THEN
  select regexp_substr(summaryCols,'[^,]+', 1, level) into summaryColsList from dual;
  for i in 1 .. summaryColsList.count loop
    selectClause := selectClause || 'SUM(' || summaryColsList(i) || ')';
    IF i < summaryColsList.count
    THEN
      selectClause := selectClause || ',';
    END IF;
  end loop;
ELSEIF selectCols IS NOT NULL
THEN
  select regexp_substr(selectCols,'[^,]+', 1, level) into summaryColsList from dual;
  for i in 1 .. summaryColsList.count loop
    selectClause := selectClause || summaryColsList(i);
    IF i < summaryColsList.count
    THEN
      selectClause := selectClause || ',';
    END IF;
  end loop;
ELSE
  selectClause = '*'
END IF;

sql_stmt := 'SELECT ' || selectClause || '
            FROM FEMA_APPLICANT_DATA fad '
             || whereClause ;
 dbms_output.put_line('Constructed query: ' || sql_stmt);
    EXECUTE IMMEDIATE sql_stmt BULK COLLECT INTO
        results
        USING stateid;
EXCEPTION
    WHEN no_data_found THEN
        dbms_output.put_line('No data returned');
END get_disasters;

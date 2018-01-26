/******************************
** File:    FEMA_DATA.sql
** Name:    FEMA_DATA package
** Desc:    Procedures that will be called by API used by DRDP system to pull
**          FEMA_DATA from HUD database for use by DRGR grantees web application
** Auth:    Dave Hannon, Flexion Inc
** Date:    08/16/2017
**************************
** Change History
**************************
** Version   Date          Author                    Description
** -------   -----------  ------------------------   ------------------------------------
** 1         08/16/2017   Dave Hannon, Flexion Inc   initial version
** 2         08/18/2017   Dave Hannon, Flexion Inc   improved code to condense logic
** 3         09/08/2017   Dave Hannon, Flexion Inc   moved TABLE declarations outside package
** 4         09/21/2017   Dave Hannon, Flexion Inc   added new locale types: zipcode, township, and tract
** 5         09/26/2017   Dave Hannon, Flexion Inc   added column number_of_records
** 6         11/02/2017   Dave Hannon, Flexion Inc   changed to fix performance probs with MULE.  returning cursor now, and accepting
**                                                   text argument for locales and disasterid, which we split by commas
*******************************/
CREATE OR REPLACE PACKAGE fema_data AS
/* $Header$ */
  TYPE arg_table IS TABLE OF VARCHAR2(32767);
  PROCEDURE get_locales
  (
    stateid IN VARCHAR2,
    localetype IN VARCHAR2,
    disasterid IN VARCHAR2 DEFAULT NULL,
    results OUT SYS_REFCURSOR
  );

  PROCEDURE get_disasters
  (
    stateid IN VARCHAR2,
    localetype IN VARCHAR2 DEFAULT NULL,
    localevalues IN VARCHAR2 DEFAULT NULL,
    results OUT SYS_REFCURSOR
  );

  PROCEDURE get_records (
    disasterid IN VARCHAR2 DEFAULT NULL,
    stateid IN VARCHAR2 DEFAULT NULL,
    localetype IN VARCHAR2 DEFAULT NULL,
    localevalues IN VARCHAR2 DEFAULT NULL,
    results OUT SYS_REFCURSOR
  );

  PROCEDURE get_summary_records (
    disasterid IN VARCHAR2 DEFAULT NULL,
    stateid IN VARCHAR2 DEFAULT NULL,
    localetype IN VARCHAR2 DEFAULT NULL,
    localevalues IN VARCHAR2 DEFAULT NULL,
    results OUT SYS_REFCURSOR
  );

END fema_data;
/


CREATE OR REPLACE PACKAGE BODY fema_data AS
  FUNCTION split_args (
    arg_string IN VARCHAR2
  ) RETURN arg_table IS
  args arg_table := arg_table();
  BEGIN
    SELECT regexp_substr(arg_string,'[^,]+', 1, LEVEL)
      BULK COLLECT INTO args
      FROM dual
   CONNECT BY regexp_substr(arg_string, '[^,]+', 1, LEVEL) IS NOT NULL;
   RETURN args;
  END split_args;

  PROCEDURE get_locales (
    stateid IN VARCHAR2,
    localetype IN VARCHAR2,
    disasterid IN VARCHAR2 DEFAULT NULL,
    results OUT SYS_REFCURSOR
  ) AS
  disaster_args arg_table := arg_table();
BEGIN
  disaster_args := split_args( disasterid );
  OPEN results FOR
  SELECT * FROM dual;
    IF localetype = 'city'
    THEN
      OPEN results FOR
      SELECT UNIQUE DMGE_CITY_NAME AS city
        FROM FEMA_HOUSEHOLD_DATA_HOUSEHOLD fhdh
       WHERE fhdh.DMGE_STATE_CD = stateid
         AND ( disasterid IS NULL OR fhdh.DSTER_ID IN (SELECT * FROM TABLE(disaster_args)) )
       ORDER BY 1;
    ELSIF localetype = 'county'
    THEN
      OPEN results FOR
      SELECT UNIQUE CNTY_NAME AS county
        FROM FEMA_HOUSEHOLD_DATA_HOUSEHOLD fhdh
       WHERE fhdh.DMGE_STATE_CD = stateid
       AND ( disasterid IS NULL OR fhdh.DSTER_ID IN (SELECT * FROM TABLE(disaster_args)) )
       ORDER BY 1;
    ELSIF localetype = 'congrdist'
    THEN
      OPEN results FOR
      SELECT UNIQUE FCD_FIPS_91_CD AS congrdist
        FROM FEMA_HOUSEHOLD_DATA_HOUSEHOLD fhdh
       WHERE fhdh.DMGE_STATE_CD = stateid
       AND ( disasterid IS NULL OR fhdh.DSTER_ID IN (SELECT * FROM TABLE(disaster_args)) )
       ORDER BY 1;
    ELSIF localetype = 'zipcode'
    THEN
      OPEN results FOR
      SELECT UNIQUE STD_BASC_ZIP_CD AS zipcode
        FROM FEMA_HOUSEHOLD_DATA_HOUSEHOLD fhdh
       WHERE fhdh.DMGE_STATE_CD = stateid
       AND ( disasterid IS NULL OR fhdh.DSTER_ID IN (SELECT * FROM TABLE(disaster_args)) )
       ORDER BY 1;
    ELSIF localetype = 'township'
    THEN
      OPEN results FOR
      SELECT UNIQUE CNTY_SUB_DIVN_CURR_NAME AS township
        FROM FEMA_HOUSEHOLD_DATA_HOUSEHOLD fhdh
       WHERE fhdh.DMGE_STATE_CD = stateid
       AND ( disasterid IS NULL OR fhdh.DSTER_ID IN (SELECT * FROM TABLE(disaster_args)) )
       ORDER BY 1;
    ELSIF localetype = 'tract'
    THEN
      OPEN results FOR
      SELECT UNIQUE TRACT_CENSUS_2010_CD AS tract
        FROM FEMA_HOUSEHOLD_DATA_HOUSEHOLD fhdh
       WHERE fhdh.DMGE_STATE_CD = stateid
       AND ( disasterid IS NULL OR fhdh.DSTER_ID IN (SELECT * FROM TABLE(disaster_args)) )
       ORDER BY 1;

    END IF;
    EXCEPTION
      WHEN no_data_found THEN
        DBMS_OUTPUT.PUT_LINE('No data returned');
        RAISE;
  END get_locales;

  PROCEDURE get_disasters
  (
    stateid IN VARCHAR2,
    localetype IN VARCHAR2 DEFAULT NULL,
    localevalues IN VARCHAR2 DEFAULT NULL,
    results OUT SYS_REFCURSOR
  ) AS
  locale_args arg_table := arg_table();
  BEGIN
    locale_args := split_args( localevalues );

    OPEN results FOR
    SELECT UNIQUE DSTER_ID AS disaster
      FROM FEMA_HOUSEHOLD_DATA_HOUSEHOLD fhdh
      WHERE ( stateid IS NULL OR fhdh.DMGE_STATE_CD = stateid )
        AND (
          ( localetype IS NULL AND localevalues IS NULL )
          OR
          ( localetype = 'city' AND fhdh.DMGE_CITY_NAME IN ( select * FROM TABLE( locale_args ) ) )
          OR
          ( localetype = 'county' AND fhdh.CNTY_NAME IN ( select * FROM TABLE( locale_args ) ) )
          OR
          ( localetype = 'congrdist' AND fhdh.FCD_FIPS_91_CD IN ( select * FROM TABLE( locale_args ) ) )
          OR
          ( localetype = 'zipcode' AND fhdh.STD_BASC_ZIP_CD IN ( select * FROM TABLE( locale_args ) ) )
          OR
          ( localetype = 'township' AND fhdh.CNTY_SUB_DIVN_CURR_NAME IN ( select * FROM TABLE( locale_args ) ) )
          OR
          ( localetype = 'tract' AND fhdh.TRACT_CENSUS_2010_CD IN ( select * FROM TABLE( locale_args ) ) )
        )
     ORDER BY 1;
  EXCEPTION
    WHEN no_data_found THEN
      DBMS_OUTPUT.PUT_LINE('No data returned');
      RAISE;
  END get_disasters;

  PROCEDURE get_records (
    disasterid IN VARCHAR2 DEFAULT NULL,
    stateid IN VARCHAR2 DEFAULT NULL,
    localetype IN VARCHAR2 DEFAULT NULL,
    localevalues IN VARCHAR2 DEFAULT NULL,
    results OUT SYS_REFCURSOR
  ) AS
    locale_args arg_table := arg_table();
    disaster_args arg_table := arg_table();
  BEGIN
    locale_args := split_args( localevalues );
    disaster_args := split_args( disasterid );

    OPEN results FOR
    SELECT *
    FROM FEMA_HOUSEHOLD_DATA_HOUSEHOLD fhdh
   WHERE ( disasterid IS NULL OR fhdh.DSTER_ID IN (SELECT * FROM TABLE(disaster_args)) )
     AND ( stateid IS NULL OR fhdh.DMGE_STATE_CD = stateid )
     AND (
       ( localetype IS NULL AND localevalues IS NULL )
       OR
       ( localetype = 'city' AND fhdh.DMGE_CITY_NAME IN (SELECT * FROM TABLE(locale_args)) )
       OR
       ( localetype = 'county' AND fhdh.CNTY_NAME IN (SELECT * FROM TABLE(locale_args)) )
       OR
       ( localetype = 'congrdist' AND fhdh.FCD_FIPS_91_CD IN (SELECT * FROM TABLE(locale_args)) )
       OR
       ( localetype = 'zipcode' AND fhdh.STD_BASC_ZIP_CD IN (SELECT * FROM TABLE(locale_args)) )
       OR
       ( localetype = 'township' AND fhdh.CNTY_SUB_DIVN_CURR_NAME IN (SELECT * FROM TABLE(locale_args)) )
       OR
       ( localetype = 'tract' AND fhdh.TRACT_CENSUS_2010_CD IN (SELECT * FROM TABLE(locale_args)) )
     );

  EXCEPTION
    WHEN no_data_found THEN
      DBMS_OUTPUT.PUT_LINE('No data returned');
      RAISE;
  END get_records;

  PROCEDURE get_summary_records (
    disasterid IN VARCHAR2 DEFAULT NULL,
    stateid IN VARCHAR2 DEFAULT NULL,
    localetype IN VARCHAR2 DEFAULT NULL,
    localevalues IN VARCHAR2 DEFAULT NULL,
    results OUT SYS_REFCURSOR
  ) AS
  locale_args arg_table := arg_table();
  disaster_args arg_table := arg_table();
  BEGIN
    locale_args := split_args( localevalues );
    disaster_args := split_args( disasterid );

    OPEN results FOR
    SELECT
        SUM( HSHD_SIZE_CNT ),
        SUM( DPNDNT_CNT ),
        SUM( INCM_AMNT ),
        SUM( HZRD_INSNC_AMNT ),
        SUM( FLOOD_INSNC_AMNT ),
        SUM( OTHER_INSNC_AMNT ),
        SUM( REAL_PROP_LOSS_AMNT ),
        SUM( FLOOD_DMGE_AMNT ),
        SUM( FNDTN_DMGE_AMNT ),
        SUM( ROOF_DMGE_AMNT ),
        SUM( TMP_SHLTR_RCVD_AMNT ),
        SUM( RENT_ASSTN_AMNT ),
        SUM( REPR_AMNT ),
        SUM( RPMT_AMNT ),
        SUM( SBA_RCVD_AMNT ),
        SUM( PRSNL_PROP_ASSTN_AMNT ),
        SUM( OTHER_ASSTN_AMNT ),
        SUM( TOTAL_DMGE_AMNT ),
        SUM( TOTAL_ASSTN_AMNT ),
        SUM( HUD_UNMT_NEED_AMNT ),
        COUNT( * )  AS NUMBER_OF_RECORDS
      FROM FEMA_HOUSEHOLD_DATA_HOUSEHOLD fhdh
     WHERE ( disasterid IS NULL OR fhdh.DSTER_ID IN (SELECT * FROM TABLE(disaster_args)) )
       AND ( stateid IS NULL OR fhdh.DMGE_STATE_CD = stateid )
       AND (
         ( localetype IS NULL AND localevalues IS NULL )
         OR
         ( localetype = 'city' AND fhdh.DMGE_CITY_NAME IN (SELECT * FROM TABLE(locale_args)) )
         OR
         ( localetype = 'county' AND fhdh.CNTY_NAME IN (SELECT * FROM TABLE(locale_args)) )
         OR
         ( localetype = 'congrdist' AND fhdh.FCD_FIPS_91_CD IN (SELECT * FROM TABLE(locale_args)) )
         OR
         ( localetype = 'zipcode' AND fhdh.STD_BASC_ZIP_CD IN (SELECT * FROM TABLE(locale_args)) )
         OR
         ( localetype = 'township' AND fhdh.CNTY_SUB_DIVN_CURR_NAME IN (SELECT * FROM TABLE(locale_args)) )
         OR
         ( localetype = 'tract' AND fhdh.TRACT_CENSUS_2010_CD IN (SELECT * FROM TABLE(locale_args)) )
       );
  EXCEPTION
    WHEN no_data_found THEN
      DBMS_OUTPUT.PUT_LINE('No data returned');
      RAISE;
  END get_summary_records;
END fema_data;
/

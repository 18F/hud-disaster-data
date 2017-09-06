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
*******************************/

DROP PACKAGE fema_data;
CREATE OR REPLACE PACKAGE fema_data AS
  TYPE recordArray IS TABLE OF FEMA_HOUSEHOLD_DATA_HOUSEHOLD%ROWTYPE INDEX BY PLS_INTEGER;
  TYPE charParameterArray IS TABLE OF VARCHAR2(32767) INDEX BY PLS_INTEGER;
  TYPE nbrParameterArray IS TABLE OF NUMBER(5) INDEX BY PLS_INTEGER;
  TYPE localeArray IS TABLE OF VARCHAR2(32767) INDEX BY PLS_INTEGER;
  TYPE disasterArray IS TABLE OF NUMBER(5) INDEX BY PLS_INTEGER;
  emptyCharParm charParameterArray;
  emptyNbrParm nbrParameterArray;
  TYPE summaryRec IS RECORD (
    HSHD_SIZE_CNT         NUMBER(10),
    DPNDNT_CNT            NUMBER(13,2),
    INCM_AMNT             NUMBER(13,2),
    HZRD_INSNC_AMNT       NUMBER(13,2),
    FLOOD_INSNC_AMNT      NUMBER(13,2),
    OTHER_INSNC_AMNT      NUMBER(13,2),
    REAL_PROP_LOSS_AMNT   NUMBER(13,2),
    FLOOD_DMGE_AMNT       NUMBER(13,2),
    FNDTN_DMGE_AMNT       NUMBER(13,2),
    ROOF_DMGE_AMNT        NUMBER(13,2),
    TMP_SHLTR_RCVD_AMNT   NUMBER(13,2),
    RENT_ASSTN_AMNT       NUMBER(18,2),
    REPR_AMNT             NUMBER(18,2),
    RPMT_AMNT             NUMBER(13,2),
    SBA_RCVD_AMNT         NUMBER(13,2),
    PRSNL_PROP_ASSTN_AMNT NUMBER(13,2),
    OTHER_ASSTN_AMNT      NUMBER(13,2),
    TOTAL_DMGE_AMNT       NUMBER(13,2),
    TOTAL_ASSTN_AMNT      NUMBER(13,2),
    HUD_UNMT_NEED_AMNT    NUMBER(13,2)
  );
  TYPE summaryArray IS TABLE OF summaryRec INDEX BY PLS_INTEGER;

  PROCEDURE get_locales
  (
    stateid IN VARCHAR2,
    localetype IN VARCHAR2,
    disasterid IN nbrParameterArray,
    results OUT localeArray
  );

  PROCEDURE get_disasters
  (
    stateid IN VARCHAR2,
    localetype IN VARCHAR2 DEFAULT NULL,
    localevalues IN charParameterArray DEFAULT emptyCharParm,
    results OUT disasterArray
  );

  PROCEDURE get_records (
    disasterid IN nbrParameterArray DEFAULT emptyNbrParm,
    stateid IN VARCHAR2 DEFAULT NULL,
    localetype IN VARCHAR2 DEFAULT NULL,
    localevalues IN charParameterArray DEFAULT emptyCharParm,
    results OUT recordArray
  );

  PROCEDURE get_summary_records (
    disasterid IN nbrParameterArray DEFAULT emptyNbrParm,
    stateid IN VARCHAR2 DEFAULT NULL,
    localetype IN VARCHAR2 DEFAULT NULL,
    localevalues IN charParameterArray DEFAULT emptyCharParm,
    results OUT summaryArray
  );

END fema_data;
/


CREATE OR REPLACE PACKAGE BODY fema_data AS
  PROCEDURE get_locales (
    stateid IN VARCHAR2,
    localetype IN VARCHAR2,
    disasterid IN nbrParameterArray,
    results OUT localeArray
  ) AS
    disasterParmCount NUMBER(5) := disasterid.COUNT;
  BEGIN
    IF localetype = 'city'
    THEN
      SELECT UNIQUE DMGE_CITY_NAME AS city
        BULK COLLECT INTO results
        FROM FEMA_HOUSEHOLD_DATA_HOUSEHOLD fhdh
       WHERE fhdh.DMGE_STATE_CD = stateid
         AND ( disasterParmCount = 0 OR fhdh.DSTER_ID IN (SELECT * FROM TABLE(disasterid)) )
       ORDER BY 1;
    ELSIF localetype = 'county'
    THEN
      SELECT UNIQUE CNTY_NAME AS county
        BULK COLLECT INTO results
        FROM FEMA_HOUSEHOLD_DATA_HOUSEHOLD fhdh
       WHERE fhdh.DMGE_STATE_CD = stateid
       AND ( disasterParmCount = 0 OR fhdh.DSTER_ID IN (SELECT * FROM TABLE(disasterid)) )
       ORDER BY 1;
    ELSIF localetype = 'congrdist'
    THEN
      SELECT UNIQUE FCD_FIPS91_CD AS congrdist
        BULK COLLECT INTO results
        FROM FEMA_HOUSEHOLD_DATA_HOUSEHOLD fhdh
       WHERE fhdh.DMGE_STATE_CD = stateid
       AND ( disasterParmCount = 0 OR fhdh.DSTER_ID IN (SELECT * FROM TABLE(disasterid)) )
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
    localevalues IN charParameterArray DEFAULT emptyCharParm,
    results OUT disasterArray
  ) AS
    localeParmCount NUMBER(5) := localevalues.COUNT;
  BEGIN
    SELECT UNIQUE DSTER_ID AS disaster
      BULK COLLECT INTO results
      FROM FEMA_HOUSEHOLD_DATA_HOUSEHOLD fhdh
      WHERE ( stateid IS NULL OR fhdh.DMGE_STATE_CD = stateid )
        AND (
          ( localetype IS NULL AND localeParmCount = 0 )
          OR
          ( localetype = 'city' AND fhdh.DMGE_CITY_NAME IN (SELECT * FROM TABLE(localevalues)) )
          OR
          ( localetype = 'county' AND fhdh.CNTY_NAME IN (SELECT * FROM TABLE(localevalues)) )
          OR
          ( localetype = 'congrdist' AND fhdh.FCD_FIPS91_CD IN (SELECT * FROM TABLE(localevalues)) )
        )
     ORDER BY 1;
  EXCEPTION
    WHEN no_data_found THEN
      DBMS_OUTPUT.PUT_LINE('No data returned');
      RAISE;
  END get_disasters;

  PROCEDURE get_records (
    disasterid IN nbrParameterArray DEFAULT emptyNbrParm,
    stateid IN VARCHAR2 DEFAULT NULL,
    localetype IN VARCHAR2 DEFAULT NULL,
    localevalues IN charParameterArray DEFAULT emptyCharParm,
    results OUT recordArray
  ) AS
    localeParmCount NUMBER(5) := localevalues.COUNT;
    disasterParmCount NUMBER(5) := disasterid.COUNT;
  BEGIN
  SELECT *
    BULK COLLECT INTO results
    FROM FEMA_HOUSEHOLD_DATA_HOUSEHOLD fhdh
   WHERE ( disasterParmCount = 0 OR fhdh.DSTER_ID IN (SELECT * FROM TABLE(disasterid)) )
     AND ( stateid IS NULL OR fhdh.DMGE_STATE_CD = stateid )
     AND (
       ( localetype IS NULL AND localeParmCount = 0 )
       OR
       ( localetype = 'city' AND fhdh.DMGE_CITY_NAME IN (SELECT * FROM TABLE(localevalues)) )
       OR
       ( localetype = 'county' AND fhdh.CNTY_NAME IN (SELECT * FROM TABLE(localevalues)) )
       OR
       ( localetype = 'congrdist' AND fhdh.FCD_FIPS91_CD IN (SELECT * FROM TABLE(localevalues)) )
     );

  EXCEPTION
    WHEN no_data_found THEN
      DBMS_OUTPUT.PUT_LINE('No data returned');
      RAISE;
  END get_records;

  PROCEDURE get_summary_records (
    disasterid IN nbrParameterArray DEFAULT emptyNbrParm,
    stateid IN VARCHAR2 DEFAULT NULL,
    localetype IN VARCHAR2 DEFAULT NULL,
    localevalues IN charParameterArray DEFAULT emptyCharParm,
    results OUT summaryArray
  ) AS
    localeParmCount NUMBER(5) := localevalues.COUNT;
    disasterParmCount NUMBER(5) := disasterid.COUNT;
  BEGIN
    SELECT  SUM( HSHD_SIZE_CNT ) AS HSHD_SIZE_CNT,
            SUM( DPNDNT_CNT ) AS DPNDNT_CNT,
            SUM( INCM_AMNT ) AS INCM_AMNT,
            SUM( HZRD_INSNC_AMNT ) AS HZRD_INSNC_AMNT,
            SUM( FLOOD_INSNC_AMNT ) AS FLOOD_INSNC_AMNT,
            SUM( OTHER_INSNC_AMNT ) AS OTHER_INSNC_AMNT,
            SUM( REAL_PROP_LOSS_AMNT ) AS REAL_PROP_LOSS_AMNT,
            SUM( FLOOD_DMGE_AMNT ) AS FLOOD_DMGE_AMNT,
            SUM( FNDTN_DMGE_AMNT ) AS FNDTN_DMGE_AMNT,
            SUM( ROOF_DMGE_AMNT ) AS ROOF_DMGE_AMNT,
            SUM( TMP_SHLTR_RCVD_AMNT ) AS TMP_SHLTR_RCVD_AMNT,
            SUM( RENT_ASSTN_AMNT ) AS RENT_ASSTN_AMNT,
            SUM( REPR_AMNT ) AS REPR_AMNT,
            SUM( RPMT_AMNT ) AS RPMT_AMNT,
            SUM( SBA_RCVD_AMNT ) AS SBA_RCVD_AMNT,
            SUM( PRSNL_PROP_ASSTN_AMNT ) AS PRSNL_PROP_ASSTN_AMNT,
            SUM( OTHER_ASSTN_AMNT ) AS OTHER_ASSTN_AMNT,
            SUM( TOTAL_DMGE_AMNT ) AS TOTAL_DMGE_AMNT,
            SUM( TOTAL_ASSTN_AMNT ) AS TOTAL_ASSTN_AMNT,
            SUM( HUD_UNMT_NEED_AMNT ) AS HUD_UNMT_NEED_AMNT
      BULK COLLECT INTO results
      FROM FEMA_HOUSEHOLD_DATA_HOUSEHOLD fhdh
     WHERE ( disasterParmCount = 0 OR fhdh.DSTER_ID IN (SELECT * FROM TABLE(disasterid)) )
       AND ( stateid IS NULL OR fhdh.DMGE_STATE_CD = stateid )
       AND (
         ( localetype IS NULL AND localeParmCount = 0 )
         OR
         ( localetype = 'city' AND fhdh.DMGE_CITY_NAME IN (SELECT * FROM TABLE(localevalues)) )
         OR
         ( localetype = 'county' AND fhdh.CNTY_NAME IN (SELECT * FROM TABLE(localevalues)) )
         OR
         ( localetype = 'congrdist' AND fhdh.FCD_FIPS91_CD IN (SELECT * FROM TABLE(localevalues)) )
       );
  EXCEPTION
    WHEN no_data_found THEN
      DBMS_OUTPUT.PUT_LINE('No data returned');
      RAISE;
  END get_summary_records;
END fema_data;
/

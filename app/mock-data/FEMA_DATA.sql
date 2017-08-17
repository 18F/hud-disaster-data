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
*******************************/

DROP PACKAGE fema_data;
CREATE OR REPLACE PACKAGE fema_data AS
  TYPE charParameterArray IS TABLE OF VARCHAR2(32767) INDEX BY PLS_INTEGER;
  TYPE nbrParameterArray IS TABLE OF NUMBER(5) INDEX BY PLS_INTEGER;
  TYPE localeArray IS TABLE OF VARCHAR2(32767) INDEX BY PLS_INTEGER;
  TYPE disasterArray IS TABLE OF NUMBER(5) INDEX BY PLS_INTEGER;
  emptyCharParm charParameterArray;
  emptyNbrParm nbrParameterArray;

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

END fema_data;
/


CREATE OR REPLACE PACKAGE BODY fema_data AS
  PROCEDURE get_locales (
    stateid IN VARCHAR2,
    localetype IN VARCHAR2,
    disasterid IN nbrParameterArray,
    results OUT localeArray
  ) AS
  BEGIN
    IF localetype = 'city' AND disasterid.COUNT = 0
    THEN
      SELECT UNIQUE DMGE_CITY_NAME AS city
        BULK COLLECT INTO results
        FROM FEMA_HOUSEHOLD_DATA_HOUSEHOLD fad
       WHERE fad.DMGE_STATE_CD = stateid
       ORDER BY 1;
    ELSIF localetype = 'city' AND disasterid.COUNT > 0
    THEN
      SELECT UNIQUE DMGE_CITY_NAME AS city
        BULK COLLECT INTO results
        FROM FEMA_HOUSEHOLD_DATA_HOUSEHOLD fad
       WHERE fad.DMGE_STATE_CD = stateid
         AND fad.DSTER_ID IN (SELECT * FROM TABLE(disasterid))
       ORDER BY 1;
    ELSIF localetype = 'county' AND disasterid.COUNT = 0
    THEN
      SELECT UNIQUE CNTY_NAME AS county
        BULK COLLECT INTO results
        FROM FEMA_HOUSEHOLD_DATA_HOUSEHOLD fad
       WHERE fad.DMGE_STATE_CD = stateid
       ORDER BY 1;
    ELSIF localetype = 'county' AND disasterid.COUNT > 0
    THEN
      SELECT UNIQUE CNTY_NAME AS county
        BULK COLLECT INTO results
        FROM FEMA_HOUSEHOLD_DATA_HOUSEHOLD fad
       WHERE fad.DMGE_STATE_CD = stateid
         AND fad.DSTER_ID IN (SELECT * FROM TABLE(disasterid))
       ORDER BY 1;
    ELSIF localetype = 'congrdist' AND disasterid.COUNT = 0
    THEN
      SELECT UNIQUE FCD_FIPS91_CD AS congrdist
        BULK COLLECT INTO results
        FROM FEMA_HOUSEHOLD_DATA_HOUSEHOLD fad
       WHERE fad.DMGE_STATE_CD = stateid
       ORDER BY 1;
    ELSIF localetype = 'congrdist' AND disasterid.COUNT > 0
    THEN
      SELECT UNIQUE FCD_FIPS91_CD AS congrdist
        BULK COLLECT INTO results
        FROM FEMA_HOUSEHOLD_DATA_HOUSEHOLD fad
       WHERE fad.DMGE_STATE_CD = stateid
         AND fad.DSTER_ID IN (SELECT * FROM TABLE(disasterid))
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
 BEGIN
    IF localetype IS NULL AND localevalues.COUNT = 0
    THEN
      SELECT UNIQUE DSTER_ID AS disaster
        BULK COLLECT INTO results
        FROM FEMA_HOUSEHOLD_DATA_HOUSEHOLD fad
       WHERE fad.DMGE_STATE_CD = stateid
       ORDER BY 1;
    ELSIF localetype = 'city' AND localevalues.COUNT > 0
    THEN
      SELECT UNIQUE DSTER_ID AS disaster
        BULK COLLECT INTO results
        FROM FEMA_HOUSEHOLD_DATA_HOUSEHOLD fad
       WHERE fad.DMGE_STATE_CD = stateid
         AND fad.DMGE_CITY_NAME IN (SELECT * FROM TABLE(localevalues))
       ORDER BY 1;
    ELSIF localetype = 'county' AND localevalues.COUNT > 0
    THEN
      SELECT UNIQUE DSTER_ID AS disaster
        BULK COLLECT INTO results
        FROM FEMA_HOUSEHOLD_DATA_HOUSEHOLD fad
       WHERE fad.DMGE_STATE_CD = stateid
         AND fad.CNTY_NAME IN (SELECT * FROM TABLE(localevalues))
       ORDER BY 1;
    ELSIF localetype = 'congrdist' AND localevalues.COUNT > 0
    THEN
      SELECT UNIQUE DSTER_ID AS disaster
        BULK COLLECT INTO results
        FROM FEMA_HOUSEHOLD_DATA_HOUSEHOLD fad
       WHERE fad.DMGE_STATE_CD = stateid
         AND fad.FCD_FIPS91_CD IN (SELECT * FROM TABLE(localevalues))
       ORDER BY 1;
    END IF;
    EXCEPTION
      WHEN no_data_found THEN
        DBMS_OUTPUT.PUT_LINE('No data returned');
        RAISE;
 END get_disasters;
END fema_data;
/

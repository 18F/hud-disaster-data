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
*******************************/
CREATE TYPE charParameterArray IS TABLE OF VARCHAR2(32767);
/
CREATE TYPE nbrParameterArray IS TABLE OF NUMBER(5) ;
/
CREATE TYPE localeArray IS TABLE OF VARCHAR2(32767) ;
/
CREATE TYPE disasterArray IS TABLE OF NUMBER(5) ;
/
CREATE TYPE summaryRec AS OBJECT (
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
/
CREATE TYPE summaryArray IS TABLE OF summaryRec;
/
CREATE TYPE recordType AS OBJECT (
  "REC_ID" NUMBER(8,0),
	"DSTER_ID" CHAR(4 BYTE),
	"DSTER_TYPE_CD" CHAR(2 BYTE),
	"APPLT_LAST_NAME" VARCHAR2(51 BYTE),
	"APPLT_FIRST_NAME" VARCHAR2(51 BYTE),
	"CPLCNT_FIRST_NAME" VARCHAR2(51 BYTE),
	"CPLCNT_LAST_NAME" VARCHAR2(51 BYTE),
	"APPLT_SSN_ID" CHAR(9 BYTE),
	"FEMA_RGSTN_ID" CHAR(9 BYTE),
	"CURR_MAILG_ADDR_TEXT" VARCHAR2(61 BYTE),
	"CURR_MAILG_CITY_NAME" VARCHAR2(29 BYTE),
	"CURR_MAILG_STATE_CD" CHAR(2 BYTE),
	"CURR_MAILG_ZIP_CD" CHAR(5 BYTE),
	"PHN_AREA_NUM" VARCHAR2(3 BYTE),
	"PHN_NUM" VARCHAR2(8 BYTE),
	"ALTNT_PHN_AREA_NUM" VARCHAR2(3 BYTE),
	"ALTNT_PHN_NUM" VARCHAR2(8 BYTE),
	"DMGE_ADDR_LINE_TEXT" VARCHAR2(61 BYTE),
	"DMGE_CITY_NAME" VARCHAR2(29 BYTE),
	"DMGE_STATE_CD" CHAR(2 BYTE),
	"DMGE_BASC_ZIP_CD" CHAR(5 BYTE),
	"DMGE_ZIP_EXTN_CD" CHAR(4 BYTE),
	"CNTY_NAME" VARCHAR2(30 BYTE),
	"HSHD_SIZE_CNT" NUMBER(8,0),
	"DPNDNT_CNT" NUMBER(8,0),
	"INCM_AMNT" NUMBER(10,2),
	"SPCL_NEEDS_INDR" CHAR(1 BYTE),
	"RSDN_OWND_CD" VARCHAR2(8 BYTE),
	"INSNC_CD" CHAR(5 BYTE),
	"HZRD_INSNC_INDR" CHAR(1 BYTE),
	"HZRD_INSNC_CMPNY_NAME" VARCHAR2(50 BYTE),
	"HZRD_INSNC_AMNT" NUMBER(8,2),
	"FLOOD_INSNC_INDR" CHAR(1 BYTE),
	"FLOOD_INSNC_AMNT" NUMBER(8,2),
	"OTHER_INSNC_INDR" CHAR(1 BYTE),
	"OTHER_INSNC_AMNT" NUMBER(8,2),
	"FEMA_INSPN_TEXT" VARCHAR2(50 BYTE),
	"SNGLE_FMLY_INDR" CHAR(1 BYTE),
	"MF_INDR" CHAR(1 BYTE),
	"REAL_PROP_LOSS_AMNT" NUMBER(8,2),
	"DSTRYD_INDR" CHAR(1 BYTE),
	"WTR_LVL_VLUE" NUMBER(8,2),
	"WTR_LVL_BASEMT_VLUE" NUMBER(3,2),
	"HIGH_WTR_LOC_CD" CHAR(1 BYTE),
	"FLOOD_INDR" CHAR(1 BYTE),
	"FLOOD_DMGE_AMNT" NUMBER(8,2),
	"FNDTN_DMGE_INDR" CHAR(1 BYTE),
	"FNDTN_DMGE_AMNT" NUMBER(8,2),
	"ROOF_DMGE_INDR" CHAR(1 BYTE),
	"ROOF_DMGE_AMNT" NUMBER(8,2),
	"TMP_SHLTR_ELGB_INDR" CHAR(1 BYTE),
	"TMP_SHLTR_RCVD_AMNT" NUMBER(8,2),
	"MBL_HME_INDR" CHAR(1 BYTE),
	"MBL_HME_DT" DATE,
	"MBL_HME_LOC_CD" CHAR(10 BYTE),
	"RENT_ASSTN_RCVD_INDR" CHAR(1 BYTE),
	"RENT_ASSTN_AMNT" NUMBER(16,2),
	"RENT_ASSTN_INELGB_TEXT" VARCHAR2(50 BYTE),
	"REPR_RCVD_INDR" CHAR(1 BYTE),
	"REPR_AMNT" NUMBER(16,2),
	"REPR_INELGB_TEXT" VARCHAR2(50 BYTE),
	"RPMT_RCVD_INDR" CHAR(1 BYTE),
	"RPMT_AMNT" NUMBER(8,2),
	"RPMT_INELGB_TEXT" VARCHAR2(50 BYTE),
	"SBA_ELGB_INDR" CHAR(1 BYTE),
	"SBA_RCVD_AMNT" NUMBER(8,2),
	"PRSNL_PROP_ASSTN_INDR" CHAR(1 BYTE),
	"PRSNL_PROP_ASSTN_AMNT" NUMBER(8,2),
	"OTHER_ASSTN_INDR" CHAR(1 BYTE),
	"OTHER_ASSTN_AMNT" NUMBER(8,2),
	"URGNT_REPR_RQRD_INDR" CHAR(1 BYTE),
	"RENTAL_ASSTN_END_DT" DATE,
	"RENTAL_ASSTN_ADDR_LINE_TEXT" VARCHAR2(61 BYTE),
	"RENTAL_ASSTN_CITY_NAME" VARCHAR2(29 BYTE),
	"RENTAL_ASSTN_STATE_CD" CHAR(2 BYTE),
	"RENTAL_ASSTN_ZIP_CD" CHAR(5 BYTE),
	"TOTAL_DMGE_AMNT" NUMBER(8,2),
	"TOTAL_ASSTN_AMNT" NUMBER(8,2),
	"HUD_UNMT_NEED_AMNT" NUMBER(8,2),
	"HUD_ASSTD_INDR" CHAR(1 BYTE),
	"REC_DT" DATE,
	"HUD_PGM_CD" VARCHAR2(3 BYTE),
	"LAT_DEG_MSRE" NUMBER(12,9),
	"LGT_DEG_MSRE" NUMBER(12,9),
	"FCD_FIPS_91_CD" CHAR(7 BYTE),
	"STATE_CENSUS_2010_CD" CHAR(2 BYTE),
	"CNTY_CENSUS_2010_CD" CHAR(3 BYTE),
	"TRACT_CENSUS_2010_CD" CHAR(6 BYTE),
	"BLK_GRP_CENSUS_2010_CD" CHAR(1 BYTE),
	"PLC_CENSUS_2010_CD" CHAR(5 BYTE),
	"STD_ADDR_LINE_TEXT" VARCHAR2(100 BYTE),
	"STD_CITY_NAME" VARCHAR2(100 BYTE),
	"STD_STATE_CD" CHAR(2 BYTE),
	"STD_BASC_ZIP_CD" CHAR(5 BYTE),
	"CNTY_CENSUS_2010_NAME" VARCHAR2(100 BYTE),
	"CNTY_SUB_DIVN_CUR_NAME" VARCHAR2(100 BYTE),
	"PLC_CENSUS_2010_NAME" VARCHAR2(100 BYTE),
	"CORE_BASD_STSCL_AREA_NAME" VARCHAR2(255 BYTE),
	"C1PGCR_CD" CHAR(1 BYTE),
	"C1PPRB_CD" CHAR(1 BYTE),
	"MSGUSPS_TEXT" VARCHAR2(100 BYTE),
	"RC_CENSUS_2010_CD" CHAR(1 BYTE),
	"CORE_BASD_STSCL_AREA_CD" CHAR(5 BYTE)
);
/
CREATE TYPE recordArray IS TABLE OF recordType;
/


CREATE OR REPLACE PACKAGE fema_data AS
/* $Header$ */
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
      SELECT UNIQUE FCD_FIPS_91_CD AS congrdist
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
          ( localetype = 'congrdist' AND fhdh.FCD_FIPS_91_CD IN (SELECT * FROM TABLE(localevalues)) )
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
  SELECT
        recordType( REC_ID,
                    DSTER_ID,
                    DSTER_TYPE_CD,
                    APPLT_LAST_NAME,
                    APPLT_FIRST_NAME,
                    CPLCNT_FIRST_NAME,
                    CPLCNT_LAST_NAME,
                    APPLT_SSN_ID,
                    FEMA_RGSTN_ID,
                    CURR_MAILG_ADDR_TEXT,
                    CURR_MAILG_CITY_NAME,
                    CURR_MAILG_STATE_CD,
                    CURR_MAILG_ZIP_CD,
                    PHN_AREA_NUM,
                    PHN_NUM,
                    ALTNT_PHN_AREA_NUM,
                    ALTNT_PHN_NUM,
                    DMGE_ADDR_LINE_TEXT,
                    DMGE_CITY_NAME,
                    DMGE_STATE_CD,
                    DMGE_BASC_ZIP_CD,
                    DMGE_ZIP_EXTN_CD,
                    CNTY_NAME,
                    HSHD_SIZE_CNT,
                    DPNDNT_CNT,
                    INCM_AMNT,
                    SPCL_NEEDS_INDR,
                    RSDN_OWND_CD,
                    INSNC_CD,
                    HZRD_INSNC_INDR,
                    HZRD_INSNC_CMPNY_NAME,
                    HZRD_INSNC_AMNT,
                    FLOOD_INSNC_INDR,
                    FLOOD_INSNC_AMNT,
                    OTHER_INSNC_INDR,
                    OTHER_INSNC_AMNT,
                    FEMA_INSPN_TEXT,
                    SNGLE_FMLY_INDR,
                    MF_INDR,
                    REAL_PROP_LOSS_AMNT,
                    DSTRYD_INDR,
                    WTR_LVL_VLUE,
                    WTR_LVL_BASEMT_VLUE,
                    HIGH_WTR_LOC_CD,
                    FLOOD_INDR,
                    FLOOD_DMGE_AMNT,
                    FNDTN_DMGE_INDR,
                    FNDTN_DMGE_AMNT,
                    ROOF_DMGE_INDR,
                    ROOF_DMGE_AMNT,
                    TMP_SHLTR_ELGB_INDR,
                    TMP_SHLTR_RCVD_AMNT,
                    MBL_HME_INDR,
                    MBL_HME_DT,
                    MBL_HME_LOC_CD,
                    RENT_ASSTN_RCVD_INDR,
                    RENT_ASSTN_AMNT,
                    RENT_ASSTN_INELGB_TEXT,
                    REPR_RCVD_INDR,
                    REPR_AMNT,
                    REPR_INELGB_TEXT,
                    RPMT_RCVD_INDR,
                    RPMT_AMNT,
                    RPMT_INELGB_TEXT,
                    SBA_ELGB_INDR,
                    SBA_RCVD_AMNT,
                    PRSNL_PROP_ASSTN_INDR,
                    PRSNL_PROP_ASSTN_AMNT,
                    OTHER_ASSTN_INDR,
                    OTHER_ASSTN_AMNT,
                    URGNT_REPR_RQRD_INDR,
                    RENTAL_ASSTN_END_DT,
                    RENTAL_ASSTN_ADDR_LINE_TEXT,
                    RENTAL_ASSTN_CITY_NAME,
                    RENTAL_ASSTN_STATE_CD,
                    RENTAL_ASSTN_ZIP_CD,
                    TOTAL_DMGE_AMNT,
                    TOTAL_ASSTN_AMNT,
                    HUD_UNMT_NEED_AMNT,
                    HUD_ASSTD_INDR,
                    REC_DT,
                    HUD_PGM_CD,
                    LAT_DEG_MSRE,
                    LGT_DEG_MSRE,
                    FCD_FIPS_91_CD,
                    STATE_CENSUS_2010_CD,
                    CNTY_CENSUS_2010_CD,
                    TRACT_CENSUS_2010_CD,
                    BLK_GRP_CENSUS_2010_CD,
                    PLC_CENSUS_2010_CD,
                    STD_ADDR_LINE_TEXT,
                    STD_CITY_NAME,
                    STD_STATE_CD,
                    STD_BASC_ZIP_CD,
                    CNTY_CENSUS_2010_NAME,
                    CNTY_SUB_DIVN_CUR_NAME,
                    PLC_CENSUS_2010_NAME,
                    CORE_BASD_STSCL_AREA_NAME,
                    C1PGCR_CD,
                    C1PPRB_CD,
                    MSGUSPS_TEXT,
                    RC_CENSUS_2010_CD,
                    CORE_BASD_STSCL_AREA_CD  )
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
       ( localetype = 'congrdist' AND fhdh.FCD_FIPS_91_CD IN (SELECT * FROM TABLE(localevalues)) )
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
    SELECT
      summaryRec( SUM( HSHD_SIZE_CNT ),
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
                  SUM( HUD_UNMT_NEED_AMNT )  )
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
         ( localetype = 'congrdist' AND fhdh.FCD_FIPS_91_CD IN (SELECT * FROM TABLE(localevalues)) )
       );
  EXCEPTION
    WHEN no_data_found THEN
      DBMS_OUTPUT.PUT_LINE('No data returned');
      RAISE;
  END get_summary_records;
END fema_data;
/

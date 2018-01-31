SET SERVEROUTPUT ON

DECLARE
  returnVal SYS_REFCURSOR;
  REC_ID                               NUMBER(16)   ;
  FEMA_RGSTN_ID                        NUMBER(16)   ;
  DSTER_ID                             CHAR(4)      ;
  HSHD_SIZE_CNT                        NUMBER(5)    ;
  BEDRM_CNT                            NUMBER(5)    ;
  RENT_AMNT                            NUMBER(9)    ;
  PHN_NUM                              VARCHAR2(10) ;
  ALTNT_PHN_NUM                        VARCHAR2(10) ;
  CURR_MAILG_ADDR_TEXT                 VARCHAR2(60) ;
  CURR_MAILG_CITY_NAME                 VARCHAR2(28) ;
  CURR_MAILG_STATE_CD                  CHAR(2)      ;
  CURR_MAILG_ZIP_CD                    CHAR(5)      ;
  APPLT_MAIL_ZIP_EXTN_CD               CHAR(4)      ;
  APPLT_DWLNG_TYPE_CD                  VARCHAR2(10) ;
  DMGE_ADDR_LINE_TEXT                  VARCHAR2(60) ;
  DMGE_CITY_NAME                       VARCHAR2(28) ;
  DMGE_STATE_CD                        CHAR(2)      ;
  DMGE_BASC_ZIP_CD                     CHAR(5)      ;
  DMGE_ZIP_EXTN_CD                     CHAR(4)      ;
  DMGE_PHN_NUM                         VARCHAR2(10) ;
  RSDN_OWND_CD                         CHAR(1)      ;
  HSHD_DATA_TRANS_ID                   NUMBER(16)   ;
  REC_DT                               TIMESTAMP(6) ;
  DSTER_TYPE_CD                        CHAR(2)      ;
  DPNDNT_CNT                           NUMBER(8)    ;
  INCM_AMNT                            NUMBER(10,2) ;
  PHN_AREA_NUM                         VARCHAR2(3)  ;
  ALTNT_PHN_AREA_NUM                   VARCHAR2(3)  ;
  CNTY_NAME                            VARCHAR2(30) ;
  INSNC_CD                             CHAR(5)      ;
  HZRD_INSNC_INDR                      CHAR(1)      ;
  HZRD_INSNC_CMPNY_NAME                VARCHAR2(50) ;
  HZRD_INSNC_AMNT                      NUMBER(8,2)  ;
  FLOOD_INSNC_INDR                     CHAR(1)      ;
  FLOOD_INSNC_AMNT                     NUMBER(8,2)  ;
  OTHER_INSNC_INDR                     CHAR(1)      ;
  OTHER_INSNC_AMNT                     NUMBER(8,2)  ;
  FEMA_INSPN_TEXT                      VARCHAR2(50) ;
  SNGLE_FMLY_INDR                      CHAR(1)      ;
  MF_INDR                              CHAR(1)      ;
  REAL_PROP_LOSS_AMNT                  NUMBER(10,2) ;
  DSTRYD_INDR                          CHAR(1)      ;
  WTR_LVL_VLUE                         NUMBER(8,3)  ;
  WTR_LVL_BASEMT_VLUE                  NUMBER(8,3)  ;
  HIGH_WTR_LOC_CD                      CHAR(1)      ;
  FLOOD_INDR                           CHAR(1)      ;
  FLOOD_DMGE_AMNT                      NUMBER(8,2)  ;
  FNDTN_DMGE_INDR                      CHAR(1)      ;
  FNDTN_DMGE_AMNT                      NUMBER(8,2)  ;
  ROOF_DMGE_INDR                       CHAR(1)      ;
  ROOF_DMGE_AMNT                       NUMBER(8,2)  ;
  TMP_SHLTR_ELGB_INDR                  CHAR(1)      ;
  TMP_SHLTR_RCVD_AMNT                  NUMBER(8,2)  ;
  MBL_HME_INDR                         CHAR(1)      ;
  MBL_HME_DT                           DATE         ;
  MBL_HME_LOC_CD                       CHAR(10)     ;
  RENT_ASSTN_RCVD_INDR                 CHAR(1)      ;
  RENT_ASSTN_AMNT                      NUMBER(16,2) ;
  RENT_ASSTN_INELGB_TEXT               VARCHAR2(50) ;
  REPR_RCVD_INDR                       CHAR(1)      ;
  REPR_AMNT                            NUMBER(16,2) ;
  REPR_INELGB_TEXT                     VARCHAR2(50) ;
  RPMT_RCVD_INDR                       CHAR(1)      ;
  RPMT_AMNT                            NUMBER(8,2)  ;
  RPMT_INELGB_TEXT                     VARCHAR2(50) ;
  SBA_ELGB_INDR                        CHAR(1)      ;
  SBA_RCVD_AMNT                        NUMBER(8,2)  ;
  PRSNL_PROP_ASSTN_INDR                CHAR(1)      ;
  PRSNL_PROP_ASSTN_AMNT                NUMBER(8,2)  ;
  OTHER_ASSTN_INDR                     CHAR(1)      ;
  OTHER_ASSTN_AMNT                     NUMBER(8,2)  ;
  URGNT_REPR_RQRD_INDR                 CHAR(1)      ;
  RENTAL_ASSTN_END_DT                  DATE         ;
  RENTAL_ASSTN_ADDR_LINE_TEXT          VARCHAR2(61) ;
  RENTAL_ASSTN_CITY_NAME               VARCHAR2(29) ;
  RENTAL_ASSTN_STATE_CD                CHAR(2)      ;
  RENTAL_ASSTN_ZIP_CD                  CHAR(5)      ;
  TOTAL_DMGE_AMNT                      NUMBER(8,2)  ;
  TOTAL_ASSTN_AMNT                     NUMBER(8,2)  ;
  HUD_UNMT_NEED_AMNT                   NUMBER(8,2)  ;
  HUD_ASSTD_INDR                       CHAR(1)      ;
  HUD_PGM_CD                           VARCHAR2(3)  ;
  APPLT_SSN_ID                         CHAR(9)      ;
  APPLT_FIRST_NAME                     VARCHAR2(50) ;
  APPLT_LAST_NAME                      VARCHAR2(50) ;
  APPLT_MIDL_NAME                      VARCHAR2(15) ;
  APPLT_DOB_DT                         DATE         ;
  SPCL_NEEDS_INDR                      CHAR(1)      ;
  APPLT_CTZN_INDR                      CHAR(1)      ;
  PGM_SOURCE_CD                        CHAR(4)      ;
  CPLCNT_FIRST_NAME                    VARCHAR2(51) ;
  CPLCNT_LAST_NAME                     VARCHAR2(51) ;
  LAT_DGREE_MSRE                       NUMBER(10,6) ;
  LGT_DGREE_MSRE                       NUMBER(11,6) ;
  FCD_FIPS_91_CD                       VARCHAR2(7)  ;
  STATE_CENSUS_2010_CD                 VARCHAR2(2)  ;
  CNTY_CENSUS_2010_CD                  VARCHAR2(3)  ;
  TRACT_CENSUS_2010_CD                 VARCHAR2(6)  ;
  BLK_GRP_CENSUS_2010_CD               VARCHAR2(1)  ;
  PLC_CENSUS_2010_CD                   VARCHAR2(5)  ;
  CORE_BASD_STSCL_AREA_NAME            VARCHAR2(5)  ;
  STD_ADDR_LINE_TEXT                   VARCHAR2(50) ;
  STD_CITY_NAME                        VARCHAR2(28) ;
  STD_STATE_CD                         VARCHAR2(2)  ;
  STD_BASC_ZIP_CD                      VARCHAR2(5)  ;
  CNTY_CENSUS_2010_NAME                VARCHAR2(25) ;
  CNTY_SUB_DIVN_CURR_NAME              VARCHAR2(40) ;
  PLC_CENSUS_2010_NAME                 VARCHAR2(40) ;
  CORE_BASD_STSCL_AREA_CD              VARCHAR2(75) ;
  C1PGCR_CD                            VARCHAR2(1)  ;
  C1PPRB_CD                            VARCHAR2(1)  ;
  MSGUSPS_TEXT                         VARCHAR2(60) ;
  CENSUS_2010_RTRN_CD                  VARCHAR2(1);
BEGIN

DBMS_OUTPUT.NEW_LINE();
DBMS_OUTPUT.NEW_LINE();
DBMS_OUTPUT.PUT_LINE('results for get_records: ' || q'[disasterid equiv to '4272,1791', results => returnVal]');
DBMS_OUTPUT.NEW_LINE();
fema_data.get_records(disasterid => '4272,1791', localevalues => NULL, results => returnVal);
dbms_output.put_line( 'DSTER_ID' || '   ' ||
                       'DSTER_TYPE_CD' || '   ' ||
                       'APPLT_LAST_NAME' || '   ' ||
                       'APPLT_FIRST_NAME' || '   ' ||
                       'CPLCNT_FIRST_NAME' || '   ' ||
                       'CPLCNT_LAST_NAME' || '   ' ||
                       'APPLT_SSN_ID' || '   ' ||
                       'PHN_AREA_NUM' || '   ' ||
                       'PHN_NUM' || '   ' ||
                       'ALTNT_PHN_AREA_NUM' || '   ' ||
                       'ALTNT_PHN_NUM' || '   ' ||
                       'DMGE_ADDR_LINE_TEXT' || '   ' ||
                       'DMGE_CITY_NAME' || '   ' ||
                       'DMGE_STATE_CD' || '   ' ||
                       'DMGE_BASC_ZIP_CD' || '   ' ||
                       'DMGE_ZIP_EXTN_CD' || '   ' ||
                       'CNTY_NAME');
LOOP
FETCH returnVal
INTO REC_ID, FEMA_RGSTN_ID, DSTER_ID, HSHD_SIZE_CNT, BEDRM_CNT, RENT_AMNT, PHN_NUM, ALTNT_PHN_NUM, CURR_MAILG_ADDR_TEXT, CURR_MAILG_CITY_NAME, CURR_MAILG_STATE_CD, CURR_MAILG_ZIP_CD, APPLT_MAIL_ZIP_EXTN_CD, APPLT_DWLNG_TYPE_CD, DMGE_ADDR_LINE_TEXT, DMGE_CITY_NAME, DMGE_STATE_CD, DMGE_BASC_ZIP_CD, DMGE_ZIP_EXTN_CD, DMGE_PHN_NUM, RSDN_OWND_CD, HSHD_DATA_TRANS_ID, REC_DT, DSTER_TYPE_CD, DPNDNT_CNT, INCM_AMNT, PHN_AREA_NUM, ALTNT_PHN_AREA_NUM, CNTY_NAME, INSNC_CD, HZRD_INSNC_INDR, HZRD_INSNC_CMPNY_NAME, HZRD_INSNC_AMNT, FLOOD_INSNC_INDR, FLOOD_INSNC_AMNT, OTHER_INSNC_INDR, OTHER_INSNC_AMNT, FEMA_INSPN_TEXT, SNGLE_FMLY_INDR, MF_INDR, REAL_PROP_LOSS_AMNT, DSTRYD_INDR, WTR_LVL_VLUE, WTR_LVL_BASEMT_VLUE, HIGH_WTR_LOC_CD, FLOOD_INDR, FLOOD_DMGE_AMNT, FNDTN_DMGE_INDR, FNDTN_DMGE_AMNT, ROOF_DMGE_INDR, ROOF_DMGE_AMNT, TMP_SHLTR_ELGB_INDR, TMP_SHLTR_RCVD_AMNT, MBL_HME_INDR, MBL_HME_DT, MBL_HME_LOC_CD, RENT_ASSTN_RCVD_INDR, RENT_ASSTN_AMNT, RENT_ASSTN_INELGB_TEXT, REPR_RCVD_INDR, REPR_AMNT, REPR_INELGB_TEXT, RPMT_RCVD_INDR, RPMT_AMNT, RPMT_INELGB_TEXT, SBA_ELGB_INDR, SBA_RCVD_AMNT, PRSNL_PROP_ASSTN_INDR, PRSNL_PROP_ASSTN_AMNT, OTHER_ASSTN_INDR, OTHER_ASSTN_AMNT, URGNT_REPR_RQRD_INDR, RENTAL_ASSTN_END_DT, RENTAL_ASSTN_ADDR_LINE_TEXT, RENTAL_ASSTN_CITY_NAME, RENTAL_ASSTN_STATE_CD, RENTAL_ASSTN_ZIP_CD, TOTAL_DMGE_AMNT, TOTAL_ASSTN_AMNT, HUD_UNMT_NEED_AMNT, HUD_ASSTD_INDR, HUD_PGM_CD, APPLT_SSN_ID, APPLT_FIRST_NAME, APPLT_LAST_NAME, APPLT_MIDL_NAME, APPLT_DOB_DT, SPCL_NEEDS_INDR, APPLT_CTZN_INDR, PGM_SOURCE_CD, CPLCNT_FIRST_NAME, CPLCNT_LAST_NAME, LAT_DGREE_MSRE, LGT_DGREE_MSRE, FCD_FIPS_91_CD, STATE_CENSUS_2010_CD, CNTY_CENSUS_2010_CD, TRACT_CENSUS_2010_CD, BLK_GRP_CENSUS_2010_CD, PLC_CENSUS_2010_CD, CORE_BASD_STSCL_AREA_NAME, STD_ADDR_LINE_TEXT, STD_CITY_NAME, STD_STATE_CD, STD_BASC_ZIP_CD, CNTY_CENSUS_2010_NAME, CNTY_SUB_DIVN_CURR_NAME, PLC_CENSUS_2010_NAME, CORE_BASD_STSCL_AREA_CD, C1PGCR_CD, C1PPRB_CD, MSGUSPS_TEXT, CENSUS_2010_RTRN_CD;
EXIT WHEN returnVal%NOTFOUND;
  dbms_output.put_line(DSTER_ID || '   ' ||
                        DSTER_TYPE_CD || '   ' ||
                        APPLT_LAST_NAME || '   ' ||
                        APPLT_FIRST_NAME || '   ' ||
                        CPLCNT_FIRST_NAME || '   ' ||
                        CPLCNT_LAST_NAME || '   ' ||
                        APPLT_SSN_ID || '   ' ||
                        FEMA_RGSTN_ID || '   ' ||
                        CURR_MAILG_ADDR_TEXT || '   ' ||
                        CURR_MAILG_CITY_NAME || '   ' ||
                        CURR_MAILG_STATE_CD || '   ' ||
                        CURR_MAILG_ZIP_CD || '   ' ||
                        PHN_AREA_NUM || '   ' ||
                        PHN_NUM || '   ' ||
                        ALTNT_PHN_AREA_NUM || '   ' ||
                        ALTNT_PHN_NUM || '   ' ||
                        DMGE_ADDR_LINE_TEXT || '   ' ||
                        DMGE_CITY_NAME || '   ' ||
                        DMGE_STATE_CD || '   ' ||
                        DMGE_BASC_ZIP_CD || '   ' ||
                        DMGE_ZIP_EXTN_CD || '   ' ||
                        CNTY_NAME);
END LOOP;

DBMS_OUTPUT.NEW_LINE();
DBMS_OUTPUT.NEW_LINE();
DBMS_OUTPUT.NEW_LINE();
DBMS_OUTPUT.NEW_LINE();
DBMS_OUTPUT.NEW_LINE();
DBMS_OUTPUT.NEW_LINE();
DBMS_OUTPUT.NEW_LINE();
DBMS_OUTPUT.NEW_LINE();
DBMS_OUTPUT.NEW_LINE();
DBMS_OUTPUT.NEW_LINE();
DBMS_OUTPUT.PUT_LINE('results for get_records: ' || q'[having no disasterid value is equiv to 'ALL', stateid => 'WI', localetype => 'county',   localevalues is equiv to 'Dane (County)']');
DBMS_OUTPUT.NEW_LINE();
fema_data.get_records(stateid => 'WI', localetype => 'county',  disasterid => NULL, localevalues => 'Dane (County)', results => returnVal);
dbms_output.put_line( 'DSTER_ID' || '   ' ||
                       'DSTER_TYPE_CD' || '   ' ||
                       'APPLT_LAST_NAME' || '   ' ||
                       'APPLT_FIRST_NAME' || '   ' ||
                       'CPLCNT_FIRST_NAME' || '   ' ||
                       'CPLCNT_LAST_NAME' || '   ' ||
                       'APPLT_SSN_ID' || '   ' ||
                       'PHN_AREA_NUM' || '   ' ||
                       'PHN_NUM' || '   ' ||
                       'ALTNT_PHN_AREA_NUM' || '   ' ||
                       'ALTNT_PHN_NUM' || '   ' ||
                       'DMGE_ADDR_LINE_TEXT' || '   ' ||
                       'DMGE_CITY_NAME' || '   ' ||
                       'DMGE_STATE_CD' || '   ' ||
                       'DMGE_BASC_ZIP_CD' || '   ' ||
                       'DMGE_ZIP_EXTN_CD' || '   ' ||
                       'CNTY_NAME');
LOOP
FETCH returnVal
INTO REC_ID, FEMA_RGSTN_ID, DSTER_ID, HSHD_SIZE_CNT, BEDRM_CNT, RENT_AMNT, PHN_NUM, ALTNT_PHN_NUM, CURR_MAILG_ADDR_TEXT, CURR_MAILG_CITY_NAME, CURR_MAILG_STATE_CD, CURR_MAILG_ZIP_CD, APPLT_MAIL_ZIP_EXTN_CD, APPLT_DWLNG_TYPE_CD, DMGE_ADDR_LINE_TEXT, DMGE_CITY_NAME, DMGE_STATE_CD, DMGE_BASC_ZIP_CD, DMGE_ZIP_EXTN_CD, DMGE_PHN_NUM, RSDN_OWND_CD, HSHD_DATA_TRANS_ID, REC_DT, DSTER_TYPE_CD, DPNDNT_CNT, INCM_AMNT, PHN_AREA_NUM, ALTNT_PHN_AREA_NUM, CNTY_NAME, INSNC_CD, HZRD_INSNC_INDR, HZRD_INSNC_CMPNY_NAME, HZRD_INSNC_AMNT, FLOOD_INSNC_INDR, FLOOD_INSNC_AMNT, OTHER_INSNC_INDR, OTHER_INSNC_AMNT, FEMA_INSPN_TEXT, SNGLE_FMLY_INDR, MF_INDR, REAL_PROP_LOSS_AMNT, DSTRYD_INDR, WTR_LVL_VLUE, WTR_LVL_BASEMT_VLUE, HIGH_WTR_LOC_CD, FLOOD_INDR, FLOOD_DMGE_AMNT, FNDTN_DMGE_INDR, FNDTN_DMGE_AMNT, ROOF_DMGE_INDR, ROOF_DMGE_AMNT, TMP_SHLTR_ELGB_INDR, TMP_SHLTR_RCVD_AMNT, MBL_HME_INDR, MBL_HME_DT, MBL_HME_LOC_CD, RENT_ASSTN_RCVD_INDR, RENT_ASSTN_AMNT, RENT_ASSTN_INELGB_TEXT, REPR_RCVD_INDR, REPR_AMNT, REPR_INELGB_TEXT, RPMT_RCVD_INDR, RPMT_AMNT, RPMT_INELGB_TEXT, SBA_ELGB_INDR, SBA_RCVD_AMNT, PRSNL_PROP_ASSTN_INDR, PRSNL_PROP_ASSTN_AMNT, OTHER_ASSTN_INDR, OTHER_ASSTN_AMNT, URGNT_REPR_RQRD_INDR, RENTAL_ASSTN_END_DT, RENTAL_ASSTN_ADDR_LINE_TEXT, RENTAL_ASSTN_CITY_NAME, RENTAL_ASSTN_STATE_CD, RENTAL_ASSTN_ZIP_CD, TOTAL_DMGE_AMNT, TOTAL_ASSTN_AMNT, HUD_UNMT_NEED_AMNT, HUD_ASSTD_INDR, HUD_PGM_CD, APPLT_SSN_ID, APPLT_FIRST_NAME, APPLT_LAST_NAME, APPLT_MIDL_NAME, APPLT_DOB_DT, SPCL_NEEDS_INDR, APPLT_CTZN_INDR, PGM_SOURCE_CD, CPLCNT_FIRST_NAME, CPLCNT_LAST_NAME, LAT_DGREE_MSRE, LGT_DGREE_MSRE, FCD_FIPS_91_CD, STATE_CENSUS_2010_CD, CNTY_CENSUS_2010_CD, TRACT_CENSUS_2010_CD, BLK_GRP_CENSUS_2010_CD, PLC_CENSUS_2010_CD, CORE_BASD_STSCL_AREA_NAME, STD_ADDR_LINE_TEXT, STD_CITY_NAME, STD_STATE_CD, STD_BASC_ZIP_CD, CNTY_CENSUS_2010_NAME, CNTY_SUB_DIVN_CURR_NAME, PLC_CENSUS_2010_NAME, CORE_BASD_STSCL_AREA_CD, C1PGCR_CD, C1PPRB_CD, MSGUSPS_TEXT, CENSUS_2010_RTRN_CD;
EXIT WHEN returnVal%NOTFOUND;
  dbms_output.put_line(DSTER_ID || '   ' ||
                        DSTER_TYPE_CD || '   ' ||
                        APPLT_LAST_NAME || '   ' ||
                        APPLT_FIRST_NAME || '   ' ||
                        CPLCNT_FIRST_NAME || '   ' ||
                        CPLCNT_LAST_NAME || '   ' ||
                        APPLT_SSN_ID || '   ' ||
                        FEMA_RGSTN_ID || '   ' ||
                        CURR_MAILG_ADDR_TEXT || '   ' ||
                        CURR_MAILG_CITY_NAME || '   ' ||
                        CURR_MAILG_STATE_CD || '   ' ||
                        CURR_MAILG_ZIP_CD || '   ' ||
                        PHN_AREA_NUM || '   ' ||
                        PHN_NUM || '   ' ||
                        ALTNT_PHN_AREA_NUM || '   ' ||
                        ALTNT_PHN_NUM || '   ' ||
                        DMGE_ADDR_LINE_TEXT || '   ' ||
                        DMGE_CITY_NAME || '   ' ||
                        DMGE_STATE_CD || '   ' ||
                        DMGE_BASC_ZIP_CD || '   ' ||
                        DMGE_ZIP_EXTN_CD || '   ' ||
                        CNTY_NAME);
END LOOP;

DBMS_OUTPUT.NEW_LINE();
DBMS_OUTPUT.NEW_LINE();
DBMS_OUTPUT.NEW_LINE();
DBMS_OUTPUT.NEW_LINE();
DBMS_OUTPUT.NEW_LINE();
DBMS_OUTPUT.NEW_LINE();
DBMS_OUTPUT.NEW_LINE();
DBMS_OUTPUT.NEW_LINE();
DBMS_OUTPUT.NEW_LINE();
DBMS_OUTPUT.NEW_LINE();
DBMS_OUTPUT.PUT_LINE('results for get_records: ' || q'[ having no disasterid value is equiv to 'ALL', localetype => 'city',   localevalues is equiv to 'Madison,Cedar Rapids']');
DBMS_OUTPUT.NEW_LINE();
fema_data.get_records(localetype => 'city', disasterid => NULL, localevalues => 'Madison,Cedar Rapids', results => returnVal);
dbms_output.put_line( 'DSTER_ID' || '   ' ||
                       'DSTER_TYPE_CD' || '   ' ||
                       'APPLT_LAST_NAME' || '   ' ||
                       'APPLT_FIRST_NAME' || '   ' ||
                       'CPLCNT_FIRST_NAME' || '   ' ||
                       'CPLCNT_LAST_NAME' || '   ' ||
                       'APPLT_SSN_ID' || '   ' ||
                       'PHN_AREA_NUM' || '   ' ||
                       'PHN_NUM' || '   ' ||
                       'ALTNT_PHN_AREA_NUM' || '   ' ||
                       'ALTNT_PHN_NUM' || '   ' ||
                       'DMGE_ADDR_LINE_TEXT' || '   ' ||
                       'DMGE_CITY_NAME' || '   ' ||
                       'DMGE_STATE_CD' || '   ' ||
                       'DMGE_BASC_ZIP_CD' || '   ' ||
                       'DMGE_ZIP_EXTN_CD' || '   ' ||
                       'CNTY_NAME');
LOOP
FETCH returnVal
INTO REC_ID, FEMA_RGSTN_ID, DSTER_ID, HSHD_SIZE_CNT, BEDRM_CNT, RENT_AMNT, PHN_NUM, ALTNT_PHN_NUM, CURR_MAILG_ADDR_TEXT, CURR_MAILG_CITY_NAME, CURR_MAILG_STATE_CD, CURR_MAILG_ZIP_CD, APPLT_MAIL_ZIP_EXTN_CD, APPLT_DWLNG_TYPE_CD, DMGE_ADDR_LINE_TEXT, DMGE_CITY_NAME, DMGE_STATE_CD, DMGE_BASC_ZIP_CD, DMGE_ZIP_EXTN_CD, DMGE_PHN_NUM, RSDN_OWND_CD, HSHD_DATA_TRANS_ID, REC_DT, DSTER_TYPE_CD, DPNDNT_CNT, INCM_AMNT, PHN_AREA_NUM, ALTNT_PHN_AREA_NUM, CNTY_NAME, INSNC_CD, HZRD_INSNC_INDR, HZRD_INSNC_CMPNY_NAME, HZRD_INSNC_AMNT, FLOOD_INSNC_INDR, FLOOD_INSNC_AMNT, OTHER_INSNC_INDR, OTHER_INSNC_AMNT, FEMA_INSPN_TEXT, SNGLE_FMLY_INDR, MF_INDR, REAL_PROP_LOSS_AMNT, DSTRYD_INDR, WTR_LVL_VLUE, WTR_LVL_BASEMT_VLUE, HIGH_WTR_LOC_CD, FLOOD_INDR, FLOOD_DMGE_AMNT, FNDTN_DMGE_INDR, FNDTN_DMGE_AMNT, ROOF_DMGE_INDR, ROOF_DMGE_AMNT, TMP_SHLTR_ELGB_INDR, TMP_SHLTR_RCVD_AMNT, MBL_HME_INDR, MBL_HME_DT, MBL_HME_LOC_CD, RENT_ASSTN_RCVD_INDR, RENT_ASSTN_AMNT, RENT_ASSTN_INELGB_TEXT, REPR_RCVD_INDR, REPR_AMNT, REPR_INELGB_TEXT, RPMT_RCVD_INDR, RPMT_AMNT, RPMT_INELGB_TEXT, SBA_ELGB_INDR, SBA_RCVD_AMNT, PRSNL_PROP_ASSTN_INDR, PRSNL_PROP_ASSTN_AMNT, OTHER_ASSTN_INDR, OTHER_ASSTN_AMNT, URGNT_REPR_RQRD_INDR, RENTAL_ASSTN_END_DT, RENTAL_ASSTN_ADDR_LINE_TEXT, RENTAL_ASSTN_CITY_NAME, RENTAL_ASSTN_STATE_CD, RENTAL_ASSTN_ZIP_CD, TOTAL_DMGE_AMNT, TOTAL_ASSTN_AMNT, HUD_UNMT_NEED_AMNT, HUD_ASSTD_INDR, HUD_PGM_CD, APPLT_SSN_ID, APPLT_FIRST_NAME, APPLT_LAST_NAME, APPLT_MIDL_NAME, APPLT_DOB_DT, SPCL_NEEDS_INDR, APPLT_CTZN_INDR, PGM_SOURCE_CD, CPLCNT_FIRST_NAME, CPLCNT_LAST_NAME, LAT_DGREE_MSRE, LGT_DGREE_MSRE, FCD_FIPS_91_CD, STATE_CENSUS_2010_CD, CNTY_CENSUS_2010_CD, TRACT_CENSUS_2010_CD, BLK_GRP_CENSUS_2010_CD, PLC_CENSUS_2010_CD, CORE_BASD_STSCL_AREA_NAME, STD_ADDR_LINE_TEXT, STD_CITY_NAME, STD_STATE_CD, STD_BASC_ZIP_CD, CNTY_CENSUS_2010_NAME, CNTY_SUB_DIVN_CURR_NAME, PLC_CENSUS_2010_NAME, CORE_BASD_STSCL_AREA_CD, C1PGCR_CD, C1PPRB_CD, MSGUSPS_TEXT, CENSUS_2010_RTRN_CD;
EXIT WHEN returnVal%NOTFOUND;
  dbms_output.put_line(DSTER_ID || '   ' ||
                        DSTER_TYPE_CD || '   ' ||
                        APPLT_LAST_NAME || '   ' ||
                        APPLT_FIRST_NAME || '   ' ||
                        CPLCNT_FIRST_NAME || '   ' ||
                        CPLCNT_LAST_NAME || '   ' ||
                        APPLT_SSN_ID || '   ' ||
                        FEMA_RGSTN_ID || '   ' ||
                        CURR_MAILG_ADDR_TEXT || '   ' ||
                        CURR_MAILG_CITY_NAME || '   ' ||
                        CURR_MAILG_STATE_CD || '   ' ||
                        CURR_MAILG_ZIP_CD || '   ' ||
                        PHN_AREA_NUM || '   ' ||
                        PHN_NUM || '   ' ||
                        ALTNT_PHN_AREA_NUM || '   ' ||
                        ALTNT_PHN_NUM || '   ' ||
                        DMGE_ADDR_LINE_TEXT || '   ' ||
                        DMGE_CITY_NAME || '   ' ||
                        DMGE_STATE_CD || '   ' ||
                        DMGE_BASC_ZIP_CD || '   ' ||
                        DMGE_ZIP_EXTN_CD || '   ' ||
                        CNTY_NAME);
END LOOP;
--  disasterList := nbrParameterArray();
--  localevaluesList := charParameterArray('77002','77493');
--  DBMS_OUTPUT.NEW_LINE();
--  DBMS_OUTPUT.NEW_LINE();
--  DBMS_OUTPUT.PUT_LINE('results for get_records: ' || q'[having no disasterid value is equiv to 'ALL', stateid => 'TX', localetype => 'zipcode',   localevalues is equiv to '77002,77493']');
--  DBMS_OUTPUT.NEW_LINE();
--  fema_data.get_records(stateid => 'TX', localetype => 'zipcode',  disasterid => disasterList, localevalues => localevaluesList, results => returnVal);
--
--

DBMS_OUTPUT.NEW_LINE();
DBMS_OUTPUT.NEW_LINE();
DBMS_OUTPUT.NEW_LINE();
DBMS_OUTPUT.NEW_LINE();
DBMS_OUTPUT.NEW_LINE();
DBMS_OUTPUT.NEW_LINE();
DBMS_OUTPUT.NEW_LINE();
DBMS_OUTPUT.NEW_LINE();
DBMS_OUTPUT.NEW_LINE();
DBMS_OUTPUT.NEW_LINE();
DBMS_OUTPUT.PUT_LINE('results for get_records: ' || q'[having no disasterid value is equiv to 'ALL', stateid => 'TX', localetype => 'zipcode',   localevalues is equiv to '77002,77493']');
DBMS_OUTPUT.NEW_LINE();
fema_data.get_records(stateid => 'TX', localetype => 'zipcode',  disasterid => NULL, localevalues => '77002,77493', results => returnVal);
dbms_output.put_line( 'DSTER_ID' || '   ' ||
                       'DSTER_TYPE_CD' || '   ' ||
                       'APPLT_LAST_NAME' || '   ' ||
                       'APPLT_FIRST_NAME' || '   ' ||
                       'CPLCNT_FIRST_NAME' || '   ' ||
                       'CPLCNT_LAST_NAME' || '   ' ||
                       'APPLT_SSN_ID' || '   ' ||
                       'PHN_AREA_NUM' || '   ' ||
                       'PHN_NUM' || '   ' ||
                       'ALTNT_PHN_AREA_NUM' || '   ' ||
                       'ALTNT_PHN_NUM' || '   ' ||
                       'DMGE_ADDR_LINE_TEXT' || '   ' ||
                       'DMGE_CITY_NAME' || '   ' ||
                       'DMGE_STATE_CD' || '   ' ||
                       'DMGE_BASC_ZIP_CD' || '   ' ||
                       'DMGE_ZIP_EXTN_CD' || '   ' ||
                       'CNTY_NAME');
LOOP
FETCH returnVal
INTO REC_ID, FEMA_RGSTN_ID, DSTER_ID, HSHD_SIZE_CNT, BEDRM_CNT, RENT_AMNT, PHN_NUM, ALTNT_PHN_NUM, CURR_MAILG_ADDR_TEXT, CURR_MAILG_CITY_NAME, CURR_MAILG_STATE_CD, CURR_MAILG_ZIP_CD, APPLT_MAIL_ZIP_EXTN_CD, APPLT_DWLNG_TYPE_CD, DMGE_ADDR_LINE_TEXT, DMGE_CITY_NAME, DMGE_STATE_CD, DMGE_BASC_ZIP_CD, DMGE_ZIP_EXTN_CD, DMGE_PHN_NUM, RSDN_OWND_CD, HSHD_DATA_TRANS_ID, REC_DT, DSTER_TYPE_CD, DPNDNT_CNT, INCM_AMNT, PHN_AREA_NUM, ALTNT_PHN_AREA_NUM, CNTY_NAME, INSNC_CD, HZRD_INSNC_INDR, HZRD_INSNC_CMPNY_NAME, HZRD_INSNC_AMNT, FLOOD_INSNC_INDR, FLOOD_INSNC_AMNT, OTHER_INSNC_INDR, OTHER_INSNC_AMNT, FEMA_INSPN_TEXT, SNGLE_FMLY_INDR, MF_INDR, REAL_PROP_LOSS_AMNT, DSTRYD_INDR, WTR_LVL_VLUE, WTR_LVL_BASEMT_VLUE, HIGH_WTR_LOC_CD, FLOOD_INDR, FLOOD_DMGE_AMNT, FNDTN_DMGE_INDR, FNDTN_DMGE_AMNT, ROOF_DMGE_INDR, ROOF_DMGE_AMNT, TMP_SHLTR_ELGB_INDR, TMP_SHLTR_RCVD_AMNT, MBL_HME_INDR, MBL_HME_DT, MBL_HME_LOC_CD, RENT_ASSTN_RCVD_INDR, RENT_ASSTN_AMNT, RENT_ASSTN_INELGB_TEXT, REPR_RCVD_INDR, REPR_AMNT, REPR_INELGB_TEXT, RPMT_RCVD_INDR, RPMT_AMNT, RPMT_INELGB_TEXT, SBA_ELGB_INDR, SBA_RCVD_AMNT, PRSNL_PROP_ASSTN_INDR, PRSNL_PROP_ASSTN_AMNT, OTHER_ASSTN_INDR, OTHER_ASSTN_AMNT, URGNT_REPR_RQRD_INDR, RENTAL_ASSTN_END_DT, RENTAL_ASSTN_ADDR_LINE_TEXT, RENTAL_ASSTN_CITY_NAME, RENTAL_ASSTN_STATE_CD, RENTAL_ASSTN_ZIP_CD, TOTAL_DMGE_AMNT, TOTAL_ASSTN_AMNT, HUD_UNMT_NEED_AMNT, HUD_ASSTD_INDR, HUD_PGM_CD, APPLT_SSN_ID, APPLT_FIRST_NAME, APPLT_LAST_NAME, APPLT_MIDL_NAME, APPLT_DOB_DT, SPCL_NEEDS_INDR, APPLT_CTZN_INDR, PGM_SOURCE_CD, CPLCNT_FIRST_NAME, CPLCNT_LAST_NAME, LAT_DGREE_MSRE, LGT_DGREE_MSRE, FCD_FIPS_91_CD, STATE_CENSUS_2010_CD, CNTY_CENSUS_2010_CD, TRACT_CENSUS_2010_CD, BLK_GRP_CENSUS_2010_CD, PLC_CENSUS_2010_CD, CORE_BASD_STSCL_AREA_NAME, STD_ADDR_LINE_TEXT, STD_CITY_NAME, STD_STATE_CD, STD_BASC_ZIP_CD, CNTY_CENSUS_2010_NAME, CNTY_SUB_DIVN_CURR_NAME, PLC_CENSUS_2010_NAME, CORE_BASD_STSCL_AREA_CD, C1PGCR_CD, C1PPRB_CD, MSGUSPS_TEXT, CENSUS_2010_RTRN_CD;
EXIT WHEN returnVal%NOTFOUND;
  dbms_output.put_line(DSTER_ID || '   ' ||
                        DSTER_TYPE_CD || '   ' ||
                        APPLT_LAST_NAME || '   ' ||
                        APPLT_FIRST_NAME || '   ' ||
                        CPLCNT_FIRST_NAME || '   ' ||
                        CPLCNT_LAST_NAME || '   ' ||
                        APPLT_SSN_ID || '   ' ||
                        FEMA_RGSTN_ID || '   ' ||
                        CURR_MAILG_ADDR_TEXT || '   ' ||
                        CURR_MAILG_CITY_NAME || '   ' ||
                        CURR_MAILG_STATE_CD || '   ' ||
                        CURR_MAILG_ZIP_CD || '   ' ||
                        PHN_AREA_NUM || '   ' ||
                        PHN_NUM || '   ' ||
                        ALTNT_PHN_AREA_NUM || '   ' ||
                        ALTNT_PHN_NUM || '   ' ||
                        DMGE_ADDR_LINE_TEXT || '   ' ||
                        DMGE_CITY_NAME || '   ' ||
                        DMGE_STATE_CD || '   ' ||
                        DMGE_BASC_ZIP_CD || '   ' ||
                        DMGE_ZIP_EXTN_CD || '   ' ||
                        CNTY_NAME);
END LOOP;
--  disasterList := nbrParameterArray();
--  localevaluesList := charParameterArray('Des Moines','Cedar Rapids');
--  DBMS_OUTPUT.NEW_LINE();
--  DBMS_OUTPUT.NEW_LINE();
--  DBMS_OUTPUT.PUT_LINE('results for get_records: ' || q'[having no disasterid value is equiv to 'ALL', localetype => 'township',   localevalues is equiv to 'Des Moines','Cedar Rapids']');
--  DBMS_OUTPUT.NEW_LINE();
--  fema_data.get_records(localetype => 'township',  disasterid => disasterList, localevalues => localevaluesList, results => returnVal);
--
DBMS_OUTPUT.NEW_LINE();
DBMS_OUTPUT.NEW_LINE();
DBMS_OUTPUT.NEW_LINE();
DBMS_OUTPUT.NEW_LINE();
DBMS_OUTPUT.NEW_LINE();
DBMS_OUTPUT.NEW_LINE();
DBMS_OUTPUT.NEW_LINE();
DBMS_OUTPUT.NEW_LINE();
DBMS_OUTPUT.NEW_LINE();
DBMS_OUTPUT.NEW_LINE();
DBMS_OUTPUT.PUT_LINE('results for get_records: ' || q'[having no disasterid value is equiv to 'ALL', localetype => 'township',   localevalues is equiv to 'Des Moines','Cedar Rapids']');
DBMS_OUTPUT.NEW_LINE();
fema_data.get_records(localetype => 'township',  disasterid => NULL, localevalues => 'Des Moines,Cedar Rapids', results => returnVal);
dbms_output.put_line( 'DSTER_ID' || '   ' ||
                       'DSTER_TYPE_CD' || '   ' ||
                       'APPLT_LAST_NAME' || '   ' ||
                       'APPLT_FIRST_NAME' || '   ' ||
                       'CPLCNT_FIRST_NAME' || '   ' ||
                       'CPLCNT_LAST_NAME' || '   ' ||
                       'APPLT_SSN_ID' || '   ' ||
                       'PHN_AREA_NUM' || '   ' ||
                       'PHN_NUM' || '   ' ||
                       'ALTNT_PHN_AREA_NUM' || '   ' ||
                       'ALTNT_PHN_NUM' || '   ' ||
                       'DMGE_ADDR_LINE_TEXT' || '   ' ||
                       'DMGE_CITY_NAME' || '   ' ||
                       'DMGE_STATE_CD' || '   ' ||
                       'DMGE_BASC_ZIP_CD' || '   ' ||
                       'DMGE_ZIP_EXTN_CD' || '   ' ||
                       'CNTY_NAME');
LOOP
FETCH returnVal
INTO REC_ID, FEMA_RGSTN_ID, DSTER_ID, HSHD_SIZE_CNT, BEDRM_CNT, RENT_AMNT, PHN_NUM, ALTNT_PHN_NUM, CURR_MAILG_ADDR_TEXT, CURR_MAILG_CITY_NAME, CURR_MAILG_STATE_CD, CURR_MAILG_ZIP_CD, APPLT_MAIL_ZIP_EXTN_CD, APPLT_DWLNG_TYPE_CD, DMGE_ADDR_LINE_TEXT, DMGE_CITY_NAME, DMGE_STATE_CD, DMGE_BASC_ZIP_CD, DMGE_ZIP_EXTN_CD, DMGE_PHN_NUM, RSDN_OWND_CD, HSHD_DATA_TRANS_ID, REC_DT, DSTER_TYPE_CD, DPNDNT_CNT, INCM_AMNT, PHN_AREA_NUM, ALTNT_PHN_AREA_NUM, CNTY_NAME, INSNC_CD, HZRD_INSNC_INDR, HZRD_INSNC_CMPNY_NAME, HZRD_INSNC_AMNT, FLOOD_INSNC_INDR, FLOOD_INSNC_AMNT, OTHER_INSNC_INDR, OTHER_INSNC_AMNT, FEMA_INSPN_TEXT, SNGLE_FMLY_INDR, MF_INDR, REAL_PROP_LOSS_AMNT, DSTRYD_INDR, WTR_LVL_VLUE, WTR_LVL_BASEMT_VLUE, HIGH_WTR_LOC_CD, FLOOD_INDR, FLOOD_DMGE_AMNT, FNDTN_DMGE_INDR, FNDTN_DMGE_AMNT, ROOF_DMGE_INDR, ROOF_DMGE_AMNT, TMP_SHLTR_ELGB_INDR, TMP_SHLTR_RCVD_AMNT, MBL_HME_INDR, MBL_HME_DT, MBL_HME_LOC_CD, RENT_ASSTN_RCVD_INDR, RENT_ASSTN_AMNT, RENT_ASSTN_INELGB_TEXT, REPR_RCVD_INDR, REPR_AMNT, REPR_INELGB_TEXT, RPMT_RCVD_INDR, RPMT_AMNT, RPMT_INELGB_TEXT, SBA_ELGB_INDR, SBA_RCVD_AMNT, PRSNL_PROP_ASSTN_INDR, PRSNL_PROP_ASSTN_AMNT, OTHER_ASSTN_INDR, OTHER_ASSTN_AMNT, URGNT_REPR_RQRD_INDR, RENTAL_ASSTN_END_DT, RENTAL_ASSTN_ADDR_LINE_TEXT, RENTAL_ASSTN_CITY_NAME, RENTAL_ASSTN_STATE_CD, RENTAL_ASSTN_ZIP_CD, TOTAL_DMGE_AMNT, TOTAL_ASSTN_AMNT, HUD_UNMT_NEED_AMNT, HUD_ASSTD_INDR, HUD_PGM_CD, APPLT_SSN_ID, APPLT_FIRST_NAME, APPLT_LAST_NAME, APPLT_MIDL_NAME, APPLT_DOB_DT, SPCL_NEEDS_INDR, APPLT_CTZN_INDR, PGM_SOURCE_CD, CPLCNT_FIRST_NAME, CPLCNT_LAST_NAME, LAT_DGREE_MSRE, LGT_DGREE_MSRE, FCD_FIPS_91_CD, STATE_CENSUS_2010_CD, CNTY_CENSUS_2010_CD, TRACT_CENSUS_2010_CD, BLK_GRP_CENSUS_2010_CD, PLC_CENSUS_2010_CD, CORE_BASD_STSCL_AREA_NAME, STD_ADDR_LINE_TEXT, STD_CITY_NAME, STD_STATE_CD, STD_BASC_ZIP_CD, CNTY_CENSUS_2010_NAME, CNTY_SUB_DIVN_CURR_NAME, PLC_CENSUS_2010_NAME, CORE_BASD_STSCL_AREA_CD, C1PGCR_CD, C1PPRB_CD, MSGUSPS_TEXT, CENSUS_2010_RTRN_CD;
EXIT WHEN returnVal%NOTFOUND;
  dbms_output.put_line(DSTER_ID || '   ' ||
                        DSTER_TYPE_CD || '   ' ||
                        APPLT_LAST_NAME || '   ' ||
                        APPLT_FIRST_NAME || '   ' ||
                        CPLCNT_FIRST_NAME || '   ' ||
                        CPLCNT_LAST_NAME || '   ' ||
                        APPLT_SSN_ID || '   ' ||
                        FEMA_RGSTN_ID || '   ' ||
                        CURR_MAILG_ADDR_TEXT || '   ' ||
                        CURR_MAILG_CITY_NAME || '   ' ||
                        CURR_MAILG_STATE_CD || '   ' ||
                        CURR_MAILG_ZIP_CD || '   ' ||
                        PHN_AREA_NUM || '   ' ||
                        PHN_NUM || '   ' ||
                        ALTNT_PHN_AREA_NUM || '   ' ||
                        ALTNT_PHN_NUM || '   ' ||
                        DMGE_ADDR_LINE_TEXT || '   ' ||
                        DMGE_CITY_NAME || '   ' ||
                        DMGE_STATE_CD || '   ' ||
                        DMGE_BASC_ZIP_CD || '   ' ||
                        DMGE_ZIP_EXTN_CD || '   ' ||
                        CNTY_NAME);
END LOOP;


DBMS_OUTPUT.NEW_LINE();
DBMS_OUTPUT.NEW_LINE();
DBMS_OUTPUT.NEW_LINE();
DBMS_OUTPUT.NEW_LINE();
DBMS_OUTPUT.NEW_LINE();
DBMS_OUTPUT.NEW_LINE();
DBMS_OUTPUT.NEW_LINE();
DBMS_OUTPUT.NEW_LINE();
DBMS_OUTPUT.NEW_LINE();
DBMS_OUTPUT.NEW_LINE();
DBMS_OUTPUT.PUT_LINE('results for get_records: ' || q'[having no disasterid value is equiv to 'ALL', localetype => 'tract',   localevalues is equiv to '1100  ']');
DBMS_OUTPUT.NEW_LINE();
fema_data.get_records(localetype => 'tract',  disasterid => NULL, localevalues => '1100  ', results => returnVal);
dbms_output.put_line( 'DSTER_ID' || '   ' ||
                       'DSTER_TYPE_CD' || '   ' ||
                       'APPLT_LAST_NAME' || '   ' ||
                       'APPLT_FIRST_NAME' || '   ' ||
                       'CPLCNT_FIRST_NAME' || '   ' ||
                       'CPLCNT_LAST_NAME' || '   ' ||
                       'APPLT_SSN_ID' || '   ' ||
                       'PHN_AREA_NUM' || '   ' ||
                       'PHN_NUM' || '   ' ||
                       'ALTNT_PHN_AREA_NUM' || '   ' ||
                       'ALTNT_PHN_NUM' || '   ' ||
                       'DMGE_ADDR_LINE_TEXT' || '   ' ||
                       'DMGE_CITY_NAME' || '   ' ||
                       'DMGE_STATE_CD' || '   ' ||
                       'DMGE_BASC_ZIP_CD' || '   ' ||
                       'DMGE_ZIP_EXTN_CD' || '   ' ||
                       'CNTY_NAME');
LOOP
FETCH returnVal
INTO REC_ID, FEMA_RGSTN_ID, DSTER_ID, HSHD_SIZE_CNT, BEDRM_CNT, RENT_AMNT, PHN_NUM, ALTNT_PHN_NUM, CURR_MAILG_ADDR_TEXT, CURR_MAILG_CITY_NAME, CURR_MAILG_STATE_CD, CURR_MAILG_ZIP_CD, APPLT_MAIL_ZIP_EXTN_CD, APPLT_DWLNG_TYPE_CD, DMGE_ADDR_LINE_TEXT, DMGE_CITY_NAME, DMGE_STATE_CD, DMGE_BASC_ZIP_CD, DMGE_ZIP_EXTN_CD, DMGE_PHN_NUM, RSDN_OWND_CD, HSHD_DATA_TRANS_ID, REC_DT, DSTER_TYPE_CD, DPNDNT_CNT, INCM_AMNT, PHN_AREA_NUM, ALTNT_PHN_AREA_NUM, CNTY_NAME, INSNC_CD, HZRD_INSNC_INDR, HZRD_INSNC_CMPNY_NAME, HZRD_INSNC_AMNT, FLOOD_INSNC_INDR, FLOOD_INSNC_AMNT, OTHER_INSNC_INDR, OTHER_INSNC_AMNT, FEMA_INSPN_TEXT, SNGLE_FMLY_INDR, MF_INDR, REAL_PROP_LOSS_AMNT, DSTRYD_INDR, WTR_LVL_VLUE, WTR_LVL_BASEMT_VLUE, HIGH_WTR_LOC_CD, FLOOD_INDR, FLOOD_DMGE_AMNT, FNDTN_DMGE_INDR, FNDTN_DMGE_AMNT, ROOF_DMGE_INDR, ROOF_DMGE_AMNT, TMP_SHLTR_ELGB_INDR, TMP_SHLTR_RCVD_AMNT, MBL_HME_INDR, MBL_HME_DT, MBL_HME_LOC_CD, RENT_ASSTN_RCVD_INDR, RENT_ASSTN_AMNT, RENT_ASSTN_INELGB_TEXT, REPR_RCVD_INDR, REPR_AMNT, REPR_INELGB_TEXT, RPMT_RCVD_INDR, RPMT_AMNT, RPMT_INELGB_TEXT, SBA_ELGB_INDR, SBA_RCVD_AMNT, PRSNL_PROP_ASSTN_INDR, PRSNL_PROP_ASSTN_AMNT, OTHER_ASSTN_INDR, OTHER_ASSTN_AMNT, URGNT_REPR_RQRD_INDR, RENTAL_ASSTN_END_DT, RENTAL_ASSTN_ADDR_LINE_TEXT, RENTAL_ASSTN_CITY_NAME, RENTAL_ASSTN_STATE_CD, RENTAL_ASSTN_ZIP_CD, TOTAL_DMGE_AMNT, TOTAL_ASSTN_AMNT, HUD_UNMT_NEED_AMNT, HUD_ASSTD_INDR, HUD_PGM_CD, APPLT_SSN_ID, APPLT_FIRST_NAME, APPLT_LAST_NAME, APPLT_MIDL_NAME, APPLT_DOB_DT, SPCL_NEEDS_INDR, APPLT_CTZN_INDR, PGM_SOURCE_CD, CPLCNT_FIRST_NAME, CPLCNT_LAST_NAME, LAT_DGREE_MSRE, LGT_DGREE_MSRE, FCD_FIPS_91_CD, STATE_CENSUS_2010_CD, CNTY_CENSUS_2010_CD, TRACT_CENSUS_2010_CD, BLK_GRP_CENSUS_2010_CD, PLC_CENSUS_2010_CD, CORE_BASD_STSCL_AREA_NAME, STD_ADDR_LINE_TEXT, STD_CITY_NAME, STD_STATE_CD, STD_BASC_ZIP_CD, CNTY_CENSUS_2010_NAME, CNTY_SUB_DIVN_CURR_NAME, PLC_CENSUS_2010_NAME, CORE_BASD_STSCL_AREA_CD, C1PGCR_CD, C1PPRB_CD, MSGUSPS_TEXT, CENSUS_2010_RTRN_CD;
EXIT WHEN returnVal%NOTFOUND;
  dbms_output.put_line(DSTER_ID || '   ' ||
                        DSTER_TYPE_CD || '   ' ||
                        APPLT_LAST_NAME || '   ' ||
                        APPLT_FIRST_NAME || '   ' ||
                        CPLCNT_FIRST_NAME || '   ' ||
                        CPLCNT_LAST_NAME || '   ' ||
                        APPLT_SSN_ID || '   ' ||
                        FEMA_RGSTN_ID || '   ' ||
                        CURR_MAILG_ADDR_TEXT || '   ' ||
                        CURR_MAILG_CITY_NAME || '   ' ||
                        CURR_MAILG_STATE_CD || '   ' ||
                        CURR_MAILG_ZIP_CD || '   ' ||
                        PHN_AREA_NUM || '   ' ||
                        PHN_NUM || '   ' ||
                        ALTNT_PHN_AREA_NUM || '   ' ||
                        ALTNT_PHN_NUM || '   ' ||
                        DMGE_ADDR_LINE_TEXT || '   ' ||
                        DMGE_CITY_NAME || '   ' ||
                        DMGE_STATE_CD || '   ' ||
                        DMGE_BASC_ZIP_CD || '   ' ||
                        DMGE_ZIP_EXTN_CD || '   ' ||
                        CNTY_NAME);
END LOOP;

END;
/

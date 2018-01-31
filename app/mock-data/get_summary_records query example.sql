SET SERVEROUTPUT ON

DECLARE
    HSHD_SIZE_CNT         NUMBER(10);
    DPNDNT_CNT            NUMBER(13,2);
    INCM_AMNT             NUMBER(13,2);
    HZRD_INSNC_AMNT       NUMBER(13,2);
    FLOOD_INSNC_AMNT      NUMBER(13,2);
    OTHER_INSNC_AMNT      NUMBER(13,2);
    REAL_PROP_LOSS_AMNT   NUMBER(13,2);
    FLOOD_DMGE_AMNT       NUMBER(13,2);
    FNDTN_DMGE_AMNT       NUMBER(13,2);
    ROOF_DMGE_AMNT        NUMBER(13,2);
    TMP_SHLTR_RCVD_AMNT   NUMBER(13,2);
    RENT_ASSTN_AMNT       NUMBER(18,2);
    REPR_AMNT             NUMBER(18,2);
    RPMT_AMNT             NUMBER(13,2);
    SBA_RCVD_AMNT         NUMBER(13,2);
    PRSNL_PROP_ASSTN_AMNT NUMBER(13,2);
    OTHER_ASSTN_AMNT      NUMBER(13,2);
    TOTAL_DMGE_AMNT       NUMBER(13,2);
    TOTAL_ASSTN_AMNT      NUMBER(13,2);
    HUD_UNMT_NEED_AMNT    NUMBER(13,2);
    NUMBER_OF_RECORDS     NUMBER(10);

  returnVal SYS_REFCURSOR;

BEGIN

DBMS_OUTPUT.NEW_LINE();
DBMS_OUTPUT.NEW_LINE();
DBMS_OUTPUT.PUT_LINE('results for get_summary_records: ' || q'[stateid => 'TX', results => returnVal]');
DBMS_OUTPUT.NEW_LINE();
fema_data.get_summary_records(stateid => 'TX',  disasterid => NULL, localevalues => NULL, results => returnVal);
dbms_output.put_line('NUMBER_OF_RECORDS' || '    ' ||
                     'HSHD_SIZE_CNT' || '    ' ||
                     'DPNDNT_CNT' || '    ' ||
                     'INCM_AMNT' || '    ' ||
                     'HZRD_INSNC_AMNT' || '    ' ||
                     'FLOOD_INSNC_AMNT' || '    ' ||
                     'OTHER_INSNC_AMNT' || '    ' ||
                     'REAL_PROP_LOSS_AMNT' || '    ' ||
                     'FLOOD_DMGE_AMNT' || '    ' ||
                     'FNDTN_DMGE_AMNT' || '    ' ||
                     'ROOF_DMGE_AMNT' || '    ' ||
                     'TMP_SHLTR_RCVD_AMNT' || '    ' ||
                     'RENT_ASSTN_AMNT' || '    ' ||
                     'REPR_AMNT' || '    ' ||
                     'RPMT_AMNT' || '    ' ||
                     'SBA_RCVD_AMNT' || '    ' ||
                     'PRSNL_PROP_ASSTN_AMNT' || '    ' ||
                     'OTHER_ASSTN_AMNT' || '    ' ||
                     'TOTAL_DMGE_AMNT' || '    ' ||
                     'TOTAL_ASSTN_AMNT' || '    ' ||
                     'HUD_UNMT_NEED_AMNT');
LOOP
 FETCH returnVal
 INTO HSHD_SIZE_CNT,
      DPNDNT_CNT,
      INCM_AMNT,
      HZRD_INSNC_AMNT,
      FLOOD_INSNC_AMNT,
      OTHER_INSNC_AMNT,
      REAL_PROP_LOSS_AMNT,
      FLOOD_DMGE_AMNT,
      FNDTN_DMGE_AMNT,
      ROOF_DMGE_AMNT,
      TMP_SHLTR_RCVD_AMNT,
      RENT_ASSTN_AMNT,
      REPR_AMNT,
      RPMT_AMNT,
      SBA_RCVD_AMNT,
      PRSNL_PROP_ASSTN_AMNT,
      OTHER_ASSTN_AMNT,
      TOTAL_DMGE_AMNT,
      TOTAL_ASSTN_AMNT,
      HUD_UNMT_NEED_AMNT,
      NUMBER_OF_RECORDS ;
EXIT WHEN returnVal%NOTFOUND;

  dbms_output.put_line(HSHD_SIZE_CNT || '    ' ||
       DPNDNT_CNT || '    ' ||
       INCM_AMNT || '    ' ||
       HZRD_INSNC_AMNT || '    ' ||
       FLOOD_INSNC_AMNT || '    ' ||
       OTHER_INSNC_AMNT || '    ' ||
       REAL_PROP_LOSS_AMNT || '    ' ||
       FLOOD_DMGE_AMNT || '    ' ||
       FNDTN_DMGE_AMNT || '    ' ||
       ROOF_DMGE_AMNT || '    ' ||
       TMP_SHLTR_RCVD_AMNT || '    ' ||
       RENT_ASSTN_AMNT || '    ' ||
       REPR_AMNT || '    ' ||
       RPMT_AMNT || '    ' ||
       SBA_RCVD_AMNT || '    ' ||
       PRSNL_PROP_ASSTN_AMNT || '    ' ||
       OTHER_ASSTN_AMNT || '    ' ||
       TOTAL_DMGE_AMNT || '    ' ||
       TOTAL_ASSTN_AMNT || '    ' ||
       HUD_UNMT_NEED_AMNT || '    ' ||
       NUMBER_OF_RECORDS);
END LOOP;

DBMS_OUTPUT.NEW_LINE();
DBMS_OUTPUT.NEW_LINE();
DBMS_OUTPUT.PUT_LINE('results for get_summary_records: ' || q'[having no disasterid is equiv to saying all, stateid => 'WI', localetype => 'county',   localevalues equiv to 'Dane (County),Polk (County)', results => returnVal]');
DBMS_OUTPUT.NEW_LINE();
fema_data.get_summary_records(stateid => 'WI', localetype => 'county',  disasterid => NULL, localevalues => 'Dane (County),Polk (County)', results => returnVal);
dbms_output.put_line('NUMBER_OF_RECORDS' || '    ' ||
                     'TOTAL_DMGE_AMNT' || '    ' ||
                     'TOTAL_ASSTN_AMNT' || '    ' ||
                     'HUD_UNMT_NEED_AMNT' );
LOOP
 FETCH returnVal
 INTO HSHD_SIZE_CNT,
      DPNDNT_CNT,
      INCM_AMNT,
      HZRD_INSNC_AMNT,
      FLOOD_INSNC_AMNT,
      OTHER_INSNC_AMNT,
      REAL_PROP_LOSS_AMNT,
      FLOOD_DMGE_AMNT,
      FNDTN_DMGE_AMNT,
      ROOF_DMGE_AMNT,
      TMP_SHLTR_RCVD_AMNT,
      RENT_ASSTN_AMNT,
      REPR_AMNT,
      RPMT_AMNT,
      SBA_RCVD_AMNT,
      PRSNL_PROP_ASSTN_AMNT,
      OTHER_ASSTN_AMNT,
      TOTAL_DMGE_AMNT,
      TOTAL_ASSTN_AMNT,
      HUD_UNMT_NEED_AMNT,
      NUMBER_OF_RECORDS ;
EXIT WHEN returnVal%NOTFOUND;
   dbms_output.put_line(NUMBER_OF_RECORDS || '    ' ||
                        TOTAL_DMGE_AMNT || '    ' ||
                        TOTAL_ASSTN_AMNT || '    ' ||
                        HUD_UNMT_NEED_AMNT );
END LOOP;

DBMS_OUTPUT.NEW_LINE();
DBMS_OUTPUT.NEW_LINE();
DBMS_OUTPUT.PUT_LINE('results for get_summary_records: ' || q'[disasterid equiv to '4272,1791', results => returnVal]');
DBMS_OUTPUT.NEW_LINE();
fema_data.get_summary_records( disasterid => '4272,1791', localevalues => NULL, results => returnVal);
dbms_output.put_line('NUMBER_OF_RECORDS' || '    ' ||
                     'TOTAL_DMGE_AMNT' || '    ' ||
                     'TOTAL_ASSTN_AMNT' || '    ' ||
                     'HUD_UNMT_NEED_AMNT' );
LOOP
 FETCH returnVal
 INTO HSHD_SIZE_CNT,
      DPNDNT_CNT,
      INCM_AMNT,
      HZRD_INSNC_AMNT,
      FLOOD_INSNC_AMNT,
      OTHER_INSNC_AMNT,
      REAL_PROP_LOSS_AMNT,
      FLOOD_DMGE_AMNT,
      FNDTN_DMGE_AMNT,
      ROOF_DMGE_AMNT,
      TMP_SHLTR_RCVD_AMNT,
      RENT_ASSTN_AMNT,
      REPR_AMNT,
      RPMT_AMNT,
      SBA_RCVD_AMNT,
      PRSNL_PROP_ASSTN_AMNT,
      OTHER_ASSTN_AMNT,
      TOTAL_DMGE_AMNT,
      TOTAL_ASSTN_AMNT,
      HUD_UNMT_NEED_AMNT,
      NUMBER_OF_RECORDS ;
EXIT WHEN returnVal%NOTFOUND;
   dbms_output.put_line(NUMBER_OF_RECORDS || '    ' ||
                        TOTAL_DMGE_AMNT || '    ' ||
                        TOTAL_ASSTN_AMNT || '    ' ||
                        HUD_UNMT_NEED_AMNT );
END LOOP;


DBMS_OUTPUT.NEW_LINE();
DBMS_OUTPUT.NEW_LINE();
DBMS_OUTPUT.PUT_LINE('results for get_summary_records: ' || q'[having no disasterid is equiv to saying all, stateid => 'TX', localetype => 'zipcode',   localevalues equiv to '77002','77493', results => returnVal]');
DBMS_OUTPUT.NEW_LINE();
fema_data.get_summary_records(stateid => 'TX', localetype => 'zipcode',  disasterid => NULL, localevalues => '77002,77493', results => returnVal);
dbms_output.put_line('NUMBER_OF_RECORDS' || '    ' ||
                     'TOTAL_DMGE_AMNT' || '    ' ||
                     'TOTAL_ASSTN_AMNT' || '    ' ||
                     'HUD_UNMT_NEED_AMNT' );
LOOP
 FETCH returnVal
 INTO HSHD_SIZE_CNT,
      DPNDNT_CNT,
      INCM_AMNT,
      HZRD_INSNC_AMNT,
      FLOOD_INSNC_AMNT,
      OTHER_INSNC_AMNT,
      REAL_PROP_LOSS_AMNT,
      FLOOD_DMGE_AMNT,
      FNDTN_DMGE_AMNT,
      ROOF_DMGE_AMNT,
      TMP_SHLTR_RCVD_AMNT,
      RENT_ASSTN_AMNT,
      REPR_AMNT,
      RPMT_AMNT,
      SBA_RCVD_AMNT,
      PRSNL_PROP_ASSTN_AMNT,
      OTHER_ASSTN_AMNT,
      TOTAL_DMGE_AMNT,
      TOTAL_ASSTN_AMNT,
      HUD_UNMT_NEED_AMNT,
      NUMBER_OF_RECORDS ;
EXIT WHEN returnVal%NOTFOUND;
   dbms_output.put_line(NUMBER_OF_RECORDS || '    ' ||
                        TOTAL_DMGE_AMNT || '    ' ||
                        TOTAL_ASSTN_AMNT || '    ' ||
                        HUD_UNMT_NEED_AMNT );
END LOOP;

DBMS_OUTPUT.NEW_LINE();
DBMS_OUTPUT.NEW_LINE();
DBMS_OUTPUT.PUT_LINE('results for get_summary_records: ' || q'[having no disasterid is equiv to saying all, localetype => 'township',   localevalues equiv to 'Des Moines','Cedar Rapids', results => returnVal]');
DBMS_OUTPUT.NEW_LINE();
fema_data.get_summary_records(localetype => 'township',  disasterid => NULL, localevalues => 'Des Moines,Cedar Rapids', results => returnVal);
dbms_output.put_line('NUMBER_OF_RECORDS' || '    ' ||
                     'TOTAL_DMGE_AMNT' || '    ' ||
                     'TOTAL_ASSTN_AMNT' || '    ' ||
                     'HUD_UNMT_NEED_AMNT' );
LOOP
 FETCH returnVal
 INTO HSHD_SIZE_CNT,
      DPNDNT_CNT,
      INCM_AMNT,
      HZRD_INSNC_AMNT,
      FLOOD_INSNC_AMNT,
      OTHER_INSNC_AMNT,
      REAL_PROP_LOSS_AMNT,
      FLOOD_DMGE_AMNT,
      FNDTN_DMGE_AMNT,
      ROOF_DMGE_AMNT,
      TMP_SHLTR_RCVD_AMNT,
      RENT_ASSTN_AMNT,
      REPR_AMNT,
      RPMT_AMNT,
      SBA_RCVD_AMNT,
      PRSNL_PROP_ASSTN_AMNT,
      OTHER_ASSTN_AMNT,
      TOTAL_DMGE_AMNT,
      TOTAL_ASSTN_AMNT,
      HUD_UNMT_NEED_AMNT,
      NUMBER_OF_RECORDS ;
EXIT WHEN returnVal%NOTFOUND;
   dbms_output.put_line(NUMBER_OF_RECORDS || '    ' ||
                        TOTAL_DMGE_AMNT || '    ' ||
                        TOTAL_ASSTN_AMNT || '    ' ||
                        HUD_UNMT_NEED_AMNT );
END LOOP;

DBMS_OUTPUT.NEW_LINE();
DBMS_OUTPUT.NEW_LINE();
DBMS_OUTPUT.PUT_LINE('results for get_summary_records: ' || q'[having no disasterid is equiv to saying all, localetype => 'tract',   localevalues equiv to '1100  ', results => returnVal]');
DBMS_OUTPUT.NEW_LINE();
fema_data.get_summary_records(localetype => 'tract',  disasterid => NULL, localevalues => '1100  ', results => returnVal);
dbms_output.put_line('NUMBER_OF_RECORDS' || '    ' ||
                     'TOTAL_DMGE_AMNT' || '    ' ||
                     'TOTAL_ASSTN_AMNT' || '    ' ||
                     'HUD_UNMT_NEED_AMNT' );
LOOP
 FETCH returnVal
 INTO HSHD_SIZE_CNT,
      DPNDNT_CNT,
      INCM_AMNT,
      HZRD_INSNC_AMNT,
      FLOOD_INSNC_AMNT,
      OTHER_INSNC_AMNT,
      REAL_PROP_LOSS_AMNT,
      FLOOD_DMGE_AMNT,
      FNDTN_DMGE_AMNT,
      ROOF_DMGE_AMNT,
      TMP_SHLTR_RCVD_AMNT,
      RENT_ASSTN_AMNT,
      REPR_AMNT,
      RPMT_AMNT,
      SBA_RCVD_AMNT,
      PRSNL_PROP_ASSTN_AMNT,
      OTHER_ASSTN_AMNT,
      TOTAL_DMGE_AMNT,
      TOTAL_ASSTN_AMNT,
      HUD_UNMT_NEED_AMNT,
      NUMBER_OF_RECORDS ;
EXIT WHEN returnVal%NOTFOUND;
   dbms_output.put_line(NUMBER_OF_RECORDS || '    ' ||
                        TOTAL_DMGE_AMNT || '    ' ||
                        TOTAL_ASSTN_AMNT || '    ' ||
                        HUD_UNMT_NEED_AMNT );
END LOOP;

END;
/

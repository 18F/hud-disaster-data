SET SERVEROUTPUT ON

DECLARE
  returnVal recordArray;
  summaryReturnVal summaryArray;
  disasterList nbrParameterArray;
  localevaluesList charParameterArray;

BEGIN

disasterList := nbrParameterArray(4272, 1791);
localevaluesList := charParameterArray();
DBMS_OUTPUT.NEW_LINE();
DBMS_OUTPUT.NEW_LINE();
DBMS_OUTPUT.PUT_LINE('results for get_records: ' || q'[disasterid equiv to '4272,1791', results => returnVal]');
DBMS_OUTPUT.NEW_LINE();
fema_data.get_records(disasterid => disasterList, localevalues => localevaluesList, results => returnVal);
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
for i in 1 .. returnVal.count loop
  dbms_output.put_line(returnVal(i).DSTER_ID || '   ' ||
                        returnVal(i).DSTER_TYPE_CD || '   ' ||
                        returnVal(i).APPLT_LAST_NAME || '   ' ||
                        returnVal(i).APPLT_FIRST_NAME || '   ' ||
                        returnVal(i).CPLCNT_FIRST_NAME || '   ' ||
                        returnVal(i).CPLCNT_LAST_NAME || '   ' ||
                        returnVal(i).APPLT_SSN_ID || '   ' ||
                        returnVal(i).FEMA_RGSTN_ID || '   ' ||
                        returnVal(i).CURR_MAILG_ADDR_TEXT || '   ' ||
                        returnVal(i).CURR_MAILG_CITY_NAME || '   ' ||
                        returnVal(i).CURR_MAILG_STATE_CD || '   ' ||
                        returnVal(i).CURR_MAILG_ZIP_CD || '   ' ||
                        returnVal(i).PHN_AREA_NUM || '   ' ||
                        returnVal(i).PHN_NUM || '   ' ||
                        returnVal(i).ALTNT_PHN_AREA_NUM || '   ' ||
                        returnVal(i).ALTNT_PHN_NUM || '   ' ||
                        returnVal(i).DMGE_ADDR_LINE_TEXT || '   ' ||
                        returnVal(i).DMGE_CITY_NAME || '   ' ||
                        returnVal(i).DMGE_STATE_CD || '   ' ||
                        returnVal(i).DMGE_BASC_ZIP_CD || '   ' ||
                        returnVal(i).DMGE_ZIP_EXTN_CD || '   ' ||
                        returnVal(i).CNTY_NAME);
end loop;

disasterList := nbrParameterArray();
localevaluesList := charParameterArray();
DBMS_OUTPUT.NEW_LINE();
DBMS_OUTPUT.NEW_LINE();
DBMS_OUTPUT.PUT_LINE('results for get_summary_records: ' || q'[stateid => 'TX', results => summaryReturnVal]');
DBMS_OUTPUT.NEW_LINE();
fema_data.get_summary_records(stateid => 'TX',  disasterid => disasterList, localevalues => localevaluesList, results => summaryReturnVal);
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
for i in 1 .. summaryReturnVal.count loop
  dbms_output.put_line(summaryReturnVal(i).NUMBER_OF_RECORDS || '    ' ||
                      summaryReturnVal(i).HSHD_SIZE_CNT || '    ' ||
                      summaryReturnVal(i).DPNDNT_CNT || '    ' ||
                      summaryReturnVal(i).INCM_AMNT || '    ' ||
                      summaryReturnVal(i).HZRD_INSNC_AMNT || '    ' ||
                      summaryReturnVal(i).FLOOD_INSNC_AMNT || '    ' ||
                      summaryReturnVal(i).OTHER_INSNC_AMNT || '    ' ||
                      summaryReturnVal(i).REAL_PROP_LOSS_AMNT || '    ' ||
                      summaryReturnVal(i).FLOOD_DMGE_AMNT || '    ' ||
                      summaryReturnVal(i).FNDTN_DMGE_AMNT || '    ' ||
                      summaryReturnVal(i).ROOF_DMGE_AMNT || '    ' ||
                      summaryReturnVal(i).TMP_SHLTR_RCVD_AMNT || '    ' ||
                      summaryReturnVal(i).RENT_ASSTN_AMNT || '    ' ||
                      summaryReturnVal(i).REPR_AMNT || '    ' ||
                      summaryReturnVal(i).RPMT_AMNT || '    ' ||
                      summaryReturnVal(i).SBA_RCVD_AMNT || '    ' ||
                      summaryReturnVal(i).PRSNL_PROP_ASSTN_AMNT || '    ' ||
                      summaryReturnVal(i).OTHER_ASSTN_AMNT || '    ' ||
                      summaryReturnVal(i).TOTAL_DMGE_AMNT || '    ' ||
                      summaryReturnVal(i).TOTAL_ASSTN_AMNT || '    ' ||
                      summaryReturnVal(i).HUD_UNMT_NEED_AMNT);
end loop;

disasterList := nbrParameterArray();
localevaluesList := charParameterArray('Dane (County)');
DBMS_OUTPUT.NEW_LINE();
DBMS_OUTPUT.NEW_LINE();
DBMS_OUTPUT.PUT_LINE('results for get_records: ' || q'[having no disasterid value is equiv to 'ALL', stateid => 'WI', localetype => 'CNTY_NAME',   localevalues is equiv to 'Dane (County)']');
DBMS_OUTPUT.NEW_LINE();
fema_data.get_records(stateid => 'WI', localetype => 'county',  disasterid => disasterList, localevalues => localevaluesList, results => returnVal);

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
 for i in 1 .. returnVal.count loop
   dbms_output.put_line(returnVal(i).DSTER_ID || '   ' ||
                         returnVal(i).DSTER_TYPE_CD || '   ' ||
                         returnVal(i).APPLT_LAST_NAME || '   ' ||
                         returnVal(i).APPLT_FIRST_NAME || '   ' ||
                         returnVal(i).CPLCNT_FIRST_NAME || '   ' ||
                         returnVal(i).CPLCNT_LAST_NAME || '   ' ||
                         returnVal(i).APPLT_SSN_ID || '   ' ||
                         returnVal(i).PHN_AREA_NUM || '   ' ||
                         returnVal(i).PHN_NUM || '   ' ||
                         returnVal(i).ALTNT_PHN_AREA_NUM || '   ' ||
                         returnVal(i).ALTNT_PHN_NUM || '   ' ||
                         returnVal(i).DMGE_ADDR_LINE_TEXT || '   ' ||
                         returnVal(i).DMGE_CITY_NAME || '   ' ||
                         returnVal(i).DMGE_STATE_CD || '   ' ||
                         returnVal(i).DMGE_BASC_ZIP_CD || '   ' ||
                         returnVal(i).DMGE_ZIP_EXTN_CD || '   ' ||
                         returnVal(i).CNTY_NAME);
 end loop;

disasterList := nbrParameterArray();
localevaluesList := charParameterArray('Dane (County)', 'Polk (County)');
DBMS_OUTPUT.NEW_LINE();
DBMS_OUTPUT.NEW_LINE();
DBMS_OUTPUT.PUT_LINE('results for get_summary_records: ' || q'[having no disasterid is equiv to saying all, stateid => 'WI', localetype => 'county',   localevalues equiv to 'Dane (County),Polk (County)', results => summaryReturnVal]');
DBMS_OUTPUT.NEW_LINE();
fema_data.get_summary_records(stateid => 'WI', localetype => 'county',  disasterid => disasterList, localevalues => localevaluesList, results => summaryReturnVal);
dbms_output.put_line('NUMBER_OF_RECORDS' || '    ' ||
                     'TOTAL_DMGE_AMNT' || '    ' ||
                     'TOTAL_ASSTN_AMNT' || '    ' ||
                     'HUD_UNMT_NEED_AMNT' );
for i in 1 .. summaryReturnVal.count loop
   dbms_output.put_line(summaryReturnVal(i).NUMBER_OF_RECORDS || '    ' ||
                        summaryReturnVal(i).TOTAL_DMGE_AMNT || '    ' ||
                        summaryReturnVal(i).TOTAL_ASSTN_AMNT || '    ' ||
                        summaryReturnVal(i).HUD_UNMT_NEED_AMNT );
end loop;

disasterList := nbrParameterArray(4272, 1791);
localevaluesList := charParameterArray();
DBMS_OUTPUT.NEW_LINE();
DBMS_OUTPUT.NEW_LINE();
DBMS_OUTPUT.PUT_LINE('results for get_summary_records: ' || q'[disasterid equiv to '4272,1791', results => returnVal]');
DBMS_OUTPUT.NEW_LINE();
fema_data.get_summary_records( disasterid => disasterList, localevalues => localevaluesList, results => summaryReturnVal);
dbms_output.put_line('NUMBER_OF_RECORDS' || '    ' ||
                     'TOTAL_DMGE_AMNT' || '    ' ||
                     'TOTAL_ASSTN_AMNT' || '    ' ||
                     'HUD_UNMT_NEED_AMNT' );
for i in 1 .. summaryReturnVal.count loop
   dbms_output.put_line(summaryReturnVal(i).NUMBER_OF_RECORDS || '    ' ||
                        summaryReturnVal(i).TOTAL_DMGE_AMNT || '    ' ||
                        summaryReturnVal(i).TOTAL_ASSTN_AMNT || '    ' ||
                        summaryReturnVal(i).HUD_UNMT_NEED_AMNT );
end loop;

disasterList := nbrParameterArray();
localevaluesList := charParameterArray('Madison', 'Cedar Rapids');
DBMS_OUTPUT.NEW_LINE();
DBMS_OUTPUT.NEW_LINE();
DBMS_OUTPUT.PUT_LINE('results for get_records: ' || q'[ having no disasterid value is equiv to 'ALL', localetype => 'city',   localevalues is equiv to 'Madison,Cedar Rapids']');
DBMS_OUTPUT.NEW_LINE();
fema_data.get_records(localetype => 'city', disasterid => disasterList, localevalues => localevaluesList, results => returnVal);

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
 for i in 1 .. returnVal.count loop
    dbms_output.put_line(returnVal(i).DSTER_ID || '   ' ||
                         returnVal(i).DSTER_TYPE_CD || '   ' ||
                         returnVal(i).APPLT_LAST_NAME || '   ' ||
                         returnVal(i).APPLT_FIRST_NAME || '   ' ||
                         returnVal(i).CPLCNT_FIRST_NAME || '   ' ||
                         returnVal(i).CPLCNT_LAST_NAME || '   ' ||
                         returnVal(i).APPLT_SSN_ID || '   ' ||
                         returnVal(i).PHN_AREA_NUM || '   ' ||
                         returnVal(i).PHN_NUM || '   ' ||
                         returnVal(i).ALTNT_PHN_AREA_NUM || '   ' ||
                         returnVal(i).ALTNT_PHN_NUM || '   ' ||
                         returnVal(i).DMGE_ADDR_LINE_TEXT || '   ' ||
                         returnVal(i).DMGE_CITY_NAME || '   ' ||
                         returnVal(i).DMGE_STATE_CD || '   ' ||
                         returnVal(i).DMGE_BASC_ZIP_CD || '   ' ||
                         returnVal(i).DMGE_ZIP_EXTN_CD || '   ' ||
                         returnVal(i).CNTY_NAME);
 end loop;

 disasterList := nbrParameterArray();
 localevaluesList := charParameterArray('77002','77493');
 DBMS_OUTPUT.NEW_LINE();
 DBMS_OUTPUT.NEW_LINE();
 DBMS_OUTPUT.PUT_LINE('results for get_records: ' || q'[having no disasterid value is equiv to 'ALL', stateid => 'TX', localetype => 'zipcode',   localevalues is equiv to '77002,77493']');
 DBMS_OUTPUT.NEW_LINE();
 fema_data.get_records(stateid => 'TX', localetype => 'zipcode',  disasterid => disasterList, localevalues => localevaluesList, results => returnVal);

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
  for i in 1 .. returnVal.count loop
    dbms_output.put_line(returnVal(i).DSTER_ID || '   ' ||
                          returnVal(i).DSTER_TYPE_CD || '   ' ||
                          returnVal(i).APPLT_LAST_NAME || '   ' ||
                          returnVal(i).APPLT_FIRST_NAME || '   ' ||
                          returnVal(i).CPLCNT_FIRST_NAME || '   ' ||
                          returnVal(i).CPLCNT_LAST_NAME || '   ' ||
                          returnVal(i).APPLT_SSN_ID || '   ' ||
                          returnVal(i).PHN_AREA_NUM || '   ' ||
                          returnVal(i).PHN_NUM || '   ' ||
                          returnVal(i).ALTNT_PHN_AREA_NUM || '   ' ||
                          returnVal(i).ALTNT_PHN_NUM || '   ' ||
                          returnVal(i).DMGE_ADDR_LINE_TEXT || '   ' ||
                          returnVal(i).DMGE_CITY_NAME || '   ' ||
                          returnVal(i).DMGE_STATE_CD || '   ' ||
                          returnVal(i).DMGE_BASC_ZIP_CD || '   ' ||
                          returnVal(i).DMGE_ZIP_EXTN_CD || '   ' ||
                          returnVal(i).CNTY_NAME);
  end loop;

 disasterList := nbrParameterArray();
 localevaluesList := charParameterArray('77002','77493');
 DBMS_OUTPUT.NEW_LINE();
 DBMS_OUTPUT.NEW_LINE();
 DBMS_OUTPUT.PUT_LINE('results for get_summary_records: ' || q'[having no disasterid is equiv to saying all, stateid => 'TX', localetype => 'zipcode',   localevalues equiv to '77002','77493', results => summaryReturnVal]');
 DBMS_OUTPUT.NEW_LINE();
 fema_data.get_summary_records(stateid => 'TX', localetype => 'zipcode',  disasterid => disasterList, localevalues => localevaluesList, results => summaryReturnVal);
 dbms_output.put_line('NUMBER_OF_RECORDS' || '    ' ||
                      'TOTAL_DMGE_AMNT' || '    ' ||
                      'TOTAL_ASSTN_AMNT' || '    ' ||
                      'HUD_UNMT_NEED_AMNT' );
 for i in 1 .. summaryReturnVal.count loop
    dbms_output.put_line(summaryReturnVal(i).NUMBER_OF_RECORDS || '    ' ||
                         summaryReturnVal(i).TOTAL_DMGE_AMNT || '    ' ||
                         summaryReturnVal(i).TOTAL_ASSTN_AMNT || '    ' ||
                         summaryReturnVal(i).HUD_UNMT_NEED_AMNT );
 end loop;

 disasterList := nbrParameterArray();
 localevaluesList := charParameterArray('Des Moines','Cedar Rapids');
 DBMS_OUTPUT.NEW_LINE();
 DBMS_OUTPUT.NEW_LINE();
 DBMS_OUTPUT.PUT_LINE('results for get_records: ' || q'[having no disasterid value is equiv to 'ALL', localetype => 'township',   localevalues is equiv to 'Des Moines','Cedar Rapids']');
 DBMS_OUTPUT.NEW_LINE();
 fema_data.get_records(localetype => 'township',  disasterid => disasterList, localevalues => localevaluesList, results => returnVal);

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
  for i in 1 .. returnVal.count loop
    dbms_output.put_line(returnVal(i).DSTER_ID || '   ' ||
                          returnVal(i).DSTER_TYPE_CD || '   ' ||
                          returnVal(i).APPLT_LAST_NAME || '   ' ||
                          returnVal(i).APPLT_FIRST_NAME || '   ' ||
                          returnVal(i).CPLCNT_FIRST_NAME || '   ' ||
                          returnVal(i).CPLCNT_LAST_NAME || '   ' ||
                          returnVal(i).APPLT_SSN_ID || '   ' ||
                          returnVal(i).PHN_AREA_NUM || '   ' ||
                          returnVal(i).PHN_NUM || '   ' ||
                          returnVal(i).ALTNT_PHN_AREA_NUM || '   ' ||
                          returnVal(i).ALTNT_PHN_NUM || '   ' ||
                          returnVal(i).DMGE_ADDR_LINE_TEXT || '   ' ||
                          returnVal(i).DMGE_CITY_NAME || '   ' ||
                          returnVal(i).DMGE_STATE_CD || '   ' ||
                          returnVal(i).DMGE_BASC_ZIP_CD || '   ' ||
                          returnVal(i).DMGE_ZIP_EXTN_CD || '   ' ||
                          returnVal(i).CNTY_NAME);
  end loop;

 disasterList := nbrParameterArray();
 localevaluesList := charParameterArray('Des Moines','Cedar Rapids');
 DBMS_OUTPUT.NEW_LINE();
 DBMS_OUTPUT.NEW_LINE();
 DBMS_OUTPUT.PUT_LINE('results for get_summary_records: ' || q'[having no disasterid is equiv to saying all, localetype => 'township',   localevalues equiv to 'Des Moines','Cedar Rapids', results => summaryReturnVal]');
 DBMS_OUTPUT.NEW_LINE();
 fema_data.get_summary_records(localetype => 'township',  disasterid => disasterList, localevalues => localevaluesList, results => summaryReturnVal);
 dbms_output.put_line('NUMBER_OF_RECORDS' || '    ' ||
                      'TOTAL_DMGE_AMNT' || '    ' ||
                      'TOTAL_ASSTN_AMNT' || '    ' ||
                      'HUD_UNMT_NEED_AMNT' );
 for i in 1 .. summaryReturnVal.count loop
    dbms_output.put_line(summaryReturnVal(i).NUMBER_OF_RECORDS || '    ' ||
                         summaryReturnVal(i).TOTAL_DMGE_AMNT || '    ' ||
                         summaryReturnVal(i).TOTAL_ASSTN_AMNT || '    ' ||
                         summaryReturnVal(i).HUD_UNMT_NEED_AMNT );
 end loop;


  disasterList := nbrParameterArray();
  localevaluesList := charParameterArray('1100  ');
  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.PUT_LINE('results for get_records: ' || q'[having no disasterid value is equiv to 'ALL', localetype => 'tract',   localevalues is equiv to '1100  ']');
  DBMS_OUTPUT.NEW_LINE();
  fema_data.get_records(localetype => 'tract',  disasterid => disasterList, localevalues => localevaluesList, results => returnVal);

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
   for i in 1 .. returnVal.count loop
     dbms_output.put_line(returnVal(i).DSTER_ID || '   ' ||
                           returnVal(i).DSTER_TYPE_CD || '   ' ||
                           returnVal(i).APPLT_LAST_NAME || '   ' ||
                           returnVal(i).APPLT_FIRST_NAME || '   ' ||
                           returnVal(i).CPLCNT_FIRST_NAME || '   ' ||
                           returnVal(i).CPLCNT_LAST_NAME || '   ' ||
                           returnVal(i).APPLT_SSN_ID || '   ' ||
                           returnVal(i).PHN_AREA_NUM || '   ' ||
                           returnVal(i).PHN_NUM || '   ' ||
                           returnVal(i).ALTNT_PHN_AREA_NUM || '   ' ||
                           returnVal(i).ALTNT_PHN_NUM || '   ' ||
                           returnVal(i).DMGE_ADDR_LINE_TEXT || '   ' ||
                           returnVal(i).DMGE_CITY_NAME || '   ' ||
                           returnVal(i).DMGE_STATE_CD || '   ' ||
                           returnVal(i).DMGE_BASC_ZIP_CD || '   ' ||
                           returnVal(i).DMGE_ZIP_EXTN_CD || '   ' ||
                           returnVal(i).CNTY_NAME);
   end loop;

  disasterList := nbrParameterArray();
  localevaluesList := charParameterArray('1100  ');
  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.PUT_LINE('results for get_summary_records: ' || q'[having no disasterid is equiv to saying all, localetype => 'tract',   localevalues equiv to '1100  ', results => summaryReturnVal]');
  DBMS_OUTPUT.NEW_LINE();
  fema_data.get_summary_records(localetype => 'tract',  disasterid => disasterList, localevalues => localevaluesList, results => summaryReturnVal);
  dbms_output.put_line('NUMBER_OF_RECORDS' || '    ' ||
                       'TOTAL_DMGE_AMNT' || '    ' ||
                       'TOTAL_ASSTN_AMNT' || '    ' ||
                       'HUD_UNMT_NEED_AMNT' );
  for i in 1 .. summaryReturnVal.count loop
     dbms_output.put_line(summaryReturnVal(i).NUMBER_OF_RECORDS || '    ' ||
                          summaryReturnVal(i).TOTAL_DMGE_AMNT || '    ' ||
                          summaryReturnVal(i).TOTAL_ASSTN_AMNT || '    ' ||
                          summaryReturnVal(i).HUD_UNMT_NEED_AMNT );
  end loop;

END;
/

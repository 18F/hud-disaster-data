SET SERVEROUTPUT ON

DECLARE
  returnVal fema_data.recordArray;
  summaryReturnVal fema_data.summaryArray;
  disasterList VARCHAR2(2000);

BEGIN
DBMS_OUTPUT.PUT_LINE('results for get_records: ' || q'[disasterid => 'ALL', stateid => 'WI', localetype => 'CNTY_NAME',   localevalues => 'Dane (County)',
summaryCols => 'TOTAL_DMGE_AMNT,TOTAL_ASSTN_AMNT,HUD_UNMT_NEED_AMNT', results => returnVal, summaryresults => summaryReturnVal]');
DBMS_OUTPUT.NEW_LINE();
fema_data.get_records(disasterid => 'ALL', stateid => 'WI', localetype => 'CNTY_NAME',   localevalues => 'Dane (County)',
 summaryCols => 'TOTAL_DMGE_AMNT,TOTAL_ASSTN_AMNT,HUD_UNMT_NEED_AMNT', results => returnVal, summaryresults => summaryReturnVal);

for i in 1 .. summaryReturnVal.count loop
  dbms_output.put_line(summaryReturnVal(i).summaryColumn || ':  ' || summaryReturnVal(i).summaryAmount);
end loop;

DBMS_OUTPUT.NEW_LINE();
DBMS_OUTPUT.NEW_LINE();
DBMS_OUTPUT.PUT_LINE('results for get_records: ' || q'[disasterid => 'ALL', stateid => 'WI', localetype => 'CNTY_NAME',   localevalues => 'Dane (County),Polk (County)',
summaryCols => 'TOTAL_DMGE_AMNT,TOTAL_ASSTN_AMNT,HUD_UNMT_NEED_AMNT', results => returnVal, summaryresults => summaryReturnVal]');
DBMS_OUTPUT.NEW_LINE();
fema_data.get_records(disasterid => 'ALL', stateid => 'WI', localetype => 'CNTY_NAME',   localevalues => 'Dane (County),Polk (County)',
 summaryCols => 'TOTAL_DMGE_AMNT,TOTAL_ASSTN_AMNT,HUD_UNMT_NEED_AMNT', results => returnVal, summaryresults => summaryReturnVal);

for i in 1 .. summaryReturnVal.count loop
  dbms_output.put_line(summaryReturnVal(i).summaryColumn || ':  ' || summaryReturnVal(i).summaryAmount);
end loop;

DBMS_OUTPUT.NEW_LINE();
DBMS_OUTPUT.NEW_LINE();
DBMS_OUTPUT.PUT_LINE('results for get_records: ' || q'[disasterid => '4272,1791', summaryCols => 'TOTAL_DMGE_AMNT,TOTAL_ASSTN_AMNT,HUD_UNMT_NEED_AMNT', results => returnVal, summaryresults => summaryReturnVal]');
DBMS_OUTPUT.NEW_LINE();
fema_data.get_records(disasterid => '4272,1791', summaryCols => 'TOTAL_DMGE_AMNT,TOTAL_ASSTN_AMNT,HUD_UNMT_NEED_AMNT', results => returnVal, summaryresults => summaryReturnVal);
for i in 1 .. summaryReturnVal.count loop
  dbms_output.put_line(summaryReturnVal(i).summaryColumn || ':  ' || summaryReturnVal(i).summaryAmount);
end loop;


DBMS_OUTPUT.NEW_LINE();
DBMS_OUTPUT.NEW_LINE();
DBMS_OUTPUT.PUT_LINE('results for get_records: ' || q'[disasterid => '4272,1791', results => returnVal, summaryresults => summaryReturnVal]');
DBMS_OUTPUT.NEW_LINE();
fema_data.get_records(disasterid => '4272,1791', results => returnVal, summaryresults => summaryReturnVal);
for i in 1 .. returnVal.count loop
  dbms_output.put_line(returnVal(i).DSTER_ID || '   ' ||
                        returnVal(i).DSTER_TYPE_CD || '   ' ||
                        returnVal(i).APPLT_LAST_NAME || '   ' ||
                        returnVal(i).APPLT_FIRST_NAME || '   ' ||
                        returnVal(i).CPLCNT_FIRST_NAME || '   ' ||
                        returnVal(i).CPLCNT_LAST_NAME || '   ' ||
                        returnVal(i).SSN_ID || '   ' ||
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

DBMS_OUTPUT.NEW_LINE();
DBMS_OUTPUT.NEW_LINE();
DBMS_OUTPUT.PUT_LINE('results for get_records: ' || q'[disasterid => 'ALL',localetype => 'DMGE_CITY_NAME',   localevalues => 'Madison,Cedar Rapids', results => returnVal, summaryresults => summaryReturnVal]');
DBMS_OUTPUT.NEW_LINE();
fema_data.get_records(disasterid => 'ALL',localetype => 'DMGE_CITY_NAME',   localevalues => 'Madison,Cedar Rapids', results => returnVal, summaryresults => summaryReturnVal);
for i in 1 .. returnVal.count loop
  dbms_output.put_line(returnVal(i).DSTER_ID || '   ' ||
                        returnVal(i).DSTER_TYPE_CD || '   ' ||
                        returnVal(i).APPLT_LAST_NAME || '   ' ||
                        returnVal(i).APPLT_FIRST_NAME || '   ' ||
                        returnVal(i).CPLCNT_FIRST_NAME || '   ' ||
                        returnVal(i).CPLCNT_LAST_NAME || '   ' ||
                        returnVal(i).SSN_ID || '   ' ||
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


END;
/

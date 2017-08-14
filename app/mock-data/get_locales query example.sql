SET SERVEROUTPUT ON

DECLARE
  returnVal fema_data.localeArray;

BEGIN

  DBMS_OUTPUT.PUT_LINE('results for get_locales: ' || q'['TX','CNTY_NAME','ALL',returnVal]');
  DBMS_OUTPUT.NEW_LINE();
  fema_data.get_locales('TX','CNTY_NAME','ALL',returnVal);

  for i in 1 .. returnVal.count loop
   dbms_output.put_line(returnVal(i));
  end loop;

  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.PUT_LINE('results for get_locales: ' || q'[stateid => 'IA', localetype => 'DMGE_CITY_NAME', disasterid =>'4187,4289', results => returnVal]');
  DBMS_OUTPUT.NEW_LINE();
  fema_data.get_locales(stateid => 'IA', localetype => 'DMGE_CITY_NAME', disasterid =>'4187,4289', results => returnVal);

  for i in 1 .. returnVal.count loop
   dbms_output.put_line(returnVal(i));
  end loop;

  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.PUT_LINE('results for get_locales: ' || q'['IA', 'DMGE_CITY_NAME', '4272,1791', returnVal]');
  DBMS_OUTPUT.NEW_LINE();
  fema_data.get_locales('IA', 'DMGE_CITY_NAME', '4272,1791', returnVal);

  for i in 1 .. returnVal.count loop
   dbms_output.put_line(returnVal(i));
  end loop;

  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.PUT_LINE('results for get_locales: ' || q'['TX', 'DMGE_CITY_NAME', '4272,1791', returnVal]');
  DBMS_OUTPUT.NEW_LINE();
  fema_data.get_locales('TX', 'DMGE_CITY_NAME', '4272,1791', returnVal);

  for i in 1 .. returnVal.count loop
   dbms_output.put_line(returnVal(i));
  end loop;

  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.PUT_LINE('results for get_locales: ' || q'['IA', 'FCD_FIPS91_CD', '4187,4289', returnVal]');
  DBMS_OUTPUT.NEW_LINE();
  fema_data.get_locales('IA', 'FCD_FIPS91_CD', '4187,4289', returnVal);

  for i in 1 .. returnVal.count loop
   dbms_output.put_line(returnVal(i));
  end loop;

  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.PUT_LINE('results for get_locales: ' || q'[stateid => 'WI', localetype => 'FCD_FIPS91_CD', disasterid => 'ALL', results => returnVal]');
  DBMS_OUTPUT.NEW_LINE();
  fema_data.get_locales(stateid => 'WI', localetype => 'FCD_FIPS91_CD', disasterid => 'ALL', results => returnVal);

  for i in 1 .. returnVal.count loop
   dbms_output.put_line(returnVal(i));
  end loop;

END;
/

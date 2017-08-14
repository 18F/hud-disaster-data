SET SERVEROUTPUT ON

DECLARE
  returnVal fema_data.localeArray;
  disasterList VARCHAR2(2000);

BEGIN

  DBMS_OUTPUT.PUT_LINE('results for ' || q'['TX','CNTY_NAME','ALL',returnVal]');
  fema_data.get_locales('TX','CNTY_NAME','ALL',returnVal);

  for i in 1 .. returnVal.count loop
   dbms_output.put_line(returnVal(i));
  end loop;

  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.PUT_LINE('results for ' || q'[stateid => 'IA', localetype => 'DMGE_CITY_NAME', disasterid =>'4187,4289', results => returnVal]');
  fema_data.get_locales(stateid => 'IA', localetype => 'DMGE_CITY_NAME', disasterid =>'4187,4289', results => returnVal);

  for i in 1 .. returnVal.count loop
   dbms_output.put_line(returnVal(i));
  end loop;

  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.PUT_LINE('results for ' || q'['IA', 'DMGE_CITY_NAME', '4272,1791', returnVal]');
  fema_data.get_locales('IA', 'DMGE_CITY_NAME', '4272,1791', returnVal);

  for i in 1 .. returnVal.count loop
   dbms_output.put_line(returnVal(i));
  end loop;

  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.PUT_LINE('results for ' || q'['TX', 'DMGE_CITY_NAME', '4272,1791', returnVal]');
  fema_data.get_locales('TX', 'DMGE_CITY_NAME', '4272,1791', returnVal);

  for i in 1 .. returnVal.count loop
   dbms_output.put_line(returnVal(i));
  end loop;

END;
/

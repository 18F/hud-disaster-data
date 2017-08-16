SET SERVEROUTPUT ON

DECLARE
  returnVal fema_data.disasterArray;
  localeList VARCHAR2(2000);

BEGIN

  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.PUT_LINE('results for get_disasters: ' || q'[stateid => 'WI', results => returnVal]');
  DBMS_OUTPUT.NEW_LINE();
  fema_data.get_disasters(stateid => 'WI', results => returnVal);

  for i in 1 .. returnVal.count loop
   dbms_output.put_line(returnVal(i));
  end loop;

  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.PUT_LINE('results for get_disasters: ' || q'[stateid => 'IA', localetype => 'DMGE_CITY_NAME', localevalues => 'Cedar Rapids', results => returnVal]');
  DBMS_OUTPUT.NEW_LINE();
  fema_data.get_disasters(stateid => 'IA', localetype => 'DMGE_CITY_NAME', localevalues => 'Cedar Rapids', results => returnVal);

  for i in 1 .. returnVal.count loop
   dbms_output.put_line(returnVal(i));
  end loop;

  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.PUT_LINE('results for get_disasters: ' || q'[stateid => 'TX', localetype => 'CNTY_NAME', localevalues => 'Harris (County)', results => returnVal]');
  DBMS_OUTPUT.NEW_LINE();
  fema_data.get_disasters(stateid => 'TX', localetype => 'CNTY_NAME', localevalues => 'Harris (County)', results => returnVal);

  for i in 1 .. returnVal.count loop
   dbms_output.put_line(returnVal(i));
  end loop;

  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.PUT_LINE('results for get_disasters: ' || q'[stateid => 'TX', localetype => 'FCD_FIPS91_CD', localevalues => '4814115,4818115', results => returnVal]');
  DBMS_OUTPUT.NEW_LINE();
  fema_data.get_disasters(stateid => 'TX', localetype => 'FCD_FIPS91_CD', localevalues => '4814115,4818115', results => returnVal);

  for i in 1 .. returnVal.count loop
   dbms_output.put_line(returnVal(i));
  end loop;

END;
/

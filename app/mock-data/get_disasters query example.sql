SET SERVEROUTPUT ON

DECLARE
  returnVal fema_data.disasterArray;
  localeList VARCHAR2(2000);

BEGIN

  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.PUT_LINE('results for ' || q'[stateid => 'TX', results => returnVal]');
  fema_data.get_disasters(stateid => 'TX', results => returnVal);

  for i in 1 .. returnVal.count loop
   dbms_output.put_line(returnVal(i));
  end loop;

  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.PUT_LINE('results for ' || q'[stateid => 'IA', localetype => 'DMGE_CITY_NAME', localevalues => 'Cedar Rapids', results => returnVal]');
  fema_data.get_disasters(stateid => 'IA', localetype => 'DMGE_CITY_NAME', localevalues => 'Cedar Rapids', results => returnVal);

  for i in 1 .. returnVal.count loop
   dbms_output.put_line(returnVal(i));
  end loop;

END;
/

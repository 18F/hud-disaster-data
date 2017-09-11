SET SERVEROUTPUT ON

DECLARE
  returnVal disasterArray;
  localeList charParameterArray;


BEGIN

  localeList := charParameterArray();
  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.PUT_LINE('results for get_disasters: ' || q'[stateid => 'WI', localetype => 'something', localevalues => localeList, results => returnVal]');
  DBMS_OUTPUT.NEW_LINE();
  fema_data.get_disasters(stateid => 'WI', localetype => 'something', localevalues => localeList, results => returnVal);

  for i in 1 .. returnVal.count loop
   dbms_output.put_line(returnVal(i));
  end loop;

  localeList := charParameterArray();
  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.PUT_LINE('results for get_disasters: ' || q'[stateid => 'WI', results => returnVal]');
  DBMS_OUTPUT.NEW_LINE();
  fema_data.get_disasters(stateid => 'WI', localevalues => localeList, results => returnVal);

  for i in 1 .. returnVal.count loop
   dbms_output.put_line(returnVal(i));
  end loop;

  localeList := charParameterArray('Cedar Rapids');
  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.PUT_LINE('results for get_disasters: ' || q'[stateid => 'IA', localetype => 'city', localevalues => 'Cedar Rapids', results => returnVal]');
  DBMS_OUTPUT.NEW_LINE();
  fema_data.get_disasters(stateid => 'IA', localetype => 'city', localevalues => localeList, results => returnVal);

  for i in 1 .. returnVal.count loop
   dbms_output.put_line(returnVal(i));
  end loop;

  localeList := charParameterArray('Harris (County)');
  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.PUT_LINE('results for get_disasters: ' || q'[stateid => 'TX', localetype => 'county', localevalues => 'Harris (County)', results => returnVal]');
  DBMS_OUTPUT.NEW_LINE();
  fema_data.get_disasters(stateid => 'TX', localetype => 'county', localevalues => localeList, results => returnVal);

  for i in 1 .. returnVal.count loop
   dbms_output.put_line(returnVal(i));
  end loop;

  localeList := charParameterArray(4814115, 4818115);
  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.PUT_LINE('results for get_disasters: ' || q'[stateid => 'TX', localetype => 'congrdist', localevalues => '4814115,4818115', results => returnVal]');
  DBMS_OUTPUT.NEW_LINE();
  fema_data.get_disasters(stateid => 'TX', localetype => 'congrdist', localevalues => localeList, results => returnVal);

  for i in 1 .. returnVal.count loop
   dbms_output.put_line(returnVal(i));
  end loop;

END;
/

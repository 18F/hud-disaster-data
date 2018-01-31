SET SERVEROUTPUT ON

DECLARE
  returnVal SYS_REFCURSOR;
  charOutput VARCHAR2(80);


BEGIN

  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.PUT_LINE('results for get_disasters: ' || q'[stateid => 'WI', localetype => 'something', localevalues => localeList, results => returnVal]');
  DBMS_OUTPUT.NEW_LINE();
  fema_data.get_disasters(stateid => 'WI', localetype => 'something', localevalues => NULL, results => returnVal);

  LOOP
   FETCH returnVal
   INTO charOutput;
   EXIT WHEN returnVal%NOTFOUND;
   dbms_output.put_line(charOutput);
  END LOOP;

  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.PUT_LINE('results for get_disasters: ' || q'[stateid => 'WI', results => returnVal]');
  DBMS_OUTPUT.NEW_LINE();
  fema_data.get_disasters(stateid => 'WI', localevalues => NULL, results => returnVal);

  LOOP
   FETCH returnVal
   INTO charOutput;
   EXIT WHEN returnVal%NOTFOUND;
   dbms_output.put_line(charOutput);
  END LOOP;

  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.PUT_LINE('results for get_disasters: ' || q'[stateid => 'IA', localetype => 'city', localevalues => 'Cedar Rapids', results => returnVal]');
  DBMS_OUTPUT.NEW_LINE();
  fema_data.get_disasters(stateid => 'IA', localetype => 'city', localevalues => 'Cedar Rapids', results => returnVal);

  LOOP
   FETCH returnVal
   INTO charOutput;
   EXIT WHEN returnVal%NOTFOUND;
   dbms_output.put_line(charOutput);
  END LOOP;

  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.PUT_LINE('results for get_disasters: ' || q'[stateid => 'TX', localetype => 'county', localevalues => 'Harris (County)', results => returnVal]');
  DBMS_OUTPUT.NEW_LINE();
  fema_data.get_disasters(stateid => 'TX', localetype => 'county', localevalues => 'Harris (County)', results => returnVal);

  LOOP
   FETCH returnVal
   INTO charOutput;
   EXIT WHEN returnVal%NOTFOUND;
   dbms_output.put_line(charOutput);
  END LOOP;

  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.PUT_LINE('results for get_disasters: ' || q'[stateid => 'TX', localetype => 'congrdist', localevalues => '4814115,4818115', results => returnVal]');
  DBMS_OUTPUT.NEW_LINE();
  fema_data.get_disasters(stateid => 'TX', localetype => 'congrdist', localevalues => '4814115,4818115', results => returnVal);

  LOOP
   FETCH returnVal
   INTO charOutput;
   EXIT WHEN returnVal%NOTFOUND;
   dbms_output.put_line(charOutput);
  END LOOP;

  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.PUT_LINE('results for get_disasters: ' || q'[stateid => 'TX', localetype => 'zipcode', localevalues => '77550,77546', results => returnVal]');
  DBMS_OUTPUT.NEW_LINE();
  fema_data.get_disasters(stateid => 'TX', localetype => 'zipcode', localevalues => '77550,77546', results => returnVal);

  LOOP
   FETCH returnVal
   INTO charOutput;
   EXIT WHEN returnVal%NOTFOUND;
   dbms_output.put_line(charOutput);
  END LOOP;

  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.PUT_LINE('results for get_disasters: ' || q'[stateid => 'TX', localetype => 'township', localevalues => 'Texas City-League City,Corpus Christi', results => returnVal]');
  DBMS_OUTPUT.NEW_LINE();
  fema_data.get_disasters(stateid => 'TX', localetype => 'township', localevalues => 'Texas City-League City,Corpus Christi', results => returnVal);

  LOOP
   FETCH returnVal
   INTO charOutput;
   EXIT WHEN returnVal%NOTFOUND;
   dbms_output.put_line(charOutput);
  END LOOP;

  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.PUT_LINE('results for get_disasters: ' || q'[stateid => 'TX', localetype => 'tract', localevalues => '724500', '542700', results => returnVal]');
  DBMS_OUTPUT.NEW_LINE();
  fema_data.get_disasters(stateid => 'TX', localetype => 'tract', localevalues => '724500,542700', results => returnVal);

  LOOP
   FETCH returnVal
   INTO charOutput;
   EXIT WHEN returnVal%NOTFOUND;
   dbms_output.put_line(charOutput);
  END LOOP;

END;
/

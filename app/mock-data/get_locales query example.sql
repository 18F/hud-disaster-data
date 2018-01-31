SET SERVEROUTPUT ON

DECLARE
  returnVal SYS_REFCURSOR;
  charOutput VARCHAR2(80);


BEGIN
  DBMS_OUTPUT.PUT_LINE('results for fema_data.get_locales(): ' || q'['TX','county', NULL,returnVal]');
  DBMS_OUTPUT.NEW_LINE();
  fema_data.get_locales('TX','county', NULL, returnVal);

  LOOP
   FETCH returnVal
   INTO charOutput;
   EXIT WHEN returnVal%NOTFOUND;
   dbms_output.put_line(charOutput);
  END LOOP;

  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.PUT_LINE('results for fema_data.get_locales(): ' || q'[stateid => 'IA', localetype => 'county', disasterid =>'4187,4289', results => returnVal]');
  DBMS_OUTPUT.NEW_LINE();
  fema_data.get_locales(stateid => 'IA', localetype => 'county', disasterid => '4187,4289', results => returnVal);

  LOOP
   FETCH returnVal
   INTO charOutput;
   EXIT WHEN returnVal%NOTFOUND;
   dbms_output.put_line(charOutput);
  END LOOP;

  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.PUT_LINE('results for fema_data.get_locales(): ' || q'[stateid => 'IA', localetype => 'city', disasterid =>'4187,4289', results => returnVal]');
  DBMS_OUTPUT.NEW_LINE();
  fema_data.get_locales(stateid => 'IA', localetype => 'city', disasterid => '4187,4289', results => returnVal);

  LOOP
   FETCH returnVal
   INTO charOutput;
   EXIT WHEN returnVal%NOTFOUND;
   dbms_output.put_line(charOutput);
  END LOOP;

  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.PUT_LINE('results for fema_data.get_locales(): ' || q'['IA', 'city', '4272,1791', returnVal]');
  DBMS_OUTPUT.NEW_LINE();
  fema_data.get_locales('IA', 'city', '4272,1791', returnVal);

  LOOP
   FETCH returnVal
   INTO charOutput;
   EXIT WHEN returnVal%NOTFOUND;
   dbms_output.put_line(charOutput);
  END LOOP;

  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.PUT_LINE('results for fema_data.get_locales(): ' || q'['TX', 'city', '4272,1791', returnVal]');
  DBMS_OUTPUT.NEW_LINE();
  fema_data.get_locales('TX', 'city', '4272,1791', returnVal);

  LOOP
   FETCH returnVal
   INTO charOutput;
   EXIT WHEN returnVal%NOTFOUND;
   dbms_output.put_line(charOutput);
  END LOOP;

  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.PUT_LINE('results for fema_data.get_locales(): ' || q'['IA', 'congrdist', '4187,4289', returnVal]');
  DBMS_OUTPUT.NEW_LINE();
  fema_data.get_locales('IA', 'congrdist', '4187,4289', returnVal);

  LOOP
   FETCH returnVal
   INTO charOutput;
   EXIT WHEN returnVal%NOTFOUND;
   dbms_output.put_line(charOutput);
  END LOOP;

  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.PUT_LINE('results for fema_data.get_locales(): ' || q'[stateid => 'WI', localetype => 'congrdist', disasterid => NULL, results => returnVal]');
  DBMS_OUTPUT.NEW_LINE();
  fema_data.get_locales(stateid => 'WI', localetype => 'congrdist', disasterid => NULL, results => returnVal);

  LOOP
   FETCH returnVal
   INTO charOutput;
   EXIT WHEN returnVal%NOTFOUND;
   dbms_output.put_line(charOutput);
  END LOOP;


  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.PUT_LINE('results for fema_data.get_locales(): ' || q'['TX', 'zipcode', '1791,4223', returnVal]');
  DBMS_OUTPUT.NEW_LINE();
  fema_data.get_locales('TX', 'zipcode', '1791,4223', returnVal);

  LOOP
   FETCH returnVal
   INTO charOutput;
   EXIT WHEN returnVal%NOTFOUND;
   dbms_output.put_line(charOutput);
  END LOOP;

  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.PUT_LINE('results for fema_data.get_locales(): ' || q'[stateid => 'WI', localetype => 'zipcode', disasterid => NULL, results => returnVal]');
  DBMS_OUTPUT.NEW_LINE();
  fema_data.get_locales(stateid => 'WI', localetype => 'zipcode', disasterid => NULL, results => returnVal);

  LOOP
   FETCH returnVal
   INTO charOutput;
   EXIT WHEN returnVal%NOTFOUND;
   dbms_output.put_line(charOutput);
  END LOOP;

  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.PUT_LINE('results for fema_data.get_locales(): ' || q'['TX', 'township', '1791,4223', returnVal]');
  DBMS_OUTPUT.NEW_LINE();
  fema_data.get_locales('TX', 'township', '1791,4223', returnVal);

  LOOP
   FETCH returnVal
   INTO charOutput;
   EXIT WHEN returnVal%NOTFOUND;
   dbms_output.put_line(charOutput);
  END LOOP;

  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.PUT_LINE('results for fema_data.get_locales(): ' || q'[stateid => 'WI', localetype => 'township', disasterid => NULL, results => returnVal]');
  DBMS_OUTPUT.NEW_LINE();
  fema_data.get_locales(stateid => 'WI', localetype => 'township', disasterid => NULL, results => returnVal);

  LOOP
   FETCH returnVal
   INTO charOutput;
   EXIT WHEN returnVal%NOTFOUND;
   dbms_output.put_line(charOutput);
  END LOOP;

  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.PUT_LINE('results for fema_data.get_locales(): ' || q'['TX', 'tract', '1791,4223', returnVal]');
  DBMS_OUTPUT.NEW_LINE();
  fema_data.get_locales('TX', 'tract', '1791,4223', returnVal);

  LOOP
   FETCH returnVal
   INTO charOutput;
   EXIT WHEN returnVal%NOTFOUND;
   dbms_output.put_line(charOutput);
  END LOOP;

  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.PUT_LINE('results for fema_data.get_locales(): ' || q'[stateid => 'WI', localetype => 'tract', disasterid => NULL, results => returnVal]');
  DBMS_OUTPUT.NEW_LINE();
  fema_data.get_locales(stateid => 'WI', localetype => 'tract', disasterid => NULL, results => returnVal);

  LOOP
   FETCH returnVal
   INTO charOutput;
   EXIT WHEN returnVal%NOTFOUND;
   dbms_output.put_line(charOutput);
  END LOOP;

END;
/

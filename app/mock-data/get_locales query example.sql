SET SERVEROUTPUT ON

DECLARE
  returnVal localeArray;
  disasterId nbrParameterArray;

BEGIN
  disasterid := nbrParameterArray();
  DBMS_OUTPUT.PUT_LINE('results for fema_data.get_locales(): ' || q'['TX','county','ALL',returnVal]');
  DBMS_OUTPUT.NEW_LINE();
  fema_data.get_locales('TX','county', disasterId, returnVal);

  for i in returnVal.first .. returnVal.last loop
   dbms_output.put_line(returnVal(i));
  end loop;

  disasterId := nbrParameterArray(4187,4289);
  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.PUT_LINE('results for fema_data.get_locales(): ' || q'[stateid => 'IA', localetype => 'county', disasterid =>'4187,4289', results => returnVal]');
  DBMS_OUTPUT.NEW_LINE();
  fema_data.get_locales(stateid => 'IA', localetype => 'county', disasterid => disasterId, results => returnVal);

  for i in 1 .. returnVal.count loop
   dbms_output.put_line(returnVal(i));
  end loop;

  disasterId := nbrParameterArray(4187,4289);
  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.PUT_LINE('results for fema_data.get_locales(): ' || q'[stateid => 'IA', localetype => 'city', disasterid =>'4187,4289', results => returnVal]');
  DBMS_OUTPUT.NEW_LINE();
  fema_data.get_locales(stateid => 'IA', localetype => 'city', disasterid => disasterid, results => returnVal);

  for i in 1 .. returnVal.count loop
   dbms_output.put_line(returnVal(i));
  end loop;

  disasterId := nbrParameterArray(4272,1791);
  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.PUT_LINE('results for fema_data.get_locales(): ' || q'['IA', 'city', '4272,1791', returnVal]');
  DBMS_OUTPUT.NEW_LINE();
  fema_data.get_locales('IA', 'city', disasterid, returnVal);

  for i in 1 .. returnVal.count loop
   dbms_output.put_line(returnVal(i));
  end loop;

  disasterId := nbrParameterArray(4272,1791);
  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.PUT_LINE('results for fema_data.get_locales(): ' || q'['TX', 'city', '4272,1791', returnVal]');
  DBMS_OUTPUT.NEW_LINE();
  fema_data.get_locales('TX', 'city', disasterid, returnVal);

  for i in 1 .. returnVal.count loop
   dbms_output.put_line(returnVal(i));
  end loop;

  disasterId := nbrParameterArray(4187,4289);
  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.PUT_LINE('results for fema_data.get_locales(): ' || q'['IA', 'congrdist', '4187,4289', returnVal]');
  DBMS_OUTPUT.NEW_LINE();
  fema_data.get_locales('IA', 'congrdist', disasterid, returnVal);

  for i in 1 .. returnVal.count loop
   dbms_output.put_line(returnVal(i));
  end loop;

  disasterid.DELETE;
  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.PUT_LINE('results for fema_data.get_locales(): ' || q'[stateid => 'WI', localetype => 'congrdist', disasterid => 'ALL', results => returnVal]');
  DBMS_OUTPUT.NEW_LINE();
  fema_data.get_locales(stateid => 'WI', localetype => 'congrdist', disasterid => disasterid, results => returnVal);

  for i in 1 .. returnVal.count loop
   dbms_output.put_line(returnVal(i));
  end loop;


  disasterId := nbrParameterArray('1791', '4223');
  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.PUT_LINE('results for fema_data.get_locales(): ' || q'['TX', 'zipcode', '77550,77546', returnVal]');
  DBMS_OUTPUT.NEW_LINE();
  fema_data.get_locales('TX', 'zipcode', disasterid, returnVal);

  for i in 1 .. returnVal.count loop
   dbms_output.put_line(returnVal(i));
  end loop;

  disasterid.DELETE;
  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.PUT_LINE('results for fema_data.get_locales(): ' || q'[stateid => 'WI', localetype => 'zipcode', disasterid => 'ALL', results => returnVal]');
  DBMS_OUTPUT.NEW_LINE();
  fema_data.get_locales(stateid => 'WI', localetype => 'zipcode', disasterid => disasterid, results => returnVal);

  for i in 1 .. returnVal.count loop
   dbms_output.put_line(returnVal(i));
  end loop;


  disasterId := nbrParameterArray('1791', '4223');
  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.PUT_LINE('results for fema_data.get_locales(): ' || q'['TX', 'township', '77550,77546', returnVal]');
  DBMS_OUTPUT.NEW_LINE();
  fema_data.get_locales('TX', 'township', disasterid, returnVal);

  for i in 1 .. returnVal.count loop
   dbms_output.put_line(returnVal(i));
  end loop;

  disasterid.DELETE;
  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.PUT_LINE('results for fema_data.get_locales(): ' || q'[stateid => 'WI', localetype => 'township', disasterid => 'ALL', results => returnVal]');
  DBMS_OUTPUT.NEW_LINE();
  fema_data.get_locales(stateid => 'WI', localetype => 'township', disasterid => disasterid, results => returnVal);

  for i in 1 .. returnVal.count loop
   dbms_output.put_line(returnVal(i));
  end loop;


  disasterId := nbrParameterArray('1791', '4223');
  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.PUT_LINE('results for fema_data.get_locales(): ' || q'['TX', 'tract', '77550,77546', returnVal]');
  DBMS_OUTPUT.NEW_LINE();
  fema_data.get_locales('TX', 'tract', disasterid, returnVal);

  for i in 1 .. returnVal.count loop
   dbms_output.put_line(returnVal(i));
  end loop;

  disasterid.DELETE;
  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.PUT_LINE('results for fema_data.get_locales(): ' || q'[stateid => 'WI', localetype => 'tract', disasterid => 'ALL', results => returnVal]');
  DBMS_OUTPUT.NEW_LINE();
  fema_data.get_locales(stateid => 'WI', localetype => 'tract', disasterid => disasterid, results => returnVal);

  for i in 1 .. returnVal.count loop
   dbms_output.put_line(returnVal(i));
  end loop;

END;
/

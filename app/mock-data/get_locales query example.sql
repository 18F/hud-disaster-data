SET SERVEROUTPUT ON

DECLARE
  returnVal fema_data.localeArray;
  disasterId fema_data.nbrParameterArray;

BEGIN

  disasterid.DELETE;
  DBMS_OUTPUT.PUT_LINE('results for fema_data.get_locales(): ' || q'['TX','county','ALL',returnVal]');
  DBMS_OUTPUT.NEW_LINE();
  fema_data.get_locales('TX','county', disasterId, returnVal);

  for i in returnVal.first .. returnVal.last loop
   dbms_output.put_line(returnVal(i));
  end loop;

  disasterId(1) := 4187;
  disasterId(2) := 4289;
  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.PUT_LINE('results for fema_data.get_locales(): ' || q'[stateid => 'IA', localetype => 'county', disasterid =>'4187,4289', results => returnVal]');
  DBMS_OUTPUT.NEW_LINE();
  fema_data.get_locales(stateid => 'IA', localetype => 'county', disasterid => disasterId, results => returnVal);

  for i in 1 .. returnVal.count loop
   dbms_output.put_line(returnVal(i));
  end loop;

  disasterId(1) := 4187;
  disasterId(2) := 4289;
  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.PUT_LINE('results for fema_data.get_locales(): ' || q'[stateid => 'IA', localetype => 'city', disasterid =>'4187,4289', results => returnVal]');
  DBMS_OUTPUT.NEW_LINE();
  fema_data.get_locales(stateid => 'IA', localetype => 'city', disasterid => disasterid, results => returnVal);

  for i in 1 .. returnVal.count loop
   dbms_output.put_line(returnVal(i));
  end loop;

  disasterId(1) := 4272;
  disasterId(2) := 1791;
  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.PUT_LINE('results for fema_data.get_locales(): ' || q'['IA', 'city', '4272,1791', returnVal]');
  DBMS_OUTPUT.NEW_LINE();
  fema_data.get_locales('IA', 'city', disasterid, returnVal);

  for i in 1 .. returnVal.count loop
   dbms_output.put_line(returnVal(i));
  end loop;

  disasterId(1) := 4272;
  disasterId(2) := 1791;
  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.NEW_LINE();
  DBMS_OUTPUT.PUT_LINE('results for fema_data.get_locales(): ' || q'['TX', 'city', '4272,1791', returnVal]');
  DBMS_OUTPUT.NEW_LINE();
  fema_data.get_locales('TX', 'city', disasterid, returnVal);

  for i in 1 .. returnVal.count loop
   dbms_output.put_line(returnVal(i));
  end loop;

  disasterId(1) := 4187;
  disasterId(2) := 4289;
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

END;
/

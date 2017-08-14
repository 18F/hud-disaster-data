SET SERVEROUTPUT ON

DECLARE
  returnVal fema_data.resultArray;
  disasterList VARCHAR2(2000);

BEGIN

 fema_data.get_locales('TX','CNTY_NAME','ALL',returnVal);

 DBMS_OUTPUT.PUT_LINE('results for get_locales ''TX'',''CNTY_NAME'',''ALL'' ');
 for i in 1 .. returnVal.count loop
   dbms_output.put_line(returnVal(i));
 end loop;

 disasterList := '4272,1791';
 fema_data.get_locales('IA', 'DMGE_CITY_NAME', disasterList, returnVal);

 DBMS_OUTPUT.NEW_LINE();
 DBMS_OUTPUT.PUT_LINE('results for get_locales ''IA'',''DMGE_CITY_NAME'',' || disasterList);
 for i in 1 .. returnVal.count loop
   dbms_output.put_line(returnVal(i));
 end loop;

 disasterList := '4272,1791';
 fema_data.get_locales('TX', 'DMGE_CITY_NAME', disasterList, returnVal);

 DBMS_OUTPUT.NEW_LINE();
 DBMS_OUTPUT.PUT_LINE('results for get_locales ''TX'',''DMGE_CITY_NAME'',' || disasterList);
 for i in 1 .. returnVal.count loop
   dbms_output.put_line(returnVal(i));
 end loop;

END;
/

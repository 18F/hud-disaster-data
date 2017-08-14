SET SERVEROUTPUT ON

DECLARE
  returnVal fema_data.resultArray;
  localeList VARCHAR2(2000);

BEGIN

 fema_data.get_disasters('TX',null, null, returnVal);

 DBMS_OUTPUT.NEW_LINE();
 DBMS_OUTPUT.PUT_LINE('results for get_disasters ''TX'', null, null ');
 for i in 1 .. returnVal.count loop
   dbms_output.put_line(returnVal(i));
 end loop;

 localeList := q'['Cedar Rapids']';
 fema_data.get_disasters('IA', 'DMGE_CITY_NAME', localeList, returnVal);

 DBMS_OUTPUT.NEW_LINE();
 DBMS_OUTPUT.PUT_LINE('results for get_disasters ''IA'',''DMGE_CITY_NAME'',' || localeList);
 for i in 1 .. returnVal.count loop
   dbms_output.put_line(returnVal(i));
 end loop;

END;
/

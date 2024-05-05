use projectsem4;

DELIMITER $	
DROP PROCEDURE IF EXISTS is_valid_booking_time $
CREATE PROCEDURE is_valid_booking_time (IN p_json_data json, OUT p_is_valid BOOLEAN)
BEGIN
   SET v_start_time = JSON_EXTRACT(jsonData, '$.startTime');
  -- Lấy và gán giá trị cho endTime từ JSON object
  SET v_end_time = JSON_EXTRACT(jsonData, '$.endTime');
  -- Lấy và gán giá trị cho userId từ JSON object
  SET v_user_id = JSON_EXTRACT(jsonData, '$.userId');
  SET v_count = 0;
  SELECT COUNT(*)
  INTO v_count
  FROM working_time
  WHERE JSON_CONTAINS(`event_dates`, CAST(input_datetime AS JSON), '$');

  IF  rowCount > 0 THEN
    SET result = TRUE;
  ELSE
    SET result = FALSE;
  END IF;
END $
DELIMITER ;



